"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { getTitleFromPathname } from "@/components/shell/nav";

/**
 * App layout - Wraps all app pages with the AppShell
 * Automatically derives page title from current pathname
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = getTitleFromPathname(pathname);

  return <AppShell title={title}>{children}</AppShell>;
}
