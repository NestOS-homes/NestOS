/** Shown for a moment while Clerk's sign-in form loads. */
export function AuthFormSkeleton({ title }: { title: string }) {
  return (
    <div className="rounded-[20px] border border-border bg-card p-8" aria-busy="true" aria-label={`Loading ${title}`}>
      <p className="text-lg font-medium">{title}</p>
      <div className="mt-6 space-y-3">
        <div className="h-10 animate-pulse rounded-xl bg-white/[0.06]" />
        <div className="h-px bg-border" />
        <div className="h-4 w-24 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-10 animate-pulse rounded-xl bg-white/[0.06]" />
        <div className="h-10 animate-pulse rounded-xl bg-brand/30" />
      </div>
    </div>
  );
}
