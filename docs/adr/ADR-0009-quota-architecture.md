# ADR-0009: Quota Architecture

**Date:** 2026-09-20  
**Status:** Proposed  
**Deciders:** Founder, Lead Software Architect, Platform Engineer  
**Context Tags:** quota, billing, credit-ledger, tokenomics, supabase

---

## Problem Statement
The current prototype simulates credit deductions client-side in `app/page.tsx` (`setCredits(prev => (parseFloat(prev) - 0.02).toFixed(2))`). This deduction is cosmetic: refreshing the page resets the balance back to RM10.00, and no server-side ledger exists to record consumption (Finding: `existing-feature-matrix.md §6`). Furthermore, different AI modalities (text reasoning vs image generation vs video creation) have vastly differing compute costs, making a single flat RM-per-message deduction inadequate for commercial operations.

## Context & Constraints
- **Product Input:**
  - Free tier: 10,000 tokens/month.
  - Pro tier: 150,000 tokens/month.
  - Empire tier: 400,000 tokens/month.
  - Top-up packs: +50,000 tokens (RM5.90) and +150,000 tokens (RM14.90).
- **Core Principle:** Immutable audit trail. Financial and quota events must follow an append-only double-entry ledger design to prevent race conditions and account reconciliation disputes.

## Options Considered

### Option A: Mutable Integer Counter on User Profile
Store a single integer `token_balance` column on `profiles` and update it with `UPDATE profiles SET token_balance = token_balance - 50`.
- **Pros:** Simple to implement.
- **Cons:** Subject to race conditions under concurrent streaming sessions; zero audit history; impossible to trace when or why a balance decreased.

### Option B: Redis In-Memory Token Bucket
Manage token counts entirely in Upstash Redis.
- **Pros:** Ultra-fast sub-millisecond atomic decrement operations.
- **Cons:** Risk of cache loss; complicates reconciliation with permanent billing records; requires managing two separate persistence engines.

### Option C: Append-Only PostgreSQL Ledger with Pre-Flight Balance Assertion (Recommended)
Record all quota events in an immutable `credit_ledger` table in Supabase. Compute current balance via an indexed ledger sum or cached materialized snapshot. Enforce pre-flight quota assertions before initiating Hermes streams.
- **Pros:**
  - 100% auditable: every debit is linked to a `message_id`, top-up payment, or administrative grant.
  - Tamper-proof: the table is append-only (`INSERT` allowed, `UPDATE`/`DELETE` blocked by database triggers and RLS).
  - Handles multiple counters: `chat_tokens`, `image_credits`, `video_credits`.
- **Cons:** Requires appending a ledger record after each streaming generation.

## Decision
We decide to adopt **Option C: Append-Only PostgreSQL Ledger with Pre-Flight Balance Assertion**.

1. Create a `credit_ledger` table in Supabase storing `user_id`, `amount_delta`, `balance_after`, `event_type`, and `reference_id`.
2. Before routing any request to Hermes, `QuotaService` verifies that the user's balance is positive (`balance > 0`). If depleted, it rejects the request with HTTP 402 Payment Required.
3. Upon SSE stream completion, the Hermes gateway reports the actual tokens utilized (`prompt_tokens + completion_tokens`), and an asynchronous debit record is inserted into `credit_ledger`.
4. Separate counter categories are tracked for non-text assets:
   - `chat_debit` (tokens)
   - `image_debit` (discrete image counter)
   - `video_debit` (discrete video seconds counter)

## Consequences

### Positive
- Prevents fraud: users cannot spoof or reset balances by reloading browsers.
- Transparent dispute resolution: support teams can review every individual transaction and token debit.
- Accommodates top-up packages (+50k, +150k tokens) seamlessly as positive delta ledger insertions.

### Negative / Trade-offs
- Writing to `credit_ledger` on every completed chat stream increases database write volume (mitigated by indexing on `user_id` and batching if necessary).

## Implementation Guidance

### Supabase Table Schema (`credit_ledger`)
```sql
CREATE TABLE public.credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_delta INTEGER NOT NULL,          -- Positive for topups, negative for debits
  balance_after INTEGER NOT NULL,         -- Running balance snapshot
  event_type TEXT NOT NULL CHECK (
    event_type IN ('subscription_grant', 'topup_credit', 'chat_debit', 'image_debit', 'video_debit', 'refund', 'admin_adjustment')
  ),
  reference_id TEXT DEFAULT NULL,         -- Linked message_id or payment_intent_id
  metadata JSONB DEFAULT '{}',            -- e.g. { "agent_id": "Aura-Trade", "tokens": 342 }
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: Users can inspect their own ledger entries; modifications restricted to service_role
ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_ledger" ON public.credit_ledger
  FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX idx_credit_ledger_user_created ON public.credit_ledger (user_id, created_at DESC);
```

### Quota Service (`services/quota.service.ts`)
```typescript
import { ICreditRepository } from '@/adapters/storage/ICreditRepository';

export class QuotaService {
  constructor(private readonly creditRepo: ICreditRepository) {}

  async assertSufficientBalance(userId: string): Promise<void> {
    const currentBalance = await this.creditRepo.getBalance(userId);
    if (currentBalance <= 0) {
      throw new Error('Kuota token anda telah habis. Sila tambah nilai untuk meneruskan.');
    }
  }

  async recordDebit(userId: string, tokensUsed: number, messageId: string, agentId: string): Promise<void> {
    await this.creditRepo.appendEntry({
      userId,
      amountDelta: -tokensUsed,
      eventType: 'chat_debit',
      referenceId: messageId,
      metadata: { agentId, tokensUsed },
    });
  }
}
```

## Related ADRs
- ADR-0004: Repository Pattern
- ADR-0007: Authorization Boundary
- ADR-0008: Entitlement & Trial Model
- ADR-0013: Supabase Migration Strategy
