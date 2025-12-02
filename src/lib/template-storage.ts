/**
 * Template Storage
 * 
 * Manages saving and retrieving learned exercise templates
 */

import type { LearnedExerciseTemplate } from "./exercise-state-learner"

const STORAGE_KEY = "exercise_templates"

export interface SavedTemplate {
  id: string
  template: LearnedExerciseTemplate
  savedAt: string
  videoUrl?: string // Optional reference to the video blob URL
}

/**
 * Save a learned template to local storage
 */
export function saveTemplate(
  template: LearnedExerciseTemplate,
  videoBlob?: Blob
): string {
  const templates = getAllTemplates()
  
  const id = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const savedTemplate: SavedTemplate = {
    id,
    template,
    savedAt: new Date().toISOString(),
  }
  
  // Optionally save video blob (large, might exceed localStorage limits)
  if (videoBlob && videoBlob.size < 5 * 1024 * 1024) { // Only if < 5MB
    // Convert blob to base64 for storage
    const reader = new FileReader()
    reader.readAsDataURL(videoBlob)
    reader.onloadend = () => {
      savedTemplate.videoUrl = reader.result as string
      templates.push(savedTemplate)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
    }
  } else {
    templates.push(savedTemplate)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
  }
  
  console.log(`✅ Saved template: ${id}`)
  return id
}

/**
 * Get all saved templates
 */
export function getAllTemplates(): SavedTemplate[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    return JSON.parse(stored) as SavedTemplate[]
  } catch (error) {
    console.error("Error loading templates:", error)
    return []
  }
}

/**
 * Get a specific template by ID
 */
export function getTemplate(id: string): SavedTemplate | null {
  const templates = getAllTemplates()
  return templates.find(t => t.id === id) || null
}

/**
 * Get templates for a specific exercise type
 */
export function getTemplatesByExerciseType(exerciseType: string): SavedTemplate[] {
  const templates = getAllTemplates()
  return templates.filter(t => t.template.exerciseType === exerciseType)
}

/**
 * Delete a template
 */
export function deleteTemplate(id: string): boolean {
  const templates = getAllTemplates()
  const filtered = templates.filter(t => t.id !== id)
  
  if (filtered.length !== templates.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    console.log(`🗑️ Deleted template: ${id}`)
    return true
  }
  
  return false
}

/**
 * Clear all templates
 */
export function clearAllTemplates(): void {
  localStorage.removeItem(STORAGE_KEY)
  console.log("🗑️ Cleared all templates")
}

/**
 * Export templates as JSON file
 */
export function exportTemplates(): void {
  const templates = getAllTemplates()
  const dataStr = JSON.stringify(templates, null, 2)
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
  
  const exportFileDefaultName = `exercise_templates_${new Date().toISOString().split('T')[0]}.json`
  
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
  
  console.log(`📥 Exported ${templates.length} templates`)
}

/**
 * Import templates from JSON file
 */
export function importTemplates(jsonString: string): number {
  try {
    const imported = JSON.parse(jsonString) as SavedTemplate[]
    const existing = getAllTemplates()
    
    // Merge, avoiding duplicates by ID
    const merged = [...existing]
    let addedCount = 0
    
    imported.forEach(template => {
      if (!merged.find(t => t.id === template.id)) {
        merged.push(template)
        addedCount++
      }
    })
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
    console.log(`📤 Imported ${addedCount} new templates`)
    
    return addedCount
  } catch (error) {
    console.error("Error importing templates:", error)
    throw new Error("Invalid template file format")
  }
}
