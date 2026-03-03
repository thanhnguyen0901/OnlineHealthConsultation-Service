#!/usr/bin/env bash
# check-init-sql.sh — CI guard for prisma/init.sql (RISK-12).
#
# Policy: init.sql is executed once by the MySQL Docker container on first boot.
# It must contain ONLY bootstrap DDL (charset, users, grants).
# Table DDL (CREATE TABLE, ALTER TABLE, DROP TABLE, CREATE INDEX, DROP INDEX)
# belongs exclusively in prisma/migrations/.
#
# This script fails (exit 1) if any forbidden keyword is found, so it can be
# wired into CI/CD pipelines and local db:setup to catch violations early.
#
# Usage:
#   bash scripts/check-init-sql.sh               # uses default path
#   INIT_SQL=./custom/path.sql bash scripts/check-init-sql.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INIT_SQL="${INIT_SQL:-${SCRIPT_DIR}/../prisma/init.sql}"

if [[ ! -f "${INIT_SQL}" ]]; then
  echo "❌  init.sql not found at: ${INIT_SQL}" >&2
  exit 1
fi

# Forbidden DDL patterns (case-insensitive, whole-word matching where possible)
FORBIDDEN_PATTERNS=(
  'CREATE[[:space:]]+TABLE'
  'ALTER[[:space:]]+TABLE'
  'DROP[[:space:]]+TABLE'
  'CREATE[[:space:]]+(UNIQUE[[:space:]]+)?INDEX'
  'DROP[[:space:]]+INDEX'
)

VIOLATIONS=0

# Strip SQL comment lines from the file before checking.
# We remove any line whose first two non-whitespace characters are '--'.
# This correctly handles our policy-box header (-- ║ ...) as well as plain comments.
STRIPPED=$(grep -vE '^[[:space:]]*--' "${INIT_SQL}")

for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
  # Search only the non-comment lines
  matches=$(echo "${STRIPPED}" | grep -inE "${pattern}" || true)
  if [[ -n "${matches}" ]]; then
    echo "❌  Forbidden DDL found in init.sql (pattern: ${pattern}):"
    echo "${matches}" | sed 's/^/    /'
    echo "    → Move this to a Prisma migration in prisma/migrations/ instead."
    VIOLATIONS=$(( VIOLATIONS + 1 ))
  fi
done

if [[ "${VIOLATIONS}" -gt 0 ]]; then
  echo ""
  echo "❌  init.sql policy check FAILED (${VIOLATIONS} violation(s))."
  echo "    See prisma/init.sql header comment for the full policy."
  exit 1
fi

echo "✅  init.sql policy check passed — no table DDL found."
