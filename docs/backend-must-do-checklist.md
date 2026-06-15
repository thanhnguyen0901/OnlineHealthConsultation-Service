# Backend Must Do Checklist for Final MVP

## 1. Mục tiêu

Mục tiêu của checklist này là chỉ bổ sung các endpoint và rule tối thiểu để frontend hoàn chỉnh, demo được, chụp hình báo cáo được và viết Playwright E2E test được. Phạm vi ưu tiên là các luồng chính: public discovery, patient/doctor appointment detail, consultation result, prescription, doctor approval, rating history và admin doctor list.

Không mở rộng sang các phần future enhancement như gửi email/SMS thật, video call thật, file upload, rate limiting, audit UI nâng cao, hoặc pagination toàn bộ hệ thống nếu không phục vụ trực tiếp cho màn hình FE cuối kỳ.

## 2. Danh sách endpoint/chức năng cần làm ngay

| ID | Chức năng | Endpoint đề xuất | Module liên quan | Status hiện tại | Cần implement gì | Quyền truy cập | FE screen sử dụng | Test case liên quan | Priority | Có thể mock tạm không | Ghi chú rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|---|
| BE-MVP-01 | Xem chi tiết appointment theo id | `GET /appointments/:id` | `appointment` | Implemented and build verified with `npm run build`. | Đã thêm `getAppointmentDetail(userId, role, appointmentId)` và controller endpoint. Response include patient/doctor basic info, `session`, `rating`; user fields dùng `select` an toàn. | `PATIENT` chỉ xem appointment của mình, `DOCTOR` chỉ xem appointment của mình, `ADMIN` xem được tất cả. | Patient appointment detail, Doctor appointment detail, Admin appointment detail/modal. | 401 without token; 403 patient xem appointment người khác; 403 doctor xem appointment ngoài scope; admin xem được; response không có `passwordHash`. | P0 | Không nên mock. FE detail và E2E ownership cần backend thật. | Route tĩnh `mine`, `doctor/me` vẫn đứng trước route động `:id`. |
| BE-MVP-02 | Patient/Doctor xem kết quả consultation và prescription theo appointment | `GET /consultations/:appointmentId/result` | `consultation`, `appointment` | Implemented and build verified with `npm run build`. | Đã thêm service method lấy appointment + session + summary + prescription + items + basic patient/doctor info. Trả `prescription: null` nếu chưa có. | `PATIENT` chỉ xem result thuộc appointment của mình, `DOCTOR` chỉ xem appointment mình phụ trách, `ADMIN` xem được. | Consultation result page, Prescription page, Appointment detail outcome panel. | Patient xem result của mình thành công; patient khác bị 403; doctor phụ trách xem được; doctor khác bị 403; chưa có prescription vẫn 200 với `prescription: null`. | P0 | Không cần mock cho final demo/E2E. | Endpoint dùng `appointmentId`, không dùng `consultationSession.id`. Không áp dụng time-window join rule cho result/history. |
| BE-MVP-03 | Doctor/Patient appointment detail đủ data cho FE | Covered by `GET /appointments/:id` | `appointment` | Implemented via BE-MVP-01. | Không tạo duplicate endpoint. Detail endpoint include `session.summary` và dữ liệu lịch hẹn chính. | `PATIENT`, `DOCTOR`, `ADMIN` theo ownership ở BE-MVP-01. | Appointment detail, CTA join/start consultation, status badge. | FE mở detail từ list và render đầy đủ doctor/patient info, schedule, reason, notes, status. | P0 | Không cần mock nếu đã làm BE-MVP-01. | Không include patient medical history trong appointment detail. |
| BE-MVP-04 | Public doctor detail có rating summary | `GET /public/doctors/:doctorId` | `discovery`, `consultation/rating` | Implemented and build verified with `npm run build`. Public doctor detail and list now include `avgRating`, `ratingCount`. | Đã thêm rating aggregate từ `Rating` với `status = VISIBLE`. | Public, không cần login. Chỉ doctor `APPROVED`, `isActive`, user active, `deletedAt = null`. | Doctor public detail, doctor card/list rating badge. | Doctor có 2 visible rating và 1 hidden rating thì avg/count chỉ tính visible; doctor không rating trả `avgRating: null`, `ratingCount: 0`. | P0 | Không cần mock rating badge. | `avgRating` hiện là raw average number hoặc `null`; FE có thể format 1 chữ số nếu muốn. |
| BE-MVP-05 | Admin xem danh sách bác sĩ | `GET /admin/doctors?approvalStatus=&isActive=&keyword=` | `doctor`, `identity` | Implemented and build verified with `npm run build`. | Đã thêm `AdminListDoctorsQueryDto` và `listDoctorsForAdmin`. Include user basic info, doctor profile, specialties, filters `approvalStatus`, doctorProfile `isActive`, `keyword`, `page`, `limit`. | `ADMIN` only. | Admin doctor approval/list screen. | Admin list trả doctor pending/approved; filter approvalStatus hoạt động; non-admin bị 403; không expose `passwordHash`. | P1 | Không cần dùng `GET /admin/users?role=DOCTOR` tạm nữa. | `isActive` filter được định nghĩa là `doctorProfile.isActive`; `user.isActive` vẫn được trả trong user basic info. |
| BE-MVP-06 | Admin doctor approval action | `PATCH /admin/doctors/:doctorId/approval` | `doctor` | Verified existing. Endpoint/service đã có và vẫn giữ nguyên. | Không cần endpoint mới. FE payload dùng `approvalStatus`, optional `isActive`. | `ADMIN` only. | Admin doctor approval/list screen. | Approve set `APPROVED` và `isActive=true`; reject set `REJECTED`; non-admin 403. | P1 | Không cần mock, backend đã có. | Nếu reject không set `isActive=false`, public discovery vẫn chặn do `approvalStatus`, nhưng admin UI nên hiển thị rõ. |
| BE-MVP-07 | Basic filters cho appointment list | `GET /appointments/mine?status=&fromDate=&toDate=`; `GET /appointments/doctor/me?status=&fromDate=&toDate=`; optional `GET /admin/appointments?...` | `appointment` | Implemented and build verified with `npm run build`. | Đã thêm `ListAppointmentQueryDto` và apply filter giữ response shape hiện tại. | Patient own list, Doctor own list, Admin all appointments. | Patient appointments, Doctor schedule/dashboard, Admin appointment list. | Filter status chỉ trả đúng status; date range đúng; role-specific list không leak data. | P1 | Không cần client-side filter cho MVP. | Date filter dùng `scheduledAt >= fromDate`, `scheduledAt <= toDate`. |
| BE-MVP-08 | Patient xem ratings/history của mình | `GET /ratings/mine` | `consultation/rating` | Verified existing. Endpoint đã có trước đó và không cần đổi cho MVP. | Không cần implement mới. | `PATIENT` only. | Patient rating history, profile activity. | Patient thấy rating của mình; patient khác không thấy; response có doctor basic info. | P2 | Có thể mock nếu không có màn hình riêng. | Hiện response include doctor user nhưng chưa include appointment detail; đủ cho MVP nếu chỉ cần rating history cơ bản. |
| BE-MVP-09 | Doctor xem ratings của mình | `GET /ratings/doctor/me` | `consultation/rating`, `doctor` | Implemented and build verified with `npm run build`. | Đã thêm endpoint list rating `VISIBLE` cho doctor hiện tại, include appointment basic info và patient basic name. | `DOCTOR` only. | Doctor rating/review dashboard. | Doctor chỉ thấy rating của mình; doctor khác không thấy; hidden rating không trả về. | P2 | Không cần mock nếu FE có screen feedback. | MVP chỉ trả `VISIBLE` để nhất quán với public rating summary. |
| BE-MVP-10 | Soft-delete filter consistency cho query FE chính | Không cần endpoint mới | `discovery`, `doctor`, `appointment`, `consultation`, `identity` | Implemented with notes. Public discovery keeps `user.deletedAt = null`; appointment/history detail preserves historical data by ownership. | Đã rà soát theo hướng không làm mất appointment/consultation history; public-facing query vẫn filter inactive/deleted doctor user. | Theo endpoint hiện có. | Tất cả screen chính khi admin deactivate user. | Deactivated doctor không xuất hiện public; appointment cũ vẫn xem được bởi admin; patient/doctor không leak deleted user ngoài ownership. | P2 | Có thể để sau nếu demo data sạch. | Không áp filter deleted user quá mạnh vào appointment/consultation history để tránh mất dữ liệu lịch sử. |

## 3. Những phần không làm bây giờ

| Future Enhancement | Vì sao để sau | Hiện tại demo xử lý thế nào | Ghi vào phần nào của báo cáo Chương IV |
|---|---|---|---|
| Email verification | Không cần cho luồng đăng ký/demo chính, tăng thời gian test token/email. | Tài khoản sau register dùng được ngay; admin có thể quản lý active/inactive. | Hạn chế và hướng phát triển: xác thực email trước khi dùng tài khoản. |
| Send email thật | Cần SMTP/SendGrid, env secret, xử lý deliverability. | Dùng `NotificationLog`/outbox/in-app style để chứng minh nghiệp vụ thông báo. | Hạ tầng thông báo hiện tại là mô phỏng, hướng phát triển tích hợp provider thật. |
| SMS thật | Cần provider, chi phí, số điện thoại thật, retry/error mapping. | Không gửi SMS thật; notification log ghi nhận nội dung. | Hướng phát triển đa kênh SMS/Zalo/OTT. |
| Video call thật | WebRTC/Jitsi/Agora tốn setup, permission browser, network và test phức tạp. | Consultation dùng chat WebSocket/persisted message; VIDEO request fallback về CHAT nếu provider chưa bật. | Hạn chế phiên tư vấn: demo chat realtime, video là hướng mở rộng. |
| File upload | Cần storage, mime validation, virus scan/size policy. | Không upload ảnh/tài liệu; prescription và summary nhập text. | Hướng phát triển lưu trữ hồ sơ/tài liệu y tế an toàn. |
| Rate limiting | Không phải blocker cho demo FE/E2E, cần config global/proxy. | Dùng auth guard, role guard, validation DTO. | Hạn chế bảo mật vận hành và đề xuất hardening production. |
| Full audit log endpoint/UI | Audit log đã ghi ở nhiều action nhưng UI nâng cao không cần cho MVP. | Chỉ dùng audit log nội bộ/database khi cần minh chứng. | Hướng phát triển quản trị và truy vết nâng cao. |
| Full pagination | Không cần trên mọi endpoint cho dataset demo nhỏ. | Chỉ giữ pagination nơi đã có hoặc nơi FE thật sự cần như public doctors/admin doctors. | Hạn chế hiệu năng với dữ liệu lớn, hướng phát triển pagination đồng nhất. |
| NO_SHOW workflow | Không phải luồng demo cốt lõi, cần rule thời gian và actor rõ. | Admin có thể cập nhật status appointment nếu cần minh họa. | Hướng phát triển lifecycle lịch hẹn đầy đủ. |
| Doctor cancel appointment | Cần notification/rule hoàn tiền/lý do hủy, không bắt buộc final MVP. | Patient cancel và admin update status đã đủ demo cơ bản. | Hướng phát triển quyền xử lý lịch hẹn của bác sĩ. |
| Patient close question | Không ảnh hưởng luồng appointment/consultation chính. | Admin moderation có thể close/reopen; patient list question vẫn xem được. | Hướng phát triển self-service quản lý câu hỏi. |
| Password change | Forgot/reset password đã có; change password trong profile không bắt buộc demo. | Demo dùng login/register/reset nếu cần. | Hướng phát triển bảo mật tài khoản cá nhân. |
| Notification provider/retry nâng cao | Outbox cơ bản đã có; retry/provider thật phức tạp hơn nhu cầu demo. | Admin có endpoint process outbox/reminder; log provider `IN_APP`/mock. | Hướng phát triển reliability của hệ thống thông báo. |

## 4. Implementation Plan

1. Add/adjust DTO
   - `GetAppointmentDetail` không cần body, nhưng cần `ListAppointmentQueryDto` cho filter list.
   - `AdminListDoctorsQueryDto` cho `approvalStatus`, `isActive`, `keyword`, optional `page`, `limit`.

2. Add service method
   - `AppointmentService.getAppointmentDetail(userId, role, appointmentId)`.
   - `AppointmentService.listMyAppointments(userId, query)`, `listDoctorAppointments(userId, query)`, `listAllAppointments(query)`.
   - `ConsultationService.getConsultationResult(userId, role, appointmentId)`.
   - `DiscoveryService.getPublicDoctorById` bổ sung rating aggregate.
   - `DoctorService.listDoctorsForAdmin(query)`.

3. Add controller endpoint
   - `GET /appointments/:id`.
   - `GET /consultations/:appointmentId/result`.
   - `GET /admin/doctors`.
   - Giữ `PATCH /admin/doctors/:doctorId/approval` hiện tại.

4. Apply guards/roles/ownership
   - Dùng `JwtAuthGuard` + `RolesGuard`.
   - Detail/result cho `PATIENT`, `DOCTOR`, `ADMIN`.
   - Admin doctors chỉ `ADMIN`.
   - Ownership kiểm tra trong service theo `patientProfile.userId` hoặc `doctorProfile.userId`.

5. Hide sensitive fields
   - Không include `passwordHash`, refresh token, session token.
   - Public doctor không trả email/phone/private medical info.
   - Appointment detail chỉ trả patient/doctor basic info cần cho UI.

6. Add Swagger decorator nếu project đang dùng
   - Project đã dùng `@ApiTags`, `@ApiBearerAuth`, `@ApiOperation`.
   - Thêm summary rõ cho endpoint mới và DTO query.

7. Build
   - Chạy `npm run build`.
   - Nếu có type issue từ Prisma include/select thì sửa ngay.

8. Manual API check
   - Login patient, doctor, admin.
   - Gọi appointment detail đúng owner và sai owner.
   - Gọi consultation result trước/sau khi có prescription.
   - Gọi public doctor detail có rating visible/hidden.
   - Gọi admin doctors với filter.

9. Update docs
   - Cập nhật API contract hoặc README nếu project đang dùng làm tài liệu báo cáo.
   - Ghi route mới vào checklist/test traceability nếu có.

## 5. Acceptance Criteria

- Build pass bằng `npm run build`.
- Endpoint trả đúng data theo role và ownership.
- Không expose `passwordHash`, refresh token, access token, hoặc session secret trong response.
- Request không có token bị `401`.
- User có role sai bị `403`.
- Patient không xem được appointment/result/prescription của patient khác.
- Doctor không xem được appointment/result/prescription ngoài phạm vi mình phụ trách.
- Admin truy cập được admin endpoint và xem được dữ liệu cần cho màn quản trị.
- `GET /appointments/:id` đủ data cho FE appointment detail: basic patient/doctor info, `scheduledAt`, `durationMinutes`, `status`, `reason`, `notes`.
- Consultation result endpoint trả được `summary`, `prescription`, `prescription.items`, và xử lý được trường hợp chưa có prescription.
- Public doctor detail trả `avgRating` và `ratingCount`, chỉ tính rating `VISIBLE`.
- FE có thể gọi endpoint từ các screen chính mà không cần mock dữ liệu cốt lõi.
