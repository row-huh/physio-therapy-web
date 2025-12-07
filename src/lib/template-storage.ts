

import type { LearnedExerciseTemplate } from "./exercise-state-learner"

const STORAGE_KEY = "exercise_templates"

export interface SavedTemplate {
  id: string
  template: LearnedExerciseTemplate
  savedAt: string
  videoUrl?: string 
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

  // Avoid storing large base64 video blobs: they quickly exceed localStorage quota.
  // We only store a tiny preview if the blob is very small (<1MB), otherwise omit videoUrl.
  if (videoBlob && videoBlob.size <= 1 * 1024 * 1024) {
    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        savedTemplate.videoUrl = reader.result as string
        templates.push(savedTemplate)
        tryPersistTemplates(templates)
      }
      reader.readAsDataURL(videoBlob)
    } catch (e) {
      console.warn("Failed to encode video preview; saving metadata only.", e)
      templates.push(savedTemplate)
      tryPersistTemplates(templates)
    }
  } else {
    if (videoBlob) {
      console.info(
        `Video size ${(videoBlob.size / 1024 / 1024).toFixed(2)}MB too large for inline storage; storing metadata only.`
      )
    }
    templates.push(savedTemplate)
    tryPersistTemplates(templates)
  }

  console.log(`Saved template: ${id}`)
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
  
  console.log(`Exported ${templates.length} templates`)
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
    console.log(`Imported ${addedCount} new templates`)
    
    return addedCount
  } catch (error) {
    console.error("Error importing templates:", error)
    throw new Error("Invalid template file format")
  }
}

// ---------- Quota Handling & Cleanup Utilities ----------

function tryPersistTemplates(templates: SavedTemplate[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
  } catch (err: any) {
    if (isQuotaExceeded(err)) {
      console.warn("Quota exceeded while saving templates. Attempting to remove video previews…")
      // Remove videoUrl fields from newest backwards until success
      for (let i = templates.length - 1; i >= 0; i--) {
        if (templates[i].videoUrl) {
          delete templates[i].videoUrl
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
            console.info("Saved after removing inline previews.")
            return
          } catch (e) {
            // continue cleanup
          }
        }
      }
      // Final fallback: store minimal template data only
      const minimal = templates.map(t => ({ id: t.id, savedAt: t.savedAt, template: t.template }))
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal))
        console.info("Stored minimal template data after cleanup.")
      } catch (e2) {
        console.error("❌ Failed to persist minimal template data.", e2)
      }
    } else {
      console.error("Error persisting templates:", err)
    }
  }
}

function isQuotaExceeded(error: any): boolean {
  if (!error) return false
  return (
    error.name === "QuotaExceededError" ||
    error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    (typeof error.message === "string" && error.message.toLowerCase().includes("quota"))
  )
}

export function purgeTemplateVideoPreviews(): number {
  const templates = getAllTemplates()
  let removed = 0
  templates.forEach(t => {
    if (t.videoUrl) {
      delete t.videoUrl
      removed++
    }
  })
  tryPersistTemplates(templates)
  console.log(`Purged ${removed} inline video previews from templates.`)
  return removed
}
