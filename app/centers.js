import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuickExit from '../components/QuickExit';
import CrisisBanner from '../components/CrisisBanner';
import { openPhone, openUrl } from '../components/CrisisBanner';

const CITIES = [
  { code: '서울', name: '서울특별시' },
  { code: '부산', name: '부산광역시' },
  { code: '대구', name: '대구광역시' },
  { code: '인천', name: '인천광역시' },
  { code: '광주', name: '광주광역시' },
  { code: '대전', name: '대전광역시' },
  { code: '울산', name: '울산광역시' },
  { code: '세종', name: '세종특별자치시' },
  { code: '경기', name: '경기도' },
  { code: '강원', name: '강원특별자치도' },
  { code: '충북', name: '충청북도' },
  { code: '충남', name: '충청남도' },
  { code: '전북', name: '전북특별자치도' },
  { code: '전남', name: '전라남도' },
  { code: '경북', name: '경상북도' },
  { code: '경남', name: '경상남도' },
  { code: '제주', name: '제주특별자치도' },
];

const CENTER_SEARCH_URL =
  'https://www.mentalhealth.go.kr/portal/health/fac/PotalHealthFacListTab2.do?sc3=AFCS1%2CAFCS1_1%2CAFCS1_2';

function buildCenterSearchUrl() {
  return CENTER_SEARCH_URL;
}

export default function Centers() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [selected, setSelected] = useState(null);
  const [externalFailure, setExternalFailure] = useState(null);
  const cityBtnWidth = width < 360 ? '48%' : '30%';

  function openExternal(action, label) {
    setExternalFailure(null);
    action.then((opened) => {
      if (!opened) setExternalFailure(label);
    });
  }

  return (
    <SafeAreaView style={s.container} edges={['bottom']}>
      <QuickExit />
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title} accessibilityRole="header" aria-level={1}>가까운 정신건강복지센터</Text>
        <Text style={s.subtitle}>
          거주 지역을 선택한 뒤 공식 포털의 기관 검색 페이지로 이동합니다. 포털에서 같은 지역을 선택하면 센터 연락처와 주소를 볼 수 있습니다. 전화 상담이 필요하면 1577-0199로 연결할 수 있습니다.
        </Text>

        <CrisisBanner compact />

        <View style={s.section}>
          <Text style={s.sectionTitle} accessibilityRole="header" aria-level={2}>지역 선택</Text>
          <View style={s.grid}>
            {CITIES.map((city) => {
              const active = selected?.code === city.code;
              return (
                <TouchableOpacity
                  key={city.code}
                  style={[s.cityBtn, { width: cityBtnWidth }, active && s.cityBtnOn]}
                  onPress={() => setSelected(city)}
                  activeOpacity={0.8}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                >
                  <Text style={[s.cityText, active && s.cityTextOn]}>{city.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {selected ? (
          <View style={s.actionBox}>
            <Text style={s.actionTitle}>{selected.name} 정신건강복지센터 찾기</Text>
            <Text style={s.actionNote}>
              공식 포털이 열리면 지역 선택에서 “{selected.name}”을 선택해 주세요.
            </Text>
            <TouchableOpacity
              style={s.primaryBtn}
              onPress={() => openExternal(openUrl(buildCenterSearchUrl()), '공식 포털')}
              activeOpacity={0.82}
            >
              <Text style={s.primaryText}>공식 포털에서 센터 검색</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.secondaryBtn}
              onPress={() => openExternal(openPhone('1577-0199'), '1577-0199')}
              activeOpacity={0.82}
            >
              <Text style={s.secondaryText}>1577-0199 정신건강 위기상담</Text>
            </TouchableOpacity>
            {externalFailure ? (
              <Text style={s.externalFailure} accessibilityLiveRegion="polite">
                {externalFailure === '1577-0199'
                  ? '통화 화면을 열지 못했습니다. 전화 앱에서 1577-0199를 직접 눌러 주세요.'
                  : '공식 포털을 열지 못했습니다. 브라우저에서 mentalhealth.go.kr을 직접 열어 주세요.'}
              </Text>
            ) : null}
          </View>
        ) : null}

        <View style={s.notice}>
          <Text style={s.noticeTitle}>안내</Text>
          <Text style={s.noticeText}>
            · 정신건강복지센터는 지역별로 운영시간과 제공 서비스가 다를 수 있습니다.{'\n'}
            · 방문 전 전화로 운영시간과 상담 가능 여부를 확인하세요.{'\n'}
            · 긴급 위기 상황이라면 109 또는 119로 먼저 연락하세요.
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
  section: { marginTop: 22 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#14213D', marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cityBtn: {
    width: '30%',    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D5E7E3',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  cityBtnOn: { backgroundColor: '#2C6E63', borderColor: '#2C6E63' },
  cityText: { fontSize: 12, fontWeight: '700', color: '#263238' },
  cityTextOn: { color: '#fff' },
  actionBox: { marginTop: 18, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E2ECEA', padding: 16 },
  actionTitle: { fontSize: 15, fontWeight: '800', color: '#14213D', marginBottom: 6 },
  actionNote: { fontSize: 12, color: '#455A64', lineHeight: 18, marginBottom: 12 },
  primaryBtn: { backgroundColor: '#2C6E63', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  secondaryBtn: { marginTop: 10, backgroundColor: '#E4F1EE', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  secondaryText: { color: '#2C6E63', fontSize: 14, fontWeight: '800' },
  externalFailure: { marginTop: 10, color: '#8A2A00', fontSize: 12, fontWeight: '700', lineHeight: 18 },
  notice: { marginTop: 20, backgroundColor: '#FFF8E1', borderRadius: 14, padding: 15, borderWidth: 1, borderColor: '#F3DFA2' },
  noticeTitle: { fontSize: 14, fontWeight: '800', color: '#8A5A00', marginBottom: 6 },
  noticeText: { fontSize: 12, color: '#4B5D67', lineHeight: 19 },
  homeBtn: { backgroundColor: '#DDE9E7', paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 24 },
  homeText: { color: '#385A64', fontSize: 15, fontWeight: '800' },
});
