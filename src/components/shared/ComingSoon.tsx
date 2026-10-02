import { Sparkles } from "lucide-react";

/** Placeholder for tabs and pages that are not built yet. */
export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[20px] border border-dashed border-border bg-card/60 p-10 text-center">
      <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-brand/14 text-brand">
        <Sparkles className="size-5" />
      </div>
      <h2 className="text-xl font-medium tracking-tight">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      <span className="mt-5 rounded-full bg-white/6 px-3 py-1 text-xs text-muted-foreground">Coming soon</span>
    </div>
  );
}
