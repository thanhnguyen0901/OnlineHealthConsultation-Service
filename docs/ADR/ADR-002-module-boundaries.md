# ADR-002: Modular Monolith with Explicit Domain Boundaries

Status: Accepted
Date: 2026-04-18

## Context

MVP needs fast delivery but clear separation for long-term maintainability.

## Decision

Use Modular Monolith on NestJS with explicit bounded contexts and clean layering.

## Consequences

- Better code ownership by module.
- Easier migration to microservices later if required.
- Requires stricter API contracts between modules.
