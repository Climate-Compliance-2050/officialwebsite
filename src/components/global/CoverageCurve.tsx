"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import Image from "next/image";
import { animate, motion, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import { type CoveragePoint } from "@/content/global";

// viewBox geometry — the SVG scales to its container, so labels stay proportional.
const VB_W = 840;
const VB_H = 380;
const PAD = { left: 46, right: 22, top: 26, bottom: 42 };
const PLOT_W = VB_W - PAD.left - PAD.right;
const PLOT_H = VB_H - PAD.top - PAD.bottom;
const Y_MAX = 100;

const mid = (p: number | [number, number]) => (Array.isArray(p) ? (p[0] + p[1]) / 2 : p);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function CoverageCurve({ points }: { points: CoveragePoint[] }) {
  const reduce = useReducedMotion();
  const rootRef = useRef<SVGSVGElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.35 });
  // Active scrub point — set by pointer hover or keyboard arrows on the chart.
  const [active, setActive] = useState<number | null>(null);

  const n = points.length;
  const todayIdx = Math.max(0, points.findIndex((p) => p.today));

  // React's onFocus/onBlur don't fire on SVG here, so wire focus natively: landing on the
  // chart lights the reticle at today; leaving clears it.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onFocus = () => setActive((a) => (a == null ? todayIdx : a));
    const onBlur = () => setActive(null);
    el.addEventListener("focusin", onFocus);
    el.addEventListener("focusout", onBlur);
    return () => {
      el.removeEventListener("focusin", onFocus);
      el.removeEventListener("focusout", onBlur);
    };
  }, [todayIdx]);

  // Keyboard scrub: the chart is one tab stop; arrows step the reticle across points.
  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const cur = active ?? todayIdx;
      setActive(clamp(cur + (e.key === "ArrowRight" ? 1 : -1), 0, n - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(n - 1);
    } else if (e.key === "Escape") {
      setActive(null);
    }
  };
  const x = (i: number) => PAD.left + (PLOT_W * i) / (n - 1);
  const y = (pct: number) => PAD.top + (1 - pct / Y_MAX) * PLOT_H;
  const baseline = y(0);

  const firstProj = points.findIndex((p) => p.projected);
  const histEnd = firstProj - 1; // last realized point (today)

  // Stagger each value label's count-up so it lands as the line reaches it.
  const delayFor = (i: number) =>
    i < firstProj ? (i / (firstProj - 1)) * 1.0 : 1.0 + (i - firstProj + 1) * 0.15;

  // Realized line + area (solid green).
  const histPts = points.slice(0, firstProj);
  const histLine = histPts.map((p, i) => `${x(i)},${y(mid(p.pct))}`).join(" ");
  const histArea = `${x(0)},${baseline} ${histLine} ${x(histEnd)},${baseline}`;

  // Projection band (blue), anchored at today so it grows out of the realized line.
  const bandTop = points
    .slice(histEnd)
    .map((p, k) => `${x(histEnd + k)},${y(Array.isArray(p.pct) ? p.pct[1] : p.pct)}`)
    .join(" ");
  const bandBottomArr = points.slice(histEnd).map((p, k) => ({
    x: x(histEnd + k),
    y: y(Array.isArray(p.pct) ? p.pct[0] : p.pct),
  }));
  const bandBottom = [...bandBottomArr].reverse().map((q) => `${q.x},${q.y}`).join(" ");
  const projLine = points
    .slice(histEnd)
    .map((p, k) => `${x(histEnd + k)},${y(mid(p.pct))}`)
    .join(" ");

  const gridVals = [0, 25, 50, 75, 100];
  const divX = (x(histEnd) + x(histEnd + 1)) / 2;

  return (
    <div
      className="corners corners-blue relative border border-navy-900/10 bg-white p-3 sm:p-5"
      onPointerLeave={() => setActive(null)}
    >
      <svg
        ref={rootRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="h-auto w-full touch-none outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
        role="img"
        aria-label="Line chart: share of world GHG emissions under regulated carbon pricing, ~0% in 1992 rising to ~29% in 2026, projected to ~75–90% by 2050. Use arrow keys to read each point."
        preserveAspectRatio="xMidYMid meet"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <defs>
          <linearGradient id="cc-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00b050" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#00b050" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* gridlines + y labels */}
        {gridVals.map((g) => (
          <g key={g}>
            <line
              x1={PAD.left}
              x2={VB_W - PAD.right}
              y1={y(g)}
              y2={y(g)}
              stroke="#0a1628"
              strokeOpacity={g === 0 ? 0.25 : 0.08}
              strokeWidth="1"
            />
            <text
              x={PAD.left - 8}
              y={y(g) + 3}
              textAnchor="end"
              className="fill-navy-900/55 font-mono"
              style={{ fontSize: 10 }}
            >
              {g}%
            </text>
          </g>
        ))}

        {/* history / projection divider */}
        <line
          x1={divX}
          x2={divX}
          y1={PAD.top}
          y2={baseline}
          stroke="#345faa"
          strokeOpacity="0.4"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <text
          x={divX + 6}
          y={PAD.top + 10}
          className="fill-blue-600 font-mono"
          style={{ fontSize: 9, letterSpacing: "0.08em" }}
        >
          PROJECTION
        </text>

        {/* realized area + line */}
        <polygon points={histArea} fill="url(#cc-area)" />
        <motion.polyline
          points={histLine}
          fill="none"
          stroke="#00984a"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={reduce ? undefined : { pathLength: 0 }}
          whileInView={reduce ? undefined : { pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />

        {/* projection band + centre line */}
        <motion.polygon
          points={`${bandTop} ${bandBottom}`}
          fill="#345faa"
          fillOpacity="0.12"
          initial={reduce ? undefined : { opacity: 0 }}
          whileInView={reduce ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: reduce ? 0 : 0.9 }}
        />
        <polyline
          points={projLine}
          fill="none"
          stroke="#345faa"
          strokeWidth="2"
          strokeDasharray="5 4"
          strokeLinecap="round"
        />

        {/* markers + value labels */}
        {points.map((p, i) => {
          const cy = y(mid(p.pct));
          const cx = x(i);
          return (
            <g key={p.label}>
              {p.today ? (
                <>
                  <circle cx={cx} cy={cy} r="6" fill="#00b050" stroke="#fff" strokeWidth="2" />
                  <circle cx={cx} cy={cy} r="11" fill="none" stroke="#00b050" strokeOpacity="0.35" strokeWidth="1.5" />
                </>
              ) : p.projected ? (
                <circle cx={cx} cy={cy} r="3.5" fill="#fff" stroke="#345faa" strokeWidth="2" />
              ) : (
                <circle cx={cx} cy={cy} r="3.5" fill="#00984a" stroke="#fff" strokeWidth="1.5" />
              )}
              <PctLabel
                point={p}
                cx={cx}
                cy={cy}
                start={inView}
                reduce={!!reduce}
                delay={delayFor(i)}
              />
              <text
                x={cx}
                y={VB_H - PAD.bottom + 18}
                textAnchor="middle"
                className={`font-mono ${active === i ? "fill-navy-900" : "fill-navy-900/55"}`}
                style={{ fontSize: 10, fontWeight: active === i ? 600 : 400 }}
              >
                {p.label}
              </text>
            </g>
          );
        })}

        {/* scrub reticle — crosshair + readout plaque for the active point */}
        {active !== null && <ScrubReticle point={points[active]} cx={x(active)} cy={y(mid(points[active].pct))} baseline={baseline} />}

        {/* invisible hotspots — pointer targets, one per point (keyboard is handled on the svg) */}
        <g>
          {points.map((p, i) => {
            const left = i === 0 ? PAD.left : (x(i - 1) + x(i)) / 2;
            const right = i === n - 1 ? VB_W - PAD.right : (x(i) + x(i + 1)) / 2;
            return (
              <rect
                key={p.label}
                x={left}
                y={PAD.top}
                width={Math.max(0, right - left)}
                height={PLOT_H}
                fill="transparent"
                style={{ cursor: "crosshair" }}
                onPointerEnter={() => setActive(i)}
              />
            );
          })}
        </g>
      </svg>

      {/* plate stamp — aperture mark seated like a survey plate's signature */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-7 right-4 h-14 w-14 opacity-[0.07] motion-safe:animate-spin-slower"
      >
        <Image src="/brand/mark.webp" alt="" fill sizes="56px" className="object-contain" />
      </div>

      {/* announces the focused point as the keyboard scrub moves */}
      <p className="sr-only" aria-live="polite">
        {active !== null &&
          `${points[active].label}: ${
            Array.isArray(points[active].pct)
              ? `${(points[active].pct as [number, number])[0]}–${(points[active].pct as [number, number])[1]}%`
              : `${points[active].pct}%`
          } ${points[active].today ? "today" : points[active].projected ? "projected" : "realized"}`}
      </p>
    </div>
  );
}

/* Value label that counts up from 0 to its final figure when scrolled into view. */
function PctLabel({
  point,
  cx,
  cy,
  start,
  reduce,
  delay,
}: {
  point: CoveragePoint;
  cx: number;
  cy: number;
  start: boolean;
  reduce: boolean;
  delay: number;
}) {
  const isRange = Array.isArray(point.pct);
  const lo = isRange ? (point.pct as [number, number])[0] : (point.pct as number);
  const hi = isRange ? (point.pct as [number, number])[1] : (point.pct as number);
  const fmt = (t: number) =>
    isRange ? `${Math.round(lo * t)}–${Math.round(hi * t)}%` : `${Math.round(hi * t)}%`;

  const mv = useMotionValue(reduce ? 1 : 0);
  const [disp, setDisp] = useState(fmt(reduce ? 1 : 0));

  useEffect(() => {
    if (reduce) {
      setDisp(fmt(1));
      return;
    }
    if (!start) return;
    const unsub = mv.on("change", (t) => setDisp(fmt(t)));
    const controls = animate(mv, 1, { duration: 0.7, delay, ease: "easeOut" });
    return () => {
      controls.stop();
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, reduce]);

  return (
    <text
      x={cx}
      y={cy - 12}
      textAnchor="middle"
      className={point.projected ? "fill-blue-600 font-mono" : "fill-navy-900 font-mono"}
      style={{ fontSize: 10, fontWeight: 600 }}
    >
      {disp}
    </text>
  );
}

/* Crosshair hairlines + reticle brackets + readout plaque for the hovered/focused point. */
function ScrubReticle({
  point,
  cx,
  cy,
  baseline,
}: {
  point: CoveragePoint;
  cx: number;
  cy: number;
  baseline: number;
}) {
  const accent = point.projected ? "#345faa" : "#00b050";
  const valStr = Array.isArray(point.pct) ? `${point.pct[0]}–${point.pct[1]}%` : `${point.pct}%`;
  const status = point.today ? "Today" : point.projected ? "Projected" : "Realized";
  const meta = `${point.label} · ${status}`;

  const boxH = 30;
  const boxW = Math.max(meta.length * 5.4, valStr.length * 8) + 16;
  const above = cy > PAD.top + boxH + 18;
  const by = above ? cy - 14 - boxH : cy + 14;
  const bx = clamp(cx - boxW / 2, PAD.left + 2, VB_W - PAD.right - boxW - 2);

  return (
    <g pointerEvents="none">
      {/* vertical + horizontal crosshair */}
      <line x1={cx} x2={cx} y1={PAD.top} y2={baseline} stroke={accent} strokeOpacity="0.45" strokeWidth="1" strokeDasharray="2 3" />
      <line x1={PAD.left} x2={cx} y1={cy} y2={cy} stroke={accent} strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 3" />

      {/* four-corner reticle around the point */}
      <path
        d={`M${cx - 10} ${cy - 4} V${cy - 10} H${cx - 4} M${cx + 4} ${cy - 10} H${cx + 10} V${cy - 4} M${cx + 10} ${cy + 4} V${cy + 10} H${cx + 4} M${cx - 4} ${cy + 10} H${cx - 10} V${cy + 4}`}
        fill="none"
        stroke={accent}
        strokeWidth="1.2"
      />

      {/* readout plaque */}
      <g>
        <rect x={bx} y={by} width={boxW} height={boxH} fill="#fff" stroke="#0a1628" strokeOpacity="0.15" strokeWidth="1" />
        <rect x={bx} y={by} width="2.5" height={boxH} fill={accent} />
        <text x={bx + 9} y={by + 13} className="fill-navy-900 font-mono" style={{ fontSize: 11, fontWeight: 700 }}>
          {valStr}
        </text>
        <text x={bx + 9} y={by + 24} className="fill-navy-900/55 font-mono" style={{ fontSize: 8, letterSpacing: "0.04em" }}>
          {meta}
        </text>
      </g>
    </g>
  );
}
