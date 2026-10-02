"use client";

import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusDot } from "@/components/shared/StatusDot";
import type { Notification } from "@/types";

export function NotificationBell({ notifications }: { notifications: Notification[] }) {
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Notifications, ${unread} unread`}
        className="relative grid size-11 place-items-center rounded-full border border-border bg-[#16161b] text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="size-[18px]" />
        {unread > 0 ? (
          <span className="absolute top-2 right-2.5 size-2 rounded-full bg-brand ring-2 ring-[#16161b]" aria-hidden />
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          <span className="text-xs font-normal text-muted-foreground">{unread} new</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((n) => (
          <DropdownMenuItem key={n.id} className="items-start gap-3 py-2.5">
            <StatusDot tone={n.tone} className="mt-1.5" />
            <span className="flex-1 leading-snug">
              <span className={n.unread ? "block text-sm text-foreground" : "block text-sm text-muted-foreground"}>
                {n.title}
              </span>
              <span className="block text-xs text-subtle">{n.time}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
