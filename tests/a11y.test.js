import test from 'node:test';
import assert from 'node:assert/strict';
import { contrastRatio, roundContrast, meetsAA } from '../lib/a11y.js';

test('contrastRatio 검정/흰색은 약 21:1', () => {
  assert.equal(roundContrast(contrastRatio('#000000', '#FFFFFF')), 21);
});

test('contrastRatio는 대칭이다', () => {
  assert.equal(
    roundContrast(contrastRatio('#14213D', '#FFFFFF')),
    roundContrast(contrastRatio('#FFFFFF', '#14213D')),
  );
});

const TEXT_ON_LIGHT = [
  ['#14213D', '#FFFFFF'],
  ['#263238', '#FFFFFF'],
  ['#37474F', '#FFFFFF'],
  ['#455A64', '#FFFFFF'],
  ['#455A64', '#F7FBFA'],
  ['#546E7A', '#FFFFFF'],
  ['#2C6E63', '#FFFFFF'],
  ['#2C6E63', '#E4F1EE'],
  ['#0D47A1', '#E3F2FD'],
  ['#8A5A00', '#FFF8E1'],
  ['#C62828', '#FFF8F8'],
  ['#2E7D32', '#E8F5E9'],
  ['#A63D00', '#FFF4F4'],
  ['#7A5C00', '#FFFFFF'],
  ['#33691E', '#FFFFFF'],
];

test('본문 텍스트 팔레트는 WCAG AA(4.5:1)를 통과', () => {
  for (const [fg, bg] of TEXT_ON_LIGHT) {
    assert.ok(
      meetsAA(fg, bg),
      `${fg} on ${bg} = ${roundContrast(contrastRatio(fg, bg))}`,
    );
  }
});

const WHITE_ON_COLOR = [
  '#C62828',
  '#B71C1C',
  '#1B5E20',
  '#33691E',
  '#7A5C00',
  '#A63D00',
  '#2C6E63',
  '#1565C0',
  '#37474F',
];

test('흰색 버튼 텍스트 팔레트는 WCAG AA(4.5:1)를 통과', () => {
  for (const bg of WHITE_ON_COLOR) {
    assert.ok(
      meetsAA('#FFFFFF', bg),
      `#FFFFFF on ${bg} = ${roundContrast(contrastRatio('#FFFFFF', bg))}`,
    );
  }
});

test('큰 텍스트는 3:1 기준을 적용', () => {
  assert.equal(meetsAA('#FFFFFF', '#808080', { large: true }), true);
  assert.equal(meetsAA('#FFFFFF', '#808080', { large: false }), false);
});
