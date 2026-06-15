# Backend Must Do Implementation Summary

## Endpoint đã thêm/cập nhật

| Endpoint | Trạng thái | Quyền truy cập | Request chính | Response chính | FE screen sử dụng |
|---|---|---|---|---|---|
| `GET /appointments/:id` | Added | `PATIENT`, `DOCTOR`, `ADMIN` | Path param `id` | Appointment detail gồm `id`, `patient`, `doctor`, `scheduledAt`, `durationMinutes`, `status`, `reason`, `notes`, `createdAt`, `updatedAt`, optional `session`, `rating` | Patient appointment detail, Doctor appointment detail, Admin appointment detail/modal |
| `GET /appointments/mine?status=&fromDate=&toDate=` | Updated | `PATIENT` | Optional query `status`, `fromDate`, `toDate` | Patient-owned appointment list, giữ response shape cũ | Patient appointments |
| `GET /appointments/doctor/me?status=&fromDate=&toDate=` | Updated | `DOCTOR` | Optional query `status`, `fromDate`, `toDate` | Doctor-owned appointment list, giữ response shape cũ | Doctor schedule/dashboard |
| `GET /admin/appointments?status=&fromDate=&toDate=` | Updated | `ADMIN` | Optional query `status`, `fromDate`, `toDate` | Admin appointment list, giữ response shape cũ | Admin appointment list |
| `GET /consultations/:appointmentId/result` | Added | `PATIENT`, `DOCTOR`, `ADMIN` | Path param `appointmentId` | `appointment`, `consultation`, `prescription`; `prescription` là `null` nếu chưa có | Consultation result, Prescription page, Appointment outcome panel |
| `GET /public/doctors` | Updated | Public | Existing query `keyword`, `specialtyId`, `page`, `limit` | Existing doctor list plus `avgRating`, `ratingCount` | Public doctor discovery/list card |
| `GET /public/doctors/:doctorId` | Updated | Public | Path param `doctorId` | Existing doctor detail plus `avgRating`, `ratingCount` | Public doctor detail |
| `GET /admin/doctors?approvalStatus=&isActive=&keyword=&page=&limit=` | Added | `ADMIN` | Optional query `approvalStatus`, doctor profile `isActive`, `keyword`, `page`, `limit` | Paginated doctors with user basic info, doctor profile, specialties, `approvalStatus`, `isActive` | Admin doctor approval/list screen |
| `PATCH /admin/doctors/:doctorId/approval` | Verified existing | `ADMIN` | Body `approvalStatus`, optional `isActive` | Updated doctor profile with user and specialties | Admin doctor approval action |
| `GET /ratings/mine` | Verified existing | `PATIENT` | None | Patient rating history with doctor basic info | Patient rating history |
| `GET /ratings/doctor/me` | Added | `DOCTOR` | None | Visible ratings for current doctor with appointment and patient basic info | Doctor rating/review dashboard |

## Security and data rules

- Protected endpoints use existing `JwtAuthGuard`, `RolesGuard`, and `@Roles` pattern.
- Appointment detail and consultation result enforce ownership in service methods:
  - Patient can only access own appointment/result.
  - Doctor can only access assigned appointment/result.
  - Admin can access admin-supported detail/result views.
- Public doctor queries keep existing public availability filters: doctor approved, doctor active, user active, `deletedAt = null`.
- User data is returned through `select`/safe includes; no `passwordHash`, `refreshTokenHash`, `tokenHash`, access token, or refresh token is returned.
- Appointment and consultation history intentionally preserve historical data instead of filtering out inactive/deleted participants too aggressively.

## Test case liên quan

| Scenario | Expected |
|---|---|
| No token calls protected appointment/detail/result/admin endpoints | `401` |
| Patient calls `GET /appointments/:id` for own appointment | `200` with appointment detail |
| Patient calls `GET /appointments/:id` for another patient | `403` |
| Doctor calls `GET /appointments/:id` for assigned appointment | `200` |
| Doctor calls `GET /appointments/:id` outside scope | `403` |
| Admin calls `GET /admin/doctors` | `200` with paginated doctor list |
| Admin doctor list filters by `approvalStatus`, `isActive`, `keyword` | Only matching doctors returned |
| Consultation result exists without prescription | `200` with `prescription: null` |
| Consultation result exists with prescription | `200` with prescription and `items` |
| Public doctor has visible and hidden ratings | `avgRating` and `ratingCount` only count `VISIBLE` ratings |
| Response payload inspection | No `passwordHash`, `refreshTokenHash`, `tokenHash`, token fields |

## Future Enhancement chưa làm

- Email verification.
- Gửi email thật qua SMTP/SendGrid.
- SMS thật.
- Video call thật WebRTC/Jitsi/Agora.
- File upload.
- Rate limiting.
- Full audit log endpoint/UI.
- Full pagination toàn hệ thống.
- NO_SHOW workflow chi tiết.
- Doctor cancel appointment workflow.
- Patient close question workflow.
- Password change.
- Notification provider/retry nâng cao.

## Lệnh đã chạy

```bash
source ~/.nvm/nvm.sh && npm run build
source ~/.nvm/nvm.sh && npm test
```

## Kết quả build/test thật

- `npm run build`: Pass.
- `npm test`: Pass theo cấu hình hiện tại; Jest chạy với `--passWithNoTests` và báo `No tests found, exiting with code 0`.
- Ghi chú môi trường: `npm`/`node` không có sẵn trong PATH mặc định của tool, nên validation được chạy sau khi source `~/.nvm/nvm.sh`.
