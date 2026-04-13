/**
 * @jest-environment node
 */
export {}
/**
 * Tests for app/api/exercises/assign/route.ts — POST handler
 *
 * This route allows a doctor to assign an exercise to one of their patients.
 * Security model:
 *   - Requires a valid Bearer token in the Authorization header
 *   - The caller must be found in the `doctors` table (role check)
 *   - The patient must be linked to that specific doctor (ownership check)
 *   - All DB operations use an admin client (service role key) for elevated access
 *
 * Call order in route:
 *   1st createClient() → admin client (serviceKey)
 *   2nd createClient() → auth client (anonKey) → .auth.getUser(token)
 *   All subsequent DB calls use the admin client from call 1.
 */

// ---------------------------------------------------------------------------
// Helpers — build test requests and mock Supabase clients
// ---------------------------------------------------------------------------

/**
 * Constructs a POST Request to the assign endpoint.
 * Pass authToken to include a Bearer Authorization header.
 */
function makeRequest(body: object, authToken?: string): Request {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`
  return new Request("http://localhost/api/exercises/assign", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
}

/**
 * A fully valid request body that should pass all validation checks.
 * Tests that want to trigger validation failures should omit or corrupt fields here.
 */
const VALID_BODY = {
  patient_id: "patient-uuid",
  name: "Knee Extension 3x10",
  exercise_type: "knee-extension",
  video_path: "knee-extension/vid.webm",
  video_url: "https://storage.supabase.co/vid.webm",
  template: { states: [] },
}

/**
 * Dynamically loads the route handler with the specified mock for createClient.
 * This is necessary because the route module caches the client on import —
 * we must reset modules between tests so each test gets its own clean mock.
 */
function loadRoute(mockCreateClient: jest.Mock) {
  jest.resetModules()
  jest.doMock("@supabase/supabase-js", () => ({ createClient: mockCreateClient }))
  return require("@/app/api/exercises/assign/route").POST
}

/**
 * Builds a two-call mock for createClient:
 *   Call 1 → returns adminReturn (the service-role admin client)
 *   Call 2 → returns an auth client that resolves getUser with authUser / authError
 *
 * This mirrors the exact call order in the route implementation.
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
// Environment setup — provide all required env vars before each test,
// delete them after so tests do not bleed state into one another.
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

describe("POST /api/exercises/assign — doctor assigns exercise to patient", () => {

  // ── Environment validation ───────────────────────────────────────────────

  describe("environment variable validation", () => {
    it("returns HTTP 500 when SUPABASE_SERVICE_ROLE_KEY is missing, because the route cannot create an admin client without it", async () => {
      // Arrange: remove the service role key that the route needs to bootstrap
      delete process.env.SUPABASE_SERVICE_ROLE_KEY
      const POST = loadRoute(jest.fn())

      // Act
      const res = await POST(makeRequest(VALID_BODY, "token"))

      // Assert: the route must short-circuit before any DB work with a server error
      expect(res.status).toBe(500)
      process.stdout.write("[ENV] Missing SUPABASE_SERVICE_ROLE_KEY → correctly returned 500\n")
    })
  })

  // ── Authentication checks ────────────────────────────────────────────────

  describe("authentication — Bearer token validation", () => {
    it("returns HTTP 401 when the Authorization header is completely absent, because unauthenticated callers must never reach DB operations", async () => {
      // Arrange: admin client mock is provided, but no auth header in request
      const POST = loadRoute(jest.fn().mockReturnValue({ from: jest.fn() }))

      // Act: request with no Authorization header
      const res = await POST(makeRequest(VALID_BODY))

      // Assert: the route must reject before touching the database
      expect(res.status).toBe(401)
      process.stdout.write("[AUTH] Missing Authorization header → correctly returned 401\n")
    })

    it("returns HTTP 401 when the Bearer token is invalid or expired, because an unverifiable identity must be treated as unauthenticated", async () => {
      // Arrange: Supabase auth returns null user and an error (invalid token)
      const POST = loadRoute(makeMock({ from: jest.fn() }, null, { message: "jwt expired" }))

      // Act
      const res = await POST(makeRequest(VALID_BODY, "bad-token"))

      // Assert
      expect(res.status).toBe(401)
      process.stdout.write("[AUTH] Invalid/expired token → correctly returned 401\n")
    })
  })

  // ── Request body validation ──────────────────────────────────────────────

  describe("request body validation", () => {
    it("returns HTTP 400 when required fields (name, exercise_type, video_path, template) are missing from the body, because the route must validate inputs before DB writes", async () => {
      // Arrange: authenticated user with valid doctor identity, but incomplete body
      // Only patient_id is present — all other required fields are missing
      const POST = loadRoute(makeMock({ from: jest.fn() }, { id: "dr-1" }))

      // Act: send a body with only patient_id
      const res = await POST(makeRequest({ patient_id: "p1" }, "token"))

      // Assert: validation must reject before any DB work
      expect(res.status).toBe(400)
      process.stdout.write("[VALIDATION] Incomplete body (only patient_id) → correctly returned 400\n")
    })
  })

  // ── Authorization — role and relationship checks ─────────────────────────

  describe("authorization — role and patient ownership", () => {
    it("returns HTTP 403 with an 'Only doctors' error message when the authenticated user is not in the doctors table", async () => {
      // Arrange: the doctors lookup returns no row — user is not a doctor
      const adminClient = {
        from: jest.fn().mockImplementation(() => ({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: "not found" },
          }),
        })),
      }
      const POST = loadRoute(makeMock(adminClient, { id: "not-a-doctor-user" }))

      // Act
      const res = await POST(makeRequest(VALID_BODY, "token"))
      const body = await res.json()

      // Assert: must be forbidden with an informative error
      expect(res.status).toBe(403)
      expect(body.error).toMatch(/Only doctors/,)
      process.stdout.write("[AUTHZ] Non-doctor caller → correctly returned 403 with 'Only doctors' message\n")
    })

    it("returns HTTP 403 when the target patient is not linked to this doctor, preventing a doctor from assigning exercises to another doctor's patients", async () => {
      // Arrange: doctors lookup succeeds (call 1), but patients lookup fails (call 2 — patient
      // not linked to this doctor)
      let callCount = 0
      const adminClient = {
        from: jest.fn().mockImplementation(() => {
          callCount++
          if (callCount === 1) {
            // doctors table → doctor exists
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({ data: { id: "dr-1" }, error: null }),
            }
          }
          // patients table → patient not linked to this doctor
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: "patient not linked" },
            }),
          }
        }),
      }
      const POST = loadRoute(makeMock(adminClient, { id: "dr-1" }))

      // Act
      const res = await POST(makeRequest(VALID_BODY, "token"))
      const body = await res.json()

      // Assert
      expect(res.status).toBe(403)
      expect(body.error).toMatch(/Patient not found/)
      process.stdout.write("[AUTHZ] Patient not linked to doctor → correctly returned 403 with 'Patient not found' message\n")
    })
  })

  // ── Database operation failures ──────────────────────────────────────────

  describe("database error handling", () => {
    it("returns HTTP 500 when the exercise_assignments insert fails (e.g. a database constraint violation), because a failed write must not silently succeed", async () => {
      // Arrange: doctor check (call 1) and patient check (call 2) both pass,
      // but the actual insert (call 3) fails with a DB error
      let callCount = 0
      const adminClient = {
        from: jest.fn().mockImplementation(() => {
          callCount++
          if (callCount === 1) {
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({ data: { id: "dr-1" }, error: null }),
            }
          }
          if (callCount === 2) {
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({ data: { id: "patient-uuid" }, error: null }),
            }
          }
          // Insert fails — simulates a DB constraint or server error
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: "unique constraint violation" },
            }),
          }
        }),
      }
      const POST = loadRoute(makeMock(adminClient, { id: "dr-1" }))

      // Act
      const res = await POST(makeRequest(VALID_BODY, "token"))

      // Assert
      expect(res.status).toBe(500)
      process.stdout.write("[DB] Insert failure → correctly returned 500\n")
    })
  })

  // ── Happy path ───────────────────────────────────────────────────────────

  describe("successful exercise assignment", () => {
    it("returns HTTP 200 with the new assignment's id when all checks pass and the DB insert succeeds", async () => {
      // Arrange: all three DB calls succeed — doctor exists, patient is linked, insert works
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
          if (callCount === 2) {
            // patients table → linked
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({ data: { id: "patient-uuid" }, error: null }),
            }
          }
          // exercise_assignments insert → success, returns new row
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { id: "new-assignment-uuid" },
              error: null,
            }),
          }
        }),
      }
      const POST = loadRoute(makeMock(adminClient, { id: "dr-1" }))

      // Act
      const res = await POST(makeRequest(VALID_BODY, "token"))
      const body = await res.json()

      // Assert: response must be 200 and body must contain the new assignment id
      expect(res.status).toBe(200)
      expect(body.id).toBe("new-assignment-uuid")
      process.stdout.write("[SUCCESS] Valid assignment → correctly returned 200 with assignment id 'new-assignment-uuid'\n")
    })
  })

  // ── Unexpected errors ────────────────────────────────────────────────────

  describe("unexpected / unhandled errors", () => {
    it("returns HTTP 500 when createClient itself throws an exception (e.g. network failure during client construction), so the error does not propagate as an unhandled rejection", async () => {
      // Arrange: the very first call to createClient throws — simulates a catastrophic failure
      const mockCreate = jest.fn().mockImplementation(() => {
        throw new Error("network failure — could not reach Supabase")
      })
      const POST = loadRoute(mockCreate)

      // Act
      const res = await POST(makeRequest(VALID_BODY, "token"))

      // Assert: the catch-all handler must return 500, never a 500 crash
      expect(res.status).toBe(500)
      process.stdout.write("[ERROR] createClient threw unexpectedly → correctly returned 500\n")
    })
  })
})
