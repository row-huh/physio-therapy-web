import { scoreRepWithDtw } from "@/lib/dtw-scorer"
import { learnPoseTemplate } from "@/lib/template-learner"
import type { JointAngle } from "@/lib/pose-analyzer"
import type { FeatureFrame } from "@/lib/pose-features"

// Reference: clean knee extension, rest 90 -> peak 170, 4 reps @ 30fps.
function refSignal(): JointAngle[] {
  const out: JointAngle[] = []
  const fpr = 60
  let frame = 0
  for (let r = 0; r < 4; r++) {
    for (let f = 0; f < fpr; f++) {
      const phase = (f / fpr) * 2 * Math.PI
      const knee = 130 - 40 * Math.cos(phase)
      out.push({ joint: "right_knee", angle: knee, timestamp: frame / 30, visibility: 0.95 })
      out.push({ joint: "right_hip", angle: 100, timestamp: frame / 30, visibility: 0.95 })
      frame++
    }
  }
  return out
}

// Build a single-rep patient buffer from a generator over `frames` samples.
// `fps` controls the timestamp spacing; `durationSec` overrides total duration.
function patientRep(
  gen: (phase01: number) => number,
  frames = 60,
  fps = 30,
): FeatureFrame[] {
  const out: FeatureFrame[] = []
  for (let f = 0; f < frames; f++) {
    const knee = gen(f / frames)
    out.push({
      timestamp: f / fps,
      values: { right_knee: knee, right_hip: 100 },
      visibility: {},
      dropout: false,
    })
  }
  return out
}

describe("scoreRepWithDtw — matching vs non-matching", () => {
  const ref = learnPoseTemplate(refSignal(), "Knee Ext", "knees", ["right_knee", "right_hip"])

  it("reference primary feature is the knee", () => {
    expect(ref.primarySignal.feature).toBe("right_knee")
  })

  it("scores a matching rep high", () => {
    const pat = patientRep((p) => 130 - 40 * Math.cos(p * 2 * Math.PI))
    const score = scoreRepWithDtw(ref, pat, 0, pat.length - 1)
    expect(score.overall).toBeGreaterThanOrEqual(75)
  })

  it("scores a barely-moving (non-matching) rep below the rep-count gate (60)", () => {
    // Jitter around mid-range — never performs the movement.
    const pat = patientRep((p) => 130 + 4 * Math.sin(p * 13))
    const score = scoreRepWithDtw(ref, pat, 0, pat.length - 1)
    expect(score.rangeOfMotion).toBeLessThan(40)
    expect(score.overall).toBeLessThan(60)
  })

  it("scores tempo from time, not frame count (frame-rate independent)", () => {
    const gen = (p: number) => 130 - 40 * Math.cos(p * 2 * Math.PI)
    // Identical 2-second movement sampled at 30fps vs 60fps.
    const at30 = patientRep(gen, 60, 30)
    const at60 = patientRep(gen, 120, 60)
    const t30 = scoreRepWithDtw(ref, at30, 0, at30.length - 1).tempo
    const t60 = scoreRepWithDtw(ref, at60, 0, at60.length - 1).tempo
    // Same real duration → same tempo score regardless of frame rate.
    expect(Math.abs(t30 - t60)).toBeLessThanOrEqual(5)
  })

  it("penalises a much-too-fast rep on tempo", () => {
    const gen = (p: number) => 130 - 40 * Math.cos(p * 2 * Math.PI)
    const matched = patientRep(gen, 60, 30) // 2.0s
    const tooFast = patientRep(gen, 15, 30) // 0.5s
    const tMatched = scoreRepWithDtw(ref, matched, 0, matched.length - 1).tempo
    const tFast = scoreRepWithDtw(ref, tooFast, 0, tooFast.length - 1).tempo
    expect(tFast).toBeLessThan(tMatched)
  })

  it("penalises a half-range rep on ROM", () => {
    // Correct shape but only reaches 130 instead of 170 (half the ROM).
    const full = patientRep((p) => 130 - 40 * Math.cos(p * 2 * Math.PI))
    const half = patientRep((p) => 110 - 20 * Math.cos(p * 2 * Math.PI))
    const sFull = scoreRepWithDtw(ref, full, 0, full.length - 1)
    const sHalf = scoreRepWithDtw(ref, half, 0, half.length - 1)
    expect(sHalf.rangeOfMotion).toBeLessThan(sFull.rangeOfMotion)
    expect(sHalf.overall).toBeLessThan(sFull.overall)
  })
})
