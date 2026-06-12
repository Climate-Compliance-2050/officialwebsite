"use client";

import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { MONITOR_SITES } from "@/content/monitor";

const RADIUS = 1;
/** sweep longitude advance, rad/s — one survey revolution ≈ 52 s */
const SCAN_SPEED = 0.12;
/** latitude survey band advance, rad/s — secondary scan axis */
const SCAN_LAT_SPEED = 0.07;
const DEG = Math.PI / 180;
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const X_AXIS = new THREE.Vector3(1, 0, 0);

function lonLatToVec3(lon: number, lat: number, r = RADIUS): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

/** Orientation that slews a given lon/lat to face the camera (front, +Z), lifted just above centre. */
function targetQuat(lon: number, lat: number): THREE.Quaternion {
  const theta = (lon + 180) * DEG;
  const beta = Math.PI / 2 - theta; // yaw: bring the meridian to the camera
  const gamma = lat * DEG - 0.05; // pitch: bring the latitude to screen centre (slight lift)
  const qYaw = new THREE.Quaternion().setFromAxisAngle(Y_AXIS, beta);
  const qPitch = new THREE.Quaternion().setFromAxisAngle(X_AXIS, gamma);
  return qPitch.multiply(qYaw); // yaw first, then pitch (world axes)
}

const surveyVertex = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vPos = normalize(position);
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

/**
 * The survey shader: matte navy earth with engraved hairline coastlines
 * (signed-distance field texture) and a faint 10° graticule. A sensor swath
 * sweeps in longitude; land in its wake resolves into 2° analysis cells that
 * decay, while cells over monitored territories persist as a green evidence
 * lattice. Geographic frame matches lonLatToVec3.
 */
const surveyFragment = /* glsl */ `
  #define SITE_COUNT ${MONITOR_SITES.length}

  uniform sampler2D uSdf;
  uniform float uScan;
  uniform float uScanLat;
  uniform vec3 uSites[SITE_COUNT];

  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vView;

  const float PI = 3.141592653589793;
  const float GRAT = PI / 18.0;   // 10° graticule
  const float CELL = PI / 90.0;   // 2° analysis cells
  const float TRAIL = 0.38;       // resolve trail behind the sweep, rad
  const float COS_IN = 0.99452;   // cos 6° — monitored cap, full strength
  const float COS_OUT = 0.98769;  // cos 9° — monitored cap, edge

  float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  void main() {
    vec3 p = normalize(vPos);
    float phi = acos(clamp(p.y, -1.0, 1.0));
    float theta = atan(p.z, -p.x);
    float lat = PI * 0.5 - phi;
    float lon = theta - PI;

    float wAA = fwidth(lat) * 1.5 + 1e-5;

    // landmask SDF: 0.5 = coastline, > 0.5 = land
    vec2 uv = vec2(theta / (2.0 * PI), 1.0 - phi / PI);
    float sd = texture2D(uSdf, uv).r;
    float sdw = min(fwidth(sd), 0.08) * 1.4 + 1e-4;
    float land = smoothstep(0.5 - sdw * 0.5, 0.5 + sdw * 0.5, sd);
    float coast = 1.0 - smoothstep(0.0, sdw, abs(sd - 0.5));

    // matte navy ocean, lifted navy land
    vec3 col = mix(vec3(0.047, 0.094, 0.169), vec3(0.078, 0.145, 0.243), land);

    // graticule, meridians faded toward the poles
    float gLon = abs(fract(lon / GRAT + 0.5) - 0.5) * GRAT;
    float gLat = abs(fract(lat / GRAT + 0.5) - 0.5) * GRAT;
    float grat = (1.0 - smoothstep(0.0, wAA, gLon)) * sin(phi)
               + (1.0 - smoothstep(0.0, wAA, gLat));
    col += vec3(1.0) * grat * 0.04;

    // engraved coastline
    col = mix(col, vec3(0.54, 0.65, 0.80), coast * 0.65);

    // monitored territories: spherical caps around sites
    float mon = 0.0;
    for (int i = 0; i < SITE_COUNT; i++) {
      mon = max(mon, smoothstep(COS_OUT, COS_IN, dot(p, uSites[i])));
    }

    // analysis cells: hairline grid + hashed per-cell density
    float cLon = abs(fract(lon / CELL + 0.5) - 0.5) * CELL;
    float cLat = abs(fract(lat / CELL + 0.5) - 0.5) * CELL;
    float cellLine = max(1.0 - smoothstep(0.0, wAA, cLon),
                         1.0 - smoothstep(0.0, wAA, cLat));
    vec2 cellId = floor(vec2(lon, lat) / CELL);
    float h = hash21(cellId);
    float density = step(0.6, h) * (0.25 + 0.4 * h);

    // evidence lattice — persists over monitored land
    vec3 green = vec3(0.20, 0.82, 0.48);
    float lattice = mon * land * (cellLine * 0.34 + density * 0.13 + 0.04);
    col = mix(col, green, min(lattice, 0.5));

    // sensor sweep: meridian line + staggered cell resolve in its wake
    float ds = atan(sin(lon - uScan), cos(lon - uScan));
    float trail = clamp(1.0 + ds / TRAIL, 0.0, 1.0) * (1.0 - step(0.0, ds));
    float flash = smoothstep(h * 0.7, h * 0.7 + 0.2, trail) * trail;
    vec3 flashCol = mix(vec3(0.34, 0.49, 0.60), green, mon);
    col += flashCol * flash * land * (0.22 + 0.4 * density + 0.3 * cellLine);
    float sweepLine = 1.0 - smoothstep(0.0, 0.012 + wAA, abs(ds));
    col += green * sweepLine * (0.16 + 0.3 * land);
    col += green * (1.0 - smoothstep(0.0, 0.10, abs(ds))) * 0.05;

    // secondary axis: a latitude survey band sweeps N→S in blue-teal, so the
    // two sweeps cross-hatch the globe into a moving analysis grid.
    float latPhase = mod(uScanLat, PI) - PI * 0.5;
    float dLat = lat - latPhase;
    float latLine = 1.0 - smoothstep(0.0, 0.016 + wAA, abs(dLat));
    float latTrail = clamp(1.0 + dLat / 0.12, 0.0, 1.0) * step(latPhase, lat);
    vec3 axisBlue = vec3(0.18, 0.52, 0.77);
    col += axisBlue * latLine * (0.12 + 0.18 * land);
    col += axisBlue * latTrail * land * cellLine * 0.10;
    // intersection of the two axes — evidence flares where the survey locks
    col += green * sweepLine * latLine * (0.5 + 0.5 * mon);

    // NDVI-style vegetation index resolving in the longitude sweep's wake —
    // land briefly blooms into a green index field, brighter over monitored biomes.
    float ndvi = hash21(cellId * 1.93 + 7.1);
    float veg = trail * land * smoothstep(0.25, 1.0, ndvi);
    vec3 ndviCol = mix(vec3(0.09, 0.27, 0.15), green, ndvi);
    col += ndviCol * veg * (0.16 + 0.28 * mon);

    // limb shading so the sphere keeps its form
    float nv = max(dot(normalize(vNormal), normalize(vView)), 0.0);
    col *= 0.76 + 0.24 * smoothstep(0.0, 0.5, nv);

    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Opaque survey sphere — also the depth occluder for far-side markers/labels. */
function SurveySphere({ meshRef }: { meshRef: React.RefObject<THREE.Mesh | null> }) {
  const sdf = useLoader(THREE.TextureLoader, "/globe/land-sdf.png");

  const material = useMemo(() => {
    const tex = sdf.clone();
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.colorSpace = THREE.NoColorSpace;
    tex.needsUpdate = true;
    return new THREE.ShaderMaterial({
      uniforms: {
        uSdf: { value: tex },
        uScan: { value: -0.9 }, // sweep starts over the Amazon
        uScanLat: { value: 0 },
        uSites: {
          value: MONITOR_SITES.map((s) => lonLatToVec3(s.lonLat[0], s.lonLat[1], 1)),
        },
      },
      vertexShader: surveyVertex,
      fragmentShader: surveyFragment,
    });
  }, [sdf]);

  return (
    <mesh ref={meshRef} material={material}>
      <sphereGeometry args={[RADIUS, 96, 96]} />
    </mesh>
  );
}

/** Front-side fresnel rim so the sphere reads as a sphere against the navy. */
function Rim() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: new THREE.Color("#317ec0") } },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            float f = pow(1.0 - max(dot(vNormal, vView), 0.0), 3.5);
            gl_FragColor = vec4(uColor, f * 0.38);
          }
        `,
      }),
    [],
  );
  return (
    <mesh material={material}>
      <sphereGeometry args={[RADIUS * 1.002, 64, 64]} />
    </mesh>
  );
}

/** Reticle-bracket site marker: four hairline corners + a center dot. */
function bracketGeometry(s: number, arm: number) {
  const pts: number[] = [];
  for (const sx of [1, -1]) {
    for (const sy of [1, -1]) {
      pts.push(sx * s, sy * s, 0, sx * (s - arm), sy * s, 0);
      pts.push(sx * s, sy * s, 0, sx * s, sy * (s - arm), 0);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
  return geo;
}

const HUB_BRACKET = bracketGeometry(0.04, 0.017);
const SITE_BRACKET = bracketGeometry(0.029, 0.012);

/** Radar-style ping on the coordinate the inspector is currently reading. */
function ActivePing({ reduce }: { reduce: boolean | null }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    // 0→1 over 2s; frozen at rest when reduced motion is requested
    const t = reduce ? 0.0 : (state.clock.elapsedTime % 2) / 2;
    const s = 1 + t * 1.9;
    mesh.scale.set(s, s, s);
    (mesh.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.55;
  });
  return (
    <mesh ref={ref}>
      <ringGeometry args={[0.03, 0.038, 40]} />
      <meshBasicMaterial color="#3fdf85" transparent depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Marker({
  position,
  hub,
  active,
  reduce,
}: {
  position: THREE.Vector3;
  hub?: boolean;
  active?: boolean;
  reduce?: boolean | null;
}) {
  // The active coordinate reads green (selected); hubs green; territories blue.
  const color = active || hub ? "#3fdf85" : "#8ecdf2";
  const bracket = active || hub ? HUB_BRACKET : SITE_BRACKET;
  const normal = position.clone().normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    normal,
  );

  return (
    <group position={position} quaternion={quaternion}>
      {active && <ActivePing reduce={reduce ?? false} />}
      {active && (
        <mesh>
          <ringGeometry args={[0.05, 0.054, 48]} />
          <meshBasicMaterial
            color="#3fdf85"
            transparent
            opacity={0.5}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      <lineSegments geometry={bracket}>
        <lineBasicMaterial color={color} transparent opacity={active || hub ? 1 : 0.9} />
      </lineSegments>
      <mesh>
        <circleGeometry args={[active ? 0.009 : hub ? 0.008 : 0.006, 16]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/** Label chip anchored to a site, hidden when it rotates behind the planet. */
function SiteLabel({
  name,
  position,
  occludeRef,
}: {
  name: string;
  position: THREE.Vector3;
  occludeRef: React.RefObject<THREE.Mesh | null>;
}) {
  return (
    <Html
      position={position}
      center
      occlude={[occludeRef as React.RefObject<THREE.Object3D>]}
      zIndexRange={[10, 0]}
      wrapperClass="pointer-events-none"
    >
      <div className="flex select-none items-center whitespace-nowrap rounded-sm border border-white/15 bg-navy-950/85 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-white/85 shadow-lg shadow-navy-950/50 backdrop-blur-sm">
        {name}
      </div>
    </Html>
  );
}

function GlobeGroup({
  interacting,
  activeIndex,
}: {
  interacting: React.RefObject<boolean>;
  activeIndex?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const occluderRef = useRef<THREE.Mesh>(null);
  const settled = useRef(false);
  const reduce = useReducedMotion();

  const sitePositions = useMemo(
    () => MONITOR_SITES.map((s) => lonLatToVec3(s.lonLat[0], s.lonLat[1], RADIUS * 1.005)),
    [],
  );

  // Orientation that frames the active survey target on the front of the globe.
  const target = useMemo(() => {
    const s = MONITOR_SITES[activeIndex ?? 0];
    return s ? targetQuat(s.lonLat[0], s.lonLat[1]) : null;
  }, [activeIndex]);

  useFrame((_, delta) => {
    const g = groupRef.current;
    // Slew to frame the active biome — snap on first paint and under reduced
    // motion, otherwise ease in; never fight the user while they drag.
    if (g && target) {
      if (!settled.current || reduce) {
        g.quaternion.copy(target);
        settled.current = true;
      } else if (!interacting.current) {
        g.quaternion.slerp(target, 1 - Math.exp(-delta * 3.0));
      }
    }
    if (reduce) return;
    // Both scan axes keep sweeping even while the user drags.
    const mat = occluderRef.current?.material as THREE.ShaderMaterial | undefined;
    if (mat?.uniforms?.uScan) mat.uniforms.uScan.value += delta * SCAN_SPEED;
    if (mat?.uniforms?.uScanLat) mat.uniforms.uScanLat.value += delta * SCAN_LAT_SPEED;
  });

  return (
    <group ref={groupRef}>
      <SurveySphere meshRef={occluderRef} />
      <Rim />
      {MONITOR_SITES.map((site, i) => (
        <Marker
          key={site.name}
          position={sitePositions[i]}
          hub={site.hub}
          active={i === activeIndex}
          reduce={reduce}
        />
      ))}
      {MONITOR_SITES.map(
        (site, i) =>
          (site.labeled || i === activeIndex) && (
            <SiteLabel
              key={site.name}
              name={site.name}
              position={sitePositions[i].clone().multiplyScalar(1.06)}
              occludeRef={occluderRef}
            />
          ),
      )}
    </group>
  );
}

export default function GlobeScene({ activeIndex }: { activeIndex?: number }) {
  const interacting = useRef(false);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.55], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      aria-hidden
      className="!touch-pan-y"
    >
      <Suspense fallback={null}>
        <GlobeGroup interacting={interacting} activeIndex={activeIndex} />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.4}
        minPolarAngle={Math.PI * 0.3}
        maxPolarAngle={Math.PI * 0.7}
        onStart={() => {
          interacting.current = true;
        }}
        onEnd={() => {
          interacting.current = false;
        }}
      />
    </Canvas>
  );
}
