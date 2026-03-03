import { uuidv7 } from 'uuidv7';

/**
 * Generate a new UUID v7 string (RISK-08 — ID strategy).
 *
 * ## ID strategy: application-assigned UUIDv7
 *
 * IDs are ALWAYS generated here in the application before any INSERT.
 * Prisma does NOT auto-generate IDs for this project: every
 * `prisma.<model>.create({ data: { ... } })` — including nested creates
 * inside relation writes — MUST include `id: newId()` explicitly.
 *
 * Why application-assigned?
 *   - Deterministic in tests: IDs can be captured before the write.
 *   - No extra DB round-trip to fetch the generated key.
 *   - UUIDv7 is time-ordered (monotonically increasing) so B-tree index
 *     fragmentation is minimised — close to auto-increment locality.
 *
 * Enforcement rules:
 *   1. Every `prisma.<model>.create()` must pass `id: newId()`.
 *   2. Nested creates inside relation writes also need `id: newId()`.
 *   3. Do NOT add `@default(uuid())` to the Prisma schema — IDs are
 *      application-issued, never DB-issued.
 *   4. Lint / code-review: reject any PR that omits `id: newId()` in a
 *      create payload targeting a model whose PK is CHAR(36).
 *
 * Format: xxxxxxxx-xxxx-7xxx-yxxx-xxxxxxxxxxxx  (36 chars, fits CHAR(36))
 */
export function newId(): string {
  return uuidv7();
}
