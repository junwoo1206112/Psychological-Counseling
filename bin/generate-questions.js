#!/usr/bin/env node
/**
 * AI 심리상담사 CLI — 웹 리서치 → 문항 생성 도구
 * 
 * 사용법:
 *   node bin/generate-questions.js research <url>   # 웹에서 심리 척도 리서치
 *   node bin/generate-questions.js analyze <name>    # 기존 문항 분석 리포트
 *   node bin/generate-questions.js validate <name>   # 문항 품질 검증
 *   node bin/generate-questions.js list              # 전체 설문 목록
 *   node bin/generate-questions.js template          # 빈 템플릿 출력
 *   node bin/generate-questions.js help              # 도움말
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'data');
const TEMPLATES_DIR = join(ROOT, 'templates');

const TOOL_CATALOG = {
  'BDI-II': { name: 'Beck Depression Inventory-II', items: 21, scale: '0-3', year: 1996, author: 'Beck, Steer & Brown' },
  'HRSD': { name: 'Hamilton Depression Rating Scale', items: '17-29', scale: '0-2/0-4', year: 1960, author: 'Hamilton' },
  'MADRS': { name: 'Montgomery-Asberg Depression Rating Scale', items: 10, scale: '0-6', year: 1979, author: 'Montgomery & Asberg' },
  'HADS': { name: 'Hospital Anxiety and Depression Scale', items: 14, scale: '0-3', year: 1983, author: 'Zigmond & Snaith' },
  'CES-D': { name: 'Center for Epidemiologic Studies Depression Scale', items: 20, scale: '0-3', year: 1977, author: 'Radloff' },
  'PHQ-9': { name: 'Patient Health Questionnaire-9', items: 9, scale: '0-3', year: 2001, author: 'Kroenke & Spitzer' },
  'SDS': { name: 'Zung Self-Rating Depression Scale', items: 20, scale: '1-4', year: 1965, author: 'Zung' },
};

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0] || 'help';

  switch (cmd) {
    case 'research':
      await cmdResearch(args[1]);
      break;
    case 'analyze':
      cmdAnalyze(args[1]);
      break;
    case 'validate':
      cmdValidate(args[1]);
      break;
    case 'list':
      cmdList();
      break;
    case 'template':
      cmdTemplate();
      break;
    case 'help':
    default:
      showHelp();
  }
}

// ─── RESEARCH ────────────────────────────────────────────────────────────────

async function cmdResearch(url) {
  if (!url) {
    console.error('❌ URL을 입력하세요: node bin/generate-questions.js research <url>');
    process.exit(1);
  }

  console.log(`\n🔍 [AI 심리상담사] 웹 리서치 시작: ${url}\n`);
  console.log('📡 콘텐츠 수집 중...');

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ResearchBot/1.0)' },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const text = stripHtml(html);

    console.log(`✅ 콘텐츠 수집 완료 (${formatBytes(html.length)})\n`);
    console.log('━'.repeat(50));
    console.log('📋 [분석 결과]\n');

    const analysis = analyzeContent(text, url);

    printAnalysis(analysis);

    console.log('\n━'.repeat(50));
    console.log('\n💡 추천: 위 분석 결과를 바탕으로 questionnaire.js를 작성하세요.');
    console.log('   템플릿: node bin/generate-questions.js template\n');

  } catch (err) {
    console.error(`\n❌ 리서치 실패: ${err.message}`);
    console.log('\n   네트워크 문제이거나 URL이 올바르지 않을 수 있습니다.');
    console.log('   URL을 확인하고 다시 시도하세요.\n');
    process.exit(1);
  }
}

function printAnalysis(a) {
  console.log(`📌 출처: ${a.url}`);
  console.log(`📄 제목: ${a.title}`);
  console.log(`📏 길이: ${formatBytes(a.totalLength)}`);
  console.log('');

  // 탐지된 도구
  console.log('🔧 탐지된 평가 도구:');
  if (a.detectedTools.length > 0) {
    a.detectedTools.forEach(t => {
      const line = t.author ? `${t.name} (${t.author}, ${t.year}) - ${t.items}문항, ${t.scale}척도` : `${t.name}`;
      console.log(`   • ${line}`);
    });
  } else {
    console.log('   • 알 수 없는 도구');
  }
  console.log('');

  // 증상 후보
  console.log(`🔍 추출된 증상/문항 후보 (${a.symptomCount}개):`);
  a.symptoms.slice(0, 10).forEach((s, i) => {
    console.log(`   ${i + 1}. ${s}`);
  });
  if (a.symptomCount > 10) console.log(`   ...외 ${a.symptomCount - 10}개`);
  console.log('');

  // DSM 기준
  console.log('📋 DSM 진단 기준:');
  a.dsmCriteria.forEach(c => console.log(`   ${c}`));
  console.log('');

  // 척도 정보
  if (a.scaleInfo.length > 0) {
    console.log('📊 점수/척도 체계:');
    a.scaleInfo.forEach(s => console.log(`   • ${s}`));
  }
}

function analyzeContent(text, url) {
  const lower = text.toLowerCase();
  const lines = text.split('\n').filter(l => l.trim().length > 0);

  // 1. 심리 평가 도구 탐지
  const detectedTools = [];
  for (const [key, info] of Object.entries(TOOL_CATALOG)) {
    if (lower.includes(key.toLowerCase()) || lower.includes(info.name.toLowerCase())) {
      detectedTools.push({ key, ...info });
    }
  }

  // 2. 증상/문항 후보 추출
  const symptomCandidates = [];
  const symptomPatterns = [
    /(?:symptom|증상|feature|특성|criteria|기준|indicator|지표)[:\s]+([^.!?\n]{10,100})/gi,
    /(?:depress|우울|anxiety|불안|mood|기분|sleep|수면|appetite|식욕|fatigue|피로|concentration|집중)/gi,
  ];

  const seen = new Set();
  for (const pattern of symptomPatterns) {
    let m;
    while ((m = pattern.exec(text)) !== null) {
      const ctx = extractContext(lines, text, m.index);
      if (ctx && ctx.length > 15 && !seen.has(ctx.substring(0, 30))) {
        seen.add(ctx.substring(0, 30));
        symptomCandidates.push(ctx);
      }
    }
  }

  // 3. DSM/ICD 진단 기준 탐지
  const dsmCriteria = [];
  if (lower.includes('dsm-5') || lower.includes('dsm 5') || lower.includes('dsm5')) {
    const dsmPatterns = [
      /depressed mood|우울 기분|sadness|슬픔/gi,
      /anhedonia|loss of interest|흥미 상실|무쾌감/gi,
      /weight|appetite|체중|식욕/gi,
      /sleep|insomnia|hypersomnia|수면/gi,
      /psychomotor|agitation|retardation|정신운동/gi,
      /fatigue|energy|피로|무기력/gi,
      /worthlessness|guilt|무가치|죄책감/gi,
      /concentration|indecisiveness|집중력|결정/gi,
      /suicide|death|자살|죽음/gi,
    ];
    dsmCriteria.push('DSM-5 진단 기준 탐지됨');
    dsmPatterns.forEach((p, i) => {
      if (p.test(text)) dsmCriteria.push(`  ○ 기준 ${i + 1}: 관련 내용 발견`);
    });
  }

  // 4. 척도/점수 체계 탐지
  const scaleInfo = [];
  const scalePatterns = [
    /(\d+)[\s-]*point\s*scale/i,
    /likert/i,
    /rate[\s\w]{0,20}(0|1|2|3|4|5|6|7)/gi,
    /score[\s\w]{0,30}(\d+)[\s-]*(\d+)/gi,
    /cut[\s-]*off|임계점|cutoff/gi,
  ];
  for (const p of scalePatterns) {
    let m;
    while ((m = p.exec(text)) !== null) {
      const ctx = extractContext(lines, text, m.index);
      if (ctx) scaleInfo.push(ctx.substring(0, 120));
    }
  }

  return {
    url,
    title: extractTitle(text),
    detectedTools: detectedTools.length > 0 ? detectedTools : [{ key: '기타', name: '알 수 없는 도구' }],
    symptomCount: symptomCandidates.length,
    symptoms: symptomCandidates.slice(0, 15),
    dsmCriteria: dsmCriteria.length > 1 ? dsmCriteria : ['DSM 기준 미확인 (전문 용어 부족)'],
    scaleInfo: scaleInfo.slice(0, 5),
    totalLength: text.length,
  };
}

function extractContext(lines, text, index) {
  const start = Math.max(0, index - 60);
  const end = Math.min(text.length, index + 200);
  let ctx = text.substring(start, end).replace(/\s+/g, ' ').trim();
  // Clean up
  ctx = ctx.replace(/<[^>]+>/g, '');
  if (ctx.length > 150) ctx = ctx.substring(0, 147) + '...';
  return ctx;
}

function extractTitle(text) {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  // Take first meaningful line as title
  for (const line of lines.slice(0, 20)) {
    const clean = line.trim();
    if (clean.length > 10 && clean.length < 200 && !clean.startsWith('http')) {
      return clean;
    }
  }
  return '제목을 추출할 수 없음';
}

// ─── ANALYZE ─────────────────────────────────────────────────────────────────

function cmdAnalyze(name) {
  const file = findQuestionnaire(name);
  if (!file) {
    console.error(`❌ "${name}" 설문을 찾을 수 없습니다.`);
    console.log('   node bin/generate-questions.js list  — 전체 목록 확인\n');
    process.exit(1);
  }

  console.log(`\n📊 [분석 리포트] ${name}\n`);

  try {
    const content = readFileSync(file, 'utf-8');
    const domains = extractArray(content, 'DOMAINS');
    const questions = extractArray(content, 'QUESTIONS');
    const options = extractArray(content, 'OPTIONS');

    console.log(`📐 구조: ${domains.length}개 도메인, ${questions.length}개 문항, ${options.length}개 옵션\n`);

    if (questions.length > 0) {
      const weights = questions.map(q => q.weight || 1);
      const avgWeight = (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(2);
      console.log(`⚖️  평균 가중치: ${avgWeight} (범위: ${Math.min(...weights)}~${Math.max(...weights)})`);
      console.log(`🎯 최대 점수: ${questions.reduce((s, q) => s + (options.length - 1) * (q.weight || 1), 0).toFixed(1)}`);
    }

    if (domains.length > 0) {
      console.log('\n📁 도메인별 문항 수:');
      const counts = {};
      questions.forEach(q => { counts[q.domain] = (counts[q.domain] || 0) + 1; });
      domains.forEach(d => {
        console.log(`   ${d.icon || '•'} ${d.label}: ${counts[d.id] || 0}문항`);
      });
    }

    // 품질 점수
    const score = calculateQualityScore(domains, questions, options);
    console.log(`\n🏆 품질 점수: ${score}/100`);

  } catch (err) {
    console.error(`❌ 분석 오류: ${err.message}`);
  }
}

// ─── VALIDATE ────────────────────────────────────────────────────────────────

function cmdValidate(name) {
  const file = findQuestionnaire(name);
  if (!file) {
    console.error(`❌ "${name}" 설문을 찾을 수 없습니다.\n`);
    process.exit(1);
  }

  console.log(`\n🔎 [품질 검증] ${name}\n`);
  const content = readFileSync(file, 'utf-8');
  const domains = extractArray(content, 'DOMAINS');
  const questions = extractArray(content, 'QUESTIONS');
  const options = extractArray(content, 'OPTIONS');

  const errors = [];
  const warnings = [];
  const passes = [];

  // 검증 1: 도메인 최소 개수
  if (domains.length < 3) errors.push(`도메인이 ${domains.length}개 (최소 3개 필요)`);
  else passes.push(`도메인 ${domains.length}개 (✓)`);

  // 검증 2: 문항 최소 개수
  if (questions.length < 10) errors.push(`문항이 ${questions.length}개 (최소 10개 필요)`);
  else passes.push(`문항 ${questions.length}개 (✓)`);

  // 검증 3: 도메인 ID 일치
  const domainIds = domains.map(d => d.id);
  questions.forEach(q => {
    if (!domainIds.includes(q.domain)) {
      errors.push(`문항 Q${q.id}: "${q.domain}" 도메인이 DOMAINS에 없음`);
    }
  });

  // 검증 4: 옵션 최소 개수
  if (options.length < 4) errors.push(`옵션이 ${options.length}개 (최소 4개 필요)`);
  else passes.push(`옵션 ${options.length}개 (✓)`);

  // 검증 5: 응답 수
  if ((options.length - 1) < 3) warnings.push('응답 변별력이 낮을 수 있음 (3점 미만)');

  // 검증 6: 가중치 이상
  const weights = questions.map(q => q.weight || 1);
  const hasHighWeight = weights.some(w => w > 1.2);
  if (hasHighWeight) passes.push('가중치 차별화 적용됨 (✓)');
  else warnings.push('모든 가중치가 동일함 (변별력 개선 가능)');

  // 검증 7: 출처 정보
  const hasSource = questions.some(q => q.source);
  if (hasSource) passes.push('출처 정보 포함됨 (✓)');
  else warnings.push('출처 정보가 없음 (권장사항)');

  // 검증 8: 문항 텍스트 중복
  const texts = questions.map(q => q.text?.substring(0, 20));
  const uniqueTexts = new Set(texts);
  if (uniqueTexts.size !== texts.length) warnings.push('유사한 문항 텍스트 발견');

  // 검증 9: 더블배럴 문항
  questions.forEach(q => {
    if (q.text?.includes('그리고') || q.text?.includes('및') || q.text?.includes('/')) {
      warnings.push(`Q${q.id}: 복합 문항 가능성 ("그리고/및/" 포함)`);
    }
  });

  // 결과 출력
  console.log('✅ 통과:', passes.length);
  passes.forEach(p => console.log(`   ${p}`));

  if (warnings.length > 0) {
    console.log(`\n⚠️  경고: ${warnings.length}`);
    warnings.forEach(w => console.log(`   ${w}`));
  }

  if (errors.length > 0) {
    console.log(`\n❌ 오류: ${errors.length}`);
    errors.forEach(e => console.log(`   ${e}`));
  }

  const quality = calculateQualityScore(domains, questions, options);
  const verdict = errors.length === 0 ? (warnings.length <= 2 ? '✅ 우수' : '⚠️  양호') : '❌ 개선 필요';
  console.log(`\n📊 종합: ${quality}/100 — ${verdict}`);
}

// ─── LIST ────────────────────────────────────────────────────────────────────

function cmdList() {
  console.log('\n📚 [설문 목록]\n');

  if (!existsSync(DATA_DIR)) {
    console.log('   data/ 디렉토리가 없습니다.\n');
    return;
  }

  const files = readdirSync(DATA_DIR).filter(f => f.endsWith('.js') && !f.includes('template'));
  if (files.length === 0) {
    console.log('   등록된 설문이 없습니다.\n');
    return;
  }

  files.forEach(f => {
    const name = f.replace('.js', '');
    const size = readFileSync(join(DATA_DIR, f)).length;
    console.log(`   • ${name} (${formatBytes(size)})`);
  });

  console.log(`\n   총 ${files.length}개 설문\n`);
  console.log('   분석:   node bin/generate-questions.js analyze <name>');
  console.log('   검증:   node bin/generate-questions.js validate <name>\n');
}

// ─── TEMPLATE ────────────────────────────────────────────────────────────────

function cmdTemplate() {
  const templatePath = join(TEMPLATES_DIR, 'questionnaire-template.js');
  if (!existsSync(templatePath)) {
    console.error('❌ 템플릿 파일을 찾을 수 없습니다.');
    process.exit(1);
  }
  const content = readFileSync(templatePath, 'utf-8');
  console.log(content);
}

// ─── HELP ────────────────────────────────────────────────────────────────────

function showHelp() {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🧠 AI 심리상담사 — 문항 생성 CLI 도구
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  사용법:
    node bin/generate-questions.js <명령어> [옵션]

  명령어:
    research <url>    URL에서 심리 척도 정보 리서치
    analyze <name>    설문 구조 및 통계 분석 리포트
    validate <name>   설문 품질 검증 (오류/경고)
    list              등록된 설문 목록
    template          빈 템플릿 출력
    help              이 도움말

  예시:
    node bin/generate-questions.js research https://en.wikipedia.org/wiki/BDI
    node bin/generate-questions.js analyze questionnaire
    node bin/generate-questions.js validate questionnaire
    node bin/generate-questions.js list

  워크플로우:
    1. research  → 웹에서 심리 평가 도구 리서치
    2. template  → 템플릿을 기반으로 문항 설계
    3. validate  → 품질 검증
    4. analyze   → 최종 분석 리포트

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

// ─── UTILITIES ───────────────────────────────────────────────────────────────

function stripHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1048576).toFixed(1)}MB`;
}

function findQuestionnaire(name) {
  if (!existsSync(DATA_DIR)) return null;
  const files = readdirSync(DATA_DIR);
  const match = files.find(f => f.replace('.js', '') === name || f === name);
  return match ? join(DATA_DIR, match) : null;
}

function extractArray(content, name) {
  try {
    const regex = new RegExp(`export\\s+const\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\];`, 'm');
    const match = content.match(regex);
    if (!match) return [];

    // Parse the array content (simple extraction)
    const items = [];
    const itemRegex = /\{([^}]+)\}/g;
    let m;
    while ((m = itemRegex.exec(match[1])) !== null) {
      const obj = {};
      m[1].split(',').forEach(pair => {
        const [k, ...v] = pair.trim().split(':');
        if (k && v.length > 0) {
          const key = k.trim();
          let val = v.join(':').trim().replace(/^['"]|['"]$/g, '');
          // Try to parse numbers
          if (!isNaN(val)) val = parseFloat(val);
          obj[key] = val;
        }
      });
      if (Object.keys(obj).length > 0) items.push(obj);
    }
    return items;
  } catch { return []; }
}

function calculateQualityScore(domains, questions, options) {
  let score = 0;

  // 도메인 다양성 (최대 20점)
  score += Math.min(domains.length * 5, 20);

  // 문항 수 (최대 25점)
  if (questions.length >= 20) score += 25;
  else if (questions.length >= 15) score += 20;
  else if (questions.length >= 10) score += 15;
  else score += questions.length;

  // 옵션 다양성 (최대 15점)
  score += Math.min(options.length * 3, 15);

  // 가중치 다양성 (최대 15점)
  const weights = questions.map(q => q.weight || 1);
  const uniqueWeights = new Set(weights);
  if (uniqueWeights.size > 2) score += 15;
  else if (uniqueWeights.size > 1) score += 10;
  else score += 5;

  // 출처 정보 (최대 10점)
  if (questions.some(q => q.source)) score += 10;

  // 도메인당 균등 분배 (최대 15점)
  if (domains.length > 0) {
    const counts = {};
    questions.forEach(q => { counts[q.domain] = (counts[q.domain] || 0) + 1; });
    const values = Object.values(counts);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + (b - avg) ** 2, 0) / values.length;
    if (variance < 2) score += 15;
    else if (variance < 4) score += 10;
    else score += 5;
  }

  return Math.min(score, 100);
}

main().catch(console.error);
