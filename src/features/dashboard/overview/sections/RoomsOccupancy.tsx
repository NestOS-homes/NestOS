import { ArrowRight } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { BedStatus, OccupancySummary, Room } from "@/types";

const BED_STYLE: Record<BedStatus, string> = {
  occupied: "bg-success",
  available: "bg-info",
  vacating: "stripes-warning",
};

const BED_LABEL: Record<BedStatus, string> = {
  occupied: "Occupied",
  available: "Available",
  vacating: "Vacating soon",
};

type RoomsOccupancyProps = {
  summary: OccupancySummary;
  rooms: Room[];
};

/** How full the property is, plus a floor-by-floor map of every bed. */
export function RoomsOccupancy({ summary, rooms }: RoomsOccupancyProps) {
  const floors = [...new Set(rooms.map((r) => r.floor))].sort((a, b) => b - a);

  return (
    <SectionCard
      title="Rooms & occupancy"
      description={`${rooms.length} rooms · ${floors.length} floors`}
      action={<ViewButton label="View rooms" />}
    >
      <div className="grid gap-5 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-center">
        <Bubbles summary={summary} />

        <dl className="grid grid-cols-2 gap-2.5">
          <Stat label="Total beds" value={summary.totalBeds} />
          <Stat label="Occupied" value={summary.occupied} swatch={BED_STYLE.occupied} />
          <Stat label="Available" value={summary.available} swatch={BED_STYLE.available} />
          <Stat label="Vacating soon" value={summary.vacating} swatch={BED_STYLE.vacating} />
        </dl>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium">Floor map</h3>
          <p className="text-xs text-muted-foreground">Hover a room to see its beds</p>
        </div>

        <div className="no-scrollbar overflow-x-auto">
          <div className="min-w-[520px] space-y-2">
            {floors.map((floor) => (
              <div key={floor} className="flex items-center gap-2">
                <span className="w-14 shrink-0 text-xs text-muted-foreground">Floor {floor}</span>
                <div className="grid flex-1 grid-cols-10 gap-1.5">
                  {rooms
                    .filter((r) => r.floor === floor)
                    .map((room) => (
                      <RoomTile key={room.number} room={room} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function RoomTile({ room }: { room: Room }) {
  const hasFree = room.beds.some((b) => b.status === "available");
  const hasLeaving = room.beds.some((b) => b.status === "vacating");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`Room ${room.number}`}
          className={cn(
            "surface-tile flex flex-col items-center gap-1.5 rounded-lg px-1 py-1.5 transition-transform outline-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring",
            hasFree && "border-info/50",
            !hasFree && hasLeaving && "border-warning/50"
          )}
        >
          <span className="text-[11px] leading-none text-muted-foreground">{room.number}</span>
          <span className="flex gap-[3px]">
            {room.beds.map((bed) => (
              <span key={bed.id} className={cn("h-2.5 w-2 rounded-[3px]", BED_STYLE[bed.status])} />
            ))}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent className="block px-3 py-2">
        <p className="mb-1 font-medium">
          Room {room.number} · {room.sharing}-sharing
        </p>
        <ul className="space-y-0.5">
          {room.beds.map((bed) => (
            <li key={bed.id} className="flex items-center gap-2">
              <span className={cn("h-2.5 w-2 rounded-[3px]", BED_STYLE[bed.status])} />
              <span>
                Bed {bed.label}: {BED_LABEL[bed.status]}
                {bed.residentName ? ` · ${bed.residentName}` : ""}
              </span>
            </li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  );
}

/** Three overlapping circles sized by share of beds (from the Figma design). */
function Bubbles({ summary }: { summary: OccupancySummary }) {
  return (
    <div className="relative mx-auto h-[190px] w-[220px]" aria-hidden>
      <div className="absolute top-3 left-0 grid size-[150px] place-items-center rounded-full bg-success text-[#0d1511] shadow-[0_10px_40px_-10px_rgba(68,231,167,0.6)]">
        <div className="text-center leading-tight">
          <p className="text-[34px] font-medium tracking-[-0.04em]">{summary.occupancyRate}%</p>
          <p className="text-xs font-medium">Occupied</p>
        </div>
      </div>
      <div className="absolute top-0 right-3 grid size-[74px] place-items-center rounded-full stripes-warning ring-4 ring-card">
        <div className="grid size-[54px] place-items-center rounded-full bg-card text-center leading-none">
          <div>
            <p className="text-lg font-medium">{summary.vacating}</p>
            <p className="mt-0.5 text-[9px] text-muted-foreground">Vacating</p>
          </div>
        </div>
      </div>
      <div className="absolute right-0 bottom-0 grid size-[86px] place-items-center rounded-full bg-info text-white ring-4 ring-card">
        <div className="text-center leading-none">
          <p className="text-2xl font-medium">{summary.available}</p>
          <p className="mt-1 text-[10px]">Available</p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, swatch }: { label: string; value: number; swatch?: string }) {
  return (
    <div className="surface-tile rounded-xl px-3.5 py-3">
      <dt className="flex items-center gap-2 text-xs text-muted-foreground">
        {swatch ? <span aria-hidden className={cn("h-2.5 w-2 rounded-[3px]", swatch)} /> : null}
        {label}
      </dt>
      <dd className="mt-1 text-2xl leading-none font-medium tracking-tight">{value}</dd>
    </div>
  );
}

export function ViewButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="group flex h-9 items-center gap-1.5 rounded-full border border-border bg-[#16161b] px-3.5 text-xs font-medium text-foreground transition-colors hover:bg-[#22222a]"
    >
      {label}
      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}
