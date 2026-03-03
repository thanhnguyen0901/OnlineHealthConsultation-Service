#!/usr/bin/env bash
# apply-triggers.sh — Apply all triggers.sql files from Prisma migration folders.
#
# Prisma's migrate runner cannot execute files that contain the DELIMITER
# directive (used by MySQL to define stored procedures and triggers).
# This script handles that gap by piping each triggers.sql directly to the
# mysql CLI, which supports DELIMITER natively.
#
# Usage: bash scripts/apply-triggers.sh
# Environment: DATABASE_URL must be set (e.g. via .env loaded by dotenv-cli,
#              or exported in the shell before calling this script).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# ---------------------------------------------------------------------------
# 1. Resolve DATABASE_URL — try the environment first, then fall back to .env
# ---------------------------------------------------------------------------
if [[ -z "${DATABASE_URL:-}" ]]; then
  ENV_FILE="${REPO_ROOT}/.env"
  if [[ -f "${ENV_FILE}" ]]; then
    # Export only DATABASE_URL from .env (avoid clobbering the whole environment)
    DATABASE_URL=$(grep -m1 '^DATABASE_URL=' "${ENV_FILE}" | cut -d'=' -f2- | tr -d '"' | tr -d "'")
    export DATABASE_URL
  fi
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "❌  DATABASE_URL is not set and could not be read from .env" >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# 2. Parse mysql connection parameters from DATABASE_URL
#    Expected format: mysql://user:password@host:port/database
# ---------------------------------------------------------------------------
# Strip the mysql:// scheme
_url="${DATABASE_URL#mysql://}"
# user:password@host:port/database
_userinfo="${_url%%@*}"
_hostinfo="${_url##*@}"

DB_USER="${_userinfo%%:*}"
DB_PASS="${_userinfo#*:}"
_hostport="${_hostinfo%%/*}"
DB_NAME="${_hostinfo##*/}"
# Remove any query-string params from DB_NAME
DB_NAME="${DB_NAME%%\?*}"

DB_HOST="${_hostport%%:*}"
DB_PORT="${_hostport##*:}"
# If no port was present the split will have left host == port
if [[ "${DB_HOST}" == "${DB_PORT}" ]]; then
  DB_PORT="3306"
fi

# ---------------------------------------------------------------------------
# 3. Find and apply all triggers.sql files (sorted by migration folder name)
# ---------------------------------------------------------------------------
TRIGGER_FILES=$(find "${REPO_ROOT}/prisma/migrations" -name "triggers.sql" | sort)

if [[ -z "${TRIGGER_FILES}" ]]; then
  echo "ℹ️   No triggers.sql files found — nothing to apply."
  exit 0
fi

MYSQL_CMD_BASE="mysql -h${DB_HOST} -P${DB_PORT} -u${DB_USER} -p${DB_PASS} ${DB_NAME}"

echo "🔧  Applying MySQL triggers..."

while IFS= read -r trigger_file; do
  echo "    → ${trigger_file#${REPO_ROOT}/}"
  # shellcheck disable=SC2086
  ${MYSQL_CMD_BASE} < "${trigger_file}"
done <<< "${TRIGGER_FILES}"

echo "✅  All triggers applied successfully."
