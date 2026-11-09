#!/usr/bin/env node
import {
  SAFETY_QUESTIONS,
  PHQ9_ITEMS,
  PHQ9_KO_ITEMS,
  PHQ_A_ITEMS,
  PHQ_A_KO_ITEMS,
  GAD7_ITEMS,
  GAD7_KO_ITEMS,
  ASQ_ITEMS,
  ASQ_ACUITY_ITEM,
  IMPAIRMENT_QUESTION,
  IMPAIRMENT_QUESTION_KO,
  IMPAIRMENT_OPTIONS,
  KOREAN_TRANSLATION_NOTICE,
  LIKERT_OPTIONS,
  SAFETY_OPTIONS,
  ASQ_OPTIONS,
  CRISIS_RESOURCES,
  SAFETY_PLAN_STEPS,
  INSTRUMENT_META,
  CONTENT_HASHES,
  TRANSLATION_STATUS,
  INSTRUMENT_VERSION_DATE,
  scorePHQ9,
  scoreGAD7,
  scoreASQ,
  evaluateRisk,
  buildAssessmentResult,
} from '../data/instruments.js';
import { hashItems } from '../lib/instrument-hash.js';

let failed = 0;

function check(name, condition, detail = '') {
  if (condition) {
    console.log(`PASS  ${name}`);
  } else {
    failed += 1;
    console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('\n검증: data/instruments.js\n');

check('PHQ-9 문항 9개', PHQ9_ITEMS.length === 9, `현재 ${PHQ9_ITEMS.length}`);
check('PHQ-A 문항 9개', PHQ_A_ITEMS.length === 9, `현재 ${PHQ_A_ITEMS.length}`);
check('GAD-7 문항 7개', GAD7_ITEMS.length === 7, `현재 ${GAD7_ITEMS.length}`);
check('PHQ-9 한국어 문항 9개', PHQ9_KO_ITEMS.length === 9, `현재 ${PHQ9_KO_ITEMS.length}`);
check('PHQ-A 한국어 문항 9개', PHQ_A_KO_ITEMS.length === 9, `현재 ${PHQ_A_KO_ITEMS.length}`);
check('GAD-7 한국어 문항 7개', GAD7_KO_ITEMS.length === 7, `현재 ${GAD7_KO_ITEMS.length}`);
check('기능손상 한국어 문항 존재', Boolean(IMPAIRMENT_QUESTION_KO.text));
check('한국어 번역 고지 존재', KOREAN_TRANSLATION_NOTICE.includes('영문 원문'));
check('ASQ 문항 4개 + 급성도 1개', ASQ_ITEMS.length === 4 && Boolean(ASQ_ACUITY_ITEM.id));
check('안전 확인 문항 4개', SAFETY_QUESTIONS.length === 4, `현재 ${SAFETY_QUESTIONS.length}`);
check('비채점 기능손상 문항 존재', Boolean(IMPAIRMENT_QUESTION.id));
check('기능손상 응답 4지선다', IMPAIRMENT_OPTIONS.length === 4, `현재 ${IMPAIRMENT_OPTIONS.length}`);
check('Likert 응답 0~3', LIKERT_OPTIONS.length === 4 && LIKERT_OPTIONS.every((option, index) => option.value === index));
check('안전 응답에 예/아니요/모르겠음', ['yes', 'no', 'unknown'].every((value) => SAFETY_OPTIONS.some((option) => option.value === value)));
check('ASQ 응답에 예/아니요/모르겠음', ['yes', 'no', 'unknown'].every((value) => ASQ_OPTIONS.some((option) => option.value === value)));

check('PHQ-9 전체 3점 = 27', scorePHQ9([3, 3, 3, 3, 3, 3, 3, 3, 3]).total === 27);
check('GAD-7 전체 3점 = 21', scoreGAD7([3, 3, 3, 3, 3, 3, 3]).total === 21);
check('PHQ-9 0~4 = 낮은 수준', scorePHQ9([0, 0, 0, 0, 0, 0, 0, 0, 0]).band.id === 'minimal');
check('PHQ-9 10 = 중간 수준', scorePHQ9([2, 2, 2, 2, 1, 1, 0, 0, 0]).band.id === 'moderate');
check('GAD-7 15 = 높은 수준', scoreGAD7([3, 3, 3, 3, 3, 0, 0]).band.id === 'severe');
check('PHQ-9 문항 9 점수 보존', scorePHQ9([0, 0, 0, 0, 0, 0, 0, 0, 3]).item9 === 3);

check('ASQ 모두 아니요 = 음성', scoreASQ({ q1: 'no', q2: 'no', q3: 'no', q4: 'no' }).positive === false);
check('ASQ 모르겠음 = 양성', scoreASQ({ q1: 'unknown', q2: 'no', q3: 'no', q4: 'no' }).positive === true);
check('ASQ Q5 예 = 급성', scoreASQ({ q1: 'no', q2: 'no', q3: 'no', q4: 'no', q5: 'yes' }).acute === true);

const low = evaluateRisk({
  safety: {},
  phq9: scorePHQ9([0, 0, 0, 0, 0, 0, 0, 0, 0]),
  gad7: scoreGAD7([0, 0, 0, 0, 0, 0, 0]),
  asq: scoreASQ({ q1: 'no', q2: 'no', q3: 'no', q4: 'no' }),
});
check('낮은 위험 = low', low.tier === 'low');

const acuteSafety = evaluateRisk({
  safety: { currentIdeation: 'yes' },
  phq9: scorePHQ9([]),
  gad7: scoreGAD7([]),
  asq: scoreASQ({}),
});
check('현재 자살사고 = acute', acuteSafety.tier === 'acute');

const acuteAsq = evaluateRisk({
  safety: {},
  phq9: scorePHQ9([]),
  gad7: scoreGAD7([]),
  asq: scoreASQ({ q1: 'yes', q2: 'no', q3: 'no', q4: 'no', q5: 'yes' }),
});
check('ASQ Q5 양성 = acute', acuteAsq.tier === 'acute');

const urgentAsq = evaluateRisk({
  safety: {},
  phq9: scorePHQ9([]),
  gad7: scoreGAD7([]),
  asq: scoreASQ({ q1: 'yes', q2: 'no', q3: 'no', q4: 'no', q5: 'no' }),
});
check('ASQ 비급성 양성 = urgent', urgentAsq.tier === 'urgent');

const urgentPast = evaluateRisk({
  safety: { pastAttempt: 'yes' },
  phq9: scorePHQ9([]),
  gad7: scoreGAD7([]),
  asq: scoreASQ({ q1: 'no', q2: 'no', q3: 'no', q4: 'no' }),
});
check('과거 시도 = urgent', urgentPast.tier === 'urgent');

const urgentImpairment = evaluateRisk({
  safety: {},
  impairment: 'very',
  phq9: scorePHQ9([]),
  gad7: scoreGAD7([]),
  asq: scoreASQ({ q1: 'no', q2: 'no', q3: 'no', q4: 'no' }),
});
check('기능손상 "많이 어려움" = urgent', urgentImpairment.tier === 'urgent');

const routine = evaluateRisk({
  safety: {},
  phq9: scorePHQ9([2, 2, 2, 2, 1, 1, 0, 0, 0]),
  gad7: scoreGAD7([]),
  asq: scoreASQ({}),
});
check('PHQ-9 중간 = routine', routine.tier === 'routine');

const built = buildAssessmentResult({
  ageGroup: 'adult',
  safety: { currentIdeation: 'no', plan: 'no', meansOrUnsafe: 'no', pastAttempt: 'no' },
  phq9: [1, 1, 1, 1, 1, 1, 1, 1, 0],
  gad7: [1, 1, 1, 1, 1, 0, 0],
  asq: { q1: 'no', q2: 'no', q3: 'no', q4: 'no' },
  impairment: 'none',
});
check('결과 객체에 phq9/gad7/asq/risk 포함', Boolean(built.phq9 && built.gad7 && built.asq && built.risk));

const youthBuilt = buildAssessmentResult({
  ageGroup: 'youth',
  safety: { currentIdeation: 'no', plan: 'no', meansOrUnsafe: 'no', pastAttempt: 'no' },
  phq9: [1, 1, 1, 1, 1, 0, 0, 0, 0],
  gad7: [0, 0, 0, 0, 0, 0, 0],
  asq: { q1: 'no', q2: 'no', q3: 'no', q4: 'no' },
  impairment: 'none',
});
check('청소년 결과는 PHQ-A 사용', youthBuilt.depression.instrument === 'PHQ-A');

check('위기 자원에 109/119/112 포함', ['109', '119', '112'].every((phone) => CRISIS_RESOURCES.some((resource) => resource.phone === phone)));
check('위기 자원에 1577-0199/1388 포함', ['1577-0199', '1388'].every((phone) => CRISIS_RESOURCES.some((resource) => resource.phone === phone)));
check('안전계획 6단계', SAFETY_PLAN_STEPS.length === 6);
check('PHQ-9/PHQ-A/GAD-7/ASQ 메타 존재', Boolean(INSTRUMENT_META.phq9 && INSTRUMENT_META.phqa && INSTRUMENT_META.gad7 && INSTRUMENT_META.asq));

check('PHQ-9 영문 해시 일치', INSTRUMENT_META.phq9.contentHash === hashItems(PHQ9_ITEMS));
check('PHQ-A 영문 해시 일치', INSTRUMENT_META.phqa.contentHash === hashItems(PHQ_A_ITEMS));
check('GAD-7 영문 해시 일치', INSTRUMENT_META.gad7.contentHash === hashItems(GAD7_ITEMS));
check('PHQ-9 한국어 해시 일치', INSTRUMENT_META.phq9.translationHash === hashItems(PHQ9_KO_ITEMS));
check('PHQ-A 한국어 해시 일치', INSTRUMENT_META.phqa.translationHash === hashItems(PHQ_A_KO_ITEMS));
check('GAD-7 한국어 해시 일치', INSTRUMENT_META.gad7.translationHash === hashItems(GAD7_KO_ITEMS));
check('내용 해시 메타 존재', Boolean(CONTENT_HASHES.phq9.en && CONTENT_HASHES.phqa.ko && CONTENT_HASHES.gad7.ko && CONTENT_HASHES.asq.ko));
check('한국어 번역 상태 unofficial', INSTRUMENT_META.phq9.translationStatus === TRANSLATION_STATUS && TRANSLATION_STATUS === 'unofficial');
check('ASQ 공식 번역 상태', INSTRUMENT_META.asq.translationStatus === 'official-nimh');
check('계기 버전 날짜 포함', [INSTRUMENT_META.phq9.version, INSTRUMENT_META.phqa.version, INSTRUMENT_META.gad7.version, INSTRUMENT_META.asq.version].every((version) => version.includes(INSTRUMENT_VERSION_DATE)));

const allText = [...PHQ9_ITEMS, ...GAD7_ITEMS, ...ASQ_ITEMS.map((item) => item.text), ASQ_ACUITY_ITEM.text, ...SAFETY_QUESTIONS.map((item) => item.text)].join(' ');
const allKoreanText = [...PHQ9_KO_ITEMS, ...PHQ_A_KO_ITEMS, ...GAD7_KO_ITEMS, IMPAIRMENT_QUESTION_KO.text].join(' ');
check('문항 텍스트 비어 있지 않음', allText.trim().length > 300);
check('한국어 문항 텍스트 비어 있지 않음', allKoreanText.trim().length > 300);
check('한국어 문항에 한글 포함', [...PHQ9_KO_ITEMS, ...PHQ_A_KO_ITEMS, ...GAD7_KO_ITEMS].every((text) => /[가-힣]/.test(text)));
check('금지 표현 없음', !['우울증입니다', '자살 위험 점수', '진단 결과입니다'].some((phrase) => `${allText} ${allKoreanText}`.includes(phrase)));

if (failed > 0) {
  console.error(`\n검증 실패: ${failed}개\n`);
  process.exit(1);
}

console.log('\n모든 검증 통과\n');
