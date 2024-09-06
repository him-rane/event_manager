import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define the public and ignored routes
const isIgnoredRoute = createRouteMatcher([
  "/api/webhook/clerk",
  "/api/webhook/stripe",
  "/api/uploadthing",
]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/events/:id",
  "/api/webhook/clerk",
  "/api/webhook/stripe",
  "/api/uploadthing",
]);

export default clerkMiddleware((auth, request) => {
  // If the route matches the ignored paths, bypass the middleware
  if (isIgnoredRoute(request)) {
    return NextResponse.next();
  }

  // If the route matches the public paths, allow access without authentication
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // For all other routes, protect them with authentication
  return auth().protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files (e.g., images, fonts, etc.)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes and trpc (if you're using trpc)
    "/(api|trpc)(.*)",
  ],
};
