"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { SidebarNav } from "./SidebarNav";

interface MobileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * MobileSheet - Drawer for mobile navigation
 * Uses Radix UI Dialog for accessibility (focus trap, ESC key, etc.)
 */
export function MobileSheet({ open, onOpenChange }: MobileSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50",
            "bg-text/20 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />

        {/* Drawer panel */}
        <Dialog.Content
          className={cn(
            "fixed left-0 top-0 bottom-0 z-50",
            "w-[min(320px,85vw)] h-full",
            "bg-surface border-r border-border",
            "shadow-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
            "data-[state=closed]:duration-200 data-[state=open]:duration-200"
          )}
          aria-describedby={undefined}
        >
          {/* Close button */}
          <div className="absolute right-4 top-4">
            <Dialog.Close
              className={cn(
                "w-8 h-8 rounded-sm",
                "flex items-center justify-center",
                "hover:bg-surface-2 active:bg-surface-3",
                "transition-colors duration-150"
              )}
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5 text-text-2" />
            </Dialog.Close>
          </div>

          {/* Sidebar navigation */}
          <SidebarNav onNavigate={() => onOpenChange(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
