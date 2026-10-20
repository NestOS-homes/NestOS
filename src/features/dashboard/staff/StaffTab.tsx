
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ClipboardList,
  LayoutGrid,
  List,
  Phone,
  Plus,
  Search,
  Users,
  Wallet,
  X,
} from "lucide-react";

import { staffMembers } from "@/data/mock/staff";
import type {
  StaffApprovalStatus,
  StaffMember,
  StaffSalaryStatus,
} from "@/types";

type ViewMode = "grid" | "table";

const currency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const salaryLabel: Record<StaffSalaryStatus, string> = {
  paid: "Paid",
  pending: "Pending",
};

const approvalLabel: Record<StaffApprovalStatus, string> = {
  pending_approval: "Pending approval",
  approved: "Approved",
  rejected: "Rejected",
};

function SalaryBadge({ status }: { status: StaffSalaryStatus }) {
  return (
    <span
      className={
        status === "paid"
          ? "inline-flex items-center rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-xs font-medium text-success"
          : "inline-flex items-center rounded-full border border-warning/20 bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning"
      }
    >
      Salary {salaryLabel[status]}
    </span>
  );
}

function ApprovalBadge({ status }: { status: StaffApprovalStatus }) {
  const styles: Record<StaffApprovalStatus, string> = {
    approved: "border-success/20 bg-success/10 text-success",
    pending_approval: "border-warning/20 bg-warning/10 text-warning",
    rejected: "border-danger/20 bg-danger/10 text-danger",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {approvalLabel[status]}
    </span>
  );
}

function StaffAvatar({
  staff,
  size = "normal",
}: {
  staff: StaffMember;
  size?: "normal" | "large";
}) {
  const initials = staff.fullName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-muted font-semibold text-muted-foreground ${
        size === "large" ? "size-20 text-xl" : "size-12 text-sm"
      }`}
    >
      {staff.photoUrl ? (
        // A plain img keeps this mock-data page independent of Next image configuration.
        <img
          src={staff.photoUrl}
          alt={staff.fullName}
          className="size-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: typeof Users;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <div
          className={`grid size-10 place-items-center rounded-xl ${tone}`}
        >
          <Icon className="size-5" />
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function StaffDetailsModal({
  staff,
  onClose,
}: {
  staff: StaffMember;
  onClose: () => void;
}) {
  const activeComplaints = staff.assignedComplaints.filter(
    (complaint) =>
      complaint.status !== "resolved"
  );

  const complaintStatusLabel: Record<string, string> = {
    open: "Open",
    assigned: "Assigned",
    in_progress: "In progress",
    resolved: "Resolved",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="staff-modal-title"
        className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-border p-5 sm:p-6">
          <div>
            <h2 id="staff-modal-title" className="text-lg font-semibold">
              Staff details
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Profile, salary and current responsibilities
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close staff details"
            className="grid size-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <StaffAvatar staff={staff} size="large" />
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-semibold">{staff.fullName}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {staff.role}
              </p>
              <a
                href={`tel:${staff.phone.replace(/\s/g, "")}`}
                className="mt-3 inline-flex items-center gap-2 text-sm text-brand hover:underline"
              >
                <Phone className="size-4" />
                {staff.phone}
              </a>
              <div className="mt-3">
                <ApprovalBadge status={staff.approvalStatus} />
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Monthly salary</p>
              <p className="mt-2 text-xl font-semibold">
                {currency(staff.monthlySalary)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {staff.salaryPeriod}
              </p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Payment status</p>
              <div className="mt-3">
                <SalaryBadge status={staff.salaryStatus} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                For {staff.salaryPeriod}
              </p>
            </div>
          </div>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">Assigned complaints</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Current unresolved responsibilities
                </p>
              </div>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                {activeComplaints.length}
              </span>
            </div>

            {activeComplaints.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-center">
                <ClipboardList className="mx-auto size-6 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">
                  No open complaints
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  There are no unresolved complaints assigned to this staff member.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-border p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{complaint.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {complaint.room} · {complaint.id}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-xs">
                      {complaintStatusLabel[complaint.status]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="flex justify-end border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-lg border border-border px-4 text-sm font-medium transition hover:bg-muted"
            >
              Close
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export function StaffTab() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [salaryFilter, setSalaryFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const roles = useMemo(
    () => [...new Set(staffMembers.map((staff) => staff.role))].sort(),
    []
  );

  const filteredStaff = useMemo(() => {
    const term = search.trim().toLowerCase();

    return staffMembers.filter((staff) => {
      const matchesSearch =
        !term ||
        staff.fullName.toLowerCase().includes(term) ||
        staff.role.toLowerCase().includes(term) ||
        staff.phone.toLowerCase().includes(term);

      const matchesRole =
        roleFilter === "all" || staff.role === roleFilter;

      const matchesSalary =
        salaryFilter === "all" || staff.salaryStatus === salaryFilter;

      const matchesApproval =
        approvalFilter === "all" ||
        staff.approvalStatus === approvalFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesSalary &&
        matchesApproval
      );
    });
  }, [search, roleFilter, salaryFilter, approvalFilter]);

  const approvedStaff = staffMembers.filter(
    (staff) => staff.approvalStatus === "approved"
  );

  const pendingSalary = approvedStaff
    .filter((staff) => staff.salaryStatus === "pending")
    .reduce((total, staff) => total + staff.monthlySalary, 0);

  const openComplaints = approvedStaff.reduce(
    (total, staff) =>
      total +
      staff.assignedComplaints.filter(
        (complaint) => complaint.status !== "resolved"
      ).length,
    0
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            Property management / Staff
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Staff Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your team, salary status and property responsibilities.
          </p>
        </div>

        <Link
          href="/dashboard/staff/add"
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg bg-brand px-4 text-sm font-medium text-white transition hover:opacity-90 sm:self-auto"
        >
          <Plus className="size-4" />
          Add Staff
        </Link>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          label="Approved staff"
          value={approvedStaff.length}
          detail="Active staff in this property"
          icon={Users}
          tone="bg-brand/10 text-brand"
        />
        <SummaryCard
          label="Salary pending"
          value={currency(pendingSalary)}
          detail="Unpaid salary for the displayed period"
          icon={Wallet}
          tone="bg-warning/10 text-warning"
        />
        <SummaryCard
          label="Open assigned complaints"
          value={openComplaints}
          detail="Unresolved complaints assigned to approved staff"
          icon={ClipboardList}
          tone="bg-info/10 text-info"
        />
      </section>

      {staffMembers.some(
        (staff) => staff.approvalStatus === "pending_approval"
      ) && (
        <section className="flex flex-col gap-3 rounded-2xl border border-warning/20 bg-warning/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Staff awaiting approval</p>
            <p className="mt-1 text-sm text-muted-foreground">
              New staff submissions are reviewed by the central NestOS administrator.
            </p>
          </div>
          <span className="self-start rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning sm:self-auto">
            {
              staffMembers.filter(
                (staff) => staff.approvalStatus === "pending_approval"
              ).length
            }{" "}
            pending
          </span>
        </section>
      )}

      <section className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-3 xl:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by staff name, role or phone"
              className="h-9 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 xl:w-[570px]">
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              aria-label="Filter by role"
              className="h-9 min-w-0 rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="all">All roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <select
              value={salaryFilter}
              onChange={(event) => setSalaryFilter(event.target.value)}
              aria-label="Filter by salary status"
              className="h-9 min-w-0 rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="all">All salary statuses</option>
              <option value="paid">Salary paid</option>
              <option value="pending">Salary pending</option>
            </select>

            <select
              value={approvalFilter}
              onChange={(event) => setApprovalFilter(event.target.value)}
              aria-label="Filter by approval status"
              className="h-9 min-w-0 rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="all">All approval statuses</option>
              <option value="approved">Approved</option>
              <option value="pending_approval">Pending approval</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Property team</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {filteredStaff.length} staff member
              {filteredStaff.length === 1 ? "" : "s"} found
            </p>
          </div>

          <div className="inline-flex self-start rounded-lg border border-border bg-muted/50 p-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-pressed={viewMode === "grid"}
              className={`inline-flex h-8 items-center gap-2 rounded-md px-3 text-sm ${
                viewMode === "grid"
                  ? "bg-background font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="size-4" />
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              aria-pressed={viewMode === "table"}
              className={`inline-flex h-8 items-center gap-2 rounded-md px-3 text-sm ${
                viewMode === "table"
                  ? "bg-background font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="size-4" />
              Table
            </button>
          </div>
        </div>

        {filteredStaff.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-4 py-12 text-center">
            <Search className="mx-auto size-7 text-muted-foreground" />
            <p className="mt-3 font-medium">No staff found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try changing your search or filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
                setSalaryFilter("all");
                setApprovalFilter("all");
              }}
              className="mt-3 text-sm font-medium text-brand hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredStaff.map((staff) => (
              <button
                type="button"
                key={staff.id}
                onClick={() => setSelectedStaff(staff)}
                className="group rounded-xl border border-border bg-background p-4 text-left transition hover:border-brand/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center gap-3">
                  <StaffAvatar staff={staff} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{staff.fullName}</p>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {staff.role}
                    </p>
                  </div>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition group-hover:text-brand" />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                  <SalaryBadge status={staff.salaryStatus} />
                  <span className="text-xs text-muted-foreground">
                    {staff.assignedComplaints.filter(
                      (complaint) => complaint.status !== "resolved"
                    ).length}{" "}
                    open complaints
                  </span>
                </div>

                {staff.approvalStatus !== "approved" && (
                  <div className="mt-3">
                    <ApprovalBadge status={staff.approvalStatus} />
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="px-3 py-3 font-medium">Staff member</th>
                  <th className="px-3 py-3 font-medium">Role</th>
                  <th className="px-3 py-3 font-medium">Salary status</th>
                  <th className="px-3 py-3 font-medium">Complaints</th>
                  <th className="px-3 py-3 font-medium">Approval</th>
                  <th className="px-3 py-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staff) => (
                  <tr
                    key={staff.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <StaffAvatar staff={staff} />
                        <span className="font-medium">{staff.fullName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">{staff.role}</td>
                    <td className="px-3 py-3">
                      <SalaryBadge status={staff.salaryStatus} />
                    </td>
                    <td className="px-3 py-3">
                      {
                        staff.assignedComplaints.filter(
                          (complaint) => complaint.status !== "resolved"
                        ).length
                      }
                    </td>
                    <td className="px-3 py-3">
                      <ApprovalBadge status={staff.approvalStatus} />
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => setSelectedStaff(staff)}
                        className="font-medium text-brand hover:underline"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedStaff && (
        <StaffDetailsModal
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}
    </div>
  );
}
