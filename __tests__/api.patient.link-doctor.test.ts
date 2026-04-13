/**
 * @jest-environment node
 */
export {}
/**
 * Tests for app/api/patient/link-doctor/route.ts — POST handler
 *
 * This route allows a patient to link themselves to a doctor by providing
 * the doctor's unique sharing code. Once linked, the doctor gains access to
 * the patient's session history for monitoring progress.
 *
 * Security model:
 *   - Requires a valid Bearer token (patient must be authenticated)
 *   - doctor_code must be a non-empty string
 *   - doctor_code is normalised (trimmed + uppercased) before lookup, so
 *     "  dr-abcd  " and "DR-ABCD" both resolve to the same doctor
 *
 * Call order in route:
 *   1st createClient() → admin client (serviceKey)
 *   2nd createClient() → auth client (anonKey) → .auth.getUser(token)
 *   Admin client DB calls (in order):
 *     1. doctors table — look up the doctor_code
 *     2. users table   — fetch doctor's display name
 *     3. patients table — update the patient's linked doctor_id
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Constructs a POST request to the link-doctor endpoint. */
function makeRequest(body: object, authToken?: string): Request {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`
  return new Request("http://localhost/api/patient/link-doctor", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
}

/** Reloads the route handler with a fresh Supabase mock. */
function loadRoute(mockCreateClient: jest.Mock) {
  jest.resetModules()
  jest.doMock("@supabase/supabase-js", () => ({ createClient: mockCreateClient }))
  return require("@/app/api/patient/link-doctor/route").POST
}

/**
 * Builds the two-call createClient mock:
 *   Call 1 → adminReturn (service-role client)
 *   Call 2 → auth wrapper resolving getUser → authUser / authError
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

describe("POST /api/patient/link-doctor — patient links themselves to a doctor using a sharing code", () => {

  // ── Environment validation ───────────────────────────────────────────────

  describe("environment variable validation", () => {
    it("returns HTTP 500 when SUPABASE_SERVICE_ROLE_KEY is missing, because the admin client required for the doctor lookup and patient update cannot be created", async () => {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY
      const POST = loadRoute(jest.fn())

      const res = await POST(makeRequest({ doctor_code: "DR-ABCD" }, "token"))

      expect(res.status).toBe(500)
      process.stdout.write("[ENV] Missing SUPABASE_SERVICE_ROLE_KEY → correctly returned 500\n")
    })
  })

  // ── Authentication checks ────────────────────────────────────────────────

  describe("authentication — Bearer token validation", () => {
    it("returns HTTP 401 when no Authorization header is present, because an anonymous caller cannot link to a doctor — there is no patient identity to link", async () => {
      // Arrange: admin client ready, request has no auth header
      const POST = loadRoute(jest.fn().mockReturnValue({ from: jest.fn() }))

      // Act
      const res = await POST(makeRequest({ doctor_code: "DR-ABCD" }))

      // Assert
      expect(res.status).toBe(401)
      process.stdout.write("[AUTH] Missing Authorization header → correctly returned 401\n")
    })

    it("returns HTTP 401 when the Bearer token is invalid, because an unverified patient identity cannot be linked to a doctor's account", async () => {
      // Arrange: Supabase confirms the token is bad
      const POST = loadRoute(makeMock({ from: jest.fn() }, null, { message: "jwt expired" }))

      // Act
      const res = await POST(makeRequest({ doctor_code: "DR-ABCD" }, "expired-token"))

      // Assert
      expect(res.status).toBe(401)
      process.stdout.write("[AUTH] Expired token → correctly returned 401\n")
    })
  })

  // ── Request body validation ──────────────────────────────────────────────

  describe("request body validation — doctor_code field", () => {
    it("returns HTTP 400 with a 'Doctor code is required' error when doctor_code is absent from the request body, because the route cannot perform a lookup without it", async () => {
      // Arrange: authenticated patient, body is an empty object
      const POST = loadRoute(makeMock({ from: jest.fn() }, { id: "patient-1" }))

      // Act: body has no doctor_code at all
      const res = await POST(makeRequest({}, "patient-token"))
      const body = await res.json()

      // Assert: the error message must guide the caller toward the solution
      expect(res.status).toBe(400)
      expect(body.error).toMatch(/Doctor code is required/)
      process.stdout.write("[VALIDATION] Missing doctor_code → correctly returned 400 with 'Doctor code is required'\n")
    })

    it("returns HTTP 400 when doctor_code is provided but is not a string (e.g. a number), because non-string codes cannot be normalised or looked up", async () => {
      // Arrange: authenticated patient, body has doctor_code as a number
      const POST = loadRoute(makeMock({ from: jest.fn() }, { id: "patient-1" }))

      // Act: pass doctor_code as integer 1234 — type checking must reject this
      const res = await POST(makeRequest({ doctor_code: 1234 }, "patient-token"))

      // Assert
      expect(res.status).toBe(400)
      process.stdout.write("[VALIDATION] Non-string doctor_code (number 1234) → correctly returned 400\n")
    })
  })

  // ── Resource lookup ──────────────────────────────────────────────────────

  describe("doctor code lookup — code must exist in the system", () => {
    it("returns HTTP 404 with an 'Invalid doctor code' error when no doctor in the system has the provided code, so the patient receives actionable feedback rather than a generic error", async () => {
      // Arrange: doctors lookup returns no row
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
      const POST = loadRoute(makeMock(adminClient, { id: "patient-1" }))

      // Act: attempt to link with a code that does not exist
      const res = await POST(makeRequest({ doctor_code: "DR-ZZZZ" }, "patient-token"))
      const body = await res.json()

      // Assert
      expect(res.status).toBe(404)
      expect(body.error).toMatch(/Invalid doctor code/)
      process.stdout.write("[LOOKUP] Unknown doctor code 'DR-ZZZZ' → correctly returned 404 with 'Invalid doctor code'\n")
    })
  })

  // ── Database update failure ──────────────────────────────────────────────

  describe("database error handling — patient update", () => {
    it("returns HTTP 500 when the patients.update fails after the doctor is found, so the patient knows the link was not established and can try again", async () => {
      // Arrange:
      //   Call 1 → doctors lookup succeeds (doctor found)
      //   Call 2 → users lookup succeeds (doctor name retrieved)
      //   Call 3 → patients.update fails (DB error)
      let callCount = 0
      const adminClient = {
        from: jest.fn().mockImplementation(() => {
          callCount++
          if (callCount === 1) {
            // doctors → found
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({ data: { id: "dr-1" }, error: null }),
            }
          }
          if (callCount === 2) {
            // users → found
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({
                data: { first_name: "Alice", last_name: "Smith" },
                error: null,
              }),
            }
          }
          // patients.update → fails with a DB constraint error
          return {
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ error: { message: "foreign key violation" } }),
          }
        }),
      }
      const POST = loadRoute(makeMock(adminClient, { id: "patient-1" }))

      // Act
      const res = await POST(makeRequest({ doctor_code: "DR-ABCD" }, "patient-token"))

      // Assert
      expect(res.status).toBe(500)
      process.stdout.write("[DB] patients.update failure → correctly returned 500\n")
    })
  })

  // ── Happy paths ──────────────────────────────────────────────────────────

  describe("successful doctor link", () => {
    it("returns HTTP 200 with ok:true and the doctor's full name (first + last) when all three DB operations succeed", async () => {
      // Arrange: all three calls succeed
      let callCount = 0
      const adminClient = {
        from: jest.fn().mockImplementation(() => {
          callCount++
          if (callCount === 1) {
            // doctors → found
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({ data: { id: "dr-1" }, error: null }),
            }
          }
          if (callCount === 2) {
            // users → found with name
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({
                data: { first_name: "Alice", last_name: "Smith" },
                error: null,
              }),
            }
          }
          // patients.update → success
          return {
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ error: null }),
          }
        }),
      }
      const POST = loadRoute(makeMock(adminClient, { id: "patient-1" }))

      // Act
      const res = await POST(makeRequest({ doctor_code: "DR-ABCD" }, "patient-token"))
      const body = await res.json()

      // Assert: full name must be constructed from first_name + " " + last_name
      expect(res.status).toBe(200)
      expect(body.ok).toBe(true)
      expect(body.doctor_name).toBe("Alice Smith")
      process.stdout.write("[SUCCESS] Valid link request → correctly returned 200 with ok:true and doctor_name='Alice Smith'\n")
    })

    it("returns 'Your Doctor' as the doctor_name fallback when the users table has no row for the doctor's user_id, so the UI never shows an empty or undefined name", async () => {
      // Arrange:
      //   Call 1 → doctors → found
      //   Call 2 → users → no row (data: null, error: null) — user row may not always exist
      //   Call 3 → patients.update → success
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
            // users → no row (doctor profile incomplete)
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({ data: null, error: null }),
            }
          }
          return {
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ error: null }),
          }
        }),
      }
      const POST = loadRoute(makeMock(adminClient, { id: "patient-1" }))

      // Act
      const res = await POST(makeRequest({ doctor_code: "DR-ABCD" }, "patient-token"))
      const body = await res.json()

      // Assert: must fall back to "Your Doctor" — never undefined or null
      expect(body.doctor_name).toBe("Your Doctor")
      process.stdout.write("[SUCCESS] Missing users row → correctly fell back to doctor_name='Your Doctor'\n")
    })
  })

  // ── Input normalisation ──────────────────────────────────────────────────

  describe("input normalisation — doctor_code is trimmed and uppercased before lookup", () => {
    it("strips surrounding whitespace and converts to uppercase before querying the doctors table, so patients typing '  dr-abcd  ' or 'dr-ABCD' all find the same doctor", async () => {
      // Arrange: capture the exact value passed to .eq() for the doctor_code column
      let capturedEqValue: string | null = null
      const adminClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockImplementation((_col: string, val: string) => {
            if (_col === "doctor_code") capturedEqValue = val
            return {
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: "not found — we don't care about the result here" },
              }),
            }
          }),
          single: jest.fn().mockResolvedValue({ data: null, error: { message: "not found" } }),
        }),
      }
      const POST = loadRoute(makeMock(adminClient, { id: "patient-1" }))

      // Act: input has leading/trailing spaces and mixed case — the worst-case user input
      await POST(makeRequest({ doctor_code: "  dr-abcd  " }, "patient-token"))

      // Assert: the actual lookup value must be the normalised "DR-ABCD"
      expect(capturedEqValue).toBe("DR-ABCD")
      process.stdout.write("[NORMALISE] Input '  dr-abcd  ' → correctly normalised to 'DR-ABCD' before lookup\n")
    })
  })

  // ── Unexpected errors ────────────────────────────────────────────────────

  describe("unexpected / unhandled errors", () => {
    it("returns HTTP 500 when createClient throws synchronously, so the error is always returned as a structured JSON response and never crashes the server", async () => {
      // Arrange: createClient explodes immediately
      const mockCreate = jest.fn().mockImplementation(() => {
        throw new Error("Supabase initialisation error")
      })
      const POST = loadRoute(mockCreate)

      // Act
      const res = await POST(makeRequest({ doctor_code: "DR-ABCD" }, "token"))

      // Assert
      expect(res.status).toBe(500)
      process.stdout.write("[ERROR] createClient threw synchronously → correctly returned 500\n")
    })
  })
})
