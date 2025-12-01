import type { Pose, KeyPoseFrame } from "./pose-utils"

const STORAGE_KEY = "exercise-poses"

export interface Exercise {
  id: string
  name: string
  description: string
  keyPoses: KeyPoseFrame[]
  createdAt: number
}

export interface ExerciseComparison {
  exerciseId: string
  userPoses: Pose[]
  similarities: number[]
  feedback: string[]
  createdAt: number
}

function getExercises(): Exercise[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

function saveExercises(exercises: Exercise[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises))
}

export function createExercise(name: string, description: string): Exercise {
  const exercise: Exercise = {
    id: Date.now().toString(),
    name,
    description,
    keyPoses: [],
    createdAt: Date.now(),
  }

  const exercises = getExercises()
  exercises.push(exercise)
  saveExercises(exercises)

  return exercise
}

export function addKeyPose(exerciseId: string, poseName: string, pose: Pose, description?: string) {
  const exercises = getExercises()
  const exercise = exercises.find((e) => e.id === exerciseId)

  if (exercise) {
    exercise.keyPoses.push({
      name: poseName,
      pose,
      description,
    })
    saveExercises(exercises)
  }
}

export function getExercise(id: string): Exercise | undefined {
  return getExercises().find((e) => e.id === id)
}

export function getAllExercises(): Exercise[] {
  return getExercises()
}

export function deleteExercise(id: string) {
  const exercises = getExercises().filter((e) => e.id !== id)
  saveExercises(exercises)
}
