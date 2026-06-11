"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ecosystemPage } from "@/content/ecosystem";

const SPIN_SECONDS = 140;

/**
 * Counsel-mandated hub-and-spoke: C2050 platform at center, qualified
 * ecosystem actors in controlled orbit (not a logo cloud).
 */
export function EcosystemOrbit() {
  const reduce = useReducedMotion();
  const actors = ecosystemPage.actors;
  const inner = actors.slice(0, 5);
  const outer = actors.slice(5);

  return (
    <>
      {/* Orbit diagram — desktop/tablet */}
      <div
        className="relative mx-auto mt-4 hidden aspect-square w-full max-w-3xl md:block"
        aria-hidden
      >
        {/* rings */}
        <div className="absolute inset-[24%] rounded-full border border-white/10" />
        <div className="absolute inset-[4%] rounded-full border border-white/10" />
        <div className="absolute inset-[14%] rounded-full border border-dashed border-green-400/15" />

        {/* center hub */}
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border border-green-400/40 bg-navy-900 shadow-[0_0_60px_rgba(0,176,80,0.25)]">
            <Image src="/brand/mark-white.webp" alt="" width={44} height={44} />
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-green-300">
              Platform
            </span>
          </div>
        </div>

        {/* inner orbit */}
        <OrbitRing
          items={inner}
          radiusPct={26}
          duration={SPIN_SECONDS}
          reverse={false}
          reduce={!!reduce}
        />
        {/* outer orbit */}
        <OrbitRing
          items={outer}
          radiusPct={46}
          duration={SPIN_SECONDS * 1.4}
          reverse
          reduce={!!reduce}
        />
      </div>

      {/* Grid fallback — mobile */}
      <ul className="mt-10 grid grid-cols-2 gap-3 md:hidden">
        {actors.map((actor) => (
          <li
            key={actor.label}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3"
          >
            <BrandIcon name={actor.icon} tone="green" className="!h-9 !w-9 !rounded-lg" />
            <span className="text-xs font-medium text-white/85">{actor.label}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

function OrbitRing({
  items,
  radiusPct,
  duration,
  reverse,
  reduce,
}: {
  items: { label: string; icon: Parameters<typeof BrandIcon>[0]["name"] }[];
  radiusPct: number;
  duration: number;
  reverse: boolean;
  reduce: boolean;
}) {
  const spin = reverse ? -360 : 360;
  return (
    <motion.div
      className="absolute inset-0"
      animate={reduce ? undefined : { rotate: spin }}
      transition={reduce ? undefined : { duration, repeat: Infinity, ease: "linear" }}
    >
      {items.map((actor, i) => {
        const angle = (i / items.length) * 2 * Math.PI - Math.PI / 2;
        const x = 50 + radiusPct * Math.cos(angle);
        const y = 50 + radiusPct * Math.sin(angle);
        return (
          <div
            key={actor.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <motion.div
              animate={reduce ? undefined : { rotate: -spin }}
              transition={reduce ? undefined : { duration, repeat: Infinity, ease: "linear" }}
              className="flex w-36 items-center gap-2.5 rounded-xl border border-white/12 bg-navy-900/90 px-3 py-2.5 shadow-lg shadow-navy-950/50 backdrop-blur-sm"
            >
              <BrandIcon name={actor.icon} tone={reverse ? "blue" : "green"} className="!h-8 !w-8 !rounded-lg" />
              <span className="text-[11px] font-medium leading-tight text-white/85">
                {actor.label}
              </span>
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
}
