# Design Token Architecture

## 1. Token Structure
AuraOne tokens are partitioned into logical CSS files located in `styles/tokens/`:
- `styles/tokens/primitives.css`: Raw color palettes, base radii, shadows, z-indices.
- `styles/tokens/themes.css`: Semantic mappings for light and dark modes (`--color-bg-canvas`, `--color-fg-default`, `--color-border-subtle`, etc.).
- `styles/tokens/spacing.css`: 8px-based spatial system (`--spacing-1` = 4px, `--spacing-2` = 8px ... `--spacing-16` = 64px).
- `styles/tokens/typography.css`: Type scale (`--font-size-xs` to `--font-size-4xl`), font families, font weights, and line heights.
- `styles/tokens/motion.css`: Durations (`--duration-fast`, `--duration-normal`, `--duration-slow`) and easings (`--ease-standard`, `--ease-in-out`).

## 2. Color Palette & Cues
- **Primary Brand**: Royal Malay Purple (`#6A1B9A` / `rgb(106, 27, 154)`)
- **Accent**: Songket Gold (`#C89B3C` / `rgb(200, 155, 60)`)
- **Success**: Emerald Green (`#059669`)
- **Warning**: Amber (`#D97706`)
- **Danger**: Ruby Crimson (`#DC2626`)
- **Info**: Sapphire Blue (`#2563EB`)

## 3. Contrast Ratios & WCAG 2.1 AA Compliance
| Semantic Token | Light Mode Value | Dark Mode Value | Context / Contrast |
| :--- | :--- | :--- | :--- |
| `--color-bg-canvas` | `#FAFAFB` | `#0D0D12` | Root page background |
| `--color-bg-surface` | `#FFFFFF` | `#16161F` | Card & container surface |
| `--color-fg-default` | `#111827` | `#F9FAFB` | Primary body text (>= 12:1 ratio) |
| `--color-fg-muted` | `#4B5563` | `#9CA3AF` | Secondary text (>= 4.5:1 ratio) |
| `--color-border-default` | `#D1D5DB` | `#2D2D3D` | Interactive element borders (>= 3:1) |
| `--color-brand-primary` | `#6A1B9A` | `#9C27B0` | Brand CTA, focus rings |

## 4. Usage Guidelines
Direct hex codes and arbitrary Tailwind numbers (e.g. `bg-zinc-900`, `text-gray-100`) are deprecated in favor of semantic CSS variable classes or token properties.
Example:
```css
.card {
  background-color: var(--color-bg-surface);
  color: var(--color-fg-default);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
}
```
