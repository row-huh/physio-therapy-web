/**
 * Tests for lib/utils.ts
 *
 * Covers:
 *   - cn()               – class merging utility
 *   - formatAngleName()  – snake_case → Title Case conversion
 *   - getSimilarityColor() – 0-100 score → Tailwind text-color class
 *   - getSimilarityBg()    – 0-100 score → Tailwind bg-color class
 *   - getDeviationBg()     – degrees deviation → Tailwind bg-color class
 */

import { cn, formatAngleName, getSimilarityColor, getSimilarityBg, getDeviationBg } from "@/lib/utils"

// ---------------------------------------------------------------------------
// cn()
// ---------------------------------------------------------------------------

describe("cn", () => {
  it("merges two plain class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("deduplicates conflicting Tailwind classes (last one wins)", () => {
    // tailwind-merge keeps the last background colour
    const result = cn("bg-red-500", "bg-blue-500")
    expect(result).toBe("bg-blue-500")
  })

  it("handles conditional classes (falsy values are dropped)", () => {
    const result = cn("base", false && "never", undefined, null as any, "end")
    expect(result).toBe("base end")
  })

  it("returns empty string when all inputs are falsy", () => {
    expect(cn(false as any, undefined, null as any)).toBe("")
  })

  it("merges arrays and objects via clsx", () => {
    const result = cn(["a", "b"], { c: true, d: false })
    expect(result).toBe("a b c")
  })
})

// ---------------------------------------------------------------------------
// formatAngleName()
// ---------------------------------------------------------------------------

describe("formatAngleName", () => {
  it("converts a single-word snake_case angle to Title Case", () => {
    expect(formatAngleName("knee")).toBe("Knee")
  })

  it("converts multi-word snake_case to Title Case", () => {
    expect(formatAngleName("left_knee")).toBe("Left Knee")
  })

  it("handles three-word angle names", () => {
    expect(formatAngleName("left_thigh_segment")).toBe("Left Thigh Segment")
  })

  it("leaves already-uppercased words uppercased (not double-capitalized)", () => {
    // Only first char is uppercased by the regex — 'L' → 'L', rest unchanged
    const result = formatAngleName("left_knee")
    expect(result.startsWith("Left")).toBe(true)
  })

  it("returns empty string for empty input", () => {
    expect(formatAngleName("")).toBe("")
  })

  it("handles input with no underscores", () => {
    expect(formatAngleName("shoulder")).toBe("Shoulder")
  })
})

// ---------------------------------------------------------------------------
// getSimilarityColor()
// ---------------------------------------------------------------------------

describe("getSimilarityColor", () => {
  it("returns green for score >= 80", () => {
    expect(getSimilarityColor(80)).toBe("text-green-500")
    expect(getSimilarityColor(100)).toBe("text-green-500")
    expect(getSimilarityColor(95)).toBe("text-green-500")
  })

  it("returns yellow for score in [60, 79]", () => {
    expect(getSimilarityColor(60)).toBe("text-yellow-500")
    expect(getSimilarityColor(79)).toBe("text-yellow-500")
    expect(getSimilarityColor(70)).toBe("text-yellow-500")
  })

  it("returns red for score < 60", () => {
    expect(getSimilarityColor(59)).toBe("text-red-500")
    expect(getSimilarityColor(0)).toBe("text-red-500")
    expect(getSimilarityColor(30)).toBe("text-red-500")
  })

  it("boundary: exactly 80 is green (not yellow)", () => {
    expect(getSimilarityColor(80)).toBe("text-green-500")
  })

  it("boundary: exactly 60 is yellow (not red)", () => {
    expect(getSimilarityColor(60)).toBe("text-yellow-500")
  })
})

// ---------------------------------------------------------------------------
// getSimilarityBg()
// ---------------------------------------------------------------------------

describe("getSimilarityBg", () => {
  it("returns green bg for score >= 80", () => {
    expect(getSimilarityBg(80)).toBe("bg-green-500")
    expect(getSimilarityBg(100)).toBe("bg-green-500")
  })

  it("returns yellow bg for score in [60, 79]", () => {
    expect(getSimilarityBg(60)).toBe("bg-yellow-500")
    expect(getSimilarityBg(79)).toBe("bg-yellow-500")
  })

  it("returns red bg for score < 60", () => {
    expect(getSimilarityBg(0)).toBe("bg-red-500")
    expect(getSimilarityBg(59)).toBe("bg-red-500")
  })
})

// ---------------------------------------------------------------------------
// getDeviationBg()
// ---------------------------------------------------------------------------

describe("getDeviationBg", () => {
  it("returns green bg for deviation < 10°", () => {
    expect(getDeviationBg(0)).toBe("bg-green-50 dark:bg-green-950/20")
    expect(getDeviationBg(9)).toBe("bg-green-50 dark:bg-green-950/20")
    expect(getDeviationBg(9.9)).toBe("bg-green-50 dark:bg-green-950/20")
  })

  it("returns yellow bg for deviation in [10, 19]", () => {
    expect(getDeviationBg(10)).toBe("bg-yellow-50 dark:bg-yellow-950/20")
    expect(getDeviationBg(19)).toBe("bg-yellow-50 dark:bg-yellow-950/20")
    expect(getDeviationBg(15)).toBe("bg-yellow-50 dark:bg-yellow-950/20")
  })

  it("returns red bg for deviation >= 20°", () => {
    expect(getDeviationBg(20)).toBe("bg-red-50 dark:bg-red-950/20")
    expect(getDeviationBg(45)).toBe("bg-red-50 dark:bg-red-950/20")
  })

  it("boundary: exactly 10 is yellow (not green)", () => {
    expect(getDeviationBg(10)).toBe("bg-yellow-50 dark:bg-yellow-950/20")
  })

  it("boundary: exactly 20 is red (not yellow)", () => {
    expect(getDeviationBg(20)).toBe("bg-red-50 dark:bg-red-950/20")
  })
})
