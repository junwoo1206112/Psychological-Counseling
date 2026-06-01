# 배포 및 도메인 연결 가이드

이 프로젝트는 Expo Router 기반 웹 앱입니다. 현재 구조에서는 서버 없이 정적 웹사이트로 배포할 수 있고, 상담 예약/결과 저장/관리자 페이지가 필요해질 때 API 서버를 추가하는 방식이 가장 단순합니다.

## 1. 로컬 빌드 확인

```bash
npm.cmd run build:web
```

성공하면 `dist/` 폴더가 생성됩니다. 배포 서비스의 출력 폴더도 `dist`로 설정합니다.

## 2. Vercel 배포

1. GitHub에 이 프로젝트를 올립니다.
2. Vercel에서 새 프로젝트를 만들고 GitHub 저장소를 연결합니다.
3. Root Directory가 필요하면 `depression-check`로 지정합니다.
4. Build Command:

```bash
npx expo export --platform web
```

5. Output Directory:

```bash
dist
```

6. 배포 후 Vercel의 Domains 메뉴에서 보유 도메인을 추가합니다.

## 3. Cloudflare Pages 배포

1. Cloudflare Pages에서 GitHub 저장소를 연결합니다.
2. Root Directory가 필요하면 `depression-check`로 지정합니다.
3. Build Command:

```bash
npx expo export --platform web
```

4. Build Output Directory:

```bash
dist
```

5. Pages 프로젝트의 Custom domains 메뉴에서 도메인을 추가합니다.

## 4. 추천 도메인 구조

```text
example.com      -> 포트폴리오/자가진단 웹 앱
www.example.com  -> example.com으로 리다이렉트
api.example.com  -> 추후 API 서버
```

정적 웹 앱만 운영할 때는 `example.com`과 `www.example.com`만 연결하면 됩니다.

## 5. 서버 연동이 필요한 시점

현재 앱은 브라우저에서 설문과 결과 계산을 처리하므로 서버가 필수는 아닙니다. 아래 기능을 넣을 때 API 서버를 추가하세요.

- 검사 결과 저장
- 상담 예약
- 이메일 발송
- 관리자 대시보드
- 로그인
- 통계 분석

추천 구조:

```text
Frontend: Expo Web 정적 배포
Backend: Node.js/NestJS 또는 Express
Database: Supabase, Neon PostgreSQL, 또는 Firebase
Domain: api.example.com
```

정신건강 관련 응답은 민감한 정보가 될 수 있으므로 실제 사용자 데이터를 저장할 경우 개인정보 처리방침, 암호화, 보관 기간, 삭제 요청 절차를 함께 준비해야 합니다.

## 6. Contabo VPS 배포

Contabo를 사용할 경우 GitHub 저장소를 VPS에서 받아오고, Nginx로 `dist/` 폴더를 서빙하면 됩니다.

DNS는 도메인 구매처 또는 Cloudflare에서 다음처럼 설정합니다.

```text
A  @    <Contabo 서버 IPv4>
A  www  <Contabo 서버 IPv4>
```

서버 최초 세팅은 저장소를 clone한 뒤 아래 명령을 사용합니다.

```bash
sudo DOMAIN=your-domain.com WWW_DOMAIN=www.your-domain.com \
  REPO_URL=https://github.com/junwoo1206112/Psychological-Counseling.git \
  bash deploy/scripts/setup-contabo.sh
```

HTTPS 인증서는 DNS가 서버 IP를 바라본 뒤 발급합니다.

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

이후 재배포는 다음 명령만 실행하면 됩니다.

```bash
sudo bash deploy/scripts/deploy-contabo.sh
```
