#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TMP_ROOT="$(mktemp -d)"
trap 'rm -rf "$TMP_ROOT"' EXIT

fail() { echo "HARNESS FAIL: $*" >&2; exit 1; }
expect_failure() { "$@" && fail "expected failure: $*"; }
target_of() { readlink -f "$1"; }

ORIGIN="$TMP_ROOT/origin.git"
SEED="$TMP_ROOT/seed"
APP_DIR="$TMP_ROOT/app with spaces"
RELEASES_DIR="$TMP_ROOT/releases with spaces"
BIN="$TMP_ROOT/bin"
LOG="$TMP_ROOT/commands.log"
export APP_DIR RELEASES_DIR BRANCH=master HARNESS_LOG="$LOG"
mkdir -p "$BIN" "$RELEASES_DIR"

git init --bare -q "$ORIGIN"
git init -q "$SEED"
git -C "$SEED" config user.email harness@example.invalid
git -C "$SEED" config user.name harness
mkdir -p "$SEED/deploy/scripts"
cp "$ROOT/deploy/scripts/release-lib.sh" "$ROOT/deploy/scripts/deploy-contabo.sh" "$ROOT/deploy/scripts/rollback-contabo.sh" "$SEED/deploy/scripts/"
printf 'fixture\n' > "$SEED/version.txt"
git -C "$SEED" add .
git -C "$SEED" commit -qm fixture
git -C "$SEED" branch -M master
git -C "$SEED" remote add origin "$ORIGIN"
git -C "$SEED" push -q -u origin master
git clone -q "$ORIGIN" "$APP_DIR"

cat > "$BIN/npm" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
printf '%s|%s\n' "$PWD" "$*" >> "$HARNESS_LOG"
case "$*" in
  "run build:web")
    mkdir -p dist
    printf 'candidate crisis\n' > dist/index.html
    [[ "${HARNESS_MODE:-}" != build-fail ]] || exit 41
    [[ "${HARNESS_MODE:-}" != missing-index ]] || rm dist/index.html
    ;;
  "run release:ready") [[ "${HARNESS_MODE:-}" != gate-fail ]] || exit 42 ;;
  "run test:e2e") [[ "${HARNESS_MODE:-}" != e2e-fail ]] || exit 44 ;;
esac
EOF
cat > "$BIN/nginx" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
printf 'nginx|%s\n' "$*" >> "$HARNESS_LOG"
[[ "${HARNESS_MODE:-}" != nginx-fail ]] || exit 43
EOF
cat > "$BIN/npx" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
printf 'npx|%s\n' "$*" >> "$HARNESS_LOG"
EOF
chmod +x "$BIN/npm" "$BIN/nginx" "$BIN/npx"
export PATH="$BIN:$PATH"

mkdir -p "$RELEASES_DIR/old/dist" "$RELEASES_DIR/incomplete/dist" "$TMP_ROOT/outside/dist"
printf 'live crisis\n' > "$RELEASES_DIR/old/dist/index.html"
printf 'release=old\n' > "$RELEASES_DIR/old/.release-complete"
printf 'outside\n' > "$TMP_ROOT/outside/dist/index.html"
printf 'incomplete\n' > "$RELEASES_DIR/incomplete/dist/index.html"
ln -s "$RELEASES_DIR/old" "$RELEASES_DIR/current"
ln -s "$RELEASES_DIR/old" "$RELEASES_DIR/previous"

advance_remote() {
  printf '%s\n' "$(date +%s%N)-$RANDOM" > "$SEED/version.txt"
  git -C "$SEED" add version.txt
  git -C "$SEED" commit -qm candidate
  git -C "$SEED" push -q origin master
}
assert_live_unchanged() {
  [[ "$(target_of "$RELEASES_DIR/current")" == "$RELEASES_DIR/old" ]] || fail 'current changed after failed candidate'
  [[ "$(cat "$RELEASES_DIR/current/dist/index.html")" == 'live crisis' ]] || fail 'live crisis asset changed'
}
run_deploy() { HARNESS_MODE="$1" bash "$APP_DIR/deploy/scripts/deploy-contabo.sh"; }

advance_remote
expect_failure run_deploy gate-fail
assert_live_unchanged

advance_remote
expect_failure run_deploy missing-index
assert_live_unchanged

advance_remote
expect_failure run_deploy nginx-fail
assert_live_unchanged

advance_remote
expect_failure run_deploy e2e-fail
assert_live_unchanged

advance_remote
run_deploy success
candidate="$(target_of "$RELEASES_DIR/current")"
[[ "$candidate" == "$RELEASES_DIR"/* && "$candidate" != "$RELEASES_DIR/old" ]] || fail 'successful candidate was not activated'
[[ -f "$candidate/.release-complete" && -f "$candidate/dist/index.html" ]] || fail 'successful candidate is incomplete'
[[ "$(target_of "$RELEASES_DIR/previous")" == "$RELEASES_DIR/old" ]] || fail 'previous release was not retained'
grep -F "$candidate|run build:web" "$LOG" >/dev/null || fail 'build did not run in candidate worktree'
grep -F "$candidate|run test:e2e" "$LOG" >/dev/null || fail 'e2e did not run in candidate worktree'
grep -F 'npx|playwright install' "$LOG" >/dev/null || fail 'playwright browser install did not run'

TARGET_RELEASE=old bash "$APP_DIR/deploy/scripts/rollback-contabo.sh"
[[ "$(target_of "$RELEASES_DIR/current")" == "$RELEASES_DIR/old" ]] || fail 'rollback did not restore old release'
expect_failure env TARGET_RELEASE='../outside' bash "$APP_DIR/deploy/scripts/rollback-contabo.sh"
assert_live_unchanged
expect_failure env TARGET_RELEASE=incomplete bash "$APP_DIR/deploy/scripts/rollback-contabo.sh"
assert_live_unchanged
ln -s "$TMP_ROOT/outside" "$RELEASES_DIR/outside-link"
expect_failure env TARGET_RELEASE=outside-link bash "$APP_DIR/deploy/scripts/rollback-contabo.sh"
assert_live_unchanged

(
  exec 9>"$RELEASES_DIR/.deploy.lock"
  flock -n 9
  touch "$TMP_ROOT/lock-held"
  sleep 2
) &
locker=$!
while [[ ! -f "$TMP_ROOT/lock-held" ]]; do sleep 0.02; done
advance_remote
expect_failure run_deploy success
assert_live_unchanged
wait "$locker"

echo 'Linux deployment harness: PASS'
