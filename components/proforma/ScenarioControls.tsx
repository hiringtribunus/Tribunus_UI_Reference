"use client";

import { UseFormReturn } from "react-hook-form";
import type { ProFormaAssumptions } from "@/lib/proforma/types";
import { scenarioRanges } from "@/lib/proforma/defaults";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type ScenarioControlsProps = {
  form: UseFormReturn<ProFormaAssumptions>;
};

export function ScenarioControls({ form }: ScenarioControlsProps) {
  const { setValue, watch } = form;

  const deltaRevenuePct = watch("scenario.deltaRevenuePct");
  const deltaHardCostPct = watch("scenario.deltaHardCostPct");
  const deltaDurationMonths = watch("scenario.deltaDurationMonths");

  const handleReset = () => {
    setValue("scenario.deltaRevenuePct", 0);
    setValue("scenario.deltaHardCostPct", 0);
    setValue("scenario.deltaDurationMonths", 0);
  };

  return (
    <div className="border rounded-md p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Scenario Analysis</h3>
        <Button variant="outline" size="sm" onClick={handleReset}>
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        {/* Revenue Delta */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="scenario-revenue">Revenue Delta</Label>
            <span className="text-sm font-medium">
              {deltaRevenuePct > 0 ? "+" : ""}
              {deltaRevenuePct}%
            </span>
          </div>
          <input
            id="scenario-revenue"
            type="range"
            min={scenarioRanges.deltaRevenuePct.min}
            max={scenarioRanges.deltaRevenuePct.max}
            step={scenarioRanges.deltaRevenuePct.step}
            value={deltaRevenuePct}
            onChange={(e) =>
              setValue("scenario.deltaRevenuePct", parseFloat(e.target.value))
            }
            className="w-full"
          />
        </div>

        {/* Hard Cost Delta */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="scenario-hard-cost">Hard Cost Delta</Label>
            <span className="text-sm font-medium">
              {deltaHardCostPct > 0 ? "+" : ""}
              {deltaHardCostPct}%
            </span>
          </div>
          <input
            id="scenario-hard-cost"
            type="range"
            min={scenarioRanges.deltaHardCostPct.min}
            max={scenarioRanges.deltaHardCostPct.max}
            step={scenarioRanges.deltaHardCostPct.step}
            value={deltaHardCostPct}
            onChange={(e) =>
              setValue("scenario.deltaHardCostPct", parseFloat(e.target.value))
            }
            className="w-full"
          />
        </div>

        {/* Duration Delta */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="scenario-duration">Duration Delta (months)</Label>
            <span className="text-sm font-medium">
              {deltaDurationMonths > 0 ? "+" : ""}
              {deltaDurationMonths} months
            </span>
          </div>
          <input
            id="scenario-duration"
            type="range"
            min={scenarioRanges.deltaDurationMonths.min}
            max={scenarioRanges.deltaDurationMonths.max}
            step={scenarioRanges.deltaDurationMonths.step}
            value={deltaDurationMonths}
            onChange={(e) =>
              setValue("scenario.deltaDurationMonths", parseInt(e.target.value))
            }
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
