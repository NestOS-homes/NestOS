import { ClerkLoading, SignIn } from "@clerk/nextjs";
import { AuthFormSkeleton } from "@/components/shared/AuthFormSkeleton";

export default function SignInPage() {
  return (
    <>
      <ClerkLoading>
        <AuthFormSkeleton title="Sign in to NestOS" />
      </ClerkLoading>
      <SignIn />
    </>
  );
}
