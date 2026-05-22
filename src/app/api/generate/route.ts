import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@/lib/supabase/server";
import {
  generateSpeechForLongText,
  estimateDurationSeconds,
} from "@/lib/elevenlabs";

export const maxDuration = 300;

// Audio files are written to public/audio/ so Next.js serves them at /audio/{id}.mp3.
// Local-dev / single-instance only — for production, swap to Vercel Blob.
const AUDIO_DIR = path.join(process.cwd(), "public", "audio");

export async function POST(request: Request) {
  const supabase = createClient();

  const body = (await request.json()) as {
    title?: string;
    text?: string;
    source_url?: string | null;
  };
  const title = body.title?.trim() || "Untitled episode";
  const text = body.text?.trim() || "";
  const sourceUrl = body.source_url?.trim() || null;

  if (!text) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }
  if (text.length > 50_000) {
    return NextResponse.json(
      { error: "Text exceeds 50,000 character limit" },
      { status: 400 }
    );
  }

  const { data: settings, error: settingsError } = await supabase
    .from("app_settings")
    .select("elevenlabs_voice_id, voice_clone_status")
    .eq("id", 1)
    .single();

  if (
    settingsError ||
    !settings?.elevenlabs_voice_id ||
    settings.voice_clone_status !== "ready"
  ) {
    return NextResponse.json(
      { error: "Clone a voice first before generating audio." },
      { status: 400 }
    );
  }

  const { data: row, error: insertError } = await supabase
    .from("audio_generations")
    .insert({
      title,
      source_text: text,
      source_url: sourceUrl,
      status: "processing",
    })
    .select()
    .single();

  if (insertError || !row) {
    return NextResponse.json(
      { error: insertError?.message ?? "Failed to create generation" },
      { status: 500 }
    );
  }

  try {
    const audio = await generateSpeechForLongText({
      voiceId: settings.elevenlabs_voice_id,
      text,
    });

    await mkdir(AUDIO_DIR, { recursive: true });
    const filename = `${row.id}.mp3`;
    const filepath = path.join(AUDIO_DIR, filename);
    await writeFile(filepath, audio);

    // Public path served by Next.js from /public
    const audioPath = `/audio/${filename}`;
    const duration = estimateDurationSeconds(text);

    const { error: updateError } = await supabase
      .from("audio_generations")
      .update({
        audio_path: audioPath,
        duration_seconds: duration,
        status: "ready",
      })
      .eq("id", row.id);

    if (updateError) throw new Error(updateError.message);

    console.log(`[generate] success: ${audioPath} (${audio.length} bytes)`);

    return NextResponse.json({ id: row.id, status: "ready" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    console.error("[generate] failure:", message);
    await supabase
      .from("audio_generations")
      .update({ status: "failed", error_message: message })
      .eq("id", row.id);
    return NextResponse.json({ id: row.id, error: message }, { status: 500 });
  }
}
