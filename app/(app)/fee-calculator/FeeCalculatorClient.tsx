"use client";

import { useTransition, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FeeCalculatorAssumptions } from "@/lib/fee-calculator/types";
import { assumptionsSchema } from "@/lib/fee-calculator/validation";
import { defaultAssumptions } from "@/lib/fee-calculator/defaults";
import { computeFeeCalculator } from "@/lib/fee-calculator/compute";
import { saveFeeCalculator } from "@/lib/fee-calculator/actions";
import { useToast } from "@/hooks/use-toast";
import { ProjectSelector } from "@/components/proforma/ProjectSelector";
import { FeeCalculatorHeader } from "@/components/fee-calculator/FeeCalculatorHeader";
import { FeeCalculatorForm } from "@/components/fee-calculator/FeeCalculatorForm";
import { CostSummary } from "@/components/fee-calculator/CostSummary";

type Project = {
  id: string;
  name: string;
};

type FeeCalculatorClientProps = {
  initialProjects: Project[];
  selectedProjectId: string | null;
  initialAssumptions: FeeCalculatorAssumptions | null;
  projectName: string | null;
};

export function FeeCalculatorClient({
  initialProjects,
  selectedProjectId,
  initialAssumptions,
  projectName,
}: FeeCalculatorClientProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Initialize form with assumptions or defaults
  const form = useForm<FeeCalculatorAssumptions>({
    resolver: zodResolver(assumptionsSchema),
    defaultValues: initialAssumptions ?? defaultAssumptions,
  });

  const { handleSubmit, reset, formState, watch } = form;
  const { isDirty } = formState;

  // Watch all form values for live calculations
  const currentAssumptions = watch();

  // Compute outputs reactively
  const outputs = useMemo(() => {
    return computeFeeCalculator(currentAssumptions);
  }, [currentAssumptions]);

  // Save handler
  const onSave = handleSubmit((data) => {
    if (!selectedProjectId) {
      toast({
        title: "No project selected",
        description: "Please select a project first",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const result = await saveFeeCalculator(selectedProjectId, data);

      if (result.error) {
        toast({
          title: "Failed to save fee calculator",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fee calculator saved successfully",
        });
        // Clear dirty state
        reset(data);
      }
    });
  });

  // Revert handler
  const onRevert = () => {
    reset(initialAssumptions ?? defaultAssumptions);
  };

  // Empty state when no project selected
  if (!selectedProjectId) {
    return (
      <div className="h-full flex flex-col">
        <div className="border-b px-6 py-4">
          <h1 className="text-2xl font-semibold">Fee Calculator</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="max-w-md text-center space-y-4">
            <h2 className="text-lg font-medium">Select a project</h2>
            <p className="text-gray-600">
              Choose a project to start calculating fees.
            </p>
            <div className="flex justify-center mt-6">
              <ProjectSelector
                projects={initialProjects}
                selectedProjectId={null}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main fee calculator interface
  return (
    <div className="h-full flex flex-col">
      <FeeCalculatorHeader
        projectName={projectName}
        isDirty={isDirty}
        isPending={isPending}
        onSave={onSave}
        onRevert={onRevert}
      />

      <div className="flex-1 overflow-auto">
        <div className="px-6 py-4">
          <ProjectSelector
            projects={initialProjects}
            selectedProjectId={selectedProjectId}
          />
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Form */}
            <div className="flex-1 max-w-3xl">
              <FeeCalculatorForm form={form} outputs={outputs} />
            </div>

            {/* Right: Cost Summary (sticky on desktop) */}
            <div className="lg:w-80 lg:sticky lg:top-6 lg:self-start">
              <CostSummary outputs={outputs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
