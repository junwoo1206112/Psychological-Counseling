import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculateReleaseScopeFingerprint } from '../lib/release-scope-fingerprint.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fingerprint = calculateReleaseScopeFingerprint(root);

console.log(`A/B/C 독립 검토 패킷\n\n배포 후보 범위 해시: ${fingerprint}\n범위: SCREENING-CONNECTION-STATIC-WEB\n\nA — 임상·심리측정\n- 선별 결과·번역 고지·문항/밴드/위기 라우팅이 진단·치료 주장으로 읽히지 않는가?\n- 현재 unofficial 한국어 번역과 영문 원문 채점 한계가 유지되는가?\n\nB — 위기·자살예방\n- 급성 신호가 결과보다 위기 안내를 우선하는가?\n- ASQ 양성의 BSSA 필요성과 앱의 비자동 구조·비자동 의뢰 한계가 명확한가?\n\nC — 구현·프라이버시·법무\n- 무백엔드·최소 로컬 저장·삭제·접근성·배포 보안 경계가 현재 후보에 맞는가?\n- 남은 법무·운영 위험과 배포 조건이 명시되었는가?\n\n기록 방법\n- 실제 독립 검토 뒤에만 docs/operations/abc-expert-review.md에 역할·단계·PASS/FAIL·비식별 외부 증빙 식별자와 위 범위 해시를 기록합니다.\n- 이 패킷 출력은 검토·승인·임상 평가를 의미하지 않습니다.`);
