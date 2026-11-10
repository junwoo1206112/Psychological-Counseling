import { MANUAL_EVIDENCE_MAX_AGE_DAYS, REQUIRED_MANUAL_SCENARIOS } from './manual-verification.js';

export const MANUAL_SCENARIO_GUIDE = Object.freeze([
  {
    code: 'NVDA',
    environment: 'Windows + NVDA',
    steps: '인트로 동의·연령 선택, 설문 라디오, 결과/위기 화면의 제목·포커스·라이브 리전을 확인합니다.',
    pass: '핵심 제목·선택 상태·위기 CTA가 이름과 역할로 탐색되고, 포커스가 논리적으로 이동합니다.',
  },
  {
    code: 'VOICEOVER',
    environment: 'macOS 또는 iOS + VoiceOver',
    steps: '핵심 위기 동선과 결과 화면의 제어 이름·상태·순서를 확인합니다.',
    pass: '위기 번호와 결과 이동이 이름으로 탐색되고, 상태 변경이 읽힙니다.',
  },
  {
    code: 'TALKBACK',
    environment: 'Android + TalkBack',
    steps: '핵심 위기 동선과 결과 화면의 제어 이름·상태·순서를 확인합니다.',
    pass: '위기 번호와 결과 이동이 이름으로 탐색되고, 상태 변경이 읽힙니다.',
  },
  {
    code: 'VIEWPORT-320',
    environment: '320 CSS px 폭',
    steps: '인트로·설문·결과·위기·자원 화면에서 잘림·가로 스크롤·위기 CTA 접근성을 확인합니다.',
    pass: '가로 스크롤 없이 핵심 문구와 위기 CTA를 사용할 수 있습니다.',
  },
  {
    code: 'ZOOM-200',
    environment: '브라우저 200% 확대',
    steps: '인트로·설문·결과·위기 화면에서 잘림·포커스·위기 CTA 접근성을 확인합니다.',
    pass: '확대 상태에서도 핵심 문구와 위기 CTA가 잘리지 않고 사용할 수 있습니다.',
  },
  {
    code: 'PHONE-APP',
    environment: '실제 기기 + 전화 앱',
    steps: '109·119·112·1577-0199·1388 전화 링크가 전화 앱으로 넘겨지고, 실패 시 직접 번호 안내가 보이는지 확인합니다.',
    pass: '통화 화면이 열리거나, 열리지 않을 때 번호 직접 입력 안내가 표시됩니다.',
  },
  {
    code: 'OFFLINE-CRISIS',
    environment: '설치/캐시된 PWA 오프라인',
    steps: '오프라인에서 위기 안내·전화 링크가 표시되고 앱이 빈 화면으로 멈추지 않는지 확인합니다.',
    pass: '오프라인 위기 안내와 전화 링크를 사용할 수 있습니다.',
  },
]);

export function buildManualVerificationPacket(fingerprint) {
  if (typeof fingerprint !== 'string' || fingerprint.length === 0) {
    throw new TypeError('manual verification packet requires a scope fingerprint');
  }
  if (MANUAL_SCENARIO_GUIDE.length !== REQUIRED_MANUAL_SCENARIOS.length) {
    throw new Error('manual verification guide must cover every required scenario');
  }

  const lines = [
    '수동 접근성·실기기 검증 패킷',
    '',
    `배포 후보 범위 해시: ${fingerprint}`,
    '범위: SCREENING-CONNECTION-STATIC-WEB',
    `유효기간: 기록일로부터 ${MANUAL_EVIDENCE_MAX_AGE_DAYS}일`,
    '',
    `필수 시나리오 (${REQUIRED_MANUAL_SCENARIOS.length})`,
  ];

  for (const scenario of MANUAL_SCENARIO_GUIDE) {
    lines.push(`- ${scenario.code} (${scenario.environment})`);
    lines.push(`  확인: ${scenario.steps}`);
    lines.push(`  통과 기준: ${scenario.pass}`);
  }

  lines.push(
    '',
    '기록 형식',
    '| 기록 ID | 기록일 | 검증자 역할 | 환경 | 시나리오 | 결과 | 이슈/조치 식별자 |',
    '| A11Y-YYYYMMDD-설명자 | YYYY-MM-DD | 역할만 | OS·브라우저·보조기술/기기 | 위 코드 | PASS 또는 FAIL | 이슈/조치 식별자 |',
    '',
    '기록 위치: docs/operations/a11y-device-evidence.md',
    '- 실제 시험을 마친 뒤에만 PASS/FAIL과 위 범위 해시를 기록합니다.',
    '- 개인정보·설문 원문/점수·통화 상대방 정보는 기록하지 않습니다.',
    '- 이 패킷 출력은 증빙·승인·접근성 적합성 인증이 아닙니다.',
  );

  return lines.join('\n');
}
