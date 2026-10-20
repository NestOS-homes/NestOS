
import {
  BedDouble,
  Boxes,
  IndianRupee,
  LayoutGrid,
  MessageSquareWarning,
  Settings,
  LifeBuoy,
  UserCog,
  UserRoundPlus,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/*
 * Every section of NestOS, in one list.
 * The sidebar and mobile bar both read from here.
 */

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  ready: boolean;
  badge?: number;
};

export const mainNav: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
    ready: true,
  },
  {
    label: "Rooms & Beds",
    href: "/dashboard/occupancy",
    icon: BedDouble,
    ready: true,
  },
  {
    label: "Add Resident",
    href: "/add-resident",
    icon: UserRoundPlus,
    ready: true,
  },
  
{
  label: "Staff",
  href: "/dashboard/staff",
  icon: UserCog,
  ready: true,
},

  {
    label: "Rent & Payments",
    href: "/payments",
    icon: IndianRupee,
    ready: false,
  },
  {
    label: "Complaints",
    href: "/complaints",
    icon: MessageSquareWarning,
    ready: true,
    badge: 5,
  },
  {
    label: "Finance",
    href: "/finance",
    icon: Wallet,
    ready: false,
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: Boxes,
    ready: false,
  },
];

export const footerNav: NavItem[] = [
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    ready: false,
  },
  {
    label: "Help & support",
    href: "/help",
    icon: LifeBuoy,
    ready: false,
  },
];

/* The pill tabs shown in the top bar for each section. */
export type TabItem = {
  label: string;
  href: string;
};

export const sectionTabs: Record<string, TabItem[]> = {
  "/dashboard": [
    { label: "Overview", href: "/dashboard" },
    { label: "Finance", href: "/dashboard/finance" },
    { label: "Occupancy", href: "/dashboard/occupancy" },
  ],
};

/**
 * Finds the tabs for the current page.
 * Example: "/dashboard/finance" → dashboard tabs.
 */
export function tabsFor(pathname: string): TabItem[] {
  const key = Object.keys(sectionTabs).find(
    (k) => pathname === k || pathname.startsWith(`${k}/`)
  );

  return key ? sectionTabs[key] : [];
}
