import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assessAbcExpertReviewEvidence } from '../lib/abc-expert-review-evidence.js';
import { calculateReleaseScopeFingerprint } from '../lib/release-scope-fingerprint.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'docs/operations/abc-expert-review.md');
const { blockers } = assessAbcExpertReviewEvidence(fs.readFileSync(file, 'utf8'), { scopeFingerprint: calculateReleaseScopeFingerprint(root) });
if (blockers.length) {
  console.error('A/B/C 독립 전문가 검토 증빙: BLOCKED');
  blockers.forEach((blocker) => console.error(`- ${blocker}`));
  process.exitCode = 1;
} else console.log('A/B/C 독립 전문가 검토 증빙: PASS');
