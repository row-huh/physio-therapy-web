/**
 * @jest-environment node
 */
/**
 * Tests for app/api/exercises/signed-url/route.ts — GET handler
 *
 * Call order in route:
 *   1st createClient() → admin client (serviceKey)
 *   2nd createClient() → auth client (anonKey) → .auth.getUser(token)
 *   All subsequent DB/storage calls go through admin client (call 1).
 *
 * Covers:
 *   - Missing env vars → 500
 *   - Missing Authorization header → 401
 *   - Invalid token → 401
 *   - Missing assignment id query param → 400
 *   - Assignment not found → 404
 *   - Assignment belongs to different patient → 403
 *   - Signed URL generation failure → 500
 *   - Successful response → 200 { signedUrl }
 *   - Unexpected thrown error → 500
 */

function makeRequest(url: string, authToken?: string): Request {
  const headers: Record<string, string> = {}
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`
  return new Request(url, { method: "GET", headers })
}

const BASE = "http://localhost/api/exercises/signed-url"

function loadRoute(mockCreateClient: jest.Mock) {
  jest.resetModules()
  jest.doMock("@supabase/supabase-js", () => ({ createClient: mockCreateClient }))
  return require("@/app/api/exercises/signed-url/route").GET
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

describe("GET /api/exercises/signed-url", () => {
  it("returns 500 when env vars are missing", async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    const GET = loadRoute(jest.fn())
    const res = await GET(makeRequest(`${BASE}?id=a1`, "token"))
    expect(res.status).toBe(500)
  })

  it("returns 401 when Authorization header is absent", async () => {
    const GET = loadRoute(jest.fn().mockReturnValue({ from: jest.fn(), storage: {} }))
    const res = await GET(makeRequest(`${BASE}?id=a1`))
    expect(res.status).toBe(401)
  })

  it("returns 401 when token is invalid", async () => {
    const GET = loadRoute(makeMock({ from: jest.fn(), storage: {} }, null, { message: "bad" }))
    const res = await GET(makeRequest(`${BASE}?id=a1`, "bad-token"))
    expect(res.status).toBe(401)
  })

  it("returns 400 when assignment id is missing", async () => {
    const GET = loadRoute(makeMock({ from: jest.fn(), storage: {} }, { id: "p1" }))
    const res = await GET(makeRequest(BASE, "good-token"))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/Missing assignment id/)
  })

  it("returns 404 when assignment is not found", async () => {
    const adminClient = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { message: "not found" } }),
      }),
      storage: {},
    }
    const GET = loadRoute(makeMock(adminClient, { id: "p1" }))
    const res = await GET(makeRequest(`${BASE}?id=unknown`, "good-token"))
    expect(res.status).toBe(404)
  })

  it("returns 403 when assignment belongs to a different patient", async () => {
    const adminClient = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { video_path: "knee-extension/video.webm", patient_id: "patient-OTHER" },
          error: null,
        }),
      }),
      storage: {},
    }
    const GET = loadRoute(makeMock(adminClient, { id: "patient-1" }))
    const res = await GET(makeRequest(`${BASE}?id=a1`, "good-token"))
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toMatch(/Not authorized/)
  })

  it("returns 500 when signed URL creation fails", async () => {
    const adminClient = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { video_path: "knee-extension/vid.webm", patient_id: "p1" },
          error: null,
        }),
      }),
      storage: {
        from: jest.fn().mockReturnValue({
          createSignedUrl: jest.fn().mockResolvedValue({ data: null, error: { message: "storage error" } }),
        }),
      },
    }
    const GET = loadRoute(makeMock(adminClient, { id: "p1" }))
    const res = await GET(makeRequest(`${BASE}?id=a1`, "good-token"))
    expect(res.status).toBe(500)
  })

  it("returns 200 with signedUrl on success", async () => {
    const adminClient = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { video_path: "knee-extension/vid.webm", patient_id: "p1" },
          error: null,
        }),
      }),
      storage: {
        from: jest.fn().mockReturnValue({
          createSignedUrl: jest.fn().mockResolvedValue({
            data: { signedUrl: "https://signed.url/video.webm" },
            error: null,
          }),
        }),
      },
    }
    const GET = loadRoute(makeMock(adminClient, { id: "p1" }))
    const res = await GET(makeRequest(`${BASE}?id=a1`, "good-token"))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.signedUrl).toBe("https://signed.url/video.webm")
  })

  it("returns 500 on unexpected thrown error", async () => {
    const mockCreate = jest.fn().mockImplementation(() => { throw new Error("crashed") })
    const GET = loadRoute(mockCreate)
    const res = await GET(makeRequest(`${BASE}?id=a1`, "token"))
    expect(res.status).toBe(500)
  })
})
