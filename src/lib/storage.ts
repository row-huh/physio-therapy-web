export interface ExerciseVideo {
  id: string
  name: string
  videoBlob: string // base64 encoded video
  createdAt: number
}

const STORAGE_KEY = "exercise-videos"

function getVideos(): ExerciseVideo[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

function saveVideos(videos: ExerciseVideo[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos))
}

export function saveExerciseVideo(name: string, videoBlob: Blob): ExerciseVideo {
  const video: ExerciseVideo = {
    id: Date.now().toString(),
    name,
    videoBlob: "", // Will be set after blob to base64 conversion
    createdAt: Date.now(),
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      video.videoBlob = e.target.result as string
      const videos = getVideos()
      videos.push(video)
      saveVideos(videos)
    }
  }
  reader.readAsDataURL(videoBlob)

  return video
}

export function getAllExercises(): ExerciseVideo[] {
  return getVideos()
}

export function getExercise(id: string): ExerciseVideo | undefined {
  return getVideos().find((v) => v.id === id)
}

export function deleteExercise(id: string) {
  const videos = getVideos().filter((v) => v.id !== id)
  saveVideos(videos)
}
