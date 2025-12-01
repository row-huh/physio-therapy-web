"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { VideoRecorder } from "@/components/video-recorder"
import { SimpleRecorder } from "@/components/simple-recorder"
import { createExercise, addKeyPose, type Exercise } from "@/lib/pose-store"
import { saveExerciseVideo } from "@/lib/storage"
import type { Pose } from "@/lib/pose-utils"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function RecordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<"input" | "recording" | "complete" | "setup">(
    searchParams.get("name") ? "recording" : "input",
  )
  const [exerciseName, setExerciseName] = useState(searchParams.get("name") || "")
  const [exerciseDesc, setExerciseDesc] = useState("")
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [capturedPoses, setCapturedPoses] = useState<{ name: string; pose: Pose }[]>([])
  const [poseName, setPoseName] = useState("")
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)

  const handleCreateExercise = () => {
    if (exerciseName.trim()) {
      const newExercise = createExercise(exerciseName, exerciseDesc)
      setExercise(newExercise)
      setStep("recording")
    }
  }

  const handlePoseCaptured = (pose: Pose) => {
    if (poseName.trim()) {
      addKeyPose(exercise!.id, poseName, pose)
      setCapturedPoses([...capturedPoses, { name: poseName, pose }])
      setPoseName("")
    }
  }

  const handleComplete = () => {
    setStep("complete")
  }

  const handleRecordComplete = (videoBlob: Blob) => {
    setRecordedBlob(videoBlob)
    setStep("complete")
  }

  const handleSave = () => {
    if (exerciseName.trim() && recordedBlob) {
      saveExerciseVideo(exerciseName, recordedBlob)
      router.push("/")
    }
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/">
          <Button variant="outline">Back</Button>
        </Link>

        {step === "input" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Record Exercise</h1>
              <p className="text-muted-foreground">Enter exercise name and record video</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Exercise Name</label>
              <Input
                placeholder="e.g., Squat, Push-up"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
              />
            </div>

            <Button onClick={() => setStep("recording")} disabled={!exerciseName.trim()} className="w-full">
              Start Recording
            </Button>
          </div>
        )}

        {step === "setup" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Create Exercise Reference</h1>
              <p className="text-muted-foreground">Set up an exercise with key poses for future comparisons</p>
            </div>

            <Card className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Exercise Name</label>
                <Input
                  placeholder="e.g., Squat"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description (optional)</label>
                <Input
                  placeholder="e.g., Bodyweight squat with full depth"
                  value={exerciseDesc}
                  onChange={(e) => setExerciseDesc(e.target.value)}
                />
              </div>

              <Button onClick={handleCreateExercise} disabled={!exerciseName.trim()} className="w-full">
                Start Recording Poses
              </Button>
            </Card>
          </div>
        )}

        {step === "recording" && exercise && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{exercise.name}</h1>
              <p className="text-muted-foreground">Capture the key positions for this exercise</p>
            </div>

            <VideoRecorder onPoseCaptured={handlePoseCaptured} />

            <Card className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Pose Name</label>
                <p className="text-xs text-muted-foreground mb-3">
                  Examples: Starting Position, Halfway Down, Full Squat
                </p>
                <Input
                  placeholder="Name this pose position"
                  value={poseName}
                  onChange={(e) => setPoseName(e.target.value)}
                />
              </div>
            </Card>

            {capturedPoses.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Captured Poses ({capturedPoses.length})</h3>
                <div className="space-y-2">
                  {capturedPoses.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded">
                      <span>{item.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {(item.pose.score * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setExerciseName("")
                  setExerciseDesc("")
                  setExercise(null)
                  setCapturedPoses([])
                  setStep("setup")
                }}
                className="flex-1"
              >
                Back
              </Button>
              <Button onClick={handleComplete} disabled={capturedPoses.length === 0} className="flex-1">
                Complete
              </Button>
            </div>
          </div>
        )}

        {step === "recording" && !exercise && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{exerciseName}</h1>
              <p className="text-muted-foreground">Record your exercise</p>
            </div>

            <SimpleRecorder onRecordComplete={handleRecordComplete} />

            {recordedBlob && (
              <Button onClick={() => setStep("complete")} className="w-full">
                Done Recording
              </Button>
            )}
          </div>
        )}

        {step === "complete" && recordedBlob && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Save Exercise</h1>
              <p className="text-muted-foreground">Your video has been recorded</p>
            </div>

            <Button onClick={handleSave} className="w-full">
              Save Exercise
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setRecordedBlob(null)
                setStep("recording")
              }}
              className="w-full"
            >
              Record Again
            </Button>
          </div>
        )}

        {step === "complete" && !recordedBlob && exercise && (
          <Card className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold">Reference Created!</h2>
            <p className="text-muted-foreground">
              {exercise?.name} with {capturedPoses.length} key pose{capturedPoses.length !== 1 ? "s" : ""} is ready
            </p>
            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Home
                </Button>
              </Link>
              <Link href="/compare" className="flex-1">
                <Button className="w-full">Compare Exercise</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}
