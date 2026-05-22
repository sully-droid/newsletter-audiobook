"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type LibraryItem = {
  id: string;
  title: string;
  source_url: string | null;
  audio_path: string | null;
  audio_url: string | null;
  duration_seconds: number | null;
  status: "processing" | "ready" | "failed";
  created_at: string;
};

function formatDuration(seconds: number | null): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type Props = {
  items: LibraryItem[];
  siteUrl: string;
};

export function LibraryList({ items, siteUrl }: Props) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function onDelete(id: string) {
    if (!confirm("Delete this audio?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/audio/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  function copyLink(id: string) {
    const url = `${siteUrl}/listen/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(`link-${id}`);
    setTimeout(() => setCopiedId(null), 1500);
  }

  function copyEmbed(item: LibraryItem) {
    if (!item.audio_url) return;
    const code = `<audio controls src="${siteUrl}${item.audio_url}"></audio>`;
    navigator.clipboard.writeText(code);
    setCopiedId(`embed-${item.id}`);
    setTimeout(() => setCopiedId(null), 1500);
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[color:var(--border-strong)] bg-[color:var(--background-soft)] px-6 py-10 text-center">
        <p className="font-display text-lg text-[color:var(--foreground-muted)]">
          Your library is empty.
        </p>
        <p className="mt-1 text-sm text-[color:var(--foreground-subtle)]">
          Clone a voice and generate your first episode above.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-xl border border-[color:var(--border)] bg-[color:var(--background-card)] p-4 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display text-base font-medium text-[color:var(--foreground)] truncate">
                  {item.title}
                </h3>
                {item.status !== "ready" ? (
                  <span
                    className={
                      item.status === "processing"
                        ? "rounded-full border border-[color:var(--sun)]/40 bg-[color:var(--sun)]/15 text-[color:var(--foreground)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                        : "rounded-full border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 text-[color:var(--accent-deep)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                    }
                  >
                    {item.status}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-[color:var(--foreground-subtle)]">
                {formatDate(item.created_at)} ·{" "}
                {formatDuration(item.duration_seconds)}
              </p>
            </div>
            <button
              onClick={() => onDelete(item.id)}
              disabled={deletingId === item.id}
              className="text-xs text-[color:var(--foreground-subtle)] hover:text-[color:var(--accent-deep)] disabled:opacity-50 font-medium"
              aria-label="Delete audio"
            >
              {deletingId === item.id ? "Deleting…" : "Delete"}
            </button>
          </div>

          {item.status === "ready" && item.audio_url ? (
            <div className="mt-3 space-y-3">
              <audio
                controls
                src={item.audio_url}
                className="w-full rounded-lg"
              />
              <div className="flex gap-2 flex-wrap">
                <ActionButton
                  onClick={() => copyLink(item.id)}
                  label={
                    copiedId === `link-${item.id}` ? "Copied!" : "Copy link"
                  }
                />
                <ActionButton
                  onClick={() => copyEmbed(item)}
                  label={
                    copiedId === `embed-${item.id}` ? "Copied!" : "Copy embed"
                  }
                />
                <a
                  href={item.audio_url}
                  download={`${item.title}.mp3`}
                  className="rounded-full border border-[color:var(--border-strong)] bg-[color:var(--background-soft)] px-3 py-1.5 text-xs font-semibold text-[color:var(--foreground)] hover:bg-white transition-colors"
                >
                  Download
                </a>
              </div>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function ActionButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-[color:var(--border-strong)] bg-[color:var(--background-soft)] px-3 py-1.5 text-xs font-semibold text-[color:var(--foreground)] hover:bg-white transition-colors"
    >
      {label}
    </button>
  );
}
