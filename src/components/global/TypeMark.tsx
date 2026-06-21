import { type InstrumentType, typeColor } from "@/content/global";

/**
 * Instrument-type marker = a ledger margin rule. Color rides a left-edge bar on
 * the chip/card (like a file tab), never on body text or as a dot. The type code
 * itself stays muted ink, so the signal is never color-only.
 */

/**
 * Left-edge color bar for a chip/card. One segment per type, top-to-bottom in
 * reading order (so a 2-type card reads ETS over TAX). Drop into a `relative`
 * parent; it overlays the left border.
 */
export function TypeEdge({ types, className = "" }: { types: InstrumentType[]; className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 left-0 flex w-[3px] flex-col ${className}`}
    >
      {types.map((t, i) => (
        <span key={i} className="flex-1" style={{ backgroundColor: typeColor[t] }} />
      ))}
    </span>
  );
}

/** Small standalone tick of the ledger rule — for filter buttons and legend swatches. */
export function TypeTick({
  type,
  className = "h-3 w-[3px]",
}: {
  type: InstrumentType;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 ${className}`}
      style={{ backgroundColor: typeColor[type] }}
    />
  );
}

/** The type code set as a quiet mono tag (no fill). Pairs with a rule for color. */
export function TypeCode({ type, className = "" }: { type: InstrumentType; className?: string }) {
  return (
    <span
      className={`font-mono text-[10px] font-semibold uppercase leading-none tracking-wider text-navy-900/45 ${className}`}
    >
      {type}
    </span>
  );
}
