"use client"

import { useEffect, useRef } from "react"
import type { Pose } from "@/lib/pose-utils"

interface PoseCanvasProps {
  pose: Pose | null
  videoElement?: HTMLVideoElement
}

export function PoseCanvas({ pose, videoElement }: PoseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !pose) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw video frame if available
    if (videoElement) {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
    }

    // Draw keypoints
    const radius = 5
    pose.keypoints.forEach((keypoint) => {
      if (keypoint.score > 0.3) {
        ctx.fillStyle = keypoint.score > 0.7 ? "#00ff00" : "#ffff00"
        ctx.beginPath()
        ctx.arc(keypoint.x, keypoint.y, radius, 0, 2 * Math.PI)
        ctx.fill()

        // Draw keypoint label
        ctx.fillStyle = "#fff"
        ctx.font = "10px Arial"
        ctx.fillText(keypoint.name, keypoint.x + radius, keypoint.y - radius)
      }
    })

    // Draw skeleton connections
    const connections = [
      ["LEFT_SHOULDER", "RIGHT_SHOULDER"],
      ["LEFT_SHOULDER", "LEFT_ELBOW"],
      ["LEFT_ELBOW", "LEFT_WRIST"],
      ["RIGHT_SHOULDER", "RIGHT_ELBOW"],
      ["RIGHT_ELBOW", "RIGHT_WRIST"],
      ["LEFT_SHOULDER", "LEFT_HIP"],
      ["RIGHT_SHOULDER", "RIGHT_HIP"],
      ["LEFT_HIP", "RIGHT_HIP"],
      ["LEFT_HIP", "LEFT_KNEE"],
      ["LEFT_KNEE", "LEFT_ANKLE"],
      ["RIGHT_HIP", "RIGHT_KNEE"],
      ["RIGHT_KNEE", "RIGHT_ANKLE"],
    ]

    ctx.strokeStyle = "#00ff00"
    ctx.lineWidth = 2

    connections.forEach(([start, end]) => {
      const startKp = pose.keypoints.find((k) => k.name === start)
      const endKp = pose.keypoints.find((k) => k.name === end)

      if (startKp && endKp && startKp.score > 0.3 && endKp.score > 0.3) {
        ctx.beginPath()
        ctx.moveTo(startKp.x, startKp.y)
        ctx.lineTo(endKp.x, endKp.y)
        ctx.stroke()
      }
    })
  }, [pose, videoElement])

  return <canvas ref={canvasRef} width={640} height={480} className="border border-border rounded-lg" />
}
