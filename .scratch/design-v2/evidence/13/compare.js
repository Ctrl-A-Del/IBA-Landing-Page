// Ticket 13 before/after comparison: full-page screenshots of master (e5ffdd6) and design/v2,
// each a production build served by ../11.1/serve.js. Headless Edge over CDP, Node 22 built-ins only.
// Reduced motion is emulated so every scroll reveal is visible without scrolling.
// Usage: node compare.js <label> <url>   e.g. node compare.js before http://127.0.0.1:3021/
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const [LABEL, PAGE_URL] = process.argv.slice(2);
const OUT = path.join(__dirname, "shots");
const PORT = 9341;
const WIDTHS = [375, 1280];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });

let ws; let seq = 0; const pending = new Map();
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++seq; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params }));
  setTimeout(() => { if (pending.delete(id)) reject(new Error("CDP timeout " + method)); }, 30000);
});
const js = async (expr) => (await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result.value;

(async () => {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "edge-13-"));
  const edge = spawn(EDGE, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
    "--no-first-run", "--no-default-browser-check", "--disable-gpu", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
  let version;
  for (let i = 0; i < 50 && !version; i++) { try { version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); } catch (e) { await sleep(200); } }
  const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r));
  ws.addEventListener("message", (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id).resolve(m.result || {}); pending.delete(m.id); }
  });
  await send("Page.enable");
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });

  for (const w of WIDTHS) {
    await send("Emulation.setDeviceMetricsOverride", { width: w, height: 800, deviceScaleFactor: 1, mobile: w < 768 });
    await send("Page.navigate", { url: PAGE_URL });
    await sleep(1500);
    // Scroll through once so lazy images load, then return to the top.
    await js(`(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); })()`);
    await js(`Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })))`);
    await sleep(500);
    const height = await js("document.documentElement.scrollHeight");
    const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height, scale: 1 } });
    const file = path.join(OUT, `${LABEL}-${w}.png`);
    fs.writeFileSync(file, Buffer.from(data, "base64"));
    console.log(file, `${w}x${height}`);
  }
  ws.close(); edge.kill();
})().catch((e) => { console.error(e); process.exit(1); });
