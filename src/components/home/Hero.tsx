"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { Globe } from "@/components/three/Globe";
import { hero, stats } from "@/content/site";
import { MONITOR_SITES, formatLonLat } from "@/content/monitor";

/** Cycles through monitored-site coordinates in the console footer. */
function CoordTicker() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % MONITOR_SITES.length), 3200);
    return () => clearInterval(id);
  }, [reduce]);

  const site = MONITOR_SITES[index];
  return (
    <span className="tnum relative inline-flex h-4 items-center overflow-hidden text-white/45">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={site.name}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="whitespace-nowrap"
        >
          {site.name.toUpperCase()} · {formatLonLat(site.lonLat)}
        </motion.span>
      </AnimatePresence>
    </span>
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
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-6 lg:px-8 lg:pb-24 lg:pt-36">
        {/* Copy */}
        <div className="max-w-xl">
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]"
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
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                Global Asset Monitor
              </p>
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-green-300">
                Live
              </span>
            </div>

            {/* globe viewport */}
            <div className="relative aspect-square">
              <Globe />
            </div>

            {/* legend + coordinate ticker */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-t border-white/10 px-4 py-2.5 text-[10px] uppercase tracking-wider">
              <ul className="flex items-center gap-3.5 text-white/50">
                <li className="flex items-center gap-1.5">
                  <span className="h-px w-3.5 bg-green-400" aria-hidden />
                  Hubs
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-px w-3.5 bg-blue-300" aria-hidden />
                  Territories
                </li>
                <li className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 border border-green-400/60 bg-green-400/15"
                    aria-hidden
                  />
                  Evidence grid
                </li>
              </ul>
              <CoordTicker />
            </div>
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
