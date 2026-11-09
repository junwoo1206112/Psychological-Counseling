# 정적 웹 CSP 배포 경계

Nginx는 모든 응답에 CSP를 보낸다. 스크립트·연결·워커·매니페스트·폰트·미디어는 동일 출처로 제한한다. 외부 프레임 삽입, 객체 삽입, 외부 폼 제출을 차단한다. HTTPS 강제는 실제 TLS 리스너와 인증서가 설치·검증된 배포 단계에서 별도로 적용한다.

이 앱은 iframe 임베드를 제공하지 않는다. 위기 버튼과 선별 화면이 다른 문서의 오버레이·클릭재킹 문맥에서 표시되지 않도록 `X-Frame-Options: DENY`와 `frame-ancestors 'none'`을 함께 보낸다. 이는 사용자가 직접 여는 전화·공식 자원 링크나 PWA 설치에는 영향을 주지 않는다.

앱 고유의 서비스 워커 등록·skip link 보조 코드는 `public/bootstrap.js`, 전역 접근성 CSS는 `public/global.css`로 분리했다. Expo Router 정적 출력은 hydration 플래그를 인라인 스크립트로 생성하므로 해당 정확한 코드의 SHA-256만 `script-src`에 허용한다. React Native Web이 생성하는 인라인 스타일 때문에 `style-src 'unsafe-inline'`은 남아 있으며, 스크립트에는 이를 허용하지 않는다.

`npm.cmd run security:check`은 CSP 필수 지시어, 앱 고유 인라인 주입 제거, 정적 자산 연결을 검사한다. `npm.cmd run security:build:check`은 `build:web` 뒤 실제 `dist/index.html`의 유일한 Expo hydration inline script SHA-256을 계산해 Nginx CSP와 대조하고, 예상 밖 inline script·앱 JS 번들 누락·필수 정적 자산 누락을 실패시킨다. Expo 58 이상에서 커스텀 `app/+html.js`는 `useServerDocumentContext()`의 `headNodes`/`bodyNodes`를 반드시 렌더해야 하며, 누락하면 정적 HTML에 앱 번들이 빠져 화면은 보이지만 상호작용이 동작하지 않는다. Expo를 업데이트하거나 HTML 출력이 달라지면 이 검사를 먼저 통과시킨 뒤, 실제 후보 서버에서 CSP 위반·위기 동선·PWA 설치를 수동으로 확인해야 한다.
