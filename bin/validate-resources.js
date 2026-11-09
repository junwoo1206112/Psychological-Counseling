import {
  CRISIS_RESOURCES,
  RESOURCE_MAX_AGE_DAYS,
  RESOURCE_VERIFIED_AT,
  RESOURCE_VERIFICATION_METHOD,
  RESOURCE_VERIFICATION_SOURCES,
} from '../data/instruments.js';

const required = new Map([
  ['suicide', '109'],
  ['emergency', '119'],
  ['police', '112'],
  ['mental', '1577-0199'],
  ['youth', '1388'],
]);
const now = new Date(`${process.env.RESOURCE_CHECK_DATE || new Date().toISOString().slice(0, 10)}T00:00:00Z`);
const verified = new Date(`${RESOURCE_VERIFIED_AT}T00:00:00Z`);
const errors = [];

if (Number.isNaN(verified.getTime()) || !/^\d{4}-\d{2}-\d{2}$/.test(RESOURCE_VERIFIED_AT)) {
  errors.push('RESOURCE_VERIFIED_AT은 YYYY-MM-DD 형식의 유효한 날짜여야 합니다.');
}
if (!Number.isInteger(RESOURCE_MAX_AGE_DAYS) || RESOURCE_MAX_AGE_DAYS < 1) {
  errors.push('RESOURCE_MAX_AGE_DAYS는 양의 정수여야 합니다.');
}
if (RESOURCE_VERIFICATION_METHOD !== 'official-web') {
  errors.push('RESOURCE_VERIFICATION_METHOD는 현재 official-web이어야 합니다.');
}
if (errors.length === 0) {
  const ageDays = Math.floor((now - verified) / 86_400_000);
  if (ageDays < 0) errors.push('RESOURCE_VERIFIED_AT은 미래 날짜일 수 없습니다.');
  if (ageDays > RESOURCE_MAX_AGE_DAYS) errors.push(`위기 자원 검증일이 ${ageDays}일 경과했습니다(최대 ${RESOURCE_MAX_AGE_DAYS}일).`);
}

for (const [id, phone] of required) {
  const resource = CRISIS_RESOURCES.find((item) => item.id === id);
  if (!resource || resource.phone !== phone) errors.push(`${id} 자원에 ${phone} 번호가 필요합니다.`);
}
for (const resource of CRISIS_RESOURCES) {
  if (!resource.id || !resource.label || !resource.hours || !resource.description) {
    errors.push(`자원 메타데이터가 불완전합니다: ${resource.id || '(id 없음)'}`);
  }
  if (!String(resource.url || '').startsWith('https://')) errors.push(`${resource.id} 자원 URL은 HTTPS여야 합니다.`);
}
if (!Array.isArray(RESOURCE_VERIFICATION_SOURCES) || RESOURCE_VERIFICATION_SOURCES.length === 0 || RESOURCE_VERIFICATION_SOURCES.some((url) => !String(url).startsWith('https://'))) {
  errors.push('공식 자원 검증 근거 URL이 하나 이상 필요하며 모두 HTTPS여야 합니다.');
}

if (errors.length > 0) {
  console.error('위기 자원 최신성 검증: FAIL');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`위기 자원 최신성 검증: PASS (${RESOURCE_VERIFIED_AT}, ${RESOURCE_VERIFICATION_METHOD}, ${RESOURCE_MAX_AGE_DAYS}일 이내)`);
}
