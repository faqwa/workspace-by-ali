/**
 * API Utilities
 *
 * Standard response formats, error handling, and security helpers for API routes
 */

/**
 * Standard API response format
 */
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

/**
 * Create a standardized success response
 */
export function apiSuccess<T>(data: T, status: number = 200): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Create a standardized error response
 */
export function apiError(
  message: string,
  status: number = 400,
  code?: string
): Response {
  const response: ApiResponse = {
    success: false,
    error: {
      message,
      code,
    },
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Common API errors
 */
export const API_ERRORS = {
  UNAUTHORIZED: { message: 'Unauthorized', status: 401, code: 'UNAUTHORIZED' },
  FORBIDDEN: { message: 'Forbidden', status: 403, code: 'FORBIDDEN' },
  NOT_FOUND: { message: 'Not found', status: 404, code: 'NOT_FOUND' },
  BAD_REQUEST: { message: 'Bad request', status: 400, code: 'BAD_REQUEST' },
  INTERNAL_ERROR: { message: 'Internal server error', status: 500, code: 'INTERNAL_ERROR' },
  RATE_LIMITED: { message: 'Too many requests', status: 429, code: 'RATE_LIMITED' },
  CSRF_ERROR: { message: 'Invalid CSRF token', status: 403, code: 'CSRF_ERROR' },
} as const;

/**
 * Simple in-memory rate limiter
 * For production, use Redis or similar
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  /**
   * Check if request is allowed
   * @param key - Identifier (e.g., IP address or user ID)
   * @param limit - Max requests allowed
   * @param windowMs - Time window in milliseconds
   */
  isAllowed(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get existing requests for this key
    const requests = this.requests.get(key) || [];

    // Filter out old requests outside the window
    const recentRequests = requests.filter(time => time > windowStart);

    // Check if under limit
    if (recentRequests.length >= limit) {
      return false;
    }

    // Add this request
    recentRequests.push(now);
    this.requests.set(key, recentRequests);

    // Cleanup old entries periodically
    if (Math.random() < 0.01) {
      this.cleanup(windowStart);
    }

    return true;
  }

  /**
   * Clean up old entries
   */
  private cleanup(before: number): void {
    for (const [key, requests] of this.requests.entries()) {
      const recentRequests = requests.filter(time => time > before);
      if (recentRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recentRequests);
      }
    }
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
  // Try various headers set by proxies
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Apply rate limiting to an API route
 * Returns error response if rate limited, null if allowed
 */
export function checkRateLimit(
  request: Request,
  limit: number = 10,
  windowMs: number = 60000 // 1 minute default
): Response | null {
  const ip = getClientIp(request);
  const key = `rate:${ip}`;

  if (!rateLimiter.isAllowed(key, limit, windowMs)) {
    return apiError(
      API_ERRORS.RATE_LIMITED.message,
      API_ERRORS.RATE_LIMITED.status,
      API_ERRORS.RATE_LIMITED.code
    );
  }

  return null;
}

/**
 * Validate required fields in form data
 */
export function validateRequired(
  formData: FormData,
  fields: string[]
): { valid: boolean; missing?: string[] } {
  const missing = fields.filter(field => !formData.get(field));

  if (missing.length > 0) {
    return { valid: false, missing };
  }

  return { valid: true };
}
