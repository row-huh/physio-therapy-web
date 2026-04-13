/**
 * Whitebox tests — lib/utils.ts
 *
 * Five small utility functions used throughout the UI layer.
 * Every threshold boundary is tested on both sides so regressions
 * in the ternary chains are caught immediately.
 */

import {
  cn,
  formatAngleName,
  getSimilarityColor,
  getSimilarityBg,
  getDeviationBg,
} from "@/lib/utils"

// ---------------------------------------------------------------------------
// Shared output helpers
// ---------------------------------------------------------------------------

const SEP  = "  " + "─".repeat(54)
const HEAD = (fn: string) => process.stdout.write(`\n  ┌─ ${fn} ${"─".repeat(Math.max(0, 50 - fn.length))}┐\n`)
const out  = (tag: string, input: string, arrow: string, note = "") => {
  const t = `[${tag}]`.padEnd(10)
  const i = input.padEnd(36)
  const n = note ? `  ← ${note}` : ""
  process.stdout.write(`  ${t}  ${i}  →  ${arrow}${n}\n`)
}

beforeAll(() => {
  process.stdout.write("\n")
  process.stdout.write("  ╔══════════════════════════════════════════════════════╗\n")
  process.stdout.write("  ║  lib/utils.ts  whitebox test suite                  ║\n")
  process.stdout.write("  ╚══════════════════════════════════════════════════════╝\n")
})

// ===========================================================================
// cn()  —  clsx + tailwind-merge
// ===========================================================================

describe("cn() — clsx + tailwind-merge class combiner", () => {

  beforeAll(() => { HEAD("cn()") })

  it("joins two plain strings with a space", () => {
    const r = cn("foo", "bar")
    expect(r).toBe("foo bar")
    out("JOIN", "'foo', 'bar'", `'${r}'`)
  })

  it("resolves a Tailwind conflict: later bg wins, earlier is dropped", () => {
    const r = cn("bg-red-500", "bg-blue-500")
    expect(r).toBe("bg-blue-500")
    out("TW-MERGE", "'bg-red-500', 'bg-blue-500'", `'${r}'`, "bg-red-500 dropped")
  })

  it("drops false, undefined, null — keeps adjacent truthy strings", () => {
    const r = cn("base", false && "never", undefined, null as any, "end")
    expect(r).toBe("base end")
    out("FALSY", "'base', false, undefined, null, 'end'", `'${r}'`, "falsy values absent")
  })

  it("returns empty string when ALL inputs are falsy", () => {
    const r = cn(false as any, undefined, null as any)
    expect(r).toBe("")
    out("ALL-FALSY", "false, undefined, null", `'${r}'`, "no classes → empty")
  })

  it("accepts clsx extended forms: arrays and conditional objects", () => {
    const r = cn(["a", "b"], { c: true, d: false })
    expect(r).toBe("a b c")
    out("OBJECT", "['a','b'], {c:true, d:false}", `'${r}'`, "'d' excluded (false)")
  })

  it("resolves multiple Tailwind conflicts in a single call", () => {
    const r = cn("p-2", "p-4", "text-red-500", "text-blue-500")
    expect(r).toBe("p-4 text-blue-500")
    out("MULTI-TW", "'p-2', 'p-4', 'text-red', 'text-blue'", `'${r}'`, "last of each group wins")
  })
})

// ===========================================================================
// formatAngleName()
// ===========================================================================

describe("formatAngleName() — snake_case joint name → Title Case display string", () => {

  beforeAll(() => { HEAD("formatAngleName()") })

  const cases: [string, string][] = [
    ["knee",               "Knee"],
    ["left_knee",          "Left Knee"],
    ["right_shoulder",     "Right Shoulder"],
    ["left_thigh_segment", "Left Thigh Segment"],
    ["",                   ""],
  ]

  it.each(cases)("'%s'  →  '%s'", (input, expected) => {
    const r = formatAngleName(input)
    expect(r).toBe(expected)
    out("FMT", `'${input}'`, `'${r}'`)
  })

  it("each word starts with an uppercase letter (not lowercase)", () => {
    const words = formatAngleName("left_thigh_segment").split(" ")
    for (const w of words) {
      expect(w[0]).toMatch(/[A-Z]/)
    }
    out("CASE", "each word in 'left_thigh_segment'", "uppercase first char ✓")
  })

  it("underscores are replaced with spaces — no underscore appears in output", () => {
    const r = formatAngleName("left_knee")
    expect(r).not.toContain("_")
    out("NO-US", "'left_knee'", `'${r}'`, "no underscore in result")
  })
})

// ===========================================================================
// getSimilarityColor()   thresholds: ≥80 green | ≥60 yellow | <60 red
// ===========================================================================

describe("getSimilarityColor() — score [0-100] → Tailwind text-color class", () => {

  beforeAll(() => {
    HEAD("getSimilarityColor()")
    process.stdout.write(`${SEP}\n`)
    process.stdout.write("  thresholds:  score ≥ 80  →  green  |  ≥ 60  →  yellow  |  < 60  →  red\n")
    process.stdout.write(`${SEP}\n`)
  })

  it("score=100 → text-green-500", () => {
    const r = getSimilarityColor(100)
    expect(r).toBe("text-green-500")
    out("GREEN", "score=100", r)
  })

  it("score=80 → text-green-500  (green lower boundary, inclusive)", () => {
    const r = getSimilarityColor(80)
    expect(r).toBe("text-green-500")
    out("GREEN", "score=80", r, "lower bound — inclusive")
  })

  it("score=79 → text-yellow-500  (one below green boundary)", () => {
    const r = getSimilarityColor(79)
    expect(r).toBe("text-yellow-500")
    out("YELLOW", "score=79", r, "just below green")
  })

  it("score=70 → text-yellow-500", () => {
    const r = getSimilarityColor(70)
    expect(r).toBe("text-yellow-500")
    out("YELLOW", "score=70", r)
  })

  it("score=60 → text-yellow-500  (yellow lower boundary, inclusive)", () => {
    const r = getSimilarityColor(60)
    expect(r).toBe("text-yellow-500")
    out("YELLOW", "score=60", r, "lower bound — inclusive")
  })

  it("score=59 → text-red-500  (one below yellow boundary)", () => {
    const r = getSimilarityColor(59)
    expect(r).toBe("text-red-500")
    out("RED", "score=59", r, "just below yellow")
  })

  it("score=0 → text-red-500", () => {
    const r = getSimilarityColor(0)
    expect(r).toBe("text-red-500")
    out("RED", "score=0", r)
  })
})

// ===========================================================================
// getSimilarityBg()  — mirrors getSimilarityColor() with bg- prefix
// ===========================================================================

describe("getSimilarityBg() — score [0-100] → Tailwind bg-color class (mirrors text logic)", () => {

  beforeAll(() => { HEAD("getSimilarityBg()") })

  const cases: [number, string][] = [
    [100, "bg-green-500"],
    [80,  "bg-green-500"],
    [79,  "bg-yellow-500"],
    [60,  "bg-yellow-500"],
    [59,  "bg-red-500"],
    [0,   "bg-red-500"],
  ]

  it.each(cases)("score=%i → %s", (score, expected) => {
    const r = getSimilarityBg(score)
    expect(r).toBe(expected)
    const note =
      score === 80 ? "green lower bound" :
      score === 79 ? "yellow upper bound" :
      score === 60 ? "yellow lower bound" :
      score === 59 ? "red upper bound" : ""
    out("BG", `score=${score}`, r, note)
  })

  it("bg- and text- tiers are in sync: same score always maps to the same color name", () => {
    const scores = [100, 80, 79, 70, 60, 59, 0]
    for (const s of scores) {
      const color = getSimilarityColor(s)   // e.g. text-green-500
      const bg    = getSimilarityBg(s)       // e.g. bg-green-500
      const colorName = color.replace("text-", "")
      const bgName    = bg.replace("bg-", "")
      expect(colorName).toBe(bgName)
    }
    out("SYNC", "text- vs bg- at same score", "color names match ✓")
  })
})

// ===========================================================================
// getDeviationBg()   thresholds: <10° green | <20° yellow | ≥20° red
// ===========================================================================

describe("getDeviationBg() — angle deviation (°) → Tailwind bg-color class for comparison table", () => {

  beforeAll(() => {
    HEAD("getDeviationBg()")
    process.stdout.write(`${SEP}\n`)
    process.stdout.write("  thresholds:  deviation < 10°  →  green  |  < 20°  →  yellow  |  ≥ 20°  →  red\n")
    process.stdout.write(`${SEP}\n`)
  })

  const GREEN  = "bg-green-50 dark:bg-green-950/20"
  const YELLOW = "bg-yellow-50 dark:bg-yellow-950/20"
  const RED    = "bg-red-50 dark:bg-red-950/20"

  it("deviation=0° → green (ideal: zero error)", () => {
    const r = getDeviationBg(0)
    expect(r).toBe(GREEN)
    out("GREEN", "deviation=0°", "green-50")
  })

  it("deviation=9° → green (just below threshold)", () => {
    const r = getDeviationBg(9)
    expect(r).toBe(GREEN)
    out("GREEN", "deviation=9°", "green-50")
  })

  it("deviation=9.9° → green (strictly < 10, confirms float boundary)", () => {
    const r = getDeviationBg(9.9)
    expect(r).toBe(GREEN)
    out("GREEN", "deviation=9.9°", "green-50", "strictly < 10")
  })

  it("deviation=10° → yellow (green→yellow boundary, inclusive at 10)", () => {
    const r = getDeviationBg(10)
    expect(r).toBe(YELLOW)
    out("YELLOW", "deviation=10°", "yellow-50", "lower bound — NOT green")
  })

  it("deviation=15° → yellow", () => {
    const r = getDeviationBg(15)
    expect(r).toBe(YELLOW)
    out("YELLOW", "deviation=15°", "yellow-50")
  })

  it("deviation=19° → yellow (just below red boundary)", () => {
    const r = getDeviationBg(19)
    expect(r).toBe(YELLOW)
    out("YELLOW", "deviation=19°", "yellow-50", "just below red")
  })

  it("deviation=20° → red (yellow→red boundary, inclusive at 20)", () => {
    const r = getDeviationBg(20)
    expect(r).toBe(RED)
    out("RED", "deviation=20°", "red-50", "lower bound — NOT yellow")
  })

  it("deviation=45° → red", () => {
    const r = getDeviationBg(45)
    expect(r).toBe(RED)
    out("RED", "deviation=45°", "red-50")
  })

  it("output always includes a dark-mode variant class", () => {
    for (const deg of [5, 15, 25]) {
      expect(getDeviationBg(deg)).toContain("dark:")
    }
    out("DARK", "5°, 15°, 25°", "all include dark: class ✓")
  })
})
