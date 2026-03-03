# 🚀 Quick Start Guide

Hướng dẫn chạy Backend API trên **Windows** và **macOS**.

---

## 📋 Yêu cầu

- ✅ Node.js 18+ đã cài đặt
- ✅ Docker Desktop đang chạy
- ✅ Đã clone project và mở thư mục `OnlineHealthConsultation-Service`

---

## 🗄️ PHẦN 1: Setup Database

### Bước 1: Cài đặt dependencies

```bash
npm install
```

### Bước 2: Chạy Docker và Init Database

```bash
# Dừng và xóa database cũ (nếu có)
docker compose down -v

# Khởi động MySQL container
docker compose up -d

# Chờ MySQL khởi động hoàn tất
# macOS / Linux:
sleep 15
# Windows (Command Prompt):
# timeout /t 15 /nobreak
```

### Bước 3: Chạy Migration và Seed Data

```bash
# Chạy đầy đủ: generate → migrate → triggers → seed
npm run db:setup
```

> `db:setup` tự động chạy: kiểm tra init.sql → tạo Prisma Client → migrate → áp dụng MySQL triggers → seed data.

✅ **Database đã sẵn sàng!**

---

## 🚀 PHẦN 2: Run Backend

```bash
# Chạy development server (hot reload)
npm run dev
```

✅ **Server chạy tại:** http://localhost:4000

---

## 🔍 Kiểm Tra

### Test API hoạt động

```bash
# Health check
curl http://localhost:4000/api/health

# Lấy danh sách chuyên khoa
curl http://localhost:4000/api/specialties
```

### Xem Database (GUI)

```bash
npm run prisma:studio
```

Truy cập: http://localhost:5555

---

## 👥 Test Accounts (Sau khi seed)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@healthcare.com | Admin@123 |
| **Doctor** | nguyen.van.hung@healthcare.com | Doctor@123 |
| **Doctor** | tran.thi.lan@healthcare.com | Doctor@123 |
| **Doctor** | le.van.minh@healthcare.com | Doctor@123 |
| **Doctor** | pham.thi.nga@healthcare.com | Doctor@123 |
| **Patient** | vo.van.nam@gmail.com | Patient@123 |
| **Patient** | hoang.thi.thao@gmail.com | Patient@123 |
| **Patient** | nguyen.van.khanh@gmail.com | Patient@123 |

---

## 🔄 Reset Database (Khi cần làm lại từ đầu)

```bash
# Cách 1: Script tự động với confirmation prompt (macOS / Linux)
bash reset-db.sh

# Cách 2: Dùng npm script (cross-platform)
npm run db:reset
```

---

## 📝 Scripts Thường Dùng

```bash
# Database
npm run prisma:studio         # Mở database GUI (http://localhost:5555)
npm run prisma:migrate        # Tạo và chạy migration mới (dev)
npm run prisma:migrate:deploy # Áp dụng migrations (production/CI)
npm run db:setup              # Setup database (check → generate → migrate → triggers → seed)
npm run db:check              # CI guard: verify init.sql không chứa table DDL
npm run db:reset              # Reset toàn bộ database + seed lại (cross-platform)

# Development
npm run dev                   # Chạy server với hot reload
npm run build                 # Build production
npm start                     # Chạy production server

# Docker
docker compose up -d          # Start database
docker compose down           # Stop database
docker compose down -v        # Stop và xóa data
docker ps                     # Xem containers đang chạy
docker logs health_consultation_db  # Xem logs MySQL
```

---

## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi: Port 3306 đã được dùng

```bash
# macOS / Linux — tìm process đang dùng port 3306:
lsof -i :3306

# Windows — tìm process đang dùng port 3306:
netstat -ano | findstr :3306
```

Dừng MySQL local hoặc đổi port trong `docker-compose.yml`.

### Lỗi: Docker container không start

```bash
# Kiểm tra logs
docker logs health_consultation_db

# Restart Docker Desktop và thử lại
docker compose down
docker compose up -d
```

### Lỗi: Prisma Client không tìm thấy

```bash
# Tạo lại Prisma Client
npx prisma generate
```

---

## 🌐 API Endpoints

- **Root:** http://localhost:4000
- **Health Check:** http://localhost:4000/api/health
- **Specialties (Public):** http://localhost:4000/api/specialties
- **Featured Doctors (Public):** http://localhost:4000/api/doctors/featured
- **Auth:** http://localhost:4000/api/auth/login
- **Admin:** http://localhost:4000/api/admin/*
- **Doctor:** http://localhost:4000/api/doctor/*
- **Patient:** http://localhost:4000/api/patient/*

---

## ✅ Checklist Hoàn Thành

- [ ] Docker Desktop đang chạy
- [ ] `npm install` thành công
- [ ] MySQL container running: `docker ps`
- [ ] Database có tables: `npm run prisma:studio`
- [ ] Server chạy: http://localhost:4000
- [ ] API health OK: http://localhost:4000/api/health
- [ ] Login thành công với admin@healthcare.com

---

**Docs chi tiết:**
- [README.md](./README.md) - Full documentation
