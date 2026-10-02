import { ArrowUpRight } from "lucide-react";
import { StatusDot, type Tone } from "@/components/shared/StatusDot";
import { formatINRCompact } from "@/lib/format";

type RentCollectionCardProps = {
  monthLabel: string;
  rate: number;
  change: number;
  expected: number;
  collected: number;
  due: number;
  overdue: number;
};

/** Bright blue card: how much of this month's rent is in, out of what was expected. */
export function RentCollectionCard({ monthLabel, rate, change, expected, collected, due, overdue }: RentCollectionCardProps) {
  const rows: { label: string; value: number; tone: Tone }[] = [
    { label: "Collected", value: collected, tone: "success" },
    { label: "Due", value: due, tone: "warning" },
    { label: "Overdue", value: overdue, tone: "danger" },
  ];

  return (
    <section className="relative flex h-full flex-col overflow-hidden rounded-[20px] bg-linear-to-br from-[#5b78ff] via-brand-blue to-[#3a47e0] p-5 text-white shadow-[0_20px_60px_-20px_rgba(82,108,255,0.7)]">
      <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-white/15 blur-2xl" />

      <header className="relative flex items-start justify-between">
        <div>
          <h2 className="text-[17px] font-medium">Rent collection</h2>
          <p className="text-[13px] text-white/70">{monthLabel}</p>
        </div>
        <button
          type="button"
          aria-label="View rent and payments"
          className="grid size-9 place-items-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
        >
          <ArrowUpRight className="size-4" />
        </button>
      </header>

      <p className="relative mt-4 text-[52px] leading-none font-normal tracking-[-0.05em]">{rate}%</p>
      <p className="relative mt-2 text-[13px] text-white/85">
        {formatINRCompact(collected)} of {formatINRCompact(expected)} expected
      </p>

      <p className="relative mt-3 text-[13px] leading-snug text-white/90">
        Good progress. You are ahead of last month by <span className="font-semibold">{change}%</span>.
      </p>

      <div className="relative mt-4 space-y-1.5 text-[11px] text-white/75">
        <div className="flex items-center gap-2">
          <span className="w-16">This month</span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
            <span className="block h-full rounded-full bg-white" style={{ width: `${rate}%` }} />
          </span>
          <span className="w-7 text-right text-white">{rate}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-16">Last month</span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
            <span className="block h-full rounded-full bg-white/50" style={{ width: `${rate - change}%` }} />
          </span>
          <span className="w-7 text-right">{rate - change}%</span>
        </div>
      </div>

      <ul className="relative mt-auto space-y-2 pt-4">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between rounded-xl bg-white/[0.94] px-3.5 py-2.5 text-[13px] text-[#22242a]">
            <span className="flex items-center gap-2">
              <StatusDot tone={row.tone} className={row.tone === "success" ? "bg-[#17b57a]" : row.tone === "warning" ? "bg-[#f59e0b]" : "bg-[#ef4444]"} />
              {row.label}
            </span>
            <span className="font-bold">{formatINRCompact(row.value)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
