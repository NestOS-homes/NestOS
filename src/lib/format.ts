/**
 * Small helpers to show numbers the Indian way.
 */

const fullFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** ₹1,24,500 */
export function formatINR(amount: number): string {
  return fullFormatter.format(amount);
}

/** Short form for big numbers: ₹9.2L, ₹52K, ₹1.2Cr */
export function formatINRCompact(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 1_00_00_000) return `${sign}₹${trim(abs / 1_00_00_000)}Cr`;
  if (abs >= 1_00_000) return `${sign}₹${trim(abs / 1_00_000)}L`;
  if (abs >= 1_000) return `${sign}₹${trim(abs / 1_000)}K`;
  return `${sign}₹${Math.round(abs)}`;
}

function trim(value: number): string {
  // 9.24 → "9.2", 52.0 → "52"
  const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/** 130 minutes → "2h 10m", 26 hours → "1d 2h" */
export function formatDuration(hours: number): string {
  const totalMinutes = Math.round(hours * 60);
  const days = Math.floor(totalMinutes / (60 * 24));
  const h = Math.floor((totalMinutes % (60 * 24)) / 60);
  const m = totalMinutes % 60;
  if (days > 0) return h > 0 ? `${days}d ${h}h` : `${days}d`;
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`;
  return `${m}m`;
}

/** +12% / -3% */
export function formatChange(value: number): string {
  return `${value > 0 ? "+" : ""}${value}%`;
}

/** "Good morning" / "Good afternoon" / "Good evening" */
export function greetingFor(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
