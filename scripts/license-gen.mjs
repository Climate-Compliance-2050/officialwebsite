#!/usr/bin/env node
/**
 * Mint a C2050 Licence Key.
 *
 * Usage:
 *   LICENCE_SECRET=... node scripts/license-gen.mjs \
 *     --holder "C2050 Production" \
 *     --domains "www.c2050.com,c2050.com" \
 *     --days 365
 *
 * Prints the key to stdout. Put it in the deployment's LICENCE_KEY env var and
 * keep LICENCE_SECRET out of the repo (server-side env only).
 *
 * The signing logic is duplicated here (plain JS, no build step) but MUST match
 * src/lib/licence.ts:signPayload.
 */

import { createHmac } from "node:crypto";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const secret = process.env.LICENCE_SECRET;
if (!secret) {
  console.error("error: LICENCE_SECRET env var is required to sign a key.");
  process.exit(1);
}

const holder = arg("holder", "C2050");
const domains = arg("domains", "www.c2050.com")
  .split(",")
  .map((d) => d.trim())
  .filter(Boolean);
const days = Number(arg("days", "365"));

if (!Number.isFinite(days) || days <= 0) {
  console.error("error: --days must be a positive number.");
  process.exit(1);
}

const now = Math.floor(Date.now() / 1000);
const payload = {
  holder,
  domains,
  issued: now,
  expires: now + days * 86400,
};

const payloadSegment = Buffer.from(JSON.stringify(payload)).toString(
  "base64url"
);
const sig = createHmac("sha256", secret)
  .update(payloadSegment)
  .digest()
  .toString("base64url");

const key = `${payloadSegment}.${sig}`;

console.error("Licence payload:");
console.error(JSON.stringify(payload, null, 2));
console.error(
  `\nExpires: ${new Date(payload.expires * 1000).toISOString()}\n`
);
console.error("LICENCE_KEY=");
console.log(key);
