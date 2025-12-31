# Feature 05 — Pro Forma / Scenario Planning (MVP Modeling UI)

## Objective
Build a **Pro Forma** page that lets a user:
- Select a **Project**
- Edit a small set of **assumptions** (form inputs)
- See **outputs** update instantly (live calculations)
- Adjust **scenario sliders** to see sensitivity (no complex cashflow engine)
- Manually **Save** assumptions per project (persist in Supabase)

No AI, no ingestion, no advanced IRR modeling required.

---

## Part A — Data Model (Supabase)

### A1) Table: `project_proformas`
Persist 1 base pro forma per project (MVP). Store assumptions as JSON.

**SQL migration**
```sql
create extension if not exists "pgcrypto";

create table if not exists public.project_proformas (
  project_id uuid primary key references public.projects(id) on delete cascade,
  updated_at timestamptz not null default now(),
  assumptions jsonb not null default '{}'::jsonb
);

create index if not exists project_proformas_updated_at_idx
on public.project_proformas(updated_at desc);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists trg_project_proformas_set_updated_at on public.project_proformas;
create trigger trg_project_proformas_set_updated_at
before update on public.project_proformas
for each row execute function public.set_updated_at();
A2) RLS (match existing pattern)
If your app has RLS on projects, mirror ownership checks for project_proformas.

If MVP runs without auth, skip RLS here.

Part B — Assumptions Schema (Developer-oriented but MVP-sized)
B1) Canonical TypeScript type
Create lib/proforma/types.ts:

ts
Copy code
export type ProFormaAssumptions = {
  // Program
  program: {
    units: number | null;
    saleableAreaSqft: number | null;      // gfa/saleable area used for revenue + cost per sqft
  };

  // Acquisition
  acquisition: {
    landPrice: number | null;             // CAD
    closingCostsPct: number | null;       // % of land price (legal, transfer taxes, etc) (MVP placeholder)
  };

  // Revenue
  revenue: {
    salePricePerSqft: number | null;      // CAD/sqft
    otherRevenue: number | null;          // CAD (parking, storage, misc)
    salesCommissionPct: number | null;    // % of total revenue (MVP placeholder)
  };

  // Costs
  costs: {
    hardCostPerSqft: number | null;       // CAD/sqft
    softCostPctOfHard: number | null;     // % of hard
    contingencyPctOfHard: number | null;  // % of hard
    contingencyPctOfSoft: number | null;  // % of soft
    devFeePctOfCost: number | null;       // % of (land + hard + soft + contingency) (MVP placeholder)
  };

  // Financing (simple interest approximation; not a full draw schedule)
  financing: {
    loanToCostPct: number | null;         // % LTC
    interestRatePct: number | null;       // annual %
    lenderFeePct: number | null;          // % of loan amount (one-time)
    interestCoverageFactor: number | null;// 0..1 multiplier for avg outstanding (MVP default 0.5)
  };

  // Timeline (used for interest approximation)
  timeline: {
    totalMonths: number | null;           // total project duration
  };

  // Scenario sliders (UI-only; not persisted unless user saves)
  scenario: {
    deltaSalePricePerSqftPct: number;     // e.g., -10..+10
    deltaHardCostPerSqftPct: number;      // e.g., -10..+10
    deltaInterestRatePct: number;         // e.g., -2..+2 (absolute points)
    deltaTotalMonths: number;             // e.g., -6..+6 months
  };
};
B2) Defaults (seed values)
Create lib/proforma/defaults.ts with:

Empty numeric fields as null

Scenario defaults as 0

Recommended default ranges:

sale price delta: [-10, +10] %

hard cost delta: [-10, +10] %

interest delta: [-2, +2] percentage points

months delta: [-6, +6]

B3) Validation (Zod)
Create lib/proforma/validation.ts:

Numbers must be finite; allow null

Percent fields: 0..100 (except interest delta which is -10..+10 absolute points in scenario)

totalMonths: 1..120

saleableAreaSqft: 1..5_000_000

Units: 1..50_000

interestCoverageFactor: 0..1 (default 0.5)

Part C — Calculation Engine (MVP)
C1) Compute function
Create lib/proforma/compute.ts:

Inputs:

base: ProFormaAssumptions

applyScenario: boolean (true for live display; false for base comparison)

Outputs:

ts
Copy code
export type ProFormaOutputs = {
  // derived inputs (after scenario)
  eff: {
    salePricePerSqft: number | null;
    hardCostPerSqft: number | null;
    interestRatePct: number | null;
    totalMonths: number | null;
  };

  // core $ values
  revenue: {
    grossRevenue: number | null;
    salesCommission: number | null;
    netRevenue: number | null;
  };

  costs: {
    landTotal: number | null;         // land + closing costs
    hard: number | null;
    soft: number | null;
    contingency: number | null;
    devFee: number | null;
    subtotalBeforeFinancing: number | null;
  };

  financing: {
    loanAmount: number | null;
    lenderFee: number | null;
    interest: number | null;
    totalFinancing: number | null;
  };

  totals: {
    totalCost: number | null;
    profit: number | null;
    profitMarginPct: number | null;   // profit / netRevenue
    equityNeeded: number | null;      // totalCost - loanAmount
    equityMultiple: number | null;    // (equity + profit)/equity
    roiPct: number | null;            // profit / equity
  };
};
C2) Formula rules (simple + deterministic)
Use these formulas with null-guarding (if required inputs missing → return null for dependent outputs):

Effective values after scenario

effSalePricePerSqft = salePricePerSqft * (1 + deltaSalePricePerSqftPct/100)

effHardCostPerSqft = hardCostPerSqft * (1 + deltaHardCostPerSqftPct/100)

effInterestRatePct = interestRatePct + deltaInterestRatePct

effTotalMonths = totalMonths + deltaTotalMonths
Clamp:

price/cost >= 0

interest >= 0

months >= 1

Revenue

grossRevenue = saleableAreaSqft * effSalePricePerSqft + otherRevenue

salesCommission = grossRevenue * (salesCommissionPct/100)

netRevenue = grossRevenue - salesCommission

Costs (pre-financing)

hard = saleableAreaSqft * effHardCostPerSqft

soft = hard * (softCostPctOfHard/100)

contHard = hard * (contingencyPctOfHard/100)

contSoft = soft * (contingencyPctOfSoft/100)

contingency = contHard + contSoft

landClosing = landPrice * (closingCostsPct/100)

landTotal = landPrice + landClosing

subtotalBeforeDevFee = landTotal + hard + soft + contingency

devFee = subtotalBeforeDevFee * (devFeePctOfCost/100)

subtotalBeforeFinancing = subtotalBeforeDevFee + devFee

Financing (approx)

loanAmount = subtotalBeforeFinancing * (loanToCostPct/100)

lenderFee = loanAmount * (lenderFeePct/100)

avgOutstanding = loanAmount * interestCoverageFactor (default 0.5)

interest = avgOutstanding * (effInterestRatePct/100) * (effTotalMonths/12)

totalFinancing = lenderFee + interest

Totals

totalCost = subtotalBeforeFinancing + totalFinancing

profit = netRevenue - totalCost

profitMarginPct = profit / netRevenue * 100

equityNeeded = totalCost - loanAmount

roiPct = profit / equityNeeded * 100

equityMultiple = (equityNeeded + profit) / equityNeeded

C3) Base vs Scenario comparison
Compute outputs twice:

baseOut = compute(base, false) (scenario deltas = 0)

scenarioOut = compute(base, true) (apply deltas)
Show deltas in UI (profit change, margin change, equity needed change).

Part D — Persistence + Data Access
D1) Queries
Create lib/proforma/queries.ts:

getProForma(projectId): Promise<ProFormaAssumptions | null>

returns project_proformas.assumptions or null if no row

Also provide:

ensureProFormaRow(projectId) to upsert defaults if missing.

D2) Server Actions
Create lib/proforma/actions.ts ('use server'):

saveProForma(projectId, assumptions: ProFormaAssumptions)

validate with Zod

strip scenario fields or persist them (MVP recommendation: persist scenario too for continuity)

upsert into project_proformas

revalidatePath('/proforma')

D3) Prefill from Project Profile (optional but recommended)
If Feature 03 stores:

proposal.unitsProposed

proposal.gfa or saleable area
Then when proforma row is missing, seed:

program.units from profile

program.saleableAreaSqft from profile

acquisition.landPrice left null
Implementation: in ensureProFormaRow, attempt to load profile; seed values if present.

Part E — UI / UX
E1) Route
Create:

app/proforma/page.tsx

Server component responsibilities:

Fetch projects list for selector (id + name)

Select active project from URL query param:

?projectId=<uuid>

If missing: show “Select a project” empty state (no form)

When project selected:

load proforma assumptions (ensure row exists)

render client component with initial data

E2) Client container
Create app/proforma/ProFormaClient.tsx (client):

Holds form state

Live computes outputs on each change

Manual Save button persists to DB

E3) Project selector (inside Pro Forma page)
Component: components/proforma/ProjectSelector.tsx (client)

Dropdown of projects

Selecting project updates URL projectId via router.replace()

Keeps other params if any

E4) Assumptions form (MVP fields)
Component: components/proforma/AssumptionsForm.tsx (client)
Use Cards + Accordion sections (similar to Project Profile):

Program

Acquisition

Revenue

Costs

Financing

Timeline

Inputs:

Use Input for numbers with CAD prefix text where needed

Use small helper text under each section (optional)

All fields are editable; scenario fields are not in this form (separate panel)

E5) Scenario controls (sliders)
Component: components/proforma/ScenarioControls.tsx (client)
Controls:

Sale price delta (%): slider -10..+10

Hard cost delta (%): slider -10..+10

Interest delta (pp): slider -2..+2

Duration delta (months): slider -6..+6

UI:

Show current value next to each slider

Add “Reset scenario” button (sets deltas to 0)

E6) Outputs panel
Component: components/proforma/OutputsPanel.tsx
Display cards:

Net Revenue

Total Cost

Profit

Profit Margin

Equity Needed

ROI (equity)
Also show a “Scenario Delta” strip:

Profit Δ

Margin Δ

Equity Δ

Formatting rules:

CAD formatting with Intl.NumberFormat('en-CA', { style:'currency', currency:'CAD' })

Percent to 1 decimal

If null: display —

E7) Save/Update controls
At top-right of page (or above form):

Primary button: Save

Secondary: Revert
State rules:

dirty = deep compare current assumptions to initial (use fast-deep-equal or JSON stringify stable)

Save disabled when not dirty or saving

On save success: toast “Saved”

On failure: toast with error

Revert resets to initial + scenario 0

E8) Loading/Empty states
If no project selected:

show centered empty state:

Title: Select a project

Subtitle: Choose a project to start modeling.

While loading proforma:

skeleton cards + form skeleton

Part F — URL Params (shareable)
Use:

projectId=<uuid> (required for active project)
Optional (not required):

view=inputs|outputs (mobile toggle)

Part G — Files to Create / Modify
Create
app/proforma/page.tsx

app/proforma/ProFormaClient.tsx

components/proforma/ProjectSelector.tsx

components/proforma/AssumptionsForm.tsx

components/proforma/ScenarioControls.tsx

components/proforma/OutputsPanel.tsx

lib/proforma/types.ts

lib/proforma/defaults.ts

lib/proforma/validation.ts

lib/proforma/compute.ts

lib/proforma/queries.ts

lib/proforma/actions.ts

supabase/migrations/<ts>_create_project_proformas.sql

Modify
Sidebar nav: add link to /proforma (if not already)

Part H — Modular Execution Checklist (AI Agent Tasks)
H1) DB
 Add migration for project_proformas

 Apply migration

H2) Pro forma library
 Add types + defaults

 Add Zod validation

 Add compute engine + formatting utilities

H3) Data access
 Implement get + ensure + save server action

 Optional: seed from project profile proposal fields

H4) UI
 Pro forma route + server loader

 Project selector (URL-driven)

 Assumptions form sections

 Scenario sliders

 Outputs panel + deltas

 Save/Revert + dirty tracking + toasts

H5) QA
 Selecting different project loads its saved assumptions

 Editing inputs updates outputs instantly

 Scenario sliders change outputs instantly (without saving)

 Save persists and survives refresh

 Null handling shows — without crashing

Acceptance Criteria
/proforma exists, looks clean, and is project-scoped via selector.

Minimal assumptions can be edited and saved per project.

Outputs update live as user changes assumptions and scenario sliders.

Save is manual and reliable; Revert restores last saved state.