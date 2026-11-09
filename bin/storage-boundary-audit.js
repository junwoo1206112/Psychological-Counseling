import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { APPLICATION_SOURCE_DIRECTORIES, PRIVACY_AUDIT_EXCLUDED_FILES } from '../lib/privacy-audit.js';
import { STORAGE_AUDIT_EXCLUDED_FILES, STORAGE_WRITERS, auditStorageBoundaries } from '../lib/storage-boundary-audit.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const excluded = new Set([...PRIVACY_AUDIT_EXCLUDED_FILES, ...STORAGE_AUDIT_EXCLUDED_FILES]);

function collectJavaScript(relativeDirectory) {
  const directory = path.join(ROOT, relativeDirectory);
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) return collectJavaScript(relativePath);
    if (!entry.isFile() || !entry.name.endsWith('.js')) return [];
    return [{ path: relativePath.replaceAll('\\', '/'), content: fs.readFileSync(path.join(ROOT, relativePath), 'utf8') }];
  });
}

const files = APPLICATION_SOURCE_DIRECTORIES.flatMap(collectJavaScript).filter((file) => !excluded.has(file.path));
const violations = auditStorageBoundaries(files);
if (violations.length > 0) {
  console.error('기기 내 저장 경계 감사: FAIL');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exitCode = 1;
} else {
  console.log(`기기 내 저장 경계 감사: PASS (${STORAGE_WRITERS.length}개 선언 writer, ${files.length}개 앱 소스 파일)`);
}
