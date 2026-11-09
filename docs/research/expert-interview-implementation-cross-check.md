# 전문가 인터뷰 교차검증 및 구현 점검 기록

> 방법: procurement-rules-rag-copilot `expert-interview-openspec` 스킬과 Codex_AI_스킬 `interview` 스킬의 방법론(사실 확인 → 교차검토 → 결정 기록 → 구현)을 수동 적용.
> 입력: 전문가 A(임상·심리측정), B(자살예방·위기개입), C(오픈소스·구현) 브리프, 웹 최신 정보(2026-11-02), 현재 Psychological-Counseling 코드.

## 1. 사실 확인 (웹 + 폰더)

| 항목 | 확인 출처 | 결과 |
|---|---|---|
| 109 통합 | 보걸복지부 볏도자료(2024-01-02), 129.go.kr/109 | 2024-01-01부터 자살예방상담 109 통합. 1577-0199(정신건강), 1388(청소년)은 종전대로 운영. |
| PHQ-9/GAD-7 라이선스 | phqscreeners.com/terms, Pfizer 볏도자료(2010) | 영문 원문은 public domain, free for download and use. 한국어 번역은 별도 권리. |
| ASQ | NIMH ASQ Toolkit | 8세 이상 의료환경용, Korean translation 공개, 물료. Q1–4 양성 시 Q5(현재 생각) 추가. |
| 디지털의료제품법 | 국가법령정보센터, 식약처 고시(2026-01-23) | 법 전체는 2025-01-24 시행, 일부 조항은 2026-01-24 시행. 진단·치료·예후 관찰 목적 소프트웨어는 디지털의료기기 해당 가능. "진단 아님" 포지셔닝 중요. |

## 2. 교차검토: 세 전문가 일치 항목

| 항목 | A | B | C | 현재 코드 | 판정 |
|---|---|---|---|---|---|
| 50문항·임의 가중치 폐기 | ✅ | ✅ | ✅ | 4+9+7+4+(1) 문항, 고정 채점 | ✅ 유지 |
| PHQ-9 사용 | ✅ | ✅ | ✅ | 영문 원문 + 한국어 힌트 | ✅ 유지 |
| GAD-7 사용 | ✅ | (선택) | ✅ | 영문 원문 + 한국어 힌트 | ✅ 유지 |
| ASQ 1차 자살 스크리너 | ✅ | ✅ | ✅ | 4문항 + Q5 급성도 | ✅ 유지 |
| PHQ-9 item 9 단독 의존 금지 | ✅ | ✅ | ✅ | item9은 urgent 플래그, ASQ로 확인 | ✅ 유지 |
| 자살 선별 전원 시행 | ✅ | ✅ | ✅ | 안전 확인 + ASQ 모두 시행 | ✅ 유지 |
| 복합 점수·ML·퍼센트 금지 | ✅ | ✅ | ✅ | 척도별 점수/밴드만 표시 | ✅ 유지 |
| "진단/DSM 충족" 표현 금지 | ✅ | ✅ | ✅ | 면책 문구 반복 | ✅ 유지 |
| 급성 위험 시 결과보다 crisis 먼저 | ✅ | ✅ | ✅ | safety acute, ASQ Q5 양성 → /crisis | ✅ 유지 |
| 109 1차 CTA | ✅ | ✅ | ✅ | CrisisBanner, crisis.js, ResourceList | ✅ 유지 |
| 상시 위기 배너 | ✅ | ✅ | ✅ | 모든 화면 상단 배너 | ✅ 유지 |
| Stanley–Brown 안전계획 | (보조) | ✅ | ✅ | 6단계 안내 | ✅ 유지 |
| no-backend·무수집 | ✅ | ✅ | ✅ | 서버 요청 0, 응답 로그 금지 | ✅ 유지 |

## 3. 발견한 문제점/개선점

### P0 — 즉시 수정

1. **crisis.js reason 메시지 부정확**
   - 현상: `reason='asq'`(ASQ Q5 양성)일 때도 "현재 안전 확인에서 급성 위험 신호가 확인되었습니다"라고 표시됨.
   - 위험: 사용자가 어떤 경로로 crisis에 왔는지 혼란.
   - 조치: `reason`별 메시지 분리(safety vs asq vs result).

### P1 — UX/문구 개선

2. **result.js 청소년 문구 공백**
   - JSX 내 불필요한 다중 공백 존재. 렌더링에는 영향 없으나 유지보수 저해.

3. **result.js ASQ 음성 문구**
   - 현재: "현재 보고된 응답에서는 급성 자살 위험 신호가 확인되지 않았습니다."
   - 개선: "현재 응답에서는 급성 위험이 낮지만, 상태가 변하면 다시 확인하세요."(전문가 A 권장, 음성≠안전)

4. **ScoreCard에 "진단 아님" 반복**
   - 각 점수 카드 하단에 "이 점수는 진단이 아닙니다" 문구 추가(전문가 A/B 권장).

### P2 — 검증 강화

5. **validate 스크립트에 ASQ Q5 급성 라우팅 우선순위 추가**
   - 이미 evaluateRisk 테스트에 포함. 실제 React 라우팅은 별도 E2E 필요.

6. **RESOURCE_VERIFIED_AT 최신성**
   - 2026-11-02로 기록. 웹 확인 결과 번호·운영시간 변동 없음.

## 4. 저작권 위배 정리

- PHQ-9/GAD-7: 영문 원문 public domain 사용. 한국어판 별도 권리 관계 없음. ✅
- ASQ: NIMH 공식 한국어 번역 사용, 물료. ✅
- Safety 문항: 전문가 B 권장 문구를 재구성, 저작권 제3자 없음. ✅
- 한국 서비스(트로스트/블루터치/국가정신건강정보포털) 문항·결과 문구 복제 없음. ✅
- GPL/AGPL 코드 복제 없음. ✅

## 5. 결정사항

- ASQ 4문항 + Q5 급성도 유지. Safety 확인은 4문항 유지(currentIdeation, plan, meansOrUnsafe, pastAttempt).
- PHQ-9 → GAD-7 → ASQ 순서 유지(전원 시행, cross-validation 합의안).
- crisis.js reason별 메시지 분리.
- result.js 문구 개선 및 ScoreCard disclaimer 추가.
- no-backend·무수집 원칙 유지.

## 6. 후속 검토 권장

- 한국어 PHQ-9/GAD-7 공식 번역 허락(배포 전). — 개인 포트폴리오용으로는 현재 영문 원문 + 참고용 키워드 사용으로 문제 없음.
- 청소년 전용 척도/모드: 현재는 1388 안내 강화 및 청소년 맞춤 문구로 처리. PHQ-A 등 청소년용 척도 도입은 임상·법적 검토 후 별도 구현.
- 저장(opt-in local) 및 재검사 추이 기능 — 구현 완료.
- WCAG 2.2 AA / PWA manifest — 기본 구현 완료.
- 정신건강복지센터 연결 지역화 — 구현 완료(수동 시/도 선택 + 포털 검색 URL).

## 7. 2차 후속 작업 교차검증 (2026-11-02)

### 7.1 사실 확인

| 항목 | 확인 출처 | 결과 |
|---|---|---|
| PHQ-A 라이선스 | NIMH ASQ Toolkit PHQ-A, APA DSM-5-TR 아동용 우울 심각도 | **public domain**, 연구·임상 사용 시 별도 허락 불필요. 9문항 우울 심각도(0–27)로 사용 가능. |
| PHQ-A 구성 | NIMH PHQ-A PDF | 9문항 채점 + 지난 1년 문항(10) + 기능 손상 문항(11). PHQ-A 9문항은 PHQ-9과 순서·표현이 다름(청소년 표현). |
| Expo static HTML | Expo PWA 문서, GitHub expo#28807 | `web.output:"static"`에서는 `public/index.html`이 무시되고 **`app/+html.js`**가 사용됨. 기존 PWA 링크가 적용되지 않았을 가능성. |
| Service worker | Expo PWA 문서 | Metro/Expo Router는 기본 SW를 제공하지 않음. **수동 등록**(+html.js) 또는 Workbox post-build 필요. 공격적 캐싱 주의. |
| WCAG 2.2 AA 신규 | W3C WCAG 2.2 | 2.4.11 Focus Not Obscured, 2.5.7 Dragging Movements, **2.5.8 Target Size 24×24**, 3.3.8 Accessible Authentication. |
| 웰니스/의료기기 판단 | 식약처 「의료기기와 개인용 건강관리(웰니스)제품 판단기준」(2026-02) | 사용목적·위해도 기준. 질병 진단·치료 목적 표현 시 의료기기. 저위해 웰니스는 비의료기기. 권고 문구: "본 제품은 의료기기가 아니므로 질병 유무를 판단할 수 없으며, 질병 유무 판단을 위해서는 의사의 검진이 필요합니다." |

### 7.2 A/B/C 교차검토 결론

| 항목 | A(임상) | B(위기) | C(구현) | 결정 |
|---|---|---|---|---|
| 청소년 우울 척도 | PHQ-A 사용 권장(청소년 표현) | PHQ-A/ASQ 조합 허용 | PHQ-A는 public domain, 채택 가능 | **PHQ-A 9문항 채택(청소년 모드)**. 진단·기능손상 판정은 하지 않고 심각도 선별만 |
| 청소년 자살 선별 | ASQ 전원 | ASQ 전원 | ASQ NIMH 무료 | **ASQ 유지** |
| PWA 오프라인 | 위기번호·안전계획 오프라인 필요 | 비상시 오프라인 중요 | SW는 보수적 캐싱 필요 | **network-first + 오프라인 위기 안내 페이지** |
| WCAG | 접근성 필수 | 저문해·큰 글씨 | target size/focus | **focus-visible, 24px 타겟, 대비 수정** |
| 규제 포지셔닝 | 진단 아님 | 효능 주장 금지 | 웰니스/선별+연결 | **식약처 권고 문구 추가** |

### 7.3 이번 구현 결정

1. **청소년 모드 = PHQ-A 9문항(public domain)**: `ageGroup === 'youth'`일 때 PHQ-9 대신 PHQ-A 사용. 채점은 0–27, 밴드는 동일. 지난 1년 문항은 진단(dysthymia) 영역이므로 제외하고, 기능손상 문항은 **비채점**으로 추가(8장 참조).
2. **PWA**: `app/+html.js`로 manifest/SW/메타/focus CSS 주입, `public/sw.js`는 network-first + 정적 자산 캐시, `public/offline.html`에 위기번호·안전계획 수록. `public/index.html`은 static output에서 무시되므로 제거.
3. **WCAG 2.2 AA**: 전역 `:focus-visible` 아웃라인, 최소 24×24 타겟, 저대비 텍스트 색상(#78909C→#546E7A, #607D8B→#455A64) 수정, reduced-motion 유지.
4. **법무**: 결과·README에 식약처 권고 문구 추가, `docs/legal-review-checklist.md` 작성.

## 8. 3차 후속 작업 교차검증 (스크린리더·기능손상·상업화)

### 8.1 사실 확인

| 항목 | 확인 출처 | 결과 |
|---|---|---|
| 스크린리더 테스트 | web.dev, UIC, Princeton OIT, wA11y | 자동 도구는 30~40%만 탐지. NVDA(Chrome/Firefox), VoiceOver(Safari), TalkBack(Chrome) 수동 테스트 필요. 제목·heading·landmark·radio 상태·라이브 리전·키보드·포커스·타겟 크기 확인. |
| PHQ-A 기능손상 | GLAD-PC 2018 Rec.2, NIMH PHQ-A | 기능손상은 학교·가정·또래 영역에서 평가 권고(강한 권고). PHQ-A 기능손상 문항은 비채점. 지난 1년 문항은 dysthymia 진단용. |
| 청소년 우울 선별 | USPSTF 2022 | 12~18세 MDD 선별 Grade B. PHQ-A Se 0.73, Sp 0.94. |
| 상업화 규제 | 식약처 「의료기기 해당여부 및 품목분류·등급 판단기준」(2025-12-31), 민원 절차 | 의료기기 해당 여부 검토 신청으로 공식 판단 가능. 상업화·의료기관 연계 시 허가·인증·품질관리 검토 필요. |

### 8.2 A/B/C 교차검토 결론

| 항목 | A(임상) | B(위기) | C(구현) | 결정 |
|---|---|---|---|---|
| 기능손상 문항 | 비채점 플래그로 사용 권장 | 일상 기능 악화는 위험 상향 신호 | 선택지 4개, 점수 미포함 | **비채점 추가, very/extreme → urgent** |
| 지난 1년 문항 | dysthymia 진단 영역 | 진단 아님 원칙 | 진단 알고리즘 금지 | **제외 유지** |
| 스크린리더 | 접근성 필수 | 위기 화면 즉시 접근 | 자동+수동 병행 | **자동 감사 + 수동 테스트 계획** |
| 상업화 | 임상 자문 필요 | 오탐 대응 프로토콜 | 규제 게이트 | **상업화 게이트 문서화** |

### 8.3 이번 구현 결정

1. **비채점 기능손상 문항**: 우울 척도 직후 1문항. 점수에 포함하지 않고, `very`/`extreme`이면 urgent로 상향. 결과 화면에 “일상 기능(비채점)”으로 분리 표시.
2. **접근성 자동 감사**: `lib/a11y.js`(대비 계산), `tests/a11y.test.js`, `bin/a11y-audit.js`, `npm run a11y`. 팔레트 대비를 AA 기준으로 보정.
3. **스크린리더 전용 개선**: heading 역할/레벨, radio 상태, 라이브 리전, skip link, forced-colors, 최소 타겟.
4. **수동 테스트 계획**: `docs/a11y-manual-test-plan.md`에 NVDA/VoiceOver/TalkBack 시나리오와 기록 템플릿.
5. **상업화 게이트**: `docs/legal-review-checklist.md` 8장에 트리거·식약처 절차·필수 산출물 명시.

## 9. 4차 전체 감사 및 방향성 판정 (2026-11-02)

### 9.1 판정

- **삭제·전면 재작성은 불필요.** 현재 구조(검증된 선별 → 안전 우선 라우팅 → 전문가 연결 → no-backend)는 README의 목적과 일치한다.
- 이전 50문항·임의 가중치·pseudo-DSM은 측정학적 근거가 없어 폐기가 맞다. 현재 구현을 유지하고 아래 불일치만 보정한다.
- 남은 불일치: ① 한국어 서비스인데 핵심 문항이 영어, ② 청소년 재검사 시 ageGroup 유실, ③ 기록 오타·접근성 상태, ④ LICENSE가 Expo 명의로 되어 있음, ⑤ Nginx 정적 라우트/보안 헤더.

### 9.2 A/B/C 교차검토

| 항목 | A(임상) | B(위기) | C(구현) | 결정 |
|---|---|---|---|---|
| 한국어 문항 | 검증된 한국어판 권장 | 저문해·접근성 | PHQ-9/GAD-7은 public domain, 번역 허용 | **한국어 번역 + 영문 원문 병기**, 채점은 영문 기준, 타당화 전 고지 |
| 청소년 | USPSTF 12–18 우울 Grade B | 자살 선별 Grade I, 1388 연계 | PHQ-A public domain | **PHQ-A 유지**, ASQ 유지, 만 14–17세 게이트 |
| 50문항 회귀 | 반대 | 반대 | 반대 | **현재 구조 유지** |
| 배포 | — | — | 정적 라우트·보안 헤더 필요 | **Nginx try_files/헤더 수정** |
| 라이선스 | — | — | Expo LICENSE 오표기 | **프로젝트 MIT + THIRD_PARTY_NOTICES** |

### 9.3 이번 구현 결정

1. **한국어 문항**: PHQ-9/PHQ-A/GAD-7/기능손상 문항의 한국어 번역을 추가하고, 설문에서 “영문 원문 보기” 토글 제공. 채점은 기존 영문 원문 기준을 유지하고 `KOREAN_TRANSLATION_NOTICE`로 명시.
2. **청소년 흐름**: 결과 화면의 “다시 검사하기”가 `ageGroup`을 유지하도록 수정. 연령 선택 버튼에 radio 역할/선택 상태, 시작 버튼에 disabled 상태 노출.
3. **기록/접근성**: “최근 50건” 오타 수정, 빈 상태 제목 heading, 로딩 라이브 리전 추가.
4. **라이선스**: `LICENSE`를 프로젝트 MIT로 교체하고 `THIRD_PARTY_NOTICES.md` 신설.
5. **배포**: Nginx `try_files $uri $uri.html $uri/ /index.html`, `sw.js`/`manifest.json` no-cache, 보안 헤더·gzip 추가.
6. **검증**: 한국어 문항 수·한글 포함·금지 표현 테스트를 `tests/instruments.test.js`와 `validate`에 추가.
