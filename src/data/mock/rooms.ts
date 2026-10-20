import type { BedStatus, Room } from "@/types";

/*
 * Sunrise Residency: 4 floors × 10 rooms = 40 rooms, 100 beds.
 * Rooms x01–x05 are 3-sharing, x06–x10 are 2-sharing.
 * Every bed is occupied unless listed below.
 */

const AVAILABLE = new Set(["103-C", "207-B", "210-A", "210-B", "305-C", "309-B", "402-A", "406-B"]); // 8 beds
const VACATING = new Set(["108-A", "108-B", "204-C", "301-B", "404-A", "410-B"]); // 6 beds — all of Room 108 leaves

const FIRST_NAMES = [
  "Rohan", "Priya", "Arjun", "Sneha", "Vikram", "Neha", "Rahul", "Aditi", "Karan", "Meera",
  "Siddharth", "Pooja", "Ishaan", "Kavya", "Aman", "Riya", "Nikhil", "Tanvi", "Varun", "Shreya",
];
const LAST_NAMES = ["Kumar", "Sharma", "Nair", "Iyer", "Singh", "Kapoor", "Verma", "Rao", "Mehta", "Joshi", "Jain", "Reddy"];

function statusFor(bedId: string): BedStatus {
  if (AVAILABLE.has(bedId)) return "available";
  if (VACATING.has(bedId)) return "vacating";
  return "occupied";
}

function buildRooms(): Room[] {
  const rooms: Room[] = [];
  let n = 0;
  for (let floor = 1; floor <= 4; floor++) {
    for (let r = 1; r <= 10; r++) {
      const number = `${floor}${String(r).padStart(2, "0")}`;
      const sharing = r <= 5 ? 3 : 2;
      const beds = Array.from({ length: sharing }, (_, i) => {
        const label = String.fromCharCode(65 + i);
        const id = `${number}-${label}`;
        const status = statusFor(id);
        n++;
        const occupancyEndDate =
  status === "vacating"
    ? {
        "108-A": "2026-10-25",
        "108-B": "2026-10-28",
        "204-C": "2026-11-05",
        "301-B": "2026-10-22",
        "404-A": "2026-11-10",
        "410-B": "2026-10-30",
      }[id] ?? null
    : status === "occupied"
      ? null
      : undefined;

return {
  id,
  label,
  status,
  residentName:
    status === "available"
      ? undefined
      : `${FIRST_NAMES[n % FIRST_NAMES.length]} ${LAST_NAMES[(n * 7) % LAST_NAMES.length]}`,
  occupancyEndDate,
};
      });
      rooms.push({ number, floor, sharing, beds });
    }
  }
  return rooms;
}

export const rooms: Room[] = buildRooms();
