# Tribunus Labs UI

A Google Drive-inspired real estate development project management platform with integrated AI assistance.

## Getting Started

### Development Server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
  (app)/              # App route group with shared AppShell layout
    projects/         # Projects page
    proforma/         # Pro forma modeling page
    ai/               # Tribunus AI chat page
    settings/         # Settings page
    layout.tsx        # AppShell wrapper
  layout.tsx          # Root layout with Inter font
  globals.css         # Global styles and design tokens
  page.tsx            # Root redirect to /projects

components/
  shell/              # App shell components
    AppShell.tsx      # Main layout wrapper
    TopBar.tsx        # Sticky header
    SidebarNav.tsx    # Navigation sidebar
    MobileSheet.tsx   # Mobile drawer
    nav.ts            # Navigation configuration

lib/
  cn.ts               # className utility (clsx + tailwind-merge)
```

## Design System

### Design Tokens (CSS Variables)

All design tokens are defined in `app/globals.css` and mapped to Tailwind utilities:

- **Colors**: Drive-like palette with accent blue (#1A73E8)
- **Spacing**: 4px base grid (8, 12, 16, 24, 32, 40)
- **Radius**: xs (6px), sm (10px), md (14px), lg (18px), pill (999px)
- **Typography**: Inter font, 14-15px body text

### Key Features

✅ **Responsive Layout**
- Desktop: Persistent sidebar (280px) + sticky top bar
- Mobile: Hamburger menu with slide-out drawer

✅ **Accessibility**
- Keyboard navigation support
- Focus indicators
- ARIA labels and current page indicators
- Reduced motion support

✅ **Clean, Minimal UI**
- White backgrounds
- Subtle borders and elevations
- Smooth transitions (120-200ms)
- Native scrolling

## Current Implementation

**Feature 1: App Shell + Google-Drive Layout** ✅ Complete

- Global application layout with sidebar and top bar
- 4 navigable pages: Projects, Pro Forma, Tribunus AI, Settings
- Fully responsive (desktop persistent sidebar, mobile drawer)
- Complete design token system
- Accessible keyboard navigation

**Feature 2: Projects List + CRUD** ✅ Complete

- Projects index with Grid and List views
- Create, Rename, and Delete projects
- Search by name or address (real-time, debounced)
- Sort by Last Modified, Date Created, or Name (A-Z)
- URL-driven state (shareable, bookmarkable)
- Mock data layer (ready for Supabase integration)
- Project detail stub page
- Drive-like UI with hover states and actions menu

## Next Steps

Refer to `Docs/FEATURE_LIST.md` for upcoming features:
- Feature 3: Project Profile with Zoning Map
- Feature 4: Data Sources Library
- Feature 5: Pro Forma Modeling
- Feature 6: AI Chat Interface

### Supabase Integration

Currently using mock data. To switch to real Supabase:
1. Follow setup instructions in `Docs/SUPABASE_SETUP.md`
2. Add environment variables to `.env.local`
3. Uncomment Supabase code in `lib/projects/queries.ts` and `lib/projects/actions.ts`
4. Comment out mock data calls

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)
- **Validation**: Zod
- **Database**: Supabase (Postgres) - ready to integrate
- **Date Formatting**: date-fns

## Development Guidelines

All development must follow the rules in `Docs/PROMPT_TEMPLATE.md`:

1. Write modular, junior-friendly code
2. Use minimal, useful comments
3. No documentation dumps
4. Stay on the specified tech stack
5. Follow `Docs/STYLE_GUIDE.md` for all UI decisions

See `CLAUDE.md` for comprehensive guidance for AI coding assistants.
