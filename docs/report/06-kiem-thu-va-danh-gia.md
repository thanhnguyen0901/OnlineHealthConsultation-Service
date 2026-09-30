# CHƯƠNG 6. KIỂM THỬ VÀ ĐÁNH GIÁ

Chương này trình bày hoạt động kiểm thử và đánh giá hệ thống dựa trên bằng chứng thực tế của dự án: mã nguồn test, kết quả chạy test tự động, kết quả build/type-check, ma trận E2E, audit truy vết SRS và các workflow CI có trong repository. Các kết quả chỉ được ghi nhận là đạt khi có bằng chứng cụ thể; các nội dung chưa có kiểm thử tự động hoặc chưa có kết quả chạy được nêu rõ là chưa xác minh đầy đủ.

## 6.1 Mục tiêu kiểm thử

Mục tiêu kiểm thử của hệ thống gồm:

- Xác minh các luồng nghiệp vụ chính: khám phá bác sĩ, xác thực, đặt lịch, hỏi đáp sức khỏe, tư vấn trực tuyến, kết quả tư vấn, đơn thuốc, đánh giá, quản trị và báo cáo.
- Kiểm tra các quy tắc bảo mật quan trọng: xác thực JWT, refresh token, phân quyền theo vai trò, kiểm tra quyền sở hữu dữ liệu và che giấu thông tin nhạy cảm.
- Kiểm tra tính đúng đắn của các quy tắc đặt lịch: lịch làm việc của bác sĩ, khung giờ khả dụng, chống trùng lịch của bác sĩ và bệnh nhân.
- Kiểm tra các thành phần nền như thông báo, outbox, nhắc lịch và xử lý lỗi provider.
- Đối chiếu mức độ đáp ứng yêu cầu SRS bằng ma trận truy vết và ma trận E2E.

## 6.2 Môi trường kiểm thử

Theo tài liệu `docs/testing/final-e2e-results.md`, môi trường E2E cuối cùng được ghi nhận ngày 2026-08-20 gồm:

- Backend: `OnlineHealthConsultation-Service`
- Frontend: `OnlineHealthConsultation-Web`
- Database: Docker PostgreSQL container `health_consultation_db`
- Backend URL: `http://localhost:4000/api`
- Frontend URL: `http://localhost:5173`
- Browser runner: Playwright Chromium
- Seed mode: `E2E_RUN_SEEDED=true`

Trong lần kiểm tra bổ sung ngày 2026-08-22, các lệnh kiểm thử và build được chạy trong môi trường local sau khi nạp Node qua `nvm`. Lệnh `npm` không có sẵn trực tiếp trong shell ban đầu, nhưng chạy được sau khi thực hiện `source ~/.nvm/nvm.sh`.

## 6.3 Phương pháp kiểm thử

Hệ thống sử dụng kết hợp các phương pháp sau:

- **Unit test và service-level test:** kiểm tra logic trong các service/controller backend bằng Jest, chủ yếu với mock Prisma hoặc mock dependency.
- **Integration-oriented test ở tầng service:** kiểm tra luồng nhiều thao tác liên quan trong một service, ví dụ transaction đặt lịch, refresh session rotation, notification outbox và moderation audit.
- **End-to-End test:** sử dụng Playwright để kiểm tra các luồng người dùng chính trên giao diện web và API backend đang chạy thật trong môi trường local có seed data.
- **Build và type-check:** sử dụng TypeScript compiler, Nest build và Vite build để xác minh mã nguồn có thể biên dịch.
- **Traceability audit:** đối chiếu yêu cầu SRS với hiện trạng implementation và automation trong `docs/audit/final-srs-traceability.md` và `docs/testing/e2e-test-matrix.md`.

## 6.4 Unit/Integration/E2E approach actually used

Backend có các test Jest trong các file:

- `src/modules/appointment/appointment.service.spec.ts`
- `src/modules/identity/auth.service.spec.ts`
- `src/modules/identity/auth.controller.spec.ts`
- `src/modules/notification/notification.service.spec.ts`
- `src/modules/moderation/moderation.service.spec.ts`
- `src/modules/reporting/reporting.service.spec.ts`
- `src/modules/doctor/doctor.service.spec.ts`
- `src/common/config/validate-env.spec.ts`
- `src/common/filters/http-exception.filter.spec.ts`

Frontend có các Playwright specs trong `OnlineHealthConsultation-Web/e2e/specs`, gồm public discovery, auth, patient appointment, patient question, doctor workflow, admin, consultation socket client và graduation flows.

CI workflow có trong repository:

- Backend CI: `.github/workflows/be-ci.yml`, chạy `npm ci`, `npm run prisma:generate`, `npm run test`, `npm run build`.
- Frontend CI: `.github/workflows/fe-ci.yml`, chạy format check, lint, type-check và build.

Không tìm thấy artifact kết quả chạy CI trong repository, vì vậy chương này chỉ ghi nhận sự tồn tại của cấu hình CI, không khẳng định CI đã pass.

## 6.5 Bộ test case tiêu biểu

| ID | Scenario | Expected | Actual | Result |
| -- | -------- | -------- | ------ | ------ |
| TC-AUTH-01 | Đăng nhập và lưu refresh token bằng HttpOnly cookie | Response không trả refresh token trong body; cookie refresh được set | `auth.controller.spec.ts` pass trong bộ Jest ngày 2026-08-22 | PASS |
| TC-AUTH-02 | Refresh token hợp lệ | Tạo access token mới, rotate refresh session | `auth.service.spec.ts` pass trong bộ Jest ngày 2026-08-22 | PASS |
| TC-APPT-01 | Lấy slot khả dụng từ lịch làm việc bác sĩ | Chỉ trả slot hợp lệ, trong tương lai | `appointment.service.spec.ts` pass trong bộ Jest ngày 2026-08-22 | PASS |
| TC-APPT-02 | Đặt lịch trùng bác sĩ hoặc bệnh nhân | Backend từ chối lịch bị overlap | `appointment.service.spec.ts` pass trong bộ Jest ngày 2026-08-22 | PASS |
| TC-NOTI-01 | Xử lý outbox appointment-created | Tạo notification cho bệnh nhân và bác sĩ | `notification.service.spec.ts` pass trong bộ Jest ngày 2026-08-22 | PASS |
| TC-NOTI-02 | Provider gửi thông báo thất bại | Outbox được đánh dấu failed và retryable | `notification.service.spec.ts` pass; log lỗi `Email failed` xuất hiện trong test failure-path | PASS |
| TC-MOD-01 | Admin ẩn câu hỏi và ghi audit | Trạng thái nội dung đổi và audit log được tạo | `moderation.service.spec.ts` pass trong bộ Jest ngày 2026-08-22 | PASS |
| TC-REPORT-01 | Dashboard metrics theo date range | Trả số liệu tổng hợp hợp lệ | `reporting.service.spec.ts` pass trong bộ Jest ngày 2026-08-22 | PASS |
| TC-E2E-CORE | Core smoke/auth/appointment/question/doctor/admin/socket suites | Các luồng core chạy trên browser seeded env | 42/43 passed, 0 failed, 1 skipped theo `final-e2e-results.md` | PARTIAL |
| TC-GRAD | Graduation flows | Toàn bộ luồng graduation pass | `GRAD-D` pass isolation; `GRAD-A/B/C` có lỗi test-data/test-interaction/assertion | NOT PASS |

## 6.6 Kiểm thử các user flow chính

Kết quả E2E lõi trong `docs/testing/final-e2e-results.md` ghi nhận lệnh Playwright chạy các suite:

- `public.spec.ts`
- `auth.spec.ts`
- `patient-appointments.spec.ts`
- `patient-questions.spec.ts`
- `doctor-workflow.spec.ts`
- `admin.spec.ts`
- `consultation-socket-client.spec.ts`

Kết quả ghi nhận:

| Nhóm flow | Bằng chứng | Kết quả |
| -- | -- | -- |
| Public discovery | `public.spec.ts`, E2E-001 đến E2E-005 | Nằm trong 42 test core đã pass |
| Auth theo vai trò | `auth.spec.ts`, E2E-006 đến E2E-012 và các test page auth | Nằm trong 42 test core đã pass |
| Patient appointment | `patient-appointments.spec.ts`, E2E-013 đến E2E-017 | Nằm trong 42 test core đã pass |
| Patient question và doctor answer | `patient-questions.spec.ts`, E2E-018 đến E2E-023 | Nằm trong 42 test core đã pass |
| Doctor consultation/prescription workflow | `doctor-workflow.spec.ts`, E2E-024 đến E2E-029 | Nằm trong 42 test core đã pass |
| Admin dashboard/doctor/specialty/access guard | `admin.spec.ts`, E2E-030 đến E2E-035 | Nằm trong 42 test core đã pass |
| Socket client behavior | `consultation-socket-client.spec.ts` | Nằm trong 42 test core đã pass |

Graduation suite trong `graduation-flows.spec.ts` chưa được tính là pass. Theo `final-e2e-results.md`, các lỗi được phân loại là lỗi test-data, test interaction hoặc mismatch assertion, không phải bằng chứng lỗi nghiệp vụ backend. Vì vậy chương này không dùng graduation suite để khẳng định hệ thống đã pass toàn bộ luồng graduation.

## 6.7 Kiểm thử authentication/RBAC

Authentication và RBAC được kiểm thử ở cả backend và frontend:

- `auth.service.spec.ts` kiểm tra refresh session rotation, reject token không hợp lệ, reject session đã thu hồi/hết hạn, logout revoke session, forgot password không leak trạng thái email, reset password tiêu thụ token và revoke session.
- `auth.controller.spec.ts` kiểm tra hợp đồng cookie refresh: set cookie HttpOnly khi login, đọc cookie khi refresh, clear cookie khi logout và secure cookie trong production.
- `auth.spec.ts` kiểm tra đăng nhập theo vai trò Patient/Doctor/Admin, guest bị chuyển về login khi mở route bảo vệ, patient/doctor không truy cập được route sai vai trò và logout.
- `admin.spec.ts` có test non-admin không truy cập được admin dashboard.

| ID | Scenario | Expected | Actual | Result |
| -- | -------- | -------- | ------ | ------ |
| AUTH-RBAC-01 | Patient login | Redirect về Patient dashboard | Core E2E ghi nhận pass trong `auth.spec.ts` | PASS |
| AUTH-RBAC-02 | Doctor login | Redirect về Doctor dashboard | Core E2E ghi nhận pass trong `auth.spec.ts` | PASS |
| AUTH-RBAC-03 | Admin login | Redirect về Admin dashboard | Core E2E ghi nhận pass trong `auth.spec.ts` | PASS |
| AUTH-RBAC-04 | Guest mở route patient protected | Redirect về login | Core E2E ghi nhận pass trong `auth.spec.ts` | PASS |
| AUTH-RBAC-05 | Patient/Doctor mở route sai vai trò | Bị chặn hoặc vào forbidden state | Core E2E ghi nhận pass trong `auth.spec.ts` | PASS |
| AUTH-RBAC-06 | Refresh token rotation | Session cũ bị revoke, session mới được tạo | Backend Jest pass ngày 2026-08-22 | PASS |

Các kiểm thử chưa đầy đủ: frontend chưa có bằng chứng E2E cho refresh-token retry/dedup khi nhiều request đồng thời nhận `401`; ma trận E2E đánh dấu nội dung này là `Missing`.

## 6.8 Kiểm thử appointment availability/conflict

Kiểm thử đặt lịch tập trung vào `appointment.service.spec.ts` và `patient-appointments.spec.ts`.

Các tình huống backend đã được Jest kiểm tra gồm:

- Trả slot khả dụng từ lịch làm việc bác sĩ.
- Loại bỏ slot overlap với lịch hẹn đang hoạt động của bác sĩ.
- Từ chối lookup nếu bác sĩ không public.
- Từ chối tạo lịch ngoài giờ làm việc.
- Từ chối tạo lịch khi bác sĩ có lịch overlap.
- Từ chối tạo lịch khi bệnh nhân có lịch overlap.
- Cho phép lịch sát ranh giới khi lịch cũ kết thúc đúng lúc lịch mới bắt đầu.
- Từ chối bác sĩ inactive hoặc chưa approved.
- Áp dụng quy tắc conflict khi reschedule.

| ID | Scenario | Expected | Actual | Result |
| -- | -------- | -------- | ------ | ------ |
| APPT-AV-01 | Doctor schedule có slot hợp lệ | API availability trả slot hợp lệ | Backend Jest pass ngày 2026-08-22 | PASS |
| APPT-AV-02 | Slot overlap lịch bác sĩ | Slot bị loại khỏi availability | Backend Jest pass ngày 2026-08-22 | PASS |
| APPT-AV-03 | Tạo lịch ngoài giờ làm việc | Backend reject | Backend Jest pass ngày 2026-08-22 | PASS |
| APPT-AV-04 | Tạo lịch trùng bác sĩ | Backend reject | Backend Jest pass ngày 2026-08-22 | PASS |
| APPT-AV-05 | Tạo lịch trùng bệnh nhân | Backend reject | Backend Jest pass ngày 2026-08-22 | PASS |
| APPT-AV-06 | Patient đặt lịch hợp lệ qua UI | Lịch được tạo và hiển thị trong danh sách | Core E2E ghi nhận pass trong `patient-appointments.spec.ts` | PASS |

Ma trận E2E vẫn đánh dấu UI negative case cho slot không khả dụng là `Partial`, vì phần backend đã được kiểm thử nhưng chưa có test giao diện đầy đủ cho thao tác chọn slot không hợp lệ.

## 6.9 Kiểm thử consultation realtime

Tư vấn trực tuyến được kiểm thử qua hai nhóm bằng chứng:

- `doctor-workflow.spec.ts` kiểm tra bác sĩ có thể mở route phiên tư vấn, lưu summary, tạo prescription và bệnh nhân xem kết quả/đơn thuốc khi có dữ liệu.
- `consultation-socket-client.spec.ts` kiểm tra client Socket.IO xác thực bằng access token, join room theo appointment, gửi message, reconnect vào cùng room, cleanup listener và xử lý thiếu access token.

| ID | Scenario | Expected | Actual | Result |
| -- | -------- | -------- | ------ | ------ |
| CONSULT-01 | Doctor mở phiên tư vấn từ appointment | Route/session được mở hợp lệ | Core E2E ghi nhận pass trong `doctor-workflow.spec.ts` | PASS |
| CONSULT-02 | Doctor lưu consultation summary | Summary được lưu và có thể xem lại | Core E2E ghi nhận pass trong `doctor-workflow.spec.ts` | PASS |
| CONSULT-03 | Doctor tạo prescription | Prescription được lưu | Core E2E ghi nhận pass trong `doctor-workflow.spec.ts` | PASS |
| CONSULT-04 | Patient xem result/prescription | Kết quả và đơn thuốc hiển thị cho bệnh nhân | Core E2E ghi nhận pass trong `doctor-workflow.spec.ts` | PASS |
| CONSULT-05 | Socket client join/send/reconnect | Client join đúng room, gửi message, reconnect không nhân listener | Core E2E ghi nhận pass trong `consultation-socket-client.spec.ts` | PASS |

Giới hạn hiện tại: chưa có bằng chứng E2E hai browser context đầy đủ cho bệnh nhân và bác sĩ trao đổi realtime trực tiếp trên hai giao diện đang mở cùng lúc. Ma trận E2E đánh dấu luồng này là `Partial`.

## 6.10 Kiểm thử notification/background processing

Notification được kiểm thử chủ yếu bằng backend Jest trong `notification.service.spec.ts`. Các tình huống đã có bằng chứng gồm:

- Lưu thông báo reset password bằng development provider khi chưa cấu hình email thật.
- Không lưu plain reset token trong production khi provider email không hoạt động.
- Xử lý outbox `APPOINTMENT_CREATED` thành thông báo cho bệnh nhân và bác sĩ.
- Đánh dấu outbox failed và retryable khi provider gửi thất bại.
- Gửi appointment reminder qua provider và ghi trạng thái notification.
- Xử lý outbox `QUESTION_ANSWERED` thành thông báo cho bệnh nhân.

| ID | Scenario | Expected | Actual | Result |
| -- | -------- | -------- | ------ | ------ |
| NOTI-01 | Appointment created outbox | Tạo notification cho patient và doctor | Backend Jest pass ngày 2026-08-22 | PASS |
| NOTI-02 | Provider delivery failure | Mark failed, tăng retry state | Backend Jest pass ngày 2026-08-22; log lỗi giả lập xuất hiện | PASS |
| NOTI-03 | Appointment reminder | Gửi/log reminder cho appointment sắp tới | Backend Jest pass ngày 2026-08-22 | PASS |
| NOTI-04 | Question answered outbox | Tạo notification cho patient | Backend Jest pass ngày 2026-08-22 | PASS |

Giới hạn hiện tại: chưa có bằng chứng gửi email production thật; final traceability đánh dấu email notification là `PARTIAL` vì provider abstraction có tồn tại nhưng phụ thuộc cấu hình provider thực tế.

## 6.11 Kết quả kiểm thử

Kết quả chạy bổ sung ngày 2026-08-22:

| Nhóm kiểm tra | Command | Actual | Result |
| -- | -- | -- | -- |
| Backend Jest | `source ~/.nvm/nvm.sh && npm test -- --runInBand` | 9 test suites passed, 47 tests passed, 0 failed | PASS |
| Backend type-check | `source ~/.nvm/nvm.sh && npm run type-check` | `tsc --noEmit` hoàn tất, exit code 0 | PASS |
| Backend build | `source ~/.nvm/nvm.sh && npm run build` | `nest build` hoàn tất, exit code 0 | PASS |
| Frontend type-check | `source ~/.nvm/nvm.sh && npm run type-check` | `tsc --noEmit` hoàn tất, exit code 0 | PASS |
| Frontend build | `source ~/.nvm/nvm.sh && npm run build` | `tsc -b && vite build` hoàn tất, exit code 0 | PASS |

Ghi chú từ output:

- Backend Jest có cảnh báo `ts-jest` về hybrid module kind và `isolatedModules`; cảnh báo này không làm test fail.
- Trong `notification.service.spec.ts` có log lỗi `Email failed` từ tình huống test provider failure; đây là hành vi được kiểm thử, không phải lỗi ngoài ý muốn.
- Frontend build có cảnh báo Browserslist data cũ và một số chunk lớn hơn 500 kB sau minification; build vẫn thành công.

Kết quả E2E đã ghi nhận trong `docs/testing/final-e2e-results.md`:

| Nhóm E2E | Actual | Result |
| -- | -- | -- |
| Core smoke/auth/appointment/question/doctor/admin/socket suites | Total 43, Passed 42, Failed 0, Skipped 1 | PARTIAL |
| Graduation suite dry run không có seed env | Total 4, Skipped 4 | NOT VERIFIED |
| Graduation suite với seed env | 1 failed, 1 flaky, 2 did not run; isolated `GRAD-D` passed | NOT PASS |

## 6.12 Độ bao phủ yêu cầu SRS

Theo `docs/audit/final-srs-traceability.md`, phần lớn core flows bắt buộc đã có implementation end-to-end, gồm public doctor discovery, auth, patient profile, health questions, doctor schedule availability, appointment booking/conflict prevention, consultation session, realtime chat, result/prescription, rating, admin management, moderation, notification outbox và reporting.

Tổng hợp theo nhóm:

| Nhóm yêu cầu | Trạng thái theo traceability | Bằng chứng kiểm thử liên quan |
| -- | -- | -- |
| Public access và doctor discovery | Chủ yếu `COMPLETED` | `public.spec.ts`; discovery implementation audit |
| Authentication/Authorization | `COMPLETED` | `auth.service.spec.ts`, `auth.controller.spec.ts`, `auth.spec.ts`, security audit |
| Patient/Doctor profile | `COMPLETED` hoặc `IMPLEMENTED_DIFFERENTLY` với cách lưu full name | Backend doctor tests; patient profile implementation có trong audit nhưng patient profile E2E còn missing |
| Health question | `COMPLETED` | `patient-questions.spec.ts`, notification/question audit |
| Appointment management | `COMPLETED` | `appointment.service.spec.ts`, `patient-appointments.spec.ts`, doctor workflow specs |
| Consultation realtime | `COMPLETED` về implementation; E2E automation `Partial` cho hai-browser realtime | `doctor-workflow.spec.ts`, `consultation-socket-client.spec.ts` |
| Result/prescription | `COMPLETED` | `doctor-workflow.spec.ts` |
| Rating | `COMPLETED` về implementation; rating positive/negative E2E còn missing trong matrix | Traceability, moderation tests |
| Notification/reminder | Core outbox/log/reminder `COMPLETED`; email thật `PARTIAL` | `notification.service.spec.ts`; no production email evidence |
| Admin/moderation/reporting | `COMPLETED` | `admin.spec.ts`, `moderation.service.spec.ts`, `reporting.service.spec.ts` |
| Non-functional performance/availability/browser matrix | Nhiều mục `PARTIAL` | Chưa có load test, HA test hoặc cross-browser result artifact |
| Optional/out-of-scope items | `NOT_APPLICABLE` hoặc `NOT_IMPLEMENTED` | File upload, chatbot, SMS/video advanced không thuộc scope bắt buộc hoặc chưa triển khai |

Các yêu cầu đã triển khai nhưng chưa có automated test đầy đủ theo `e2e-test-matrix.md` gồm: patient profile update E2E, inactive/unapproved doctor negative discovery, live consultation hai browser context, rating positive/negative E2E, admin moderation UI đầy đủ, reports page date-range/chart E2E, refresh-token retry/dedup frontend integration, cross-user consultation result access denial, mobile responsive smoke test.

## 6.13 Đánh giá hệ thống

Dựa trên các bằng chứng hiện có, hệ thống đạt mức sẵn sàng tốt cho các luồng nghiệp vụ cốt lõi:

- Backend unit/service tests hiện pass toàn bộ: 9 suites, 47 tests.
- Backend và frontend đều type-check/build thành công trong lần kiểm tra ngày 2026-08-22.
- Core E2E đã ghi nhận 42/43 test pass, không có test failed trong bộ core.
- Các quy tắc nghiệp vụ rủi ro cao như refresh-token rotation, cookie contract, appointment conflict, notification outbox retry, moderation audit và report date validation đã có test backend trực tiếp.
- Audit bảo mật ghi nhận các cơ chế quan trọng đã có: global validation, exception filter, security headers cơ bản, CORS theo môi trường, JWT secret validation, refresh cookie rules, RBAC, ownership checks, sensitive logging sanitation và appointment transaction safety.

Tuy nhiên, mức đánh giá này không đồng nghĩa với việc toàn bộ hệ thống đã được chứng minh bằng automation tuyệt đối. Một số yêu cầu đã có implementation nhưng test tự động còn một phần; một số yêu cầu phi chức năng chưa có artifact đo lường.

## 6.14 Hạn chế hiện tại

Các hạn chế hiện tại được ghi nhận từ bằng chứng thực tế:

- Graduation E2E suite chưa thể claim PASS. `GRAD-A`, `GRAD-B`, `GRAD-C` còn vấn đề test-data, test interaction hoặc assertion mismatch; chỉ `GRAD-D` pass khi chạy isolation.
- Core E2E có 1 test skipped; test này chưa được xem là PASS.
- Chưa có coverage percentage artifact, vì vậy báo cáo không công bố tỷ lệ coverage.
- Chưa có benchmark performance, load test hoặc concurrency test; các yêu cầu thời gian phản hồi, concurrent usage và dashboard performance chỉ ở mức `PARTIAL`.
- Chưa có bằng chứng kiểm thử cross-browser hoặc mobile responsive đầy đủ.
- Chưa có E2E hai trình duyệt cho realtime chat bệnh nhân-bác sĩ trong cùng phiên live.
- Chưa có bằng chứng gửi email production thật; notification provider thật phụ thuộc cấu hình triển khai.
- Chưa có kết quả CI run trong repository; chỉ có workflow CI configuration.
- File upload/storage, chatbot và advanced SMS/video không thuộc phạm vi bắt buộc hoặc chưa triển khai đầy đủ theo traceability.
