import { ClerkLoading, SignUp } from "@clerk/nextjs";
import { AuthFormSkeleton } from "@/components/shared/AuthFormSkeleton";

/**
 * NestOS is invite-only. This page only works when opened from an invitation email;
 * Clerk blocks sign-ups without an invite (set as "Restricted" in the Clerk dashboard).
 */
export default function SignUpPage() {
  return (
    <div className="space-y-4">
      <ClerkLoading>
        <AuthFormSkeleton title="Create your account" />
      </ClerkLoading>
      <SignUp />
      <p className="text-center text-xs text-muted-foreground">
        NestOS is invite-only. Use the link in your invitation email to create your account.
      </p>
    </div>
  );
}
