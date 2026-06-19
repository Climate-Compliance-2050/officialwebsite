"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { Reveal } from "./Reveal";

type CinematicHeroProps = {
  eyebrow: string;
  headline: string;
  body?: string;
  video: { src: string; poster: string };
};

/**
 * Full-bleed cinematic opening: looping ambient video under navy scrims,
 * mono HUD telemetry, staggered serif headline. Reduced motion gets the
 * static poster frame (video paused, no scroll cue animation).
 */
export function CinematicHero({ eyebrow, headline, body, video }: CinematicHeroProps) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (reduce) {
      el.pause();
    } else {
      // Autoplay can be blocked until hydration; nudge it.
      el.play().catch(() => {});
    }
  }, [reduce]);

  return (
    <section className="dark-section grain relative flex min-h-[100svh] flex-col overflow-hidden bg-navy-950 text-white">
      {/* footage */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <video
          ref={videoRef}
          autoPlay={!reduce}
          muted
          loop
          playsInline
          preload="metadata"
          poster={video.poster}
          className="h-full w-full object-cover opacity-60"
        >
          <source src={video.src} type="video/mp4" />
        </video>
        {/* scrims: legibility floor + navy edges so the band reads as one register */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/35 to-navy-950/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/70 via-transparent to-navy-950/40" />
      </div>

      {/* HUD telemetry frame (decorative) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between px-4 pt-24 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 sm:px-6 lg:px-8 lg:pt-28"
      >
        <div className="leading-relaxed">
          <div className="flex items-center gap-1.5 text-green-300/80">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
            orbital feed
          </div>
          <div>C2050 · Earth observation</div>
        </div>
        <div className="text-right leading-relaxed">
          <div className="tnum">ALT 705 km · LEO</div>
          <div className="tnum">REV 14.9 / day</div>
        </div>
      </div>

      {/* headline block, anchored low like a film title card */}
      <div className="relative z-10 mx-auto mt-auto w-full max-w-7xl px-4 pb-24 pt-48 sm:px-6 lg:px-8 lg:pb-28">
        <Reveal>
          <p className="corners-faint relative inline-block px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-green-400">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <h1 className="mt-5 max-w-4xl font-serif text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            {headline}
          </h1>
        </Reveal>
        {body && (
          <Reveal delay={0.24}>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              {body}
            </p>
          </Reveal>
        )}
      </div>

      {/* scroll cue */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
          scroll
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          {!reduce && (
            <span className="animate-scroll-cue absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-transparent via-green-400/80 to-green-400" />
          )}
        </span>
      </div>
    </section>
  );
}
