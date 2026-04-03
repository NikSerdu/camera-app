#!/bin/sh
set -e
if [ "${PRISMA_DB_PUSH_ON_START:-false}" = "true" ]; then
  npx prisma db push
fi
exec node dist/src/main.js
