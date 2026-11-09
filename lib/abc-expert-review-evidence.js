import { parseEvidenceDate, selectConservativeLatest } from './evidence-date.js';

export const ABC_REVIEW_EVIDENCE_MAX_AGE_DAYS = 90;
export const ABC_REVIEW_SCOPE = 'SCREENING-CONNECTION-STATIC-WEB';
export const REQUIRED_ABC_REVIEW_STAGES = Object.freeze([
  'A-CLINICAL-PSYCHOMETRIC',
  'B-CRISIS-PREVENTION',
  'C-IMPLEMENTATION-LEGAL',
  'RESOLUTION-APPROVAL',
]);

function daysBetween(from, to) {
  return Math.floor((to.getTime() - from.getTime()) / 86_400_000);
}

export function assessAbcExpertReviewEvidence(markdown, { scopeFingerprint, referenceDate = new Date() } = {}) {
  const now = typeof referenceDate === 'string' ? parseEvidenceDate(referenceDate) : referenceDate;
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) throw new TypeError('referenceDate must be a valid Date or YYYY-MM-DD string');
  const records = String(markdown).split(/\r?\n/).filter((line) => /^\|\s*ABC-/.test(line)).map((line) => {
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    return { id: cells[0] || '', date: cells[1] || '', reviewerRole: cells[2] || '', stage: cells[3] || '', scope: cells[4] || '', result: cells[5] || '', evidenceReference: cells[6] || '' };
  });
  const latest = new Map();
  const malformed = [];
  for (const record of records) {
    const date = parseEvidenceDate(record.date);
    const compact = record.id.match(/^ABC-(\d{8})-[A-Z0-9-]+$/)?.[1];
    const idDate = compact && `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`;
    if (!(date && date <= now && idDate === record.date && record.reviewerRole && REQUIRED_ABC_REVIEW_STAGES.includes(record.stage) && record.scope === ABC_REVIEW_SCOPE && ['PASS', 'FAIL'].includes(record.result) && record.evidenceReference)) {
      malformed.push(record.id || '(record ID 없음)');
      continue;
    }
    latest.set(record.stage, selectConservativeLatest(latest.get(record.stage), { ...record, date }));
  }
  const blockers = [];
  for (const stage of REQUIRED_ABC_REVIEW_STAGES) {
    const record = latest.get(stage);
    if (!record) blockers.push(`${stage}: 유효한 독립 전문가 검토 기록이 없습니다.`);
    else if (daysBetween(record.date, now) > ABC_REVIEW_EVIDENCE_MAX_AGE_DAYS) blockers.push(`${stage}: 기록일이 ${ABC_REVIEW_EVIDENCE_MAX_AGE_DAYS}일 유효기간을 벗어났습니다.`);
    else if (record.result !== 'PASS') blockers.push(`${stage}: 가장 최근 독립 검토 결과가 PASS가 아닙니다.`);
  }
  if (!scopeFingerprint || !String(markdown).includes(`- 배포 후보 범위 해시: \`${scopeFingerprint}\``)) blockers.push('배포 후보 범위 해시: 현재 제품 범위와 일치하는 독립 검토 증빙이 없습니다.');
  if (malformed.length) blockers.push(`형식이 잘못된 기록: ${malformed.join(', ')}`);
  return { records, blockers };
}
