type Datum = {
  /** Horizontal position of the datum cross, CSS length (e.g. "76%"). */
  x: string;
  /** Vertical position of the datum cross, CSS length. */
  y: string;
  /** Mono coordinate label etched beside the cross. */
  label?: string;
};

type SurveyBackdropProps = {
  /** Optional survey datum: hairline rules crossing at a marked coordinate. */
  datum?: Datum;
  /** Corner tick marks at the section edges (off where a navbar or border supplies the frame). */
  ticks?: boolean;
  className?: string;
};

/**
 * Shared dark-section backdrop in the instrument language of the hero globe:
 * graticule grid, survey datum cross, corner ticks, directional light falloff.
 * Replaces decorative glow blobs and particle fields.
 */
export function SurveyBackdrop({ datum, ticks = true, className = "" }: SurveyBackdropProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* directional falloff — edge-anchored washes, no floating blobs */}
      <div className="absolute inset-0 bg-[linear-gradient(152deg,rgba(46,132,197,0.11)_0%,transparent_36%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(332deg,rgba(0,176,80,0.05)_0%,transparent_28%)]" />

      {/* graticule */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* survey datum: full-bleed rules crossing at the marked coordinate */}
      {datum && (
        <>
          <div className="absolute inset-y-0 w-px bg-white/[0.07]" style={{ left: datum.x }} />
          <div className="absolute inset-x-0 h-px bg-white/[0.07]" style={{ top: datum.y }} />
          <div
            className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2"
            style={{ left: datum.x, top: datum.y }}
          >
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-green-400/60" />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-green-400/60" />
          </div>
          {datum.label && (
            <span
              className="tnum absolute ml-3 mt-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40"
              style={{ left: datum.x, top: datum.y }}
            >
              {datum.label}
            </span>
          )}
        </>
      )}

      {/* corner ticks — the section as a surveyed plate */}
      {ticks && (
        <>
          <span className="absolute left-4 top-4 h-3 w-3 border-l border-t border-white/20" />
          <span className="absolute right-4 top-4 h-3 w-3 border-r border-t border-white/20" />
          <span className="absolute bottom-4 left-4 h-3 w-3 border-b border-l border-white/20" />
          <span className="absolute bottom-4 right-4 h-3 w-3 border-b border-r border-white/20" />
        </>
      )}
    </div>
  );
}
