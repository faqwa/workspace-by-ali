/**
 * Sign In API Route
 *
 * Handles OAuth provider authentication and magic link email
 */

import type { APIRoute } from 'astro';
import { createSupabaseServer } from '../../../lib/supabaseServer';
import { apiError, API_ERRORS, checkRateLimit } from '../../../lib/apiUtils';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  // Rate limiting: 5 signin attempts per minute
  const rateLimitCheck = checkRateLimit(request, 5, 60000);
  if (rateLimitCheck) {
    return rateLimitCheck;
  }

  const formData = await request.formData();
  const provider = formData.get('provider')?.toString();
  const email = formData.get('email')?.toString();

  const supabase = createSupabaseServer(cookies);

  // Handle OAuth provider signin
  if (provider) {
    if (!['github', 'google'].includes(provider)) {
      return apiError('Invalid provider', 400, 'INVALID_PROVIDER');
    }

    const redirectUrl =
      import.meta.env.DEV
        ? 'http://localhost:4321/api/auth/callback'
        : `${new URL(request.url).origin}/api/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as 'github' | 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error('[Signin API] OAuth error:', error);
      return apiError(error.message, 500, 'OAUTH_ERROR');
    }

    // Redirect to OAuth provider
    return redirect(data.url, 302);
  }

  // Handle magic link email signin
  if (email) {
    // Basic email validation
    if (!email.includes('@')) {
      return apiError('Invalid email address', 400, 'INVALID_EMAIL');
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: import.meta.env.DEV
          ? 'http://localhost:4321/api/auth/callback'
          : `${new URL(request.url).origin}/api/auth/callback`,
      },
    });

    if (error) {
      console.error('[Signin API] Magic link error:', error);
      return apiError(error.message, 500, 'MAGIC_LINK_ERROR');
    }

    // Return success (don't redirect for AJAX requests)
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return apiError('Provider or email required', 400, 'MISSING_PARAMS');
};
