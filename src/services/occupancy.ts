
import type { OccupancySummary, Room } from "@/types";

/**
 * Shared occupancy calculations for the Dashboard and Rooms & Beds.
 * Both pages should use this function rather than calculating totals separately.
 */
export function getOccupancySummary(rooms: Room[]): OccupancySummary {
  const beds = rooms.flatMap((room) => room.beds);

  const occupied = beds.filter((bed) => bed.status === "occupied").length;
  const available = beds.filter((bed) => bed.status === "available").length;
  const vacating = beds.filter((bed) => bed.status === "vacating").length;

  return {
    totalBeds: beds.length,
    occupied,
    available,
    vacating,
    occupancyRate: beds.length
      ? Math.round((occupied / beds.length) * 100)
      : 0,
  };
}
