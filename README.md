# AI 심리상담 자가진단

Expo Router 기반의 우울 신호 자가점검 웹 앱입니다. 50개 문항으로 10개 심리 영역을 확인하고, 영역별 점수와 권장사항을 제공합니다.

> 이 프로젝트는 포트폴리오용 선별 도구이며 의료 진단을 대체하지 않습니다.

## 주요 기능

- 50문항 자가진단 플로우
- 영역별 분석: 우울 기분, 흥미 저하, 자기 평가, 절망감, 인지 기능, 수면, 신체 증상, 불안, 신체 불편감, 위험/기능
- DSM-5 주요 기준 참고 표시
- 결과 게이지와 맞춤 권장사항
- Expo Web 정적 배포 지원

## 로컬 실행

```bash
npm install
npm.cmd run web
```

PowerShell 실행 정책 때문에 `npm`이 막히면 Windows에서는 `npm.cmd`를 사용합니다.

## 정적 웹 빌드

```bash
npm.cmd run build:web
```

빌드 결과는 `dist/` 폴더에 생성됩니다.

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

## 서버 최초 세팅 예시

```bash
sudo DOMAIN=your-domain.com WWW_DOMAIN=www.your-domain.com \
  REPO_URL=https://github.com/junwoo1206112/Psychological-Counseling.git \
  bash deploy/scripts/setup-contabo.sh
```

## 재배포 예시

```bash
sudo bash deploy/scripts/deploy-contabo.sh
```
