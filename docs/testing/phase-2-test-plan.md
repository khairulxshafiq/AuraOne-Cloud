# Phase 2 Test Plan & Verification Matrix

## 1. Test Strategy
Phase 2 employs an automated multi-layer test harness:
1. **Linting & Code Style**: ESLint 9 flat config + Prettier format checking.
2. **Type Verification**: TypeScript 5 (`tsc --noEmit`) with strict checking.
3. **Unit & Integration Testing**: Vitest 3 with node test environment and DOM verification.
4. **Production Build**: Next.js 16 (`next build`) Turbopack compiler check.

## 2. Test Suites
| Suite | File | Tests | Focus Area |
| :--- | :--- | :--- | :--- |
| Security | `tests/security/auth-and-chat-route.test.ts` | 6 | Route authentication, rate limits, error masking |
| Security | `tests/security/errors-and-logger.test.ts` | 5 | Safe structured logging, correlation IDs |
| Security | `tests/security/hermes-adapter.test.ts` | 8 | Hermes HTTP transport, agent forwarding, cancellation |
| Security | `tests/security/rate-limiter.test.ts` | 3 | In-memory token bucket rate limiting |
| Security | `tests/security/validation.test.ts` | 10 | Chat request payload validation schema |
| UI | `tests/ui/theme.test.ts` | 5 | Theme persistence, inline init script, fallback logic |
| UI | `tests/ui/primitives.test.ts` | 7 | Button, Input, Textarea, Badge, Avatar, Progress, Divider |
| UI | `tests/ui/overlays.test.ts` | 3 | Modal, Drawer, Tooltip component rendering |
| UI | `tests/ui/layout.test.ts` | 4 | SkipLink, AppHeader, AppSidebar, PublicShell structures |

**Total Suite**: 9 Test Files, 51 Passing Tests, 0 Failures.
