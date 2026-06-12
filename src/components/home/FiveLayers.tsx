"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronRight, ArrowDown, Layers } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fiveLayers } from "@/content/site";

/** Accent ramp: Territory (earth green) → Science (regulatory blue). */
const ACCENTS = ["#00b050", "#16a36a", "#2c8bca", "#317ec0", "#345faa"];

export function FiveLayers() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const layers = fiveLayers.layers;
  const n = layers.length;

  const select = (i: number) => setActive(((i % n) + n) % n);

  // Up/Down (and Left/Right) move through the stack, like a real listbox.
  const onKeyDown = (e: React.KeyboardEvent) => {
    let next = active;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (active + 1) % n;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (active - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    setActive(next);
    rowRefs.current[next]?.focus();
  };

  return (
    <section className="dark-section grain relative overflow-hidden bg-navy-950 py-20 text-white lg:py-28">
      {/* faint technical grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={fiveLayers.eyebrow}
          headline={fiveLayers.headline}
          body={fiveLayers.body}
          dark
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Layer stack: the single control surface */}
          <div className="lg:col-span-5">
            <div className="mb-3 flex items-center justify-between font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">
              <span>Intelligence stack</span>
              <span className="tnum">05 layers</span>
            </div>

            <div
              role="tablist"
              aria-label="Intelligence layers"
              aria-orientation="vertical"
              onKeyDown={onKeyDown}
              className="flex flex-col gap-px overflow-hidden rounded-sm border border-white/10 bg-white/[0.02]"
            >
              {layers.map((layer, i) => {
                const isActive = active === i;
                const accent = ACCENTS[i];
                return (
                  <motion.button
                    key={layer.name}
                    ref={(el) => {
                      rowRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`layer-tab-${i}`}
                    aria-selected={isActive}
                    aria-controls="layer-panel"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => select(i)}
                    onMouseEnter={() => select(i)}
                    onFocus={() => select(i)}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4, delay: i * 0.07, ease: "easeOut" }}
                    className="group relative flex items-center gap-4 px-4 py-4 text-left transition-colors duration-200 outline-none sm:px-5"
                    style={{
                      backgroundColor: isActive ? "rgba(255,255,255,0.07)" : "transparent",
                    }}
                  >
                    {/* accent rail: grows when active */}
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 transition-all duration-300"
                      style={{
                        width: isActive ? 4 : 2,
                        backgroundColor: accent,
                        opacity: isActive ? 1 : 0.45,
                        boxShadow: isActive ? `0 0 16px ${accent}` : "none",
                      }}
                    />

                    {/* tabular layer index */}
                    <span
                      className="tnum w-7 shrink-0 text-sm font-semibold tabular-nums transition-colors duration-200"
                      style={{ color: isActive ? accent : "rgba(255,255,255,0.55)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className="block text-base font-semibold transition-colors duration-200"
                        style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.8)" }}
                      >
                        {layer.name}
                      </span>
                      <span className="block truncate text-xs text-white/60">{layer.title}</span>
                    </span>

                    <ChevronRight
                      aria-hidden
                      className="h-4 w-4 shrink-0 transition-all duration-200"
                      style={{
                        color: accent,
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? "translateX(0)" : "translateX(-6px)",
                      }}
                    />
                  </motion.button>
                );
              })}
            </div>

            {/* convergence cue */}
            <div className="mt-4 flex items-center gap-2 pl-1 text-xs text-white/60">
              <ArrowDown className="h-3.5 w-3.5 text-green-400" aria-hidden />
              <span>All five resolve into one asset view</span>
            </div>
          </div>

          {/* Detail readout + outcome */}
          <div className="lg:col-span-7">
            <div
              id="layer-panel"
              role="tabpanel"
              aria-labelledby={`layer-tab-${active}`}
              className="corners relative min-h-[13rem] border border-white/10 bg-white/[0.03] p-7 sm:p-8"
              style={{ ["--corner-color" as string]: ACCENTS[active] }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block h-3.5 w-[3px]"
                      style={{ backgroundColor: ACCENTS[active], boxShadow: `0 0 12px ${ACCENTS[active]}` }}
                      aria-hidden
                    />
                    <span className="tnum font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
                      Layer {String(active + 1).padStart(2, "0")} / 05 · {layers[active].name}
                    </span>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight">{layers[active].title}</h3>
                  <p className="mt-3 max-w-prose text-[0.95rem] leading-7 text-white/70">
                    {layers[active].body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* outcome: the integrated result of all five layers */}
            <div className="mt-5 flex items-start gap-4 border border-green-500/30 bg-green-500/[0.08] p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-green-500">
                <Layers className="h-5 w-5 text-white" aria-hidden />
              </span>
              <div>
                <h3 className="text-base font-semibold text-green-300">{fiveLayers.outcome.name}</h3>
                <p className="mt-1.5 text-sm leading-6 text-white/70">{fiveLayers.outcome.body}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
