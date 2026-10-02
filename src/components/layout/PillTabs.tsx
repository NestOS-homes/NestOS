"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { TabItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/** Rounded tab switcher in the top bar. Each tab is its own page (URL). */
export function PillTabs({ tabs, className }: { tabs: TabItem[]; className?: string }) {
  const pathname = usePathname();
  if (tabs.length === 0) return null;

  return (
    <nav
      aria-label="Section tabs"
      className={cn(
        "no-scrollbar flex items-center gap-1 overflow-x-auto rounded-full border border-border bg-[#16161b] p-1",
        className
      )}
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-9 shrink-0 items-center rounded-full px-5 text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-linear-to-br from-[#41414c] to-[#30303a] font-medium text-foreground shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
