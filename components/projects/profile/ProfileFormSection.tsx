"use client";

import { ReactNode } from "react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface ProfileFormSectionProps {
  value: string;
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * Wrapper component for profile form sections
 * Uses Accordion for collapsible sections
 */
export function ProfileFormSection({
  value,
  title,
  description,
  children,
}: ProfileFormSectionProps) {
  return (
    <AccordionItem value={value} className="border border-border rounded-md px-4">
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex flex-col items-start text-left">
          <h3 className="text-base font-medium text-text">{title}</h3>
          {description && (
            <p className="text-sm text-text-3 mt-0.5">{description}</p>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 pb-6">
        <div className="space-y-4">{children}</div>
      </AccordionContent>
    </AccordionItem>
  );
}
