/**
 * Sign Out API Route
 *
 * Handles user sign out by clearing the session and cookies
 */

import type { APIRoute } from 'astro';
import { createSupabaseServer } from '../../../lib/supabaseServer';
import { apiError } from '../../../lib/apiUtils';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const supabase = createSupabaseServer(cookies);

  console.log('[Signout API] Signing out user');

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('[Signout API] Error signing out:', error);
    return apiError(error.message, 500, 'SIGNOUT_ERROR');
  }

  console.log('[Signout API] User signed out successfully');

  // Redirect to home page after sign out
  return redirect('/', 302);
};
