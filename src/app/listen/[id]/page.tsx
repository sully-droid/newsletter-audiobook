import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = createClient();
  const { data } = await supabase
    .from("audio_generations")
    .select("title, status")
    .eq("id", id)
    .single();

  if (!data || data.status !== "ready") {
    return { title: "Audio not found" };
  }
  return {
    title: `${data.title} · Newsletter Audiobook`,
    description: `Listen to ${data.title} in a cloned voice.`,
  };
}

export default async function ListenPage({ params }: { params: Params }) {
  const { id } = await params;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("audio_generations")
    .select("id, title, audio_path, duration_seconds, status, created_at")
    .eq("id", id)
    .single();

  if (error || !data || data.status !== "ready" || !data.audio_path) {
    notFound();
  }

  const createdAt = new Date(data.created_at).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const duration = data.duration_seconds
    ? `${Math.floor(data.duration_seconds / 60)}:${(
        data.duration_seconds % 60
      )
        .toString()
        .padStart(2, "0")}`
    : null;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-12">
      <div className="relative w-full max-w-xl">
        {/* Decorative dots */}
        <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-[color:var(--sun)] opacity-80" />
        <div className="absolute -bottom-3 -right-3 w-4 h-4 rounded-full bg-[color:var(--bloom)] opacity-80" />

        <div className="relative rounded-3xl border border-[color:var(--border)] bg-[color:var(--background-card)] p-10 shadow-[var(--shadow-card)]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--foreground-subtle)] hover:text-[color:var(--foreground)] mb-6"
          >
            ← Newsletter Audiobook
          </Link>

          <h1 className="font-display text-3xl sm:text-4xl font-medium text-[color:var(--foreground)] tracking-tight mb-2 leading-tight">
            {data.title}
          </h1>
          <p className="text-sm text-[color:var(--foreground-muted)] mb-8">
            {createdAt}
            {duration ? ` · ${duration}` : ""}
          </p>

          <audio controls src={data.audio_path} className="w-full" />

          <div className="mt-6 flex gap-2 flex-wrap">
            <a
              href={data.audio_path}
              download={`${data.title}.mp3`}
              className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--ink)] text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-[color:var(--foreground)] transition-colors"
            >
              Download MP3
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--background-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--foreground)] hover:bg-white transition-colors"
            >
              Make your own
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
