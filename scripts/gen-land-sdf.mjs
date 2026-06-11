/**
 * Bakes public/globe/land-sdf.png — an equirectangular signed-distance field
 * of the world landmask (Natural Earth 50m via world-atlas, public domain).
 *
 * The hero globe shader reads it to draw engraved hairline coastlines and to
 * gate land/ocean effects. Encoding: 8-bit grayscale, 0.5 = coastline,
 * > 0.5 = land, normalized over ±SPREAD px. Row 0 = lat +90°.
 *
 * Run: node scripts/gen-land-sdf.mjs
 */
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { feature } from "topojson-client";
import sharp from "sharp";

const require = createRequire(import.meta.url);

const W = 2048;
const H = 1024;
const SPREAD = 24; // px of SDF range on each side of the coast
const PAD = 64; // horizontal wrap padding so distances cross the antimeridian

const topo = require("world-atlas/land-50m.json");
const land = feature(topo, topo.objects.land);

// ---- rasterize: even-odd scanline fill over all rings in lon/lat space ----
const rings = [];
for (const poly of land.features[0].geometry.coordinates) {
  for (const ring of poly) rings.push(ring);
}

const mask = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  const lat = 90 - ((y + 0.5) * 180) / H;
  const xs = [];
  for (const ring of rings) {
    for (let i = 0, n = ring.length - 1; i < n; i++) {
      const [lon1, lat1] = ring[i];
      const [lon2, lat2] = ring[i + 1];
      if (lat1 > lat === lat2 > lat) continue;
      xs.push(lon1 + ((lat - lat1) / (lat2 - lat1)) * (lon2 - lon1));
    }
  }
  xs.sort((a, b) => a - b);
  for (let i = 0; i + 1 < xs.length; i += 2) {
    const x0 = Math.max(0, Math.ceil(((xs[i] + 180) / 360) * W - 0.5));
    const x1 = Math.min(W - 1, Math.floor(((xs[i + 1] + 180) / 360) * W - 0.5));
    for (let x = x0; x <= x1; x++) mask[y * W + x] = 1;
  }
}

// ---- squared Euclidean distance transform (Felzenszwalb), with wrap pad ----
const INF = 1e20;

function edt1d(f, n, d, v, z) {
  let k = 0;
  v[0] = 0;
  z[0] = -INF;
  z[1] = INF;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = INF;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
}

/** distance from every pixel to the nearest pixel where inside(x,y) is true */
function edt2d(inside, w, h) {
  const g = new Float64Array(w * h);
  const size = Math.max(w, h);
  const f = new Float64Array(size);
  const d = new Float64Array(size);
  const v = new Int32Array(size);
  const z = new Float64Array(size + 1);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = inside(x, y) ? 0 : INF;
    edt1d(f, h, d, v, z);
    for (let y = 0; y < h; y++) g[y * w + x] = d[y];
  }
  const out = new Float64Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = g[y * w + x];
    edt1d(f, w, d, v, z);
    for (let x = 0; x < w; x++) out[y * w + x] = d[x];
  }
  return out;
}

const WP = W + PAD * 2;
const padded = (x) => (x - PAD + W) % W;
const distToLand = edt2d((x, y) => mask[y * W + padded(x)] === 1, WP, H);
const distToWater = edt2d((x, y) => mask[y * W + padded(x)] === 0, WP, H);

// ---- encode: 0.5 at coast, land positive ----
const px = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = y * WP + (x + PAD);
    const sd = mask[y * W + x]
      ? Math.sqrt(distToWater[i])
      : -Math.sqrt(distToLand[i]);
    const v = 0.5 + sd / (SPREAD * 2);
    px[y * W + x] = Math.round(Math.min(1, Math.max(0, v)) * 255);
  }
}

mkdirSync(new URL("../public/globe", import.meta.url), { recursive: true });
const out = new URL("../public/globe/land-sdf.png", import.meta.url).pathname
  .replace(/^\/([A-Za-z]:)/, "$1");
await sharp(Buffer.from(px), { raw: { width: W, height: H, channels: 1 } })
  .png({ compressionLevel: 9 })
  .toFile(out);
console.log(`wrote ${out} (${W}x${H}, spread ${SPREAD}px)`);
