import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Particles } from "@/components/ui/Particles";
import { homeCta } from "@/content/site";

export function HomeCta() {
  return (
    <section className="dark-section grain hairline-top relative overflow-hidden py-24 text-white lg:py-32">
      <Image
        src="/images/cta-aerial.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        aria-hidden
      />
      {/* brand overlay treatment: navy/blue at ~80% */}
      <div aria-hidden className="absolute inset-0 bg-navy-950/80" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-green-900/30" />
      {/* drifting constellation + oversized brand mark bleeding off the right edge */}
      <Particles className="opacity-40" />
      <Image
        src="/brand/mark-white.webp"
        alt=""
        aria-hidden
        width={620}
        height={620}
        className="pointer-events-none absolute -right-44 top-1/2 w-[30rem] max-w-none -translate-y-1/2 opacity-[0.05] motion-safe:animate-spin-slow"
      />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {homeCta.headline}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
            {homeCta.body}
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink href={homeCta.primaryCta.href} arrow>
              {homeCta.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={homeCta.secondaryCta.href} variant="ghost-dark">
              {homeCta.secondaryCta.label}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
