import { cn } from "@/lib/utils";

export type Tone = "success" | "warning" | "danger" | "info" | "brand" | "neutral";

export const toneText: Record<Tone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
  brand: "text-brand",
  neutral: "text-muted-foreground",
};

export const toneBg: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  brand: "bg-brand",
  neutral: "bg-subtle",
};

/** Soft tinted background + coloured text, used for icon circles and badges. */
export const toneSoft: Record<Tone, string> = {
  success: "bg-success/12 text-success",
  warning: "bg-warning/12 text-warning",
  danger: "bg-danger/12 text-danger",
  info: "bg-info/14 text-info",
  brand: "bg-brand/14 text-brand",
  neutral: "bg-white/6 text-muted-foreground",
};

/** A small coloured dot. Always shown next to a text label, never alone. */
export function StatusDot({ tone, className }: { tone: Tone; className?: string }) {
  return <span aria-hidden className={cn("inline-block size-2 shrink-0 rounded-full", toneBg[tone], className)} />;
}
