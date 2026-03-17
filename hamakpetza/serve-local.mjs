import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'out');
const BASE = '/ai-academy';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.txt':  'text/plain',
};

function tryFile(p) {
  try { const s = statSync(p); return s.isFile() ? p : null; } catch { return null; }
}

createServer((req, res) => {
  let url = req.url.split('?')[0];
  // Strip basePath prefix
  if (url.startsWith(BASE)) url = url.slice(BASE.length) || '/';
  if (!url.startsWith('/')) url = '/' + url;

  let filePath = join(OUT, url);
  let resolved =
    tryFile(filePath) ||
    tryFile(filePath.replace(/\/$/, '') + '/index.html') ||
    tryFile(join(OUT, '404.html'));

  if (!resolved) { res.writeHead(404); res.end('Not found'); return; }

  const ext = extname(resolved);
  const mime = MIME[ext] || 'application/octet-stream';
  const isNotFound = resolved.endsWith('404.html') && !filePath.endsWith('404.html');
  res.writeHead(isNotFound ? 404 : 200, { 'Content-Type': mime });
  createReadStream(resolved).pipe(res);
}).listen(3000, () => console.log('Serving at http://localhost:3000' + BASE + '/'));
