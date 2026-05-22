import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cloneVoiceFromSample, deleteVoice } from "@/lib/elevenlabs";

export const maxDuration = 60;

const ACCEPTED_MIME = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
]);

export async function POST(request: Request) {
  const supabase = createClient();

  const formData = await request.formData();
  const file = formData.get("sample");
  const name = (formData.get("name") as string | null) || "My Newsletter Voice";

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json(
      { error: "No audio sample provided" },
      { status: 400 }
    );
  }

  const filename = file instanceof File ? file.name : "sample.mp3";
  if (file.size === 0) {
    return NextResponse.json({ error: "Sample file is empty" }, { status: 400 });
  }
  if (file.size > 25 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Sample file is too large (max 25 MB)" },
      { status: 400 }
    );
  }
  if (file.type && !ACCEPTED_MIME.has(file.type)) {
    return NextResponse.json(
      {
        error: `Unsupported audio format: ${file.type}. Use mp3, wav, or m4a (not mp4 video).`,
      },
      { status: 400 }
    );
  }

  await supabase
    .from("app_settings")
    .update({
      voice_clone_status: "processing",
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  // Delete the previous clone on ElevenLabs to free quota
  const { data: existing } = await supabase
    .from("app_settings")
    .select("elevenlabs_voice_id")
    .eq("id", 1)
    .single();
  if (existing?.elevenlabs_voice_id) {
    try {
      await deleteVoice(existing.elevenlabs_voice_id);
    } catch {
      // ignore — voice may already be gone on ElevenLabs side
    }
  }

  try {
    const voiceId = await cloneVoiceFromSample({
      name,
      sample: file,
      filename,
    });

    const { error: updateError } = await supabase
      .from("app_settings")
      .update({
        elevenlabs_voice_id: voiceId,
        voice_clone_status: "ready",
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ voice_id: voiceId, status: "ready" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Voice cloning failed";
    await supabase
      .from("app_settings")
      .update({
        voice_clone_status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
