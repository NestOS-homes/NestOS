import { BedDouble, BellRing, IndianRupee } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

const POINTS = [
  { icon: BedDouble, text: "See every room and bed at a glance" },
  { icon: IndianRupee, text: "Track rent, dues and expenses in one place" },
  { icon: BellRing, text: "Know what needs your attention today" },
];

/** Frame for the sign-in and sign-up pages: brand panel on the left, form on the right. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* Background glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-[10%] h-[460px] w-[640px] rounded-full bg-brand/[0.10] blur-[140px]" />
        <div className="absolute right-0 bottom-0 h-[420px] w-[560px] rounded-full bg-brand-blue/[0.10] blur-[140px]" />
      </div>

      {/* Brand panel (desktop) */}
      <aside className="relative hidden flex-col justify-between border-r border-border bg-shell/70 p-12 lg:flex">
        <Logo />
        <div className="max-w-md">
          <h1 className="text-[44px] leading-[1.05] font-normal tracking-[-0.04em]">
            Run your PG <span className="text-muted-foreground">from one place.</span>
          </h1>
          <ul className="mt-8 space-y-4">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-[15px] text-muted-foreground">
                <span className="grid size-9 place-items-center rounded-xl bg-brand/14 text-brand">
                  <Icon className="size-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-subtle">© NestOS · For PG, Luxury PG and Co-living operators</p>
      </aside>

      {/* Form */}
      <main className="relative flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <Logo className="mb-8 lg:hidden" />
        <div className="w-full max-w-[420px]">{children}</div>
      </main>
    </div>
  );
}
