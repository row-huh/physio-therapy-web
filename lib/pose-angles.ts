/**
 * Shared pose geometry
 *
 * Landmark indices, skeleton connections, and the angle math used by every
 * live MediaPipe surface (doctor recorder + patient comparison recorder).
 *
 * Keeping this in one place means the doctor's reference recording and the
 * patient's comparison session compute angles identically — which is what
 * makes a learned template actually comparable to a live session.
 */

export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
} as const

/** Skeleton segments for drawing the overlay. */
export const POSE_CONNECTIONS = [
  { start: 0, end: 1 }, { start: 1, end: 2 }, { start: 2, end: 3 }, { start: 3, end: 7 },
  { start: 0, end: 4 }, { start: 4, end: 5 }, { start: 5, end: 6 }, { start: 6, end: 8 },
  { start: 9, end: 10 },

  { start: 11, end: 12 }, { start: 11, end: 23 }, { start: 12, end: 24 },
  { start: 23, end: 24 },

  { start: 11, end: 13 }, { start: 13, end: 15 },
  { start: 15, end: 17 }, { start: 15, end: 19 }, { start: 15, end: 21 },
  { start: 17, end: 19 },

  { start: 12, end: 14 }, { start: 14, end: 16 },
  { start: 16, end: 18 }, { start: 16, end: 20 }, { start: 16, end: 22 },
  { start: 18, end: 20 },

  { start: 23, end: 25 }, { start: 25, end: 27 },
  { start: 27, end: 29 }, { start: 27, end: 31 }, { start: 29, end: 31 },

  { start: 24, end: 26 }, { start: 26, end: 28 },
  { start: 28, end: 30 }, { start: 28, end: 32 }, { start: 30, end: 32 },
]

/** The 3-point joint angles (segments are excluded). */
export const JOINT_ANGLES = new Set([
  "left_knee", "right_knee",
  "left_elbow", "right_elbow",
  "left_hip", "right_hip",
  "left_shoulder", "right_shoulder",
])

/**
 * Maps each tracked angle to the skeleton bone segments (landmark index pairs)
 * that physically represent it. Used to colour the live overlay per-segment:
 * a joint whose angle is outside the reference range turns its bones red.
 */
const L = POSE_LANDMARKS
export const ANGLE_SEGMENTS: Record<string, [number, number][]> = {
  left_knee: [[L.LEFT_HIP, L.LEFT_KNEE], [L.LEFT_KNEE, L.LEFT_ANKLE]],
  right_knee: [[L.RIGHT_HIP, L.RIGHT_KNEE], [L.RIGHT_KNEE, L.RIGHT_ANKLE]],
  left_hip: [[L.LEFT_SHOULDER, L.LEFT_HIP], [L.LEFT_HIP, L.LEFT_KNEE]],
  right_hip: [[L.RIGHT_SHOULDER, L.RIGHT_HIP], [L.RIGHT_HIP, L.RIGHT_KNEE]],
  left_elbow: [[L.LEFT_SHOULDER, L.LEFT_ELBOW], [L.LEFT_ELBOW, L.LEFT_WRIST]],
  right_elbow: [[L.RIGHT_SHOULDER, L.RIGHT_ELBOW], [L.RIGHT_ELBOW, L.RIGHT_WRIST]],
  left_shoulder: [[L.LEFT_ELBOW, L.LEFT_SHOULDER], [L.LEFT_SHOULDER, L.LEFT_HIP]],
  right_shoulder: [[L.RIGHT_ELBOW, L.RIGHT_SHOULDER], [L.RIGHT_SHOULDER, L.RIGHT_HIP]],
  left_leg_segment: [[L.LEFT_KNEE, L.LEFT_ANKLE]],
  right_leg_segment: [[L.RIGHT_KNEE, L.RIGHT_ANKLE]],
  left_thigh_segment: [[L.LEFT_HIP, L.LEFT_KNEE]],
  right_thigh_segment: [[L.RIGHT_HIP, L.RIGHT_KNEE]],
  left_arm_segment: [[L.LEFT_SHOULDER, L.LEFT_ELBOW]],
  right_arm_segment: [[L.RIGHT_SHOULDER, L.RIGHT_ELBOW]],
  left_forearm_segment: [[L.LEFT_ELBOW, L.LEFT_WRIST]],
  right_forearm_segment: [[L.RIGHT_ELBOW, L.RIGHT_WRIST]],
}

/** Canonical key for an unordered landmark-index pair. */
export function segmentKey(a: number, b: number): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`
}

export interface Landmark {
  x: number
  y: number
  z?: number
  visibility?: number
}

/** Interior angle at point b, formed by b→a and b→c. Returns 0–180°. */
export function calculateAngle(a: number[], b: number[], c: number[]): number {
  const radians =
    Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0])
  let angle = Math.abs((radians * 180.0) / Math.PI)
  if (angle > 180.0) angle = 360.0 - angle
  return angle
}

/** Angle of a limb segment relative to the vertical axis. Returns 0–180°. */
export function calculateSegmentAngleFromVertical(start: number[], end: number[]): number {
  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  return Math.abs((Math.atan2(dx, dy) * 180.0) / Math.PI)
}

/**
 * Convert MediaPipe landmarks → the full biomechanical angle dictionary.
 * Only the angles that can be computed (landmarks present) are included.
 */
export function calculateAllAngles(landmarks: Landmark[]): Record<string, number> {
  const angles: Record<string, number> = {}
  const L = POSE_LANDMARKS
  const p = (i: number) => [landmarks[i].x, landmarks[i].y]

  const safe = (name: string, fn: () => number) => {
    try {
      const v = fn()
      if (Number.isFinite(v)) angles[name] = v
    } catch {
      /* landmark missing — skip this angle */
    }
  }

  safe("left_elbow", () => calculateAngle(p(L.LEFT_SHOULDER), p(L.LEFT_ELBOW), p(L.LEFT_WRIST)))
  safe("right_elbow", () => calculateAngle(p(L.RIGHT_SHOULDER), p(L.RIGHT_ELBOW), p(L.RIGHT_WRIST)))
  safe("left_knee", () => calculateAngle(p(L.LEFT_HIP), p(L.LEFT_KNEE), p(L.LEFT_ANKLE)))
  safe("right_knee", () => calculateAngle(p(L.RIGHT_HIP), p(L.RIGHT_KNEE), p(L.RIGHT_ANKLE)))
  safe("left_hip", () => calculateAngle(p(L.LEFT_SHOULDER), p(L.LEFT_HIP), p(L.LEFT_KNEE)))
  safe("right_hip", () => calculateAngle(p(L.RIGHT_SHOULDER), p(L.RIGHT_HIP), p(L.RIGHT_KNEE)))
  safe("left_shoulder", () => calculateAngle(p(L.LEFT_ELBOW), p(L.LEFT_SHOULDER), p(L.LEFT_HIP)))
  safe("right_shoulder", () => calculateAngle(p(L.RIGHT_ELBOW), p(L.RIGHT_SHOULDER), p(L.RIGHT_HIP)))

  safe("left_leg_segment", () => calculateSegmentAngleFromVertical(p(L.LEFT_KNEE), p(L.LEFT_ANKLE)))
  safe("right_leg_segment", () => calculateSegmentAngleFromVertical(p(L.RIGHT_KNEE), p(L.RIGHT_ANKLE)))
  safe("left_thigh_segment", () => calculateSegmentAngleFromVertical(p(L.LEFT_HIP), p(L.LEFT_KNEE)))
  safe("right_thigh_segment", () => calculateSegmentAngleFromVertical(p(L.RIGHT_HIP), p(L.RIGHT_KNEE)))
  safe("left_arm_segment", () => calculateSegmentAngleFromVertical(p(L.LEFT_SHOULDER), p(L.LEFT_ELBOW)))
  safe("right_arm_segment", () => calculateSegmentAngleFromVertical(p(L.RIGHT_SHOULDER), p(L.RIGHT_ELBOW)))
  safe("left_forearm_segment", () => calculateSegmentAngleFromVertical(p(L.LEFT_ELBOW), p(L.LEFT_WRIST)))
  safe("right_forearm_segment", () => calculateSegmentAngleFromVertical(p(L.RIGHT_ELBOW), p(L.RIGHT_WRIST)))

  return angles
}

/**
 * Average visibility of the landmarks that feed the given angle names.
 * Used to decide whether the relevant limb is actually in frame.
 */
export function visibilityForAngles(landmarks: Landmark[], angleNames: string[]): number {
  const idxByAngle: Record<string, number[]> = {
    left_knee: [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.LEFT_ANKLE],
    right_knee: [POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE, POSE_LANDMARKS.RIGHT_ANKLE],
    left_hip: [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE],
    right_hip: [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE],
    left_elbow: [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST],
    right_elbow: [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST],
    left_shoulder: [POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP],
    right_shoulder: [POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_HIP],
    left_leg_segment: [POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.LEFT_ANKLE],
    right_leg_segment: [POSE_LANDMARKS.RIGHT_KNEE, POSE_LANDMARKS.RIGHT_ANKLE],
    left_thigh_segment: [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE],
    right_thigh_segment: [POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE],
    left_arm_segment: [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW],
    right_arm_segment: [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW],
    left_forearm_segment: [POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST],
    right_forearm_segment: [POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST],
  }

  const indices = new Set<number>()
  for (const name of angleNames) {
    for (const i of idxByAngle[name] ?? []) indices.add(i)
  }
  if (indices.size === 0) return 1

  let sum = 0
  let count = 0
  for (const i of indices) {
    const v = landmarks[i]?.visibility
    if (v !== undefined) { sum += v; count++ }
  }
  return count > 0 ? sum / count : 1
}
