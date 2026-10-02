import type { Complaint } from "@/types";

export const complaints: Complaint[] = [
  {
    id: "c-1042",
    room: "204",
    title: "AC not cooling",
    category: "Electrical",
    priority: "urgent",
    status: "open",
    hoursOpen: 2 + 10 / 60,
    residentName: "Rohan Kumar",
    initials: "RK",
  },
  {
    id: "c-1038",
    room: "112",
    title: "No hot water in bathroom",
    category: "Plumbing",
    priority: "urgent",
    status: "open",
    hoursOpen: 26,
    residentName: "Sneha Iyer",
    initials: "SI",
  },
  {
    id: "c-1040",
    room: "302",
    title: "Water leakage near window",
    category: "Plumbing",
    priority: "medium",
    status: "in_progress",
    hoursOpen: 5.5,
    residentName: "Priya Sharma",
    initials: "PS",
    assignedTo: "Ramesh (Plumber)",
  },
  {
    id: "c-1036",
    room: "405",
    title: "Wi-Fi keeps disconnecting",
    category: "Internet",
    priority: "medium",
    status: "open",
    hoursOpen: 28,
    residentName: "Arjun Nair",
    initials: "AN",
  },
  {
    id: "c-1031",
    room: "109",
    title: "Wardrobe hinge broken",
    category: "Furniture",
    priority: "low",
    status: "in_progress",
    hoursOpen: 54,
    residentName: "Meera Joshi",
    initials: "MJ",
    assignedTo: "Suresh (Carpenter)",
  },
];

/** Share of this month's complaints already solved. */
export const complaintsResolvedRate = 72;
