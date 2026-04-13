/**
 * Tests for lib/utils.ts
 *
 * This module exports small utility functions used throughout the UI layer.
 * Despite being "just utilities", they are critical to correct display:
 *   - cn()               — wrong class merging → broken layouts
 *   - formatAngleName()  — garbled joint names → confusing feedback
 *   - getSimilarityColor/Bg() — wrong colour → misleading score indication
 *   - getDeviationBg()   — wrong background → misleading angle deviation display
 *
 * Exported functions:
 *   cn(...inputs)                — clsx + tailwind-merge class combiner
 *   formatAngleName(snakeName)   — snake_case joint name → "Title Case" display string
 *   getSimilarityColor(score)    — score [0-100] → Tailwind text-color class
 *   getSimilarityBg(score)       — score [0-100] → Tailwind bg-color class
 *   getDeviationBg(degrees)      — deviation [0-180°] → Tailwind bg-color class
 */

import {
  cn,
  formatAngleName,
  getSimilarityColor,
  getSimilarityBg,
  getDeviationBg,
} from "@/lib/utils"

// ===========================================================================
// cn()
// ===========================================================================

describe("cn — clsx + tailwind-merge class combiner for conditional class construction", () => {

  describe("basic class merging", () => {
    it("concatenates two plain class strings with a space between them", () => {
      const result = cn("foo", "bar")

      expect(result).toBe("foo bar")
      process.stdout.write(`[CN] cn('foo', 'bar') → '${result}' ✓\n`)
    })
  })

  describe("Tailwind conflict resolution (tailwind-merge behaviour)", () => {
    it("resolves conflicting Tailwind classes by keeping only the last one — bg-red-500 is overridden by bg-blue-500 because tailwind-merge drops earlier conflicting utilities", () => {
      // Without tailwind-merge, both classes would be in the output, causing specificity confusion
      const result = cn("bg-red-500", "bg-blue-500")

      expect(result).toBe("bg-blue-500")
      process.stdout.write(`[CN] cn('bg-red-500', 'bg-blue-500') → '${result}' (bg-red correctly dropped) ✓\n`)
    })
  })

  describe("conditional class handling (clsx behaviour)", () => {
    it("excludes falsy values (false, undefined, null) from the output while keeping adjacent truthy class strings", () => {
      const result = cn("base", false && "never", undefined, null as any, "end")

      // Only 'base' and 'end' should remain — the falsy values are skipped
      expect(result).toBe("base end")
      process.stdout.write(`[CN] cn('base', false, undefined, null, 'end') → '${result}' ✓\n`)
    })

    it("returns an empty string when ALL inputs are falsy, because there are no classes to render", () => {
      const result = cn(false as any, undefined, null as any)

      expect(result).toBe("")
      process.stdout.write(`[CN] cn(false, undefined, null) → '${result}' (empty string) ✓\n`)
    })
  })

  describe("clsx extended forms — arrays and objects", () => {
    it("accepts arrays and conditional objects and merges them correctly: ['a','b'] + { c:true, d:false } → 'a b c'", () => {
      const result = cn(["a", "b"], { c: true, d: false })

      // 'd' must be excluded because its value is false
      expect(result).toBe("a b c")
      process.stdout.write(`[CN] cn(['a','b'], {c:true,d:false}) → '${result}' ✓\n`)
    })
  })
})

// ===========================================================================
// formatAngleName()
// ===========================================================================

describe("formatAngleName — convert snake_case joint angle names to Title Case for display", () => {

  it("converts a single-word name to Title Case (first letter uppercased, rest preserved)", () => {
    expect(formatAngleName("knee")).toBe("Knee")
    process.stdout.write("[FORMAT] formatAngleName('knee') → 'Knee' ✓\n")
  })

  it("converts a two-word snake_case name to Title Case, capitalising each word independently", () => {
    expect(formatAngleName("left_knee")).toBe("Left Knee")
    process.stdout.write("[FORMAT] formatAngleName('left_knee') → 'Left Knee' ✓\n")
  })

  it("converts a three-word snake_case name to Title Case, confirming there is no word-count limit", () => {
    expect(formatAngleName("left_thigh_segment")).toBe("Left Thigh Segment")
    process.stdout.write("[FORMAT] formatAngleName('left_thigh_segment') → 'Left Thigh Segment' ✓\n")
  })

  it("the output for 'left_knee' starts with 'Left', confirming the capitalisation applies to the first character of each segment", () => {
    const result = formatAngleName("left_knee")

    expect(result.startsWith("Left")).toBe(true)
    process.stdout.write(`[FORMAT] formatAngleName('left_knee').startsWith('Left') → true ✓\n`)
  })

  it("returns an empty string when the input is an empty string, so callers do not receive undefined or null", () => {
    expect(formatAngleName("")).toBe("")
    process.stdout.write("[FORMAT] formatAngleName('') → '' (empty string) ✓\n")
  })

  it("handles an input with no underscores (single word) and correctly capitalises it", () => {
    expect(formatAngleName("shoulder")).toBe("Shoulder")
    process.stdout.write("[FORMAT] formatAngleName('shoulder') → 'Shoulder' ✓\n")
  })
})

// ===========================================================================
// getSimilarityColor()
// ===========================================================================

describe("getSimilarityColor — map a similarity score (0-100) to a Tailwind text-color class", () => {
  /**
   * Colour tiers:
   *   score >= 80 → text-green-500 (excellent)
   *   score in [60, 79] → text-yellow-500 (adequate)
   *   score < 60 → text-red-500 (poor)
   */

  describe("green tier (score >= 80)", () => {
    it("returns 'text-green-500' for score=80 (the exact lower boundary of the green tier)", () => {
      expect(getSimilarityColor(80)).toBe("text-green-500")
      process.stdout.write("[COLOR] getSimilarityColor(80) → 'text-green-500' ✓\n")
    })

    it("returns 'text-green-500' for score=100 (the maximum possible score)", () => {
      expect(getSimilarityColor(100)).toBe("text-green-500")
      process.stdout.write("[COLOR] getSimilarityColor(100) → 'text-green-500' ✓\n")
    })

    it("returns 'text-green-500' for score=95 (a mid-range excellent score)", () => {
      expect(getSimilarityColor(95)).toBe("text-green-500")
      process.stdout.write("[COLOR] getSimilarityColor(95) → 'text-green-500' ✓\n")
    })
  })

  describe("yellow tier (score in [60, 79])", () => {
    it("returns 'text-yellow-500' for score=60 (the exact lower boundary of the yellow tier)", () => {
      expect(getSimilarityColor(60)).toBe("text-yellow-500")
      process.stdout.write("[COLOR] getSimilarityColor(60) → 'text-yellow-500' ✓\n")
    })

    it("returns 'text-yellow-500' for score=79 (the exact upper boundary of the yellow tier, just below green)", () => {
      expect(getSimilarityColor(79)).toBe("text-yellow-500")
      process.stdout.write("[COLOR] getSimilarityColor(79) → 'text-yellow-500' ✓\n")
    })

    it("returns 'text-yellow-500' for score=70 (the midpoint of the yellow tier)", () => {
      expect(getSimilarityColor(70)).toBe("text-yellow-500")
      process.stdout.write("[COLOR] getSimilarityColor(70) → 'text-yellow-500' ✓\n")
    })
  })

  describe("red tier (score < 60)", () => {
    it("returns 'text-red-500' for score=59 (the exact upper boundary of the red tier, just below yellow)", () => {
      expect(getSimilarityColor(59)).toBe("text-red-500")
      process.stdout.write("[COLOR] getSimilarityColor(59) → 'text-red-500' ✓\n")
    })

    it("returns 'text-red-500' for score=0 (the minimum possible score)", () => {
      expect(getSimilarityColor(0)).toBe("text-red-500")
      process.stdout.write("[COLOR] getSimilarityColor(0) → 'text-red-500' ✓\n")
    })

    it("returns 'text-red-500' for score=30 (a mid-range poor score)", () => {
      expect(getSimilarityColor(30)).toBe("text-red-500")
      process.stdout.write("[COLOR] getSimilarityColor(30) → 'text-red-500' ✓\n")
    })
  })

  describe("boundary precision tests — confirm exact threshold values", () => {
    it("score=80 maps to green (NOT yellow), confirming the boundary is inclusive at 80", () => {
      expect(getSimilarityColor(80)).toBe("text-green-500")
      process.stdout.write("[COLOR] Boundary: score=80 → 'text-green-500' (NOT 'text-yellow-500') ✓\n")
    })

    it("score=60 maps to yellow (NOT red), confirming the boundary is inclusive at 60", () => {
      expect(getSimilarityColor(60)).toBe("text-yellow-500")
      process.stdout.write("[COLOR] Boundary: score=60 → 'text-yellow-500' (NOT 'text-red-500') ✓\n")
    })
  })
})

// ===========================================================================
// getSimilarityBg()
// ===========================================================================

describe("getSimilarityBg — map a similarity score (0-100) to a Tailwind background-color class", () => {
  /**
   * Mirrors the same tier structure as getSimilarityColor() but returns bg- classes.
   * These are used for score badges and progress bars in the comparison UI.
   */

  it("returns 'bg-green-500' for score=80 (green tier lower boundary)", () => {
    expect(getSimilarityBg(80)).toBe("bg-green-500")
    process.stdout.write("[BG] getSimilarityBg(80) → 'bg-green-500' ✓\n")
  })

  it("returns 'bg-green-500' for score=100 (maximum score)", () => {
    expect(getSimilarityBg(100)).toBe("bg-green-500")
    process.stdout.write("[BG] getSimilarityBg(100) → 'bg-green-500' ✓\n")
  })

  it("returns 'bg-yellow-500' for score=60 (yellow tier lower boundary)", () => {
    expect(getSimilarityBg(60)).toBe("bg-yellow-500")
    process.stdout.write("[BG] getSimilarityBg(60) → 'bg-yellow-500' ✓\n")
  })

  it("returns 'bg-yellow-500' for score=79 (yellow tier upper boundary)", () => {
    expect(getSimilarityBg(79)).toBe("bg-yellow-500")
    process.stdout.write("[BG] getSimilarityBg(79) → 'bg-yellow-500' ✓\n")
  })

  it("returns 'bg-red-500' for score=0 (minimum score)", () => {
    expect(getSimilarityBg(0)).toBe("bg-red-500")
    process.stdout.write("[BG] getSimilarityBg(0) → 'bg-red-500' ✓\n")
  })

  it("returns 'bg-red-500' for score=59 (red tier upper boundary)", () => {
    expect(getSimilarityBg(59)).toBe("bg-red-500")
    process.stdout.write("[BG] getSimilarityBg(59) → 'bg-red-500' ✓\n")
  })
})

// ===========================================================================
// getDeviationBg()
// ===========================================================================

describe("getDeviationBg — map an angle deviation (degrees) to a Tailwind background-color class for the comparison table", () => {
  /**
   * Deviation tiers:
   *   deviation < 10° → green bg (acceptable — within ±10° is good clinical form)
   *   deviation in [10°, 19°] → yellow bg (moderate — worth noting)
   *   deviation >= 20° → red bg (significant — intervention warranted)
   *
   * These classes include dark mode variants (e.g. dark:bg-green-950/20)
   * to ensure the comparison table is readable in both light and dark themes.
   */

  describe("green tier (deviation < 10°)", () => {
    it("returns the green background class for deviation=0°, the ideal case of zero deviation from the reference", () => {
      expect(getDeviationBg(0)).toBe("bg-green-50 dark:bg-green-950/20")
      process.stdout.write("[DEV] getDeviationBg(0) → green bg ✓\n")
    })

    it("returns the green background class for deviation=9°, just below the yellow threshold", () => {
      expect(getDeviationBg(9)).toBe("bg-green-50 dark:bg-green-950/20")
      process.stdout.write("[DEV] getDeviationBg(9) → green bg ✓\n")
    })

    it("returns the green background class for deviation=9.9°, confirming the threshold is strictly < 10", () => {
      expect(getDeviationBg(9.9)).toBe("bg-green-50 dark:bg-green-950/20")
      process.stdout.write("[DEV] getDeviationBg(9.9) → green bg ✓\n")
    })
  })

  describe("yellow tier (deviation in [10°, 19°])", () => {
    it("returns the yellow background class for deviation=10°, the exact lower boundary of the yellow tier", () => {
      expect(getDeviationBg(10)).toBe("bg-yellow-50 dark:bg-yellow-950/20")
      process.stdout.write("[DEV] getDeviationBg(10) → yellow bg ✓\n")
    })

    it("returns the yellow background class for deviation=19°, the exact upper boundary of the yellow tier", () => {
      expect(getDeviationBg(19)).toBe("bg-yellow-50 dark:bg-yellow-950/20")
      process.stdout.write("[DEV] getDeviationBg(19) → yellow bg ✓\n")
    })

    it("returns the yellow background class for deviation=15°, the midpoint of the yellow tier", () => {
      expect(getDeviationBg(15)).toBe("bg-yellow-50 dark:bg-yellow-950/20")
      process.stdout.write("[DEV] getDeviationBg(15) → yellow bg ✓\n")
    })
  })

  describe("red tier (deviation >= 20°)", () => {
    it("returns the red background class for deviation=20°, the exact lower boundary of the red tier", () => {
      expect(getDeviationBg(20)).toBe("bg-red-50 dark:bg-red-950/20")
      process.stdout.write("[DEV] getDeviationBg(20) → red bg ✓\n")
    })

    it("returns the red background class for deviation=45°, a significant mid-range deviation", () => {
      expect(getDeviationBg(45)).toBe("bg-red-50 dark:bg-red-950/20")
      process.stdout.write("[DEV] getDeviationBg(45) → red bg ✓\n")
    })
  })

  describe("boundary precision tests — confirm exact threshold values", () => {
    it("deviation=10° maps to yellow (NOT green), confirming the yellow tier starts at exactly 10", () => {
      expect(getDeviationBg(10)).toBe("bg-yellow-50 dark:bg-yellow-950/20")
      process.stdout.write("[DEV] Boundary: deviation=10° → yellow bg (NOT green) ✓\n")
    })

    it("deviation=20° maps to red (NOT yellow), confirming the red tier starts at exactly 20", () => {
      expect(getDeviationBg(20)).toBe("bg-red-50 dark:bg-red-950/20")
      process.stdout.write("[DEV] Boundary: deviation=20° → red bg (NOT yellow) ✓\n")
    })
  })
})
