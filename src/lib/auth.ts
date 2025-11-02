/**
 * Authentication Utilities
 *
 * Server-side helper functions for user management
 * Auth flows are handled by API routes, not client-side
 */

import type { User } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: 'user' | 'reviewer' | 'admin';
  created_at: string;
  last_signin: string | null;
}

/**
 * Get user profile from the database
 * Use this on the server with createSupabaseServer()
 */
export async function getUserProfile(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Update user profile
 * Use this on the server with createSupabaseServer()
 */
export async function updateUserProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
  updates: Partial<UserProfile>
) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

  return data;
}

/**
 * Create or update user profile after auth
 * Called by API routes after successful authentication
 */
export async function upsertUserProfile(
  supabase: SupabaseClient<Database>,
  user: User
) {
  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        last_signin: new Date().toISOString(),
      },
      {
        onConflict: 'id',
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Error upserting user profile:', error);
    throw error;
  }

  return data;
}

/**
 * Check if user has a specific role
 * Use this on the server with createSupabaseServer()
 */
export async function hasRole(
  supabase: SupabaseClient<Database>,
  userId: string,
  role: 'user' | 'reviewer' | 'admin'
): Promise<boolean> {
  const profile = await getUserProfile(supabase, userId);

  if (!profile) return false;

  // Admins have all permissions
  if (profile.role === 'admin') return true;

  // Reviewers have user permissions
  if (role === 'user' && profile.role === 'reviewer') return true;

  return profile.role === role;
}
