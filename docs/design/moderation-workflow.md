# Moderation Workflow

## SRS scope

SRS yêu cầu Admin có thể xem xét và kiểm duyệt:

- Câu hỏi sức khỏe của Patient.
- Phản hồi câu hỏi của Doctor.
- Điểm đánh giá và bình luận sau tư vấn.
- Nội dung liên quan đến tư vấn khi cần.

## Current schema limitation

Schema hiện tại chưa có bảng `Report`, `ModerationQueue` hoặc trạng thái `PENDING_REVIEW` riêng cho từng loại nội dung. Vì vậy workflow nhỏ nhất dùng các field đã tồn tại:

- `Question.status`: `PENDING`, `ANSWERED`, `CLOSED`, `MODERATED`.
- `Answer.isApproved`: `true` là hiển thị, `false` là ẩn/chưa duyệt.
- `Rating.status`: `VISIBLE`, `HIDDEN`.

Không cần schema change ở bước này. Nếu hệ thống cần người dùng report nội dung, phân công reviewer hoặc lưu trạng thái review nhiều bước, nên bổ sung queue/report model trong một ADR riêng.

## API

- `GET /admin/moderation/items`
  - Chỉ dành cho `ADMIN`.
  - Trả về danh sách reviewable item gồm `QUESTION`, `ANSWER`, `RATING`.
  - Mỗi item có nội dung, tác giả, thời điểm tạo, trạng thái và context cần thiết.

- `PATCH /admin/moderation/items/:type/:id`
  - Chỉ dành cho `ADMIN`.
  - Body: `{ "action": "APPROVE" | "RESTORE" | "HIDE" | "CLOSE", "reason"?: string }`.
  - Ghi `AuditLog` cho hành động moderation.

## Visibility rules

- Question bị `MODERATED` không được trả về trong danh sách câu hỏi của Patient/Doctor.
- Answer có `isApproved = false` không được trả về trong danh sách câu hỏi của Patient/Doctor.
- Rating `HIDDEN` không xuất hiện trong danh sách rating visible của Doctor.

## Consultation content

Nội dung live consultation hiện chưa có field moderation riêng trên `ConsultationMessage`, summary hoặc prescription. Vì SRS chỉ nêu kiểm duyệt nội dung tư vấn ở mức tổng quát, bước này không thêm schema mới cho consultation message. Nếu cần kiểm duyệt từng message, cần bổ sung trạng thái visibility/audit riêng cho `ConsultationMessage`.
