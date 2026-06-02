import { RecordingCoach } from "@/lib/recording-coach"

/**
 * Feeds the coach a sinusoidal knee signal that swings between `min`..`max`
 * for `reps` cycles at 30 fps, then returns the final CoachState.
 */
function runSignal(opts: {
  angle?: string
  min: number
  max: number
  reps: number
  visibility?: number
  anglesOfInterest?: string[]
  minAmplitude?: number
}) {
  const {
    angle = "right_knee",
    min,
    max,
    reps,
    visibility = 0.9,
    anglesOfInterest = ["right_knee", "right_hip"],
    minAmplitude = 15,
  } = opts

  const coach = new RecordingCoach(anglesOfInterest, minAmplitude)
  const framesPerRep = 30
  const mid = (min + max) / 2
  const amp = (max - min) / 2

  let last
  let t = 0
  for (let r = 0; r < reps; r++) {
    for (let f = 0; f < framesPerRep; f++) {
      const phase = (f / framesPerRep) * 2 * Math.PI
      const value = mid - amp * Math.cos(phase) // starts at min, peaks at mid-rep
      t += 1 / 30
      last = coach.update({ [angle]: value }, visibility, t)
    }
  }
  return { coach, state: last! }
}

describe("RecordingCoach", () => {
  it("reports 'no-pose' when no landmarks/angles are present", () => {
    const coach = new RecordingCoach(["right_knee"], 15)
    let state
    for (let i = 0; i < 10; i++) state = coach.update({}, 0, i / 30)
    expect(state!.status).toBe("no-pose")
  })

  it("reports 'small-motion' when the movement is too small to learn", () => {
    const { state } = runSignal({ min: 120, max: 128, reps: 4 }) // 8° range < 15°
    expect(state.status).toBe("small-motion")
    expect(state.reps).toBe(0)
  })

  it("counts reps and reaches 'enough' after 3 clear full-range reps", () => {
    const { state } = runSignal({ min: 90, max: 170, reps: 4 })
    expect(state.reps).toBeGreaterThanOrEqual(3)
    expect(state.status).toBe("enough")
    expect(state.progress).toBe(1)
    expect(state.primaryAngle).toBe("right_knee")
  })

  it("says 'a little longer' after just one or two reps", () => {
    const { state } = runSignal({ min: 90, max: 170, reps: 2 })
    expect(state.reps).toBeGreaterThanOrEqual(1)
    expect(state.reps).toBeLessThan(3)
    expect(state.status).toBe("keep-going")
  })

  it("flags low visibility even when the motion is large", () => {
    const { state } = runSignal({ min: 90, max: 170, reps: 3, visibility: 0.2 })
    expect(state.status).toBe("low-visibility")
  })

  it("picks the joint angle with the largest range as primary", () => {
    // right_hip barely moves; right_knee swings widely → knee should win.
    const coach = new RecordingCoach(["right_knee", "right_hip"], 15)
    let state
    let t = 0
    for (let r = 0; r < 3; r++) {
      for (let f = 0; f < 30; f++) {
        const phase = (f / 30) * 2 * Math.PI
        const knee = 130 - 40 * Math.cos(phase)
        const hip = 100 - 2 * Math.cos(phase)
        t += 1 / 30
        state = coach.update({ right_knee: knee, right_hip: hip }, 0.9, t)
      }
    }
    expect(state!.primaryAngle).toBe("right_knee")
  })
})
