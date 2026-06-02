/**
 * Template Adapter
 *
 * Promotes a legacy v1 LearnedExerciseTemplate (K-means based) to a v2
 * PoseV2Template so that old database records continue to work.
 *
 * Rules:
 * - v2 templates are returned as-is.
 * - v1 templates: infer primarySignal from the state with the largest angle range.
 * - If the legacy template has no recognisable angle data, returns null with a
 *   warnings list — never crashes silently.
 */

import type { PoseV2Template, LegacyState, PrimarySignal } from "./template-learner"
import type { LearnedExerciseTemplate } from "./exercise-state-learner"

type AnyTemplate = PoseV2Template | LearnedExerciseTemplate | null | undefined

export interface AdaptResult {
  template: PoseV2Template | null
  warnings: string[]
}

/**
 * Returns a v2-shaped template, or null with warnings if adaptation is impossible.
 */
export function adaptTemplate(raw: AnyTemplate): AdaptResult {
  if (!raw) return { template: null, warnings: ["No template provided"] }

  // Already v2 — pass through
  if ((raw as PoseV2Template).templateVersion === 2) {
    return { template: raw as PoseV2Template, warnings: [] }
  }

  // Legacy v1 path
  const v1 = raw as LearnedExerciseTemplate
  const warnings: string[] = []

  if (!v1.states || v1.states.length === 0) {
    warnings.push("Legacy template has no states — cannot adapt.")
    return { template: null, warnings }
  }

  // Find the feature with the largest angle range across all states
  const featureAmplitudes = new Map<string, number>()
  for (const state of v1.states) {
    for (const [angleName, range] of Object.entries(state.angleRanges ?? {})) {
      const amp = (range as { min: number; max: number }).max - (range as { min: number; max: number }).min
      featureAmplitudes.set(angleName, Math.max(featureAmplitudes.get(angleName) ?? 0, amp))
    }
  }

  if (featureAmplitudes.size === 0) {
    warnings.push("Legacy template states contain no angle data — cannot infer primary feature.")
    return { template: null, warnings }
  }

  // Primary feature = largest amplitude
  let primaryFeature = ""
  let maxAmp = 0
  featureAmplitudes.forEach((amp, name) => {
    if (amp > maxAmp) { maxAmp = amp; primaryFeature = name }
  })

  // Validate: must be a recognisable angle name (contains '_')
  if (!primaryFeature.includes("_")) {
    warnings.push(
      `Inferred primary feature "${primaryFeature}" does not look like an angle name — cannot adapt safely.`,
    )
    return { template: null, warnings }
  }

  // Infer rest and peak values from states sorted by primary angle mean
  const statesWithPrimary = v1.states.filter((s) => s.angleRanges?.[primaryFeature])
  if (statesWithPrimary.length === 0) {
    warnings.push(`No state has data for the inferred primary feature "${primaryFeature}".`)
    return { template: null, warnings }
  }

  const sorted = [...statesWithPrimary].sort(
    (a, b) =>
      (a.angleRanges[primaryFeature]?.mean ?? 0) -
      (b.angleRanges[primaryFeature]?.mean ?? 0),
  )

  const restValue = sorted[0].angleRanges[primaryFeature].mean
  const peakValue = sorted[sorted.length - 1].angleRanges[primaryFeature].mean

  if (Math.abs(peakValue - restValue) < 10) {
    warnings.push("Legacy template rest/peak difference is less than 10° — inferred thresholds may be inaccurate.")
  }

  const direction: PrimarySignal["direction"] = peakValue > restValue ? "increasing" : "decreasing"
  const range = peakValue - restValue

  const primarySignal: PrimarySignal = {
    feature: primaryFeature,
    direction,
    restValue,
    peakValue,
    amplitude: Math.abs(range),
    restThreshold: restValue + 0.35 * range,
    peakThreshold: restValue + 0.70 * range,
    series: [],
  }

  // Build legacy-compatible states list from existing v1 states
  const legacyStates: LegacyState[] = v1.states.map((s, i) => ({
    id: s.id ?? `state_${i}`,
    name: s.name ?? `State ${i + 1}`,
    description: s.description ?? "",
    angleRanges: s.angleRanges ?? {},
    occurrences: s.occurrences ?? [],
    representativeTimestamp: s.representativeTimestamp ?? 0,
  }))

  const featureNames = Array.from(featureAmplitudes.keys())
  const visibilityStats: Record<string, number> = {}
  featureNames.forEach((n) => { visibilityStats[n] = 1.0 })

  const adapted: PoseV2Template = {
    templateVersion: 2,
    exerciseName: v1.exerciseName ?? "",
    exerciseType: v1.exerciseType ?? "",
    jointGroup: v1.exerciseType ?? "",
    bilateral: featureNames.some(
      (n) =>
        n.startsWith("left_") &&
        featureNames.includes(n.replace("left_", "right_")),
    ),

    features: [],
    activeFeatures: featureNames.map((name) => ({
      name,
      mean: 0,
      min: 0,
      max: 0,
      stdDev: 0,
      amplitude: featureAmplitudes.get(name) ?? 0,
      visibility: 1.0,
      validRatio: 1.0,
      weight: featureAmplitudes.get(name) ?? 0,
    })),
    primarySignal,
    repSegments: [],
    phases: [],
    quality: {
      confidence: v1.metadata?.confidence ?? 50,
      warnings: ["Adapted from legacy v1 template — some scoring features are unavailable."],
      visibilityStats,
      cycleConsistency: 0.7,
      amplitude: Math.abs(range),
      phaseSeparation: Math.abs(range),
      dropoutRatio: 0,
    },

    // Pass through legacy fields
    states: legacyStates,
    transitions: v1.transitions ?? [],
    repSequence: v1.repSequence ?? [],
    totalDuration: v1.totalDuration ?? 0,
    recommendedReps: v1.recommendedReps ?? 1,
    metadata: {
      detectedAt: v1.metadata?.detectedAt ?? new Date().toISOString(),
      videoLength: v1.metadata?.videoLength ?? v1.totalDuration ?? 0,
      fps: v1.metadata?.fps ?? 30,
      confidence: v1.metadata?.confidence ?? 50,
    },
  }

  return { template: adapted, warnings }
}

/**
 * Convenience: extract rest/peak thresholds from a template of either version.
 * Returns null if the template cannot provide thresholds.
 */
export function getTemplateThresholds(
  template: AnyTemplate,
): { restThreshold: number; peakThreshold: number; feature: string } | null {
  if (!template) return null

  if ((template as PoseV2Template).templateVersion === 2) {
    const ps = (template as PoseV2Template).primarySignal
    if (!ps?.feature) return null
    return {
      restThreshold: ps.restThreshold,
      peakThreshold: ps.peakThreshold,
      feature: ps.feature,
    }
  }

  // Legacy: infer via adapt
  const { template: adapted } = adaptTemplate(template)
  if (!adapted) return null
  const ps = adapted.primarySignal
  return { restThreshold: ps.restThreshold, peakThreshold: ps.peakThreshold, feature: ps.feature }
}
