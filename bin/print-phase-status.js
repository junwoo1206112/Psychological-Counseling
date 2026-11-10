import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPhaseStatus, formatPhaseStatus } from '../lib/phase-status.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
console.log(formatPhaseStatus(buildPhaseStatus(root)));
