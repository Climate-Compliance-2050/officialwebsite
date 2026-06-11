import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Particles } from "@/components/ui/Particles";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { aboutPage } from "@/content/about";

export const metadata: Metadata = {
  title: "About Us",
  description: aboutPage.hero.body,
};

// Brand verification seals: the data inputs every assessed asset is built on.
const seals = [
  { src: "/brand/stamp-geo.webp", label: "Geospatial", note: "Satellite & remote-sensing origin" },
  { src: "/brand/stamp-jurisdiction.webp", label: "Jurisdictional", note: "Territorial & sovereign rights" },
  { src: "/brand/stamp-legal.webp", label: "Legal", note: "Compliance & regulatory posture" },
];

export default function AboutPage() {
  const { dataCube, techFoundation, focus } = aboutPage;
  return (
    <>
      <PageHero {...aboutPage.hero} particles />

      {/* Data Cube deep-dive */}
      <section className="dark-section grain relative overflow-hidden bg-navy-950 pb-20 text-white lg:pb-28">
        {/* ambient backdrop: glows + drifting information-chain constellation */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-[-12%] h-[26rem] w-[26rem] rounded-full bg-blue-800/20 blur-3xl" />
          <div className="absolute -bottom-32 left-[-10%] h-[22rem] w-[22rem] rounded-full bg-green-800/15 blur-3xl" />
          <Particles className="opacity-50" linkColor="49,126,192" color="rgba(101,196,123,0.65)" />
        </div>
        {/* oversized brand mark watermark */}
        <Image
          src="/brand/mark-white.webp"
          alt=""
          aria-hidden
          width={520}
          height={520}
          className="pointer-events-none absolute -right-24 top-1/2 hidden -translate-y-1/2 select-none opacity-[0.05] lg:block"
        />

        <div className="relative mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-400">
                {dataCube.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {dataCube.headline}
              </h2>
              <p className="mt-5 text-base leading-7 text-white/70">{dataCube.body}</p>
              <ul className="mt-8 flex flex-wrap gap-2.5">
                {dataCube.principles.map((principle) => (
                  <li
                    key={principle}
                    className="rounded-sm border border-green-400/30 bg-green-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-green-300"
                  >
                    {principle}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* information pyramid */}
            <div className="mx-auto w-full max-w-md">
              <ol className="flex flex-col-reverse items-center gap-2">
                {dataCube.pyramid.map((level, i) => {
                  // width grows toward the base (i=0 is Data, the widest)
                  const scale = 0.55 + ((i + 1) / dataCube.pyramid.length) * 0.45;
                  return (
                    <Reveal
                      as="li"
                      key={level.level}
                      delay={(dataCube.pyramid.length - i) * 0.08}
                      y={16}
                      className="group relative"
                    >
                      <div
                        className={`rounded-xl border px-6 py-3 text-center transition-colors duration-200 ${
                          i === dataCube.pyramid.length - 1
                            ? "border-green-400/50 bg-green-500/20"
                            : "border-white/12 bg-white/5 hover:border-blue-400/40 hover:bg-blue-500/10"
                        }`}
                        style={{ width: `${scale * 26}rem`, maxWidth: "min(100%, 90vw)" }}
                      >
                        <span className="text-sm font-semibold">{level.level}</span>
                      </div>
                      <p className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-72 -translate-x-1/2 rounded-xl border border-white/10 bg-navy-900 p-4 text-xs leading-5 text-white/75 opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100">
                        {level.body}
                      </p>
                    </Reveal>
                  );
                })}
              </ol>
              <p className="mt-6 text-center text-xs text-white/40">
                Hover each level: raw data ascends into a structured, evidence-based asset profile.
              </p>
            </div>
          </div>

          {/* verification seals: the credibility chain made tangible */}
          <div className="mt-16 border-t border-white/10 pt-10">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Every asset carries a verifiable chain of evidence
            </p>
            <ul className="mt-8 grid gap-6 sm:grid-cols-3">
              {seals.map((seal, i) => (
                <Reveal
                  as="li"
                  key={seal.label}
                  delay={i * 0.08}
                  className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition-colors duration-200 hover:border-green-400/30 hover:bg-green-500/[0.06]"
                >
                  <Image
                    src={seal.src}
                    alt=""
                    aria-hidden
                    width={56}
                    height={56}
                    className="shrink-0 drop-shadow-[0_0_12px_rgba(0,176,80,0.35)]"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{seal.label}</p>
                    <p className="mt-1 text-xs leading-5 text-white/55">{seal.note}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Technological foundation */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={techFoundation.eyebrow}
            headline={techFoundation.headline}
            body={techFoundation.body}
          />

          {/* platform instrument: real earth-observation imagery in branded chrome */}
          <Reveal delay={0.1} className="corners relative mx-auto mt-14 max-w-4xl">
            <div className="overflow-hidden rounded-2xl border border-navy-900/12 bg-navy-950 shadow-2xl shadow-navy-900/20">
              {/* title bar */}
              <div className="flex items-center justify-between border-b border-white/10 bg-navy-900/80 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Image src="/brand/mark-white.webp" alt="" aria-hidden width={18} height={18} />
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
                    C2050 · Platform
                  </span>
                </div>
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-green-300/80">
                  live
                </span>
              </div>

              {/* map viewport */}
              <div className="relative aspect-[16/9]">
                <Image
                  src="/images/satellite.webp"
                  alt="Earth-observation imagery analysed on the C2050 geospatial platform"
                  fill
                  sizes="(max-width: 1024px) 100vw, 56rem"
                  className="object-cover"
                />
                {/* legibility scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-navy-950/25" />
                {/* analysis grid */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.14]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(101,196,123,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(101,196,123,0.6) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                {/* scanline sweep */}
                <div className="animate-scan pointer-events-none absolute inset-x-10 top-1/2 h-px bg-gradient-to-r from-transparent via-green-400/70 to-transparent" />

                {/* telemetry HUD */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55"
                >
                  <div className="absolute left-4 top-3 leading-relaxed">
                    <div className="text-green-300/80">SCENE · LIVE</div>
                    <div>ASSET 7F3A·22</div>
                  </div>
                  <div className="absolute right-4 top-3 text-right leading-relaxed">
                    <div>LAT −3.4653</div>
                    <div>LON −62.2159</div>
                  </div>
                  <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
                    <span>chain verified</span>
                  </div>
                  <div className="absolute bottom-3 right-4 text-right">
                    <span className="tnum">integrity 99.4%</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {techFoundation.pillars.map((pillar, i) => (
              <Reveal
                key={pillar.name}
                delay={i * 0.06}
                className="rounded-2xl border border-navy-900/8 bg-white p-7 shadow-sm"
              >
                <span
                  className={`tnum text-sm font-semibold ${i % 2 === 0 ? "text-green-600" : "text-blue-600"}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-base font-semibold text-navy-900">{pillar.name}</h3>
                <p className="mt-2.5 text-sm leading-6 text-navy-900/65">{pillar.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Focus */}
      <section className="bg-slate-50 py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <Image
              src="/brand/mark.webp"
              alt=""
              aria-hidden
              width={64}
              height={64}
              className="mx-auto mb-8"
            />
            <h2 className="text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
              {focus.headline}
            </h2>
            <p className="mt-5 text-base leading-7 text-navy-900/70 sm:text-lg sm:leading-8">
              {focus.body}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <ButtonLink href="/products" arrow>
                Explore the platform
              </ButtonLink>
              <ButtonLink href="/our-story" variant="secondary">
                Read our story
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
