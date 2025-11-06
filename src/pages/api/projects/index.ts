/**
 * Projects API Route - List and Create
 *
 * GET - List user's projects
 * POST - Create new project
 */

import type { APIRoute } from 'astro';
import { createSupabaseServer } from '../../../lib/supabaseServer';
import { apiError, checkRateLimit } from '../../../lib/apiUtils';

// GET /api/projects - List user's projects
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
    const visibility = url.searchParams.get('visibility');
    const category = url.searchParams.get('category');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .eq('owner', user.id)
      .order('created_at', { ascending: false });

    // Apply filters
    if (visibility && ['public', 'private'].includes(visibility)) {
      query = query.eq('visibility', visibility);
    }

    if (category) {
      query = query.eq('category', category);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('[Projects API] List error:', error);
      return apiError('Failed to fetch projects', 500, 'FETCH_FAILED');
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
    console.error('[Projects API] Unexpected error:', error);
    return apiError('Internal server error', 500, 'INTERNAL_ERROR');
  }
};

// POST /api/projects - Create new project
export const POST: APIRoute = async ({ request, cookies }) => {
  // Rate limiting: 10 project creations per minute
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
    // Handle both JSON and form data
    const contentType = request.headers.get('content-type') || '';
    let name, description, category, visibility;

    if (contentType.includes('application/json')) {
      const body = await request.json();
      ({ name, description, category, visibility } = body);
    } else {
      // Handle form data
      const formData = await request.formData();
      name = formData.get('name')?.toString();
      description = formData.get('description')?.toString();
      category = formData.get('category')?.toString();
      visibility = formData.get('visibility')?.toString();
    }

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return apiError('Project name is required', 400, 'INVALID_INPUT');
    }

    if (name.length > 200) {
      return apiError('Project name is too long (max 200 characters)', 400, 'INVALID_INPUT');
    }

    if (description && description.length > 2000) {
      return apiError('Description is too long (max 2000 characters)', 400, 'INVALID_INPUT');
    }

    if (visibility && !['public', 'private'].includes(visibility)) {
      return apiError('Visibility must be either "public" or "private"', 400, 'INVALID_INPUT');
    }

    // Create project
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          owner: user.id,
          name: name.trim(),
          description: description?.trim() || null,
          category: category?.trim() || null,
          visibility: visibility || 'private',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[Projects API] Create error:', error);
      return apiError('Failed to create project', 500, 'CREATE_FAILED');
    }

    // If this was a form submission, redirect to projects page
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
      // Form submission - redirect to projects page
      return new Response(null, {
        status: 303,
        headers: {
          Location: '/projects',
        },
      });
    }
  } catch (error) {
    console.error('[Projects API] Unexpected error:', error);
    return apiError('Internal server error', 500, 'INTERNAL_ERROR');
  }
};
