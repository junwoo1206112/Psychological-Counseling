import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CrisisBanner from '../components/CrisisBanner';
import QuickExit from '../components/QuickExit';
import { clearAssessmentSummary, saveAssessmentSummary } from '../lib/assessment-session';
import { hasScreeningConsent } from '../lib/consent-session';
import {
  buildAssessmentResult,
  SAFETY_QUESTIONS,
  SAFETY_OPTIONS,
  PHQ9_ITEMS,
  PHQ9_KO_ITEMS,
  PHQ9_HINTS,
  PHQ_A_ITEMS,
  PHQ_A_KO_ITEMS,
  PHQ_A_HINTS,
  GAD7_ITEMS,
  GAD7_KO_ITEMS,
  GAD7_HINTS,
  ASQ_ITEMS,
  ASQ_ACUITY_ITEM,
  ASQ_OPTIONS,
  IMPAIRMENT_QUESTION,
  IMPAIRMENT_QUESTION_KO,
  IMPAIRMENT_OPTIONS,
  KOREAN_TRANSLATION_NOTICE,
  LIKERT_OPTIONS,
} from '../data/instruments';

const SAFETY_COUNT = SAFETY_QUESTIONS.length;
const GAD7_COUNT = GAD7_ITEMS.length;
const ASQ_COUNT = ASQ_ITEMS.length;
const CHECK_IN_OPTIONS = [
  { value: 'thoughts', label: '지금 떠오르는 생각을 정리하고 싶어요' },
  { value: 'talk', label: '누군가와 이야기할 방법을 찾고 싶어요' },
  { value: 'support', label: '도움받을 곳을 먼저 알고 싶어요' },
  { value: 'skip', label: '건너뛰고 선별검사로 이동할게요' },
];

function isPositive(value) {
  return value === 'yes' || value === 'unknown' || value === true;
}

function optionColor(value, selected) {
  if (!selected) return '#E2ECEA';
  if (value === 'yes') return '#B71C1C';
  if (value === 'unknown') return '#7A5C00';
  if (value === 'no') return '#1B5E20';
  if (typeof value === 'number') {
    return ['#1B5E20', '#33691E', '#7A5C00', '#B71C1C'][value] || '#2C6E63';
  }
  return '#2C6E63';
}

export default function Survey() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const ageGroup = params.ageGroup;
  const permittedEntry = hasScreeningConsent(ageGroup);
  const isYouth = ageGroup === 'youth';
  const depressionItems = isYouth ? PHQ_A_ITEMS : PHQ9_ITEMS;
  const depressionKoItems = isYouth ? PHQ_A_KO_ITEMS : PHQ9_KO_ITEMS;
  const depressionHints = isYouth ? PHQ_A_HINTS : PHQ9_HINTS;
  const DEPRESSION_COUNT = depressionItems.length;
  const [phase, setPhase] = useState('checkin');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({ checkin: null, safety: {}, phq9: [], gad7: [], asq: {}, impairment: null });
  const [acuityNeeded, setAcuityNeeded] = useState(false);
  const [showEnglish, setShowEnglish] = useState(false);

  useEffect(() => {
    clearAssessmentSummary();
  }, []);

  useEffect(() => {
    if (!permittedEntry) router.replace('/');
  }, [permittedEntry, router]);

  const totalSteps = 1 + SAFETY_COUNT + DEPRESSION_COUNT + 1 + GAD7_COUNT + ASQ_COUNT + (acuityNeeded ? 1 : 0);

  let question;
  let options;
  let currentStep;
  let phaseLabel;
  let phaseNote;
  let currentValue;

  if (phase === 'checkin') {
    question = {
      id: 'checkin',
      text: '지금 이 확인에서 가장 먼저 받고 싶은 도움은 무엇인가요?',
      hint: '고민 탐색 · 선택 · 비채점',
    };
    options = CHECK_IN_OPTIONS;
    currentStep = 0;
    phaseLabel = '먼저 확인할 것';
    phaseNote = '이 답변은 점수·위험 수준·저장 데이터에 포함되지 않습니다. 원하지 않으면 건너뛸 수 있습니다.';
    currentValue = answers.checkin;
  } else if (phase === 'safety') {
    question = SAFETY_QUESTIONS[index];
    options = SAFETY_OPTIONS;
    currentStep = 1 + index;
    phaseLabel = '현재 안전 확인';
    phaseNote = "답하기 어려우면 '잘 모르겠어요'를 선택해도 괜찮습니다. 안전을 위해 확실하지 않은 응답은 위험 신호로 확인합니다.";
    currentValue = answers.safety[question?.id];
  } else if (phase === 'phq9') {
    question = {
      id: `phq9_${index}`,
      text: showEnglish ? depressionItems[index] : depressionKoItems[index],
      hint: depressionHints[index],
      canToggle: true,
    };
    options = LIKERT_OPTIONS;
    currentStep = 1 + SAFETY_COUNT + index;
    phaseLabel = isYouth ? '우울 증상 · PHQ-A' : '우울 증상 · PHQ-9';
    phaseNote = isYouth
      ? '지난 2주 동안 얼마나 자주 경험했나요? 청소년용 PHQ-A 문항을 한국어 번역과 영문 원문으로 제공합니다.'
      : '지난 2주 동안 얼마나 자주 경험했나요? 한국어 번역과 영문 원문을 함께 제공하며, 채점은 영문 원문 기준입니다.';
    currentValue = answers.phq9[index];
  } else if (phase === 'impairment') {
    question = {
      ...(showEnglish ? IMPAIRMENT_QUESTION : IMPAIRMENT_QUESTION_KO),
      canToggle: true,
    };
    options = IMPAIRMENT_OPTIONS;
    currentStep = 1 + SAFETY_COUNT + DEPRESSION_COUNT;
    phaseLabel = '일상 기능 확인';
    phaseNote = '이 문항은 점수에 포함되지 않습니다. 최근 증상이 일상생활에 얼마나 어려움을 주었는지 확인합니다.';
    currentValue = answers.impairment;
  } else if (phase === 'gad7') {
    question = {
      id: `gad7_${index}`,
      text: showEnglish ? GAD7_ITEMS[index] : GAD7_KO_ITEMS[index],
      hint: GAD7_HINTS[index],
      canToggle: true,
    };
    options = LIKERT_OPTIONS;
    currentStep = 1 + SAFETY_COUNT + DEPRESSION_COUNT + 1 + index;
    phaseLabel = '불안 증상 · GAD-7';
    phaseNote = '지난 2주 동안 얼마나 자주 경험했나요? 한국어 번역과 영문 원문을 함께 제공하며, 채점은 영문 원문 기준입니다.';
    currentValue = answers.gad7[index];
  } else if (phase === 'asq') {
    question = ASQ_ITEMS[index];
    options = ASQ_OPTIONS;
    currentStep = 1 + SAFETY_COUNT + DEPRESSION_COUNT + 1 + GAD7_COUNT + index;
    phaseLabel = '자살 위험 선별 · ASQ';
    phaseNote = '최근의 생각과 경험을 떠올려 주세요. 답하기 어려우면 잘 모르겠어요를 선택해도 괜찮습니다.';
    currentValue = answers.asq[question?.id];
  } else if (phase === 'asq_acuity') {
    question = ASQ_ACUITY_ITEM;
    options = ASQ_OPTIONS;
    currentStep = 1 + SAFETY_COUNT + DEPRESSION_COUNT + 1 + GAD7_COUNT + ASQ_COUNT;
    phaseLabel = '마지막 확인';
    phaseNote = '지금 이 순간의 상태를 확인합니다.';
    currentValue = answers.asq.q5;
  }

  function finish(nextAnswers) {
    const result = buildAssessmentResult({ ...nextAnswers, ageGroup });
    if (result.risk.tier === 'acute') {
      router.replace({ pathname: '/crisis', params: { reason: 'result' } });
      return;
    }
    saveAssessmentSummary(result);
    router.replace('/result');
  }

  function handleSelect(value) {
    const next = {
      checkin: answers.checkin,
      safety: { ...answers.safety },
      phq9: [...answers.phq9],
      gad7: [...answers.gad7],
      asq: { ...answers.asq },
      impairment: answers.impairment,
    };

    if (phase === 'checkin') {
      // This is a conversation starter only. It is intentionally excluded from scoring and results.
      next.checkin = value;
      if (value === 'support') {
        router.push('/resources');
        return;
      }
      setAnswers(next);
      setPhase('safety');
      setIndex(0);
      return;
    }

    if (phase === 'safety') {
      next.safety[question.id] = value;
      if (question.acute && isPositive(value)) {
        setAnswers(next);
        router.replace({ pathname: '/crisis', params: { reason: 'safety' } });
        return;
      }
      if (index + 1 < SAFETY_COUNT) {
        setAnswers(next);
        setIndex(index + 1);
        return;
      }
      setAnswers(next);
      setPhase('phq9');
      setIndex(0);
      return;
    }

    if (phase === 'phq9') {
      next.phq9[index] = value;
      if (index + 1 < DEPRESSION_COUNT) {
        setAnswers(next);
        setIndex(index + 1);
        return;
      }
      setAnswers(next);
      setPhase('impairment');
      setIndex(0);
      return;
    }

    if (phase === 'impairment') {
      next.impairment = value;
      setAnswers(next);
      setPhase('gad7');
      setIndex(0);
      return;
    }

    if (phase === 'gad7') {
      next.gad7[index] = value;
      if (index + 1 < GAD7_COUNT) {
        setAnswers(next);
        setIndex(index + 1);
        return;
      }
      setAnswers(next);
      setPhase('asq');
      setIndex(0);
      return;
    }

    if (phase === 'asq') {
      next.asq[question.id] = value;
      if (index + 1 < ASQ_COUNT) {
        setAnswers(next);
        setIndex(index + 1);
        return;
      }
      const positive = ASQ_ITEMS.some((item) => isPositive(next.asq[item.id]));
      setAnswers(next);
      if (positive) {
        setAcuityNeeded(true);
        setPhase('asq_acuity');
        return;
      }
      finish(next);
      return;
    }

    if (phase === 'asq_acuity') {
      next.asq.q5 = value;
      setAnswers(next);
      if (isPositive(value)) {
        router.replace({ pathname: '/crisis', params: { reason: 'asq' } });
        return;
      }
      finish(next);
    }
  }

  function handleBack() {
    if (phase === 'checkin') {
      // The conversation starter is the first survey screen. Going back must
      // never fall through to ASQ or skip the safety-first sequence.
      router.replace('/');
      return;
    }
    if (phase === 'safety') {
      if (index === 0) {
        setPhase('checkin');
        setIndex(0);
        return;
      }
      setIndex(index - 1);
      return;
    }
    if (phase === 'phq9') {
      if (index === 0) {
        setPhase('safety');
        setIndex(SAFETY_COUNT - 1);
        return;
      }
      setIndex(index - 1);
      return;
    }
    if (phase === 'impairment') {
      setPhase('phq9');
      setIndex(DEPRESSION_COUNT - 1);
      return;
    }
    if (phase === 'gad7') {
      if (index === 0) {
        setPhase('impairment');
        setIndex(0);
        return;
      }
      setIndex(index - 1);
      return;
    }
    if (phase === 'asq') {
      if (index === 0) {
        setPhase('gad7');
        setIndex(GAD7_COUNT - 1);
        return;
      }
      setIndex(index - 1);
      return;
    }

    if (phase === 'asq_acuity') {
      setPhase('asq');
      setIndex(ASQ_COUNT - 1);
      return;
    }
    // Every known phase is handled above. Keep an unexpected state at the
    // safe start boundary instead of jumping into a later screening section.
    router.replace('/');
  }

  if (!permittedEntry || !question) return null;

  const progress = Math.min(100, Math.round(((currentStep + 1) / totalSteps) * 100));

  return (
    <SafeAreaView style={s.container} edges={['bottom']}>
      <QuickExit />
      <CrisisBanner compact />
      <View style={s.progressWrap}>
        <View style={s.progressBg}>
          <View style={[s.progressFill, { width: `${progress}%` }]} />
        </View>
        <View style={s.progressRow}>
          <Text style={s.progressText} accessibilityLiveRegion="polite">{currentStep + 1} / {totalSteps}</Text>
          <TouchableOpacity onPress={() => router.replace('/')} activeOpacity={0.7} accessibilityLabel="설문을 그만하고 처음으로">
            <Text style={s.quit}>그만하기</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.area}>
        {isYouth && (
          <View style={s.youthBanner}>
            <Text style={s.youthBannerText}>
              청소년 사용자 안내: 힘든 마음이 있다면 1388(청소년전화)에서 먼저 이야기할 수 있습니다.
            </Text>
          </View>
        )}
        <View style={s.phaseBadge}>
          <Text style={s.phaseLabel}>{phaseLabel}</Text>
        </View>
        {question.canToggle ? (
          <TouchableOpacity
            style={s.langToggle}
            onPress={() => setShowEnglish((value) => !value)}
            activeOpacity={0.8}
            accessibilityLabel={showEnglish ? '한국어 문항으로 보기' : '영문 원문 보기'}
          >
            <Text style={s.langToggleText}>{showEnglish ? '한국어로 보기' : '영문 원문 보기'}</Text>
          </TouchableOpacity>
        ) : null}
        {question.hint ? <Text style={s.hint}>{question.hint}</Text> : null}

        <Text style={s.qText} accessibilityLiveRegion="polite">{question.text}</Text>
        <Text style={s.guide}>{phaseNote}</Text>
        {question.canToggle ? <Text style={s.translationNote}>{KOREAN_TRANSLATION_NOTICE}</Text> : null}

        <View style={s.options} accessibilityRole="radiogroup" accessibilityLabel="응답 선택">
          {options.map((option) => {
            const selected = currentValue === option.value;
            return (
              <TouchableOpacity
                key={String(option.value)}
                style={[
                  s.optBtn,
                  selected && { backgroundColor: optionColor(option.value, true), borderColor: optionColor(option.value, true) },
                ]}
                onPress={() => handleSelect(option.value)}
                activeOpacity={0.78}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
              >
                <Text style={[s.optLabel, selected && s.optSel]}>{option.label}</Text>
                {selected && <Text style={s.check}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={s.nav}>
          <TouchableOpacity style={s.backBtn} onPress={handleBack} activeOpacity={0.8} accessibilityLabel="이전 문항으로">
            <Text style={s.backText}>이전</Text>
          </TouchableOpacity>
          <Text style={s.navNote}>선택하면 다음 문항으로 이동합니다.</Text>
        </View>

        {phase === 'safety' && (
          <Text style={s.safetyNote}>
            현재 위험한 상황이라면 설문을 멈추고 119 또는 112에 연락해 주세요.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FBFA', position: 'relative' },
  progressWrap: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 6 },
  progressBg: { height: 6, backgroundColor: '#DDE9E7', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#2C6E63', borderRadius: 3 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  progressText: { color: '#2C6E63', fontSize: 13, fontWeight: '700' },
  quit: { color: '#546E7A', fontSize: 12, fontWeight: '700', textDecorationLine: 'underline', paddingVertical: 8, paddingHorizontal: 4 },
  area: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 40 },
  phaseBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E4F1EE',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 16,
  },
  phaseLabel: { fontSize: 12, fontWeight: '800', color: '#2C6E63' },
  hint: { fontSize: 13, fontWeight: '700', color: '#455A64', marginBottom: 6 },
  langToggle: { alignSelf: 'flex-start', backgroundColor: '#E4F1EE', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, marginBottom: 10, minHeight: 36, justifyContent: 'center' },
  langToggleText: { color: '#2C6E63', fontSize: 12, fontWeight: '800' },
  qText: { fontSize: 21, fontWeight: '800', color: '#14213D', lineHeight: 31, marginBottom: 10 },
  guide: { fontSize: 13, color: '#455A64', marginBottom: 10, lineHeight: 19 },
  translationNote: { fontSize: 11, color: '#546E7A', lineHeight: 17, marginBottom: 18 },
  options: { gap: 10 },
  optBtn: {
    borderWidth: 2,
    borderColor: '#D5E7E3',
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    minHeight: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optLabel: { fontSize: 15, fontWeight: '700', color: '#263238', flex: 1 },
  optSel: { color: '#fff' },
  check: { color: '#fff', fontSize: 16, fontWeight: '800' },
  nav: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 22 },
  backBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, backgroundColor: '#E4F1EE', minHeight: 44, justifyContent: 'center' },
  backText: { color: '#2C6E63', fontSize: 13, fontWeight: '800' },
  navNote: { fontSize: 11, color: '#546E7A', flex: 1 },
  safetyNote: { fontSize: 12, color: '#B71C1C', lineHeight: 18, marginTop: 18, fontWeight: '700' },
  youthBanner: { backgroundColor: '#E3F2FD', borderRadius: 12, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#90CAF9' },
  youthBannerText: { fontSize: 12, color: '#0D47A1', lineHeight: 18, fontWeight: '700' },
});
