import { NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import path from "node:path";
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
    // audio_path looks like "/audio/<id>.mp3"
    const filename = row.audio_path.split("/").pop();
    if (filename) {
      try {
        await unlink(path.join(process.cwd(), "public", "audio", filename));
      } catch {
        // file already gone — fine
      }
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
