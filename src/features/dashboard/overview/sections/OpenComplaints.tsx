
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Tone } from "@/components/shared/StatusDot";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Complaint, ComplaintPriority } from "@/types";
import { ViewButton } from "./RoomsOccupancy";

const PRIORITY: Record<
  ComplaintPriority,
  { label: string; tone: Tone; rank: number }
> = {
  urgent: { label: "Urgent", tone: "danger", rank: 0 },
  high: { label: "High", tone: "warning", rank: 1 },
  medium: { label: "Medium", tone: "warning", rank: 2 },
  low: { label: "Low", tone: "info", rank: 3 },
};

function isSlaDueToday(slaDueAt?: string): boolean {
  if (!slaDueAt) return false;

  const due = new Date(slaDueAt);

  if (Number.isNaN(due.getTime())) return false;

  const now = new Date();

  // Include complaints whose SLA deadline falls today or earlier.
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const dueDate = new Date(
    due.getFullYear(),
    due.getMonth(),
    due.getDate()
  );

  return dueDate <= today;
}

function isSlaOverdue(slaDueAt?: string): boolean {
  if (!slaDueAt) return false;

  const due = new Date(slaDueAt);

  if (Number.isNaN(due.getTime())) return false;

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const dueDate = new Date(
    due.getFullYear(),
    due.getMonth(),
    due.getDate()
  );

  return dueDate < today;
}

/** Dashboard shortlist: urgent complaints and complaints with an SLA due today. */
export function OpenComplaints({
  complaints,
  limit = 10,
}: {
  complaints: Complaint[];
  limit?: number;
}) {
  const activeComplaints = complaints.filter(
    (c) => c.status !== "closed" && c.status !== "resolved"
  );

  const priorityComplaints = activeComplaints
    .filter((c) => c.priority === "urgent" || isSlaDueToday(c.slaDueAt))
    .sort(
      (a, b) =>
        PRIORITY[a.priority].rank - PRIORITY[b.priority].rank ||
        Number(isSlaDueToday(b.slaDueAt)) -
          Number(isSlaDueToday(a.slaDueAt)) ||
        b.hoursOpen - a.hoursOpen
    );

  const urgentCount = priorityComplaints.filter(
    (c) => c.priority === "urgent"
  ).length;

  return (
    <SectionCard
      title="Open complaints"
      description={
        <>
          {priorityComplaints.length} requiring attention ·{" "}
          <span className="text-danger">{urgentCount} urgent</span>
        </>
      }
      action={<ViewButton label="View all" href="/complaints" />}
    >
      {priorityComplaints.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
          <p className="text-sm font-medium">No urgent complaints</p>
          <p className="mt-1 text-xs text-muted-foreground">
            No open complaints have an SLA due today.
          </p>
        </div>
      ) : (
        <div className="@container">
          <ul className="grid gap-2.5 @sm:grid-cols-2 @4xl:grid-cols-4">
            {priorityComplaints.slice(0, limit).map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </ul>
        </div>
      )}
    </SectionCard>
  );
}

function ComplaintCard({ complaint: c }: { complaint: Complaint }) {
  const p = PRIORITY[c.priority];
  const overADay = c.hoursOpen >= 24;
  const slaDueToday = isSlaDueToday(c.slaDueAt);
  const slaOverdue = isSlaOverdue(c.slaDueAt);

  return (
    <li>
      <Link
        href={`/complaints/${c.id}`}
        aria-label={`View complaint ${c.title}, Room ${c.room}`}
        className="surface-tile group flex h-full flex-col rounded-2xl p-4 transition-colors hover:border-brand/50 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge tone={p.tone}>{p.label}</StatusBadge>
            {slaOverdue ? (
  <StatusBadge tone="danger">SLA overdue</StatusBadge>
) : slaDueToday ? (
  <StatusBadge tone="warning">SLA today</StatusBadge>
) : null}
          </div>

          <div className="shrink-0 text-right text-xs leading-tight">
            <p className="font-medium text-foreground">Room {c.room}</p>
            <p
              className={cn(
                "mt-0.5 flex items-center justify-end gap-1",
                overADay ? "text-danger" : "text-muted-foreground"
              )}
            >
              <Clock className="size-3" />
              {formatDuration(c.hoursOpen)}
            </p>
          </div>
        </div>

        <p className="mt-3 text-[15px] font-medium leading-snug group-hover:text-brand">
          {c.title}
        </p>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {c.category}
          {c.status === "in_progress" && c.assignedTo
            ? ` · ${c.assignedTo} on it`
            : c.assignedTo
              ? ` · ${c.assignedTo}`
              : " · Not assigned"}
        </p>

        <div className="mt-4 flex items-center gap-2.5 border-t border-white/[0.06] pt-3">
          <InitialsAvatar name={c.residentName} initials={c.initials} size="sm" />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-xs">{c.residentName}</p>
            <p className="text-[11px] text-subtle">Reported</p>
          </div>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
        </div>
      </Link>
    </li>
  );
}
