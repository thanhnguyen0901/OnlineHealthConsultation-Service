# Use Case Diagram Selection for Graduation Report

Tài liệu này audit các Use Case diagram hiện có và chọn một bộ nhỏ, đại diện để đưa vào báo cáo tốt nghiệp. Mục tiêu không phải tạo thêm use case mới, mà là giảm trùng lặp và chỉ giữ các diagram giúp người đọc hiểu hệ thống rõ nhất.

## Nguồn Đã Đọc

- SRS cuối cùng: `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`
- Traceability matrix cuối cùng: `docs/audit/final-srs-traceability.md`
- Use Case diagram hiện có: `docs/diagrams/use-case-diagrams.md`
- Graphify report: `graphify-out/GRAPH_REPORT.md`
- Graphify graph: `graphify-out/graph.json`
- Graphify manifest: `graphify-out/manifest.json`
- Source code kiểm chứng khi cần: backend controller/service, frontend route/page evidence trong traceability matrix.

Ghi chú đường dẫn: request nhắc `docs/architecture/use-case-diagram.md`, nhưng file thực tế trong repo hiện tại là `docs/diagrams/use-case-diagrams.md`.

## Nguyên Tắc Chọn

- SRS cuối cùng là nguồn sự thật cho actor và official use-case ID.
- Traceability/source/Graphify chỉ dùng để phát hiện diagram lỗi thời hoặc dễ gây hiểu nhầm so với implementation.
- Không sửa yêu cầu để khớp implementation.
- Không đưa tất cả diagram vào báo cáo nếu nội dung bị lặp.
- Ưu tiên bộ diagram theo actor chính để báo cáo gọn và dễ đọc.

## Candidate Diagram Review

| Candidate | Actor/Scope | Use Cases | Keep? | Report Chapter | Reason |
| --------- | ----------- | --------- | ----- | -------------- | ------ |
| Overall System | Toàn hệ thống: Guest, Patient, Doctor, Administrator, Notification Service, Video Communication Service, File Storage Service | UC-G-01..06, UC-P-01..15, UC-D-01..11, UC-A-01..08, UC-E-01..04 | Không | Không chèn trực tiếp; chỉ dùng làm tài liệu tham khảo nội bộ | Đúng SRS về ID và actor, nhưng quá dày cho báo cáo vì chứa toàn bộ 44 use case. Nó cũng lặp gần như toàn bộ nội dung của các actor-specific diagram. Có `UC-E-04` file storage trong SRS/external boundary, nhưng traceability ghi file upload/storage là optional/conditional và chưa thuộc submitted scope; nếu đưa overall vào report dễ làm người đọc hiểu nhầm phạm vi triển khai. |
| Guest User | Guest/public area | UC-G-01, UC-G-02, UC-G-03, UC-G-04, UC-G-05, UC-G-06 | Có | Chương 3 - Phân tích yêu cầu hệ thống | Diagram nhỏ, dễ đọc, đại diện cho public discovery flow. Không trùng với Patient/Doctor/Admin diagrams. Nên giữ vì Overall System không được chọn. |
| Patient | Patient + Notification Service | UC-P-01..15, UC-E-01, UC-E-02 | Có | Chương 3 - Phân tích yêu cầu hệ thống | Đây là actor trung tâm của hệ thống: đăng ký, hồ sơ sức khỏe, tìm bác sĩ, hỏi đáp, đặt lịch, tư vấn, kết quả, đơn thuốc, đánh giá và thông báo. Có overlap nhẹ với Guest ở search/xem bác sĩ nhưng khác ngữ cảnh authenticated patient. SMS là optional/extend đúng với SRS và traceability. |
| Doctor | Doctor + Video Communication Service | UC-D-01..11, UC-E-03 | Có | Chương 3 - Phân tích yêu cầu hệ thống | Diagram thể hiện rõ vai trò chuyên môn: hồ sơ, lịch làm việc, câu hỏi, lịch hẹn, tư vấn, kết quả và đơn thuốc. Video được vẽ là `extend`, phù hợp SRS vì implementation hiện tại có chat/mock/fallback chứ không claim provider video thật. |
| Administrator | Administrator | UC-A-01..08 | Có | Chương 3 - Phân tích yêu cầu hệ thống | Diagram gọn và bao phủ nhóm vận hành/quản trị: user, doctor, patient, specialty, appointment, moderation, dashboard/reporting. Ít trùng với actor khác và nên đưa vào báo cáo để chứng minh RBAC/admin scope. |

## Recommended Use Case Diagrams for Final Report

### 1. Hình X. Biểu đồ Use Case của khách truy cập

Source:

- `docs/diagrams/use-case-diagrams.md`
- Section: `2. Guest User`
- Export: `docs/report/diagram-selection/plantuml/use-case/use-case-guest.puml`

Actor(s):

- Guest User

Use cases:

- UC-G-01: Xem trang chủ hệ thống.
- UC-G-02: Xem danh sách chuyên khoa.
- UC-G-03: Tìm kiếm bác sĩ theo chuyên khoa hoặc từ khóa.
- UC-G-04: Xem chi tiết hồ sơ công khai của bác sĩ.
- UC-G-05: Xem danh sách bác sĩ nổi bật hoặc bác sĩ đang hoạt động.
- UC-G-06: Chuyển đến trang đăng ký hoặc đăng nhập khi muốn đặt lịch hoặc gửi câu hỏi.

Insert into:

- Chương 3 - Phân tích yêu cầu hệ thống.

Reason:

- Overall diagram không nên chèn vì quá dày, nên Guest cần diagram riêng để biểu diễn vùng public discovery. Diagram này nhỏ và không tạo redundancy đáng kể.

### 2. Hình X. Biểu đồ Use Case của bệnh nhân

Source:

- `docs/diagrams/use-case-diagrams.md`
- Section: `3. Patient`
- Export: `docs/report/diagram-selection/plantuml/use-case/use-case-patient.puml`

Actor(s):

- Patient
- Notification Service

Use cases:

- UC-P-01: Đăng ký tài khoản.
- UC-P-02: Đăng nhập.
- UC-P-03: Đăng xuất.
- UC-P-04: Quản lý hồ sơ sức khỏe cá nhân.
- UC-P-05: Tìm kiếm bác sĩ theo chuyên khoa.
- UC-P-06: Xem chi tiết bác sĩ.
- UC-P-07: Gửi câu hỏi sức khỏe.
- UC-P-08: Đặt lịch hẹn tư vấn.
- UC-P-09: Xem danh sách lịch hẹn sắp tới.
- UC-P-10: Tham gia phiên tư vấn.
- UC-P-11: Xem phản hồi của bác sĩ.
- UC-P-12: Xem lịch sử tư vấn.
- UC-P-13: Xem đơn thuốc và tóm tắt tư vấn.
- UC-P-14: Đánh giá chất lượng tư vấn.
- UC-P-15: Nhận nhắc lịch và thông báo.
- UC-E-01: Gửi email nhắc lịch.
- UC-E-02: Gửi SMS nhắc lịch.

Insert into:

- Chương 3 - Phân tích yêu cầu hệ thống.

Reason:

- Đây là actor chính của bài toán. Diagram bao phủ đầy đủ patient journey từ onboarding đến consultation result/feedback mà không cần thêm các sub-diagram nhỏ.

Note:

- Khi giải thích trong báo cáo, nên ghi SMS là quan hệ mở rộng/provider-dependent, không phải bằng chứng đã tích hợp SMS production thật.

### 3. Hình X. Biểu đồ Use Case của bác sĩ

Source:

- `docs/diagrams/use-case-diagrams.md`
- Section: `4. Doctor`
- Export: `docs/report/diagram-selection/plantuml/use-case/use-case-doctor.puml`

Actor(s):

- Doctor
- Video Communication Service

Use cases:

- UC-D-01: Đăng nhập.
- UC-D-02: Quản lý hồ sơ bác sĩ.
- UC-D-03: Xem các câu hỏi sức khỏe được phân công hoặc có thể xử lý.
- UC-D-04: Phản hồi câu hỏi của bệnh nhân.
- UC-D-05: Quản lý lịch tư vấn.
- UC-D-06: Xem các lịch hẹn đã được đặt.
- UC-D-07: Bắt đầu phiên tư vấn.
- UC-D-08: Thực hiện tư vấn qua chat hoặc video.
- UC-D-09: Ghi nhận kết quả tư vấn.
- UC-D-10: Cấp đơn thuốc điện tử cơ bản.
- UC-D-11: Xem lịch sử tư vấn của bệnh nhân.
- UC-E-03: Thiết lập phiên tư vấn video.

Insert into:

- Chương 3 - Phân tích yêu cầu hệ thống.

Reason:

- Diagram cho thấy phần nghiệp vụ chuyên môn của doctor: quản lý lịch, trả lời câu hỏi, thực hiện tư vấn, ghi nhận kết quả và cấp đơn thuốc.

Note:

- `UC-E-03` nên được diễn giải là optional/extend. Traceability ghi video hiện triển khai theo hướng chat/mock/fallback, không phải external video provider production.

### 4. Hình X. Biểu đồ Use Case của quản trị viên

Source:

- `docs/diagrams/use-case-diagrams.md`
- Section: `5. Administrator`
- Export: `docs/report/diagram-selection/plantuml/use-case/use-case-admin.puml`

Actor(s):

- Administrator

Use cases:

- UC-A-01: Đăng nhập.
- UC-A-02: Quản lý tài khoản bác sĩ.
- UC-A-03: Quản lý tài khoản bệnh nhân.
- UC-A-04: Quản lý chuyên khoa.
- UC-A-05: Quản lý lịch hẹn.
- UC-A-06: Kiểm duyệt nội dung tư vấn và phản hồi.
- UC-A-07: Xem dashboard thống kê hệ thống.
- UC-A-08: Theo dõi người dùng đang hoạt động và số lượng phiên tư vấn.

Insert into:

- Chương 3 - Phân tích yêu cầu hệ thống.

Reason:

- Diagram cô đọng nhóm chức năng vận hành và quản trị, giúp báo cáo thể hiện rõ vai trò Administrator và phạm vi RBAC.

## PlantUML Export Preparation

Các PlantUML block được copy nguyên từ `docs/diagrams/use-case-diagrams.md` vào:

- `docs/report/diagram-selection/plantuml/use-case/use-case-guest.puml`
- `docs/report/diagram-selection/plantuml/use-case/use-case-patient.puml`
- `docs/report/diagram-selection/plantuml/use-case/use-case-doctor.puml`
- `docs/report/diagram-selection/plantuml/use-case/use-case-admin.puml`

Không redesign PlantUML trong bước này. Không có correction bắt buộc vì các diagram được chọn vẫn giữ official SRS IDs và actor definitions. Các điểm cần chú thích khi viết báo cáo:

- SMS notification là optional/provider-dependent.
- Video consultation là optional/extend và implementation hiện tại là chat/mock/fallback, không phải external video integration production.
- File storage `UC-E-04` chỉ xuất hiện trong overall diagram bị loại khỏi report; traceability ghi file upload/storage là optional/conditional và chưa thuộc submitted scope.

## Final Summary

```text
Existing Use Case diagrams reviewed: 5
Selected for report: 4
Excluded as redundant: 1

Recommended figures:
1. Hình X. Biểu đồ Use Case của khách truy cập
2. Hình X. Biểu đồ Use Case của bệnh nhân
3. Hình X. Biểu đồ Use Case của bác sĩ
4. Hình X. Biểu đồ Use Case của quản trị viên
```
