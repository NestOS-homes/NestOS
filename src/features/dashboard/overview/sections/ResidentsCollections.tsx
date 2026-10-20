"use client";

import { useState } from "react";
import { BellRing } from "lucide-react";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { SectionCard } from "@/components/shared/SectionCard";
import { formatINR } from "@/lib/format";
import type { PaymentRecord, ResidentSummary, Room } from "@/types";

type ResidentsCollectionsProps = {
  monthLabel: string;
  residents: ResidentSummary;
  payments: PaymentRecord[];
  rooms: Room[];
  collected: number;
  expected: number;
  due: number;
  overdue: number;
  collectionRate: number;
};

/** Collection summary and overdue rent follow-ups. */
export function ResidentsCollections({
  monthLabel,
  residents,
  payments,
  rooms,
}: ResidentsCollectionsProps) {
  const [reminderNotice, setReminderNotice] = useState("");

  // Use Rooms & Beds as the source of truth for resident names and bed IDs.
  const bedsById = new Map(
    rooms.flatMap((room) =>
      room.beds.map((bed) => [bed.id, bed] as const)
    )
  );

  const overduePayments = payments.filter(
    (payment) => payment.status === "overdue"
  );

  const summaryCards = [
    { label: "Total Residents", value: residents.total },
    { label: "Paid", value: residents.paid },
    { label: "Due", value: residents.due },
    { label: "Overdue", value: residents.overdue },
  ];

  return (
    <SectionCard
      title="Collection & Follow-up"
      description={`${monthLabel} rent collection`}
    >
      <div className="space-y-6">
        {/* Existing resident summary numbers */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="surface-tile rounded-xl border border-border px-4 py-3"
            >
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className="mt-2 text-2xl font-medium tracking-tight">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Overdue payments only */}
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-medium">Overdue payments</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Residents who need a rent payment reminder
              </p>
            </div>

            <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-medium text-danger">
              {overduePayments.length} overdue
            </span>
          </div>

          {overduePayments.length === 0 ? (
            <div className="rounded-xl border border-border p-6 text-center">
              <p className="text-sm font-medium">No overdue payments</p>
              <p className="mt-1 text-xs text-muted-foreground">
                All recorded rent payments are up to date.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border rounded-xl border border-border">
              {overduePayments.map((payment) => {
                const bed = bedsById.get(payment.room);
                const residentName = bed?.residentName ?? payment.residentName;
                const initials = residentName
                  .split(/\s+/)
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <li
                    key={payment.id}
                    className="flex flex-wrap items-center gap-3 px-3 py-3 sm:px-4"
                  >
                    <InitialsAvatar
                      name={residentName}
                      initials={initials}
                    />

                    <div className="min-w-[140px] flex-1">
                      <p className="truncate text-sm font-medium">
                        {residentName}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Room {payment.room.split("-")[0]} · Bed{" "}
                        {payment.room.split("-")[1]}
                      </p>
                      <p className="mt-1 text-xs text-danger">
                        {payment.note}
                      </p>
                    </div>

                    <p className="text-sm font-semibold tabular-nums">
                      {formatINR(payment.amount)}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setReminderNotice(
                          `Reminder action for ${residentName} is not connected yet. No message was sent.`
                        )
                      }
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-brand/15 px-3 text-xs font-medium text-brand transition-colors hover:bg-brand/25"
                    >
                      <BellRing className="size-3.5" />
                      Remind
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {reminderNotice ? (
            <p
              role="status"
              className="mt-3 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground"
            >
              {reminderNotice}
            </p>
          ) : null}
        </div>
      </div>
    </SectionCard>
  );
}