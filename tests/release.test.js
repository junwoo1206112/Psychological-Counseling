import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  isAssessmentSummary,
  saveAssessmentSummary,
  loadAssessmentSummary,
  clearAssessmentSummary,
  __resetAssessmentSummaryMemory,
} from '../lib/assessment-session.js';
import {
  hasScreeningConsent,
  saveScreeningConsent,
  __resetScreeningConsentMemory,
} from '../lib/consent-session.js';
import { buildEntry } from '../lib/storage/adapter.js';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function createSummary(overrides = {}) {
  return {
    depression: {
      instrument: 'PHQ-9',
      total: 12,
      max: 27,
      band: { id: 'moderate', label: '중간 수준', color: '#7A5C00' },
      deathThoughtSignal: false,
    },
    gad7: {
      total: 9,
      max: 21,
      band: { id: 'mild', label: '가벼운 수준', color: '#33691E' },
    },
    asq: { positive: false, acute: false },
    risk: {
      tier: 'routine',
      label: '전문가 상담을 고려해 볼 수 있습니다',
      color: '#7A5C00',
      action: '2주 안에 전문가 상담을 고려하세요.',
      reasons: ['우울 또는 불안 증상이 중간 수준 이상으로 보고되었습니다.'],
      crisisFirst: false,
    },
    isYouth: false,
    impairment: 'some',
    impairmentLabel: '다소 어려움',
    ...overrides,
  };
}

function installFakeSessionStorage() {
  const store = new Map();
  globalThis.sessionStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  };
  return store;
}

function removeFakeSessionStorage() {
  delete globalThis.sessionStorage;
  __resetAssessmentSummaryMemory();
  __resetScreeningConsentMemory();
}

test('결과 요약은 점수·위험 정보만으로 유효성을 판정한다', () => {
  assert.equal(isAssessmentSummary(createSummary()), true);
  assert.equal(isAssessmentSummary(null), false);
  assert.equal(isAssessmentSummary({}), false);
  assert.equal(
    isAssessmentSummary(createSummary({ risk: { tier: 'unknown', label: 'x' } })),
    false
  );
});

test('세션 저장은 원본 응답을 저장하지 않는다', () => {
  installFakeSessionStorage();
  try {
    const result = createSummary({ phq9Answers: [3, 3, 3, 3, 3, 3, 3, 3, 3] });
    assert.equal(saveAssessmentSummary(result), true);
    const loaded = loadAssessmentSummary();
    assert.equal(loaded.risk.tier, 'routine');
    assert.equal(loaded.depression.total, 12);
    assert.equal('phq9Answers' in loaded, false);
    assert.equal('item9' in loaded.depression, false);
    assert.equal(loaded.depression.deathThoughtSignal, false);
  } finally {
    removeFakeSessionStorage();
  }
});

test('세션 저장소가 없어도 메모리로 같은 세션에서 결과를 유지한다', () => {
  removeFakeSessionStorage();
  assert.equal(saveAssessmentSummary(createSummary()), true);
  assert.equal(loadAssessmentSummary().depression.total, 12);
  clearAssessmentSummary();
  assert.equal(loadAssessmentSummary(), null);
});

test('만료·손상된 결과는 null로 처리한다', () => {
  const store = installFakeSessionStorage();
  try {
    store.set('maeumcheck:v1:last-result', '{broken');
    assert.equal(loadAssessmentSummary(), null);
    store.set('maeumcheck:v1:last-result', JSON.stringify({ schemaVersion: 1, result: {} }));
    assert.equal(loadAssessmentSummary(), null);
  } finally {
    removeFakeSessionStorage();
  }
});

test('세션 요약에서도 저장용 기록에 점수와 밴드가 유지된다', () => {
  const summary = createSummary();
  const entry = buildEntry({ ...summary, phq9: summary.depression });
  assert.equal(entry.phq9.instrument, 'PHQ-9');
  assert.equal(entry.phq9.total, 12);
  assert.equal(entry.phq9.bandLabel, '중간 수준');
  assert.equal(entry.gad7.total, 9);
  assert.equal(entry.risk.tier, 'routine');
});

test('manifest 아이콘 192/512/maskable 파일이 실제로 존재한다', () => {
  const manifest = JSON.parse(read('public/manifest.json'));
  const icons = manifest.icons || [];
  assert.ok(icons.some((icon) => icon.sizes === '192x192'));
  assert.ok(icons.some((icon) => icon.sizes === '512x512'));
  assert.ok(icons.some((icon) => String(icon.purpose).includes('maskable')));
  for (const icon of icons) {
    assert.equal(exists(`public${icon.src}`), true, icon.src);
  }
  assert.equal(exists('public/icons/apple-touch-icon.png'), true);
});

test('결과 화면은 URL 응답 파라미터를 사용하지 않고 빈 결과를 가드한다', () => {
  const result = read('app/result.js');
  const survey = read('app/survey.js');
  assert.equal(result.includes('useLocalSearchParams'), false);
  assert.match(result, /결과를 불러올 수 없습니다/);
  assert.equal(survey.includes('data: JSON.stringify'), false);
  assert.match(survey, /saveAssessmentSummary/);
  assert.match(survey, /hasScreeningConsent\(ageGroup\)/);
  assert.equal(survey.includes("params.consent === 'true'"), false);
  assert.match(survey, /router\.replace\('\/'\)/);
  assert.match(survey, /비채점/);
});

test('설문 동의는 탭 세션의 최소 연령 상태만 확인한다', () => {
  const store = installFakeSessionStorage();
  try {
    assert.equal(hasScreeningConsent('adult'), false);
    assert.equal(saveScreeningConsent('adult'), true);
    assert.equal(hasScreeningConsent('adult'), true);
    assert.equal(hasScreeningConsent('youth'), false);
    const saved = JSON.parse(store.get('maeumcheck:v1:screening-consent'));
    assert.deepEqual(saved, { schemaVersion: 1, ageGroup: 'adult' });
  } finally {
    removeFakeSessionStorage();
  }
});

test('설문 동의는 저장소가 차단되어도 현재 실행 중 메모리에서만 유지한다', () => {
  removeFakeSessionStorage();
  assert.equal(saveScreeningConsent('youth'), true);
  assert.equal(hasScreeningConsent('youth'), true);
  __resetScreeningConsentMemory();
  assert.equal(hasScreeningConsent('youth'), false);
});

test('센터 검색은 실제 동작하는 공식 포털 URL을 사용한다', () => {
  const centers = read('app/centers.js');
  assert.match(centers, /PotalHealthFacListTab2\.do\?sc3=/);
  assert.equal(centers.includes('searchKeyword'), false);
});

test('위험 신호 시 결과 화면이 저장된 안전 계획 메모를 노출한다', () => {
  const result = read('app/result.js');
  assert.match(result, /result\.asq\.positive \|\| result\.depression\.deathThoughtSignal/);
  assert.match(result, /savedMemoBox/);
  assert.match(result, /지금 안전 계획을 적어 두면/);
});

test('손상되거나 모순된 세션 결과는 거부한다', () => {
  assert.equal(isAssessmentSummary(createSummary({ depression: { ...createSummary().depression, total: -1 } })), false);
  assert.equal(isAssessmentSummary(createSummary({ asq: { positive: true, acute: true } })), false);
  assert.equal(isAssessmentSummary(createSummary({ depression: { ...createSummary().depression, deathThoughtSignal: true }, risk: { ...createSummary().risk, tier: 'low' } })), false);
  assert.equal(isAssessmentSummary(createSummary({ asq: { positive: true, acute: false }, risk: { ...createSummary().risk, tier: 'low' } })), false);
  assert.equal(isAssessmentSummary(createSummary({ risk: { ...createSummary().risk, reasons: [{ not: 'text' }] } })), false);
});

test('추이 차트 행에는 날짜·점수 접근성 라벨이 있다', () => {
  const historySource = read('app/history.js');
  assert.match(historySource, /accessibilityLabel=\{`\$\{formatDate\(entry\.date\)\} 우울/);
});

test('지역 그리드는 좁은 화면에서 2열로 확장된다', () => {
  const centers = read('app/centers.js');
  assert.match(centers, /useWindowDimensions/);
  assert.match(centers, /width < 360 \? '48%' : '30%'/);
});

test('service worker가 PWA 아이콘을 사전 캐시한다', () => {
  const sw = read('public/sw.js');
  assert.match(sw, /maeumcheck-v3/);
  for (const asset of ['/bootstrap.js', '/global.css', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-maskable-512.png', '/icons/apple-touch-icon.png']) {
    assert.ok(sw.includes(`'${asset}'`), asset);
  }
});

test('직접 통화와 외부 연결 실패는 화면별로 안내한다', () => {
  const index = read('app/index.js');
  const result = read('app/result.js');
  const centers = read('app/centers.js');
  assert.match(index, /전화 앱에서 1388을 직접 눌러 주세요/);
  assert.match(result, /전화 앱에서 1388을 직접 눌러 주세요/);
  assert.match(centers, /전화 앱에서 1577-0199를 직접 눌러 주세요/);
  assert.match(centers, /mentalhealth\.go\.kr을 직접 열어 주세요/);
});

test('배포 스크립트는 빌드 전 전체 자동 검사를 실행한다', () => {
  const deploy = read('deploy/scripts/deploy-contabo.sh');
  for (const command of ['npm run validate', 'npm run resources:check', 'npm test', 'npm run a11y', 'npm run skill:check', 'npm run build:web', 'npm run test:e2e', 'npm run release:ready']) {
    assert.ok(deploy.includes(command), `deploy/scripts/deploy-contabo.sh: ${command}`);
  }
  assert.match(read('deploy/scripts/setup-contabo.sh'), /deploy-contabo\.sh/);
});

test('배포 후보는 Playwright E2E 게이트를 통과해야 활성화된다', () => {
  const deploy = read('deploy/scripts/deploy-contabo.sh');
  assert.match(deploy, /npx playwright install/);
  assert.match(deploy, /--with-deps chromium/);
  const e2eAt = deploy.indexOf('npm run test:e2e');
  const readyAt = deploy.indexOf('npm run release:ready');
  const buildAt = deploy.indexOf('npm run build:web');
  assert.ok(buildAt > -1 && e2eAt > buildAt, 'E2E 게이트는 빌드 뒤에 실행된다');
  assert.ok(readyAt > e2eAt, 'E2E 게이트는 release:ready 전에 실행된다');
  const harness = read('deploy/tests/release-harness.sh');
  assert.match(harness, /e2e-fail/);
  assert.match(harness, /e2e did not run in candidate worktree/);
  assert.match(harness, /playwright install/);
});

test('초기 설정 스크립트는 기존 Nginx TLS 구성을 자동 덮어쓰지 않는다', () => {
  const setup = read('deploy/scripts/setup-contabo.sh');
  assert.match(setup, /FORCE_CONF_OVERWRITE/);
  assert.match(setup, /\.bak\.\$\(date -u/);
  const guardAt = setup.indexOf('FORCE_CONF_OVERWRITE');
  const cpAt = setup.indexOf('cp deploy/nginx/depression-check.conf');
  assert.ok(guardAt > -1 && cpAt > guardAt, '구성 교체는 FORCE 플래그 확인 뒤에만 수행된다');
  assert.match(setup, /keeping it to preserve certbot\/TLS edits/);
});

test('위기 자원 최신성 검사는 만료된 검증일을 배포 전에 차단한다', () => {
  const script = read('bin/validate-resources.js');
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['resources:check'], 'node bin/validate-resources.js');
  assert.match(script, /RESOURCE_MAX_AGE_DAYS/);
  assert.match(script, /RESOURCE_CHECK_DATE/);
  assert.match(script, /최대 \$\{RESOURCE_MAX_AGE_DAYS\}일/);
});

test('릴리스 준비도 검사는 수동·임상·법무 증빙을 별도 게이트로 둔다', () => {
  const script = read('bin/release-readiness.js');
  const securityAudit = read('bin/security-header-audit.js');
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['release:ready'], 'npm run resources:check && npm run privacy:check && npm run storage:check && npm run security:check && npm run security:build:check && npm run pwa:check && node bin/release-readiness.js');
  assert.equal(pkg.scripts['manual:check'], 'node bin/validate-manual-verification.js');
  assert.equal(pkg.scripts['validation:evidence:check'], 'node bin/validate-korean-validation-evidence.js');
  assert.equal(pkg.scripts['legal:evidence:check'], 'node bin/validate-legal-review-evidence.js');
  assert.equal(pkg.scripts['clinical:handoff:check'], 'node bin/validate-clinical-handoff-evidence.js');
  assert.equal(pkg.scripts['abc:evidence:check'], 'node bin/validate-abc-expert-review-evidence.js');
  assert.equal(pkg.scripts['privacy:check'], 'node bin/privacy-audit.js');
  assert.equal(pkg.scripts['storage:check'], 'node bin/storage-boundary-audit.js');
  assert.equal(pkg.scripts['security:check'], 'node bin/security-header-audit.js');
  assert.equal(pkg.scripts['security:build:check'], 'node bin/security-build-audit.js');
  assert.equal(pkg.scripts['pwa:check'], 'node bin/pwa-audit.js');
  assert.match(securityAudit, /Content-Security-Policy/);
  assert.match(securityAudit, /script-src/);
  assert.match(securityAudit, /X-Frame-Options/);
  assert.match(script, /assessManualEvidence/);
  assert.match(script, /a11y-device-evidence/);
  assert.match(script, /assessKoreanValidationEvidence/);
  assert.match(script, /korean-validation-evidence/);
  assert.match(script, /assessLegalReviewEvidence/);
  assert.match(script, /legal-review-evidence/);
  assert.match(script, /assessClinicalHandoffEvidence/);
  assert.match(script, /clinical-handoff-evidence/);
  assert.match(script, /한국어 타당화 게이트/);
  assert.match(script, /법무·규제 검토 증빙/);
  assert.match(script, /임상 후속연결 운영 증빙/);
  assert.match(script, /A\/B\/C 독립 전문가 검토 증빙/);
  assert.match(script, /abc-expert-review/);
  assert.match(script, /clinical-handoff-protocol/);
  assert.match(script, /BLOCKED/);
});

test('SDK 58 정적 HTML은 앱 JS 번들을 포함하고 커스텀 +html이 문서 노드를 렌더한다', () => {
  const audit = read('bin/security-build-audit.js');
  const html = read('app/+html.js');
  assert.match(audit, /_expo/);
  assert.match(audit, /앱 JS 번들/);
  assert.match(html, /useServerDocumentContext/);
  assert.match(html, /headNodes/);
  assert.match(html, /bodyNodes/);
});
