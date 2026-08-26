import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !serviceRoleKey) {
  console.warn('⚠️ Supabase URL or Service Role Key is missing in environment variables.');
}

/**
 * Server/Admin Supabase client (Bypasses Row-Level Security with Service Role key)
 * Only use in API routes, server components, or webhooks. Never expose to client!
 */
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
