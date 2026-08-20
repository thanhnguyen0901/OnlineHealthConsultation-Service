# End-to-End Test Matrix

## Mục đích

Tài liệu này lập ma trận kiểm thử end-to-end cho hệ thống đã hoàn thiện theo SRS. Matrix bao phủ bốn actor chính: **Guest**, **Patient**, **Doctor**, **Administrator**, cùng các luồng **Auth** dùng chung.

Trạng thái automation hiện tại được đối chiếu với các Playwright specs đang có trong `OnlineHealthConsultation-Web/e2e/specs` và các backend unit tests liên quan. Tài liệu này chỉ thiết kế test matrix, không implement test.

## Quy ước trạng thái

- `Covered`: đã có automation tương ứng ở mức e2e hoặc service test đủ gần với luồng.
- `Partial`: đã có một phần luồng, nhưng thiếu bước nghiệp vụ quan trọng hoặc thiếu xác minh cross-role/cross-system.
- `Missing`: chưa có automation trực tiếp.

## Guest

| Test ID | SRS reference/use case | Actor | Preconditions | Steps | Expected result | Suggested automation layer | Current automation status |
|---|---|---|---|---|---|---|---|
| E2E-G-001 | UC-G-01, SRS 5.1 | Guest | App seeded, public site available | Open home page | Home page loads without login and shows public platform content | Playwright e2e | Covered: `public.spec.ts` E2E-001 |
| E2E-G-002 | UC-G-02, SRS 5.1, 5.4 | Guest | At least one active specialty exists | Open specialties/public discovery area | Specialty list is visible without authentication | Playwright e2e | Partial: public discovery exists, dedicated specialties assertion should be expanded |
| E2E-G-003 | UC-G-03, UC-G-05, SRS 5.5 | Guest | Approved active doctor seeded with specialty/keyword | Search/filter doctors by keyword and specialty | Only matching active/approved doctors are shown | Playwright e2e + backend API test | Covered: `public.spec.ts` E2E-003; backend discovery filtering should remain covered by service/controller tests if added |
| E2E-G-004 | UC-G-04, SRS 5.5 | Guest | Approved active doctor seeded | Open doctor detail from public list | Public doctor detail shows name, specialties, qualification summary, experience, consultation description, rating summary, and public availability data where applicable | Playwright e2e | Covered: `public.spec.ts` E2E-004, may need assertion expansion for all professional fields |
| E2E-G-005 | UC-G-06, SRS 5.1 | Guest | Guest is not authenticated | Click protected action such as book appointment from doctor detail | User is redirected to login/register path; no protected API is executed as guest | Playwright e2e | Covered: `public.spec.ts` E2E-005 and `auth.spec.ts` E2E-009 |
| E2E-G-006 | SRS 5.1, 5.5 | Guest | Inactive/unapproved doctor exists | Search doctors and direct-open inactive/unapproved doctor detail | Inactive/unapproved doctor is not listed; direct detail returns not found/empty state | Playwright e2e + backend API test | Missing |

## Patient

| Test ID | SRS reference/use case | Actor | Preconditions | Steps | Expected result | Suggested automation layer | Current automation status |
|---|---|---|---|---|---|---|---|
| E2E-P-001 | UC-P-01, SRS 5.2 | Patient | Unique email available | Register as Patient with valid data | Account is created; user can proceed to login; refresh token is not exposed in JS response | Playwright e2e + backend auth service test | Partial: register page loads; backend auth tests cover token contract |
| E2E-P-002 | UC-P-02, SRS 5.2 | Patient | Active patient account seeded | Login with valid credentials | Patient lands on patient dashboard and authenticated state is set | Playwright e2e | Covered: `auth.spec.ts` E2E-006 |
| E2E-P-003 | UC-P-03, SRS 5.2 | Patient | Patient is logged in | Click logout | Session is cleared, refresh cookie is cleared by backend, user returns to login | Playwright e2e + backend controller test | Covered: `auth.spec.ts` E2E-012 and `auth.controller.spec.ts` |
| E2E-P-004 | UC-P-04, SRS 5.3 | Patient | Patient is logged in | Open profile, edit demographics/contact/basic health fields, save | Profile persists and reload shows updated values; validation errors show for invalid fields | Playwright e2e | Missing |
| E2E-P-005 | UC-P-05, UC-P-06, SRS 5.5 | Patient | Patient logged in; approved doctor seeded | Search doctor and open doctor detail | Patient can discover the same active/approved doctor data as public user | Playwright e2e | Partial: public discovery covered; authenticated patient path should be explicit |
| E2E-P-006 | UC-P-07, SRS 5.6 | Patient | Patient logged in; doctor/specialty available if question assignment uses them | Submit a health question with valid title/content | Question is saved as `PENDING` and appears in patient question list | Playwright e2e | Covered: `patient-questions.spec.ts` E2E-018/E2E-019 |
| E2E-P-007 | UC-P-11, SRS 5.6 | Patient | Patient has answered question | Open question history | Doctor response and answered status are visible only to owning patient | Playwright e2e + backend service test | Covered: `patient-questions.spec.ts` E2E-022; ownership negative test should be added |
| E2E-P-008 | UC-P-08, SRS 4.2, 5.7 | Patient | Patient logged in; approved active doctor has working schedule and available slot | Select doctor, select date, fetch availability, choose available slot, submit reason/notes | Appointment is created in valid slot with `PENDING_CONFIRMATION` or configured initial status; patient appointment list refreshes | Playwright e2e + backend service test | Covered/Partial: `patient-appointments.spec.ts` E2E-013; backend availability tests cover schedule/conflicts |
| E2E-P-009 | UC-P-08, SRS 5.7 | Patient | Patient logged in; selected slot overlaps doctor appointment or is outside schedule | Attempt booking unavailable slot/API payload | UI prevents unavailable slot selection; backend rejects direct invalid booking with consistent error | Playwright e2e + backend service test | Partial: backend `appointment.service.spec.ts` covers conflicts/outside hours; UI negative case missing |
| E2E-P-010 | UC-P-09, UC-P-12, SRS 5.7 | Patient | Patient has upcoming and past appointments | Open appointments/history | Only own appointments are shown with correct status, date/time, doctor info | Playwright e2e | Covered: `patient-appointments.spec.ts` E2E-014/E2E-015 |
| E2E-P-011 | UC-P-09, SRS 5.7 | Patient | Patient has cancellable appointment | Cancel appointment | Appointment status becomes `CANCELLED`; list/detail reflects cancellation; audit log exists | Playwright e2e + backend service test | Covered: `patient-appointments.spec.ts` E2E-016; audit assertion missing at e2e level |
| E2E-P-012 | UC-P-10, SRS 4.4, 5.8 | Patient | Confirmed appointment is within join window; doctor has started or can join according to rule | From appointment/history click Join Consultation | Patient consultation route opens, appointment/session is loaded, access is authorized | Playwright e2e | Partial: patient result view exists; live join page needs full e2e |
| E2E-P-013 | UC-P-10, SRS 4.4, 5.8 | Patient | Appointment too early/too late or belongs to another patient | Attempt direct route/API join | Backend denies access; UI shows too-early/invalid-access state without leaking consultation content | Playwright e2e + backend service test | Missing |
| E2E-P-014 | UC-P-10, SRS 5.8 | Patient + Doctor | Patient and doctor logged in in two browser contexts; active consultation session exists | Patient sends chat message; doctor receives; doctor sends reply; patient receives | Messages appear realtime without reload, are persisted, and sender styling is correct | Playwright multi-context e2e + socket client test | Partial: `consultation-socket-client.spec.ts` covers client contract; full browser role-to-role test missing |
| E2E-P-015 | SRS 5.8, 6.5 | Patient | Socket temporarily disconnects after joining | Disconnect/reconnect socket | Client rejoins same room and does not duplicate messages/listeners | Socket client unit/e2e component test | Covered: `consultation-socket-client.spec.ts` |
| E2E-P-016 | UC-P-13, SRS 5.9 | Patient | Completed consultation with summary and prescription exists | Open consultation history/result | Patient can view own summary and prescription | Playwright e2e | Covered: `doctor-workflow.spec.ts` E2E-029 |
| E2E-P-017 | UC-P-13, SRS 5.9, 6.1 | Patient | Completed consultation belongs to another patient | Direct-open another patient's result endpoint/route | Backend rejects with `403/404`; UI does not expose PHI | Backend service/controller test + Playwright e2e | Missing |
| E2E-P-018 | UC-P-14, SRS 5.10 | Patient | Completed appointment without existing rating | Submit score and comment | Rating is created and shown in patient history/public doctor rating summary if visible | Playwright e2e + backend service test | Missing |
| E2E-P-019 | UC-P-14, SRS 5.10 | Patient | Appointment is not completed | Attempt to submit rating | Backend rejects rating; UI shows clear error | Backend service test + Playwright e2e | Missing |

## Doctor

| Test ID | SRS reference/use case | Actor | Preconditions | Steps | Expected result | Suggested automation layer | Current automation status |
|---|---|---|---|---|---|---|---|
| E2E-D-001 | UC-D-01, SRS 5.2 | Doctor | Approved active doctor account seeded | Login as Doctor | Doctor lands on doctor dashboard | Playwright e2e | Covered: `auth.spec.ts` E2E-007 |
| E2E-D-002 | UC-D-02, SRS 5.3 | Doctor | Doctor logged in | Open doctor profile, update qualification summary, experience, consultation description, specialties if allowed | Profile persists and public detail reflects approved public fields | Playwright e2e + backend service test | Partial: backend doctor service tests cover profile; frontend e2e missing |
| E2E-D-003 | UC-D-05, SRS 5.3, 5.7 | Doctor | Doctor logged in | Update weekly working schedule | Schedule persists; availability API uses updated schedule | Playwright e2e + backend service test | Partial: backend appointment availability tests cover schedule usage; doctor UI e2e missing |
| E2E-D-004 | UC-D-03, SRS 5.6 | Doctor | Pending/open health question exists | Open assigned/open question list | Doctor sees actionable question with necessary context | Playwright e2e | Covered: `patient-questions.spec.ts` E2E-020 |
| E2E-D-005 | UC-D-04, SRS 4.3, 5.6 | Doctor | Pending health question exists | Submit answer | Question becomes `ANSWERED`; patient can view answer; notification outbox/log is created | Playwright e2e + backend service test | Covered/Partial: `patient-questions.spec.ts` E2E-021/E2E-022; notification assertion covered mainly by backend tests |
| E2E-D-006 | UC-D-06, SRS 5.7 | Doctor | Doctor has pending/confirmed appointment | Open doctor appointments | Doctor sees only own appointments and correct available actions | Playwright e2e | Partial: doctor workflow specs cover action-specific rows |
| E2E-D-007 | UC-D-06, SRS 5.7 | Doctor | Pending appointment exists | Confirm appointment | Status changes to `CONFIRMED`; patient notification is queued/logged; audit log exists | Playwright e2e + backend service test | Covered: `doctor-workflow.spec.ts` E2E-024; notification/audit assertion partial |
| E2E-D-008 | UC-D-05, SRS 5.7 | Doctor | Confirmed appointment exists; target slot available | Reschedule appointment | New time is accepted only if inside working schedule and no patient/doctor conflict | Backend service test + Playwright e2e | Partial: backend `appointment.service.spec.ts` covers conflict; frontend e2e missing |
| E2E-D-009 | UC-D-07, SRS 4.4, 5.8 | Doctor | Confirmed appointment is within allowed time window | Start consultation from appointment | Consultation session is created/loaded and route opens | Playwright e2e + backend service test | Covered: `doctor-workflow.spec.ts` E2E-026 |
| E2E-D-010 | UC-D-08, SRS 5.8 | Doctor + Patient | Doctor started consultation; patient joined | Exchange chat messages in two browser contexts | Messages are realtime, persisted, ordered, and not duplicated after REST history load | Playwright multi-context e2e + socket client test | Partial: socket client covered; full two-role e2e missing |
| E2E-D-011 | UC-D-08, SRS 4.4, 5.8 | Doctor | Video provider disabled/unavailable | Open live consultation | Video/mock video area falls back to chat without blocking consultation | Playwright e2e | Missing |
| E2E-D-012 | UC-D-09, SRS 5.9 | Doctor | Ongoing/completed consultation session exists for doctor's own appointment | Save consultation summary | Summary persists and is visible in result endpoint/page | Playwright e2e + backend service test | Covered: `doctor-workflow.spec.ts` E2E-027 |
| E2E-D-013 | UC-D-10, SRS 5.9 | Doctor | Consultation exists and business rule allows prescription | Create prescription with medication/dosage/frequency/duration/notes | Prescription is saved and patient can view it after completion | Playwright e2e + backend service test | Covered: `doctor-workflow.spec.ts` E2E-028/E2E-029 |
| E2E-D-014 | UC-D-09, SRS 4.4, 5.7, 5.8 | Doctor | Confirmed/ongoing consultation appointment exists | End/complete consultation | Session ends; appointment is `COMPLETED`; patient UI receives ended state and can view result | Playwright e2e + backend service test | Partial: appointment complete covered by E2E-025; live ended notification missing |
| E2E-D-015 | UC-D-11, SRS 5.9, 6.1 | Doctor | Doctor has prior consultation with patient | Open patient consultation history | Doctor sees history only for own patients/appointments | Playwright e2e + backend service test | Missing |

## Administrator

| Test ID | SRS reference/use case | Actor | Preconditions | Steps | Expected result | Suggested automation layer | Current automation status |
|---|---|---|---|---|---|---|---|
| E2E-A-001 | UC-A-01, SRS 5.2 | Administrator | Admin account seeded | Login as Admin | Admin lands on admin dashboard | Playwright e2e | Covered: `auth.spec.ts` E2E-008 |
| E2E-A-002 | UC-A-03, SRS 5.3, 5.12 | Administrator | Admin logged in; patient accounts seeded | Open Users/Patients management, create/update/deactivate patient account | Patient account changes persist; non-admin cannot access | Playwright e2e + backend service test | Partial: non-admin guard covered; user/patient mutation e2e should be expanded |
| E2E-A-003 | UC-A-02, SRS 5.3, 5.12 | Administrator | Admin logged in; doctor accounts seeded | Open Doctors management, view list, update approval/profile/specialties | Doctor approval/profile changes persist and public discovery respects active/approved status | Playwright e2e + backend service test | Covered/Partial: `admin.spec.ts` E2E-031/E2E-032; profile/specialty detail assertions should be expanded |
| E2E-A-004 | UC-A-04, SRS 5.4, 5.12 | Administrator | Admin logged in | Create, update, deactivate specialty | Specialty CRUD persists; inactive specialty is not offered publicly if business rule requires | Playwright e2e | Covered: `admin.spec.ts` E2E-033/E2E-034 |
| E2E-A-005 | UC-A-05, SRS 5.7, 5.12 | Administrator | Appointments seeded in multiple statuses | Open appointment management and filter/status update | Admin sees all appointments and can perform supported status update; audit log exists | Playwright e2e + backend service test | Missing/Partial: backend admin appointment API exists; e2e not listed |
| E2E-A-006 | UC-A-06, SRS 5.6, 5.10, 5.12 | Administrator | Questions, answers, and ratings requiring moderation exist | Open moderation page | Admin sees reviewable items with author/context and no placeholder empty list | Playwright e2e + backend service test | Partial: backend moderation tests exist; full UI e2e missing |
| E2E-A-007 | UC-A-06, SRS 5.6, 5.10, 6.1 | Administrator | Moderation item exists | Hide/restore supported content item | Item status changes, audit log is recorded, public/patient visibility follows status | Playwright e2e + backend service test | Partial: backend `moderation.service.spec.ts` covers service actions; UI e2e missing |
| E2E-A-008 | UC-A-07, UC-A-08, SRS 5.12 | Administrator | Reporting seed data exists | Open admin dashboard | Dashboard shows total consultations, active users, consultation activity stats without fake data | Playwright e2e + backend service test | Covered/Partial: `admin.spec.ts` E2E-030; detailed metric assertions should be expanded |
| E2E-A-009 | SRS 5.13 | Administrator | Consultation data exists across date range | Open Reports page, choose date range/grouping | Trend chart and stats update from backend data; filters are reflected in API request | Playwright e2e + backend reporting service test | Partial: backend `reporting.service.spec.ts`; dedicated reports e2e missing |
| E2E-A-010 | SRS 5.12, 6.1 | Patient/Doctor/Guest attempting Admin route | Non-admin user logged in or guest | Direct-open admin routes/API | Backend returns forbidden/unauthorized; frontend shows redirect/forbidden state | Playwright e2e + backend guard test | Covered: `admin.spec.ts` E2E-035 and `auth.spec.ts` role guard cases |

## Auth và Security

| Test ID | SRS reference/use case | Actor | Preconditions | Steps | Expected result | Suggested automation layer | Current automation status |
|---|---|---|---|---|---|---|---|
| E2E-AUTH-001 | SRS 5.2, 6.1 | Guest/Patient/Doctor/Admin | Seeded users for each role | Access protected routes as guest and wrong roles | Guest redirects to login; wrong roles see forbidden/no PHI; backend enforces role checks | Playwright e2e + backend guard/controller tests | Covered: `auth.spec.ts` E2E-009/E2E-010/E2E-011 and `admin.spec.ts` E2E-035 |
| E2E-AUTH-002 | SRS 5.2 | Authenticated user | Access token expired; refresh cookie valid | Trigger protected API request | Frontend performs one refresh, retries original request, and does not expose refresh token to JS | API/integration test + Playwright with mocked time/network | Partial: backend auth tests cover refresh rotation; frontend refresh retry needs integration/e2e |
| E2E-AUTH-003 | SRS 5.2, 6.5 | Authenticated user | Multiple concurrent protected requests receive `401`; valid refresh cookie | Fire concurrent requests | Refresh requests are deduplicated; all original requests resolve or all fail safely | Frontend integration test + backend auth service test | Missing |
| E2E-AUTH-004 | SRS 5.2 | Authenticated user | Valid session | Logout, then call protected API/refresh | Server session is revoked, refresh cookie cleared, subsequent refresh fails | Playwright e2e + backend controller/service tests | Covered/Partial: logout e2e and backend tests exist; post-logout refresh e2e missing |
| E2E-AUTH-005 | SRS 5.2 | Guest | Forgot password page available | Submit existing and non-existing email | UI shows same generic success message; no account enumeration | Playwright e2e + backend auth service test | Covered/Partial: `auth.spec.ts` forgot page; backend generic behavior should remain asserted |
| E2E-AUTH-006 | SRS 5.2 | User with reset notification | Valid unused reset token exists | Open reset link, submit valid password | Password changes, token consumed, existing sessions revoked, redirect to login | Backend service test + Playwright e2e with dev notification token fixture | Partial: reset page submit covered; full token consumption/session revocation covered by backend tests |
| E2E-AUTH-007 | SRS 5.2, 6.1 | User with expired/used token | Expired or already used reset token exists | Submit reset form | Backend rejects with consistent error; UI shows safe failure message | Backend service test + Playwright e2e | Covered/Partial: backend invalid token tests likely exist; e2e negative missing |
| E2E-AUTH-008 | SRS 6.1, 6.2 | Any authenticated role | User owns PHI; another user exists | Attempt cross-user appointment/consultation/result/question access via direct API/route | Backend rejects; no patient health data, prescription, summary, or chat history leaks | Backend service/controller tests + Playwright direct route tests | Partial: some question/appointment ownership tests exist; consultation/result cross-user e2e missing |

## Notification và external-adjacent flows

| Test ID | SRS reference/use case | Actor | Preconditions | Steps | Expected result | Suggested automation layer | Current automation status |
|---|---|---|---|---|---|---|---|
| E2E-N-001 | UC-P-15, UC-E-01, SRS 5.11 | Patient/Doctor/System | Appointment booking succeeds | Create appointment | Outbox event is created and notification log/provider receives appointment created email request | Backend integration/service test | Partial: notification service tests exist; full appointment-to-outbox integration should be explicit |
| E2E-N-002 | UC-P-15, UC-E-01, SRS 5.11 | Doctor/System | Pending appointment exists | Doctor confirms appointment | Confirmation notification is queued/sent/logged | Backend integration/service test | Partial |
| E2E-N-003 | UC-P-15, UC-E-01, SRS 5.11 | System | Upcoming appointment inside reminder window | Run reminder scheduler/service | Reminder notification is sent once and logged with status | Backend service/integration test | Partial: notification scheduler/service tests should be checked/expanded |
| E2E-N-004 | UC-P-11, SRS 5.11 | Doctor/System | Patient question exists | Doctor answers question | Patient notification is queued/sent/logged | Backend service/integration test | Partial |
| E2E-N-005 | UC-E-03, SRS 4.4, 5.8 | Patient/Doctor | Video provider disabled/unavailable | Start/join consultation | UI displays video mock/fallback and chat remains usable | Playwright e2e | Missing |
| E2E-N-006 | UC-E-02, SRS 5.11, 5.14 | System | SMS provider disabled | Run reminder flow | SMS is not required; email/development provider still verifies required notification flow | Backend service test | Missing/Optional |

## Cross-browser và responsive smoke tests

| Test ID | SRS reference/use case | Actor | Preconditions | Steps | Expected result | Suggested automation layer | Current automation status |
|---|---|---|---|---|---|---|---|
| E2E-R-001 | SRS 1.3, 6.6, 6.8 | Guest/Patient/Doctor/Admin | Seeded app | Run core smoke flows on desktop viewport | No layout-breaking overlap; primary actions remain visible | Playwright visual/smoke e2e | Partial |
| E2E-R-002 | SRS 1.3, 6.6, 6.8 | Guest/Patient/Doctor/Admin | Seeded app | Run core smoke flows on mobile viewport | Navigation, forms, chat, tables/cards remain usable | Playwright mobile viewport e2e | Missing |
| E2E-R-003 | SRS 6.5 | Any role | Backend returns validation/server error | Trigger representative form/API errors | UI shows clear error state; API response envelope includes requestId/code/message | Playwright e2e + backend filter tests | Partial: backend exception filter tests exist; UI envelope handling e2e missing |

## Ưu tiên triển khai automation tiếp theo

1. Patient live consultation two-browser test: join, realtime chat, doctor ends session, patient sees result.
2. Negative availability booking test at UI and API boundary.
3. Patient rating positive/negative tests.
4. Admin moderation UI tests for list, context, hide/restore.
5. Reports page date-range/chart e2e.
6. Refresh-token retry/dedup integration tests.
7. Cross-user PHI access denial tests for consultation result and prescription.
8. Mobile responsive smoke coverage for core flows.
