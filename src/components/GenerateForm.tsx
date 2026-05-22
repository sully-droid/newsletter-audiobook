"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  disabled: boolean;
  disabledReason?: string;
};

const WORDS_PER_MINUTE = 150;

function estimateDuration(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (!words) return "0 min";
  const minutes = words / WORDS_PER_MINUTE;
  if (minutes < 1) return `${Math.max(1, Math.round(minutes * 60))} sec`;
  return `${minutes.toFixed(1)} min`;
}

export function GenerateForm({ disabled, disabledReason }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => {
    const chars = text.length;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const duration = estimateDuration(text);
    return { chars, words, duration };
  }, [text]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!text.trim()) {
      setError("Paste some newsletter text first.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || "Untitled episode",
          text,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setText("");
      setTitle("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--background-card)] p-7 shadow-[var(--shadow-card)]">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-medium text-[color:var(--foreground)] tracking-tight">
          Generate audio
        </h2>
        <p className="mt-1 text-sm text-[color:var(--foreground-muted)] leading-relaxed">
          Paste a newsletter post. We&rsquo;ll render it in your cloned voice.
        </p>
      </div>

      {disabled ? (
        <div className="rounded-lg border border-[color:var(--sun)]/40 bg-[color:var(--sun)]/10 px-4 py-3 text-sm text-[color:var(--foreground)]">
          {disabledReason ?? "Clone a voice above before generating audio."}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[color:var(--foreground-subtle)] mb-1.5">
              Episode title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What should we call this episode?"
              className="w-full rounded-lg border border-[color:var(--border-strong)] bg-[color:var(--background-soft)] px-3.5 py-2.5 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--foreground-subtle)] focus:outline-none focus:border-[color:var(--accent)] focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[color:var(--foreground-subtle)] mb-1.5">
              Newsletter text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your newsletter content here…"
              rows={12}
              maxLength={50000}
              className="w-full rounded-lg border border-[color:var(--border-strong)] bg-[color:var(--background-soft)] px-3.5 py-3 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--foreground-subtle)] focus:outline-none focus:border-[color:var(--accent)] focus:bg-white resize-y font-mono leading-relaxed transition-colors"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-[color:var(--foreground-subtle)]">
              <span>
                {stats.words.toLocaleString()} words ·{" "}
                {stats.chars.toLocaleString()} / 50,000 chars
              </span>
              <span className="font-medium">
                ~{stats.duration} of audio
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] text-white px-5 py-2.5 text-sm font-semibold tracking-wide hover:bg-[color:var(--accent-deep)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? (
              <>
                <Spinner /> Generating audio…
              </>
            ) : (
              "Generate audio"
            )}
          </button>

          {submitting && (
            <p className="text-xs text-[color:var(--foreground-subtle)]">
              Long newsletters can take a minute or two. Don&rsquo;t close this tab.
            </p>
          )}

          {error && (
            <p className="text-sm text-[color:var(--accent-deep)] font-medium">
              {error}
            </p>
          )}
        </form>
      )}
    </section>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.25"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
