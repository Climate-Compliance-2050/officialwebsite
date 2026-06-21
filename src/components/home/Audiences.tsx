import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { audiences } from "@/content/site";

// Dark register: navy chips vanish on a navy ground, so the third segment
// carries green rather than navy.
const tones = ["green", "blue", "green"] as const;

export function Audiences() {
  return (
    <section className="dark-section grain relative overflow-hidden bg-navy-950 py-20 text-white lg:py-28">
      {/* faint technical grid backdrop — same register as the cube section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={audiences.eyebrow} headline={audiences.headline} dark />
        <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {audiences.segments.map((segment, i) => (
            <Reveal
              key={segment.name}
              delay={i * 0.08}
              className="reticle relative flex flex-col rounded-sm border border-white/10 bg-white/[0.04] p-8 transition-colors duration-300 hover:border-green-400/40"
            >
              <div className="flex items-center gap-4">
                <BrandIcon name={segment.icon} tone={tones[i]} size="lg" />
                <div>
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-green-400">
                    {segment.name}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold leading-snug text-white">
                    {segment.title}
                  </h3>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-white/70">{segment.body}</p>
              <ul className="mt-6 divide-y divide-white/10 border-t border-white/10">
                {segment.examples.map((example, j) => (
                  <li key={example} className="flex items-center gap-3 py-2.5 text-sm text-white/75">
                    <span className="tnum w-5 shrink-0 font-mono text-[11px] text-green-400" aria-hidden>
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    {example}
                  </li>
                ))}
              </ul>
              <Link
                href={segment.cta.href}
                className="reticle group/cta mt-6 inline-flex items-center gap-1.5 self-start border border-white/15 px-4 py-2 text-sm font-semibold text-green-400 transition-colors hover:border-green-400/50 hover:text-green-300"
              >
                {segment.cta.label}
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
