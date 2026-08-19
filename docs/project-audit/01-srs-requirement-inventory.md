# Inventory yêu cầu từ SRS

Nguồn SRS: `OnlineHealthConsultation-Service/docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`

Tài liệu này giữ nguyên các use-case ID có sẵn trong SRS. Với các functional requirement ở mục 5, tài liệu tạo ID ổn định như `AUTH-xx`, `APT-xx`, `CONS-xx`. Không bổ sung yêu cầu ngoài SRS.

## Actor

| Actor | Tóm tắt từ SRS |
| --- | --- |
| Guest User | Truy cập trang public, xem specialty, tìm/xem hồ sơ doctor public, được chuyển tới login/register khi dùng chức năng protected. |
| Patient | Register/login, quản lý health profile, gửi question, book/join consultation, xem response/history/prescription, rating. |
| Doctor | Login, quản lý professional profile, trả lời question, quản lý schedule/appointment, thực hiện consultation, ghi result/guidance. |
| Administrator | Quản lý user/doctor/patient/specialty/appointment, moderation nội dung consultation, xem dashboard/statistics. |
| External Services | Notification qua email/SMS, video communication, file storage. |

## Use Case

| ID | Actor | Mô tả |
| --- | --- | --- |
| UC-G-01 | Guest | Xem home page. |
| UC-G-02 | Guest | Xem danh sách specialty. |
| UC-G-03 | Guest | Tìm doctor theo specialty hoặc keyword. |
| UC-G-04 | Guest | Xem chi tiết public doctor profile. |
| UC-G-05 | Guest | Xem doctor nổi bật hoặc đang active. |
| UC-G-06 | Guest | Chuyển tới register/login khi muốn book appointment hoặc gửi question. |
| UC-P-01 | Patient | Register account. |
| UC-P-02 | Patient | Login. |
| UC-P-03 | Patient | Logout. |
| UC-P-04 | Patient | Quản lý health profile cá nhân. |
| UC-P-05 | Patient | Tìm doctor theo specialty. |
| UC-P-06 | Patient | Xem doctor detail. |
| UC-P-07 | Patient | Gửi health question. |
| UC-P-08 | Patient | Book consultation appointment. |
| UC-P-09 | Patient | Xem upcoming appointments. |
| UC-P-10 | Patient | Tham gia consultation session. |
| UC-P-11 | Patient | Xem response của doctor. |
| UC-P-12 | Patient | Xem consultation history. |
| UC-P-13 | Patient | Xem prescription và consultation summary. |
| UC-P-14 | Patient | Rating chất lượng consultation. |
| UC-P-15 | Patient | Nhận reminder và notification. |
| UC-D-01 | Doctor | Login. |
| UC-D-02 | Doctor | Quản lý doctor profile. |
| UC-D-03 | Doctor | Xem question được assign hoặc question mở. |
| UC-D-04 | Doctor | Trả lời question của patient. |
| UC-D-05 | Doctor | Quản lý consultation schedule. |
| UC-D-06 | Doctor | Xem booked appointments. |
| UC-D-07 | Doctor | Start consultation session. |
| UC-D-08 | Doctor | Consultation qua chat hoặc video. |
| UC-D-09 | Doctor | Ghi consultation result. |
| UC-D-10 | Doctor | Cấp e-prescription cơ bản. |
| UC-D-11 | Doctor | Xem consultation history của patient. |
| UC-A-01 | Admin | Login. |
| UC-A-02 | Admin | Quản lý doctor accounts. |
| UC-A-03 | Admin | Quản lý patient accounts. |
| UC-A-04 | Admin | Quản lý specialty. |
| UC-A-05 | Admin | Quản lý appointment. |
| UC-A-06 | Admin | Moderate consultation content và feedback. |
| UC-A-07 | Admin | Xem system dashboard. |
| UC-A-08 | Admin | Theo dõi active users và consultation counts. |
| UC-E-01 | External | Gửi email reminder. |
| UC-E-02 | External | Gửi SMS reminder. |
| UC-E-03 | External | Thiết lập video consultation session. |
| UC-E-04 | External | Store/retrieve uploaded files. |

## Functional Requirement

| ID | Domain | Yêu cầu |
| --- | --- | --- |
| GUEST-01 | Public Access | Guest User truy cập public pages không cần login. |
| GUEST-02 | Public Access | Guest User xem home, specialty list, public doctor list. |
| GUEST-03 | Public Access | Guest User tìm doctor theo specialty hoặc keyword. |
| GUEST-04 | Public Access | Guest User xem public doctor profile. |
| GUEST-05 | Public Access | Public area chỉ hiển thị doctor active và approved. |
| GUEST-06 | Public Access | Protected action của Guest redirect tới login/register. |
| AUTH-01 | Auth/RBAC | Patient register bằng email và password. |
| AUTH-02 | Auth/RBAC | Registered user login bằng credential hợp lệ. |
| AUTH-03 | Auth/RBAC | Authenticated user logout. |
| AUTH-04 | Auth/RBAC | RBAC hỗ trợ Guest, Patient, Doctor, Administrator. |
| AUTH-05 | Auth/RBAC | User chỉ truy cập function/data phù hợp role. |
| AUTH-06 | Auth/RBAC | Password recovery qua email verification hoặc cơ chế bảo mật tương đương. |
| PROF-01 | Profile | Patient tạo/cập nhật personal health profile. |
| PROF-02 | Profile | Patient profile có name, birth date, gender, contact, basic health info. |
| PROF-03 | Profile | Doctor tạo/cập nhật professional profile. |
| PROF-04 | Profile | Doctor profile có name, specialty, qualification summary, experience, consultation description, working schedule. |
| PROF-05 | Profile | Admin tạo/cập nhật/activate/deactivate/delete user account theo authorization rule. |
| SPEC-01 | Specialty | Admin tạo/cập nhật/deactivate specialty. |
| SPEC-02 | Specialty | Doctor có thể gắn với một hoặc nhiều specialty. |
| SPEC-03 | Specialty | Patient và Guest browse/filter doctor theo specialty. |
| DISC-01 | Doctor Discovery | Patient tìm doctor. |
| DISC-02 | Doctor Discovery | Guest tìm doctor. |
| DISC-03 | Doctor Discovery | Filter doctor theo specialty. |
| DISC-04 | Doctor Discovery | Doctor detail hiển thị specialty, experience summary, availability schedule. |
| DISC-05 | Doctor Discovery | Patient/Guest chỉ thấy doctor active và approved. |
| QNA-01 | Health Questions | Patient gửi health question. |
| QNA-02 | Health Questions | Question lưu với status `PENDING`, `ANSWERED`, hoặc `CLOSED`. |
| QNA-03 | Health Questions | Doctor xem assigned/open questions theo business rule. |
| QNA-04 | Health Questions | Doctor trả lời health question. |
| QNA-05 | Health Questions | System ghi nhận response time và responding doctor. |
| QNA-06 | Health Questions | Patient xem previous questions và responses. |
| QNA-07 | Health Questions | Admin review/moderate question và response content khi cần. |
| APT-01 | Appointment | Patient book consultation appointment với doctor. |
| APT-02 | Appointment | Patient chỉ book free time slot. |
| APT-03 | Appointment | System ngăn duplicate booking cùng doctor/cùng slot. |
| APT-04 | Appointment | Appointment lưu patient, doctor, date, time, purpose, status, created time. |
| APT-05 | Appointment | Appointment hỗ trợ `PENDING_CONFIRMATION`, `CONFIRMED`, `COMPLETED`, `CANCELLED`. |
| APT-06 | Appointment | Doctor xem upcoming và past appointments. |
| APT-07 | Appointment | Patient xem upcoming và past appointments. |
| APT-08 | Appointment | Cancel appointment theo business rule. |
| APT-09 | Appointment | Admin xem/quản lý tất cả appointments. |
| CONS-01 | Consultation | System khởi tạo consultation session cho valid appointment. |
| CONS-02 | Consultation | System hỗ trợ real-time chat cho consultation. |
| CONS-03 | Consultation | System có thể hỗ trợ video qua WebRTC hoặc mock/basic video trong MVP. |
| CONS-04 | Consultation | Consultation access giới hạn cho participating patient, responsible doctor, authorized admin. |
| CONS-05 | Consultation | System lưu consultation summary sau khi session kết thúc. |
| CONS-06 | Consultation | System fallback từ video sang chat nếu video không khả dụng. |
| PRES-01 | Result/Prescription | Doctor ghi consultation result và recommendations. |
| PRES-02 | Result/Prescription | Doctor tạo basic e-prescription cho completed consultation. |
| PRES-03 | Result/Prescription | Prescription có medication name, dosage, frequency, duration, notes. |
| PRES-04 | Result/Prescription | Patient chỉ xem own consultation result và prescription. |
| PRES-05 | Result/Prescription | System duy trì consultation history để truy xuất sau này. |
| RATE-01 | Rating | Patient rating sau completed consultation. |
| RATE-02 | Rating | Patient gửi text comment kèm rating. |
| RATE-03 | Rating | System ngăn rating cho incomplete appointment. |
| RATE-04 | Rating | Admin review/moderate rating và comment khi cần. |
| NOTI-01 | Notification | System gửi confirmation notification khi appointment created hoặc confirmed. |
| NOTI-02 | Notification | System gửi reminder trước appointment time. |
| NOTI-03 | Notification | System notify patient khi doctor trả lời question. |
| NOTI-04 | Notification | System hỗ trợ email notification. |
| NOTI-05 | Notification | System có thể hỗ trợ SMS reminder nếu tích hợp external service. |
| NOTI-06 | Notification | System ghi send history và status khi có thể. |
| ADM-01 | Admin | Admin quản lý doctor và patient accounts. |
| ADM-02 | Admin | Admin quản lý specialty. |
| ADM-03 | Admin | Admin quản lý và monitor appointment. |
| ADM-04 | Admin | Admin moderate consultation-related content. |
| ADM-05 | Admin | System cung cấp dashboard activity metrics. |
| ADM-06 | Admin | Dashboard có total consultations, active users, consultation counts over time. |
| RPT-01 | Reporting | System cung cấp consultation activity statistics over time. |
| RPT-02 | Reporting | System hiển thị consultation trend dạng chart/graph. |
| RPT-03 | Reporting | Admin filter statistics theo date range nếu được hỗ trợ. |
| RPT-04 | Reporting | System có thể cung cấp statistics theo doctor, specialty, appointment status nếu thuộc MVP. |
| EXT-01 | Extended MVP | Optional simulated chatbot. |
| EXT-02 | Extended MVP | Optional multilingual UI. |
| EXT-03 | Extended MVP | Optional dark mode. |
| EXT-04 | Extended MVP | Optional SMS reminders. |
| EXT-05 | Extended MVP | Optional advanced video consultation. |
| EXT-06 | Extended MVP | Optional advanced analytics charts/filters. |

## Nhóm Non-Functional Requirement

| ID | Nhóm | Tóm tắt |
| --- | --- | --- |
| NFR-SEC | Security | HTTPS khi deploy, secure password hashing, auth cho protected resources, RBAC, server-side validation, bảo vệ trước web vulnerabilities, protected health data access, audit logging. |
| NFR-PRIV | Privacy | Bảo vệ personal/health data, giảm hiển thị không cần thiết trong UI/logs, bảo mật consultation/prescription content, retention policy cho consultation/audit data. |
| NFR-PERF | Performance | API response trong mức chấp nhận được; common operations dưới 3 giây cho 95% request trong normal MVP load; dashboard load time chấp nhận được. |
| NFR-SCALE | Scalability | Tách module rõ ràng, stateless service direction, notification/video provider có thể thay thế. |
| NFR-REL | Reliability | Safe error handling, consistent error response, appointment data consistency, video-to-chat fallback. |
| NFR-UX | Usability | Responsive UI, core task flow rõ ràng, success/failure/loading/validation feedback rõ, navigation/layout nhất quán. |
| NFR-MAINT | Maintainability | Modular codebase, business rules tách khỏi presentation, API docs nhất quán, env config dễ bảo trì, logging/monitoring hooks. |
| NFR-COMPAT | Compatibility | Hỗ trợ modern browsers, responsive sizes, externalized text resources nếu có localization. |
