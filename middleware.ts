import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isRateLimited } from "./lib/rate-limit";

export default async function middleware(req: any) {
  const { pathname } = req.nextUrl;

  // 1. Absolute bypass for NextAuth internal routes to prevent redirect loops
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // 2. Rate limiting for all APIs
  if (pathname.startsWith("/api")) {
    const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }
  }

  // 3. Authentication logic using getToken
  const token = await getToken({ req });

  // Protected Dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  // Protected API routes
  if (pathname.startsWith("/api")) {
    const publicRoutes = ["/api/contact", "/api/stripe/webhook", "/api/check-slug", "/api/testimonials"];
    const isPublic = publicRoutes.some(route => pathname.startsWith(route));

    if (!isPublic && !token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith("/auth/") && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/api/:path*"],
};
