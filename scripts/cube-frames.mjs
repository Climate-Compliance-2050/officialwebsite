// Capture the Data Cube stage across N frames to inspect the gather→web cycle.
// Usage: node scripts/cube-frames.mjs <out-dir> <frames> <gapMs>
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9337;
const [outDir = "review-shots", framesArg = "6", gapArg = "1400"] = process.argv.slice(2);
const FRAMES = Number(framesArg);
const GAP = Number(gapArg);
const W = 1440, H = 1000;
mkdirSync(outDir, { recursive: true });

const edge = spawn(EDGE, [
  "--headless=new", "--disable-gpu", "--no-sandbox",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=" + process.env.TEMP + "\\edgecdpcube",
  `--window-size=${W},${H}`, "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function getWsUrl() {
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch(`http://127.0.0.1:${PORT}/json/version`); const j = await r.json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl; } catch {}
    await sleep(250);
  }
  throw new Error("no CDP");
}
const ws = new WebSocket(await getWsUrl());
await new Promise(res => ws.addEventListener("open", res, { once: true }));
let id = 0; const pending = new Map(); let sessionId = null;
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
function send(method, params = {}, useSession = true) {
  const msg = { id: ++id, method, params };
  if (useSession && sessionId) msg.sessionId = sessionId;
  ws.send(JSON.stringify(msg)); return new Promise(res => pending.set(msg.id, res));
}
const { result: targets } = await send("Target.getTargets", {}, false);
const pageTarget = targets.targetInfos.find(t => t.type === "page");
const att = await send("Target.attachToTarget", { targetId: pageTarget.targetId, flatten: true }, false);
sessionId = att.result.sessionId;
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
async function evalJs(expression) {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true });
  return r.result?.result?.value;
}
await send("Page.navigate", { url: "http://localhost:3000/" });
await sleep(3500);
await evalJs("document.documentElement.style.scrollBehavior='auto'");
// the cube stage is the .corners box whose HUD contains "CUBE"
const FIND = `[...document.querySelectorAll('.corners.corners-faint')].find(e => e.textContent.includes('CUBE'))`;
// centre the cube stage in the viewport
await evalJs(`(() => { const s = ${FIND};
  if (s) { const r = s.getBoundingClientRect(); const y = window.scrollY + r.top + r.height/2 - window.innerHeight/2;
  window.scrollTo({ top: y, behavior: 'instant' }); } })()`);
await sleep(900);
console.log("rect:", await evalJs(`(() => { const s = ${FIND}; const r = s.getBoundingClientRect();
  return JSON.stringify({ top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) }); })()`));
const r = JSON.parse(await evalJs(`(() => { const s = ${FIND}; const b = s.getBoundingClientRect();
  return JSON.stringify({ x: Math.round(b.left+window.scrollX-20), y: Math.round(b.top+window.scrollY-20), w: Math.round(b.width+40), h: Math.round(b.height+40) }); })()`));
for (let i = 0; i < FRAMES; i++) {
  const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true,
    clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: 1 } });
  writeFileSync(`${outDir}/cube-${String(i + 1).padStart(2, "0")}.png`, Buffer.from(shot.result.data, "base64"));
  console.log(`${outDir}/cube-${String(i + 1).padStart(2, "0")}.png`);
  await sleep(GAP);
}
ws.close(); edge.kill(); process.exit(0);
