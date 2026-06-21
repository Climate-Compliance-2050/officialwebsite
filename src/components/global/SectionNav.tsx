"use client";

import { useEffect, useState } from "react";

/** In-page sections, in document order. `id` must match the <section> ids on the page. */
const SECTIONS = [
  { id: "coverage", label: "Coverage" },
  { id: "timeline", label: "Timeline" },
  { id: "outlook", label: "Outlook" },
  { id: "pipeline", label: "Pipeline" },
] as const;

/**
 * Sticky HUD index for the Global dashboard — a slim console strip that pins
 * under the navbar and scroll-spies the data sections. Horizontal + scrollable
 * on narrow viewports; no fixed-position layout cost.
 */
export function SectionNav() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // Activate the section whose top crosses the ~40% line of the viewport.
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-16 z-40 border-y border-navy-900/10 bg-white/85 backdrop-blur-md lg:top-20"
    >
      <div className="mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <span className="mr-4 hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-navy-900/35 sm:inline">
          Index
        </span>
        <div className="flex flex-1 items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SECTIONS.map((s, i) => {
            const on = active === s.id;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={on ? "true" : undefined}
                className={`relative shrink-0 px-3 py-3.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                  on ? "text-green-700" : "text-navy-900/55 hover:text-navy-900"
                }`}
              >
                <span className={`mr-1.5 tnum ${on ? "text-green-600/70" : "text-navy-900/30"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-3 bottom-0 h-[2px] origin-left bg-green-500 transition-transform duration-200 ${
                    on ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
