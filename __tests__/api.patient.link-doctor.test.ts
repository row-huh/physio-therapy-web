/**
 * @jest-environment node
 */
/**
 * Tests for app/api/patient/link-doctor/route.ts — POST handler
 *
 * Call order in route:
 *   1st createClient() → admin client (serviceKey)
 *   2nd createClient() → auth client (anonKey) → .auth.getUser(token)
 *   All subsequent DB calls use the admin client from call 1:
 *     - doctors lookup
 *     - users lookup (doctor name)
 *     - patients update
 *
 * Covers:
 *   - Missing env vars → 500
 *   - Missing Authorization header → 401
 *   - Invalid token → 401
 *   - Missing or non-string doctor_code → 400
 *   - Doctor not found for code → 404
 *   - patients.update failure → 500
 *   - Successful link (with doctor name) → 200 { ok, doctor_name }
 *   - Successful link (no doctor user row) → 200 with fallback "Your Doctor"
 *   - doctor_code is trimmed and uppercased before lookup
 *   - Unexpected error → 500
 */

function makeRequest(body: object, authToken?: string): Request {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`
  return new Request("http://localhost/api/patient/link-doctor", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
}

function loadRoute(mockCreateClient: jest.Mock) {
  jest.resetModules()
  jest.doMock("@supabase/supabase-js", () => ({ createClient: mockCreateClient }))
  return require("@/app/api/patient/link-doctor/route").POST
}

/**
 * Build a mock where:
 *   call 1 → adminReturn (admin client)
 *   call 2 → auth client wrapping authUser/authError
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

describe("POST /api/patient/link-doctor", () => {
  it("returns 500 when env vars are missing", async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    const POST = loadRoute(jest.fn())
    const res = await POST(makeRequest({ doctor_code: "DR-ABCD" }, "token"))
    expect(res.status).toBe(500)
  })

  it("returns 401 when Authorization header is absent", async () => {
    const POST = loadRoute(jest.fn().mockReturnValue({ from: jest.fn() }))
    const res = await POST(makeRequest({ doctor_code: "DR-ABCD" }))
    expect(res.status).toBe(401)
  })

  it("returns 401 when token is invalid", async () => {
    const POST = loadRoute(makeMock({ from: jest.fn() }, null, { message: "bad" }))
    const res = await POST(makeRequest({ doctor_code: "DR-ABCD" }, "bad"))
    expect(res.status).toBe(401)
  })

  it("returns 400 when doctor_code is missing", async () => {
    const POST = loadRoute(makeMock({ from: jest.fn() }, { id: "p1" }))
    const res = await POST(makeRequest({}, "token"))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/Doctor code is required/)
  })

  it("returns 400 when doctor_code is not a string", async () => {
    const POST = loadRoute(makeMock({ from: jest.fn() }, { id: "p1" }))
    const res = await POST(makeRequest({ doctor_code: 1234 }, "token"))
    expect(res.status).toBe(400)
  })

  it("returns 404 when doctor code is not found", async () => {
    const adminClient = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { message: "no rows" } }),
      }),
    }
    const POST = loadRoute(makeMock(adminClient, { id: "p1" }))
    const res = await POST(makeRequest({ doctor_code: "DR-ZZZZ" }, "token"))
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toMatch(/Invalid doctor code/)
  })

  it("returns 500 when patients.update fails", async () => {
    let callCount = 0
    const adminClient = {
      from: jest.fn().mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          // doctors lookup → found
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: { id: "dr-1" }, error: null }),
          }
        }
        if (callCount === 2) {
          // users lookup → found
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: { first_name: "Alice", last_name: "Smith" }, error: null }),
          }
        }
        // patients.update → fails
        return {
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ error: { message: "constraint" } }),
        }
      }),
    }
    const POST = loadRoute(makeMock(adminClient, { id: "p1" }))
    const res = await POST(makeRequest({ doctor_code: "DR-ABCD" }, "token"))
    expect(res.status).toBe(500)
  })

  it("returns 200 with doctor name on successful link", async () => {
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
            single: jest.fn().mockResolvedValue({ data: { first_name: "Alice", last_name: "Smith" }, error: null }),
          }
        }
        return {
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ error: null }),
        }
      }),
    }
    const POST = loadRoute(makeMock(adminClient, { id: "p1" }))
    const res = await POST(makeRequest({ doctor_code: "DR-ABCD" }, "token"))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.doctor_name).toBe("Alice Smith")
  })

  it("returns 'Your Doctor' when users row is not found", async () => {
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
            single: jest.fn().mockResolvedValue({ data: null, error: null }),
          }
        }
        return {
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ error: null }),
        }
      }),
    }
    const POST = loadRoute(makeMock(adminClient, { id: "p1" }))
    const res = await POST(makeRequest({ doctor_code: "DR-ABCD" }, "token"))
    const body = await res.json()
    expect(body.doctor_name).toBe("Your Doctor")
  })

  it("trims and uppercases the doctor code before lookup", async () => {
    let capturedEqValue: string | null = null
    const adminClient = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockImplementation((_col: string, val: string) => {
          if (_col === "doctor_code") capturedEqValue = val
          return {
            single: jest.fn().mockResolvedValue({ data: null, error: { message: "not found" } }),
          }
        }),
        single: jest.fn().mockResolvedValue({ data: null, error: { message: "nope" } }),
      }),
    }
    const POST = loadRoute(makeMock(adminClient, { id: "p1" }))
    await POST(makeRequest({ doctor_code: "  dr-abcd  " }, "token"))
    expect(capturedEqValue).toBe("DR-ABCD")
  })

  it("returns 500 on unexpected thrown error", async () => {
    const mockCreate = jest.fn().mockImplementation(() => { throw new Error("crashed") })
    const POST = loadRoute(mockCreate)
    const res = await POST(makeRequest({ doctor_code: "DR-ABCD" }, "token"))
    expect(res.status).toBe(500)
  })
})
