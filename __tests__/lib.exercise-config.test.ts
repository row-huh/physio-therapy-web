/**
 * Whitebox tests — lib/exercise-config.ts
 *
 * The exercise registry drives which joints are compared and scored.
 * Every function is tested for its happy path, all defined exercises,
 * and every fallback / edge-case branch.
 *
 * Exported symbols under test:
 *   EXERCISE_CONFIGS          — registry array
 *   getExerciseConfig(id)     — lookup by id
 *   filterAnglesByExercise(angles, exerciseId)  — intersection filter
 */

import {
  EXERCISE_CONFIGS,
  getExerciseConfig,
  filterAnglesByExercise,
} from "@/lib/exercise-config"

// ---------------------------------------------------------------------------
// Output helpers
// ---------------------------------------------------------------------------

const HEAD = (s: string) =>
  process.stdout.write(`\n  ┌─ ${s} ${"─".repeat(Math.max(0, 50 - s.length))}┐\n`)

const out = (tag: string, desc: string, result: string, note = "") => {
  const t = `[${tag}]`.padEnd(10)
  const d = desc.padEnd(38)
  const n = note ? `  ← ${note}` : ""
  process.stdout.write(`  ${t}  ${d}  →  ${result}${n}\n`)
}

beforeAll(() => {
  process.stdout.write("\n")
  process.stdout.write("  ╔══════════════════════════════════════════════════════╗\n")
  process.stdout.write("  ║  lib/exercise-config.ts  whitebox test suite         ║\n")
  process.stdout.write("  ╚══════════════════════════════════════════════════════╝\n")
})

// ===========================================================================
// EXERCISE_CONFIGS array
// ===========================================================================

describe("EXERCISE_CONFIGS — the exercise registry array", () => {

  beforeAll(() => { HEAD("EXERCISE_CONFIGS") })

  it("is a non-empty array (a zero-length registry would disable the entire system)", () => {
    expect(Array.isArray(EXERCISE_CONFIGS)).toBe(true)
    expect(EXERCISE_CONFIGS.length).toBeGreaterThan(0)
    out("ARRAY", "EXERCISE_CONFIGS", `${EXERCISE_CONFIGS.length} registered exercise(s)`)
  })

  it("every config has id, name, description as non-empty strings", () => {
    for (const cfg of EXERCISE_CONFIGS) {
      expect(typeof cfg.id).toBe("string")
      expect(cfg.id.length).toBeGreaterThan(0)
      expect(typeof cfg.name).toBe("string")
      expect(cfg.name.length).toBeGreaterThan(0)
      expect(typeof cfg.description).toBe("string")
    }
    const ids = EXERCISE_CONFIGS.map(c => c.id).join(", ")
    out("FIELDS", "all configs: id, name, description", `string ✓`, `ids: [${ids}]`)
  })

  it("every config has anglesOfInterest as a non-empty array", () => {
    for (const cfg of EXERCISE_CONFIGS) {
      expect(Array.isArray(cfg.anglesOfInterest)).toBe(true)
      expect(cfg.anglesOfInterest.length).toBeGreaterThan(0)
    }
    out("AOI", "all configs: anglesOfInterest", "non-empty array ✓")
  })

  it("every angleConfig entry has type ('joint' or 'segment'), name, description", () => {
    for (const cfg of EXERCISE_CONFIGS) {
      for (const ac of cfg.angleConfigs) {
        expect(["joint", "segment"]).toContain(ac.type)
        expect(typeof ac.name).toBe("string")
        expect(typeof ac.description).toBe("string")
      }
    }
    out("ACONF", "all angleConfigs: type + name + description", "valid ✓")
  })

  it("no two configs share the same id (ids are unique)", () => {
    const ids = EXERCISE_CONFIGS.map(c => c.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
    out("UNIQUE", "all config ids", `${unique.size} unique (no duplicates) ✓`)
  })

  describe("known registered exercises", () => {
    it("knee-extension is registered with the correct display name", () => {
      const cfg = EXERCISE_CONFIGS.find(c => c.id === "knee-extension")
      expect(cfg).toBeDefined()
      expect(cfg!.name).toBe("Knee Extension")
      out("KNEE", "id='knee-extension'", `name='${cfg!.name}'`)
    })

    it("scap-wall-slides is registered with the correct display name", () => {
      const cfg = EXERCISE_CONFIGS.find(c => c.id === "scap-wall-slides")
      expect(cfg).toBeDefined()
      expect(cfg!.name).toBe("Scap Wall Slides")
      out("SCAP", "id='scap-wall-slides'", `name='${cfg!.name}'`)
    })

    it("knee-extension anglesOfInterest includes left_knee, right_knee, left_leg_segment", () => {
      const aoi = getExerciseConfig("knee-extension")!.anglesOfInterest
      expect(aoi).toContain("left_knee")
      expect(aoi).toContain("right_knee")
      expect(aoi).toContain("left_leg_segment")
      out("KNEE-AOI", "knee-extension anglesOfInterest", `[${aoi.join(", ")}]`)
    })

    it("scap-wall-slides anglesOfInterest includes left_shoulder, right_elbow", () => {
      const aoi = getExerciseConfig("scap-wall-slides")!.anglesOfInterest
      expect(aoi).toContain("left_shoulder")
      expect(aoi).toContain("right_elbow")
      out("SCAP-AOI", "scap-wall-slides anglesOfInterest", `[${aoi.join(", ")}]`)
    })
  })
})

// ===========================================================================
// getExerciseConfig(id)
// ===========================================================================

describe("getExerciseConfig() — lookup by id string", () => {

  beforeAll(() => { HEAD("getExerciseConfig()") })

  it("returns the correct config for 'knee-extension'", () => {
    const cfg = getExerciseConfig("knee-extension")
    expect(cfg).toBeDefined()
    expect(cfg!.id).toBe("knee-extension")
    out("HIT", "getExerciseConfig('knee-extension')", `found: name='${cfg!.name}'`)
  })

  it("returns the correct config for 'scap-wall-slides'", () => {
    const cfg = getExerciseConfig("scap-wall-slides")
    expect(cfg).toBeDefined()
    expect(cfg!.id).toBe("scap-wall-slides")
    out("HIT", "getExerciseConfig('scap-wall-slides')", `found: name='${cfg!.name}'`)
  })

  it("returns undefined for a completely unknown id", () => {
    const r = getExerciseConfig("ghost-exercise-xyz")
    expect(r).toBeUndefined()
    out("MISS", "getExerciseConfig('ghost-exercise-xyz')", "undefined", "unknown id → undefined")
  })

  it("returns undefined for an empty string", () => {
    const r = getExerciseConfig("")
    expect(r).toBeUndefined()
    out("MISS", "getExerciseConfig('')", "undefined", "empty string → undefined")
  })

  it("is case-sensitive: 'Knee-Extension' (title case) returns undefined", () => {
    const r = getExerciseConfig("Knee-Extension")
    expect(r).toBeUndefined()
    out("CASE", "getExerciseConfig('Knee-Extension')", "undefined", "ids are lowercase-exact")
  })

  it("is case-sensitive: 'KNEE-EXTENSION' (all caps) returns undefined", () => {
    const r = getExerciseConfig("KNEE-EXTENSION")
    expect(r).toBeUndefined()
    out("CASE", "getExerciseConfig('KNEE-EXTENSION')", "undefined")
  })

  it("returned config object is the exact same reference as in EXERCISE_CONFIGS", () => {
    const cfg = getExerciseConfig("knee-extension")
    const found = EXERCISE_CONFIGS.find(c => c.id === "knee-extension")
    expect(cfg).toBe(found)
    out("REF", "getExerciseConfig vs EXERCISE_CONFIGS.find", "same object reference ✓")
  })
})

// ===========================================================================
// filterAnglesByExercise(angles, exerciseId)
// ===========================================================================

describe("filterAnglesByExercise() — keep only angles relevant to the given exercise", () => {

  beforeAll(() => { HEAD("filterAnglesByExercise()") })

  /**
   * Broad set spanning both exercise families + an irrelevant name.
   */
  const ALL = [
    "left_knee", "right_knee",
    "left_shoulder", "right_shoulder",
    "left_elbow", "right_elbow",
    "left_leg_segment",
    "totally_irrelevant",
  ]

  describe("knee-extension filtering", () => {
    it("keeps knee + leg-segment angles, drops shoulder + irrelevant", () => {
      const r = filterAnglesByExercise(ALL, "knee-extension")
      expect(r).toContain("left_knee")
      expect(r).toContain("right_knee")
      expect(r).toContain("left_leg_segment")
      expect(r).not.toContain("left_shoulder")
      expect(r).not.toContain("right_shoulder")
      expect(r).not.toContain("totally_irrelevant")
      out("KNEE", `${ALL.length} angles in`, `[${r.join(", ")}] (${r.length} kept)`)
    })
  })

  describe("scap-wall-slides filtering", () => {
    it("keeps shoulder + elbow angles, drops knee + irrelevant", () => {
      const r = filterAnglesByExercise(ALL, "scap-wall-slides")
      expect(r).toContain("left_shoulder")
      expect(r).toContain("right_shoulder")
      expect(r).not.toContain("left_knee")
      expect(r).not.toContain("right_knee")
      expect(r).not.toContain("totally_irrelevant")
      out("SCAP", `${ALL.length} angles in`, `[${r.join(", ")}] (${r.length} kept)`)
    })
  })

  describe("unknown exercise type — fallback: return all angles", () => {
    it("returns the full input array when the exercise id is not registered", () => {
      const r = filterAnglesByExercise(ALL, "ghost-exercise")
      expect(r).toEqual(ALL)
      out("FALLBACK", "unknown id 'ghost-exercise'", `all ${r.length} angles returned`, "no data loss on unknown type")
    })
  })

  describe("edge cases", () => {
    it("empty input → empty output, regardless of exercise type", () => {
      const r = filterAnglesByExercise([], "knee-extension")
      expect(r).toEqual([])
      out("EMPTY", "filterAnglesByExercise([], 'knee-extension')", "[]")
    })

    it("single relevant angle → single-element output", () => {
      const r = filterAnglesByExercise(["left_knee"], "knee-extension")
      expect(r).toEqual(["left_knee"])
      out("SINGLE", "['left_knee'] for knee-extension", `[${r.join(", ")}]`)
    })

    it("single irrelevant angle → empty output", () => {
      const r = filterAnglesByExercise(["totally_irrelevant"], "knee-extension")
      expect(r).toEqual([])
      out("IRREL", "['totally_irrelevant'] for knee-extension", "[]")
    })

    it("output is a subset of the input — no new angle names introduced", () => {
      const r = filterAnglesByExercise(ALL, "knee-extension")
      for (const angle of r) {
        expect(ALL).toContain(angle)
      }
      out("SUBSET", "all output angles exist in input", "✓ no phantom angles")
    })

    it("output order preserves input order (filter uses Array.filter which retains input sequence)", () => {
      // Implementation uses allAngles.filter(…) → output order = input order
      const input = ["totally_irrelevant", "left_leg_segment", "right_knee", "left_knee"]
      const r = filterAnglesByExercise(input, "knee-extension")
      // Only the three relevant items survive, in the order they appeared in `input`
      expect(r).toEqual(["left_leg_segment", "right_knee", "left_knee"])
      out("ORDER", "reversed input, knee-extension", `[${r.join(", ")}]`, "preserves input order")
    })
  })
})
