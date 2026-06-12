import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9336;
const edge = spawn(EDGE, [
  "--headless=new", "--disable-gpu", "--no-sandbox",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=" + process.env.TEMP + "\\edgecdpprod",
  "--window-size=1600,1000",
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

async function evalJs(expression) {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  return r.result?.result?.value;
}
async function scrollToStudio(offset = 24) {
  await evalJs(`
    (() => {
      // Target the tablet bezel directly so the instrument fills the frame.
      const bezel = [...document.querySelectorAll('span')].find(e => /Asset Intelligence/i.test(e.textContent));
      const tablet = bezel && bezel.closest('.grain');
      const el = tablet || [...document.querySelectorAll('h2')].find(e => /licensing tiers/i.test(e.textContent));
      if (el) { el.scrollIntoView({ block: 'center', behavior: 'instant' }); window.scrollBy(0, -${offset}); }
      return window.scrollY;
    })()
  `);
}
async function shot(name, w, h) {
  // Set viewport first — it resets scroll — then scroll the studio into view.
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: w < 500 });
  await sleep(700);
  await scrollToStudio(w < 500 ? 16 : 24);
  await sleep(600);
  const s = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`prod-${name}.png`, Buffer.from(s.result.data, "base64"));
  console.log(`saved prod-${name}.png`);
}

await send("Page.navigate", { url: "http://localhost:3000/products" });
await sleep(4500);

// Desktop — default state (Asset Manager active)
await shot("desktop-default", 1600, 950);

// Hover the Asset Expert box to capture the highlight state. Reuse the desktop
// metrics + scroll left by shot("desktop-default") — do NOT reset them here, or the
// :hover and scroll position are lost.
const box = await evalJs(`
  (() => {
    const h = [...document.querySelectorAll('h3')].find(e => /Asset Expert/i.test(e.textContent));
    const card = h && h.closest('.group');
    if (!card) return null;
    const r = card.getBoundingClientRect();
    return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + 40) };
  })()
`);
if (box) {
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: box.x, y: box.y });
  await sleep(600);
  const s = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync("prod-desktop-hover.png", Buffer.from(s.result.data, "base64"));
  console.log("saved prod-desktop-hover.png");
}

// Mobile
await shot("mobile-default", 390, 844);

ws.close();
edge.kill();
process.exit(0);
