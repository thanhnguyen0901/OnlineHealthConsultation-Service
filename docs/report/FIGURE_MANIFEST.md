# Figure Manifest

This manifest lists every figure placeholder used in `docs/report/BAO_CAO_TOT_NGHIEP.md`. It tells the report author which diagrams or screenshots still need to be exported and inserted into the Word/PDF version.

| Order | Suggested caption | Source | Export filename | Chapter/Section | Ready? |
| ----- | ----------------- | ------ | --------------- | --------------- | ------ |
| 1 | Hình 3.1. Biểu đồ Use Case của khách truy cập | `docs/report/diagram-selection/plantuml/use-case/use-case-guest.puml` | `use-case-guest.png` | Chương 3 / Mục 3.6.1 | Needs export |
| 2 | Hình 3.2. Biểu đồ Use Case của bệnh nhân | `docs/report/diagram-selection/plantuml/use-case/use-case-patient.puml` | `use-case-patient.png` | Chương 3 / Mục 3.6.2 | Needs export |
| 3 | Hình 3.3. Biểu đồ Use Case của bác sĩ | `docs/report/diagram-selection/plantuml/use-case/use-case-doctor.puml` | `use-case-doctor.png` | Chương 3 / Mục 3.6.3 | Needs export |
| 4 | Hình 3.4. Biểu đồ Use Case của quản trị viên | `docs/report/diagram-selection/plantuml/use-case/use-case-admin.puml` | `use-case-admin.png` | Chương 3 / Mục 3.6.4 | Needs export |
| 5 | Hình 3.5. Luồng hoạt động tổng quát của hệ thống | `docs/architecture/system-flow-diagram.md` | `system-flow.png` | Chương 3 / Mục 3.7 | Needs export |
| 6 | Hình 4.1. Kiến trúc tổng thể của hệ thống | Approved Architecture Overview diagram | `architecture-overview.png` | Chương 4 / Mục 4.1 | Needs export |
| 7 | Hình 4.2. Sơ đồ quan hệ thực thể của hệ thống | ERD exported from final database/Prisma schema | `database-erd.png` | Chương 4 / Mục 4.5 | Needs export |
| 8 | Hình 4.3. Sơ đồ lớp các thành phần backend chính | `docs/report/diagram-selection/class-diagram-decision.md`; simplified diagram to be created/exported from approved scope | `backend-class-diagram.png` | Chương 4 / Mục 4.6 | Needs creation/export |
| 9 | Hình 4.4. Biểu đồ tuần tự đăng nhập người dùng | `docs/report/diagram-selection/sequences/sequence-login.md` | `sequence-login.png` | Chương 4 / Mục 4.7 | Needs export |
| 10 | Hình 4.5. Biểu đồ tuần tự đặt lịch tư vấn | `docs/report/diagram-selection/sequences/sequence-book-appointment.md` | `sequence-book-appointment.png` | Chương 4 / Mục 4.8 | Needs export |
| 11 | Hình 4.6. Biểu đồ tuần tự chat realtime trong phiên tư vấn | `docs/report/diagram-selection/sequences/sequence-consultation-chat.md` | `sequence-consultation-chat.png` | Chương 4 / Mục 4.9 | Needs export |
| 12 | Hình 4.7. Biểu đồ tuần tự tạo đơn thuốc sau tư vấn | `docs/report/diagram-selection/sequences/sequence-create-prescription.md` | `sequence-create-prescription.png` | Chương 4 / Mục 4.9 | Needs export |
| 13 | Hình 4.8. Biểu đồ tuần tự xử lý thông báo bất đồng bộ qua outbox | `docs/report/diagram-selection/sequences/sequence-notification-outbox.md` | `sequence-notification-outbox.png` | Chương 4 / Mục 4.10 | Needs export |
| 14 | Hình 4.9. Biểu đồ tuần tự kiểm duyệt câu hỏi và phản hồi | `docs/report/diagram-selection/sequences/sequence-admin-moderation.md` | `sequence-admin-moderation.png` | Chương 4 / Mục 4.11 | Needs export |
| 15 | Hình 5.1. Giao diện tra cứu chuyên khoa và bác sĩ | Final running frontend screenshot: public doctor/specialty discovery page | `ui-public-doctor-discovery.png` | Chương 5 / Mục 5.2 | Needs screenshot |
| 16 | Hình 5.2. Giao diện đặt lịch hẹn trực tuyến | Final running frontend screenshot: patient booking page | `ui-book-appointment.png` | Chương 5 / Mục 5.6 | Needs screenshot |
| 17 | Hình 5.3. Giao diện tư vấn trực tuyến và trao đổi tin nhắn | Final running frontend screenshot: consultation chat page | `ui-consultation-chat.png` | Chương 5 / Mục 5.7 | Needs screenshot |
| 18 | Hình 5.4. Giao diện quản trị hệ thống | Final running frontend screenshot: admin dashboard page | `ui-admin-dashboard.png` | Chương 5 / Mục 5.11 | Needs screenshot |

## Notes

- Do not add the excluded overall Use Case diagram to the final report.
- Do not add unselected sequence diagrams from `docs/diagrams/sequences`.
- Do not insert the full existing backend class diagram if it is too dense; use the simplified scope approved in `class-diagram-decision.md`.
- The ERD should be exported from the final database/Prisma schema, not recreated manually from memory.
- Screenshots should be taken from the final implemented UI and should not imply unimplemented production Email/SMS/video/file-storage capability.
