/**
 * Tests for lib/feedback-generator.ts
 *
 * Covers:
 *   - generatePostSessionFeedback()
 *       - similarity >= 85 → "Great form overall!"
 *       - similarity in [60, 84] → "Decent effort..."
 *       - similarity < 60 → "Needs some work..."
 *       - primaryAngle deviation > 8, patient higher + allowProgression → goFurther phrase
 *       - primaryAngle deviation > 8, patient lower → extendMore phrase
 *       - primaryAngle deviation > 8, patient higher + NO progression → tooFar phrase
 *       - secondary angle dev > 18 → warning message
 *       - secondary angle dev in (8, 18] → info message
 *       - formScore >= 85 → "Excellent form!"
 *       - formScore < 50 → "Focus on controlled movement"
 *       - perRepDetails improvement → "form improved" message
 *       - perRepDetails declining form → "Form dropped" message
 *   - logFeedback() — does not throw, calls console.log
 */

import {
  generatePostSessionFeedback,
  logFeedback,
} from "@/lib/feedback-generator"
import type { FeedbackMessage } from "@/lib/feedback-generator"
import type { ComparisonResult } from "@/lib/comparison"
import type { SessionScore } from "@/lib/progress-scorer"
import type { DetectedState, LearnedExerciseTemplate } from "@/lib/exercise-state-learner"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeState(
  id: string,
  angles: Record<string, number>
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
    occurrences: [{ startTime: 0, endTime: 1, duration: 1 }],
    representativeTimestamp: 0.5,
  }
}

function makeTemplate(
  exerciseType: string,
  states: DetectedState[]
): LearnedExerciseTemplate {
  return {
    exerciseName: exerciseType,
    exerciseType,
    states,
    transitions: [],
    repSequence: [],
    totalDuration: 10,
    recommendedReps: 5,
    metadata: { detectedAt: "", videoLength: 10, fps: 30, confidence: 80 },
  }
}

function makeComparison(
  similarity: number,
  angleDeviations: Record<string, number> = {},
  refAngles: Record<string, number> = {},
  upAngles: Record<string, number> = {}
): ComparisonResult {
  const refState = makeState("ref", { ...refAngles, left_knee: refAngles["left_knee"] ?? 150 })
  const upState = makeState("up", { ...upAngles, left_knee: upAngles["left_knee"] ?? 150 })

  return {
    similarity,
    referenceReps: 5,
    uploadedReps: 5,
    details: {
      referenceTemplate: makeTemplate("knee-extension", [refState]),
      uploadedTemplate: makeTemplate("knee-extension", [upState]),
      stateMatches: {},
      angleDeviations,
    },
  }
}

function makeScore(
  formScore: number,
  progressScore = 50,
  validReps = 5,
  perRepFormScores: number[] = []
): SessionScore {
  const perRepDetails = perRepFormScores.map((fs, i) => ({
    rep: i + 1,
    valid: true,
    good: true,
    peakAngle: 150,
    progressPercent: progressScore,
    formScore: fs,
  }))
  return {
    totalReps: perRepDetails.length || 5,
    validReps,
    goodReps: 3,
    progressScore,
    formScore,
    perRepDetails,
  }
}

// ---------------------------------------------------------------------------
// generatePostSessionFeedback()
// ---------------------------------------------------------------------------

describe("generatePostSessionFeedback", () => {
  describe("overall similarity message", () => {
    it("returns 'Great form overall!' for similarity >= 85", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(90),
        makeScore(70),
        "knee-extension",
        false
      )
      expect(msgs[0]).toEqual({ severity: "success", message: "Great form overall!" })
    })

    it("returns 'Decent effort...' for similarity in [60, 84]", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(70),
        makeScore(70),
        "knee-extension",
        false
      )
      expect(msgs[0].severity).toBe("info")
      expect(msgs[0].message).toMatch(/Decent effort/)
    })

    it("returns 'Needs some work...' for similarity < 60", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(40),
        makeScore(70),
        "knee-extension",
        false
      )
      expect(msgs[0].severity).toBe("warning")
      expect(msgs[0].message).toMatch(/Needs some work/)
    })
  })

  describe("primary angle deviation messages", () => {
    it("emits goFurther phrase when patient is higher + allowProgression + dev > 8", () => {
      const comparison = makeComparison(
        75,
        { left_knee: 15 },      // deviation = 15 > 8
        { left_knee: 140 },     // refAvg
        { left_knee: 160 },     // upAvg > refAvg
      )
      const msgs = generatePostSessionFeedback(comparison, makeScore(70), "knee-extension", true)
      const primaryMsg = msgs.find((m) => m.message === "Try to extend further")
      expect(primaryMsg).toBeDefined()
      expect(primaryMsg!.severity).toBe("success")
    })

    it("emits tooFar phrase when patient is higher but NO progression + dev > 8", () => {
      const comparison = makeComparison(
        75,
        { left_knee: 15 },
        { left_knee: 140 },
        { left_knee: 160 },
      )
      const msgs = generatePostSessionFeedback(comparison, makeScore(70), "knee-extension", false)
      const primaryMsg = msgs.find((m) => m.message === "Ease back, you're extending too much")
      expect(primaryMsg).toBeDefined()
      expect(primaryMsg!.severity).toBe("warning")
    })

    it("emits extendMore phrase when patient is lower + dev > 8", () => {
      const comparison = makeComparison(
        75,
        { left_knee: 15 },
        { left_knee: 160 },  // refAvg higher
        { left_knee: 130 },  // upAvg lower
      )
      const msgs = generatePostSessionFeedback(comparison, makeScore(70), "knee-extension", false)
      const primaryMsg = msgs.find((m) => m.message === "Straighten your knee more")
      expect(primaryMsg).toBeDefined()
    })

    it("does not emit primary angle message when deviation <= 8", () => {
      const comparison = makeComparison(
        90,
        { left_knee: 5 },   // small deviation
        { left_knee: 150 },
        { left_knee: 150 },
      )
      const msgs = generatePostSessionFeedback(comparison, makeScore(80), "knee-extension", false)
      const extendMsg = msgs.find((m) => m.message === "Straighten your knee more")
      expect(extendMsg).toBeUndefined()
    })
  })

  describe("secondary angle drift messages", () => {
    it("emits warning for secondary angle with dev > 18", () => {
      const comparison = makeComparison(
        75,
        { left_leg_segment: 25 },  // secondary angle > 18 → warning
      )
      const msgs = generatePostSessionFeedback(comparison, makeScore(70), "knee-extension", false)
      const driftMsg = msgs.find((m) => m.severity === "warning" && m.message.includes("lower left leg"))
      expect(driftMsg).toBeDefined()
    })

    it("emits info for secondary angle with dev in (8, 18]", () => {
      const comparison = makeComparison(
        75,
        { left_leg_segment: 12 },
      )
      const msgs = generatePostSessionFeedback(comparison, makeScore(70), "knee-extension", false)
      const driftMsg = msgs.find((m) => m.severity === "info" && m.message.includes("lower left leg"))
      expect(driftMsg).toBeDefined()
    })

    it("does not emit drift message when secondary dev <= 8", () => {
      const comparison = makeComparison(
        90,
        { left_leg_segment: 5 },
      )
      const msgs = generatePostSessionFeedback(comparison, makeScore(70), "knee-extension", false)
      const driftMsg = msgs.find((m) => m.message.includes("lower left leg"))
      expect(driftMsg).toBeUndefined()
    })
  })

  describe("form score messages", () => {
    it("emits 'Excellent form!' for formScore >= 85", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(90),
        makeScore(90),
        "knee-extension",
        false
      )
      const formMsg = msgs.find((m) => m.message === "Excellent form!")
      expect(formMsg).toBeDefined()
      expect(formMsg!.severity).toBe("success")
    })

    it("emits 'Focus on controlled movement' for formScore < 50", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(90),
        makeScore(40),
        "knee-extension",
        false
      )
      const formMsg = msgs.find((m) => m.message === "Focus on controlled movement")
      expect(formMsg).toBeDefined()
      expect(formMsg!.severity).toBe("warning")
    })

    it("emits neither excellent nor warning for formScore in [50, 84]", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(90),
        makeScore(65),
        "knee-extension",
        false
      )
      expect(msgs.some((m) => m.message === "Excellent form!")).toBe(false)
      expect(msgs.some((m) => m.message === "Focus on controlled movement")).toBe(false)
    })
  })

  describe("progress messages (allowProgression = true)", () => {
    it("emits 'close to ideal range' for progressScore >= 80", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(85),
        makeScore(80, 85, 5),
        "knee-extension",
        true
      )
      const msg = msgs.find((m) => m.message.includes("close to ideal range"))
      expect(msg).toBeDefined()
    })

    it("emits 'Good progress' for progressScore in [40, 79]", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(85),
        makeScore(80, 60, 5),
        "knee-extension",
        true
      )
      const msg = msgs.find((m) => m.message.includes("Good progress"))
      expect(msg).toBeDefined()
    })

    it("emits 'try to go a bit further' for progressScore < 20 and validReps > 0", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(85),
        makeScore(80, 10, 5),
        "knee-extension",
        true
      )
      const msg = msgs.find((m) => m.message.includes("Try to go a bit further"))
      expect(msg).toBeDefined()
    })

    it("does not emit progress messages when allowProgression = false", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(85),
        makeScore(80, 85, 5),
        "knee-extension",
        false
      )
      const msg = msgs.find((m) => m.message.includes("close to ideal range"))
      expect(msg).toBeUndefined()
    })
  })

  describe("per-rep trend messages", () => {
    it("emits form improvement message when second half is better", () => {
      // First half form low, second half form high
      const msgs = generatePostSessionFeedback(
        makeComparison(85),
        makeScore(80, 60, 6, [50, 50, 50, 90, 90, 90]),
        "knee-extension",
        false
      )
      const msg = msgs.find((m) => m.message.includes("improved as you went"))
      expect(msg).toBeDefined()
      expect(msg!.severity).toBe("success")
    })

    it("emits fatigue message when form drops in second half", () => {
      // First half form high, second half form low
      const msgs = generatePostSessionFeedback(
        makeComparison(85),
        makeScore(80, 60, 6, [90, 90, 90, 50, 50, 50]),
        "knee-extension",
        false
      )
      const msg = msgs.find((m) => m.message.includes("fatigue"))
      expect(msg).toBeDefined()
      expect(msg!.severity).toBe("info")
    })

    it("does not emit trend message with fewer than 3 reps", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(85),
        makeScore(80, 60, 2, [90, 50]),
        "knee-extension",
        false
      )
      const improvementMsg = msgs.find((m) => m.message.includes("improved as you went"))
      const fatigueMsg = msgs.find((m) => m.message.includes("fatigue"))
      expect(improvementMsg).toBeUndefined()
      expect(fatigueMsg).toBeUndefined()
    })
  })

  describe("return type", () => {
    it("always returns an array of FeedbackMessage objects", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(85),
        makeScore(80),
        "knee-extension",
        false
      )
      expect(Array.isArray(msgs)).toBe(true)
      for (const m of msgs) {
        expect(["success", "info", "warning"]).toContain(m.severity)
        expect(typeof m.message).toBe("string")
      }
    })
  })
})

// ---------------------------------------------------------------------------
// logFeedback()
// ---------------------------------------------------------------------------

describe("logFeedback", () => {
  it("calls console.log without throwing", () => {
    const msgs: FeedbackMessage[] = [
      { severity: "success", message: "Great!" },
      { severity: "warning", message: "Watch out" },
      { severity: "info", message: "FYI" },
    ]
    expect(() => logFeedback(msgs)).not.toThrow()
  })

  it("handles empty array without throwing", () => {
    expect(() => logFeedback([])).not.toThrow()
  })
})
