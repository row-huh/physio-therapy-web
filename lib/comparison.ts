import type { LearnedExerciseTemplate, DetectedState } from "@/lib/exercise-state-learner"
import type { PoseV2Template } from "@/lib/template-learner"
import { getExerciseConfig } from "./exercise-config"

type AnyTemplate = PoseV2Template | LearnedExerciseTemplate

export interface ComparisonResult {
  similarity: number
  referenceReps: number
  uploadedReps: number
  details: {
    referenceTemplate: AnyTemplate
    uploadedTemplate: AnyTemplate
    stateMatches: { [key: string]: number }
    angleDeviations: { [key: string]: number }
  }
}

// Compare two learned exercise templates and return a similarity score.
//
// For v2 templates: uses primarySignal amplitude and rep-count similarity.
// For legacy v1 templates: uses state-matching + angle deviation (original logic).
export function compareTemplates(
  reference: AnyTemplate,
  uploaded: AnyTemplate,
): ComparisonResult {
  const stateMatches: { [key: string]: number } = {}
  const angleDeviations: { [key: string]: number } = {}

  // v2 path
  const refV2 =
    (reference as PoseV2Template).templateVersion === 2
      ? (reference as PoseV2Template)
      : null
  const upV2 =
    (uploaded as PoseV2Template).templateVersion === 2
      ? (uploaded as PoseV2Template)
      : null

  if (refV2 && upV2 && refV2.primarySignal?.feature) {
    const feat = refV2.primarySignal.feature
    const refAmp = refV2.primarySignal.amplitude || 1
    const upAmp = upV2.primarySignal?.amplitude ?? refAmp
    const ampRatio = upAmp / refAmp
    const ampScore = Math.max(0, 100 - Math.abs(ampRatio - 1.0) * 80)

    const refReps = refV2.recommendedReps
    const upReps = upV2.recommendedReps
    const repRatio = refReps > 0 ? upReps / refReps : 1
    const repScore = Math.max(0, 100 - Math.abs(repRatio - 1.0) * 50)

    stateMatches["primary_amplitude"] = ampScore
    stateMatches["rep_count"] = repScore
    angleDeviations[feat] = Math.abs(
      refV2.primarySignal.amplitude -
        (upV2.primarySignal?.amplitude ?? refV2.primarySignal.amplitude),
    )

    return {
      similarity: Math.round(ampScore * 0.6 + repScore * 0.4),
      referenceReps: refReps,
      uploadedReps: upReps,
      details: {
        referenceTemplate: reference,
        uploadedTemplate: uploaded,
        stateMatches,
        angleDeviations,
      },
    }
  }

  // Legacy v1 path
  const refLegacy = reference as LearnedExerciseTemplate
  const upLegacy = uploaded as LearnedExerciseTemplate

  const exerciseType = refLegacy.exerciseType
  const config = getExerciseConfig(exerciseType)
  const relevantAngles: Set<string> | null = config
    ? new Set(config.anglesOfInterest)
    : null

  refLegacy.states.forEach((refState) => {
    const closestMatch = upLegacy.states.reduce(
      (best, upState) => {
        const sim = calculateStateSimilarity(refState, upState, relevantAngles)
        return sim > best.similarity ? { state: upState, similarity: sim } : best
      },
      { state: upLegacy.states[0], similarity: 0 },
    )
    stateMatches[refState.name] = closestMatch.similarity
  })

  const anglesToCompare: Set<string> = new Set()
  refLegacy.states.forEach((s) =>
    Object.keys(s.angleRanges).forEach((angle) => {
      if (!relevantAngles || relevantAngles.has(angle)) anglesToCompare.add(angle)
    }),
  )

  anglesToCompare.forEach((angleName) => {
    const refAngles = refLegacy.states
      .map((s) => s.angleRanges[angleName]?.mean)
      .filter((a) => a !== undefined) as number[]
    const upAngles = upLegacy.states
      .map((s) => s.angleRanges[angleName]?.mean)
      .filter((a) => a !== undefined) as number[]

    if (refAngles.length > 0 && upAngles.length > 0) {
      const refAvg = refAngles.reduce((a, b) => a + b, 0) / refAngles.length
      const upAvg = upAngles.reduce((a, b) => a + b, 0) / upAngles.length
      angleDeviations[angleName] = Math.abs(refAvg - upAvg)
    }
  })

  const stateMatchValues = Object.values(stateMatches)
  const stateSimilarity =
    stateMatchValues.length > 0
      ? stateMatchValues.reduce((a, b) => a + b, 0) / stateMatchValues.length
      : 0
  const deviationValues = Object.values(angleDeviations)
  const angleAccuracy =
    deviationValues.length > 0
      ? 100 -
        Math.min(100, deviationValues.reduce((a, b) => a + b, 0) / deviationValues.length)
      : 0

  return {
    similarity: Math.round(stateSimilarity * 0.6 + angleAccuracy * 0.4),
    referenceReps: refLegacy.recommendedReps,
    uploadedReps: upLegacy.recommendedReps,
    details: {
      referenceTemplate: reference,
      uploadedTemplate: uploaded,
      stateMatches,
      angleDeviations,
    },
  }
}

/**
 * Calculate similarity between two detected states based on their angle ranges.
 * Returns 0-100 where 100 = identical angles.
 */
export function calculateStateSimilarity(
  state1: DetectedState,
  state2: DetectedState,
  relevantAngles?: Set<string> | null,
): number {
  const angles1 = Object.keys(state1.angleRanges)
  const angles2 = Object.keys(state2.angleRanges)
  let commonAngles = angles1.filter((a) => angles2.includes(a))

  if (relevantAngles) {
    commonAngles = commonAngles.filter((a) => relevantAngles.has(a))
  }

  if (commonAngles.length === 0) return 0

  const similarities = commonAngles.map((angle) => {
    const mean1 = state1.angleRanges[angle].mean
    const mean2 = state2.angleRanges[angle].mean
    const diff = Math.abs(mean1 - mean2)
    return Math.max(0, 100 - (diff / 180) * 100)
  })

  return similarities.reduce((a, b) => a + b, 0) / similarities.length
}
