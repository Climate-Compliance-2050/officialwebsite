@AGENTS.md

## Shorthand commands

**"lança essa bomba"** — commit all staged changes and push to `main` on `https://github.com/Climate-Compliance-2050/officialwebsite`. No confirmation needed.

---

# C2050 — working agreement

This file governs how AI assistants work in this repo. It is loaded every session.
Three things it enforces: (1) get full value from the model, (2) kill AI slop and
clichés in all prose, (3) hold the C2050 brand and legal guardrails.

---

## 1. Model use — work at full depth

This repo is built with Claude Opus 4.8 / Fable 5. Don't under-drive them.

- **Reason to the bottom of the task.** Multi-layer work (the 5 intelligence
  layers, the Data Cube, the globe instrument) is interconnected — trace the whole
  chain before editing, don't patch one face and leave the others inconsistent.
- **Parallelize.** Independent reads/searches go in one batch, not one-at-a-time.
- **Next.js 16 is not your training data.** Read the guide in
  `node_modules/next/dist/docs/` before writing App Router / config / API code
  (see AGENTS.md). Heed deprecation notices.
- **Verify visually before claiming done.** Use the repo's CDP screenshot scripts
  (`cdp-shot.mjs` = 4 viewports, `cdp-clip.mjs` = hero panel — clip scale must stay
  1, scale 2 hangs CDP) with the dev server on :3000. "Builds clean" ≠ "looks right."
- **Quality is not negotiable for tokens.** Caveman/brief chat modes affect *chat
  style only* — never the quality, completeness, or correctness of code or copy.
- **Don't invent facts.** Stats, dates, names, metrics, methodologies must come from
  `src/content/*` or a cited source. If you don't have it, say so — never fabricate.

---
## Plan First
For any design/UX or visual feature, propose 2-3 concrete options and wait for my pick before implementing.

## 2. No AI slop, no clichés

All user-facing copy and docs read like they were written by C2050's people, not a
language model. Copy source of truth is the **legal-counsel rewrite (June 2026)** in
`src/content/{site,about,ecosystem}.ts`. Match that voice; never regress it.

**Voice:** precise, evidence-led, institutional, calm authority. Decision-grade, not
hyped. Short declaratives. Claims carry a basis — "evidence, not assertions" is a
literal company value. The `clarifier` block (what C2050 *is and is not*) is the
tonal anchor.

**Banned-language table — never reintroduce these** (referenced by `src/content/site.ts`):

| Category | Banned |
|---|---|
| LLM tells | delve, in today's fast-paced world, ever-evolving / ever-changing landscape, navigate the complexities, it's worth noting, dive in / deep dive, tapestry, testament to, stands as a testament, when it comes to |
| Hype adjectives | game-changer, revolutionary / revolutionize, cutting-edge, state-of-the-art, best-in-class, world-class, next-generation, groundbreaking, unparalleled, unmatched, industry-leading, bleeding-edge |
| Buzzword verbs | leverage (as buzzword), supercharge, empower, elevate, unleash, harness the power of, turbocharge |
| Empty connectors | seamless / seamlessly, holistic, synergy, paradigm shift, transformative, robust (as filler), at the end of the day, low-hanging fruit, move the needle |
| Sales filler | we're thrilled / excited to, look no further, the only X you'll ever need, trust us, rest assured |
| Construction | "It's not just X — it's Y", rhetorical-question openers, "Moreover/Furthermore/In conclusion" as paragraph glue |
| Greenwash | save the planet, green revolution, vague "sustainability" with no specifics, feel-good claims with no evidence |

**Keep** the deliberate house vocabulary the real copy uses: *integrity, decision-grade,
evidence base, asset intelligence, unlock the flow of (sustainable finance), restore
market trust, intelligence layers.* These are voice, not slop — don't strip them.

**Punctuation:** em dashes are part of the house style (used throughout the copy) —
use them deliberately, don't carpet-bomb. Tabular figures (`.tnum`) for all stats.

---

## 3. Brand guardrails (what's actually running)

Design tokens live in `src/app/globals.css` (`@theme`). That file is the source of
truth — these rules describe it so you don't drift from it.

**Legal guardrails — never violate** (from `clarifier` / footer `disclaimer`):
C2050 is decision-support intelligence and compliance infrastructure. It is **not** a
carbon standard, registry, broker, verification & validation body (VVB), or investment
adviser. Never write or imply that C2050 *issues credits, certifies projects, verifies/
validates,* or *gives investment advice.* This is a compliance company — wrong wording
is a legal problem, not a style nit.

**The differentiator — always foreground it:** C2050's edge over every other player
is that it **integrates legal & regulatory analysis with geospatial data** — the
nuances of land tenure and applicable legislation are *locked to coordinates* through a
proprietary framework (the Data Cube). Competitors do geospatial *or* legal; C2050 binds
them. Every record carries this legal⊕geospatial bind as its core, across all licensing
tiers. When presenting the platform or products, make this integration the hero, not a
feature in a list.

**Color** (hex from globals.css):
- Primary green `#00b050` — accents and fills only. **Not body text on white** (fails
  contrast). Used for reticle brackets, focus outline, selection, nav underline.
- Primary blue `#345faa` (blue-600); blue-400 `#2e84c5` for secondary brackets.
- Navy register `#0a1628`–`#16294a` = "mission control" dark sections.
- Foreground `#0f1c2e` on `#ffffff` background.

**Type:** IBM Plex Sans (`--font-sans`, body) + IBM Plex Mono (`--font-mono`, HUD
labels, coordinates, data tickers, eyebrows) + IBM Plex Serif (`--font-serif`,
**display voice only**: H1/H2, pull-quotes, hero caption — never body). Loaded via
`next/font/google` in `layout.tsx`. Justified text only via the `.text-doc` utility
(desktop-only justify + hyphens, owner-approved June 2026) on long-form left-aligned
prose — never centered, short, or card copy; never raw `text-justify`.

**Form language (the "instrument" look):**
- Sharp corners only — radius scale is overridden to 1–3px. **No `rounded-full`** on
  pills/buttons/chips; true circles only (LIVE dots, nodes).
- Effect utilities, reuse don't reinvent: `.grain` (dark sections), `.corners` /
  `.corners-blue` / `.corners-faint` (always-on reticle brackets), `.reticle` /
  `.reticle-blue` (same brackets, fade in on hover/focus-within), `.hairline-top`,
  `.btn-sheen`, `.nav-underline`, `.tnum`.
- Named animations in `@theme`, reuse don't redeclare: marquee, spin-slow/-slower
  (aperture mark), orbit-a/-b + scan + core + feed + lock (Data Cube instrument),
  twinkle (constellation nodes), scroll-cue (cinematic hero droplet).
- The brand mark is an **aperture / lens** (slow ambient rotation).
- **Cinematic hero pattern** (`CinematicHero.tsx`): full-bleed `min-h-[100svh]` looping
  ambient video (muted/playsInline, assets in `public/video/`) under navy scrims for a
  legibility floor, mono HUD telemetry frame, serif headline anchored low like a film
  title card. Reduced motion pauses the video and shows the poster frame.
- Respect `prefers-reduced-motion` — already wired globally; keep new animation behind
  it.

**Copy lives in `src/content/`**, English only for launch (pt-BR planned). Never
hardcode user-facing strings in components.

---

## 4. Internationalization (i18n) — built, paused

The full EN/PT switch is **implemented and wired end-to-end**, but the visible
toggle is **hidden** until the Portuguese copy exists. Don't rebuild it; finish it.

**What's live (don't touch unless translating):**
- Subpath routing: every page is under `src/app/[lang]/`, served at `/en/…` and
  `/pt/…`. Both prerender via `generateStaticParams`.
- `src/proxy.ts` (Next 16 `proxy`, the renamed `middleware` — **not** `middleware.ts`):
  unprefixed URL → redirect by `NEXT_LOCALE` cookie → `Accept-Language` → `en`.
- Dictionary layer: `src/content/locales.ts`, `src/content/dictionaries.ts`
  (`getDictionary`), `src/content/en/index.ts` (aggregates the existing copy modules).
- Delivery: `LocaleProvider` + `useContent()` / `useLang()` (client), `LocaleLink`
  (auto-prefixes locale onto internal hrefs; `ButtonLink` routes through it).
- The toggle itself: `LocaleToggle` in `Navbar.tsx`, gated behind
  `const SHOW_LOCALE_TOGGLE = false`. Flip to `true` to expose it.

**What's stubbed (the only follow-up):** `src/content/pt/index.ts` re-exports `../en`
as a placeholder, so `/pt` currently renders English. To finish: mirror the EN copy
objects in `src/content/pt/` with translated values (same keys/shape), then set
`SHOW_LOCALE_TOGGLE = true`.

**Gotcha:** after moving route folders, Turbopack's HMR cache panics
(`Failed to write app endpoint`). Kill dev + delete `.next` before restarting.
