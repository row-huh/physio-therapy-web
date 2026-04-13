/**
 * Tests for lib/exercise-state-learner.ts — learnExerciseStates()
 *
 * learnExerciseStates() is the core machine-learning function that analyses
 * a time-series of joint angles recorded during a demo exercise and builds a
 * LearnedExerciseTemplate. The template captures distinct exercise "states"
 * (e.g. "flexed", "extended"), the typical angle ranges in each state, and
 * timing data needed for rep counting.
 *
 * The template produced by this function is stored as the "ideal" reference
 * that all future patient sessions are compared against.
 *
 * Note: pose-analyzer.ts (analyzeVideoForPose) requires a real browser with
 * MediaPipe and cannot be unit-tested in Node.js — it is excluded from this suite.
 * Only the learnExerciseStates() function (pure computation on angle data) is tested.
 */

import { learnExerciseStates } from "@/lib/exercise-state-learner"
import type { JointAngle } from "@/lib/pose-analyzer"

// ---------------------------------------------------------------------------
// Synthetic data generators
// ---------------------------------------------------------------------------

/**
 * Generates a sinusoidal angle time-series that simulates a real repeating exercise.
 * The sine wave smoothly oscillates between minAngle and maxAngle, repeating `reps` times.
 *
 * Why sinusoidal? Because real joint angles during exercises follow smooth oscillations,
 * not step functions. This generator produces realistic-enough data for the clustering
 * algorithm inside learnExerciseStates to find meaningful state boundaries.
 *
 * @param joint        - The joint name (e.g. "left_knee")
 * @param reps         - Number of full repetitions in the generated sequence
 * @param framesPerRep - Number of frames per repetition (higher = smoother)
 * @param minAngle     - Minimum angle in the oscillation (flexed position)
 * @param maxAngle     - Maximum angle in the oscillation (extended position)
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

// ===========================================================================
// learnExerciseStates()
// ===========================================================================

describe("learnExerciseStates — build a LearnedExerciseTemplate from joint angle time-series data", () => {

  // ── Input validation (these must throw) ─────────────────────────────────

  describe("input validation — insufficient data should throw immediately", () => {
    it("throws when jointAngles is an empty array, because there is no data to cluster into exercise states", () => {
      // No frames at all → the function has nothing to analyse
      expect(() =>
        learnExerciseStates([], "Knee Extension", "knee-extension", ["left_knee"])
      ).toThrow()
      process.stdout.write("[VALIDATION] Empty jointAngles array → correctly threw an error\n")
    })

    it("throws with a specific 'No angle data found for the specified angles of interest' message when the angle data exists but none of it is for the requested joints", () => {
      // Data is available but for a completely different joint (right_shoulder, not left_knee)
      const angles = generateSineAngles("right_shoulder", 3, 30)

      expect(() =>
        learnExerciseStates(angles, "Knee Extension", "knee-extension", ["left_knee"])
      ).toThrow("No angle data found for the specified angles of interest")

      process.stdout.write("[VALIDATION] Data for wrong joint → correctly threw 'No angle data found for the specified angles of interest'\n")
    })
  })

  // ── Return shape ─────────────────────────────────────────────────────────

  describe("return shape — the template must carry all required fields", () => {
    let template: ReturnType<typeof learnExerciseStates>

    /**
     * Generate 3 reps of left_knee data before all tests in this group run.
     * Using 40 frames/rep gives the clustering algorithm enough data points to
     * find meaningful state boundaries.
     */
    beforeAll(() => {
      const angles = generateSineAngles("left_knee", 3, 40, 90, 170)
      template = learnExerciseStates(angles, "Knee Extension", "knee-extension", ["left_knee"])
    })

    it("preserves the exerciseName passed as the second argument", () => {
      // The template's exerciseName is used in the UI — must be identical to what was passed in
      expect(template.exerciseName).toBe("Knee Extension")
      process.stdout.write(`[SHAPE] exerciseName='${template.exerciseName}' ✓\n`)
    })

    it("preserves the exerciseType passed as the third argument", () => {
      // exerciseType is the lookup key used throughout the comparison system
      expect(template.exerciseType).toBe("knee-extension")
      process.stdout.write(`[SHAPE] exerciseType='${template.exerciseType}' ✓\n`)
    })

    it("produces a non-empty states array, because at least one distinct exercise phase must be identified from the oscillating data", () => {
      expect(Array.isArray(template.states)).toBe(true)
      expect(template.states.length).toBeGreaterThan(0)
      process.stdout.write(`[SHAPE] states array has ${template.states.length} detected state(s) ✓\n`)
    })

    it("produces a transitions array (may be empty for single-state exercises)", () => {
      expect(Array.isArray(template.transitions)).toBe(true)
      process.stdout.write(`[SHAPE] transitions array has ${template.transitions.length} entry/entries ✓\n`)
    })

    it("produces a repSequence array (may be empty if no repeating pattern was detected)", () => {
      expect(Array.isArray(template.repSequence)).toBe(true)
      process.stdout.write(`[SHAPE] repSequence array has ${template.repSequence.length} entry/entries ✓\n`)
    })

    it("has recommendedReps >= 1, because the function must always suggest at least one repetition — zero reps makes no clinical sense", () => {
      expect(template.recommendedReps).toBeGreaterThanOrEqual(1)
      process.stdout.write(`[SHAPE] recommendedReps=${template.recommendedReps} (>= 1) ✓\n`)
    })

    it("has a positive totalDuration, because any input data that spans time must produce a non-zero duration", () => {
      expect(template.totalDuration).toBeGreaterThan(0)
      process.stdout.write(`[SHAPE] totalDuration=${template.totalDuration.toFixed(3)}s (> 0) ✓\n`)
    })

    it("metadata.detectedAt is a valid ISO 8601 date string that can be parsed by the Date constructor without error", () => {
      // Must be parseable — used for sorting templates by recording date in the UI
      expect(() => new Date(template.metadata.detectedAt).toISOString()).not.toThrow()
      process.stdout.write(`[SHAPE] metadata.detectedAt='${template.metadata.detectedAt}' is a valid ISO string ✓\n`)
    })

    it("metadata.videoLength equals totalDuration, confirming both fields represent the same time span", () => {
      // These two fields must be in sync — they are used interchangeably downstream
      expect(template.metadata.videoLength).toBe(template.totalDuration)
      process.stdout.write(`[SHAPE] metadata.videoLength (${template.metadata.videoLength}) === totalDuration (${template.totalDuration}) ✓\n`)
    })

    it("metadata.fps is a positive number, reflecting the frame rate of the source angle data", () => {
      expect(template.metadata.fps).toBeGreaterThan(0)
      process.stdout.write(`[SHAPE] metadata.fps=${template.metadata.fps} (> 0) ✓\n`)
    })

    it("metadata.confidence is in the range [0, 100], where 0 = no confidence and 100 = perfect clustering fit", () => {
      expect(template.metadata.confidence).toBeGreaterThanOrEqual(0)
      expect(template.metadata.confidence).toBeLessThanOrEqual(100)
      process.stdout.write(`[SHAPE] metadata.confidence=${template.metadata.confidence} (in [0, 100]) ✓\n`)
    })
  })

  // ── Individual state shape ───────────────────────────────────────────────

  describe("state shape — each detected state must be a well-formed object", () => {
    let template: ReturnType<typeof learnExerciseStates>

    beforeAll(() => {
      // 4 reps gives more data, increasing the chance of detecting multiple states
      const angles = generateSineAngles("left_knee", 4, 40, 90, 170)
      template = learnExerciseStates(angles, "Knee Extension", "knee-extension", ["left_knee"])
    })

    it("every state has an id, name, and description as string fields, required for the UI to render state labels without undefined values", () => {
      for (const state of template.states) {
        expect(typeof state.id).toBe("string")
        expect(typeof state.name).toBe("string")
        expect(typeof state.description).toBe("string")
      }
      process.stdout.write(`[STATE] All ${template.states.length} state(s) have valid id, name, and description strings ✓\n`)
    })

    it("every state's angleRanges for the tracked joint (left_knee) has all four statistical fields: mean, min, max, stdDev — and min <= mean <= max", () => {
      for (const state of template.states) {
        const range = state.angleRanges["left_knee"]
        if (range) {
          // All four fields must be numbers
          expect(typeof range.mean).toBe("number")
          expect(typeof range.min).toBe("number")
          expect(typeof range.max).toBe("number")
          expect(typeof range.stdDev).toBe("number")
          // Statistical invariant: min <= mean <= max
          expect(range.min).toBeLessThanOrEqual(range.mean)
          expect(range.max).toBeGreaterThanOrEqual(range.mean)
        }
      }
      process.stdout.write(`[STATE] All angle ranges have valid mean/min/max/stdDev and satisfy min <= mean <= max ✓\n`)
    })

    it("every state has at least one occurrence, and every occurrence has numeric startTime, endTime, and duration fields", () => {
      for (const state of template.states) {
        // A state with zero occurrences is an orphaned cluster with no time anchor
        expect(state.occurrences.length).toBeGreaterThan(0)

        for (const occ of state.occurrences) {
          expect(typeof occ.startTime).toBe("number")
          expect(typeof occ.endTime).toBe("number")
          expect(typeof occ.duration).toBe("number")
        }
      }
      process.stdout.write("[STATE] All states have >= 1 occurrence with numeric startTime/endTime/duration ✓\n")
    })

    it("state ids are unique across the template, so states can be referenced by id without ambiguity in the comparison and rep-counting systems", () => {
      const ids = template.states.map((s) => s.id)
      const uniqueIds = new Set(ids)

      // If any ids are duplicated the Set will be smaller than the array
      expect(uniqueIds.size).toBe(ids.length)
      process.stdout.write(`[STATE] All ${ids.length} state id(s) are unique ✓\n`)
    })
  })

  // ── Bilateral exercises ──────────────────────────────────────────────────

  describe("bilateral exercises — both left and right joint data are processed together", () => {
    it("processes combined left_knee + right_knee angle data without throwing, confirming that multi-joint exercises are handled correctly", () => {
      const left  = generateSineAngles("left_knee",  3, 40)
      const right = generateSineAngles("right_knee", 3, 40)
      const combined = [...left, ...right]

      expect(() =>
        learnExerciseStates(combined, "Knee Extension", "knee-extension", ["left_knee", "right_knee"])
      ).not.toThrow()

      process.stdout.write("[BILATERAL] left_knee + right_knee combined data → learnExerciseStates did not throw ✓\n")
    })

    it("produces states where at least one state has angle ranges for BOTH left_knee and right_knee, confirming bilateral angles are tracked together in a single template", () => {
      const left  = generateSineAngles("left_knee",  3, 40)
      const right = generateSineAngles("right_knee", 3, 40)
      const combined = [...left, ...right]

      const template = learnExerciseStates(
        combined,
        "Knee Extension",
        "knee-extension",
        ["left_knee", "right_knee"]
      )

      // At least one state must capture both joints — that is the whole point of bilateral tracking
      const anyStateHasBoth = template.states.some(
        (s) => s.angleRanges["left_knee"] && s.angleRanges["right_knee"]
      )
      expect(anyStateHasBoth).toBe(true)
      process.stdout.write("[BILATERAL] At least one state has both left_knee and right_knee angle ranges ✓\n")
    })
  })

  // ── Edge cases ───────────────────────────────────────────────────────────

  describe("edge cases — near-minimum valid input", () => {
    it("does not throw when given fewer than 10 frames of valid data, even though the clustering result may have low confidence or warn internally", () => {
      // 5 frames is an unusually short recording — the function should degrade gracefully
      const angles: JointAngle[] = []
      for (let i = 0; i < 5; i++) {
        angles.push({ joint: "left_knee", angle: 90 + i, timestamp: i / 30 })
      }

      // A console.warn is acceptable here; a throw is not
      expect(() =>
        learnExerciseStates(angles, "Knee Extension", "knee-extension", ["left_knee"])
      ).not.toThrow()

      process.stdout.write("[EDGE] 5-frame input (very short recording) → learnExerciseStates did not throw ✓\n")
    })
  })
})
