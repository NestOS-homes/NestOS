export type ExpenseStatus = "paid" | "pending" | "pending_approval" | "rejected";

export type FinanceExpense = {
  id: string;
  propertyId: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  status: ExpenseStatus;
  type: "fixed" | "staff";

  // Submission and approval
  submittedBy?: string;
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;

  // Payment and supplier
  vendor?: string;
  paymentMethod?: string;
  paymentReference?: string;
  paidAmount?: number;

  // Expense details
  description?: string;
  propertyName?: string;
  scope?: string;
  roomNumber?: string;
  bedLabel?: string;
  complaintReference?: string;
  receiptUrl?: string;
  notes?: string;

  // Recurring expense details
  recurring?: string;
  expensePeriod?: string;
  gstAmount?: number;
  capitalExpense?: boolean;
};


export const fixedExpenses: FinanceExpense[] = [
  {
    id: "fx-001",
    propertyId: "sunrise",
    title: "Building lease",
    category: "Property rent",
    amount: 90000,
    date: "2026-10-01",
    status: "paid",
    type: "fixed",
    vendor: "Property owner",
    recurring: "Monthly",
  },
  {
    id: "fx-002",
    propertyId: "sunrise",
    title: "Staff salaries",
    category: "Staff",
    amount: 85000,
    date: "2026-10-05",
    status: "pending",
    type: "fixed",
    recurring: "Monthly",
  },
  {
    id: "fx-003",
    propertyId: "sunrise",
    title: "Internet connection",
    category: "Utilities",
    amount: 4500,
    date: "2026-10-07",
    status: "paid",
    type: "fixed",
    vendor: "Internet provider",
    recurring: "Monthly",
  },
  {
    id: "fx-004",
    propertyId: "sunrise",
    title: "Security services",
    category: "Security",
    amount: 18000,
    date: "2026-10-10",
    status: "paid",
    type: "fixed",
    recurring: "Monthly",
  },
  {
    id: "fx-005",
    propertyId: "sunrise",
    title: "Housekeeping supplies",
    category: "Housekeeping",
    amount: 7500,
    date: "2026-10-12",
    status: "pending",
    type: "fixed",
    recurring: "Monthly",
  },
  {
    id: "se-001",
    propertyId: "sunrise",
    propertyName: "Sunrise Residency",
    title: "Bathroom plumbing repair",
    category: "Repairs",
    description: "Repair the leaking bathroom pipe and replace the damaged connector.",
    amount: 3200,
    date: "2026-10-18",
    status: "pending_approval",
    type: "staff",
    submittedBy: "Rakesh Kumar",
    submittedAt: "2026-10-18T11:30:00",
    vendor: "QuickFix Plumbing",
    paymentMethod: "UPI",
    paymentReference: "",
    paidAmount: 0,
    scope: "Room",
    roomNumber: "101",
    bedLabel: "",
    complaintReference: "CMP-102",
    receiptUrl: "",
    notes: "Urgent repair requested by the resident.",
    expensePeriod: "October 2026",
    gstAmount: 488,
    capitalExpense: false,
  },
];

export const staffExpenses: FinanceExpense[] = [
  {
    id: "se-001",
    propertyId: "sunrise",
    title: "Bathroom plumbing repair",
    category: "Repairs",
    amount: 3200,
    date: "2026-10-18",
    status: "pending_approval",
    type: "staff",
    submittedBy: "Rakesh Kumar",
    vendor: "QuickFix Plumbing",
  },
  {
    id: "se-002",
    propertyId: "sunrise",
    title: "Replacement LED bulbs",
    category: "Maintenance",
    amount: 1450,
    date: "2026-10-17",
    status: "pending_approval",
    type: "staff",
    submittedBy: "Amit Sharma",
    vendor: "City Electricals",
  },
  {
    id: "se-003",
    propertyId: "sunrise",
    title: "Water pump servicing",
    category: "Repairs",
    amount: 2800,
    date: "2026-10-15",
    status: "paid",
    type: "staff",
    submittedBy: "Rakesh Kumar",
    vendor: "PumpCare Services",
  },
  {
    id: "se-004",
    propertyId: "sunrise",
    title: "Cleaning equipment",
    category: "Housekeeping",
    amount: 2100,
    date: "2026-10-13",
    status: "pending",
    type: "staff",
    submittedBy: "Meena Devi",
    vendor: "CleanMart",
  },
];

/**
 * Reporting figures are illustrative demo values.
 * Replace with rent-charge and payment API data when connected.
 */
export const financeHistory = [
  { period: "May 2026", expected: 880000, collected: 821000, fixed: 190000, staff: 42000 },
  { period: "Jun 2026", expected: 895000, collected: 846000, fixed: 194000, staff: 38000 },
  { period: "Jul 2026", expected: 905000, collected: 862000, fixed: 196000, staff: 45000 },
  { period: "Aug 2026", expected: 915000, collected: 874000, fixed: 198000, staff: 41000 },
  { period: "Sep 2026", expected: 920000, collected: 861000, fixed: 201000, staff: 47000 },
  { period: "Oct 2026", expected: 924000, collected: 844000, fixed: 205000, staff: 38000 },
];
