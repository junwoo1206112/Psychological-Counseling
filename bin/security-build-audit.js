import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
const exists = (relativePath) => fs.existsSync(path.join(ROOT, relativePath));
const failures = [];

if (!exists('dist/index.html')) {
  failures.push('dist/index.html이 없습니다. 먼저 npm.cmd run build:web을 실행하세요.');
} else {
  const html = read('dist/index.html');
  const nginx = read('deploy/nginx/depression-check.conf');
  const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
  if (inlineScripts.length !== 1) {
    failures.push(`예상한 1개와 달리 inline script가 ${inlineScripts.length}개입니다.`);
  } else {
    const hydration = inlineScripts[0];
    if (!/globalThis\.__EXPO_ROUTER_HYDRATE__=true;/.test(hydration)) failures.push('Expo hydration inline script를 확인할 수 없습니다.');
    const hash = crypto.createHash('sha256').update(hydration).digest('base64');
    if (!nginx.includes(`'sha256-${hash}'`)) failures.push('Nginx CSP script-src에 현재 빌드 hydration SHA-256이 없습니다.');
  }
  for (const asset of ['dist/bootstrap.js', 'dist/global.css']) {
    if (!exists(asset)) failures.push(`빌드 산출물 정적 CSP 자산 누락: ${asset}`);
  }
  const appBundles = [...html.matchAll(/<script[^>]+src="[^"]*\/_expo\/static\/js\/web\/[^"]+\.js"/gi)];
  if (appBundles.length === 0) {
    failures.push('dist/index.html에 앱 JS 번들이 없습니다. SDK 58+ 커스텀 +html은 useServerDocumentContext의 bodyNodes를 렌더해야 합니다.');
  }
}

if (failures.length > 0) {
  console.error('빌드 산출물 CSP 무결성 감사: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('빌드 산출물 CSP 무결성 감사: PASS (hydration 해시·inline script·앱 JS 번들·정적 자산)');
}
