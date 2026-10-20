
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  IndianRupee,
  ReceiptText,
  Wallet,
} from "lucide-react";
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { properties } from "@/data/mock/property";
import { rooms } from "@/data/mock/rooms";
import { payments } from "@/data/mock/residents";
import { getFinanceSummary } from "@/data/mock/finance";
import {
  fixedExpenses,
  staffExpenses,
  financeHistory,
  type FinanceExpense,
} from "./finance-data";

type Period = "week" | "month" | "custom";

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const shortMoney = (amount: number) => {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}k`;
  return money(amount);
};

const dateLabel = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`min-w-0 rounded-[20px] border border-border bg-card p-4 sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

function KpiCard({
  label,
  amount,
  detail,
  icon,
  tone = "normal",
}: {
  label: string;
  amount: string;
  detail: string;
  icon: React.ReactNode;
  tone?: "normal" | "positive" | "warning";
}) {
  const iconTone =
    tone === "positive"
      ? "border-success/20 bg-success/10 text-success"
      : tone === "warning"
        ? "border-warning/20 bg-warning/10 text-warning"
        : "border-brand/20 bg-brand/10 text-brand";

  return (
    <div className="rounded-[18px] border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div
          className={`grid size-9 shrink-0 place-items-center rounded-xl border ${iconTone}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight">{amount}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function StatusPill({ status }: { status: FinanceExpense["status"] }) {
  const styles: Record<FinanceExpense["status"], string> = {
    paid: "border-success/20 bg-success/10 text-success",
    pending: "border-warning/20 bg-warning/10 text-warning",
    pending_approval: "border-brand/20 bg-brand/10 text-brand",
    rejected: "border-danger/20 bg-danger/10 text-danger",
  };

  const labels: Record<FinanceExpense["status"], string> = {
    paid: "Paid",
    pending: "Unpaid",
    pending_approval: "Awaiting approval",
    rejected: "Rejected",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export function FinanceTab() {
  const [propertyId, setPropertyId] = useState("all");
  const [period, setPeriod] = useState<Period>("month");
  const [comparison, setComparison] = useState("previous");
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-10-31");
  const [expenseFilter, setExpenseFilter] = useState<"all" | "fixed" | "staff">("all");
  const [historyDetail, setHistoryDetail] = useState<string | null>(null);
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [remindedIds, setRemindedIds] = useState<string[]>([]);

  const summary = useMemo(() => getFinanceSummary(new Date()), []);

  const isSunriseSelected = propertyId === "all" || propertyId === "sunrise";

  const visibleFixed = useMemo(
    () => (isSunriseSelected ? fixedExpenses : []),
    [isSunriseSelected],
  );
  const visibleStaff = useMemo(
    () => (isSunriseSelected ? staffExpenses : []),
    [isSunriseSelected],
  );

  const allExpenses = useMemo(
    () => [...visibleFixed, ...visibleStaff],
    [visibleFixed, visibleStaff],
  );

  const filteredExpenses = allExpenses.filter((expense) => {
    if (expenseFilter === "fixed") return expense.type === "fixed";
    if (expenseFilter === "staff") return expense.type === "staff";
    return true;
  });

  const pendingApprovals = visibleStaff.filter(
    (expense) =>
      expense.status === "pending_approval" &&
      !approvedIds.includes(expense.id) &&
      !rejectedIds.includes(expense.id),
  );

  const fixedTotal = visibleFixed.reduce((sum, expense) => sum + expense.amount, 0);
  const staffTotal = visibleStaff
    .filter((expense) => !rejectedIds.includes(expense.id))
    .reduce((sum, expense) => sum + expense.amount, 0);
  const totalExpenses = fixedTotal + staffTotal;

  const chartData = useMemo(() => {
    const source =
      period === "week"
        ? summary.series["7d"].points
        : summary.series["30d"].points;

    return source.map((point) => ({
      label: point.label,
      income: point.revenue,
      expenses: Math.round(
        point.expenses * (totalExpenses / (summary.expenses || 1)),
      ),
      net: point.revenue - Math.round(point.expenses * (totalExpenses / (summary.expenses || 1))),
    }));
  }, [period, summary, totalExpenses]);

  const bedDetails = rooms.flatMap((room) =>
    room.beds.map((bed) => ({
      ...bed,
      roomNumber: room.number,
      floor: room.floor,
      rent: bed.status === "available" ? 0 : 6000,
    })),
  );

  const vacantBeds = bedDetails.filter((bed) => bed.status === "available");
  const vacatingBeds = bedDetails.filter((bed) => bed.status === "vacating");
  const occupiedBeds = bedDetails.filter((bed) => bed.status !== "available");
  const totalBeds = bedDetails.length;
  const occupancyRate = totalBeds
    ? Math.round((occupiedBeds.length / totalBeds) * 100)
    : 0;
  const vacancyPotential = vacantBeds.length * 6000;
  const upcomingExposure = vacatingBeds.reduce((sum, bed) => sum + bed.rent, 0);

  const duePayments = payments.filter(
    (payment) => payment.status === "due" || payment.status === "overdue",
  );
  const overdueAmount = duePayments
    .filter((payment) => payment.status === "overdue")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const upcomingCheckouts = vacatingBeds
    .filter((bed) => bed.occupancyEndDate)
    .sort((a, b) =>
      String(a.occupancyEndDate).localeCompare(String(b.occupancyEndDate)),
    );

  const historicalRows = isSunriseSelected ? financeHistory : [];
  const selectedHistory = historicalRows.find((row) => row.period === historyDetail);

  const periodLabel =
    period === "week" ? "Last 7 days" : period === "month" ? "This month" : "Custom range";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-brand/20 bg-brand/10 text-brand">
            <Wallet className="size-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Property management / Finance</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Finance overview
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Understand collections, costs, vacancy exposure and operating performance.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/rent"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm font-medium transition hover:bg-muted"
        >
          <IndianRupee className="size-4" />
          View rent details
        </Link>
      </header>

      <Panel>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className="block text-xs text-muted-foreground">
            Property
            <div className="relative mt-2">
              <select
                value={propertyId}
                onChange={(event) => setPropertyId(event.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-input bg-input/30 px-3 pr-9 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <option value="all">All properties</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-3 right-3 size-4" />
            </div>
          </label>

          <label className="block text-xs text-muted-foreground">
            Reporting period
            <div className="relative mt-2">
              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value as Period)}
                className="h-10 w-full appearance-none rounded-lg border border-input bg-input/30 px-3 pr-9 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="custom">Custom</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-3 right-3 size-4" />
            </div>
          </label>

          <label className="block text-xs text-muted-foreground">
            Compare with
            <div className="relative mt-2">
              <select
                value={comparison}
                onChange={(event) => setComparison(event.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-input bg-input/30 px-3 pr-9 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <option value="previous">Previous period</option>
                <option value="last-year">Same period last year</option>
                <option value="none">No comparison</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-3 right-3 size-4" />
            </div>
          </label>

          <label className="block text-xs text-muted-foreground">
            From
            <input
              type="date"
              value={startDate}
              onChange={(event) => {
                setStartDate(event.target.value);
                setPeriod("custom");
              }}
              className="mt-2 h-10 w-full rounded-lg border border-input bg-input/30 px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </label>

          <label className="block text-xs text-muted-foreground">
            To
            <input
              type="date"
              min={startDate}
              value={endDate}
              onChange={(event) => {
                setEndDate(event.target.value);
                setPeriod("custom");
              }}
              className="mt-2 h-10 w-full rounded-lg border border-input bg-input/30 px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </label>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Showing {periodLabel.toLowerCase()}
          {period === "custom" ? `: ${startDate} to ${endDate}` : ""}. Comparison:{" "}
          {comparison === "previous"
            ? "previous period"
            : comparison === "last-year"
              ? "same period last year"
              : "off"}.
        </p>
      </Panel>

      {!isSunriseSelected && (
        <div className="rounded-xl border border-warning/20 bg-warning/5 p-3 text-sm text-warning">
          Finance demo records currently exist for Sunrise Residency only. Other properties will show empty finance records until their data is added.
        </div>
      )}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Expected rent"
          amount={money(isSunriseSelected ? summary.expectedRent : 0)}
          detail="Rent expected in the selected demo period"
          icon={<CalendarDays className="size-4" />}
        />
        <KpiCard
          label="Rent collected"
          amount={money(isSunriseSelected ? summary.collectedRent : 0)}
          detail={`${isSunriseSelected ? summary.collectionRate : 0}% collection progress`}
          icon={<CheckCircle2 className="size-4" />}
          tone="positive"
        />
        <KpiCard
          label="Total expenses"
          amount={money(totalExpenses)}
          detail={`${money(fixedTotal)} fixed · ${money(staffTotal)} staff-submitted`}
          icon={<ReceiptText className="size-4" />}
          tone="warning"
        />
        <KpiCard
          label="Net operating result"
          amount={money((isSunriseSelected ? summary.collectedRent : 0) - totalExpenses)}
          detail="Rent collected minus demo expense records"
          icon={<IndianRupee className="size-4" />}
          tone="positive"
        />
      </section>

      <Panel>
        <SectionHeading
          title="Financial performance"
          description="Income, expenses and net result across the selected chart range."
        />
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="currentColor" opacity={0.1} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "currentColor", fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={18} />
              <YAxis tickFormatter={shortMoney} tick={{ fill: "currentColor", fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
              <Tooltip
                formatter={(value, name) => [money(Number(value)), String(name)]}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  color: "var(--foreground)",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="income" name="Income" stroke="#34d399" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="net" name="Net result" stroke="#818cf8" strokeWidth={2.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          The custom date fields currently update the displayed range label. Live custom-period aggregation will be connected to the reporting data source.
        </p>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <SectionHeading
            title="Rent collection & outstanding"
            description="Overdue amounts and residents requiring follow-up."
            action={
              <Link href="/dashboard/rent" className="text-sm font-medium text-brand hover:underline">
                Open rent page
              </Link>
            }
          />
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Collection progress</p>
                <p className="mt-1 text-2xl font-semibold">
                  {isSunriseSelected ? summary.collectionRate : 0}%
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {money(isSunriseSelected ? summary.collectedRent : 0)} of{" "}
                {money(isSunriseSelected ? summary.expectedRent : 0)}
              </p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-success"
                style={{ width: `${isSunriseSelected ? summary.collectionRate : 0}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Outstanding</p>
                <p className="mt-1 font-semibold">{money(isSunriseSelected ? summary.dueRent : 0)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Overdue</p>
                <p className="mt-1 font-semibold text-danger">{money(isSunriseSelected ? summary.overdueRent : 0)}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {duePayments.map((payment) => (
              <div key={payment.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-warning/10 text-warning">
                  <CircleAlert className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{payment.residentName}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Room {payment.room} · {payment.note}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{money(payment.amount)}</p>
                  <button
                    type="button"
                    onClick={() => setRemindedIds((current) => [...new Set([...current, payment.id])])}
                    disabled={remindedIds.includes(payment.id)}
                    className="mt-1 text-xs font-medium text-brand hover:underline disabled:text-success"
                  >
                    {remindedIds.includes(payment.id) ? "Reminder noted" : "Remind"}
                  </button>
                </div>
              </div>
            ))}
            {duePayments.length === 0 && (
              <p className="py-5 text-center text-sm text-muted-foreground">No follow-ups in this demo.</p>
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Reminder buttons are demo-only and do not send SMS or WhatsApp messages.
          </p>
        </Panel>

        <Panel>
          <SectionHeading
            title="Expense management"
            description="Review fixed costs, staff submissions and approval status."
            action={
              <Link
                href="/finance/expenses"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-brand px-3 text-sm font-medium text-white hover:opacity-90"
              >
                <CheckCircle2 className="size-4" />
                Approve expenses
              </Link>
            }
          />
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs text-muted-foreground">Fixed</p>
              <p className="mt-1 text-sm font-semibold">{money(fixedTotal)}</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs text-muted-foreground">Staff-submitted</p>
              <p className="mt-1 text-sm font-semibold">{money(staffTotal)}</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs text-muted-foreground">To approve</p>
              <p className="mt-1 text-sm font-semibold">{pendingApprovals.length}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(["all", "fixed", "staff"] as const).map((filter) => (
              <button
                type="button"
                key={filter}
                onClick={() => setExpenseFilter(filter)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${
                  expenseFilter === filter
                    ? "border-brand/30 bg-brand/10 text-brand"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {filter === "all" ? "All expenses" : filter === "fixed" ? "Fixed expenses" : "Staff submissions"}
              </button>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            {filteredExpenses.map((expense) => {
              const status = rejectedIds.includes(expense.id)
                ? "rejected"
                : approvedIds.includes(expense.id)
                  ? "pending"
                  : expense.status;

              return (
                <div key={expense.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{expense.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {expense.category} · {dateLabel(expense.date)}
                        {expense.submittedBy ? ` · By ${expense.submittedBy}` : ""}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold">{money(expense.amount)}</p>
                      <StatusPill status={status} />
                    </div>
                  </div>
                  {expense.status === "pending_approval" &&
                    !approvedIds.includes(expense.id) &&
                    !rejectedIds.includes(expense.id) && (
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setApprovedIds((current) => [...current, expense.id])}
                          className="rounded-lg border border-success/20 bg-success/10 px-3 py-1.5 text-xs font-medium text-success"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectedIds((current) => [...current, expense.id])}
                          className="rounded-lg border border-danger/20 bg-danger/10 px-3 py-1.5 text-xs font-medium text-danger"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Approve/reject updates only this page's demo state. No database record is changed.
          </p>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <SectionHeading
            title="Vacancy opportunity"
            description="Potential monthly rent from currently available beds."
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BedDouble className="size-4" /> Vacant beds
              </div>
              <p className="mt-3 text-2xl font-semibold">{isSunriseSelected ? vacantBeds.length : 0}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IndianRupee className="size-4" /> Monthly potential
              </div>
              <p className="mt-3 text-2xl font-semibold">{money(isSunriseSelected ? vacancyPotential : 0)}</p>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Occupancy rate</span>
              <span className="font-semibold">{isSunriseSelected ? occupancyRate : 0}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${isSunriseSelected ? occupancyRate : 0}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Based on the existing room and bed demo data. Potential rent assumes ₹6,000 per vacant bed per month.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {vacantBeds.slice(0, 8).map((bed) => (
              <span key={bed.id} className="rounded-lg border border-border px-2.5 py-1.5 text-xs">
                Room {bed.roomNumber} · Bed {bed.label}
              </span>
            ))}
          </div>
          <Link href="/dashboard/occupancy" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
            Manage rooms & beds →
          </Link>
        </Panel>

        <Panel>
          <SectionHeading
            title="Upcoming check-outs"
            description="Rent associated with beds marked as vacating."
          />
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Beds vacating</p>
              <p className="mt-2 text-2xl font-semibold">{isSunriseSelected ? vacatingBeds.length : 0}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Monthly rent exposure</p>
              <p className="mt-2 text-2xl font-semibold">{money(isSunriseSelected ? upcomingExposure : 0)}</p>
            </div>
          </div>
          <div className="space-y-2">
            {upcomingCheckouts.map((bed) => (
              <div key={bed.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-warning/10 text-warning">
                  <Clock3 className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    Room {bed.roomNumber} · Bed {bed.label}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {bed.residentName ?? "Resident"} · Checkout {dateLabel(bed.occupancyEndDate!)}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold">{money(bed.rent)}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Exposure is the monthly rent linked to vacating beds, not a claim that the full amount will be lost. Actual loss depends on re-letting time.
          </p>
        </Panel>
      </div>

      <Panel>
        <SectionHeading
          title="Historical report"
          description="Period-by-period rent and expense breakdown. Select a row to inspect its demo details."
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-3 py-3 font-medium">Period</th>
                <th className="px-3 py-3 text-right font-medium">Expected rent</th>
                <th className="px-3 py-3 text-right font-medium">Collected</th>
                <th className="px-3 py-3 text-right font-medium">Fixed expenses</th>
                <th className="px-3 py-3 text-right font-medium">Staff expenses</th>
                <th className="px-3 py-3 text-right font-medium">Net result*</th>
                <th className="px-3 py-3 text-right font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {historicalRows.map((row) => (
                <tr key={row.period} className="border-b border-border/70 last:border-0 hover:bg-muted/30">
                  <td className="px-3 py-3 font-medium">{row.period}</td>
                  <td className="px-3 py-3 text-right">{money(row.expected)}</td>
                  <td className="px-3 py-3 text-right">{money(row.collected)}</td>
                  <td className="px-3 py-3 text-right">{money(row.fixed)}</td>
                  <td className="px-3 py-3 text-right">{money(row.staff)}</td>
                  <td className="px-3 py-3 text-right font-semibold">
                    {money(row.collected - row.fixed - row.staff)}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setHistoryDetail(historyDetail === row.period ? null : row.period)}
                      className="font-medium text-brand hover:underline"
                    >
                      {historyDetail === row.period ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          *Net result here uses collected rent minus the listed expense totals. Historical rows are illustrative and not yet linked to individual database transactions.
        </p>

        {selectedHistory && (
          <div className="mt-4 rounded-xl border border-brand/20 bg-brand/5 p-4">
            <h3 className="font-semibold">{selectedHistory.period} · Report details</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Expected rent</p>
                <p className="mt-1 font-semibold">{money(selectedHistory.expected)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Collected rent</p>
                <p className="mt-1 font-semibold">{money(selectedHistory.collected)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total expenses</p>
                <p className="mt-1 font-semibold">{money(selectedHistory.fixed + selectedHistory.staff)}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Individual rent charges, payments and expense records will appear here after we connect the detailed transaction data.
            </p>
          </div>
        )}
      </Panel>

      <p className="text-xs text-muted-foreground">
        Prototype finance view · Data is illustrative. Approval actions, reminders, custom-period aggregation and transaction drill-downs are not connected to a backend yet.
      </p>
    </div>
  );
}
