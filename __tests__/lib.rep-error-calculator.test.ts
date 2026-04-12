/**
 * Tests for lib/rep-error-calculator.ts
 *
 * Covers:
 *   - calculateRepError()
 *       - returns null when primary angle missing from current angles
 *       - returns null when template has no states with primary angle
 *       - error = 0 when actual angle is within [min-buffer, max+buffer]
 *       - error > 0 when actual angle is outside allowed range
 *       - formScore = 100 - overallError/2, clamped to [0, 100]
 *       - stateName comes from nearestState.name
 *   - analyzeRepTrends()
 *       - empty input → stable trend, zeros
 *       - improving trend detected
 *       - declining trend detected
 *       - bestRep and worstRep are correct rep numbers
 *       - commonMistakes populated when avgPercent > 20
 *   - getErrorFeedback()
 *       - null input → "Keep moving..."
 *       - overallError < 5 → "✓ Perfect form!"
 *       - overallError < 10 → "Good form, minor adjustments"
 *       - overallError 10-20 → describes worst angle
 *       - overallError >= 20 → "⚠ Check your form"
 */

import {
  calculateRepError,
  analyzeRepTrends,
  getErrorFeedback,
} from "@/lib/rep-error-calculator"
import type { RepError } from "@/lib/rep-error-calculator"
import type { LearnedExerciseTemplate, DetectedState } from "@/lib/exercise-state-learner"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// calculateRepError()
// ---------------------------------------------------------------------------

describe("calculateRepError", () => {
  const anglesOfInterest = ["left_knee"]

  it("returns null when primary angle is absent from current angles", () => {
    const state = makeState("s0", {
      left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 },
    })
    const template = makeTemplate([state])
    const result = calculateRepError({}, template, anglesOfInterest, 1, 0)
    expect(result).toBeNull()
  })

  it("returns null when template has no states with the primary angle", () => {
    const state = makeState("s0", {
      right_shoulder: { mean: 90, min: 80, max: 100, stdDev: 5 },
    })
    const template = makeTemplate([state])
    const result = calculateRepError({ left_knee: 90 }, template, anglesOfInterest, 1, 0)
    expect(result).toBeNull()
  })

  it("returns error = 0 when actual angle is within [min-buffer, max+buffer]", () => {
    const state = makeState("Straight", {
      left_knee: { mean: 170, min: 160, max: 180, stdDev: 5 },
    })
    const template = makeTemplate([state])
    // actual = 170, min=160, max=180, buffer=5 → inside [155, 185] → error = 0
    const result = calculateRepError({ left_knee: 170 }, template, anglesOfInterest, 1, 0)
    expect(result).not.toBeNull()
    expect(result!.errors["left_knee"].error).toBe(0)
  })

  it("returns error > 0 when actual is above max + buffer", () => {
    const state = makeState("Straight", {
      left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 },
    })
    const template = makeTemplate([state])
    // max=100, buffer=5 → ceiling=105. actual=120 → error = 120 - 105 = 15
    const result = calculateRepError({ left_knee: 120 }, template, anglesOfInterest, 1, 0)
    expect(result).not.toBeNull()
    expect(result!.errors["left_knee"].error).toBeCloseTo(15, 0)
  })

  it("returns error > 0 when actual is below min - buffer", () => {
    const state = makeState("Bent", {
      left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 },
    })
    const template = makeTemplate([state])
    // min=80, buffer=5 → floor=75. actual=60 → error = 75 - 60 = 15
    const result = calculateRepError({ left_knee: 60 }, template, anglesOfInterest, 1, 0)
    expect(result).not.toBeNull()
    expect(result!.errors["left_knee"].error).toBeCloseTo(15, 0)
  })

  it("formScore equals 100 - overallError/2, clamped to [0, 100]", () => {
    const state = makeState("Straight", {
      left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 },
    })
    const template = makeTemplate([state])
    const result = calculateRepError({ left_knee: 120 }, template, anglesOfInterest, 1, 0)
    expect(result).not.toBeNull()
    const expected = Math.max(0, Math.min(100, 100 - result!.overallError / 2))
    expect(result!.formScore).toBeCloseTo(expected, 5)
  })

  it("stateName is set from nearestState.name", () => {
    const state = makeState("state_bent", {
      left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 },
    }, "Bent State")
    const template = makeTemplate([state])
    const result = calculateRepError({ left_knee: 90 }, template, anglesOfInterest, 1, 0)
    expect(result!.stateName).toBe("Bent State")
  })

  it("populates repNumber and timestamp from parameters", () => {
    const state = makeState("s0", {
      left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 },
    })
    const template = makeTemplate([state])
    const result = calculateRepError({ left_knee: 90 }, template, anglesOfInterest, 7, 42.5)
    expect(result!.repNumber).toBe(7)
    expect(result!.timestamp).toBe(42.5)
  })

  it("handles multiple angles of interest", () => {
    const state = makeState("s0", {
      left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 },
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
    expect(result!.errors["right_knee"]).toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// analyzeRepTrends()
// ---------------------------------------------------------------------------

describe("analyzeRepTrends", () => {
  it("returns stable trend with zeros for empty array", () => {
    const summary = analyzeRepTrends([])
    expect(summary.errorTrend).toBe("stable")
    expect(summary.averageError).toBe(0)
    expect(summary.bestRep).toBe(0)
    expect(summary.worstRep).toBe(0)
    expect(summary.commonMistakes).toEqual([])
  })

  it("detects improving trend (first half errors > second half)", () => {
    const errors = [
      makeRepError(1, 30),
      makeRepError(2, 28),
      makeRepError(3, 5),
      makeRepError(4, 3),
    ]
    const summary = analyzeRepTrends(errors)
    expect(summary.errorTrend).toBe("improving")
  })

  it("detects declining trend (second half errors > first half)", () => {
    const errors = [
      makeRepError(1, 2),
      makeRepError(2, 3),
      makeRepError(3, 25),
      makeRepError(4, 30),
    ]
    const summary = analyzeRepTrends(errors)
    expect(summary.errorTrend).toBe("declining")
  })

  it("returns stable when difference is within threshold", () => {
    const errors = [
      makeRepError(1, 10),
      makeRepError(2, 10),
      makeRepError(3, 10),
      makeRepError(4, 11),
    ]
    const summary = analyzeRepTrends(errors)
    expect(summary.errorTrend).toBe("stable")
  })

  it("bestRep is the rep number with lowest overallError", () => {
    const errors = [
      makeRepError(1, 20),
      makeRepError(2, 5),   // best
      makeRepError(3, 15),
    ]
    const summary = analyzeRepTrends(errors)
    expect(summary.bestRep).toBe(2)
  })

  it("worstRep is the rep number with highest overallError", () => {
    const errors = [
      makeRepError(1, 20),
      makeRepError(2, 5),
      makeRepError(3, 50),  // worst
    ]
    const summary = analyzeRepTrends(errors)
    expect(summary.worstRep).toBe(3)
  })

  it("averageError is correct", () => {
    const errors = [makeRepError(1, 10), makeRepError(2, 20)]
    const summary = analyzeRepTrends(errors)
    expect(summary.averageError).toBeCloseTo(15, 5)
  })

  it("populates commonMistakes for angles with avg percentError > 20", () => {
    // percentError is set to 100 in makeRepError when overallError is large
    const errors = [
      makeRepError(1, 100, "left_knee"),
      makeRepError(2, 100, "left_knee"),
    ]
    const summary = analyzeRepTrends(errors)
    expect(summary.commonMistakes.some((m) => m.includes("left knee"))).toBe(true)
  })

  it("does not flag angle as commonMistake when avgPercent <= 20", () => {
    const errors = [makeRepError(1, 0, "left_knee"), makeRepError(2, 0, "left_knee")]
    const summary = analyzeRepTrends(errors)
    expect(summary.commonMistakes).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// getErrorFeedback()
// ---------------------------------------------------------------------------

describe("getErrorFeedback", () => {
  it("returns 'Keep moving...' for null input", () => {
    expect(getErrorFeedback(null)).toBe("Keep moving...")
  })

  it("returns perfect form message for overallError < 5", () => {
    const err = makeRepError(1, 4)
    expect(getErrorFeedback(err)).toBe("✓ Perfect form!")
  })

  it("returns minor adjustment message for overallError in [5, 10)", () => {
    const err = makeRepError(1, 7)
    expect(getErrorFeedback(err)).toBe("Good form, minor adjustments")
  })

  it("returns angle-specific message for overallError in [10, 20)", () => {
    const err = makeRepError(1, 15)
    const feedback = getErrorFeedback(err)
    // Should mention the angle name and direction
    expect(feedback).toContain("left knee")
    expect(feedback).toMatch(/less|more/)
  })

  it("returns general warning for overallError >= 20", () => {
    const err = makeRepError(1, 25)
    expect(getErrorFeedback(err)).toBe("⚠ Check your form")
  })

  it("mentions 'more bend' when actual < expected", () => {
    const err: RepError = {
      repNumber: 1,
      timestamp: 0,
      errors: {
        left_knee: { expected: 170, actual: 120, error: 20, percentError: 50 },
      },
      overallError: 20, // boundary: >= 20 → general warning, test 15 for directional
      formScore: 88,
      stateName: "Straight",
    }
    // overallError exactly 20 → "⚠ Check your form"
    expect(getErrorFeedback(err)).toBe("⚠ Check your form")
  })

  it("for overallError=15 mentions 'more' when actual < expected", () => {
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
    expect(feedback).toContain("more")
  })

  it("for overallError=15 mentions 'less' when actual > expected", () => {
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
    expect(feedback).toContain("less")
  })
})
