import createMiddleware from 'next-intl/middleware';
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ['en', 'pt'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

const authMiddleware = withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/auth/") && req.nextauth.token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export default function middleware(req) {
  const publicPatterns = ["/", "/auth(.*)"];
  const isPublicPage = publicPatterns.some((pattern) =>
    req.nextUrl.pathname.match(new RegExp(`^${pattern}$`))
  );

  if (isPublicPage) {
    return intlMiddleware(req);
  }

  return authMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};