import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEPLOYMENT_VERIFICATION_SECTIONS,
  buildDeploymentVerificationPacket,
} from '../lib/deployment-verification-packet.js';

test('배포 패킷은 범위 해시·자동 게이트·TLS/CSP·PWA·롤백 항목을 포함한다', () => {
  const packet = buildDeploymentVerificationPacket('scope-hash');
  assert.match(packet, /배포 후보 범위 해시: scope-hash/);
  for (const section of DEPLOYMENT_VERIFICATION_SECTIONS) {
    assert.match(packet, new RegExp(section.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  for (const term of ['npm run release:ready', 'TLS', 'CSP', 'PWA', '롤백', 'iOS', 'Android']) {
    assert.match(packet, new RegExp(term));
  }
  assert.match(packet, /증빙·배포 승인·접근성\/법무\/임상 검토가 아닙니다/);
  assert.match(packet, /release:ready는 계속 BLOCKED/);
});

test('배포 패킷은 범위 해시 없이 생성하지 않는다', () => {
  assert.throws(() => buildDeploymentVerificationPacket(''), TypeError);
  assert.throws(() => buildDeploymentVerificationPacket(null), TypeError);
});
