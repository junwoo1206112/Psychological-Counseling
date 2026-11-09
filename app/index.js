import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CrisisBanner from '../components/CrisisBanner';
import QuickExit from '../components/QuickExit';
import { openPhone } from '../components/CrisisBanner';
import { saveScreeningConsent } from '../lib/consent-session';

export default function Home() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [ageGroup, setAgeGroup] = useState(null);
  const [youthCallFailed, setYouthCallFailed] = useState(false);

  const canStart = agreed && (ageGroup === 'adult' || ageGroup === 'youth');

  function startSurvey() {
    if (!saveScreeningConsent(ageGroup)) return;
    router.push({ pathname: '/survey', params: { ageGroup } });
  }

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <QuickExit />
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.mark}>마음 체크</Text>
        <Text style={s.title} accessibilityRole="header" aria-level={1}>우울·자살 위험 자가 선별</Text>
        <Text style={s.subtitle}>
          원 도구 기반의 자가 선별로 현재 상태를 확인하고,{'\n'}필요한 도움을 빠르게 찾을 수 있도록 안내합니다.
        </Text>

        <CrisisBanner />

        <View style={s.infoBox}>
          <Text style={s.infoTitle}>시작하기 전에</Text>
          <Text style={s.infoText}>
            · 약 4~5분, 25개 내외의 문항입니다.{'\n'}
            · PHQ-9/PHQ-A(우울), GAD-7(불안)은 한국어 이해 보조 번역과 영문 원문을 함께 제공합니다. 이 앱의 한국어 번역·웹 사용 방식은 임상 타당화 전입니다. ASQ(자살위험)는 NIMH 공식 한국어 문항을 사용합니다.{'\n'}
            · 답변은 서버로 전송되지 않으며 이 기기 안에서만 처리됩니다.{'\n'}
            · 이 앱은 진단이나 치료를 제공하지 않습니다.{'\n'}
            · 원하지 않으면 언제든지 중단할 수 있습니다.
          </Text>
        </View>

        <TouchableOpacity
          style={s.consentRow}
          onPress={() => setAgreed((value) => !value)}
          activeOpacity={0.8}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreed }}
        >
          <View style={[s.checkbox, agreed && s.checkboxOn]}>
            {agreed && <Text style={s.checkboxMark}>✓</Text>}
          </View>
          <Text style={s.consentText}>
            위 내용을 확인했고, 자가 선별에 동의합니다.
          </Text>
        </TouchableOpacity>

        <View style={s.ageBox}>
          <Text style={s.ageTitle}>사용자 연령대를 선택해 주세요</Text>
          <View style={s.ageRow} accessibilityRole="radiogroup" accessibilityLabel="연령대 선택">
            {[
              { key: 'adult', label: '만 18세 이상' },
              { key: 'youth', label: '만 14~17세' },
              { key: 'child', label: '만 14세 미만' },
            ].map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[s.ageBtn, ageGroup === item.key && s.ageBtnOn]}
                onPress={() => setAgeGroup(item.key)}
                activeOpacity={0.8}
                accessibilityRole="radio"
                accessibilityState={{ checked: ageGroup === item.key }}
              >
                <Text style={[s.ageText, ageGroup === item.key && s.ageTextOn]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {ageGroup === 'child' ? (
            <View style={s.ageWarn}>
              <Text style={s.ageWarnText}>
                만 14세 미만은 법정대리인 동의가 필요합니다. 보호자와 함께하거나 청소년전화 1388에 먼저 연락해 주세요.
              </Text>
              <TouchableOpacity
                style={s.youthBtn}
                onPress={() => openPhone('1388').then((opened) => setYouthCallFailed(!opened))}
                activeOpacity={0.85}
              >
                <Text style={s.youthBtnText}>1388 상담</Text>
              </TouchableOpacity>
              {youthCallFailed ? <Text style={s.callFailed} accessibilityLiveRegion="polite">통화 화면을 열지 못했습니다. 전화 앱에서 1388을 직접 눌러 주세요.</Text> : null}
            </View>
          ) : ageGroup === 'youth' ? (
            <View style={s.ageNoteBox}>
              <Text style={s.ageNote}>
                청소년용 PHQ-A 9문항을 우울 선별에 사용하며, GAD-7과 ASQ로 불안·자살 위험을 함께 확인합니다. 결과 화면에서는 1388(청소년전화)을 우선 안내합니다.
              </Text>
            </View>
          ) : null}
        </View>

        <TouchableOpacity
          style={[s.startButton, !canStart && s.startButtonOff]}
          onPress={startSurvey}
          disabled={!canStart}
          activeOpacity={0.82}
          accessibilityState={{ disabled: !canStart }}
        >
          <Text style={s.startButtonText}>자가 선별 시작하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.resourceButton}
          onPress={() => router.push('/resources')}
          activeOpacity={0.82}
        >
          <Text style={s.resourceButtonText}>도움받을 곳 먼저 보기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.historyButton}
          onPress={() => router.push('/history')}
          activeOpacity={0.82}
        >
          <Text style={s.historyButtonText}>나의 변화 추이 보기</Text>
        </TouchableOpacity>

        <Text style={s.disclaimer}>
          본 서비스는 조기 발견을 돕는 자가 선별 도구이며,{'\n'}
          의학적 진단이나 치료를 대신하지 않습니다.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF4F2', position: 'relative' },
  content: { paddingHorizontal: 22, paddingTop: 34, paddingBottom: 40, alignItems: 'center' },
  mark: { fontSize: 17, fontWeight: '800', color: '#2C6E63', marginBottom: 10 },
  title: { fontSize: 27, fontWeight: '800', color: '#14213D', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#4B5D67', fontWeight: '600', marginBottom: 18, textAlign: 'center', lineHeight: 21 },
  infoBox: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 14,
    padding: 18,
    width: '100%',
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#D5E7E3',
  },
  infoTitle: { fontSize: 15, fontWeight: '800', color: '#14213D', marginBottom: 8 },
  infoText: { fontSize: 13, color: '#263238', lineHeight: 21 },
  consentRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 16, gap: 10 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#2C6E63',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxOn: { backgroundColor: '#2C6E63' },
  checkboxMark: { color: '#fff', fontSize: 15, fontWeight: '800' },
  consentText: { flex: 1, fontSize: 13, color: '#263238', lineHeight: 19 },
  ageBox: { width: '100%', marginTop: 14, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#D5E7E3' },
  ageTitle: { fontSize: 14, fontWeight: '800', color: '#14213D', marginBottom: 10 },
  ageRow: { flexDirection: 'row', gap: 8 },
  ageBtn: { flex: 1, borderWidth: 1, borderColor: '#B0CBC6', borderRadius: 10, paddingVertical: 10, alignItems: 'center', backgroundColor: '#fff' },
  ageBtnOn: { backgroundColor: '#2C6E63', borderColor: '#2C6E63' },
  ageText: { fontSize: 12, fontWeight: '700', color: '#263238' },
  ageTextOn: { color: '#fff' },
  ageWarn: { marginTop: 10, backgroundColor: '#FFF8E1', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#F3DFA2' },
  ageWarnText: { fontSize: 12, color: '#8A5A00', lineHeight: 18 },
  ageNoteBox: { marginTop: 10, backgroundColor: '#E3F2FD', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#90CAF9' },
  ageNote: { fontSize: 12, color: '#0D47A1', lineHeight: 18, fontWeight: '700' },
  youthBtn: { marginTop: 8, backgroundColor: '#1565C0', borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  youthBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  callFailed: { marginTop: 8, color: '#8A2A00', fontSize: 12, fontWeight: '700', lineHeight: 18 },
  startButton: {
    backgroundColor: '#2C6E63',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 28,
    marginTop: 18,
    width: '100%',
    alignItems: 'center',
  },
  startButtonOff: { backgroundColor: '#A8C3BE' },
  startButtonText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  resourceButton: { marginTop: 10, paddingVertical: 12, width: '100%', alignItems: 'center' },
  resourceButtonText: { color: '#2C6E63', fontSize: 14, fontWeight: '800', textDecorationLine: 'underline' },
  historyButton: { marginTop: 6, paddingVertical: 12, width: '100%', alignItems: 'center' },
  historyButtonText: { color: '#2C6E63', fontSize: 14, fontWeight: '800', textDecorationLine: 'underline' },
  disclaimer: {
    marginTop: 18,
    fontSize: 12,
    color: '#455A64',
    textAlign: 'center',
    lineHeight: 18,
  },
});
