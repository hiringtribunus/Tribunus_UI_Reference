Styling Guide (Repo-Ready): “Drive-Smooth Dashboard + Chat-Style AI Panel”

Purpose: a single source-of-truth styling spec your repo + AI coding tools (Cursor/Claude) can reference to keep the UI clean, minimal, white-first, and Google-Drive smooth, with an AI chat composer inspired by ChatGPT.

1) North Star
Visual goals

Content-first, white background, high clarity.

Minimal borders + subtle elevation (no heavy shadows).

Soft rounded corners everywhere (cards, modals, inputs, chips).

“Vanilla scroll”: native scrolling, no custom scrollbars, no scroll-jank.

Drive-like scanning: lists that feel light, airy, sortable, and fast.

Chat-like clarity: AI panel with a calm message stream + strong composer.

Interaction goals

Everything feels immediately responsive.

Hover states are quiet (border tint + slight lift), not flashy.

Focus states are obvious (keyboard-first friendly).

2) Foundations (Design Tokens)

Use these as the canonical tokens for the whole app. Don’t freestyle per-page.

2.1 Color system (Light mode default)

Neutrals

bg (App background): #FFFFFF

surface (Panels / cards): #FFFFFF

surface-2 (Soft fill for inputs, hovers): #F7F8FA

surface-3 (Subtle section background): #F2F4F7

border (Hairline): #E6E8EC

border-strong: #D4D8DE

Text

text (Primary): #111827

text-2 (Secondary): #4B5563

text-3 (Muted): #6B7280

placeholder: #9CA3AF

Brand / Accent (Drive-ish “blue”)

accent: #1A73E8 (primary action, active toggle, links)

accent-hover: #1667D9

accent-soft (selected bg): #E8F0FE

accent-border: #BBD3FF

Status

success: #16A34A

warning: #F59E0B

danger: #DC2626

info: #2563EB

Rules

Default is neutral. Use accent only for true emphasis (primary actions, selected state, links).

Avoid colored backgrounds except accent-soft and gentle status tints.

2.2 Typography

Font stack (recommended)

Primary: Inter (clean SaaS standard) OR Google Sans / Roboto if you want more “Google”.

Fallback: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial

Type scale (desktop-first)

Display / page title: 24–28 / 600

Section title: 16–18 / 600

Body: 14–15 / 400–500

Caption / meta: 12–13 / 400–500

Rules

Body text should be 14–15 with comfortable line height (1.4–1.6).

Use weight changes sparingly; most hierarchy should come from size + spacing.

2.3 Spacing + layout rhythm

8px feel, 4px grid

Base unit: 4px

Common spacing: 8, 12, 16, 24, 32, 40

Standard page padding: 24px desktop, 16px mobile

List row height: 44–52px (depending on density)

2.4 Shape (rounded corners)

Use a consistent radius scale across all rectangular UI elements (cards, dialogs, inputs, buttons). Material’s shape system is explicitly based on a corner-radius scale for components.

Radius scale

r-xs: 6 (small chips, tight UI)

r-sm: 10 (inputs, buttons)

r-md: 14 (cards, panels)

r-lg: 18 (modals, large containers)

r-pill: 999 (pills/chips)

Rules

Cards/panels: r-md

Dialogs: r-lg

Buttons/inputs: r-sm

Chips/toggles: r-pill or r-sm (depending on style)

2.5 Elevation (shadow)

Principle: Mostly “outlined” surfaces; elevation only on hover/active and a few key layers.

Elevation levels

e0: none (default surfaces)

e1: subtle (hovered cards)

e2: overlays (dropdowns, popovers)

e3: modals

Rules

Prefer borders over shadows.

Dropdowns/popovers should feel like they float (e2), but still quiet.

2.6 Motion (fast, desktop-optimized)

Desktop UI transitions should feel snappy—Material guidance commonly uses ~150–200ms for desktop transitions.

Durations

Micro (hover): 120–160ms

Standard (expand/collapse, panel open): 160–220ms

Heavy (modal enter): 200–260ms (never “floaty”)

Rules

Avoid bouncy easing for productivity UI.

No parallax. No fancy scroll animation.

3) App Layout (Drive-like Shell)
3.1 Main structure

Top App Bar (fixed): search + quick actions + user menu

Left Sidebar (persistent on desktop): primary nav + workspace/projects

Main Content Canvas: file/folder grid or list + detail pages

Right AI Panel (optional): collapsible chat drawer/panel

3.2 Responsive behavior

Desktop: sidebar visible, AI panel docked or slide-in

Tablet: sidebar collapses to icons, AI panel becomes overlay

Mobile: sidebar becomes bottom nav or hamburger drawer; AI chat full-screen modal/screen

4) Core Components (Drive-inspired)
4.1 Top App Bar

Look

Height: 56–64px

Background: surface

Bottom border: border

Search field centered/left-weighted like Drive

Search

Rounded input (r-pill or r-lg)

Soft fill (surface-2)

Clear “x” button appears when typing

4.2 Left Sidebar

Look

Width: 240–280px desktop

Background: surface

Right border: border

Section headers: muted caps or small 12–13px label

Nav item

Height: 40–44px

Hover: surface-2

Active: accent-soft background + accent left indicator (2–3px)

4.3 Folder grid tiles (Drive-like)

Use outlined cards as default (Material cards support outlined/filled/elevated patterns).

Tile spec

Container: surface, border border, radius r-md

Padding: 12–14px

Title: 14–15 / 500

Meta: 12–13 / muted

Hover: border -> border-strong + slight elevation (e1)

Selected: accent-soft fill + accent-border

Actions

“kebab” icon appears on hover (subtle)

Checkbox selection appears on hover + selected state

4.4 File list rows (Drive-like “table-light”)

Row spec

Height: 44–52px

Hover: surface-2

Selected: accent-soft

Columns: Name | Owner/Project | Updated | Size | Actions

Rules

No heavy gridlines—use a single header divider + row hover.

Keep sorting controls minimal and consistent.

4.5 Buttons (minimal, Google-ish)

Primary

Background: accent

Text: white

Radius: r-sm

Hover: accent-hover

Secondary

Background: surface

Border: border-strong

Text: text

Tertiary (text / ghost)

Background: transparent

Hover: surface-2

Icon button

40x40 hit area (even if icon is 18–20px)

Hover: surface-2

Active: surface-3

4.6 Inputs (Drive + ChatGPT clean)

Default input

Height: 40–44px

Background: surface

Border: border

Radius: r-sm

Focus ring: 2px accent-border + border accent

Textarea

Same as input, but grows smoothly (no jitter)

Keep resize off unless a power-user screen

4.7 Tooltips (“?” icons everywhere)

Behavior

Appears on hover and click

Delay (hover): ~250ms

Click: stays until click outside / Esc

Look

Max width: 260–320px

Background: text (dark tooltip) OR surface with strong border

Padding: 10–12px

Radius: r-sm

Shadow: e2

Text: 12–13px, high contrast

5) AI Chat Panel (ChatGPT-inspired styling)
5.1 Panel layout

Header row: Project dropdown + feature toggles (chips/icon toggles)

Message stream: calm, readable, roomy

Composer: strong visual anchor at bottom

5.2 Message stream

Spacing

Vertical gap: 14–18px between messages

Max content width inside panel: 640–760px (prevents ultra-wide text)

Message styling

Assistant: neutral (no bubble or very soft bubble)

User: slightly tinted bubble (surface-2) or right-aligned minimal bubble

Code blocks (if any): surface-3 with mono font, radius r-sm, subtle border

Meta

Small timestamp/meta: 12px muted

Optional avatar: simple circular, neutral

5.3 Composer (the “hero”)

Container

Background: surface

Border: border-strong

Radius: r-lg or r-pill feel

Padding: 10–12px

Shadow: minimal (or none) but should feel “present”

Inside the composer

Left: attachment / add button (icon)

Middle: expanding text input

Right: send button (primary icon button)

States

Empty: placeholder muted

Typing: border slightly stronger

Disabled: muted everything, clear reason text nearby

5.4 Project dropdown (inside chat)

Style

Chip-like select (pill)

Default: surface-2 with border border

Open: border accent + subtle shadow e2

Selected option: accent-soft + accent text/icon

5.5 Feature toggles (web search, counsel reports, etc.)

You described: “click and icon turns blue when on”.

Use “Toggle Chips”

Off: surface + border border

Hover: surface-2

On: accent-soft fill + accent icon/text + accent-border border

Hit area: at least 40px tall; comfortable spacing between toggles

Rule

Only one visual language for “ON”: blue.

Don’t introduce multiple “on colors” (green, purple, etc.) unless it’s status.

6) Data-Dense Screens (Dashboards)
KPI cards

Outlined cards, minimal chart ink

Titles: 12–13 muted

Values: 22–28 semibold

Delta badges: small pill with status tint

Tables

Sticky header optional

Row hover mandatory

Inline actions hidden until hover to reduce noise

Empty states

Icon + one-line headline + one helper sentence

One primary action button, one secondary link max

7) Accessibility & Usability Baselines

Minimum touch target: 48x48dp (~9mm) is widely recommended in Material guidance.

Clear focus indicators for keyboard navigation.

Color is never the only indicator (selected rows should have both tint + check/indicator).

8) “Do / Don’t” Rules (to keep it Drive-clean)

Do

Use whitespace as the main design tool.

Use borders first, shadows second.

Keep icons consistent stroke weight.

Keep all hover states subtle and consistent.

Don’t

No heavy gradients.

No glassmorphism.

No animated backgrounds.

No custom scrollbars.

No crowded toolbars (hide secondary actions until hover or overflow menu).