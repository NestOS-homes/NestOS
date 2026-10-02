import { cn } from "@/lib/utils";

/** Small solid pill above a KPI, like "+12%" (green) or "₹28K" (red). */
export function TrendBadge({ tone, children }: { tone: "success" | "danger"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full px-2 text-[11px] font-bold text-[#0d1511]",
        tone === "success" ? "bg-success" : "bg-danger"
      )}
    >
      {children}
    </span>
  );
}
