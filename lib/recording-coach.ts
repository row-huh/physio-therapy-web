/**
 * Recording Coach
 *
 * A lightweight, real-time estimator that runs while the doctor records a
 * reference video and predicts whether `learnPoseTemplate` will be able to
 * learn a usable template from what has been captured so far.
 *
 * It mirrors the offline learner's requirements (see template-learner.ts):
 *   - a primary joint angle with enough amplitude (≥ minAmplitude)
 *   - the limb actually visible (visibility ≥ ~0.5)
 *   - at least a couple of clean, full-range repetitions
 *
 * The output is a single coaching message + status the UI can surface live so
 * the doctor knows when "this should be enough" vs "a little longer".
 */

import { JOINT_ANGLES } from "./pose-angles"

export type CoachStatus =
  | "no-pose"
  | "low-visibility"
  | "small-motion"
  | "no-reps"
  | "keep-going"
  | "enough"

export interface CoachState {
  status: CoachStatus
  message: string
  reps: number
  primaryAngle: string | null
  primaryRange: number
  visibility: number
  /** 0–1 readiness, for a progress bar. Reaches 1 at ENOUGH_REPS clean reps. */
  progress: number
}

/** Clean reps after which the learner reliably produces a confident template. */
const ENOUGH_REPS = 3

interface AngleAccumulator {
  min: number
  max: number
  visSum: number
  visCount: number
  samples: number
}

export class RecordingCoach {
  private readonly anglesOfInterest: string[]
  private readonly minAmplitude: number

  private acc = new Map<string, AngleAccumulator>()
  private framesSeen = 0
  private framesWithPose = 0

  // Rep state machine on the (dynamically chosen) primary angle.
  private repPhase: "idle" | "up" = "idle"
  private reps = 0
  private lastRepTime = 0
  private lockedPrimary: string | null = null

  constructor(anglesOfInterest: string[], minAmplitude: number) {
    this.anglesOfInterest = anglesOfInterest
    this.minAmplitude = minAmplitude
  }

  reset() {
    this.acc.clear()
    this.framesSeen = 0
    this.framesWithPose = 0
    this.repPhase = "idle"
    this.reps = 0
    this.lastRepTime = 0
    this.lockedPrimary = null
  }

  get repCount() {
    return this.reps
  }

  /**
   * Feed one frame.
   * @param angles      angle name → degrees for this frame (already smoothed)
   * @param visibility  average visibility of the relevant limb (0–1)
   * @param timeSeconds frame timestamp in seconds
   */
  update(
    angles: Record<string, number>,
    visibility: number,
    timeSeconds: number,
  ): CoachState {
    this.framesSeen++
    const hasPose = Object.keys(angles).length > 0
    if (hasPose) this.framesWithPose++

    // Accumulate running range + visibility per angle of interest.
    for (const name of this.anglesOfInterest) {
      const v = angles[name]
      if (v === undefined) continue
      let a = this.acc.get(name)
      if (!a) {
        a = { min: v, max: v, visSum: 0, visCount: 0, samples: 0 }
        this.acc.set(name, a)
      }
      if (v < a.min) a.min = v
      if (v > a.max) a.max = v
      a.visSum += visibility
      a.visCount++
      a.samples++
    }

    const primary = this.resolvePrimary()
    const primaryRange = primary ? this.rangeOf(primary) : 0

    // Rep detection on the primary angle, using thresholds derived from the
    // observed range (no template exists yet — this is unsupervised).
    if (primary && primaryRange >= this.minAmplitude) {
      const a = this.acc.get(primary)!
      const val = angles[primary]
      if (val !== undefined) {
        const high = a.min + 0.7 * (a.max - a.min)
        const low = a.min + 0.3 * (a.max - a.min)
        if (this.repPhase === "idle" && val >= high) {
          this.repPhase = "up"
        } else if (this.repPhase === "up" && val <= low) {
          // Completed an out-and-back movement — count it (with a cooldown).
          if (timeSeconds - this.lastRepTime >= 0.6) {
            this.reps++
            this.lastRepTime = timeSeconds
          }
          this.repPhase = "idle"
        }
      }
    }

    return this.evaluate(primary, primaryRange, visibility, hasPose)
  }

  /** Range (max−min) observed for an angle so far. */
  private rangeOf(name: string): number {
    const a = this.acc.get(name)
    return a ? a.max - a.min : 0
  }

  private avgVisibility(name: string): number {
    const a = this.acc.get(name)
    return a && a.visCount > 0 ? a.visSum / a.visCount : 0
  }

  /**
   * Pick the primary joint angle the same way the offline learner does:
   * the joint angle (not a segment) with the greatest amplitude × visibility.
   * Once a confident primary emerges it is locked to avoid flip-flopping.
   */
  private resolvePrimary(): string | null {
    if (this.lockedPrimary && this.rangeOf(this.lockedPrimary) >= this.minAmplitude) {
      return this.lockedPrimary
    }

    const jointCandidates = this.anglesOfInterest.filter((a) => JOINT_ANGLES.has(a))
    const candidates = jointCandidates.length > 0 ? jointCandidates : this.anglesOfInterest

    let best: string | null = null
    let bestWeight = -1
    for (const name of candidates) {
      const range = this.rangeOf(name)
      const weight = range * Math.max(0.1, this.avgVisibility(name))
      if (weight > bestWeight) {
        bestWeight = weight
        best = name
      }
    }

    if (best && this.rangeOf(best) >= this.minAmplitude) {
      this.lockedPrimary = best
    }
    return best
  }

  private evaluate(
    primary: string | null,
    primaryRange: number,
    visibility: number,
    hasPose: boolean,
  ): CoachState {
    const base = {
      reps: this.reps,
      primaryAngle: primary,
      primaryRange,
      visibility,
      progress: Math.min(1, this.reps / ENOUGH_REPS),
    }

    // Not enough frames yet to say anything useful.
    const poseRatio = this.framesSeen > 0 ? this.framesWithPose / this.framesSeen : 0

    if (!hasPose || poseRatio < 0.4) {
      return {
        ...base,
        status: "no-pose",
        message: "Step into frame — make sure your whole body is visible.",
      }
    }

    if (primary && this.avgVisibility(primary) < 0.5) {
      return {
        ...base,
        status: "low-visibility",
        message: "Move closer / clear the view so the tracked limb is fully visible.",
      }
    }

    if (!primary || primaryRange < this.minAmplitude) {
      return {
        ...base,
        status: "small-motion",
        message: "Perform the exercise through its full range of motion.",
      }
    }

    if (this.reps === 0) {
      return {
        ...base,
        status: "no-reps",
        message: "Good — now perform clear, full repetitions.",
      }
    }

    if (this.reps < ENOUGH_REPS) {
      return {
        ...base,
        status: "keep-going",
        message: `Nice — a little longer (${this.reps}/${ENOUGH_REPS} reps captured).`,
      }
    }

    return {
      ...base,
      status: "enough",
      message: `This should be enough ✓ (${this.reps} reps captured) — stop when ready.`,
    }
  }
}
