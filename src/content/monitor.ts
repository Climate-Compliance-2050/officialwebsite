/**
 * Sites shown on the hero "Global Asset Monitor". Shared between the
 * three.js scene and the HTML console frame (legend, coordinate ticker and
 * jurisdiction inspector) so the frame never imports the WebGL bundle.
 *
 * The survey focuses on Brazil's six continental biomes (IBGE 2019): the
 * inspector cycles them one at a time while the globe slews to frame each.
 * Dublin / São Paulo hubs and a few overseas territories stay on the map to
 * keep the global read.
 *
 * The `jurisdiction` / `governedBy` data drives the Jurisdiction Inspector:
 * it demonstrates C2050's differentiator — every coordinate is bound to the
 * law that governs it. The framework references are real instruments:
 *   · Código Florestal — Lei 12.651/2012 (Reserva Legal 80/35/20%, CAR)
 *   · Lei da Mata Atlântica — Lei 11.428/2006 (suppression + compensation)
 *   · Política Nac. de Manejo Integrado do Fogo — Lei 14.944/2024
 *   · Patrimônio nacional — CF/1988 art. 225 §4 (Amazônia, Mata Atlântica,
 *     Pantanal — Cerrado/Caatinga/Pampa are deliberately omitted, as in law)
 *   · Paris Art. 6.4, Ramsar, UNCCD/PAN-Brasil, PPCerrado, MapBiomas, CAR
 * Biome area shares are IBGE 2019 figures. The per-site STATUSES (mapped, in
 * review, monitoring…) are illustrative of a live monitor, not legal advice.
 */

export type MonitorSite = {
  name: string;
  /** [lon, lat] in degrees */
  lonLat: [number, number];
  hub?: boolean;
  /** render a label chip anchored to this site on the globe */
  labeled?: boolean;
  /** one of Brazil's six IBGE biomes — these are the cycling survey targets */
  biome?: boolean;
  /** share of national territory, % (IBGE 2019) — biomes only */
  share?: number;
  /** territory shown in the inspector, e.g. "Amazônia Legal · BR" */
  jurisdiction?: string;
  /** legal/regulatory checks bound to this coordinate */
  governedBy?: GovCheck[];
};

/** A single governing-law check surfaced in the inspector. */
export type GovCheck = {
  /** the rule or right being checked, e.g. "Carbon rights" */
  label: string;
  /** ok = cleared, review = in progress, watch = monitored for change */
  tone: "ok" | "review" | "watch";
  /** short status word shown beside the check, e.g. "mapped" */
  state: string;
};

export const MONITOR_SITES: MonitorSite[] = [
  // --- operational hubs ---
  { name: "Dublin · HQ", lonLat: [-6.26, 53.35], hub: true, labeled: true },
  { name: "São Paulo · Hub", lonLat: [-46.63, -23.55], hub: true, labeled: true },

  // --- Brazil's six biomes (IBGE 2019): the cycling survey targets ---
  {
    name: "Amazônia",
    lonLat: [-62.2, -3.4],
    biome: true,
    share: 49.5,
    jurisdiction: "Amazônia Legal · BR",
    governedBy: [
      { label: "Reserva Legal · 80% — Cód. Florestal", tone: "ok", state: "mapped" },
      { label: "Art. 6.4 eligibility", tone: "review", state: "in review" },
      { label: "Land tenure · CAR", tone: "ok", state: "registered" },
    ],
  },
  {
    name: "Cerrado",
    lonLat: [-47.9, -14.2],
    biome: true,
    share: 23.3,
    jurisdiction: "Cerrado · BR",
    governedBy: [
      { label: "Reserva Legal · 35% — Cód. Florestal", tone: "ok", state: "mapped" },
      { label: "Deforestation · PPCerrado", tone: "watch", state: "monitoring" },
      { label: "MRV methodology", tone: "ok", state: "conformant" },
    ],
  },
  {
    name: "Mata Atlântica",
    lonLat: [-43.2, -22.3],
    biome: true,
    share: 13.0,
    jurisdiction: "Mata Atlântica · BR",
    governedBy: [
      { label: "Suppression · Lei 11.428/2006", tone: "review", state: "in review" },
      { label: "Patrimônio nacional · CF 225", tone: "ok", state: "protected" },
      { label: "Restoration offset", tone: "watch", state: "monitoring" },
    ],
  },
  {
    name: "Caatinga",
    lonLat: [-40.0, -9.3],
    biome: true,
    share: 10.1,
    jurisdiction: "Caatinga · BR",
    governedBy: [
      { label: "Carbon rights", tone: "review", state: "in review" },
      { label: "Desertification · PAN-Brasil", tone: "watch", state: "monitoring" },
      { label: "Community land", tone: "watch", state: "monitoring" },
    ],
  },
  {
    name: "Pampa",
    lonLat: [-54.0, -30.5],
    biome: true,
    share: 2.3,
    jurisdiction: "Pampa · RS · BR",
    governedBy: [
      { label: "Reserva Legal · 20% — Cód. Florestal", tone: "ok", state: "mapped" },
      { label: "Grassland conversion · MapBiomas", tone: "watch", state: "monitoring" },
      { label: "Land tenure", tone: "review", state: "in review" },
    ],
  },
  {
    name: "Pantanal",
    lonLat: [-56.8, -17.6],
    biome: true,
    share: 1.8,
    jurisdiction: "Pantanal · MS·MT · BR",
    governedBy: [
      { label: "Fire mgmt · Lei 14.944/2024", tone: "ok", state: "aligned" },
      { label: "Patrimônio nacional · CF 225", tone: "ok", state: "protected" },
      { label: "Wetland · Ramsar", tone: "watch", state: "monitoring" },
    ],
  },

  // --- overseas territories: static markers that keep the global read ---
  { name: "Congo Basin", lonLat: [23.6, 0.5] },
  { name: "East Africa", lonLat: [37.9, -2.3] },
  { name: "Borneo", lonLat: [114.2, 0.6] },
  { name: "Mekong", lonLat: [104.9, 12.2] },
];

export function formatLonLat([lon, lat]: [number, number]): string {
  const ns = `${Math.abs(lat).toFixed(1)}°${lat >= 0 ? "N" : "S"}`;
  const ew = `${Math.abs(lon).toFixed(1)}°${lon >= 0 ? "E" : "W"}`;
  return `${ns} ${ew}`;
}
