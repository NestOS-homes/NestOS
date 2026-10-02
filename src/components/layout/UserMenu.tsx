"use client";

import { LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Manager } from "@/types";

export function UserMenu({ manager }: { manager: Manager }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Your account"
        className="grid size-11 place-items-center rounded-full bg-linear-to-br from-[#ffc535] to-brand text-[13px] font-extrabold text-[#1b1215] outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
      >
        {manager.initials}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="leading-tight">
          <span className="block text-sm text-foreground">{manager.fullName}</span>
          <span className="block text-xs font-normal text-muted-foreground">{manager.role}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
