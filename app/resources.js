import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CrisisBanner from '../components/CrisisBanner';
import QuickExit from '../components/QuickExit';
import ResourceList from '../components/ResourceList';
import { SAFETY_PLAN_STEPS } from '../data/instruments';
import {
  SAFETY_PLAN_FIELDS,
  SAFETY_PLAN_MAX_LENGTH,
  loadSafetyPlan,
  saveSafetyPlan,
  clearSafetyPlan,
  isSafetyPlanStorageAvailable,
} from '../lib/storage/safety-plan';

function confirmDelete(onConfirm) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (window.confirm('안전 계획 메모 전체 삭제\n\n저장된 메모를 모두 삭제할까요? 이 작업은 되돌릴 수 없습니다.')) onConfirm();
    return;
  }
  Alert.alert('안전 계획 메모 전체 삭제', '저장된 메모를 모두 삭제할까요? 이 작업은 되돌릴 수 없습니다.', [
    { text: '취소', style: 'cancel' },
    { text: '삭제', style: 'destructive', onPress: onConfirm },
  ]);
}

export default function Resources() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [available, setAvailable] = useState(true);
  const [draft, setDraft] = useState({});
  const [savedCount, setSavedCount] = useState(0);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const plan = loadSafetyPlan();
    if (!isSafetyPlanStorageAvailable()) {
      setAvailable(false);
    }
    setDraft(plan?.fields || {});
    setSavedCount(plan ? Object.keys(plan.fields || {}).length : 0);
    setReady(true);
  }, []);

  function handleSave() {
    const ok = saveSafetyPlan(draft);
    if (!ok) {
      setStatus('failed');
      return;
    }
    const plan = loadSafetyPlan();
    setSavedCount(plan ? Object.keys(plan.fields || {}).length : 0);
    setStatus('saved');
  }

  function handleClear() {
    confirmDelete(() => {
      if (!clearSafetyPlan()) {
        setStatus('clearFailed');
        return;
      }
      setDraft({});
      setSavedCount(0);
      setStatus('cleared');
    });
  }

  return (
    <SafeAreaView style={s.container} edges={['bottom']}>
      <QuickExit />
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title} accessibilityRole="header" aria-level={1}>도움받을 곳</Text>
        <Text style={s.subtitle}>
          지금 힘들다면 아래 번호로 바로 연락할 수 있습니다. 전화가 부담되면 믿을 수 있는 사람에게 먼저 알려 주세요.
        </Text>

        <CrisisBanner />

        <View style={s.section}>
          <Text style={s.sectionTitle} accessibilityRole="header" aria-level={2}>전화·기관 안내</Text>
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
          <Text style={s.sectionTitle} accessibilityRole="header" aria-level={2}>안전 계획 6단계</Text>
          <Text style={s.sectionNote}>
            가능하면 전문가와 함께 점검해 보세요. 이 계획은 위험한 순간에 혼자 대처하지 않도록 돕습니다.
          </Text>
          {SAFETY_PLAN_STEPS.map((step, index) => (
            <View key={step} style={s.stepRow}>
              <View style={s.stepNum}><Text style={s.stepNumText}>{index + 1}</Text></View>
              <Text style={s.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {ready && available ? (
          <View style={s.section}>
            <Text style={s.sectionTitle} accessibilityRole="header" aria-level={2}>나의 안전 계획 메모 (선택)</Text>
            <Text style={s.sectionNote}>
              각 단계에 지금 떠오르는 내용을 적어 두면 위기 순간에 도움이 됩니다. 입력한 내용은 이 기기에만 저장되며
              서버로 전송되지 않습니다. 완성된 안전 계획은 전문가와 함께 점검해 보세요.
            </Text>
            {SAFETY_PLAN_FIELDS.map((field) => (
              <View key={field.id} style={s.memoField}>
                <Text style={s.memoLabel}>{field.label}</Text>
                <TextInput
                  style={s.memoInput}
                  value={draft[field.id] || ''}
                  onChangeText={(text) => setDraft((prev) => ({ ...prev, [field.id]: text.slice(0, SAFETY_PLAN_MAX_LENGTH) }))}
                  placeholder="비워 두어도 괜찮습니다"
                  placeholderTextColor="#90A4AE"
                  multiline
                  accessibilityLabel={field.label}
                  maxLength={SAFETY_PLAN_MAX_LENGTH}
                />
                <Text style={s.memoCount}>{(draft[field.id] || '').length} / {SAFETY_PLAN_MAX_LENGTH}</Text>
              </View>
            ))}
            <View style={s.memoButtons}>
              <TouchableOpacity style={s.saveBtn} onPress={handleSave} activeOpacity={0.82}>
                <Text style={s.saveBtnText}>메모 저장하기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.clearBtn, savedCount === 0 && s.clearBtnOff]}
                onPress={handleClear}
                disabled={savedCount === 0}
                activeOpacity={0.82}
                accessibilityState={{ disabled: savedCount === 0 }}
              >
                <Text style={s.clearBtnText}>전체 삭제</Text>
              </TouchableOpacity>
            </View>
            {status === 'saved' ? (
              <Text style={s.statusOk} accessibilityLiveRegion="polite">
                이 기기에 저장되었습니다{savedCount > 0 ? ` (${savedCount}개 단계)` : ''}. 위기 화면에서 다시 확인할 수 있습니다.
              </Text>
            ) : status === 'failed' ? (
              <Text style={s.statusFail} accessibilityLiveRegion="polite">저장에 실패했습니다. 브라우저 저장 공간을 확인해 주세요.</Text>
            ) : status === 'cleared' ? (
              <Text style={s.statusOk} accessibilityLiveRegion="polite">저장된 메모를 모두 삭제했습니다.</Text>
            ) : status === 'clearFailed' ? (
              <Text style={s.statusFail} accessibilityLiveRegion="polite">삭제에 실패했습니다. 브라우저 저장 공간을 확인해 주세요.</Text>
            ) : null}
          </View>
        ) : ready && !available ? (
          <View style={s.section}>
            <Text style={s.sectionTitle} accessibilityRole="header" aria-level={2}>나의 안전 계획 메모 (선택)</Text>
            <Text style={s.sectionNote}>
              현재 브라우저 환경에서는 저장 기능을 사용할 수 없어 메모를 작성할 수 없습니다.
            </Text>
          </View>
        ) : null}

        <View style={s.noteBox}>
          <Text style={s.noteTitle}>기억해 주세요</Text>
          <Text style={s.note}>
            이 앱은 응급 상황을 자동으로 감지하거나 구조를 요청하지 않습니다.{'\n'}
            자살 관련 생각은 혼자 감당하지 않아도 됩니다. 109는 24시간 상담을 제공합니다.{'\n'}
            만 18세 미만이라면 청소년전화 1388을 이용할 수 있습니다.
          </Text>
        </View>

        <TouchableOpacity style={s.homeBtn} onPress={() => router.replace('/')} activeOpacity={0.82}>
          <Text style={s.homeText}>처음으로</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FBFA', position: 'relative' },
  scroll: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 44 },
  title: { fontSize: 24, fontWeight: '800', color: '#14213D' },
  subtitle: { fontSize: 13, color: '#4B5D67', lineHeight: 20, marginTop: 8 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#14213D', marginBottom: 9 },
  sectionNote: { fontSize: 12, color: '#455A64', lineHeight: 18, marginBottom: 10 },
  stepRow: { flexDirection: 'row', gap: 10, marginBottom: 9, alignItems: 'flex-start' },
  stepNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#E4F1EE', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  stepNumText: { fontSize: 11, fontWeight: '800', color: '#2C6E63' },
  stepText: { flex: 1, fontSize: 13, color: '#37474F', lineHeight: 20 },
  memoField: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2ECEA', padding: 12, marginBottom: 10 },
  memoLabel: { fontSize: 13, fontWeight: '800', color: '#14213D', marginBottom: 6 },
  memoInput: {
    borderWidth: 1,
    borderColor: '#D5E7E3',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#263238',
    minHeight: 72,
    textAlignVertical: 'top',
    backgroundColor: '#FAFDFC',
  },
  memoCount: { fontSize: 11, color: '#546E7A', textAlign: 'right', marginTop: 4 },
  memoButtons: { flexDirection: 'row', gap: 10, marginTop: 4 },
  saveBtn: { flex: 1, backgroundColor: '#2C6E63', paddingVertical: 14, borderRadius: 12, alignItems: 'center', minHeight: 48, justifyContent: 'center' },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  clearBtn: { flex: 1, backgroundColor: '#FFF2F2', borderWidth: 1, borderColor: '#F2B8B5', paddingVertical: 14, borderRadius: 12, alignItems: 'center', minHeight: 48, justifyContent: 'center' },
  clearBtnOff: { opacity: 0.5 },
  clearBtnText: { color: '#C62828', fontSize: 14, fontWeight: '800' },
  statusOk: { fontSize: 12, color: '#2E7D32', lineHeight: 18, marginTop: 10, fontWeight: '700' },
  statusFail: { fontSize: 12, color: '#C62828', lineHeight: 18, marginTop: 10, fontWeight: '700' },
  noteBox: { backgroundColor: '#FFF8E1', borderRadius: 14, padding: 15, marginTop: 20, borderWidth: 1, borderColor: '#F3DFA2' },
  noteTitle: { fontSize: 14, fontWeight: '800', color: '#8A5A00', marginBottom: 6 },
  note: { fontSize: 12, color: '#4B5D67', lineHeight: 19 },
  homeBtn: { backgroundColor: '#DDE9E7', paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 24 },
  homeText: { color: '#385A64', fontSize: 15, fontWeight: '800' },
  centerBtn: { backgroundColor: '#2C6E63', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  centerBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
