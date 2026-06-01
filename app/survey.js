import { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QUESTIONS, OPTIONS, OPTION_COLORS, DOMAINS } from '../data/questionnaire';

export default function Survey() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(1));

  const total = QUESTIONS.length;
  const question = QUESTIONS[step];
  const domain = DOMAINS.find((item) => item.id === question?.domain);
  const isCore = question?.weight > 1;

  const handleSelect = useCallback((value) => {
    const next = [...answers];
    next[step] = value;

    Animated.timing(fadeAnim, {
      toValue: 0.35,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      if (step + 1 >= total) {
        router.push({ pathname: '/result', params: { score: JSON.stringify(next) } });
        return;
      }
      setAnswers(next);
      setStep(step + 1);
      Animated.timing(fadeAnim, { toValue: 1, duration: 160, useNativeDriver: true }).start();
    });
  }, [answers, fadeAnim, router, step, total]);

  if (!question) return null;

  return (
    <SafeAreaView style={s.container} edges={['bottom']}>
      <View style={s.progressWrap}>
        <View style={s.progressBg}>
          <View style={[s.progressFill, { width: `${((step + 1) / total) * 100}%` }]} />
        </View>
        <Text style={s.progressText}>{step + 1} / {total}</Text>
      </View>

      <Animated.View style={[s.area, { opacity: fadeAnim }]}>
        <View style={s.domainBadge}>
          <Text style={s.domainIcon}>{domain?.icon}</Text>
          <Text style={s.domainLabel}>{domain?.label}</Text>
          {isCore && <Text style={s.coreBadge}>핵심</Text>}
        </View>

        <Text style={s.qNum}>Q{question.id}</Text>
        <Text style={s.qText}>{question.text}</Text>
        <Text style={s.guide}>지난 2주 동안 얼마나 자주 경험했나요?</Text>

        <View style={s.options}>
          {OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={option.value}
              style={[
                s.optBtn,
                { borderColor: OPTION_COLORS[index] },
                answers[step] === option.value && { backgroundColor: OPTION_COLORS[index] },
              ]}
              onPress={() => handleSelect(option.value)}
              activeOpacity={0.76}
            >
              <Text style={[
                s.optLabel,
                answers[step] === option.value && s.optSel,
              ]}
              >
                {option.label}
              </Text>
              <Text style={[
                s.optShort,
                answers[step] === option.value && s.optShortSel,
              ]}
              >
                {option.short}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FBFA' },
  progressWrap: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  progressBg: { height: 6, backgroundColor: '#DDE9E7', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#2C6E63', borderRadius: 3 },
  progressText: { textAlign: 'right', color: '#2C6E63', fontSize: 13, fontWeight: '700', marginTop: 6 },
  area: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  domainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E4F1EE',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 16,
    gap: 6,
  },
  domainIcon: { fontSize: 16 },
  domainLabel: { fontSize: 13, fontWeight: '700', color: '#2C6E63' },
  coreBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    backgroundColor: '#C62828',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  qNum: { fontSize: 18, fontWeight: '800', color: '#2C6E63', marginBottom: 8 },
  qText: { fontSize: 20, fontWeight: '800', color: '#14213D', lineHeight: 30, marginBottom: 12 },
  guide: { fontSize: 13, color: '#607D8B', marginBottom: 22 },
  options: { gap: 10 },
  optBtn: {
    borderWidth: 2,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optLabel: { fontSize: 15, fontWeight: '700', color: '#263238' },
  optShort: { fontSize: 13, color: '#78909C', fontWeight: '700' },
  optSel: { color: '#fff' },
  optShortSel: { color: 'rgba(255,255,255,0.78)' },
});
