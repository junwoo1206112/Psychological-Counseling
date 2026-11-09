export const STORAGE_WRITERS = Object.freeze([
  { path: 'lib/consent-session.js', storage: 'sessionStorage', key: 'maeumcheck:v1:screening-consent', retention: '탭 종료 시 삭제', fields: '동의 여부와 연령대만' },
  { path: 'lib/assessment-session.js', storage: 'sessionStorage', key: 'maeumcheck:v1:last-result', retention: '탭 종료 시 삭제', fields: '척도별 점수·밴드·위험 요약만' },
  { path: 'lib/storage/adapter.js', storage: 'localStorage', key: 'maeumcheck:v1:history', retention: '사용자가 삭제할 때까지', fields: '추이용 점수·밴드·위험 요약만' },
  { path: 'lib/storage/safety-plan.js', storage: 'localStorage', key: 'maeumcheck:v1:safety-plan', retention: '사용자가 삭제할 때까지', fields: '사용자가 선택해 입력한 안전 계획 메모만' },
]);

export const STORAGE_AUDIT_EXCLUDED_FILES = Object.freeze(['lib/storage-boundary-audit.js']);

export function auditStorageBoundaries(files) {
  const violations = [];
  const expectedPaths = new Set(STORAGE_WRITERS.map((writer) => writer.path));

  for (const file of files) {
    if (/\.setItem\s*\(/.test(file.content) && !expectedPaths.has(file.path)) {
      violations.push(`${file.path}: 선언되지 않은 브라우저 저장소 쓰기`);
    }
  }

  for (const writer of STORAGE_WRITERS) {
    const file = files.find((candidate) => candidate.path === writer.path);
    if (!file) {
      violations.push(`${writer.path}: 선언된 저장 writer 파일이 없습니다.`);
      continue;
    }
    if (!file.content.includes(writer.key)) violations.push(`${writer.path}: 선언된 저장 키가 없습니다.`);
    if (!file.content.includes(writer.storage)) violations.push(`${writer.path}: 선언된 ${writer.storage} 경계가 없습니다.`);
  }
  return violations;
}
