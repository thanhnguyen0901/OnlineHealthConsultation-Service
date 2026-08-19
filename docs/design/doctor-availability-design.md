# Doctor Availability Design

Tài liệu này thiết kế mô hình availability nhỏ nhất để thỏa SRS cho các yêu cầu liên quan đến doctor schedule, doctor discovery, appointment availability, appointment booking và duplicate/conflict prevention.

Phạm vi của tài liệu là thiết kế. Không implement code trong bước này.

## 1. Hiện trạng đã kiểm tra

### SRS liên quan

SRS yêu cầu:

* Hồ sơ bác sĩ có thông tin lịch làm việc.
* Doctor discovery/detail hiển thị lịch khả dụng khi được công khai.
* Patient chọn ngày và khung giờ tư vấn còn khả dụng.
* System kiểm tra tính hợp lệ của dữ liệu và tính khả dụng của khung giờ.
* System ngăn đặt trùng lịch cho cùng bác sĩ và cùng khung giờ.
* System tránh mất nhất quán dữ liệu trong thao tác đặt lịch và cập nhật lịch hẹn.

### Source hiện tại

| Area | Hiện trạng |
| --- | --- |
| Prisma schema | `DoctorProfile.schedule` là `Json?`; `scheduleUpdatedAt` đã có. `Appointment` có `scheduledAt`, `durationMinutes`, `status` và index theo `doctorId/scheduledAt`, `patientId/scheduledAt`. |
| Doctor schedule backend | `UpdateDoctorScheduleDto.schedule?: unknown[]`; `DoctorService.updateMySchedule()` lưu JSON trực tiếp. |
| Doctor schedule frontend | `SchedulePage` và `ScheduleTable` đang dùng slot theo ngày cụ thể: `{ date, startTime, endTime, available }`. |
| Discovery API | Public doctor list/detail filter `isActive`, `APPROVED`, user active. Detail hiện chưa include `schedule`. |
| AppointmentService | `createAppointment()` và `rescheduleAppointment()` đã check doctor active/approved và overlap với appointment có status `PENDING_CONFIRMATION`, `CONFIRMED`. Chưa check `DoctorProfile.schedule`. |
| Appointment DTO/controller | `CreateAppointmentDto` nhận `doctorId`, `scheduledAt`, optional `durationMinutes`, `reason`, `notes`; `RescheduleAppointmentDto` nhận `scheduledAt`. Chưa có availability endpoint. |
| BookAppointmentPage | Time slots đang hard-code `08:00` đến `16:30`; không fetch availability theo doctor/date. |
| patient.api | `bookAppointment()` gọi `POST /appointments`; chưa có API lấy available slots. |

## 2. Quyết định thiết kế

### 2.1 Không đổi schema ở giai đoạn này

Thiết kế sử dụng lại `DoctorProfile.schedule Json?` thay vì tạo bảng mới. Lý do:

* SRS chỉ yêu cầu lịch làm việc và khung giờ khả dụng, chưa yêu cầu recurring schedule phức tạp, override nhiều tầng, nghỉ lễ hoặc multi-location.
* Frontend doctor schedule hiện đã lưu danh sách slot theo ngày cụ thể.
* Appointment đã có `scheduledAt`, `durationMinutes` và index phù hợp để tính conflict.
* Tạo bảng mới sẽ kéo theo migration, admin tooling và data migration không cần thiết cho bước nhỏ nhất.

Schema change chỉ nên cân nhắc sau này nếu cần recurring weekly schedule dài hạn, audit lịch thay đổi chi tiết, hoặc rule nghỉ/bận ngoài appointment.

### 2.2 Canonical schedule format

Trong phạm vi hiện tại, `DoctorProfile.schedule` được chuẩn hóa thành mảng `DoctorScheduleSlot[]`:

```ts
type DoctorScheduleSlot = {
  date: string;       // YYYY-MM-DD theo timezone hệ thống
  startTime: string;  // HH:mm, 24-hour
  endTime: string;    // HH:mm, 24-hour
  available: boolean; // true = làm việc, false = khóa slot
};
```

Ví dụ:

```json
[
  { "date": "2026-09-01", "startTime": "08:00", "endTime": "12:00", "available": true },
  { "date": "2026-09-01", "startTime": "13:00", "endTime": "17:00", "available": true },
  { "date": "2026-09-02", "startTime": "08:00", "endTime": "10:00", "available": false }
]
```

Quy ước:

* Chỉ các slot `available === true` mới sinh appointment slots.
* Slot có `available === false` được xem là blocked working period hoặc legacy marker; không sinh slot book được.
* Nếu `schedule` rỗng hoặc `null`, doctor không có slot khả dụng để booking.
* Các slot trùng hoặc giao nhau trong cùng ngày được merge nội bộ trước khi sinh availability.
* `endTime` là exclusive boundary. Ví dụ slot `08:00-12:00`, duration 60 phút cho phép start `11:00`, không cho phép start `11:30` nếu appointment kết thúc `12:30`.

## 3. Business rules

1. Chỉ doctor `isActive === true`, `approvalStatus === APPROVED`, và user active mới có thể được hiển thị/đặt lịch.
2. Patient chỉ được đặt lịch vào slot được backend trả về là `available`.
3. Backend không tin availability từ frontend. `POST /appointments` phải tự kiểm tra lại doctor schedule và conflicts trong transaction.
4. Reschedule của doctor phải dùng cùng rule với booking.
5. Appointment status chiếm chỗ gồm:
   * `PENDING_CONFIRMATION`
   * `CONFIRMED`
6. Appointment status không chiếm chỗ gồm:
   * `CANCELLED`
   * `COMPLETED`
   * `NO_SHOW`
7. Appointment duration mặc định lấy từ `APPOINTMENT_DURATION_MINUTES`, fallback `60`.
8. Duration tối thiểu giữ theo DTO hiện tại: `15` phút.
9. Slot step mặc định là `30` phút, cấu hình bằng `APPOINTMENT_SLOT_STEP_MINUTES`, fallback `30`.
10. Appointment không được bắt đầu trong quá khứ.
11. Appointment phải nằm trọn trong một working slot. Không cho phép bắt đầu trong slot này và kết thúc sau `endTime`.
12. Doctor conflict và patient conflict đều được kiểm tra bằng overlap interval: `newStart < existingEnd && newEnd > existingStart`.
13. Nếu doctor đổi schedule sau khi đã có appointment, appointment hiện hữu không bị tự động hủy. Schedule mới chỉ áp dụng cho booking/reschedule mới.
14. Nếu reschedule một appointment, conflict query phải loại trừ chính appointment đó.

## 4. Proposed API contract

### 4.1 Get doctor available slots

Endpoint đề xuất:

```http
GET /api/public/doctors/:doctorId/availability?date=YYYY-MM-DD&durationMinutes=60
```

Lý do đặt dưới `/public`:

* Guest và Patient đều có thể xem doctor detail/availability trước khi quyết định đăng nhập hoặc đặt lịch.
* Endpoint không trả dữ liệu nhạy cảm, chỉ trả slot khả dụng của doctor public.
* Backend vẫn chỉ cho booking qua protected `POST /appointments`.

Query params:

| Param | Required | Type | Rule |
| --- | --- | --- | --- |
| `date` | yes | `YYYY-MM-DD` | Ngày theo timezone hệ thống. |
| `durationMinutes` | no | integer | Mặc định `APPOINTMENT_DURATION_MINUTES`; min `15`; nên giới hạn max `240`. |

Response:

```json
{
  "doctorId": "01950000-0000-7000-8002-000000000001",
  "date": "2026-09-01",
  "timezone": "Asia/Ho_Chi_Minh",
  "durationMinutes": 60,
  "slotStepMinutes": 30,
  "slots": [
    {
      "start": "2026-09-01T01:00:00.000Z",
      "end": "2026-09-01T02:00:00.000Z",
      "label": "08:00",
      "available": true
    }
  ]
}
```

Error cases:

| Case | HTTP | Message |
| --- | --- | --- |
| Doctor không tồn tại hoặc không public | `404` | `Doctor not found or not publicly available` |
| `date` invalid | `400` | `Invalid availability date` |
| `durationMinutes` invalid | `400` | `Invalid appointment duration` |

### 4.2 Existing booking endpoint

Endpoint giữ nguyên:

```http
POST /api/appointments
```

Request giữ nguyên:

```json
{
  "doctorId": "01950000-0000-7000-8002-000000000001",
  "scheduledAt": "2026-09-01T01:00:00.000Z",
  "durationMinutes": 60,
  "reason": "Follow-up consultation",
  "notes": "Optional notes"
}
```

Thay đổi hành vi backend:

* Trước khi tạo appointment, service kiểm tra `scheduledAt + duration` có nằm trong schedule slot khả dụng của doctor hay không.
* Sau đó kiểm tra doctor/patient conflicts trong cùng transaction.
* Nếu không hợp lệ, trả `400`.

### 4.3 Existing reschedule endpoint

Endpoint giữ nguyên:

```http
PATCH /api/appointments/:id/reschedule
```

Request giữ nguyên:

```json
{
  "scheduledAt": "2026-09-01T02:00:00.000Z"
}
```

Thay đổi hành vi backend:

* Dùng `durationMinutes` hiện có của appointment.
* Kiểm tra schedule của doctor giống booking.
* Kiểm tra doctor/patient overlap, loại trừ chính appointment.

## 5. Algorithm

### 5.1 Convert date/time

Timezone hệ thống dùng một cấu hình duy nhất:

```text
APP_TIMEZONE=Asia/Ho_Chi_Minh
```

Nếu env không có, fallback `Asia/Ho_Chi_Minh` vì project đang phục vụ ngữ cảnh Việt Nam.

Quy tắc:

* Client gửi `date=YYYY-MM-DD` cho availability.
* Backend diễn giải `date + startTime/endTime` trong `APP_TIMEZONE`.
* Backend trả `start/end` dạng ISO UTC và `label` dạng `HH:mm`.
* Booking request `scheduledAt` tiếp tục là ISO datetime. Backend convert `scheduledAt` về local date/time của `APP_TIMEZONE` để so với schedule.

Khuyến nghị implementation:

* Nếu không thêm dependency, có thể viết helper nhỏ dựa trên `Intl.DateTimeFormat` để lấy local date/time parts.
* Nếu project chấp nhận dependency nhẹ, dùng `date-fns-tz` hoặc `luxon` để tránh lỗi DST/timezone edge cases. Với `Asia/Ho_Chi_Minh` không có DST, helper nội bộ vẫn đủ cho scope hiện tại.

### 5.2 Normalize schedule

Input: `doctor.schedule`

Steps:

1. Nếu schedule không phải array, trả `[]`.
2. Filter slot có:
   * `date` đúng format `YYYY-MM-DD`
   * `startTime`, `endTime` đúng format `HH:mm`
   * `endTime > startTime`
3. Chỉ giữ slot có `available === true`.
4. Chỉ giữ slot có `date` bằng selected date.
5. Sort theo `startTime`.
6. Merge các slot giao nhau hoặc liền kề để giảm lỗi duplicate.

### 5.3 Generate candidate slots

Input:

* normalized working intervals
* `durationMinutes`
* `slotStepMinutes`
* selected date
* timezone

For each working interval:

1. `candidateStart = interval.start`
2. While `candidateStart + duration <= interval.end`:
   * tạo candidate `{ start, end }`
   * `candidateStart += slotStepMinutes`
3. Loại candidate trong quá khứ nếu selected date là hôm nay.

Ví dụ:

* Working slot: `08:00-12:00`
* Duration: `60`
* Step: `30`
* Candidate starts: `08:00`, `08:30`, `09:00`, `09:30`, `10:00`, `10:30`, `11:00`

### 5.4 Remove existing appointments

Query appointments của doctor trong khoảng ngày local đó:

```ts
where: {
  doctorId,
  status: { in: [PENDING_CONFIRMATION, CONFIRMED] },
  scheduledAt: { gte: dayStartUtc, lt: nextDayStartUtc }
}
```

Sau đó loại candidate nếu overlap:

```ts
candidateStart < existingEnd && candidateEnd > existingStart
```

Với reschedule, thêm:

```ts
id: { not: appointment.id }
```

### 5.5 Check patient conflicts

Khi booking/reschedule, ngoài doctor conflicts phải query patient appointments đang active:

```ts
where: {
  patientId,
  status: { in: [PENDING_CONFIRMATION, CONFIRMED] },
  scheduledAt: { gte: windowStart, lte: windowEnd }
}
```

`windowStart/windowEnd` nên bao quanh new start/end theo duration tối đa hoặc theo ngày local để không scan toàn bộ bảng. Điều kiện quyết định vẫn dùng overlap exact.

## 6. Validation rules

### Schedule update validation

`UpdateDoctorScheduleDto` hiện chỉ `IsArray`. Nên bổ sung validation trong service hoặc DTO:

* `schedule` phải là array.
* Mỗi item phải có `date`, `startTime`, `endTime`, `available`.
* `date` đúng `YYYY-MM-DD`.
* `startTime/endTime` đúng `HH:mm`.
* `endTime > startTime`.
* Không lưu slot quá xa nếu cần giới hạn vận hành, ví dụ 180 ngày.
* Cho phép overlapping slots nhưng normalize/merge khi tính availability; tốt hơn là reject overlap trong cùng ngày để UI sạch hơn.

### Availability query validation

* `doctorId` phải là UUID.
* `date` phải là `YYYY-MM-DD`.
* `durationMinutes` là integer, min `15`, max `240`.
* Doctor phải public: `isActive`, `APPROVED`, user active.

### Booking validation

* Patient profile tồn tại.
* Doctor public và bookable.
* `scheduledAt` hợp lệ và ở tương lai.
* `durationMinutes` hợp lệ.
* Requested interval nằm trọn trong available working slot.
* Không overlap doctor active appointments.
* Không overlap patient active appointments.
* Tạo appointment trong `Serializable` transaction.

### Reschedule validation

* Doctor profile tồn tại.
* Appointment tồn tại và thuộc doctor.
* Appointment status là `PENDING_CONFIRMATION` hoặc `CONFIRMED`.
* `scheduledAt` mới hợp lệ và ở tương lai.
* Requested interval nằm trong schedule hiện tại của doctor.
* Không overlap doctor/patient active appointments, exclude appointment hiện tại.
* Ghi audit log và outbox event như hiện tại.

## 7. Edge cases

| Edge case | Expected behavior |
| --- | --- |
| Doctor không có schedule | Availability trả `slots: []`; booking/reschedule trả `400 Doctor is not available at this time`. |
| Schedule slot `available: false` | Không sinh available slot. |
| Slot cùng ngày bị overlap | Normalize merge hoặc reject khi lưu schedule; recommendation nhỏ nhất là merge khi tính availability. |
| Appointment nằm sát boundary | `existingEnd === candidateStart` hoặc `candidateEnd === existingStart` không tính là conflict. |
| Appointment duration dài hơn working slot | Không sinh candidate; booking trả `400`. |
| Patient chọn slot vừa bị người khác book | Availability UI cũ trở nên stale; backend transaction re-validates và trả conflict. |
| Doctor đổi schedule làm appointment cũ nằm ngoài lịch mới | Không hủy appointment cũ; appointment vẫn giữ lịch đã xác nhận. Chỉ booking/reschedule mới theo schedule mới. |
| Doctor deactivate/rejected sau khi patient xem slot | Booking re-check doctor public status và reject. |
| Ngày quá khứ | Availability trả empty hoặc `400`; booking/reschedule reject vì start <= now. |
| Timezone lệch client/server | Client dùng `start` ISO từ availability response để book; backend convert theo `APP_TIMEZONE` khi validate. |
| `durationMinutes` không truyền | Backend dùng default env; availability endpoint cũng dùng cùng default để UI và booking đồng bộ. |

## 8. Affected files

### Backend

| File | Thay đổi dự kiến |
| --- | --- |
| `src/modules/appointment/appointment.service.ts` | Thêm shared helpers: normalize schedule, build day bounds, generate slots, remove conflicts, assert availability. Dùng lại trong availability API, create và reschedule. |
| `src/modules/appointment/appointment.controller.ts` hoặc `src/modules/discovery/discovery.controller.ts` | Thêm endpoint public availability. Recommendation: đặt trong `DiscoveryController` với path `/public/doctors/:doctorId/availability`, service có thể gọi method từ `AppointmentService` hoặc tách `AvailabilityService`. |
| `src/modules/appointment/dto/create-appointment.dto.ts` | Giữ contract; có thể thêm max duration nếu cần. |
| `src/modules/appointment/dto/reschedule-appointment.dto.ts` | Giữ contract. |
| `src/modules/doctor/dto/update-doctor-schedule.dto.ts` | Bổ sung validation cho slot items hoặc validate trong `DoctorService`. |
| `src/modules/doctor/doctor.service.ts` | Validate schedule trước khi lưu; không cần đổi schema. |
| `src/modules/discovery/discovery.service.ts` | Include `schedule` trong doctor detail nếu muốn public detail tiếp tục hiển thị lịch làm việc; hoặc chỉ expose qua availability endpoint. |
| `prisma/schema.prisma` | Không đổi ở phase này. |

### Frontend

| File | Thay đổi dự kiến |
| --- | --- |
| `src/features/patient/apis/patient.api.ts` | Thêm `getDoctorAvailability(doctorId, date, durationMinutes?)`. |
| `src/features/patient/pages/BookAppointmentPage.tsx` | Bỏ hard-coded `timeSlots`; fetch slots khi doctor/date thay đổi; submit bằng `slot.start` ISO từ backend. |
| `src/features/doctor/pages/SchedulePage.tsx` | Giữ UI hiện tại; đảm bảo save schedule theo canonical slot format. |
| `src/features/doctor/components/ScheduleTable.tsx` | Có thể bổ sung validation/visual warning overlap nếu cần. |
| `src/features/public/apis/public.api.ts` | Có thể thêm public availability API nếu muốn dùng ở doctor detail. |
| `src/features/public/pages/DoctorDetailPage.tsx` | Optional: hiển thị lịch làm việc/availability theo endpoint mới. |

## 9. Implementation plan

### Step 1 - Backend schedule helpers

Tạo helper trong appointment domain, hoặc service riêng nhẹ `AvailabilityService` nếu muốn tránh làm `AppointmentService` quá lớn.

Functions đề xuất:

```ts
normalizeDoctorSchedule(schedule: Prisma.JsonValue, date: string): WorkingInterval[]
getAppointmentDuration(input?: number): number
getSlotStepMinutes(): number
getDayBounds(date: string, timezone: string): { dayStartUtc: Date; nextDayStartUtc: Date }
generateCandidateSlots(intervals, durationMinutes, slotStepMinutes): CandidateSlot[]
removeConflictingSlots(candidates, appointments): CandidateSlot[]
assertIntervalInsideWorkingSchedule(doctor, start, durationMinutes): void
assertNoAppointmentOverlap(tx, input): Promise<void>
```

### Step 2 - Public availability endpoint

Add DTO:

```ts
class DoctorAvailabilityQueryDto {
  date!: string;
  durationMinutes?: number;
}
```

Add route:

```http
GET /api/public/doctors/:doctorId/availability
```

Return available slots with UTC ISO start/end and local label.

### Step 3 - Reuse validation in booking

Inside `createAppointment()` transaction:

1. Load patient.
2. Load doctor with user and schedule.
3. Parse duration/start/end.
4. Call `assertDoctorCanBeBooked(doctor)`.
5. Call `assertIntervalInsideWorkingSchedule(doctor.schedule, start, duration)`.
6. Call `assertNoDoctorConflict()` and `assertNoPatientConflict()` using transaction client.
7. Create appointment/outbox/audit as hiện tại.

### Step 4 - Reuse validation in reschedule

Inside `rescheduleAppointment()`:

1. Load doctor and appointment.
2. Check ownership/status/future date.
3. Use existing appointment `durationMinutes`.
4. Call same schedule validation.
5. Call same conflict validation with `excludeAppointmentId`.
6. Update appointment/outbox/audit as hiện tại.

### Step 5 - Frontend booking

In `BookAppointmentPage`:

1. User chọn specialty.
2. User chọn doctor.
3. User chọn date.
4. Fetch availability with `doctorId`, local `YYYY-MM-DD`, default duration.
5. Show loading while fetching.
6. Show empty state if no slots.
7. Dropdown/radio uses backend slots:

```ts
{ label: slot.label, value: slot.start }
```

8. Submit `scheduledAt = selectedSlot.start`, không tự ghép local date/time nữa.
9. On booking success, refresh history or navigate như hiện tại.

### Step 6 - Tests

Backend tests nên cover:

* valid available slot.
* no schedule returns empty availability.
* outside working hours rejected.
* end boundary accepted/rejected correctly.
* doctor conflict rejected.
* patient conflict rejected.
* cancelled/completed appointments do not block.
* invalid doctor/inactive/unapproved doctor.
* reschedule uses same rule and excludes self.
* stale frontend slot rejected at booking time.

Frontend tests nên cover:

* availability fetch when doctor/date changes.
* loading and empty state.
* selected slot submits backend ISO `start`.
* hard-coded slot list removed.
* API error displayed.

## 10. Answers to required design questions

1. **How doctor working schedules are represented.**
   Sử dụng `DoctorProfile.schedule Json?` hiện có, chuẩn hóa thành array `{ date, startTime, endTime, available }`. Không đổi schema.

2. **How available time slots are calculated for a selected doctor/date.**
   Backend lọc schedule slots theo date và `available === true`, convert sang intervals theo `APP_TIMEZONE`, sinh candidate slots theo `durationMinutes` và `APPOINTMENT_SLOT_STEP_MINUTES`.

3. **How existing appointments remove unavailable slots.**
   Query appointments của doctor trong ngày có status `PENDING_CONFIRMATION` hoặc `CONFIRMED`; loại candidate nếu overlap với interval của appointment hiện hữu.

4. **How appointment duration affects overlap.**
   Candidate end = start + duration. Candidate chỉ hợp lệ nếu nằm trọn trong working interval và không overlap theo rule `start < existingEnd && end > existingStart`.

5. **How timezone is handled.**
   Backend dùng `APP_TIMEZONE`, fallback `Asia/Ho_Chi_Minh`, để diễn giải `date/startTime/endTime`. API trả UTC ISO `start/end` để frontend submit lại chính xác.

6. **How backend re-validates availability during booking.**
   `createAppointment()` tự parse `scheduledAt`, duration, kiểm tra doctor public, kiểm tra interval nằm trong schedule, kiểm tra doctor/patient conflicts trong `Serializable` transaction trước khi create.

7. **How doctor reschedule follows the same rule.**
   `rescheduleAppointment()` dùng cùng helper availability/conflict với duration hiện có của appointment, exclude chính appointment khỏi conflict query.

8. **What happens when schedule changes after appointments already exist.**
   Appointment hiện hữu không bị hủy hoặc đổi tự động. Schedule mới chỉ áp dụng cho availability, booking mới và reschedule mới. Nếu doctor muốn xử lý appointment cũ ngoài schedule mới, họ phải reschedule/cancel theo flow nghiệp vụ hiện có.

## 11. Open decisions

| Decision | Recommendation |
| --- | --- |
| Endpoint nằm ở `DiscoveryController` hay `AppointmentController`? | Dùng `DiscoveryController` với `/public/doctors/:doctorId/availability` vì slot availability không nhạy cảm và phục vụ discovery/booking UI. Logic tính toán vẫn nằm ở service domain dùng chung. |
| Reject overlap schedule khi doctor save hay merge khi calculate? | Nhỏ nhất: merge khi calculate; tốt hơn cho UX: cảnh báo/reject overlap trong `DoctorService.updateMySchedule()`. |
| Có cần weekly recurring schedule không? | Chưa cần trong scope hiện tại. `doctor.api.normalizeSchedule()` có legacy support `weekly`, nhưng canonical model nên là daily slots để khớp UI hiện tại. |
| Có cần bảng `DoctorAvailabilitySlot` không? | Chưa cần. Chỉ tạo bảng khi cần recurring lâu dài, exception calendar, audit lịch hoặc query/report phức tạp. |
