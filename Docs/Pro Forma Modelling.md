# Pro Forma Modelling

## Page Scope
This report enumerates every user input and scenario slider currently implemented on the Pro Forma page, based on the live UI components.

## Project Selection
- Project (dropdown selector): selects the active project and loads its Pro Forma assumptions.

## Page Header
- Title: "Pro Forma" (appends project name when selected)
- Save / Revert controls (see Save / Revert section)

## Assumptions Form (User Inputs)
All inputs are numeric fields. Sections are shown as accordion panels.

### Program
- Units
- Saleable Area (sq ft)

### Acquisition
- Land Price (CAD)
- Closing Costs (%)

### Revenue
- Sale Price (CAD/sq ft)
- Other Revenue (CAD)
- Sales Commission (%)

### Costs
- Hard Cost (CAD/sq ft)
- Soft Cost (% of Hard)
- Contingency - Hard (%)
- Contingency - Soft (%)
- Dev Fee (% of Cost)

### Financing
- Loan to Cost (%)
- Interest Rate (%)
- Lender Fee (%)
- Interest Coverage Factor (0-1)
  - Placeholder shown as 0.5

### Timeline
- Total Project Duration (months)

## Scenario Analysis (Sliders)
Scenario sliders are range inputs that apply deltas to the base assumptions. The current delta value is displayed beside each slider.

- Sale Price Delta
  - Indicates: % change applied to Sale Price (CAD/sq ft)
  - Range: -10% to +10%, step 1%
- Hard Cost Delta
  - Indicates: % change applied to Hard Cost (CAD/sq ft)
  - Range: -10% to +10%, step 1%
- Interest Rate Delta
  - Indicates: absolute percentage-point change applied to Interest Rate (%)
  - Range: -2.0pp to +2.0pp, step 0.1pp
- Duration Delta
  - Indicates: months added to/subtracted from Total Project Duration
  - Range: -6 to +6 months, step 1

Additional scenario control:
- Reset: sets all scenario deltas back to 0.

## Outputs Panel (Read-only)
Outputs update live based on the current assumptions and scenario deltas.

### KPI Cards
- Net Revenue
- Total Cost
- Profit
- Profit Margin
- Equity Needed
- ROI

### Scenario Impact Strip
- Profit Δ
- Margin Δ
- Equity Δ

## Save / Revert Controls
These actions are part of the Pro Forma header and operate on the full assumptions state.
- Save: persists current assumptions for the selected project.
- Revert: restores the last saved assumptions (clears unsaved edits).

## Empty State (No Project Selected)
- Title: "Select a project"
- Subtitle: "Choose a project to start modeling."
- Project selector dropdown remains available
