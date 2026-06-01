# AI 심리상담사 스킬 & CLI 가이드

이 프로젝트는 **AI 심리상담사** 역할로 웹 리서치 → 심리 문항 생성을 수행합니다.

## Skill 파일
- `SKILL.md` — AI 심리상담사 스킬 정의 (역할, 원칙, 워크플로우)
- 심리 문항 생성 시 이 파일을 먼저 참고하세요

## CLI 도구
```bash
# 웹에서 심리 척도 리서치
node bin/generate-questions.js research <url>

# 설문 분석 리포트
node bin/generate-questions.js analyze <name>

# 설문 품질 검증
node bin/generate-questions.js validate <name>

# 전체 설문 목록
node bin/generate-questions.js list

# 빈 템플릿 출력
node bin/generate-questions.js template

# 도움말
node bin/generate-questions.js help
```

## 문항 생성 워크플로우
```
STEP 1: node bin/generate-questions.js research <url>
        → 웹에서 심리 평가 도구 리서치

STEP 2: SKILL.md 참고하여 문항 설계
        → templates/questionnaire-template.js 기반

STEP 3: node bin/generate-questions.js validate <name>
        → 품질 검증 (오류/경고 확인)

STEP 4: node bin/generate-questions.js analyze <name>
        → 최종 분석 리포트
```

## 프로젝트 구조
```
depression-check/
├── SKILL.md                          # AI 심리상담사 스킬 정의
├── AGENTS.md                         # 이 파일 (CLI/스킬 가이드)
├── bin/
│   ├── generate-questions.js         # 메인 CLI 도구
│   └── validate-questionnaire.js     # 검증 도구
├── templates/
│   └── questionnaire-template.js     # 문항 생성 템플릿
├── data/
│   └── questionnaire.js              # 현재 활성 설문
└── app/
    ├── survey.js                     # 설문 화면
    └── result.js                     # 결과 화면
```
