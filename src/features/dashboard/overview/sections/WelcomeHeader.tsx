"use client";

import { TrendBadge } from "@/components/shared/TrendBadge";
import { formatChange, formatINRCompact, greetingFor } from "@/lib/format";
import { cn } from "@/lib/utils";

type WelcomeHeaderProps = {
  firstName: string;
  rentCollectedRate: number;
  occupancyRate: number;
  complaintsSolvedRate: number;
  revenue: number;
  revenueChange: number;
  netProfit: number;
  netProfitChange: number;
  overdueCount: number;
  overdueAmount: number;
};

/** Greeting, three health bars and the three numbers that matter most this month. */
export function WelcomeHeader(props: WelcomeHeaderProps) {
  const now = new Date();
  const date = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(now);

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div className="min-w-0">
        <p className="text-xs font-medium tracking-[0.14em] text-subtle uppercase" suppressHydrationWarning>
          {date}
        </p>
        <h1 className="mt-2 text-[34px] leading-tight font-normal tracking-[-0.04em] sm:text-[42px]" suppressHydrationWarning>
          {greetingFor(now)}, <span className="text-muted-foreground">{props.firstName}</span>{" "}
          <span aria-hidden>👋</span>
        </h1>

        <div className="mt-6 grid max-w-[640px] grid-cols-3 gap-3">
          <HealthBar label="Rent collected" value={props.rentCollectedRate} fill="bg-brand shadow-[0_0_18px_-2px_rgba(236,58,141,0.6)]" />
          <HealthBar label="Occupancy" value={props.occupancyRate} fill="bg-[#f4f4f7]" />
          <HealthBar label="Complaints solved" value={props.complaintsSolvedRate} fill="stripes" />
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-4 sm:gap-10">
        <Kpi badge={<TrendBadge tone="success">{formatChange(props.revenueChange)}</TrendBadge>} value={formatINRCompact(props.revenue)} label="Revenue this month" />
        <Kpi badge={<TrendBadge tone="success">{formatChange(props.netProfitChange)}</TrendBadge>} value={formatINRCompact(props.netProfit)} label="Net profit" />
        <Kpi badge={<TrendBadge tone="danger">{formatINRCompact(props.overdueAmount)}</TrendBadge>} value={String(props.overdueCount)} label="Overdue payments" />
      </dl>
    </section>
  );
}

function HealthBar({ label, value, fill }: { label: string; value: number; fill: string }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2 text-xs sm:text-[13px]">
        <span className="truncate text-foreground">{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-9 rounded-full bg-[#2a2a33] p-1"
      >
        <div className={cn("h-full rounded-full", fill)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Kpi({ badge, value, label }: { badge: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-col items-start">
      {badge}
      <dd className="mt-1.5 text-[30px] leading-none font-normal tracking-[-0.04em] sm:text-[40px]">{value}</dd>
      <dt className="mt-2 text-xs text-muted-foreground sm:text-[13px]">{label}</dt>
    </div>
  );
}
