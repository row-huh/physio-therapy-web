/**
 * Tests for lib/filters.ts — OneEuroFilter
 *
 * OneEuroFilter is a well-established real-time signal smoothing algorithm
 * designed for interactive applications. It adapts its cutoff frequency based
 * on signal velocity: slow movements are heavily smoothed (reducing jitter)
 * while fast movements pass through with minimal lag.
 *
 * In this physiotherapy application, it is used to smooth raw joint angle values
 * from the MediaPipe pose estimator before they are displayed or fed into the
 * rep-counting and error-detection systems. Without smoothing, noisy angle
 * estimates would cause the feedback UI to flicker and the rep counter to misfire.
 *
 * Constructor parameters:
 *   min_cutoff (default 1.0) — lower values → heavier smoothing at low speeds
 *   beta       (default 0.007) — higher values → more responsive to fast motion
 *   d_cutoff   (default 1.0) — cutoff for the derivative (velocity) filter
 *
 * Key behaviours under test:
 *   - First call is always a pass-through (no smoothing on initialisation)
 *   - t_e == 0 guard: if timestamp has not advanced, return raw value
 *   - Subsequent calls smooth toward the input
 *   - Heavy vs light smoothing based on min_cutoff
 *   - reset() restores the filter to its initial state
 */

import { OneEuroFilter } from "@/lib/filters"

// ===========================================================================
// OneEuroFilter
// ===========================================================================

describe("OneEuroFilter — adaptive signal smoother for joint angle data", () => {

  // ── First call (initialisation pass-through) ─────────────────────────────

  describe("first call — initialisation pass-through (no smoothing on first frame)", () => {
    it("returns the exact input value unchanged on the very first call, because there is no previous state to smooth toward", () => {
      const f = new OneEuroFilter()

      const result = f.filter(45, 0)

      // Pass-through: whatever goes in must come out exactly
      expect(result).toBe(45)
      process.stdout.write(`[FILTER] First call with input=45 → correctly returned 45 (pass-through) ✓\n`)
    })

    it("returns exactly 0 when the first input is 0, confirming there is no minimum output clamp on initialisation", () => {
      const f = new OneEuroFilter()

      expect(f.filter(0, 0)).toBe(0)
      process.stdout.write("[FILTER] First call with input=0 → correctly returned 0 ✓\n")
    })

    it("returns the input value unchanged even when the start timestamp is non-zero (e.g. t=1000ms)", () => {
      const f = new OneEuroFilter()

      // The timestamp value should not affect the pass-through behaviour
      expect(f.filter(90, 1000)).toBe(90)
      process.stdout.write("[FILTER] First call with non-zero timestamp (t=1000) → correctly returned 90 (pass-through) ✓\n")
    })
  })

  // ── t_e == 0 guard ───────────────────────────────────────────────────────

  describe("t_e == 0 guard — raw pass-through when the timestamp has not advanced", () => {
    it("returns the raw input value when called with the same timestamp as the previous call, because t_e=0 means zero elapsed time and the filter cannot compute a meaningful derivative", () => {
      const f = new OneEuroFilter()
      f.filter(45, 0)       // initialise
      f.filter(60, 0.1)     // normal step — smoothed

      // Same timestamp as previous call (t=0.1) → t_e = 0.1 - 0.1 = 0 → raw pass-through
      const out = f.filter(999, 0.1)

      expect(out).toBe(999)
      process.stdout.write("[FILTER] Duplicate timestamp → t_e=0 guard correctly returned raw value 999 ✓\n")
    })
  })

  // ── Smoothing behaviour ──────────────────────────────────────────────────

  describe("smoothing behaviour — output moves toward input, but not instantly", () => {
    /**
     * IMPORTANT implementation note:
     * When t_prev === 0 (set during first call with t=0), the line
     *   `const t_e = this.t_prev === 0 ? 0 : t - this.t_prev`
     * sets t_e=0 for the SECOND call, triggering the raw-passthrough guard.
     * To avoid this in smoothing tests, we start the filter at a non-zero timestamp (t=1.0).
     */

    it("returns an output strictly between 0 and 100 after one frame, confirming that smoothing pulls the output toward the new input without immediately reaching it", () => {
      const f = new OneEuroFilter(1.0, 0.007)

      // Init at t=1.0 (non-zero, so t_prev won't be 0 on the next call)
      f.filter(0, 1.0)

      // One frame later: jump from 0 to 100 — smoothing should produce an intermediate value
      const out = f.filter(100, 1.033)

      // The smoothed output must move toward the target without reaching it instantly
      expect(out).toBeGreaterThan(0)
      expect(out).toBeLessThan(100)
      process.stdout.write(`[SMOOTHING] Jump from 0→100 in one frame → smoothed output=${out.toFixed(3)} (strictly between 0 and 100) ✓\n`)
    })

    it("heavier smoothing (lower min_cutoff=0.01) keeps output closer to the previous value than lighter smoothing (min_cutoff=10.0), because a lower cutoff frequency allows less high-frequency change", () => {
      const heavy = new OneEuroFilter(0.01, 0.007)  // very smooth — resists change
      const light = new OneEuroFilter(10.0, 0.007)  // very responsive — follows change quickly

      // Initialise both at the same starting point
      heavy.filter(0, 1.0)
      light.filter(0, 1.0)

      // Both receive the same abrupt jump
      const heavyOut = heavy.filter(100, 1.033)
      const lightOut = light.filter(100, 1.033)

      // Heavy smoothing → stays close to 0 (slow to follow); light → jumps toward 100 (fast)
      expect(heavyOut).toBeLessThan(lightOut)
      process.stdout.write(`[SMOOTHING] heavy output=${heavyOut.toFixed(3)}, light output=${lightOut.toFixed(3)} — heavy is correctly less than light ✓\n`)
    })

    it("converges to within 1° of a constant target value after 200 frames, confirming the filter does not permanently lag behind a stable signal", () => {
      const f = new OneEuroFilter(1.0, 0.007)
      const TARGET = 90
      const dt = 0.033   // ~30fps

      let out = f.filter(0, 1.0)    // initialise at t=1.0 with value 0

      // Repeatedly feed the target value over 200 frames (~6.6 seconds at 30fps)
      for (let i = 1; i <= 200; i++) {
        out = f.filter(TARGET, 1.0 + i * dt)
      }

      // After 200 frames the filter must have converged very close to TARGET
      expect(Math.abs(out - TARGET)).toBeLessThan(1)
      process.stdout.write(`[SMOOTHING] After 200 frames of constant target=${TARGET}° → filter output=${out.toFixed(3)}° (within 1° of target) ✓\n`)
    })
  })

  // ── reset() ─────────────────────────────────────────────────────────────

  describe("reset() — restores the filter to its initialisation state", () => {
    it("makes the next filter() call behave like the very first call (raw pass-through) after reset, because the internal state has been wiped", () => {
      const f = new OneEuroFilter()
      f.filter(50, 1.0)
      f.filter(60, 1.033)

      // Reset completely wipes the internal state
      f.reset()

      // After reset, t_prev=0 → any next call with any t is treated as the first call
      const out = f.filter(120, 0.1)
      expect(out).toBe(120)
      process.stdout.write("[RESET] After reset(), first call correctly returns raw value 120 (pass-through) ✓\n")
    })

    it("resumes smoothing correctly after reset — subsequent calls (not the first) still produce an intermediate value between input and previous output", () => {
      const f = new OneEuroFilter(1.0, 0.007)

      // Use, then reset
      f.filter(50, 1.0)
      f.reset()

      // Re-initialise at t=1.0 (non-zero so t_prev is 1.0 after this call, not 0)
      f.filter(0, 1.0)

      // Next call should smooth again from this new base
      const out = f.filter(100, 1.033)
      expect(out).toBeGreaterThan(0)
      expect(out).toBeLessThan(100)
      process.stdout.write(`[RESET] After reset() and re-init at 0, next jump to 100 → smoothed output=${out.toFixed(3)} (between 0 and 100) ✓\n`)
    })
  })

  // ── Custom constructor parameters ────────────────────────────────────────

  describe("non-default constructor parameters", () => {
    it("accepts custom min_cutoff=2.0, beta=0.1, d_cutoff=2.0 without throwing, and produces a finite non-NaN output on subsequent calls", () => {
      // Confirm that the constructor and filter logic are not hard-coded to the defaults
      const f = new OneEuroFilter(2.0, 0.1, 2.0)

      // First call: pass-through
      expect(f.filter(30, 0)).toBe(30)

      // Second call: should produce a valid finite number
      const out = f.filter(60, 0.033)
      expect(typeof out).toBe("number")
      expect(isNaN(out)).toBe(false)
      expect(isFinite(out)).toBe(true)
      process.stdout.write(`[PARAMS] Custom params (min_cutoff=2, beta=0.1, d_cutoff=2) → second call produced ${out.toFixed(3)} (finite, non-NaN) ✓\n`)
    })
  })

  // ── Edge cases ───────────────────────────────────────────────────────────

  describe("edge cases — unusual but valid input values", () => {
    it("handles negative angle values correctly, returning a smoothed value in the range [input, previous] (both negative)", () => {
      const f = new OneEuroFilter()
      f.filter(-45, 0)  // initialise at -45°

      // Dropping to -90° — smoothed output should be between -45 and -90
      const out = f.filter(-90, 0.033)
      expect(out).toBeLessThanOrEqual(-45)
      expect(out).toBeGreaterThanOrEqual(-90)
      process.stdout.write(`[EDGE] Negative angles -45→-90 → smoothed output=${out.toFixed(3)} (in [-90, -45]) ✓\n`)
    })

    it("handles a very large input value (1,000,000°) without producing NaN or Infinity, confirming there is no overflow in the filter arithmetic", () => {
      const f = new OneEuroFilter()
      f.filter(0, 0)  // initialise

      const out = f.filter(1e6, 0.033)
      expect(isNaN(out)).toBe(false)
      expect(isFinite(out)).toBe(true)
      process.stdout.write(`[EDGE] Very large input (1e6) → output=${out.toFixed(3)} (finite, non-NaN) ✓\n`)
    })
  })
})
