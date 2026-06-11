import { spawn } from "node:child_process";
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9334;
const edge = spawn(EDGE, ["--headless=new","--disable-gpu","--no-sandbox",
  `--remote-debugging-port=${PORT}`,"--user-data-dir="+process.env.TEMP+"\\edgecdp2",
  "--window-size=1500,1200","about:blank"], { stdio:"ignore" });
const sleep = ms => new Promise(r=>setTimeout(r,ms));
async function getWs(){for(let i=0;i<40;i++){try{const r=await fetch(`http://127.0.0.1:${PORT}/json/version`);const j=await r.json();if(j.webSocketDebuggerUrl)return j.webSocketDebuggerUrl;}catch{}await sleep(250);}throw new Error("no CDP");}
const ws=new WebSocket(await getWs());
await new Promise(res=>ws.addEventListener("open",res,{once:true}));
let id=0;const pending=new Map();let sessionId=null;
ws.addEventListener("message",e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}});
function send(method,params={},useS=true){const msg={id:++id,method,params};if(useS&&sessionId)msg.sessionId=sessionId;ws.send(JSON.stringify(msg));return new Promise(res=>pending.set(msg.id,res));}
const tg=await send("Target.getTargets",{},false);
const pt=tg.result.targetInfos.find(t=>t.type==="page");
const att=await send("Target.attachToTarget",{targetId:pt.targetId,flatten:true},false);
sessionId=att.result.sessionId;
await send("Page.enable");await send("Runtime.enable");
await send("Emulation.setEmulatedMedia",{features:[{name:"prefers-reduced-motion",value:"no-preference"}]});
await send("Page.navigate",{url:"http://localhost:3000"});
await sleep(3500);
async function ev(expr){const r=await send("Runtime.evaluate",{expression:expr,returnByValue:true});if(r.result.exceptionDetails)return{error:r.result.exceptionDetails.text};return r.result.result.value;}
async function move(x,y){await send("Input.dispatchMouseEvent",{type:"mouseMoved",x,y});}

// instant-scroll so stage center sits at viewport center
await ev(`(()=>{const s=document.querySelector('[style*="perspective"]');const r=s.getBoundingClientRect();const abs=r.top+window.scrollY;window.scrollTo(0, abs-(window.innerHeight-r.height)/2);return 1;})()`);
await sleep(400);

// get coords of first list item (Geospatial -> geo face) and the stage center
const coords = await ev(`(()=>{
  const item=document.querySelector('li [tabindex]');
  const ir=item.getBoundingClientRect();
  const stage=document.querySelector('[style*="perspective"]');
  const sr=stage.getBoundingClientRect();
  return {item:{x:ir.x+ir.width/2,y:ir.y+ir.height/2}, stage:{x:sr.x+sr.width/2,y:sr.y+sr.height/2}};
})()`);
console.log("coords",JSON.stringify(coords),"viewportH=1200 (both must be < 1200)");

function probe(){return ev(`(()=>{
  const item=document.querySelector('li [tabindex]');
  const itemActive=/translate-x-1/.test(item.className);
  const faces=[...document.querySelectorAll('.cursor-grab > div')].filter(d=>/absolute inset-0 overflow-hidden border/.test(d.className));
  const anyFaceActive=faces.some(f=>/border-green-400\\/80|border-blue-300\\/80/.test(f.className));
  return {itemActive,anyFaceActive,faceCount:faces.length};
})()`);}

console.log("baseline (mouse away):", JSON.stringify(await probe()));

// ---- direction A: hover the LIST item -> expect cube face active ----
await move(coords.item.x, coords.item.y);
await sleep(250);
console.log("A: hover list item ->", JSON.stringify(await probe()));

// move away to reset
await move(10,10); await sleep(250);
console.log("reset:", JSON.stringify(await probe()));

// ---- direction B: hover the CUBE (stage center = front face) -> expect a list item active ----
await move(coords.stage.x, coords.stage.y);
await sleep(250);
console.log("B: hover cube face ->", JSON.stringify(await probe()));

ws.close();edge.kill();process.exit(0);
