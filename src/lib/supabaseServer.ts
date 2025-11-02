/**
 * Server-side Supabase Client
 * Handles cookies properly for SSR in Astro
 */

import { createServerClient } from '@supabase/ssr';
import type { AstroCookies } from 'astro';
import type { Database } from './types/database';

export function createSupabaseServer(cookies: AstroCookies) {
  return createServerClient<Database>(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(key: string) {
          const cookie = cookies.get(key);
          return cookie?.value;
        },
        set(key: string, value: string, options: any) {
          cookies.set(key, value, {
            ...options,
            path: '/',
            sameSite: 'lax',
            secure: import.meta.env.PROD,
          });
        },
        remove(key: string, options: any) {
          cookies.delete(key, {
            ...options,
            path: '/',
          });
        },
      },
    }
  );
}
