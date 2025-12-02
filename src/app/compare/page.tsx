"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getAllExercises } from "@/lib/pose-store"
import Link from "next/link"
import { Play, Video, ArrowLeft } from "lucide-react"

export default function ComparePage() {
  const [exercises, setExercises] = useState<any[]>([])
  const [selectedExercise, setSelectedExercise] = useState<any>(null)
  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const webcamRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setExercises(getAllExercises())
  }, [])

  useEffect(() => {
    if (isWebcamActive) {
      startWebcam()
    } else {
      stopWebcam()
    }
    
    return () => {
      stopWebcam()
    }
  }, [isWebcamActive])

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      })
      
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream
        webcamRef.current.play()
      }
    } catch (error) {
      console.error("Error accessing webcam:", error)
      alert("Could not access webcam. Please check permissions.")
    }
  }

  const stopWebcam = () => {
    if (webcamRef.current && webcamRef.current.srcObject) {
      const stream = webcamRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      webcamRef.current.srcObject = null
    }
  }

  const handleSelectExercise = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId)
    if (exercise) {
      setSelectedExercise(exercise)
      setIsWebcamActive(true)
    }
  }

  const handleBack = () => {
    setSelectedExercise(null)
    setIsWebcamActive(false)
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
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  />
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  <p>Looping reference video with pose overlay</p>
                </div>
              </Card>

              {/* Live Webcam */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Your Performance (Live)</h3>
                <div className="relative aspect-video bg-black rounded overflow-hidden">
                  {isWebcamActive ? (
                    <video
                      ref={webcamRef}
                      className="w-full h-full object-contain"
                      autoPlay
                      muted
                      playsInline
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <p>Webcam starting...</p>
                    </div>
                  )}
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  <p>Live webcam feed - pose detection coming soon</p>
                </div>
              </Card>
            </div>

            {/* Comparison Info */}
            <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold mb-2">How to Compare</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Watch the reference video on the left</li>
                <li>• Perform the same exercise in front of your webcam</li>
                <li>• Real-time angle comparison will show on both sides</li>
                <li>• Rep counting will track your progress</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
