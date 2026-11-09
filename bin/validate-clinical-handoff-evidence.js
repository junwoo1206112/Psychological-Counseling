import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculateClinicalHandoffScopeFingerprint } from '../lib/clinical-handoff-scope-fingerprint.js';
import { assessClinicalHandoffEvidence, CLINICAL_HANDOFF_EVIDENCE_MAX_AGE_DAYS } from '../lib/clinical-handoff-evidence.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidencePath = path.join(ROOT, 'docs/operations/clinical-handoff-evidence.md');
const { blockers } = assessClinicalHandoffEvidence(fs.readFileSync(evidencePath, 'utf8'), {
  scopeFingerprint: calculateClinicalHandoffScopeFingerprint(ROOT),
  referenceDate: process.env.CLINICAL_HANDOFF_EVIDENCE_CHECK_DATE || new Date(),
});
if (blockers.length > 0) {
  console.error(`임상 후속연결 운영 증빙: BLOCKED (유효기간 ${CLINICAL_HANDOFF_EVIDENCE_MAX_AGE_DAYS}일)`);
  for (const blocker of blockers) console.error(`- ${blocker}`);
  process.exitCode = 1;
} else {
  console.log(`임상 후속연결 운영 증빙: PASS (유효기간 ${CLINICAL_HANDOFF_EVIDENCE_MAX_AGE_DAYS}일)`);
}
