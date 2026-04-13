/**
 * Tests for lib/feedback-generator.ts
 *
 * This module turns raw numerical scores into human-readable feedback messages
 * shown to the patient after each exercise session. Good feedback is critical:
 * it tells the patient whether to push further, ease back, or maintain form.
 *
 * Exported functions:
 *
 *   generatePostSessionFeedback(comparison, score, exerciseType, allowProgression)
 *     Returns an array of FeedbackMessage objects, each with a severity
 *     ("success" | "info" | "warning") and a message string.
 *     Messages cover: overall form quality, specific angle corrections, form score,
 *     progress toward the ideal range, and rep-by-rep form trends.
 *
 *   logFeedback(messages)
 *     Utility: prints feedback to the console. Must not throw.
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
// Factories — build minimal valid inputs for each function
// ---------------------------------------------------------------------------

function makeState(id: string, angles: Record<string, number>): DetectedState {
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

function makeTemplate(exerciseType: string, states: DetectedState[]): LearnedExerciseTemplate {
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

/**
 * Builds a ComparisonResult with configurable similarity and angle deviations.
 * refAngles and upAngles set the mean values of left_knee in the reference and
 * uploaded templates respectively — this drives the "direction" of primary angle feedback.
 */
function makeComparison(
  similarity: number,
  angleDeviations: Record<string, number> = {},
  refAngles: Record<string, number> = {},
  upAngles: Record<string, number> = {}
): ComparisonResult {
  const refState = makeState("ref", { ...refAngles, left_knee: refAngles["left_knee"] ?? 150 })
  const upState  = makeState("up",  { ...upAngles,  left_knee: upAngles["left_knee"]  ?? 150 })

  return {
    similarity,
    referenceReps: 5,
    uploadedReps: 5,
    details: {
      referenceTemplate: makeTemplate("knee-extension", [refState]),
      uploadedTemplate:  makeTemplate("knee-extension", [upState]),
      stateMatches: {},
      angleDeviations,
    },
  }
}

/**
 * Builds a SessionScore with configurable form score, progress score, valid reps,
 * and optional per-rep form scores (used to test trend detection).
 */
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

// ===========================================================================
// generatePostSessionFeedback()
// ===========================================================================

describe("generatePostSessionFeedback — convert numerical session scores into patient-facing messages", () => {

  // ── Overall similarity tier ──────────────────────────────────────────────

  describe("overall similarity message — three tiers based on similarity score", () => {
    it("emits a 'success' severity message 'Great form overall!' when similarity >= 85, because the patient's movement closely matched the reference", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(90),   // 90 >= 85 → top tier
        makeScore(70),
        "knee-extension",
        false
      )

      // The very first message should be the overall assessment
      expect(msgs[0]).toEqual({ severity: "success", message: "Great form overall!" })
      process.stdout.write("[FEEDBACK] similarity=90 → first message: { severity:'success', message:'Great form overall!' } ✓\n")
    })

    it("emits an 'info' severity message containing 'Decent effort' when similarity is in [60, 84], because the patient is on the right track but has room for improvement", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(70),   // 70 is in the middle tier
        makeScore(70),
        "knee-extension",
        false
      )

      expect(msgs[0].severity).toBe("info")
      expect(msgs[0].message).toMatch(/Decent effort/)
      process.stdout.write(`[FEEDBACK] similarity=70 → first message: { severity:'info', message:'${msgs[0].message}' } ✓\n`)
    })

    it("emits a 'warning' severity message containing 'Needs some work' when similarity < 60, because significant deviation from the reference requires actionable correction", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(40),   // 40 < 60 → bottom tier
        makeScore(70),
        "knee-extension",
        false
      )

      expect(msgs[0].severity).toBe("warning")
      expect(msgs[0].message).toMatch(/Needs some work/)
      process.stdout.write(`[FEEDBACK] similarity=40 → first message: { severity:'warning', message:'${msgs[0].message}' } ✓\n`)
    })
  })

  // ── Primary angle deviation messages ────────────────────────────────────

  describe("primary angle deviation messages — direction-aware corrections when deviation > 8°", () => {
    it("emits 'Try to extend further' (success) when the patient's angle is HIGHER than the reference AND allowProgression=true, because this indicates the patient has progressed safely beyond the reference", () => {
      const comparison = makeComparison(
        75,
        { left_knee: 15 },   // deviation = 15° > 8° threshold
        { left_knee: 140 },  // reference average
        { left_knee: 160 },  // patient average — HIGHER than reference
      )

      const msgs = generatePostSessionFeedback(comparison, makeScore(70), "knee-extension", true)
      const primaryMsg = msgs.find((m) => m.message === "Try to extend further")

      expect(primaryMsg).toBeDefined()
      expect(primaryMsg!.severity).toBe("success")
      process.stdout.write("[FEEDBACK] Patient higher + allowProgression + dev>8 → found message: 'Try to extend further' (success) ✓\n")
    })

    it("emits 'Ease back, you're extending too much' (warning) when patient is HIGHER than reference but allowProgression=false, because over-extending without clearance risks injury", () => {
      const comparison = makeComparison(
        75,
        { left_knee: 15 },
        { left_knee: 140 },
        { left_knee: 160 },  // patient is higher — but not allowed to progress
      )

      const msgs = generatePostSessionFeedback(comparison, makeScore(70), "knee-extension", false)
      const primaryMsg = msgs.find((m) => m.message === "Ease back, you're extending too much")

      expect(primaryMsg).toBeDefined()
      expect(primaryMsg!.severity).toBe("warning")
      process.stdout.write("[FEEDBACK] Patient higher + allowProgression=false + dev>8 → found message: 'Ease back, you're extending too much' (warning) ✓\n")
    })

    it("emits 'Straighten your knee more' when the patient's angle is LOWER than the reference, because they are not reaching the target extension", () => {
      const comparison = makeComparison(
        75,
        { left_knee: 15 },
        { left_knee: 160 },  // reference — higher
        { left_knee: 130 },  // patient — LOWER than reference
      )

      const msgs = generatePostSessionFeedback(comparison, makeScore(70), "knee-extension", false)
      const primaryMsg = msgs.find((m) => m.message === "Straighten your knee more")

      expect(primaryMsg).toBeDefined()
      process.stdout.write("[FEEDBACK] Patient lower + dev>8 → found message: 'Straighten your knee more' ✓\n")
    })

    it("does NOT emit any primary angle correction when deviation is 5° (<= 8° threshold), because small deviations are within acceptable form tolerance", () => {
      const comparison = makeComparison(
        90,
        { left_knee: 5 },   // 5° is below the 8° correction threshold
        { left_knee: 150 },
        { left_knee: 150 },
      )

      const msgs = generatePostSessionFeedback(comparison, makeScore(80), "knee-extension", false)

      // None of the directional correction messages should appear
      expect(msgs.find((m) => m.message === "Straighten your knee more")).toBeUndefined()
      expect(msgs.find((m) => m.message === "Try to extend further")).toBeUndefined()
      expect(msgs.find((m) => m.message === "Ease back, you're extending too much")).toBeUndefined()
      process.stdout.write("[FEEDBACK] deviation=5° (<= 8° threshold) → no primary angle correction message emitted ✓\n")
    })
  })

  // ── Secondary angle drift messages ──────────────────────────────────────

  describe("secondary angle drift messages — detect when non-primary joints are drifting", () => {
    it("emits a 'warning' message mentioning 'lower left leg' when left_leg_segment deviation is > 18°, because large segment drift indicates compensatory movement that could cause injury", () => {
      const comparison = makeComparison(
        75,
        { left_leg_segment: 25 },   // 25° > 18° → warning threshold
      )

      const msgs = generatePostSessionFeedback(comparison, makeScore(70), "knee-extension", false)
      const driftMsg = msgs.find((m) => m.severity === "warning" && m.message.includes("lower left leg"))

      expect(driftMsg).toBeDefined()
      process.stdout.write(`[FEEDBACK] left_leg_segment deviation=25° (>18°) → found warning: '${driftMsg!.message}' ✓\n`)
    })

    it("emits an 'info' message mentioning 'lower left leg' when left_leg_segment deviation is in (8°, 18°], because moderate drift is worth noting without being alarming", () => {
      const comparison = makeComparison(
        75,
        { left_leg_segment: 12 },   // 12° is in the info threshold band
      )

      const msgs = generatePostSessionFeedback(comparison, makeScore(70), "knee-extension", false)
      const driftMsg = msgs.find((m) => m.severity === "info" && m.message.includes("lower left leg"))

      expect(driftMsg).toBeDefined()
      process.stdout.write(`[FEEDBACK] left_leg_segment deviation=12° (in (8,18]) → found info: '${driftMsg!.message}' ✓\n`)
    })

    it("does NOT emit a drift message when left_leg_segment deviation is only 5° (<= 8°), because minor variation is within expected biomechanical tolerance", () => {
      const comparison = makeComparison(
        90,
        { left_leg_segment: 5 },    // 5° is below the drift threshold
      )

      const msgs = generatePostSessionFeedback(comparison, makeScore(70), "knee-extension", false)
      const driftMsg = msgs.find((m) => m.message.includes("lower left leg"))

      expect(driftMsg).toBeUndefined()
      process.stdout.write("[FEEDBACK] left_leg_segment deviation=5° (<= 8°) → no drift message emitted ✓\n")
    })
  })

  // ── Form score messages ──────────────────────────────────────────────────

  describe("form score messages — evaluate the quality of movement mechanics", () => {
    it("emits 'Excellent form!' (success) when formScore >= 85, recognising consistently clean technique across the session", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(90),
        makeScore(90),        // 90 >= 85 → excellent
        "knee-extension",
        false
      )

      const formMsg = msgs.find((m) => m.message === "Excellent form!")
      expect(formMsg).toBeDefined()
      expect(formMsg!.severity).toBe("success")
      process.stdout.write("[FEEDBACK] formScore=90 → found message: 'Excellent form!' (success) ✓\n")
    })

    it("emits 'Focus on controlled movement' (warning) when formScore < 50, flagging that movement quality needs significant attention", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(90),
        makeScore(40),        // 40 < 50 → poor form
        "knee-extension",
        false
      )

      const formMsg = msgs.find((m) => m.message === "Focus on controlled movement")
      expect(formMsg).toBeDefined()
      expect(formMsg!.severity).toBe("warning")
      process.stdout.write("[FEEDBACK] formScore=40 → found message: 'Focus on controlled movement' (warning) ✓\n")
    })

    it("emits NEITHER 'Excellent form!' NOR 'Focus on controlled movement' when formScore is in [50, 84], because mid-range form should not trigger either extreme", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(90),
        makeScore(65),        // 65 is in the neutral band
        "knee-extension",
        false
      )

      expect(msgs.some((m) => m.message === "Excellent form!")).toBe(false)
      expect(msgs.some((m) => m.message === "Focus on controlled movement")).toBe(false)
      process.stdout.write("[FEEDBACK] formScore=65 (in [50,84]) → neither 'Excellent form!' nor 'Focus on controlled movement' emitted ✓\n")
    })
  })

  // ── Progress messages (allowProgression = true) ──────────────────────────

  describe("progress messages — only emitted when allowProgression is true", () => {
    it("emits a message containing 'close to ideal range' when progressScore >= 80 and allowProgression=true, signalling the patient is nearly at their target range", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(85),
        makeScore(80, 85, 5),   // progressScore=85 >= 80
        "knee-extension",
        true
      )

      const msg = msgs.find((m) => m.message.includes("close to ideal range"))
      expect(msg).toBeDefined()
      process.stdout.write(`[FEEDBACK] progressScore=85 + allowProgression=true → found message: '${msg!.message}' ✓\n`)
    })

    it("emits a message containing 'Good progress' when progressScore is in [40, 79] and allowProgression=true", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(85),
        makeScore(80, 60, 5),   // progressScore=60 in [40,79]
        "knee-extension",
        true
      )

      const msg = msgs.find((m) => m.message.includes("Good progress"))
      expect(msg).toBeDefined()
      process.stdout.write(`[FEEDBACK] progressScore=60 + allowProgression=true → found message: '${msg!.message}' ✓\n`)
    })

    it("emits a message containing 'Try to go a bit further' when progressScore < 20 and validReps > 0 and allowProgression=true", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(85),
        makeScore(80, 10, 5),   // progressScore=10 < 20
        "knee-extension",
        true
      )

      const msg = msgs.find((m) => m.message.includes("Try to go a bit further"))
      expect(msg).toBeDefined()
      process.stdout.write(`[FEEDBACK] progressScore=10 + allowProgression=true + validReps>0 → found message: '${msg!.message}' ✓\n`)
    })

    it("does NOT emit any progress message when allowProgression=false, because the doctor has not authorised range-of-motion progression for this patient yet", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(85),
        makeScore(80, 85, 5),   // high progressScore, but progression not allowed
        "knee-extension",
        false
      )

      // None of the progression messages should appear
      const msg = msgs.find((m) => m.message.includes("close to ideal range"))
      expect(msg).toBeUndefined()
      process.stdout.write("[FEEDBACK] allowProgression=false → no progress messages emitted ✓\n")
    })
  })

  // ── Per-rep trend messages ───────────────────────────────────────────────

  describe("per-rep trend messages — detect improving or declining form across the session", () => {
    it("emits a 'success' message containing 'improved as you went' when second-half rep scores are significantly higher than first-half, rewarding the patient for warming up into the exercise", () => {
      // First 3 reps: poor form (50), last 3 reps: excellent form (90) — clear improvement trend
      const msgs = generatePostSessionFeedback(
        makeComparison(85),
        makeScore(80, 60, 6, [50, 50, 50, 90, 90, 90]),
        "knee-extension",
        false
      )

      const msg = msgs.find((m) => m.message.includes("improved as you went"))
      expect(msg).toBeDefined()
      expect(msg!.severity).toBe("success")
      process.stdout.write(`[TREND] Form improved (50→90 per rep) → found success message: '${msg!.message}' ✓\n`)
    })

    it("emits an 'info' message containing 'fatigue' when second-half rep scores are significantly lower than first-half, flagging potential fatigue before the patient notices it themselves", () => {
      // First 3 reps: excellent form (90), last 3 reps: poor form (50) — declining trend
      const msgs = generatePostSessionFeedback(
        makeComparison(85),
        makeScore(80, 60, 6, [90, 90, 90, 50, 50, 50]),
        "knee-extension",
        false
      )

      const msg = msgs.find((m) => m.message.includes("fatigue"))
      expect(msg).toBeDefined()
      expect(msg!.severity).toBe("info")
      process.stdout.write(`[TREND] Form declined (90→50 per rep) → found info message: '${msg!.message}' ✓\n`)
    })

    it("does NOT emit any trend message when there are fewer than 3 reps, because two data points are insufficient to establish a meaningful trend", () => {
      // Only 2 per-rep entries — not enough for trend analysis
      const msgs = generatePostSessionFeedback(
        makeComparison(85),
        makeScore(80, 60, 2, [90, 50]),
        "knee-extension",
        false
      )

      expect(msgs.find((m) => m.message.includes("improved as you went"))).toBeUndefined()
      expect(msgs.find((m) => m.message.includes("fatigue"))).toBeUndefined()
      process.stdout.write("[TREND] < 3 reps → no trend messages emitted ✓\n")
    })
  })

  // ── Return type contract ─────────────────────────────────────────────────

  describe("return type contract — the function always returns a typed array", () => {
    it("always returns an array of objects each with severity ('success'|'info'|'warning') and a non-empty message string, so callers can safely iterate without type checking", () => {
      const msgs = generatePostSessionFeedback(
        makeComparison(85),
        makeScore(80),
        "knee-extension",
        false
      )

      expect(Array.isArray(msgs)).toBe(true)

      for (const m of msgs) {
        // Severity must be one of the three valid values
        expect(["success", "info", "warning"]).toContain(m.severity)
        // Message must be a non-empty string
        expect(typeof m.message).toBe("string")
        expect(m.message.length).toBeGreaterThan(0)
      }

      process.stdout.write(`[TYPE] generatePostSessionFeedback returned ${msgs.length} FeedbackMessage object(s), all with valid severity and message ✓\n`)
    })
  })
})

// ===========================================================================
// logFeedback()
// ===========================================================================

describe("logFeedback — print feedback messages to the console without throwing", () => {
  it("calls successfully without throwing when given a non-empty array of FeedbackMessage objects", () => {
    const msgs: FeedbackMessage[] = [
      { severity: "success", message: "Great form overall!" },
      { severity: "warning", message: "Watch your knee alignment" },
      { severity: "info",    message: "Form improved as you went" },
    ]

    // logFeedback must be side-effect-only — it must never throw
    expect(() => logFeedback(msgs)).not.toThrow()
    process.stdout.write("[LOG] logFeedback([success, warning, info]) → did not throw ✓\n")
  })

  it("handles an empty messages array without throwing, so callers do not need to guard against empty arrays before logging", () => {
    expect(() => logFeedback([])).not.toThrow()
    process.stdout.write("[LOG] logFeedback([]) → did not throw ✓\n")
  })
})
