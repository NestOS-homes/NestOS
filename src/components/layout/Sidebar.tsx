"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { footerNav, mainNav, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

/** Left sidebar with the main sections of NestOS. Desktop only. */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-border bg-shell lg:flex">
      <div className="flex h-[76px] items-center px-6">
        <Link href="/dashboard" aria-label="NestOS home">
          <Logo />
        </Link>
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 pt-2">
        <p className="px-3 pb-2 text-[11px] font-medium tracking-[0.12em] text-subtle uppercase">Menu</p>
        <ul className="space-y-1">
          {mainNav.map((item) => (
            <li key={item.href}>
              <SidebarLink item={item} active={pathname.startsWith(item.href)} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-1 border-t border-border px-3 py-4">
        {footerNav.map((item) => (
          <SidebarLink key={item.href} item={item} active={pathname.startsWith(item.href)} />
        ))}
      </div>
    </aside>
  );
}

function SidebarLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  const content = (
    <>
      {active ? <span className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-brand" aria-hidden /> : null}
      <Icon className={cn("size-[18px]", active ? "text-brand" : "text-muted-foreground group-hover:text-foreground")} />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge ? (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-danger/15 px-1.5 text-[11px] font-semibold text-danger">
          {item.badge}
        </span>
      ) : null}
    </>
  );

  const base =
    "group relative flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring";

  if (item.ready) {
    return (
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(base, active ? "bg-white/[0.06] text-foreground" : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground")}
      >
        {content}
      </Link>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" aria-disabled className={cn(base, "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground")}>
          {content}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">Coming soon</TooltipContent>
    </Tooltip>
  );
}
