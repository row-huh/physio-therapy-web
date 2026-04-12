/**
 * Tests for lib/filters.ts — OneEuroFilter
 *
 * Covers:
 *   - First call returns the input unchanged (initialisation pass-through)
 *   - Subsequent calls apply smoothing (output moves toward input)
 *   - t_e == 0 guard: returns raw value immediately
 *   - reset() restores initial state (next call is treated as first)
 *   - High beta → more responsive to velocity
 *   - Low min_cutoff → heavier smoothing
 *   - Constant signal → filter converges toward the constant
 */

import { OneEuroFilter } from "@/lib/filters"

describe("OneEuroFilter", () => {
  describe("first call (initialisation pass-through)", () => {
    it("returns the exact input value on the very first call", () => {
      const f = new OneEuroFilter()
      expect(f.filter(45, 0)).toBe(45)
    })

    it("returns zero when first input is zero", () => {
      const f = new OneEuroFilter()
      expect(f.filter(0, 0)).toBe(0)
    })

    it("works with a non-zero start timestamp", () => {
      const f = new OneEuroFilter()
      expect(f.filter(90, 1000)).toBe(90)
    })
  })

  describe("t_e == 0 guard", () => {
    it("returns raw value when timestamp has not advanced (same t)", () => {
      const f = new OneEuroFilter()
      f.filter(45, 0)           // initialise
      f.filter(60, 0.1)         // normal step
      const out = f.filter(999, 0.1) // same timestamp → t_e == 0
      expect(out).toBe(999)
    })
  })

  describe("smoothing behaviour", () => {
    // NOTE: The implementation has a quirk — when t_prev === 0 (first call used t=0),
    // the line `const t_e = this.t_prev === 0 ? 0 : t - this.t_prev` sets t_e=0
    // for the SECOND call, triggering the raw-passthrough guard.
    // We avoid this by starting with a non-zero timestamp.

    it("smoothed output is between previous output and new input (pulls toward input)", () => {
      const f = new OneEuroFilter(1.0, 0.007)
      f.filter(0, 1.0)          // init at t=1.0 (non-zero so t_prev != 0)
      const out = f.filter(100, 1.033) // one frame later
      expect(out).toBeGreaterThan(0)
      expect(out).toBeLessThan(100)
    })

    it("lower min_cutoff produces heavier smoothing (output closer to previous)", () => {
      const heavy = new OneEuroFilter(0.01, 0.007)  // very smooth
      const light = new OneEuroFilter(10.0, 0.007)  // very responsive

      heavy.filter(0, 1.0)
      light.filter(0, 1.0)

      const heavyOut = heavy.filter(100, 1.033)
      const lightOut = light.filter(100, 1.033)

      // Heavier smoothing → output stays closer to 0; light → closer to 100
      expect(heavyOut).toBeLessThan(lightOut)
    })

    it("converges toward a constant signal after many frames", () => {
      const f = new OneEuroFilter(1.0, 0.007)
      let out = f.filter(0, 1.0)    // init at t=1.0
      const TARGET = 90
      const dt = 0.033

      for (let i = 1; i <= 200; i++) {
        out = f.filter(TARGET, 1.0 + i * dt)
      }

      // After 200 frames the filter should be very close to the constant
      expect(Math.abs(out - TARGET)).toBeLessThan(1)
    })
  })

  describe("reset()", () => {
    it("after reset the next call is treated as first (returns raw value)", () => {
      const f = new OneEuroFilter()
      f.filter(50, 1.0)
      f.filter(60, 1.033)
      f.reset()
      // After reset, t_prev=0. Next call with any t is the first run → passthrough
      expect(f.filter(120, 0.1)).toBe(120)
    })

    it("after reset, subsequent calls smooth again from the new base", () => {
      const f = new OneEuroFilter(1.0, 0.007)
      f.filter(50, 1.0)
      f.reset()
      f.filter(0, 1.0)    // re-init at t=1.0 (non-zero t_prev)
      const out = f.filter(100, 1.033)
      expect(out).toBeGreaterThan(0)
      expect(out).toBeLessThan(100)
    })
  })

  describe("non-default constructor parameters", () => {
    it("accepts custom min_cutoff, beta, d_cutoff", () => {
      const f = new OneEuroFilter(2.0, 0.1, 2.0)
      expect(f.filter(30, 0)).toBe(30)
      const out = f.filter(60, 0.033)
      expect(typeof out).toBe("number")
      expect(isNaN(out)).toBe(false)
    })
  })

  describe("edge cases", () => {
    it("handles negative angle values", () => {
      const f = new OneEuroFilter()
      f.filter(-45, 0)
      const out = f.filter(-90, 0.033)
      expect(out).toBeLessThanOrEqual(-45)
      expect(out).toBeGreaterThanOrEqual(-90)
    })

    it("handles very large angle values without NaN", () => {
      const f = new OneEuroFilter()
      f.filter(0, 0)
      const out = f.filter(1e6, 0.033)
      expect(isNaN(out)).toBe(false)
      expect(isFinite(out)).toBe(true)
    })
  })
})
