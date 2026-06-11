import { Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { audiences } from "@/content/site";

const tones = ["green", "blue", "navy"] as const;

export function Audiences() {
  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={audiences.eyebrow} headline={audiences.headline} />
        <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {audiences.segments.map((segment, i) => (
            <Reveal
              key={segment.name}
              delay={i * 0.08}
              className="flex flex-col rounded-2xl border border-navy-900/8 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/8"
            >
              <div className="flex items-center gap-4">
                <BrandIcon name={segment.icon} tone={tones[i]} size="lg" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green-700">
                    {segment.name}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold leading-snug text-navy-900">
                    {segment.title}
                  </h3>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-navy-900/65">{segment.body}</p>
              <ul className="mt-6 space-y-2.5 border-t border-navy-900/8 pt-6">
                {segment.examples.map((example) => (
                  <li key={example} className="flex items-center gap-2.5 text-sm text-navy-900/75">
                    <Check className="h-4 w-4 shrink-0 text-green-600" aria-hidden />
                    {example}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
