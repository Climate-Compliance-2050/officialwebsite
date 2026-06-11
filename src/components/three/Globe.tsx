"use client";

import dynamic from "next/dynamic";

/** Client-only loader for the Three.js globe (no SSR, no layout shift). */
export const Globe = dynamic(() => import("./GlobeScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center" aria-hidden>
      <div className="h-64 w-64 animate-pulse rounded-full bg-blue-900/30 blur-2xl sm:h-80 sm:w-80" />
    </div>
  ),
});
