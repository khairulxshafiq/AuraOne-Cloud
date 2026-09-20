# Component Architecture & Inventory

## 1. Component Organization
All components adhere to strict layer separation:
- `components/ui/`: Dumb, accessible UI primitives (buttons, inputs, avatars, badges).
- `components/feedback/`: Status indicators and contextual notifications (toast, alert, skeleton, empty states).
- `components/overlays/`: Focus-trapped portals (modal dialogs, drawers, tooltips).
- `components/layout/`: Page structure and scaffolding (shells, headers, sidebars, skip links).

## 2. Component Inventory

### UI Primitives (`components/ui/`)
- `Button`: Primary, secondary, outline, ghost, danger variants. Full support for loading spinners, leading/trailing icons, and size scaling (`sm`, `md`, `lg`).
- `IconButton`: Accessible button with forced `aria-label` for icon-only triggers.
- `Input`: Text input with error states, helper text, and focus ring tokens.
- `Textarea`: Multi-line text field supporting auto-grow and character counts.
- `Badge`: Status and indicator tags (`default`, `primary`, `success`, `warning`, `danger`, `gold`).
- `Avatar`: User/agent avatar with image fallback to initials or icon.
- `Progress`: Determinate progress indicator with accessible `aria-valuenow`.
- `Divider`: Semantic horizontal or vertical separation with optional text label.

### Feedback Elements (`components/feedback/`)
- `Toast` & `ToastContext`: Global notification pipeline supporting `success`, `error`, `warning`, and `info` messages with auto-dismiss timers.
- `Alert`: Contextual inline messaging banner for forms and page headers.
- `Skeleton`: Shimmering placeholder blocks for asynchronous loading states.
- `EmptyState`: Standard empty view with illustration/icon, title, description, and primary CTA.

### Overlays & Dialogs (`components/overlays/`)
- `Modal`: Accessible dialog supporting focus trap, body scroll locking, escape key dismissal, and backdrop click handler.
- `Drawer`: Side-sliding panel for mobile sheets and persistent side flows.
- `Tooltip`: Hover/focus-triggered hint with ARIA role definition and delay handling.

### Layout & Navigation (`components/layout/`)
- `SkipLink`: WCAG 2.1 Bypass Blocks (2.4.1) implementation linking to `#main-content`.
- `AppHeader`: Persistent top navigation containing brand mark, user status, and theme toggle.
- `AppSidebar`: Collapsible desktop navigation bar.
- `MobileDrawer`: Hamburger-triggered mobile navigation drawer.
- `AppShell`: Authenticated wrapper binding Header, Sidebar, Drawer, and Main content area.
- `PublicShell`: Minimal public layout for unauthenticated or landing views.
- `ThemeToggle`: 3-state radio-like toggle for light, dark, and system themes.
