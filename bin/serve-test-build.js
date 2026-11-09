#!/usr/bin/env node
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, stat } from 'node:fs/promises';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.TEST_WEB_PORT || 4173);
const MIME = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };

function candidatePaths(pathname) {
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  return [relative, `${relative}.html`, path.join(relative, 'index.html'), 'index.html'];
}

async function getFile(pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { return null; }
  for (const candidate of candidatePaths(decoded)) {
    const target = path.resolve(root, candidate);
    if (!target.startsWith(`${root}${path.sep}`) && target !== root) continue;
    try {
      if ((await stat(target)).isFile()) return target;
    } catch { /* Try the next static route candidate. */ }
  }
  return null;
}

http.createServer(async (request, response) => {
  const file = await getFile(new URL(request.url, `http://${request.headers.host}`).pathname);
  if (!file) { response.writeHead(404).end('Not found'); return; }
  const extension = path.extname(file);
  response.writeHead(200, { 'Content-Type': `${MIME[extension] || 'application/octet-stream'}; charset=utf-8`, 'Cache-Control': 'no-store' });
  response.end(await readFile(file));
}).listen(port, '127.0.0.1', () => console.log(`Test build server: http://127.0.0.1:${port}`));
