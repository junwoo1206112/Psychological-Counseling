#!/usr/bin/env node
import { ASSESSMENT_EVALUATION_CASES } from '../data/assessment-evaluation-cases.js';
import { evaluateAssessmentCases, summarizeAssessmentEvaluation } from '../lib/assessment-evaluation.js';

const results = evaluateAssessmentCases(ASSESSMENT_EVALUATION_CASES);
for (const result of results) {
  console.log(`${result.passed ? 'PASS' : 'FAIL'}  ${result.id} — ${result.purpose}`);
}

const summary = summarizeAssessmentEvaluation(results);
console.log(`\n평가 시나리오: ${summary.passed}/${summary.total} 통과`);
console.log('이 평가는 제품 정책 회귀 검사이며 임상적 정확도·진단 성능을 검증하지 않습니다.');
if (summary.failed > 0) process.exit(1);
