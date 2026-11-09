import test from 'node:test';
import assert from 'node:assert/strict';
import { assessKoreanValidationEvidence, REQUIRED_VALIDATION_STAGES, KOREAN_VALIDATION_SCOPE } from '../lib/korean-validation-evidence.js';

const header = `| 기록 ID | 기록일 | 단계 | 범위 | 결과 | 외부 증빙 식별자 |
|---|---|---|---|---|---|`;
const fingerprints = {
  'PHQ-9 한국어 해시': 'phq9-hash',
  'PHQ-A 한국어 해시': 'phqa-hash',
  'GAD-7 한국어 해시': 'gad7-hash',
  '기능손상 한국어 해시': 'impairment-hash',
};

function record(stage, result = 'PASS') {
  return `| KVAL-20261106-${stage} | 2026-11-06 | ${stage} | ${KOREAN_VALIDATION_SCOPE} | ${result} | 연구 기록 |`;
}

function fingerprintLines() {
  return Object.entries(fingerprints)
    .map(([label, hash]) => `- ${label}: \`${hash}\``)
    .join('\n');
}

test('한국어 타당화 증빙은 모든 단계와 현재 문항 해시가 있을 때만 통과한다', () => {
  const markdown = [header, ...REQUIRED_VALIDATION_STAGES.map((stage) => record(stage)), fingerprintLines()].join('\n');
  assert.deepEqual(assessKoreanValidationEvidence(markdown, { fingerprints }).blockers, []);
});

test('한국어 타당화 증빙은 누락 단계·최근 실패·문항 해시 불일치를 차단한다', () => {
  const missing = assessKoreanValidationEvidence([header, record('GOVERNANCE')].join('\n'), { fingerprints });
  assert.match(missing.blockers.join('\n'), /TRANSLATION: 유효한 타당화 증빙 기록이 없습니다/);
  assert.match(missing.blockers.join('\n'), /PHQ-9 한국어 해시: 현재 문항 해시와 일치하는 증빙 범위가 없습니다/);

  const failed = assessKoreanValidationEvidence([header, record('GOVERNANCE', 'FAIL'), fingerprintLines()].join('\n'), { fingerprints });
  assert.match(failed.blockers.join('\n'), /GOVERNANCE: 가장 최근 타당화 결과가 PASS가 아닙니다/);
});
