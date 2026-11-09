import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { APPLICATION_SOURCE_DIRECTORIES, PRIVACY_AUDIT_EXCLUDED_FILES, auditApplicationSources, auditServiceWorker } from '../lib/privacy-audit.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

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

const files = APPLICATION_SOURCE_DIRECTORIES.flatMap(collectJavaScript).filter((file) => !PRIVACY_AUDIT_EXCLUDED_FILES.includes(file.path));
const violations = [...auditApplicationSources(files), ...auditServiceWorker(fs.readFileSync(path.join(ROOT, 'public/sw.js'), 'utf8'))];
if (violations.length > 0) {
  console.error('개인정보·네트워크 경계 감사: FAIL');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exitCode = 1;
} else {
  console.log(`개인정보·네트워크 경계 감사: PASS (${files.length}개 앱 소스 파일, 동일 출처 SW 캐시만 허용)`);
}
