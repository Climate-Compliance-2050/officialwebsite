// Review tool: segment screenshots of given pages.
// Usage: node scripts/cdp-review.mjs <out-dir> <w>x<h> <path> [<path> ...]
// Saves <out-dir>/<slug>-NN.png viewport segments (max 8 per page).
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9335;

const [outDir, size, ...paths] = process.argv.slice(2);
const [W, H] = size.split("x").map(Number);
mkdirSync(outDir, { recursive: true });

const edge = spawn(EDGE, [
  "--headless=new", "--disable-gpu", "--no-sandbox",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=" + process.env.TEMP + "\\edgecdp3",
  `--window-size=${W},${H}`,
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const j = await r.json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error("no CDP");
}

const wsUrl = await getWsUrl();
const ws = new WebSocket(wsUrl);
await new Promise(res => ws.addEventListener("open", res, { once: true }));

let id = 0;
const pending = new Map();
let sessionId = null;
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
function send(method, params = {}, useSession = true) {
  const msg = { id: ++id, method, params };
  if (useSession && sessionId) msg.sessionId = sessionId;
  ws.send(JSON.stringify(msg));
  return new Promise(res => pending.set(msg.id, res));
}

const { result: targets } = await send("Target.getTargets", {}, false);
const pageTarget = targets.targetInfos.find(t => t.type === "page");
const att = await send("Target.attachToTarget", { targetId: pageTarget.targetId, flatten: true }, false);
sessionId = att.result.sessionId;

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: W, height: H, deviceScaleFactor: 1, mobile: W < 500,
});

async function evalJs(expression) {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true });
  return r.result?.result?.value;
}

for (const path of paths) {
  const slug = path === "/" ? "home" : path.replace(/\//g, "").replace(/[^a-z-]/gi, "");
  await send("Page.navigate", { url: `http://localhost:3000${path}` });
  await sleep(3500);

  // kill smooth scrolling — it races the capture timings (verified artifact source)
  await evalJs("document.documentElement.style.scrollBehavior = 'auto'");
  // prime whileInView reveals: walk to the bottom once
  const total = await evalJs("document.documentElement.scrollHeight");
  for (let y = 0; y < total; y += Math.round(H * 0.8)) {
    await evalJs(`window.scrollTo({ top: ${y}, behavior: 'instant' })`);
    await sleep(300);
  }
  await evalJs("window.scrollTo({ top: 0, behavior: 'instant' })");
  await sleep(900);

  const segs = Math.min(8, Math.ceil(total / H));
  for (let i = 0; i < segs; i++) {
    const y = Math.min(i * H, total - H);
    await evalJs(`window.scrollTo({ top: ${Math.max(0, y)}, behavior: 'instant' })`);
    await sleep(650);
    const shot = await send("Page.captureScreenshot", { format: "png" });
    writeFileSync(`${outDir}/${slug}-${String(i + 1).padStart(2, "0")}.png`,
      Buffer.from(shot.result.data, "base64"));
    console.log(`${outDir}/${slug}-${String(i + 1).padStart(2, "0")}.png  (y=${y} of ${total})`);
  }
}

ws.close();
edge.kill();
process.exit(0);
