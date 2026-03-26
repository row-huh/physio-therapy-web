import type { LearnedExerciseTemplate, DetectedState } from "@/lib/exercise-state-learner"

export interface ComparisonResult {
  similarity: number
  referenceReps: number
  uploadedReps: number
  details: {
    referenceTemplate: LearnedExerciseTemplate
    uploadedTemplate: LearnedExerciseTemplate
    stateMatches: { [key: string]: number }
    angleDeviations: { [key: string]: number }
  }
}


// Compare two learned exercise templates and return a similarity score.
// Score = (stateSimilarity × 0.6) + (angleAccuracy × 0.4)
export function compareTemplates(
  reference: LearnedExerciseTemplate,
  uploaded: LearnedExerciseTemplate
): ComparisonResult {
  const stateMatches: { [key: string]: number } = {}
  const angleDeviations: { [key: string]: number } = {}

  // For each reference state, find the closest matching uploaded state
  reference.states.forEach((refState) => {
    const closestMatch = uploaded.states.reduce((best, upState) => {
      const similarity = calculateStateSimilarity(refState, upState)
      return similarity > best.similarity ? { state: upState, similarity } : best
    }, { state: uploaded.states[0], similarity: 0 })

    stateMatches[refState.name] = closestMatch.similarity
  })

  // Collect all angle names across reference states
  const allAngles = new Set<string>()
  reference.states.forEach(s =>
    Object.keys(s.angleRanges).forEach(angle => allAngles.add(angle))
  )

  // Calculate average deviation per angle
  allAngles.forEach(angleName => {
    const refAngles = reference.states
      .map(s => s.angleRanges[angleName]?.mean)
      .filter(a => a !== undefined) as number[]
    const upAngles = uploaded.states
      .map(s => s.angleRanges[angleName]?.mean)
      .filter(a => a !== undefined) as number[]

    if (refAngles.length > 0 && upAngles.length > 0) {
      const refAvg = refAngles.reduce((a, b) => a + b, 0) / refAngles.length
      const upAvg = upAngles.reduce((a, b) => a + b, 0) / upAngles.length
      angleDeviations[angleName] = Math.abs(refAvg - upAvg)
    }
  })

  // Overall score: 60% state similarity + 40% angle accuracy
  const stateSimilarity = Object.values(stateMatches).reduce((a, b) => a + b, 0) / Object.values(stateMatches).length
  const angleAccuracy = 100 - Math.min(100,
    Object.values(angleDeviations).reduce((a, b) => a + b, 0) / Object.values(angleDeviations).length
  )
  const overallSimilarity = (stateSimilarity * 0.6 + angleAccuracy * 0.4)

  return {
    similarity: Math.round(overallSimilarity),
    referenceReps: reference.recommendedReps,
    uploadedReps: uploaded.recommendedReps,
    details: {
      referenceTemplate: reference,
      uploadedTemplate: uploaded,
      stateMatches,
      angleDeviations,
    }
  }
}

/**
 * Calculate similarity between two detected states based on their angle ranges.
 * Returns 0-100 where 100 = identical angles.
 */
export function calculateStateSimilarity(state1: DetectedState, state2: DetectedState): number {
  const angles1 = Object.keys(state1.angleRanges)
  const angles2 = Object.keys(state2.angleRanges)
  const commonAngles = angles1.filter(a => angles2.includes(a))

  if (commonAngles.length === 0) return 0

  const similarities = commonAngles.map(angle => {
    const mean1 = state1.angleRanges[angle].mean
    const mean2 = state2.angleRanges[angle].mean
    const diff = Math.abs(mean1 - mean2)
    return Math.max(0, 100 - (diff / 180) * 100)
  })

  return similarities.reduce((a, b) => a + b, 0) / similarities.length
}
