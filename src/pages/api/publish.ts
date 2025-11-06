/**
 * Publish API Endpoint
 *
 * Merges draft branch into main branch to publish content
 *
 * Flow:
 * 1. Verify user is authenticated
 * 2. Get user's GitHub token
 * 3. Use Octokit to merge draft → main
 * 4. Handle merge conflicts if any
 * 5. Return success/error status
 */

import type { APIRoute } from 'astro';
import { Octokit } from 'octokit';
import { createSupabaseServer } from '../../lib/supabaseServer';
import { decryptToken } from '../../lib/tokenEncryption';
import { apiError } from '../../lib/apiUtils';

export const POST: APIRoute = async ({ cookies }) => {
  // Verify user is authenticated
  const supabase = createSupabaseServer(cookies);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return apiError('Authentication required', 401, 'UNAUTHORIZED');
  }

  try {
    // Get user's repo info and GitHub token
    const { data: userRepo, error: repoError } = await supabase
      .from('user_repos')
      .select('github_token_encrypted, repo_owner, repo_name, is_template_forked')
      .eq('user_id', user.id)
      .single();

    if (repoError || !userRepo) {
      console.error('[Publish API] No repo found for user:', user.id);
      return apiError('No workspace repository found', 400, 'NO_REPO');
    }

    if (!userRepo.is_template_forked) {
      return apiError('Workspace not initialized', 400, 'NOT_FORKED');
    }

    // Decrypt GitHub token
    const githubToken = decryptToken(userRepo.github_token_encrypted);
    const octokit = new Octokit({ auth: githubToken });

    console.log('[Publish API] Publishing changes for:', userRepo.repo_owner, userRepo.repo_name);

    // Merge draft → main
    try {
      const { data: merge } = await octokit.rest.repos.merge({
        owner: userRepo.repo_owner,
        repo: userRepo.repo_name,
        base: 'main',
        head: 'draft',
        commit_message: 'Publish draft changes to main',
      });

      console.log('[Publish API] Successfully merged draft → main');

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Changes published successfully',
          commit_sha: merge.sha,
          merge_commit: merge.html_url,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (mergeError: any) {
      // Handle specific merge scenarios
      if (mergeError.status === 204) {
        // Already up to date
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Already up to date - no changes to publish',
            up_to_date: true,
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      if (mergeError.status === 409) {
        // Merge conflict
        console.error('[Publish API] Merge conflict detected');
        return apiError(
          'Merge conflict detected. Please resolve conflicts in GitHub.',
          409,
          'MERGE_CONFLICT'
        );
      }

      if (mergeError.status === 404) {
        // Branch not found
        return apiError(
          'Draft or main branch not found',
          404,
          'BRANCH_NOT_FOUND'
        );
      }

      throw mergeError;
    }
  } catch (error: any) {
    console.error('[Publish API] Error:', error);
    return apiError(
      error.message || 'Failed to publish changes',
      500,
      'PUBLISH_ERROR'
    );
  }
};

/**
 * GET - Check publish status
 *
 * Returns information about draft vs main branches
 */
export const GET: APIRoute = async ({ cookies }) => {
  // Verify user is authenticated
  const supabase = createSupabaseServer(cookies);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return apiError('Authentication required', 401, 'UNAUTHORIZED');
  }

  try {
    // Get user's repo info
    const { data: userRepo, error: repoError } = await supabase
      .from('user_repos')
      .select('github_token_encrypted, repo_owner, repo_name, repo_url, is_template_forked')
      .eq('user_id', user.id)
      .single();

    if (repoError || !userRepo) {
      return new Response(
        JSON.stringify({
          success: false,
          has_repo: false,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!userRepo.is_template_forked) {
      return new Response(
        JSON.stringify({
          success: true,
          has_repo: true,
          forked: false,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Decrypt token and check branch status
    const githubToken = decryptToken(userRepo.github_token_encrypted);
    const octokit = new Octokit({ auth: githubToken });

    // Compare draft and main branches
    const { data: comparison } = await octokit.rest.repos.compareCommitsWithBasehead({
      owner: userRepo.repo_owner,
      repo: userRepo.repo_name,
      basehead: 'main...draft',
    });

    const hasUnpublishedChanges = comparison.ahead_by > 0;
    const isBehind = comparison.behind_by > 0;

    return new Response(
      JSON.stringify({
        success: true,
        has_repo: true,
        forked: true,
        repo_url: userRepo.repo_url,
        repo_name: userRepo.repo_name,
        has_unpublished_changes: hasUnpublishedChanges,
        commits_ahead: comparison.ahead_by,
        commits_behind: comparison.behind_by,
        needs_sync: isBehind,
        compare_url: `${userRepo.repo_url}/compare/main...draft`,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('[Publish API] Status check error:', error);
    return apiError(
      error.message || 'Failed to check publish status',
      500,
      'STATUS_ERROR'
    );
  }
};
