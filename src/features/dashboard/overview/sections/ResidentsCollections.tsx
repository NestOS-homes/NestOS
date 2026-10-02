import { BellRing, LogIn, ReceiptText } from "lucide-react";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatusDot, type Tone } from "@/components/shared/StatusDot";
import { Progress } from "@/components/ui/progress";
import { formatINR, formatINRCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CheckIn, PaymentRecord, PaymentStatus, ResidentSummary } from "@/types";
import { ViewButton } from "./RoomsOccupancy";

const STATUS: Record<PaymentStatus, { label: string; tone: Tone; bar: string }> = {
  paid: { label: "Paid", tone: "success", bar: "bg-success" },
  due: { label: "Due", tone: "warning", bar: "bg-warning" },
  overdue: { label: "Overdue", tone: "danger", bar: "bg-danger" },
};

type ResidentsCollectionsProps = {
  monthLabel: string;
  residents: ResidentSummary;
  payments: PaymentRecord[];
  checkIns: CheckIn[];
  collected: number;
  expected: number;
  due: number;
  overdue: number;
  collectionRate: number;
};

/** Who has paid this month, who hasn't, and who to chase. */
export function ResidentsCollections(props: ResidentsCollectionsProps) {
  const { residents, payments } = props;
  const groups: { status: PaymentStatus; count: number; amount: number }[] = [
    { status: "paid", count: residents.paid, amount: props.collected },
    { status: "due", count: residents.due, amount: props.due },
    { status: "overdue", count: residents.overdue, amount: props.overdue },
  ];

  return (
    <SectionCard
      title="Residents & collections"
      description={`${props.monthLabel} rent · ${residents.total} residents`}
      action={<ViewButton label="View residents" />}
    >
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Summary */}
        <div className="flex flex-col">
          <div className="flex items-end gap-2">
            <p className="text-[44px] leading-none font-normal tracking-[-0.05em]">{residents.total}</p>
            <p className="pb-1 text-sm text-muted-foreground">residents this month</p>
          </div>

          <p className="mt-5 mb-2 text-xs text-muted-foreground">Payment status</p>
          <div className="flex h-3 gap-0.5 overflow-hidden rounded-full" aria-hidden>
            {groups.map((g) => (
              <div key={g.status} className={cn("h-full first:rounded-l-full last:rounded-r-full", STATUS[g.status].bar)} style={{ width: `${(g.count / residents.total) * 100}%` }} />
            ))}
          </div>

          <dl className="mt-3 grid grid-cols-3 gap-2.5">
            {groups.map((g) => (
              <div key={g.status} className="surface-tile rounded-xl px-3 py-2.5">
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <StatusDot tone={STATUS[g.status].tone} />
                  {STATUS[g.status].label}
                </dt>
                <dd className="mt-1 text-xl leading-none font-medium">{g.count}</dd>
                <dd className="mt-1 text-[11px] text-subtle">{formatINRCompact(g.amount)}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5">
            <div className="mb-2 flex items-baseline justify-between text-xs">
              <span className="text-muted-foreground">Collection progress</span>
              <span>
                <span className="font-medium text-foreground">{formatINRCompact(props.collected)}</span>
                <span className="text-muted-foreground"> of {formatINRCompact(props.expected)} · {props.collectionRate}%</span>
              </span>
            </div>
            <Progress value={props.collectionRate} aria-label="Rent collected" className="h-2 bg-[#2a2a33]" indicatorClassName="bg-success" />
          </div>

          <div className="mt-6">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-medium">
              <LogIn className="size-4 text-info" /> Arriving today
            </h3>
            <ul className="space-y-2">
              {props.checkIns.map((c) => (
                <li key={c.bed} className="surface-tile flex items-center gap-3 rounded-xl px-3 py-2.5">
                  <InitialsAvatar name={c.residentName} initials={c.initials} size="sm" />
                  <span className="min-w-0 flex-1 truncate text-sm">{c.residentName}</span>
                  <span className="text-xs text-muted-foreground">Bed {c.bed}</span>
                  <StatusBadge tone="info" withDot={false}>
                    {c.time}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Follow-ups and recent payments */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium">Follow up & recent payments</h3>
            <span className="text-xs text-muted-foreground">Overdue first</span>
          </div>
          <ul className="divide-y divide-white/[0.06] rounded-2xl border border-border">
            {payments.map((p) => (
              <PaymentRow key={p.id} payment={p} />
            ))}
          </ul>
        </div>
      </div>
    </SectionCard>
  );
}

function PaymentRow({ payment: p }: { payment: PaymentRecord }) {
  const s = STATUS[p.status];
  const needsReminder = p.status !== "paid";

  return (
    <li className="flex items-center gap-3 px-3.5 py-2.5">
      <InitialsAvatar name={p.residentName} initials={p.initials} />
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-sm">{p.residentName}</p>
        <p className="text-xs text-muted-foreground">Bed {p.room}</p>
      </div>
      <div className="hidden w-[170px] sm:block">
        <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
        <p className={cn("mt-1 text-[11px]", p.status === "overdue" ? "text-danger" : "text-subtle")}>
          {p.note}
          {p.method ? ` · ${p.method}` : ""}
        </p>
      </div>
      <p className="w-[78px] text-right text-sm font-medium tabular-nums">{formatINR(p.amount)}</p>
      <button
        type="button"
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center gap-1.5 rounded-full text-xs font-medium transition-colors sm:w-[92px]",
          needsReminder ? "bg-brand/15 text-brand hover:bg-brand/25" : "bg-white/[0.06] text-muted-foreground hover:text-foreground"
        )}
      >
        {needsReminder ? <BellRing className="size-3.5" /> : <ReceiptText className="size-3.5" />}
        <span className="sr-only sm:not-sr-only">{needsReminder ? "Remind" : "Receipt"}</span>
      </button>
    </li>
  );
}
