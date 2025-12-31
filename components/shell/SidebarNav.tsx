"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./nav";
import { cn } from "@/lib/cn";

interface SidebarNavProps {
  onNavigate?: () => void;
}

/**
 * SidebarNav - Primary navigation sidebar
 * Shows brand and navigation items with active state highlighting
 */
export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col h-full bg-surface">
      {/* Brand section */}
      <div className="flex items-center gap-2 px-4 py-6 border-b border-border">
        <span className="font-bold text-base text-text">TRIBUNUS</span>
      </div>

      {/* Navigation items */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5",
                    "rounded-sm",
                    "text-sm font-medium",
                    "transition-colors duration-150",
                    "relative",
                    // Active state
                    isActive && [
                      "bg-accent-soft text-accent",
                      // Left accent indicator
                      "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2",
                      "before:w-0.5 before:h-6 before:bg-accent before:rounded-r",
                    ],
                    // Hover state (not active)
                    !isActive && "text-text-2 hover:bg-surface-2 hover:text-text"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
