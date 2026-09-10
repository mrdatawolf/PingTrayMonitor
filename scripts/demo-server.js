#!/usr/bin/env node
// Minimal static file server for the demo build (dist/demo-web). No
// dependencies beyond Node itself, so `start.sh --demo` stays self-contained.
// Binds to 0.0.0.0 so other devices on the same LAN can open it.
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..', 'dist', 'demo-web');
const PORT = Number(process.env.DEMO_PORT) || 7039;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function lanAddresses() {
  const addrs = [];
  for (const ifaces of Object.values(os.networkInterfaces())) {
    for (const iface of ifaces || []) {
      if (iface.family === 'IPv4' && !iface.internal) addrs.push(iface.address);
    }
  }
  return addrs;
}

if (!fs.existsSync(ROOT)) {
  console.error(`[demo] Build output not found at ${ROOT}`);
  console.error('[demo] Run `npm run build:demo` first (start.sh --demo does this automatically).');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  // Resolve inside ROOT and refuse to escape it.
  let filePath = path.normalize(path.join(ROOT, reqPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback: unknown paths (e.g. a client-side route) get index.html.
      fs.readFile(path.join(ROOT, 'index.html'), (fallbackErr, fallbackData) => {
        if (fallbackErr) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': MIME_TYPES['.html'] });
        res.end(fallbackData);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('=== Ping Tray Monitor — DEMO mode ===');
  console.log('');
  console.log(`  Local:   http://localhost:${PORT}`);
  for (const addr of lanAddresses()) {
    console.log(`  Network: http://${addr}:${PORT}`);
  }
  console.log('');
  console.log('  Open one of the Network URLs from another device on the same LAN.');
  console.log('  Press Ctrl+C to stop.');
  console.log('');
});
