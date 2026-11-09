import test from 'node:test';
import assert from 'node:assert/strict';
import { auditStorageBoundaries } from '../lib/storage-boundary-audit.js';

const expectedFiles = [
  { path: 'lib/consent-session.js', content: "const key = 'maeumcheck:v1:screening-consent'; window.sessionStorage.setItem(key, '{}');" },
  { path: 'lib/assessment-session.js', content: "const key = 'maeumcheck:v1:last-result'; window.sessionStorage.setItem(key, '{}');" },
  { path: 'lib/storage/adapter.js', content: "const key = 'maeumcheck:v1:history'; window.localStorage.setItem(key, '{}');" },
  { path: 'lib/storage/safety-plan.js', content: "const key = 'maeumcheck:v1:safety-plan'; window.localStorage.setItem(key, '{}');" },
];

test('선언된 네 저장 writer와 키만 허용한다', () => {
  assert.deepEqual(auditStorageBoundaries(expectedFiles), []);
});

test('선언되지 않은 저장 writer와 저장 키 변경을 차단한다', () => {
  const undeclared = auditStorageBoundaries([...expectedFiles, { path: 'app/survey.js', content: "localStorage.setItem('answers', '{}')" }]);
  assert.match(undeclared.join('\n'), /선언되지 않은 브라우저 저장소 쓰기/);
  const wrongKey = auditStorageBoundaries(expectedFiles.map((file) => (
    file.path === 'lib/assessment-session.js' ? { ...file, content: "window.sessionStorage.setItem('other', '{}')" } : file
  )));
  assert.match(wrongKey.join('\n'), /선언된 저장 키가 없습니다/);
});
