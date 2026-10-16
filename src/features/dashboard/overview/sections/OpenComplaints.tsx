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

/** Open complaints, most urgent first. */
export function OpenComplaints({ complaints, limit = 4 }: { complaints: Complaint[]; limit?: number }) {
  const activeComplaints = complaints.filter(
  (c) => c.status !== "closed" && c.status !== "resolved"
);

const sorted = [...activeComplaints].sort(
  (a, b) =>
    PRIORITY[a.priority].rank - PRIORITY[b.priority].rank ||
    b.hoursOpen - a.hoursOpen
);

const urgent = activeComplaints.filter(
  (c) => c.priority === "urgent"
).length;

  return (
    <SectionCard
  title="Open complaints"
  description={
    <>
      {activeComplaints.length} open ·{" "}
      <span className="text-danger">{urgent} urgent</span>
    </>
  }
  action={<ViewButton label="View all" href="/complaints" />}
>
      <div className="@container">
        <ul className="grid gap-2.5 @sm:grid-cols-2 @4xl:grid-cols-4">
          {sorted.slice(0, limit).map((c) => (
            <ComplaintCard key={c.id} complaint={c} />
          ))}
        </ul>
      </div>
    </SectionCard>
  );
}

function ComplaintCard({ complaint: c }: { complaint: Complaint }) {
  const p = PRIORITY[c.priority];
  const overADay = c.hoursOpen >= 24;

  return (
    <li className="surface-tile flex flex-col rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2">
        <StatusBadge tone={p.tone}>{p.label}</StatusBadge>
        <div className="text-right text-xs leading-tight">
          <p className="font-medium text-foreground">Room {c.room}</p>
          <p className={cn("mt-0.5 flex items-center justify-end gap-1", overADay ? "text-danger" : "text-muted-foreground")}>
            <Clock className="size-3" />
            {formatDuration(c.hoursOpen)}
          </p>
        </div>
      </div>

      <p className="mt-3 text-[15px] leading-snug font-medium">{c.title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {c.category}
        {c.status === "in_progress" && c.assignedTo ? ` · ${c.assignedTo} on it` : " · Not assigned"}
      </p>

      <div className="mt-4 flex items-center gap-2.5 border-t border-white/[0.06] pt-3">
        <InitialsAvatar name={c.residentName} initials={c.initials} size="sm" />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-xs">{c.residentName}</p>
          <p className="text-[11px] text-subtle">Reported</p>
        </div>
        <button
          type="button"
          aria-label={`Resolve: ${c.title}, Room ${c.room}`}
          className="grid size-8 place-items-center rounded-full bg-white/[0.06] text-muted-foreground transition-colors hover:bg-white/[0.12] hover:text-foreground"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
    </li>
  );
}
