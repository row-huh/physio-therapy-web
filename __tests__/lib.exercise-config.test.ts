/**
 * Tests for lib/exercise-config.ts
 *
 * This module is the central registry of supported exercises.
 * Each exercise config defines which joint angles are clinically relevant
 * for that movement — these lists drive the comparison and feedback systems.
 *
 * Exported symbols under test:
 *
 *   EXERCISE_CONFIGS   — the registry array of all supported exercises
 *   getExerciseConfig(id)    — lookup by exercise id string
 *   filterAnglesByExercise(angles, exerciseId) — keep only relevant angles
 */

import {
  EXERCISE_CONFIGS,
  getExerciseConfig,
  filterAnglesByExercise,
} from "@/lib/exercise-config"

// ===========================================================================
// EXERCISE_CONFIGS — the exercise registry array
// ===========================================================================

describe("EXERCISE_CONFIGS — the registry of all supported physiotherapy exercises", () => {

  describe("basic shape and contents", () => {
    it("exports a non-empty array, confirming that at least one exercise has been registered", () => {
      // An empty configs array would make the entire comparison system non-functional
      expect(Array.isArray(EXERCISE_CONFIGS)).toBe(true)
      expect(EXERCISE_CONFIGS.length).toBeGreaterThan(0)
      process.stdout.write(`[CONFIG] EXERCISE_CONFIGS has ${EXERCISE_CONFIGS.length} registered exercise(s)\n`)
    })

    it("contains a config for 'knee-extension' — the primary lower-body exercise", () => {
      const cfg = EXERCISE_CONFIGS.find((c) => c.id === "knee-extension")
      expect(cfg).toBeDefined()
      // The display name must match the registered label exactly
      expect(cfg!.name).toBe("Knee Extension")
      process.stdout.write(`[CONFIG] 'knee-extension' found with name='${cfg!.name}'\n`)
    })

    it("contains a config for 'scap-wall-slides' — the primary upper-body/shoulder exercise", () => {
      const cfg = EXERCISE_CONFIGS.find((c) => c.id === "scap-wall-slides")
      expect(cfg).toBeDefined()
      expect(cfg!.name).toBe("Scap Wall Slides")
      process.stdout.write(`[CONFIG] 'scap-wall-slides' found with name='${cfg!.name}'\n`)
    })
  })

  describe("required fields on every config", () => {
    it("every exercise config has id, name, and description as non-empty strings, so the UI can render the exercise picker without undefined values", () => {
      for (const cfg of EXERCISE_CONFIGS) {
        // All three must be present strings — undefined or empty would break the UI
        expect(typeof cfg.id).toBe("string")
        expect(typeof cfg.name).toBe("string")
        expect(typeof cfg.description).toBe("string")
      }
      process.stdout.write(`[CONFIG] All ${EXERCISE_CONFIGS.length} configs have valid id, name, and description strings\n`)
    })

    it("every exercise config has anglesOfInterest as a non-null array, because comparison and feedback both depend on this list to know which joints to analyse", () => {
      for (const cfg of EXERCISE_CONFIGS) {
        expect(Array.isArray(cfg.anglesOfInterest)).toBe(true)
      }
      process.stdout.write("[CONFIG] All configs have anglesOfInterest as an array\n")
    })

    it("every exercise config has angleConfigs as a non-null array, providing joint definitions used by the pose detection layer", () => {
      for (const cfg of EXERCISE_CONFIGS) {
        expect(Array.isArray(cfg.angleConfigs)).toBe(true)
      }
      process.stdout.write("[CONFIG] All configs have angleConfigs as an array\n")
    })
  })

  describe("angleConfig entry structure", () => {
    it("every angleConfig entry has type ('joint' or 'segment'), name, and description, ensuring the pose-analyzer receives well-formed angle definitions", () => {
      for (const cfg of EXERCISE_CONFIGS) {
        for (const ac of cfg.angleConfigs) {
          // type must be one of two valid discriminators
          expect(["joint", "segment"]).toContain(ac.type)
          expect(typeof ac.name).toBe("string")
          expect(typeof ac.description).toBe("string")
        }
      }
      process.stdout.write("[CONFIG] All angleConfig entries have valid type, name, and description\n")
    })
  })

  describe("exercise-specific anglesOfInterest content", () => {
    it("knee-extension config includes left_knee, right_knee, and left_leg_segment as angles of interest, which are the joints that define a complete knee extension motion", () => {
      const cfg = getExerciseConfig("knee-extension")!

      expect(cfg.anglesOfInterest).toContain("left_knee")
      expect(cfg.anglesOfInterest).toContain("right_knee")
      expect(cfg.anglesOfInterest).toContain("left_leg_segment")

      process.stdout.write(`[CONFIG] knee-extension anglesOfInterest: [${cfg.anglesOfInterest.join(", ")}]\n`)
    })

    it("scap-wall-slides config includes left_shoulder and right_elbow, which are the primary joints involved in the scapular retraction motion", () => {
      const cfg = getExerciseConfig("scap-wall-slides")!

      expect(cfg.anglesOfInterest).toContain("left_shoulder")
      expect(cfg.anglesOfInterest).toContain("right_elbow")

      process.stdout.write(`[CONFIG] scap-wall-slides anglesOfInterest: [${cfg.anglesOfInterest.join(", ")}]\n`)
    })
  })
})

// ===========================================================================
// getExerciseConfig()
// ===========================================================================

describe("getExerciseConfig — look up an exercise configuration by its unique id string", () => {

  describe("known exercise ids", () => {
    it("returns the correct config object (with matching id) for 'knee-extension'", () => {
      const cfg = getExerciseConfig("knee-extension")

      // Must find something
      expect(cfg).not.toBeUndefined()
      // Must be the right one
      expect(cfg!.id).toBe("knee-extension")
      process.stdout.write(`[LOOKUP] getExerciseConfig('knee-extension') → found config with name='${cfg!.name}'\n`)
    })
  })

  describe("unknown or invalid ids", () => {
    it("returns undefined for a completely unknown exercise id, so callers can branch on the absence of a config rather than receiving a corrupt object", () => {
      const cfg = getExerciseConfig("totally-unknown-exercise-that-does-not-exist")

      expect(cfg).toBeUndefined()
      process.stdout.write("[LOOKUP] getExerciseConfig('totally-unknown-exercise') → correctly returned undefined\n")
    })

    it("returns undefined for an empty string id, because an empty string is not a valid exercise identifier", () => {
      expect(getExerciseConfig("")).toBeUndefined()
      process.stdout.write("[LOOKUP] getExerciseConfig('') → correctly returned undefined\n")
    })

    it("is case-sensitive — 'Knee-Extension' (mixed case) returns undefined even though 'knee-extension' is registered, because exercise ids must be used exactly as declared", () => {
      // This guards against callers passing UI display strings as ids by mistake
      expect(getExerciseConfig("Knee-Extension")).toBeUndefined()
      process.stdout.write("[LOOKUP] getExerciseConfig('Knee-Extension') → correctly returned undefined (case-sensitive)\n")
    })
  })
})

// ===========================================================================
// filterAnglesByExercise()
// ===========================================================================

describe("filterAnglesByExercise — return only the angles relevant to a specific exercise", () => {

  /**
   * A broad set of angle names that spans both knee and shoulder exercises,
   * plus one completely irrelevant angle, used across multiple tests.
   */
  const ALL_ANGLES = [
    "left_knee",
    "right_knee",
    "left_shoulder",
    "right_shoulder",
    "left_leg_segment",
    "totally_irrelevant_angle",
  ]

  describe("filtering for knee-extension", () => {
    it("keeps left_knee, right_knee, and left_leg_segment but removes left_shoulder, right_shoulder, and totally_irrelevant_angle, so the comparison engine only evaluates clinically meaningful joints", () => {
      const result = filterAnglesByExercise(ALL_ANGLES, "knee-extension")

      // Expected inclusions — these joints define the knee extension motion
      expect(result).toContain("left_knee")
      expect(result).toContain("right_knee")
      expect(result).toContain("left_leg_segment")

      // Expected exclusions — upper body and unknown angles must be filtered out
      expect(result).not.toContain("left_shoulder")
      expect(result).not.toContain("right_shoulder")
      expect(result).not.toContain("totally_irrelevant_angle")

      process.stdout.write(`[FILTER] knee-extension from ${ALL_ANGLES.length} angles → kept: [${result.join(", ")}]\n`)
    })
  })

  describe("filtering for scap-wall-slides", () => {
    it("keeps left_shoulder and right_shoulder but removes left_knee and right_knee, because the scapular sliding motion is an upper-body exercise with no clinical knee involvement", () => {
      const result = filterAnglesByExercise(ALL_ANGLES, "scap-wall-slides")

      expect(result).toContain("left_shoulder")
      expect(result).toContain("right_shoulder")
      expect(result).not.toContain("left_knee")
      expect(result).not.toContain("right_knee")

      process.stdout.write(`[FILTER] scap-wall-slides from ${ALL_ANGLES.length} angles → kept: [${result.join(", ")}]\n`)
    })
  })

  describe("unknown exercise type — fallback behaviour", () => {
    it("returns all input angles unchanged when the exercise id is not found in EXERCISE_CONFIGS, because an unknown exercise type should not silently discard data", () => {
      const result = filterAnglesByExercise(ALL_ANGLES, "ghost-exercise-not-in-registry")

      // Fallback: return the full input list unmodified
      expect(result).toEqual(ALL_ANGLES)
      process.stdout.write(`[FILTER] Unknown exercise type → correctly fell back to returning all ${ALL_ANGLES.length} angles\n`)
    })
  })

  describe("edge cases", () => {
    it("returns an empty array when the input angles array is empty, regardless of exercise type", () => {
      const result = filterAnglesByExercise([], "knee-extension")

      expect(result).toEqual([])
      process.stdout.write("[FILTER] Empty input array → correctly returned empty array\n")
    })

    it("returns only the matched angle when input is a single-element array containing a relevant angle", () => {
      // left_knee is in knee-extension's anglesOfInterest → should be kept
      const result = filterAnglesByExercise(["left_knee"], "knee-extension")

      expect(result).toEqual(["left_knee"])
      process.stdout.write("[FILTER] Single relevant input angle → correctly returned ['left_knee']\n")
    })

    it("returns an empty array when none of the input angles appear in the exercise's anglesOfInterest", () => {
      // left_pinky_finger is obviously not in the knee-extension config
      const result = filterAnglesByExercise(["left_pinky_finger"], "knee-extension")

      expect(result).toEqual([])
      process.stdout.write("[FILTER] Single irrelevant input angle → correctly returned []\n")
    })
  })
})
