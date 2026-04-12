/**
 * @jest-environment node
 */
/**
 * Tests for app/api/exercises/assign/route.ts — POST handler
 *
 * Call order in route:
 *   1st createClient() → admin client (serviceKey)
 *   2nd createClient() → auth client (anonKey) → .auth.getUser(token)
 *   All subsequent DB calls use the admin client from call 1.
 *
 * Covers:
 *   - Missing env vars → 500
 *   - Missing Authorization header → 401
 *   - Invalid token → 401
 *   - Missing required body fields → 400
 *   - Caller is not a doctor → 403
 *   - Patient not linked to this doctor → 403
 *   - DB insert failure → 500
 *   - Successful assignment → 200 { id }
 *   - Unexpected error → 500
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

const VALID_BODY = {
  patient_id: "patient-uuid",
  name: "Knee Extension 3x10",
  exercise_type: "knee-extension",
  video_path: "knee-extension/vid.webm",
  video_url: "https://storage.supabase.co/vid.webm",
  template: { states: [] },
}

function loadRoute(mockCreateClient: jest.Mock) {
  jest.resetModules()
  jest.doMock("@supabase/supabase-js", () => ({ createClient: mockCreateClient }))
  return require("@/app/api/exercises/assign/route").POST
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

describe("POST /api/exercises/assign", () => {
  it("returns 500 when env vars are missing", async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    const POST = loadRoute(jest.fn())
    const res = await POST(makeRequest(VALID_BODY, "token"))
    expect(res.status).toBe(500)
  })

  it("returns 401 when Authorization header is absent", async () => {
    const POST = loadRoute(jest.fn().mockReturnValue({ from: jest.fn() }))
    const res = await POST(makeRequest(VALID_BODY))
    expect(res.status).toBe(401)
  })

  it("returns 401 when token is invalid", async () => {
    const POST = loadRoute(makeMock({ from: jest.fn() }, null, { message: "bad" }))
    const res = await POST(makeRequest(VALID_BODY, "bad-token"))
    expect(res.status).toBe(401)
  })

  it("returns 400 when required fields are missing", async () => {
    const POST = loadRoute(makeMock({ from: jest.fn() }, { id: "dr-1" }))
    const res = await POST(makeRequest({ patient_id: "p1" }, "token"))
    expect(res.status).toBe(400)
  })

  it("returns 403 when caller is not a doctor", async () => {
    // Body is valid → passes 400 check → admin.from() called for doctors lookup
    let callCount = 0
    const adminClient = {
      from: jest.fn().mockImplementation(() => {
        callCount++
        // call 1: doctors lookup → not found
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: { message: "not found" } }),
        }
      }),
    }
    const POST = loadRoute(makeMock(adminClient, { id: "not-a-doc" }))
    const res = await POST(makeRequest(VALID_BODY, "token"))
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toMatch(/Only doctors/)
  })

  it("returns 403 when patient is not linked to this doctor", async () => {
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
        // patients lookup → not found / not linked
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: { message: "not found" } }),
        }
      }),
    }
    const POST = loadRoute(makeMock(adminClient, { id: "dr-1" }))
    const res = await POST(makeRequest(VALID_BODY, "token"))
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toMatch(/Patient not found/)
  })

  it("returns 500 when exercise_assignments insert fails", async () => {
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
        return {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: { message: "constraint" } }),
        }
      }),
    }
    const POST = loadRoute(makeMock(adminClient, { id: "dr-1" }))
    const res = await POST(makeRequest(VALID_BODY, "token"))
    expect(res.status).toBe(500)
  })

  it("returns 200 with assignment id on successful assign", async () => {
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
        return {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { id: "assignment-uuid" }, error: null }),
        }
      }),
    }
    const POST = loadRoute(makeMock(adminClient, { id: "dr-1" }))
    const res = await POST(makeRequest(VALID_BODY, "token"))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.id).toBe("assignment-uuid")
  })

  it("returns 500 on unexpected thrown error", async () => {
    const mockCreate = jest.fn().mockImplementation(() => { throw new Error("network failure") })
    const POST = loadRoute(mockCreate)
    const res = await POST(makeRequest(VALID_BODY, "token"))
    expect(res.status).toBe(500)
  })
})
