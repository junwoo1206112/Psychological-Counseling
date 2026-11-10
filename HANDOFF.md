# HANDOFF — 마음 체크 (Psychological-Counseling)

> 최종 갱신: 2026-11-09
> 대상: 이 프로젝트를 이어받는 사람 또는 다른 LLM
> 목적: 현재 상태, Ouroboros 인터뷰 스킬 적용 방법, 페이즈 기록, 검증 명령, 남은 작업을 한 곳에 정리합니다.

---

## 0. 가장 먼저 읽을 것

**2026-11-07 마감 전 우선 안내:** [최종 A/B/C·UI·배포 검토](docs/research/final-release-review-2026-11-07.md)를 먼저 확인하세요. 희소 응답/잘못된 연령, 모순된 결과 세션, 도움 우선 이동, ASQ Q5 뒤로 가기, PWA 특수 파일 보안 헤더 상속 문제는 보완하고 자동 검증을 통과했습니다. 다만 이는 코드 후보의 조건부 통과일 뿐이며, 한국어 타당화·독립 A/B/C·수동 접근성/실기기·법무·임상 운영 증빙이 없어 공개/임상/상업 배포는 여전히 차단됩니다.

다른 LLM/사람이 이 프로젝트를 이어받으면 아래 순서로 읽으세요.

1. `HANDOFF.md` (이 문서)
2. `AGENTS.md` — 프로젝트 규칙과 배포 전 체크리스트
3. `README.md` — 사용자 관점 설명과 실행 방법
4. `docs/research/final-release-review-2026-11-07.md`
5. `docs/research/expert-a-clinical-screening.md`
5. `docs/research/expert-b-suicide-prevention-safety.md`
6. `docs/research/expert-c-open-source-implementation.md`
7. `docs/research/cross-validation-and-recommendation.md`
8. `docs/ouroboros/seed.md` — 현재 수용 기준(AC1~AC15)
9. `docs/ouroboros/phase-log.md` — Phase 0~6 실행 기록
10. `docs/validation/korean-instrument-validation-plan.md` — 한국어 타당화 계획
11. `app/`, `data/`, `lib/`, `public/`, `deploy/`

---

## 1. 프로젝트 정체성

- 이름: 마음 체크 (`depression-check`)
- 목적: 우울·자살 위험을 **조기에 선별하고 전문가에게 연결**
- 아닌 것: 진단, 치료, AI 심리상담 챗봇, 자동 구조 요청
- 핵심 흐름:
  ```
  인트로(동의·연령) → 현재 안전 확인 4문항
    ├ 급성 위험 → /crisis (즉시, 결과 차단)
    └ 그 외 → PHQ-9/PHQ-A → 기능손상(비채점) → GAD-7 → ASQ
                ├ ASQ Q5 양성 → /crisis
                └ 그 외 → /result → 저장(opt-in) → /history
  ```
- 사용 도구: PHQ-9, PHQ-A(청소년), GAD-7, ASQ(NIMH)
- 기술: Expo 58 / React Native 0.88 / React 19.3 / Expo Router 58 / 정적 웹(`web.output: "static"`)
- 배포: `dist/` 정적 파일, Nginx(Contabo), PWA + service worker + offline.html

### 절대 지켜야 할 것

- 검증된 문항만 사용. 임의 문항·가중치·복합 점수·ML 예측 금지.
- 급성 위험은 결과보다 `/crisis` 우선.
- “진단”, “DSM-5 충족”, “자살 위험 87%”, “likely MDD” 금지.
- 서버 저장·분석 SDK·응답 로그·PII 수집 금지.
- 한국어 문항은 **이해 보조 번역**이며, 현재 채점은 **영문 원문 기준**.
- `translationStatus`가 `validated-ko`가 되기 전에는 임상·상업 사용 금지.
- 프로젝트를 전면 삭제·재작성하지 말 것. 필요하면 브랜치/백업 후 명시적 승인.

---

## 2. 현재 상태 요약

### 완료됨

- 50문항·임의 가중치·pseudo-DSM 제거, 검증 도구 기반으로 전환.
- 안전 우선 라우팅, ASQ Q5 급성 시 결과 차단.
- 청소년(14~17세) PHQ-A 모드.
- 비채점 기능손상 문항, `very/extreme` → urgent triage.
- 한국어/영문 문항 토글, 번역 고지.
- opt-in localStorage 기록/추이, 개별/전체 삭제.
- PWA manifest, service worker, offline 위기 안내.
- WCAG 2.2 AA 자동 감사, 색상 대비, skip link, heading, radio, live region.
- 법무 체크리스트, 상업화 게이트, 식약처 권고 문구.
- LICENSE를 프로젝트 MIT로 교체, `THIRD_PARTY_NOTICES.md` 추가.
- Nginx 정적 라우트/보안 헤더/no-cache 보강, `public/robots.txt` 민감 경로 차단.
- 문항 버전·`contentHash`·번역 상태(`unofficial`/`official-nimh`) 기록.
- Ouroboros interview 스킬 프로젝트 적용 + Path C(로컬 A/B/C) 추가.
- `docs/validation/korean-instrument-validation-plan.md` 작성.
- 결과 전달을 URL 쿼리에서 **세션 요약(점수·위험만)** 으로 전환(원본 응답 URL 노출 제거).
- `/result` 직접 접근·만료 시 **“결과를 불러올 수 없습니다” 가드** 추가(거짓 낮은 위험 방지).
- PWA **192·512·maskable 아이콘 + apple-touch-icon** 생성, manifest/+html 경로 수정.
- 지역 센터 검색을 **실제 동작하는 공식 포털 위치기반 검색(Tab2 + sc3)** 으로 수정.
- `tests/release.test.js` 및 a11y 감사에 릴리스 회귀 검사 추가.
- **안전 계획 개인 메모(선택)**: 6단계별 메모 작성·기기 내 저장·전체 삭제, 위기 화면에서 저장 메모 재확인, 결과 화면에서 작성 링크.
- `node --test` 실행 범위를 `tests/**/*.test.js`로 한정(프로젝트 내 `ouroboros/` 체크아웃의 테스트 파일 수집 방지).
- **위험 신호 메모 노출**: urgent·ASQ 양성·PHQ-9 문항9 응답 시 결과 화면에 저장된 안전 계획 메모 즉시 노출(없으면 작성 안내).
- **접근성 마무리**: 추이 차트 행별 접근성 라벨, 지역 그리드 360px 미만 2열, SW 아이콘 프리캐시(v2).
- **배포 후보 E2E 게이트·TLS 보호** (2026-11-07, Cycle 34): `deploy-contabo.sh`가 `build:web` 뒤 Playwright chromium 설치(root `--with-deps` 분기)와 `test:e2e`를 게이트로 실행. `setup-contabo.sh`는 기존 Nginx(certbot TLS) 구성을 자동 덮어쓰지 않고 `FORCE_CONF_OVERWRITE=1` 명시 시에만 백업 후 교체. E2E 실패 시 라이브 보존을 하니스 `e2e-fail` 시나리오로 고정.
- **Expo 58 업그레이드** (2026-11-09, Cycle 35): Expo 58.0.23·RN 0.88.1·React 19.3·Router 58.0.30으로 정렬. SDK 58 정적 렌더링 계약에 맞춰 `app/+html.js`가 `useServerDocumentContext()`의 `headNodes`/`bodyNodes`를 렌더하도록 수정(누락 시 앱 번들이 HTML에서 빠져 클릭이 동작하지 않음). `security:build:check`가 앱 JS 번들 누락을 차단. production 감사는 critical 1·high 16 → **critical/high 0**, moderate 5(Expo CLI 전이)로 감소.
- **정상 완료·저장 경계 E2E** (2026-11-09, Cycle 37): E2E 3건 추가로 **12/12**. 정상 완료 결과 화면, `sessionStorage` 요약 최소화(원본 응답 없음), 결과 저장 opt-in·최소 필드·전체 삭제를 검증. 전체 삭제 후 목록이 비면 성공 안내가 사라지던 UI 결함을 수정.
- **청소년·저장소 차단 E2E** (2026-11-09, Cycle 39): E2E 3건 추가로 **15/15**. 만 14~17세 PHQ-A·1388 안내, `localStorage` 차단 시 결과·기록 안내 유지, `sessionStorage` 차단 시 메모리 fallback 동작을 검증.
- **저장·삭제 실패 E2E** (2026-11-09, Cycle 40): E2E 2건 추가로 **17/17**. `setItem` 예외 시 저장 실패 안내·기록 부재, 삭제 실패 안내·기존 기록 보존을 검증.
- **만 14세 미만 연령 게이트 E2E** (2026-11-09, Cycle 41): E2E 2건 추가로 **19/19**. 법정대리인·1388 안내, 시작 버튼 비활성, `/survey?ageGroup=child` 직접 진입 차단을 검증.
- **안전계획 메모 실패 E2E** (2026-11-09, Cycle 42): E2E 2건 추가로 **21/21**. 메모 저장 실패 시 저장 값·성공 문구 부재, 삭제 실패 시 기존 메모 보존을 검증.
- **청소년 재검사 ageGroup E2E** (2026-11-09, Cycle 43): E2E 1건 추가로 **22/22**. 청소년 결과의 “다시 검사하기”가 `ageGroup=youth`로 진입하고 안전 확인 후 PHQ-A로 복귀하는지 검증.
- **권장 순서 일괄 실행·CI 하네스 수정** (2026-11-09, Cycle 44): Cycle 37~43을 `702d106`으로 푸시. Linux harness의 `expect_failure`가 exit 42를 반환하던 버그를 `4ad7914`로 수정해 Browser safety·Linux harness CI 모두 통과. 사람 증빙 게이트는 계속 BLOCKED.
- **수동 검증 패킷 CLI** (2026-11-09, Cycle 45): `npm.cmd run manual:packet` 추가. 현재 범위 해시, 7개 시나리오 확인 항목·통과 기준, 비식별 기록 형식, “증빙 아님” 고지를 출력. 테스트 90/90.
- **320px 레이아웃·위기 hydration E2E** (2026-11-09, Cycle 46): 320px 6개 화면 무가로스크롤·위기 CTA 배치 검사로 E2E 28/28. 직접 `/crisis?reason=safety`의 React hydration #418을 마운트 후 reason 렌더로 수정.
- **안전계획 메모 위기 화면 E2E** (2026-11-09, Cycle 47): 저장한 메모가 `/crisis`에서 다시 표시되고, 전체 삭제 후 위기 화면에서도 사라지는지 검증(E2E 30/30).
- **위험 신호 결과 메모 E2E** (2026-11-09, Cycle 48): PHQ-9 문항 9=1 urgent 결과에서 저장 메모 즉시 노출, 메모 없음 시 작성 안내를 검증(E2E 32/32).
- **남은 페이즈 일괄 실행** (2026-11-09, Cycle 49): Cycle 45~48을 `afaa28f`로 푸시. Browser safety·Linux harness CI PASS, 범위 해시 `bbb427a5`. 사람 증빙 게이트는 계속 BLOCKED.
- **PHQ-9 한국어/영문 토글 E2E** (2026-11-09, Cycle 50): 한국어 문항·번역 고지 → 영문 원문 → 한국어 복귀를 검증(E2E 33/33).
- **추이 라벨·단건 삭제 E2E** (2026-11-09, Cycle 51): 차트 행 날짜·우울·불안 접근성 라벨, 단건 삭제 후 빈 상태·성공 안내·저장소 제거를 검증(E2E 35/35).
- **오프라인 PWA 위기 안내 E2E** (2026-11-09, Cycle 52): 서비스 워커 제어 후 오프라인 탐색이 `/offline.html` 위기 안내(109·119 링크)로 fallback 되는지 검증(E2E 36/36).
- **기능손상 urgent E2E** (2026-11-09, Cycle 53): PHQ-9·GAD-7 0점이어도 기능손상 “많이 어려웠다”가 urgent 결과로 안내되고 점수에는 미포함됨을 검증(E2E 37/37).
- **지역 센터 공식 포털 E2E** (2026-11-09, Cycle 54): 서울특별시 선택 후 공식 포털 위치기반 검색 URL(`PotalHealthFacListTab2.do`, `sc3=AFCS1...`)을 여는지 검증(E2E 38/38).
- **키보드 건너뛰기 링크 E2E** (2026-11-09, Cycle 55): Enter 키로 `#root` 포커스가 이동하는지 검증(E2E 39/39).
- **남은 작업 일괄 실행** (2026-11-09, Cycle 56): Cycle 50~55를 `8ffcb6c`로 푸시. Browser safety·Linux harness CI PASS, 범위 해시 `bbb427a5`. 사람 증빙 게이트는 계속 BLOCKED.
- **공식 포털 연결 실패 E2E** (2026-11-09, Cycle 57): `window.open` 예외 시 실패 안내·`mentalhealth.go.kr` 직접 주소를 표시하는지 검증(E2E 40/40).
- **배포 후보 검증 패킷 CLI** (2026-11-09, Cycle 58): `npm.cmd run deploy:packet` 추가. 범위 해시, 자동 게이트·CI·TLS/헤더·PWA/기기·롤백 항목, 비승인 고지 출력(테스트 92/92).
- **남은 사이클 일괄 배치** (2026-11-09, Cycle 59): Cycle 57~58을 `c17b074`로 푸시. Browser safety·Linux harness CI PASS, 범위 해시 `350cfc4f`, 패킷 3종 확인. 사람 증빙 게이트는 계속 BLOCKED.
- **저장소 차단 자원·위기 E2E** (2026-11-09, Cycle 60): localStorage 차단 시 자원 화면 메모 입력 비활성·위기 화면 109 CTA 유지를 검증(E2E 41/41).
- **페이즈 상태 요약 CLI** (2026-11-09, Cycle 61): `npm.cmd run phase:status` 추가. Phase 0~6 상태·차단 수·확인 명령·비승인 고지를 읽기 전용으로 출력(테스트 94/94).
- **Phase 3 자동 reflow 보강** (2026-11-09, Cycle 62): 640×512(200% 확대 상당)에서 인트로·위기·자원·센터·결과 가드 무가로스크롤·CTA 배치 검사 5건 추가(E2E 46/46). 수동 NVDA/VoiceOver/TalkBack/기기 증빙은 여전히 BLOCKED.
- **배포 후보 스모크 검사 CLI** (2026-11-09, Cycle 63): `npm.cmd run deploy:smoke -- https://<후보>` 추가. HTTPS·CSP·프레임 차단·캐시·앱 번들·manifest·SW·오프라인 위기·`/crisis`를 읽기 전용 검사(테스트 98/98).
- **배포 스모크 검사 강화** (2026-11-09, Cycle 64): 응답 HTTP 상태·Content-Type, 매니페스트 아이콘 실파일, CSP inline hydration SHA-256 일치, `script-src 'unsafe-inline'` 금지를 추가 검사.
- **PWA 특수 경로 보안 헤더 검사** (2026-11-09, Cycle 65): `deploy:smoke`가 manifest·SW·offline·crisis에도 CSP·XFO·nosniff·Referrer·Permissions 상속을 확인(테스트 99/99).

### 아직 안 된 것 / 배포 전 필요

- 실제 **한국어판 타당화 연구**(IRB, 번역 대조, 인지면담, 파일럿, 본조사, ROC/CFA).
- 실제 **NVDA / VoiceOver / TalkBack 수동 테스트**(안전 계획 메모 입력 포함), 320px·200% 확대 점검.
- 상업·의료기관 연계 시 법무/식약처 검토.

### Git 상태

- 2026-11-09 Cycle 50~55 변경을 `8ffcb6c`로 `master`에 푸시했습니다. 이전 기록 커밋은 `702d106`, `4ad7914`, `f8782fa`, `afaa28f`, `4a63c32`입니다.
- Browser safety·Linux deployment harness GitHub Actions가 현재 모두 통과합니다.
- Cycle 56 실행 기록은 `docs/ouroboros/phase-log.md`에 있습니다.
- 2026-11-09 Cycle 57~58 변경을 `c17b074`로 `master`에 푸시했습니다. 이전 기록 커밋은 `702d106`, `4ad7914`, `f8782fa`, `afaa28f`, `4a63c32`, `8ffcb6c`, `e21f6a0`입니다.
- Browser safety·Linux deployment harness GitHub Actions가 현재 모두 통과합니다.
- Cycle 59 실행 기록은 `docs/ouroboros/phase-log.md`에 있습니다.
- **Cycle 65 변경(PWA 특수 경로 보안 헤더 검사)은 작업 트리에 있으며 아직 커밋 전입니다.**
- 과거 커밋에는 50문항 버전이 남아 있습니다. 최신 커밋과 작업 트리가 현재 앱입니다.
- `ouroboros/`, `Codex_AI_스킬/`, `.claude/`, `dist/`, `test-results/`, `node_modules/`는 저장소에 포함하지 않습니다.

---

## 3. Ouroboros 인터뷰 스킬 적용 방법

### 3.1 무엇을 적용했나

- 업스트림: `https://github.com/Q00/ouroboros`의 `skills/interview`
- 프로젝트 로컬 스킬: `.opencode/skills/ouroboros-interview/SKILL.md`
- 참조:
  - `.opencode/skills/ouroboros-interview/references/socratic-interviewer.md`
  - `.opencode/skills/ouroboros-interview/references/seed-closer.md`
- 프로젝트 명령: `.opencode/command/ouroboros-interview.md`
- 프로젝트 설정: `opencode.json`
- 전역 설정(현재 PC): `%USERPROFILE%\.config\opencode\opencode.jsonc`
- 실행 도우미: `start-opencode.cmd`

### 3.2 왜 전역 설정도 필요한가

opencode는 **시작한 폴더 기준**으로 프로젝트 설정을 찾습니다.

- 프로젝트 폴더에서 실행 → 프로젝트 `opencode.json` 로드
- 상위 작업 폴더에서 실행 → 프로젝트 설정 로드 안 됨

그래서 상위 폴더에서도 인식되도록 전역 설정에 이 프로젝트의 스킬 경로와 명령을 등록했습니다.

### 3.3 프로젝트 `opencode.json`

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["AGENTS.md"],
  "skills": {
    "paths": [".opencode/skills"]
  }
}
```

### 3.4 전역 설정 예시 (다른 PC에서 재현할 때)

`%USERPROFILE%\.config\opencode\opencode.jsonc`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "skills": {
    "paths": ["<PROJECT_ROOT>/.opencode/skills"]
  },
  "command": {
    "ouroboros-interview": {
      "description": "Ouroboros A/B/C interview for Psychological-Counseling (phase-by-phase)",
      "template": "Project root: <PROJECT_ROOT>\n\nLoad the ouroboros-interview skill and follow Path C. ..."
    }
  }
}
```

> 다른 PC/경로라면 `<PROJECT_ROOT>`를 실제 절대 경로로 바꾸세요. 가능하면 프로젝트 폴더에서 `start-opencode.cmd`로 실행하는 것이 가장 안전합니다.

### 3.5 스킬의 동작 모드

- **Path A (MCP)**: `ouroboros_interview` MCP 도구 사용. 현재 미설치.
- **Path B (Fallback)**: MCP 없이 Socratic 인터뷰.
- **Path C (Local A/B/C)**: 이 프로젝트 기본. 로컬 연구 문서 + 웹 + 코드로 교차검증.

Path C는 `docs/research/`의 A/B/C 브리프를 입력으로 사용하고, 아래 페이즈를 순서대로 진행합니다.

1. Phase 0 — Inventory
2. Phase 1 — Interview
3. Phase 2 — A/B/C Cross-validation
4. Phase 3 — Seed (`docs/ouroboros/seed.md`)
5. Phase 4 — Implement
6. Phase 5 — Evaluate
7. Phase 6 — Evolve

### 3.6 사용 방법

opencode 재시작 후:

```text
/ouroboros-interview 마음 체크 다음 개선
```

또는 채팅에서:

```text
ouroboros-interview 스킬로 A/B/C 교차검증해서 페이즈별로 진행해줘
```

확인 명령:

```powershell
opencode.cmd debug skill      # ouroboros-interview가 보여야 함
opencode.cmd debug config     # skills.paths와 command 확인
npm.cmd run skill:check       # 프로젝트 스킬/Seed/Phase 기록 검사
```

### 3.7 문제 해결

| 증상 | 원인 | 해결 |
|---|---|---|
| 스킬이 안 보임 | 상위 폴더에서 실행 | 프로젝트 폴더에서 `start-opencode.cmd` 실행 또는 전역 설정의 `skills.paths` 확인 |
| `opencode` 실행이 막힘 | PowerShell 실행 정책 | `opencode.cmd` 사용 |
| 명령이 안 보임 | 재시작 안 함 | opencode 완전 종료 후 재시작 |
| 경로 오류 | 프로젝트 루트 미판별 | 스킬의 “Project root resolution” 규칙 확인: `package.json`의 `depression-check` 또는 `Psychological-Counseling/` 탐색 |
| 스킬 내용이 깨져 보임 | PowerShell 콘솔 인코딩 | `opencode.cmd debug skill` 또는 `read` 도구로 UTF-8 확인. 실제 파일은 UTF-8 |

---

## 4. A/B/C 교차검증 핵심 결정

| 결정 | A(임상) | B(위기) | C(구현) | 최종 |
|---|---|---|---|---|
| 문항 직접 생성 | 반대 | 위험 문항 임의 변경 반대 | 해시로 동결 | **직접 생성 금지** |
| 한국어 문항 | 타당화 필요 | 이해도 중요 | public domain 번역 허용 | **비공식 번역 + 영문 병기 + 타당화 계획** |
| 청소년 | USPSTF 12~18 우울 Grade B | 자살 선별 Grade I, 1388 | PHQ-A public domain | **PHQ-A 유지** |
| 50문항 회귀 | 반대 | 반대 | 반대 | **현재 구조 유지** |
| 기능손상 | 비채점 플래그 | 일상 기능 악화는 위험 신호 | 점수 미포함 | **very/extreme → urgent** |
| 배포 | — | — | 정적 라우트/보안 헤더 | **Nginx 보강** |
| 프라이버시 | — | 민감정보 최소화 | robots/캐시 | **민감 경로 Disallow, HTML no-cache** |
| 라이선스 | — | — | Expo LICENSE 오표기 | **프로젝트 MIT + THIRD_PARTY** |

### 웹 확인 근거

- PHQ-9/GAD-7: PHQ Screeners 약관상 public domain, 번역·복제·배포 허용.
- USPSTF 2022: 12~18세 우울 선별 Grade B, 자살 위험 선별 Grade I.
- 109/1577-0199/1388: 2024년 이후 유지, 2026년 현재 유효.
- 식약처: 법 전체 시행은 2025-01-24이며 일부 조항은 2026-01-24 시행입니다. 과거 기록의 일괄 2026년 표기를 정정합니다. 의료기기 해당 여부는 미확정이며 고지 문구만으로 확정되지 않습니다. 근거는 2026-11-06 감사 보고서를 확인하세요.

---

## 5. 주요 파일 지도

| 경로 | 역할 |
|---|---|
| `app/index.js` | 인트로, 동의, 연령 게이트, 위기 배너 |
| `app/survey.js` | 안전 → PHQ-9/PHQ-A → 기능손상 → GAD-7 → ASQ, 한국어/영문 토글 |
| `app/result.js` | 결과, 비채점 기능손상, 저장, 위기 자원 |
| `app/crisis.js` | 급성 위험 전체 화면 |
| `app/resources.js` | 위기 자원, 안전계획 6단계 |
| `app/history.js` | opt-in 기록/추이 |
| `app/centers.js` | 지역 정신건강복지센터 검색 |
| `app/+html.js` | 정적 HTML, manifest/SW, skip link, focus CSS |
| `data/instruments.js` | 문항, 밴드, 채점, 위험 라우팅, 버전/해시/번역 상태 |
| `lib/instrument-hash.js` | FNV-1a 문항 해시 |
| `lib/a11y.js` | 색상 대비 계산 |
| `lib/storage/adapter.js` | localStorage 저장(점수·위험 수준만) |
| `lib/assessment-session.js` | 결과 화면 전달용 세션 요약(점수·위험만, 원본 응답 제외) |
| `lib/storage/safety-plan.js` | 안전 계획 6단계 메모 저장(선택, 기기 내만, 500자 제한) |
| `bin/validate-instruments.js` | 문항/채점/해시/번역 상태 검증 |
| `bin/a11y-audit.js` | 접근성 정적 감사 |
| `bin/check-ouroboros-skill.js` | Ouroboros 스킬 적용 상태 검사 |
| `tests/scoring.test.js` | 채점/라우팅 |
| `tests/instruments.test.js` | 번역/해시/메타 |
| `tests/storage.test.js` | 저장 |
| `tests/a11y.test.js` | 대비 |
| `tests/release.test.js` | 세션 요약·결과 가드·PWA 아이콘·센터 URL 회귀 검사 |
| `tests/safety-plan.test.js` | 안전 계획 메모 저장·검증·삭제 회귀 검사 |
| `public/icons/` | PWA 192·512·maskable·apple-touch 아이콘 |
| `public/sw.js`, `public/offline.html` | PWA/오프라인 위기 안내 |
| `public/robots.txt` | 민감 경로 검색 차단 |
| `deploy/nginx/depression-check.conf` | Nginx 배포 설정 |
| `docs/ouroboros/seed.md` | 현재 수용 기준 |
| `docs/ouroboros/phase-log.md` | 페이즈 기록 |
| `docs/validation/korean-instrument-validation-plan.md` | 한국어 타당화 계획 |
| `docs/legal-review-checklist.md` | 법무/규제 게이트 |
| `docs/a11y-manual-test-plan.md` | 스크린리더 수동 테스트 |

---

## 6. 검증 명령

Windows PowerShell 기준:

```powershell
npm.cmd run validate
npm.cmd test
npm.cmd run a11y
npm.cmd run skill:check
npm.cmd run assessment:evaluate
npm.cmd run build:web
npm.cmd run security:build:check
npm.cmd run test:e2e
npm.cmd run manual:packet
npm.cmd run abc:packet
npm.cmd run deploy:packet
npm.cmd run phase:status
npm.cmd run deploy:smoke -- https://<배포-후보-도메인>
```

마지막 확인 결과:

```text
validate              → PASS
test                  → 99/99 PASS
assessment:evaluate   → 9/9 PASS
a11y                  → PASS
skill:check           → PASS
security:check        → PASS
security:build:check  → PASS
pwa:check             → PASS
expo install --check  → PASS (Dependencies are up to date)
npm ci                → PASS (클린 설치, 배포 스크립트와 동일)
build:web             → PASS (9 static routes)
test:e2e              → 46/46 Chromium PASS
audit --omit=dev      → 5 moderate, 0 high, 0 critical
GitHub Actions        → Browser safety PASS, Linux deployment harness PASS
release:ready         → EXPECTED BLOCKED (P0 사람 증빙 미완료)
```

---

## 7. 다음 작업 권장 순서

0. **완료**: Cycle 57~58 푸시(`c17b074`)와 두 CI PASS. 이제 실제 Phase 3 수동 접근성·기기 증빙으로 진행하세요.
1. **한국어 타당화**: `docs/validation/korean-instrument-validation-plan.md`대로 번역 대조 → 인지면담 → 파일럿 → 본조사.
2. **실제 스크린리더/기기 테스트**: `docs/a11y-manual-test-plan.md`대로 NVDA/VoiceOver/TalkBack, 320px·200%·전화 앱·오프라인을 현재 범위 해시로 기록.
3. **독립 A/B/C·법무·임상 운영 게이트**: 실제 외부 검토·후속연결/BSSA 책임 증빙을 수집한 뒤에만 `release:ready`를 재검토.
4. **운영 배포 검증**: 실제 TLS/Nginx 응답, CSP, PWA 설치/기존 탭 갱신을 후보 환경에서 확인.
5. **Expo 58 실기기·배포 후보 확인**: 업그레이드는 Cycle 35에서 완료됐지만, 실제 iOS/Android 빌드, 배포 후보 TLS/Nginx 응답, CSP, PWA 설치·기존 탭 갱신은 실기기에서 확인해야 합니다.

---

## 8. 다른 LLM을 위한 작업 지시문

이 프로젝트를 이어받은 LLM은 다음을 지키세요.

```text
1. 먼저 HANDOFF.md, AGENTS.md, README.md, docs/ouroboros/seed.md, phase-log.md를 읽어라.
2. 최신 커밋이 현재 앱이다. 추가 변경은 사용자 요청이 있을 때만 새 커밋으로 남기고, 로컬 도구 디렉터리는 커밋하지 마라.
3. 문항을 새로 만들지 마라. 검증된 도구와 현재 한국어 번역을 유지하라.
4. 변경 전에 docs/ouroboros/seed.md의 수용 기준을 확인하고, 필요하면 새 AC를 추가하라.
5. Ouroboros 스킬을 사용할 때는 Path C로 Phase 0~6을 순서대로 진행하라.
6. 변경 후 npm.cmd run validate, test, a11y, skill:check, build:web을 실행하라.
7. 급성 위험 라우팅, 위기 번호, “진단 아님” 문구를 훼손하지 마라.
8. 임상·상업 사용 가능 여부를 과장하지 마라. translationStatus가 unofficial이면 검증 전임을 명시하라.
9. 프로젝트 전면 삭제/재작성은 명시적 승인 없이 하지 마라.
```

---

## 9. 변경 이력 요약

- Cycle 1: 50문항 폐기 → 검증 도구 전환, 안전 라우팅, PWA, 접근성, 법무, 기록/추이, PHQ-A, 기능손상.
- Cycle 2: 한국어/영문 토글, 청소년 재검사 수정, LICENSE/서드파티, Nginx/robots, 문항 버전·해시, 한국어 타당화 계획, Ouroboros 스킬 적용.
- Cycle 3: 결과 URL 응답 노출 제거(세션 요약), `/result` 거짓 낮은 위험 가드, PWA 192/512/maskable 아이콘, 센터 검색 공식 URL(sc3), 릴리스 회귀 테스트.
- Cycle 4: 안전 계획 6단계 개인 메모(opt-in·기기 내 저장·전체 삭제), 위기 화면 메모 재확인, test 실행 범위 `tests/` 한정, 문구 통일.
- Cycle 5: 위험 신호 시 결과 화면 메모 노출, 추이 차트 접근성 라벨, 지역 그리드 반응형(320px), SW 아이콘 프리캐시(v2).
- Cycle 31: 합성 선별 정책 평가 CLI(9개 사례)와 위험 라우팅 회귀 검사.
- Cycle 32: 정적 Chromium 위기 경로 E2E, 동의/안전/ASQ Q5/직접 결과 진입 경계.
- Cycle 33: 마감 전 A/B/C·UI·배포 재검토, 방어적 결과 입력·도움 우선/ASQ 이전·PWA 보안 헤더 보완. 상세는 `docs/research/final-release-review-2026-11-07.md`.
- Cycle 34: 배포 후보 E2E 게이트·chromium 설치 분기·기존 TLS 구성 보호.
- Cycle 35: Expo 56→58 업그레이드, SDK 58 `+html` bodyNodes 보완, 앱 번들 누락 배포 감사, production critical/high 0. 상세는 `docs/ouroboros/phase-log.md`.
- Cycle 36: 공개 저장소 커밋·푸시 안전성, 로컬 도구 제외·경로 일반화·비밀 스캔.
- Cycle 37: 정상 완료·세션 최소화·저장 opt-in E2E, 기록 전체 삭제 성공 안내 수정.
- Cycle 38: `.gitignore` 루트 앵커링으로 `docs/ouroboros` 기록 추적 복구, 로컬 경로 표기 제거.
- Cycle 39: 청소년 PHQ-A·1388, localStorage/sessionStorage 차단 E2E 3건 추가(15/15).
- Cycle 40: 저장·삭제 실패 안내 E2E 2건 추가(17/17).
- Cycle 41: 만 14세 미만 연령 게이트 E2E 2건 추가(19/19).
- Cycle 42: 안전계획 메모 저장·삭제 실패 E2E 2건 추가(21/21).
- Cycle 43: 청소년 재검사 ageGroup 유지 E2E 1건 추가(22/22).
- Cycle 44: Cycle 37~43 푸시(`702d106`), CI 하네스 `expect_failure` 버그 수정·푸시(`4ad7914`), 두 워크플로 PASS. 사람 증빙 게이트는 계속 차단.
- Cycle 45: 수동 접근성·실기기 검증 패킷 CLI(`manual:packet`)와 회귀 테스트 추가(90/90).
- Cycle 46: 320px 레이아웃 E2E 6건(28/28), 직접 위기 URL hydration #418 수정.
- Cycle 47: 안전계획 메모 위기 화면 표시·삭제 E2E 2건(30/30).
- Cycle 48: urgent 결과 저장 메모 노출·작성 안내 E2E 2건(32/32).
- Cycle 49: Cycle 45~48 푸시(`afaa28f`), 두 CI PASS, 범위 해시 `bbb427a5`. 사람 증빙 게이트는 계속 차단.
- Cycle 50: PHQ-9 한국어/영문 토글·번역 고지 E2E 1건(33/33).
- Cycle 51: 추이 행 접근성 라벨·기록 단건 삭제 E2E 2건(35/35).
- Cycle 52: 오프라인 PWA 위기 안내 fallback E2E 1건(36/36).
- Cycle 53: 기능손상 very → urgent E2E 1건(37/37).
- Cycle 54: 지역 센터 공식 포털 URL E2E 1건(38/38).
- Cycle 55: 키보드 건너뛰기 링크 E2E 1건(39/39).
- Cycle 56: Cycle 50~55 푸시(`8ffcb6c`), 두 CI PASS, 범위 해시 `bbb427a5`. 사람 증빙 게이트는 계속 차단.
- Cycle 57: 공식 포털 연결 실패 안내 E2E 1건(40/40).
- Cycle 58: 배포 후보 검증 패킷 CLI(`deploy:packet`)와 회귀 테스트 2건(92/92).
- Cycle 59: 남은 사이클 일괄 배치(`c17b074`), 두 CI PASS, 패킷 3종 해시 `350cfc4f`. 사람 증빙 게이트는 계속 차단.
- Cycle 60: 저장소 차단 자원·위기 E2E 1건(41/41).
- Cycle 61: 페이즈 상태 요약 CLI(`phase:status`)와 회귀 테스트 2건(94/94).
- Cycle 62: Phase 3 자동 reflow E2E 5건(46/46). 수동 접근성 증빙은 계속 BLOCKED.
- Cycle 63: 배포 후보 스모크 검사 CLI(`deploy:smoke`)와 회귀 테스트 4건(98/98).
- Cycle 64: 스모크 검사 상태·Content-Type·아이콘·CSP hydration 해시 강화.
- Cycle 65: manifest·SW·offline·crisis 보안 헤더 상속 검사(99/99).

---

## 10. 면책

이 앱은 의료기기가 아니며 질병 유무를 판단하지 않습니다. 위기 상황에서는 109, 119, 112 또는 주변의 신뢰할 수 있는 사람에게 즉시 도움을 요청하세요. 임상·상업 배포 전에는 법무·규제·임상 검토가 필요합니다.
