import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuickExit from '../components/QuickExit';
import { loadHistory, saveHistory, deleteEntry, isStorageAvailable } from '../lib/storage/adapter';

function confirmDelete(title, message, onConfirm) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: '취소', style: 'cancel' },
    { text: '삭제', style: 'destructive', onPress: onConfirm },
  ]);
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  } catch {
    return iso;
  }
}

function TierBadge({ tier }) {
  const color =
    tier === 'acute' ? '#C62828'
    : tier === 'urgent' ? '#A63D00'
    : tier === 'routine' ? '#7A5C00'
    : tier === 'monitor' ? '#33691E'
    : '#2E7D32';
  const label =
    tier === 'acute' ? '급성'
    : tier === 'urgent' ? '빠른 도움 필요'
    : tier === 'routine' ? '전문가 상담 권장'
    : tier === 'monitor' ? '관찰'
    : '낮은 수준';
  return (
    <View style={[s.badge, { backgroundColor: `${color}18` }]}>
      <Text style={[s.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

export default function History() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [available, setAvailable] = useState(false);
  const [history, setHistory] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setAvailable(isStorageAvailable());
    setHistory(loadHistory());
    setReady(true);
  }, []);

  function handleDelete(entryId) {
    confirmDelete('기록 삭제', '이 기록을 삭제할까요?', () => {
      const next = deleteEntry(history, entryId);
      if (saveHistory(next)) {
        setHistory(next);
        setStatus('deleted');
      } else {
        setStatus('failed');
      }
    });
  }

  function handleClear() {
    confirmDelete('모든 기록 삭제', '저장된 모든 결과를 삭제할까요? 이 작업은 되돌릴 수 없습니다.', () => {
      const next = { ...(history || {}), entries: [] };
      if (saveHistory(next)) {
        setHistory(next);
        setStatus('cleared');
      } else {
        setStatus('failed');
      }
    });
  }

  if (!ready) {
    return (
      <SafeAreaView style={s.container} edges={['bottom']}>
        <QuickExit />
        <View style={s.loading}>
          <Text style={s.loadingText} accessibilityLiveRegion="polite">불러오는 중…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!available) {
    return (
      <SafeAreaView style={s.container} edges={['bottom']}>
        <QuickExit />
        <ScrollView contentContainerStyle={s.empty}>
          <Text style={s.emptyTitle} accessibilityRole="header" aria-level={1}>기록 기능을 사용할 수 없습니다</Text>
          <Text style={s.emptyText}>
            현재 브라우저 환경에서는 localStorage를 사용할 수 없어 결과 저장/추이 기능을 제공하지 않습니다.
          </Text>
          <TouchableOpacity style={s.homeBtn} onPress={() => router.replace('/')} activeOpacity={0.82}>
            <Text style={s.homeText}>처음으로</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const entries = history?.entries || [];

  return (
    <SafeAreaView style={s.container} edges={['bottom']}>
      <QuickExit />
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title} accessibilityRole="header" aria-level={1}>나의 변화 추이</Text>
        <Text style={s.subtitle}>
          저장된 결과를 확인해 보세요. 이 그래프는 의학적 진단이 아닙니다.
        </Text>

        {entries.length === 0 ? (
          <View style={s.emptyBox}>
            <Text style={s.emptyTitle} accessibilityRole="header" aria-level={2}>아직 저장된 결과가 없습니다</Text>
            <Text style={s.emptyText}>
              결과 화면에서 “이 결과 저장하기”를 선택하면, 이 기기에 점수와 위험 수준만 저장됩니다.
            </Text>
          </View>
        ) : (
          <>
            <View style={s.summary}>
              <Text style={s.summaryText}>
                저장된 결과 {entries.length}건 · 최근 50건까지만 보관
              </Text>
            </View>

            <View style={s.section}>
              <Text style={s.sectionTitle} accessibilityRole="header" aria-level={2}>우울 / 불안 점수 추이</Text>
              <View style={s.chart}>
                {entries.slice(-10).map((entry, index) => (
                  <View
                    key={entry.id}
                    style={s.barRow}
                    accessibilityLabel={`${formatDate(entry.date)} 우울 ${entry.phq9.total ?? '-'}점, 불안 ${entry.gad7.total ?? '-'}점`}
                  >
                    <Text style={s.barLabel}>{formatDate(entry.date)}</Text>
                    <View style={s.barWrap}>
                      <View style={[s.bar, { width: `${Math.min(100, ((entry.phq9.total ?? 0) / 27) * 100)}%`, backgroundColor: '#2C6E63' }]} />
                      <Text style={s.barValue}>{entry.phq9.total ?? '-'}</Text>
                    </View>
                    <View style={s.barWrap}>
                      <View style={[s.bar, { width: `${Math.min(100, ((entry.gad7.total ?? 0) / 21) * 100)}%`, backgroundColor: '#1565C0' }]} />
                      <Text style={s.barValue}>{entry.gad7.total ?? '-'}</Text>
                    </View>
                  </View>
                ))}
              </View>
              <View style={s.legend}>
                <View style={s.legendItem}>
                  <View style={[s.legendDot, { backgroundColor: '#2C6E63' }]} />
                  <Text style={s.legendText}>우울</Text>
                </View>
                <View style={s.legendItem}>
                  <View style={[s.legendDot, { backgroundColor: '#1565C0' }]} />
                  <Text style={s.legendText}>GAD-7</Text>
                </View>
              </View>
            </View>

            <View style={s.section}>
              <Text style={s.sectionTitle} accessibilityRole="header" aria-level={2}>저장된 결과</Text>
              {entries.slice().reverse().map((entry) => (
                <View key={entry.id} style={s.card}>
                  <View style={s.cardHead}>
                    <Text style={s.cardDate}>{formatDate(entry.date)}</Text>
                    <TierBadge tier={entry.risk.tier} />
                  </View>
                  <View style={s.cardBody}>
                    <Text style={s.cardLine}>우울({entry.phq9.instrument || 'PHQ-9'}): {entry.phq9.total ?? '-'}/27 · {entry.phq9.bandLabel || '-'}</Text>
                    <Text style={s.cardLine}>불안(GAD-7): {entry.gad7.total ?? '-'}/21 · {entry.gad7.bandLabel || '-'}</Text>
                    <Text style={s.cardLine}>
                      자살 위험 선별(ASQ): {entry.asq.acute ? '급성' : entry.asq.positive ? '양성' : '음성'}
                    </Text>
                  </View>
                  <TouchableOpacity style={s.delBtn} onPress={() => handleDelete(entry.id)} activeOpacity={0.8}>
                    <Text style={s.delText}>이 기록 삭제</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity style={s.clearBtn} onPress={handleClear} activeOpacity={0.82}>
              <Text style={s.clearText}>모든 기록 삭제</Text>
            </TouchableOpacity>
          </>
        )}

        {status === 'deleted' || status === 'cleared' ? (
          <Text style={s.statusOk} accessibilityLiveRegion="polite">저장된 기록을 삭제했습니다.</Text>
        ) : status === 'failed' ? (
          <Text style={s.statusFail} accessibilityLiveRegion="polite">삭제에 실패했습니다. 브라우저 저장 공간을 확인해 주세요.</Text>
        ) : null}

        <View style={s.notice}>
          <Text style={s.noticeText}>
            • 저장된 정보는 이 기기 안에만 보관되며 서버로 전송되지 않습니다.{'\n'}
            • 문항별 응답은 저장되지 않고 점수/위험 수준만 저장됩니다.{'\n'}
            • 브라우저 데이터를 삭제하면 저장된 결과도 함께 삭제될 수 있습니다.{'\n'}
            • 이 추이는 의학적 진단이 아닙니다.
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
  subtitle: { fontSize: 13, color: '#455A64', lineHeight: 20, marginTop: 8 },
  summary: { marginTop: 18, backgroundColor: '#E4F1EE', borderRadius: 12, padding: 12 },
  summaryText: { fontSize: 12, color: '#2C6E63', fontWeight: '700' },
  section: { marginTop: 22 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#14213D', marginBottom: 10 },
  chart: { backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#E2ECEA', gap: 10 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { width: 70, fontSize: 11, color: '#455A64', fontWeight: '700' },
  barWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  bar: { height: 10, borderRadius: 5 },
  barValue: { width: 24, fontSize: 11, color: '#263238', fontWeight: '700', textAlign: 'right' },
  legend: { flexDirection: 'row', gap: 14, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: '#455A64' },
  card: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E2ECEA', padding: 14, marginBottom: 10 },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardDate: { fontSize: 13, fontWeight: '800', color: '#14213D' },
  cardBody: { gap: 4 },
  cardLine: { fontSize: 12, color: '#37474F', lineHeight: 18 },
  badge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: '800' },
  delBtn: { marginTop: 10, alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 },
  delText: { fontSize: 12, color: '#C62828', fontWeight: '700', textDecorationLine: 'underline' },
  clearBtn: { marginTop: 10, backgroundColor: '#FFF2F2', borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#F2B8B5' },
  clearText: { color: '#C62828', fontSize: 14, fontWeight: '800' },
  statusOk: { marginTop: 10, color: '#2E7D32', fontSize: 12, fontWeight: '700' },
  statusFail: { marginTop: 10, color: '#C62828', fontSize: 12, fontWeight: '700' },
  notice: { marginTop: 20, backgroundColor: '#FFF8E1', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#F3DFA2' },
  noticeText: { fontSize: 11, color: '#8A5A00', lineHeight: 18 },
  homeBtn: { backgroundColor: '#DDE9E7', paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 24 },
  homeText: { color: '#385A64', fontSize: 15, fontWeight: '800' },
  empty: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 44 },
  emptyBox: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E2ECEA', padding: 20, marginTop: 20 },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: '#14213D', marginBottom: 6 },
  emptyText: { fontSize: 13, color: '#455A64', lineHeight: 20 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 14, color: '#455A64', fontWeight: '700' },
});
