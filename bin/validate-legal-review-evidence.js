import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculateReleaseScopeFingerprint } from '../lib/release-scope-fingerprint.js';
import { assessLegalReviewEvidence, LEGAL_EVIDENCE_MAX_AGE_DAYS } from '../lib/legal-review-evidence.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidencePath = path.join(ROOT, 'docs/operations/legal-review-evidence.md');
const { blockers } = assessLegalReviewEvidence(fs.readFileSync(evidencePath, 'utf8'), {
  scopeFingerprint: calculateReleaseScopeFingerprint(ROOT),
  referenceDate: process.env.LEGAL_EVIDENCE_CHECK_DATE || new Date(),
});

if (blockers.length > 0) {
  console.error(`법무·규제 검토 증빙: BLOCKED (유효기간 ${LEGAL_EVIDENCE_MAX_AGE_DAYS}일)`);
  for (const blocker of blockers) console.error(`- ${blocker}`);
  process.exitCode = 1;
} else {
  console.log(`법무·규제 검토 증빙: PASS (유효기간 ${LEGAL_EVIDENCE_MAX_AGE_DAYS}일)`);
}
