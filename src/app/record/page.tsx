"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SimpleRecorder } from "@/components/simple-recorder"
import { VideoAnalysisPlayer } from "@/components/video-analysis-player"
import { LearnedTemplateView } from "@/components/learned-template-view"
import { saveExerciseVideo } from "@/lib/storage"
import { saveTemplate } from "@/lib/template-storage"
import { analyzeVideoForPose, type PoseAnalysisResult } from "@/lib/pose-analyzer"
import { EXERCISE_CONFIGS, getExerciseConfig } from "@/lib/exercise-config"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"


export default function RecordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<"input" | "recording" | "complete">(
    searchParams.get("name") ? "recording" : "input",
  )
  const [exerciseName, setExerciseName] = useState(searchParams.get("name") || "")
  const [exerciseType, setExerciseType] = useState(searchParams.get("type") || "knee-extension")
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<PoseAnalysisResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setRecordedBlob(file)
      setStep("complete")
    } else {
      alert("Please upload a valid video file")
    }
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
        
        // Get angles of interest for the selected exercise type
        // for knee exercises, the only angles of interest are legs so you skip calculation for all the other angles to save compute tiem
        const exerciseConfig = getExerciseConfig(exerciseType)
        const anglesOfInterest = exerciseConfig?.anglesOfInterest
        
        console.log(`Analyzing for exercise: ${exerciseConfig?.name}`)
        console.log(`Angles of interest:`, anglesOfInterest)
        
        // Pass exercise info for state learning
        // state learning works with k means clustering to group some specific angles in states
        const exerciseInfo = {
          name: exerciseName.trim() || exerciseConfig?.name || "exercise",
          type: exerciseType,
        }
        
        const result = await analyzeVideoForPose(
          recordedBlob, 
          anglesOfInterest,
          exerciseInfo
        )
        setAnalysisResult(result)
        
        console.log("Analysis complete!")
        console.log("Joint Angles:", result.jointAngles)
        console.log("Movements:", result.movements)
        console.log("Summary:\n", result.summary)
        
        if (result.learnedTemplate) {
          console.log("Learned Template:", result.learnedTemplate)
        }
        
        const videoName = exerciseName.trim() || exerciseConfig?.name || "exercise"
        await saveExerciseVideo(videoName, recordedBlob, exerciseType, result.learnedTemplate)
        
        console.log("Video saved successfully!")
        
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
                  <strong>Tracked angles:</strong>{" "}
                  {getExerciseConfig(exerciseType)
                    ?.anglesOfInterest.map((a: string) => a.replace("_", " "))
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

        {step === "recording" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {exerciseName || getExerciseConfig(exerciseType)?.name}
              </h1>
              <p className="text-muted-foreground">Record or upload your exercise video</p>
              <div className="mt-2 text-sm bg-muted p-3 rounded-lg">
                <strong>Tracking:</strong>{" "}
                {getExerciseConfig(exerciseType)
                  ?.anglesOfInterest.map((a) => a.replace("_", " ").toUpperCase())
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
                      ?.anglesOfInterest.map((a) => a.replace("_", " "))
                      .join(", ")}
                  </p>
                </Card>

                {/* Video Analysis Player */}
                <VideoAnalysisPlayer
                  videoBlob={recordedBlob}
                  movements={analysisResult.movements}
                  anglesOfInterest={getExerciseConfig(exerciseType)?.anglesOfInterest}
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
                    Angle Data ({analysisResult.jointAngles.length} measurements)
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    All angle measurements captured throughout the video
                  </p>
                  
                  {/* Group angles by joint/segment */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {(() => {
                      // Group joint angles by joint name
                      const groupedAngles = analysisResult.jointAngles.reduce((acc, ja) => {
                        if (!acc[ja.joint]) {
                          acc[ja.joint] = []
                        }
                        acc[ja.joint].push(ja)
                        return acc
                      }, {} as Record<string, typeof analysisResult.jointAngles>)
                      
                      return Object.entries(groupedAngles).map(([joint, angles]) => {
                        // Calculate statistics
                        const values = angles.map(a => a.angle)
                        const min = Math.min(...values)
                        const max = Math.max(...values)
                        const avg = values.reduce((sum, v) => sum + v, 0) / values.length
                        
                        return (
                          <div key={joint} className="p-4 bg-muted rounded border-l-4 border-blue-500">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-base">
                                {joint.replace("_segment", "").replace("_", " ").toUpperCase()}
                              </h4>
                              <span className="text-xs text-muted-foreground">
                                {angles.length} points
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-xs text-muted-foreground">Min</div>
                                <div className="font-semibold text-lg">{min.toFixed(1)}°</div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Avg</div>
                                <div className="font-semibold text-lg">{avg.toFixed(1)}°</div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Max</div>
                                <div className="font-semibold text-lg">{max.toFixed(1)}°</div>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <div className="text-xs text-muted-foreground mb-1">Range of Motion</div>
                              <div className="w-full bg-background rounded-full h-2 relative overflow-hidden">
                                <div 
                                  className="absolute h-full bg-blue-500 rounded-full"
                                  style={{
                                    left: `${(min / 180) * 100}%`,
                                    width: `${((max - min) / 180) * 100}%`
                                  }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>0°</span>
                                <span>{(max - min).toFixed(1)}° range</span>
                                <span>180°</span>
                              </div>
                            </div>
                            
                            {/* Show first, middle, and last values as samples */}
                            <details className="mt-3">
                              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                                Show sample values
                              </summary>
                              <div className="mt-2 space-y-1 text-xs">
                                {[0, Math.floor(angles.length / 2), angles.length - 1].map((idx) => (
                                  <div key={idx} className="flex justify-between">
                                    <span>Time: {angles[idx].timestamp.toFixed(2)}s</span>
                                    <span className="font-mono">{angles[idx].angle.toFixed(1)}°</span>
                                  </div>
                                ))}
                              </div>
                            </details>
                          </div>
                        )
                      })
                    })()}
                  </div>
                </Card>

                {/* Learned Template Display */}
                {analysisResult.learnedTemplate && (
                  <LearnedTemplateView 
                    template={analysisResult.learnedTemplate}
                    onSaveTemplate={() => {
                      const templateId = saveTemplate(analysisResult.learnedTemplate!, recordedBlob)
                      console.log("Saved template with ID:", templateId)
                      alert(`✅ Template saved! You can now use "${analysisResult.learnedTemplate!.exerciseName}" as a reference for comparisons.`)
                    }}
                  />
                )}

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
      </div>
    </main>
  )
}