"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { type Era, type InstrumentType, type Market } from "@/content/global";
import { Flag } from "./Flag";
import { TypeCode, TypeEdge, TypeTick } from "./TypeMark";

type Filter = "ALL" | InstrumentType;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "ETS", label: "ETS" },
  { id: "TAX", label: "Carbon tax" },
  { id: "OTHER", label: "Other" },
];

export function MarketTimeline({ eras, markets }: { eras: Era[]; markets: Market[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: markets.length, ETS: 0, TAX: 0, OTHER: 0 };
    for (const m of markets) c[m.type] += 1;
    return c;
  }, [markets]);

  const visible = (m: Market) => filter === "ALL" || m.type === filter;

  return (
    <div>
      {/* type filter */}
      <div className="mb-10 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={active}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-sm border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                active
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-navy-900/15 text-navy-900/70 hover:border-navy-900/40"
              }`}
            >
              {f.id !== "ALL" && <TypeTick type={f.id} />}
              {f.label}
              <span className={active ? "text-white/60" : "text-navy-900/40"}>{counts[f.id]}</span>
            </button>
          );
        })}
      </div>

      <ol className="relative ml-[15px] space-y-9 border-l border-navy-900/15">
        {eras.map((era, eraIdx) => {
          const eraMarkets = markets.filter((m) => m.era === era.id && visible(m));
          return (
            <li key={era.id} className="relative pl-7 sm:pl-10">
              {/* era index node, seated on the spine */}
              <span
                aria-hidden
                className={`absolute -left-[15px] top-0 flex h-[30px] w-[30px] items-center justify-center border font-mono text-[11px] font-semibold tracking-wide ${
                  era.today
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-navy-900/20 bg-white text-navy-900/70"
                }`}
              >
                <span className="tnum">{String(eraIdx + 1).padStart(2, "0")}</span>
              </span>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-sm font-semibold tracking-wide text-navy-900">
                  {era.range}
                </span>
                {era.today && (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Today
                  </span>
                )}
                <span className="ml-auto flex items-baseline gap-1.5">
                  <span className="hidden font-mono text-[10px] uppercase tracking-wider text-navy-900/40 sm:inline">
                    Coverage
                  </span>
                  <span className="tnum font-mono text-sm font-semibold text-navy-900/80">
                    {era.coverage}
                  </span>
                </span>
              </div>
              <p className="mt-1.5 text-sm font-semibold text-navy-900">{era.milestone}</p>
              <p className="mt-0.5 text-sm leading-6 text-navy-900/60">{era.note}</p>

              {eraMarkets.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {eraMarkets.map((m) => (
                    <motion.span
                      key={m.key}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: Math.min(eraIdx * 0.02, 0.1) }}
                      className="reticle relative inline-flex items-center gap-1.5 border border-navy-900/10 bg-white py-1 pl-3 pr-2"
                    >
                      <TypeEdge types={[m.type]} />
                      <Flag cc={m.cc} title={m.name} className="h-3 w-[18px]" />
                      <span className="text-xs font-medium text-navy-900">{m.name}</span>
                      <span className="tnum font-mono text-[11px] text-navy-900/45">{m.year}</span>
                      <TypeCode type={m.type} className="ml-0.5" />
                    </motion.span>
                  ))}
                </div>
              ) : era.summary && filter === "ALL" ? (
                <div className="mt-3 flex flex-wrap gap-6">
                  {era.summary.map((s) => (
                    <div key={s.label} className="min-w-[8rem]">
                      <span className="tnum font-serif text-2xl font-semibold text-navy-900">
                        {s.value}
                      </span>
                      <p className="mt-0.5 font-mono text-[10px] uppercase leading-4 tracking-wider text-navy-900/50">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 font-mono text-xs text-navy-900/35">
                  No markets match this filter
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
