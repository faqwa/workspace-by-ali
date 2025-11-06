/**
 * Global Middleware
 *
 * Handles authentication, route protection, and security headers
 * Supports owner (workspace deployer) and reader (guest) roles
 */

import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServer } from './lib/supabaseServer';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/',
  '/projects',
  '/api/projects',
  '/api/subprojects',
  '/api/submissions',
];

// Routes that require OWNER role (readers cannot access)
const OWNER_ONLY_ROUTES = [
  '/settings',
  '/keystatic',
  '/api/repo',
  '/api/publish',
];

// Routes that should redirect to /projects if already authenticated
const AUTH_ROUTES = ['/login', '/reader-signup'];

export const onRequest = defineMiddleware(async ({ cookies, url, redirect, locals }, next) => {
  // Create Supabase client
  const supabase = createSupabaseServer(cookies);

  // Get current user (secure - verifies with Supabase server)
  // DO NOT use getSession() - it's insecure and just reads cookies without verification
  const { data: { user }, error } = await supabase.auth.getUser();

  // Store user in locals for use in pages
  locals.user = user;
  locals.session = null; // We don't store session to avoid using insecure data

  // Get workspace owner info
  const { data: workspaceSettings } = await supabase
    .from('workspace_settings')
    .select('owner_id, allow_readers')
    .single();

  // Store workspace info in locals
  locals.workspaceOwnerId = workspaceSettings?.owner_id || null;
  locals.allowReaders = workspaceSettings?.allow_readers !== false; // Default true

  // Determine user role (if authenticated)
  if (user) {
    const isOwner = user.id === workspaceSettings?.owner_id;

    if (isOwner) {
      locals.userRole = 'owner';
    } else {
      // Check if user has reader role
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role, is_expert')
        .eq('user_id', user.id)
        .eq('workspace_owner_id', workspaceSettings?.owner_id)
        .single();

      if (userRole) {
        locals.userRole = userRole.role;
        locals.isExpert = userRole.is_expert;
      } else {
        locals.userRole = null;
      }
    }
  } else {
    locals.userRole = null;
  }

  const pathname = url.pathname;

  // Check if new user needs to complete onboarding
  // Skip if already on onboarding, login, or API routes
  const skipOnboardingCheck = pathname.startsWith('/onboarding') ||
                                pathname.startsWith('/setup') ||
                                pathname.startsWith('/login') ||
                                pathname.startsWith('/reader-signup') ||
                                pathname.startsWith('/api/') ||
                                pathname.startsWith('/_') || // Astro internal routes
                                !user; // Not authenticated

  if (!skipOnboardingCheck && user) {
    // OWNER: Must complete full setup (GitHub + repo fork)
    if (locals.userRole === 'owner') {
      const { data: userRepo } = await supabase
        .from('user_repos')
        .select('github_token_encrypted, is_template_forked')
        .eq('user_id', user.id)
        .single();

      const githubConnected = !!userRepo && !!userRepo.github_token_encrypted;
      const repoForked = !!userRepo && userRepo.is_template_forked;

      // Redirect to setup wizard if GitHub not connected or repo not forked
      if (!githubConnected || !repoForked) {
        return redirect('/setup', 302);
      }
    }
    // READER: No additional setup required (just auth)
    // Readers can access content immediately after signup
  }

  // If on auth routes (login, reader-signup) and already authenticated, redirect to projects
  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    if (user) {
      return redirect('/projects', 302);
    }
  }

  // Protect owner-only routes (readers cannot access)
  const isOwnerOnlyRoute = OWNER_ONLY_ROUTES.some(route => pathname.startsWith(route));

  if (isOwnerOnlyRoute) {
    if (!user) {
      // Not authenticated - redirect to login
      const redirectTo = encodeURIComponent(pathname + url.search);
      return redirect(`/login?redirect=${redirectTo}`, 302);
    } else if (locals.userRole !== 'owner') {
      // Authenticated but not owner - forbidden
      return new Response('Forbidden: Owner access required', { status: 403 });
    }
  }

  // Protect routes that require authentication (both owner and reader can access)
  // Check exact match for root, or startsWith for paths with subpaths
  const isProtected = pathname === '/' || PROTECTED_ROUTES.some(route => route !== '/' && pathname.startsWith(route));

  if (isProtected && !user) {
    // Store the original URL to redirect back after login
    const redirectTo = encodeURIComponent(pathname + url.search);
    return redirect(`/login?redirect=${redirectTo}`, 302);
  }

  // Add security headers to response
  const response = await next();

  // NOTE: Keystatic navigation injection doesn't work - see Known Issues in MASTER_TASKLIST.md
  // The keystatic() integration bypasses middleware, so this code never runs for /keystatic routes
  // Keeping it here for reference in case a solution is found

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // CSP for production
  if (import.meta.env.PROD) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
    );
  }

  return response;
});
