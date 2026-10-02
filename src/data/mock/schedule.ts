import type { ScheduleItem } from "@/types";

/* What is planned at Sunrise Residency today, in time order. */
export const todaySchedule: ScheduleItem[] = [
  { id: "s1", time: "11:30 AM", title: "Ananya Gupta checks in", detail: "Bed 207-B · Keys & ID check", kind: "check-in" },
  { id: "s2", time: "1:00 PM", title: "Room visit: Rohit Malhotra", detail: "Enquiry for a 2-sharing bed", kind: "visit" },
  { id: "s3", time: "3:00 PM", title: "Plumber visit, Room 112", detail: "No hot water · Urgent", kind: "maintenance" },
  { id: "s4", time: "4:00 PM", title: "Karan Mehta checks in", detail: "Bed 305-C · Deposit pending", kind: "check-in" },
  { id: "s5", time: "6:00 PM", title: "Room 108 move-out check", detail: "2 beds free from Monday", kind: "move-out" },
];
