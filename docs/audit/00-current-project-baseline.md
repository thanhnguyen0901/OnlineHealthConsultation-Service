# Current Project Baseline Audit

Tài liệu này là baseline audit sau khi SRS được cập nhật. Source of truth là `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`; kết luận bên dưới được đối chiếu với source code của `OnlineHealthConsultation-Service`, `OnlineHealthConsultation-Web`, các audit hiện có trong `docs/project-audit`, và `graphify-out/GRAPH_REPORT.md`.

Status sử dụng:

* `COMPLETED`: flow end-to-end đã có backend, frontend hoặc contract sử dụng được, kèm kiểm soát quyền phù hợp.
* `PARTIAL`: có một phần đáng kể nhưng còn thiếu business rule, UI, contract hoặc integration.
* `NOT_IMPLEMENTED`: chưa thấy triển khai đáng kể.
* `IMPLEMENTED_DIFFERENTLY`: đã có nhưng khác cách SRS phân loại hoặc khác hướng mô tả.
* `NEEDS_VERIFICATION`: cần chạy/test môi trường hoặc dữ liệu thật để kết luận chắc chắn.

## 1. Executive summary

Hệ thống đã có nền tảng tốt cho các luồng chính: public discovery, auth/RBAC, profile, specialty, question/answer, appointment lifecycle, consultation result, prescription, rating, admin management cơ bản và reporting cơ bản. Backend NestJS tổ chức theo module rõ ràng, Prisma schema bao phủ đa số thực thể nghiệp vụ, frontend React có route guard theo role và các màn hình chính cho patient/doctor/admin.

Tuy nhiên baseline hiện tại vẫn là `PARTIAL` so với SRS vì các flow quan trọng chưa đạt end-to-end đầy đủ:

* Doctor availability chưa được tính từ `DoctorProfile.schedule`; booking frontend dùng hard-coded `timeSlots`, backend chỉ chống overlap chứ chưa kiểm tra lịch làm việc của doctor.
* Patient chưa có live consultation page/route để join phiên tư vấn; doctor page dùng REST chat + reload, chưa dùng Socket.IO gateway.
* Refresh token contract đã được đồng bộ theo hướng cookie HttpOnly: frontend gửi `POST /auth/refresh` với `withCredentials`, backend đọc refresh token từ cookie, rotate `UserSession`, và login/logout set/clear cookie.
* Forgot/reset password có token backend nhưng chưa có email/notification delivery và chưa có UI frontend.
* Notification đang là outbox/log in-app ở backend, chưa có provider email thật hoặc user-facing notification UI.
* Admin moderation thiếu endpoint/list nguồn dữ liệu; frontend `getModerationItems()` trả `[]`.
* Reporting có dashboard/trend cơ bản, nhưng frontend còn TODO cho question chart, top doctors và specialty distribution.

## 2. Requirement traceability table

| Nhóm SRS | Requirement | Evidence backend | Evidence frontend | Status | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Public Access | Guest xem home, specialties, doctor list/detail không cần login | `DiscoveryController` expose `/public/home`, `/public/specialties`, `/public/doctors`, `/public/doctors/:doctorId` không có auth guard. | Public routes nằm ngoài `AuthGuard`; `DoctorListPage`, `DoctorDetailPage`, `SpecialtyListPage` gọi `public.api.ts`. | `COMPLETED` | Home endpoint còn tối giản nhưng đủ public access. |
| Public Access | Guest search/filter doctor theo specialty hoặc keyword | `DiscoveryService.listPublicDoctors()` filter `specialtyId`, keyword theo bio/name. | `DoctorListPage` truyền `keyword`, `specialtyId`. | `COMPLETED` |  |
| Public Access | Chỉ hiển thị doctor active/approved | Backend filter `isActive`, `approvalStatus: APPROVED`, user active và chưa deleted. | FE dùng public API. | `COMPLETED` |  |
| Public Access | Guest action yêu cầu auth phải chuyển tới login/register | Protected patient routes đi qua `AuthGuard`. | Public doctor cards gọi `redirectGuestToLogin()`. | `COMPLETED` | Return-to-flow sau login cần kiểm thử thêm nhưng route protection đã có. |
| Authentication & Authorization | Register/login/logout | `AuthController`, `AuthService`, `UsersService` có register, bcrypt login, logout revoke sessions. | `LoginPage`, `RegisterPage`, `auth.api.ts`, `auth.saga.ts`. | `COMPLETED` | Register frontend cố ý không auto-login sau đăng ký. |
| Authentication & Authorization | RBAC theo Guest, Patient, Doctor, Administrator | `JwtAuthGuard`, `RolesGuard`, `@Roles(...)` trên controllers. | `AuthGuard`, `RoleGuard`, route wrapping theo role. | `COMPLETED` | Backend vẫn là lớp authoritative. |
| Authentication & Authorization | Data access theo owner/role | Appointment/consultation services check patient/doctor ownership; admin routes guard role. | FE ẩn route theo role. | `COMPLETED` | Một số màn hình admin/report vẫn có mismatch riêng bên dưới. |
| Authentication & Authorization | Password recovery qua email/cơ chế tương đương | `forgotPassword()` tạo hashed reset token; `resetPassword()` consume token, đổi password, revoke sessions. | Không thấy forgot/reset password pages hoặc API wrapper sử dụng. | `PARTIAL` | Token không được gửi qua email/outbox; user chưa có flow end-to-end. |
| User Profile | Patient profile create/update | `PatientService.updateMyProfile()` tạo profile nếu thiếu và update DOB, gender, phone, address, medicalHistory. | `PatientProfilePage`, `patient.api.updateProfile()`. | `COMPLETED` |  |
| User Profile | Doctor profile create/update | `UsersService.createUserCore()` tạo doctor profile; `DoctorService.updateMyProfile()`, update schedule/specialties. | `DoctorProfilePage`, `SchedulePage`, `doctor.api.ts`. | `PARTIAL` | Thiếu qualification summary riêng; frontend doctor profile thiên về one specialty. |
| User Profile | Admin quản lý user accounts | `AdminUserController` list/create/get/update/status/delete. | Admin users/patients/doctors pages và `admin.api.ts`. | `PARTIAL` | Admin doctor creation có TODO về profile/specialty/bio contract. |
| Specialty | Admin CRUD/deactivate specialty | `SpecialtyController` admin endpoints. | `SpecialtiesManagePage`, `admin.api` specialty calls. | `COMPLETED` | Deactivate thay vì hard delete, phù hợp quản trị dữ liệu. |
| Specialty | Doctor gắn nhiều specialty | Prisma `DoctorSpecialty` join model; `DoctorService.updateMySpecialties()`. | Public/admin normalize nhiều specialties; doctor profile UI chủ yếu chọn một specialty. | `PARTIAL` | Backend hỗ trợ nhiều; UI chưa khai thác đầy đủ. |
| Specialty | Patient/Guest duyệt/filter theo specialty | Public specialties/doctors endpoints. | Public doctor list và booking flow dùng specialty filter. | `COMPLETED` |  |
| Doctor Discovery | Patient/Guest tìm kiếm doctor | Reuse public discovery API. | `DoctorListPage`, patient booking `getDoctorsBySpecialty()`. | `COMPLETED` |  |
| Doctor Discovery | Detail doctor gồm specialty, experience, schedule/availability | Public doctor detail trả profile/specialties; schedule được normalize nếu có. | `DoctorDetailPage` hiển thị weekly schedule. | `PARTIAL` | Detail có schedule, nhưng availability để book slot chưa có. |
| Health Questions | Patient gửi câu hỏi | `POST /questions`, `QuestionService.createQuestion()`. | `AskQuestionPage`, `patient.api.askQuestion()`. | `COMPLETED` |  |
| Health Questions | Question status và history | Prisma enum `PENDING`, `ANSWERED`, `CLOSED`, `MODERATED`; `/questions/mine` include answers. | `ConsultationHistoryPage` hiển thị questions/answers/status. | `COMPLETED` | FE map `CLOSED` thành moderated. |
| Health Questions | Doctor xem assigned/open questions và phản hồi | `/questions/assigned`, `/questions/:id/answers`; outbox `QUESTION_ANSWERED`. | `InboxQuestionsPage`, `doctor.api.answerQuestion()`. | `COMPLETED` |  |
| Health Questions | Admin kiểm duyệt câu hỏi/phản hồi | `PATCH /admin/questions/:id/moderation`; `QuestionModeration` model. | `ModerationPage` có action UI nhưng list API trả empty. | `PARTIAL` | Chưa có list moderation; chưa có answer moderation riêng. |
| Appointment | Patient đặt lịch với doctor | `POST /appointments`, validation doctor active/approved, create `PENDING_CONFIRMATION`. | `BookAppointmentPage`, `patient.api.bookAppointment()`. | `PARTIAL` | Flow tạo được appointment, nhưng availability chưa đúng SRS. |
| Appointment | Chỉ đặt vào khung giờ còn trống | Backend check doctor/patient overlap trên `PENDING_CONFIRMATION`, `CONFIRMED`. | FE dùng hard-coded `timeSlots`. | `PARTIAL` | Chưa check `DoctorProfile.schedule`; chưa có available slots API. |
| Appointment | Ngăn đặt trùng doctor/patient | `AppointmentService.createAppointment()` và `rescheduleAppointment()` check overlap. | Error surface qua API/saga. | `COMPLETED` | Create dùng `Serializable` transaction; reschedule conflict query giới hạn quanh 24h. |
| Appointment | Appointment lưu đủ thông tin và trạng thái | Prisma `Appointment` có patient, doctor, scheduledAt, duration, status, reason, notes, timestamps. | FE normalize date/time/status. | `COMPLETED` | Enum có thêm `NO_SHOW`. |
| Appointment | Patient/doctor xem lịch hẹn | `/appointments/mine`, `/appointments/doctor/me`, `/appointments/:id`. | Patient history, doctor appointments page. | `COMPLETED` | UI chưa tách rõ upcoming/past nhưng dữ liệu có. |
| Appointment | Hủy/confirm/complete/reschedule/admin update | Patient cancel, doctor confirm/complete/reschedule, admin list/status update. | Patient cancel, doctor actions, admin appointments page. | `COMPLETED` | Cancellation window chưa được SRS định nghĩa chi tiết. |
| Consultation | Doctor start session cho appointment hợp lệ | `/consultations/:appointmentId/start`; check doctor ownership, status, time window. | Doctor `ConsultationSessionPage` start button. | `COMPLETED` | Backend auto-confirm nếu appointment pending. |
| Consultation | Patient/doctor/admin join session và access control | `/consultations/:appointmentId/join`; `assertAppointmentAccess()`; gateway also calls `joinSession()`. | Doctor API có join; patient không có live page. | `PARTIAL` | Backend hỗ trợ patient join, frontend chưa expose. |
| Consultation | Realtime chat | `ConsultationGateway` có `consultation:join`, `consultation:message`; REST persisted messages cũng có. | Doctor page dùng REST `getMessages/sendMessage` rồi reload; không thấy socket client. | `PARTIAL` | Backend-capable, frontend chưa realtime. |
| Consultation | Summary sau phiên tư vấn | `PATCH /consultations/:appointmentId/summary`; `ConsultationSession.summary`. | Doctor summary input; patient result dialog đọc summary. | `COMPLETED` | Doctor có thể lưu summary khi session tồn tại, không chỉ sau end. |
| Consultation | Video/mock và fallback chat | Backend channel `VIDEO` phụ thuộc `VIDEO_PROVIDER_ENABLED`, fallback `CHAT`. | Doctor start hard-code `{ channel: 'CHAT' }`; không thấy video/mock UI. | `PARTIAL` | Optional/mở rộng, chưa end-to-end. |
| Consultation Result & Prescription | Doctor tạo prescription cho completed consultation | `createPrescription()` yêu cầu appointment `COMPLETED`, upsert prescription và items. | Doctor prescription form khi completed. | `COMPLETED` |  |
| Consultation Result & Prescription | Patient xem own result/prescription/history | `getConsultationResult()` enforce ownership; `/consultations/mine` tồn tại. | Patient history mở result dialog cho completed appointment. | `PARTIAL` | FE không dùng `/consultations/mine`; không có live-session result transition. |
| Rating & Feedback | Patient rating sau completed appointment | `POST /ratings` check ownership, completed, one rating per appointment. | Patient history rating dialog chỉ cho completed. | `COMPLETED` |  |
| Rating & Feedback | Admin moderate rating/comment | `PATCH /admin/ratings/:id/moderation`. | Moderation action APIs exist. | `PARTIAL` | Không có moderation list; comment review chưa có workflow rõ. |
| Notification | Appointment created/confirmed/question answered notifications | Outbox events created from appointment/question services; `NotificationService.processOutboxBatch()`. | Không thấy notification UI/user API usage trong frontend. | `PARTIAL` | Backend tạo `NotificationLog` dạng simulated/logged. |
| Notification | Appointment reminders | `NotificationScheduler.sendAppointmentReminders()` scan confirmed appointments. | Không thấy UI hiển thị notifications. | `PARTIAL` | Idempotent log, chưa có provider email thật. |
| Notification | Email support | `NotificationType.EMAIL`, `NotificationLog`, provider string `OUTBOX_WORKER`. | Không thấy email integration hoặc inbox. | `PARTIAL` | Email đang được biểu diễn như log, chưa delivery. |
| Notification | SMS optional | Prisma enum có `SMS`. | Không thấy provider/UI/API gửi SMS. | `NOT_IMPLEMENTED` | Optional/mở rộng. |
| Administration | Manage doctors/patients/specialties/appointments | Admin users/doctors/specialties/appointments endpoints. | Admin management pages. | `PARTIAL` | CRUD chính có, nhưng admin doctor profile create/update chưa đầy đủ. |
| Administration | Moderation content | Question/rating moderation action endpoints. | Moderation table có action nhưng data source empty. | `PARTIAL` | High-priority gap. |
| Administration | Dashboard metrics | `/reports/dashboard` trả active users/doctors/patients, appointments/status. | Admin dashboard gọi `getStats()`. | `PARTIAL` | UI kỳ vọng thêm totals questions/ratings/specialties nhưng backend không trả, normalize thành 0. |
| Reporting | Consultation stats over time và chart | `/reports/consultations/trend` group day/week/month. | Reports page dùng `getAppointmentsChart()`. | `COMPLETED` | Dùng completed appointment làm consultation proxy. |
| Reporting | Date range filter | `ReportQueryDto` có `from`, `to`, `groupBy`. | API wrapper có params; page hiện load default không có filter UI rõ. | `PARTIAL` | Backend có; frontend filter UX cần xác minh/bổ sung. |
| Reporting | Optional stats by doctor/specialty/status | Dashboard có appointments by status. | `reports.api.ts` TODO top doctors/specialty distribution returns `[]`. | `PARTIAL` | Optional/mở rộng, chưa đầy đủ. |
| Extended Features | Chatbot mô phỏng | Không thấy. | Không thấy. | `NOT_IMPLEMENTED` | Optional/mở rộng. |
| Extended Features | Đa ngôn ngữ | N/A backend. | `src/i18n/en`, `src/i18n/vi`, `LanguageToggle`. | `IMPLEMENTED_DIFFERENTLY` | SRS xếp optional; code đã có đáng kể. |
| Extended Features | Dark Mode | N/A backend. | Tailwind `dark:` classes và theme usage. | `IMPLEMENTED_DIFFERENTLY` | SRS xếp optional; code đã có một phần. |
| Extended Features | Advanced analytics/video/SMS | Một phần schema/channel/status enum. | Reports TODO, no video UI, no SMS provider. | `PARTIAL` | Các mục optional chưa end-to-end. |

## 3. Core user flow status

| Flow | Status | Đánh giá |
| --- | --- | --- |
| Guest xem chuyên khoa, tìm doctor, mở doctor detail | `COMPLETED` | Public API và public routes hoạt động theo đúng access model; backend filter active/approved doctor. |
| Guest bấm book/ask rồi chuyển sang login/register | `COMPLETED` | Public UI redirect sang auth/patient flow; route guard bảo vệ hành động cần auth. |
| Patient đăng ký, đăng nhập, cập nhật profile | `COMPLETED` | Auth/profile flow có backend và frontend; silent refresh dùng HttpOnly cookie. |
| Patient gửi câu hỏi, doctor trả lời, patient xem câu trả lời | `COMPLETED` | Backend và frontend đủ luồng chính; notification answer là partial do delivery/UI. |
| Patient chọn doctor và đặt appointment | `PARTIAL` | Appointment tạo được và chống conflict, nhưng available slot không dựa trên doctor schedule. |
| Doctor quản lý schedule | `PARTIAL` | Doctor có thể lưu schedule JSON; chưa có chuẩn availability model và chưa dùng để validate booking/reschedule. |
| Doctor confirm/reschedule/complete appointment | `COMPLETED` | Backend/FE có actions; reschedule chống conflict nhưng chưa check schedule. |
| Doctor start consultation, chat, end, summary, prescription | `PARTIAL` | Doctor UI có REST chat/result/prescription; thiếu realtime frontend và video/mock. |
| Patient tham gia live consultation | `NOT_IMPLEMENTED` | Backend `joinSession()` cho patient tồn tại, nhưng không có patient live route/page/action từ appointment. |
| Patient xem consultation result/prescription và rating | `PARTIAL` | Xem result/rating completed appointment có; history chưa dùng consultation endpoint và không nối từ live session. |
| Admin quản lý users/doctors/patients/specialties/appointments | `PARTIAL` | Các CRUD chính có; admin doctor profile creation/update còn contract gap. |
| Admin moderation | `PARTIAL` | Action endpoints có, list workflow thiếu. |
| Admin reporting/dashboard | `PARTIAL` | Dashboard/trend có; frontend kỳ vọng nhiều số liệu/charts backend chưa cung cấp. |
| Notification/reminder | `PARTIAL` | Outbox/scheduler/log tồn tại; email delivery/user notification UI chưa hoàn chỉnh. |

## 4. Critical gaps

| Priority | Gap | Evidence | Impact |
| --- | --- | --- | --- |
| P0 | Refresh token cookie contract | FE `refreshManager.ts` gọi `/auth/refresh` với `{}` và `withCredentials`; BE `AuthController.refresh()` đọc cookie HttpOnly, `AuthService.refresh()` verify token, rotate session và set cookie mới. | Đã đồng bộ contract; cần tiếp tục kiểm thử trên môi trường production HTTPS/SameSite thực tế. |
| P0 | Doctor availability chưa end-to-end | `DoctorProfile.schedule` có trong schema/service; `BookAppointmentPage` dùng hard-coded `timeSlots`; không thấy availability API; `createAppointment()` không check schedule. | Patient có thể đặt ngoài giờ làm việc; SRS appointment availability chưa đạt. |
| P0 | Patient live consultation thiếu | Routes chỉ có `/doctor/consultations/:appointmentId`; patient history chỉ view result/rating/cancel. | Patient không tham gia được phiên chat theo SRS dù backend có join/session. |
| P1 | Frontend chưa dùng Socket.IO realtime | Backend `ConsultationGateway` có events; FE doctor page dùng REST send/list và reload. | Chat không realtime đúng nghĩa; UX consultation chưa đạt. |
| P1 | Password recovery chưa usable | Backend tạo reset token nhưng không trả token, không gửi email/outbox, không có frontend pages. | Requirement password recovery mới đạt backend partial. |
| P1 | Notification delivery/UI chưa hoàn chỉnh | `NotificationLog` được tạo bởi outbox worker; không thấy email provider thật hoặc frontend notification list. | Appointment/question reminders khó xác minh bởi user. |
| P1 | Admin moderation list thiếu | `admin.api.ts:getModerationItems()` trả `[]`; backend chỉ có action endpoints. | Admin không xem được item cần kiểm duyệt, moderation flow không usable. |
| P1 | Reports route authorization mismatch | FE `ROUTE_PATHS.REPORTS` cho `ADMIN`, `DOCTOR`; BE `ReportingController` chỉ `@Roles(Role.ADMIN)`. | Doctor vào reports sẽ bị 403. |
| P2 | Reporting metric contract mismatch | FE normalize `totalQuestions`, `totalRatings`, `totalSpecialties` nhưng backend dashboard không trả các field đó. | Dashboard hiển thị 0/thiếu dữ liệu dù DB có thể có dữ liệu. |
| P2 | Admin doctor creation/profile contract gap | `admin.api.ts` TODO nói chưa có dedicated endpoint tạo matching doctor profile với specialty/bio. | Admin doctor management chưa đầy đủ theo SRS. |

## 5. Technical debt

| Area | Debt | Evidence | Recommendation |
| --- | --- | --- | --- |
| Frontend architecture | Import cycles quanh `apiClient`, `refreshManager`, Redux store và sagas. | `graphify-out/GRAPH_REPORT.md` liệt kê nhiều cycles như `apiClient -> store -> rootSaga -> saga -> api -> apiClient`. | Decouple API client khỏi direct store import; inject token getter/logout handler hoặc đưa refresh orchestration vào middleware. |
| Stubs/TODO | Một số component/API đang là stub hoặc placeholder. | `AppointmentForm.tsx`, `QuestionForm.tsx`, `AnswerEditor.tsx`, admin table components; `reports.api.ts` và `admin.api.ts` có `TODO_BACKEND_API`. | Xóa stub không dùng hoặc hoàn thiện theo module ownership; không để UI trông completed khi data source là empty. |
| Auth security | Refresh token đã dùng HttpOnly cookie; access token vẫn lưu sessionStorage; JWT/gateway có dev secret fallback. | `refreshManager.ts`, `auth.service.ts`, `auth.controller.ts`, `consultation.gateway.ts`. | Kiểm thử cookie trên production HTTPS/SameSite; validate env ở production; giảm coupling và exposure. |
| Availability model | `schedule` lưu JSON nhưng chưa có contract/algorithm chuẩn. | `DoctorProfile.schedule`, `UpdateDoctorScheduleDto`, `SchedulePage`, booking hard-code. | Thiết kế availability model trước khi implement API slots và validation. |
| Notification architecture | Outbox tạo log nhưng chưa có provider abstraction rõ cho email/dev/SMS. | `NotificationService.createNotificationIdempotent()` dùng provider string `OUTBOX_WORKER`. | Tách provider interface; ghi status theo kết quả gửi thật hoặc development provider. |
| Reporting contract | FE kỳ vọng nhiều chart nhưng backend chỉ dashboard/trend. | `reports.api.ts` TODOs. | Đồng bộ API contract: thêm endpoint hoặc bỏ/ẩn chart chưa có. |
| Moderation workflow | Backend action-only, frontend list empty. | `AdminQuestionController`, `AdminRatingController`, `admin.api.getModerationItems()`. | Thêm list endpoint gom pending questions/ratings hoặc thiết kế theo từng content type. |

## 6. Recommended implementation order

1. **Verify refresh token architecture in deployed environments**
   Contract đã dùng HttpOnly refresh cookie. Cần verify HTTPS, `Secure`, `SameSite`, CORS credentials và domain/path cookie theo môi trường deploy.

2. **Design doctor availability**
   Tạo `docs/design/doctor-availability-design.md`: schedule representation, slot algorithm, timezone, overlap, schedule changes, API contract và affected FE/BE files.

3. **Implement backend availability**
   Thêm API available slots theo doctor/date; validate booking/reschedule against schedule và conflicts; giữ transaction protection.

4. **Update frontend booking slots**
   Bỏ hard-coded `timeSlots`; fetch available slots khi đổi doctor/date; loading/empty/error state; không duplicate business rule ở frontend.

5. **Design and implement patient live consultation**
   Thêm patient route/page, join conditions, session lifecycle, REST history/result và Socket.IO lifecycle.

6. **Build shared realtime consultation client**
   Dùng đúng gateway event `consultation:join` và `consultation:message`; handle token, reconnect, cleanup, duplicate events.

7. **Migrate doctor consultation to realtime**
   Giữ REST load initial history/result, dùng socket cho message mới; không làm vỡ start/end/summary/prescription.

8. **Complete password recovery**
   Thêm frontend forgot/reset pages; backend gửi reset notification/email qua outbox/provider; token one-time, hashed, expiring.

9. **Complete notification architecture**
   Provider abstraction cho email/dev/log, outbox retry/status, appointment created/confirmed/reminder/question answered/password reset.

10. **Complete admin moderation**
    Thêm list endpoint và UI data source thật cho questions/ratings cần moderation; action phải audit và enforce ADMIN.

11. **Align reporting/dashboard contract**
    Sửa authorization route `/reports`, bổ sung metrics backend hoặc chỉnh frontend không hiển thị số liệu không có nguồn.

12. **Clean technical debt**
    Gỡ TODO/stub không dùng, giảm import cycles, chuẩn hóa API response/pagination/status mapping.

## 7. Notes

Không có production code nào được chỉnh trong audit này. File này chỉ ghi nhận baseline hiện tại và thứ tự triển khai khuyến nghị theo SRS mới.
