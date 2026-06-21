"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SurveyBackdrop } from "@/components/ui/SurveyBackdrop";
import { WorldInstrument } from "@/components/global/WorldInstrument";
import { globalPage, typeColor } from "@/content/global";

/* ------------------------------------------------------------------ *
 * Global teaser — the real-coastline survey basemap (WorldInstrument)
 * plotting the regulated carbon markets reported on /global, framed as
 * an instrument panel with a coverage readout + type legend. Reports
 * the external market landscape (not a C2050 service claim); the copy
 * foregrounds the legal ⊕ geospatial bind.
 * ------------------------------------------------------------------ */

const teaser = globalPage.homeTeaser;

function WorldMap() {
  return (
    <div className="corners corners-faint relative aspect-[360/134] w-full overflow-hidden border border-white/10 bg-navy-950/40">
      <WorldInstrument className="h-full w-full" tone="panel" />

      {/* coverage readout, anchored low-left like a HUD */}
      <div className="pointer-events-none absolute bottom-3 left-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-green-300/70">
          {teaser.stat.value} coverage · 2026
        </div>
        <div className="mt-0.5 max-w-[16rem] text-[11px] leading-snug text-white/55">
          {teaser.stat.caption}
        </div>
      </div>

      {/* type legend, top-right */}
      <div className="pointer-events-none absolute right-3 top-3 flex flex-col gap-1">
        {globalPage.legend.types.map((t) => (
          <div
            key={t.type}
            className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/55"
          >
            <span
              className="inline-block h-1.5 w-1.5"
              style={{ backgroundColor: typeColor[t.type] }}
            />
            {t.type}
          </div>
        ))}
      </div>
    </div>
  );
}

export function GlobalTeaser() {
  return (
    <section className="dark-section grain hairline-top relative overflow-hidden bg-navy-900 py-20 text-white lg:py-28">
      <SurveyBackdrop ticks={false} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* ---------------- Copy ---------------- */}
          <div className="order-1">
            <Reveal>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-green-400">
                {teaser.eyebrow}
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {teaser.headline}
              </h2>
              <p className="mt-5 text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
                {teaser.body}
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-7 flex flex-wrap gap-2.5">
              {teaser.chips.map((chip) => (
                <span
                  key={chip}
                  className="border border-white/12 bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/70 tnum"
                >
                  {chip}
                </span>
              ))}
            </Reveal>
            <Reveal delay={0.2} className="mt-9">
              <ButtonLink href={teaser.cta.href} variant="ghost-dark" arrow>
                {teaser.cta.label}
              </ButtonLink>
            </Reveal>
          </div>

          {/* ---------------- World instrument ---------------- */}
          <Reveal delay={0.1} className="order-2">
            <WorldMap />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
