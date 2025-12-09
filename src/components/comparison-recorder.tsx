"use client"

import { useRef, useState, useEffect } from "react"
import { PoseLandmarker, FilesetResolver, DrawingUtils, PoseLandmarkerResult } from "@mediapipe/tasks-vision"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ComparisonRecorderProps {
  onVideoRecorded?: (videoBlob: Blob) => void
  anglesOfInterest?: string[]
  exerciseName?: string
  exerciseType?: string
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

export function ComparisonRecorder({ onVideoRecorded, anglesOfInterest, exerciseName, exerciseType, enableTestMode = false }: ComparisonRecorderProps) {
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
  const [formScore, setFormScore] = useState<number | null>(null)
  const [templateName, setTemplateName] = useState<string | null>(null)
  const [templateState, setTemplateState] = useState<string | null>(null)
  
  const [testMode, setTestMode] = useState(false)
  const [testVideoFile, setTestVideoFile] = useState<File | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const angleFiltersRef = useRef<Map<string, OneEuroFilter>>(new Map())
  const angleHistoryRef = useRef<Array<{ timestamp: number; angles: JointAngleData }>>([])
  const primaryAngleHistoryRef = useRef<Array<{ t: number; value: number }>>([])
  const lastStateRef = useRef<string>("")
  const hasVisitedPeakRef = useRef(false)
  const stateChangeTimestampRef = useRef<number>(0)
  
  const minAngleSeenRef = useRef<number>(180)
  const maxAngleSeenRef = useRef<number>(0)
  const hasLearnedThresholdsRef = useRef(false)
  const flexedThresholdRef = useRef<number>(90)
  const extendedThresholdRef = useRef<number>(140)
  const learnedTemplateRef = useRef<import("@/lib/exercise-state-learner").LearnedExerciseTemplate | null>(null)

  const POSE_CONNECTIONS = [
    { start: 0, end: 1 },
    { start: 1, end: 2 },
    { start: 2, end: 3 },
    { start: 3, end: 7 },
    { start: 0, end: 4 },
    { start: 4, end: 5 },
    { start: 5, end: 6 },
    { start: 6, end: 8 },
    { start: 9, end: 10 },
    { start: 11, end: 12 },
    { start: 11, end: 23 },
    { start: 12, end: 24 },
    { start: 23, end: 24 },
    { start: 11, end: 13 },
    { start: 13, end: 15 },
    { start: 15, end: 17 },
    { start: 15, end: 19 },
    { start: 15, end: 21 },
    { start: 17, end: 19 },
    { start: 12, end: 14 },
    { start: 14, end: 16 },
    { start: 16, end: 18 },
    { start: 16, end: 20 },
    { start: 16, end: 22 },
    { start: 18, end: 20 },
    { start: 23, end: 25 },
    { start: 25, end: 27 },
    { start: 27, end: 29 },
    { start: 27, end: 31 },
    { start: 29, end: 31 },
    { start: 24, end: 26 },
    { start: 26, end: 28 },
    { start: 28, end: 30 },
    { start: 28, end: 32 },
    { start: 30, end: 32 },
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


  // todo: calculate only relevant angles to save compute time
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


  // ROHA TO FUTURE ROHA: THIS IS PROBABLY MAKING THE KNEE ANGLES WEIRD
  // despite the angle moving with the knee there's some stiffness idk
  // the knee angle wouldn't follow the leg properly if that makes sense and this is probably the problem 
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


// figures out reps by seeing the maaximum and minimum angles aa joint was flexed/extended 
// to be decided later whether a rep should be counter even if it's above or below the max/min thresholds
  const determineExerciseState = (angles: JointAngleData): string => {
    if (!anglesOfInterest || anglesOfInterest.length === 0) return ""
    
    const primaryAngle = anglesOfInterest[0]
    const angle = angles[primaryAngle]
    
    if (angle === undefined) return ""
    
    if (angle < minAngleSeenRef.current) {
      minAngleSeenRef.current = angle
    }
    if (angle > maxAngleSeenRef.current) {
      maxAngleSeenRef.current = angle
    }
    
    if (!hasLearnedThresholdsRef.current && angleHistoryRef.current.length > 60) {
      const range = maxAngleSeenRef.current - minAngleSeenRef.current
      if (range > 20) {
        const mid = (maxAngleSeenRef.current + minAngleSeenRef.current) / 2
        const band = Math.max(5, range * 0.1)
        flexedThresholdRef.current = mid - band
        extendedThresholdRef.current = mid + band
        hasLearnedThresholdsRef.current = true
        console.log(`Learned hysteresis thresholds: flexed < ${Math.round(flexedThresholdRef.current)}°, extended > ${Math.round(extendedThresholdRef.current)}° (range ${Math.round(range)}°)`)        
      }
    }
    
    const flexedThreshold = flexedThresholdRef.current
    const extendedThreshold = extendedThresholdRef.current
    
    if (angle < flexedThreshold) {
      return "flexed"
    } else if (angle > extendedThreshold) {
      return "extended"
    } else {
      return "transition"
    }
  }


  // this just feels wrong but i cant yet prove why - maybe it's recalculation of the same state thing that is being stored in exercise templates 
  const updateRepCount = (state: string, timestamp: number) => {
    if (!state) return
    
    const MIN_STATE_DURATION = 0.2
    if (state !== lastStateRef.current) {
      const timeSinceLastChange = timestamp - stateChangeTimestampRef.current
      if (timeSinceLastChange < MIN_STATE_DURATION && lastStateRef.current !== "") {
        return
      }
      // Sequence: trough (flexed) -> peak (extended) -> trough counts one rep
      if (state === "extended" && lastStateRef.current === "flexed") {
        hasVisitedPeakRef.current = true
      }
      if (state === "flexed" && hasVisitedPeakRef.current && lastStateRef.current === "extended") {
        setRepCount(prev => prev + 1)
        hasVisitedPeakRef.current = false
      }
      lastStateRef.current = state
      stateChangeTimestampRef.current = timestamp
    }
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
        videoRef.current.loop = false
        
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
    stateChangeTimestampRef.current = 0
    angleFiltersRef.current.clear()
    angleHistoryRef.current = []
    
    minAngleSeenRef.current = 180
    maxAngleSeenRef.current = 0
    hasLearnedThresholdsRef.current = false
    flexedThresholdRef.current = 90
    extendedThresholdRef.current = 140
  }

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
    stateChangeTimestampRef.current = 0
    angleFiltersRef.current.clear()
    angleHistoryRef.current = []
    
    minAngleSeenRef.current = 180
    maxAngleSeenRef.current = 0
    hasLearnedThresholdsRef.current = false
    flexedThresholdRef.current = 90
    extendedThresholdRef.current = 140
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
        
        const rawAngles = calculateAllAngles(landmarks)
        const smoothedAngles = smoothAngles(rawAngles, ts / 1000)
        
        
        setCurrentAngles(smoothedAngles)
        
        
        angleHistoryRef.current.push({
          timestamp: ts / 1000,
          angles: smoothedAngles
        })
        // Maintain primary angle time-series for peak/trough detection and similarity metrics
        if (anglesOfInterest && anglesOfInterest.length > 0) {
          // Prefer right_knee; fallback to left_knee if undefined
          const preferred = "right_knee"
          const primary = smoothedAngles[preferred] !== undefined ? preferred : anglesOfInterest[0]
          const val = smoothedAngles[primary] ?? smoothedAngles["left_knee"]
          if (val !== undefined) {
            primaryAngleHistoryRef.current.push({ t: ts / 1000, value: val })
            const cutoffT = (ts / 1000) - 12
            primaryAngleHistoryRef.current = primaryAngleHistoryRef.current.filter(p => p.t > cutoffT)
          }
        }
                const cutoffTime = (ts / 1000) - 10
        angleHistoryRef.current = angleHistoryRef.current.filter(
          h => h.timestamp > cutoffTime
        )
        
        // Template-driven state and reps if template is present; else fallback
        let stateLabel = ""
        if (learnedTemplateRef.current && anglesOfInterest && anglesOfInterest.length > 0) {
          const mapped = mapToTemplateState(smoothedAngles, learnedTemplateRef.current, anglesOfInterest)
          stateLabel = mapped?.name || ""
          if (stateLabel) setTemplateState(stateLabel)
          // Template-driven rep count in-component: Start->Peak->Start
          const primary = anglesOfInterest[0]
          const sortable = learnedTemplateRef.current.states.filter(s => s.angleRanges[primary])
          if (mapped && sortable.length >= 2) {
            const sorted = [...sortable].sort((a, b) => a.angleRanges[primary].mean - b.angleRanges[primary].mean)
            const startId = sorted[0].id
            const peakId = sorted[sorted.length - 1].id
            const MIN_STATE_DURATION = 0.2
            if (mapped.id !== lastStateRef.current) {
              const dt = (ts / 1000) - stateChangeTimestampRef.current
              if (dt >= MIN_STATE_DURATION || lastStateRef.current === "") {
                if (mapped.id === peakId && lastStateRef.current === startId) {
                  hasVisitedPeakRef.current = true
                }
                if (mapped.id === startId && hasVisitedPeakRef.current && lastStateRef.current === peakId) {
                  setRepCount(prev => prev + 1)
                  hasVisitedPeakRef.current = false
                }
                lastStateRef.current = mapped.id
                stateChangeTimestampRef.current = ts / 1000
              }
            }
          }
        } else {
          const state = determineExerciseState(smoothedAngles)
          stateLabel = state
          if (state) {
            setCurrentState(state)
            updateRepCount(state, ts / 1000)
          }
        }

        if (learnedTemplateRef.current && anglesOfInterest && anglesOfInterest.length > 0) {
          const score = computeFormScore(smoothedAngles, learnedTemplateRef.current, anglesOfInterest)
          setFormScore(Math.round(score))
        }

        if (anglesOfInterest && anglesOfInterest.length > 0) {
          updateRepCountFromSignal()
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
        drawLiveMetrics(ctx)
      }

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)
  }

  const drawLiveMetrics = (ctx: CanvasRenderingContext2D) => {
    if (!anglesOfInterest || anglesOfInterest.length === 0) return
    const primary = anglesOfInterest[0]
    const width = canvasRef.current?.width || 640
    const height = canvasRef.current?.height || 480
    const series = primaryAngleHistoryRef.current
    if (series.length < 15) return
    const values = series.map(s => s.value)
    const rom = Math.max(0, Math.min(100, ((Math.max(...values) - Math.min(...values)) / 180) * 100))

    const recentStartT = series[0].t
    const recentEndT = series[series.length - 1].t
    const windowSec = Math.max(1, recentEndT - recentStartT)

    let similarity = 0
    if (values.length >= 30) {
      const mid = Math.floor(values.length / 2)
      const a = values.slice(0, mid)
      const b = values.slice(values.length - mid)
      const norm = (arr: number[]) => {
        const m = arr.reduce((s, v) => s + v, 0) / arr.length
        const sd = Math.sqrt(arr.reduce((s, v) => s + (v - m) * (v - m), 0) / arr.length) || 1
        return arr.map(v => (v - m) / sd)
      }
      const an = norm(a)
      const bn = norm(b)
      const len = Math.min(an.length, bn.length)
      const dot = an.slice(0, len).reduce((s, v, i) => s + v * bn[i], 0)
      similarity = Math.max(0, Math.min(100, (dot / len) * 50 + 50)) // map [-1,1] -> [0,100]
    }

    ctx.save()
    ctx.fillStyle = "#111827CC"
    ctx.strokeStyle = "#9333ea"
    ctx.lineWidth = 2
    const boxW = 240
    const boxH = 100
    const x = 20
    const y = height - boxH - 20
    ctx.fillRect(x, y, boxW, boxH)
    ctx.strokeRect(x, y, boxW, boxH)
    ctx.fillStyle = "#a78bfa"
    ctx.font = "bold 14px Arial"
    ctx.fillText("LIVE METRICS", x + 12, y + 22)
    ctx.fillStyle = "#ffffff"
    ctx.font = "12px Arial"
    ctx.fillText(`ROM: ${Math.round(rom)}%`, x + 12, y + 44)
    ctx.fillText(`Tempo: ${(repCount / (windowSec / 60)).toFixed(1)} reps/min`, x + 12, y + 64)
    ctx.fillText(`Similarity: ${Math.round(similarity)}%`, x + 12, y + 84)
    ctx.restore()
  }


  const repSignalStateRef = useRef<{ lastPeak?: number; lastTrough?: number; lastDirection?: 'up' | 'down' | null; lastChangeT?: number }>({ lastDirection: null, lastChangeT: 0 })
  const updateRepCountFromSignal = () => {
    const series = primaryAngleHistoryRef.current
    if (series.length < 8) return
    const recent = series.slice(-30)
    const n = recent.length
    const deriv: number[] = []
    for (let i = 1; i < n; i++) {
      const dt = Math.max(0.016, recent[i].t - recent[i - 1].t)
      deriv.push((recent[i].value - recent[i - 1].value) / dt)
    }
    const alpha = 0.3
    for (let i = 1; i < deriv.length; i++) {
      deriv[i] = alpha * deriv[i] + (1 - alpha) * deriv[i - 1]
    }
    const lastIdx = deriv.length - 1
    const prev = deriv[lastIdx - 1]
    const curr = deriv[lastIdx]
    const nowT = recent[recent.length - 1].t
  const HYST_DERIV = 4 // deg/s hysteresis to avoid noise
    const MIN_INTERVAL = 0.25 // seconds between state changes
    const state = repSignalStateRef.current
  const dir: 'up' | 'down' | null = curr > HYST_DERIV ? 'up' : curr < -HYST_DERIV ? 'down' : (state.lastDirection ?? null)
    if (!dir) return
    if (dir !== state.lastDirection) {
      if (nowT - (state.lastChangeT || 0) < MIN_INTERVAL) {
        state.lastDirection = dir
        return
      }
      if (state.lastDirection === 'up' && dir === 'down') {
        state.lastPeak = recent[recent.length - 1].value
      }
      if (state.lastDirection === 'down' && dir === 'up') {
        state.lastTrough = recent[recent.length - 1].value
        if (state.lastPeak !== undefined && state.lastTrough !== undefined) {
          const rom = Math.abs(state.lastPeak - state.lastTrough)

          const windowVals = primaryAngleHistoryRef.current.map(p => p.value)
          const observedRange = windowVals.length > 0 ? (Math.max(...windowVals) - Math.min(...windowVals)) : 0
          const MIN_ROM = Math.max(20, observedRange * 0.35) 
          const PEAK_MIN = 148  // slightly lower
          const TROUGH_MAX = 108 // slightly higher to allow error margin (otherwise reps would be skipped)
          const peakOK = state.lastPeak >= PEAK_MIN
          const troughOK = state.lastTrough <= TROUGH_MAX
          console.log(`[REP DEBUG] ROM=${rom.toFixed(1)} peak=${state.lastPeak?.toFixed(1)} trough=${state.lastTrough?.toFixed(1)} peakOK=${peakOK} troughOK=${troughOK}`)
          if (rom >= MIN_ROM && peakOK && troughOK) {
            console.log(`REP COUNTED! Total: ${repCount + 1}`)
            setRepCount(prev => prev + 1)
            state.lastPeak = undefined
          }
        }
      }
      state.lastDirection = dir
      state.lastChangeT = nowT
    }
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
    try {
      if (exerciseType) {
        const { getTemplatesByExerciseType } = require("@/lib/template-storage")
        const candidates = getTemplatesByExerciseType(exerciseType)
        const match = (exerciseName 
          ? candidates.find((t: { template: import("@/lib/exercise-state-learner").LearnedExerciseTemplate }) => t.template.exerciseName === exerciseName) 
          : candidates[candidates.length - 1]) || null
        if (match) {
          learnedTemplateRef.current = match.template
          setTemplateName(match.template.exerciseName)
        }
      }
    } catch (e) {
      console.info("No learned template loaded for form scoring.")
    }
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
              {isLoading ? "Loading..." : "Test with Video File"}
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
              {!hasLearnedThresholdsRef.current && angleHistoryRef.current.length < 60 && (
                <div className="text-xs text-yellow-400 mt-1">Learning...</div>
              )}
            </div>
            

            {(currentState || templateState) && (
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-6 py-3 border-2 border-blue-500">
                <div className="text-sm text-blue-400 font-semibold mb-1">STATE</div>
                <div className="text-2xl font-bold text-white capitalize">{templateState || currentState}</div>
              </div>
            )}

            {formScore !== null && (
              <div className="absolute top-28 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-6 py-3 border-2 border-purple-500">
                <div className="text-sm text-purple-400 font-semibold mb-1">FORM SCORE{templateName ? ` · ${templateName}` : ""}</div>
                <div className="text-2xl font-bold text-white">{formScore}%</div>
              </div>
            )}
            
            {Object.keys(currentAngles).length > 0 && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 border-2 border-purple-500">
                <div className="text-sm text-purple-400 font-semibold mb-2">LIVE ANGLES</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {anglesOfInterest && anglesOfInterest.length > 0 ? (
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
            <li>Cyan = Knee angles</li>
            <li>Purple = Elbow angles</li>
            <li>Orange = Hip angles</li>
            <li>White seg = Segment angles</li>
            {exerciseName && <li>Exercise: {exerciseName}</li>}
          </ul>
        </div>
      )}
    </Card>
  )
}

function computeFormScore(
  angles: JointAngleData,
  template: import("@/lib/exercise-state-learner").LearnedExerciseTemplate,
  anglesOfInterest: string[]
): number {
  const primary = anglesOfInterest[0]
  const cur = angles[primary]
  if (cur === undefined) return 0
  const candidates = template.states.filter(s => s.angleRanges[primary])
  if (candidates.length === 0) return 0
  const nearest = candidates.reduce((best, s) => {
    const m = s.angleRanges[primary].mean
    const d = Math.abs(cur - m)
    return (!best || d < Math.abs(cur - best.angleRanges[primary].mean)) ? s : best
  }, candidates[0])
  let scores: number[] = []
  anglesOfInterest.forEach(name => {
    const val = angles[name]
    const stats = nearest.angleRanges[name]
    if (val === undefined || !stats) return
    const { mean, stdDev, min, max } = stats
    const clampedVal = Math.max(min, Math.min(max, val))
    const z = Math.abs((clampedVal - mean) / (stdDev || 1))
    const score = Math.max(0, 100 - (z * 20))
    scores.push(score)
  })
  if (scores.length === 0) return 0
  const avg = scores.reduce((s, v) => s + v, 0) / scores.length
  return Math.max(0, Math.min(100, avg))
}

function mapToTemplateState(
  angles: JointAngleData,
  template: import("@/lib/exercise-state-learner").LearnedExerciseTemplate,
  anglesOfInterest: string[]
): { id: string; name: string } | null {
  const primary = anglesOfInterest[0]
  const cur = angles[primary]
  if (cur === undefined) return null
  const candidates = template.states.filter(s => s.angleRanges[primary])
  if (candidates.length === 0) return null
  const nearest = candidates.reduce((best, s) => {
    const m = s.angleRanges[primary].mean
    const d = Math.abs(cur - m)
    return (!best || d < Math.abs(cur - best.angleRanges[primary].mean)) ? s : best
  }, candidates[0])
  return { id: nearest.id, name: nearest.name }
}

const templateLastStateRef: { current: string | null } = { current: null }
const templateVisitedPeakRef: { current: boolean } = { current: false }
const templateLastChangeTsRef: { current: number } = { current: 0 }

function updateTemplateRepCount(
  mappedStateId: string | null,
  timestamp: number,
  template: import("@/lib/exercise-state-learner").LearnedExerciseTemplate,
  anglesOfInterest: string[]
) {
  if (!mappedStateId) return
  const MIN_STATE_DURATION = 0.2
  const last = templateLastStateRef.current
  if (mappedStateId !== last) {
    const dt = timestamp - templateLastChangeTsRef.current
    if (dt < MIN_STATE_DURATION && last) return
    const primary = anglesOfInterest[0]
    const sortable = template.states.filter(s => s.angleRanges[primary])
    if (sortable.length < 2) {
      templateLastStateRef.current = mappedStateId
      templateLastChangeTsRef.current = timestamp
      return
    }
    const sorted = [...sortable].sort((a, b) => a.angleRanges[primary].mean - b.angleRanges[primary].mean)
    const startId = sorted[0].id
    const peakId = sorted[sorted.length - 1].id
    if (mappedStateId === peakId && last === startId) {
      templateVisitedPeakRef.current = true
    }
    if (mappedStateId === startId && templateVisitedPeakRef.current && last === peakId) {
      // todo
      // Increment the global rep counter in component via a custom event pattern
      // We cannot set state here; instead we rely on calling setRepCount in the render loop (lift state by returning flag)
      // As we are outside component scope, we return nothing; logic moved back to component caller
    }
    templateLastStateRef.current = mappedStateId
    templateLastChangeTsRef.current = timestamp
  }
}
