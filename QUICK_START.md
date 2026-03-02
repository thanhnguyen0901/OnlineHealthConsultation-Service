# 🚀 Quick Start Guide - Windows

Hướng dẫn chạy Backend API trên Windows.

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
docker-compose down -v

# Khởi động MySQL container
docker-compose up -d

# Chờ MySQL khởi động hoàn tất
timeout /t 15 /nobreak
```

### Bước 3: Chạy Migration và Seed Data

```bash
# Tạo Prisma Client
npx prisma generate

# Chạy migrations để tạo tables trong database
npx prisma migrate deploy

# Seed data mẫu (tạo users, specialties, questions...)
npx ts-node prisma/seed.ts
```

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
# Cách 1: Dùng script tự động
reset-db.bat

# Cách 2: Chạy từng lệnh thủ công
docker-compose down -v
docker-compose up -d
timeout /t 15 /nobreak
npx prisma generate
npx prisma migrate deploy
npx ts-node prisma/seed.ts
```

---

## 📝 Scripts Thường Dùng

```bash
# Database
npm run prisma:studio        # Mở database GUI (http://localhost:5555)
npm run prisma:migrate       # Tạo và chạy migration mới (dev)
npm run prisma:migrate:deploy # Áp dụng migrations (production/CI)
npm run db:setup             # Setup database (generate + migrate:deploy + seed)
npm run db:reset             # Reset database + tự động seed (prisma migrate reset)

# Development
npm run dev               # Chạy server với hot reload
npm run build            # Build production
npm start                # Chạy production server

# Docker
docker-compose up -d      # Start database
docker-compose down       # Stop database
docker-compose down -v    # Stop và xóa data
docker ps                # Xem containers đang chạy
docker logs health_consultation_db  # Xem logs MySQL
```

---

## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi: Port 3306 đã được dùng

```bash
# Tìm process đang dùng port 3306
netstat -ano | findstr :3306

# Tắt MySQL service của Windows hoặc đổi port trong docker-compose.yml
```

### Lỗi: Docker container không start

```bash
# Kiểm tra logs
docker logs health_consultation_db

# Restart Docker Desktop và thử lại
docker-compose down
docker-compose up -d
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
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Hướng dẫn chi tiết về database
- [README.md](./README.md) - Full documentation
