import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
    "/ride-dashboard(.*)",
    "/driver-portal(.*)",
    "/profile(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth();

    // Redirect if not signed in and trying to access protected routes
    if (isProtectedRoute(req)) {
        await auth.protect();
    }

    // Role-based redirection logic
    if (userId) {
        const role = (sessionClaims?.metadata as { role?: string })?.role;
        const url = req.nextUrl.clone();

        // Prevent Role Mistmatching
        if (role === "DRIVER" && !url.pathname.startsWith("/driver-portal")) {
            url.pathname = "/driver-portal";
            return NextResponse.redirect(url);
        }

        if (role === "PASSENGER" && !url.pathname.startsWith("/ride-dashboard") && !url.pathname.startsWith("/profile")) {
            url.pathname = "/ride-dashboard";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
