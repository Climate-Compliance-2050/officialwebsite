"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SurveyBackdrop } from "@/components/ui/SurveyBackdrop";
import { dataCube } from "@/content/site";

/* ------------------------------------------------------------------ *
 * The Data Cube — slice build (response to Ludovino's "EDGE CUBE"
 * reference). The cube is NOT a solid box: it is six slabs that snap
 * into one cube. The bottom slab is the TERRITORY (the coordinate we
 * take from the land); five pillar slabs stack above it. A vertical
 * beam runs through all six. As you arrive, the exploded slabs fly
 * together (scroll-assemble); once sealed, evidence points on every
 * pillar drop lines down the beam into the territory coordinate, and
 * the geospatial (green) ⊕ legal (blue) seam welds — the differentiator
 * made physical. An environmental asset now stands as a financial one.
 *
 * Two decoupled clocks (proven by the prior cube build):
 *   - assemble clock: scroll-driven, 0→1, owns slab positions + seal.
 *   - evidence clock: time loop, owns point pop-in / feed / core / weld.
 * Per-frame style is written to refs directly to keep 60fps.
 * ------------------------------------------------------------------ */

const SLAB = 280; // px — square slab edge
const HALF = SLAB / 2;
const STAGE_W = 560;
const STAGE_H = 620;

// rig orientation — looking down on stacked horizontal planes, 3/4 view
const RIG_TILT = 60; // deg — rotateX (planes read near-horizontal)
const RIG_YAW = 45; // deg — rotateZ (squares read as diamonds)

const COUNT = 6;
const MID = (COUNT - 1) / 2; // 2.5 — center the stack on z=0
// Slabs stay SEPARATED when assembled (the legible, his-reference look); the
// prism cage ties them into one structure. Exploded = a wider rest spread.
const SPACING_SEALED = 80; // center-to-center when assembled
const SPACING_OPEN = 124; // exploded rest spacing
const LIFT = 64; // extra z when a slab is lifted for inspection
const APEX = 120; // beam length above the top slab → payoff arrow
const CORNER = HALF * 0.86; // prism-cage vertical edges sit just inside the slab corners

const LOOP_MS = 8200; // one gather → web → dissolve pass
const POINTS_PER = 3; // evidence points per pillar slab (5 → ~15)

const GATHER_START = 0.06;
const GATHER_END = 0.46;
const FADE_START = 0.8;
const FADE_END = 0.97;
const POP = 0.06;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

/** Deterministic PRNG so each pass's web is reproducible from its index. */
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Vec3 = readonly [number, number, number];

/** Lay a 1px element from p0 toward p1 (origin at p0, extends along +X). */
function seg(p0: Vec3, p1: Vec3) {
  const dx = p1[0] - p0[0];
  const dy = p1[1] - p0[1];
  const dz = p1[2] - p0[2];
  const len = Math.hypot(dx, dy, dz) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const uz = dz / len;
  let ax = 0;
  let ay = -uz;
  let az = uy;
  const an = Math.hypot(ax, ay, az);
  if (an < 1e-6) {
    ax = 0;
    ay = 0;
    az = 1;
  } else {
    ax /= an;
    ay /= an;
    az /= an;
  }
  const ang = (Math.acos(clamp(ux, -1, 1)) * 180) / Math.PI;
  return {
    len,
    transform: `translate3d(${p0[0]}px,${p0[1]}px,${p0[2]}px) rotate3d(${ax},${ay},${az},${ang}deg)`,
  };
}

/* ---- slab model: 1:1 with dataCube.layers (bottom → top). Geospatial
   (green) sits directly under Legal (blue) so their seam is the bind. ---- */

type Accent = "green" | "blue";

type Slab = {
  key: string;
  index: string;
  accent: Accent;
  isBind: boolean; // geospatial / legal / regulatory — the differentiator trio
};

const SLABS: Slab[] = [
  { key: "territory", index: "01", accent: "green", isBind: false },
  { key: "geo", index: "02", accent: "green", isBind: true },
  { key: "legal", index: "03", accent: "blue", isBind: true },
  { key: "reg", index: "04", accent: "blue", isBind: true },
  { key: "sci", index: "05", accent: "green", isBind: false },
  { key: "tech", index: "06", accent: "blue", isBind: false },
];

const ACCENT_HEX: Record<Accent, string> = { green: "#65c47b", blue: "#4d9fd6" };

const zSealed = (i: number) => (i - MID) * SPACING_SEALED;
const zOpen = (i: number) => (i - MID) * SPACING_OPEN;

// territory (base) coordinate and the geospatial⊕legal weld seam, sealed frame
const Z_BASE = zSealed(0);
const Z_WELD = (zSealed(1) + zSealed(2)) / 2;

/* --------------------------- evidence web --------------------------- */

type WebPoint = {
  slabIndex: number;
  accent: Accent;
  pos: Vec3; // point on the pillar slab (sealed frame)
  lineLen: number;
  lineTransform: string; // base coordinate → point
  tPop: number;
};

/** Build a pass's web: each pillar slab seeds POINTS_PER points scattered on
 *  its surface, each dropping a line down the beam to the territory coordinate. */
function genWeb(cycle: number): WebPoint[] {
  const rand = mulberry32((0x9e3779b1 ^ (cycle * 0x6d2b79f5)) >>> 0);
  const out: WebPoint[] = [];
  const spread = HALF * 0.62;
  const total = (COUNT - 1) * POINTS_PER;
  for (let i = 1; i < COUNT; i++) {
    const z = zSealed(i);
    const accent = SLABS[i].accent;
    for (let j = 0; j < POINTS_PER; j++) {
      const idx = (i - 1) * POINTS_PER + j;
      const u = (rand() * 2 - 1) * spread;
      const v = (rand() * 2 - 1) * spread;
      const pos: Vec3 = [u, v, z];
      const { len, transform } = seg([0, 0, Z_BASE], pos); // base → point
      const tPop =
        GATHER_START + (idx / total) * (GATHER_END - GATHER_START) + (rand() - 0.5) * 0.018;
      out.push({ slabIndex: i, accent, pos, lineLen: len, lineTransform: transform, tPop });
    }
  }
  return out;
}

/** A point's presence (0..1) at a given loop phase. */
function presence(phase: number, tPop: number) {
  if (phase < tPop) return 0;
  if (phase < tPop + POP) return smooth((phase - tPop) / POP);
  if (phase < FADE_START) return 1;
  if (phase < FADE_END) return 1 - smooth((phase - FADE_START) / (FADE_END - FADE_START));
  return 0;
}

/** Core / beam intensity over the loop. */
function coreLevel(phase: number) {
  if (phase < GATHER_START) return 0.22;
  if (phase < GATHER_END) return 0.22 + 0.78 * smooth((phase - GATHER_START) / (GATHER_END - GATHER_START));
  if (phase < FADE_START) return 1;
  if (phase < FADE_END) return 0.22 + 0.78 * (1 - smooth((phase - FADE_START) / (FADE_END - FADE_START)));
  return 0.22;
}

/* -------------------- slab faces: one parcel, six readings --------------------
 * Every slab draws the SAME parcel footprint (the territory polygon, registered
 * to the same centroid the beam pierces). On top of that shared ghost, each slab
 * renders the distinct data it carries — so the stack reads as one piece of land
 * seen six ways, all locked to one coordinate. The footprint repeated up the
 * column IS the "locked to coordinate" story, made visible. */

const PARCEL_PTS: ReadonlyArray<readonly [number, number]> = [
  [36, 30],
  [86, 24],
  [100, 58],
  [84, 96],
  [44, 100],
  [22, 66],
];
const C0 = 60; // beam / coordinate sits at the slab centre (50% of the 120 box)

const ptsPath = (pts: ReadonlyArray<readonly [number, number]>) =>
  "M" + pts.map((p) => `${p[0]} ${p[1]}`).join(" L") + " Z";
const scalePts = (f: number): ReadonlyArray<readonly [number, number]> =>
  PARCEL_PTS.map(([x, y]) => [C0 + (x - C0) * f, C0 + (y - C0) * f] as const);

const PARCEL = ptsPath(PARCEL_PTS);

function FaceSvg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden>
      {children}
    </svg>
  );
}

/** The shared registration ghost: the same parcel, drawn faint, on every pillar. */
function Ghost({ c }: { c: string }) {
  return <path d={PARCEL} fill={`${c}0d`} stroke={c} strokeWidth={1.1} opacity={0.4} />;
}

/* 01 — Territory: the cadastral plot. Survey monuments at every corner, a lat/lon
   crosshair, and the coordinate reticle at the centroid. This is the ground. */
function FaceTerritory({ c }: { c: string }) {
  return (
    <FaceSvg>
      <path d={PARCEL} fill={`${c}17`} stroke={c} strokeWidth={1.5} opacity={0.9} />
      {PARCEL_PTS.map(([x, y], i) => (
        <rect
          key={i}
          x={x - 2.4}
          y={y - 2.4}
          width={4.8}
          height={4.8}
          fill="none"
          stroke={c}
          strokeWidth={1}
          opacity={0.85}
          transform={`rotate(45 ${x} ${y})`}
        />
      ))}
      <line x1={18} y1={C0} x2={102} y2={C0} stroke={c} strokeWidth={0.8} opacity={0.4} strokeDasharray="2 3" />
      <line x1={C0} y1={18} x2={C0} y2={102} stroke={c} strokeWidth={0.8} opacity={0.4} strokeDasharray="2 3" />
      <circle cx={C0} cy={C0} r={5} fill="none" stroke={c} strokeWidth={1.3} opacity={0.95} />
      <circle cx={C0} cy={C0} r={1.7} fill={c} />
    </FaceSvg>
  );
}

/* 02 — Geospatial: terrain. Nested contour rings inside the same footprint. */
function FaceGeospatial({ c }: { c: string }) {
  return (
    <FaceSvg>
      <Ghost c={c} />
      <path d={ptsPath(scalePts(0.74))} fill="none" stroke={c} strokeWidth={1} opacity={0.55} />
      <path d={ptsPath(scalePts(0.5))} fill="none" stroke={c} strokeWidth={1} opacity={0.62} />
      <path d={ptsPath(scalePts(0.26))} fill={`${c}1f`} stroke={c} strokeWidth={1} opacity={0.7} />
      <circle cx={C0} cy={C0} r={1.4} fill={c} opacity={0.9} />
    </FaceSvg>
  );
}

/* 03 — Legal: tenure. The same parcel as a title boundary — ownership hatch fill,
   right-angle tenure marks at every corner, a seal on the coordinate. */
function FaceLegal({ c, uid }: { c: string; uid: string }) {
  return (
    <FaceSvg>
      <defs>
        <pattern id={`h${uid}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke={c} strokeWidth="0.8" opacity="0.42" />
        </pattern>
        <clipPath id={`cp${uid}`}>
          <path d={PARCEL} />
        </clipPath>
      </defs>
      <g clipPath={`url(#cp${uid})`}>
        <rect x="0" y="0" width="120" height="120" fill={`url(#h${uid})`} />
      </g>
      <path d={PARCEL} fill="none" stroke={c} strokeWidth={1.6} opacity={0.85} />
      {PARCEL_PTS.map(([x, y], i) => (
        <g key={i} stroke={c} strokeWidth={1.2} opacity={0.85}>
          <line x1={x} y1={y} x2={x + (x < C0 ? 6 : -6)} y2={y} />
          <line x1={x} y1={y} x2={x} y2={y + (y < C0 ? 6 : -6)} />
        </g>
      ))}
      <circle cx={C0} cy={C0} r={6} fill="none" stroke={c} strokeWidth={1} opacity={0.85} />
      <circle cx={C0} cy={C0} r={3} fill="none" stroke={c} strokeWidth={1} opacity={0.85} />
    </FaceSvg>
  );
}

/* 04 — Regulatory: the parcel inside a jurisdiction frame, eligibility checkpoints
   ticked along its boundary. Article 6 / CORSIA, registered to the coordinate. */
function FaceRegulatory({ c }: { c: string }) {
  const checks = [PARCEL_PTS[0], PARCEL_PTS[2], PARCEL_PTS[4]];
  return (
    <FaceSvg>
      <rect x={14} y={14} width={92} height={92} fill="none" stroke={c} strokeWidth={1} opacity={0.38} strokeDasharray="5 4" />
      <Ghost c={c} />
      {checks.map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 4} y={y - 4} width={8} height={8} fill={`${c}1a`} stroke={c} strokeWidth={1} opacity={0.85} />
          <path
            d={`M${x - 2} ${y} L${x - 0.4} ${y + 2} L${x + 2.4} ${y - 2.2}`}
            fill="none"
            stroke={c}
            strokeWidth={1.3}
            opacity={0.95}
          />
        </g>
      ))}
    </FaceSvg>
  );
}

/* 05 — Scientific: a measurement quadrat over the parcel, sample dots sized by
   carbon-stock density, one baseline isoline. The MRV evidence grid. */
function FaceScientific({ c, uid }: { c: string; uid: string }) {
  const xs = [34, 50, 66, 82, 98];
  const ys = [34, 50, 66, 82, 98];
  const dots: ReactNode[] = [];
  let k = 0;
  for (const x of xs)
    for (const y of ys) {
      const r = 0.8 + ((k * 37) % 5) * 0.42;
      dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={c} opacity={0.72} />);
      k++;
    }
  return (
    <FaceSvg>
      <defs>
        <clipPath id={`cp${uid}`}>
          <path d={PARCEL} />
        </clipPath>
      </defs>
      <Ghost c={c} />
      <g clipPath={`url(#cp${uid})`}>
        {xs.map((x) => (
          <line key={`vx${x}`} x1={x} y1={18} x2={x} y2={102} stroke={c} strokeWidth={0.6} opacity={0.3} />
        ))}
        {ys.map((y) => (
          <line key={`hy${y}`} x1={18} y1={y} x2={102} y2={y} stroke={c} strokeWidth={0.6} opacity={0.3} />
        ))}
        {dots}
        <path d="M20 80 C44 60, 62 86, 100 50" fill="none" stroke={c} strokeWidth={1.3} opacity={0.75} />
      </g>
      <path d={PARCEL} fill="none" stroke={c} strokeWidth={1.2} opacity={0.5} />
    </FaceSvg>
  );
}

/* 06 — Technical: methodology lifecycle. A node path traced across the parcel,
   ending in a filled, market-ready node. */
function FaceTechnical({ c }: { c: string }) {
  const nodes: ReadonlyArray<readonly [number, number]> = [
    [28, 58],
    [48, 40],
    [66, 70],
    [84, 46],
    [96, 78],
  ];
  const path = "M" + nodes.map((n) => `${n[0]} ${n[1]}`).join(" L");
  return (
    <FaceSvg>
      <Ghost c={c} />
      <path d={path} fill="none" stroke={c} strokeWidth={1.2} opacity={0.6} />
      {nodes.map(([x, y], i) => {
        const last = i === nodes.length - 1;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={last ? 3 : 2}
            fill={last ? c : `${c}26`}
            stroke={c}
            strokeWidth={1}
            opacity={0.9}
          />
        );
      })}
    </FaceSvg>
  );
}

function SlabFace({ slabKey, c }: { slabKey: string; c: string }) {
  switch (slabKey) {
    case "territory":
      return <FaceTerritory c={c} />;
    case "geo":
      return <FaceGeospatial c={c} />;
    case "legal":
      return <FaceLegal c={c} uid={slabKey} />;
    case "reg":
      return <FaceRegulatory c={c} />;
    case "sci":
      return <FaceScientific c={c} uid={slabKey} />;
    case "tech":
      return <FaceTechnical c={c} />;
    default:
      return null;
  }
}

/* --------------------- standing label + hologram glyph ---------------------
 * Each slab carries an upright name plate, billboarded so it counter-rotates the
 * rig and faces the camera — the title reads at full height despite the 60° tilt.
 * On inspect, the slab projects its 3D glyph above the plate with a light cone:
 * the pillar's own symbol, standing off its plane. Glyphs are single-stroke line
 * art so they survive the accent-glow "projection" treatment. */

const STEM = 20; // px — stem from the slab corner up to the plate
const PLATE_Y = STEM + 18; // plate top edge above the corner
const GLYPH_Y = PLATE_Y + 48; // glyph top edge when projected
const CORNER_OFF = 124; // in-plane shift to the slab's outer (West) corner

function HoloGlyph({ slabKey, c }: { slabKey: string; c: string }) {
  const s = { fill: "none", stroke: c, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const thin = { ...s, strokeWidth: 1.4 } as const;
  switch (slabKey) {
    case "territory": // survey benchmark — coordinate reticle
      return (
        <svg width={44} height={46} viewBox="0 0 48 50" aria-hidden>
          <circle cx={24} cy={26} r={13} {...s} />
          <line x1={24} y1={7} x2={24} y2={45} {...thin} />
          <line x1={5} y1={26} x2={43} y2={26} {...thin} />
          <circle cx={24} cy={26} r={2.4} fill={c} stroke="none" />
        </svg>
      );
    case "geo": // terrain — stacked contour
      return (
        <svg width={46} height={44} viewBox="0 0 48 46" aria-hidden>
          <path d="M6 38 Q24 14 42 38" {...s} />
          <path d="M11 39 Q24 22 37 39" {...s} />
          <path d="M16 40 Q24 30 32 40" {...s} />
          <circle cx={24} cy={22} r={1.8} fill={c} stroke="none" />
        </svg>
      );
    case "legal": // balance scale
      return (
        <svg width={46} height={46} viewBox="0 0 48 50" aria-hidden>
          <line x1={24} y1={9} x2={24} y2={43} {...s} />
          <line x1={13} y1={43} x2={35} y2={43} {...s} />
          <line x1={9} y1={17} x2={39} y2={17} {...s} />
          <circle cx={24} cy={12} r={2.2} fill={c} stroke="none" />
          <path d="M9 17 L5 28 M9 17 L13 28 M4 28 Q9 33 14 28" {...thin} />
          <path d="M39 17 L35 28 M39 17 L43 28 M34 28 Q39 33 44 28" {...thin} />
        </svg>
      );
    case "reg": // approval seal — compliance check
      return (
        <svg width={44} height={44} viewBox="0 0 48 48" aria-hidden>
          <circle cx={24} cy={24} r={14} {...thin} strokeDasharray="3 3" />
          <circle cx={24} cy={24} r={9} {...s} />
          <path d="M19 24 L23 28 L30 19" {...s} />
        </svg>
      );
    case "sci": // sample flask
      return (
        <svg width={44} height={48} viewBox="0 0 48 52" aria-hidden>
          <path d="M20 8 L20 22 L11 43 Q10 47 15 47 L33 47 Q38 47 37 43 L28 22 L28 8" {...s} />
          <line x1={18} y1={8} x2={30} y2={8} {...s} />
          <line x1={14} y1={38} x2={34} y2={38} {...thin} opacity={0.75} />
          <circle cx={22} cy={42} r={1.2} fill={c} stroke="none" />
          <circle cx={27} cy={40} r={1} fill={c} stroke="none" />
        </svg>
      );
    case "tech": // methodology gear
      return (
        <svg width={46} height={46} viewBox="0 0 48 48" aria-hidden>
          <circle cx={24} cy={24} r={10} {...s} />
          <circle cx={24} cy={24} r={3.4} {...s} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const r = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={24 + 10 * Math.cos(r)}
                y1={24 + 10 * Math.sin(r)}
                x2={24 + 13.5 * Math.cos(r)}
                y2={24 + 13.5 * Math.sin(r)}
                {...s}
              />
            );
          })}
        </svg>
      );
    default:
      return null;
  }
}

function StandingLabel({
  index,
  label,
  slabKey,
  c,
  active,
  reduce,
}: {
  index: string;
  label: string;
  slabKey: string;
  c: string;
  active: boolean;
  reduce: boolean | null;
}) {
  return (
    <>
      {/* billboarded standee at the slab's outer corner — first shift in-plane to
          the West corner, then counter-rotate the rig so the plate faces camera */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2"
        style={{
          transformStyle: "preserve-3d",
          transform: `translate(${-CORNER_OFF}px, ${CORNER_OFF}px) rotateZ(${-RIG_YAW}deg) rotateX(${-RIG_TILT}deg)`,
        }}
      >
        {/* stem from surface up to plate */}
        <div
          className="absolute transition-opacity duration-300"
          style={{
            left: -0.5,
            top: -STEM,
            width: 1,
            height: STEM,
            background: `linear-gradient(to top, ${c}00, ${c}cc)`,
            opacity: active ? 0.9 : 0.4,
          }}
        />
        {/* name plate */}
        <div className="absolute -translate-x-1/2" style={{ left: 0, top: -PLATE_Y }}>
          <div
            className="flex items-center gap-1.5 whitespace-nowrap border px-2 py-[3px] font-mono text-[10px] uppercase leading-none tracking-[0.16em] backdrop-blur-sm transition-all duration-300"
            style={{
              borderColor: active ? c : `${c}66`,
              background: active ? "rgba(5,12,24,0.88)" : "rgba(5,12,24,0.6)",
              boxShadow: active ? `0 0 18px ${c}40` : "none",
            }}
          >
            <span style={{ color: c }} className="opacity-80">
              {index}
            </span>
            <span className={active ? "text-white" : "text-white/70"}>{label}</span>
          </div>
        </div>

        {/* hologram glyph + light cone — projected only on inspect */}
        <AnimatePresence>
          {active && (
            <motion.div
              className="absolute"
              style={{ left: 0, top: 0 }}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: 6 }}
              transition={{ duration: 0.3 }}
            >
              {/* light cone rising from the footprint to the glyph */}
              <div
                className="absolute -translate-x-1/2"
                style={{
                  left: 0,
                  top: -GLYPH_Y,
                  width: 40,
                  height: GLYPH_Y - PLATE_Y + 10,
                  clipPath: "polygon(0 0, 100% 0, 60% 100%, 40% 100%)",
                  background: `linear-gradient(to top, ${c}00, ${c}3a)`,
                  opacity: 0.7,
                }}
              />
              {/* the projected glyph */}
              <div
                className="absolute -translate-x-1/2"
                style={{ left: 0, top: -GLYPH_Y, filter: `drop-shadow(0 0 7px ${c}) drop-shadow(0 0 2px ${c})` }}
              >
                <HoloGlyph slabKey={slabKey} c={c} />
                {/* scanlines for the projection read */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `repeating-linear-gradient(0deg, ${c}26 0px, ${c}26 1px, transparent 1px, transparent 3px)`,
                    opacity: 0.45,
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

/* ----------------------------- a single slab ----------------------------- */

function SlabPlane({
  slab,
  i,
  label,
  slabRef,
  onPick,
  pinned,
  active,
  reduce,
}: {
  slab: Slab;
  i: number;
  label: string;
  slabRef: (el: HTMLDivElement | null) => void;
  onPick: (key: string) => void;
  pinned: boolean;
  active: boolean;
  reduce: boolean | null;
}) {
  const green = slab.accent === "green";
  const c = ACCENT_HEX[slab.accent];
  return (
    <div
      ref={slabRef}
      className="absolute left-1/2 top-1/2"
      style={{
        width: SLAB,
        height: SLAB,
        marginLeft: -HALF,
        marginTop: -HALF,
        transformStyle: "preserve-3d",
        // initial exploded position; the rAF loop overwrites this each frame
        transform: `translateZ(${zOpen(i)}px)`,
        willChange: "transform",
      }}
    >
      {/* clickable slab surface */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Inspect ${label}`}
        aria-pressed={pinned}
        onClick={() => onPick(slab.key)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPick(slab.key);
          }
        }}
        className={`absolute inset-0 cursor-pointer overflow-hidden border outline-none backdrop-blur-[1px] transition-[border-color,background-color,box-shadow] duration-300 ${
          active
            ? green
              ? "border-green-400/80 bg-green-500/[0.10] shadow-[0_0_40px_-6px_rgba(0,176,80,0.6)]"
              : "border-blue-300/80 bg-blue-500/[0.10] shadow-[0_0_40px_-6px_rgba(49,126,192,0.6)]"
            : green
              ? "border-green-400/55 bg-navy-800/30"
              : "border-blue-300/55 bg-navy-800/30"
        }`}
      >
        {/* accent wash so green (geospatial-family) and blue (legal-family)
            slabs read apart — the bind is green sitting under blue */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: green ? "rgba(101,196,123,0.08)" : "rgba(77,159,214,0.08)" }}
        />
        {/* base graticule — same on every slab, so the motif reads as data over
            a shared survey grid (kept faint; the face carries the signal) */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(${c}24 1px, transparent 1px), linear-gradient(90deg, ${c}24 1px, transparent 1px)`,
            backgroundSize: "34px 34px",
          }}
        />
        {/* the slab's reading of the parcel */}
        <SlabFace slabKey={slab.key} c={c} />
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white/[0.06] to-transparent" />

        {/* reticle corner accent */}
        <span
          className={`absolute right-2 top-2 h-2.5 w-2.5 border-r border-t transition-colors duration-300 ${
            active ? (green ? "border-green-300/90" : "border-blue-200/90") : "border-white/20"
          }`}
        />
      </div>

      {/* upright name plate (always) + projected hologram glyph (on inspect) */}
      <StandingLabel index={slab.index} label={label} slabKey={slab.key} c={c} active={active} reduce={reduce} />
    </div>
  );
}

/* ------------------------- left narrative axis ------------------------- */

function AxisRail({ lit }: { lit: number }) {
  // axis runs bottom → top (foundation at the base), mirroring the slab stack
  const rungs = [...dataCube.axis].reverse(); // render top→bottom in DOM
  return (
    <div className="hidden shrink-0 flex-col justify-between self-stretch py-6 lg:flex" aria-hidden>
      {rungs.map((rung) => {
        // foundation=0 … transformation=n-1; lit is how many rungs are active
        const order = dataCube.axis.findIndex((a) => a.key === rung.key);
        const on = order < lit;
        const green = rung.key !== "intelligence";
        return (
          <div key={rung.key} className="relative flex max-w-[124px] flex-col gap-1">
            <span className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                  on
                    ? green
                      ? "bg-green-400 shadow-[0_0_10px_2px_rgba(101,196,123,0.8)]"
                      : "bg-blue-300 shadow-[0_0_10px_2px_rgba(77,159,214,0.8)]"
                    : "bg-white/20"
                }`}
              />
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-500 ${
                  on ? "text-white/90" : "text-white/35"
                }`}
              >
                {rung.label}
              </span>
            </span>
            <span
              className={`pl-3.5 text-[11px] leading-snug transition-colors duration-500 ${
                on ? "text-white/55" : "text-white/25"
              }`}
            >
              {rung.note}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------ section ------------------------------ */

type Mode = "assembling" | "collecting" | "bound";

export function DataCubeStack() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { margin: "-15% 0px -15% 0px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const [pinned, setPinned] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true);
  const [cycle, setCycle] = useState(0);
  const [mode, setMode] = useState<Mode>("assembling");
  const [litRungs, setLitRungs] = useState(1); // axis rungs active
  const bound = mode === "bound";

  // free-orbit on the whole rig — user drags to rotate, holds where released.
  // orbitX = pitch, orbitY = yaw; both additive over the rig's designed 3/4 view.
  const orbitX = useMotionValue(0);
  const orbitY = useMotionValue(0);
  const dragging = useRef(false);
  const dragMoved = useRef(false); // distinguishes a drag from a tap-to-inspect
  const lastPtr = useRef({ x: 0, y: 0 });

  const web = useMemo(() => genWeb(cycle), [cycle]);

  // refs the rAF loop writes to directly (bypasses React render churn)
  const slabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pointRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const coreRef = useRef<HTMLDivElement | null>(null);
  const beamRef = useRef<HTMLDivElement | null>(null);
  const weldRef = useRef<HTMLDivElement | null>(null);
  const webLayerRef = useRef<HTMLDivElement | null>(null);
  const cageRef = useRef<HTMLDivElement | null>(null);

  const webRef = useRef<WebPoint[]>(web);
  const elapsed = useRef(0);
  const lastNow = useRef(0);
  const inViewRef = useRef(false);
  const playingRef = useRef(true);
  const pinnedRef = useRef<string | null>(null);
  const activeRef = useRef<string | null>(null);
  const modeRef = useRef<Mode>("assembling");
  const litRef = useRef(1);

  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);
  useEffect(() => {
    pinnedRef.current = pinned;
  }, [pinned]);
  useEffect(() => {
    activeRef.current = activeKey;
  }, [activeKey]);
  useEffect(() => {
    webRef.current = web;
  }, [web]);

  const setModeSafe = useCallback((m: Mode) => {
    if (modeRef.current !== m) {
      modeRef.current = m;
      setMode(m);
    }
  }, []);
  const setLitSafe = useCallback((l: number) => {
    if (litRef.current !== l) {
      litRef.current = l;
      setLitRungs(l);
    }
  }, []);

  /** Place slabs for a given assemble progress (0 exploded → 1 sealed),
   *  honoring an optional lifted slab. Writes transforms directly. */
  const placeSlabs = useCallback((p: number, lifted: string | null) => {
    for (let i = 0; i < COUNT; i++) {
      const node = slabRefs.current[i];
      if (!node) continue;
      let z = lerp(zOpen(i), zSealed(i), p);
      if (lifted) {
        if (SLABS[i].key === lifted) z += LIFT;
        node.style.opacity = SLABS[i].key === lifted ? "1" : "0.32";
      } else {
        node.style.opacity = "1";
      }
      node.style.transform = `translateZ(${z}px)`;
    }
  }, []);

  // Reduced motion: render the sealed cube, completed web, locked bind — static.
  useEffect(() => {
    if (!reduce) return;
    placeSlabs(1, null);
    if (webLayerRef.current) webLayerRef.current.style.opacity = "1";
    web.forEach((_, i) => {
      const n = pointRefs.current[i];
      if (n) {
        n.style.opacity = "1";
        n.style.transform = "scale(1)";
      }
      const l = lineRefs.current[i];
      if (l) l.style.opacity = "0.78";
    });
    if (coreRef.current) {
      coreRef.current.style.opacity = "1";
      coreRef.current.style.transform = "scale(1.1)";
    }
    if (beamRef.current) beamRef.current.style.opacity = "0.95";
    if (weldRef.current) weldRef.current.style.opacity = "0.9";
    if (cageRef.current) cageRef.current.style.opacity = "0.62";
    setModeSafe("bound");
    setLitSafe(3);
  }, [reduce, web, placeSlabs, setModeSafe, setLitSafe]);

  useAnimationFrame(() => {
    if (reduce || !inViewRef.current) {
      lastNow.current = 0;
      return;
    }
    const now = performance.now();
    const real = lastNow.current ? now - lastNow.current : 16;
    lastNow.current = now;

    /* ---- assemble clock (scroll) ---- */
    const p = smooth(scrollYProgress.get());
    const lifted = pinnedRef.current;
    placeSlabs(p, lifted);
    if (cageRef.current) cageRef.current.style.opacity = `${0.12 + 0.5 * p * p}`;

    const sealed = p > 0.985;

    // axis rungs: foundation always; intelligence as it assembles; transformation when bound
    let lit = 1;
    if (p > 0.45) lit = 2;

    // while inspecting or not yet sealed, hold the web hidden
    if (!sealed || lifted) {
      if (webLayerRef.current) webLayerRef.current.style.opacity = "0";
      if (beamRef.current) beamRef.current.style.opacity = `${0.25 + 0.35 * p}`;
      if (weldRef.current) weldRef.current.style.opacity = "0";
      if (coreRef.current) {
        coreRef.current.style.opacity = `${0.2 + 0.2 * p}`;
        coreRef.current.style.transform = "scale(0.85)";
      }
      setModeSafe(sealed ? "collecting" : "assembling");
      setLitSafe(lit);
      return;
    }

    if (webLayerRef.current) webLayerRef.current.style.opacity = "1";

    if (!playingRef.current) {
      setLitSafe(lit);
      return;
    }

    /* ---- evidence clock (time loop) ---- */
    elapsed.current += real;
    if (elapsed.current >= LOOP_MS) {
      elapsed.current -= LOOP_MS;
      setCycle((c) => c + 1);
    }
    const phase = elapsed.current / LOOP_MS;

    const pts = webRef.current;
    const act = activeRef.current;
    for (let i = 0; i < pts.length; i++) {
      const pt = pts[i];
      const pr = presence(phase, pt.tPop);
      const hot = act === SLABS[pt.slabIndex].key;
      const node = pointRefs.current[i];
      if (node) {
        node.style.opacity = `${pr}`;
        node.style.transform = `scale(${0.3 + 0.7 * pr})`;
      }
      const line = lineRefs.current[i];
      if (line) line.style.opacity = `${pr * (hot ? 1 : 0.78)}`;
    }

    const lvl = coreLevel(phase);
    if (coreRef.current) {
      coreRef.current.style.opacity = `${0.3 + 0.7 * lvl}`;
      coreRef.current.style.transform = `scale(${0.85 + 0.35 * lvl})`;
    }
    if (beamRef.current) beamRef.current.style.opacity = `${0.45 + 0.5 * lvl}`;

    const isBound = phase > 0.52 && phase < FADE_START;
    if (weldRef.current) weldRef.current.style.opacity = isBound ? "0.9" : `${0.15 + 0.3 * lvl}`;
    if (isBound) lit = 3;

    setModeSafe(isBound ? "bound" : "collecting");
    setLitSafe(lit);
  });

  const togglePlay = useCallback(() => setPlaying((v) => !v), []);

  const pickSlab = useCallback((key: string) => {
    setPinned((cur) => (cur === key ? null : key));
    setActiveKey(key);
  }, []);

  // tap a slab to inspect; a drag (pointer moved past threshold) is rotation, not a pick
  const pickSlabGuarded = useCallback(
    (key: string) => {
      if (dragMoved.current) return;
      pickSlab(key);
    },
    [pickSlab],
  );

  // free-orbit drag: accumulate pointer delta into yaw (x) / pitch (y), hold on release
  const onStagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    dragMoved.current = false;
    lastPtr.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPtr.current.x;
    const dy = e.clientY - lastPtr.current.y;
    if (!dragMoved.current && Math.hypot(dx, dy) > 4) dragMoved.current = true;
    lastPtr.current = { x: e.clientX, y: e.clientY };
    orbitY.set(orbitY.get() + dx * 0.45);
    orbitX.set(orbitX.get() - dy * 0.45);
  };
  const onStagePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      /* pointer already released */
    }
  };

  // the layer currently lit (hover or pin) — surfaced on the instrument itself
  const activeIdx = activeKey ? SLABS.findIndex((s) => s.key === activeKey) : -1;
  const activeSlab = activeIdx >= 0 ? SLABS[activeIdx] : null;
  const activeLayer = activeIdx >= 0 ? dataCube.layers[activeIdx] : null;

  return (
    <section
      ref={sectionRef}
      className="dark-section grain hairline-top relative overflow-hidden bg-navy-900 py-20 text-white lg:py-28"
    >
      <SurveyBackdrop ticks={false} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* ---------------- Slice instrument ---------------- */}
          <div className="order-2 flex items-stretch justify-center gap-2 lg:order-1">
            <AxisRail lit={litRungs} />
            <div
              ref={stageRef}
              className="corners corners-faint relative -my-16 grid cursor-grab touch-pan-y select-none place-items-center scale-[0.6] active:cursor-grabbing sm:-my-8 sm:scale-75 lg:my-0 lg:scale-100"
              style={{ width: STAGE_W, height: STAGE_H, perspective: 1500 }}
              onPointerDown={onStagePointerDown}
              onPointerMove={onStagePointerMove}
              onPointerUp={onStagePointerUp}
              onPointerCancel={onStagePointerUp}
            >
              {/* scanline sweep */}
              <div
                aria-hidden
                className="animate-scan pointer-events-none absolute inset-x-10 top-1/2 h-[2px] bg-gradient-to-r from-transparent via-green-300 to-transparent shadow-[0_0_12px_2px_rgba(101,196,123,0.7)]"
              />

              {/* parallax wrapper */}
              <motion.div
                className="relative grid place-items-center"
                style={{ transformStyle: "preserve-3d", rotateX: orbitX, rotateY: orbitY }}
              >
                {/* the rig: tilt + diamond yaw; everything authored in this frame */}
                <div
                  className="relative"
                  style={{
                    width: 0,
                    height: 0,
                    transformStyle: "preserve-3d",
                    // nudge the stack down so the top slab's standee + projected
                    // glyph clear the top-left HUD telemetry
                    transform: `translateY(24px) rotateX(${RIG_TILT}deg) rotateZ(${RIG_YAW}deg)`,
                  }}
                >
                  {/* prism cage — 4 vertical edges binding the slabs into one
                      structure (the "cube"); fades in as the stack assembles */}
                  <div
                    ref={cageRef}
                    className="absolute left-0 top-0"
                    style={{ transformStyle: "preserve-3d", opacity: 0.12 }}
                  >
                    {[
                      [CORNER, CORNER],
                      [CORNER, -CORNER],
                      [-CORNER, CORNER],
                      [-CORNER, -CORNER],
                    ].map(([cx, cy], k) => {
                      const e = seg([cx, cy, zSealed(0)], [cx, cy, zSealed(COUNT - 1)]);
                      return (
                        <div
                          key={k}
                          className="absolute"
                          style={{
                            left: 0,
                            top: -0.5,
                            width: e.len,
                            height: 1,
                            transformOrigin: "0 50%",
                            transform: e.transform,
                            background: "linear-gradient(90deg, rgba(101,196,123,0.5), rgba(77,159,214,0.5))",
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* vertical beam through every slab center, base → apex */}
                  <div className="absolute left-0 top-0" style={{ transformStyle: "preserve-3d" }}>
                    {(() => {
                      const b = seg([0, 0, Z_BASE], [0, 0, zSealed(COUNT - 1) + APEX]);
                      return (
                        <div
                          ref={beamRef}
                          className="absolute"
                          style={{
                            left: 0,
                            top: -1.5,
                            width: b.len,
                            height: 3,
                            transformOrigin: "0 50%",
                            transform: b.transform,
                            background: "linear-gradient(90deg, #65c47b 0%, #65c47b 38%, #4d9fd6 100%)",
                            boxShadow: "0 0 14px 2px rgba(101,196,123,0.5)",
                            opacity: 0.4,
                          }}
                        />
                      );
                    })()}
                    {/* apex arrowhead */}
                    <div
                      className="absolute"
                      style={{
                        transform: `translate3d(0px,0px,${zSealed(COUNT - 1) + APEX}px) rotateZ(${-RIG_YAW}deg) rotateX(${-RIG_TILT}deg)`,
                      }}
                    >
                      <span
                        className="absolute h-0 w-0 -translate-x-1/2 -translate-y-full"
                        style={{
                          borderLeft: "6px solid transparent",
                          borderRight: "6px solid transparent",
                          borderBottom: "10px solid #4d9fd6",
                          filter: "drop-shadow(0 0 6px rgba(77,159,214,0.8))",
                        }}
                      />
                    </div>
                  </div>

                  {/* analysis core — at the territory coordinate (base) */}
                  <div className="absolute left-0 top-0" style={{ transformStyle: "preserve-3d" }}>
                    <div
                      ref={coreRef}
                      className="absolute h-16 w-16 rounded-full bg-green-500/30 blur-xl"
                      style={{
                        left: -32,
                        top: -32,
                        transform: `translateZ(${Z_BASE}px)`,
                        opacity: 0.25,
                      }}
                    />
                    <div
                      className="absolute h-3.5 w-3.5 rounded-full bg-green-200"
                      style={{
                        left: -7,
                        top: -7,
                        transform: `translateZ(${Z_BASE}px)`,
                        boxShadow: "0 0 22px 6px rgba(101,196,123,0.75)",
                      }}
                    />
                  </div>

                  {/* bind weld — bicolour ring on the geospatial ⊕ legal seam */}
                  <div className="absolute left-0 top-0" style={{ transformStyle: "preserve-3d" }}>
                    <div
                      ref={weldRef}
                      className="animate-lock motion-reduce:animate-none absolute h-16 w-16 rounded-full"
                      style={{
                        left: -32,
                        top: -32,
                        transform: `translateZ(${Z_WELD}px)`,
                        background: "conic-gradient(from 0deg, #65c47b, #4d9fd6, #65c47b)",
                        WebkitMask: "radial-gradient(closest-side, transparent 68%, #000 70%)",
                        mask: "radial-gradient(closest-side, transparent 68%, #000 70%)",
                        opacity: 0,
                      }}
                    />
                  </div>

                  {/* evidence web — points on each pillar, lines dropping to base */}
                  <div
                    ref={webLayerRef}
                    className="absolute left-0 top-0"
                    style={{ transformStyle: "preserve-3d", opacity: 0 }}
                  >
                    {web.map((pt, i) => {
                      const c = ACCENT_HEX[pt.accent];
                      return (
                        <div key={i} className="absolute" style={{ transformStyle: "preserve-3d" }}>
                          {/* line: base coordinate → point */}
                          <div
                            ref={(el) => {
                              lineRefs.current[i] = el;
                            }}
                            className="absolute"
                            style={{
                              left: 0,
                              top: -0.5,
                              width: pt.lineLen,
                              height: 1,
                              transformOrigin: "0 50%",
                              transform: pt.lineTransform,
                              background: `linear-gradient(90deg, ${c}00, ${c}f2, ${c}99)`,
                              boxShadow: `0 0 5px 0.5px ${c}80`,
                              opacity: 0,
                            }}
                          >
                            {/* feed particle streams point → base coordinate */}
                            <span
                              className="animate-feed motion-reduce:hidden absolute h-1 w-1 rounded-full"
                              style={
                                {
                                  left: -2,
                                  top: -2,
                                  background: c,
                                  boxShadow: `0 0 6px 1px ${c}`,
                                  animationDelay: `${(i % POINTS_PER) * 0.35 + (i % 5) * 0.12}s`,
                                  "--beam-len": `${pt.lineLen}px`,
                                } as CSSProperties
                              }
                            />
                          </div>
                          {/* the evidence point on the pillar slab */}
                          <span
                            ref={(el) => {
                              pointRefs.current[i] = el;
                            }}
                            className="absolute rounded-full"
                            style={{
                              left: -2.5,
                              top: -2.5,
                              width: 5,
                              height: 5,
                              background: c,
                              boxShadow: `0 0 7px 2px ${c}`,
                              transform: `translate3d(${pt.pos[0]}px,${pt.pos[1]}px,${pt.pos[2]}px)`,
                              opacity: 0,
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* the six slabs */}
                  {SLABS.map((slab, i) => (
                    <SlabPlane
                      key={slab.key}
                      slab={slab}
                      i={i}
                      label={dataCube.layers[i].label}
                      slabRef={(el) => {
                        slabRefs.current[i] = el;
                      }}
                      onPick={pickSlabGuarded}
                      pinned={pinned === slab.key}
                      active={activeKey === slab.key}
                      reduce={reduce}
                    />
                  ))}
                </div>
              </motion.div>

              {/* telemetry HUD (2D billboard) */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55"
              >
                {/* telemetry kept on the right; the left edge belongs to the
                    standing name-plate ladder */}
                <div className="absolute right-3 top-3 text-right leading-relaxed">
                  <div className="text-green-300/70">2050 · CUBE</div>
                  <div>ASSET 7F3A·22</div>
                  <div className="mt-1">LAT −3.4653</div>
                  <div>LON −62.2159</div>
                </div>
              </div>

              {/* inspect readout — the lit layer explains itself on the instrument */}
              <AnimatePresence>
                {activeSlab && activeLayer && (
                  <motion.div
                    key={activeSlab.key}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28 }}
                    className="pointer-events-none absolute left-1/2 top-12 z-10 w-[80%] max-w-[320px] -translate-x-1/2"
                  >
                    <div className="border border-white/15 bg-navy-950/75 px-3.5 py-2 backdrop-blur-sm">
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em]">
                        <span
                          className={`inline-block h-1.5 w-1.5 ${
                            activeSlab.accent === "green" ? "bg-green-400" : "bg-blue-300"
                          }`}
                        />
                        <span className="text-white/45">{activeSlab.index}</span>
                        <span className="text-white/90">{activeLayer.label}</span>
                        {activeSlab.isBind && <span className="text-white/35">· bind</span>}
                      </div>
                      <p className="mt-1 text-[11px] leading-snug text-white/65">{activeLayer.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* payoff plaque — the outcome of the bind */}
              <AnimatePresence>
                {bound && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.45, delay: 0.1 }}
                    className="pointer-events-none absolute bottom-12 left-1/2 z-10 -translate-x-1/2"
                  >
                    <div className="flex items-center gap-2.5 border border-white/15 bg-navy-950/70 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] backdrop-blur-sm">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                      <span className="text-white/70">{dataCube.hud.payoff.from}</span>
                      <span className="text-white/40">→</span>
                      <span className="font-semibold text-white">{dataCube.hud.payoff.to}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ---------------- Copy + legend ---------------- */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-green-400">
                {dataCube.eyebrow}
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {dataCube.headline}
              </h2>
              <p className="text-doc mt-5 text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
                {dataCube.body}
              </p>
            </Reveal>
            <div className="mt-7 flex items-center justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                {dataCube.hud.pickHint}
              </p>
              {!reduce && (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={playing ? dataCube.hud.pause : dataCube.hud.play}
                  className="flex shrink-0 items-center gap-1.5 border border-white/15 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/70 transition-colors hover:border-green-400/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/70"
                >
                  <span aria-hidden className="text-green-300/90">
                    {playing ? "❚❚" : "▶"}
                  </span>
                  <span>{playing ? "Pause" : "Play"}</span>
                </button>
              )}
            </div>
            {/* list runs top → bottom = Technical → Territory, mirroring the stack */}
            <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:grid-rows-3 sm:auto-rows-fr">
              {dataCube.layers
                .map((_, i) => i)
                .reverse()
                .map((i) => {
                const layer = dataCube.layers[i];
                const slab = SLABS[i];
                const pos = COUNT - 1 - i; // display position, top → bottom
                const active = activeKey !== null && activeKey === slab.key;
                const green = slab.accent === "green";
                return (
                  <Reveal as="li" key={layer.label} delay={pos * 0.04} y={12} className="list-none h-full">
                    <div
                      role="button"
                      tabIndex={0}
                      aria-pressed={pinned === slab.key}
                      onClick={() => pickSlab(slab.key)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          pickSlab(slab.key);
                        }
                      }}
                      onMouseEnter={() => setActiveKey(slab.key)}
                      onMouseLeave={() => setActiveKey(pinned)}
                      onFocus={() => setActiveKey(slab.key)}
                      onBlur={() => setActiveKey(pinned)}
                      className={`group flex h-full cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 text-sm outline-none transition-all duration-300 focus-visible:ring-1 focus-visible:ring-green-400/60 ${
                        active
                          ? green
                            ? "translate-x-1 border-green-400/60 bg-green-500/10 text-white"
                            : "translate-x-1 border-blue-300/60 bg-blue-500/10 text-white"
                          : "border-white/10 bg-white/[0.04] text-white/75 hover:border-white/25"
                      } ${pinned === slab.key ? "ring-1 ring-green-400/40" : ""}`}
                    >
                      <span
                        className={`h-4 w-[3px] shrink-0 transition-transform duration-300 ${
                          green ? "bg-green-400" : "bg-blue-300"
                        } ${active ? "scale-y-125 shadow-[0_0_10px_rgba(101,196,123,0.9)]" : ""}`}
                      />
                      <span className="flex-1">
                        <span className="flex items-center gap-1.5 font-medium">
                          {layer.label}
                          {slab.isBind && (
                            <span
                              className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35"
                              title="Geospatial ⊕ legal/regulatory — the bind"
                            >
                              bind
                            </span>
                          )}
                        </span>
                        <span className="block text-xs text-white/60">{layer.detail}</span>
                      </span>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity duration-300 ${
                          green ? "text-green-300" : "text-blue-200"
                        } ${active ? "opacity-70" : "opacity-0"}`}
                      >
                        {slab.index}
                      </span>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
            <Reveal delay={0.2} className="mt-9">
              <ButtonLink href={dataCube.cta.href} variant="ghost-dark" arrow>
                {dataCube.cta.label}
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
