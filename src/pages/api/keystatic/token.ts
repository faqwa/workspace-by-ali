/**
 * Keystatic Token Proxy API
 *
 * Securely provides GitHub access tokens to Keystatic CMS
 * Used when Keystatic is in GitHub storage mode
 *
 * Security:
 * - Only returns token for authenticated user
 * - Tokens are encrypted at rest in database
 * - Tokens are decrypted server-side only
 * - No token logging or caching
 *
 * Endpoint: GET /api/keystatic/token
 */

import type { APIRoute } from 'astro';
import { createServerSupabaseClient } from '../../../lib/supabaseServer';
import { decryptToken } from '../../../lib/tokenEncryption';

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    // 1. Authenticate user
    const supabase = createServerSupabaseClient(cookies);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Please log in' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 2. Fetch user's GitHub token from database
    const { data: userRepo, error: dbError } = await supabase
      .from('user_repos')
      .select('github_token_encrypted, repo_owner, repo_name')
      .eq('user_id', user.id)
      .single();

    if (dbError || !userRepo) {
      console.error('[Token Proxy] Database error:', dbError);
      return new Response(
        JSON.stringify({
          error: 'GitHub not connected',
          message: 'Please connect your GitHub account in settings',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!userRepo.github_token_encrypted) {
      return new Response(
        JSON.stringify({
          error: 'No GitHub token found',
          message: 'Please reconnect your GitHub account',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 3. Decrypt token
    let decryptedToken: string;
    try {
      decryptedToken = decryptToken(userRepo.github_token_encrypted);
    } catch (decryptError) {
      console.error('[Token Proxy] Decryption failed:', decryptError);
      return new Response(
        JSON.stringify({
          error: 'Token decryption failed',
          message: 'Please reconnect your GitHub account',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 4. Return token to Keystatic
    // Also return repo info so Keystatic knows which repo to use
    return new Response(
      JSON.stringify({
        token: decryptedToken,
        repo: {
          owner: userRepo.repo_owner,
          name: userRepo.repo_name,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // Important: Don't cache tokens
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('[Token Proxy] Unexpected error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
