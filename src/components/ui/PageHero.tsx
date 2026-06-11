import Image from "next/image";
import { Reveal } from "./Reveal";
import { Particles } from "./Particles";

type PageHeroProps = {
  eyebrow: string;
  headline: string;
  body?: string;
  /** Optional full-bleed background photo, scrimmed for legibility. */
  media?: { src: string; alt?: string };
  /** Opt-in drifting constellation layer over the backdrop. */
  particles?: boolean;
  children?: React.ReactNode;
};

/** Dark navy header band shared by all interior pages. */
export function PageHero({ eyebrow, headline, body, media, particles, children }: PageHeroProps) {
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
        <div className="absolute -top-32 right-[-15%] h-[26rem] w-[26rem] rounded-full bg-blue-800/25 blur-3xl" />
        <div className="absolute -bottom-40 left-[-10%] h-[22rem] w-[22rem] rounded-full bg-green-800/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        {particles && <Particles className="opacity-70" />}
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-400">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl">
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
