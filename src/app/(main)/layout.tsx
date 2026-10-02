import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { getShellData } from "@/services/shell";

/** Frame shared by every page inside the app: sidebar on the left, top bar above the page. */
export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const { properties, manager, notifications } = await getShellData();

  return (
    <div className="relative min-h-screen">
      {/* Soft background glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[420px] w-[620px] rounded-full bg-brand/[0.07] blur-[120px]" />
        <div className="absolute -top-32 right-0 h-[380px] w-[520px] rounded-full bg-brand-blue/[0.08] blur-[120px]" />
      </div>

      <Sidebar />

      <div className="relative lg:pl-[248px]">
        <TopBar properties={properties} manager={manager} notifications={notifications} />
        <main className="mx-auto max-w-[1440px] px-4 pt-6 pb-28 sm:px-6 lg:px-8 lg:pb-12">{children}</main>
      </div>

      <MobileNav />
    </div>
  );
}
