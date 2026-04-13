/**
 * @jest-environment node
 */
export {}
/**
 * Tests for app/api/ideal-templates/store/route.ts — POST handler
 *
 * This route persists an "ideal" exercise template recorded by a doctor so it can
 * be used as a reference when scoring patient sessions.
 *
 * Security model:
 *   - Requires a valid Bearer token
 *   - Caller must be found in the `doctors` table — patients may not set ideal templates
 *   - exercise_type and template body fields must both be present
 *   - Uses a DB upsert so the doctor can overwrite a previously stored template
 *
 * Call order in route:
 *   1st createClient() → admin client (serviceKey)
 *   2nd createClient() → auth client (anonKey) → .auth.getUser(token)
 *   All subsequent DB calls use the admin client from call 1.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Constructs a POST request to the store endpoint. */
function makeRequest(body: object, authToken?: string): Request {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`
  return new Request("http://localhost/api/ideal-templates/store", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
}

/**
 * A valid, complete request body.
 * Template has an empty states array which is fine for these route-level tests —
 * content validation of the template structure is not the route's responsibility.
 */
const VALID_BODY = {
  exercise_type: "knee-extension",
  template: { states: [], exerciseType: "knee-extension" },
}

/** Reloads the route handler with a fresh Supabase mock. */
function loadRoute(mockCreateClient: jest.Mock) {
  jest.resetModules()
  jest.doMock("@supabase/supabase-js", () => ({ createClient: mockCreateClient }))
  return require("@/app/api/ideal-templates/store/route").POST
}

/**
 * Builds the two-call createClient mock:
 *   Call 1 → adminReturn (service-role client for all DB ops)
 *   Call 2 → auth wrapper resolving getUser with authUser / authError
 */
function makeMock(
  adminReturn: object,
  authUser: { id: string } | null,
  authError: object | null = null
): jest.Mock {
  return jest.fn()
    .mockReturnValueOnce(adminReturn)
    .mockReturnValueOnce({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: authUser },
          error: authError,
        }),
      },
    })
}

// ---------------------------------------------------------------------------
// Environment setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://mock.supabase.co"
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key"
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key"
})

afterEach(() => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  delete process.env.SUPABASE_SERVICE_ROLE_KEY
  jest.resetModules()
})

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe("POST /api/ideal-templates/store — doctor saves an ideal exercise reference template", () => {

  // ── Environment validation ───────────────────────────────────────────────

  describe("environment variable validation", () => {
    it("returns HTTP 500 when SUPABASE_SERVICE_ROLE_KEY is absent from the environment, because the route needs admin DB access to write templates and cannot proceed without it", async () => {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY
      const POST = loadRoute(jest.fn())

      const res = await POST(makeRequest(VALID_BODY, "token"))

      expect(res.status).toBe(500)
      process.stdout.write("[ENV] Missing SUPABASE_SERVICE_ROLE_KEY → correctly returned 500\n")
    })
  })

  // ── Authentication checks ────────────────────────────────────────────────

  describe("authentication — Bearer token validation", () => {
    it("returns HTTP 401 when no Authorization header is present, because anonymous callers must never be able to define the ideal templates used for patient scoring", async () => {
      // Arrange: admin client ready but request has no auth header
      const POST = loadRoute(jest.fn().mockReturnValue({ from: jest.fn() }))

      // Act
      const res = await POST(makeRequest(VALID_BODY))

      // Assert
      expect(res.status).toBe(401)
      process.stdout.write("[AUTH] Missing Authorization header → correctly returned 401\n")
    })

    it("returns HTTP 401 when the Bearer token is rejected by Supabase auth, because an unverified identity must not be allowed to set clinical reference data", async () => {
      // Arrange: Supabase returns null user + auth error
      const POST = loadRoute(makeMock({ from: jest.fn() }, null, { message: "token revoked" }))

      // Act
      const res = await POST(makeRequest(VALID_BODY, "revoked-token"))

      // Assert
      expect(res.status).toBe(401)
      process.stdout.write("[AUTH] Revoked token → correctly returned 401\n")
    })
  })

  // ── Authorization — role check ───────────────────────────────────────────

  describe("authorization — caller must be a doctor", () => {
    it("returns HTTP 403 with an 'Only doctors' message when the authenticated user is not found in the doctors table, because patients and other roles must never overwrite reference templates", async () => {
      // Arrange: doctors lookup returns no row → user is not a doctor
      const adminClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: "no row found" },
          }),
        }),
      }
      const POST = loadRoute(makeMock(adminClient, { id: "patient-user" }))

      // Act
      const res = await POST(makeRequest(VALID_BODY, "patient-token"))
      const body = await res.json()

      // Assert
      expect(res.status).toBe(403)
      expect(body.error).toMatch(/Only doctors/)
      process.stdout.write("[AUTHZ] Non-doctor caller → correctly returned 403 with 'Only doctors' message\n")
    })
  })

  // ── Request body validation ──────────────────────────────────────────────

  describe("request body validation — required fields", () => {
    it("returns HTTP 400 with a 'Missing' error when exercise_type is absent from the body, because without a type identifier the template cannot be indexed or retrieved later", async () => {
      // Arrange: doctor is authenticated, but body only has template (no exercise_type)
      let callCount = 0
      const adminClient = {
        from: jest.fn().mockImplementation(() => {
          callCount++
          // First call is the doctors check — must pass
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: { id: "dr-1" }, error: null }),
          }
        }),
      }
      const POST = loadRoute(makeMock(adminClient, { id: "dr-1" }))

      // Act: body has template but no exercise_type
      const res = await POST(makeRequest({ template: { states: [] } }, "doctor-token"))
      const body = await res.json()

      // Assert
      expect(res.status).toBe(400)
      expect(body.error).toMatch(/Missing/)
      process.stdout.write("[VALIDATION] Missing exercise_type → correctly returned 400 with 'Missing' in error\n")
    })

    it("returns HTTP 400 when template is absent from the body, because storing a template row without actual template data is meaningless", async () => {
      // Arrange: doctor passes auth, body only has exercise_type
      let callCount = 0
      const adminClient = {
        from: jest.fn().mockImplementation(() => {
          callCount++
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: { id: "dr-1" }, error: null }),
          }
        }),
      }
      const POST = loadRoute(makeMock(adminClient, { id: "dr-1" }))

      // Act: body has exercise_type but no template
      const res = await POST(makeRequest({ exercise_type: "knee-extension" }, "doctor-token"))

      // Assert
      expect(res.status).toBe(400)
      process.stdout.write("[VALIDATION] Missing template field → correctly returned 400\n")
    })
  })

  // ── Database operation failures ──────────────────────────────────────────

  describe("database error handling", () => {
    it("returns HTTP 500 when the DB upsert fails after all auth and validation checks pass, so the caller is informed that the template was NOT persisted and can retry", async () => {
      // Arrange: doctor check (call 1) passes, then upsert (call 2) fails
      let callCount = 0
      const adminClient = {
        from: jest.fn().mockImplementation(() => {
          callCount++
          if (callCount === 1) {
            // doctors check → passes
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({ data: { id: "dr-1" }, error: null }),
            }
          }
          // ideal_templates upsert → fails
          return {
            upsert: jest.fn().mockResolvedValue({ error: { message: "DB storage limit exceeded" } }),
          }
        }),
      }
      const POST = loadRoute(makeMock(adminClient, { id: "dr-1" }))

      // Act
      const res = await POST(makeRequest(VALID_BODY, "doctor-token"))

      // Assert
      expect(res.status).toBe(500)
      process.stdout.write("[DB] Upsert failure → correctly returned 500\n")
    })
  })

  // ── Happy path ───────────────────────────────────────────────────────────

  describe("successful template store", () => {
    it("returns HTTP 200 with success:true and the stored exercise_type when the doctor is verified and the upsert succeeds", async () => {
      // Arrange: both calls succeed — doctor confirmed, upsert completed
      let callCount = 0
      const adminClient = {
        from: jest.fn().mockImplementation(() => {
          callCount++
          if (callCount === 1) {
            // doctors table → found
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({ data: { id: "dr-1" }, error: null }),
            }
          }
          // ideal_templates upsert → success
          return {
            upsert: jest.fn().mockResolvedValue({ error: null }),
          }
        }),
      }
      const POST = loadRoute(makeMock(adminClient, { id: "dr-1" }))

      // Act
      const res = await POST(makeRequest(VALID_BODY, "doctor-token"))
      const body = await res.json()

      // Assert: confirm stored and echo back the exercise_type for the client to use
      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.exercise_type).toBe("knee-extension")
      process.stdout.write("[SUCCESS] Valid store request → correctly returned 200 with success:true and exercise_type='knee-extension'\n")
    })
  })

  // ── Unexpected errors ────────────────────────────────────────────────────

  describe("unexpected / unhandled errors", () => {
    it("returns HTTP 500 when createClient throws synchronously, ensuring the error does not escape as an unhandled rejection", async () => {
      // Arrange: createClient explodes immediately
      const mockCreate = jest.fn().mockImplementation(() => {
        throw new Error("Supabase client constructor failed")
      })
      const POST = loadRoute(mockCreate)

      // Act
      const res = await POST(makeRequest(VALID_BODY, "token"))

      // Assert
      expect(res.status).toBe(500)
      process.stdout.write("[ERROR] createClient threw synchronously → correctly returned 500\n")
    })
  })
})
