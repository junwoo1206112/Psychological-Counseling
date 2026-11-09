import fs from 'node:fs';
import path from 'node:path';
import { hashString } from './instrument-hash.js';
import { calculateReleaseScopeFingerprint } from './release-scope-fingerprint.js';

export function calculateClinicalHandoffScopeFingerprint(root) {
  const protocol = fs.readFileSync(path.join(root, 'docs/operations/clinical-handoff-protocol.md'), 'utf8');
  return hashString(`${calculateReleaseScopeFingerprint(root)}\n---clinical-handoff-protocol---\n${protocol}`);
}
