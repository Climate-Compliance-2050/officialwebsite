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
  /** Optional full-bleed background instrument (e.g. the world basemap),
   *  rendered behind the copy with its own scrims. Replaces the photo. */
  backdrop?: React.ReactNode;
  children?: React.ReactNode;
};

/** Dark navy header band shared by all interior pages. */
export function PageHero({ eyebrow, headline, body, media, backdrop, children }: PageHeroProps) {
  return (
    <section className="dark-section grain relative overflow-hidden bg-navy-950 pb-16 pt-32 text-white lg:pb-20 lg:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {backdrop && (
          <>
            {backdrop}
            {/* radial scrim: darkest behind the left-anchored copy, clearing
                toward the borders so the map reads brightest at the edges. */}
            <div className="absolute inset-0 bg-[radial-gradient(125%_115%_at_24%_48%,#060d1a_0%,rgba(6,13,26,0.9)_24%,rgba(6,13,26,0.45)_56%,rgba(6,13,26,0)_84%)]" />
            {/* faint floor so the section still seats into navy top & bottom. */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-transparent to-navy-950/55" />
          </>
        )}
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
          datum={media || backdrop ? undefined : { x: "78%", y: "34%", label: surveyDatum.dublin }}
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
