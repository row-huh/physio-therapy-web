"use client"

import { useState, useRef, useEffect } from "react"
import { PoseLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { VideoAnalysisPlayer } from "@/components/video-analysis-player"
import { LearnedTemplateView } from "@/components/learned-template-view"
import { uploadVideoToStorage } from "@/lib/storage"
import { supabase } from "@/utils/supabase/client"
import { analyzeVideoForPose, type PoseAnalysisResult } from "@/lib/pose-analyzer"
import { EXERCISE_CONFIGS, getExerciseConfig } from "@/lib/exercise-config"
import type { PoseV2Template } from "@/lib/template-learner"
import { Switch } from "@/components/ui/switch"
import { formatAngleName } from "@/lib/utils"
import { OneEuroFilter } from "@/lib/filters"
import {
  POSE_CONNECTIONS,
  calculateAllAngles,
  visibilityForAngles,
} from "@/lib/pose-angles"
import { RecordingCoach, type CoachState } from "@/lib/recording-coach"




interface RecordExerciseProps {
  defaultName?: string
  defaultType?: string
  patientId?: string
  onComplete?: () => void
  doneLabel?: string
}




export function RecordExercise({
  defaultName = "",
  defaultType = "knee-extension",
  patientId,
  onComplete,
  doneLabel = "Back to Dashboard",
}: RecordExerciseProps) {
  const [step, setStep] = useState<"input" | "recording" | "complete">(
    defaultName ? "recording" : "input",
  )



  const [exerciseName, setExerciseName] = useState(defaultName)
  const [exerciseType, setExerciseType] = useState(defaultType)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [allowProgression, setAllowProgression] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<PoseAnalysisResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)


  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const [recording, setRecording] = useState(false)
  const [hasVideo, setHasVideo] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)

  // ── Live MediaPipe overlay + recording coach ─────────────────────────────
  const poseRef = useRef<PoseLandmarker | null>(null)
  const rafRef = useRef<number | null>(null)
  const angleFiltersRef = useRef<Map<string, OneEuroFilter>>(new Map())
  const coachRef = useRef<RecordingCoach | null>(null)
  // Only count toward the "smart hints" while actually recording.
  const isRecordingRef = useRef(false)
  // Guards the one-shot auto-stop once enough reps are captured.
  const autoStopRef = useRef(false)

  const trackedAngles = getExerciseConfig(exerciseType)?.anglesOfInterest ?? []

  const [liveAngles, setLiveAngles] = useState<Record<string, number>>({})
  const [coach, setCoach] = useState<CoachState | null>(null)

  const smoothLiveAngles = (
    raw: Record<string, number>,
    timestamp: number,
  ): Record<string, number> => {
    const smoothed: Record<string, number> = {}
    for (const [name, value] of Object.entries(raw)) {
      let filter = angleFiltersRef.current.get(name)
      if (!filter) {
        filter = new OneEuroFilter(1.0, 0.007)
        angleFiltersRef.current.set(name, filter)
      }
      smoothed[name] = filter.filter(value, timestamp)
    }
    return smoothed
  }

  const initPose = async () => {
    if (poseRef.current) return
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm",
    )
    poseRef.current = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
      outputSegmentationMasks: false,
    })
  }

  const startPoseLoop = () => {
    if (!videoRef.current || !canvasRef.current || !poseRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    const drawer = new DrawingUtils(ctx)

    const render = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      const pose = poseRef.current
      if (!video || !canvas || !pose) return

      if (
        canvas.width !== video.videoWidth ||
        canvas.height !== video.videoHeight
      ) {
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const ts = performance.now()
      const result = pose.detectForVideo(video, ts)

      if (result.landmarks && result.landmarks.length > 0) {
        const landmarks = result.landmarks[0]
        const smoothed = smoothLiveAngles(calculateAllAngles(landmarks), ts / 1000)
        setLiveAngles(smoothed)

        // Drive the smart hints only while we're capturing the reference.
        if (isRecordingRef.current && coachRef.current) {
          const visibility = visibilityForAngles(landmarks, trackedAngles)
          const state = coachRef.current.update(smoothed, visibility, ts / 1000)
          setCoach(state)
          // Once we've captured enough clean reps, finish the take automatically
          // (small delay so the final rep settles and the doctor sees the ✓).
          if (state.status === "enough" && !autoStopRef.current) {
            autoStopRef.current = true
            setTimeout(() => stopRecording(), 1200)
          }
        }

        drawer.drawConnectors(landmarks, POSE_CONNECTIONS, {
          color: "#22c55e",
          lineWidth: 6,
        })
        drawer.drawLandmarks(landmarks, {
          radius: 5,
          fillColor: "#22c55e",
          color: "#16a34a",
          lineWidth: 2,
        })
      }

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)
  }

  const stopPoseLoop = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }




  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
        setHasVideo(true)
        await initPose()
        startPoseLoop()
      }
    } catch (err) {
      console.error("Error accessing webcam:", err)
      alert("Unable to access camera. Please check permissions and try again.")
    }
  }

  const stopWebcam = () => {
    stopPoseLoop()
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setHasVideo(false)
    setCoach(null)
    setLiveAngles({})
  }

  // "Start Recording" runs a 3-2-1 countdown, then begins capture so the
  // doctor has time to get into position before the reference clip starts.
  const beginCountdownAndRecord = async () => {
    if (!streamRef.current || countdown !== null || recording) return
    for (let n = 3; n >= 1; n--) {
      setCountdown(n)
      await new Promise((r) => setTimeout(r, 1000))
    }
    setCountdown(null)
    startRecording()
  }

  const startRecording = () => {
    if (!streamRef.current) return

    // Fresh coach for this take, counting only the recorded portion.
    coachRef.current = new RecordingCoach(
      trackedAngles,
      getExerciseConfig(exerciseType)?.minAmplitudeDegrees ?? 15,
    )
    autoStopRef.current = false
    setCoach(null)

    chunksRef.current = []
    mediaRecorderRef.current = new MediaRecorder(streamRef.current)

    mediaRecorderRef.current.ondataavailable = (e) => {
      chunksRef.current.push(e.data)
    }

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" })
      handleRecordComplete(blob)
    }

    mediaRecorderRef.current.start()
    isRecordingRef.current = true
    setRecording(true)
  }

  const stopRecording = () => {
    // Guard against a double stop (e.g. the auto-stop timer firing after a
    // manual stop) — stopping an inactive recorder throws.
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
      isRecordingRef.current = false
      setRecording(false)
    }
  }

  // Tear down the camera + pose model when leaving the recording step.
  useEffect(() => {
    return () => {
      stopPoseLoop()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
      if (poseRef.current) {
        poseRef.current.close()
        poseRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    stopWebcam()
    setRecordedBlob(videoBlob)
    setStep("complete")
  }

  const handleSave = async () => {
    if (recordedBlob) {
      setIsAnalyzing(true)

      try {
        const exerciseConfig = getExerciseConfig(exerciseType)
        const anglesOfInterest = exerciseConfig?.anglesOfInterest

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

        const videoName = exerciseName.trim() || exerciseConfig?.name || "exercise"


        if (!patientId) {
          throw new Error("No patient selected. Please select a patient first.")
        }

        const { videoUrl, videoPath } = await uploadVideoToStorage(videoName, recordedBlob, exerciseType)

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) throw new Error("Session expired. Please log in again.")

        const res = await fetch("/api/exercises/assign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            patient_id: patientId,
            name: videoName,
            exercise_type: exerciseType,
            video_path: videoPath,
            video_url: videoUrl,
            template: result.learnedTemplate,
            allow_progression: allowProgression,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to assign exercise")
        }

      } catch (error) {
        console.error("Error analyzing video:", error)
        alert(`Error analyzing video: ${error instanceof Error ? error.message : "Unknown error"}`)
      } finally {
        setIsAnalyzing(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      {step === "input" && (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Record Exercise</h1>
            <p className="text-muted-foreground">Select exercise type and record video</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Joint Group</label>
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
                  ?.anglesOfInterest.map(formatAngleName)
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

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label htmlFor="allow-progression" className="text-sm font-medium">
                  Allow progression
                </label>
                <p className="text-xs text-muted-foreground">
                  Patient can progress beyond this reference toward the ideal range of motion
                </p>
              </div>
              <Switch
                id="allow-progression"
                checked={allowProgression}
                onCheckedChange={setAllowProgression}
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
                ?.anglesOfInterest.map((a) => formatAngleName(a).toUpperCase())
                .join(", ")}
            </div>
          </div>

          {!hasVideo && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Before you record
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc pl-5">
                <li>Stand back so your <strong>whole body</strong> stays in frame.</li>
                <li>Use a well-lit area with a plain background.</li>
                <li>Face the camera side-on if the movement is clearer in profile.</li>
                <li>Perform the exercise <strong>slowly</strong> through the full range of motion.</li>
                <li>Do at least <strong>3 clear repetitions</strong> so the engine can learn the pattern.</li>
              </ul>
            </div>
          )}

          <Card className="p-6 space-y-4">
            <div className="relative w-full bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto"
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
              />

              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-white text-8xl font-bold animate-pulse">
                    {countdown}
                  </div>
                </div>
              )}

              {/* Recording indicator */}
              {recording && (
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/70 rounded-full px-3 py-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-semibold text-white">REC</span>
                </div>
              )}

              {/* Smart coaching hint */}
              {recording && coach && (
                <div className="absolute bottom-3 left-3 right-3">
                  <div
                    className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-sm ${
                      coach.status === "enough"
                        ? "bg-green-600/90"
                        : coach.status === "keep-going" || coach.status === "no-reps"
                          ? "bg-yellow-600/90"
                          : "bg-red-600/90"
                    }`}
                  >
                    {coach.message}
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full bg-green-400 transition-all"
                      style={{ width: `${Math.round(coach.progress * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Live angle readout while streaming */}
              {hasVideo && trackedAngles.length > 0 && (
                <div className="absolute top-3 right-3 bg-black/70 rounded-lg px-3 py-2 text-right">
                  {trackedAngles
                    .filter((a) => liveAngles[a] !== undefined)
                    .slice(0, 4)
                    .map((a) => (
                      <div key={a} className="text-[11px] text-cyan-300">
                        {formatAngleName(a)}:{" "}
                        <span className="font-bold text-white">
                          {Math.round(liveAngles[a])}°
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {!hasVideo ? (
                <Button onClick={startWebcam} className="flex-1">
                  Start Webcam
                </Button>
              ) : (
                <>
                  <Button
                    onClick={stopWebcam}
                    variant="outline"
                    className="flex-1 bg-transparent"
                    disabled={recording || countdown !== null}
                  >
                    Stop Webcam
                  </Button>

                  {!recording ? (
                    <Button
                      onClick={beginCountdownAndRecord}
                      disabled={countdown !== null}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      {countdown !== null ? `Starting in ${countdown}…` : "Start Recording"}
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} variant="secondary" className="flex-1">
                      Stop Recording
                    </Button>
                  )}
                </>
              )}
            </div>
          </Card>

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
                    ?.anglesOfInterest.map(formatAngleName)
                    .join(", ")}
                </p>
              </Card>

              <VideoAnalysisPlayer
                videoBlob={recordedBlob}
                movements={analysisResult.movements}
                anglesOfInterest={getExerciseConfig(exerciseType)?.anglesOfInterest}
              />

              {analysisResult.learnedTemplate && (
                <LearnedTemplateView
                  template={analysisResult.learnedTemplate}
                />
              )}

              <Button
                onClick={() => onComplete?.()}
                className="w-full"
              >
                {doneLabel}
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
  )
}
