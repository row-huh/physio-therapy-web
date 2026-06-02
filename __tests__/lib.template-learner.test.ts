import { learnPoseTemplate, RepDetector } from "@/lib/template-learner"
import { groupJointAnglesByFrame, flagDropoutFrames } from "@/lib/pose-features"
import type { JointAngle } from "@/lib/pose-analyzer"

/**
 * Synthesise a sinusoidal knee-extension signal: rest (flexed) -> peak
 * (extended) -> rest, for `reps` cycles at `fps`.
 */
function kneeSignal(opts: {
  reps: number
  fps?: number
  secPerRep?: number
  restMin?: number
  peakMax?: number
  noise?: number
}): JointAngle[] {
  const { reps, fps = 30, secPerRep = 2, restMin = 90, peakMax = 170, noise = 0 } = opts
  const out: JointAngle[] = []
  const amp = (peakMax - restMin) / 2
  const mid = (peakMax + restMin) / 2
  const fpr = Math.round(fps * secPerRep)
  let frame = 0
  const n = () => (Math.random() - 0.5) * 2 * noise
  for (let r = 0; r < reps; r++) {
    for (let f = 0; f < fpr; f++) {
      const phase = (f / fpr) * 2 * Math.PI
      const knee = mid - amp * Math.cos(phase)
      out.push({ joint: "right_knee", angle: knee + n(), timestamp: frame / fps, visibility: 0.95 })
      out.push({ joint: "right_hip", angle: 100 + n(), timestamp: frame / fps, visibility: 0.95 })
      frame++
    }
  }
  return out
}

const learn = (angles: JointAngle[]) =>
  learnPoseTemplate(angles, "Knee Extension", "knees", ["right_knee", "right_hip"])

describe("learnPoseTemplate — rep detection across tempos", () => {
  // Regression: ~1s/rep movements used to estimate the rest baseline near the
  // PEAK, collapsing the thresholds and detecting zero reps.
  it.each([
    ["slow 4s/rep", { reps: 3, secPerRep: 4 }],
    ["medium 2s/rep", { reps: 4, secPerRep: 2 }],
    ["fast 1s/rep", { reps: 5, secPerRep: 1 }],
    ["very fast 0.8s/rep", { reps: 6, secPerRep: 0.8 }],
  ] as const)("detects the right rep count: %s", (_label, opts) => {
    const tmpl = learn(kneeSignal(opts))
    expect(tmpl.recommendedReps).toBe(opts.reps)
    expect(tmpl.quality.warnings).not.toContain(
      "State machine detected no complete repetitions. Try a slower, larger movement in the reference video.",
    )
  })

  it("tolerates measurement noise", () => {
    const tmpl = learn(kneeSignal({ reps: 4, secPerRep: 1.5, noise: 5 }))
    expect(tmpl.recommendedReps).toBeGreaterThanOrEqual(3)
  })
})

describe("RepDetector.estimateRestBaseline", () => {
  function detectorFor(reps: number, secPerRep: number) {
    const frames = groupJointAnglesByFrame(kneeSignal({ reps, secPerRep }), ["right_knee"])
    flagDropoutFrames(frames, ["right_knee"])
    return new RepDetector(frames, "right_knee", "increasing")
  }

  it("anchors rest near the trough, not the peak, even for fast reps", () => {
    // rest=90, peak=170 → baseline must be down near 90, never up near 170.
    for (const secPerRep of [4, 2, 1, 0.8]) {
      const rest = detectorFor(5, secPerRep).estimateRestBaseline()
      expect(rest).toBeLessThan(110)
      expect(rest).toBeGreaterThan(80)
    }
  })
})
