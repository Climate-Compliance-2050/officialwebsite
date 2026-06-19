import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9337;
const edge = spawn(EDGE, [
  "--headless=new", "--disable-gpu", "--no-sandbox",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=" + process.env.TEMP + "\\edgecdpcube_" + Date.now(),
  "--window-size=1600,1050",
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
await send("Emulation.setDeviceMetricsOverride", { width: 1600, height: 1050, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: "http://localhost:3000" });
await sleep(4000);

// scroll the Data Cube section into view so useInView fires the beat sequence
await send("Runtime.evaluate", {
  expression: `(() => {
    const all = [...document.querySelectorAll('section')];
    const sec = all.find(s => /Every pillar|tap the core|financial asset/i.test(s.textContent || ''));
    if (sec) sec.scrollIntoView({ block: 'center' });
    return !!sec;
  })()`,
  returnByValue: true,
});
// let the narrative beats play out (territory → extract → bind → lock → rest)
await sleep(7500);

const shot = await send("Page.captureScreenshot", { format: "png" });
writeFileSync("cube-current.png", Buffer.from(shot.result.data, "base64"));
console.log("saved cube-current.png");

ws.close();
edge.kill();
process.exit(0);
