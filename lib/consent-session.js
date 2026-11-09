const STORAGE_KEY = 'maeumcheck:v1:screening-consent';
const SCHEMA_VERSION = 1;
const VALID_AGE_GROUPS = new Set(['adult', 'youth']);

let memory = null;

function getSessionStorage() {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) return window.sessionStorage;
    if (typeof globalThis !== 'undefined' && globalThis.sessionStorage) return globalThis.sessionStorage;
  } catch {
    // Privacy settings can deny access to the storage getter itself.
  }
  return null;
}

function isConsent(value) {
  return Boolean(value && value.schemaVersion === SCHEMA_VERSION && VALID_AGE_GROUPS.has(value.ageGroup));
}

export function saveScreeningConsent(ageGroup) {
  const consent = { schemaVersion: SCHEMA_VERSION, ageGroup };
  if (!isConsent(consent)) return false;
  memory = consent;
  const storage = getSessionStorage();
  if (!storage) return true;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // The in-memory value supports this running tab without persisting data.
  }
  return true;
}

export function hasScreeningConsent(ageGroup) {
  if (!VALID_AGE_GROUPS.has(ageGroup)) return false;
  if (memory?.ageGroup === ageGroup) return true;
  const storage = getSessionStorage();
  if (!storage) return false;
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || 'null');
    if (!isConsent(parsed) || parsed.ageGroup !== ageGroup) return false;
    memory = parsed;
    return true;
  } catch {
    return false;
  }
}

export function __resetScreeningConsentMemory() {
  memory = null;
}
