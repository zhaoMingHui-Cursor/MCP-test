export function getSupabaseUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}
