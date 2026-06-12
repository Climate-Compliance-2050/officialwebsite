import Image from "next/image";
import { Reveal } from "./Reveal";
import { SurveyBackdrop } from "./SurveyBackdrop";
import { surveyDatum } from "@/content/site";

type PageHeroProps = {
  eyebrow: string;
  headline: string;
  body?: string;
  /** Optional full-bleed background photo, scrimmed for legibility. */
  media?: { src: string; alt?: string };
  children?: React.ReactNode;
};

/** Dark navy header band shared by all interior pages. */
export function PageHero({ eyebrow, headline, body, media, children }: PageHeroProps) {
  return (
    <section className="dark-section grain relative overflow-hidden bg-navy-950 pb-16 pt-32 text-white lg:pb-20 lg:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {media && (
          <>
            <Image
              src={media.src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-45"
            />
            {/* scrims: keep copy legible, fade base back to navy at edges */}
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/10 to-navy-950/60" />
          </>
        )}
        <SurveyBackdrop
          datum={media ? undefined : { x: "78%", y: "34%", label: surveyDatum.dublin }}
          ticks={false}
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-green-400">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl">
            {headline}
          </h1>
          {body && (
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
              {body}
            </p>
          )}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
