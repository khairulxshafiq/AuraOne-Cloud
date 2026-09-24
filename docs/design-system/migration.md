# Chat Interface Visual Migration Guide

## 1. Scope and Invariants
The migration in Phase 2 strictly updated the presentation layer (`app/page.tsx`) without altering runtime behavior:
- **Preserved**: Supabase client authentication (`createClient()`), session state, and sign-in/sign-out logic.
- **Preserved**: Streaming API route (`/api/chat`), agent selection dropdown, and markdown parsing.
- **Updated**: Legacy Tailwind arbitrary classes (`bg-zinc-900`, `text-white`) replaced with semantic token classes (`bg-[var(--color-bg-canvas)]`, `text-[var(--color-fg-default)]`).

## 2. Token Class Map
| Legacy Class | Semantic Token Replacement | Description |
| :--- | :--- | :--- |
| `bg-zinc-950` | `bg-[var(--bg-primary)]` | Base page background |
| `bg-zinc-900` | `bg-[var(--bg-elevated)]` | Message container & card background |
| `text-white` | `text-[var(--text-primary)]` | Primary text |
| `text-zinc-400` | `text-[var(--text-muted)]` | Timestamps & secondary labels |
| `border-zinc-800` | `border-[var(--border-subtle)]` | Card borders & dividers |
| `focus:ring-blue-500` | `focus:border-[var(--accent-primary)]` | Focus ring matching Royal Purple |

## 3. Component Integration
- `ThemeToggle` embedded in the chat top navigation bar.
- `Badge` component utilized for status badges (e.g. `Online`, `Hermes Gateway`).
- `Avatar` component used for user and AI agent chat message identifiers.
- `SkipLink` added at root level targeting `#main-content`.

