/**
 * Tests for lib/progress-scorer.ts — scoreSession()
 *
 * scoreSession() is the engine that converts a patient's exercise template
 * (recorded during a session) into a structured score used to:
 *   1. Count how many reps were valid (met the reference threshold) and good (met ideal threshold)
 *   2. Compute a progressScore reflecting how close the patient is to the ideal range
 *   3. Compute a formScore reflecting secondary joint alignment quality
 *   4. Return per-rep detail so both doctor and patient can review individual repetitions
 *
 * The function signature:
 *   scoreSession(referenceTemplate, idealTemplate | null, patientTemplate, allowProgression)
 *
 * When idealTemplate is null or allowProgression is false, the ideal is collapsed
 * to the reference — this enforces a fixed target rather than a progressive one.
 *
 * Primary angle: for knee-extension, this is left_knee — the joint that defines
 * whether a rep is "valid" or "good".
 */

import { scoreSession } from "@/lib/progress-scorer"
import type { DetectedState, LearnedExerciseTemplate } from "@/lib/exercise-state-learner"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Builds a DetectedState with fully-specified angle ranges.
 * Unlike other test helpers that derive min/max from mean, here we accept
 * explicit { mean, min?, max?, stdDev? } so tests can precisely control
 * the range boundaries that the scorer uses for threshold calculations.
 */
function makeState(
  id: string,
  angles: Record<string, { mean: number; min?: number; max?: number; stdDev?: number }>,
  occurrences = [{ startTime: 0, endTime: 1, duration: 1 }]
): DetectedState {
  const angleRanges: DetectedState["angleRanges"] = {}
  for (const [name, v] of Object.entries(angles)) {
    angleRanges[name] = {
      mean: v.mean,
      min: v.min ?? v.mean - 5,
      max: v.max ?? v.mean + 5,
      stdDev: v.stdDev ?? 2,
    }
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
 * reps controls the recommendedReps field, which scoreSession uses as totalReps.
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
// scoreSession()
// ===========================================================================

describe("scoreSession — compute a structured performance score from exercise templates", () => {

  // ── Unknown exercise type ────────────────────────────────────────────────

  describe("unknown exercise type — no angle configuration available", () => {
    it("returns a fully zeroed score (validReps=0, goodReps=0, progressScore=0, formScore=0) with totalReps from the patient template when the exercise type is not in EXERCISE_CONFIGS, because there is no primary angle to evaluate", () => {
      // Arrange: both templates use a fictional exercise type not in the registry
      const ref     = makeTemplate("ghost-exercise", [makeState("s0", { some_angle: { mean: 90 } })], 5)
      const patient = makeTemplate("ghost-exercise", [makeState("s0", { some_angle: { mean: 90 } })], 5)

      // Act
      const result = scoreSession(ref, null, patient, false)

      // Assert: without a known primary angle, no rep can be scored
      expect(result.validReps).toBe(0)
      expect(result.goodReps).toBe(0)
      expect(result.progressScore).toBe(0)
      expect(result.formScore).toBe(0)
      expect(result.perRepDetails).toEqual([])
      // totalReps still comes from the patient template's recommendedReps
      expect(result.totalReps).toBe(5)

      process.stdout.write("[SCORE] Unknown exerciseType 'ghost-exercise' → zeroed score with totalReps=5 ✓\n")
    })
  })

  // ── Missing primary angle in template ────────────────────────────────────

  describe("template has no data for the primary angle", () => {
    it("returns zeroed validReps and goodReps when the reference template has no left_knee data at all, because the peak cannot be determined without the primary joint", () => {
      // Arrange: templates use right_shoulder, not left_knee (the primary angle for knee-extension)
      const ref     = makeTemplate("knee-extension", [makeState("s0", { right_shoulder: { mean: 90 } })], 3)
      const patient = makeTemplate("knee-extension", [makeState("s0", { right_shoulder: { mean: 90 } })], 3)

      // Act
      const result = scoreSession(ref, null, patient, false)

      // Assert: without a peak angle, no rep can pass the threshold
      expect(result.validReps).toBe(0)
      expect(result.goodReps).toBe(0)

      process.stdout.write("[SCORE] Reference has no left_knee data → validReps=0, goodReps=0 ✓\n")
    })
  })

  // ── Rep quality classification ───────────────────────────────────────────

  describe("rep quality classification — valid vs good vs neither", () => {
    it("counts every rep as a goodRep when patientPeak (155°) >= idealPeak * 0.9 (= 144°), meaning the patient achieved the full ideal range of motion", () => {
      // refPeak=120, idealPeak=160, patientPeak=155 → 155 >= 160*0.9=144 → good
      const refState     = makeState("low",  { left_knee: { mean: 120 } })
      const idealState   = makeState("high", { left_knee: { mean: 160 } })
      const patientState = makeState("peak", { left_knee: { mean: 155 } })

      const ref     = makeTemplate("knee-extension", [refState],     3)
      const ideal   = makeTemplate("knee-extension", [idealState],   3)
      const patient = makeTemplate("knee-extension", [patientState], 3)

      // Act: allowProgression=true so idealTemplate is actually used
      const result = scoreSession(ref, ideal, patient, true)

      // Assert: all reps should be both valid AND good
      expect(result.goodReps).toBe(result.totalReps)
      expect(result.validReps).toBe(result.totalReps)

      process.stdout.write(`[REPS] patientPeak=155 >= idealPeak*0.9=144 → goodReps=${result.goodReps}/${result.totalReps}, validReps=${result.validReps}/${result.totalReps} ✓\n`)
    })

    it("counts reps as validRep but NOT goodRep when patient meets the reference threshold (115 >= 120*0.9=108) but falls short of the ideal threshold (115 < 160*0.9=144)", () => {
      // refPeak=120, idealPeak=160, patientPeak=115 → valid (>=108) but not good (<144)
      const refState     = makeState("low",  { left_knee: { mean: 120 } })
      const idealState   = makeState("high", { left_knee: { mean: 160 } })
      const patientState = makeState("peak", { left_knee: { mean: 115 } })

      const ref     = makeTemplate("knee-extension", [refState],     3)
      const ideal   = makeTemplate("knee-extension", [idealState],   3)
      const patient = makeTemplate("knee-extension", [patientState], 3)

      // Act
      const result = scoreSession(ref, ideal, patient, true)

      // Assert: valid but not good
      expect(result.validReps).toBe(result.totalReps)
      expect(result.goodReps).toBe(0)

      process.stdout.write(`[REPS] patientPeak=115: valid (>=108) but not good (<144) → validReps=${result.validReps}, goodReps=${result.goodReps} ✓\n`)
    })

    it("counts neither valid nor good reps when patient peak (100°) is below the reference threshold (150 * 0.9 = 135°), indicating the patient did not complete the movement", () => {
      // refPeak=150, patientPeak=100 → 100 < 150*0.9=135 → neither valid nor good
      const refState     = makeState("low",  { left_knee: { mean: 150 } })
      const patientState = makeState("peak", { left_knee: { mean: 100 } })

      const ref     = makeTemplate("knee-extension", [refState],     3)
      const patient = makeTemplate("knee-extension", [patientState], 3)

      // Act: no ideal template — falls back to reference
      const result = scoreSession(ref, null, patient, false)

      // Assert: rep did not meet even the minimum reference threshold
      expect(result.validReps).toBe(0)
      expect(result.goodReps).toBe(0)

      process.stdout.write(`[REPS] patientPeak=100 < refThreshold=135 → validReps=${result.validReps}, goodReps=${result.goodReps} ✓\n`)
    })
  })

  // ── allowProgression = false ─────────────────────────────────────────────

  describe("allowProgression = false — ideal target collapses to the reference", () => {
    it("counts reps as good when patient (145°) meets the reference threshold (135°) and allowProgression=false collapses ideal to reference, even though a separate idealTemplate at 180° is provided", () => {
      // idealPeak=180 would normally require patient >= 162 to be 'good'
      // But with allowProgression=false, idealPeak is overridden to equal refPeak=150
      // So patient 145 >= 150*0.9=135 → both valid and good

      const refState     = makeState("low",  { left_knee: { mean: 150 } })
      const idealState   = makeState("high", { left_knee: { mean: 180 } }) // ignored
      const patientState = makeState("peak", { left_knee: { mean: 145 } })

      const ref     = makeTemplate("knee-extension", [refState],     3)
      const ideal   = makeTemplate("knee-extension", [idealState],   3)
      const patient = makeTemplate("knee-extension", [patientState], 3)

      // Act: allowProgression=false → idealPeak = refPeak = 150
      const result = scoreSession(ref, ideal, patient, false)

      // Assert: patient 145 >= 150*0.9=135 → valid AND good (because ideal == ref)
      expect(result.validReps).toBe(result.totalReps)
      expect(result.goodReps).toBe(result.totalReps)

      process.stdout.write(`[PROGRESS] allowProgression=false collapses ideal to ref=150 → patient 145 is both valid and good: validReps=${result.validReps}, goodReps=${result.goodReps} ✓\n`)
    })
  })

  // ── progressScore ────────────────────────────────────────────────────────

  describe("progressScore — interpolated between reference and ideal ranges", () => {
    it("returns progressScore = 100 when refPeak equals idealPeak (range = 0) and the patient has a valid rep, because the patient is already at the target", () => {
      // When range = idealPeak - refPeak = 0, any valid rep scores 100 progress
      const refState     = makeState("s", { left_knee: { mean: 150 } })
      const patientState = makeState("s", { left_knee: { mean: 145 } })
      const ref          = makeTemplate("knee-extension", [refState],     3)
      const patient      = makeTemplate("knee-extension", [patientState], 3)

      // patient 145 >= 150*0.9=135 → valid; range=0 → progress=100
      const result = scoreSession(ref, null, patient, false)

      expect(result.progressScore).toBe(100)
      process.stdout.write(`[PROGRESS] refPeak=idealPeak=150, patient valid → progressScore=${result.progressScore} ✓\n`)
    })

    it("returns progressScore = 0 when the patient's peak is below the reference threshold (invalid rep), because no progress can be credited for incomplete movement", () => {
      // patient 100 < 170*0.9=153 → invalid → progress = 0
      const refState     = makeState("s", { left_knee: { mean: 170 } })
      const patientState = makeState("s", { left_knee: { mean: 100 } })
      const ref          = makeTemplate("knee-extension", [refState],     3)
      const patient      = makeTemplate("knee-extension", [patientState], 3)

      const result = scoreSession(ref, null, patient, false)

      expect(result.progressScore).toBe(0)
      process.stdout.write(`[PROGRESS] Patient invalid (100 < 153) → progressScore=${result.progressScore} ✓\n`)
    })

    it("returns progressScore between 0 and 100 when patient is between the reference and ideal peaks (interpolated progress)", () => {
      // refPeak=100, idealPeak=180, patientPeak=140
      // range = 80; patient above ref → valid; progress = (140-100)/80 * 100 = 50
      const refState     = makeState("low",  { left_knee: { mean: 100 } })
      const idealState   = makeState("high", { left_knee: { mean: 180 } })
      const patientState = makeState("peak", { left_knee: { mean: 140 } })
      const ref          = makeTemplate("knee-extension", [refState],     1)
      const ideal        = makeTemplate("knee-extension", [idealState],   1)
      const patient      = makeTemplate("knee-extension", [patientState], 1)

      const result = scoreSession(ref, ideal, patient, true)

      // Should be strictly between 0 and 100
      expect(result.progressScore).toBeGreaterThan(0)
      expect(result.progressScore).toBeLessThanOrEqual(100)

      process.stdout.write(`[PROGRESS] patient=140 between ref=100 and ideal=180 → progressScore=${result.progressScore} (in (0, 100]) ✓\n`)
    })
  })

  // ── formScore ────────────────────────────────────────────────────────────

  describe("formScore — secondary joint alignment quality", () => {
    it("returns formScore = 100 when no secondary angles exist in the template, because perfect secondary form is assumed when there is nothing to measure", () => {
      // Only left_knee (primary) → no secondary angles → form = 100
      const refState     = makeState("s", { left_knee: { mean: 150 } })
      const patientState = makeState("s", { left_knee: { mean: 145 } })
      const ref          = makeTemplate("knee-extension", [refState],     3)
      const patient      = makeTemplate("knee-extension", [patientState], 3)

      const result = scoreSession(ref, null, patient, false)

      expect(result.formScore).toBe(100)
      process.stdout.write(`[FORM] Only primary angle (no secondary) → formScore=${result.formScore} ✓\n`)
    })
  })

  // ── perRepDetails ────────────────────────────────────────────────────────

  describe("perRepDetails — one structured record per repetition", () => {
    it("has exactly one entry per totalReps so downstream components can render a per-rep table without index-out-of-bounds errors", () => {
      const refState     = makeState("s", { left_knee: { mean: 150 } })
      const patientState = makeState("s", { left_knee: { mean: 145 } })
      const ref          = makeTemplate("knee-extension", [refState],     5)
      const patient      = makeTemplate("knee-extension", [patientState], 5)

      const result = scoreSession(ref, null, patient, false)

      expect(result.perRepDetails).toHaveLength(result.totalReps)
      process.stdout.write(`[REPS] perRepDetails.length=${result.perRepDetails.length} === totalReps=${result.totalReps} ✓\n`)
    })

    it("each perRepDetail entry has all required fields (rep, valid, good, peakAngle, progressPercent, formScore) with correct types", () => {
      const refState     = makeState("s", { left_knee: { mean: 150 } })
      const patientState = makeState("s", { left_knee: { mean: 145 } })
      const ref          = makeTemplate("knee-extension", [refState],     2)
      const patient      = makeTemplate("knee-extension", [patientState], 2)

      const result = scoreSession(ref, null, patient, false)

      for (const detail of result.perRepDetails) {
        // Every field must be present and typed correctly
        expect(typeof detail.rep).toBe("number")
        expect(typeof detail.valid).toBe("boolean")
        expect(typeof detail.good).toBe("boolean")
        expect(typeof detail.peakAngle).toBe("number")
        expect(typeof detail.progressPercent).toBe("number")
        expect(typeof detail.formScore).toBe("number")
      }
      process.stdout.write(`[REPS] All ${result.perRepDetails.length} perRepDetail entries have valid field types ✓\n`)
    })

    it("rep numbers in perRepDetails are sequential starting from 1 (1, 2, 3, ...) so the UI can display them as '1st rep', '2nd rep', etc.", () => {
      const refState     = makeState("s", { left_knee: { mean: 150 } })
      const patientState = makeState("s", { left_knee: { mean: 145 } })
      const ref          = makeTemplate("knee-extension", [refState],     4)
      const patient      = makeTemplate("knee-extension", [patientState], 4)

      const result = scoreSession(ref, null, patient, false)

      result.perRepDetails.forEach((d, i) => {
        expect(d.rep).toBe(i + 1)
      })

      const repNumbers = result.perRepDetails.map((d) => d.rep)
      process.stdout.write(`[REPS] rep numbers are sequential: [${repNumbers.join(", ")}] ✓\n`)
    })
  })

  // ── SessionScore shape ───────────────────────────────────────────────────

  describe("SessionScore shape — all required top-level fields must be present and typed", () => {
    it("returns an object with totalReps, validReps, goodReps, progressScore, formScore (all numbers) and perRepDetails (array), so destructuring callers never encounter undefined", () => {
      const refState = makeState("s", { left_knee: { mean: 150 } })
      const ref      = makeTemplate("knee-extension", [refState], 3)
      const patient  = makeTemplate("knee-extension", [refState], 3)

      const result = scoreSession(ref, null, patient, false)

      // Top-level numeric fields
      expect(typeof result.totalReps).toBe("number")
      expect(typeof result.validReps).toBe("number")
      expect(typeof result.goodReps).toBe("number")
      expect(typeof result.progressScore).toBe("number")
      expect(typeof result.formScore).toBe("number")

      // Array field
      expect(Array.isArray(result.perRepDetails)).toBe(true)

      process.stdout.write("[SHAPE] SessionScore has all required fields: totalReps, validReps, goodReps, progressScore, formScore, perRepDetails ✓\n")
    })
  })
})
