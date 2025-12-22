# NEW SESSION GUIDE

This document provides context for continuing development of the Tribunus Labs UI project. Read this first when starting a new session.

**Last Updated**: December 21, 2024
**Current Status**: Features 1 & 2 Complete, Feature 3 Ready to Implement

---

## Quick Summary

✅ **Feature 1: App Shell + Google-Drive Layout** - COMPLETE
✅ **Feature 2: Projects List + CRUD** - COMPLETE
📋 **Feature 3: Project Profile + Zoning Map** - Plan Approved, Ready to Implement

---

## What's Been Completed

### Feature 1: App Shell (COMPLETE)

**Files Created**:
```
app/
  layout.tsx
  page.tsx
  globals.css
  (app)/
    layout.tsx
    projects/page.tsx
    proforma/page.tsx
    ai/page.tsx
    settings/page.tsx

components/shell/
  AppShell.tsx
  TopBar.tsx
  SidebarNav.tsx
  MobileSheet.tsx
  nav.ts

lib/
  cn.ts
```

**Capabilities**:
- Global layout with sidebar + top bar
- 4 navigable pages
- Fully responsive (desktop sidebar, mobile drawer)
- Complete design token system in `globals.css`
- Accessible keyboard navigation

### Feature 2: Projects CRUD (COMPLETE)

**Files Created**:
```
lib/projects/
  types.ts
  queries.ts
  actions.ts

lib/supabase/
  client.ts
  server.ts
  mock.ts

components/projects/
  ProjectsClient.tsx
  ProjectsToolbar.tsx
  ProjectsGrid.tsx
  ProjectCard.tsx
  ProjectsList.tsx
  ProjectsEmptyState.tsx
  CreateProjectDialog.tsx
  RenameProjectDialog.tsx
  DeleteProjectDialog.tsx
  ProjectActionsMenu.tsx

app/(app)/projects/
  page.tsx
  [projectId]/
    page.tsx
    not-found.tsx

components/ui/
  (8 shadcn components installed)
```

**Capabilities**:
- Full CRUD (Create, Rename, Delete)
- Grid and List views
- Real-time search (debounced 300ms)
- Sort by: Last Modified, Date Created, Name A-Z
- URL-driven state (shareable, bookmarkable)
- Mock data layer (3 sample projects)
- Project detail stub page
- Drive-like UI with hover states

**Tech Stack Used**:
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Zod validation
- date-fns
- Supabase SDK (ready to integrate)

---

## Current Project State

### Dependencies Installed

```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.15",
    "@supabase/supabase-js": "latest",
    "@supabase/ssr": "latest",
    "clsx": "^2.1.1",
    "lucide-react": "^0.562.0",
    "next": "^15",
    "react": "^18",
    "react-dom": "^18",
    "tailwind-merge": "^3.4.0",
    "zod": "latest",
    "date-fns": "latest",
    "class-variance-authority": "latest"
  }
}
```

### File Structure

```
TribunusLabs_UI_PM/
├── app/
│   ├── (app)/          # Route group with AppShell
│   ├── globals.css     # Design tokens
│   └── layout.tsx      # Root layout
├── components/
│   ├── shell/          # AppShell, TopBar, SidebarNav
│   ├── projects/       # 10 project components
│   └── ui/             # 8 shadcn components
├── lib/
│   ├── projects/       # types, queries, actions
│   ├── supabase/       # client, server, mock
│   └── cn.ts
├── Docs/
│   ├── FEATURE_1.md
│   ├── FEATURE_2.md
│   ├── FEATURE_3.md    # ← NEXT TO IMPLEMENT
│   ├── FEATURE_LIST.md
│   ├── PROMPT_TEMPLATE.md
│   ├── STYLE_GUIDE.md
│   ├── TECH_STACK.md
│   ├── SUPABASE_SETUP.md
│   └── NEW_SESSION.md  # ← You are here
├── CLAUDE.md
└── README.md
```

### Build Status

- ✅ Production build successful
- ✅ No TypeScript errors
- ✅ No ESLint errors
- ✅ All routes working
- ✅ Mock data functional

---

## What's Next: Feature 3

### Overview

Implement a **Project Profile page** with 50+ form fields and an interactive zoning map placeholder.

**Key Requirements**:
- 5 form sections (Overview, Site & Legal, Planning, Proposal, Documents)
- Manual save with dirty tracking
- Setup status computation (draft vs. complete)
- Interactive map with dummy zoning overlay
- Mock geocoding for addresses
- Responsive 2-column layout (form + map)

### Approved Implementation Plan

**Phase 1: Dependencies**
- Install: `react-hook-form`, `@hookform/resolvers`
- Install shadcn: `accordion`, `checkbox`, `textarea`, `toast`, `badge`, `separator`

**Phase 2: Data Layer**
- Create `lib/projects/profile-types.ts` - TypeScript types + Zod schemas
- Create `lib/projects/profile-defaults.ts` - Default profile + 15-item checklist
- Extend `lib/supabase/mock.ts` - Add profile storage
- Create `lib/projects/profile-queries.ts` - Fetch project + profile
- Create `lib/projects/profile-actions.ts` - Update profile with validation

**Phase 3: Map Components**
- Create `lib/maps/dummy-zoning.ts` - Generate 8-12 zones around center
- Create `components/maps/ZoningPlaceholderMap.tsx` - SVG/Canvas placeholder
- Create `components/maps/MapLegend.tsx` - Interactive legend

**Phase 4-5: Form Sections**
- Create `components/projects/profile/ProfileFormSection.tsx` - Wrapper
- Create `components/projects/profile/OverviewSection.tsx` - 6 fields
- Create `components/projects/profile/SiteLegalSection.tsx` - 7 fields
- Create `components/projects/profile/PlanningSection.tsx` - 8 fields + checkboxes
- Create `components/projects/profile/ProposalSection.tsx` - 10 fields + FSR calc
- Create `components/projects/profile/DocumentChecklistSection.tsx` - 15 items

**Phase 6: Main Components**
- Create `components/projects/profile/SetupStatusBanner.tsx` - Draft/Complete indicator
- Create `components/projects/profile/ProfileHeader.tsx` - Breadcrumb + buttons
- Create `components/projects/profile/ProjectProfileClient.tsx` - Main form coordinator
- Update `app/(app)/projects/[projectId]/page.tsx` - Fetch and render profile

**Phase 7: Validation & Computed Fields**
- Implement FSR auto-calculation (GFA / Lot Area)
- Implement setup status logic (6 required fields)
- Client + server validation with Zod

**Phase 8: Polish**
- Toast notifications
- Responsive layout (2-col → 1-col)
- Accessibility
- Loading states

**Phase 9: Mock Geocoding**
- Create `lib/maps/mock-geocode.ts` - Simulated geocoding
- Integrate with update action

**Phase 10: Testing**
- Create 3 test profiles (empty, draft, complete)
- Test all form functionality
- Test map interactions
- Test validation

**Phase 11: Documentation**
- Create `Docs/MAPBOX_SETUP.md` - Future Mapbox integration guide
- Create `Docs/PROFILE_MIGRATION.md` - Mock → Supabase migration
- Update `README.md`

### Expected File Count

**~20 new files**:
- 9 form section components
- 4 main components (header, banner, client, form wrapper)
- 2 map components
- 5 data/lib files

---

## Important Development Notes

### Critical Rules (from PROMPT_TEMPLATE.md)

1. **Always run light tests** which you later delete after testing success
2. **Write modular code** that a junior engineer can understand
3. **No documentation dumps** - inline comments are sufficient
4. **Plan well, think hard, then execute** until complete
5. **Stay on task** - don't assume or get ahead of requirements
6. **Always read .md files in full** before implementing
7. **Stay on TECH_STACK.md** - keep it vibe coding friendly
8. **Follow STYLE_GUIDE.md** for all UI decisions
9. **Think holistically** - don't blindly copy minor details from specs

### Design System (STYLE_GUIDE.md)

**Colors**:
- bg: #FFFFFF
- accent: #1A73E8
- surface-2: #F7F8FA (hover/fill)
- border: #E6E8EC
- text: #111827

**Spacing**: 4px grid (8, 12, 16, 24, 32, 40)

**Radius**: r-sm (10px buttons), r-md (14px cards), r-lg (18px modals)

**Motion**: 120-200ms transitions, respect `prefers-reduced-motion`

**Typography**: Inter font, 14-15px body, 16-18px section titles

### Mock Data Approach

**Why Mock First**:
- Faster development iteration
- No external dependencies
- Easy to test
- Clear migration path

**When to Integrate Real Backend**:
- After feature is working end-to-end
- Follow `Docs/SUPABASE_SETUP.md`
- Uncomment Supabase code in queries/actions
- Comment out mock calls

### Code Quality Standards

- ✅ TypeScript strict mode
- ✅ Zod validation on all inputs
- ✅ Server Actions for mutations
- ✅ Proper error handling
- ✅ Accessible (ARIA, keyboard nav)
- ✅ Responsive design
- ✅ No ESLint warnings

---

## How to Start Feature 3 Implementation

### Step 1: Review Context

Read in this order:
1. `Docs/FEATURE_3.md` - Full feature specification
2. `Docs/PROMPT_TEMPLATE.md` - Development rules
3. `Docs/STYLE_GUIDE.md` - UI guidelines (quick refresh)

### Step 2: Verify Current State

```bash
npm run dev
```

Visit http://localhost:3000/projects - Should see 3 sample projects

### Step 3: Start Implementation

Follow the plan above, module by module. Recommended order:

1. **Install dependencies first** (react-hook-form, shadcn components)
2. **Create data layer** (types, defaults, mock storage)
3. **Build map placeholder** (standalone, can test independently)
4. **Build form sections one by one** (test each in isolation)
5. **Wire everything together** in ProjectProfileClient
6. **Add validation and computed fields**
7. **Polish and test**

### Step 4: Testing Strategy

Create test profiles in mock data:
- Empty profile (just defaults)
- Draft profile (some fields filled, not complete)
- Complete profile (all required fields)

Test each section independently before integration.

### Step 5: Key Decisions Already Made

- ✅ Use mock data (not real Supabase yet)
- ✅ Use static map placeholder (not real Mapbox yet)
- ✅ Manual save (not auto-save)
- ✅ Single Update button (not per-section)
- ✅ Accordion sections (collapsible)
- ✅ 2-column layout (form left, map right)

---

## Common Commands

```bash
# Development
npm run dev

# Build (test for errors)
npm run build

# Install new dependency
npm install <package-name>

# Install shadcn component
npx shadcn@latest add <component-name>
```

---

## Quick Reference: Project Structure

### Form Fields by Section

**Overview (6 fields)**:
- projectDisplayName, siteAddress, city, province, postalCode, notes

**Site & Legal (7 fields)**:
- pid, legalDescription, lotArea (value + unit), lotDimensions (width/depth/frontage), titleNotes

**Planning (8 fields + checkboxes)**:
- currentZoning, ocpDesignation, 3 DPA checkboxes, 5 constraint checkboxes, variancesRequested

**Proposal (10 fields + 1 computed)**:
- applicationType, primaryUse, unitsProposed, gfa (value + unit), storeys, heightM, siteCoveragePct, parking (required/provided/notes), FSR (computed)

**Documents (15 items)**:
- Checklist of standard development documents with status tracking

### Setup Status Logic

Complete when ALL exist:
- overview.projectDisplayName ✓
- overview.siteAddress ✓
- planning.currentZoning ✓
- siteLegal.lotArea.value > 0 ✓
- proposal.applicationType ✓
- proposal.primaryUse ✓

Otherwise: Draft

### Map Placeholder

- Center: Coquitlam (49.283764, -122.793205) or project coordinates
- Zones: 8-12 rectangles (RS, RM, RT, C, M, P)
- Legend: Toggle zone visibility
- Hover: Show zone code/label
- Click: Highlight zone
- Pin: Show project location

---

## Troubleshooting

### If Build Fails

1. Check for TypeScript errors: `npm run build`
2. Check ESLint: Files should not have apostrophes in JSX (use `&apos;`)
3. Missing dependency: Check if you installed `class-variance-authority`

### If Mock Data Not Showing

1. Check `lib/supabase/mock.ts` has data
2. Verify queries are calling mock functions
3. Check browser console for errors

### If Styling Looks Wrong

1. Verify `app/globals.css` has all CSS variables
2. Check `tailwind.config.ts` extends theme correctly
3. Ensure component uses `cn()` utility for className merging

---

## Success Criteria for Feature 3

When complete, you should be able to:

- ✓ Click a project from the list
- ✓ See project profile page with all 5 sections
- ✓ Edit any field (changes not saved until Update clicked)
- ✓ Click Update to save (toast shows success)
- ✓ Click Cancel to revert (dirty state cleared)
- ✓ See "Draft" or "Complete" banner based on fields
- ✓ See map with dummy zones and legend
- ✓ Hover/click zones for interaction
- ✓ Refresh page and see saved data
- ✓ FSR auto-calculates when lot area + GFA exist
- ✓ Document checklist tracks status per item

---

## Contact & Resources

- **CLAUDE.md**: Comprehensive guide for AI assistants
- **README.md**: Project overview and getting started
- **STYLE_GUIDE.md**: Complete design system reference
- **FEATURE_3.md**: Full specification for next implementation

---

## Final Notes

**Feature 3 is the biggest feature yet** - 50+ fields, complex state management, and map integration. Take it slow, implement module by module, and test as you go.

**The plan is comprehensive and approved** - follow it step by step and you'll have a production-ready Project Profile page.

**Mock data is your friend** - don't worry about Supabase/Mapbox integration yet. Get the UI/UX perfect first, then swap backends later.

**Good luck! 🚀**

---

*Generated: December 21, 2024*
*Project: Tribunus Labs UI*
*Status: Ready for Feature 3 Implementation*
