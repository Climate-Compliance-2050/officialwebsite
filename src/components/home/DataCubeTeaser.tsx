"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
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
 * mission-control instrument.
 *
 * Top face        = the TERRITORY (coordinate grid + plotted points).
 * Side faces      = Geospatial · Scientific · Legal · Regulatory.
 * Bottom face     = Technical.
 * Inside the glass: data beams feed from every face and intersect at
 * one glowing node — the validated point of value. Clicking the node
 * runs a layer-by-layer secure validation in a HUD panel.
 * ------------------------------------------------------------------ */

const FACE = 280; // px — outer cube face
const HALF = FACE / 2;
const STAGE = 560; // px — instrument stage
const REST_X = -26; // resting tilt (shows the territory top face)
const REST_Y = -32;
const AUTO_SPIN = 12; // deg/s ambient rotation
const DRAG_K = 0.36; // px -> deg while dragging
const STEP_MS = 460; // per-layer validation cadence

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

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

// 6 faces, 1:1 with dataCube.layers (same order): territory on top,
// the four data disciplines around the sides, technical underneath.
const FACES: FaceDef[] = [
  makeFace("territory", "Territory", "01", "x", 90, "green"),
  makeFace("geo", "Geospatial", "02", "y", 0, "green"),
  makeFace("sci", "Scientific", "03", "y", 90, "blue"),
  makeFace("legal", "Legal", "04", "y", 180, "green"),
  makeFace("reg", "Regulatory", "05", "y", 270, "blue"),
  makeFace("tech", "Technical", "06", "x", -90, "blue"),
];

const ACCENT_HEX = { green: "#65c47b", blue: "#4d9fd6" } as const;

/** Diffuse shade (overlay opacity) for a face given the cube's live rotation.
 *  Kept light so the interior intersection stays readable through the glass. */
function faceShade(n: readonly [number, number, number], rxDeg: number, ryDeg: number) {
  const ax = (rxDeg * Math.PI) / 180;
  const ay = (ryDeg * Math.PI) / 180;
  const sx = Math.sin(ax);
  const cx = Math.cos(ax);
  const sy = Math.sin(ay);
  const cy = Math.cos(ay);
  // N = Rx(ax) * Ry(ay) * n
  const x1 = n[0] * cy + n[2] * sy;
  const y1 = n[1];
  const z1 = -n[0] * sy + n[2] * cy;
  const nx = x1;
  const ny = y1 * cx - z1 * sx;
  const nz = y1 * sx + z1 * cx;
  // light from upper-front
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
      {/* coordinate grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(101,196,123,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(101,196,123,0.16) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* territory boundary */}
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full text-green-300" aria-hidden>
        <path
          fill="rgba(101,196,123,0.06)"
          stroke="currentColor"
          strokeWidth={1.2}
          opacity={0.6}
          d="M24 22L74 14L102 38L96 78L66 104L26 92L14 54Z"
        />
      </svg>
      {/* plotted data points */}
      {TERRITORY_POINTS.map(([x, y], i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-green-300/70"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
      {/* the marked point — coordinates anchored to the intersection below */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute -left-4 top-1/2 h-px w-8 -translate-y-1/2 bg-green-300/60" />
        <span className="absolute left-1/2 -top-4 h-8 w-px -translate-x-1/2 bg-green-300/60" />
        <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full border border-green-300/80" />
        <span className="absolute -left-0.5 -top-0.5 h-1 w-1 rounded-full bg-green-200 shadow-[0_0_8px_2px_rgba(101,196,123,0.9)]" />
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
      {/* glass body */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-black/15" />
      {/* directional shade */}
      <motion.div className="absolute inset-0 bg-navy-950" style={{ opacity: shadeAdj }} />
      {/* face content — only the Territory (top) face carries detail;
          the data discipline faces stay deliberately bare so the interior
          constellation reads clearly through the glass. */}
      {face.key === "territory" && <TerritoryMap active={active} />}
      {/* top rim light — Territory only */}
      {face.key === "territory" && (
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent" />
      )}
      {/* index + label */}
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
      {/* corner reticle tick — Territory only */}
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

/* --------------- interior: strata, beams, intersection --------------- */

/** Translucent data-layer planes stacked beneath the territory face. */
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

/* --------------------------- constellation --------------------------- */

type Vec3 = readonly [number, number, number];

/** Each layer's data node lives inside the glass, pushed off its face's
 *  normal axis so the network reads as an irregular constellation rather
 *  than a symmetric set of radial spokes. Depths/offsets are deterministic
 *  (no per-render jitter). */
const NODE_DEPTH: Record<string, number> = {
  territory: 96,
  geo: 78,
  sci: 88,
  legal: 70,
  reg: 82,
  tech: 92,
};
const NODE_OFFSET: Record<string, Vec3> = {
  territory: [16, 0, -20],
  geo: [-24, 20, 0],
  sci: [0, -22, 16],
  legal: [22, -16, 0],
  reg: [0, 24, -14],
  tech: [-16, 0, 22],
};

/** Faint cross-links woven between layer nodes — the constellation web. */
const LINKS: ReadonlyArray<readonly [string, string]> = [
  ["territory", "geo"],
  ["territory", "sci"],
  ["geo", "reg"],
  ["sci", "legal"],
  ["legal", "tech"],
  ["reg", "tech"],
];

function nodePos(face: FaceDef): Vec3 {
  const d = NODE_DEPTH[face.key];
  const o = NODE_OFFSET[face.key];
  return [face.n[0] * d + o[0], face.n[1] * d + o[1], face.n[2] * d + o[2]];
}

/** Transform that lays a 1px element from 3D point p0 toward p1.
 *  The element extends along its local +X from a left-center origin, so it
 *  is rotated by aligning +X onto the (p1-p0) direction via axis-angle. */
function seg(p0: Vec3, p1: Vec3) {
  const dx = p1[0] - p0[0];
  const dy = p1[1] - p0[1];
  const dz = p1[2] - p0[2];
  const len = Math.hypot(dx, dy, dz) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const uz = dz / len;
  // axis = cross((1,0,0), u) = (0, -uz, uy)
  let ax = 0;
  let ay = -uz;
  let az = uy;
  const an = Math.hypot(ax, ay, az);
  if (an < 1e-6) {
    ax = 0;
    ay = 0;
    az = 1; // u parallel to X — any perpendicular axis works
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

/** The interior network: faint web between layer nodes, plus a primary
 *  spoke from each node into the highlighted intersection, fed by a
 *  particle travelling node → centre. */
function Constellation({ validatingKey }: { validatingKey: string | null }) {
  const center: Vec3 = [0, 0, 0];
  const positions: Record<string, Vec3> = {};
  for (const f of FACES) positions[f.key] = nodePos(f);

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{ width: 0, height: 0, transformStyle: "preserve-3d" }}
    >
      {/* constellation web */}
      {LINKS.map(([a, b], i) => {
        const { len, transform } = seg(positions[a], positions[b]);
        const c = ACCENT_HEX[FACES.find((f) => f.key === a)!.accent];
        const hot = validatingKey === a || validatingKey === b;
        return (
          <div
            key={`web-${i}`}
            className="absolute transition-opacity duration-300"
            style={{
              left: 0,
              top: -0.5,
              width: len,
              height: 1,
              transformOrigin: "0 50%",
              transform,
              background: `linear-gradient(90deg, ${c}00, ${c}59, ${c}00)`,
              opacity: hot ? 0.85 : 0.3,
            }}
          />
        );
      })}

      {/* primary spokes + feed particles + layer nodes */}
      {FACES.map((face, i) => {
        const c = ACCENT_HEX[face.accent];
        const hot = validatingKey === face.key;
        const p = positions[face.key];
        const { len, transform } = seg(center, p); // centre → node
        return (
          <div key={face.key} className="absolute" style={{ transformStyle: "preserve-3d" }}>
            {/* spoke */}
            <div
              className="absolute transition-opacity duration-200"
              style={{
                left: 0,
                top: hot ? -1 : -0.5,
                width: len,
                height: hot ? 2 : 1,
                transformOrigin: "0 50%",
                transform,
                background: `linear-gradient(90deg, ${c}d9, ${c}14)`,
                boxShadow: hot ? `0 0 10px 1px ${c}` : undefined,
                opacity: hot ? 1 : 0.42,
              }}
            />
            {/* feed particle: travels node → centre along the spoke */}
            <div
              className="absolute"
              style={{ left: 0, top: 0, transformOrigin: "0 50%", transform, transformStyle: "preserve-3d" }}
            >
              <span
                className="animate-feed motion-reduce:hidden absolute h-1.5 w-1.5 rounded-full"
                style={
                  {
                    left: -3,
                    top: -3,
                    background: c,
                    boxShadow: `0 0 8px 2px ${c}`,
                    animationDelay: `${i * 0.4}s`,
                    animationDuration: hot ? "1.1s" : undefined,
                    "--beam-len": `${len}px`,
                  } as CSSProperties
                }
              />
            </div>
            {/* layer node */}
            <div
              className="absolute"
              style={{ transform: `translate3d(${p[0]}px,${p[1]}px,${p[2]}px)`, transformStyle: "preserve-3d" }}
            >
              <span
                className="animate-twinkle motion-reduce:animate-none absolute rounded-full"
                style={{
                  left: -2.5,
                  top: -2.5,
                  width: 5,
                  height: 5,
                  background: c,
                  boxShadow: `0 0 8px 2px ${c}`,
                  animationDelay: `${i * 0.5}s`,
                  opacity: hot ? 1 : 0.85,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------ validation sequence ------------------------ */

type VStatus = "idle" | "running" | "done";
type VRow = { hash: string; time: string };

/* ------------------------------ orbiter ------------------------------ */

function Orbit({
  size,
  tilt,
  color,
  spin,
}: {
  size: number;
  tilt: number;
  color: string;
  spin: string;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 m-auto"
      style={{ width: 0, height: 0, transformStyle: "preserve-3d", transform: `rotateX(${tilt}deg)` }}
    >
      {/* orbit path */}
      <div
        className="absolute rounded-full border"
        style={{
          width: size,
          height: size,
          left: -size / 2,
          top: -size / 2,
          borderColor: `${color}1f`,
        }}
      />
      {/* spinning node carrier */}
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
          style={{
            left: size / 2 - 4,
            top: -4,
            background: color,
            boxShadow: `0 0 12px 2px ${color}`,
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------ section ------------------------------ */

export function DataCubeTeaser() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeFace, setActiveFace] = useState<string | null>(null);

  const rotateX = useMotionValue(REST_X);
  const rotateY = useMotionValue(REST_Y);
  const tiltX = useSpring(0, { stiffness: 80, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 80, damping: 18 });
  const shadowScale = useTransform(rotateY, (ry) => 0.78 + 0.22 * Math.abs(Math.cos((ry * Math.PI) / 180)));

  const ui = useRef({ dragging: false, hovering: false, spinVel: AUTO_SPIN, px: 0, py: 0, moved: 0 });

  /* ---- secure point validation ---- */
  const [vStatus, setVStatus] = useState<VStatus>("idle");
  const [vStep, setVStep] = useState(0); // layers completed
  const [vRows, setVRows] = useState<VRow[]>([]);
  const vTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = () => {
    if (vTimer.current) clearInterval(vTimer.current);
    vTimer.current = null;
  };
  useEffect(() => stopTimer, []);

  const startValidation = () => {
    if (ui.current.moved > 8) return; // it was a drag, not a click
    if (vStatus === "running") return;
    stopTimer();
    const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
    setVRows(
      FACES.map(() => ({
        hash: `#${Math.random().toString(16).slice(2, 6)}`,
        time,
      })),
    );
    setVStep(0);
    setVStatus("running");
    setActiveFace(FACES[0].key);
    vTimer.current = setInterval(() => {
      setVStep((s) => {
        const next = s + 1;
        if (next >= FACES.length) {
          stopTimer();
          setVStatus("done");
          setActiveFace(null);
        } else {
          setActiveFace(FACES[next].key);
        }
        return next;
      });
    }, STEP_MS);
  };

  const closeValidation = () => {
    stopTimer();
    setVStatus("idle");
    setVStep(0);
    setActiveFace(null);
  };

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const s = ui.current;
    if (s.dragging) return;
    const dt = Math.min(0.05, delta / 1000);
    if (!s.hovering) {
      rotateY.set(rotateY.get() + s.spinVel * dt);
      s.spinVel += (AUTO_SPIN - s.spinVel) * Math.min(1, dt * 0.8);
    }
    const rx = rotateX.get();
    rotateX.set(rx + (REST_X - rx) * Math.min(1, dt * 1.4));
  });

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = ui.current;
    s.dragging = true;
    s.moved = 0;
    s.px = e.clientX;
    s.py = e.clientY;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    ui.current.dragging = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = ui.current;
    if (s.dragging) {
      const dx = e.clientX - s.px;
      const dy = e.clientY - s.py;
      s.moved += Math.abs(dx) + Math.abs(dy);
      rotateY.set(rotateY.get() + dx * DRAG_K);
      rotateX.set(clamp(rotateX.get() - dy * DRAG_K, -82, 82));
      s.spinVel = clamp(dx * DRAG_K * 60, -260, 260); // carry fling into auto-resume
      s.px = e.clientX;
      s.py = e.clientY;
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
    s.hovering = false;
    s.dragging = false;
    if (vStatus !== "running") setActiveFace(null);
    tiltX.set(0);
    tiltY.set(0);
  };

  const validatingKey = vStatus === "running" && vStep < FACES.length ? FACES[vStep].key : null;

  return (
    <section className="dark-section grain hairline-top relative overflow-hidden bg-navy-900 py-20 text-white lg:py-28">
      <SurveyBackdrop ticks={false} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* ---------------- Cube instrument ---------------- */}
          <div className="relative order-2 flex items-center justify-center lg:order-1">
            <div
              ref={stageRef}
              className="corners corners-faint relative -my-24 grid scale-[0.58] place-items-center sm:-my-12 sm:scale-75 lg:my-0 lg:scale-100"
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
                  className="relative cursor-grab active:cursor-grabbing"
                  style={{
                    width: FACE,
                    height: FACE,
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* interior first so the glass renders over it */}
                  <Strata />
                  <Constellation validatingKey={validatingKey} />

                  {/* the intersection node — the highlighted validated point.
                      Layered halo + core dot. The lock-on reticle is drawn
                      as a 2D overlay below (always faces the viewer). */}
                  <div className="animate-core absolute inset-0 m-auto h-24 w-24 rounded-full bg-green-500/30 blur-2xl" />
                  <div className="absolute inset-0 m-auto h-11 w-11 rounded-full bg-green-300/35 blur-lg" />
                  <div
                    className={`absolute inset-0 m-auto h-4 w-4 rounded-full transition-colors duration-300 ${
                      vStatus === "done" ? "bg-green-100" : "bg-green-200"
                    } shadow-[0_0_28px_8px_rgba(101,196,123,0.9)]`}
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

              {/* lock-on reticle (2D — cube centre always projects to stage
                  centre, so this billboard stays crisp and viewer-facing) */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="relative h-28 w-28">
                  <span className="animate-lock motion-reduce:animate-none absolute inset-0 rounded-full border border-dashed border-green-300/35" />
                  <span className="absolute inset-[14px] rounded-full border border-green-300/15" />
                  <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-gradient-to-b from-green-300/80 to-transparent" />
                  <span className="absolute bottom-0 left-1/2 h-4 w-px -translate-x-1/2 bg-gradient-to-t from-green-300/80 to-transparent" />
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-gradient-to-r from-green-300/80 to-transparent" />
                  <span className="absolute right-0 top-1/2 h-px w-4 -translate-y-1/2 bg-gradient-to-l from-green-300/80 to-transparent" />
                </div>
              </div>

              {/* intersection hit target (2D — cube centre always projects here) */}
              <button
                type="button"
                onClick={startValidation}
                onPointerDown={(e) => {
                  // keep the stage from capturing the pointer — capture retargets
                  // the click away from this button
                  e.stopPropagation();
                  ui.current.moved = 0;
                }}
                aria-label="Validate the intersection point across all data layers"
                className="absolute left-1/2 top-1/2 z-20 h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-green-400/70"
              />

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
                  <span>
                    {vStatus === "running"
                      ? "validating layers…"
                      : vStatus === "done"
                        ? "point validated"
                        : "tap the core · validate point"}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 text-right">
                  <span className="tnum">6 layers · 1 point</span>
                </div>
              </div>

            </div>

            {/* point-validation HUD panel (outside the scaled stage so it stays readable) */}
            <AnimatePresence>
              {vStatus !== "idle" && (
                <motion.div
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.22 }}
                  className="absolute right-0 top-2 z-30 w-[268px] border border-green-400/40 bg-navy-950/90 font-mono text-[10px] uppercase tracking-[0.12em] backdrop-blur-md sm:right-2 sm:top-6"
                >
                    <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                      <span className="text-green-300/90">Point validation · 7F3A·22</span>
                      <button
                        type="button"
                        onClick={closeValidation}
                        aria-label="Close validation panel"
                        className="cursor-pointer px-1 text-white/50 transition-colors hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                    <ul className="px-3 py-2">
                      {FACES.map((face, i) => {
                        const ok = i < vStep || vStatus === "done";
                        const busy = vStatus === "running" && i === vStep;
                        const green = face.accent === "green";
                        return (
                          <li key={face.key} className="flex items-center gap-2 py-[3px]">
                            <span
                              className={
                                ok
                                  ? green
                                    ? "text-green-300"
                                    : "text-blue-200"
                                  : busy
                                    ? "animate-pulse text-white/80"
                                    : "text-white/40"
                              }
                            >
                              {ok ? "✓" : busy ? "⟳" : "·"}
                            </span>
                            <span className={ok || busy ? "flex-1 text-white/85" : "flex-1 text-white/50"}>
                              {face.label}
                            </span>
                            {ok ? (
                              <>
                                <span className={green ? "text-green-300/70" : "text-blue-200/70"}>
                                  {vRows[i]?.hash}
                                </span>
                                <span className="tnum text-white/50">{vRows[i]?.time}</span>
                              </>
                            ) : (
                              <span className="text-white/45">{busy ? "validating…" : "queued"}</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    <div
                      className={`flex items-center gap-1.5 border-t px-3 py-2 ${
                        vStatus === "done"
                          ? "border-green-400/30 text-green-300"
                          : "border-white/10 text-white/55"
                      }`}
                    >
                      {vStatus === "done" ? (
                        <span>Point validated · decision-grade</span>
                      ) : (
                        <span className="tnum">
                          Secure · {vStep}/{FACES.length} layers
                        </span>
                      )}
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
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
            <ul className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:grid-rows-3 sm:auto-rows-fr">
              {dataCube.layers.map((layer, i) => {
                const face = FACES[i];
                const active = activeFace !== null && activeFace === face.key;
                const green = face.accent === "green";
                return (
                  <Reveal as="li" key={layer.label} delay={i * 0.04} y={12} className="list-none h-full">
                    <div
                      tabIndex={0}
                      onMouseEnter={() => setActiveFace(face.key)}
                      onMouseLeave={() => setActiveFace(null)}
                      onFocus={() => setActiveFace(face.key)}
                      onBlur={() => setActiveFace(null)}
                      className={`group flex h-full items-center gap-3 rounded-sm border px-4 py-3 text-sm outline-none transition-all duration-300 focus-visible:ring-1 focus-visible:ring-green-400/60 ${
                        active
                          ? green
                            ? "translate-x-1 border-green-400/60 bg-green-500/10 text-white"
                            : "translate-x-1 border-blue-300/60 bg-blue-500/10 text-white"
                          : "border-white/10 bg-white/[0.04] text-white/75 hover:border-white/25"
                      }`}
                    >
                      <span
                        className={`h-4 w-[3px] shrink-0 transition-transform duration-300 ${
                          green ? "bg-green-400" : "bg-blue-300"
                        } ${active ? "scale-y-125 shadow-[0_0_10px_rgba(101,196,123,0.9)]" : ""}`}
                      />
                      <span className="flex-1">
                        <span className="block font-medium">{layer.label}</span>
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
