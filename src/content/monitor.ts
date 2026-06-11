/**
 * Sites shown on the hero "Global Asset Monitor". Shared between the
 * three.js scene and the HTML console frame (legend + coordinate ticker)
 * so the frame never imports the WebGL bundle.
 */

export type MonitorSite = {
  name: string;
  /** [lon, lat] in degrees */
  lonLat: [number, number];
  hub?: boolean;
  /** render a label chip anchored to this site on the globe */
  labeled?: boolean;
};

export const MONITOR_SITES: MonitorSite[] = [
  { name: "Dublin · HQ", lonLat: [-6.26, 53.35], hub: true, labeled: true },
  { name: "São Paulo · Hub", lonLat: [-46.63, -23.55], hub: true, labeled: true },
  { name: "Amazon Basin", lonLat: [-62.2, -3.4] },
  { name: "Cerrado", lonLat: [-47.9, -14.2] },
  { name: "Colombia", lonLat: [-73.1, 4.6] },
  { name: "Central America", lonLat: [-90.2, 15.5] },
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
