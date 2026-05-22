import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("audio_generations")
    .select("id, title, source_url, audio_path, duration_seconds, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // audio_path is already a public URL path like /audio/<id>.mp3
  return NextResponse.json({ items: data ?? [] });
}
