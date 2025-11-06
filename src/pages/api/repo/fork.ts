/**
 * Repository Fork API Route
 *
 * Creates a new repository from the workspace template for a user
 *
 * Flow:
 * 1. Verify user is authenticated
 * 2. Check if user has GitHub token
 * 3. Fork template repo using GitHub API
 * 4. Create draft branch
 * 5. Update user_repos with new repo info
 * 6. Return repo URL
 *
 * Reference: docs/implementation/01_Phase1_Git_First_MVP.md (Task 1.1.4)
 */

import type { APIRoute } from 'astro';
import { Octokit } from 'octokit';
import { createSupabaseServer } from '../../../lib/supabaseServer';
import { decryptToken } from '../../../lib/tokenEncryption';
import { apiError, checkRateLimit } from '../../../lib/apiUtils';

// Template repository configuration
const TEMPLATE_OWNER = 'writingsbyali-hub';
const TEMPLATE_REPO = 'workspace-by-ali-template';

interface ForkResponse {
  success: boolean;
  repo_url?: string;
  repo_name?: string;
  repo_owner?: string;
  error?: string;
}

/**
 * POST - Fork template repository for user
 *
 * Creates a new repository from template and sets up branches
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  // Rate limiting: 1 fork per minute per user
  const rateLimitCheck = checkRateLimit(request, 1, 60000);
  if (rateLimitCheck) {
    return rateLimitCheck;
  }

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
    // Get user's GitHub token from database
    console.log('[Fork API] Fetching GitHub token for user:', user.id);
    const { data: userRepo, error: repoError } = await supabase
      .from('user_repos')
      .select('github_token_encrypted, repo_owner, is_template_forked')
      .eq('user_id', user.id)
      .single();

    if (repoError || !userRepo) {
      console.error('[Fork API] No GitHub connection found:', repoError);
      return apiError('GitHub account not connected', 400, 'NO_GITHUB_CONNECTION');
    }

    // Check if user has already forked
    if (userRepo.is_template_forked) {
      console.log('[Fork API] User has already forked template');
      return apiError('Template already forked', 400, 'ALREADY_FORKED');
    }

    // Decrypt GitHub token
    console.log('[Fork API] Decrypting GitHub token');
    const githubToken = decryptToken(userRepo.github_token_encrypted);

    // Initialize Octokit with user's token
    const octokit = new Octokit({ auth: githubToken });

    // Generate repo name (user's personal workspace)
    const repoName = `workspace-${userRepo.repo_owner}`;

    console.log('[Fork API] Creating repository from template:', repoName);

    // Create repo from template using GitHub API
    const { data: newRepo } = await octokit.rest.repos.createUsingTemplate({
      template_owner: TEMPLATE_OWNER,
      template_repo: TEMPLATE_REPO,
      owner: userRepo.repo_owner,
      name: repoName,
      description: `Personal workspace powered by Workspace by Ali`,
      include_all_branches: true, // This will include both main and draft branches
      private: false, // Public by default
    });

    console.log('[Fork API] Repository created:', newRepo.html_url);

    // Wait a moment for GitHub to finish repository setup
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Verify branches exist (main and draft should be copied from template)
    console.log('[Fork API] Verifying branches');
    try {
      const { data: branches } = await octokit.rest.repos.listBranches({
        owner: userRepo.repo_owner,
        repo: repoName,
      });

      const branchNames = branches.map((b) => b.name);
      console.log('[Fork API] Available branches:', branchNames);

      // Create draft branch if it doesn't exist
      if (!branchNames.includes('draft')) {
        console.log('[Fork API] Creating draft branch');
        const { data: mainBranch } = await octokit.rest.repos.getBranch({
          owner: userRepo.repo_owner,
          repo: repoName,
          branch: 'main',
        });

        await octokit.rest.git.createRef({
          owner: userRepo.repo_owner,
          repo: repoName,
          ref: 'refs/heads/draft',
          sha: mainBranch.commit.sha,
        });
      }
    } catch (branchError) {
      console.warn('[Fork API] Branch verification/creation warning:', branchError);
      // Non-fatal - continue with repo creation
    }

    // Update user_repos table with new repo info
    console.log('[Fork API] Updating database with repo info');
    const { error: updateError } = await supabase
      .from('user_repos')
      .update({
        repo_url: newRepo.html_url,
        repo_name: repoName,
        is_template_forked: true,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('[Fork API] Database update error:', updateError);
      // Repo is created but DB not updated - not fatal
      console.warn('[Fork API] Repository created but database not updated');
    }

    console.log('[Fork API] Successfully forked template for user:', user.id);

    // Return success with repo info
    return new Response(
      JSON.stringify({
        success: true,
        repo_url: newRepo.html_url,
        repo_name: repoName,
        repo_owner: userRepo.repo_owner,
        message: 'Repository created successfully!',
      } as ForkResponse),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('[Fork API] Error forking repository:', error);

    // Handle specific GitHub API errors
    if (error.status === 422) {
      return apiError('Repository name already exists', 400, 'REPO_EXISTS');
    }

    if (error.status === 403) {
      return apiError('GitHub token lacks required permissions', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    if (error.status === 404) {
      return apiError('Template repository not found', 404, 'TEMPLATE_NOT_FOUND');
    }

    return apiError(
      error.message || 'Failed to create repository',
      500,
      'FORK_ERROR'
    );
  }
};

/**
 * GET - Check fork status
 *
 * Returns whether user has already forked the template
 */
export const GET: APIRoute = async ({ request, cookies }) => {
  // Verify user is authenticated
  const supabase = createSupabaseServer(cookies);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return apiError('Authentication required', 401, 'UNAUTHORIZED');
  }

  // Check user's fork status
  const { data: userRepo, error: repoError } = await supabase
    .from('user_repos')
    .select('is_template_forked, repo_url, repo_name, repo_owner')
    .eq('user_id', user.id)
    .single();

  if (repoError || !userRepo) {
    return new Response(
      JSON.stringify({
        success: true,
        forked: false,
        github_connected: false,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      forked: userRepo.is_template_forked,
      github_connected: !!userRepo.github_token_encrypted,
      repo_url: userRepo.repo_url,
      repo_name: userRepo.repo_name,
      repo_owner: userRepo.repo_owner,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
