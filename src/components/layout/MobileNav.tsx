"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/** Bottom bar on phones and tablets, replacing the sidebar. Shows the first 5 sections. */
export function MobileNav() {
  const pathname = usePathname();
  const items = mainNav.slice(0, 6);

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-3 bottom-3 z-30 flex items-center justify-around rounded-[22px] border border-border bg-shell/95 px-2 py-2 shadow-2xl backdrop-blur-xl lg:hidden"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.href);
        const className = cn(
          "relative flex min-w-14 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-[11px]",
          active ? "text-foreground" : "text-muted-foreground"
        );
        const inner = (
          <>
            <Icon className={cn("size-5", active && "text-brand")} />
            <span className="max-w-[72px] truncate">{item.label.split(" ")[0]}</span>
            {item.badge ? <span className="absolute top-1 right-3 size-2 rounded-full bg-danger" aria-hidden /> : null}
          </>
        );
        return item.ready ? (
          <Link key={item.href} href={item.href} className={className} aria-current={active ? "page" : undefined}>
            {inner}
          </Link>
        ) : (
          <button key={item.href} type="button" aria-disabled title="Coming soon" className={className}>
            {inner}
          </button>
        );
      })}
    </nav>
  );
}
