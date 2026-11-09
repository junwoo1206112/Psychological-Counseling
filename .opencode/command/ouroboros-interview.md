---
description: "Ouroboros A/B/C interview: phase-by-phase design, cross-validation, implementation, and verification"
---

Load the `ouroboros-interview` skill and follow **Path C (Local A/B/C Expert Mode)** for this project.

Topic / change request:
$ARGUMENTS

Required behavior:

1. Start with Phase 0 inventory, then Phase 1 Socratic interview. Ask only human-judgment questions; answer code/web facts yourself.
2. Keep the ambiguity ledger and show it.
3. Run Phase 2 A/B/C cross-validation using `docs/research/expert-a-*`, `expert-b-*`, `expert-c-*`, the current code, and current web facts.
4. Write the result to `docs/ouroboros/seed.md` before changing code.
5. Implement the recommended plan in small steps, fixing issues immediately.
6. Run `npm.cmd run validate`, `npm.cmd test`, `npm.cmd run a11y`, and `npm.cmd run build:web`.
7. Append the phase record and verification result to `docs/ouroboros/phase-log.md`.
8. End with the RFC #1392 breadcrumb line: `◆ <state> → next: <action>`.

Do not diagnose, do not add arbitrary questions or weights, do not add a backend or analytics, and do not delete the project wholesale without explicit approval.
