import test from 'node:test';
import assert from 'node:assert/strict';
import {
  scorePHQ9,
  scorePHQA,
  scoreGAD7,
  scoreASQ,
  evaluateRisk,
  buildAssessmentResult,
} from '../data/instruments.js';

test('PHQ-9 경계값 밴드', () => {
  const cases = [
    [0, 'minimal'],
    [4, 'minimal'],
    [5, 'mild'],
    [9, 'mild'],
    [10, 'moderate'],
    [14, 'moderate'],
    [15, 'moderately_severe'],
    [19, 'moderately_severe'],
    [20, 'severe'],
    [27, 'severe'],
  ];

  for (const [total, band] of cases) {
    const answers = [];
    let remaining = total;
    for (let i = 0; i < 9; i += 1) {
      const value = Math.min(3, remaining);
      answers.push(value);
      remaining -= value;
    }
    assert.equal(scorePHQ9(answers).total, total);
    assert.equal(scorePHQ9(answers).band.id, band, `total=${total}`);
  }
});

test('PHQ-9 문항 9는 별도 보존', () => {
  const result = scorePHQ9([0, 0, 0, 0, 0, 0, 0, 0, 3]);
  assert.equal(result.item9, 3);
  assert.equal(result.total, 3);
});

test('PHQ-A 경계값 밴드와 도구 식별', () => {
  const cases = [
    [0, 'minimal'],
    [5, 'mild'],
    [10, 'moderate'],
    [15, 'moderately_severe'],
    [20, 'severe'],
    [27, 'severe'],
  ];

  for (const [total, band] of cases) {
    const answers = [];
    let remaining = total;
    for (let i = 0; i < 9; i += 1) {
      const value = Math.min(3, remaining);
      answers.push(value);
      remaining -= value;
    }
    const result = scorePHQA(answers);
    assert.equal(result.total, total);
    assert.equal(result.band.id, band, `total=${total}`);
    assert.equal(result.instrument, 'PHQ-A');
  }
});

test('청소년 결과는 PHQ-A를 사용', () => {
  const result = buildAssessmentResult({
    ageGroup: 'youth',
    safety: { currentIdeation: 'no', plan: 'no', meansOrUnsafe: 'no', pastAttempt: 'no' },
    phq9: [1, 1, 1, 1, 1, 0, 0, 0, 0],
    gad7: [0, 0, 0, 0, 0, 0, 0],
    asq: { q1: 'no', q2: 'no', q3: 'no', q4: 'no' },
    impairment: 'none',
  });
  assert.equal(result.isYouth, true);
  assert.equal(result.depression.instrument, 'PHQ-A');
  assert.equal(result.phq9.instrument, 'PHQ-A');
});

test('성인 결과는 PHQ-9을 사용', () => {
  const result = buildAssessmentResult({
    ageGroup: 'adult',
    safety: { currentIdeation: 'no', plan: 'no', meansOrUnsafe: 'no', pastAttempt: 'no' },
    phq9: [1, 1, 1, 1, 1, 0, 0, 0, 0],
    gad7: [0, 0, 0, 0, 0, 0, 0],
    asq: { q1: 'no', q2: 'no', q3: 'no', q4: 'no' },
    impairment: 'none',
  });
  assert.equal(result.isYouth, false);
  assert.equal(result.depression.instrument, 'PHQ-9');
});

test('GAD-7 경계값 밴드', () => {
  const cases = [
    [0, 'minimal'],
    [4, 'minimal'],
    [5, 'mild'],
    [9, 'mild'],
    [10, 'moderate'],
    [14, 'moderate'],
    [15, 'severe'],
    [21, 'severe'],
  ];

  for (const [total, band] of cases) {
    const answers = [];
    let remaining = total;
    for (let i = 0; i < 7; i += 1) {
      const value = Math.min(3, remaining);
      answers.push(value);
      remaining -= value;
    }
    assert.equal(scoreGAD7(answers).total, total);
    assert.equal(scoreGAD7(answers).band.id, band, `total=${total}`);
  }
});

test('ASQ 음성/양성/급성', () => {
  assert.equal(scoreASQ({ q1: 'no', q2: 'no', q3: 'no', q4: 'no' }).positive, false);
  assert.equal(scoreASQ({ q1: 'unknown', q2: 'no', q3: 'no', q4: 'no' }).positive, true);
  assert.equal(scoreASQ({ q1: 'no', q2: 'no', q3: 'no', q4: 'no', q5: 'yes' }).acute, true);
  assert.equal(scoreASQ({ q1: 'no', q2: 'no', q3: 'no', q4: 'no', q5: 'no' }).acute, false);
});

test('위험 티어: 급성 안전 신호가 최우선', () => {
  const phq9 = scorePHQ9([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const gad7 = scoreGAD7([0, 0, 0, 0, 0, 0, 0]);
  const asq = scoreASQ({ q1: 'no', q2: 'no', q3: 'no', q4: 'no' });

  assert.equal(
    evaluateRisk({ safety: { currentIdeation: 'yes' }, phq9, gad7, asq }).tier,
    'acute',
  );
  assert.equal(
    evaluateRisk({ safety: {}, phq9, gad7, asq: scoreASQ({ q1: 'yes', q2: 'no', q3: 'no', q4: 'no', q5: 'yes' }) }).tier,
    'acute',
  );
  assert.equal(
    evaluateRisk({ safety: {}, phq9, gad7, asq: scoreASQ({ q1: 'yes', q2: 'no', q3: 'no', q4: 'no', q5: 'no' }) }).tier,
    'urgent',
  );
});

test('현재 안전 확인의 계획 문항은 현재·당일 위험을 묻는다', async () => {
  const { SAFETY_QUESTIONS } = await import('../data/instruments.js');
  const plan = SAFETY_QUESTIONS.find((question) => question.id === 'plan');
  assert.match(plan.text, /지금 또는 오늘 안에/);
  assert.doesNotMatch(plan.text, /세운 적/);
});

test('위험 티어: 과거 시도는 urgent', () => {
  const result = evaluateRisk({
    safety: { pastAttempt: 'yes' },
    phq9: scorePHQ9([]),
    gad7: scoreGAD7([]),
    asq: scoreASQ({ q1: 'no', q2: 'no', q3: 'no', q4: 'no' }),
  });
  assert.equal(result.tier, 'urgent');
});

test('기능손상 "많이/극히 어려움"은 urgent', () => {
  const asq = scoreASQ({ q1: 'no', q2: 'no', q3: 'no', q4: 'no' });
  for (const impairment of ['very', 'extreme']) {
    const result = evaluateRisk({
      safety: {},
      impairment,
      phq9: scorePHQ9([]),
      gad7: scoreGAD7([]),
      asq,
    });
    assert.equal(result.tier, 'urgent', impairment);
    assert.ok(result.reasons.some((reason) => reason.includes('일상 기능')));
  }
});

test('기능손상 "다소 어려움"은 단독으로 urgent가 아님', () => {
  const result = evaluateRisk({
    safety: { currentIdeation: 'no', plan: 'no', meansOrUnsafe: 'no', pastAttempt: 'no' },
    impairment: 'some',
    phq9: scorePHQ9([]),
    gad7: scoreGAD7([]),
    asq: scoreASQ({ q1: 'no', q2: 'no', q3: 'no', q4: 'no' }),
  });
  assert.equal(result.tier, 'low');
});

test('위험 티어: 점수 기반 routine/monitor/low', () => {
  const asq = scoreASQ({ q1: 'no', q2: 'no', q3: 'no', q4: 'no' });

  assert.equal(
    evaluateRisk({ safety: {}, phq9: scorePHQ9([2, 2, 2, 2, 1, 1, 0, 0, 0]), gad7: scoreGAD7([]), asq }).tier,
    'routine',
  );
  assert.equal(
    evaluateRisk({ safety: {}, phq9: scorePHQ9([1, 1, 1, 1, 1, 0, 0, 0, 0]), gad7: scoreGAD7([]), asq }).tier,
    'monitor',
  );
  assert.equal(
    evaluateRisk({ safety: {}, phq9: scorePHQ9([]), gad7: scoreGAD7([]), asq }).tier,
    'low',
  );
});

test('buildAssessmentResult 구조', () => {
  const result = buildAssessmentResult({
    ageGroup: 'adult',
    safety: { currentIdeation: 'no', plan: 'no', meansOrUnsafe: 'no', pastAttempt: 'no' },
    phq9: [1, 1, 1, 1, 1, 1, 1, 1, 0],
    gad7: [1, 1, 1, 1, 1, 0, 0],
    asq: { q1: 'no', q2: 'no', q3: 'no', q4: 'no' },
    impairment: 'none',
  });

  assert.equal(result.phq9.total, 8);
  assert.equal(result.gad7.total, 5);
  assert.equal(result.asq.positive, false);
  assert.equal(result.risk.tier, 'monitor');
});

test('문항 9 비영 응답은 low로 종결하지 않는다', () => {
  const result = buildAssessmentResult({
    ageGroup: 'adult',
    safety: { currentIdeation: 'no', plan: 'no', meansOrUnsafe: 'no', pastAttempt: 'no' },
    phq9: [0, 0, 0, 0, 0, 0, 0, 0, 1],
    gad7: [0, 0, 0, 0, 0, 0, 0],
    impairment: 'none',
    asq: { q1: 'no', q2: 'no', q3: 'no', q4: 'no' },
  });
  assert.equal(result.depression.deathThoughtSignal, true);
  assert.equal(result.risk.tier, 'urgent');
});

test('불완전한 응답은 결과를 만들지 않는다', () => {
  assert.throws(() => buildAssessmentResult({}), RangeError);
});

test('희소 응답 배열과 허용되지 않은 연령대는 결과를 만들지 않는다', () => {
  const complete = {
    ageGroup: 'adult',
    safety: { currentIdeation: 'no', plan: 'no', meansOrUnsafe: 'no', pastAttempt: 'no' },
    phq9: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    gad7: [0, 0, 0, 0, 0, 0, 0],
    asq: { q1: 'no', q2: 'no', q3: 'no', q4: 'no' },
    impairment: 'none',
  };
  assert.throws(() => buildAssessmentResult({ ...complete, phq9: Array(9) }), RangeError);
  assert.throws(() => buildAssessmentResult({ ...complete, gad7: Array(7) }), RangeError);
  assert.throws(() => buildAssessmentResult({ ...complete, ageGroup: 'child' }), RangeError);
  assert.throws(() => buildAssessmentResult({ ...complete, ageGroup: undefined }), RangeError);
});
