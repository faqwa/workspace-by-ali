# Authentication & Security Architecture

**Last Updated:** 2025-10-31
**Status:** ✅ Production-Ready & Fully Working

---

## 🎉 Recent Updates (Oct 31, 2025)

**Critical Security Fix Applied:**
- Middleware now uses `getUser()` instead of insecure `getSession()`
- RLS policies fixed (removed infinite recursion)
- Middleware activation requires server restart
- Auth flow now 100% functional with avatar display

---

## Overview

This document describes the authentication and security implementation for Workspace. We use **Supabase Auth** with **PKCE OAuth flow** and **server-side session management** for maximum security.

**IMPORTANT:** Always use `supabase.auth.getUser()` for session validation, never `getSession()`. The latter only reads cookies without server verification and is insecure.

## Architecture Principles

### 1. **Server-First Authentication**
- All auth operations happen server-side via API routes
- No client-side OAuth or token handling
- Middleware protects routes automatically
- Session stored in secure HTTP-only cookies

### 2. **PKCE OAuth Flow**
- Uses Proof Key for Code Exchange (PKCE) for OAuth
- Most secure OAuth flow available
- Prevents authorization code interception attacks
- Code exchange happens server-side only

### 3. **Defense in Depth**
- Multiple security layers (middleware, rate limiting, security headers)
- Standardized error handling
- Input validation on all endpoints
- Rate limiting on auth endpoints

---

## File Structure

### Core Files

```
src/
├── middleware.ts                    # Route protection & security headers
├── lib/
│   ├── supabase.ts                  # Client-side Supabase (public queries only)
│   ├── supabaseServer.ts            # Server-side Supabase with cookie handling
│   ├── auth.ts                      # Auth helper functions (server-side)
│   └── apiUtils.ts                  # API utilities (errors, rate limiting)
└── pages/
    ├── login.astro                  # Login page
    └── api/auth/
        ├── signin.ts                # POST - Initiates OAuth/magic link
        ├── callback.ts              # GET - Handles OAuth callback
        └── signout.ts               # POST - Signs user out
```

---

## Authentication Flows

### GitHub OAuth Flow

```
1. User clicks "Continue with GitHub"
   └─> Form POST to /api/auth/signin with provider=github

2. API creates OAuth URL with Supabase
   └─> Redirects user to GitHub

3. User authorizes on GitHub
   └─> GitHub redirects to Supabase

4. Supabase redirects to /api/auth/callback with code

5. API exchanges code for session (PKCE)
   └─> Session tokens stored in HTTP-only cookies
   └─> User profile created/updated in database

6. Redirects to /projects
   └─> User is authenticated
```

### Magic Link Flow

```
1. User enters email and submits form
   └─> AJAX POST to /api/auth/signin

2. API sends magic link email via Supabase
   └─> Returns success message

3. User clicks link in email
   └─> Redirects to /api/auth/callback with token

4. API establishes session
   └─> Session stored in cookies
   └─> User profile created/updated

5. Redirects to /projects
   └─> User is authenticated
```

### Sign Out Flow

```
1. User clicks avatar → confirms sign out
   └─> Form POST to /api/auth/signout

2. API clears session in Supabase
   └─> Cookies deleted

3. Redirects to home page
   └─> User is signed out
```

---

## Security Features

### ⚠️ CRITICAL: getUser() vs getSession()

**Always use `getUser()` for authentication validation, NEVER `getSession()`!**

```typescript
// ✅ CORRECT - Secure validation
const { data: { user } } = await supabase.auth.getUser();

// ❌ WRONG - Insecure, only reads cookies
const { data: { session } } = await supabase.auth.getSession();
```

**Why this matters:**
- `getSession()` only reads from cookies without verification
- Cookies can be tampered with or forged
- `getUser()` contacts Supabase server to verify the session is valid
- This is explicitly documented in Supabase security guidelines

**Where we use it:**
- Middleware: `src/middleware.ts` line 28
- API routes: All auth endpoints
- Server-side pages: When manually checking auth

**The Bug We Fixed (Oct 31):**
Original middleware used `getSession()` which caused the avatar not to appear because the user object wasn't being properly validated. Switching to `getUser()` fixed this.

### 1. Middleware Protection

**File:** `src/middleware.ts`

- Runs on every request
- Checks session from cookies
- Protects routes automatically
- Adds security headers to responses

**Protected Routes:**
- `/projects/*`
- `/dashboard/*`
- `/api/projects/*`
- `/api/streams/*`
- `/api/submissions/*`

**Auto-redirect Routes:**
- `/login` → redirects to `/projects` if already authenticated

### 2. Security Headers

All responses include:
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Limits referrer info
- `Permissions-Policy` - Disables unnecessary browser features
- `Content-Security-Policy` (production only) - Prevents XSS

### 3. Rate Limiting

**Implementation:** In-memory rate limiter (production should use Redis)

**Limits:**
- **Sign in:** 5 attempts per minute per IP
- **Magic link:** 5 attempts per minute per IP
- Returns 429 status when exceeded

**Future:** Replace with Redis for distributed systems

### 4. Input Validation

All API routes validate:
- Required fields are present
- Email format is valid
- Provider is allowed (github, google only)
- Data types are correct

### 5. Error Handling

**Standardized API Responses:**
```typescript
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

**Error Codes:**
- `UNAUTHORIZED` - Not authenticated
- `FORBIDDEN` - Not authorized
- `RATE_LIMITED` - Too many requests
- `INVALID_PROVIDER` - Unsupported OAuth provider
- `INVALID_EMAIL` - Bad email format
- `SIGNOUT_ERROR` - Sign out failed

---

## Session Management

### Cookie Configuration

**Set in:** `src/lib/supabaseServer.ts`

```typescript
{
  path: '/',
  sameSite: 'lax',      // Allows OAuth redirects
  secure: prod,         // HTTPS only in production
  httpOnly: true        // Not accessible via JavaScript
}
```

### Session Duration

- **Access tokens:** Expire after ~1 hour
- **Refresh tokens:** Not auto-refreshed (security choice)
- **Behavior:** Users must re-authenticate after expiry
- **Rationale:** Shorter sessions = better security for MVP

**Future Enhancement:** Implement automatic token refresh for better UX

### Accessing Session

**In Pages (Astro):**
```typescript
// Middleware provides these
const user = Astro.locals.user;
const session = Astro.locals.session;
```

**In API Routes:**
```typescript
const supabase = createSupabaseServer(cookies);
const { data: { user } } = await supabase.auth.getUser();
```

---

## Code Usage Patterns

### ✅ Correct Usage

**Server-side (Astro pages):**
```typescript
---
// User from middleware
const user = Astro.locals.user;

// If you need to query user data
import { createSupabaseServer } from '../lib/supabaseServer';
import { getUserProfile } from '../lib/auth';

const supabase = createSupabaseServer(Astro.cookies);
const profile = await getUserProfile(supabase, user.id);
---
```

**API Routes:**
```typescript
import { createSupabaseServer } from '../lib/supabaseServer';
import { apiSuccess, apiError } from '../lib/apiUtils';

export const POST: APIRoute = async ({ cookies }) => {
  const supabase = createSupabaseServer(cookies);

  try {
    // Your logic here
    return apiSuccess(data);
  } catch (error) {
    return apiError('Error message', 500);
  }
};
```

### ❌ Incorrect Usage

**Don't use client-side auth:**
```typescript
// ❌ WRONG - Don't do auth client-side
import { supabase } from '../lib/supabase';
await supabase.auth.signInWithOAuth(...);
```

**Don't manually check auth in pages:**
```typescript
// ❌ WRONG - Middleware handles this
const supabase = createSupabaseServer(Astro.cookies);
if (!user) return Astro.redirect('/login');
```

---

## Future Enhancements

### Short Term (Phase 2)
- [ ] Add CSRF protection to forms
- [ ] Implement token auto-refresh
- [ ] Add session management UI (view/revoke sessions)
- [ ] Add audit logging for auth events

### Medium Term (Phase 3)
- [ ] Replace in-memory rate limiter with Redis
- [ ] Add 2FA/MFA support
- [ ] Add "Remember Me" functionality
- [ ] Add password reset flow

### Long Term (Phase 4+)
- [ ] Add OAuth with more providers (Discord, Twitter)
- [ ] Add SSO/SAML for enterprise
- [ ] Add advanced security monitoring
- [ ] Add device fingerprinting

---

## Troubleshooting

### User Can't Sign In

**Check:**
1. Supabase GitHub OAuth is configured
2. Callback URL in GitHub app matches: `https://[project].supabase.co/auth/v1/callback`
3. Site URL in Supabase matches your domain
4. Redirect URLs include your callback: `https://[domain]/api/auth/callback`

### Session Not Persisting

**Check:**
1. Cookies are being set (check browser DevTools)
2. HTTPS is enabled in production (required for secure cookies)
3. `sameSite` is `lax` not `strict`
4. Cookie domain matches your site

### Rate Limited

**Solution:**
- Wait 1 minute
- In development, restart server to clear rate limit cache
- In production, implement Redis-based rate limiting

---

## Security Checklist

### Pre-Launch
- [x] HTTPS enabled in production
- [x] Security headers configured
- [x] Rate limiting on auth endpoints
- [x] Input validation on all endpoints
- [x] Error messages don't leak sensitive info
- [x] Session cookies are HTTP-only and secure
- [x] PKCE flow for OAuth
- [ ] CSRF protection (needs UI work)
- [ ] Security audit performed

### Post-Launch Monitoring
- [ ] Monitor failed login attempts
- [ ] Track unusual auth patterns
- [ ] Set up alerts for rate limit hits
- [ ] Regular security updates
- [ ] Dependency vulnerability scanning

---

## References

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Astro SSR Guide](https://docs.astro.build/en/guides/server-side-rendering/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OAuth 2.0 PKCE RFC](https://datatracker.ietf.org/doc/html/rfc7636)
