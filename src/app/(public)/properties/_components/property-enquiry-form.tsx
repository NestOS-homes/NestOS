"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { Property } from "../_types";

type Props = {
  property: Property;
};

export function PropertyEnquiryForm({ property }: Props) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // TODO: Send the enquiry to a NestOS server-side API.
    // Do not treat this demo confirmation as a saved enquiry.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="py-5 text-center">
        <CheckCircle2 size={36} className="mx-auto text-success" />
        <h3 className="mt-3 font-semibold">Form completed</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This is a demo. Your enquiry for {property.name} has not been saved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2 text-sm">
        Full name
        <input
          required
          minLength={2}
          autoComplete="name"
          placeholder="Enter your name"
          className="min-h-11 rounded-xl border border-border bg-card px-3 outline-none focus:border-brand"
        />
      </label>

      <label className="grid gap-2 text-sm">
        Phone number
        <input
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          pattern="[0-9+() -]{10,18}"
          title="Enter a valid phone number"
          placeholder="Enter phone number"
          className="min-h-11 rounded-xl border border-border bg-card px-3 outline-none focus:border-brand"
        />
      </label>

      <label className="grid gap-2 text-sm sm:col-span-2">
        Occupancy type
        <select
          defaultValue="single"
          className="min-h-11 rounded-xl border border-border bg-card px-3 outline-none focus:border-brand"
        >
          <option value="single">Single occupancy</option>
          <option value="double">Double occupancy</option>
          <option value="triple">Triple occupancy</option>
          <option value="colive">Co-living</option>
        </select>
      </label>

      <button
        type="submit"
        className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white hover:opacity-90 sm:col-span-2"
      >
        Submit enquiry
      </button>
    </form>
  );
}