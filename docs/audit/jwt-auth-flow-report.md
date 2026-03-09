# JWT Auth Flow Report — OnlineHealthConsultation-Service

> **Generated:** 2026-03-03  
> **Analyst role:** Senior Backend Engineer — Auth Security  
> **Scope:** All auth-related code in `src/` and `src/config/`

---

## Table of Contents

1. [Current JWT Flow (As-Is)](#1-current-jwt-flow-as-is)
   - [Token Architecture](#11-token-architecture)
   - [Endpoint Map](#12-endpoint-map)
   - [Register Flow](#13-register-flow)
   - [Login Flow](#14-login-flow)
   - [Access Protected Endpoint Flow](#15-access-protected-endpoint-flow)
   - [Refresh Flow](#16-refresh-flow)
   - [Logout Flow](#17-logout-flow)
2. [Gaps vs Best Practices](#2-gaps-vs-best-practices)
3. [Issue List (Numbered, Prioritized)](#3-issue-list-numbered-prioritized)
4. [Recommended Target Flow – HttpOnly Cookie (Option 1)](#4-recommended-target-flow--httponly-cookie-option-1)
5. [Required Backend Changes to Support Option 1](#5-required-backend-changes-to-support-option-1)

---

## 1. Current JWT Flow (As-Is)

### 1.1 Token Architecture

| Property | Access Token | Refresh Token |
|---|---|---|
| **Library** | `jsonwebtoken` | `jsonwebtoken` |
| **Algorithm** | HS256 (default) | HS256 (default) |
| **Secret source** | `env.JWT_SECRET` | `env.JWT_REFRESH_SECRET` |
| **Secret validation** | Zod schema — `min(1)` required | Zod schema — `min(1)` required |
| **TTL (env default)** | `15m` (`JWT_ACCESS_EXPIRE`) | `7d` (`JWT_REFRESH_EXPIRE`) |
| **Payload claims** | `{ id, email, role, iat, exp }` | `{ id, email, role, iat, exp, jti }` |
| **Transport** | `Authorization: Bearer <token>` header | `httpOnly` cookie, `path=/api/auth/refresh` |
| **Storage (server)** | Stateless — not stored | SHA-256 hash stored in `user_sessions` table |
| **Rotation** | N/A | **Yes** — old session revoked, new issued in `$transaction` |
| **Revocation** | Indirect: `isActive` + `deletedAt` DB check per request | **Yes** — `revokedAt` timestamp in `user_sessions` |
| **Token-reuse detection** | N/A | **Yes** — revoked token reuse triggers full session wipe |

**Source files:**
- Token sign/verify: [`src/utils/jwt.ts`](../../src/utils/jwt.ts)
- Token TTL/secrets: [`src/config/env.ts`](../../src/config/env.ts)
- Session storage: [`src/services/auth.service.ts`](../../src/services/auth.service.ts) — `createSession()`
- Cookie settings: [`src/controllers/auth.controller.ts`](../../src/controllers/auth.controller.ts)

---

### 1.2 Endpoint Map

| Method | Path | Auth | Rate Limiter | Handler |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | `authRateLimiter` (10/15min prod) | `AuthController.register` |
| `POST` | `/api/auth/login` | Public | `authRateLimiter` (10/15min prod) | `AuthController.login` |
| `POST` | `/api/auth/refresh` | Public (cookie) | `refreshRateLimiter` (5/15min prod) | `AuthController.refresh` |
| `POST` | `/api/auth/logout` | Public (cookie) | ❌ **None** | `AuthController.logout` |
| `GET` | `/api/auth/me` | `authenticate` | Global `apiRateLimiter` | `AuthController.me` |

Source: [`src/routes/auth.routes.ts`](../../src/routes/auth.routes.ts)

---

### 1.3 Register Flow

```
Client
  │
  ├─ POST /api/auth/register
  │   Body: { email, password, firstName/fullName, lastName?, role,
  │           specialty?, bio?, dateOfBirth?, gender?, phone?, address? }
  │
  ▼
[authRateLimiter] → max 10 req / 15 min per IP (prod)
  │
  ▼
[validate(registerSchema)] – Zod: email format, password min-6,
  │                           role ∈ {PATIENT,DOCTOR}
  ▼
AuthController.register
  ├─ normalizeRegisterPayload()   – split fullName → firstName + lastName
  ├─ sanitizeTextFields()         – trim + truncate firstName(100), lastName(100),
  │                                 bio(5000), address(500)
  ├─ extract userAgent, req.ip
  │
  ▼
AuthService.register
  ├─ prisma.user.findUnique({ email }) → 409 if exists
  ├─ hashPassword(password, bcryptRounds=10)
  ├─ prisma.user.create + nested PatientProfile or DoctorProfile
  ├─ signAccessToken({ id, email, role })   → JWT, exp=15m, secret=JWT_SECRET
  ├─ signRefreshToken({ id, email, role, iat, jti }) → JWT, exp=7d, secret=JWT_REFRESH_SECRET
  └─ createSession(userId, refreshToken, userAgent, ip)
       └─ SHA-256(refreshToken) → user_sessions { id, userId, refreshTokenHash,
                                                   expiresAt=now+7d, userAgent, ipAddress }
  │
  ▼
AuthController.register (response)
  ├─ res.cookie('refreshToken', refreshToken, {
  │    httpOnly: true,
  │    secure:   COOKIE_SECURE (default: false ⚠),
  │    sameSite: COOKIE_SAMESITE (default: 'lax'),
  │    maxAge:   7 * 24 * 60 * 60 * 1000,   // 7 days (ms)
  │    path:     '/api/auth/refresh',
  │    domain:   COOKIE_DOMAIN (optional)
  │  })
  └─ 201 { accessToken, user: { id, email, firstName, lastName, role, profile } }
       ↑ refreshToken removed from body before response
```

---

### 1.4 Login Flow

```
Client
  │
  ├─ POST /api/auth/login
  │   Body: { email, password }
  │
  ▼
[authRateLimiter] → max 10 req / 15 min per IP (prod)
  │
  ▼
[validate(loginSchema)] – Zod: email format, password non-empty
  │
  ▼
AuthService.login
  ├─ prisma.user.findUnique({ email }) → 401 "Invalid credentials" if not found
  │   (NOTE: same error for wrong email and wrong password — prevents user enumeration ✅)
  ├─ user.isActive check → 403 ACCOUNT_DEACTIVATED if false
  ├─ comparePassword(password, passwordHash)  → 401 if mismatch
  ├─ signAccessToken({ id, email, role })     → JWT exp=15m
  ├─ signRefreshToken({ id, email, role, iat, jti }) → JWT exp=7d
  ├─ createSession(...)                       → user_sessions row
  └─ cleanupUserSessions(userId)  [fire-and-forget] → prune dead sessions for this user
  │
  ▼
AuthController.login (response)
  ├─ Set refreshToken httpOnly cookie (same options as Register)
  └─ 200 { accessToken, user: { ... } }
```

---

### 1.5 Access Protected Endpoint Flow

```
Client
  │
  ├─ ANY /api/protected/...
  │   Header: Authorization: Bearer <accessToken>
  │
  ▼
[authenticate middleware]  ← src/middlewares/auth.middleware.ts
  ├─ Parse Authorization header → 401 if missing/malformed
  ├─ verifyAccessToken(token)
  │     └─ jwt.verify(token, JWT_SECRET) → 401 if invalid/expired
  ├─ prisma.user.findUnique({ id: payload.id, select: { isActive, deletedAt } })
  │     └─ 403 ACCOUNT_DEACTIVATED if !isActive || deletedAt !== null
  └─ req.user = { id, email, role }
  │
  ▼
[requireRole(['DOCTOR']) / requirePatient / requireAdmin]  ← role.middleware.ts
  └─ 403 FORBIDDEN if req.user.role not in allowedRoles
  │
  ▼
Controller → Service → Prisma → Response
```

> **Key design note:** The `authenticate` middleware does a **DB round-trip on every request** to re-check `isActive` and `deletedAt`. This means account deactivations take effect immediately without waiting for the 15-minute access token TTL. Trade-off: +1 DB query per authenticated request.

---

### 1.6 Refresh Flow

```
Client
  │
  ├─ POST /api/auth/refresh
  │   Cookie: refreshToken=<jwt>   (httpOnly, path=/api/auth/refresh)
  │   Body:   {} (body.refreshToken is validated by schema but IGNORED by controller)
  │
  ▼
[refreshRateLimiter] → max 5 req / 15 min per IP (prod)
  │
  ▼
AuthController.refresh
  ├─ Read refreshToken from req.cookies.refreshToken
  │     └─ 401 REFRESH_TOKEN_MISSING if absent
  │
  ▼
AuthService.refresh
  ├─ verifyRefreshToken(refreshToken)           → 401 INVALID_REFRESH_TOKEN if JWT invalid/expired
  ├─ hash = SHA-256(refreshToken)
  ├─ session = prisma.userSession.findUnique({ refreshTokenHash: hash })
  │     └─ 401 INVALID_REFRESH_TOKEN if not found
  ├─ session.expiresAt < now                    → 401 REFRESH_TOKEN_EXPIRED
  ├─ session.revokedAt !== null                 → TOKEN REUSE DETECTED
  │     └─ revokeAllUserSessions(userId)        ← all sessions wiped
  │     └─ 401 TOKEN_REUSE_DETECTED
  │
  ├─ signAccessToken({ id, email, role })       → new accessToken (exp=15m)
  ├─ signRefreshToken({ id, email, role, iat, jti }) → new refreshToken (exp=7d)
  │
  └─ prisma.$transaction([
       userSession.update({ id: session.id, revokedAt: now }),   // revoke old
       userSession.create({ refreshTokenHash: SHA-256(new), expiresAt: now+7d })  // create new
     ])
  │
     cleanupUserSessions(userId) [fire-and-forget]
  │
  ▼
AuthController.refresh (response)
  ├─ Set NEW refreshToken httpOnly cookie
  └─ 200 { accessToken }   ← no user profile in refresh response
```

---

### 1.7 Logout Flow

```
Client
  │
  ├─ POST /api/auth/logout
  │   Cookie: refreshToken=<jwt>
  │
  ▼
AuthController.logout
  ├─ Read req.cookies.refreshToken
  │     └─ 401 REFRESH_TOKEN_MISSING if absent
  │
  ▼
AuthService.logout
  └─ prisma.userSession.updateMany({
       where: { refreshTokenHash: SHA-256(refreshToken), revokedAt: null },
       data:  { revokedAt: now }
     })
  │
  ▼
AuthController.logout (response)
  ├─ res.clearCookie('refreshToken', { path: '/api/auth/refresh', ... })
  └─ 200 { message: 'Logged out successfully' }
```

> **Note:** `/auth/logout` has **no `authenticate` middleware** — it does not require a valid access token. Only a valid `refreshToken` cookie is needed. Access tokens already issued remain valid until their 15-minute TTL, with no server-side invalidation mechanism beyond the `isActive` DB check.

---

## 2. Gaps vs Best Practices

| # | Area | Status | Notes |
|---|---|---|---|
| Access / refresh token separation | ✅ Implemented | Separate secrets, separate TTLs |
| Refresh token rotation | ✅ Implemented | `$transaction([revoke old, create new])` |
| Token reuse detection | ✅ Implemented | Triggers full session wipe |
| Server-side session revocation | ✅ Implemented | `user_sessions` table with `revokedAt` |
| Refresh token stored hashed | ✅ Implemented | SHA-256 — raw token never persisted |
| HttpOnly cookie for refresh token | ✅ Implemented | `path=/api/auth/refresh` scoping |
| Credential brute-force protection | ✅ Implemented | `authRateLimiter` 10/15min prod |
| Security headers | ✅ Implemented | `helmet` (CSP production-only) |
| CORS credentials | ✅ Implemented | `credentials: true` + origin whitelist |
| User enumeration protection | ✅ Implemented | Same error for wrong email / wrong password |
| Password hashing | ✅ bcrypt | `BCRYPT_ROUNDS` default 10 (min 12 recommended) |
| `COOKIE_SECURE` default | ⚠️ Defaults to `false` | Must be `true` in production |
| `trust proxy` for rate limiting | ❌ Missing | Rate limiter may be bypassed behind reverse proxy |
| `lastUsedAt` session tracking | ❌ Broken | Written at creation but never updated |
| Session DB expiry ↔ JWT TTL sync | ❌ Drift risk | `createSession` hardcodes 7 days, ignores `JWT_REFRESH_EXPIRE` |
| PII in JWT payload | ⚠️ `email` claim | Email changes not reflected until token expires |
| Logout no `authenticate` required | ⚠️ By design | Acceptable but access token stays valid 15m post-logout |
| Rate limiting on `/auth/logout` | ❌ Missing | Endpoint has no rate limiter |
| CSRF protection | ✅ Mitigated | `sameSite=lax` + cookie scoped to `POST` `/api/auth/refresh` |
| Algorithm pinning (RS256 / ES256) | ⚠️ HS256 only | Symmetric secret; asymmetric preferred for multi-service |
| `jti` stored and verified | ❌ Not verified | `jti` generated in token but not stored or checked in DB |

---

## 3. Issue List (Numbered, Prioritized)

---

### ISSUE-01 · `createSession` hardcodes 7-day expiry — diverges from `JWT_REFRESH_EXPIRE`

**Severity:** 🔴 HIGH  
**File:** [`src/services/auth.service.ts`](../../src/services/auth.service.ts) — `createSession()` method (~line 52)

```typescript
// CURRENT — hardcoded
const expiresAt = new Date();
expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
```

Also hardcoded in `AuthService.refresh()` (~line 262):
```typescript
newExpiresAt.setDate(newExpiresAt.getDate() + 7);
```

**Risk:** If `JWT_REFRESH_EXPIRE` is changed to e.g. `30d`, the DB session row expires in 7 days while the JWT itself is valid for 30 days — the DB lookup will reject a perfectly valid JWT. Conversely, setting `JWT_REFRESH_EXPIRE=1d` issues a 7d DB session for a 1d JWT, giving a false sense of revocability.

**Fix:**
```typescript
import ms from 'ms'; // already available via jsonwebtoken dependency

private sessionTtlMs(): number {
  // Parse env.JWT_REFRESH_EXPIRE ("7d", "24h", etc.) to milliseconds
  return ms(env.JWT_REFRESH_EXPIRE as string);
}

private async createSession(...) {
  const expiresAt = new Date(Date.now() + this.sessionTtlMs());
  // ...
}
```

---

### ISSUE-02 · `lastUsedAt` never updated after session creation

**Severity:** 🔴 HIGH  
**File:** [`src/services/auth.service.ts`](../../src/services/auth.service.ts) — `refresh()` method; [`prisma/schema.prisma`](../../prisma/schema.prisma) — `UserSession.lastUsedAt`

**Risk:** The `lastUsedAt` field is written once at `createSession()` time (`DEFAULT now()`) and is never updated when the session is actually used (on token refresh). This makes it impossible to:
- Detect idle/abandoned sessions.
- Audit "last activity" per device/session.
- Implement idle-session expiry policies.

**Fix:** In `AuthService.refresh()`, include a `lastUsedAt` update inside the existing `$transaction`:
```typescript
await prisma.$transaction([
  prisma.userSession.update({
    where: { id: session.id },
    data: { revokedAt: new Date() },
  }),
  prisma.userSession.create({
    data: {
      id: newId(),
      userId: session.userId,
      refreshTokenHash: newRefreshTokenHash,
      expiresAt: newExpiresAt,
      lastUsedAt: new Date(), // ← add this
      userAgent,
      ipAddress,
    },
  }),
]);
```

---

### ISSUE-03 · Rate limiter bypassed behind reverse proxy — `trust proxy` not configured

**Severity:** 🔴 HIGH  
**File:** [`src/app.ts`](../../src/app.ts) — Express application setup  
**Also affected:** [`src/middlewares/rateLimiter.middleware.ts`](../../src/middlewares/rateLimiter.middleware.ts)

**Risk:** `express-rate-limit` identifies clients by `req.ip`. When the app runs behind nginx, Docker NAT, or any reverse proxy (which it does — see `docker-compose.yml`), `req.ip` resolves to the **proxy's IP address**, not the client's. Every client shares the same IP, meaning:
- All real clients share one rate-limit bucket.
- A single attacker can exhaust the shared bucket and deny service to all users.
- The brute-force protection on `/auth/login` is effectively disabled.

**Fix:** Add trust proxy configuration in [`src/app.ts`](../../src/app.ts) before any middleware:
```typescript
// Trust first proxy (nginx / Docker). Set to the number of proxies or 'loopback'.
app.set('trust proxy', 1);
```
Then verify `req.ip` correctly resolves to the real client IP with `X-Forwarded-For` header.

---

### ISSUE-04 · `COOKIE_SECURE` defaults to `false` — refresh tokens sent over HTTP

**Severity:** 🟠 MEDIUM  
**File:** [`src/config/env.ts`](../../src/config/env.ts) — line `COOKIE_SECURE: z.string().default('false')...`  

**Risk:** In production deployments where `COOKIE_SECURE` is not explicitly set to `true`, the `refreshToken` cookie is transmitted over plain HTTP. An attacker on the same network can steal the refresh token via a passive sniff — full session compromise.

**Fix 1 (recommended):** Change the default to `true` and require operators to explicitly opt out:
```typescript
COOKIE_SECURE: z.string().default('true').transform((val) => val === 'true'),
```

**Fix 2 (defence-in-depth):** Add a startup assertion in production:
```typescript
if (env.NODE_ENV === 'production' && !env.COOKIE_SECURE) {
  console.error('FATAL: COOKIE_SECURE must be true in production');
  process.exit(1);
}
```

---

### ISSUE-05 · `email` PII claim in JWT payload — stale data & privacy risk

**Severity:** 🟠 MEDIUM  
**File:** [`src/utils/jwt.ts`](../../src/utils/jwt.ts) — `TokenPayload` interface; [`src/services/auth.service.ts`](../../src/services/auth.service.ts) — all `signAccessToken(...)` calls

**Risk:**
1. **Privacy:** The email is embedded in the JWT body. JWTs are only base64-encoded — not encrypted. Anyone who intercepts or reads a stored access token can extract the user's email without any key.
2. **Staleness:** If a user changes their email (feature not currently present but architecturally possible), access tokens issued before the change will continue to carry the old email claim for up to 15 minutes.
3. **Logging leakage:** Any server that logs the raw `Authorization` header inadvertently logs PII.

**Fix:** Remove `email` from the JWT payload. Only `id` and `role` are needed for access control. The `authenticate` middleware already does a DB lookup — `email` can be fetched there if needed.
```typescript
export interface TokenPayload {
  id: string;
  role: string;
  // email removed
}
```

---

### ISSUE-06 · No rate limiter on `/auth/logout`

**Severity:** 🟠 MEDIUM  
**File:** [`src/routes/auth.routes.ts`](../../src/routes/auth.routes.ts) — line `router.post('/logout', ...)`

**Risk:** The logout endpoint triggers a DB write (`userSession.updateMany`) on every request. Without a rate limiter, an attacker holding a valid refresh token cookie can spam the endpoint, causing excessive DB writes. Additionally, if logout logic ever adds more operations (email notification, audit log), the lack of rate limiting becomes more dangerous.

**Fix:** Apply `authRateLimiter` (same as login):
```typescript
router.post('/logout', authRateLimiter, validate({ body: refreshSchema.shape.body }), authController.logout);
```

---

### ISSUE-07 · `refreshSchema` body.refreshToken accepted in schema but silently ignored

**Severity:** 🟠 MEDIUM  
**Files:**  
- [`src/controllers/auth.controller.ts`](../../src/controllers/auth.controller.ts) — `refresh` handler reads **only** `req.cookies.refreshToken`  
- [`src/routes/auth.routes.ts`](../../src/routes/auth.routes.ts) — `validate({ body: refreshSchema.shape.body })` runs schema validation  
- [`src/controllers/auth.controller.ts`](../../src/controllers/auth.controller.ts) — `refreshSchema.body.refreshToken` is `optional()`

**Risk:** The validation schema implies the frontend *can* send `refreshToken` in the body. The controller silently discards it and reads only the cookie. This causes:
- **Misleading API contract:** FE developers may send the token in the body (e.g. from `localStorage`) and get a cryptic 401 with no explanation.
- **False security assurance:** The schema `optional()` might be interpreted as intentional fallback support, leading a future developer to accidentally add body-fallback support and break the cookie-only model.

**Fix Option A (preferred):** Remove body schema for refresh entirely; validation is pointless if body is ignored:
```typescript
// auth.routes.ts
router.post('/refresh', refreshRateLimiter, authController.refresh);
```

**Fix Option B:** Keep schema but add a clear comment and change to explicit rejection if token is in body:
```typescript
// In AuthController.refresh:
if (req.body?.refreshToken) {
  throw new AppError('Refresh token must be sent via httpOnly cookie, not request body', 400, 'INVALID_REQUEST');
}
```

---

### ISSUE-08 · `jti` generated in refresh token but never stored or verified

**Severity:** 🟡 LOW  
**File:** [`src/utils/jwt.ts`](../../src/utils/jwt.ts) — `signRefreshToken()`

```typescript
jti: `${Date.now()}-${Math.random().toString(36).substring(7)}`
```

**Risk:** The `jti` (JWT ID) claim is a standard mechanism for token revocation (allow-list/deny-list by ID). Here it is generated randomly and embedded in the JWT but:
- It is never persisted to the `user_sessions` table.
- It is never verified during the refresh flow.
- The actual revocation tracking is handled by the SHA-256 token hash — making `jti` dead code that inflates token size.

**Fix Option A:** Remove `jti` from `signRefreshToken` since revocation is already handled by hash lookup.

**Fix Option B (if you want proper jti-based revocation):** Store `jti` in `user_sessions.jwtId` and verify it during `AuthService.refresh()`:
```typescript
// In createSession:
data: { ..., jwtId: jti }
// In refresh():
if (session.jwtId !== payload.jti) throw ...
```

---

### ISSUE-09 · `decodeToken` exported from `jwt.ts` — unsafe utility exposed

**Severity:** 🟡 LOW  
**File:** [`src/utils/jwt.ts`](../../src/utils/jwt.ts) — `decodeToken()` function

**Risk:** `jwt.decode()` returns the payload **without signature verification**. The exported function is documented as "for debugging" but is accessible across the entire codebase. A future developer could mistakenly use it in an auth code path (e.g. extracting `id` from a token without verifying it), allowing JWT forgery.

**Fix:** Remove the export or add a runtime guard:
```typescript
/** @internal — Debug only. Never use in auth paths. */
export const decodeToken = (token: string): TokenPayload | null => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('decodeToken must not be called in production');
  }
  // ...
};
```

---

### ISSUE-10 · `BCRYPT_ROUNDS` default 10 — below 2025 OWASP recommendation

**Severity:** 🟡 LOW  
**File:** [`src/config/env.ts`](../../src/config/env.ts) — `BCRYPT_ROUNDS: z.string().default('10')...`

**Risk:** OWASP currently recommends bcrypt cost factor ≥ 12 (as of 2024–2025 guidelines). Cost factor 10 requires ~65ms per hash on modern hardware; factor 12 requires ~250ms — still fast for login but much harder to brute-force offline.

**Fix:**
```typescript
BCRYPT_ROUNDS: z.string().default('12').transform(Number),
```
> Increasing this will increase CPU time for registration/login (~4× slower) — acceptable trade-off for security.

---

### ISSUE-11 · Helmet CSP disabled in development — violations go undetected

**Severity:** 🟡 LOW  
**File:** [`src/app.ts`](../../src/app.ts)

```typescript
app.use(helmet({
  contentSecurityPolicy: env.NODE_ENV === 'production',  // ← false in development
  crossOriginEmbedderPolicy: env.NODE_ENV === 'production',
}));
```

**Risk:** CSP violations (inline scripts, unauthorized origins) only surface in production, where they may block functionality. Using CSP in report-only mode during development catches violations before they reach production.

**Fix:** Enable CSP in report-only mode for development:
```typescript
app.use(helmet({
  contentSecurityPolicy: env.NODE_ENV === 'production'
    ? undefined  // enforced
    : { directives: { defaultSrc: ["'self'"] }, reportOnly: true },
}));
```

---

## 4. Recommended Target Flow – HttpOnly Cookie (Option 1)

The current implementation **already uses HttpOnly cookie** for the refresh token. The access token is transported via `Authorization: Bearer` header and stored in memory (not `localStorage`) on the FE.

This is the **correct Option 1 pattern**. The diagram below shows the intended full flow with all fixes applied:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CLIENT (React SPA)                              │
│  In-memory: accessToken (short-lived, 15m)                          │
│  HttpOnly Cookie: refreshToken (7d, path=/api/auth/refresh)         │
└────────────────────────────┬────────────────────────────────────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │         NGINX / Reverse Proxy        │
          │   Sets X-Forwarded-For header        │
          │   (requires trust proxy=1 in app)    │
          └──────────────────┬──────────────────┘
                             │
          ┌──────────────────▼──────────────────────────────────────┐
          │           Express App (Node.js)                          │
          │                                                          │
          │  POST /auth/login                                        │
          │  ───────────────                                         │
          │  1. Validate credentials                                 │
          │  2. signAccessToken({ id, role })        ← no email PII │
          │  3. signRefreshToken({ id, role, ... })                  │
          │  4. Persist SHA-256(refreshToken) → user_sessions       │
          │  5. Response:                                            │
          │     • Set-Cookie: refreshToken=<JWT>; HttpOnly; Secure;  │
          │                   SameSite=Lax; Path=/api/auth/refresh   │
          │     • Body: { accessToken, user }                        │
          │                                                          │
          │  GET /api/protected                                      │
          │  ─────────────────                                       │
          │  Header: Authorization: Bearer <accessToken>             │
          │  1. verifyAccessToken(token)                             │
          │  2. prisma.user.findUnique({ isActive, deletedAt })      │
          │  3. Attach req.user = { id, role }                       │
          │  4. requireRole check → controller                       │
          │                                                          │
          │  POST /api/auth/refresh                                  │
          │  ─────────────────────                                   │
          │  Cookie sends refreshToken automatically (browser)       │
          │  1. Read req.cookies.refreshToken                        │
          │  2. verifyRefreshToken JWT                               │
          │  3. DB lookup by SHA-256(token)                          │
          │  4. Check session.revokedAt / .expiresAt                 │
          │  5. Token reuse → wipe all sessions                      │
          │  6. $transaction(revoke old, create new session)         │
          │  7. Set new refreshToken cookie (rotation)               │
          │  8. Body: { accessToken }                                │
          │                                                          │
          │  POST /api/auth/logout                                   │
          │  ─────────────────────                                   │
          │  1. Read cookie / revoke DB session                      │
          │  2. clearCookie('refreshToken')                          │
          │  3. FE clears in-memory accessToken                      │
          └─────────────────────────────────────────────────────────┘
```

### CSRF Considerations (Option 1)

| Vector | Status | Reasoning |
|---|---|---|
| CSRF on `/api/auth/refresh` | ✅ Mitigated | `SameSite=Lax` + cookie path scoped. Refresh is a `POST` — lax blocks cross-site POSTs from third-party navigations. |
| CSRF on protected endpoints | ✅ N/A | Access token sent via `Authorization` header (not auto-sent by browser) — immune to CSRF by design. |
| CSRF on `/api/auth/logout` | ✅ Low risk | Only revokes the refresh token; access token unaffected for 15m TTL. |

---

## 5. Required Backend Changes to Support Option 1

The following changes are required/recommended in order of priority:

### Phase 1 — Critical Fixes (must be done before production)

| # | Change | File(s) | Issue Ref |
|---|---|---|---|
| 1 | Add `app.set('trust proxy', 1)` before middleware registration | `src/app.ts` | ISSUE-03 |
| 2 | Change `COOKIE_SECURE` default to `'true'`; add startup assertion in production | `src/config/env.ts` | ISSUE-04 |
| 3 | Sync `createSession` expiry with `JWT_REFRESH_EXPIRE` using `ms()` parser | `src/services/auth.service.ts` | ISSUE-01 |
| 4 | Update `lastUsedAt` inside the rotation `$transaction` | `src/services/auth.service.ts` | ISSUE-02 |

### Phase 2 — Security Hardening (next sprint)

| # | Change | File(s) | Issue Ref |
|---|---|---|---|
| 5 | Remove `email` from `TokenPayload` and all `signAccessToken` call sites | `src/utils/jwt.ts`, `src/services/auth.service.ts` | ISSUE-05 |
| 6 | Add `authRateLimiter` to `/auth/logout` | `src/routes/auth.routes.ts` | ISSUE-06 |
| 7 | Remove body schema validation from `/auth/refresh`; add rejection if body token supplied | `src/routes/auth.routes.ts`, `src/controllers/auth.controller.ts` | ISSUE-07 |
| 8 | Remove `jti` from `signRefreshToken` (dead code) or store+verify it properly | `src/utils/jwt.ts` | ISSUE-08 |

### Phase 3 — Polish / Low Priority

| # | Change | File(s) | Issue Ref |
|---|---|---|---|
| 9 | Unexport / guard `decodeToken` behind non-production check | `src/utils/jwt.ts` | ISSUE-09 |
| 10 | Raise `BCRYPT_ROUNDS` default to `12` | `src/config/env.ts` | ISSUE-10 |
| 11 | Enable CSP in report-only mode for development | `src/app.ts` | ISSUE-11 |

### Additional Recommendation — FE Integration Contract

For FE Option 1 (in-memory accessToken + HttpOnly cookie refreshToken) to work correctly, the following contracts must hold:

```
1. FE stores accessToken in memory only (React state / Zustand / Redux) — never localStorage or sessionStorage.
2. FE attaches accessToken to every API request: Authorization: Bearer <token>
3. On 401 response from any API, FE silently calls POST /api/auth/refresh (cookie auto-sent by browser).
4. If /api/auth/refresh returns 401, FE redirects to login screen (session fully expired/revoked).
5. FE does NOT read the refreshToken cookie (HttpOnly prevents this by design).
6. On tab open / app load with no in-memory token, FE calls /api/auth/refresh to restore session silently.
7. On logout, FE calls POST /api/auth/logout, then discards in-memory accessToken.
```

These are purely FE behaviors — the backend already supports all of them. No additional backend endpoint changes are needed for this contract.
