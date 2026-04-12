/**
 * Tests for lib/comparison.ts
 *
 * Covers:
 *   - calculateStateSimilarity()
 *       - identical states → 100
 *       - zero common angles → 0
 *       - relevantAngles filter respected
 *       - partial overlap
 *       - 180° diff → 0
 *   - compareTemplates()
 *       - identical templates → ~100 similarity
 *       - completely different templates → low similarity
 *       - only exercise-relevant angles compared (irrelevant angles ignored)
 *       - empty states handled gracefully
 *       - result shape has all required fields
 */

import { compareTemplates, calculateStateSimilarity } from "@/lib/comparison"
import type { DetectedState, LearnedExerciseTemplate } from "@/lib/exercise-state-learner"

// ---------------------------------------------------------------------------
// Helpers — build minimal DetectedState and LearnedExerciseTemplate
// ---------------------------------------------------------------------------

function makeState(
  id: string,
  angles: Record<string, number>,
  occurrences = [{ startTime: 0, endTime: 1, duration: 1 }]
): DetectedState {
  const angleRanges: DetectedState["angleRanges"] = {}
  for (const [name, mean] of Object.entries(angles)) {
    angleRanges[name] = { mean, min: mean - 5, max: mean + 5, stdDev: 2 }
  }
  return {
    id,
    name: id,
    description: "",
    angleRanges,
    occurrences,
    representativeTimestamp: 0.5,
  }
}

function makeTemplate(
  exerciseType: string,
  states: DetectedState[],
  reps = 3
): LearnedExerciseTemplate {
  return {
    exerciseName: exerciseType,
    exerciseType,
    states,
    transitions: [],
    repSequence: [],
    totalDuration: 10,
    recommendedReps: reps,
    metadata: {
      detectedAt: new Date().toISOString(),
      videoLength: 10,
      fps: 30,
      confidence: 80,
    },
  }
}

// ---------------------------------------------------------------------------
// calculateStateSimilarity()
// ---------------------------------------------------------------------------

describe("calculateStateSimilarity", () => {
  it("returns 100 when both states have identical angle means", () => {
    const s1 = makeState("s1", { left_knee: 90, right_knee: 90 })
    const s2 = makeState("s2", { left_knee: 90, right_knee: 90 })
    expect(calculateStateSimilarity(s1, s2)).toBe(100)
  })

  it("returns 0 when there are no common angles", () => {
    const s1 = makeState("s1", { left_knee: 90 })
    const s2 = makeState("s2", { right_shoulder: 45 })
    expect(calculateStateSimilarity(s1, s2)).toBe(0)
  })

  it("returns 0 for a 180° mean difference (maximum possible error)", () => {
    const s1 = makeState("s1", { left_knee: 0 })
    const s2 = makeState("s2", { left_knee: 180 })
    // diff = 180, formula: max(0, 100 - (180/180)*100) = 0
    expect(calculateStateSimilarity(s1, s2)).toBe(0)
  })

  it("returns value between 0 and 100 for a partial difference", () => {
    const s1 = makeState("s1", { left_knee: 90 })
    const s2 = makeState("s2", { left_knee: 120 })
    const result = calculateStateSimilarity(s1, s2)
    // diff = 30° → 100 - (30/180)*100 ≈ 83.3
    expect(result).toBeGreaterThan(0)
    expect(result).toBeLessThan(100)
    expect(result).toBeCloseTo(83.33, 1)
  })

  it("respects relevantAngles filter — ignores angles not in the set", () => {
    const s1 = makeState("s1", { left_knee: 90, right_shoulder: 30 })
    const s2 = makeState("s2", { left_knee: 90, right_shoulder: 180 })
    // Without filter: shoulder differs a lot → lower score
    const withFilter = calculateStateSimilarity(s1, s2, new Set(["left_knee"]))
    const withoutFilter = calculateStateSimilarity(s1, s2)
    // With filter only left_knee is compared → 100; without → lower
    expect(withFilter).toBe(100)
    expect(withoutFilter).toBeLessThan(100)
  })

  it("relevantAngles filter with empty set returns 0", () => {
    const s1 = makeState("s1", { left_knee: 90 })
    const s2 = makeState("s2", { left_knee: 90 })
    // no angles pass the filter
    expect(calculateStateSimilarity(s1, s2, new Set())).toBe(0)
  })

  it("averages similarities across multiple common angles", () => {
    // angle1 similarity = 100 (diff 0), angle2 similarity = 0 (diff 180) → avg 50
    const s1 = makeState("s1", { a1: 90, a2: 0 })
    const s2 = makeState("s2", { a1: 90, a2: 180 })
    const result = calculateStateSimilarity(s1, s2, null)
    expect(result).toBeCloseTo(50, 1)
  })
})

// ---------------------------------------------------------------------------
// compareTemplates()
// ---------------------------------------------------------------------------

describe("compareTemplates", () => {
  it("returns similarity ~100 when both templates are identical", () => {
    const state = makeState("state_0", { left_knee: 170, right_knee: 170 })
    const t = makeTemplate("knee-extension", [state], 5)
    const result = compareTemplates(t, t)
    // Angle deviation = 0 → angleAccuracy = 100, stateSimilarity = 100 → overall = 100
    expect(result.similarity).toBe(100)
  })

  it("returns low similarity when templates are very different", () => {
    const refState = makeState("state_0", { left_knee: 170 })
    const upState = makeState("state_0", { left_knee: 10 })
    const ref = makeTemplate("knee-extension", [refState])
    const uploaded = makeTemplate("knee-extension", [upState])
    const result = compareTemplates(ref, uploaded)
    expect(result.similarity).toBeLessThan(60)
  })

  it("result has all required shape fields", () => {
    const state = makeState("state_0", { left_knee: 90 })
    const t = makeTemplate("knee-extension", [state])
    const result = compareTemplates(t, t)

    expect(typeof result.similarity).toBe("number")
    expect(typeof result.referenceReps).toBe("number")
    expect(typeof result.uploadedReps).toBe("number")
    expect(result.details).toBeDefined()
    expect(result.details.stateMatches).toBeDefined()
    expect(result.details.angleDeviations).toBeDefined()
    expect(result.details.referenceTemplate).toBeDefined()
    expect(result.details.uploadedTemplate).toBeDefined()
  })

  it("similarity is an integer (Math.round applied)", () => {
    const s1 = makeState("state_0", { left_knee: 90 })
    const s2 = makeState("state_0", { left_knee: 95 })
    const ref = makeTemplate("knee-extension", [s1])
    const up = makeTemplate("knee-extension", [s2])
    const result = compareTemplates(ref, up)
    expect(Number.isInteger(result.similarity)).toBe(true)
  })

  it("referenceReps and uploadedReps come from template.recommendedReps", () => {
    const state = makeState("state_0", { left_knee: 90 })
    const ref = makeTemplate("knee-extension", [state], 5)
    const up = makeTemplate("knee-extension", [state], 8)
    const result = compareTemplates(ref, up)
    expect(result.referenceReps).toBe(5)
    expect(result.uploadedReps).toBe(8)
  })

  it("irrelevant angles (arm angles) are ignored for knee-extension comparison", () => {
    // Both templates agree on knee angles but differ wildly on shoulder angles
    const refState = makeState("state_0", { left_knee: 170, right_knee: 170, left_shoulder: 30 })
    const upState = makeState("state_0", { left_knee: 170, right_knee: 170, left_shoulder: 160 })
    const ref = makeTemplate("knee-extension", [refState])
    const up = makeTemplate("knee-extension", [upState])
    const result = compareTemplates(ref, up)
    // Knee angles match perfectly → high similarity (shoulder ignored)
    expect(result.similarity).toBeGreaterThan(85)
    // shoulder angle deviation should not appear in angleDeviations
    expect(result.details.angleDeviations["left_shoulder"]).toBeUndefined()
  })

  it("handles exercise type with no registered config (falls back to all angles)", () => {
    const refState = makeState("state_0", { custom_angle: 90 })
    const upState = makeState("state_0", { custom_angle: 90 })
    const ref = makeTemplate("unknown-exercise", [refState])
    const up = makeTemplate("unknown-exercise", [upState])
    // Should not throw; similarity should be 100 since angles are identical
    const result = compareTemplates(ref, up)
    expect(result.similarity).toBe(100)
  })

  it("handles uploaded template with empty states array gracefully", () => {
    const refState = makeState("state_0", { left_knee: 90 })
    const ref = makeTemplate("knee-extension", [refState])
    const up = makeTemplate("knee-extension", [])
    // reduce on empty uploaded.states → each refState gets similarity 0
    expect(() => compareTemplates(ref, up)).not.toThrow()
  })
})
