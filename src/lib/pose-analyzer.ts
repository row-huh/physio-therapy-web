import { PoseLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision"

export interface JointAngle {
  joint: string
  angle: number
  timestamp: number
}

export interface MovementSequence {
  joint: string
  startAngle: number
  endAngle: number
  startTime: number
  endTime: number
  duration: number
  angleDelta: number
}

export interface PoseAnalysisResult {
  jointAngles: JointAngle[]
  movements: MovementSequence[]
  summary: string
}

// MediaPipe Pose landmark indices
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
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
}

/**
 * Calculate angle between three points (in degrees)
 * @param a First point [x, y]
 * @param b Middle point (vertex) [x, y]
 * @param c Third point [x, y]
 */
function calculateAngle(a: number[], b: number[], c: number[]): number {
  const radians =
    Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0])
  let angle = Math.abs((radians * 180.0) / Math.PI)
  
  if (angle > 180.0) {
    angle = 360.0 - angle
  }
  
  return angle
}

/**
 * Analyze a video and extract joint movement information
 */
export async function analyzeVideoForPose(videoBlob: Blob): Promise<PoseAnalysisResult> {
  console.log("Starting pose analysis...")
  
  // Initialize MediaPipe
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm"
  )
  
  const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numPoses: 1,
  })

  // Create video element from blob
  const videoUrl = URL.createObjectURL(videoBlob)
  const video = document.createElement("video")
  video.src = videoUrl
  video.muted = true
  
  await new Promise((resolve) => {
    video.onloadedmetadata = resolve
  })

  const jointAngles: JointAngle[] = []
  const fps = 5 // Process 5 frames per second to reduce computation
  const frameInterval = 1000 / fps
  
  console.log(`Video duration: ${video.duration}s`)
  
  // Process video frames
  for (let time = 0; time < video.duration * 1000; time += frameInterval) {
    video.currentTime = time / 1000
    
    await new Promise((resolve) => {
      video.onseeked = resolve
    })
    
    // Detect pose
    const timestamp = video.currentTime * 1000
    const results = poseLandmarker.detectForVideo(video, timestamp)
    
    if (results.landmarks && results.landmarks.length > 0) {
      const landmarks = results.landmarks[0]
      
      // Calculate angles for key joints
      const angles = calculateJointAngles(landmarks)
      
      angles.forEach((angleData) => {
        jointAngles.push({
          ...angleData,
          timestamp: video.currentTime,
        })
      })
    }
    
    console.log(`Processed frame at ${video.currentTime.toFixed(2)}s`)
  }
  
  console.log(`Total joint angles detected: ${jointAngles.length}`)
  
  // Analyze movements
  const movements = detectMovements(jointAngles)
  
  // Generate summary
  const summary = generateSummary(movements)
  
  // Cleanup
  URL.revokeObjectURL(videoUrl)
  poseLandmarker.close()
  
  return {
    jointAngles,
    movements,
    summary,
  }
}

/**
 * Calculate angles for key joints from landmarks
 */
function calculateJointAngles(landmarks: any[]): Omit<JointAngle, "timestamp">[] {
  const angles: Omit<JointAngle, "timestamp">[] = []
  
  // Helper to get landmark coordinates
  const getLandmark = (index: number) => [landmarks[index].x, landmarks[index].y]
  
  // Left elbow angle (shoulder-elbow-wrist)
  try {
    const leftElbowAngle = calculateAngle(
      getLandmark(POSE_LANDMARKS.LEFT_SHOULDER),
      getLandmark(POSE_LANDMARKS.LEFT_ELBOW),
      getLandmark(POSE_LANDMARKS.LEFT_WRIST)
    )
    angles.push({ joint: "left_elbow", angle: leftElbowAngle })
  } catch (e) {
    console.warn("Could not calculate left elbow angle")
  }
  
  // Right elbow angle
  try {
    const rightElbowAngle = calculateAngle(
      getLandmark(POSE_LANDMARKS.RIGHT_SHOULDER),
      getLandmark(POSE_LANDMARKS.RIGHT_ELBOW),
      getLandmark(POSE_LANDMARKS.RIGHT_WRIST)
    )
    angles.push({ joint: "right_elbow", angle: rightElbowAngle })
  } catch (e) {
    console.warn("Could not calculate right elbow angle")
  }
  
  // Left knee angle (hip-knee-ankle)
  try {
    const leftKneeAngle = calculateAngle(
      getLandmark(POSE_LANDMARKS.LEFT_HIP),
      getLandmark(POSE_LANDMARKS.LEFT_KNEE),
      getLandmark(POSE_LANDMARKS.LEFT_ANKLE)
    )
    angles.push({ joint: "left_knee", angle: leftKneeAngle })
  } catch (e) {
    console.warn("Could not calculate left knee angle")
  }
  
  // Right knee angle
  try {
    const rightKneeAngle = calculateAngle(
      getLandmark(POSE_LANDMARKS.RIGHT_HIP),
      getLandmark(POSE_LANDMARKS.RIGHT_KNEE),
      getLandmark(POSE_LANDMARKS.RIGHT_ANKLE)
    )
    angles.push({ joint: "right_knee", angle: rightKneeAngle })
  } catch (e) {
    console.warn("Could not calculate right knee angle")
  }
  
  // Left hip angle (shoulder-hip-knee)
  try {
    const leftHipAngle = calculateAngle(
      getLandmark(POSE_LANDMARKS.LEFT_SHOULDER),
      getLandmark(POSE_LANDMARKS.LEFT_HIP),
      getLandmark(POSE_LANDMARKS.LEFT_KNEE)
    )
    angles.push({ joint: "left_hip", angle: leftHipAngle })
  } catch (e) {
    console.warn("Could not calculate left hip angle")
  }
  
  // Right hip angle
  try {
    const rightHipAngle = calculateAngle(
      getLandmark(POSE_LANDMARKS.RIGHT_SHOULDER),
      getLandmark(POSE_LANDMARKS.RIGHT_HIP),
      getLandmark(POSE_LANDMARKS.RIGHT_KNEE)
    )
    angles.push({ joint: "right_hip", angle: rightHipAngle })
  } catch (e) {
    console.warn("Could not calculate right hip angle")
  }
  
  // Left shoulder angle (elbow-shoulder-hip)
  try {
    const leftShoulderAngle = calculateAngle(
      getLandmark(POSE_LANDMARKS.LEFT_ELBOW),
      getLandmark(POSE_LANDMARKS.LEFT_SHOULDER),
      getLandmark(POSE_LANDMARKS.LEFT_HIP)
    )
    angles.push({ joint: "left_shoulder", angle: leftShoulderAngle })
  } catch (e) {
    console.warn("Could not calculate left shoulder angle")
  }
  
  // Right shoulder angle
  try {
    const rightShoulderAngle = calculateAngle(
      getLandmark(POSE_LANDMARKS.RIGHT_ELBOW),
      getLandmark(POSE_LANDMARKS.RIGHT_SHOULDER),
      getLandmark(POSE_LANDMARKS.RIGHT_HIP)
    )
    angles.push({ joint: "right_shoulder", angle: rightShoulderAngle })
  } catch (e) {
    console.warn("Could not calculate right shoulder angle")
  }
  
  return angles
}

/**
 * Detect significant movements from joint angle data
 */
function detectMovements(jointAngles: JointAngle[]): MovementSequence[] {
  const movements: MovementSequence[] = []
  const ANGLE_THRESHOLD = 15 // Minimum angle change to consider as movement
  const TIME_THRESHOLD = 0.5 // Minimum time (seconds) to hold position
  
  // Group by joint
  const jointGroups = new Map<string, JointAngle[]>()
  jointAngles.forEach((ja) => {
    if (!jointGroups.has(ja.joint)) {
      jointGroups.set(ja.joint, [])
    }
    jointGroups.get(ja.joint)!.push(ja)
  })
  
  // Analyze each joint
  jointGroups.forEach((angles, joint) => {
    if (angles.length < 2) return
    
    let currentSegment: JointAngle | null = angles[0]
    
    for (let i = 1; i < angles.length; i++) {
      const angle = angles[i]
      const angleDelta = Math.abs(angle.angle - currentSegment!.angle)
      const timeDelta = angle.timestamp - currentSegment!.timestamp
      
      // Detect significant movement or hold
      if (angleDelta > ANGLE_THRESHOLD || i === angles.length - 1) {
        if (timeDelta >= TIME_THRESHOLD || i === angles.length - 1) {
          movements.push({
            joint,
            startAngle: currentSegment!.angle,
            endAngle: angles[i - 1].angle,
            startTime: currentSegment!.timestamp,
            endTime: angles[i - 1].timestamp,
            duration: angles[i - 1].timestamp - currentSegment!.timestamp,
            angleDelta: angles[i - 1].angle - currentSegment!.angle,
          })
        }
        currentSegment = angle
      }
    }
  })
  
  return movements.sort((a, b) => a.startTime - b.startTime)
}

/**
 * Generate human-readable summary of movements
 */
function generateSummary(movements: MovementSequence[]): string {
  if (movements.length === 0) {
    return "No significant movements detected."
  }
  
  const summaryLines: string[] = []
  
  movements.forEach((movement, index) => {
    const direction = movement.angleDelta > 0 ? "extended" : "flexed"
    const angleMagnitude = Math.abs(movement.angleDelta).toFixed(1)
    
    summaryLines.push(
      `${index + 1}. ${movement.joint.replace("_", " ").toUpperCase()}: ` +
      `${direction} by ${angleMagnitude}° (${movement.startAngle.toFixed(1)}° → ${movement.endAngle.toFixed(1)}°) ` +
      `at ${movement.startTime.toFixed(1)}s, held for ${movement.duration.toFixed(1)}s`
    )
  })
  
  return summaryLines.join("\n")
}
