/**
 * @jest-environment node
 */
export {}
/**
 * Whitebox tests — app/api/auth/logout/route.ts — POST handler
 *
 * The logout route is intentionally minimal:
 *   1. Creates a server-side Supabase client (cookie-based session)
 *   2. Calls supabase.auth.signOut()
 *   3. Redirects to /login via NextResponse.redirect
 *
 * There are no request body parameters; the session identity is inferred
 * from the cookie. The route is tested by mocking the server client factory
 * that the module imports from "@/utils/supabase/server".
 *
 * Internal branches:
 *   1. Normal flow — signOut() resolves → redirect to /login
 *   2. NEXT_PUBLIC_SITE_URL set  → redirect uses that origin
 *   3. NEXT_PUBLIC_SITE_URL absent → redirect falls back to http://localhost:3000/login
 *   4. signOut() throws           → unhandled (route has no try/catch; tests document the behaviour)
 */

// ---------------------------------------------------------------------------
// Output helpers
// ---------------------------------------------------------------------------

const HEAD = (s: string) =>
  process.stdout.write(`\n  ┌─ ${s} ${"─".repeat(Math.max(0, 50 - s.length))}┐\n`)

const out = (tag: string, desc: string, result: string, note = "") => {
  const t = `[${tag}]`.padEnd(10)
  const d = desc.padEnd(46)
  const n = note ? `  ← ${note}` : ""
  process.stdout.write(`  ${t}  ${d}  →  ${result}${n}\n`)
}

beforeAll(() => {
  process.stdout.write("\n")
  process.stdout.write("  ╔══════════════════════════════════════════════════════╗\n")
  process.stdout.write("  ║  api/auth/logout  whitebox test suite                ║\n")
  process.stdout.write("  ╚══════════════════════════════════════════════════════╝\n")
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Builds a POST Request to the logout endpoint (no body needed). */
function makeRequest(): Request {
  return new Request("http://localhost/api/auth/logout", { method: "POST" })
}

/**
 * Dynamically loads the route with the given mock for the server client factory.
 * Resets modules so each test gets an isolated import.
 */
function loadRoute(signOutImpl: jest.Mock = jest.fn().mockResolvedValue({})) {
  jest.resetModules()
  jest.doMock("@/utils/supabase/server", () => ({
    createSupabaseServerClient: jest.fn().mockResolvedValue({
      auth: { signOut: signOutImpl },
    }),
  }))
  return require("@/app/api/auth/logout/route").POST
}

beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://mock.supabase.co"
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key"
})

afterEach(() => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  delete process.env.NEXT_PUBLIC_SITE_URL
  jest.resetModules()
})

// ===========================================================================
// Branch 1 — Normal redirect flow
// ===========================================================================

describe("normal logout flow — signOut() called then redirect", () => {

  beforeAll(() => { HEAD("Branch 1: normal redirect flow") })

  it("returns a redirect response (3xx) to /login", async () => {
    const POST = loadRoute()
    const res = await POST(makeRequest())
    expect(res.status).toBeGreaterThanOrEqual(300)
    expect(res.status).toBeLessThan(400)
    const location = res.headers.get("location") ?? ""
    expect(location).toContain("/login")
    out("REDIRECT", "POST /api/auth/logout", `status=${res.status} → location includes /login`)
  })

  it("calls signOut() exactly once per request", async () => {
    const signOut = jest.fn().mockResolvedValue({})
    const POST = loadRoute(signOut)
    await POST(makeRequest())
    expect(signOut).toHaveBeenCalledTimes(1)
    out("SIGNOUT", "signOut() call count", "1 ✓", "each request triggers exactly one sign-out")
  })
})

// ===========================================================================
// Branch 2 — NEXT_PUBLIC_SITE_URL controls origin
// ===========================================================================

describe("redirect origin — NEXT_PUBLIC_SITE_URL vs localhost fallback", () => {

  beforeAll(() => { HEAD("Branch 2 & 3: redirect origin") })

  it("uses NEXT_PUBLIC_SITE_URL as the redirect origin when the env var is set", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example-physio.com"
    const POST = loadRoute()
    const res = await POST(makeRequest())
    const location = res.headers.get("location") ?? ""
    expect(location).toContain("example-physio.com")
    expect(location).toContain("/login")
    out("ORIGIN", "NEXT_PUBLIC_SITE_URL=https://example-physio.com", location, "custom origin used")
  })

  it("falls back to http://localhost:3000/login when NEXT_PUBLIC_SITE_URL is not set", async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    const POST = loadRoute()
    const res = await POST(makeRequest())
    const location = res.headers.get("location") ?? ""
    expect(location).toContain("localhost:3000")
    expect(location).toContain("/login")
    out("ORIGIN", "NEXT_PUBLIC_SITE_URL absent", location, "localhost:3000 fallback")
  })
})

// ===========================================================================
// Branch 4 — signOut rejection (route has no try/catch)
// ===========================================================================

describe("signOut failure — route has no error boundary", () => {

  beforeAll(() => {
    HEAD("Branch 4: signOut throws")
    process.stdout.write("  Note: the route has no try/catch — a thrown signOut propagates as\n")
    process.stdout.write("  an unhandled rejection. This test documents that behaviour.\n")
  })

  it("propagates the rejection when signOut() rejects (no catch in route)", async () => {
    const POST = loadRoute(jest.fn().mockRejectedValue(new Error("session store unavailable")))
    await expect(POST(makeRequest())).rejects.toThrow("session store unavailable")
    out("THROW", "signOut() rejects", "rejection propagates ✓", "no try/catch in route")
  })
})
