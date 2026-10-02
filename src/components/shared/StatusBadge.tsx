import { cn } from "@/lib/utils";
import { StatusDot, toneSoft, type Tone } from "./StatusDot";

type StatusBadgeProps = {
  tone: Tone;
  children: React.ReactNode;
  className?: string;
  withDot?: boolean;
};

/** Pill label for states like Paid, Due, Overdue, Urgent. */
export function StatusBadge({ tone, children, className, withDot = true }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap",
        toneSoft[tone],
        className
      )}
    >
      {withDot ? <StatusDot tone={tone} className="size-1.5" /> : null}
      {children}
    </span>
  );
}
