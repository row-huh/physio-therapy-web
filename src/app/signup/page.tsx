"use client"

import { useState } from "react"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"patient" | "doctor">("patient")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      })

      const data = await res.json()
      if (!res.ok) {
        setMessage(data?.error || "Signup failed")
      } else {
        setMessage("Signup successful — check your email to confirm (if required).")
        setEmail("")
        setPassword("")
      }
    } catch (err: any) {
      setMessage(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Sign up</h1>

        <label className="block">
          <div className="text-sm">Email</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </label>

        <label className="block">
          <div className="text-sm">Password</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </label>

        <div>
          <div className="text-sm mb-2">Sign up as</div>
          <label className="mr-4">
            <input
              type="radio"
              name="role"
              value="patient"
              checked={role === "patient"}
              onChange={() => setRole("patient")}
            />
            <span className="ml-2">Patient</span>
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="doctor"
              checked={role === "doctor"}
              onChange={() => setRole("doctor")}
            />
            <span className="ml-2">Doctor</span>
          </label>
        </div>

        <div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </div>

        {message && <div className="mt-2 text-sm">{message}</div>}
      </form>
    </main>
  )
}
