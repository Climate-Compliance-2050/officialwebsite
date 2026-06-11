/**
 * Boot-time licence validation.
 *
 * `register()` runs once per server instance and must finish before the server
 * accepts requests (Next.js 16 instrumentation contract). We validate the
 * Licence Key here so an unlicensed or tampered deployment fails fast at boot
 * rather than silently serving traffic.
 *
 * Enforcement policy:
 *   - production: invalid licence -> throw -> server refuses to start.
 *   - non-production: invalid licence -> warn only (so local dev is never
 *     bricked). Set LICENCE_ENFORCE=true to force production behaviour anywhere.
 */

import { verifyLicenceKey } from "@/lib/licence";

export function register() {
  const isProd = process.env.NODE_ENV === "production";
  const forced = process.env.LICENCE_ENFORCE === "true";
  const enforce = isProd || forced;

  const result = verifyLicenceKey(
    process.env.LICENCE_KEY,
    process.env.LICENCE_SECRET
  );

  if (result.valid) {
    const expiresIn = Math.max(
      0,
      result.payload.expires - Math.floor(Date.now() / 1000)
    );
    const days = Math.floor(expiresIn / 86400);
    console.log(
      `[licence] valid — holder "${result.payload.holder}", domains ` +
        `[${result.payload.domains.join(", ")}], expires in ${days}d`
    );
    return;
  }

  const message = `[licence] invalid — ${result.reason}`;

  if (enforce) {
    // Halts server start. Do not downgrade to a warning to "unblock" a deploy:
    // that defeats the protection and breaches LICENCE.md.
    throw new Error(
      `${message}. Refusing to start. Set a valid LICENCE_KEY/LICENCE_SECRET ` +
        `(see LICENCE-PROTECTION.md).`
    );
  }

  console.warn(
    `${message}. Continuing because enforcement is off (non-production). ` +
      `Set LICENCE_ENFORCE=true to test enforcement locally.`
  );
}
