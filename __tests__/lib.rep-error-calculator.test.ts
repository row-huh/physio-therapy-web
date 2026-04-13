/**
 * Whitebox tests — lib/rep-error-calculator.ts
 *
 * Two exported functions:
 *
 *   calculateRepError(angles, template, anglesOfInterest, repNumber, timestamp)
 *     Finds the nearest template state (Euclidean distance), computes
 *     per-angle error against the state's [min-stdDev, max+stdDev] corridor,
 *     and returns a RepError. Returns null when the primary angle is missing.
 *
 *   analyzeRepTrends(repErrors[])
 *     Aggregates a rep session: trend (improving/declining/stable),
 *     best/worst rep numbers, average error, common mistakes.
 */

import {
  calculateRepError,
  analyzeRepTrends,
} from "@/lib/rep-error-calculator"
import type { RepError } from "@/lib/rep-error-calculator"
import type { LearnedExerciseTemplate, DetectedState } from "@/lib/exercise-state-learner"

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

function makeState(
  id: string,
  angles: Record<string, { mean: number; min: number; max: number; stdDev: number }>,
  name = id
): DetectedState {
  return {
    id, name, description: "",
    angleRanges: angles,
    occurrences: [{ startTime: 0, endTime: 1, duration: 1 }],
    representativeTimestamp: 0.5,
  }
}

function makeTemplate(states: DetectedState[]): LearnedExerciseTemplate {
  return {
    exerciseName: "knee-extension", exerciseType: "knee-extension",
    states, transitions: [], repSequence: [], totalDuration: 10, recommendedReps: 3,
    metadata: { detectedAt: new Date().toISOString(), videoLength: 10, fps: 30, confidence: 80 },
  }
}

function makeRepError(repNumber: number, overallError: number, angleName = "left_knee"): RepError {
  return {
    repNumber,
    timestamp: repNumber * 1.0,
    errors: {
      [angleName]: {
        expected: 90,
        actual: 90 + overallError,
        error: overallError,
        percentError: Math.min(100, (overallError / 20) * 100),
      },
    },
    overallError,
    formScore: Math.max(0, Math.min(100, 100 - overallError / 2)),
    stateName: "some-state",
  }
}

// ---------------------------------------------------------------------------
// Output helpers
// ---------------------------------------------------------------------------

const HEAD = (s: string) =>
  process.stdout.write(`\n  ┌─ ${s} ${"─".repeat(Math.max(0, 50 - s.length))}┐\n`)

const out = (tag: string, desc: string, result: string, note = "") => {
  const t = `[${tag}]`.padEnd(11)
  const d = desc.padEnd(42)
  const n = note ? `  ← ${note}` : ""
  process.stdout.write(`  ${t}  ${d}  →  ${result}${n}\n`)
}

beforeAll(() => {
  process.stdout.write("\n")
  process.stdout.write("  ╔══════════════════════════════════════════════════════╗\n")
  process.stdout.write("  ║  lib/rep-error-calculator.ts  whitebox test suite    ║\n")
  process.stdout.write("  ╚══════════════════════════════════════════════════════╝\n")
})

const AOI = ["left_knee"]

// ===========================================================================
// calculateRepError()
// ===========================================================================

describe("calculateRepError() — per-rep angle error against the nearest template state", () => {

  beforeAll(() => {
    HEAD("calculateRepError()")
    process.stdout.write("  corridor per angle:  [state.min - stdDev,  state.max + stdDev]\n")
    process.stdout.write("  formScore formula:   max(0, min(100, 100 - overallError / 2))\n")
  })

  describe("null returns", () => {
    it("returns null when the angle map is empty (primary angle absent)", () => {
      const t = makeTemplate([makeState("s0", { left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 } })])
      const r = calculateRepError({}, t, AOI, 1, 0)
      expect(r).toBeNull()
      out("NULL", "currentAngles={} (primary absent)", "null", "camera lost the joint")
    })

    it("returns null when the template has no state containing the primary angle", () => {
      const t = makeTemplate([makeState("s0", { right_shoulder: { mean: 90, min: 80, max: 100, stdDev: 5 } })])
      const r = calculateRepError({ left_knee: 90 }, t, AOI, 1, 0)
      expect(r).toBeNull()
      out("NULL", "template has only right_shoulder", "null", "no candidate state for primary")
    })
  })

  describe("error = 0  (within [min-stdDev, max+stdDev] corridor)", () => {
    it("actual=170 in corridor [155, 185] (mean=170 min=160 max=180 stdDev=5) → error=0", () => {
      const t = makeTemplate([makeState("s", { left_knee: { mean: 170, min: 160, max: 180, stdDev: 5 } })])
      const r = calculateRepError({ left_knee: 170 }, t, AOI, 1, 0)
      expect(r).not.toBeNull()
      expect(r!.errors["left_knee"].error).toBe(0)
      out("ZERO", "actual=170, corridor [155,185]", `error=${r!.errors["left_knee"].error}`, "inside corridor")
    })

    it("actual at corridor ceiling (max+stdDev=105) → error=0", () => {
      const t = makeTemplate([makeState("s", { left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 } })])
      const r = calculateRepError({ left_knee: 105 }, t, AOI, 1, 0)
      expect(r).not.toBeNull()
      expect(r!.errors["left_knee"].error).toBe(0)
      out("ZERO", "actual=105 at corridor ceiling=105", `error=${r!.errors["left_knee"].error}`)
    })

    it("actual at corridor floor (min-stdDev=75) → error=0", () => {
      const t = makeTemplate([makeState("s", { left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 } })])
      const r = calculateRepError({ left_knee: 75 }, t, AOI, 1, 0)
      expect(r).not.toBeNull()
      expect(r!.errors["left_knee"].error).toBe(0)
      out("ZERO", "actual=75 at corridor floor=75", `error=${r!.errors["left_knee"].error}`)
    })
  })

  describe("error > 0  (outside corridor)", () => {
    it("actual=120 above ceiling=105 (min=80,max=100,std=5) → error≈15", () => {
      const t = makeTemplate([makeState("s", { left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 } })])
      const r = calculateRepError({ left_knee: 120 }, t, AOI, 1, 0)
      expect(r!.errors["left_knee"].error).toBeCloseTo(15, 0)
      out("ERROR", "actual=120 above ceiling=105", `error=${r!.errors["left_knee"].error.toFixed(1)}`, "120-105=15")
    })

    it("actual=60 below floor=75 (min=80,max=100,std=5) → error≈15", () => {
      const t = makeTemplate([makeState("s", { left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 } })])
      const r = calculateRepError({ left_knee: 60 }, t, AOI, 1, 0)
      expect(r!.errors["left_knee"].error).toBeCloseTo(15, 0)
      out("ERROR", "actual=60 below floor=75", `error=${r!.errors["left_knee"].error.toFixed(1)}`, "75-60=15")
    })
  })

  describe("formScore — derived formula", () => {
    it("formScore = max(0, min(100, 100 - overallError/2)) — verified numerically", () => {
      const t = makeTemplate([makeState("s", { left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 } })])
      const r = calculateRepError({ left_knee: 120 }, t, AOI, 1, 0)!
      const expected = Math.max(0, Math.min(100, 100 - r.overallError / 2))
      expect(r.formScore).toBeCloseTo(expected, 5)
      out("SCORE", `overallError=${r.overallError.toFixed(2)}`, `formScore=${r.formScore.toFixed(2)}`, `expected ${expected.toFixed(2)}`)
    })

    it("error=0 → formScore=100  (perfect corridor → perfect score)", () => {
      const t = makeTemplate([makeState("s", { left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 } })])
      const r = calculateRepError({ left_knee: 90 }, t, AOI, 1, 0)!
      expect(r.formScore).toBe(100)
      out("SCORE", "error=0 (perfect form)", `formScore=${r.formScore}`)
    })
  })

  describe("metadata pass-through", () => {
    it("repNumber and timestamp are stored exactly as passed", () => {
      const t = makeTemplate([makeState("s", { left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 } })])
      const r = calculateRepError({ left_knee: 90 }, t, AOI, 7, 42.5)!
      expect(r.repNumber).toBe(7)
      expect(r.timestamp).toBe(42.5)
      out("META", "repNumber=7, timestamp=42.5", `rep=${r.repNumber}  ts=${r.timestamp}`)
    })

    it("stateName is the nearest state's .name property (not its .id)", () => {
      const t = makeTemplate([makeState("state_bent", { left_knee: { mean: 90, min: 80, max: 100, stdDev: 5 } }, "Bent Position")])
      const r = calculateRepError({ left_knee: 90 }, t, AOI, 1, 0)!
      expect(r.stateName).toBe("Bent Position")
      out("META", "stateName from state.name not state.id", `'${r.stateName}'`)
    })
  })

  describe("multiple angles of interest", () => {
    it("both left_knee and right_knee entries exist when both provided and in template", () => {
      const t = makeTemplate([makeState("s", {
        left_knee:  { mean: 90, min: 80, max: 100, stdDev: 5 },
        right_knee: { mean: 90, min: 80, max: 100, stdDev: 5 },
      })])
      const r = calculateRepError({ left_knee: 90, right_knee: 90 }, t, ["left_knee", "right_knee"], 1, 0)!
      expect(r.errors["left_knee"]).toBeDefined()
      expect(r.errors["right_knee"]).toBeDefined()
      out("MULTI", "AOI=[left_knee, right_knee]", `errors: left=${r.errors["left_knee"].error}  right=${r.errors["right_knee"].error}`)
    })

    it("angle in AOI but absent from current frame is silently skipped (no crash)", () => {
      const t = makeTemplate([makeState("s", {
        left_knee:  { mean: 90, min: 80, max: 100, stdDev: 5 },
        right_knee: { mean: 90, min: 80, max: 100, stdDev: 5 },
      })])
      // Only supply left_knee — right_knee is missing from the current frame
      const r = calculateRepError({ left_knee: 90 }, t, ["left_knee", "right_knee"], 1, 0)
      expect(r).not.toBeNull()
      out("ABSENT", "right_knee in AOI but not in currentAngles", "no crash, result returned ✓")
    })
  })

  describe("nearest-state selection", () => {
    it("selects the state whose primary angle mean is closest to the current reading", () => {
      const t = makeTemplate([
        makeState("low",  { left_knee: { mean: 60,  min: 50,  max: 70,  stdDev: 5 } }, "Flexed"),
        makeState("high", { left_knee: { mean: 160, min: 150, max: 170, stdDev: 5 } }, "Extended"),
      ])
      // actual=155 → closer to 'Extended' (mean=160) than 'Flexed' (mean=60)
      const r = calculateRepError({ left_knee: 155 }, t, AOI, 1, 0)!
      expect(r.stateName).toBe("Extended")
      out("NEAREST", "actual=155, states at 60° and 160°", `selected '${r.stateName}'`, "|155-160|=5 < |155-60|=95")
    })
  })
})

// ===========================================================================
// analyzeRepTrends()
// ===========================================================================

describe("analyzeRepTrends() — aggregate error patterns across a session", () => {

  beforeAll(() => { HEAD("analyzeRepTrends()") })

  describe("empty input", () => {
    it("[] → { trend:'stable', average:0, best:0, worst:0, commonMistakes:[] }", () => {
      const s = analyzeRepTrends([])
      expect(s.errorTrend).toBe("stable")
      expect(s.averageError).toBe(0)
      expect(s.bestRep).toBe(0)
      expect(s.worstRep).toBe(0)
      expect(s.commonMistakes).toEqual([])
      out("EMPTY", "analyzeRepTrends([])", "stable, all zeros, no mistakes")
    })
  })

  describe("trend detection — first half vs second half average error", () => {
    it("[30,28,5,3] → 'improving'  (first-half avg=29 >> second-half avg=4)", () => {
      const s = analyzeRepTrends([
        makeRepError(1, 30), makeRepError(2, 28),
        makeRepError(3, 5),  makeRepError(4, 3),
      ])
      expect(s.errorTrend).toBe("improving")
      out("TREND", "errors=[30,28,5,3]", `trend='${s.errorTrend}'`, "first-half avg=29 >> second=4")
    })

    it("[2,3,25,30] → 'declining'  (first-half avg=2.5 << second-half avg=27.5)", () => {
      const s = analyzeRepTrends([
        makeRepError(1, 2),  makeRepError(2, 3),
        makeRepError(3, 25), makeRepError(4, 30),
      ])
      expect(s.errorTrend).toBe("declining")
      out("TREND", "errors=[2,3,25,30]", `trend='${s.errorTrend}'`, "first-half avg=2.5 << second=27.5")
    })

    it("[10,10,10,11] → 'stable'  (difference within threshold)", () => {
      const s = analyzeRepTrends([
        makeRepError(1, 10), makeRepError(2, 10),
        makeRepError(3, 10), makeRepError(4, 11),
      ])
      expect(s.errorTrend).toBe("stable")
      out("TREND", "errors=[10,10,10,11]", `trend='${s.errorTrend}'`, "tiny difference → stable")
    })

    it("single rep → 'stable'  (can't compute a trend from one data point)", () => {
      const s = analyzeRepTrends([makeRepError(1, 20)])
      expect(s.errorTrend).toBe("stable")
      out("TREND", "errors=[20] (single rep)", `trend='${s.errorTrend}'`)
    })
  })

  describe("bestRep and worstRep", () => {
    it("bestRep = rep with lowest overallError", () => {
      const s = analyzeRepTrends([
        makeRepError(1, 20), makeRepError(2, 5), makeRepError(3, 15),
      ])
      expect(s.bestRep).toBe(2)
      out("BEST", "errors=[1→20, 2→5, 3→15]", `bestRep=${s.bestRep}`, "rep 2 has lowest error")
    })

    it("worstRep = rep with highest overallError", () => {
      const s = analyzeRepTrends([
        makeRepError(1, 20), makeRepError(2, 5), makeRepError(3, 50),
      ])
      expect(s.worstRep).toBe(3)
      out("WORST", "errors=[1→20, 2→5, 3→50]", `worstRep=${s.worstRep}`, "rep 3 has highest error")
    })

    it("when all errors are equal, bestRep and worstRep are both valid rep numbers", () => {
      const s = analyzeRepTrends([makeRepError(1, 15), makeRepError(2, 15)])
      expect(s.bestRep).toBeGreaterThanOrEqual(1)
      expect(s.worstRep).toBeGreaterThanOrEqual(1)
      out("TIE", "errors=[15,15] (tied)", `bestRep=${s.bestRep}  worstRep=${s.worstRep}`, "both valid rep numbers")
    })
  })

  describe("averageError", () => {
    it("(10 + 20) / 2 = 15.0", () => {
      const s = analyzeRepTrends([makeRepError(1, 10), makeRepError(2, 20)])
      expect(s.averageError).toBeCloseTo(15, 5)
      out("AVG", "errors=[10,20]", `averageError=${s.averageError}`, "expected 15.0")
    })

    it("single rep → averageError equals that rep's error", () => {
      const s = analyzeRepTrends([makeRepError(1, 33)])
      expect(s.averageError).toBe(33)
      out("AVG", "single rep with error=33", `averageError=${s.averageError}`)
    })
  })

  describe("commonMistakes — angles with average percentError > 20%", () => {
    it("left_knee at 100% error × 2 reps → 'left knee' in commonMistakes", () => {
      const s = analyzeRepTrends([makeRepError(1, 100, "left_knee"), makeRepError(2, 100, "left_knee")])
      expect(s.commonMistakes.some(m => m.includes("left knee"))).toBe(true)
      out("MISTAKE", "left_knee percentError=100% (×2)", `commonMistakes=[${s.commonMistakes.join(", ")}]`)
    })

    it("left_knee at 0% error → NOT in commonMistakes (below threshold)", () => {
      const s = analyzeRepTrends([makeRepError(1, 0, "left_knee"), makeRepError(2, 0, "left_knee")])
      expect(s.commonMistakes).toHaveLength(0)
      out("CLEAN", "left_knee percentError=0%", "commonMistakes=[]", "below 20% threshold")
    })
  })
})
