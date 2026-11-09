import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sw = fs.readFileSync(path.join(ROOT, 'public/sw.js'), 'utf8');
const requiredPrecache = [
  '/offline.html',
  '/manifest.json',
  '/bootstrap.js',
  '/global.css',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
];
const failures = [];

if (!sw.includes("const CACHE_NAME = 'maeumcheck-v3'")) failures.push('서비스 워커 캐시 버전 v3가 아닙니다.');
for (const asset of requiredPrecache) {
  const sourceToken = asset === '/offline.html' ? 'OFFLINE_URL' : `'${asset}'`;
  if (!sw.includes(sourceToken)) failures.push(`사전 캐시 자산 누락: ${asset}`);
}
if (!/request\.method !== 'GET'/.test(sw)) failures.push('GET 요청만 캐시하는 경계가 없습니다.');
if (!/url\.origin !== self\.location\.origin/.test(sw)) failures.push('동일 출처 캐시 경계가 없습니다.');
if (/PeriodicSyncManager|periodicSync|BackgroundFetch|sync\.register|sendBeacon|WebSocket|XMLHttpRequest|EventSource/.test(sw)) failures.push('백그라운드 전송 또는 동기화 API가 허용되지 않습니다.');
if (/localStorage|sessionStorage|indexedDB/.test(sw)) failures.push('서비스 워커가 브라우저 저장소를 다루면 안 됩니다.');

if (failures.length > 0) {
  console.error('PWA 정적 위기 자산 감사: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`PWA 정적 위기 자산 감사: PASS (${requiredPrecache.length}개 필수 자산, 동일 출처 GET 캐시)`);
}
