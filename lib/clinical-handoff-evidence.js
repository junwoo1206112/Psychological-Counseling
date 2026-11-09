import { parseEvidenceDate, selectConservativeLatest } from './evidence-date.js';

export const CLINICAL_HANDOFF_EVIDENCE_MAX_AGE_DAYS = 90;
export const CLINICAL_HANDOFF_SCOPE = 'OPTIONAL-CLINICAL-HANDOFF';
export const REQUIRED_CLINICAL_HANDOFF_STAGES = Object.freeze([
  'OWNERSHIP',
  'BSSA-TRAINING',
  'ACUITY-PATHWAY',
  'CONSENT-DATA',
  'FAILURE-INCIDENT',
  'GO-LIVE-APPROVAL',
]);

function daysBetween(from, to) {
  return Math.floor((to.getTime() - from.getTime()) / 86_400_000);
}

export function parseClinicalHandoffEvidence(markdown) {
  return String(markdown).split(/\r?\n/).filter((line) => /^\|\s*HANDOFF-/.test(line)).map((line) => {
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    return {
      id: cells[0] || '', date: cells[1] || '', reviewerRole: cells[2] || '', stage: cells[3] || '',
      scope: cells[4] || '', result: cells[5] || '', evidenceReference: cells[6] || '',
    };
  });
}

export function assessClinicalHandoffEvidence(markdown, { scopeFingerprint, referenceDate = new Date() } = {}) {
  const now = typeof referenceDate === 'string' ? parseEvidenceDate(referenceDate) : referenceDate;
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) throw new TypeError('referenceDate must be a valid Date or YYYY-MM-DD string');
  const records = parseClinicalHandoffEvidence(markdown);
  const latestByStage = new Map();
  const malformed = [];

  for (const record of records) {
    const recordDate = parseEvidenceDate(record.date);
    const idDate = record.id.match(/^HANDOFF-(\d{8})-[A-Z0-9-]+$/)?.[1];
    const normalizedIdDate = idDate && `${idDate.slice(0, 4)}-${idDate.slice(4, 6)}-${idDate.slice(6, 8)}`;
    const valid = Boolean(recordDate && normalizedIdDate === record.date && record.reviewerRole &&
      REQUIRED_CLINICAL_HANDOFF_STAGES.includes(record.stage) && record.scope === CLINICAL_HANDOFF_SCOPE &&
      ['PASS', 'FAIL'].includes(record.result) && record.evidenceReference && recordDate <= now);
    if (!valid) {
      malformed.push(record.id || '(record ID 없음)');
      continue;
    }
    const previous = latestByStage.get(record.stage);
    latestByStage.set(record.stage, selectConservativeLatest(previous, { ...record, date: recordDate }));
  }

  const blockers = [];
  for (const stage of REQUIRED_CLINICAL_HANDOFF_STAGES) {
    const record = latestByStage.get(stage);
    if (!record) blockers.push(`${stage}: 유효한 임상 후속연결 운영 기록이 없습니다.`);
    else if (daysBetween(record.date, now) < 0 || daysBetween(record.date, now) > CLINICAL_HANDOFF_EVIDENCE_MAX_AGE_DAYS) blockers.push(`${stage}: 기록일이 ${CLINICAL_HANDOFF_EVIDENCE_MAX_AGE_DAYS}일 유효기간을 벗어났습니다.`);
    else if (record.result !== 'PASS') blockers.push(`${stage}: 가장 최근 운영 검토 결과가 PASS가 아닙니다.`);
  }
  if (!scopeFingerprint || !String(markdown).includes(`- 운영 범위 해시: \`${scopeFingerprint}\``)) blockers.push('운영 범위 해시: 현재 앱·운영 프로토콜과 일치하는 증빙이 없습니다.');
  if (malformed.length > 0) blockers.push(`형식이 잘못된 기록: ${malformed.join(', ')}`);
  return { records, blockers };
}
