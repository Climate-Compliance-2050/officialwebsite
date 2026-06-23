"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { useContent } from "@/components/i18n/LocaleProvider";

export function Problem() {
  const { problem } = useContent();
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={problem.eyebrow}
          headline={problem.headline}
          body={problem.body}
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {problem.points.map((point, i) => (
            <Reveal
              key={point.title}
              delay={i * 0.08}
              className="group rounded-2xl border border-navy-900/8 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-navy-900/8"
            >
              <BrandIcon name={point.icon} tone={i % 2 === 0 ? "green" : "blue"} />
              <h3 className="mt-5 text-lg font-semibold text-navy-900">{point.title}</h3>
              <p className="mt-2.5 text-sm leading-6 text-navy-900/65">{point.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.15} className="mx-auto mt-14 max-w-3xl">
          <p className="rounded-2xl border-l-4 border-green-500 bg-green-50 px-6 py-5 text-center text-base font-medium leading-7 text-navy-900 sm:text-lg sm:leading-8">
            {problem.resolution}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
