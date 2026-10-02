"use client";

import { usePathname } from "next/navigation";
import { tabsFor } from "@/lib/navigation";
import type { Manager, Notification, Property } from "@/types";
import { Logo } from "./Logo";
import { NotificationBell } from "./NotificationBell";
import { PillTabs } from "./PillTabs";
import { PropertySelector } from "./PropertySelector";
import { SearchBar, SearchButton } from "./SearchBar";
import { UserMenu } from "./UserMenu";

type TopBarProps = {
  properties: Property[];
  manager: Manager;
  notifications: Notification[];
};

/** Top bar: property switcher, the current section's tabs, search, alerts and profile. */
export function TopBar({ properties, manager, notifications }: TopBarProps) {
  const tabs = tabsFor(usePathname());

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="flex h-[76px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo shows here only when the sidebar is hidden (small screens) */}
        <Logo className="lg:hidden" showText={false} />

        <div className="min-w-0 flex-1 md:flex-none">
          <PropertySelector properties={properties} />
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <PillTabs tabs={tabs} />
        </div>

        <div className="flex items-center gap-2">
          <SearchBar />
          <SearchButton />
          <NotificationBell notifications={notifications} />
          <UserMenu manager={manager} />
        </div>
      </div>

      {/* On phones the tabs drop to their own row */}
      {tabs.length > 0 ? (
        <div className="px-4 pb-3 sm:px-6 md:hidden">
          <PillTabs tabs={tabs} className="w-full justify-between" />
        </div>
      ) : null}
    </header>
  );
}
