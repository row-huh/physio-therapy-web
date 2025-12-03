"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { getAllExercises, deleteExercise, type ExerciseVideo } from "@/lib/storage"

export default function Home() {
  const [exercises, setExercises] = useState<ExerciseVideo[]>([])
  const [step, setStep] = useState<"list" | "create">("list")
  const [exerciseName, setExerciseName] = useState("")

  useEffect(() => {
    setExercises(getAllExercises())
  }, [])

  const handleCreateNew = () => {
    setStep("create")
    setExerciseName("")
  }

  const handleDeleteExercise = async (id: string) => {
    await deleteExercise(id)
    setExercises(getAllExercises())
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        {step === "list" && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-4xl font-bold">Exercise Tracker</h1>
              <p className="text-muted-foreground">Record exercise videos and compare your form</p>
            </div>

            <Button onClick={handleCreateNew} size="lg" className="w-full">
              Record New Exercise
            </Button>

            {exercises.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No exercises recorded yet</p>
                <p className="text-sm text-muted-foreground">Start by recording your first exercise video</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {exercises.map((exercise) => (
                  <Card key={exercise.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{exercise.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(exercise.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/compare/${exercise.id}`}>
                        <Button size="sm" variant="secondary">
                          Compare
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteExercise(exercise.id)}>
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {step === "create" && (
          <Link href="/record">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Record Exercise</h1>
                <p className="text-muted-foreground">Give your exercise a name and record the video</p>
              </div>

              <Card className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Exercise Name</label>
                  <Input
                    placeholder="e.g., Squat, Push-up, Deadlift"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    autoFocus
                  />
                </div>

                <Button
                  onClick={() => {
                    if (exerciseName.trim()) {
                      // Name is ready, navigate to record page
                      setStep("list")
                    }
                  }}
                  disabled={!exerciseName.trim()}
                  className="w-full"
                >
                  Continue
                </Button>

                <Button variant="outline" onClick={() => setStep("list")} className="w-full">
                  Cancel
                </Button>
              </Card>
            </div>
          </Link>
        )}
      </div>
    </main>
  )
}
