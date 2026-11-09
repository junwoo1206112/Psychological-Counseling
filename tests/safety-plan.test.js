import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SAFETY_PLAN_FIELDS,
  SAFETY_PLAN_MAX_LENGTH,
  isSafetyPlan,
  buildEmptySafetyPlan,
  loadSafetyPlan,
  saveSafetyPlan,
  hasSavedMemo,
  clearSafetyPlan,
} from '../lib/storage/safety-plan.js';

function installFakeLocalStorage() {
  const store = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
    },
  };
  return store;
}

function removeFakeLocalStorage() {
  delete globalThis.window;
}

test('안전 계획은 6단계 필드로 구성된다', () => {
  assert.equal(SAFETY_PLAN_FIELDS.length, 6);
  assert.deepEqual(
    SAFETY_PLAN_FIELDS.map((field) => field.id),
    ['signals', 'coping', 'calmPeople', 'contacts', 'helpPlaces', 'meansSafety']
  );
});

test('메모를 저장하면 기기에서만 불러온다', () => {
  installFakeLocalStorage();
  try {
    assert.equal(saveSafetyPlan({ signals: '잠을 못 잔다 ', coping: '천천히 호흡하기' }), true);
    const plan = loadSafetyPlan();
    assert.equal(plan.schemaVersion, 1);
    assert.equal(plan.fields.signals, '잠을 못 잔다');
    assert.equal(plan.fields.coping, '천천히 호흡하기');
    assert.equal(hasSavedMemo(plan), true);
    assert.match(plan.updatedAt, /\d{4}-/);
  } finally {
    removeFakeLocalStorage();
  }
});

test('빈 값·공백만 입력한 항목은 저장되지 않는다', () => {
  installFakeLocalStorage();
  try {
    saveSafetyPlan({ signals: '   ', coping: '', contacts: null });
    const plan = loadSafetyPlan();
    assert.equal(Object.keys(plan.fields).length, 0);
    assert.equal(hasSavedMemo(plan), false);
  } finally {
    removeFakeLocalStorage();
  }
});

test('입력은 최대 길이로 제한된다', () => {
  installFakeLocalStorage();
  try {
    const long = '가'.repeat(SAFETY_PLAN_MAX_LENGTH + 100);
    saveSafetyPlan({ signals: long });
    const plan = loadSafetyPlan();
    assert.equal(plan.fields.signals.length, SAFETY_PLAN_MAX_LENGTH);
    assert.equal(isSafetyPlan({ ...plan, fields: { signals: '가'.repeat(SAFETY_PLAN_MAX_LENGTH + 1) } }), false);
  } finally {
    removeFakeLocalStorage();
  }
});

test('전체 삭제 후에는 메모를 불러올 수 없다', () => {
  installFakeLocalStorage();
  try {
    saveSafetyPlan({ signals: '혼자 있고 싶다' });
    assert.equal(clearSafetyPlan(), true);
    assert.equal(loadSafetyPlan(), null);
  } finally {
    removeFakeLocalStorage();
  }
});

test('손상된 저장 값은 거부된다', () => {
  const store = installFakeLocalStorage();
  try {
    store.set('maeumcheck:v1:safety-plan', '{broken');
    assert.equal(loadSafetyPlan(), null);
    store.set('maeumcheck:v1:safety-plan', JSON.stringify({ schemaVersion: 2, fields: {} }));
    assert.equal(loadSafetyPlan(), null);
    assert.equal(isSafetyPlan(buildEmptySafetyPlan()), true);
    assert.equal(isSafetyPlan(null), false);
  } finally {
    removeFakeLocalStorage();
  }
});

test('저장소가 꺼져 있으면 실패를 알린다', () => {
  removeFakeLocalStorage();
  assert.equal(saveSafetyPlan({ signals: 'x' }), false);
  assert.equal(loadSafetyPlan(), null);
  assert.equal(clearSafetyPlan(), false);
});

test('저장소 getter가 차단되어도 안전 계획 함수는 예외를 전파하지 않는다', () => {
  globalThis.window = {};
  Object.defineProperty(globalThis.window, 'localStorage', { get: () => { throw new Error('SecurityError'); } });
  try {
    assert.equal(loadSafetyPlan(), null);
    assert.equal(saveSafetyPlan({ signals: 'x' }), false);
    assert.equal(clearSafetyPlan(), false);
  } finally {
    removeFakeLocalStorage();
  }
});
