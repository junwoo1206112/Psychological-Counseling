import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CRISIS_RESOURCES, RESOURCE_VERIFIED_AT } from '../data/instruments';
import { openPhone, openUrl } from './CrisisBanner';

export default function ResourceList({ showVerify = true }) {
  const [failed, setFailed] = useState(null);
  function open(resource) {
    setFailed(null);
    const action = resource.phone ? openPhone(resource.phone) : openUrl(resource.url);
    action.then((opened) => {
      if (!opened) setFailed(resource.id);
    });
  }
  return (
    <View style={s.wrap}>
      {CRISIS_RESOURCES.map((resource) => (
        <View key={resource.id} style={[s.row, resource.primary && s.primaryRow]}>
          <View style={s.info}>
            <Text style={s.label}>{resource.label}</Text>
            <Text style={s.meta}>
              {resource.phone ? `${resource.phone} · ${resource.hours}` : resource.hours}
            </Text>
            <Text style={s.desc}>{resource.description}</Text>
          </View>
          {resource.phone ? (
            <View style={s.actions}>
              <TouchableOpacity
                style={s.action}
                onPress={() => open(resource)}
                activeOpacity={0.82}
                accessibilityLabel={`${resource.phone}로 전화 연결`}
              >
                <Text style={s.actionText}>통화</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.secondaryAction}
                onPress={() => openUrl(resource.url).then((opened) => { if (!opened) setFailed(resource); })}
                activeOpacity={0.82}
                accessibilityLabel={`${resource.label} 공식 안내 열기`}
              >
                <Text style={s.secondaryActionText}>공식 안내</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={s.action}
              onPress={() => open(resource)}
              activeOpacity={0.82}
              accessibilityLabel={`${resource.label} 웹사이트 열기`}
            >
              <Text style={s.actionText}>열기</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      {failed ? <Text style={s.failure} accessibilityLiveRegion="polite">연결을 열 수 없습니다. {failed.phone ? `${failed.phone}로 직접 전화하거나 ` : ''}{failed.url} 주소를 직접 이용해 주세요.</Text> : null}
      {showVerify && (
        <Text style={s.verify}>전화번호·운영시간 최종 확인: {RESOURCE_VERIFIED_AT}</Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2ECEA',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  primaryRow: { borderColor: '#F2B8B5', backgroundColor: '#FFF8F8' },
  info: { flex: 1 },
  label: { fontSize: 14, fontWeight: '800', color: '#14213D' },
  meta: { fontSize: 12, fontWeight: '700', color: '#C62828', marginTop: 2 },
  desc: { fontSize: 12, color: '#5B6B73', marginTop: 2, lineHeight: 17 },
  action: {
    backgroundColor: '#C62828',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 13,
  },
  actionText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  actions: { gap: 6, alignItems: 'flex-end' },
  secondaryAction: { borderWidth: 1, borderColor: '#C62828', borderRadius: 10, paddingVertical: 7, paddingHorizontal: 9 },
  secondaryActionText: { color: '#C62828', fontSize: 11, fontWeight: '800' },
  verify: { fontSize: 11, color: '#546E7A', marginTop: 4, textAlign: 'right' },
  failure: { fontSize: 12, color: '#8E1B1B', fontWeight: '700', lineHeight: 18 },
});
