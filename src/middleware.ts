/**
 * Global Middleware
 *
 * Handles authentication, route protection, and security headers
 */

import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServer } from './lib/supabaseServer';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/',
  '/projects',
  '/api/projects',
  '/api/streams',
  '/api/submissions',
];

// Routes that should redirect to /projects if already authenticated
const AUTH_ROUTES = ['/login'];

export const onRequest = defineMiddleware(async ({ cookies, url, redirect, locals }, next) => {
  // Create Supabase client
  const supabase = createSupabaseServer(cookies);

  // Get current user (secure - verifies with Supabase server)
  // DO NOT use getSession() - it's insecure and just reads cookies without verification
  const { data: { user }, error } = await supabase.auth.getUser();

  // Store user in locals for use in pages
  locals.user = user;
  locals.session = null; // We don't store session to avoid using insecure data

  const pathname = url.pathname;

  // If on auth routes (login) and already authenticated, redirect to projects
  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    if (user) {
      return redirect('/projects', 302);
    }
  }

  // Protect routes that require authentication
  // Check exact match for root, or startsWith for paths with subpaths
  const isProtected = pathname === '/' || PROTECTED_ROUTES.some(route => route !== '/' && pathname.startsWith(route));

  if (isProtected && !user) {
    // Store the original URL to redirect back after login
    const redirectTo = encodeURIComponent(pathname + url.search);
    return redirect(`/login?redirect=${redirectTo}`, 302);
  }

  // Add security headers to response
  const response = await next();

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
