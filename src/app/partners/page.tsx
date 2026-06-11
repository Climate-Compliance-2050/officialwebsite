import type { Metadata } from "next";
import Image from "next/image";
import { Quote } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { partnersPage } from "@/content/ecosystem";

export const metadata: Metadata = {
  title: "Partners",
  description: partnersPage.hero.body,
};

export default function PartnersPage() {
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
              <Reveal
                key={partner.name}
                delay={i * 0.08}
                className="flex flex-col rounded-2xl border border-navy-900/8 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/8"
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
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15} className="mx-auto mt-16 max-w-3xl">
            <blockquote className="rounded-2xl bg-slate-50 p-10 text-center">
              <Quote className="mx-auto h-8 w-8 text-green-500" aria-hidden />
              <p className="mt-5 text-xl font-medium leading-relaxed text-navy-900">
                “{partnersPage.quote.text}”
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
