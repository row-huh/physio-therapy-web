/**
 * Tests for lib/template-storage.ts
 *
 * This module manages local (browser) storage of exercise templates.
 * Templates are serialised as JSON and stored under a single localStorage key.
 * The module provides CRUD operations plus import/export utilities.
 *
 * Why localStorage? Exercise templates can be large (video blobs, detailed state
 * data) and are needed offline. localStorage is the persistence layer before
 * a template is uploaded to Supabase by the doctor.
 *
 * All tests use the in-memory localStorage shim from jest.setup.ts.
 * The shim is cleared in beforeEach to guarantee complete test isolation.
 *
 * Exported functions:
 *   getAllTemplates()                 — return all stored templates
 *   getTemplate(id)                  — return one by id, or null
 *   getTemplatesByExerciseType(type) — filter by exercise type
 *   saveTemplate(learnedTemplate)    — persist and return a generated id
 *   deleteTemplate(id)               — remove by id; return true/false
 *   clearAllTemplates()              — wipe the entire store
 *   importTemplates(jsonString)      — merge in externally-exported templates
 *   purgeTemplateVideoPreviews()     — strip videoUrl fields; return count
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
// Factory
// ---------------------------------------------------------------------------

/**
 * Builds a minimal valid LearnedExerciseTemplate.
 * Accepts partial overrides so individual tests can inject specific fields
 * (e.g. to test that a particular property is preserved through save/load).
 */
function makeLearned(
  exerciseType = "knee-extension",
  overrides: Partial<LearnedExerciseTemplate> = {}
): LearnedExerciseTemplate {
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

/** The localStorage key the module uses — needed for directly injecting test data. */
const STORAGE_KEY = "exercise_templates"

// ---------------------------------------------------------------------------
// Test isolation — clear localStorage before every test
// ---------------------------------------------------------------------------

beforeEach(() => {
  localStorage.clear()
})

// ===========================================================================
// getAllTemplates()
// ===========================================================================

describe("getAllTemplates — retrieve the full list of stored templates", () => {
  it("returns an empty array when localStorage has no data at all, so callers can safely call .length or iterate without null-checking", () => {
    const all = getAllTemplates()

    expect(all).toEqual([])
    process.stdout.write("[STORAGE] getAllTemplates() on empty store → correctly returned [] ✓\n")
  })

  it("returns a parsed array containing the saved template after one saveTemplate() call", () => {
    // Save one template, then retrieve all
    saveTemplate(makeLearned())
    const all = getAllTemplates()

    expect(all).toHaveLength(1)
    // The stored template must retain its exercise type
    expect(all[0].template.exerciseType).toBe("knee-extension")
    process.stdout.write(`[STORAGE] getAllTemplates() after one save → correctly returned 1 template with exerciseType='knee-extension' ✓\n`)
  })

  it("returns an empty array (fallback) when the localStorage value is invalid JSON, because a corrupted store should not crash the application", () => {
    // Directly inject invalid JSON to simulate data corruption
    localStorage.setItem(STORAGE_KEY, "NOT_VALID_JSON_AT_ALL")
    const all = getAllTemplates()

    // Graceful fallback — return empty array rather than throwing
    expect(all).toEqual([])
    process.stdout.write("[STORAGE] getAllTemplates() with corrupt localStorage → correctly returned [] (graceful fallback) ✓\n")
  })
})

// ===========================================================================
// getTemplate()
// ===========================================================================

describe("getTemplate — retrieve a single template by its unique id", () => {
  it("returns null when the store is empty and no templates have been saved", () => {
    expect(getTemplate("nonexistent-id")).toBeNull()
    process.stdout.write("[STORAGE] getTemplate('nonexistent-id') on empty store → correctly returned null ✓\n")
  })

  it("returns null when the requested id does not match any stored template, even when other templates exist", () => {
    saveTemplate(makeLearned())  // save one template with a generated id

    // Request with a completely different id — must not return the other template
    expect(getTemplate("does-not-exist")).toBeNull()
    process.stdout.write("[STORAGE] getTemplate('does-not-exist') with one other template in store → correctly returned null ✓\n")
  })

  it("returns the correct saved template when queried by the id returned from saveTemplate()", () => {
    const id    = saveTemplate(makeLearned())
    const found = getTemplate(id)

    // Must find the template and its id must match the one returned by saveTemplate
    expect(found).not.toBeNull()
    expect(found!.id).toBe(id)
    expect(found!.template.exerciseType).toBe("knee-extension")
    process.stdout.write(`[STORAGE] getTemplate('${id}') → correctly returned template with exerciseType='knee-extension' ✓\n`)
  })
})

// ===========================================================================
// getTemplatesByExerciseType()
// ===========================================================================

describe("getTemplatesByExerciseType — filter templates by their exercise type", () => {
  it("returns an empty array when no templates of the requested exercise type are stored, even when other types exist", () => {
    saveTemplate(makeLearned("knee-extension"))

    // Request a type that was not saved
    const result = getTemplatesByExerciseType("scap-wall-slides")

    expect(result).toEqual([])
    process.stdout.write("[STORAGE] getTemplatesByExerciseType('scap-wall-slides') with only knee-extension in store → correctly returned [] ✓\n")
  })

  it("returns exactly the templates matching the requested type and excludes templates of other types", () => {
    saveTemplate(makeLearned("knee-extension"))
    saveTemplate(makeLearned("scap-wall-slides"))
    saveTemplate(makeLearned("knee-extension"))

    const kneeTemplates = getTemplatesByExerciseType("knee-extension")

    expect(kneeTemplates).toHaveLength(2)
    // Every returned template must be of the requested type
    expect(kneeTemplates.every((t) => t.template.exerciseType === "knee-extension")).toBe(true)
    process.stdout.write(`[STORAGE] getTemplatesByExerciseType('knee-extension') with 3 templates (2 knee, 1 scap) → correctly returned 2 ✓\n`)
  })
})

// ===========================================================================
// saveTemplate()
// ===========================================================================

describe("saveTemplate — persist a learned template and return its generated id", () => {
  it("returns a non-empty string id, so callers can immediately use the id to retrieve or reference the template", () => {
    const id = saveTemplate(makeLearned())

    expect(typeof id).toBe("string")
    expect(id.length).toBeGreaterThan(0)
    process.stdout.write(`[STORAGE] saveTemplate() returned id='${id}' (non-empty string) ✓\n`)
  })

  it("returns an id that starts with 'template_', confirming the naming convention so the format is predictable for debugging", () => {
    const id = saveTemplate(makeLearned())

    expect(id.startsWith("template_")).toBe(true)
    process.stdout.write(`[STORAGE] saveTemplate() id='${id}' correctly starts with 'template_' ✓\n`)
  })

  it("makes the template immediately retrievable via getTemplate(id) without any async delay, confirming synchronous localStorage persistence", () => {
    const id = saveTemplate(makeLearned("scap-wall-slides"))

    // Synchronous retrieval — no await needed
    const found = getTemplate(id)
    expect(found).not.toBeNull()
    expect(found!.template.exerciseType).toBe("scap-wall-slides")
    process.stdout.write(`[STORAGE] Template saved and immediately retrieved with exerciseType='scap-wall-slides' ✓\n`)
  })

  it("generates unique ids for each saveTemplate() call so that multiple templates can coexist in the store without id collisions", () => {
    const id1 = saveTemplate(makeLearned())
    const id2 = saveTemplate(makeLearned())

    // Ids must differ — collision would cause one template to overwrite the other
    expect(id1).not.toBe(id2)
    // Both must be retrievable
    expect(getAllTemplates()).toHaveLength(2)
    process.stdout.write(`[STORAGE] Two saves produced unique ids ('${id1}' vs '${id2}') and both are in the store ✓\n`)
  })

  it("stores a savedAt field as a valid ISO 8601 date string so templates can be sorted by recording date", () => {
    const id   = saveTemplate(makeLearned())
    const saved = getTemplate(id)!

    // Must be parseable and round-trip through the Date constructor
    expect(() => new Date(saved.savedAt)).not.toThrow()
    expect(new Date(saved.savedAt).toISOString()).toBe(saved.savedAt)
    process.stdout.write(`[STORAGE] savedAt='${saved.savedAt}' is a valid ISO date string ✓\n`)
  })
})

// ===========================================================================
// deleteTemplate()
// ===========================================================================

describe("deleteTemplate — remove a template by its id", () => {
  it("returns false when the requested id does not match any template in the store, so callers can detect a no-op delete", () => {
    const result = deleteTemplate("ghost-id-that-was-never-saved")

    expect(result).toBe(false)
    process.stdout.write("[STORAGE] deleteTemplate('ghost-id') → correctly returned false ✓\n")
  })

  it("returns true and removes the template so it is no longer retrievable after deletion", () => {
    const id = saveTemplate(makeLearned())

    const deleteResult = deleteTemplate(id)

    // Return value must confirm success
    expect(deleteResult).toBe(true)
    // Template must be gone
    expect(getTemplate(id)).toBeNull()
    expect(getAllTemplates()).toHaveLength(0)
    process.stdout.write(`[STORAGE] deleteTemplate('${id}') → returned true, template is no longer in store ✓\n`)
  })

  it("removes only the specified template and leaves all other templates intact, confirming precise targeting by id", () => {
    const id1 = saveTemplate(makeLearned("knee-extension"))
    const id2 = saveTemplate(makeLearned("scap-wall-slides"))

    deleteTemplate(id1)

    // id1 must be gone
    expect(getTemplate(id1)).toBeNull()
    // id2 must still be present
    expect(getTemplate(id2)).not.toBeNull()
    process.stdout.write(`[STORAGE] deleteTemplate('${id1}') → id1 removed, id2 ('${id2}') still present ✓\n`)
  })
})

// ===========================================================================
// clearAllTemplates()
// ===========================================================================

describe("clearAllTemplates — wipe all stored templates at once", () => {
  it("removes all templates so that getAllTemplates() returns an empty array after the call", () => {
    saveTemplate(makeLearned())
    saveTemplate(makeLearned())

    clearAllTemplates()

    expect(getAllTemplates()).toEqual([])
    process.stdout.write("[STORAGE] clearAllTemplates() after 2 saves → store is empty ✓\n")
  })

  it("does not throw when called on an already-empty store (idempotent operation)", () => {
    // clearAllTemplates on an empty store must be safe
    expect(() => clearAllTemplates()).not.toThrow()
    expect(getAllTemplates()).toEqual([])
    process.stdout.write("[STORAGE] clearAllTemplates() on empty store → did not throw ✓\n")
  })
})

// ===========================================================================
// importTemplates()
// ===========================================================================

describe("importTemplates — merge externally-exported template JSON into the local store", () => {
  it("returns 0 when importing an empty JSON array, because there is nothing to add", () => {
    const count = importTemplates(JSON.stringify([]))

    expect(count).toBe(0)
    process.stdout.write("[STORAGE] importTemplates('[]') → returned count=0 ✓\n")
  })

  it("returns 1 and adds the template to the store when importing a JSON array with one new template", () => {
    const template  = makeLearned()
    const exportData = [{ id: "import_test_001", template, savedAt: new Date().toISOString() }]

    const count = importTemplates(JSON.stringify(exportData))

    expect(count).toBe(1)
    expect(getAllTemplates()).toHaveLength(1)
    process.stdout.write(`[STORAGE] importTemplates(1 new template) → returned count=1, store now has 1 template ✓\n`)
  })

  it("returns 0 when importing templates whose ids already exist in the store, preventing duplicates from being added", () => {
    const template   = makeLearned()
    const exportData = [{ id: "dup_id_001", template, savedAt: new Date().toISOString() }]

    // Import once — adds 1
    importTemplates(JSON.stringify(exportData))
    // Import the same data again — should add 0 (duplicate detected by id)
    const count = importTemplates(JSON.stringify(exportData))

    expect(count).toBe(0)
    // The store must still have only 1 template (not 2)
    expect(getAllTemplates()).toHaveLength(1)
    process.stdout.write("[STORAGE] importTemplates(duplicate id) → returned count=0, store still has 1 template (no duplicate) ✓\n")
  })

  it("merges imported templates with existing ones, resulting in the correct total count in the store", () => {
    // Start with one locally-saved template
    saveTemplate(makeLearned("knee-extension"))

    // Import one new template with a different exercise type
    const template   = makeLearned("scap-wall-slides")
    const exportData = [{ id: "new_unique_id_999", template, savedAt: new Date().toISOString() }]
    importTemplates(JSON.stringify(exportData))

    // Store must now have 2 templates total
    expect(getAllTemplates()).toHaveLength(2)
    process.stdout.write("[STORAGE] importTemplates(1 new) with 1 existing → store now has 2 templates ✓\n")
  })

  it("throws with 'Invalid template file format' when given an invalid JSON string, so callers can show a user-facing error message", () => {
    expect(() => importTemplates("THIS_IS_NOT_JSON")).toThrow("Invalid template file format")
    process.stdout.write("[STORAGE] importTemplates(invalid JSON) → correctly threw 'Invalid template file format' ✓\n")
  })
})

// ===========================================================================
// purgeTemplateVideoPreviews()
// ===========================================================================

describe("purgeTemplateVideoPreviews — strip videoUrl fields to reclaim storage space", () => {
  it("returns 0 when no templates have a videoUrl field, because there is nothing to purge", () => {
    // Save a standard template without any videoUrl
    saveTemplate(makeLearned())

    const removed = purgeTemplateVideoPreviews()

    expect(removed).toBe(0)
    process.stdout.write("[STORAGE] purgeTemplateVideoPreviews() with no videoUrls in store → correctly returned 0 ✓\n")
  })

  it("removes videoUrl fields from all templates that have one and returns the count of affected templates, freeing storage used by base64-encoded video blobs", () => {
    // Directly inject templates with videoUrl into localStorage — bypassing saveTemplate()
    // because saveTemplate does not set videoUrl
    const templates = [
      {
        id: "t1",
        template: makeLearned(),
        savedAt: new Date().toISOString(),
        videoUrl: "data:video/webm;base64,AAAA==",   // has a preview blob
      },
      {
        id: "t2",
        template: makeLearned(),
        savedAt: new Date().toISOString(),
        videoUrl: "data:video/webm;base64,BBBB==",   // has a preview blob
      },
      {
        id: "t3",
        template: makeLearned(),
        savedAt: new Date().toISOString(),
        // no videoUrl — should not be counted
      },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))

    // Act: purge all video previews
    const removed = purgeTemplateVideoPreviews()

    // Assert: 2 templates had videoUrl, 1 did not
    expect(removed).toBe(2)

    // All templates in the store must now have no videoUrl
    const allAfter = getAllTemplates()
    expect(allAfter.every((t) => t.videoUrl === undefined)).toBe(true)

    process.stdout.write(`[STORAGE] purgeTemplateVideoPreviews() removed ${removed} videoUrl fields, all templates now have videoUrl=undefined ✓\n`)
  })
})
