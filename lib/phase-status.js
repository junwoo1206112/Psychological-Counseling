import fs from 'node:fs';
import path from 'node:path';
import { assessManualEvidence } from './manual-verification.js';
import { assessKoreanValidationEvidence } from './korean-validation-evidence.js';
import { assessLegalReviewEvidence } from './legal-review-evidence.js';
import { assessClinicalHandoffEvidence } from './clinical-handoff-evidence.js';
import { assessAbcExpertReviewEvidence } from './abc-expert-review-evidence.js';
import { calculateClinicalHandoffScopeFingerprint } from './clinical-handoff-scope-fingerprint.js';
import { calculateReleaseScopeFingerprint } from './release-scope-fingerprint.js';
import { CONTENT_HASHES, IMPAIRMENT_QUESTION_KO } from '../data/instruments.js';
import { hashString } from './instrument-hash.js';

export const PHASE_STATUS_SCOPE = 'SCREENING-CONNECTION-STATIC-WEB';

function evidenceStatus(label, file, command, blockers) {
  return {
    label,
    file,
    command,
    status: blockers.length === 0 ? 'PASS' : 'BLOCKED',
    blockerCount: blockers.length,
  };
}

export function buildPhaseStatus(root) {
  const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
  const scopeFingerprint = calculateReleaseScopeFingerprint(root);

  const manual = assessManualEvidence(read('docs/operations/a11y-device-evidence.md'), { scopeFingerprint });
  const validation = assessKoreanValidationEvidence(read('docs/operations/korean-validation-evidence.md'), {
    fingerprints: {
      'PHQ-9 한국어 해시': CONTENT_HASHES.phq9.ko,
      'PHQ-A 한국어 해시': CONTENT_HASHES.phqa.ko,
      'GAD-7 한국어 해시': CONTENT_HASHES.gad7.ko,
      '기능손상 한국어 해시': hashString(IMPAIRMENT_QUESTION_KO.text),
    },
  });
  const legal = assessLegalReviewEvidence(read('docs/operations/legal-review-evidence.md'), { scopeFingerprint });
  const clinical = assessClinicalHandoffEvidence(read('docs/operations/clinical-handoff-evidence.md'), {
    scopeFingerprint: calculateClinicalHandoffScopeFingerprint(root),
  });
  const abc = assessAbcExpertReviewEvidence(read('docs/operations/abc-expert-review.md'), { scopeFingerprint });

  return {
    scopeFingerprint,
    scope: PHASE_STATUS_SCOPE,
    phases: [
      {
        phase: 'Phase 0',
        label: '공식 자원·기기 기반',
        file: 'docs/operations/resource-verification-2026-11-06.md',
        command: 'npm.cmd run resources:check / manual:check',
        status: 'CHECK',
        blockerCount: null,
      },
      { phase: 'Phase 1', ...evidenceStatus('임상 후속연결 운영', 'docs/operations/clinical-handoff-evidence.md', 'npm.cmd run clinical:handoff:check', clinical.blockers) },
      { phase: 'Phase 2', ...evidenceStatus('독립 A/B/C 검토', 'docs/operations/abc-expert-review.md', 'npm.cmd run abc:packet / abc:evidence:check', abc.blockers) },
      { phase: 'Phase 3', ...evidenceStatus('수동 접근성·실기기', 'docs/operations/a11y-device-evidence.md', 'npm.cmd run manual:packet / manual:check', manual.blockers) },
      { phase: 'Phase 4', ...evidenceStatus('한국어 타당화', 'docs/operations/korean-validation-evidence.md', 'npm.cmd run validation:evidence:check', validation.blockers) },
      { phase: 'Phase 5', ...evidenceStatus('법무·규제', 'docs/operations/legal-review-evidence.md', 'npm.cmd run legal:evidence:check', legal.blockers) },
      {
        phase: 'Phase 6',
        label: '배포 후보·릴리스',
        file: 'docs/operations/atomic-static-deployment.md',
        command: 'npm.cmd run deploy:packet / release:ready',
        status: 'CHECK',
        blockerCount: null,
      },
    ],
  };
}

export function formatPhaseStatus(result) {
  const lines = [
    '페이즈 상태 요약',
    '',
    `배포 후보 범위 해시: ${result.scopeFingerprint}`,
    `범위: ${result.scope}`,
    '',
  ];
  for (const phase of result.phases) {
    const suffix = phase.blockerCount === null ? '' : ` (${phase.blockerCount}건 차단)`;
    lines.push(`${phase.phase} — ${phase.label}: ${phase.status}${suffix}`);
    lines.push(`  확인: ${phase.command}`);
  }
  lines.push(
    '',
    '이 요약은 증빙·승인이 아닙니다.',
    '상세 차단 사유는 npm.cmd run release:ready로 확인하세요.',
  );
  return lines.join('\n');
}
