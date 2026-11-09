#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/depression-check}"
BRANCH="${BRANCH:-master}"
RELEASES_DIR="${RELEASES_DIR:-${APP_DIR}-releases}"

source "$(dirname "$0")/release-lib.sh"
acquire_release_lock

git -C "$APP_DIR" fetch origin "$BRANCH"
commit="$(git -C "$APP_DIR" rev-parse "origin/$BRANCH")"
release_id="$(date -u +%Y%m%dT%H%M%SZ)-${commit:0:12}"
candidate="$RELEASES_DIR/$release_id"
[[ ! -e "$candidate" ]] || { echo "Candidate already exists: $candidate" >&2; exit 1; }
git -C "$APP_DIR" worktree add --detach "$candidate" "$commit"

cd "$candidate"
npm ci
npm run validate
npm run resources:check
npm test
npm run a11y
npm run skill:check
npm run build:web
if [ "$(id -u)" -eq 0 ]; then
  npx playwright install --with-deps chromium
else
  npx playwright install chromium
fi
npm run test:e2e
npm run release:ready
test -f dist/index.html
printf 'commit=%s\nrelease=%s\n' "$commit" "$release_id" > .release-complete

nginx -t
previous=""
if [[ -L "$RELEASES_DIR/current" ]]; then previous="$(readlink -f "$RELEASES_DIR/current")"; fi
atomic_link "$candidate" "$RELEASES_DIR/current"
if [[ -n "$previous" ]]; then atomic_link "$previous" "$RELEASES_DIR/previous"; fi

echo "Deployment complete: $release_id"
