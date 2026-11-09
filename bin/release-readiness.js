import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assessManualEvidence } from '../lib/manual-verification.js';
import { CONTENT_HASHES, IMPAIRMENT_QUESTION_KO } from '../data/instruments.js';
import { hashString } from '../lib/instrument-hash.js';
import { assessKoreanValidationEvidence } from '../lib/korean-validation-evidence.js';
import { calculateReleaseScopeFingerprint } from '../lib/release-scope-fingerprint.js';
import { assessLegalReviewEvidence } from '../lib/legal-review-evidence.js';
import { calculateClinicalHandoffScopeFingerprint } from '../lib/clinical-handoff-scope-fingerprint.js';
import { assessClinicalHandoffEvidence } from '../lib/clinical-handoff-evidence.js';
import { assessAbcExpertReviewEvidence } from '../lib/abc-expert-review-evidence.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

const checks = [
  {
    label: '한국어 타당화 게이트',
    file: 'docs/validation/korean-instrument-validation-plan.md',
    required: ['- [x] `INSTRUMENT_META`의 `translationStatus`를 `validated-ko`로 변경'],
  },
  {
    label: '법무·규제 검토 증빙',
    file: 'docs/legal-review-checklist.md',
    required: ['- [x] 법무 검토 의견서', '- [x] 임상 자문위원회 검토 기록'],
  },
  {
    label: '임상 후속연결 운영 증빙',
    file: 'docs/operations/clinical-handoff-protocol.md',
    required: [
      '- [x] 임상 운영 책임 역할이 지정되었고, 부재 시 대체 책임 역할이 지정되었다.',
      '- [x] ASQ 양성 후 BSSA를 수행할 훈련된 임상가와 가용시간이 확인되었다.',
      '- [x] 급성·비급성 양성 각각의 후속 시간 기준과 장애 시 대체 경로가 승인되었다.',
      '- [x] 데이터 전달은 명시적 동의 후에만 수행하며, 동의 거부·철회 절차가 확인되었다.',
      '- [x] 사고·연결 실패·운영 중단 시 사용자 안내와 내부 보고 절차가 확인되었다.',
    ],
  },
];

const blockers = [];
const manualEvidenceFile = 'docs/operations/a11y-device-evidence.md';
const manualEvidence = assessManualEvidence(read(manualEvidenceFile), {
  scopeFingerprint: calculateReleaseScopeFingerprint(ROOT),
});
if (manualEvidence.blockers.length > 0) {
  blockers.push({
    label: '수동 접근성·실기기 증빙 레지스트리',
    file: manualEvidenceFile,
    missing: manualEvidence.blockers.map((blocker) => `- ${blocker}`),
  });
}
const validationEvidenceFile = 'docs/operations/korean-validation-evidence.md';
const validationEvidence = assessKoreanValidationEvidence(read(validationEvidenceFile), {
  fingerprints: {
    'PHQ-9 한국어 해시': CONTENT_HASHES.phq9.ko,
    'PHQ-A 한국어 해시': CONTENT_HASHES.phqa.ko,
    'GAD-7 한국어 해시': CONTENT_HASHES.gad7.ko,
    '기능손상 한국어 해시': hashString(IMPAIRMENT_QUESTION_KO.text),
  },
});
if (validationEvidence.blockers.length > 0) {
  blockers.push({
    label: '한국어 타당화 증빙 레지스트리',
    file: validationEvidenceFile,
    missing: validationEvidence.blockers.map((blocker) => `- ${blocker}`),
  });
}
const legalEvidenceFile = 'docs/operations/legal-review-evidence.md';
const legalEvidence = assessLegalReviewEvidence(read(legalEvidenceFile), {
  scopeFingerprint: calculateReleaseScopeFingerprint(ROOT),
});
if (legalEvidence.blockers.length > 0) {
  blockers.push({
    label: '법무·규제 검토 증빙 레지스트리',
    file: legalEvidenceFile,
    missing: legalEvidence.blockers.map((blocker) => `- ${blocker}`),
  });
}
const clinicalHandoffEvidenceFile = 'docs/operations/clinical-handoff-evidence.md';
const clinicalHandoffEvidence = assessClinicalHandoffEvidence(read(clinicalHandoffEvidenceFile), {
  scopeFingerprint: calculateClinicalHandoffScopeFingerprint(ROOT),
});
if (clinicalHandoffEvidence.blockers.length > 0) {
  blockers.push({
    label: '임상 후속연결 운영 증빙 레지스트리',
    file: clinicalHandoffEvidenceFile,
    missing: clinicalHandoffEvidence.blockers.map((blocker) => `- ${blocker}`),
  });
}
const abcEvidenceFile = 'docs/operations/abc-expert-review.md';
const abcEvidence = assessAbcExpertReviewEvidence(read(abcEvidenceFile), {
  scopeFingerprint: calculateReleaseScopeFingerprint(ROOT),
});
if (abcEvidence.blockers.length > 0) blockers.push({
  label: 'A/B/C 독립 전문가 검토 증빙 레지스트리',
  file: abcEvidenceFile,
  missing: abcEvidence.blockers.map((blocker) => `- ${blocker}`),
});
for (const check of checks) {
  const source = read(check.file);
  const missing = check.required.filter((item) => !source.includes(item));
  if (missing.length > 0) blockers.push({ ...check, missing });
}

if (blockers.length > 0) {
  console.error('릴리스 준비도: BLOCKED');
  console.error('자동 검증 통과는 임상·법무·실기기 검증 완료를 뜻하지 않습니다.');
  for (const blocker of blockers) {
    console.error(`- ${blocker.label} (${blocker.file})`);
    for (const item of blocker.missing) console.error(`  ${item}`);
  }
  process.exitCode = 1;
} else {
  console.log('릴리스 준비도: PASS');
  console.log('수동 검증·타당화·법무 증빙 체크가 모두 기록되어 있습니다.');
}
