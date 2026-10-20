
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BedDouble,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Phone,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  IndianRupee,
  Search,
  UserPlus,
  Wallet,
  X,
} from "lucide-react";
import { rooms } from "@/data/mock/rooms";
import type { Bed, Room } from "@/types";

type RentStatus = "paid" | "pending" | "overdue" | "na";
type FilterStatus = "all" | "pending" | "vacant" | "vacating";

type BedDetail = {
  bed: Bed;
  room: Room;
  rentStatus: RentStatus;
  rentAmount: number;
  rentPaid: number;
  startDate: string | null;
};

function getRentStatus(bed: Bed): RentStatus {
  if (bed.status === "available") return "na";
  // Deterministic demo values; replace with rent-charge API data later.
  const code = bed.id.charCodeAt(bed.id.length - 1);
  if (bed.status === "vacating") return "pending";
  return code % 5 === 0 ? "overdue" : code % 3 === 0 ? "pending" : "paid";
}

function getRentAmount(bed: Bed) {
  return bed.status === "available" ? 0 : 6000;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string | null | undefined) {
  if (!date) return "NA";
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function nextDate(date: string) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + 1);
  return value.toISOString().slice(0, 10);
}

function getStartDate(bed: Bed): string | null {
  if (bed.status === "available") return null;
  // Illustrative dates until the occupancy API is connected.
  return bed.occupancyEndDate ? "2026-09-01" : "2026-10-01";
}

function statusLabel(status: RentStatus) {
  return {
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue",
    na: "N/A",
  }[status];
}

function rentStatusClass(status: RentStatus) {
  return {
    paid: "border-success/20 bg-success/10 text-success",
    pending: "border-warning/20 bg-warning/10 text-warning",
    overdue: "border-danger/20 bg-danger/10 text-danger",
    na: "border-border bg-muted text-muted-foreground",
  }[status];
}

export function RentTab() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [selectedBed, setSelectedBed] = useState<BedDetail | null>(null);
  const [endDates, setEndDates] = useState<Record<string, string>>({});
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const bedDetails = useMemo<BedDetail[]>(
    () =>
      rooms.flatMap((room) =>
        room.beds.map((bed) => {
          const rentStatus = getRentStatus(bed);
          const rentAmount = getRentAmount(bed);
          return {
            room,
            bed,
            rentStatus,
            rentAmount,
            rentPaid:
              rentStatus === "paid"
                ? rentAmount
                : rentStatus === "pending"
                  ? Math.round(rentAmount * 0.25)
                  : 0,
            startDate: getStartDate(bed),
          };
        })
      ),
    []
  );

  const summary = useMemo(() => {
    const active = bedDetails.filter((item) => item.bed.status !== "available");
    return {
      expected: active.reduce((sum, item) => sum + item.rentAmount, 0),
      collected: active.reduce((sum, item) => sum + item.rentPaid, 0),
      pending: active.reduce(
        (sum, item) => sum + item.rentAmount - item.rentPaid,
        0
      ),
      vacant: bedDetails.filter((item) => item.bed.status === "available").length,
    };
  }, [bedDetails]);

  const filteredRooms = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rooms.filter((room) => {
      if (term && !room.number.toLowerCase().includes(term)) return false;

      const items = bedDetails.filter((item) => item.room.number === room.number);

      if (filter === "pending") {
        return items.some(
          (item) =>
            item.rentStatus === "pending" || item.rentStatus === "overdue"
        );
      }
      if (filter === "vacant") {
        return items.some((item) => item.bed.status === "available");
      }
      if (filter === "vacating") {
        return items.some((item) => item.bed.status === "vacating");
      }
      return true;
    });
  }, [search, filter, bedDetails]);

  function openBed(item: BedDetail) {
    setSelectedBed(item);
    setEndDateOpen(false);
    setFormError("");
    setSavedMessage("");
  }

  function saveEndDate() {
    if (!selectedBed) return;

    const id = selectedBed.bed.id;
    const date = endDates[id] ?? "";
    const reason = reasons[id]?.trim() ?? "";

    if (!date) {
      setFormError("Choose the vacancy date.");
      return;
    }
    if (!reason) {
      setFormError("Enter a reason for vacating.");
      return;
    }
    if (selectedBed.startDate && date < selectedBed.startDate) {
      setFormError("The vacancy date cannot be before the occupancy start date.");
      return;
    }

    // Demo only: local page state. This does not persist to a database.
    setSelectedBed({
      ...selectedBed,
      bed: { ...selectedBed.bed, status: "vacating", occupancyEndDate: date },
    });
    setSavedMessage("End date set for this demo session.");
    setFormError("");
    setEndDateOpen(false);
  }

  function addResidentHref(item: BedDetail) {
    const params = new URLSearchParams({
      room: item.room.number,
      floor: String(item.room.floor),
      bed: item.bed.id,
      bedLabel: item.bed.label,
      occupancyType: item.room.sharing === 3 ? "triple" : "double",
    });

    const endDate =
      endDates[item.bed.id] ?? item.bed.occupancyEndDate ?? "";

    if (endDate) {
      params.set("previousEndDate", endDate);
      params.set("startDate", nextDate(endDate));
    }

    return `/add-resident?${params.toString()}`;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-brand/20 bg-brand/10 text-brand">
            <Wallet className="size-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Property management / Collections
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Rent collection
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track rent and occupancy status for every bed.
            </p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Demo data · October 2026
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Expected rent"
          value={formatCurrency(summary.expected)}
          detail="Occupied beds · demo values"
          icon={<IndianRupee className="size-4" />}
        />
        <SummaryCard
          label="Collected"
          value={formatCurrency(summary.collected)}
          detail="Paid and partial payments"
          icon={<CheckCircle2 className="size-4 text-success" />}
        />
        <SummaryCard
          label="Outstanding"
          value={formatCurrency(summary.pending)}
          detail="Pending balance in demo data"
          icon={<CircleAlert className="size-4 text-warning" />}
        />
        <SummaryCard
          label="Vacant beds"
          value={String(summary.vacant)}
          detail="Available for assignment"
          icon={<BedDouble className="size-4 text-info" />}
        />
      </section>

      <section className="rounded-[20px] border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by room number, e.g. 108"
              aria-label="Search by room number"
              className="h-10 w-full rounded-lg border border-input bg-input/30 pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
            />
          </div>
          <div className="relative">
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as FilterStatus)}
              aria-label="Filter rooms"
              className="h-10 w-full appearance-none rounded-lg border border-input bg-input/30 px-3 pr-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 lg:w-52"
            >
              <option value="all">All rooms</option>
              <option value="pending">Pending / overdue rent</option>
              <option value="vacant">Rooms with vacant beds</option>
              <option value="vacating">Rooms with vacating beds</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-3 right-3 size-4 text-muted-foreground" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="font-medium">Rooms and beds</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Select a bed to view its occupancy and rent details.
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            {filteredRooms.length} rooms
          </span>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="py-12 text-center">
            <Search className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No matching rooms</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try another room number or clear the filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 pt-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredRooms.map((room) => (
              <RoomRentCard
                key={room.number}
                room={room}
                items={bedDetails.filter(
                  (item) => item.room.number === room.number
                )}
                onSelect={openBed}
              />
            ))}
          </div>
        )}
      </section>

      <p className="text-xs text-muted-foreground">
        Prototype only: rent amounts and payment statuses are generated from
        mock data. End-date changes remain in page state and are not saved to
        the database.
      </p>

      {selectedBed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedBed(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="bed-modal-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-border p-5">
              <div>
                <p className="text-xs text-muted-foreground">
                  Floor {selectedBed.room.floor} / Room {selectedBed.room.number}
                </p>
                <h2 id="bed-modal-title" className="mt-1 text-xl font-semibold">
                  Bed {selectedBed.bed.label}
                  {selectedBed.bed.residentName
                    ? ` · ${selectedBed.bed.residentName}`
                    : ""}
                </h2>
              {selectedBed.bed.status !== "available" && (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-brand/20 bg-brand/5 p-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Phone className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">
                      Resident phone number
                    </p>

                    {selectedBed.bed.phoneNumber ? (
                      <a
                        href={`tel:${selectedBed.bed.phoneNumber}`}
                        className="mt-1 block truncate text-base font-semibold text-brand hover:underline"
                      >
                        {selectedBed.bed.phoneNumber}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Phone number not added
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-border px-2 py-1 text-xs">
                  {selectedBed.bed.status === "available"
                    ? "Vacant"
                    : selectedBed.bed.status === "vacating"
                      ? "Vacating"
                      : "Occupied"}
                </span>

                <span
                  className={`rounded-full border px-2 py-1 text-xs ${rentStatusClass(selectedBed.rentStatus)}`}
                >
                  Rent {statusLabel(selectedBed.rentStatus)}
                </span>
              </div>

              </div>
              <button
                type="button"
                onClick={() => setSelectedBed(null)}
                aria-label="Close bed details"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="grid grid-cols-2 gap-4">
                <Detail label="Occupancy start date" value={formatDate(selectedBed.startDate)} />
                <Detail
                  label="Occupancy end date"
                  value={formatDate(
                    endDates[selectedBed.bed.id] ??
                      selectedBed.bed.occupancyEndDate
                  )}
                />
                <Detail label="Monthly rent" value={formatCurrency(selectedBed.rentAmount)} />
                <Detail label="Rent paid" value={formatCurrency(selectedBed.rentPaid)} />
              </div>

              {savedMessage && (
                <p role="status" className="rounded-lg border border-success/20 bg-success/10 p-3 text-sm text-success">
                  {savedMessage}
                </p>
              )}

              {selectedBed.bed.status !== "available" && (
                <div className="rounded-xl border border-border p-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEndDateOpen((value) => !value);
                      setFormError("");
                    }}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <CalendarClock className="size-5 text-brand" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">
                        Set occupancy end date
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        Record the expected vacancy date and reason.
                      </span>
                    </span>
                    <ChevronDown className={`size-4 transition-transform ${endDateOpen ? "rotate-180" : ""}`} />
                  </button>

                  {endDateOpen && (
                    <div className="mt-4 space-y-4 border-t border-border pt-4">
                      <label className="block space-y-1.5 text-sm">
                        <span className="font-medium">Vacancy date *</span>
                        <input
                          type="date"
                          min={selectedBed.startDate ?? undefined}
                          value={endDates[selectedBed.bed.id] ?? selectedBed.bed.occupancyEndDate ?? ""}
                          onChange={(event) => {
                            setEndDates((current) => ({
                              ...current,
                              [selectedBed.bed.id]: event.target.value,
                            }));
                            setFormError("");
                          }}
                          className="h-10 w-full rounded-lg border border-input bg-input/30 px-3 text-sm"
                        />
                      </label>
                      <label className="block space-y-1.5 text-sm">
                        <span className="font-medium">Reason for vacating *</span>
                        <textarea
                          rows={3}
                          value={reasons[selectedBed.bed.id] ?? ""}
                          onChange={(event) => {
                            setReasons((current) => ({
                              ...current,
                              [selectedBed.bed.id]: event.target.value,
                            }));
                            setFormError("");
                          }}
                          placeholder="Enter the reason for leaving"
                          className="w-full resize-y rounded-lg border border-input bg-input/30 p-3 text-sm"
                        />
                      </label>
                      {formError && (
                        <p role="alert" className="text-sm text-danger">
                          {formError}
                        </p>
                      )}
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEndDateOpen(false)}
                          className="h-9 rounded-lg border border-border px-3 text-sm hover:bg-muted"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={saveEndDate}
                          className="h-9 rounded-lg bg-brand px-4 text-sm font-medium text-white hover:opacity-90"
                        >
                          Set end date
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Link
                href={addResidentHref(selectedBed)}
                className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                <UserPlus className="size-4" />
                Assign to new resident
              </Link>
              <p className="text-xs text-muted-foreground">
                The Add Resident form will receive the room and bed details.
                Date prefill and conflict validation are the next integration step.
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function RoomRentCard({
  room,
  items,
  onSelect,
}: {
  room: Room;
  items: BedDetail[];
  onSelect: (item: BedDetail) => void;
}) {
  const occupied = room.beds.filter((bed) => bed.status !== "available").length;
  const attention = items.some(
    (item) => item.rentStatus === "pending" || item.rentStatus === "overdue"
  );

  return (
    <article className="rounded-xl border border-border bg-background/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">
            Floor {room.floor} · Room {room.number}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Occupancy: {occupied} of {room.beds.length} beds
          </p>
        </div>
        {attention && (
          <span className="rounded-full bg-warning/10 px-2 py-1 text-xs text-warning">
            Action needed
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <button
            type="button"
            key={item.bed.id}
            onClick={() => onSelect(item)}
            className="flex w-full items-center gap-3 rounded-lg border border-border/70 p-3 text-left transition hover:border-brand/40 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BedDouble className="size-5 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">
                Bed {item.bed.label}
              </span>
              <span className="mt-1 block truncate text-xs text-muted-foreground">
                {item.bed.status === "available"
                  ? "Vacant"
                  : item.bed.status === "vacating"
                    ? "Vacating"
                    : "Occupied"}
                {item.bed.residentName ? ` · ${item.bed.residentName}` : ""}
              </span>
            </span>
            <span className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-xs text-muted-foreground">
                {item.bed.status === "available" ? "Rent N/A" : formatCurrency(item.rentAmount)}
              </span>
              <span className={`rounded-full border px-2 py-1 text-[10px] ${rentStatusClass(item.rentStatus)}`}>
                {statusLabel(item.rentStatus)}
              </span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
