"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

type Pillar = { label: string; note: string };

type Dna = {
  eyebrow: string;
  aside: string;
  pillars: Pillar[];
  bind: string;
};

type Tier = {
  code: string;
  name: string;
  access: string;
  tagline: string;
  features: string[];
  bestFor: string;
  cta: string;
  highlight?: boolean;
  admin?: boolean;
};

type BillingMode = { id: string; label: string; note: string };

type Billing = {
  intro: string;
  modes: BillingMode[];
  payg: { eyebrow: string; label: string; note: string };
  quote: string;
};

type Props = {
  tiers: Tier[];
  billing: Billing;
  dna: Dna;
};

export function LicensingStudio({ tiers, billing, dna }: Props) {
  const [mode, setMode] = useState(billing.modes[0]?.id ?? "annual");
  const activeMode = billing.modes.find((m) => m.id === mode) ?? billing.modes[0];

  return (
    <div>
      {/* Billing model — seat licences (term switch) + the separate pay-as-you-go lane */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-sm border border-navy-900/10 bg-white p-5 shadow-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-navy-900/55">
            Seat licences
          </p>
          <div
            role="group"
            aria-label="Billing term"
            className="mt-3 inline-flex rounded-sm border border-navy-900/15 p-0.5"
          >
            {billing.modes.map((m) => {
              const on = m.id === mode;
              return (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setMode(m.id)}
                  className={`rounded-sm px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                    on ? "bg-navy-900 text-white" : "text-navy-900/55 hover:text-navy-900"
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
          <p className="mt-3 min-h-[2.75rem] text-sm leading-6 text-navy-900/65">
            {activeMode?.note}
          </p>
        </div>

        <div className="reticle relative rounded-sm border border-blue-600/25 bg-blue-50/50 p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-blue-700">
            {billing.payg.eyebrow}
          </p>
          <p className="mt-1 text-base font-semibold text-navy-900">{billing.payg.label}</p>
          <p className="mt-2 text-sm leading-6 text-navy-900/65">{billing.payg.note}</p>
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-navy-900/55">{billing.quote}</p>

      {/* The platform — a full-width instrument tablet. Navy "mission-control"
          bezel (grain finish) framing a light, frosted-glass screen. */}
      <div className="grain relative mt-10 overflow-hidden rounded-sm bg-gradient-to-b from-navy-800 to-navy-950 p-3 shadow-[0_36px_80px_-28px_rgba(6,13,26,0.78)] ring-1 ring-inset ring-white/10 sm:p-4">
        {/* aperture mark bleeding from the bezel corner — the C2050 lens, ambient drift */}
        <div
          aria-hidden
          className="animate-spin-slower pointer-events-none absolute -right-16 -top-16 h-56 w-56 opacity-[0.07]"
        >
          <Image src="/brand/mark-white.webp" alt="" fill sizes="14rem" className="object-contain" />
        </div>

        {/* top bezel — lens lockup left, console label right (no status dots) */}
        <div className="relative flex items-center justify-between px-1.5 pb-3 pt-0.5">
          <span className="flex items-center gap-2">
            <span aria-hidden className="animate-spin-slow relative inline-block h-4 w-4">
              <Image src="/brand/mark-white.webp" alt="" fill sizes="1rem" className="object-contain" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
              C2050 · Asset Intelligence
            </span>
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 sm:inline">
            Licensing console
          </span>
        </div>

        {/* screen — inset into the bezel */}
        <div className="relative overflow-hidden rounded-sm bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_2px_6px_rgba(6,13,26,0.55)] ring-1 ring-inset ring-white/20">
          <Atmosphere />

          <div className="relative p-3.5 sm:p-6">
            {/* shared DNA — identical across every tier */}
            <div className="reticle relative rounded-sm border border-green-600/25 bg-white/55 p-4 backdrop-blur-md sm:p-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-green-700">
                  {dna.eyebrow}
                </p>
                <span className="font-mono text-[10px] uppercase tracking-wider text-navy-900/50">
                  {dna.aside}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {dna.pillars.map((p) => (
                  <div
                    key={p.label}
                    className="relative rounded-sm border border-navy-900/10 bg-white/70 py-2.5 pl-4 pr-2.5"
                  >
                    <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-green-500" />
                    <p className="text-sm font-semibold text-navy-900">{p.label}</p>
                    <p className="mt-0.5 text-[11px] leading-4 text-navy-900/55">{p.note}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-navy-900/65">{dna.bind}</p>
            </div>

            {/* the four licences — what each is + who it suits; highlight on hover */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {tiers.map((tier) => (
                <TierBox key={tier.name} tier={tier} mode={activeMode} />
              ))}
            </div>
          </div>
        </div>

        {/* bottom bezel — balances the frame; the legal⊕geospatial signature etch */}
        <div className="relative flex items-center justify-between px-1.5 pb-0.5 pt-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
            Legal ⊕ Geospatial
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 sm:inline">
            Data Cube framework
          </span>
        </div>
      </div>
    </div>
  );
}

/** Atmosphere behind the frosted glass so the blur reads — blueprint grid,
    soft brand glows, tinted topographic contours. Stronger than a flat panel. */
function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* blueprint grid — gives the frost something to refract */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,22,40,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(10,22,40,0.045) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {/* directional brand washes — edge-anchored, no floating blobs */}
      <div className="absolute inset-0 bg-[linear-gradient(148deg,rgba(101,196,123,0.20)_0%,transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(328deg,rgba(49,126,192,0.16)_0%,transparent_38%)]" />
      {/* topographic contours — tinted green/blue, slightly stronger */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
      >
        <g fill="none" strokeWidth="1">
          <path d="M0,110 C220,60 430,150 640,100 S1010,40 1200,120" stroke="#00b050" strokeOpacity="0.11" />
          <path d="M0,210 C200,170 420,250 660,200 S1020,150 1200,230" stroke="#0f1c2e" strokeOpacity="0.08" />
          <path d="M0,320 C240,280 440,360 680,300 S1030,250 1200,330" stroke="#00b050" strokeOpacity="0.08" />
          <path d="M0,430 C220,390 460,470 700,410 S1040,360 1200,440" stroke="#345faa" strokeOpacity="0.11" />
          <path d="M0,540 C240,500 470,580 720,520 S1050,470 1200,550" stroke="#0f1c2e" strokeOpacity="0.07" />
        </g>
      </svg>
    </div>
  );
}

function TierBox({ tier, mode }: { tier: Tier; mode?: BillingMode }) {
  const footer = tier.admin ? "Deployment" : `${mode?.label ?? ""} · seat licence`;
  return (
    <div
      className={`group reticle relative flex h-full flex-col rounded-sm border p-4 backdrop-blur-md transition-all duration-300 hover:shadow-[0_14px_36px_-22px_rgba(15,28,46,0.45)] sm:p-5 ${
        tier.highlight
          ? "border-green-500/45 bg-white/75 ring-1 ring-green-500/20 hover:bg-white/90"
          : "border-navy-900/12 bg-white/45 hover:border-green-500/40 hover:bg-white/85"
      }`}
    >
      {/* top accent — persistent on the recommended tier, sweeps in on hover for the rest */}
      {tier.highlight ? (
        <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-green-500" />
      ) : (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-green-500 transition-transform duration-300 group-hover:scale-x-100"
        />
      )}

      <div className="flex items-center gap-2">
        <span className="tnum font-mono text-xs font-semibold text-navy-900/45 transition-colors group-hover:text-green-700">
          {tier.code}
        </span>
        <span className="rounded-sm bg-navy-900/[0.05] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-navy-900/55">
          {tier.access}
        </span>
        {tier.highlight && (
          <span className="ml-auto rounded-sm bg-green-500/12 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-green-700">
            Most adopted
          </span>
        )}
        {tier.admin && (
          <span className="ml-auto rounded-sm bg-blue-600/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-blue-700">
            White label
          </span>
        )}
      </div>

      <h3 className="mt-3 text-sm font-semibold leading-snug text-navy-900">{tier.name}</h3>
      <p className="mt-1.5 text-xs leading-5 text-navy-900/60">{tier.tagline}</p>

      {/* who it suits */}
      <div className="mt-3 border-t border-navy-900/8 pt-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-navy-900/50">
          Best suited for
        </p>
        <p className="mt-1 text-xs leading-5 text-navy-900/70">{tier.bestFor}</p>
      </div>

      {/* what the licence lets you do */}
      <ul className="mt-3 space-y-1.5">
        {tier.features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-1.5 text-[11px] leading-4 text-navy-900/55 transition-colors group-hover:text-navy-900/85"
          >
            <Check
              className="mt-0.5 h-3 w-3 shrink-0 text-green-600/70 transition-colors group-hover:text-green-600"
              aria-hidden
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <span className="font-mono text-[10px] uppercase tracking-wider text-navy-900/45">
          {footer}
        </span>
        <Link
          href={`/contact?tier=${encodeURIComponent(tier.name)}`}
          className="group/req inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 transition-colors hover:text-green-800"
        >
          {tier.cta}
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover/req:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  );
}
