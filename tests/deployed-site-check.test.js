import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  checkDeployedSite,
  validateDeployedUrl,
  validateManifest,
  validateOfflinePage,
  validateRootResponse,
  validateServiceWorker,
} from '../lib/deployed-site-check.js';

const inlineScript = 'globalThis.__EXPO_ROUTER_HYDRATE__=true;';
const inlineHash = crypto.createHash('sha256').update(inlineScript).digest('base64');
const validHeaders = {
  'content-security-policy':
    `default-src 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'sha256-${inlineHash}'; style-src 'self' 'unsafe-inline'`,
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'geolocation=(), microphone=(), camera=()',
  'cache-control': 'no-cache',
  'content-type': 'text/html; charset=utf-8',
};

const rootHtml = `<html><body><script src="/_expo/static/js/web/entry-test.js"></script><script>${inlineScript}</script></body></html>`;
const manifest = {
  name: '마음 체크',
  short_name: '마음 체크',
  start_url: '/',
  display: 'standalone',
  icons: [
    { src: '/icons/icon-192.png', sizes: '192x192', purpose: 'any' },
    { src: '/icons/icon-512.png', sizes: '512x512', purpose: 'any' },
    { src: '/icons/icon-maskable-512.png', sizes: '512x512', purpose: 'maskable' },
  ],
};
const swText = "const OFFLINE_URL = '/offline.html';\nself.addEventListener('fetch', () => {});";
const offlineHtml = ['tel:109', 'tel:119', 'tel:112', 'tel:1577-0199', 'tel:1388'].map((link) => `<a href="${link}">x</a>`).join('');
const crisisHtml = '<h1>지금 바로 도움을 받아 주세요.</h1><a href="tel:109">109</a>';

function response(body, { status = 200, headers = {} } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers(headers),
    text: async () => body,
  };
}

function fakeFetch({
  root = rootHtml,
  rootHeaders = validHeaders,
  manifestBody = JSON.stringify(manifest),
  offline = offlineHtml,
  crisis = crisisHtml,
  iconStatus = 200,
  iconType = 'image/png',
} = {}) {
  return async (url) => {
    if (url.includes('/icons/')) return response('png', { status: iconStatus, headers: { 'content-type': iconType } });
    if (url.endsWith('/manifest.json')) return response(manifestBody, { headers: { 'content-type': 'application/json' } });
    if (url.endsWith('/sw.js')) return response(swText, { headers: { 'content-type': 'application/javascript' } });
    if (url.endsWith('/offline.html')) return response(offline, { headers: { 'content-type': 'text/html' } });
    if (url.endsWith('/crisis')) return response(crisis, { headers: { 'content-type': 'text/html' } });
    return response(root, { headers: rootHeaders });
  };
}

test('배포 URL은 HTTPS 또는 로컬호스트만 허용한다', () => {
  assert.deepEqual(validateDeployedUrl('https://example.com').failures, []);
  assert.deepEqual(validateDeployedUrl('http://localhost:4173').failures, []);
  assert.match(validateDeployedUrl('http://example.com').failures.join('\n'), /HTTPS가 아닙니다/);
  assert.match(validateDeployedUrl('https://user:pass@example.com').failures.join('\n'), /사용자 인증 정보/);
});

test('루트 응답은 CSP·프레임 차단·nosniff·캐시·앱 번들·hydration 해시를 검사한다', () => {
  assert.deepEqual(validateRootResponse(validHeaders, rootHtml), []);
  const missing = { ...validHeaders, 'x-frame-options': 'SAMEORIGIN', 'cache-control': 'public, max-age=3600' };
  const failures = validateRootResponse(missing, '<html></html>');
  assert.match(failures.join('\n'), /X-Frame-Options/);
  assert.match(failures.join('\n'), /앱 JS 번들/);
  assert.match(failures.join('\n'), /캐시/);

  const wrongHash = validateRootResponse(validHeaders, '<html><script>different</script><script src="/_expo/static/js/web/entry-test.js"></script></html>');
  assert.match(wrongHash.join('\n'), /hydration SHA-256/);
});

test('매니페스트·서비스 워커·오프라인 페이지 필수 항목을 검사한다', () => {
  assert.deepEqual(validateManifest(manifest), []);
  assert.deepEqual(validateServiceWorker(swText), []);
  assert.deepEqual(validateOfflinePage(offlineHtml), []);
  assert.match(validateManifest({ ...manifest, icons: [] }).join('\n'), /192x192/);
  assert.match(validateServiceWorker('self.addEventListener("install", () => {});').join('\n'), /offline.html/);
  assert.match(validateOfflinePage('<a href="tel:109">109</a>').join('\n'), /tel:119/);
});

test('배포 스모크 검사는 정상 응답에서 PASS, 번들 누락·아이콘 404에서 FAIL한다', async () => {
  const ok = await checkDeployedSite('https://example.com', { fetchImpl: fakeFetch() });
  assert.equal(ok.ok, true);
  assert.equal(ok.checks.length, 8);

  const failed = await checkDeployedSite('https://example.com', {
    fetchImpl: fakeFetch({ root: '<html></html>' }),
  });
  assert.equal(failed.ok, false);
  assert.match(failed.failures.join('\n'), /앱 JS 번들/);

  const iconFailed = await checkDeployedSite('https://example.com', {
    fetchImpl: fakeFetch({ iconStatus: 404 }),
  });
  assert.equal(iconFailed.ok, false);
  assert.match(iconFailed.failures.join('\n'), /HTTP 404/);
});
