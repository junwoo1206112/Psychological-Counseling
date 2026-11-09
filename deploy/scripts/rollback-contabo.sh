#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/depression-check}"
RELEASES_DIR="${RELEASES_DIR:-${APP_DIR}-releases}"
TARGET_RELEASE="${TARGET_RELEASE:-}"
[[ "$TARGET_RELEASE" =~ ^[A-Za-z0-9._-]+$ ]] || { echo "Set TARGET_RELEASE to a release directory name." >&2; exit 1; }

source "$(dirname "$0")/release-lib.sh"
acquire_release_lock
target="$(assert_release_target "$RELEASES_DIR/$TARGET_RELEASE")"
previous=""
if [[ -L "$RELEASES_DIR/current" ]]; then previous="$(readlink -f "$RELEASES_DIR/current")"; fi
atomic_link "$target" "$RELEASES_DIR/current"
if [[ -n "$previous" ]]; then atomic_link "$previous" "$RELEASES_DIR/previous"; fi
echo "Rollback complete: $(basename "$target")"
