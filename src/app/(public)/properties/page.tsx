"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, MapPin } from "lucide-react";
import { properties } from "./_data/properties";
import { distanceBetween } from "./_lib/distance";
import type { Property } from "./_types";
import { PropertySearch } from "./_components/property-search";
import { PropertyGrid } from "./_components/property-grid";
import { PropertyDetailsModal } from "./_components/property-details-modal";

export default function PropertiesPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Property | null>(null);
  const [initialEnquire, setInitialEnquire] = useState(false);
  const [locating, setLocating] = useState(false);
  const [message, setMessage] = useState("");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const listings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return properties
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query)
      )
      .map((property) => ({
        property,
        distance: userLocation
          ? distanceBetween(userLocation, {
              latitude: property.latitude,
              longitude: property.longitude,
            })
          : property.distanceKm,
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [search, userLocation]);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setMessage("Geolocation is not supported by this browser.");
      return;
    }

    setLocating(true);
    setMessage("");

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setMessage("Sorted by distance from your location.");
        setLocating(false);
      },
      () => {
        setMessage("Location unavailable. Showing demo distance order.");
        setLocating(false);
      },
      { timeout: 10000 }
    );
  }

  function openProperty(property: Property, enquire = false) {
    setSelected(property);
    setInitialEnquire(enquire);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/properties" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-lg font-black text-white">
              N
            </span>
            <span>
              <span className="block text-lg font-bold">NestOS</span>
              <span className="block text-xs text-muted-foreground">
                Find your next home
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/sign-in" className="rounded-xl px-3 py-2 text-sm hover:bg-tile">
              Sign in
            </Link>
            <Link href="/sign-up" className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white">
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-12 pt-10 sm:px-8 sm:pt-14">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-tile-border bg-tile px-3 py-1.5 text-xs text-muted-foreground">
            <MapPin size={14} className="text-brand" />
            Find a place that feels like home
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Find your next home, <span className="text-brand">the NestOS way.</span>
          </h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
            Explore PGs and co-living spaces, compare ratings, and enquire about a room.
          </p>
        </div>

        <PropertySearch
          search={search}
          onSearchChange={setSearch}
          onUseLocation={useMyLocation}
          locating={locating}
        />

        {message && (
          <p role="status" className="mt-3 text-sm text-muted-foreground">
            {message}
          </p>
        )}

        <div className="mt-9 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Available properties</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {listings.length} {listings.length === 1 ? "property" : "properties"} found
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-lg bg-tile px-3 py-2 text-xs text-muted-foreground">
            <ArrowUpDown size={14} /> Nearest first
          </span>
        </div>

        <PropertyGrid
          listings={listings}
          onOpen={(property) => openProperty(property)}
          onEnquire={(property) => openProperty(property, true)}
        />

        <p className="mt-8 text-xs text-muted-foreground">
          Demo property listings. Distances, prices, and ratings need verified data.
        </p>
      </section>

      {selected && (
        <PropertyDetailsModal
          key={selected.id}
          property={selected}
          initialEnquire={initialEnquire}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}