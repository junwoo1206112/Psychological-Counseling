import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ResourceList from '../components/ResourceList';
import QuickExit from '../components/QuickExit';
import { openPhone } from '../components/CrisisBanner';
import { SAFETY_PLAN_STEPS } from '../data/instruments';
import { SAFETY_PLAN_FIELDS, loadSafetyPlan } from '../lib/storage/safety-plan';

export default function Crisis() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const reason = params.reason;
  const [memoFields, setMemoFields] = useState(null);
  const [callFailed, setCallFailed] = useState(false);

  useEffect(() => {
    const plan = loadSafetyPlan();
    setMemoFields(plan?.fields || {});
  }, []);

  function call(phone) {
    setCallFailed(false);
    openPhone(phone).then((opened) => {
      if (!opened) setCallFailed(true);
    });
  }

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <QuickExit />
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.alert}>지금은 설문보다 안전이 먼저입니다</Text>
        <Text style={s.title} accessibilityRole="header" aria-level={1}>지금 바로 도움을 받아 주세요.</Text>
        <Text style={s.desc}>
          혼자 있지 않아도 됩니다. 아래 번호로 연락하거나, 믿을 수 있는 사람에게 지금 상태를 알려 주세요.
        </Text>

        {reason ? (
          <View style={s.reasonBox}>
            <Text style={s.reasonText}>
              {reason === 'asq'
                ? 'ASQ 자살 위험 선별에서 현재 자살사고 응답이 확인되었습니다. 이 화면은 점수나 결과보다 안전 안내를 먼저 보여줍니다.'
                : reason === 'result'
                ? '결과 해석에서 급성 위험 수준이 확인되었습니다. 이 화면은 점수보다 안전 안내를 먼저 보여줍니다.'
                : '현재 안전 확인에서 급성 위험 신호가 확인되었습니다. 이 화면은 점수나 결과보다 안전 안내를 먼저 보여줍니다.'}
            </Text>
          </View>
        ) : null}

        <View style={s.callGrid}>
          <TouchableOpacity style={[s.callBtn, s.emergency]} onPress={() => call('119')} activeOpacity={0.85} accessibilityLabel="119 응급 구급으로 연결">
            <Text style={s.callLabel}>119</Text>
            <Text style={s.callSub}>응급 구급</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.callBtn, s.police]} onPress={() => call('112')} activeOpacity={0.85} accessibilityLabel="112 경찰로 연결">
            <Text style={s.callLabel}>112</Text>
            <Text style={s.callSub}>경찰</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.callBtn, s.mental]} onPress={() => call('109')} activeOpacity={0.85} accessibilityLabel="109 자살예방상담전화로 연결">
            <Text style={s.callLabel}>109</Text>
            <Text style={s.callSub}>24시간 상담</Text>
          </TouchableOpacity>
        </View>
        {callFailed ? <Text style={s.callFailed} accessibilityLiveRegion="polite">통화 앱을 열 수 없습니다. 직접 119, 112 또는 109로 전화해 주세요.</Text> : null}

        <View style={s.steps}>
          <Text style={s.stepsTitle}>지금 할 수 있는 일</Text>
          <Text style={s.step}>· 지금 다치거나 생명이 위험한 상황이라면 119에 연락하세요.</Text>
          <Text style={s.step}>· 즉각적인 신체 위험이 있다면 112에 연락하세요.</Text>
          <Text style={s.step}>· 109 자살예방상담전화에서 지금 바로 이야기해 보세요.</Text>
          <Text style={s.step}>· 믿을 수 있는 사람에게 연락해 곁에 있어 달라고 말하세요.</Text>
          <Text style={s.step}>· 쓸 수 있는 물건을 다른 사람에게 맡기거나 손이 닿지 않게 두세요.</Text>
          <Text style={s.step}>· 술을 피하고, 안전한 장소로 이동하세요.</Text>
        </View>

        <Text style={s.limitNote}>
          이 화면은 진단이나 자동 구조 요청 기능이 아닙니다. 지금 필요한 도움을 직접 요청해 주세요.
        </Text>

        <View style={s.section}>
          <Text style={s.sectionTitle} accessibilityRole="header" aria-level={2}>도움받을 곳</Text>
          <ResourceList />
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle} accessibilityRole="header" aria-level={2}>안전 계획</Text>
          {SAFETY_PLAN_STEPS.map((step, index) => (
            <Text key={step} style={s.planStep}>{index + 1}. {step}</Text>
          ))}
          {memoFields && SAFETY_PLAN_FIELDS.some((field) => memoFields[field.id]) ? (
            <View style={s.memoBox}>
              <Text style={s.memoTitle}>내가 적어 둔 안전 계획 메모</Text>
              {SAFETY_PLAN_FIELDS.filter((field) => memoFields[field.id]).map((field) => (
                <View key={field.id} style={s.memoRow}>
                  <Text style={s.memoLabel}>{field.label}</Text>
                  <Text style={s.memoText}>{memoFields[field.id]}</Text>
                </View>
              ))}
              <Text style={s.memoNote}>이 메모는 이 기기에만 저장된 내용입니다.</Text>
            </View>
          ) : null}
        </View>

        <TouchableOpacity style={s.homeBtn} onPress={() => router.replace('/')} activeOpacity={0.82}>
          <Text style={s.homeText}>처음으로</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F8', position: 'relative' },
  scroll: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 44 },
  alert: { fontSize: 13, fontWeight: '800', color: '#C62828', marginBottom: 8 },
  title: { fontSize: 27, fontWeight: '800', color: '#14213D', lineHeight: 36 },
  desc: { fontSize: 14, color: '#4B5D67', lineHeight: 22, marginTop: 10 },
  reasonBox: { backgroundColor: '#FFF2F2', borderRadius: 12, padding: 13, marginTop: 14, borderWidth: 1, borderColor: '#F2B8B5' },
  reasonText: { fontSize: 13, color: '#8E1B1B', lineHeight: 20, fontWeight: '700' },
  callGrid: { flexDirection: 'row', gap: 8, marginTop: 18 },
  callBtn: { flex: 1, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  emergency: { backgroundColor: '#C62828' },
  police: { backgroundColor: '#1565C0' },
  mental: { backgroundColor: '#2C6E63' },
  callLabel: { color: '#fff', fontSize: 24, fontWeight: '800' },
  callSub: { color: 'rgba(255,255,255,0.88)', fontSize: 11, fontWeight: '700', marginTop: 3 },
  callFailed: { marginTop: 9, color: '#8E1B1B', fontSize: 12, fontWeight: '700', lineHeight: 18 },
  steps: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginTop: 18, borderWidth: 1, borderColor: '#F2D6D6' },
  stepsTitle: { fontSize: 15, fontWeight: '800', color: '#14213D', marginBottom: 8 },
  step: { fontSize: 13, color: '#37474F', lineHeight: 21, marginBottom: 5 },
  limitNote: { marginTop: 14, color: '#546E7A', fontSize: 11, lineHeight: 17, textAlign: 'center' },
  section: { marginTop: 18 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#14213D', marginBottom: 9 },
  planStep: { fontSize: 12, color: '#4B5D67', lineHeight: 19, marginBottom: 5 },
  memoBox: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginTop: 12, borderWidth: 1, borderColor: '#F2D6D6' },
  memoTitle: { fontSize: 14, fontWeight: '800', color: '#14213D', marginBottom: 8 },
  memoRow: { marginBottom: 8 },
  memoLabel: { fontSize: 11, fontWeight: '800', color: '#8E1B1B', marginBottom: 3 },
  memoText: { fontSize: 13, color: '#37474F', lineHeight: 20 },
  memoNote: { fontSize: 11, color: '#546E7A', marginTop: 4 },
  homeBtn: { backgroundColor: '#DDE9E7', paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 24 },
  homeText: { color: '#385A64', fontSize: 15, fontWeight: '800' },
});
