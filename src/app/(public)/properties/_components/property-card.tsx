import { MapPin, Star } from "lucide-react";
import type { Property } from "../_types";

type Props = {
  property: Property;
  distance: number;
  onOpen: (property: Property) => void;
  onEnquire: (property: Property) => void;
};

export function PropertyCard({
  property,
  distance,
  onOpen,
  onEnquire,
}: Props) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(property)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen(property);
      }}
      className="group overflow-hidden rounded-2xl border border-border bg-card text-left transition hover:-translate-y-1 hover:border-brand/50"
    >
      <div className="relative h-48 overflow-hidden bg-tile">
        <img
          src={property.images[0]}
          alt={property.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white">
          {distance.toFixed(1)} km away
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{property.name}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={14} />
              {property.location}
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-lg bg-tile px-2 py-1 text-sm">
            <Star size={14} className="fill-warning text-warning" />
            {property.rating.toFixed(1)}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Starting from</p>
            <p className="mt-1 font-semibold">
              ₹{property.priceFrom.toLocaleString("en-IN")}
              <span className="text-xs font-normal text-muted-foreground">
                {" "}/ month
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEnquire(property);
            }}
            className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Enquire
          </button>
        </div>
      </div>
    </article>
  );
}