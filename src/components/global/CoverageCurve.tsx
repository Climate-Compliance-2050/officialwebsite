"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type CoveragePoint } from "@/content/global";

// viewBox geometry — the SVG scales to its container, so labels stay proportional.
const VB_W = 840;
const VB_H = 380;
const PAD = { left: 46, right: 22, top: 26, bottom: 42 };
const PLOT_W = VB_W - PAD.left - PAD.right;
const PLOT_H = VB_H - PAD.top - PAD.bottom;
const Y_MAX = 100;

const mid = (p: number | [number, number]) => (Array.isArray(p) ? (p[0] + p[1]) / 2 : p);

export function CoverageCurve({ points }: { points: CoveragePoint[] }) {
  const reduce = useReducedMotion();

  const n = points.length;
  const x = (i: number) => PAD.left + (PLOT_W * i) / (n - 1);
  const y = (pct: number) => PAD.top + (1 - pct / Y_MAX) * PLOT_H;
  const baseline = y(0);

  const firstProj = points.findIndex((p) => p.projected);
  const histEnd = firstProj - 1; // last realized point (today)

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
    <div className="corners corners-blue relative border border-navy-900/10 bg-white p-3 sm:p-5">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Line chart: share of world GHG emissions under regulated carbon pricing, ~0% in 1992 rising to ~29% in 2026, projected to ~75–90% by 2050."
        preserveAspectRatio="xMidYMid meet"
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
          const label = Array.isArray(p.pct) ? `${p.pct[0]}–${p.pct[1]}%` : `${p.pct}%`;
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
              <text
                x={cx}
                y={cy - 12}
                textAnchor="middle"
                className={p.projected ? "fill-blue-600 font-mono" : "fill-navy-900 font-mono"}
                style={{ fontSize: 10, fontWeight: 600 }}
              >
                {label}
              </text>
              <text
                x={cx}
                y={VB_H - PAD.bottom + 18}
                textAnchor="middle"
                className="fill-navy-900/55 font-mono"
                style={{ fontSize: 10 }}
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
