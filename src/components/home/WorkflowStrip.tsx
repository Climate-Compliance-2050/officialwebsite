"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { workflow } from "@/content/site";
import { servicesPage } from "@/content/ecosystem";

/** Accent ramp across the lifecycle: origination green → regulatory blue. */
const ACCENTS = ["#00b050", "#0fa45a", "#16a36a", "#2c8bca", "#317ec0", "#345faa"];

/** Dial geometry: node i sits on a circle of radius 41 (viewBox units), 12 o'clock first. */
const NODE_POS = workflow.steps.map((_, i) => {
  const angle = (i / workflow.steps.length) * Math.PI * 2;
  return {
    left: `${50 + 41 * Math.sin(angle)}%`,
    top: `${50 - 41 * Math.cos(angle)}%`,
  };
});

/** Each label sits on the inward side of its node so nothing escapes the dial. */
const LABEL_POS = [
  "left-1/2 top-full mt-2.5 -translate-x-1/2 text-center",
  "right-full top-1/2 mr-3 -translate-y-1/2 text-right",
  "right-full top-1/2 mr-3 -translate-y-1/2 text-right",
  "bottom-full left-1/2 mb-2.5 -translate-x-1/2 text-center",
  "left-full top-1/2 ml-3 -translate-y-1/2 text-left",
  "left-full top-1/2 ml-3 -translate-y-1/2 text-left",
];

export function WorkflowStrip() {
  const steps = workflow.steps;
  const n = steps.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const dialRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(dialRef, { margin: "-15% 0px" });

  // Ambient auto-advance around the dial until the visitor takes over.
  useEffect(() => {
    if (paused || reduce || !inView) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), 4000);
    return () => clearInterval(id);
  }, [paused, reduce, inView, n]);

  const select = (i: number) => {
    setPaused(true);
    setActive(((i % n) + n) % n);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next = active;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (active + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (active - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    select(next);
    nodeRefs.current[next]?.focus();
  };

  const accent = ACCENTS[active];
  const stageName = steps[active].name;
  // Studies offered at the active lifecycle phase (single source of truth: the funnel).
  const stageStudies = servicesPage.studies.filter((s) => s.stage === stageName);

  return (
    <section className="hairline-top relative overflow-hidden bg-slate-50 py-20 lg:py-28">
      {/* faint blueprint grid, light register of the dark-section grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#0a1628 1px, transparent 1px), linear-gradient(90deg, #0a1628 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      {/* oversized brand aperture watermark, drifting */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-44 -top-44 h-[34rem] w-[34rem] opacity-[0.05] motion-safe:animate-spin-slower"
      >
        <Image src="/brand/mark.webp" alt="" fill sizes="544px" className="object-contain" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={workflow.eyebrow}
          headline={workflow.headline}
          body={workflow.body}
        />

        <div className="mt-14 grid items-center gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          {/* ── Lifecycle dial: stages orbit the brand mark ───────────── */}
          <Reveal className="lg:col-span-5">
            <div
              ref={dialRef}
              role="tablist"
              aria-label="Asset lifecycle stages"
              onKeyDown={onKeyDown}
              className="relative mx-auto aspect-square w-full max-w-[26rem] select-none"
            >
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
                <circle cx="50" cy="50" r="41" fill="none" stroke="rgba(10,22,40,0.1)" strokeWidth="0.6" />
                {/* segments completed so far, swept clockwise from 12 o'clock */}
                <circle
                  cx="50"
                  cy="50"
                  r="41"
                  fill="none"
                  stroke={accent}
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  pathLength={100}
                  strokeDasharray={`${((active + 1) / n) * 100} 100`}
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dasharray 0.6s ease, stroke 0.6s ease" }}
                />
              </svg>

              <div
                aria-hidden
                className="absolute inset-[34%] rounded-full border border-dashed border-navy-900/15 motion-safe:animate-lock"
              />

              {/* brand mark hub with live stage readout */}
              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <Image
                  src="/brand/mark.webp"
                  alt="C2050"
                  width={72}
                  height={72}
                  className="h-14 w-14 drop-shadow-sm sm:h-[72px] sm:w-[72px]"
                />
                <span className="tnum mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-navy-900/45">
                  Stage {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                </span>
              </div>

              {steps.map((step, i) => {
                const isActive = i === active;
                const a = ACCENTS[i];
                return (
                  <button
                    key={step.name}
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`stage-tab-${i}`}
                    aria-selected={isActive}
                    aria-controls="stage-panel"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => select(i)}
                    className="tnum absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-semibold outline-none transition-all duration-300"
                    style={{
                      ...NODE_POS[i],
                      backgroundColor: isActive ? a : "#ffffff",
                      color: isActive ? "#ffffff" : "rgba(10,22,40,0.55)",
                      border: `1px solid ${isActive ? a : "rgba(10,22,40,0.15)"}`,
                      boxShadow: isActive
                        ? `0 0 0 6px ${a}1f, 0 8px 20px ${a}33`
                        : "0 1px 2px rgba(10,22,40,0.08)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                    <span
                      className={`pointer-events-none absolute w-max max-w-[7.5rem] text-[10px] font-semibold uppercase leading-tight tracking-[0.14em] transition-colors duration-300 ${LABEL_POS[i]}`}
                      style={{ color: isActive ? "#0a1628" : "rgba(10,22,40,0.45)" }}
                    >
                      {step.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* ── Stage dossier ──────────────────────────────────────────── */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <div
              id="stage-panel"
              role="tabpanel"
              aria-labelledby={`stage-tab-${active}`}
              className="corners relative flex flex-col border border-navy-900/10 bg-white p-7 shadow-sm sm:p-9 lg:min-h-[22rem]"
              style={{ ["--corner-color" as string]: accent }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex flex-1 flex-col"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block h-3.5 w-[3px]"
                      style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }}
                      aria-hidden
                    />
                    <span className="tnum text-xs font-semibold uppercase tracking-[0.2em] text-navy-900/45">
                      Stage {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-navy-900 sm:text-[1.7rem]">
                    {steps[active].name}
                  </h3>
                  <p className="mt-3 max-w-prose text-[0.95rem] leading-7 text-navy-900/65">
                    {steps[active].body}
                  </p>

                  {stageStudies.length > 0 && (
                    <div className="mt-6 border-t border-navy-900/8 pt-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-900/40">
                        Studies at this stage
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {stageStudies.map((study) => (
                          <li
                            key={study.name}
                            className="rounded-sm border border-navy-900/10 bg-slate-50 px-3 py-1.5 text-xs font-medium text-navy-900/75"
                          >
                            {study.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Link
                    href="/services"
                    className="group mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-green-700 transition-colors hover:text-green-600"
                  >
                    {stageStudies.length > 0 ? `Explore ${stageName} studies` : "See all studies"}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-14 text-center">
          <ButtonLink href="/services" variant="secondary" arrow>
            See all services
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
