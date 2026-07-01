/**
 * Sites shown on the hero "Global Asset Monitor". Shared between the
 * three.js scene and the HTML console frame (legend, coordinate ticker and
 * jurisdiction inspector) so the frame never imports the WebGL bundle.
 *
 * The survey cycles eight jurisdictions across six countries: three marquee
 * Brazil biomes (Amazônia, Cerrado, Pantanal) plus the Congo Basin, Borneo,
 * East Africa, Australia's northern savanna and the Canadian boreal. The
 * inspector reads one at a time while the globe slews to frame each. Dublin /
 * São Paulo hubs and a few static territories stay on the map to keep the
 * global read without entering the rotation.
 *
 * The `jurisdiction` / `governedBy` data drives the Jurisdiction Inspector:
 * it demonstrates C2050's differentiator — every coordinate is bound to the
 * law that governs it. The framework references are real instruments. A few:
 *   · Código Florestal — Lei 12.651/2012 (Reserva Legal 80/35/20%, CAR)
 *   · Patrimônio nacional — CF/1988 art. 225 §4 (Amazônia, Pantanal)
 *   · Política Nac. de Manejo Integrado do Fogo — Lei 14.944/2024
 *   · RDC · DRC Forest Code — Loi 011/2002; CAFI / REDD+; Ramsar (Cuvette Centrale)
 *   · Indonesia — Perpres 98/2021 (nilai ekonomi karbon); UU 41/1999
 *   · Kenya — Climate Change (Amendment) Act 2023 (Art. 6); Community Land Act 2016
 *   · Australia — Carbon Credits (CFI) Act 2011 / ACCU; Native Title Act 1993
 *   · Canada — Greenhouse Gas Pollution Pricing Act (federal offset system)
 * Biome area shares are IBGE 2019 figures (Brazil only). The per-site STATUSES
 * (mapped, in review, monitoring…) are illustrative of a live monitor, not
 * legal advice. Decree/act numbers are real but should be source-checked
 * before any change to the displayed copy.
 */

export type MonitorSite = {
  name: string;
  /** [lon, lat] in degrees */
  lonLat: [number, number];
  hub?: boolean;
  /** render a label chip anchored to this site on the globe */
  labeled?: boolean;
  /** a cycling Jurisdiction-Inspector target — the globe slews to frame it */
  survey?: boolean;
  /** share of national territory, % (IBGE 2019) — Brazil biomes only */
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

  // --- survey targets: eight jurisdictions, the cycling inspector targets ---
  {
    name: "Amazônia",
    lonLat: [-62.2, -3.4],
    survey: true,
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
    survey: true,
    share: 23.3,
    jurisdiction: "Cerrado · BR",
    governedBy: [
      { label: "Reserva Legal · 35% — Cód. Florestal", tone: "ok", state: "mapped" },
      { label: "Deforestation · PPCerrado", tone: "watch", state: "monitoring" },
      { label: "MRV methodology", tone: "ok", state: "conformant" },
    ],
  },
  {
    name: "Pantanal",
    lonLat: [-56.8, -17.6],
    survey: true,
    share: 1.8,
    jurisdiction: "Pantanal · MS·MT · BR",
    governedBy: [
      { label: "Fire mgmt · Lei 14.944/2024", tone: "ok", state: "aligned" },
      { label: "Patrimônio nacional · CF 225", tone: "ok", state: "protected" },
      { label: "Wetland · Ramsar", tone: "watch", state: "monitoring" },
    ],
  },
  {
    name: "Congo Basin",
    lonLat: [23.6, 0.5],
    survey: true,
    jurisdiction: "Cuvette Centrale · DRC",
    governedBy: [
      { label: "Forest Code · Loi 011/2002", tone: "ok", state: "classified" },
      { label: "REDD+ · CAFI strategy", tone: "review", state: "in review" },
      { label: "Peatland · Ramsar", tone: "watch", state: "monitoring" },
    ],
  },
  {
    name: "Borneo",
    lonLat: [114.2, 0.6],
    survey: true,
    jurisdiction: "Kalimantan · ID",
    governedBy: [
      { label: "Carbon value · Perpres 98/2021", tone: "ok", state: "regulated" },
      { label: "Forestry Law · UU 41/1999", tone: "ok", state: "classified" },
      { label: "Peatland moratorium · FOLU 2030", tone: "watch", state: "monitoring" },
    ],
  },
  {
    name: "East Africa",
    lonLat: [37.9, -2.3],
    survey: true,
    jurisdiction: "Kenya",
    governedBy: [
      { label: "Carbon markets · Climate Amd. 2023", tone: "ok", state: "regulated" },
      { label: "Forest Conservation Act 2016", tone: "ok", state: "mapped" },
      { label: "Community land · CLA 2016", tone: "review", state: "in review" },
    ],
  },
  {
    name: "N. Australia",
    lonLat: [134.0, -13.5],
    survey: true,
    jurisdiction: "N. Territory · AU",
    governedBy: [
      { label: "ACCU · Carbon Credits Act 2011", tone: "ok", state: "registered" },
      { label: "Savanna fire-mgmt method", tone: "ok", state: "aligned" },
      { label: "Native title · NTA 1993", tone: "review", state: "in review" },
    ],
  },
  {
    name: "Boreal",
    lonLat: [-90.0, 52.0],
    survey: true,
    jurisdiction: "Boreal · CA",
    governedBy: [
      { label: "Federal offset · GGPPA", tone: "ok", state: "regulated" },
      { label: "Treaty land rights", tone: "watch", state: "monitoring" },
      { label: "Removal MRV protocol", tone: "review", state: "in review" },
    ],
  },

  // --- static markers: held on the map for context, not in the rotation ---
  {
    name: "Mata Atlântica",
    lonLat: [-43.2, -22.3],
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
    share: 2.3,
    jurisdiction: "Pampa · RS · BR",
    governedBy: [
      { label: "Reserva Legal · 20% — Cód. Florestal", tone: "ok", state: "mapped" },
      { label: "Grassland conversion · MapBiomas", tone: "watch", state: "monitoring" },
      { label: "Land tenure", tone: "review", state: "in review" },
    ],
  },
  { name: "Mekong", lonLat: [104.9, 12.2] },
];

export function formatLonLat([lon, lat]: [number, number]): string {
  const ns = `${Math.abs(lat).toFixed(1)}°${lat >= 0 ? "N" : "S"}`;
  const ew = `${Math.abs(lon).toFixed(1)}°${lon >= 0 ? "E" : "W"}`;
  return `${ns} ${ew}`;
}
