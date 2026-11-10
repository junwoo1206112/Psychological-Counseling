import { test, expect } from '@playwright/test';

test('건너뛰기 링크는 키보드로 본문 포커스를 이동한다', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  const skipLink = page.getByRole('link', { name: '본문으로 건너뛰기' });
  await expect(skipLink).toBeVisible();
  await skipLink.focus();
  await skipLink.press('Enter');

  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('root');
  expect(errors).toEqual([]);
});
