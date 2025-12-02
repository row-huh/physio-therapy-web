"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision"
import { getExerciseStateConfig, detectState, RepCounter } from "@/lib/exercise-states"
import { getExerciseConfig } from "@/lib/exercise-config"

interface LiveComparisonProps {
	exerciseId: string
}

// MediaPipe landmark indices
const LM = {
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

function angle3(a: number[], b: number[], c: number[]): number {
	const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0])
	let angle = Math.abs((radians * 180.0) / Math.PI)
	if (angle > 180.0) angle = 360.0 - angle
	return angle
}

export default function LiveComparison({ exerciseId }: LiveComparisonProps) {
	const webcamRef = useRef<HTMLVideoElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [isReady, setIsReady] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [currentState, setCurrentState] = useState<string | null>(null)
	const [correctReps, setCorrectReps] = useState(0)
	const [incorrectReps, setIncorrectReps] = useState(0)
	const poseLandmarkerRef = useRef<PoseLandmarker | null>(null)
	const repCounterRef = useRef<RepCounter | null>(null)
	const lastStateChangeTimeRef = useRef<number>(0)
	const animationFrameRef = useRef<number | null>(null)

	useEffect(() => {
		console.log("🎬 LiveComparison mounting with exerciseId:", exerciseId)
		let stream: MediaStream | null = null

		async function setup() {
			try {
				console.log("📹 Requesting camera access...")
				// Camera
				stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false })
				console.log("✅ Camera access granted")
				
				if (webcamRef.current) {
					webcamRef.current.srcObject = stream
					await webcamRef.current.play()
					console.log("✅ Webcam video playing")
				}

				console.log("🤖 Initializing MediaPipe...")
				// MediaPipe
				const vision = await FilesetResolver.forVisionTasks(
					"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm"
				)
				console.log("✅ MediaPipe vision loaded")
				
				const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
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
				})
				poseLandmarkerRef.current = poseLandmarker
				console.log("✅ PoseLandmarker created")

				// Rep counter based on exercise config
				const stateCfg = getExerciseStateConfig(exerciseId)
				if (stateCfg) {
					repCounterRef.current = new RepCounter(stateCfg)
					console.log("✅ RepCounter initialized for:", exerciseId)
				} else {
					console.warn("⚠️ No state config found for:", exerciseId)
				}

				setIsReady(true)
				console.log("🎉 Setup complete, starting draw loop")
				drawLoop()
			} catch (e) {
				console.error("❌ LiveComparison setup error:", e)
				setError(e instanceof Error ? e.message : "Setup failed")
			}
		}

		setup()

		return () => {
			console.log("🧹 Cleaning up LiveComparison")
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current)
			}
			if (poseLandmarkerRef.current) {
				poseLandmarkerRef.current.close()
			}
			if (stream) {
				stream.getTracks().forEach((t) => t.stop())
			}
		}
	}, [exerciseId])

	function drawLoop() {
		const video = webcamRef.current
		const canvas = canvasRef.current
		const landmarker = poseLandmarkerRef.current
		
		if (!video || !canvas || !landmarker) {
			console.warn("⚠️ Draw loop missing dependencies:", { 
				hasVideo: !!video, 
				hasCanvas: !!canvas, 
				hasLandmarker: !!landmarker 
			})
			return
		}

		const ctx = canvas.getContext("2d")
		if (!ctx) {
			console.error("❌ Could not get canvas context")
			return
		}
		
		// Set canvas size to match video
		if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
			canvas.width = video.videoWidth
			canvas.height = video.videoHeight
			console.log(`📐 Canvas sized to ${canvas.width}x${canvas.height}`)
		}

		try {
			const timestamp = performance.now()
			const results = landmarker.detectForVideo(video, timestamp)

			ctx.clearRect(0, 0, canvas.width, canvas.height)

			if (results.landmarks && results.landmarks[0]) {
				const lm = results.landmarks[0]

			// Draw simple skeleton
			const connections: [number, number][] = [
				[LM.LEFT_SHOULDER, LM.RIGHT_SHOULDER],
				[LM.LEFT_SHOULDER, LM.LEFT_ELBOW],
				[LM.LEFT_ELBOW, LM.LEFT_WRIST],
				[LM.RIGHT_SHOULDER, LM.RIGHT_ELBOW],
				[LM.RIGHT_ELBOW, LM.RIGHT_WRIST],
				[LM.LEFT_SHOULDER, LM.LEFT_HIP],
				[LM.RIGHT_SHOULDER, LM.RIGHT_HIP],
				[LM.LEFT_HIP, LM.RIGHT_HIP],
				[LM.LEFT_HIP, LM.LEFT_KNEE],
				[LM.LEFT_KNEE, LM.LEFT_ANKLE],
				[LM.RIGHT_HIP, LM.RIGHT_KNEE],
				[LM.RIGHT_KNEE, LM.RIGHT_ANKLE],
			]

			ctx.strokeStyle = "#00ff00"
			ctx.lineWidth = 5
			connections.forEach(([a, b]) => {
				const pa = lm[a]
				const pb = lm[b]
				ctx.beginPath()
				ctx.moveTo(pa.x * canvas.width, pa.y * canvas.height)
				ctx.lineTo(pb.x * canvas.width, pb.y * canvas.height)
				ctx.stroke()
			})

			// Compute angles of interest for this exercise
			const angleMap: Record<string, number> = {}
			const exCfg = getExerciseConfig(exerciseId)
			const addAngle = (name: string, val: number) => {
				if (!exCfg || exCfg.anglesOfInterest.includes(name)) angleMap[name] = val
			}

			// Knees
			const LHIP = [lm[LM.LEFT_HIP].x * canvas.width, lm[LM.LEFT_HIP].y * canvas.height]
			const LKNEE = [lm[LM.LEFT_KNEE].x * canvas.width, lm[LM.LEFT_KNEE].y * canvas.height]
			const LANK = [lm[LM.LEFT_ANKLE].x * canvas.width, lm[LM.LEFT_ANKLE].y * canvas.height]
			const RHIP = [lm[LM.RIGHT_HIP].x * canvas.width, lm[LM.RIGHT_HIP].y * canvas.height]
			const RKNEE = [lm[LM.RIGHT_KNEE].x * canvas.width, lm[LM.RIGHT_KNEE].y * canvas.height]
			const RANK = [lm[LM.RIGHT_ANKLE].x * canvas.width, lm[LM.RIGHT_ANKLE].y * canvas.height]

			const leftKnee = angle3(LHIP, LKNEE, LANK)
			const rightKnee = angle3(RHIP, RKNEE, RANK)
			addAngle("left_knee", leftKnee)
			addAngle("right_knee", rightKnee)

			// Hips
			const LSHO = [lm[LM.LEFT_SHOULDER].x * canvas.width, lm[LM.LEFT_SHOULDER].y * canvas.height]
			const RSHO = [lm[LM.RIGHT_SHOULDER].x * canvas.width, lm[LM.RIGHT_SHOULDER].y * canvas.height]
			const leftHip = angle3(LSHO, LHIP, LKNEE)
			const rightHip = angle3(RSHO, RHIP, RKNEE)
			addAngle("left_hip", leftHip)
			addAngle("right_hip", rightHip)

			// Elbows (used by some exercises)
			const LELB = [lm[LM.LEFT_ELBOW].x * canvas.width, lm[LM.LEFT_ELBOW].y * canvas.height]
			const RELB = [lm[LM.RIGHT_ELBOW].x * canvas.width, lm[LM.RIGHT_ELBOW].y * canvas.height]
			const LWR = [lm[LM.LEFT_WRIST].x * canvas.width, lm[LM.LEFT_WRIST].y * canvas.height]
			const RWR = [lm[LM.RIGHT_WRIST].x * canvas.width, lm[LM.RIGHT_WRIST].y * canvas.height]
			const leftElbow = angle3(LSHO, LELB, LWR)
			const rightElbow = angle3(RSHO, RELB, RWR)
			addAngle("left_elbow", leftElbow)
			addAngle("right_elbow", rightElbow)

			// Draw angle text near joints we computed
			ctx.fillStyle = "#00ffff"
			ctx.font = "bold 16px Arial"
			ctx.strokeStyle = "#000"
			ctx.lineWidth = 3
			// Right knee label
			ctx.strokeText(`${Math.round(rightKnee)}°`, lm[LM.RIGHT_KNEE].x * canvas.width + 12, lm[LM.RIGHT_KNEE].y * canvas.height - 8)
			ctx.fillText(`${Math.round(rightKnee)}°`, lm[LM.RIGHT_KNEE].x * canvas.width + 12, lm[LM.RIGHT_KNEE].y * canvas.height - 8)
			// Left knee label
			ctx.strokeText(`${Math.round(leftKnee)}°`, lm[LM.LEFT_KNEE].x * canvas.width - 50, lm[LM.LEFT_KNEE].y * canvas.height - 8)
			ctx.fillText(`${Math.round(leftKnee)}°`, lm[LM.LEFT_KNEE].x * canvas.width - 50, lm[LM.LEFT_KNEE].y * canvas.height - 8)

			// Detect current state using thresholds
			const stateCfg = getExerciseStateConfig(exerciseId)
			if (stateCfg) {
				const state = detectState(angleMap, stateCfg)

				// Simple dwell-time hysteresis: require 200ms before accepting a new state
				const now = performance.now()
				if (state !== currentState) {
					if (lastStateChangeTimeRef.current === 0) {
						lastStateChangeTimeRef.current = now
					} else if (now - lastStateChangeTimeRef.current > 200) {
						setCurrentState(state)
						lastStateChangeTimeRef.current = now
						if (repCounterRef.current && state) {
							// Feed state into rep counter
							repCounterRef.current.addState(state)
							const reps = repCounterRef.current.getRepCount()
							setCorrectReps(reps)
						}
					}
				} else {
					lastStateChangeTimeRef.current = now
				}

				// HUD box
				ctx.fillStyle = "rgba(0,0,0,0.6)"
				ctx.fillRect(10, 10, 260, 90)
				ctx.fillStyle = "#ffffff"
				ctx.font = "bold 18px Arial"
				ctx.fillText(`State: ${state ?? "unknown"}`, 20, 35)
				ctx.font = "14px Arial"
				ctx.fillText(`Correct reps: ${correctReps}`, 20, 60)
				ctx.fillText(`Incorrect reps: ${incorrectReps}`, 20, 80)
			}
		} catch (e) {
			console.error("❌ Error in draw loop:", e)
		}

		animationFrameRef.current = requestAnimationFrame(drawLoop)
	}

	const resetSession = () => {
		setCorrectReps(0)
		setIncorrectReps(0)
		setCurrentState(null)
		lastStateChangeTimeRef.current = 0
		const cfg = getExerciseStateConfig(exerciseId)
		if (cfg) repCounterRef.current = new RepCounter(cfg)
	}

	return (
		<Card className="p-4">
			<div className="flex items-center justify-between mb-3">
				<h3 className="font-semibold">Live Comparison</h3>
				<Button variant="outline" onClick={resetSession}>Reset</Button>
			</div>

			<div className="relative aspect-video bg-black rounded overflow-hidden">
				<video ref={webcamRef} className="absolute inset-0 w-full h-full object-contain" muted playsInline />
				<canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
			</div>

			{!isReady && (
				<div className="mt-3 text-sm text-muted-foreground">Initializing camera and pose model…</div>
			)}
		</Card>
	)
}

