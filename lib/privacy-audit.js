export const APPLICATION_SOURCE_DIRECTORIES = Object.freeze(['app', 'components', 'lib', 'data']);
export const PRIVACY_AUDIT_EXCLUDED_FILES = Object.freeze(['lib/privacy-audit.js']);

const FORBIDDEN_APPLICATION_PATTERNS = Object.freeze([
  { name: '자동 fetch 요청', pattern: /\bfetch\s*\(/ },
  { name: 'XMLHttpRequest', pattern: /\bXMLHttpRequest\b/ },
  { name: 'WebSocket', pattern: /\bWebSocket\b/ },
  { name: 'EventSource', pattern: /\bEventSource\b/ },
  { name: 'sendBeacon', pattern: /\bsendBeacon\s*\(/ },
  { name: '분석·크래시 SDK', pattern: /(?:@sentry|sentry-|firebase\/analytics|amplitude|mixpanel|posthog|segment|google-analytics)/i },
  { name: '콘솔 로그', pattern: /\bconsole\.(?:log|info|debug|warn|error)\s*\(/ },
]);

export function auditApplicationSources(files) {
  const violations = [];
  for (const file of files) {
    for (const rule of FORBIDDEN_APPLICATION_PATTERNS) {
      if (rule.pattern.test(file.content)) violations.push(`${file.path}: ${rule.name}`);
    }
  }
  return violations;
}

export function auditServiceWorker(source) {
  const violations = [];
  if (!/url\.origin\s*!==\s*self\.location\.origin/.test(source)) violations.push('서비스 워커: 동일 출처 요청 제한이 없습니다.');
  if (/PeriodicSyncManager|periodicSync|BackgroundFetch|sync\.register/.test(source)) violations.push('서비스 워커: 백그라운드 동기화/가져오기가 허용되지 않습니다.');
  if (/sendBeacon|WebSocket|XMLHttpRequest|EventSource/.test(source)) violations.push('서비스 워커: 전송 API가 허용되지 않습니다.');
  if (/https?:\/\//.test(source)) violations.push('서비스 워커: 외부 URL 캐시가 허용되지 않습니다.');
  return violations;
}
