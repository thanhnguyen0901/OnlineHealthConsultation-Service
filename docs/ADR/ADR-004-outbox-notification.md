# ADR-004: Use Outbox Pattern for Notification Reliability

Status: Accepted
Date: 2026-04-18

## Context

Notification delivery can fail transiently; business events must not be lost.

## Decision

Use outbox table for asynchronous notification events with retry and delivery status tracking.

## Consequences

- Better reliability and observability of notification pipeline.
- Requires outbox processor and retry policy.
