/**
 * Exercise configurations with specific angles to track
 */

export interface AngleConfig {
  type: "joint" | "segment"
  name: string
  description: string
}

export interface ExerciseConfig {
  id: string
  name: string
  description: string
  // Specific angles to track (not just joints)
  anglesOfInterest: string[]
  // Human-readable angle descriptions
  angleConfigs: AngleConfig[]
}

export const EXERCISE_CONFIGS: ExerciseConfig[] = [
  {
    id: "knee-extension",
    name: "Knee Extension",
    description: "Extending the knee from bent to straight position",
    anglesOfInterest: [
      // Joint angles (3-point)
      "left_knee",      // Hip-Knee-Ankle angle
      "right_knee",     // Hip-Knee-Ankle angle
      // Segment angles (2-point relative to vertical)
      "left_leg_segment",    // Knee-Ankle segment
      "right_leg_segment",   // Knee-Ankle segment
      "left_thigh_segment",  // Hip-Knee segment
      "right_thigh_segment", // Hip-Knee segment
    ],
    angleConfigs: [
      { type: "joint", name: "left_knee", description: "Left knee joint angle (hip-knee-ankle)" },
      { type: "joint", name: "right_knee", description: "Right knee joint angle (hip-knee-ankle)" },
      { type: "segment", name: "left_leg_segment", description: "Left lower leg angle from vertical (knee-ankle)" },
      { type: "segment", name: "right_leg_segment", description: "Right lower leg angle from vertical (knee-ankle)" },
      { type: "segment", name: "left_thigh_segment", description: "Left thigh angle from vertical (hip-knee)" },
      { type: "segment", name: "right_thigh_segment", description: "Right thigh angle from vertical (hip-knee)" },
    ],
  },
  {
    id: "bicep-curl",
    name: "Bicep Curl",
    description: "Curling the arm to work the bicep muscle",
    anglesOfInterest: [
      "left_elbow",
      "right_elbow",
    ],
    angleConfigs: [
      { type: "joint", name: "left_elbow", description: "Left elbow joint angle (shoulder-elbow-wrist)" },
      { type: "joint", name: "right_elbow", description: "Right elbow joint angle (shoulder-elbow-wrist)" },
    ],
  },
  {
    id: "squat",
    name: "Squat",
    description: "Full body squat movement",
    anglesOfInterest: [
      "left_knee",
      "right_knee",
      "left_hip",
      "right_hip",
      "left_thigh_segment",
      "right_thigh_segment",
    ],
    angleConfigs: [
      { type: "joint", name: "left_knee", description: "Left knee joint angle" },
      { type: "joint", name: "right_knee", description: "Right knee joint angle" },
      { type: "joint", name: "left_hip", description: "Left hip joint angle (shoulder-hip-knee)" },
      { type: "joint", name: "right_hip", description: "Right hip joint angle (shoulder-hip-knee)" },
      { type: "segment", name: "left_thigh_segment", description: "Left thigh angle from vertical" },
      { type: "segment", name: "right_thigh_segment", description: "Right thigh angle from vertical" },
    ],
  },
  {
    id: "shoulder-press",
    name: "Shoulder Press",
    description: "Pressing arms overhead",
    anglesOfInterest: [
      "left_shoulder",
      "right_shoulder",
      "left_elbow",
      "right_elbow",
      "left_arm_segment",
      "right_arm_segment",
    ],
    angleConfigs: [
      { type: "joint", name: "left_shoulder", description: "Left shoulder joint angle" },
      { type: "joint", name: "right_shoulder", description: "Right shoulder joint angle" },
      { type: "joint", name: "left_elbow", description: "Left elbow joint angle" },
      { type: "joint", name: "right_elbow", description: "Right elbow joint angle" },
      { type: "segment", name: "left_arm_segment", description: "Left upper arm angle from vertical" },
      { type: "segment", name: "right_arm_segment", description: "Right upper arm angle from vertical" },
    ],
  },
  {
    id: "leg-raise",
    name: "Leg Raise",
    description: "Raising the leg from hip",
    anglesOfInterest: [
      "left_hip",
      "right_hip",
      "left_thigh_segment",
      "right_thigh_segment",
    ],
    angleConfigs: [
      { type: "joint", name: "left_hip", description: "Left hip joint angle" },
      { type: "joint", name: "right_hip", description: "Right hip joint angle" },
      { type: "segment", name: "left_thigh_segment", description: "Left thigh angle from vertical" },
      { type: "segment", name: "right_thigh_segment", description: "Right thigh angle from vertical" },
    ],
  },
  {
    id: "custom",
    name: "Custom Exercise",
    description: "Track all joints and segments",
    anglesOfInterest: [
      "left_elbow",
      "right_elbow",
      "left_knee",
      "right_knee",
      "left_hip",
      "right_hip",
      "left_shoulder",
      "right_shoulder",
      "left_leg_segment",
      "right_leg_segment",
      "left_thigh_segment",
      "right_thigh_segment",
      "left_arm_segment",
      "right_arm_segment",
      "left_forearm_segment",
      "right_forearm_segment",
    ],
    angleConfigs: [
      { type: "joint", name: "left_elbow", description: "Left elbow angle" },
      { type: "joint", name: "right_elbow", description: "Right elbow angle" },
      { type: "joint", name: "left_knee", description: "Left knee angle" },
      { type: "joint", name: "right_knee", description: "Right knee angle" },
      { type: "joint", name: "left_hip", description: "Left hip angle" },
      { type: "joint", name: "right_hip", description: "Right hip angle" },
      { type: "joint", name: "left_shoulder", description: "Left shoulder angle" },
      { type: "joint", name: "right_shoulder", description: "Right shoulder angle" },
      { type: "segment", name: "left_leg_segment", description: "Left lower leg segment" },
      { type: "segment", name: "right_leg_segment", description: "Right lower leg segment" },
      { type: "segment", name: "left_thigh_segment", description: "Left thigh segment" },
      { type: "segment", name: "right_thigh_segment", description: "Right thigh segment" },
      { type: "segment", name: "left_arm_segment", description: "Left upper arm segment" },
      { type: "segment", name: "right_arm_segment", description: "Right upper arm segment" },
      { type: "segment", name: "left_forearm_segment", description: "Left forearm segment" },
      { type: "segment", name: "right_forearm_segment", description: "Right forearm segment" },
    ],
  },
]

export function getExerciseConfig(exerciseId: string): ExerciseConfig | undefined {
  return EXERCISE_CONFIGS.find((config) => config.id === exerciseId)
}

export function filterAnglesByExercise(
  allAngles: string[],
  exerciseId: string,
): string[] {
  const config = getExerciseConfig(exerciseId)
  if (!config) return allAngles
  
  return allAngles.filter((angle) => config.anglesOfInterest.includes(angle))
}

/**
 * Helper to convert old jointsOfInterest to anglesOfInterest
 * This maintains backward compatibility
 */
export function getAnglesFromJoints(joints: string[]): string[] {
  const angles: string[] = []
  
  joints.forEach((joint) => {
    // Add the joint angle itself
    angles.push(joint)
    
    // Add related segment angles
    if (joint.includes("knee") || joint.includes("ankle")) {
      const side = joint.includes("left") ? "left" : "right"
      angles.push(`${side}_leg_segment`)
      angles.push(`${side}_thigh_segment`)
    }
    if (joint.includes("hip")) {
      const side = joint.includes("left") ? "left" : "right"
      angles.push(`${side}_thigh_segment`)
    }
    if (joint.includes("elbow") || joint.includes("wrist")) {
      const side = joint.includes("left") ? "left" : "right"
      angles.push(`${side}_arm_segment`)
      angles.push(`${side}_forearm_segment`)
    }
    if (joint.includes("shoulder")) {
      const side = joint.includes("left") ? "left" : "right"
      angles.push(`${side}_arm_segment`)
    }
  })
  
  return [...new Set(angles)] // Remove duplicates
}
