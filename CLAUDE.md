# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tribunus Labs UI** - A Google Drive-inspired real estate development project management platform with integrated AI assistance. The platform combines project management, pro forma modeling, and AI-powered research capabilities in a clean, minimal interface.

## Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (Radix) + lucide-react
- **Backend**: Supabase (Postgres + Auth + Storage)
- **ORM**: Prisma for DB access/migrations
- **Validation**: Zod for schema validation
- **Deployment**: Vercel (Node runtime)
- **Optional**: TanStack Query (only if heavy client-side fetching needed, otherwise use Server Actions/Route Handlers)

## Critical Development Rules

**ALWAYS follow these rules from `Docs/PROMPT_TEMPLATE.md`:**

1. **Testing**: Run light tests and delete them after success to keep codebase clean
2. **Code Quality**: Write modular code with minimal, useful comments that a junior engineer can understand
3. **Documentation**: DO NOT create task summaries or documentation dumps - inline comments are sufficient
4. **Planning**: Plan well, think hard, then execute until complete
5. **Scope**: Only perform the task at hand - do not assume or get ahead of requirements
6. **Required Reading**: Always read code files AND relevant .md files in full before implementing
7. **Tech Stack**: Stay on the specified tech stack for vibe coding friendliness
8. **Styling**: Always refer to `Docs/STYLE_GUIDE.md` for all UI/UX decisions

## Project Architecture

### Feature Roadmap (Reference `Docs/FEATURE_LIST.md`)

The platform is being built in 6 features:

1. **App Shell + Google-Drive Layout** - Global layout with left sidebar, top bar, main content area
2. **Projects: List + CRUD** - Projects index with Drive-like grid/list views
3. **Project Profile** - Details page with zoning map placeholder
4. **Data Sources** - Per-project library for council reports, news, maps
5. **Pro Forma / Scenario Planning** - MVP modeling UI with live calculations
6. **Tribunus AI Chat** - Chat interface with project selector and mode toggles

### Design System (Reference `Docs/STYLE_GUIDE.md`)

**Visual Philosophy**: Content-first, white background, minimal borders, subtle elevation, soft rounded corners, vanilla scroll

**Key Design Tokens**:
- Colors: White backgrounds (#FFFFFF), accent blue (#1A73E8) for primary actions, neutral grays for text hierarchy
- Typography: Inter font (or Google Sans/Roboto), 14-15px body, 16-18px section titles
- Spacing: 4px base grid, common values: 8, 12, 16, 24, 32, 40
- Radius: r-sm (10px buttons/inputs), r-md (14px cards), r-lg (18px modals), r-pill (999px chips)
- Elevation: Prefer borders over shadows; use e2 for dropdowns, e3 for modals
- Motion: Fast transitions (120-260ms), no bouncy easing, respect `prefers-reduced-motion`

**Layout Structure**:
- Top App Bar: 56-64px height, search-centered, minimal actions
- Left Sidebar: 240-280px desktop, collapses to overlay on mobile
- Main Content: Scrollable, max-width constraints for readability
- Right AI Panel: Collapsible chat drawer (ChatGPT-inspired)

**Component Patterns**:
- Nav items: 40-44px height, subtle hover (surface-2), active state with accent-soft + accent left indicator
- Cards: Outlined by default, border + r-md radius, hover adds border-strong + e1 elevation
- Buttons: Primary (accent bg), Secondary (outlined), Tertiary (ghost), all r-sm radius
- Inputs: 40-44px height, r-sm radius, 2px accent focus ring
- Tooltips: Appear on hover (250ms delay) or click, max-width 260-320px

**AI Chat Panel Specifics**:
- Message stream: 14-18px vertical gap, max 640-760px content width
- Composer: r-lg radius, strong visual anchor at bottom, left attachment + middle input + right send button
- Project dropdown: Chip-like pill select
- Feature toggles: Toggle chips (off: surface + border, on: accent-soft + accent icon)

## Common Commands

### Initial Setup
```bash
npm install
# or
pnpm install
# or
yarn install
```

### Development
```bash
npm run dev
# Runs Next.js development server (typically http://localhost:3000)
```

### Building
```bash
npm run build
# Production build

npm run start
# Start production server
```

### Database (Prisma)
```bash
npx prisma generate
# Generate Prisma Client after schema changes

npx prisma migrate dev --name <migration-name>
# Create and apply a new migration

npx prisma studio
# Open Prisma Studio to view/edit database
```

### Linting & Formatting
```bash
npm run lint
# Run ESLint (if configured)

npx prettier --write .
# Format code (if Prettier configured)
```

## Development Workflow

### When implementing a new feature:

1. **Read the spec**: Check `Docs/FEATURE_<N>.md` for detailed implementation requirements
2. **Review design tokens**: Reference `Docs/STYLE_GUIDE.md` for all UI decisions
3. **Follow the tech stack**: Use Next.js App Router patterns, Tailwind utilities, shadcn/ui components
4. **Component structure**: Create components in `components/` organized by feature or shell
5. **Route structure**: Use `app/(app)/` route group for pages that share the app shell
6. **Styling approach**: Use CSS variables for tokens, Tailwind for utilities, avoid inline styles
7. **Accessibility**: Ensure 48x48px touch targets, clear focus indicators, keyboard navigation
8. **Testing**: Create temporary test code, verify functionality, then delete test code

### File organization patterns (when codebase exists):

```
app/
  (app)/              # Route group for app shell
    layout.tsx        # AppShell wrapper
    projects/         # Projects feature
    proforma/         # Pro forma feature
    ai/               # AI chat feature
    settings/         # Settings
  globals.css         # Global styles + CSS variables
components/
  shell/              # AppShell, SidebarNav, TopBar
  ui/                 # shadcn/ui components
lib/
  cn.ts               # className utilities
  prisma.ts           # Prisma client
hooks/                # React hooks
```

## Important Context

- **Current State**: Repository contains specification documents only (no source code yet)
- **First Implementation**: Feature 1 (App Shell) as defined in `Docs/FEATURE_1.md`
- **Styling Reference**: All UI decisions must align with Drive-like aesthetic in `Docs/STYLE_GUIDE.md`
- **No Custom Scrollbars**: Use native scrolling for "vanilla scroll" feel
- **Motion Sensitivity**: Always implement `prefers-reduced-motion` support
- **Modular Components**: Build reusable components that can be understood by junior engineers

## Key Files to Reference

- `Docs/TECH_STACK.md` - Technology choices and rationale
- `Docs/STYLE_GUIDE.md` - Complete design system and UI patterns
- `Docs/FEATURE_LIST.md` - Feature roadmap and scope
- `Docs/FEATURE_1.md` - Detailed spec for App Shell implementation
- `Docs/PROMPT_TEMPLATE.md` - Critical development rules

## Design Principles

1. **Content-first**: White backgrounds, high clarity, minimal chrome
2. **Subtle interactions**: Quiet hover states, no flashy animations
3. **Keyboard-friendly**: Obvious focus states, full keyboard navigation
4. **Consistent patterns**: Reuse components, maintain token system
5. **Clean code**: Modular, commented appropriately, junior-friendly
6. **Performance**: Fast transitions (120-260ms), respect user motion preferences
