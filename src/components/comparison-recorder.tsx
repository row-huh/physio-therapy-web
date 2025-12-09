"use client"

import { useRef, useState, useEffect } from "react"
import { PoseLandmarker, FilesetResolver, DrawingUtils, PoseLandmarkerResult } from "@mediapipe/tasks-vision"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ComparisonRecorderProps {
  onVideoRecorded?: (videoBlob: Blob) => void
  anglesOfInterest?: string[]
  exerciseName?: string
  enableTestMode?: boolean // doing dis to test it on uploaded videos (because why would i perform knee extensions every 3 secs like an idiot)
}

const POSE_LANDMARKS = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
}

class OneEuroFilter {
  private x_prev: number = 0
  private dx_prev: number = 0
  private t_prev: number = 0
  
  constructor(
    private min_cutoff: number = 1.0,
    private beta: number = 0.007,
    private d_cutoff: number = 1.0
  ) {}
  
  private smoothingFactor(t_e: number, cutoff: number): number {
    const r = 2 * Math.PI * cutoff * t_e
    return r / (r + 1)
  }
  
  private exponentialSmoothing(a: number, x: number, x_prev: number): number {
    return a * x + (1 - a) * x_prev
  }
  
  filter(x: number, t: number): number {
    const t_e = this.t_prev === 0 ? 0.016 : t - this.t_prev
    
    if (t_e === 0) {
      return x
    }
    
    const dx = (x - this.x_prev) / t_e
    const edx = this.exponentialSmoothing(
      this.smoothingFactor(t_e, this.d_cutoff),
      dx,
      this.dx_prev
    )
    
    const cutoff = this.min_cutoff + this.beta * Math.abs(edx)
    
    const x_filtered = this.exponentialSmoothing(
      this.smoothingFactor(t_e, cutoff),
      x,
      this.x_prev
    )
    
    this.x_prev = x_filtered
    this.dx_prev = edx
    this.t_prev = t
    
    return x_filtered
  }
  
  reset() {
    this.x_prev = 0
    this.dx_prev = 0
    this.t_prev = 0
  }
}

interface JointAngleData {
  [key: string]: number
}

export function ComparisonRecorder({ onVideoRecorded, anglesOfInterest, exerciseName, enableTestMode = false }: ComparisonRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const poseRef = useRef<PoseLandmarker | null>(null)
  const rafRef = useRef<number | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  

  const [currentAngles, setCurrentAngles] = useState<JointAngleData>({})
  const [repCount, setRepCount] = useState(0)
  const [currentState, setCurrentState] = useState<string>("")
  

  const [testMode, setTestMode] = useState(false)
  const [testVideoFile, setTestVideoFile] = useState<File | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  

  const angleFiltersRef = useRef<Map<string, OneEuroFilter>>(new Map())
  
  const angleHistoryRef = useRef<Array<{ timestamp: number; angles: JointAngleData }>>([])
  const lastStateRef = useRef<string>("")
  const hasVisitedPeakRef = useRef(false)

  const POSE_CONNECTIONS = [
    // Face
    { start: 0, end: 1 },   // nose to left eye inner
    { start: 1, end: 2 },   // left eye inner to left eye
    { start: 2, end: 3 },   // left eye to left eye outer
    { start: 3, end: 7 },   // left eye outer to left ear
    { start: 0, end: 4 },   // nose to right eye inner
    { start: 4, end: 5 },   // right eye inner to right eye
    { start: 5, end: 6 },   // right eye to right eye outer
    { start: 6, end: 8 },   // right eye outer to right ear
    { start: 9, end: 10 },  // mouth left to mouth right
    // Torso
    { start: 11, end: 12 }, // left shoulder to right shoulder
    { start: 11, end: 23 }, // left shoulder to left hip
    { start: 12, end: 24 }, // right shoulder to right hip
    { start: 23, end: 24 }, // left hip to right hip
    // Left arm
    { start: 11, end: 13 }, // left shoulder to left elbow
    { start: 13, end: 15 }, // left elbow to left wrist
    { start: 15, end: 17 }, // left wrist to left pinky
    { start: 15, end: 19 }, // left wrist to left index
    { start: 15, end: 21 }, // left wrist to left thumb
    { start: 17, end: 19 }, // left pinky to left index
    // Right arm
    { start: 12, end: 14 }, // right shoulder to right elbow
    { start: 14, end: 16 }, // right elbow to right wrist
    { start: 16, end: 18 }, // right wrist to right pinky
    { start: 16, end: 20 }, // right wrist to right index
    { start: 16, end: 22 }, // right wrist to right thumb
    { start: 18, end: 20 }, // right pinky to right index
    // Left leg
    { start: 23, end: 25 }, // left hip to left knee
    { start: 25, end: 27 }, // left knee to left ankle
    { start: 27, end: 29 }, // left ankle to left heel
    { start: 27, end: 31 }, // left ankle to left foot index
    { start: 29, end: 31 }, // left heel to left foot index
    // Right leg
    { start: 24, end: 26 }, // right hip to right knee
    { start: 26, end: 28 }, // right knee to right ankle
    { start: 28, end: 30 }, // right ankle to right heel
    { start: 28, end: 32 }, // right ankle to right foot index
    { start: 30, end: 32 }, // right heel to right foot index
  ]


  const calculateAngle = (a: number[], b: number[], c: number[]): number => {
    const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0])
    let angle = Math.abs((radians * 180.0) / Math.PI)
    if (angle > 180.0) {
      angle = 360.0 - angle
    }
    return angle
  }

  
  const calculateSegmentAngleFromVertical = (start: number[], end: number[]): number => {
    const dx = end[0] - start[0]
    const dy = end[1] - start[1]
    const radians = Math.atan2(dx, dy)
    const degrees = Math.abs((radians * 180.0) / Math.PI)
    return degrees
  }

  const calculateAllAngles = (landmarks: any[]): JointAngleData => {
    const angles: JointAngleData = {}
    const getLandmark = (index: number) => [landmarks[index].x, landmarks[index].y]
    
    try {
      angles.left_elbow = calculateAngle(
        getLandmark(POSE_LANDMARKS.LEFT_SHOULDER),
        getLandmark(POSE_LANDMARKS.LEFT_ELBOW),
        getLandmark(POSE_LANDMARKS.LEFT_WRIST)
      )
      
      angles.right_elbow = calculateAngle(
        getLandmark(POSE_LANDMARKS.RIGHT_SHOULDER),
        getLandmark(POSE_LANDMARKS.RIGHT_ELBOW),
        getLandmark(POSE_LANDMARKS.RIGHT_WRIST)
      )
      
      angles.left_knee = calculateAngle(
        getLandmark(POSE_LANDMARKS.LEFT_HIP),
        getLandmark(POSE_LANDMARKS.LEFT_KNEE),
        getLandmark(POSE_LANDMARKS.LEFT_ANKLE)
      )
      
      angles.right_knee = calculateAngle(
        getLandmark(POSE_LANDMARKS.RIGHT_HIP),
        getLandmark(POSE_LANDMARKS.RIGHT_KNEE),
        getLandmark(POSE_LANDMARKS.RIGHT_ANKLE)
      )
      
      angles.left_hip = calculateAngle(
        getLandmark(POSE_LANDMARKS.LEFT_SHOULDER),
        getLandmark(POSE_LANDMARKS.LEFT_HIP),
        getLandmark(POSE_LANDMARKS.LEFT_KNEE)
      )
      
      angles.right_hip = calculateAngle(
        getLandmark(POSE_LANDMARKS.RIGHT_SHOULDER),
        getLandmark(POSE_LANDMARKS.RIGHT_HIP),
        getLandmark(POSE_LANDMARKS.RIGHT_KNEE)
      )
      
      angles.left_leg_segment = calculateSegmentAngleFromVertical(
        getLandmark(POSE_LANDMARKS.LEFT_KNEE),
        getLandmark(POSE_LANDMARKS.LEFT_ANKLE)
      )
      
      angles.right_leg_segment = calculateSegmentAngleFromVertical(
        getLandmark(POSE_LANDMARKS.RIGHT_KNEE),
        getLandmark(POSE_LANDMARKS.RIGHT_ANKLE)
      )
      
      angles.left_thigh_segment = calculateSegmentAngleFromVertical(
        getLandmark(POSE_LANDMARKS.LEFT_HIP),
        getLandmark(POSE_LANDMARKS.LEFT_KNEE)
      )
      
      angles.right_thigh_segment = calculateSegmentAngleFromVertical(
        getLandmark(POSE_LANDMARKS.RIGHT_HIP),
        getLandmark(POSE_LANDMARKS.RIGHT_KNEE)
      )
    } catch (e) {
      console.warn("Error calculating some angles:", e)
    }
    
    return angles
  }

  const smoothAngles = (rawAngles: JointAngleData, timestamp: number): JointAngleData => {
    const smoothed: JointAngleData = {}
    
    Object.entries(rawAngles).forEach(([angleName, angleValue]) => {
      if (!angleFiltersRef.current.has(angleName)) {
        angleFiltersRef.current.set(angleName, new OneEuroFilter(1.0, 0.007))
      }
      
      const filter = angleFiltersRef.current.get(angleName)!
      smoothed[angleName] = filter.filter(angleValue, timestamp)
    })
    
    return smoothed
  }


  const determineExerciseState = (angles: JointAngleData): string => {
    if (!anglesOfInterest || anglesOfInterest.length === 0) return ""
    
    const primaryAngle = anglesOfInterest[0]
    const angle = angles[primaryAngle]
    
    if (angle === undefined) return ""
    
    // thresholds here are assumed - because it makes it easier to run state detection later on 
    // state detection then knows what to look for
    if (angle < 70) {
      return "flexed"
    } else if (angle > 150) {
      return "extended"
    } else {
      return "transition"
    }
  }


  const updateRepCount = (state: string) => {
    if (!state || state === "transition") return
    
    if (state === "extended") {
      hasVisitedPeakRef.current = true
    }
    
    if (state === "flexed" && hasVisitedPeakRef.current && lastStateRef.current === "extended") {
      setRepCount(prev => prev + 1)
      hasVisitedPeakRef.current = false
    }
    
    lastStateRef.current = state
  }

  const openWebcam = async () => {
    if (isStreaming || isLoading) return
    setIsLoading(true)
    setTestMode(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
        if (canvasRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth || 640
          canvasRef.current.height = videoRef.current.videoHeight || 480
        }
        await initPose()
        startPoseLoop()
      }
      setIsStreaming(true)
    } catch (e) {
      console.error("Failed to open webcam", e)
      alert("Unable to access camera. Please check permissions and try again.")
    } finally {
      setIsLoading(false)
    }
  }


  const handleTestVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !file.type.startsWith('video/')) {
      alert("Please select a valid video file")
      return
    }
    
    setIsLoading(true)
    setTestVideoFile(file)
    
    try {
      const videoUrl = URL.createObjectURL(file)
      if (videoRef.current) {
        videoRef.current.srcObject = null
        videoRef.current.src = videoUrl
        videoRef.current.loop = true
        
        await new Promise<void>((resolve) => {
          videoRef.current!.onloadedmetadata = () => {
            if (canvasRef.current && videoRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth
              canvasRef.current.height = videoRef.current.videoHeight
            }
            resolve()
          }
        })
        
        await initPose()
        setTestMode(true)
        setIsStreaming(true)
        
        // Start playing and processing
        await videoRef.current.play()
        setIsPlaying(true)
        startPoseLoop()
      }
    } catch (e) {
      console.error("Failed to load test video:", e)
      alert("Failed to load video file")
    } finally {
      setIsLoading(false)
    }
  }


  const togglePlayPause = () => {
    if (!videoRef.current || !testMode) return
    
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const resetTestVideo = () => {
    if (!videoRef.current || !testMode) return
    
    videoRef.current.currentTime = 0
    setRepCount(0)
    setCurrentState("")
    setCurrentAngles({})
    lastStateRef.current = ""
    hasVisitedPeakRef.current = false
    angleFiltersRef.current.clear()
    angleHistoryRef.current = []
  }

  // NEW: Stop test mode
  const stopTestMode = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.src = ""
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
    
    setTestMode(false)
    setIsStreaming(false)
    setIsPlaying(false)
    setTestVideoFile(null)
    setRepCount(0)
    setCurrentState("")
    setCurrentAngles({})
    lastStateRef.current = ""
    hasVisitedPeakRef.current = false
    angleFiltersRef.current.clear()
    angleHistoryRef.current = []
  }

  const initPose = async () => {
    try {
      if (poseRef.current) return
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm"
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
    } catch (err) {
      console.error("Failed to init MediaPipe Pose", err)
    }
  }

  const startPoseLoop = () => {
    if (!videoRef.current || !canvasRef.current || !poseRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    const drawer = new DrawingUtils(ctx)

    const render = () => {
      if (!videoRef.current || !poseRef.current || !canvasRef.current) return

      if (
        canvasRef.current.width !== videoRef.current.videoWidth ||
        canvasRef.current.height !== videoRef.current.videoHeight
      ) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
      }

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      const ts = performance.now()
      const result = poseRef.current.detectForVideo(videoRef.current, ts)
      
      if (result.landmarks && result.landmarks.length > 0) {
        const landmarks = result.landmarks[0]
        
        // Calculate all angles
        const rawAngles = calculateAllAngles(landmarks)
        const smoothedAngles = smoothAngles(rawAngles, ts / 1000)
        
        
        setCurrentAngles(smoothedAngles)
        
        
        angleHistoryRef.current.push({
          timestamp: ts / 1000,
          angles: smoothedAngles
        })
                const cutoffTime = (ts / 1000) - 10
        angleHistoryRef.current = angleHistoryRef.current.filter(
          h => h.timestamp > cutoffTime
        )
        
        const state = determineExerciseState(smoothedAngles)
        if (state) {
          setCurrentState(state)
          updateRepCount(state)
        }
        
        drawer.drawConnectors(landmarks, POSE_CONNECTIONS, {
          color: "#22c55e",
          lineWidth: 8,
        })
        
        drawer.drawLandmarks(landmarks, { 
          radius: 8, 
          fillColor: "#22c55e",
          color: "#16a34a",
          lineWidth: 3 
        })
        
        drawAngleAnnotations(ctx, landmarks, smoothedAngles)
      }

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)
  }

  const drawAngleAnnotations = (
    ctx: CanvasRenderingContext2D, 
    landmarks: any[], 
    angles: JointAngleData
  ) => {
    const width = canvasRef.current?.width || 640
    const height = canvasRef.current?.height || 480
    

    const shouldDisplay = (angleName: string) => {
      if (!anglesOfInterest || anglesOfInterest.length === 0) return true
      return anglesOfInterest.includes(angleName)
    }
    

    if (shouldDisplay("right_knee") && angles.right_knee !== undefined) {
      const knee = landmarks[POSE_LANDMARKS.RIGHT_KNEE]
      ctx.fillStyle = "#00ffff"
      ctx.font = "bold 20px Arial"
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 4
      const text = `${Math.round(angles.right_knee)}°`
      const x = knee.x * width + 15
      const y = knee.y * height - 10
      ctx.strokeText(text, x, y)
      ctx.fillText(text, x, y)
    }
    
    if (shouldDisplay("left_knee") && angles.left_knee !== undefined) {
      const knee = landmarks[POSE_LANDMARKS.LEFT_KNEE]
      ctx.fillStyle = "#00ffff"
      ctx.font = "bold 20px Arial"
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 4
      const text = `${Math.round(angles.left_knee)}°`
      const x = knee.x * width - 65
      const y = knee.y * height - 10
      ctx.strokeText(text, x, y)
      ctx.fillText(text, x, y)
    }
    

    if (shouldDisplay("right_elbow") && angles.right_elbow !== undefined) {
      const elbow = landmarks[POSE_LANDMARKS.RIGHT_ELBOW]
      ctx.fillStyle = "#ff00ff"
      ctx.font = "bold 18px Arial"
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 4
      const text = `${Math.round(angles.right_elbow)}°`
      const x = elbow.x * width + 12
      const y = elbow.y * height
      ctx.strokeText(text, x, y)
      ctx.fillText(text, x, y)
    }
    
    if (shouldDisplay("left_elbow") && angles.left_elbow !== undefined) {
      const elbow = landmarks[POSE_LANDMARKS.LEFT_ELBOW]
      ctx.fillStyle = "#ff00ff"
      ctx.font = "bold 18px Arial"
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 4
      const text = `${Math.round(angles.left_elbow)}°`
      const x = elbow.x * width - 60
      const y = elbow.y * height
      ctx.strokeText(text, x, y)
      ctx.fillText(text, x, y)
    }
    

    if (shouldDisplay("right_hip") && angles.right_hip !== undefined) {
      const hip = landmarks[POSE_LANDMARKS.RIGHT_HIP]
      ctx.fillStyle = "#ffaa00"
      ctx.font = "bold 18px Arial"
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 4
      const text = `${Math.round(angles.right_hip)}°`
      const x = hip.x * width + 12
      const y = hip.y * height + 5
      ctx.strokeText(text, x, y)
      ctx.fillText(text, x, y)
    }
    
    if (shouldDisplay("left_hip") && angles.left_hip !== undefined) {
      const hip = landmarks[POSE_LANDMARKS.LEFT_HIP]
      ctx.fillStyle = "#ffaa00"
      ctx.font = "bold 18px Arial"
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 4
      const text = `${Math.round(angles.left_hip)}°`
      const x = hip.x * width - 60
      const y = hip.y * height + 5
      ctx.strokeText(text, x, y)
      ctx.fillText(text, x, y)
    }
    

    if (shouldDisplay("right_leg_segment") && angles.right_leg_segment !== undefined) {
      const knee = landmarks[POSE_LANDMARKS.RIGHT_KNEE]
      ctx.fillStyle = "#ffffff"
      ctx.font = "14px Arial"
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 3
      const text = `seg: ${Math.round(angles.right_leg_segment)}°`
      const x = knee.x * width + 15
      const y = knee.y * height + 25
      ctx.strokeText(text, x, y)
      ctx.fillText(text, x, y)
    }
    
    if (shouldDisplay("left_leg_segment") && angles.left_leg_segment !== undefined) {
      const knee = landmarks[POSE_LANDMARKS.LEFT_KNEE]
      ctx.fillStyle = "#ffffff"
      ctx.font = "14px Arial"
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 3
      const text = `seg: ${Math.round(angles.left_leg_segment)}°`
      const x = knee.x * width - 80
      const y = knee.y * height + 25
      ctx.strokeText(text, x, y)
      ctx.fillText(text, x, y)
    }
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      if (poseRef.current) {
        poseRef.current.close()
        poseRef.current = null
      }
    }
  }, [])

  return (
    <Card className="p-6 space-y-4">
      <div className="flex gap-3">
        <Button onClick={openWebcam} disabled={isStreaming || isLoading} className="gap-2">
          {isLoading ? "Opening…" : "Open Webcam"}
        </Button>
        
        {enableTestMode && !isStreaming && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleTestVideoUpload}
              className="hidden"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={isLoading}
              variant="outline"
              className="gap-2"
            >
              {isLoading ? "Loading…" : "test with Video File"}
            </Button>
          </>
        )}
        {testMode && isStreaming && (
          <>
            <Button onClick={togglePlayPause} variant="outline">
              {isPlaying ? "Pause" : "▶ Play"}
            </Button>
            <Button onClick={resetTestVideo} variant="outline">
              Reset
            </Button>
            <Button onClick={stopTestMode} variant="destructive">
              Stop Test
            </Button>
          </>
        )}
      </div>

      {testMode && testVideoFile && (
        <div className="bg-yellow-50 dark:bg-yellow-950 border-2 border-yellow-500 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="font-semibold text-yellow-900 dark:text-yellow-100">
                Test Mode Active
              </div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                Testing: {testVideoFile.name}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative bg-muted rounded-lg overflow-hidden flex items-center justify-center">
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
        
        {isStreaming && (
          <>

            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-6 py-4 border-2 border-green-500">
              <div className="text-sm text-green-400 font-semibold mb-1">REPS</div>
              <div className="text-5xl font-bold text-white">{repCount}</div>
            </div>
            

            {currentState && (
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-6 py-3 border-2 border-blue-500">
                <div className="text-sm text-blue-400 font-semibold mb-1">STATE</div>
                <div className="text-2xl font-bold text-white capitalize">{currentState}</div>
              </div>
            )}
            
            {Object.keys(currentAngles).length > 0 && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 border-2 border-purple-500">
                <div className="text-sm text-purple-400 font-semibold mb-2">LIVE ANGLES</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {anglesOfInterest && anglesOfInterest.length > 0 ? (
                    // Show only angles of interest if specified
                    anglesOfInterest.map(angleName => {
                      const angle = currentAngles[angleName]
                      if (angle === undefined) return null
                      
                      return (
                        <div key={angleName} className="flex flex-col">
                          <span className="text-xs text-gray-400 capitalize">
                            {angleName.replace(/_/g, ' ')}
                          </span>
                          <span className="text-xl font-bold text-white">
                            {Math.round(angle)}°
                          </span>
                        </div>
                      )
                    })
                  ) : (
                    Object.entries(currentAngles)
                      .filter(([name]) => !name.includes('segment'))
                      .slice(0, 6)
                      .map(([angleName, angle]) => (
                        <div key={angleName} className="flex flex-col">
                          <span className="text-xs text-gray-400 capitalize">
                            {angleName.replace(/_/g, ' ')}
                          </span>
                          <span className="text-xl font-bold text-white">
                            {Math.round(angle)}°
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {isStreaming && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            realtime tracking guide
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• <span className="text-cyan-400">Cyan angles</span> = Joint angles (knee/elbow bends)</li>
            <li>• <span className="text-purple-400">Purple angles</span> = Elbow angles</li>
            <li>• <span className="text-orange-400">Orange angles</span> = Hip angles</li>
            <li>• White "seg:" = Segment angles (relative to vertical)</li>
            <li>• Reps are counted automatically based on movement cycles</li>
            {exerciseName && <li>• Exercise: <span className="font-semibold">{exerciseName}</span></li>}
          </ul>
        </div>
      )}
    </Card>
  )
}
