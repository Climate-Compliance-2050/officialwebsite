import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ButtonLink } from "@/components/ui/Button";
import { LicensingStudio } from "@/components/products/LicensingStudio";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/content/locales";
import { site } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { productsPage } = await getDictionary(lang as Locale);
  return {
    title: "Products",
    description: productsPage.hero.body,
    alternates: { canonical: `${site.url}/en/products` },
  };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const { productsPage } = await getDictionary(lang as Locale);
  return (
    <>
      <PageHero {...productsPage.hero} />

      {/* Platform + modules */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
              {productsPage.platform.headline}
            </h2>
            <p className="text-doc mt-6 text-base leading-7 text-navy-900/70">
              {productsPage.platform.body}
            </p>
            <p className="text-doc mt-4 text-base leading-7 text-navy-900/70">
              {productsPage.platform.sandbox}
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productsPage.platform.modules.map((module, i) => (
              <Reveal
                key={module.name}
                delay={i * 0.06}
                className="reticle relative rounded-sm border border-navy-900/10 bg-white p-5 shadow-sm transition-colors duration-300 hover:border-green-600/40"
              >
                <BrandIcon name={module.icon} tone={i % 2 === 0 ? "green" : "blue"} className="!h-10 !w-10 !rounded-lg" />
                <h3 className="mt-3 text-sm font-semibold text-navy-900">{module.name}</h3>
                <p className="mt-1.5 text-xs leading-5 text-navy-900/60">{module.body}</p>
              </Reveal>
            ))}
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

      {/* Smart Compliance Badges — evidence plaques, deliberately not seals */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-green-700">
                Smart Compliance Badges
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
                {productsPage.badges.headline}
              </h2>
              <p className="text-doc mt-5 text-base leading-7 text-navy-900/70">
                {productsPage.badges.body}
              </p>
              <div className="mt-8">
                <ButtonLink href="/contact" arrow>
                  Configure a Badge framework
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-sm border border-navy-900/10 bg-slate-50 p-6 sm:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-navy-900/50">
                  {productsPage.badges.aside}
                </p>
                <ul className="mt-5 space-y-3">
                  {productsPage.badges.plaques.map((plaque) => (
                    <li
                      key={plaque.code}
                      className="corners relative border border-navy-900/10 bg-white px-5 py-4"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="flex items-baseline gap-3">
                          <span className="font-mono text-xs font-semibold text-green-700">
                            {plaque.code}
                          </span>
                          <span className="text-sm font-semibold text-navy-900">
                            {plaque.label}
                          </span>
                        </p>
                      </div>
                      <div className="mt-3 grid grid-cols-[4.5rem_1fr] gap-y-1 border-t border-navy-900/8 pt-3 font-mono text-[10px] uppercase tracking-wider">
                        <span className="text-navy-900/45">Signal</span>
                        <span className="text-navy-900/75">{plaque.signal}</span>
                        <span className="text-navy-900/45">Evidence</span>
                        <span className="text-navy-900/75">{productsPage.badges.evidence}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
