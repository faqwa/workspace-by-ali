/**
 * Updates/Activities API Route - Individual Activity Operations
 *
 * GET - Get activity details
 * PUT - Update activity
 * DELETE - Delete activity
 */

import type { APIRoute } from 'astro';
import { createSupabaseServer } from '../../../lib/supabaseServer';
import { apiError, checkRateLimit } from '../../../lib/apiUtils';

// GET /api/updates/[id] - Get activity details
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
    return apiError('Activity ID is required', 400, 'INVALID_INPUT');
  }

  try {
    // Fetch activity
    const { data, error } = await supabase
      .from('activities')
      .select('*, projects(name)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return apiError('Activity not found', 404, 'NOT_FOUND');
      }
      console.error('[Updates API] Get error:', error);
      return apiError('Failed to fetch activity', 500, 'FETCH_FAILED');
    }

    // Check if user has access to this activity
    if (data.user_id !== user.id) {
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
    console.error('[Updates API] Unexpected error:', error);
    return apiError('Internal server error', 500, 'INTERNAL_ERROR');
  }
};

// PUT /api/updates/[id] - Update activity
export const PUT: APIRoute = async ({ params, request, cookies }) => {
  // Rate limiting: 20 activity updates per minute
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
    return apiError('Activity ID is required', 400, 'INVALID_INPUT');
  }

  try {
    const body = await request.json();
    const { title, content, type, project_id, metadata } = body;

    // Validation
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return apiError('Title cannot be empty', 400, 'INVALID_INPUT');
      }
      if (title.length > 200) {
        return apiError('Title is too long (max 200 characters)', 400, 'INVALID_INPUT');
      }
    }

    if (content !== undefined && content && content.length > 5000) {
      return apiError('Content is too long (max 5000 characters)', 400, 'INVALID_INPUT');
    }

    if (type !== undefined && !['project', 'update', 'stream'].includes(type)) {
      return apiError('Type must be one of: project, update, stream', 400, 'INVALID_INPUT');
    }

    // If project_id is being updated, verify it exists and user owns it
    if (project_id !== undefined && project_id !== null) {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', project_id)
        .eq('owner', user.id)
        .single();

      if (projectError || !project) {
        return apiError('Invalid project ID or access denied', 400, 'INVALID_PROJECT');
      }
    }

    // Build update object
    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content?.trim() || null;
    if (type !== undefined) updateData.type = type;
    if (project_id !== undefined) updateData.project_id = project_id;
    if (metadata !== undefined) updateData.metadata = metadata;

    // Update activity
    const { data, error } = await supabase
      .from('activities')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return apiError('Activity not found or access denied', 404, 'NOT_FOUND');
      }
      console.error('[Updates API] Update error:', error);
      return apiError('Failed to update activity', 500, 'UPDATE_FAILED');
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
    console.error('[Updates API] Unexpected error:', error);
    return apiError('Internal server error', 500, 'INTERNAL_ERROR');
  }
};

// DELETE /api/updates/[id] - Delete activity
export const DELETE: APIRoute = async ({ params, cookies, request }) => {
  // Rate limiting: 10 activity deletions per minute
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
    return apiError('Activity ID is required', 400, 'INVALID_INPUT');
  }

  try {
    // Delete activity
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('[Updates API] Delete error:', error);
      return apiError('Failed to delete activity', 500, 'DELETE_FAILED');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Activity deleted successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[Updates API] Unexpected error:', error);
    return apiError('Internal server error', 500, 'INTERNAL_ERROR');
  }
};
