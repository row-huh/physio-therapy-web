"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { VideoRecorder } from "@/components/video-recorder"
import { SimpleRecorder } from "@/components/simple-recorder"
import { VideoAnalysisPlayer } from "@/components/video-analysis-player"
import { createExercise, addKeyPose, type Exercise } from "@/lib/pose-store"
import { saveExerciseVideo } from "@/lib/storage"
import type { Pose } from "@/lib/pose-utils"
import { analyzeVideoForPose, type PoseAnalysisResult } from "@/lib/pose-analyzer"
import { EXERCISE_CONFIGS, getExerciseConfig } from "@/lib/exercise-config"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function RecordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<"input" | "recording" | "complete" | "setup">(
    searchParams.get("name") ? "recording" : "input",
  )
  const [exerciseName, setExerciseName] = useState(searchParams.get("name") || "")
  const [exerciseType, setExerciseType] = useState(searchParams.get("type") || "knee-extension")
  const [exerciseDesc, setExerciseDesc] = useState("")
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [capturedPoses, setCapturedPoses] = useState<{ name: string; pose: Pose }[]>([])
  const [poseName, setPoseName] = useState("")
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<PoseAnalysisResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCreateExercise = () => {
    if (exerciseName.trim()) {
      const newExercise = createExercise(exerciseName, exerciseDesc)
      setExercise(newExercise)
      setStep("recording")
    }
  }

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setRecordedBlob(file)
      setStep("complete")
    } else {
      alert("Please upload a valid video file")
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

  const handleSave = async () => {
    if (recordedBlob) {
      setIsAnalyzing(true)
      
      try {
        console.log("Starting video analysis...")
        
        // Get joints of interest for the selected exercise type
        const exerciseConfig = getExerciseConfig(exerciseType)
        const jointsOfInterest = exerciseConfig?.jointsOfInterest
        
        console.log(`Analyzing for exercise: ${exerciseConfig?.name}`)
        console.log(`Joints of interest:`, jointsOfInterest)
        
        const result = await analyzeVideoForPose(recordedBlob, jointsOfInterest)
        setAnalysisResult(result)
        
        console.log("Analysis complete!")
        console.log("Joint Angles:", result.jointAngles)
        console.log("Movements:", result.movements)
        console.log("Summary:\n", result.summary)
        
        // Save the video with exercise type as name if no custom name provided
        const videoName = exerciseName.trim() || exerciseConfig?.name || "exercise"
        saveExerciseVideo(videoName, recordedBlob)
        
        // Analysis is complete, stay on this page to show results
      } catch (error) {
        console.error("Error analyzing video:", error)
        alert(`Error analyzing video: ${error instanceof Error ? error.message : "Unknown error"}`)
      } finally {
        setIsAnalyzing(false)
      }
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
              <p className="text-muted-foreground">Select exercise type and record video</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Exercise Type</label>
                <select
                  value={exerciseType}
                  onChange={(e) => setExerciseType(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {EXERCISE_CONFIGS.map((config) => (
                    <option key={config.id} value={config.id}>
                      {config.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  {getExerciseConfig(exerciseType)?.description}
                </p>
                <div className="text-xs text-muted-foreground mt-2">
                  <strong>Tracked joints:</strong>{" "}
                  {getExerciseConfig(exerciseType)
                    ?.jointsOfInterest.map((j) => j.replace("_", " "))
                    .join(", ")}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Exercise Name (Optional)</label>
                <Input
                  placeholder="e.g., Morning knee extension"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={() => setStep("recording")} className="w-full">
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
              <h1 className="text-3xl font-bold mb-2">
                {exerciseName || getExerciseConfig(exerciseType)?.name}
              </h1>
              <p className="text-muted-foreground">Record or upload your exercise video</p>
              <div className="mt-2 text-sm bg-muted p-3 rounded-lg">
                <strong>Tracking:</strong>{" "}
                {getExerciseConfig(exerciseType)
                  ?.jointsOfInterest.map((j) => j.replace("_", " ").toUpperCase())
                  .join(", ")}
              </div>
            </div>

            <SimpleRecorder onRecordComplete={handleRecordComplete} />

            {recordedBlob && (
              <Button onClick={() => setStep("complete")} className="w-full">
                Done Recording
              </Button>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                Upload Video File
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Upload a pre-recorded video for analysis
              </p>
            </div>
          </div>
        )}

        {step === "complete" && recordedBlob && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {isAnalyzing ? "Analyzing Video..." : analysisResult ? "Analysis Complete" : "Save Exercise"}
              </h1>
              <p className="text-muted-foreground">
                {isAnalyzing
                  ? "Processing your exercise with MediaPipe..."
                  : analysisResult
                    ? "Joint movement analysis results"
                    : "Your video has been recorded"}
              </p>
            </div>

            {isAnalyzing && (
              <Card className="p-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">
                    Detecting pose landmarks and calculating joint angles...
                  </p>
                </div>
              </Card>
            )}

            {!isAnalyzing && !analysisResult && (
              <Button onClick={handleSave} className="w-full">
                Analyze & Save Exercise
              </Button>
            )}

            {analysisResult && (
              <div className="space-y-4">
                <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold mb-2">
                    {getExerciseConfig(exerciseType)?.name} Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Analyzed joints: {getExerciseConfig(exerciseType)
                      ?.jointsOfInterest.map((j) => j.replace("_", " "))
                      .join(", ")}
                  </p>
                </Card>

                {/* Video Analysis Player */}
                <VideoAnalysisPlayer
                  videoBlob={recordedBlob}
                  movements={analysisResult.movements}
                  jointsOfInterest={getExerciseConfig(exerciseType)?.jointsOfInterest}
                />

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Movement Summary</h3>
                  <pre className="text-xs whitespace-pre-wrap bg-muted p-4 rounded overflow-x-auto">
                    {analysisResult.summary}
                  </pre>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Detected Movements ({analysisResult.movements.length})</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {analysisResult.movements.map((movement, idx) => (
                      <div key={idx} className="p-4 bg-muted rounded text-sm border-l-4 border-primary">
                        <div className="font-medium text-base">
                          {movement.joint.replace("_segment", "").replace("_", " ").toUpperCase()}
                        </div>
                        <div className="text-lg font-bold text-primary mt-1">
                          {movement.angleDelta > 0 ? "↗" : "↘"} {Math.abs(movement.angleDelta).toFixed(1)}° change
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {movement.startAngle.toFixed(1)}° → {movement.endAngle.toFixed(1)}°
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Time: {movement.startTime.toFixed(1)}s - {movement.endTime.toFixed(1)}s (
                          {movement.duration.toFixed(1)}s)
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">
                    Joint Angle Data Points ({analysisResult.jointAngles.length})
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Total angle measurements captured across tracked joints throughout the video
                  </p>
                </Card>

                <Button
                  onClick={() => {
                    router.push("/")
                  }}
                  className="w-full"
                >
                  Go to Home
                </Button>
              </div>
            )}

            {!isAnalyzing && !analysisResult && (
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
            )}
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
