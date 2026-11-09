#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
let failed = 0;

function check(name, condition, detail = '') {
  if (condition) {
    console.log(`PASS  ${name}`);
  } else {
    failed += 1;
    console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

console.log('\n검증: Ouroboros 인터뷰 스킬 적용 상태\n');

const skillPath = '.opencode/skills/ouroboros-interview/SKILL.md';
check('스킬 SKILL.md 존재', exists(skillPath));
if (exists(skillPath)) {
  const skill = read(skillPath);
  check('스킬 이름이 폴더와 일치', skill.includes('name: ouroboros-interview'));
  check('Path C(로컬 A/B/C) 정의', skill.includes('Path C: Local A/B/C Expert Mode'));
  check('Phase 1~6 정의', ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5', 'Phase 6'].every((phase) => skill.includes(phase)));
}
check('스크리너 프롬프트 참조 존재', exists('.opencode/skills/ouroboros-interview/references/socratic-interviewer.md'));
check('Seed-closer 참조 존재', exists('.opencode/skills/ouroboros-interview/references/seed-closer.md'));
check('프로젝트 명령 존재', exists('.opencode/command/ouroboros-interview.md'));
check('Seed 기록 존재', exists('docs/ouroboros/seed.md'));
check('Phase 로그 존재', exists('docs/ouroboros/phase-log.md'));
check('AGENTS.md 워크플로 안내', exists('AGENTS.md') && read('AGENTS.md').includes('Ouroboros 인터뷰 워크플로'));

if (exists('opencode.json')) {
  try {
    const config = JSON.parse(read('opencode.json'));
    check('opencode.json 스키마 선언', Boolean(config.$schema));
    check('프로젝트 스킬 경로 등록', Array.isArray(config.skills?.paths) && config.skills.paths.includes('.opencode/skills'));
  } catch (error) {
    check('opencode.json 파싱', false, error.message);
  }
} else {
  check('opencode.json 존재', false);
}

if (failed > 0) {
  console.error(`\nOuroboros 스킬 검증 실패: ${failed}개\n`);
  process.exit(1);
}

console.log('\nOuroboros 인터뷰 스킬 적용 상태 정상\n');
