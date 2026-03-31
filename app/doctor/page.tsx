"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DoctorPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [doctorCode, setDoctorCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function loadDoctor() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace("/login")
        return
      }
      setEmail(session.user.email ?? null)

      const { data, error } = await supabase
        .from("doctors")
        .select("doctor_code")
        .eq("id", session.user.id)
        .single()

      if (error) {
        console.error("[doctor] Failed to fetch doctor_code:", error.message, error.code)
      }

      setDoctorCode(data?.doctor_code ?? null)
    }
    loadDoctor()
  }, [router])

  const handleCopy = async () => {
    if (!doctorCode) return
    await navigator.clipboard.writeText(doctorCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between border-b px-6 py-3">
        <h1 className="text-lg font-semibold">Doctor Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{email}</span>
          <Button variant="outline" size="sm" onClick={handleSignOut}>Sign Out</Button>
        </div>
      </div>
      <div className="p-8">
        {doctorCode && (
          <div className="space-y-6">
            <div className="rounded-lg border p-6 max-w-sm">
              <p className="text-sm text-muted-foreground mb-1">Your doctor code</p>
              <p className="text-3xl font-mono font-bold tracking-widest">{doctorCode}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={handleCopy}
              >
                {copied ? "Copied!" : "Copy Code"}
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Share this code with your patients so they can link to you.
              </p>
            </div>

            <Link href="/doctor/record">
              <Button size="lg">Record Exercise</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
