#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/depression-check}"
BRANCH="${BRANCH:-master}"

cd "$APP_DIR"
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"
npm ci
npm run build:web
nginx -t
sudo systemctl reload nginx

echo "Deployment complete."
