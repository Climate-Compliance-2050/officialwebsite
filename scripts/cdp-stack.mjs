// Focused clip of the Data Cube instrument (left column) at scale 1.
// Optional arg: scroll fraction 0..1 to set assemble progress (default center).
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9341;
const OUT = process.argv[2] || "stack-clip.png";
const SCROLL = process.argv[3] != null ? Number(process.argv[3]) : null;

const edge = spawn(EDGE, [
  "--headless=new", "--disable-gpu", "--no-sandbox",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=" + process.env.TEMP + "\\edgecdpstack_" + Date.now(),
  "--window-size=1600,1050", "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function getWsUrl() {
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch(`http://127.0.0.1:${PORT}/json/version`); const j = await r.json(); if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl; } catch {}
    await sleep(250);
  }
  throw new Error("no CDP");
}
const wsUrl = await getWsUrl();
const ws = new WebSocket(wsUrl);
await new Promise(res => ws.addEventListener("open", res, { once: true }));
let id = 0; const pending = new Map(); let sessionId = null;
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
function send(method, params = {}, useSession = true) { const msg = { id: ++id, method, params }; if (useSession && sessionId) msg.sessionId = sessionId; ws.send(JSON.stringify(msg)); return new Promise(res => pending.set(msg.id, res)); }

const { result: targets } = await send("Target.getTargets", {}, false);
const pageTarget = targets.targetInfos.find(t => t.type === "page");
const att = await send("Target.attachToTarget", { targetId: pageTarget.targetId, flatten: true }, false);
sessionId = att.result.sessionId;
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1600, height: 1050, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: "http://localhost:3000" });
await sleep(4000);

// find section, scroll so assemble progress is controllable
await send("Runtime.evaluate", {
  expression: `(() => {
    const all=[...document.querySelectorAll('section')];
    const sec=all.find(s=>/Every pillar/i.test(s.textContent||''));
    if(!sec) return false;
    const frac=${SCROLL === null ? "null" : SCROLL};
    if(frac===null){ sec.scrollIntoView({block:'center'}); }
    else {
      const r=sec.getBoundingClientRect();
      const top=window.scrollY+r.top;
      window.scrollTo(0, Math.max(0, top - window.innerHeight + frac*window.innerHeight));
    }
    return true;
  })()`,
  returnByValue: true,
});
// let assemble + evidence beats settle
await sleep(7000);
// the instrument carries `.corners-faint`; clip uses DOCUMENT coords → add scroll offset
const rect = await send("Runtime.evaluate", {
  expression: `(() => {
    const panels=[...document.querySelectorAll('.corners-faint')];
    const panel=panels.find(el=>/6 slabs|Inside the Data Cube|financial asset\\./i.test(el.closest('section')?.textContent||'')) || panels[panels.length-1];
    if(!panel) return null;
    const r=panel.getBoundingClientRect();
    return { x: r.x + window.scrollX - 40, y: r.y + window.scrollY - 30, w: r.width + 80, h: r.height + 60 };
  })()`,
  returnByValue: true,
});
const r = rect.result.result.value;
console.log("panel rect:", JSON.stringify(r));
const clip = r ? { x: Math.max(0, r.x), y: Math.max(0, r.y), width: r.w, height: r.h, scale: 1 }
               : { x: 150, y: 195, width: 720, height: 700, scale: 1 };
const shot = await send("Page.captureScreenshot", { format: "png", clip, captureBeyondViewport: true });
writeFileSync(OUT, Buffer.from(shot.result.data, "base64"));
console.log("saved " + OUT);
ws.close(); edge.kill(); process.exit(0);
