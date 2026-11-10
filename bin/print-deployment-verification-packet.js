import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDeploymentVerificationPacket } from '../lib/deployment-verification-packet.js';
import { calculateReleaseScopeFingerprint } from '../lib/release-scope-fingerprint.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fingerprint = calculateReleaseScopeFingerprint(root);

console.log(buildDeploymentVerificationPacket(fingerprint));
