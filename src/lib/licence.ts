/**
 * C2050 licence-key verification.
 *
 * Proprietary — see LICENCE.md. Tampering with this module to bypass licence
 * enforcement is a breach of licence and may violate anti-circumvention law.
 *
 * A Licence Key is a signed, self-describing token:
 *
 *     <base64url(payload-json)>.<base64url(hmac-sha256)>
 *
 * The HMAC is computed over the payload bytes using the secret in
 * `LICENCE_SECRET`. The payload declares the holder, the domains the deployment
 * is locked to, and an expiry. Verification is offline (no network), constant
 * cost, and has no Next.js dependency so it runs in `instrumentation` (boot)
 * and `proxy` (per request) alike.
 *
 * Keys are minted with `scripts/license-gen.mjs`.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export interface LicencePayload {
  /** Human-readable licensee, e.g. "C2050 Production". */
  holder: string;
  /** Hostnames this key authorises. "*" allows any host (use sparingly). */
  domains: string[];
  /** Unix seconds when the key was issued. */
  issued: number;
  /** Unix seconds when the key expires. */
  expires: number;
}

export type LicenceResult =
  | { valid: true; payload: LicencePayload }
  | { valid: false; reason: string; payload?: LicencePayload };

function base64urlDecode(input: string): Buffer {
  return Buffer.from(input, "base64url");
}

function base64urlEncode(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

/** Compute the signature for a payload segment. Shared with the generator. */
export function signPayload(payloadSegment: string, secret: string): string {
  return base64urlEncode(
    createHmac("sha256", secret).update(payloadSegment).digest()
  );
}

/**
 * Verify a Licence Key against a secret. Pure, offline, throws nothing.
 *
 * @param key    The licence key string (from `process.env.LICENCE_KEY`).
 * @param secret The signing secret (from `process.env.LICENCE_SECRET`).
 * @param now    Current time in unix seconds (injectable for tests).
 */
export function verifyLicenceKey(
  key: string | undefined,
  secret: string | undefined,
  now: number = Math.floor(Date.now() / 1000)
): LicenceResult {
  if (!secret) return { valid: false, reason: "LICENCE_SECRET is not set" };
  if (!key) return { valid: false, reason: "LICENCE_KEY is not set" };

  const dot = key.indexOf(".");
  if (dot <= 0 || dot === key.length - 1) {
    return { valid: false, reason: "malformed licence key" };
  }

  const payloadSegment = key.slice(0, dot);
  const providedSig = key.slice(dot + 1);
  const expectedSig = signPayload(payloadSegment, secret);

  // Constant-time compare to avoid leaking the signature byte by byte.
  const a = base64urlDecode(providedSig);
  const b = base64urlDecode(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { valid: false, reason: "signature mismatch (forged or wrong secret)" };
  }

  let payload: LicencePayload;
  try {
    payload = JSON.parse(base64urlDecode(payloadSegment).toString("utf8"));
  } catch {
    return { valid: false, reason: "unreadable licence payload" };
  }

  if (
    typeof payload?.holder !== "string" ||
    !Array.isArray(payload?.domains) ||
    typeof payload?.issued !== "number" ||
    typeof payload?.expires !== "number"
  ) {
    return { valid: false, reason: "incomplete licence payload", payload };
  }

  if (now >= payload.expires) {
    return { valid: false, reason: "licence expired", payload };
  }

  return { valid: true, payload };
}

/** Normalise a Host header to a bare hostname (strip port, lowercase). */
export function hostnameFrom(host: string | null | undefined): string {
  if (!host) return "";
  return host.split(":")[0].trim().toLowerCase();
}

/** True if `hostname` is authorised by the licence payload. */
export function domainAuthorised(
  payload: LicencePayload,
  hostname: string
): boolean {
  const h = hostname.toLowerCase();
  return payload.domains.some((d) => {
    const allowed = d.toLowerCase();
    if (allowed === "*") return true;
    if (allowed.startsWith("*.")) {
      const base = allowed.slice(2);
      return h === base || h.endsWith(`.${base}`);
    }
    return h === allowed;
  });
}

/** Hosts that are always allowed (local development). */
export function isLocalHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname.endsWith(".localhost")
  );
}
