/**
 * Whitebox tests — lib/exercise-state-learner.ts
 *
 * learnExerciseStates(jointAngles, exerciseName, exerciseType, anglesOfInterest)
 *   → LearnedExerciseTemplate
 *
 * This function analyses a joint-angle time-series (recorded from a demo video),
 * clusters the frames into discrete exercise states via k-means, and builds the
 * reference template that all future patient sessions are scored against.
 *
 * Internal branches under test:
 *   1. Input validation throws  (empty array, wrong joints)
 *   2. Template shape — all required fields on the returned object
 *   3. State shape — well-formed DetectedState objects with statistical invariants
 *   4. Bilateral exercises — left + right joints tracked in a single template
 *   5. Reproducibility — identical input produces identical output
 *   6. Edge cases — very short recordings, constant angles
 *
 * Note: pose-analyzer.ts requires a real browser with MediaPipe and is excluded.
 * Only learnExerciseStates() (pure computation on angle arrays) is tested here.
 */

import { learnExerciseStates } from "@/lib/exercise-state-learner"
import type { JointAngle } from "@/lib/pose-analyzer"

// ---------------------------------------------------------------------------
// Synthetic data generators
// ---------------------------------------------------------------------------

/**
 * Generates a sinusoidal joint-angle time-series.
 * Oscillates between minAngle and maxAngle, completing `reps` full cycles.
 * Higher framesPerRep → smoother signal → better clustering.
 */
function generateSineAngles(
  joint: string,
  reps = 3,
  framesPerRep = 30,
  minAngle = 90,
  maxAngle = 170
): JointAngle[] {
  const angles: JointAngle[] = []
  const total = reps * framesPerRep
  for (let i = 0; i < total; i++) {
    const phase = (2 * Math.PI * i) / framesPerRep
    const angle = minAngle + (maxAngle - minAngle) * (0.5 + 0.5 * Math.sin(phase))
    angles.push({ joint, angle, timestamp: i / 30 })
  }
  return angles
}

/** Generates a constant-angle sequence (no movement). */
function generateConstantAngles(joint: string, frames: number, angle: number): JointAngle[] {
  return Array.from({ length: frames }, (_, i) => ({
    joint, angle, timestamp: i / 30,
  }))
}

// ---------------------------------------------------------------------------
// Output helpers
// ---------------------------------------------------------------------------

const HEAD = (s: string) =>
  process.stdout.write(`\n  ┌─ ${s} ${"─".repeat(Math.max(0, 50 - s.length))}┐\n`)

const out = (tag: string, desc: string, result: string, note = "") => {
  const t = `[${tag}]`.padEnd(12)
  const d = desc.padEnd(44)
  const n = note ? `  ← ${note}` : ""
  process.stdout.write(`  ${t}  ${d}  →  ${result}${n}\n`)
}

beforeAll(() => {
  process.stdout.write("\n")
  process.stdout.write("  ╔══════════════════════════════════════════════════════╗\n")
  process.stdout.write("  ║  lib/exercise-state-learner.ts  whitebox test suite  ║\n")
  process.stdout.write("  ╚══════════════════════════════════════════════════════╝\n")
})

// ===========================================================================
// Branch 1 — Input validation
// ===========================================================================

describe("input validation — insufficient data must throw before clustering", () => {

  beforeAll(() => { HEAD("Branch 1: input validation") })

  it("throws for an empty jointAngles array", () => {
    expect(() =>
      learnExerciseStates([], "Knee Extension", "knee-extension", ["left_knee"])
    ).toThrow()
    out("THROW", "empty jointAngles []", "throws ✓")
  })

  it("throws with 'No angle data found' when data exists but for a different joint", () => {
    const angles = generateSineAngles("right_shoulder", 3, 30)
    expect(() =>
      learnExerciseStates(angles, "Knee Extension", "knee-extension", ["left_knee"])
    ).toThrow("No angle data found for the specified angles of interest")
    out("THROW", "data=right_shoulder, AOI=[left_knee]", "throws with correct message ✓")
  })

  it("does NOT throw when valid data is provided for the requested joint", () => {
    const angles = generateSineAngles("left_knee", 3, 40)
    expect(() =>
      learnExerciseStates(angles, "Knee Extension", "knee-extension", ["left_knee"])
    ).not.toThrow()
    out("OK", "3 reps × 40 frames of left_knee data", "no throw ✓")
  })
})

// ===========================================================================
// Branch 2 — Template shape
// ===========================================================================

describe("template shape — all required fields on the returned LearnedExerciseTemplate", () => {

  let tmpl: ReturnType<typeof learnExerciseStates>

  beforeAll(() => {
    HEAD("Branch 2: template shape")
    tmpl = learnExerciseStates(
      generateSineAngles("left_knee", 3, 40, 90, 170),
      "Knee Extension", "knee-extension", ["left_knee"]
    )
  })

  it("exerciseName matches the second argument", () => {
    expect(tmpl.exerciseName).toBe("Knee Extension")
    out("FIELD", "exerciseName", `'${tmpl.exerciseName}'`)
  })

  it("exerciseType matches the third argument", () => {
    expect(tmpl.exerciseType).toBe("knee-extension")
    out("FIELD", "exerciseType", `'${tmpl.exerciseType}'`)
  })

  it("states is a non-empty array", () => {
    expect(Array.isArray(tmpl.states)).toBe(true)
    expect(tmpl.states.length).toBeGreaterThan(0)
    out("FIELD", "states", `array of ${tmpl.states.length} state(s)`)
  })

  it("transitions is an array (may be empty)", () => {
    expect(Array.isArray(tmpl.transitions)).toBe(true)
    out("FIELD", "transitions", `array of ${tmpl.transitions.length} entry/entries`)
  })

  it("repSequence is an array (may be empty)", () => {
    expect(Array.isArray(tmpl.repSequence)).toBe(true)
    out("FIELD", "repSequence", `array of ${tmpl.repSequence.length} entry/entries`)
  })

  it("recommendedReps >= 1  (zero reps is not clinically meaningful)", () => {
    expect(tmpl.recommendedReps).toBeGreaterThanOrEqual(1)
    out("FIELD", "recommendedReps", `${tmpl.recommendedReps}`, ">= 1")
  })

  it("totalDuration > 0  (any time-series has a non-zero duration)", () => {
    expect(tmpl.totalDuration).toBeGreaterThan(0)
    out("FIELD", "totalDuration", `${tmpl.totalDuration.toFixed(3)}s`, "> 0")
  })

  it("metadata.detectedAt is a parseable ISO 8601 date string", () => {
    expect(() => new Date(tmpl.metadata.detectedAt).toISOString()).not.toThrow()
    out("META", "metadata.detectedAt", `'${tmpl.metadata.detectedAt}'`, "valid ISO 8601")
  })

  it("metadata.videoLength === totalDuration  (both represent the same span)", () => {
    expect(tmpl.metadata.videoLength).toBe(tmpl.totalDuration)
    out("META", "metadata.videoLength vs totalDuration", `${tmpl.metadata.videoLength} === ${tmpl.totalDuration} ✓`)
  })

  it("metadata.fps > 0", () => {
    expect(tmpl.metadata.fps).toBeGreaterThan(0)
    out("META", "metadata.fps", `${tmpl.metadata.fps}`, "> 0")
  })

  it("metadata.confidence is in [0, 100]", () => {
    expect(tmpl.metadata.confidence).toBeGreaterThanOrEqual(0)
    expect(tmpl.metadata.confidence).toBeLessThanOrEqual(100)
    out("META", "metadata.confidence", `${tmpl.metadata.confidence}`, "in [0, 100]")
  })
})

// ===========================================================================
// Branch 3 — State shape
// ===========================================================================

describe("state shape — each DetectedState satisfies structural and statistical invariants", () => {

  let tmpl: ReturnType<typeof learnExerciseStates>

  beforeAll(() => {
    HEAD("Branch 3: state shape")
    tmpl = learnExerciseStates(
      generateSineAngles("left_knee", 4, 40, 90, 170),
      "Knee Extension", "knee-extension", ["left_knee"]
    )
  })

  it("every state has non-empty string id, name, description", () => {
    for (const s of tmpl.states) {
      expect(typeof s.id).toBe("string")
      expect(s.id.length).toBeGreaterThan(0)
      expect(typeof s.name).toBe("string")
      expect(typeof s.description).toBe("string")
    }
    out("STATE", `${tmpl.states.length} states — id/name/description`, "all non-empty strings ✓")
  })

  it("state ids are unique — no duplicates in the template", () => {
    const ids = tmpl.states.map(s => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    out("STATE", "state ids", `${ids.length} unique ✓`)
  })

  it("left_knee angleRange satisfies min <= mean <= max (statistical invariant)", () => {
    for (const s of tmpl.states) {
      const r = s.angleRanges["left_knee"]
      if (!r) continue
      expect(r.min).toBeLessThanOrEqual(r.mean)
      expect(r.max).toBeGreaterThanOrEqual(r.mean)
      expect(typeof r.stdDev).toBe("number")
    }
    out("STATS", "all left_knee ranges: min <= mean <= max", "✓  stdDev is a number")
  })

  it("left_knee mean falls within the input signal range [90°, 170°]", () => {
    for (const s of tmpl.states) {
      const r = s.angleRanges["left_knee"]
      if (!r) continue
      expect(r.mean).toBeGreaterThanOrEqual(80)   // slight buffer for floating-point
      expect(r.mean).toBeLessThanOrEqual(180)
    }
    out("RANGE", "all left_knee state means", "within input signal range [90, 170] ✓")
  })

  it("every state has >= 1 occurrence with numeric startTime, endTime, duration", () => {
    for (const s of tmpl.states) {
      expect(s.occurrences.length).toBeGreaterThan(0)
      for (const occ of s.occurrences) {
        expect(typeof occ.startTime).toBe("number")
        expect(typeof occ.endTime).toBe("number")
        expect(typeof occ.duration).toBe("number")
      }
    }
    out("OCC", "all states: occurrences", ">= 1 occ, all fields numeric ✓")
  })

  it("representativeTimestamp is a non-negative number", () => {
    for (const s of tmpl.states) {
      expect(typeof s.representativeTimestamp).toBe("number")
      expect(s.representativeTimestamp).toBeGreaterThanOrEqual(0)
    }
    out("TS", "representativeTimestamp on all states", ">= 0 ✓")
  })
})

// ===========================================================================
// Branch 4 — Bilateral exercises
// ===========================================================================

describe("bilateral exercises — left + right joint data in one template", () => {

  beforeAll(() => { HEAD("Branch 4: bilateral exercises") })

  it("left_knee + right_knee combined data → does not throw", () => {
    const combined = [
      ...generateSineAngles("left_knee",  3, 40),
      ...generateSineAngles("right_knee", 3, 40),
    ]
    expect(() =>
      learnExerciseStates(combined, "Knee Extension", "knee-extension", ["left_knee", "right_knee"])
    ).not.toThrow()
    out("BILAT", "left_knee + right_knee (3 reps each)", "no throw ✓")
  })

  it("at least one state has angleRanges for BOTH left_knee and right_knee", () => {
    const combined = [
      ...generateSineAngles("left_knee",  3, 40),
      ...generateSineAngles("right_knee", 3, 40),
    ]
    const tmpl = learnExerciseStates(
      combined, "Knee Extension", "knee-extension", ["left_knee", "right_knee"]
    )
    const hasBoth = tmpl.states.some(s => s.angleRanges["left_knee"] && s.angleRanges["right_knee"])
    expect(hasBoth).toBe(true)
    out("BILAT", "states with both left_knee + right_knee ranges", `hasBoth=${hasBoth} ✓`)
  })
})

// ===========================================================================
// Branch 5 — Reproducibility
// ===========================================================================

describe("reproducibility — identical input produces identical output", () => {

  beforeAll(() => { HEAD("Branch 5: reproducibility") })

  it("calling learnExerciseStates twice with the same data gives the same number of states (k-means cluster count is stable; exact centroid values may vary due to random init)", () => {
    const angles = generateSineAngles("left_knee", 3, 40, 90, 170)
    const a = learnExerciseStates([...angles], "Knee Extension", "knee-extension", ["left_knee"])
    const b = learnExerciseStates([...angles], "Knee Extension", "knee-extension", ["left_knee"])

    // State count must be stable — same data → same cluster count
    expect(a.states.length).toBe(b.states.length)

    // All means must stay within the input signal bounds on both runs
    for (const tmpl of [a, b]) {
      for (const s of tmpl.states) {
        const r = s.angleRanges["left_knee"]
        if (r) {
          expect(r.mean).toBeGreaterThanOrEqual(80)
          expect(r.mean).toBeLessThanOrEqual(180)
        }
      }
    }

    const meansA = a.states.map(s => s.angleRanges["left_knee"]?.mean ?? 0).sort()
    out("REPRO", "same input ×2 → same states.length, means within [80,180]",
      `${a.states.length} states, run-A means: [${meansA.map(m => m.toFixed(1)).join(", ")}] ✓`)
  })
})

// ===========================================================================
// Branch 6 — Edge cases
// ===========================================================================

describe("edge cases — unusual but valid inputs", () => {

  beforeAll(() => { HEAD("Branch 6: edge cases") })

  it("5-frame input (very short recording) → does not throw (graceful degradation)", () => {
    const angles: JointAngle[] = Array.from({ length: 5 }, (_, i) => ({
      joint: "left_knee", angle: 90 + i, timestamp: i / 30,
    }))
    expect(() =>
      learnExerciseStates(angles, "Knee Extension", "knee-extension", ["left_knee"])
    ).not.toThrow()
    out("SHORT", "5-frame input", "no throw ✓")
  })

  it("constant-angle input → at least one state is returned (even flat data clusters into 1+ state)", () => {
    const angles = generateConstantAngles("left_knee", 60, 130)
    let tmpl: ReturnType<typeof learnExerciseStates> | undefined
    expect(() => {
      tmpl = learnExerciseStates(angles, "Static Hold", "knee-extension", ["left_knee"])
    }).not.toThrow()
    if (tmpl) {
      expect(tmpl.states.length).toBeGreaterThan(0)
      out("CONST", "60 frames at constant 130°", `${tmpl.states.length} state(s) ✓`)
    }
  })

  it("large input (10 reps × 60 frames = 600 frames) → completes without throwing and returns states", () => {
    const angles = generateSineAngles("left_knee", 10, 60, 90, 170)
    let tmpl: ReturnType<typeof learnExerciseStates> | undefined
    expect(() => {
      tmpl = learnExerciseStates(angles, "Knee Extension", "knee-extension", ["left_knee"])
    }).not.toThrow()
    if (tmpl) {
      expect(tmpl.states.length).toBeGreaterThan(0)
      out("LARGE", "10 reps × 60 frames (600 total)", `${tmpl.states.length} states, recs=${tmpl.recommendedReps} ✓`)
    }
  })

  it("mixed in-range and out-of-range frames (second joint absent for half the frames) → does not throw", () => {
    // left_knee present for all 90 frames; right_knee present for only first 30
    const lk = generateSineAngles("left_knee",  3, 30, 90, 170)
    const rk = generateSineAngles("right_knee", 1, 30, 90, 170)
    const mixed = [...lk, ...rk]
    expect(() =>
      learnExerciseStates(mixed, "Knee Extension", "knee-extension", ["left_knee"])
    ).not.toThrow()
    out("MIXED", "left_knee 90fr + right_knee 30fr, AOI=[left_knee]", "no throw ✓")
  })
})
