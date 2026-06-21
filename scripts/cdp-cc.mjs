import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9336;
const URL = "http://localhost:3000/global";
const edge = spawn(EDGE, [
  "--headless=new", "--disable-gpu", "--no-sandbox",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=" + process.env.TEMP + "\\edgecdpcc",
  "--window-size=1500,1000",
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
await send("Emulation.setFocusEmulationEnabled", { enabled: true });
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: URL });
await sleep(4200);

// slow-scroll to trip every once:true reveal + count-up, then park the chart panel near the viewport top
await send("Runtime.evaluate", {
  expression: `(async()=>{
    const vh=window.innerHeight,h=document.body.scrollHeight;
    for(let y=0;y<h;y+=Math.round(vh*0.5)){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,200));}
    const panel=document.getElementById('coverage').querySelector('svg').closest('.corners');
    const top=panel.getBoundingClientRect().top+window.scrollY;
    window.scrollTo(0,Math.max(0,top-150));
    await new Promise(r=>setTimeout(r,700));
  })()`,
  awaitPromise: true,
});

const idle = await send("Page.captureScreenshot", { format: "png" });
writeFileSync("review-shots/cc-idle.png", Buffer.from(idle.result.data, "base64"));
console.log("saved review-shots/cc-idle.png");

// keyboard: focus the chart (native focus should light the reticle at "today")
await send("Runtime.evaluate", {
  expression: `document.querySelector('svg[tabindex="0"]').focus()`,
});
await sleep(450);
const kfocus = await send("Page.captureScreenshot", { format: "png" });
writeFileSync("review-shots/cc-kfocus.png", Buffer.from(kfocus.result.data, "base64"));
console.log("saved review-shots/cc-kfocus.png");

// ArrowLeft x3 to scrub back into the realized series
for (let i = 0; i < 3; i++) {
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowLeft", code: "ArrowLeft", windowsVirtualKeyCode: 37 });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowLeft", code: "ArrowLeft", windowsVirtualKeyCode: 37 });
  await sleep(120);
}
await sleep(350);
const karrow = await send("Page.captureScreenshot", { format: "png" });
writeFileSync("review-shots/cc-karrow.png", Buffer.from(karrow.result.data, "base64"));
console.log("saved review-shots/cc-karrow.png");

ws.close();
edge.kill();
process.exit(0);
