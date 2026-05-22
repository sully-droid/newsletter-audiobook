import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Plain server-side Supabase client. No auth, no cookies, no RLS.
 * The app runs in single-user demo mode — all data is shared.
 */
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
