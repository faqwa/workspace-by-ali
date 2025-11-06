/**
 * GitHub Connect API Route
 *
 * Handles secondary GitHub OAuth specifically for repo access
 * This is separate from initial authentication to request repo scope
 *
 * Flow:
 * 1. User initiates connection (GET)
 * 2. Redirect to GitHub OAuth with repo scope
 * 3. GitHub redirects back to /api/auth/github-callback
 * 4. Callback exchanges code for token
 * 5. Token encrypted and stored in user_repos table
 *
 * Reference: docs/architecture/05_Keystatic_Integration.md
 */

import type { APIRoute } from 'astro';
import { createSupabaseServer } from '../../../lib/supabaseServer';
import { apiError } from '../../../lib/apiUtils';

const GITHUB_CLIENT_ID = import.meta.env.PUBLIC_GITHUB_CLIENT_ID || process.env.PUBLIC_GITHUB_CLIENT_ID;
const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';

/**
 * GET - Initiate GitHub OAuth for repo access
 *
 * Redirects user to GitHub OAuth consent screen with repo scope
 */
export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  // Verify user is authenticated
  const supabase = createSupabaseServer(cookies);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('[GitHub Connect] User not authenticated:', authError);
    return apiError('Authentication required', 401, 'UNAUTHORIZED');
  }

  // Check if GitHub Client ID is configured
  if (!GITHUB_CLIENT_ID) {
    console.error('[GitHub Connect] GITHUB_CLIENT_ID not configured');
    return apiError('GitHub OAuth not configured', 500, 'CONFIGURATION_ERROR');
  }

  // Generate OAuth URL with repo scope
  const origin = new URL(request.url).origin;
  const callbackUrl = `${origin}/api/auth/github-callback`;

  const oauthUrl = new URL(GITHUB_OAUTH_URL);
  oauthUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
  oauthUrl.searchParams.set('redirect_uri', callbackUrl);
  oauthUrl.searchParams.set('scope', 'repo read:user'); // Repo access + user info
  oauthUrl.searchParams.set('state', user.id); // Use user ID as state for verification

  console.log('[GitHub Connect] Redirecting to GitHub OAuth:', oauthUrl.toString());

  // Redirect to GitHub
  return redirect(oauthUrl.toString(), 302);
};

/**
 * POST - Manual trigger for GitHub connection
 *
 * Alternative to GET for programmatic access
 * Returns OAuth URL instead of redirecting
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  // Verify user is authenticated
  const supabase = createSupabaseServer(cookies);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return apiError('Authentication required', 401, 'UNAUTHORIZED');
  }

  // Check if GitHub Client ID is configured
  if (!GITHUB_CLIENT_ID) {
    return apiError('GitHub OAuth not configured', 500, 'CONFIGURATION_ERROR');
  }

  // Generate OAuth URL
  const origin = new URL(request.url).origin;
  const callbackUrl = `${origin}/api/auth/github-callback`;

  const oauthUrl = new URL(GITHUB_OAUTH_URL);
  oauthUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
  oauthUrl.searchParams.set('redirect_uri', callbackUrl);
  oauthUrl.searchParams.set('scope', 'repo read:user');
  oauthUrl.searchParams.set('state', user.id);

  // Return OAuth URL
  return new Response(
    JSON.stringify({
      success: true,
      oauthUrl: oauthUrl.toString(),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
