import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CrisisBanner, { openPhone } from '../components/CrisisBanner';
import ResourceList from '../components/ResourceList';
import QuickExit from '../components/QuickExit';
import {
  RESULT_ACTIONS,
  SAFETY_PLAN_STEPS,
  DISCLAIMER,
  LEGAL_NOTICE,
  INSTRUMENT_META,
  KOREAN_TRANSLATION_NOTICE,
  SCREENING_SCOPE_NOTICE,
} from '../data/instruments';
import { loadAssessmentSummary } from '../lib/assessment-session';
import { SAFETY_PLAN_FIELDS, loadSafetyPlan } from '../lib/storage/safety-plan';
import { isStorageAvailable, loadHistory, saveHistory, addEntry, buildEntry } from '../lib/storage/adapter';

function ScoreCard({ title, meta, score, max, band, extra }) {
  return (
    <View style={s.card} accessibilityLabel={`${title} ${score}점 ${band.label}`}>
      <View style={s.cardHead}>
        <View style={s.cardTitleWrap}>
          <Text style={s.cardTitle}>{title}</Text>
          <Text style={s.cardMeta}>{meta}</Text>
        </View>
        <View style={[s.scoreBadge, { backgroundColor: `${band.color}18` }]}>
          <Text style={[s.scoreValue, { color: band.color }]}>{score}</Text>
          <Text style={[s.scoreMax, { color: band.color }]}>/{max}</Text>
        </View>
      </View>
      <View style={[s.bandPill, { backgroundColor: `${band.color}18` }]}>
        <Text style={[s.bandText, { color: band.color }]}>{band.label}</Text>
      </View>
      <Text style={s.cardDesc}>{band.description}</Text>
      <Text style={s.cardAction}>{band.action}</Text>
      {extra ? <Text style={s.extra}>{extra}</Text> : null}
      <Text style={s.cardDisclaimer}>이 점수는 의학적 진단이 아니며, 전문가 평가를 대신하지 않습니다.</Text>
    </View>
  );
}

export default function Result() {
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [memoFields, setMemoFields] = useState(null);
  const [youthCallFailed, setYouthCallFailed] = useState(false);
  const storageAvailable = mounted && isStorageAvailable();

  useEffect(() => {
    setResult(loadAssessmentSummary());
    setMemoFields(loadSafetyPlan()?.fields || {});
    setLoaded(true);
    setMounted(true);
  }, []);

  const acute = result?.risk?.tier === 'acute';

  useEffect(() => {
    if (acute) {
      router.replace({ pathname: '/crisis', params: { reason: 'result' } });
    }
  }, [acute, router]);

  if (!loaded) {
    return (
      <SafeAreaView style={s.container} edges={['bottom']}>
        <QuickExit />
        <View style={s.loading}>
          <Text style={s.loadingText} accessibilityLiveRegion="polite">결과를 불러오는 중…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!result) {
    return (
      <SafeAreaView style={s.container} edges={['bottom']}>
        <QuickExit />
        <ScrollView contentContainerStyle={s.scroll}>
          <Text style={s.missingTitle} accessibilityRole="header" aria-level={1}>결과를 불러올 수 없습니다</Text>
          <Text style={s.missingText}>
            결과 정보가 없거나 만료되었습니다. 이전 응답을 추정해서 보여주지 않습니다.
            선별을 다시 시작하면 현재 상태에 맞는 결과를 확인할 수 있습니다.
          </Text>
          <CrisisBanner />
          <View style={s.section}>
            <Text style={s.sectionTitle} accessibilityRole="header" aria-level={2}>도움받을 곳</Text>
            <ResourceList />
          </View>
          <View style={s.buttons}>
            <TouchableOpacity style={s.pBtn} onPress={() => router.replace('/')} activeOpacity={0.82}>
              <Text style={s.pBtnText}>자가 선별 시작하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.sBtn} onPress={() => router.replace('/resources')} activeOpacity={0.82}>
              <Text style={s.sBtnText}>위기 자원 보기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (acute) return null;

  const asqText = result.asq.positive
    ? '자살 관련 응답이 있었습니다. 이는 확정 진단이 아니며, 빠른 전문가 평가가 필요하다는 신호입니다.'
    : '이번 ASQ 응답에서는 양성 신호가 보고되지 않았습니다. 이 결과만으로 안전이나 다른 정신건강 어려움의 부재를 판단할 수는 없습니다.';

  function handleSave() {
    if (!storageAvailable) {
      setSaveStatus('unavailable');
      return;
    }
    const entry = buildEntry({ ...result, phq9: result.depression });
    const history = addEntry(loadHistory(), entry);
    const ok = saveHistory(history);
    setSaveStatus(ok ? 'saved' : 'failed');
  }

  return (
    <SafeAreaView style={s.container} edges={['bottom']}>
      <QuickExit />
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title} accessibilityRole="header" aria-level={1}>자가 선별 결과</Text>
        <Text style={s.subtitle}>원 도구 기반의 자가 선별 결과입니다. 진단이 아닙니다.</Text>
        {result.isYouth ? (
          <View style={s.youthBox}>
            <Text style={s.youthText}>
              청소년 사용자를 위한 안내: 힘든 일이 있다면 1388(청소년전화)에서 먼저 이야기할 수 있습니다.
            </Text>
            <TouchableOpacity
              style={s.youthCallBtn}
              onPress={() => openPhone('1388').then((opened) => setYouthCallFailed(!opened))}
              activeOpacity={0.85}
            >
              <Text style={s.youthCallText}>1388 청소년전화 연결</Text>
            </TouchableOpacity>
            {youthCallFailed ? <Text style={s.youthCallFailed} accessibilityLiveRegion="polite">통화 화면을 열지 못했습니다. 전화 앱에서 1388을 직접 눌러 주세요.</Text> : null}
          </View>
        ) : null}

        <CrisisBanner />

        <View style={[s.riskCard, { borderColor: result.risk.color, backgroundColor: `${result.risk.color}12` }]}>
          <Text style={[s.riskLabel, { color: result.risk.color }]} accessibilityRole="header" aria-level={2}>{result.risk.label}</Text>
          <Text style={s.riskAction}>{result.risk.action}</Text>
          {result.risk.reasons.map((reason) => (
            <Text key={reason} style={s.riskReason}>· {reason}</Text>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle} accessibilityRole="header" aria-level={2}>선별 점수</Text>
          <ScoreCard
            title="우울 증상"
            meta={`${result.depression.instrument} · 지난 2주`}
            score={result.depression.total}
            max={27}
            band={result.depression.band}
            extra={result.depression.deathThoughtSignal ? '문항 9(죽음·자해 생각)에 응답이 있었습니다. 이 응답은 전문가와 함께 확인하는 것이 좋습니다.' : null}
          />
          <ScoreCard
            title="불안 증상"
            meta="GAD-7 · 지난 2주"
            score={result.gad7.total}
            max={21}
            band={result.gad7.band}
          />
          <View style={s.card}>
            <Text style={s.cardTitle}>자살 위험 선별</Text>
            <Text style={s.cardMeta}>ASQ · NIMH</Text>
            <View style={[s.bandPill, { backgroundColor: result.asq.positive ? '#FFF2F2' : '#E8F5E9', marginTop: 10 }]}>
              <Text style={[s.bandText, { color: result.asq.positive ? '#C62828' : '#2E7D32' }]}>
                {result.asq.positive ? '양성 · 추가 평가 필요' : '음성'}
              </Text>
            </View>
            <Text style={s.cardDesc}>{asqText}</Text>
            <Text style={s.cardAction}>
              {result.asq.positive
                ? '오늘 안에 109 또는 1577-0199에 연락하고, 가능하면 신뢰할 수 있는 사람과 함께 있어 주세요.'
                : '힘든 날이 이어지거나 상태가 변하면 109에 연락해도 괜찮습니다.'}
            </Text>
          </View>
        </View>

        {result.impairmentLabel ? (
          <View style={s.impairmentBox}>
            <Text style={s.impairmentTitle}>일상 기능 (비채점)</Text>
            <Text style={s.impairmentText}>
              일상 기능의 어려움이 “{result.impairmentLabel}” 수준으로 보고되었습니다. 이 응답은 점수에 포함되지 않으며, 다음 행동을 안내하는 데만 참고합니다.
            </Text>
          </View>
        ) : null}

        <View style={s.section}>
          <Text style={s.sectionTitle} accessibilityRole="header" aria-level={2}>지금 할 수 있는 일</Text>
          {(RESULT_ACTIONS[result.risk.tier] || RESULT_ACTIONS.monitor).map((action) => (
            <Text key={action} style={s.actionItem}>· {action}</Text>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle} accessibilityRole="header" aria-level={2}>나를 지키는 안전 계획</Text>
          <Text style={s.sectionNote}>
            아래 항목을 떠올려 두면 힘든 순간에 도움이 됩니다. 가능하면 전문가와 함께 점검해 보세요.
          </Text>
          {SAFETY_PLAN_STEPS.map((step, index) => (
            <View key={step} style={s.stepRow}>
              <View style={s.stepNum}><Text style={s.stepNumText}>{index + 1}</Text></View>
              <Text style={s.stepText}>{step}</Text>
            </View>
          ))}
          {(() => {
            const promptMemo =
              result.risk.tier === 'urgent' || result.asq.positive || result.depression.deathThoughtSignal;
            if (!promptMemo || memoFields === null) return null;
            const savedFields = SAFETY_PLAN_FIELDS.filter((field) => memoFields[field.id]);
            if (savedFields.length > 0) {
              return (
                <View style={s.savedMemoBox}>
                  <Text style={s.savedMemoTitle}>내가 적어 둔 안전 계획 메모</Text>
                  {savedFields.map((field) => (
                    <View key={field.id} style={s.savedMemoRow}>
                      <Text style={s.savedMemoLabel}>{field.label}</Text>
                      <Text style={s.savedMemoText}>{memoFields[field.id]}</Text>
                    </View>
                  ))}
                  <Text style={s.savedMemoNote}>이 메모는 이 기기에만 저장된 내용입니다.</Text>
                </View>
              );
            }
            return (
              <View style={s.memoPromptBox}>
                <Text style={s.memoPromptText}>
                  지금 안전 계획을 적어 두면 힘든 순간에 도움이 됩니다. 아래에서 각 단계의 메모를 작성해 보세요.
                </Text>
              </View>
            );
          })()}
          <Text style={s.sectionNote}>
            각 단계에 지금 떠오르는 내용을 적어 두면 위기 순간에 도움이 됩니다. 입력한 내용은 이 기기에만 저장됩니다.
          </Text>
          <TouchableOpacity style={s.memoLinkBtn} onPress={() => router.push('/resources')} activeOpacity={0.82}>
            <Text style={s.memoLinkBtnText}>안전 계획 메모 작성하기 (선택)</Text>
          </TouchableOpacity>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle} accessibilityRole="header" aria-level={2}>도움받을 곳</Text>
          <ResourceList />
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle} accessibilityRole="header" aria-level={2}>가까운 정신건강복지센터</Text>
          <Text style={s.sectionNote}>
            거주 지역을 고른 뒤 공식 포털의 기관 검색에서 센터 연락처와 주소를 확인할 수 있습니다.
          </Text>
          <TouchableOpacity style={s.centerBtn} onPress={() => router.push('/centers')} activeOpacity={0.82}>
            <Text style={s.centerBtnText}>지역별 센터 찾기</Text>
          </TouchableOpacity>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle} accessibilityRole="header" aria-level={2}>사용한 선별검사</Text>
          <Text style={s.sourceText}>
            {result.depression.instrument}: {result.isYouth ? INSTRUMENT_META.phqa.source : INSTRUMENT_META.phq9.source}{'\n'}
            GAD-7: {INSTRUMENT_META.gad7.source}{'\n'}
            ASQ: {INSTRUMENT_META.asq.source}
          </Text>
          <Text style={s.licenseText}>
            {result.isYouth
              ? 'PHQ-A 9문항은 public domain이며, 청소년 우울 증상의 심각도 선별에 사용합니다. GAD-7은 한국어 번역과 영문 원문을 함께 제공하며, ASQ는 NIMH 공식 한국어 문항을 사용합니다.'
              : '문항은 PHQ-9(Kroenke et al., 2001)·GAD-7(Spitzer et al., 2006)의 한국어 번역과 영문 원문, ASQ(NIMH) 공식 한국어 문항을 사용합니다.'}
          </Text>
          <Text style={s.licenseText}>{KOREAN_TRANSLATION_NOTICE}</Text>
          <Text style={s.licenseText}>{SCREENING_SCOPE_NOTICE}</Text>
        </View>

        <View style={s.disclaimerBox}>
          <Text style={s.disclaimer}>{DISCLAIMER}</Text>
          <Text style={s.disclaimer}>이 앱은 응급 상황을 자동으로 감지하거나 구조를 요청하지 않습니다.</Text>
          <Text style={s.disclaimer}>{LEGAL_NOTICE}</Text>
        </View>

        {storageAvailable && (
          <View style={s.saveBox}>
            <TouchableOpacity style={s.saveBtn} onPress={handleSave} activeOpacity={0.82}>
              <Text style={s.saveBtnText}>이 결과 저장하기</Text>
            </TouchableOpacity>
            {saveStatus === 'saved' ? (
              <Text style={s.saveOk} accessibilityLiveRegion="polite">결과가 이 기기에 저장되었습니다. “나의 변화 추이”에서 확인할 수 있습니다.</Text>
            ) : saveStatus === 'failed' ? (
              <Text style={s.saveFail} accessibilityLiveRegion="polite">저장에 실패했습니다. 브라우저 저장 공간을 확인해 주세요.</Text>
            ) : saveStatus === 'unavailable' ? (
              <Text style={s.saveFail} accessibilityLiveRegion="polite">현재 환경에서는 저장 기능을 사용할 수 없습니다.</Text>
            ) : null}
            <Text style={s.saveNote}>
              저장되는 것: 날짜, 우울(PHQ-9/PHQ-A)·GAD-7 점수, ASQ 결과, 위험 수준.{'\n'}
              저장되지 않는 것: 문항별 응답, 이름·연락처 등 개인 정보.{'\n'}
              모든 데이터는 이 기기 안에만 보관됩니다.
            </Text>
          </View>
        )}

        <View style={s.buttons}>
          <TouchableOpacity
            style={s.pBtn}
            onPress={() => router.replace({ pathname: '/survey', params: { ageGroup: result.isYouth ? 'youth' : 'adult' } })}
            activeOpacity={0.82}
          >
            <Text style={s.pBtnText}>다시 검사하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.sBtn} onPress={() => router.replace('/')} activeOpacity={0.82}>
            <Text style={s.sBtnText}>처음으로</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FBFA', position: 'relative' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 14, color: '#455A64', fontWeight: '700' },
  missingTitle: { fontSize: 24, fontWeight: '800', color: '#14213D', textAlign: 'center', marginTop: 18, paddingHorizontal: 24 },
  missingText: { fontSize: 13, color: '#455A64', textAlign: 'center', marginTop: 10, marginBottom: 6, paddingHorizontal: 24, lineHeight: 20 },
  scroll: { paddingTop: 24, paddingBottom: 44 },
  title: { fontSize: 24, fontWeight: '800', color: '#14213D', textAlign: 'center', marginTop: 18 },
  subtitle: { fontSize: 13, color: '#455A64', textAlign: 'center', marginTop: 6, marginBottom: 4, paddingHorizontal: 24 },
  youthBox: { marginHorizontal: 20, marginTop: 8, backgroundColor: '#E3F2FD', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#90CAF9' },
  youthText: { fontSize: 12, color: '#0D47A1', lineHeight: 18, fontWeight: '700' },
  youthCallBtn: { marginTop: 10, backgroundColor: '#1565C0', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  youthCallText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  youthCallFailed: { marginTop: 8, color: '#8A2A00', fontSize: 12, fontWeight: '700', lineHeight: 18 },
  riskCard: { marginHorizontal: 20, marginTop: 14, borderRadius: 14, borderWidth: 1, padding: 16 },
  riskLabel: { fontSize: 17, fontWeight: '800', marginBottom: 8 },
  riskAction: { fontSize: 14, color: '#263238', lineHeight: 21, fontWeight: '700' },
  riskReason: { fontSize: 12, color: '#4B5D67', lineHeight: 18, marginTop: 5 },
  section: { marginHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#14213D', marginBottom: 10 },
  sectionNote: { fontSize: 12, color: '#455A64', lineHeight: 18, marginBottom: 10 },
  impairmentBox: { marginHorizontal: 20, marginTop: 14, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E2ECEA', padding: 14 },
  impairmentTitle: { fontSize: 14, fontWeight: '800', color: '#14213D', marginBottom: 6 },
  impairmentText: { fontSize: 12, color: '#37474F', lineHeight: 19 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2ECEA',
    padding: 15,
    marginBottom: 10,
  },
  cardHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  cardTitleWrap: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#14213D' },
  cardMeta: { fontSize: 11, color: '#546E7A', marginTop: 3 },
  scoreBadge: { flexDirection: 'row', alignItems: 'baseline', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  scoreValue: { fontSize: 22, fontWeight: '800' },
  scoreMax: { fontSize: 12, fontWeight: '700', marginLeft: 1 },
  bandPill: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginTop: 10 },
  bandText: { fontSize: 12, fontWeight: '800' },
  cardDesc: { fontSize: 13, color: '#37474F', lineHeight: 20, marginTop: 9 },
  cardAction: { fontSize: 12, color: '#2C6E63', lineHeight: 18, marginTop: 6, fontWeight: '700' },
  extra: { fontSize: 12, color: '#C62828', lineHeight: 18, marginTop: 8, fontWeight: '700' },
  cardDisclaimer: { fontSize: 11, color: '#546E7A', lineHeight: 16, marginTop: 10, fontWeight: '600' },
  actionItem: { fontSize: 13, color: '#37474F', lineHeight: 21, marginBottom: 5 },
  stepRow: { flexDirection: 'row', gap: 10, marginBottom: 9, alignItems: 'flex-start' },
  stepNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#E4F1EE', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  stepNumText: { fontSize: 11, fontWeight: '800', color: '#2C6E63' },
  stepText: { flex: 1, fontSize: 13, color: '#37474F', lineHeight: 20 },
  sourceText: { fontSize: 12, color: '#4B5D67', lineHeight: 19 },
  licenseText: { fontSize: 11, color: '#546E7A', lineHeight: 17, marginTop: 8 },
  disclaimerBox: { marginHorizontal: 20, marginTop: 22, gap: 6 },
  disclaimer: { fontSize: 11, color: '#546E7A', lineHeight: 17, textAlign: 'center' },
  saveBox: { marginHorizontal: 20, marginTop: 22, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E2ECEA', padding: 14 },
  saveBtn: { backgroundColor: '#E4F1EE', paddingVertical: 13, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#2C6E63', fontSize: 14, fontWeight: '800' },
  saveOk: { fontSize: 12, color: '#2E7D32', lineHeight: 18, marginTop: 10, fontWeight: '700' },
  saveFail: { fontSize: 12, color: '#C62828', lineHeight: 18, marginTop: 10, fontWeight: '700' },
  saveNote: { fontSize: 11, color: '#546E7A', lineHeight: 17, marginTop: 10 },
  centerBtn: { backgroundColor: '#2C6E63', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  centerBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  memoLinkBtn: { backgroundColor: '#E4F1EE', paddingVertical: 13, borderRadius: 12, alignItems: 'center', marginTop: 10, minHeight: 48, justifyContent: 'center' },
  memoLinkBtnText: { color: '#2C6E63', fontSize: 13, fontWeight: '800' },
  savedMemoBox: { backgroundColor: '#FFFDF7', borderRadius: 14, padding: 14, marginTop: 12, borderWidth: 1, borderColor: '#E2ECEA' },
  savedMemoTitle: { fontSize: 14, fontWeight: '800', color: '#14213D', marginBottom: 8 },
  savedMemoRow: { marginBottom: 8 },
  savedMemoLabel: { fontSize: 11, fontWeight: '800', color: '#7A5C00', marginBottom: 3 },
  savedMemoText: { fontSize: 13, color: '#37474F', lineHeight: 20 },
  savedMemoNote: { fontSize: 11, color: '#546E7A', marginTop: 4 },
  memoPromptBox: { backgroundColor: '#FFF8E1', borderRadius: 14, padding: 14, marginTop: 12, borderWidth: 1, borderColor: '#F3DFA2' },
  memoPromptText: { fontSize: 13, color: '#8A5A00', lineHeight: 20, fontWeight: '700' },
  buttons: { gap: 10, marginHorizontal: 20, marginTop: 22 },
  pBtn: { backgroundColor: '#2C6E63', paddingVertical: 15, borderRadius: 14, alignItems: 'center' },
  pBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  sBtn: { backgroundColor: '#DDE9E7', paddingVertical: 15, borderRadius: 14, alignItems: 'center' },
  sBtnText: { color: '#385A64', fontSize: 16, fontWeight: '700' },
});
