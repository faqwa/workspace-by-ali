/**
 * Projects API Route - Individual Project Operations
 *
 * GET - Get project details
 * PUT - Update project
 * DELETE - Delete project
 */

import type { APIRoute } from 'astro';
import { createSupabaseServer } from '../../../lib/supabaseServer';
import { apiError, checkRateLimit } from '../../../lib/apiUtils';

// GET /api/projects/[id] - Get project details
export const GET: APIRoute = async ({ params, cookies }) => {
  const supabase = createSupabaseServer(cookies);

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return apiError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const { id } = params;

  if (!id) {
    return apiError('Project ID is required', 400, 'INVALID_INPUT');
  }

  try {
    // Fetch project
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return apiError('Project not found', 404, 'NOT_FOUND');
      }
      console.error('[Projects API] Get error:', error);
      return apiError('Failed to fetch project', 500, 'FETCH_FAILED');
    }

    // Check if user has access to this project
    // User can access if they own it OR if it's public
    if (data.owner !== user.id && data.visibility !== 'public') {
      return apiError('Access denied', 403, 'FORBIDDEN');
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
    console.error('[Projects API] Unexpected error:', error);
    return apiError('Internal server error', 500, 'INTERNAL_ERROR');
  }
};

// PUT /api/projects/[id] - Update project
export const PUT: APIRoute = async ({ params, request, cookies }) => {
  // Rate limiting: 20 project updates per minute
  const rateLimitCheck = checkRateLimit(request, 20, 60000);
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

  const { id } = params;

  if (!id) {
    return apiError('Project ID is required', 400, 'INVALID_INPUT');
  }

  try {
    const body = await request.json();
    const { name, description, category, visibility } = body;

    // Validation
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return apiError('Project name cannot be empty', 400, 'INVALID_INPUT');
      }
      if (name.length > 200) {
        return apiError('Project name is too long (max 200 characters)', 400, 'INVALID_INPUT');
      }
    }

    if (description !== undefined && description && description.length > 2000) {
      return apiError('Description is too long (max 2000 characters)', 400, 'INVALID_INPUT');
    }

    if (visibility !== undefined && !['public', 'private'].includes(visibility)) {
      return apiError('Visibility must be either "public" or "private"', 400, 'INVALID_INPUT');
    }

    // Build update object
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (category !== undefined) updateData.category = category?.trim() || null;
    if (visibility !== undefined) updateData.visibility = visibility;

    // Update project (RLS ensures only owner can update)
    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .eq('owner', user.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return apiError('Project not found or access denied', 404, 'NOT_FOUND');
      }
      console.error('[Projects API] Update error:', error);
      return apiError('Failed to update project', 500, 'UPDATE_FAILED');
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
    console.error('[Projects API] Unexpected error:', error);
    return apiError('Internal server error', 500, 'INTERNAL_ERROR');
  }
};

// DELETE /api/projects/[id] - Delete project
export const DELETE: APIRoute = async ({ params, cookies, request }) => {
  // Rate limiting: 10 project deletions per minute
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

  const { id } = params;

  if (!id) {
    return apiError('Project ID is required', 400, 'INVALID_INPUT');
  }

  try {
    // Delete project (RLS ensures only owner can delete)
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('owner', user.id);

    if (error) {
      console.error('[Projects API] Delete error:', error);
      return apiError('Failed to delete project', 500, 'DELETE_FAILED');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Project deleted successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[Projects API] Unexpected error:', error);
    return apiError('Internal server error', 500, 'INTERNAL_ERROR');
  }
};
