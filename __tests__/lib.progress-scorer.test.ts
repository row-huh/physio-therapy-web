/**
 * Whitebox tests — lib/progress-scorer.ts
 *
 * scoreSession(referenceTemplate, idealTemplate | null, patientTemplate, allowProgression)
 *   → SessionScore { totalReps, validReps, goodReps, progressScore, formScore, perRepDetails }
 *
 * Key internal branches:
 *   1. Unknown exerciseType → zeroed score (no primary angle)
 *   2. Template has no primary angle data → zeroed rep counts
 *   3. Rep quality: goodRep (≥ idealPeak × 0.9), validRep (≥ refPeak × 0.9), neither
 *   4. allowProgression=false → idealPeak collapses to refPeak
 *   5. idealTemplate=null → same collapse
 *   6. progressScore: 0 (invalid), 100 (refPeak=idealPeak), interpolated (between)
 *   7. formScore: 100 when no secondary angles, <100 when secondaries deviate
 */

import { scoreSession } from "@/lib/progress-scorer"
import type { DetectedState, LearnedExerciseTemplate } from "@/lib/exercise-state-learner"

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

function makeState(
  id: string,
  angles: Record<string, { mean: number; min?: number; max?: number; stdDev?: number }>,
  occurrences = [{ startTime: 0, endTime: 1, duration: 1 }]
): DetectedState {
  const angleRanges: DetectedState["angleRanges"] = {}
  for (const [name, v] of Object.entries(angles)) {
    angleRanges[name] = {
      mean:   v.mean,
      min:    v.min    ?? v.mean - 5,
      max:    v.max    ?? v.mean + 5,
      stdDev: v.stdDev ?? 2,
    }
  }
  return { id, name: id, description: "", angleRanges, occurrences, representativeTimestamp: 0.5 }
}

function makeTemplate(exerciseType: string, states: DetectedState[], reps = 3): LearnedExerciseTemplate {
  return {
    exerciseName: exerciseType, exerciseType,
    states, transitions: [], repSequence: [], totalDuration: 10, recommendedReps: reps,
    metadata: { detectedAt: new Date().toISOString(), videoLength: 10, fps: 30, confidence: 80 },
  }
}

// ---------------------------------------------------------------------------
// Output helpers
// ---------------------------------------------------------------------------

const HEAD = (s: string) =>
  process.stdout.write(`\n  ┌─ ${s} ${"─".repeat(Math.max(0, 50 - s.length))}┐\n`)

const out = (tag: string, desc: string, result: string, note = "") => {
  const t = `[${tag}]`.padEnd(12)
  const d = desc.padEnd(45)
  const n = note ? `  ← ${note}` : ""
  process.stdout.write(`  ${t}  ${d}  →  ${result}${n}\n`)
}

beforeAll(() => {
  process.stdout.write("\n")
  process.stdout.write("  ╔══════════════════════════════════════════════════════╗\n")
  process.stdout.write("  ║  lib/progress-scorer.ts  whitebox test suite         ║\n")
  process.stdout.write("  ╚══════════════════════════════════════════════════════╝\n")
  process.stdout.write("  tolerance: 0.9  (rep counted if peak >= templatePeak × 0.9)\n")
})

// ===========================================================================
// Branch 1 — unknown exerciseType
// ===========================================================================

describe("unknown exercise type — no primary angle can be resolved", () => {

  beforeAll(() => { HEAD("Branch 1: unknown exerciseType") })

  it("all rep counts and scores are 0 when exerciseType is not in EXERCISE_CONFIGS", () => {
    const s = makeState("s0", { some_angle: { mean: 90 } })
    const r = scoreSession(
      makeTemplate("ghost-exercise", [s], 5),
      null,
      makeTemplate("ghost-exercise", [s], 5),
      false
    )
    expect(r.validReps).toBe(0)
    expect(r.goodReps).toBe(0)
    expect(r.progressScore).toBe(0)
    expect(r.formScore).toBe(0)
    expect(r.perRepDetails).toEqual([])
    expect(r.totalReps).toBe(5)
    out("ZERO", "exerciseType='ghost-exercise'",
      `valid=${r.validReps}  good=${r.goodReps}  progress=${r.progressScore}  form=${r.formScore}`,
      "no primary angle → all zeroed")
  })
})

// ===========================================================================
// Branch 2 — primary angle absent from template
// ===========================================================================

describe("primary angle absent from template states", () => {

  beforeAll(() => { HEAD("Branch 2: primary angle absent") })

  it("validReps=0 and goodReps=0 when reference template has no left_knee data", () => {
    const ref     = makeTemplate("knee-extension", [makeState("s0", { right_shoulder: { mean: 90 } })], 3)
    const patient = makeTemplate("knee-extension", [makeState("s0", { right_shoulder: { mean: 90 } })], 3)
    const r = scoreSession(ref, null, patient, false)
    expect(r.validReps).toBe(0)
    expect(r.goodReps).toBe(0)
    out("NO-PRIMARY", "template has only right_shoulder (not left_knee)",
      `valid=${r.validReps}  good=${r.goodReps}`, "peak undefined → no threshold")
  })
})

// ===========================================================================
// Branch 3 — rep quality classification
// ===========================================================================

describe("rep quality — good vs valid vs neither", () => {

  beforeAll(() => {
    HEAD("Branch 3: rep quality classification")
    process.stdout.write("  good:  patientPeak >= idealPeak  × 0.9\n")
    process.stdout.write("  valid: patientPeak >= refPeak    × 0.9\n")
  })

  it("patientPeak=155 >= idealPeak*0.9=144 → all reps are good AND valid", () => {
    const r = scoreSession(
      makeTemplate("knee-extension", [makeState("low",  { left_knee: { mean: 120 } })], 3),
      makeTemplate("knee-extension", [makeState("high", { left_knee: { mean: 160 } })], 3),
      makeTemplate("knee-extension", [makeState("peak", { left_knee: { mean: 155 } })], 3),
      true
    )
    expect(r.goodReps).toBe(r.totalReps)
    expect(r.validReps).toBe(r.totalReps)
    out("GOOD+VALID", "refPeak=120  idealPeak=160  patientPeak=155",
      `good=${r.goodReps}/${r.totalReps}  valid=${r.validReps}/${r.totalReps}`,
      "155 >= 144 (ideal×0.9)")
  })

  it("patientPeak=115: valid (>=ref*0.9=108) but NOT good (< ideal*0.9=144)", () => {
    const r = scoreSession(
      makeTemplate("knee-extension", [makeState("low",  { left_knee: { mean: 120 } })], 3),
      makeTemplate("knee-extension", [makeState("high", { left_knee: { mean: 160 } })], 3),
      makeTemplate("knee-extension", [makeState("peak", { left_knee: { mean: 115 } })], 3),
      true
    )
    expect(r.validReps).toBe(r.totalReps)
    expect(r.goodReps).toBe(0)
    out("VALID-ONLY", "refPeak=120  idealPeak=160  patientPeak=115",
      `valid=${r.validReps}  good=${r.goodReps}`,
      "115>=108 (valid) but 115<144 (not good)")
  })

  it("patientPeak=100 < refPeak*0.9=135 → neither valid nor good", () => {
    const r = scoreSession(
      makeTemplate("knee-extension", [makeState("s", { left_knee: { mean: 150 } })], 3),
      null,
      makeTemplate("knee-extension", [makeState("s", { left_knee: { mean: 100 } })], 3),
      false
    )
    expect(r.validReps).toBe(0)
    expect(r.goodReps).toBe(0)
    out("NEITHER", "refPeak=150  patientPeak=100",
      `valid=${r.validReps}  good=${r.goodReps}`,
      "100 < 135 (ref×0.9) → incomplete movement")
  })
})

// ===========================================================================
// Branch 4 — allowProgression = false
// ===========================================================================

describe("allowProgression = false — idealPeak collapses to refPeak", () => {

  beforeAll(() => { HEAD("Branch 4: allowProgression=false") })

  it("patient=145 is good when ideal collapses to ref=150, ignoring idealTemplate=180", () => {
    // Without collapse: idealPeak=180 → threshold=162 → 145 < 162 → not good
    // With collapse: idealPeak = refPeak = 150 → threshold=135 → 145 >= 135 → good
    const r = scoreSession(
      makeTemplate("knee-extension", [makeState("s", { left_knee: { mean: 150 } })], 3),
      makeTemplate("knee-extension", [makeState("s", { left_knee: { mean: 180 } })], 3),
      makeTemplate("knee-extension", [makeState("s", { left_knee: { mean: 145 } })], 3),
      false
    )
    expect(r.goodReps).toBe(r.totalReps)
    expect(r.validReps).toBe(r.totalReps)
    out("COLLAPSE", "ideal=180 ignored (allowProgression=false), ref=150",
      `good=${r.goodReps}/${r.totalReps}`, "patient 145 >= 135 (ref×0.9)")
  })

  it("idealTemplate=null also collapses idealPeak to refPeak", () => {
    // Same patient=145, ref=150, no ideal → same outcome
    const r = scoreSession(
      makeTemplate("knee-extension", [makeState("s", { left_knee: { mean: 150 } })], 3),
      null,
      makeTemplate("knee-extension", [makeState("s", { left_knee: { mean: 145 } })], 3),
      true   // allowProgression=true but ideal=null → collapse anyway
    )
    expect(r.goodReps).toBe(r.totalReps)
    out("NULL-IDEAL", "idealTemplate=null, patient=145, ref=150",
      `good=${r.goodReps}/${r.totalReps}`, "null ideal → same as allowProgression=false")
  })
})

// ===========================================================================
// Branch 5 — progressScore
// ===========================================================================

describe("progressScore — interpolated between reference and ideal peaks", () => {

  beforeAll(() => {
    HEAD("Branch 5: progressScore")
    process.stdout.write("  formula: clamp((patientPeak - refPeak) / (idealPeak - refPeak) × 100, 0, 100)\n")
  })

  it("invalid rep → progressScore=0  (no movement credit)", () => {
    const r = scoreSession(
      makeTemplate("knee-extension", [makeState("s", { left_knee: { mean: 170 } })], 3),
      null,
      makeTemplate("knee-extension", [makeState("s", { left_knee: { mean: 100 } })], 3),
      false
    )
    expect(r.progressScore).toBe(0)
    out("PROGRESS", "patient=100 < ref*0.9=153 (invalid)",
      `progressScore=${r.progressScore}`, "invalid → 0")
  })

  it("refPeak = idealPeak (range=0) and valid rep → progressScore=100", () => {
    const r = scoreSession(
      makeTemplate("knee-extension", [makeState("s", { left_knee: { mean: 150 } })], 3),
      null,
      makeTemplate("knee-extension", [makeState("s", { left_knee: { mean: 145 } })], 3),
      false
    )
    expect(r.progressScore).toBe(100)
    out("PROGRESS", "refPeak=idealPeak=150, patient=145 (valid)",
      `progressScore=${r.progressScore}`, "zero range → 100")
  })

  it("patient midway between ref and ideal → progressScore in (0, 100]", () => {
    // refPeak=100, idealPeak=180, patientPeak=140 → range=80, above=40 → progress=50
    const r = scoreSession(
      makeTemplate("knee-extension", [makeState("l", { left_knee: { mean: 100 } })], 1),
      makeTemplate("knee-extension", [makeState("h", { left_knee: { mean: 180 } })], 1),
      makeTemplate("knee-extension", [makeState("m", { left_knee: { mean: 140 } })], 1),
      true
    )
    expect(r.progressScore).toBeGreaterThan(0)
    expect(r.progressScore).toBeLessThanOrEqual(100)
    out("PROGRESS", "ref=100  ideal=180  patient=140 (midway)",
      `progressScore=${r.progressScore}`, "interpolated: expected ~50")
  })

  it("patient exceeds idealPeak → progressScore clamped at 100", () => {
    const r = scoreSession(
      makeTemplate("knee-extension", [makeState("l", { left_knee: { mean: 100 } })], 1),
      makeTemplate("knee-extension", [makeState("h", { left_knee: { mean: 160 } })], 1),
      makeTemplate("knee-extension", [makeState("e", { left_knee: { mean: 175 } })], 1),
      true
    )
    expect(r.progressScore).toBeLessThanOrEqual(100)
    out("PROGRESS", "patient=175 > idealPeak=160",
      `progressScore=${r.progressScore}`, "clamped at 100")
  })
})

// ===========================================================================
// Branch 6 — formScore (secondary angles)
// ===========================================================================

describe("formScore — secondary joint alignment quality", () => {

  beforeAll(() => { HEAD("Branch 6: formScore") })

  it("no secondary angles → formScore=100 (assumed perfect when nothing to measure)", () => {
    // Only left_knee (primary for knee-extension) → no secondary angles
    const r = scoreSession(
      makeTemplate("knee-extension", [makeState("s", { left_knee: { mean: 150 } })], 3),
      null,
      makeTemplate("knee-extension", [makeState("s", { left_knee: { mean: 145 } })], 3),
      false
    )
    expect(r.formScore).toBe(100)
    out("FORM", "only left_knee (primary), no secondaries",
      `formScore=${r.formScore}`, "100% when no secondaries")
  })

  it("formScore is in [0, 100] when secondary angles exist", () => {
    const r = scoreSession(
      makeTemplate("knee-extension", [makeState("s", { left_knee: { mean: 150 }, right_knee: { mean: 150 } })], 3),
      null,
      makeTemplate("knee-extension", [makeState("s", { left_knee: { mean: 145 }, right_knee: { mean: 120 } })], 3),
      false
    )
    expect(r.formScore).toBeGreaterThanOrEqual(0)
    expect(r.formScore).toBeLessThanOrEqual(100)
    out("FORM", "right_knee secondary: ref=150 patient=120 (30° off)",
      `formScore=${r.formScore}`, "in [0, 100]")
  })
})

// ===========================================================================
// Result shape / general invariants
// ===========================================================================

describe("result shape invariants", () => {

  beforeAll(() => { HEAD("Result shape invariants") })

  it("totalReps always comes from patientTemplate.recommendedReps", () => {
    const s = makeState("s", { left_knee: { mean: 90 } })
    const r = scoreSession(
      makeTemplate("knee-extension", [s], 5),
      null,
      makeTemplate("knee-extension", [s], 7),
      false
    )
    expect(r.totalReps).toBe(7)
    out("TOTAL", "patientTemplate.recommendedReps=7", `totalReps=${r.totalReps}`)
  })

  it("validReps <= totalReps always", () => {
    const s = makeState("s", { left_knee: { mean: 150 } })
    const r = scoreSession(
      makeTemplate("knee-extension", [s], 3),
      null,
      makeTemplate("knee-extension", [s], 3),
      false
    )
    expect(r.validReps).toBeLessThanOrEqual(r.totalReps)
    out("INV", "validReps <= totalReps", `${r.validReps} <= ${r.totalReps} ✓`)
  })

  it("goodReps <= validReps always (good is a strict subset of valid)", () => {
    const r = scoreSession(
      makeTemplate("knee-extension", [makeState("s", { left_knee: { mean: 150 } })], 3),
      makeTemplate("knee-extension", [makeState("s", { left_knee: { mean: 180 } })], 3),
      makeTemplate("knee-extension", [makeState("s", { left_knee: { mean: 145 } })], 3),
      true
    )
    expect(r.goodReps).toBeLessThanOrEqual(r.validReps)
    out("INV", "goodReps <= validReps", `${r.goodReps} <= ${r.validReps} ✓`)
  })

  it("progressScore is in [0, 100]", () => {
    const s = makeState("s", { left_knee: { mean: 150 } })
    const r = scoreSession(
      makeTemplate("knee-extension", [s], 3),
      null,
      makeTemplate("knee-extension", [s], 3),
      false
    )
    expect(r.progressScore).toBeGreaterThanOrEqual(0)
    expect(r.progressScore).toBeLessThanOrEqual(100)
    out("INV", "progressScore in [0, 100]", `${r.progressScore} ✓`)
  })
})
