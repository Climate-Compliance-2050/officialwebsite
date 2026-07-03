import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { StudiesFunnel } from "@/components/services/StudiesFunnel";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/content/locales";
import { site } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { servicesPage } = await getDictionary(lang as Locale);
  return {
    title: "Services",
    description: servicesPage.hero.body,
    alternates: { canonical: `${site.url}/en/services` },
  };
}

/** Aperture/lens styling per discipline tone. Static class strings (Tailwind-safe). */
const lensTone = {
  blue: {
    ring: "border-blue-600/25",
    dash: "border-blue-600/40",
    inner: "border-blue-600/50",
    dot: "bg-blue-600",
    label: "text-blue-700",
  },
  green: {
    ring: "border-green-600/25",
    dash: "border-green-600/45",
    inner: "border-green-600/55",
    dot: "bg-green-600",
    label: "text-green-700",
  },
} as const;

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const { servicesPage } = await getDictionary(lang as Locale);
  const { valueProp, catalogue } = servicesPage;

  return (
    <>
      <PageHero
        {...servicesPage.hero}
        media={{ src: "/images/services-hero.webp" }}
      >
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.15em] text-white/70">
            <span className="rounded-sm border border-white/15 bg-white/5 px-3 py-1.5">
              Legal &amp; Regulatory
            </span>
            <span aria-hidden className="text-white/30">
              &times;
            </span>
            <span className="rounded-sm border border-white/15 bg-white/5 px-3 py-1.5">
              Geospatial
            </span>
            <span aria-hidden className="text-white/30">
              &rarr;
            </span>
            <span className="rounded-sm border border-green-400/30 bg-green-400/10 px-3 py-1.5 text-green-300">
              Hard information
            </span>
          </div>
        </Reveal>
      </PageHero>

      {/* Value proposition: two disciplines focused into one integrated study. */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={valueProp.eyebrow}
            headline={valueProp.headline}
            body={valueProp.body}
          />

          <Reveal delay={0.1}>
            <div className="relative mt-16">
              {/* optical axis connecting the two lenses through the study */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-blue-600/0 via-navy-900/25 to-green-600/0 lg:block"
              />
              <div className="relative grid gap-12 lg:grid-cols-3 lg:items-center lg:gap-8">
                {/* lens 1 — Legal & Regulatory (blue) */}
                {(() => {
                  const lens = valueProp.lenses[0];
                  const t = lensTone[lens.tone];
                  return (
                    <div className="relative z-10 flex flex-col items-center bg-white px-4 text-center">
                      <div className="relative grid h-28 w-28 place-items-center">
                        <span className={`absolute inset-0 rounded-full border ${t.ring}`} />
                        <span
                          className={`absolute inset-[0.6rem] rounded-full border border-dashed ${t.dash} animate-spin-slow`}
                        />
                        <span className={`absolute inset-[1.3rem] rounded-full border ${t.inner}`} />
                        <span className={`h-2.5 w-2.5 rounded-full ${t.dot}`} />
                      </div>
                      <p className={`mt-5 font-mono text-xs uppercase tracking-[0.15em] ${t.label}`}>
                        {lens.label}
                      </p>
                      <p className="mt-1.5 max-w-[15rem] font-mono text-[11px] leading-5 text-navy-900/50">
                        {lens.note}
                      </p>
                    </div>
                  );
                })()}

                {/* the study — what both lenses resolve to */}
                <div className="relative z-10 mx-auto flex flex-col items-center bg-white px-4 text-center">
                  <div className="corners relative h-32 w-48 overflow-hidden rounded-sm ring-1 ring-navy-900/10">
                    <Image
                      src="/images/services-land.webp"
                      alt="Aerial view of land divided into geometric parcels"
                      fill
                      sizes="192px"
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-navy-950/25" />
                  </div>
                  <p className="mt-5 font-mono text-xs uppercase tracking-[0.15em] text-navy-900">
                    {valueProp.converge}
                  </p>
                  <p className="mt-1.5 font-mono text-[11px] text-navy-900/50">
                    georeferenced · decision-grade
                  </p>
                </div>

                {/* lens 2 — Geospatial (green) */}
                {(() => {
                  const lens = valueProp.lenses[1];
                  const t = lensTone[lens.tone];
                  return (
                    <div className="relative z-10 flex flex-col items-center bg-white px-4 text-center">
                      <div className="relative grid h-28 w-28 place-items-center">
                        <span className={`absolute inset-0 rounded-full border ${t.ring}`} />
                        <span
                          className={`absolute inset-[0.6rem] rounded-full border border-dashed ${t.dash} animate-spin-slower`}
                        />
                        <span className={`absolute inset-[1.3rem] rounded-full border ${t.inner}`} />
                        <span className={`h-2.5 w-2.5 rounded-full ${t.dot}`} />
                      </div>
                      <p className={`mt-5 font-mono text-xs uppercase tracking-[0.15em] ${t.label}`}>
                        {lens.label}
                      </p>
                      <p className="mt-1.5 max-w-[15rem] font-mono text-[11px] leading-5 text-navy-900/50">
                        {lens.note}
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The funnel: filterable catalogue of studies along a core-sample descent. */}
      <section className="hairline-top relative bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={catalogue.eyebrow}
            headline={catalogue.headline}
            body={catalogue.body}
            align="left"
          />
          <div className="mt-12">
            <StudiesFunnel
              studies={servicesPage.studies}
              filters={servicesPage.filters}
              empty={servicesPage.catalogue.empty}
            />
          </div>
        </div>
      </section>

      {/* Closing band: scope-it CTA over earth observation. */}
      <section className="dark-section grain relative isolate overflow-hidden bg-navy-950 text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Image
            src="/images/services-orbit.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Reveal className="max-w-2xl">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-green-400">
              Where to start
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl">
              Not sure which study you need? We&apos;ll scope it with you.
            </h2>
            <p className="text-doc mt-5 text-base leading-7 text-white/70 sm:text-lg">
              Tell us about your parcel, project or jurisdiction. We&apos;ll map it to the
              right study — from a first screening to a validation-ready evidence base.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <ButtonLink href="/contact" arrow>
                Request a study
              </ButtonLink>
              <ButtonLink href="/products" variant="ghost-dark">
                Explore the platform
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
