"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { Globe } from "@/components/three/Globe";
import { hero, monitor, stats } from "@/content/site";
import {
  MONITOR_SITES,
  formatLonLat,
  type MonitorSite,
  type GovCheck,
} from "@/content/monitor";

/** Dwell time per coordinate in the inspector, ms. */
const DWELL = 3600;

/** Status colour + glyph for a governing-law check. */
const TONE: Record<GovCheck["tone"], { text: string; mark: string }> = {
  ok: { text: "text-green-300", mark: "✓" },
  review: { text: "text-blue-300", mark: "◔" },
  watch: { text: "text-white/45", mark: "◇" },
};

/**
 * Jurisdiction Inspector — the hero's differentiator made literal: a coordinate
 * resolves into the laws that govern it. Cycles through monitored territories,
 * in lockstep with the globe's active marker.
 */
function Inspector({ site, reduce }: { site: MonitorSite; reduce: boolean | null }) {
  return (
    <div className="relative border-t border-white/10 px-4 py-3">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={site.name}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: [0.21, 0.65, 0.36, 1] }}
        >
          <div className="mb-2.5 flex items-baseline justify-between gap-3">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-white/90">
              {site.name}
            </h3>
            {site.share != null && (
              <span className="tnum shrink-0 font-mono text-[10px] text-green-300/90">
                {site.share.toFixed(1)}%<span className="ml-1 text-white/35">of BR</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-[3.5rem_1fr] gap-y-1 font-mono text-[10px] uppercase tracking-wider">
            <span className="text-white/35">Coord</span>
            <span className="tnum text-white/80">{formatLonLat(site.lonLat)}</span>
            <span className="text-white/35">Jurisd.</span>
            <span className="text-white/80">{site.jurisdiction}</span>
          </div>

          <p className="mt-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
            Governed by
            <span className="h-px flex-1 bg-white/10" aria-hidden />
          </p>

          <ul className="mt-1.5 space-y-1">
            {site.governedBy?.map((c) => {
              const tone = TONE[c.tone];
              return (
                <li
                  key={c.label}
                  className="flex items-center justify-between gap-3 text-[11px]"
                >
                  <span className="flex items-center gap-1.5 text-white/65">
                    <span className="text-white/25" aria-hidden>
                      ▸
                    </span>
                    {c.label}
                  </span>
                  <span
                    className={`flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide ${tone.text}`}
                  >
                    {c.state}
                    <span aria-hidden>{tone.mark}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </AnimatePresence>

      {/* dwell meter — quiet proof the monitor is sweeping */}
      {!reduce && (
        <div className="mt-3 h-px w-full overflow-hidden bg-white/5">
          <motion.div
            key={site.name}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: DWELL / 1000, ease: "linear" }}
            className="h-full bg-green-400/55"
          />
        </div>
      )}
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.1 + i * 0.12, ease: [0.21, 0.65, 0.36, 1] as const },
  }),
};

export function Hero() {
  const reduce = useReducedMotion();

  // Cycle the six Brazil biomes; hubs and overseas sites stay static on the globe.
  const inspectable = useMemo(
    () => MONITOR_SITES.map((site, index) => ({ site, index })).filter((s) => s.site.biome),
    [],
  );
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStep((n) => (n + 1) % inspectable.length), DWELL);
    return () => clearInterval(id);
  }, [reduce, inspectable.length]);

  const active = inspectable[step];

  return (
    <section className="dark-section grain relative overflow-hidden bg-navy-950 text-white">
      {/* backdrop: single glow + faint grid — quiet, technical */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-blue-800/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        {/* aperture watermark — the C2050 lens, slow ambient rotation */}
        <motion.div
          className="absolute -right-24 top-1/2 h-[44rem] w-[44rem] -translate-y-1/2 opacity-[0.04]"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={reduce ? undefined : { duration: 220, ease: "linear", repeat: Infinity }}
        >
          <Image
            src="/brand/mark-white.webp"
            alt=""
            fill
            sizes="44rem"
            className="object-contain"
            priority={false}
          />
        </motion.div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-6 lg:px-8 lg:pb-24 lg:pt-36">
        {/* Copy */}
        <div className="max-w-xl">
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-green-300/90"
          >
            {hero.eyebrow}
          </motion.p>
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-5 text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.6rem]"
          >
            {hero.headline}
          </motion.h1>
          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-6 text-base leading-7 text-white/70 sm:text-lg sm:leading-8"
          >
            {hero.subheadline}
          </motion.p>
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-9 flex flex-wrap gap-4"
          >
            <ButtonLink href={hero.primaryCta.href} arrow>
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="ghost-dark">
              {hero.secondaryCta.label}
            </ButtonLink>
          </motion.div>
          <motion.p
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-8 text-sm italic text-white/45"
          >
            {hero.caption}
          </motion.p>
        </div>

        {/* Global Asset Monitor console */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.21, 0.65, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:max-w-[30rem]"
        >
          <div className="corners corners-faint relative rounded-md border border-white/10 bg-navy-900/45 shadow-2xl shadow-navy-950/60 backdrop-blur-sm">
            {/* console header */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                {monitor.title}
              </p>
              <p className="shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] text-green-300/80">
                {monitor.survey}
              </p>
            </div>

            {/* globe viewport — its active marker tracks the inspector */}
            <div className="relative aspect-square">
              <Globe activeIndex={active.index} />
              {/* brand attribution — quiet corner stamp */}
              <span className="pointer-events-none absolute bottom-2.5 left-3 z-10 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                <Image
                  src="/brand/mark-white.webp"
                  alt=""
                  width={11}
                  height={11}
                  aria-hidden
                  className="opacity-60"
                />
                Powered by C2050
              </span>
            </div>

            {/* biome survey rail — six ticks, the cycle made visible */}
            <div className="flex items-center gap-2.5 border-t border-white/10 px-4 py-2">
              <span className="tnum shrink-0 font-mono text-[9px] text-white/35">
                {String(step + 1).padStart(2, "0")}/{String(inspectable.length).padStart(2, "0")}
              </span>
              <div className="flex flex-1 items-center gap-1">
                {inspectable.map((b, i) => (
                  <span
                    key={b.site.name}
                    className={`h-1 flex-1 transition-colors duration-500 ${
                      i === step ? "bg-green-400" : "bg-white/12"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* jurisdiction inspector: coordinate → governing law */}
            <Inspector site={active.site} reduce={reduce} />
          </div>
        </motion.div>
      </div>

      {/* stats strip */}
      <div className="hairline-top relative bg-navy-900/50">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <dt className="order-2 mt-1 text-sm text-white/55">{stat.label}</dt>
              <dd className="order-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {"value" in stat && typeof stat.value === "number" ? (
                  <Counter value={stat.value} suffix={stat.suffix ?? ""} />
                ) : (
                  stat.valueText
                )}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
