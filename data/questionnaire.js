// AI psychological counseling self-check questionnaire.
// This tool is for portfolio/demo screening only and is not a medical diagnosis.

export const DOMAINS = [
  { id: 'mood', label: '우울 기분', icon: '☁️', desc: '지속적인 슬픔과 일중 기분 변화' },
  { id: 'anhedonia', label: '흥미 저하', icon: '🌙', desc: '즐거움과 사회적 관심의 감소' },
  { id: 'cognition', label: '자기 평가', icon: '🧠', desc: '죄책감, 무가치감, 부정적 사고' },
  { id: 'hopelessness', label: '절망감', icon: '🕯️', desc: '미래에 대한 비관과 무력감' },
  { id: 'neurocognitive', label: '인지 기능', icon: '🔎', desc: '집중, 기억, 결정의 어려움' },
  { id: 'sleep', label: '수면', icon: '🛌', desc: '불면, 과수면, 조기 각성' },
  { id: 'somatic', label: '신체 증상', icon: '🌿', desc: '식욕, 에너지, 정신운동 변화' },
  { id: 'anxiety', label: '불안', icon: '⚡', desc: '긴장, 공황, 회피 행동' },
  { id: 'pain', label: '신체 불편감', icon: '🩺', desc: '통증, 소화, 호흡 관련 불편감' },
  { id: 'risk', label: '위험/기능', icon: '🚨', desc: '자해 사고와 일상 기능 손상' },
];

export const QUESTIONS = [
  { id: 1, domain: 'mood', text: '슬프거나 우울한 기분이 거의 매일 지속되었다.', weight: 1.5, dsm: 'depressed_mood' },
  { id: 2, domain: 'mood', text: '아침에 일어나면 기분이 무겁고 하루를 시작하기 어려웠다.', weight: 1, dsm: 'depressed_mood' },
  { id: 3, domain: 'mood', text: '시간대에 따라 기분이 크게 가라앉거나 흔들렸다.', weight: 0.8, dsm: 'depressed_mood' },
  { id: 4, domain: 'mood', text: '눈물이 나거나 울고 싶은 느낌이 자주 있었다.', weight: 0.8, dsm: 'depressed_mood' },
  { id: 5, domain: 'mood', text: '감정이 무뎌지거나 아무것도 느끼기 어려웠다.', weight: 0.6, dsm: 'depressed_mood' },
  { id: 6, domain: 'anhedonia', text: '평소 즐기던 활동에서 즐거움을 거의 느끼지 못했다.', weight: 1.5, dsm: 'anhedonia' },
  { id: 7, domain: 'anhedonia', text: '좋은 일이 있어도 기쁘게 반응하기 어려웠다.', weight: 1.2, dsm: 'anhedonia' },
  { id: 8, domain: 'anhedonia', text: '사람을 만나는 일이 귀찮거나 피하고 싶었다.', weight: 1, dsm: 'anhedonia' },
  { id: 9, domain: 'anhedonia', text: '친밀감이나 애정 표현에 대한 관심이 줄었다.', weight: 0.8, dsm: 'anhedonia' },
  { id: 10, domain: 'anhedonia', text: '새로운 활동이나 취미를 시작하는 것이 버겁게 느껴졌다.', weight: 0.6, dsm: 'anhedonia' },
  { id: 11, domain: 'cognition', text: '나는 가치 없거나 실패한 사람이라고 느꼈다.', weight: 1.2, dsm: 'worthlessness' },
  { id: 12, domain: 'cognition', text: '지나치게 죄책감을 느끼거나 모든 일이 내 탓처럼 느껴졌다.', weight: 1, dsm: 'worthlessness' },
  { id: 13, domain: 'cognition', text: '스스로에게 엄격하고 나를 용서하기 어려웠다.', weight: 0.8, dsm: 'worthlessness' },
  { id: 14, domain: 'cognition', text: '다른 사람이 나를 어떻게 볼지 지나치게 걱정했다.', weight: 0.6 },
  { id: 15, domain: 'cognition', text: '작은 실수에도 나를 심하게 비난했다.', weight: 0.6, dsm: 'worthlessness' },
  { id: 16, domain: 'hopelessness', text: '미래가 비관적이고 나아질 희망이 없다고 느꼈다.', weight: 1.2 },
  { id: 17, domain: 'hopelessness', text: '현재 상황이 결코 좋아지지 않을 것 같았다.', weight: 1 },
  { id: 18, domain: 'hopelessness', text: '인생이 의미 없거나 너무 버겁다고 느꼈다.', weight: 0.8 },
  { id: 19, domain: 'hopelessness', text: '앞으로 어떻게 살아야 할지 모르겠다는 생각이 들었다.', weight: 1 },
  { id: 20, domain: 'hopelessness', text: '긍정적인 일이 있어도 금방 사라질 것처럼 느꼈다.', weight: 0.6 },
  { id: 21, domain: 'neurocognitive', text: '집중하기 어렵고 쉽게 산만해졌다.', weight: 1, dsm: 'concentration' },
  { id: 22, domain: 'neurocognitive', text: '사소한 결정도 내리기 어려웠다.', weight: 0.8, dsm: 'concentration' },
  { id: 23, domain: 'neurocognitive', text: '기억력이 떨어져 약속이나 물건을 자주 잊었다.', weight: 0.8 },
  { id: 24, domain: 'neurocognitive', text: '머리가 흐릿하고 생각이 잘 정리되지 않았다.', weight: 0.6 },
  { id: 25, domain: 'neurocognitive', text: '대화 중 상대방의 말을 따라가기 어려웠다.', weight: 0.6 },
  { id: 26, domain: 'sleep', text: '잠들기 어렵거나 밤중에 자주 깼다.', weight: 1, dsm: 'sleep' },
  { id: 27, domain: 'sleep', text: '이른 새벽에 깨고 다시 잠들기 어려웠다.', weight: 0.8, dsm: 'sleep' },
  { id: 28, domain: 'sleep', text: '너무 많이 자도 계속 피곤했다.', weight: 0.6, dsm: 'sleep' },
  { id: 29, domain: 'sleep', text: '잠들기 전 불안하거나 생각이 멈추지 않았다.', weight: 0.6 },
  { id: 30, domain: 'sleep', text: '악몽이나 불편한 꿈 때문에 수면의 질이 낮았다.', weight: 0.6 },
  { id: 31, domain: 'somatic', text: '식욕이 줄었고 먹는 일이 힘들었다.', weight: 1, dsm: 'appetite' },
  { id: 32, domain: 'somatic', text: '스트레스로 과식하거나 식사 조절이 어려웠다.', weight: 0.6, dsm: 'appetite' },
  { id: 33, domain: 'somatic', text: '기운이 없고 아주 작은 일도 무겁게 느껴졌다.', weight: 1, dsm: 'fatigue' },
  { id: 34, domain: 'somatic', text: '몸이나 말의 속도가 느려진 것 같았다.', weight: 0.8, dsm: 'psychomotor' },
  { id: 35, domain: 'somatic', text: '반대로 초조해서 가만히 있기 어려웠다.', weight: 0.6, dsm: 'psychomotor' },
  { id: 36, domain: 'anxiety', text: '이유 없이 불안하고 초조한 상태가 지속되었다.', weight: 1 },
  { id: 37, domain: 'anxiety', text: '갑자기 극심한 두려움이나 공황감이 찾아왔다.', weight: 0.8 },
  { id: 38, domain: 'anxiety', text: '마음이 가라앉지 않고 항상 긴장되어 있었다.', weight: 0.8 },
  { id: 39, domain: 'anxiety', text: '특정 상황이나 장소를 두려워해서 피했다.', weight: 0.6 },
  { id: 40, domain: 'anxiety', text: '가슴 두근거림, 식은땀, 숨 막힘 같은 불안 증상이 있었다.', weight: 0.6 },
  { id: 41, domain: 'pain', text: '원인 모를 두통, 근육통, 소화 불편이 있었다.', weight: 0.6 },
  { id: 42, domain: 'pain', text: '만성적인 피로가 쉬어도 잘 회복되지 않았다.', weight: 0.6 },
  { id: 43, domain: 'pain', text: '복통, 설사, 변비 같은 소화기 증상이 자주 있었다.', weight: 0.6 },
  { id: 44, domain: 'pain', text: '가슴 답답함이나 호흡 불편을 자주 느꼈다.', weight: 0.6 },
  { id: 45, domain: 'pain', text: '전신 통증이나 특정 부위의 만성 통증이 있었다.', weight: 0.6 },
  { id: 46, domain: 'risk', text: '죽음에 대한 생각이 자주 떠올랐다.', weight: 2, dsm: 'suicide' },
  { id: 47, domain: 'risk', text: '자해나 자살에 대한 구체적인 생각이나 계획이 있었다.', weight: 2.5, dsm: 'suicide' },
  { id: 48, domain: 'risk', text: '증상 때문에 직장, 학업, 일상생활 기능이 크게 떨어졌다.', weight: 1.2 },
  { id: 49, domain: 'risk', text: '가족이나 친구와의 관계에 문제가 생겼다.', weight: 1 },
  { id: 50, domain: 'risk', text: '위생, 식사, 청소 등 기본적인 자기 관리가 어려웠다.', weight: 1 },
];

export const OPTIONS = [
  { value: 0, label: '전혀 아니다', short: '0' },
  { value: 1, label: '가끔 그렇다', short: '1' },
  { value: 2, label: '자주 그렇다', short: '2' },
  { value: 3, label: '거의 매일', short: '3' },
  { value: 4, label: '항상 그렇다', short: '4' },
];

export const OPTION_COLORS = ['#2E7D32', '#689F38', '#F9A825', '#EF6C00', '#C62828'];
export const MAX_RAW_SCORE = QUESTIONS.reduce((sum, q) => sum + 4 * q.weight, 0);

export function calculateResults(answers) {
  const weightedScore = QUESTIONS.reduce((sum, q, i) => sum + (answers[i] || 0) * q.weight, 0);
  const pct = Math.min(100, Math.round((weightedScore / MAX_RAW_SCORE) * 100));

  const domainScores = {};
  DOMAINS.forEach((domain) => {
    const domainQuestions = QUESTIONS.filter((q) => q.domain === domain.id);
    const score = domainQuestions.reduce((sum, q) => {
      const index = QUESTIONS.findIndex((item) => item.id === q.id);
      return sum + (answers[index] || 0) * q.weight;
    }, 0);
    const max = domainQuestions.reduce((sum, q) => sum + 4 * q.weight, 0);
    domainScores[domain.id] = {
      score: Math.round(score * 10) / 10,
      pct: max > 0 ? Math.min(100, Math.round((score / max) * 100)) : 0,
      max: Math.round(max * 10) / 10,
    };
  });

  return { weightedScore, pct, domainScores, dsm: analyzeDSM(answers) };
}

function analyzeDSM(answers) {
  const mapping = [
    { criterion: 'depressed_mood', item: 0, threshold: 2 },
    { criterion: 'anhedonia', item: 5, threshold: 2 },
    { criterion: 'appetite', item: 30, threshold: 2 },
    { criterion: 'sleep', item: 25, threshold: 2 },
    { criterion: 'fatigue', item: 32, threshold: 2 },
    { criterion: 'psychomotor', item: 33, threshold: 2 },
    { criterion: 'worthlessness', item: 10, threshold: 2 },
    { criterion: 'concentration', item: 20, threshold: 2 },
    { criterion: 'suicide', item: 45, threshold: 1 },
  ];

  const results = mapping.map((m) => ({
    criterion: m.criterion,
    met: (answers[m.item] || 0) >= m.threshold,
    score: answers[m.item] || 0,
  }));
  const hasCore = results.some((r) => ['depressed_mood', 'anhedonia'].includes(r.criterion) && r.met);
  const otherMet = results.filter((r) => !['depressed_mood', 'anhedonia'].includes(r.criterion) && r.met).length;
  const totalMet = (hasCore ? 1 : 0) + otherMet;
  return { results, hasCore, otherMet, totalMet, likelyMDD: hasCore && totalMet >= 5 };
}

export function getLevel(pct) {
  if (pct <= 8) return { label: '안정 범위', desc: '현재 응답에서는 우울 관련 신호가 낮게 나타납니다.', color: '#2E7D32', emoji: '😊' };
  if (pct <= 20) return { label: '가벼운 주의', desc: '가벼운 우울 신호가 있습니다. 수면, 식사, 활동 리듬을 점검해보세요.', color: '#689F38', emoji: '🙂' };
  if (pct <= 35) return { label: '경도 우울', desc: '일상 관리와 주변 지지가 도움이 될 수 있습니다.', color: '#F9A825', emoji: '😐' };
  if (pct <= 50) return { label: '중등도 우울', desc: '전문가 상담을 고려해볼 만한 수준의 신호가 있습니다.', color: '#EF6C00', emoji: '😟' };
  if (pct <= 70) return { label: '중증 우울', desc: '정신건강 전문가와의 상담을 권장합니다.', color: '#D81B60', emoji: '😢' };
  return { label: '고위험', desc: '즉시 주변 사람이나 전문가에게 도움을 요청하는 것이 필요합니다.', color: '#C62828', emoji: '🚨' };
}

export function getDomainAdvice(domainId) {
  const advice = {
    mood: { good: '기분 상태가 비교적 안정적입니다.', bad: '우울한 기분이 지속되는 신호가 있습니다. 감정 기록과 상담이 도움이 될 수 있습니다.' },
    anhedonia: { good: '즐거움과 관심이 유지되고 있습니다.', bad: '흥미 저하가 두드러집니다. 작고 구체적인 활동부터 다시 연결해보세요.' },
    cognition: { good: '자기 평가가 크게 흔들리지 않습니다.', bad: '자책과 무가치감이 강할 수 있습니다. 생각을 사실과 해석으로 나누어 보는 연습이 필요합니다.' },
    hopelessness: { good: '미래에 대한 희망감이 유지되고 있습니다.', bad: '절망감이 높습니다. 혼자 견디기보다 신뢰할 수 있는 사람에게 현재 상태를 알려주세요.' },
    neurocognitive: { good: '집중과 결정 기능이 비교적 유지됩니다.', bad: '집중, 기억, 결정이 어려울 수 있습니다. 일을 작은 단위로 나누는 것이 좋습니다.' },
    sleep: { good: '수면 리듬이 비교적 안정적입니다.', bad: '수면 문제가 우울감을 악화시킬 수 있습니다. 취침 시간을 고정하고 자극을 줄여보세요.' },
    somatic: { good: '신체 에너지와 식욕 신호가 비교적 안정적입니다.', bad: '피로, 식욕, 몸의 속도 변화가 보입니다. 생활 리듬과 진료 상담을 함께 고려하세요.' },
    anxiety: { good: '불안 수준이 높지 않습니다.', bad: '불안과 긴장이 동반됩니다. 호흡 조절, 이완 훈련, 상담이 도움이 됩니다.' },
    pain: { good: '신체 불편감 신호가 낮습니다.', bad: '통증이나 신체 불편감이 스트레스와 연결될 수 있습니다. 몸 상태 점검이 필요합니다.' },
    risk: { good: '자해 사고와 기능 손상 신호가 낮습니다.', bad: '위험 신호가 있습니다. 지금 바로 주변 사람, 상담전화, 전문가에게 도움을 요청하세요.' },
  };
  return advice[domainId] || { good: '', bad: '' };
}

export function getSubtypeIndicators(answers) {
  const value = (questionId) => answers[QUESTIONS.findIndex((q) => q.id === questionId)] || 0;
  const subtypes = [
    {
      label: '멜랑콜리 양상',
      match: [7, 27, 31, 34].filter((id) => value(id) >= 3).length >= 3,
      desc: '즐거움 저하, 조기 각성, 식욕 감소, 정신운동 변화가 함께 나타납니다.',
    },
    {
      label: '비전형 양상',
      match: [28, 32, 35].filter((id) => value(id) >= 3).length >= 2,
      desc: '과수면, 과식, 초조감이 함께 두드러질 수 있습니다.',
    },
    {
      label: '불안 동반',
      match: [36, 37, 38, 40].filter((id) => value(id) >= 3).length >= 2,
      desc: '우울 증상과 함께 불안, 긴장, 공황 신호가 동반됩니다.',
    },
  ];
  return subtypes.filter((item) => item.match);
}
