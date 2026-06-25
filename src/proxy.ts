import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/content/locales";

/**
 * Locale proxy (Next.js 16 `proxy` convention — the renamed `middleware`).
 * Rewrites unprefixed URLs to `/{locale}{path}` internally — the browser URL
 * stays clean (no /en/ prefix). Locale chosen from NEXT_LOCALE cookie →
 * Accept-Language → defaultLocale.
 *
 * Direct /en/ or /pt/ requests still work (e.g. locale toggle links).
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
  return NextResponse.rewrite(request.nextUrl);
}

export const config = {
  // Skip Next internals, API routes, and any path with a file extension
  // (icon.png, opengraph-image.png, /video/*, etc.).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
