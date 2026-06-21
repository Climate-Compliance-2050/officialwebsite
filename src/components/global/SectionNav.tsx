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
 * Sticky HUD index for the Global dashboard — a centered console strip that pins
 * under the navbar and scroll-spies the data sections. A hairline progress rail
 * across the bottom tracks read position through the dashboard. Horizontal +
 * scrollable on narrow viewports; no fixed-position layout cost.
 */
export function SectionNav() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  const [progress, setProgress] = useState(0);

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

  // Scroll progress across the dashboard region (first → last data section).
  useEffect(() => {
    const first = document.getElementById(SECTIONS[0].id);
    const last = document.getElementById(SECTIONS[SECTIONS.length - 1].id);
    if (!first || !last) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const start = first.offsetTop;
      const end = last.offsetTop + last.offsetHeight;
      const mid = window.scrollY + window.innerHeight / 2;
      const pct = ((mid - start) / (end - start)) * 100;
      setProgress(Math.max(0, Math.min(100, pct)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const activeIndex = SECTIONS.findIndex((s) => s.id === active);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-16 z-40 border-y border-navy-900/10 bg-white/85 backdrop-blur-md lg:top-20"
    >
      <div className="relative mx-auto flex max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <span className="pointer-events-none absolute left-4 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-navy-900/35 sm:left-6 lg:left-8 xl:flex">
          <span className="inline-block h-1 w-1 bg-green-500" />
          Index
        </span>

        <div className="flex items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SECTIONS.map((s, i) => {
            const on = active === s.id;
            const done = i < activeIndex;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={on ? "true" : undefined}
                className={`group relative flex shrink-0 items-center gap-2 px-4 py-3.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                  on
                    ? "text-green-700"
                    : "text-navy-900/55 hover:text-navy-900"
                }`}
              >
                <span
                  className={`tnum text-[11px] transition-colors ${
                    on
                      ? "text-green-600"
                      : done
                        ? "text-green-600/45"
                        : "text-navy-900/30 group-hover:text-navy-900/55"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-2 bottom-0 h-[2px] origin-center bg-green-500 transition-transform duration-200 ${
                    on ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                  }`}
                />
              </a>
            );
          })}
        </div>

        {/* Read-progress rail across the dashboard region. */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-px bg-green-500/70 transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </nav>
  );
}
