import test from 'node:test';
import assert from 'node:assert/strict';
import { assessLegalReviewEvidence, LEGAL_REVIEW_SCOPE, REQUIRED_LEGAL_REVIEW_STAGES } from '../lib/legal-review-evidence.js';

const header = `| 기록 ID | 기록일 | 검토 역할 | 단계 | 범위 | 결과 | 외부 증빙 식별자 |
|---|---|---|---|---|---|---|`;
const scopeFingerprint = 'scope-hash';

function record(stage, result = 'PASS', date = '2026-11-06') {
  return `| LEGAL-${date.replaceAll('-', '')}-${stage} | ${date} | 외부 법무 검토 | ${stage} | ${LEGAL_REVIEW_SCOPE} | ${result} | 검토 기록 |`;
}

function fingerprintLine() {
  return `- 배포 후보 범위 해시: \`${scopeFingerprint}\``;
}

test('법무 증빙은 필수 단계·현재 배포 범위·90일 이내 최신 PASS가 있을 때만 통과한다', () => {
  const markdown = [header, ...REQUIRED_LEGAL_REVIEW_STAGES.map((stage) => record(stage)), fingerprintLine()].join('\n');
  assert.deepEqual(assessLegalReviewEvidence(markdown, { scopeFingerprint, referenceDate: '2026-11-06' }).blockers, []);
});

test('법무 증빙은 누락·만료·최근 실패·범위 불일치를 차단한다', () => {
  const missing = assessLegalReviewEvidence([header, record('PRODUCT-CLASSIFICATION')].join('\n'), { scopeFingerprint, referenceDate: '2026-11-06' });
  assert.match(missing.blockers.join('\n'), /CLAIMS-REVIEW: 유효한 법무·규제 검토 기록이 없습니다/);
  assert.match(missing.blockers.join('\n'), /배포 후보 범위 해시/);

  const expired = assessLegalReviewEvidence([header, record('PRODUCT-CLASSIFICATION', 'PASS', '2026-01-01'), fingerprintLine()].join('\n'), { scopeFingerprint, referenceDate: '2026-11-06' });
  assert.match(expired.blockers.join('\n'), /PRODUCT-CLASSIFICATION: 기록일이 90일 유효기간을 벗어났습니다/);

  const failed = assessLegalReviewEvidence([header, record('PRODUCT-CLASSIFICATION', 'FAIL'), fingerprintLine()].join('\n'), { scopeFingerprint, referenceDate: '2026-11-06' });
  assert.match(failed.blockers.join('\n'), /PRODUCT-CLASSIFICATION: 가장 최근 검토 결과가 PASS가 아닙니다/);
});
