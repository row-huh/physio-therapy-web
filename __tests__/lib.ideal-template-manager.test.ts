/**
 * Tests for lib/ideal-template-manager.ts
 *
 * This module manages the "ideal" exercise templates recorded by doctors.
 * These templates are used as the gold-standard reference when comparing a
 * patient's session recording — they define what correct form looks like.
 *
 * The module has an in-memory cache so that repeated calls for the same exercise
 * type do not redundantly hit the database. The cache must be invalidated when
 * a new template is stored.
 *
 * All Supabase calls are mocked — no real database is ever contacted.
 *
 * Exported functions:
 *   getIdealTemplate(exerciseType)   — fetch from cache or DB; returns null on miss
 *   storeIdealTemplate(type, tmpl)  — upsert to DB; throws on error; populates cache
 *   clearIdealTemplateCache()       — wipes the in-memory cache, forcing a fresh fetch
 */

// Mock the Supabase browser client singleton that the module imports.
// We replace the `supabase` export with a jest.fn()-controlled stub so we can
// inspect and control every .from() call without real network traffic.
jest.mock("@/utils/supabase/client", () => ({
  supabase: {
    from: jest.fn(),
  },
}))

import {
  getIdealTemplate,
  storeIdealTemplate,
  clearIdealTemplateCache,
} from "@/lib/ideal-template-manager"
import { supabase } from "@/utils/supabase/client"
import type { LearnedExerciseTemplate } from "@/lib/exercise-state-learner"

// ---------------------------------------------------------------------------
// Typed mock reference — gives us IntelliSense on the mock's methods
// ---------------------------------------------------------------------------

const mockSupabase = supabase as jest.Mocked<typeof supabase>

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Builds a minimal Supabase query chain mock.
 * The returnValue is what `.single()` and `.upsert()` resolve to.
 */
function makeMockChain(returnValue: any) {
  return {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue(returnValue),
    upsert: jest.fn().mockResolvedValue(returnValue),
  }
}

/**
 * Builds a minimal valid LearnedExerciseTemplate for a given exercise type.
 * The states array is empty — content-correctness of the template is not
 * what is being tested here.
 */
function makeTemplate(exerciseType = "knee-extension"): LearnedExerciseTemplate {
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
  }
}

// ---------------------------------------------------------------------------
// Test setup — clear cache and reset all mocks before each test to ensure
// no state bleeds between tests (the cache would cause false cache-hit results)
// ---------------------------------------------------------------------------

beforeEach(() => {
  // Clear the in-memory cache so each test starts with a cold cache
  clearIdealTemplateCache()
  // Reset mock call counts and return values
  jest.clearAllMocks()
})

// ===========================================================================
// getIdealTemplate()
// ===========================================================================

describe("getIdealTemplate — retrieve an ideal template for a given exercise type", () => {

  describe("database error and empty responses (should return null)", () => {
    it("returns null when Supabase returns an error (e.g. table does not exist or network issue), so callers can fall back gracefully rather than receiving a thrown exception", async () => {
      // Arrange: Supabase signals a DB-level error
      const chain = makeMockChain({ data: null, error: { message: "relation does not exist" } })
      ;(mockSupabase.from as jest.Mock).mockReturnValue(chain)

      // Act
      const result = await getIdealTemplate("knee-extension")

      // Assert: the module must swallow the error and return null
      expect(result).toBeNull()
      process.stdout.write("[GET] Supabase error → correctly returned null ✓\n")
    })

    it("returns null when Supabase returns a null data value with no error (row simply does not exist yet for this exercise type)", async () => {
      // Arrange: successful query that found zero rows
      const chain = makeMockChain({ data: null, error: null })
      ;(mockSupabase.from as jest.Mock).mockReturnValue(chain)

      // Act
      const result = await getIdealTemplate("knee-extension")

      // Assert: no row = no template; the caller must handle this null
      expect(result).toBeNull()
      process.stdout.write("[GET] Supabase returned null data → correctly returned null ✓\n")
    })
  })

  describe("successful fetch", () => {
    it("returns the template when Supabase returns a valid row, and the returned template's exerciseType matches the requested type", async () => {
      // Arrange: DB has a template for this exercise
      const template = makeTemplate("knee-extension")
      const chain = makeMockChain({ data: { template }, error: null })
      ;(mockSupabase.from as jest.Mock).mockReturnValue(chain)

      // Act
      const result = await getIdealTemplate("knee-extension")

      // Assert: must receive a non-null template with the correct exercise type
      expect(result).not.toBeNull()
      expect(result!.exerciseType).toBe("knee-extension")
      process.stdout.write("[GET] Supabase returned valid data → correctly returned template with exerciseType='knee-extension' ✓\n")
    })
  })

  describe("in-memory caching — the second call must not re-query Supabase", () => {
    it("serves the cached template on the second call for the same exercise type without making a second Supabase query, avoiding redundant DB round-trips", async () => {
      // Arrange: DB returns a template on first call
      const template = makeTemplate("knee-extension")
      const chain = makeMockChain({ data: { template }, error: null })
      ;(mockSupabase.from as jest.Mock).mockReturnValue(chain)

      // Act: call twice for the same exercise type
      await getIdealTemplate("knee-extension")
      const secondResult = await getIdealTemplate("knee-extension")

      // Assert: from() should have been called exactly once — second call is a cache hit
      expect(mockSupabase.from).toHaveBeenCalledTimes(1)
      expect(secondResult!.exerciseType).toBe("knee-extension")
      process.stdout.write("[CACHE] Two calls for same type → Supabase.from() called exactly 1 time (cache hit on second call) ✓\n")
    })

    it("caches templates for different exercise types independently, querying Supabase separately for each type", async () => {
      // Arrange: two different exercise types with different templates
      const kneeTemplate = makeTemplate("knee-extension")
      const scapTemplate = makeTemplate("scap-wall-slides")

      // Configure the mock to return different templates for each call
      ;(mockSupabase.from as jest.Mock)
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { template: kneeTemplate }, error: null }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { template: scapTemplate }, error: null }),
        })

      // Act: fetch both exercise types
      const r1 = await getIdealTemplate("knee-extension")
      const r2 = await getIdealTemplate("scap-wall-slides")

      // Assert: each result must match its requested exercise type
      expect(r1!.exerciseType).toBe("knee-extension")
      expect(r2!.exerciseType).toBe("scap-wall-slides")
      process.stdout.write("[CACHE] Two different exercise types → each correctly returned its own template ✓\n")
    })
  })
})

// ===========================================================================
// storeIdealTemplate()
// ===========================================================================

describe("storeIdealTemplate — persist a doctor's ideal template to the database", () => {

  it("throws an error containing the DB message when Supabase upsert returns an error, because the caller must know the template was not saved", async () => {
    // Arrange: upsert fails with a constraint violation
    const chain = {
      upsert: jest.fn().mockResolvedValue({ error: { message: "db constraint violation" } }),
    }
    ;(mockSupabase.from as jest.Mock).mockReturnValue(chain)

    // Act + Assert: must throw with the DB's error message included
    await expect(storeIdealTemplate("knee-extension", makeTemplate()))
      .rejects.toThrow("Failed to store ideal template: db constraint violation")

    process.stdout.write("[STORE] Upsert error → correctly threw 'Failed to store ideal template: db constraint violation' ✓\n")
  })

  it("resolves with undefined (returns nothing) when the upsert succeeds, because a successful write has no data to return", async () => {
    // Arrange: upsert succeeds
    const chain = {
      upsert: jest.fn().mockResolvedValue({ error: null }),
    }
    ;(mockSupabase.from as jest.Mock).mockReturnValue(chain)

    // Act + Assert: must resolve without value (void function)
    await expect(storeIdealTemplate("knee-extension", makeTemplate()))
      .resolves.toBeUndefined()

    process.stdout.write("[STORE] Successful upsert → correctly resolved with undefined ✓\n")
  })

  it("populates the in-memory cache after a successful store, so that an immediately-following getIdealTemplate() call returns from cache without hitting Supabase again", async () => {
    // Arrange: upsert succeeds
    const template = makeTemplate("knee-extension")
    const storeChain = {
      upsert: jest.fn().mockResolvedValue({ error: null }),
    }
    ;(mockSupabase.from as jest.Mock).mockReturnValue(storeChain)

    // Act: store the template, then immediately retrieve it
    await storeIdealTemplate("knee-extension", template)
    const cached = await getIdealTemplate("knee-extension")

    // Assert: from() was called exactly once (for the store), not a second time for the get
    expect(mockSupabase.from).toHaveBeenCalledTimes(1)
    expect(cached!.exerciseType).toBe("knee-extension")
    process.stdout.write("[STORE] After successful store → subsequent getIdealTemplate served from cache (Supabase.from called only 1 time) ✓\n")
  })
})

// ===========================================================================
// clearIdealTemplateCache()
// ===========================================================================

describe("clearIdealTemplateCache — invalidate the in-memory cache to force fresh DB reads", () => {
  it("causes the next getIdealTemplate() call to query Supabase again instead of serving the cached value, so that a freshly stored template is visible immediately after cache clear", async () => {
    // Arrange: a template is in the cache after the first fetch
    const template = makeTemplate("knee-extension")
    const chain = makeMockChain({ data: { template }, error: null })
    ;(mockSupabase.from as jest.Mock).mockReturnValue(chain)

    // First call — fetches from DB and populates cache
    await getIdealTemplate("knee-extension")
    expect(mockSupabase.from).toHaveBeenCalledTimes(1)

    // Act: clear the cache
    clearIdealTemplateCache()
    process.stdout.write("[CACHE CLEAR] clearIdealTemplateCache() called ✓\n")

    // Second call — must go back to Supabase (cache is empty)
    await getIdealTemplate("knee-extension")

    // Assert: from() was called a second time (cache miss after clear)
    expect(mockSupabase.from).toHaveBeenCalledTimes(2)
    process.stdout.write("[CACHE CLEAR] After cache clear, getIdealTemplate() queried Supabase again (from() called 2 times total) ✓\n")
  })
})
