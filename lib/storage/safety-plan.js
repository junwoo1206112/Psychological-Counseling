const STORAGE_KEY = 'maeumcheck:v1:safety-plan';
const SCHEMA_VERSION = 1;
export const SAFETY_PLAN_MAX_LENGTH = 500;

export const SAFETY_PLAN_FIELDS = [
  { id: 'signals', label: '1단계 · 나를 힘들게 하는 신호' },
  { id: 'coping', label: '2단계 · 혼자서 할 수 있는 대처' },
  { id: 'calmPeople', label: '3단계 · 편안해지는 사람이나 장소' },
  { id: 'contacts', label: '4단계 · 지금 연락할 수 있는 사람' },
  { id: 'helpPlaces', label: '5단계 · 도움을 요청할 곳' },
  { id: 'meansSafety', label: '6단계 · 안전한 환경 만들기' },
];

function getStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  } catch {
    // A blocked storage getter must not prevent crisis information from rendering.
  }
  return null;
}

export function isSafetyPlanStorageAvailable() {
  return Boolean(getStorage());
}

export function isSafetyPlan(value) {
  if (!value || typeof value !== 'object' || value.schemaVersion !== SCHEMA_VERSION) return false;
  const { fields } = value;
  if (!fields || typeof fields !== 'object') return false;
  for (const field of SAFETY_PLAN_FIELDS) {
    const text = fields[field.id];
    if (text === undefined || text === null) continue;
    if (typeof text !== 'string' || text.length > SAFETY_PLAN_MAX_LENGTH) return false;
  }
  return true;
}

export function buildEmptySafetyPlan() {
  return { schemaVersion: SCHEMA_VERSION, fields: {}, updatedAt: null };
}

function sanitizeFields(fields) {
  const clean = {};
  for (const field of SAFETY_PLAN_FIELDS) {
    const raw = fields?.[field.id];
    if (typeof raw !== 'string') continue;
    const trimmed = raw.trim().slice(0, SAFETY_PLAN_MAX_LENGTH);
    if (trimmed.length > 0) clean[field.id] = trimmed;
  }
  return clean;
}

export function loadSafetyPlan() {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isSafetyPlan(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSafetyPlan(fields) {
  const storage = getStorage();
  if (!storage) return false;
  const plan = {
    schemaVersion: SCHEMA_VERSION,
    fields: sanitizeFields(fields),
    updatedAt: new Date().toISOString(),
  };
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(plan));
    return true;
  } catch {
    return false;
  }
}

export function hasSavedMemo(plan) {
  return Boolean(plan && Object.keys(plan.fields || {}).length > 0);
}

export function clearSafetyPlan() {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
