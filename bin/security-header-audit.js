import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
const exists = (relativePath) => fs.existsSync(path.join(ROOT, relativePath));
const nginx = read('deploy/nginx/depression-check.conf');
const html = read('app/+html.js');
const expectedCspParts = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'sha256-67fhrP0+BkBqmgGGXTtgiVO/9EQs3QruYNU/7fnRkI8='",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
];
const failures = [];

if (!/add_header Content-Security-Policy/.test(nginx)) failures.push('Nginx CSP 헤더가 없습니다.');
if (!/X-Frame-Options "DENY"/.test(nginx)) failures.push('Nginx X-Frame-Options는 DENY여야 합니다.');
for (const part of expectedCspParts) {
  if (!nginx.includes(part)) failures.push(`CSP 지시어 누락: ${part}`);
}
if (/script-src[^;]*unsafe-inline/.test(nginx)) failures.push('CSP script-src에 unsafe-inline이 허용되어 있습니다.');
if (/X-Frame-Options "SAMEORIGIN"|frame-ancestors 'self'/.test(nginx)) failures.push('iframe 임베드 허용 설정이 남아 있습니다.');
if (html.includes('dangerouslySetInnerHTML')) failures.push('앱 HTML에 인라인 코드 주입이 남아 있습니다.');
if (!html.includes('href="/global.css"')) failures.push('정적 전역 CSS 연결이 없습니다.');
if (!html.includes('src="/bootstrap.js"')) failures.push('정적 부트스트랩 연결이 없습니다.');
for (const asset of ['public/global.css', 'public/bootstrap.js']) {
  if (!exists(asset)) failures.push(`정적 보안 자산 누락: ${asset}`);
}

if (failures.length > 0) {
  console.error('정적 웹 보안 헤더 감사: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('정적 웹 보안 헤더 감사: PASS (CSP, 외부 부트스트랩, 정적 스타일)');
}
