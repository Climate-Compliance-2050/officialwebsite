import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SurveyBackdrop } from "@/components/ui/SurveyBackdrop";
import { CoverageCurve } from "@/components/global/CoverageCurve";
import { MarketTimeline } from "@/components/global/MarketTimeline";
import { ProjectionTable } from "@/components/global/ProjectionTable";
import { PipelineGrid } from "@/components/global/PipelineGrid";
import { TypeLegend } from "@/components/global/TypeLegend";
import { SectionNav } from "@/components/global/SectionNav";
import { WorldInstrument } from "@/components/global/WorldInstrument";
import { globalPage } from "@/content/global";

const g = globalPage;

export const metadata: Metadata = {
  title: "Global Carbon Markets",
  description: g.hero.body,
};

export default function GlobalPage() {
  return (
    <>
      <PageHero
        {...g.hero}
        backdrop={
          <WorldInstrument
            fit="slice"
            tone="hero"
            labels={false}
            className="absolute inset-0 h-full w-full"
          />
        }
      >
        <Reveal delay={0.1} className="mt-10">
          <div className="corners relative max-w-xl border border-white/15 bg-white/[0.04] p-6 sm:p-7">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-green-400">
              {g.readout.eyebrow}
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-x-5 gap-y-2">
              <span className="tnum font-serif text-6xl font-semibold leading-none text-white sm:text-7xl">
                {g.readout.value}
              </span>
              <span className="mb-1 max-w-[13rem] text-sm leading-5 text-white/60">
                {g.readout.caption}
              </span>
            </div>
            <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 border-t border-white/10 pt-4">
              {g.readout.secondary.map((s) => (
                <div key={s.label} className="flex items-baseline gap-2">
                  <dd className="tnum font-mono text-2xl font-semibold text-white">{s.value}</dd>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-white/50">
                    {s.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </PageHero>

      <SectionNav />

      {/* Coverage trajectory */}
      <section id="coverage" className="scroll-mt-32 bg-white py-20 lg:scroll-mt-40 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="left"
            eyebrow={g.coverage.eyebrow}
            headline={g.coverage.headline}
            body={g.coverage.body}
          />
          <Reveal className="mt-10">
            <CoverageCurve points={g.coverage.points} />
          </Reveal>
        </div>
      </section>

      {/* Market timeline */}
      <section id="timeline" className="scroll-mt-32 bg-slate-50 py-20 lg:scroll-mt-40 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="left"
            eyebrow={g.timeline.eyebrow}
            headline={g.timeline.headline}
            body={g.timeline.body}
          />
          <div className="mt-12">
            <MarketTimeline eras={g.timeline.eras} markets={g.timeline.markets} />
          </div>
        </div>
      </section>

      {/* Coverage outlook */}
      <section id="outlook" className="scroll-mt-32 bg-white py-20 lg:scroll-mt-40 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="left"
            eyebrow={g.projection.eyebrow}
            headline={g.projection.headline}
          />
          <Reveal className="mt-10">
            <ProjectionTable cols={g.projection.cols} />
          </Reveal>
        </div>
      </section>

      {/* Pipeline + legend */}
      <section id="pipeline" className="scroll-mt-32 bg-slate-50 py-20 lg:scroll-mt-40 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="left"
            eyebrow={g.pipeline.eyebrow}
            headline={g.pipeline.headline}
            body={g.pipeline.body}
          />
          <div className="mt-12">
            <PipelineGrid items={g.pipeline.items} />
          </div>
          <div className="mt-14">
            <TypeLegend />
          </div>
        </div>
      </section>

      {/* C2050 tie-in */}
      <section className="dark-section grain relative overflow-hidden bg-navy-950 py-20 text-white lg:py-28">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <SurveyBackdrop ticks={false} />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-green-400">
              {g.tieIn.eyebrow}
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {g.tieIn.headline}
            </h2>
            <p className="text-doc mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
              {g.tieIn.body}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <ButtonLink href={g.tieIn.primaryCta.href} arrow>
                {g.tieIn.primaryCta.label}
              </ButtonLink>
              <ButtonLink href={g.tieIn.secondaryCta.href} variant="ghost-dark" arrow>
                {g.tieIn.secondaryCta.label}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
