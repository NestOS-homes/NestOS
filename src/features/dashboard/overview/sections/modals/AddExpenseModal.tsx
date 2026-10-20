"use client";

import { useState, type FormEvent } from "react";
import { ReceiptText, X, Upload, CheckCircle2 } from "lucide-react";
import { properties } from "@/data/mock/property";

type AddExpenseModalProps = {
  open: boolean;
  onClose: () => void;
};

const EXPENSE_CATEGORIES = [
  "Utilities",
  "Maintenance & Repairs",
  "Staff Salary",
  "Housekeeping",
  "Supplies & Inventory",
  "Internet & Wi-Fi",
  "Rent / Lease",
  "Marketing",
  "Taxes & Compliance",
  "Other",
];

const PAYMENT_METHODS = [
  "Cash",
  "UPI",
  "Bank Transfer",
  "Debit / Credit Card",
  "Cheque",
  "Other",
];

const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand-blue/60";

const labelClass = "block text-sm font-medium text-foreground";

export function AddExpenseModal({
  open,
  onClose,
}: AddExpenseModalProps) {
  const [category, setCategory] = useState("Utilities");
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [amount, setAmount] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [receiptName, setReceiptName] = useState("");
  const [gstApplicable, setGstApplicable] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  function resetAndClose() {
    setCategory("Utilities");
    setPaymentStatus("Paid");
    setAmount("");
    setAmountPaid("");
    setExpenseDate(new Date().toLocaleDateString("en-CA"));
    setReceiptName("");
    setGstApplicable(false);
    setRecurring(false);
    setError("");
    setSuccess(false);
    onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(false);

    const total = Number(amount);
    const paid = Number(amountPaid || 0);

    if (!Number.isFinite(total) || total <= 0) {
      setError("Enter an expense amount greater than ₹0.");
      return;
    }

    if (!expenseDate) {
      setError("Select the date of the expense.");
      return;
    }

    if (!Number.isFinite(paid) || paid < 0 || paid > total) {
      setError("Amount paid must be between ₹0 and the total expense.");
      return;
    }

    if (paymentStatus === "Paid" && paid !== total) {
      setError("For a Paid expense, amount paid must equal the total amount.");
      return;
    }

    if (paymentStatus === "Unpaid" && paid !== 0) {
      setError("For an Unpaid expense, amount paid must be ₹0.");
      return;
    }

    if (
      paymentStatus === "Partially Paid" &&
      (paid <= 0 || paid >= total)
    ) {
      setError(
        "For a Partially Paid expense, amount paid must be greater than ₹0 and less than the total."
      );
      return;
    }

    const formData = new FormData(event.currentTarget);

    const expenseDraft = {
      propertyId: String(formData.get("propertyId") || ""),
      title: String(formData.get("title") || "").trim(),
      category,
      description: String(formData.get("description") || "").trim(),
      amount: total,
      expenseDate,
      paymentStatus,
      amountPaid: paid,
      paymentMethod: String(formData.get("paymentMethod") || ""),
      vendor: String(formData.get("vendor") || "").trim(),
      invoiceReference: String(
        formData.get("invoiceReference") || ""
      ).trim(),
      roomOrBed: String(formData.get("roomOrBed") || "").trim(),
      complaintReference: String(
        formData.get("complaintReference") || ""
      ).trim(),
      gstApplicable,
      gstAmount: gstApplicable
        ? Number(formData.get("gstAmount") || 0)
        : 0,
      recurring,
      notes: String(formData.get("notes") || "").trim(),
      receiptFileName: receiptName,
    };

    console.log("Expense draft ready for database integration:", expenseDraft);
    setSuccess(true);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) resetAndClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-expense-title"
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-card shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-blue/20 text-[#9aa8ff]">
              <ReceiptText className="size-5" />
            </span>
            <div>
              <h2 id="add-expense-title" className="text-lg font-semibold">
                Add Expense
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Record a property expense and its payment details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Close add expense"
            className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </header>

        {success ? (
          <div className="overflow-y-auto p-6">
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 className="size-12 text-emerald-400" />
              <h3 className="mt-4 text-lg font-semibold">
                Expense form validated
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Your expense draft passed validation. Database saving and
                receipt uploading are not connected yet.
              </p>
              <button
                type="button"
                onClick={resetAndClose}
                className="mt-6 rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-blue/90"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
              <section>
                <h3 className="mb-3 text-sm font-semibold">
                  1. Expense details
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelClass}>
                    Property *
                    <select
                      name="propertyId"
                      required
                      defaultValue={properties[0]?.id ?? ""}
                      className={inputClass}
                    >
                      {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.name} — {property.area}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={labelClass}>
                    Category *
                    <select
                      required
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className={inputClass}
                    >
                      {EXPENSE_CATEGORIES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={labelClass}>
                    Expense title *
                    <input
                      name="title"
                      required
                      maxLength={120}
                      placeholder="e.g. October electricity bill"
                      className={inputClass}
                    />
                  </label>

                  <label className={labelClass}>
                    Expense date *
                    <input
                      name="expenseDate"
                      type="date"
                      required
                      value={expenseDate}
                      onChange={(event) => setExpenseDate(event.target.value)}
                      className={inputClass}
                    />
                  </label>

                  <label className={labelClass}>
                    Total amount (₹) *
                    <input
                      name="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      value={amount}
                      onChange={(event) => {
                        setAmount(event.target.value);
                        if (paymentStatus === "Paid") {
                          setAmountPaid(event.target.value);
                        }
                      }}
                      placeholder="0.00"
                      className={inputClass}
                    />
                  </label>

                  <label className={labelClass}>
                    Vendor / paid to
                    <input
                      name="vendor"
                      maxLength={150}
                      placeholder="Vendor or recipient name"
                      className={inputClass}
                    />
                  </label>

                  <label className={`${labelClass} sm:col-span-2`}>
                    Description *
                    <textarea
                      name="description"
                      required
                      rows={2}
                      maxLength={1000}
                      placeholder="What was this expense for?"
                      className={inputClass}
                    />
                  </label>
                </div>
              </section>

              <section className="border-t border-white/[0.08] pt-5">
                <h3 className="mb-3 text-sm font-semibold">
                  2. Payment details
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelClass}>
                    Payment status *
                    <select
                      value={paymentStatus}
                      onChange={(event) => {
                        const nextStatus = event.target.value;
                        setPaymentStatus(nextStatus);

                        if (nextStatus === "Paid") {
                          setAmountPaid(amount);
                        } else if (nextStatus === "Unpaid") {
                          setAmountPaid("0");
                        } else if (
                          nextStatus === "Partially Paid" &&
                          (!amountPaid ||
                            Number(amountPaid) <= 0 ||
                            Number(amountPaid) >= Number(amount))
                        ) {
                          setAmountPaid("");
                        }
                      }}
                      className={inputClass}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Partially Paid">Partially Paid</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>
                  </label>

                  <label className={labelClass}>
                    Amount paid (₹) *
                    <input
                      name="amountPaid"
                      type="number"
                      min="0"
                      max={amount || undefined}
                      step="0.01"
                      required
                      value={amountPaid}
                      onChange={(event) => setAmountPaid(event.target.value)}
                      placeholder="0.00"
                      className={inputClass}
                    />
                  </label>

                  <label className={labelClass}>
                    Payment method
                    <select name="paymentMethod" className={inputClass}>
                      <option value="">Select method</option>
                      {PAYMENT_METHODS.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={labelClass}>
                    Invoice / transaction reference
                    <input
                      name="invoiceReference"
                      maxLength={150}
                      placeholder="Invoice number or UPI reference"
                      className={inputClass}
                    />
                  </label>

                  <label className={`${labelClass} sm:col-span-2`}>
                    Receipt / bill attachment
                    <span className="mt-1.5 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-3 py-3 text-sm text-muted-foreground transition-colors hover:border-brand-blue/50">
                      <Upload className="size-4 shrink-0" />
                      <span className="min-w-0 flex-1 truncate">
                        {receiptName || "Choose a receipt or bill (optional)"}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.webp"
                        className="sr-only"
                        onChange={(event) =>
                          setReceiptName(event.target.files?.[0]?.name ?? "")
                        }
                      />
                    </span>
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">
                      PDF or image. Uploading the file is not connected yet.
                    </span>
                  </label>
                </div>
              </section>

              <section className="border-t border-white/[0.08] pt-5">
                <h3 className="mb-3 text-sm font-semibold">
                  3. Property allocation & additional details
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelClass}>
                    Room / bed (optional)
                    <input
                      name="roomOrBed"
                      maxLength={100}
                      placeholder="e.g. Room 204, Bed B"
                      className={inputClass}
                    />
                  </label>

                  <label className={labelClass}>
                    Complaint reference (optional)
                    <input
                      name="complaintReference"
                      maxLength={100}
                      placeholder="Complaint or maintenance ID"
                      className={inputClass}
                    />
                  </label>

                  <div className="space-y-3 sm:col-span-2">
                    <label className="flex items-start gap-2.5 text-sm">
                      <input
                        type="checkbox"
                        checked={gstApplicable}
                        onChange={(event) =>
                          setGstApplicable(event.target.checked)
                        }
                        className="mt-0.5 size-4 accent-[#7185ff]"
                      />
                      <span>
                        <span className="font-medium">GST applicable</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          Record GST separately if this bill includes it.
                        </span>
                      </span>
                    </label>

                    {gstApplicable ? (
                      <label className={labelClass}>
                        GST amount (₹)
                        <input
                          name="gstAmount"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue="0"
                          className={inputClass}
                        />
                      </label>
                    ) : null}

                    <label className="flex items-start gap-2.5 text-sm">
                      <input
                        type="checkbox"
                        checked={recurring}
                        onChange={(event) =>
                          setRecurring(event.target.checked)
                        }
                        className="mt-0.5 size-4 accent-[#7185ff]"
                      />
                      <span>
                        <span className="font-medium">Recurring expense</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          Mark bills that repeat, such as monthly internet or
                          rent. Automatic recurring entries are not enabled.
                        </span>
                      </span>
                    </label>
                  </div>

                  <label className={`${labelClass} sm:col-span-2`}>
                    Notes (optional)
                    <textarea
                      name="notes"
                      rows={2}
                      maxLength={2000}
                      placeholder="Additional details, approval notes, or payment context"
                      className={inputClass}
                    />
                  </label>
                </div>
              </section>

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-300"
                >
                  {error}
                </p>
              ) : null}
            </div>

            <footer className="flex flex-col-reverse gap-2 border-t border-white/[0.08] bg-card px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={resetAndClose}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/[0.06]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-blue/90"
              >
                Submit Expense
              </button>
            </footer>
          </form>
        )}
      </section>
    </div>
  );
}