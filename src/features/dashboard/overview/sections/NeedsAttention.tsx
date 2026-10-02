import { ArrowRight, BellRing, Clock, DoorOpen, LogIn, Wrench, type LucideIcon } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { toneSoft } from "@/components/shared/StatusDot";
import { cn } from "@/lib/utils";
import type { AttentionItem } from "@/types";

const ICONS: Record<AttentionItem["id"], LucideIcon> = {
  "overdue-rent": BellRing,
  "urgent-complaints": Wrench,
  "check-ins": LogIn,
  vacating: DoorOpen,
};

const BUTTON: Record<AttentionItem["tone"], string> = {
  danger: "bg-danger/14 text-danger hover:bg-danger/22",
  warning: "bg-warning/14 text-warning hover:bg-warning/22",
  info: "bg-info/16 text-info hover:bg-info/24",
};

type NeedsAttentionProps = {
  items: AttentionItem[];
  /** How many complaints have been open for more than a day. */
  staleComplaints: number;
};

/** The "do this now" list. Most urgent first, one clear button each. */
export function NeedsAttention({ items, staleComplaints }: NeedsAttentionProps) {
  const total = items.reduce((sum, i) => sum + i.count, 0);

  return (
    <SectionCard
      title="Needs attention"
      description="Things to handle today"
      action={<span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs text-muted-foreground">{total} items</span>}
      bodyClassName="flex flex-col"
    >
      <ul className="space-y-2.5">
        {items.map((item) => {
          const Icon = ICONS[item.id];
          return (
            <li key={item.id} className="surface-tile flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl p-3">
              <div className={cn("relative grid size-11 shrink-0 place-items-center rounded-xl", toneSoft[item.tone])}>
                <Icon className="size-[18px]" />
                <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-foreground text-[11px] font-bold text-background">
                  {item.count}
                </span>
              </div>
              <div className="min-w-[170px] flex-1 basis-[170px]">
                <p className="truncate text-sm font-medium">
                  {item.count} {item.title.toLowerCase()}
                </p>
                <p className="truncate text-xs text-muted-foreground" title={item.detail}>
                  {item.detail}
                </p>
              </div>
              <button
                type="button"
                className={cn(
                  "group ml-auto flex h-8 shrink-0 items-center gap-1 rounded-full px-3 text-xs font-medium transition-colors",
                  BUTTON[item.tone]
                )}
              >
                {item.actionLabel}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </li>
          );
        })}
      </ul>

      {staleComplaints > 0 ? (
        <p className="mt-auto flex items-center gap-2 pt-4 text-xs text-muted-foreground">
          <Clock className="size-4 shrink-0" />
          <span>
            <span className="font-semibold text-foreground">{staleComplaints} complaints</span> have been open for more than 24 hours.
          </span>
        </p>
      ) : null}
    </SectionCard>
  );
}
