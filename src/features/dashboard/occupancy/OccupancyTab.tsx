
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BedDouble,
  Building2,
  Search,
  UserRoundPlus,
} from "lucide-react";

import { rooms } from "@/data/mock/rooms";
import type { BedStatus, Room } from "@/types";

const STATUS_LABEL: Record<BedStatus, string> = {
  occupied: "Occupied",
  available: "Available",
  vacating: "Vacating soon",
};

const STATUS_CLASS: Record<BedStatus, string> = {
  occupied: "bg-success/10 text-success border-success/20",
  available: "bg-info/10 text-info border-info/20",
  vacating: "bg-warning/10 text-warning border-warning/20",
};

export function OccupancyTab() {
  const [search, setSearch] = useState("");
  const [floorFilter, setFloorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const summary = useMemo(() => {
    const beds = rooms.flatMap((room) => room.beds);
    const occupied = beds.filter((bed) => bed.status === "occupied").length;
    const available = beds.filter((bed) => bed.status === "available").length;
    const vacating = beds.filter((bed) => bed.status === "vacating").length;

    return {
      rooms: rooms.length,
      floors: new Set(rooms.map((room) => room.floor)).size,
      totalBeds: beds.length,
      occupied,
      available,
      vacating,
      occupancyRate: beds.length
        ? Math.round((occupied / beds.length) * 100)
        : 0,
    };
  }, []);

  const floors = useMemo(
    () => [...new Set(rooms.map((room) => room.floor))].sort((a, b) => a - b),
    []
  );

  const filteredRooms = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rooms
      .filter((room) => {
        const matchesFloor =
          floorFilter === "all" || room.floor === Number(floorFilter);

        const matchesSearch =
          !term ||
          room.number.toLowerCase().includes(term) ||
          room.beds.some((bed) =>
            bed.residentName?.toLowerCase().includes(term)
          ) ||
          room.beds.some((bed) => bed.id.toLowerCase().includes(term));

        const matchesStatus =
          statusFilter === "all" ||
          room.beds.some((bed) => bed.status === statusFilter);

        return matchesFloor && matchesSearch && matchesStatus;
      })
      .sort(
        (a, b) => a.floor - b.floor || a.number.localeCompare(b.number)
      );
  }, [search, floorFilter, statusFilter]);

  const groupedRooms = floors
    .map((floor) => ({
      floor,
      rooms: filteredRooms.filter((room) => room.floor === floor),
    }))
    .filter((group) => group.rooms.length > 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-brand/20 bg-brand/10 text-brand">
            <Building2 className="size-5" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Property management / Rooms & Beds
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Occupancy
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              See room availability, resident assignments and upcoming
              move-outs.
            </p>
          </div>
        </div>

        <Link
          href="/add-resident"
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg bg-brand px-4 text-sm font-medium text-white transition hover:opacity-90 sm:self-auto"
        >
          <UserRoundPlus className="size-4" />
          Add Resident
        </Link>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total beds"
          value={summary.totalBeds}
          detail={`${summary.rooms} rooms across ${summary.floors} floors`}
          marker="bg-foreground/60"
        />
        <SummaryCard
          label="Occupied"
          value={summary.occupied}
          detail={`${summary.occupancyRate}% occupancy`}
          marker="bg-success"
        />
        <SummaryCard
          label="Available beds"
          value={summary.available}
          detail="Ready for assignment"
          marker="bg-info"
        />
        <SummaryCard
          label="Vacating soon"
          value={summary.vacating}
          detail="Expected to become available"
          marker="bg-warning"
        />
      </section>

      <section className="rounded-[20px] border border-border bg-card p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search room, bed or resident name"
              aria-label="Search room, bed or resident name"
              className="h-10 w-full rounded-lg border border-input bg-input/30 pr-3 pl-9 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
            />
          </div>

          <select
            value={floorFilter}
            onChange={(event) => setFloorFilter(event.target.value)}
            aria-label="Filter by floor"
            className="h-10 rounded-lg border border-input bg-input/30 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <option value="all">All floors</option>
            {floors.map((floor) => (
              <option key={floor} value={floor}>
                Floor {floor}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by bed status"
            className="h-10 rounded-lg border border-input bg-input/30 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <option value="all">All bed statuses</option>
            <option value="occupied">Occupied</option>
            <option value="available">Available</option>
            <option value="vacating">Vacating soon</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h2 className="font-medium">Floor-by-floor rooms</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Select a floor filter or search to narrow the list.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <Legend marker="bg-success" label="Occupied" />
            <Legend marker="bg-info" label="Available" />
            <Legend marker="bg-warning" label="Vacating soon" />
          </div>
        </div>

        {groupedRooms.length === 0 ? (
          <div className="py-12 text-center">
            <BedDouble className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No matching rooms</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="space-y-7 pt-5">
            {groupedRooms.map((group) => (
              <section key={group.floor}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold">
                    Floor {group.floor}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {group.rooms.length}{" "}
                    {group.rooms.length === 1 ? "room" : "rooms"}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {group.rooms.map((room) => (
                    <RoomCard key={room.number} room={room} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>

      <p className="text-xs text-muted-foreground">
        Demo data: room and bed statuses are read from the local mock inventory.
        Resident approvals and live bed assignments are not connected to a
        backend yet.
      </p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  marker,
}: {
  label: string;
  value: number;
  detail: string;
  marker: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className={`size-2.5 rounded-full ${marker}`} />
        {label}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function RoomCard({ room }: { room: Room }) {
  const availableCount = room.beds.filter(
    (bed) => bed.status === "available"
  ).length;

  return (
    <article className="rounded-xl border border-border bg-background/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-medium">Room {room.number}</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            {room.sharing}-sharing · Floor {room.floor}
          </p>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs ${
            availableCount > 0
              ? "bg-info/10 text-info"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {availableCount} free
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {room.beds.map((bed) => (
          <div
            key={bed.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className={`size-2.5 shrink-0 rounded-full ${
                  bed.status === "occupied"
                    ? "bg-success"
                    : bed.status === "available"
                      ? "bg-info"
                      : "bg-warning"
                }`}
              />

              <div className="min-w-0">
                <p className="text-sm font-medium">Bed {bed.label}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {bed.status === "available"
                    ? "Ready for assignment"
                    : bed.residentName ?? "Resident details unavailable"}
                </p>
              </div>
            </div>

            <span
              className={`shrink-0 rounded-full border px-2 py-1 text-[10px] ${STATUS_CLASS[bed.status]}`}
            >
              {STATUS_LABEL[bed.status]}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

function Legend({ marker, label }: { marker: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`size-2 rounded-full ${marker}`} />
      {label}
    </span>
  );
}
