import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 320, height: 720 } });

async function expectNoHorizontalScroll(page) {
  const metrics = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1);
  expect(metrics.bodyWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1);
}

async function expectFitsInViewport(page, locator) {
  await expect(locator).toBeVisible();
  const box = await locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x, width: rect.width, height: rect.height };
  });
  expect(box.width).toBeGreaterThan(0);
  expect(box.height).toBeGreaterThan(0);
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(320);
}

test('320px 인트로는 가로 스크롤 없이 위기 CTA와 시작 버튼을 노출한다', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '우울·자살 위험 자가 선별' })).toBeVisible();
  await expectFitsInViewport(page, page.getByLabel('109 자살예방상담전화로 연결'));
  await expectFitsInViewport(page, page.getByText('자가 선별 시작하기', { exact: true }));
  await expectNoHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('320px 설문 첫 화면은 가로 스크롤 없이 선택지를 노출한다', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByText('위 내용을 확인했고, 자가 선별에 동의합니다.').click();
  await page.getByText('만 18세 이상', { exact: true }).click();
  await page.getByText('자가 선별 시작하기').click();
  await expect(page.getByText('지금 이 확인에서 가장 먼저 받고 싶은 도움은 무엇인가요?')).toBeVisible();
  await expectFitsInViewport(page, page.getByText('건너뛰고 선별검사로 이동할게요'));
  await expectNoHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('320px 위기 화면은 가로 스크롤 없이 긴급 연락 CTA를 노출한다', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/crisis?reason=safety');
  await expect(page.getByRole('heading', { name: '지금 바로 도움을 받아 주세요.' })).toBeVisible();
  await expectFitsInViewport(page, page.getByLabel('119 응급 구급으로 연결'));
  await expectFitsInViewport(page, page.getByLabel('109 자살예방상담전화로 연결'));
  await expectNoHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('320px 자원 화면은 가로 스크롤 없이 안전계획 메모 입력을 노출한다', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/resources');
  await expect(page.getByRole('heading', { name: '도움받을 곳' }).first()).toBeVisible();
  await expectFitsInViewport(page, page.getByLabel('1단계 · 나를 힘들게 하는 신호'));
  await expectNoHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('320px 센터 화면은 가로 스크롤 없이 지역 선택을 노출한다', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/centers');
  await expect(page.getByRole('heading', { name: '가까운 정신건강복지센터' })).toBeVisible();
  await expectFitsInViewport(page, page.getByText('서울특별시', { exact: true }));
  await expectNoHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('320px 결과 가드 화면은 가로 스크롤 없이 안내를 노출한다', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/result');
  await expect(page.getByText('결과를 불러올 수 없습니다')).toBeVisible();
  await expectNoHorizontalScroll(page);
  expect(errors).toEqual([]);
});

