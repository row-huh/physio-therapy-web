/**
 * Tests for lib/ideal-template-manager.ts
 *
 * All Supabase calls are mocked — no real DB is ever hit.
 *
 * Covers:
 *   - getIdealTemplate()
 *       - returns null when Supabase returns error
 *       - returns null when data is null
 *       - returns cached value on second call (Supabase not called again)
 *       - returns template on success
 *   - storeIdealTemplate()
 *       - throws on Supabase upsert error
 *       - succeeds and populates cache
 *   - clearIdealTemplateCache()
 *       - forces re-fetch after being called
 */

// Mock the entire @supabase/supabase-js module so no real client is created.
// We intercept createClient to inject our mock implementation.

// The module-level `supabase` singleton in ideal-template-manager is imported
// from utils/supabase/client — we mock that path instead.

jest.mock("@/utils/supabase/client", () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  }
})

import { getIdealTemplate, storeIdealTemplate, clearIdealTemplateCache } from "@/lib/ideal-template-manager"
import { supabase } from "@/utils/supabase/client"
import type { LearnedExerciseTemplate } from "@/lib/exercise-state-learner"

// ---------------------------------------------------------------------------
// Helper: build a mock Supabase query chain
// ---------------------------------------------------------------------------

const mockSupabase = supabase as jest.Mocked<typeof supabase>

function makeMockChain(returnValue: any) {
  const chain: any = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue(returnValue),
    upsert: jest.fn().mockResolvedValue(returnValue),
  }
  return chain
}

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
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  clearIdealTemplateCache()
  jest.clearAllMocks()
})

// ---------------------------------------------------------------------------
// getIdealTemplate()
// ---------------------------------------------------------------------------

describe("getIdealTemplate", () => {
  it("returns null when Supabase returns an error", async () => {
    const chain = makeMockChain({ data: null, error: { message: "not found" } })
    ;(mockSupabase.from as jest.Mock).mockReturnValue(chain)

    const result = await getIdealTemplate("knee-extension")
    expect(result).toBeNull()
  })

  it("returns null when Supabase returns null data", async () => {
    const chain = makeMockChain({ data: null, error: null })
    ;(mockSupabase.from as jest.Mock).mockReturnValue(chain)

    const result = await getIdealTemplate("knee-extension")
    expect(result).toBeNull()
  })

  it("returns the template when Supabase succeeds", async () => {
    const template = makeTemplate()
    const chain = makeMockChain({ data: { template }, error: null })
    ;(mockSupabase.from as jest.Mock).mockReturnValue(chain)

    const result = await getIdealTemplate("knee-extension")
    expect(result).not.toBeNull()
    expect(result!.exerciseType).toBe("knee-extension")
  })

  it("returns cached value on second call without re-querying Supabase", async () => {
    const template = makeTemplate()
    const chain = makeMockChain({ data: { template }, error: null })
    ;(mockSupabase.from as jest.Mock).mockReturnValue(chain)

    await getIdealTemplate("knee-extension")
    const secondResult = await getIdealTemplate("knee-extension")

    // from() should only have been called once (cache hit on second call)
    expect(mockSupabase.from).toHaveBeenCalledTimes(1)
    expect(secondResult!.exerciseType).toBe("knee-extension")
  })

  it("fetches different exercise types independently", async () => {
    const kneeTemplate = makeTemplate("knee-extension")
    const scapTemplate = makeTemplate("scap-wall-slides")

    // Each call to from() returns a fresh chain with a dedicated single() resolution.
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

    const r1 = await getIdealTemplate("knee-extension")
    const r2 = await getIdealTemplate("scap-wall-slides")

    expect(r1!.exerciseType).toBe("knee-extension")
    expect(r2!.exerciseType).toBe("scap-wall-slides")
  })
})

// ---------------------------------------------------------------------------
// storeIdealTemplate()
// ---------------------------------------------------------------------------

describe("storeIdealTemplate", () => {
  it("throws when Supabase upsert returns an error", async () => {
    const chain = {
      upsert: jest.fn().mockResolvedValue({ error: { message: "db constraint violation" } }),
    }
    ;(mockSupabase.from as jest.Mock).mockReturnValue(chain)

    await expect(storeIdealTemplate("knee-extension", makeTemplate())).rejects.toThrow(
      "Failed to store ideal template: db constraint violation"
    )
  })

  it("succeeds silently when Supabase upsert has no error", async () => {
    const chain = {
      upsert: jest.fn().mockResolvedValue({ error: null }),
    }
    ;(mockSupabase.from as jest.Mock).mockReturnValue(chain)

    await expect(storeIdealTemplate("knee-extension", makeTemplate())).resolves.toBeUndefined()
  })

  it("updates the in-memory cache after successful store", async () => {
    const template = makeTemplate("knee-extension")
    const storeChain = {
      upsert: jest.fn().mockResolvedValue({ error: null }),
    }
    ;(mockSupabase.from as jest.Mock).mockReturnValue(storeChain)

    await storeIdealTemplate("knee-extension", template)

    // Now getIdealTemplate should return from cache without hitting Supabase
    const cached = await getIdealTemplate("knee-extension")
    // from() was only called once (for the store), not a second time for the get
    expect(mockSupabase.from).toHaveBeenCalledTimes(1)
    expect(cached!.exerciseType).toBe("knee-extension")
  })
})

// ---------------------------------------------------------------------------
// clearIdealTemplateCache()
// ---------------------------------------------------------------------------

describe("clearIdealTemplateCache", () => {
  it("forces a fresh Supabase query after clearing cache", async () => {
    const template = makeTemplate()
    const chain = makeMockChain({ data: { template }, error: null })
    ;(mockSupabase.from as jest.Mock).mockReturnValue(chain)

    // First call — populates cache
    await getIdealTemplate("knee-extension")
    expect(mockSupabase.from).toHaveBeenCalledTimes(1)

    // Clear cache
    clearIdealTemplateCache()

    // Second call — should hit Supabase again
    await getIdealTemplate("knee-extension")
    expect(mockSupabase.from).toHaveBeenCalledTimes(2)
  })
})
