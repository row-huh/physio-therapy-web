/**
 * Tests for lib/template-storage.ts
 *
 * All tests use the in-memory localStorage shim from jest.setup.ts.
 * Each test clears localStorage in beforeEach to ensure isolation.
 *
 * Covers:
 *   - getAllTemplates() — empty store, populated store, parse error fallback
 *   - getTemplate() — found, not found
 *   - getTemplatesByExerciseType() — filters correctly
 *   - saveTemplate() — persists minimal template (no blob); id returned
 *   - deleteTemplate() — removes by id, returns true/false correctly
 *   - clearAllTemplates() — removes all templates
 *   - importTemplates() — merges, skips duplicates, returns count
 *   - importTemplates() — throws on invalid JSON
 *   - purgeTemplateVideoPreviews() — removes videoUrl fields, returns count
 */

import {
  getAllTemplates,
  getTemplate,
  getTemplatesByExerciseType,
  saveTemplate,
  deleteTemplate,
  clearAllTemplates,
  importTemplates,
  purgeTemplateVideoPreviews,
} from "@/lib/template-storage"
import type { LearnedExerciseTemplate } from "@/lib/exercise-state-learner"

// ---------------------------------------------------------------------------
// Minimal valid template factory
// ---------------------------------------------------------------------------

function makeLearned(exerciseType = "knee-extension", overrides: Partial<LearnedExerciseTemplate> = {}): LearnedExerciseTemplate {
  return {
    exerciseName: exerciseType,
    exerciseType,
    states: [],
    transitions: [],
    repSequence: [],
    totalDuration: 10,
    recommendedReps: 5,
    metadata: {
      detectedAt: new Date().toISOString(),
      videoLength: 10,
      fps: 30,
      confidence: 80,
    },
    ...overrides,
  }
}

const STORAGE_KEY = "exercise_templates"

// ---------------------------------------------------------------------------
// Setup/Teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  localStorage.clear()
})

// ---------------------------------------------------------------------------
// getAllTemplates()
// ---------------------------------------------------------------------------

describe("getAllTemplates", () => {
  it("returns empty array when localStorage has no data", () => {
    expect(getAllTemplates()).toEqual([])
  })

  it("returns parsed array of saved templates", () => {
    const t = makeLearned()
    saveTemplate(t)
    const all = getAllTemplates()
    expect(all).toHaveLength(1)
    expect(all[0].template.exerciseType).toBe("knee-extension")
  })

  it("returns empty array if localStorage value is invalid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "NOT_JSON")
    expect(getAllTemplates()).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// getTemplate()
// ---------------------------------------------------------------------------

describe("getTemplate", () => {
  it("returns null when no templates exist", () => {
    expect(getTemplate("nonexistent")).toBeNull()
  })

  it("returns null for an unknown id", () => {
    saveTemplate(makeLearned())
    expect(getTemplate("does-not-exist")).toBeNull()
  })

  it("returns the correct saved template by id", () => {
    const id = saveTemplate(makeLearned())
    const found = getTemplate(id)
    expect(found).not.toBeNull()
    expect(found!.id).toBe(id)
    expect(found!.template.exerciseType).toBe("knee-extension")
  })
})

// ---------------------------------------------------------------------------
// getTemplatesByExerciseType()
// ---------------------------------------------------------------------------

describe("getTemplatesByExerciseType", () => {
  it("returns empty array when no templates match the exercise type", () => {
    saveTemplate(makeLearned("knee-extension"))
    expect(getTemplatesByExerciseType("scap-wall-slides")).toEqual([])
  })

  it("returns only templates matching the requested exercise type", () => {
    saveTemplate(makeLearned("knee-extension"))
    saveTemplate(makeLearned("scap-wall-slides"))
    saveTemplate(makeLearned("knee-extension"))
    const kneeTemplates = getTemplatesByExerciseType("knee-extension")
    expect(kneeTemplates).toHaveLength(2)
    expect(kneeTemplates.every((t) => t.template.exerciseType === "knee-extension")).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// saveTemplate()
// ---------------------------------------------------------------------------

describe("saveTemplate", () => {
  it("returns a non-empty id string", () => {
    const id = saveTemplate(makeLearned())
    expect(typeof id).toBe("string")
    expect(id.length).toBeGreaterThan(0)
  })

  it("id starts with 'template_'", () => {
    const id = saveTemplate(makeLearned())
    expect(id.startsWith("template_")).toBe(true)
  })

  it("persists template to localStorage immediately when no blob provided", () => {
    const id = saveTemplate(makeLearned("scap-wall-slides"))
    // Should be findable synchronously
    expect(getTemplate(id)).not.toBeNull()
  })

  it("saves multiple templates with unique ids", () => {
    const id1 = saveTemplate(makeLearned())
    const id2 = saveTemplate(makeLearned())
    expect(id1).not.toBe(id2)
    expect(getAllTemplates()).toHaveLength(2)
  })

  it("savedAt is a valid ISO date string", () => {
    const id = saveTemplate(makeLearned())
    const saved = getTemplate(id)!
    expect(() => new Date(saved.savedAt)).not.toThrow()
    expect(new Date(saved.savedAt).toISOString()).toBe(saved.savedAt)
  })
})

// ---------------------------------------------------------------------------
// deleteTemplate()
// ---------------------------------------------------------------------------

describe("deleteTemplate", () => {
  it("returns false when template id does not exist", () => {
    expect(deleteTemplate("ghost-id")).toBe(false)
  })

  it("returns true and removes the template when found", () => {
    const id = saveTemplate(makeLearned())
    expect(deleteTemplate(id)).toBe(true)
    expect(getTemplate(id)).toBeNull()
    expect(getAllTemplates()).toHaveLength(0)
  })

  it("only removes the specified template, leaving others intact", () => {
    const id1 = saveTemplate(makeLearned())
    const id2 = saveTemplate(makeLearned("scap-wall-slides"))
    deleteTemplate(id1)
    expect(getTemplate(id1)).toBeNull()
    expect(getTemplate(id2)).not.toBeNull()
  })
})

// ---------------------------------------------------------------------------
// clearAllTemplates()
// ---------------------------------------------------------------------------

describe("clearAllTemplates", () => {
  it("removes all templates from localStorage", () => {
    saveTemplate(makeLearned())
    saveTemplate(makeLearned())
    clearAllTemplates()
    expect(getAllTemplates()).toEqual([])
  })

  it("is safe to call on empty store", () => {
    expect(() => clearAllTemplates()).not.toThrow()
    expect(getAllTemplates()).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// importTemplates()
// ---------------------------------------------------------------------------

describe("importTemplates", () => {
  it("returns 0 when importing an empty array", () => {
    const count = importTemplates(JSON.stringify([]))
    expect(count).toBe(0)
  })

  it("imports new templates and returns added count", () => {
    const template = makeLearned()
    const saved = [
      { id: "import_test_1", template, savedAt: new Date().toISOString() },
    ]
    const count = importTemplates(JSON.stringify(saved))
    expect(count).toBe(1)
    expect(getAllTemplates()).toHaveLength(1)
  })

  it("skips duplicate ids (already existing templates)", () => {
    const template = makeLearned()
    const existing = [
      { id: "dup_id", template, savedAt: new Date().toISOString() },
    ]
    importTemplates(JSON.stringify(existing))
    // Re-import the same — should add 0 new
    const count = importTemplates(JSON.stringify(existing))
    expect(count).toBe(0)
    expect(getAllTemplates()).toHaveLength(1)
  })

  it("merges imports with existing templates correctly", () => {
    saveTemplate(makeLearned())
    const template = makeLearned("scap-wall-slides")
    const newImports = [
      { id: "new_unique_id", template, savedAt: new Date().toISOString() },
    ]
    importTemplates(JSON.stringify(newImports))
    expect(getAllTemplates()).toHaveLength(2)
  })

  it("throws on invalid JSON input", () => {
    expect(() => importTemplates("NOT_VALID_JSON")).toThrow("Invalid template file format")
  })
})

// ---------------------------------------------------------------------------
// purgeTemplateVideoPreviews()
// ---------------------------------------------------------------------------

describe("purgeTemplateVideoPreviews", () => {
  it("returns 0 when no templates have videoUrl", () => {
    saveTemplate(makeLearned())
    const removed = purgeTemplateVideoPreviews()
    expect(removed).toBe(0)
  })

  it("removes videoUrl fields and returns count of affected templates", () => {
    // Manually inject templates with videoUrl into localStorage
    const templates = [
      { id: "t1", template: makeLearned(), savedAt: new Date().toISOString(), videoUrl: "data:video/webm;base64,AAAA" },
      { id: "t2", template: makeLearned(), savedAt: new Date().toISOString(), videoUrl: "data:video/webm;base64,BBBB" },
      { id: "t3", template: makeLearned(), savedAt: new Date().toISOString() },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))

    const removed = purgeTemplateVideoPreviews()
    expect(removed).toBe(2)

    const allAfter = getAllTemplates()
    expect(allAfter.every((t) => t.videoUrl === undefined)).toBe(true)
  })
})
