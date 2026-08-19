# SRS Traceability Matrix

Matrix này kết hợp Graphify-guided exploration với direct source verification. Một requirement chỉ được đánh dấu `COMPLETED` khi business flow thực sự được implement, không chỉ vì có controller/page/file tương ứng.

Status hợp lệ: `COMPLETED`, `PARTIAL`, `NOT_IMPLEMENTED`, `IMPLEMENTED_DIFFERENTLY`, `NEEDS_VERIFICATION`.

## Functional Requirements

| Requirement | Mô tả SRS | Bằng chứng backend | Bằng chứng frontend | Status | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| GUEST-01 | Guest truy cập public pages không cần login | `DiscoveryController` không có auth guard. | Public routes nằm ngoài `AuthGuard`. | COMPLETED |  |
| GUEST-02 | Xem home, specialties, doctors | `GET /public/home`, `/public/specialties`, `/public/doctors`. | `public.api.ts` gọi các endpoint public (`:112`, `:117`, `:125`). | COMPLETED | Home endpoint còn tối giản. |
| GUEST-03 | Search doctor theo specialty/keyword | `DiscoveryService.listPublicDoctors` filter `specialtyId` và keyword (`discovery.service.ts:26`, `:40`, `:49`). | Doctor list APIs truyền params. | COMPLETED | Search theo bio/name. |
| GUEST-04 | Xem public doctor detail | `GET /public/doctors/:doctorId`. | `getPublicDoctorDetail()` (`public.api.ts:139`). | COMPLETED |  |
| GUEST-05 | Chỉ hiển thị doctor active/approved | Filter `isActive`, `approvalStatus: APPROVED`, user active (`discovery.service.ts:34`-`:37`, `:141`-`:144`). | FE dùng public API. | COMPLETED |  |
| GUEST-06 | Protected guest action redirect auth | Protected endpoints require JWT. | `AuthGuard` redirect login; patient routes protected. | COMPLETED | Return-to-flow sau login cần verify thêm. |
| AUTH-01 | Patient register email/password | `POST /auth/register`, `UsersService.createUser`. | Register API/page. | COMPLETED | Cũng cho doctor register với specialty. |
| AUTH-02 | Login credential hợp lệ | `AuthService.login` check bcrypt. | `auth.api.login`, `auth.saga.handleLogin`. | COMPLETED |  |
| AUTH-03 | Logout | `POST /auth/logout`, revoke session. | `auth.saga.handleLogout`. | COMPLETED |  |
| AUTH-04 | RBAC | `Roles`, `RolesGuard`, controller roles. | `RoleGuard` + route role wrapping. | COMPLETED |  |
| AUTH-05 | Giới hạn theo role/data | Ownership checks trong appointment/consultation services. | Route guards. | COMPLETED | Backend là lớp authoritative. |
| AUTH-06 | Password recovery | `forgotPassword`, `resetPassword` persist/consume token. | Chưa thấy forgot/reset UI hoặc email flow. | PARTIAL | Token chưa được gửi qua email. |
| PROF-01 | Patient create/update health profile | `PatientService.updateMyProfile` tạo nếu thiếu và update fields. | `PatientProfilePage`, `patient.api.updateProfile`. | COMPLETED |  |
| PROF-02 | Patient profile đủ field tối thiểu | Schema có user name/email + DOB, gender, phone, address, medicalHistory. | Profile form map các field này. | COMPLETED | Contact gồm phone/address/email. |
| PROF-03 | Doctor create/update professional profile | Admin/user creation tạo doctor profile; doctor update endpoint. | Doctor profile page/API. | PARTIAL | Thiếu qualification summary riêng. |
| PROF-04 | Doctor profile field tối thiểu | `DoctorProfile` có bio, experience, specialties, schedule. | Doctor profile/schedule pages. | PARTIAL | Qualification summary chưa tách khỏi bio. |
| PROF-05 | Admin quản lý user account | `AdminUserController` list/create/get/update/status/delete. | Admin users/patients/doctors APIs/pages. | COMPLETED | Admin doctor profile create còn gap về bio/specialty. |
| SPEC-01 | Admin specialty CRUD/deactivate | `SpecialtyController` admin create/list/update/deactivate. | Admin specialty APIs/pages. | COMPLETED | Deactivate thay vì hard delete. |
| SPEC-02 | Doctor nhiều specialty | `DoctorSpecialty` join model. | Doctor update specialties; admin list hiển thị specialties. | COMPLETED | FE doctor profile thiên về single specialty. |
| SPEC-03 | Browse/filter doctor theo specialty | Public query filter. | Specialty/doctor list và booking specialty select. | COMPLETED |  |
| DISC-01 | Patient search doctor | Public doctor API được reuse. | `getDoctorsBySpecialty`. | COMPLETED |  |
| DISC-02 | Guest search doctor | Public routes/API. | Doctor list page. | COMPLETED |  |
| DISC-03 | Filter by specialty | Backend query filter. | FE public/patient APIs truyền `specialtyId`. | COMPLETED |  |
| DISC-04 | Doctor detail có availability | Backend trả doctor profile/schedule khi có. | FE normalize `schedule`, nhưng booking slots hard-code. | PARTIAL | Availability chưa gắn với booking. |
| DISC-05 | Chỉ active/approved doctor | Backend filter. | FE dùng public API. | COMPLETED |  |
| QNA-01 | Patient gửi question | `POST /questions`. | `AskQuestionPage`, `patient.api.askQuestion`. | COMPLETED |  |
| QNA-02 | Question status | Prisma enum có `PENDING`, `ANSWERED`, `CLOSED`, `MODERATED`. | FE map pending/answered/moderated. | COMPLETED | Có thêm `MODERATED`. |
| QNA-03 | Doctor xem assigned/open questions | `GET /questions/assigned`, `listDoctorQuestions`. | Doctor inbox/API. | COMPLETED | Open question là `doctorId=null` và pending. |
| QNA-04 | Doctor response | `POST /questions/:id/answers`. | Doctor inbox answer action. | COMPLETED |  |
| QNA-05 | Ghi response time/doctor | `Answer` có doctorId và createdAt. | FE hiển thị answer/answeredAt. | COMPLETED |  |
| QNA-06 | Patient xem questions/responses | `GET /questions/mine` include answers. | History page question table/detail. | COMPLETED |  |
| QNA-07 | Admin moderate question/response | `PATCH /admin/questions/:id/moderation`. | Moderation action APIs. | PARTIAL | Thiếu moderation list; chưa có answer moderation riêng. |
| APT-01 | Patient book appointment | `POST /appointments`, `createAppointment`. | Booking page/API/saga. | COMPLETED | Xem audit appointment. |
| APT-02 | Chỉ book free slots | Conflict checks có. | FE có selectable time slots. | PARTIAL | Chưa enforce doctor schedule availability. |
| APT-03 | Ngăn duplicate doctor slot | Overlap check doctor conflicts. | Error được surface qua saga/toast. | COMPLETED | Cũng check patient conflicts. |
| APT-04 | Store appointment info | `Appointment` model fields. | FE gửi doctor/time/reason/notes. | COMPLETED | `createdAt` có sẵn. |
| APT-05 | Appointment statuses | Prisma enum có required statuses + `NO_SHOW`. | FE map statuses. | COMPLETED | `NO_SHOW` là beyond minimum. |
| APT-06 | Doctor xem upcoming/past | `GET /appointments/doctor/me` với filter optional. | Doctor appointments page. | COMPLETED | UI là một list, chưa tách rõ upcoming/past. |
| APT-07 | Patient xem upcoming/past | `GET /appointments/mine`. | Consultation history table. | COMPLETED | Một history page chung. |
| APT-08 | Cancel appointment | Patient cancel endpoint block cancelled/completed. | Patient history cancel pending/confirmed. | COMPLETED | Business cancellation window chưa định nghĩa. |
| APT-09 | Admin quản lý appointments | `GET /admin/appointments`, status update. | Admin appointments API/page. | COMPLETED |  |
| CONS-01 | Khởi tạo session cho valid appointment | `POST /consultations/:appointmentId/start`. | Doctor session page start. | COMPLETED | Doctor-only start. |
| CONS-02 | Real-time chat | Backend Socket.IO gateway + REST persisted messages. | Doctor page dùng REST; thiếu patient live UI. | PARTIAL | Backend-capable, FE chưa đầy đủ. |
| CONS-03 | Video/mock consultation | Backend channel fallback. | FE start chat only. | PARTIAL | Không thấy video/mock UI. |
| CONS-04 | Giới hạn access consultation | Backend access checks patient/doctor/admin. | FE doctor route guard; patient result qua API. | COMPLETED | Patient live route vắng. |
| CONS-05 | Lưu summary | `ConsultationSession.summary`, `PATCH summary`. | Doctor summary input; patient result dialog. | COMPLETED |  |
| CONS-06 | Video fallback chat | Backend có `fallbackToChat`. | Không có video UI. | PARTIAL | Backend only. |
| PRES-01 | Doctor ghi result/recommendations | Summary endpoint/service. | Doctor summary input. | COMPLETED |  |
| PRES-02 | Doctor tạo e-prescription sau completed consult | Service yêu cầu appointment completed. | Doctor prescription form khi completed. | COMPLETED |  |
| PRES-03 | Prescription item fields | Model/DTO có medicationName/dosage/frequency/duration/notes. | Doctor form và patient result table. | COMPLETED |  |
| PRES-04 | Patient chỉ xem own results | `assertAppointmentAccess` check ownership. | Patient result dialog gọi protected endpoint. | COMPLETED |  |
| PRES-05 | Maintain consultation history | `GET /consultations/mine`, sessions schema. | Patient history dùng appointments + per-result fetch. | PARTIAL | Backend endpoint chưa được FE dùng đúng mức. |
| RATE-01 | Patient rating sau completed | `POST /ratings`, service require completed appointment. | Patient completed appointment action. | COMPLETED |  |
| RATE-02 | Rating comment | `Rating.comment`, `CreateRatingDto.comment`. | Rating dialog textarea. | COMPLETED |  |
| RATE-03 | Ngăn rating incomplete | `createRating` check appointment completed. | FE chỉ show rating khi completed. | COMPLETED |  |
| RATE-04 | Admin moderate rating | `PATCH /admin/ratings/:id/moderation`. | Moderation action APIs. | PARTIAL | Thiếu moderation list. |
| NOTI-01 | Appointment confirmation notification | Outbox event create/confirm + dispatcher. | Chưa thấy notification UI usage. | PARTIAL | Stored logs, chưa real email delivery. |
| NOTI-02 | Appointment reminders | Scheduler gọi `sendAppointmentReminders`. | Chưa thấy user notification UI. | PARTIAL | In-app/log notification, không có external provider. |
| NOTI-03 | Notify khi question answered | `QUESTION_ANSWERED` outbox tạo notification. | Chưa thấy notification UI. | PARTIAL | Backend log only. |
| NOTI-04 | Email support | `NotificationType.EMAIL`, provider strings. | Không thấy FE. | PARTIAL | Email đang là simulated/logged. |
| NOTI-05 | SMS optional | `NotificationType.SMS` enum. | Không thấy FE. | NOT_IMPLEMENTED | Optional nếu tích hợp external service. |
| NOTI-06 | Notification history/status | `NotificationLog` model/status và admin logs endpoint. | Chưa thấy FE API usage. | PARTIAL | Backend có, UI chưa có. |
| ADM-01 | Manage doctors/patients | Admin users/doctors endpoints. | Admin APIs/pages. | COMPLETED | Doctor profile detail creation còn gap. |
| ADM-02 | Manage specialties | Admin specialty endpoints. | Admin specialty pages/API. | COMPLETED |  |
| ADM-03 | Manage/monitor appointments | Admin appointment endpoints. | Admin appointment API/page. | COMPLETED |  |
| ADM-04 | Moderate consultation content | Question/rating moderation action endpoints. | Moderation page action APIs. | PARTIAL | Thiếu unified moderation list; chưa moderate consultation message. |
| ADM-05 | Dashboard metrics | `ReportingService.getDashboard`. | Admin dashboard/report APIs. | COMPLETED | Metrics thiên về appointment/user. |
| ADM-06 | Dashboard consultation/user/time counts | Dashboard + trend endpoint. | Reports charts gọi dashboard/trend. | PARTIAL | Có active users và consultation trend; còn FE chart TODO. |
| RPT-01 | Consultation stats over time | `GET /reports/consultations/trend`. | `getAppointmentsChart` dùng trend endpoint. | COMPLETED | Dùng completed appointment làm consultation proxy. |
| RPT-02 | Trend charts | Trend endpoint; chart components/pages. | Reports page APIs. | COMPLETED |  |
| RPT-03 | Date range filter | `ReportQueryDto` hỗ trợ `from`/`to`. | Report APIs truyền params. | COMPLETED |  |
| RPT-04 | Optional doctor/specialty/status stats | Dashboard có appointment status; thiếu top doctors/specialty distribution. | FE TODOs cho top doctors/specialty distribution. | PARTIAL | Optional MVP scope. |
| EXT-01 | Optional chatbot | Không thấy. | Không thấy. | NOT_IMPLEMENTED | Optional. |
| EXT-02 | Optional multilingual UI | N/A backend. | i18n resources `src/i18n/en` và `src/i18n/vi`. | IMPLEMENTED_DIFFERENTLY | SRS xem là optional/future nhưng code đã có. |
| EXT-03 | Optional dark mode | N/A backend. | Có dark-mode CSS classes/theme usage. | IMPLEMENTED_DIFFERENTLY | Optional/future feature đã có một phần. |
| EXT-04 | Optional SMS reminders | Enum only. | Không thấy. | NOT_IMPLEMENTED | Optional. |
| EXT-05 | Optional advanced video | Backend channel flag fallback only. | Không thấy. | PARTIAL | Optional. |
| EXT-06 | Optional advanced analytics | Basic dashboard/trend; còn TODO advanced charts. | Reports APIs/pages. | PARTIAL | Optional. |

## Ghi chú các flow core còn lại

| Flow | Status | Evidence/Ghi chú |
| --- | --- | --- |
| Doctor/Specialty search | COMPLETED | Public discovery filter active specialties/doctors theo specialty/keyword (`discovery.service.ts:19`, `:26`). |
| Doctor schedule/availability | PARTIAL | Doctor update được `schedule` (`doctor.service.ts:111`, schedule page dispatch update), nhưng appointment booking chưa enforce. |
| Prescription/guidance | COMPLETED | Consultation summary và prescription items có ở backend, doctor UI và patient result UI. |
| Consultation history | PARTIAL | Backend có consultation history endpoints; patient UI dùng appointment history + per-result fetch; doctor history endpoint chưa surfaced rõ. |
| Notification | PARTIAL | Backend outbox/scheduler/logs tồn tại; chưa có external provider hoặc user-facing notification page/API usage trong FE. |
| Admin management | PARTIAL | Users/specialties/appointments/doctors đa phần đã có; moderation listing và một số reporting endpoint còn thiếu. |

## Implemented nhưng chưa được SRS mô tả rõ

| Feature | Evidence | Ghi chú |
| --- | --- | --- |
| Refresh token session rotation | `UserSession` model; `AuthService.refresh` revoke old session và tạo session mới. | SRS nói auth nhưng không mô tả session rotation. |
| Audit logging cụ thể | `AuditLog` model; login/appointment/question/admin actions ghi log. | SRS NFR có audit log, code cụ thể hơn. |
| Outbox event pattern | `OutboxEvent` model; notification scheduler process outbox. | SRS chỉ nói notification/reminder. |
| `NO_SHOW` appointment status | `AppointmentStatus.NO_SHOW`. | SRS nhắc như alternative flow, enum/UI đã có. |
| Doctor rating aggregate trong public discovery | `DiscoveryService.getDoctorRatingSummary`. | SRS có rating/review, public aggregate là product detail thêm. |
| Multi-language UI | `OnlineHealthConsultation-Web/src/i18n/en` và `/vi`. | SRS xếp multilingual là optional/future, code đã có. |
| E2E test suite/page objects | `OnlineHealthConsultation-Web/e2e/...`. | Không thuộc SRS functional scope. |

## Graphify warnings và code quality findings

| Finding | Evidence | Severity | Recommendation |
| --- | --- | --- | --- |
| Frontend import cycles quanh API/store/sagas. | `GRAPH_REPORT.md`: `apiClient -> store -> rootSaga -> saga -> api -> apiClient`; tương tự `refreshManager`. | Medium | Decouple `apiClient`/`refreshManager` khỏi direct store imports; inject token/logout handlers. |
| Refresh contract mismatch. | FE `refreshManager` gửi body rỗng với cookies; BE expect `RefreshTokenDto`. | High | Align token transport. |
| Thiếu admin moderation list. | `admin.api.ts` có `TODO_BACKEND_API`, `getModerationItems` trả empty list. | High | Thêm list endpoint/UI data source cho questions/ratings cần review. |
| Reporting API gaps. | `reports.api.ts` TODOs cho question chart, top doctors, specialty distribution. | Medium | Thêm endpoints hoặc bỏ UI placeholders. |
| Admin doctor creation gap. | `admin.api.ts` TODO: chưa có dedicated admin endpoint tạo matching doctor profile với specialty/bio. | Medium | Thêm admin doctor profile create/update contract hoặc chỉnh UI. |
| SQL chưa được Graphify index. | Graphify warning: thiếu `tree_sitter_sql`. | Low | Cài `graphifyy[sql]` nếu cần graph coverage cho migrations. |

## Snapshot mức sẵn sàng tốt nghiệp

**Assessment: NEEDS_CORE_COMPLETION**

Hệ thống có nền tảng tốt: modular NestJS backend, Prisma relational model, protected React role flows, appointment lifecycle, question answering, consultation session/result/prescription, ratings, admin management, reporting cơ bản và outbox-style notifications. Core graduation flow "find doctor -> book appointment -> doctor consults -> result/prescription -> patient history" đã có nhưng chưa đủ chắc vì doctor availability chưa được enforce, patient live consultation còn thiếu, notification delivery đang là simulated/logged thay vì email/in-app UI hoàn chỉnh, và auth refresh/password reset cần hardening contract.
