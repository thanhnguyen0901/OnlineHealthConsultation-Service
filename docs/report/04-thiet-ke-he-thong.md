# CHƯƠNG 4. THIẾT KẾ HỆ THỐNG

Chương này trình bày thiết kế của hệ thống đã được xây dựng cuối cùng. Nội dung tập trung vào kiến trúc tổng thể, các lớp chức năng chính, tổ chức dữ liệu, cơ chế xác thực - phân quyền và các luồng thiết kế đại diện. Những nội dung mang tính liệt kê chi tiết mã nguồn, trường dữ liệu hoặc từng API cụ thể không được trình bày trong chương này để tránh trùng lặp với phần xây dựng hệ thống.

## 4.1. Tổng quan kiến trúc hệ thống

Hệ thống được thiết kế dưới dạng ứng dụng web gồm ba lớp chính: Web Client, Application Layer và Data Layer. Người dùng truy cập hệ thống qua trình duyệt. Giao diện phía client là React SPA, chịu trách nhiệm hiển thị giao diện, điều hướng theo vai trò, gửi yêu cầu REST và kết nối realtime trong phiên tư vấn. Phía server là một ứng dụng NestJS theo kiến trúc Modular Monolith, cung cấp REST API, Socket.IO realtime entry, xử lý nghiệp vụ và giao tiếp với cơ sở dữ liệu PostgreSQL thông qua Prisma ORM.

[INSERT FIGURE: architecture-overview.png]

**Hình 4.1. Kiến trúc tổng thể của hệ thống**

Về giao tiếp, phần lớn chức năng nghiệp vụ như đăng nhập, quản lý hồ sơ, tìm bác sĩ, đặt lịch, hỏi đáp, quản trị và báo cáo sử dụng REST API. Riêng phiên tư vấn trực tuyến cần trao đổi hai chiều giữa bệnh nhân và bác sĩ nên sử dụng Socket.IO. Thiết kế này giúp hệ thống vừa giữ được luồng request-response rõ ràng cho dữ liệu nghiệp vụ, vừa hỗ trợ realtime chat cho phiên tư vấn.

Về triển khai, frontend có thể được đóng gói và triển khai như static React SPA; backend được triển khai như một ứng dụng NestJS duy nhất; cơ sở dữ liệu PostgreSQL là nơi lưu trữ dữ liệu nghiệp vụ. Các dịch vụ như email, SMS hoặc video được xem là ranh giới tích hợp bên ngoài. Trong hệ thống hiện tại, các phần này được thiết kế như provider boundary hoặc khả năng mở rộng, không phải các dịch vụ vendor production bắt buộc.

## 4.2. Lựa chọn kiến trúc Modular Monolith

Backend được thiết kế theo hướng Modular Monolith: toàn bộ nghiệp vụ chạy trong một ứng dụng NestJS duy nhất, nhưng được chia thành các module theo miền chức năng. Các module runtime chính gồm `IdentityModule`, `DiscoveryModule`, `PatientModule`, `DoctorModule`, `SpecialtyModule`, `AppointmentModule`, `QuestionModule`, `ConsultationModule`, `NotificationModule`, `ModerationModule`, `ReportingModule`, `OperationsModule` và `PrismaModule`.

Cách thiết kế này phù hợp với đề tài vì các phân hệ có quan hệ chặt chẽ với nhau. Ví dụ, lịch hẹn liên quan đến bệnh nhân, bác sĩ, phiên tư vấn và thông báo; phiên tư vấn liên quan đến kết quả, đơn thuốc và đánh giá; quản trị liên quan đến người dùng, bác sĩ, chuyên khoa và nội dung cần kiểm duyệt. Việc giữ các phân hệ trong cùng một ứng dụng giúp đơn giản hóa triển khai, kiểm thử và giao dịch dữ liệu, đồng thời vẫn giữ được ranh giới chức năng rõ ràng.

Ranh giới module được xác định theo trách nhiệm nghiệp vụ:

| Module | Vai trò thiết kế |
|---|---|
| Identity | Xác thực, phiên đăng nhập, khôi phục mật khẩu và quản lý người dùng. |
| Discovery | Cung cấp dữ liệu công khai như trang chủ, chuyên khoa và bác sĩ đã được duyệt. |
| Patient | Quản lý hồ sơ sức khỏe của bệnh nhân. |
| Doctor | Quản lý hồ sơ bác sĩ, lịch làm việc, chuyên khoa và thông tin chuyên môn. |
| Specialty | Quản lý chuyên khoa. |
| Appointment | Quản lý lịch khả dụng, đặt lịch, xác nhận, hủy, hoàn tất và đổi lịch hẹn. |
| Question | Quản lý câu hỏi sức khỏe và phản hồi của bác sĩ. |
| Consultation | Quản lý phiên tư vấn, chat realtime, tóm tắt, đơn thuốc và đánh giá. |
| Notification | Quản lý thông báo, outbox, lịch sử gửi và nhắc lịch. |
| Moderation | Kiểm duyệt câu hỏi, phản hồi và nội dung liên quan. |
| Reporting | Thống kê hoạt động và dashboard quản trị. |
| Operations | Health check và thông tin vận hành cơ bản. |
| Prisma | Cung cấp lớp truy cập dữ liệu dùng chung. |

Ưu điểm của lựa chọn này là cấu trúc rõ ràng, dễ phát triển trong phạm vi đồ án, thuận lợi khi cần dùng transaction chung trên cùng cơ sở dữ liệu và không phát sinh chi phí vận hành nhiều dịch vụ độc lập. Trade-off là khi hệ thống tăng quy mô lớn, một số phần như realtime, outbox processing hoặc reporting có thể cần chiến lược tách tải hoặc mở rộng riêng. Tuy nhiên, với phạm vi hiện tại, Modular Monolith đáp ứng tốt yêu cầu về tính hoàn chỉnh, dễ bảo trì và kiểm soát nghiệp vụ.

## 4.3. Thiết kế Web Client

Web Client được thiết kế là React Single Page Application. Ứng dụng chạy trên trình duyệt, sử dụng client-side routing để chuyển đổi giữa các vùng công khai, vùng bệnh nhân, vùng bác sĩ và vùng quản trị. Cấu trúc frontend được tổ chức theo feature để mỗi nhóm chức năng có màn hình, API client, state và kiểu dữ liệu riêng.

Các nhóm feature chính của Web Client gồm:

- `auth`: đăng nhập, đăng ký, quên mật khẩu, đặt lại mật khẩu và khởi tạo phiên người dùng.
- `public`: trang chủ, danh sách chuyên khoa, danh sách bác sĩ và chi tiết bác sĩ.
- `patient`: hồ sơ bệnh nhân, gửi câu hỏi, đặt lịch, lịch sử tư vấn, phiên tư vấn và đánh giá.
- `doctor`: hồ sơ bác sĩ, lịch làm việc, câu hỏi, lịch hẹn, bệnh nhân, đánh giá và phiên tư vấn.
- `admin`: quản lý người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn và kiểm duyệt.
- `reports`: dashboard và thống kê hoạt động.
- `consultation/realtime`: client dùng chung cho kết nối Socket.IO.

Về điều hướng, các route công khai cho phép người dùng chưa đăng nhập xem thông tin nền tảng, chuyên khoa và bác sĩ. Các route dành cho Patient, Doctor và Administrator được bảo vệ bằng cơ chế guard phía frontend để cải thiện trải nghiệm người dùng. Tuy nhiên, kiểm soát quyền truy cập ở backend vẫn là lớp bảo vệ chính.

Về quản lý trạng thái, Web Client sử dụng Redux Toolkit và Redux Saga. Redux lưu trạng thái xác thực, dữ liệu nghiệp vụ và trạng thái tải/lỗi của các màn hình. Redux Saga xử lý các luồng bất đồng bộ như gọi API đăng nhập, đặt lịch, gửi câu hỏi, lấy dữ liệu bác sĩ, quản trị và báo cáo. Cách tổ chức này giúp giao diện phản hồi tốt trước các thao tác nhiều bước và tránh để logic bất đồng bộ nằm rải rác trong từng màn hình.

Về giao tiếp, Web Client sử dụng REST API cho hầu hết các chức năng dữ liệu và Socket.IO cho chat trong phiên tư vấn. API client dùng access token để gọi các tài nguyên được bảo vệ và hỗ trợ luồng refresh token khi phiên cần được làm mới. Với realtime, client kết nối tới namespace tư vấn, gửi token khi bắt tay kết nối, tham gia phòng theo lịch hẹn và nhận/gửi tin nhắn trong phiên tư vấn.

## 4.4. Thiết kế Application Layer

Application Layer là ứng dụng NestJS duy nhất, đóng vai trò xử lý nghiệp vụ trung tâm của hệ thống. Lớp này cung cấp hai loại entry point:

- REST controllers: tiếp nhận các yêu cầu HTTP cho các chức năng xác thực, public discovery, hồ sơ, lịch hẹn, câu hỏi, tư vấn, thông báo, báo cáo và quản trị.
- `ConsultationGateway`: tiếp nhận kết nối Socket.IO cho phiên tư vấn realtime.

Thiết kế xử lý REST theo luồng tổng quát:

```text
HTTP request
→ Controller
→ Guard/role/ownership check nếu cần
→ Service nghiệp vụ
→ PrismaService
→ PostgreSQL
```

Trong thiết kế này, controller là điểm vào cho request và chỉ nên điều phối dữ liệu đầu vào/đầu ra. Service chứa logic nghiệp vụ như kiểm tra lịch khả dụng, xác nhận quyền truy cập, khởi tạo phiên tư vấn, tạo đơn thuốc, tạo thông báo hoặc tính toán số liệu báo cáo. `PrismaService` là lớp truy cập dữ liệu dùng chung, giúp các module thao tác với PostgreSQL thông qua Prisma ORM.

Với realtime, `ConsultationGateway` là entry point riêng cho Socket.IO. Gateway xác thực kết nối bằng token, nhận sự kiện tham gia phiên tư vấn và gửi tin nhắn, sau đó chuyển xử lý nghiệp vụ cho `ConsultationService`. Thiết kế này giúp tách trách nhiệm giao tiếp realtime khỏi logic kiểm tra quyền truy cập, trạng thái phiên và lưu tin nhắn.

Background processing được đặt trong cùng runtime NestJS thông qua `NotificationScheduler`. Scheduler xử lý hai nhóm tác vụ: xử lý outbox notification theo chu kỳ và gửi nhắc lịch cho các lịch hẹn sắp tới. Scheduler không tự xử lý nghiệp vụ gửi thông báo mà gọi `NotificationService`, nhờ đó logic notification vẫn tập trung trong một service nghiệp vụ.

## 4.5. Thiết kế dữ liệu

Dữ liệu của hệ thống được lưu trong PostgreSQL và truy cập thông qua Prisma ORM. Prisma schema là mô tả chính thức của cấu trúc dữ liệu ứng dụng. Các bảng sử dụng quan hệ rõ ràng giữa người dùng, hồ sơ, lịch hẹn, phiên tư vấn, câu hỏi, đơn thuốc, đánh giá, thông báo và audit log.

[INSERT FIGURE: database-erd.png]

**Hình 4.2. Sơ đồ quan hệ thực thể của hệ thống**

Các nhóm dữ liệu chính gồm:

| Nhóm dữ liệu | Thực thể tiêu biểu | Vai trò thiết kế |
|---|---|---|
| Định danh, phiên và audit | `User`, `UserSession`, `PasswordResetToken`, `AuditLog` | Lưu người dùng, phiên refresh token, token đặt lại mật khẩu và nhật ký hành động quan trọng. |
| Hồ sơ và khám phá bác sĩ | `PatientProfile`, `DoctorProfile`, `Specialty`, `DoctorSpecialty` | Quản lý hồ sơ bệnh nhân, hồ sơ bác sĩ, chuyên khoa và quan hệ nhiều-nhiều giữa bác sĩ và chuyên khoa. |
| Hỏi đáp và kiểm duyệt | `Question`, `Answer`, `QuestionModeration` | Lưu câu hỏi sức khỏe, phản hồi của bác sĩ và thông tin kiểm duyệt. |
| Lịch hẹn và phiên tư vấn | `Appointment`, `ConsultationSession`, `ConsultationMessage` | Quản lý lịch hẹn, phiên tư vấn và tin nhắn chat được lưu lại. |
| Kết quả, đơn thuốc và đánh giá | `Prescription`, `PrescriptionItem`, `Rating` | Lưu đơn thuốc điện tử cơ bản, chi tiết thuốc và đánh giá sau tư vấn. |
| Thông báo và xử lý bất đồng bộ | `NotificationLog`, `OutboxEvent` | Lưu lịch sử thông báo và sự kiện cần xử lý sau. |
| Tệp đính kèm | `FileAttachment` | Có trong mô hình dữ liệu như khả năng mở rộng, nhưng không phải trọng tâm của luồng triển khai hiện tại. |

Các quan hệ quan trọng trong thiết kế dữ liệu gồm:

- Một `User` có thể gắn với một hồ sơ bệnh nhân hoặc một hồ sơ bác sĩ tùy vai trò.
- Một `DoctorProfile` có thể liên kết với nhiều `Specialty` thông qua `DoctorSpecialty`.
- Một `PatientProfile` và một `DoctorProfile` cùng tham gia vào nhiều `Appointment`.
- Một `Appointment` có tối đa một `ConsultationSession`; phiên tư vấn có thể có nhiều `ConsultationMessage`.
- Một `ConsultationSession` có thể có một `Prescription`, và một đơn thuốc có nhiều `PrescriptionItem`.
- Một `Appointment` có thể có một `Rating` sau khi hoàn tất.
- `OutboxEvent` lưu các sự kiện nghiệp vụ cần xử lý bất đồng bộ; `NotificationLog` lưu kết quả thông báo gửi tới người dùng.

Thiết kế dữ liệu ưu tiên tính nhất quán của nghiệp vụ đặt lịch và tư vấn. Các enum như `Role`, `AppointmentStatus`, `ConsultationStatus`, `QuestionStatus`, `NotificationStatus`, `RatingStatus`, `ApprovalStatus` và `OutboxStatus` giúp chuẩn hóa trạng thái trong toàn hệ thống.

## 4.6. Thiết kế lớp backend

Theo quyết định lựa chọn biểu đồ lớp, báo cáo sử dụng sơ đồ lớp backend ở dạng rút gọn. Mục tiêu của sơ đồ không phải mô tả toàn bộ mã nguồn hoặc toàn bộ mô hình dữ liệu, mà minh họa các quan hệ cộng tác đại diện trong backend NestJS.

[INSERT FIGURE: backend-class-diagram.png]

**Hình 4.3. Sơ đồ lớp các thành phần backend chính**

Sơ đồ lớp rút gọn nên tập trung vào các nhóm quan hệ sau:

- **Controller → Service:** Các controller như `AuthController`, `AppointmentController`, `QuestionController`, `ConsultationController`, `ModerationController` và `ReportingController` nhận request và chuyển xử lý nghiệp vụ cho service tương ứng.
- **Gateway → Service:** `ConsultationGateway` nhận sự kiện Socket.IO và gọi `ConsultationService` để kiểm tra quyền truy cập, trạng thái phiên và lưu tin nhắn.
- **Scheduler → Service:** `NotificationScheduler` gọi `NotificationService` để xử lý outbox và nhắc lịch.
- **Service → PrismaService:** Các service nghiệp vụ sử dụng `PrismaService` để truy xuất và cập nhật dữ liệu trong PostgreSQL.
- **NotificationService → NotificationProvider:** `NotificationService` phụ thuộc vào abstraction provider để tách logic thông báo khỏi chi tiết kênh gửi.

Sơ đồ này không lặp lại ERD. Các model dữ liệu như `User`, `Appointment`, `ConsultationSession`, `Prescription` hoặc `Rating` được trình bày bằng ERD ở mục 4.5. Trong sơ đồ lớp backend, chỉ nên dùng các tham chiếu nhẹ như `OutboxEvent` hoặc `NotificationLog` nếu cần làm rõ luồng thông báo.

## 4.7. Thiết kế xác thực và phân quyền

Hệ thống sử dụng JWT access token kết hợp refresh token trong cookie HTTP-only. Khi người dùng đăng nhập thành công, backend cấp access token để gọi API được bảo vệ và refresh token để duy trì phiên đăng nhập. Refresh token được quản lý như phiên đăng nhập phía server, có thể được xoay vòng hoặc thu hồi khi người dùng đăng xuất.

Thiết kế phân quyền gồm ba lớp chính:

- `JwtAuthGuard`: xác thực access token và gắn thông tin người dùng vào request.
- `RolesGuard`: kiểm tra người dùng có vai trò phù hợp với chức năng đang truy cập hay không.
- `OwnershipGuard`: kiểm tra quyền sở hữu dữ liệu ở những tình huống cần bảo vệ tài nguyên theo người dùng cụ thể.

Mô hình RBAC của hệ thống dựa trên các vai trò `PATIENT`, `DOCTOR` và `ADMIN` ở backend. Guest User chỉ truy cập vùng công khai và không có vai trò đăng nhập trong backend. Thiết kế này đáp ứng yêu cầu tách biệt quyền giữa bệnh nhân, bác sĩ và quản trị viên, đặc biệt với dữ liệu nhạy cảm như hồ sơ sức khỏe, lịch hẹn, kết quả tư vấn và đơn thuốc.

[INSERT FIGURE: sequence-login.png]

**Hình 4.4. Biểu đồ tuần tự đăng nhập người dùng**

Biểu đồ đăng nhập được chọn vì đại diện cho cơ chế xác thực chung của Patient, Doctor và Administrator. Luồng này thể hiện việc người dùng gửi thông tin đăng nhập, backend kiểm tra thông tin xác thực, tạo phiên đăng nhập, ghi nhận thông tin cần thiết và trả token cho client.

## 4.8. Thiết kế phân hệ đặt lịch

Phân hệ đặt lịch là một trong các phân hệ trung tâm của hệ thống. Thiết kế đặt lịch gồm ba bước chính: xác định lịch khả dụng của bác sĩ, tạo lịch hẹn và quản lý vòng đời lịch hẹn.

Lịch khả dụng được xác định dựa trên lịch làm việc của bác sĩ, ngày cần tư vấn, thời lượng lịch hẹn và các lịch hẹn hiện có. Hệ thống chỉ cho phép đặt lịch với bác sĩ đang hoạt động, đã được duyệt và có tài khoản hợp lệ. Khi bệnh nhân chọn một khung giờ, backend kiểm tra lại thời gian đó có nằm trong lịch làm việc của bác sĩ hay không và có bị xung đột với lịch hẹn khác của bác sĩ hoặc bệnh nhân hay không.

Vòng đời lịch hẹn sử dụng các trạng thái như `PENDING_CONFIRMATION`, `CONFIRMED`, `COMPLETED`, `CANCELLED` và `NO_SHOW`. Trong luồng chính, bệnh nhân tạo lịch hẹn ở trạng thái chờ xác nhận, bác sĩ xác nhận lịch, hai bên tham gia tư vấn và lịch được hoàn tất sau khi phiên tư vấn kết thúc.

Các thao tác quan trọng như tạo lịch hẹn và đổi lịch sử dụng transaction để đảm bảo dữ liệu nhất quán. Trong cùng transaction, hệ thống vừa tạo/cập nhật lịch hẹn, vừa ghi audit log và tạo `OutboxEvent` cho thông báo liên quan. Việc dùng transaction giúp giảm rủi ro đặt trùng lịch hoặc tạo thông báo không khớp với trạng thái lịch hẹn.

[INSERT FIGURE: sequence-book-appointment.png]

**Hình 4.5. Biểu đồ tuần tự đặt lịch tư vấn**

Biểu đồ này được chọn vì đại diện cho luồng nghiệp vụ lõi của hệ thống. Nó thể hiện các bước kiểm tra bệnh nhân, bác sĩ, khung giờ, xung đột lịch, transaction tạo lịch hẹn và phát sinh sự kiện thông báo sau khi đặt lịch.

## 4.9. Thiết kế tư vấn trực tuyến

Phân hệ tư vấn trực tuyến quản lý vòng đời từ lúc bác sĩ bắt đầu phiên tư vấn đến khi bệnh nhân xem lại kết quả. Phiên tư vấn chỉ được khởi tạo cho lịch hẹn hợp lệ và trong khoảng thời gian cho phép. Khi phiên bắt đầu, hệ thống tạo hoặc cập nhật `ConsultationSession` ở trạng thái `ONGOING`.

Giao tiếp realtime được thiết kế bằng Socket.IO. Client của bệnh nhân và bác sĩ kết nối vào namespace tư vấn, gửi token để xác thực, tham gia phòng tương ứng với lịch hẹn và gửi tin nhắn qua sự kiện realtime. `ConsultationGateway` là điểm vào realtime, còn `ConsultationService` chịu trách nhiệm kiểm tra quyền truy cập, kiểm tra trạng thái phiên, lưu tin nhắn và trả dữ liệu cần thiết cho gateway phát lại tới phòng tư vấn.

[INSERT FIGURE: sequence-consultation-chat.png]

**Hình 4.6. Biểu đồ tuần tự chat realtime trong phiên tư vấn**

Biểu đồ này thể hiện sự khác biệt giữa luồng realtime và REST thông thường: client kết nối Socket.IO, tham gia phòng tư vấn, gửi tin nhắn, backend lưu tin nhắn và broadcast cho các bên trong cùng phiên.

Sau khi phiên tư vấn kết thúc, bác sĩ có thể lưu tóm tắt tư vấn. Nếu lịch hẹn đã hoàn tất, bác sĩ có thể tạo đơn thuốc điện tử cơ bản gồm các thuốc và hướng dẫn sử dụng. Bệnh nhân có quyền xem kết quả và đơn thuốc của phiên tư vấn của chính mình. Hệ thống cũng hỗ trợ đánh giá sau khi buổi tư vấn đã hoàn tất; đánh giá có thể được quản trị viên kiểm duyệt khi cần.

[INSERT FIGURE: sequence-create-prescription.png]

**Hình 4.7. Biểu đồ tuần tự tạo đơn thuốc sau tư vấn**

Biểu đồ này được chọn vì đại diện cho phần kết quả sau tư vấn. Nó thể hiện điều kiện nghiệp vụ là đơn thuốc chỉ được tạo sau khi buổi tư vấn/lịch hẹn đã hoàn tất, đồng thời lưu đơn thuốc và các mục thuốc như một phần của dữ liệu kết quả tư vấn.

Video consultation trong hệ thống hiện tại được thiết kế như một channel/boundary tùy chọn. Khi chưa có provider video production, hệ thống ưu tiên luồng chat realtime và có cơ chế fallback phù hợp với phạm vi SRS.

## 4.10. Thiết kế notification và background processing

Thông báo được thiết kế theo hướng bất đồng bộ bằng Outbox Pattern. Khi một nghiệp vụ chính xảy ra, chẳng hạn tạo lịch hẹn, xác nhận lịch hẹn hoặc bác sĩ trả lời câu hỏi, hệ thống tạo `OutboxEvent` trong cùng transaction với thao tác nghiệp vụ. Sau đó, background scheduler đọc các sự kiện này và chuyển cho `NotificationService` xử lý.

Thiết kế notification gồm các thành phần chính:

- `OutboxEvent`: lưu sự kiện nghiệp vụ cần xử lý sau.
- `NotificationScheduler`: chạy định kỳ để xử lý outbox và gửi nhắc lịch.
- `NotificationService`: điều phối việc xử lý sự kiện, tạo notification log và gọi provider phù hợp.
- `NotificationLog`: lưu lịch sử thông báo, trạng thái gửi, provider và lỗi nếu có.
- Provider boundary: tách hệ thống lõi khỏi chi tiết kênh gửi email/SMS/development.

Thiết kế này giúp thao tác nghiệp vụ chính không phụ thuộc trực tiếp vào việc gửi thông báo thành công ngay lập tức. Nếu thông báo gặp lỗi, dữ liệu lịch hẹn hoặc câu hỏi vẫn được ghi nhận ổn định và sự kiện có thể được xử lý lại theo trạng thái outbox.

[INSERT FIGURE: sequence-notification-outbox.png]

**Hình 4.8. Biểu đồ tuần tự xử lý thông báo bất đồng bộ qua outbox**

Biểu đồ này thể hiện cách transaction nghiệp vụ tạo `OutboxEvent`, scheduler xử lý batch, `NotificationService` tạo `NotificationLog` và gọi provider boundary để gửi thông báo. Đây là luồng đại diện cho thiết kế notification của hệ thống.

## 4.11. Các Sequence Diagram tiêu biểu khác

Các sequence diagram đã được đặt trực tiếp tại các mục thiết kế tương ứng gồm đăng nhập, đặt lịch, chat realtime, tạo đơn thuốc và xử lý notification. Ngoài các luồng trên, báo cáo còn sử dụng một sequence diagram đại diện cho thiết kế quản trị và kiểm duyệt.

[INSERT FIGURE: sequence-admin-moderation.png]

**Hình 4.9. Biểu đồ tuần tự kiểm duyệt câu hỏi và phản hồi**

Biểu đồ kiểm duyệt được chọn vì thể hiện rõ vai trò của Administrator trong quản trị nội dung. Luồng này đại diện cho việc quản trị viên xem hàng đợi nội dung cần xử lý, thực hiện hành động kiểm duyệt và hệ thống cập nhật trạng thái nội dung, đồng thời ghi nhận thông tin phục vụ audit. Thiết kế kiểm duyệt giúp hệ thống kiểm soát chất lượng nội dung tư vấn và phản hồi trong phạm vi chức năng quản trị.
