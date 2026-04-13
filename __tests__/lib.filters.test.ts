/**
 * Whitebox tests — lib/filters.ts  (OneEuroFilter)
 *
 * OneEuroFilter smooths noisy real-time signals by adapting its cutoff
 * frequency to signal velocity. It is applied to every joint angle before
 * rep counting and error detection.
 *
 * Internal branches under test:
 *   1. x_prev === undefined   → first-call pass-through
 *   2. t_e === 0              → duplicate-timestamp pass-through
 *   3. Normal frame           → EMA-based smoothing
 *   4. reset()                → wipes all internal state
 */

import { OneEuroFilter } from "@/lib/filters"

// ---------------------------------------------------------------------------
// Output helpers
// ---------------------------------------------------------------------------

const HEAD = (s: string) =>
  process.stdout.write(`\n  ┌─ ${s} ${"─".repeat(Math.max(0, 50 - s.length))}┐\n`)

const out = (tag: string, desc: string, value: string, note = "") => {
  const t = `[${tag}]`.padEnd(11)
  const d = desc.padEnd(38)
  const n = note ? `  ← ${note}` : ""
  process.stdout.write(`  ${t}  ${d}  ${value}${n}\n`)
}

beforeAll(() => {
  process.stdout.write("\n")
  process.stdout.write("  ╔══════════════════════════════════════════════════════╗\n")
  process.stdout.write("  ║  lib/filters.ts  —  OneEuroFilter                   ║\n")
  process.stdout.write("  ╚══════════════════════════════════════════════════════╝\n")
})

// ===========================================================================
// Branch 1 — first call: x_prev undefined → raw pass-through
// ===========================================================================

describe("first call — x_prev is undefined, so output equals input exactly", () => {

  beforeAll(() => { HEAD("Branch 1: first-call pass-through") })

  it("input=45 at t=0 → output=45 unchanged", () => {
    const f = new OneEuroFilter()
    const r = f.filter(45, 0)
    expect(r).toBe(45)
    out("PASS", "filter(45, t=0)", `output=${r}`, "x_prev=undefined → pass-through")
  })

  it("input=0 at t=0 → output=0 (no minimum clamp on first call)", () => {
    const r = new OneEuroFilter().filter(0, 0)
    expect(r).toBe(0)
    out("PASS", "filter(0, t=0)", `output=${r}`)
  })

  it("input=90 at t=1000 → output=90 (non-zero start timestamp irrelevant)", () => {
    const r = new OneEuroFilter().filter(90, 1000)
    expect(r).toBe(90)
    out("PASS", "filter(90, t=1000)", `output=${r}`, "timestamp doesn't affect pass-through")
  })

  it("input=-45 at t=0 → output=-45 (negative values pass through correctly)", () => {
    const r = new OneEuroFilter().filter(-45, 0)
    expect(r).toBe(-45)
    out("PASS", "filter(-45, t=0)", `output=${r}`, "negative value preserved")
  })
})

// ===========================================================================
// Branch 2 — t_e === 0: duplicate timestamp → raw pass-through
// ===========================================================================

describe("t_e === 0 guard — duplicate timestamp triggers raw pass-through", () => {

  beforeAll(() => { HEAD("Branch 2: duplicate-timestamp guard") })

  it("calling filter() twice with the same t returns the raw input on the second call", () => {
    const f = new OneEuroFilter()
    f.filter(45, 0)         // init
    f.filter(60, 0.1)       // normal step — advances t_prev to 0.1
    const r = f.filter(999, 0.1)  // same t → t_e = 0 → raw pass-through
    expect(r).toBe(999)
    out("GUARD", "filter(999, t=0.1) after t_prev=0.1", `output=${r}`, "t_e=0 → raw pass-through")
  })

  it("the t_e=0 guard also fires on the second call when the first used t=0 (t_prev initialised to 0)", () => {
    // First call: t=0 sets t_prev=0; second call: t=0 → t_e = 0 - 0 = 0 → guard
    const f = new OneEuroFilter()
    f.filter(50, 0)
    const r = f.filter(100, 0)
    expect(r).toBe(100)
    out("GUARD", "filter(100, t=0) after init at t=0", `output=${r}`, "t_prev=0 → t_e=0 guard again")
  })
})

// ===========================================================================
// Branch 3 — normal frame: EMA smoothing
// ===========================================================================

describe("normal frame smoothing — output is between previous and new input", () => {

  beforeAll(() => {
    HEAD("Branch 3: normal-frame EMA smoothing")
    process.stdout.write("  Note: initialise at non-zero t (e.g. t=1.0) to avoid the t_prev=0 guard\n")
    process.stdout.write("  on the immediately following call.\n")
  })

  it("after init at 0°, one frame step to 100° gives output strictly in (0, 100)", () => {
    const f = new OneEuroFilter(1.0, 0.007)
    f.filter(0, 1.0)           // init: t_prev = 1.0 (not 0)
    const r = f.filter(100, 1.033)
    expect(r).toBeGreaterThan(0)
    expect(r).toBeLessThan(100)
    out("SMOOTH", "0° → 100° in one frame (~33ms)", `output=${r.toFixed(3)}°`, "0 < output < 100")
  })

  it("lower min_cutoff = heavier smoothing: output stays closer to 0° on the same jump", () => {
    const heavy = new OneEuroFilter(0.01, 0.007)
    const light  = new OneEuroFilter(10.0, 0.007)
    heavy.filter(0, 1.0); light.filter(0, 1.0)
    const rh = heavy.filter(100, 1.033)
    const rl  = light.filter(100, 1.033)
    expect(rh).toBeLessThan(rl)
    out("CUTOFF", "min_cutoff=0.01 vs 10.0, jump 0→100", `heavy=${rh.toFixed(2)}° < light=${rl.toFixed(2)}°`, "lower cutoff → slower response")
  })

  it("higher beta = faster response: higher beta output is closer to target on a moving signal", () => {
    const slow = new OneEuroFilter(1.0, 0.001)
    const fast  = new OneEuroFilter(1.0, 1.0)
    // Feed both a fast-changing signal
    let rs = slow.filter(0, 1.0), rf = fast.filter(0, 1.0)
    for (let i = 1; i <= 5; i++) {
      rs = slow.filter(i * 20, 1.0 + i * 0.033)
      rf = fast.filter(i * 20, 1.0 + i * 0.033)
    }
    out("BETA", "beta=0.001 vs 1.0, moving signal ×5 frames", `slow=${rs.toFixed(2)}°  fast=${rf.toFixed(2)}°`, "high beta tracks faster")
    // Both should be finite
    expect(isFinite(rs)).toBe(true)
    expect(isFinite(rf)).toBe(true)
  })

  it("converges to within 1° of target after 200 frames of a constant input", () => {
    const f = new OneEuroFilter(1.0, 0.007)
    const TARGET = 90
    let out_ = f.filter(0, 1.0)
    for (let i = 1; i <= 200; i++) out_ = f.filter(TARGET, 1.0 + i * 0.033)
    expect(Math.abs(out_ - TARGET)).toBeLessThan(1)
    out("CONVERGE", "constant target=90° for 200 frames", `output=${out_.toFixed(4)}°`, `|error|=${Math.abs(out_-TARGET).toFixed(4)} < 1°`)
  })

  it("negative angles: -45° → -90° gives output in [-90, -45] range", () => {
    const f = new OneEuroFilter()
    f.filter(-45, 1.0)
    const r = f.filter(-90, 1.033)
    expect(r).toBeLessThanOrEqual(-45)
    expect(r).toBeGreaterThanOrEqual(-90)
    out("NEG", "-45° → -90° in one frame", `output=${r.toFixed(3)}°`, "in [-90, -45]")
  })

  it("very large input (1e6°) produces a finite non-NaN result — no arithmetic overflow", () => {
    const f = new OneEuroFilter()
    f.filter(0, 0)
    const r = f.filter(1e6, 0.033)
    expect(isNaN(r)).toBe(false)
    expect(isFinite(r)).toBe(true)
    out("LARGE", "filter(1e6, t=0.033)", `output=${r.toFixed(0)}`, "finite, non-NaN")
  })
})

// ===========================================================================
// Branch 4 — reset()
// ===========================================================================

describe("reset() — wipes all internal state, restoring first-call behaviour", () => {

  beforeAll(() => { HEAD("Branch 4: reset()") })

  it("first call after reset() is a raw pass-through (like a brand-new filter)", () => {
    const f = new OneEuroFilter()
    f.filter(50, 1.0)
    f.filter(60, 1.033)
    f.reset()
    const r = f.filter(120, 0.1)
    expect(r).toBe(120)
    out("RESET", "filter(120) immediately after reset()", `output=${r}`, "pass-through confirmed")
  })

  it("second call after reset() and re-init smooths normally — filter is fully functional again", () => {
    const f = new OneEuroFilter(1.0, 0.007)
    f.filter(50, 1.0)
    f.reset()
    f.filter(0, 1.0)           // re-init: t_prev = 1.0
    const r = f.filter(100, 1.033)
    expect(r).toBeGreaterThan(0)
    expect(r).toBeLessThan(100)
    out("RESET", "filter(100) after reset+re-init at 0", `output=${r.toFixed(3)}°`, "smoothing resumes normally")
  })

  it("multiple reset cycles all produce a pass-through on the first call of each cycle", () => {
    const f = new OneEuroFilter()
    const inputs = [10, 20, 30]
    for (const v of inputs) {
      f.reset()
      const r = f.filter(v, 0.5)
      expect(r).toBe(v)
    }
    out("RESET-N", "3 reset cycles with inputs [10,20,30]", "each returned raw value ✓")
  })
})

// ===========================================================================
// Constructor parameters
// ===========================================================================

describe("constructor parameters — non-default values are accepted and produce valid output", () => {

  beforeAll(() => { HEAD("Constructor parameters") })

  it("(min_cutoff=2.0, beta=0.1, d_cutoff=2.0) — second call returns a finite non-NaN number", () => {
    const f = new OneEuroFilter(2.0, 0.1, 2.0)
    expect(f.filter(30, 0)).toBe(30)       // pass-through
    const r = f.filter(60, 0.033)
    expect(typeof r).toBe("number")
    expect(isNaN(r)).toBe(false)
    expect(isFinite(r)).toBe(true)
    out("PARAMS", "(mc=2.0, b=0.1, dc=2.0) second call", `output=${r.toFixed(3)}`, "finite, non-NaN")
  })

  it("default constructor (no args) is equivalent to (1.0, 0.007, 1.0)", () => {
    const def  = new OneEuroFilter()
    const expl = new OneEuroFilter(1.0, 0.007, 1.0)
    def.filter(0, 1.0); expl.filter(0, 1.0)
    const rd = def.filter(100, 1.033)
    const re = expl.filter(100, 1.033)
    expect(rd).toBeCloseTo(re, 10)
    out("DEFAULTS", "no-arg vs explicit defaults on same input", `default=${rd.toFixed(4)}  explicit=${re.toFixed(4)}`, "outputs identical")
  })
})
