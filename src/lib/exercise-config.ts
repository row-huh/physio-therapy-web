/**
 * Exercise configurations with joints of interest
 */

export interface ExerciseConfig {
  id: string
  name: string
  description: string
  jointsOfInterest: string[]
}

export const EXERCISE_CONFIGS: ExerciseConfig[] = [
  {
    id: "knee-extension",
    name: "Knee Extension",
    description: "Extending the knee from bent to straight position",
    jointsOfInterest: ["left_knee", "right_knee", "left_ankle", "right_ankle"],
  },
  {
    id: "bicep-curl",
    name: "Bicep Curl",
    description: "Curling the arm to work the bicep muscle",
    jointsOfInterest: ["left_elbow", "right_elbow", "left_shoulder", "right_shoulder"],
  },
  {
    id: "squat",
    name: "Squat",
    description: "Full body squat movement",
    jointsOfInterest: ["left_knee", "right_knee", "left_hip", "right_hip", "left_ankle", "right_ankle"],
  },
  {
    id: "shoulder-press",
    name: "Shoulder Press",
    description: "Pressing arms overhead",
    jointsOfInterest: ["left_shoulder", "right_shoulder", "left_elbow", "right_elbow"],
  },
  {
    id: "leg-raise",
    name: "Leg Raise",
    description: "Raising the leg from hip",
    jointsOfInterest: ["left_hip", "right_hip", "left_knee", "right_knee"],
  },
  {
    id: "custom",
    name: "Custom Exercise",
    description: "Track all joints",
    jointsOfInterest: [
      "left_elbow",
      "right_elbow",
      "left_knee",
      "right_knee",
      "left_hip",
      "right_hip",
      "left_shoulder",
      "right_shoulder",
      "left_ankle",
      "right_ankle",
    ],
  },
]

export function getExerciseConfig(exerciseId: string): ExerciseConfig | undefined {
  return EXERCISE_CONFIGS.find((config) => config.id === exerciseId)
}

export function filterJointsByExercise(
  allJoints: string[],
  exerciseId: string,
): string[] {
  const config = getExerciseConfig(exerciseId)
  if (!config) return allJoints
  
  return allJoints.filter((joint) => config.jointsOfInterest.includes(joint))
}
