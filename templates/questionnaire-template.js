/**
 * 심리 설문 문항 생성 템플릿
 * 
 * 사용법:
 * 1. SKILL.md의 워크플로우에 따라 웹 리서치 수행
 * 2. 아래 템플릿을 채워 새 questionnaire 파일 생성
 * 3. npm run lint 로 검증
 * 
 * 참고 도구: [리서치한 도구 목록]
 * - BDI-II (Beck, 1996)
 * - MADRS (Montgomery & Asberg, 1979)
 * - DSM-5-TR (APA, 2022)
 */

export const DOMAINS = [
  // 도메인 정의 (id, label, icon, desc)
  // 예: { id: 'mood', label: '기분/정서', icon: '😊', desc: '...' }
];

export const QUESTIONS = [
  // 문항 정의 (id, domain, text, weight, source)
  // 
  // id:     고유 번호 (1부터 시작)
  // domain: DOMAINS의 id와 일치
  // text:   질문 내용 (구체적이고 명확하게)
  // weight: 가중치 (핵심=1.5, 위험=2.0, 일반=1.0, 경미=0.6~0.8)
  // source: 참고한 도구/문항 번호
  //
  // 예:
  // { id: 1, domain: 'mood', text: '슬프거나 우울한 기분이 들었다.', weight: 1.5, source: 'BDI-II #1' },
  // { id: 2, domain: 'mood', text: '아침에 기분이 특히 더 나빴다.', weight: 0.8, source: 'HRSD #18(일중변동)' },
];

export const OPTIONS = [
  // 응답 옵션 (value, label, short)
  // 4점 또는 5점 척도 선택 가능
  // { value: 0, label: '전혀 아니다', short: '0' },
  // { value: 1, label: '가끔 그랬다', short: '1' },
  // { value: 2, label: '자주 그랬다', short: '2' },
  // { value: 3, label: '거의 매일', short: '3' },
  // { value: 4, label: '항상 그랬다', short: '4' },  // (선택사항)
];

export const OPTION_COLORS = [
  // 옵션 개수만큼 색상 지정
  '#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336',
];

/**
 * 점수 계산 함수 (수정 필요시 변경)
 */
export function calculateResults(answers) {
  // 기본 계산 로직 (필요시 오버라이드)
  const total = answers.reduce((a, b) => a + b, 0);
  const maxRaw = QUESTIONS.reduce((s, q) => s + (OPTIONS.length - 1) * q.weight, 0);
  const pct = Math.min(100, Math.round((total / maxRaw) * 100));
  return { total, pct, maxRaw };
}

/**
 * 수준 정의 (점수 구간별)
 */
export function getLevel(pct) {
  // 예시 수준 - 연구 결과에 따라 조정
  if (pct <= 10) return { label: '정상', color: '#4CAF50', emoji: '😊' };
  if (pct <= 25) return { label: '경미', color: '#8BC34A', emoji: '🙂' };
  if (pct <= 45) return { label: '중등도', color: '#FF9800', emoji: '😟' };
  if (pct <= 70) return { label: '중증', color: '#E91E63', emoji: '😢' };
  return { label: '심각', color: '#F44336', emoji: '😔' };
}

/* ======================================
   품질 검증
   ======================================
   1. DOMAINS.length >= 3 (최소 3개 도메인)
   2. QUESTIONS.length >= 10 (최소 10문항)
   3. 모든 QUESTIONS[i].domain이 DOMAINS에 존재
   4. OPTIONS.length >= 4 (최소 4점 척도)
   5. 가중치 합계가 적절한 범위
   ====================================== */
