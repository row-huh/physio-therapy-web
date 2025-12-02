"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getAllExercises } from "@/lib/storage"
import Link from "next/link"
import { Play, Video, ArrowLeft } from "lucide-react"
import LiveComparison from "@/components/live-comparison"

export default function ComparePage() {
  const [exercises, setExercises] = useState<any[]>([])
  const [selectedExercise, setSelectedExercise] = useState<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    console.log("🔍 Loading exercises for comparison...")
    const loadedExercises = getAllExercises()
    console.log("📊 Loaded exercises:", loadedExercises)
    setExercises(loadedExercises)
  }, [])

  const handleSelectExercise = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId)
    console.log("🎯 Selected exercise:", exercise)
    if (exercise) {
      setSelectedExercise(exercise)
    }
  }

  const handleBack = () => {
    setSelectedExercise(null)
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {!selectedExercise ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Compare Your Exercise</h1>
              <p className="text-muted-foreground">
                Select a reference exercise to compare against your live performance
              </p>
            </div>

            {exercises.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No reference exercises recorded yet</p>
                <Link href="/record">
                  <Button>
                    <Video className="w-4 h-4 mr-2" />
                    Record Reference Exercise
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid gap-3">
                {exercises.map((exercise) => (
                  <Card
                    key={exercise.id}
                    className="p-4 cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleSelectExercise(exercise.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{exercise.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exercise.type.replace("-", " ")} • Recorded{" "}
                          {new Date(exercise.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="secondary" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Compare
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Comparing: {selectedExercise.name}</h1>
                <p className="text-muted-foreground">
                  Reference video will loop - perform the exercise to compare
                </p>
              </div>
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Reference Video */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Reference Video</h3>
                <div className="relative aspect-video bg-black rounded overflow-hidden">
                  <video
                    ref={videoRef}
                    src={selectedExercise.videoUrl}
                    className="w-full h-full object-contain"
                    loop
                    autoPlay
                    muted
                  />
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  <p>Looping reference video</p>
                </div>
              </Card>

              {/* Live Webcam */}
              <LiveComparison exerciseId={selectedExercise.type} />
            </div>

            {/* Comparison Info */}
            <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold mb-2">How to Compare</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Watch the reference video on the left</li>
                <li>• Perform the same exercise in front of your webcam</li>
                <li>• Real-time angles and state will show on the right</li>
                <li>• Rep counter will track correct/incorrect reps</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
