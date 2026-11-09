import { hashItems } from '../lib/instrument-hash.js';

export const RESOURCE_VERIFIED_AT = '2026-11-06';
export const RESOURCE_MAX_AGE_DAYS = 90;
export const RESOURCE_VERIFICATION_METHOD = 'official-web';
export const RESOURCE_VERIFICATION_SOURCES = [
  'https://www.129.go.kr/109/index.do',
  'https://www.119.go.kr/Center119/main.jsp',
  'https://www.police.go.kr',
  'https://www.cyber1388.kr',
  'https://www.mentalhealth.go.kr',
];
export const TRANSLATION_STATUS = 'unofficial';
export const INSTRUMENT_VERSION_DATE = '2026-11-02';

export const CRISIS_RESOURCES = [
  {
    id: 'suicide',
    label: '자살예방상담전화',
    phone: '109',
    hours: '24시간',
    description: '자살 위기 상담, 긴급 출동·지역 센터 연계',
    url: 'https://www.129.go.kr/109',
    primary: true,
  },
  {
    id: 'emergency',
    label: '응급 구급',
    phone: '119',
    hours: '24시간',
    description: '지금 다치거나 생명이 위험한 상황',
    url: 'https://www.119.go.kr',
    primary: true,
  },
  {
    id: 'police',
    label: '경찰',
    phone: '112',
    hours: '24시간',
    description: '즉각적인 신체 위험, 출동이 필요한 상황',
    url: 'https://www.police.go.kr',
  },
  {
    id: 'mental',
    label: '정신건강 위기상담',
    phone: '1577-0199',
    hours: '24시간',
    description: '정신건강 전반 상담, 지역 정신건강복지센터 연결',
    url: 'https://www.mohw.go.kr/menu.es?mid=a10706040100',
  },
  {
    id: 'youth',
    label: '청소년전화',
    phone: '1388',
    hours: '24시간',
    description: '만 9~24세 청소년 상담, 긴급구조·보호 연계',
    url: 'https://www.cyber1388.kr',
  },
  {
    id: 'lifeline',
    label: '생명의전화',
    phone: '1588-9191',
    hours: '24시간',
    description: '자살 위기 전화·사이버 상담',
    url: 'https://www.lifeline.or.kr/business/phone.php',
  },
  {
    id: 'center',
    label: '정신건강복지센터 찾기',
    phone: null,
    hours: '평일 주간, 센터별 상이',
    description: '거주 지역의 무료 상담·사례관리·의료기관 연계',
    url: 'https://www.mentalhealth.go.kr/portal/health/fac/PotalHealthFacListTab2.do?sc3=AFCS1%2CAFCS1_1%2CAFCS1_2',
  },
];

export const DISCLAIMER = '이 결과는 검증된 선별검사를 참고한 자가 점검이며, 의학적 진단이나 치료를 대신하지 않습니다. 정확한 평가는 의사 또는 정신건강전문가와 상담이 필요합니다.';

export const KOREAN_TRANSLATION_NOTICE = '한국어 문항은 이해를 돕기 위한 번역입니다. 영문 원문 도구의 합산 규칙을 적용하지만, 이 앱의 한국어 번역과 웹 사용 방식은 임상 타당화가 완료되지 않았습니다.';

export const SCREENING_SCOPE_NOTICE = '이 선별은 우울·불안 증상과 자살 관련 신호를 확인하는 데 한정됩니다. 낮은 점수나 ASQ 음성은 안전하거나 다른 정신건강 어려움이 없다는 뜻이 아닙니다.';

export const LEGAL_NOTICE = '본 제품은 의료기기가 아니므로 질병 유무를 판단할 수 없으며, 질병 유무 판단을 위해서는 의사의 검진이 필요합니다.';

export const SAFETY_PLAN_STEPS = [
  '나를 힘들게 하는 신호를 적어 둡니다. 예: 잠을 못 잔다, 혼자 있고 싶다.',
  '혼자서 할 수 있는 대처를 떠올립니다. 예: 천천히 호흡하기, 짧게 산책하기, 샤워하기.',
  '나를 편안하게 해 주는 사람이나 장소를 떠올립니다.',
  '지금 연락할 수 있는 사람의 이름과 전화번호를 확인합니다.',
  '도움을 요청할 곳을 확인합니다. 109, 1577-0199, 1388, 가까운 정신건강복지센터.',
  '안전한 환경을 만듭니다. 쓸 수 있는 물건을 다른 사람에게 맡기거나 손이 닿지 않게 두고, 술은 줄입니다.',
];

export const LIKERT_OPTIONS = [
  { value: 0, label: '전혀 없었다' },
  { value: 1, label: '며칠 동안' },
  { value: 2, label: '2주 중 절반 이상' },
  { value: 3, label: '거의 매일' },
];

export const SAFETY_OPTIONS = [
  { value: 'no', label: '아니요' },
  { value: 'yes', label: '예' },
  { value: 'unknown', label: '잘 모르겠어요' },
];

export const ASQ_OPTIONS = [
  { value: 'no', label: '아니요' },
  { value: 'yes', label: '예' },
  { value: 'unknown', label: '잘 모르겠어요' },
];

export const SAFETY_QUESTIONS = [
  {
    id: 'currentIdeation',
    text: '지금 이 순간에도 죽고 싶거나 스스로를 해치고 싶은 생각이 있나요?',
    acute: true,
  },
  {
    id: 'plan',
    text: '지금 또는 오늘 안에, 스스로를 해치기 위해 어떻게 하겠다는 구체적인 계획이 있나요?',
    acute: true,
  },
  {
    id: 'meansOrUnsafe',
    text: '지금 그 계획에 쓸 수 있는 물건이 손 닿는 곳에 있거나, 혼자서 안전을 지키기 어렵다고 느끼나요?',
    acute: true,
  },
  {
    id: 'pastAttempt',
    text: '예전에 스스로를 해치려고 했던 적이 있나요?',
    acute: false,
  },
];

export const PHQ9_ITEMS = [
  'Little interest or pleasure in doing things.',
  'Feeling down, depressed, or hopeless.',
  'Trouble falling or staying asleep, or sleeping too much.',
  'Feeling tired or having little energy.',
  'Poor appetite or overeating.',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down.',
  'Trouble concentrating on things, such as reading the newspaper or watching television.',
  'Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual.',
  'Thoughts that you would be better off dead, or of hurting yourself.',
];

export const PHQ9_HINTS = [
  '흥미·즐거움',
  '우울한 기분',
  '수면',
  '에너지',
  '식욕',
  '자기평가',
  '집중',
  '정신운동',
  '자살 생각',
];

export const PHQ9_KO_ITEMS = [
  '일을 하거나 즐거움을 느끼는 데 흥미나 즐거움이 거의 없었다.',
  '기분이 가라앉거나 우울하거나 절망적이었다.',
  '잠들기 어렵거나 잠을 유지하기 어려웠거나, 너무 많이 잤다.',
  '피곤하거나 기운이 거의 없었다.',
  '식욕이 없거나 과식했다.',
  '자신에 대해 나쁘게 느끼거나, 자신이 실패자라고 느끼거나, 자신이나 가족을 실망시켰다고 느꼈다.',
  '신문을 읽거나 텔레비전을 보는 것과 같은 일에 집중하기 어려웠다.',
  '다른 사람이 알아차릴 정도로 말하거나 움직이는 속도가 느려졌다. 또는 반대로 너무 안절부절못하거나 가만히 있지 못할 정도로 움직였다.',
  '차라리 죽는 것이 낫겠다고 생각하거나, 어떤 식으로든 자신을 해칠 생각을 했다.',
];

export const PHQ_A_ITEMS = [
  'Feeling down, depressed, irritable, or hopeless?',
  'Little interest or pleasure in doing things?',
  'Trouble falling asleep, staying asleep, or sleeping too much?',
  'Poor appetite, weight loss, or overeating?',
  'Feeling tired, or having little energy?',
  'Feeling bad about yourself — or feeling that you are a failure, or that you have let yourself or your family down?',
  'Trouble concentrating on things like school work, reading, or watching TV?',
  'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you were moving around a lot more than usual?',
  'Thoughts that you would be better off dead, or of hurting yourself in some way?',
];

export const PHQ_A_HINTS = [
  '우울한 기분·초조',
  '흥미·즐거움',
  '수면',
  '식욕',
  '에너지',
  '자기평가',
  '집중',
  '정신운동',
  '자살 생각',
];

export const PHQ_A_KO_ITEMS = [
  '기분이 가라앉거나 우울하거나 짜증이 나거나 절망적이었나요?',
  '일을 하거나 즐거움을 느끼는 데 흥미나 즐거움이 거의 없었나요?',
  '잠들기 어렵거나, 잠을 유지하기 어렵거나, 너무 많이 잤나요?',
  '식욕이 없거나, 체중이 줄거나, 과식했나요?',
  '피곤하거나 기운이 거의 없었나요?',
  '자신에 대해 나쁘게 느끼거나, 자신이 실패자라고 느끼거나, 자신이나 가족을 실망시켰다고 느꼈나요?',
  '학교 공부, 읽기, TV 시청과 같은 일에 집중하기 어려웠나요?',
  '다른 사람이 알아차릴 정도로 말하거나 움직이는 속도가 느려졌나요? 또는 반대로 너무 안절부절못하거나 가만히 있지 못할 정도로 움직였나요?',
  '차라리 죽는 것이 낫겠다고 생각하거나, 어떤 식으로든 자신을 해칠 생각을 했나요?',
];

export const GAD7_ITEMS = [
  'Feeling nervous, anxious or on edge.',
  'Not being able to stop or control worrying.',
  'Worrying too much about different things.',
  'Trouble relaxing.',
  'Being so restless that it is hard to sit still.',
  'Becoming easily annoyed or irritable.',
  'Feeling afraid as if something awful might happen.',
];

export const GAD7_HINTS = [
  '긴장·불안',
  '걱정 조절',
  '과도한 걱정',
  '이완 어려움',
  '초조',
  '짜증·예민',
  '공포·불안',
];

export const GAD7_KO_ITEMS = [
  '긴장되거나 불안하거나 초조했다.',
  '걱정을 멈추거나 조절하기 어려웠다.',
  '여러 가지 일에 대해 너무 많이 걱정했다.',
  '긴장을 풀기 어려웠다.',
  '너무 안절부절못해서 가만히 앉아 있기 어려웠다.',
  '쉽게 짜증이 나거나 예민해졌다.',
  '마치 끔찍한 일이 일어날 것처럼 두려웠다.',
];

export const ASQ_ITEMS = [
  {
    id: 'q1',
    text: '지난 몇 주 동안 죽고 싶다고 생각한 적이 있습니까?',
  },
  {
    id: 'q2',
    text: '지난 몇 주 동안 자신이 죽으면 본인 또는 본인의 가족이 더 나아진다고 생각한 적이 있습니까?',
  },
  {
    id: 'q3',
    text: '지난 몇 주 동안 자살에 관해 생각한 적이 있습니까?',
  },
  {
    id: 'q4',
    text: '자살을 시도했던 적이 있습니까?',
  },
];

export const ASQ_ACUITY_ITEM = {
  id: 'q5',
  text: '본인은 지금 자살을 생각하고 있습니까?',
};

export const IMPAIRMENT_QUESTION = {
  id: 'impairment',
  text: 'If you are experiencing any of the problems on this form, how difficult have these problems made it for you to do your work, take care of things at home or get along with other people?',
  hint: '일상 기능 · 비채점',
};

export const IMPAIRMENT_QUESTION_KO = {
  id: 'impairment',
  text: '이 설문의 문제들 중 하나라도 겪고 있다면, 그 문제 때문에 일을 하거나, 집안일을 하거나, 다른 사람들과 어울리는 것이 얼마나 어려웠나요?',
  hint: '일상 기능 · 비채점',
};

export const IMPAIRMENT_OPTIONS = [
  { value: 'none', label: '전혀 어렵지 않았다' },
  { value: 'some', label: '다소 어려웠다' },
  { value: 'very', label: '많이 어려웠다' },
  { value: 'extreme', label: '극히 어려웠다' },
];

export const IMPAIRMENT_LABELS = {
  none: '전혀 어렵지 않음',
  some: '다소 어려움',
  very: '많이 어려움',
  extreme: '극히 어려움',
};

export const CONTENT_HASHES = {
  phq9: { en: hashItems(PHQ9_ITEMS), ko: hashItems(PHQ9_KO_ITEMS) },
  phqa: { en: hashItems(PHQ_A_ITEMS), ko: hashItems(PHQ_A_KO_ITEMS) },
  gad7: { en: hashItems(GAD7_ITEMS), ko: hashItems(GAD7_KO_ITEMS) },
  asq: { ko: hashItems([...ASQ_ITEMS.map((item) => item.text), ASQ_ACUITY_ITEM.text]) },
};

export const INSTRUMENT_META = {
  phq9: {
    name: 'PHQ-9',
    fullName: 'Patient Health Questionnaire-9',
    timeframe: '지난 2주',
    items: 9,
    max: 27,
    version: `PHQ-9/en@${INSTRUMENT_VERSION_DATE}`,
    contentHash: CONTENT_HASHES.phq9.en,
    translationStatus: TRANSLATION_STATUS,
    translationVersion: `PHQ-9/ko-unofficial@${INSTRUMENT_VERSION_DATE}`,
    translationHash: CONTENT_HASHES.phq9.ko,
    source: 'Kroenke, Spitzer & Williams (2001)',
    url: 'https://www.phqscreeners.com/',
    license: 'PHQ Screeners 사이트의 영문 원문은 public domain이며, 번역·복제·배포가 허용됩니다. 본 앱은 한국어 이해용 번역과 영문 원문을 함께 제공하고, 채점은 영문 원문 기준으로 합니다.',
  },
  gad7: {
    name: 'GAD-7',
    fullName: 'Generalized Anxiety Disorder-7',
    timeframe: '지난 2주',
    items: 7,
    max: 21,
    version: `GAD-7/en@${INSTRUMENT_VERSION_DATE}`,
    contentHash: CONTENT_HASHES.gad7.en,
    translationStatus: TRANSLATION_STATUS,
    translationVersion: `GAD-7/ko-unofficial@${INSTRUMENT_VERSION_DATE}`,
    translationHash: CONTENT_HASHES.gad7.ko,
    source: 'Spitzer et al. (2006)',
    url: 'https://www.phqscreeners.com/',
    license: 'PHQ Screeners 사이트의 영문 원문은 public domain이며, 번역·복제·배포가 허용됩니다. 본 앱은 한국어 이해용 번역과 영문 원문을 함께 제공하고, 채점은 영문 원문 기준으로 합니다.',
  },
  asq: {
    name: 'ASQ',
    fullName: 'Ask Suicide-Screening Questions',
    timeframe: '지난 몇 주 / 지난 1주 / 현재',
    items: 4,
    max: null,
    version: `ASQ/ko@${INSTRUMENT_VERSION_DATE}`,
    contentHash: CONTENT_HASHES.asq.ko,
    translationStatus: 'official-nimh',
    translationVersion: `ASQ/ko@${INSTRUMENT_VERSION_DATE}`,
    translationHash: CONTENT_HASHES.asq.ko,
    source: 'NIMH ASQ Toolkit',
    url: 'https://www.nimh.nih.gov/research/research-conducted-at-nimh/asq-toolkit-materials',
    license: 'NIMH 무료 스크리닝 도구. 앱에서는 선별 목적으로만 사용합니다.',
  },
  phqa: {
    name: 'PHQ-A',
    fullName: 'Patient Health Questionnaire for Adolescents',
    timeframe: '지난 2주',
    items: 9,
    max: 27,
    version: `PHQ-A/en@${INSTRUMENT_VERSION_DATE}`,
    contentHash: CONTENT_HASHES.phqa.en,
    translationStatus: TRANSLATION_STATUS,
    translationVersion: `PHQ-A/ko-unofficial@${INSTRUMENT_VERSION_DATE}`,
    translationHash: CONTENT_HASHES.phqa.ko,
    source: 'Johnson, Harris, Spitzer & Williams (2002), NIMH ASQ Toolkit',
    url: 'https://www.nimh.nih.gov/research/research-conducted-at-nimh/asq-toolkit-materials/asq-tool/phq-9-modified-for-adolescents-phq-a',
    license: 'PHQ-A 9문항은 public domain입니다. 본 앱은 청소년 우울 증상의 심각도 선별에만 사용하며, 진단·기능 손상 판정은 하지 않습니다. 한국어 문항은 이해를 돕기 위한 번역이고 채점은 영문 원문 기준입니다.',
  },
};

const PHQ9_BANDS = [
  {
    id: 'minimal',
    max: 4,
    label: '낮은 수준',
    description: '현재 보고된 우울 증상은 낮은 수준입니다.',
    action: '상태가 변하면 2~4주 뒤 다시 점검해 보세요.',
    color: '#2E7D32',
  },
  {
    id: 'mild',
    max: 9,
    label: '가벼운 수준',
    description: '가벼운 우울 증상이 보고되었습니다.',
    action: '수면·식사·활동 리듬을 점검하고, 2~4주 뒤 다시 확인해 보세요.',
    color: '#33691E',
  },
  {
    id: 'moderate',
    max: 14,
    label: '중간 수준',
    description: '중간 수준의 우울 증상이 보고되었습니다.',
    action: '2주 안에 정신건강 전문가 상담을 고려해 보세요.',
    color: '#7A5C00',
  },
  {
    id: 'moderately_severe',
    max: 19,
    label: '중간 이상',
    description: '중간 이상의 우울 증상이 보고되었습니다.',
    action: '수일 안에 전문가 평가를 받아 보세요.',
    color: '#A63D00',
  },
  {
    id: 'severe',
    max: 27,
    label: '높은 수준',
    description: '높은 수준의 우울 증상이 보고되었습니다.',
    action: '가능한 한 빨리 전문가 평가를 받고, 안전 상태를 함께 확인하세요.',
    color: '#C62828',
  },
];

const GAD7_BANDS = [
  {
    id: 'minimal',
    max: 4,
    label: '낮은 수준',
    description: '현재 보고된 불안 증상은 낮은 수준입니다.',
    action: '상태가 변하면 다시 점검해 보세요.',
    color: '#2E7D32',
  },
  {
    id: 'mild',
    max: 9,
    label: '가벼운 수준',
    description: '가벼운 불안 증상이 보고되었습니다.',
    action: '긴장을 낮추는 휴식과 규칙적인 생활을 시도해 보세요.',
    color: '#33691E',
  },
  {
    id: 'moderate',
    max: 14,
    label: '중간 수준',
    description: '중간 수준의 불안 증상이 보고되었습니다.',
    action: '증상이 지속되면 전문가 상담을 고려해 보세요.',
    color: '#7A5C00',
  },
  {
    id: 'severe',
    max: 21,
    label: '높은 수준',
    description: '높은 수준의 불안 증상이 보고되었습니다.',
    action: '가능한 한 빨리 전문가 평가를 받아 보세요.',
    color: '#C62828',
  },
];

function findBand(bands, total) {
  return bands.find((band) => total <= band.max) || bands[bands.length - 1];
}

export function scorePHQ9(answers) {
  const values = PHQ9_ITEMS.map((_, index) => Number(answers?.[index] || 0));
  const total = values.reduce((sum, value) => sum + value, 0);
  return {
    instrument: 'PHQ-9',
    total,
    max: 27,
    band: findBand(PHQ9_BANDS, total),
    item9: values[8] || 0,
    deathThoughtSignal: (values[8] || 0) > 0,
  };
}

export function scorePHQA(answers) {
  const values = PHQ_A_ITEMS.map((_, index) => Number(answers?.[index] || 0));
  const total = values.reduce((sum, value) => sum + value, 0);
  return {
    instrument: 'PHQ-A',
    total,
    max: 27,
    band: findBand(PHQ9_BANDS, total),
    item9: values[8] || 0,
    deathThoughtSignal: (values[8] || 0) > 0,
  };
}

export function scoreGAD7(answers) {
  const values = GAD7_ITEMS.map((_, index) => Number(answers?.[index] || 0));
  const total = values.reduce((sum, value) => sum + value, 0);
  return {
    instrument: 'GAD-7',
    total,
    max: 21,
    band: findBand(GAD7_BANDS, total),
  };
}

function isPositive(value) {
  return value === 'yes' || value === 'unknown' || value === true;
}

export function scoreASQ(answers) {
  const values = ASQ_ITEMS.map((item) => answers?.[item.id]);
  const positive = values.some(isPositive);
  const acute = isPositive(answers?.q5);
  return {
    positive,
    acute,
    answered: values.filter(Boolean).length,
    q5Asked: answers?.q5 !== undefined,
    q4: answers?.q4,
  };
}

export function evaluateRisk({ safety = {}, impairment, phq9, gad7, asq }) {
  const safetyAcute = SAFETY_QUESTIONS.some(
    (question) => question.acute && isPositive(safety[question.id]),
  );
  const pastAttempt = isPositive(safety.pastAttempt) || isPositive(asq?.q4);
  const reasons = [];

  if (safetyAcute) reasons.push('현재 안전 확인에서 급성 위험 신호가 있었습니다.');
  if (asq?.acute) reasons.push('ASQ 현재 자살사고 문항에서 위험 신호가 있었습니다.');
  if (reasons.length > 0) {
    return {
      tier: 'acute',
      label: '지금 즉시 도움이 필요합니다',
      color: '#C62828',
      reasons,
      action: '119 또는 112에 연락하고, 혼자 있지 마세요. 109 상담사와도 바로 이야기해 보세요.',
      crisisFirst: true,
    };
  }

  if (asq?.positive) reasons.push('ASQ 자살위험 선별에서 양성 반응이 있었습니다.');
  if (phq9?.item9 > 0) reasons.push('PHQ-9 문항 9에서 죽음·자해 관련 응답이 있었습니다.');
  if (phq9?.total >= 20) reasons.push('PHQ-9 점수가 높은 수준입니다.');
  if (gad7?.total >= 15) reasons.push('GAD-7 점수가 높은 수준입니다.');
  if (pastAttempt) reasons.push('과거 자해·자살 시도 경험이 보고되었습니다.');
  if (impairment === 'very' || impairment === 'extreme') reasons.push('일상 기능의 어려움이 크게 보고되었습니다.');

  if (reasons.length > 0) {
    return {
      tier: 'urgent',
      label: '빠른 전문가 도움이 필요해 보입니다',
      color: '#A63D00',
      reasons,
      action: '오늘 안에 109 또는 1577-0199에 연락하고, 가까운 정신건강복지센터나 의료기관 상담을 받아 보세요.',
      crisisFirst: false,
    };
  }

  if (phq9?.total >= 10 || gad7?.total >= 10) {
    return {
      tier: 'routine',
      label: '전문가 상담을 고려해 볼 수 있습니다',
      color: '#7A5C00',
      reasons: ['우울 또는 불안 증상이 중간 수준 이상으로 보고되었습니다.'],
      action: '2주 안에 정신건강 전문가 상담을 고려하고, 증상이 지속되면 빠르게 연결하세요.',
      crisisFirst: false,
    };
  }

  if (phq9?.total >= 5 || gad7?.total >= 5) {
    return {
      tier: 'monitor',
      label: '상태를 관찰해 보세요',
      color: '#33691E',
      reasons: ['가벼운 우울 또는 불안 증상이 보고되었습니다.'],
      action: '2~4주 뒤 다시 점검하고, 수면·식사·활동 리듬을 유지해 보세요.',
      crisisFirst: false,
    };
  }

  return {
    tier: 'low',
    label: '현재 보고된 신호는 낮은 수준입니다',
    color: '#2E7D32',
      reasons: ['현재 응답에서 즉시 위기 연결이 필요한 신호는 보고되지 않았습니다.'],
      action: '이 결과만으로 안전이나 다른 정신건강 어려움의 부재를 판단할 수 없습니다. 상태가 변하거나 힘든 날이 이어지면 도움을 요청하세요.',
    crisisFirst: false,
  };
}

export function buildAssessmentResult(data = {}) {
  if (!['adult', 'youth'].includes(data.ageGroup)) {
    throw new RangeError('허용되지 않은 연령대입니다.');
  }
  const isYouth = data.ageGroup === 'youth';
  const depressionItems = isYouth ? PHQ_A_ITEMS : PHQ9_ITEMS;
  const validLikert = (answers, count) =>
    Array.isArray(answers) &&
    answers.length === count &&
    Array.from({ length: count }, (_, index) => answers[index]).every(
      (answer) => Number.isInteger(answer) && answer >= 0 && answer <= 3,
    );
  const validSafety = SAFETY_QUESTIONS.every((question) => ['yes', 'no', 'unknown'].includes(data.safety?.[question.id]));
  const validAsq = ASQ_ITEMS.every((item) => ['yes', 'no', 'unknown'].includes(data.asq?.[item.id]));
  const asqPositive = ASQ_ITEMS.some((item) => isPositive(data.asq?.[item.id]));
  const validAcuity = !asqPositive || ['yes', 'no', 'unknown'].includes(data.asq?.q5);
  if (!validSafety || !validLikert(data.phq9, depressionItems.length) || !validLikert(data.gad7, GAD7_ITEMS.length) || !validAsq || !validAcuity || !IMPAIRMENT_OPTIONS.some((option) => option.value === data.impairment)) {
    throw new RangeError('선별 응답이 완전하지 않거나 허용 범위를 벗어났습니다.');
  }
  const depression = isYouth ? scorePHQA(data.phq9) : scorePHQ9(data.phq9);
  const gad7 = scoreGAD7(data.gad7);
  const asq = scoreASQ(data.asq);
  const risk = evaluateRisk({ safety: data.safety, impairment: data.impairment, phq9: depression, gad7, asq });
  return {
    depression,
    phq9: depression,
    gad7,
    asq,
    risk,
    isYouth,
    impairment: data.impairment ?? null,
    impairmentLabel: IMPAIRMENT_LABELS[data.impairment] ?? null,
  };
}

export const RESULT_ACTIONS = {
  acute: [
    '119 또는 112에 연락하고, 혼자 있지 마세요.',
    '109 자살예방상담전화에서 지금 바로 이야기해 보세요.',
    '쓸 수 있는 물건을 다른 사람에게 맡기거나 손이 닿지 않게 두세요.',
  ],
  urgent: [
    '오늘 안에 109 또는 1577-0199에 연락해 보세요.',
    '믿을 수 있는 사람에게 지금 상태를 알려 주세요.',
    '가까운 정신건강복지센터나 의료기관의 상담 일정을 확인하세요.',
  ],
  routine: [
    '2주 안에 정신건강 전문가 상담을 예약해 보세요.',
    '수면과 식사, 가벼운 활동 리듬을 유지해 보세요.',
    '증상이 심해지거나 일상이 어려워지면 더 빠르게 도움을 요청하세요.',
  ],
  monitor: [
    '2~4주 뒤 다시 자가 점검을 해 보세요.',
    '가까운 사람에게 현재 상태를 이야기해 보세요.',
    '규칙적인 수면과 가벼운 움직임을 유지해 보세요.',
  ],
  low: [
    '현재 상태를 유지하고, 변화가 있으면 다시 점검해 보세요.',
    '힘든 날이 이어지면 109 또는 1577-0199에 연락해도 괜찮습니다.',
  ],
};
