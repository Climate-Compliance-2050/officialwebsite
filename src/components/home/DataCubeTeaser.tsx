"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SurveyBackdrop } from "@/components/ui/SurveyBackdrop";
import { dataCube } from "@/content/site";

/* ------------------------------------------------------------------ *
 * The Data Cube — C2050's core structure, rendered as an inspectable
 * mission-control instrument that NARRATES the company's one claim:
 *
 *   take a point from the territory → gather evidence from every pillar →
 *   feed it into the analysis core → geospatial (green) ⊕ legal (blue)
 *   lock to the coordinate → an environmental asset becomes a financial one.
 *
 * The instrument autospins (continuous yaw); the viewer can grab it and
 * fling it — the throw carries with inertia, then eases back into the spin.
 * Each pass, every pillar face seeds a small cluster of evidence points that
 * pop in and stream lines into the central analysis DOT. When the web
 * completes, the core locks to the coordinate (the bind). Then it dissolves
 * and re-gathers — a different web each pass.
 * ------------------------------------------------------------------ */

const FACE = 280; // px — outer cube face
const HALF = FACE / 2;
const STAGE = 560; // px — instrument stage
const REST_X = -16; // resting tilt — front/right faces read, top still visible
const REST_Y = 28; // starting yaw
const SPIN = 15; // deg/s — ambient autospin (vertical axis)
const MAX_FLING = 240; // deg/s — cap on a drag throw
const SPIN_FRICTION = 0.85; // how fast a throw eases back toward SPIN
const DRAG_K = 0.34; // px -> deg while dragging

const LOOP_MS = 8200; // one gather → web → dissolve pass
const POINTS_PER = 3; // evidence points per pillar face (5 pillars → ~15)

// gather/hold/fade windows as fractions of the loop
const GATHER_START = 0.05;
const GATHER_END = 0.46;
const FADE_START = 0.8;
const FADE_END = 0.97;
const POP = 0.06; // per-point pop-in duration (fraction of loop)

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
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

/** The bind trio (the differentiator). Territory is the point, not a pillar. */
const BIND = new Set(["geo", "legal", "reg"]);

type FaceDef = {
  key: string;
  label: string;
  index: string;
  axis: "x" | "y";
  angle: number;
  accent: "green" | "blue";
  transform: string;
  n: readonly [number, number, number];
};

function makeFace(
  key: string,
  label: string,
  index: string,
  axis: "x" | "y",
  angle: number,
  accent: "green" | "blue",
): FaceDef {
  const r = (angle * Math.PI) / 180;
  const n: [number, number, number] =
    axis === "y" ? [Math.sin(r), 0, Math.cos(r)] : [0, -Math.sin(r), Math.cos(r)];
  const transform =
    axis === "y"
      ? `rotateY(${angle}deg) translateZ(${HALF}px)`
      : `rotateX(${angle}deg) translateZ(${HALF}px)`;
  return { key, label, index, axis, angle, accent, transform, n };
}

// 6 faces, 1:1 with dataCube.layers (same order). Geospatial (front, green) and
// Legal (right, blue) are ADJACENT — their shared edge is the bind seam.
const FACES: FaceDef[] = [
  makeFace("territory", "Territory", "01", "x", 90, "green"),
  makeFace("geo", "Geospatial", "02", "y", 0, "green"),
  makeFace("legal", "Legal", "03", "y", 90, "blue"),
  makeFace("reg", "Regulatory", "04", "y", 180, "blue"),
  makeFace("sci", "Scientific", "05", "y", 270, "green"),
  makeFace("tech", "Technical", "06", "x", -90, "blue"),
];

const PILLARS = FACES.filter((f) => f.key !== "territory");

const ACCENT_HEX = { green: "#65c47b", blue: "#4d9fd6" } as const;

/** Diffuse shade (overlay opacity) for a face given the cube's live rotation. */
function faceShade(n: readonly [number, number, number], rxDeg: number, ryDeg: number) {
  const ax = (rxDeg * Math.PI) / 180;
  const ay = (ryDeg * Math.PI) / 180;
  const sx = Math.sin(ax);
  const cx = Math.cos(ax);
  const sy = Math.sin(ay);
  const cy = Math.cos(ay);
  const x1 = n[0] * cy + n[2] * sy;
  const y1 = n[1];
  const z1 = -n[0] * sy + n[2] * cy;
  const nx = x1;
  const ny = y1 * cx - z1 * sx;
  const nz = y1 * sx + z1 * cx;
  const dot = nx * 0.28 + ny * -0.32 + nz * 0.9;
  const bright = Math.max(0, dot);
  return clamp(0.42 - bright * 0.42, 0.03, 0.42);
}

/* -------------------- territory map (top face) -------------------- */

const TERRITORY_POINTS: ReadonlyArray<readonly [number, number]> = [
  [22, 28],
  [70, 18],
  [82, 56],
  [28, 70],
  [56, 84],
  [14, 50],
];

function TerritoryMap({ active }: { active: boolean }) {
  return (
    <div className={`absolute inset-0 transition-opacity duration-300 ${active ? "opacity-95" : "opacity-65"}`}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(101,196,123,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(101,196,123,0.16) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full text-green-300" aria-hidden>
        <path
          fill="rgba(101,196,123,0.06)"
          stroke="currentColor"
          strokeWidth={1.2}
          opacity={0.6}
          d="M24 22L74 14L102 38L96 78L66 104L26 92L14 54Z"
        />
      </svg>
      {TERRITORY_POINTS.map(([x, y], i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-green-300/70"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute -left-4 top-1/2 h-px w-8 -translate-y-1/2 bg-green-300/60" />
        <span className="absolute left-1/2 -top-4 h-8 w-px -translate-x-1/2 bg-green-300/60" />
        <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full border border-green-300/80" />
        <span className="absolute -left-0.5 -top-0.5 h-1 w-1 rounded-full bg-green-200 shadow-[0_0_10px_2px_rgba(101,196,123,0.9)]" />
      </div>
      <span className="absolute bottom-2 right-2.5 font-mono text-[10px] tracking-[0.14em] text-green-200/70">
        −3.4653 · −62.2159
      </span>
    </div>
  );
}

/* ------------------------- a single glass face ------------------------- */

function GlassFace({
  face,
  rotX,
  rotY,
  active,
  onActivate,
}: {
  face: FaceDef;
  rotX: MotionValue<number>;
  rotY: MotionValue<number>;
  active: boolean;
  onActivate: (key: string) => void;
}) {
  const shade = useTransform([rotX, rotY], ([rx, ry]: number[]) => faceShade(face.n, rx, ry));
  const shadeAdj = useTransform(shade, (s) => (active ? s * 0.18 : s));
  const green = face.accent === "green";

  return (
    <div
      onPointerEnter={() => onActivate(face.key)}
      className={`absolute inset-0 overflow-hidden border backdrop-blur-[1px] transition-[border-color,background-color,box-shadow] duration-300 ${
        active
          ? green
            ? "border-green-400/80 bg-green-500/[0.08] shadow-[0_0_36px_-6px_rgba(0,176,80,0.55)]"
            : "border-blue-300/80 bg-blue-500/[0.08] shadow-[0_0_36px_-6px_rgba(49,126,192,0.55)]"
          : green
            ? "border-green-400/30 bg-navy-800/15"
            : "border-blue-300/30 bg-navy-800/15"
      }`}
      style={{ transform: face.transform }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-black/15" />
      <motion.div className="absolute inset-0 bg-navy-950" style={{ opacity: shadeAdj }} />
      {face.key === "territory" && <TerritoryMap active={active} />}
      {face.key === "territory" && (
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent" />
      )}
      <span className="absolute left-3 top-2.5 font-mono text-[10px] tracking-[0.18em] text-white/55">
        {face.index}
      </span>
      <span
        className={`absolute bottom-3 left-3 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ${
          active ? (green ? "text-green-200" : "text-blue-100") : "text-white/85"
        }`}
      >
        {face.label}
      </span>
      {face.key === "territory" && (
        <span
          className={`absolute right-2 top-2 h-2.5 w-2.5 border-r border-t transition-colors duration-300 ${
            active ? "border-green-300/90" : "border-white/20"
          }`}
        />
      )}
    </div>
  );
}

/* --------------- interior: strata planes --------------- */

function Strata() {
  const planes = [
    { z: 92, tint: "rgba(101,196,123,0.30)" },
    { z: 52, tint: "rgba(77,159,214,0.28)" },
    { z: 12, tint: "rgba(101,196,123,0.22)" },
  ];
  return (
    <>
      {planes.map(({ z, tint }) => (
        <div
          key={z}
          className="absolute inset-8"
          style={{
            transform: `rotateX(90deg) translateZ(${z}px)`,
            border: `1px solid ${tint}`,
            backgroundImage: `linear-gradient(${tint} 1px, transparent 1px), linear-gradient(90deg, ${tint} 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
            opacity: 0.5,
          }}
        />
      ))}
    </>
  );
}

/* --------------------------- evidence web --------------------------- */

type Vec3 = readonly [number, number, number];

/** Orthonormal in-plane basis (right, up) for a face given its outward normal,
 *  so evidence points can be scattered across the face surface in 3D. */
function faceBasis(n: Vec3): { right: Vec3; up: Vec3 } {
  const ref: Vec3 = Math.abs(n[1]) > 0.9 ? [0, 0, 1] : [0, 1, 0];
  let rx = ref[1] * n[2] - ref[2] * n[1];
  let ry = ref[2] * n[0] - ref[0] * n[2];
  let rz = ref[0] * n[1] - ref[1] * n[0];
  const rl = Math.hypot(rx, ry, rz) || 1;
  rx /= rl;
  ry /= rl;
  rz /= rl;
  const ux = n[1] * rz - n[2] * ry;
  const uy = n[2] * rx - n[0] * rz;
  const uz = n[0] * ry - n[1] * rx;
  return { right: [rx, ry, rz], up: [ux, uy, uz] };
}

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

type WebPoint = {
  faceKey: string;
  accent: "green" | "blue";
  pos: Vec3;
  lineLen: number;
  lineTransform: string;
  tPop: number; // fraction of loop at which this point pops in
};

/** Build a pass's web: each pillar seeds POINTS_PER points scattered on its
 *  face, each with a line back to the core and a staggered pop time. */
function genWeb(cycle: number): WebPoint[] {
  const rand = mulberry32((0x9e3779b1 ^ (cycle * 0x6d2b79f5)) >>> 0);
  const out: WebPoint[] = [];
  const total = PILLARS.length * POINTS_PER;
  PILLARS.forEach((face, k) => {
    const { right, up } = faceBasis(face.n);
    for (let j = 0; j < POINTS_PER; j++) {
      const idx = k * POINTS_PER + j;
      const u = (rand() * 2 - 1) * HALF * 0.6;
      const v = (rand() * 2 - 1) * HALF * 0.6;
      const s = HALF * 0.94; // sit just under the glass
      const pos: Vec3 = [
        face.n[0] * s + right[0] * u + up[0] * v,
        face.n[1] * s + right[1] * u + up[1] * v,
        face.n[2] * s + right[2] * u + up[2] * v,
      ];
      const { len, transform } = seg([0, 0, 0], pos); // core → point
      const tPop =
        GATHER_START + (idx / total) * (GATHER_END - GATHER_START) + (rand() - 0.5) * 0.018;
      out.push({ faceKey: face.key, accent: face.accent, pos, lineLen: len, lineTransform: transform, tPop });
    }
  });
  return out;
}

/** A point's presence (0..1) at a given loop phase: pops in at tPop, holds,
 *  then every point fades together at FADE_START so the full web reads at once. */
function presence(phase: number, tPop: number) {
  if (phase < tPop) return 0;
  if (phase < tPop + POP) return smooth((phase - tPop) / POP);
  if (phase < FADE_START) return 1;
  if (phase < FADE_END) return 1 - smooth((phase - FADE_START) / (FADE_END - FADE_START));
  return 0;
}

/** Core intensity over the loop: dim, ramps up as evidence arrives, holds at
 *  the locked peak, then settles back as the web dissolves. */
function coreLevel(phase: number) {
  if (phase < GATHER_START) return 0.22;
  if (phase < GATHER_END) return 0.22 + 0.78 * smooth((phase - GATHER_START) / (GATHER_END - GATHER_START));
  if (phase < FADE_START) return 1;
  if (phase < FADE_END) return 0.22 + 0.78 * (1 - smooth((phase - FADE_START) / (FADE_END - FADE_START)));
  return 0.22;
}

/* ------------------------------ orbiter ------------------------------ */

function Orbit({ size, tilt, color, spin }: { size: number; tilt: number; color: string; spin: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 m-auto"
      style={{ width: 0, height: 0, transformStyle: "preserve-3d", transform: `rotateX(${tilt}deg)` }}
    >
      <div
        className="absolute rounded-full border"
        style={{ width: size, height: size, left: -size / 2, top: -size / 2, borderColor: `${color}1f` }}
      />
      <div className={`absolute left-0 top-0 ${spin}`}>
        <div
          className="absolute"
          style={{
            width: size / 2,
            height: 1,
            left: 0,
            top: 0,
            transformOrigin: "left center",
            background: `linear-gradient(90deg, transparent, ${color}66)`,
          }}
        />
        <div
          className="absolute h-2 w-2 rounded-full"
          style={{ left: size / 2 - 4, top: -4, background: color, boxShadow: `0 0 12px 2px ${color}` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------ section ------------------------------ */

type WebStage = "idle" | "collecting" | "bound";

export function DataCubeTeaser() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { margin: "-20% 0px -20% 0px" });
  const [activeFace, setActiveFace] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);

  const rotateX = useMotionValue(REST_X);
  const rotateY = useMotionValue(REST_Y);
  const tiltX = useSpring(0, { stiffness: 80, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 80, damping: 18 });
  const shadowScale = useTransform(rotateY, (ry) => 0.78 + 0.22 * Math.abs(Math.cos((ry * Math.PI) / 180)));

  const [playing, setPlaying] = useState(true);
  const [cycle, setCycle] = useState(0);
  const [stage, setStage] = useState<WebStage>("collecting");
  const bound = stage === "bound";

  const web = useMemo(() => genWeb(cycle), [cycle]);

  // refs the rAF loop writes to directly (bypasses React render churn)
  const pointRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const coreGlowRef = useRef<HTMLDivElement | null>(null);
  const webRef = useRef<WebPoint[]>(web);

  // pointer / spin state
  const ui = useRef({ dragging: false, hovering: false, px: 0, py: 0, vx: SPIN, tPrev: 0 });
  const yawVel = useRef(SPIN);
  const elapsed = useRef(0); // ms into the current pass
  const lastNow = useRef(0); // wall-clock timestamp of the previous frame
  const stageRefVal = useRef<WebStage>("collecting");
  const playingRef = useRef(true);
  const inViewRef = useRef(false);
  const activeRef = useRef<string | null>(null);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);
  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);
  useEffect(() => {
    activeRef.current = activeFace;
  }, [activeFace]);
  useEffect(() => {
    webRef.current = web;
  }, [web]);

  const setStageSafe = useCallback((s: WebStage) => {
    if (stageRefVal.current !== s) {
      stageRefVal.current = s;
      setStage(s);
    }
  }, []);

  // Reduced motion: render the completed web, locked core, no animation.
  useEffect(() => {
    if (!reduce) return;
    rotateX.set(REST_X);
    rotateY.set(REST_Y);
    web.forEach((_, i) => {
      const n = pointRefs.current[i];
      if (n) {
        n.style.opacity = "1";
        n.style.transform = "scale(1)";
      }
      const l = lineRefs.current[i];
      if (l) l.style.opacity = "0.5";
    });
    if (coreGlowRef.current) {
      coreGlowRef.current.style.opacity = "1";
      coreGlowRef.current.style.transform = "scale(1.1)";
    }
    setStageSafe("bound");
  }, [reduce, web, rotateX, rotateY, setStageSafe]);

  useAnimationFrame(() => {
    if (reduce || !inViewRef.current) {
      lastNow.current = 0;
      return;
    }
    // real wall-clock delta — frame-rate independent (framer clamps its own
    // delta; rAF can be throttled, e.g. in headless capture)
    const now = performance.now();
    const real = lastNow.current ? now - lastNow.current : 16;
    lastNow.current = now;
    const dt = Math.min(0.05, real / 1000);
    const s = ui.current;

    /* ---- rotation: autospin + inertial throw ---- */
    if (!s.dragging) {
      // ease the fling velocity back toward the ambient spin
      yawVel.current += (SPIN - yawVel.current) * Math.min(1, dt * SPIN_FRICTION);
      rotateY.set(rotateY.get() + yawVel.current * dt);
      // settle tilt back to the readable rest angle
      const rx = rotateX.get();
      rotateX.set(rx + (REST_X - rx) * Math.min(1, dt * 1.6));
    }

    if (!playingRef.current) return;

    /* ---- gather → web → dissolve clock ---- */
    elapsed.current += real;
    if (elapsed.current >= LOOP_MS) {
      elapsed.current -= LOOP_MS;
      setCycle((c) => c + 1); // regenerate the web for the next pass
    }
    const phase = elapsed.current / LOOP_MS;

    const pts = webRef.current;
    const act = activeRef.current;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const pr = presence(phase, p.tPop);
      const hot = act === p.faceKey;
      const node = pointRefs.current[i];
      if (node) {
        node.style.opacity = `${pr}`;
        node.style.transform = `scale(${0.3 + 0.7 * pr})`;
      }
      const line = lineRefs.current[i];
      if (line) line.style.opacity = `${pr * (hot ? 0.85 : 0.5)}`;
    }
    if (coreGlowRef.current) {
      const lvl = coreLevel(phase);
      coreGlowRef.current.style.opacity = `${0.3 + 0.7 * lvl}`;
      coreGlowRef.current.style.transform = `scale(${0.85 + 0.3 * lvl})`;
    }

    setStageSafe(phase > 0.52 && phase < FADE_START ? "bound" : "collecting");
  });

  const togglePlay = useCallback(() => setPlaying((p) => !p), []);

  /* ---- drag to rotate, release to fling ---- */
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = ui.current;
    s.dragging = true;
    s.px = e.clientX;
    s.py = e.clientY;
    s.vx = 0;
    s.tPrev = performance.now();
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = ui.current;
    if (s.dragging) {
      // hand the cube's momentum to the autospin loop
      yawVel.current = clamp(s.vx || SPIN, -MAX_FLING, MAX_FLING);
    }
    s.dragging = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = ui.current;
    if (s.dragging) {
      const dx = e.clientX - s.px;
      const dy = e.clientY - s.py;
      rotateY.set(rotateY.get() + dx * DRAG_K);
      rotateX.set(clamp(rotateX.get() - dy * DRAG_K, -82, 82));
      const now = performance.now();
      const dtm = (now - s.tPrev) / 1000;
      if (dtm > 0) s.vx = 0.6 * s.vx + 0.4 * ((dx * DRAG_K) / dtm); // smoothed deg/s
      s.px = e.clientX;
      s.py = e.clientY;
      s.tPrev = now;
      return;
    }
    if (reduce) return;
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    tiltY.set(clamp(nx, -1, 1) * 8);
    tiltX.set(clamp(-ny, -1, 1) * 8);
  };

  const onPointerEnter = () => {
    ui.current.hovering = true;
  };

  const onPointerLeave = () => {
    const s = ui.current;
    if (s.dragging) yawVel.current = clamp(s.vx || SPIN, -MAX_FLING, MAX_FLING);
    s.hovering = false;
    s.dragging = false;
    setActiveFace(pinned);
    tiltX.set(0);
    tiltY.set(0);
  };

  const pickFace = (key: string) => {
    setPinned((cur) => (cur === key ? null : key));
    setActiveFace(key);
  };

  const statusLine = !playing
    ? "paused"
    : bound
      ? "web bound · geospatial ⊕ legal · locked to coordinate"
      : "collecting layer evidence → analysis core…";

  return (
    <section
      ref={sectionRef}
      className="dark-section grain hairline-top relative overflow-hidden bg-navy-900 py-20 text-white lg:py-28"
    >
      <SurveyBackdrop ticks={false} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* ---------------- Cube instrument ---------------- */}
          <div className="relative order-2 flex items-center justify-center lg:order-1">
            <div
              ref={stageRef}
              className="corners corners-faint relative -my-24 grid scale-[0.58] cursor-grab place-items-center active:cursor-grabbing sm:-my-12 sm:scale-75 lg:my-0 lg:scale-100"
              style={{ width: STAGE, height: STAGE, perspective: 1400, touchAction: "pan-y" }}
              onPointerEnter={onPointerEnter}
              onPointerLeave={onPointerLeave}
              onPointerMove={onPointerMove}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              {/* geospatial grid backdrop */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                  maskImage: "radial-gradient(circle at center, black 28%, transparent 72%)",
                  WebkitMaskImage: "radial-gradient(circle at center, black 28%, transparent 72%)",
                }}
              />
              {/* scanline sweep */}
              <div
                aria-hidden
                className="animate-scan pointer-events-none absolute inset-x-12 top-1/2 h-px bg-gradient-to-r from-transparent via-green-400/60 to-transparent"
              />

              {/* tilt (parallax) layer */}
              <motion.div
                aria-hidden
                className="relative grid place-items-center"
                style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
              >
                <Orbit size={380} tilt={72} color="#65c47b" spin="animate-orbit-a" />
                <Orbit size={452} tilt={108} color="#4d9fd6" spin="animate-orbit-b" />

                {/* spinning cube */}
                <motion.div
                  className="relative"
                  style={{
                    width: FACE,
                    height: FACE,
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <Strata />

                  {/* evidence web — points scattered on each pillar face, each
                      streaming a line into the analysis core. */}
                  <div
                    className="absolute left-1/2 top-1/2"
                    style={{ width: 0, height: 0, transformStyle: "preserve-3d" }}
                  >
                    {web.map((p, i) => {
                      const c = ACCENT_HEX[p.accent];
                      return (
                        <div key={i} className="absolute" style={{ transformStyle: "preserve-3d" }}>
                          {/* line: core → point */}
                          <div
                            ref={(el) => {
                              lineRefs.current[i] = el;
                            }}
                            className="absolute"
                            style={{
                              left: 0,
                              top: -0.5,
                              width: p.lineLen,
                              height: 1,
                              transformOrigin: "0 50%",
                              transform: p.lineTransform,
                              background: `linear-gradient(90deg, ${c}26, ${c}73, ${c}00)`,
                              opacity: 0,
                            }}
                          >
                            {/* feed particle streams point → core */}
                            <span
                              className="animate-feed motion-reduce:hidden absolute h-1 w-1 rounded-full"
                              style={
                                {
                                  left: -2,
                                  top: -2,
                                  background: c,
                                  boxShadow: `0 0 6px 1px ${c}`,
                                  animationDelay: `${(i % POINTS_PER) * 0.35 + (i % 5) * 0.12}s`,
                                  "--beam-len": `${p.lineLen}px`,
                                } as CSSProperties
                              }
                            />
                          </div>
                          {/* evidence point on the face */}
                          <div
                            className="absolute"
                            style={{
                              transform: `translate3d(${p.pos[0]}px,${p.pos[1]}px,${p.pos[2]}px)`,
                              transformStyle: "preserve-3d",
                            }}
                          >
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
                                opacity: 0,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* the analysis core — where the evidence locks to the
                      coordinate (geospatial green ⊕ legal blue). */}
                  <div
                    ref={coreGlowRef}
                    className="absolute inset-0 m-auto h-24 w-24 rounded-full bg-green-500/30 blur-2xl"
                    style={{ opacity: 0.3 }}
                  />
                  <div className="absolute inset-0 m-auto h-11 w-11 rounded-full bg-blue-500/30 blur-lg" />
                  {/* bicolour lock ring — appears once the web is bound */}
                  <div
                    className={`animate-lock motion-reduce:animate-none absolute inset-0 m-auto h-9 w-9 rounded-full transition-opacity duration-500 ${
                      bound ? "opacity-90" : "opacity-0"
                    }`}
                    style={{
                      background: "conic-gradient(from 0deg, #65c47b, #4d9fd6, #65c47b)",
                      WebkitMask: "radial-gradient(closest-side, transparent 64%, #000 66%)",
                      mask: "radial-gradient(closest-side, transparent 64%, #000 66%)",
                    }}
                  />
                  <div
                    className={`absolute inset-0 m-auto h-4 w-4 rounded-full transition-all duration-300 ${
                      bound ? "bg-white" : "bg-green-200"
                    }`}
                    style={{
                      boxShadow: bound
                        ? "0 0 26px 7px rgba(101,196,123,0.85), 0 0 18px 5px rgba(77,159,214,0.7)"
                        : "0 0 22px 6px rgba(101,196,123,0.75)",
                    }}
                  />

                  {FACES.map((face) => (
                    <GlassFace
                      key={face.key}
                      face={face}
                      rotX={rotateX}
                      rotY={rotateY}
                      active={activeFace === face.key}
                      onActivate={setActiveFace}
                    />
                  ))}
                </motion.div>

                {/* contact shadow */}
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[70px] w-[310px] rounded-full"
                  style={{ transform: `translate(-50%, ${HALF + 44}px) rotateX(74deg)` }}
                >
                  <motion.div
                    className="h-full w-full rounded-full bg-black/55 blur-2xl"
                    style={{ scaleX: shadowScale }}
                  />
                </div>
              </motion.div>

              {/* lock-on reticle (2D billboard, always viewer-facing) */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="relative h-28 w-28">
                  <span className="animate-lock motion-reduce:animate-none absolute inset-0 rounded-full border border-dashed border-green-300/35" />
                  <span
                    className={`absolute inset-[14px] rounded-full border transition-colors duration-500 ${
                      bound ? "border-blue-300/40" : "border-green-300/15"
                    }`}
                  />
                  <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-gradient-to-b from-green-300/80 to-transparent" />
                  <span className="absolute bottom-0 left-1/2 h-4 w-px -translate-x-1/2 bg-gradient-to-t from-blue-300/80 to-transparent" />
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-gradient-to-r from-green-300/80 to-transparent" />
                  <span className="absolute right-0 top-1/2 h-px w-4 -translate-y-1/2 bg-gradient-to-l from-blue-300/80 to-transparent" />
                </div>
              </div>

              {/* bind tag (2D billboard) — names the differentiator at the core */}
              <AnimatePresence>
                {bound && (
                  <motion.div
                    aria-hidden
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 translate-y-[64px] whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em]"
                  >
                    <span className="text-green-300">Geospatial</span>
                    <span className="px-1 text-white/70">⊕</span>
                    <span className="text-blue-200">Legal</span>
                    <span className="ml-1.5 text-white/45">· locked to coordinate</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* telemetry HUD */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55"
              >
                <div className="absolute left-3 top-3 leading-relaxed">
                  <div className="text-green-300/70">2050 · CUBE</div>
                  <div>ASSET 7F3A·22</div>
                </div>
                <div className="absolute right-3 top-3 text-right leading-relaxed">
                  <div>LAT −3.4653</div>
                  <div>LON −62.2159</div>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <span>{statusLine}</span>
                </div>
                <div className="absolute bottom-3 right-3 text-right">
                  <span className="tnum">5 pillars · 1 point</span>
                </div>
              </div>

              {/* payoff plaque — the outcome of the bind: environmental → financial */}
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

          {/* ---------------- Copy + interactive layers ---------------- */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-green-400">
                {dataCube.eyebrow}
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {dataCube.headline}
              </h2>
              <p className="mt-5 text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
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
            <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:grid-rows-3 sm:auto-rows-fr">
              {dataCube.layers.map((layer, i) => {
                const face = FACES[i];
                const active = activeFace !== null && activeFace === face.key;
                const green = face.accent === "green";
                const isBind = BIND.has(face.key);
                return (
                  <Reveal as="li" key={layer.label} delay={i * 0.04} y={12} className="list-none h-full">
                    <div
                      role="button"
                      tabIndex={0}
                      aria-pressed={pinned === face.key}
                      onClick={() => pickFace(face.key)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          pickFace(face.key);
                        }
                      }}
                      onMouseEnter={() => setActiveFace(face.key)}
                      onMouseLeave={() => setActiveFace(pinned)}
                      onFocus={() => setActiveFace(face.key)}
                      onBlur={() => setActiveFace(pinned)}
                      className={`group flex h-full cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 text-sm outline-none transition-all duration-300 focus-visible:ring-1 focus-visible:ring-green-400/60 ${
                        active
                          ? green
                            ? "translate-x-1 border-green-400/60 bg-green-500/10 text-white"
                            : "translate-x-1 border-blue-300/60 bg-blue-500/10 text-white"
                          : "border-white/10 bg-white/[0.04] text-white/75 hover:border-white/25"
                      } ${pinned === face.key ? "ring-1 ring-green-400/40" : ""}`}
                    >
                      <span
                        className={`h-4 w-[3px] shrink-0 transition-transform duration-300 ${
                          green ? "bg-green-400" : "bg-blue-300"
                        } ${active ? "scale-y-125 shadow-[0_0_10px_rgba(101,196,123,0.9)]" : ""}`}
                      />
                      <span className="flex-1">
                        <span className="flex items-center gap-1.5 font-medium">
                          {layer.label}
                          {isBind && (
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
                        {face.index}
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
