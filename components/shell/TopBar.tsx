"use client";

import { Menu, Search, HelpCircle, Bell, User } from "lucide-react";
import { cn } from "@/lib/cn";

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
}

/**
 * TopBar - Sticky header with title, search, and actions
 * Height: 56px mobile, 64px desktop
 */
export function TopBar({ title, onMenuClick }: TopBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-surface border-b border-border",
        "h-[var(--topbar-height-mobile)] lg:h-[var(--topbar-height-desktop)]",
        "flex items-center gap-4 px-4 lg:px-6"
      )}
    >
      {/* Hamburger menu - mobile only */}
      <button
        onClick={onMenuClick}
        className={cn(
          "lg:hidden",
          "w-10 h-10 rounded-sm",
          "flex items-center justify-center",
          "hover:bg-surface-2 active:bg-surface-3",
          "transition-colors duration-150"
        )}
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5 text-text" />
      </button>

      {/* Page title */}
      <h1 className="text-base lg:text-lg font-semibold text-text whitespace-nowrap">
        {title}
      </h1>

      {/* Search input - centered/left-weighted like Drive */}
      <div className="flex-1 max-w-2xl mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
          <input
            type="search"
            placeholder="Search..."
            className={cn(
              "w-full h-10 pl-10 pr-4",
              "bg-surface-2 border border-transparent",
              "rounded-pill",
              "text-sm text-text placeholder:text-placeholder",
              "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-border",
              "transition-all duration-150"
            )}
            aria-label="Search"
          />
        </div>
      </div>

      {/* Right-side actions */}
      <div className="flex items-center gap-1">
        {/* Help button */}
        <button
          className={cn(
            "w-10 h-10 rounded-sm",
            "flex items-center justify-center",
            "hover:bg-surface-2 active:bg-surface-3",
            "transition-colors duration-150"
          )}
          aria-label="Help"
        >
          <HelpCircle className="w-5 h-5 text-text-2" />
        </button>

        {/* Notifications button */}
        <button
          className={cn(
            "w-10 h-10 rounded-sm",
            "flex items-center justify-center",
            "hover:bg-surface-2 active:bg-surface-3",
            "transition-colors duration-150"
          )}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-text-2" />
        </button>

        {/* User avatar */}
        <button
          className={cn(
            "w-8 h-8 rounded-full",
            "bg-accent text-white",
            "flex items-center justify-center",
            "hover:bg-accent-hover",
            "transition-colors duration-150"
          )}
          aria-label="User menu"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
