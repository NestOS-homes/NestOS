"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Search,
  UserRound,
} from "lucide-react";
import { complaints } from "@/data/mock/complaints";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";
import type {
  Complaint,
  ComplaintPriority,
  ComplaintStatus,
} from "@/types";

type ComplaintTab = "open" | "closed" | "all";

const PRIORITY: Record<
  ComplaintPriority,
  { label: string; rank: number; className: string }
> = {
  urgent: {
    label: "Urgent",
    rank: 0,
    className: "bg-danger/15 text-danger",
  },
  high: {
    label: "High",
    rank: 1,
    className: "bg-warning/15 text-warning",
  },
  medium: {
    label: "Medium",
    rank: 2,
    className: "bg-info/15 text-info",
  },
  low: {
    label: "Low",
    rank: 3,
    className: "bg-white/[0.06] text-muted-foreground",
  },
};

const STATUS: Record<ComplaintStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  on_hold: "On hold",
  resolved: "Resolved",
  closed: "Closed",
};

export function ComplaintsPage() {
  const [tab, setTab] = useState<ComplaintTab>("open");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const openCount = complaints.filter(
    (c) => c.status !== "closed" && c.status !== "resolved"
  ).length;

  const urgentCount = complaints.filter(
    (c) =>
      c.priority === "urgent" &&
      c.status !== "closed" &&
      c.status !== "resolved"
  ).length;

  const unassignedCount = complaints.filter(
    (c) =>
      !c.assignedTo &&
      c.status !== "closed" &&
      c.status !== "resolved"
  ).length;

  const filtered = useMemo(() => {
    return complaints
      .filter((c) => {
        if (tab === "open") {
          return c.status !== "closed" && c.status !== "resolved";
        }
        if (tab === "closed") {
          return c.status === "closed" || c.status === "resolved";
        }
        return true;
      })
      .filter((c) => {
        const query = search.trim().toLowerCase();
        if (!query) return true;

        return [
          c.id,
          c.title,
          c.room,
          c.residentName,
          c.assignedTo ?? "",
          c.category,
          c.description ?? "",
        ].some((value) => value.toLowerCase().includes(query));
      })
      .filter((c) => category === "all" || c.category === category)
      .sort((a, b) => {
        if (tab === "closed") {
          return (
            new Date(b.closedAt ?? b.raisedAt ?? 0).getTime() -
            new Date(a.closedAt ?? a.raisedAt ?? 0).getTime()
          );
        }

        const priorityDifference =
          PRIORITY[a.priority].rank - PRIORITY[b.priority].rank;

        if (priorityDifference !== 0) return priorityDifference;

        // Among equal priorities, oldest first.
        return b.hoursOpen - a.hoursOpen;
      });
  }, [tab, search, category]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Property operations
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Complaints & Maintenance
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Prioritise issues, assign staff and track resolutions.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard
          label="Open complaints"
          value={openCount}
          icon={<Clock3 className="size-5" />}
        />
        <SummaryCard
          label="Urgent complaints"
          value={urgentCount}
          icon={<AlertTriangle className="size-5 text-danger" />}
        />
        <SummaryCard
          label="Unassigned"
          value={unassignedCount}
          icon={<UserRound className="size-5" />}
        />
      </section>

      <section className="rounded-[20px] border border-border bg-card p-4 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium">Complaint queue</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Select a complaint to view its full details and manage it.
            </p>
          </div>
          <span className="text-sm text-muted-foreground">
            {filtered.length} results
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-b border-border pb-4">
          {(
            [
              ["open", `Open (${openCount})`],
              [
                "closed",
                `Closed (${
                  complaints.filter(
                    (c) =>
                      c.status === "closed" || c.status === "resolved"
                  ).length
                })`,
              ],
              ["all", "All complaints"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition-colors",
                tab === value
                  ? "bg-brand text-white"
                  : "border border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_200px]">
          <label className="flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-3">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, ID, room, resident or staff"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by complaint category"
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none"
          >
            <option value="all">All categories</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Internet">Internet</option>
            <option value="Furniture">Furniture</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Appliance">Appliance</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mt-5 space-y-3">
          {filtered.map((complaint) => (
            <ComplaintRow key={complaint.id} complaint={complaint} />
          ))}

          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-border px-4 py-12 text-center">
              <CheckCircle2 className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 font-medium">No complaints found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function ComplaintRow({ complaint: c }: { complaint: Complaint }) {
  const priority = PRIORITY[c.priority];
  const completed = c.status === "closed" || c.status === "resolved";

  return (
    <Link
      href={`/complaints/${c.id}`}
      className="group block rounded-2xl border border-border bg-background p-4 transition-colors hover:border-brand/50 hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                priority.className
              )}
            >
              {priority.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {c.id.toUpperCase()}
            </span>
          </div>

          <h3 className="mt-3 font-medium group-hover:text-brand">
            {c.title}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Room {c.room} · {c.category} · Raised by {c.residentName}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span>
              Assigned to: {c.assignedTo ?? "Unassigned"}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-1",
                completed
                  ? "bg-success/15 text-success"
                  : "bg-white/[0.06] text-muted-foreground"
              )}
            >
              {STATUS[c.status]}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
          <span
            className={cn(
              "text-xs",
              !completed && c.hoursOpen >= 24
                ? "text-danger"
                : "text-muted-foreground"
            )}
          >
            {completed
              ? "Completed"
              : `Open ${formatDuration(c.hoursOpen)}`}
          </span>
          <span className="text-sm font-medium text-brand">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}