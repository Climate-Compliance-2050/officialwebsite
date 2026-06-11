import { spawn } from "node:child_process";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9333;
const edge = spawn(EDGE, [
  "--headless=new", "--disable-gpu", "--no-sandbox",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=" + process.env.TEMP + "\\edgecdp",
  "--window-size=1400,1000",
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

// attach to a page target
const { result: targets } = await send("Target.getTargets", {}, false);
let pageTarget = targets.targetInfos.find(t => t.type === "page");
const att = await send("Target.attachToTarget", { targetId: pageTarget.targetId, flatten: true }, false);
sessionId = att.result.sessionId;

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });

await send("Page.navigate", { url: "http://localhost:3000" });
await sleep(3500);

async function evalJs(expression) {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true });
  if (r.result.exceptionDetails) return { error: r.result.exceptionDetails.text };
  return r.result.result.value;
}

// scroll cube into view, get geometry
const geom = await evalJs(`(() => {
  const cube = document.querySelector('.cursor-grab');
  const stage = cube?.closest('[style*="perspective"]');
  if (!stage) return {err:'no stage'};
  stage.scrollIntoView({block:'center'});
  const sr = stage.getBoundingClientRect();
  return { stage:{x:sr.x,y:sr.y,w:sr.width,h:sr.height},
           reduce: window.matchMedia('(prefers-reduced-motion: reduce)').matches };
})()`);
console.log("GEOM", JSON.stringify(geom));
await sleep(300);

const readCube = `(() => {
  const cube = document.querySelector('.cursor-grab');
  return getComputedStyle(cube).transform;
})()`;

const t1 = await evalJs(readCube);
await sleep(1600);
const t2 = await evalJs(readCube);
console.log("SPIN t1:", t1);
console.log("SPIN t2:", t2);
console.log("SPIN changed:", t1 !== t2);

// --- test list->cube cross highlight ---
const hl = await evalJs(`(() => {
  const items = [...document.querySelectorAll('li [tabindex]')];
  if(!items.length) return {err:'no list items'};
  const first = items[0];
  first.dispatchEvent(new MouseEvent('mouseenter',{bubbles:true}));
  first.dispatchEvent(new FocusEvent('focus',{bubbles:true}));
  // read whether a glass face became active (green/blue active classes)
  const faces = [...document.querySelectorAll('.cursor-grab > div')];
  const activeFace = faces.some(f => /border-green-400\\/80|border-blue-300\\/80/.test(f.className));
  const itemActive = /translate-x-1/.test(first.className);
  return { itemActive, activeFace };
})()`);
console.log("HIGHLIGHT list->cube:", JSON.stringify(hl));

// --- test drag via Input events on stage center ---
const sx = geom.stage.x + geom.stage.w/2;
const sy = geom.stage.y + geom.stage.h/2;
const before = await evalJs(readCube);
await send("Input.dispatchMouseEvent", { type:"mousePressed", x:sx, y:sy, button:"left", buttons:1, clickCount:1 });
for (let k=1;k<=10;k++){
  await send("Input.dispatchMouseEvent", { type:"mouseMoved", x:sx+k*12, y:sy, button:"left", buttons:1 });
  await sleep(16);
}
await send("Input.dispatchMouseEvent", { type:"mouseReleased", x:sx+120, y:sy, button:"left", buttons:0, clickCount:1 });
const after = await evalJs(readCube);
console.log("DRAG before:", before);
console.log("DRAG after :", after);
console.log("DRAG changed:", before !== after);

ws.close();
edge.kill();
process.exit(0);
