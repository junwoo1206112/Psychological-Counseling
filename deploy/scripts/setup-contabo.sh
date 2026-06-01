#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/depression-check}"
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
git fetch origin
git checkout master
git pull origin master
npm ci
npm run build:web

cp deploy/nginx/depression-check.conf /etc/nginx/sites-available/depression-check
sed -i "s/__DOMAIN__/$DOMAIN/g" /etc/nginx/sites-available/depression-check
sed -i "s/__WWW_DOMAIN__/$WWW_DOMAIN/g" /etc/nginx/sites-available/depression-check
ln -sf /etc/nginx/sites-available/depression-check /etc/nginx/sites-enabled/depression-check
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx

echo "Done. Point your DNS A records to this server IP, then run:"
echo "sudo certbot --nginx -d $DOMAIN -d $WWW_DOMAIN"
