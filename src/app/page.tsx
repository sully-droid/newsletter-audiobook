import { createClient } from "@/lib/supabase/server";
import { VoiceCloneCard } from "@/components/VoiceCloneCard";
import { GenerateForm } from "@/components/GenerateForm";
import { LibraryList, type LibraryItem } from "@/components/LibraryList";
import { CatVideo } from "@/components/CatVideo";
import type { VoiceCloneStatus } from "@/lib/types";

// The page reads from Supabase on every request — never prerender it at
// build time, otherwise new generations don't appear until the next deploy.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const supabase = createClient();

  const [{ data: settings }, { data: rawAudio }] = await Promise.all([
    supabase
      .from("app_settings")
      .select("elevenlabs_voice_id, voice_clone_status")
      .eq("id", 1)
      .single(),
    supabase
      .from("audio_generations")
      .select(
        "id, title, source_url, audio_path, duration_seconds, status, created_at"
      )
      .order("created_at", { ascending: false }),
  ]);

  const status: VoiceCloneStatus =
    (settings?.voice_clone_status as VoiceCloneStatus) ?? "none";
  const hasVoiceId = Boolean(settings?.elevenlabs_voice_id);
  const generateDisabled = !hasVoiceId || status !== "ready";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const items: LibraryItem[] = (rawAudio ?? []).map((row) => ({
    ...row,
    audio_url: row.audio_path,
  }));

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className="relative z-10 mx-auto max-w-7xl px-6 pt-8 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Mark />
            <span className="font-display text-base font-semibold tracking-tight text-[color:var(--foreground)]">
              Newsletter Audiobook
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-5 text-xs font-semibold uppercase tracking-wider text-[color:var(--foreground-muted)]">
            <span className="text-[color:var(--foreground)]">Studio</span>
            <a
              href="https://elevenlabs.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[color:var(--foreground)] transition-colors"
            >
              Powered by ElevenLabs ↗
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-10 pb-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-display italic text-sm text-[color:var(--accent-deep)] mb-3 tracking-wide">
            for newsletter writers, by newsletter writers
          </p>
          <h1 className="font-display text-5xl sm:text-6xl font-medium text-[color:var(--foreground)] tracking-tight leading-[1.05]">
            Your newsletter,
            <br />
            <span className="italic text-[color:var(--accent-deep)]">
              in your own voice.
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[color:var(--foreground-muted)] leading-relaxed max-w-xl mx-auto">
            Clone your voice once with a short audio sample. Then turn any
            newsletter post into a polished audiobook your readers can listen to
            anywhere.
          </p>
        </div>
      </section>

      {/* App centered; cat floats freely in the right whitespace on desktop */}
      <main className="relative z-10 pb-20">
        {/* Centered app column */}
        <div className="mx-auto max-w-[640px] px-6 space-y-6">
          <VoiceCloneCard status={status} hasVoiceId={hasVoiceId} />
          <GenerateForm
            disabled={generateDisabled}
            disabledReason={
              !hasVoiceId
                ? "Clone a voice above first."
                : status === "processing"
                ? "Voice clone is still processing. Hang tight."
                : status === "failed"
                ? "Voice clone failed. Upload a new sample above."
                : undefined
            }
          />
          <section>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-display text-2xl font-medium text-[color:var(--foreground)] tracking-tight">
                Library
              </h2>
              {items.length > 0 && (
                <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--foreground-subtle)]">
                  {items.length} {items.length === 1 ? "episode" : "episodes"}
                </span>
              )}
            </div>
            <LibraryList items={items} siteUrl={siteUrl} />
          </section>
        </div>

        {/* Locked-in-place cat — absolute, doesn't follow scroll.
           Centered horizontally in the right-side whitespace.
           Width scales with viewport but stays within the whitespace. */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute top-[100px] pointer-events-none"
          style={{
            left: "calc(75vw + 160px)",
            transform: "translateX(-50%)",
            width: "clamp(320px, 40vw, 620px)",
          }}
        >
          <CatVideo />
        </div>

        {/* Mobile: drop the video inline below the app */}
        <div className="lg:hidden mt-12 max-w-sm mx-auto px-6">
          <CatVideo />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[color:var(--border)] mx-auto max-w-7xl px-6 py-8 mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[color:var(--foreground-subtle)]">
          <p>
            Built with Next.js, Supabase, and the ElevenLabs API. A portfolio
            project by Sully Solomon.
          </p>
          <p className="font-display italic">
            Read aloud, in your own voice.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Mark() {
  // Little hand-drawn mark — speech-bubble + sound waves
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 5 8 q 0 -4 4 -4 l 14 0 q 4 0 4 4 l 0 10 q 0 4 -4 4 l -10 0 l -6 6 l 0 -6 q -2 -1 -2 -4 z"
        fill="#e8754c"
        stroke="#1f1a14"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <line
        x1="11"
        y1="13"
        x2="11"
        y2="17"
        stroke="#fbf7ee"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="11"
        x2="16"
        y2="19"
        stroke="#fbf7ee"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="21"
        y1="13"
        x2="21"
        y2="17"
        stroke="#fbf7ee"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
