
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  IndianRupee,
  Search,
  X,
  XCircle,
} from "lucide-react";

import {
  fixedExpenses,
  staffExpenses,
  type ExpenseStatus,
  type FinanceExpense,
} from "@/features/dashboard/finance/finance-data";

type View = "pending" | "history";

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const display = (value?: string | number | null) =>
  value === undefined || value === null || String(value).trim() === ""
    ? "Not provided"
    : String(value);

function StatusBadge({ status }: { status: ExpenseStatus }) {
  const config: Record<ExpenseStatus, { label: string; className: string }> = {
    paid: {
      label: "Paid",
      className: "border-success/20 bg-success/10 text-success",
    },
    pending: {
      label: "Approved · Unpaid",
      className: "border-warning/20 bg-warning/10 text-warning",
    },
    pending_approval: {
      label: "Pending approval",
      className: "border-brand/20 bg-brand/10 text-brand",
    },
    rejected: {
      label: "Rejected",
      className: "border-danger/20 bg-danger/10 text-danger",
    },
  };

  const item = config[status];

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${item.className}`}>
      {item.label}
    </span>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | boolean | null;
}) {
  let formatted = display(value === undefined || value === null ? undefined : String(value));

  if (typeof value === "boolean") {
    formatted = value ? "Yes" : "No";
  }

  return (
    <div className="min-w-0 border-b border-border/70 py-3 last:border-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-medium">{formatted}</p>
    </div>
  );
}

export default function ExpenseApprovalsPage() {
  const [view, setView] = useState<View>("pending");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<FinanceExpense | null>(null);
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [notice, setNotice] = useState("");

  const expenses = useMemo(
    () => [...staffExpenses, ...fixedExpenses],
    [],
  );

  function reviewStatus(expense: FinanceExpense): "pending" | "approved" | "rejected" | "other" {
    if (rejectedIds.includes(expense.id) || expense.status === "rejected") {
      return "rejected";
    }
    if (approvedIds.includes(expense.id)) {
      return "approved";
    }
    if (expense.status === "pending_approval") {
      return "pending";
    }
    return "other";
  }

  const pendingExpenses = expenses.filter(
    (expense) => reviewStatus(expense) === "pending",
  );

  const historicalExpenses = expenses.filter((expense) => {
    const status = reviewStatus(expense);
    return status === "approved" || status === "rejected" || status === "other";
  });

  const filteredExpenses = (view === "pending" ? pendingExpenses : historicalExpenses)
    .filter((expense) => {
      const term = search.trim().toLowerCase();
      if (!term) return true;

      return [
        expense.id,
        expense.title,
        expense.category,
        expense.submittedBy,
        expense.vendor,
        expense.propertyName,
        expense.description,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  function openExpense(expense: FinanceExpense) {
    setSelected(expense);
    setRejectionReason("");
    setShowRejectForm(false);
    setNotice("");
  }

  function approveExpense() {
    if (!selected) return;

    setApprovedIds((current) => [...new Set([...current, selected.id])]);
    setRejectedIds((current) => current.filter((id) => id !== selected.id));
    setNotice("Expense approved for this demo session.");
    setShowRejectForm(false);
    setSelected(null);
  }

  function rejectExpense() {
    if (!selected) return;

    if (!rejectionReason.trim()) {
      setNotice("Enter a reason before rejecting this expense.");
      return;
    }

    setRejectedIds((current) => [...new Set([...current, selected.id])]);
    setApprovedIds((current) => current.filter((id) => id !== selected.id));
    setSelected({
      ...selected,
      status: "rejected",
      rejectionReason: rejectionReason.trim(),
    });
    setNotice("Expense rejected for this demo session.");
    setShowRejectForm(false);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/finance"
            className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Finance
          </Link>
          <p className="text-xs text-muted-foreground">Finance / Expense management</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Expense approvals
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review staff expenses and inspect previous decisions.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm">
          <Clock3 className="size-4 text-brand" />
          <span>{pendingExpenses.length} awaiting review</span>
        </div>
      </header>

      {notice && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-brand/20 bg-brand/5 p-3 text-sm">
          <p>{notice}</p>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setNotice("")}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <section className="rounded-[20px] border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex w-fit rounded-xl border border-border bg-muted/30 p-1">
            <button
              type="button"
              onClick={() => setView("pending")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                view === "pending"
                  ? "bg-brand text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pending ({pendingExpenses.length})
            </button>
            <button
              type="button"
              onClick={() => setView("history")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                view === "history"
                  ? "bg-brand text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              History ({historicalExpenses.length})
            </button>
          </div>

          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search expense or submitted by..."
              aria-label="Search expenses by name or submitter"
              className="h-10 w-full rounded-lg border border-input bg-input/30 pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-brand" />
            Pending approval
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-success" />
            Approved
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-danger" />
            Rejected
          </span>
        </div>

        <div className="mt-5 border-t border-border">
          {filteredExpenses.length === 0 ? (
            <div className="py-14 text-center">
              <Search className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 font-medium">No matching expenses</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try another search, or switch between pending and history.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredExpenses.map((expense) => {
                const reviewed = reviewStatus(expense);
                const status: ExpenseStatus =
                  reviewed === "rejected"
                    ? "rejected"
                    : reviewed === "approved"
                      ? "pending"
                      : expense.status;

                return (
                  <button
                    key={expense.id}
                    type="button"
                    onClick={() => openExpense(expense)}
                    className="flex w-full flex-col gap-3 py-4 text-left transition hover:bg-muted/30 sm:flex-row sm:items-center sm:px-2"
                  >
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-muted/30">
                      <ReceiptIcon />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{expense.title}</p>
                        <StatusBadge status={status} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {expense.category} · {expense.id}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Submitted by {display(expense.submittedBy)} · {expense.date}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <div className="sm:text-right">
                        <p className="font-semibold">{money(expense.amount)}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {display(expense.propertyName)}
                        </p>
                      </div>
                      <span className="text-sm text-brand">View →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="expense-detail-title"
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-border bg-card p-5">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  Expense record · {selected.id}
                </p>
                <h2 id="expense-detail-title" className="mt-1 text-xl font-semibold">
                  {selected.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selected.category} · {selected.date}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close expense details"
                onClick={() => setSelected(null)}
                className="grid size-9 shrink-0 place-items-center rounded-lg border border-border hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs text-muted-foreground">Expense amount</p>
                  <p className="mt-1 text-xl font-semibold">{money(selected.amount)}</p>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs text-muted-foreground">Payment status</p>
                  <div className="mt-2">
                    <StatusBadge
                      status={
                        rejectedIds.includes(selected.id)
                          ? "rejected"
                          : approvedIds.includes(selected.id)
                            ? "pending"
                            : selected.status
                      }
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs text-muted-foreground">Expense type</p>
                  <p className="mt-1 font-medium capitalize">{selected.type}</p>
                </div>
              </div>

              <h3 className="mt-6 font-semibold">Expense information</h3>
              <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
                <DetailRow label="Expense name" value={selected.title} />
                <DetailRow label="Category" value={selected.category} />
                <DetailRow label="Description" value={selected.description} />
                <DetailRow label="Expense date" value={selected.date} />
                <DetailRow label="Reporting period" value={selected.expensePeriod} />
                <DetailRow label="Property" value={selected.propertyName ?? selected.propertyId} />
                <DetailRow label="Scope" value={selected.scope} />
                <DetailRow label="Room number" value={selected.roomNumber} />
                <DetailRow label="Bed" value={selected.bedLabel} />
                <DetailRow label="Complaint reference" value={selected.complaintReference} />
                <DetailRow label="Recurring schedule" value={selected.recurring} />
                <DetailRow label="Capital expense" value={selected.capitalExpense} />
                <DetailRow label="GST amount" value={selected.gstAmount === undefined ? undefined : money(selected.gstAmount)} />
                <DetailRow label="Submitted by" value={selected.submittedBy} />
                <DetailRow label="Submitted at" value={selected.submittedAt} />
                <DetailRow label="Vendor / supplier" value={selected.vendor} />
                <DetailRow label="Payment method" value={selected.paymentMethod} />
                <DetailRow label="Payment reference" value={selected.paymentReference} />
                <DetailRow label="Amount paid" value={selected.paidAmount === undefined ? undefined : money(selected.paidAmount)} />
                <DetailRow label="Approved by" value={selected.approvedBy} />
                <DetailRow label="Approved at" value={selected.approvedAt} />
                <DetailRow label="Rejection reason" value={selected.rejectionReason} />
                <DetailRow label="Notes" value={selected.notes} />
              </div>

              <div className="mt-5 rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 font-medium">
                  <FileText className="size-4 text-brand" />
                  Receipt / supporting document
                </div>
                {selected.receiptUrl ? (
                  <a
                    href={selected.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-brand hover:underline"
                  >
                    Open receipt
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    No receipt attached to this demo record.
                  </p>
                )}
              </div>

              {showRejectForm && (
                <div className="mt-5 rounded-xl border border-danger/20 bg-danger/5 p-4">
                  <label className="text-sm font-medium" htmlFor="rejection-reason">
                    Reason for rejection
                  </label>
                  <textarea
                    id="rejection-reason"
                    value={rejectionReason}
                    onChange={(event) => setRejectionReason(event.target.value)}
                    rows={3}
                    placeholder="Explain why this expense is being rejected..."
                    className="mt-2 w-full rounded-lg border border-input bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  />
                  <div className="mt-3 flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRejectForm(false)}
                      className="rounded-lg border border-border px-3 py-2 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={rejectExpense}
                      className="rounded-lg bg-danger px-3 py-2 text-sm font-medium text-white"
                    >
                      Confirm rejection
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Close
                </button>

                {reviewStatus(selected) === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowRejectForm(true)}
                      className="inline-flex items-center gap-2 rounded-lg border border-danger/20 bg-danger/10 px-4 py-2 text-sm font-medium text-danger"
                    >
                      <XCircle className="size-4" />
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={approveExpense}
                      className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                      <CheckCircle2 className="size-4" />
                      Approve expense
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function ReceiptIcon() {
  return <IndianRupee className="size-5 text-brand" />;
}
