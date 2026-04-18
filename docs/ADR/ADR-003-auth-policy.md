# ADR-003: Authorization Policy Model (RBAC + Ownership)

Status: Accepted
Date: 2026-04-18

## Context

SRS requires role-based access and strict data ownership constraints for medical data.

## Decision

Apply layered authorization:
- JWT authentication
- RBAC for role-level control
- Ownership policies for user-scoped resources

## Consequences

- Stronger data protection.
- Additional policy checks required per endpoint.
- Test coverage must include negative access cases.
