# 원자적 정적 배포·롤백 운영 경계

Nginx는 소스 checkout의 `dist/`가 아니라 `RELEASES_DIR/current/dist`만 제공합니다. 기본 `RELEASES_DIR`는 `/var/www/depression-check-releases`이며, 각 후보는 별도 Git worktree에 보존됩니다.

```text
APP_DIR                         소스 checkout (라이브 파일이 아님)
RELEASES_DIR/<release-id>/      후보 source + 검증된 dist
RELEASES_DIR/current -> ...     Nginx가 제공하는 활성 릴리스
RELEASES_DIR/previous -> ...    직전 활성 릴리스
```

`deploy-contabo.sh`는 배포 잠금을 획득한 뒤 후보에서 `npm ci`, 자동 검사, 정적 빌드와 `release:ready`를 실행합니다. 모든 검사가 통과하고 `dist/index.html`과 완료 마커가 생긴 후보만 임시 심볼릭 링크를 `current`으로 원자적 rename해 공개합니다. 실패한 후보는 남길 수 있지만 기존 `current`와 사용자 기기 내 결과·안전계획을 바꾸지 않습니다.

## Linux 모의 배포 검증

`deploy/tests/release-harness.sh`는 임시 디렉터리에서 실제 Git bare remote·worktree·`flock`·심볼릭 링크를 사용합니다. `npm`과 `nginx`만 모의로 대체해 gate 실패, 산출물 누락, Nginx 설정 검사 실패, 성공 후보 전환, 제한된 롤백, 경로 탈출과 잠금 충돌에서 기존 `current/dist/index.html`이 보존되는지 확인합니다.

GitHub Actions의 Ubuntu runner는 이 하네스와 Bash 구문 검사를 실행합니다. 로컬 Windows Git Bash에는 `flock`이 없을 수 있으므로 실제 하네스 실행은 Ubuntu CI에서 확인합니다. 예상 실패 처리는 `set -e`에서 실패 코드가 전파되지 않도록 `if` 블록으로 구현하고, `tests/deployment-script.test.js`가 잘못된 `&&` 패턴 회귀를 검사합니다.

`npm.cmd run deploy:packet`은 현재 범위 해시와 자동 게이트·GitHub Actions·TLS/헤더·PWA/실기기·롤백 확인 항목을 출력합니다. 이 출력은 실제 배포 승인·증빙이 아니며, 실제 후보 환경 결과만 이 문서와 phase 기록에 남깁니다.

`npm.cmd run deploy:smoke -- https://<후보>`는 실제 후보 URL에서 HTTPS, CSP·X-Frame-Options·nosniff·HTML no-cache, 앱 JS 번들, manifest와 아이콘 실파일(200·image/png), 서비스 워커, 오프라인 위기 링크, `/crisis` 응답, 각 응답의 HTTP 상태·Content-Type, CSP inline hydration SHA-256 일치와 `script-src 'unsafe-inline'` 부재를 읽기 전용으로 검사합니다. 또한 manifest·SW·offline·crisis 응답에도 CSP·X-Frame-Options·nosniff·Referrer-Policy·Permissions-Policy가 상속되는지 확인합니다. 이 검사는 실제 기기 PWA·기존 탭 갱신·법무/임상 승인을 대체하지 않습니다.

긴급 롤백은 다음처럼 과거의 완료된 릴리스 디렉터리 이름만 지정합니다.

```bash
sudo TARGET_RELEASE=20261106T120000Z-abcdef123456 bash deploy/scripts/rollback-contabo.sh
```

롤백은 `RELEASES_DIR` 밖의 경로, 완료 마커가 없거나 `dist/index.html`이 없는 후보를 거부합니다. 재빌드·네트워크·데이터 삭제 없이 `current`만 원자적으로 전환합니다.

## 남는 수동 확인

- 원자적 서버 전환은 열린 브라우저 탭의 이전 해시 자산이나 이미 설치된 서비스 워커를 즉시 되돌리지 않습니다. 직전 릴리스는 보존하고, 배포/롤백 후보에서 기존 탭·PWA 업데이트·오프라인 위기 안내를 실제 기기로 확인합니다.
- Nginx `current` 전환 뒤 `/crisis`, `/resources`, `/offline.html`, CSP와 위기 전화 동선은 실제 배포 환경에서 확인합니다.
- 이 절차는 수동 접근성, 한국어 타당화, 법무, 임상 운영 또는 독립 전문가 승인을 대신하지 않습니다. `release:ready`가 차단하면 후보는 공개되지 않습니다.
- 하네스의 모의 `npm`/`nginx` 통과는 실제 브라우저 렌더링, 보안 헤더 응답, 전화 앱, 서비스 워커 갱신 또는 Contabo 서버 전환 성공을 의미하지 않습니다.
