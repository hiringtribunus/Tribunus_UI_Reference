# Feature 1 — App Shell + Google-Drive Layout (Implementation Spec)

## Goal
Implement the global application shell inspired by Google Drive:
- Left sidebar (primary navigation)
- Top bar (page title + global actions)
- Main content area (scrollable)
- Route framework so all “app pages” share the shell
- Drive-like styling tokens (spacing, cards, hover states, smooth/vanilla scroll)

## Scope (do now)
- App-wide layout + responsive behavior
- Navigation UI + active state highlighting
- Minimal placeholder pages + routes (content is stub text only)
- Styling tokens + global UI primitives required by shell

## Non-goals (do NOT do now)
- Projects CRUD, data sources UI, pro forma UI, AI chat logic (only navigation + placeholder pages)
- Real maps or agent backends
- Auth / multi-tenant / permissions

---

## Repo Assumptions (AI tool must verify and adapt)
1. If repo uses **Next.js App Router**: use `app/` route groups and layouts as described below.
2. If repo uses **Pages Router**: implement equivalent via `_app.tsx` + layout wrapper and create `/projects`, `/proforma`, `/ai`, `/settings`.
3. If Tailwind exists: use Tailwind tokens. If not, add Tailwind (minimal setup) OR implement with CSS modules using the same tokens.

Default implementation target: **Next.js App Router + TypeScript + Tailwind**.

---

## Route Map (page framework)
Create these routes (all are placeholders with a heading only):
- `/projects` (default landing)
- `/proforma`
- `/ai`
- `/settings`

Root behavior:
- `/` redirects to `/projects`

Navigation should be consistent across all routes.

---

## Layout Architecture
### High-level layout (desktop)
┌─────────────────────────────────────────────────────────────┐
│ Top Bar (sticky) │
├───────────────┬─────────────────────────────────────────────┤
│ Sidebar │ Main Content (scroll container) │
│ (scrollable) │ │
└───────────────┴─────────────────────────────────────────────┘

markdown
Copy code

### Responsive behavior
- `>= lg`: sidebar is persistent (fixed width), top bar spans the full app width.
- `< lg`: sidebar collapses into an overlay drawer (Sheet) opened by a hamburger icon in the top bar.

---

## Styling Tokens (Drive-like)
Implement tokens via CSS variables in `app/globals.css` (or equivalent) and map to Tailwind where possible.

### Core tokens (CSS variables)
Define:
- `--bg`: main background (white)
- `--surface`: card surface (white)
- `--muted`: subtle background for hover/selected
- `--border`: light border
- `--text`: primary text
- `--text-muted`: secondary text
- `--ring`: focus ring
- `--radius`: base radius
- `--shadow-sm`: subtle shadow
- `--shadow-md`: hover shadow

Recommended values (can be adjusted, but keep the “clean Google” feel):
- radius: 12px
- sidebar width: 280px (desktop)
- top bar height: 56px (mobile) / 64px (desktop) — implement via responsive classes

### Spacing + typography (Tailwind)
- Use `text-sm` default for UI chrome (sidebar items), `text-base` for content.
- Use consistent paddings: `p-3` (items), `p-4`/`p-6` (page content).
- Use subtle borders: `border` with `border-[color-var]`.
- Hover: change background only (no heavy shadows in nav).

### Motion preferences
- Respect reduced motion:
  - Disable smooth scrolling when user prefers reduced motion
  - Reduce/disable transitions when user prefers reduced motion

---

## Components to Create

### 1) `AppShell`
A wrapper that renders:
- `<SidebarNav />`
- `<TopBar />`
- `<main />` content area

Props:
- `children`
- `pageTitle` (optional; if omitted, derived from route config)
- `breadcrumbs` (optional; can be stubbed)

Responsibilities:
- Layout grid / flex
- Sticky top bar
- Scroll containers (sidebar + main content independently scrollable)
- Responsive sidebar behavior (persistent vs overlay)

### 2) `SidebarNav`
- Shows:
  - Brand (Tribunus AI) at top
  - Primary nav items:
    - Projects
    - Pro Forma
    - Tribunus AI
    - Settings
- Each nav item:
  - icon + label
  - active route highlight
  - hover state
- On mobile overlay, clicking a nav item closes the drawer (wire in `onNavigate`).

### 3) `TopBar`
- Left:
  - hamburger button on mobile
  - page title
- Center (optional but recommended for Drive feel):
  - search input (UI-only placeholder, no functionality)
- Right:
  - placeholder icon buttons (e.g., help, notifications, user avatar circle)

TopBar must be `position: sticky; top: 0; z-index: high;` with subtle bottom border.

### 4) `NavConfig`
Single source of truth for navigation items:
- label
- href
- icon
- title (for top bar)
Used by Sidebar and TopBar title derivation.

---

## File/Folder Plan (Next.js App Router)

### Create route group for app shell
- `app/(app)/layout.tsx` → wraps all app pages with `<AppShell />`
- `app/(app)/projects/page.tsx` → placeholder
- `app/(app)/proforma/page.tsx` → placeholder
- `app/(app)/ai/page.tsx` → placeholder
- `app/(app)/settings/page.tsx` → placeholder
- `app/page.tsx` → redirect to `/projects`

### Components
- `components/shell/AppShell.tsx`
- `components/shell/SidebarNav.tsx`
- `components/shell/TopBar.tsx`
- `components/shell/nav.ts` (nav config)

### Utilities (if needed)
- `lib/cn.ts` for className merging (optional but recommended)
- `hooks/useMediaQuery.ts` (optional; you can use CSS-only responsive behavior if using Sheet)

---

## Dependencies (install only if missing)
- Icons: `lucide-react`
- Class merge: `clsx` + `tailwind-merge` (or one combined utility)
- Drawer/Sheet:
  - If repo already uses shadcn/ui: use `Sheet` component
  - Else implement a minimal accessible drawer (details below)

---

## Implementation Details

### A) Layout mechanics
Desktop:
- Root container: `min-h-screen bg-[var(--bg)]`
- Use CSS grid or flex:
  - Sidebar: fixed width, `border-r`
  - Content: flex-1
- Sidebar scroll:
  - `overflow-y-auto` with its own height
- Main content scroll:
  - `overflow-y-auto` within remaining height below sticky top bar

Sticky TopBar:
- Ensure the top bar does NOT scroll away.
- Main content area should account for top bar height:
  - Use `flex flex-col h-screen` and place top bar as first child, content as `flex-1 overflow-y-auto`.

### B) Mobile sidebar (overlay)
Behavior:
- Hamburger toggles drawer open/close
- Drawer covers left side, with backdrop
- Close on:
  - clicking backdrop
  - pressing Esc
  - selecting a nav item

Accessibility requirements:
- Trap focus while open
- `aria-modal="true"`, `role="dialog"`
- Return focus to hamburger after close

If shadcn/ui available:
- Use `Sheet`, `SheetContent`, `SheetTrigger`, `SheetClose`.

If implementing custom drawer:
- Render portal-less drawer at end of AppShell with:
  - backdrop `div` (fixed inset-0)
  - panel `aside` (fixed left-0 top-0 h-full w-[min(320px,85vw)])
- Add keydown listener for `Escape`
- Focus trap minimal approach:
  - autofocus first focusable element in drawer
  - keep tab within drawer (basic implementation acceptable for MVP shell)

### C) Active route highlighting
- Use `usePathname()` (App Router) to compute active:
  - exact match for primary routes
- Active styles:
  - background: `var(--muted)`
  - font weight: medium
  - left accent (optional): subtle 2px bar

### D) Top bar title resolution
- Map pathname prefix to nav config title.
- Example:
  - `/projects` → “Projects”
  - `/proforma` → “Pro Forma”
  - `/ai` → “Tribunus AI”
  - `/settings` → “Settings”

### E) Drive-like UI behaviors
- Hover:
  - sidebar items: background only
  - top bar icon buttons: background circle on hover
- Cards (for future pages):
  - Define a `Surface` class style now: `bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow-sm)]`
  - Define hover elevate class: `hover:shadow-[var(--shadow-md)]`

### F) Smooth/vanilla scrolling + reduced motion
Global CSS:
- Default: normal scroll (no heavy custom scrollbars).
- Implement smooth scrolling for anchor jumps ONLY when motion is allowed:
  - `html { scroll-behavior: smooth; }`
  - `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } * { transition-duration: 0ms !important; animation-duration: 0ms !important; } }`
Keep transitions subtle and short.

---

## Concrete Tasks (ordered)

### 1) Add routes + redirect
- Create route group `(app)` and placeholder pages:
  - Each page renders: `<h1 className="text-lg font-semibold">...</h1>` and one short line of placeholder text.
- Implement root redirect `/` → `/projects`.

### 2) Implement nav config
- Define an array of nav items:
  - `{ key, label, href, icon, title }`
- Use this everywhere for consistency.

### 3) Build shell components
- `AppShell`:
  - desktop layout + mobile drawer state
  - passes `title` to `TopBar`
- `SidebarNav`:
  - renders nav list
  - highlights active route
- `TopBar`:
  - hamburger (mobile only)
  - title
  - search input (UI only)
  - right-side action icons (UI only)

### 4) Add global tokens + base styles
- Update `globals.css`:
  - CSS variables
  - base body styles
  - reduced motion behavior
- Ensure default background is clean white; borders are subtle.

### 5) QA pass
- Verify:
  - navigation works
  - active highlight updates
  - mobile drawer opens/closes correctly
  - sticky top bar works
  - scrolling feels smooth and not janky
  - reduced motion disables transitions/smooth scroll

---

## Acceptance Criteria
- App renders a Drive-like shell on all routes.
- Left sidebar exists on desktop and is scrollable if content overflows.
- Top bar is sticky, contains title + search input UI, and does not jitter on scroll.
- On mobile, sidebar collapses to a drawer opened via hamburger; drawer closes on nav click and Esc.
- `/` redirects to `/projects`.
- Nav items highlight correctly based on current route.
- Global tokens exist and are used (not hardcoded everywhere).
- Reduced motion preference disables smooth scrolling and heavy transitions.

---

## Minimal Placeholder Copy (use exactly)
- Projects page title: `Projects`
- Pro Forma page title: `Pro Forma`
- Tribunus AI page title: `Tribunus AI`
- Settings page title: `Settings`
- Placeholder body line: `Coming soon.`
