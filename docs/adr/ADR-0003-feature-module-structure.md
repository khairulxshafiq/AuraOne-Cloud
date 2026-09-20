# ADR-0003: Feature Module Structure

**Date:** 2026-09-20  
**Status:** Proposed  
**Deciders:** Founder, Lead Software Architect  
**Context Tags:** modularity, feature-slices, code-organization, boundaries

---

## Problem Statement
In the existing codebase, domain components, subviews, and state hooks are tangled inside a single file or scattered without explicit ownership boundaries. Adding new planned capabilities—such as the Bot Builder, AI Memory Inspector, Quota Ledger, and Connector Dashboard—will exacerbate code collisions and create circular dependencies unless clear feature boundaries are instituted.

## Context & Constraints
- **Audit Findings:** `ARC-001` (God Component), `ARC-004` (No domain type boundaries).
- **Core Principles:** Features must represent distinct product capabilities. Changes to the Bot Studio must not inadvertently break the Chat interface or the Profile manager.
- **Rules of Modularity:** Features must not directly import internals from other features. Shared functionality belongs in core domain layers or application services.

## Options Considered

### Option A: Technical Layering (Type-based Folders)
Group files strictly by technical role: `components/`, `hooks/`, `utils/`, `pages/`.
- **Pros:** Familiar to novice developers.
- **Cons:** Feature code is fragmented across 5 distant directories. Deleting or modifying a feature requires jumping across the entire codebase.

### Option B: Vertical Feature Slices with Strict Public APIs (Recommended)
Place all UI components, state hooks, configuration, and entry points belonging to a single capability inside `features/<feature-name>/`. Expose a clean `index.ts` barrier.
- **Pros:**
  - High cohesion: all chat components reside in `features/chat/`.
  - Zero cross-feature pollution: features interact through services or shared layout properties.
  - Trivial feature pruning, testing, and ownership assignment.
- **Cons:** Requires enforcing import boundaries via ESLint.

## Decision
We decide to adopt **Option B: Vertical Feature Slices with Strict Public APIs**.

The following official feature modules are established under `features/`:
1. **`chat`**: Streaming view, message list, prompt textarea, empty state quick suggestions.
2. **`agents`**: Agent armada selector, persona cards, agent metadata configuration.
3. **`auth`**: Login card, Google OAuth button, session state wrappers.
4. **`profile`**: User metadata editor, bio, goal configuration, avatar management.
5. **`memory`**: AI memory inspection drawer, user approval/rejection chips.
6. **`quota`**: Credit balance chips, top-up modal, threshold alert banners.
7. **`trial`**: 72-hour Pro countdown badge, trial activation triggers.
8. **`bots`**: 3-step Bot Studio wizard, bot cards, Telegram channel setup.
9. **`admin`**: User management table, revenue telemetry, audit logs.
10. **`connectors`**: Third-party webhook status chips and health diagnostics.

### Boundary Rules
- Feature components may import from `domain/`, `services/`, `components/ui/`, and `lib/`.
- **FORBIDDEN:** A file in `features/chat/` CANNOT import from `features/bots/`. Cross-cutting data flows through Application Services or shared React Context/Zustand state in the AppShell.

## Consequences

### Positive
- Isolated developer workflows: one engineer can refactor `features/memory` without touching `features/chat`.
- Decomposes `app/page.tsx` cleanly in Phase 2.
- Clear file locations: finding where the message bubble is styled is deterministic (`features/chat/components/MessageBubble.tsx`).

### Negative / Trade-offs
- Requires creating multiple folders and `index.ts` files during initial scaffolding.

## Implementation Guidance

### Feature Directory Layout
```
features/chat/
├── components/
│   ├── ChatShell.tsx          # Main conversational container
│   ├── MessageList.tsx        # Virtualized/scrollable message stream
│   ├── MessageBubble.tsx      # Individual user/assistant bubble
│   ├── ChatInput.tsx          # Textarea with auto-height and submit action
│   └── EmptyState.tsx         # Suggested starting prompts
├── hooks/
│   ├── useChatStream.ts       # SSE reader hook with AbortController
│   └── useSessionManager.ts   # Active session switcher
└── index.ts                   # Exported public API (only export what page needs)
```

### ESLint Enforcement Pattern
```javascript
// eslint.config.mjs
{
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        {
          group: ['@/features/*/*'],
          message: 'Please import from the feature public API (@/features/<feature>) instead of internal paths.',
        },
      ],
    }],
  },
}
```

## Related ADRs
- ADR-0001: Application Architecture
- ADR-0002: Routing Strategy
- ADR-0004: Repository Pattern
