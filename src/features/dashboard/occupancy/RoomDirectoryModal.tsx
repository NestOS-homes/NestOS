
"use client";

import { useEffect, useMemo, useState } from "react";
import { BedDouble, Phone, Search, UserRound, X } from "lucide-react";
import type { BedStatus, Room } from "@/types";

type RoomDirectoryModalProps = {
  room: Room | null;
  onClose: () => void;
};

const STATUS_LABEL: Record<BedStatus, string> = {
  occupied: "Occupied",
  available: "Available",
  vacating: "Vacating soon",
};

const STATUS_CLASS: Record<BedStatus, string> = {
  occupied: "border-success/20 bg-success/10 text-success",
  available: "border-info/20 bg-info/10 text-info",
  vacating: "border-warning/20 bg-warning/10 text-warning",
};

export function RoomDirectoryModal({
  room,
  onClose,
}: RoomDirectoryModalProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!room) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [room, onClose]);

  useEffect(() => {
    setSearch("");
  }, [room?.number]);

  const filteredBeds = useMemo(() => {
    if (!room) return [];

    const term = search.trim().toLowerCase();

    return room.beds.filter((bed) => {
      if (!term) return true;

      return (
        bed.label.toLowerCase().includes(term) ||
        bed.id.toLowerCase().includes(term) ||
        bed.residentName?.toLowerCase().includes(term) ||
        bed.phoneNumber?.toLowerCase().includes(term)
      );
    });
  }, [room, search]);

  if (!room) return null;

  const occupiedCount = room.beds.filter(
    (bed) => bed.status === "occupied"
  ).length;

  const availableCount = room.beds.filter(
    (bed) => bed.status === "available"
  ).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-directory-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              Rooms & Beds / Resident directory
            </p>

            <h2
              id="room-directory-title"
              className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl"
            >
              Room {room.number}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Floor {room.floor} · {room.sharing}-sharing
            </p>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-success/10 px-2.5 py-1 text-success">
                {occupiedCount} occupied
              </span>
              <span className="rounded-full bg-info/10 px-2.5 py-1 text-info">
                {availableCount} available
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close room directory"
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="border-b border-border p-4 sm:px-6">
          <div className="relative">
            <Search className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search resident, bed or phone number"
              aria-label="Search this room's resident directory"
              className="h-10 w-full rounded-lg border border-input bg-input/30 pr-3 pl-9 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-6">
          {filteredBeds.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No beds or residents match your search.
            </p>
          ) : (
            filteredBeds.map((bed) => (
              <article
                key={bed.id}
                className="rounded-xl border border-border bg-background/40 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
                      <BedDouble className="size-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-medium">
                        Bed {bed.label}
                      </h3>

                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <UserRound className="size-3.5 shrink-0" />
                        <span className="truncate">
                          {bed.status === "available"
                            ? "No resident assigned"
                            : bed.residentName ?? "Resident name not added"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] ${STATUS_CLASS[bed.status]}`}
                  >
                    {STATUS_LABEL[bed.status]}
                  </span>
                </div>

                {bed.status !== "available" && (
                  <div className="mt-4 flex items-center gap-2 border-t border-border/70 pt-3 text-sm">
                    <Phone className="size-4 shrink-0 text-muted-foreground" />

                    {bed.phoneNumber ? (
                      <a
                        href={`tel:${bed.phoneNumber}`}
                        className="font-medium text-brand hover:underline"
                      >
                        {bed.phoneNumber}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">
                        Phone number not added
                      </span>
                    )}
                  </div>
                )}

                {bed.status === "vacating" && bed.occupancyEndDate && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Expected move-out: {bed.occupancyEndDate}
                  </p>
                )}
              </article>
            ))
          )}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-border p-4 sm:px-6">
          <p className="text-xs text-muted-foreground">
            {filteredBeds.length} of {room.beds.length} beds shown
          </p>

          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-border px-4 text-sm font-medium transition hover:bg-muted"
          >
            Close
          </button>
        </footer>
      </section>
    </div>
  );
}
