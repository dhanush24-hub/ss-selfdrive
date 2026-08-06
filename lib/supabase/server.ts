import { createClient as supabase } from '@supabase/supabase-js'
export function createAdminClient() {
  return supabase(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
