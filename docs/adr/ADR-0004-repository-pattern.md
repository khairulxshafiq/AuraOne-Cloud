# ADR-0004: Repository Pattern

**Date:** 2026-09-20  
**Status:** Proposed  
**Deciders:** Founder, Lead Software Architect  
**Context Tags:** storage, database, repository-pattern, supabase, abstraction, dec-010

---

## Problem Statement
The current prototype stores all chat sessions, messages, and credit balances in ephemeral React component state (`useState` in `page.tsx`). Refreshing the browser destroys all conversation history (Finding: `RR-DAT-001`). Conversely, wiring components directly to Supabase table queries creates tight vendor lock-in, making automated testing difficult and violating `DEC-010`. When the team is ready to introduce persistent Supabase tables in Phase 10, a direct coupling approach would require rewriting large portions of the UI.

## Context & Constraints
- **Audit Findings:** `ARC-002` (Direct vendor calls), `RR-DAT-001` (Ephemeral state), `data-flow-map.md`.
- **Target Goal:** Enable chat message persistence immediately (using localStorage/memory wrappers in Phase 4), then migrate seamlessly to Supabase PostgreSQL in Phase 10 with zero UI changes.
- **Principle:** `DEC-010` mandates repository/adapter interfaces between domain logic and persistence.

## Options Considered

### Option A: Direct Supabase Client Calls in UI Components
Call `supabase.from('messages').insert(...)` directly inside React event handlers.
- **Pros:** Fast prototype code generation.
- **Cons:** Zero abstraction; untestable without complex Supabase network interceptors; breaks if table schemas evolve; violates `DEC-010`.

### Option B: Raw React Query / SWR Hooks with Direct SQL Views
Fetch data directly via SWR/React Query hitting Next.js route handlers.
- **Pros:** Good caching and revalidation.
- **Cons:** Mixes data transport with persistence logic; does not decouple the storage engine.

### Option C: Repository Pattern with Dependency Inversion (Recommended)
Define pure TypeScript repository interfaces in `adapters/storage/`. Implement concrete repository classes (`MemoryMessageRepository`, `SupabaseMessageRepository`). Inject repositories into Application Services.
- **Pros:**
  - Complete decoupling: UI only talks to Application Services.
  - Phase 4 uses `MemoryMessageRepository` (with optional localStorage caching) for immediate zero-config testing.
  - Phase 10 switches to `SupabaseMessageRepository` by changing a single dependency injection binding.
  - Unit tests can run instantly against in-memory fake repositories without Docker or Supabase network latency.
- **Cons:** Requires defining explicit interface contracts up front.

## Decision
We decide to adopt **Option C: Repository Pattern with Dependency Inversion**.

All data persistence operations must go through typed repository interfaces:
1. `ISessionRepository`: Manage conversational thread metadata.
2. `IMessageRepository`: Store, query, and paginate conversation messages.
3. `ICreditRepository`: Query balance and append transactions to the immutable ledger.
4. `IProfileRepository`: Read and mutate user profile metadata.
5. `IMemoryRepository`: Store and query user-approved AI memories.
6. `IBotRepository`: CRUD operations on custom bot definitions.

In Phase 4, memory/localStorage implementations will be utilized. In Phase 10, Supabase PostgreSQL implementations will replace them.

## Consequences

### Positive
- **Zero-Rewrite Phase 10 Migration:** The UI and Application Services remain 100% untouched when transitioning from prototype storage to Supabase PostgreSQL.
- **Blazing-Fast Unit Tests:** Unit test suites execute in milliseconds using in-memory mock repositories.
- Strict data contracts prevent schema typos and runtime undefined errors.

### Negative / Trade-offs
- Additional interface files must be maintained alongside entity types.

## Implementation Guidance

### Interface Definition (`adapters/storage/IMessageRepository.ts`)
```typescript
import { Message } from '@/domain/types/message';

export interface IMessageRepository {
  getBySessionId(sessionId: string): Promise<Message[]>;
  append(sessionId: string, message: Message): Promise<void>;
  clearSession(sessionId: string): Promise<void>;
}
```

### In-Memory Implementation (`adapters/storage/memory/MemoryMessageRepository.ts`)
```typescript
import { IMessageRepository } from '../IMessageRepository';
import { Message } from '@/domain/types/message';

export class MemoryMessageRepository implements IMessageRepository {
  private store: Map<string, Message[]> = new Map();

  async getBySessionId(sessionId: string): Promise<Message[]> {
    return this.store.get(sessionId) || [];
  }

  async append(sessionId: string, message: Message): Promise<void> {
    const existing = this.store.get(sessionId) || [];
    this.store.set(sessionId, [...existing, message]);
  }

  async clearSession(sessionId: string): Promise<void> {
    this.store.delete(sessionId);
  }
}
```

### Production Supabase Implementation (`adapters/storage/supabase/SupabaseMessageRepository.ts`)
```typescript
import { IMessageRepository } from '../IMessageRepository';
import { Message } from '@/domain/types/message';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseMessageRepository implements IMessageRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getBySessionId(sessionId: string): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    return data.map(row => ({
      id: row.id,
      role: row.role,
      content: row.content,
      timestamp: new Date(row.created_at).toLocaleTimeString(),
    }));
  }

  async append(sessionId: string, message: Message): Promise<void> {
    const { error } = await this.supabase.from('messages').insert({
      id: message.id,
      session_id: sessionId,
      role: message.role,
      content: message.content,
    });
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
  }

  async clearSession(sessionId: string): Promise<void> {
    await this.supabase.from('messages').delete().eq('session_id', sessionId);
  }
}
```

## Related ADRs
- ADR-0001: Application Architecture
- ADR-0013: Supabase Migration Strategy
