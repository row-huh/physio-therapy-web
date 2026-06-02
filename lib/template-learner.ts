/**
 * Template Learner — v2
 *
 * Learns a pose template from a reference video's joint angle time series.
 * Replaces the K-means clustering approach with a signal-processing pipeline:
 *
 *   1. Group frames & flag dropout
 *   2. Select active features (amplitude + visibility filters)
 *   3. Pick primary cyclic signal
 *   4. Estimate rest baseline (rolling-variance window + mode fallback)
 *   5. Detect movement direction
 *   6. Detect local peaks (prominence-based)
 *   7. Compute adaptive thresholds
 *   8. Detect complete reps via state machine
 *   9. Build phase prototypes from clean rep segments
 *  10. Compute cycle consistency & confidence
 *
 * Output: PoseV2Template (includes legacy LearnedExerciseTemplate fields so
 * existing callers that read .states / .repSequence / .recommendedReps still work).
 */

import type { JointAngle } from "./pose-analyzer"
import {
  groupJointAnglesByFrame,
  flagDropoutFrames,
  calculateFeatureStats,
  smoothSeries,
  interpolateMissingValues,
  type FeatureFrame,
  type FeatureStats,
} from "./pose-features"

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

export interface PrimarySignalPoint {
  timestamp: number
  value: number
  normalized: number
}

export interface PrimarySignal {
  feature: string
  direction: "increasing" | "decreasing"
  restValue: number
  peakValue: number
  amplitude: number
  restThreshold: number
  peakThreshold: number
  series: PrimarySignalPoint[]
}

export interface RepSegment {
  startTime: number
  peakTime: number
  endTime: number
  startIndex: number
  peakIndex: number
  endIndex: number
  amplitude: number
  duration: number
  hasDropout: boolean
}

export interface PhasePrototype {
  id: "rest" | "move-out" | "peak" | "return"
  name: string
  normalizedTime: number
  featureMeans: Record<string, number>
}

export interface TemplateQuality {
  confidence: number
  warnings: string[]
  visibilityStats: Record<string, number>
  cycleConsistency: number
  amplitude: number
  phaseSeparation: number
  dropoutRatio: number
}

/**
 * V2 template. Also contains legacy fields (states, transitions, repSequence,
 * totalDuration, recommendedReps, metadata) so that existing comparison /
 * progress-scorer / comparison-recorder code continues to work without changes.
 */
export interface PoseV2Template {
  templateVersion: 2
  exerciseName: string
  exerciseType: string
  jointGroup: string
  bilateral: boolean

  features: FeatureFrame[]
  activeFeatures: FeatureStats[]
  primarySignal: PrimarySignal
  repSegments: RepSegment[]
  phases: PhasePrototype[]
  quality: TemplateQuality

  // --- Legacy-compatible fields ---
  states: LegacyState[]
  transitions: unknown[]
  repSequence: string[]
  totalDuration: number
  recommendedReps: number
  metadata: {
    detectedAt: string
    videoLength: number
    fps: number
    confidence: number
  }
}

export interface LegacyState {
  id: string
  name: string
  description: string
  angleRanges: Record<string, { mean: number; min: number; max: number; stdDev: number }>
  occurrences: { startTime: number; endTime: number; duration: number }[]
  representativeTimestamp: number
}

// --------------------------------------------------------------------------
// RepDetector
// --------------------------------------------------------------------------

export class RepDetector {
  private values: number[]
  private frames: FeatureFrame[]
  private fps: number

  constructor(
    frames: FeatureFrame[],
    private primaryFeature: string,
    private direction: "increasing" | "decreasing",
  ) {
    this.frames = frames
    this.values = smoothSeries(
      interpolateMissingValues(frames, primaryFeature),
      2,
    )
    // Estimate fps from frame timestamps
    const ts = frames.map((f) => f.timestamp)
    this.fps =
      ts.length > 1
        ? Math.round(ts.length / (ts[ts.length - 1] - ts[0]))
        : 30
  }

  /** Rolling-variance window + histogram mode, anchored to the rest pole. */
  estimateRestBaseline(): number {
    const values = this.values
    if (values.length === 0) return 0

    // The "rest pole" is the global extremum opposite the direction of movement.
    const globalMin = Math.min(...values)
    const globalMax = Math.max(...values)
    const restPole = this.direction === "increasing" ? globalMin : globalMax
    const midline = (globalMin + globalMax) / 2

    // A smooth oscillation is just as flat (and just as histogram-dense) at its
    // peak as at its trough, so a naive lowest-variance / mode estimate can lock
    // onto the PEAK — which collapses the rep-detection thresholds and yields
    // zero reps (notably for quick ~1s/rep movements). Guard every candidate to
    // the rest side of the midline so we can only ever estimate a rest position.
    const onRestSide =
      this.direction === "increasing"
        ? (v: number) => v <= midline
        : (v: number) => v >= midline

    const windowSize = Math.min(10, values.length)

    // Rolling variance — restricted to windows whose mean sits on the rest side.
    let bestWindowMean: number | null = null
    let bestVariance = Infinity
    for (let i = 0; i <= values.length - windowSize; i++) {
      const win = values.slice(i, i + windowSize)
      const mean = win.reduce((a, b) => a + b, 0) / windowSize
      if (!onRestSide(mean)) continue
      const variance = win.reduce((sum, v) => sum + (v - mean) ** 2, 0) / windowSize
      if (variance < bestVariance) {
        bestVariance = variance
        bestWindowMean = mean
      }
    }

    // Histogram mode (bin width = 2°), also restricted to the rest side.
    const binWidth = 2
    const bins = new Map<number, number>()
    values.forEach((v) => {
      if (!onRestSide(v)) return
      const bin = Math.round(v / binWidth) * binWidth
      bins.set(bin, (bins.get(bin) ?? 0) + 1)
    })
    let modeBin: number | null = null
    let modeCount = 0
    bins.forEach((count, bin) => {
      if (count > modeCount) { modeCount = count; modeBin = bin }
    })

    // Percentile near the rest pole — a robust fallback for continuous motion
    // with no held rest, where neither the flat-window nor the mode is reliable.
    const sorted = [...values].sort((a, b) => a - b)
    const restPercentile =
      this.direction === "increasing"
        ? sorted[Math.floor(sorted.length * 0.1)]
        : sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.9))]

    // Of the available candidates, pick the one closest to the rest pole.
    const candidates = [bestWindowMean, modeBin, restPercentile].filter(
      (c): c is number => c !== null,
    )
    if (candidates.length === 0) return restPole
    return candidates.reduce((best, c) =>
      Math.abs(c - restPole) < Math.abs(best - restPole) ? c : best,
    )
  }

  /** Local peak detection with minimum prominence (10°) and separation (0.3 s) */
  detectLocalPeaks(): number[] {
    const values = this.values
    const isMaxima = this.direction === "increasing"
    const minSep = Math.max(2, Math.round(0.3 * this.fps))
    const minProminence = 10 // degrees

    const candidates: number[] = []

    for (let i = 1; i < values.length - 1; i++) {
      const prev = values[i - 1]
      const curr = values[i]
      const next = values[i + 1]
      const isPeak = isMaxima ? curr > prev && curr >= next : curr < prev && curr <= next
      if (!isPeak) continue

      // Prominence: how much the peak stands above nearby baseline
      const half = Math.min(25, i, values.length - 1 - i)
      const window = values.slice(i - half, i + half + 1)
      const localBaseline = isMaxima ? Math.min(...window) : Math.max(...window)
      if (Math.abs(curr - localBaseline) < minProminence) continue

      candidates.push(i)
    }

    // Enforce minimum separation (keep the better one when too close)
    const peaks: number[] = []
    for (const idx of candidates) {
      if (peaks.length === 0 || idx - peaks[peaks.length - 1] >= minSep) {
        peaks.push(idx)
      } else {
        const last = peaks[peaks.length - 1]
        if (isMaxima ? values[idx] > values[last] : values[idx] < values[last]) {
          peaks[peaks.length - 1] = idx
        }
      }
    }

    return peaks
  }

  computeThresholds(
    restValue: number,
    peakValue: number,
  ): { restThreshold: number; peakThreshold: number } {
    const range = peakValue - restValue
    return {
      restThreshold: restValue + 0.35 * range,
      peakThreshold: restValue + 0.70 * range,
    }
  }

  /** State machine rep detector */
  detectReps(
    restValue: number,
    peakValue: number,
    restThreshold: number,
    peakThreshold: number,
  ): RepSegment[] {
    const values = this.values
    const frames = this.frames
    const isIncreasing = this.direction === "increasing"
    const minDurationFrames = Math.round(0.35 * this.fps)
    const minAmplitude = 0.5 * Math.abs(peakValue - restValue)

    type Phase = "idle" | "moving_to_peak" | "returning"
    let phase: Phase = "idle"
    let startIdx = 0
    let peakIdx = 0
    let peakVal = isIncreasing ? -Infinity : Infinity

    const segments: RepSegment[] = []

    for (let i = 0; i < values.length; i++) {
      const v = values[i]
      const awayFromRest = isIncreasing ? v > restThreshold : v < restThreshold
      const atPeak = isIncreasing ? v > peakThreshold : v < peakThreshold

      if (phase === "idle") {
        if (awayFromRest) {
          phase = "moving_to_peak"
          startIdx = i
          peakIdx = i
          peakVal = v
        }
      } else if (phase === "moving_to_peak") {
        if (atPeak) {
          // Track best peak
          if (isIncreasing ? v > peakVal : v < peakVal) {
            peakVal = v
            peakIdx = i
          }
        }
        // Began returning after reaching peak threshold
        if (atPeak && (isIncreasing ? v < peakThreshold : v > peakThreshold)) {
          phase = "returning"
        }
        // Allow direct transition if we crossed peak then came back below it
        if (!atPeak && (isIncreasing ? peakVal >= peakThreshold : peakVal <= peakThreshold)) {
          phase = "returning"
        }
      } else if (phase === "returning") {
        // Track continuing peak
        if (isIncreasing ? v > peakVal : v < peakVal) {
          peakVal = v
          peakIdx = i
        }

        const backToRest = isIncreasing ? v < restThreshold : v > restThreshold
        if (backToRest) {
          const duration = i - startIdx
          const amplitude = Math.abs(peakVal - restValue)

          if (
            duration >= minDurationFrames &&
            amplitude >= minAmplitude
          ) {
            const hasDropout = frames.slice(startIdx, i + 1).some((f) => f.dropout)
            segments.push({
              startIndex: startIdx,
              peakIndex: peakIdx,
              endIndex: i,
              startTime: frames[startIdx]?.timestamp ?? 0,
              peakTime: frames[peakIdx]?.timestamp ?? 0,
              endTime: frames[i]?.timestamp ?? 0,
              amplitude,
              duration: frames[i].timestamp - frames[startIdx].timestamp,
              hasDropout,
            })
          }

          // Reset for next rep
          phase = "idle"
          startIdx = i
          peakIdx = i
          peakVal = isIncreasing ? -Infinity : Infinity
        }
      }
    }

    return segments
  }
}

// --------------------------------------------------------------------------
// PhaseBuilder
// --------------------------------------------------------------------------

export class PhaseBuilder {
  constructor(
    private frames: FeatureFrame[],
    private repSegments: RepSegment[],
    private featureNames: string[],
  ) {}

  buildPhases(): PhasePrototype[] {
    const cleanReps = this.repSegments.filter((r) => !r.hasDropout)
    if (cleanReps.length === 0) return []

    const phasePositions: { id: PhasePrototype["id"]; name: string; t: number }[] = [
      { id: "rest", name: "Rest / Start", t: 0.0 },
      { id: "move-out", name: "Moving Out", t: 0.33 },
      { id: "peak", name: "Peak", t: -1 }, // special: use actual peakIndex
      { id: "return", name: "Returning", t: 0.75 },
    ]

    return phasePositions.map(({ id, name, t }) => {
      const featureMeans: Record<string, number> = {}

      for (const featureName of this.featureNames) {
        const values: number[] = []

        for (const rep of cleanReps) {
          let targetIdx: number

          if (id === "peak") {
            targetIdx = rep.peakIndex
          } else {
            const span = rep.endIndex - rep.startIndex
            targetIdx = rep.startIndex + Math.round(t * span)
          }

          targetIdx = Math.max(0, Math.min(this.frames.length - 1, targetIdx))
          const v = this.frames[targetIdx]?.values[featureName]
          if (v !== undefined) values.push(v)
        }

        if (values.length > 0) {
          featureMeans[featureName] = values.reduce((a, b) => a + b, 0) / values.length
        }
      }

      const normalizedTime = id === "peak" ? 0.5 : t

      return { id, name, normalizedTime, featureMeans }
    })
  }

  computeCycleConsistency(): number {
    const durations = this.repSegments.map((r) => r.duration)
    if (durations.length < 2) return 1.0
    const mean = durations.reduce((a, b) => a + b, 0) / durations.length
    const stdDev = Math.sqrt(
      durations.reduce((sum, d) => sum + (d - mean) ** 2, 0) / durations.length,
    )
    // cv = stdDev / mean; consistency = 1 - cv (clamped)
    return Math.max(0, Math.min(1, 1 - stdDev / mean))
  }
}

// --------------------------------------------------------------------------
// Orchestrator
// --------------------------------------------------------------------------

/**
 * Main entry point — learns a v2 pose template from joint angle time series.
 */
export function learnPoseTemplate(
  jointAngles: JointAngle[],
  exerciseName: string,
  exerciseType: string,
  anglesOfInterest: string[],
): PoseV2Template {
  console.log("[template-learner] Starting v2 learning…")
  console.log(`[template-learner] ${jointAngles.length} angle samples, ${anglesOfInterest.length} features`)

  const minAmplitude = exerciseType === "shoulders" ? 18 : 15

  // ── Step 1: Group frames & flag dropouts ──────────────────────────────────
  const frames = groupJointAnglesByFrame(jointAngles, anglesOfInterest)
  flagDropoutFrames(frames, anglesOfInterest)

  const totalDuration =
    frames.length > 1
      ? frames[frames.length - 1].timestamp - frames[0].timestamp
      : 0
  const fps = frames.length > 1 ? Math.round(frames.length / totalDuration) : 30
  const dropoutCount = frames.filter((f) => f.dropout).length
  const dropoutRatio = frames.length > 0 ? dropoutCount / frames.length : 0

  // ── Step 2: Feature stats ─────────────────────────────────────────────────
  const allStats = calculateFeatureStats(frames, anglesOfInterest)

  // ── Step 3: Select active features ───────────────────────────────────────
  const activeFeatures = allStats.filter(
    (f) =>
      f.validRatio >= 0.65 &&
      f.visibility >= 0.5 &&
      f.amplitude >= minAmplitude,
  )

  const warnings: string[] = []

  if (activeFeatures.length === 0) {
    warnings.push(
      "No features with sufficient amplitude and visibility were detected. " +
      "Check that the full limb is visible and the movement is large enough.",
    )
    return buildLowConfidenceTemplate(
      exerciseName,
      exerciseType,
      frames,
      allStats,
      totalDuration,
      fps,
      dropoutRatio,
      warnings,
    )
  }

  // ── Step 4: Bilateral flag ────────────────────────────────────────────────
  const activeNames = new Set(activeFeatures.map((f) => f.name))
  const bilateral = anglesOfInterest.some((n) => {
    const opposite = n.startsWith("left_")
      ? n.replace("left_", "right_")
      : n.startsWith("right_")
        ? n.replace("right_", "left_")
        : null
    return opposite && activeNames.has(n) && activeNames.has(opposite)
  })

  // ── Step 5: Pick primary feature ─────────────────────────────────────────
  const primary = activeFeatures.reduce((best, f) =>
    f.weight > best.weight ? f : best,
  )
  const primaryFeatureName = primary.name
  console.log(`[template-learner] Primary feature: ${primaryFeatureName} (amplitude=${primary.amplitude.toFixed(1)}°)`)

  // ── Step 6: Smooth primary signal ────────────────────────────────────────
  const rawSeries = interpolateMissingValues(frames, primaryFeatureName)
  const smoothed = smoothSeries(rawSeries, 2)

  // ── Step 7: Estimate rest baseline ───────────────────────────────────────
  // Direction must be known first — compute from the full signal distribution
  const upper20pct = [...smoothed].sort((a, b) => b - a).slice(0, Math.max(1, Math.round(smoothed.length * 0.2)))
  const lower20pct = [...smoothed].sort((a, b) => a - b).slice(0, Math.max(1, Math.round(smoothed.length * 0.2)))
  const upperMean = upper20pct.reduce((a, b) => a + b, 0) / upper20pct.length
  const lowerMean = lower20pct.reduce((a, b) => a + b, 0) / lower20pct.length

  // Direction: which extreme is further from the global mean?
  const globalMean = smoothed.reduce((a, b) => a + b, 0) / smoothed.length
  const direction: "increasing" | "decreasing" =
    Math.abs(upperMean - globalMean) >= Math.abs(lowerMean - globalMean)
      ? "increasing"
      : "decreasing"

  // ── Step 8: RepDetector ───────────────────────────────────────────────────
  const detector = new RepDetector(frames, primaryFeatureName, direction)

  // Inject the smoothed series directly (detector re-smooths, but we reuse)
  const restValue = detector.estimateRestBaseline()
  console.log(`[template-learner] Rest baseline: ${restValue.toFixed(1)}° (direction: ${direction})`)

  // ── Step 9: Local peaks ───────────────────────────────────────────────────
  const peakIndices = detector.detectLocalPeaks()
  if (peakIndices.length === 0) {
    warnings.push("No repetitions detected — movement amplitude may be too small or signal too noisy.")
    return buildLowConfidenceTemplate(
      exerciseName,
      exerciseType,
      frames,
      allStats,
      totalDuration,
      fps,
      dropoutRatio,
      warnings,
    )
  }

  const peakValues = peakIndices.map((i) => smoothed[i])
  // Median of top 50%
  const sortedPeaks = [...peakValues].sort((a, b) =>
    direction === "increasing" ? b - a : a - b,
  )
  const top50 = sortedPeaks.slice(0, Math.max(1, Math.ceil(sortedPeaks.length / 2)))
  const peakValue = top50.reduce((a, b) => a + b, 0) / top50.length

  console.log(`[template-learner] Peak value: ${peakValue.toFixed(1)}° from ${peakIndices.length} peaks`)

  // ── Step 10: Thresholds ───────────────────────────────────────────────────
  const { restThreshold, peakThreshold } = detector.computeThresholds(restValue, peakValue)

  // ── Step 11: Detect reps ──────────────────────────────────────────────────
  const repSegments = detector.detectReps(restValue, peakValue, restThreshold, peakThreshold)
  console.log(`[template-learner] Detected ${repSegments.length} rep segments`)

  if (repSegments.length === 0) {
    warnings.push("State machine detected no complete repetitions. Try a slower, larger movement in the reference video.")
    return buildLowConfidenceTemplate(
      exerciseName,
      exerciseType,
      frames,
      allStats,
      totalDuration,
      fps,
      dropoutRatio,
      warnings,
    )
  }

  // ── Step 12: Phase prototypes ─────────────────────────────────────────────
  const activeFeatureNames = activeFeatures.map((f) => f.name)
  const builder = new PhaseBuilder(frames, repSegments, activeFeatureNames)
  const phases = builder.buildPhases()

  // ── Step 13: Cycle consistency ────────────────────────────────────────────
  const cycleConsistency = builder.computeCycleConsistency()

  // ── Step 14: Confidence & warnings ───────────────────────────────────────
  let confidence = 100

  if (repSegments.length < 2) { confidence -= 30; warnings.push("Fewer than 2 complete reps detected — template may be unreliable.") }
  if (primary.amplitude < 15) { confidence -= 25; warnings.push("Primary joint amplitude is below 15° — movement may be too small.") }
  if (primary.visibility < 0.6) { confidence -= 15; warnings.push("Primary feature has low visibility — ensure the full limb is in frame.") }
  if (cycleConsistency < 0.6) { confidence -= 15; warnings.push("Repetitions are inconsistent in duration — template may not generalise well.") }
  if (dropoutRatio > 0.1) { confidence -= 10; warnings.push(`${Math.round(dropoutRatio * 100)}% of frames had landmark dropout — reference video quality is low.`) }

  // Phase separation: difference between rest and peak phase means on primary
  const restPhase = phases.find((p) => p.id === "rest")
  const peakPhase = phases.find((p) => p.id === "peak")
  const phaseSeparation =
    restPhase && peakPhase
      ? Math.abs(
          (restPhase.featureMeans[primaryFeatureName] ?? restValue) -
          (peakPhase.featureMeans[primaryFeatureName] ?? peakValue),
        )
      : primary.amplitude

  if (phaseSeparation < 20) { confidence -= 5; warnings.push("Phase separation is low — states may be hard to distinguish.") }

  confidence = Math.max(0, Math.min(100, Math.round(confidence)))

  // ── Build primary signal series ───────────────────────────────────────────
  const globalMin = Math.min(...smoothed)
  const globalMax = Math.max(...smoothed)
  const range = globalMax - globalMin || 1
  const series: PrimarySignalPoint[] = frames.map((f, i) => ({
    timestamp: f.timestamp,
    value: smoothed[i],
    normalized: (smoothed[i] - globalMin) / range,
  }))

  // ── Visibility stats ──────────────────────────────────────────────────────
  const visibilityStats: Record<string, number> = {}
  allStats.forEach((s) => { visibilityStats[s.name] = s.visibility })

  // ── Legacy states (synthesised from phases for backward compat) ───────────
  const legacyStates = buildLegacyStates(phases, repSegments, frames, activeFeatureNames)

  const template: PoseV2Template = {
    templateVersion: 2,
    exerciseName,
    exerciseType,
    jointGroup: exerciseType,
    bilateral,

    features: frames,
    activeFeatures,
    primarySignal: {
      feature: primaryFeatureName,
      direction,
      restValue,
      peakValue,
      amplitude: primary.amplitude,
      restThreshold,
      peakThreshold,
      series,
    },
    repSegments,
    phases,
    quality: {
      confidence,
      warnings,
      visibilityStats,
      cycleConsistency,
      amplitude: primary.amplitude,
      phaseSeparation,
      dropoutRatio,
    },

    // Legacy
    states: legacyStates,
    transitions: [],
    repSequence: buildRepSequence(legacyStates, repSegments.length),
    totalDuration,
    recommendedReps: repSegments.length,
    metadata: {
      detectedAt: new Date().toISOString(),
      videoLength: totalDuration,
      fps,
      confidence,
    },
  }

  console.log(`[template-learner] Done. Reps=${repSegments.length}, confidence=${confidence}%`)
  if (warnings.length > 0) console.warn("[template-learner] Warnings:", warnings)

  return template
}

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

function buildLowConfidenceTemplate(
  exerciseName: string,
  exerciseType: string,
  frames: FeatureFrame[],
  allStats: FeatureStats[],
  totalDuration: number,
  fps: number,
  dropoutRatio: number,
  warnings: string[],
): PoseV2Template {
  const visibilityStats: Record<string, number> = {}
  allStats.forEach((s) => { visibilityStats[s.name] = s.visibility })

  const dummySignal: PrimarySignal = {
    feature: "",
    direction: "increasing",
    restValue: 0,
    peakValue: 0,
    amplitude: 0,
    restThreshold: 0,
    peakThreshold: 0,
    series: [],
  }

  return {
    templateVersion: 2,
    exerciseName,
    exerciseType,
    jointGroup: exerciseType,
    bilateral: false,
    features: frames,
    activeFeatures: [],
    primarySignal: dummySignal,
    repSegments: [],
    phases: [],
    quality: {
      confidence: 0,
      warnings,
      visibilityStats,
      cycleConsistency: 0,
      amplitude: 0,
      phaseSeparation: 0,
      dropoutRatio,
    },
    states: [],
    transitions: [],
    repSequence: [],
    totalDuration,
    recommendedReps: 0,
    metadata: {
      detectedAt: new Date().toISOString(),
      videoLength: totalDuration,
      fps,
      confidence: 0,
    },
  }
}

function buildLegacyStates(
  phases: PhasePrototype[],
  repSegments: RepSegment[],
  frames: FeatureFrame[],
  featureNames: string[],
): LegacyState[] {
  if (phases.length === 0 || repSegments.length === 0) return []

  const restPhase = phases.find((p) => p.id === "rest")
  const peakPhase = phases.find((p) => p.id === "peak")

  if (!restPhase || !peakPhase) return []

  const makeAngleRanges = (means: Record<string, number>) =>
    Object.fromEntries(
      featureNames.map((name) => [
        name,
        { mean: means[name] ?? 0, min: means[name] ?? 0, max: means[name] ?? 0, stdDev: 0 },
      ]),
    )

  // Rest state occurrences: start + end of each rep
  const restOccurrences = repSegments.flatMap((r) => [
    { startTime: r.startTime, endTime: r.startTime + 0.1, duration: 0.1 },
    { startTime: r.endTime - 0.1, endTime: r.endTime, duration: 0.1 },
  ])

  // Peak state occurrences: around peak of each rep
  const peakOccurrences = repSegments.map((r) => ({
    startTime: r.peakTime - 0.05,
    endTime: r.peakTime + 0.05,
    duration: 0.1,
  }))

  return [
    {
      id: "state_rest",
      name: "Rest Position",
      description: "Starting and ending position",
      angleRanges: makeAngleRanges(restPhase.featureMeans),
      occurrences: restOccurrences,
      representativeTimestamp: repSegments[0].startTime,
    },
    {
      id: "state_peak",
      name: "Peak Position",
      description: "Full range of motion position",
      angleRanges: makeAngleRanges(peakPhase.featureMeans),
      occurrences: peakOccurrences,
      representativeTimestamp: repSegments[0].peakTime,
    },
  ]
}

function buildRepSequence(states: LegacyState[], repCount: number): string[] {
  if (states.length < 2 || repCount === 0) return []
  const seq: string[] = []
  for (let i = 0; i < repCount; i++) {
    seq.push(states[0].id, states[1].id)
  }
  seq.push(states[0].id)
  return seq
}
