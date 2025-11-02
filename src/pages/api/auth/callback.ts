/**
 * OAuth Callback API Route
 *
 * Handles the OAuth redirect from Supabase after authentication
 * Exchanges the authorization code for a session and stores tokens in cookies
 */

import type { APIRoute } from 'astro';
import { createSupabaseServer } from '../../../lib/supabaseServer';
import { upsertUserProfile } from '../../../lib/auth';

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get('code');

  console.log('[Callback API] Received callback request');
  console.log('[Callback API] Code present:', !!code);

  if (!code) {
    console.error('[Callback API] No code parameter found');
    return redirect('/login?error=no_code', 302);
  }

  const supabase = createSupabaseServer(cookies);

  // Exchange the code for a session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[Callback API] Error exchanging code:', error);
    return redirect('/login?error=auth_failed', 302);
  }

  if (!data.session) {
    console.error('[Callback API] No session returned');
    return redirect('/login?error=no_session', 302);
  }

  console.log('[Callback API] Session established successfully');
  console.log('[Callback API] User:', data.session.user.email);

  // Create or update user profile in database
  try {
    await upsertUserProfile(supabase, data.session.user);
    console.log('[Callback API] User profile created/updated');
  } catch (err) {
    console.error('[Callback API] Error creating profile:', err);
    // Don't fail the auth flow if profile creation fails
  }

  // Redirect to projects page
  console.log('[Callback API] Redirecting to /projects');
  return redirect('/projects', 302);
};
