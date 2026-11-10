# 마음 체크 개발 가이드

> 이 프로젝트를 이어받는 사람/LLM은 먼저 `HANDOFF.md`를 읽으세요. Ouroboros 스킬 적용, 페이즈 기록, 검증 명령, 남은 작업이 정리되어 있습니다.

이 프로젝트는 우울·자살 위험을 **조기에 선별하고 전문가에게 연결**하는 Expo/React Native 웹 앱입니다. 진단·치료 앱이 아닙니다.

## 핵심 원칙

- 검증된 선별검사(PHQ-9, PHQ-A, GAD-7, ASQ)만 사용합니다. PHQ-9/PHQ-A/GAD-7은 한국어 이해용 번역과 영문 원문을 함께 제공하고, 채점은 영문 원문 기준입니다. ASQ는 NIMH 공식 한국어 번역을 사용합니다.
- 임의 가중치, 복합 위험 점수, 백분율 중증도, `likely MDD` 판정을 만들지 않습니다.
- 자살 위험은 우울 점수와 무관하게 전원 선별합니다.
- 급성 위험 신호가 있으면 결과보다 **위기 안내 화면**을 먼저 보여줍니다.
- 진단·치료·예방 효능을 주장하지 않습니다.
- 서버·분석 SDK·응답 로그를 사용하지 않습니다.

## Ouroboros 인터뷰 워크플로

이 프로젝트는 `Q00/ouroboros`의 interview 스킬을 프로젝트 로컬 스킬로 고정해 사용합니다.

- 스킬: `.opencode/skills/ouroboros-interview/SKILL.md`
- 명령: `.opencode/command/ouroboros-interview.md`
- 기본 경로: **Path C (Local A/B/C Expert Mode)** — MCP 서버 없이 동작
- 페이즈: 재고 조사 → 인터뷰 → A/B/C 교차검증 → Seed → 구현 → 평가 → 진화
- 기록: `docs/ouroboros/seed.md`, `docs/ouroboros/phase-log.md`
- 사용: `opencode` 재시작 후 `/ouroboros-interview <주제>` 또는 “우르브로스 인터뷰로 진행해줘”

MCP Path A를 쓰려면 별도로 `ouroboros setup --runtime opencode`를 실행해야 하며, 이 저장소의 기본 경로는 Path C입니다.

## 명령

```bash
npm.cmd run validate   # data/instruments.js 스키마·채점·라우팅 검증
npm.cmd test           # node --test "tests/**/*.test.js" 단위 테스트(프로젝트 tests/ 한정)
npm.cmd run a11y       # 접근성 정적 감사 + 색상 대비 검사
npm.cmd run manual:packet # 수동 접근성·실기기 검증 준비 패킷 출력(증빙 아님)
npm.cmd run deploy:packet # 배포 후보 검증 준비 패킷 출력(승인 아님)
npm.cmd run phase:status  # Phase 0~6 증빙 상태 요약(증빙 아님)
npm.cmd run deploy:smoke -- <URL> # 배포 후보 HTTPS·헤더·PWA·오프라인 읽기 전용 검사(승인 아님)
npm.cmd run skill:check # Ouroboros 인터뷰 스킬 적용 상태 검사
npm.cmd run web        # 로컬 웹 실행
npm.cmd run build:web  # 정적 웹 빌드
```

## 구조

```text
app/
  _layout.js     Stack 라우트 등록
  +html.js       웹 정적 HTML 템플릿(manifest·SW·focus CSS)
  index.js       인트로·동의·연령 게이트·위기 배너
  survey.js      안전 확인 → PHQ-9/PHQ-A → 기능손상 → GAD-7 → ASQ
  crisis.js      급성 위험 안내
  resources.js   위기 자원·안전 계획
  result.js      척도별 결과·다음 행동
  history.js     opt-in 저장 결과·추이
  centers.js     지역별 정신건강복지센터 안내
components/
  CrisisBanner.js
  ResourceList.js
  QuickExit.js   화면 우측 상단 빠른 나가기 버튼
data/
  instruments.js 문항·채점·밴드·위험 라우팅·자원
lib/
  storage/adapter.js  localStorage 저장 어댑터(점수·위험 수준만)
  storage/safety-plan.js  안전 계획 6단계 메모 저장(선택·기기 내만)
  assessment-session.js  결과 화면 전달용 세션 요약(원본 응답 제외)
  a11y.js             색상 대비 계산 유틸
bin/
  validate-instruments.js
  a11y-audit.js       접근성 정적 감사
tests/
  scoring.test.js
  instruments.test.js
  storage.test.js
  safety-plan.test.js  안전 계획 메모 회귀 검사
  release.test.js    결과 전달·PWA 아이콘·센터 URL 회귀 검사
  a11y.test.js
public/
  icons/          PWA 192·512·maskable·apple-touch 아이콘
  manifest.json  PWA manifest
  sw.js          보수적 service worker
  offline.html   오프라인 위기 안내
docs/research/   전문가 A/B/C 리서치·교차검증
docs/legal-review-checklist.md  배포 전 법무·규제 체크리스트
docs/a11y-manual-test-plan.md   스크린리더 수동 테스트 계획
docs/validation/                한국어 타당화 계획
docs/ouroboros/                 Seed·Phase 기록
HANDOFF.md                      인수인계 문서
THIRD_PARTY_NOTICES.md          서드파티 라이선스·출처
LICENSE                         프로젝트 MIT
```

## 문항·점수 수정 시

1. `data/instruments.js`의 문항, 밴드, 위험 규칙을 수정합니다.
2. `npm.cmd run validate`로 문항 수·경계·자원을 확인합니다.
3. `npm.cmd test`로 채점·라우팅을 확인합니다.
4. 문구를 바꿀 때는 `app/result.js`, `app/crisis.js`의 "진단 아님" 문구와 위기 자원이 유지되는지 확인합니다.

## 문구 원칙

- "당신은 우울증입니다", "DSM-5 기준 충족", "자살 위험 87%" 같은 표현을 쓰지 않습니다.
- "우울 증상이 중간 수준으로 보고되었습니다", "전문가 평가가 필요합니다"처럼 선별 결과로 표현합니다.
- 자살 방법·수단을 구체적으로 나열하지 않습니다.
- "안전 서약" 체크박스를 만들지 않습니다.
- "잘 모르겠어요"는 안전 확인·ASQ에서 양성으로 처리합니다.

## 배포 전 체크

- [ ] `npm.cmd run validate` 통과
- [ ] `npm.cmd test` 통과
- [ ] ASQ Q5 양성 시 결과 화면이 렌더되지 않음
- [ ] 결과 응답이 URL 파라미터로 전달되지 않고, `/result` 직접 접근 시 결과 없음 가드가 표시됨
- [ ] PWA 192·512·maskable·apple-touch 아이콘 파일이 실제로 존재함
- [ ] 지역 센터 검색 URL이 공식 포털에서 동작함
- [ ] 안전 계획 메모가 선택·기기 내 저장이고 "전문가와 함께 점검" 문구 유지, 전체 삭제 동작
- [ ] 위기 화면에서 저장된 안전 계획 메모가 확인됨
- [ ] 위험 신호(urgent·ASQ 양성·PHQ-9 문항9) 시 결과 화면에 저장 메모가 노출되거나 작성 안내가 표시됨
- [ ] 추이 차트 각 행에 날짜·점수 접근성 라벨이 있음
- [ ] "안전 서약" 문구가 없음
- [ ] 109/119/112/1577-0199/1388 안내 유지
- [ ] "진단 아님" 문구 유지
- [ ] 한국어 PHQ-9/GAD-7 라이선스 검토(현재 영문 원문 그대로 사용)
- [ ] 연령 게이트(만 14세 미만 차단) 동작 확인
- [ ] 만 14~17세 선택 시 PHQ-A 9문항 사용 확인
- [ ] 빠른 나가기(QuickExit) 외부 사이트 이동 확인
- [ ] 전화번호·운영시간 최신성 확인
- [ ] PWA manifest·오프라인 페이지·서비스 워커 동작 확인
- [ ] “의료기기 아님” 법무 고지 유지 확인
- [ ] 한국어 번역 고지(채점은 영문 원문 기준) 유지 확인
- [ ] `translationStatus`가 `validated-ko`가 아니면 임상·상업 사용 금지 확인
- [ ] 문항 `contentHash`·버전 최신성 확인
- [ ] `docs/validation/korean-instrument-validation-plan.md` 게이트 확인
- [ ] `LICENSE`·`THIRD_PARTY_NOTICES.md` 최신성 확인
- [ ] `npm.cmd run a11y` 통과
- [ ] `npm.cmd run security:build:check` 통과 및 `dist/*.html`에 앱 JS 번들 포함(SDK 58+ `+html`은 `headNodes`/`bodyNodes` 필수)
- [ ] `npm.cmd run test:e2e` 통과(위기 경로 브라우저 회귀)
- [ ] `npm.cmd run skill:check` 통과
- [ ] Ouroboros `seed.md`·`phase-log.md` 최신성 확인
- [ ] NVDA/VoiceOver/TalkBack 수동 테스트(`docs/a11y-manual-test-plan.md`) 완료
- [ ] 기능손상 비채점 문항이 점수에 포함되지 않음 확인
