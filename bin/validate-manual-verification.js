import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assessManualEvidence, MANUAL_EVIDENCE_MAX_AGE_DAYS } from '../lib/manual-verification.js';
import { calculateReleaseScopeFingerprint } from '../lib/release-scope-fingerprint.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidencePath = path.join(ROOT, 'docs/operations/a11y-device-evidence.md');
const markdown = fs.readFileSync(evidencePath, 'utf8');
const { blockers } = assessManualEvidence(markdown, {
  referenceDate: process.env.MANUAL_EVIDENCE_CHECK_DATE || new Date(),
  scopeFingerprint: calculateReleaseScopeFingerprint(ROOT),
});

if (blockers.length > 0) {
  console.error(`수동 접근성·기기 증빙: BLOCKED (유효기간 ${MANUAL_EVIDENCE_MAX_AGE_DAYS}일)`);
  for (const blocker of blockers) console.error(`- ${blocker}`);
  process.exitCode = 1;
} else {
  console.log(`수동 접근성·기기 증빙: PASS (유효기간 ${MANUAL_EVIDENCE_MAX_AGE_DAYS}일)`);
}
