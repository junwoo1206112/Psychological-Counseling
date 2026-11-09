import test from 'node:test';
import assert from 'node:assert/strict';
import { assessManualEvidence } from '../lib/manual-verification.js';

const header = `| 기록 ID | 기록일 | 검증자 역할 | 환경 | 시나리오 | 결과 | 이슈/조치 식별자 |
|---|---|---|---|---|---|---|`;
const scope = '- 수동 검증 범위 해시: `scope-hash`';

function record(scenario, result = 'PASS', date = '2026-11-06') {
  const compactDate = date.replaceAll('-', '');
  return `| A11Y-${compactDate}-${scenario} | ${date} | 접근성 QA | 테스트 환경 | ${scenario} | ${result} | 검증 기록 |`;
}

test('수동 증빙은 필수 시나리오가 모두 있는 최신 PASS일 때만 통과한다', () => {
  const scenarios = ['NVDA', 'VOICEOVER', 'TALKBACK', 'VIEWPORT-320', 'ZOOM-200', 'PHONE-APP', 'OFFLINE-CRISIS'];
  const result = assessManualEvidence([header, ...scenarios.map((scenario) => record(scenario)), scope].join('\n'), {
    referenceDate: '2026-11-06',
    scopeFingerprint: 'scope-hash',
  });
  assert.deepEqual(result.blockers, []);
});

test('수동 증빙은 누락·만료·최근 실패를 배포 차단 사유로 남긴다', () => {
  const missing = assessManualEvidence([header, record('NVDA'), scope].join('\n'), { referenceDate: '2026-11-06', scopeFingerprint: 'scope-hash' });
  assert.match(missing.blockers.join('\n'), /VOICEOVER: 유효한 수동 검증 기록이 없습니다/);

  const expired = assessManualEvidence([header, record('NVDA', 'PASS', '2026-01-01'), scope].join('\n'), { referenceDate: '2026-11-06', scopeFingerprint: 'scope-hash' });
  assert.match(expired.blockers.join('\n'), /NVDA: 기록일이 180일 유효기간을 벗어났습니다/);

  const failed = assessManualEvidence([header, record('NVDA', 'FAIL'), scope].join('\n'), { referenceDate: '2026-11-06', scopeFingerprint: 'scope-hash' });
  assert.match(failed.blockers.join('\n'), /NVDA: 가장 최근 검증 결과가 PASS가 아닙니다/);
});
