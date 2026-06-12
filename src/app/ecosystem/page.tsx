import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { EcosystemOrbit } from "@/components/ecosystem/EcosystemOrbit";
import { ecosystemPage } from "@/content/ecosystem";

export const metadata: Metadata = {
  title: "Ecosystem",
  description: ecosystemPage.hero.body,
};

export default function EcosystemPage() {
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
              <p className="mt-6 text-base leading-7 text-navy-900/70">
                {ecosystemPage.network.body}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl bg-slate-50 p-8 lg:mt-14">
                <p className="text-base leading-7 text-navy-900/70">
                  {ecosystemPage.network.agnostic}
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
