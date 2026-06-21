"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { type InstrumentType, type PipelineItem } from "@/content/global";
import { Flag } from "./Flag";
import { TypeCode, TypeEdge, TypeTick } from "./TypeMark";

type Filter = "ALL" | InstrumentType;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "ETS", label: "ETS" },
  { id: "TAX", label: "Carbon tax" },
  { id: "OTHER", label: "Other" },
];

const typesOf = (t: PipelineItem["type"]) => (Array.isArray(t) ? t : [t]);

export function PipelineGrid({ items }: { items: PipelineItem[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: items.length, ETS: 0, TAX: 0, OTHER: 0 };
    for (const it of items) for (const t of typesOf(it.type)) c[t] += 1;
    return c;
  }, [items]);

  const shown = items.filter((it) => filter === "ALL" || typesOf(it.type).includes(filter));

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((it) => (
          <motion.div
            key={it.jurisdiction}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="reticle relative flex flex-col border border-navy-900/10 bg-white p-4 pl-5"
          >
            <TypeEdge types={typesOf(it.type)} />
            <div className="flex items-start gap-2.5">
              <Flag cc={it.cc} title={it.jurisdiction} className="mt-0.5 h-3.5 w-5 shrink-0" />
              <span className="flex-1 text-sm font-semibold leading-5 text-navy-900">
                {it.jurisdiction}
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                {typesOf(it.type).map((t) => (
                  <TypeCode key={t} type={t} />
                ))}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-navy-900/65">{it.detail}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
