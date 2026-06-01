import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.mark}>마음 체크</Text>
        <Text style={styles.title}>AI 심리상담 자가진단</Text>
        <Text style={styles.subtitle}>우울 신호를 조용히 점검하는 포트폴리오 웹 앱</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            DSM-5 주요 기준과 여러 우울 평가 척도의 구조를 참고해{'\n'}
            10개 영역, 50개 문항으로 현재 상태를 살펴봅니다.{'\n\n'}
            결과는 진단이 아닌 자기 이해를 위한 참고 자료입니다.{'\n'}
            위험 신호가 높다면 전문가 상담을 권장합니다.{'\n\n'}
            예상 소요 시간: 약 10분
          </Text>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push('/survey')}
          activeOpacity={0.82}
        >
          <Text style={styles.startButtonText}>진단 시작하기</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          본 서비스는 포트폴리오용 심리 선별 도구이며 의료 진단을 대체하지 않습니다.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF4F2' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  mark: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2C6E63',
    marginBottom: 14,
  },
  title: {
    fontSize: 29,
    fontWeight: '800',
    color: '#14213D',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#4B5D67',
    fontWeight: '600',
    marginBottom: 34,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 12,
    padding: 22,
    width: '100%',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#D5E7E3',
  },
  infoText: {
    fontSize: 14,
    color: '#263238',
    lineHeight: 22,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#2C6E63',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 28,
    elevation: 4,
    shadowColor: '#2C6E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  disclaimer: {
    marginTop: 28,
    fontSize: 12,
    color: '#607D8B',
    textAlign: 'center',
    lineHeight: 18,
  },
});
