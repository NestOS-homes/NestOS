"use client";

import { Search, LocateFixed, X } from "lucide-react";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  onUseLocation: () => void;
  locating: boolean;
};

export function PropertySearch({
  search,
  onSearchChange,
  onUseLocation,
  locating,
}: Props) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <label className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl border border-border bg-card px-4 focus-within:border-brand">
        <Search size={20} className="text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search property name or location..."
          aria-label="Search properties"
          className="w-full bg-transparent text-sm outline-none"
        />
        {search && (
          <button type="button" onClick={() => onSearchChange("")}>
            <X size={18} />
          </button>
        )}
      </label>

      <button
        type="button"
        onClick={onUseLocation}
        disabled={locating}
        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 text-sm hover:bg-tile disabled:opacity-60"
      >
        <LocateFixed size={18} className="text-brand" />
        {locating ? "Finding location..." : "Use my location"}
      </button>
    </div>
  );
}