import { useMemo, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import {
  calculateResults, getLevel, getDomainAdvice, DOMAINS, getSubtypeIndicators,
} from '../data/questionnaire';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const R = 85;
const STROKE = 15;
const SIZE = R * 2 + STROKE * 2;
const CX = R + STROKE;
const CY = R + STROKE;
const CIRCUM = 2 * Math.PI * R;

const DSM_LABELS = {
  depressed_mood: '우울 기분',
  anhedonia: '흥미 저하',
  appetite: '식욕 변화',
  sleep: '수면 변화',
  fatigue: '피로',
  psychomotor: '정신운동 변화',
  worthlessness: '무가치감/죄책감',
  concentration: '집중/결정 어려움',
  suicide: '죽음/자해 사고',
};

export default function Result() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dashAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const answers = useMemo(() => {
    try {
      const parsed = JSON.parse(params.score || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [params.score]);

  const result = useMemo(() => calculateResults(answers), [answers]);
  const level = useMemo(() => getLevel(result.pct), [result.pct]);
  const subtypes = useMemo(() => getSubtypeIndicators(answers), [answers]);

  const animatedDash = dashAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [CIRCUM, 0],
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(dashAnim, {
        toValue: result.pct,
        duration: 1400,
        delay: 250,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 42,
        friction: 6,
        delay: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [dashAnim, result.pct, scaleAnim]);

  const domainBars = useMemo(() => DOMAINS.map((domain) => {
    const score = result.domainScores[domain.id];
    const advice = getDomainAdvice(domain.id);
    const isGood = score.pct <= 30;
    return {
      ...domain,
      ...score,
      advice: isGood ? advice.good : advice.bad,
      isGood,
    };
  }), [result.domainScores]);

  const dsm = result.dsm || { hasCore: false, otherMet: 0, totalMet: 0, likelyMDD: false };

  return (
    <SafeAreaView style={s.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.header}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
            <Svg width={SIZE} height={SIZE}>
              <Circle cx={CX} cy={CY} r={R} stroke="#DDE9E7" strokeWidth={STROKE} fill="none" />
              <AnimatedCircle
                cx={CX}
                cy={CY}
                r={R}
                stroke={level.color}
                strokeWidth={STROKE}
                strokeDasharray={CIRCUM}
                strokeDashoffset={animatedDash}
                strokeLinecap="round"
                transform={`rotate(-90 ${CX} ${CY})`}
              />
            </Svg>
            <View style={s.centerText}>
              <Text style={[s.pct, { color: level.color }]}>{result.pct}%</Text>
              <Text style={s.sub}>가중 점수</Text>
            </View>
          </Animated.View>

          <Animated.View style={{ opacity: dashAnim.interpolate({ inputRange: [0, 100], outputRange: [0, 1] }) }}>
            <View style={[s.badge, { backgroundColor: `${level.color}18` }]}>
              <Text style={s.emoji}>{level.emoji}</Text>
              <Text style={[s.lvl, { color: level.color }]}>{level.label}</Text>
            </View>
            <Text style={s.desc}>{level.desc}</Text>
          </Animated.View>
        </View>

        {dsm.totalMet > 0 && (
          <View style={[s.dsmBox, dsm.likelyMDD ? s.dsmCritical : s.dsmInfo]}>
            <Text style={s.dsmTitle}>
              {dsm.likelyMDD ? 'DSM-5 주요 우울 기준 충족 가능성' : 'DSM-5 기준 참고'}
            </Text>
            <Text style={s.dsmText}>
              {dsm.likelyMDD
                ? `핵심 증상과 ${dsm.totalMet}개 기준이 함께 나타났습니다. 이 결과는 진단이 아니며, 전문가 상담을 권장합니다.`
                : `핵심 증상 ${dsm.hasCore ? '충족' : '미충족'}, 전체 ${dsm.totalMet}/9개 기준이 표시되었습니다.`}
            </Text>
            <View style={s.dsmGrid}>
              {(dsm.results || []).map((item) => (
                <View key={item.criterion} style={s.dsmItem}>
                  <Text style={[s.dsmDot, { color: item.met ? '#C62828' : '#2E7D32' }]}>
                    {item.met ? '●' : '○'}
                  </Text>
                  <Text style={s.dsmLabel}>{DSM_LABELS[item.criterion] || item.criterion}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {subtypes.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>세부 양상</Text>
            {subtypes.map((subtype) => (
              <View key={subtype.label} style={s.subtypeBox}>
                <Text style={s.subtypeLabel}>{subtype.label}</Text>
                <Text style={s.subtypeDesc}>{subtype.desc}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={s.section}>
          <Text style={s.sectionTitle}>영역별 분석</Text>
          {domainBars.map((domain) => (
            <View key={domain.id} style={s.domainRow}>
              <View style={s.dh}>
                <Text style={s.dIcon}>{domain.icon}</Text>
                <Text style={s.dName}>{domain.label}</Text>
                <Text style={[s.dScore, { color: domain.isGood ? '#2E7D32' : '#EF6C00' }]}>
                  {domain.pct}%
                </Text>
              </View>
              <View style={s.barBg}>
                <View
                  style={[
                    s.barFill,
                    {
                      width: `${domain.pct}%`,
                      backgroundColor: domain.isGood ? '#2E7D32' : '#EF6C00',
                    },
                  ]}
                />
              </View>
              <Text style={s.advice}>{domain.advice}</Text>
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>맞춤 권장사항</Text>
          {dsm.likelyMDD || result.pct > 70 ? (
            <View style={s.tips}>
              <Text style={s.tip}>지금 느끼는 감정을 혼자 감당하려 하지 말고 가까운 사람에게 알려주세요.</Text>
              <Text style={s.tip}>자해나 자살 생각이 있다면 즉시 119, 112 또는 자살예방상담전화 109에 연락하세요.</Text>
              <Text style={s.tip}>가능하면 빠른 시일 내 정신건강의학과 또는 상담 전문가와 연결하세요.</Text>
            </View>
          ) : result.pct <= 25 ? (
            <View style={s.tips}>
              <Text style={s.tip}>규칙적인 수면, 식사, 가벼운 움직임을 유지해보세요.</Text>
              <Text style={s.tip}>하루 5분 정도 감정 기록을 남기면 변화 흐름을 보기 쉽습니다.</Text>
              <Text style={s.tip}>즐거웠던 활동을 아주 작은 단위로 다시 시도해보세요.</Text>
            </View>
          ) : (
            <View style={s.tips}>
              <Text style={s.tip}>가까운 사람에게 현재 상태를 구체적으로 이야기해보세요.</Text>
              <Text style={s.tip}>하루 계획을 작게 나누고 완료 가능한 한 가지부터 시작하세요.</Text>
              <Text style={s.tip}>증상이 2주 이상 지속되거나 생활에 영향을 준다면 전문가 상담을 고려하세요.</Text>
            </View>
          )}
        </View>

        <View style={s.buttons}>
          <TouchableOpacity style={s.pBtn} onPress={() => router.replace('/survey')} activeOpacity={0.82}>
            <Text style={s.pBtnText}>다시 진단하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.sBtn} onPress={() => router.replace('/')} activeOpacity={0.82}>
            <Text style={s.sBtnText}>처음으로</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.disclaimer}>
          이 결과는 포트폴리오용 선별 정보이며 의료적 진단이 아닙니다.{'\n'}
          위기 상황이라면 즉시 주변 사람, 응급기관, 전문기관에 도움을 요청하세요.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FBFA' },
  scroll: { paddingBottom: 40 },
  header: { alignItems: 'center', paddingHorizontal: 28, paddingTop: 20, paddingBottom: 8 },
  centerText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pct: { fontSize: 34, fontWeight: '800' },
  sub: { fontSize: 12, color: '#607D8B', marginTop: 2, fontWeight: '700' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginTop: 14,
    marginBottom: 8,
  },
  emoji: { fontSize: 20, marginRight: 6 },
  lvl: { fontSize: 17, fontWeight: '800' },
  desc: { fontSize: 13, color: '#4B5D67', textAlign: 'center', lineHeight: 20, marginBottom: 8 },
  dsmBox: { marginHorizontal: 20, borderRadius: 12, padding: 16, marginTop: 8 },
  dsmInfo: { backgroundColor: '#E4F1EE' },
  dsmCritical: { backgroundColor: '#FFF2F2', borderWidth: 1, borderColor: '#C62828' },
  dsmTitle: { fontSize: 14, fontWeight: '800', color: '#14213D', marginBottom: 8 },
  dsmText: { fontSize: 13, color: '#4B5D67', lineHeight: 19, marginBottom: 12 },
  dsmGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dsmItem: { flexDirection: 'row', alignItems: 'center', width: '47%', gap: 4 },
  dsmDot: { fontSize: 10 },
  dsmLabel: { fontSize: 11, color: '#607D8B' },
  section: { marginHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#14213D', marginBottom: 12 },
  domainRow: { marginBottom: 14 },
  dh: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  dIcon: { fontSize: 14, marginRight: 6 },
  dName: { flex: 1, fontSize: 13, fontWeight: '700', color: '#263238' },
  dScore: { fontSize: 13, fontWeight: '800' },
  barBg: { height: 7, backgroundColor: '#DDE9E7', borderRadius: 4, overflow: 'hidden', marginBottom: 5 },
  barFill: { height: '100%', borderRadius: 4 },
  advice: { fontSize: 12, color: '#607D8B', lineHeight: 17 },
  tips: { gap: 7 },
  tip: { fontSize: 13, color: '#4B5D67', lineHeight: 20 },
  buttons: { gap: 10, marginHorizontal: 20, marginTop: 24 },
  pBtn: { backgroundColor: '#2C6E63', paddingVertical: 15, borderRadius: 14, alignItems: 'center' },
  pBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  sBtn: { backgroundColor: '#DDE9E7', paddingVertical: 15, borderRadius: 14, alignItems: 'center' },
  sBtnText: { color: '#385A64', fontSize: 16, fontWeight: '700' },
  disclaimer: {
    marginHorizontal: 20,
    marginTop: 20,
    fontSize: 11,
    color: '#78909C',
    textAlign: 'center',
    lineHeight: 16,
  },
  subtypeBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#F9A825',
  },
  subtypeLabel: { fontSize: 14, fontWeight: '800', color: '#8A5A00', marginBottom: 4 },
  subtypeDesc: { fontSize: 12, color: '#4B5D67', lineHeight: 17 },
});
