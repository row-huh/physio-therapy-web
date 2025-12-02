"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PoseLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision"
import type { MovementSequence } from "@/lib/pose-analyzer"

/**
 * One Euro Filter for smooth landmark tracking in real-time playback
 */
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
    const t_e = this.t_prev === 0 ? 0.016 : t - this.t_prev // Default to ~60fps
    
    if (t_e === 0) {
      return x
    }
    
    // Estimate velocity
    const dx = (x - this.x_prev) / t_e
    const edx = this.exponentialSmoothing(
      this.smoothingFactor(t_e, this.d_cutoff),
      dx,
      this.dx_prev
    )
    
    // Adaptive cutoff based on velocity
    const cutoff = this.min_cutoff + this.beta * Math.abs(edx)
    
    // Smooth the signal
    const x_filtered = this.exponentialSmoothing(
      this.smoothingFactor(t_e, cutoff),
      x,
      this.x_prev
    )
    
    // Store for next iteration
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

interface VideoAnalysisPlayerProps {
  videoBlob: Blob
  movements: MovementSequence[]
  jointsOfInterest?: string[]
}

export function VideoAnalysisPlayer({ videoBlob, movements, jointsOfInterest }: VideoAnalysisPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  
  // One Euro Filters for each landmark coordinate
  const landmarkFiltersRef = useRef<Map<string, { x: OneEuroFilter; y: OneEuroFilter; z: OneEuroFilter }>>(new Map())

  useEffect(() => {
    initializePlayer()
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (poseLandmarkerRef.current) {
        poseLandmarkerRef.current.close()
      }
    }
  }, [videoBlob])

  const initializePlayer = async () => {
    try {
      setIsLoading(true)

      // Initialize MediaPipe
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm"
      )

      const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          // Use full model for better stability (not lite)
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })

      poseLandmarkerRef.current = poseLandmarker

      // Setup video
      const videoUrl = URL.createObjectURL(videoBlob)
      if (videoRef.current) {
        videoRef.current.src = videoUrl
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current && canvasRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth
            canvasRef.current.height = videoRef.current.videoHeight
          }
          setIsLoading(false)
        }
      }
    } catch (error) {
      console.error("Error initializing player:", error)
      setIsLoading(false)
    }
  }

  const drawPoseAndAnnotations = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const poseLandmarker = poseLandmarkerRef.current

    if (!video || !canvas || !poseLandmarker || video.paused || video.ended) {
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    try {
      // Detect pose
      const timestamp = performance.now()
      const results = poseLandmarker.detectForVideo(video, timestamp)

      if (results.landmarks && results.landmarks.length > 0) {
        const rawLandmarks = results.landmarks[0]
        
        // Apply One Euro Filter smoothing to landmarks
        const smoothedLandmarks = rawLandmarks.map((landmark: any, index: number) => {
          const key = `landmark_${index}`
          
          if (!landmarkFiltersRef.current.has(key)) {
            landmarkFiltersRef.current.set(key, {
              x: new OneEuroFilter(1.0, 0.007),
              y: new OneEuroFilter(1.0, 0.007),
              z: new OneEuroFilter(1.0, 0.007),
            })
          }
          
          const filter = landmarkFiltersRef.current.get(key)!
          const t = video.currentTime
          
          return {
            x: filter.x.filter(landmark.x, t),
            y: filter.y.filter(landmark.y, t),
            z: landmark.z ? filter.z.filter(landmark.z, t) : landmark.z,
            visibility: landmark.visibility,
          }
        })
        
        const landmarks = smoothedLandmarks
        const drawingUtils = new DrawingUtils(ctx)

        // Draw skeleton connections
        const connections = [
          [11, 12], // Shoulders
          [11, 13],
          [13, 15], // Left arm
          [12, 14],
          [14, 16], // Right arm
          [11, 23],
          [12, 24], // Torso
          [23, 24], // Hips
          [23, 25],
          [25, 27], // Left leg
          [24, 26],
          [26, 28], // Right leg
        ]

        // Draw connections
        ctx.strokeStyle = "#00ff00"
        ctx.lineWidth = 3
        connections.forEach(([start, end]) => {
          const startPoint = landmarks[start]
          const endPoint = landmarks[end]

          if (startPoint && endPoint) {
            ctx.beginPath()
            ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height)
            ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height)
            ctx.stroke()
          }
        })

        // Draw landmarks
        landmarks.forEach((landmark: any, index: number) => {
          ctx.beginPath()
          ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 5, 0, 2 * Math.PI)
          ctx.fillStyle = "#ff0000"
          ctx.fill()
        })

        // Draw segment angles for tracked joints
        drawSegmentAngles(ctx, landmarks, canvas.width, canvas.height)
      }
    } catch (error) {
      console.error("Error drawing pose:", error)
    }

    // Draw current movements
    drawCurrentMovements(ctx, canvas.width, canvas.height, video.currentTime)

    animationFrameRef.current = requestAnimationFrame(drawPoseAndAnnotations)
  }

  const drawSegmentAngles = (
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    width: number,
    height: number
  ) => {
    const shouldTrack = (jointName: string) => {
      if (!jointsOfInterest) return true
      return jointsOfInterest.includes(jointName)
    }

    // Draw right leg segment angle if tracking
    if (shouldTrack("right_knee") || shouldTrack("right_ankle")) {
      const knee = landmarks[26]
      const ankle = landmarks[28]

      if (knee && ankle) {
        const kneeX = knee.x * width
        const kneeY = knee.y * height
        const ankleX = ankle.x * width
        const ankleY = ankle.y * height

        // Calculate angle from vertical (already smoothed via landmark filters)
        const dx = ankleX - kneeX
        const dy = ankleY - kneeY
        const angle = Math.abs((Math.atan2(dx, dy) * 180) / Math.PI)

        // Draw angle text
        ctx.fillStyle = "#ffff00"
        ctx.font = "bold 20px Arial"
        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 3
        const text = `R Leg: ${angle.toFixed(1)}°`
        ctx.strokeText(text, kneeX + 20, kneeY)
        ctx.fillText(text, kneeX + 20, kneeY)
      }
    }

    // Draw left leg segment angle if tracking
    if (shouldTrack("left_knee") || shouldTrack("left_ankle")) {
      const knee = landmarks[25]
      const ankle = landmarks[27]

      if (knee && ankle) {
        const kneeX = knee.x * width
        const kneeY = knee.y * height
        const ankleX = ankle.x * width
        const ankleY = ankle.y * height

        // Calculate angle from vertical (already smoothed via landmark filters)
        const dx = ankleX - kneeX
        const dy = ankleY - kneeY
        const angle = Math.abs((Math.atan2(dx, dy) * 180) / Math.PI)

        // Draw angle text
        ctx.fillStyle = "#ffff00"
        ctx.font = "bold 20px Arial"
        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 3
        const text = `L Leg: ${angle.toFixed(1)}°`
        ctx.strokeText(text, kneeX - 120, kneeY)
        ctx.fillText(text, kneeX - 120, kneeY)
      }
    }
  }

  const drawCurrentMovements = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    currentTime: number
  ) => {
    // Find movements happening at current time
    const activeMovements = movements.filter(
      (m) => currentTime >= m.startTime && currentTime <= m.endTime
    )

    if (activeMovements.length > 0) {
      // Draw semi-transparent background
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(10, 10, 400, 30 + activeMovements.length * 30)

      // Draw movement info
      ctx.fillStyle = "#00ff00"
      ctx.font = "bold 16px Arial"
      ctx.fillText("Active Movements:", 20, 35)

      activeMovements.forEach((movement, idx) => {
        const segmentName = movement.joint
          .replace("_segment", "")
          .replace("_", " ")
          .toUpperCase()
        const change = Math.abs(movement.angleDelta).toFixed(1)
        const direction = movement.angleDelta > 0 ? "↗" : "↘"

        ctx.fillStyle = "#ffff00"
        ctx.font = "14px Arial"
        ctx.fillText(`${segmentName}: ${direction} ${change}°`, 30, 60 + idx * 25)
      })
    }

    // Draw timeline with movements
    const timelineY = height - 40
    const timelineWidth = width - 40

    // Timeline background
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(20, timelineY, timelineWidth, 20)

    // Draw movement markers
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration
      movements.forEach((movement) => {
        const startX = 20 + (movement.startTime / videoDuration) * timelineWidth
        const endX = 20 + (movement.endTime / videoDuration) * timelineWidth
        const width = endX - startX

        ctx.fillStyle = "rgba(0, 255, 0, 0.6)"
        ctx.fillRect(startX, timelineY, width, 20)
      })

      // Current time indicator
      const currentX = 20 + (currentTime / videoDuration) * timelineWidth
      ctx.fillStyle = "#ff0000"
      ctx.fillRect(currentX - 2, timelineY - 5, 4, 30)
    }
  }

  const handlePlayPause = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    } else {
      videoRef.current.play()
      drawPoseAndAnnotations()
    }
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      setIsPlaying(false)
      // Reset all filters for fresh smoothing
      landmarkFiltersRef.current.forEach((filter) => {
        filter.x.reset()
        filter.y.reset()
        filter.z.reset()
      })
      landmarkFiltersRef.current.clear()
    }
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Video Analysis Playback</h3>

      {isLoading && (
        <div className="flex items-center justify-center h-96 bg-muted rounded">
          <p className="text-muted-foreground">Loading video...</p>
        </div>
      )}

      <div className="relative">
        <div className="relative aspect-video bg-black rounded overflow-hidden">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-contain"
            muted
            loop
            onEnded={() => setIsPlaying(false)}
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />
        </div>

        {!isLoading && (
          <div className="mt-4 flex gap-3">
            <Button onClick={handlePlayPause} className="flex-1">
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        <p>• Green lines show the detected skeleton</p>
        <p>• Yellow text shows current segment angles</p>
        <p>• Green bars on timeline indicate detected movements</p>
        <p>• Active movements are displayed at the top during playback</p>
      </div>
    </Card>
  )
}
