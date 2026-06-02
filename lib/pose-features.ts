/**
 * Pose Feature Extraction Utilities
 *
 * Converts flat JointAngle[] samples (one per joint per frame) into
 * per-frame feature dictionaries with stats, smoothing, and dropout detection.
 */

import type { JointAngle } from "./pose-analyzer"

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

export interface FeatureFrame {
  timestamp: number
  values: Record<string, number>
  visibility: Record<string, number>
  dropout: boolean
}

export interface FeatureStats {
  name: string
  mean: number
  min: number
  max: number
  stdDev: number
  amplitude: number   // max - min
  visibility: number  // average visibility across valid frames
  validRatio: number  // fraction of frames where this feature is present
  weight: number      // computed from amplitude × visibility
}

// --------------------------------------------------------------------------
// Frame grouping
// --------------------------------------------------------------------------

/**
 * Group JointAngle[] (one entry per joint per frame) into per-frame dicts.
 * Returns frames sorted by timestamp.
 */
export function groupJointAnglesByFrame(
  jointAngles: JointAngle[],
  featureNames: string[],
): FeatureFrame[] {
  const byTimestamp = new Map<number, { values: Record<string, number>; visibility: Record<string, number> }>()

  for (const ja of jointAngles) {
    if (!featureNames.includes(ja.joint)) continue

    // Round timestamp to centiseconds to merge near-simultaneous frames
    const t = Math.round(ja.timestamp * 100) / 100

    if (!byTimestamp.has(t)) {
      byTimestamp.set(t, { values: {}, visibility: {} })
    }

    const frame = byTimestamp.get(t)!
    frame.values[ja.joint] = ja.angle
    frame.visibility[ja.joint] = ja.visibility ?? 1.0
  }

  const timestamps = Array.from(byTimestamp.keys()).sort((a, b) => a - b)
  return timestamps.map((t) => ({
    timestamp: t,
    values: byTimestamp.get(t)!.values,
    visibility: byTimestamp.get(t)!.visibility,
    dropout: false, // filled by flagDropoutFrames
  }))
}

// --------------------------------------------------------------------------
// Dropout detection
// --------------------------------------------------------------------------

const VISIBILITY_FLOOR = 0.4

/**
 * Mark frames where any required feature has visibility below the floor
 * or is absent entirely. Mutates frames in place.
 */
export function flagDropoutFrames(
  frames: FeatureFrame[],
  featureNames: string[],
  visibilityFloor: number = VISIBILITY_FLOOR,
): void {
  for (const frame of frames) {
    frame.dropout = featureNames.some(
      (name) =>
        frame.visibility[name] === undefined ||
        frame.visibility[name] < visibilityFloor,
    )
  }
}

// --------------------------------------------------------------------------
// Feature stats
// --------------------------------------------------------------------------

/**
 * Compute per-feature statistics across all frames.
 */
export function calculateFeatureStats(
  frames: FeatureFrame[],
  featureNames: string[],
): FeatureStats[] {
  return featureNames.map((name) => {
    const validFrames = frames.filter(
      (f) => f.values[name] !== undefined && !f.dropout,
    )
    const allPresent = frames.filter((f) => f.values[name] !== undefined)

    if (allPresent.length === 0) {
      return {
        name,
        mean: 0,
        min: 0,
        max: 0,
        stdDev: 0,
        amplitude: 0,
        visibility: 0,
        validRatio: 0,
        weight: 0,
      }
    }

    const values = validFrames.map((f) => f.values[name])
    const mean = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0
    const min = values.length > 0 ? Math.min(...values) : 0
    const max = values.length > 0 ? Math.max(...values) : 0
    const variance =
      values.length > 0
        ? values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length
        : 0
    const stdDev = Math.sqrt(variance)
    const amplitude = max - min

    const visibilityValues = allPresent.map((f) => f.visibility[name] ?? 1.0)
    const visibility =
      visibilityValues.reduce((a, b) => a + b, 0) / visibilityValues.length

    const validRatio = validFrames.length / frames.length
    const weight = amplitude * visibility

    return { name, mean, min, max, stdDev, amplitude, visibility, validRatio, weight }
  })
}

// --------------------------------------------------------------------------
// Signal processing
// --------------------------------------------------------------------------

/**
 * Simple moving average with a half-radius on each side.
 */
export function smoothSeries(values: number[], radius: number = 2): number[] {
  if (values.length === 0) return []
  return values.map((_, i) => {
    const lo = Math.max(0, i - radius)
    const hi = Math.min(values.length - 1, i + radius)
    let sum = 0
    for (let j = lo; j <= hi; j++) sum += values[j]
    return sum / (hi - lo + 1)
  })
}

/**
 * Linear interpolation for missing values (NaN or undefined).
 * Returns full-length array with gaps filled.
 */
export function interpolateMissingValues(
  frames: FeatureFrame[],
  featureName: string,
): number[] {
  const raw = frames.map((f) =>
    f.values[featureName] !== undefined ? f.values[featureName] : NaN,
  )

  const result = [...raw]

  // Forward-fill the first valid value
  let firstValid = NaN
  for (let i = 0; i < result.length; i++) {
    if (!isNaN(result[i])) { firstValid = result[i]; break }
  }
  if (isNaN(firstValid)) return result.map(() => 0) // no valid data

  // Fill leading NaNs
  for (let i = 0; i < result.length && isNaN(result[i]); i++) {
    result[i] = firstValid
  }

  // Linear interpolation for interior gaps
  for (let i = 0; i < result.length; i++) {
    if (isNaN(result[i])) {
      // Find next valid
      let j = i + 1
      while (j < result.length && isNaN(result[j])) j++
      if (j >= result.length) {
        // Fill trailing with last valid
        for (let k = i; k < result.length; k++) result[k] = result[i - 1]
        break
      }
      const startVal = result[i - 1]
      const endVal = result[j]
      for (let k = i; k < j; k++) {
        result[k] = startVal + ((endVal - startVal) * (k - (i - 1))) / (j - (i - 1))
      }
      i = j - 1
    }
  }

  return result
}

/**
 * Normalize a series to [0, 1]. Returns all-zeros if range is 0.
 */
export function normalizeSeries(values: number[]): number[] {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min
  if (range === 0) return values.map(() => 0)
  return values.map((v) => (v - min) / range)
}

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

export function computeStats(values: number[]): {
  mean: number
  min: number
  max: number
  stdDev: number
} {
  if (values.length === 0) return { mean: 0, min: 0, max: 0, stdDev: 0 }
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length
  return {
    mean,
    min: Math.min(...values),
    max: Math.max(...values),
    stdDev: Math.sqrt(variance),
  }
}
