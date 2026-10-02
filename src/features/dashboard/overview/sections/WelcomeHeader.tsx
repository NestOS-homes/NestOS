"use client";

import { greetingFor } from "@/lib/format";

/** Today's date and a greeting for the manager. */
export function WelcomeHeader({ firstName }: { firstName: string }) {
  const now = new Date();
  const date = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(now);

  return (
    <section>
      <p className="text-xs font-medium tracking-[0.14em] text-subtle uppercase" suppressHydrationWarning>
        {date}
      </p>
      <h1 className="mt-2 text-[34px] leading-tight font-normal tracking-[-0.04em] sm:text-[42px]" suppressHydrationWarning>
        {greetingFor(now)}, <span className="text-muted-foreground">{firstName}</span> <span aria-hidden>👋</span>
      </h1>
    </section>
  );
}
