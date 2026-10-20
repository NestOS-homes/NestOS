import { complaints, complaintsResolvedRate } from "@/data/mock/complaints";
import { getFinanceSummary } from "@/data/mock/finance";
import { manager, properties } from "@/data/mock/property";
import { getOccupancySummary } from "@/services/occupancy";
import { checkIns, payments, residentSummary } from "@/data/mock/residents";
import { rooms } from "@/data/mock/rooms";
import { todaySchedule } from "@/data/mock/schedule";
import { formatINR } from "@/lib/format";
import type { AttentionItem, DashboardData, OccupancySummary, Room } from "@/types";

/*
 * The one place the dashboard gets its data from.
 * Today it reads sample data. Later, only this file changes to call the real API —
 * the dashboard components stay the same.
 */

function buildAttention(list: Room[]): AttentionItem[] {
  const overdue = payments.filter((p) => p.status === "overdue");
  const overdueTotal = overdue.reduce((sum, p) => sum + p.amount, 0);
  const urgent = complaints.filter((c) => c.priority === "urgent");
  const vacatingRooms = list.filter((r) => r.beds.every((b) => b.status === "vacating"));

  return [
    {
      id: "overdue-rent",
      count: overdue.length,
      title: "Overdue rent payments",
      detail: `${formatINR(overdueTotal)} pending · oldest ${overdue[0]?.note.replace(" late", "")}`,
      tone: "danger",
      actionLabel: "Send reminders",
    },
    {
      id: "urgent-complaints",
      count: urgent.length,
      title: "Urgent complaints",
      detail: `${urgent.map((c) => c.title).join(" · ")}`,
      tone: "danger",
      actionLabel: "Assign staff",
    },
    {
      id: "check-ins",
      count: checkIns.length,
      title: "Check-ins today",
      detail: checkIns.map((c) => `${c.residentName.split(" ")[0]} ${c.time}`).join(" · "),
      tone: "info",
      actionLabel: "View check-ins",
    },
    {
      id: "vacating",
      count: vacatingRooms.length,
      title: vacatingRooms.length === 1 ? "Room becoming vacant" : "Rooms becoming vacant",
      detail: vacatingRooms.map((r) => `Room ${r.number} · ${r.sharing} beds free in 2 days`).join(" · "),
      tone: "warning",
      actionLabel: "Prepare room",
    },
  ];
}

export async function getDashboardData(propertyId = "sunrise"): Promise<DashboardData> {
  const property = properties.find((p) => p.id === propertyId) ?? properties[0];
  const today = new Date();

  return {
    property,
    manager,
    attention: buildAttention(rooms),
    finance: getFinanceSummary(today),
    occupancy: getOccupancySummary(rooms),
    rooms,
    complaints,
    complaintsResolvedRate,
    residents: residentSummary,
    payments,
    checkIns,
    schedule: todaySchedule,
  };
}
