/**
 * Tests for lib/exercise-state-learner.ts — learnExerciseStates()
 *
 * Note: pose-analyzer.ts (analyzeVideoForPose) requires a real browser with
 * MediaPipe and is not unit-testable in Node.js — it is excluded from this suite.
 * Only the exported learnExerciseStates() function is tested here.
 *
 * Covers:
 *   - Throws when no angle data is found for the specified angles of interest
 *   - Returns a LearnedExerciseTemplate with all required fields
 *   - exerciseName and exerciseType are preserved
 *   - States array is non-empty when given valid data
 *   - recommendedReps >= 1
 *   - metadata has detectedAt, videoLength, fps, confidence
 *   - confidence is in [0, 100]
 *   - totalDuration reflects the time span of the data
 */

import { learnExerciseStates } from "@/lib/exercise-state-learner"
import type { JointAngle } from "@/lib/pose-analyzer"

// ---------------------------------------------------------------------------
// Helpers — build synthetic JointAngle time-series
// ---------------------------------------------------------------------------

/**
 * Generate a sinusoidal angle sequence (simulates a repeating exercise).
 * Produces `reps` full cycles, `framesPerRep` frames each.
 */
function generateSineAngles(
  joint: string,
  reps = 3,
  framesPerRep = 30,
  minAngle = 90,
  maxAngle = 170
): JointAngle[] {
  const angles: JointAngle[] = []
  const totalFrames = reps * framesPerRep
  const fps = 30
  for (let i = 0; i < totalFrames; i++) {
    const t = i / fps
    const phase = (2 * Math.PI * i) / framesPerRep
    const angle = minAngle + (maxAngle - minAngle) * (0.5 + 0.5 * Math.sin(phase))
    angles.push({ joint, angle, timestamp: t })
  }
  return angles
}

// ---------------------------------------------------------------------------
// learnExerciseStates()
// ---------------------------------------------------------------------------

describe("learnExerciseStates", () => {
  describe("invalid / insufficient input", () => {
    it("throws when jointAngles is empty", () => {
      expect(() =>
        learnExerciseStates([], "Knee Extension", "knee-extension", ["left_knee"])
      ).toThrow()
    })

    it("throws when jointAngles has no data for anglesOfInterest", () => {
      const angles = generateSineAngles("right_shoulder", 3, 30)
      expect(() =>
        learnExerciseStates(angles, "Knee Extension", "knee-extension", ["left_knee"])
      ).toThrow("No angle data found for the specified angles of interest")
    })
  })

  describe("return shape", () => {
    let template: ReturnType<typeof learnExerciseStates>

    beforeAll(() => {
      const angles = generateSineAngles("left_knee", 3, 40, 90, 170)
      template = learnExerciseStates(angles, "Knee Extension", "knee-extension", ["left_knee"])
    })

    it("preserves exerciseName", () => {
      expect(template.exerciseName).toBe("Knee Extension")
    })

    it("preserves exerciseType", () => {
      expect(template.exerciseType).toBe("knee-extension")
    })

    it("has a non-empty states array", () => {
      expect(Array.isArray(template.states)).toBe(true)
      expect(template.states.length).toBeGreaterThan(0)
    })

    it("has a transitions array", () => {
      expect(Array.isArray(template.transitions)).toBe(true)
    })

    it("has a repSequence array", () => {
      expect(Array.isArray(template.repSequence)).toBe(true)
    })

    it("recommendedReps is >= 1", () => {
      expect(template.recommendedReps).toBeGreaterThanOrEqual(1)
    })

    it("totalDuration is a positive number", () => {
      expect(template.totalDuration).toBeGreaterThan(0)
    })

    it("metadata has detectedAt as ISO string", () => {
      expect(() => new Date(template.metadata.detectedAt).toISOString()).not.toThrow()
    })

    it("metadata.videoLength matches totalDuration", () => {
      expect(template.metadata.videoLength).toBe(template.totalDuration)
    })

    it("metadata.fps is a positive number", () => {
      expect(template.metadata.fps).toBeGreaterThan(0)
    })

    it("metadata.confidence is in range [0, 100]", () => {
      expect(template.metadata.confidence).toBeGreaterThanOrEqual(0)
      expect(template.metadata.confidence).toBeLessThanOrEqual(100)
    })
  })

  describe("state shape", () => {
    let template: ReturnType<typeof learnExerciseStates>

    beforeAll(() => {
      const angles = generateSineAngles("left_knee", 4, 40, 90, 170)
      template = learnExerciseStates(angles, "Knee Extension", "knee-extension", ["left_knee"])
    })

    it("each state has id, name, description", () => {
      for (const state of template.states) {
        expect(typeof state.id).toBe("string")
        expect(typeof state.name).toBe("string")
        expect(typeof state.description).toBe("string")
      }
    })

    it("each state has angleRanges with mean/min/max/stdDev for tracked angle", () => {
      for (const state of template.states) {
        const range = state.angleRanges["left_knee"]
        if (range) {
          expect(typeof range.mean).toBe("number")
          expect(typeof range.min).toBe("number")
          expect(typeof range.max).toBe("number")
          expect(typeof range.stdDev).toBe("number")
          expect(range.min).toBeLessThanOrEqual(range.mean)
          expect(range.max).toBeGreaterThanOrEqual(range.mean)
        }
      }
    })

    it("each state has at least one occurrence", () => {
      for (const state of template.states) {
        expect(state.occurrences.length).toBeGreaterThan(0)
        for (const occ of state.occurrences) {
          expect(typeof occ.startTime).toBe("number")
          expect(typeof occ.endTime).toBe("number")
          expect(typeof occ.duration).toBe("number")
        }
      }
    })

    it("state ids are unique", () => {
      const ids = template.states.map((s) => s.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })
  })

  describe("bilateral exercise (left + right)", () => {
    it("processes bilateral angle data without error", () => {
      const left = generateSineAngles("left_knee", 3, 40)
      const right = generateSineAngles("right_knee", 3, 40)
      const angles = [...left, ...right]
      expect(() =>
        learnExerciseStates(angles, "Knee Extension", "knee-extension", ["left_knee", "right_knee"])
      ).not.toThrow()
    })

    it("includes both left and right angles in state angleRanges", () => {
      const left = generateSineAngles("left_knee", 3, 40)
      const right = generateSineAngles("right_knee", 3, 40)
      const angles = [...left, ...right]
      const template = learnExerciseStates(
        angles,
        "Knee Extension",
        "knee-extension",
        ["left_knee", "right_knee"]
      )
      const anyStateHasBoth = template.states.some(
        (s) => s.angleRanges["left_knee"] && s.angleRanges["right_knee"]
      )
      expect(anyStateHasBoth).toBe(true)
    })
  })

  describe("very short data (edge case)", () => {
    it("handles fewer than 10 frames without throwing (may warn)", () => {
      const angles: JointAngle[] = []
      for (let i = 0; i < 5; i++) {
        angles.push({ joint: "left_knee", angle: 90 + i, timestamp: i / 30 })
      }
      // Should not throw (warning is acceptable)
      expect(() =>
        learnExerciseStates(angles, "Knee Extension", "knee-extension", ["left_knee"])
      ).not.toThrow()
    })
  })
})
