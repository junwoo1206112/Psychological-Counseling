import test from 'node:test';
import assert from 'node:assert/strict';
import { ASSESSMENT_EVALUATION_CASES } from '../data/assessment-evaluation-cases.js';
import { evaluateAssessmentCases, summarizeAssessmentEvaluation } from '../lib/assessment-evaluation.js';

test('비식별 선별 평가 시나리오는 정책 경로를 모두 통과한다', () => {
  const results = evaluateAssessmentCases(ASSESSMENT_EVALUATION_CASES);
  assert.deepEqual(results.filter((result) => !result.passed), []);
  assert.deepEqual(summarizeAssessmentEvaluation(results), {
    total: ASSESSMENT_EVALUATION_CASES.length,
    passed: ASSESSMENT_EVALUATION_CASES.length,
    failed: 0,
  });
});

test('급성 시나리오는 결과 대신 위기 경로로 평가된다', () => {
  const results = evaluateAssessmentCases(ASSESSMENT_EVALUATION_CASES);
  for (const id of ['current-safety-signal', 'asq-current-signal']) {
    const result = results.find((item) => item.id === id);
    assert.equal(result.actual.route, '/crisis');
    assert.equal(result.actual.tier, 'acute');
  }
});
