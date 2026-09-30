# BÁO CÁO TỐT NGHIỆP

## Đề tài

**Thiết kế và xây dựng hệ thống hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến**

## Danh mục từ viết tắt

| Từ viết tắt | Diễn giải |
|---|---|
| API | Application Programming Interface - giao diện lập trình ứng dụng |
| CI | Continuous Integration - tích hợp liên tục |
| DTO | Data Transfer Object - đối tượng truyền dữ liệu |
| E2E | End-to-End - kiểm thử đầu cuối |
| ERD | Entity Relationship Diagram - sơ đồ quan hệ thực thể |
| JWT | JSON Web Token - cơ chế token xác thực |
| ORM | Object Relational Mapping - ánh xạ đối tượng - quan hệ |
| RBAC | Role-Based Access Control - kiểm soát truy cập theo vai trò |
| REST | Representational State Transfer - phong cách thiết kế API HTTP |
| SRS | Software Requirements Specification - đặc tả yêu cầu phần mềm |
| SPA | Single Page Application - ứng dụng web một trang |
| UI | User Interface - giao diện người dùng |

## Danh mục hình

| Số hình | Tên hình | Vị trí |
|---|---|---|
| Hình 3.1 | Biểu đồ Use Case của khách truy cập | Mục 3.6.1 |
| Hình 3.2 | Biểu đồ Use Case của bệnh nhân | Mục 3.6.2 |
| Hình 3.3 | Biểu đồ Use Case của bác sĩ | Mục 3.6.3 |
| Hình 3.4 | Biểu đồ Use Case của quản trị viên | Mục 3.6.4 |
| Hình 3.5 | Luồng hoạt động tổng quát của hệ thống | Mục 3.7 |
| Hình 4.1 | Kiến trúc tổng thể của hệ thống | Mục 4.1 |
| Hình 4.2 | Sơ đồ quan hệ thực thể của hệ thống | Mục 4.5 |
| Hình 4.3 | Sơ đồ lớp các thành phần backend chính | Mục 4.6 |
| Hình 4.4 | Biểu đồ tuần tự đăng nhập người dùng | Mục 4.7 |
| Hình 4.5 | Biểu đồ tuần tự đặt lịch tư vấn | Mục 4.8 |
| Hình 4.6 | Biểu đồ tuần tự chat realtime trong phiên tư vấn | Mục 4.9 |
| Hình 4.7 | Biểu đồ tuần tự tạo đơn thuốc sau tư vấn | Mục 4.9 |
| Hình 4.8 | Biểu đồ tuần tự xử lý thông báo bất đồng bộ qua outbox | Mục 4.10 |
| Hình 4.9 | Biểu đồ tuần tự kiểm duyệt câu hỏi và phản hồi | Mục 4.11 |
| Hình 5.1 | Giao diện tra cứu chuyên khoa và bác sĩ | Mục 5.2 |
| Hình 5.2 | Giao diện đặt lịch hẹn trực tuyến | Mục 5.6 |
| Hình 5.3 | Giao diện tư vấn trực tuyến và trao đổi tin nhắn | Mục 5.7 |
| Hình 5.4 | Giao diện quản trị hệ thống | Mục 5.11 |

## Danh mục bảng

| Số bảng | Tên bảng | Vị trí |
|---|---|---|
| Bảng 1.1 | Các tác nhân chính của hệ thống | Mục 1.4 |
| Bảng 1.2 | Các nhóm chức năng chính của hệ thống | Mục 1.6 |
| Bảng 2.1 | Công nghệ chính sử dụng trong hệ thống | Mục 2.12 |
| Bảng 3.1 | Tác nhân và vai trò trong hệ thống | Mục 3.2 |
| Bảng 3.2 | Tóm tắt yêu cầu chức năng theo nhóm | Mục 3.3 |
| Bảng 4.1 | Vai trò thiết kế của các module backend | Mục 4.2 |
| Bảng 4.2 | Nhóm dữ liệu chính của hệ thống | Mục 4.5 |
| Bảng 5.1 | Tóm tắt phân hệ triển khai | Mục 5.13 |
| Bảng 6.1 | Bộ test case tiêu biểu | Mục 6.5 |
| Bảng 6.2 | Kết quả kiểm thử tổng hợp | Mục 6.11 |
| Bảng 6.3 | Mức độ bao phủ yêu cầu SRS | Mục 6.12 |
| Bảng 7.1 | Mức độ đáp ứng mục tiêu đề tài | Mục 7.2 |

# CHƯƠNG 1. TỔNG QUAN ĐỀ TÀI

## 1.1 Bối cảnh và lý do chọn đề tài

Nhu cầu tiếp cận thông tin chăm sóc sức khỏe, tìm kiếm bác sĩ phù hợp và đặt lịch tư vấn trực tuyến ngày càng tăng. Nếu quy trình tìm bác sĩ, gửi câu hỏi, đặt lịch, tham gia tư vấn và lưu kết quả được thực hiện rời rạc, người bệnh khó theo dõi tiến trình tư vấn, còn bác sĩ và người quản trị khó kiểm soát lịch hẹn, nội dung trao đổi và trạng thái xử lý.

Đề tài **“Thiết kế và xây dựng hệ thống hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến”** được thực hiện nhằm xây dựng một hệ thống web hỗ trợ các nghiệp vụ trên trong một quy trình thống nhất. Hệ thống là công cụ hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn, không thay thế chẩn đoán y khoa chuyên nghiệp, cấp cứu y tế hoặc việc khám trực tiếp khi cần thiết.

## 1.2 Bài toán cần giải quyết

Bài toán đặt ra là xây dựng một nền tảng trực tuyến kết nối bốn nhóm người dùng: khách truy cập, bệnh nhân, bác sĩ và quản trị viên. Hệ thống cần cho phép người dùng xem thông tin công khai, tìm kiếm bác sĩ/chuyên khoa, đăng ký hoặc đăng nhập, quản lý hồ sơ, gửi câu hỏi, đặt lịch tư vấn, tham gia phiên tư vấn, xem kết quả, đánh giá và thực hiện các tác vụ quản trị.

Ngoài yêu cầu chức năng, hệ thống phải bảo đảm phân quyền theo vai trò, kiểm soát quyền sở hữu dữ liệu, bảo vệ thông tin cá nhân và thông tin sức khỏe, đồng thời có cơ chế hỗ trợ thông báo, kiểm duyệt và thống kê hoạt động.

## 1.3 Mục tiêu đề tài

Mục tiêu tổng quát là phân tích, thiết kế và xây dựng một ứng dụng web hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến theo phạm vi đã xác định trong SRS.

Các mục tiêu cụ thể gồm:

- Xây dựng khu vực công khai để xem chuyên khoa, bác sĩ và hồ sơ công khai của bác sĩ.
- Hỗ trợ đăng ký, đăng nhập, đăng xuất, khôi phục mật khẩu và phân quyền theo vai trò.
- Cho phép bệnh nhân quản lý hồ sơ sức khỏe, gửi câu hỏi, đặt lịch, tham gia tư vấn, xem kết quả và đánh giá.
- Cho phép bác sĩ quản lý hồ sơ chuyên môn, lịch làm việc, câu hỏi, lịch hẹn, phiên tư vấn, kết quả tư vấn và đơn thuốc cơ bản.
- Cung cấp công cụ quản trị người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, kiểm duyệt và báo cáo.
- Đảm bảo các yêu cầu cơ bản về bảo mật, kiểm soát truy cập, tính nhất quán dữ liệu và khả năng sử dụng.

## 1.4 Đối tượng sử dụng

Bảng 1.1. Các tác nhân chính của hệ thống

| Đối tượng | Mô tả |
|---|---|
| Khách truy cập | Xem trang chủ, chuyên khoa, danh sách bác sĩ và hồ sơ công khai của bác sĩ. |
| Bệnh nhân | Quản lý hồ sơ, gửi câu hỏi, đặt lịch, tham gia tư vấn, xem kết quả và đánh giá. |
| Bác sĩ | Quản lý hồ sơ chuyên môn, lịch làm việc, câu hỏi, lịch hẹn và kết quả tư vấn. |
| Quản trị viên | Quản lý tài khoản, chuyên khoa, lịch hẹn, nội dung kiểm duyệt và báo cáo. |

## 1.5 Phạm vi đề tài

Phạm vi đề tài tập trung vào ứng dụng web hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn. Các chức năng trong phạm vi gồm truy cập công khai, xác thực, hồ sơ bệnh nhân/bác sĩ, chuyên khoa, tìm kiếm bác sĩ, hỏi đáp sức khỏe, đặt lịch, quản lý lịch hẹn, chat tư vấn, kết quả tư vấn, đơn thuốc cơ bản, đánh giá, thông báo, kiểm duyệt và báo cáo.

Một số nội dung như video trong môi trường vận hành thực tế, SMS trong môi trường vận hành thực tế, lưu trữ đối tượng cho tệp đính kèm, chatbot, tích hợp bệnh viện, thanh toán bảo hiểm, thiết bị y tế IoT hoặc chẩn đoán tự động không được trình bày như chức năng hiện có. Các nội dung này chỉ được xem là hướng phát triển hoặc ngoài phạm vi tùy theo SRS và ma trận truy vết.

## 1.6 Các chức năng chính

Bảng 1.2. Các nhóm chức năng chính của hệ thống

| Nhóm chức năng | Nội dung chính |
|---|---|
| Công khai | Trang chủ, chuyên khoa, danh sách bác sĩ, chi tiết bác sĩ. |
| Xác thực và phân quyền | Đăng ký, đăng nhập, đăng xuất, khôi phục mật khẩu, RBAC. |
| Bệnh nhân | Hồ sơ sức khỏe, câu hỏi, đặt lịch, tư vấn, kết quả, đơn thuốc, đánh giá. |
| Bác sĩ | Hồ sơ chuyên môn, lịch làm việc, câu hỏi, lịch hẹn, tư vấn, đơn thuốc. |
| Quản trị | Người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, kiểm duyệt, báo cáo. |
| Hỗ trợ | Thông báo, nhắc lịch, audit log, giao diện responsive. |

## 1.7 Phương pháp thực hiện

Đề tài được thực hiện theo các bước: phân tích SRS, xác định actor và use case, thiết kế kiến trúc và dữ liệu, xây dựng frontend/backend, kiểm thử các luồng chính và đối chiếu kết quả với traceability matrix.

## 1.8 Kết cấu báo cáo

Báo cáo gồm bảy chương: Tổng quan đề tài; Cơ sở lý thuyết và công nghệ; Phân tích yêu cầu hệ thống; Thiết kế hệ thống; Xây dựng và triển khai hệ thống; Kiểm thử và đánh giá; Kết luận và hướng phát triển.

# CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ

## 2.1 Kiến trúc ứng dụng web Client-Server

Hệ thống được xây dựng theo kiến trúc Client-Server. Client là ứng dụng web chạy trên trình duyệt, chịu trách nhiệm hiển thị giao diện và gửi yêu cầu đến server. Server tiếp nhận yêu cầu, xử lý nghiệp vụ, kiểm tra quyền truy cập và lưu trữ dữ liệu. Cách tổ chức này phù hợp với hệ thống vì người dùng thuộc nhiều vai trò khác nhau cần truy cập cùng một nguồn dữ liệu nghiệp vụ.

## 2.2 REST API

REST API là cơ chế giao tiếp chính giữa frontend và backend cho các chức năng như xác thực, hồ sơ, khám phá bác sĩ, câu hỏi, lịch hẹn, tư vấn, quản trị và báo cáo. Trong hệ thống này, REST giúp các luồng nghiệp vụ có điểm vào rõ ràng, dễ kiểm thử và phù hợp với mô hình frontend SPA.

## 2.3 Modular Monolith

Modular Monolith là cách tổ chức backend trong một ứng dụng triển khai duy nhất nhưng chia thành các module nghiệp vụ rõ ràng. Hệ thống sử dụng kiến trúc này vì các phân hệ như lịch hẹn, tư vấn, thông báo và báo cáo có liên quan chặt chẽ đến cùng cơ sở dữ liệu, đồng thời phạm vi đồ án chưa cần vận hành nhiều dịch vụ độc lập.

## 2.4 React

React được sử dụng để xây dựng giao diện người dùng. Ứng dụng frontend là SPA, có route công khai, route bệnh nhân, route bác sĩ và route quản trị. React phù hợp vì hệ thống có nhiều màn hình, trạng thái tải/lỗi và tương tác biểu mẫu.

## 2.5 TypeScript

TypeScript được sử dụng ở cả frontend và backend để bổ sung kiểu tĩnh cho JavaScript. Điều này giúp giảm lỗi khi truyền dữ liệu giữa các tầng, cải thiện khả năng bảo trì và hỗ trợ kiểm tra type-check trong quá trình phát triển.

## 2.6 Node.js và NestJS

Node.js là nền tảng chạy backend. NestJS cung cấp mô hình module, controller, service, guard và dependency injection, phù hợp với ứng dụng có nhiều phân hệ nghiệp vụ. Trong hệ thống này, NestJS giúp tổ chức code theo các module như Identity, Appointment, Consultation, Notification, Moderation và Reporting.

## 2.7 PostgreSQL và Prisma ORM

PostgreSQL là hệ quản trị cơ sở dữ liệu quan hệ được dùng để lưu người dùng, hồ sơ, chuyên khoa, lịch hẹn, phiên tư vấn, tin nhắn, đơn thuốc, đánh giá, thông báo và audit log. Prisma ORM cung cấp schema, migration và client truy vấn type-safe, giúp backend thao tác dữ liệu rõ ràng và nhất quán.

## 2.8 JWT Authentication, RBAC và bảo mật mật khẩu

Hệ thống dùng JWT cho access token và refresh token được lưu qua HttpOnly cookie. RBAC giới hạn chức năng theo vai trò Patient, Doctor và Administrator. Mật khẩu được băm bằng bcrypt trước khi lưu. Các cơ chế này phù hợp với hệ thống có nhiều vai trò và dữ liệu sức khỏe cần kiểm soát truy cập.

## 2.9 WebSocket và Socket.IO

REST API phù hợp với các luồng request-response, nhưng phiên tư vấn cần trao đổi hai chiều theo thời gian thực. Vì vậy hệ thống sử dụng Socket.IO cho chat trong phiên tư vấn. Backend xác thực kết nối bằng JWT và gateway chuyển xử lý nghiệp vụ cho service tư vấn.

## 2.10 Transaction, tính nhất quán dữ liệu và Outbox Pattern

Transaction được dùng trong các nghiệp vụ cần tính nhất quán, đặc biệt là đặt lịch và đổi lịch. Outbox Pattern được dùng để ghi sự kiện thông báo trong cùng transaction nghiệp vụ, sau đó xử lý bất đồng bộ qua scheduler. Cách tiếp cận này giúp giảm rủi ro nghiệp vụ chính thành công nhưng thông báo bị mất.

## 2.11 Responsive Web Design

Responsive Web Design giúp giao diện thích ứng với nhiều kích thước màn hình. Trong hệ thống này, frontend sử dụng các layout và class responsive để hỗ trợ thao tác trên desktop, tablet và mobile. Tuy nhiên, theo kết quả kiểm thử, chưa có artifact kiểm thử responsive toàn diện.

## 2.12 Công nghệ kiểm thử thực tế được sử dụng

Bảng 2.1. Công nghệ chính sử dụng trong hệ thống

| Nhóm | Công nghệ |
|---|---|
| Frontend | React, TypeScript, Vite, Redux Toolkit, Redux Saga, Axios, Socket.IO client, PrimeReact, Tailwind CSS |
| Backend | Node.js, NestJS, TypeScript, Prisma, Socket.IO, node-cron, bcryptjs, JWT |
| Database | PostgreSQL |
| Kiểm thử | Jest, ts-jest, Playwright |
| Build/CI | TypeScript compiler, Nest build, Vite build, GitHub Actions workflow configuration |

# CHƯƠNG 3. PHÂN TÍCH YÊU CẦU HỆ THỐNG

## 3.1 Mô tả bài toán

Hệ thống cần hỗ trợ quy trình tư vấn sức khỏe trực tuyến từ giai đoạn khám phá thông tin, xác thực người dùng, đặt lịch, tư vấn, ghi nhận kết quả đến đánh giá và quản trị. Chương này mô tả **hệ thống được yêu cầu làm gì** theo SRS; các chi tiết code và thiết kế triển khai được trình bày ở Chương 4 và Chương 5.

## 3.2 Đối tượng sử dụng

Bảng 3.1. Tác nhân và vai trò trong hệ thống

| Tác nhân | Vai trò yêu cầu |
|---|---|
| Guest | Truy cập nội dung công khai và được chuyển đến đăng nhập/đăng ký khi muốn dùng chức năng bảo vệ. |
| Patient | Quản lý hồ sơ, hỏi đáp, đặt lịch, tham gia tư vấn, xem kết quả và đánh giá. |
| Doctor | Quản lý hồ sơ chuyên môn, lịch làm việc, câu hỏi, lịch hẹn và kết quả tư vấn. |
| Administrator | Quản lý người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, kiểm duyệt và báo cáo. |

## 3.3 Yêu cầu chức năng

Bảng 3.2. Tóm tắt yêu cầu chức năng theo nhóm

| Nhóm | Yêu cầu SRS tiêu biểu |
|---|---|
| Public access | UC-G-01 đến UC-G-06: xem trang chủ, chuyên khoa, bác sĩ, chi tiết bác sĩ và chuyển đến đăng nhập khi cần. |
| Authentication | UC-P-01, UC-P-02, UC-P-03, UC-D-01, UC-A-01: đăng ký, đăng nhập, đăng xuất, khôi phục mật khẩu và phân quyền. |
| Profile | UC-P-04, UC-D-02: quản lý hồ sơ bệnh nhân và hồ sơ chuyên môn của bác sĩ. |
| Doctor discovery | UC-P-05, UC-P-06, UC-G-03, UC-G-04: tìm kiếm/lọc bác sĩ và xem hồ sơ công khai. |
| Health questions | UC-P-07, UC-P-11, UC-D-03, UC-D-04, UC-A-06: gửi câu hỏi, trả lời và kiểm duyệt. |
| Appointment | UC-P-08, UC-P-09, UC-P-12, UC-D-05, UC-D-06, UC-A-05: đặt lịch, xem lịch, hủy/xác nhận/hoàn tất/đổi lịch. |
| Consultation | UC-P-10, UC-D-07, UC-D-08: tham gia phiên tư vấn và trao đổi qua chat hoặc cơ chế video mở rộng. |
| Result, prescription, rating | UC-P-13, UC-P-14, UC-D-09, UC-D-10: kết quả tư vấn, đơn thuốc cơ bản và đánh giá. |
| Notification/reporting/admin | UC-P-15, UC-A-02 đến UC-A-08, UC-E-01: thông báo, quản trị, kiểm duyệt và báo cáo. |

## 3.4 Yêu cầu phi chức năng

SRS yêu cầu hệ thống có xác thực và phân quyền, lưu mật khẩu an toàn, kiểm tra hợp lệ dữ liệu, kiểm soát truy cập dữ liệu sức khỏe, audit log cho hành động quan trọng, giao diện dễ sử dụng, kiến trúc có khả năng bảo trì và có định hướng mở rộng. Một số yêu cầu như HTTPS trong môi trường vận hành thực tế, hiệu năng dưới tải, tính sẵn sàng cao, tương thích trình duyệt và audit giao diện responsive cần bằng chứng triển khai/kiểm thử ở môi trường phù hợp hoặc kiểm thử chuyên sâu; các nội dung này được đánh giá ở Chương 6 và Chương 7.

## 3.5 Các quy tắc nghiệp vụ chính

Các quy tắc nghiệp vụ quan trọng theo SRS gồm:

- Người dùng chỉ được truy cập chức năng phù hợp với vai trò.
- Bệnh nhân và bác sĩ chỉ được xem dữ liệu thuộc phạm vi được phép.
- Bác sĩ chỉ được hiển thị công khai khi đang hoạt động và đã được phê duyệt.
- Lịch hẹn phải nằm trong tương lai, nằm trong lịch làm việc của bác sĩ và không trùng với lịch đang hoạt động của bác sĩ hoặc bệnh nhân.
- Phiên tư vấn gắn với lịch hẹn hợp lệ và chỉ cho phép bệnh nhân/bác sĩ liên quan tham gia.
- Đánh giá chỉ được gửi sau khi lịch tư vấn hoàn thành.
- Thông báo và nhắc lịch được xử lý như chức năng hỗ trợ, trong đó provider vận hành thực tế phụ thuộc cấu hình triển khai.

## 3.6 Biểu đồ Use Case

### 3.6.1 Biểu đồ Use Case của khách truy cập

[INSERT FIGURE: use-case-guest.png]

Hình 3.1. Biểu đồ Use Case của khách truy cập

Hình 3.1 thể hiện các use case công khai UC-G-01 đến UC-G-06, gồm xem trang chủ, xem chuyên khoa, tìm kiếm bác sĩ, xem hồ sơ công khai và chuyển đến đăng nhập/đăng ký khi thực hiện hành động bảo vệ.

### 3.6.2 Biểu đồ Use Case của bệnh nhân

[INSERT FIGURE: use-case-patient.png]

Hình 3.2. Biểu đồ Use Case của bệnh nhân

Hình 3.2 thể hiện các use case UC-P-01 đến UC-P-15, bao gồm quản lý hồ sơ, hỏi đáp, đặt lịch, tham gia tư vấn, xem kết quả, đơn thuốc, đánh giá và nhận thông báo. SMS trong hình được hiểu là hướng mở rộng phụ thuộc provider, không phải bằng chứng đã tích hợp SMS trong môi trường vận hành thực tế.

### 3.6.3 Biểu đồ Use Case của bác sĩ

[INSERT FIGURE: use-case-doctor.png]

Hình 3.3. Biểu đồ Use Case của bác sĩ

Hình 3.3 thể hiện các use case UC-D-01 đến UC-D-11. Video consultation là use case mở rộng; hệ thống hiện tại hỗ trợ chat realtime và fallback/mock, chưa tích hợp provider video trong môi trường vận hành thực tế.

### 3.6.4 Biểu đồ Use Case của quản trị viên

[INSERT FIGURE: use-case-admin.png]

Hình 3.4. Biểu đồ Use Case của quản trị viên

Hình 3.4 thể hiện các use case UC-A-01 đến UC-A-08 cho quản trị tài khoản, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, kiểm duyệt và báo cáo.

## 3.7 Luồng hoạt động tổng quát của hệ thống

[INSERT FIGURE: system-flow.png]

Hình 3.5. Luồng hoạt động tổng quát của hệ thống

Luồng tổng quát bắt đầu từ khám phá công khai, sau đó người dùng đăng nhập hoặc đăng ký để đặt lịch, tham gia tư vấn, nhận kết quả/đơn thuốc và đánh giá. Bác sĩ tham gia bằng cách quản lý lịch, xác nhận lịch, trả lời câu hỏi và thực hiện tư vấn. Quản trị viên hỗ trợ vận hành qua quản lý dữ liệu, kiểm duyệt và báo cáo. Thông báo là vai trò hỗ trợ cho đặt lịch, nhắc lịch và phản hồi câu hỏi.

## 3.8 Phạm vi và giới hạn yêu cầu

Trong phạm vi hiện tại, hệ thống tập trung vào các luồng tư vấn và quản lý lịch hẹn cốt lõi. Các nội dung ngoài phạm vi hoặc chưa triển khai đầy đủ gồm chẩn đoán tự động, cấp cứu y tế, tích hợp EMR/EHR, thanh toán bảo hiểm, IoT y tế, tải tệp trong môi trường vận hành thực tế, SMS trong môi trường vận hành thực tế và video trong môi trường vận hành thực tế. Những điểm này không được xem là chức năng hiện có.

# CHƯƠNG 4. THIẾT KẾ HỆ THỐNG

## 4.1 Tổng quan kiến trúc hệ thống

Hệ thống được thiết kế gồm Web Client, Application Layer và Data Layer. Web Client là React SPA. Application Layer là backend NestJS theo kiến trúc Modular Monolith, cung cấp REST API và Socket.IO gateway. Data Layer sử dụng PostgreSQL thông qua Prisma ORM.

[INSERT FIGURE: architecture-overview.png]

Hình 4.1. Kiến trúc tổng thể của hệ thống

Hình 4.1 thể hiện ranh giới giữa frontend, backend và database. Các dịch vụ email, SMS, video hoặc lưu trữ tệp được xem là ranh giới tích hợp bên ngoài, không được trình bày như năng lực vận hành thực tế đã hoàn thiện.

## 4.2 Lựa chọn kiến trúc Modular Monolith

Backend dùng Modular Monolith vì các phân hệ có quan hệ nghiệp vụ chặt chẽ và cần chia sẻ dữ liệu nhất quán. Kiến trúc này đơn giản hóa triển khai trong phạm vi đồ án, đồng thời vẫn giữ ranh giới module rõ ràng.

Bảng 4.1. Vai trò thiết kế của các module backend

| Module | Vai trò |
|---|---|
| Identity | Xác thực, phiên đăng nhập, khôi phục mật khẩu và người dùng. |
| Discovery | Dữ liệu công khai về chuyên khoa và bác sĩ. |
| Patient | Hồ sơ sức khỏe bệnh nhân. |
| Doctor | Hồ sơ bác sĩ, lịch làm việc và chuyên khoa. |
| Appointment | Khả dụng, đặt lịch, xác nhận, hủy, hoàn tất, đổi lịch. |
| Question | Câu hỏi sức khỏe và phản hồi của bác sĩ. |
| Consultation | Phiên tư vấn, chat realtime, kết quả, đơn thuốc và đánh giá. |
| Notification | Outbox, notification log, reminder và provider boundary. |
| Moderation | Kiểm duyệt câu hỏi, câu trả lời và đánh giá. |
| Reporting | Dashboard và thống kê hoạt động. |
| Prisma | Truy cập dữ liệu dùng chung. |

Trade-off chính là khi số lượng người dùng và phiên realtime tăng, hệ thống có thể cần mở rộng riêng cho realtime, scheduler hoặc reporting. Đây là hướng phát triển, không phải yêu cầu hiện tại.

## 4.3 Thiết kế Web Client

Web Client được tổ chức theo feature: `auth`, `public`, `patient`, `doctor`, `admin`, `reports` và `consultation/realtime`. Routing phân tách vùng công khai và vùng bảo vệ theo vai trò. Redux Toolkit và Redux Saga xử lý trạng thái và luồng bất đồng bộ. REST API được dùng cho dữ liệu nghiệp vụ, còn Socket.IO được dùng cho chat trong phiên tư vấn.

## 4.4 Thiết kế Application Layer

Application Layer có hai loại entry point: REST controllers và `ConsultationGateway`. Controllers nhận request HTTP và gọi service nghiệp vụ. Gateway xử lý kết nối Socket.IO, xác thực token và chuyển nghiệp vụ chat cho `ConsultationService`. Các service dùng `PrismaService` để truy cập PostgreSQL. `NotificationScheduler` xử lý outbox và reminder nền thông qua `NotificationService`.

## 4.5 Thiết kế dữ liệu

Dữ liệu được lưu trong PostgreSQL. Prisma schema là nguồn chính của cấu trúc dữ liệu. ERD được xuất từ cơ sở dữ liệu/schema cuối cùng.

[INSERT FIGURE: database-erd.png]

Hình 4.2. Sơ đồ quan hệ thực thể của hệ thống

Bảng 4.2. Nhóm dữ liệu chính của hệ thống

| Nhóm dữ liệu | Thực thể tiêu biểu |
|---|---|
| Định danh và audit | `User`, `UserSession`, `PasswordResetToken`, `AuditLog` |
| Hồ sơ và chuyên khoa | `PatientProfile`, `DoctorProfile`, `Specialty`, `DoctorSpecialty` |
| Hỏi đáp và kiểm duyệt | `Question`, `Answer`, `QuestionModeration` |
| Lịch hẹn và tư vấn | `Appointment`, `ConsultationSession`, `ConsultationMessage` |
| Kết quả và đánh giá | `Prescription`, `PrescriptionItem`, `Rating` |
| Thông báo | `OutboxEvent`, `NotificationLog` |

## 4.6 Thiết kế lớp backend

Theo quyết định diagram selection, sơ đồ lớp backend được giữ ở dạng rút gọn để minh họa quan hệ đại diện như Controller -> Service, Gateway -> Service, Scheduler -> Service, Service -> PrismaService và NotificationService -> NotificationProvider.

[INSERT FIGURE: backend-class-diagram.png]

Hình 4.3. Sơ đồ lớp các thành phần backend chính

Sơ đồ này không thay thế ERD và không liệt kê toàn bộ DTO, model hoặc controller CRUD đơn giản.

## 4.7 Thiết kế xác thực và phân quyền

Hệ thống dùng JWT access token, refresh token qua HttpOnly cookie, `JwtAuthGuard`, `RolesGuard` và ownership checks. Backend là lớp bảo vệ quyết định; frontend guard chỉ hỗ trợ điều hướng và trải nghiệm người dùng.

[INSERT FIGURE: sequence-login.png]

Hình 4.4. Biểu đồ tuần tự đăng nhập người dùng

## 4.8 Thiết kế phân hệ đặt lịch

Phân hệ đặt lịch kiểm tra bác sĩ hợp lệ, lịch làm việc, thời điểm trong tương lai và overlap của bác sĩ/bệnh nhân. Các thao tác tạo hoặc đổi lịch dùng transaction để giảm rủi ro dữ liệu không nhất quán.

[INSERT FIGURE: sequence-book-appointment.png]

Hình 4.5. Biểu đồ tuần tự đặt lịch tư vấn

## 4.9 Thiết kế tư vấn trực tuyến, kết quả và đơn thuốc

Phiên tư vấn gắn với lịch hẹn hợp lệ. Bác sĩ bắt đầu/kết thúc phiên, bệnh nhân và bác sĩ liên quan tham gia trong khung thời gian cho phép. Chat realtime sử dụng Socket.IO và tin nhắn được lưu bền vững. Sau tư vấn, bác sĩ có thể ghi tóm tắt và tạo đơn thuốc cơ bản khi lịch hẹn đã hoàn thành.

[INSERT FIGURE: sequence-consultation-chat.png]

Hình 4.6. Biểu đồ tuần tự chat realtime trong phiên tư vấn

[INSERT FIGURE: sequence-create-prescription.png]

Hình 4.7. Biểu đồ tuần tự tạo đơn thuốc sau tư vấn

## 4.10 Thiết kế notification và background processing

Thông báo được thiết kế bằng Outbox Pattern. Nghiệp vụ chính ghi `OutboxEvent`; scheduler xử lý batch, gọi `NotificationService`, tạo `NotificationLog` và chuyển đến provider boundary.

[INSERT FIGURE: sequence-notification-outbox.png]

Hình 4.8. Biểu đồ tuần tự xử lý thông báo bất đồng bộ qua outbox

## 4.11 Thiết kế quản trị và kiểm duyệt

Quản trị viên có quyền quản lý tài khoản, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, nội dung kiểm duyệt và báo cáo. Kiểm duyệt được bảo vệ bởi vai trò Administrator và ghi audit log.

[INSERT FIGURE: sequence-admin-moderation.png]

Hình 4.9. Biểu đồ tuần tự kiểm duyệt câu hỏi và phản hồi

# CHƯƠNG 5. XÂY DỰNG VÀ TRIỂN KHAI HỆ THỐNG

Chương này mô tả cách hệ thống đã được triển khai theo các phân hệ chức năng. Các quyết định kiến trúc chi tiết đã trình bày ở Chương 4 nên không lặp lại tại đây.

## 5.1 Xác thực và RBAC

Frontend cung cấp trang đăng ký, đăng nhập, quên mật khẩu, đặt lại mật khẩu và route guard theo vai trò. Backend triển khai `AuthController`, `AuthService`, `UsersService`, `JwtAuthGuard`, `RolesGuard` và `OwnershipGuard`. Dữ liệu liên quan gồm `User`, `UserSession`, `PasswordResetToken` và `AuditLog`.

## 5.2 Khám phá bác sĩ và chuyên khoa công khai

Frontend có trang danh sách chuyên khoa, danh sách bác sĩ và chi tiết bác sĩ. Backend dùng `DiscoveryService` để trả danh sách bác sĩ đang hoạt động, đã được phê duyệt và tài khoản chưa bị vô hiệu hóa.

[INSERT FIGURE: ui-public-doctor-discovery.png]

Hình 5.1. Giao diện tra cứu chuyên khoa và bác sĩ

## 5.3 Hồ sơ bệnh nhân

Bệnh nhân có thể xem và cập nhật hồ sơ gồm ngày sinh, giới tính, số điện thoại, địa chỉ và tiền sử sức khỏe. Backend lưu dữ liệu này trong `PatientProfile` và liên kết với `User`.

## 5.4 Hồ sơ bác sĩ và lịch làm việc

Bác sĩ quản lý hồ sơ chuyên môn, mô tả tư vấn, kinh nghiệm, chuyên khoa và lịch làm việc. Lịch làm việc được dùng khi tính slot khả dụng cho đặt lịch.

## 5.5 Hỏi đáp sức khỏe

Bệnh nhân gửi câu hỏi, bác sĩ xem câu hỏi được giao hoặc câu hỏi mở và trả lời. Khi bác sĩ trả lời, hệ thống cập nhật trạng thái câu hỏi, tạo câu trả lời, ghi audit log và tạo outbox event để thông báo.

## 5.6 Lịch hẹn và khả dụng

Bệnh nhân đặt lịch dựa trên slot khả dụng. Backend luôn kiểm tra lại điều kiện đặt lịch để tránh phụ thuộc vào kiểm tra phía giao diện.

[INSERT FIGURE: ui-book-appointment.png]

Hình 5.2. Giao diện đặt lịch hẹn trực tuyến

## 5.7 Tư vấn trực tuyến và chat realtime

Frontend bệnh nhân và bác sĩ dùng trang phiên tư vấn để tham gia chat. Backend dùng `ConsultationGateway` để xác thực socket, join room theo appointment và phát tin nhắn trong phòng.

[INSERT FIGURE: ui-consultation-chat.png]

Hình 5.3. Giao diện tư vấn trực tuyến và trao đổi tin nhắn

## 5.8 Kết quả tư vấn và đơn thuốc

Bác sĩ lưu tóm tắt tư vấn và tạo đơn thuốc cơ bản sau khi lịch hẹn hoàn thành. Bệnh nhân xem lại kết quả và đơn thuốc trong lịch sử tư vấn.

## 5.9 Đánh giá

Bệnh nhân đánh giá sau khi lịch tư vấn hoàn thành. Backend kiểm tra quyền sở hữu lịch hẹn, trạng thái hoàn thành và không cho tạo đánh giá trùng cho cùng lịch hẹn.

## 5.10 Thông báo

Backend xử lý thông báo qua `OutboxEvent`, `NotificationScheduler`, `NotificationService` và `NotificationLog`. Hệ thống hiện có ranh giới provider và các lớp development/email/SMS provider, nhưng chưa có bằng chứng gửi email/SMS thật trong môi trường vận hành thực tế.

## 5.11 Quản trị và kiểm duyệt

Quản trị viên quản lý người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, nội dung kiểm duyệt và thông tin vận hành. Các thao tác quản trị được bảo vệ bằng JWT và RBAC.

[INSERT FIGURE: ui-admin-dashboard.png]

Hình 5.4. Giao diện quản trị hệ thống

## 5.12 Báo cáo

Phân hệ báo cáo cung cấp số liệu tổng quan về người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, câu hỏi, đánh giá và xu hướng tư vấn. Backend sử dụng các truy vấn `count`, `groupBy` và xử lý bucket thời gian.

## 5.13 Tóm tắt phân hệ triển khai

Bảng 5.1. Tóm tắt phân hệ triển khai

| Phân hệ | Frontend | Backend | Dữ liệu chính |
|---|---|---|---|
| Auth/RBAC | Auth pages, route guards | Identity module, guards | `User`, `UserSession` |
| Discovery | Public pages | Discovery module | `DoctorProfile`, `Specialty`, `Rating` |
| Appointment | Booking/history pages | Appointment module | `Appointment`, `OutboxEvent` |
| Consultation | Session pages, socket client | Consultation module/gateway | `ConsultationSession`, `ConsultationMessage` |
| Notification | API support/admin logs | Notification scheduler/service | `OutboxEvent`, `NotificationLog` |
| Admin/Reporting | Admin pages, report pages | Moderation/Reporting modules | Nhiều nhóm dữ liệu nghiệp vụ |

# CHƯƠNG 6. KIỂM THỬ VÀ ĐÁNH GIÁ

## 6.1 Mục tiêu kiểm thử

Kiểm thử nhằm xác minh các luồng nghiệp vụ chính, bảo mật truy cập, quy tắc đặt lịch, realtime chat, thông báo nền, build/type-check và mức độ đáp ứng SRS. Chương này chỉ sử dụng bằng chứng thực tế từ mã nguồn test, kết quả test, tài liệu kiểm thử, traceability và audit.

## 6.2 Môi trường kiểm thử

Theo `docs/testing/final-e2e-results.md`, môi trường E2E dùng backend `OnlineHealthConsultation-Service`, frontend `OnlineHealthConsultation-Web`, PostgreSQL Docker container `health_consultation_db`, backend URL `http://localhost:4000/api`, frontend URL `http://localhost:5173`, Playwright Chromium và seed mode `E2E_RUN_SEEDED=true`.

## 6.3 Phương pháp kiểm thử

Hệ thống dùng Jest cho backend unit/service tests, Playwright cho E2E tests, TypeScript compiler cho type-check, Nest build và Vite build cho kiểm tra biên dịch. CI workflow tồn tại trong repository nhưng không có artifact kết quả chạy CI, nên không khẳng định CI đã pass.

## 6.4 Cách tiếp cận Unit/Integration/E2E đã sử dụng

Backend có test trong các file như `appointment.service.spec.ts`, `auth.service.spec.ts`, `auth.controller.spec.ts`, `notification.service.spec.ts`, `moderation.service.spec.ts`, `reporting.service.spec.ts`, `doctor.service.spec.ts`, `validate-env.spec.ts` và `http-exception.filter.spec.ts`.

Frontend có Playwright specs cho public discovery, authentication, patient appointment, patient question, doctor workflow, admin và socket client. Graduation suite có tồn tại nhưng chưa được xem là đạt đầy đủ.

## 6.5 Bộ test case tiêu biểu

Bảng 6.1. Bộ test case tiêu biểu

| ID | Scenario | Expected | Actual | Result |
| -- | -------- | -------- | ------ | ------ |
| TC-AUTH-01 | Refresh token hợp lệ | Tạo access token mới, rotate session | Backend Jest pass ngày 2026-08-22 | PASS |
| TC-APPT-01 | Slot khả dụng từ lịch bác sĩ | Trả slot hợp lệ, loại slot overlap | Backend Jest pass ngày 2026-08-22 | PASS |
| TC-APPT-02 | Đặt lịch trùng bác sĩ/bệnh nhân | Backend reject overlap | Backend Jest pass ngày 2026-08-22 | PASS |
| TC-CONSULT-01 | Socket client join/send/reconnect | Join đúng room, gửi tin nhắn, reconnect an toàn | Core E2E ghi nhận pass | PASS |
| TC-NOTI-01 | Outbox appointment-created | Tạo notification cho patient/doctor | Backend Jest pass ngày 2026-08-22 | PASS |
| TC-E2E-CORE | Core E2E suites | Không có test failed trong core suites | 42/43 passed, 0 failed, 1 skipped | PARTIAL |
| TC-GRAD | Graduation suite | Toàn bộ graduation flows pass | GRAD-A/B/C chưa đạt; GRAD-D đạt khi chạy riêng | NOT PASS |

## 6.6 Kiểm thử các user flow chính

Core E2E đã ghi nhận các luồng public discovery, auth theo vai trò, patient appointment, patient question, doctor consultation/prescription workflow, admin dashboard/doctor/specialty/access guard và socket client behavior. Kết quả core E2E là 42/43 passed, 0 failed, 1 skipped.

## 6.7 Kiểm thử authentication/RBAC

Backend kiểm thử refresh session rotation, token không hợp lệ, session bị thu hồi/hết hạn, logout revoke session, forgot/reset password và cookie contract. Frontend E2E kiểm thử đăng nhập theo vai trò, guest redirect, role guard và logout.

## 6.8 Kiểm thử appointment availability/conflict

`appointment.service.spec.ts` kiểm thử slot hợp lệ, overlap của bác sĩ, overlap của bệnh nhân, lookup bác sĩ không public, tạo lịch ngoài giờ, bác sĩ inactive/unapproved và reschedule conflict. `patient-appointments.spec.ts` kiểm thử luồng đặt lịch và quản lý lịch ở UI.

## 6.9 Kiểm thử consultation realtime

`doctor-workflow.spec.ts` kiểm thử route phiên tư vấn, summary, prescription và patient result. `consultation-socket-client.spec.ts` kiểm thử client Socket.IO. Chưa có E2E hai browser context đầy đủ cho bệnh nhân và bác sĩ trao đổi realtime trên hai giao diện thật.

## 6.10 Kiểm thử notification/background processing

`notification.service.spec.ts` kiểm thử reset password notification, appointment-created outbox, provider failure retry, appointment reminders và question-answered notification. Chưa có bằng chứng gửi email/SMS thật trong môi trường vận hành thực tế.

## 6.11 Kết quả kiểm thử

Bảng 6.2. Kết quả kiểm thử tổng hợp

| Nhóm kiểm tra | Actual | Result |
|---|---|---|
| Backend Jest | 9 test suites passed, 47 tests passed, 0 failed | PASS |
| Backend type-check | `tsc --noEmit` hoàn tất, exit code 0 | PASS |
| Backend build | `nest build` hoàn tất, exit code 0 | PASS |
| Frontend type-check | `tsc --noEmit` hoàn tất, exit code 0 | PASS |
| Frontend build | `tsc -b && vite build` hoàn tất, exit code 0 | PASS |
| Core E2E | 42/43 passed, 0 failed, 1 skipped | PARTIAL |
| Graduation E2E | 1 failed, 1 flaky, 2 did not run; GRAD-D pass isolation | NOT PASS |

Các cảnh báo không làm fail build/test gồm cảnh báo `ts-jest`, log lỗi giả lập `Email failed` trong failure-path test, Browserslist data cũ và chunk-size warning của Vite.

## 6.12 Độ bao phủ yêu cầu SRS

Bảng 6.3. Mức độ bao phủ yêu cầu SRS

| Nhóm yêu cầu | Trạng thái theo ma trận truy vết/bằng chứng kiểm thử |
|---|---|
| Public access, auth, doctor discovery, health questions, appointment, admin/reporting | Chủ yếu đã triển khai và có bằng chứng kiểm thử lõi. |
| Consultation realtime | Đã triển khai; socket client có test; E2E hai trình duyệt còn thiếu. |
| Notification/reminder | Outbox/log/reminder lõi có kiểm thử; email/SMS trong môi trường vận hành thực tế còn ở mức một phần. |
| Rating | Đã triển khai; automation positive/negative còn cần bổ sung. |
| Hiệu năng, high availability, browser/mobile matrix | Chưa có benchmark hoặc artifact kiểm thử đầy đủ. |
| Optional/out-of-scope | File upload, chatbot, advanced SMS/video không được xem là chức năng hiện có. |

## 6.13 Đánh giá hệ thống

Hệ thống đạt mức sẵn sàng tốt cho các luồng cốt lõi trong phạm vi đồ án. Các quy tắc rủi ro cao như refresh token, RBAC, conflict booking, outbox notification, moderation audit và report date validation đã có test. Tuy nhiên, một số yêu cầu phi chức năng và luồng E2E nâng cao vẫn chưa được kiểm chứng đầy đủ.

## 6.14 Hạn chế hiện tại

Các hạn chế kiểm thử gồm graduation suite chưa đạt đầy đủ, 1 core E2E bị skipped, chưa có artifact về tỷ lệ bao phủ mã nguồn, chưa có benchmark tải/hiệu năng/đồng thời, chưa có bằng chứng cross-browser/mobile, chưa có E2E hai trình duyệt cho realtime chat và chưa có artifact kết quả chạy CI.

# CHƯƠNG 7. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

## 7.1 Kết quả đạt được

Đề tài đã xây dựng được hệ thống web hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến với các chức năng cốt lõi cho khách truy cập, bệnh nhân, bác sĩ và quản trị viên. Hệ thống có kiến trúc rõ ràng, mô hình dữ liệu quan hệ, xác thực/phân quyền, đặt lịch có kiểm soát xung đột, chat realtime, kết quả tư vấn, đơn thuốc cơ bản, đánh giá, thông báo, kiểm duyệt và báo cáo.

## 7.2 Mức độ đáp ứng mục tiêu đề tài

Bảng 7.1. Mức độ đáp ứng mục tiêu đề tài

| Mục tiêu | Mức độ đáp ứng |
|---|---|
| Ứng dụng web tư vấn sức khỏe và quản lý lịch hẹn | Đã triển khai với React, NestJS và PostgreSQL. |
| Tìm kiếm chuyên khoa/bác sĩ | Đã triển khai và có bằng chứng E2E lõi. |
| Xác thực và phân quyền | Đã triển khai, có bằng chứng backend và E2E. |
| Luồng bệnh nhân | Đã triển khai; một số E2E chi tiết còn cần mở rộng. |
| Luồng bác sĩ | Đã triển khai, có test cho các luồng chính. |
| Chat realtime | Đã triển khai; socket client đã kiểm thử; E2E hai trình duyệt còn thiếu. |
| Kết quả, đơn thuốc, đánh giá | Đã triển khai; rating cần bổ sung automation. |
| Quản trị, kiểm duyệt, báo cáo | Đã triển khai, có bằng chứng backend và một phần E2E. |

## 7.3 Kết quả kỹ thuật

Hệ thống hiện tại sử dụng React SPA, NestJS Modular Monolith, PostgreSQL, Prisma ORM, JWT, RBAC, Socket.IO, transaction và Outbox Pattern. Kết quả kiểm thử ghi nhận backend Jest pass 9 suites/47 tests, backend và frontend type-check/build pass, core E2E 42/43 pass với 1 skipped.

## 7.4 Hạn chế hiện tại

**Current implemented system / Hệ thống đã triển khai hiện tại:** hệ thống chưa có provider email/SMS vận hành thực tế được xác minh, chưa có video vận hành thực tế, chưa có lưu trữ đối tượng cho tệp đính kèm, chưa có benchmark hiệu năng/tải đồng thời, chưa có cross-browser/mobile audit đầy đủ, chưa có E2E hai trình duyệt cho live chat, và graduation E2E suite còn cần chỉnh dữ liệu test/tương tác test.

## 7.5 Bài học kinh nghiệm

Các bài học chính gồm: cần xác định phạm vi rõ ràng, dùng SRS và traceability để kiểm soát yêu cầu, đặt logic nghiệp vụ quan trọng ở backend, kiểm thử các failure path, thiết kế dữ liệu nhất quán cho lịch hẹn/tư vấn, và chuẩn bị seed data phù hợp để E2E phản ánh đúng chất lượng implementation.

## 7.6 Hướng phát triển

**Future development / Hướng phát triển tương lai:** các hướng sau là đề xuất phát triển, không phải chức năng đã hoàn thiện hiện tại:

- Tích hợp provider Email/SMS vận hành thực tế cho thông báo, nhắc lịch và khôi phục mật khẩu.
- Tích hợp video consultation provider hoặc hạ tầng WebRTC phù hợp.
- Bổ sung lưu trữ đối tượng cho tệp đính kèm với kiểm soát quyền truy cập và an toàn tệp.
- Mở rộng báo cáo, biểu đồ và phân tích theo chuyên khoa, bác sĩ, trạng thái lịch hẹn và xu hướng tư vấn.
- Phát triển mobile client để hỗ trợ trải nghiệm đặt lịch, chat và nhận thông báo trên thiết bị di động.
- Mở rộng realtime bằng adapter/hạ tầng phù hợp khi số lượng phiên đồng thời tăng.
- Xem xét tích hợp với hệ thống y tế bên ngoài khi có yêu cầu thực tế và điều kiện pháp lý phù hợp.
- Bổ sung năng lực AI hỗ trợ phân loại câu hỏi hoặc tổng hợp thông tin tham khảo với giới hạn an toàn rõ ràng, không thay thế chẩn đoán hoặc tư vấn chuyên môn của bác sĩ.

## 7.7 Kết luận chung

Hệ thống đã đáp ứng mục tiêu chính của đề tài trong phạm vi tư vấn và quản lý lịch hẹn cốt lõi. Các hạn chế hiện tại được ghi nhận rõ để tránh nhầm lẫn giữa năng lực đã triển khai và hướng phát triển. Nền tảng hiện có đủ cơ sở để tiếp tục mở rộng theo hướng provider vận hành thực tế, mobile, mở rộng realtime, phân tích dữ liệu và tích hợp y tế trong các giai đoạn sau.

## Tài liệu tham khảo

Các tài liệu dưới đây là nguồn nội bộ thực tế của dự án, không thay thế cho danh mục tài liệu tham khảo học thuật nếu mẫu báo cáo của khoa yêu cầu bổ sung theo chuẩn riêng:

- `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`
- `docs/audit/final-srs-traceability.md`
- `docs/architecture/system-architecture.md`
- `docs/architecture/system-flow-diagram.md`
- `docs/report/diagram-selection/use-case-selection.md`
- `docs/report/diagram-selection/sequence-selection.md`
- `docs/report/diagram-selection/class-diagram-decision.md`
- `docs/testing/e2e-test-matrix.md`
- `docs/testing/final-e2e-results.md`
- `docs/audit/security-hardening-report.md`
