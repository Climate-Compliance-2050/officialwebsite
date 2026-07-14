import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { EcosystemOrbit } from "@/components/ecosystem/EcosystemOrbit";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/content/locales";
import { site } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { ecosystemPage } = await getDictionary(lang as Locale);
  return {
    title: "Ecosystem",
    description: ecosystemPage.hero.body,
    alternates: { canonical: `${site.url}/en/ecosystem` },
  };
}

export default async function EcosystemPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const { ecosystemPage } = await getDictionary(lang as Locale);
  return (
    <>
      <PageHero {...ecosystemPage.hero} />

      {/* Orbit diagram on dark */}
      <section className="dark-section bg-navy-950 pb-20 text-white lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EcosystemOrbit />
        </div>
      </section>

      {/* Narrative */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
                {ecosystemPage.network.headline}
              </h2>
              <p className="text-doc mt-6 text-base leading-7 text-navy-900/70">
                {ecosystemPage.network.body}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl bg-slate-50 p-8 lg:mt-14">
                <p className="text-doc text-base leading-7 text-navy-900/70">
                  {ecosystemPage.network.agnostic.pre}
                  <strong className="font-semibold text-navy-900">
                    {ecosystemPage.network.agnostic.emphasis}
                  </strong>
                  {ecosystemPage.network.agnostic.post}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <ButtonLink href="/partners" variant="secondary" arrow>
                    Meet our partners
                  </ButtonLink>
                  <ButtonLink href="/contact" arrow>
                    Join the ecosystem
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
