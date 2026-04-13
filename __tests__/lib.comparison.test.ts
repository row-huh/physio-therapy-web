/**
 * Whitebox tests — lib/comparison.ts
 *
 * Two exported functions that compute how similar a patient's recorded
 * template is to an ideal reference. The scoring drives the session
 * report shown to both patient and doctor.
 *
 * calculateStateSimilarity(stateA, stateB, relevantAngles?)
 *   → 0-100 score; 100=identical angles, 0=no overlap or maximum difference
 *   Internal formula per angle: max(0, 100 - (|mean_a - mean_b| / 180) * 100)
 *
 * compareTemplates(reference, uploaded)
 *   → ComparisonResult  (similarity, reps, details)
 *   Internal weighting: 60% state similarity + 40% angle accuracy
 *   Filters to exercise-specific angles via EXERCISE_CONFIGS
 */

import { compareTemplates, calculateStateSimilarity } from "@/lib/comparison"
import type { DetectedState, LearnedExerciseTemplate } from "@/lib/exercise-state-learner"

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

function makeState(
  id: string,
  angles: Record<string, number>,
  occurrences = [{ startTime: 0, endTime: 1, duration: 1 }]
): DetectedState {
  const angleRanges: DetectedState["angleRanges"] = {}
  for (const [name, mean] of Object.entries(angles)) {
    angleRanges[name] = { mean, min: mean - 5, max: mean + 5, stdDev: 2 }
  }
  return { id, name: id, description: "", angleRanges, occurrences, representativeTimestamp: 0.5 }
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
    metadata: { detectedAt: new Date().toISOString(), videoLength: 10, fps: 30, confidence: 80 },
  }
}

// ---------------------------------------------------------------------------
// Output helpers
// ---------------------------------------------------------------------------

const HEAD = (s: string) =>
  process.stdout.write(`\n  ┌─ ${s} ${"─".repeat(Math.max(0, 50 - s.length))}┐\n`)

const out = (tag: string, desc: string, result: string, note = "") => {
  const t = `[${tag}]`.padEnd(11)
  const d = desc.padEnd(40)
  const n = note ? `  ← ${note}` : ""
  process.stdout.write(`  ${t}  ${d}  →  ${result}${n}\n`)
}

beforeAll(() => {
  process.stdout.write("\n")
  process.stdout.write("  ╔══════════════════════════════════════════════════════╗\n")
  process.stdout.write("  ║  lib/comparison.ts  whitebox test suite              ║\n")
  process.stdout.write("  ╚══════════════════════════════════════════════════════╝\n")
})

// ===========================================================================
// calculateStateSimilarity()
// ===========================================================================

describe("calculateStateSimilarity() — pairwise angle-mean comparison, returns [0, 100]", () => {

  beforeAll(() => {
    HEAD("calculateStateSimilarity()")
    process.stdout.write("  formula per angle:  max(0,  100 - (|mean_a - mean_b| / 180) * 100)\n")
  })

  describe("boundary scores", () => {
    it("identical means → 100", () => {
      const r = calculateStateSimilarity(
        makeState("a", { left_knee: 90, right_knee: 90 }),
        makeState("b", { left_knee: 90, right_knee: 90 })
      )
      expect(r).toBe(100)
      out("SAME", "both means=90°", "score=100")
    })

    it("diff=180° → 0  (maximum possible difference)", () => {
      const r = calculateStateSimilarity(
        makeState("a", { left_knee: 0   }),
        makeState("b", { left_knee: 180 })
      )
      expect(r).toBe(0)
      out("MAX-DIFF", "0° vs 180°", "score=0", "100-(180/180)*100=0")
    })

    it("no common angle keys → 0  (nothing to compare)", () => {
      const r = calculateStateSimilarity(
        makeState("a", { left_knee: 90     }),
        makeState("b", { right_shoulder: 45 })
      )
      expect(r).toBe(0)
      out("NO-KEYS", "left_knee vs right_shoulder", "score=0", "zero shared keys")
    })
  })

  describe("intermediate scores — formula verification", () => {
    it("diff=30° → ~83.3  (100 - 30/180*100)", () => {
      const r = calculateStateSimilarity(
        makeState("a", { left_knee: 90  }),
        makeState("b", { left_knee: 120 })
      )
      expect(r).toBeGreaterThan(0)
      expect(r).toBeLessThan(100)
      expect(r).toBeCloseTo(83.33, 1)
      out("PARTIAL", "90° vs 120° (diff=30°)", `score=${r.toFixed(2)}`, "expected ≈83.33")
    })

    it("diff=90° → 50  (exactly half the range)", () => {
      const r = calculateStateSimilarity(
        makeState("a", { left_knee: 0  }),
        makeState("b", { left_knee: 90 })
      )
      expect(r).toBeCloseTo(50, 1)
      out("HALF", "0° vs 90° (diff=90°)", `score=${r.toFixed(2)}`, "expected 50.00")
    })
  })

  describe("multi-angle averaging", () => {
    it("perfect angle + worst-case angle → average = 50", () => {
      // a1: diff=0→score=100; a2: diff=180→score=0; average=50
      const r = calculateStateSimilarity(
        makeState("a", { a1: 90, a2: 0   }),
        makeState("b", { a1: 90, a2: 180 }),
        null
      )
      expect(r).toBeCloseTo(50, 1)
      out("AVG", "perfect(100) + worst(0) → avg", `score=${r.toFixed(2)}`, "expected 50")
    })

    it("three angles with varying diffs average correctly", () => {
      // diff=0(100) + diff=90(50) + diff=180(0) → average=50
      const r = calculateStateSimilarity(
        makeState("a", { a: 90, b: 90,  c: 0   }),
        makeState("b", { a: 90, b: 180, c: 180 })
      )
      expect(r).toBeCloseTo(50, 0)
      out("AVG3", "diffs [0°, 90°, 180°]", `score=${r.toFixed(2)}`, "expected ≈50")
    })
  })

  describe("relevantAngles filter", () => {
    it("passing a Set keeps only matching angles — discrepant shoulder ignored if only knee in filter", () => {
      const s1 = makeState("a", { left_knee: 90, right_shoulder: 30  })
      const s2 = makeState("b", { left_knee: 90, right_shoulder: 180 })
      const withFilter    = calculateStateSimilarity(s1, s2, new Set(["left_knee"]))
      const withoutFilter = calculateStateSimilarity(s1, s2)
      expect(withFilter).toBe(100)
      expect(withoutFilter).toBeLessThan(100)
      out("FILTER", "filter=['left_knee']", `filtered=${withFilter}  unfiltered=${withoutFilter.toFixed(1)}`, "shoulder excluded")
    })

    it("empty Set → 0  (all angles filtered out → nothing to compare)", () => {
      const r = calculateStateSimilarity(
        makeState("a", { left_knee: 90 }),
        makeState("b", { left_knee: 90 }),
        new Set()
      )
      expect(r).toBe(0)
      out("EMPTY-SET", "filter=Set()", "score=0", "empty filter → no common angles")
    })

    it("null filter behaves the same as no filter (all common angles used)", () => {
      const s1 = makeState("a", { left_knee: 90, right_knee: 90 })
      const s2 = makeState("b", { left_knee: 90, right_knee: 90 })
      const withNull = calculateStateSimilarity(s1, s2, null)
      const withNone = calculateStateSimilarity(s1, s2)
      expect(withNull).toBe(withNone)
      out("NULL-FILTER", "null vs undefined filter", `same result: ${withNull}`, "null treated as no filter")
    })
  })

  describe("score is always in [0, 100]", () => {
    it("no input combination produces a value outside [0, 100]", () => {
      const pairs: [number, number][] = [[0,0],[90,90],[0,180],[45,180],[180,0],[90,135]]
      for (const [a, b] of pairs) {
        const r = calculateStateSimilarity(
          makeState("x", { angle: a }),
          makeState("y", { angle: b })
        )
        expect(r).toBeGreaterThanOrEqual(0)
        expect(r).toBeLessThanOrEqual(100)
      }
      out("RANGE", "6 angle pairs, all diffs", "all results in [0, 100] ✓")
    })
  })
})

// ===========================================================================
// compareTemplates()
// ===========================================================================

describe("compareTemplates() — compare patient's template against ideal reference", () => {

  beforeAll(() => {
    HEAD("compareTemplates()")
    process.stdout.write("  weighting: 60% state similarity + 40% angle accuracy\n")
    process.stdout.write("  angle filtering: driven by exerciseType in EXERCISE_CONFIGS\n")
  })

  describe("result shape", () => {
    it("all required top-level fields are present: similarity, referenceReps, uploadedReps, details", () => {
      const s = makeState("s0", { left_knee: 90 })
      const t = makeTemplate("knee-extension", [s])
      const r = compareTemplates(t, t)
      expect(typeof r.similarity).toBe("number")
      expect(typeof r.referenceReps).toBe("number")
      expect(typeof r.uploadedReps).toBe("number")
      expect(r.details).toBeDefined()
      out("SHAPE", "top-level fields", "similarity, referenceReps, uploadedReps, details ✓")
    })

    it("details has: stateMatches, angleDeviations, referenceTemplate, uploadedTemplate", () => {
      const s = makeState("s0", { left_knee: 90 })
      const t = makeTemplate("knee-extension", [s])
      const r = compareTemplates(t, t)
      expect(r.details.stateMatches).toBeDefined()
      expect(r.details.angleDeviations).toBeDefined()
      expect(r.details.referenceTemplate).toBeDefined()
      expect(r.details.uploadedTemplate).toBeDefined()
      out("SHAPE", "details nested fields", "stateMatches, angleDeviations, templates ✓")
    })

    it("similarity is always an integer (Math.round applied)", () => {
      // Non-integer angles produce non-integer internal scores before rounding
      const r = compareTemplates(
        makeTemplate("knee-extension", [makeState("s", { left_knee: 90 })]),
        makeTemplate("knee-extension", [makeState("s", { left_knee: 95 })])
      )
      expect(Number.isInteger(r.similarity)).toBe(true)
      out("INT", "similarity with non-identical angles", `${r.similarity}  (integer)`, "Math.round applied")
    })

    it("referenceReps and uploadedReps come from each template's recommendedReps independently", () => {
      const s   = makeState("s0", { left_knee: 90 })
      const ref = makeTemplate("knee-extension", [s], 5)
      const up  = makeTemplate("knee-extension", [s], 8)
      const r   = compareTemplates(ref, up)
      expect(r.referenceReps).toBe(5)
      expect(r.uploadedReps).toBe(8)
      out("REPS", "ref=5 reps, uploaded=8 reps", `referenceReps=${r.referenceReps}  uploadedReps=${r.uploadedReps}`)
    })
  })

  describe("similarity scores", () => {
    it("identical templates → similarity = 100", () => {
      const s = makeState("s0", { left_knee: 170, right_knee: 170 })
      const t = makeTemplate("knee-extension", [s], 5)
      const r = compareTemplates(t, t)
      expect(r.similarity).toBe(100)
      out("IDENTICAL", "same template vs itself", `similarity=${r.similarity}`)
    })

    it("greatly different templates → similarity < 60", () => {
      const ref = makeTemplate("knee-extension", [makeState("s", { left_knee: 170 })])
      const up  = makeTemplate("knee-extension", [makeState("s", { left_knee: 10  })])
      const r   = compareTemplates(ref, up)
      expect(r.similarity).toBeLessThan(60)
      out("DIFFERENT", "170° vs 10° (diff=160°)", `similarity=${r.similarity}`, "< 60 expected")
    })

    it("small difference (5°) → similarity > 90", () => {
      const ref = makeTemplate("knee-extension", [makeState("s", { left_knee: 90 })])
      const up  = makeTemplate("knee-extension", [makeState("s", { left_knee: 95 })])
      const r   = compareTemplates(ref, up)
      expect(r.similarity).toBeGreaterThan(90)
      out("CLOSE", "90° vs 95° (diff=5°)", `similarity=${r.similarity}`, "> 90 expected")
    })
  })

  describe("exercise-type angle filtering", () => {
    it("ignores shoulder angles for knee-extension: matching knees + 130° shoulder gap → high similarity", () => {
      const ref = makeTemplate("knee-extension", [makeState("s", { left_knee: 170, left_shoulder: 30  })])
      const up  = makeTemplate("knee-extension", [makeState("s", { left_knee: 170, left_shoulder: 160 })])
      const r   = compareTemplates(ref, up)
      expect(r.similarity).toBeGreaterThan(85)
      expect(r.details.angleDeviations["left_shoulder"]).toBeUndefined()
      out("FILTER", "knees match, shoulder 130° apart (knee-extension)", `similarity=${r.similarity}`, "shoulder filtered from angleDeviations")
    })

    it("ignores knee angles for scap-wall-slides: matching shoulders + 160° knee gap → high similarity", () => {
      const ref = makeTemplate("scap-wall-slides", [makeState("s", { left_shoulder: 90, left_knee: 0   })])
      const up  = makeTemplate("scap-wall-slides", [makeState("s", { left_shoulder: 90, left_knee: 160 })])
      const r   = compareTemplates(ref, up)
      expect(r.similarity).toBeGreaterThan(85)
      expect(r.details.angleDeviations["left_knee"]).toBeUndefined()
      out("FILTER", "shoulders match, knees 160° apart (scap)", `similarity=${r.similarity}`, "knee filtered")
    })

    it("unknown exercise type falls back to all angles — does not throw", () => {
      const s = makeState("s0", { custom_angle: 90 })
      const r = compareTemplates(
        makeTemplate("unknown-exercise", [s]),
        makeTemplate("unknown-exercise", [s])
      )
      expect(() => compareTemplates(
        makeTemplate("unknown-exercise", [s]),
        makeTemplate("unknown-exercise", [s])
      )).not.toThrow()
      expect(r.similarity).toBe(100)
      out("FALLBACK", "unknown exerciseType, identical angles", `similarity=${r.similarity}  (no throw)`)
    })
  })

  describe("edge cases — empty/degenerate inputs", () => {
    it("empty uploaded states → does not throw, returns a result", () => {
      const ref = makeTemplate("knee-extension", [makeState("s", { left_knee: 90 })])
      const up  = makeTemplate("knee-extension", [])
      expect(() => compareTemplates(ref, up)).not.toThrow()
      const r = compareTemplates(ref, up)
      expect(r.similarity).toBeGreaterThanOrEqual(0)
      out("EMPTY-UP", "uploaded has 0 states", `similarity=${r.similarity}  (no throw)`)
    })

    it("empty reference states → does not throw, returns a result", () => {
      const ref = makeTemplate("knee-extension", [])
      const up  = makeTemplate("knee-extension", [makeState("s", { left_knee: 90 })])
      expect(() => compareTemplates(ref, up)).not.toThrow()
      out("EMPTY-REF", "reference has 0 states", "no throw ✓")
    })

    it("both templates empty → similarity is 0 (nothing to compare)", () => {
      const ref = makeTemplate("knee-extension", [])
      const up  = makeTemplate("knee-extension", [])
      const r   = compareTemplates(ref, up)
      expect(r.similarity).toBe(0)
      out("BOTH-EMPTY", "both have 0 states", `similarity=${r.similarity}`)
    })
  })
})
