# File Attachment Scope Decision

Ngày quyết định: 2026-08-20

## 1. Kết luận nộp bài

`FileAttachment` / file upload **không thuộc phạm vi bắt buộc của bản submitted system hiện tại**.

Quyết định cuối cùng:

- `Status`: `NOT_IMPLEMENTED`
- `Submission scope`: optional / conditional future capability
- Không implement upload trong đợt này.
- Không claim hệ thống hỗ trợ upload attachment trong tài liệu nộp bài.
- Giữ dormant Prisma schema `FileAttachment` vì schema này không tạo UI/API gây hiểu nhầm và có thể dùng cho future capability.

## 2. Exact SRS Basis

SRS đặt file storage trong nhóm external system capability:

- Section `3.5 Ca sử dụng của hệ thống bên ngoài`
- `UC-E-04: Lưu trữ và truy xuất tệp tải lên.`

SRS mô tả `File Storage Service` như một dịch vụ lưu trữ tệp đính kèm, gồm tài liệu sức khỏe, hình ảnh, đơn thuốc và tệp phản hồi liên quan đến tư vấn.

SRS cũng ghi rõ trong luồng booking:

> Patient nhập mô tả vấn đề sức khỏe và tải lên tệp liên quan khi chức năng tải tệp được áp dụng.

Cụm “khi chức năng tải tệp được áp dụng” làm cho upload attachment là capability có điều kiện, không phải bước bắt buộc để hoàn tất core booking flow.

Trong non-functional performance, SRS tách upload file ra khỏi nhóm thao tác thông thường:

> không bao gồm upload file và media thời gian thực

Điều này củng cố việc upload/file media được xem như khả năng riêng, không phải baseline cho các request nghiệp vụ lõi.

## 3. Final Traceability Basis

`docs/audit/final-srs-traceability.md` hiện phân loại:

- `File upload / file storage`: `NOT_IMPLEMENTED`
- Lý do: schema có `FileAttachment`, nhưng chưa có FE upload flow hoặc storage provider implementation cho booking/question attachments.
- SRS xem file storage là external/conditional.

Danh sách “Cần fix trước khi nộp” cũng yêu cầu ra quyết định rõ:

- Nếu attachment nằm trong submitted scope thì implement upload/storage.
- Nếu không, document là conditional/out-of-scope.

Tài liệu này là quyết định chính thức theo hướng thứ hai.

## 4. Source Inspection Summary

### Backend

Có dormant schema support:

- `prisma/schema.prisma`
  - `model FileAttachment`
  - relation `User.uploadedAttachments`
  - relation `ConsultationSession.attachments`
  - table `file_attachments` trong initial migrations

Không có implementation upload runtime:

- Không có NestJS upload controller.
- Không có `FileInterceptor`, `UploadedFile`, `multer`, `multipart` handling.
- Không có storage provider abstraction cho files.
- `CreateAppointmentDto` chỉ nhận:
  - `doctorId`
  - `scheduledAt`
  - `durationMinutes`
  - `reason`
  - `notes`
- `CreateQuestionDto` chỉ nhận:
  - `title`
  - `content`
  - optional `doctorId`
- `SendConsultationMessageDto` chỉ nhận:
  - `content`

### Frontend

Không có UI upload đang active:

- `BookAppointmentPage` có doctor/date/slot/reason/notes, không có file input.
- `AskQuestionPage` có specialty/title/content, không có file input.
- `PatientConsultationSessionPage` và doctor `ConsultationSessionPage` chỉ hỗ trợ chat text/result/prescription, không có attachment send/upload control.
- `patient.api` dùng JSON `POST /questions`, `POST /appointments`, `POST /consultations/:appointmentId/messages`; không dùng `FormData` hoặc multipart request.

Biểu tượng `pi-file` trong `ConsultationHistoryPage` là nút xem consultation result, không phải upload attachment.

## 5. UI Decision

Không cần remove UI trong đợt này vì không có UI nào đang falsely suggests file upload is functional.

Nguyên tắc cho submitted system:

- Không thêm nút “Upload file”, “Attach file”, “Đính kèm tệp” khi backend/storage chưa implement.
- Nếu có mock/demo trong tương lai, phải label rõ là mock hoặc disabled.
- Không dùng `FileAttachment` schema để imply feature complete trong README/API docs.

## 6. Dormant Schema Decision

Giữ `FileAttachment` trong Prisma schema vì:

- Nó không xuất hiện trong UI/API contract hiện tại.
- Không tạo false-positive functionality cho evaluator.
- Có thể dùng lại nếu future scope yêu cầu upload evidence, medical documents, hoặc consultation response files.

Không tạo migration để drop table trong submitted scope vì điều đó không cần thiết và có thể gây churn không liên quan.

## 7. Documentation Decision

Từ thời điểm này, tài liệu nộp bài nên mô tả file attachment như sau:

- `File upload / file storage`: `Optional / conditional future capability`
- `Current implementation`: dormant schema only; no user-facing upload API/UI/storage provider
- `Submitted feature claim`: no attachment support

Không ghi rằng booking attachments, health-question attachments hoặc consultation attachments là functional submitted features.

## 8. Minimal Future Implementation Plan

Chỉ dùng phần này nếu evaluator yêu cầu upload là mandatory:

1. Tạo storage provider interface:
   - `save(file, metadata)`
   - `getSignedReadUrl(storageKey)`
   - `delete(storageKey)`
2. Implement development local storage provider và optional production provider.
3. Thêm authenticated upload endpoint với `multipart/form-data`.
4. Validate file size, MIME type, owner type và authorization.
5. Gắn attachment với appointment/question/consultation session bằng `ownerType`, `ownerId`, `consultationSessionId` khi phù hợp.
6. Thêm FE upload controls chỉ ở các màn hình được SRS/UX yêu cầu.
7. Thêm tests cho upload, authorization, download/read access và cleanup.

Không thực hiện plan này trong submitted scope hiện tại.
