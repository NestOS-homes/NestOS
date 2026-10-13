import { currentUser } from "@clerk/nextjs/server";
import { manager as sampleManager } from "@/data/mock/property";
import type { Manager } from "@/types";

/*
 * Who is signed in right now, in the shape NestOS uses.
 * The details come from Clerk. If a detail is missing (e.g. no name yet), we fall back sensibly.
 */
export async function getCurrentManager(): Promise<Manager> {
  const user = await currentUser();
  if (!user) return sampleManager; // only happens if the page is opened without sign-in, which proxy.ts blocks

  const email = user.primaryEmailAddress?.emailAddress;
  const phone = user.primaryPhoneNumber?.phoneNumber;
  const firstName = user.firstName ?? email?.split("@")[0] ?? "there";
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || email || phone || "NestOS user";
  const initials =
    ((user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")).toUpperCase() || fullName.slice(0, 2).toUpperCase();

  // Role can be set per user in the Clerk dashboard under "Public metadata", e.g. { "role": "Owner" }
  const role = typeof user.publicMetadata?.role === "string" ? user.publicMetadata.role : "Property Manager";

  return {
    firstName,
    fullName,
    initials,
    role,
    email: email ?? phone ?? undefined,
    imageUrl: user.hasImage ? user.imageUrl : undefined,
  };
}
