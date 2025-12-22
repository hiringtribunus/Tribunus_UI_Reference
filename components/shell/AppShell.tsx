"use client";

import { useState } from "react";
import { TopBar } from "./TopBar";
import { SidebarNav } from "./SidebarNav";
import { MobileSheet } from "./MobileSheet";
import { cn } from "@/lib/cn";

interface AppShellProps {
  children: React.ReactNode;
  title: string;
}

/**
 * AppShell - Main application layout wrapper
 * Provides:
 * - Responsive sidebar (persistent desktop, drawer mobile)
 * - Sticky top bar
 * - Independent scroll containers
 */
export function AppShell({ children, title }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Desktop sidebar - persistent on lg+ */}
      <aside
        className={cn(
          "hidden lg:flex",
          "w-[var(--sidebar-width)]",
          "border-r border-border",
          "flex-shrink-0"
        )}
      >
        <SidebarNav />
      </aside>

      {/* Mobile drawer */}
      <MobileSheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <TopBar title={title} onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
