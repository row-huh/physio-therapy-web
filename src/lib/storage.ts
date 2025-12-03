import { createClient } from "@/utils/supabase/client"
import type { LearnedExerciseTemplate } from "./exercise-state-learner"

export interface ExerciseVideo {
  id: string
  name: string
  type: string // exercise type (knee-extension, bicep-curl, etc.)
  videoUrl: string // Supabase storage URL or fallback to base64
  timestamp: number // createdAt timestamp
  storedInSupabase?: boolean // Flag to indicate if video is in Supabase
  learnedTemplate?: LearnedExerciseTemplate // Learned exercise template from analysis
}

const STORAGE_KEY = "exercise-videos"
const SUPABASE_BUCKET = "reference-videos"

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
    console.log(`✅ Saved ${videos.length} exercise videos metadata to localStorage`)
  } catch (e: any) {
    console.error("❌ Error saving exercise videos metadata:", e)
  }
}

export async function saveExerciseVideo(
  name: string, 
  videoBlob: Blob, 
  exerciseType: string = "custom",
  learnedTemplate?: LearnedExerciseTemplate
): Promise<ExerciseVideo> {
  const id = Date.now().toString()
  console.log(`📹 Saving exercise video: ${name} (${exerciseType})`)
  
  try {
    const supabase = createClient()
    
    // Create a unique filename
    const fileName = `${id}_${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.webm`
    const filePath = `${exerciseType}/${fileName}`
    
    console.log(`☁️ Uploading video to Supabase: ${filePath}`)
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(filePath, videoBlob, {
        contentType: videoBlob.type || 'video/webm',
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      console.error("❌ Supabase upload error:", uploadError)
      throw new Error(`Failed to upload video: ${uploadError.message}`)
    }
    
    console.log(`✅ Video uploaded to Supabase:`, uploadData)
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(SUPABASE_BUCKET)
      .getPublicUrl(filePath)
    
    if (!urlData?.publicUrl) {
      throw new Error("Failed to get public URL for uploaded video")
    }
    
    console.log(`🔗 Public URL:`, urlData.publicUrl)
    
    // Save metadata to localStorage
    const video: ExerciseVideo = {
      id,
      name,
      type: exerciseType,
      videoUrl: urlData.publicUrl,
      timestamp: Date.now(),
      storedInSupabase: true,
      learnedTemplate
    }
    
    const videos = getVideos()
    videos.push(video)
    saveVideos(videos)
    
    console.log(`✅ Exercise video saved with ID: ${id}`)
    return video
    
  } catch (err) {
    console.error("Error in saveExerciseVideo:", err)
    throw err
  }
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

export async function deleteExercise(id: string): Promise<boolean> {
  const videos = getVideos()
  const videoToDelete = videos.find((v) => v.id === id)
  
  if (!videoToDelete) {
    return false
  }
  
  // If stored in Supabase, delete from there too
  if (videoToDelete.storedInSupabase) {
    try {
      const supabase = createClient()
      
      // Extract file path from URL
      const url = new URL(videoToDelete.videoUrl)
      const pathParts = url.pathname.split('/storage/v1/object/public/' + SUPABASE_BUCKET + '/')
      if (pathParts.length > 1) {
        const filePath = pathParts[1]
        
        console.log(`🗑️ Deleting from Supabase: ${filePath}`)
        const { error } = await supabase.storage
          .from(SUPABASE_BUCKET)
          .remove([filePath])
        
        if (error) {
          console.error("❌ Error deleting from Supabase:", error)
        } else {
          console.log("✅ Deleted from Supabase")
        }
      }
    } catch (err) {
      console.error("Error deleting from Supabase:", err)
    }
  }
  
  const filtered = videos.filter((v) => v.id !== id)
  saveVideos(filtered)
  console.log(`🗑️ Deleted exercise video: ${id}`)
  return true
}

export function clearAllExercises(): void {
  localStorage.removeItem(STORAGE_KEY)
  console.log("🗑️ Cleared all exercise videos")
}
