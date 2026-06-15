import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { isRateLimited } from "./lib/rate-limit";

const authMiddleware = withAuth(
  function middleware(req) {
    // If the user is authenticated and trying to access auth pages,
    // redirect them to dashboard
    if (req.nextUrl.pathname.startsWith("/auth/") && req.nextauth.token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Only require auth for dashboard routes
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export default async function middleware(req: any, event: any) {
  const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown";

  if (req.nextUrl.pathname.startsWith("/api")) {
    if (isRateLimited(ip)) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
    return NextResponse.next();
  }

  return authMiddleware(req, event);
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/api/:path*"],
};