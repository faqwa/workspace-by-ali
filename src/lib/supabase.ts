/**
 * Client-Side Supabase Client
 *
 * IMPORTANT: This file is for CLIENT-SIDE use only!
 *
 * Usage Guidelines:
 * - ✅ Use for: Public data queries from browser (e.g., fetching public projects)
 * - ✅ Use for: Real-time subscriptions on client
 * - ❌ DO NOT use for: Authentication (handled by API routes)
 * - ❌ DO NOT use for: Protected data (use server-side supabaseServer.ts)
 *
 * For server-side operations (Astro pages, API routes):
 * → Use createSupabaseServer(Astro.cookies) from supabaseServer.ts instead
 *
 * Auth is disabled on this client - all auth happens server-side via API routes.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

// Environment variables
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

/**
 * Client-side Supabase instance
 *
 * Configured for public queries only. Auth is disabled - handled by server.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Auth is handled server-side only
    autoRefreshToken: false,
    detectSessionInUrl: false,
    persistSession: false,
    flowType: 'pkce',
  },
});
