import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/*
 * Runs before every page loads (Next.js calls this file "proxy", it used to be "middleware").
 * Everything is locked except the sign-in and sign-up pages.
 * Anyone not signed in is sent to /sign-in.
 */

const isPublicRoute = createRouteMatcher(["/", "/properties(.*)", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
