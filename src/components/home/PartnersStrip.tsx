import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { LocaleLink } from "@/components/i18n/LocaleLink";

const partners = [
  { name: "GEAP", src: "/partners/geap.webp" },
  { name: "Ludovino Lopes Advogados", src: "/partners/ludovino-lopes.webp" },
  { name: "Yakarana", src: "/partners/yakarana.webp" },
];

export function PartnersStrip() {
  return (
    <section className="border-t border-navy-900/8 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-center font-mono text-xs font-medium uppercase tracking-[0.18em] text-navy-900/55">
            Working with
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
            {partners.map((partner) => (
              <Image
                key={partner.name}
                src={partner.src}
                alt={partner.name}
                width={150}
                height={56}
                className="h-10 w-auto opacity-85 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:h-12"
              />
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-8 text-center text-sm text-navy-900/55">
            <LocaleLink href="/partners" className="font-medium text-blue-600 hover:text-blue-700">
              Meet our partners →
            </LocaleLink>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
