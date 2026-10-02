import type { Manager, Notification, Property } from "@/types";

export const properties: Property[] = [
  { id: "sunrise", name: "Sunrise Residency", area: "Sector 45", city: "Gurugram" },
  { id: "greennest", name: "Green Nest Co-living", area: "DLF Phase 3", city: "Gurugram" },
  { id: "urbanstay", name: "The Urban Stay", area: "Sohna Road", city: "Gurugram" },
];

export const manager: Manager = {
  firstName: "Vinayak",
  fullName: "Vinayak Jha",
  role: "Property Manager",
  initials: "VJ",
};

export const notifications: Notification[] = [
  { id: "n1", title: "Vikram Singh's rent is 12 days overdue", time: "10 min ago", tone: "danger", unread: true },
  { id: "n2", title: "Urgent: AC not cooling in Room 204", time: "2h ago", tone: "danger", unread: true },
  { id: "n3", title: "Aditi Rao paid ₹9,500 via UPI", time: "3h ago", tone: "success", unread: true },
  { id: "n4", title: "Ananya Gupta checks in today at 11:30 AM", time: "Today", tone: "info", unread: false },
];
