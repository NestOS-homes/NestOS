import { Search } from "lucide-react";

/** Search box. Not connected yet — it will search residents, rooms and payments later. */
export function SearchBar() {
  return (
    <label className="relative hidden xl:block">
      <span className="sr-only">Search</span>
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        placeholder="Search residents, rooms…"
        className="h-11 w-[240px] rounded-full border border-border bg-[#16161b] pr-4 pl-10 text-sm placeholder:text-subtle outline-none transition-colors focus:border-ring/60 focus:bg-[#1c1c22]"
      />
    </label>
  );
}

/** Round icon-only search button for smaller screens. */
export function SearchButton() {
  return (
    <button
      type="button"
      aria-label="Search"
      className="hidden size-11 place-items-center rounded-full border border-border bg-[#16161b] text-muted-foreground transition-colors hover:text-foreground sm:grid xl:hidden"
    >
      <Search className="size-[18px]" />
    </button>
  );
}
