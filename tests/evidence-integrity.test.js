import test from 'node:test';
import assert from 'node:assert/strict';
import { assessManualEvidence, REQUIRED_MANUAL_SCENARIOS } from '../lib/manual-verification.js';
import { assessKoreanValidationEvidence, REQUIRED_VALIDATION_STAGES, KOREAN_VALIDATION_SCOPE } from '../lib/korean-validation-evidence.js';
import { assessLegalReviewEvidence, REQUIRED_LEGAL_REVIEW_STAGES, LEGAL_REVIEW_SCOPE } from '../lib/legal-review-evidence.js';
import { assessClinicalHandoffEvidence, REQUIRED_CLINICAL_HANDOFF_STAGES, CLINICAL_HANDOFF_SCOPE } from '../lib/clinical-handoff-evidence.js';
import { assessAbcExpertReviewEvidence, REQUIRED_ABC_REVIEW_STAGES, ABC_REVIEW_SCOPE } from '../lib/abc-expert-review-evidence.js';

const manualHeader = '| 기록 ID | 기록일 | 검증자 역할 | 환경 | 시나리오 | 결과 | 이슈/조치 식별자 |';
const manual = (scenario, result = 'PASS', date = '2026-11-06') => `| A11Y-${date.replaceAll('-', '')}-${scenario} | ${date} | 접근성 QA | 기기 | ${scenario} | ${result} | 기록 |`;
const fingerprints = { one: 'one' };

test('수동 증빙은 같은 날 실패와 미래·비실재 날짜를 PASS로 처리하지 않는다', () => {
  const baseline = REQUIRED_MANUAL_SCENARIOS.map((scenario) => manual(scenario));
  const sameDayFailure = assessManualEvidence([manualHeader, ...baseline, manual('NVDA', 'FAIL')].join('\n'), { referenceDate: '2026-11-06' });
  assert.match(sameDayFailure.blockers.join('\n'), /NVDA: 가장 최근 검증 결과가 PASS가 아닙니다/);
  const invalidDate = assessManualEvidence([manualHeader, manual('NVDA', 'PASS', '2026-02-31')].join('\n'), { referenceDate: '2026-03-05' });
  assert.match(invalidDate.blockers.join('\n'), /형식이 잘못된 기록/);
});

test('연구·법무·임상 증빙은 동일일 실패와 미래 날짜를 차단한다', () => {
  const kvalHeader = '| 기록 ID | 기록일 | 단계 | 범위 | 결과 | 외부 증빙 식별자 |';
  const kval = (stage, result = 'PASS', date = '2026-11-06') => `| KVAL-${date.replaceAll('-', '')}-${stage} | ${date} | ${stage} | ${KOREAN_VALIDATION_SCOPE} | ${result} | 기록 |`;
  const kvalResult = assessKoreanValidationEvidence([kvalHeader, ...REQUIRED_VALIDATION_STAGES.map((stage) => kval(stage)), kval('ANALYSIS', 'FAIL'), '- one: `one`'].join('\n'), { fingerprints, referenceDate: '2026-11-06' });
  assert.match(kvalResult.blockers.join('\n'), /ANALYSIS: 가장 최근 타당화 결과가 PASS가 아닙니다/);
  const legalHeader = '| 기록 ID | 기록일 | 검토 역할 | 단계 | 범위 | 결과 | 외부 증빙 식별자 |';
  const legal = (stage, result = 'PASS', date = '2026-11-06') => `| LEGAL-${date.replaceAll('-', '')}-${stage} | ${date} | 법무 | ${stage} | ${LEGAL_REVIEW_SCOPE} | ${result} | 기록 |`;
  const legalResult = assessLegalReviewEvidence([legalHeader, ...REQUIRED_LEGAL_REVIEW_STAGES.map((stage) => legal(stage)), legal('PRODUCT-CLASSIFICATION', 'FAIL'), '- 배포 후보 범위 해시: `scope`'].join('\n'), { scopeFingerprint: 'scope', referenceDate: '2026-11-06' });
  assert.match(legalResult.blockers.join('\n'), /PRODUCT-CLASSIFICATION: 가장 최근 검토 결과가 PASS가 아닙니다/);
  const clinicalHeader = legalHeader;
  const clinical = (stage, result = 'PASS', date = '2026-11-06') => `| HANDOFF-${date.replaceAll('-', '')}-${stage} | ${date} | 임상 | ${stage} | ${CLINICAL_HANDOFF_SCOPE} | ${result} | 기록 |`;
  const clinicalResult = assessClinicalHandoffEvidence([clinicalHeader, ...REQUIRED_CLINICAL_HANDOFF_STAGES.map((stage) => clinical(stage)), clinical('ACUITY-PATHWAY', 'FAIL'), '- 운영 범위 해시: `scope`'].join('\n'), { scopeFingerprint: 'scope', referenceDate: '2026-11-06' });
  assert.match(clinicalResult.blockers.join('\n'), /ACUITY-PATHWAY: 가장 최근 운영 검토 결과가 PASS가 아닙니다/);
  const future = assessKoreanValidationEvidence([kvalHeader, ...REQUIRED_VALIDATION_STAGES.map((stage) => kval(stage, 'PASS', '2099-01-01')), '- one: `one`'].join('\n'), { fingerprints, referenceDate: '2026-11-06' });
  assert.match(future.blockers.join('\n'), /형식이 잘못된 기록/);
});

test('A/B/C 독립 검토는 역할별 최신 PASS와 현 범위를 요구한다', () => {
  const header = '| 기록 ID | 기록일 | 검토 역할 | 단계 | 범위 | 결과 | 외부 증빙 식별자 |';
  const record = (stage, result = 'PASS') => `| ABC-20261106-${stage} | 2026-11-06 | 독립 검토 역할 | ${stage} | ${ABC_REVIEW_SCOPE} | ${result} | 증빙 |`;
  const passing = [header, ...REQUIRED_ABC_REVIEW_STAGES.map((stage) => record(stage)), '- 배포 후보 범위 해시: `scope`'].join('\n');
  assert.deepEqual(assessAbcExpertReviewEvidence(passing, { scopeFingerprint: 'scope', referenceDate: '2026-11-06' }).blockers, []);
  const failed = `${passing}\n${record('B-CRISIS-PREVENTION', 'FAIL')}`;
  assert.match(assessAbcExpertReviewEvidence(failed, { scopeFingerprint: 'scope', referenceDate: '2026-11-06' }).blockers.join('\n'), /B-CRISIS-PREVENTION: 가장 최근 독립 검토 결과가 PASS가 아닙니다/);
});
