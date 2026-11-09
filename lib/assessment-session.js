const STORAGE_KEY = 'maeumcheck:v1:last-result';
const SCHEMA_VERSION = 2;
const VALID_TIERS = new Set(['acute', 'urgent', 'routine', 'monitor', 'low']);

let memory = null;

function getSessionStorage() {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) return window.sessionStorage;
    if (typeof globalThis !== 'undefined' && globalThis.sessionStorage) return globalThis.sessionStorage;
  } catch {
    return null;
  }
  return null;
}

function isWholeNumberInRange(value, min, max) {
  return Number.isInteger(value) && value >= min && value <= max;
}

function isBand(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      typeof value.id === 'string' &&
      value.id.length > 0 &&
      typeof value.label === 'string' &&
      value.label.length > 0,
  );
}

export function isAssessmentSummary(value) {
  if (!value || typeof value !== 'object') return false;
  const { depression, gad7, asq, risk } = value;
  return Boolean(
    depression &&
      (depression.instrument === 'PHQ-9' || depression.instrument === 'PHQ-A') &&
      isWholeNumberInRange(depression.total, 0, 27) &&
      depression.max === 27 &&
      isBand(depression.band) &&
      typeof depression.deathThoughtSignal === 'boolean' &&
      gad7 &&
      isWholeNumberInRange(gad7.total, 0, 21) &&
      gad7.max === 21 &&
      isBand(gad7.band) &&
      asq &&
      typeof asq.positive === 'boolean' &&
      typeof asq.acute === 'boolean' &&
      risk &&
      VALID_TIERS.has(risk.tier) &&
      typeof risk.label === 'string' &&
      typeof risk.color === 'string' &&
      typeof risk.action === 'string' &&
      typeof risk.crisisFirst === 'boolean' &&
      Array.isArray(risk.reasons) && risk.reasons.every((reason) => typeof reason === 'string') &&
      typeof value.isYouth === 'boolean' &&
      !(asq.acute && risk.tier !== 'acute') &&
      !(risk.tier === 'acute' && !asq.acute && !risk.crisisFirst) &&
      !(asq.positive && !asq.acute && risk.tier !== 'urgent') &&
      !(depression.deathThoughtSignal && !['urgent', 'acute'].includes(risk.tier))
  );
}

function minimize(result) {
  return {
    depression: {
      instrument: result.depression.instrument,
      total: result.depression.total,
      max: result.depression.max,
      band: result.depression.band,
      deathThoughtSignal: Boolean(result.depression.deathThoughtSignal),
    },
    gad7: {
      total: result.gad7.total,
      max: result.gad7.max,
      band: result.gad7.band,
    },
    asq: {
      positive: result.asq.positive,
      acute: result.asq.acute,
    },
    risk: {
      tier: result.risk.tier,
      label: result.risk.label,
      color: result.risk.color,
      action: result.risk.action,
      reasons: Array.isArray(result.risk.reasons) ? result.risk.reasons : [],
      crisisFirst: Boolean(result.risk.crisisFirst),
    },
    isYouth: result.isYouth,
    impairment: result.impairment ?? null,
    impairmentLabel: result.impairmentLabel ?? null,
  };
}

export function saveAssessmentSummary(result) {
  if (!isAssessmentSummary(result)) return false;
  const summary = minimize(result);
  memory = summary;
  const storage = getSessionStorage();
  if (!storage) return true;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: SCHEMA_VERSION, result: summary }));
    return true;
  } catch {
    return true;
  }
}

export function loadAssessmentSummary() {
  if (memory) return memory;
  const storage = getSessionStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.schemaVersion !== SCHEMA_VERSION) return null;
    if (!isAssessmentSummary(parsed.result)) return null;
    memory = parsed.result;
    return memory;
  } catch {
    return null;
  }
}

export function clearAssessmentSummary() {
  memory = null;
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // 저장소 접근이 막혀 있어도 메모리 캐시는 이미 비웠습니다.
  }
}

export function __resetAssessmentSummaryMemory() {
  memory = null;
}
