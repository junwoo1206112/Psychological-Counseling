const STORAGE_KEY = 'maeumcheck:v1:history';
const RISK_TIERS = new Set(['acute', 'urgent', 'routine', 'monitor', 'low']);

function isScore(value, max) {
  return Number.isInteger(value) && value >= 0 && value <= max;
}

export function isHistoryEntry(entry) {
  const validDate = typeof entry?.date === 'string' && !Number.isNaN(Date.parse(entry.date));
  return Boolean(
    entry
    && typeof entry.id === 'string'
    && entry.id.length > 0
    && validDate
    && ['PHQ-9', 'PHQ-A'].includes(entry.phq9?.instrument)
    && isScore(entry.phq9?.total, 27)
    && typeof entry.phq9?.bandId === 'string'
    && typeof entry.phq9?.bandLabel === 'string'
    && isScore(entry.gad7?.total, 21)
    && typeof entry.gad7?.bandId === 'string'
    && typeof entry.gad7?.bandLabel === 'string'
    && typeof entry.asq?.positive === 'boolean'
    && typeof entry.asq?.acute === 'boolean'
    && RISK_TIERS.has(entry.risk?.tier)
    && typeof entry.risk?.label === 'string',
  );
}

export function isHistory(history) {
  return Boolean(
    history
    && history.schemaVersion === 1
    && Array.isArray(history.entries)
    && history.entries.length <= 50
    && history.entries.every(isHistoryEntry),
  );
}

function getStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  } catch {
    // Privacy settings can deny access before any storage method is called.
  }
  return null;
}

export function isStorageAvailable() {
  return Boolean(getStorage());
}

export function loadHistory() {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isHistory(parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveHistory(history) {
  const storage = getStorage();
  if (!storage || !isHistory(history)) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(history));
    return true;
  } catch {
    return false;
  }
}

export function clearHistory() {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function createEmptyHistory(consent = null) {
  return {
    schemaVersion: 1,
    consent,
    locale: 'ko-KR',
    entries: [],
  };
}

export function addEntry(history, entry) {
  if (!history || history.schemaVersion !== 1) {
    history = createEmptyHistory();
  }
  const next = {
    ...history,
    entries: [...history.entries, entry].slice(-50),
  };
  return next;
}

export function buildEntry({ phq9, gad7, asq, risk }) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
    phq9: {
      instrument: phq9?.instrument ?? 'PHQ-9',
      total: phq9?.total ?? null,
      bandId: phq9?.band?.id ?? null,
      bandLabel: phq9?.band?.label ?? null,
    },
    gad7: {
      total: gad7?.total ?? null,
      bandId: gad7?.band?.id ?? null,
      bandLabel: gad7?.band?.label ?? null,
    },
    asq: {
      positive: asq?.positive ?? false,
      acute: asq?.acute ?? false,
    },
    risk: {
      tier: risk?.tier ?? 'low',
      label: risk?.label ?? '',
    },
  };
}

export function deleteEntry(history, entryId) {
  if (!history) return null;
  return {
    ...history,
    entries: history.entries.filter((entry) => entry.id !== entryId),
  };
}
