/**
 * Joint Group Configuration
 *
 * Replaces the old exercise-specific configs with broad joint group definitions.
 * A doctor selects a joint group (knees, shoulders) rather than a specific exercise.
 * The template learner discovers the motion pattern from the reference video.
 *
 * Old exercise IDs (knee-extension, scap-wall-slides) are kept as aliases so that
 * existing database rows and URL params continue to work.
 */

export interface ExerciseConfig {
  id: string
  name: string
  description: string
  anglesOfInterest: string[]
  // Minimum joint angle movement (degrees) required for a feature to be "active"
  minAmplitudeDegrees?: number
}

// AngleConfig kept for components that reference it
export interface AngleConfig {
  type: "joint" | "segment"
  name: string
  description: string
}

const JOINT_GROUPS: ExerciseConfig[] = [
  {
    id: "knees",
    name: "Knees",
    description:
      "Knee-focused exercises: extensions, flexions, squats, lunges, step-ups",
    anglesOfInterest: [
      "left_knee",
      "right_knee",
      "left_hip",
      "right_hip",
      "left_leg_segment",
      "right_leg_segment",
      "left_thigh_segment",
      "right_thigh_segment",
    ],
    minAmplitudeDegrees: 15,
  },
  {
    id: "shoulders",
    name: "Shoulders",
    description:
      "Shoulder-focused exercises: raises, slides, rotations, overhead presses",
    anglesOfInterest: [
      "left_shoulder",
      "right_shoulder",
      "left_elbow",
      "right_elbow",
      "left_arm_segment",
      "right_arm_segment",
      "left_forearm_segment",
      "right_forearm_segment",
    ],
    minAmplitudeDegrees: 18,
  },
]

// Old exercise IDs map to joint groups so existing assignments keep working
const ALIASES: Record<string, string> = {
  "knee-extension": "knees",
  "scap-wall-slides": "shoulders",
}

/** Exposed as EXERCISE_CONFIGS for backward compat with UI dropdowns */
export const EXERCISE_CONFIGS: ExerciseConfig[] = JOINT_GROUPS

export function getExerciseConfig(exerciseId: string): ExerciseConfig | undefined {
  const resolved = ALIASES[exerciseId] ?? exerciseId
  return JOINT_GROUPS.find((g) => g.id === resolved)
}

export function filterAnglesByExercise(
  allAngles: string[],
  exerciseId: string,
): string[] {
  const config = getExerciseConfig(exerciseId)
  if (!config) return allAngles
  return allAngles.filter((a) => config.anglesOfInterest.includes(a))
}

/** Resolve an alias or group ID to the canonical group ID */
export function resolveJointGroup(groupOrAlias: string): string {
  return ALIASES[groupOrAlias] ?? groupOrAlias
}

/** Convenience: get the angles of interest for any group or alias */
export function getAnglesOfInterest(groupOrAlias: string): string[] {
  return getExerciseConfig(groupOrAlias)?.anglesOfInterest ?? []
}