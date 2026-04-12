/**
 * Tests for lib/exercise-config.ts
 *
 * Covers:
 *   - EXERCISE_CONFIGS array shape and contents
 *   - getExerciseConfig() — found / not found
 *   - filterAnglesByExercise() — filters to anglesOfInterest, unknown exercise falls back
 */

import {
  EXERCISE_CONFIGS,
  getExerciseConfig,
  filterAnglesByExercise,
} from "@/lib/exercise-config"

describe("EXERCISE_CONFIGS", () => {
  it("exports a non-empty array", () => {
    expect(Array.isArray(EXERCISE_CONFIGS)).toBe(true)
    expect(EXERCISE_CONFIGS.length).toBeGreaterThan(0)
  })

  it("contains knee-extension config", () => {
    const cfg = EXERCISE_CONFIGS.find((c) => c.id === "knee-extension")
    expect(cfg).toBeDefined()
    expect(cfg!.name).toBe("Knee Extension")
  })

  it("contains scap-wall-slides config", () => {
    const cfg = EXERCISE_CONFIGS.find((c) => c.id === "scap-wall-slides")
    expect(cfg).toBeDefined()
    expect(cfg!.name).toBe("Scap Wall Slides")
  })

  it("every config has required fields", () => {
    for (const cfg of EXERCISE_CONFIGS) {
      expect(typeof cfg.id).toBe("string")
      expect(typeof cfg.name).toBe("string")
      expect(typeof cfg.description).toBe("string")
      expect(Array.isArray(cfg.anglesOfInterest)).toBe(true)
      expect(Array.isArray(cfg.angleConfigs)).toBe(true)
    }
  })

  it("every angleConfig entry has type, name, and description", () => {
    for (const cfg of EXERCISE_CONFIGS) {
      for (const ac of cfg.angleConfigs) {
        expect(["joint", "segment"]).toContain(ac.type)
        expect(typeof ac.name).toBe("string")
        expect(typeof ac.description).toBe("string")
      }
    }
  })

  it("knee-extension anglesOfInterest contains expected angles", () => {
    const cfg = getExerciseConfig("knee-extension")!
    expect(cfg.anglesOfInterest).toContain("left_knee")
    expect(cfg.anglesOfInterest).toContain("right_knee")
    expect(cfg.anglesOfInterest).toContain("left_leg_segment")
  })

  it("scap-wall-slides anglesOfInterest contains shoulder and elbow angles", () => {
    const cfg = getExerciseConfig("scap-wall-slides")!
    expect(cfg.anglesOfInterest).toContain("left_shoulder")
    expect(cfg.anglesOfInterest).toContain("right_elbow")
  })
})

// ---------------------------------------------------------------------------
// getExerciseConfig()
// ---------------------------------------------------------------------------

describe("getExerciseConfig", () => {
  it("returns the correct config for a known exercise id", () => {
    const cfg = getExerciseConfig("knee-extension")
    expect(cfg).not.toBeUndefined()
    expect(cfg!.id).toBe("knee-extension")
  })

  it("returns undefined for an unknown exercise id", () => {
    expect(getExerciseConfig("totally-unknown-exercise")).toBeUndefined()
  })

  it("returns undefined for empty string", () => {
    expect(getExerciseConfig("")).toBeUndefined()
  })

  it("is case-sensitive — mixed case returns undefined", () => {
    expect(getExerciseConfig("Knee-Extension")).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// filterAnglesByExercise()
// ---------------------------------------------------------------------------

describe("filterAnglesByExercise", () => {
  const ALL_ANGLES = [
    "left_knee",
    "right_knee",
    "left_shoulder",
    "right_shoulder",
    "left_leg_segment",
    "totally_irrelevant_angle",
  ]

  it("filters to only angles in anglesOfInterest for knee-extension", () => {
    const result = filterAnglesByExercise(ALL_ANGLES, "knee-extension")
    expect(result).toContain("left_knee")
    expect(result).toContain("right_knee")
    expect(result).toContain("left_leg_segment")
    expect(result).not.toContain("left_shoulder")
    expect(result).not.toContain("totally_irrelevant_angle")
  })

  it("filters to only angles in anglesOfInterest for scap-wall-slides", () => {
    const result = filterAnglesByExercise(ALL_ANGLES, "scap-wall-slides")
    expect(result).toContain("left_shoulder")
    expect(result).toContain("right_shoulder")
    expect(result).not.toContain("left_knee")
  })

  it("falls back to returning all angles when exercise id is unknown", () => {
    const result = filterAnglesByExercise(ALL_ANGLES, "ghost-exercise")
    expect(result).toEqual(ALL_ANGLES)
  })

  it("returns empty array when input array is empty", () => {
    const result = filterAnglesByExercise([], "knee-extension")
    expect(result).toEqual([])
  })

  it("returns only matching angles when input is a subset of anglesOfInterest", () => {
    const result = filterAnglesByExercise(["left_knee"], "knee-extension")
    expect(result).toEqual(["left_knee"])
  })

  it("returns empty array when no input angles overlap with anglesOfInterest", () => {
    const result = filterAnglesByExercise(["left_pinky_finger"], "knee-extension")
    expect(result).toEqual([])
  })
})
