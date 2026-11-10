export const DEPLOYMENT_VERIFICATION_SECTIONS = Object.freeze([
  {
    id: 'automated-gates',
    title: '자동 게이트 (후보 worktree)',
    items: [
      'npm ci',
      'npm run validate',
      'npm test',
      'npm run a11y',
      'npm run skill:check',
      'npm run build:web',
      'npm run test:e2e',
      'npm run security:build:check',
      'npm run release:ready (사람 증빙 없으면 BLOCKED)',
    ],
  },
  {
    id: 'github-actions',
    title: 'GitHub Actions',
    items: [
      'Browser safety regression PASS',
      'Linux deployment harness PASS',
    ],
  },
  {
    id: 'tls-headers',
    title: 'TLS·Nginx·보안 헤더',
    items: [
      'Nginx가 current/dist만 서빙하고 후보 검증 뒤 원자 전환한다',
      'HTTPS 인증서·리다이렉트가 실제 후보 도메인에서 동작한다',
      'CSP: default-src self, script-src self+hydration hash, frame-ancestors none',
      'X-Frame-Options: DENY, object-src none, form-action self',
      'manifest·service worker·offline.html이 200으로 응답하고 캐시 규칙이 no-cache다',
    ],
  },
  {
    id: 'pwa-device',
    title: 'PWA·실기기',
    items: [
      'PWA 설치 후 오프라인에서 offline.html 위기 안내가 열린다',
      '기존 탭·설치된 PWA가 새 릴리스 자산을 갱신한다',
      'iOS·Android 빌드에서 인트로·설문·위기·결과·자원 동선을 확인한다',
      '실제 전화 앱에서 109·119·112·1577-0199·1388 연결을 확인한다',
    ],
  },
  {
    id: 'rollback',
    title: '롤백·한계 기록',
    items: [
      '완료 마커와 dist/index.html이 있는 이전 릴리스만 current로 되돌린다',
      '기존 탭과 서비스 워커가 즉시 이전 자산으로 돌아가지 않는 한계를 기록한다',
      '롤백 뒤에도 기기 내 저장 데이터는 변경하지 않는다',
    ],
  },
]);

export function buildDeploymentVerificationPacket(fingerprint) {
  if (typeof fingerprint !== 'string' || fingerprint.length === 0) {
    throw new TypeError('deployment verification packet requires a scope fingerprint');
  }

  const lines = [
    '배포 후보 검증 패킷',
    '',
    `배포 후보 범위 해시: ${fingerprint}`,
    '범위: SCREENING-CONNECTION-STATIC-WEB',
    '',
  ];

  for (const section of DEPLOYMENT_VERIFICATION_SECTIONS) {
    lines.push(`${section.title}`);
    for (const item of section.items) lines.push(`- ${item}`);
    lines.push('');
  }

  lines.push(
    '기록 방법',
    '- 실제 후보 환경에서 확인한 결과만 docs/operations/atomic-static-deployment.md와 phase 기록에 남깁니다.',
    '- 이 패킷 출력은 증빙·배포 승인·접근성/법무/임상 검토가 아닙니다.',
    '- 실제 사람 증빙이 없으면 release:ready는 계속 BLOCKED입니다.',
  );

  return lines.join('\n');
}
