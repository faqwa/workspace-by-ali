/**
 * Updates/Activities API Route - List and Create
 *
 * GET - List user's activities
 * POST - Create new activity/update
 */

import type { APIRoute } from 'astro';
import { createSupabaseServer } from '../../../lib/supabaseServer';
import { apiError, checkRateLimit } from '../../../lib/apiUtils';

// GET /api/updates - List user's activities
export const GET: APIRoute = async ({ url, cookies }) => {
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
    // Get query parameters
    const type = url.searchParams.get('type'); // project, update, subproject
    const projectId = url.searchParams.get('project_id');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('activities')
      .select('*, projects(name)', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false});

    // Apply filters
    if (type && ['project', 'update', 'subproject'].includes(type)) {
      query = query.eq('type', type);
    }

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('[Updates API] List error:', error);
      return apiError('Failed to fetch activities', 500, 'FETCH_FAILED');
    }

    return new Response(
      JSON.stringify({
        success: true,
        data,
        pagination: {
          total: count || 0,
          limit,
          offset,
        },
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

// POST /api/updates - Create new activity/update
export const POST: APIRoute = async ({ request, cookies }) => {
  // Rate limiting: 20 updates per minute
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

  try {
    // Handle both JSON and form data
    const contentType = request.headers.get('content-type') || '';
    let title, content, type, project_id, metadata;

    if (contentType.includes('application/json')) {
      const body = await request.json();
      ({ title, content, type, project_id, metadata } = body);
    } else {
      // Handle form data
      const formData = await request.formData();
      title = formData.get('title')?.toString();
      content = formData.get('content')?.toString();
      type = formData.get('type')?.toString();
      const projectIdValue = formData.get('project_id')?.toString();
      project_id = projectIdValue && projectIdValue.trim() !== '' ? projectIdValue : null;
      metadata = null; // Form doesn't send metadata
    }

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return apiError('Title is required', 400, 'INVALID_INPUT');
    }

    if (title.length > 200) {
      return apiError('Title is too long (max 200 characters)', 400, 'INVALID_INPUT');
    }

    if (content && content.length > 5000) {
      return apiError('Content is too long (max 5000 characters)', 400, 'INVALID_INPUT');
    }

    if (!type || !['project', 'update', 'subproject'].includes(type)) {
      return apiError('Type must be one of: project, update, subproject', 400, 'INVALID_INPUT');
    }

    // If project_id is provided, verify it exists and user owns it
    if (project_id) {
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

    // Create activity
    const { data, error } = await supabase
      .from('activities')
      .insert([
        {
          user_id: user.id,
          title: title.trim(),
          content: content?.trim() || null,
          type,
          project_id: project_id || null,
          metadata: metadata || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[Updates API] Create error:', error);
      return apiError('Failed to create activity', 500, 'CREATE_FAILED');
    }

    // If this was a form submission, redirect to updates page
    // Otherwise return JSON for API calls
    if (contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({
          success: true,
          data,
        }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      // Form submission - redirect to updates page
      return new Response(null, {
        status: 303,
        headers: {
          Location: '/updates',
        },
      });
    }
  } catch (error) {
    console.error('[Updates API] Unexpected error:', error);
    return apiError('Internal server error', 500, 'INTERNAL_ERROR');
  }
};
