/**
 * @jest-environment node
 */
export {}
/**
 * Tests for app/api/exercises/signed-url/route.ts — GET handler
 *
 * This route generates a short-lived signed URL so that a patient can stream
 * their own exercise video from Supabase Storage.
 *
 * Security model:
 *   - Requires a valid Bearer token (patient must be authenticated)
 *   - The assignment must exist in the DB
 *   - The assignment's patient_id must match the authenticated user — a patient
 *     cannot access another patient's video, even if they guess the assignment id
 *
 * Call order in route:
 *   1st createClient() → admin client (serviceKey) — used for DB lookup + Storage
 *   2nd createClient() → auth client (anonKey) → .auth.getUser(token)
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Builds a GET Request to the signed-url endpoint.
 * The url param should include the query string (e.g. "?id=abc").
 */
function makeRequest(url: string, authToken?: string): Request {
  const headers: Record<string, string> = {}
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`
  return new Request(url, { method: "GET", headers })
}

const BASE = "http://localhost/api/exercises/signed-url"

/**
 * Reloads the GET route handler with a fresh Supabase mock.
 */
function loadRoute(mockCreateClient: jest.Mock) {
  jest.resetModules()
  jest.doMock("@supabase/supabase-js", () => ({ createClient: mockCreateClient }))
  return require("@/app/api/exercises/signed-url/route").GET
}

/**
 * Creates the two-call createClient mock:
 *   Call 1 → adminReturn (used for DB and Storage operations)
 *   Call 2 → auth wrapper that resolves getUser → authUser / authError
 */
function makeMock(
  adminReturn: object,
  authUser: { id: string } | null,
  authError: object | null = null
): jest.Mock {
  return jest.fn()
    .mockReturnValueOnce(adminReturn)   // call 1: admin (service role)
    .mockReturnValueOnce({              // call 2: auth (anon key)
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

describe("GET /api/exercises/signed-url — generate a temporary video access URL for a patient", () => {

  // ── Environment validation ───────────────────────────────────────────────

  describe("environment variable validation", () => {
    it("returns HTTP 500 when SUPABASE_SERVICE_ROLE_KEY is not configured, because the admin client needed to call Supabase Storage cannot be created", async () => {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY
      const GET = loadRoute(jest.fn())

      const res = await GET(makeRequest(`${BASE}?id=a1`, "token"))

      expect(res.status).toBe(500)
      process.stdout.write("[ENV] Missing SUPABASE_SERVICE_ROLE_KEY → correctly returned 500\n")
    })
  })

  // ── Authentication checks ────────────────────────────────────────────────

  describe("authentication — Bearer token validation", () => {
    it("returns HTTP 401 when the Authorization header is absent, because video access must always be tied to a verified patient identity", async () => {
      // Arrange: admin client present, but no auth header in request
      const GET = loadRoute(jest.fn().mockReturnValue({ from: jest.fn(), storage: {} }))

      // Act: request with no Authorization header — simulates anonymous browser access
      const res = await GET(makeRequest(`${BASE}?id=a1`))

      // Assert
      expect(res.status).toBe(401)
      process.stdout.write("[AUTH] Missing Authorization header → correctly returned 401\n")
    })

    it("returns HTTP 401 when the Bearer token is invalid, because we cannot associate the request with any patient and must deny video access", async () => {
      // Arrange: Supabase confirms the token is bad
      const GET = loadRoute(makeMock({ from: jest.fn(), storage: {} }, null, { message: "invalid jwt" }))

      // Act
      const res = await GET(makeRequest(`${BASE}?id=a1`, "invalid-token"))

      // Assert
      expect(res.status).toBe(401)
      process.stdout.write("[AUTH] Invalid token → correctly returned 401\n")
    })
  })

  // ── Request parameter validation ─────────────────────────────────────────

  describe("request parameter validation", () => {
    it("returns HTTP 400 with a 'Missing assignment id' error when the id query parameter is not present in the URL, because a signed URL cannot be generated without knowing which assignment to serve", async () => {
      // Arrange: authenticated user, but no ?id= param in the URL
      const GET = loadRoute(makeMock({ from: jest.fn(), storage: {} }, { id: "patient-1" }))

      // Act: request to the base URL without any query params
      const res = await GET(makeRequest(BASE, "good-token"))
      const body = await res.json()

      // Assert: the route must tell the caller exactly what is missing
      expect(res.status).toBe(400)
      expect(body.error).toMatch(/Missing assignment id/)
      process.stdout.write("[VALIDATION] Missing ?id= param → correctly returned 400 with 'Missing assignment id'\n")
    })
  })

  // ── Database / resource lookup ───────────────────────────────────────────

  describe("resource lookup — assignment existence and ownership", () => {
    it("returns HTTP 404 when the assignment id does not match any row in the database, because guessing a non-existent id should not reveal storage structure", async () => {
      // Arrange: DB lookup returns no row
      const adminClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: "no rows returned" },
          }),
        }),
        storage: {},
      }
      const GET = loadRoute(makeMock(adminClient, { id: "patient-1" }))

      // Act
      const res = await GET(makeRequest(`${BASE}?id=nonexistent-assignment-id`, "good-token"))

      // Assert
      expect(res.status).toBe(404)
      process.stdout.write("[LOOKUP] Unknown assignment id → correctly returned 404\n")
    })

    it("returns HTTP 403 with a 'Not authorized' error when the assignment's patient_id does not match the authenticated user's id, preventing cross-patient video access", async () => {
      // Arrange: assignment exists, but belongs to a DIFFERENT patient than the caller
      const adminClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: {
              video_path: "knee-extension/video.webm",
              patient_id: "patient-OTHER",   // ← belongs to a different patient
            },
            error: null,
          }),
        }),
        storage: {},
      }
      // Authenticated as patient-1, but assignment belongs to patient-OTHER
      const GET = loadRoute(makeMock(adminClient, { id: "patient-1" }))

      // Act
      const res = await GET(makeRequest(`${BASE}?id=a1`, "patient-1-token"))
      const body = await res.json()

      // Assert: must be a 403, not a 404, so the caller knows the resource exists but is forbidden
      expect(res.status).toBe(403)
      expect(body.error).toMatch(/Not authorized/)
      process.stdout.write("[AUTHZ] Assignment owned by different patient → correctly returned 403 with 'Not authorized'\n")
    })
  })

  // ── Storage operation failures ───────────────────────────────────────────

  describe("storage operation failure handling", () => {
    it("returns HTTP 500 when Supabase Storage fails to generate a signed URL, because a broken signed URL would leave the patient unable to view their video", async () => {
      // Arrange: DB lookup succeeds, but Storage.createSignedUrl fails
      const adminClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { video_path: "knee-extension/vid.webm", patient_id: "patient-1" },
            error: null,
          }),
        }),
        storage: {
          from: jest.fn().mockReturnValue({
            createSignedUrl: jest.fn().mockResolvedValue({
              data: null,
              error: { message: "bucket not found — storage misconfiguration" },
            }),
          }),
        },
      }
      const GET = loadRoute(makeMock(adminClient, { id: "patient-1" }))

      // Act
      const res = await GET(makeRequest(`${BASE}?id=a1`, "good-token"))

      // Assert
      expect(res.status).toBe(500)
      process.stdout.write("[STORAGE] createSignedUrl failed → correctly returned 500\n")
    })
  })

  // ── Happy path ───────────────────────────────────────────────────────────

  describe("successful signed URL generation", () => {
    it("returns HTTP 200 with a signedUrl string when the assignment exists, belongs to the caller, and Storage generates the URL successfully", async () => {
      // Arrange: every step succeeds — DB row found, ownership matches, Storage signs the URL
      const adminClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { video_path: "knee-extension/vid.webm", patient_id: "patient-1" },
            error: null,
          }),
        }),
        storage: {
          from: jest.fn().mockReturnValue({
            createSignedUrl: jest.fn().mockResolvedValue({
              data: { signedUrl: "https://signed.supabase.co/storage/v1/object/sign/exercise-videos/knee-extension/vid.webm?token=abc123" },
              error: null,
            }),
          }),
        },
      }
      const GET = loadRoute(makeMock(adminClient, { id: "patient-1" }))

      // Act
      const res = await GET(makeRequest(`${BASE}?id=a1`, "good-token"))
      const body = await res.json()

      // Assert: must return the exact signedUrl that Storage produced
      expect(res.status).toBe(200)
      expect(body.signedUrl).toBe(
        "https://signed.supabase.co/storage/v1/object/sign/exercise-videos/knee-extension/vid.webm?token=abc123"
      )
      process.stdout.write("[SUCCESS] All checks passed → correctly returned 200 with signedUrl\n")
    })
  })

  // ── Unexpected errors ────────────────────────────────────────────────────

  describe("unexpected / unhandled errors", () => {
    it("returns HTTP 500 when createClient throws synchronously (catastrophic failure), ensuring the error is caught and returned as a structured JSON response rather than crashing the server", async () => {
      // Arrange: createClient explodes immediately
      const mockCreate = jest.fn().mockImplementation(() => {
        throw new Error("Supabase SDK not initialized")
      })
      const GET = loadRoute(mockCreate)

      // Act
      const res = await GET(makeRequest(`${BASE}?id=a1`, "token"))

      // Assert
      expect(res.status).toBe(500)
      process.stdout.write("[ERROR] createClient threw synchronously → correctly returned 500\n")
    })
  })
})
