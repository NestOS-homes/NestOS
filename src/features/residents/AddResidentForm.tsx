
"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BedDouble,
  CheckCircle2,
  ChevronDown,
  Info,
  ShieldCheck,
  UserRoundPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { rooms } from "@/data/mock/rooms";
import type { Room } from "@/types";

type OccupancyType = "single" | "double" | "triple" | "colive";

const OCCUPANCY_OPTIONS: {
  value: OccupancyType;
  label: string;
  description: string;
}[] = [
  {
    value: "single",
    label: "Single sharing",
    description: "One resident in a room",
  },
  {
    value: "double",
    label: "Double sharing",
    description: "Two residents in a room",
  },
  {
    value: "triple",
    label: "Triple sharing",
    description: "Three residents in a room",
  },
  {
    value: "colive",
    label: "Co-living",
    description: "Choose from rooms configured for your co-living property",
  },
];

function availableBeds(room: Room) {
  return room.beds.filter((bed) => bed.status === "available");
}

function roomMatchesType(room: Room, type: OccupancyType) {
  if (type === "single") return false;
  if (type === "double") return room.sharing === 2;
  if (type === "triple") return room.sharing === 3;

  // Co-living can use any room with an available bed.
  return true;
}

export function AddResidentForm() {
  const [occupancyType, setOccupancyType] = useState<OccupancyType | "">("");
  const [roomNumber, setRoomNumber] = useState("");
  const [bedId, setBedId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [error, setError] = useState("");
  const [demoNotice, setDemoNotice] = useState(false);

  const eligibleRooms = useMemo(() => {
    if (!occupancyType) return [];

    return rooms
      .filter(
        (room) =>
          roomMatchesType(room, occupancyType) &&
          availableBeds(room).length > 0
      )
      .sort(
        (a, b) =>
          a.floor - b.floor || a.number.localeCompare(b.number)
      );
  }, [occupancyType]);

  const selectedRoom = eligibleRooms.find(
    (room) => room.number === roomNumber
  );

  const eligibleBeds = selectedRoom ? availableBeds(selectedRoom) : [];

  function changeOccupancyType(value: OccupancyType | "") {
    setOccupancyType(value);
    setRoomNumber("");
    setBedId("");
    setError("");
    setDemoNotice(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setDemoNotice(false);

    if (
      !occupancyType ||
      !selectedRoom ||
      !eligibleBeds.some((bed) => bed.id === bedId)
    ) {
      setError(
        "Choose an occupancy type, an available room and an available bed."
      );
      return;
    }

    if (name.trim().length < 2) {
      setError("Enter the resident's full name.");
      return;
    }

    if (!/^\+?[0-9\s()-]{10,16}$/.test(phone.trim())) {
      setError("Enter a valid phone number.");
      return;
    }

    if (!/^\d{12}$/.test(aadhaar.trim())) {
      setError("Enter a 12-digit Aadhaar number.");
      return;
    }

    // Demo only: no resident API is connected yet.
    // Do not save or send the Aadhaar number.
    setDemoNotice(true);
    setAadhaar("");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-brand/20 bg-brand/10 text-brand">
          <UserRoundPlus className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">
            Residents / New request
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Add resident
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter resident details and request approval for a room and bed
            assignment.
          </p>
        </div>
      </div>

      {demoNotice && (
        <div
          role="status"
          className="flex gap-3 rounded-2xl border border-info/30 bg-info/10 p-4"
        >
          <Info className="mt-0.5 size-5 shrink-0 text-info" />
          <div>
            <p className="font-medium">
              Form validation successful — demo mode
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              No request was saved or sent to NestOS admins because this
              frontend is not connected to the residents API yet. The Aadhaar
              field has been cleared.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="rounded-[20px] border border-border bg-card p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] sm:p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
              01
            </div>
            <div>
              <h2 className="font-medium">
                Occupancy and bed assignment
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose the occupancy type first. Room and bed options update
                based on your selection.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Occupancy type"
              hint="Select the requested arrangement"
            >
              <div className="relative">
                <select
                  required
                  value={occupancyType}
                  onChange={(event) =>
                    changeOccupancyType(
                      event.target.value as OccupancyType | ""
                    )
                  }
                  className="h-10 w-full appearance-none rounded-lg border border-input bg-input/30 px-3 pr-10 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                  <option value="">Select occupancy type</option>
                  {OCCUPANCY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-3 right-3 size-4 text-muted-foreground" />
              </div>

              {occupancyType && (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {
                    OCCUPANCY_OPTIONS.find(
                      (option) => option.value === occupancyType
                    )?.description
                  }
                </p>
              )}
            </Field>

            <Field
              label="Available room"
              hint="Only rooms with available beds are listed"
            >
              <div className="relative">
                <select
                  required
                  value={roomNumber}
                  disabled={!occupancyType || eligibleRooms.length === 0}
                  onChange={(event) => {
                    setRoomNumber(event.target.value);
                    setBedId("");
                    setError("");
                    setDemoNotice(false);
                  }}
                  className="h-10 w-full appearance-none rounded-lg border border-input bg-input/30 px-3 pr-10 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {!occupancyType
                      ? "Choose occupancy first"
                      : eligibleRooms.length
                        ? "Select a room"
                        : "No matching rooms available"}
                  </option>

                  {eligibleRooms.map((room) => (
                    <option key={room.number} value={room.number}>
                      Room {room.number} · Floor {room.floor} ·{" "}
                      {availableBeds(room).length} bed(s) free
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-3 right-3 size-4 text-muted-foreground" />
              </div>

              {occupancyType === "single" &&
                eligibleRooms.length === 0 && (
                  <p className="mt-1.5 text-xs text-warning">
                    The current demo inventory has no single-sharing rooms
                    configured.
                  </p>
                )}
            </Field>

            <Field
              label="Available bed"
              hint="Bed choices update when a room is selected"
            >
              <div className="relative">
                <select
                  required
                  value={bedId}
                  disabled={!selectedRoom || eligibleBeds.length === 0}
                  onChange={(event) => {
                    setBedId(event.target.value);
                    setError("");
                    setDemoNotice(false);
                  }}
                  className="h-10 w-full appearance-none rounded-lg border border-input bg-input/30 px-3 pr-10 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {selectedRoom ? "Select a bed" : "Choose a room first"}
                  </option>

                  {eligibleBeds.map((bed) => (
                    <option key={bed.id} value={bed.id}>
                      Bed {bed.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-3 right-3 size-4 text-muted-foreground" />
              </div>
            </Field>

            {selectedRoom && bedId && (
              <div className="flex items-center gap-3 rounded-xl border border-info/20 bg-info/5 p-3">
                <BedDouble className="size-5 text-info" />
                <div>
                  <p className="text-sm font-medium">
                    Room {selectedRoom.number}, Bed{" "}
                    {selectedRoom.beds.find((bed) => bed.id === bedId)?.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Floor {selectedRoom.floor} · {selectedRoom.sharing}
                    -sharing configuration
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[20px] border border-border bg-card p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] sm:p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue">
              02
            </div>
            <div>
              <h2 className="font-medium">Resident details</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Use the resident's correct contact and identity details.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full name">
              <Input
                required
                minLength={2}
                autoComplete="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                  setDemoNotice(false);
                }}
                placeholder="Enter full name"
                className="h-10 bg-input/30"
              />
            </Field>

            <Field
              label="Phone number"
              hint="Include country code if needed"
            >
              <Input
                required
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setError("");
                  setDemoNotice(false);
                }}
                placeholder="e.g. +91 98765 43210"
                className="h-10 bg-input/30"
              />
            </Field>

            <Field
              label="Aadhaar number"
              hint="12 digits · sensitive information"
            >
              <Input
                required
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={12}
                minLength={12}
                pattern="[0-9]{12}"
                value={aadhaar}
                onChange={(event) => {
                  setAadhaar(
                    event.target.value.replace(/\D/g, "").slice(0, 12)
                  );
                  setError("");
                  setDemoNotice(false);
                }}
                placeholder="Enter 12-digit Aadhaar"
                className="h-10 bg-input/30"
              />
            </Field>
          </div>

          <div className="mt-4 flex gap-2 rounded-xl border border-warning/20 bg-warning/5 p-3 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-warning" />
            <p>
              Aadhaar is sensitive personal information. In production, use
              approved collection and storage practices, restrict access, mask
              it in views, and never log or expose the full number. This
              prototype does not send or store it.
            </p>
          </div>
        </section>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/dashboard/occupancy"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Rooms & Beds
          </Link>

          <Button type="submit" size="lg" className="h-10 gap-2 px-5">
            <CheckCircle2 className="size-4" />
            Submit for Approval
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <label className="block text-sm font-medium">{label}</label>
      {children}
      {hint && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
