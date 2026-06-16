# Final Report Update Scope Checklist

## 1. Phạm vi đã giữ nguyên

- Đã giữ nguyên nội dung chính của Chương I.
- Đã giữ nguyên nội dung chính của Chương II.
- Không sửa use case, mô tả activity diagram, architecture, ERD/database description, user story hoặc yêu cầu chất lượng.
- Không đánh lại số hình/bảng.

## 2. Phần đã cập nhật

- Đã cập nhật Tóm tắt ở các câu liên quan đến kết quả cuối kỳ.
- Đã rà soát Chương III, phần triển khai phần mềm và kiểm thử.
- Đã cập nhật bảng test case UC01-UC06 theo kết quả chạy Playwright cuối.
- Đã cập nhật Bảng 16 với kết quả: 37 discovered, 36 passed, 1 skipped/fixme, 0 failed.
- Đã cập nhật Chương IV theo hướng ngắn gọn hơn, giữ phạm vi MVP.

## 3. Kết quả test đã giữ đúng

- Playwright discovered: 37 tests.
- Passed: 36.
- Skipped/Fixme: 1.
- Failed: 0.
- E2E-023 không ghi Pass.
- Lý do E2E-023 fixme: frontend MVP chưa có direct question detail route/API cho negative test ngoài phạm vi.

## 4. TODO hình ảnh đã giữ

- Đã giữ TODO Hình 15-34 cho UI app.
- Đã giữ TODO Hình 35 cho cấu trúc Playwright.
- Đã giữ TODO Hình 36 cho terminal Playwright.
- Đã giữ TODO Hình 37 cho HTML report.
- Không chèn hình mới trong lần cập nhật này.

## 5. Các hình cần chụp sau

- Hình 15: Giao diện Trang chủ public.
- Hình 16: Giao diện Danh sách chuyên khoa.
- Hình 17: Giao diện Danh sách bác sĩ.
- Hình 18: Giao diện Chi tiết bác sĩ.
- Hình 19: Giao diện Đăng ký.
- Hình 20: Giao diện Đăng nhập.
- Hình 21: Giao diện Patient dashboard và hồ sơ.
- Hình 22: Giao diện Patient đặt lịch tư vấn.
- Hình 23: Giao diện Patient danh sách lịch hẹn.
- Hình 24: Giao diện Patient gửi câu hỏi sức khỏe.
- Hình 25: Giao diện Patient xem câu hỏi và phản hồi.
- Hình 26: Giao diện Patient xem kết quả tư vấn và đơn thuốc.
- Hình 27: Giao diện Doctor dashboard và hồ sơ.
- Hình 28: Giao diện Doctor quản lý lịch hẹn.
- Hình 29: Giao diện Doctor quản lý câu hỏi.
- Hình 30: Giao diện Doctor phiên tư vấn, kết quả và đơn thuốc.
- Hình 31: Giao diện Admin dashboard.
- Hình 32: Giao diện Admin quản lý và duyệt bác sĩ.
- Hình 33: Giao diện Admin quản lý chuyên khoa.
- Hình 34: Giao diện Admin quản lý người dùng và lịch hẹn.
- Hình 35: Cấu trúc thư mục kiểm thử tự động Playwright.
- Hình 36: Kết quả chạy kiểm thử Playwright trên terminal.
- Hình 37: Báo cáo HTML của Playwright.

## 6. Lệnh nên chạy lại trước khi export Word/PDF

Backend:

```bash
cd OnlineHealthConsultation-Service
source ~/.nvm/nvm.sh
npm run build
npm test
npm run db:seed:e2e
```

Frontend:

```bash
cd OnlineHealthConsultation-Web
source ~/.nvm/nvm.sh
npm run build
npm run lint
npm run test:e2e
```

## 7. Kiểm tra thủ công trước khi chuyển Word/PDF

- Chụp đủ Hình 15-37 và chèn đúng vị trí TODO.
- Kiểm tra lại mục lục, danh sách bảng và danh sách hình sau khi chèn ảnh.
- Kiểm tra Bảng 16 vẫn ghi đúng 37 discovered, 36 passed, 1 skipped/fixme, 0 failed.
- Kiểm tra E2E-023 vẫn là fixme, không bị ghi thành pass.
- Kiểm tra Chương IV không ghi hệ thống sẵn sàng production.
- Kiểm tra định dạng bảng không bị vỡ khi chuyển sang Word/PDF.
