# ADR-0007: Authorization Boundary

**Date:** 2026-09-20  
**Status:** Proposed  
**Deciders:** Founder, Lead Software Architect, Security Architect  
**Context Tags:** authorization, rbac, entitlements, tier-matrix, security

---

## Problem Statement
In the existing prototype, every logged-in user has access to all 6 agents (Aura, Aura-Trade, Aura-Pen, Aura-Art, Aura-Scout, Aura-Vision) and all operational modes without tier distinctions. There are no role checks, no tier verification, and no permission enforcement between standard solopreneurs and administrative operators. Without an authorization boundary, users can invoke expensive media and trading models without paying for the appropriate subscription tier.

## Context & Constraints
- **Audit Findings:** `existing-feature-matrix.md`, `project-input-review.md §9`.
- **Target Tiers:**
  - **Free Tier:** Chat mode with Aura only (10,000 monthly token cap).
  - **Trial Pro:** 72-hour access to Chat, Trade, and Image generation.
  - **Pro Tier:** Chat, Trade, Image, 3 custom bots, Telegram connector.
  - **Empire Tier:** All capabilities including Video generation, 10 bots, priority execution.
  - **Admin Role:** Platform telemetry, revenue audit, and user tier modifications.
- **Rule:** Authorization checks must occur on the server. Client-side UI toggles are strictly cosmetic.

## Options Considered

### Option A: Hardcoded Client-Side Feature Gates
Inspect `user.tier` inside React components and hide buttons if unauthorized.
- **Pros:** Fast to code.
- **Cons:** Easily bypassed by sending raw HTTP POST requests to backend endpoints; insecure.

### Option B: Decentralized Ad-Hoc Route Checks
Perform custom database queries inside every route handler independently.
- **Pros:** Direct.
- **Cons:** Inconsistent rule enforcement; code duplication; high probability of overlooking routes.

### Option C: Centralized Server-Side `EntitlementService` (Recommended)
Encapsulate all capability and role rules inside a single `EntitlementService` residing in `services/`.
- **Pros:**
  - Single source of truth for all tier-to-capability mappings.
  - Route handlers and middleware invoke a simple assertion: `entitlementService.assertCanAccessAgent(user, agentId)`.
  - Admin access is validated against `is_admin = true` on the authenticated user's profile.
- **Cons:** Requires user profile tier synchronization with Supabase.

## Decision
We decide to adopt **Option C: Centralized Server-Side `EntitlementService`**.

1. The capability matrix is formalized as an immutable domain definition in `domain/constants/tiers.ts`.
2. Every serverless API route that performs inference, bot creation, or connector actions must query `EntitlementService` before executing backend work.
3. The `/admin/*` route group is blocked at the Next.js `middleware.ts` layer unless the user profile has `is_admin === true`.
4. Client UI elements check `EntitlementService.getCapabilities(user)` to gracefully display lock icons, upgrade modals, or disabled states.

## Consequences

### Positive
- Prevents unauthorized resource consumption (e.g. Free users triggering expensive video pipelines or custom bot runners).
- Clean separation between identity authentication (who you are) and authorization (what you are allowed to execute).
- Streamlined upgrade paths: when a user upgrades to Pro, updating their profile tier immediately unlocks capabilities across all routes.

### Negative / Trade-offs
- Slight latency to check user profile tier before starting chat streams (cached in memory where applicable).

## Implementation Guidance

### Capability Matrix (`domain/constants/tiers.ts`)
```typescript
export type UserTier = 'free' | 'trial_pro' | 'pro' | 'empire';
export type AgentCapability = 'chat' | 'trade' | 'image' | 'video' | 'bots' | 'admin';

export const TIER_PERMISSIONS: Record<UserTier, Record<AgentCapability, boolean>> = {
  free: {
    chat: true,
    trade: false,
    image: false,
    video: false,
    bots: false,
    admin: false,
  },
  trial_pro: {
    chat: true,
    trade: true,
    image: true,
    video: false,
    bots: false,
    admin: false,
  },
  pro: {
    chat: true,
    trade: true,
    image: true,
    video: false,
    bots: true,
    admin: false,
  },
  empire: {
    chat: true,
    trade: true,
    image: true,
    video: true,
    bots: true,
    admin: false,
  },
};
```

### Entitlement Service (`services/entitlement.service.ts`)
```typescript
import { UserTier, TIER_PERMISSIONS, AgentCapability } from '@/domain/constants/tiers';

export class EntitlementService {
  canAccessCapability(tier: UserTier, capability: AgentCapability): boolean {
    return TIER_PERMISSIONS[tier]?.[capability] ?? false;
  }

  assertCanAccessAgent(tier: UserTier, agentId: string): void {
    if (tier === 'free' && agentId !== 'Aura') {
      throw new Error(`Ejen ${agentId} memerlukan langganan Pro atau Empire.`);
    }
    if ((agentId === 'Aura-Vision' || agentId === 'Aura-Scout') && tier !== 'empire') {
      throw new Error(`Ejen ${agentId} eksklusif untuk pelan Empire.`);
    }
  }

  assertIsAdmin(isAdmin: boolean): void {
    if (!isAdmin) {
      throw new Error('Akses ditolak: Memerlukan kebenaran Pentadbir.');
    }
  }
}
```

## Related ADRs
- ADR-0002: Routing Strategy
- ADR-0006: Authentication Boundary
- ADR-0008: Entitlement & Trial Model
- ADR-0012: Admin Dashboard Architecture
