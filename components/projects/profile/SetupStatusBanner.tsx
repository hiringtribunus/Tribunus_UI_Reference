"use client";

import { CheckCircle2, Info } from "lucide-react";

interface SetupStatusBannerProps {
  status: "draft" | "complete";
}

/**
 * Setup status banner - shows project completion state
 * Complete: All required fields filled
 * Draft: Missing required fields
 */
export function SetupStatusBanner({ status }: SetupStatusBannerProps) {
  if (status === "complete") {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-success/10 border border-success/20 rounded-md">
        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-text">Project setup complete</p>
          <p className="text-xs text-text-3">
            All required fields are filled
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-info/10 border border-info/20 rounded-md">
      <Info className="w-5 h-5 text-info flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-text">
          Complete setup to unlock modeling + AI context
        </p>
        <p className="text-xs text-text-3">
          Required: Project name, Address, Zoning, Lot area, Application type,
          Primary use
        </p>
      </div>
    </div>
  );
}
