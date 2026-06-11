# Licence Protection — Operator Guide

How the C2050 site enforces its proprietary licence (see `LICENCE.md`) and how to
operate it. Three layers, defence in depth:

| Layer            | File                      | When it runs        | What it does                                   |
| ---------------- | ------------------------- | ------------------- | ---------------------------------------------- |
| Boot validation  | `src/instrumentation.ts`  | Once at server start| Throws and refuses to start on invalid licence |
| Request gate     | `src/proxy.ts`            | Every page request  | 403s requests on unauthorised domains/keys     |
| Anti-copy build  | `next.config.ts`          | Build + every request| No source maps, no fingerprint, framing locked |

The core verifier is `src/lib/licence.ts` (HMAC-SHA256, offline, no Next deps).

## How the Licence Key works

A key is `base64url(payload).base64url(hmac-sha256)`. The payload declares:

```json
{ "holder": "C2050 Production", "domains": ["www.c2050.com", "c2050.com"],
  "issued": 1760000000, "expires": 1790000000 }
```

The signature is `HMAC-SHA256(payload, LICENCE_SECRET)`. Without the secret a key
cannot be forged; the payload is signed, so domains and expiry cannot be edited.
A copied build deployed to a different domain fails the domain lock and serves
403s.

## One-time setup

1. **Generate a secret** (keep it private, server-side only):

   ```bash
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

   Set it as `LICENCE_SECRET` in your host's environment.

2. **Mint a key** for your domains:

   ```bash
   LICENCE_SECRET=<secret> node scripts/license-gen.mjs \
     --holder "C2050 Production" \
     --domains "www.c2050.com,c2050.com" \
     --days 365
   ```

   Set the printed value as `LICENCE_KEY` in the same environment.

3. Confirm `.env*` is not committed. Real secrets live only in the host's env
   (Vercel/Render/Docker secret, etc.), never in the repo.

## Behaviour by environment

- **Local dev** (`next dev`, `NODE_ENV !== production`): no key needed.
  `localhost`/`127.0.0.1` always pass. Invalid keys log a warning, never block.
- **Production** (`NODE_ENV === production`): a valid `LICENCE_KEY` +
  `LICENCE_SECRET` is **required**. Missing/expired/forged ⇒ server won't boot;
  wrong domain ⇒ 403.
- **Force enforcement anywhere**: set `LICENCE_ENFORCE=true` to test the
  production gate locally.

## Renewing / rotating

- **Renew before expiry**: mint a new key with a fresh `--days`, swap
  `LICENCE_KEY`, restart.
- **Rotate the secret** (suspected leak): generate a new `LICENCE_SECRET`,
  re-mint all keys against it, update both env vars, restart. Old keys die
  instantly.

## Honest limits

Client-side JavaScript shipped to a browser can always be read and copied —
no web app can prevent that. These layers stop a *copied build from running* on
an unauthorised domain and remove the easy paths (source maps, framing), but
they are deterrents plus enforcement, not DRM. The legal licence in `LICENCE.md`
is the backstop. Keep `LICENCE_SECRET` secret — it is the whole trust anchor.
