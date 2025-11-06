import type { APIRoute } from 'astro';
import { createSupabaseServer } from '../../../lib/supabaseServer';

/**
 * POST /api/workspace/configure
 *
 * Configure workspace settings for owner
 * This endpoint is called during setup wizard (Step 4)
 *
 * Body:
 * - workspace_name: string
 * - repo_visibility: 'public' | 'private'
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServer(cookies);

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized', message: 'You must be logged in' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Verify user is owner
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!userRole || userRole.role !== 'owner') {
    return new Response(
      JSON.stringify({ success: false, error: 'Forbidden', message: 'Only owners can configure workspace' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { workspace_name, repo_visibility } = body;

    // Validate input
    if (!workspace_name || workspace_name.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Validation Error', message: 'Workspace name is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!['public', 'private'].includes(repo_visibility)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Validation Error', message: 'Invalid repo visibility' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if workspace_settings already exists
    const { data: existingSettings } = await supabase
      .from('workspace_settings')
      .select('*')
      .eq('owner_id', user.id)
      .single();

    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from('workspace_settings')
        .update({
          workspace_name,
          repo_visibility,
          setup_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('owner_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('[workspace/configure] Error updating settings:', error);
        return new Response(
          JSON.stringify({ success: false, error: 'Database Error', message: error.message }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Workspace settings updated',
          settings: data,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from('workspace_settings')
        .insert({
          owner_id: user.id,
          workspace_name,
          repo_visibility,
          setup_completed: true,
          reader_signup_enabled: false, // Default to disabled (Phase 2 feature)
          readers_can_suggest: false, // Default to disabled (Phase 2 feature)
        })
        .select()
        .single();

      if (error) {
        console.error('[workspace/configure] Error creating settings:', error);
        return new Response(
          JSON.stringify({ success: false, error: 'Database Error', message: error.message }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Workspace configured successfully',
          settings: data,
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('[workspace/configure] Unexpected error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Server Error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
