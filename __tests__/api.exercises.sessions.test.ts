/**
 * @jest-environment node
 */
export {}
/**
 * Tests for app/api/exercises/sessions/route.ts — POST handler
 *
 * This route saves a completed exercise session for a patient.
 * It records how many reps were done, the similarity score vs. the ideal template,
 * and when the session was completed.
 *
 * Security model:
 *   - Requires a valid Bearer token (patient must be authenticated)
 *   - Uses a service-role admin client for DB writes (bypasses RLS)
 *
 * Notable behaviour:
 *   - similarity_score is ROUNDED before insert (prevents storing decimals)
 *   - reps_completed defaults to 0 when not supplied
 *
 * Call order in route:
 *   1st createClient() → admin client (serviceKey)
 *   2nd createClient() → auth client (anonKey) → .auth.getUser(token)
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Builds a POST request for the sessions endpoint.
 * authToken is optional — omit it to simulate an unauthenticated request.
 */
function makeRequest(body: object, authToken?: string): Request {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`
  return new Request("http://localhost/api/exercises/sessions", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
}

/**
 * Reloads the route module with a fresh mock for @supabase/supabase-js.
 * Must be called after jest.resetModules() to ensure each test gets a clean slate.
 */
function loadRoute(mockCreateClient: jest.Mock) {
  jest.resetModules()
  jest.doMock("@supabase/supabase-js", () => ({ createClient: mockCreateClient }))
  return require("@/app/api/exercises/sessions/route").POST
}

/**
 * Creates the two-call createClient mock that mirrors the route's own invocation order:
 *   Call 1 → adminReturn (used for all DB writes)
 *   Call 2 → auth wrapper that resolves getUser(token) → authUser / authError
 */
function makeMock(
  adminReturn: object,
  authUser: { id: string } | null,
  authError: object | null = null
): jest.Mock {
  return jest.fn()
    .mockReturnValueOnce(adminReturn)        // call 1: admin (service role)
    .mockReturnValueOnce({                   // call 2: auth (anon key)
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

describe("POST /api/exercises/sessions — save a completed patient exercise session", () => {

  // ── Environment validation ───────────────────────────────────────────────

  describe("environment variable validation", () => {
    it("returns HTTP 500 when SUPABASE_SERVICE_ROLE_KEY is not set, because the admin client cannot be created without it and no session can be safely persisted", async () => {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY
      const POST = loadRoute(jest.fn())

      const res = await POST(makeRequest({ assignment_id: "a1", similarity_score: 80 }, "token"))

      expect(res.status).toBe(500)
      process.stdout.write("[ENV] Missing SUPABASE_SERVICE_ROLE_KEY → correctly returned 500\n")
    })
  })

  // ── Authentication checks ────────────────────────────────────────────────

  describe("authentication — Bearer token validation", () => {
    it("returns HTTP 401 with an 'Not authenticated' error when no Authorization header is present, because sessions must be tied to a verified patient identity", async () => {
      // Arrange: admin client ready, but request carries no auth header
      const POST = loadRoute(jest.fn().mockReturnValue({ from: jest.fn() }))

      // Act: request missing Authorization header entirely
      const res = await POST(makeRequest({ assignment_id: "a1", similarity_score: 80 }))
      const body = await res.json()

      // Assert: the route must short-circuit before the DB call
      expect(res.status).toBe(401)
      expect(body.error).toMatch(/Not authenticated/)
      process.stdout.write("[AUTH] Missing Authorization header → correctly returned 401 with 'Not authenticated'\n")
    })

    it("returns HTTP 401 with an 'Invalid session' error when the Bearer token cannot be verified by Supabase, because a tampered or expired token is indistinguishable from no auth", async () => {
      // Arrange: Supabase reports an auth error — token is invalid
      const mockCreate = makeMock(
        { from: jest.fn() },   // admin client (not used on this path)
        null,                  // no user returned
        { message: "jwt malformed" }
      )
      const POST = loadRoute(mockCreate)

      // Act
      const res = await POST(makeRequest({ assignment_id: "a1", similarity_score: 80 }, "malformed-jwt"))
      const body = await res.json()

      // Assert
      expect(res.status).toBe(401)
      expect(body.error).toMatch(/Invalid session/)
      process.stdout.write("[AUTH] Invalid JWT → correctly returned 401 with 'Invalid session'\n")
    })
  })

  // ── Request body validation ──────────────────────────────────────────────

  describe("request body validation — required fields", () => {
    it("returns HTTP 400 with an error mentioning 'assignment_id' when that field is missing from the body, because the session cannot be linked to an exercise without it", async () => {
      // Arrange: authenticated patient, body is missing assignment_id
      const mockCreate = makeMock({ from: jest.fn() }, { id: "patient-1" })
      const POST = loadRoute(mockCreate)

      // Act: body only has similarity_score, no assignment_id
      const res = await POST(makeRequest({ similarity_score: 80 }, "good-token"))
      const body = await res.json()

      // Assert
      expect(res.status).toBe(400)
      expect(body.error).toMatch(/assignment_id/)
      process.stdout.write("[VALIDATION] Missing assignment_id → correctly returned 400 with 'assignment_id' in error\n")
    })

    it("returns HTTP 400 when similarity_score is absent from the body, because a session record without a score is meaningless for progress tracking", async () => {
      // Arrange: authenticated patient, body is missing similarity_score
      const mockCreate = makeMock({ from: jest.fn() }, { id: "patient-1" })
      const POST = loadRoute(mockCreate)

      // Act: body only has assignment_id, no similarity_score
      const res = await POST(makeRequest({ assignment_id: "a1" }, "good-token"))

      // Assert
      expect(res.status).toBe(400)
      process.stdout.write("[VALIDATION] Missing similarity_score → correctly returned 400\n")
    })
  })

  // ── Database error handling ──────────────────────────────────────────────

  describe("database error handling", () => {
    it("returns HTTP 500 when the DB insert into exercise_sessions fails, so the caller knows the session was NOT persisted and can retry", async () => {
      // Arrange: authentication passes, but the insert returns an error
      const adminClient = {
        from: jest.fn().mockReturnValue({
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: "foreign key constraint violation" },
          }),
        }),
      }
      const mockCreate = makeMock(adminClient, { id: "patient-1" })
      const POST = loadRoute(mockCreate)

      // Act
      const res = await POST(makeRequest({ assignment_id: "a1", similarity_score: 80 }, "good-token"))

      // Assert
      expect(res.status).toBe(500)
      process.stdout.write("[DB] Insert failure → correctly returned 500\n")
    })
  })

  // ── Happy path ───────────────────────────────────────────────────────────

  describe("successful session save", () => {
    it("returns HTTP 200 with ok:true and the persisted session object when all inputs are valid and the DB insert succeeds", async () => {
      // Arrange: complete happy path — auth passes, insert succeeds
      const adminClient = {
        from: jest.fn().mockReturnValue({
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { id: "session-uuid-123", completed_at: "2026-04-12T10:00:00Z" },
            error: null,
          }),
        }),
      }
      const mockCreate = makeMock(adminClient, { id: "patient-1" })
      const POST = loadRoute(mockCreate)

      // Act: full valid request with all optional fields
      const res = await POST(makeRequest({
        assignment_id: "assignment-001",
        similarity_score: 87,
        reps_completed: 5,
        reps_expected: 5,
      }, "valid-token"))
      const body = await res.json()

      // Assert: must confirm persistence and return the new session record
      expect(res.status).toBe(200)
      expect(body.ok).toBe(true)
      expect(body.session.id).toBe("session-uuid-123")
      process.stdout.write("[SUCCESS] Valid session → correctly returned 200 with ok:true and session.id='session-uuid-123'\n")
    })
  })

  // ── Data transformation ──────────────────────────────────────────────────

  describe("data transformation — values are normalized before DB write", () => {
    it("rounds similarity_score to the nearest integer before inserting, because storing decimal scores adds no clinical value and wastes storage", async () => {
      // Arrange: capture the argument passed to insert so we can inspect it
      let capturedInsertArg: any = null
      const adminClient = {
        from: jest.fn().mockReturnValue({
          insert: jest.fn().mockImplementation((arg: any) => {
            capturedInsertArg = arg
            return {
              select: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({
                data: { id: "s1", completed_at: "" },
                error: null,
              }),
            }
          }),
        }),
      }
      const mockCreate = makeMock(adminClient, { id: "patient-1" })
      const POST = loadRoute(mockCreate)

      // Act: supply a decimal score of 87.6 — should be stored as 88
      await POST(makeRequest({ assignment_id: "a1", similarity_score: 87.6 }, "token"))

      // Assert: the actual value written to the DB must be rounded
      expect(capturedInsertArg?.similarity_score).toBe(88)
      process.stdout.write("[TRANSFORM] similarity_score 87.6 → correctly rounded to 88 before insert\n")
    })

    it("defaults reps_completed to 0 when the field is absent from the request body, so the session record is never saved with a null rep count", async () => {
      // Arrange: capture the insert argument
      let capturedInsertArg: any = null
      const adminClient = {
        from: jest.fn().mockReturnValue({
          insert: jest.fn().mockImplementation((arg: any) => {
            capturedInsertArg = arg
            return {
              select: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({
                data: { id: "s1", completed_at: "" },
                error: null,
              }),
            }
          }),
        }),
      }
      const mockCreate = makeMock(adminClient, { id: "patient-1" })
      const POST = loadRoute(mockCreate)

      // Act: omit reps_completed entirely
      await POST(makeRequest({ assignment_id: "a1", similarity_score: 80 }, "token"))

      // Assert: the defaulted value of 0 must be written (not undefined or null)
      expect(capturedInsertArg?.reps_completed).toBe(0)
      process.stdout.write("[TRANSFORM] Omitted reps_completed → correctly defaulted to 0 before insert\n")
    })
  })

  // ── Unexpected errors ────────────────────────────────────────────────────

  describe("unexpected / unhandled errors", () => {
    it("returns HTTP 500 with an 'Unexpected error' message when createClient itself throws synchronously, so unhandled exceptions are always surfaced as a structured JSON response", async () => {
      // Arrange: createClient blows up immediately — worst-case failure scenario
      const mockCreate = jest.fn().mockImplementation(() => {
        throw new Error("ECONNREFUSED — Supabase unreachable")
      })
      const POST = loadRoute(mockCreate)

      // Act
      const res = await POST(makeRequest({ assignment_id: "a1", similarity_score: 80 }, "token"))
      const body = await res.json()

      // Assert: the catch-all handler must produce a structured 500, never a naked throw
      expect(res.status).toBe(500)
      expect(body.error).toMatch(/Unexpected error/)
      process.stdout.write("[ERROR] createClient threw synchronously → correctly returned 500 with 'Unexpected error'\n")
    })
  })
})
