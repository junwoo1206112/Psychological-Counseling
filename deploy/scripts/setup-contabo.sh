#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/depression-check}"
RELEASES_DIR="${RELEASES_DIR:-${APP_DIR}-releases}"
export APP_DIR RELEASES_DIR
REPO_URL="${REPO_URL:-https://github.com/junwoo1206112/Psychological-Counseling.git}"
DOMAIN="${DOMAIN:-example.com}"
WWW_DOMAIN="${WWW_DOMAIN:-www.example.com}"

if [ "$(id -u)" -ne 0 ]; then
  echo "Please run this script with sudo."
  exit 1
fi

apt update
apt install -y curl git nginx ca-certificates

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt install -y nodejs
fi

mkdir -p "$(dirname "$APP_DIR")"

if [ ! -d "$APP_DIR/.git" ]; then
  git clone "$REPO_URL" "$APP_DIR"
fi

cd "$APP_DIR"
mkdir -p "$RELEASES_DIR"

# A candidate must pass in an isolated worktree before this new site is enabled.
bash "$APP_DIR/deploy/scripts/deploy-contabo.sh"

NGINX_CONF="/etc/nginx/sites-available/depression-check"
if [ -e "$NGINX_CONF" ]; then
  if [ "${FORCE_CONF_OVERWRITE:-0}" = "1" ]; then
    backup="${NGINX_CONF}.bak.$(date -u +%Y%m%dT%H%M%SZ)"
    cp "$NGINX_CONF" "$backup"
    echo "Backed up existing config to $backup (FORCE_CONF_OVERWRITE=1)."
    install_conf=1
  else
    install_conf=0
    echo "NOTE: $NGINX_CONF already exists; keeping it to preserve certbot/TLS edits."
    echo "To replace it, review deploy/nginx/depression-check.conf and re-run with FORCE_CONF_OVERWRITE=1 (a timestamped .bak backup is created)."
  fi
else
  install_conf=1
fi

if [ "$install_conf" = "1" ]; then
  cp deploy/nginx/depression-check.conf "$NGINX_CONF"
  sed -i "s/__DOMAIN__/$DOMAIN/g" "$NGINX_CONF"
  sed -i "s/__WWW_DOMAIN__/$WWW_DOMAIN/g" "$NGINX_CONF"
  sed -i "s|__RELEASE_ROOT__|$RELEASES_DIR|g" "$NGINX_CONF"
fi
ln -sf /etc/nginx/sites-available/depression-check /etc/nginx/sites-enabled/depression-check
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx

echo "Done. Point your DNS A records to this server IP, then run:"
echo "sudo certbot --nginx -d $DOMAIN -d $WWW_DOMAIN"
