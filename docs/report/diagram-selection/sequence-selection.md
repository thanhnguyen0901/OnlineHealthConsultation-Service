# Sequence Diagram Selection for Graduation Report

Tài liệu này audit toàn bộ sequence diagrams hiện có và chọn một bộ nhỏ, đại diện để đưa vào báo cáo tốt nghiệp. Mục tiêu là giải thích các runtime flow quan trọng, không lặp lại từng Use Case.

## Nguồn Đã Đọc

- SRS cuối cùng: `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`
- Traceability matrix cuối cùng: `docs/audit/final-srs-traceability.md`
- Kiến trúc hệ thống: `docs/architecture/system-architecture.md`
- Graphify outputs: `graphify-out/GRAPH_REPORT.md`, `graphify-out/graph.json`, `graphify-out/manifest.json`
- Sequence sources: `docs/diagrams/sequences/*-sequences.md`
- Source code kiểm chứng: `AuthController/AuthService`, `AppointmentController/AppointmentService`, `ConsultationGateway/ConsultationService`, `ModerationController/ModerationService`, `NotificationScheduler/NotificationService`, `PrismaService`.

## Graphify / Source Verification Summary

Graphify graph xác nhận các node runtime quan trọng tồn tại trong source: `AuthController`, `AuthService`, `UsersService`, `AppointmentController`, `AppointmentService`, `ConsultationGateway`, `ConsultationService`, `ModerationController`, `ModerationService`, `NotificationScheduler`, `NotificationService` và `PrismaService`. Source code xác nhận các dependency chính: controller/gateway delegate sang service, service dùng `PrismaService`, appointment/question tạo `OutboxEvent`, notification scheduler xử lý outbox/reminder trong cùng NestJS process.

## Full Sequence Inventory

| Diagram | Source file | Actor | Use Case | Involved modules | Verified | Keep? | Reason |
| ------- | ----------- | ----- | -------- | ---------------- | -------- | ----- | ------ |
| 1. View Public Home | guest-sequences.md | Guest User | UC-G-01 | DiscoveryController, DiscoveryService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Public GET/redirect flow đơn giản; Use Case diagram đủ diễn giải, không thêm giá trị kỹ thuật cho report. |
| 2. Browse Specialties | guest-sequences.md | Guest User | UC-G-02 | DiscoveryController, DiscoveryService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Public GET/redirect flow đơn giản; Use Case diagram đủ diễn giải, không thêm giá trị kỹ thuật cho report. |
| 3. Search Doctor | guest-sequences.md | Guest User | UC-G-03 | DiscoveryController, DiscoveryService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Public GET/redirect flow đơn giản; Use Case diagram đủ diễn giải, không thêm giá trị kỹ thuật cho report. |
| 4. View Doctor Detail | guest-sequences.md | Guest User | UC-G-04 | DiscoveryController, DiscoveryService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Public GET/redirect flow đơn giản; Use Case diagram đủ diễn giải, không thêm giá trị kỹ thuật cho report. |
| 5. Attempt Protected Action -> Authentication Redirect | guest-sequences.md | Guest User | UC-G-06 | React route/action guard, public page utilities | Có, kiểm tra ở mức tài liệu/source chính | Không | Public redirect flow đơn giản; Use Case diagram đủ diễn giải, không thêm giá trị kỹ thuật cho report. |
| 1. Register | patient-sequences.md | Patient | UC-P-01 | AuthController, UsersService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Đúng implementation nhưng không đủ khác biệt hoặc bị trùng với sequence được chọn. |
| 2. Login | patient-sequences.md | Patient | UC-P-02 | AuthController, AuthService, UsersService, Prisma | Có | Có | Đại diện cho authentication, password check, session persistence, refresh cookie và audit log. |
| 3. Update Health Profile | patient-sequences.md | Patient | UC-P-04 | PatientController, PatientService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | CRUD/admin/profile flow quan trọng nhưng ít khác biệt kiến trúc; không nên tăng số lượng diagram. |
| 4. Search Doctor | patient-sequences.md | Patient | UC-P-05, UC-P-06 | DiscoveryController, DiscoveryService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Chủ yếu là read/query Controller -> Service -> Prisma -> response; giá trị kỹ thuật thấp hoặc trùng pattern. |
| 5. Submit Health Question | patient-sequences.md | Patient | UC-P-07 | QuestionController, QuestionService, Prisma, Outbox | Có, kiểm tra ở mức tài liệu/source chính | Không | Question flow đúng nhưng bị ưu tiên thấp hơn booking, realtime và notification; có thể mô tả bằng text. |
| 6. Book Appointment | patient-sequences.md | Patient | UC-P-08, UC-P-15 | AppointmentController, AppointmentService, Prisma, Outbox | Có | Có | Business flow quan trọng nhất của hệ thống; có validation lịch, transaction serializable, audit log và outbox event. |
| 7. View Appointments | patient-sequences.md | Patient | UC-P-09, UC-P-12 | AppointmentController, AppointmentService, Prisma, Outbox | Có, kiểm tra ở mức tài liệu/source chính | Không | Chủ yếu là read/query Controller -> Service -> Prisma -> response; giá trị kỹ thuật thấp hoặc trùng pattern. |
| 8. Cancel Appointment | patient-sequences.md | Patient | UC-P-09 | AppointmentController, AppointmentService, Prisma, Outbox | Có, kiểm tra ở mức tài liệu/source chính | Không | Cùng họ AppointmentService; booking đã đại diện tốt hơn vì có full validation + outbox. |
| 9. Join Consultation | patient-sequences.md | Patient | UC-P-10 | ConsultationController/Gateway, ConsultationService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Đúng implementation nhưng không đủ khác biệt hoặc bị trùng với sequence được chọn. |
| 10. Realtime Chat | patient-sequences.md | Patient | UC-P-10 | ConsultationController/Gateway, ConsultationService, Prisma | Có | Có | Đại diện pattern realtime khác REST: Socket.IO Gateway, JWT handshake, persisted message và broadcast. |
| 11. View Consultation Result | patient-sequences.md | Patient | UC-P-13 | ConsultationController/Gateway, ConsultationService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Chủ yếu là read/query Controller -> Service -> Prisma -> response; giá trị kỹ thuật thấp hoặc trùng pattern. |
| 12. View Prescription | patient-sequences.md | Patient | UC-P-13 | ConsultationController/Gateway, ConsultationService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Chủ yếu là read/query Controller -> Service -> Prisma -> response; giá trị kỹ thuật thấp hoặc trùng pattern. |
| 13. Consultation History | patient-sequences.md | Patient | UC-P-11, UC-P-12, UC-P-13, UC-P-14 | ConsultationController/Gateway, ConsultationService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Chủ yếu là read/query Controller -> Service -> Prisma -> response; giá trị kỹ thuật thấp hoặc trùng pattern. |
| 14. Submit Rating | patient-sequences.md | Patient | UC-P-14 | RatingController/AdminRatingController, ConsultationService/ModerationService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Feedback/moderation đã được bao phủ bởi admin moderation; không cần diagram riêng. |
| 15. Forgot/Reset Password | patient-sequences.md | Patient | Auth recovery requirement | Controller, Service, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Đúng implementation nhưng không đủ khác biệt hoặc bị trùng với sequence được chọn. |
| 1. Login | doctor-sequences.md | Doctor | UC-D-01 | AuthController, AuthService, UsersService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Trùng với sequence login được chọn; không cần lặp theo từng actor. |
| 2. Update Professional Profile | doctor-sequences.md | Doctor | UC-D-02 | DoctorController, DoctorService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | CRUD/admin/profile flow quan trọng nhưng ít khác biệt kiến trúc; không nên tăng số lượng diagram. |
| 3. Update Working Schedule | doctor-sequences.md | Doctor | UC-D-05 | DoctorController, DoctorService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | CRUD/admin/profile flow quan trọng nhưng ít khác biệt kiến trúc; không nên tăng số lượng diagram. |
| 4. View Health Questions | doctor-sequences.md | Doctor | UC-D-03 | QuestionController, QuestionService, Prisma, Outbox | Có, kiểm tra ở mức tài liệu/source chính | Không | Chủ yếu là read/query Controller -> Service -> Prisma -> response; giá trị kỹ thuật thấp hoặc trùng pattern. |
| 5. Respond To Health Question | doctor-sequences.md | Doctor | UC-D-04 | QuestionController, QuestionService, Prisma, Outbox | Có, kiểm tra ở mức tài liệu/source chính | Không | Question flow đúng nhưng bị ưu tiên thấp hơn booking, realtime và notification; có thể mô tả bằng text. |
| 6. View Appointments | doctor-sequences.md | Doctor | UC-D-06 | AppointmentController, AppointmentService, Prisma, Outbox | Có, kiểm tra ở mức tài liệu/source chính | Không | Chủ yếu là read/query Controller -> Service -> Prisma -> response; giá trị kỹ thuật thấp hoặc trùng pattern. |
| 7. Confirm Appointment | doctor-sequences.md | Doctor | UC-D-06 | AppointmentController, AppointmentService, Prisma, Outbox | Có, kiểm tra ở mức tài liệu/source chính | Không | Cùng họ AppointmentService; booking đã đại diện tốt hơn vì có full validation + outbox. |
| 8. Reschedule Appointment | doctor-sequences.md | Doctor | UC-D-05, UC-D-06 | AppointmentController, AppointmentService, Prisma, Outbox | Có, kiểm tra ở mức tài liệu/source chính | Không | Cùng họ AppointmentService; booking đã đại diện tốt hơn vì có full validation + outbox. |
| 9. Start Consultation | doctor-sequences.md | Doctor | UC-D-07 | ConsultationController/Gateway, ConsultationService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Đúng implementation nhưng không đủ khác biệt hoặc bị trùng với sequence được chọn. |
| 10. Realtime Consultation Chat | doctor-sequences.md | Doctor | UC-D-08 | ConsultationController/Gateway, ConsultationService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Đúng implementation nhưng không đủ khác biệt hoặc bị trùng với sequence được chọn. |
| 11. Save Consultation Summary | doctor-sequences.md | Doctor | UC-D-09 | ConsultationController/Gateway, ConsultationService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Đúng implementation nhưng không đủ khác biệt hoặc bị trùng với sequence được chọn. |
| 12. End Consultation | doctor-sequences.md | Doctor | UC-D-09 | ConsultationController/Gateway, ConsultationService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Đúng implementation nhưng không đủ khác biệt hoặc bị trùng với sequence được chọn. |
| 13. Create Prescription | doctor-sequences.md | Doctor | UC-D-10 | ConsultationController/Gateway, ConsultationService, Prisma | Có | Có | Đại diện clinical output sau consultation, transaction upsert prescription/items và business rule appointment completed. |
| 14. View Consultation History | doctor-sequences.md | Doctor | UC-D-11 | ConsultationController/Gateway, ConsultationService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Chủ yếu là read/query Controller -> Service -> Prisma -> response; giá trị kỹ thuật thấp hoặc trùng pattern. |
| 1. Login | admin-sequences.md | Administrator | UC-A-01 | AuthController, AuthService, UsersService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Trùng với sequence login được chọn; không cần lặp theo từng actor. |
| 2. Manage Patient Account | admin-sequences.md | Administrator | UC-A-03 | Controller, Service, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | CRUD/admin/profile flow quan trọng nhưng ít khác biệt kiến trúc; không nên tăng số lượng diagram. |
| 3. Manage Doctor Account | admin-sequences.md | Administrator | UC-A-02 | Controller, Service, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | CRUD/admin/profile flow quan trọng nhưng ít khác biệt kiến trúc; không nên tăng số lượng diagram. |
| 4. Manage Specialty | admin-sequences.md | Administrator | UC-A-04 | SpecialtyController, SpecialtyService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | CRUD/admin/profile flow quan trọng nhưng ít khác biệt kiến trúc; không nên tăng số lượng diagram. |
| 5. Manage Appointment | admin-sequences.md | Administrator | UC-A-05 | AppointmentController, AppointmentService, Prisma, Outbox | Có, kiểm tra ở mức tài liệu/source chính | Không | Cùng họ AppointmentService; booking đã đại diện tốt hơn vì có full validation + outbox. |
| 6. Moderate Health Question/Response | admin-sequences.md | Administrator | UC-A-06 | ModerationController, ModerationService, Prisma, AuditLog | Có | Có | Đại diện admin authorization, moderation workflow, audit log và cập nhật nội dung. |
| 7. Moderate Rating/Comment | admin-sequences.md | Administrator | UC-A-06 | RatingController/AdminRatingController, ConsultationService/ModerationService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Feedback/moderation đã được bao phủ bởi admin moderation; không cần diagram riêng. |
| 8. View Dashboard | admin-sequences.md | Administrator | UC-A-07, UC-A-08 | ReportingController, ReportingService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Chủ yếu là read/query Controller -> Service -> Prisma -> response; giá trị kỹ thuật thấp hoặc trùng pattern. |
| 9. Filter/View Consultation Reporting | admin-sequences.md | Administrator | UC-A-07, UC-A-08 | ReportingController, ReportingService, Prisma | Có, kiểm tra ở mức tài liệu/source chính | Không | Chủ yếu là read/query Controller -> Service -> Prisma -> response; giá trị kỹ thuật thấp hoặc trùng pattern. |
| 1. Appointment Created Notification | notification-sequences.md | System/Notification | UC-P-08, UC-P-15, UC-E-01 | AppointmentService, OutboxEvent, NotificationScheduler, NotificationService, NotificationLog, Provider | Có | Có | Đại diện async outbox: transaction nghiệp vụ tách khỏi scheduler/provider delivery. |
| 2. Appointment Confirmed Notification | notification-sequences.md | System/Notification | UC-D-06, UC-P-15, UC-E-01 | AppointmentService, OutboxEvent, NotificationScheduler, NotificationService, NotificationLog, Provider | Có, kiểm tra ở mức tài liệu/source chính | Không | Đúng implementation nhưng trùng pattern outbox/provider với appointment-created; không cần hai notification diagrams gần giống nhau. |
| 3. Appointment Reminder | notification-sequences.md | System/Notification | UC-P-15, UC-E-01, UC-E-02 | NotificationScheduler, NotificationService, Appointment query, NotificationLog, Provider | Có, kiểm tra ở mức tài liệu/source chính | Không | Reminder là scheduled scan trực tiếp, hữu ích về implementation nhưng kém đại diện hơn outbox flow được chọn. |
| 4. Health Question Answered Notification | notification-sequences.md | System/Notification | UC-D-04, UC-P-11, UC-P-15 | NotificationScheduler, NotificationService, OutboxEvent, NotificationLog, Provider | Có, kiểm tra ở mức tài liệu/source chính | Không | Question flow đúng nhưng bị ưu tiên thấp hơn booking, realtime và notification; có thể mô tả bằng text. |
| 5. Password Reset Email | notification-sequences.md | System/Notification | Authentication recovery requirement | NotificationScheduler, NotificationService, OutboxEvent, NotificationLog, Provider | Có, kiểm tra ở mức tài liệu/source chính | Không | Notification variant đúng implementation nhưng trùng pattern outbox/provider hoặc là direct/reminder special case; chọn appointment-created làm đại diện. |

## Recommended Sequence Diagrams for Report

### 1. Hình X. Biểu đồ tuần tự đăng nhập người dùng

Source:
- `docs/diagrams/sequences/patient-sequences.md`
- Section: `2. Login`
- Export: `docs/report/diagram-selection/sequences/sequence-login.md`

Use Case:
- UC-P-02; đồng thời đại diện cho UC-D-01 và UC-A-01

Report section:
- Chương 4 - Thiết kế xác thực và phân quyền

Why representative:
- Đại diện cho authentication/JWT/session: UI gọi AuthController, AuthService kiểm tra password, tạo UserSession, ghi audit và trả access token/refresh cookie.

### 2. Hình X. Biểu đồ tuần tự đặt lịch tư vấn

Source:
- `docs/diagrams/sequences/patient-sequences.md`
- Section: `6. Book Appointment`
- Export: `docs/report/diagram-selection/sequences/sequence-book-appointment.md`

Use Case:
- UC-P-08, UC-P-15

Report section:
- Chương 4 - Thiết kế phân hệ lịch hẹn

Why representative:
- Flow nghiệp vụ lõi nhất: kiểm tra patient/doctor/slot, transaction serializable, tạo Appointment, AuditLog và OutboxEvent.

### 3. Hình X. Biểu đồ tuần tự chat realtime trong phiên tư vấn

Source:
- `docs/diagrams/sequences/patient-sequences.md`
- Section: `10. Realtime Chat`
- Export: `docs/report/diagram-selection/sequences/sequence-consultation-chat.md`

Use Case:
- UC-P-10, UC-D-08

Report section:
- Chương 4 - Thiết kế phân hệ tư vấn realtime

Why representative:
- Đại diện cho pattern realtime khác REST: Socket.IO namespace `/consultations`, JWT handshake, Gateway gọi ConsultationService, lưu message và broadcast cho client còn lại.

### 4. Hình X. Biểu đồ tuần tự tạo đơn thuốc sau tư vấn

Source:
- `docs/diagrams/sequences/doctor-sequences.md`
- Section: `13. Create Prescription`
- Export: `docs/report/diagram-selection/sequences/sequence-create-prescription.md`

Use Case:
- UC-D-10, UC-P-13

Report section:
- Chương 4 - Thiết kế phân hệ kết quả tư vấn và đơn thuốc

Why representative:
- Đại diện clinical output sau consultation: bác sĩ tạo/cập nhật prescription, service enforce appointment completed và ghi prescription/items trong transaction.

### 5. Hình X. Biểu đồ tuần tự kiểm duyệt câu hỏi và phản hồi

Source:
- `docs/diagrams/sequences/admin-sequences.md`
- Section: `6. Moderate Health Question/Response`
- Export: `docs/report/diagram-selection/sequences/sequence-admin-moderation.md`

Use Case:
- UC-A-06

Report section:
- Chương 4 - Thiết kế phân hệ quản trị và kiểm duyệt

Why representative:
- Đại diện admin/RBAC + moderation: queue tổng hợp question/answer, admin action cập nhật status/isApproved và ghi AuditLog.

### 6. Hình X. Biểu đồ tuần tự xử lý thông báo bất đồng bộ qua outbox

Source:
- `docs/diagrams/sequences/notification-sequences.md`
- Section: `1. Appointment Created Notification`
- Export: `docs/report/diagram-selection/sequences/sequence-notification-outbox.md`

Use Case:
- UC-P-08, UC-P-15, UC-E-01

Report section:
- Chương 4 - Thiết kế phân hệ thông báo

Why representative:
- Đại diện kiến trúc async: transaction nghiệp vụ tạo OutboxEvent, scheduler xử lý batch, NotificationService ghi NotificationLog và gọi provider boundary.

## Export Preparation

Các file export giữ nguyên Mermaid source block từ sequence source tương ứng, không generate image:

- `docs/report/diagram-selection/sequences/sequence-login.md`
- `docs/report/diagram-selection/sequences/sequence-book-appointment.md`
- `docs/report/diagram-selection/sequences/sequence-consultation-chat.md`
- `docs/report/diagram-selection/sequences/sequence-create-prescription.md`
- `docs/report/diagram-selection/sequences/sequence-admin-moderation.md`
- `docs/report/diagram-selection/sequences/sequence-notification-outbox.md`

## Final Recommendation

```text
Existing sequence diagrams reviewed: 48

Recommended for final report: 6

Recommended sequence set:
1. Hình X. Biểu đồ tuần tự đăng nhập người dùng
2. Hình X. Biểu đồ tuần tự đặt lịch tư vấn
3. Hình X. Biểu đồ tuần tự chat realtime trong phiên tư vấn
4. Hình X. Biểu đồ tuần tự tạo đơn thuốc sau tư vấn
5. Hình X. Biểu đồ tuần tự kiểm duyệt câu hỏi và phản hồi
6. Hình X. Biểu đồ tuần tự xử lý thông báo bất đồng bộ qua outbox

Excluded categories:
- simple CRUD flows
- duplicate request/service/database patterns
- public Guest GET flows with low technical value
- actor-specific login duplicates
- implementation-detail-only query/list sequences
```
