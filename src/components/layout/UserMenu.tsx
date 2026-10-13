"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOut, UserCog } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Manager } from "@/types";

/** Avatar in the top bar. Shows who is signed in, with account settings and log out. */
export function UserMenu({ manager }: { manager: Manager }) {
  const { signOut, openUserProfile } = useClerk();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Your account"
        className="rounded-full outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar className="size-11 after:hidden">
          {manager.imageUrl ? <AvatarImage src={manager.imageUrl} alt={manager.fullName} /> : null}
          <AvatarFallback className="bg-linear-to-br from-[#ffc535] to-brand text-[13px] font-extrabold text-[#1b1215]">
            {manager.initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="leading-tight">
          <span className="block text-sm text-foreground">{manager.fullName}</span>
          {manager.email ? <span className="block truncate text-xs font-normal text-muted-foreground">{manager.email}</span> : null}
          <span className="mt-1 inline-block rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] font-normal text-muted-foreground">
            {manager.role}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => openUserProfile()}>
          <UserCog /> Manage account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => signOut({ redirectUrl: "/sign-in" })}>
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
