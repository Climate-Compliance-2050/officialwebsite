"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  WORLD_LAND_PATH,
  WORLD_VIEWBOX,
  WORLD_VIEWBOX_STR,
  lonToX,
  latToY,
} from "@/content/worldGeo";
import { typeColor, type InstrumentType } from "@/content/global";

/* ------------------------------------------------------------------ *
 * Survey-basemap instrument — real Natural Earth coastlines (baked,
 * equirectangular) with the regulated carbon markets from /global
 * plotted at their coordinates and colour-coded by instrument type.
 * Reports the external market landscape; not a C2050 service claim.
 * Shared by the home Global teaser and the Global page hero backdrop.
 * Pure SVG/CSS — no three.js, no runtime geo deps.
 * ------------------------------------------------------------------ */

export type MarketNode = {
  name: string;
  lon: number;
  lat: number;
  type: InstrumentType;
  /** Anchor markets carry a reticle bracket + mono label. */
  label?: boolean;
};

// One node per jurisdiction, placed at an approximate centroid. Derived
// from globalPage.timeline.markets (clustered systems collapse to their
// jurisdiction — e.g. the eight Chinese pilots sit under one China node).
export const MARKET_NODES: MarketNode[] = [
  { name: "EU ETS", lon: 10, lat: 50, type: "ETS", label: true },
  { name: "UK ETS", lon: -2, lat: 54, type: "ETS" },
  { name: "Switzerland", lon: 8, lat: 47, type: "ETS" },
  { name: "Portugal", lon: -8, lat: 39, type: "TAX" },
  { name: "Türkiye", lon: 35, lat: 39, type: "ETS" },
  { name: "Kazakhstan", lon: 67, lat: 48, type: "ETS" },
  { name: "UAE", lon: 54, lat: 24, type: "ETS" },
  { name: "China", lon: 105, lat: 35, type: "ETS", label: true },
  { name: "Korea", lon: 128, lat: 37, type: "ETS" },
  { name: "Japan", lon: 138, lat: 37, type: "ETS" },
  { name: "India", lon: 79, lat: 22, type: "OTHER" },
  { name: "Singapore", lon: 104, lat: 1, type: "TAX" },
  { name: "Thailand", lon: 101, lat: 15, type: "ETS" },
  { name: "Vietnam", lon: 108, lat: 16, type: "ETS" },
  { name: "Indonesia", lon: 118, lat: -2, type: "ETS" },
  { name: "Australia", lon: 134, lat: -25, type: "ETS" },
  { name: "New Zealand", lon: 174, lat: -41, type: "ETS" },
  { name: "South Africa", lon: 25, lat: -29, type: "TAX" },
  { name: "Canada", lon: -106, lat: 56, type: "ETS" },
  { name: "California / RGGI", lon: -100, lat: 40, type: "ETS", label: true },
  { name: "Mexico", lon: -102, lat: 23, type: "ETS" },
  { name: "Colombia", lon: -74, lat: 4, type: "ETS" },
  { name: "Brazil", lon: -51, lat: -10, type: "ETS", label: true },
  { name: "Chile", lon: -71, lat: -35, type: "ETS" },
];

// Faint graticule inside the cropped frame — every 30° of longitude, 20° lat.
const MERIDIANS: number[] = [];
for (let lon = -150; lon <= 150; lon += 30) MERIDIANS.push(lonToX(lon));
const PARALLELS: number[] = [];
for (let lat = 60; lat >= -40; lat -= 20) PARALLELS.push(latToY(lat));

type Props = {
  /** "slice" fills (full-bleed hero); "meet" fits (framed teaser panel). */
  fit?: "meet" | "slice";
  /** Render anchor reticle labels. */
  labels?: boolean;
  /** Longitude survey sweep + node pulse (still gated by reduced-motion). */
  animate?: boolean;
  /** Coastline / node emphasis. "hero" reads quieter behind copy. */
  tone?: "panel" | "hero";
  className?: string;
};

export function WorldInstrument({
  fit = "meet",
  labels = true,
  animate = true,
  tone = "panel",
  className,
}: Props) {
  const reduce = useReducedMotion();
  const motionOn = animate && !reduce;

  const { x, y, w, h } = WORLD_VIEWBOX;
  const land = tone === "hero" ? 0.14 : 0.16;
  const fill = tone === "hero" ? 0.035 : 0.035;
  const dotR = tone === "hero" ? 1.9 : 2.2;

  return (
    <svg
      viewBox={WORLD_VIEWBOX_STR}
      className={className}
      preserveAspectRatio={`xMidYMid ${fit}`}
      aria-hidden
    >
      {/* graticule */}
      <g stroke="rgba(255,255,255,0.05)" strokeWidth={0.25}>
        {MERIDIANS.map((mx) => (
          <line key={`m${mx}`} x1={mx} y1={y} x2={mx} y2={y + h} />
        ))}
        {PARALLELS.map((py) => (
          <line key={`p${py}`} x1={x} y1={py} x2={x + w} y2={py} />
        ))}
      </g>

      {/* real coastlines */}
      <path
        d={WORLD_LAND_PATH}
        fillRule="evenodd"
        fill={`rgba(255,255,255,${fill})`}
        stroke={`rgba(255,255,255,${land})`}
        strokeWidth={0.35}
        strokeLinejoin="round"
      />

      {/* longitude survey sweep */}
      {motionOn && (
        <motion.line
          y1={y + 2}
          y2={y + h - 2}
          stroke="rgba(101,196,123,0.4)"
          strokeWidth={0.7}
          initial={{ x: 0 }}
          animate={{ x: 360 }}
          transition={{ duration: 11, ease: "linear", repeat: Infinity }}
        />
      )}

      {/* market nodes */}
      {MARKET_NODES.map((n) => {
        const c = typeColor[n.type];
        const cx = lonToX(n.lon);
        const cy = latToY(n.lat);
        return (
          <g key={n.name}>
            <circle cx={cx} cy={cy} r={dotR * 2} fill={c} opacity={0.14} />
            {motionOn && (
              <circle cx={cx} cy={cy} r={dotR} fill="none" stroke={c} strokeWidth={0.5}>
                <animate
                  attributeName="r"
                  values={`${dotR};${dotR * 3};${dotR}`}
                  dur="3.6s"
                  begin={`${(cx % 7) * 0.4}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.5;0;0.5"
                  dur="3.6s"
                  begin={`${(cx % 7) * 0.4}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle cx={cx} cy={cy} r={dotR} fill={c} />
            {labels && n.label && (
              <>
                <path
                  d={`M${cx - 5.5} ${cy - 2.5} V${cy - 5.5} H${cx - 2.5} M${cx + 5.5} ${cy + 2.5} V${cy + 5.5} H${cx + 2.5}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth={0.6}
                />
                <text
                  x={cx + 6.5}
                  y={cy - 4.5}
                  className="font-mono"
                  fontSize={5.6}
                  letterSpacing={0.3}
                  fill="rgba(255,255,255,0.82)"
                >
                  {n.name}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
