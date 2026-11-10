import crypto from 'node:crypto';

const REQUEST_TIMEOUT_MS = 10_000;

const REQUIRED_CSP_DIRECTIVES = [
  "default-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self'",
  "style-src 'self'",
];

const REQUIRED_OFFLINE_LINKS = ['tel:109', 'tel:119', 'tel:112', 'tel:1577-0199', 'tel:1388'];

function headerValue(headers, name) {
  if (!headers) return '';
  if (typeof headers.get === 'function') return headers.get(name) || '';
  return headers[name] || headers[name.toLowerCase()] || '';
}

export function validateDeployedUrl(baseUrl) {
  const failures = [];
  let parsed;
  try {
    parsed = new URL(baseUrl);
  } catch {
    return { failures: ['유효한 URL이 아닙니다.'], url: null };
  }
  const local = ['localhost', '127.0.0.1', '::1'].includes(parsed.hostname);
  if (!local && parsed.protocol !== 'https:') {
    failures.push('HTTPS가 아닙니다. 배포 후보는 HTTPS여야 합니다.');
  }
  if (parsed.username || parsed.password) failures.push('URL에 사용자 인증 정보가 포함되어 있습니다.');
  return { failures, url: parsed };
}

export function validateRootResponse(headers, html) {
  const failures = [];
  const csp = headerValue(headers, 'content-security-policy');
  for (const directive of REQUIRED_CSP_DIRECTIVES) {
    if (!csp.includes(directive)) failures.push(`CSP 누락: ${directive}`);
  }
  if (headerValue(headers, 'x-frame-options') !== 'DENY') failures.push('X-Frame-Options가 DENY가 아닙니다.');
  if (headerValue(headers, 'x-content-type-options') !== 'nosniff') failures.push('X-Content-Type-Options가 nosniff가 아닙니다.');
  if (!headerValue(headers, 'referrer-policy')) failures.push('Referrer-Policy 헤더가 없습니다.');
  if (!headerValue(headers, 'permissions-policy')) failures.push('Permissions-Policy 헤더가 없습니다.');
  const cacheControl = headerValue(headers, 'cache-control');
  if (!/no-cache|no-store|max-age=0/i.test(cacheControl)) failures.push('HTML 캐시가 no-cache/no-store가 아닙니다.');
  if (!html.includes('/_expo/static/js/web/')) failures.push('앱 JS 번들이 HTML에 없습니다.');
  const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
  if (inlineScripts.length !== 1) {
    failures.push(`inline script가 1개가 아닙니다 (${inlineScripts.length}개).`);
  } else {
    const hash = crypto.createHash('sha256').update(inlineScripts[0]).digest('base64');
    if (!csp.includes(`'sha256-${hash}'`)) failures.push('CSP에 현재 inline hydration SHA-256이 없습니다.');
  }
  const scriptSrc = csp.match(/script-src([^;]*)/i)?.[1] || '';
  if (scriptSrc.includes("'unsafe-inline'")) failures.push("script-src에 'unsafe-inline'이 있습니다.");
  return failures;
}

export function validateManifest(manifest) {
  const failures = [];
  for (const field of ['name', 'short_name', 'start_url', 'display']) {
    if (!manifest || typeof manifest[field] !== 'string' || manifest[field].length === 0) {
      failures.push(`manifest ${field} 누락`);
    }
  }
  if (manifest?.display && manifest.display !== 'standalone') failures.push('manifest display가 standalone이 아닙니다.');
  if (manifest?.start_url && manifest.start_url !== '/') failures.push('manifest start_url이 /가 아닙니다.');
  const icons = Array.isArray(manifest?.icons) ? manifest.icons : [];
  for (const size of ['192x192', '512x512']) {
    if (!icons.some((icon) => icon.sizes === size)) failures.push(`manifest ${size} 아이콘 누락`);
  }
  if (!icons.some((icon) => String(icon.purpose || '').includes('maskable'))) failures.push('manifest maskable 아이콘 누락');
  return failures;
}

export function validateServiceWorker(text) {
  const failures = [];
  if (!text.includes('offline.html')) failures.push('서비스 워커가 offline.html을 참조하지 않습니다.');
  if (!/addEventListener\(\s*['"]fetch['"]/.test(text)) failures.push('서비스 워커 fetch 핸들러가 없습니다.');
  return failures;
}

export function validateOfflinePage(html) {
  const failures = [];
  for (const link of REQUIRED_OFFLINE_LINKS) {
    if (!html.includes(link)) failures.push(`오프라인 위기 링크 누락: ${link}`);
  }
  return failures;
}

async function fetchText(fetchImpl, url) {
  const response = await fetchImpl(url, { redirect: 'follow', signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  const text = await response.text();
  return { response, text };
}

function responseFailures(response, expectedType) {
  const failures = [];
  if (!response.ok) failures.push(`HTTP ${response.status}`);
  if (expectedType && !headerValue(response.headers, 'content-type').includes(expectedType)) {
    failures.push(`Content-Type이 ${expectedType}가 아닙니다.`);
  }
  return failures;
}

export async function checkDeployedSite(baseUrl, { fetchImpl = fetch } = {}) {
  const urlCheck = validateDeployedUrl(baseUrl);
  const failures = [...urlCheck.failures];
  const checks = [];
  if (!urlCheck.url) return { ok: false, failures, checks, baseUrl };

  const base = urlCheck.url.toString().replace(/\/$/, '');
  const record = (label, ok, detail) => {
    checks.push({ label, ok, failures: detail });
    if (!ok) failures.push(...detail);
  };

  try {
    const root = await fetchText(fetchImpl, `${base}/`);
    const rootFailures = [
      ...responseFailures(root.response, 'text/html'),
      ...validateRootResponse(root.response.headers, root.text),
    ];
    record('인트로 HTML·보안 헤더·앱 번들', rootFailures.length === 0, rootFailures);
  } catch (error) {
    record('인트로 HTML·보안 헤더·앱 번들', false, [`요청 실패: ${error.message}`]);
  }

  try {
    const { response, text } = await fetchText(fetchImpl, `${base}/manifest.json`);
    let manifest = null;
    try {
      manifest = JSON.parse(text);
    } catch {
      record('PWA manifest', false, ['manifest.json이 유효한 JSON이 아닙니다.']);
    }
    if (manifest) {
      const manifestFailures = [...responseFailures(response, 'application/json'), ...validateManifest(manifest)];
      record('PWA manifest', manifestFailures.length === 0, manifestFailures);
      const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
      for (const icon of icons) {
        const iconUrl = new URL(icon.src, `${base}/`).toString();
        try {
          const iconResponse = await fetchText(fetchImpl, iconUrl);
          const iconFailures = responseFailures(iconResponse.response, 'image/png');
          record(`PWA 아이콘 ${icon.sizes || 'unknown'}`, iconFailures.length === 0, iconFailures);
        } catch (error) {
          record(`PWA 아이콘 ${icon.sizes || 'unknown'}`, false, [`요청 실패: ${error.message}`]);
        }
      }
    }
  } catch (error) {
    record('PWA manifest', false, [`요청 실패: ${error.message}`]);
  }

  try {
    const { response, text } = await fetchText(fetchImpl, `${base}/sw.js`);
    const swFailures = [...responseFailures(response, 'javascript'), ...validateServiceWorker(text)];
    record('서비스 워커 경계', swFailures.length === 0, swFailures);
  } catch (error) {
    record('서비스 워커 경계', false, [`요청 실패: ${error.message}`]);
  }

  try {
    const { response, text } = await fetchText(fetchImpl, `${base}/offline.html`);
    const offlineFailures = [...responseFailures(response, 'text/html'), ...validateOfflinePage(text)];
    record('오프라인 위기 안내', offlineFailures.length === 0, offlineFailures);
  } catch (error) {
    record('오프라인 위기 안내', false, [`요청 실패: ${error.message}`]);
  }

  try {
    const { response, text } = await fetchText(fetchImpl, `${base}/crisis`);
    const crisisFailures = [...responseFailures(response, 'text/html')];
    if (!text.includes('109')) crisisFailures.push('/crisis에 109 안내가 없습니다.');
    record('위기 정적 라우트', crisisFailures.length === 0, crisisFailures);
  } catch (error) {
    record('위기 정적 라우트', false, [`요청 실패: ${error.message}`]);
  }

  return { ok: failures.length === 0, failures, checks, baseUrl: base };
}
