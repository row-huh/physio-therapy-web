/**
 * @jest-environment node
 */
export {}
/**
 * Whitebox tests — app/api/doctor/assign-exercise/route.ts — POST handler
 *
 * This is the doctor-facing exercise-assignment endpoint (distinct from
 * /api/exercises/assign in that it lives under /api/doctor/ and uses a
 * different client creation order).
 *
 * Security model:
 *   1. Env guard: supabaseUrl + supabaseServiceKey must be present → 500
 *   2. Auth: Bearer token in Authorization header required → 401
 *   3. Auth: token must resolve to a valid user via anonClient.auth.getUser → 401
 *   4. Role: user must exist in `doctors` table → 403
 *   5. Body validation: patient_id, name, exercise_type, video_url all required → 400
 *   6. Ownership: patient's doctor_id must equal the authenticated doctor → 404
 *   7. DB insert: exercise_assignments insert must succeed → 500 on failure
 *   8. Happy path → { ok: true, assignment: { id, name, ... } }
 *
 * Call order in route:
 *   createClient call 1 (serviceKey) → adminClient — used for all DB queries
 *   createClient call 2 (anonKey)    → authClient  — used only for .auth.getUser(token)
 */

// ---------------------------------------------------------------------------
// Output helpers
// ---------------------------------------------------------------------------

const HEAD = (s: string) =>
  process.stdout.write(`\n  ┌─ ${s} ${"─".repeat(Math.max(0, 50 - s.length))}┐\n`)

const out = (tag: string, desc: string, result: string, note = "") => {
  const t = `[${tag}]`.padEnd(10)
  const d = desc.padEnd(50)
  const n = note ? `  ← ${note}` : ""
  process.stdout.write(`  ${t}  ${d}  →  ${result}${n}\n`)
}

beforeAll(() => {
  process.stdout.write("\n")
  process.stdout.write("  ╔══════════════════════════════════════════════════════╗\n")
  process.stdout.write("  ║  api/doctor/assign-exercise  whitebox test suite     ║\n")
  process.stdout.write("  ╚══════════════════════════════════════════════════════╝\n")
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BASE_URL = "http://localhost/api/doctor/assign-exercise"

const VALID_BODY = {
  patient_id: "patient-uuid",
  name: "Knee Extension 3×10",
  exercise_type: "knee-extension",
  video_url: "https://storage.supabase.co/vid.webm",
  template: { states: [] },
}

function makeRequest(body: object, authToken?: string): Request {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`
  return new Request(BASE_URL, { method: "POST", headers, body: JSON.stringify(body) })
}

/**
 * Loads the route with mocked createClient.
 *   Call 1 → adminReturn  (service-role admin client)
 *   Call 2 → auth client that resolves getUser(token) → authUser / authError
 */
function loadRoute(
  adminReturn: object,
  authUser: { id: string } | null,
  authError: object | null = null
) {
  jest.resetModules()
  const mockCreateClient = jest.fn()
    .mockReturnValueOnce(adminReturn)
    .mockReturnValueOnce({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: authUser }, error: authError }),
      },
    })
  jest.doMock("@supabase/supabase-js", () => ({ createClient: mockCreateClient }))
  return require("@/app/api/doctor/assign-exercise/route").POST
}

/** Creates a chainable Supabase query builder that resolves the final .single() with `result`. */
function singleQuery(result: object) {
  const q: any = {
    select: jest.fn().mockReturnThis(),
    eq:     jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue(result),
  }
  return q
}

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

// ===========================================================================
// Env guard
// ===========================================================================

describe("environment variable guard", () => {

  beforeAll(() => { HEAD("Env guard") })

  it("returns 500 when SUPABASE_SERVICE_ROLE_KEY is missing", async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    const POST = loadRoute({ from: jest.fn() }, null)
    const res = await POST(makeRequest(VALID_BODY, "tok"))
    expect(res.status).toBe(500)
    out("ENV", "missing SUPABASE_SERVICE_ROLE_KEY", `status=${res.status}`, "→ 500")
  })
})

// ===========================================================================
// Authentication
// ===========================================================================

describe("authentication — Bearer token required", () => {

  beforeAll(() => { HEAD("Authentication") })

  it("returns 401 when Authorization header is absent", async () => {
    const POST = loadRoute({ from: jest.fn() }, { id: "dr-1" })
    const res = await POST(makeRequest(VALID_BODY))   // no token
    expect(res.status).toBe(401)
    out("AUTH", "no Authorization header", `status=${res.status}`, "→ 401")
  })

  it("returns 401 when token is invalid or Supabase cannot resolve the user", async () => {
    const POST = loadRoute({ from: jest.fn() }, null, { message: "jwt malformed" })
    const res = await POST(makeRequest(VALID_BODY, "bad-token"))
    expect(res.status).toBe(401)
    out("AUTH", "invalid token → getUser returns null user", `status=${res.status}`, "→ 401")
  })
})

// ===========================================================================
// Role check
// ===========================================================================

describe("role check — caller must be a doctor", () => {

  beforeAll(() => { HEAD("Role check") })

  it("returns 403 with 'Only doctors' when user is not in the doctors table", async () => {
    const adminClient = {
      from: jest.fn().mockReturnValue(singleQuery({ data: null, error: { message: "not found" } })),
    }
    const POST = loadRoute(adminClient, { id: "patient-user" })
    const res = await POST(makeRequest(VALID_BODY, "tok"))
    const body = await res.json()
    expect(res.status).toBe(403)
    expect(body.error).toMatch(/Only doctors/)
    out("ROLE", "user not in doctors table", `status=${res.status}  '${body.error}'`)
  })
})

// ===========================================================================
// Body validation
// ===========================================================================

describe("body validation — required fields", () => {

  beforeAll(() => { HEAD("Body validation") })

  function doctorAdminClient() {
    return { from: jest.fn().mockReturnValue(singleQuery({ data: { id: "dr-1" }, error: null })) }
  }

  it("returns 400 when patient_id is missing", async () => {
    const { patient_id: _, ...body } = VALID_BODY
    const POST = loadRoute(doctorAdminClient(), { id: "dr-1" })
    const res = await POST(makeRequest(body, "tok"))
    expect(res.status).toBe(400)
    out("VALID", "missing patient_id", `status=${res.status}`)
  })

  it("returns 400 when name is missing", async () => {
    const { name: _, ...body } = VALID_BODY
    const POST = loadRoute(doctorAdminClient(), { id: "dr-1" })
    const res = await POST(makeRequest(body, "tok"))
    expect(res.status).toBe(400)
    out("VALID", "missing name", `status=${res.status}`)
  })

  it("returns 400 when video_url is missing", async () => {
    const { video_url: _, ...body } = VALID_BODY
    const POST = loadRoute(doctorAdminClient(), { id: "dr-1" })
    const res = await POST(makeRequest(body, "tok"))
    expect(res.status).toBe(400)
    out("VALID", "missing video_url", `status=${res.status}`)
  })
})

// ===========================================================================
// Patient ownership check
// ===========================================================================

describe("patient ownership — patient must belong to this doctor", () => {

  beforeAll(() => { HEAD("Patient ownership") })

  it("returns 404 when patient is not linked to the authenticated doctor", async () => {
    let callCount = 0
    const adminClient = {
      from: jest.fn().mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          // doctors lookup → found
          return singleQuery({ data: { id: "dr-1" }, error: null })
        }
        // patients lookup → not linked to this doctor
        return singleQuery({ data: null, error: { message: "not linked" } })
      }),
    }
    const POST = loadRoute(adminClient, { id: "dr-1" })
    const res = await POST(makeRequest(VALID_BODY, "tok"))
    const body = await res.json()
    expect(res.status).toBe(404)
    expect(body.error).toMatch(/Patient not found/)
    out("OWN", "patient.doctor_id ≠ caller's id", `status=${res.status}  '${body.error}'`)
  })
})

// ===========================================================================
// DB insert failure
// ===========================================================================

describe("database error handling", () => {

  beforeAll(() => { HEAD("DB error handling") })

  it("returns 500 when the exercise_assignments insert fails", async () => {
    let callCount = 0
    const adminClient = {
      from: jest.fn().mockImplementation(() => {
        callCount++
        if (callCount === 1) return singleQuery({ data: { id: "dr-1" }, error: null })  // doctor
        if (callCount === 2) return singleQuery({ data: { id: "p-1" }, error: null })   // patient
        // Insert fail
        return {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: { message: "constraint violation" } }),
        }
      }),
    }
    const POST = loadRoute(adminClient, { id: "dr-1" })
    const res = await POST(makeRequest(VALID_BODY, "tok"))
    expect(res.status).toBe(500)
    out("DB", "exercise_assignments insert fails", `status=${res.status}`, "→ 500")
  })
})

// ===========================================================================
// Happy path
// ===========================================================================

describe("happy path — full valid request returns assignment", () => {

  beforeAll(() => { HEAD("Happy path") })

  it("returns 200 { ok: true, assignment } when all steps succeed", async () => {
    const newAssignment = { id: "assign-uuid", name: VALID_BODY.name, exercise_type: "knee-extension", created_at: "2026-04-13T00:00:00Z" }
    let callCount = 0
    const adminClient = {
      from: jest.fn().mockImplementation(() => {
        callCount++
        if (callCount === 1) return singleQuery({ data: { id: "dr-1" }, error: null })
        if (callCount === 2) return singleQuery({ data: { id: "p-1" }, error: null })
        return {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: newAssignment, error: null }),
        }
      }),
    }
    const POST = loadRoute(adminClient, { id: "dr-1" })
    const res = await POST(makeRequest(VALID_BODY, "tok"))
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.assignment.id).toBe("assign-uuid")
    out("OK", "all steps pass", `status=${res.status}  assignment.id='${body.assignment.id}' ✓`)
  })

  it("optional template field can be omitted (defaults to null in insert)", async () => {
    const { template: _, ...bodyNoTemplate } = VALID_BODY
    let callCount = 0
    const adminClient = {
      from: jest.fn().mockImplementation(() => {
        callCount++
        if (callCount === 1) return singleQuery({ data: { id: "dr-1" }, error: null })
        if (callCount === 2) return singleQuery({ data: { id: "p-1" }, error: null })
        return {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { id: "a-uuid" }, error: null }),
        }
      }),
    }
    const POST = loadRoute(adminClient, { id: "dr-1" })
    const res = await POST(makeRequest(bodyNoTemplate, "tok"))
    expect(res.status).toBe(200)
    out("OK", "no template in body → defaults to null", `status=${res.status} ✓`)
  })
})

// ===========================================================================
// Unexpected errors (catch-all)
// ===========================================================================

describe("unexpected error handling", () => {

  beforeAll(() => { HEAD("Catch-all error handler") })

  it("returns 500 when createClient throws during construction", async () => {
    jest.resetModules()
    jest.doMock("@supabase/supabase-js", () => ({
      createClient: jest.fn().mockImplementation(() => {
        throw new Error("network failure")
      }),
    }))
    const POST = require("@/app/api/doctor/assign-exercise/route").POST
    const res = await POST(makeRequest(VALID_BODY, "tok"))
    expect(res.status).toBe(500)
    out("ERROR", "createClient() throws", `status=${res.status}`, "catch-all returns 500")
  })
})
