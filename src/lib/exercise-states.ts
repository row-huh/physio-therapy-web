/**
 * Exercise state definitions with angle thresholds
 */

export interface AngleThreshold {
  angleName: string
  min: number
  max: number
}

export interface ExerciseState {
  id: string
  name: string
  description: string
  thresholds: AngleThreshold[]
}

export interface ExerciseStateConfig {
  exerciseId: string
  states: ExerciseState[]
  repSequence: string[] // e.g., ["extended", "flexed", "extended"] for 1 rep
}

export const EXERCISE_STATE_CONFIGS: ExerciseStateConfig[] = [
  {
    exerciseId: "knee-extension",
    states: [
      {
        id: "flexed",
        name: "Flexed (Bent)",
        description: "Knee is bent",
        thresholds: [
          { angleName: "right_knee", min: 70, max: 110 },
          { angleName: "left_knee", min: 70, max: 110 },
        ],
      },
      {
        id: "extended",
        name: "Extended (Straight)",
        description: "Knee is straight",
        thresholds: [
          { angleName: "right_knee", min: 160, max: 180 },
          { angleName: "left_knee", min: 160, max: 180 },
        ],
      },
    ],
    repSequence: ["flexed", "extended", "flexed"], // One complete rep
  },
  {
    exerciseId: "bicep-curl",
    states: [
      {
        id: "extended",
        name: "Extended (Straight Arm)",
        description: "Arm is straight",
        thresholds: [
          { angleName: "right_elbow", min: 160, max: 180 },
          { angleName: "left_elbow", min: 160, max: 180 },
        ],
      },
      {
        id: "flexed",
        name: "Flexed (Curled)",
        description: "Arm is curled",
        thresholds: [
          { angleName: "right_elbow", min: 30, max: 60 },
          { angleName: "left_elbow", min: 30, max: 60 },
        ],
      },
    ],
    repSequence: ["extended", "flexed", "extended"],
  },
  {
    exerciseId: "squat",
    states: [
      {
        id: "standing",
        name: "Standing",
        description: "Standing upright",
        thresholds: [
          { angleName: "right_knee", min: 160, max: 180 },
          { angleName: "left_knee", min: 160, max: 180 },
          { angleName: "right_hip", min: 160, max: 180 },
          { angleName: "left_hip", min: 160, max: 180 },
        ],
      },
      {
        id: "squat",
        name: "Squat Position",
        description: "In squat position",
        thresholds: [
          { angleName: "right_knee", min: 70, max: 110 },
          { angleName: "left_knee", min: 70, max: 110 },
          { angleName: "right_hip", min: 70, max: 110 },
          { angleName: "left_hip", min: 70, max: 110 },
        ],
      },
    ],
    repSequence: ["standing", "squat", "standing"],
  },
]

export function getExerciseStateConfig(exerciseId: string): ExerciseStateConfig | undefined {
  return EXERCISE_STATE_CONFIGS.find((config) => config.exerciseId === exerciseId)
}

/**
 * Determine which state the current angles match
 */
export function detectState(
  angles: { [angleName: string]: number },
  stateConfig: ExerciseStateConfig
): string | null {
  for (const state of stateConfig.states) {
    let allMatch = true
    let hasAtLeastOneMatch = false
    
    for (const threshold of state.thresholds) {
      const currentAngle = angles[threshold.angleName]
      
      if (currentAngle !== undefined) {
        hasAtLeastOneMatch = true
        if (currentAngle < threshold.min || currentAngle > threshold.max) {
          allMatch = false
          break
        }
      }
    }
    
    if (allMatch && hasAtLeastOneMatch) {
      return state.id
    }
  }
  
  return null // No state matched
}

/**
 * Track rep count based on state sequence
 */
export class RepCounter {
  private stateSequence: string[] = []
  private repCount: number = 0
  private lastState: string | null = null
  private config: ExerciseStateConfig
  
  constructor(config: ExerciseStateConfig) {
    this.config = config
  }
  
  addState(state: string | null) {
    if (state === null || state === this.lastState) {
      return // No change or invalid state
    }
    
    this.stateSequence.push(state)
    this.lastState = state
    
    // Check if we completed a rep
    if (this.matchesRepSequence()) {
      this.repCount++
      // Keep last state for continuity
      this.stateSequence = [state]
    }
    
    // Prevent sequence from growing too large
    if (this.stateSequence.length > this.config.repSequence.length + 2) {
      this.stateSequence.shift()
    }
  }
  
  private matchesRepSequence(): boolean {
    const repSeq = this.config.repSequence
    const currentSeq = this.stateSequence
    
    if (currentSeq.length < repSeq.length) {
      return false
    }
    
    // Check if the last N states match the rep sequence
    const recentStates = currentSeq.slice(-repSeq.length)
    return recentStates.every((state, index) => state === repSeq[index])
  }
  
  getRepCount(): number {
    return this.repCount
  }
  
  getCurrentSequence(): string[] {
    return [...this.stateSequence]
  }
  
  reset() {
    this.stateSequence = []
    this.repCount = 0
    this.lastState = null
  }
}
