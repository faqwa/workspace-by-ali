/**
 * GitHub OAuth Callback Handler
 *
 * Handles the OAuth callback from GitHub after user grants repo access
 *
 * Flow:
 * 1. Receive code and state from GitHub
 * 2. Exchange code for access token
 * 3. Fetch user's GitHub profile
 * 4. Encrypt and store token in user_repos table
 * 5. Redirect to dashboard or onboarding
 *
 * Reference: docs/architecture/05_Keystatic_Integration.md
 */

import type { APIRoute } from 'astro';
import { createSupabaseServer } from '../../../lib/supabaseServer';
import { encryptToken } from '../../../lib/tokenEncryption';
import { apiError } from '../../../lib/apiUtils';

const GITHUB_CLIENT_ID = import.meta.env.PUBLIC_GITHUB_CLIENT_ID || process.env.PUBLIC_GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = import.meta.env.GITHUB_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET;
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_API = 'https://api.github.com/user';

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  email: string | null;
}

/**
 * GET - GitHub OAuth callback
 *
 * Handles the redirect from GitHub with authorization code
 */
export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state'); // User ID
  const error = url.searchParams.get('error');

  // Check for OAuth errors
  if (error) {
    console.error('[GitHub Callback] OAuth error:', error);
    return redirect('/dashboard?error=github_oauth_failed', 302);
  }

  // Validate required parameters
  if (!code || !state) {
    console.error('[GitHub Callback] Missing code or state');
    return redirect('/dashboard?error=invalid_callback', 302);
  }

  // Verify user is authenticated
  const supabase = createSupabaseServer(cookies);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('[GitHub Callback] User not authenticated');
    return redirect('/login?error=authentication_required', 302);
  }

  // Verify state matches user ID (prevents CSRF)
  if (state !== user.id) {
    console.error('[GitHub Callback] State mismatch - possible CSRF');
    return redirect('/dashboard?error=invalid_state', 302);
  }

  // Check configuration
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    console.error('[GitHub Callback] GitHub OAuth not configured');
    return redirect('/dashboard?error=configuration_error', 302);
  }

  try {
    // Exchange code for access token
    console.log('[GitHub Callback] Exchanging code for token');
    const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[GitHub Callback] Token exchange failed:', errorText);
      return redirect('/dashboard?error=token_exchange_failed', 302);
    }

    const tokenData: GitHubTokenResponse = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('[GitHub Callback] No access token in response');
      return redirect('/dashboard?error=no_access_token', 302);
    }

    // Fetch GitHub user profile
    console.log('[GitHub Callback] Fetching GitHub user profile');
    const userResponse = await fetch(GITHUB_USER_API, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('[GitHub Callback] User fetch failed:', errorText);
      return redirect('/dashboard?error=user_fetch_failed', 302);
    }

    const githubUser: GitHubUser = await userResponse.json();

    // Encrypt the token
    console.log('[GitHub Callback] Encrypting token');
    const encryptedToken = encryptToken(tokenData.access_token);

    // Store in user_repos table
    console.log('[GitHub Callback] Storing repo info for user:', user.id);
    const { error: dbError } = await supabase.from('user_repos').upsert(
      {
        user_id: user.id,
        repo_url: '',
        repo_owner: githubUser.login,
        repo_name: '',
        github_token_encrypted: encryptedToken,
        default_branch: 'main',
        is_template_forked: false,
        updated_at: new Date().toISOString(),
      } as any, // Type assertion to work around Supabase generated types
      {
        onConflict: 'user_id',
      }
    );

    if (dbError) {
      console.error('[GitHub Callback] Database error:', dbError);
      return redirect('/dashboard?error=database_error', 302);
    }

    console.log('[GitHub Callback] Successfully connected GitHub account:', githubUser.login);

    // Redirect to projects page with success message
    return redirect('/projects?github_connected=true', 302);
  } catch (error) {
    console.error('[GitHub Callback] Unexpected error:', error);
    return redirect('/dashboard?error=unexpected_error', 302);
  }
};
