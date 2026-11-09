import { TouchableOpacity, Text, StyleSheet, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';

export default function QuickExit() {
  const router = useRouter();

  function exit() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.replace('https://www.google.com');
      return;
    }
    Linking.openURL('https://www.google.com').catch(() => {});
    router.replace('/');
  }

  return (
    <TouchableOpacity
      style={s.btn}
      onPress={exit}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="빠른 나가기"
      accessibilityHint="현재 화면을 닫고 외부 사이트로 이동합니다"
    >
      <Text style={s.text}>× 빠른 나가기</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  btn: {
    position: 'absolute',
    top: 8,
    right: 12,
    zIndex: 100,
    backgroundColor: '#37474F',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: { color: '#fff', fontSize: 12, fontWeight: '800' },
});
