# ADR-001: Choose PostgreSQL as the Single RDBMS

Status: Accepted
Date: 2026-04-18

## Context

Codebase had inconsistent DB artifacts. New architecture requires one consistent relational database.

## Decision

Adopt PostgreSQL as the only RDBMS across all environments.

## Consequences

- Rebuild prisma schema/migrations from scratch.
- Remove MySQL-specific assumptions.
- Simplify deployment and troubleshooting.
