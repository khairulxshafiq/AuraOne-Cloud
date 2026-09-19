# 07 — AuraOne Execution Guide

\# AuraOne Cloud Decisions Log

This log records product and architecture decisions.

Do not rewrite historical decisions.

If a decision changes:

1. Mark the original as Superseded.
2. Add a new decision.
3. Reference the previous decision.

---

# Decision Template

## DEC-[TITLE]

Date:
[YYYY-MM-DD]

Status:
Proposed | Accepted | Rejected | Superseded

Decision owner:
[NAME]

Context:
[WHY THIS DECISION IS NEEDED]

Decision:
[WHAT WAS DECIDED]

Reason:
[WHY]

Alternatives considered:
- [OPTION]
- [OPTION]

Consequences:
- Positive:
- Negative:
- Trade-offs:

Implementation impact:
[DETAILS]

Security impact:
[DETAILS]

Migration or rollback:
[DETAILS]

Related ADR:
[REFERENCE]

Supersedes:
[REFERENCE OR NONE]

---

# DEC-001: Bahasa Melayu First

Date:
2026-09-20

Status:
Accepted

Decision:
AuraOne uses a Bahasa Melayu-first interface with English as a
supported secondary language.

Reason:
AuraOne requires a recognisable identity and an approachable
experience for Malaysian users.

Consequences:
- All primary product copy begins in BM.
- Technical English terms may remain where clearer.
- Copy consistency requires a brand voice guide.

---

# DEC-002: Three-Step Onboarding

Date:
2026-09-20

Status:
Accepted

Decision:
First-time onboarding contains only three screens:

1. Name
2. Primary goal
3. Ready

Reason:
Prevent a long profile form from delaying activation.

Consequence:
The full profile remains available after onboarding and is optional.

---

# DEC-003: Trial Pro for Three Days

Date:
2026-09-20

Status:
Accepted

Decision:
New users receive a 72-hour Pro trial.

Trial Pro includes:

- Chat
- Trade
- Image

Trial Pro excludes:

- Video
- Empire-only capabilities

Reason:
Allow users to experience meaningful premium value without exposing
higher-cost Empire capabilities.

---

# DEC-004: Subscription Tier Is Separate From Trial Status

Date:
2026-09-20

Status:
Accepted

Decision:
Subscription tier and access status are separate concepts.

Base tiers:

- Free
- Pro
- Empire

Access status may include:

- Free
- Trial
- Active
- Expired
- Past due

Reason:
Avoid corrupting billing and permission logic by treating Trial as a
permanent subscription tier.

---

# DEC-005: User-Approved Memory

Date:
2026-09-20

Status:
Accepted

Decision:
Aura may suggest memories, but a memory must not be saved until the
user approves it.

Reason:
Random automatic memory can store inaccurate or sensitive facts.

Consequences:
- Suggested memory enters a pending state.
- User may save, edit or dismiss.
- Deleted memory must stop entering future payloads.

---

# DEC-006: Progressive Profile Completion

Date:
2026-09-20

Status:
Accepted

Decision:
A full user profile is not required before chat access.

Reason:
Reduce onboarding friction.

Consequence:
AuraOne may gently invite users to complete their profile later.

---

# DEC-007: Dark and Light Themes

Date:
2026-09-20

Status:
Accepted

Decision:
AuraOne supports dark, light and system-preference themes.

Default:
System preference, falling back to dark.

Reason:
Improve accessibility, user choice and long-session usability.

---

# DEC-008: Purple-Gold Visual Identity

Date:
2026-09-20

Status:
Accepted

Decision:
AuraOne uses restrained purple-gold accents.

Reason:
Purple communicates AI intelligence while warm gold communicates
premium value.

Constraint:
Avoid neon overload and gaming aesthetics.

---

# DEC-009: Aura Core Hero

Date:
2026-09-20

Status:
Accepted

Decision:
The landing hero uses a signature crystal-like neural core rather
than a generic orb.

Reason:
Provide recognisable visual identity.

Constraint:
Three.js must be lazy-loaded and have a static fallback.

---

# DEC-010: Repository and Adapter Architecture

Date:
2026-09-20

Status:
Accepted

Decision:
UI components must not access localStorage, Supabase or Hermes
directly.

Required direction:

```text
UI
→ Application Service
→ Domain
→ Repository or Adapter Interface
→ Implementation
```

Reason:
Maintainability, testability and future migration.

---

# DEC-011: Audit Before Build

Date:
2026-09-20

Status:
Accepted

Decision:
Antigravity must complete read-only discovery, audit and architecture
baseline before Phase 1.

Reason:
It has direct access to existing AuraOne systems, so assumptions
could damage stable integrations.

---

# DEC-012: No Automatic Phase Progression

Date:
2026-09-20

Status:
Accepted

Decision:
Every phase ends with a quality gate and stop report.

The next phase requires an explicit founder instruction.

Reason:
Keep changes reviewable, reversible and aligned.

---

# DEC-013: Capability-Specific Usage Units

Date:
2026-09-20

Status:
Accepted

Decision:
Chat and Trade use tokens.

Image, Video and Search use separate counters.

Reason:
Different capability costs cannot be accurately represented as a
single token quota.

---

# DEC-014: Prototype Trust Copy Must Be Accurate

Date:
2026-09-20

Status:
Accepted

Decision:
While localStorage is used, AuraOne states that prototype data is
stored on the user’s device.

Do not claim Singapore data residency until infrastructure confirms
the database, backup and logging locations.

Reason:
Prevent misleading trust and privacy claims.

---

# DEC-015: Simulated Features Must Be Labelled

Date:
2026-09-20

Status:
Accepted

Decision:
Mock payments, schedules, connector tests and landing demo responses
must be labelled as simulations.

Reason:
Maintain product transparency.

---

# DEC-016: Audit Log Sanitisation

Date:
2026-09-20

Status:
Accepted

Decision:
Audit payloads must remove secrets, personal context, full chat
content, payment details and raw system prompts.

Reason:
Auditability must not create a new privacy or security risk.

