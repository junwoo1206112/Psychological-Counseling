# 기기 내 저장 경계

이 앱은 서버·분석 SDK·원본 응답 로그를 사용하지 않으며, 브라우저 저장소는 선택한 기능을 위한 최소 범위로만 사용한다.

| 모듈 | 저장소·키 | 보관 | 허용 데이터 |
|---|---|---|---|
| `lib/consent-session.js` | `sessionStorage` / `maeumcheck:v1:screening-consent` | 탭 종료 시 | 동의 여부와 연령대만 |
| `lib/assessment-session.js` | `sessionStorage` / `maeumcheck:v1:last-result` | 탭 종료 시 | 척도별 점수·밴드·위험 요약만 |
| `lib/storage/adapter.js` | `localStorage` / `maeumcheck:v1:history` | 사용자가 삭제할 때까지 | 추이용 점수·밴드·위험 요약만 |
| `lib/storage/safety-plan.js` | `localStorage` / `maeumcheck:v1:safety-plan` | 사용자가 삭제할 때까지 | 사용자가 선택해 입력한 안전 계획 메모만 |

원본 설문 답변, 전화번호·이메일·기관 전달 정보, 분석 식별자, 자동 외부 전송은 허용하지 않는다. 안전 계획 메모는 선택 기능이며 사용자가 화면에서 전체 삭제할 수 있다.

`npm.cmd run storage:check`은 앱 코드의 `.setItem()` 호출을 검사한다. 위 네 writer 밖의 쓰기, 선언된 writer 파일의 누락, 저장 키·저장소 종류 불일치는 실패한다. 검사 규칙 파일 `lib/storage-boundary-audit.js` 자체는 정책을 정의하는 비실행 파일이므로 스캔에서 명시적으로 제외한다.

`npm.cmd run test:e2e`는 정상 완료 뒤 `sessionStorage` 결과 키 집합, 저장 전 `localStorage` 부재, 저장 후 기록 필드 집합, 전체 삭제를 실제 브라우저에서 확인한다. 또한 `localStorage`·`sessionStorage` getter를 차단한 상태에서도 결과와 기록 안내가 렌더되고 메모리 fallback으로 같은 탭의 선별이 유지되는지, `localStorage.setItem`/`removeItem` 예외 시 결과·기록·안전계획 메모의 저장·삭제를 성공으로 표시하지 않고 기존 데이터를 보존하는지 확인한다. 저장한 안전계획 메모가 위기 화면에서 다시 표시되고 삭제 후 사라지는지도 검증한다. 이는 정적 코드 검사와 단위 테스트를 보완하는 런타임 회귀이며, 브라우저·기기별 저장소 암호화나 사용자 기기 침해를 검증하지 않는다.

이 검사는 브라우저·운영체제의 실제 저장소 암호화, 배포 인프라, 타사 스크립트 삽입, 법적 적법성이나 사용자가 수동으로 내보낸 정보를 검증하지 않는다. 외부 API·SDK·새 저장 writer를 추가하려면 독립 프라이버시·법무 검토와 이 문서·검사·테스트의 갱신이 필요하다.
