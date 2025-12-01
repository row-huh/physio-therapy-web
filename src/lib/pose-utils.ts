let detector: any = null
let isInitialized = false

// Simulated keypoint names (standard pose keypoints)
const KEYPOINT_NAMES = [
  "NOSE",
  "LEFT_EYE",
  "RIGHT_EYE",
  "LEFT_EAR",
  "RIGHT_EAR",
  "LEFT_SHOULDER",
  "RIGHT_SHOULDER",
  "LEFT_ELBOW",
  "RIGHT_ELBOW",
  "LEFT_WRIST",
  "RIGHT_WRIST",
  "LEFT_HIP",
  "RIGHT_HIP",
  "LEFT_KNEE",
  "RIGHT_KNEE",
  "LEFT_ANKLE",
  "RIGHT_ANKLE",
]

export interface KeyPoint {
  x: number
  y: number
  score: number
  name: string
}

export interface Pose {
  keypoints: KeyPoint[]
  score: number
  timestamp: number
}

export interface KeyPoseFrame {
  name: string
  pose: Pose
  description?: string
}

// Initialize pose detector using TensorFlow.js PoseNet for better browser compatibility
export async function initializePoseDetector() {
  if (isInitialized && detector) return detector

  try {
    console.log("[v0] Loading TensorFlow.js PoseNet...")

    // Load TensorFlow.js libraries
    await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4")
    await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet@2")

    const tf = (window as any).tf
    const posenet = (window as any).posenet

    if (!posenet || !tf) {
      throw new Error("TensorFlow or PoseNet failed to load")
    }

    // Load pre-trained model
    detector = await posenet.load({
      architecture: "MobileNetV1",
      outputStride: 16,
      inputResolution: { width: 640, height: 480 },
      multiplier: 0.75,
    })

    isInitialized = true
    console.log("[v0] PoseNet initialized successfully")
    return detector
  } catch (error) {
    console.error("[v0] Failed to initialize pose detector:", error)
    return null
  }
}

// Helper function to load scripts
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(script)
  })
}

// Detect pose from video element
export async function detectPose(input: HTMLVideoElement | HTMLCanvasElement): Promise<Pose | null> {
  if (!detector) {
    console.log("[v0] Detector not initialized")
    return null
  }

  try {
    const pose = await detector.estimateSinglePose(input, {
      flipHorizontal: false,
    })

    if (!pose || !pose.keypoints) {
      return null
    }

    // Convert PoseNet format to our Pose format
    const keypoints: KeyPoint[] = pose.keypoints.map((kp: any, idx: number) => ({
      x: kp.position.x,
      y: kp.position.y,
      score: kp.score,
      name: KEYPOINT_NAMES[idx] || `KEYPOINT_${idx}`,
    }))

    // Calculate average confidence score
    const avgScore = keypoints.reduce((sum, kp) => sum + kp.score, 0) / keypoints.length

    return {
      keypoints,
      score: avgScore,
      timestamp: Date.now(),
    }
  } catch (error) {
    console.error("[v0] Pose detection error:", error)
    return null
  }
}

// Calculate similarity between two poses (0-1, where 1 is identical)
export function calculatePoseSimilarity(pose1: Pose, pose2: Pose): number {
  if (pose1.keypoints.length !== pose2.keypoints.length) return 0

  let totalDistance = 0
  let validKeypoints = 0

  for (let i = 0; i < pose1.keypoints.length; i++) {
    const kp1 = pose1.keypoints[i]
    const kp2 = pose2.keypoints[i]

    // Only consider keypoints with good confidence
    if (kp1.score > 0.3 && kp2.score > 0.3) {
      const dx = kp1.x - kp2.x
      const dy = kp1.y - kp2.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      totalDistance += distance
      validKeypoints++
    }
  }

  if (validKeypoints === 0) return 0

  const avgDistance = totalDistance / validKeypoints
  const maxDistance = 300
  const similarity = Math.max(0, 1 - avgDistance / maxDistance)

  return similarity
}

// Extract key bodyparts for comparison
export function getKeyBodyParts(pose: Pose): Record<string, KeyPoint[]> {
  const groups: Record<string, string[]> = {
    legs: ["LEFT_HIP", "LEFT_KNEE", "LEFT_ANKLE", "RIGHT_HIP", "RIGHT_KNEE", "RIGHT_ANKLE"],
    torso: ["NOSE", "LEFT_SHOULDER", "RIGHT_SHOULDER", "LEFT_HIP", "RIGHT_HIP"],
    arms: ["LEFT_SHOULDER", "LEFT_ELBOW", "LEFT_WRIST", "RIGHT_SHOULDER", "RIGHT_ELBOW", "RIGHT_WRIST"],
  }

  const result: Record<string, KeyPoint[]> = {}

  for (const [group, names] of Object.entries(groups)) {
    result[group] = pose.keypoints.filter((kp) => names.includes(kp.name))
  }

  return result
}

// Classify pose based on body angles
export function classifyPosture(pose: Pose): string {
  const bodyParts = getKeyBodyParts(pose)
  const legs = bodyParts.legs

  if (legs.length < 6) return "unknown"

  const leftKnee = legs.find((kp) => kp.name === "LEFT_KNEE")
  const leftHip = legs.find((kp) => kp.name === "LEFT_HIP")
  const leftAnkle = legs.find((kp) => kp.name === "LEFT_ANKLE")

  if (!leftKnee || !leftHip || !leftAnkle) return "unknown"

  const hipToKneeDist = Math.hypot(leftHip.x - leftKnee.x, leftHip.y - leftKnee.y)
  const kneeToAnkleDist = Math.hypot(leftKnee.x - leftAnkle.x, leftKnee.y - leftAnkle.y)
  const totalLegDist = hipToKneeDist + kneeToAnkleDist

  const verticalDist = Math.abs(leftHip.y - leftAnkle.y)
  const bendRatio = verticalDist / totalLegDist

  if (bendRatio > 0.85) return "standing"
  if (bendRatio > 0.5) return "halfway_bent"
  return "full_squat"
}
