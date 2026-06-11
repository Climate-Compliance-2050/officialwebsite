"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { MONITOR_ARCS, MONITOR_SITES } from "@/content/monitor";
import landDots from "./land-dots.json";

const RADIUS = 1;

/** cos of the angular radius treated as "monitored territory" around a site */
const MONITORED_COS = Math.cos((11 * Math.PI) / 180);

function lonLatToVec3(lon: number, lat: number, r = RADIUS): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

/**
 * Two-tone land dots: monitored territories light up green, the rest of the
 * world sits back in muted slate-blue — coverage readable at a glance.
 */
function LandDots() {
  const { base, monitored } = useMemo(() => {
    const siteVecs = MONITOR_SITES.map((s) => lonLatToVec3(s.lonLat[0], s.lonLat[1], 1));
    const basePos: number[] = [];
    const monPos: number[] = [];
    (landDots as [number, number][]).forEach(([lon, lat]) => {
      const unit = lonLatToVec3(lon, lat, 1);
      const isMonitored = siteVecs.some((s) => s.dot(unit) > MONITORED_COS);
      const v = unit.multiplyScalar(RADIUS * 1.001);
      (isMonitored ? monPos : basePos).push(v.x, v.y, v.z);
    });
    const toGeometry = (arr: number[]) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(arr), 3));
      return geo;
    };
    return { base: toGeometry(basePos), monitored: toGeometry(monPos) };
  }, []);

  return (
    <>
      <points geometry={base}>
        <pointsMaterial
          color="#8aa6cc"
          size={0.013}
          sizeAttenuation
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </points>
      <points geometry={monitored}>
        <pointsMaterial
          color="#65c47b"
          size={0.017}
          sizeAttenuation
          transparent
          opacity={1}
          depthWrite={false}
        />
      </points>
    </>
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

function Marker({ position, hub }: { position: THREE.Vector3; hub?: boolean }) {
  const color = hub ? "#34d27b" : "#54a8de";
  const normal = position.clone().normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    normal,
  );

  return (
    <group position={position} quaternion={quaternion}>
      <mesh>
        <sphereGeometry args={[hub ? 0.02 : 0.013, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {hub && (
        <mesh>
          <ringGeometry args={[0.034, 0.037, 48]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

/** Faint base line + bright travelling pulse so feed direction is readable. */
function Arc({ from, to, phase = 0 }: { from: THREE.Vector3; to: THREE.Vector3; phase?: number }) {
  const reduce = useReducedMotion();
  const pulseRef = useRef<React.ComponentRef<typeof Line>>(null);

  const points = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5);
    const dist = from.distanceTo(to);
    mid.normalize().multiplyScalar(RADIUS + dist * 0.25);
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    return curve.getPoints(64);
  }, [from, to]);

  useFrame(({ clock }) => {
    const mat = pulseRef.current?.material as THREE.Material & { dashOffset?: number };
    if (mat && !reduce && "dashOffset" in mat) {
      mat.dashOffset = phase - clock.elapsedTime * 0.4;
    }
  });

  return (
    <>
      <Line points={points} color="#2c8bca" lineWidth={1} transparent opacity={0.28} />
      {!reduce && (
        <Line
          ref={pulseRef}
          points={points}
          color="#8fd0ff"
          lineWidth={1.7}
          dashed
          dashSize={0.16}
          gapSize={1.5}
          transparent
          opacity={0.95}
        />
      )}
    </>
  );
}

/** Label chip anchored to a site, hidden when it rotates behind the planet. */
function SiteLabel({
  name,
  hub,
  position,
  occludeRef,
}: {
  name: string;
  hub?: boolean;
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
      <div className="flex select-none items-center whitespace-nowrap rounded-sm border border-white/15 bg-navy-950/85 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/85 shadow-lg shadow-navy-950/50 backdrop-blur-sm">
        {name}
      </div>
    </Html>
  );
}

function GlobeGroup({ interacting }: { interacting: React.RefObject<boolean> }) {
  const groupRef = useRef<THREE.Group>(null);
  const occluderRef = useRef<THREE.Mesh>(null);
  const reduce = useReducedMotion();

  const sitePositions = useMemo(
    () => MONITOR_SITES.map((s) => lonLatToVec3(s.lonLat[0], s.lonLat[1], RADIUS * 1.005)),
    [],
  );

  useFrame((_, delta) => {
    // Pause idle spin while the user is dragging so the globe doesn't slide under the cursor.
    if (groupRef.current && !reduce && !interacting.current) {
      groupRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.22, 5.24, 0]}>
      {/* occluder sphere — opaque so it writes depth and hides far-side dots/markers/arcs */}
      <mesh ref={occluderRef}>
        <sphereGeometry args={[RADIUS * 0.992, 64, 64]} />
        <meshBasicMaterial color="#0a1628" />
      </mesh>
      <Rim />
      <LandDots />
      {MONITOR_SITES.map((site, i) => (
        <Marker key={site.name} position={sitePositions[i]} hub={site.hub} />
      ))}
      {MONITOR_ARCS.map(([a, b], i) => (
        <Arc key={i} from={sitePositions[a]} to={sitePositions[b]} phase={i * 0.7} />
      ))}
      {MONITOR_SITES.map(
        (site, i) =>
          site.labeled && (
            <SiteLabel
              key={site.name}
              name={site.name}
              hub={site.hub}
              position={sitePositions[i].clone().multiplyScalar(1.06)}
              occludeRef={occluderRef}
            />
          ),
      )}
    </group>
  );
}

export default function GlobeScene() {
  const interacting = useRef(false);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.55], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      aria-hidden
      className="!touch-pan-y"
    >
      <ambientLight intensity={0.6} />
      <GlobeGroup interacting={interacting} />
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
