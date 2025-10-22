/**
 * Supabase Client Configuration
 *
 * This file provides Supabase client instances for both browser and server contexts.
 * Uses the @supabase/ssr package for proper auth handling in Astro.
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
 * Browser/Client-side Supabase client
 * Use this in .astro files and client-side scripts
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/**
 * Server-side Supabase client (with service role key)
 * ONLY use this in API routes or server-side code
 * Has elevated privileges - use with caution
 */
export function getSupabaseServer() {
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY - required for server operations');
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
