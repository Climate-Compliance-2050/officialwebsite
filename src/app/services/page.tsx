import type { Metadata } from "next";
import Image from "next/image";
import { Landmark } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { servicesPage } from "@/content/ecosystem";

export const metadata: Metadata = {
  title: "Services",
  description: servicesPage.hero.body,
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, "-");

export default function ServicesPage() {
  return (
    <>
      <PageHero
        {...servicesPage.hero}
        media={{ src: "/images/services-hero.webp" }}
      >
        {/* lifecycle rail: anchor stepper across the asset life */}
        <Reveal delay={0.15}>
          <nav aria-label="Asset lifecycle" className="mt-10">
            <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-3">
              {servicesPage.stages.map((stage, i) => (
                <li key={stage.stage} className="flex items-center gap-1.5">
                  <a
                    href={`#${slug(stage.stage)}`}
                    className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1.5 pl-1.5 pr-4 text-xs font-semibold text-white/80 backdrop-blur-sm transition-colors hover:border-green-400/60 hover:bg-green-400/10 hover:text-white"
                  >
                    <span className="tnum flex h-5 w-5 items-center justify-center rounded-full bg-green-400/15 text-[11px] text-green-300 transition-colors group-hover:bg-green-400 group-hover:text-navy-950">
                      {i + 1}
                    </span>
                    {stage.stage}
                  </a>
                  {i < servicesPage.stages.length - 1 && (
                    <span aria-hidden className="text-white/20">
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </Reveal>
      </PageHero>

      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {servicesPage.stages.map((stage, i) => (
              <div key={stage.stage}>
                <Reveal className="scroll-mt-28">
                  <div id={slug(stage.stage)} className="grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
                      <p className="tnum text-sm font-semibold text-green-600">
                        Stage {String(i + 1).padStart(2, "0")}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-navy-900 sm:text-3xl">
                        {stage.stage}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-navy-900/60">{stage.intro}</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
                      {stage.services.map((service) => (
                        <div
                          key={service.name}
                          className="group rounded-2xl border border-navy-900/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-green-600/20 hover:shadow-lg hover:shadow-navy-900/8"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-base font-semibold text-navy-900">{service.name}</h3>
                            {service.jurisdictional && (
                              <span className="inline-flex shrink-0 items-center gap-1 rounded-sm bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                                <Landmark className="h-3 w-3" aria-hidden />
                                Jurisdictional
                              </span>
                            )}
                          </div>
                          <p className="mt-2.5 text-sm leading-6 text-navy-900/65">{service.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>

                {/* cinematic breather mid-catalogue */}
                {i === 2 && (
                  <Reveal delay={0.05} className="mt-16">
                    <figure className="relative isolate overflow-hidden rounded-3xl">
                      <Image
                        src="/images/services-land.webp"
                        alt="Aerial view of cultivated land divided into geometric parcels"
                        width={1920}
                        height={1078}
                        sizes="(min-width: 1280px) 1216px, 100vw"
                        className="h-56 w-full object-cover object-center sm:h-64 lg:h-72"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/55 to-navy-950/20" />
                      <figcaption className="absolute inset-0 flex flex-col justify-center p-8 sm:p-12">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-300">
                          Evidence-based
                        </p>
                        <p className="mt-3 max-w-xl text-lg font-medium leading-snug text-white sm:text-2xl">
                          Every assessment traces back to the land itself: geospatial
                          truth, not assumption.
                        </p>
                      </figcaption>
                    </figure>
                  </Reveal>
                )}

                {i < servicesPage.stages.length - 1 && (
                  <div aria-hidden className="mt-16 h-px bg-navy-900/8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* closing cinematic band: earth observation + CTA */}
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-400">
              Earth observation
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl">
              Decisions grounded in what the planet actually shows.
            </h2>
            <p className="mt-5 text-base leading-7 text-white/70 sm:text-lg">
              Scientific, legal and regulatory rigour across the full lifecycle of an
              environmental asset. Not sure where yours sits? We&apos;ll map it.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <ButtonLink href="/contact" arrow>
                Assess an Asset
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
