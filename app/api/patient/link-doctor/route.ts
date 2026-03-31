import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(req: Request) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Server missing Supabase config" }, { status: 500 })
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Get the session from the Authorization header
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error: userError } = await createClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ).auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const body = await req.json()
    const { doctor_code } = body

    if (!doctor_code || typeof doctor_code !== "string") {
      return NextResponse.json({ error: "Doctor code is required" }, { status: 400 })
    }

    // Look up the doctor by code
    const { data: doctor, error: lookupErr } = await supabaseAdmin
      .from("doctors")
      .select("id, name")
      .eq("doctor_code", doctor_code.trim().toUpperCase())
      .single()

    if (lookupErr || !doctor) {
      return NextResponse.json({ error: "Invalid doctor code" }, { status: 404 })
    }

    // Update the patient's doctor_id
    const { error: updateErr } = await supabaseAdmin
      .from("patients")
      .update({ doctor_id: doctor.id })
      .eq("id", user.id)

    if (updateErr) {
      console.error("[link-doctor] Failed to update patient:", updateErr.message)
      return NextResponse.json({ error: "Failed to link doctor" }, { status: 500 })
    }

    return NextResponse.json({ ok: true, doctor_name: doctor.name })
  } catch (err: any) {
    console.error("[link-doctor] Unexpected error:", err)
    return NextResponse.json({ error: `Unexpected error: ${err?.message || String(err)}` }, { status: 500 })
  }
}
