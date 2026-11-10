import { test, expect } from '@playwright/test';

test('오프라인 탐색은 위기 자원이 있는 오프라인 안내를 보여준다', async ({ page, context }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));

  await context.setOffline(true);
  await page.goto('/crisis?reason=safety');

  await expect(page.getByRole('heading', { name: '오프라인 안내' })).toBeVisible();
  await expect(page.getByRole('link', { name: /109/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /119/ })).toBeVisible();
  expect(errors).toEqual([]);
});
