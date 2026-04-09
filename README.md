# Online Health Consultation Platform

Hệ thống Backend (REST API & Real-time WebSockets) cho Nền tảng Tư vấn Sức khỏe Trực tuyến, được xây dựng theo kiến trúc **Modular Monolith** dựa trên **NestJS** theo chuẩn tài liệu SRS v1.0.

## 🛠 Tech Stack (Kiến trúc chuẩn)

- **Framework:** NestJS (Node.js & TypeScript)
- **Database:** PostgreSQL (Triển khai local qua Docker)
- **ORM:** Prisma
- **Validation:** class-validator & class-transformer
- **Authentication:** JWT, băm mật khẩu `bcryptjs`
- **Tài liệu API:** Swagger (`@nestjs/swagger`)
- **Giao tiếp bất đồng bộ:** Event Emitter (`@nestjs/event-emitter`)

## 📦 Kiến trúc Module (Domain-Driven)

Toàn bộ hệ thống được chia thành các Module độc lập đại diện cho từng Domain của nghiệp vụ:

- **`IdentityModule`**: Đăng ký, đăng nhập, bảo mật JWT, cấp quyền User.
- **`DoctorModule`**: Hồ sơ Bác sĩ (DoctorProfile) và Danh mục Chuyên khoa (Specialty).
- **`PatientModule`**: Hồ sơ Bệnh nhân (PatientProfile).
- **`AppointmentModule`**: Quản lý Lịch hẹn (đặt lịch, hủy lịch, bắt trùng lịch).
- **`QuestionModule`**: Diễn đàn Hỏi đáp sức khỏe tự do (Hỏi - Đáp - Duyệt).
- **`ConsultationModule`**: Quản lý phiên tư vấn, Đơn thuốc điện tử, Đánh giá bác sĩ.
- **`NotificationModule`**: Xử lý logic gửi thông báo đa kênh nội bộ.
- **`ReportingModule`**: Báo cáo thống kê dành cho Admin.

## 🚀 Cài đặt và Khởi động

### Yêu cầu
- Node.js 18+
- Docker & Docker Compose (cho PostgreSQL)

### Thiết lập Local

1. **Khởi chạy Cơ sở dữ liệu (PostgreSQL)**
   ```bash
   docker-compose up -d
   ```

2. **Cài đặt thư viện**
   ```bash
   npm install
   ```

3. **Database Migration**
   Chạy lệnh sau để đồng bộ Prisma Schema xuống PostgreSQL:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Khởi chạy Server đồ án**
   ```bash
   npm run start:dev
   ```

Server sẽ khởi chạy tại cổng **`3000`** (hoặc `PORT` cấu hình trong `.env`).
Tài liệu **Swagger UI** (OpenAPI) có thể được truy cập trực tiếp tại:  
👉 **`http://localhost:3000/api/docs`**

## 🔐 Authentication & Authorization

- Hệ thống hỗ trợ **4 Roles** định trước: `GUEST`, `PATIENT`, `DOCTOR`, `ADMIN`.
- Truyền tải Token qua dạng `Authorization: Bearer <AccessToken>`.
- Các APIs đều được gắn Header Auth mô phỏng trực tiếp từ Swagger UI.
- Thao tác đăng ký tài khoản (Register) sẽ tự động tạo `Profile` rỗng tương ứng với dạng tài khoản đó sử dụng **Prisma Transaction**. Mọi khoá chính (ID) đều được ứng dụng tạo bằng chuẩn **UUIDv7**.
