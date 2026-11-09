# 마음 체크 — 우울·자살 위험 자가 선별

우울증과 자살 위험을 **조기에 발견**하고, 일반인이 자신의 상태와 심각도를 빠르게 인지해 **전문가에게 연결**되도록 돕는 Expo 기반 자가 선별 앱입니다. 완벽한 심리 상담이나 진단을 목표로 하지 않습니다.

> 이 프로젝트를 이어받는 사람이나 다른 LLM은 먼저 **`HANDOFF.md`**를 읽으세요. 현재 상태, Ouroboros 스킬 적용 방법, 페이즈 기록, 검증 명령, 남은 작업이 정리되어 있습니다.

## 이 앱이 하는 일

- **PHQ-9** 9문항(한국어 번역 + 영문 원문)으로 지난 2주의 우울 증상 수준을 확인합니다.
- 설문 전 **비채점 고민 탐색 질문**으로 지금 원하는 도움을 고를 수 있습니다. 이 답변은 점수·위험 수준·저장 데이터에 포함되지 않습니다.
- **GAD-7** 7문항(한국어 번역 + 영문 원문)으로 불안 증상 수준을 확인합니다.
- **ASQ**(NIMH) 4문항 + 급성도 1문항(NIMH 공식 한국어 번역)으로 자살 위험 신호를 선별합니다.
- 청소년(만 14~17세)은 **PHQ-A** 9문항(한국어 번역 + 영문 원문)으로 우울 증상을 확인합니다.
- 증상이 일상생활에 준 어려움을 묻는 **비채점 문항 1개**로 기능 손상을 확인합니다(점수에 포함하지 않음).
- 설문 초반의 **현재 안전 확인**에서 급성 위험이 확인되면, 점수나 결과를 보여주지 않고 **즉시 위기 안내 화면**으로 이동합니다.
- 결과는 복합 점수나 진단이 아니라 **척도별 점수·수준·다음 행동**으로 보여줍니다.
- **안전 계획 6단계**를 안내하고, 원하면 각 단계에 나만의 메모를 작성해 둘 수 있습니다(선택, 이 기기에만 저장).
- 109(자살예방상담), 119(응급), 112(경찰), 1577-0199(정신건강), 1388(청소년), 정신건강복지센터 안내를 제공합니다.

## 이 앱이 하지 않는 일

- 우울증이나 자살 위험을 **진단**하지 않습니다.
- 자살 위험을 확률·점수로 **예측**하지 않습니다.
- 응급 상황을 자동으로 감지하거나 구조를 요청하지 않습니다.
- 치료 방법이나 약을 권하지 않습니다.
- 실시간 AI 상담이나 자동 진단을 제공하지 않습니다.
- 낮은 점수나 ASQ 음성만으로 안전하거나 다른 정신건강 어려움이 없다고 판단하지 않습니다.
- 답변을 서버로 전송하거나 광고·분석에 사용하지 않습니다.

## 선별 흐름

```text
인트로(동의·연령 게이트·안내·위기 배너)
  → 현재 안전 확인 4문항
      ├ 급성 위험 → /crisis (즉시 중단)
      └ 그 외 → PHQ-9 9문항 (청소년은 PHQ-A 9문항)
                → 일상 기능 확인 1문항(비채점)
                → GAD-7 7문항
                → ASQ 4문항
                    ├ Q5 양성 → /crisis
                    └ 그 외 → /result
  → 결과: 우울 점수/수준 + 불안 점수/수준 + 자살 선별 상태
          + 다음 행동 + 안전 계획 + 위기 자원
```

## 점수 해석

### PHQ-9 (0–27)

| 점수 | 수준 | 권장 행동 |
|---|---|---|
| 0–4 | 낮은 수준 | 상태 변화 시 재점검 |
| 5–9 | 가벼운 수준 | 2~4주 후 재점검 |
| 10–14 | 중간 수준 | 2주 안에 전문가 상담 고려 |
| 15–19 | 중간 이상 | 수일 안에 전문가 평가 |
| 20–27 | 높은 수준 | 빠른 전문가 평가 + 안전 확인 |

### GAD-7 (0–21)

| 점수 | 수준 |
|---|---|
| 0–4 | 낮은 수준 |
| 5–9 | 가벼운 수준 |
| 10–14 | 중간 수준 |
| 15–21 | 높은 수준 |

### ASQ

- 4문항 중 하나라도 "예" 또는 "잘 모르겠어요" → **양성, 추가 평가 필요**
- Q5(현재 자살사고) "예" 또는 "잘 모르겠어요" → **급성, 즉시 위기 안내**
- ASQ 양성은 "자살할 것"이라는 뜻이 아니라 **전문가의 추가 평가가 필요하다**는 뜻입니다.

## 위기 자원

| 기관 | 전화 | 운영 | 안내 |
|---|---|---|---|
| 자살예방상담전화 | **109** | 24시간 | 자살 위기 상담, 긴급 출동·지역 센터 연계 |
| 응급 구급 | **119** | 24시간 | 지금 다치거나 생명이 위험한 상황 |
| 경찰 | **112** | 24시간 | 즉각적인 신체 위험, 출동이 필요한 상황 |
| 정신건강 위기상담 | **1577-0199** | 24시간 | 정신건강 전반 상담, 지역 센터 연결 |
| 청소년전화 | **1388** | 24시간 | 만 9~24세 청소년 상담 |
| 생명의전화 | **1588-9191** | 24시간 | 자살 위기 전화·사이버 상담 |
| 정신건강복지센터 | 지역별 | 평일 주간 | 무료 상담·사례관리·의료기관 연계 |

전화번호와 운영시간은 `data/instruments.js`의 `RESOURCE_VERIFIED_AT`에 최종 확인일을 기록합니다. 배포 전과 이후 분기별로 재확인하세요.

## 개인정보

- 서버 없이 동작합니다. 답변은 기기 안에서만 처리됩니다.
- 이름·전화번호·주민번호를 수집하지 않습니다.
- 분석 SDK, 광고 SDK, 응답 콘솔 로그를 사용하지 않습니다.
- 결과 저장은 사용자가 선택(opt-in)한 경우에만 브라우저 localStorage에 점수·위험 수준만 저장하며, 문항별 응답·이름·연락처는 저장하지 않습니다.
- 결과 화면으로 넘어갈 때 문항별 응답을 URL에 남기지 않습니다. 점수·밴드·위험 수준과 비채점 기능 어려움 수준 요약만 탭 세션에 임시 보관하며, 새 선별을 시작하면 이전 요약은 지워집니다.
- 결과 요약이 없거나 만료되면 낮은 위험으로 추정하지 않고 “결과를 불러올 수 없습니다” 안내를 보여줍니다.
- 저장된 기록은 “나의 변화 추이”에서 언제든지 개별/전체 삭제할 수 있습니다.
- **안전 계획 메모(선택)**: 각 단계에 직접 입력한 메모는 이 기기의 브라우저에만 저장되며 서버로 전송되지 않습니다. 저장된 메모는 “도움받을 곳”에서 언제든 전체 삭제할 수 있고, 위기 상황 화면에서 다시 확인할 수 있습니다. 완성된 안전 계획은 전문가와 함께 점검해 보세요.
- 모든 화면 우측 상단에 **빠른 나가기** 버튼이 있어 외부 사이트로 즉시 이동할 수 있습니다.

## 로컬 실행

```bash
npm install
npm.cmd run web
```

PowerShell 실행 정책 때문에 `npm`이 막히면 Windows에서는 `npm.cmd`를 사용하세요.

## Ouroboros 인터뷰 스킬

이 프로젝트는 `Q00/ouroboros`의 interview 스킬을 **프로젝트 로컬 스킬**로 고정해 사용합니다.

- 스킬: `.opencode/skills/ouroboros-interview/SKILL.md`
- 명령: `opencode` 재시작 후 `/ouroboros-interview <주제>`
- 기본 경로: **Path C (Local A/B/C Expert Mode)** — MCP 서버 설치 없이 로컬 자료 + 웹 + 코드로 교차검증
- 기록: `docs/ouroboros/seed.md`, `docs/ouroboros/phase-log.md`
- 상태 확인: `npm.cmd run skill:check`

MCP 기반 Path A를 사용하려면 별도로 `ouroboros setup --runtime opencode`를 실행해야 합니다.

opencode는 시작한 폴더 기준으로 프로젝트 설정을 찾습니다. 상위 작업 폴더에서 실행할 때도 인식되도록 전역 설정에 이 프로젝트의 스킬 경로를 등록할 수 있지만, 가능하면 프로젝트 폴더에서 `start-opencode.cmd`로 실행하는 것을 권장합니다.

## 검증

```bash
npm.cmd run validate
npm.cmd test
npm.cmd run a11y
npm.cmd run skill:check
```

- `validate`: 문항 수, 응답 척도, 밴드 경계, ASQ 양성/급성, 위험 티어, 위기 자원을 검사합니다.
- `test`: `node --test` 기반 채점·라우팅 단위 테스트를 실행합니다.
- `a11y`: 접근성 정적 감사와 주요 색상 대비를 검사합니다.
- `skill:check`: Ouroboros 인터뷰 스킬·명령·Seed/Phase 기록이 유지되는지 검사합니다.

## 정적 웹 빌드

```bash
npm.cmd run build:web
```

빌드 결과는 `dist/`에 생성됩니다.

## 프로젝트 구조

```text
.
├── app/
│   ├── _layout.js       # Stack 라우트 등록
│   ├── +html.js         # 웹 정적 HTML 템플릿(manifest·SW·focus CSS)
│   ├── index.js         # 인트로·동의·연령 게이트·위기 배너
│   ├── survey.js        # 안전 확인 → PHQ-9/PHQ-A → 기능손상 → GAD-7 → ASQ
│   ├── crisis.js        # 급성 위험 전체 화면
│   ├── resources.js     # 위기 자원·안전 계획
│   ├── result.js        # 척도별 결과·다음 행동·저장
│   ├── history.js       # opt-in 저장 결과·추이
│   └── centers.js       # 지역별 정신건강복지센터 안내
├── components/
│   ├── CrisisBanner.js
│   ├── ResourceList.js
│   └── QuickExit.js     # 빠른 나가기
├── data/
│   └── instruments.js   # 문항·채점·밴드·위험 라우팅·자원
├── lib/
│   ├── storage/adapter.js # localStorage 저장(점수·위험 수준만)
│   ├── storage/safety-plan.js # 안전 계획 메모 저장(선택·기기 내만)
│   ├── assessment-session.js # 결과 화면 전달용 세션 요약(원본 응답 제외)
│   ├── instrument-hash.js # 문항 동결용 결정적 해시
│   └── a11y.js          # 색상 대비 유틸
├── bin/
│   ├── validate-instruments.js
│   └── a11y-audit.js    # 접근성 정적 감사
├── tests/
│   ├── scoring.test.js
│   ├── instruments.test.js
│   ├── storage.test.js
│   ├── safety-plan.test.js # 안전 계획 메모 회귀 검사
│   ├── release.test.js  # 결과 전달·PWA 아이콘·센터 URL 회귀 검사
│   └── a11y.test.js
├── public/
│   ├── icons/           # PWA 192·512·maskable·apple-touch 아이콘
│   ├── manifest.json    # PWA manifest
│   ├── sw.js            # service worker
│   └── offline.html     # 오프라인 위기 안내
├── docs/
│   ├── research/        # 전문가 A/B/C 리서치·교차검증
│   ├── legal-review-checklist.md
│   ├── a11y-manual-test-plan.md
│   └── validation/korean-instrument-validation-plan.md
├── THIRD_PARTY_NOTICES.md
├── LICENSE
└── deploy/              # Contabo/Nginx 배포
```

## 근거와 한계

- PHQ-9: Kroenke, Spitzer & Williams (2001), 영문 원문 퍼블릭 도메인.
- GAD-7: Spitzer et al. (2006), 영문 원문 퍼블릭 도메인.
- ASQ: NIMH Ask Suicide-Screening Questions Toolkit, 무료.
- 청소년(만 14~17세)은 우울 증상 선별에 PHQ-A(public domain) 9문항을 사용하며, 자살 위험은 동일하게 ASQ로 선별합니다.
- PHQ-9/GAD-7/PHQ-A는 public domain이며, 앱은 **한국어 이해용 번역과 영문 원문**을 함께 제공합니다. 채점은 영문 원문 기준이며, 한국어판의 임상적 타당화는 배포 전 별도 검토가 필요합니다. ASQ는 NIMH 공식 한국어 번역을 사용합니다.
- 서드파티 라이선스와 출처는 `THIRD_PARTY_NOTICES.md`에 정리되어 있습니다.
- 한국어판 타당화 계획은 `docs/validation/korean-instrument-validation-plan.md`에 있습니다. 타당화 완료 전에는 임상·상업 목적으로 사용하지 않습니다.
- 자살 선별은 추가 평가를 위한 신호이며, 자살 사망을 예방한다는 효능을 주장하지 않습니다.
- 이 앱은 의료기기나 의료 서비스가 아니며, 진단·치료를 대신하지 않습니다.

자세한 근거와 출처는 `docs/research/`를 참고하세요.

## Contabo 배포 개요

```text
GitHub 저장소
  -> Contabo VPS에서 git pull
  -> npm ci
  -> npm run build:web
  -> Nginx가 dist/ 서빙
```

관련 파일:

- `deploy/nginx/depression-check.conf`
- `deploy/scripts/setup-contabo.sh`
- `deploy/scripts/deploy-contabo.sh`
- `DEPLOYMENT.md`

## 최초 서버 설정 예시

```bash
sudo DOMAIN=your-domain.com WWW_DOMAIN=www.your-domain.com \
  REPO_URL=https://github.com/junwoo1206112/Psychological-Counseling.git \
  bash deploy/scripts/setup-contabo.sh
```

## 업데이트 배포

```bash
sudo bash deploy/scripts/deploy-contabo.sh
```

## 면책

이 서비스는 조기 발견을 돕는 자가 선별 도구이며 의학적 진단이나 치료를 대신하지 않습니다. 위기 상황이라면 즉시 119, 112, 109 또는 주변의 신뢰할 수 있는 사람에게 도움을 요청하세요.

본 제품은 의료기기가 아니므로 질병 유무를 판단할 수 없으며, 질병 유무 판단을 위해서는 의사의 검진이 필요합니다. 자세한 규제 포지셔닝은 `docs/legal-review-checklist.md`를 참고하세요.
