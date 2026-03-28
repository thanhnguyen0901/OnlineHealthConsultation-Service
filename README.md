# OnlineHealthConsultation-Service

Backend REST API cho hệ thống tư vấn sức khỏe trực tuyến, xây dựng bằng Node.js, Express, TypeScript, Prisma và MySQL.

## Công nghệ

- Node.js + Express
- TypeScript
- Prisma ORM
- MySQL
- Zod validation
- JWT + bcrypt
- cookie-parser, cors, helmet, rate-limit
- Jest

## Chức năng chính

- Authentication bằng access token + refresh token
- Authorization theo role: `PATIENT`, `DOCTOR`, `ADMIN`
- Quản lý hồ sơ bệnh nhân/bác sĩ
- Hỏi đáp giữa bệnh nhân và bác sĩ
- Đặt lịch, cập nhật trạng thái lịch hẹn
- Đánh giá bác sĩ
- Moderation nội dung
- Báo cáo thống kê

## Cấu trúc thư mục

```text
OnlineHealthConsultation-Service/
├── prisma/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── tests/
├── package.json
└── README.md
```

## API base

- Base URL: `http://localhost:4000/api`
- Health check: `GET /api/health`

## Authentication & Authorization

### Token model
- `accessToken`: gửi trong header `Authorization: Bearer <token>`.
- `refreshToken`: lưu trong `httpOnly cookie`.

### Auth endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh` (đọc refresh token từ cookie)
- `POST /api/auth/logout` (đọc refresh token từ cookie)
- `GET /api/auth/me`

### Role-based routes
- `PATIENT`: `/api/patients/**`
- `DOCTOR`: `/api/doctors/**`
- `ADMIN`: `/api/admin/**`
- `ADMIN | DOCTOR`: `/api/reports/**`

## Cài đặt và chạy local

### Yêu cầu
- Node.js 18+
- Docker + Docker Compose (khuyến nghị)

### Chạy nhanh

```bash
npm install
docker-compose up -d
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Service chạy tại: `http://localhost:4000`

## Cấu hình môi trường

Copy `.env.example` thành `.env` rồi cập nhật giá trị phù hợp.

Các biến quan trọng:
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRE` (default: `15m`)
- `JWT_REFRESH_EXPIRE` (default: `7d`)
- `CORS_ORIGIN`
- `COOKIE_SECURE`, `COOKIE_SAMESITE`

## Database

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Scripts

```bash
npm run dev
npm run build
npm start
npm run test
npm run prisma:studio
```

## Testing

```bash
npm run test
```

Một số test auth nằm tại `tests/auth-*.test.ts`.

## Ghi chú tích hợp frontend

Frontend (`OnlineHealthConsultation-Web`) gọi API qua `/api/...` và dùng cơ chế refresh token qua cookie.
