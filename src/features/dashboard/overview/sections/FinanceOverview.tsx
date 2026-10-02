"use client";

import { useState } from "react";
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { SectionCard } from "@/components/shared/SectionCard";
import { formatINR, formatINRCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { FinanceRange, FinanceSummary } from "@/types";

const RANGES: { id: FinanceRange; label: string }[] = [
  { id: "12m", label: "12 months" },
  { id: "30d", label: "30 days" },
  { id: "7d", label: "1 week" },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  expenses: { label: "Expenses", color: "var(--chart-2)" },
} satisfies ChartConfig;

/** Revenue vs expenses over time, with totals and profit for the chosen period. */
export function FinanceOverview({ finance }: { finance: FinanceSummary }) {
  const [range, setRange] = useState<FinanceRange>("30d");
  const series = finance.series[range];
  const profit = series.totalRevenue - series.totalExpenses;
  const tickInterval = range === "30d" ? 5 : range === "12m" ? 1 : 0;

  return (
    <SectionCard
      title="Revenue performance"
      description="Money in vs money out"
      action={<RangePicker value={range} onChange={setRange} />}
      bodyClassName="flex flex-col"
    >
      {/* Legend with totals, so colour is never the only clue */}
      <dl className="mb-4 grid grid-cols-3 gap-3">
        <LegendStat label="Revenue" value={formatINRCompact(series.totalRevenue)} swatch="bg-chart-1" />
        <LegendStat label="Expenses" value={formatINRCompact(series.totalExpenses)} swatch="bg-chart-2" />
        <LegendStat label="Profit" value={formatINRCompact(profit)} valueClassName="text-success" />
      </dl>

      <ChartContainer config={chartConfig} className="mt-auto aspect-auto h-[240px] w-full">
        <ComposedChart data={series.points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 4" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            interval={tickInterval}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={48}
            tickCount={4}
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) => formatINRCompact(v)}
          />
          <ChartTooltip cursor={{ stroke: "rgba(255,255,255,0.18)", strokeDasharray: "4 4" }} content={<FinanceTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-revenue)"
            strokeWidth={2.5}
            fill="url(#revenueFill)"
            activeDot={{ r: 5, stroke: "var(--card)", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="var(--color-expenses)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, stroke: "var(--card)", strokeWidth: 2 }}
          />
        </ComposedChart>
      </ChartContainer>
    </SectionCard>
  );
}

function RangePicker({ value, onChange }: { value: FinanceRange; onChange: (r: FinanceRange) => void }) {
  return (
    <div role="radiogroup" aria-label="Time range" className="flex rounded-full border border-border bg-[#16161b] p-0.5">
      {RANGES.map((r) => (
        <button
          key={r.id}
          type="button"
          role="radio"
          aria-checked={value === r.id}
          onClick={() => onChange(r.id)}
          className={cn(
            "h-7 rounded-full px-3 text-xs transition-colors",
            value === r.id ? "bg-[#34343e] font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

function LegendStat({
  label,
  value,
  swatch,
  valueClassName,
}: {
  label: string;
  value: string;
  swatch?: string;
  valueClassName?: string;
}) {
  return (
    <div className="surface-tile rounded-xl px-3 py-2.5">
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {swatch ? <span aria-hidden className={cn("h-[3px] w-3.5 rounded-full", swatch)} /> : null}
        {label}
      </dt>
      <dd className={cn("mt-1 text-lg leading-none font-medium tracking-tight", valueClassName)}>{value}</dd>
    </div>
  );
}

type TooltipProps = {
  active?: boolean;
  payload?: { payload: { fullLabel: string; revenue: number; expenses: number } }[];
};

function FinanceTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="min-w-[170px] rounded-xl border border-border bg-popover/95 px-3 py-2.5 text-xs shadow-xl backdrop-blur">
      <p className="mb-1.5 font-medium text-foreground">{point.fullLabel}</p>
      <TooltipRow color="bg-chart-1" label="Revenue" value={formatINR(point.revenue)} />
      <TooltipRow color="bg-chart-2" label="Expenses" value={formatINR(point.expenses)} />
      <div className="mt-1.5 border-t border-border pt-1.5">
        <TooltipRow label="Profit" value={formatINR(point.revenue - point.expenses)} />
      </div>
    </div>
  );
}

function TooltipRow({ color, label, value }: { color?: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-0.5">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {color ? <span aria-hidden className={cn("size-2 rounded-full", color)} /> : null}
        {label}
      </span>
      <span className="font-medium text-foreground tabular-nums">{value}</span>
    </div>
  );
}
