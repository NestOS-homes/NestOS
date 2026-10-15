import { Search } from "lucide-react";
import type { Property } from "../_types";
import { PropertyCard } from "./property-card";

type Listing = {
  property: Property;
  distance: number;
};

type Props = {
  listings: Listing[];
  onOpen: (property: Property) => void;
  onEnquire: (property: Property) => void;
};

export function PropertyGrid({ listings, onOpen, onEnquire }: Props) {
  if (listings.length === 0) {
    return (
      <div className="mt-5 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
        <Search size={28} className="mx-auto text-muted-foreground" />
        <h3 className="mt-4 font-semibold">No properties found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try another property name or location.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map(({ property, distance }) => (
        <PropertyCard
          key={property.id}
          property={property}
          distance={distance}
          onOpen={onOpen}
          onEnquire={onEnquire}
        />
      ))}
    </div>
  );
}