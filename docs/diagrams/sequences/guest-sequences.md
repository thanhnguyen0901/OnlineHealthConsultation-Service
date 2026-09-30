# Guest Sequence Diagrams

Tài liệu này mô tả các sequence diagram cho luồng **Guest User** dựa trên SRS cập nhật và source implementation hiện tại.

Nguồn đã đối chiếu:

- `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`
- `OnlineHealthConsultation-Web/src/pages/HomePage.tsx`
- `OnlineHealthConsultation-Web/src/features/public/apis/public.api.ts`
- `OnlineHealthConsultation-Web/src/features/public/pages/SpecialtyListPage.tsx`
- `OnlineHealthConsultation-Web/src/features/public/pages/DoctorListPage.tsx`
- `OnlineHealthConsultation-Web/src/features/public/pages/DoctorDetailPage.tsx`
- `OnlineHealthConsultation-Web/src/features/public/pages/publicPageUtils.ts`
- `src/modules/discovery/discovery.controller.ts`
- `src/modules/discovery/discovery.service.ts`
- `src/main.ts`

Backend NestJS dùng global prefix `/api`, vì vậy các public endpoint thực tế là `/api/public/...`. Diagram chỉ thể hiện các participant cần thiết cho từng flow, không đưa vào guard/helper/class nội bộ không liên quan.

## 1. View Public Home

Flow này tương ứng `UC-G-01` và implementation trong `HomePage`. Khi guest vào trang chủ, React UI tải song song public home metadata, danh sách bác sĩ nổi bật và danh sách chuyên khoa.

```mermaid
sequenceDiagram
  autonumber
  actor Guest
  participant UI as React UI - HomePage
  participant API as API Client - public.api
  participant Controller as NestJS Controller - DiscoveryController
  participant Service as Service - DiscoveryService
  participant DB as Prisma/PostgreSQL

  Guest->>UI: Open public home (/)
  UI->>API: getPublicHome()
  API->>Controller: GET /api/public/home
  Controller->>Service: getHome()
  Service-->>Controller: service/version/status
  Controller-->>API: 200 OK
  API-->>UI: normalized home payload

  par Featured doctors
    UI->>API: getPublicDoctors(page=1, limit=6)
    API->>Controller: GET /api/public/doctors?page=1&limit=6
    Controller->>Service: listPublicDoctors(query)
    Service->>DB: doctorProfile.findMany + count
    Service->>DB: rating.aggregate per doctor
    DB-->>Service: doctors, total, rating summaries
    Service-->>Controller: paged public doctors
    Controller-->>API: 200 OK
    API-->>UI: normalized doctor cards
  and Specialties preview
    UI->>API: getPublicSpecialties()
    API->>Controller: GET /api/public/specialties
    Controller->>Service: listPublicSpecialties()
    Service->>DB: specialty.findMany(isActive=true)
    DB-->>Service: active specialties
    Service-->>Controller: specialties
    Controller-->>API: 200 OK
    API-->>UI: normalized specialties
  end

  UI-->>Guest: Render hero, specialty preview, featured doctors
```

## 2. Browse Specialties

Flow này tương ứng `UC-G-02`. Trang danh sách chuyên khoa gọi public API để lấy các specialty đang active và hiển thị cho guest.

```mermaid
sequenceDiagram
  autonumber
  actor Guest
  participant UI as React UI - SpecialtyListPage
  participant API as API Client - public.api
  participant Controller as NestJS Controller - DiscoveryController
  participant Service as Service - DiscoveryService
  participant DB as Prisma/PostgreSQL

  Guest->>UI: Open /specialties
  UI->>API: getPublicSpecialties()
  API->>Controller: GET /api/public/specialties
  Controller->>Service: listPublicSpecialties()
  Service->>DB: specialty.findMany(where isActive=true, orderBy nameEn)
  DB-->>Service: active specialty rows
  Service-->>Controller: specialties
  Controller-->>API: 200 OK
  API-->>UI: PublicSpecialty[]
  UI-->>Guest: Render specialty list

  opt Guest chooses a specialty
    Guest->>UI: Click "Find doctors"
    UI-->>Guest: Navigate to /doctors?specialtyId={id}
  end
```

## 3. Search Doctor

Flow này tương ứng `UC-G-03` và `UC-G-05`. Trang doctors đọc `keyword` và `specialtyId` từ UI/query string, debounce khoảng 250ms rồi gọi public doctor discovery endpoint.

```mermaid
sequenceDiagram
  autonumber
  actor Guest
  participant UI as React UI - DoctorListPage
  participant API as API Client - public.api
  participant Controller as NestJS Controller - DiscoveryController
  participant Service as Service - DiscoveryService
  participant DB as Prisma/PostgreSQL

  Guest->>UI: Open /doctors or update filters
  UI->>UI: Sync keyword/specialtyId to URL query
  UI->>API: getPublicDoctors(keyword, specialtyId, page=1, limit=12)
  API->>Controller: GET /api/public/doctors
  Controller->>Service: listPublicDoctors(query)
  Service->>DB: doctorProfile.findMany(approved, active, filters)
  Service->>DB: doctorProfile.count(same filters)
  DB-->>Service: doctor rows and total
  loop For each returned doctor
    Service->>DB: rating.aggregate(doctorId, status=VISIBLE)
    DB-->>Service: avgRating, ratingCount
  end
  Service-->>Controller: { data, meta }
  Controller-->>API: 200 OK
  API-->>UI: normalized doctor list
  UI-->>Guest: Render matching doctors or empty state
```

## 4. View Doctor Detail

Flow này tương ứng `UC-G-04`. Guest mở trang chi tiết bác sĩ, frontend gọi public detail endpoint. Backend chỉ trả bác sĩ đang active, được duyệt và có user active/chưa bị xóa mềm.

```mermaid
sequenceDiagram
  autonumber
  actor Guest
  participant UI as React UI - DoctorDetailPage
  participant API as API Client - public.api
  participant Controller as NestJS Controller - DiscoveryController
  participant Service as Service - DiscoveryService
  participant DB as Prisma/PostgreSQL

  Guest->>UI: Open /doctors/{doctorId}
  UI->>API: getPublicDoctorDetail(doctorId)
  API->>Controller: GET /api/public/doctors/{doctorId}
  Controller->>Service: getPublicDoctorById(doctorId)
  Service->>DB: doctorProfile.findFirst(approved, active, user active)

  alt Doctor exists and is public
    DB-->>Service: doctor with user and specialties
    Service->>DB: rating.aggregate(doctorId, status=VISIBLE)
    DB-->>Service: avgRating, ratingCount
    Service-->>Controller: public doctor detail
    Controller-->>API: 200 OK
    API-->>UI: normalized doctor detail
    UI-->>Guest: Render profile, specialties, schedule, actions
  else Doctor missing or not public
    DB-->>Service: null
    Service-->>Controller: null
    Controller-->>API: 404 Not Found
    API-->>UI: error
    UI-->>Guest: Render doctor not found/error state
  end
```

## 5. Attempt Protected Action -> Authentication Redirect

Flow này tương ứng `UC-G-06`. Trong implementation hiện tại, guest không gọi thẳng protected backend endpoint khi bấm đặt lịch hoặc gửi câu hỏi từ trang public. React dùng `redirectGuestToLogin()` để chuyển sang `/login` kèm `intent`, `doctorId` và `state.returnUrl`.

```mermaid
sequenceDiagram
  autonumber
  actor Guest
  participant UI as React UI - DoctorListPage or DoctorDetailPage
  participant Router as React Router
  participant AuthUI as React UI - LoginPage

  Guest->>UI: Click "Book appointment" or "Ask question"
  UI->>UI: Build query params intent={book|ask}, doctorId={id}
  UI->>Router: navigate('/login?intent=...&doctorId=...', state.returnUrl)
  Router-->>AuthUI: Render LoginPage
  AuthUI-->>Guest: Show authentication form

  Note over UI,AuthUI: Protected appointment/question routes are not entered until the guest authenticates.

  opt Guest manually opens a protected route
    Guest->>Router: Open /patient/appointments/new or /patient/questions/new
    Router->>Router: AuthGuard checks isAuthenticated=false
    Router-->>AuthUI: Navigate to /login with returnUrl
    AuthUI-->>Guest: Show authentication form
  end
```

## Notes

- Public discovery flows đi qua `DiscoveryController` và `DiscoveryService`.
- `/api/public/home` không truy cập database; trang chủ vẫn tải thêm doctors và specialties để render nội dung public.
- Search doctor và doctor detail có truy vấn rating summary từ bảng `Rating` thông qua Prisma aggregate.
- Protected action redirect hiện là hành vi frontend chủ động; backend protected endpoints vẫn được bảo vệ bằng `JwtAuthGuard`/`RolesGuard`, nhưng không phải luồng chính khi guest bấm CTA public.
