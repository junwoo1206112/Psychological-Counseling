export function parseEvidenceDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date;
}

export function selectConservativeLatest(previous, candidate) {
  if (!previous || candidate.date > previous.date) return candidate;
  if (candidate.date.getTime() === previous.date.getTime() && candidate.result === 'FAIL') return candidate;
  return previous;
}
