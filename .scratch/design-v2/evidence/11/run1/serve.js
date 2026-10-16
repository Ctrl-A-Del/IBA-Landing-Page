// Minimal static server for the production build (no SPA fallback, so 404s are real 404s).
const http = require("http");
const fs = require("fs");
const path = require("path");
const root = path.resolve(process.argv[2]);
const port = Number(process.argv[3] || 3011);
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".json": "application/json",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".txt": "text/plain",
};
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(root, p);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end("404"); console.log("404", req.url); return;
  }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}).listen(port, "127.0.0.1", () => console.log("serving", root, "on", port));
