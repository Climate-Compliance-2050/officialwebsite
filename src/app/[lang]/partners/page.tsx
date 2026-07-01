import type { Metadata } from "next";
import Image from "next/image";
import { Quote } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/content/locales";
import { site } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { partnersPage } = await getDictionary(lang as Locale);
  return {
    title: "Partners",
    description: partnersPage.hero.body,
    alternates: { canonical: `${site.url}/en/partners` },
  };
}

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const { partnersPage } = await getDictionary(lang as Locale);
  return (
    <>
      <PageHero {...partnersPage.hero} />

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-base leading-7 text-navy-900/70 sm:text-lg sm:leading-8">
              {partnersPage.body}
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-8">
            {partnersPage.partners.map((partner, i) => (
              <Reveal key={partner.name} delay={i * 0.08} className="flex">
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reticle relative flex flex-1 flex-col rounded-sm border border-navy-900/10 bg-white p-8 shadow-sm transition-colors duration-300 hover:border-green-600/40"
                >
                <div className="flex h-20 items-center">
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    width={170}
                    height={64}
                    className="max-h-14 w-auto object-contain"
                  />
                </div>
                <h2 className="mt-5 text-lg font-semibold text-navy-900">{partner.name}</h2>
                <p className="mt-2.5 text-sm leading-6 text-navy-900/65">{partner.body}</p>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15} className="mx-auto mt-16 max-w-3xl">
            <blockquote className="rounded-2xl bg-slate-50 p-10 text-center">
              <Quote className="mx-auto h-8 w-8 text-green-500" aria-hidden />
              <p className="mt-5 font-serif text-xl italic leading-relaxed text-navy-900">
                “{partnersPage.quote.text}”
              </p>
              <footer className="mt-5 text-sm text-navy-900/60">
                <span className="font-semibold text-navy-900">{partnersPage.quote.author}</span> ·{" "}
                {partnersPage.quote.role}
              </footer>
            </blockquote>
          </Reveal>

          <Reveal delay={0.2} className="mt-14 text-center">
            <ButtonLink href="/contact" arrow>
              Become a partner
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
