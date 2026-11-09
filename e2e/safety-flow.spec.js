import { test, expect } from '@playwright/test';

function capturePageErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

async function startAdultSurvey(page) {
  await page.goto('/');
  await page.getByText('위 내용을 확인했고, 자가 선별에 동의합니다.').click();
  await page.getByText('만 18세 이상').click();
  await page.getByText('자가 선별 시작하기').click();
  await expect(page.getByText('지금 이 확인에서 가장 먼저 받고 싶은 도움은 무엇인가요?')).toBeVisible();
}

async function moveToSafety(page) {
  await page.getByText('건너뛰고 선별검사로 이동할게요').click();
  await expect(page.getByText('현재 안전 확인')).toBeVisible();
}

async function moveToAsqAcuity(page) {
  await moveToSafety(page);
  for (let index = 0; index < 4; index += 1) await page.getByRole('radio', { name: '아니요' }).click();
  for (let index = 0; index < 9; index += 1) await page.getByRole('radio', { name: '전혀 없었다' }).click();
  await page.getByRole('radio', { name: '전혀 어렵지 않았다' }).click();
  for (let index = 0; index < 7; index += 1) await page.getByRole('radio', { name: '전혀 없었다' }).click();
  await page.getByRole('radio', { name: '예' }).click();
  for (let index = 0; index < 3; index += 1) await page.getByRole('radio', { name: '아니요' }).click();
  await expect(page.getByText('마지막 확인')).toBeVisible();
}

test('동의 없는 설문 직접 진입은 시작 화면으로 되돌아간다', async ({ page }) => {
  const errors = capturePageErrors(page);
  await page.goto('/survey?ageGroup=adult');
  await expect(page.getByRole('heading', { name: '우울·자살 위험 자가 선별' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('최초 고민 탐색 화면의 이전은 ASQ로 건너뛰지 않는다', async ({ page }) => {
  const errors = capturePageErrors(page);
  await startAdultSurvey(page);
  await page.getByLabel('이전 문항으로').click();
  await expect(page.getByRole('heading', { name: '우울·자살 위험 자가 선별' })).toBeVisible();
  await expect(page.getByText('자살 위험 선별 · ASQ')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('도움받을 곳을 먼저 선택하면 설문을 요구하지 않고 자원 화면으로 이동한다', async ({ page }) => {
  const errors = capturePageErrors(page);
  await startAdultSurvey(page);
  await page.getByRole('radio', { name: '도움받을 곳을 먼저 알고 싶어요' }).click();
  await expect(page.getByRole('heading', { name: '도움받을 곳' }).first()).toBeVisible();
  await expect(page.getByText('현재 안전 확인')).toHaveCount(0);
  expect(errors).toEqual([]);
});

for (const answer of ['예', '잘 모르겠어요']) {
  test(`현재 안전 확인 ${answer}는 결과보다 위기 화면을 우선한다`, async ({ page }) => {
    const errors = capturePageErrors(page);
    await startAdultSurvey(page);
    await moveToSafety(page);
    await page.getByRole('radio', { name: answer }).click();
    await expect(page).toHaveURL(/\/crisis\?reason=safety/);
    await expect(page.getByText('지금은 설문보다 안전이 먼저입니다')).toBeVisible();
    await expect(page.getByText('선별 점수')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

test('ASQ Q5에서 이전을 누르면 마지막 ASQ 문항으로 돌아간다', async ({ page }) => {
  const errors = capturePageErrors(page);
  await startAdultSurvey(page);
  await moveToAsqAcuity(page);
  await page.getByLabel('이전 문항으로').click();
  await expect(page.getByText('자살 위험 선별 · ASQ')).toBeVisible();
  await expect(page.getByText('자살을 시도했던 적이 있습니까?')).toBeVisible();
  expect(errors).toEqual([]);
});

for (const answer of ['예', '잘 모르겠어요']) {
  test(`ASQ Q5 ${answer}는 결과보다 위기 화면을 우선한다`, async ({ page }) => {
    const errors = capturePageErrors(page);
    await startAdultSurvey(page);
    await moveToAsqAcuity(page);
    await page.getByRole('radio', { name: answer }).click();
    await expect(page).toHaveURL(/\/crisis\?reason=asq/);
    await expect(page.getByText('지금은 설문보다 안전이 먼저입니다')).toBeVisible();
    await expect(page.getByText('선별 점수')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

test('결과 직접 진입은 누락 결과 가드를 보여준다', async ({ page }) => {
  const errors = capturePageErrors(page);
  await page.goto('/result');
  await expect(page.getByText('결과를 불러올 수 없습니다')).toBeVisible();
  expect(errors).toEqual([]);
});
