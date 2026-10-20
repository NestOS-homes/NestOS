/**
 * Shared shapes for NestOS data.
 * Every page (Dashboard, Rooms, Residents…) uses these, so they stay in one place.
 */

export type Property = {
  id: string;
  name: string;
  area: string;
  city: string;
};

export type Manager = {
  firstName: string;
  fullName: string;
  role: string;
  initials: string;
  email?: string;
  imageUrl?: string; // profile photo, e.g. from Google sign-in
};

/* ---------- Rooms & beds ---------- */

export type BedStatus = "occupied" | "available" | "vacating";

export type Bed = {
  id: string;
  label: string;
  status: BedStatus;
  residentName?: string;
  phoneNumber?: string;

  // Mock occupancy end date, in YYYY-MM-DD format.
  // null means an occupied bed has no recorded end date.
  occupancyEndDate?: string | null;
};


export type Room = {
  number: string; // "207"
  floor: number;
  sharing: 2 | 3;
  beds: Bed[];
};

export type OccupancySummary = {
  totalBeds: number;
  occupied: number;
  available: number;
  vacating: number;
  occupancyRate: number; // 0–100
};

/* ---------- Money ---------- */

export type FinanceRange = "12m" | "30d" | "7d";

export type FinancePoint = {
  label: string; // x-axis label
  fullLabel: string; // tooltip label
  revenue: number; // ₹
  expenses: number; // ₹
};

export type FinanceSeries = {
  range: FinanceRange;
  points: FinancePoint[];
  totalRevenue: number;
  totalExpenses: number;
};

export type FinanceSummary = {
  monthLabel: string;
  revenue: number;
  revenueChange: number; // % vs last month
  expenses: number;
  netProfit: number;
  netProfitChange: number;
  expectedRent: number;
  collectedRent: number;
  dueRent: number;
  overdueRent: number;
  collectionRate: number; // 0–100
  collectionChange: number; // % points vs last month
  series: Record<FinanceRange, FinanceSeries>;
};

/* ---------- Residents & payments ---------- */

export type PaymentStatus = "paid" | "due" | "overdue";

export type PaymentRecord = {
  id: string;
  residentName: string;
  initials: string;
  room: string; // "204-A"
  amount: number;
  status: PaymentStatus;
  /** paid: when paid · due: days until due · overdue: days late */
  note: string;
  method?: "UPI" | "Cash" | "Bank transfer";
};

export type ResidentSummary = {
  total: number;
  paid: number;
  due: number;
  overdue: number;
};

/* ---------- Complaints ---------- */

export type ComplaintPriority = "urgent" | "high" | "medium" | "low";

export type ComplaintStatus =
  | "open"
  | "in_progress"
  | "on_hold"
  | "resolved"
  | "closed";

export type ComplaintCategory =
  | "Electrical"
  | "Plumbing"
  | "Internet"
  | "Furniture"
  | "Cleaning"
  | "Appliance"
  | "Other";

export type Complaint = {
  id: string;
  room: string;
  title: string;
  description?: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  hoursOpen: number;
  residentName: string;
  initials: string;
  assignedTo?: string;
  raisedAt?: string;
  slaDueAt?: string;
  resolutionNote?: string;
  closedAt?: string;
};

/* ---------- Needs attention ---------- */

export type AttentionTone = "danger" | "warning" | "info";

export type AttentionItem = {
  id: "overdue-rent" | "urgent-complaints" | "check-ins" | "vacating";
  count: number;
  title: string; // "Overdue rent payments"
  detail: string; // "₹28,000 pending · oldest 12 days"
  tone: AttentionTone;
  actionLabel: string;
};

export type CheckIn = {
  residentName: string;
  initials: string;
  bed: string;
  time: string;
};

/* ---------- Notifications ---------- */

export type Notification = {
  id: string;
  title: string;
  time: string;
  tone: AttentionTone | "success";
  unread: boolean;
};

/* ---------- Everything the dashboard needs ---------- */

export type DashboardData = {
  property: Property;
  manager: Manager;
  attention: AttentionItem[];
  finance: FinanceSummary;
  occupancy: OccupancySummary;
  rooms: Room[];
  complaints: Complaint[];
  complaintsResolvedRate: number; // 0–100, this month
  residents: ResidentSummary;
  payments: PaymentRecord[];
  checkIns: CheckIn[];
  schedule: ScheduleItem[];
};

/* ---------- Today's schedule ---------- */

export type ScheduleItem = {
  id: string;
  time: string; // "11:30 AM"
  title: string;
  detail: string;
  kind: "check-in" | "visit" | "maintenance" | "move-out";
};



/* ---------- Staff management ---------- */

export type StaffRole =
  | "Property Manager"
  | "Housekeeping"
  | "Maintenance"
  | "Security"
  | "Front Desk"
  | "Cook"
  | "Other";

export type StaffSalaryStatus = "paid" | "pending";

export type StaffApprovalStatus =
  | "pending_approval"
  | "approved"
  | "rejected";

export type StaffComplaintStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "resolved";

export type StaffComplaint = {
  id: string;
  title: string;
  room: string;
  status: StaffComplaintStatus;
};

export type StaffMember = {
  id: string;
  fullName: string;
  phone: string;
  photoUrl?: string;
  role: StaffRole;
  monthlySalary: number;
  salaryStatus: StaffSalaryStatus;
  salaryPeriod: string;
  approvalStatus: StaffApprovalStatus;
  assignedComplaints: StaffComplaint[];
};

export type NewStaffSubmission = {
  fullName: string;
  aadhaarNumber: string;
  phone: string;
  photoUrl: string;
  role: StaffRole;
  monthlySalary: number;
};
