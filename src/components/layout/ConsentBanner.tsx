"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { consent } from "@/content/site";

const STORAGE_KEY = "c2050-consent";

export function ConsentBanner() {
  // null = undecided (SSR + first paint); false = dismissed; true = shown
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // Re-prompt when no record, or the accepted version is stale.
      if (!stored || JSON.parse(stored).version !== consent.version) {
        setVisible(true);
      }
    } catch {
      // localStorage blocked (private mode / SSR mismatch) — show the notice.
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: consent.version, at: new Date().toISOString() }),
      );
    } catch {
      /* storage unavailable — dismiss for this session only */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={consent.eyebrow}
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="corners grain dark-section relative mx-auto max-w-5xl border border-white/15 bg-navy-950/95 px-5 py-5 text-white shadow-2xl backdrop-blur-sm sm:px-7 sm:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="max-w-3xl">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-green-400">
              {consent.eyebrow}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/75">
              {consent.message}{" "}
              <span className="text-white/55">
                {consent.links.map((link, i) => (
                  <span key={link.href}>
                    {i > 0 && <span aria-hidden> · </span>}
                    <Link
                      href={link.href}
                      className="nav-underline text-white/80 transition-colors hover:text-green-400"
                    >
                      {link.label}
                    </Link>
                  </span>
                ))}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={accept}
            className="btn-sheen relative shrink-0 self-start border border-green-500/60 bg-green-500/10 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-green-300 transition-colors hover:bg-green-500/20 hover:text-green-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 sm:self-auto"
          >
            {consent.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
