"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Star, X } from "lucide-react";
import type { Property } from "../_types";
import { PropertyEnquiryForm } from "./property-enquiry-form";

type Props = {
  property: Property;
  initialEnquire?: boolean;
  onClose: () => void;
};

export function PropertyDetailsModal({
  property,
  initialEnquire = false,
  onClose,
}: Props) {
  const [slide, setSlide] = useState(0);
  const [showEnquiry, setShowEnquiry] = useState(initialEnquire);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="property-modal-title"
        className="my-auto max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-card"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-5 py-4">
          <div>
            <p className="text-xs text-muted-foreground">Property details</p>
            <h2 id="property-modal-title" className="mt-1 font-semibold">
              {property.name}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="relative overflow-hidden rounded-xl bg-tile">
            <img
              src={property.images[slide]}
              alt={`${property.name} photo ${slide + 1}`}
              className="h-56 w-full object-cover sm:h-80"
            />
            {property.images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() =>
                    setSlide((slide - 1 + property.images.length) % property.images.length)
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() => setSlide((slide + 1) % property.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold">{property.name}</h3>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} /> {property.location}
              </p>
            </div>
            <div className="rounded-xl bg-tile px-4 py-3">
              <div className="flex items-center gap-1.5 font-bold">
                <Star size={17} className="fill-warning text-warning" />
                {property.rating.toFixed(1)} / 5
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {property.reviewCount} reviews
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            {property.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {property.amenities.map((amenity) => (
              <span
                key={amenity}
                className="rounded-lg border border-border bg-tile px-3 py-2 text-xs text-muted-foreground"
              >
                {amenity}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xl font-bold">
              ₹{property.priceFrom.toLocaleString("en-IN")}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}/ month onwards
              </span>
            </p>
            <button
              type="button"
              onClick={() => setShowEnquiry((value) => !value)}
              className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Enquire now
            </button>
          </div>

          {showEnquiry && (
            <div className="mt-6 rounded-2xl border border-border bg-tile/50 p-4 sm:p-5">
              <h3 className="font-semibold">Enquire about this property</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Share your details and preferred room type.
              </p>
              <PropertyEnquiryForm property={property} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}