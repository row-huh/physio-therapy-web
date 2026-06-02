/**
 * DTW Scorer
 *
 * Scores a patient's single repetition against a learned reference template
 * using Dynamic Time Warping. Produces a multi-dimensional score:
 *
 *   - shape      (35%): DTW path distance on the normalised primary signal
 *   - rangeOfMotion (25%): how close the patient's ROM is to the reference
 *   - tempo      (15%): duration ratio penalty
 *   - secondary  (15%): deviation on non-primary active features
 *   - symmetry   (10%): left/right difference (only when bilateral=true)
 *
 * When bilateral=false the symmetry weight is redistributed to shape and ROM.
 */

import type { PoseV2Template } from "./template-learner"
import type { FeatureFrame } from "./pose-features"

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

export interface RepScore {
  overall: number       // 0-100
  shape: number         // 0-100
  rangeOfMotion: number // 0-100
  tempo: number         // 0-100
  symmetry: number      // 0-100 (only meaningful when bilateral=true)
  secondary: number     // 0-100
  warnings: string[]
}

// --------------------------------------------------------------------------
// Bounded DTW (Sakoe-Chiba band)
// --------------------------------------------------------------------------

/**
 * Computes the DTW distance between two sequences with a Sakoe-Chiba band.
 *
 * window_ratio = 0.35: wide enough for elderly/post-surgical patients who
 * move significantly slower or faster than the reference.
 *
 * If rep_duration_cv (coefficient of variation) is provided, the window
 * is widened adaptively: window_ratio = min(0.5, 1.5 × cv).
 */
export function boundedDtwDistance(
  a: number[],
  b: number[],
  windowRatio: number = 0.35,
): number {
  const n = a.length
  const m = b.length
  if (n === 0 || m === 0) return 0

  const w = Math.max(Math.abs(n - m), Math.floor(Math.max(n, m) * windowRatio))

  // Use a flat array for performance
  const INF = 1e9
  const dtw = new Float64Array((n + 1) * (m + 1)).fill(INF)

  const idx = (i: number, j: number) => i * (m + 1) + j
  dtw[idx(0, 0)] = 0

  for (let i = 1; i <= n; i++) {
    const jMin = Math.max(1, i - w)
    const jMax = Math.min(m, i + w)
    for (let j = jMin; j <= jMax; j++) {
      const cost = Math.abs(a[i - 1] - b[j - 1])
      const prev = Math.min(
        dtw[idx(i - 1, j)],
        dtw[idx(i, j - 1)],
        dtw[idx(i - 1, j - 1)],
      )
      dtw[idx(i, j)] = cost + prev
    }
  }

  // Normalise by path length
  const dist = dtw[idx(n, m)]
  return dist === INF ? 1e6 : dist / (n + m)
}

// --------------------------------------------------------------------------
// Adaptive window from template rep-duration variability
// --------------------------------------------------------------------------

/**
 * The reference's full per-rep cycle period in seconds (peak-to-peak), which is
 * comparable to the patient's rest→peak→rest scoring window. Falls back to the
 * average period derived from the total duration / rep count.
 */
function referenceRepPeriod(template: PoseV2Template): number {
  const segs = template.repSegments
  if (segs.length >= 2) {
    const periods: number[] = []
    for (let i = 1; i < segs.length; i++) {
      periods.push(segs[i].peakTime - segs[i - 1].peakTime)
    }
    periods.sort((a, b) => a - b)
    const median = periods[Math.floor(periods.length / 2)]
    if (median > 0) return median
  }
  const reps = Math.max(1, template.recommendedReps)
  return template.totalDuration > 0 ? template.totalDuration / reps : 1
}

function adaptiveWindowRatio(template: PoseV2Template): number {
  const durations = template.repSegments.map((r) => r.duration)
  if (durations.length < 2) return 0.35
  const mean = durations.reduce((a, b) => a + b, 0) / durations.length
  const std = Math.sqrt(durations.reduce((sum, d) => sum + (d - mean) ** 2, 0) / durations.length)
  const cv = mean > 0 ? std / mean : 0
  return Math.min(0.5, Math.max(0.35, 1.5 * cv))
}

// --------------------------------------------------------------------------
// Score extraction helpers
// --------------------------------------------------------------------------

function extractValues(
  frames: FeatureFrame[],
  startIdx: number,
  endIdx: number,
  feature: string,
): number[] {
  return frames
    .slice(Math.max(0, startIdx), Math.min(frames.length, endIdx + 1))
    .map((f) => f.values[feature] ?? NaN)
    .filter((v) => !isNaN(v))
}

/**
 * Anchor `values` at their own minimum but divide by the REFERENCE range, so
 * amplitude differences survive into the (otherwise scale-free) DTW comparison.
 */
function scaleByReferenceRange(values: number[], reference: number[]): number[] {
  const min = Math.min(...values)
  const refRange = Math.max(...reference) - Math.min(...reference) || 1
  return values.map((v) => (v - min) / refRange)
}

// --------------------------------------------------------------------------
// Main scorer
// --------------------------------------------------------------------------

/**
 * Score a patient's completed rep (identified by frame indices) against
 * the reference template.
 *
 * @param referenceTemplate  The v2 template learned from the doctor's video
 * @param patientFrames      Full session frame buffer (same format as FeatureFrame[])
 * @param startIdx           Index into patientFrames where the rep began
 * @param endIdx             Index into patientFrames where the rep ended
 */
export function scoreRepWithDtw(
  referenceTemplate: PoseV2Template,
  patientFrames: FeatureFrame[],
  startIdx: number,
  endIdx: number,
): RepScore {
  const warnings: string[] = []

  if (patientFrames.length < 10 || endIdx - startIdx < 5) {
    return { overall: 0, shape: 0, rangeOfMotion: 0, tempo: 0, symmetry: 50, secondary: 0, warnings: ["Insufficient frames for DTW scoring."] }
  }

  const ps = referenceTemplate.primarySignal
  if (!ps?.feature) {
    return { overall: 0, shape: 0, rangeOfMotion: 0, tempo: 0, symmetry: 50, secondary: 0, warnings: ["Template has no primary signal."] }
  }

  // ── Build reference rep series from primarySignal.series ─────────────────
  // Use all frames that fall inside the median rep boundaries
  const refSegments = referenceTemplate.repSegments
  const refSeries = referenceTemplate.primarySignal.series
  if (refSeries.length === 0) {
    warnings.push("Reference template has no signal series — shape scoring unavailable.")
  }

  // Reference: concatenate median-duration rep segment values
  const medianRepCount = Math.max(1, Math.round(refSegments.length / 2))
  const medianRepSegment = refSegments[medianRepCount - 1] ?? refSegments[0]

  const refValues = medianRepSegment
    ? refSeries
        .filter(
          (p) =>
            p.timestamp >= medianRepSegment.startTime &&
            p.timestamp <= medianRepSegment.endTime,
        )
        .map((p) => p.value)
    : refSeries.map((p) => p.value)

  // Patient rep values from the feature frames
  const patValues = extractValues(patientFrames, startIdx, endIdx, ps.feature)

  if (patValues.length === 0) {
    return { overall: 0, shape: 0, rangeOfMotion: 0, tempo: 0, symmetry: 50, secondary: 0, warnings: ["No patient angle data for this rep."] }
  }

  // ── Shape score ───────────────────────────────────────────────────────────
  let shapeScore = 50
  if (refValues.length > 0 && patValues.length > 0) {
    const windowRatio = adaptiveWindowRatio(referenceTemplate)
    // Scale BOTH signals by the reference amplitude (each anchored at its own
    // minimum so a vertical offset doesn't matter). Using the reference range
    // — instead of normalising each signal to its own [0,1] — means a barely-
    // moving limb stays near-flat and accrues a large DTW distance, rather than
    // being rescaled to mimic the reference shape. This couples movement size
    // into the shape score (a separate ROM term still applies below).
    const refScaled = scaleByReferenceRange(refValues, refValues)
    const patScaled = scaleByReferenceRange(patValues, refValues)
    const dtwDist = boundedDtwDistance(refScaled, patScaled, windowRatio)
    // dtwDist on reference-normalised signals: max meaningful distance ~1.0.
    // Map to 0-100 (distance of 0 = 100, distance ≥ 0.5 = 0).
    shapeScore = Math.round(Math.max(0, 100 - dtwDist * 200))
  }

  // ── Range of Motion score ─────────────────────────────────────────────────
  const patMin = Math.min(...patValues)
  const patMax = Math.max(...patValues)
  const patAmplitude = patMax - patMin

  const refAmplitude = ps.amplitude || 1
  const romRatio = patAmplitude / refAmplitude
  // 100% ROM = perfect, penalise below and slightly above
  const romScore = Math.round(Math.max(0, Math.min(100, 100 - Math.abs(romRatio - 1.0) * 80)))

  // ── Tempo score ───────────────────────────────────────────────────────────
  // Compare durations in SECONDS, not frame counts — the live patient loop
  // (~60fps via requestAnimationFrame) and the reference (analysed at ~30fps)
  // have different frame rates, so a frame-count ratio would penalise tempo on
  // every rep even when the timing matches.
  //
  // The patient window is a full rest→peak→rest cycle, so it must be compared
  // against the reference's full cycle PERIOD (peak-to-peak), not the thresholded
  // active span of a single repSegment — otherwise even a correct rep is
  // mis-scored against a shorter reference span.
  const patDurationSec =
    (patientFrames[endIdx]?.timestamp ?? 0) - (patientFrames[startIdx]?.timestamp ?? 0)
  const refDurationSec = referenceRepPeriod(referenceTemplate)
  const tempoRatio = refDurationSec > 0 ? patDurationSec / refDurationSec : 1
  // Allow ±50% without penalty, penalise beyond that
  const tempoDeviation = Math.max(0, Math.abs(tempoRatio - 1.0) - 0.5)
  const tempoScore = Math.round(Math.max(0, 100 - tempoDeviation * 200))

  // ── Symmetry score ────────────────────────────────────────────────────────
  let symmetryScore = 100
  if (referenceTemplate.bilateral) {
    const primaryName = ps.feature
    // Try to find the mirror feature
    const mirrorName = primaryName.startsWith("left_")
      ? primaryName.replace("left_", "right_")
      : primaryName.startsWith("right_")
        ? primaryName.replace("right_", "left_")
        : null

    if (mirrorName) {
      const patPrimary = extractValues(patientFrames, startIdx, endIdx, primaryName)
      const patMirror = extractValues(patientFrames, startIdx, endIdx, mirrorName)
      if (patPrimary.length > 0 && patMirror.length > 0) {
        const primaryAmp = Math.max(...patPrimary) - Math.min(...patPrimary)
        const mirrorAmp = Math.max(...patMirror) - Math.min(...patMirror)
        const asymmetry = Math.abs(primaryAmp - mirrorAmp) / Math.max(primaryAmp, mirrorAmp, 1)
        symmetryScore = Math.round(Math.max(0, 100 - asymmetry * 150))
      }
    }
  }

  // ── Secondary feature score ───────────────────────────────────────────────
  const activeFeatures = referenceTemplate.activeFeatures ?? []
  const secondaryFeatures = activeFeatures.filter((f) => f.name !== ps.feature)
  let secondaryScore = 100

  if (secondaryFeatures.length > 0) {
    const scores: number[] = []
    for (const feat of secondaryFeatures) {
      const refFeatureSeries = referenceTemplate.primarySignal.series // fallback
      // Use the rest/peak phase means as reference
      const restPhase = referenceTemplate.phases.find((p) => p.id === "rest")
      const peakPhase = referenceTemplate.phases.find((p) => p.id === "peak")
      const refRestVal = restPhase?.featureMeans[feat.name]
      const refPeakVal = peakPhase?.featureMeans[feat.name]

      if (refRestVal === undefined || refPeakVal === undefined) continue

      const patFeatValues = extractValues(patientFrames, startIdx, endIdx, feat.name)
      if (patFeatValues.length === 0) continue

      const patFeatMin = Math.min(...patFeatValues)
      const patFeatMax = Math.max(...patFeatValues)

      const refFeatAmp = Math.abs(refPeakVal - refRestVal) || 1
      const patFeatAmp = patFeatMax - patFeatMin

      const featScore = Math.max(0, 100 - (Math.abs(patFeatAmp - refFeatAmp) / refFeatAmp) * 80)
      scores.push(featScore)
    }
    if (scores.length > 0) {
      secondaryScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    }
  }

  // ── Weighted overall ──────────────────────────────────────────────────────
  // Base weights. Components that don't apply to this exercise (symmetry when
  // not bilateral; secondary when there are no secondary features) would
  // otherwise contribute a free ~100, padding every score — so their weight is
  // redistributed onto the components that actually measure the movement
  // (shape 60% / ROM 40%). Without this, a single-joint exercise gave ~30 free
  // points to any motion at all.
  const hasSymmetry = referenceTemplate.bilateral
  const hasSecondary = secondaryFeatures.length > 0

  let wShape = 0.35
  let wROM = 0.25
  const wTempo = 0.15
  const wSecondary = hasSecondary ? 0.15 : 0
  const wSymmetry = hasSymmetry ? 0.1 : 0

  const freed = (hasSecondary ? 0 : 0.15) + (hasSymmetry ? 0 : 0.1)
  wShape += freed * 0.6
  wROM += freed * 0.4

  const overall =
    shapeScore * wShape +
    romScore * wROM +
    tempoScore * wTempo +
    secondaryScore * wSecondary +
    symmetryScore * wSymmetry

  return {
    overall: Math.round(Math.max(0, Math.min(100, overall))),
    shape: shapeScore,
    rangeOfMotion: romScore,
    tempo: tempoScore,
    symmetry: symmetryScore,
    secondary: secondaryScore,
    warnings,
  }
}
