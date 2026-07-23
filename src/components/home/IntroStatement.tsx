"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { useContent } from "@/components/i18n/LocaleProvider";

/**
 * Who-we-are statement directly under the hero (Alan Barry, July 2026):
 * the "C2050 delivers…" positioning, plus the bridge from the environmental
 * asset economy to carbon markets. Light band, instrument framing.
 */
export function IntroStatement() {
  const { intro } = useContent();
  return (
    <section className="hairline-top bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="corners-faint relative mx-auto max-w-4xl overflow-hidden border border-navy-900/8 bg-white px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
          {/* aperture watermark — the C2050 lens, bleeding off the card corner */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 opacity-[0.05] sm:h-72 sm:w-72"
          >
            <div className="relative h-full w-full animate-aperture">
              <Image src="/brand/mark.webp" alt="" fill sizes="18rem" className="object-contain" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-blue-600">
              <Image src="/brand/mark.webp" alt="" aria-hidden width={14} height={14} />
              {intro.eyebrow}
            </p>
            <h2 className="mt-4 font-serif text-2xl font-semibold leading-snug tracking-tight text-navy-900 sm:text-3xl">
              {intro.headline}
            </h2>
            <p className="text-doc mt-5 text-base leading-7 text-navy-900/70">{intro.body}</p>
            <p className="mt-4 border-l-2 border-green-500 pl-4 text-base font-medium leading-7 text-navy-900">
              {intro.bridge}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
