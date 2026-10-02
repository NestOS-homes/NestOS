import { cn } from "@/lib/utils";

/** Placeholder NestOS mark — swap the SVG when the real logo is ready. */
export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="grid size-9 place-items-center rounded-[11px] bg-linear-to-br from-[#ff5aa5] to-brand shadow-[0_6px_20px_-6px_rgba(236,58,141,0.7)]">
        <svg viewBox="0 0 20 20" className="size-[18px]" aria-hidden>
          <rect x="3" y="9" width="3.2" height="8" rx="1.2" fill="white" />
          <rect x="8.4" y="4" width="3.2" height="13" rx="1.2" fill="white" />
          <rect x="13.8" y="7" width="3.2" height="10" rx="1.2" fill="white" opacity="0.75" />
        </svg>
      </span>
      {showText ? <span className="text-xl font-semibold tracking-tight">NestOS</span> : null}
    </div>
  );
}
