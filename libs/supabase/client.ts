import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Public Supabase environment variables are missing. Using fallback client.');
}

/**
 * Public Supabase client for client-side queries (browser safe)
 */
export const supabase: SupabaseClient = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-anon-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
