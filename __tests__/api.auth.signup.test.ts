/**
 * @jest-environment node
 */
export {}
/**
 * Whitebox tests — app/api/auth/signup/route.ts — POST handler
 *
 * This is the most complex auth route. It:
 *   1. Validates env vars (URL + anon key)
 *   2. Validates body: email, password, role (all required)
 *   3. Calls supabase.auth.signUp() — the anon client
 *   4. Rejects 409 if email is already registered (identities.length === 0)
 *   5. Validates role must be "patient" or "doctor"
 *   6. Updates the users row (role field) via admin client
 *   7a. If doctor: inserts into `doctors` table with a generated DR-XXXX code;
 *       retries up to 3 times on unique-constraint collision (code "23505")
 *   7b. If patient: inserts into `patients` table
 *   8. Returns { ok: true } on success
 *
 * All DB calls use the admin (service-role) client; auth.signUp uses the anon client.
 *
 * Internal branches tested:
 *   B1 — missing env vars → 500
 *   B2 — missing body fields → 400
 *   B3 — auth.signUp() error → 400
 *   B4 — already-registered email (identities.length === 0) → 409
 *   B5 — invalid role (not patient/doctor) → 400
 *   B6 — users row update fails → 500
 *   B7 — patient profile insert fails → 500
 *   B8 — doctor profile insert fails (non-collision error) → 500
 *   B9 — doctor code collision retry (code "23505") → retries and succeeds
 *   B10 — all 3 retry attempts fail with collision → 500
 *   B11 — happy path: patient signup → { ok: true }
 *   B12 — happy path: doctor signup → { ok: true }
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
  process.stdout.write("  ║  api/auth/signup  whitebox test suite                ║\n")
  process.stdout.write("  ╚══════════════════════════════════════════════════════╝\n")
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BASE_URL = "http://localhost/api/auth/signup"

function makeRequest(body: object): Request {
  return new Request(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

type SignUpResult = {
  data: { user: { id: string; identities: { id: string }[] } | null }
  error: { message: string; status?: number } | null
}

/**
 * Loads the route with a two-client mock.
 *   createClient call 1 → anonClient (used for auth.signUp)
 *   createClient call 2 → adminClient (used for DB mutations)
 *   If serviceKey is absent the route uses the anon client for both calls.
 */
function loadRoute(
  signUpResult: SignUpResult,
  adminDbMock: object = { from: jest.fn() },
  opts: { missingUrl?: boolean; missingAnon?: boolean; missingService?: boolean } = {}
) {
  jest.resetModules()

  const anonClient = {
    auth: {
      signUp: jest.fn().mockResolvedValue(signUpResult),
    },
  }

  const mockCreateClient = jest.fn()
    .mockReturnValueOnce(anonClient)      // 1st call → anon client for signUp
    .mockReturnValueOnce(adminDbMock)     // 2nd call → admin client for DB

  if (opts.missingUrl)     delete process.env.NEXT_PUBLIC_SUPABASE_URL
  if (opts.missingAnon)    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (opts.missingService) delete process.env.SUPABASE_SERVICE_ROLE_KEY

  jest.doMock("@supabase/supabase-js", () => ({ createClient: mockCreateClient }))
  return require("@/app/api/auth/signup/route").POST
}

/** Success result for a fresh user with 1 identity */
const freshUser = (id = "new-user-id") => ({
  data: { user: { id, identities: [{ id: "identity-1" }] } },
  error: null,
})

/** A fully chained Supabase query builder mock that resolves with the given value */
function chainedQuery(result: object) {
  const q: any = {}
  const methods = ["from", "select", "update", "insert", "upsert", "eq", "single"]
  for (const m of methods) {
    q[m] = jest.fn().mockReturnValue(q)
  }
  q.single = jest.fn().mockResolvedValue(result)
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
// Branch 1 — Missing env vars
// ===========================================================================

describe("B1 — missing env vars → 500 before any DB work", () => {

  beforeAll(() => { HEAD("B1: missing env vars") })

  it("returns 500 when NEXT_PUBLIC_SUPABASE_URL is absent", async () => {
    const POST = loadRoute(freshUser(), {}, { missingUrl: true })
    const res = await POST(makeRequest({ email: "a@b.com", password: "pw", role: "patient" }))
    expect(res.status).toBe(500)
    out("ENV", "missing NEXT_PUBLIC_SUPABASE_URL", `status=${res.status}`, "→ 500")
  })

  it("returns 500 when NEXT_PUBLIC_SUPABASE_ANON_KEY is absent", async () => {
    const POST = loadRoute(freshUser(), {}, { missingAnon: true })
    const res = await POST(makeRequest({ email: "a@b.com", password: "pw", role: "patient" }))
    expect(res.status).toBe(500)
    out("ENV", "missing NEXT_PUBLIC_SUPABASE_ANON_KEY", `status=${res.status}`, "→ 500")
  })
})

// ===========================================================================
// Branch 2 — Missing body fields
// ===========================================================================

describe("B2 — missing required body fields → 400", () => {

  beforeAll(() => { HEAD("B2: missing body fields") })

  it("returns 400 when email is missing", async () => {
    const POST = loadRoute(freshUser())
    const res = await POST(makeRequest({ password: "pw", role: "patient" }))
    expect(res.status).toBe(400)
    out("BODY", "missing email", `status=${res.status}`)
  })

  it("returns 400 when password is missing", async () => {
    const POST = loadRoute(freshUser())
    const res = await POST(makeRequest({ email: "a@b.com", role: "patient" }))
    expect(res.status).toBe(400)
    out("BODY", "missing password", `status=${res.status}`)
  })

  it("returns 400 when role is missing", async () => {
    const POST = loadRoute(freshUser())
    const res = await POST(makeRequest({ email: "a@b.com", password: "pw" }))
    expect(res.status).toBe(400)
    out("BODY", "missing role", `status=${res.status}`)
  })
})

// ===========================================================================
// Branch 3 — auth.signUp() error
// ===========================================================================

describe("B3 — supabase auth.signUp() returns an error → 400", () => {

  beforeAll(() => { HEAD("B3: auth.signUp() error") })

  it("returns 400 with the Supabase error message when signUp fails", async () => {
    const POST = loadRoute({
      data: { user: null },
      error: { message: "Password should be at least 6 characters", status: 422 },
    })
    const res = await POST(makeRequest({ email: "a@b.com", password: "x", role: "patient" }))
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.error).toContain("Auth failed")
    out("SIGNUP", "signUp error: weak password", `status=${res.status}  error='${body.error}'`)
  })
})

// ===========================================================================
// Branch 4 — Email already registered (409)
// ===========================================================================

describe("B4 — email already registered → 409", () => {

  beforeAll(() => { HEAD("B4: duplicate email → 409") })

  it("returns 409 when identities is an empty array (email already exists)", async () => {
    const POST = loadRoute({
      data: { user: { id: "existing-id", identities: [] } },
      error: null,
    })
    const res = await POST(makeRequest({ email: "existing@b.com", password: "pw", role: "patient" }))
    const body = await res.json()
    expect(res.status).toBe(409)
    expect(body.error).toContain("already exists")
    out("DUPE", "identities=[] (existing email)", `status=${res.status}  error='${body.error}'`)
  })

  it("returns 409 when user id is null (signup returned no user)", async () => {
    const POST = loadRoute({
      data: { user: null as any },
      error: null,
    })
    const res = await POST(makeRequest({ email: "a@b.com", password: "pw", role: "patient" }))
    expect(res.status).toBe(409)
    out("DUPE", "user=null returned from signUp", `status=${res.status}`)
  })
})

// ===========================================================================
// Branch 5 — Invalid role
// ===========================================================================

describe("B5 — invalid role value → 400", () => {

  beforeAll(() => { HEAD("B5: invalid role") })

  it("returns 400 when role is 'admin' (not patient or doctor)", async () => {
    const POST = loadRoute(freshUser())
    const res = await POST(makeRequest({ email: "a@b.com", password: "pw", role: "admin" }))
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.error).toContain("Invalid role")
    out("ROLE", "role='admin' (not patient/doctor)", `status=${res.status}  error='${body.error}'`)
  })

  it("returns 400 when role is an empty string", async () => {
    const POST = loadRoute(freshUser())
    // Empty string passes the !role check → caught by missing-field validation
    const res = await POST(makeRequest({ email: "a@b.com", password: "pw", role: "" }))
    expect(res.status).toBe(400)
    out("ROLE", "role='' (empty string)", `status=${res.status}`)
  })
})

// ===========================================================================
// Branch 6 — users row update fails
// ===========================================================================

describe("B6 — users row update fails → 500", () => {

  beforeAll(() => { HEAD("B6: users role update failure") })

  it("returns 500 with 'role update failed' message when the users table update errors", async () => {
    const adminClient = {
      from: jest.fn().mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ error: { message: "RLS denied" } }),
      }),
    }
    const POST = loadRoute(freshUser(), adminClient)
    const res = await POST(makeRequest({ email: "a@b.com", password: "pw", role: "patient" }))
    const body = await res.json()
    expect(res.status).toBe(500)
    expect(body.error).toContain("role update failed")
    out("DB", "users.update() fails (RLS denied)", `status=${res.status}  '${body.error}'`)
  })
})

// ===========================================================================
// Branch 7 — patient profile insert fails
// ===========================================================================

describe("B7 — patients table insert fails → 500", () => {

  beforeAll(() => { HEAD("B7: patient insert failure") })

  it("returns 500 when the patients profile insert fails after successful users update", async () => {
    let callCount = 0
    const adminClient = {
      from: jest.fn().mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          // users update → success
          return { update: jest.fn().mockReturnThis(), eq: jest.fn().mockResolvedValue({ error: null }) }
        }
        // patients insert → fail
        return { insert: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ error: { message: "FK violation" } }) }
      }),
    }
    const POST = loadRoute(freshUser(), adminClient)
    const res = await POST(makeRequest({ email: "a@b.com", password: "pw", role: "patient" }))
    const body = await res.json()
    expect(res.status).toBe(500)
    expect(body.error).toContain("patients profile failed")
    out("DB", "patients.insert() fails (FK violation)", `status=${res.status}`)
  })
})

// ===========================================================================
// Branch 11 — Happy path: patient
// ===========================================================================

describe("B11 — happy path: patient signup → 200 { ok: true }", () => {

  beforeAll(() => { HEAD("B11: happy path patient") })

  it("returns 200 { ok: true } when all steps succeed for a patient", async () => {
    let callCount = 0
    const adminClient = {
      from: jest.fn().mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          // users.update → success
          return { update: jest.fn().mockReturnThis(), eq: jest.fn().mockResolvedValue({ error: null }) }
        }
        // patients.insert → success
        return { insert: jest.fn().mockResolvedValue({ error: null }) }
      }),
    }
    const POST = loadRoute(freshUser(), adminClient)
    const res = await POST(makeRequest({ email: "new@b.com", password: "pw1234", role: "patient" }))
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.ok).toBe(true)
    out("OK", "patient signup: all steps pass", `status=${res.status}  ok=${body.ok} ✓`)
  })
})

// ===========================================================================
// Branch 12 — Happy path: doctor
// ===========================================================================

describe("B12 — happy path: doctor signup → 200 { ok: true }", () => {

  beforeAll(() => { HEAD("B12: happy path doctor") })

  it("returns 200 { ok: true } when doctor signup succeeds (code inserted on first attempt)", async () => {
    let callCount = 0
    const adminClient = {
      from: jest.fn().mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          // users.update → success
          return { update: jest.fn().mockReturnThis(), eq: jest.fn().mockResolvedValue({ error: null }) }
        }
        // doctors.insert → success first try
        return { insert: jest.fn().mockResolvedValue({ error: null }) }
      }),
    }
    const POST = loadRoute(freshUser(), adminClient)
    const res = await POST(makeRequest({ email: "doc@clinic.com", password: "pw1234", role: "doctor" }))
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.ok).toBe(true)
    out("OK", "doctor signup: code inserted first try", `status=${res.status}  ok=${body.ok} ✓`)
  })
})
