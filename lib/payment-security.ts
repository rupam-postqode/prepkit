import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMITS = {
  CREATE_ORDER: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  VERIFY_PAYMENT: { maxRequests: 10, windowMs: 15 * 60 * 1000 }, // 10 requests per 15 minutes
  REFUND: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 refunds per hour
  WEBHOOK: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 requests per minute for webhooks
};

/**
 * Rate limiting middleware for payment endpoints
 */
export function rateLimit(
  request: NextRequest,
  endpoint: keyof typeof RATE_LIMITS
): NextResponse | null {
  const config = RATE_LIMITS[endpoint];
  const clientIP = getClientIP(request);
  const key = `${endpoint}:${clientIP}`;
  const now = Date.now();

  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return null;
  }

  if (current.count >= config.maxRequests) {
    // Rate limit exceeded
    const resetInSeconds = Math.ceil((current.resetTime - now) / 1000);

    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        message: `Too many requests. Try again in ${resetInSeconds} seconds.`,
        retryAfter: resetInSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": resetInSeconds.toString(),
          "X-RateLimit-Limit": config.maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(current.resetTime).toISOString(),
        },
      }
    );
  }

  // Increment counter
  current.count++;
  rateLimitStore.set(key, current);

  return null;
}

/**
 * CSRF protection for payment endpoints
 */
export function validateCSRF(request: NextRequest): NextResponse | null {
  const csrfToken = request.headers.get("x-csrf-token");
  const sessionToken = request.cookies.get("next-auth.session-token")?.value;

  if (!csrfToken) {
    return NextResponse.json(
      { error: "CSRF token missing" },
      { status: 403 }
    );
  }

  // In a production app, you'd validate the CSRF token against the session
  // For now, we'll do a basic check
  if (!sessionToken) {
    return NextResponse.json(
      { error: "Session token missing" },
      { status: 403 }
    );
  }

  // Basic CSRF validation - in production, use a more sophisticated method
  const expectedToken = crypto
    .createHash("sha256")
    .update(sessionToken + process.env.CSRF_SECRET || "default-secret")
    .digest("hex");

  if (csrfToken !== expectedToken) {
    return NextResponse.json(
      { error: "Invalid CSRF token" },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Input validation for payment requests
 */
export function validatePaymentInput(
  data: Record<string, unknown>,
  type: "create-order" | "verify-payment" | "refund"
): NextResponse | null {
  switch (type) {
    case "create-order":
      if (!data.plan || typeof data.plan !== "string") {
        return NextResponse.json(
          { error: "Invalid plan specified" },
          { status: 400 }
        );
      }
      break;

    case "verify-payment":
      if (!data.session_id || typeof data.session_id !== 'string') {
        return NextResponse.json(
          { error: "Missing required payment verification fields" },
          { status: 400 }
        );
      }

      // Validate Razorpay IDs format
      if (!/^cs_[a-zA-Z0-9_]+$/.test(String(data.session_id))) {
        return NextResponse.json(
          { error: "Invalid payment verification data format" },
          { status: 400 }
        );
      }
      break;

    case "refund":
      if (!data.paymentId || typeof data.paymentId !== "string") {
        return NextResponse.json(
          { error: "Invalid payment ID" },
          { status: 400 }
        );
      }

      if (data.amount && (typeof data.amount !== "number" || data.amount <= 0)) {
        return NextResponse.json(
          { error: "Invalid refund amount" },
          { status: 400 }
        );
      }

      if (data.reason && typeof data.reason !== "string") {
        return NextResponse.json(
          { error: "Invalid refund reason" },
          { status: 400 }
        );
      }
      break;
  }

  return null;
}

/**
 * Security headers for payment endpoints
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; frame-src https://js.stripe.com https://checkout.stripe.com; connect-src 'self' https://api.stripe.com;");

  return response;
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const clientIP = request.headers.get("x-client-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (clientIP) {
    return clientIP;
  }

  // Fallback to a default for development
  return "127.0.0.1";
}

/**
 * Clean up expired rate limit entries (call this periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();

  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Combined security middleware for payment endpoints
 */
export function withPaymentSecurity(
  request: NextRequest,
  endpoint: keyof typeof RATE_LIMITS,
  options: {
    requireCSRF?: boolean;
    validateInput?: { type: "create-order" | "verify-payment" | "refund"; data: Record<string, unknown> };
  } = {}
): NextResponse | null {
  // Rate limiting
  const rateLimitResponse = rateLimit(request, endpoint);
  if (rateLimitResponse) {
    return addSecurityHeaders(rateLimitResponse);
  }

  // CSRF protection (optional)
  if (options.requireCSRF !== false) {
    const csrfResponse = validateCSRF(request);
    if (csrfResponse) {
      return addSecurityHeaders(csrfResponse);
    }
  }

  // Input validation (optional)
  if (options.validateInput) {
    const validationResponse = validatePaymentInput(
      options.validateInput.data,
      options.validateInput.type
    );
    if (validationResponse) {
      return addSecurityHeaders(validationResponse);
    }
  }

  return null;
}

// Periodic cleanup (run every 5 minutes in production)
if (typeof globalThis !== "undefined") {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
