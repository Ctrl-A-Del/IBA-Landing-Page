// Ticket 11 browser pass: headless Edge driven over the Chrome DevTools Protocol.
// Node 22 built-ins only (global WebSocket + fetch). Usage: node qa.js http://127.0.0.1:3011/
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PAGE_URL = process.argv[2] || "http://127.0.0.1:3011/";
const OUT = path.join(__dirname, "shots");
const PORT = 9333;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });

class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map(); this.listeners = [];
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      } else if (msg.method) {
        this.listeners.forEach((l) => l(msg));
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => { this.pending.set(id, { resolve, reject }); setTimeout(() => reject(new Error("CDP timeout " + method)), 30000); });
  }
  once(method, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error("timeout " + method)), timeout);
      const l = (msg) => {
        if (msg.method === method) {
          clearTimeout(t); this.listeners = this.listeners.filter((x) => x !== l); resolve(msg.params);
        }
      };
      this.listeners.push(l);
    });
  }
}

let cdp;
const failedRequests = [];
const js = async (expr) => {
  const r = await cdp.send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 800));
  return r.result.value;
};
const viewport = async (w, h) =>
  cdp.send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
const reducedMotion = async (on) =>
  cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: on ? "reduce" : "no-preference" }] });
const load = async () => {
  const p = cdp.once("Page.loadEventFired");
  await cdp.send("Page.navigate", { url: PAGE_URL });
  await p;
  await js("document.fonts.ready.then(() => true)");
  await sleep(400);
};
const KEYS = { Tab: 9, Enter: 13, Escape: 27 };
const key = async (k, shift = false) => {
  const base = { key: k, code: k, windowsVirtualKeyCode: KEYS[k], nativeVirtualKeyCode: KEYS[k], modifiers: shift ? 8 : 0 };
  await cdp.send("Input.dispatchKeyEvent", { type: "rawKeyDown", ...base });
  if (k === "Enter") await cdp.send("Input.dispatchKeyEvent", { type: "char", text: "\r", ...base });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", ...base });
  await sleep(120);
};
const click = async (x, y) => {
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
  await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
  await sleep(250);
};
const shot = async (name, full = false) => {
  let params = { format: "png" };
  if (full) {
    const { w, h } = await js("({w: document.documentElement.clientWidth, h: document.documentElement.scrollHeight})");
    params = { ...params, captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height: h, scale: 1 } };
  }
  const { data } = await cdp.send("Page.captureScreenshot", params);
  const file = path.join(OUT, name + ".png");
  fs.writeFileSync(file, Buffer.from(data, "base64"));
  return file;
};
// Scroll the whole page in steps so lazy images load and reveals fire, then return to the top.
const scrollThrough = async () => {
  await js(`(async () => { const s = (ms) => new Promise(r => setTimeout(r, ms));
    for (let y = 0; y <= document.documentElement.scrollHeight; y += innerHeight / 2) { scrollTo({top: y, behavior: 'instant'}); await s(80); }
    await s(900); scrollTo({top: 0, behavior: 'instant'}); await s(300); return true; })()`);
};
const removeShowcase = () =>
  js(`(() => { const f = document.querySelector('footer'); let n = 0; while (f.nextElementSibling) { f.nextElementSibling.remove(); n++; } return n; })()`);

// ---- In-page helpers, injected as a string --------------------------------------------------------
const HELPERS = `
window.__qa = {
  describe(el) {
    if (!el || el === document.body) return 'BODY';
    const label = el.getAttribute('aria-label') || (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 40);
    return el.tagName.toLowerCase() + (el.getAttribute('href') ? '[' + el.getAttribute('href') + ']' : '') + ' "' + label + '"';
  },
  landmark(el) {
    const lm = el.closest('nav, main, footer');
    if (lm) return lm.tagName.toLowerCase() + (el.closest('section[id]') ? '#' + el.closest('section[id]').id : '');
    if (el.closest('dialog')) return 'dialog';
    const footer = document.querySelector('footer');
    return footer && (footer.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) ? 'SHOWCASE' : 'callbar';
  },
  focusInfo() {
    const el = document.activeElement;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const outlineVisible = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 && !/rgba\\(\\d+, \\d+, \\d+, 0\\)|#0000/.test(cs.outlineColor);
    return { el: this.describe(el), where: el === document.body ? '-' : this.landmark(el), focusVisible: el.matches(':focus-visible'),
      outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor, boxShadow: cs.boxShadow,
      indicator: outlineVisible || cs.boxShadow !== 'none', inViewport: r.bottom > 0 && r.top < innerHeight && r.width > 0,
      y: Math.round(r.top + scrollY), x: Math.round(r.left) };
  },
  tabbables() {
    const sel = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"]), summary, [contenteditable="true"]';
    return [...document.querySelectorAll(sel)].filter((el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden' && !el.closest('dialog:not([open])'))
      .map((el) => this.describe(el) + ' @' + this.landmark(el));
  },
};
true;
`;

const results = {};
const log = (k, v) => { results[k] = v; console.log("== " + k + "\n" + JSON.stringify(v, null, 1)); };

async function main() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "qa11-edge-"));
  const edge = spawn(EDGE, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
    "--no-first-run", "--no-default-browser-check", "--disable-gpu", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
  let version;
  for (let i = 0; i < 50 && !version; i++) {
    try { version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); } catch (e) { await sleep(200); }
  }
  const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r));
  cdp = new CDP(ws);
  log("browser", version.Browser);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Network.enable");
  cdp.listeners.push((m) => {
    if (m.method === "Network.responseReceived" && m.params.response.status >= 400) failedRequests.push(m.params.response.status + " " + m.params.response.url);
    if (m.method === "Network.loadingFailed" && !m.params.canceled) failedRequests.push("FAILED " + m.params.errorText + " " + m.params.requestId);
  });
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source: HELPERS });

  const WIDTHS = [[360, 740], [375, 812], [768, 1024], [1280, 800]];

  const STAGES = (process.argv[3] || "1,2,3,4,5,6,7,8,9").split(",");
  // ---- 1. Overflow, images, layout facts, screenshots -------------------------------------------
  if (STAGES.includes("1")) for (const [w, h] of WIDTHS) {
    await reducedMotion(false);
    await viewport(w, h);
    await load();
    await scrollThrough();
    const facts = await js(`(() => {
      const de = document.documentElement;
      const offenders = [...document.querySelectorAll('body *')].filter((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || (r.right <= de.clientWidth + 0.5 && r.left >= -0.5)) return false;
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          const o = getComputedStyle(a).overflowX; if (o !== 'visible') return false;
        }
        return getComputedStyle(el).position !== 'fixed' || true;
      }).slice(0, 10).map((el) => __qa.describe(el) + ' L' + Math.round(el.getBoundingClientRect().left) + ' R' + Math.round(el.getBoundingClientRect().right));
      const imgs = [...document.images].map((i) => ({ src: i.getAttribute('src'), ok: i.complete && i.naturalWidth > 0, natural: i.naturalWidth + 'x' + i.naturalHeight, where: __qa.landmark(i) }));
      const team = [...document.querySelectorAll('#team li')].map((li) => li.getBoundingClientRect());
      const portrait = (img) => { const cs = getComputedStyle(img); const r = img.getBoundingClientRect();
        return { objectFit: cs.objectFit, objectPosition: cs.objectPosition, aspectRatio: cs.aspectRatio, ratio: +(r.height / r.width).toFixed(4), w: Math.round(r.width), cls: img.className }; };
      const marcusTeam = document.querySelector('#team img[src$="marcus.png"]');
      const marcusKontakt = document.querySelector('#kontakt img[src$="marcus.png"]');
      const allPortraits = [...document.querySelectorAll('#team img')].map((i) => +(i.getBoundingClientRect().height / i.getBoundingClientRect().width).toFixed(4));
      const nav = document.querySelector('nav').getBoundingClientRect();
      const h1 = document.querySelector('#start h1').getBoundingClientRect();
      const bar = document.querySelector('nav').nextElementSibling;
      return { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, bodyScrollWidth: document.body.scrollWidth,
        horizontalOverflowPx: de.scrollWidth - de.clientWidth, offenders, imgs,
        teamColumns: new Set(team.map((r) => Math.round(r.left))).size, teamRows: new Set(team.map((r) => Math.round(r.top))).size,
        teamPortraitRatios: allPortraits, marcusTeam: portrait(marcusTeam), marcusKontakt: portrait(marcusKontakt),
        navHeight: nav.height, heroH1Top: Math.round(h1.top), callBarDisplay: getComputedStyle(bar).display,
        callBarHeight: bar.getBoundingClientRect().height, bodyPaddingBottom: getComputedStyle(document.body).paddingBottom,
        navCta: [...document.querySelectorAll('nav a[href^="tel:"]')].map((a) => ({ display: getComputedStyle(a.parentElement).display, text: a.innerText.trim() })),
        pageHeight: de.scrollHeight };
    })()`);
    log(`layout@${w}`, facts);
    await shot(`page-${w}`, true);
  }
  log("failedRequests(after layout pass)", failedRequests.slice());

  // ---- 2. Colours: no white on orange (computed) -------------------------------------------------
  if (STAGES.includes("2")) for (const w of [375, 1280]) {
    await viewport(w, 800); await load(); await scrollThrough();
    log(`orange@${w}`, await js(`(() => {
      const ORANGE = ['rgb(240, 138, 36)', 'rgb(212, 115, 15)', 'rgb(205, 110, 14)'];
      const bgOf = (el) => { for (let a = el; a; a = a.parentElement) { const b = getComputedStyle(a).backgroundColor; if (b !== 'rgba(0, 0, 0, 0)' && b !== 'transparent') return b; } return 'none'; };
      const textEls = [...document.querySelectorAll('body *')].filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) || el.tagName === 'svg');
      const onOrange = textEls.filter((el) => ORANGE.includes(bgOf(el)));
      return { elementsOnOrange: onOrange.length, colours: [...new Set(onOrange.map((el) => getComputedStyle(el).color))],
        white: onOrange.filter((el) => /rgb\\(255, 255, 255\\)/.test(getComputedStyle(el).color)).map((el) => __qa.describe(el) + ' @' + __qa.landmark(el)),
        where: [...new Set(onOrange.map((el) => __qa.landmark(el)))] };
    })()`));
  }

  // ---- 3. Phone + email: what a visitor gets when they copy -------------------------------------
  if (STAGES.includes("3")) for (const w of [375, 1280]) {
    await viewport(w, 800); await load(); await scrollThrough();
    log(`contact-links@${w}`, await js(`(() => {
      const out = [];
      for (const a of document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]')) {
        if (!a.getClientRects().length) { out.push({ where: __qa.landmark(a), href: a.getAttribute('href'), hidden: true }); continue; }
        const textOnly = [...a.querySelectorAll('span')].filter((s) => s.getClientRects().length && /\\d|@/.test(s.textContent));
        const sel = getSelection(); sel.removeAllRanges();
        const r1 = document.createRange(); r1.selectNodeContents(a); sel.addRange(r1); const whole = sel.toString();
        sel.removeAllRanges();
        const num = textOnly[0]; let justNumber = null;
        if (num) { const r2 = document.createRange(); r2.selectNodeContents(num); sel.addRange(r2); justNumber = sel.toString(); sel.removeAllRanges(); }
        out.push({ where: __qa.landmark(a), href: a.getAttribute('href'), ariaLabel: a.getAttribute('aria-label'), copiedWhole: whole, copiedNumberSpan: justNumber, innerText: a.innerText });
      }
      return out;
    })()`));
  }

  // ---- 4. Keyboard: tab order, focus visibility, traps -------------------------------------------
  if (STAGES.includes("4")) for (const w of [375, 1280]) {
    await reducedMotion(false); await viewport(w, 800); await load(); await scrollThrough();
    const tabbable = await js("__qa.tabbables()");
    const seq = [];
    for (let i = 0; i < 60; i++) {
      await key("Tab");
      const info = await js("__qa.focusInfo()");
      seq.push(info);
      if (info.el === "BODY" && i > 0) break;
      if (seq.length > 2 && info.el === seq[0].el) break;
    }
    if (w === 1280) {
      // Screenshots of a few focused elements, to see the indicator, not just compute it.
      await load(); await scrollThrough();
      // Viewport screenshots (the keyboard scrolls the focused element into view itself).
      for (let i = 1; i <= 13; i++) {
        await key("Tab");
        await sleep(500);
        const { data } = await cdp.send("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(path.join(OUT, `focus-1280-${String(i).padStart(2, "0")}.png`), Buffer.from(data, "base64"));
      }
    }
    log(`keyboard@${w}`, { tabbableCount: tabbable.length, tabbable, sequence: seq });
  }

  // ---- 5. Lightbox keyboard + focus return ------------------------------------------------------
  if (STAGES.includes("5")) for (const [w, h] of [[375, 740], [1280, 800]]) {
    await viewport(w, h); await load(); await scrollThrough();
    const steps = [];
    const state = async (label) => {
      const s = await js(`(() => { const d = document.querySelector('#verfahren dialog'); const a = document.activeElement;
        return { open: d.open, modal: d.matches(':modal'), focus: __qa.describe(a), focusInDialog: d.contains(a), focusVisible: a.matches(':focus-visible') }; })()`);
      steps.push({ step: label, ...s }); return s;
    };
    for (let i = 0; i < 40; i++) { await key("Tab"); if ((await js("__qa.describe(document.activeElement)")).includes("Größer ansehen")) break; }
    await state("tabbed to trigger");
    await key("Enter"); await state("Enter on trigger");
    for (let i = 0; i < 4; i++) { await key("Tab"); await state("Tab inside dialog " + (i + 1)); }
    await key("Tab", true); await state("Shift+Tab inside dialog");
    await shot(`lightbox-open-${w}`);
    await key("Escape"); await state("Escape");
    await key("Enter"); await state("Enter again (reopen)");
    for (let i = 0; i < 4; i++) { if ((await js("__qa.describe(document.activeElement)")).includes("Schließen")) break; await key("Tab"); }
    await state("focus on close button");
    await key("Enter"); await state("Enter on Schließen");
    await key("Enter"); await state("Enter again (reopen 2)");
    const img = await js(`(() => { const r = document.querySelector('#verfahren dialog img').getBoundingClientRect(); return {x: r.left + r.width / 2, y: r.top + r.height / 2}; })()`);
    await click(img.x, img.y); await state("click on enlarged render (must stay open)");
    await click(6, h - 6); await state("click on backdrop corner");
    // Pointer path: click the inline render, then close with Esc.
    const inline = await js(`(() => { const i = document.querySelector('#verfahren > div > div > img'); i.scrollIntoView({block: 'center', behavior: 'instant'}); const r = i.getBoundingClientRect(); return {x: r.left + r.width / 2, y: r.top + r.height / 2}; })()`);
    await sleep(200);
    await click(inline.x, inline.y); await state("click inline render");
    await key("Escape"); await state("Escape after pointer open");
    log(`lightbox@${w}`, steps);
  }

  // ---- 6. Reduced motion -----------------------------------------------------------------------
  if (STAGES.includes("6")) for (const w of [375, 1280]) {
    await reducedMotion(true); await viewport(w, 800); await load();
    const before = await js(`(() => {
      const reveals = [...document.querySelectorAll('[data-revealed]')];
      const hidden = [...document.querySelectorAll('nav *, main *, footer *')].filter((el) => getComputedStyle(el).opacity === '0' || getComputedStyle(el).visibility === 'hidden')
        .filter((el) => !el.closest('dialog')).map((el) => __qa.describe(el));
      return { matches: matchMedia('(prefers-reduced-motion: reduce)').matches, reveals: reveals.length,
        revealedFalse: reveals.filter((r) => r.dataset.revealed !== 'true').length,
        opacities: [...new Set(reveals.map((r) => getComputedStyle(r).opacity))],
        transforms: [...new Set(reveals.map((r) => getComputedStyle(r).transform))],
        revealTransitionDuration: [...new Set(reveals.map((r) => getComputedStyle(r).transitionDuration))],
        navTransition: getComputedStyle(document.querySelector('nav')).transitionProperty + ' / ' + getComputedStyle(document.querySelector('nav')).transitionDuration,
        htmlScrollBehavior: getComputedStyle(document.documentElement).scrollBehavior, hiddenInLandmarks: hidden };
    })()`);
    await shot(`reduced-motion-${w}-noscroll`, true);
    log(`reducedMotion@${w}`, before);
  }
  // Contrast run: without reduced motion, reveals are hidden until scrolled (so the above is meaningful).
  await reducedMotion(false); await viewport(1280, 800); await load();
  log("motion-on@1280 before scroll", await js(`(() => { const r = [...document.querySelectorAll('[data-revealed]')]; return { reveals: r.length, falseCount: r.filter((x) => x.dataset.revealed !== 'true').length }; })()`));

  // ---- 7. Anchor landing under the fixed nav ------------------------------------------------------
  if (STAGES.includes("7")) for (const shipping of [false, true]) {
    for (const [w, h] of [[375, 812], [768, 1024], [1280, 800]]) {
      await reducedMotion(false); await viewport(w, h); await load(); await scrollThrough();
      if (shipping) await removeShowcase();
      const rows = [];
      for (const href of ["#verfahren", "#einsatzbereiche", "#team", "#kontakt", "#start"]) {
        await js(`document.querySelector('a[href="${href}"]').click()`);
        let last = -1;
        for (let i = 0; i < 40; i++) { await sleep(100); const y = await js("scrollY"); if (y === last) break; last = y; }
        await sleep(800);
        rows.push(await js(`(() => { const s = document.querySelector('${href}'); const head = s.querySelector('h1, h2'); const eyebrow = head.previousElementSibling;
          const nav = document.querySelector('nav').getBoundingClientRect();
          const max = document.documentElement.scrollHeight - innerHeight;
          return { href: '${href}', hash: location.hash, scrollY: Math.round(scrollY), maxScroll: max, sectionTop: Math.round(s.getBoundingClientRect().top), navBottom: nav.bottom,
            eyebrowTop: eyebrow ? Math.round(eyebrow.getBoundingClientRect().top) : null, headingTop: Math.round(head.getBoundingClientRect().top),
            headingClear: head.getBoundingClientRect().top >= nav.bottom }; })()`));
        if (w === 375 && href === "#kontakt") await shot(`anchor-kontakt-375${shipping ? "-shipping" : ""}`);
      }
      log(`anchors@${w}${shipping ? " (showcase removed)" : ""}`, rows);
    }
  }

  // ---- 8. Shipping state: footer is last, call bar clearance --------------------------------------
  if (STAGES.includes("8")) for (const [w, h] of [[360, 740], [375, 812], [1280, 800]]) {
    await viewport(w, h); await load(); await scrollThrough(); await removeShowcase();
    await js("scrollTo({top: document.documentElement.scrollHeight, behavior: 'instant'}), true"); await sleep(400);
    log(`bottom@${w} (showcase removed)`, await js(`(() => { const f = document.querySelector('footer'); const bar = document.querySelector('nav').nextElementSibling;
      const links = [...f.querySelectorAll('a')].map((a) => Math.round(a.getBoundingClientRect().bottom));
      const barTop = getComputedStyle(bar).display === 'none' ? null : bar.getBoundingClientRect().top;
      const plate = f.querySelector('img').getBoundingClientRect(); const pi = f.querySelector('img');
      return { footerBottom: f.getBoundingClientRect().bottom, legalLinkBottoms: links, callBarTop: barTop, clear: barTop === null || f.getBoundingClientRect().bottom <= barTop + 0.5,
        plate: { w: plate.width, h: plate.height, renderedRatio: +(plate.height / plate.width).toFixed(4), naturalRatio: +(pi.naturalHeight / pi.naturalWidth).toFixed(4) },
        footerBg: getComputedStyle(f).backgroundColor, kontaktBg: getComputedStyle(document.querySelector('#kontakt')).backgroundColor, footerBorderTop: getComputedStyle(f).borderTop }; })()`));
    await shot(`bottom-${w}-shipping`);
  }

  if (STAGES.includes("10")) for (const [w, h] of [[768, 1024], [1280, 800]]) {
    await reducedMotion(false); await viewport(w, h); await load();
    await js(`(async () => { const s = (ms) => new Promise(r => setTimeout(r, ms)); for (const i of document.images) { i.scrollIntoView({block: "center", behavior: "instant"}); await s(400); } await s(1500); return true; })()`);
    log(`images@${w}`, await js(`[...document.images].map((i) => ({ src: i.getAttribute("src"), loading: i.loading, complete: i.complete, natural: i.naturalWidth + "x" + i.naturalHeight, where: __qa.landmark(i) }))`));
  }
  if (STAGES.includes("11")) for (const [w, h] of [[375, 812], [768, 1024], [1280, 800]]) {
    await reducedMotion(true); await viewport(w, h); await load(); await removeShowcase();
    for (const sel of ["#start", "#verfahren", "#einsatzbereiche", "#warum", "#team", "#kontakt", "footer"]) {
      const top = await js(`document.querySelector("${sel}").getBoundingClientRect().top + scrollY`);
      const height = await js(`document.querySelector("${sel}").getBoundingClientRect().height`);
      for (let y = top, n = 0; y < top + height && n < 4; y += h - 80, n++) {
        await js(`scrollTo({top: ${y} - 80, behavior: "instant"}), true`); await sleep(300);
        await shot(`section-${w}-${sel.replace("#", "")}-${n}`);
      }
    }
  }
  if (STAGES.includes("12")) for (const grant of [true, false]) {
    await reducedMotion(true); await viewport(375, 812); await load();
    if (grant) await cdp.send("Browser.grantPermissions", { origin: new URL(PAGE_URL).origin, permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"] }); else await cdp.send("Browser.resetPermissions");
    await js(`(() => { const b = [...document.querySelectorAll("#kontakt button")].find((x) => x.textContent.includes("Adresse kopieren")); b.scrollIntoView({block: "center", behavior: "instant"}); b.focus(); return true; })()`);
    await key("Enter"); await sleep(800);
    const res = await js(`(async () => { let clip = null; try { clip = await navigator.clipboard.readText(); } catch (e) { clip = "readText failed: " + e.name; }
      return { secure: isSecureContext, status: document.querySelector("#kontakt [role=status]").textContent, selection: getSelection().toString(), active: __qa.describe(document.activeElement), clipboard: clip }; })()`);
    log(`clipboard grant=${grant}`, res);
    await shot(`clipboard-375-grant-${grant}`);
  }
  if (!STAGES.includes("9")) { log("failedRequests(total)", failedRequests); ws.close(); edge.kill(); setTimeout(() => process.exit(0), 500); return; }
  // Brand match: nav emblem vs footer plate, side by side.
  await viewport(1280, 800); await load(); await scrollThrough();
  const em = await js(`(() => { const r = document.querySelector('nav a[href="#start"]').getBoundingClientRect(); return {x: r.left, y: r.top, w: r.width, h: r.height}; })()`);
  let r = await cdp.send("Page.captureScreenshot", { format: "png", clip: { x: em.x - 8, y: em.y - 8, width: em.w + 16, height: em.h + 16, scale: 4 } });
  fs.writeFileSync(path.join(OUT, "brand-nav-emblem.png"), Buffer.from(r.data, "base64"));
  const pl = await js(`(() => { const i = document.querySelector('footer img'); i.scrollIntoView({block: 'center', behavior: 'instant'}); const r = i.getBoundingClientRect(); return {x: r.left, y: r.top, w: r.width, h: r.height}; })()`);
  await sleep(300);
  r = await cdp.send("Page.captureScreenshot", { format: "png", clip: { x: pl.x - 8, y: pl.y - 8, width: pl.w + 16, height: pl.h + 16, scale: 2 } });
  fs.writeFileSync(path.join(OUT, "brand-footer-plate.png"), Buffer.from(r.data, "base64"));

  log("failedRequests(total)", failedRequests);
  fs.writeFileSync(path.join(__dirname, "results.json"), JSON.stringify(results, null, 1));
  ws.close(); edge.kill();
  setTimeout(() => process.exit(0), 500);
}

main().catch((e) => { console.error(e); process.exit(1); });
