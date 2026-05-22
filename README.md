# Newsletter Audiobook Creator

A web app that clones a voice from a short audio sample and turns pasted newsletter text into MP3 audio of that voice. Built on Next.js 16, Supabase (Postgres metadata), and the ElevenLabs API.

**Single-user demo mode** — no login, no auth. One voice, one shared library.

## Stack

- **Next.js 16** (App Router, React 19)
- **Tailwind CSS v4**
- **Supabase Postgres** — stores the cloned `voice_id` and the audio_generations metadata
- **Local filesystem** (`public/audio/`) for MP3 files
- **ElevenLabs SDK** — Instant Voice Cloning + TTS (`eleven_multilingual_v2`)

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. No login required — you'll land on the dashboard.

## Demo walkthrough

1. **Clone a voice** — upload a clean ~2-minute MP3/WAV/M4A audio sample. The app sends it to ElevenLabs Instant Voice Cloning and stores the returned `voice_id` in Supabase.
2. **Generate audio** — paste a newsletter post, give it an optional title, click Generate. Long posts are chunked by paragraph and concatenated. TTS for short texts takes ~5–10 seconds.
3. **Library** — generated episodes appear below with an inline player, download button, copy-link, and copy-embed.
4. **Listen page** — every generation has a public `/listen/{id}` URL that anyone can open.

## Environment

`.env.local`:

```env
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_MODEL_ID=eleven_multilingual_v2

NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The Supabase schema is in `supabase/schema.sql`. For this project, the schema has already been applied to the linked Supabase project. The schema creates two tables (`app_settings`, `audio_generations`) with RLS disabled.

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── audio/[id]/route.ts    # DELETE one audio (and its MP3 file)
│   │   ├── generate/route.ts      # POST text → MP3 in public/audio/
│   │   ├── library/route.ts       # GET all generations
│   │   └── voice/clone/route.ts   # POST audio sample → voice_id
│   ├── listen/[id]/               # Public listen page
│   ├── layout.tsx
│   └── page.tsx                   # Dashboard (no auth)
├── components/
│   ├── GenerateForm.tsx
│   ├── LibraryList.tsx
│   └── VoiceCloneCard.tsx
└── lib/
    ├── elevenlabs.ts
    ├── supabase/{client,server}.ts
    └── types.ts
public/audio/                      # Generated MP3s served at /audio/<id>.mp3
supabase/schema.sql                # Reference SQL (already applied)
```

## What's NOT in v1 (per PRD §1.3)

- URL ingestion — paste-only for now
- Multi-language voice picker
- Billing / paywalls
- Custom embed player styling
- LinkedIn (intentionally out of scope)

## Production deployment notes

This is a **local-demo-shape app**. To deploy on Vercel:

- `public/audio/` won't persist — Vercel's filesystem is ephemeral and read-only at runtime. Swap the MP3 storage in `src/app/api/generate/route.ts` to **Vercel Blob** (`@vercel/blob`) and store the public URL in `audio_generations.audio_path`.
- Same for the delete route — call `del()` from `@vercel/blob` instead of `unlink()`.
- Add `BLOB_READ_WRITE_TOKEN` to the Vercel env when you provision a Blob store from the Marketplace.

These two changes (one upload site, one delete site) are the only deploy blockers; everything else is portable.

## Why no auth?

The original PRD specified Supabase auth + RLS. After hours debugging an upstream issue where `@supabase/ssr`'s server client didn't reliably attach the user JWT to storage uploads (postgrest worked, storage didn't), we stripped auth entirely for the v1 demo. The architecture is cleaner this way, and the auth layer can be re-added later if multi-user becomes a requirement.
