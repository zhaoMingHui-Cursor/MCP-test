import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseUrl } from "@/lib/supabase/url";

export function createClient() {
  const supabaseUrl = getSupabaseUrl();

  return createBrowserClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
  );
}
