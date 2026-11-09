#!/usr/bin/env bash
set -euo pipefail

release_root() {
  realpath -m "${RELEASES_DIR:-${APP_DIR}-releases}"
}

acquire_release_lock() {
  local root
  root="$(release_root)"
  mkdir -p "$root"
  exec 9>"$root/.deploy.lock"
  flock -n 9 || { echo "Another deployment or rollback is already running." >&2; exit 1; }
}

atomic_link() {
  local target="$1" link="$2" temporary="${2}.next-$$"
  ln -s "$target" "$temporary"
  mv -Tf "$temporary" "$link"
}

assert_release_target() {
  local target="$1" root resolved
  root="$(release_root)"
  resolved="$(realpath -e "$target")"
  case "$resolved" in
    "$root"/*) ;;
    *) echo "Refusing a release outside RELEASES_DIR." >&2; exit 1 ;;
  esac
  [[ -f "$resolved/.release-complete" && -f "$resolved/dist/index.html" ]] || {
    echo "Release is incomplete or has no static entry point." >&2; exit 1;
  }
  printf '%s' "$resolved"
}
