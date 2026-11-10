import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPhaseStatus, formatPhaseStatus } from '../lib/phase-status.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('페이즈 상태 요약은 Phase 0~6과 범위 해시·확인 명령을 포함한다', () => {
  const result = buildPhaseStatus(root);
  assert.equal(result.phases.length, 7);
  assert.deepEqual(result.phases.map((phase) => phase.phase), ['Phase 0', 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5', 'Phase 6']);
  assert.match(result.scopeFingerprint, /^[0-9a-f]+$/);
  const formatted = formatPhaseStatus(result);
  assert.match(formatted, /Phase 0 — 공식 자원·기기 기반: CHECK/);
  assert.match(formatted, /Phase 3 — 수동 접근성·실기기: (PASS|BLOCKED)/);
  assert.match(formatted, /npm\.cmd run manual:packet \/ manual:check/);
  assert.match(formatted, /npm\.cmd run deploy:packet \/ release:ready/);
  assert.match(formatted, /이 요약은 증빙·승인이 아닙니다/);
  assert.match(formatted, /npm\.cmd run release:ready/);
});

test('페이즈 상태는 증빙이 없으면 사람 증빙 페이즈를 BLOCKED로 표시한다', () => {
  const result = buildPhaseStatus(root);
  for (const phase of result.phases.filter((item) => ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5'].includes(item.phase))) {
    assert.equal(phase.status, 'BLOCKED');
    assert.ok(phase.blockerCount > 0);
  }
});
