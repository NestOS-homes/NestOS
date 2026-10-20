
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Upload,
} from "lucide-react";

import type { StaffRole } from "@/types";

const roles: StaffRole[] = [
  "Property Manager",
  "Housekeeping",
  "Maintenance",
  "Security",
  "Front Desk",
  "Cook",
  "Other",
];

export function AddStaffPage() {
  const [fullName, setFullName] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<StaffRole | "">("");
  const [salary, setSalary] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handlePhotoChange(file: File | undefined) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be 5 MB or smaller.");
      return;
    }

    setError("");
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const digits = phone.replace(/\D/g, "");
    const salaryAmount = Number(salary);

    if (!role) {
      setError("Please select a staff role.");
      return;
    }

    if (!/^\d{12}$/.test(aadhaarNumber)) {
      setError("Enter a valid 12-digit Aadhaar number.");
      return;
    }

    if (digits.length < 10 || digits.length > 13) {
      setError("Enter a valid phone number.");
      return;
    }

    if (!Number.isFinite(salaryAmount) || salaryAmount <= 0) {
      setError("Enter a valid monthly salary.");
      return;
    }

    // Mock-only: do not send or persist sensitive information here.
    // Connect this submission to an authorized backend endpoint later.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-2xl border border-success/20 bg-success/5 p-6 text-center sm:p-10">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="size-7" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold">
            Submission ready for review
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            This is a mock confirmation. No staff record has been saved or
            sent to the central NestOS administrator yet.
          </p>
          <div className="mt-6 rounded-xl border border-border bg-card p-4 text-left">
            <p className="font-medium">{fullName}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {role} · ₹{Number(salary).toLocaleString("en-IN")} / month
            </p>
            <p className="mt-3 text-xs text-warning">
              Status: Pending approval (simulated)
            </p>
          </div>
          <Link
            href="/dashboard/staff"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-brand px-4 text-sm font-medium text-white hover:opacity-90"
          >
            Back to Staff Management
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/dashboard/staff"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Staff Management
      </Link>

      <header>
        <p className="text-xs text-muted-foreground">
          Property management / Staff / Add staff
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Add New Staff
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the staff member's details and submit for central approval.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="space-y-5 rounded-2xl border border-border bg-card p-4 sm:p-6">
          <div>
            <h2 className="font-semibold">Personal information</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Contact details and staff photo.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Staff photo preview"
                  className="size-full object-cover"
                />
              ) : (
                <Camera className="size-8 text-muted-foreground" />
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="staff-photo"
                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium transition hover:bg-muted"
              >
                <Upload className="size-4" />
                Upload photo
              </label>
              <input
                id="staff-photo"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handlePhotoChange(event.target.files?.[0])
                }
                className="sr-only"
              />
              <p className="text-xs text-muted-foreground">
                JPG, PNG or another image format. Maximum 5 MB.
              </p>
              {photo && (
                <p className="max-w-xs truncate text-xs text-muted-foreground">
                  Selected: {photo.name}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="full-name" className="text-sm font-medium">
                Full name *
              </label>
              <input
                id="full-name"
                required
                maxLength={120}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter full name"
                autoComplete="name"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="staff-phone" className="text-sm font-medium">
                Phone number *
              </label>
              <input
                id="staff-phone"
                type="tel"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+91 98765 43210"
                autoComplete="tel"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="aadhaar" className="text-sm font-medium">
                Aadhaar number *
              </label>
              <input
                id="aadhaar"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                required
                maxLength={12}
                minLength={12}
                value={aadhaarNumber}
                onChange={(event) =>
                  setAadhaarNumber(
                    event.target.value.replace(/\D/g, "").slice(0, 12)
                  )
                }
                placeholder="12-digit Aadhaar number"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <p className="text-xs text-muted-foreground">
                Hidden while typing. Use placeholder data only until secure
                backend storage and appropriate consent are implemented.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-border bg-card p-4 sm:p-6">
          <div>
            <h2 className="font-semibold">Employment details</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Assign a role and proposed monthly salary.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="staff-role" className="text-sm font-medium">
                Staff role *
              </label>
              <select
                id="staff-role"
                required
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as StaffRole | "")
                }
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="" disabled>
                  Select role
                </option>
                {roles.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="salary" className="text-sm font-medium">
                Monthly salary (₹) *
              </label>
              <input
                id="salary"
                type="number"
                required
                min="1"
                max="10000000"
                step="1"
                value={salary}
                onChange={(event) => setSalary(event.target.value)}
                placeholder="Enter monthly salary"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-warning/20 bg-warning/5 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-warning" />
            <div>
              <h2 className="font-semibold">Central administrator approval</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                This staff submission requires review by an authorized central
                NestOS administrator before the staff record becomes active.
              </p>
            </div>
          </div>
        </section>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-danger/20 bg-danger/5 p-3 text-sm text-danger"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/dashboard/staff"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-brand px-5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Submit for Approval
          </button>
        </div>
      </form>
    </div>
  );
}
