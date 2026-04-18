# Prisma Migrations

This directory will contain PostgreSQL migrations generated from `prisma/schema.prisma`.

Planned next command sequence once tooling is available:

1. `npm run prisma:generate`
2. `npm run prisma:migrate:create -- --name init_postgres`
3. `npm run prisma:migrate:deploy`
4. `npm run prisma:seed`
