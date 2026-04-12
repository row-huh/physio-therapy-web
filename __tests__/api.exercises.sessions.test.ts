/**
 * @jest-environment node
 */
/**
 * Tests for app/api/exercises/sessions/route.ts — POST handler
 *
 * Call order in route:
 *   1st createClient() → admin client (serviceKey)
 *   2nd createClient() → auth client (anonKey) → .auth.getUser(token)
 *
 * Covers:
 *   - Missing Supabase env vars → 500
 *   - Missing Authorization header → 401
 *   - Invalid token → 401
 *   - Missing assignment_id or similarity_score → 400
 *   - DB insert failure → 500
 *   - Successful session save → 200 { ok: true, session }
 *   - similarity_score is rounded before insert
 *   - reps_completed defaults to 0 when omitted
 *   - Unexpected thrown error → 500
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

function loadRoute(mockCreateClient: jest.Mock) {
  jest.resetModules()
  jest.doMock("@supabase/supabase-js", () => ({ createClient: mockCreateClient }))
  return require("@/app/api/exercises/sessions/route").POST
}

/** Build a mock where admin is call-1 and auth is call-2 */
function makeMock(
  adminReturn: object,
  authUser: { id: string } | null,
  authError: object | null = null
): jest.Mock {
  return jest.fn()
    .mockReturnValueOnce(adminReturn) // call 1: admin
    .mockReturnValueOnce({            // call 2: auth
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

describe("POST /api/exercises/sessions", () => {
  it("returns 500 when SUPABASE_SERVICE_ROLE_KEY is missing", async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    const POST = loadRoute(jest.fn())
    const res = await POST(makeRequest({ assignment_id: "a1", similarity_score: 80 }, "token"))
    expect(res.status).toBe(500)
  })

  it("returns 401 when Authorization header is absent", async () => {
    // Admin client is created; then 401 short-circuits before auth client
    const POST = loadRoute(jest.fn().mockReturnValue({ from: jest.fn() }))
    const res = await POST(makeRequest({ assignment_id: "a1", similarity_score: 80 }))
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toMatch(/Not authenticated/)
  })

  it("returns 401 when token is invalid", async () => {
    const mockCreate = makeMock(
      { from: jest.fn() }, // admin (unused this path)
      null,
      { message: "bad token" }
    )
    const POST = loadRoute(mockCreate)
    const res = await POST(makeRequest({ assignment_id: "a1", similarity_score: 80 }, "bad-token"))
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toMatch(/Invalid session/)
  })

  it("returns 400 when assignment_id is missing", async () => {
    const mockCreate = makeMock({ from: jest.fn() }, { id: "p1" })
    const POST = loadRoute(mockCreate)
    const res = await POST(makeRequest({ similarity_score: 80 }, "token"))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/assignment_id/)
  })

  it("returns 400 when similarity_score is missing", async () => {
    const mockCreate = makeMock({ from: jest.fn() }, { id: "p1" })
    const POST = loadRoute(mockCreate)
    const res = await POST(makeRequest({ assignment_id: "a1" }, "token"))
    expect(res.status).toBe(400)
  })

  it("returns 500 when DB insert fails", async () => {
    const adminClient = {
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { message: "constraint" } }),
      }),
    }
    const mockCreate = makeMock(adminClient, { id: "p1" })
    const POST = loadRoute(mockCreate)
    const res = await POST(makeRequest({ assignment_id: "a1", similarity_score: 80 }, "token"))
    expect(res.status).toBe(500)
  })

  it("returns 200 with ok:true and session data", async () => {
    const adminClient = {
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: "session-uuid", completed_at: "2026-04-12T00:00:00Z" },
          error: null,
        }),
      }),
    }
    const mockCreate = makeMock(adminClient, { id: "p1" })
    const POST = loadRoute(mockCreate)
    const res = await POST(makeRequest({
      assignment_id: "assignment-1",
      similarity_score: 87,
      reps_completed: 5,
      reps_expected: 5,
    }, "good-token"))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.session.id).toBe("session-uuid")
  })

  it("rounds similarity_score before inserting", async () => {
    let capturedArg: any = null
    const adminClient = {
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockImplementation((arg: any) => {
          capturedArg = arg
          return {
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: { id: "s1", completed_at: "" }, error: null }),
          }
        }),
      }),
    }
    const mockCreate = makeMock(adminClient, { id: "p1" })
    const POST = loadRoute(mockCreate)
    await POST(makeRequest({ assignment_id: "a1", similarity_score: 87.6 }, "token"))
    expect(capturedArg?.similarity_score).toBe(88)
  })

  it("defaults reps_completed to 0 when omitted", async () => {
    let capturedArg: any = null
    const adminClient = {
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockImplementation((arg: any) => {
          capturedArg = arg
          return {
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: { id: "s1", completed_at: "" }, error: null }),
          }
        }),
      }),
    }
    const mockCreate = makeMock(adminClient, { id: "p1" })
    const POST = loadRoute(mockCreate)
    await POST(makeRequest({ assignment_id: "a1", similarity_score: 80 }, "token"))
    expect(capturedArg?.reps_completed).toBe(0)
  })

  it("returns 500 on unexpected thrown error", async () => {
    const mockCreate = jest.fn().mockImplementation(() => { throw new Error("crashed") })
    const POST = loadRoute(mockCreate)
    const res = await POST(makeRequest({ assignment_id: "a1", similarity_score: 80 }, "token"))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toMatch(/Unexpected error/)
  })
})
