"use client";

import { useRef, useState } from "react";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, Landmark } from "lucide-react";
import type { Study, StudyDepth } from "@/content/ecosystem";

type Filter = { id: string; label: string };

type Props = {
  studies: Study[];
  filters: Filter[];
  /** Shown when the active filter matches no studies. */
  empty: string;
};

/** Depth tiers, shallow → deep. Drives the core-sample rail and the per-card meter. */
const DEPTH_ORDER: StudyDepth[] = ["Screening", "Feasibility", "Comprehensive", "Territorial"];

const TIERS: { label: StudyDepth; bar: string }[] = [
  { label: "Screening", bar: "bg-green-200" },
  { label: "Feasibility", bar: "bg-green-400" },
  { label: "Comprehensive", bar: "bg-green-600" },
  { label: "Territorial", bar: "bg-blue-600" },
];

/** Left-edge accent: hue by audience, intensity by depth. */
const EDGE: Record<Study["audience"], string[]> = {
  project: ["bg-green-300", "bg-green-500", "bg-green-600", "bg-green-700"],
  territory: ["bg-blue-300", "bg-blue-500", "bg-blue-600", "bg-blue-700"],
};

const RAIL_H = 288; // px — keep in sync with h-72

function matches(study: Study, filter: string): boolean {
  switch (filter) {
    case "project":
      return study.audience === "project";
    case "territory":
      return study.audience === "territory";
    case "screening":
      return study.depth === "Screening";
    case "deep":
      return study.depth !== "Screening";
    default:
      return true;
  }
}

export function StudiesFunnel({ studies, filters, empty }: Props) {
  const [active, setActive] = useState("all");
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.4", "end 0.6"],
  });
  const markerY = useTransform(scrollYProgress, [0, 1], [0, RAIL_H]);

  const visible = studies.filter((s) => matches(s, active));

  return (
    <div>
      {/* Filter chips — single select, sharp corners (brand rule: no rounded-full pills). */}
      <div
        role="group"
        aria-label="Filter studies"
        className="flex flex-wrap gap-2"
      >
        {filters.map((f) => {
          const on = active === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(f.id)}
              className={`rounded-sm border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                on
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-navy-900/15 bg-white text-navy-900/65 hover:border-green-600/50 hover:text-navy-900"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-x-10 lg:grid-cols-12">
        {/* Core-sample rail — sticky depth gauge. Desktop only. */}
        <aside className="hidden lg:col-span-3 lg:block" aria-hidden>
          <div className="sticky top-28">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-navy-900/55">
              Depth of study
            </p>
            <div className="mt-5 flex gap-4">
              <div className="relative h-72 w-1.5 shrink-0 overflow-hidden rounded-sm">
                {TIERS.map((t) => (
                  <div key={t.label} className={`h-1/4 w-full ${t.bar}`} />
                ))}
                {!reduce && (
                  <motion.span
                    style={{ y: markerY }}
                    className="absolute -left-[3px] top-0 -mt-1 h-2 w-2 rotate-45 border border-white bg-navy-900 shadow-sm"
                  />
                )}
              </div>
              <ol className="flex h-72 flex-col">
                {TIERS.map((t) => (
                  <li
                    key={t.label}
                    className="flex flex-1 items-center font-mono text-[11px] uppercase tracking-wider text-navy-900/50"
                  >
                    {t.label}
                  </li>
                ))}
              </ol>
            </div>
            <p className="mt-6 max-w-[12rem] text-xs leading-5 text-navy-900/55">
              Brazil-scale: a study can resolve from a single parcel down to one
              municipality.
            </p>
          </div>
        </aside>

        {/* Studies — ordered shallow → deep (the descent). */}
        <div ref={listRef} className="lg:col-span-9">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((study) => {
              const depthIdx = DEPTH_ORDER.indexOf(study.depth);
              const edge = EDGE[study.audience][depthIdx];
              const territory = study.audience === "territory";
              return (
                <motion.article
                  key={study.code}
                  layout={!reduce}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.21, 0.65, 0.36, 1] }}
                  className={`reticle group relative mb-4 overflow-hidden rounded-sm border border-navy-900/10 bg-white shadow-sm transition-all duration-300 hover:border-navy-900/20 hover:shadow-md hover:shadow-navy-900/8 ${
                    territory ? "reticle-blue" : ""
                  }`}
                >
                  {/* depth edge: hue = audience, intensity = depth */}
                  <span aria-hidden className={`absolute inset-y-0 left-0 w-1 ${edge}`} />

                  <div className="grid gap-5 p-6 sm:grid-cols-[5.5rem_1fr] sm:gap-7 sm:p-7">
                    {/* instrument column */}
                    <div className="flex flex-row items-center gap-4 sm:flex-col sm:items-start sm:gap-5">
                      <span className="tnum font-mono text-3xl font-semibold leading-none text-navy-900/15">
                        {study.code}
                      </span>
                      {/* depth meter — four ticks, filled to this study's depth */}
                      <div className="flex items-end gap-1" aria-hidden>
                        {DEPTH_ORDER.map((_, i) => (
                          <span
                            key={i}
                            className={`w-1 rounded-sm ${
                              i <= depthIdx
                                ? territory
                                  ? "bg-blue-600"
                                  : "bg-green-600"
                                : "bg-navy-900/12"
                            }`}
                            style={{ height: `${8 + i * 4}px` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* main column */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                            territory
                              ? "bg-blue-50 text-blue-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {territory ? "Territory" : "Project"}
                        </span>
                        <span className="rounded-sm bg-navy-900/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-navy-900/55">
                          {study.depth}
                        </span>
                        {study.jurisdictional && (
                          <span className="inline-flex items-center gap-1 rounded-sm bg-blue-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-blue-700">
                            <Landmark className="h-3 w-3" aria-hidden />
                            Jurisdictional
                          </span>
                        )}
                        <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-navy-900/60">
                          <span className="text-navy-900/45">Resolves to</span>
                          {study.granularity}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-semibold tracking-tight text-navy-900">
                        {study.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-navy-900/65">{study.body}</p>

                      <div className="mt-4 border-t border-navy-900/8 pt-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-navy-900/50">
                          What you get
                        </p>
                        <p className="mt-1.5 text-sm leading-6 text-navy-900/80">
                          {study.deliverable}
                        </p>
                      </div>

                      <LocaleLink
                        href={`/contact?study=${encodeURIComponent(study.name)}`}
                        className="group/req mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 transition-colors hover:text-green-800"
                      >
                        Request this study
                        <ArrowRight
                          className="h-4 w-4 transition-transform duration-200 group-hover/req:translate-x-0.5"
                          aria-hidden
                        />
                      </LocaleLink>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>

          {visible.length === 0 && (
            <p className="rounded-sm border border-dashed border-navy-900/15 p-8 text-center text-sm text-navy-900/55">
              {empty}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
