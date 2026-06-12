import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ButtonLink } from "@/components/ui/Button";
import { LicensingStudio } from "@/components/products/LicensingStudio";
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
          <Reveal className="mt-14">
            <LicensingStudio
              tiers={productsPage.tiers}
              billing={productsPage.billing}
              dna={productsPage.dna}
            />
          </Reveal>
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
