import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createEmptyHistory,
  addEntry,
  buildEntry,
  deleteEntry,
  isHistory,
  isHistoryEntry,
  isStorageAvailable,
} from '../lib/storage/adapter.js';

test('createEmptyHistory 기본 구조', () => {
  const h = createEmptyHistory();
  assert.equal(h.schemaVersion, 1);
  assert.deepEqual(h.entries, []);
  assert.equal(h.locale, 'ko-KR');
});

test('buildEntry는 민감 정보를 제외한 요약만 저장', () => {
  const result = {
    phq9: { total: 12, band: { id: 'moderate', label: '중간 수준' } },
    gad7: { total: 9, band: { id: 'mild', label: '가벼운 수준' } },
    asq: { positive: true, acute: false },
    risk: { tier: 'urgent', label: '빠른 전문가 도움이 필요해 보입니다' },
  };
  const entry = buildEntry(result);
  assert.equal(typeof entry.id, 'string');
  assert.equal(typeof entry.date, 'string');
  assert.equal(entry.phq9.total, 12);
  assert.equal(entry.phq9.bandId, 'moderate');
  assert.equal(entry.gad7.total, 9);
  assert.equal(entry.asq.positive, true);
  assert.equal(entry.risk.tier, 'urgent');
  assert.equal('responses' in entry, false);
  assert.equal('safety' in entry, false);
});

test('addEntry는 최대 50건 유지', () => {
  let h = createEmptyHistory();
  for (let i = 0; i < 55; i += 1) {
    h = addEntry(h, buildEntry({
      phq9: { total: i, band: { id: 'mild', label: '가벼운 수준' } },
      gad7: { total: 0, band: { id: 'minimal', label: '낮은 수준' } },
      asq: { positive: false, acute: false },
      risk: { tier: 'low', label: '낮은 수준' },
    }));
  }
  assert.equal(h.entries.length, 50);
  assert.equal(h.entries[0].phq9.total, 5);
  assert.equal(h.entries[49].phq9.total, 54);
});

test('deleteEntry는 지정 id를 제거', () => {
  let h = createEmptyHistory();
  const entry = buildEntry({
    phq9: { total: 5, band: { id: 'mild', label: '가벼운 수준' } },
    gad7: { total: 4, band: { id: 'minimal', label: '낮은 수준' } },
    asq: { positive: false, acute: false },
    risk: { tier: 'low', label: '낮은 수준' },
  });
  h = addEntry(h, entry);
  h = deleteEntry(h, entry.id);
  assert.equal(h.entries.length, 0);
});

test('차단된 localStorage getter는 저장 기능 불가로 처리한다', () => {
  globalThis.window = {};
  Object.defineProperty(globalThis.window, 'localStorage', { get: () => { throw new Error('SecurityError'); } });
  try {
    assert.equal(isStorageAvailable(), false);
  } finally {
    delete globalThis.window;
  }
});

test('저장 기록은 각 항목의 날짜·점수·위험 티어까지 검증한다', () => {
  const entry = buildEntry({
    phq9: { total: 12, band: { id: 'moderate', label: '중간 수준' } },
    gad7: { total: 9, band: { id: 'mild', label: '가벼운 수준' } },
    asq: { positive: false, acute: false },
    risk: { tier: 'routine', label: '전문가 상담을 고려해 볼 수 있습니다' },
  });
  assert.equal(isHistoryEntry(entry), true);
  assert.equal(isHistory({ ...createEmptyHistory(), entries: [entry] }), true);
  assert.equal(isHistoryEntry({ ...entry, date: 'not-a-date' }), false);
  assert.equal(isHistoryEntry({ ...entry, phq9: { ...entry.phq9, total: 28 } }), false);
  assert.equal(isHistoryEntry({ ...entry, risk: { ...entry.risk, tier: 'unknown' } }), false);
});
