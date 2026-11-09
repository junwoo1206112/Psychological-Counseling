import test from 'node:test';
import assert from 'node:assert/strict';
import { auditApplicationSources, auditServiceWorker } from '../lib/privacy-audit.js';

test('앱 소스 감사는 자동 전송·분석·콘솔 로그를 차단한다', () => {
  assert.deepEqual(auditApplicationSources([{ path: 'app/safe.js', content: "Linking.openURL('tel:109')" }]), []);
  const violations = auditApplicationSources([{ path: 'app/unsafe.js', content: "fetch('/answers'); console.log('response')" }]);
  assert.match(violations.join('\n'), /자동 fetch 요청/);
  assert.match(violations.join('\n'), /콘솔 로그/);
});

test('서비스 워커 감사는 동일 출처 캐시만 허용한다', () => {
  const safe = "if (url.origin !== self.location.origin) return; event.respondWith(fetch(request));";
  assert.deepEqual(auditServiceWorker(safe), []);
  const violations = auditServiceWorker("event.waitUntil(registration.periodicSync.register('sync')); fetch('https://tracker.example')");
  assert.match(violations.join('\n'), /동일 출처 요청 제한/);
  assert.match(violations.join('\n'), /백그라운드 동기화/);
  assert.match(violations.join('\n'), /외부 URL 캐시/);
});
