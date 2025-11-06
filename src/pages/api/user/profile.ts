/**
 * User Profile API Route
 *
 * Handles updating user profile information
 */

import type { APIRoute } from 'astro';
import { createSupabaseServer } from '../../../lib/supabaseServer';
import { apiError, checkRateLimit } from '../../../lib/apiUtils';

export const POST: APIRoute = async ({ request, cookies }) => {
  // Rate limiting: 10 profile updates per minute
  const rateLimitCheck = checkRateLimit(request, 10, 60000);
  if (rateLimitCheck) {
    return rateLimitCheck;
  }

  const supabase = createSupabaseServer(cookies);

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return apiError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  try {
    const body = await request.json();
    const { full_name, bio, username, avatar_url, is_public } = body;

    // Basic validation
    if (full_name && typeof full_name !== 'string') {
      return apiError('Invalid full_name', 400, 'INVALID_INPUT');
    }

    if (bio && typeof bio !== 'string') {
      return apiError('Invalid bio', 400, 'INVALID_INPUT');
    }

    if (username && typeof username !== 'string') {
      return apiError('Invalid username', 400, 'INVALID_INPUT');
    }

    if (full_name && full_name.length > 100) {
      return apiError('Full name is too long (max 100 characters)', 400, 'INVALID_INPUT');
    }

    if (bio && bio.length > 500) {
      return apiError('Bio is too long (max 500 characters)', 400, 'INVALID_INPUT');
    }

    if (username && (username.length < 3 || username.length > 30)) {
      return apiError('Username must be between 3 and 30 characters', 400, 'INVALID_INPUT');
    }

    // Validate username format (alphanumeric, underscores, hyphens only)
    if (username && !/^[a-zA-Z0-9_-]+$/.test(username)) {
      return apiError(
        'Username can only contain letters, numbers, underscores, and hyphens',
        400,
        'INVALID_INPUT'
      );
    }

    // Check if username is already taken (if username is being updated)
    if (username) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .neq('id', user.id)
        .single();

      if (existingUser) {
        return apiError('Username is already taken', 400, 'USERNAME_TAKEN');
      }
    }

    // Build update object
    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (bio !== undefined) updateData.bio = bio;
    if (username !== undefined) updateData.username = username;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (is_public !== undefined) updateData.is_public = is_public;

    // Update user profile in the users table
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('[Profile API] Update error:', error);
      return apiError('Failed to update profile', 500, 'UPDATE_FAILED');
    }

    return new Response(
      JSON.stringify({
        success: true,
        data,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[Profile API] Unexpected error:', error);
    return apiError('Internal server error', 500, 'INTERNAL_ERROR');
  }
};
