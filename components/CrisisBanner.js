import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';

export function openPhone(phone) {
  if (!phone) return Promise.resolve(false);
  return Linking.openURL(`tel:${phone}`).then(() => true).catch(() => false);
}

export function openUrl(url) {
  if (!url) return Promise.resolve(false);
  return Linking.openURL(url).then(() => true).catch(() => false);
}

export default function CrisisBanner({ compact = false }) {
  const [linkFailed, setLinkFailed] = useState(false);
  function call(phone) {
    setLinkFailed(false);
    openPhone(phone).then((opened) => {
      if (!opened) setLinkFailed(true);
    });
  }
  return (
    <View style={[s.wrap, compact && s.compactWrap]}>
      <Text style={[s.title, compact && s.compactTitle]}>
        지금 많이 힘드신가요? 혼자 견디지 않아도 됩니다.
      </Text>
      <Text style={s.sub}>24시간 자살예방 상담 109 · 긴급 상황 119 · 112</Text>
      <View style={s.buttons}>
        <TouchableOpacity style={s.primary} onPress={() => call('109')} activeOpacity={0.85} accessibilityLabel="109 자살예방상담전화로 연결">
          <Text style={s.primaryText}>109와 통화</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.secondary} onPress={() => call('119')} activeOpacity={0.85} accessibilityLabel="119 응급 구급으로 연결">
          <Text style={s.secondaryText}>119 응급</Text>
        </TouchableOpacity>
      </View>
      {linkFailed ? <Text style={s.failure} accessibilityLiveRegion="polite">통화 앱을 열 수 없습니다. 직접 109 또는 119로 전화해 주세요.</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    backgroundColor: '#FFF4F4',
    borderWidth: 1,
    borderColor: '#F2B8B5',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 12,
  },
  compactWrap: { padding: 12, marginHorizontal: 16, marginTop: 8 },
  title: { fontSize: 14, fontWeight: '800', color: '#8E1B1B', lineHeight: 20 },
  compactTitle: { fontSize: 13 },
  sub: { fontSize: 12, color: '#7A3B3B', marginTop: 4, lineHeight: 18 },
  buttons: { flexDirection: 'row', gap: 8, marginTop: 10 },
  primary: {
    backgroundColor: '#C62828',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  primaryText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  secondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#C62828',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  secondaryText: { color: '#C62828', fontSize: 13, fontWeight: '800' },
  failure: { marginTop: 8, color: '#8E1B1B', fontSize: 12, fontWeight: '700', lineHeight: 18 },
});
