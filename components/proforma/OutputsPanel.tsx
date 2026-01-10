"use client";

import type { ProFormaOutputs } from "@/lib/proforma/types";
import {
  formatCAD,
  formatPercent,
  formatNumber,
} from "@/lib/utils/formatting";
import { cn } from "@/lib/cn";
import { Info } from "lucide-react";

type OutputsPanelProps = {
  baseOutputs: ProFormaOutputs;
  scenarioOutputs: ProFormaOutputs;
};

export function OutputsPanel({
  baseOutputs,
  scenarioOutputs,
}: OutputsPanelProps) {
  const profitValue = scenarioOutputs.totals.profit;
  const isProfitPositive = profitValue !== null && profitValue > 0;
  const isProfitNegative = profitValue !== null && profitValue < 0;

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Outputs</h3>

      {/* Computed Metrics */}
      <div>
        <h4 className="text-sm font-medium mb-2 text-gray-700">Computed Metrics</h4>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <MetricRow
            label="Gross Buildable Area (GBA)"
            value={formatNumber(scenarioOutputs.computed.grossBuildableArea, 0) + " sf"}
            tooltip="Site Area × FSR"
          />
          <MetricRow
            label="Net Saleable SF"
            value={formatNumber(scenarioOutputs.computed.netSaleableSF, 0) + " sf"}
            tooltip="GBA × Efficiency %"
          />
          <MetricRow
            label="Acres"
            value={formatNumber(scenarioOutputs.computed.acres, 2)}
            tooltip="Site Area ÷ 43,560"
          />
          <MetricRow
            label="Units per Acre"
            value={formatNumber(scenarioOutputs.computed.unitsPerAcre, 1)}
            tooltip="Units ÷ Acres"
          />
        </div>
      </div>

      {/* Density Benchmarks */}
      <div>
        <h4 className="text-sm font-medium mb-2 text-gray-700">Density Benchmarks</h4>
        <p className="text-xs text-gray-500 mb-2">Using Land Purchase Price only</p>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <MetricRow
            label="$ / Land SF"
            value={formatCAD(scenarioOutputs.densityBenchmarks.dollarPerLandSF)}
          />
          <MetricRow
            label="$ / Buildable SF"
            value={formatCAD(scenarioOutputs.densityBenchmarks.dollarPerBuildableSF)}
          />
          <MetricRow
            label="$ / Saleable SF"
            value={formatCAD(scenarioOutputs.densityBenchmarks.dollarPerSaleableSF)}
          />
          <MetricRow
            label="$ / Acre"
            value={formatCAD(scenarioOutputs.densityBenchmarks.dollarPerAcre)}
          />
        </div>
      </div>

      {/* Revenue */}
      <div>
        <h4 className="text-sm font-medium mb-2 text-gray-700">Revenue</h4>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <MetricRow
            label="Total Revenue"
            value={formatCAD(scenarioOutputs.revenue.totalRevenue)}
            tooltip="After scenario delta"
          />
          <MetricRow
            label="Selling Cost"
            value={formatCAD(scenarioOutputs.revenue.sellingCost)}
            tooltip="Revenue × Selling Cost %"
          />
          <MetricRow
            label="Selling Cost Add Back"
            value={formatCAD(scenarioOutputs.revenue.sellingCostAddBack)}
          />
          <MetricRow
            label="Net Revenue"
            value={formatCAD(scenarioOutputs.revenue.netRevenue)}
            valueClassName="font-semibold"
            tooltip="Revenue - Selling Cost + Add Back"
          />
        </div>
      </div>

      {/* Soft Costs */}
      <div>
        <h4 className="text-sm font-medium mb-2 text-gray-700">Soft Costs</h4>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <MetricRow
            label="Soft Base"
            value={formatCAD(scenarioOutputs.softCosts.softBase)}
            tooltip="Sum of all soft cost inputs"
          />
          <MetricRow
            label="Soft Contingency"
            value={formatCAD(scenarioOutputs.softCosts.softContingency)}
            tooltip="Soft Base × Contingency %"
          />
          <MetricRow
            label="Land & Soft Total"
            value={formatCAD(scenarioOutputs.softCosts.landAndSoftTotal)}
            valueClassName="font-semibold"
            tooltip="Capitalized Land + Soft Base + Soft Contingency"
          />
        </div>
      </div>

      {/* Hard Costs */}
      <div>
        <h4 className="text-sm font-medium mb-2 text-gray-700">Hard Costs</h4>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <MetricRow
            label="Hard Base"
            value={formatCAD(scenarioOutputs.hardCosts.hardContingencyBase)}
            tooltip="Construction + CM + Servicing (after scenario delta)"
          />
          <MetricRow
            label="Hard Contingency"
            value={formatCAD(scenarioOutputs.hardCosts.hardContingency)}
            tooltip="Hard Base × Contingency %"
          />
          <MetricRow
            label="Construction & Hard Total"
            value={formatCAD(scenarioOutputs.hardCosts.constructionAndHardTotal)}
            valueClassName="font-semibold"
            tooltip="Hard Base + Hard Contingency"
          />
        </div>
      </div>

      {/* Totals */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-3 text-gray-700">Totals</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KPICard
            label="Total Project Cost"
            value={formatCAD(scenarioOutputs.totals.totalProjectCost)}
            tooltip="Land & Soft Total + Construction & Hard Total"
          />
          <KPICard
            label="Profit"
            value={formatCAD(scenarioOutputs.totals.profit)}
            valueClassName={cn(
              isProfitPositive && "text-green-600",
              isProfitNegative && "text-red-600"
            )}
            tooltip="Net Revenue - Total Project Cost"
          />
          <KPICard
            label="Return on Cost"
            value={formatPercent(scenarioOutputs.totals.returnOnCostPct)}
            tooltip="Profit ÷ Total Project Cost"
          />
          <KPICard
            label="Revenue / Saleable SF"
            value={formatCAD(scenarioOutputs.totals.revenuePerSaleableSF)}
            tooltip="Net Revenue ÷ Net Saleable SF"
          />
        </div>
      </div>

      {/* Normalized Metrics */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-2 text-gray-700">Normalized Metrics</h4>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <MetricRow label="Soft $ / Unit" value={formatCAD(scenarioOutputs.softCosts.softBasePerUnit)} />
          <MetricRow label="Soft $ / Buildable SF" value={formatCAD(scenarioOutputs.softCosts.softBasePerBuildableSF)} />
          <MetricRow label="Soft $ / Saleable SF" value={formatCAD(scenarioOutputs.softCosts.softBasePerSaleableSF)} />
          <MetricRow label="Hard $ / Unit" value={formatCAD(scenarioOutputs.hardCosts.hardBasePerUnit)} />
          <MetricRow label="Hard $ / Buildable SF" value={formatCAD(scenarioOutputs.hardCosts.hardBasePerBuildableSF)} />
          <MetricRow label="Hard $ / Saleable SF" value={formatCAD(scenarioOutputs.hardCosts.hardBasePerSaleableSF)} />
        </div>
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  valueClassName,
  tooltip,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  tooltip?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-gray-100">
      <div className="flex items-center gap-1 text-gray-600">
        <span>{label}</span>
        {tooltip && (
          <span className="group relative">
            <Info className="h-3 w-3 text-gray-400" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 text-xs bg-gray-900 text-white rounded shadow-lg z-10">
              {tooltip}
            </span>
          </span>
        )}
      </div>
      <span className={cn("font-medium", valueClassName)}>{value}</span>
    </div>
  );
}

function KPICard({
  label,
  value,
  valueClassName,
  tooltip,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  tooltip?: string;
}) {
  return (
    <div className="border rounded-md p-4">
      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
        <span>{label}</span>
        {tooltip && (
          <span className="group relative">
            <Info className="h-3 w-3 text-gray-400" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 text-xs bg-gray-900 text-white rounded shadow-lg z-10">
              {tooltip}
            </span>
          </span>
        )}
      </div>
      <div className={cn("text-2xl font-semibold", valueClassName)}>
        {value}
      </div>
    </div>
  );
}
