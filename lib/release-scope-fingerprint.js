import fs from 'node:fs';
import path from 'node:path';
import { hashString } from './instrument-hash.js';

export const LEGAL_REVIEW_SCOPE_FILES = Object.freeze([
  'app/index.js',
  'app/survey.js',
  'app/result.js',
  'app/crisis.js',
  'app/resources.js',
  'app/centers.js',
  'app/history.js',
  'app/+html.js',
  'components/CrisisBanner.js',
  'components/ResourceList.js',
  'components/QuickExit.js',
  'data/instruments.js',
  'public/offline.html',
  'public/global.css',
  'public/bootstrap.js',
  'public/sw.js',
  'package.json',
]);

export function calculateReleaseScopeFingerprint(root) {
  const content = LEGAL_REVIEW_SCOPE_FILES.map((relativePath) => {
    const filePath = path.join(root, relativePath);
    return `${relativePath}\n${fs.readFileSync(filePath, 'utf8')}`;
  }).join('\n---\n');
  return hashString(content);
}
