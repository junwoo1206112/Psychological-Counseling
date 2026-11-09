import { parseEvidenceDate, selectConservativeLatest } from './evidence-date.js';

export const MANUAL_EVIDENCE_MAX_AGE_DAYS = 180;

export const REQUIRED_MANUAL_SCENARIOS = Object.freeze([
  'NVDA',
  'VOICEOVER',
  'TALKBACK',
  'VIEWPORT-320',
  'ZOOM-200',
  'PHONE-APP',
  'OFFLINE-CRISIS',
]);

function daysBetween(from, to) {
  return Math.floor((to.getTime() - from.getTime()) / 86_400_000);
}

export function parseManualEvidence(markdown) {
  return String(markdown)
    .split(/\r?\n/)
    .filter((line) => /^\|\s*A11Y-/.test(line))
    .map((line) => {
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim());
      return {
        id: cells[0] || '',
        date: cells[1] || '',
        reviewerRole: cells[2] || '',
        environment: cells[3] || '',
        scenario: cells[4] || '',
        result: cells[5] || '',
        issueReference: cells[6] || '',
      };
    });
}

export function assessManualEvidence(markdown, { referenceDate = new Date(), scopeFingerprint } = {}) {
  const now = typeof referenceDate === 'string' ? parseEvidenceDate(referenceDate) : referenceDate;
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
    throw new TypeError('referenceDate must be a valid Date or YYYY-MM-DD string');
  }

  const records = parseManualEvidence(markdown);
  const byScenario = new Map();
  const malformed = [];

  for (const record of records) {
    const recordDate = parseEvidenceDate(record.date);
    const idDate = record.id.match(/^A11Y-(\d{8})-[A-Z0-9-]+$/)?.[1];
    const normalizedIdDate = idDate && `${idDate.slice(0, 4)}-${idDate.slice(4, 6)}-${idDate.slice(6, 8)}`;
    const valid = Boolean(
      recordDate &&
        normalizedIdDate === record.date &&
        record.reviewerRole &&
        record.environment &&
        REQUIRED_MANUAL_SCENARIOS.includes(record.scenario) &&
        ['PASS', 'FAIL'].includes(record.result) &&
        record.issueReference && recordDate <= now
    );
    if (!valid) {
      malformed.push(record.id || '(record ID 없음)');
      continue;
    }
    const previous = byScenario.get(record.scenario);
    byScenario.set(record.scenario, selectConservativeLatest(previous, { ...record, date: recordDate }));
  }

  const blockers = [];
  for (const scenario of REQUIRED_MANUAL_SCENARIOS) {
    const record = byScenario.get(scenario);
    if (!record) {
      blockers.push(`${scenario}: 유효한 수동 검증 기록이 없습니다.`);
      continue;
    }
    const ageDays = daysBetween(record.date, now);
    if (ageDays < 0 || ageDays > MANUAL_EVIDENCE_MAX_AGE_DAYS) {
      blockers.push(`${scenario}: 기록일이 ${MANUAL_EVIDENCE_MAX_AGE_DAYS}일 유효기간을 벗어났습니다.`);
    } else if (record.result !== 'PASS') {
      blockers.push(`${scenario}: 가장 최근 검증 결과가 PASS가 아닙니다.`);
    }
  }
  if (!scopeFingerprint || !String(markdown).includes(`- 수동 검증 범위 해시: \`${scopeFingerprint}\``)) {
    blockers.push('수동 검증 범위 해시: 현재 접근성·위기 배포 범위와 일치하는 시험 기록이 없습니다.');
  }
  if (malformed.length > 0) blockers.push(`형식이 잘못된 기록: ${malformed.join(', ')}`);

  return { records, blockers };
}
