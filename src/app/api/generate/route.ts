import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { createClient } from "@/lib/supabase/server";
import {
  generateSpeechForLongText,
  estimateDurationSeconds,
} from "@/lib/elevenlabs";

export const maxDuration = 300;

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

    // Upload MP3 to Vercel Blob (public). On Vercel deployments
    // BLOB_READ_WRITE_TOKEN is auto-injected after you provision a Blob store.
    const blob = await put(`audio/${row.id}.mp3`, Buffer.from(audio), {
      access: "public",
      contentType: "audio/mpeg",
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    const duration = estimateDurationSeconds(text);

    const { error: updateError } = await supabase
      .from("audio_generations")
      .update({
        audio_path: blob.url,
        duration_seconds: duration,
        status: "ready",
      })
      .eq("id", row.id);

    if (updateError) throw new Error(updateError.message);

    console.log(`[generate] success: ${blob.url} (${audio.length} bytes)`);

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
