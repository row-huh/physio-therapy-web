/**
 * Tests for lib/comparison.ts
 *
 * This module is the core of the physiotherapy feedback system.
 * It computes how similar a patient's exercise execution is to the ideal template
 * recorded by their doctor. The output drives the overall session score shown to
 * both patient and doctor.
 *
 * Two exported functions are tested:
 *
 *   calculateStateSimilarity(stateA, stateB, relevantAngles?)
 *     Compares two exercise states by their joint angle means.
 *     Returns a score in [0, 100] where 100 = identical and 0 = maximum difference.
 *
 *   compareTemplates(reference, uploaded)
 *     Compares an ideal reference template against a patient's recorded template.
 *     Uses exercise-type-specific angle filtering so irrelevant joints don't penalise
 *     exercises where they naturally vary (e.g. shoulders during a knee extension).
 *     Returns a ComparisonResult with a similarity score and detailed breakdowns.
 */

import { compareTemplates, calculateStateSimilarity } from "@/lib/comparison"
import type { DetectedState, LearnedExerciseTemplate } from "@/lib/exercise-state-learner"

// ---------------------------------------------------------------------------
// Shared factories — build minimal but structurally valid test objects
// ---------------------------------------------------------------------------

/**
 * Builds a DetectedState with angle means taken from the provided map.
 * Ranges are manufactured symmetrically around the mean (±5°, stdDev=2)
 * which is sufficient for comparison tests that only look at means.
 */
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

/**
 * Builds a LearnedExerciseTemplate wrapping the provided states.
 * The exerciseType drives which angles are considered relevant for comparison.
 */
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

// ===========================================================================
// calculateStateSimilarity()
// ===========================================================================

describe("calculateStateSimilarity — compare two exercise states by their joint angle means", () => {

  describe("perfect match (score = 100)", () => {
    it("returns exactly 100 when both states have identical angle means for all shared joints, because zero deviation means perfect reproduction of the target pose", () => {
      // Both states have left_knee=90, right_knee=90 → every pairwise diff is 0
      const s1 = makeState("s1", { left_knee: 90, right_knee: 90 })
      const s2 = makeState("s2", { left_knee: 90, right_knee: 90 })

      const result = calculateStateSimilarity(s1, s2)

      // Each angle: diff=0 → score=100; average of 100 and 100 = 100
      expect(result).toBe(100)
      process.stdout.write("[SIMILARITY] Identical states → correctly returned 100\n")
    })
  })

  describe("no common angles (score = 0)", () => {
    it("returns exactly 0 when the two states share no angle keys at all, because there is no basis for comparison — the postures are in completely different joint spaces", () => {
      // s1 only has left_knee; s2 only has right_shoulder — no overlap
      const s1 = makeState("s1", { left_knee: 90 })
      const s2 = makeState("s2", { right_shoulder: 45 })

      const result = calculateStateSimilarity(s1, s2)

      // No common keys → commonAngles.length = 0 → similarity = 0
      expect(result).toBe(0)
      process.stdout.write("[SIMILARITY] No common angles → correctly returned 0\n")
    })
  })

  describe("maximum difference (score = 0)", () => {
    it("returns exactly 0 for a 180-degree mean difference, because 180° is the maximum possible angle error and the formula maps it to 0 (max(0, 100 - (diff/180)*100))", () => {
      // left_knee: 0° vs 180° → diff = 180 → 100 - (180/180)*100 = 0
      const s1 = makeState("s1", { left_knee: 0 })
      const s2 = makeState("s2", { left_knee: 180 })

      const result = calculateStateSimilarity(s1, s2)

      expect(result).toBe(0)
      process.stdout.write("[SIMILARITY] 180-degree difference → correctly returned 0\n")
    })
  })

  describe("partial difference — intermediate scores", () => {
    it("returns a value between 0 and 100 (approximately 83.3) for a 30-degree difference, computed as 100 - (30/180)*100", () => {
      // left_knee: 90° vs 120° → diff = 30 → score = 100 - (30/180)*100 ≈ 83.33
      const s1 = makeState("s1", { left_knee: 90 })
      const s2 = makeState("s2", { left_knee: 120 })

      const result = calculateStateSimilarity(s1, s2)

      // The score should be strictly between 0 and 100
      expect(result).toBeGreaterThan(0)
      expect(result).toBeLessThan(100)
      // And specifically close to the expected mathematical result
      expect(result).toBeCloseTo(83.33, 1)
      process.stdout.write(`[SIMILARITY] 30-degree difference → correctly returned ~83.3 (actual: ${result.toFixed(2)})\n`)
    })
  })

  describe("averaging across multiple angles", () => {
    it("averages angle similarities when multiple common angles are present — a perfect angle and a worst-case angle together give exactly 50", () => {
      // a1: diff=0 → similarity=100; a2: diff=180 → similarity=0; average = 50
      const s1 = makeState("s1", { a1: 90, a2: 0 })
      const s2 = makeState("s2", { a1: 90, a2: 180 })

      const result = calculateStateSimilarity(s1, s2, null)

      expect(result).toBeCloseTo(50, 1)
      process.stdout.write(`[SIMILARITY] Two angles (perfect + worst-case) → correctly averaged to ~50 (actual: ${result.toFixed(2)})\n`)
    })
  })

  describe("relevantAngles filter — focus comparison on clinically relevant joints", () => {
    it("returns 100 when filtering to only left_knee even though right_shoulder has a large discrepancy, because the filter tells the algorithm to ignore the shoulder entirely", () => {
      // Without filter: right_shoulder differs by 150° → overall would be < 100
      // With filter (left_knee only): left_knee matches perfectly → 100
      const s1 = makeState("s1", { left_knee: 90, right_shoulder: 30 })
      const s2 = makeState("s2", { left_knee: 90, right_shoulder: 180 })

      const withFilter = calculateStateSimilarity(s1, s2, new Set(["left_knee"]))
      const withoutFilter = calculateStateSimilarity(s1, s2)

      // Filter isolates the perfectly-matching knee → 100
      expect(withFilter).toBe(100)
      // Without filter, the shoulder discrepancy pulls the score below 100
      expect(withoutFilter).toBeLessThan(100)
      process.stdout.write(`[FILTER] relevantAngles=['left_knee'] → filtered=100, unfiltered=${withoutFilter.toFixed(2)}\n`)
    })

    it("returns 0 when the relevantAngles set is empty, because no angles pass the filter and there is nothing to compare", () => {
      // Even though both states have matching left_knee, the empty filter excludes it
      const s1 = makeState("s1", { left_knee: 90 })
      const s2 = makeState("s2", { left_knee: 90 })

      const result = calculateStateSimilarity(s1, s2, new Set())

      // Empty filter → zero common angles after filtering → score = 0
      expect(result).toBe(0)
      process.stdout.write("[FILTER] Empty relevantAngles set → correctly returned 0\n")
    })
  })
})

// ===========================================================================
// compareTemplates()
// ===========================================================================

describe("compareTemplates — compare a patient's recorded template against the ideal reference", () => {

  describe("identical templates (perfect similarity)", () => {
    it("returns similarity = 100 when both templates are exactly the same object, because no angle can differ from itself and every state matches perfectly", () => {
      // A single state with left_knee and right_knee both at 170° (near full extension)
      const state = makeState("state_0", { left_knee: 170, right_knee: 170 })
      const t = makeTemplate("knee-extension", [state], 5)

      const result = compareTemplates(t, t)

      // Identical templates: angle deviation = 0 → angleAccuracy = 100 → overall = 100
      expect(result.similarity).toBe(100)
      process.stdout.write(`[COMPARE] Identical templates → correctly returned similarity=100\n`)
    })
  })

  describe("very different templates (low similarity)", () => {
    it("returns a similarity below 60 when the reference shows full extension (170°) and the patient's template shows near-full-flexion (10°), reflecting a clinically significant form error", () => {
      // Reference: near-full extension; uploaded: near-full flexion — huge angular gap
      const refState = makeState("state_0", { left_knee: 170 })
      const upState  = makeState("state_0", { left_knee: 10 })
      const ref      = makeTemplate("knee-extension", [refState])
      const uploaded = makeTemplate("knee-extension", [upState])

      const result = compareTemplates(ref, uploaded)

      expect(result.similarity).toBeLessThan(60)
      process.stdout.write(`[COMPARE] Completely different angles (170° vs 10°) → correctly returned similarity=${result.similarity}\n`)
    })
  })

  describe("result shape — all required fields must be present", () => {
    it("produces a ComparisonResult with all required top-level and nested fields so downstream code can safely destructure without null checks", () => {
      const state  = makeState("state_0", { left_knee: 90 })
      const t      = makeTemplate("knee-extension", [state])
      const result = compareTemplates(t, t)

      // Top-level fields
      expect(typeof result.similarity).toBe("number")
      expect(typeof result.referenceReps).toBe("number")
      expect(typeof result.uploadedReps).toBe("number")
      expect(result.details).toBeDefined()

      // Nested detail fields
      expect(result.details.stateMatches).toBeDefined()
      expect(result.details.angleDeviations).toBeDefined()
      expect(result.details.referenceTemplate).toBeDefined()
      expect(result.details.uploadedTemplate).toBeDefined()

      process.stdout.write("[SHAPE] ComparisonResult has all required fields (similarity, reps, details.stateMatches, details.angleDeviations, details.referenceTemplate, details.uploadedTemplate)\n")
    })

    it("similarity is always an integer because Math.round is applied, ensuring the value can be displayed directly without further formatting", () => {
      // Slightly different angles will produce a non-integer before rounding
      const s1     = makeState("state_0", { left_knee: 90 })
      const s2     = makeState("state_0", { left_knee: 95 })
      const ref    = makeTemplate("knee-extension", [s1])
      const up     = makeTemplate("knee-extension", [s2])
      const result = compareTemplates(ref, up)

      expect(Number.isInteger(result.similarity)).toBe(true)
      process.stdout.write(`[SHAPE] similarity=${result.similarity} is an integer → correctly Math.rounded\n`)
    })

    it("referenceReps and uploadedReps are taken directly from their respective templates' recommendedReps fields", () => {
      const state  = makeState("state_0", { left_knee: 90 })
      const ref    = makeTemplate("knee-extension", [state], 5)
      const up     = makeTemplate("knee-extension", [state], 8)
      const result = compareTemplates(ref, up)

      // The comparison result must preserve both rep targets independently
      expect(result.referenceReps).toBe(5)
      expect(result.uploadedReps).toBe(8)
      process.stdout.write("[SHAPE] referenceReps=5, uploadedReps=8 → correctly taken from each template's recommendedReps\n")
    })
  })

  describe("exercise-type-specific angle filtering — only clinically relevant angles are compared", () => {
    it("ignores shoulder angles during a knee-extension comparison, so a patient with naturally different arm positions is not penalised for movement that has no bearing on the exercise", () => {
      // Both templates agree perfectly on knee angles but differ wildly on left_shoulder (130° gap)
      const refState = makeState("state_0", { left_knee: 170, right_knee: 170, left_shoulder: 30 })
      const upState  = makeState("state_0", { left_knee: 170, right_knee: 170, left_shoulder: 160 })
      const ref      = makeTemplate("knee-extension", [refState])
      const up       = makeTemplate("knee-extension", [upState])

      const result = compareTemplates(ref, up)

      // Knees match → high similarity score (shoulder filtered out)
      expect(result.similarity).toBeGreaterThan(85)
      // Shoulder deviation must NOT appear in the reported angle deviations
      expect(result.details.angleDeviations["left_shoulder"]).toBeUndefined()
      process.stdout.write(`[FILTER] Matching knees + differing shoulder → similarity=${result.similarity} (>85), left_shoulder correctly excluded from angleDeviations\n`)
    })

    it("falls back to comparing all available angles when the exerciseType is not registered in EXERCISE_CONFIGS, so unknown exercises still receive a meaningful score", () => {
      // Both templates use a custom angle that is identical → similarity should be 100
      const refState = makeState("state_0", { custom_angle: 90 })
      const upState  = makeState("state_0", { custom_angle: 90 })
      const ref      = makeTemplate("unknown-exercise", [refState])
      const up       = makeTemplate("unknown-exercise", [upState])

      // Should not throw — unknown exercise type is a graceful fallback, not an error
      const result = compareTemplates(ref, up)

      expect(result.similarity).toBe(100)
      process.stdout.write(`[FILTER] Unknown exercise type with identical angles → correctly returned similarity=100 without throwing\n`)
    })
  })

  describe("edge cases — graceful handling of empty or degenerate inputs", () => {
    it("does not throw when the uploaded template has an empty states array, because a patient may have an incomplete recording and the comparison must still return a result", () => {
      const refState = makeState("state_0", { left_knee: 90 })
      const ref      = makeTemplate("knee-extension", [refState])
      const up       = makeTemplate("knee-extension", [])

      // An empty uploaded states array should produce a low (0) similarity, not a crash
      expect(() => compareTemplates(ref, up)).not.toThrow()
      process.stdout.write("[EDGE] Uploaded template with empty states → compareTemplates did not throw\n")
    })
  })
})
