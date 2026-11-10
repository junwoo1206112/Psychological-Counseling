# Ouroboros Seed — 마음 체크 유지·개선

> 생성: 2026-11-02
> 방식: Ouroboros interview Path C (Local A/B/C Expert Mode)
> 상태: 승인됨 (프로젝트 유지, 전면 재작성 안 함)

## Goal

우울·자살 위험 **선별 + 전문가 연결**이라는 목적을 유지하면서, 한국어 사용성·안전 라우팅·접근성·배포/라이선스·프라이버시를 강화한다. Ouroboros 인터뷰 스킬을 프로젝트에 고정 적용해 다음 변경도 같은 페이즈 절차로 진행한다.

## Non-goals

- AI 심리상담 챗봇, 자동 진단, 치료 권고.
- 50문항·임의 가중치·복합 위험 점수·ML 위험 예측.
- 서버 저장, 계정, 분석 SDK, 응답 로그.
- 검증되지 않은 자체 문항 추가.
- 프로젝트 전면 삭제·재작성.

## Constraints

- 검증된 도구만 사용: PHQ-9, PHQ-A, GAD-7, ASQ.
- 급성 위험은 결과보다 `/crisis` 우선.
- 한국어 문항은 이해 보조 번역, 채점은 영문 원문 기준.
- `잘 모르겠어요`는 안전 확인·ASQ에서 양성.
- 진단·치료·예방 효능 표현 금지.
- 민감정보 최소화, 로컬 저장은 opt-in.
- 배포 전 법무 게이트(`docs/legal-review-checklist.md`) 통과.
- 접근성 WCAG 2.2 AA 기본, 실제 스크린리더 수동 테스트는 별도.

## Acceptance Criteria

- [x] AC1. Ouroboros interview 스킬이 `.opencode/skills/ouroboros-interview/`에 존재하고 `name: ouroboros-interview`로 로드된다.
- [x] AC2. `/ouroboros-interview` 명령과 `AGENTS.md` 워크플로가 존재한다.
- [x] AC3. `docs/ouroboros/seed.md`와 `phase-log.md`가 존재한다.
- [x] AC4. Phase 0~6 기록이 phase-log에 있다.
- [x] AC5. 한국어/영문 문항 토글과 번역 고지가 설문·결과에 있다.
- [x] AC6. 청소년 “다시 검사하기”가 ageGroup을 유지한다.
- [x] AC7. `LICENSE`가 프로젝트 MIT이고 `THIRD_PARTY_NOTICES.md`가 있다.
- [x] AC8. Nginx가 정적 라우트·SW/manifest no-cache·보안 헤더를 제공한다.
- [x] AC9. 민감 경로(`/survey`, `/result`, `/history`, `/crisis`)가 robots.txt에서 제외된다.
- [x] AC10. `npm.cmd run validate`, `npm.cmd test`, `npm.cmd run a11y`, `npm.cmd run skill:check`, `npm.cmd run build:web`가 통과한다.
- [x] AC11. 모든 계기 메타에 `version`, `contentHash`, `translationStatus`, `translationVersion`, `translationHash`가 있다.
- [x] AC12. 문항 해시가 실제 문항과 일치하고, 문항 변경에 민감하다는 테스트가 있다.
- [x] AC13. 한국어 타당화 계획서(`docs/validation/korean-instrument-validation-plan.md`)가 있다.
- [x] AC14. 한국어 번역은 `unofficial`, ASQ는 `official-nimh`로 상태가 구분된다.
- [x] AC15. README·AGENTS·법무 체크리스트가 타당화 계획서와 연결된다.

### Cycle 3 — 릴리스 안전성 (2026-11-04)

- [x] AC16. 결과 데이터는 URL 쿼리 문자열로 전달되지 않는다. 점수·밴드·위험 수준 요약만 세션(메모리/sessionStorage)에 저장한다.
- [x] AC17. `/result` 직접 접근·세션 만료·손상된 요약에서는 “결과를 불러올 수 없습니다” 가드를 보여주며, 응답을 추정해 낮은 위험으로 표시하지 않는다.
- [x] AC18. 세션 요약이 급성이면 결과 화면 대신 `/crisis`로 우선 이동한다.
- [x] AC19. PWA manifest의 192·512·maskable 아이콘과 apple-touch-icon이 `public/`에 존재하고 빌드 산출물 `dist/`에 포함된다.
- [x] AC20. 지역 센터 검색은 실제 동작하는 공식 포털 위치기반 검색(`PotalHealthFacListTab2.do?sc3=...`)을 사용하고, 동작하지 않는 `searchKeyword` 자동 검색을 약속하지 않는다.
- [x] AC21. `npm test`와 `npm run a11y`가 위 항목을 회귀 검사한다.

### Cycle 4 — 안전 계획 개인 메모 (2026-11-04)

- [x] AC22. 안전 계획 화면에서 6단계별 메모를 선택적으로 작성·저장할 수 있다(opt-in, 이 기기에만 저장).
- [x] AC23. 저장된 메모는 언제든 전체 삭제할 수 있고, 저장 값은 500자로 제한되며 스키마가 검증된다.
- [x] AC24. “전문가와 함께 점검해 보세요” 문구가 고정 유지되고, 자동 공유·서버 전송 기능이 존재하지 않는다.
- [x] AC25. 메모 입력 UI에 접근성 라벨이 있고, 결과 화면에서 안전 계획 메모 작성으로 이어지는 연결이 있다.
- [x] AC26. 지역 센터 안내 문구가 모든 화면에서 “공식 포털에서 검색”으로 일치한다.
- [x] AC27. `npm validate/test/a11y/build:web`이 통과하고 safety-plan 회귀 테스트가 있다.
- [x] AC28. 위기 화면에서 저장된 안전 계획 메모를 다시 확인할 수 있다(읽기 전용).

### Cycle 5 — 위험 신호 시 메모 노출·접근성 마무리 (2026-11-04)

- [x] AC29. 위험 신호(urgent 이상, ASQ 양성, PHQ-9 문항 9 응답)가 있으면 결과 화면에 저장된 안전 계획 메모가 즉시 노출되고, 저장된 메모가 없으면 작성 안내가 표시된다.
- [x] AC30. 지역 선택 그리드가 360px 미만 화면에서 2열로 확장되어 긴 지역명이 잘리지 않는다.
- [x] AC31. 추이 차트 각 행에 날짜·우울·불안 점수 접근성 라벨이 제공된다(WCAG 1.1.1).
- [x] AC32. service worker가 PWA 아이콘을 사전 캐시하고 캐시 이름이 갱신된다.
- [x] AC33. 위 항목이 `npm test`와 `npm run a11y` 회귀 검사로 고정된다.

### Cycle 6 — 비채점 고민 탐색·안전 경로 보완 (2026-11-06)

- [x] AC34. 설문 전 정형 고민 탐색 질문은 선택·비채점이며, 척도 점수·위험 수준·저장 데이터에 영향을 주지 않는다.
- [x] AC35. PHQ-9/PHQ-A 문항 9의 비영 응답은 `low` 결과로 종결되지 않고, ASQ 음성은 안전 또는 다른 정신질환 부재를 뜻하지 않는다는 안내가 표시된다.
- [x] AC36. localStorage/sessionStorage 접근이 예외를 던져도 위기·결과 안내가 렌더되고, 저장 기능만 사용할 수 없다고 표시된다.
- [x] AC37. 직접 `/survey` 접근에서는 동의와 허용 연령대를 확인하도록 시작 화면으로 보낸다.
- [x] AC38. 세션 결과는 점수 범위·급성 일관성을 검증하고, 원 문항 응답 대신 필요한 안전 플래그만 최소 저장한다.
- [x] AC39. 안전 계획·결과 추이의 삭제가 실패하면 성공으로 표시하지 않는다.
- [x] AC40. 위기 연락 연결 실패 시 사용자에게 알리고, 위기 화면에는 자동 구조·진단 기능의 한계가 표시된다.
- [x] AC41. `npm.cmd run validate`, `npm.cmd test`, `npm.cmd run a11y`, `npm.cmd run skill:check`, `npm.cmd run build:web`이 통과한다.

### Cycle 9 — 연결 실패·저장 복원력·배포 게이트 (2026-11-06)

- [x] AC42. 현재 안전 확인의 ‘계획’ 질문은 현재/당일의 급성 위험을 묻는 시간 범위를 명시하며, 과거 계획만으로 급성으로 처리하지 않는다.
- [x] AC43. 1388·1577-0199 등 화면별 직접 통화 버튼도 연결 실패 시 번호를 직접 확인하도록 안내하고, 성공으로 가장하지 않는다.
- [x] AC44. 로컬 추이 기록은 컨테이너뿐 아니라 각 항목의 날짜·점수 범위·불리언·위험 티어를 검증하며, 손상 항목은 화면에 렌더하지 않는다.
- [x] AC45. 배포 스크립트는 빌드 전에 `validate`, `test`, `a11y`, `skill:check`을 모두 통과시킨다.
- [x] AC46. AC42~AC45의 회귀 테스트와 전체 검증 명령이 통과한다.

### Cycle 10 — 탭 동의 게이트 복원력 (2026-11-06)

- [x] AC47. 설문 진입은 URL의 `consent` 값이 아니라 이 탭에서 기록한 최소 동의·연령 상태를 확인한다.
- [x] AC48. 동의 상태는 연령대 외 식별자·응답을 포함하지 않고 탭 종료 후 소멸하는 sessionStorage(또는 저장소 차단 시 메모리)에만 보관한다.
- [x] AC49. 직접 `/survey` 접근 또는 연령 불일치 시 시작 화면으로 이동하되, 위기 자원 화면은 계속 직접 접근 가능하다.
- [x] AC50. 동의 게이트와 저장소 차단 fallback이 회귀 테스트로 고정되고, 전체 검증 명령이 통과한다.

### Cycle 11 — Phase 6 릴리스 준비도 게이트 (2026-11-06)

- [x] AC51. 수동 접근성·실기기·오프라인/통화 검증의 실제 수행 증빙을 기록할 체크리스트가 있고, 미수행 상태가 명확히 드러난다.
- [x] AC52. 한국어 타당화와 법무·임상 운영 증빙이 완료되기 전 `release:ready`가 배포 준비를 차단하고 구체적 미완료 사유를 출력한다.
- [x] AC53. 배포 스크립트는 자동 검사 뒤 `release:ready`를 실행하므로, 코드 검사만 통과한 상태에서는 배포가 진행되지 않는다.
- [x] AC54. 법무 체크리스트의 디지털의료제품법 시행일 표기가 식약처 공식 안내와 일치하도록 정정되고, 자동 품질 검증은 계속 통과한다.

### Cycle 12 — 위기 자원 최신성 게이트 (2026-11-06)

- [x] AC55. 위기 자원 데이터는 검증일·최대 유효기간·공식 검증 근거를 명시하고, 109/119/112/1577-0199/1388의 필수 자원·번호·HTTPS URL을 정적 검증한다.
- [x] AC56. 검증일이 90일을 초과하거나 미래 날짜이거나 형식이 잘못되면 `resources:check`가 실패한다.
- [x] AC57. 배포 스크립트가 자원 최신성 검사를 실행하고, 회귀 테스트 및 전체 자동 검증이 통과한다.

### Cycle 13 — Phase 0 공식 자원 재검증 (2026-11-06)

- [x] AC58. 109·119·112·1577-0199·1388·지역 정신건강복지센터의 공식 웹 근거를 재검토하고, 검증일·방법·제한을 문서화한다.
- [x] AC59. 자원 검증일은 공식 웹 재검토 날짜로만 갱신하며, 실제 전화·기기 검증 미수행 상태를 릴리스 수동 증빙에서 유지한다.

### Cycle 14 — Phase 1 임상 후속연결 운영 게이트 (2026-11-06)

- [x] AC60. ASQ 양성·급성 신호 후의 앱 한계, 임상가 BSSA 필요성, 109의 동의 기반 지역 연계를 명시한 운영 프로토콜 템플릿이 있다.
- [x] AC61. 운영 책임·대체 인력·훈련·후속 시간 기준·데이터 동의·장애/사고 대응의 실제 증빙이 체크되기 전 `release:ready`가 차단된다.
- [x] AC62. 앱은 자동 의뢰·자동 구조·BSSA 수행을 주장하거나 구현하지 않으며, 전체 자동 검증이 통과한다.

### Cycle 15 — Phase 2 A/B/C 독립 검토 게이트 (2026-11-06)

- [x] AC63. A(임상·심리측정), B(위기·자살예방), C(구현·프라이버시·법무) 근거·합의·충돌·비목표를 구분한 교차검증 기록이 있다.
- [x] AC64. 실제 독립 검토자의 임상·위기·법무/보안 의견이 각각 증빙되기 전 `release:ready`가 배포를 차단한다.
- [x] AC65. 교차검증은 앱의 선별·연결 한계를 유지하고, 자동 진단·치료·자동 구조·무동의 데이터 전달을 추가하지 않는다.

### Cycle 16 — Phase 3 수동 접근성·실기기 증빙 레지스트리 (2026-11-06)

- [x] AC66. 수동 접근성·실기기 검증은 시나리오별 기록 ID·날짜·역할·환경·결과·조치 식별자를 요구하고, 개인정보·설문 응답을 기록하지 않는 레지스트리로 관리한다.
- [x] AC67. NVDA·VoiceOver·TalkBack·320px·200%·실제 전화 앱·오프라인 위기 안내의 누락, 최근 실패, 180일 경과 기록은 `release:ready`를 차단한다.
- [x] AC68. 자동 검사는 실제 수동 검증 또는 접근성 적합성 판정을 대체하지 않으며, 기록 템플릿만으로 배포 가능 상태가 되지 않는다.

### Cycle 17 — Phase 4 한국어 타당화 증빙 레지스트리 (2026-11-06)

- [x] AC69. PHQ-9·PHQ-A·GAD-7 및 비채점 기능손상 문항의 한국어 타당화 증빙은 연구 참여자 정보 없이 단계·범위·날짜·결과·증빙 식별자를 기록하는 별도 레지스트리로 관리한다.
- [x] AC70. 거버넌스, 번역 대조, 인지면담, 파일럿, 본조사, 분석, 독립 임상 승인, 앱 반영의 유효한 최신 PASS 기록이 모두 없으면 `release:ready`가 배포를 차단한다.
- [x] AC71. ASQ 공식 한국어판, 위기 우선 라우팅, 현재 `unofficial` 상태와 영문 원문 채점은 실제 타당화·승인·코드 검토 전까지 변경하지 않는다.

### Cycle 18 — Phase 5 법무·규제 증빙 레지스트리 (2026-11-06)

- [x] AC72. 제품 분류, 주장 문구, 프라이버시, 도구 라이선스, 위기 운영, 배포 승인별 법무·규제 검토 증빙은 개인식별정보 없이 단계·날짜·역할·결과·증빙 식별자로 관리한다.
- [x] AC73. 필수 검토의 누락·최근 실패·90일 경과 또는 현재 배포 후보 범위 해시 불일치는 `release:ready`를 차단한다.
- [x] AC74. 레지스트리는 법률 자문·식약처 분류·허가·개인정보 적법성의 자동 판정을 주장하지 않고, 선별+연결·무백엔드·위기 우선의 현재 범위를 유지한다.

### Cycle 19 — Phase 6 임상 후속연결 운영 증빙 레지스트리 (2026-11-06)

- [x] AC75. 임상 후속연결의 책임, BSSA 훈련, 급성/비급성 경로, 동의/데이터, 장애/사고 대응, 운영 승인은 개인·환자 정보 없이 단계별 증빙으로 관리한다.
- [x] AC76. 필수 단계의 누락·최근 실패·90일 경과 또는 현재 앱/운영 프로토콜 범위 해시 불일치는 `release:ready`를 차단한다.
- [x] AC77. 구현은 NIMH의 선별 뒤 훈련된 임상가 BSSA 원칙과 109의 본인 동의 기반 연계 원칙을 문서화하되, 앱 내 BSSA·자동 의뢰·자동 구조·무동의 전송을 추가하지 않는다.

### Cycle 20 — 개인정보·네트워크 경계 정적 감사 (2026-11-06)

- [x] AC78. 앱 코드에서 자동 `fetch`/XHR/WebSocket/sendBeacon, 분석·크래시 SDK, 응답 콘솔 로그를 정적 검사로 차단한다.
- [x] AC79. 서비스 워커는 동일 출처 정적 자산/오프라인 위기 안내 캐시로만 제한되고, 분석·응답 전송·주기적 동기화를 추가하지 않는다.
- [x] AC80. `privacy:check`은 배포 준비도 검사에 포함되고, 전화·공식 자원 링크처럼 사용자가 명시적으로 여는 외부 연결은 계속 허용한다.

### Cycle 21 — 기기 내 저장 경계 감사 (2026-11-06)

- [x] AC81. `localStorage`·`sessionStorage` 쓰기는 동의, 결과 요약, 추이 요약, 선택 안전계획의 선언된 네 모듈로만 제한한다.
- [x] AC82. 각 저장 경계의 저장소 종류·키·허용 데이터·보관 기간과 원본 설문 응답/자동 외부 전송 금지를 문서화한다.
- [x] AC83. `storage:check`은 배포 준비도 검사에 포함되고, 선언되지 않은 저장 writer는 자동 검사에서 실패한다.

### Cycle 22 — 정적 웹 CSP 배포 경계 (2026-11-06)

- [x] AC84. 배포 Nginx 구성은 동일 출처 스크립트·연결·워커·매니페스트만 허용하고, 객체 삽입·외부 프레임·외부 폼 제출을 차단하는 CSP를 모든 응답에 보낸다.
- [x] AC85. 앱 고유의 인라인 부트스트랩 코드와 스타일을 정적 자산으로 분리하고, Expo hydration에 필요한 단일 인라인 스크립트만 SHA-256 해시로 허용한다.
- [x] AC86. `security:check`은 CSP와 정적 자산 분리의 회귀를 검사하고 배포 준비도 검사에 포함한다.

### Cycle 23 — PWA 정적 위기 자산 사전 캐시 (2026-11-06)

- [x] AC87. 오프라인 위기 안내, 매니페스트·아이콘, 정적 부트스트랩·접근성 CSS는 서비스 워커 설치 시 동일 출처 캐시에 명시적으로 포함한다.
- [x] AC88. 서비스 워커 캐시는 GET 정적 자산과 오프라인 안내로만 제한하고, 설문 응답·브라우저 저장소·외부 URL·백그라운드 동기화를 포함하지 않는다.
- [x] AC89. `pwa:check`은 사전 캐시 필수 자산·동일 출처·GET 경계의 회귀를 검사하고 배포 준비도에 포함한다.

### Cycle 24 — 빌드 산출물 CSP 해시 검증 (2026-11-06)

- [x] AC90. Expo 정적 빌드의 유일한 inline hydration 스크립트 SHA-256이 Nginx CSP의 `script-src` 해시와 일치하지 않으면 배포 준비도를 실패시킨다.
- [x] AC91. 산출물에 예기치 않은 추가 inline script가 있거나 CSP용 정적 부트스트랩·스타일 자산이 빠지면 실패시킨다.
- [x] AC92. `security:build:check`은 `build:web` 뒤 배포 준비도 검사에 포함되며, 실제 TLS·브라우저·기기 동작은 수동 게이트로 유지한다.

### Cycle 25 — 위기 화면 iframe 차단 (2026-11-06)

- [x] AC93. 앱은 iframe 임베드를 지원하지 않으며, Nginx는 `X-Frame-Options: DENY`와 CSP `frame-ancestors 'none'`으로 동일·외부 출처 frame embedding을 모두 차단한다.
- [x] AC94. `security:check`은 약한 `SAMEORIGIN`/`frame-ancestors 'self'` 회귀를 실패시키고, 위기 자원·사용자 개시 외부 링크에는 영향을 주지 않는다.

### Cycle 26 — P0 증빙·배포 게이트 무결성 (2026-11-06)

- [x] AC95. 수동 접근성, 한국어 타당화, 법무·규제, 임상 후속연결 증빙은 실제 달력 날짜만 허용하고 미래 날짜 및 같은 날짜의 `FAIL` 기록을 배포 차단 사유로 처리한다.
- [x] AC96. A/B/C 독립 검토는 체크박스가 아닌 역할별 외부 증빙 식별자·현재 배포 범위 해시·90일 유효기간을 가진 레지스트리로 검증되며, 실제 검토 품질이나 승인 사실은 자동 판정하지 않는다.
- [x] AC97. 배포 스크립트는 격리된 후보에서 P0 `release:ready`를 실행하고, 미완료된 사람 검증이 `current` 링크를 바꾸기 전에 공개 전환을 중단한다.

### Cycle 27 — P1 원자적 정적 배포 후보 격리 (2026-11-06)

- [x] AC98. 배포 후보는 라이브 경로와 분리된 Git worktree에서 의존성 설치·정적 빌드·전체 게이트를 완료하며, 실패한 후보는 현재 서비스되는 위기 안내 정적 자산을 변경하지 않는다.
- [x] AC99. Nginx는 릴리스 저장소의 `current` 심볼릭 링크만 서빙하고, 후보 통과 뒤 임시 링크의 원자적 rename으로 같은 후보의 `dist`만 공개한다.
- [x] AC100. 롤백 스크립트는 지정한 검증된 과거 릴리스의 `dist/index.html`만 `current`로 원자적으로 되돌리며, 사용자 기기 내 저장 데이터·원본 소스·다른 경로를 변경하지 않는다.
- [x] AC101. Linux 모의 배포 검증은 실제 Git worktree·잠금·심볼릭 링크를 사용해 후보 검사 실패, 성공, 롤백, 경로 탈출 거부 시 활성 위기 정적 자산이 보존되는지 확인하며, 실제 서버/임상 증빙을 대체하지 않는다.

### Cycle 29 — Phase 1 수동 접근성 증빙 범위 결합 (2026-11-06)

- [x] AC102. 수동 접근성·실기기 증빙은 현재 접근성·위기·오프라인 관련 배포 범위 해시와 일치해야 하며, 화면·자산 변경 뒤 이전 PASS 기록만으로는 배포 준비도를 통과할 수 없다.

### Cycle 30 — Phase 2 독립 A/B/C 검토 패킷 (2026-11-06)

- [x] AC103. `abc:packet`은 현재 후보 범위 해시, A/B/C 역할별 검토 질문, 비식별 증빙 기록 방법과 실제 승인 아님 고지를 출력해 실제 독립 검토를 지원하며, 증빙 미기록 상태의 배포 차단을 유지한다.

### Cycle 31 — 선별 정책 평가 시나리오 (2026-11-06)

- [x] AC104. `assessment:evaluate`는 비식별·합성 입력만으로 낮음/관찰/긴급/급성 및 손상 입력 시나리오의 위험 티어·화면 경로·도구 선택을 결정적으로 검증하고, 이를 임상 성능 또는 진단 정확도 검증으로 주장하지 않는다.

### Cycle 32 — 브라우저 위기 경로 회귀 검사 (2026-11-06)

- [x] AC105. 합성 입력만 사용하는 Chromium 브라우저 회귀 검사는 설문 최초 화면의 뒤로가기 경계, 동의 없는 직접 진입, 현재 안전·ASQ Q5 급성 신호의 `/crisis` 우선 및 결과 비노출을 실제 정적 웹 빌드에서 검증한다. 이 검사는 임상 타당화·실제 전화 연결·전문가 승인·수동 보조기술 검증을 대체하지 않는다.

### Cycle 33 — 마감 전 방어적 입력·배포 헤더 검토 (2026-11-07)

- [x] AC106. 결과 생성은 허용된 연령대와 각 척도의 실제 연속 정수 응답만 수용하며, 결과 세션은 렌더 가능한 위험 구조와 모순되지 않는 ASQ 위험 조합만 수용한다.
- [x] AC107. 실제 정적 웹 브라우저 검사는 도움 우선 자원 이동과 ASQ Q5의 이전 경계를 포함하고, PWA 특수 파일의 캐시 규칙은 상위 보안 헤더 상속을 끊지 않는다.

### Cycle 34 — 배포 후보 E2E 게이트·TLS 보호 (2026-11-07)

- [x] AC108. 배포 후보 검증이 정적 빌드 대상 Playwright E2E(`npm run test:e2e`)를 포함하고, E2E 실패 시 현재 릴리스가 변경되지 않는다(하니스 시나리오로 고정).
- [x] AC109. Playwright chromium 설치는 root에서 `--with-deps`로, root가 아니면 일반 설치로 동작한다.
- [x] AC110. 초기 설정 스크립트 재실행 시 기존(certbot TLS 적용 등) Nginx 구성을 자동 덮어쓰지 않는다. 교체는 `FORCE_CONF_OVERWRITE=1` 명시 시에만 타임스탬프 백업 후 수행한다.
- [x] AC111. Expo 58 major 업그레이드는 이번 사이클 비목표로, 별도 Seed에서 호환성·롤백·위기 경로 회귀를 검토한다.
- [x] AC112. AC108~AC110이 `npm test` 회귀 검사로 고정되고 기존 전체 검증 명령이 통과한다.

### Cycle 35 — Expo 58 프레임워크 업그레이드 (2026-11-09)

- [x] AC113. Expo SDK 58.0.23·React Native 0.88.1·React 19.3.0·Expo Router 58.0.30·react-native-web 0.21.4로 정렬되고 `expo install --check`가 통과한다.
- [x] AC114. SDK 58+ 정적 렌더링에서 `app/+html.js`가 `useServerDocumentContext()`의 `headNodes`/`bodyNodes`를 렌더해 실제 `dist/*.html`에 앱 JS 번들이 포함된다.
- [x] AC115. `security:build:check`가 정적 HTML의 앱 JS 번들 누락을 배포 전 실패시키고, `npm test` 회귀 검사로 고정된다.
- [x] AC116. 업그레이드 뒤에도 `validate`, `test`, `a11y`, `security:check`, `security:build:check`, `pwa:check`, `build:web`, `test:e2e`가 모두 통과한다.
- [x] AC117. production 의존성 감사에서 critical/high가 0으로 줄고, 남은 moderate는 Expo CLI 전이 도구로 기록된다.
- [x] AC118. Expo 58 업그레이드는 문항·채점·위험 라우팅·위기 우선·무백엔드 경계를 변경하지 않으며, 실제 iOS/Android·실기기·TLS/PWA 기존 탭 검증은 수동 게이트로 유지한다.

### Cycle 36 — 공개 저장소 커밋·푸시 안전성 (2026-11-09)

- [x] AC119. 공개 저장소 커밋에는 비밀키·토큰·개인정보·로컬 도구 체크아웃(`ouroboros/`, `Codex_AI_스킬/`)이 포함되지 않는다.
- [x] AC120. 문서의 로컬 절대 경로·Windows 사용자명을 일반 경로 표기로 바꾸고, `.gitignore`에 로컬 도구 디렉터리를 추가한다.
- [x] AC121. 전체 자동 검증을 통과한 뒤 `master`에 커밋하고 `origin`에 푸시하며, `release:ready`의 P0 사람 증빙 차단은 유지한다.

### Cycle 37 — 정상 완료·저장 경계 E2E (2026-11-09)

- [x] AC122. 성인 정상 완료(안전 음성 → PHQ-9 0점 → 기능손상 없음 → GAD-7 0점 → ASQ 음성)가 `/crisis`를 거치지 않고 결과 화면과 선별 점수·ASQ 음성을 표시한다.
- [x] AC123. 결과 세션(`sessionStorage`)은 점수·밴드·위험 요약만 포함하고, 원본 문항 응답·안전 확인·고민 탐색 답변을 저장하지 않는다.
- [x] AC124. 결과 저장은 opt-in이며, `localStorage` 기록은 점수·밴드 ID·ASQ·위험 수준만 저장한다. 전체 삭제 후 목록이 비어도 삭제 성공 안내가 유지된다.

### Cycle 38 — Ouroboros 기록 추적 복구 (2026-11-09)

- [x] AC125. `.gitignore`의 로컬 도구 제외 패턴은 루트 기준(`/ouroboros/`)으로 고정되어 `docs/ouroboros/seed.md`·`phase-log.md`를 무시하지 않는다.
- [x] AC126. `docs/ouroboros` 기록에서 로컬 Windows 사용자명·절대 경로 표기를 제거한다.

### Cycle 39 — 청소년·저장소 차단 E2E (2026-11-09)

- [x] AC127. 만 14~17세 정상 완료는 결과 화면에서 `PHQ-A · 지난 2주`, 1388 청소년전화 안내를 표시하고 세션 요약의 `isYouth`·`depression.instrument`가 PHQ-A로 기록된다.
- [x] AC128. `localStorage` getter가 차단되어도 선별 결과가 렌더되고, 저장 버튼 없이 기록 화면이 “기록 기능을 사용할 수 없습니다”를 표시한다.
- [x] AC129. `sessionStorage` getter가 차단되어도 같은 탭에서 동의·선별·결과가 메모리 fallback으로 동작하고 `localStorage` 저장 버튼은 유지된다.

### Cycle 40 — 저장·삭제 실패 E2E (2026-11-09)

- [x] AC130. `localStorage.setItem`이 예외를 던지면 결과 저장은 실패 안내를 표시하고, “저장되었습니다” 문구와 기록을 남기지 않는다.
- [x] AC131. 기록 삭제 시 `setItem`이 실패하면 삭제 성공으로 표시하지 않고, 기존 기록을 그대로 보존한다.

### Cycle 41 — 만 14세 미만 연령 게이트 E2E (2026-11-09)

- [x] AC132. 만 14세 미만 선택 시 법정대리인 동의 안내와 1388 상담이 표시되고, 자가 선별 시작 버튼은 비활성화된다.
- [x] AC133. `/survey?ageGroup=child` 직접 진입은 시작 화면으로 되돌아가며 선별 문항을 노출하지 않는다.

### Cycle 42 — 안전계획 메모 실패 E2E (2026-11-09)

- [x] AC134. 안전계획 메모 저장 시 `localStorage.setItem`이 실패하면 실패 안내를 표시하고, “저장되었습니다” 문구와 저장 값을 남기지 않는다.
- [x] AC135. 안전계획 메모 전체 삭제 시 `removeItem`이 실패하면 삭제 성공으로 표시하지 않고, 기존 메모를 그대로 보존한다.

### Cycle 43 — 청소년 재검사 ageGroup 유지 E2E (2026-11-09)

- [x] AC136. 청소년 결과 화면의 “다시 검사하기”는 `ageGroup=youth`로 진입하고, 같은 탭 동의를 유지한 채 안전 확인 후 PHQ-A 단계로 복귀한다.

### Cycle 44 — 권장 순서 일괄 실행·CI 하네스 수정 (2026-11-09)

- [x] AC137. `deploy/tests/release-harness.sh`의 `expect_failure`는 예상 실패를 성공으로 반환하고, `set -e` 때문에 exit 42로 종료되지 않는다.
- [x] AC138. Cycle 37~43 변경(E2E 13건·기록 삭제 안내·`docs/ouroboros` 복구)이 `702d106`으로 푸시되고 Browser safety CI가 통과한다.
- [x] AC139. Linux deployment harness가 GitHub Actions에서 통과하며, Phase 1·2·3·4·5의 실제 사람 증빙과 `release:ready` 차단은 자동 검증으로 대체하지 않는다.

### Cycle 45 — 수동 검증 패킷 CLI (2026-11-09)

- [x] AC140. `manual:packet`은 현재 배포 범위 해시, 7개 필수 시나리오, 시나리오별 확인 항목·통과 기준, 비식별 기록 형식을 출력한다.
- [x] AC141. 패킷은 실제 시험 전 준비 자료이며 증빙·승인·접근성 적합성 인증이 아니라는 고지와 개인정보·설문 응답 기록 금지를 고정한다.
- [x] AC142. 패킷은 범위 해시 없이 생성되지 않고, `manual:check`의 실제 증빙 차단을 해제하지 않는다.

### Cycle 46 — 320px 레이아웃·위기 hydration E2E (2026-11-09)

- [x] AC143. 320px에서 인트로·설문 첫 화면·위기·자원·센터·결과 가드 화면이 가로 스크롤 없이 렌더되고, 위기 CTA가 화면 안에 배치된다.
- [x] AC144. `/crisis?reason=safety` 직접 진입의 React hydration #418을 제거하고, 320px 위기 화면이 pageerror 없이 렌더된다.

### Cycle 47 — 안전계획 메모 위기 화면 E2E (2026-11-09)

- [x] AC145. `/resources`에서 저장한 안전계획 메모가 `/crisis`에서 읽기 전용으로 다시 표시되고, 기기 내 저장 고지가 유지된다.
- [x] AC146. 안전계획 메모를 전체 삭제하면 위기 화면에서도 메모와 제목이 사라진다.

### Cycle 48 — 위험 신호 결과 메모 노출 E2E (2026-11-09)

- [x] AC147. PHQ-9 문항 9 비영 응답으로 urgent 결과가 나오면, 저장된 안전계획 메모가 결과 화면에 즉시 읽기 전용으로 노출된다.
- [x] AC148. 위험 신호 결과에 저장된 메모가 없으면 결과 화면에 안전계획 메모 작성 안내가 표시된다.

### Cycle 49 — 남은 페이즈 일괄 실행 (2026-11-09)

- [x] AC149. Cycle 45~48 변경이 `afaa28f`로 푸시되고 Browser safety·Linux deployment harness CI가 모두 통과한다.
- [x] AC150. `manual:packet`·`abc:packet`이 현재 범위 해시 `bbb427a5`를 출력하며, 패킷은 증빙·승인이 아님을 유지한다.
- [x] AC151. Phase 1·2·3·4·5의 실제 사람·기관 증빙이 없는 상태에서 각 evidence check와 `release:ready`는 계속 BLOCKED이며, 자동 검증으로 대체하지 않는다.

### Cycle 50 — PHQ-9 한국어/영문 토글 E2E (2026-11-09)

- [x] AC152. PHQ-9 첫 문항에서 한국어 문항과 번역 고지가 표시되고, “영문 원문 보기” → “한국어로 보기” 토글이 문항을 정확히 전환한다.

### Cycle 51 — 추이 라벨·단건 삭제 E2E (2026-11-09)

- [x] AC153. 저장된 추이 차트 행은 날짜·우울 점수·불안 점수를 포함한 접근성 라벨을 제공한다.
- [x] AC154. 기록 한 건 삭제는 확인 후 목록에서 제거되고, 빈 상태와 삭제 성공 안내가 유지되며 저장소에도 남지 않는다.

### Cycle 52 — 오프라인 PWA 위기 안내 E2E (2026-11-09)

- [x] AC155. 서비스 워커가 제어하는 상태에서 오프라인 탐색을 시도하면 `/offline.html`의 “오프라인 안내”와 109·119 위기 링크가 표시된다.

### Cycle 53 — 기능손상 urgent E2E (2026-11-09)

- [x] AC156. PHQ-9·GAD-7이 0점이어도 기능손상 “많이 어려웠다” 응답은 urgent 결과로 안내되고, 우울·불안 점수에는 포함되지 않는다.

### Cycle 54 — 지역 센터 공식 포털 E2E (2026-11-09)

- [x] AC157. 지역 센터 화면에서 시·도를 선택하면 공식 포털 검색 동작이 표시되고, “공식 포털에서 센터 검색”이 `mentalhealth.go.kr`의 위치기반 검색 URL(`PotalHealthFacListTab2.do`, `sc3=AFCS1...`)을 연다.

### Cycle 55 — 키보드 건너뛰기 링크 E2E (2026-11-09)

- [x] AC158. 인트로의 “본문으로 건너뛰기” 링크를 키보드로 활성화하면 `#root`가 포커스를 받고 pageerror가 발생하지 않는다.

### Cycle 56 — 남은 작업 일괄 실행 (2026-11-09)

- [x] AC159. Cycle 50~55 변경이 `8ffcb6c`로 푸시되고 Browser safety·Linux deployment harness CI가 모두 통과한다.
- [x] AC160. `manual:packet`·`abc:packet`이 현재 범위 해시 `bbb427a5`를 출력하며, 두 패킷은 증빙·승인이 아님을 유지한다.
- [x] AC161. Phase 1·2·3·4·5의 실제 사람·기관 증빙이 없는 상태에서 각 evidence check와 `release:ready`는 계속 BLOCKED이며, 자동 검증으로 대체하지 않는다.

### Cycle 57 — 공식 포털 연결 실패 E2E (2026-11-09)

- [x] AC162. 공식 포털 열기에서 `window.open` 예외가 발생하면 실패를 성공으로 표시하지 않고, `mentalhealth.go.kr` 직접 주소 안내를 표시하며 pageerror가 발생하지 않는다.

### Cycle 58 — 배포 후보 검증 패킷 CLI (2026-11-09)

- [x] AC163. `deploy:packet`은 현재 범위 해시와 자동 게이트·GitHub Actions·TLS/Nginx/헤더·PWA/실기기·롤백 확인 항목을 출력한다.
- [x] AC164. 패킷은 실제 배포 승인·증빙·접근성/법무/임상 검토가 아니며, 사람 증빙이 없으면 `release:ready`가 BLOCKED임을 고정한다.
- [x] AC165. 패킷은 범위 해시 없이 생성되지 않고, 기존 `release:ready` 차단을 해제하지 않는다.

### Cycle 59 — 남은 사이클 일괄 배치 (2026-11-09)

- [x] AC166. Cycle 57~58 변경이 `c17b074`로 푸시되고 Browser safety·Linux deployment harness CI가 모두 통과한다.
- [x] AC167. `manual:packet`·`abc:packet`·`deploy:packet`이 현재 범위 해시 `350cfc4f`와 비승인 고지를 출력한다.
- [x] AC168. Phase 1·2·3·4·5의 실제 사람·기관 증빙과 Phase 6 실기기/TLS 확인은 자동 배치로 대체하지 않으며, 각 evidence check와 `release:ready`는 계속 BLOCKED다.

### Cycle 60 — 저장소 차단 자원·위기 E2E (2026-11-09)

- [x] AC169. `localStorage`가 차단되어도 `/resources`는 메모 입력 대신 저장 불가 안내를 표시하고, `/crisis`는 109 CTA를 포함한 위기 안내를 계속 렌더한다.

### Cycle 61 — 페이즈 상태 요약 CLI (2026-11-09)

- [x] AC170. `phase:status`는 Phase 0~6, 현재 범위 해시, PASS/BLOCKED/CHECK 상태, 차단 건수, 확인 명령을 읽기 전용으로 출력한다.
- [x] AC171. 요약은 증빙·승인이 아니며, 사람 증빙이 없는 페이즈를 PASS로 표시하거나 `release:ready` 차단을 해제하지 않는다.

### Cycle 62 — Phase 3 자동 reflow 보강 (2026-11-09)

- [x] AC172. 640×512(1280×1024의 200% 확대 상당) viewport에서 인트로·위기·자원·센터·결과 가드가 가로 스크롤 없이 핵심 CTA를 노출한다.
- [x] AC173. 이 자동 reflow 검사는 실제 NVDA·VoiceOver·TalkBack·전화 앱·설치 PWA 수동 증빙을 대체하지 않으며, `manual:check`는 계속 BLOCKED다.

### Cycle 63 — 배포 후보 스모크 검사 CLI (2026-11-09)

- [x] AC174. `deploy:smoke`는 HTTPS(또는 로컬호스트), CSP 필수 지시어·X-Frame-Options DENY·nosniff·HTML no-cache·앱 JS 번들, manifest, 서비스 워커, 오프라인 위기 링크, `/crisis`를 검사한다.
- [x] AC175. 검사 결과는 PASS/FAIL과 항목별 실패 사유를 출력하며, 실제 사람 증빙·법무/임상 승인·실기기 PWA 검증을 대체하지 않는다고 고지한다.
- [x] AC176. `deploy:smoke`는 실제 배포 승인이나 `release:ready` 차단 해제를 수행하지 않는다.

### Cycle 64 — 배포 스모크 검사 강화 (2026-11-09)

- [x] AC177. `deploy:smoke`는 루트·manifest·SW·offline·crisis 응답의 HTTP 상태와 Content-Type을 검사한다.
- [x] AC178. 매니페스트 아이콘 URL을 실제로 요청해 200·`image/png`인지 검사한다.
- [x] AC179. 루트 HTML의 inline hydration script SHA-256이 CSP `script-src`와 일치하고, `script-src`에 `'unsafe-inline'`이 없음을 검사한다.

## Verification

```bash
npm.cmd run validate
npm.cmd test
npm.cmd run a11y
npm.cmd run skill:check
npm.cmd run build:web
```

## Ambiguity Ledger

| Track | Status | Note |
|---|---|---|
| Scope | resolved | 선별+연결 유지, AI 상담 제외 |
| Constraints | resolved | no-backend, validated instruments, crisis-first |
| Outputs | resolved | 웹/PWA, 한국어 UI, 위기 자원 |
| Verification | resolved | validate/test/a11y/skill:check/build |
| Korean validation | open | 상업·임상 사용 전 타당화 필요 |
| Real screen reader test | open | NVDA/VoiceOver/TalkBack 수동 테스트 필요 |
| Result transport | resolved | URL 쿼리 제거, 세션 요약(점수·위험만)으로 전달 |
| PWA installability | resolved | 192/512/maskable/apple-touch 아이콘 제공 |
| Center search | resolved | 공식 포털 위치기반 검색(sc3) 사용, 지역 선택은 포털에서 |
| Safety plan memo | resolved | 6단계별 선택 메모, opt-in·기기 내 저장·전체 삭제, 위기 화면에서 재확인 |
| Risk-linked memo | resolved | 위험 신호(urgent·ASQ 양성·문항9) 시 결과 화면에 저장 메모 즉시 노출 |
| Narrow viewport | resolved | 360px 미만 지역 그리드 2열 확장 |
| Chart a11y | resolved | 추이 차트 행별 날짜·점수 접근성 라벨 |
| P1/P2 resilience | resolved | 현재 안전 질문 시간 경계·통화 실패·추이 손상 데이터·배포 검사 게이트 |
| Consent session gate | resolved | URL 파라미터가 아닌 탭별 최소 동의·연령 상태 확인 |
| Release readiness | resolved | 수동·임상·법무 증빙 누락 시 배포 전 명시적으로 차단 |
| Resource freshness | resolved | 90일 검증일·공식 근거·배포 전 정적 게이트 |
| Phase 0 resource review | resolved | 공식 웹 검토일 2026-11-06, 실제 기기 검증은 별도 미완료 |
| Phase 1 clinical handoff | resolved | 운영 프로토콜·증빙 게이트 구현, 실제 기관 운영은 미완료 |
| Phase 2 independent review | resolved | A/B/C 근거 교차검증·독립 검토 증빙 게이트 구현, 실제 외부 승인 미완료 |
| Phase 3 manual evidence | resolved | 수동 접근성·실기기 증빙 레지스트리·180일 게이트 구현, 실제 시험 기록은 미완료 |
| Phase 4 Korean validation evidence | resolved | 한국어 타당화 증빙 레지스트리·단계별 게이트 구현, 실제 연구·승인은 미완료 |
| Phase 5 legal evidence | resolved | 법무·규제 증빙 레지스트리·90일·배포 후보 범위 해시 게이트 구현, 실제 법률 검토는 미완료 |
| Phase 6 clinical handoff evidence | resolved | 임상 후속연결 운영 증빙 레지스트리·90일·운영 범위 해시 게이트 구현, 실제 운영은 미완료 |
| Privacy/network boundary | resolved | 앱 자동 전송·분석·응답 로그 정적 감사 및 SW 예외 범위 고정 |
| Device storage boundary | resolved | 선언된 네 최소 저장 writer만 허용하고 배포 전 정적 감사로 고정 |
| Static web CSP | resolved | 정적 자산 분리·동일 출처 CSP·Expo hydration 해시로 XSS/외부 로드 경계 고정 |
| PWA offline assets | resolved | 오프라인 위기·접근성 정적 자산 사전 캐시 및 정적 감사로 설치 직후 경계 고정 |
| Built CSP integrity | resolved | Expo 산출물 hydration 해시·inline script 수·정적 자산을 배포 전 대조 |
| Frame embedding | resolved | iframe 미지원 정적 앱을 DENY/none으로 고정해 위기 화면 클릭재킹 경계 강화 |
| P0 evidence integrity | resolved | 미래·비실재 날짜와 동일 날짜 실패가 PASS를 가리는 회귀를 차단하고, A/B/C 독립 검토를 범위 해시 기반 증빙 레지스트리로 분리 |
| Atomic static deploy | resolved | 후보 worktree를 라이브 정적 경로와 분리하고 current 링크를 원자 전환; 이전 릴리스 보존·기기/PWA 수동 확인은 별도 |
| Deploy E2E gate | resolved | 배포 후보가 Playwright E2E를 통과해야 활성화, E2E 실패 시 라이브 보존(하니스 고정) |
| Setup TLS protection | resolved | 기존 Nginx 구성 보존, FORCE_CONF_OVERWRITE=1 명시 시에만 백업 후 교체 |
| Expo 58 upgrade | resolved | Cycle 35에서 SDK 58·RN 0.88.1·Router 58 정렬, 정적 HTML bodyNodes 누락 보완, 위기 E2E 9/9·production critical/high 0 확인 |
| Expo 58 real-device validation | open | 실제 iOS/Android 빌드·실기기·TLS/PWA 기존 탭 갱신은 수동 배포 게이트 |

## Stop Condition

- AC1~AC179 통과 + open 항목은 “배포 전/상업화 전” 후속으로 명시.
- 추가 변경은 새 Seed를 만들어 Phase 1부터 시작.
