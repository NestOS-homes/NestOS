import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { clerkAppearance } from "@/lib/clerk-appearance";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: "NestOS",
  description: "Run your PG and co-living business from one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={clerkAppearance}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      afterSignOutUrl="/sign-in"
    >
      <html lang="en" className={`dark ${dmSans.variable}`}>
        <body>
          <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
