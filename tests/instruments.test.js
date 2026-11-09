import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PHQ9_ITEMS,
  PHQ9_KO_ITEMS,
  PHQ_A_ITEMS,
  PHQ_A_KO_ITEMS,
  GAD7_ITEMS,
  GAD7_KO_ITEMS,
  IMPAIRMENT_QUESTION,
  IMPAIRMENT_QUESTION_KO,
  KOREAN_TRANSLATION_NOTICE,
  INSTRUMENT_META,
  CONTENT_HASHES,
  TRANSLATION_STATUS,
  INSTRUMENT_VERSION_DATE,
  CRISIS_RESOURCES,
  RESOURCE_VERIFIED_AT,
  RESOURCE_MAX_AGE_DAYS,
  RESOURCE_VERIFICATION_METHOD,
  RESOURCE_VERIFICATION_SOURCES,
} from '../data/instruments.js';
import { hashItems, hashString } from '../lib/instrument-hash.js';

const KOREAN_ITEMS = [...PHQ9_KO_ITEMS, ...PHQ_A_KO_ITEMS, ...GAD7_KO_ITEMS, IMPAIRMENT_QUESTION_KO.text];

test('한국어 번역 문항 수가 영문 원문과 일치한다', () => {
  assert.equal(PHQ9_KO_ITEMS.length, PHQ9_ITEMS.length);
  assert.equal(PHQ_A_KO_ITEMS.length, PHQ_A_ITEMS.length);
  assert.equal(GAD7_KO_ITEMS.length, GAD7_ITEMS.length);
  assert.ok(IMPAIRMENT_QUESTION_KO.text);
  assert.notEqual(IMPAIRMENT_QUESTION_KO.text, IMPAIRMENT_QUESTION.text);
});

test('한국어 번역 문항은 비어 있지 않고 한글을 포함한다', () => {
  for (const text of KOREAN_ITEMS) {
    assert.ok(text.trim().length > 0);
    assert.match(text, /[가-힣]/);
  }
});

test('한국어 번역 고지는 채점 기준이 영문 원문임을 밝힌다', () => {
  assert.match(KOREAN_TRANSLATION_NOTICE, /영문 원문/);
  assert.match(KOREAN_TRANSLATION_NOTICE, /번역/);
});

test('한국어 문항에 진단·확률 표현이 없다', () => {
  const joined = KOREAN_ITEMS.join(' ');
  for (const phrase of ['우울증입니다', '자살 위험 점수', '진단 결과입니다', '확률']) {
    assert.equal(joined.includes(phrase), false, phrase);
  }
});

test('문항 해시는 결정적이고 문항 변경에 민감하다', () => {
  assert.equal(hashString('abc'), hashString('abc'));
  assert.notEqual(hashString('abc'), hashString('abd'));
  const original = hashItems(['a', 'b', 'c']);
  assert.equal(original, hashItems(['a', 'b', 'c']));
  assert.notEqual(original, hashItems(['a', 'b', 'd']));
  assert.notEqual(original, hashItems(['c', 'b', 'a']));
});

test('계기 메타의 해시가 실제 문항과 일치한다', () => {
  assert.equal(INSTRUMENT_META.phq9.contentHash, hashItems(PHQ9_ITEMS));
  assert.equal(INSTRUMENT_META.phq9.translationHash, hashItems(PHQ9_KO_ITEMS));
  assert.equal(INSTRUMENT_META.phqa.contentHash, hashItems(PHQ_A_ITEMS));
  assert.equal(INSTRUMENT_META.gad7.contentHash, hashItems(GAD7_ITEMS));
  assert.equal(CONTENT_HASHES.phq9.en, INSTRUMENT_META.phq9.contentHash);
  assert.equal(CONTENT_HASHES.phqa.ko, INSTRUMENT_META.phqa.translationHash);
});

test('번역 상태와 버전이 기록된다', () => {
  assert.equal(TRANSLATION_STATUS, 'unofficial');
  assert.equal(INSTRUMENT_META.phq9.translationStatus, 'unofficial');
  assert.equal(INSTRUMENT_META.asq.translationStatus, 'official-nimh');
  assert.match(INSTRUMENT_META.phq9.version, new RegExp(INSTRUMENT_VERSION_DATE));
  assert.match(INSTRUMENT_META.gad7.translationVersion, /unofficial/);
});

test('위기 자원에는 검증일·유효기간·공식 근거와 필수 번호가 있다', () => {
  assert.match(RESOURCE_VERIFIED_AT, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(RESOURCE_MAX_AGE_DAYS, 90);
  assert.equal(RESOURCE_VERIFICATION_METHOD, 'official-web');
  assert.ok(RESOURCE_VERIFICATION_SOURCES.length > 0);
  assert.ok(RESOURCE_VERIFICATION_SOURCES.every((url) => url.startsWith('https://')));
  for (const [id, phone] of [['suicide', '109'], ['emergency', '119'], ['police', '112'], ['mental', '1577-0199'], ['youth', '1388']]) {
    assert.equal(CRISIS_RESOURCES.find((resource) => resource.id === id)?.phone, phone);
  }
});
