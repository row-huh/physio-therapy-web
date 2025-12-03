"use client""use client"



import { useEffect, useRef, useState } from "react"import { useEffect, useRef, useState } from "react"

import { Card } from "@/components/ui/card"import { Card } from "@/components/ui/card"

import { Button } from "@/components/ui/button"import { Button } from "@/components/ui/button"

import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision"import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision"

import { getExerciseStateConfig, detectState, RepCounter } from "@/lib/exercise-states"import { getExerciseStateConfig, detectState, RepCounter } from "@/lib/exercise-states"

import { getExerciseConfig } from "@/lib/exercise-config"import { getExerciseConfig } from "@/lib/exercise-config"



interface LiveComparisonProps {interface LiveComparisonProps {

	exerciseId: string	exerciseId: string

}}



const LM = {// MediaPipe landmark indices

	LEFT_SHOULDER: 11,const LM = {

	RIGHT_SHOULDER: 12,	LEFT_SHOULDER: 11,

	LEFT_ELBOW: 13,	RIGHT_SHOULDER: 12,

	RIGHT_ELBOW: 14,	LEFT_ELBOW: 13,

	LEFT_WRIST: 15,	RIGHT_ELBOW: 14,

	RIGHT_WRIST: 16,	LEFT_WRIST: 15,

	LEFT_HIP: 23,	RIGHT_WRIST: 16,

	RIGHT_HIP: 24,	LEFT_HIP: 23,

	LEFT_KNEE: 25,	RIGHT_HIP: 24,

	RIGHT_KNEE: 26,	LEFT_KNEE: 25,

	LEFT_ANKLE: 27,	RIGHT_KNEE: 26,

	RIGHT_ANKLE: 28,	LEFT_ANKLE: 27,

}	RIGHT_ANKLE: 28,

}

function angle3(a: number[], b: number[], c: number[]): number {

	const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0])function angle3(a: number[], b: number[], c: number[]): number {

	let angle = Math.abs((radians * 180.0) / Math.PI)	const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0])

	if (angle > 180.0) angle = 360.0 - angle	let angle = Math.abs((radians * 180.0) / Math.PI)

	return angle	if (angle > 180.0) angle = 360.0 - angle

}	return angle

}

export default function LiveComparison({ exerciseId }: LiveComparisonProps) {

	const webcamRef = useRef<HTMLVideoElement>(null)export default function LiveComparison({ exerciseId }: LiveComparisonProps) {

	const canvasRef = useRef<HTMLCanvasElement>(null)	const webcamRef = useRef<HTMLVideoElement>(null)

	const [isReady, setIsReady] = useState(false)	const canvasRef = useRef<HTMLCanvasElement>(null)

	const [error, setError] = useState<string | null>(null)	const [isReady, setIsReady] = useState(false)

	const [currentState, setCurrentState] = useState<string | null>(null)	const [error, setError] = useState<string | null>(null)

	const [correctReps, setCorrectReps] = useState(0)	const [currentState, setCurrentState] = useState<string | null>(null)

	const [incorrectReps, setIncorrectReps] = useState(0)	const [correctReps, setCorrectReps] = useState(0)

	const poseLandmarkerRef = useRef<PoseLandmarker | null>(null)	const [incorrectReps, setIncorrectReps] = useState(0)

	const repCounterRef = useRef<RepCounter | null>(null)	const poseLandmarkerRef = useRef<PoseLandmarker | null>(null)

	const lastStateChangeTimeRef = useRef<number>(0)	const repCounterRef = useRef<RepCounter | null>(null)

	const animationFrameRef = useRef<number | null>(null)	const lastStateChangeTimeRef = useRef<number>(0)

	const animationFrameRef = useRef<number | null>(null)

	useEffect(() => {

		console.log("🎬 LiveComparison mounting with exerciseId:", exerciseId)	useEffect(() => {

		let stream: MediaStream | null = null		console.log("🎬 LiveComparison mounting with exerciseId:", exerciseId)

		let stream: MediaStream | null = null

		async function setup() {

			try {		async function setup() {

				console.log("📹 Requesting camera access...")			try {

				stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false })				console.log("📹 Requesting camera access...")

				console.log("✅ Camera access granted")				// Camera

								stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false })

				if (webcamRef.current) {				console.log("✅ Camera access granted")

					webcamRef.current.srcObject = stream				

					await webcamRef.current.play()				if (webcamRef.current) {

					console.log("✅ Webcam video playing")					webcamRef.current.srcObject = stream

				}					await webcamRef.current.play()

					console.log("✅ Webcam video playing")

				console.log("🤖 Initializing MediaPipe...")				}

				const vision = await FilesetResolver.forVisionTasks(

					"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm"				console.log("🤖 Initializing MediaPipe...")

				)				// MediaPipe

				console.log("✅ MediaPipe vision loaded")				const vision = await FilesetResolver.forVisionTasks(

									"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm"

				const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {				)

					baseOptions: {				console.log("✅ MediaPipe vision loaded")

						modelAssetPath:				

							"https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",				const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {

						delegate: "GPU",					baseOptions: {

					},						modelAssetPath:

					runningMode: "VIDEO",							"https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",

					numPoses: 1,						delegate: "GPU",

					minPoseDetectionConfidence: 0.5,					},

					minPosePresenceConfidence: 0.5,					runningMode: "VIDEO",

					minTrackingConfidence: 0.5,					numPoses: 1,

				})					minPoseDetectionConfidence: 0.5,

				poseLandmarkerRef.current = poseLandmarker					minPosePresenceConfidence: 0.5,

				console.log("✅ PoseLandmarker created")					minTrackingConfidence: 0.5,

				})

				const stateCfg = getExerciseStateConfig(exerciseId)				poseLandmarkerRef.current = poseLandmarker

				if (stateCfg) {				console.log("✅ PoseLandmarker created")

					repCounterRef.current = new RepCounter(stateCfg)

					console.log("✅ RepCounter initialized for:", exerciseId)				// Rep counter based on exercise config

				} else {				const stateCfg = getExerciseStateConfig(exerciseId)

					console.warn("⚠️ No state config found for:", exerciseId)				if (stateCfg) {

				}					repCounterRef.current = new RepCounter(stateCfg)

					console.log("✅ RepCounter initialized for:", exerciseId)

				setIsReady(true)				} else {

				console.log("🎉 Setup complete, starting draw loop")					console.warn("⚠️ No state config found for:", exerciseId)

				drawLoop()				}

			} catch (e) {

				console.error("❌ LiveComparison setup error:", e)				setIsReady(true)

				setError(e instanceof Error ? e.message : "Setup failed")				console.log("🎉 Setup complete, starting draw loop")

			}				drawLoop()

		}			} catch (e) {

				console.error("❌ LiveComparison setup error:", e)

		setup()				setError(e instanceof Error ? e.message : "Setup failed")

			}

		return () => {		}

			console.log("🧹 Cleaning up LiveComparison")

			if (animationFrameRef.current) {		setup()

				cancelAnimationFrame(animationFrameRef.current)

			}		return () => {

			if (poseLandmarkerRef.current) {			console.log("🧹 Cleaning up LiveComparison")

				poseLandmarkerRef.current.close()			if (animationFrameRef.current) {

			}				cancelAnimationFrame(animationFrameRef.current)

			if (stream) {			}

				stream.getTracks().forEach((t) => t.stop())			if (poseLandmarkerRef.current) {

			}				poseLandmarkerRef.current.close()

		}			}

	}, [exerciseId])			if (stream) {

				stream.getTracks().forEach((t) => t.stop())

	function drawLoop() {			}

		const video = webcamRef.current		}

		const canvas = canvasRef.current	}, [exerciseId])

		const landmarker = poseLandmarkerRef.current

			function drawLoop() {

		if (!video || !canvas || !landmarker) return		const video = webcamRef.current

		const canvas = canvasRef.current

		const ctx = canvas.getContext("2d")		const landmarker = poseLandmarkerRef.current

		if (!ctx) return		

				if (!video || !canvas || !landmarker) {

		if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {			console.warn("⚠️ Draw loop missing dependencies:", { 

			canvas.width = video.videoWidth				hasVideo: !!video, 

			canvas.height = video.videoHeight				hasCanvas: !!canvas, 

		}				hasLandmarker: !!landmarker 

			})

		try {			return

			const timestamp = performance.now()		}

			const results = landmarker.detectForVideo(video, timestamp)

			ctx.clearRect(0, 0, canvas.width, canvas.height)		const ctx = canvas.getContext("2d")

		if (!ctx) {

			if (results.landmarks && results.landmarks[0]) {			console.error("❌ Could not get canvas context")

				const lm = results.landmarks[0]			return

		}

				const connections: [number, number][] = [		

					[LM.LEFT_SHOULDER, LM.RIGHT_SHOULDER],		// Set canvas size to match video

					[LM.LEFT_SHOULDER, LM.LEFT_ELBOW],		if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {

					[LM.LEFT_ELBOW, LM.LEFT_WRIST],			canvas.width = video.videoWidth

					[LM.RIGHT_SHOULDER, LM.RIGHT_ELBOW],			canvas.height = video.videoHeight

					[LM.RIGHT_ELBOW, LM.RIGHT_WRIST],			console.log(`📐 Canvas sized to ${canvas.width}x${canvas.height}`)

					[LM.LEFT_SHOULDER, LM.LEFT_HIP],		}

					[LM.RIGHT_SHOULDER, LM.RIGHT_HIP],

					[LM.LEFT_HIP, LM.RIGHT_HIP],		try {

					[LM.LEFT_HIP, LM.LEFT_KNEE],			const timestamp = performance.now()

					[LM.LEFT_KNEE, LM.LEFT_ANKLE],			const results = landmarker.detectForVideo(video, timestamp)

					[LM.RIGHT_HIP, LM.RIGHT_KNEE],

					[LM.RIGHT_KNEE, LM.RIGHT_ANKLE],			ctx.clearRect(0, 0, canvas.width, canvas.height)

				]

			if (results.landmarks && results.landmarks[0]) {

				ctx.strokeStyle = "#00ff00"				const lm = results.landmarks[0]

				ctx.lineWidth = 5

				connections.forEach(([a, b]) => {			// Draw simple skeleton

					const pa = lm[a]			const connections: [number, number][] = [

					const pb = lm[b]				[LM.LEFT_SHOULDER, LM.RIGHT_SHOULDER],

					ctx.beginPath()				[LM.LEFT_SHOULDER, LM.LEFT_ELBOW],

					ctx.moveTo(pa.x * canvas.width, pa.y * canvas.height)				[LM.LEFT_ELBOW, LM.LEFT_WRIST],

					ctx.lineTo(pb.x * canvas.width, pb.y * canvas.height)				[LM.RIGHT_SHOULDER, LM.RIGHT_ELBOW],

					ctx.stroke()				[LM.RIGHT_ELBOW, LM.RIGHT_WRIST],

				})				[LM.LEFT_SHOULDER, LM.LEFT_HIP],

				[LM.RIGHT_SHOULDER, LM.RIGHT_HIP],

				const angleMap: Record<string, number> = {}				[LM.LEFT_HIP, LM.RIGHT_HIP],

				const exCfg = getExerciseConfig(exerciseId)				[LM.LEFT_HIP, LM.LEFT_KNEE],

				const addAngle = (name: string, val: number) => {				[LM.LEFT_KNEE, LM.LEFT_ANKLE],

					if (!exCfg || exCfg.anglesOfInterest.includes(name)) angleMap[name] = val				[LM.RIGHT_HIP, LM.RIGHT_KNEE],

				}				[LM.RIGHT_KNEE, LM.RIGHT_ANKLE],

			]

				const LHIP = [lm[LM.LEFT_HIP].x * canvas.width, lm[LM.LEFT_HIP].y * canvas.height]

				const LKNEE = [lm[LM.LEFT_KNEE].x * canvas.width, lm[LM.LEFT_KNEE].y * canvas.height]			ctx.strokeStyle = "#00ff00"

				const LANK = [lm[LM.LEFT_ANKLE].x * canvas.width, lm[LM.LEFT_ANKLE].y * canvas.height]			ctx.lineWidth = 5

				const RHIP = [lm[LM.RIGHT_HIP].x * canvas.width, lm[LM.RIGHT_HIP].y * canvas.height]			connections.forEach(([a, b]) => {

				const RKNEE = [lm[LM.RIGHT_KNEE].x * canvas.width, lm[LM.RIGHT_KNEE].y * canvas.height]				const pa = lm[a]

				const RANK = [lm[LM.RIGHT_ANKLE].x * canvas.width, lm[LM.RIGHT_ANKLE].y * canvas.height]				const pb = lm[b]

				ctx.beginPath()

				const leftKnee = angle3(LHIP, LKNEE, LANK)				ctx.moveTo(pa.x * canvas.width, pa.y * canvas.height)

				const rightKnee = angle3(RHIP, RKNEE, RANK)				ctx.lineTo(pb.x * canvas.width, pb.y * canvas.height)

				addAngle("left_knee", leftKnee)				ctx.stroke()

				addAngle("right_knee", rightKnee)			})



				const LSHO = [lm[LM.LEFT_SHOULDER].x * canvas.width, lm[LM.LEFT_SHOULDER].y * canvas.height]			// Compute angles of interest for this exercise

				const RSHO = [lm[LM.RIGHT_SHOULDER].x * canvas.width, lm[LM.RIGHT_SHOULDER].y * canvas.height]			const angleMap: Record<string, number> = {}

				const leftHip = angle3(LSHO, LHIP, LKNEE)			const exCfg = getExerciseConfig(exerciseId)

				const rightHip = angle3(RSHO, RHIP, RKNEE)			const addAngle = (name: string, val: number) => {

				addAngle("left_hip", leftHip)				if (!exCfg || exCfg.anglesOfInterest.includes(name)) angleMap[name] = val

				addAngle("right_hip", rightHip)			}



				const LELB = [lm[LM.LEFT_ELBOW].x * canvas.width, lm[LM.LEFT_ELBOW].y * canvas.height]			// Knees

				const RELB = [lm[LM.RIGHT_ELBOW].x * canvas.width, lm[LM.RIGHT_ELBOW].y * canvas.height]			const LHIP = [lm[LM.LEFT_HIP].x * canvas.width, lm[LM.LEFT_HIP].y * canvas.height]

				const LWR = [lm[LM.LEFT_WRIST].x * canvas.width, lm[LM.LEFT_WRIST].y * canvas.height]			const LKNEE = [lm[LM.LEFT_KNEE].x * canvas.width, lm[LM.LEFT_KNEE].y * canvas.height]

				const RWR = [lm[LM.RIGHT_WRIST].x * canvas.width, lm[LM.RIGHT_WRIST].y * canvas.height]			const LANK = [lm[LM.LEFT_ANKLE].x * canvas.width, lm[LM.LEFT_ANKLE].y * canvas.height]

				const leftElbow = angle3(LSHO, LELB, LWR)			const RHIP = [lm[LM.RIGHT_HIP].x * canvas.width, lm[LM.RIGHT_HIP].y * canvas.height]

				const rightElbow = angle3(RSHO, RELB, RWR)			const RKNEE = [lm[LM.RIGHT_KNEE].x * canvas.width, lm[LM.RIGHT_KNEE].y * canvas.height]

				addAngle("left_elbow", leftElbow)			const RANK = [lm[LM.RIGHT_ANKLE].x * canvas.width, lm[LM.RIGHT_ANKLE].y * canvas.height]

				addAngle("right_elbow", rightElbow)

			const leftKnee = angle3(LHIP, LKNEE, LANK)

				ctx.fillStyle = "#00ffff"			const rightKnee = angle3(RHIP, RKNEE, RANK)

				ctx.font = "bold 16px Arial"			addAngle("left_knee", leftKnee)

				ctx.strokeStyle = "#000"			addAngle("right_knee", rightKnee)

				ctx.lineWidth = 3

				ctx.strokeText(`${Math.round(rightKnee)}°`, lm[LM.RIGHT_KNEE].x * canvas.width + 12, lm[LM.RIGHT_KNEE].y * canvas.height - 8)			// Hips

				ctx.fillText(`${Math.round(rightKnee)}°`, lm[LM.RIGHT_KNEE].x * canvas.width + 12, lm[LM.RIGHT_KNEE].y * canvas.height - 8)			const LSHO = [lm[LM.LEFT_SHOULDER].x * canvas.width, lm[LM.LEFT_SHOULDER].y * canvas.height]

				ctx.strokeText(`${Math.round(leftKnee)}°`, lm[LM.LEFT_KNEE].x * canvas.width - 50, lm[LM.LEFT_KNEE].y * canvas.height - 8)			const RSHO = [lm[LM.RIGHT_SHOULDER].x * canvas.width, lm[LM.RIGHT_SHOULDER].y * canvas.height]

				ctx.fillText(`${Math.round(leftKnee)}°`, lm[LM.LEFT_KNEE].x * canvas.width - 50, lm[LM.LEFT_KNEE].y * canvas.height - 8)			const leftHip = angle3(LSHO, LHIP, LKNEE)

			const rightHip = angle3(RSHO, RHIP, RKNEE)

				const stateCfg = getExerciseStateConfig(exerciseId)			addAngle("left_hip", leftHip)

				if (stateCfg) {			addAngle("right_hip", rightHip)

					const state = detectState(angleMap, stateCfg)

					const now = performance.now()			// Elbows (used by some exercises)

								const LELB = [lm[LM.LEFT_ELBOW].x * canvas.width, lm[LM.LEFT_ELBOW].y * canvas.height]

					if (state !== currentState) {			const RELB = [lm[LM.RIGHT_ELBOW].x * canvas.width, lm[LM.RIGHT_ELBOW].y * canvas.height]

						if (lastStateChangeTimeRef.current === 0) {			const LWR = [lm[LM.LEFT_WRIST].x * canvas.width, lm[LM.LEFT_WRIST].y * canvas.height]

							lastStateChangeTimeRef.current = now			const RWR = [lm[LM.RIGHT_WRIST].x * canvas.width, lm[LM.RIGHT_WRIST].y * canvas.height]

						} else if (now - lastStateChangeTimeRef.current > 200) {			const leftElbow = angle3(LSHO, LELB, LWR)

							setCurrentState(state)			const rightElbow = angle3(RSHO, RELB, RWR)

							lastStateChangeTimeRef.current = now			addAngle("left_elbow", leftElbow)

							if (repCounterRef.current && state) {			addAngle("right_elbow", rightElbow)

								repCounterRef.current.addState(state)

								const reps = repCounterRef.current.getRepCount()			// Draw angle text near joints we computed

								setCorrectReps(reps)			ctx.fillStyle = "#00ffff"

							}			ctx.font = "bold 16px Arial"

						}			ctx.strokeStyle = "#000"

					} else {			ctx.lineWidth = 3

						lastStateChangeTimeRef.current = now			// Right knee label

					}			ctx.strokeText(`${Math.round(rightKnee)}°`, lm[LM.RIGHT_KNEE].x * canvas.width + 12, lm[LM.RIGHT_KNEE].y * canvas.height - 8)

			ctx.fillText(`${Math.round(rightKnee)}°`, lm[LM.RIGHT_KNEE].x * canvas.width + 12, lm[LM.RIGHT_KNEE].y * canvas.height - 8)

					ctx.fillStyle = "rgba(0,0,0,0.6)"			// Left knee label

					ctx.fillRect(10, 10, 260, 90)			ctx.strokeText(`${Math.round(leftKnee)}°`, lm[LM.LEFT_KNEE].x * canvas.width - 50, lm[LM.LEFT_KNEE].y * canvas.height - 8)

					ctx.fillStyle = "#ffffff"			ctx.fillText(`${Math.round(leftKnee)}°`, lm[LM.LEFT_KNEE].x * canvas.width - 50, lm[LM.LEFT_KNEE].y * canvas.height - 8)

					ctx.font = "bold 18px Arial"

					ctx.fillText(`State: ${state ?? "unknown"}`, 20, 35)			// Detect current state using thresholds

					ctx.font = "14px Arial"			const stateCfg = getExerciseStateConfig(exerciseId)

					ctx.fillText(`Correct reps: ${correctReps}`, 20, 60)			if (stateCfg) {

					ctx.fillText(`Incorrect reps: ${incorrectReps}`, 20, 80)				const state = detectState(angleMap, stateCfg)

				}

			}				// Simple dwell-time hysteresis: require 200ms before accepting a new state

		} catch (e) {				const now = performance.now()

			console.error("❌ Error in draw loop:", e)				if (state !== currentState) {

		}					if (lastStateChangeTimeRef.current === 0) {

						lastStateChangeTimeRef.current = now

		animationFrameRef.current = requestAnimationFrame(drawLoop)					} else if (now - lastStateChangeTimeRef.current > 200) {

	}						setCurrentState(state)

						lastStateChangeTimeRef.current = now

	const resetSession = () => {						if (repCounterRef.current && state) {

		setCorrectReps(0)							// Feed state into rep counter

		setIncorrectReps(0)							repCounterRef.current.addState(state)

		setCurrentState(null)							const reps = repCounterRef.current.getRepCount()

		lastStateChangeTimeRef.current = 0							setCorrectReps(reps)

		const cfg = getExerciseStateConfig(exerciseId)						}

		if (cfg) repCounterRef.current = new RepCounter(cfg)					}

	}				} else {

					lastStateChangeTimeRef.current = now

	return (				}

		<Card className="p-4">

			<div className="flex items-center justify-between mb-3">				// HUD box

				<h3 className="font-semibold">Live Comparison</h3>				ctx.fillStyle = "rgba(0,0,0,0.6)"

				<Button variant="outline" onClick={resetSession}>Reset</Button>				ctx.fillRect(10, 10, 260, 90)

			</div>				ctx.fillStyle = "#ffffff"

				ctx.font = "bold 18px Arial"

			<div className="relative aspect-video bg-black rounded overflow-hidden">				ctx.fillText(`State: ${state ?? "unknown"}`, 20, 35)

				<video ref={webcamRef} className="absolute inset-0 w-full h-full object-contain" muted playsInline />				ctx.font = "14px Arial"

				<canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />				ctx.fillText(`Correct reps: ${correctReps}`, 20, 60)

			</div>				ctx.fillText(`Incorrect reps: ${incorrectReps}`, 20, 80)

			}

			{error && (		} catch (e) {

				<div className="mt-3 text-sm text-red-500">Error: {error}</div>			console.error("❌ Error in draw loop:", e)

			)}		}

			{!isReady && !error && (

				<div className="mt-3 text-sm text-muted-foreground">Initializing camera and pose model…</div>		animationFrameRef.current = requestAnimationFrame(drawLoop)

			)}	}

		</Card>

	)	const resetSession = () => {

}		setCorrectReps(0)

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

