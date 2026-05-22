import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createClient();

  const { data: row } = await supabase
    .from("audio_generations")
    .select("audio_path")
    .eq("id", id)
    .single();

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (row.audio_path) {
    try {
      // audio_path is the full Vercel Blob URL (post-deploy).
      // For any leftover local-dev rows it might be a /audio/... path —
      // those don't need a remote delete.
      if (row.audio_path.startsWith("http")) {
        await del(row.audio_path);
      }
    } catch (err) {
      console.warn("[audio:delete] blob delete failed:", err);
    }
  }

  const { error } = await supabase
    .from("audio_generations")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
