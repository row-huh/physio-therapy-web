import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"

export interface FaceAngle {
  angle: string
  value: number
  timestamp: number
}

export interface FaceAnalysisResult {
  faceAngles: FaceAngle[]
  movements: FaceMovementSequence[]
  summary: string
  learnedTemplate?: import("./exercise-state-learner").LearnedExerciseTemplate
}

export interface FaceMovementSequence {
  angle: string
  startValue: number
  endValue: number
  startTime: number
  endTime: number
  duration: number
  valueDelta: number
}

/**
 * One Euro Filter for temporal smoothing
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
    const t_e = this.t_prev === 0 ? 0 : t - this.t_prev
    
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
}

/**
 * Landmark smoother using One Euro Filters
 */
class LandmarkSmoother {
  private filters: Map<string, { x: OneEuroFilter; y: OneEuroFilter; z: OneEuroFilter }> = new Map()
  
  constructor(
    private min_cutoff: number = 1.0,
    private beta: number = 0.007
  ) {}
  
  smoothLandmarks(landmarks: any[], timestamp: number): any[] {
    return landmarks.map((landmark, index) => {
      const key = `landmark_${index}`
      
      if (!this.filters.has(key)) {
        this.filters.set(key, {
          x: new OneEuroFilter(this.min_cutoff, this.beta),
          y: new OneEuroFilter(this.min_cutoff, this.beta),
          z: new OneEuroFilter(this.min_cutoff, this.beta),
        })
      }
      
      const filter = this.filters.get(key)!
      
      return {
        x: filter.x.filter(landmark.x, timestamp),
        y: filter.y.filter(landmark.y, timestamp),
        z: filter.z ? filter.z.filter(landmark.z || 0, timestamp) : landmark.z,
      }
    })
  }
  
  reset() {
    this.filters.clear()
  }
}

// MediaPipe Face Landmarker indices (468 landmarks total)
// Key landmarks for head rotation detection
const FACE_LANDMARKS = {
  NOSE_TIP: 1,
  LEFT_EYE_INNER: 133,
  LEFT_EYE_OUTER: 33,
  RIGHT_EYE_INNER: 362,
  RIGHT_EYE_OUTER: 263,
  LEFT_EAR: 234,
  RIGHT_EAR: 454,
  CHIN: 152,
  FOREHEAD: 10,
  LEFT_CHEEK: 234,
  RIGHT_CHEEK: 454,
}

/**
 * Calculate head yaw (left/right rotation) from face landmarks
 * Uses the relative positions of left and right eye to nose
 */
function calculateHeadYaw(landmarks: any[]): number {
  const nose = landmarks[FACE_LANDMARKS.NOSE_TIP]
  const leftEye = landmarks[FACE_LANDMARKS.LEFT_EYE_OUTER]
  const rightEye = landmarks[FACE_LANDMARKS.RIGHT_EYE_OUTER]
  
  // Calculate distances from nose to each eye
  const leftDist = Math.sqrt(
    Math.pow(nose.x - leftEye.x, 2) + Math.pow(nose.y - leftEye.y, 2)
  )
  const rightDist = Math.sqrt(
    Math.pow(nose.x - rightEye.x, 2) + Math.pow(nose.y - rightEye.y, 2)
  )
  
  // Calculate yaw angle based on distance ratio
  // When facing forward, distances are equal (ratio ~1)
  // When turning left, left eye appears farther (ratio > 1)
  // When turning right, right eye appears farther (ratio < 1)
  const ratio = leftDist / rightDist
  
  // Convert ratio to angle (calibrated for typical head rotation range)
  // Ratio of 1.0 = 0° (center)
  // Ratio of ~1.5 = +45° (left)
  // Ratio of ~0.67 = -45° (right)
  const angle = Math.atan((ratio - 1) / 0.5) * (180 / Math.PI)
  
  return angle
}

/**
 * Calculate nose horizontal position (normalized -1 to 1)
 */
function calculateNoseHorizontal(landmarks: any[]): number {
  const nose = landmarks[FACE_LANDMARKS.NOSE_TIP]
  // Normalize to -1 (left) to +1 (right), with 0 as center
  return (nose.x - 0.5) * 2
}

/**
 * Calculate angles from face landmarks
 */
function calculateFaceAngles(
  landmarks: any[],
  anglesOfInterest?: string[]
): Omit<FaceAngle, "timestamp">[] {
  const angles: Omit<FaceAngle, "timestamp">[] = []
  
  const shouldTrack = (angleName: string) => {
    if (!anglesOfInterest) return true
    return anglesOfInterest.includes(angleName)
  }
  
  // Head yaw (left/right rotation)
  if (shouldTrack("head_yaw")) {
    try {
      const yaw = calculateHeadYaw(landmarks)
      angles.push({ angle: "head_yaw", value: yaw })
    } catch (e) {
      console.warn("Could not calculate head yaw")
    }
  }
  
  // Nose horizontal position
  if (shouldTrack("nose_horizontal")) {
    try {
      const noseX = calculateNoseHorizontal(landmarks)
      // Convert to angle-like scale (0-180 range for consistency)
      const noseAngle = (noseX + 1) * 90 // Maps -1 to 1 → 0 to 180
      angles.push({ angle: "nose_horizontal", value: noseAngle })
    } catch (e) {
      console.warn("Could not calculate nose horizontal position")
    }
  }
  
  return angles
}

/**
 * Detect movement sequences from face angle data
 */
function detectFaceMovements(faceAngles: FaceAngle[]): FaceMovementSequence[] {
  const movements: FaceMovementSequence[] = []
  
  // Group angles by type
  const anglesByType = faceAngles.reduce((acc, angle) => {
    if (!acc[angle.angle]) {
      acc[angle.angle] = []
    }
    acc[angle.angle].push(angle)
    return acc
  }, {} as Record<string, FaceAngle[]>)
  
  Object.entries(anglesByType).forEach(([angleType, angles]) => {
    if (angles.length < 2) return
    
    let movementStart = angles[0]
    let prevAngle = angles[0]
    
    for (let i = 1; i < angles.length; i++) {
      const currentAngle = angles[i]
      const valueDelta = Math.abs(currentAngle.value - movementStart.value)
      const timeDelta = currentAngle.timestamp - prevAngle.timestamp
      
      const threshold = angleType === "head_yaw" ? 20 : 30 
      
      if (valueDelta > threshold || timeDelta > 1.0) {
        if (Math.abs(currentAngle.value - movementStart.value) > threshold / 2) {
          movements.push({
            angle: angleType,
            startValue: movementStart.value,
            endValue: prevAngle.value,
            startTime: movementStart.timestamp,
            endTime: prevAngle.timestamp,
            duration: prevAngle.timestamp - movementStart.timestamp,
            valueDelta: prevAngle.value - movementStart.value,
          })
        }
        movementStart = currentAngle
      }
      
      prevAngle = currentAngle
    }
    
    const finalDelta = Math.abs(prevAngle.value - movementStart.value)
    if (finalDelta > 10) {
      movements.push({
        angle: angleType,
        startValue: movementStart.value,
        endValue: prevAngle.value,
        startTime: movementStart.timestamp,
        endTime: prevAngle.timestamp,
        duration: prevAngle.timestamp - movementStart.timestamp,
        valueDelta: prevAngle.value - movementStart.value,
      })
    }
  })
  
  return movements.sort((a, b) => a.startTime - b.startTime)
}

/**
 * Generate a summary of face movements
 */
function generateFaceSummary(movements: FaceMovementSequence[]): string {
  if (movements.length === 0) {
    return "No significant face movements detected."
  }
  
  const movementsByAngle = movements.reduce((acc, movement) => {
    if (!acc[movement.angle]) {
      acc[movement.angle] = []
    }
    acc[movement.angle].push(movement)
    return acc
  }, {} as Record<string, FaceMovementSequence[]>)
  
  const summaryParts: string[] = []
  
  Object.entries(movementsByAngle).forEach(([angle, movementList]) => {
    const avgDelta = movementList.reduce((sum, m) => sum + Math.abs(m.valueDelta), 0) / movementList.length
    const totalDuration = movementList.reduce((sum, m) => sum + m.duration, 0)
    
    let angleName = angle
    if (angle === "head_yaw") angleName = "head rotation"
    if (angle === "nose_horizontal") angleName = "nose position"
    
    summaryParts.push(
      `${movementList.length} ${angleName} movements (avg change: ${avgDelta.toFixed(1)}°, total time: ${totalDuration.toFixed(1)}s)`
    )
  })
  
  return summaryParts.join("\n")
}

/**
 * Analyze video for face landmarks and head movements
 */
export async function analyzeVideoForFace(
  videoBlob: Blob,
  anglesOfInterest?: string[],
  exerciseInfo?: { name: string; type: string }
): Promise<FaceAnalysisResult> {
  console.log("Starting face analysis...")
  console.log("Video blob size:", videoBlob.size, "bytes")
  
  if (anglesOfInterest) {
    console.log("Tracking angles:", anglesOfInterest.join(", "))
  }
  
  try {
    console.log("Initializing MediaPipe Face Landmarker...")
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm"
    )
    
    const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numFaces: 1,
      minFaceDetectionConfidence: 0.5,
      minFacePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })
    console.log("FaceLandmarker created successfully")

    const videoUrl = URL.createObjectURL(videoBlob)
    const video = document.createElement("video")
    video.src = videoUrl
    video.muted = true
    video.crossOrigin = "anonymous"
    
    console.log("Waiting for video to load...")
    await new Promise((resolve, reject) => {
      video.onloadedmetadata = () => {
        console.log("Video metadata loaded")
        console.log("Video dimensions:", video.videoWidth, "x", video.videoHeight)
        console.log("Video duration:", video.duration, "seconds")
        resolve(null)
      }
      video.onerror = (e) => {
        console.error("Video load error:", e)
        reject(new Error("Failed to load video"))
      }
      setTimeout(() => reject(new Error("Video load timeout")), 10000)
    })

    const faceAngles: FaceAngle[] = []
    const fps = 30
    const frameInterval = 1000 / fps
    
    const landmarkSmoother = new LandmarkSmoother(1.0, 0.007)
    
    console.log(`Processing video at ${fps} FPS with smoothing`)
    
    let frameCount = 0
    for (let time = 0; time < video.duration * 1000; time += frameInterval) {
      video.currentTime = time / 1000
      
      await new Promise((resolve) => {
        video.onseeked = resolve
      })
      
      const timestamp = video.currentTime * 1000
      const results = faceLandmarker.detectForVideo(video, timestamp)
      
      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const rawLandmarks = results.faceLandmarks[0]
        const smoothedLandmarks = landmarkSmoother.smoothLandmarks(rawLandmarks, timestamp)
        
        const angles = calculateFaceAngles(smoothedLandmarks, anglesOfInterest)
        
        angles.forEach((angleData) => {
          faceAngles.push({
            ...angleData,
            timestamp: video.currentTime,
          })
        })
        
        frameCount++
      }
      
      if (frameCount % 30 === 0) {
        console.log(`Processed ${frameCount} frames at ${video.currentTime.toFixed(2)}s`)
      }
    }
    
    console.log(`Total frames processed: ${frameCount}`)
    console.log(`Total face angles detected: ${faceAngles.length}`)
    
    const movements = detectFaceMovements(faceAngles)
    console.log(`Detected ${movements.length} face movement sequences`)
    
    const summary = generateFaceSummary(movements)
    
    let learnedTemplate: import("./exercise-state-learner").LearnedExerciseTemplate | undefined
    
    if (exerciseInfo && anglesOfInterest && anglesOfInterest.length > 0) {
      console.log("Learning exercise states from face video...")
      const { learnExerciseStates } = await import("./exercise-state-learner")
      
      const jointAnglesFormat = faceAngles.map(fa => ({
        joint: fa.angle,
        angle: fa.value,
        timestamp: fa.timestamp,
      }))
      
      learnedTemplate = learnExerciseStates(
        jointAnglesFormat,
        exerciseInfo.name,
        exerciseInfo.type,
        anglesOfInterest
      )
      
      console.log(`Learned ${learnedTemplate.states.length} states`)
      console.log(`Template confidence: ${learnedTemplate.metadata.confidence}%`)
    }
    
    URL.revokeObjectURL(videoUrl)
    faceLandmarker.close()
    
    return {
      faceAngles,
      movements,
      summary,
      learnedTemplate,
    }
  } catch (error) {
    console.error("Error in analyzeVideoForFace:", error)
    throw error
  }
}
