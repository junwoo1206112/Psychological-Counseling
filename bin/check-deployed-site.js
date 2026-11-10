import { checkDeployedSite } from '../lib/deployed-site-check.js';

const target = process.argv[2] || process.env.SITE_URL;

if (!target) {
  console.error('사용법: npm.cmd run deploy:smoke -- https://your-domain.example');
  console.error('또는 SITE_URL 환경 변수를 지정하세요.');
  process.exit(2);
}

const result = await checkDeployedSite(target);
console.log(`배포 후보 스모크 검사: ${result.ok ? 'PASS' : 'FAIL'}`);
console.log(`대상: ${result.baseUrl}`);
for (const check of result.checks) {
  console.log(`- ${check.ok ? 'PASS' : 'FAIL'} ${check.label}`);
  for (const failure of check.failures) console.log(`  ${failure}`);
}
console.log('');
console.log('이 검사는 실제 사람 증빙·법무/임상 승인·실기기 PWA 검증을 대체하지 않습니다.');
if (!result.ok) process.exitCode = 1;
