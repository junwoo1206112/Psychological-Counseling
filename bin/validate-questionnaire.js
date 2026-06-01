#!/usr/bin/env node
/**
 * 설문 품질 검증 도구
 * 
 * 사용법: node bin/validate-questionnaire.js [data/questionnaire.js]
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const DEFAULT_FILE = join(ROOT, 'data', 'questionnaire.js');
const target = process.argv[2] || DEFAULT_FILE;

if (!existsSync(target)) {
  console.error(`❌ 파일 없음: ${target}`);
  process.exit(1);
}

console.log(`\n🔍 검증: ${target}\n`);

// 파일 읽기
const content = readFileSync(target, 'utf-8');

// 기본 구조 검사
const checks = {
  hasDomains: content.includes('export const DOMAINS'),
  hasQuestions: content.includes('export const QUESTIONS'),
  hasOptions: content.includes('export const OPTIONS'),
  hasCalculateResults: content.includes('export function calculateResults'),
  hasGetLevel: content.includes('export function getLevel'),
  hasDomainAdvice: content.includes('export function getDomainAdvice'),
};

const allPass = Object.values(checks).every(Boolean);
const passed = Object.values(checks).filter(Boolean).length;
const total = Object.values(checks).length;

console.log(`📐 구조 검사: ${passed}/${total}`);
Object.entries(checks).forEach(([k, v]) => {
  console.log(`   ${v ? '✅' : '❌'} ${k}`);
});

if (allPass) {
  console.log(`\n✅ 모든 구조 검사 통과\n`);
} else {
  console.log(`\n❌ 일부 구조 검사 실패\n`);
  process.exit(1);
}

// DOMAINS 수 추출
const domainMatch = content.match(/export const DOMAINS\s*=\s*\[([\s\S]*?)\];/);
const questionMatch = content.match(/export const QUESTIONS\s*=\s*\[([\s\S]*?)\];/);
const optionMatch = content.match(/export const OPTIONS\s*=\s*\[([\s\S]*?)\];/);

if (domainMatch) {
  const domains = domainMatch[1].match(/\{[^}]+\}/g) || [];
  console.log(`📁 도메인: ${domains.length}개`);
}

if (questionMatch) {
  const questions = questionMatch[1].match(/\{[^}]+\}/g) || [];
  console.log(`❓ 문항: ${questions.length}개`);

  const hasSource = questionMatch[1].includes('source:');
  console.log(`📝 출처 정보: ${hasSource ? '✅ 포함됨' : '⚠️ 없음'}`);

  // 도메인별 문항 수
  const domainCount = {};
  questions.forEach((q) => {
    const m = q.match(/domain:\s*['"](\w+)['"]/);
    if (m) domainCount[m[1]] = (domainCount[m[1]] || 0) + 1;
  });
  if (Object.keys(domainCount).length > 0) {
    console.log('\n📊 도메인별 문항 분포:');
    Object.entries(domainCount).forEach(([d, c]) => {
      const bar = '█'.repeat(Math.min(c, 10));
      console.log(`   ${d}: ${bar} ${c}문항`);
    });
  }
}

if (optionMatch) {
  const options = optionMatch[1].match(/\{[^}]+\}/g) || [];
  console.log(`\n🔘 응답 옵션: ${options.length}개`);

  if (options.length < 4) {
    console.log('   ⚠️ 옵션이 4개 미만입니다 (변별력 부족)');
  }
}

console.log('\n━━━ 검증 완료 ━━━\n');
