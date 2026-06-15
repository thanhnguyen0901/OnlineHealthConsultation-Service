# Final Report Completion Checklist

Checklist này dùng để hoàn tất bản Word/PDF cuối kỳ cho đề tài "Xây dựng và kiểm thử nền tảng tư vấn sức khỏe trực tuyến".

## 1. Các phần đã cập nhật trong report

- Cập nhật mục lục để bổ sung Chương III, Chương IV và Tài liệu tham khảo.
- Cập nhật danh sách hình ảnh với các màn hình frontend và minh chứng Playwright.
- Cập nhật danh sách bảng với bảng công nghệ, môi trường kiểm thử, test case UC01-UC06 và kết quả E2E.
- Cập nhật phần Tóm tắt theo trạng thái cuối kỳ thật.
- Bổ sung Chương III: Triển khai hệ thống.
- Bổ sung mô tả các màn hình public, auth, patient, doctor và admin.
- Bổ sung phần cài đặt backend/frontend/database/testing tools.
- Bổ sung chiến lược kiểm thử, phạm vi kiểm thử và môi trường kiểm thử.
- Bổ sung test case table cho UC01-UC06.
- Bổ sung phần hiện thực Playwright E2E và kết quả chạy thật.
- Bổ sung Chương IV: Kết luận, điểm mạnh, hạn chế và hướng phát triển.
- Bổ sung tài liệu tham khảo Playwright, TypeScript, Redux Toolkit và Vite.

## 2. TODO hình ảnh cần chụp

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

## 3. TODO test result cần bổ sung nếu có seed đầy đủ

- Bổ sung seed patient active.
- Bổ sung seed doctor active, approved và có specialty.
- Bổ sung seed appointment pending/confirmed/completed.
- Bổ sung seed question pending và answered.
- Bổ sung seed consultation session có summary.
- Bổ sung seed prescription và prescription items.
- Bổ sung seed visible rating cho public doctor rating summary.
- Chạy lại Playwright với `E2E_RUN_SEEDED=true`.
- Chụp lại terminal và HTML report nếu số pass thay đổi.
- Chỉ cập nhật kết quả Pass cho test nào đã chạy thật.

## 4. Các bảng cần verify trước khi nộp

- Bảng 7: Công nghệ và lệnh triển khai backend.
- Bảng 8: Công nghệ và lệnh triển khai frontend.
- Bảng 9: Môi trường và dữ liệu kiểm thử.
- Bảng 10-15: Test case UC01-UC06.
- Bảng 16: Tổng hợp kết quả Playwright E2E.
- Kiểm tra các bảng không bị vỡ format khi chuyển sang Word/PDF.

## 5. Command cần chạy trước khi nộp

Backend:

```bash
cd OnlineHealthConsultation-Service
source ~/.nvm/nvm.sh
npm run build
npm test
```

Frontend:

```bash
cd OnlineHealthConsultation-Web
npm run build
npm run lint
npm run test:e2e
npm run test:e2e:report
```

Nếu chạy full seeded E2E:

```bash
cd OnlineHealthConsultation-Web
E2E_RUN_SEEDED=true \
E2E_PATIENT_EMAIL=... \
E2E_PATIENT_PASSWORD=... \
E2E_DOCTOR_EMAIL=... \
E2E_DOCTOR_PASSWORD=... \
E2E_ADMIN_EMAIL=admin@healthcare.local \
E2E_ADMIN_PASSWORD=Admin@123 \
npm run test:e2e
```

## 6. Rủi ro còn lại cần ghi nhớ khi bảo vệ

- Backend Jest hiện pass theo `--passWithNoTests`, chưa có unit/integration test backend thật.
- Full Playwright nghiệp vụ cần seed dữ liệu thật; chưa được ghi pass nếu seed chưa đủ.
- Video call thật, email thật, SMS thật, file upload và rate limiting là Future Enhancement.
- Unified admin moderation list, doctor patient list và một số reporting nâng cao chưa có backend endpoint đầy đủ.
- Hệ thống phù hợp MVP/demo cuối kỳ, chưa nên trình bày là production-ready cho môi trường y tế thật.

## 7. Checklist export Word/PDF

- Search `TODO:` trong report và chèn hình tương ứng.
- Cập nhật số trang trong mục lục thủ công sau khi chuyển sang Word.
- Cập nhật danh sách hình và bảng nếu thêm/bớt hình.
- Kiểm tra heading Chương I-IV không bị duplicate.
- Kiểm tra không còn câu khẳng định test pass khi chưa chạy thật.
- Kiểm tra tài liệu tham khảo hiển thị đúng link.
- Xuất PDF và xem lại toàn bộ bảng dài, hình ảnh, caption.
