"use client"

import { useRef, useState, useEffect } from "react"
import { PoseLandmarker, FilesetResolver, DrawingUtils, PoseLandmarkerResult } from "@mediapipe/tasks-vision"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ComparisonRecorderProps {
  onVideoRecorded?: (videoBlob: Blob) => void
}

export function ComparisonRecorder({ onVideoRecorded }: ComparisonRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const poseRef = useRef<PoseLandmarker | null>(null)
  const rafRef = useRef<number | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Complete MediaPipe pose connections for full skeleton
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

  const openWebcam = async () => {
    if (isStreaming || isLoading) return
    setIsLoading(true)
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
        
        // Drawing lines between llandmarks here
        drawer.drawConnectors(landmarks, POSE_CONNECTIONS, {
          color: "#22c55e",
          lineWidth: 3,
        })
        
        // Draw landmarks on top of connections
        drawer.drawLandmarks(landmarks, { 
          radius: 4, 
          fillColor: "#22c55e",
          color: "#16a34a",
          lineWidth: 2 
        })
      }

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)
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
      </div>

      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </Card>
  )
}
