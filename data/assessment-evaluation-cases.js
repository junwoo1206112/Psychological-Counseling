// Synthetic, non-identifying regression cases. These are product-policy checks,
// not clinical validation data and must not be used to infer diagnostic accuracy.
const NO_SAFETY_SIGNAL = {
  currentIdeation: 'no',
  plan: 'no',
  meansOrUnsafe: 'no',
  pastAttempt: 'no',
};

const NO_ASQ_SIGNAL = { q1: 'no', q2: 'no', q3: 'no', q4: 'no' };

export const ASSESSMENT_EVALUATION_CASES = [
  {
    id: 'adult-low',
    purpose: '모든 선별 신호가 음성일 때 낮은 수준 결과를 보존한다.',
    input: {
      ageGroup: 'adult', safety: NO_SAFETY_SIGNAL, phq9: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      gad7: [0, 0, 0, 0, 0, 0, 0], asq: NO_ASQ_SIGNAL, impairment: 'none',
    },
    expected: { tier: 'low', route: '/result', instrument: 'PHQ-9' },
  },
  {
    id: 'youth-monitor',
    purpose: '청소년은 PHQ-A를 사용하고 가벼운 증상은 관찰 경로로 남긴다.',
    input: {
      ageGroup: 'youth', safety: NO_SAFETY_SIGNAL, phq9: [1, 1, 1, 1, 1, 0, 0, 0, 0],
      gad7: [0, 0, 0, 0, 0, 0, 0], asq: NO_ASQ_SIGNAL, impairment: 'none',
    },
    expected: { tier: 'monitor', route: '/result', instrument: 'PHQ-A' },
  },
  {
    id: 'adult-routine-score',
    purpose: '중간 수준 점수는 위기 화면이 아닌 전문가 상담 고려 경로로 보낸다.',
    input: {
      ageGroup: 'adult', safety: NO_SAFETY_SIGNAL, phq9: [2, 2, 2, 2, 1, 1, 0, 0, 0],
      gad7: [0, 0, 0, 0, 0, 0, 0], asq: NO_ASQ_SIGNAL, impairment: 'none',
    },
    expected: { tier: 'routine', route: '/result', instrument: 'PHQ-9' },
  },
  {
    id: 'phq-item9-signal',
    purpose: 'PHQ 문항 9의 비영 응답을 낮은 수준으로 종결하지 않는다.',
    input: {
      ageGroup: 'adult', safety: NO_SAFETY_SIGNAL, phq9: [0, 0, 0, 0, 0, 0, 0, 0, 1],
      gad7: [0, 0, 0, 0, 0, 0, 0], asq: NO_ASQ_SIGNAL, impairment: 'none',
    },
    expected: { tier: 'urgent', route: '/result', instrument: 'PHQ-9' },
  },
  {
    id: 'asq-positive-nonacute',
    purpose: 'ASQ 양성·비급성 신호는 빠른 전문가 도움 경로로 보낸다.',
    input: {
      ageGroup: 'adult', safety: NO_SAFETY_SIGNAL, phq9: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      gad7: [0, 0, 0, 0, 0, 0, 0], asq: { q1: 'yes', q2: 'no', q3: 'no', q4: 'no', q5: 'no' }, impairment: 'none',
    },
    expected: { tier: 'urgent', route: '/result', instrument: 'PHQ-9' },
  },
  {
    id: 'high-depression-score',
    purpose: '높은 우울 점수는 급성으로 단정하지 않되 빠른 전문가 도움 경로로 보낸다.',
    input: {
      ageGroup: 'adult', safety: NO_SAFETY_SIGNAL, phq9: [3, 3, 3, 3, 3, 3, 2, 0, 0],
      gad7: [0, 0, 0, 0, 0, 0, 0], asq: NO_ASQ_SIGNAL, impairment: 'none',
    },
    expected: { tier: 'urgent', route: '/result', instrument: 'PHQ-9' },
  },
  {
    id: 'current-safety-signal',
    purpose: '현재 안전 신호는 점수와 무관하게 위기 안내를 우선한다.',
    input: {
      ageGroup: 'adult', safety: { ...NO_SAFETY_SIGNAL, currentIdeation: 'yes' }, phq9: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      gad7: [0, 0, 0, 0, 0, 0, 0], asq: NO_ASQ_SIGNAL, impairment: 'none',
    },
    expected: { tier: 'acute', route: '/crisis', instrument: 'PHQ-9' },
  },
  {
    id: 'asq-current-signal',
    purpose: 'ASQ 현재 자살사고 양성은 결과를 건너뛰고 위기 안내를 우선한다.',
    input: {
      ageGroup: 'adult', safety: NO_SAFETY_SIGNAL, phq9: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      gad7: [0, 0, 0, 0, 0, 0, 0], asq: { q1: 'yes', q2: 'no', q3: 'no', q4: 'no', q5: 'yes' }, impairment: 'none',
    },
    expected: { tier: 'acute', route: '/crisis', instrument: 'PHQ-9' },
  },
  {
    id: 'malformed-positive-asq',
    purpose: 'ASQ 양성 뒤 현재 상태 확인이 없으면 결과를 만들지 않는다.',
    input: {
      ageGroup: 'adult', safety: NO_SAFETY_SIGNAL, phq9: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      gad7: [0, 0, 0, 0, 0, 0, 0], asq: { q1: 'yes', q2: 'no', q3: 'no', q4: 'no' }, impairment: 'none',
    },
    expectedError: 'RangeError',
  },
];
