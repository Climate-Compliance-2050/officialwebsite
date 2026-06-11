/**
 * Per-request licence enforcement (Next.js 16 Proxy — formerly middleware).
 *
 * Runs in the Node.js runtime, so `node:crypto` in `@/lib/licence` works here.
 * Two checks on every matched request:
 *   1. Licence Key is valid and unexpired.
 *   2. The request Host is one the licence authorises (domain lock).
 *
 * On failure in an enforced environment we return 403 instead of rendering, so
 * a copied build deployed to an unlicensed domain serves nothing useful.
 *
 * Local hosts (localhost / 127.0.0.1) are always allowed so development works
 * without a key, unless LICENCE_ENFORCE=true.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  verifyLicenceKey,
  hostnameFrom,
  domainAuthorised,
  isLocalHost,
} from "@/lib/licence";

function blocked(reason: string): NextResponse {
  const body = `403 — This deployment is not licensed.\n\n${reason}\n\n` +
    `This software is proprietary to Climate Compliance 2050 (C2050). ` +
    `See LICENCE.md.`;
  return new NextResponse(body, {
    status: 403,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "x-licence": "invalid",
      "cache-control": "no-store",
    },
  });
}

export function proxy(request: NextRequest): NextResponse {
  const isProd = process.env.NODE_ENV === "production";
  const enforce = isProd || process.env.LICENCE_ENFORCE === "true";

  const hostname = hostnameFrom(
    request.headers.get("host") ?? request.nextUrl.host
  );

  // Always let local development through unless explicitly forcing enforcement.
  if (!enforce && isLocalHost(hostname)) {
    return NextResponse.next();
  }

  const result = verifyLicenceKey(
    process.env.LICENCE_KEY,
    process.env.LICENCE_SECRET
  );

  if (!result.valid) {
    return enforce ? blocked(result.reason) : NextResponse.next();
  }

  if (!domainAuthorised(result.payload, hostname) && !isLocalHost(hostname)) {
    return enforce
      ? blocked(`host "${hostname}" is not authorised by this licence`)
      : NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Run on page routes; skip Next internals, the licence API, and static assets.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|robots.txt|sitemap.xml).*)",
  ],
};
