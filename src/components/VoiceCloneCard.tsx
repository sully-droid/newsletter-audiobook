"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { VoiceCloneStatus } from "@/lib/types";

type Props = {
  status: VoiceCloneStatus;
  hasVoiceId: boolean;
};

const ACCEPT = ".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/mp4,audio/x-m4a";

export function VoiceCloneCard({ status, hasVoiceId }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("My Newsletter Voice");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReady = status === "ready" && hasVoiceId;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      setError("Pick an audio sample first.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const fd = new FormData();
    fd.append("sample", file);
    fd.append("name", name);

    try {
      const res = await fetch("/api/voice/clone", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Voice cloning failed");
      router.refresh();
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Voice cloning failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--background-card)] p-7 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h2 className="font-display text-2xl font-medium text-[color:var(--foreground)] tracking-tight">
            Your voice
          </h2>
          <p className="mt-1 text-sm text-[color:var(--foreground-muted)] leading-relaxed">
            Upload a clean ~2-minute sample. Best results: solo speech, no
            background music, consistent mic distance.
          </p>
        </div>
        <StatusPill status={status} />
      </div>

      {isReady && (
        <div className="mt-5 rounded-lg border border-[color:var(--leaf)]/30 bg-[color:var(--leaf)]/10 px-4 py-3 text-sm text-[color:var(--foreground)]">
          <span className="font-medium">Ready.</span> Generate audio below, or
          upload a new sample to replace this voice.
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[color:var(--foreground-subtle)] mb-1.5">
            Voice name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-[color:var(--border-strong)] bg-[color:var(--background-soft)] px-3.5 py-2.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:border-[color:var(--accent)] focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[color:var(--foreground-subtle)] mb-1.5">
            Audio sample
          </label>
          <div className="rounded-lg border border-dashed border-[color:var(--border-strong)] bg-[color:var(--background-soft)] px-4 py-4">
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-[color:var(--foreground-muted)] file:mr-3 file:rounded-md file:border-0 file:bg-[color:var(--ink)] file:text-white file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wider hover:file:bg-[color:var(--accent-deep)] file:cursor-pointer cursor-pointer"
            />
            {file && (
              <p className="mt-2 text-xs text-[color:var(--foreground-subtle)]">
                {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !file}
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] text-white px-5 py-2.5 text-sm font-semibold tracking-wide hover:bg-[color:var(--foreground)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? (
            <>
              <Spinner /> Cloning your voice…
            </>
          ) : isReady ? (
            "Replace voice clone"
          ) : (
            "Clone my voice"
          )}
        </button>

        {error && (
          <p className="text-sm text-[color:var(--accent-deep)] font-medium">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}

function StatusPill({ status }: { status: VoiceCloneStatus }) {
  const label = {
    none: "No voice yet",
    processing: "Processing…",
    ready: "Ready",
    failed: "Failed",
  }[status];
  const classes = {
    none: "bg-[color:var(--background-soft)] text-[color:var(--foreground-subtle)] border-[color:var(--border)]",
    processing:
      "bg-[color:var(--sun)]/20 text-[color:var(--foreground)] border-[color:var(--sun)]/60",
    ready:
      "bg-[color:var(--leaf)]/15 text-[color:var(--leaf)] border-[color:var(--leaf)]/40",
    failed:
      "bg-[color:var(--accent)]/15 text-[color:var(--accent-deep)] border-[color:var(--accent)]/40",
  }[status];
  return (
    <span
      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${classes}`}
    >
      {status === "processing" && <Spinner small />}
      {label}
    </span>
  );
}

function Spinner({ small = false }: { small?: boolean }) {
  const size = small ? "h-3 w-3" : "h-4 w-4";
  return (
    <svg
      className={`${size} animate-spin`}
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
