"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { initializePoseDetector, detectPose, type Pose } from "@/lib/pose-utils"

interface VideoRecorderProps {
  onPoseCaptured?: (pose: Pose) => void
}

// Utility function to get webcam stream
async function getWebcamStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    video: { width: 640, height: 480 },
    audio: false,
  })
}

// Utility function to draw skeleton on canvas
function drawSkeletonOnCanvas(canvas: HTMLCanvasElement, pose: Pose) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw keypoints
  pose.keypoints.forEach((keypoint) => {
    if (keypoint.score && keypoint.score > 0.3) {
      ctx.beginPath()
      ctx.arc(keypoint.x * canvas.width, keypoint.y * canvas.height, 5, 0, 2 * Math.PI)
      ctx.fillStyle = "#00ff00"
      ctx.fill()
    }
  })

  // Draw connections (skeleton lines)
  const connections = [
    [5, 6], [5, 7], [7, 9], [6, 8], [8, 10], // Arms
    [5, 11], [6, 12], [11, 12], // Torso
    [11, 13], [13, 15], [12, 14], [14, 16], // Legs
  ]

  ctx.strokeStyle = "#00ff00"
  ctx.lineWidth = 2

  connections.forEach(([start, end]) => {
    const startPoint = pose.keypoints[start]
    const endPoint = pose.keypoints[end]

    if (startPoint.score && startPoint.score > 0.3 && endPoint.score && endPoint.score > 0.3) {
      ctx.beginPath()
      ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height)
      ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height)
      ctx.stroke()
    }
  })
}

export function VideoRecorder({ onPoseCaptured }: VideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentPose, setCurrentPose] = useState<Pose | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const detectorRef = useRef<any>(null)
  const animationFrameRef = useRef<number | null>(null)
  const isDetectingRef = useRef(false)

  // Initialize webcam and start pose detection
  const startRecording = async () => {
    try {
      console.log("[v0] Starting recording...")

      // Get webcam stream
      const stream = await getWebcamStream()
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        // Wait for video to load AND play before starting detection
        await new Promise<void>((resolve) => {
          const checkReady = () => {
            if (videoRef.current && videoRef.current.videoWidth > 0) {
              console.log(
                "[v0] Video stream ready, dimensions:",
                videoRef.current.videoWidth,
                "x",
                videoRef.current.videoHeight,
              )
              // Update canvas size to match video
              if (canvasRef.current) {
                canvasRef.current.width = videoRef.current.videoWidth
                canvasRef.current.height = videoRef.current.videoHeight
              }
              resolve()
            } else {
              setTimeout(checkReady, 100)
            }
          }
          checkReady()
        })

        // Start playing video
        try {
          await videoRef.current.play()
          console.log("[v0] Video playing")
        } catch (e) {
          console.log("[v0] Video play (expected in some browsers):", e)
        }
      }

      // Initialize pose detector
      const detector = await initializePoseDetector()
      if (!detector) {
        throw new Error("Could not initialize pose detection")
      }
      detectorRef.current = detector
      console.log("[v0] Detector ready, starting detection loop")

      setIsStreaming(true)
      isDetectingRef.current = true
      startPoseDetectionLoop()
    } catch (error) {
      console.error("[v0] Error starting recording:", error)
      alert("Failed to start camera. Please check camera permissions.")
    }
  }

  // Continuous pose detection loop
  const startPoseDetectionLoop = () => {
    const detect = async () => {
      if (!isDetectingRef.current || !videoRef.current || !detectorRef.current) {
        return
      }

      try {
        const pose = await detectPose(videoRef.current)
        if (pose) {
          console.log("[v0] Pose detected with score:", pose.score)
          setCurrentPose(pose)

          // Draw skeleton on canvas
          if (canvasRef.current) {
            drawSkeletonOnCanvas(canvasRef.current, pose)
          }
        }
      } catch (error) {
        console.error("[v0] Detection error:", error)
      }

      animationFrameRef.current = requestAnimationFrame(detect)
    }
    detect()
  }

  // Stop recording and cleanup
  const stopRecording = () => {
    console.log("[v0] Stopping recording...")
    isDetectingRef.current = false
    setIsStreaming(false)

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }

    setCurrentPose(null)
  }

  // Capture current pose
  const capturePose = () => {
    if (currentPose) {
      console.log("[v0] Capturing pose with confidence:", currentPose.score)
      onPoseCaptured?.(currentPose)
    }
  }

  useEffect(() => {
    return () => {
      isDetectingRef.current = false
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
          {!isStreaming ? (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Camera feed will appear here
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover absolute inset-0"
              />
              <canvas ref={canvasRef} className="w-full h-full absolute inset-0" />
            </>
          )}
        </div>

        {currentPose && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm font-medium">Pose Detected</p>
            <p className="text-sm text-muted-foreground">Confidence: {(currentPose.score * 100).toFixed(1)}%</p>
          </div>
        )}

        <div className="flex gap-3">
          {!isStreaming ? (
            <Button onClick={startRecording} className="flex-1">
              Start Webcam
            </Button>
          ) : (
            <>
              <Button onClick={stopRecording} variant="destructive" className="flex-1">
                Stop
              </Button>
              <Button onClick={capturePose} variant="secondary" disabled={!currentPose} className="flex-1">
                Capture Pose
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}
