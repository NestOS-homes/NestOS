"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  UserRound,
} from "lucide-react";
import { complaints } from "@/data/mock/complaints";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";
import type {
  ComplaintPriority,
  ComplaintStatus,
} from "@/types";

const PRIORITY_OPTIONS: {
  value: ComplaintPriority;
  label: string;
}[] = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const STATUS_OPTIONS: {
  value: ComplaintStatus;
  label: string;
}[] = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "on_hold", label: "On hold" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export function ComplaintDetailPage({ id }: { id: string }) {
  const complaint = complaints.find((item) => item.id === id);

  const [priority, setPriority] = useState<ComplaintPriority>(
    complaint?.priority ?? "medium"
  );
  const [status, setStatus] = useState<ComplaintStatus>(
    complaint?.status ?? "open"
  );
  const [assignedTo, setAssignedTo] = useState(
    complaint?.assignedTo ?? ""
  );
  const [resolutionNote, setResolutionNote] = useState(
    complaint?.resolutionNote ?? ""
  );
  const [saved, setSaved] = useState(false);

  if (!complaint) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center">
        <h1 className="text-xl font-semibold">Complaint not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This complaint ID does not exist in the current sample data.
        </p>
        <Link
          href="/complaints"
          className="mt-5 inline-flex text-sm font-medium text-brand hover:underline"
        >
          Back to complaints
        </Link>
      </div>
    );
  }

  const raisedAt = complaint.raisedAt
    ? new Date(complaint.raisedAt)
    : null;

  function handleSave() {
    // Demo only: these values are held in this page's local state.
    // Connect this handler to the authenticated backend API for persistence.
    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/complaints"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to complaints
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Complaint {complaint.id.toUpperCase()}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {complaint.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Room {complaint.room} · {complaint.category}
          </p>
        </div>

        <span
          className={cn(
            "inline-flex w-fit items-center rounded-full px-3 py-1.5 text-sm font-medium",
            priority === "urgent"
              ? "bg-danger/15 text-danger"
              : priority === "high"
                ? "bg-warning/15 text-warning"
                : priority === "medium"
                  ? "bg-info/15 text-info"
                  : "bg-white/[0.06] text-muted-foreground"
          )}
        >
          {PRIORITY_OPTIONS.find((p) => p.value === priority)?.label}
          {" priority"}
        </span>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
        <div className="space-y-5">
          <section className="rounded-[20px] border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-muted-foreground" />
              <h2 className="text-lg font-medium">Issue description</h2>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {complaint.description ||
                "No detailed description has been provided."}
            </p>

            <div className="mt-5 border-t border-border pt-4">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Raised by
                  </dt>
                  <dd className="mt-1 font-medium">
                    {complaint.residentName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Category
                  </dt>
                  <dd className="mt-1 font-medium">
                    {complaint.category}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Room
                  </dt>
                  <dd className="mt-1 font-medium">
                    {complaint.room}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Time since raised
                  </dt>
                  <dd className="mt-1 font-medium">
                    {formatDuration(complaint.hoursOpen)}
                  </dd>
                </div>
                {raisedAt && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-muted-foreground">
                      Raised on
                    </dt>
                    <dd className="mt-1 font-medium">
                      {raisedAt.toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </section>

          {complaint.status === "closed" ||
          complaint.status === "resolved" ? (
            <section className="rounded-[20px] border border-border bg-card p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-success" />
                <h2 className="text-lg font-medium">
                  Resolution details
                </h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {complaint.resolutionNote ||
                  "No resolution note was recorded in the sample data."}
              </p>
              {complaint.closedAt && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Closed on{" "}
                  {new Date(complaint.closedAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              )}
            </section>
          ) : null}

          <section className="rounded-[20px] border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Clock3 className="size-5 text-muted-foreground" />
              <h2 className="text-lg font-medium">Activity</h2>
            </div>
            <div className="mt-4 border-l border-border pl-4">
              <p className="text-sm font-medium">Complaint raised</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Reported by {complaint.residentName}.
              </p>
              {raisedAt && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {raisedAt.toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              )}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              A full audit timeline will be connected when complaint updates
              are persisted by the backend.
            </p>
          </section>
        </div>

        <aside className="h-fit rounded-[20px] border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <UserRound className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-medium">Manage complaint</h2>
          </div>

          <div className="mt-5 space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium">Assign to</span>
              <select
                value={assignedTo}
                onChange={(event) => {
                  setAssignedTo(event.target.value);
                  setSaved(false);
                }}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Unassigned</option>
                <option value="Ramesh (Plumber)">Ramesh (Plumber)</option>
                <option value="Amit (Electrician)">Amit (Electrician)</option>
                <option value="Suresh (Carpenter)">Suresh (Carpenter)</option>
                <option value="Maintenance Team">Maintenance Team</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Urgency</span>
              <select
                value={priority}
                onChange={(event) => {
                  setPriority(event.target.value as ComplaintPriority);
                  setSaved(false);
                }}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {PRIORITY_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Status</span>
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value as ComplaintStatus);
                  setSaved(false);
                }}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {STATUS_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            {(status === "resolved" || status === "closed") && (
              <label className="block space-y-2">
                <span className="text-sm font-medium">
                  Resolution notes
                </span>
                <textarea
                  value={resolutionNote}
                  onChange={(event) => {
                    setResolutionNote(event.target.value);
                    setSaved(false);
                  }}
                  maxLength={1000}
                  rows={4}
                  placeholder="Describe the repair or resolution..."
                  className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-brand px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Save changes
            </button>

            {saved && (
              <p role="status" className="text-sm text-warning">
                Demo only: changes are not saved to the database.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}