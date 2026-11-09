import { parseEvidenceDate, selectConservativeLatest } from './evidence-date.js';

export const KOREAN_VALIDATION_SCOPE = 'PHQ-9,PHQ-A,GAD-7,IMPAIRMENT';

export const REQUIRED_VALIDATION_STAGES = Object.freeze([
  'GOVERNANCE',
  'TRANSLATION',
  'COGNITIVE',
  'PILOT',
  'MAIN-STUDY',
  'ANALYSIS',
  'CLINICAL-APPROVAL',
  'APP-RELEASE',
]);

export function parseKoreanValidationEvidence(markdown) {
  return String(markdown)
    .split(/\r?\n/)
    .filter((line) => /^\|\s*KVAL-/.test(line))
    .map((line) => {
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim());
      return {
        id: cells[0] || '',
        date: cells[1] || '',
        stage: cells[2] || '',
        scope: cells[3] || '',
        result: cells[4] || '',
        evidenceReference: cells[5] || '',
      };
    });
}

export function assessKoreanValidationEvidence(markdown, { fingerprints = {}, referenceDate = new Date() } = {}) {
  const now = typeof referenceDate === 'string' ? parseEvidenceDate(referenceDate) : referenceDate;
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) throw new TypeError('referenceDate must be a valid Date or YYYY-MM-DD string');
  const records = parseKoreanValidationEvidence(markdown);
  const latestByStage = new Map();
  const malformed = [];

  for (const record of records) {
    const recordDate = parseEvidenceDate(record.date);
    const idDate = record.id.match(/^KVAL-(\d{8})-[A-Z0-9-]+$/)?.[1];
    const normalizedIdDate = idDate && `${idDate.slice(0, 4)}-${idDate.slice(4, 6)}-${idDate.slice(6, 8)}`;
    const valid = Boolean(
      recordDate &&
        normalizedIdDate === record.date &&
        REQUIRED_VALIDATION_STAGES.includes(record.stage) &&
        record.scope === KOREAN_VALIDATION_SCOPE &&
        ['PASS', 'FAIL'].includes(record.result) &&
        record.evidenceReference && recordDate <= now
    );
    if (!valid) {
      malformed.push(record.id || '(record ID 없음)');
      continue;
    }
    const previous = latestByStage.get(record.stage);
    latestByStage.set(record.stage, selectConservativeLatest(previous, { ...record, date: recordDate }));
  }

  const blockers = [];
  for (const stage of REQUIRED_VALIDATION_STAGES) {
    const record = latestByStage.get(stage);
    if (!record) {
      blockers.push(`${stage}: 유효한 타당화 증빙 기록이 없습니다.`);
    } else if (record.result !== 'PASS') {
      blockers.push(`${stage}: 가장 최근 타당화 결과가 PASS가 아닙니다.`);
    }
  }

  for (const [label, hash] of Object.entries(fingerprints)) {
    const marker = `- ${label}: \`${hash}\``;
    if (!String(markdown).includes(marker)) blockers.push(`${label}: 현재 문항 해시와 일치하는 증빙 범위가 없습니다.`);
  }
  if (malformed.length > 0) blockers.push(`형식이 잘못된 기록: ${malformed.join(', ')}`);

  return { records, blockers };
}
