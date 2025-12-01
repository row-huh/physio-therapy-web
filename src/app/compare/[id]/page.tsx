"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SimpleRecorder } from "@/components/simple-recorder"
import { getExercise } from "@/lib/storage"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function ComparePage() {
  const params = useParams()
  const [exercise, setExercise] = useState<any>(null)
  const [showWebcam, setShowWebcam] = useState(false)

  useEffect(() => {
    const ex = getExercise(params.id as string)
    if (ex) {
      setExercise(ex)
    }
  }, [params.id])

  if (!exercise) {
    return (
      <main className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Exercise not found</p>
            <Link href="/">
              <Button className="mt-4">Back Home</Button>
            </Link>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link href="/">
          <Button variant="outline">Back</Button>
        </Link>

        <div>
          <h1 className="text-3xl font-bold mb-2">Compare - {exercise.name}</h1>
          <p className="text-muted-foreground">Open your webcam to compare your form</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Reference Video */}
          <div className="space-y-3">
            <h2 className="font-semibold">Reference Video</h2>
            <Card className="p-4 bg-muted aspect-video flex items-center justify-center rounded-lg">
              <video src={exercise.videoBlob} controls className="w-full h-full object-contain rounded" />
            </Card>
          </div>

          {/* Webcam */}
          <div className="space-y-3">
            <h2 className="font-semibold">Your Webcam</h2>
            {!showWebcam ? (
              <Card className="p-4 bg-muted aspect-video flex items-center justify-center rounded-lg">
                <Button onClick={() => setShowWebcam(true)}>Open Webcam</Button>
              </Card>
            ) : (
              <SimpleRecorder onRecordComplete={() => {}} />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
