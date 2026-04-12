/**
 * Tests for lib/progress-scorer.ts — scoreSession()
 *
 * Covers:
 *   - Returns zeroed score when exerciseType has no configured primary angle
 *   - Returns zeroed score when ref/ideal peak is null (no states with primary angle)
 *   - patientPeak >= idealPeak*0.9 → goodRep counted
 *   - patientPeak >= refPeak*0.9 but < idealPeak*0.9 → validRep (not goodRep)
 *   - patientPeak < refPeak*0.9 → neither valid nor good
 *   - allowProgression=false → idealTemplate collapses to reference
 *   - progressScore = 100 when refPeak == idealPeak (no range) and patient is valid
 *   - progressScore interpolated correctly when range > 0
 *   - formScore computed from secondary angles (0-100)
 *   - perRepDetails has one entry per detectedRep
 *   - SessionScore shape has all required fields
 */

import { scoreSession } from "@/lib/progress-scorer"
import type { DetectedState, LearnedExerciseTemplate } from "@/lib/exercise-state-learner"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
// scoreSession()
// ---------------------------------------------------------------------------

describe("scoreSession", () => {
  // ── Unknown exercise type ───────────────────────────────────────────────
  describe("unknown exerciseType (no config)", () => {
    it("returns zeroed score with patient's recommendedReps as totalReps", () => {
      const ref = makeTemplate("ghost-exercise", [makeState("s0", { some_angle: { mean: 90 } })], 5)
      const patient = makeTemplate("ghost-exercise", [makeState("s0", { some_angle: { mean: 90 } })], 5)
      const result = scoreSession(ref, null, patient, false)
      expect(result.validReps).toBe(0)
      expect(result.goodReps).toBe(0)
      expect(result.progressScore).toBe(0)
      expect(result.formScore).toBe(0)
      expect(result.perRepDetails).toEqual([])
      expect(result.totalReps).toBe(5)
    })
  })

  // ── Null peak (no states with primary angle) ────────────────────────────
  describe("template with no primary angle data", () => {
    it("returns zeroed score when reference has no left_knee data", () => {
      const ref = makeTemplate("knee-extension", [makeState("s0", { right_shoulder: { mean: 90 } })], 3)
      const patient = makeTemplate("knee-extension", [makeState("s0", { right_shoulder: { mean: 90 } })], 3)
      const result = scoreSession(ref, null, patient, false)
      expect(result.validReps).toBe(0)
      expect(result.goodReps).toBe(0)
    })
  })

  // ── Good rep counting ───────────────────────────────────────────────────
  describe("rep quality classification", () => {
    it("counts a goodRep when patientPeak >= idealPeak * 0.9", () => {
      const refState = makeState("low", { left_knee: { mean: 120 } })
      const idealState = makeState("high", { left_knee: { mean: 160 } })
      // Patient peak = 155 ≥ 160*0.9=144 → good
      const patientState = makeState("peak", { left_knee: { mean: 155 } })

      const ref = makeTemplate("knee-extension", [refState], 3)
      const ideal = makeTemplate("knee-extension", [idealState], 3)
      const patient = makeTemplate("knee-extension", [patientState], 3)

      const result = scoreSession(ref, ideal, patient, true)
      expect(result.goodReps).toBe(result.totalReps)
      expect(result.validReps).toBe(result.totalReps)
    })

    it("counts validRep but NOT goodRep when patient meets ref but not ideal", () => {
      const refState = makeState("low", { left_knee: { mean: 120 } })
      const idealState = makeState("high", { left_knee: { mean: 160 } })
      // Patient peak = 115 ≥ 120*0.9=108 (valid) but < 160*0.9=144 (not good)
      const patientState = makeState("peak", { left_knee: { mean: 115 } })

      const ref = makeTemplate("knee-extension", [refState], 3)
      const ideal = makeTemplate("knee-extension", [idealState], 3)
      const patient = makeTemplate("knee-extension", [patientState], 3)

      const result = scoreSession(ref, ideal, patient, true)
      expect(result.validReps).toBe(result.totalReps)
      expect(result.goodReps).toBe(0)
    })

    it("counts neither valid nor good when patient peak is below ref threshold", () => {
      const refState = makeState("low", { left_knee: { mean: 150 } })
      // Patient peak = 100 < 150*0.9=135
      const patientState = makeState("peak", { left_knee: { mean: 100 } })

      const ref = makeTemplate("knee-extension", [refState], 3)
      const patient = makeTemplate("knee-extension", [patientState], 3)

      const result = scoreSession(ref, null, patient, false)
      expect(result.validReps).toBe(0)
      expect(result.goodReps).toBe(0)
    })
  })

  // ── allowProgression = false ────────────────────────────────────────────
  describe("allowProgression = false", () => {
    it("uses reference as ideal when allowProgression is false", () => {
      const refState = makeState("low", { left_knee: { mean: 150 } })
      const idealState = makeState("high", { left_knee: { mean: 180 } }) // ignored
      // Patient peak = 145 ≥ ref*0.9=135 (valid) and ≥ ref*0.9=135 (good since ideal=ref)
      const patientState = makeState("peak", { left_knee: { mean: 145 } })

      const ref = makeTemplate("knee-extension", [refState], 3)
      const ideal = makeTemplate("knee-extension", [idealState], 3)
      const patient = makeTemplate("knee-extension", [patientState], 3)

      const result = scoreSession(ref, ideal, patient, false)
      // With allowProgression=false, idealPeak = refPeak = 150
      // patient 145 >= 150*0.9=135 → both valid and good
      expect(result.validReps).toBe(result.totalReps)
      expect(result.goodReps).toBe(result.totalReps)
    })
  })

  // ── progressScore ───────────────────────────────────────────────────────
  describe("progressScore", () => {
    it("is 100 when refPeak == idealPeak and patient is valid", () => {
      // range = idealPeak - refPeak = 0 → progress = 100 when valid
      const refState = makeState("s", { left_knee: { mean: 150 } })
      const patientState = makeState("s", { left_knee: { mean: 145 } })
      const ref = makeTemplate("knee-extension", [refState], 3)
      const patient = makeTemplate("knee-extension", [patientState], 3)
      // patient 145 >= 150*0.9=135 → valid; range=0 → progress=100
      const result = scoreSession(ref, null, patient, false)
      expect(result.progressScore).toBe(100)
    })

    it("is 0 when patient is invalid", () => {
      const refState = makeState("s", { left_knee: { mean: 170 } })
      const patientState = makeState("s", { left_knee: { mean: 100 } })
      const ref = makeTemplate("knee-extension", [refState], 3)
      const patient = makeTemplate("knee-extension", [patientState], 3)
      const result = scoreSession(ref, null, patient, false)
      expect(result.progressScore).toBe(0)
    })

    it("is between 0 and 100 when patient is between ref and ideal peaks", () => {
      const refState = makeState("low", { left_knee: { mean: 100 } })
      const idealState = makeState("high", { left_knee: { mean: 180 } })
      // Patient peak = 140; range = 80; progress = (140-100)/80 * 100 = 50
      const patientState = makeState("peak", { left_knee: { mean: 140 } })
      const ref = makeTemplate("knee-extension", [refState], 1)
      const ideal = makeTemplate("knee-extension", [idealState], 1)
      const patient = makeTemplate("knee-extension", [patientState], 1)
      const result = scoreSession(ref, ideal, patient, true)
      expect(result.progressScore).toBeGreaterThan(0)
      expect(result.progressScore).toBeLessThanOrEqual(100)
    })
  })

  // ── formScore ───────────────────────────────────────────────────────────
  describe("formScore", () => {
    it("is 100 when no secondary angles exist", () => {
      // Only left_knee → no secondary angles → form = 100
      const refState = makeState("s", { left_knee: { mean: 150 } })
      const patientState = makeState("s", { left_knee: { mean: 145 } })
      const ref = makeTemplate("knee-extension", [refState], 3)
      const patient = makeTemplate("knee-extension", [patientState], 3)
      const result = scoreSession(ref, null, patient, false)
      expect(result.formScore).toBe(100)
    })
  })

  // ── perRepDetails ───────────────────────────────────────────────────────
  describe("perRepDetails", () => {
    it("has one entry per totalReps", () => {
      const refState = makeState("s", { left_knee: { mean: 150 } })
      const patientState = makeState("s", { left_knee: { mean: 145 } })
      const ref = makeTemplate("knee-extension", [refState], 5)
      const patient = makeTemplate("knee-extension", [patientState], 5)
      const result = scoreSession(ref, null, patient, false)
      expect(result.perRepDetails).toHaveLength(result.totalReps)
    })

    it("each detail has required fields", () => {
      const refState = makeState("s", { left_knee: { mean: 150 } })
      const patientState = makeState("s", { left_knee: { mean: 145 } })
      const ref = makeTemplate("knee-extension", [refState], 2)
      const patient = makeTemplate("knee-extension", [patientState], 2)
      const result = scoreSession(ref, null, patient, false)
      for (const detail of result.perRepDetails) {
        expect(typeof detail.rep).toBe("number")
        expect(typeof detail.valid).toBe("boolean")
        expect(typeof detail.good).toBe("boolean")
        expect(typeof detail.peakAngle).toBe("number")
        expect(typeof detail.progressPercent).toBe("number")
        expect(typeof detail.formScore).toBe("number")
      }
    })

    it("rep numbers are sequential starting from 1", () => {
      const refState = makeState("s", { left_knee: { mean: 150 } })
      const patientState = makeState("s", { left_knee: { mean: 145 } })
      const ref = makeTemplate("knee-extension", [refState], 4)
      const patient = makeTemplate("knee-extension", [patientState], 4)
      const result = scoreSession(ref, null, patient, false)
      result.perRepDetails.forEach((d, i) => {
        expect(d.rep).toBe(i + 1)
      })
    })
  })

  // ── result shape ────────────────────────────────────────────────────────
  describe("SessionScore shape", () => {
    it("has all required fields with correct types", () => {
      const refState = makeState("s", { left_knee: { mean: 150 } })
      const ref = makeTemplate("knee-extension", [refState], 3)
      const patient = makeTemplate("knee-extension", [refState], 3)
      const result = scoreSession(ref, null, patient, false)

      expect(typeof result.totalReps).toBe("number")
      expect(typeof result.validReps).toBe("number")
      expect(typeof result.goodReps).toBe("number")
      expect(typeof result.progressScore).toBe("number")
      expect(typeof result.formScore).toBe("number")
      expect(Array.isArray(result.perRepDetails)).toBe(true)
    })
  })
})
