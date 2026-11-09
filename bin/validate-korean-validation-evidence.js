import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONTENT_HASHES, IMPAIRMENT_QUESTION_KO } from '../data/instruments.js';
import { hashString } from '../lib/instrument-hash.js';
import { assessKoreanValidationEvidence } from '../lib/korean-validation-evidence.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidencePath = path.join(ROOT, 'docs/operations/korean-validation-evidence.md');
const markdown = fs.readFileSync(evidencePath, 'utf8');
const fingerprints = {
  'PHQ-9 한국어 해시': CONTENT_HASHES.phq9.ko,
  'PHQ-A 한국어 해시': CONTENT_HASHES.phqa.ko,
  'GAD-7 한국어 해시': CONTENT_HASHES.gad7.ko,
  '기능손상 한국어 해시': hashString(IMPAIRMENT_QUESTION_KO.text),
};
const { blockers } = assessKoreanValidationEvidence(markdown, { fingerprints });

if (blockers.length > 0) {
  console.error('한국어 타당화 증빙: BLOCKED');
  for (const blocker of blockers) console.error(`- ${blocker}`);
  process.exitCode = 1;
} else {
  console.log('한국어 타당화 증빙: PASS');
}
