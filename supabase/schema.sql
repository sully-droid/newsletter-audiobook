-- Newsletter Audiobook Creator — no-auth single-user schema
-- Run once in the Supabase SQL editor (this has already been applied to the
-- linked project; this file exists for reference and re-provisioning).

-- =============================================================================
-- app_settings: single-row table for the global voice clone
-- =============================================================================

create table if not exists public.app_settings (
  id integer primary key default 1,
  elevenlabs_voice_id text,
  voice_clone_status text not null default 'none'
    check (voice_clone_status in ('none', 'processing', 'ready', 'failed')),
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into public.app_settings (id) values (1) on conflict do nothing;

-- =============================================================================
-- audio_generations: one row per generated audio file
-- =============================================================================

create table if not exists public.audio_generations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_text text not null,
  source_url text,
  audio_path text,           -- public URL path served by Next.js, e.g. /audio/<id>.mp3
  duration_seconds integer,
  status text not null default 'processing'
    check (status in ('processing', 'ready', 'failed')),
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists audio_generations_created_at_idx
  on public.audio_generations (created_at desc);

-- =============================================================================
-- No auth, no RLS — single-user demo mode
-- =============================================================================
alter table public.app_settings disable row level security;
alter table public.audio_generations disable row level security;

grant select, insert, update on public.app_settings to anon, authenticated;
grant select, insert, update, delete on public.audio_generations to anon, authenticated;
