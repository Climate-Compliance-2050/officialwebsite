import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ButtonLink } from "@/components/ui/Button";
import { productsPage } from "@/content/ecosystem";

export const metadata: Metadata = {
  title: "Products",
  description: productsPage.hero.body,
};

export default function ProductsPage() {
  return (
    <>
      <PageHero {...productsPage.hero} particles />

      {/* Platform + modules */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
                {productsPage.platform.headline}
              </h2>
              <p className="mt-6 text-base leading-7 text-navy-900/70">
                {productsPage.platform.body}
              </p>
              <p className="mt-4 text-base leading-7 text-navy-900/70">
                {productsPage.platform.sandbox}
              </p>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {productsPage.platform.modules.map((module, i) => (
                <Reveal
                  key={module.name}
                  delay={i * 0.06}
                  className="rounded-2xl border border-navy-900/8 bg-white p-5 shadow-sm"
                >
                  <BrandIcon name={module.icon} tone={i % 2 === 0 ? "green" : "blue"} className="!h-10 !w-10 !rounded-lg" />
                  <h3 className="mt-3 text-sm font-semibold text-navy-900">{module.name}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-navy-900/60">{module.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Licensing"
            headline={productsPage.tiersIntro.headline}
            body={productsPage.tiersIntro.body}
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {productsPage.tiers.map((tier, i) => (
              <Reveal
                key={tier.name}
                delay={i * 0.07}
                className={`flex flex-col rounded-2xl p-7 ${
                  tier.highlight
                    ? "dark-section corners relative bg-navy-900 text-white shadow-xl shadow-navy-900/20 ring-1 ring-green-500/40"
                    : "border border-navy-900/8 bg-white text-navy-900 shadow-sm"
                }`}
              >
                <p
                  className={`tnum text-xs font-semibold ${
                    tier.highlight ? "text-green-300" : "text-green-700"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-lg font-semibold leading-snug">{tier.name}</h3>
                <p
                  className={`mt-2 text-sm leading-6 ${
                    tier.highlight ? "text-white/70" : "text-navy-900/65"
                  }`}
                >
                  {tier.tagline}
                </p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          tier.highlight ? "text-green-400" : "text-green-600"
                        }`}
                        aria-hidden
                      />
                      <span className={tier.highlight ? "text-white/85" : "text-navy-900/75"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <p
                  className={`mt-6 border-t pt-5 text-xs leading-5 ${
                    tier.highlight
                      ? "border-white/10 text-white/55"
                      : "border-navy-900/8 text-navy-900/55"
                  }`}
                >
                  <span className="font-semibold">Best for:</span> {tier.bestFor}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Compliance Badges */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
                Smart Compliance Badges
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
                {productsPage.badges.headline}
              </h2>
              <p className="mt-5 text-base leading-7 text-navy-900/70">
                {productsPage.badges.body}
              </p>
              <div className="mt-8">
                <ButtonLink href="/contact" arrow>
                  Talk to our team
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-wrap items-center justify-center gap-8 rounded-2xl bg-slate-50 p-10">
                {productsPage.badges.stamps.map((stamp) => (
                  <figure key={stamp.label} className="text-center">
                    <Image
                      src={stamp.src}
                      alt={`${stamp.label} badge`}
                      width={120}
                      height={120}
                      className="mx-auto h-24 w-24 object-contain sm:h-28 sm:w-28"
                    />
                    <figcaption className="mt-3 text-xs font-medium text-navy-900/65">
                      {stamp.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
