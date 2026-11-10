import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('배포 후보는 라이브 dist 대신 분리 worktree에서 검증 후 current를 원자 전환한다', () => {
  const deploy = read('deploy/scripts/deploy-contabo.sh');
  const nginx = read('deploy/nginx/depression-check.conf');
  const helper = read('deploy/scripts/release-lib.sh');
  assert.match(nginx, /root __RELEASE_ROOT__\/current\/dist/);
  assert.match(deploy, /worktree add --detach/);
  assert.match(deploy, /npm run build:web/);
  assert.match(deploy, /npm run release:ready/);
  assert.match(deploy, /atomic_link "\$candidate" "\$RELEASES_DIR\/current"/);
  assert.match(helper, /flock -n 9/);
  assert.match(helper, /mv -Tf "\$temporary" "\$link"/);
  assert.equal(deploy.includes('git checkout "$BRANCH"'), false);
});

test('PWA 정적 자산은 no-cache여도 서버 보안 헤더 상속을 끊지 않는다', () => {
  const nginx = read('deploy/nginx/depression-check.conf');
  for (const asset of ['sw.js', 'manifest.json', 'offline.html']) {
    const location = nginx.match(new RegExp(`location = /${asset.replace('.', '\\.')} \\{([\\s\\S]*?)\\n    \\}`));
    assert.ok(location, asset);
    assert.match(location[1], /expires -1/);
    assert.equal(location[1].includes('add_header'), false);
  }
});

test('롤백은 릴리스 저장소의 완료된 정적 후보만 current로 전환한다', () => {
  const rollback = read('deploy/scripts/rollback-contabo.sh');
  const helper = read('deploy/scripts/release-lib.sh');
  assert.match(rollback, /TARGET_RELEASE/);
  assert.match(rollback, /assert_release_target/);
  assert.match(helper, /\.release-complete/);
  assert.match(rollback, /atomic_link "\$target" "\$RELEASES_DIR\/current"/);
});

test('Linux CI는 실제 worktree·링크를 사용하는 격리 배포 하네스를 실행한다', () => {
  const harness = read('deploy/tests/release-harness.sh');
  const workflow = read('.github/workflows/deployment-harness.yml');
  assert.match(harness, /git init --bare/);
  assert.match(harness, /worktree/);
  assert.match(harness, /gate-fail/);
  assert.match(harness, /missing-index/);
  assert.match(harness, /nginx-fail/);
  assert.match(harness, /outside-link/);
  assert.match(harness, /flock -n 9/);
  assert.match(harness, /expect_failure\(\) \{ if "\$@"; then fail/);
  assert.doesNotMatch(harness, /expect_failure\(\) \{ "\$@" && fail/);
  assert.match(workflow, /ubuntu-latest/);
  assert.match(workflow, /bash deploy\/tests\/release-harness\.sh/);
});

test('독립 A/B/C 검토 패킷은 현재 후보 해시와 비승인 경계를 제공한다', () => {
  const packet = read('bin/print-abc-review-packet.js');
  assert.match(packet, /calculateReleaseScopeFingerprint/);
  assert.match(packet, /A — 임상·심리측정/);
  assert.match(packet, /B — 위기·자살예방/);
  assert.match(packet, /C — 구현·프라이버시·법무/);
  assert.match(packet, /검토·승인·임상 평가를 의미하지 않습니다/);
});
