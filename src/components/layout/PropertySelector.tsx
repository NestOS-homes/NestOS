"use client";

import { Building2, Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Property } from "@/types";

/** Switch between the properties this manager runs. */
export function PropertySelector({ properties }: { properties: Property[] }) {
  const [selectedId, setSelectedId] = useState(properties[0]?.id);
  const selected = properties.find((p) => p.id === selectedId) ?? properties[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-11 w-full min-w-0 items-center md:w-auto md:max-w-[260px] gap-2.5 rounded-full border border-border bg-[#16161b] py-1 pr-3 pl-1.5 text-left transition-colors outline-none hover:bg-[#1c1c22] focus-visible:ring-2 focus-visible:ring-ring">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-blue/15 text-brand-blue">
          <Building2 className="size-4" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-sm font-medium">{selected.name}</span>
          <span className="block truncate text-[11px] text-muted-foreground">
            {selected.area}, {selected.city}
          </span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Your properties</DropdownMenuLabel>
        {properties.map((p) => (
          <DropdownMenuItem key={p.id} onSelect={() => setSelectedId(p.id)} className="gap-3 py-2">
            <Building2 className="text-muted-foreground" />
            <span className="flex-1 leading-tight">
              <span className="block text-sm">{p.name}</span>
              <span className="block text-xs text-muted-foreground">{p.area}</span>
            </span>
            {p.id === selected.id ? <Check className="text-brand" /> : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>+ Add property (coming soon)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
