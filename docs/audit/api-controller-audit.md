# API Controller Audit Report — OnlineHealthConsultation-Service

> **Generated:** 2026-03-03  
> **Analyst role:** Tech Lead — API Coverage Audit  
> **Scope:** All Express route files, controllers, validation schemas, middlewares

---

## Table of Contents

1. [Endpoint Inventory](#1-endpoint-inventory)
   - [Auth Domain](#11-auth-domain)
   - [Public / Shared Domain](#12-public--shared-domain)
   - [Patient Domain](#13-patient-domain)
   - [Doctor Domain](#14-doctor-domain)
   - [Admin Domain](#15-admin-domain)
   - [Reports Domain](#16-reports-domain)
2. [Controller-by-Controller Review](#2-controller-by-controller-review)
3. [Missing Endpoints Checklist](#3-missing-endpoints-checklist)
4. [Top 10 Fixes to Reach Production-Ready API](#4-top-10-fixes-to-reach-production-ready-api)

---

## 1. Endpoint Inventory

### Response Envelope (all endpoints)

**Success:** `{ data: T, meta?: { page, limit, total, totalPages } }`  
**Error:** `{ error: { message: string, code: string, details?: any } }`

Source: [`src/utils/apiResponse.ts`](../../src/utils/apiResponse.ts)

---

### 1.1 Auth Domain

Route file: [`src/routes/auth.routes.ts`](../../src/routes/auth.routes.ts)  
Controller: [`src/controllers/auth.controller.ts`](../../src/controllers/auth.controller.ts)  
Base path: `/api/auth`

| # | Method | Path | Controller.Function | Auth | Roles | Validation | Response | Status Codes |
|---|---|---|---|---|---|---|---|---|
| A1 | POST | `/api/auth/register` | `AuthController.register` | None | None | `registerSchema` (Zod) | `{ accessToken, user }` + `Set-Cookie: refreshToken` | 201, 400, 409, 429 |
| A2 | POST | `/api/auth/login` | `AuthController.login` | None | None | `loginSchema` (Zod) | `{ accessToken, user }` + `Set-Cookie: refreshToken` | 200, 400, 401, 403, 429 |
| A3 | POST | `/api/auth/refresh` | `AuthController.refresh` | Cookie only | None | `refreshSchema` (body ignored) | `{ accessToken }` + rotated `Set-Cookie` | 200, 401, 429 |
| A4 | POST | `/api/auth/logout` | `AuthController.logout` | Cookie only | None | `refreshSchema` (body only) | `{ message }` + `clearCookie` | 200, 401 ⚠️ no rate limiter |
| A5 | GET | `/api/auth/me` | `AuthController.me` | `authenticate` | Any | None | `{ user }` | 200, 401, 403 |

---

### 1.2 Public / Shared Domain

Route file: [`src/routes/index.ts`](../../src/routes/index.ts)  
Base path: `/api`

| # | Method | Path | Controller.Function | Auth | Roles | Validation | Response | Status Codes |
|---|---|---|---|---|---|---|---|---|
| P1 | GET | `/api/health` | inline | None | None | None | `{ status, timestamp, service }` | 200 |
| P2 | GET | `/api/specialties` | `AdminController.getSpecialties` | None | None | None | `[Specialty]` | 200 |
| P3 | GET | `/api/doctors/featured` | `DoctorController.getFeaturedDoctors` | None | None | None | `[DoctorProfile]` | 200 |

> ⚠️ **Route shadowing risk:** `GET /api/doctors/featured` is registered at the root index router (line 30) before `router.use('/doctors', doctorRoutes)` (line 35). This ordering is correct and intentional — but if a route `/featured` is ever added inside `doctor.routes.ts`, it would be shadowed. See [AUDIT-01](#audit-01--route-shadowing-fragility-in-indexts).

---

### 1.3 Patient Domain

Route files: [`src/routes/patient.routes.ts`](../../src/routes/patient.routes.ts)  
Mounted at: `/api/patients` AND `/api/patient` (alias)  
Controller: [`src/controllers/patient.controller.ts`](../../src/controllers/patient.controller.ts)

| # | Method | Path | Controller.Function | Auth | Roles | Validation | Response | Status Codes |
|---|---|---|---|---|---|---|---|---|
| PT1 | GET | `/api/patients/specialties` | `AdminController.getSpecialties` | None | None | None | `[Specialty]` | 200 |
| PT2 | GET | `/api/patients/doctors` | `AdminController.getDoctors` ⚠️ | None | None | None | `[DoctorProfile (admin shape)]` | 200 |
| PT3 | GET | `/api/patients/profile` | `PatientController.getProfile` | ✅ | PATIENT | None | `PatientProfile` | 200, 401, 403 |
| PT4 | PUT | `/api/patients/profile` | `PatientController.updateProfile` | ✅ | PATIENT | `updateProfileSchema` | `PatientProfile` | 200, 400, 401, 403 |
| PT5 | GET | `/api/patients/questions` | `PatientController.getQuestions` | ✅ | PATIENT | ❌ None | `[Question]` | 200, 401, 403 |
| PT6 | POST | `/api/patients/questions` | `PatientController.createQuestion` | ✅ | PATIENT | `createQuestionSchema` | `Question` | 201, 400, 401, 403 |
| PT7 | GET | `/api/patients/appointments` | `PatientController.getAppointments` | ✅ | PATIENT | ❌ None | `[Appointment]` | 200, 401, 403 |
| PT8 | POST | `/api/patients/appointments` | `PatientController.createAppointment` | ✅ | PATIENT | `createAppointmentSchema` | `Appointment` | 201, 400, 401, 403, 409 |
| PT9 | GET | `/api/patients/history` | `PatientController.getHistory` | ✅ | PATIENT | ❌ None | `{ questions[], appointments[] }` | 200, 401, 403 |
| PT10 | POST | `/api/patients/ratings` | `PatientController.createRating` | ✅ | PATIENT | `createRatingSchema` | `Rating` | 201, 400, 401, 403, 409 |
| PT11 | GET | `/api/patients/ratings` | `PatientController.getRatings` | ✅ | PATIENT | ❌ None | `[Rating]` | 200, 401, 403 |

> ⚠️ **PT2:** `adminController.getDoctors` is used for a patient-facing public endpoint. This calls `adminService.getDoctors()` which returns data in admin format (no filtering of inactive doctors confirmed without reading service). See [AUDIT-02](#audit-02--patient-facing-doctor-list-uses-admin-service).

---

### 1.4 Doctor Domain

Route file: [`src/routes/doctor.routes.ts`](../../src/routes/doctor.routes.ts)  
Mounted at: `/api/doctors` AND `/api/doctor` (alias)  
Controller: [`src/controllers/doctor.controller.ts`](../../src/controllers/doctor.controller.ts)

| # | Method | Path | Controller.Function | Auth | Roles | Validation | Response | Status Codes |
|---|---|---|---|---|---|---|---|---|
| D1 | GET | `/api/doctors/me` | `DoctorController.getMe` | ✅ | DOCTOR | None | `DoctorProfile + stats` | 200, 401, 403 |
| D2 | GET | `/api/doctors/questions` | `DoctorController.getQuestions` | ✅ | DOCTOR | `getQuestionsQuerySchema` | `[Question (flat)]` | 200, 401, 403 |
| D3 | POST | `/api/doctors/questions/:id/answers` | `DoctorController.answerQuestion` | ✅ | DOCTOR | `createAnswerSchema` | `Answer` | 201, 400, 401, 403, 404 |
| D4 | POST | `/api/doctors/questions/:id/answer` | `DoctorController.answerQuestion` | ✅ | DOCTOR | `createAnswerSchema` | `Answer` | 201, 400, 401, 403, 404 |
| D5 | GET | `/api/doctors/appointments` | `DoctorController.getAppointments` | ✅ | DOCTOR | `getAppointmentsQuerySchema` | `[Appointment]` | 200, 401, 403 |
| D6 | PUT | `/api/doctors/appointments/:id` | `DoctorController.updateAppointment` | ✅ | DOCTOR | `updateAppointmentSchema` | `Appointment` | 200, 400, 401, 403, 404 |
| D7 | GET | `/api/doctors/schedule` | `DoctorController.getSchedule` | ✅ | DOCTOR | None | `ScheduleSlot[]` | 200, 401, 403 |
| D8 | POST | `/api/doctors/schedule` | `DoctorController.updateSchedule` | ✅ | DOCTOR | `updateScheduleSchema` | `DoctorProfile` | 200, 400, 401, 403 |

> **D3/D4:** Duplicate routes — same handler bound to both `/answers` and `/answer` paths. See [AUDIT-03](#audit-03--duplicate-route-aliases-proliferating).

---

### 1.5 Admin Domain

Route file: [`src/routes/admin.routes.ts`](../../src/routes/admin.routes.ts)  
Mounted at: `/api/admin`  
Controller: [`src/controllers/admin.controller.ts`](../../src/controllers/admin.controller.ts)

| # | Method | Path | Controller.Function | Auth | Roles | Validation (body/params/query) | Status Codes |
|---|---|---|---|---|---|---|---|
| AD1 | GET | `/api/admin/stats` | `ReportController.getOverallStats` | ✅ | ADMIN | None | 200 |
| AD2 | GET | `/api/admin/users` | `AdminController.getUsers` | ✅ | ADMIN | `queryUsersSchema` (query) | 200 |
| AD3 | POST | `/api/admin/users` | `AdminController.createUser` | ✅ | ADMIN | `createUserSchema` (body) | 201, 400, 409 |
| AD4 | PUT | `/api/admin/users/:id` | `AdminController.updateUser` | ✅ | ADMIN | `idParamSchema` + `updateUserSchema` | 200, 400, 404 |
| AD5 | DELETE | `/api/admin/users/:id` | `AdminController.deleteUser` | ✅ | ADMIN | `idParamSchema` (params) | 200 ⚠️ soft-delete |
| AD6 | GET | `/api/admin/doctors` | `AdminController.getDoctors` | ✅ | ADMIN | `queryPaginationSchema` (query) | 200 |
| AD7 | POST | `/api/admin/doctors` | `AdminController.createDoctor` | ✅ | ADMIN | `createUserSchema` (body) | 201 |
| AD8 | PUT | `/api/admin/doctors/:id` | `AdminController.updateDoctor` | ✅ | ADMIN | `idParamSchema` + `updateDoctorSchema` | 200 |
| AD9 | DELETE | `/api/admin/doctors/:id` | `AdminController.deleteDoctor` | ✅ | ADMIN | `idParamSchema` (params) | 200 ⚠️ soft-delete |
| AD10 | GET | `/api/admin/patients` | `AdminController.getPatients` | ✅ | ADMIN | `queryPaginationSchema` (query) ⚠️ no search | 200 |
| AD11 | GET | `/api/admin/specialties` | `AdminController.getSpecialties` | ✅ | ADMIN | None | 200 |
| AD12 | POST | `/api/admin/specialties` | `AdminController.createSpecialty` | ✅ | ADMIN | `createSpecialtySchema` (body) | 201 |
| AD13 | PUT | `/api/admin/specialties/:id` | `AdminController.updateSpecialty` | ✅ | ADMIN | `idParamSchema` + `updateSpecialtySchema` | 200 |
| AD14 | DELETE | `/api/admin/specialties/:id` | `AdminController.deleteSpecialty` | ✅ | ADMIN | `idParamSchema` (params) | 200 |
| AD15 | GET | `/api/admin/appointments` | `AdminController.getAppointments` | ✅ | ADMIN | `queryAppointmentsSchema` (query) | 200 |
| AD16 | PUT | `/api/admin/appointments/:id` | `AdminController.updateAppointment` | ✅ | ADMIN | `idParamSchema` + `updateAppointmentSchema` | 200 |
| AD17 | GET | `/api/admin/moderation/questions` | `AdminController.getQuestionsForModeration` | ✅ | ADMIN | `queryPaginationSchema` | 200 |
| AD18 | PATCH | `/api/admin/questions/:id/moderate` | `AdminController.moderateQuestion` | ✅ | ADMIN | `idParamSchema` ❌ **body not validated** | 200 |
| AD19 | PATCH | `/api/admin/answers/:id/moderate` | `AdminController.moderateAnswer` | ✅ | ADMIN | `idParamSchema` ❌ **body not validated** | 200 |
| AD20 | GET | `/api/admin/moderation/ratings` | `AdminController.getRatingsForModeration` | ✅ | ADMIN | `queryPaginationSchema` | 200 |
| AD21 | PATCH | `/api/admin/ratings/:id/moderate` | `AdminController.moderateRating` | ✅ | ADMIN | `idParamSchema` ❌ **body not validated** | 200 |
| AD22 | GET | `/api/admin/moderation` | `AdminController.getModerationItems` | ✅ | ADMIN | `queryPaginationSchema` | 200 |
| AD23 | PUT | `/api/admin/moderation/:id/approve` | `AdminController.approveModerationItem` | ✅ | ADMIN | `idParamSchema` | 200 |
| AD24 | PUT | `/api/admin/moderation/:id/reject` | `AdminController.rejectModerationItem` | ✅ | ADMIN | `idParamSchema` | 200 |

---

### 1.6 Reports Domain

Route file: [`src/routes/report.routes.ts`](../../src/routes/report.routes.ts)  
Controller: [`src/controllers/report.controller.ts`](../../src/controllers/report.controller.ts)  
Base path: `/api/reports`

| # | Method | Path | Controller.Function | Auth | Roles | Validation | Status Codes |
|---|---|---|---|---|---|---|---|
| R1 | GET | `/api/reports` | `ReportController.getReports` | ✅ | ADMIN | `getReportsQuerySchema` | 200 |
| R2 | GET | `/api/reports/stats` | `ReportController.getOverallStats` | ✅ | ADMIN | None | 200 |
| R3 | GET | `/api/reports/stats/consultations` | `ReportController.getConsultationsStats` | ✅ | ADMIN | ❌ None (inline parse) | 200 |
| R4 | GET | `/api/reports/stats/active-users` | `ReportController.getActiveUsersStats` | ✅ | ADMIN | ❌ None (inline parse) | 200 |
| R5 | GET | `/api/reports/statistics` | `ReportController.getStatistics` | ✅ | ADMIN | None | 200 |
| R6 | GET | `/api/reports/appointments-chart` | `ReportController.getAppointmentsChart` | ✅ | ADMIN | ❌ None (inline parse) | 200 |
| R7 | GET | `/api/reports/questions-chart` | `ReportController.getQuestionsChart` | ✅ | ADMIN | ❌ None (inline parse) | 200 |
| R8 | GET | `/api/reports/top-doctors` | `ReportController.getTopRatedDoctors` | ✅ | ADMIN | ❌ None (inline `limit` parse) | 200 |
| R9 | GET | `/api/reports/specialty-distribution` | `ReportController.getSpecialtyDistribution` | ✅ | ADMIN | None | 200 |

> ⚠️ R2 duplicates AD1 — `GET /api/reports/stats` and `GET /api/admin/stats` call the same `reportController.getOverallStats`. See [AUDIT-08](#audit-08--duplicate-stats-endpoint-registered-in-two-routers).

---

## 2. Controller-by-Controller Review

---

### 2.1 `AuthController` — [`src/controllers/auth.controller.ts`](../../src/controllers/auth.controller.ts)

**Status: ✅ Mostly complete, 3 issues**

| Check | Result |
|---|---|
| Register fully implemented | ✅ |
| Login fully implemented | ✅ |
| Refresh with rotation | ✅ |
| Logout clears cookie + revokes DB session | ✅ |
| `GET /me` protected by `authenticate` | ✅ |
| Rate limiting applied | ⚠️ `/logout` has no rate limiter |
| Input validation | ✅ Zod on all mutating endpoints |
| Error status codes | ✅ 401/403/409 correct |
| `refreshSchema` validated but body token ignored | ⚠️ See [AUDIT-04](#audit-04--refreshschema-body-validation-is-misleading) |
| `reason` body field in `createAppointmentSchema` is optional but DB requires it | ✅ N/A for auth — issue is in patient controller |

---

### 2.2 `PatientController` — [`src/controllers/patient.controller.ts`](../../src/controllers/patient.controller.ts)

**Status: ⚠️ Functional but missing validation and features**

| Check | Result |
|---|---|
| Profile CRUD | ✅ GET + PUT |
| Create question | ✅ with normalizer + sanitizer |
| List questions | ✅ but no pagination / filtering |
| Create appointment | ✅ with future-date guard |
| List appointments | ✅ but no pagination / filtering |
| Consultation history | ✅ GET `/history` with transform |
| Create rating | ✅ |
| List ratings | ✅ but no pagination |
| Cancel appointment | ❌ **Missing** — no `PUT/PATCH /patients/appointments/:id` |
| View single question detail | ❌ **Missing** — no `GET /patients/questions/:id` |
| View single appointment detail | ❌ **Missing** — no `GET /patients/appointments/:id` |
| `GET /patients/questions` pagination | ❌ No query schema applied |
| `GET /patients/appointments` pagination | ❌ No query schema applied |
| `reason` field optional in schema but TEXT NOT NULL in DB | ⚠️ See [AUDIT-05](#audit-05--appointment-reason-is-optional-in-zod-but-required-in-db) |
| Public doctor list uses admin service | ⚠️ See [AUDIT-02](#audit-02--patient-facing-doctor-list-uses-admin-service) |

---

### 2.3 `DoctorController` — [`src/controllers/doctor.controller.ts`](../../src/controllers/doctor.controller.ts)

**Status: ⚠️ Core features present, missing detail endpoints and reply management**

| Check | Result |
|---|---|
| Doctor profile (`GET /doctors/me`) | ✅ |
| List questions with filter + pagination | ✅ `page`, `limit`, `status` |
| Answer a question | ✅ |
| List appointments with filter | ✅ `status` filter only, no pagination |
| Update appointment status | ✅ with Zod validation |
| Get/Update schedule | ✅ with `scheduleArraySchema` validation |
| Featured doctors (public) | ✅ `getFeaturedDoctors` |
| Update doctor own profile (bio, languages, etc.) | ❌ **Missing** — no `PUT /doctors/profile` |
| View own rating list | ❌ **Missing** — no `GET /doctors/ratings` |
| View single appointment detail | ❌ **Missing** — no `GET /doctors/appointments/:id` |
| Duplicate route D3/D4 (answer/answers) | ⚠️ See [AUDIT-03](#audit-03--duplicate-route-aliases-proliferating) |
| Appointment list has no pagination | ⚠️ `getAppointmentsQuerySchema` — no `page`/`limit` |

---

### 2.4 `AdminController` — [`src/controllers/admin.controller.ts`](../../src/controllers/admin.controller.ts)

**Status: ✅ Comprehensive, 4 validation gaps**

| Check | Result |
|---|---|
| User CRUD (get, create, update, delete) | ✅ (delete = soft-delete) |
| Doctor CRUD | ✅ |
| Patient list | ✅ (read-only) |
| Specialty CRUD | ✅ |
| Appointment list + status update | ✅ |
| Question moderation | ✅ |
| Answer moderation | ✅ |
| Rating moderation | ✅ |
| Unified moderation endpoint | ✅ |
| Moderation body fields not validated | ⚠️ See [AUDIT-06](#audit-06--moderation-patch-endpoints-have-no-body-validation) |
| Patient list no search/filter | ⚠️ Only pagination, no `search` or `isActive` filter |
| Double-parsing `page`/`limit` in `getUsers` | ⚠️ See [AUDIT-07](#audit-07--double-parsing-of-querystring-parameters-in-getusers) |
| DELETE operations return 200 (soft-delete) | ⚠️ Convention: soft-delete returning 200 is acceptable but should be documented |
| Admin cannot view/delete individual question or answer | ❌ **Missing** — no `GET /admin/questions/:id` or `DELETE /admin/questions/:id` |
| Admin stats duplicate in `/reports/stats` | ⚠️ See [AUDIT-08](#audit-08--duplicate-stats-endpoint-registered-in-two-routers) |

---

### 2.5 `ReportController` — [`src/controllers/report.controller.ts`](../../src/controllers/report.controller.ts)

**Status: ⚠️ Functional but query params not validated on 5 of 9 endpoints**

| Check | Result |
|---|---|
| Aggregated reports with date range | ✅ (Zod schema on `/reports`) |
| Overall stats | ✅ |
| Consultations stats | ⚠️ `from`/`to` parsed inline, no Zod validation |
| Active users stats | ⚠️ `from`/`to` parsed inline, no Zod validation |
| General statistics | ✅ no params |
| Appointments chart | ⚠️ `from`/`to` parsed inline, no Zod validation |
| Questions chart | ⚠️ `from`/`to` parsed inline, no Zod validation |
| Top rated doctors | ⚠️ `limit` parsed inline, no Zod validation |
| Specialty distribution | ✅ no params |
| Malformed date passed to `new Date(invalidString)` = `Invalid Date` → Prisma error | ⚠️ See [AUDIT-09](#audit-09--unvalidated-date-query-params-in-report-endpoints) |

---

## 3. Missing Endpoints Checklist

### 3.1 Patient — Appointment Management

| Feature | Expected Endpoint | Status |
|---|---|---|
| Cancel own appointment | `PATCH /api/patients/appointments/:id` with `{ status: "CANCELLED" }` | ❌ Missing |
| View single appointment | `GET /api/patients/appointments/:id` | ❌ Missing |
| View single question + its answers | `GET /api/patients/questions/:id` | ❌ Missing |

### 3.2 Doctor — Profile & Data Access

| Feature | Expected Endpoint | Status |
|---|---|---|
| Update own profile (bio, yearsOfExp) | `PUT /api/doctors/profile` or `PATCH /api/doctors/me` | ❌ Missing |
| View own ratings | `GET /api/doctors/ratings` | ❌ Missing |
| View single appointment detail | `GET /api/doctors/appointments/:id` | ❌ Missing |
| Pagination on appointment list | `GET /api/doctors/appointments?page=&limit=` | ❌ No `page`/`limit` support |

### 3.3 Public — Doctor Discovery

| Feature | Expected Endpoint | Status |
|---|---|---|
| View specific doctor profile | `GET /api/doctors/:id` (public) | ❌ Missing |
| View doctor's available schedule | `GET /api/doctors/:id/schedule` (public) | ❌ Missing |
| Filter doctors by specialty | `GET /api/doctors?specialtyId=` (public) | ❌ Missing (current public uses admin controller, no filter) |

### 3.4 Admin — Content Management

| Feature | Expected Endpoint | Status |
|---|---|---|
| Get specific user by ID | `GET /api/admin/users/:id` | ❌ Missing |
| Get specific appointment by ID | `GET /api/admin/appointments/:id` | ❌ Missing |
| Delete/archive a question | `DELETE /api/admin/questions/:id` | ❌ Missing |
| Search/filter patients | `GET /api/admin/patients?search=&isActive=` | ⚠️ Incomplete — only pagination |

### 3.5 Notifications / Files

| Domain | Status |
|---|---|
| Notification system | ❌ **Not implemented** — no notification controller, route, or service |
| File / image uploads | ❌ **Not implemented** — no upload controller, route, or multer/S3 integration |

### 3.6 Feature Flow Completeness

```
Patient Consultation Flow:
  ✅ Patient registers / logs in
  ✅ Patient creates question
  ✅ Doctor views and answers questions
  ✅ Admin moderates question / answer
  ❌ Patient notified when question answered (no notification)
  ❌ Patient views single question detail with answers

Appointment Booking Flow:
  ✅ Patient views available doctors (via /patients/doctors)
  ❌ Patient views specific doctor profile + real availability
  ✅ Patient creates appointment
  ✅ Doctor confirms / cancels appointment
  ❌ Patient cancels appointment (no patient-side cancellation)
  ✅ Patient rates completed appointment
  ❌ Patient / Doctor notified of status changes (no notification)

Admin Moderation Flow:
  ✅ View pending questions         → /admin/moderation/questions
  ✅ Moderate question status       → PATCH /admin/questions/:id/moderate
  ✅ Moderate answer approval       → PATCH /admin/answers/:id/moderate
  ✅ Moderate rating visibility     → PATCH /admin/ratings/:id/moderate
  ✅ Unified moderation view        → /admin/moderation
  ❌ Hard-delete abusive content    → no DELETE on individual question/answer
```

---

## 4. Top 10 Fixes to Reach Production-Ready API

---

### AUDIT-01 · Route shadowing fragility in `index.ts`

**Severity:** ⚠️ Medium  
**File:** [`src/routes/index.ts`](../../src/routes/index.ts) lines 23–35

`GET /api/doctors/featured` is registered as a root-level route before `router.use('/doctors', doctorRoutes)`. This works correctly today because Express matches routes in registration order. However:
- `GET /api/doctor/featured` (singular alias) is NOT public — it hits the `doctorRoutes` router which requires `authenticate + requireDoctor`, breaking FE when using the singular alias.
- Any future route added inside `doctor.routes.ts` with path `/featured` would silently shadow the public route.

**Fix:** Move the public endpoints into a dedicated `public.routes.ts` file and document the ordering contract explicitly. Alternatively, register the same featured handler on both `/doctors/featured` and `/doctor/featured` at the root level.

```typescript
// index.ts — make both aliases public
router.get('/doctors/featured', doctorController.getFeaturedDoctors);
router.get('/doctor/featured', doctorController.getFeaturedDoctors); // add this
```

---

### AUDIT-02 · Patient-facing doctor list uses admin service

**Severity:** ⚠️ Medium  
**Files:** [`src/routes/patient.routes.ts`](../../src/routes/patient.routes.ts) line 13 + [`src/controllers/admin.controller.ts`](../../src/controllers/admin.controller.ts) `getDoctors`

`GET /api/patients/doctors` calls `adminController.getDoctors` → `adminService.getDoctors()`. The admin service includes all doctors regardless of `isActive` status, and the controller response shape is the flattened admin format (includes `isActive`, `specialtyId`, etc.).

**Risks:**
- Deactivated doctors may appear in the patient booking flow.
- Response shape leaks admin-internal fields to unauthenticated users.

**Fix:** Create a `GET /api/doctors/public` or reuse `GET /api/specialties`-style endpoint in `doctorService` that filters `WHERE isActive = true` and returns only public-safe fields:

```typescript
// doctor.service.ts — add:
async getPublicDoctors(specialtyId?: string, page = 1, limit = 20) {
  return prisma.doctorProfile.findMany({
    where: { user: { isActive: true }, ...(specialtyId && { specialtyId }) },
    include: { user: { select: { firstName, lastName, email } }, specialty: true },
    take: limit, skip: (page - 1) * limit,
  });
}
```

---

### AUDIT-03 · Duplicate route aliases proliferating

**Severity:** ⚠️ Medium  
**Files:**
- [`src/routes/index.ts`](../../src/routes/index.ts) — `/patients` + `/patient`, `/doctors` + `/doctor`
- [`src/routes/doctor.routes.ts`](../../src/routes/doctor.routes.ts) — `/questions/:id/answers` + `/questions/:id/answer`

Four route prefix aliases and duplicate verb-path pairs double the Express router table. Each alias also doubles OpenAPI/documentation surface. The singular/plural pattern creates maintenance burden: any future route must be added to both.

**Fix:** Standardize on plural (`/patients`, `/doctors`). If legacy aliases are required for FE compatibility, use a redirect middleware rather than duplicating the entire router:

```typescript
// Redirect legacy singular path to canonical plural
router.use('/patient', (req, res) => res.redirect(301, req.url.replace('/patient', '/patients')));
```

---

### AUDIT-04 · `refreshSchema` body validation is misleading

**Severity:** ⚠️ Medium  
**File:** [`src/controllers/auth.controller.ts`](../../src/controllers/auth.controller.ts) + [`src/routes/auth.routes.ts`](../../src/routes/auth.routes.ts)

`refreshSchema.body.refreshToken` is `optional()`, passing Zod validation even when present in the body. The controller then ignores it completely and reads only `req.cookies.refreshToken`. This creates a false API contract that suggests body submission is supported.

**Fix:**
```typescript
// auth.routes.ts — remove body validation from refresh entirely
router.post('/refresh', refreshRateLimiter, authController.refresh);

// auth.controller.ts — add explicit rejection guard
if (req.body?.refreshToken) {
  throw new AppError(
    'Refresh token must be sent via HttpOnly cookie, not request body',
    400,
    ERROR_CODES.INVALID_INPUT
  );
}
```

---

### AUDIT-05 · Appointment `reason` is optional in Zod but required (NOT NULL) in DB

**Severity:** 🔴 High  
**File:** [`src/controllers/patient.controller.ts`](../../src/controllers/patient.controller.ts) — `createAppointmentSchema`

```typescript
export const createAppointmentSchema = z.object({
  body: z.object({
    // ...
    reason: z.string().optional(),  // ← can be undefined
    // ...
  }),
});
```

The `appointments.reason` column is `TEXT NOT NULL` in the DB (see [`prisma/schema.prisma`](../../prisma/schema.prisma) — `reason String @db.Text`). If a client sends a request without `reason`, Zod passes validation, the controller calls `patientService.createAppointment(...)` with `reason: undefined`, and Prisma throws an unhandled DB constraint error that surfaces as a 500.

**Fix:**
```typescript
reason: z.string().min(1, 'Reason for appointment is required'),
```

---

### AUDIT-06 · Moderation PATCH endpoints have no body validation

**Severity:** 🔴 High  
**File:** [`src/routes/admin.routes.ts`](../../src/routes/admin.routes.ts) — lines for AD18, AD19, AD21

Three PATCH endpoints pass raw `req.body` directly to service methods:

| Route | Body field read by controller | Validated? |
|---|---|---|
| `PATCH /admin/questions/:id/moderate` | `req.body.status` → `adminService.moderateQuestion(id, status)` | ❌ |
| `PATCH /admin/answers/:id/moderate` | `req.body.isApproved` → `adminService.moderateAnswer(id, isApproved)` | ❌ |
| `PATCH /admin/ratings/:id/moderate` | `req.body.status` → `adminService.moderateRating(id, status)` | ❌ |

An admin sending `{ status: "INVALID_VALUE" }` or missing body will cause a Prisma type error or silent DB inconsistency.

**Fix:** Add body schemas to each:
```typescript
// In admin.routes.ts:
const moderateQuestionBodySchema = z.object({ status: z.enum(['PENDING', 'ANSWERED', 'MODERATED']) });
const moderateAnswerBodySchema = z.object({ isApproved: z.boolean() });
const moderateRatingBodySchema = z.object({ status: z.enum(['VISIBLE', 'HIDDEN']) });

router.patch('/questions/:id/moderate', validate({ params: idParamSchema, body: moderateQuestionBodySchema }), adminController.moderateQuestion);
router.patch('/answers/:id/moderate',   validate({ params: idParamSchema, body: moderateAnswerBodySchema }),   adminController.moderateAnswer);
router.patch('/ratings/:id/moderate',   validate({ params: idParamSchema, body: moderateRatingBodySchema }),   adminController.moderateRating);
```

---

### AUDIT-07 · Double-parsing of querystring parameters in `getUsers`

**Severity:** 🟡 Low  
**File:** [`src/controllers/admin.controller.ts`](../../src/controllers/admin.controller.ts) — `getUsers` handler (~line 118)

The route applies `validate({ query: queryUsersSchema })` which transforms `page` and `limit` from strings to numbers via Zod `.transform()`. The controller then does:

```typescript
page: page ? parseInt(page as string) : undefined,
limit: limit ? parseInt(limit as string) : undefined,
```

After Zod transforms them, `page` and `limit` are already `number`. Casting them back to `string` for `parseInt()` is redundant and confusing — `parseInt(5 as unknown as string)` returns `NaN` on some runtimes.

**Fix:** Remove the redundant `parseInt` calls:
```typescript
const { role, isActive, search, page, limit } = req.query as {
  role?: string; isActive?: boolean; search?: string; page?: number; limit?: number;
};
const result = await adminService.getUsers({ role, isActive, search, page, limit });
```

---

### AUDIT-08 · Duplicate stats endpoint registered in two routers

**Severity:** 🟡 Low  
**Files:** [`src/routes/admin.routes.ts`](../../src/routes/admin.routes.ts) line 20 + [`src/routes/report.routes.ts`](../../src/routes/report.routes.ts) line 14

`GET /api/admin/stats` and `GET /api/reports/stats` both call `reportController.getOverallStats`. This creates two canonical URLs for the same resource — both requiring `authenticate + requireAdmin`.

**Fix:** Remove the alias from `admin.routes.ts` and document the canonical path as `/api/reports/stats`. Update FE to use only one.

```typescript
// admin.routes.ts — remove:
router.get('/stats', reportController.getOverallStats); // ← DELETE THIS LINE
```

---

### AUDIT-09 · Unvalidated date query params in report endpoints

**Severity:** ⚠️ Medium  
**File:** [`src/controllers/report.controller.ts`](../../src/controllers/report.controller.ts)

Five report endpoints parse date query params inline without Zod validation:
```typescript
// Example from getConsultationsStats:
const { from, to } = req.query;
const result = await reportService.getConsultationsStats(
  from ? new Date(from as string) : undefined,   // ← no validation
  to   ? new Date(to   as string) : undefined,
);
```

`new Date("not-a-date")` produces `Invalid Date`. When this is passed to Prisma's `DateTime` comparator, it throws a Prisma runtime error that may surface as an unhandled 500.

**Fix:** Add a shared Zod schema and apply it via `validate()`:
```typescript
const dateRangeQuerySchema = z.object({
  from:  z.string().datetime({ offset: true }).optional(),
  to:    z.string().datetime({ offset: true }).optional(),
  limit: z.string().optional().transform((v) => v ? parseInt(v) : undefined),
});

// In report.routes.ts:
router.get('/stats/consultations', validate({ query: dateRangeQuerySchema }), reportController.getConsultationsStats);
router.get('/stats/active-users',  validate({ query: dateRangeQuerySchema }), reportController.getActiveUsersStats);
router.get('/appointments-chart',  validate({ query: dateRangeQuerySchema }), reportController.getAppointmentsChart);
router.get('/questions-chart',     validate({ query: dateRangeQuerySchema }), reportController.getQuestionsChart);
router.get('/top-doctors',         validate({ query: dateRangeQuerySchema }), reportController.getTopRatedDoctors);
```

---

### AUDIT-10 · Patient has no appointment cancellation — critical UX flow broken

**Severity:** 🔴 High  
**Missing endpoint:** `PATCH /api/patients/appointments/:id`

The appointment lifecycle expects patients to be able to cancel their own pending/confirmed appointments. Currently:
- Doctors can update appointment status via `PUT /api/doctors/appointments/:id`.
- Admins can update via `PUT /api/admin/appointments/:id`.
- **Patients have no mechanism to cancel.**

This is a missing piece of the core booking flow. Any attempt by a patient to cancel via the FE will fail with 404.

**Fix — add to `patient.routes.ts`:**
```typescript
router.patch('/appointments/:id/cancel', authenticate, requirePatient, patientController.cancelAppointment);
```

**Fix — add to `patient.controller.ts`:**
```typescript
cancelAppointment = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const result = await patientService.cancelAppointment(userId, id);
  sendSuccess(res, result);
});
```

**Fix — add to `patient.service.ts`:**
```typescript
async cancelAppointment(userId: string, appointmentId: string) {
  // 1. Find the patient profile
  // 2. Verify the appointment belongs to this patient
  // 3. Verify status is PENDING or CONFIRMED (not COMPLETED/CANCELLED)
  // 4. Update status to CANCELLED
}
```

---

## Completeness Summary

| Domain | Completed ✅ | Incorrect ⚠️ | Missing ❌ |
|---|---|---|---|
| Auth | 4/5 | 1 (logout no rate limiter) | 0 |
| Public | 3/3 | 1 (featured alias) | — |
| Patient | 8/11 | 2 (doctor list, reason optional) | 3 (cancel, single question, single appointment) |
| Doctor | 7/9 | 2 (duplicate routes, no appointment pagination) | 3 (self-profile update, ratings view, single appointment) |
| Admin | 21/24 | 4 (body validation gaps, double-parse, double stats) | 3 (user by ID, appointment by ID, patient search) |
| Reports | 6/9 | 5 (unvalidated date params) | 0 |
| Notifications | — | — | ❌ Not implemented |
| File Uploads | — | — | ❌ Not implemented |

**Total:** ~49 endpoints across 6 domains.  
**Critical gaps:** AUDIT-05 (DB constraint breach on appointment), AUDIT-06 (unvalidated moderation bodies), AUDIT-10 (no patient cancellation).
