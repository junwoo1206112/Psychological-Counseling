import { test, expect } from '@playwright/test';

function capturePageErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

async function startSurvey(page, ageLabel = '만 18세 이상') {
  await page.goto('/');
  await page.getByText('위 내용을 확인했고, 자가 선별에 동의합니다.').click();
  await page.getByText(ageLabel, { exact: true }).click();
  await page.getByText('자가 선별 시작하기').click();
  await expect(page.getByText('지금 이 확인에서 가장 먼저 받고 싶은 도움은 무엇인가요?')).toBeVisible();
}

async function startAdultSurvey(page) {
  await startSurvey(page);
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

async function completeLowRiskSurvey(page, ageLabel = '만 18세 이상') {
  await startSurvey(page, ageLabel);
  await moveToSafety(page);
  for (let index = 0; index < 4; index += 1) await page.getByRole('radio', { name: '아니요' }).click();
  for (let index = 0; index < 9; index += 1) await page.getByRole('radio', { name: '전혀 없었다' }).click();
  await page.getByRole('radio', { name: '전혀 어렵지 않았다' }).click();
  for (let index = 0; index < 7; index += 1) await page.getByRole('radio', { name: '전혀 없었다' }).click();
  for (let index = 0; index < 4; index += 1) await page.getByRole('radio', { name: '아니요' }).click();
  await expect(page).toHaveURL(/\/result$/);
}

async function completeUrgentSurvey(page, ageLabel = '만 18세 이상') {
  await startSurvey(page, ageLabel);
  await moveToSafety(page);
  for (let index = 0; index < 4; index += 1) await page.getByRole('radio', { name: '아니요' }).click();
  for (let index = 0; index < 8; index += 1) await page.getByRole('radio', { name: '전혀 없었다' }).click();
  await page.getByRole('radio', { name: '며칠 동안' }).click();
  await page.getByRole('radio', { name: '전혀 어렵지 않았다' }).click();
  for (let index = 0; index < 7; index += 1) await page.getByRole('radio', { name: '전혀 없었다' }).click();
  for (let index = 0; index < 4; index += 1) await page.getByRole('radio', { name: '아니요' }).click();
  await expect(page).toHaveURL(/\/result$/);
}

async function completeImpairedSurvey(page) {
  await startSurvey(page);
  await moveToSafety(page);
  for (let index = 0; index < 4; index += 1) await page.getByRole('radio', { name: '아니요' }).click();
  for (let index = 0; index < 9; index += 1) await page.getByRole('radio', { name: '전혀 없었다' }).click();
  await page.getByRole('radio', { name: '많이 어려웠다' }).click();
  for (let index = 0; index < 7; index += 1) await page.getByRole('radio', { name: '전혀 없었다' }).click();
  for (let index = 0; index < 4; index += 1) await page.getByRole('radio', { name: '아니요' }).click();
  await expect(page).toHaveURL(/\/result$/);
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

test('정상 완료는 결과 화면과 선별 점수를 보여준다', async ({ page }) => {
  const errors = capturePageErrors(page);
  await completeLowRiskSurvey(page);
  await expect(page.getByRole('heading', { name: '자가 선별 결과' })).toBeVisible();
  await expect(page.getByText('선별 점수', { exact: true })).toBeVisible();
  await expect(page.getByText('우울 증상', { exact: true })).toBeVisible();
  await expect(page.getByText('불안 증상', { exact: true })).toBeVisible();
  await expect(page.getByText('자살 위험 선별').first()).toBeVisible();
  await expect(page.getByText('음성', { exact: true })).toBeVisible();
  await expect(page.getByText(/진단이 아닙니다/)).toBeVisible();
  expect(errors).toEqual([]);
});

test('결과 세션은 원본 응답 없이 점수·위험 요약만 저장한다', async ({ page }) => {
  const errors = capturePageErrors(page);
  await completeLowRiskSurvey(page);
  const raw = await page.evaluate(() => sessionStorage.getItem('maeumcheck:v1:last-result'));
  expect(raw).not.toBeNull();
  const parsed = JSON.parse(raw);
  expect(parsed.schemaVersion).toBe(2);
  const result = parsed.result;
  expect(Object.keys(result).sort()).toEqual(['asq', 'depression', 'gad7', 'impairment', 'impairmentLabel', 'isYouth', 'risk']);
  expect(Object.keys(result.depression).sort()).toEqual(['band', 'deathThoughtSignal', 'instrument', 'max', 'total']);
  expect(Object.keys(result.gad7).sort()).toEqual(['band', 'max', 'total']);
  expect(Object.keys(result.asq).sort()).toEqual(['acute', 'positive']);
  expect(result.depression.total).toBe(0);
  expect(result.gad7.total).toBe(0);
  expect(result.asq).toEqual({ acute: false, positive: false });
  expect(result.risk.tier).toBe('low');
  expect(JSON.stringify(result)).not.toMatch(/"(answers|safety|checkin|phq9Answers|gad7Answers|asqAnswers)"/i);
  expect(JSON.stringify(result)).not.toContain('전혀 없었다');
  expect(errors).toEqual([]);
});

test('결과 저장은 선택이며 최소 요약만 저장하고 전체 삭제할 수 있다', async ({ page }) => {
  const errors = capturePageErrors(page);
  page.on('dialog', (dialog) => dialog.accept());
  await completeLowRiskSurvey(page);
  expect(await page.evaluate(() => localStorage.getItem('maeumcheck:v1:history'))).toBeNull();
  await page.getByText('이 결과 저장하기').click();
  await expect(page.getByText(/결과가 이 기기에 저장되었습니다/)).toBeVisible();
  const raw = await page.evaluate(() => localStorage.getItem('maeumcheck:v1:history'));
  expect(raw).not.toBeNull();
  const history = JSON.parse(raw);
  expect(history.schemaVersion).toBe(1);
  expect(history.entries).toHaveLength(1);
  const entry = history.entries[0];
  expect(Object.keys(entry).sort()).toEqual(['asq', 'date', 'gad7', 'id', 'phq9', 'risk']);
  expect(Object.keys(entry.phq9).sort()).toEqual(['bandId', 'bandLabel', 'instrument', 'total']);
  expect(Object.keys(entry.gad7).sort()).toEqual(['bandId', 'bandLabel', 'total']);
  expect(entry.phq9.total).toBe(0);
  expect(entry.gad7.total).toBe(0);
  expect(entry.asq).toEqual({ acute: false, positive: false });
  expect(entry.risk.tier).toBe('low');
  expect(JSON.stringify(entry)).not.toContain('전혀 없었다');
  expect(JSON.stringify(entry)).not.toMatch(/"answers"/i);
  await page.goto('/history');
  await expect(page.getByText(/저장된 결과 1건/)).toBeVisible();
  await expect(page.getByText(/우울\(PHQ-9\): 0\/27/)).toBeVisible();
  await page.getByText('모든 기록 삭제').click();
  await expect(page.getByText('저장된 기록을 삭제했습니다.')).toBeVisible();
  const cleared = await page.evaluate(() => JSON.parse(localStorage.getItem('maeumcheck:v1:history')));
  expect(cleared.entries).toHaveLength(0);
  expect(errors).toEqual([]);
});

test('청소년 정상 완료는 PHQ-A와 1388 안내를 표시한다', async ({ page }) => {
  const errors = capturePageErrors(page);
  await completeLowRiskSurvey(page, '만 14~17세');
  await expect(page.getByRole('heading', { name: '자가 선별 결과' })).toBeVisible();
  await expect(page.getByText('PHQ-A · 지난 2주', { exact: true })).toBeVisible();
  await expect(page.getByText('PHQ-9 · 지난 2주', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/1388\(청소년전화\)에서 먼저/)).toBeVisible();
  const raw = await page.evaluate(() => sessionStorage.getItem('maeumcheck:v1:last-result'));
  const parsed = JSON.parse(raw);
  expect(parsed.result.isYouth).toBe(true);
  expect(parsed.result.depression.instrument).toBe('PHQ-A');
  expect(errors).toEqual([]);
});

test('localStorage가 차단되어도 결과와 기록 안내가 렌더된다', async ({ context, page }) => {
  await context.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('localStorage blocked for test');
      },
    });
  });
  const errors = capturePageErrors(page);
  await completeLowRiskSurvey(page);
  expect(await page.evaluate(() => {
    try {
      window.localStorage.getItem('probe');
      return 'available';
    } catch {
      return 'blocked';
    }
  })).toBe('blocked');
  await expect(page.getByRole('heading', { name: '자가 선별 결과' })).toBeVisible();
  await expect(page.getByText('선별 점수', { exact: true })).toBeVisible();
  await expect(page.getByText('이 결과 저장하기')).toHaveCount(0);
  await page.goto('/history');
  await expect(page.getByText('기록 기능을 사용할 수 없습니다')).toBeVisible();
  expect(errors).toEqual([]);
});

test('sessionStorage가 차단되어도 같은 탭에서 선별과 결과가 동작한다', async ({ context, page }) => {
  await context.addInitScript(() => {
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      get() {
        throw new Error('sessionStorage blocked for test');
      },
    });
  });
  const errors = capturePageErrors(page);
  await completeLowRiskSurvey(page);
  expect(await page.evaluate(() => {
    try {
      window.sessionStorage.getItem('probe');
      return 'available';
    } catch {
      return 'blocked';
    }
  })).toBe('blocked');
  await expect(page.getByRole('heading', { name: '자가 선별 결과' })).toBeVisible();
  await expect(page.getByText('선별 점수', { exact: true })).toBeVisible();
  await expect(page.getByText('이 결과 저장하기')).toBeVisible();
  expect(errors).toEqual([]);
});

test('localStorage 저장 실패를 성공으로 표시하지 않는다', async ({ context, page }) => {
  await context.addInitScript(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function blockLocalStorageWrite(key, value) {
      if (this === window.localStorage) throw new Error('localStorage write blocked for test');
      return original.call(this, key, value);
    };
  });
  const errors = capturePageErrors(page);
  await completeLowRiskSurvey(page);
  await page.getByText('이 결과 저장하기').click();
  await expect(page.getByText(/저장에 실패했습니다/)).toBeVisible();
  await expect(page.getByText(/결과가 이 기기에 저장되었습니다/)).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('maeumcheck:v1:history'))).toBeNull();
  expect(errors).toEqual([]);
});

test('기록 삭제 실패를 성공으로 표시하지 않고 기록을 보존한다', async ({ page }) => {
  page.on('dialog', (dialog) => dialog.accept());
  const errors = capturePageErrors(page);
  await completeLowRiskSurvey(page);
  await page.getByText('이 결과 저장하기').click();
  await expect(page.getByText(/결과가 이 기기에 저장되었습니다/)).toBeVisible();
  await page.goto('/history');
  await expect(page.getByText(/저장된 결과 1건/)).toBeVisible();
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function blockLocalStorageWrite(key, value) {
      if (this === window.localStorage) throw new Error('localStorage write blocked for test');
      return original.call(this, key, value);
    };
  });
  await page.getByText('모든 기록 삭제').click();
  await expect(page.getByText(/삭제에 실패했습니다/)).toBeVisible();
  await expect(page.getByText('저장된 기록을 삭제했습니다.')).toHaveCount(0);
  const raw = await page.evaluate(() => localStorage.getItem('maeumcheck:v1:history'));
  expect(JSON.parse(raw).entries).toHaveLength(1);
  expect(errors).toEqual([]);
});

test('만 14세 미만은 법정대리인 안내와 1388을 표시하고 선별을 시작할 수 없다', async ({ page }) => {
  const errors = capturePageErrors(page);
  await page.goto('/');
  await page.getByText('위 내용을 확인했고, 자가 선별에 동의합니다.').click();
  await page.getByText('만 14세 미만', { exact: true }).click();
  await expect(page.getByText(/법정대리인 동의가 필요합니다/)).toBeVisible();
  await expect(page.getByText('1388 상담', { exact: true })).toBeVisible();
  const startButton = page.getByText('자가 선별 시작하기', { exact: true }).locator('..');
  await expect(startButton).toHaveAttribute('aria-disabled', 'true');
  await expect(page.getByText('지금 이 확인에서 가장 먼저 받고 싶은 도움은 무엇인가요?')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('만 14세 미만 설문 직접 진입은 시작 화면으로 되돌아간다', async ({ page }) => {
  const errors = capturePageErrors(page);
  await page.goto('/survey?ageGroup=child');
  await expect(page.getByRole('heading', { name: '우울·자살 위험 자가 선별' })).toBeVisible();
  await expect(page.getByText('지금 이 확인에서 가장 먼저 받고 싶은 도움은 무엇인가요?')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('안전계획 메모 저장 실패를 성공으로 표시하지 않는다', async ({ context, page }) => {
  await context.addInitScript(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function blockLocalStorageWrite(key, value) {
      if (this === window.localStorage) throw new Error('localStorage write blocked for test');
      return original.call(this, key, value);
    };
  });
  const errors = capturePageErrors(page);
  await page.goto('/resources');
  await expect(page.getByText('나의 안전 계획 메모 (선택)')).toBeVisible();
  await page.getByLabel('1단계 · 나를 힘들게 하는 신호').fill('저장되면 안 되는 메모');
  await page.getByText('메모 저장하기').click();
  await expect(page.getByText(/저장에 실패했습니다/)).toBeVisible();
  await expect(page.getByText(/이 기기에 저장되었습니다/)).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('maeumcheck:v1:safety-plan'))).toBeNull();
  expect(errors).toEqual([]);
});

test('안전계획 메모 삭제 실패를 성공으로 표시하지 않고 메모를 보존한다', async ({ page }) => {
  page.on('dialog', (dialog) => dialog.accept());
  const errors = capturePageErrors(page);
  await page.goto('/resources');
  await page.getByLabel('1단계 · 나를 힘들게 하는 신호').fill('보존할 메모');
  await page.getByText('메모 저장하기').click();
  await expect(page.getByText(/이 기기에 저장되었습니다/)).toBeVisible();
  await page.evaluate(() => {
    const original = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function blockLocalStorageRemove(key) {
      if (this === window.localStorage) throw new Error('localStorage remove blocked for test');
      return original.call(this, key);
    };
  });
  await page.getByText('전체 삭제').click();
  await expect(page.getByText(/삭제에 실패했습니다/)).toBeVisible();
  await expect(page.getByText('저장된 메모를 모두 삭제했습니다.')).toHaveCount(0);
  const plan = await page.evaluate(() => JSON.parse(localStorage.getItem('maeumcheck:v1:safety-plan')));
  expect(plan.fields.signals).toBe('보존할 메모');
  expect(errors).toEqual([]);
});

test('청소년 결과의 다시 검사하기는 PHQ-A 연령대를 유지한다', async ({ page }) => {
  const errors = capturePageErrors(page);
  await completeLowRiskSurvey(page, '만 14~17세');
  await page.getByText('다시 검사하기').click();
  await expect(page).toHaveURL(/\/survey\?.*ageGroup=youth/);
  await expect(page.getByText('지금 이 확인에서 가장 먼저 받고 싶은 도움은 무엇인가요?')).toBeVisible();
  await moveToSafety(page);
  for (let index = 0; index < 4; index += 1) await page.getByRole('radio', { name: '아니요' }).click();
  await expect(page.getByText('우울 증상 · PHQ-A')).toBeVisible();
  expect(errors).toEqual([]);
});

test('저장한 안전계획 메모는 위기 화면에서 다시 확인된다', async ({ page }) => {
  const errors = capturePageErrors(page);
  await page.goto('/resources');
  await page.getByLabel('1단계 · 나를 힘들게 하는 신호').fill('잠들기 어려울 때');
  await page.getByLabel('4단계 · 지금 연락할 수 있는 사람').fill('믿을 수 있는 친구');
  await page.getByText('메모 저장하기').click();
  await expect(page.getByText(/이 기기에 저장되었습니다/)).toBeVisible();
  await page.goto('/crisis?reason=safety');
  await expect(page.getByText('내가 적어 둔 안전 계획 메모')).toBeVisible();
  await expect(page.getByText('잠들기 어려울 때')).toBeVisible();
  await expect(page.getByText('믿을 수 있는 친구')).toBeVisible();
  await expect(page.getByText('이 메모는 이 기기에만 저장된 내용입니다.')).toBeVisible();
  expect(errors).toEqual([]);
});

test('안전계획 메모를 삭제하면 위기 화면에서도 사라진다', async ({ page }) => {
  page.on('dialog', (dialog) => dialog.accept());
  const errors = capturePageErrors(page);
  await page.goto('/resources');
  await page.getByLabel('1단계 · 나를 힘들게 하는 신호').fill('삭제할 메모');
  await page.getByText('메모 저장하기').click();
  await expect(page.getByText(/이 기기에 저장되었습니다/)).toBeVisible();
  await page.getByText('전체 삭제').click();
  await expect(page.getByText('저장된 메모를 모두 삭제했습니다.')).toBeVisible();
  await page.goto('/crisis?reason=safety');
  await expect(page.getByText('내가 적어 둔 안전 계획 메모')).toHaveCount(0);
  await expect(page.getByText('삭제할 메모')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('위험 신호 결과는 저장된 안전계획 메모를 즉시 노출한다', async ({ page }) => {
  const errors = capturePageErrors(page);
  await page.goto('/resources');
  await page.getByLabel('1단계 · 나를 힘들게 하는 신호').fill('위험 신호 때 떠오르는 메모');
  await page.getByText('메모 저장하기').click();
  await expect(page.getByText(/이 기기에 저장되었습니다/)).toBeVisible();
  await completeUrgentSurvey(page);
  await expect(page.getByText('빠른 전문가 도움이 필요해 보입니다')).toBeVisible();
  await expect(page.getByText('내가 적어 둔 안전 계획 메모')).toBeVisible();
  await expect(page.getByText('위험 신호 때 떠오르는 메모')).toBeVisible();
  await expect(page.getByText(/지금 안전 계획을 적어 두면/)).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('위험 신호 결과에 저장된 메모가 없으면 작성 안내를 표시한다', async ({ page }) => {
  const errors = capturePageErrors(page);
  await completeUrgentSurvey(page);
  await expect(page.getByText('빠른 전문가 도움이 필요해 보입니다')).toBeVisible();
  await expect(page.getByText(/지금 안전 계획을 적어 두면/)).toBeVisible();
  await expect(page.getByText('내가 적어 둔 안전 계획 메모')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('일상 기능의 큰 어려움은 점수와 무관하게 urgent 결과로 안내한다', async ({ page }) => {
  const errors = capturePageErrors(page);
  await completeImpairedSurvey(page);
  await expect(page).toHaveURL(/\/result$/);
  await expect(page.getByText('빠른 전문가 도움이 필요해 보입니다')).toBeVisible();
  await expect(page.getByText('일상 기능의 어려움이 크게 보고되었습니다.')).toBeVisible();
  await expect(page.getByText('일상 기능 (비채점)')).toBeVisible();
  await expect(page.getByLabel(/우울 증상 0점/)).toBeVisible();
  await expect(page.getByLabel(/불안 증상 0점/)).toBeVisible();
  expect(errors).toEqual([]);
});

test('PHQ-9 문항은 한국어/영문 토글과 번역 고지를 제공한다', async ({ page }) => {
  const errors = capturePageErrors(page);
  await startAdultSurvey(page);
  await moveToSafety(page);
  for (let index = 0; index < 4; index += 1) await page.getByRole('radio', { name: '아니요' }).click();
  await expect(page.getByText('우울 증상 · PHQ-9')).toBeVisible();
  await expect(page.getByText('일을 하거나 즐거움을 느끼는 데 흥미나 즐거움이 거의 없었다.')).toBeVisible();
  await expect(page.getByText('한국어 문항은 이해를 돕기 위한 번역입니다. 영문 원문 도구의 합산 규칙을 적용하지만, 이 앱의 한국어 번역과 웹 사용 방식은 임상 타당화가 완료되지 않았습니다.')).toBeVisible();
  await page.getByText('영문 원문 보기', { exact: true }).click();
  await expect(page.getByText('Little interest or pleasure in doing things.')).toBeVisible();
  await expect(page.getByText('한국어로 보기', { exact: true })).toBeVisible();
  await page.getByText('한국어로 보기', { exact: true }).click();
  await expect(page.getByText('일을 하거나 즐거움을 느끼는 데 흥미나 즐거움이 거의 없었다.')).toBeVisible();
  expect(errors).toEqual([]);
});

test('저장된 추이 행은 날짜·우울·불안 점수 접근성 라벨을 제공한다', async ({ page }) => {
  const errors = capturePageErrors(page);
  await completeLowRiskSurvey(page);
  await page.getByText('이 결과 저장하기').click();
  await expect(page.getByText(/결과가 이 기기에 저장되었습니다/)).toBeVisible();
  await page.goto('/history');
  await expect(page.getByLabel(/우울 0점, 불안 0점/)).toBeVisible();
  expect(errors).toEqual([]);
});

test('기록 한 건 삭제는 목록에서 제거하고 성공 안내를 유지한다', async ({ page }) => {
  page.on('dialog', (dialog) => dialog.accept());
  const errors = capturePageErrors(page);
  await completeLowRiskSurvey(page);
  await page.getByText('이 결과 저장하기').click();
  await expect(page.getByText(/결과가 이 기기에 저장되었습니다/)).toBeVisible();
  await page.goto('/history');
  await page.getByText('이 기록 삭제').click();
  await expect(page.getByText('저장된 기록을 삭제했습니다.')).toBeVisible();
  await expect(page.getByText('아직 저장된 결과가 없습니다')).toBeVisible();
  const cleared = await page.evaluate(() => JSON.parse(localStorage.getItem('maeumcheck:v1:history')));
  expect(cleared.entries).toHaveLength(0);
  expect(errors).toEqual([]);
});

test('지역 선택은 공식 포털 센터 검색 URL을 연다', async ({ context, page }) => {
  await context.addInitScript(() => {
    window.__openedUrls = [];
    window.open = (url) => {
      window.__openedUrls.push(String(url));
      return {};
    };
  });
  const errors = capturePageErrors(page);
  await page.goto('/centers');
  await page.getByText('서울특별시', { exact: true }).click();
  await expect(page.getByText('서울특별시 정신건강복지센터 찾기')).toBeVisible();
  await page.getByText('공식 포털에서 센터 검색').click();
  const opened = await page.evaluate(() => window.__openedUrls);
  expect(opened.some((url) => url.includes('mentalhealth.go.kr') && url.includes('PotalHealthFacListTab2.do') && url.includes('sc3=AFCS1'))).toBe(true);
  expect(errors).toEqual([]);
});
