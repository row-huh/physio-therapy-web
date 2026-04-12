/**
 * @jest-environment node
 */
/**
 * Tests for app/api/ideal-templates/store/route.ts — POST handler
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
 *   - Caller is not a doctor → 403
 *   - Missing exercise_type or template body fields → 400
 *   - DB upsert failure → 500
 *   - Successful store → 200 { success: true, exercise_type }
 *   - Unexpected thrown error → 500
 */

function makeRequest(body: object, authToken?: string): Request {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`
  return new Request("http://localhost/api/ideal-templates/store", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
}

const VALID_BODY = {
  exercise_type: "knee-extension",
  template: { states: [], exerciseType: "knee-extension" },
}

function loadRoute(mockCreateClient: jest.Mock) {
  jest.resetModules()
  jest.doMock("@supabase/supabase-js", () => ({ createClient: mockCreateClient }))
  return require("@/app/api/ideal-templates/store/route").POST
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

describe("POST /api/ideal-templates/store", () => {
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
    const res = await POST(makeRequest(VALID_BODY, "bad"))
    expect(res.status).toBe(401)
  })

  it("returns 403 when caller is not a doctor", async () => {
    const adminClient = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { message: "not found" } }),
      }),
    }
    const POST = loadRoute(makeMock(adminClient, { id: "u1" }))
    const res = await POST(makeRequest(VALID_BODY, "token"))
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toMatch(/Only doctors/)
  })

  it("returns 400 when exercise_type is missing", async () => {
    // Doctor check passes, then body validation fails
    let callCount = 0
    const adminClient = {
      from: jest.fn().mockImplementation(() => {
        callCount++
        // doctors check → success
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { id: "dr-1" }, error: null }),
        }
      }),
    }
    const POST = loadRoute(makeMock(adminClient, { id: "dr-1" }))
    const res = await POST(makeRequest({ template: { states: [] } }, "token"))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/Missing/)
  })

  it("returns 400 when template is missing", async () => {
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
    const res = await POST(makeRequest({ exercise_type: "knee-extension" }, "token"))
    expect(res.status).toBe(400)
  })

  it("returns 500 when DB upsert fails", async () => {
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
        return {
          upsert: jest.fn().mockResolvedValue({ error: { message: "constraint violation" } }),
        }
      }),
    }
    const POST = loadRoute(makeMock(adminClient, { id: "dr-1" }))
    const res = await POST(makeRequest(VALID_BODY, "token"))
    expect(res.status).toBe(500)
  })

  it("returns 200 with success:true on successful store", async () => {
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
        return {
          upsert: jest.fn().mockResolvedValue({ error: null }),
        }
      }),
    }
    const POST = loadRoute(makeMock(adminClient, { id: "dr-1" }))
    const res = await POST(makeRequest(VALID_BODY, "token"))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.exercise_type).toBe("knee-extension")
  })

  it("returns 500 on unexpected thrown error", async () => {
    const mockCreate = jest.fn().mockImplementation(() => { throw new Error("unexpected") })
    const POST = loadRoute(mockCreate)
    const res = await POST(makeRequest(VALID_BODY, "token"))
    expect(res.status).toBe(500)
  })
})
