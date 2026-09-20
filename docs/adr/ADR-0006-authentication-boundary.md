# ADR-0006: Authentication Boundary

**Date:** 2026-09-20  
**Status:** Proposed  
**Deciders:** Founder, Lead Software Architect, Security Architect  
**Context Tags:** auth, security, supabase, ssr, jwt, middleware

---

## Problem Statement
The current prototype evaluates authentication solely within client-side React code via `supabase.auth.onAuthStateChange` in `app/page.tsx` (Finding: `SEC-001`). The backend endpoint `app/api/chat/route.ts` performs zero token validation, allowing arbitrary HTTP scripts to bypass Google sign-in and trigger Hermes LLM inference freely. Furthermore, using the vanilla `@supabase/supabase-js` client in a Next.js App Router project prevents server components and edge middleware from securely reading HTTP-only session cookies.

## Context & Constraints
- **Audit Findings:** `SEC-001` (Unauthenticated API route), `RR-SEC-001` (P1 Critical), `environment-inventory.md`.
- **Target Experience:** Google OAuth sign-in via Supabase (`AuraAgentic` project).
- **Core Principle:** Defense-in-depth across three boundaries: Edge Middleware, Server-side API Handlers, and Client-side UI Gates.

## Options Considered

### Option A: Client-Only Authentication with Custom JWT Headers
Pass `supabase.auth.getSession().access_token` in the request header manually on every `fetch('/api/chat')`.
- **Pros:** Does not require server-side cookie utilities.
- **Cons:** Fragile; prone to token expiration synchronization bugs; cannot protect server components or server-rendered layouts; vulnerable to XSS token theft.

### Option B: NextAuth.js (Auth.js) Replacement
Replace Supabase Auth with NextAuth.js.
- **Pros:** Native Next.js ecosystem support.
- **Cons:** Throws away the already configured and working Supabase Google OAuth integration; introduces another dependency.

### Option C: Three-Layer Defense with `@supabase/ssr` (Recommended)
Adopt `@supabase/ssr` to store session tokens in encrypted, HTTP-only cookies. Validate sessions at three distinct technical boundaries:
1. **Layer 1: Edge Middleware (`middleware.ts`)** — Intercepts all requests to `/api/*` and `(app)/*`.
2. **Layer 2: Server-Side API Handlers (`app/api/*/route.ts`)** — Re-verifies user identity and extracts `user_id` from the secure server client.
3. **Layer 3: Client-Side UI (`features/auth/components/AuthGate.tsx`)** — Renders login cards and profile avatars for UX purposes.
- **Pros:**
  - Complete elimination of the `SEC-001` unauthenticated API vulnerability.
  - Seamless cookie synchronization across Server Components, Server Actions, and Client Components.
  - Immune to localStorage script-injection attacks.
- **Cons:** Requires installing `@supabase/ssr` in Phase 1.

## Decision
We decide to adopt **Option C: Three-Layer Defense with `@supabase/ssr`**.

1. Install `@supabase/ssr` and create two standardized factory utilities:
   - `lib/supabase-browser.ts`: For interactive client components.
   - `lib/supabase-server.ts`: For Next.js Server Components, Route Handlers, and Middleware.
2. In `app/api/chat/route.ts`, extract the verified `user.id` from `supabase.auth.getUser()`. If no valid session is present, reject immediately with HTTP 401 Unauthorized.
3. User identity (`userId`) is forwarded in the internal headers to the Hermes VPS gateway, enabling user-level quota tracking and logging.

## Consequences

### Positive
- Closes the critical vulnerability `SEC-001` immediately in Phase 1.
- Provides tamper-proof user context to the downstream Hermes and quota engines.
- Works out-of-the-box with Vercel edge infrastructure.

### Negative / Trade-offs
- Local development requires valid OAuth login or mock session cookies to test API routes.

## Implementation Guidance

### Server Client Factory (`lib/supabase-server.ts`)
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored when called from Server Components
          }
        },
      },
    }
  );
}
```

### Route Handler Auth Verification (`app/api/chat/route.ts`)
```typescript
import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      { error: 'Akses ditolak: Sila log masuk terlebih dahulu.' },
      { status: 401 }
    );
  }

  // Proceed with validated user.id ...
}
```

## Related ADRs
- ADR-0002: Routing Strategy
- ADR-0007: Authorization Boundary
- ADR-0008: Entitlement & Trial Model
