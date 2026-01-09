import { FolderKanban, Calculator, Sparkles, Receipt, Settings, type LucideIcon } from "lucide-react";

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  title: string;
}

/**
 * Navigation configuration - single source of truth for app navigation
 * Used by SidebarNav and TopBar for consistent navigation across the app
 */
export const navItems: NavItem[] = [
  {
    key: "projects",
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
    title: "Projects",
  },
  {
    key: "proforma",
    label: "Pro Forma",
    href: "/proforma",
    icon: Calculator,
    title: "Pro Forma",
  },
  {
    key: "ai",
    label: "Tribunus AI",
    href: "/ai",
    icon: Sparkles,
    title: "Tribunus AI",
  },
  {
    key: "fee-calculator",
    label: "Fee Calculator",
    href: "/fee-calculator",
    icon: Receipt,
    title: "Fee Calculator",
  },
  {
    key: "settings",
    label: "Settings",
    href: "/settings",
    icon: Settings,
    title: "Settings",
  },
];

/**
 * Get page title from pathname
 */
export function getTitleFromPathname(pathname: string): string {
  const item = navItems.find((item) => pathname.startsWith(item.href));
  return item?.title || "Tribunus AI";
}
