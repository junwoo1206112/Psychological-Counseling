#!/usr/bin/env node
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { contrastRatio, roundContrast, meetsAA } from '../lib/a11y.js';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

let failed = 0;

function read(relativePath) {
  return fs.readFileSync(`${ROOT}${relativePath}`, 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(`${ROOT}${relativePath}`);
}

function check(name, condition, detail = '') {
  if (condition) {
    console.log(`PASS  ${name}`);
  } else {
    failed += 1;
    console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('\n접근성 자동 감사 (정적 규칙 + 색상 대비)\n');

const html = read('app/+html.js');
const globalCss = read('public/global.css');
const bootstrap = read('public/bootstrap.js');
check('html lang="ko"', html.includes('lang="ko"'));
check('focus-visible 스타일', globalCss.includes('focus-visible'));
check('reduced-motion 대응', globalCss.includes('prefers-reduced-motion'));
check('forced-colors 대응', globalCss.includes('forced-colors'));
check('skip link 제공', html.includes('skip-link'));
check('manifest 연결', html.includes('manifest.json'));
check('service worker 등록', bootstrap.includes("navigator.serviceWorker.register('/sw.js')"));

const quickExit = read('components/QuickExit.js');
check('빠른 나가기 접근성 라벨', quickExit.includes('accessibilityLabel'));
check('빠른 나가기 최소 타겟', quickExit.includes('minHeight'));

const survey = read('app/survey.js');
check('보기 버튼 radio 역할', survey.includes('accessibilityRole="radio"'));
check('보기 버튼 선택 상태', survey.includes('accessibilityState'));
check('문항 변경 라이브 리전', survey.includes('accessibilityLiveRegion'));
check('기능손상 단계 존재', survey.includes("phase === 'impairment'"));
check('한국어/영문 문항 토글', survey.includes('showEnglish') && survey.includes('langToggle'));
check('한국어 번역 고지', survey.includes('KOREAN_TRANSLATION_NOTICE'));
check('응답 그룹 radiogroup', survey.includes('accessibilityRole="radiogroup"'));

const result = read('app/result.js');
check('결과 제목 heading 역할', result.includes('accessibilityRole="header"'));
check('저장 상태 라이브 리전', result.includes('accessibilityLiveRegion'));

for (const file of ['index', 'crisis', 'resources', 'history', 'centers']) {
  const source = read(`app/${file}.js`);
  check(`${file} 화면 제목 heading`, source.includes('accessibilityRole="header"'));
}

const index = read('app/index.js');
check('연령 선택 radio 역할', index.includes('accessibilityRole="radio"'));
check('연령 선택 상태 노출', index.includes('accessibilityState'));
check('시작 버튼 비활성 상태 노출', index.includes('disabled: !canStart'));

const instruments = read('data/instruments.js');
for (const phone of ['109', '119', '112', '1577-0199', '1388']) {
  check(`위기 자원 ${phone}`, instruments.includes(phone));
}
check('비채점 기능손상 문항', instruments.includes('IMPAIRMENT_QUESTION'));
check('기능손상 4지선다', instruments.includes('IMPAIRMENT_OPTIONS'));

const pairs = [
  ['#14213D', '#FFFFFF'],
  ['#455A64', '#FFFFFF'],
  ['#455A64', '#F7FBFA'],
  ['#546E7A', '#FFFFFF'],
  ['#2C6E63', '#FFFFFF'],
  ['#C62828', '#FFF8F8'],
  ['#2E7D32', '#E8F5E9'],
  ['#A63D00', '#FFF4F4'],
  ['#7A5C00', '#FFFFFF'],
  ['#33691E', '#FFFFFF'],
];
for (const [fg, bg] of pairs) {
  const ratio = roundContrast(contrastRatio(fg, bg));
  check(`대비 ${fg} on ${bg} (${ratio}:1)`, meetsAA(fg, bg));
}
for (const bg of ['#C62828', '#B71C1C', '#1B5E20', '#33691E', '#7A5C00', '#A63D00', '#2C6E63', '#1565C0', '#37474F']) {
  const ratio = roundContrast(contrastRatio('#FFFFFF', bg));
  check(`흰색 on ${bg} (${ratio}:1)`, meetsAA('#FFFFFF', bg));
}

check('오프라인 페이지 존재', exists('public/offline.html'));
check('오프라인 페이지 위기번호', read('public/offline.html').includes('109'));
check('service worker 파일 존재', exists('public/sw.js'));
check('manifest 파일 존재', exists('public/manifest.json'));

const manifest = JSON.parse(read('public/manifest.json'));
const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
const publicFile = (src) => `public${String(src).startsWith('/') ? '' : '/'}${src}`;
check('manifest 192 아이콘', icons.some((icon) => icon.sizes === '192x192'));
check('manifest 512 아이콘', icons.some((icon) => icon.sizes === '512x512'));
check('manifest maskable 아이콘', icons.some((icon) => String(icon.purpose).includes('maskable')));
for (const icon of icons) {
  check(`manifest 아이콘 파일 존재 ${icon.src}`, exists(publicFile(icon.src)));
}
check('apple touch icon 연결', html.includes('/icons/apple-touch-icon.png'));
check('apple touch icon 파일 존재', exists('public/icons/apple-touch-icon.png'));
check('결과 없음 가드 화면', result.includes('결과를 불러올 수 없습니다'));
check('결과 URL 파라미터 미사용', !result.includes('useLocalSearchParams'));
check('응답 URL 전달 제거', !survey.includes('data: JSON.stringify'));
check('세션 요약 저장 사용', survey.includes('saveAssessmentSummary'));
check('센터 검색 공식 URL', read('app/centers.js').includes('PotalHealthFacListTab2.do?sc3='));
check('센터 검색 무효 파라미터 제거', !read('app/centers.js').includes('searchKeyword'));

const resources = read('app/resources.js');
check('안전 계획 메모 입력 라벨', resources.includes('accessibilityLabel={field.label}'));
check('안전 계획 메모 최대 길이 제한', resources.includes('maxLength={SAFETY_PLAN_MAX_LENGTH}'));
check('안전 계획 전문가 점검 문구 유지', resources.includes('전문가와 함께 점검해 보세요'));
check('안전 계획 메모 기기 내 저장 고지', resources.includes('이 기기에만 저장되며'));
check('안전 계획 메모 전체 삭제 버튼', resources.includes('전체 삭제'));
check('안전 서약 문구 없음', !resources.includes('안전 서약'));
const crisis = read('app/crisis.js');
check('위기 화면 저장 메모 확인', crisis.includes('loadSafetyPlan'));
check('결과 화면 메모 작성 연결', result.includes('안전 계획 메모 작성하기'));
check('센터 안내 문구 통일', read('app/resources.js').includes('공식 포털의 기관 검색에서 센터 연락처'));

check('결과 화면 위험 신호 메모 노출', result.includes('result.asq.positive || result.depression.deathThoughtSignal'));
check('결과 화면 저장 메모 읽기 상자', result.includes('savedMemoBox'));
const historySource = read('app/history.js');
check('추이 차트 행 접근성 라벨', historySource.includes('accessibilityLabel={`${formatDate(entry.date)} 우울'));
check('지역 그리드 반응형 대응', read('app/centers.js').includes('useWindowDimensions'));
const sw = read('public/sw.js');
check('SW 아이콘 프리캐시', sw.includes("'/icons/icon-192.png'") && sw.includes("'/icons/icon-512.png'"));
check('SW 캐시 버전 갱신', sw.includes('maeumcheck-v3'));

if (failed > 0) {
  console.error(`\n접근성 감사 실패: ${failed}개\n`);
  process.exit(1);
}

console.log('\n접근성 자동 감사 통과\n');
