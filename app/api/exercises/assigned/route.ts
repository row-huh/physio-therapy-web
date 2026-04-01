import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function GET(req: Request) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Server missing Supabase config" }, { status: 500 })
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

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

    const { data: assignments, error: queryErr } = await supabaseAdmin
      .from("exercise_assignments")
      .select("id, name, exercise_type, video_url, template, status, notes, assigned_at")
      .eq("patient_id", user.id)
      .order("assigned_at", { ascending: false })

    if (queryErr) {
      console.error("[assigned] Failed to fetch assignments:", queryErr.message)
      return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 })
    }

    return NextResponse.json({ assignments: assignments || [] })
  } catch (err: any) {
    console.error("[assigned] Unexpected error:", err)
    return NextResponse.json({ error: `Unexpected error: ${err?.message || String(err)}` }, { status: 500 })
  }
}
