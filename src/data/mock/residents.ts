import type { CheckIn, PaymentRecord, ResidentSummary } from "@/types";

/* 86 residents (one per occupied or vacating bed). */
export const residentSummary: ResidentSummary = {
  total: 86,
  paid: 75,
  due: 8,
  overdue: 3,
};

/* Overdue first (most urgent), then upcoming dues, then today's payments. */
export const payments: PaymentRecord[] = [
  { id: "p1", residentName: "Vikram Singh", initials: "VS", room: "204-A", amount: 12_500, status: "overdue", note: "12 days late" },
  { id: "p2", residentName: "Neha Kapoor", initials: "NK", room: "309-A", amount: 8_500, status: "overdue", note: "6 days late" },
  { id: "p3", residentName: "Rahul Verma", initials: "RV", room: "401-C", amount: 7_000, status: "overdue", note: "3 days late" },
  { id: "p4", residentName: "Pooja Reddy", initials: "PR", room: "307-A", amount: 11_000, status: "due", note: "Due in 2 days" },
  { id: "p5", residentName: "Aditi Rao", initials: "AR", room: "106-A", amount: 9_500, status: "paid", note: "Today, 10:24 AM", method: "UPI" },
  { id: "p6", residentName: "Siddharth Jain", initials: "SJ", room: "203-B", amount: 8_000, status: "paid", note: "Today, 9:02 AM", method: "Bank transfer" },
];

export const checkIns: CheckIn[] = [
  { residentName: "Ananya Gupta", initials: "AG", bed: "207-B", time: "11:30 AM" },
  { residentName: "Karan Mehta", initials: "KM", bed: "305-C", time: "4:00 PM" },
];
