export interface ExerciseVideo {
  id: string
  name: string
  type: string // exercise type (knee-extension, bicep-curl, etc.)
  videoUrl: string // base64 encoded video data URL
  timestamp: number // createdAt timestamp
}

const STORAGE_KEY = "exercise-videos"

function getVideos(): ExerciseVideo[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    return JSON.parse(data) as ExerciseVideo[]
  } catch (e) {
    console.error("Error loading exercise videos:", e)
    return []
  }
}

function saveVideos(videos: ExerciseVideo[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos))
    console.log(`✅ Saved ${videos.length} exercise videos to storage`)
  } catch (e: any) {
    console.error("❌ Error saving exercise videos:", e)
    if (e.name === "QuotaExceededError") {
      alert("Storage quota exceeded! Your video is too large. Try recording a shorter video.")
    }
  }
}

export function saveExerciseVideo(
  name: string, 
  videoBlob: Blob, 
  exerciseType: string = "custom"
): Promise<ExerciseVideo> {
  return new Promise((resolve, reject) => {
    const id = Date.now().toString()
    console.log(`📹 Saving exercise video: ${name} (${exerciseType})`)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        if (e.target?.result) {
          const video: ExerciseVideo = {
            id,
            name,
            type: exerciseType,
            videoUrl: e.target.result as string,
            timestamp: Date.now(),
          }
          
          const videos = getVideos()
          videos.push(video)
          saveVideos(videos)
          
          console.log(`✅ Exercise video saved with ID: ${id}`)
          resolve(video)
        } else {
          reject(new Error("Failed to read video blob"))
        }
      } catch (err) {
        console.error("Error in saveExerciseVideo:", err)
        reject(err)
      }
    }
    reader.onerror = () => {
      reject(new Error("Failed to read video file"))
    }
    reader.readAsDataURL(videoBlob)
  })
}

export function getAllExercises(): ExerciseVideo[] {
  const videos = getVideos()
  console.log(`📂 Retrieved ${videos.length} exercise videos from storage`)
  return videos
}

export function getExercise(id: string): ExerciseVideo | undefined {
  const video = getVideos().find((v) => v.id === id)
  if (video) {
    console.log(`✅ Found exercise video: ${video.name} (${video.type})`)
  } else {
    console.warn(`⚠️ Exercise video not found: ${id}`)
  }
  return video
}

export function deleteExercise(id: string): boolean {
  const videos = getVideos()
  const filtered = videos.filter((v) => v.id !== id)
  
  if (filtered.length !== videos.length) {
    saveVideos(filtered)
    console.log(`🗑️ Deleted exercise video: ${id}`)
    return true
  }
  
  return false
}

export function clearAllExercises(): void {
  localStorage.removeItem(STORAGE_KEY)
  console.log("🗑️ Cleared all exercise videos")
}
