import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/content/locales";

/**
 * Locale redirect (Next.js 16 `proxy` convention — the renamed `middleware`).
 * Unprefixed requests are sent to `/{locale}{path}`, choosing the locale from
 * the `NEXT_LOCALE` cookie (set by the nav toggle), then `Accept-Language`,
 * then the default.
 */
function getLocale(request: NextRequest): string {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && (locales as readonly string[]).includes(cookie)) return cookie;

  const accept = request.headers.get("accept-language");
  if (accept) {
    for (const part of accept.split(",")) {
      const base = part.split(";")[0].trim().toLowerCase().split("-")[0];
      const match = locales.find((l) => l === base);
      if (match) return match;
    }
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals, API routes, and any path with a file extension
  // (icon.png, opengraph-image.png, /video/*, etc.).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
