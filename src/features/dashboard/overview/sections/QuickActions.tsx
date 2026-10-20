import {
  DoorOpen,
  Eye,
  Megaphone,
  ReceiptText,
  UserPlus,
  Users,
  LogIn,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ScheduleItem } from "@/types";

const ACTIONS: {
  label: string;
  icon: LucideIcon;
  href?: string;
}[] = [
  { label: "Send Notice", icon: Megaphone },
  {
    label: "Add Resident",
    icon: UserPlus,
    href: "/add-resident",
  },
  { label: "Add Expense", icon: ReceiptText },
  {
    label: "Add Staff",
    icon: Users,
    href: "/dashboard/staff/add",
  },
];

const KIND: Record<ScheduleItem["kind"], { icon: LucideIcon; className: string }> = {
  "check-in": { icon: LogIn, className: "bg-info/16 text-info" },
  visit: { icon: Eye, className: "bg-brand/16 text-brand" },
  maintenance: { icon: Wrench, className: "bg-danger/14 text-danger" },
  "move-out": { icon: DoorOpen, className: "bg-warning/14 text-warning" },
};

/** One-tap shortcuts for everyday jobs, plus what is planned for today. */
export function QuickActions({ schedule }: { schedule: ScheduleItem[] }) {
  return (
    <section className="relative flex h-full flex-col overflow-hidden rounded-[20px] border border-brand-blue/25 bg-[linear-gradient(165deg,rgba(82,108,255,0.20)_0%,rgba(82,108,255,0.07)_38%,var(--card)_75%)] p-5">
      <div aria-hidden className="pointer-events-none absolute -top-20 -right-16 size-52 rounded-full bg-brand-blue/25 blur-3xl" />

      <header className="relative mb-4">
        <h2 className="text-[17px] font-medium tracking-tight">Quick actions</h2>
        <p className="mt-0.5 text-[13px] text-muted-foreground">Common jobs, one tap away</p>
      </header>

      
<ul className="relative grid grid-cols-2 gap-2">
  {ACTIONS.map(({ label, icon: Icon, href }) => (
    <li key={label}>
      {href ? (
        <Link
          href={href}
          className="group flex w-full items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2.5 text-left text-[13px] transition-colors hover:border-brand-blue/50 hover:bg-brand-blue/15"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-blue/20 text-[#9aa8ff] transition-colors group-hover:bg-brand-blue group-hover:text-white">
            <Icon className="size-4" />
          </span>
          <span className="leading-tight">{label}</span>
        </Link>
      ) : (
        <button
          type="button"
          className="group flex w-full items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2.5 text-left text-[13px] transition-colors hover:border-brand-blue/50 hover:bg-brand-blue/15"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-blue/20 text-[#9aa8ff] transition-colors group-hover:bg-brand-blue group-hover:text-white">
            <Icon className="size-4" />
          </span>
          <span className="leading-tight">{label}</span>
        </button>
      )}
    </li>
  ))}
</ul>


      <div className="relative mt-5 flex items-center justify-between">
        <h3 className="text-sm font-medium">Today</h3>
        <span className="text-xs text-muted-foreground">{schedule.length} planned</span>
      </div>

      <ol className="relative mt-3 flex-1 space-y-0">
        {schedule.map((item, i) => {
          const kind = KIND[item.kind];
          const Icon = kind.icon;
          const last = i === schedule.length - 1;
          return (
            <li key={item.id} className="relative flex gap-3 pb-3.5 last:pb-0">
              {!last ? <span aria-hidden className="absolute top-8 bottom-0 left-[15px] w-px bg-white/10" /> : null}
              <span className={cn("relative grid size-8 shrink-0 place-items-center rounded-full", kind.className)}>
                <Icon className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1 pt-0.5 leading-tight">
                <p className="text-[11px] text-subtle">{item.time}</p>
                <p className="mt-0.5 truncate text-[13px]">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
