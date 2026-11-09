import test from 'node:test';
import assert from 'node:assert/strict';
import { assessClinicalHandoffEvidence, CLINICAL_HANDOFF_SCOPE, REQUIRED_CLINICAL_HANDOFF_STAGES } from '../lib/clinical-handoff-evidence.js';

const header = `| 기록 ID | 기록일 | 검토 역할 | 단계 | 범위 | 결과 | 외부 증빙 식별자 |
|---|---|---|---|---|---|---|`;
const scopeFingerprint = 'handoff-scope-hash';

function record(stage, result = 'PASS', date = '2026-11-06') {
  return `| HANDOFF-${date.replaceAll('-', '')}-${stage} | ${date} | 임상 운영 책임 역할 | ${stage} | ${CLINICAL_HANDOFF_SCOPE} | ${result} | 운영 기록 |`;
}

function fingerprintLine() {
  return `- 운영 범위 해시: \`${scopeFingerprint}\``;
}

test('임상 후속연결 증빙은 필수 단계·현재 운영 범위·90일 이내 최신 PASS가 있을 때만 통과한다', () => {
  const markdown = [header, ...REQUIRED_CLINICAL_HANDOFF_STAGES.map((stage) => record(stage)), fingerprintLine()].join('\n');
  assert.deepEqual(assessClinicalHandoffEvidence(markdown, { scopeFingerprint, referenceDate: '2026-11-06' }).blockers, []);
});

test('임상 후속연결 증빙은 누락·만료·최근 실패·범위 불일치를 차단한다', () => {
  const missing = assessClinicalHandoffEvidence([header, record('OWNERSHIP')].join('\n'), { scopeFingerprint, referenceDate: '2026-11-06' });
  assert.match(missing.blockers.join('\n'), /BSSA-TRAINING: 유효한 임상 후속연결 운영 기록이 없습니다/);
  assert.match(missing.blockers.join('\n'), /운영 범위 해시/);
  const expired = assessClinicalHandoffEvidence([header, record('OWNERSHIP', 'PASS', '2026-01-01'), fingerprintLine()].join('\n'), { scopeFingerprint, referenceDate: '2026-11-06' });
  assert.match(expired.blockers.join('\n'), /OWNERSHIP: 기록일이 90일 유효기간을 벗어났습니다/);
  const failed = assessClinicalHandoffEvidence([header, record('OWNERSHIP', 'FAIL'), fingerprintLine()].join('\n'), { scopeFingerprint, referenceDate: '2026-11-06' });
  assert.match(failed.blockers.join('\n'), /OWNERSHIP: 가장 최근 운영 검토 결과가 PASS가 아닙니다/);
});
