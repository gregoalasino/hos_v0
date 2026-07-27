# Admin Design System

Single source of truth for the House of Shakti admin panel.

> **Admin prioritizes legibility and density over editorial restraint.** Use this document when in doubt.

The admin shares the public site's color tokens and font stack but applies them
with a different philosophy: information first, restraint second.

---

## 1. Typography

| Stack | Family | When to use |
|---|---|---|
| `font-display` | Krylon | ONLY the sidebar logo "House of Shakti" and occasional page heading accents. Never body, labels, or buttons. |
| `font-body` | Chalet | Default for everything: page headings, labels, table headers, body, buttons, badges. |

### Size scale

| Element | Classes |
|---|---|
| Page heading | `font-body text-2xl lg:text-3xl font-normal text-ink` |
| Section heading | `font-body text-lg font-medium text-ink` |
| Body text | `font-body text-sm text-ink/80` |
| Labels / table headers | `font-body text-[10px] tracking-[0.15em] uppercase text-ink/50` |
| Small helper text | `font-body text-xs text-ink/60` |

Line height: `leading-tight` for headings, `leading-normal` for body. Avoid
`leading-relaxed` — too much vertical space for an admin tool.

---

## 2. Color palette

### Surfaces

| Token | Hex | Use |
|---|---|---|
| `bg-warm-white` | `#f2ebe7` | Main content area background |
| `bg-white` | `#ffffff` | Cards / elevated surfaces |
| `bg-dark` | `#340000` | Sidebar background |
| `bg-cream/40` | — | Row hover state |

### Borders

| Token | Use |
|---|---|
| `border-ink/10` | Default 1px border |
| `border-ink/15` | Stronger separator (section dividers) |
| `border-cream/15` | Internal sidebar borders (on dark bg) |

### Text colors

On **light surfaces** (warm-white / white):
- Primary: `text-ink` (#313131)
- Secondary: `text-ink/60` → `text-ink/70`
- Muted / labels: `text-ink/40` → `text-ink/50`

On **sidebar (dark surface)**:
- Primary: `text-cream`
- Secondary: `text-cream/70`
- Muted: `text-cream/40`

### Accent palette (refined earth tones)

Used for status indicators, category labels, and confirmations. **Avoid any
saturated greens, blues, violets, oranges** — the current admin calendar uses
those and they will be migrated to this palette in Prompt 9.3.

| Name | Hex | Use |
|---|---|---|
| Burgundy | `#8D0000` | Primary actions, critical info, destructive confirmation |
| Olive / sage | `#6B7355` | Success states ("Active", "Confirmed") |
| Sand | `#A6896D` | Secondary highlights |
| Warm gray | `#7A6B5D` | Neutral states ("Draft", "Inactive") |
| Terracotta | `#8B6F47` | Warnings, attention states |

---

## 3. Spacing scale

Admin uses tighter spacing than the public site.

| Use case | Classes |
|---|---|
| Section vertical padding | `py-8 lg:py-10` (NOT `py-32`) |
| Card padding | `p-6` (NOT `p-8` or `p-12`) |
| Stack spacing | `space-y-4` → `space-y-6` (NOT `space-y-10`) |
| Page horizontal padding (main content) | `px-6 lg:px-10` |
| Sidebar internal padding | `px-6 py-8` |

---

## 4. Base components

Located in `/components/admin/`.

| Component | Purpose |
|---|---|
| `Sidebar.tsx` | Fixed left navigation chrome. Desktop visible, mobile off-canvas drawer. |
| `PageHeader.tsx` | Consistent header for every admin page (eyebrow + heading + description + actions). |
| `Button.tsx` | 4 variants: `primary`, `secondary`, `tertiary`, `destructive`. Supports `icon`, `loading`, `disabled`. No border-radius. |
| `Badge.tsx` | Status / category pills. 5 variants: `active`, `inactive`, `warning`, `destructive`, `neutral`. |
| `Card.tsx` | Base container (`bg-white`, 1px border, no radius, no shadow). Three padding modes. |
| `EmptyState.tsx` | Replaces weak "no data" patterns. Icon + heading + description + optional action. |
| `DeleteConfirmation.tsx` | Reusable destructive-action modal with ESC + backdrop close. |

---

## 5. Motion

Admin animations are **subtle and functional**, not editorial.

- Hover transitions: `transition-colors duration-200 ease-out`
- Active link transitions: `transition-all duration-200`
- Drawer (mobile): Framer Motion, duration 300ms, ease easeOut
- Modal (delete confirmation): scale 0.95 → 1 + fade, duration 200ms
- **No** scroll-triggered animations, **no** `useInView`, **no** word-by-word reveals

The admin is a tool. Tools open quickly and don't perform.

---

## 6. Layout shell

```tsx
<div className="min-h-screen flex bg-warm-white">
  <Sidebar />
  <main className="flex-1 md:ml-[260px]">
    {children}
  </main>
</div>
```

Sidebar width is `260px` on `md+`, collapsing to an off-canvas drawer below.
Main content area scrolls naturally; the sidebar stays fixed.
