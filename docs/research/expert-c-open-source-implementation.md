# 전문가 C — 오픈소스·구현 아키텍처 브리프

> 역할: 오픈소스·디지털 제품 구현 연구. GitHub/웹 검증 스냅샷(2026-11). 코드 품질은 저장소 README/LICENSE 기준이며 도입 전 리뷰 필요.

## 1. 핵심 결론

1. 현재 구조(임의 가중치 50문항 + pseudo-DSM-5 + 백분율 링)는 **측정학적 근거가 없고**, 자살위험을 "점수"로 희석하며, 결과가 사실상 진단처럼 읽힌다. 가장 큰 리스크는 임상 정확성 부족이 아니라 **위험 신호를 포착했을 때 라우팅하지 않는 것**이다.
2. 권고: **PHQ-2 → PHQ-9(문항 9 = suicide gate) → GAD-2 → GAD-7 → ASQ(4문항 + acuity 1문항)** stepped screening. 최대 25문항, 저위험 사용자는 4문항에서 종료. Kroenke의 2단계 선별은 1차의료 표준 패턴이다.
3. **채점(scoring) / 라우팅(routing) / 문구(content) 3계층 분리.** 라우팅 규칙은 코드가 아니라 **데이터 표**로 두어 임상 자문이 diff로 검토 가능하게 한다.
4. **PHQ-9 item 9 단독 의존 금지.** item 9 > 0 또는 PHQ-9 ≥ 10이면 ASQ로 escalate. ASQ Q5(현재 생각) "예"는 급성 → 즉시 crisis 화면으로 하드 라우팅.
5. 결과 페이지를 "진단"에서 **"선별 + 다음 행동"** 으로 전환. 총점/밴드/권고 + 109·1577-0199·정신건강복지센터 CTA. 백분율 링, "likely MDD", 10개 도메인 막대 삭제.
6. No-backend를 안전자산으로 활용: 네트워크 호출 0, 분석 SDK 0, 응답 로그 0. 저장은 opt-in + 로컬 전용 + 기록 삭제 노출. 민감정보 처리 리스크를 구조적으로 축소.

### 컴플라이언스 핵심 2건
- PHQ-9/GAD-7 **영문 원문**은 "No permission required to reproduce, translate, display or distribute". 그러나 **한국어판 PHQ-9은 별도 권리관계**가 있다. 국가정신건강정보포털은 "본 자가검진 문항의 2차 배포를 금합니다"라고 고지. **포털/검진 문항 텍스트 크롤링·복제 금지.**
- **C-SSRS는 무료이지만 퍼블릭 도메인이 아니다.** 지역사회/의료기관 사용은 무허가 가능하나 전자형(eC-SSRS)은 CLARIO 라이선스. **ASQ는 NIMH 공개 자료로 한국어판 PDF까지 무료** → 자가입력형 앱의 1차 스크리너로 법적/실무적으로 안전.

## 2. 오픈소스 저장소 (검증 스냅샷)

| # | Repo | Stars | Last push | License | Stack | 재사용 |
|---|---|---:|---|---|---|---|
| 1 | [urtuba/psytools](https://github.com/urtuba/psytools) | 3 | 2026-10-09 | **MIT(코드) / 기기별(문항)** | TypeScript, zero-dep | **최우선 참고.** 27개 척도 선언적 scoring, 검증, i18n, JSON Schema. `SOURCES.md` 라이선스 태그 모델 |
| 2 | [rhavekost/clinical-toolkit](https://github.com/rhavekost/clinical-toolkit) | 3 | 2026-02-04 | MIT | JavaScript | PHQ-9/2, GAD-7/2, C-SSRS, ASQ, PHQ-4, K6/K10, WHO-5 cutoff·scoring·safety 라우팅 스펙 |
| 3 | [techmsi/mental-health-app](https://github.com/techmsi/mental-health-app) | 13 | 2023-01-05 | MIT | JS web | PHQ-9 최소 구현, 진행률 패턴 |
| 4 | [Xcept-Health/MentalChecker](https://github.com/Xcept-Health/MentalChecker) | 2 | 2026-09-11 | MIT | React+TS+Tailwind | PHQ-9+GAD-7+지역 위기자원 라우팅 UX |
| 5 | [Flaque/quirk](https://github.com/Flaque/quirk) | 2,282 | 2024-06-30 | **GPL-3.0** | TS React Native | RN CBT 세션 UX. **코드 복사 불가, 아키텍처 참고만** |
| 6 | [suicidesafetyplan/safetyplan-ios](https://github.com/suicidesafetyplan/safetyplan-ios) | 26 | 2026-07-20 | MIT | Swift | Stanley–Brown 안전계획 6단계 데이터 모델 |
| 7 | [suicidesafetyplan/safetyplan-android](https://github.com/suicidesafetyplan/safetyplan-android) | 0 | 2026-07-22 | MIT | Java | 동일 |
| 8 | [harmonydata/harmony](https://github.com/harmonydata/harmony) | 67 | 2026-10-23 | MIT | Python | 척도 메타데이터/아이템뱅크·다국어 정합화 |
| 9 | [jmandel/ktc-questionnaire-starters](https://github.com/jmandel/ktc-questionnaire-starters) | 1 | 2026-06-10 | **라이선스 없음** | TypeScript | FHIR Questionnaire+LOINC 개념만 참고 |
| 10 | [crc442/phq9](https://github.com/crc442/phq9) | 1 | 2016-12-09 | MIT | JS | 최소 PHQ-9 scoring(역사적) |
| 11 | [eladzlot/madad](https://github.com/eladzlot/madad) | 0 | 2026-10-20 | MIT | JS | 임상 설문 즉시 채점·리포트 구조 |
| 12 | [CAS-SIAT-XinHai/CPsyCoun](https://github.com/CAS-SIAT-XinHai/CPsyCoun) | 260 | 2025-05-21 | CC-BY-4.0 | Python | 상담 대화 데이터/평가(결과 문구 톤 참고) |
| 13 | [haroontrailblazer/MindScope-2025](https://github.com/haroontrailblazer/MindScope-2025) | 11 | 2026-06-17 | Apache-2.0 | Python | PHQ-9/GAD-7 밴드 정의 |
| 14 | [dreamingechoes/awesome-mental-health](https://github.com/dreamingechoes/awesome-mental-health) | 3,679 | 2025-05-02 | CC0-1.0 | HTML | 리소스 큐레이션/카피 |
| 15 | [ifmeorg/ifme](https://github.com/ifmeorg/ifme) | 1,650 | 2026-11-01 | **AGPL-3.0** | Ruby | 피어서포트 UX. **회피 권장** |

- **직접 이식 가능(MIT)**: psytools 코드(스코어링 엔진·검증·스키마), clinical-toolkit 규칙표 스펙, safetyplan 데이터 모델.
- **주의**: psytools는 코드만 MIT, 문항 텍스트는 기기별 라이선스.
- **복사 금지**: GPL(quirk), AGPL(ifme), 라이선스 부재, 출처 불명 0-star 앱.
- **불필요**: mental-health 대화 데이터셋은 라이선스 불명확·임상 선별과 무관.

## 3. 한국 서비스 패턴

| 서비스 | 특징 | 배울 점 | 베끼면 안 되는 것 |
|---|---|---|---|
| 국가정신건강정보포털/국립정신건강센터 | 1차(위험영역)+2차(정밀) 2단계 자가검진. PHQ-9을 국가건강검진과 동일 도구로 사용 | stepped screening, 생활어 톤, "검진≠진단" | **문항·결과 문구 복제 금지**("2차 배포 금지") |
| 트로스트 | 21문항/5분, 참여자 수·후기, 4단계 밴드, 결과 후 상담사·커뮤니티 연결, FAQ 반복 | 결과→다음행동 CTA, 비난 없는 밴드 명명, 소요시간 사전 고지 | 자체 21문항 점수 체계 복제 |
| 블루터치(서울시) | 10종 자가검진, 성별·출생연도 수집 후 거주지 정신건강복지센터 연계 | **결과→지역 기관 연계** 라우팅 | 개인정보 수집·보관(no-backend에는 불필요) |
| 마인들링 | 주 1회 우울·불안 체크→맞춤 코스, 면책을 앱 설명 최상단 | 반복 측정→추이, 면책 위치 | 유료 코스 |
| 마인드링크 | 광주 청년 특화, 자가검진→상담신청→전문가 심층상담 | 신청서→실제 상담 연결 퍼널 | 오프라인 센터 모델 |
| 자살예방 상담 109 | 2024-01-01 통합, 24시간 전화+SNS(마들랜), 112 출동·센터 연계 | crisis 1번 버튼 109, "전화가 부담되면 문자" | 숫자 임의 변경 |
| 위(Wee)/학교 | 생애주기별 자가검진, 교사·학부모 안내 분리 | 연령대별 문구 분기 | — |

**채택 권장 UX 패턴**
1. 시작 전 3줄 안내: 소요시간 / 저장 여부 / "진단 아님".
2. 한 화면 한 문항, 큰 터치 타깃, 즉시 다음.
3. 진행률 + "여기서 멈추고 나중에"(resumable).
4. 결과는 점수보다 다음 행동: ①지금 위험하면 109 ②2주 지속 시 센터/정신과 ③자가관리.
5. 위기 안내는 결과 하단이 아니라 **별도 화면/모달**. 위기 신호 시 결과보다 crisis 먼저.
6. 자살 방법·수단 묘사 금지.

## 4. 권장 아키텍처 (no backend, offline-first)

```
app/ (expo-router)
  _layout.js            Stack + crisis modal route
  index.js              인트로 + consent gate + "이어서 하기"
  check/[step].js       동적 1문항 화면 (instrument registry 기반)
  result.js             결과(밴드+다음행동) — 계산 금지, 표시만
  crisis.js             crisis modal
  resources.js          지역 자원/안전계획
lib/
  instruments/          index.js, phq2.js, phq9.js, gad2.js, gad7.js, asq.js
  scoring/engine.js     score(instrument, responses) → {total, band, flags}
  scoring/bands.js      밴드 경계 + 근거 메타
  risk/routing.js       선언적 규칙 배열 → {tier, reasons[], nextRoute}
  storage/adapter.js    web=localStorage, native=AsyncStorage
  content/copy.ko.js    사용자 노출 문구 단일 소스
  content/resources.ko.js  {suicide:109, mental:1577-0199, youth:1388, emergency:119}
  a11y.js
components/ ChoiceCard, StepProgress, SeverityBadge, ResourceCard, SafetyPlan, Disclaimer, CrisisBanner
tests/ phq9.test.js gad7.test.js routing.test.js storage.test.js
bin/ validate-instruments.js
```

### 데이터 모델 (기기 내 단일 객체, PII 0)
```js
// key: "maeumcheck:v1:session"
{
  schemaVersion: 1,
  consent: { acceptedAt, scope: "local-only", version: "c1" },
  locale: "ko-KR",
  runs: [{
    runId, instrument: "phq9", instrumentVersion: "PHQ-9/ko@2026-01",
    contentHash, startedAt, completedAt,
    responses: [{ itemId, value, at }],
    score: { total: 14, band: "moderate", cutoffSource: "..." },
    flags: { item9Positive, asqAcute, asqPositive }
  }],
  draft: { instrument, responses, updatedAt }
}
```
- 저장 opt-in, 기본은 메모리만.
- 삭제 UI 1탭.
- 이름/전화/생년월일 수집 안 함.

### 스코어링
```js
export const phq9 = {
  id: 'phq9', version: 'PHQ-9/ko@2026-01', locale: 'ko-KR',
  timeframe: '지난 2주',
  options: [
    {value:0,label:'전혀 없었다'}, {value:1,label:'며칠 동안'},
    {value:2,label:'2주 중 절반 이상'}, {value:3,label:'거의 매일'},
  ],
  items: [ /* id, order, text, riskFlag */ ],
  scoring: {
    type: 'sum', max: 27,
    bands: [
      {max:4,id:'minimal',label:'낮은 수준'},
      {max:9,id:'mild',label:'가벼운 수준'},
      {max:14,id:'moderate',label:'중간 수준'},
      {max:19,id:'moderately_severe',label:'중간 이상'},
      {max:27,id:'severe',label:'높은 수준'},
    ],
    cutoffNote: 'bands.use=10;bands.generalPopulation=5',
  },
};
```
`engine.js`는 `sum | weighted | count-positive(ASQ)` 3가지만. **가중치 개념 폐기.**

### 위험 라우팅 규칙
```js
export const RULES = [
  { id:'R1', when: r => r.asq?.q5 === true,
    tier:'acute', route:'/crisis', reason:'현재 자살 생각 있음' },
  { id:'R2', when: r => r.asq?.anyPositive === true,
    tier:'urgent', route:'/crisis', reason:'자살위험 선별 양성' },
  { id:'R3', when: r => r.phq9?.item9 > 0,
    tier:'elevated', route:'/check/asq', reason:'문항9 양성 → ASQ 확인' },
  { id:'R4', when: r => r.phq9?.total >= 20,
    tier:'urgent', route:'/result', reason:'높은 수준' },
  { id:'R5', when: r => r.gad7?.total >= 15,
    tier:'elevated', route:'/result', reason:'불안 높음' },
  { id:'R6', when: r => r.phq9?.total >= 10,
    tier:'elevated', route:'/result', reason:'중간 이상' },
  { id:'R7', when: () => true, tier:'low', route:'/result', reason:'낮은 수준' },
];
```
핵심: **위기 신호는 결과 화면을 덮어쓴다.**

### Stepped flow
```
[인트로/동의]
  └ PHQ-2 (2문항)
       ├ 0~1 → GAD-2 (2문항) → 종료(저위험) 또는 자가관리   ← 4문항
       └ ≥2 → PHQ-9 (9문항)
                ├ item9=0 & total<10 → GAD-2 → (≥3이면 GAD-7)
                └ item9>0 → ASQ (4+Q5)
                              └ Q5=예 → /crisis (결과 생략)
```
- 중단·재개(draft).
- 뒤로가기 수정 허용, 하위 응답 유지·재계산.
- PHQ-2/GAD-2는 "빠른 확인" 라벨.

## 5. 파일별 변경표

| 파일 | 조치 | 내용 |
|---|---|---|
| `data/questionnaire.js` | **삭제** | 50문항·가중치·`analyzeDSM`·`getSubtypeIndicators` 폐기, `lib/instruments/*`로 대체 |
| `bin/generate-questions.js`, `bin/simulate-questions.js`, `bin/depression-assessment-v3.js`, `templates/`, `SKILL.md` | **삭제** | AI 문항 생성/시뮬레이션 데모 경로. 근거 없는 문항 생성 온상 |
| `bin/validate-questionnaire.js` | **교체** → `bin/validate-instruments.js` | 문자열 includes → 스키마 검증(id 유일성, 옵션 연속, band 단조, max 일치, riskFlag, contentHash, 한국어) |
| `app/index.js` | 재작성 | 중립 명칭, 3줄 안내, 동의, 이어서 하기, 109 상시 링크 |
| `app/survey.js` | 교체 → `app/check/[step].js` | 도메인/핵심 배지 제거, 1문항/1화면, radio role, 자동 진행 |
| `app/result.js` | 재작성 | 퍼센트 링·likelyMDD·10도메인 바 제거, 총점+밴드+CTA 3개+면책 |
| `app/crisis.js` | 신규 | modal, 109/119/1577-0199/1388, 안전계획 링크 |
| `app/resources.js` | 신규 | Stanley–Brown 6단계 안전계획, 지역 센터 안내 |
| `app/_layout.js` | 수정 | crisis/resources 등록, 헤더 중립화 |
| `app.json` | 수정 | name/slug/scheme, web output static, manifest/theme |
| `LICENSE` | 교체 | 자체 라이선스 + `THIRD_PARTY_NOTICES.md` |
| `README.md` | 재작성 | 근거·출처·cutoff·한계·응급·면책 |
| `tests/` | 신규 | `node --test` |
| `public/manifest.json` | 신규 | PWA |

## 6. Expo/RN Web 구현 포인트

- **저장**: `expo-secure-store` 웹 미지원 → web `localStorage`(try/catch), native `AsyncStorage`. 버전 프리픽스, 마이그레이션 1개. localStorage XSS 대비 CSP(`script-src 'self'`), 외부 스크립트 0, `dangerouslySetInnerHTML` 금지.
- **Offline-first/PWA**: `expo export --platform web`, `output:"static"`. 폰트 셀프호스트 subset. SW는 정적 자산만 precache, 응답 데이터 캐시 금지.
- **딥링크**: `Linking.openURL('tel:109')`, 웹 `<a href="tel:109">`. `sms:`는 기기별 차이 → tel 우선.
- **접근성**: `accessibilityRole="radio"`, `accessibilityState`, radiogroup, `announceForAccessibility`, aria-live, 48dp, 17sp, `maxFontSizeMultiplier`, 색만으로 심각도 표현 금지, 대비 4.5:1, reduce motion.
- **한국어 타이포**: `wordBreak:'keep-all'`, `lineHeight:1.6~1.7`, `textAlign:'left'`, Pretendard/system 스택, fontWeight 400/700만.
- **Analytics-free**: `console.log(responses)` 금지, 네트워크 요청 0 CI 검증, 크래시 리포팅 미도입.
- **테스트**: `node --test`. 밴드 경계, 라우팅 우선순위(R1이 결과보다 먼저), ASQ 미응답 안전 기본값, 스키마 검증, 금지어 스냅샷.

## 7. 라이선스·규제

| 척도 | 원문 | 한국어 | 권고 |
|---|---|---|---|
| PHQ-9/PHQ-2 | 퍼블릭 도메인(영문) | 한국어판 별도 저작물. 국가건강검진판 저작권자 별도, 포털 "2차 배포 금지" | 권리자 서면 허락 또는 자체 번역·역번역·인지면담. 포털 텍스트 복사 금지 |
| GAD-7/GAD-2 | 퍼블릭 도메인(영문) | 한국어 타당화 논문 존재(사용 허락 아님) | PHQ-9과 동일 절차 |
| C-SSRS | 무료(지역사회/의료), 퍼블릭 도메인 아님 | 공식 한국어 번역 존재 | 자가입력 디지털은 eC-SSRS 해석 위험 → 직접 구현 자제 |
| ASQ | NIMH 무료, 한국어 PDF 공식 | 공식 한국어판 사용 가능 | **1차 자살 스크리너로 채택 권장** |
| CES-D | 한국판 학술 사용 관행, 상업 사용 확인 필요 | 재배포 허락 아님 | 초기 버전 미사용 |

**절대 금지**
1. 포털/블루터치/트로스트 문항·결과 문구 복제.
2. 트로스트 21문항 점수 체계 모방.
3. 자살 방법/수단 상세, "자살률", "충동적" 서술.
4. GPL/AGPL 코드 복사, 라이선스 없는 파일 복사.
5. "AI 진단", "DSM-5 진단" 표현(무면허 의료행위 리스크).

**규제 체크리스트**
- 의료법 제27조: 선별과 진단을 문구·UX로 분리. 결과 최상단 "선별 참고자료, 의학적 진단 아님".
- 디지털의료제품법(법 전체 2025-01-24 시행, 일부 조항은 2026-01-24 시행): 진단·치료 표방 시 디지털의료기기 규율 가능 → 웰니스/선별+전문가 연결 포지셔닝 유지.
- 개인정보보호법: 건강정보=민감정보. no-backend·무수집 최선. 저장 시 별도 동의·보유기간·삭제권.
- 만 14세 미만: 법정대리인 동의, 연령 게이트.
- 앱스토어: 자살 관련 앱은 위기 자원 링크 필수.
- 연 1회 자원 링크 검증(`lastVerified`).

## 8. 우선순위 구현 계획

| 우선순위 | 작업 | 산출물 |
|---|---|---|
| P0 | 50문항·가중치·pseudo-DSM 제거, instrument registry+engine+bands, 데모 파일 삭제 | `lib/instruments/*`, `lib/scoring/*` |
| P0 | 위험 라우팅 규칙표 + ASQ 게이트 + crisis 화면 | `lib/risk/routing.js`, `app/crisis.js` |
| P0 | 결과 페이지 재작성(밴드+CTA+면책) | `app/result.js` |
| P1 | stepped flow + resume + 뒤로가기 | `app/check/*`, `lib/storage/*` |
| P1 | 동의 게이트·저장 opt-in·기록 삭제 | `app/index.js` |
| P1 | `node --test` + `validate-instruments.js` | `tests/*` |
| P2 | 접근성·한국어 타이포 | `lib/a11y.js` |
| P2 | PWA·CSP·에셋 | `public/*`, `app.json` |
| P2 | 안전계획·지역자원 | `app/resources.js` |
| P3 | 라이선스·README·제3자 고지 | 문서 |
| P3 | 한국어판 권리자 허락/자체 타당화, 임상 자문 | 법무/연구 |

**릴리스 게이트**
- [ ] ASQ Q5 양성 시 결과 화면이 절대 먼저 렌더되지 않음(테스트 고정)
- [ ] 네트워크 요청 0
- [ ] 응답 콘솔 로그 0
- [ ] 저장 거부/프라이빗 모드 정상 동작
- [ ] 320px·200% 폰트·스크린리더 통과
- [ ] 문항 텍스트 출처·허락 문서 존재

## 9. 출처

- PHQ-9 English + permission: https://www.phqscreeners.com/images/sites/g/files/g10060481/f/201412/PHQ-9_English.pdf
- GAD-7 English + permission: https://www.phqscreeners.com/images/sites/g/files/g10060481/f/201412/GAD-7_English.pdf
- NIDA CDE PHQ-9: https://cde.nida.nih.gov/instrument/f226b1a0-897c-de2a-e040-bb89ad4338b9
- LOINC GAD-7: https://loinc.org/69737-5/panel
- Simon et al. PHQ suicide risk: https://pmc.ncbi.nlm.nih.gov/articles/PMC4993156/
- Na et al. PHQ-9 item 9: https://pubmed.ncbi.nlm.nih.gov/29477096/
- AHRQ PSNet C-SSRS: https://psnet.ahrq.gov/web-mm/multiple-missed-opportunities-suicide-risk-assessment-emergency-and-primary-care-settings
- NIMH ASQ Toolkit: https://www.nimh.nih.gov/research/research-conducted-at-nimh/asq-toolkit-materials
- ASQ Screening Tool: https://www.nimh.nih.gov/sites/default/files/documents/research/research-conducted-at-nimh/asq-toolkit-materials/asq-tool/screening-tool-asq-nimh-toolkit.pdf
- Columbia C-SSRS community/healthcare: https://cssrs.columbia.edu/the-columbia-scale-c-ssrs/cssrs-for-communities-and-healthcare/
- Columbia eC-SSRS license: https://cssrs.columbia.edu/pharmaceutical-funded-research/
- Columbia translations: https://cssrs.columbia.edu/the-columbia-scale-c-ssrs/translations/
- 안제용 등 한국어판 PHQ-9: https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001766067
- 최홍석 등 한국판 PHQ-9: https://www.kjfm.or.kr/journal/view.php?number=357
- Shin et al. PHQ-9 norms: https://link.springer.com/article/10.1186/s12888-020-02613-0
- Kim et al. PHQ-9/PHQ-2: https://www.psychiatryinvestigation.org/journal/view.php?doi=10.30773%2Fpi.2023.0100
- Lee et al. Korean GAD-7: https://doi.org/10.1111/appy.12421
- 보건복지부 109 통합: https://www.mohw.go.kr/board.es?act=view&bid=0027&list_no=1479607&mid=a10503010100
- 보건복지상담센터 109: https://www.129.go.kr/109/index.do
- 국가정신건강정보포털 자가검진: https://www.mentalhealth.go.kr/portal/mdexmnDtl/mdexmnTypeList.do
- 국립정신건강센터 SNS 자가검진: https://www.ncmh.go.kr/ncmh/board/commonView.do?bn=newsView&fno=16&menu_cd=01_04_00_01&no=4648
- 트로스트: https://trost.co.kr/test · https://trost.co.kr/test/depressive-check-program
- 블루터치: https://blutouch.net/selftest/list
- 마인들링 App Store: https://apps.apple.com/kr/app/%EB%A7%88%EC%9D%B8%EB%93%A4%EB%A7%81/id1602350521
- 마인드링크: https://www.mindlink.or.kr/
- 식약처 디지털의료제품법 고시: https://www.mfds.go.kr/brd/m_207/view.do?seq=15133
- 식약처 디지털의료·건강지원기기: https://www.mfds.go.kr/brd/m_99/view.do?seq=49654
- GitHub repos: https://github.com/urtuba/psytools, https://github.com/rhavekost/clinical-toolkit, https://github.com/techmsi/mental-health-app, https://github.com/Xcept-Health/MentalChecker, https://github.com/Flaque/quirk, https://github.com/suicidesafetyplan/safetyplan-ios, https://github.com/suicidesafetyplan/safetyplan-android, https://github.com/harmonydata/harmony, https://github.com/jmandel/ktc-questionnaire-starters, https://github.com/crc442/phq9, https://github.com/eladzlot/madad, https://github.com/CAS-SIAT-XinHai/CPsyCoun, https://github.com/haroontrailblazer/MindScope-2025, https://github.com/dreamingechoes/awesome-mental-health, https://github.com/ifmeorg/ifme

## 10. 신뢰도·열린 질문

- **높음**: PHQ-9/GAD-7 영문 허가 조항, 한국어판 별도 권리·포털 재배포 금지, 109 통합, ASQ 무료·한국어, C-SSRS/eC-SSRS 구분, PHQ-9 item 9 단독 불충분, 디지털의료제품법 시행.
- **중간**: repo 재사용성은 README/LICENSE 기준, 실제 코드 품질 미검증. Expo SDK 56/RN 0.85/React 19.2 조합은 실제 빌드 확인 필요.
- **낮음/미해결**: 한국판 PHQ-9 실제 이용 조건(서면 확인 필요, 최대 법적 변수), ASQ 앱 자가입력의 NIMH 의도 부합 여부, GAD-7 한국어판 앱 사용 허락.
- **권고 결정**: 1차 자살 스크리너는 ASQ, C-SSRS는 로드맵 제외. PHQ-9/GAD-7 한국어판은 허락 전 임시 문항 + contentHash 동결. 결과 페이지는 점수가 아니라 다음 행동 우선.
