// Ticket 11.1 browser pass: headless Edge over CDP (Node 22 built-ins only), against a production
// build served by ./serve.js. A scoped copy of ../11/run2/qa.js: only the checks ticket 11.1 lists.
// Usage: node qa.js http://127.0.0.1:3013/
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PAGE_URL = process.argv[2] || "http://127.0.0.1:3013/";
const OUT = path.join(__dirname, "shots");
const PORT = 9334;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });

let ws; let seq = 0; const pending = new Map(); const listeners = [];
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++seq; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params }));
  setTimeout(() => { if (pending.delete(id)) reject(new Error("CDP timeout " + method)); }, 20000);
});
const once = (method) => new Promise((resolve) => {
  const l = (m) => { if (m.method === method) { listeners.splice(listeners.indexOf(l), 1); resolve(m.params); } };
  listeners.push(l);
});
const js = async (expr) => {
  const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 800));
  return r.result.value;
};
const viewport = (w, h) => send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
const load = async () => {
  const p = once("Page.loadEventFired"); await send("Page.navigate", { url: PAGE_URL }); await p;
  await js("document.fonts.ready.then(() => true)"); await sleep(400);
};
const scrollThrough = () => js(`(async () => { const s = (ms) => new Promise(r => setTimeout(r, ms));
  for (let y = 0; y <= document.documentElement.scrollHeight; y += innerHeight / 2) { scrollTo({top: y, behavior: 'instant'}); await s(80); }
  await s(900); scrollTo({top: 0, behavior: 'instant'}); await s(300); return true; })()`);
const key = async (shift = false) => {
  const base = { key: "Tab", code: "Tab", windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9, modifiers: shift ? 8 : 0 };
  await send("Input.dispatchKeyEvent", { type: "rawKeyDown", ...base }); await send("Input.dispatchKeyEvent", { type: "keyUp", ...base });
  await sleep(150);
};
const shotEl = async (name, selector) => {
  const box = await js(`(() => { const el = document.querySelector('${selector}'); const r = el.getBoundingClientRect();
    return { x: 0, y: r.top + scrollY, width: document.documentElement.clientWidth, height: r.height }; })()`);
  const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { ...box, scale: 1 } });
  fs.writeFileSync(path.join(OUT, name + ".png"), Buffer.from(data, "base64"));
};
const shotViewport = async (name) => {
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(OUT, name + ".png"), Buffer.from(data, "base64"));
};

const HELPERS = `
window.__qa = {
  lum(rgb) { const [r, g, b] = rgb.match(/\\d+(\\.\\d+)?/g).slice(0, 3).map(Number).map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; },
  ratio(a, b) { const [x, y] = [this.lum(a), this.lum(b)].sort((p, q) => q - p); return +((x + 0.05) / (y + 0.05)).toFixed(2); },
  describe(el) { if (!el || el === document.body) return 'BODY'; const label = el.getAttribute('aria-label') || (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 40);
    return el.tagName.toLowerCase() + (el.getAttribute('href') ? '[' + el.getAttribute('href') + ']' : '') + ' "' + label + '"'; },
  where(el) { const s = el.closest('section[id]'); if (s) return '#' + s.id; if (el.closest('footer')) return 'footer'; if (el.closest('nav')) return 'nav'; return 'callbar'; },
  lines(el) { const r = document.createRange(); r.selectNodeContents(el); return new Set([...r.getClientRects()].map((x) => Math.round(x.top))).size; },
};
true;`;

const results = {};
const log = (k, v) => { results[k] = v; console.log("== " + k + "\n" + JSON.stringify(v, null, 1)); };

async function main() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "qa111-edge-"));
  const edge = spawn(EDGE, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
    "--no-first-run", "--no-default-browser-check", "--disable-gpu", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
  let version;
  for (let i = 0; i < 50 && !version; i++) { try { version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); } catch (e) { await sleep(200); } }
  const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r));
  ws.addEventListener("message", (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result); }
    else if (m.method) listeners.slice().forEach((l) => l(m));
  });
  log("browser", version.Browser);
  await send("Page.enable"); await send("Runtime.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: HELPERS });

  // ---- 1. Surfaces, overflow, Team heights, label wrap, screenshots ----------------------------
  for (const [w, h] of [[375, 812], [768, 1024], [1024, 800], [1279, 800], [1280, 800]]) {
    await viewport(w, h); await load(); await scrollThrough();
    log(`layout@${w}`, await js(`(() => {
      const de = document.documentElement; const k = document.querySelector('#kontakt'); const f = document.querySelector('footer');
      const cta = k.querySelector('a[href^="tel:"]'); const ctaCs = getComputedStyle(cta);
      const cards = [...document.querySelectorAll('#team li > figure')].map((x) => x.getBoundingClientRect());
      const name = [...k.querySelectorAll('p')].find((p) => p.textContent.trim() === 'Marcus Auner');
      const role = [...k.querySelectorAll('p')].find((p) => p.textContent.trim() === 'Geschäftsführung');
      const cols = [...k.querySelector('.grid').children].map((c) => Math.round(c.getBoundingClientRect().left));
      return {
        horizontalOverflowPx: de.scrollWidth - de.clientWidth,
        kontaktBg: getComputedStyle(k).backgroundColor, footerBg: getComputedStyle(f).backgroundColor,
        footerBorderTop: getComputedStyle(f).borderTopWidth + ' ' + getComputedStyle(f).borderTopStyle,
        kontaktToFooterGapPx: Math.round(f.getBoundingClientRect().top - k.getBoundingClientRect().bottom),
        kontaktVsFooterContrast: __qa.ratio(getComputedStyle(k).backgroundColor, getComputedStyle(f).backgroundColor),
        ctaFill: ctaCs.backgroundColor, ctaText: ctaCs.color,
        ctaEdgeVsWhite: __qa.ratio(ctaCs.backgroundColor, getComputedStyle(k).backgroundColor),
        ctaTextVsFill: __qa.ratio(ctaCs.color, ctaCs.backgroundColor),
        kontaktImages: k.querySelectorAll('img').length,
        kontaktColumns: new Set(cols).size,
        teamCardRows: new Set(cards.map((r) => Math.round(r.top))).size,
        teamCardHeights: cards.map((r) => Math.round(r.height * 10) / 10),
        teamCardsEqualHeight: new Set(cards.map((r) => Math.round(r.height))).size === 1,
        nameLines: __qa.lines(name), roleLines: __qa.lines(role),
        nameRightPx: Math.round(name.getBoundingClientRect().right), viewport: de.clientWidth,
        footerEmblem: (() => { const i = f.querySelector('img'); const s = i.parentElement.getBoundingClientRect(); return { size: Math.round(s.width) + 'x' + Math.round(s.height), radius: getComputedStyle(i.parentElement).borderRadius, alt: i.getAttribute('alt') }; })(),
        navEmblem: (() => { const s = document.querySelector('nav img').parentElement.getBoundingClientRect(); return Math.round(s.width) + 'x' + Math.round(s.height); })(),
        footerText: f.innerText.replace(/\\s+/g, ' ').trim(),
      };
    })()`));
    if ([375, 768, 1280].includes(w)) {
      for (const sel of ["#team", "#kontakt", "footer"]) await shotEl(`${sel.replace("#", "")}-${w}`, sel);
    }
  }

  // ---- 2. Anchor landing on #kontakt: heading clear of the nav, call visible without scrolling ---
  for (const [w, h] of [[375, 812], [375, 667], [768, 1024], [1280, 800]]) {
    await viewport(w, h); await load(); await scrollThrough();
    await js(`document.querySelector('nav a[href="#kontakt"]').click(), true`);
    let last = -1; for (let i = 0; i < 40; i++) { await sleep(100); const y = await js("scrollY"); if (y === last) break; last = y; }
    await sleep(900);
    log(`anchor-kontakt@${w}x${h}`, await js(`(() => {
      const k = document.querySelector('#kontakt'); const head = k.querySelector('h2'); const nav = document.querySelector('nav').getBoundingClientRect();
      const bar = document.querySelector('nav').nextElementSibling; const barTop = getComputedStyle(bar).display === 'none' ? innerHeight : bar.getBoundingClientRect().top;
      const call = k.querySelector('a[href^="tel:"]').getBoundingClientRect();
      return { hash: location.hash, navBottom: nav.bottom, headingTop: Math.round(head.getBoundingClientRect().top), headingClear: head.getBoundingClientRect().top >= nav.bottom,
        callTop: Math.round(call.top), callBottom: Math.round(call.bottom), visibleAreaBottom: Math.round(barTop), callVisibleWithoutScroll: call.top >= nav.bottom && call.bottom <= barTop };
    })()`));
    await shotViewport(`anchor-kontakt-${w}x${h}`);
  }

  // ---- 3. Keyboard: tab order and focus visibility through Kontakt and the footer --------------
  for (const [w, h] of [[375, 812], [768, 1024], [1280, 800]]) {
    await viewport(w, h); await load(); await scrollThrough();
    const stops = [];
    for (let i = 0; i < 60; i++) {
      await key();
      const info = await js(`(() => { const el = document.activeElement; if (el === document.body) return null; const cs = getComputedStyle(el);
        const bg = (() => { for (let a = el.parentElement; a; a = a.parentElement) { const b = getComputedStyle(a).backgroundColor; if (b !== 'rgba(0, 0, 0, 0)') return b; } return 'rgb(255, 255, 255)'; })();
        const outlineOn = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
        return { el: __qa.describe(el), where: __qa.where(el), focusVisible: el.matches(':focus-visible'), outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor,
          ring: cs.boxShadow, surface: bg, outlineVsSurface: outlineOn ? __qa.ratio(cs.outlineColor, bg) : null }; })()`);
      if (!info) break;
      if (stops.length && info.el === stops[0].el && info.where === stops[0].where) break;
      stops.push(info);
      if (info.where === "#kontakt" || info.where === "footer") {
        // The page scrolls focus into view smoothly; wait for it to settle before the screenshot.
        await sleep(1500);
        try { await shotViewport(`focus-${w}-${String(stops.length).padStart(2, "0")}-${info.where.replace("#", "")}`); }
        catch (e) { info.screenshot = e.message; }
      }
    }
    log(`keyboard@${w}`, { order: stops.map((s) => `${s.where} ${s.el}`), kontaktAndFooter: stops.filter((s) => s.where === "#kontakt" || s.where === "footer") });
  }

  fs.writeFileSync(path.join(__dirname, "results.json"), JSON.stringify(results, null, 1));
  ws.close(); edge.kill(); setTimeout(() => process.exit(0), 500);
}

main().catch((e) => { console.error(e); process.exit(1); });
