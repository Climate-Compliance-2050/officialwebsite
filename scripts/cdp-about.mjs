import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9334;
const edge = spawn(EDGE, [
  "--headless=new", "--disable-gpu", "--no-sandbox",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=" + process.env.TEMP + "\\edgecdp2",
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

const VIEWPORTS = [
  { name: "desktop", w: 1600, h: 950 },
  { name: "laptop", w: 1280, h: 800 },
  { name: "tablet", w: 820, h: 1000 },
  { name: "mobile", w: 390, h: 844 },
];

await send("Page.navigate", { url: "http://localhost:3000/about" });
await sleep(4500);

for (const vp of VIEWPORTS) {
  await send("Emulation.setDeviceMetricsOverride", {
    width: vp.w, height: vp.h, deviceScaleFactor: 1, mobile: vp.w < 500,
  });
  await sleep(1800);
  const shot = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`about-${vp.name}.png`, Buffer.from(shot.result.data, "base64"));
  console.log(`saved about-${vp.name}.png`);
}

ws.close();
edge.kill();
process.exit(0);

