import { cn } from "@/lib/utils";

type SectionCardProps = {
  title: string;
  description?: React.ReactNode;
  /** Buttons or filters shown at the top-right of the card. */
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
};

/** The standard dark card every dashboard section sits in. */
export function SectionCard({ title, description, action, className, bodyClassName, children }: SectionCardProps) {
  return (
    <section
      className={cn(
        "flex h-full flex-col rounded-[20px] border border-border bg-card p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]",
        className
      )}
    >
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[17px] font-medium tracking-tight text-foreground">{title}</h2>
          {description ? <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p> : null}
        </div>
        {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
      </header>
      <div className={cn("flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}
