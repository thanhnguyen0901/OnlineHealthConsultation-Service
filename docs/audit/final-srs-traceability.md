# Audit truy vết SRS cuối cùng

Nguồn yêu cầu duy nhất: `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`.

Ngày audit: 2026-08-20.

Các giá trị status:

| Status | Ý nghĩa |
|---|---|
| `COMPLETED` | Requirement đã được triển khai và có bằng chứng FE và/hoặc BE cụ thể. |
| `PARTIAL` | Requirement đã được triển khai một phần, phụ thuộc môi trường, hoặc còn thiếu phần production-grade. |
| `NOT_IMPLEMENTED` | Không tìm thấy triển khai có ý nghĩa. |
| `IMPLEMENTED_DIFFERENTLY` | Requirement được đáp ứng bằng cấu trúc hoặc workflow khác với cách diễn đạt trong SRS. |
| `NOT_APPLICABLE` | SRS đánh dấu mục này là optional/out-of-scope hoặc phụ thuộc external provider chưa bắt buộc. |

## Tóm tắt

Phần lớn core flows bắt buộc đã được triển khai end-to-end: public doctor discovery, auth, patient profile, health questions, doctor schedule availability, appointment booking/conflict prevention, consultation session, realtime chat, result/prescription, rating, admin management, moderation, notification outbox và reporting.

Các rủi ro còn lại trước khi nộp tập trung vào kiểm chứng vận hành và external provider:

1. Cần chạy seeded E2E suite khi backend và database đang chạy; graduation suite mới nhất chưa chạy hoàn tất trong môi trường hiện tại vì backend `localhost:4000` không hoạt động.
2. Nếu yêu cầu nộp bài cần gửi email thật, cần cấu hình hoặc hoàn thiện production email provider; hiện tại đã có email provider abstraction nhưng concrete provider là dry-run nếu chưa bật `NOTIFICATION_EMAIL_PROVIDER_ENABLED=true`.
3. HTTPS là cấu hình deployment/platform nên không thể xác minh chỉ bằng local source.
4. Performance, availability và browser compatibility có hỗ trợ ở mức kiến trúc nhưng chưa có load/cross-browser test evidence trong audit này.

## A. Chức năng hệ thống bắt buộc

### 5.1 Public Access cho Guest User

| SRS requirement | Status | Bằng chứng |
|---|---|---|
| Guest có thể truy cập public pages mà không cần login. | `COMPLETED` | FE public routes nằm ngoài `AuthGuard`: `src/app/routes.tsx`; các page `HomePage`, `SpecialtyListPage`, `DoctorListPage`, `DoctorDetailPage`. BE public controller không gắn auth guard: `src/modules/discovery/discovery.controller.ts`. |
| Guest có thể xem home, public specialties và public doctors. | `COMPLETED` | BE có `GET /public/home`, `/public/specialties`, `/public/doctors` trong `discovery.controller.ts`; FE có `HomePage`, `SpecialtyListPage`, `DoctorListPage`. |
| Guest có thể search doctors theo specialty hoặc keyword. | `COMPLETED` | BE `DiscoveryService.listPublicDoctors()` filter theo `specialtyId` và keyword trên doctor bio, qualification, consultation description, name. FE `DoctorListPage` có `doctor-search-input` và `specialty-filter`. |
| Guest có thể xem public doctor profile. | `COMPLETED` | BE `GET /public/doctors/:doctorId`; FE `DoctorDetailPage` hiển thị name, specialties, rating, consultation description, qualification summary, experience và schedule. |
| Public area chỉ hiển thị active và approved doctors. | `COMPLETED` | BE `DiscoveryService` filter `isActive: true`, `approvalStatus: APPROVED`, user active và chưa deleted. |
| Guest được redirect đến login/register khi thực hiện protected actions. | `COMPLETED` | FE `redirectGuestToLogin()` trong `src/features/public/pages/publicPageUtils.ts`; `DoctorListPage` và `DoctorDetailPage` dùng guest book/ask buttons. |

### 5.2 Authentication và Authorization

| SRS requirement | Status | Bằng chứng |
|---|---|---|
| Patient có thể register bằng email/password. | `COMPLETED` | BE `POST /auth/register`; `UsersService.createUser()` tạo user và patient profile. FE `RegisterPage` có form email/password/role. |
| Registered users có thể login. | `COMPLETED` | BE `AuthService.login()` compare bcrypt password và trả access token; FE `LoginPage` và `auth.saga.ts`. |
| Authenticated users có thể logout. | `COMPLETED` | BE `POST /auth/logout` revoke sessions và clear cookie; FE logout flow trong `auth.saga.ts`. |
| Role-based access cho Guest, Patient, Doctor, Administrator. | `COMPLETED` | BE dùng `JwtAuthGuard`, `RolesGuard`, `@Roles(...)` ở controllers; FE dùng `AuthGuard` và `RoleGuard` trong `routes.tsx`. |
| Users chỉ truy cập function/data phù hợp role. | `COMPLETED` | BE có ownership checks trong appointment, consultation, patient, doctor, admin services/controllers; FE route guard theo role. |
| Password recovery qua email hoặc secure mechanism tương đương. | `COMPLETED` | BE `forgotPassword()` tạo hashed one-time `PasswordResetToken`, reset notification, expiry và session revocation; FE `ForgotPasswordPage`, `ResetPasswordPage`. |

### 5.3 User Profile Management

| SRS requirement | Status | Bằng chứng |
|---|---|---|
| Patient có thể tạo/cập nhật health profile. | `COMPLETED` | BE `PatientController` `GET/PATCH /patients/me/profile`; `PatientService.updateMyProfile()` tạo profile nếu thiếu và cập nhật fields. FE `PatientProfilePage`. |
| Patient profile có full name, DOB, gender, contact, basic health data. | `IMPLEMENTED_DIFFERENTLY` | Full name lưu ở `User.firstName/lastName`; DOB/gender/contact/medical history lưu ở `PatientProfile`. FE `PatientProfilePage` hiển thị/chỉnh sửa các field profile. |
| Doctor có thể tạo/cập nhật professional profile. | `COMPLETED` | BE `DoctorController` `GET/PATCH /doctors/me/profile`, `/schedule`, `/specialties`; FE `DoctorProfilePage`, `SchedulePage`. |
| Doctor profile có full name, specialties, qualification summary, experience, consultation description, working schedule. | `COMPLETED` | Schema `DoctorProfile` có `qualificationSummary`, `consultationDescription`, `yearsOfExperience`, `schedule`; `DoctorSpecialty` hỗ trợ specialties; FE public/doctor/admin profile screens hiển thị/chỉnh sửa các field này. |
| Admin có thể create, update, activate, deactivate, delete user accounts theo role. | `COMPLETED` | BE `AdminUserController`, `UsersService.createUserByAdmin()`, `updateUserByAdmin()`, `updateUserStatus()`, `deleteUserByAdmin()`; FE `UsersManagePage`, `PatientsManagePage`, `DoctorsManagePage`. |

### 5.4 Specialty Management

| SRS requirement | Status | Bằng chứng |
|---|---|---|
| Admin có thể create, update, deactivate specialties. | `COMPLETED` | BE `SpecialtyController` và `SpecialtyService`; FE `SpecialtiesManagePage`. |
| Doctor có thể được gắn với một hoặc nhiều specialties. | `COMPLETED` | Schema `DoctorSpecialty` join table với unique `(doctorId, specialtyId)`; BE doctor/admin specialty update endpoints. |
| Patient và Guest có thể browse/filter doctors theo specialty. | `COMPLETED` | BE `DiscoveryService.listPublicSpecialties()` và `listPublicDoctors({ specialtyId })`; FE public doctor list và booking specialty dropdown. |

### 5.5 Doctor Discovery

| SRS requirement | Status | Bằng chứng |
|---|---|---|
| Patient có thể search doctors. | `COMPLETED` | FE patient booking dùng doctor discovery; public doctor list vẫn truy cập được với authenticated patient. BE public discovery API. |
| Guest có thể search doctors. | `COMPLETED` | FE `DoctorListPage`; BE `GET /public/doctors`. |
| Doctors có thể filter theo specialty. | `COMPLETED` | BE specialty filter trong `DiscoveryService`; FE `specialty-filter` và booking specialty dropdown. |
| Doctor detail có specialty, experience summary và available schedule. | `COMPLETED` | FE `DoctorDetailPage` render specialties, qualification, consultation description, experience và schedule; BE trả doctor profile và schedule. |
| Chỉ active và approved doctors hiển thị cho patients/guests. | `COMPLETED` | BE discovery và availability đều yêu cầu doctor active/approved và user active. |

### 5.6 Health Question Management

| SRS requirement | Status | Bằng chứng |
|---|---|---|
| Patient có thể submit health question. | `COMPLETED` | BE `QuestionController.createQuestion`; FE `AskQuestionPage`; Redux patient saga gọi `patientApi.askQuestion`. |
| Questions được lưu với statuses như `PENDING`, `ANSWERED`, `CLOSED`. | `COMPLETED` | Schema `QuestionStatus`; `QuestionService.createQuestion()` dùng `PENDING`; `answerQuestion()` set `ANSWERED`; moderation có thể close. |
| Doctor có thể xem assigned/open questions. | `COMPLETED` | BE `listDoctorQuestions()` trả assigned questions hoặc open pending questions; FE `InboxQuestionsPage`. |
| Doctor có thể answer health question. | `COMPLETED` | BE `answerQuestion()` tạo `Answer`, update status, ghi audit/outbox; FE doctor answer form. |
| Response time và responding doctor được ghi nhận. | `COMPLETED` | Schema `Answer.createdAt`, `Answer.doctorId`; service tạo answer với doctor profile id. |
| Patient có thể xem previous questions và answers. | `COMPLETED` | BE `listMyQuestions()` include approved answers; FE `ConsultationHistoryPage` question table/detail. |
| Admin có thể review/moderate question và response content. | `COMPLETED` | BE `ModerationController` list/moderate questions, answers, ratings; FE `ModerationPage`. |

### 5.7 Appointment Management

| SRS requirement | Status | Bằng chứng |
|---|---|---|
| Patient có thể book appointment với doctor. | `COMPLETED` | BE `AppointmentController.createAppointment`; FE `BookAppointmentPage`; `patient.api.ts`. |
| Patient chỉ có thể book vào available slots. | `COMPLETED` | FE fetch `/public/doctors/:doctorId/availability`; BE re-validate schedule/overlap trong `createAppointment()`. |
| Prevent duplicate bookings cho cùng doctor/time. | `COMPLETED` | BE `assertNoAppointmentOverlap()` check active doctor và patient conflicts bằng duration overlap. |
| Appointment lưu patient, doctor, date/time, reason, status, created time. | `COMPLETED` | Schema `Appointment` fields. |
| Appointment statuses gồm `PENDING_CONFIRMATION`, `CONFIRMED`, `COMPLETED`, `CANCELLED`. | `COMPLETED` | Schema `AppointmentStatus`. |
| Doctor có thể xem upcoming và past appointments. | `COMPLETED` | BE `listDoctorAppointments()` có date/status filters; FE `DoctorAppointmentsPage`. |
| Patient có thể xem upcoming và past appointments. | `COMPLETED` | BE `listMyAppointments()`; FE `ConsultationHistoryPage`. |
| Appointment có thể cancel theo business rules. | `COMPLETED` | BE `cancelAppointment()` chặn cancel completed/cancelled hoặc appointment của patient khác; FE patient cancel actions. |
| Admin có thể xem và manage all appointments. | `COMPLETED` | BE `AdminAppointmentController`; FE `AppointmentsManagePage`. |

### 5.8 Consultation Session Management

| SRS requirement | Status | Bằng chứng |
|---|---|---|
| System có thể initialize consultation cho valid appointment. | `COMPLETED` | BE `ConsultationService.startSession()` validate doctor, appointment status và time window. FE doctor `ConsultationSessionPage`. |
| Realtime chat được hỗ trợ. | `COMPLETED` | BE `ConsultationGateway` namespace `/consultations`, events `consultation:join/message`; FE shared `ConsultationSocketClient`, `useConsultationSocket`, patient và doctor session pages. |
| Session access giới hạn cho patient, assigned doctor, authorized admin. | `COMPLETED` | BE `joinSession()` và `assertAppointmentAccess()` enforce patient/doctor ownership; controllers có role guards. |
| Session summary được lưu. | `COMPLETED` | BE `updateSummary()` update `ConsultationSession.summary`; FE doctor summary input/save và patient result display. |
| Fallback từ video sang chat khi video unavailable. | `IMPLEMENTED_DIFFERENTLY` | BE `startSession()` map requested `VIDEO` sang `CHAT` nếu `VIDEO_PROVIDER_ENABLED=true` không bật; FE patient page có `mock-video-panel` cho video channel. Đây là fallback/mock nhẹ, không phải real video. |

### 5.9 Consultation Result và Prescription

| SRS requirement | Status | Bằng chứng |
|---|---|---|
| Doctor có thể record consultation result/recommendations. | `COMPLETED` | BE `updateSummary()`; FE doctor summary form. |
| Doctor có thể tạo basic e-prescription cho completed consultation. | `COMPLETED` | BE `createPrescription()` yêu cầu appointment `COMPLETED`; FE doctor prescription form. |
| Prescription lưu medication name, dosage, frequency, duration, doctor notes. | `COMPLETED` | Schema `PrescriptionItem` fields; DTO `CreatePrescriptionDto`; FE prescription form/table. |
| Patient chỉ xem được result/prescription của consultation của chính mình. | `COMPLETED` | BE `getConsultationResult()` gọi `assertAppointmentAccess()`; FE patient route protected by role. |
| Consultation history được duy trì để truy xuất về sau. | `COMPLETED` | BE `listMyConsultations()` và `listDoctorConsultations()`; FE `ConsultationHistoryPage` và doctor history access. |

### 5.10 Rating và Feedback

| SRS requirement | Status | Bằng chứng |
|---|---|---|
| Patient có thể rate sau khi consultation completed. | `COMPLETED` | BE `createRating()` yêu cầu appointment `COMPLETED`; FE `ConsultationHistoryPage` rating dialog. |
| Patient có thể gửi text comment kèm rating. | `COMPLETED` | Schema `Rating.comment`; DTO `CreateRatingDto`; FE rating dialog/comment. |
| Prevent rating cho incomplete appointment. | `COMPLETED` | BE `createRating()` reject non-completed appointments và duplicate ratings. |
| Admin có thể moderate rating/comment khi cần. | `COMPLETED` | BE `AdminRatingController` và general `ModerationController`; FE `ModerationPage`. |

### 5.11 Notification và Reminders

| SRS requirement | Status | Bằng chứng |
|---|---|---|
| Gửi confirmation notification khi appointment created hoặc confirmed. | `COMPLETED` | Appointment service ghi `APPOINTMENT_CREATED` và `APPOINTMENT_CONFIRMED` outbox events; `NotificationService.dispatchOutboxEvent()` tạo notification logs. |
| Gửi appointment reminder trước appointment time. | `COMPLETED` | `NotificationScheduler` chạy reminder cron; `NotificationService.sendAppointmentReminders()` scan confirmed appointments và tạo reminders cho patient/doctor. |
| Notify patient khi doctor answer question. | `COMPLETED` | `QuestionService.answerQuestion()` ghi `QUESTION_ANSWERED`; notification dispatcher tạo patient notification. |
| Hỗ trợ email notifications. | `PARTIAL` | Provider abstraction hỗ trợ email; `EmailNotificationProvider` tồn tại. Actual provider là dry-run/disabled nếu môi trường chưa enable/configure. Development provider kiểm chứng được nhưng không gửi email thật. |
| Ghi nhận notification history. | `COMPLETED` | Schema `NotificationLog`; `NotificationController` expose mine/admin logs; service dùng idempotent upsert. |
| Lưu provider delivery status khi có. | `COMPLETED` | `NotificationLog.status/provider/errorCode/errorMsg`; provider result update log thành `SENT` hoặc `FAILED`. |

### 5.12 System Administration

| SRS requirement | Status | Bằng chứng |
|---|---|---|
| Admin manage doctor và patient accounts. | `COMPLETED` | BE `AdminUserController`, doctor admin endpoints; FE `UsersManagePage`, `PatientsManagePage`, `DoctorsManagePage`. |
| Admin manage specialties. | `COMPLETED` | BE `SpecialtyController`; FE `SpecialtiesManagePage`. |
| Admin manage và monitor appointments. | `COMPLETED` | BE `AdminAppointmentController`; FE `AppointmentsManagePage`. |
| Admin moderate consultation-related content. | `COMPLETED` | BE `ModerationController` cho questions/answers/ratings; FE `ModerationPage`. |
| Dashboard hiển thị system activity metrics. | `COMPLETED` | BE `ReportingService.getDashboard()`; FE `AdminDashboardPage` và reports dashboard cards. |
| Dashboard có total consultations, active users, consultations over time. | `COMPLETED` | BE dashboard trả `totalConsultations`, `totalActiveUsers`; `getConsultationTrend()` trả trend points. FE `ReportsPage` chart. |

### 5.13 Reports và Statistics

| SRS requirement | Status | Bằng chứng |
|---|---|---|
| Consultation activity statistics theo thời gian. | `COMPLETED` | BE `ReportingService.getConsultationTrend()` group consultation sessions theo day/week/month. |
| Consultation trend hiển thị bằng chart/graph. | `COMPLETED` | FE `ReportsPage` dùng `BarChartWidget` với backend trend points. |
| Admin có thể filter statistics theo date range. | `COMPLETED` | BE `ReportQueryDto`/`parseTimeRange()` hỗ trợ `from`, `to`; FE date inputs và apply/clear filters. |

### Section 6 Non-Functional Requirements

| SRS requirement | Status | Bằng chứng / lý do |
|---|---|---|
| HTTPS bảo vệ client-server communication ở deployed environments. | `PARTIAL` | Code có HTTP capability và CORS config, nhưng HTTPS là deployment/platform configuration, chưa chứng minh được bằng local source. |
| Passwords lưu bằng bcrypt/Argon2. | `COMPLETED` | BE dùng `bcryptjs` trong `UsersService.createUserCore()` và `AuthService.resetPassword()`. |
| Authentication enforce cho protected resources. | `COMPLETED` | Controllers dùng `JwtAuthGuard`; FE route guards. |
| Authorization enforce cho role-restricted endpoints. | `COMPLETED` | Controllers dùng `RolesGuard`/`@Roles`; services enforce ownership. |
| Server validate toàn bộ input; client validate khi phù hợp. | `COMPLETED` | Global `ValidationPipe` với whitelist/forbid; DTO validators; FE Yup schemas. |
| Bảo vệ trước SQL injection, XSS, broken access control. | `PARTIAL` | Prisma và validation giảm SQL injection risk; React escaping giảm XSS risk; guards/ownership xử lý broken access control. Chưa thấy CSP hoặc full security test evidence. |
| Sensitive health data chỉ lưu/truy cập bởi authorized users. | `COMPLETED` | Patient, appointment, consultation, question services enforce profile ownership/role access. |
| Patient consultation records giới hạn cho patient, assigned doctor, authorized admin. | `COMPLETED` | `ConsultationService.assertAppointmentAccess()` cộng với guarded controllers. |
| Audit log cho important actions. | `COMPLETED` | Auth, appointment, question, doctor/admin, moderation services ghi `AuditLog`; Prisma middleware sanitize metadata. |
| Privacy principles cho personal/health data. | `PARTIAL` | Có access controls và audit metadata sanitation, nhưng chưa có formal retention policy implementation ngoài schema/audit data. |
| Giảm thiểu PHI exposure trong UI/logs. | `PARTIAL` | UI chỉ hiển thị health history ở nơi liên quan; audit sanitizer mask sensitive metadata; request logs không log body. Chưa kiểm chứng exhaustively broader PHI minimization policy. |
| Consultation và prescription confidentiality. | `COMPLETED` | Result/prescription endpoints enforce role/ownership; FE protected patient/doctor routes. |
| Data retention cho consultation và audit data. | `PARTIAL` | Data models tồn tại, nhưng chưa thấy configurable retention/purge workflow. |
| Standard API response dưới normal load acceptable. | `PARTIAL` | API dùng service-layer/Prisma, nhưng repo chưa có load test result. |
| 95% normal requests dưới 3 giây. | `PARTIAL` | Chưa được verify bằng performance tests. |
| Hỗ trợ initial concurrent usage. | `PARTIAL` | Stateless Nest services và DB-backed sessions hỗ trợ baseline scaling, nhưng chưa có concurrency benchmark. |
| Dashboard load trong thời gian chấp nhận được. | `PARTIAL` | Dashboard queries dùng aggregate counts; chưa có performance benchmark. |
| Modular separation of concerns. | `COMPLETED` | BE modules: identity, patient, doctor, appointment, consultation, notification, moderation, reporting; FE feature modules. |
| Horizontal scaling/stateless app services. | `PARTIAL` | Access tokens stateless và refresh/session state lưu DB; chưa có deployment scaling proof. |
| External providers có thể thay thế với ít impact lên core logic. | `COMPLETED` | Notification provider interface cùng dev/email/SMS provider classes; video feature flag fallback. |
| Availability với minimal unplanned downtime. | `PARTIAL` | Error handling/outbox retry cải thiện reliability; chưa có infrastructure HA evidence. |
| Safe error handling và consistent error response. | `COMPLETED` | Global `HttpExceptionFilter`; Prisma error mapping; production server errors không lộ internal messages. |
| Tránh data inconsistency trong booking/update. | `COMPLETED` | Appointment creation/reschedule dùng `Serializable` transactions và re-validation. |
| Video fallback trong khi chat vẫn available. | `IMPLEMENTED_DIFFERENTLY` | Video provider disabled fallback sang chat/mock UI; chưa phải full external video integration. |
| Responsive UI trên desktop/tablet/mobile. | `PARTIAL` | Tailwind responsive layouts được dùng rộng rãi; chưa có final cross-viewport audit attached. |
| Core tasks đơn giản/rõ ràng/logical. | `COMPLETED` | FE flows tồn tại cho register, question, booking, consultation, admin/reporting với pages/routes rõ ràng. |
| User feedback rõ cho success/failure/validation/loading. | `COMPLETED` | FE `InlineAlert`, toast messages, loading states, Yup validation trên major pages. |
| Forms có labels rõ và validation. | `COMPLETED` | Auth/profile/question/booking/report forms dùng labels và validation schemas. |
| Navigation/layout nhất quán. | `COMPLETED` | Shared `MainLayout`, `AuthLayout`, route constants. |
| Codebase modularized. | `COMPLETED` | BE Nest modules và FE feature folders. |
| Business rules tách khỏi presentation khi khả thi. | `COMPLETED` | Availability, booking, consultation, notification rules nằm trong services; controllers/pages delegate. |
| API documented nhất quán. | `COMPLETED` | Swagger configured trong `main.ts`; controllers dùng `@ApiTags`, `@ApiOperation`, `@ApiBearerAuth`. |
| Environment configuration dễ maintain. | `COMPLETED` | `validate-env.ts`, `.env.example`, provider và cookie envs. |
| Logging/monitoring hooks hỗ trợ debug/ops. | `PARTIAL` | Có request logging, scheduler logs, provider logs; chưa có external monitoring integration. |
| Modern browser support. | `PARTIAL` | Vite/React app target modern browsers; chưa có browser matrix verification trong audit này. |
| Responsive layout thích ứng common screen sizes. | `PARTIAL` | Có responsive classes; chưa có final visual evidence. |
| Externalized text khi áp dụng i18n. | `COMPLETED` | FE dùng `react-i18next` và JSON resources trong `src/i18n`. |

### Section 7 Constraints

| SRS constraint | Status | Bằng chứng / lý do |
|---|---|---|
| Ưu tiên core consultation/appointment hơn advanced telemedicine. | `COMPLETED` | Core flows đã triển khai; advanced video/SMS vẫn là optional/fallback. |
| Medical advice chỉ mang tính tham khảo, không thay thế emergency/direct care. | `PARTIAL` | Product copy/SRS nêu điều này; chưa verify explicit in-app emergency disclaimer trong audit này. |
| Bốn main roles: Guest, Patient, Doctor, Administrator. | `COMPLETED` | Schema `Role`; guards/routes/controllers dùng four-role model. |
| Web platform. | `COMPLETED` | React frontend và Nest backend. |
| Frontend là ReactJS. | `COMPLETED` | `OnlineHealthConsultation-Web` là Vite React app. |
| Backend dựa trên Node.js. | `COMPLETED` | NestJS backend. |
| Relational database. | `COMPLETED` | Prisma schema với PostgreSQL-oriented relational models. |
| Role-based authentication/authorization. | `COMPLETED` | JWT, guards, roles. |
| Video có thể dùng WebRTC/external/mock mechanism. | `IMPLEMENTED_DIFFERENTLY` | Mock/channel fallback đã triển khai; chưa có real WebRTC/external provider. |
| SMS/video advanced providers phụ thuộc provider readiness. | `NOT_APPLICABLE` | SRS explicit đây là provider-dependent optional integrations. |
| Scope được kiểm soát để deliver core end-to-end. | `COMPLETED` | Mandatory workflows có mặt; optional advanced features không block core flows. |
| Optional features không ảnh hưởng core quality. | `COMPLETED` | Optional SMS/video được isolate sau providers/flags/fallbacks. |
| Extensions ưu tiên theo testability và impact. | `COMPLETED` | E2E matrix và graduation E2E spec tập trung core flows trước. |

## B. Optional / Extended Functionality

| Optional SRS item | Status | Bằng chứng / lý do |
|---|---|---|
| Video consultation qua WebRTC/external/mock. | `IMPLEMENTED_DIFFERENTLY` | Có mock/fallback; real WebRTC/external video chưa triển khai. |
| SMS reminders. | `NOT_APPLICABLE` | `SmsNotificationProvider` tồn tại nhưng disabled nếu chưa configure; SRS đánh dấu SMS optional. |
| File upload / file storage. | `NOT_IMPLEMENTED` | Schema có `FileAttachment`, nhưng chưa verify FE upload flow hoặc storage provider implementation cho booking/question attachments. SRS xem file storage là external/conditional. |
| Chatbot basic health simulation. | `NOT_APPLICABLE` | SRS 5.14 explicit optional/extended. |
| Multi-language UI. | `COMPLETED` | FE i18n resources tồn tại cho English/Vietnamese. |
| Dark mode. | `COMPLETED` | FE pages dùng dark-mode Tailwind classes. |
| Advanced video. | `NOT_APPLICABLE` | Optional, không bắt buộc trong current scope. |
| Advanced analytics filters/charts. | `PARTIAL` | Required reporting đã triển khai; optional advanced doctor/specialty/status analytics còn limited/hidden nếu chưa trivial. |

## C. Out-of-Scope Functionality

| Out-of-scope SRS item | Status | Lý do |
|---|---|---|
| Emergency medical dispatch, hospital admission, ambulance coordination. | `NOT_APPLICABLE` | Explicitly outside SRS scope. |
| Direct integration với hospital EMR/EHR. | `NOT_APPLICABLE` | Explicitly outside SRS scope. |
| Insurance claim processing/payment gateway. | `NOT_APPLICABLE` | Explicitly outside SRS scope. |
| Advanced clinical decision support/diagnosis automation. | `NOT_APPLICABLE` | Explicitly outside SRS scope. |
| Real-time biometric monitoring / medical IoT. | `NOT_APPLICABLE` | Explicitly outside SRS scope. |
| Full telemedicine compliance certification. | `NOT_APPLICABLE` | Explicitly outside SRS scope. |

## Core Journey Verification

| Journey | Status | Bằng chứng |
|---|---|---|
| 1. Guest doctor discovery | `COMPLETED` | Public routes/pages và discovery APIs; active/approved filtering. |
| 2. Patient registration/login | `COMPLETED` | Auth controllers/services, FE auth pages, refresh cookie flow. |
| 3. Patient health profile | `COMPLETED` | Patient profile controller/service và FE profile page. |
| 4. Health question -> doctor response | `COMPLETED` | Question service/controller, doctor inbox, patient history. |
| 5. Doctor schedule -> available slot -> booking | `COMPLETED` | Doctor schedule endpoint/UI, public availability API, patient booking page, backend re-validation. |
| 6. Appointment lifecycle | `COMPLETED` | Create, confirm, complete, cancel, reschedule/admin status endpoints và pages. |
| 7. Patient + doctor consultation | `COMPLETED` | Patient và doctor consultation routes/pages; backend start/join/end service. |
| 8. Realtime chat | `COMPLETED` | Socket.IO gateway và shared FE consultation socket client/hook. |
| 9. Result + prescription | `COMPLETED` | Summary và prescription service/UI; patient result view. |
| 10. Patient consultation history | `COMPLETED` | Patient history page kết hợp appointments, questions, result/prescription/rating actions. |
| 11. Rating | `COMPLETED` | Rating controller/service, patient rating UI, doctor visible ratings, moderation. |
| 12. Notification/reminder | `PARTIAL` | Outbox, reminders, logs, dev/email provider abstraction đã triển khai; real production email provider vẫn cần configuration/provider wiring. |
| 13. Admin management | `COMPLETED` | Users, doctors, patients, specialties, appointments, moderation pages/APIs. |
| 14. Reporting | `COMPLETED` | Admin reports dashboard, trend chart, date range và group-by filtering. |

## Test Evidence cụ thể đã tìm thấy

| Area | Bằng chứng |
|---|---|
| Backend unit tests | `appointment.service.spec.ts`, `auth.service.spec.ts`, `notification.service.spec.ts`, `moderation.service.spec.ts`, `reporting.service.spec.ts`, `validate-env.spec.ts`, `http-exception.filter.spec.ts`. |
| Frontend E2E coverage | Existing Playwright specs cộng với `e2e/specs/graduation-flows.spec.ts` cho core graduation flows. |
| Giới hạn audit hiện tại | Graduation E2E suite mới nhất cần backend ở `localhost:4000`; lần chạy local ở task trước fail vì backend chưa chạy. |

## Cần fix trước khi nộp

1. Start backend + database, chạy seed/migrations, sau đó chạy critical E2E suite, đặc biệt `e2e/specs/graduation-flows.spec.ts`; đính kèm hoặc báo cáo kết quả.
2. Nếu cần actual email delivery, configure/implement concrete production email provider phía sau `EmailNotificationProvider`; nếu không, document rõ development notification logs là cơ chế verification.
3. Thêm visible emergency/non-substitution medical disclaimer nếu giảng viên/evaluator kỳ vọng business constraint của SRS xuất hiện trong app, không chỉ trong documentation.
4. Quyết định file attachment support có nằm trong submitted scope không. Nếu có, implement upload/storage; nếu không, giữ documented là conditional/out-of-scope.
5. Với production deployment evidence, verify HTTPS, CORS origins, secure refresh cookie settings và non-development notification provider configuration.
