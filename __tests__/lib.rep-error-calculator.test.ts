/**
 * Tests for lib/rep-error-calculator.ts
 *
 * This module provides real-time and post-session per-rep error analysis.
 * It answers the question: "For a given rep, how far outside the acceptable
 * angle range was the patient's movement, and in which direction?"
 *
 * Exported functions:
 *
 *   calculateRepError(currentAngles, template, anglesOfInterest, repNumber, timestamp)
 *     Returns a RepError object with per-angle error breakdowns, an overall error
 *     score, and a derived formScore. Returns null when the primary angle is missing.
 *
 *   analyzeRepTrends(repErrors[])
 *     Summarises a series of RepError objects to detect improving/declining/stable trends,
 *     identify the best and worst reps, and surface commonly-occurring mistakes.
 *
 *   getErrorFeedback(repError | null)
 *     Maps a single RepError to a short feedback string shown in real-time during exercise.
 */

import {
  calculateRepError,
  analyzeRepTrends,
  getErrorFeedback,
} from "@/lib/rep-error-calculator"
import type { RepError } from "@/lib/rep-error-calculator"
import type { LearnedExerciseTemplate, DetectedState } from "@/lib/exercise-state-learner"

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

/**
 * Builds a DetectedState with fully-specified angle ranges.
 * The optional `name` parameter sets state.name independently from state.id,
 * allowing tests to verify that stateName in RepError comes from state.name.
 */
function makeState(
  id: string,
  angles: Record<string, { mean: number; min: number; max: number; stdDev: number }>,
  name = id
): DetectedState {
  return {
    id,
    name,
    description: "",
    angleRanges: angles,
    occurrences: [{ startTime: 0, endTime: 1, duration: 1 }],
    representativeTimestamp: 0.5,
  }
}

/** Builds a minimal LearnedExerciseTemplate wrapping the provided states. */
function makeTemplate(states: DetectedState[]): LearnedExerciseTemplate {
  return {
    exerciseName: "knee-extension",
    exerciseType: "knee-extension",
    states,
    transitions: [],
    repSequence: [],
    totalDuration: 10,
    recommendedReps: 3,
    metadata: {
      detectedAt: new Date().toISOString(),
      videoLength: 10,
      fps: 30,
      confidence: 80,
    },
  }
}

/**
 * Builds a RepError with a specified repNumber and overallError.
 * The percentError is capped at 100 to simulate the implementation's behaviour.
 * Used in analyzeRepTrends and getErrorFeedback tests.
 */
function makeRepError(
  repNumber: number,
  overallError: number,
  angleName = "left_knee"
): RepError {
  return {
    repNumber,
    timestamp: repNumber * 1.0,
    errors: {
      [angleName]: {
        expected: 90,
        actual: 90 + overallError,
        error: overallError,
        percentError: Math.min(100, (overallError / 20) * 100),
      },
    },
    overallError,
    formScore: Math.max(0, Math.min(100, 100 - overallError / 2)),
    stateName: "some-state",
  }
}

// ===========================================================================
// calculateRepError()
// ===========================================================================

describe("calculateRepError — compute per-angle error for a single exercise rep", () => {

  /** The set of angles the function should analyse for a knee-extension rep. */
  const anglesOfInterest = ["left_knee"]

  describe("null returns — when there is insufficient data to score a rep", () => {
    it("returns null when the current angles map does not contain any of the anglesOfInterest, because there is nothing to evaluate (camera may have lost the joint)", () => {
      // Template has left_knee, but the current frame has no angle data at all
      const state    = makeState("s0", { left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 } })
      const template = makeTemplate([state])

      // currentAngles is empty — left_knee is absent
      const result = calculateRepError({}, template, anglesOfInterest, 1, 0)

      expect(result).toBeNull()
      process.stdout.write("[ERROR] Primary angle absent from currentAngles → correctly returned null ✓\n")
    })

    it("returns null when the template has no states containing the primary angle, because the nearest state cannot be determined without the reference angle range", () => {
      // Template has right_shoulder but not left_knee (wrong joint in template)
      const state    = makeState("s0", { right_shoulder: { mean: 90, min: 80, max: 100, stdDev: 5 } })
      const template = makeTemplate([state])

      // Current frame has left_knee, but template has no left_knee range to compare against
      const result = calculateRepError({ left_knee: 90 }, template, anglesOfInterest, 1, 0)

      expect(result).toBeNull()
      process.stdout.write("[ERROR] Template has no primary angle data → correctly returned null ✓\n")
    })
  })

  describe("error = 0 (within acceptable range)", () => {
    it("returns error = 0 for left_knee when the actual angle (170°) is inside [min-buffer, max+buffer] = [155°, 185°], because the patient is within the allowed range of motion", () => {
      // Template state: left_knee mean=170, min=160, max=180. Buffer = stdDev = 5°.
      // Allowed range: [160-5=155, 180+5=185]. Actual=170 → inside → error = 0
      const state    = makeState("Straight", { left_knee: { mean: 170, min: 160, max: 180, stdDev: 5 } })
      const template = makeTemplate([state])

      const result = calculateRepError({ left_knee: 170 }, template, anglesOfInterest, 1, 0)

      expect(result).not.toBeNull()
      expect(result!.errors["left_knee"].error).toBe(0)
      process.stdout.write(`[ERROR] Actual=170 inside [155,185] → error=${result!.errors["left_knee"].error} (correctly 0) ✓\n`)
    })
  })

  describe("error > 0 (outside acceptable range)", () => {
    it("returns error ≈ 15 when actual angle (120°) exceeds max+buffer (100+5=105°), because over-extension beyond the allowed ceiling is a form error", () => {
      // Template: left_knee mean=90, min=80, max=100, stdDev=5.
      // Ceiling = 100 + 5 = 105. Actual = 120. Error = 120 - 105 = 15.
      const state    = makeState("Straight", { left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 } })
      const template = makeTemplate([state])

      const result = calculateRepError({ left_knee: 120 }, template, anglesOfInterest, 1, 0)

      expect(result).not.toBeNull()
      expect(result!.errors["left_knee"].error).toBeCloseTo(15, 0)
      process.stdout.write(`[ERROR] Actual=120 above ceiling=105 → error=${result!.errors["left_knee"].error.toFixed(1)} (expected ≈15) ✓\n`)
    })

    it("returns error ≈ 15 when actual angle (60°) is below min-buffer (80-5=75°), because under-flexion below the allowed floor is also a form error", () => {
      // Template: left_knee mean=90, min=80, max=100, stdDev=5.
      // Floor = 80 - 5 = 75. Actual = 60. Error = 75 - 60 = 15.
      const state    = makeState("Bent", { left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 } })
      const template = makeTemplate([state])

      const result = calculateRepError({ left_knee: 60 }, template, anglesOfInterest, 1, 0)

      expect(result).not.toBeNull()
      expect(result!.errors["left_knee"].error).toBeCloseTo(15, 0)
      process.stdout.write(`[ERROR] Actual=60 below floor=75 → error=${result!.errors["left_knee"].error.toFixed(1)} (expected ≈15) ✓\n`)
    })
  })

  describe("formScore — derived from overallError", () => {
    it("formScore equals max(0, min(100, 100 - overallError/2)), confirming the formula and clamp are applied correctly", () => {
      // With actual=120, overallError ≈ 15 → formScore ≈ 100 - 15/2 = 92.5
      const state    = makeState("Straight", { left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 } })
      const template = makeTemplate([state])

      const result = calculateRepError({ left_knee: 120 }, template, anglesOfInterest, 1, 0)

      expect(result).not.toBeNull()
      // The formScore must match the formula exactly
      const expectedFormScore = Math.max(0, Math.min(100, 100 - result!.overallError / 2))
      expect(result!.formScore).toBeCloseTo(expectedFormScore, 5)
      process.stdout.write(`[FORM] overallError=${result!.overallError.toFixed(2)} → formScore=${result!.formScore.toFixed(2)} (correctly derived from formula) ✓\n`)
    })
  })

  describe("metadata fields — repNumber, timestamp, stateName", () => {
    it("stateName is set from the nearest state's name property, not its id, confirming the function looks up the human-readable label", () => {
      // State with id='state_bent' but name='Bent State' — name should win
      const state    = makeState("state_bent", { left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 } }, "Bent State")
      const template = makeTemplate([state])

      const result = calculateRepError({ left_knee: 90 }, template, anglesOfInterest, 1, 0)

      expect(result!.stateName).toBe("Bent State")
      process.stdout.write(`[META] stateName correctly set to nearest state's name: '${result!.stateName}' ✓\n`)
    })

    it("repNumber and timestamp are taken directly from the function's repNumber and timestamp parameters, confirming they are passed through without modification", () => {
      const state    = makeState("s0", { left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 } })
      const template = makeTemplate([state])

      // Pass unusual but valid values to verify pass-through
      const result = calculateRepError({ left_knee: 90 }, template, anglesOfInterest, 7, 42.5)

      expect(result!.repNumber).toBe(7)
      expect(result!.timestamp).toBe(42.5)
      process.stdout.write(`[META] repNumber=${result!.repNumber} (expected 7), timestamp=${result!.timestamp} (expected 42.5) ✓\n`)
    })
  })

  describe("multiple angles of interest", () => {
    it("includes error entries for all anglesOfInterest (left_knee and right_knee) when both are present in the current angles and template", () => {
      const state    = makeState("s0", {
        left_knee:  { mean: 90, min: 80, max: 100, stdDev: 5 },
        right_knee: { mean: 90, min: 80, max: 100, stdDev: 5 },
      })
      const template = makeTemplate([state])

      const result = calculateRepError(
        { left_knee: 90, right_knee: 90 },
        template,
        ["left_knee", "right_knee"],
        1,
        0
      )

      expect(result).not.toBeNull()
      // Both angles must appear in the errors map
      expect(result!.errors["left_knee"]).toBeDefined()
      expect(result!.errors["right_knee"]).toBeDefined()
      process.stdout.write(`[ANGLES] Both left_knee and right_knee errors computed: left=${result!.errors["left_knee"].error}, right=${result!.errors["right_knee"].error} ✓\n`)
    })
  })
})

// ===========================================================================
// analyzeRepTrends()
// ===========================================================================

describe("analyzeRepTrends — summarise error patterns across all reps in a session", () => {

  describe("empty input — no reps recorded", () => {
    it("returns a summary with errorTrend='stable', all numeric fields = 0, and empty commonMistakes when given an empty array, because there are no reps to trend", () => {
      const summary = analyzeRepTrends([])

      expect(summary.errorTrend).toBe("stable")
      expect(summary.averageError).toBe(0)
      expect(summary.bestRep).toBe(0)
      expect(summary.worstRep).toBe(0)
      expect(summary.commonMistakes).toEqual([])
      process.stdout.write("[TRENDS] Empty input → stable trend, all zeros, no common mistakes ✓\n")
    })
  })

  describe("error trend detection", () => {
    it("detects 'improving' trend when the first half has significantly higher errors than the second half (30/28 vs 5/3 average error)", () => {
      const errors = [
        makeRepError(1, 30),
        makeRepError(2, 28),
        makeRepError(3, 5),
        makeRepError(4, 3),
      ]

      const summary = analyzeRepTrends(errors)

      expect(summary.errorTrend).toBe("improving")
      process.stdout.write(`[TRENDS] Errors [30,28,5,3] → trend='${summary.errorTrend}' (expected 'improving') ✓\n`)
    })

    it("detects 'declining' trend when the second half has significantly higher errors than the first half (2/3 vs 25/30 average error), indicating fatigue", () => {
      const errors = [
        makeRepError(1, 2),
        makeRepError(2, 3),
        makeRepError(3, 25),
        makeRepError(4, 30),
      ]

      const summary = analyzeRepTrends(errors)

      expect(summary.errorTrend).toBe("declining")
      process.stdout.write(`[TRENDS] Errors [2,3,25,30] → trend='${summary.errorTrend}' (expected 'declining') ✓\n`)
    })

    it("returns 'stable' when errors are consistent across all reps (within the small-difference threshold)", () => {
      const errors = [
        makeRepError(1, 10),
        makeRepError(2, 10),
        makeRepError(3, 10),
        makeRepError(4, 11),  // tiny difference — within threshold
      ]

      const summary = analyzeRepTrends(errors)

      expect(summary.errorTrend).toBe("stable")
      process.stdout.write(`[TRENDS] Errors [10,10,10,11] → trend='${summary.errorTrend}' (expected 'stable') ✓\n`)
    })
  })

  describe("bestRep and worstRep identification", () => {
    it("identifies the rep with the lowest overallError as bestRep (rep 2 with error=5 in this case)", () => {
      const errors = [
        makeRepError(1, 20),
        makeRepError(2, 5),   // ← lowest error → best rep
        makeRepError(3, 15),
      ]

      const summary = analyzeRepTrends(errors)

      expect(summary.bestRep).toBe(2)
      process.stdout.write(`[TRENDS] Errors by rep: [1→20, 2→5, 3→15] → bestRep=${summary.bestRep} (expected 2) ✓\n`)
    })

    it("identifies the rep with the highest overallError as worstRep (rep 3 with error=50 in this case)", () => {
      const errors = [
        makeRepError(1, 20),
        makeRepError(2, 5),
        makeRepError(3, 50),  // ← highest error → worst rep
      ]

      const summary = analyzeRepTrends(errors)

      expect(summary.worstRep).toBe(3)
      process.stdout.write(`[TRENDS] Errors by rep: [1→20, 2→5, 3→50] → worstRep=${summary.worstRep} (expected 3) ✓\n`)
    })
  })

  describe("averageError calculation", () => {
    it("computes the correct arithmetic average of overallError values across all reps", () => {
      // (10 + 20) / 2 = 15
      const errors = [makeRepError(1, 10), makeRepError(2, 20)]

      const summary = analyzeRepTrends(errors)

      expect(summary.averageError).toBeCloseTo(15, 5)
      process.stdout.write(`[TRENDS] Errors [10, 20] → averageError=${summary.averageError} (expected 15) ✓\n`)
    })
  })

  describe("commonMistakes — angles that are frequently out of range", () => {
    it("includes 'left knee' in commonMistakes when the left_knee's average percentError exceeds 20%, indicating a systematic form problem the patient should address", () => {
      // percentError is set to 100 (capped) for large errors in makeRepError
      const errors = [
        makeRepError(1, 100, "left_knee"),  // percentError = 100 (capped)
        makeRepError(2, 100, "left_knee"),  // percentError = 100 (capped)
      ]

      const summary = analyzeRepTrends(errors)

      // 'left knee' (formatted from 'left_knee') must appear in common mistakes
      expect(summary.commonMistakes.some((m) => m.includes("left knee"))).toBe(true)
      process.stdout.write(`[TRENDS] left_knee avgPercent=100% → commonMistakes: [${summary.commonMistakes.join(", ")}] ✓\n`)
    })

    it("does NOT include an angle in commonMistakes when its average percentError is 0%, because consistent perfect form should not be flagged as a mistake", () => {
      // overallError=0 → percentError=0 → below 20% threshold
      const errors = [makeRepError(1, 0, "left_knee"), makeRepError(2, 0, "left_knee")]

      const summary = analyzeRepTrends(errors)

      expect(summary.commonMistakes).toHaveLength(0)
      process.stdout.write("[TRENDS] left_knee avgPercent=0% → commonMistakes=[] (no mistake flagged) ✓\n")
    })
  })
})

// ===========================================================================
// getErrorFeedback()
// ===========================================================================

describe("getErrorFeedback — map a single rep's error to a real-time feedback string", () => {

  describe("null input (no rep being evaluated)", () => {
    it("returns 'Keep moving...' when called with null, providing a neutral prompt that encourages continued movement without implying error", () => {
      expect(getErrorFeedback(null)).toBe("Keep moving...")
      process.stdout.write("[FEEDBACK] null input → 'Keep moving...' ✓\n")
    })
  })

  describe("overallError < 5 (near-perfect form)", () => {
    it("returns '✓ Perfect form!' for overallError=4, rewarding the patient with a clear visual success indicator", () => {
      const err = makeRepError(1, 4)   // 4 < 5 → perfect tier

      expect(getErrorFeedback(err)).toBe("✓ Perfect form!")
      process.stdout.write("[FEEDBACK] overallError=4 → '✓ Perfect form!' ✓\n")
    })
  })

  describe("overallError in [5, 10) (minor adjustments needed)", () => {
    it("returns 'Good form, minor adjustments' for overallError=7, acknowledging good overall movement while noting small corrections", () => {
      const err = makeRepError(1, 7)   // 5 <= 7 < 10 → minor adjustments tier

      expect(getErrorFeedback(err)).toBe("Good form, minor adjustments")
      process.stdout.write("[FEEDBACK] overallError=7 → 'Good form, minor adjustments' ✓\n")
    })
  })

  describe("overallError in [10, 20) (angle-specific correction)", () => {
    it("returns a string mentioning 'left knee' (the joint name) and 'more' or 'less' for overallError=15, so the patient knows exactly which joint to correct and in which direction", () => {
      const err = makeRepError(1, 15)  // 10 <= 15 < 20 → angle-specific tier
      const feedback = getErrorFeedback(err)

      // Must mention the specific joint
      expect(feedback).toContain("left knee")
      // Must indicate a direction
      expect(feedback).toMatch(/less|more/)

      process.stdout.write(`[FEEDBACK] overallError=15 → angle-specific message: '${feedback}' ✓\n`)
    })

    it("uses 'more' in the feedback when actual angle is less than expected, indicating the patient needs to increase their range of motion", () => {
      const err: RepError = {
        repNumber: 1,
        timestamp: 0,
        errors: {
          left_knee: { expected: 170, actual: 150, error: 15, percentError: 40 },
        },
        overallError: 15,
        formScore: 92,
        stateName: "Straight",
      }

      const feedback = getErrorFeedback(err)

      // actual (150) < expected (170) → patient needs to go further → 'more'
      expect(feedback).toContain("more")
      process.stdout.write(`[FEEDBACK] actual=150 < expected=170 → feedback contains 'more': '${feedback}' ✓\n`)
    })

    it("uses 'less' in the feedback when actual angle is greater than expected, indicating the patient is over-extending and should ease back", () => {
      const err: RepError = {
        repNumber: 1,
        timestamp: 0,
        errors: {
          left_knee: { expected: 90, actual: 120, error: 15, percentError: 40 },
        },
        overallError: 15,
        formScore: 92,
        stateName: "Bent",
      }

      const feedback = getErrorFeedback(err)

      // actual (120) > expected (90) → patient is over-bending → 'less'
      expect(feedback).toContain("less")
      process.stdout.write(`[FEEDBACK] actual=120 > expected=90 → feedback contains 'less': '${feedback}' ✓\n`)
    })
  })

  describe("overallError >= 20 (general form warning)", () => {
    it("returns '⚠ Check your form' for overallError=25, providing a clear visual warning when the error is too high for a specific joint message to be actionable", () => {
      const err = makeRepError(1, 25)  // 25 >= 20 → general warning tier

      expect(getErrorFeedback(err)).toBe("⚠ Check your form")
      process.stdout.write("[FEEDBACK] overallError=25 → '⚠ Check your form' ✓\n")
    })

    it("also returns '⚠ Check your form' at the boundary value of exactly 20, confirming the threshold is >= 20 (not > 20)", () => {
      // overallError exactly at the boundary — should still be '⚠ Check your form'
      const err: RepError = {
        repNumber: 1,
        timestamp: 0,
        errors: {
          left_knee: { expected: 170, actual: 120, error: 20, percentError: 50 },
        },
        overallError: 20,
        formScore: 88,
        stateName: "Straight",
      }

      expect(getErrorFeedback(err)).toBe("⚠ Check your form")
      process.stdout.write("[FEEDBACK] overallError=20 (boundary) → '⚠ Check your form' ✓\n")
    })
  })
})
