# Ouroboros Phase Log — 마음 체크

## Phase 0 — Inventory (2026-11-02)

- 확인: `app/` 8개 화면, `data/instruments.js`, `lib/storage`, `public/` PWA, `deploy/nginx`, `docs/research` A/B/C 4문서.
- 강점: 검증 도구, crisis-first, no-backend, 로컬 저장 opt-in, PWA, 접근성 자동 감사, 법무 체크리스트.
- 발견한 불일치: 한국어 서비스인데 핵심 문항이 영어, 청소년 재검사 ageGroup 유실, 기록 오타, Expo 명의 LICENSE, Nginx 정적 라우트/캐시, 민감 경로 검색 노출.
- 판정: **전면 삭제 없이 유지**, 불일치만 보정.

## Phase 1 — Interview

- Goal: 선별+연결 목적 유지, 한국어 사용성·안전·배포·프라이버시 강화.
- Non-goals: AI 상담, 자동 진단, 임의 문항, 백엔드.
- Success: 한국어/영문 토글, 청소년 재검사 유지, 법무/라이선스 정리, 배포·robots 보강, 모든 검증 통과.
- Ambiguity: scope/constraints/outputs/verification 해소. 한국어 타당화·실제 SR 테스트는 open으로 남김.

## Phase 2 — A/B/C Cross-validation

| 결정 | A(임상) | B(위기) | C(구현) | 웹/코드 근거 | 결론 |
|---|---|---|---|---|---|
| 한국어 문항 | 검증된 한국어판 권장 | 저문해 접근성 | PHQ-9/GAD-7 public domain, 번역 허용 | PHQ Screeners 약관, Apple Health 안내 | 한국어 번역+영문 원문 병기, 채점 영문 기준 |
| 청소년 | USPSTF 12–18 우울 Grade B | 자살 선별 Grade I, 1388 | PHQ-A public domain | USPSTF 2022 | PHQ-A 유지, ASQ 유지 |
| 50문항 회귀 | 반대 | 반대 | 반대 | 기존 research | 현재 구조 유지 |
| 배포 | — | — | 정적 라우트/보안 헤더 | Expo static output, Nginx | `try_files`, no-cache, 보안 헤더 |
| 프라이버시 | — | 민감정보 최소화 | 검색 노출 최소화 | robots 표준 | 민감 경로 Disallow |
| 라이선스 | — | — | LICENSE 오표기 | Expo MIT | 프로젝트 MIT + THIRD_PARTY |

## Phase 3 — Seed

- `docs/ouroboros/seed.md` 작성. AC1~AC10 확정.

## Phase 4 — Implement

- 스킬: `.opencode/skills/ouroboros-interview/SKILL.md`, references 2개, `/ouroboros-interview` 명령, `opencode.json`, `AGENTS.md` 워크플로.
- 한국어: `data/instruments.js` 한국어 문항/고지, `app/survey.js` 토글, `app/result.js` 고지.
- 청소년: `app/result.js` 재검사 ageGroup 유지.
- 접근성: 연령 radio/radiogroup, 시작 disabled, 기록 heading/타겟, `bin/a11y-audit.js` 규칙.
- 라이선스: `LICENSE`, `THIRD_PARTY_NOTICES.md`.
- 배포/프라이버시: `deploy/nginx/depression-check.conf`, `public/robots.txt`.
- 검증: `bin/check-ouroboros-skill.js`, `tests/instruments.test.js`, `bin/validate-instruments.js`.
- 문서: README/AGENTS/SKILL/legal/cross-check 갱신.

## Phase 5 — Evaluate

```text
npm.cmd run validate   → PASS
npm.cmd test           → 26/26 PASS
npm.cmd run a11y       → PASS
npm.cmd run skill:check → PASS
npm.cmd run build:web  → PASS (9 static routes)
```

## Phase 6 — Evolve

- 다음 최고 영향 질문: “상업·임상 배포 전 한국어판 타당화를 누가/어떤 절차로 수행할 것인가?”
- 다음 후속: 실제 NVDA/VoiceOver/TalkBack 수동 테스트, 지역 센터 URL 파라미터 검증, 512px PWA 아이콘.
- 중단 조건: AC1~AC15 충족. 추가 기능은 새 Seed로 Phase 1부터.
- 판정: **CONTINUE 가능, 현재 릴리스 게이트 통과**.

## Cycle 2 — Phase 0~6 (2026-11-02): 한국어 타당화 준비

### Phase 0 — Inventory

- 현재 한국어 문항은 비공식 번역이며 채점은 영문 원문 기준.
- 문항 버전·해시·번역 상태가 코드에 없어 변경 이력 추적이 어려움.
- 타당화 계획 문서가 없어 “검증됨”과 “번역됨”이 혼동될 수 있음.

### Phase 1 — Interview

- 질문: “문항을 직접 만들 것인가, 유지하고 검증할 것인가?”
- 결정: **직접 만들지 않는다.** 검증된 영문 원문을 유지하고 한국어 번역만 타당화한다.
- 비목표: 임의 문항·가중치·복합 점수·AI 상담.
- 성공 기준: 문항 동결(버전·해시), 번역 상태 명시, 타당화 계획 문서화, 회귀 테스트.

### Phase 2 — A/B/C Cross-validation

| 항목 | A(임상) | B(위기) | C(구현) | 결정 |
|---|---|---|---|---|
| 문항 생성 | 검증된 도구 유지 | 위험 문항 임의 변경 금지 | 해시·버전으로 동결 | **직접 생성 금지** |
| 한국어 번역 | 타당화 필요 | 저문해·이해도 중요 | public domain 번역 허용 | **비공식 번역 유지 + 타당화 계획** |
| ASQ | 공식 한국어 사용 | 위기 선별 정확성 | NIMH 공식판 | **official-nimh 유지** |
| 변경 추적 | 버전 관리 필요 | 문구 변경 시 재검증 | contentHash | **해시·버전 메타 추가** |
| 상업/임상 | 검증 전 사용 금지 | 오탐 대응 필요 | 법무 게이트 | **타당화 전 사용 금지 명시** |

### Phase 3 — Seed

- AC11~AC15 추가: 버전·해시·번역 상태, 해시 테스트, 타당화 계획서, 문서 연결.

### Phase 4 — Implement

- `lib/instrument-hash.js`: FNV-1a 기반 결정적 문항 해시.
- `data/instruments.js`: `CONTENT_HASHES`, `TRANSLATION_STATUS`, `INSTRUMENT_VERSION_DATE` 및 계기별 버전/해시/번역 상태 추가.
- `bin/validate-instruments.js`: 해시 일치·버전·번역 상태 검증 추가.
- `tests/instruments.test.js`: 해시 결정성·민감성·메타 일치·번역 상태 테스트 추가.
- `docs/validation/korean-instrument-validation-plan.md`: 번역·인지면담·파일럿·본조사·분석·윤리·게이트 계획.
- README/AGENTS/법무 문서에 타당화 계획 연결.

### Phase 5 — Evaluate

```text
npm.cmd run skill:check → PASS
npm.cmd run validate    → PASS
npm.cmd test            → 29/29 PASS
npm.cmd run a11y        → PASS
npm.cmd run build:web   → PASS (9 static routes)
```

### Phase 6 — Evolve

- 다음 최고 영향 질문: “타당화 연구의 IRB·표본·기준표준을 누가 수행할 것인가?”
- 다음 후속: 실제 인지면담 실시, 기준표준 면담자 교육, 데이터 관리 계획(DPIA).
- 중단 조건: AC11~AC15 충족. 타당화 완료 전 `translationStatus` 변경 금지.
- 판정: **한국어 타당화 준비 완료, 임상·상업 사용은 보류**.

## Cycle 3 — Phase 0~6 (2026-11-04): 릴리스 안전성 강화

### Phase 0 — Inventory

- `/result`가 URL의 `data` 파라미터로 전체 응답을 받아 재계산하고 있었다.
- 파라미터가 없거나 손상되면 빈 응답으로 계산되어 **“현재 보고된 신호는 낮은 수준”** 이 표시될 수 있었다(거짓 안심 위험).
- 응답 전체가 URL 쿼리에 실려 브라우저 기록·서버 접근 로그에 남을 수 있었다.
- `public/manifest.json`과 `app/+html.js`가 `/assets/icon.png`를 참조하지만, `dist/`에는 해당 파일이 없어 아이콘이 404였다.
- `app/centers.js`의 `?searchKeyword=` 파라미터는 포털이 URL에서 읽지 않아 지역 자동 검색이 동작하지 않았다.
- 기존 검증은 위 항목을 회귀 검사하지 않았다.

### Phase 1 — Interview

- 질문: “다음 구현으로 새 기능을 추가할 것인가, 아니면 이미 있는 안전·배포 결함을 먼저 닫을 것인가?”
- 결정: **신규 임상 기능 없이 릴리스 안전성 결함을 먼저 닫는다.** (사용자가 권장안 선택을 위임)
- 비목표: AI 상담, 복합 점수, 서버 저장, 새 문항.
- 성공 기준: 거짓 안심 제거, 응답 URL 노출 제거, PWA 설치성 확보, 센터 검색 신뢰성 확보, 자동 회귀 검사.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상) | B(위기) | C(구현) | 웹/코드 근거 | 결론 |
|---|---|---|---|---|---|
| 빈 결과 처리 | 응답 없이 점수 해석 금지 | 거짓 안심은 위험 | 가드 화면 필요 | 현재 `/result`가 빈 응답을 low로 계산 | **결과 없음 가드** |
| 결과 전달 | — | 응답 노출 최소화 | URL 쿼리 제거, 세션 요약 | Nginx 접근 로그에 쿼리 포함 가능 | **sessionStorage/메모리 요약** |
| 급성 라우팅 | 결과보다 안전 | 결과 차단 유지 | 세션 요약에서도 재확인 | 기존 `/crisis` 라우팅 | **acute 재확인** |
| PWA 아이콘 | — | 오프라인 접근성 | 192/512/maskable 필요 | manifest 아이콘 404 확인, 빌드 산출물 점검 | **아이콘 생성·검증** |
| 센터 검색 | 지역 연결 중요 | 전화 대안 유지 | 동작하는 URL만 안내 | `sc3` 필터는 269건 반환, `sc1`/`searchKeyword`는 서버 미반영 | **공식 Tab2 + sc3** |
| 회귀 방지 | — | — | 테스트·감사 추가 | 기존 테스트에 미포함 | **release.test + a11y 규칙** |

### Phase 3 — Seed

- AC16~AC21 추가: URL 전달 금지, 결과 없음 가드, acute 재확인, PWA 아이콘, 센터 URL, 자동 회귀 검사.

### Phase 4 — Implement

- `lib/assessment-session.js`: 점수·밴드·위험 요약만 저장하는 세션 저장소(메모리 + sessionStorage, 원본 응답 제외, 스키마 검증).
- `app/survey.js`: 완료 시 `buildAssessmentResult`로 요약 생성 후 저장, `/result`로 파라미터 없이 이동, acute면 `/crisis`.
- `app/result.js`: URL 파라미터 제거, 세션 요약 로드, 로딩/결과 없음/acute 상태 분기, 저장 기록에 `phq9` 별칭 전달.
- `public/icons/*`: 192·512·maskable·apple-touch 아이콘 생성.
- `public/manifest.json`, `app/+html.js`: 실제 존재하는 아이콘 경로로 교체, apple-mobile-web-app 메타 추가.
- `app/centers.js`, `data/instruments.js`: 공식 포털 위치기반 검색(Tab2 + `sc3`)으로 교체, 지역 선택 안내 문구 수정.
- `tests/release.test.js`, `bin/a11y-audit.js`: 세션 저장·결과 가드·아이콘 존재·센터 URL 회귀 검사 추가.

### Phase 5 — Evaluate

```text
npm.cmd run validate   → PASS
npm.cmd test           → 37/37 PASS
npm.cmd run a11y       → PASS
npm.cmd run skill:check → PASS
npm.cmd run build:web  → PASS (9 static routes)
```

- `dist/icons/`에 4개 아이콘 포함, `dist/index.html`이 `/icons/icon-192.png`·`/icons/apple-touch-icon.png` 참조 확인.
- `dist/result.html`은 로딩 상태로 정적 렌더되며, 낮은 위험 결과를 미리 렌더하지 않음 확인.

### Phase 6 — Evolve

- 다음 최고 영향 질문: “세션 요약의 보존 범위를 탭 세션으로 제한할 것인가, 결과 공유를 위해 URL 없는 단기 복원을 허용할 것인가?”
- 남은 후속: 실제 NVDA/VoiceOver/TalkBack 수동 테스트, 한국어판 타당화(IRB), 320px·200% 확대 점검.
- 중단 조건: AC16~AC21 충족, 기존 AC1~AC15 회귀 없음.
- 판정: **릴리스 안전성 게이트 통과. 임상·상업 사용은 여전히 타당화 전 보류.**

## Cycle 4 — Phase 0~6 (2026-11-04): 안전 계획 개인 메모

### Phase 0 — Inventory

- 교차검증 §2.5 “안전계획 6단계 + 로컬 메모(선택)” 중 **로컬 메모 미구현**(정적 6단계 안내만 존재).
- `app/resources.js` 센터 안내 문구가 Cycle 3에서 수정한 다른 화면과 불일치(자동 지역 검색 암시).
- `result.js` 안전계획 섹션에 메모 작성으로 이어지는 연결 없음.

### Phase 1 — Interview

- 질문: “다음 구현은 무엇인가 — 새 임상 기능, 접근성 심화, 또는 부분 채택된 안전계획 메모 완성인가?”
- 결정: **교차검증에서 합의된 부분 채택 항목(안전계획 로컬 메모)을 완성한다.** (사용자가 권장안 선택을 위임)
- 비목표: 자동 공유·알림, 서버 저장, 안전 서약 체크박스, 새 문항.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상) | B(위기) | C(구현) | 결론 |
|---|---|---|---|---|
| 로컬 메모 | 작성 보조까지만, 완성은 임상가와 | Stanley-Brown 개인화는 위기 순간 회상에 핵심 | opt-in localStorage, 자동 공유 없음 | **6단계별 선택 메모 구현** |
| 위기 화면 연결 | — | 위기 순간에 작성 메모 재확인이 핵심 | 읽기 전용 렌더 가능 | **/crisis에서 메모 표시** |
| 프라이버시 | — | 연락처 입력 유도 주의 | 사용자 직접 입력만 기기 내 저장, 500자 제한, 전체 삭제 UI | **최소 수집·상시 삭제·고지** |
| 문구 | “전문가와 함께 점검” 고정 | 안전 서약 아님 | a11y 감사로 문구 회귀 검사 | **문구 고정 + 감사 규칙** |
| 센터 문구 불일치 | — | — | Cycle 3 결론과 정합 필요 | **“공식 포털에서 검색”으로 통일** |

### Phase 3 — Seed

- AC22~AC28 추가: 6단계 메모 저장·검증·삭제, 전문가 점검 문구 고정, 접근성 라벨·결과 화면 연결, 센터 문구 통일, 회귀 테스트, 위기 화면 메모 재확인.

### Phase 4 — Implement

- `lib/storage/safety-plan.js`: 6단계 필드·스키마 검증·trim·500자 제한·전체 삭제 어댑터.
- `app/resources.js`: “나의 안전 계획 메모(선택)” 작성 UI(라벨·글자 수·저장/전체삭제·상태 live region), 센터 문구 통일.
- `app/result.js`: 안전계획 섹션에 “안전 계획 메모 작성하기(선택)” 링크.
- `app/crisis.js`: 저장된 메모를 위기 화면에서 읽기 전용으로 재확인.
- `tests/safety-plan.test.js` 7건, `bin/a11y-audit.js` 규칙 10건 추가.
- **실시간 보완**: 프로젝트 루트에 추가된 `ouroboros/` 체크아웃의 `*.test.ts`가 `node --test` 기본 디스커버리에 수집되어 실패 → `package.json` test 스크립트를 `node --test "tests/**/*.test.js"`로 한정해 해결(사용자 자산은 삭제하지 않음).

### Phase 5 — Evaluate

```text
npm.cmd run validate   → PASS
npm.cmd test           → 44/44 PASS (tests/ glob 한정 후)
npm.cmd run a11y       → PASS (신규 10개 안전계획 규칙 포함)
npm.cmd run skill:check → PASS
npm.cmd run build:web  → PASS (9 static routes, /resources 39KB)
```

### Phase 6 — Evolve

- 다음 최고 영향 질문: “저장된 안전 계획 메모를 PHQ-9 점수 상승 시 결과 화면에서도 자동으로 강조할 것인가?”
- 남은 후속: 실제 NVDA/VoiceOver/TalkBack 수동 테스트(메모 입력 포함), 320px·200% 확대 점검, 한국어판 타당화(IRB).
- 중단 조건: AC22~AC28 충족, 기존 AC1~AC21 회귀 없음.
- 판정: **안전 계획 기능 완성. 임상·상업 사용은 여전히 타당화 전 보류.**

## Cycle 5 — Phase 0~6 (2026-11-04): 위험 신호 메모 노출·접근성 마무리

### Phase 0 — Inventory

- Cycle 4 evolve 질문(위험 신호 시 결과 화면 메모 노출) 미결.
- `app/centers.js` 그리드가 고정 3열(30%)이라 320px 화면에서 긴 지역명(예: 세종특별자치시) 넘침.
- `app/history.js` 추이 차트 막대에 접근성 라벨 없음(WCAG 1.1.1 비준수).
- service worker가 PWA 아이콘을 사전 캐시하지 않아 설치 직후 오프라인에서 아이콘 누락 가능.

### Phase 1 — Interview

- 질문: “남은 구현은 무엇인가 — 새 기능인가, 접근성·위기 연결성 마무리인가?”
- 결정: **위기 연결성·접근성 결함 마무리.** 새 임상 기능 없음.
- 비목표: 새 문항·점수·백엔드, 결과 메모 자동 알림.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상) | B(위기) | C(구현) | 결론 |
|---|---|---|---|---|
| 위험 신호 메모 노출 | 관심 신호 시 계획 상기 타당 | 위기 인지 순간에 메모 재노출 핵심 | 읽기 전용 렌더 + 작성 안내 분기 | **urgent·ASQ 양성·문항9>0 시 노출** |
| 320px 그리드 | — | 위기 사용자 작은 화면 가독성 | useWindowDimensions 2열 | **360px 미만 48% 2열** |
| 차트 라벨 | — | 저시력·스크린리더 접근 | 행별 aria-label | **날짜·우울·불안 점수 라벨** |
| SW 프리캐시 | — | 오프라인 식별성 유지 | PRECACHE + v2 캐시 | **아이콘 4종 프리캐시** |

### Phase 3 — Seed

- AC29~AC33 추가: 위험 신호 메모 노출, 반응형 그리드, 차트 라벨, SW 프리캐시, 회귀 검사.

### Phase 4 — Implement

- `app/result.js`: `promptMemo`(urgent·ASQ 양성·PHQ-9 문항9>0) 분기 — 저장 메모 읽기 상자 / 작성 안내 박스.
- `app/centers.js`: `useWindowDimensions`로 360px 미만 2열(48%).
- `app/history.js`: 추이 차트 행별 `accessibilityLabel`(날짜·우울·불안 점수).
- `public/sw.js`: 캐시 `maeumcheck-v2`, 아이콘 4종 PRECACHE.
- `tests/release.test.js` 4건, `bin/a11y-audit.js` 7건 규칙 추가.

### Phase 5 — Evaluate

```text
npm.cmd run validate   → PASS
npm.cmd test           → 48/48 PASS
npm.cmd run a11y       → PASS (신규 7개 규칙 포함)
npm.cmd run skill:check → PASS
npm.cmd run build:web  → PASS (9 static routes, dist/sw.js v2·아이콘 프리캐시 확인)
```

- 정적 `dist/result.html`은 메모 박스를 미리 렌더하지 않음 확인(위험 신호·저장 메모 존재 시에만 클라이언트 렌더).

### Phase 6 — Evolve

- 다음 최고 영향 질문: “결과 화면의 위험 신호 메모 노출이 사용자를 안심시키는가, 아니면 부담을 주는가?(사용성 테스트 필요)”
- 남은 후속: 실제 NVDA/VoiceOver/TalkBack 수동 테스트(메모 입력·차트 라벨 확인), 200% 확대 점검, 한국어판 타당화(IRB).
- 중단 조건: AC29~AC33 충족, 기존 AC1~AC28 회귀 없음.
- 판정: **코드로 구현 가능한 릴리스 결함 소진. 남은 항목은 실기기 수동 테스트·타당화 연구·법무 게이트뿐.**

◆ a11y-connection-complete (Path C) → next: 실기기 스크린리더 수동 테스트·200% 확대 점검, 이후 IRB 기반 한국어 타당화 착수

## Cycle 6 — 목적·안전성 재감사 (2026-11-06)

### Phase 0 — Inventory

- HANDOFF, 프로젝트 지침, 로컬 interview 스킬, 기존 연구·Seed·검증 계획 및 실행 제품 소스를 검토했다.
- 기존 대규모 미커밋 변경은 보존했다. 전면 삭제·재작성은 사용자가 허용했으나 필요성이 입증되지 않아 수행하지 않았다.
- 상세 결과: `docs/research/purpose-safety-audit-2026-11-06.md`.

### Phase 1 — Interview (범위 확인 진행 중)

- 사용자는 직접 만든 질문으로 심리 상태를 파악하고 점수에 따른 설명과 전문가 상담 권고를 원한다고 답했다.
- 제안: 자체 비채점 고민 탐색 질문 + 검증 척도별 점수 + 별도 안전 경로 + 전문가 상담 안내.
- 미확정: 자체 질문을 비채점으로 분리하는 제안 수용 여부, 정형 대화 화면과 자유대화 상담의 범위. 사용자 답변을 자동 승인이나 새 Seed 승인으로 처리하지 않았다.

### Phase 2 — A/B/C Cross-validation (현재 구현 감사 완료)

- A: 임상·심리측정, B: 위기안전, C: 구현·프라이버시를 독립 에이전트로 검토했다. 실제 전문가 인터뷰·임상 승인은 아니다.
- 일치: 선별 기반 재사용, 전체 재작성 불필요, 상담·정신질환 전반 발견 목적에는 부분 부합.
- 우선 결함: 문항9=1인데 low 분류, localStorage getter 예외 전파, 직접 설문 진입 시 연령·동의 우회.
- 추가 결함: 손상 세션·결측 방어, 삭제 실패 성공 표시, 저장 고지 불일치, 자체 안전 규칙·번역 타당성·검증 범위 과장 가능성.
- 충돌 해소: ASQ Q3 한국어 기간은 공식 한국어 PDF와 코드가 일치한다. 코드 오역으로 수정하지 않고 공식 한영판 및 버전 차이를 미해결 검증 사항으로 기록했다.
- 과거 “코드로 구현 가능한 릴리스 결함 소진” 판정을 철회한다.

### Phase 3 / Phase 4 — 새 Seed·제품 구현 미착수

- 기존 승인 Seed를 덮어쓰지 않았다. 새 수용 기준은 감사 보고서의 미승인 후보다.
- 제품 코드는 변경하지 않았다. 감사 보고서·인수인계·페이즈 기록만 갱신했다.
- 목표 재진술 승인 및 스킬 종료 검토 전에 새 Seed나 구현 완료를 주장하지 않는다.

### 현 상태 검증 (다음 Phase 5 평가를 위한 기준선)

```text
npm.cmd run validate    PASS
npm.cmd test            48/48 PASS
npm.cmd run a11y        PASS (정적 감사)
npm.cmd run skill:check PASS
npm.cmd run build:web   PASS (9 static routes)
```

- 추가 함수 실행: 문항9=1 조건 low, 음수/초과 점수 및 acute-low 모순 요약 수락, 저장소 getter 차단 시 예외 전파를 재현했다.
- 자동 PASS는 임상 타당성·브라우저 전체 경로·스크린리더·법적 승인 완료가 아니다.
- 빌드 산출물 dist 재생성 외 배포·커밋·푸시 없음.

### 다음 진화 후보 (Phase 6 완료 판정 아님)

- 권장 설계 범위를 확인한 뒤 안전 결함 수정과 비채점 고민 탐색 경험을 수용 기준으로 확정한다.
- 실제 한국어판 타당성·임상가 연결 운영·실기기 접근성은 여전히 미완료다.

◆ audit-complete / scope-confirmation-pending → next: 비채점 탐색 + 검증 척도 + 안전·전문가 연결 설계 확인

## Cycle 7 — 비채점 고민 탐색·안전 경로 보완 (2026-11-06)

### Phase 0 — Inventory

- Cycle 6 감사의 P1/P2 결함을 구현 대상으로 확정했다: 문항9 비영 응답 low 종결, 저장소 접근 예외, 직접 설문 진입, 손상 세션, 삭제 실패 표시, 위기 통화 실패 피드백.
- 사용자 승인 범위: 직접 만든 질문으로 상태를 묻고 전문가 상담을 권하는 흐름. 임의 임상 점수는 만들지 않는다.

### Phase 1 — Interview

- 결정: 정형 고민 탐색 질문은 선택·비채점으로 둔다. 검증 척도별 점수와 자살 관련 안전 신호는 분리한다.
- 비목표: 생성형 AI 자유대화 상담, 질환 진단, 정신질환 전반 배제 판정, 서버·분석·개인정보 수집.
- 모호성 기록: 상담 경험은 지금의 정형 흐름이며 실제 상담 연결·예약 운영은 후속 임상·운영 범위다.

### Phase 2 — A/B/C Cross-validation

| 관점 | 검증 결과 | 구현 결정 |
|---|---|---|
| A 임상·심리측정 | 임의 질문은 임상 점수로 합산하지 않으며 문항9 비영 응답을 low로 종결하지 않아야 함 | 탐색 질문 비채점, 문항9>0은 urgent 안내 |
| B 위기안전 | ASQ 음성은 안전 보장이 아니며 위기 연락 실패도 알려야 함 | 한계 고지·통화 실패 피드백·급성 우선 유지 |
| C 구현·프라이버시 | 저장소 차단·손상 요약·삭제 실패가 화면 또는 데이터 고지를 훼손할 수 있음 | 저장소 getter 예외 처리, 세션 v2 엄격 검증, 성공 후 UI 갱신 |

### Phase 3 — Seed

- AC34~AC41을 추가하고 구현·검증 후 완료로 표시했다. 이전 AC30~AC33의 체크 상태도 실제 구현 기록과 일치하게 수정했다.

### Phase 4 — Implement

- `app/survey.js`: 선택형 비채점 고민 탐색 단계를 추가하고 직접 접근 시 동의·연령이 없으면 시작 화면으로 보냈다.
- `data/instruments.js`: 탐색 범위 고지, 완전한 응답 검사, 문항9 비영 응답 urgent 분기, 낮은 수준·ASQ 음성 한계 문구를 추가했다.
- `lib/storage/*`, `lib/assessment-session.js`: 저장소 getter 예외를 흡수하고, 세션 v2에 범위·급성 일관성 검증과 최소 안전 플래그만 저장하도록 변경했다.
- `app/result.js`, `app/resources.js`, `app/history.js`: 새 안전 플래그 사용, 실패한 삭제를 성공 표시하지 않음, 저장소 불가 안전 처리.
- `components/CrisisBanner.js`, `components/ResourceList.js`, `app/crisis.js`: 통화·웹 연결 실패 피드백 및 위기 화면 한계 고지 추가.
- 회귀 테스트: 문항9=1, 불완전 응답, 손상/모순 세션, 저장소 getter 차단을 추가했다.

### Phase 5 — Evaluate

```text
npm.cmd run validate    PASS
npm.cmd test            PASS (52/52)
npm.cmd run a11y        PASS
npm.cmd run skill:check PASS
npm.cmd run build:web   PASS (9 static routes)
git diff --check        PASS
```

### Phase 6 — Evolve

- 남은 최고 영향 항목: 실제 한국어판 타당화·임상가 검토 및 실제 상담 연결 운영 체계.
- 실제 기기에서 통화 앱이 없는 경우의 피드백, NVDA/VoiceOver/TalkBack, 200% 확대는 수동 테스트가 필요하다.
- 판정: 정형 비채점 탐색과 선별·연결 안전 보완은 완료. 이 앱은 여전히 진단·치료·AI 상담 서비스가 아니다.

◆ screening-connection-safety-complete → next: 실기기 접근성·임상 타당화·전문가 연결 운영 검토

## Cycle 8 — 전수 A/B/C 재감사 (2026-11-06)

### Phase 0 — Inventory

- `app`, `components`, `data`, `lib`, `public`, `deploy`, `bin`, `tests`, `docs`, 설정을 재검토했다.
- 코드·문서 외 `node_modules`, 빌드 생성물, 전이 의존성 전수 보안 감사는 범위에서 제외했다.

### Phase 1 — Interview

- 목표와 비목표는 기존 Seed와 일치한다: 선별+연결, 무백엔드, 독자 임상 점수·진단·AI 상담 제외.
- 실제 임상·상업 배포와 기관의 상담 인수 운영은 미확정이다.

### Phase 2 — A/B/C Cross-validation

- A: 비공식 한국어 번역의 타당화와 자체 안전 확인 질문의 임상 검토가 남았다.
- B: NIMH ASQ 양성 후 임상가 BSSA와 실제 연결 체계는 앱의 전화·포털 안내로 대체되지 않는다.
- C: 손상된 history 항목 방어, 모든 직접 통화 버튼 실패 UI, 배포 검증·HTTPS 게이트가 남았다.
- 결론: 전면 재작성 불필요. P0 운영·타당화, P1/P2 품질 보완을 분리한다.

### Phase 3 — Seed

- 기존 AC1~AC41은 유지한다. 신규 P0~P2는 `docs/research/full-project-abc-audit-2026-11-06.md`의 후보이며 새 Seed 승인 전 미구현이다.

### Phase 4 — Implement

- 감사 문서·페이즈 기록만 추가했다. 제품 코드는 변경하지 않았다.

### Phase 5 — Evaluate

```text
npm.cmd run validate    PASS
npm.cmd test            PASS (53/53)
npm.cmd run a11y        PASS
npm.cmd run skill:check PASS
npm.cmd run build:web   PASS (9 static routes)
git diff --check        PASS
```

### Phase 6 — Evolve

- 다음 선택: P0 임상·운영 게이트를 먼저 해소하거나, P1/P2 품질 보완용 새 Seed를 승인한다.
- 상세 근거·수용 기준: `docs/research/full-project-abc-audit-2026-11-06.md`.

◆ full-abc-audit-complete → next: P0 운영·타당화 게이트 결정 또는 P1/P2 품질 보완 Seed 생성

## Cycle 9 — 연결 실패·저장 복원력·배포 게이트 (2026-11-06)

### Phase 0 — Inventory

- Cycle 8 감사의 P1/P2 항목을 재검토했다. P0(한국어 타당화, 실제 임상 후속평가, 법무·규제)은 코드 구현으로 대체하지 않고 배포 차단 상태를 유지한다.
- 범위는 현재 안전 확인의 시간 경계, 직접 통화/외부 연결 실패 안내, localStorage 추이 기록 검증, 배포 자동 검사로 제한했다.

### Phase 1 — Interview

- 사용자 지시는 권장안을 바탕으로 한 구현이며, 기존 비진단·무백엔드·위기우선 제약을 유지하는 것으로 확정했다.
- 원장: 범위·제약·산출물·자동 검증은 해결, 실제 임상 연계·수동 보조기기 시험은 외부 운영 과제로 유지.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·측정) | B(위기·자살예방) | C(구현·법무) | 결론 |
|---|---|---|---|---|
| 안전 ‘계획’ 질문 | 현재 위험과 과거력을 구분 | 현재/당일의 급성 위험만 즉시 위기 라우팅 | 기존 비채점 안전 확인의 문구만 명확화 | 현재·당일 시간 범위 명시 |
| 전화 실패 | 선별 결과를 성공적 연결로 오인하지 않음 | 즉시 번호 직접 입력·대안 안내 | `Linking` 실패 Promise 처리 | 1388/1577-0199 및 포털 실패 피드백 |
| 추이 데이터 | 임상 판단 근거로 과신 금지 | 손상 데이터가 잘못된 안심을 만들면 안 됨 | 항목별 런타임 스키마 검증 | 손상 기록 전체 거부 |
| 배포 | 선별 도구 변경은 재검증 필요 | 위기 기능 회귀를 배포 전 차단 | CI와 같은 명령을 배포 스크립트에 고정 | build 전 4개 검사 |

- 웹 근거: NIMH는 ASQ를 의료 환경의 선별·임상 경로 도구로, PHQ Screeners는 응답의 임상가 확인 및 임상적 진단을 요구하는 자료로 설명한다. 앱은 선별·연결 범위를 벗어나지 않는다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC42~AC46을 추가했다.

### Phase 4 — Implement

- `data/instruments.js`: 기존 안전 확인 ‘계획’ 문항을 현재 또는 오늘 안의 구체적 계획으로 명확화했다.
- `app/index.js`, `app/result.js`, `app/centers.js`: 1388·1577-0199·공식 포털 연결 실패 시 직접 번호/도메인 안내와 라이브 영역 피드백을 제공한다.
- `lib/storage/adapter.js`: 기록 컨테이너와 각 항목의 날짜·점수 범위·불리언·위험 티어를 검증한다.
- `deploy/scripts/*.sh`: 빌드 전 validate/test/a11y/skill:check을 실행한다.
- `tests/`: 위 항목의 회귀 테스트를 추가했다.

### Phase 5 — Evaluate

- `npm.cmd run validate` PASS
- `npm.cmd test` PASS (57/57)
- `npm.cmd run a11y` PASS
- `npm.cmd run skill:check` PASS
- `npm.cmd run build:web` PASS (정적 경로 9개)
- `git diff --check` PASS

### Phase 6 — Evolve

- 남은 P0: 한국어 타당화, 임상의 BSSA/후속 연결 운영, 법무·규제 검토.
- 남은 수동 검증: NVDA/VoiceOver/TalkBack, 320px·200% 확대, 실제 전화 앱/오프라인 환경.
- 이 앱은 진단·치료·AI 상담을 제공하지 않으며, 자동 구조 요청도 하지 않는다.

◆ p1-p2-resilience-complete → next: P0 임상·법무·운영 게이트 또는 수동 접근성 검증

## Cycle 10 — 탭 동의 게이트 복원력 (2026-11-06)

### Phase 0 — Inventory

- `app/survey.js`가 URL `consent=true`와 연령 쿼리에 의존해 직접 진입을 확인하던 상태를 확인했다.
- 위기 자원·위기 화면은 설문 동의와 관계없이 계속 접근 가능하다.

### Phase 1 — Interview

- 사용자 요청에 따라 A/B/C 권장안을 구현 범위로 확정했다.
- 제약: 동의는 점수·위험에 영향을 주지 않으며, 계정·서버·식별자·응답 저장을 추가하지 않는다.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·측정) | B(위기·자살예방) | C(구현·프라이버시) | 결론 |
|---|---|---|---|---|
| 설문 동의 | 측정값과 분리 | 위기 자원 접근 차단 금지 | URL은 신뢰 경계가 아님 | 탭별 최소 상태 확인 |
| 저장 범위 | 응답·식별자 저장 불필요 | 안전 경로를 위해 영구 보관 불필요 | sessionStorage는 탭·페이지 세션 단위 | 스키마 버전+연령대만 저장 |
| 저장소 차단 | 결과·위기 안내를 멈추면 안 됨 | 같은 탭에서 안전 흐름 유지 | 메모리 fallback, 재로드 시 재동의 | fallback 적용 |

- 웹 근거: MDN은 `sessionStorage`가 origin과 탭 단위로 분리되고 탭/창 종료 시 제거되며, 정책상 접근 예외가 발생할 수 있다고 설명한다. 따라서 예외는 메모리 fallback으로 처리하되 영구 보관하지 않는다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC47~AC50을 추가했다.

### Phase 4 — Implement

- `lib/consent-session.js`: 최소 동의·연령 상태의 스키마 검증, sessionStorage, 메모리 fallback을 추가했다.
- `app/index.js`: 설문 시작 시 탭 동의 상태를 기록하고 URL 동의 파라미터를 제거했다.
- `app/survey.js`: URL이 아닌 탭 동의·연령 상태로 진입을 검증한다.
- `app/result.js`: 재검사 URL에서 동의 파라미터를 제거했다.
- `tests/release.test.js`: 최소 저장값·연령 불일치·저장소 차단 fallback을 회귀 검사한다.

### Phase 5 — Evaluate

- `npm.cmd run validate` PASS
- `npm.cmd test` PASS (59/59)
- `npm.cmd run a11y` PASS
- `npm.cmd run skill:check` PASS
- `npm.cmd run build:web` PASS (정적 경로 9개)
- `git diff --check` PASS

### Phase 6 — Evolve

- 이 게이트는 UX 안전장치이며 브라우저 개발자 도구·악의적 클라이언트에 대한 인증/보안 경계가 아니다.
- 남은 P0: 한국어 타당화, 임상의 BSSA/후속 연결 운영, 법무·규제 검토.
- 남은 수동 검증: 실제 전화 앱, NVDA/VoiceOver/TalkBack, 320px·200% 확대, 오프라인 PWA.

◆ consent-session-gate-complete → next: P0 임상·법무·운영 게이트 또는 수동 접근성 검증

## Cycle 11 — Phase 6 릴리스 준비도 게이트 (2026-11-06)

### Phase 0 — Inventory

- 수동 접근성 계획은 있었지만, 미수행 상태가 배포 스크립트를 차단하지 않는 것을 확인했다.
- 한국어 타당화·법무·임상 운영은 문서상 미완료이며 앱 코드가 이를 완료로 대체할 수 없다.

### Phase 1 — Interview

- 사용자 지시에 따라 Phase 6의 미완료 과제를 숨기지 않고 실행 가능한 배포 차단 게이트로 구현하는 범위를 확정했다.
- 비목표: 실제 임상 승인·법무 판단·스크린리더 시험 결과를 자동으로 생성하거나 완료로 표시하지 않는다.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·측정) | B(위기·자살예방) | C(구현·법무) | 결론 |
|---|---|---|---|---|
| 임상 타당화 | 번역·절단점은 연구로 검증 | 선별 양성의 임상 후속평가 필요 | 코드 검사로 대체 불가 | 배포 차단 증빙으로 유지 |
| 수동 접근성 | 이해 가능한 결과 전달 필요 | 위기 버튼·오프라인 안내가 실제 기기에서 작동해야 함 | 자동 감사 범위 제한 | 장비별 체크·기록 요구 |
| 법무·규제 | 진단 주장 금지 | 공적 위기 자원 연결 유지 | 공식 검토 기록 필요 | 법무·임상 기록 없으면 차단 |
| 법령 날짜 | — | — | 공식 식약처 자료 우선 | 2025-01-24로 정정, 세부 조항은 최신 확인 |

- 웹 근거: NIMH는 ASQ를 의료 환경용 선별 및 임상 경로 자료로 제공하며, 109 공식 페이지는 109·1577-0199·1388의 역할과 고위험 시 동의 기반 지역 연계를 안내한다. 식약처 공식 자료의 법 시행일 표기를 문서 정정에 사용했다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC51~AC54를 추가하고 완료로 기록했다.

### Phase 4 — Implement

- `docs/a11y-manual-test-plan.md`: 릴리스 승인용 수동 증빙 체크와 기록 원칙을 추가했다.
- `bin/release-readiness.js`: 수동 접근성·실기기·한국어 타당화·법무/임상 증빙의 미완료 항목을 출력하고 실패한다.
- `package.json`: `npm.cmd run release:ready` 명령을 추가했다.
- `deploy/scripts/*.sh`: 자동 검사와 웹 빌드 뒤 릴리스 준비도 게이트를 실행한다.
- `docs/legal-review-checklist.md`: 디지털의료제품법 시행일을 2025-01-24로 정정하고 세부 조항은 최신 법령 확인 대상으로 명시했다.
- `tests/release.test.js`: 릴리스 게이트와 배포 스크립트 연결을 회귀 검사한다.

### Phase 5 — Evaluate

- `npm.cmd run validate` PASS
- `npm.cmd test` PASS (60/60)
- `npm.cmd run a11y` PASS
- `npm.cmd run skill:check` PASS
- `npm.cmd run build:web` PASS (정적 경로 9개)
- `git diff --check` PASS
- `npm.cmd run release:ready` EXPECTED BLOCKED: 수동 접근성, 실제 전화/오프라인, 한국어 타당화, 법무·임상 운영 증빙 미완료.

### Phase 6 — Evolve

- 자동화 가능한 안전 개선은 완료했다. `release:ready`의 차단을 해제하려면 실제 사람이 해당 기록을 남겨야 한다.
- 다음 최고 영향 작업은 NVDA/VoiceOver/TalkBack 및 320px·200%·전화·오프라인 수동 시험이며, 이어서 IRB 기반 한국어 타당화와 임상/법무 운영 검토다.
- 이 게이트는 증빙 파일의 체크 상태를 확인할 뿐, 그 증빙의 진실성·임상적 적절성·법적 효력을 스스로 검증하지 않는다.

◆ phase6-release-gate-complete → next: 실제 수동 접근성 증빙, 이후 P0 임상·법무·운영 게이트

## Cycle 12 — 위기 자원 최신성 게이트 (2026-11-06)

### Phase 0 — Inventory

- 위기 자원 데이터에는 검증일은 있었지만, 최대 유효기간·공식 검증 근거·배포 차단 검사가 없었다.
- 공식 109 페이지에서 109, 1577-0199, 1388의 역할 및 24시간 안내를 재확인했다. 119는 공식 페이지를 확인했으며, 경찰·청소년 사이트 자동 열람은 리디렉션/시간초과로 결과를 단정하지 않았다.

### Phase 1 — Interview

- 사용자 지시에 따라 A/B/C 권장안인 정기 최신성 게이트를 구현 범위로 확정했다.
- 비목표: 자동 전화, 실제 상담 가능 여부 단정, 외부 사이트를 무단 크롤링하거나 네트워크 결과를 성공 증빙으로 저장하는 기능.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·측정) | B(위기·자살예방) | C(구현·법무) | 결론 |
|---|---|---|---|---|
| 자원 갱신 | 최신 안내가 신뢰에 필수 | 번호·역할 오류는 위기 대응을 해침 | 사람이 검증한 날짜·근거를 코드화 | 90일 유효기간 |
| 외부 링크 검사 | — | 실제 연결 여부를 과장하면 안 됨 | 리디렉션/차단/시간초과가 가능 | 자동 HTTP 성공 검사 미도입 |
| 배포 연계 | — | 만료 자원으로 배포 방지 | npm 스크립트와 배포 스크립트 연결 | `resources:check` 필수 |

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC55~AC57을 추가하고 완료로 기록했다.

### Phase 4 — Implement

- `data/instruments.js`: 공식 검증 근거 URL과 90일 최대 유효기간을 추가했다.
- `bin/validate-resources.js`: 필수 자원·번호·HTTPS URL·근거 URL·검증일 형식/미래/만료를 검사한다.
- `package.json`: `resources:check` 및 자원 검사를 포함한 `release:ready`를 추가했다.
- `deploy/scripts/*.sh`: 빌드 전 자원 최신성 검사를 실행한다.
- `tests/instruments.test.js`, `tests/release.test.js`: 자원 메타·배포 게이트 회귀 검사를 추가했다.

### Phase 5 — Evaluate

- `npm.cmd run resources:check` PASS (2026-11-02, 90일 이내)
- `RESOURCE_CHECK_DATE=2027-02-01 npm.cmd run resources:check` EXPECTED FAIL (91일 경과)
- `npm.cmd run validate` PASS
- `npm.cmd test` PASS (62/62)
- `npm.cmd run a11y` PASS
- `npm.cmd run skill:check` PASS
- `npm.cmd run build:web` PASS (정적 경로 9개)
- `git diff --check` PASS

### Phase 6 — Evolve

- 자원 링크의 실제 동작·전화 연결·운영시간은 분기별 사람이 공식 사이트와 기기에서 재확인해야 한다.
- `release:ready`는 자원 최신성은 통과한 뒤에도 수동 접근성·한국어 타당화·법무/임상 증빙 미완료로 계속 차단된다.

◆ resource-freshness-gate-complete → next: 실제 수동 접근성 증빙, 이후 P0 임상·법무·운영 게이트

## Cycle 13 — Phase 0 공식 자원 재검증 (2026-11-06)

### Phase 0 — Inventory

- `RESOURCE_VERIFIED_AT`은 존재했으나, 공식 웹 검토와 실제 기기 검증을 구분하는 방식이 없었다.

### Phase 1 — Interview

- 사용자 요청에 따라 자원 최신성의 공식 근거 재검토를 구현 범위로 확정했다.
- 외부 통화·상담기관 연락·실기기 전화는 운영자 권한과 실제 사용자 영향을 수반하므로 수행하지 않는다.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·측정) | B(위기·자살예방) | C(구현·법무) | 결론 |
|---|---|---|---|---|
| 자원 갱신 표기 | 신뢰 가능한 안내 필요 | 위기 번호·역할 오류 방지 | 검증 방법을 데이터로 구분 | `official-web` 명시 |
| 실제 연결 | 임상 연결 성공과 다름 | 전화·기기별 동작은 실제 확인 필요 | 자동 웹 열람 실패를 성공으로 처리 금지 | 수동 증빙 유지 |

- 공식 웹 근거: 보건복지상담센터 109에서 109·1577-0199·1388·1588-9191 역할과 24시간 안내를, 경찰청에서 112 긴급신고를, 국가정신건강정보포털에서 센터 검색을 확인했다. 119는 공식 도메인·프레임 없는 페이지를 확인했다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC58~AC59를 추가하고 완료로 기록했다.

### Phase 4 — Implement

- `data/instruments.js`: `RESOURCE_VERIFIED_AT`을 2026-11-06으로 갱신하고 `RESOURCE_VERIFICATION_METHOD: official-web`을 추가했다.
- `bin/validate-resources.js`: 검증 방법을 검사·출력한다.
- `docs/research/resource-verification-2026-11-06.md`: 자원별 공식 근거와 제한을 기록했다.
- `tests/instruments.test.js`: 검증 방법 메타 회귀 검사를 추가했다.

### Phase 5 — Evaluate

- `npm.cmd run resources:check` PASS (2026-11-06, official-web, 90일 이내)
- `npm.cmd run validate` PASS
- `npm.cmd test` PASS (62/62)
- `npm.cmd run a11y` PASS
- `npm.cmd run skill:check` PASS
- `npm.cmd run build:web` PASS (정적 경로 9개)
- `git diff --check` PASS

### Phase 6 — Evolve

- 실제 전화·전화 앱·오프라인 PWA 검증은 완료되지 않았고, `release:ready` 차단을 해제하지 않는다.
- 다음 우선순위는 수동 접근성·기기 증빙이며, 이후 임상 BSSA/후속 연결 운영, 한국어 타당화, 법무·규제 검토가 남는다.

◆ phase0-resource-web-review-complete → next: 실제 수동 접근성·기기 증빙, 이후 P0 임상·법무·운영 게이트

## Cycle 14 — Phase 1 임상 후속연결 운영 게이트 (2026-11-06)

### Phase 0 — Inventory

- 현재 앱은 109·센터 안내만 제공하며, 특정 기관 예약·임상가 후속평가·데이터 전달·자동 통보를 운영하지 않는다.

### Phase 1 — Interview

- 사용자 지시에 따라 실제 기관 파트너가 없는 상태에서 가능한 권장 구현으로, 운영 프로토콜과 배포 차단 게이트를 확정했다.
- 비목표: 기관·임상가를 임의로 지정하거나, 자동 의뢰/구조, BSSA, 예약 기능을 구현하거나 주장하지 않는다.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·측정) | B(위기·자살예방) | C(구현·법무) | 결론 |
|---|---|---|---|---|
| ASQ 양성 후 | 훈련된 임상가 BSSA 필요 | 급성·비급성 분기와 실패 대안 필요 | 앱 단독 수행 불가 | 운영 증빙 없으면 배포 차단 |
| 109 지역 연계 | — | 본인 동의 기반 | 무동의 데이터 전송 금지 | 명시적 동의 원칙 문서화 |
| 실제 연결 기능 | 임상 책임 필요 | 자동 구조 오해 위험 | 기관 API/계약/PII 처리 필요 | 현 버전 미도입 |

- 웹 근거: NIMH는 ASQ 양성 뒤 훈련된 임상가의 BSSA를 권고하고, 109 공식 FAQ는 고위험 판단 시 본인 동의 후 지역 기관 연계가 가능하다고 안내한다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC60~AC62를 추가하고 완료로 기록했다.

### Phase 4 — Implement

- `docs/operations/clinical-handoff-protocol.md`: 앱 범위·BSSA 한계·동의 원칙·급성/비급성 경로·운영 증빙 템플릿을 추가했다.
- `bin/release-readiness.js`: 책임자/대체 인력, BSSA 훈련·가용시간, 시간 기준·대체 경로, 데이터 동의, 사고 대응 증빙이 없으면 차단한다.
- `tests/release.test.js`: 운영 증빙 게이트 존재를 회귀 검사한다.

### Phase 5 — Evaluate

- `npm.cmd run release:ready` EXPECTED BLOCKED (새 임상 후속연결 운영 증빙 5개 포함)
- `npm.cmd run validate` PASS
- `npm.cmd run resources:check` PASS
- `npm.cmd test` PASS (62/62)
- `npm.cmd run a11y` PASS
- `npm.cmd run skill:check` PASS
- `npm.cmd run build:web` PASS (정적 경로 9개)
- `git diff --check` PASS

### Phase 6 — Evolve

- 실제 기관 파트너·임상 운영 책임자·법무 권한 없이는 이 게이트를 완료 처리하거나 연결 기능을 활성화할 수 없다.
- 다음 우선순위는 수동 접근성·기기 증빙, 이후 임상 BSSA/후속연결 운영 증빙과 한국어 타당화·법무 검토다.

◆ phase1-clinical-handoff-gate-complete → next: 실제 수동 접근성·기기 증빙, 이후 P0 임상·법무·운영 게이트

## Cycle 15 — Phase 2 A/B/C 독립 검토 게이트 (2026-11-06)

### Phase 0 — Inventory

- 기존 리서치에는 내부 A/B/C 관점의 근거가 있었으나, 실제 독립 검토자의 역할별 의견과 배포 승인 증빙을 분리해 보관하는 게이트는 없었다.

### Phase 1 — Interview

- 사용자 요청에 따라 임상·위기·구현/프라이버시/법무의 근거를 교차검증하고, 실제 자격 보유 독립 검토가 끝나기 전 배포를 막는 권장안을 범위로 확정했다.
- 비목표: 모델의 검토를 전문가 승인으로 표기하거나, 진단·치료·자동 구조·무동의 데이터 전달을 추가하지 않는다.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·심리측정) | B(위기·자살예방) | C(구현·프라이버시·법무) | 결론 |
|---|---|---|---|---|
| PHQ/GAD 결과 표현 | 임상의 확인과 임상적 맥락이 필요 | 단독 점수로 위기 판정 금지 | 제품 문구가 진단처럼 보이면 안 됨 | 선별 결과·연결 권고만 유지 |
| ASQ 양성 | 의료 환경에서 검증된 선별 도구 | 양성 뒤 훈련된 임상가의 BSSA 필요 | 앱이 BSSA를 수행하거나 주장할 수 없음 | 위기 우선 안내와 운영 게이트 유지 |
| 한국어 번역 | 영문 원문 채점·타당화 전 임상 사용 금지 | 위기 문구의 오해를 줄여야 함 | 번역 상태를 메타·배포 게이트로 공개 | `unofficial` 상태와 차단 유지 |
| 연결·전달 | 실제 후속 책임자 필요 | 동의·대체 경로·장애 대응 필요 | PII·기관 계약·법적 검토 없이는 자동화 불가 | 자동 의뢰/전달 미도입 |
| 저장 | 점수는 임상 기록이 아님 | 안전 계획은 보조 수단일 뿐 | 원본 응답·서버 로그 없이 기기 내 최소 저장 | 현 저장 한계 유지 |

- 근거: PHQ Screeners는 응답을 임상가가 검증해야 하며 확정 진단에는 임상적 근거가 필요하다고 명시한다. NIMH는 ASQ를 의료 환경에서 검증된 선별도구로 설명한다. 식품의약품안전처의 의료기기 규제 안내와 MDN의 `sessionStorage` 문서도 검토했다. 링크와 적용 제한은 `docs/operations/abc-expert-review.md`에 기록했다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC63~AC65를 추가하고 완료로 기록했다.

### Phase 4 — Implement

- `docs/operations/abc-expert-review.md`: A/B/C 역할 경계, 근거·합의·충돌·비목표, 실제 독립 검토용 체크리스트와 증빙 식별자 규칙을 추가했다.
- `bin/release-readiness.js`: A·B·C 각각의 독립 검토 의견과 책임자 승인 증빙이 없으면 `release:ready`가 차단되도록 추가했다.
- `tests/release.test.js`: A/B/C 게이트와 검토 문서의 회귀 검사를 추가했다.

### Phase 5 — Evaluate

- `npm.cmd run release:ready` EXPECTED BLOCKED (기존 P0 항목과 새 A/B/C 독립 검토 증빙 4개가 미완료)
- `npm.cmd run resources:check` PASS (2026-11-06, official-web, 90일 이내)
- `npm.cmd run validate` PASS
- `npm.cmd test` PASS (62/62)
- `npm.cmd run a11y` PASS
- `npm.cmd run skill:check` PASS
- `npm.cmd run build:web` PASS (정적 경로 9개)
- `git diff --check` PASS

### Phase 6 — Evolve

- 모델·내부 문서의 교차검증은 실제 전문가 승인이나 법적 자문이 아니다. 실제 독립 검토자와 책임자의 증빙이 확인될 때까지 게이트를 해제하지 않는다.
- 다음 우선순위는 수동 접근성·기기 증빙이며, 이후 P0 독립 전문가·임상·법무 승인, 운영 준비도, 한국어 타당화가 남는다.

◆ phase2-independent-review-gate-complete → next: 실제 수동 접근성·기기 증빙, 이후 P0 독립 전문가·임상·법무 승인

## Cycle 16 — Phase 3 수동 접근성·실기기 증빙 레지스트리 (2026-11-06)

### Phase 0 — Inventory

- 기존 수동 테스트 계획과 배포 게이트는 체크박스 유무만 확인했다. 실제 장비·환경·시나리오·최근 결과를 구조적으로 확인하거나, 오래된 기록과 최근 실패를 구분하지 못했다.

### Phase 1 — Interview

- 사용자 지시에 따라 실제 수동 시험을 가장하지 않고, 사람이 수행할 시험의 증빙 형식·유효기간·배포 차단을 강화하는 권장 구현을 범위로 확정했다.
- 원장: 범위=수동 접근성·실기기 증빙, 제약=무개인정보·무실제 통화/상담, 산출물=레지스트리·정적 검증, 검증=자동 회귀+실제 기록 부재 시 차단.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·심리측정) | B(위기·자살예방) | C(구현·프라이버시·법무) | 결론 |
|---|---|---|---|---|
| 보조기술 시험 | 선별 결과와 한계 문구가 이해되어야 함 | 위기 동선·버튼이 실제로 발견·작동해야 함 | 정적 감사만으로 실제 사용성을 증명할 수 없음 | 사람의 수동 시험을 필수 증빙으로 유지 |
| 기록 내용 | 설문 내용·건강정보를 기록할 이유 없음 | 실제 통화 상대방 정보는 불필요 | 역할·환경·시나리오·결과·조치 식별자만 보관 | 최소 증빙 레지스트리 |
| 신선도·실패 | 오래된 확인은 현 UI를 보장하지 않음 | 최근 실패를 과거 PASS로 가리면 안 됨 | 기한과 최신 결과를 기계적으로 검사 가능 | 180일·최신 PASS 요구 |

- 웹 근거: W3C WAI는 자동 도구만으로 접근성 충족 여부를 판단할 수 없으며, 숙련된 사람의 평가가 필요하다고 설명한다. 자동 감사는 보조 수단으로 유지한다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC66~AC68을 추가하고 완료로 기록했다.

### Phase 4 — Implement

- `docs/operations/a11y-device-evidence.md`: 개인정보 없는 레코드 형식, 7개 필수 시나리오, 180일 재검증 규칙, 실제 시험의 한계를 명시한 레지스트리 템플릿을 추가했다.
- `lib/manual-verification.js`, `bin/validate-manual-verification.js`: ID·날짜·환경·시나리오·최신 PASS·유효기간을 검사하는 검증기를 추가했다.
- `bin/release-readiness.js`: 단순 체크박스 대신 레지스트리의 누락·만료·최근 실패를 모두 배포 차단 사유로 출력하도록 변경했다.
- `docs/a11y-manual-test-plan.md`, `package.json`, `tests/manual-verification.test.js`, `tests/release.test.js`: 계획 연결, `manual:check` 명령, 회귀 검사를 추가했다.

### Phase 5 — Evaluate

- `npm.cmd run manual:check` EXPECTED BLOCKED (7개 필수 시나리오에 실제 기록 없음)
- `npm.cmd run release:ready` EXPECTED BLOCKED (수동 증빙 외 기존 P0 타당화·법무·임상·독립 검토 증빙도 미완료)
- `npm.cmd run validate` PASS
- `npm.cmd run resources:check` PASS (2026-11-06, official-web, 90일 이내)
- `npm.cmd test` PASS (64/64)
- `npm.cmd run a11y` PASS
- `npm.cmd run skill:check` PASS
- `npm.cmd run build:web` PASS (정적 경로 9개)
- `git diff --check` PASS

### Phase 6 — Evolve

- 레지스트리 통과는 실제 수행 사실·임상 적절성·법적 효력·접근성 적합성 인증을 스스로 증명하지 않는다. 실제 보조기술 사용자/숙련 평가자와 기기에서 증빙을 남긴 뒤에만 각 행을 갱신한다.
- 다음 최고 영향 작업은 실제 NVDA·VoiceOver·TalkBack, 320px·200%, 전화 앱·오프라인 PWA 시험이다. 이후 P0 독립 전문가·임상 후속연결·법무 검토·한국어 타당화가 남는다.

◆ phase3-manual-evidence-gate-complete → next: 실제 수동 접근성·기기 증빙, 이후 P0 독립 전문가·임상·법무 승인

## Cycle 17 — Phase 4 한국어 타당화 증빙 레지스트리 (2026-11-06)

### Phase 0 — Inventory

- 현재 PHQ-9·PHQ-A·GAD-7과 비채점 기능손상 문항의 한국어 상태는 `unofficial`이다. 기존 릴리스 게이트는 `translationStatus` 체크 한 줄만 확인하므로, 번역 대조·인지면담·심리측정·독립 임상 검토와 문항 변경의 연결을 검증하지 못했다.

### Phase 1 — Interview

- 사용자 지시에 따라 실제 타당화 연구나 승인을 가장하지 않고, 연구 증빙의 최소 형식과 현재 문항 지문의 연결을 배포 게이트로 강화하는 권장 구현을 범위로 확정했다.
- 원장: 범위=한국어 타당화 증빙, 제약=연구 원자료/PII 비저장·ASQ/위기 라우팅 불변·`unofficial` 유지, 산출물=레지스트리·정적 검증, 검증=증빙 부재 시 차단.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·심리측정) | B(위기·자살예방) | C(구현·프라이버시·법무) | 결론 |
|---|---|---|---|---|
| 한국어판 측정 동등성 | 번역 뒤 구조·신뢰도·준거·불변성 검토 필요 | 오해가 위기 신호를 가리지 않아야 함 | 코드 메타만 변경해서는 증명 불가 | 단계별 연구 증빙 요구 |
| ASQ 처리 | NIMH 공식 한국어판 유지 | 양성 뒤 훈련된 임상가 BSSA 필요 | 일반 번역 타당화 상태로 대체 금지 | ASQ·위기 우선 흐름 불변 |
| 연구 기록 | 임상 판단은 독립 검토 필요 | 참여자 안전·위기 대응 계획 필요 | 원자료·PII를 정적 앱 저장소에 두면 안 됨 | 비식별 증빙 식별자만 기록 |
| 문항 변경 | 새 문항은 새 검증 범위 필요 | 안전 문구 변경도 재검토 필요 | 해시로 범위 불일치 탐지 가능 | 현재 한국어 해시 일치 요구 |

- 웹 근거: COSMIN은 번역·문화 적응 PROM의 교차문화 타당도/측정 불변성 평가를 설명한다. NIMH는 ASQ 양성 후 훈련된 임상가의 BSSA를 요구한다. 따라서 타당화 레지스트리는 ASQ 후속평가를 대체하지 않는다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC69~AC71을 추가하고 완료로 기록했다.

### Phase 4 — Implement

- `docs/operations/korean-validation-evidence.md`: 비식별 증빙 레지스트리, 필수 8단계, PHQ-9·PHQ-A·GAD-7·기능손상 범위와 문항 해시 규칙을 추가했다.
- `lib/korean-validation-evidence.js`, `bin/validate-korean-validation-evidence.js`: 단계·결과·범위·현재 문항 지문 해시를 검사하는 검증기를 추가했다.
- `bin/release-readiness.js`: 새 타당화 증빙 레지스트리 누락·최근 실패·해시 불일치를 배포 차단 사유로 출력하도록 추가했다.
- `docs/validation/korean-instrument-validation-plan.md`, `package.json`, `tests/korean-validation-evidence.test.js`, `tests/release.test.js`: 계획 연결, `validation:evidence:check` 명령, 회귀 검사를 추가했다.

### Phase 5 — Evaluate

- `npm.cmd run validation:evidence:check` EXPECTED BLOCKED (8개 필수 단계·4개 현재 문항 해시에 실제 증빙 없음)
- `npm.cmd run release:ready` EXPECTED BLOCKED (새 타당화 증빙 외 수동 접근성·법무·임상·독립 검토 증빙도 미완료)
- `npm.cmd run validate` PASS
- `npm.cmd run resources:check` PASS (2026-11-06, official-web, 90일 이내)
- `npm.cmd test` PASS (66/66)
- `npm.cmd run a11y` PASS
- `npm.cmd run skill:check` PASS
- `npm.cmd run build:web` PASS (정적 경로 9개)
- `git diff --check` PASS

### Phase 6 — Evolve

- 이 레지스트리는 연구의 과학적 적절성·IRB 효력·임상/법무 승인 사실을 자동으로 증명하지 않는다. 실제 연구 책임자와 독립 심리측정·임상·법무 검토가 해당 증빙을 확인해야 한다.
- 다음 최고 영향 작업은 실제 수동 접근성·기기 증빙, IRB/연구 거버넌스와 한국어 타당화 착수, 임상 후속연결 운영·독립 전문가·법무 검토다.

◆ phase4-korean-validation-evidence-gate-complete → next: 실제 수동 접근성·기기 증빙 또는 IRB 기반 한국어 타당화 착수

## Cycle 18 — Phase 5 법무·규제 증빙 레지스트리 (2026-11-06)

### Phase 0 — Inventory

- 기존 법무 게이트는 법무 의견서와 임상 자문 기록의 체크박스 두 개만 확인했다. 제품 분류, 사용자 주장, 프라이버시, 도구 라이선스, 위기 운영, 실제 배포 후보 범위가 각각 검토됐는지는 확인할 수 없었다.

### Phase 1 — Interview

- 사용자 지시에 따라 실제 법률 자문·규제 승인·허가를 가장하지 않고, 실제 검토 전 배포를 막는 역할별 증빙 레지스트리와 배포 후보 범위 연결을 구현 범위로 확정했다.
- 원장: 범위=법무·규제 증빙, 제약=무개인정보·무법률판단 자동화·선별+연결/무백엔드/위기 우선 유지, 산출물=레지스트리·90일 게이트·범위 해시, 검증=증빙 부재 시 차단.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·심리측정) | B(위기·자살예방) | C(구현·프라이버시·법무) | 결론 |
|---|---|---|---|---|
| 제품 주장·분류 | 선별을 진단으로 확대하면 안 됨 | 위기 안내가 임상 서비스로 오인되면 안 됨 | 사용목적·기능별 실제 법무/규제 판단 필요 | 제품 분류·주장 문구 별도 검토 |
| 개인정보 | 결과·점수는 임상기록이 아님 | 위기 상황에도 무동의 전달 금지 | 무백엔드라도 로컬 저장·향후 변경의 조건 검토 필요 | 프라이버시 단계 분리 |
| 도구·위기 운영 | 번역·라이선스·사용 범위 확인 필요 | ASQ 양성 후 BSSA·기관 운영은 앱이 대체 불가 | 증빙에 PII·의견 전문을 저장하면 안 됨 | 비식별 참조만 기록 |
| 배포 후보 변경 | 결과 문구·라우팅 변경은 임상 의미가 있음 | 위기 버튼 변경은 실제 안전 영향 | 이전 검토를 다른 빌드에 재사용하면 안 됨 | 90일·배포 후보 범위 해시 요구 |

- 웹 근거: 식약처는 2026-02-12에 최신 법령을 반영한 의료기기·개인용 건강관리(웰니스) 판단기준을 개정했고, 국가법령정보센터의 디지털의료제품법은 질병의 진단·치료·예후 관찰 목적 등을 디지털의료기기 정의에 포함한다. 이는 이 앱의 법적 지위를 확정하지 않으며 실제 전문가 검토가 필요하다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC72~AC74를 추가하고 완료로 기록했다.

### Phase 4 — Implement

- `docs/operations/legal-review-evidence.md`: 여섯 필수 법무·규제 검토 단계, 비식별 증빙 규칙, 90일 재검토, 배포 후보 범위 해시 규칙을 추가했다.
- `lib/legal-review-evidence.js`, `lib/release-scope-fingerprint.js`, `bin/validate-legal-review-evidence.js`: 단계·결과·기한·현재 배포 후보 범위를 검사하는 검증기를 추가했다.
- `bin/release-readiness.js`: 새 법무·규제 증빙 레지스트리의 누락·만료·최근 실패·범위 해시 불일치를 배포 차단 사유로 추가했다.
- `docs/legal-review-checklist.md`, `package.json`, `tests/legal-review-evidence.test.js`, `tests/release.test.js`: 레지스트리 연결, `legal:evidence:check` 명령, 회귀 검사를 추가했다.

### Phase 5 — Evaluate

- `npm.cmd run legal:evidence:check` EXPECTED BLOCKED (6개 필수 단계와 현재 배포 후보 범위에 실제 검토 증빙 없음)
- `npm.cmd run release:ready` EXPECTED BLOCKED (법무 증빙 외 수동 접근성·한국어 타당화·임상·독립 검토 증빙도 미완료)
- `npm.cmd run validate` PASS
- `npm.cmd run resources:check` PASS (2026-11-06, official-web, 90일 이내)
- `npm.cmd test` PASS (68/68)
- `npm.cmd run a11y` PASS
- `npm.cmd run skill:check` PASS
- `npm.cmd run build:web` PASS (정적 경로 9개)
- `git diff --check` PASS

### Phase 6 — Evolve

- 이 레지스트리는 법률 자문, 식약처 분류, 허가·신고 필요 여부, 개인정보 적법성이나 실제 승인 사실을 자동으로 판단하지 않는다. 실제 검토 권한자와 기관이 배포 후보를 확인해야 한다.
- 다음 최고 영향 작업은 실제 수동 접근성·기기 증빙, 한국어 타당화 거버넌스/연구, 임상 후속연결 운영 및 독립 전문가·법무 검토다.

◆ phase5-legal-evidence-gate-complete → next: 실제 수동 접근성·기기 증빙 또는 P0 법무·임상 검토 착수

## Cycle 19 — Phase 6 임상 후속연결 운영 증빙 레지스트리 (2026-11-06)

### Phase 0 — Inventory

- 기존 임상 후속연결 프로토콜은 운영 원칙과 체크리스트를 제공했지만, 책임·BSSA 훈련·급성/비급성 경로·동의·장애/사고·운영 승인의 실제 증빙과 현재 앱/프로토콜 범위의 연결을 구조적으로 검사하지 못했다.

### Phase 1 — Interview

- 사용자 지시에 따라 실제 기관 운영이나 BSSA를 수행했다고 주장하지 않고, 실제 운영 전 배포를 차단하는 단계별 증빙 레지스트리를 구현 범위로 확정했다.
- 원장: 범위=선택적 임상 후속연결 운영 증빙, 제약=무환자정보·무자동의 전송·무자동 구조·공개 앱 기능 불변, 산출물=레지스트리·90일·운영 범위 해시, 검증=증빙 부재 시 차단.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·심리측정) | B(위기·자살예방) | C(구현·프라이버시·법무) | 결론 |
|---|---|---|---|---|
| ASQ 양성 후 | 훈련된 임상가 BSSA가 필요 | 급성·비급성에 따른 처분·대체 경로 필요 | 앱이 BSSA를 수행하거나 그 결과를 저장할 수 없음 | BSSA 훈련·가용시간 증빙 요구 |
| 기관 연계 | 후속평가 책임자가 필요 | 109 연계도 본인 동의 전제 | 무동의 데이터 전송·자동 의뢰 금지 | 동의/데이터 단계 분리 |
| 운영 장애 | 임상적 악화·연결 실패를 추적해야 함 | 담당자 부재·야간·사고 시 대안 필요 | PII 없이 절차·증빙 식별자만 보관 | 장애/사고 단계 분리 |
| 앱/프로토콜 변경 | 결과·라우팅 변경은 해석에 영향 | 위기 동선 변경은 안전에 영향 | 과거 운영 승인 재사용 방지 필요 | 90일·운영 범위 해시 요구 |

- 웹 근거: NIMH ASQ Toolkit은 양성 선별 후 훈련된 임상가의 BSSA와 후속 처분 계획을 안내하며, 각 의료 환경이 양성 응답을 관리할 계획을 사전에 갖춰야 한다고 설명한다. 109 공식 FAQ는 고위험 판단 시 본인 동의 후 지역 기관 연계가 가능하다고 안내한다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC75~AC77을 추가하고 완료로 기록했다.

### Phase 4 — Implement

- `docs/operations/clinical-handoff-evidence.md`: 여섯 필수 운영 단계, 비식별 증빙 규칙, 90일 재검토, 앱+프로토콜 운영 범위 해시 규칙을 추가했다.
- `lib/clinical-handoff-evidence.js`, `lib/clinical-handoff-scope-fingerprint.js`, `bin/validate-clinical-handoff-evidence.js`: 단계·결과·기한·현재 운영 범위를 검사하는 검증기를 추가했다.
- `bin/release-readiness.js`: 새 임상 후속연결 운영 증빙의 누락·만료·최근 실패·범위 해시 불일치를 배포 차단 사유로 추가했다.
- `docs/operations/clinical-handoff-protocol.md`, `package.json`, `tests/clinical-handoff-evidence.test.js`, `tests/release.test.js`: 레지스트리 연결, `clinical:handoff:check` 명령, 회귀 검사를 추가했다.

### Phase 5 — Evaluate

- `npm.cmd run clinical:handoff:check` EXPECTED BLOCKED (6개 필수 운영 단계와 현재 운영 범위에 실제 증빙 없음)
- `npm.cmd run release:ready` EXPECTED BLOCKED (임상 운영 증빙 외 수동 접근성·한국어 타당화·법무·독립 검토 증빙도 미완료)
- `npm.cmd run validate` PASS
- `npm.cmd run resources:check` PASS (2026-11-06, official-web, 90일 이내)
- `npm.cmd test` PASS (70/70)
- `npm.cmd run a11y` PASS
- `npm.cmd run skill:check` PASS
- `npm.cmd run build:web` PASS (정적 경로 9개)
- `git diff --check` PASS

### Phase 6 — Evolve

- 이 레지스트리는 실제 BSSA 역량, 기관 계약, 임상적 적절성, 법률 의무, 운영 가용성이나 승인 사실을 자동으로 증명하지 않는다. 기관의 임상·법무·운영 책임자가 실제 증빙을 검토해야 한다.
- 다음 최고 영향 작업은 실제 수동 접근성·기기 증빙, IRB 기반 한국어 타당화, 독립 전문가·법무 검토, 필요 시 실제 임상 후속연결 운영의 단계별 증빙이다.

◆ phase6-clinical-handoff-evidence-gate-complete → next: 실제 수동 접근성·기기 증빙 또는 P0 독립 전문가·법무·임상 검토 착수

## Cycle 20 — 개인정보·네트워크 경계 정적 감사 (2026-11-06)

### Phase 0 — Inventory

- 프로젝트 원칙은 서버·분석 SDK·응답 로그 미사용이지만, 앱 소스에 자동 전송 API가 새로 추가되는 것을 막는 정적 검증은 없었다.
- 현재 서비스 워커의 `fetch` 처리는 동일 출처의 정적 자산과 오프라인 위기 안내 캐시를 위한 것으로, 앱 분석이나 설문 응답 전송과는 구별해야 했다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서, 새 임상 기능 대신 민감한 선별 응답의 자동 전송이 다시 들어오지 않도록 정적 감사와 배포 준비도 연결을 구현 대상으로 확정했다.
- 제약: 사용자가 명시적으로 여는 전화·공식 자원 링크와 동일 출처 오프라인 캐시는 유지하고, 서버·분석·원본 응답 로그·백그라운드 동기화는 추가하지 않는다.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·심리측정) | B(위기·자살예방) | C(구현·프라이버시) | 결론 |
|---|---|---|---|---|
| 자동 응답 전송 | 건강·위기 응답은 최소 처리해야 함 | 추적이 위기 연결을 대체하면 안 됨 | 전송 API·분석 SDK·응답 로그를 소스에서 차단 가능 | 자동 전송·분석·응답 콘솔 로그 금지 |
| 서비스 워커 | 오프라인 위기 안내는 접근성을 높임 | 연결 단절 시 정적 안내가 필요 | 동일 출처 캐시만 허용하고 외부 URL·주기 동기화·백그라운드 전송 차단 | 정적 캐시 예외를 명시 |
| 사용자 동작 링크 | 지원 자원 접근을 보존 | 전화·공식 자원 연결이 필요 | 앱 응답을 전달하지 않는 명시적 `tel:`·공식 링크는 유지 | 사용자 개시 링크 허용 |

- 웹 교차검증: 개인정보보호법은 건강에 관한 정보를 민감정보로 분류한다. MDN은 서비스 워커의 `fetch` 이벤트가 요청을 가로채 캐시 응답을 제공할 수 있음을 설명하므로, 동일 출처 정적 캐시와 텔레메트리를 문서·검사에서 분리했다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC78~AC80을 추가하고 완료로 기록했다.

### Phase 4 — Implement

- `lib/privacy-audit.js`, `bin/privacy-audit.js`: 앱 디렉터리의 자동 네트워크 API, 분석·크래시 SDK, 콘솔 응답 로그를 검사하고 서비스 워커의 동일 출처 제한·외부 URL·백그라운드 동기화 금지를 검사하도록 추가했다.
- `docs/operations/privacy-network-boundary.md`: 허용되는 사용자 개시 링크·오프라인 캐시와 검사 한계를 문서화했다.
- `package.json`, `tests/privacy-audit.test.js`, `tests/release.test.js`: `privacy:check` 명령과 배포 준비도 선행 검사를 추가했다.
- 실시간 보완: 감사 규칙 파일 자체가 금지어 목록을 포함해 처음에는 오탐이 발생했다. 런타임 제품 코드가 아닌 `lib/privacy-audit.js` 한 파일만 명시적으로 제외하고 그 이유를 코드와 운영 문서에 기록했다.

### Phase 5 — Evaluate

```text
npm.cmd run privacy:check → PASS (앱 소스 25개, 동일 출처 SW 캐시만 허용)
npm.cmd run release:ready → EXPECTED BLOCKED (기존 실제 수동·타당화·법무·임상·독립 검토 증빙 미완료; privacy 검사는 PASS)
npm.cmd run validate      → PASS
npm.cmd test              → 72/72 PASS
npm.cmd run a11y          → PASS
npm.cmd run skill:check   → PASS
npm.cmd run build:web     → PASS (정적 경로 9개)
git diff --check          → PASS
```

### Phase 6 — Evolve

- 이 정적 감사는 배포 인프라, 의존성 공급망, 브라우저 런타임 또는 실제 법적 적법성을 완전하게 증명하지 않는다. 외부 API·SDK·서버 기능을 추가하려면 배포 전 독립 프라이버시·법무 검토가 필요하다.
- 다음 최고 영향 작업은 코드가 아닌 실제 수동 접근성·기기 증빙 또는 P0 독립 전문가·법무·임상 검토다.

◆ privacy-network-boundary-audit-complete → next: 실제 수동 접근성·기기 증빙 또는 P0 독립 전문가·법무·임상 검토 착수

## Cycle 21 — 기기 내 저장 경계 감사 (2026-11-06)

### Phase 0 — Inventory

- 기존 코드에는 동의, 결과 요약, 추이, 안전 계획을 위한 브라우저 저장소가 있었고, 결과 세션의 원본 응답 제외는 단위 테스트로 확인하고 있었다.
- 그러나 새 `localStorage`·`sessionStorage` writer가 앱 코드에 추가되는 것을 전역적으로 차단하는 정적 감사는 없었다.

### Phase 1 — Interview

- 사용자가 남은 페이즈를 순차 진행하도록 위임한 범위에서, 실제 사람·기관의 수동·임상·법무 증빙은 대체하지 않고 코드로 가능한 다음 보완을 선택했다.
- 범위는 기기 내 저장 경계의 자동 회귀 방지다. 비목표는 원본 설문 응답의 보존, 서버 전송, 새 임상 판단, 실제 검토 증빙의 자동 생성이다.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·심리측정) | B(위기·자살예방) | C(구현·프라이버시) | 결론 |
|---|---|---|---|---|
| 결과 저장 | 선별 요약은 진단기록으로 확장하지 않음 | 위기 중 결과 전달과 안전 계획 접근은 유지 | 탭 세션에는 점수·밴드·위험 요약만 | 결과 요약 writer를 명시 |
| 장기 저장 | 추이를 위한 최소 요약만 | 선택 안전 계획은 사용자가 삭제할 수 있어야 함 | `localStorage` writer·키를 선언 목록으로 제한 | 추이·안전계획 두 writer만 허용 |
| 새 저장 기능 | 민감 응답 확산 금지 | 위기 동선을 훼손하지 않음 | 선언되지 않은 `.setItem()`을 빌드 전 실패시킴 | 정적 감사와 배포 게이트 연결 |

- 웹 교차검증: 개인정보보호법은 건강 정보를 민감정보로 다루고 별도 동의 또는 법적 근거와 안전조치를 요구한다. MDN은 `sessionStorage`가 탭 종료 시 소멸하고 `localStorage`가 브라우저 재시작 뒤에도 남는다고 설명한다. 따라서 두 보관 성격을 문서와 검사에서 구분했다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC81~AC83을 추가하고 완료로 기록했다.

### Phase 4 — Implement

- `lib/storage-boundary-audit.js`, `bin/storage-boundary-audit.js`: 동의·결과 요약·추이·선택 안전계획의 네 선언 writer만 허용하고, 파일·저장소·키 불일치와 다른 `.setItem()`을 차단하도록 추가했다.
- `docs/operations/device-storage-boundary.md`: 저장소 종류, 키, 보관 기간, 허용 데이터, 원본 응답·자동 외부 전송 금지와 검사 한계를 문서화했다.
- `package.json`, `tests/storage-boundary-audit.test.js`, `tests/release.test.js`: `storage:check`과 `release:ready` 선행 검사를 추가했다.

### Phase 5 — Evaluate

```text
npm.cmd run storage:check → PASS (선언 writer 4개, 앱 소스 25개)
npm.cmd test              → 74/74 PASS
npm.cmd run validate      → PASS
npm.cmd run a11y          → PASS
npm.cmd run skill:check   → PASS
npm.cmd run build:web     → PASS (정적 경로 9개)
npm.cmd run release:ready → EXPECTED BLOCKED (privacy·storage 검사는 PASS, 실제 수동·타당화·법무·임상 증빙 미완료)
git diff --check          → PASS
```

### Phase 6 — Evolve

- 정적 검사는 코드의 새로운 저장 writer를 포착하지만, 브라우저/운영체제 저장소 암호화, 배포 인프라, 타사 삽입 코드, 실제 법적 적법성은 보증하지 않는다.
- 다음 우선순위는 구현이 아니라 실제 NVDA·VoiceOver·TalkBack/기기 시험과 독립 A/B/C·법무·임상 검토, 이후 IRB 기반 한국어 타당화다. 기관 임상 후속연결은 실제 운영을 활성화할 때만 진행한다.

◆ device-storage-boundary-audit-complete → next: 실제 수동 접근성·기기 증빙 또는 P0 독립 전문가·법무·임상 검토 착수

## Cycle 22 — 정적 웹 CSP 배포 경계 (2026-11-06)

### Phase 0 — Inventory

- Nginx에는 기본 보안 헤더가 있었지만 Content-Security-Policy(CSP)는 없었다. 앱 HTML은 서비스 워커 등록·skip link 보조 코드와 전역 CSS를 인라인으로 삽입하고 있었다.
- 정적 웹은 응답·안전 계획 메모 같은 민감 정보를 브라우저에 표시하므로, 외부 스크립트·연결·프레임을 자동으로 추가할 수 없게 하는 배포 경계가 필요했다.

### Phase 1 — Interview

- 사용자가 권장 구현 선택을 위임한 범위에서, 임상 로직·위기 번호·사용자 개시 외부 링크를 바꾸지 않고 정적 웹 배포의 XSS·외부 로드 경계를 강화하는 것을 목표로 확정했다.
- 제약: Expo 정적 출력·PWA·오프라인 위기 안내·skip link 접근성을 보존하고, 실제 TLS·서버 운영·침투 시험을 완료했다고 주장하지 않는다.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·심리측정) | B(위기·자살예방) | C(구현·프라이버시) | 결론 |
|---|---|---|---|---|
| 임상 흐름 | 새 판단·데이터 처리를 추가하지 않음 | 선별·결과·위기 라우팅 불변 | 배포 계층에서만 보완 가능 | 임상 코드 변경 없음 |
| 위기 자원 | 위기 링크 접근성 유지 | 전화·공식 자원은 사용자 행동으로 열려야 함 | 자동 네트워크 로드는 `connect-src 'self'`로 제한 | 사용자 개시 링크 유지 |
| 인라인 코드 | — | skip link·PWA 등록이 끊기면 안 됨 | 고유 코드를 외부 자산으로 분리하고 Expo hydration만 해시로 허용 | script `unsafe-inline` 제거 |
| HTTPS 승격 | — | 인증서 전 접근 중단은 위기 상황에 부적절 | 현재 템플릿에 TLS 리스너가 없으므로 CSP의 `upgrade-insecure-requests`는 성급함 | 실제 TLS 배포 단계로 보류 |

- 웹 교차검증: MDN은 CSP가 XSS와 클릭재킹 위험을 줄이고 모든 응답의 CSP 헤더로 제공되어야 한다고 설명한다. 정적 접근성 자동 감사가 수동 검증을 대체하지 않는다는 W3C 원칙도 유지했다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC84~AC86을 추가하고 완료로 기록했다.

### Phase 4 — Implement

- `public/bootstrap.js`, `public/global.css`: 앱 고유의 서비스 워커 등록·skip link 보조 코드·전역 접근성 CSS를 정적 자산으로 분리했다.
- `app/+html.js`: 인라인 `dangerouslySetInnerHTML`을 제거하고 정적 자산을 참조한다.
- `deploy/nginx/depression-check.conf`: 동일 출처 코드·연결·워커·매니페스트만 허용하고, 객체·프레임·폼 제출을 제한하는 CSP를 모든 응답에 추가했다. Expo hydration 플래그의 SHA-256만 예외로 허용한다.
- `bin/security-header-audit.js`, `docs/operations/static-web-csp.md`, `package.json`, `tests/release.test.js`: CSP 정적 감사·배포 준비도 연결·운영 한계를 추가했다.
- 실시간 보완: 처음에는 접근성 감사가 기존 인라인 위치만 검사해 오탐 4건이 발생했다. `public/global.css`·`public/bootstrap.js`까지 검사하도록 수정했다. 또한 인증서 설치 전 HTTP 접근을 막을 수 있는 `upgrade-insecure-requests`는 제거하고 실제 TLS 배포 단계의 검증 항목으로 남겼다.

### Phase 5 — Evaluate

```text
npm.cmd run security:check → PASS
npm.cmd run validate       → PASS
npm.cmd run a11y           → PASS
npm.cmd test               → 74/74 PASS
npm.cmd run skill:check    → PASS
npm.cmd run build:web      → PASS (정적 경로 9개, bootstrap.js·global.css 포함, hydration 형태 확인)
npm.cmd run release:ready  → EXPECTED BLOCKED (보안 검사는 PASS, 실제 수동·타당화·법무·임상 증빙 미완료)
git diff --check           → PASS
```

### Phase 6 — Evolve

- CSP 정적 감사는 실제 서버의 TLS 설정, 헤더 적용 범위, Expo 업데이트 뒤 hydration 해시, 브라우저별 PWA·위기 동선을 보증하지 않는다. 배포 후보 서버에서 CSP 위반과 실기기 경로를 수동 확인해야 한다.
- 다음 최고 영향 작업은 코드가 아닌 실제 수동 접근성·기기 증빙, 독립 A/B/C·법무·임상 검토, IRB 기반 한국어 타당화다.

◆ static-web-csp-boundary-complete → next: 실제 수동 접근성·기기 증빙 또는 P0 독립 전문가·법무·임상 검토 착수

## Cycle 23 — PWA 정적 위기 자산 사전 캐시 (2026-11-06)

### Phase 0 — Inventory

- Cycle 22에서 `bootstrap.js`와 `global.css`를 인라인 코드에서 정적 자산으로 분리했지만, 서비스 워커 설치 시 사전 캐시 목록에는 아직 없었다.
- 기존 서비스 워커는 동일 출처 GET 정적 자산만 런타임 캐시하고, 탐색 요청이 오프라인이면 `offline.html`의 위기 안내를 보여주는 보수적 구조였다.

### Phase 1 — Interview

- 사용자가 권장 구현을 위임한 범위에서, 새 임상 기능이나 응답 저장 없이 설치 직후 오프라인 위기 안내·기본 접근성 자산의 일관성을 강화하는 것을 목표로 확정했다.
- 제약: 설문 응답·결과 세션·안전 계획 메모·외부 URL·백그라운드 동기화는 캐시하지 않고, 실제 기기 시험을 자동 검증으로 대체하지 않는다.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·심리측정) | B(위기·자살예방) | C(구현·프라이버시) | 결론 |
|---|---|---|---|---|
| 임상 로직 | 척도·결과·라우팅 불변 | 위기 안내가 먼저여야 함 | 서비스 워커만 최소 수정 | 임상 코드 변경 없음 |
| 오프라인 자산 | — | 설치 뒤 위기 안내·기본 조작이 일관돼야 함 | `cache.addAll()`에 정적 자산을 명시 가능 | bootstrap·CSS 사전 캐시 |
| 캐시 범위 | 응답 보존 금지 | 오프라인은 구조·추적을 뜻하지 않음 | 동일 출처 GET 정적 자산만, 저장소·전송 API 금지 | 정적 감사 추가 |

- 웹 교차검증: MDN은 서비스 워커 설치에서 `Cache.addAll()`로 필요한 자산을 명시적으로 캐시하는 방식을 설명한다. 이 기능은 HTTPS 보안 컨텍스트에서만 지원되므로 실제 TLS·기기 검증은 별도 게이트로 유지했다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC87~AC89를 추가하고 완료로 기록했다.

### Phase 4 — Implement

- `public/sw.js`: 캐시를 `maeumcheck-v3`로 갱신하고 `/bootstrap.js`, `/global.css`를 기존 오프라인 안내·매니페스트·아이콘 사전 캐시 목록에 추가했다.
- `bin/pwa-audit.js`, `docs/operations/pwa-offline-boundary.md`, `package.json`, `tests/release.test.js`: 필수 사전 캐시, 동일 출처·GET 경계, 전송/저장소 API 부재를 검사하는 `pwa:check`과 배포 준비도 연결을 추가했다.
- 실시간 보완: 첫 감사 규칙은 `OFFLINE_URL` 상수가 존재하면 다른 자산 누락도 통과할 수 있었다. 자산별 토큰을 검사하도록 즉시 수정했다. 캐시 v3 변경 뒤 접근성 감사가 v2만 허용하던 오탐도 v3 검사로 갱신했다.

### Phase 5 — Evaluate

```text
npm.cmd run pwa:check     → PASS (필수 자산 8개, 동일 출처 GET 캐시)
npm.cmd test              → 74/74 PASS
npm.cmd run build:web     → PASS (정적 경로 9개, dist/sw.js의 bootstrap·CSS 사전 캐시 확인)
npm.cmd run validate      → PASS
npm.cmd run a11y          → PASS
npm.cmd run security:check → PASS
npm.cmd run skill:check   → PASS
npm.cmd run release:ready → EXPECTED BLOCKED (자동 PWA 검사는 PASS, 실제 수동·타당화·법무·임상 증빙 미완료)
git diff --check          → PASS
```

### Phase 6 — Evolve

- 정적 감사는 실제 설치 브라우저의 캐시 용량·갱신 시점·전화 앱 전환·오프라인 화면 가독성을 증명하지 않는다. `OFFLINE-CRISIS`와 `PHONE-APP` 수동 실기기 시나리오를 실제로 기록해야 한다.
- 다음 최고 영향 작업은 코드가 아닌 실제 수동 접근성·기기 증빙, 독립 A/B/C·법무·임상 검토, IRB 기반 한국어 타당화다.

◆ pwa-offline-static-boundary-complete → next: 실제 수동 접근성·기기 증빙 또는 P0 독립 전문가·법무·임상 검토 착수

## Cycle 24 — 빌드 산출물 CSP 해시 검증 (2026-11-06)

### Phase 0 — Inventory

- Cycle 22의 `security:check`는 Nginx CSP 설정과 소스의 정적 자산 분리만 검사했다. Expo 업데이트로 실제 `dist/index.html`의 hydration inline script가 바뀌어도 CSP 해시 불일치를 자동으로 발견하지 못했다.
- 배포 스크립트는 `build:web` 뒤 `release:ready`를 실행하므로, 산출물 검사를 해당 게이트에 안전하게 추가할 수 있었다.

### Phase 1 — Interview

- 사용자 위임 범위에서 임상 로직·문항·위기 자원을 바꾸지 않고, CSP가 앱 초기화 자체를 차단해 위기 동선이 실패할 수 있는 빌드-배포 불일치를 막는 것을 목표로 확정했다.
- 제약: 소스만이 아니라 실제 정적 산출물을 검사하고, 예상하지 않은 inline script는 허용하지 않으며, 실제 TLS·브라우저·기기 동작을 자동 검사로 가장하지 않는다.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·심리측정) | B(위기·자살예방) | C(구현·프라이버시) | 결론 |
|---|---|---|---|---|
| 임상 범위 | 척도·결과 변화 불필요 | 위기 흐름 보존이 핵심 | 빌드/배포 계층에서 해결 | 임상 코드 불변 |
| CSP hash | — | 초기화 실패는 위기 자원 접근 실패로 이어질 수 있음 | 실제 hydration 문자열을 SHA-256으로 계산 가능 | 산출물과 Nginx 해시 대조 |
| inline scripts | — | 예측 불가한 코드 추가를 허용하지 않음 | 현재 Expo hydration 하나만 기대 | 1개 초과·누락은 실패 |
| 한계 | — | 실제 기기·TLS 경로는 확인 필요 | 정적 산출물 검사는 서버 응답을 대신하지 않음 | 수동 게이트 유지 |

- 웹 교차검증: MDN은 CSP가 허용되는 JavaScript 리소스를 제어해 XSS를 완화한다고 설명한다. 따라서 실제 산출물의 inline script가 정책과 일치하는지 대조해야 한다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC90~AC92를 추가하고 완료로 기록했다.

### Phase 4 — Implement

- `bin/security-build-audit.js`: `dist/index.html`의 inline script 수를 확인하고, Expo hydration script의 SHA-256을 계산해 Nginx CSP `script-src`와 대조하며, `bootstrap.js`·`global.css` 산출물 존재를 검사하도록 추가했다.
- `package.json`, `tests/release.test.js`, `docs/operations/static-web-csp.md`: `security:build:check`과 `release:ready` 연결·운영 한계를 추가했다.

### Phase 5 — Evaluate

```text
npm.cmd run build:web              → PASS (정적 경로 9개)
npm.cmd run security:build:check   → PASS (hydration 해시·inline script·정적 자산)
npm.cmd test                       → 74/74 PASS
npm.cmd run validate               → PASS
npm.cmd run a11y                   → PASS
npm.cmd run security:check         → PASS
npm.cmd run pwa:check              → PASS
npm.cmd run skill:check            → PASS
npm.cmd run release:ready          → EXPECTED BLOCKED (자동 보안 검사는 PASS, 실제 수동·타당화·법무·임상 증빙 미완료)
git diff --check                   → PASS
```

### Phase 6 — Evolve

- 이 감사는 현재 빌드 산출물과 저장소의 Nginx 템플릿만 대조한다. 실제 CDN/프록시/서버 응답 헤더, TLS, 브라우저 CSP 위반, 실기기 PWA 동작은 배포 후보에서 별도로 확인해야 한다.
- 다음 최고 영향 작업은 코드가 아닌 실제 수동 접근성·기기 증빙, 독립 A/B/C·법무·임상 검토, IRB 기반 한국어 타당화다.

◆ build-csp-integrity-gate-complete → next: 실제 수동 접근성·기기 증빙 또는 P0 독립 전문가·법무·임상 검토 착수

## Cycle 25 — 위기 화면 iframe 차단 (2026-11-06)

### Phase 0 — Inventory

- 앱·정적 자산·운영 문서에서 의도적인 iframe 임베드 사용은 발견되지 않았다.
- Nginx는 `X-Frame-Options: SAMEORIGIN`, CSP `frame-ancestors 'self'`로 같은 출처 임베드는 허용하고 있었다.

### Phase 1 — Interview

- 사용자 위임 범위에서, 임상·위기 흐름을 바꾸지 않고 위기 CTA와 선별 화면이 iframe 오버레이·클릭재킹 문맥에 표시될 가능성을 제거하는 배포 경계 보완을 확정했다.
- 제약: iframe을 제품 기능으로 도입하지 않고, 사용자가 직접 여는 전화·공식 자원 링크 및 PWA는 보존하며 실제 서버 헤더 적용은 수동 검증으로 남긴다.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·심리측정) | B(위기·자살예방) | C(구현·프라이버시) | 결론 |
|---|---|---|---|---|
| 임상 흐름 | 척도·결과·문구에 영향 없음 | 위기 행동 선택이 외부 UI에 가려지지 않아야 함 | iframe 의존성 없음 | 화면 기능 불변 |
| iframe 정책 | — | 클릭 유도·오인 위험 축소 | `DENY`와 `frame-ancestors 'none'`은 모든 임베드를 차단 | 완전 차단 |
| 호환성 | — | 구형 브라우저도 고려 | X-Frame-Options와 CSP를 병행 | 두 헤더 병행 |

- 웹 교차검증: MDN은 `X-Frame-Options: DENY`가 같은 출처를 포함한 모든 frame 로드를 차단하며, CSP `frame-ancestors 'none'`이 같은 보호를 제공한다고 설명한다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC93~AC94를 추가하고 완료로 기록했다.

### Phase 4 — Implement

- `deploy/nginx/depression-check.conf`: `X-Frame-Options: DENY`, `frame-ancestors 'none'`으로 변경했다.
- `bin/security-header-audit.js`, `tests/release.test.js`, `docs/operations/static-web-csp.md`: 약한 same-origin 임베드 설정을 실패시키는 회귀 검사와 운영 설명을 추가했다.

### Phase 5 — Evaluate

```text
npm.cmd run security:check       → PASS
npm.cmd run build:web            → PASS (정적 경로 9개)
npm.cmd run security:build:check → PASS
npm.cmd test                     → 74/74 PASS
npm.cmd run validate             → PASS
npm.cmd run a11y                 → PASS
npm.cmd run pwa:check            → PASS
npm.cmd run skill:check          → PASS
npm.cmd run release:ready        → EXPECTED BLOCKED (자동 검사는 PASS, 실제 수동·타당화·법무·임상 증빙 미완료)
git diff --check                 → PASS
```

### Phase 6 — Evolve

- 정적 Nginx 검사는 실제 프록시·CDN·배포 서버가 해당 헤더를 모든 응답에 전달하는지 증명하지 않는다. 배포 후보에서 브라우저 개발자 도구/보안 검사와 위기 동선을 수동 확인해야 한다.
- 다음 최고 영향 작업은 코드가 아닌 실제 수동 접근성·기기 증빙, 독립 A/B/C·법무·임상 검토, IRB 기반 한국어 타당화다.

◆ crisis-frame-embedding-boundary-complete → next: 실제 수동 접근성·기기 증빙 또는 P0 독립 전문가·법무·임상 검토 착수

## Cycle 26 — P0 증빙·배포 게이트 무결성 (2026-11-06)

### Phase 0 — Inventory

- 실제 수동 접근성·실기기, 한국어 타당화, 법무·규제, 임상 후속연결, 독립 A/B/C 검토 증빙은 모두 미완료였다. 이는 코드 결함이 아니라 실제 사람·기관이 수행해야 하는 배포 전 작업이다.
- 감사에서 네 가지 자동 게이트 결함을 재현했다: 비실재/미래 날짜 허용, 같은 날짜의 `FAIL`이 기존 `PASS`에 가려짐, A/B/C가 체크박스 문자열만 확인됨, 배포 스크립트가 `release:ready`보다 먼저 라이브 `dist/`를 빌드함.

### Phase 1 — Interview

- 사용자 위임 범위에서 실제 전문가 승인·IRB·실기기 시험을 만들어 내지 않고, 해당 작업이 누락되거나 철회됐을 때 배포가 통과하지 않도록 증빙 형식과 배포 순서만 강화하기로 결정했다.
- 범위 밖: 문항, 점수, 위기 라우팅, 타당화 상태, 실제 승인 기록을 임의로 변경하지 않는다.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·심리측정) | B(위기·자살예방) | C(구현·프라이버시·법무) | 결론 |
|---|---|---|---|---|
| 날짜·상태 | 과거 타당화 PASS가 같은 날의 실패를 덮으면 안 됨 | 운영 승인 철회는 즉시 차단돼야 함 | 실제 달력 날짜·미래 날짜·동률 처리 검증 가능 | 같은 날짜 `FAIL` 우선, 미래/비실재 날짜 거부 |
| 독립 검토 | 실제 임상 판단은 사람이 수행 | 위기 경로 승인은 역할별로 남겨야 함 | 체크박스가 아닌 범위 해시·기한·증빙 ID 필요 | A/B/C/해결승인 레지스트리 |
| 배포 순서 | 검증 미완료 후보 공개 금지 | 위기 화면이 불완전한 빌드로 바뀌면 안 됨 | `release:ready`를 빌드 전에 실행 가능 | P0 차단을 빌드 전에도 실행 |

- 웹 교차검증: NIMH ASQ Toolkit은 양성 선별 뒤 훈련된 임상가의 BSSA와 사전 대응 경로를 요구하며, W3C WAI는 자동 도구가 수동 접근성 검증을 대체하지 않는다고 안내한다. 따라서 앱의 정적 검사나 이 레지스트리는 실제 사람 검토를 대신하지 않는다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC95~AC97을 추가했다.

### Phase 4 — Implement

- `lib/evidence-date.js`를 추가하고 수동·타당화·법무·임상 증빙에서 비실재/미래 날짜를 거부하며, 같은 날짜 충돌은 `FAIL` 우선으로 처리했다.
- `lib/abc-expert-review-evidence.js`, `bin/validate-abc-expert-review-evidence.js`, `npm run abc:evidence:check`을 추가했다. A/B/C/해결승인별 역할·증빙 ID·범위 해시·90일 유효기간을 형식 검증한다.
- `release:ready`가 새 A/B/C 레지스트리를 차단 게이트로 사용하도록 바꿨고, 두 배포 스크립트는 `release:ready`를 `build:web` 전에 먼저 실행하게 했다.
- 레지스트리 안내와 회귀 테스트(동일일 실패, 미래·비실재 날짜, 역할별 A/B/C 기록)를 추가했다.

### Phase 5 — Evaluate

```text
npm.cmd test                       → PASS (77/77)
npm.cmd run validate               → PASS
npm.cmd run a11y                   → PASS
npm.cmd run build:web              → PASS (정적 경로 9개)
npm.cmd run security:build:check   → PASS
npm.cmd run skill:check            → PASS
npm.cmd run abc:evidence:check     → EXPECTED BLOCKED (실제 독립 검토 기록 없음)
npm.cmd run manual:check           → EXPECTED BLOCKED (실기기 기록 없음)
npm.cmd run release:ready          → EXPECTED BLOCKED (수동·타당화·법무·임상·A/B/C 실제 증빙 미완료)
git diff --check                   → PASS
```

### Phase 6 — Evolve

- 이번 변경은 실제 증빙을 생성하거나 검토 품질·독립성·자격을 판정하지 않는다. 현재 P0 배포 차단은 유지된다.
- 다음 실제 P0 작업은 역할별 전문가 검토, 수동 접근성·실기기 시험, 법무·임상 운영 승인, IRB 기반 한국어 타당화다. 배포 환경의 후보 디렉터리 빌드·원자적 전환은 별도 P1 개선으로 남긴다.

◆ p0-evidence-integrity-complete → next: 실제 P0 수동·독립 전문가·법무·임상 증빙 수집 또는 P1 원자적 배포 후보 격리

## Cycle 27 — P1 원자적 정적 배포 후보 격리 (2026-11-06)

### Phase 0 — Inventory

- Nginx가 소스 checkout의 `dist/`를 직접 제공했고, 기존 배포는 같은 경로에서 Git 갱신·의존성 설치·빌드를 수행했다. 따라서 빌드/검증 실패 시에도 서비스 중인 위기 안내 파일이 부분적으로 바뀔 수 있었다.
- P0의 빌드 전 게이트만으로는 해결되지 않았다. 새 checkout에는 `dist/`가 없어 산출물 CSP 검사가 이전 산출물 또는 누락 파일을 보게 될 수 있다.

### Phase 1 — Interview

- 사용자 위임 범위에서 임상 문항·위기 흐름·사용자 저장소는 불변으로 두고, 검증된 정적 후보만 공개 경로로 전환하는 배포 경계를 확정했다.
- 비목표: 실제 서버 배포, 기존 릴리스 삭제, 서비스 워커의 즉시 롤백 보장, P0 실제 승인 기록 생성.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·심리측정) | B(위기·자살예방) | C(구현·프라이버시·법무) | 결론 |
|---|---|---|---|---|
| 후보 격리 | 실패 후보가 위기 안내를 바꾸면 안 됨 | `/crisis`·오프라인 자원이 실패 빌드로 사라지면 안 됨 | Git worktree에서 기존 `dist` 계약을 유지 가능 | 후보 worktree에서 전 검증 |
| 공개 전환 | 검사한 산출물과 공개 산출물이 같아야 함 | 위기 동선의 가용성 유지 | 임시 링크를 `mv -T`로 `current`에 원자 전환 | `current -> 후보`만 Nginx 제공 |
| 롤백 | 사용자 기록을 되돌리거나 지우지 않음 | 긴급 시 네트워크/재빌드 의존 없이 이전 위기 안내 복구 | 범위 제한된 완료 릴리스만 허용 | 완료 마커·index.html 검증 후 링크 전환 |

- 웹 교차검증: Expo CLI는 `--output-dir`를 제공하고 정적 산출물은 정적 호스트가 제공할 수 있다. Nginx `root`는 URI와 경로를 결합하므로 고정 `current/dist` 경로가 후보 전환과 분리된다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC98~AC100을 추가했다.

### Phase 4 — Implement

- `deploy/nginx/depression-check.conf`: 정적 root를 `__RELEASE_ROOT__/current/dist`로 전환했다.
- `deploy/scripts/release-lib.sh`: 배포 잠금, 제한된 릴리스 대상 검증, 임시 심볼릭 링크의 원자 전환을 추가했다.
- `deploy/scripts/deploy-contabo.sh`: 원본 checkout 대신 별도 Git worktree에서 검사·빌드·릴리스 게이트를 실행하고, 성공 후보만 `current`로 전환한다.
- `deploy/scripts/rollback-contabo.sh`: 완료된 릴리스만 경로 탈출 없이 `current`로 전환한다.
- `deploy/scripts/setup-contabo.sh`, `docs/operations/atomic-static-deployment.md`, `tests/deployment-script.test.js`: 초기 설정·운영 경계·정적 회귀 검사를 추가했다.

### Phase 5 — Evaluate

```text
npm.cmd test                       → PASS (79/79)
npm.cmd run validate               → PASS
npm.cmd run a11y                   → PASS
npm.cmd run build:web              → PASS (정적 경로 9개)
npm.cmd run security:build:check   → PASS
npm.cmd run skill:check            → PASS
git diff --check                   → PASS
bash -n / 실제 worktree 전환       → NOT RUN (현재 Windows 환경에 Bash 없음)
```

### Phase 6 — Evolve

- Linux/Contabo 또는 Linux CI에서 `bash -n`과 실패 주입(빌드 실패·gate 실패·동시 배포·롤백·Nginx 확인)을 먼저 수행해야 한다. 실제 `release:ready`는 P0 실제 증빙 미완료로 의도적으로 차단된다.
- 원자적 서버 링크 전환은 이미 열린 탭의 이전 해시 자산 및 설치된 서비스 워커를 즉시 되돌리지 않는다. 직전 릴리스 보존, 기존 탭·PWA·오프라인 위기 안내의 실제 기기 검증이 필요하다.

◆ atomic-static-candidate-isolation-complete → next: Linux 후보 전환 실패 주입 검증 또는 실제 P0 수동·독립 전문가·법무·임상 증빙 수집

## Cycle 28 — P0 Linux 후보 전환 모의 검증 (2026-11-06)

### Phase 0 — Inventory

- P1 배포 스크립트는 Bash·Git worktree·`flock`·심볼릭 링크 원자 전환에 의존하지만, 현재 Windows 작업 환경에는 Bash가 없어 정적 문자열 테스트만 가능했다.
- 실제 Contabo 배포는 사용자가 제공하지 않은 외부 서버 상태를 변경하므로 실행하지 않았다.

### Phase 1 — Interview

- 사용자 위임 범위에서 실제 서버·임상·법무 증빙을 가장하지 않고, Linux CI에서 후보 실패가 라이브 위기 자산을 바꾸지 않는지 재현하는 하네스를 추가하기로 결정했다.
- 범위 밖: `/etc/nginx`를 변경하는 초기 설정 스크립트의 실제 실행, 실제 109/전화 앱/서비스 워커 기기 시험, 배포 승인 기록 작성.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·심리측정) | B(위기·자살예방) | C(구현·프라이버시·법무) | 결론 |
|---|---|---|---|---|
| 실패 후보 | 위기 안내가 바뀌면 안 됨 | gate/build 실패 후 기존 위기 정적 파일을 비교해야 함 | 실제 worktree·링크, `npm`/`nginx`만 모의 가능 | 파일 내용·포인터 불변 검증 |
| 롤백 | 과거 마커가 현재 임상 승인을 뜻하지 않음 | 미완성/외부 경로 롤백을 거부 | 완료 마커·index·정규화 경로 검사 | 제한된 복구만 허용 |
| 실행 환경 | 임상 승인 대체 불가 | 실제 브라우저/PWA는 별도 | Ubuntu runner에서 Bash 실행 가능 | Linux CI 하네스 추가 |

- 웹 교차검증: GitHub Actions는 Ubuntu runner에서 저장소 Bash 스크립트를 실행할 수 있고, 명시적 `bash` 실행은 스크립트 실행 권한에 의존하지 않는다. Bash의 `pipefail`은 파이프라인 실패를 전파하므로 스크립트의 fail-fast 설정을 유지한다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC101을 추가하고, 후보 격리 후 gate 실행과 일치하도록 AC97을 정정했다.

### Phase 4 — Implement

- `deploy/tests/release-harness.sh`: 임시 로컬 Git remote·공백 경로·실제 worktree/`flock`/링크를 사용하고, gate 실패·index 누락·Nginx 실패·성공·롤백·외부 링크·잠금 충돌을 검증한다.
- `.github/workflows/deployment-harness.yml`: Ubuntu runner의 Bash 구문·하네스 실행을 추가했다.
- `deploy/scripts/release-lib.sh`, `setup-contabo.sh`: 릴리스 경로 정규화와 사용자 지정 릴리스 경로의 자식 배포 전달을 보완했다.
- `docs/operations/atomic-static-deployment.md`, `tests/deployment-script.test.js`: 실행 범위·한계·CI 연결을 기록했다.

### Phase 5 — Evaluate

```text
npm.cmd test                       → PASS (80/80; 하네스/CI 정적 연결 포함)
npm.cmd run validate               → PASS
npm.cmd run a11y                   → PASS
npm.cmd run build:web              → PASS (정적 경로 9개)
npm.cmd run security:build:check   → PASS
npm.cmd run skill:check            → PASS
git diff --check                   → PASS
npm run deploy:harness             → NOT RUN (현재 Windows 환경에 Bash 없음; Ubuntu CI에서 실행)
```

### Phase 6 — Evolve

- Ubuntu CI의 첫 실제 실행 결과를 확인하고, 이후 Linux/Contabo 후보에서 실제 Nginx 응답·CSP·위기 경로·PWA/기존 탭을 수동 확인해야 한다.
- 이 하네스는 P0 실제 수동 접근성, 독립 A/B/C, 법무, 임상 운영, 한국어 타당화 증빙을 대체하지 않는다.

◆ linux-deployment-harness-ready → next: Ubuntu CI 하네스 결과 확인 또는 실제 P0 수동·독립 전문가·법무·임상 증빙 수집

## Cycle 29 — Phase 1 수동 접근성 증빙 범위 결합 (2026-11-06)

### Phase 0 — Inventory

- 수동 접근성 레지스트리는 시나리오·날짜·환경·결과를 확인했지만, 화면·위기 동선·오프라인 자산이 변경된 뒤에도 기존 PASS 기록을 재사용할 수 있었다.

### Phase 1 — Interview

- 실제 NVDA/VoiceOver/TalkBack·전화 앱·오프라인 시험을 가장하지 않고, 사람이 수행할 시험 기록이 현재 배포 후보에만 적용되도록 강화하기로 결정했다.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·심리측정) | B(위기·자살예방) | C(구현·프라이버시·법무) | 결론 |
|---|---|---|---|---|
| 과거 PASS 재사용 | 결과/문항 변경 후 접근성 재검토 필요 | 위기 CTA·오프라인 변화는 재시험 필요 | 범위 해시와 자동 비교 가능 | 현재 범위 해시 필수 |
| 실제 시험 | 임상 평가를 대신할 수 없음 | 전화·PWA는 기기에서만 검증 가능 | 레지스트리는 형식만 검증 | 사람 시험·배포 차단 유지 |

- 웹 교차검증: W3C WAI는 자동 도구와 수동 접근성 검증을 함께 사용해야 함을 안내한다. 따라서 해시 검사는 재시험 대상을 식별할 뿐 실제 보조기술 적합성을 판정하지 않는다.

### Phase 3 — Seed

- `docs/ouroboros/seed.md`에 AC102를 추가했다.

### Phase 4 — Implement

- `lib/manual-verification.js`, `bin/validate-manual-verification.js`, `bin/release-readiness.js`: 수동 시험 증빙의 현재 범위 해시 일치를 배포 게이트로 추가했다.
- `lib/release-scope-fingerprint.js`: 접근성·위기·PWA에 영향을 주는 화면·컴포넌트·정적 자산을 범위에 포함했다.
- 수동 검증 레지스트리·계획과 회귀 테스트를 갱신했다.

### Phase 5 — Evaluate

```text
npm.cmd test                       → PASS (80/80)
npm.cmd run validate               → PASS
npm.cmd run a11y                   → PASS
npm.cmd run build:web              → PASS (정적 경로 9개)
npm.cmd run security:build:check   → PASS
npm.cmd run skill:check            → PASS
git diff --check                   → PASS
```

### Phase 6 — Evolve

- 실제 수동 시험과 배포 책임자 검토가 아직 없으므로 `manual:check`와 `release:ready` 차단은 유지된다. 이 구현은 증빙을 만드는 것이 아니라 오래된 증빙의 재사용을 차단한다.

◆ manual-accessibility-evidence-boundary-complete → next: 실제 NVDA·VoiceOver·TalkBack·전화·오프라인 시험 증빙 또는 Phase 2 독립 A/B/C 검토

## Cycle 30 — Phase 2 독립 A/B/C 검토 패킷 (2026-11-06)

### Phase 0–2 — Inventory·Interview·Cross-validation

- 실제 독립 A/B/C 검토는 미완료이며 코드가 이를 대신할 수 없다. NIMH ASQ Toolkit의 양성 뒤 훈련된 임상가 후속평가 원칙과 W3C의 자동 도구 한계를 확인했다.
- A는 선별·번역·문구 한계, B는 위기 우선·BSSA 한계, C는 무백엔드·프라이버시·보안·법무 범위를 검토한다. 현재 후보 범위 해시를 함께 전달하고 비식별 증빙만 기록한다.

### Phase 3–4 — Seed·Implement

- `seed.md`에 AC103을 추가했다.
- `bin/print-abc-review-packet.js`, `npm run abc:packet`, A/B/C 검토 문서·회귀 테스트를 추가했다. 패킷은 현재 범위 해시·역할별 질문·기록 방법·비승인 고지만 출력한다.

### Phase 5 — Evaluate

```text
npm.cmd test             → PASS (81/81)
npm.cmd run abc:packet   → PASS (현재 후보 해시·질문 출력)
npm.cmd run skill:check  → PASS
git diff --check          → PASS
```

### Phase 6 — Evolve

- 패킷 출력은 실제 검토·승인·임상 평가가 아니다. 외부 검토자의 의견·충돌 해결·비식별 증빙이 기록되기 전 `abc:evidence:check`와 `release:ready`는 계속 차단된다.

◆ abc-review-packet-ready → next: 실제 독립 A/B/C 검토 증빙 또는 Phase 3 한국어 타당화 거버넌스 준비

## Cycle 31 — 채용 요건 연계 선별 정책 평가 체계 (2026-11-06)

### Phase 0 — Inventory

- 사람인 공고(삼일회계법인 AI 연구소 AI & 데이터 엔지니어 인턴)는 평가 데이터·사용자 피드백 기반 품질 평가와 테스트 체계 구축 경험을 요구한다.
- 기존 단위 테스트는 점수·라우팅·저장 경계를 검증하지만, 배포 전에 실행할 수 있는 하나의 비식별 정책 시나리오 묶음과 요약 명령은 없었다.

### Phase 1 — Interview

- 확정된 제약을 적용했다: 이 앱은 AI 상담·진단 제품이 아니므로 LLM 답변 평가, 사용자 응답 수집, 외부 분석을 도입하지 않는다.
- 산출물은 합성 입력으로 위험 라우팅 불변식을 점검하는 재현 가능한 CLI 평가로 한정했다.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A (임상·심리측정) | 회귀 사례는 정책 구현을 확인할 뿐 선별 도구의 임상 정확도를 검증하지 않는다. | CLI와 사례 주석에 임상 검증 아님을 고정했다. |
| B (위기·자살예방) | 현재 안전·ASQ 급성 신호는 점수보다 먼저 위기 화면으로 가야 하며, 문항 9 신호는 low로 종결되면 안 된다. | 급성 2건, 문항 9·ASQ 비급성 양성 사례를 포함했다. |
| C (구현·프라이버시) | PII나 실제 설문을 저장하지 않고, 코드에서 읽는 합성 fixture와 결정적 CLI가 적합하다. | 네트워크·저장소 없이 data/lib/bin/test만 추가했다. |

### Phase 3–4 — Seed·Implement

- `seed.md`에 AC104를 추가했다.
- `data/assessment-evaluation-cases.js`, `lib/assessment-evaluation.js`, `bin/evaluate-assessment-cases.js`, 회귀 테스트와 `assessment:evaluate` 명령을 추가했다.
- 사례는 low/monitor/urgent/acute, 청소년 도구 선택, ASQ 양성 뒤 급성도 누락 거부를 포함한다.

### Phase 5 — Evaluate

```text
npm.cmd run assessment:evaluate → PASS (9/9)
npm.cmd run validate            → PASS
npm.cmd test                    → PASS (83/83)
npm.cmd run a11y                → PASS
npm.cmd run skill:check         → PASS
npm.cmd run build:web           → PASS (정적 경로 9개)
git diff --check                → PASS
```

### Phase 6 — Evolve

- 이 체계는 제품 정책 회귀를 검증할 뿐 실제 사용자 피드백, 임상 타당화, 외부 A/B/C 검토, 수동 접근성·법무·후속연결 운영 증빙을 대체하지 않는다.

◆ assessment-policy-evaluation-implemented → next: 전체 검증 실행 및 실제 외부 증빙 수집

## Cycle 32 — 브라우저 위기 경로 회귀 검사 (2026-11-06)

### Phase 0 — Inventory

- Cycle 31의 합성 정책 평가는 `buildAssessmentResult`만 호출하므로 React 상태·버튼·Expo Router·정적 빌드 경로를 검증하지 않는다.
- 실제 코드에서 `survey.js`의 `checkin` 단계는 이전 버튼을 노출하지만 `handleBack()`에 해당 분기가 없었다. 이 상태에서 이전을 누르면 ASQ 마지막 문항으로 이동해 필수 안전·척도 문항을 건너뛰고 완료 시 예외가 발생할 수 있었다.

### Phase 1 — Interview

- 확정된 목표: 문항·점수·위기 정책을 바꾸지 않고, 실제 브라우저에서 설문 전이와 위기 우선 경로를 회귀 검사한다.
- 비목표: 실제 사용자·전화·외부 기관·상담 데이터 사용, 임상 성능 추정, LLM 기능 도입.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A (임상·심리측정) | 안전/척도 문항을 건너뛰는 UI 흐름은 선별 결과의 해석을 무효화한다. 자동 검사는 정책 회귀일 뿐 임상 타당화가 아니다. | 최초 이전 경계를 시작 화면으로 고정하고 한계를 기록했다. |
| B (위기·자살예방) | 현재 안전 또는 ASQ Q5의 `yes`·`unknown`은 결과보다 `/crisis`로 보내야 한다. | 두 급성 경로와 결과 점수 비노출을 실제 클릭으로 검사했다. |
| C (구현·프라이버시) | 현 의존성에는 브라우저 자동화가 없으므로 격리 Chromium·정적 빌드·로컬 서버 기반의 Playwright가 적합하다. | `@playwright/test`, 루프백 전용 정적 서버, CI 워크플로와 실패 trace/artifact를 추가했다. |

- 웹 교차검증: Playwright 공식 문서는 CLI로 브라우저 바이너리를 설치하고, `baseURL`·실패 trace/screenshot을 구성할 수 있음을 안내한다. 이 기능을 합성 E2E에만 사용했다.

### Phase 3–4 — Seed·Implement

- `seed.md`에 AC105를 추가했다.
- `survey.js`에서 `checkin`의 이전을 시작 화면으로 명시 처리하고, 예상 밖 단계도 ASQ로 점프하지 않도록 시작 경계로 되돌렸다.
- `playwright.config.js`, `bin/serve-test-build.js`, `e2e/safety-flow.spec.js`, 브라우저 CI 워크플로와 `test:e2e`를 추가했다.
- E2E는 동의 없는 직접 설문 진입, 최초 이전, safety/ASQ Q5의 yes·unknown 위기 우선, 직접 결과 진입 가드를 합성 클릭으로 검사하고 `pageerror`를 실패로 본다.

### Phase 5 — Evaluate

```text
npm.cmd run test:e2e          → PASS (7/7 Chromium)
npm.cmd run assessment:evaluate → PASS (9/9)
npm.cmd run validate            → PASS
npm.cmd test                    → PASS (83/83)
npm.cmd run a11y                → PASS
npm.cmd run skill:check         → PASS
npm.cmd run build:web           → PASS (정적 경로 9개)
git diff --check                → PASS
npm.cmd audit --omit=dev        → 미해결 (30개; Expo 58 major 업그레이드 필요 항목 포함, 이번 안전 흐름 범위에서는 자동 업그레이드하지 않음)
```

### Phase 6 — Evolve

- 브라우저 회귀 통과는 임상 타당화, 실제 전화 연결, 외부 A/B/C 승인, NVDA/VoiceOver/TalkBack 수동 검증 또는 실제 전문가 후속 운영을 대체하지 않는다.
- 다음 자동화 후보는 정상 완료 결과·세션 최소화·저장 명시 동의 흐름을 추가로 E2E에 포함하는 것이다.
- 의존성 감사는 production 트리에 low 2·moderate 11·high 16·critical 1을 보고했다. 다수는 Expo 56 전이 의존성이고 제안된 해결책은 Expo 58 major 업그레이드다. 호환성·배포 영향이 커 이번 위기 라우팅 수정과 묶어 자동 적용하지 않았으며, 별도 프레임워크 마이그레이션 Seed로 다룬다.

◆ browser-crisis-route-regression-implemented → next: 전체 정적·단위·브라우저 검증 및 실제 외부 증빙 수집

## Cycle 33 — 마감 전 A/B/C·UI·배포 경계 검토 (2026-11-07)

### Phase 0 — Inventory

- 전체 코드, Seed, 이전 감사, 정적 배포 Nginx 구성과 Chromium 실제 정적 웹 초기 화면/접근성 트리를 재검토했다.
- 실제 위기 사용자, 전화, 외부 기관, 스크린리더·모바일 기기, TLS 서버는 사용할 권한이나 증빙이 없으므로 시험하지 않았다.

### Phase 1 — Interview

- 마감 범위는 검증된 척도·점수 정책을 바꾸지 않는 방어적 입력 검증, 위기/자원 전이, 고지 정확성, 정적 배포 보안 헤더로 한정했다.
- 새 상담 문항, 복합 위험 점수, 진단/치료 주장, 백엔드·분석·자동 의뢰는 비목표로 유지했다.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 결론 |
|---|---|---|
| A(임상·심리측정) | 희소 응답·잘못된 연령은 낮은 결과로 해석되면 안 되며, 한국어 웹 UI는 미타당화 상태를 명확히 해야 한다. | 엄격한 입력 거부와 번역/웹 사용 한계 고지. |
| B(위기·자살예방) | 도움 우선 사용자를 설문에 묶지 않고 ASQ Q5의 이전은 Q4로 복귀해야 한다. | 자원 직접 이동·Q5 되돌아가기·위기 문구 보완. |
| C(구현·프라이버시·배포) | 모순된 세션은 렌더 전에 거부하고, location-level Nginx `add_header`는 상위 CSP 상속을 막을 수 있다. | 세션 shape 검증·`expires -1`로 캐시만 설정. |

### Phase 3 — Seed

- `seed.md`에 AC106(결과/세션 입력 경계), AC107(브라우저 전이와 PWA 보안 헤더)을 추가했다.

### Phase 4 — Implement

- `data/instruments.js`, `lib/assessment-session.js`: 연령·희소 배열·세션 위험 구조·ASQ 조합을 방어적으로 검증했다.
- `app/index.js`, `app/result.js`, `app/survey.js`, `app/crisis.js`, `components/ResourceList.js`: 미타당화 고지, 도움 우선 이동, ASQ Q5 뒤로 가기, 위기 문구, 자원 실패 안내를 보완했다.
- `deploy/nginx/depression-check.conf`: PWA 특수 파일 캐시 설정이 상위 보안 헤더를 상속하게 했다.
- 단위·배포·브라우저 회귀 검사와 README 저장 고지를 갱신했다.

### Phase 5 — Evaluate

```text
npm.cmd run validate              → PASS
npm.cmd test                      → PASS (85/85)
npm.cmd run assessment:evaluate   → PASS (9/9)
npm.cmd run a11y                  → PASS
npm.cmd run skill:check           → PASS
npm.cmd run security:check        → PASS
npm.cmd run build:web             → PASS (정적 경로 9개)
npm.cmd run test:e2e              → PASS (9/9 Chromium)
```

- 브라우저 테스트의 최초 엄격 선택자 실패는 전환 중 중복 heading의 테스트 표현 문제였으며 `.first()`로 실제 첫 자원 heading을 확인하도록 보정한 뒤 통과했다. 앱 예외는 감지되지 않았다.

### Phase 6 — Evolve

- 코드 후보는 자동 검증상 조건부 통과지만, `release:ready`의 P0 사람 증빙 차단은 유지한다.
- 한국어 타당화, 독립 A/B/C, NVDA/VoiceOver/TalkBack·실제 전화/오프라인, 법무·임상 후속 운영, 실제 TLS/Nginx·PWA 기존 탭 검증이 다음 단계다.
- Expo 56 의존성 감사의 major 업그레이드 요구와 배포 후보 E2E 결합은 호환성 범위가 크므로 별도 Seed에서 처리한다.

◆ final-code-review-conditionally-passed → next: `release:ready` 차단 사유를 실제 외부 증빙으로 해소하고, 별도 Seed에서 Expo/배포 운영 보완

## Cycle 34 — Phase 0~6 (2026-11-07): 배포 후보 E2E 게이트·TLS 보호

### Phase 0 — Inventory

- 최종 검토 문서(`docs/research/final-release-review-2026-11-07.md`) P1 중 코드 구현 가능 항목: 배포 후보 검증에 Playwright E2E 미포함, `setup-contabo.sh` 재실행 시 `cp`가 기존(certbot TLS 적용) Nginx 구성을 무조건 덮어쓰기.
- P0(사람 증빙)은 코드 작업이 아님. Expo 58 major 업그레이드는 검토 문서 권고대로 별도 Seed로 분리.

### Phase 1 — Interview

- 질문: “다음 구현은 무엇인가 — P1 배포 보완 2건인가, Expo 58 업그레이드인가?”
- 결정: **P1 배포 보완 2건(E2E 게이트·TLS 보호).** Expo 업그레이드는 비목표.
- 비목표: Expo 58 업그레이드, 기존 탭 PWA 갱신 실기기 시험(사람 증빙), 새 임상 기능.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상) | B(위기) | C(구현·배포) | 결론 |
|---|---|---|---|---|
| 배포 후보 E2E 게이트 | 정적 검사만으론 런타임 미검증 | 정적 게이트 통과 후 위기 흐름이 브라우저에서 깨진 배포는 위기 사용자 무방비 | Playwright 게이트 + 하니스 고정 | **build 뒤 `test:e2e` 추가** |
| chromium 설치 분기 | — | — | root 아닐 때 `--with-deps`(apt) 실패 | **root면 `--with-deps`, 아니면 일반 설치** |
| setup TLS 보호 | — | HTTPS 유실 = 위기 안내 차단 | `cp` 무조건 덮어쓰기가 certbot 구성 파괴 | **기존 보존 + `FORCE_CONF_OVERWRITE=1` + 백업** |
| Expo 58 업그레이드 | — | 위기 경로 회귀 우려 | 검토 문서가 자동 업그레이드 금지 명시 | **별도 Seed 비목표** |

### Phase 3 — Seed

- AC108~AC112 추가: E2E 게이트·하니스 고정, chromium 설치 분기, TLS 보호, Expo 분리, 회귀 검사.

### Phase 4 — Implement

- `deploy/scripts/deploy-contabo.sh`: `build:web` 뒤 Playwright chromium 설치(root `--with-deps` 분기) + `npm run test:e2e` 게이트, `release:ready` 전 실행.
- `deploy/scripts/setup-contabo.sh`: 기존 Nginx 구성 보존, `FORCE_CONF_OVERWRITE=1`일 때만 타임스탬프 `.bak` 백업 후 교체.
- `deploy/tests/release-harness.sh`: `npx` 목 추가, `e2e-fail` 시나리오(E2E 실패 시 라이브 보존), 성공 후보에서 E2E·playwright install 실행 grep.
- `tests/release.test.js`: 게이트 순서·설치 분기·TLS 가드·하니스 시나리오 회귀 검사 2건 추가(기존 배포 검사에 `test:e2e` 포함).

### Phase 5 — Evaluate

```text
bash -n (deploy/setup/harness)   → PASS
npm.cmd run validate             → PASS
npm.cmd test                     → 87/87 PASS
npm.cmd run assessment:evaluate  → PASS (9/9)
npm.cmd run a11y                 → PASS
npm.cmd run skill:check          → PASS
npm.cmd run security:check       → PASS
npm.cmd run build:web            → PASS (정적 경로 9개)
npm.cmd run test:e2e             → PASS (9/9 Chromium)
```

- **실시간 보완**: 로컬 chromium 실행 파일이 없어 E2E가 처음 실패 — 배포 게이트가 방지하려던 상황이 그대로 재현됐다. `npx playwright install chromium`(비 root 경로)로 설치해 재검증했고, 이는 AC109의 비 root 분기 실동작 확인이기도 하다.
- Linux 배포 하니스(`deploy:harness`)는 Windows에서 실행 불가(WSL/실서버 필요). `bash -n` 문법 검사와 신규 시나리오 회귀 grep으로 대체 검증했으며 실서버 실행은 운영 게이트로 유지한다.

### Phase 6 — Evolve

- 다음 최고 영향 질문: “별도 Seed로 Expo 56→58 major 업그레이드를 수행할 때 위기 경로 E2E·PWA 기존 탭 갱신을 어떤 롤백 기준으로 묶을 것인가?”
- 남은 후속: 실서버 deploy:harness 실행, 기존 탭 PWA 갱신 실기기 시험, `release:ready` P0 사람 증빙(타당화·독립 A/B/C·법무·운영).
- 중단 조건: AC108~AC112 충족, 기존 AC1~AC107 회귀 없음.
- 판정: **검토 문서 P1의 코드 구현 항목 소진. P0 사람 증빙·Expo 별도 Seed만 남음.**

◆ deploy-gate-complete (Path C) → next: 실서버 deploy:harness·E2E 게이트 실행 확인, 이후 별도 Seed로 Expo 58 업그레이드

## Cycle 35 — Phase 0~6 (2026-11-09): Expo 58 프레임워크 업그레이드

### Phase 0 — Inventory

- 현재 Expo 56.0.8 / RN 0.85.3 / React 19.2.3 / Expo Router 56.2.8, 정적 웹 `web.output: "static"`.
- HANDOFF §7-5와 Cycle 34 Phase 6의 남은 코드 작업은 Expo 58 major 업그레이드이며, `npm audit --omit=dev`가 critical 1·high 16(수정안 `expo@58.0.23`)을 보고했다.
- 환경: Node v24.15.0(SDK 58 요구 충족), `dist/index.html`은 커스텀 `+html.js`로 생성된다.

### Phase 1 — Interview

- 질문: “다음 구현은 무엇인가 — Expo 58 업그레이드, E2E 범위 확장, 또는 코드 변경 없는 게이트 재점검인가?”
- 결정: **Expo 56→58 업그레이드**(사용자가 권장안 선택). E2E 확장·사람 증빙 생성은 이번 범위가 아니다.
- 비목표: 문항·채점·위기 라우팅 변경, Expo 58 실기기 검증 대체, 실제 전문가 승인 생성.

### Phase 2 — A/B/C Cross-validation

| 결정 | A(임상·심리측정) | B(위기·자살예방) | C(구현·프라이버시·배포) | 결론 |
|---|---|---|---|---|
| 프레임워크 업그레이드 | 척도·점수·결과 해석 불변 | 위기 우선·도움 우선 경로 불변 | critical/high 의존성 해소, lockfile·CSP 해시 재검증 | Expo 58로 업그레이드 |
| 정적 HTML 출력 | — | 위기 화면이 화면만 보이고 클릭이 죽으면 안 됨 | SDK 58은 커스텀 `+html`의 `headNodes`/`bodyNodes` 렌더 필요 | `useServerDocumentContext` 적용 |
| Router 58 | 화면 전이·결과 전달 불변 | ASQ Q5 뒤로가기·급성 경로 유지 | `web.output: static` 유지 | E2E 9/9로 고정 |
| 의존성·감사 | — | — | `expo install --check`·`npm ci --dry-run`로 재현성 확인 | production critical/high 0 |

- 웹 근거: Expo 공식 Static rendering 문서(SDK 58+)는 커스텀 Root HTML이 `useServerDocumentContext()`의 `headNodes`/`bodyNodes`를 렌더해야 한다고 명시한다. Expo SDK 58 릴리스 노트는 RN 0.88·React 19.3·Router 58 변경을 안내한다.

### Phase 3 — Seed

- `seed.md`에 AC113~AC118 추가: SDK 정렬, bodyNodes 렌더, 빌드 감사 회귀, 전체 검증, 감사 감소, 임상·위기·저장 경계 불변.

### Phase 4 — Implement

- `package.json`·`package-lock.json`: Expo 58.0.23, React Native 0.88.1, React/React DOM 19.3.0, Expo Router 58.0.30, RN Web 0.21.4 및 SDK 58 모듈 버전으로 정렬.
- `app/+html.js`: `useServerDocumentContext()`의 `headNodes`/`bodyNodes`·document attributes를 렌더하도록 수정(SDK 58 정적 렌더링 계약).
- `bin/security-build-audit.js`: `dist/index.html`에 앱 JS 번들이 없으면 실패.
- `tests/release.test.js`: `+html` 문서 노드 렌더와 빌드 산출물 JS 번들 감사 회귀 검사 추가.
- `docs/operations/static-web-csp.md`: SDK 58 커스텀 HTML 계약과 번들 누락 위험 기록.
- **실시간 보완 1**: `expo install --fix`가 expo-router 58의 optional peer(`expo-symbols`)와 ERESOLVE 충돌 → `npm install --legacy-peer-deps`로 lockfile 정렬 후 `expo install --check` “Dependencies are up to date”, `npm ci --dry-run` 통과 확인.
- **실시간 보완 2**: 최초 업그레이드 빌드에서 `dist/index.html`에 앱 번들이 0개여 E2E 9건이 전부 실패(화면만 렌더, 클릭 무반응). `+html.js` bodyNodes 누락이 원인이었고 수정 후 E2E 9/9 통과. 같은 회귀를 `security:build:check`와 단위 테스트로 고정.
- `npm audit fix`로 production critical(`shell-quote`)·high를 해소. 남은 production moderate 5건은 Expo CLI 전이 도구이며 `--force`는 Expo 57 다운그레이드를 제안하므로 적용하지 않았다.

### Phase 5 — Evaluate

```text
npx expo install --check           → PASS (Dependencies are up to date)
npm ci --dry-run                   → PASS
npm ci                             → PASS (배포 스크립트와 동일한 클린 설치, 964 packages)
npx expo-doctor                    → 19/20 (기존 eas-cli devDependency 경고 1건, 이번 변경과 무관)
npm.cmd audit --omit=dev           → 5 moderate (critical/high 0; 이전 30: critical 1·high 16)
npm.cmd run validate               → PASS
npm.cmd test                       → 88/88 PASS
npm.cmd run assessment:evaluate    → PASS (9/9)
npm.cmd run a11y                   → PASS
npm.cmd run privacy:check          → PASS
npm.cmd run storage:check          → PASS
npm.cmd run security:check         → PASS
npm.cmd run security:build:check   → PASS (hydration 해시·앱 JS 번들·정적 자산)
npm.cmd run pwa:check              → PASS
npm.cmd run skill:check            → PASS
npm.cmd run build:web              → PASS (정적 경로 9개)
npm.cmd run test:e2e               → PASS (9/9 Chromium)
npm.cmd run release:ready          → EXPECTED BLOCKED (P0 사람 증빙 미완료)
git diff --check                   → PASS
```

- E2E 실행과 `release:ready`를 병렬로 돌릴 때 Playwright의 `build:web`이 `dist`를 재생성하는 동안 빌드 감사가 `dist/index.html` 누락을 볼 수 있었다. 직렬 실행에서는 정상 PASS이며, 이는 검증 순서 제약으로 기록한다.

### Phase 6 — Evolve

- 남은 작업은 코드가 아니라 실제 iOS/Android 빌드·실기기·TLS/Nginx 응답·PWA 기존 탭 갱신, 수동 접근성, 독립 A/B/C, 법무·임상 후속연결, 한국어 타당화다.
- `release:ready`의 P0 차단은 의도대로 유지된다. Expo 58 업그레이드는 문항·채점·위기 우선·무백엔드 경계를 바꾸지 않았다.
- 다음 최고 영향 질문: “배포 후보에서 Expo 58 산출물의 CSP·PWA·기존 탭 갱신을 어떤 실기기 체크리스트로 확인할 것인가?”

◆ expo58-upgrade-complete (Path C) → next: 실제 배포 후보에서 TLS/Nginx·PWA 기존 탭·실기기 확인, 이후 P0 사람 증빙 수집

## Cycle 36 — Phase 0~6 (2026-11-09): 공개 저장소 커밋·푸시 안전성

### Phase 0 — Inventory

- 원격: `https://github.com/junwoo1206112/Psychological-Counseling.git`, 현재 `master`는 `origin/master`와 동일(0/0).
- 작업 트리에는 미커밋 변경 129개 경로가 있었고, 로컬 전용 `ouroboros/`(중첩 Git 체크아웃 154MB), `Codex_AI_스킬/`(90파일), `.claude/` 설정이 섞여 있었다.
- `git ls-files --others` 기준 비밀키·토큰·개인정보 스캔에서 실제 비밀값은 발견되지 않았다. `HANDOFF.md`에 로컬 Windows 사용자명·절대 경로가 남아 있었다.

### Phase 1 — Interview

- 사용자 요청: 변경 내용을 공개 GitHub 저장소에 커밋·푸시해도 되는지 A/B/C로 검증하고, 권장안을 실행.
- 결정: **민감정보·로컬 도구를 제외하고 프로젝트 소스·문서만 커밋·푸시**한다. 앱 기능·문항·위기 경로는 변경하지 않는다.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 커밋은 런타임을 바꾸지 않지만, 미타당화 한국어·선별 한계 고지가 문서에 남아야 함 | HANDOFF/README/Seed의 진단 아님·unofficial·P0 차단 문구 유지 |
| B(위기·자살예방) | 공개 소스에 위기 자원·급성 라우팅이 포함돼도 개인정보·연락처 원자료는 없어야 함 | 109/119/112/1577-0199/1388 공적 번호만 포함, E2E 9/9 재확인 |
| C(구현·프라이버시) | 중첩 `ouroboros/`·Codex 스킬·로컬 사용자명·비밀값이 공개되면 안 됨 | `.gitignore` 추가, 경로 일반화, staged 비밀 스캔, 선택적 스테이징 |

- 웹/저장소 근거: 원격 HEAD가 로컬 HEAD와 같아 fast-forward 푸시가 가능하다. GitHub 공개 저장소이므로 로컬 도구·개인 경로는 저장소 경계 밖으로 둔다.

### Phase 3 — Seed

- AC119~AC121 추가: 비밀·로컬 도구 제외, 경로 일반화, 전체 검증 후 커밋·푸시.

### Phase 4 — Implement

- `.gitignore`: 루트의 `ouroboros/`, `Codex_AI_스킬/`, `.claude/`를 로컬 도구로 제외.
- `HANDOFF.md`, `README.md`: 로컬 작업 경로·Windows 사용자명 표기를 `%USERPROFILE%`·`<PROJECT_ROOT>`·일반 표현으로 교체.
- 스테이징: `git add -A -- .` 후 `.gitignore`로 로컬 도구가 제외됐는지 확인. 129개 프로젝트 경로만 staged.
- 검증: staged 파일 비밀 스캔, `git diff --cached --check`, 전체 자동 검증 재실행.

### Phase 5 — Evaluate

```text
git ls-remote origin HEAD        → 738108a (로컬 HEAD와 동일)
비밀·PII 스캔                     → 실제 비밀값 없음 (lockfile 패키지명·SVG 경로 오탐만)
git diff --cached --check        → Markdown 기존 trailing space 경고만, 코드 오류 없음
npm.cmd test                     → 88/88 PASS
npm.cmd run validate             → PASS
npm.cmd run a11y                 → PASS
npm.cmd run security:build:check → PASS
npm.cmd run test:e2e             → 9/9 PASS
npm.cmd run release:ready        → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 푸시 후에도 공개 저장소에는 실제 전문가 승인·타당화 증빙이 없으며, `release:ready` 차단은 유지된다.
- 다음 단계는 배포 후보 실기기·TLS/PWA 확인과 P0 사람 증빙 수집이다.

◆ commit-push-readiness-complete (Path C) → next: master 커밋·푸시 결과 확인 후 배포 후보 검증

## Cycle 37 — Phase 0~6 (2026-11-09): 정상 완료·저장 경계 E2E

### Phase 0 — Inventory

- 기존 E2E 9건은 위기·가드 경로만 검증했고, 정상 완료·결과 화면·세션 요약 최소화·결과 저장 opt-in은 브라우저 회귀 검사가 없었다.
- 단위 테스트는 저장 스키마를 검증하지만, 실제 설문 전이와 `sessionStorage`/`localStorage`에 무엇이 들어가는지는 검증하지 않았다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서, 새 기능이 아니라 **이미 구현된 정상 경로와 저장 경계의 브라우저 회귀 검사**를 구현 대상으로 확정했다.
- 비목표: 문항·점수·위험 라우팅 변경, 실제 사용자 응답·PII 사용, 저장 기능 확대.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 정상 완료가 위기로 오분류되지 않고 0점·ASQ 음성이 결과에 정확히 표시돼야 함 | 성인 정상 완료 시나리오와 결과 표시 검사 |
| B(위기·자살예방) | 정상 경로 추가가 급성/양성 경로를 깨면 안 됨 | 기존 위기 E2E 8건 유지, 전체 12건 통과 |
| C(구현·프라이버시) | 세션은 요약만, localStorage는 사용자가 저장할 때만 최소 필드만 | 저장소 키·필드 집합을 브라우저에서 직접 검증 |

- 웹 근거: Playwright는 `page.evaluate`로 브라우저 저장소를 읽고 `page.on('dialog')`로 삭제 확인 대화상자를 처리할 수 있다. 정적 빌드에 합성 입력만 사용했다.

### Phase 3 — Seed

- AC122~AC124 추가: 정상 완료 결과, 세션 최소화, opt-in 저장·전체 삭제 안내.

### Phase 4 — Implement

- `e2e/safety-flow.spec.js`: `completeLowRiskSurvey` 헬퍼와 E2E 3건 추가.
  - 정상 완료 → 결과 화면·점수·ASQ 음성 표시.
  - `sessionStorage` 결과의 정확한 키 집합과 원본 응답 부재 검증.
  - 저장 전 `localStorage` 부재 → 저장 후 최소 필드 → `/history` → 전체 삭제 검증.
- **실시간 보완 1**: 결과 화면의 “우울 증상”이 밴드 설명 문장과 겹쳐 strict mode 오류 → `exact` 선택자로 보정.
- **실시간 보완 2**: 전체 삭제 후 목록이 비면 성공 안내가 조건 분기 안에 있어 사라지는 UI 결함을 발견 → `app/history.js`에서 상태 메시지를 빈 상태/목록 상태 밖으로 이동.

### Phase 5 — Evaluate

```text
npm.cmd run test:e2e              → PASS (12/12 Chromium)
npm.cmd test                      → 88/88 PASS
npm.cmd run validate              → PASS
npm.cmd run a11y                  → PASS
npm.cmd run skill:check           → PASS
npm.cmd run assessment:evaluate   → PASS (9/9)
npm.cmd run security:build:check  → PASS
npm.cmd run pwa:check             → PASS
npm.cmd run privacy:check         → PASS
npm.cmd run storage:check         → PASS
npm.cmd run resources:check       → PASS (2026-11-06)
npm.cmd run release:ready         → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 정상 경로·저장 경계는 브라우저 회귀 검사로 고정됐다. 다음 코드 후보는 청소년 PHQ-A 정상 완료와 저장 실패 fallback E2E다.
- 남은 배포 차단은 여전히 수동 접근성·독립 A/B/C·한국어 타당화·법무·임상 운영·실기기 증빙이다.

◆ normal-completion-storage-e2e-complete (Path C) → next: 청소년 PHQ-A·저장 실패 E2E 확장 또는 P0 사람 증빙 착수

## Cycle 38 — Phase 0~6 (2026-11-09): Ouroboros 기록 추적 복구

### Phase 0 — Inventory

- Cycle 36에서 추가한 `.gitignore`의 `ouroboros/` 패턴이 하위 디렉터리까지 매칭해 `docs/ouroboros/seed.md`·`phase-log.md`를 무시하고 있었다.
- 그 결과 `6f251fe` 푸시에는 Ouroboros Seed·Phase 기록이 빠졌고, HANDOFF가 참조하는 문서가 원격에 없는 불일치가 생겼다.

### Phase 1 — Interview

- 사용자 요청 없이 새 기능을 추가하지 않고, **이전 커밋·푸시의 누락을 복구하는 최소 수정**으로 범위를 확정했다.
- 비목표: 과거 커밋 amend/force-push, 로컬 도구 체크아웃 커밋, 앱 동작 변경.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 기록 누락은 앱 동작과 무관하지만 배포 근거 추적성을 훼손 | 문서 복구만 수행 |
| B(위기·자살예방) | 위기 경로 코드는 변경하지 않음 | E2E 12/12 재확인 |
| C(구현·프라이버시) | 루트 도구만 제외하고 프로젝트 기록은 추적해야 함 | 패턴을 `/ouroboros/`로 앵커링, 기록 내 로컬 경로 제거 |

### Phase 3 — Seed

- AC125~AC126 추가: 루트 기준 제외 패턴, Ouroboros 기록의 로컬 경로 제거.

### Phase 4 — Implement

- `.gitignore`: `ouroboros/` → `/ouroboros/`, `Codex_AI_스킬/` → `/Codex_AI_스킬/`, `.claude/` → `/.claude/`.
- `docs/ouroboros/phase-log.md`: Cycle 36 기록에 남아 있던 로컬 Windows 사용자명·절대 경로 표기를 일반 표현으로 교체.
- `docs/ouroboros/`가 다시 untracked 상태로 나타나 후속 커밋에 포함할 수 있게 됨.

### Phase 5 — Evaluate

```text
git check-ignore docs/ouroboros/seed.md → 무시하지 않음(exit 1)
git check-ignore ouroboros              → /ouroboros/ 로 제외
git status --short                      → ?? docs/ouroboros/ 확인
비밀·PII 스캔                            → 실제 비밀값 없음
npm.cmd test                            → 88/88 PASS
npm.cmd run test:e2e                    → 12/12 PASS
npm.cmd run a11y / skill:check          → PASS
```

### Phase 6 — Evolve

- 원격 저장소는 후속 커밋 전까지 `docs/ouroboros` 기록이 없는 상태다. 사용자 승인 시 Cycle 37~38 변경을 후속 커밋으로 푸시해야 한다.
- 강제 푸시·과거 커밋 수정은 하지 않는다.

◆ ouroboros-tracking-recovered (Path C) → next: 사용자 승인 시 Cycle 37~38 후속 커밋·푸시

## Cycle 39 — Phase 0~6 (2026-11-09): 청소년·저장소 차단 E2E

### Phase 0 — Inventory

- 청소년(만 14~17세) 정상 완료는 단위 테스트만 있고 실제 브라우저 전이·결과 표시 검사가 없었다.
- `localStorage`·`sessionStorage` getter 예외는 단위 테스트로만 확인했고, 실제 정적 웹에서 결과·기록 화면이 유지되는지 검증하지 않았다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서, 새 기능이 아니라 **청소년 경로와 저장소 차단 fallback의 브라우저 회귀 검사**를 구현 대상으로 확정했다.
- 비목표: 문항·점수·위기 라우팅 변경, 실제 사용자 응답·PII 사용, 저장 기능 확대.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 청소년은 PHQ-A 9문항과 1388 안내가 성인과 구분돼야 함 | 청소년 완료 결과·세션 도구명 검증 |
| B(위기·자살예방) | 저장소 장애가 위기 자원·결과 안내를 가리면 안 됨 | 저장소 차단 상태에서도 결과·기록 안내 확인 |
| C(구현·프라이버시) | getter 예외는 메모리 fallback으로 흡수되어야 함 | `addInitScript`로 실제 브라우저 저장소 차단 |

### Phase 3 — Seed

- AC127~AC129 추가: 청소년 PHQ-A·1388, localStorage 차단, sessionStorage 차단.

### Phase 4 — Implement

- `e2e/safety-flow.spec.js`: `startSurvey(page, ageLabel)`·`completeLowRiskSurvey(page, ageLabel)` 헬퍼로 일반화하고 E2E 3건 추가.
  - 청소년 완료 → `PHQ-A · 지난 2주`, 1388 안내, 세션 `isYouth`·도구명 확인.
  - `localStorage` getter throw → 결과 렌더, 저장 버튼 부재, `/history` 안내 확인.
  - `sessionStorage` getter throw → 메모리 fallback으로 동의·선별·결과 동작, 저장 버튼 유지.
- 이번 사이클은 첫 실행에서 15/15 통과했으며 추가 코드 수정은 없었다.

### Phase 5 — Evaluate

```text
npm.cmd run test:e2e              → PASS (15/15 Chromium)
npm.cmd test                      → 88/88 PASS
npm.cmd run validate              → PASS
npm.cmd run a11y                  → PASS
npm.cmd run skill:check           → PASS
npm.cmd run assessment:evaluate   → PASS (9/9)
npm.cmd run security:build:check  → PASS
npm.cmd run pwa:check             → PASS
npm.cmd run privacy:check         → PASS
npm.cmd run storage:check         → PASS
npm.cmd run release:ready         → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 청소년·저장소 장애 경로는 브라우저 회귀 검사로 고정됐다. 다음 코드 후보는 저장 실패(`setItem` throw) 시 실패 안내와 기록 삭제 실패 안내 E2E다.
- 남은 배포 차단은 수동 접근성·독립 A/B/C·한국어 타당화·법무·임상 운영·실기기 증빙이다.

◆ youth-storage-fallback-e2e-complete (Path C) → next: 저장 실패 E2E 확장 또는 Cycle 37~39 후속 커밋·푸시

## Cycle 40 — Phase 0~6 (2026-11-09): 저장·삭제 실패 E2E

### Phase 0 — Inventory

- 결과 저장 실패와 기록 삭제 실패는 단위 테스트로 반환값만 확인했고, 화면이 성공으로 오인시키지 않는지 브라우저 검사가 없었다.
- `saveHistory`·`clearHistory`는 `setItem` 예외를 `false`로 흡수하지만, 결과·기록 화면의 상태 문구와 데이터 보존은 E2E로 고정되지 않았다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서 **저장 실패 E2E 2건**을 구현 대상으로 확정했다.
- 비목표: 저장 기능 확대, 문항·점수·위기 라우팅 변경, 실제 사용자 데이터 사용.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 저장 실패를 성공으로 보이면 결과 보존에 대한 오해가 생김 | 실패 안내·성공 문구 부재 확인 |
| B(위기·자살예방) | 저장 장애가 결과·위기 자원 렌더를 막으면 안 됨 | 결과 화면 유지 확인 |
| C(구현·프라이버시) | `setItem` 예외는 실패로 반환되고 기존 데이터는 남아야 함 | prototype override로 실제 쓰기 예외 주입 |

### Phase 3 — Seed

- AC130~AC131 추가: 저장 실패 안내, 전체 삭제 실패 시 기록 보존.

### Phase 4 — Implement

- `e2e/safety-flow.spec.js`: `Storage.prototype.setItem`을 `localStorage`에만 예외를 던지도록 주입하는 E2E 2건 추가.
  - 결과 저장 클릭 → “저장에 실패했습니다” 표시, 저장 성공 문구·기록 부재.
  - 저장된 기록이 있는 상태에서 전체 삭제 → “삭제에 실패했습니다” 표시, 기존 기록 1건 보존.
- 이번 사이클은 첫 실행에서 17/17 통과했으며 추가 코드 수정은 없었다.

### Phase 5 — Evaluate

```text
npm.cmd run test:e2e              → PASS (17/17 Chromium)
npm.cmd test                      → 88/88 PASS
npm.cmd run validate              → PASS
npm.cmd run a11y                  → PASS
npm.cmd run skill:check           → PASS
npm.cmd run assessment:evaluate   → PASS (9/9)
npm.cmd run security:build:check  → PASS
npm.cmd run pwa:check             → PASS
npm.cmd run privacy:check         → PASS
npm.cmd run storage:check         → PASS
npm.cmd run release:ready         → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 저장·삭제 실패 경로는 브라우저 회귀 검사로 고정됐다. 다음 코드 후보는 만 14세 미만 연령 게이트 E2E 또는 안전계획 메모 저장 실패 E2E다.
- Cycle 37~40 변경은 아직 커밋 전이며, `docs/ouroboros` 기록도 원격에 없다.

◆ storage-write-failure-e2e-complete (Path C) → next: 연령 게이트 E2E 확장 또는 Cycle 37~40 후속 커밋·푸시

## Cycle 41 — Phase 0~6 (2026-11-09): 만 14세 미만 연령 게이트 E2E

### Phase 0 — Inventory

- `app/index.js`는 만 14세 미만 선택 시 시작을 막고 법정대리인·1388 안내를 표시하지만, 실제 브라우저에서 버튼 비활성과 직접 진입 차단을 검증하지 않았다.
- `app/survey.js`는 허용된 연령대의 탭 동의가 없으면 시작 화면으로 되돌리므로 `child` 직접 진입도 차단되어야 한다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서 **만 14세 미만 연령 게이트 E2E 2건**을 구현 대상으로 확정했다.
- 비목표: 연령 정책 변경, 새 문항, 위기 라우팅 변경.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 만 14세 미만은 이 자가 선별 대상이 아니며 보호자·전문가 안내가 우선 | 시작 차단·1388 안내 확인 |
| B(위기·자살예방) | 차단 화면에서도 1388 접근이 유지돼야 함 | 1388 상담 버튼 확인 |
| C(구현·프라이버시) | URL 파라미터만으로 연령 게이트를 우회하면 안 됨 | `/survey?ageGroup=child` 리다이렉트 확인 |

### Phase 3 — Seed

- AC132~AC133 추가: 만 14세 미만 시작 차단·1388 안내, 직접 진입 차단.

### Phase 4 — Implement

- `e2e/safety-flow.spec.js`: E2E 2건 추가.
  - 만 14세 미만 선택 → 법정대리인 안내·1388 상담 표시, 시작 버튼 `aria-disabled=true`, 선별 문항 없음.
  - `/survey?ageGroup=child` 직접 진입 → 시작 화면 heading, 선별 문항 없음.
- 이번 사이클은 첫 실행에서 19/19 통과했으며 제품 코드 수정은 없었다.

### Phase 5 — Evaluate

```text
npm.cmd run test:e2e              → PASS (19/19 Chromium)
npm.cmd test                      → 88/88 PASS
npm.cmd run validate              → PASS
npm.cmd run a11y                  → PASS
npm.cmd run skill:check           → PASS
npm.cmd run assessment:evaluate   → PASS (9/9)
npm.cmd run security:build:check  → PASS
npm.cmd run pwa:check             → PASS
npm.cmd run privacy:check         → PASS
npm.cmd run storage:check         → PASS
npm.cmd run release:ready         → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 연령 게이트는 브라우저 회귀 검사로 고정됐다. 다음 코드 후보는 안전계획 메모 저장 실패 E2E 또는 결과 화면 재검사 ageGroup 유지 E2E다.
- Cycle 37~41 변경은 아직 커밋 전이며, `docs/ouroboros` 기록도 원격에 없다.

◆ age-gate-e2e-complete (Path C) → next: 안전계획 저장 실패 E2E 또는 Cycle 37~41 후속 커밋·푸시

## Cycle 42 — Phase 0~6 (2026-11-09): 안전계획 메모 실패 E2E

### Phase 0 — Inventory

- `lib/storage/safety-plan.js`는 `setItem`/`removeItem` 예외를 `false`로 흡수하지만, `/resources` 화면의 실패 안내와 메모 보존을 실제 브라우저에서 검증하지 않았다.
- 안전계획은 위기 순간에 다시 확인하는 기능이므로 저장·삭제 실패를 성공으로 표시하지 않는지 고정할 필요가 있었다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서 **안전계획 메모 저장·삭제 실패 E2E 2건**을 구현 대상으로 확정했다.
- 비목표: 안전계획 문구·단계 변경, 서버 전송·자동 공유 추가.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 메모는 전문가와 점검할 보조 수단이며 저장 실패를 숨기면 안 됨 | 실패 안내·성공 문구 부재 확인 |
| B(위기·자살예방) | 저장 장애가 위기 자원·기존 메모를 지우면 안 됨 | 실패 후 데이터 보존 확인 |
| C(구현·프라이버시) | `setItem`/`removeItem` 예외는 실패로 반환 | prototype override로 실제 예외 주입 |

### Phase 3 — Seed

- AC134~AC135 추가: 안전계획 저장 실패 안내, 전체 삭제 실패 시 메모 보존.

### Phase 4 — Implement

- `e2e/safety-flow.spec.js`: E2E 2건 추가.
  - 첫 단계 메모 입력 후 저장 → “저장에 실패했습니다” 표시, 저장 키 부재.
  - 메모 저장 후 `removeItem` 예외 주입 → “삭제에 실패했습니다” 표시, 기존 메모 보존.
- 이번 사이클은 첫 실행에서 21/21 통과했으며 제품 코드 수정은 없었다.

### Phase 5 — Evaluate

```text
npm.cmd run test:e2e              → PASS (21/21 Chromium)
npm.cmd test                      → 88/88 PASS
npm.cmd run validate              → PASS
npm.cmd run a11y                  → PASS
npm.cmd run skill:check           → PASS
npm.cmd run assessment:evaluate   → PASS (9/9)
npm.cmd run security:build:check  → PASS
npm.cmd run pwa:check             → PASS
npm.cmd run privacy:check         → PASS
npm.cmd run storage:check         → PASS
npm.cmd run release:ready         → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 안전계획 저장·삭제 실패 경로는 브라우저 회귀 검사로 고정됐다. 다음 코드 후보는 결과 화면 “다시 검사하기”의 청소년 ageGroup 유지 E2E다.
- Cycle 37~42 변경은 아직 커밋 전이며, `docs/ouroboros` 기록도 원격에 없다.

◆ safety-plan-failure-e2e-complete (Path C) → next: 청소년 재검사 ageGroup 유지 E2E 또는 Cycle 37~42 후속 커밋·푸시

## Cycle 43 — Phase 0~6 (2026-11-09): 청소년 재검사 ageGroup 유지 E2E

### Phase 0 — Inventory

- `app/result.js`의 “다시 검사하기”는 `result.isYouth`로 ageGroup을 넘기지만, 브라우저에서 재검사 URL·동의 유지·PHQ-A 복귀를 검증하지 않았다.
- 청소년이 재검사에서 성인 PHQ-9로 전환되면 결과 해석이 달라질 수 있어 회귀 검사가 필요했다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서 **청소년 재검사 ageGroup 유지 E2E 1건**을 구현 대상으로 확정했다.
- 비목표: 재검사 흐름·문항·위기 라우팅 변경.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 청소년 재검사는 PHQ-A를 유지해야 함 | 재검사 후 PHQ-A 단계 확인 |
| B(위기·자살예방) | 재검사가 동의·안전 확인을 우회하면 안 됨 | 같은 탭 동의 유지 + 안전 확인부터 시작 |
| C(구현·프라이버시) | ageGroup은 세션 동의와 일치해야 함 | URL·화면 단계 검증 |

### Phase 3 — Seed

- AC136 추가: 청소년 재검사 ageGroup 유지.

### Phase 4 — Implement

- `e2e/safety-flow.spec.js`: 청소년 완료 → “다시 검사하기” → `/survey?...ageGroup=youth` → 안전 확인 → `우울 증상 · PHQ-A` 확인.
- 이번 사이클은 첫 실행에서 22/22 통과했으며 제품 코드 수정은 없었다.

### Phase 5 — Evaluate

```text
npm.cmd run test:e2e              → PASS (22/22 Chromium)
npm.cmd test                      → 88/88 PASS
npm.cmd run validate              → PASS
npm.cmd run a11y                  → PASS
npm.cmd run skill:check           → PASS
npm.cmd run assessment:evaluate   → PASS (9/9)
npm.cmd run security:build:check  → PASS
npm.cmd run pwa:check             → PASS
npm.cmd run privacy:check         → PASS
npm.cmd run storage:check         → PASS
npm.cmd run release:ready         → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 코드로 구현 가능한 주요 안전 회귀 후보는 소진됐다. 추가 테스트 확장보다 **Cycle 37~43 후속 커밋·푸시**와 P0 사람 증빙 수집이 우선이다.
- 원격은 여전히 `6f251fe`이며 `docs/ouroboros` 기록과 최신 E2E가 빠져 있다.

◆ youth-retest-agegroup-e2e-complete (Path C) → next: Cycle 37~43 후속 커밋·푸시 후 P0 사람 증빙 착수

## Cycle 44 — Phase 0~6 (2026-11-09): 권장 순서 일괄 실행·CI 하네스 수정

### Phase 0 — Inventory

- 원격 HEAD는 `6f251fe`였고 Cycle 37~43 변경과 `docs/ouroboros` 기록이 로컬에만 있었다.
- GitHub Actions의 `Linux deployment harness`가 `6f251fe`에서 exit 42로 실패하고 있었다.
- Phase 1·2·3·4·5의 실제 사람·기관 증빙은 저장소에 없었다.

### Phase 1 — Interview

- 사용자가 권장 순서 일괄 실행을 지시했다.
- 결정: **커밋·푸시와 CI 수정은 실행**하고, 사람 증빙이 필요한 게이트는 패킷·차단 상태만 갱신한다. 증빙을 만들거나 통과로 표시하지 않는다.

### Phase 2 — A/B/C Cross-validation

| 단계 | A(임상) | B(위기) | C(구현·프라이버시) | 결론 |
|---|---|---|---|---|
| 커밋·푸시 | 기록 누락은 추적성 훼손 | 위기 E2E 22건 포함 | 로컬 도구·PII 제외, docs/ouroboros 추적 | 실행 |
| Phase 3 수동 접근성 | 자동 대체 불가 | 실제 기기 필요 | 증빙 없음 | 패킷·차단 유지 |
| Phase 2 독립 검토 | 외부 검토 필요 | 역할별 승인 필요 | 모델 검토는 승인 아님 | 패킷 생성·차단 유지 |
| Phase 6 배포 후보 | — | TLS/PWA 실기기 필요 | 로컬 E2E·CI까지만 가능 | 자동 게이트·CI 확인 |
| Phase 1·4·5 | 연구·법무·기관 필요 | 운영 책임 필요 | 코드 대체 불가 | 차단 유지 |

### Phase 3 — Seed

- AC137~AC139 추가: CI 하네스 예상 실패 처리, Cycle 37~43 푸시·CI 통과, 사람 증빙 차단 유지.

### Phase 4 — Implement

- `702d106`으로 Cycle 37~43 변경과 `docs/ouroboros` 기록을 커밋·푸시.
- GitHub Actions에서 deployment harness가 exit 42로 실패하는 것을 확인. 원인은 `expect_failure`가 예상 실패 코드를 그대로 반환해 `set -e`가 스크립트를 종료시키는 버그였다.
- `deploy/tests/release-harness.sh`: `expect_failure`를 `if "$@"; then fail ...; fi` 형태로 수정.
- `tests/deployment-script.test.js`: 잘못된 `&&` 패턴 회귀 검사 추가.
- `4ad7914`로 수정 커밋·푸시.
- Phase 2 검토 패킷을 생성(범위 `SCREENING-CONNECTION-STATIC-WEB`, 해시 `743c0e64`). 실제 외부 검토 증빙은 기록하지 않았다.

### Phase 5 — Evaluate

```text
git push 702d106                 → PASS
GitHub Actions Browser safety    → PASS
GitHub Actions Linux harness     → FAIL (exit 42)
git push 4ad7914                 → PASS
GitHub Actions Browser safety    → PASS
GitHub Actions Linux harness     → PASS
npm.cmd test                     → 88/88 PASS
npm.cmd run test:e2e             → 22/22 PASS
npm.cmd run manual:check         → EXPECTED BLOCKED (7개 시나리오·범위 해시 없음)
npm.cmd run abc:evidence:check   → EXPECTED BLOCKED (A/B/C/해결승인 없음)
npm.cmd run validation:evidence:check → EXPECTED BLOCKED (8단계 없음)
npm.cmd run legal:evidence:check → EXPECTED BLOCKED (6단계 없음)
npm.cmd run clinical:handoff:check → EXPECTED BLOCKED (6단계 없음)
npm.cmd run release:ready        → EXPECTED BLOCKED (사람 증빙 미완료)
```

### Phase 6 — Evolve

- 저장소 정합성과 CI는 해소됐다. 남은 것은 실제 수동 접근성·기기, 독립 A/B/C, 법무·임상 운영, 한국어 타당화, 배포 후보 TLS/PWA 확인이다.
- 다음 최고 영향 작업은 Phase 3 수동 접근성·실기기 증빙이며, 이후 Phase 2 독립 검토와 Phase 6 배포 후보 확인이다.

◆ bulk-recommended-order-executed (Path C) → next: Phase 3 수동 접근성·실기기 증빙 또는 Phase 2 독립 A/B/C 검토

## Cycle 45 — Phase 0~6 (2026-11-09): 수동 검증 패킷 CLI

### Phase 0 — Inventory

- Phase 3 수동 접근성·실기기 증빙은 7개 시나리오 모두 BLOCKED이며, 실제 장비·보조기술 시험 없이는 해제할 수 없다.
- 기존 `abc:packet`과 달리, 사람이 수행할 수동 검증의 시나리오·범위 해시·기록 형식을 한 번에 전달하는 CLI가 없었다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서, 증빙을 대체하지 않는 **수동 검증 준비 패킷 CLI**를 구현 대상으로 확정했다.
- 비목표: 실제 NVDA/VoiceOver/TalkBack/기기 시험 수행, PASS 기록 생성, `manual:check` 차단 해제.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 자동 검사·패킷은 실제 보조기술 사용자 경험을 대체하지 못함 | 비승인·비증빙 고지 |
| B(위기·자살예방) | 위기 CTA·전화 앱·오프라인 안내가 시나리오에 포함돼야 함 | 7개 필수 시나리오·통과 기준 |
| C(구현·프라이버시) | 현재 범위 해시·비식별 기록 형식이 필요 | 범위 지문·기록 규칙 출력, PII 금지 |

### Phase 3 — Seed

- AC140~AC142 추가: 패킷 출력, 비승인 고지, 범위 해시 필수·차단 유지.

### Phase 4 — Implement

- `lib/manual-verification-packet.js`: 시나리오 가이드와 패킷 문자열 생성, 범위 해시 필수 검증.
- `bin/print-manual-verification-packet.js`, `npm run manual:packet` 추가.
- `tests/manual-verification.test.js`: 7개 시나리오·범위 해시·PII 금지·비승인 고지, 해시 누락 거부 회귀 2건 추가.
- `docs/a11y-manual-test-plan.md`, `docs/operations/a11y-device-evidence.md`: 패킷은 준비 자료이며 증빙이 아님을 명시.

### Phase 5 — Evaluate

```text
npm.cmd run manual:packet        → PASS (범위 해시 a62f2154, 7개 시나리오)
npm.cmd test                     → 90/90 PASS
npm.cmd run a11y                 → PASS
npm.cmd run skill:check          → PASS
npm.cmd run manual:check         → EXPECTED BLOCKED (실제 수동 기록 없음)
npm.cmd run release:ready        → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 이제 Phase 3 실행자는 `manual:packet` 출력과 `docs/operations/a11y-device-evidence.md`로 실제 시험을 기록할 수 있다. 실제 PASS 기록 전까지 배포 차단은 유지된다.
- 다음 최고 영향 작업은 실제 NVDA·VoiceOver·TalkBack·320px·200%·전화 앱·오프라인 PWA 시험이다.

◆ manual-verification-packet-ready (Path C) → next: 실제 Phase 3 수동 접근성·실기기 시험 기록

## Cycle 46 — Phase 0~6 (2026-11-09): 320px 레이아웃·위기 hydration E2E

### Phase 0 — Inventory

- 320px 레이아웃 회귀를 자동으로 감지하는 테스트가 없었다.
- 직접 `/crisis?reason=safety` 진입 시 정적 HTML과 클라이언트 첫 렌더의 `reason` 텍스트가 달라 React hydration #418이 발생했다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서 **320px 핵심 화면 레이아웃 E2E**와 발견된 hydration 결함 수정을 구현 대상으로 확정했다.
- 비목표: 수동 접근성 증빙 대체, 200% 확대 자동 판정, 디자인 변경.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 자동 레이아웃 검사는 수동 접근성 검증을 대체하지 않음 | 자동 회귀·수동 증빙 분리 유지 |
| B(위기·자살예방) | 작은 화면에서 위기 CTA가 잘리거나 hydration 오류가 나면 안 됨 | CTA 화면 내 배치·pageerror 0 확인 |
| C(구현·프라이버시) | 320px 무가로스크롤·쿼리 직접 진입 안정성 필요 | 6개 화면 검사, 마운트 후 reason 렌더 |

### Phase 3 — Seed

- AC143~AC144 추가: 320px 레이아웃, 위기 직접 진입 hydration.

### Phase 4 — Implement

- `e2e/layout.spec.js`: 320×720 viewport에서 인트로·설문·위기·자원·센터·결과 가드의 무가로스크롤과 위기 CTA 배치를 검사.
- `app/crisis.js`: `mounted` 상태를 두고 `reason` 안내를 마운트 후에만 렌더해 hydration mismatch 제거.
- **실시간 보완 1**: 접근성 라벨·지역명 선택자를 실제 값(`109 자살예방상담전화로 연결`, `119 응급 구급으로 연결`, `서울특별시`)으로 보정.
- **실시간 보완 2**: `boundingBox()`가 null을 반환하는 경우가 있어 `getBoundingClientRect()` 기반 검사로 변경.
- **실시간 보완 3**: PowerShell 치환 과정에서 생긴 UTF-8 BOM을 제거.

### Phase 5 — Evaluate

```text
npm.cmd run test:e2e              → PASS (28/28 Chromium)
npm.cmd test                      → 90/90 PASS
npm.cmd run validate              → PASS
npm.cmd run a11y                  → PASS
npm.cmd run skill:check           → PASS
npm.cmd run security:build:check  → PASS
npm.cmd run manual:check          → EXPECTED BLOCKED (실제 수동 기록 없음)
npm.cmd run release:ready         → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 320px 레이아웃과 직접 위기 URL은 자동 회귀로 고정됐지만, VIEWPORT-320 수동 증빙을 대체하지 않는다.
- 다음은 실제 NVDA·VoiceOver·TalkBack·전화 앱·오프라인 PWA 시험과 Cycle 45~46 후속 커밋·푸시다.

◆ 320px-layout-crisis-hydration-complete (Path C) → next: Cycle 45~46 후속 커밋·푸시 또는 실제 Phase 3 수동 시험

## Cycle 47 — Phase 0~6 (2026-11-09): 안전계획 메모 위기 화면 E2E

### Phase 0 — Inventory

- 안전계획 메모는 저장·삭제 단위 테스트가 있었지만, 저장한 메모가 `/crisis`에서 실제로 다시 표시되는지 브라우저 검사가 없었다.
- 삭제 후 위기 화면에 남는 회귀도 자동 검사로 고정되어 있지 않았다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서 **안전계획 메모 위기 화면 표시·삭제 E2E 2건**을 구현 대상으로 확정했다.
- 비목표: 안전계획 문구·단계 변경, 자동 공유·서버 전송.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 메모는 전문가와 점검할 보조 수단이며 임상 판단이 아님 | 저장·표시만 검증 |
| B(위기·자살예방) | 위기 화면에서 저장 메모를 다시 확인할 수 있어야 함 | `/resources` 저장 → `/crisis` 표시 |
| C(구현·프라이버시) | 기기 내 저장·삭제가 화면에 일관되게 반영 | 삭제 후 위기 화면에서 제거 확인 |

### Phase 3 — Seed

- AC145~AC146 추가: 위기 화면 메모 표시, 삭제 후 제거.

### Phase 4 — Implement

- `e2e/safety-flow.spec.js`: E2E 2건 추가.
  - 1·4단계 메모 저장 → `/crisis?reason=safety`에서 제목·내용·기기 내 저장 고지 확인.
  - 메모 저장 후 전체 삭제 → `/crisis`에서 메모 제목·내용 부재 확인.
- 이번 사이클은 첫 실행에서 30/30 통과했으며 제품 코드 수정은 없었다.

### Phase 5 — Evaluate

```text
npm.cmd run test:e2e              → PASS (30/30 Chromium)
npm.cmd test                      → 90/90 PASS
npm.cmd run validate              → PASS
npm.cmd run a11y                  → PASS
npm.cmd run skill:check           → PASS
npm.cmd run security:build:check  → PASS
npm.cmd run manual:check          → EXPECTED BLOCKED (실제 수동 기록 없음)
npm.cmd run release:ready         → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 안전계획 메모의 저장·표시·삭제 경로는 브라우저 회귀 검사로 고정됐다.
- 다음은 Cycle 45~47 후속 커밋·푸시와 실제 Phase 3 수동 접근성·실기기 시험이다.

◆ safety-plan-memo-crisis-e2e-complete (Path C) → next: Cycle 45~47 후속 커밋·푸시 또는 실제 Phase 3 수동 시험

## Cycle 48 — Phase 0~6 (2026-11-09): 위험 신호 결과 메모 노출 E2E

### Phase 0 — Inventory

- AC29(위험 신호 결과에서 저장 메모 즉시 노출)는 정적 감사·단위 테스트만 있고, 실제 urgent 결과 화면의 저장 메모/작성 안내 분기를 브라우저에서 검증하지 않았다.
- PHQ-9 문항 9를 1점으로 응답하고 ASQ를 음성으로 유지하면 급성은 아니지만 urgent 결과가 나온다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서 **urgent 결과의 저장 메모 노출·작성 안내 E2E 2건**을 구현 대상으로 확정했다.
- 비목표: 문항·점수·위험 라우팅 변경, 메모 자동 공유.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 문항 9 비영 응답은 low로 종결되면 안 됨 | urgent 결과 확인 |
| B(위기·자살예방) | 위험 신호 결과에서 저장 메모를 즉시 상기시켜야 함 | 저장 메모 노출 / 없으면 작성 안내 |
| C(구현·프라이버시) | 메모는 기기 내 저장만, 결과 화면에서 읽기 전용 | 표시 내용·저장 경계 확인 |

### Phase 3 — Seed

- AC147~AC148 추가: urgent 결과 저장 메모 노출, 메모 없음 시 작성 안내.

### Phase 4 — Implement

- `e2e/safety-flow.spec.js`: `completeUrgentSurvey` 헬퍼와 E2E 2건 추가.
  - 메모 저장 → 문항 9=1 urgent 결과 → 결과 화면에 저장 메모 표시, 작성 안내 부재.
  - 메모 없음 → urgent 결과 화면에 작성 안내 표시, 저장 메모 제목 부재.
- 이번 사이클은 첫 실행에서 32/32 통과했으며 제품 코드 수정은 없었다.

### Phase 5 — Evaluate

```text
npm.cmd run test:e2e              → PASS (32/32 Chromium)
npm.cmd test                      → 90/90 PASS
npm.cmd run validate              → PASS
npm.cmd run a11y                  → PASS
npm.cmd run skill:check           → PASS
npm.cmd run security:build:check  → PASS
npm.cmd run manual:check          → EXPECTED BLOCKED (실제 수동 기록 없음)
npm.cmd run release:ready         → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 위험 신호 결과의 메모 노출·작성 안내 분기는 브라우저 회귀 검사로 고정됐다.
- 다음은 Cycle 45~48 후속 커밋·푸시와 실제 Phase 3 수동 접근성·실기기 시험이다.

◆ urgent-result-memo-e2e-complete (Path C) → next: Cycle 45~48 후속 커밋·푸시 또는 실제 Phase 3 수동 시험

## Cycle 49 — Phase 0~6 (2026-11-09): 남은 페이즈 일괄 실행

### Phase 0 — Inventory

- 원격 HEAD는 `f8782fa`였고 Cycle 45~48 변경(수동 검증 패킷·320px E2E·위기 hydration 수정·메모 E2E)이 미커밋 상태였다.
- `manual:check`·`abc:evidence:check`·`validation:evidence:check`·`legal:evidence:check`·`clinical:handoff:check`는 모두 실제 증빙 부재로 BLOCKED였다.

### Phase 1 — Interview

- 사용자가 남은 페이즈 일괄 실행을 지시했다.
- 결정: **커밋·푸시와 자동 검증은 실행**하고, 실제 사람·기관 증빙이 필요한 Phase 1·3·4·5는 패킷·차단 상태만 유지한다. 증빙을 만들지 않는다.

### Phase 2 — A/B/C Cross-validation

| 대상 | A(임상) | B(위기) | C(구현·프라이버시) | 결정 |
|---|---|---|---|---|
| Cycle 45~48 푸시 | 기록 추적성 유지 | E2E 32건 포함 | 비밀·로컬 도구 제외 | 실행 |
| Phase 3 수동 | 자동 대체 불가 | 실기기 필요 | 증빙 없음 | 패킷만, 차단 유지 |
| Phase 2 독립 검토 | 외부 검토 필요 | 역할별 승인 | 모델 검토는 승인 아님 | 패킷만, 차단 유지 |
| Phase 4·5·1 | 연구·법무·기관 | 운영 책임 | 코드 대체 불가 | 차단 유지 |
| Phase 6 배포 | — | TLS/PWA 실기기 | 로컬 E2E·CI까지만 | 자동 게이트·CI 확인 |

### Phase 3 — Seed

- AC149~AC151 추가: Cycle 45~48 푸시·CI, 현재 범위 해시 패킷, 사람 증빙 차단 유지.

### Phase 4 — Implement

- Cycle 45~48 변경을 `afaa28f`로 커밋·푸시.
- GitHub Actions Browser safety·Linux deployment harness 모두 PASS 확인.
- 현재 범위 해시 `bbb427a5`를 `manual:packet`·`abc:packet` 기준으로 확인.
- 사람 증빙 게이트는 실행하지 않고 차단 사유만 확인했다.

### Phase 5 — Evaluate

```text
git push afaa28f                 → PASS
GitHub Actions Browser safety    → PASS
GitHub Actions Linux harness     → PASS
npm.cmd test                     → 90/90 PASS
npm.cmd run test:e2e             → 32/32 PASS
범위 해시                         → bbb427a5
npm.cmd run manual:check         → EXPECTED BLOCKED (7개 시나리오 없음)
npm.cmd run abc:evidence:check   → EXPECTED BLOCKED (A/B/C/해결승인 없음)
npm.cmd run validation:evidence:check → EXPECTED BLOCKED (8단계 없음)
npm.cmd run legal:evidence:check → EXPECTED BLOCKED (6단계 없음)
npm.cmd run clinical:handoff:check → EXPECTED BLOCKED (6단계 없음)
npm.cmd run release:ready        → EXPECTED BLOCKED (사람 증빙 미완료)
```

### Phase 6 — Evolve

- 저장소·CI·자동 검증은 최신 상태다. 남은 것은 실제 수동 접근성·기기, 독립 A/B/C, 법무·임상 운영, 한국어 타당화, 배포 후보 TLS/PWA 확인이다.
- 다음 최고 영향 작업은 Phase 3 수동 접근성·실기기 시험이다.

◆ remaining-phases-bulk-executed (Path C) → next: Phase 3 수동 접근성·실기기 증빙 착수

## Cycle 50 — Phase 0~6 (2026-11-09): PHQ-9 한국어/영문 토글 E2E

### Phase 0 — Inventory

- AC5(한국어/영문 문항 토글·번역 고지)는 단위·정적 검사만 있고, 실제 설문 화면에서 토글이 문항을 바꾸는지 브라우저 검증이 없었다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서 **PHQ-9 첫 문항의 한국어/영문 토글 E2E 1건**을 구현 대상으로 확정했다.
- 비목표: 문항·번역·채점 변경, 언어 설정 저장.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 한국어는 이해 보조 번역, 채점은 영문 원문 기준임을 화면에 유지 | 번역 고지 노출 확인 |
| B(위기·자살예방) | 토글이 안전·위기 흐름을 방해하면 안 됨 | PHQ 단계에서만 토글, pageerror 0 |
| C(구현·프라이버시) | 토글은 로컬 UI 상태만 사용 | 저장 영향 없음 |

### Phase 3 — Seed

- AC152 추가: PHQ-9 한국어/영문 토글·번역 고지 E2E.

### Phase 4 — Implement

- `e2e/safety-flow.spec.js`: PHQ-9 첫 문항에서 한국어 문항·번역 고지 확인 → 영문 원문 보기 → 한국어로 보기 복귀 검증.
- 이번 사이클은 첫 실행에서 33/33 통과했으며 제품 코드 수정은 없었다.

### Phase 5 — Evaluate

```text
npm.cmd run test:e2e              → PASS (33/33 Chromium)
npm.cmd test                      → 90/90 PASS
npm.cmd run validate              → PASS
npm.cmd run a11y                  → PASS
npm.cmd run skill:check           → PASS
npm.cmd run security:build:check  → PASS
npm.cmd run manual:check          → EXPECTED BLOCKED (실제 수동 기록 없음)
npm.cmd run release:ready         → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 한국어/영문 토글은 브라우저 회귀 검사로 고정됐다.
- 다음은 Cycle 50 후속 커밋·푸시와 실제 Phase 3 수동 접근성·실기기 시험이다.

◆ phq9-language-toggle-e2e-complete (Path C) → next: Cycle 50 후속 커밋·푸시 또는 실제 Phase 3 수동 시험

## Cycle 51 — Phase 0~6 (2026-11-09): 추이 라벨·단건 삭제 E2E

### Phase 0 — Inventory

- 추이 차트 행 접근성 라벨(AC31)과 기록 한 건 삭제는 정적 감사·단위 테스트만 있고 실제 `/history` 브라우저 검사가 없었다.
- 전체 삭제 E2E는 있었지만 단건 삭제 후 빈 상태·성공 안내 경로는 검증되지 않았다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서 **추이 행 접근성 라벨·단건 삭제 E2E 2건**을 구현 대상으로 확정했다.
- 비목표: 추이 저장 스키마·그래프 디자인 변경.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 추이는 진단이 아니며 날짜·점수 맥락이 읽혀야 함 | 행 접근성 라벨 확인 |
| B(위기·자살예방) | 삭제 성공/실패를 오인시키면 안 됨 | 단건 삭제 후 빈 상태·성공 안내 |
| C(구현·프라이버시) | 삭제 시 저장소에서 실제 제거 | `entries` 0 확인 |

### Phase 3 — Seed

- AC153~AC154 추가: 추이 행 접근성 라벨, 단건 삭제 E2E.

### Phase 4 — Implement

- `e2e/safety-flow.spec.js`: E2E 2건 추가.
  - 저장 후 `/history`에서 `우울 0점, 불안 0점` 접근성 라벨 확인.
  - 단건 삭제 → 성공 안내·빈 상태·저장소 `entries` 0 확인.
- 이번 사이클은 첫 실행에서 35/35 통과했으며 제품 코드 수정은 없었다.

### Phase 5 — Evaluate

```text
npm.cmd run test:e2e              → PASS (35/35 Chromium)
npm.cmd test                      → 90/90 PASS
npm.cmd run validate              → PASS
npm.cmd run a11y                  → PASS
npm.cmd run skill:check           → PASS
npm.cmd run security:build:check  → PASS
npm.cmd run manual:check          → EXPECTED BLOCKED (실제 수동 기록 없음)
npm.cmd run release:ready         → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 추이 라벨·단건 삭제는 브라우저 회귀 검사로 고정됐다.
- 다음은 Cycle 50~51 후속 커밋·푸시와 실제 Phase 3 수동 접근성·실기기 시험이다.

◆ history-label-single-delete-e2e-complete (Path C) → next: Cycle 50~51 후속 커밋·푸시 또는 실제 Phase 3 수동 시험

## Cycle 52 — Phase 0~6 (2026-11-09): 오프라인 PWA 위기 안내 E2E

### Phase 0 — Inventory

- PWA 오프라인 위기 안내는 정적 감사·수동 시나리오만 있고, 실제 Chromium에서 서비스 워커 오프라인 fallback을 검증하는 E2E가 없었다.
- `public/sw.js`는 navigate 요청 실패 시 `/offline.html`을 반환한다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서 **오프라인 탐색 fallback E2E 1건**을 구현 대상으로 확정했다.
- 비목표: 실제 설치된 PWA·모바일 기기·전화 앱 시험 대체.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 오프라인 안내는 진단이 아니라 위기 연결 정보 | 위기 번호 링크 확인 |
| B(위기·자살예방) | 연결 단절 시에도 109 등 위기 자원이 보여야 함 | 오프라인 heading·109·119 링크 |
| C(구현·프라이버시) | SW 캐시는 동일 출처 정적 자산만 | 오프라인 탐색 fallback만 검사 |

### Phase 3 — Seed

- AC155 추가: 오프라인 탐색 위기 안내.

### Phase 4 — Implement

- `e2e/offline.spec.js`: `/`에서 서비스 워커 ready·controller 대기 → `context.setOffline(true)` → `/crisis` 탐색 → 오프라인 안내·109·119 링크 확인.
- 서비스 워커 상태 대기는 `navigator.serviceWorker.ready`와 `controller` 확인으로 고정.
- 이번 사이클은 첫 실행에서 36/36 통과했으며 제품 코드 수정은 없었다.

### Phase 5 — Evaluate

```text
npm.cmd run test:e2e              → PASS (36/36 Chromium)
npm.cmd test                      → 90/90 PASS
npm.cmd run validate              → PASS
npm.cmd run a11y                  → PASS
npm.cmd run skill:check           → PASS
npm.cmd run security:build:check  → PASS
npm.cmd run manual:check          → EXPECTED BLOCKED (실제 수동 기록 없음)
npm.cmd run release:ready         → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 오프라인 fallback은 자동 회귀로 고정됐지만, 실제 설치 PWA·모바일 기기·전화 앱 시험은 여전히 Phase 3 수동 증빙이다.
- 다음은 Cycle 50~52 후속 커밋·푸시와 실제 Phase 3 수동 접근성·실기기 시험이다.

◆ offline-pwa-crisis-e2e-complete (Path C) → next: Cycle 50~52 후속 커밋·푸시 또는 실제 Phase 3 수동 시험

## Cycle 53 — Phase 0~6 (2026-11-09): 기능손상 urgent E2E

### Phase 0 — Inventory

- 기능손상 비채점 문항의 `very/extreme → urgent` 라우팅은 단위 테스트만 있고, 실제 설문·결과 화면의 브라우저 검사가 없었다.
- PHQ-9·GAD-7이 0점이어도 기능손상이 크면 urgent 결과로 안내되어야 한다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서 **기능손상 very → urgent E2E 1건**을 구현 대상으로 확정했다.
- 비목표: 기능손상 문항·라우팅 변경, 점수 포함.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 기능손상은 점수에 더하지 않고 urgent 안내에만 사용 | 점수 0·비채점 표시 확인 |
| B(위기·자살예방) | 기능 악화는 위험 신호로 빠른 도움 안내 | urgent 결과·위기 화면 아님 확인 |
| C(구현·프라이버시) | 비채점 문항이 점수에 포함되지 않음 | 결과 점수 0 확인 |

### Phase 3 — Seed

- AC156 추가: 기능손상 very → urgent 결과.

### Phase 4 — Implement

- `e2e/safety-flow.spec.js`: `completeImpairedSurvey` 헬퍼와 E2E 1건 추가.
  - PHQ-9·GAD-7 0점, 기능손상 “많이 어려웠다” → `/result`, urgent 라벨·사유·비채점 박스, 우울·불안 0점 확인.
- 이번 사이클은 첫 실행에서 37/37 통과했으며 제품 코드 수정은 없었다.

### Phase 5 — Evaluate

```text
npm.cmd run test:e2e              → PASS (37/37 Chromium)
npm.cmd test                      → 90/90 PASS
npm.cmd run validate              → PASS
npm.cmd run a11y                  → PASS
npm.cmd run skill:check           → PASS
npm.cmd run security:build:check  → PASS
npm.cmd run manual:check          → EXPECTED BLOCKED (실제 수동 기록 없음)
npm.cmd run release:ready         → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 기능손상 urgent 라우팅은 브라우저 회귀 검사로 고정됐다.
- 다음은 Cycle 50~53 후속 커밋·푸시와 실제 Phase 3 수동 접근성·실기기 시험이다.

◆ functional-impairment-urgent-e2e-complete (Path C) → next: Cycle 50~53 후속 커밋·푸시 또는 실제 Phase 3 수동 시험

## Cycle 54 — Phase 0~6 (2026-11-09): 지역 센터 공식 포털 E2E

### Phase 0 — Inventory

- 지역 센터 선택과 공식 포털 URL 연결은 정적 회귀 검사만 있고, 실제 화면에서 지역 선택 → 포털 열기까지 브라우저 검증이 없었다.
- `openUrl`은 웹에서 `window.open`을 사용하므로 네트워크 없이 URL 배선을 검증할 수 있다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서 **지역 선택·공식 포털 URL E2E 1건**을 구현 대상으로 확정했다.
- 비목표: 실제 포털 페이지 로딩·센터 정보 자동 조회.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 센터 검색은 진단이 아니라 지역 연결 안내 | 지역 선택·포털 연결만 |
| B(위기·자살예방) | 위기 자원·1577-0199 안내 유지 | 기존 위기 배너·버튼 유지 |
| C(구현·프라이버시) | 공식 포털 URL만 열고 입력값을 전송하지 않음 | `window.open` URL 캡처 |

### Phase 3 — Seed

- AC157 추가: 지역 선택 → 공식 포털 검색 URL.

### Phase 4 — Implement

- `e2e/safety-flow.spec.js`: `window.open`을 캡처하도록 주입하고, 서울특별시 선택 → “공식 포털에서 센터 검색” 클릭 → `mentalhealth.go.kr`·`PotalHealthFacListTab2.do`·`sc3=AFCS1` 포함 URL 확인.
- 이번 사이클은 첫 실행에서 38/38 통과했으며 제품 코드 수정은 없었다.

### Phase 5 — Evaluate

```text
npm.cmd run test:e2e              → PASS (38/38 Chromium)
npm.cmd test                      → 90/90 PASS
npm.cmd run validate              → PASS
npm.cmd run a11y                  → PASS
npm.cmd run skill:check           → PASS
npm.cmd run security:build:check  → PASS
npm.cmd run manual:check          → EXPECTED BLOCKED (실제 수동 기록 없음)
npm.cmd run release:ready         → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 지역 센터 포털 연결은 브라우저 회귀 검사로 고정됐다.
- 다음은 Cycle 50~54 후속 커밋·푸시와 실제 Phase 3 수동 접근성·실기기 시험이다.

◆ center-portal-e2e-complete (Path C) → next: Cycle 50~54 후속 커밋·푸시 또는 실제 Phase 3 수동 시험

## Cycle 55 — Phase 0~6 (2026-11-09): 키보드 건너뛰기 링크 E2E

### Phase 0 — Inventory

- `본문으로 건너뛰기` 링크는 정적 a11y 감사만 있고, 실제 키보드 활성화 시 `#root` 포커스 이동을 브라우저에서 검증하지 않았다.
- WCAG 2.4.1(건너뛰기 링크)은 핵심 접근성 기능이다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서 **키보드 건너뛰기 링크 E2E 1건**을 구현 대상으로 확정했다.
- 비목표: 실제 스크린리더 수동 검증 대체.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 결과·위기 안내 접근성 기반 | 본문 포커스 이동만 |
| B(위기·자살예방) | 키보드 사용자가 위기 CTA로 빠르게 이동 | skip link → `#root` |
| C(구현·프라이버시) | 부트스트랩 스크립트만 사용, 저장·전송 없음 | pageerror 0 |

### Phase 3 — Seed

- AC158 추가: 키보드 건너뛰기 링크.

### Phase 4 — Implement

- `e2e/a11y.spec.js`: skip link 포커스 → Enter → `document.activeElement.id === 'root'` 확인.
- 이번 사이클은 첫 실행에서 39/39 통과했으며 제품 코드 수정은 없었다.

### Phase 5 — Evaluate

```text
npm.cmd run test:e2e              → PASS (39/39 Chromium)
npm.cmd test                      → 90/90 PASS
npm.cmd run validate              → PASS
npm.cmd run a11y                  → PASS
npm.cmd run skill:check           → PASS
npm.cmd run security:build:check  → PASS
npm.cmd run manual:check          → EXPECTED BLOCKED (실제 수동 기록 없음)
npm.cmd run release:ready         → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 건너뛰기 링크는 자동 회귀로 고정됐지만 실제 NVDA·VoiceOver·TalkBack 검증은 Phase 3 수동 증빙이다.
- 다음은 Cycle 50~55 후속 커밋·푸시와 실제 Phase 3 수동 접근성·실기기 시험이다.

◆ skip-link-e2e-complete (Path C) → next: Cycle 50~55 후속 커밋·푸시 또는 실제 Phase 3 수동 시험

## Cycle 56 — Phase 0~6 (2026-11-09): 남은 작업 일괄 실행

### Phase 0 — Inventory

- 원격 HEAD는 `4a63c32`였고 Cycle 50~55 E2E·문서 변경 7개가 미커밋 상태였다.
- `manual:check`·`abc:evidence:check`는 실제 증빙 부재로 BLOCKED였다.
- 현재 범위 해시는 `bbb427a5`였다.

### Phase 1 — Interview

- 사용자가 남은 작업 일괄 실행을 지시했다.
- 결정: **커밋·푸시와 자동 검증·패킷은 실행**하고, 사람·기관 증빙은 차단 상태를 유지한다. 증빙을 만들지 않는다.

### Phase 2 — A/B/C Cross-validation

| 대상 | A(임상) | B(위기) | C(구현·프라이버시) | 결정 |
|---|---|---|---|---|
| Cycle 50~55 푸시 | 안전 회귀 39건 포함 | 오프라인·메모·센터 연결 포함 | 비밀·로컬 도구 제외 | 실행 |
| Phase 3 수동 | 자동 대체 불가 | 실기기 필요 | 증빙 없음 | 차단 유지 |
| Phase 2 독립 검토 | 외부 검토 필요 | 역할별 승인 | 모델 검토는 승인 아님 | 차단 유지 |
| Phase 4·5·1 | 연구·법무·기관 | 운영 책임 | 코드 대체 불가 | 차단 유지 |
| Phase 6 배포 | — | TLS/PWA 실기기 | 로컬 E2E·CI까지만 | CI 확인 |

### Phase 3 — Seed

- AC159~AC161 추가: Cycle 50~55 푸시·CI, 현재 해시 패킷, 사람 증빙 차단 유지.

### Phase 4 — Implement

- Cycle 50~55 변경을 `8ffcb6c`로 커밋·푸시.
- GitHub Actions Browser safety·Linux deployment harness 모두 PASS 확인.
- `manual:packet`·`abc:packet` 출력이 범위 `SCREENING-CONNECTION-STATIC-WEB`, 해시 `bbb427a5`와 “증빙 아님” 고지를 유지함을 확인.
- 사람 증빙 게이트는 실행하지 않고 차단 사유만 확인했다.

### Phase 5 — Evaluate

```text
git push 8ffcb6c                 → PASS
GitHub Actions Browser safety    → PASS
GitHub Actions Linux harness     → PASS
npm.cmd test                     → 90/90 PASS
npm.cmd run test:e2e             → 39/39 PASS
범위 해시                         → bbb427a5
npm.cmd run manual:check         → EXPECTED BLOCKED (7개 시나리오 없음)
npm.cmd run abc:evidence:check   → EXPECTED BLOCKED (A/B/C/해결승인 없음)
npm.cmd run validation:evidence:check → EXPECTED BLOCKED (8단계 없음)
npm.cmd run legal:evidence:check → EXPECTED BLOCKED (6단계 없음)
npm.cmd run clinical:handoff:check → EXPECTED BLOCKED (6단계 없음)
npm.cmd run release:ready        → EXPECTED BLOCKED (사람 증빙 미완료)
```

### Phase 6 — Evolve

- 저장소·CI·자동 검증은 최신이다. 남은 것은 실제 수동 접근성·기기, 독립 A/B/C, 법무·임상 운영, 한국어 타당화, 배포 후보 TLS/PWA 확인이다.
- 다음 최고 영향 작업은 Phase 3 수동 접근성·실기기 시험이다.

◆ remaining-work-bulk-executed (Path C) → next: Phase 3 수동 접근성·실기기 증빙 착수

## Cycle 57 — Phase 0~6 (2026-11-09): 공식 포털 연결 실패 E2E

### Phase 0 — Inventory

- 지역 센터 공식 포털의 연결 실패 안내(AC43)는 정적 검사만 있고, 실제 브라우저에서 실패 UI가 표시되는지 검증하지 않았다.
- `openUrl`은 `window.open` 예외를 `false`로 흡수하고 `openExternal`이 실패 안내를 렌더링한다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서 **공식 포털 연결 실패 E2E 1건**을 구현 대상으로 확정했다.
- 비목표: 실제 포털 장애 재현, 외부 네트워크 의존.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 연결 실패를 성공으로 오인시키면 안 됨 | 실패 안내 표시 |
| B(위기·자살예방) | 포털 실패 시 직접 주소 안내 필요 | `mentalhealth.go.kr` 안내 |
| C(구현·프라이버시) | `window.open` 예외를 실패로 처리 | 예외 주입·pageerror 0 |

### Phase 3 — Seed

- AC162 추가: 공식 포털 연결 실패 안내.

### Phase 4 — Implement

- `e2e/safety-flow.spec.js`: `window.open` 예외 주입 → 서울특별시 선택 → 포털 검색 클릭 → 실패 안내·직접 주소 확인.
- 이번 사이클은 첫 실행에서 40/40 통과했으며 제품 코드 수정은 없었다.

### Phase 5 — Evaluate

```text
npm.cmd run test:e2e              → PASS (40/40 Chromium)
npm.cmd test                      → 90/90 PASS
npm.cmd run validate              → PASS
npm.cmd run a11y                  → PASS
npm.cmd run skill:check           → PASS
npm.cmd run security:build:check  → PASS
npm.cmd run manual:check          → EXPECTED BLOCKED (실제 수동 기록 없음)
npm.cmd run release:ready         → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 공식 포털 연결 실패 안내는 브라우저 회귀 검사로 고정됐다.
- 다음은 Cycle 57 후속 커밋·푸시와 실제 Phase 3 수동 접근성·실기기 시험이다.

◆ center-portal-failure-e2e-complete (Path C) → next: Cycle 57 후속 커밋·푸시 또는 실제 Phase 3 수동 시험

## Cycle 58 — Phase 0~6 (2026-11-09): 배포 후보 검증 패킷 CLI

### Phase 0 — Inventory

- Phase 6 배포 후보 검증은 실제 TLS/Nginx·PWA 기기 확인이 남아 있지만, 실행자가 자동 게이트·헤더·PWA·롤백 항목을 한 번에 확인할 패킷이 없었다.
- `manual:packet`·`abc:packet`과 같은 준비 패킷이 필요했다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서 **배포 후보 검증 패킷 CLI**를 구현 대상으로 확정했다.
- 비목표: 실제 배포·TLS 변경, 실제 기기 시험, 배포 승인 생성.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 배포 검증은 앱 동작을 바꾸지 않음 | 문항·점수 불변 |
| B(위기·자살예방) | 배포 실패·TLS/CSP 오류가 위기 안내를 막을 수 있음 | TLS/CSP/PWA/롤백 항목 |
| C(구현·프라이버시) | 자동 게이트·범위 해시·비승인 고지 필요 | 현재 해시 출력, 증빙 아님 고지 |

### Phase 3 — Seed

- AC163~AC165 추가: 배포 패킷, 필수 항목, 비승인·차단 유지.

### Phase 4 — Implement

- `lib/deployment-verification-packet.js`: 자동 게이트·GitHub Actions·TLS/헤더·PWA/기기·롤백 섹션과 비승인 고지 생성.
- `bin/print-deployment-verification-packet.js`, `npm run deploy:packet` 추가.
- `tests/deployment-packet.test.js`: 섹션·TLS/CSP/PWA/롤백/비승인 고지, 해시 누락 거부 2건.
- `docs/operations/atomic-static-deployment.md`: 패킷 용도와 한계 기록.
- 이번 사이클은 test 92/92, 제품 코드 수정 없음.

### Phase 5 — Evaluate

```text
npm.cmd run deploy:packet        → PASS (범위 해시 350cfc4f, 5개 섹션)
npm.cmd test                     → 92/92 PASS
npm.cmd run test:e2e             → 40/40 PASS
npm.cmd run a11y                 → PASS
npm.cmd run skill:check          → PASS
npm.cmd run manual:check         → EXPECTED BLOCKED (실제 수동 기록 없음)
npm.cmd run release:ready        → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- Phase 6 실행자는 `deploy:packet`으로 자동 게이트·헤더·PWA·롤백 항목을 확인할 수 있다. 실제 결과 기록 전까지 배포 승인은 없다.
- 다음은 Cycle 57~58 후속 커밋·푸시와 실제 Phase 3 수동 접근성·실기기 시험이다.

◆ deployment-verification-packet-ready (Path C) → next: Cycle 57~58 후속 커밋·푸시 또는 실제 Phase 3 수동 시험

## Cycle 59 — Phase 0~6 (2026-11-09): 남은 사이클 일괄 배치

### Phase 0 — Inventory

- Cycle 57~58 변경(배포 패킷·포털 실패 E2E)이 미커밋 상태였고 원격 HEAD는 `e21f6a0`이었다.
- 사람 증빙 게이트는 모두 BLOCKED였고, 현재 범위 해시는 `350cfc4f`였다.

### Phase 1 — Interview

- 사용자가 “남은 사이클을 한번에” 처리할 수 있는지 요청했다.
- 결정: **실행 가능한 배치(커밋·푸시·CI·패킷·검증 기록)는 한 번에 수행**하고, 실제 사람·기관 증빙은 수행하지 않는다. 증빙을 자동 생성하지 않는다.

### Phase 2 — A/B/C Cross-validation

| 대상 | A(임상) | B(위기) | C(구현·프라이버시) | 결정 |
|---|---|---|---|---|
| Cycle 57~58 푸시 | 안전 회귀 40건 포함 | 포털 실패 안내 포함 | 비밀·로컬 도구 제외 | 실행 |
| 패킷 3종 | 비승인 고지 | 위기·오프라인 항목 포함 | 현재 해시 출력 | 실행 |
| Phase 3 수동 | 자동 대체 불가 | 실기기 필요 | 증빙 없음 | 차단 유지 |
| Phase 2 독립 검토 | 외부 검토 필요 | 역할별 승인 | 모델 검토는 승인 아님 | 차단 유지 |
| Phase 4·5·1 | 연구·법무·기관 | 운영 책임 | 코드 대체 불가 | 차단 유지 |
| Phase 6 실기기/TLS | — | 실기기 필요 | 로컬 CI 불가 | 차단 유지 |

### Phase 3 — Seed

- AC166~AC168 추가: 푸시·CI, 패킷 해시, 사람 증빙 차단 유지.

### Phase 4 — Implement

- Cycle 57~58 변경을 `c17b074`로 커밋·푸시.
- GitHub Actions Browser safety·Linux deployment harness PASS 확인.
- `manual:packet`·`abc:packet`·`deploy:packet`이 범위 `SCREENING-CONNECTION-STATIC-WEB`, 해시 `350cfc4f`와 비승인 고지를 유지함을 확인.
- 모든 evidence check를 배치 실행해 차단 사유를 확인했다. 실제 증빙은 기록하지 않았다.

### Phase 5 — Evaluate

```text
git push c17b074                 → PASS
GitHub Actions Browser safety    → PASS
GitHub Actions Linux harness     → PASS
npm.cmd test                     → 92/92 PASS
npm.cmd run test:e2e             → 40/40 PASS
범위 해시                         → 350cfc4f
manual:packet / abc:packet / deploy:packet → PASS (비승인 고지 유지)
manual:check / abc:evidence:check / validation / legal / clinical → EXPECTED BLOCKED
release:ready                    → EXPECTED BLOCKED
```

### Phase 6 — Evolve

- 자동화 가능한 남은 사이클은 이 배치로 소진됐다.
- 실제 사람·기관 증빙(Phase 1·2·3·4·5)과 실기기/TLS(Phase 6)는 코드·CI로 대체할 수 없다. 이들을 “한 번에” 통과 처리하면 증빙 조작이 되므로 금지한다.
- 다음은 실제 Phase 3 수동 접근성·실기기 시험이다.

◆ remaining-cycles-batched (Path C) → next: Phase 3 수동 접근성·실기기 증빙 착수

## Cycle 60 — Phase 0~6 (2026-11-09): 저장소 차단 자원·위기 E2E

### Phase 0 — Inventory

- `localStorage` 차단 시 결과·기록 화면은 E2E로 검증했지만, 자원 화면의 메모 입력 비활성화와 위기 화면 자원 유지는 브라우저 검사가 없었다.
- 저장소 장애가 자원·위기 안내를 가리면 안 된다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서 **저장소 차단 자원·위기 E2E 1건**을 구현 대상으로 확정했다.
- 비목표: 저장 기능 확대, 서버 전송.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 저장 장애는 선별 결과와 무관 | 자원 화면만 확인 |
| B(위기·자살예방) | 위기 화면 자원·109 안내 유지 | `/crisis` 렌더·109 확인 |
| C(구현·프라이버시) | 저장 불가 시 메모 입력 비노출 | 입력 부재·안내 확인 |

### Phase 3 — Seed

- AC169 추가: 저장소 차단 자원·위기 렌더.

### Phase 4 — Implement

- `e2e/safety-flow.spec.js`: localStorage getter 차단 → `/resources` 저장 불가 안내·입력 부재·자원 heading 확인 → `/crisis` heading·109 CTA 확인.
- 이번 사이클은 첫 실행에서 41/41 통과했으며 제품 코드 수정은 없었다.

### Phase 5 — Evaluate

```text
npm.cmd run test:e2e              → PASS (41/41 Chromium)
npm.cmd test                      → 92/92 PASS
npm.cmd run validate              → PASS
npm.cmd run a11y                  → PASS
npm.cmd run skill:check           → PASS
npm.cmd run security:build:check  → PASS
npm.cmd run manual:check          → EXPECTED BLOCKED (실제 수동 기록 없음)
npm.cmd run release:ready         → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 저장소 장애 시 자원·위기 안내 유지가 브라우저 회귀 검사로 고정됐다.
- 자동화 가능한 안전 회귀는 사실상 소진됐다. 다음은 실제 Phase 3 수동 접근성·실기기 시험이다.

◆ storage-blocked-resources-crisis-e2e-complete (Path C) → next: 실제 Phase 3 수동 접근성·실기기 증빙 착수

## Cycle 61 — Phase 0~6 (2026-11-09): 페이즈 상태 요약 CLI

### Phase 0 — Inventory

- 자동 안전 회귀는 41건으로 소진됐고, 남은 병목은 사람 증빙이었다.
- `release:ready`는 상세 차단 사유를 길게 출력하지만, Phase 0~6 상태와 확인 명령을 한눈에 보여주는 도구가 없었다.

### Phase 1 — Interview

- 사용자가 권장안 선택을 위임한 범위에서 **읽기 전용 페이즈 상태 요약 CLI**를 구현 대상으로 확정했다.
- 비목표: 증빙 생성, PASS 판정 자동화, `release:ready` 차단 해제.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 상태 요약은 검증을 대체하지 않음 | 비승인 고지 |
| B(위기·자살예방) | 수동 접근성·임상 운영 차단을 숨기지 않음 | BLOCKED·차단 수 표시 |
| C(구현·프라이버시) | 기존 검증기만 재사용, 쓰기 없음 | 읽기 전용 CLI |

### Phase 3 — Seed

- AC170~AC171 추가: 페이즈 상태 요약, 비승인·차단 유지.

### Phase 4 — Implement

- `lib/phase-status.js`: 기존 manual/ABC/validation/legal/clinical 검증기를 재사용해 Phase 0~6 상태·차단 수·명령 생성.
- `bin/print-phase-status.js`, `npm run phase:status` 추가.
- `tests/phase-status.test.js`: Phase 0~6·범위 해시·확인 명령·비승인 고지, 사람 증빙 페이즈 BLOCKED 회귀 2건.
- 이번 사이클은 test 94/94, 제품 코드 수정 없음.

### Phase 5 — Evaluate

```text
npm.cmd run phase:status         → PASS (Phase 0~6, 범위 해시 e75db4a3)
npm.cmd test                     → 94/94 PASS
npm.cmd run test:e2e             → 41/41 PASS
npm.cmd run a11y                 → PASS
npm.cmd run skill:check          → PASS
npm.cmd run release:ready        → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

### Phase 6 — Evolve

- 이제 남은 페이즈 상태를 `phase:status`로 한 번에 확인할 수 있다. 실제 증빙 전까지 Phase 1~5는 BLOCKED다.
- 자동화 가능한 구현은 이 CLI로 마무리한다. 다음은 실제 Phase 3 수동 접근성·실기기 시험이다.

◆ phase-status-cli-ready (Path C) → next: Cycle 60~61 후속 커밋·푸시 후 실제 Phase 3 수동 시험

## Cycle 62 — Phase 0~6 (2026-11-09): Phase 3 자동 reflow 보강

### Phase 0 — Inventory

- Phase 3은 `manual:check`에서 8건 차단 상태였고, NVDA·VoiceOver·TalkBack·실제 전화 앱·설치 PWA는 이 환경에 없었다.
- 자동 프록시는 320px·오프라인 PWA·skip link까지 있었지만 200% 확대 상당 reflow 검사는 없었다.

### Phase 1 — Interview

- 사용자가 Phase 3 일괄 진행을 지시했다.
- 결정: **자동 reflow 프록시는 구현**하고, 실제 수동 PASS 기록은 만들지 않는다. Phase 3은 자동으로 완료 처리하지 않는다.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 자동 reflow는 수동 확대 검증을 대체하지 않음 | 자동 프록시로만 기록 |
| B(위기·자살예방) | 200% 확대에서도 위기 CTA가 잘리면 안 됨 | 640×512에서 CTA 배치 확인 |
| C(구현·프라이버시) | 읽기 전용 레이아웃 검사·기기 접근 없음 | Playwright viewport만 변경 |

### Phase 3 — Seed

- AC172~AC173 추가: 200% 상당 reflow, 수동 증빙 차단 유지.

### Phase 4 — Implement

- `e2e/zoom.spec.js`: 640×512 viewport에서 인트로·위기·자원·센터·결과 가드의 무가로스크롤·CTA 배치 검사 5건.
- `manual:packet`을 현재 범위 해시 `e75db4a3`로 재생성.
- `manual:check` 차단 사유를 재확인했으며 PASS 기록은 추가하지 않았다.

### Phase 5 — Evaluate

```text
npm.cmd run test:e2e             → PASS (46/46 Chromium)
npm.cmd test                     → 94/94 PASS
npm.cmd run a11y                 → PASS
npm.cmd run skill:check          → PASS
npm.cmd run security:build:check → PASS
npm.cmd run manual:packet        → PASS (범위 해시 e75db4a3)
npm.cmd run manual:check         → EXPECTED BLOCKED (8건, 실제 수동 기록 없음)
npm.cmd run phase:status         → Phase 3 BLOCKED
npm.cmd run release:ready        → EXPECTED BLOCKED
```

### Phase 6 — Evolve

- Phase 3의 자동 프록시는 보강됐지만 실제 사람 증빙은 여전히 필요하다.
- 남은 Phase 3 수동 항목: NVDA, VoiceOver, TalkBack, VIEWPORT-320, ZOOM-200, PHONE-APP, OFFLINE-CRISIS의 실제 수행 기록.
- 자동 reflow PASS를 수동 PASS로 기록하면 증빙 조작이므로 금지한다.

◆ phase3-automated-reflow-proxy-complete (Path C) → next: Cycle 60~62 후속 커밋·푸시 후 실제 Phase 3 수동 시험

## Cycle 63 — Phase 0~6 (2026-11-09): 배포 후보 스모크 검사 CLI

### Phase 0 — Inventory

- Phase 3 실제 수동 증빙은 이 환경에서 수행할 수 없고, Phase 6은 실제 배포 URL의 헤더·PWA·오프라인 응답을 확인할 도구가 없었다.
- 기존 `deploy:packet`은 체크리스트만 출력하고 실제 URL 응답을 검사하지 않았다.

### Phase 1 — Interview

- 사용자가 “아까 같은 방식”으로 다음 구현을 진행하도록 지시했다.
- 결정: **실제 배포 URL을 읽기 전용으로 검사하는 `deploy:smoke` CLI**를 구현한다. 검사 결과는 증빙·승인이 아니다.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 배포 검사는 앱 로직을 바꾸지 않음 | 읽기 전용 HTTP 검사 |
| B(위기·자살예방) | TLS/CSP/오프라인 위기 안내가 실제 응답에서 유지돼야 함 | offline.html·109/119·헤더 검사 |
| C(구현·프라이버시) | 응답 본문만 검사, 사용자 데이터 전송 없음 | GET 검사·비승인 고지 |

### Phase 3 — Seed

- AC174~AC176 추가: 스모크 검사, 비승인 고지, 차단 유지.

### Phase 4 — Implement

- `lib/deployed-site-check.js`: URL/HTTPS, 루트 헤더·CSP·앱 번들, manifest, SW, offline, `/crisis` 검사와 fake-fetch 테스트 가능한 순수 검증 함수.
- `bin/check-deployed-site.js`, `npm run deploy:smoke` 추가. URL 없으면 사용법·종료 코드 2.
- `tests/deployed-site-check.test.js`: HTTPS/헤더/매니페스트/SW/오프라인/정상·실패 스모크 4건.
- 이번 사이클은 test 98/98, 제품 코드 수정 없음.

### Phase 5 — Evaluate

```text
npm.cmd test                     → 98/98 PASS
npm.cmd run test:e2e             → 46/46 PASS
npm.cmd run deploy:smoke         → 사용법 출력(URL 없음, exit 2)
npm.cmd run a11y                 → PASS
npm.cmd run skill:check          → PASS
npm.cmd run manual:check         → EXPECTED BLOCKED
npm.cmd run release:ready        → EXPECTED BLOCKED
```

### Phase 6 — Evolve

- 실제 배포 후보 URL이 준비되면 `npm.cmd run deploy:smoke -- https://<후보>`로 헤더·PWA·오프라인 응답을 1차 확인할 수 있다.
- 이 검사는 실제 기기 PWA·기존 탭 갱신·법무/임상 승인을 대체하지 않는다.

◆ deployed-site-smoke-check-ready (Path C) → next: 실제 배포 후보 URL에서 deploy:smoke 실행 또는 실제 Phase 3 수동 시험

## Cycle 64 — Phase 0~6 (2026-11-09): 배포 스모크 검사 강화

### Phase 0 — Inventory

- `deploy:smoke`는 본문·헤더 일부만 검사하고, 응답 HTTP 상태·Content-Type, 매니페스트 아이콘 실제 파일, CSP hydration 해시 일치를 확인하지 않았다.
- CSP 해시 불일치는 실제 배포에서 앱 초기화와 위기 화면을 막을 수 있다.

### Phase 1 — Interview

- 사용자가 “방금 같은 방식”으로 다음 구현을 진행하도록 지시했다.
- 결정: **배포 스모크 검사를 상태·Content-Type·아이콘 실파일·CSP 해시까지 강화**한다. 실제 승인은 아니다.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 배포 검사는 앱 로직을 바꾸지 않음 | 읽기 전용 |
| B(위기·자살예방) | 잘못된 CSP 해시는 위기 화면 초기화를 막음 | inline SHA-256 대조 |
| C(구현·프라이버시) | 아이콘·상태·Content-Type 실제 검증 | GET 검사, 저장 없음 |

### Phase 3 — Seed

- AC177~AC179 추가: 상태·Content-Type, 아이콘 실파일, CSP 해시.

### Phase 4 — Implement

- `lib/deployed-site-check.js`: 10초 timeout, `responseFailures`로 HTTP 상태·Content-Type 검사, manifest 아이콘 URL 실제 요청, inline script SHA-256과 CSP 대조, `script-src 'unsafe-inline'` 금지.
- `tests/deployed-site-check.test.js`: inline 해시 fixture, 아이콘 404 실패, 잘못된 hydration 해시 회귀.
- 이번 사이클은 test 98/98, 제품 코드 수정 없음.

### Phase 5 — Evaluate

```text
npm.cmd test                     → 98/98 PASS
npm.cmd run test:e2e             → 46/46 PASS
npm.cmd run a11y                 → PASS
npm.cmd run skill:check          → PASS
npm.cmd run security:build:check → PASS
npm.cmd run manual:check         → EXPECTED BLOCKED
npm.cmd run release:ready        → EXPECTED BLOCKED
```

### Phase 6 — Evolve

- 실제 후보 URL에서 `deploy:smoke`가 상태·헤더·아이콘·CSP 해시까지 1차 검증할 수 있다.
- 실제 기기 PWA·기존 탭 갱신·법무/임상 승인은 여전히 사람 증빙이다.

◆ deployed-site-smoke-hardened (Path C) → next: 실제 배포 후보 URL에서 deploy:smoke 실행 또는 실제 Phase 3 수동 시험

## Cycle 65 — Phase 0~6 (2026-11-09): PWA 특수 경로 보안 헤더 상속 검사

### Phase 0 — Inventory

- `deploy:smoke`는 보안 헤더를 루트 HTML에서만 검사했다.
- 과거 PWA 특수 파일 location의 `add_header`가 상위 CSP·X-Frame-Options 상속을 끊은 사례가 있어, 실제 응답에서 특수 경로 헤더를 확인할 필요가 있었다.

### Phase 1 — Interview

- 사용자가 “전 구현 방식”으로 다음 구현을 진행하도록 지시했다.
- 결정: **manifest·SW·offline·crisis의 보안 헤더 상속을 스모크 검사에 추가**한다. 실제 승인은 아니다.

### Phase 2 — A/B/C Cross-validation

| 관점 | 판단 | 반영 |
|---|---|---|
| A(임상·심리측정) | 배포 검사는 앱 로직을 바꾸지 않음 | 읽기 전용 |
| B(위기·자살예방) | `/crisis`·offline 헤더 누락은 보호 약화 | 특수 경로 헤더 검사 |
| C(구현·프라이버시) | Nginx location 상속 회귀 탐지 | CSP·XFO·nosniff·Referrer·Permissions |

### Phase 3 — Seed

- AC180~AC181 추가: 특수 경로 보안 헤더, 회귀 테스트.

### Phase 4 — Implement

- `lib/deployed-site-check.js`: `validateSecurityHeaders`를 분리하고 manifest/SW/offline/crisis 응답에 적용.
- `tests/deployed-site-check.test.js`: 특수 경로 헤더 누락 FAIL 회귀 추가.
- 이번 사이클은 test 99/99, 제품 코드 수정 없음.

### Phase 5 — Evaluate

```text
npm.cmd test                     → 99/99 PASS
npm.cmd run test:e2e             → 46/46 PASS
npm.cmd run a11y                 → PASS
npm.cmd run skill:check          → PASS
npm.cmd run security:build:check → PASS
npm.cmd run manual:check         → EXPECTED BLOCKED
npm.cmd run release:ready        → EXPECTED BLOCKED
```

### Phase 6 — Evolve

- 실제 후보 URL에서 특수 경로 헤더 상속까지 검사할 수 있다.
- 실제 기기 PWA·기존 탭 갱신·법무/임상 승인은 여전히 사람 증빙이다.

◆ deployed-site-special-path-headers-checked (Path C) → next: 실제 배포 후보 URL에서 deploy:smoke 실행 또는 실제 Phase 3 수동 시험
