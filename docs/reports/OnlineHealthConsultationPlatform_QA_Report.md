# BÁO CÁO ĐỒ ÁN MÔN HỌC

<!-- TODO: Cần insert hình 0: Logo trường và khoa -->

<!-- TODO: Bổ sung tên trường, tên khoa và tên giảng viên hướng dẫn. -->

**MÔN HỌC: ĐẢM BẢO CHẤT LƯỢNG PHẦN MỀM**

---

# XÂY DỰNG VÀ KIỂM THỬ NỀN TẢNG TƯ VẤN SỨC KHỎE TRỰC TUYẾN

*(Online Health Consultation Platform)*

---

**Nhóm thực hiện:**

| STT | Họ và tên | MSSV | Vai trò |
|-----|-----------|------|---------|
| 1 | Nguyễn Việt Thanh | K223DTCN436 | Nhóm trưởng |
| 2 | Trần Long Đại | K223DTCN439 | Thành viên |
| 3 | Vũ Hải Minh | K223DTCN380 | Thành viên |

<!-- TODO: Bổ sung thời gian nộp báo cáo và địa điểm thực hiện đề tài. -->

---

## LỜI CẢM ƠN

Nhóm thực hiện đề tài xin gửi lời cảm ơn chân thành đến Ban Giám hiệu nhà trường và Ban Chủ nhiệm khoa đã tạo điều kiện thuận lợi về cơ sở vật chất và chương trình đào tạo, giúp nhóm có cơ hội tiếp cận môn học Đảm bảo chất lượng phần mềm — một lĩnh vực thiết yếu trong quy trình phát triển phần mềm chuyên nghiệp.

Nhóm xin đặc biệt cảm ơn <!-- TODO: Bổ sung tên giảng viên hướng dẫn --> đã tận tình định hướng, hỗ trợ và góp ý trong suốt quá trình thực hiện đề tài. Những hướng dẫn về phân tích yêu cầu, thiết kế kiểm thử và các nguyên tắc đảm bảo chất lượng phần mềm đã giúp nhóm có nền tảng vững chắc để hoàn thành báo cáo đúng định hướng môn học.

Nhóm cũng trân trọng sự nỗ lực và tinh thần hợp tác của từng thành viên trong quá trình phân công, thực hiện và hoàn thiện từng phần của báo cáo. Mỗi thành viên đã đóng góp theo phạm vi nhiệm vụ được giao, từ phân tích yêu cầu, thiết kế use case, xây dựng API và cơ sở dữ liệu, đến đặc tả test case và định hướng kiểm thử tự động.

Do giới hạn về thời gian và kinh nghiệm thực tế, báo cáo chắc chắn còn có những thiếu sót về cả nội dung lẫn hình thức trình bày. Nhóm rất mong nhận được sự góp ý và nhận xét từ giảng viên hướng dẫn và hội đồng đánh giá để có thể học hỏi và hoàn thiện hơn trong các đề tài tiếp theo.

Xin trân trọng cảm ơn.

---

## MỤC LỤC

**LỜI CẢM ƠN**

**MỤC LỤC**

**DANH SÁCH HÌNH ẢNH**

**DANH SÁCH BẢNG**

**TÓM TẮT**

---

**CHƯƠNG I. TỔNG QUAN**

1. Giới thiệu đề tài
   - 1.1. Mục đích của đề tài
   - 1.2. Mục tiêu
   - 1.3. Phương pháp tiến hành
2. Vai trò và nhiệm vụ của mỗi thành viên
3. Cơ sở lý thuyết
   - 3.1. Quy trình nghiệp vụ của hệ thống tư vấn sức khỏe trực tuyến
   - 3.2. Các quy tắc quản lý tại hệ thống tư vấn sức khỏe trực tuyến
   - 3.3. Đối tượng sử dụng
   - 3.4. Công nghệ hỗ trợ xây dựng phần mềm

---

**CHƯƠNG II. PHÂN TÍCH & THIẾT KẾ HỆ THỐNG**

1. Yêu cầu từ các Stakeholder
   - 1.1. Phỏng vấn và tổng hợp yêu cầu từ người sử dụng
   - 1.2. User Story (đặc tả yêu cầu người dùng)
   - 1.3. Thiết kế Wireframe & Prototype
2. Danh sách Use case theo SRS
   - 2.1. Use case của Người dùng khách
   - 2.2. Use case của Bệnh nhân
   - 2.3. Use case của Bác sĩ
   - 2.4. Use case của Quản trị viên
   - 2.5. Use case của Hệ thống bên ngoài
3. Phân tích hệ thống theo actor
   - 3.1. Use case và luồng nghiệp vụ nhóm Người dùng khách
   - 3.2. Use case và luồng nghiệp vụ nhóm Bệnh nhân
   - 3.3. Use case và luồng nghiệp vụ nhóm Bác sĩ
   - 3.4. Use case và luồng nghiệp vụ nhóm Quản trị viên
4. Định nghĩa yêu cầu chất lượng phần mềm
   - 4.1. Yêu cầu từ môi trường nghiệp vụ
   - 4.2. Yêu cầu từ môi trường vận hành
   - 4.3. Yêu cầu từ môi trường phát triển
5. Thiết kế hệ thống
   - 5.1. Kiến trúc hệ thống
   - 5.2. Thiết kế Form/API theo Use case
   - 5.3. Thiết kế Cơ sở dữ liệu

---

**CHƯƠNG III. TRIỂN KHAI HỆ THỐNG VÀ KIỂM THỬ**

1. Phần mềm ứng dụng
   - 1.1. Giao diện chính của phần mềm
   - 1.2. Cài đặt hệ thống
     - 1.2.1. Backend
     - 1.2.2. Frontend
     - 1.2.3. Cơ sở dữ liệu
2. Chiến lược kiểm thử
   - 2.1. Mục tiêu kiểm thử
   - 2.2. Phạm vi kiểm thử
   - 2.3. Kỹ thuật kiểm thử được áp dụng
   - 2.4. Mapping Use case SRS và phạm vi kiểm thử
3. Đặc tả Test case theo actor và use case
   - 3.1. Test case nhóm Người dùng khách
   - 3.2. Test case nhóm Bệnh nhân
   - 3.3. Test case nhóm Bác sĩ
   - 3.4. Test case nhóm Quản trị viên
   - 3.5. Test case bảo mật, phân quyền và quyền riêng tư
4. Checklist rà soát
   - 4.1. Checklist rà soát yêu cầu
   - 4.2. Checklist rà soát thiết kế
   - 4.3. Checklist rà soát API
   - 4.4. Checklist rà soát bảo mật
5. Hiện thực Automation Test và ghi nhận lỗi
   - 5.1. Định hướng Playwright E2E Test
   - 5.2. Cấu trúc test dự kiến
   - 5.3. Danh sách test case dự kiến tự động hóa
   - 5.4. Cách chạy kiểm thử tự động dự kiến
   - 5.5. Cách ghi nhận kết quả kiểm thử
   - 5.6. Kết quả kiểm thử
   - 5.7. Bảng tổng hợp kết quả kiểm thử
   - 5.8. Bảng ghi nhận lỗi
   - 5.9. Minh chứng kiểm thử

---

**CHƯƠNG IV. KẾT LUẬN**

1. Nhận xét điểm mạnh và điểm yếu trong quá trình thực hiện đề tài
   - 1.1. Điểm mạnh
   - 1.2. Điểm yếu
2. Khả năng cải tiến

---

**TÀI LIỆU THAM KHẢO**

---

## DANH SÁCH HÌNH ẢNH

| Số hình | Tên hình |
|---------|----------|
| Hình 1 | Tổng quan quy trình tư vấn sức khỏe trực tuyến |
| Hình 2 | Use case tổng quan toàn hệ thống |
| Hình 3 | Use case diagram nhóm Người dùng khách |
| Hình 4 | Use case diagram nhóm Bệnh nhân |
| Hình 5 | Use case diagram nhóm Bác sĩ |
| Hình 6 | Use case diagram nhóm Quản trị viên |
| Hình 7 | Activity diagram: Người dùng khách tra cứu bác sĩ |
| Hình 8 | Activity diagram: Bệnh nhân đăng ký và đăng nhập |
| Hình 9 | Activity diagram: Bệnh nhân đặt lịch tư vấn |
| Hình 10 | Activity diagram: Bệnh nhân gửi câu hỏi sức khỏe |
| Hình 11 | Activity diagram: Bác sĩ phản hồi câu hỏi sức khỏe |
| Hình 12 | Activity diagram: Bác sĩ thực hiện phiên tư vấn trực tuyến |
| Hình 13 | Activity diagram: Quản trị viên quản lý hệ thống |
| Hình 14 | Kiến trúc hệ thống |
| Hình 15 | ERD/Sơ đồ cơ sở dữ liệu |
| Hình 16 | Giao diện trang chủ |
| Hình 17 | Giao diện danh sách chuyên khoa |
| Hình 18 | Giao diện danh sách bác sĩ |
| Hình 19 | Giao diện chi tiết bác sĩ |
| Hình 20 | Giao diện đăng nhập và đăng ký |
| Hình 21 | Giao diện hồ sơ bệnh nhân |
| Hình 22 | Giao diện hồ sơ bác sĩ |
| Hình 23 | Giao diện đặt lịch tư vấn |
| Hình 24 | Giao diện gửi câu hỏi sức khỏe |
| Hình 25 | Giao diện danh sách câu hỏi của bệnh nhân |
| Hình 26 | Giao diện phản hồi câu hỏi của bác sĩ |
| Hình 27 | Giao diện lịch hẹn của bệnh nhân |
| Hình 28 | Giao diện quản lý lịch của bác sĩ |
| Hình 29 | Giao diện phiên tư vấn trực tuyến |
| Hình 30 | Giao diện kết quả tư vấn và đơn thuốc |
| Hình 31 | Giao diện đánh giá tư vấn |
| Hình 32 | Giao diện quản trị người dùng |
| Hình 33 | Giao diện quản lý chuyên khoa |
| Hình 34 | Giao diện quản lý lịch hẹn |
| Hình 35 | Giao diện dashboard thống kê |
| Hình 36 | Kết quả chạy Playwright trên terminal |
| Hình 37 | Playwright HTML report |
| Hình 38 | Screenshot minh chứng test case đặt lịch tư vấn |
| Hình 39 | Screenshot minh chứng test case phản hồi câu hỏi sức khỏe |
| Hình 40 | Screenshot minh chứng bug nếu phát hiện |

---

## DANH SÁCH BẢNG

| Số bảng | Tên bảng |
|---------|----------|
| Bảng 1 | Phân công nhiệm vụ thành viên nhóm |
| Bảng 2 | Danh sách actor và mô tả phạm vi thao tác |
| Bảng 3 | Danh sách Use case của Người dùng khách |
| Bảng 4 | Danh sách Use case của Bệnh nhân |
| Bảng 5 | Danh sách Use case của Bác sĩ |
| Bảng 6 | Danh sách Use case của Quản trị viên |
| Bảng 7 | Danh sách Use case của Hệ thống bên ngoài |
| Bảng 8 | User Story toàn hệ thống |
| Bảng 9 | Mapping Use case SRS và phạm vi kiểm thử |
| Bảng 10 | Yêu cầu chất lượng phần mềm |
| Bảng 11 | API/Form theo Use case |
| Bảng 12 | Từ điển cơ sở dữ liệu |
| Bảng 13 | Test case nhóm Người dùng khách |
| Bảng 14 | Test case nhóm Bệnh nhân |
| Bảng 15 | Test case nhóm Bác sĩ |
| Bảng 16 | Test case nhóm Quản trị viên |
| Bảng 17 | Test case nhóm Thông báo và Hệ thống bên ngoài |
| Bảng 18 | Checklist rà soát yêu cầu |
| Bảng 19 | Checklist rà soát thiết kế |
| Bảng 20 | Checklist rà soát API |
| Bảng 21 | Checklist rà soát bảo mật |
| Bảng 22 | Bảng tổng hợp kết quả kiểm thử |
| Bảng 23 | Bảng ghi nhận lỗi |

---

## TÓM TẮT

Đề tài "Xây dựng và kiểm thử nền tảng tư vấn sức khỏe trực tuyến" được thực hiện trong khuôn khổ môn học Đảm bảo chất lượng phần mềm với mục tiêu xây dựng một hệ thống web hỗ trợ tư vấn sức khỏe từ xa, đồng thời vận dụng toàn diện các nguyên tắc, quy trình và kỹ thuật kiểm thử phần mềm vào một sản phẩm thực tế.

**Phạm vi hệ thống**

Hệ thống được xây dựng theo phạm vi MVP, dựa trên tài liệu Đặc tả yêu cầu phần mềm (SRS) của dự án Online Health Consultation Platform. Hệ thống phục vụ bốn nhóm người dùng chính: Người dùng khách chưa đăng nhập, Bệnh nhân đã đăng ký tài khoản, Bác sĩ cung cấp dịch vụ tư vấn chuyên môn và Quản trị viên vận hành nền tảng. Ngoài các nhóm người dùng trực tiếp, hệ thống tích hợp với ba dịch vụ bên ngoài gồm Dịch vụ thông báo, Dịch vụ tư vấn video và Dịch vụ lưu trữ tệp.

**Các nhóm chức năng chính**

Hệ thống bao gồm mười bốn nhóm chức năng trong phạm vi MVP:

**(1) Truy cập công khai:** Người dùng khách có thể xem trang chủ, danh sách chuyên khoa, danh sách bác sĩ và hồ sơ công khai của bác sĩ mà không cần đăng nhập.

**(2) Xác thực và phân quyền:** Hệ thống hỗ trợ đăng ký, đăng nhập, đăng xuất và phân quyền theo vai trò, kết hợp kiểm soát quyền sở hữu dữ liệu cho từng người dùng.

**(3) Hồ sơ bệnh nhân:** Bệnh nhân có thể tạo và cập nhật hồ sơ sức khỏe cá nhân bao gồm thông tin cơ bản, ngày sinh, giới tính, thông tin liên hệ và tiền sử y tế.

**(4) Hồ sơ bác sĩ:** Bác sĩ có thể quản lý hồ sơ chuyên môn bao gồm chuyên khoa, kinh nghiệm, mô tả tư vấn và lịch làm việc; quản trị viên có thể duyệt và quản lý trạng thái hồ sơ bác sĩ.

**(5) Quản lý chuyên khoa:** Quản trị viên có thể tạo, cập nhật và quản lý danh mục chuyên khoa; bác sĩ có thể được gắn với một hoặc nhiều chuyên khoa.

**(6) Khám phá bác sĩ:** Bệnh nhân và người dùng khách có thể tìm kiếm, lọc bác sĩ theo chuyên khoa hoặc từ khóa; hệ thống chỉ hiển thị bác sĩ đang hoạt động và đã được duyệt.

**(7) Hỏi đáp sức khỏe:** Bệnh nhân có thể gửi câu hỏi sức khỏe; bác sĩ có thể xem và phản hồi các câu hỏi được phân công; hệ thống quản lý vòng đời trạng thái câu hỏi từ PENDING đến ANSWERED hoặc CLOSED; quản trị viên có thể kiểm duyệt nội dung khi cần.

**(8) Đặt lịch hẹn tư vấn:** Bệnh nhân có thể đặt lịch tư vấn với bác sĩ theo khung giờ còn trống; hệ thống kiểm soát trùng lịch và quản lý vòng đời trạng thái lịch hẹn qua các trạng thái PENDING_CONFIRMATION, CONFIRMED, COMPLETED và CANCELLED.

**(9) Phiên tư vấn trực tuyến:** Bác sĩ và bệnh nhân có thể tham gia phiên tư vấn trực tuyến qua chat hoặc video; hệ thống hỗ trợ cơ chế dự phòng sang chat khi video không khả dụng; quyền truy cập phiên tư vấn được giới hạn đúng theo bệnh nhân và bác sĩ liên quan.

**(10) Kết quả tư vấn và đơn thuốc:** Bác sĩ có thể ghi nhận kết luận tư vấn và cấp đơn thuốc điện tử cơ bản; bệnh nhân chỉ được xem kết quả tư vấn và đơn thuốc gắn với các buổi tư vấn của chính mình.

**(11) Đánh giá chất lượng tư vấn:** Bệnh nhân có thể gửi đánh giá và nhận xét sau khi buổi tư vấn hoàn tất; hệ thống ngăn đánh giá cho lịch hẹn chưa hoàn tất; quản trị viên có thể kiểm duyệt nội dung đánh giá.

**(12) Thông báo và nhắc lịch:** Hệ thống gửi thông báo xác nhận lịch hẹn, thông báo nhắc lịch trước thời điểm tư vấn và thông báo khi có phản hồi câu hỏi mới thông qua email; có thể mở rộng sang SMS trong giai đoạn sau.

**(13) Quản trị hệ thống:** Quản trị viên có thể quản lý tài khoản bệnh nhân và bác sĩ, quản lý chuyên khoa, giám sát và quản lý lịch hẹn, kiểm duyệt nội dung tư vấn và xem dashboard thống kê hoạt động.

**(14) Báo cáo và thống kê:** Hệ thống cung cấp số liệu thống kê về hoạt động tư vấn theo thời gian dưới dạng biểu đồ và bảng số liệu; quản trị viên có thể lọc dữ liệu theo khoảng thời gian, bác sĩ, chuyên khoa hoặc trạng thái lịch hẹn.

**Định hướng đảm bảo chất lượng**

Nội dung đảm bảo chất lượng phần mềm là trọng tâm xuyên suốt của báo cáo. Nhóm tiếp cận theo quy trình gồm sáu bước: (i) phân tích yêu cầu dựa trên SRS và các tài liệu hỗ trợ; (ii) thiết kế use case và luồng nghiệp vụ cho từng nhóm actor; (iii) thiết kế giao diện, API và cơ sở dữ liệu theo hướng có khả năng kiểm thử; (iv) đặc tả test case áp dụng các kỹ thuật Black-box testing, White-box testing, Equivalence Partitioning, Boundary Value Analysis, Decision Table và Cause-Effect Graph; (v) định hướng automation test bằng Playwright cho các luồng E2E quan trọng; và (vi) xây dựng checklist rà soát bảo mật, phân quyền, audit log và quyền riêng tư dữ liệu sức khỏe.

Phần phân tích và đặc tả test case bao phủ đầy đủ các nhóm use case chính theo SRS cho cả bốn nhóm actor. Một số luồng E2E quan trọng như tra cứu bác sĩ, đặt lịch hẹn tư vấn, hỏi đáp sức khỏe và thực hiện phiên tư vấn được ưu tiên để minh họa kiểm thử tự động bằng Playwright khi hệ thống đã được tích hợp và sẵn sàng kiểm thử. Kết quả kiểm thử thực tế sẽ được cập nhật kèm minh chứng sau khi nhóm hoàn thành việc thực thi; báo cáo không ghi nhận kết quả nếu chưa có bằng chứng thực thi.

**Công nghệ sử dụng**

Frontend được xây dựng bằng React 18, TypeScript và Vite, sử dụng React Router v6 cho điều hướng, Redux Toolkit và Redux Saga cho quản lý trạng thái, Axios cho giao tiếp API, PrimeReact và Tailwind CSS cho giao diện người dùng, Formik và Yup cho xử lý form và kiểm tra dữ liệu đầu vào, i18next cho hỗ trợ đa ngôn ngữ và Recharts cho biểu đồ thống kê. Backend được xây dựng trên NestJS với Node.js và TypeScript, sử dụng PostgreSQL làm cơ sở dữ liệu quan hệ thông qua Prisma ORM, JWT kết hợp RBAC và ownership guard cho xác thực và phân quyền, WebSocket/Socket.IO cho phiên tư vấn thời gian thực và Swagger/OpenAPI cho tài liệu API. Công cụ kiểm thử bao gồm Playwright cho E2E automation test, Postman hoặc Jest/Supertest cho kiểm thử API và Jest cho unit test backend.

# CHƯƠNG I. TỔNG QUAN

## 1. Giới thiệu đề tài

Trong bối cảnh nhu cầu tiếp cận dịch vụ chăm sóc sức khỏe từ xa ngày càng tăng, các nền tảng tư vấn sức khỏe trực tuyến giữ vai trò quan trọng trong việc rút ngắn khoảng cách giữa bệnh nhân và bác sĩ. Người dùng có thể tìm kiếm bác sĩ theo chuyên khoa, gửi câu hỏi sức khỏe, đặt lịch tư vấn, nhận phản hồi chuyên môn và theo dõi lịch sử tư vấn trong một môi trường có kiểm soát. Đây là một hướng ứng dụng phù hợp với xu thế chuyển đổi số trong lĩnh vực y tế, đồng thời đặt ra nhiều yêu cầu nghiêm túc về bảo mật, quyền riêng tư, tính đúng đắn của luồng nghiệp vụ và độ tin cậy của hệ thống.

Đề tài xây dựng nền tảng tư vấn sức khỏe trực tuyến được thực hiện dựa trên tài liệu SRS của dự án Online Health Consultation Platform. Phạm vi MVP bao gồm các nhóm chức năng cốt lõi như truy cập công khai dành cho Guest User, quản lý tài khoản và phân quyền, quản lý hồ sơ bệnh nhân và bác sĩ, tìm kiếm bác sĩ, hỏi đáp sức khỏe, đặt lịch tư vấn, tư vấn trực tuyến qua chat hoặc video mô phỏng, ghi nhận kết quả tư vấn, đơn thuốc điện tử cơ bản, đánh giá chất lượng tư vấn, thông báo nhắc lịch và quản trị hệ thống.

Khác với một đề tài chỉ dừng lại ở việc phát triển chức năng, báo cáo này xem đảm bảo chất lượng phần mềm là một nội dung trọng tâm. Các yêu cầu chức năng và phi chức năng cần được phân tích theo khả năng kiểm thử, có tiêu chí chấp nhận rõ ràng, có chiến lược test phù hợp và có sự liên kết giữa yêu cầu, thiết kế, hiện thực và kiểm thử. Do đó, việc xây dựng hệ thống được đặt trong mối quan hệ chặt chẽ với hoạt động kiểm thử, rà soát chất lượng, kiểm soát truy cập, bảo vệ dữ liệu cá nhân và dữ liệu sức khỏe.

<!-- TODO: Insert Figure 1: Tổng quan quy trình tư vấn sức khỏe trực tuyến -->

### 1.1. Mục đích của đề tài

Mục đích của đề tài là xây dựng và đánh giá một nền tảng web hỗ trợ tư vấn sức khỏe trực tuyến theo phạm vi MVP đã được mô tả trong SRS. Hệ thống hướng đến việc cung cấp một môi trường để bệnh nhân có thể tìm kiếm bác sĩ, gửi câu hỏi, đặt lịch hẹn, tham gia tư vấn từ xa, nhận phản hồi chuyên môn và xem lại lịch sử tư vấn. Đồng thời, bác sĩ có thể quản lý hồ sơ chuyên môn, tiếp nhận và phản hồi câu hỏi, quản lý lịch tư vấn, thực hiện phiên tư vấn và ghi nhận kết quả tư vấn. Quản trị viên có vai trò quản lý người dùng, chuyên khoa, lịch hẹn, nội dung tư vấn và báo cáo hoạt động.

Bên cạnh mục đích xây dựng phần mềm, đề tài còn nhằm vận dụng các nguyên tắc kiểm thử và đảm bảo chất lượng phần mềm vào một hệ thống có dữ liệu nhạy cảm. Các yêu cầu về xác thực, phân quyền, quyền sở hữu dữ liệu, audit log, bảo vệ thông tin cá nhân và dữ liệu sức khỏe được xem là những nội dung quan trọng cần được kiểm tra. Theo tài liệu thiết kế, hệ thống sử dụng cơ chế JWT, RBAC, ownership guard và audit cho các hành động nhạy cảm; các nội dung này là cơ sở để xây dựng tiêu chí kiểm thử bảo mật và quyền truy cập trong các chương sau.

Thông qua đề tài, nhóm thực hiện có thể rèn luyện quy trình phát triển phần mềm có kiểm soát, từ khảo sát yêu cầu, phân tích nghiệp vụ, thiết kế kiến trúc, thiết kế cơ sở dữ liệu, đặc tả API, đến xây dựng testcases và đánh giá kết quả. Kết quả mong muốn là một báo cáo thể hiện được sự liên kết giữa yêu cầu SRS, thiết kế hệ thống, kỹ thuật kiểm thử và mức độ sẵn sàng của sản phẩm trong phạm vi MVP.

### 1.2. Mục tiêu

Mục tiêu tổng quát của đề tài là xây dựng cơ sở phân tích, thiết kế, triển khai và kiểm thử cho nền tảng tư vấn sức khỏe trực tuyến dựa trên SRS. Hệ thống cần hỗ trợ các tác nhân chính gồm Guest User, Patient, Doctor và Administrator, trong đó mỗi tác nhân có phạm vi thao tác và quyền truy cập khác nhau. Các chức năng được ưu tiên theo MVP gồm tra cứu bác sĩ, quản lý tài khoản, hồ sơ người dùng, hỏi đáp sức khỏe, đặt lịch tư vấn, tư vấn trực tuyến, ghi nhận kết quả, đánh giá, thông báo và quản trị.

Các mục tiêu cụ thể của đề tài gồm:

- Phân tích yêu cầu nghiệp vụ và yêu cầu chất lượng của hệ thống dựa trên tài liệu SRS và requirement baseline.
- Lựa chọn bốn ca sử dụng đại diện để mô tả chi tiết, gồm tra cứu bác sĩ của Guest User, đặt lịch hẹn của Patient, phản hồi câu hỏi của Doctor và thực hiện phiên tư vấn trực tuyến của Doctor.
- Thiết kế hệ thống theo hướng có khả năng mở rộng và kiểm thử được; theo tài liệu thiết kế, kiến trúc mục tiêu là modular monolith trên NestJS với các module như Identity, UserProfile, Specialty, Discovery, Question, Appointment, Consultation, Prescription, Rating, Notification, Admin và Reporting.
- Xác định các yêu cầu chất lượng quan trọng như bảo mật, quyền riêng tư, độ tin cậy, khả năng bảo trì, hiệu năng ở mức MVP và tính nhất quán của API.
- Xây dựng chiến lược kiểm thử dựa trên yêu cầu, bao gồm unit test, integration test, API/E2E test theo tài liệu thiết kế kiểm thử; áp dụng các kỹ thuật Black-box testing, White-box testing, Equivalence Partitioning, Boundary Value Analysis, Decision Table và các kỹ thuật phù hợp khác.
- Thiết lập nguyên tắc không ghi nhận kết quả kiểm thử nếu chưa có bằng chứng thực thi, từ đó bảo đảm tính trung thực của báo cáo.

Các mục tiêu trên giúp đề tài không chỉ mô tả sản phẩm phần mềm mà còn làm rõ cách thức đánh giá chất lượng sản phẩm. Đây là điểm quan trọng đối với một hệ thống liên quan đến thông tin sức khỏe, nơi sai sót về phân quyền, dữ liệu, lịch hẹn hoặc kết quả tư vấn có thể ảnh hưởng trực tiếp đến trải nghiệm và niềm tin của người dùng.

### 1.3. Phương pháp tiến hành

Để thực hiện đề tài, nhóm áp dụng phương pháp tiến hành theo các bước chính: khảo sát hiện trạng, nghiên cứu công nghệ, phát triển và đánh giá, cuối cùng là xác định kết quả kỳ vọng. Cách tiếp cận này giúp quá trình thực hiện có trình tự, có cơ sở tài liệu và phù hợp với yêu cầu kiểm thử phần mềm.

**Khảo sát hiện trạng**

Trước hết, nhóm khảo sát yêu cầu từ tài liệu SRS của nền tảng tư vấn sức khỏe trực tuyến. Nội dung khảo sát tập trung vào phạm vi MVP, các tác nhân sử dụng hệ thống, các ca sử dụng chính, yêu cầu chức năng và yêu cầu phi chức năng. Từ đó, nhóm xác định các luồng nghiệp vụ cần ưu tiên, đặc biệt là bốn ca sử dụng được chọn để phân tích và kiểm thử trong báo cáo. Ngoài SRS, nhóm tham khảo thêm các tài liệu baseline, current state review và implementation plan. Những thông tin phản ánh định hướng thiết kế hoặc kế hoạch triển khai nhưng chưa được kiểm chứng trực tiếp bằng mã nguồn được trình bày là theo tài liệu thiết kế.

**Nghiên cứu công nghệ**

Sau khi xác định phạm vi, nhóm nghiên cứu các công nghệ và kỹ thuật phù hợp với hệ thống. Theo tài liệu thiết kế, backend được định hướng xây dựng trên NestJS theo mô hình modular monolith; cơ sở dữ liệu sử dụng PostgreSQL; Prisma được dùng cho tầng truy cập dữ liệu; JWT, RBAC và ownership được sử dụng cho xác thực và phân quyền; notification có thể triển khai theo hướng outbox để tăng độ tin cậy; hệ thống vận hành cần có logging, audit, health check và cấu hình môi trường. Song song với công nghệ phát triển, nhóm nghiên cứu các kỹ thuật kiểm thử như Black-box testing, White-box testing, Equivalence Partitioning, Boundary Value Analysis, Decision Table và Cause-Effect Graph khi phù hợp với bài toán nghiệp vụ.

**Phát triển và đánh giá**

Quá trình phát triển được định hướng theo yêu cầu và khả năng kiểm thử. Các chức năng được phân chia theo nhóm nghiệp vụ như public discovery, identity, profile, question, appointment, consultation, prescription, rating, notification và administration. Theo tài liệu kế hoạch triển khai, hệ thống được chia thành các phase để giảm rủi ro và giúp mỗi giai đoạn có tiêu chí hoàn thành rõ ràng. Trong phần đánh giá, nhóm không chỉ kiểm tra chức năng hoạt động đúng theo yêu cầu mà còn xem xét các khía cạnh chất lượng như phân quyền, quyền sở hữu dữ liệu, kiểm soát trạng thái lịch hẹn, bảo vệ dữ liệu cá nhân, dữ liệu sức khỏe và khả năng xử lý lỗi. Các testcase sẽ được thiết kế dựa trên traceability giữa SRS, yêu cầu chức năng, API và luồng nghiệp vụ.

**Kết quả kỳ vọng**

Kết quả kỳ vọng của đề tài là một báo cáo hoàn chỉnh về quá trình xây dựng và kiểm thử nền tảng tư vấn sức khỏe trực tuyến. Báo cáo cần thể hiện được mối liên hệ giữa yêu cầu, thiết kế, triển khai và kiểm thử; mô tả rõ các ca sử dụng quan trọng; trình bày kỹ thuật kiểm thử được áp dụng; ghi nhận trung thực trạng thái kiểm thử và không tạo ra kết quả nếu chưa có bằng chứng. Về mặt hệ thống, sản phẩm kỳ vọng đáp ứng phạm vi MVP theo SRS, hỗ trợ các luồng nghiệp vụ chính cho Guest User, Patient, Doctor và Administrator, đồng thời có cơ sở để tiếp tục hoàn thiện về kiểm thử tự động, hiệu năng, vận hành và bảo mật trong các giai đoạn tiếp theo.

## 2. Vai trò và nhiệm vụ của mỗi thành viên

Để thực hiện đề tài theo định hướng vừa xây dựng phần mềm vừa đảm bảo chất lượng phần mềm, nhóm phân chia nhiệm vụ dựa trên các mảng công việc chính: phân tích SRS, phân tích luồng nghiệp vụ, phân tích use case, rà soát kiến trúc/API/cơ sở dữ liệu, xác định tiêu chí chất lượng, thiết kế checklist, thiết kế testcase, định hướng kiểm thử tự động, viết báo cáo và rà soát cuối. Việc phân công được thực hiện theo năng lực và mức độ trách nhiệm của từng thành viên, trong đó nhóm trưởng chịu trách nhiệm chính về định hướng chung, tích hợp nội dung và kiểm soát chất lượng báo cáo.

| STT | Họ và tên | MSSV | Vai trò | Nhiệm vụ thực hiện |
|---|---|---|---|---|
| 1 | Nguyễn Việt Thanh | K223DTCN436 | Nhóm trưởng | Phụ trách chính phân tích SRS, xác định phạm vi MVP, lựa chọn các use case trọng tâm, tổng hợp yêu cầu chất lượng phần mềm, rà soát kiến trúc/API/cơ sở dữ liệu, định hướng chiến lược kiểm thử và kiểm thử tự động, thiết kế khung checklist, phân công công việc, tích hợp nội dung từ các thành viên, chuẩn hóa văn phong học thuật và rà soát báo cáo cuối cùng. Đây là thành viên có trách nhiệm cao nhất và khối lượng công việc lớn nhất trong nhóm. |
| 2 | Trần Long Đại | K223DTCN439 | Thành viên | Hỗ trợ phân tích các luồng nghiệp vụ phía Patient, đặc biệt là đặt lịch tư vấn và gửi câu hỏi sức khỏe; hỗ trợ mô tả use case liên quan đến bệnh nhân; hỗ trợ đặc tả testcase chức năng, negative test và dữ liệu kiểm thử; tham gia xây dựng checklist rà soát yêu cầu và thiết kế. |
| 3 | Vũ Hải Minh | K223DTCN380 | Thành viên | Hỗ trợ phân tích các luồng nghiệp vụ phía Doctor và Administrator, gồm phản hồi câu hỏi sức khỏe, phiên tư vấn trực tuyến và quản trị hệ thống; hỗ trợ rà soát API, phân quyền, bảo mật dữ liệu và quyền sở hữu dữ liệu; hỗ trợ định hướng automation test, cách ghi nhận kết quả kiểm thử và các nội dung liên quan đến đảm bảo chất lượng. |

Với cách phân công trên, nhóm trưởng giữ vai trò điều phối và chịu trách nhiệm chính về tính thống nhất giữa yêu cầu nghiệp vụ, thiết kế kỹ thuật và đảm bảo chất lượng phần mềm. Các thành viên còn lại tập trung hỗ trợ phân tích theo từng nhóm tác nhân và từng luồng nghiệp vụ, từ đó giúp báo cáo bao phủ đầy đủ cả khía cạnh chức năng, phân quyền, dữ liệu và kiểm thử.

## 3. Cơ sở lý thuyết

Phần cơ sở lý thuyết trình bày các khái niệm, quy trình nghiệp vụ, quy tắc quản lý, đối tượng sử dụng và công nghệ nền tảng liên quan đến hệ thống tư vấn sức khỏe trực tuyến. Nội dung được xây dựng dựa trên tài liệu SRS, requirement baseline, ma trận xác thực - phân quyền, tài liệu quyền riêng tư, tài liệu triển khai - vận hành và việc rà soát source code hiện tại của repository.

### 3.1. Quy trình nghiệp vụ của hệ thống tư vấn sức khỏe trực tuyến

Theo tài liệu SRS, hệ thống tư vấn sức khỏe trực tuyến là một nền tảng web cho phép người dùng tìm kiếm bác sĩ, gửi câu hỏi sức khỏe, đặt lịch tư vấn, tham gia phiên tư vấn từ xa, nhận phản hồi chuyên môn và theo dõi lịch sử tư vấn trong môi trường an toàn. Trong phạm vi báo cáo, bốn quy trình nghiệp vụ chính được lựa chọn để phân tích và kiểm thử gồm: Guest User tra cứu bác sĩ và chuyển đổi sang đăng ký/đăng nhập; Patient đặt lịch hẹn tư vấn; Doctor phản hồi câu hỏi sức khỏe; Doctor thực hiện phiên tư vấn trực tuyến.

**Quy trình 1: Guest User tra cứu bác sĩ và chuyển đổi sang đăng ký/đăng nhập**

Người dùng khách truy cập các trang công khai của hệ thống mà không cần đăng nhập. Người dùng có thể xem thông tin giới thiệu nền tảng, danh sách chuyên khoa, danh sách bác sĩ và hồ sơ công khai của bác sĩ. Khi người dùng tìm kiếm bác sĩ theo chuyên khoa hoặc từ khóa, hệ thống trả về danh sách bác sĩ phù hợp trong phạm vi dữ liệu được phép công khai. Nếu Guest User chỉ xem thông tin, hệ thống không yêu cầu xác thực. Tuy nhiên, khi người dùng muốn thực hiện hành động cần bảo vệ như đặt lịch tư vấn hoặc gửi câu hỏi sức khỏe, hệ thống phải chuyển hướng sang luồng đăng ký hoặc đăng nhập. Sau khi xác thực thành công, người dùng có thể tiếp tục thao tác với vai trò Patient.

<!-- TODO: Insert Figure 2: Luồng Guest User tra cứu bác sĩ và chuyển đổi sang đăng ký/đăng nhập -->

**Quy trình 2: Patient đặt lịch hẹn tư vấn**

Patient là người dùng đã đăng ký và đăng nhập vào hệ thống. Quy trình đặt lịch bắt đầu khi Patient tìm kiếm bác sĩ theo chuyên khoa hoặc từ khóa, xem thông tin bác sĩ và lựa chọn khung giờ tư vấn phù hợp. Sau khi nhập thông tin cần thiết, hệ thống kiểm tra tính hợp lệ của dữ liệu, trạng thái xác thực, quyền truy cập và khả năng còn trống của lịch hẹn. Theo requirement baseline, hệ thống phải ngăn đặt lịch trùng giữa bác sĩ và bệnh nhân; khi khung giờ không hợp lệ hoặc đã được sử dụng, hệ thống cần trả về lỗi phù hợp. Khi đặt lịch thành công, lịch hẹn được ghi nhận với trạng thái nghiệp vụ tương ứng và có thể phát sinh thông báo xác nhận hoặc nhắc lịch theo tài liệu thiết kế.

<!-- TODO: Insert Figure 3: Luồng Patient đặt lịch hẹn tư vấn -->

**Quy trình 3: Doctor phản hồi câu hỏi sức khỏe**

Trong quy trình hỏi đáp sức khỏe, Patient gửi câu hỏi sau khi đăng nhập. Câu hỏi được hệ thống ghi nhận và chỉ được truy cập theo đúng phạm vi quyền. Doctor có thể xem các câu hỏi được phân công hoặc thuộc phạm vi được phép xử lý, sau đó nhập nội dung phản hồi chuyên môn. Theo requirement baseline, vòng đời trạng thái của câu hỏi có thể bao gồm các trạng thái như `PENDING`, `ANSWERED`, `CLOSED` hoặc trạng thái kiểm duyệt tùy quy tắc quản trị. Administrator có thể tham gia kiểm duyệt nội dung khi cần. Quy trình này cần được kiểm thử kỹ ở các điểm: quyền gửi câu hỏi, quyền xem câu hỏi, quyền phản hồi, trạng thái câu hỏi và khả năng bảo vệ dữ liệu sức khỏe của bệnh nhân.

<!-- TODO: Insert Figure 4: Luồng Doctor phản hồi câu hỏi sức khỏe -->

**Quy trình 4: Doctor thực hiện phiên tư vấn trực tuyến**

Phiên tư vấn trực tuyến diễn ra sau khi lịch hẹn hợp lệ được tạo và đến thời điểm tư vấn. Patient tham gia phiên tư vấn, Doctor bắt đầu hoặc tham gia phiên tư vấn, hai bên trao đổi qua chat hoặc video mô phỏng/tích hợp cơ bản theo phạm vi MVP. Theo tài liệu thiết kế, hệ thống có thể hỗ trợ WebSocket/Socket.IO cho trao đổi thời gian thực và có cơ chế fallback sang chat khi video không khả dụng. Sau phiên tư vấn, Doctor ghi nhận kết luận, hướng dẫn điều trị hoặc đơn thuốc điện tử cơ bản; Patient có thể xem lại kết quả tư vấn, đơn thuốc và đánh giá chất lượng tư vấn khi lịch hẹn đã hoàn tất. Quy trình này liên quan trực tiếp đến dữ liệu sức khỏe nên cần bảo đảm kiểm soát quyền truy cập, quyền sở hữu dữ liệu và lưu vết các hành động nhạy cảm.

<!-- TODO: Insert Figure 5: Luồng Doctor thực hiện phiên tư vấn trực tuyến -->

### 3.2. Các quy định/quy tắc quản lý/quy trình tại hệ thống tư vấn sức khỏe trực tuyến

Hệ thống tư vấn sức khỏe trực tuyến có đặc thù xử lý thông tin cá nhân và thông tin sức khỏe, vì vậy các quy tắc quản lý cần được xác định rõ trước khi thiết kế và kiểm thử. Theo ma trận xác thực - phân quyền, hệ thống sử dụng bốn lớp chính: xác thực người dùng, kiểm soát vai trò, kiểm soát quyền sở hữu/phạm vi dữ liệu và ghi audit cho hành động nhạy cảm. Theo tài liệu quyền riêng tư, các nguyên tắc quan trọng gồm thu thập dữ liệu tối thiểu, cấp quyền theo nhu cầu sử dụng, hạn chế ghi log dữ liệu nhạy cảm và bảo vệ dữ liệu sức khỏe.

Các quy tắc chính của hệ thống gồm:

- Các trang công khai như trang chủ, danh sách chuyên khoa và danh sách bác sĩ được phép truy cập bởi Guest User.
- Đặt lịch hẹn tư vấn là thao tác được bảo vệ và yêu cầu người dùng phải đăng nhập.
- Gửi câu hỏi sức khỏe là thao tác được bảo vệ và yêu cầu người dùng phải đăng nhập.
- Hệ thống phải áp dụng kiểm soát truy cập theo vai trò. Guest User, Patient, Doctor và Administrator có phạm vi thao tác khác nhau.
- Patient chỉ được truy cập hồ sơ, câu hỏi, lịch hẹn, kết quả tư vấn, đơn thuốc và đánh giá thuộc về chính mình; Patient không được truy cập thông tin sức khỏe của bệnh nhân khác.
- Doctor chỉ được truy cập hồ sơ chuyên môn của mình, các câu hỏi được phân công hoặc được phép xử lý, lịch hẹn và phiên tư vấn thuộc phạm vi phụ trách; Doctor không được truy cập câu hỏi hoặc lịch hẹn không được ủy quyền.
- Administrator có thể quản lý người dùng, chuyên khoa, lịch hẹn, kiểm duyệt nội dung và xem báo cáo, nhưng các hành động quản trị nhạy cảm cần được ghi audit.
- Hệ thống phải ngăn đặt trùng khung giờ tư vấn của bác sĩ hoặc bệnh nhân nhằm bảo đảm tính nhất quán nghiệp vụ.
- Dữ liệu liên quan đến sức khỏe, lịch sử tư vấn, kết luận tư vấn, đơn thuốc, thông tin cá nhân và thông tin xác thực phải được bảo vệ, hạn chế hiển thị sai phạm vi và không được ghi log thô khi không cần thiết.
- Theo tài liệu thiết kế, lỗi hệ thống cần được trả về theo định dạng nhất quán và không làm lộ thông tin nội bộ nhạy cảm.

Những quy tắc trên là cơ sở quan trọng để xây dựng testcases ở các chương sau. Đối với kỹ thuật kiểm thử hộp đen, các quy tắc này giúp xác định đầu vào hợp lệ, đầu vào không hợp lệ và kết quả mong đợi. Đối với kiểm thử bảng quyết định, các tổ hợp điều kiện như vai trò người dùng, trạng thái đăng nhập, quyền sở hữu dữ liệu và trạng thái lịch hẹn có thể được mô hình hóa thành các trường hợp kiểm thử cụ thể.

### 3.3. Đối tượng sử dụng

Theo SRS, hệ thống có bốn nhóm người dùng chính: Guest User, Patient, Doctor và Administrator. Mỗi nhóm người dùng có mục tiêu sử dụng, quyền thao tác và phạm vi dữ liệu khác nhau.

**Guest User**

Guest User là người dùng chưa đăng ký hoặc chưa đăng nhập. Nhóm người dùng này có thể truy cập các trang công khai, xem thông tin giới thiệu nền tảng, xem danh sách chuyên khoa, tìm kiếm bác sĩ và xem hồ sơ công khai của bác sĩ. Guest User không được thực hiện các thao tác được bảo vệ như đặt lịch tư vấn hoặc gửi câu hỏi sức khỏe. Khi thực hiện các thao tác này, hệ thống cần chuyển hướng người dùng đến trang đăng ký hoặc đăng nhập.

**Patient**

Patient là bệnh nhân sử dụng hệ thống để nhận tư vấn sức khỏe. Patient có thể đăng ký, đăng nhập, quản lý hồ sơ sức khỏe cá nhân, tìm kiếm bác sĩ, gửi câu hỏi sức khỏe, đặt lịch tư vấn, tham gia phiên tư vấn trực tuyến, xem phản hồi của bác sĩ, xem lịch sử tư vấn, xem đơn thuốc và đánh giá chất lượng tư vấn. Patient chỉ được truy cập dữ liệu thuộc về chính mình, trừ các thông tin công khai được hệ thống cho phép.

**Doctor**

Doctor là bác sĩ hoặc người cung cấp tư vấn chuyên môn trên nền tảng. Doctor có thể đăng nhập, quản lý hồ sơ chuyên môn, xem các câu hỏi được phân công, phản hồi câu hỏi sức khỏe, quản lý lịch tư vấn, xem các lịch hẹn của mình, bắt đầu hoặc tham gia phiên tư vấn, ghi nhận kết quả tư vấn và tạo đơn thuốc điện tử cơ bản. Doctor chỉ được truy cập câu hỏi, lịch hẹn và phiên tư vấn thuộc phạm vi được ủy quyền.

**Administrator**

Administrator là người vận hành và quản trị hệ thống. Administrator có thể quản lý tài khoản bác sĩ và bệnh nhân, quản lý chuyên khoa, giám sát lịch hẹn, kiểm duyệt nội dung tư vấn và phản hồi, xem báo cáo thống kê và theo dõi hoạt động hệ thống. Do Administrator có quyền rộng hơn các vai trò khác, các thao tác quản trị nhạy cảm cần có kiểm soát phân quyền và audit log theo tài liệu thiết kế.

### 3.4. Công nghệ hỗ trợ xây dựng phần mềm

Việc xác định công nghệ trong báo cáo được thực hiện theo ba mức độ: công nghệ đã được xác nhận trong source code backend hiện tại, công nghệ được nêu trong tài liệu thiết kế/SRS và công nghệ frontend được bổ sung theo thông tin frontend được cung cấp. Do Codex hiện đang chạy trong repository backend, các thông tin frontend dưới đây chưa được xác minh trực tiếp từ source code frontend tại thời điểm cập nhật báo cáo.

**Công nghệ backend**

Backend của hệ thống được xác nhận theo source code hiện tại là một dịch vụ NestJS sử dụng Node.js và TypeScript. Repository backend có `package.json`, README, `src/main.ts`, các module nghiệp vụ trong `src/modules`, cấu hình Prisma và Docker Compose cho PostgreSQL. Các thành phần như REST API, Swagger/OpenAPI, JWT authentication, RBAC/ownership guards, WebSocket/Socket.IO, validation, logging, notification scheduler và Prisma đều có dấu hiệu hiện diện trong source code hiện tại.

**Công nghệ frontend**

Theo thông tin frontend được cung cấp, frontend của dự án sử dụng React 18 kết hợp TypeScript và Vite. Việc điều hướng trang sử dụng React Router v6; quản lý trạng thái sử dụng Redux Toolkit và Redux Saga; giao tiếp API sử dụng Axios; giao diện sử dụng PrimeReact kết hợp Tailwind CSS; xử lý form sử dụng Formik và Yup; hỗ trợ đa ngôn ngữ sử dụng i18next với tiếng Việt và tiếng Anh (`vi`, `en`); biểu đồ và báo cáo sử dụng Recharts. Định hướng kiểm thử tự động E2E của báo cáo là Playwright.

Cấu trúc frontend được cung cấp gồm các thư mục chính như `src/apis/core`, `src/features/auth`, `src/features/patient`, `src/features/doctor`, `src/features/admin`, `src/redux`, `src/i18n`, `src/layouts` và `src/components`. Cách tổ chức này phù hợp với hướng chia module theo nghiệp vụ của hệ thống, đồng thời hỗ trợ việc thiết kế testcases theo từng nhóm tác nhân như Guest User, Patient, Doctor và Administrator.

**Tổng hợp công nghệ**

| Nhóm công nghệ | Công nghệ sử dụng | Mức độ xác nhận | Ghi chú |
|---|---|---|---|
| Frontend framework | React 18, TypeScript, Vite | Theo thông tin frontend được cung cấp | Codex đang chạy trong backend repository nên chưa xác minh trực tiếp từ source code frontend. |
| Frontend routing | React Router v6 | Theo thông tin frontend được cung cấp | Dùng cho điều hướng giữa các màn hình public, auth, patient, doctor, admin và reports. |
| Frontend state management | Redux Toolkit, Redux Saga | Theo thông tin frontend được cung cấp | Phục vụ quản lý trạng thái ứng dụng và các luồng bất đồng bộ. |
| Frontend API client | Axios | Theo thông tin frontend được cung cấp | Dùng để gọi REST API backend. |
| Frontend UI/CSS | PrimeReact, Tailwind CSS | Theo thông tin frontend được cung cấp | Dùng cho thành phần giao diện và styling responsive. |
| Frontend form validation | Formik, Yup | Theo thông tin frontend được cung cấp | Phù hợp với các form đăng nhập, đăng ký, đặt lịch, gửi câu hỏi, cập nhật hồ sơ. |
| Frontend i18n | i18next, `vi`, `en` | Theo thông tin frontend được cung cấp | Hỗ trợ tiếng Việt và tiếng Anh. |
| Frontend chart/reporting | Recharts | Theo thông tin frontend được cung cấp | Phù hợp với dashboard và báo cáo thống kê. |
| Backend | NestJS, Node.js, TypeScript | Theo source code hiện tại | `package.json`, README và `src/main.ts` xác nhận NestJS, TypeScript, REST API backend. |
| Kiến trúc backend | Modular monolith | Theo source code hiện tại và theo tài liệu thiết kế | README và `src/modules/*` thể hiện các module nghiệp vụ; tài liệu kiến trúc mô tả modular monolith và phân lớp module. |
| Database | PostgreSQL | Theo source code hiện tại và theo tài liệu thiết kế | `docker-compose.yml` sử dụng `postgres:15-alpine`; `prisma/schema.prisma` khai báo datasource PostgreSQL. |
| ORM | Prisma | Theo source code hiện tại | `@prisma/client`, `prisma`, `PrismaService`, schema và migrations xuất hiện trong repository. |
| Authentication | JWT, Passport JWT, bcryptjs | Theo source code hiện tại | `@nestjs/jwt`, `passport-jwt`, `JwtAuthGuard`, `JwtStrategy` và `bcryptjs` được dùng trong source code. |
| Authorization | RolesGuard, OwnershipGuard, RBAC và ownership | Theo source code hiện tại và theo tài liệu thiết kế | Source code có guards/decorators cho roles và ownership; tài liệu phân quyền mô tả RBAC, ownership và audit. |
| API documentation | Swagger/OpenAPI | Theo source code hiện tại | `@nestjs/swagger` và `SwaggerModule.setup('api/docs', ...)` được cấu hình trong `src/main.ts`. |
| Validation | class-validator, class-transformer, ValidationPipe | Theo source code hiện tại | DTO sử dụng `class-validator`; `src/main.ts` cấu hình `ValidationPipe`. |
| Real-time communication | WebSocket/Socket.IO | Theo source code hiện tại | `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io` và `consultation.gateway.ts` xuất hiện trong source code. |
| Notification scheduling | node-cron, EventEmitter | Theo source code hiện tại | `node-cron` xuất hiện trong notification scheduler; `@nestjs/event-emitter` được cấu hình trong AppModule. |
| Backend testing tools | Jest, ts-jest, @nestjs/testing | Theo source code hiện tại | `package.json` có scripts `test`, `test:watch` và dependencies liên quan đến Jest. Báo cáo không ghi kết quả test khi chưa có bằng chứng thực thi. |
| E2E automation testing | Playwright | Theo thông tin frontend được cung cấp và theo định hướng QA report | Báo cáo sử dụng Playwright làm định hướng kiểm thử E2E tự động. |
| Deployment/local environment | Docker Compose, PostgreSQL container | Theo source code hiện tại | `docker-compose.yml` cấu hình PostgreSQL local; tài liệu deployment mô tả môi trường development, staging, production. |
| Operations | Health check, metrics hooks, structured logging, backup/rollback | Theo source code hiện tại và theo tài liệu thiết kế | Source code có OperationsModule và request logging trong `src/main.ts`; backup/rollback là nội dung theo tài liệu thiết kế/vận hành. |
| Privacy/security controls | Audit sanitization, logging minimization, error hardening | Theo source code hiện tại và theo tài liệu thiết kế | `common/privacy/privacy.util.ts` và `PrismaService` có xử lý sanitize audit metadata; tài liệu privacy mô tả nguyên tắc và chính sách dữ liệu. |

Từ bảng trên có thể thấy repository hiện tại mà Codex đang truy cập tập trung vào backend service. Các công nghệ backend, cơ sở dữ liệu, ORM, xác thực, phân quyền, Swagger, WebSocket, validation, testing framework và Docker Compose được ghi nhận theo source code hiện tại. Phần frontend được bổ sung theo thông tin frontend được cung cấp và cần được kiểm chứng lại khi repository `OnlineHealthConsultation-Web` có sẵn trong môi trường làm việc. Định hướng kiểm thử E2E tự động của báo cáo là Playwright; nếu có bằng chứng thực thi Playwright ở giai đoạn cuối, báo cáo sẽ bổ sung kết quả kiểm thử tương ứng.

# CHƯƠNG II. PHÂN TÍCH & THIẾT KẾ HỆ THỐNG

## 1. Yêu cầu từ stake-holders (người sử dụng)

Trong giai đoạn phân tích yêu cầu, nhóm xác định các stake-holder chính của nền tảng tư vấn sức khỏe trực tuyến gồm: người dùng khách, bệnh nhân, bác sĩ, quản trị viên và người vận hành hệ thống. Các nhóm đối tượng này có mục tiêu sử dụng khác nhau nhưng cùng yêu cầu hệ thống phải dễ dùng, an toàn, phản hồi rõ ràng và bảo vệ dữ liệu sức khỏe. Việc thu thập yêu cầu được thực hiện dựa trên tài liệu SRS, requirement baseline, tài liệu traceability và các bằng chứng coverage hiện có của dự án.

Người dùng khách quan tâm đến khả năng truy cập nhanh các thông tin công khai như trang chủ, danh sách chuyên khoa, danh sách bác sĩ và hồ sơ công khai của bác sĩ mà không cần đăng nhập. Khi muốn đặt lịch hoặc gửi câu hỏi sức khỏe, người dùng cần được hướng dẫn rõ ràng sang bước đăng nhập hoặc đăng ký.

Bệnh nhân là nhóm người dùng trực tiếp sử dụng các chức năng chính của hệ thống. Nhóm này cần đặt lịch tư vấn nhanh, tránh thao tác phức tạp, nhận phản hồi rõ ràng khi lịch bị trùng hoặc dữ liệu không hợp lệ, gửi câu hỏi sức khỏe và theo dõi phản hồi của bác sĩ. Bệnh nhân cũng kỳ vọng các thông tin cá nhân, lịch sử tư vấn, câu hỏi sức khỏe và đơn thuốc được bảo vệ, chỉ hiển thị cho đúng người có quyền.

Bác sĩ cần quản lý lịch tư vấn, xem các lịch hẹn liên quan đến mình, phản hồi câu hỏi sức khỏe, thực hiện phiên tư vấn trực tuyến và ghi nhận kết quả tư vấn. Đối với bác sĩ, yêu cầu quan trọng là hệ thống phải hỗ trợ truy cập đúng phạm vi công việc, hiển thị thông tin cần thiết cho phiên tư vấn và ngăn truy cập các câu hỏi hoặc lịch hẹn không được ủy quyền.

Quản trị viên cần quản lý người dùng, bác sĩ, chuyên khoa, lịch hẹn và nội dung tư vấn. Ngoài ra, quản trị viên cần có khả năng kiểm duyệt nội dung, theo dõi báo cáo hoạt động và thực hiện các thao tác quản trị với cơ chế phân quyền rõ ràng. Người vận hành hệ thống quan tâm đến tính ổn định, khả năng theo dõi lỗi, bảo mật, audit log, cấu hình môi trường, backup và khả năng triển khai theo tài liệu vận hành.

### 1.1. Phỏng vấn trực tiếp để tìm ra các userstory

Để mô phỏng quá trình thu thập yêu cầu từ người sử dụng, nhóm tiến hành tổng hợp nhu cầu theo từng nhóm stake-holder dựa trên các ca sử dụng và yêu cầu đã được mô tả trong SRS. Kết quả phỏng vấn được trình bày theo phong cách học thuật, phản ánh các mong muốn chính của người dùng trong phạm vi MVP.

Đối với người dùng khách, nhu cầu nổi bật là có thể tìm kiếm bác sĩ và xem hồ sơ công khai mà không bị yêu cầu đăng nhập ngay từ đầu. Người dùng muốn hệ thống hiển thị danh sách chuyên khoa, danh sách bác sĩ, thông tin kinh nghiệm và hồ sơ cơ bản một cách dễ hiểu. Tuy nhiên, khi chuyển sang các thao tác có liên quan đến dữ liệu cá nhân hoặc nghiệp vụ y tế như đặt lịch tư vấn và gửi câu hỏi sức khỏe, người dùng chấp nhận yêu cầu đăng nhập nếu hệ thống thông báo rõ ràng và chuyển hướng thuận tiện.

Đối với bệnh nhân, kết quả khảo sát cho thấy người dùng mong muốn quy trình đặt lịch tư vấn diễn ra nhanh, bảo mật và có phản hồi rõ ràng. Bệnh nhân cần biết bác sĩ nào phù hợp, khung giờ nào còn trống, lịch hẹn đã được tạo hay chưa và phải làm gì nếu có lỗi trùng lịch. Ngoài ra, bệnh nhân muốn gửi câu hỏi sức khỏe, xem lại câu hỏi đã gửi, nhận phản hồi của bác sĩ và theo dõi kết quả tư vấn trong phạm vi dữ liệu của chính mình.

Đối với bác sĩ, nhu cầu chính là quản lý lịch làm việc, xem lịch hẹn được phân công, trả lời câu hỏi sức khỏe và thực hiện phiên tư vấn trực tuyến. Bác sĩ cần giao diện thể hiện rõ các lịch hẹn sắp tới, trạng thái phiên tư vấn, danh sách câu hỏi cần phản hồi và thông tin cần thiết để đưa ra kết luận tư vấn. Bác sĩ cũng yêu cầu hệ thống giới hạn truy cập theo phạm vi phụ trách nhằm tránh xem nhầm hoặc xử lý dữ liệu không được ủy quyền.

Đối với quản trị viên, nhu cầu tập trung vào quản lý dữ liệu nền tảng. Quản trị viên cần quản lý tài khoản bệnh nhân, bác sĩ, chuyên khoa, lịch hẹn và nội dung tư vấn. Đồng thời, quản trị viên cần có các chức năng kiểm duyệt nội dung, theo dõi báo cáo thống kê và giám sát hoạt động hệ thống. Với người vận hành hệ thống, các yêu cầu nổi bật là tính ổn định, khả năng ghi nhận lỗi, bảo vệ dữ liệu nhạy cảm, kiểm soát phân quyền và có thông tin phản hồi đủ rõ để hỗ trợ bảo trì.

Từ các kết quả trên, nhóm nhận thấy các yêu cầu phi chức năng như bảo mật, quyền riêng tư, độ tin cậy và thông báo lỗi rõ ràng có vai trò quan trọng tương đương với yêu cầu chức năng. Do đó, các user story được xây dựng không chỉ mô tả thao tác người dùng mà còn định hướng cho việc kiểm thử quyền truy cập, kiểm thử dữ liệu hợp lệ/không hợp lệ, kiểm thử trạng thái nghiệp vụ và kiểm thử phản hồi của hệ thống.

### 1.2. UserStory (đặc tả yêu cầu người dùng)

Bảng user story sau được xây dựng dựa trên SRS, requirement baseline và traceability giữa các nhóm use-case với FR-01 đến FR-13. Các user story được chọn nhằm bao phủ các luồng nghiệp vụ chính: truy cập công khai, xác thực, hồ sơ, tìm kiếm bác sĩ, hỏi đáp sức khỏe, đặt lịch tư vấn, phiên tư vấn trực tuyến, đơn thuốc, đánh giá, quản trị, báo cáo và vận hành.

| ID | User Story | Ưu tiên |
|---|---|---|
| US-01 | Là người dùng khách, tôi muốn xem trang chủ, danh sách chuyên khoa và danh sách bác sĩ công khai mà không cần đăng nhập để có thể tìm hiểu dịch vụ trước khi tạo tài khoản. | Cao |
| US-02 | Là người dùng khách, tôi muốn tìm kiếm bác sĩ theo chuyên khoa hoặc từ khóa và xem hồ sơ công khai của bác sĩ để lựa chọn bác sĩ phù hợp. | Cao |
| US-03 | Là người dùng khách, khi chọn đặt lịch hoặc gửi câu hỏi, tôi muốn được chuyển hướng sang đăng nhập/đăng ký để tiếp tục thao tác với vai trò bệnh nhân. | Cao |
| US-04 | Là bệnh nhân, tôi muốn đăng ký, đăng nhập và quản lý hồ sơ sức khỏe cá nhân để sử dụng các chức năng tư vấn một cách bảo mật. | Cao |
| US-05 | Là bệnh nhân, tôi muốn đặt lịch tư vấn với bác sĩ theo khung giờ còn trống để nhận được tư vấn đúng thời điểm mong muốn. | Cao |
| US-06 | Là bệnh nhân, tôi muốn hệ thống ngăn đặt lịch trùng và thông báo lỗi rõ ràng khi khung giờ không hợp lệ để tránh nhầm lẫn trong quá trình đặt lịch. | Cao |
| US-07 | Là bệnh nhân, tôi muốn gửi câu hỏi sức khỏe và xem phản hồi của bác sĩ để nhận được tư vấn ban đầu trước hoặc ngoài phiên tư vấn trực tuyến. | Cao |
| US-08 | Là bệnh nhân, tôi muốn xem lịch hẹn, lịch sử tư vấn, kết luận tư vấn và đơn thuốc của chính mình để theo dõi quá trình chăm sóc sức khỏe. | Cao |
| US-09 | Là bác sĩ, tôi muốn xem các câu hỏi được phân công và gửi phản hồi cho bệnh nhân để xử lý nhu cầu hỏi đáp sức khỏe. | Cao |
| US-10 | Là bác sĩ, tôi muốn quản lý lịch tư vấn, bắt đầu phiên tư vấn trực tuyến, trao đổi qua chat/video và ghi nhận kết quả tư vấn để hoàn tất quy trình khám tư vấn từ xa. | Cao |
| US-11 | Là quản trị viên, tôi muốn quản lý người dùng, bác sĩ, chuyên khoa, lịch hẹn và nội dung tư vấn để vận hành nền tảng đúng quy định. | Cao |
| US-12 | Là người vận hành hệ thống, tôi muốn hệ thống có phân quyền, audit log, thông báo lỗi rõ ràng, kiểm soát dữ liệu nhạy cảm và báo cáo hoạt động để hỗ trợ giám sát và bảo trì. | Trung bình |

### 1.3. Thiết kế Wireframe & Prototype

Thiết kế wireframe và prototype được định hướng theo các luồng nghiệp vụ chính của SRS và các user story đã xác định. Ở giai đoạn báo cáo hiện tại, nhóm chưa chèn hình ảnh giao diện thực tế mà chỉ đặt các TODO placeholder để bổ sung khi có wireframe, prototype hoặc screenshot phù hợp. Các màn hình dự kiến gồm:

- Trang chủ: giới thiệu nền tảng, chức năng chính, lối vào danh sách chuyên khoa và danh sách bác sĩ.
- Trang danh sách chuyên khoa: hiển thị các chuyên khoa đang hoạt động để người dùng lọc bác sĩ.
- Trang danh sách bác sĩ: hỗ trợ tìm kiếm, lọc theo chuyên khoa và xem thông tin tóm tắt.
- Trang chi tiết bác sĩ: hiển thị hồ sơ công khai, chuyên khoa, kinh nghiệm và thông tin lịch khả dụng nếu có.
- Trang đăng nhập/đăng ký: phục vụ xác thực người dùng trước khi thực hiện thao tác được bảo vệ.
- Trang đặt lịch tư vấn: cho phép bệnh nhân chọn bác sĩ, chọn khung giờ, nhập mô tả vấn đề sức khỏe và gửi yêu cầu đặt lịch.
- Trang gửi câu hỏi sức khỏe: cho phép bệnh nhân nhập câu hỏi và theo dõi trạng thái xử lý.
- Trang lịch hẹn của bệnh nhân: hiển thị các lịch hẹn sắp tới, lịch hẹn đã hoàn tất hoặc đã hủy.
- Trang quản lý lịch của bác sĩ: hỗ trợ bác sĩ xem lịch hẹn, xác nhận hoặc hoàn tất lịch tư vấn theo quyền.
- Trang phản hồi câu hỏi của bác sĩ: cho phép bác sĩ xem câu hỏi được phân công và nhập nội dung phản hồi.
- Trang phiên tư vấn trực tuyến: hỗ trợ chat/video theo phạm vi MVP, hiển thị trạng thái phiên và chức năng ghi nhận kết quả.
- Trang quản trị: hỗ trợ quản trị viên quản lý người dùng, bác sĩ, chuyên khoa, lịch hẹn, nội dung tư vấn và báo cáo.

<!-- TODO: Insert Figure 17: Wireframe Trang chủ -->

<!-- TODO: Insert Figure 18: Wireframe Trang danh sách chuyên khoa -->

<!-- TODO: Insert Figure 19: Wireframe Trang danh sách bác sĩ -->

<!-- TODO: Insert Figure 20: Wireframe Trang chi tiết bác sĩ -->

<!-- TODO: Insert Figure 21: Wireframe Trang đăng nhập/đăng ký -->

<!-- TODO: Insert Figure 22: Wireframe Trang đặt lịch tư vấn -->

<!-- TODO: Insert Figure 23: Wireframe Trang gửi câu hỏi sức khỏe -->

<!-- TODO: Insert Figure 24: Wireframe Trang lịch hẹn của bệnh nhân -->

<!-- TODO: Insert Figure 25: Wireframe Trang quản lý lịch của bác sĩ -->

<!-- TODO: Insert Figure 26: Wireframe Trang phản hồi câu hỏi của bác sĩ -->

<!-- TODO: Insert Figure 27: Wireframe Trang phiên tư vấn trực tuyến -->

<!-- TODO: Insert Figure 28: Wireframe Trang quản trị -->

## 2. Phân tích hệ thống

Phần phân tích hệ thống tập trung vào bốn use case trọng tâm đã được lựa chọn từ SRS. Đây là các luồng nghiệp vụ đại diện cho toàn bộ vòng đời sử dụng nền tảng: người dùng khách tra cứu bác sĩ, bệnh nhân đặt lịch tư vấn, bác sĩ phản hồi câu hỏi sức khỏe và bác sĩ thực hiện phiên tư vấn trực tuyến. Các use case được mô tả theo hướng có thể kiểm thử, bao gồm mục tiêu, actor, tiền điều kiện, luồng sự kiện chính, luồng phụ, hậu điều kiện và biểu đồ hoạt động. Các điều kiện về xác thực, phân quyền, ownership và bảo vệ dữ liệu được lồng ghép theo Auth Authorization Matrix và Privacy and Data Handling Guide.

### 2.1. Usecase Guest User tra cứu bác sĩ và chuyển đổi sang đăng ký/đăng nhập - UC01

<!-- TODO: Insert Figure 29: Usecase Guest User tra cứu bác sĩ và chuyển đổi sang đăng ký/đăng nhập - UC01 -->

Hình 29: Usecase Guest User tra cứu bác sĩ và chuyển đổi sang đăng ký/đăng nhập - UC01

**Mục tiêu**

Use case này cho phép người dùng chưa đăng nhập truy cập thông tin công khai của hệ thống, tìm kiếm bác sĩ theo chuyên khoa hoặc từ khóa, xem hồ sơ công khai của bác sĩ và được chuyển hướng sang đăng ký/đăng nhập khi thực hiện hành động cần xác thực như đặt lịch tư vấn hoặc gửi câu hỏi sức khỏe. Theo requirement baseline, Guest User chỉ được đọc dữ liệu public và không được thao tác với tài nguyên được bảo vệ.

**Actor**

- Actor chính: Guest User.
- Actor phụ: System, Authentication module.

**Tiền điều kiện**

- Hệ thống đang hoạt động và có thể hiển thị trang công khai.
- Người dùng chưa đăng nhập hoặc chưa có phiên xác thực hợp lệ.
- Dữ liệu chuyên khoa và hồ sơ bác sĩ công khai đã có trong hệ thống.
- Chỉ bác sĩ ở trạng thái active/approved mới được hiển thị ở khu vực public theo tài liệu yêu cầu.

**Luồng sự kiện chính**

1. Guest User truy cập trang chủ của hệ thống.
2. Hệ thống hiển thị nội dung giới thiệu, danh sách chuyên khoa và lối vào danh sách bác sĩ.
3. Guest User chọn xem danh sách chuyên khoa hoặc danh sách bác sĩ.
4. Hệ thống hiển thị dữ liệu public mà không yêu cầu token đăng nhập.
5. Guest User nhập từ khóa hoặc chọn chuyên khoa để tìm kiếm bác sĩ.
6. Hệ thống trả về danh sách bác sĩ phù hợp, chỉ bao gồm hồ sơ được phép công khai.
7. Guest User chọn một bác sĩ để xem chi tiết.
8. Hệ thống hiển thị hồ sơ công khai của bác sĩ, gồm thông tin cơ bản, chuyên khoa, kinh nghiệm và thông tin lịch khả dụng nếu được công khai.
9. Guest User chọn chức năng "Đặt lịch tư vấn" hoặc "Gửi câu hỏi sức khỏe".
10. Hệ thống kiểm tra trạng thái xác thực và xác định người dùng chưa đăng nhập.
11. Hệ thống chuyển hướng người dùng đến trang đăng nhập/đăng ký.
12. Sau khi đăng nhập hoặc đăng ký thành công, người dùng có thể tiếp tục luồng nghiệp vụ với vai trò Patient.

**Luồng phụ**

- 4a. Nếu không có dữ liệu chuyên khoa hoặc bác sĩ phù hợp, hệ thống hiển thị thông báo không tìm thấy kết quả và cho phép người dùng thay đổi điều kiện tìm kiếm.
- 6a. Nếu bác sĩ ở trạng thái inactive hoặc chưa approved, hệ thống không hiển thị hồ sơ đó trong danh sách public.
- 9a. Nếu Guest User chỉ xem thông tin và không thực hiện thao tác được bảo vệ, hệ thống không yêu cầu đăng nhập.
- 11a. Nếu đăng nhập/đăng ký thất bại, hệ thống hiển thị thông báo lỗi rõ ràng và không tạo phiên truy cập.

**Hậu điều kiện**

- Guest User xem được thông tin công khai hợp lệ.
- Không có dữ liệu sức khỏe hoặc dữ liệu cá nhân riêng tư nào bị hiển thị cho Guest User.
- Khi người dùng muốn đặt lịch hoặc gửi câu hỏi, hệ thống yêu cầu xác thực trước khi cho phép tiếp tục.
- Hành vi public access có thể kiểm thử bằng các API public discovery và các trường hợp protected action không có token.

**Biểu đồ hoạt động**

<!-- TODO: Insert Figure 30: Activity Diagram UC01 Guest User tra cứu bác sĩ và chuyển đổi sang đăng ký/đăng nhập -->

Hình 30: Biểu đồ hoạt động UC01 Guest User tra cứu bác sĩ và chuyển đổi sang đăng ký/đăng nhập

### 2.2. Usecase Patient đặt lịch hẹn tư vấn - UC02

<!-- TODO: Insert Figure 31: Usecase Patient đặt lịch hẹn tư vấn - UC02 -->

Hình 31: Usecase Patient đặt lịch hẹn tư vấn - UC02

**Mục tiêu**

Use case này cho phép Patient đặt lịch tư vấn với bác sĩ theo khung giờ phù hợp. Mục tiêu nghiệp vụ là tạo lịch hẹn hợp lệ, ngăn trùng lịch của bác sĩ hoặc bệnh nhân, bảo đảm chỉ người dùng đã đăng nhập với vai trò Patient mới được đặt lịch, đồng thời bảo vệ thông tin sức khỏe được nhập trong quá trình đặt lịch.

**Actor**

- Actor chính: Patient.
- Actor phụ: Doctor, System, Notification Service.

**Tiền điều kiện**

- Patient đã đăng nhập bằng tài khoản hợp lệ.
- Patient có quyền tạo và xem lịch hẹn của chính mình.
- Bác sĩ được chọn tồn tại, đang active/approved và có lịch khả dụng.
- Hệ thống có dữ liệu chuyên khoa, bác sĩ và khung giờ tư vấn.
- Hệ thống áp dụng RBAC và ownership theo Auth Authorization Matrix.

**Luồng sự kiện chính**

1. Patient đăng nhập vào hệ thống.
2. Patient truy cập danh sách bác sĩ hoặc tìm kiếm bác sĩ theo chuyên khoa/từ khóa.
3. Hệ thống hiển thị danh sách bác sĩ phù hợp cùng thông tin public và lịch khả dụng.
4. Patient chọn một bác sĩ để xem chi tiết.
5. Patient chọn ngày, giờ và khung thời lượng tư vấn.
6. Patient nhập lý do tư vấn hoặc mô tả vấn đề sức khỏe.
7. Hệ thống kiểm tra token đăng nhập và vai trò Patient.
8. Hệ thống kiểm tra dữ liệu đầu vào bắt buộc, định dạng ngày giờ và thời lượng tư vấn.
9. Hệ thống kiểm tra xung đột lịch của bác sĩ và bệnh nhân.
10. Nếu khung giờ hợp lệ, hệ thống tạo lịch hẹn với trạng thái ban đầu theo quy tắc nghiệp vụ, ví dụ `PENDING_CONFIRMATION` hoặc `CONFIRMED`.
11. Hệ thống lưu lịch hẹn trong phạm vi dữ liệu của Patient và Doctor liên quan.
12. Hệ thống ghi nhận sự kiện/thông báo xác nhận lịch hẹn theo tài liệu thiết kế.
13. Hệ thống hiển thị thông báo đặt lịch thành công cho Patient.

**Luồng phụ**

- 1a. Nếu người dùng chưa đăng nhập, hệ thống chuyển đến trang đăng nhập và không cho phép tạo lịch hẹn.
- 7a. Nếu người dùng đăng nhập nhưng không có vai trò Patient, hệ thống từ chối thao tác theo RBAC.
- 8a. Nếu dữ liệu đặt lịch thiếu hoặc sai định dạng, hệ thống hiển thị thông báo lỗi validation.
- 9a. Nếu khung giờ đã có lịch của bác sĩ hoặc Patient, hệ thống từ chối tạo lịch và trả thông báo trùng lịch.
- 9b. Nếu bác sĩ không active/approved hoặc không còn khả dụng, hệ thống không cho phép đặt lịch.
- 12a. Nếu thông báo gửi thất bại, lịch hẹn vẫn cần được lưu đúng trạng thái; lỗi thông báo được ghi nhận theo cơ chế notification/retry nếu có.

**Hậu điều kiện**

- Lịch hẹn hợp lệ được tạo và gắn với đúng Patient, Doctor, thời gian tư vấn.
- Không có lịch hẹn trùng khung giờ được tạo.
- Patient chỉ xem được lịch hẹn của chính mình; Doctor chỉ xem lịch hẹn thuộc phạm vi phụ trách; Admin có thể quản lý theo quyền.
- Dữ liệu sức khỏe trong lý do tư vấn được xử lý theo nguyên tắc tối thiểu hóa dữ liệu, least privilege và không ghi log thô khi không cần thiết.

**Biểu đồ hoạt động**

<!-- TODO: Insert Figure 32: Activity Diagram UC02 Patient đặt lịch hẹn tư vấn -->

Hình 32: Biểu đồ hoạt động UC02 Patient đặt lịch hẹn tư vấn

### 2.3. Usecase Doctor phản hồi câu hỏi sức khỏe - UC03

<!-- TODO: Insert Figure 33: Usecase Doctor phản hồi câu hỏi sức khỏe - UC03 -->

Hình 33: Usecase Doctor phản hồi câu hỏi sức khỏe - UC03

**Mục tiêu**

Use case này cho phép Doctor xem các câu hỏi sức khỏe thuộc phạm vi được phân công hoặc được phép xử lý và gửi phản hồi chuyên môn cho Patient. Mục tiêu kiểm thử là bảo đảm chỉ Patient đã đăng nhập mới tạo được câu hỏi, Doctor chỉ phản hồi câu hỏi được ủy quyền, trạng thái câu hỏi thay đổi hợp lệ và dữ liệu sức khỏe được bảo vệ.

**Actor**

- Actor chính: Doctor.
- Actor phụ: Patient, Administrator, System, Notification Service.

**Tiền điều kiện**

- Doctor đã đăng nhập bằng tài khoản hợp lệ và có vai trò Doctor.
- Câu hỏi sức khỏe đã được Patient tạo trước đó.
- Câu hỏi đang ở trạng thái có thể phản hồi, ví dụ `PENDING`.
- Doctor có quyền xem/trả lời câu hỏi theo phân công hoặc phạm vi hệ thống cho phép.
- Hệ thống áp dụng ownership/scope và không cho phép Doctor truy cập câu hỏi không được ủy quyền.

**Luồng sự kiện chính**

1. Doctor đăng nhập vào hệ thống.
2. Doctor truy cập màn hình danh sách câu hỏi được phân công hoặc có thể xử lý.
3. Hệ thống kiểm tra token, vai trò Doctor và phạm vi dữ liệu được phép truy cập.
4. Hệ thống hiển thị danh sách câu hỏi hợp lệ, không hiển thị câu hỏi ngoài phạm vi.
5. Doctor chọn một câu hỏi cần phản hồi.
6. Hệ thống hiển thị nội dung câu hỏi và thông tin cần thiết theo nguyên tắc tối thiểu hóa dữ liệu.
7. Doctor nhập nội dung phản hồi.
8. Hệ thống kiểm tra dữ liệu phản hồi không rỗng và hợp lệ.
9. Hệ thống lưu phản hồi của Doctor.
10. Hệ thống cập nhật trạng thái câu hỏi, ví dụ từ `PENDING` sang `ANSWERED`.
11. Hệ thống ghi audit cho hành động phản hồi câu hỏi nếu thuộc nhóm hành động nhạy cảm theo tài liệu thiết kế.
12. Hệ thống tạo thông báo cho Patient biết câu hỏi đã được phản hồi.
13. Hệ thống hiển thị thông báo phản hồi thành công cho Doctor.

**Luồng phụ**

- 1a. Nếu Doctor chưa đăng nhập, hệ thống yêu cầu đăng nhập.
- 3a. Nếu người dùng không có vai trò Doctor, hệ thống từ chối truy cập.
- 4a. Nếu không có câu hỏi nào được phân công, hệ thống hiển thị danh sách rỗng và thông báo phù hợp.
- 5a. Nếu Doctor chọn câu hỏi không thuộc phạm vi được ủy quyền, hệ thống từ chối truy cập.
- 8a. Nếu nội dung phản hồi rỗng hoặc không hợp lệ, hệ thống hiển thị lỗi validation và không cập nhật trạng thái câu hỏi.
- 10a. Nếu câu hỏi đã ở trạng thái `ANSWERED`, `CLOSED` hoặc `MODERATED` không cho phép phản hồi tiếp, hệ thống từ chối thao tác.
- 12a. Nếu notification thất bại, phản hồi vẫn được lưu nếu giao dịch nghiệp vụ chính thành công; lỗi thông báo được ghi nhận theo cơ chế vận hành.

**Hậu điều kiện**

- Câu hỏi có phản hồi hợp lệ của Doctor.
- Trạng thái câu hỏi được cập nhật đúng quy tắc.
- Patient có thể xem phản hồi của câu hỏi thuộc về chính mình.
- Doctor không truy cập được câu hỏi ngoài phạm vi được ủy quyền.
- Dữ liệu sức khỏe trong câu hỏi và phản hồi được bảo vệ theo chính sách privacy.

**Biểu đồ hoạt động**

<!-- TODO: Insert Figure 34: Activity Diagram UC03 Doctor phản hồi câu hỏi sức khỏe -->

Hình 34: Biểu đồ hoạt động UC03 Doctor phản hồi câu hỏi sức khỏe

### 2.4. Usecase Doctor thực hiện phiên tư vấn trực tuyến - UC04

<!-- TODO: Insert Figure 35: Usecase Doctor thực hiện phiên tư vấn trực tuyến - UC04 -->

Hình 35: Usecase Doctor thực hiện phiên tư vấn trực tuyến - UC04

**Mục tiêu**

Use case này mô tả quá trình Doctor thực hiện phiên tư vấn trực tuyến với Patient dựa trên lịch hẹn hợp lệ. Mục tiêu là bảo đảm phiên tư vấn chỉ được bắt đầu hoặc tham gia bởi đúng Patient và Doctor liên quan, có kiểm soát thời điểm/appointment hợp lệ, hỗ trợ trao đổi qua chat hoặc video mô phỏng/cơ bản, cho phép Doctor ghi kết luận và đơn thuốc điện tử cơ bản, đồng thời bảo vệ dữ liệu tư vấn.

**Actor**

- Actor chính: Doctor.
- Actor phụ: Patient, System, Video Communication Service, Notification Service.

**Tiền điều kiện**

- Doctor đã đăng nhập và có vai trò Doctor.
- Patient đã có lịch hẹn hợp lệ với Doctor.
- Lịch hẹn đang ở trạng thái cho phép tư vấn, ví dụ `CONFIRMED`.
- Phiên tư vấn gắn với appointment hợp lệ.
- Doctor chỉ được truy cập phiên tư vấn thuộc lịch hẹn của mình; Patient chỉ được tham gia phiên tư vấn của chính mình.
- Hệ thống có chính sách bảo vệ dữ liệu tư vấn, kết luận và đơn thuốc.

**Luồng sự kiện chính**

1. Doctor đăng nhập vào hệ thống.
2. Doctor mở danh sách lịch hẹn tư vấn của mình.
3. Hệ thống kiểm tra token, vai trò Doctor và ownership đối với lịch hẹn.
4. Doctor chọn lịch hẹn đã xác nhận để bắt đầu hoặc tham gia phiên tư vấn.
5. Hệ thống kiểm tra appointment hợp lệ, trạng thái lịch hẹn và thời điểm cho phép tham gia.
6. Hệ thống tạo hoặc mở phiên tư vấn tương ứng với appointment.
7. Patient tham gia phiên tư vấn bằng tài khoản hợp lệ của chính mình.
8. Doctor và Patient trao đổi qua chat hoặc video theo phạm vi MVP.
9. Nếu video không khả dụng, hệ thống fallback sang chat theo tài liệu thiết kế.
10. Sau khi tư vấn, Doctor nhập kết luận/tóm tắt tư vấn.
11. Nếu cần, Doctor nhập đơn thuốc điện tử cơ bản gồm tên thuốc, liều, tần suất và thời lượng.
12. Hệ thống kiểm tra dữ liệu kết luận và đơn thuốc hợp lệ.
13. Hệ thống lưu kết quả tư vấn, đơn thuốc và cập nhật trạng thái phiên/lịch hẹn theo quy tắc nghiệp vụ.
14. Hệ thống ghi audit cho các hành động nhạy cảm như cập nhật summary/prescription.
15. Hệ thống cho phép Patient xem kết quả tư vấn và đơn thuốc thuộc về chính mình.

**Luồng phụ**

- 3a. Nếu người dùng không phải Doctor hoặc không phụ trách lịch hẹn, hệ thống từ chối truy cập.
- 5a. Nếu appointment không tồn tại, không thuộc Doctor hoặc chưa ở trạng thái cho phép tư vấn, hệ thống không tạo/join session.
- 5b. Nếu người dùng tham gia ngoài khung thời gian cho phép theo cấu hình, hệ thống hiển thị thông báo phù hợp.
- 7a. Nếu Patient không phải chủ sở hữu lịch hẹn, hệ thống từ chối tham gia phiên.
- 8a. Nếu kết nối chat hoặc video gặp lỗi, hệ thống thông báo lỗi rõ ràng và ưu tiên fallback để phiên tư vấn vẫn có thể tiếp tục khi phù hợp.
- 11a. Nếu đơn thuốc thiếu các trường bắt buộc, hệ thống hiển thị lỗi validation và không lưu đơn thuốc.
- 13a. Nếu lưu kết quả tư vấn thất bại, hệ thống không được hiển thị kết quả chưa được ghi nhận thành công.

**Hậu điều kiện**

- Phiên tư vấn được tạo/tham gia đúng với appointment hợp lệ.
- Nội dung chat, kết luận tư vấn và đơn thuốc được lưu trong phạm vi quyền truy cập hợp lệ.
- Patient chỉ xem kết quả tư vấn và đơn thuốc của chính mình.
- Doctor chỉ cập nhật kết quả tư vấn cho lịch hẹn thuộc phạm vi phụ trách.
- Hành động cập nhật kết luận/đơn thuốc được ghi nhận theo yêu cầu audit nếu được triển khai.
- Dữ liệu sức khỏe và prescription content được bảo vệ theo Privacy and Data Handling Guide.

**Biểu đồ hoạt động**

<!-- TODO: Insert Figure 36: Activity Diagram UC04 Doctor thực hiện phiên tư vấn trực tuyến -->

Hình 36: Biểu đồ hoạt động UC04 Doctor thực hiện phiên tư vấn trực tuyến

### 2.5. Định nghĩa các yêu cầu chất lượng phần mềm

**Mục tiêu**

Việc định nghĩa yêu cầu chất lượng phần mềm nhằm bảo đảm hệ thống không chỉ đáp ứng đúng chức năng theo SRS mà còn phù hợp với bối cảnh sử dụng thực tế của nền tảng tư vấn sức khỏe trực tuyến. Do hệ thống xử lý thông tin cá nhân và dữ liệu sức khỏe, các yêu cầu về bảo mật, quyền riêng tư, phân quyền, tính đúng đắn của luồng nghiệp vụ, xử lý lỗi, hiệu năng và khả năng kiểm thử cần được xác định rõ ngay trong giai đoạn phân tích. Các yêu cầu dưới đây được tổng hợp từ SRS, requirement baseline, auth authorization matrix, privacy guide, test strategy, architecture overview và deployment/operations guide.

**a. Yêu cầu từ môi trường nghiệp vụ (business)**

Các yêu cầu từ môi trường nghiệp vụ tập trung vào bốn use case chính của báo cáo. Mỗi yêu cầu được viết theo hướng có thể kiểm thử, giúp nhóm thiết kế testcase chức năng, testcase luồng phụ và testcase phân quyền ở các chương sau.

| Usecase | Req-ID | Nội dung yêu cầu | Stake-holder |
|---|---|---|---|
| UC01: Guest User tra cứu bác sĩ và chuyển đổi sang đăng ký/đăng nhập | F01.1 | Hệ thống phải cho phép Guest User truy cập trang chủ, danh sách chuyên khoa, danh sách bác sĩ và hồ sơ công khai của bác sĩ mà không yêu cầu đăng nhập. | Người dùng khách |
| UC01: Guest User tra cứu bác sĩ và chuyển đổi sang đăng ký/đăng nhập | F01.2 | Hệ thống chỉ hiển thị bác sĩ đủ điều kiện công khai, ví dụ bác sĩ đang active/approved theo tài liệu yêu cầu. | Người dùng khách, Quản trị viên |
| UC01: Guest User tra cứu bác sĩ và chuyển đổi sang đăng ký/đăng nhập | F01.3 | Khi Guest User thực hiện thao tác được bảo vệ như đặt lịch tư vấn hoặc gửi câu hỏi sức khỏe, hệ thống phải chuyển hướng sang đăng nhập/đăng ký và không cho phép thao tác nếu chưa xác thực. | Người dùng khách, Bệnh nhân |
| UC02: Patient đặt lịch hẹn tư vấn | F02.1 | Hệ thống phải yêu cầu người dùng đăng nhập với vai trò Patient trước khi đặt lịch tư vấn. | Bệnh nhân |
| UC02: Patient đặt lịch hẹn tư vấn | F02.2 | Hệ thống phải kiểm tra tính hợp lệ của dữ liệu đặt lịch, bao gồm bác sĩ, thời gian, thời lượng và lý do tư vấn nếu được nhập. | Bệnh nhân, Bác sĩ |
| UC02: Patient đặt lịch hẹn tư vấn | F02.3 | Hệ thống phải ngăn đặt trùng khung giờ của bác sĩ hoặc bệnh nhân và hiển thị thông báo lỗi rõ ràng khi xảy ra xung đột lịch. | Bệnh nhân, Bác sĩ, Người vận hành hệ thống |
| UC03: Doctor phản hồi câu hỏi sức khỏe | F03.1 | Hệ thống chỉ cho phép Patient đã đăng nhập gửi câu hỏi sức khỏe và chỉ cho phép Patient xem câu hỏi thuộc về chính mình. | Bệnh nhân |
| UC03: Doctor phản hồi câu hỏi sức khỏe | F03.2 | Hệ thống chỉ cho phép Doctor xem và phản hồi các câu hỏi được phân công hoặc nằm trong phạm vi được ủy quyền. | Bác sĩ |
| UC03: Doctor phản hồi câu hỏi sức khỏe | F03.3 | Khi Doctor phản hồi câu hỏi hợp lệ, hệ thống phải lưu phản hồi, cập nhật trạng thái câu hỏi theo quy tắc nghiệp vụ và thông báo cho Patient nếu có cơ chế thông báo. | Bác sĩ, Bệnh nhân |
| UC04: Doctor thực hiện phiên tư vấn trực tuyến | F04.1 | Hệ thống chỉ cho phép Doctor và Patient liên quan đến appointment hợp lệ tham gia phiên tư vấn trực tuyến. | Bác sĩ, Bệnh nhân |
| UC04: Doctor thực hiện phiên tư vấn trực tuyến | F04.2 | Hệ thống phải hỗ trợ phiên tư vấn qua chat và theo thiết kế có thể fallback sang chat khi video không khả dụng trong phạm vi MVP. | Bác sĩ, Bệnh nhân, Người vận hành hệ thống |
| UC04: Doctor thực hiện phiên tư vấn trực tuyến | F04.3 | Hệ thống phải cho phép Doctor ghi kết luận tư vấn và đơn thuốc điện tử cơ bản; Patient chỉ được xem kết quả tư vấn và đơn thuốc của chính mình. | Bác sĩ, Bệnh nhân |

**b. Yêu cầu từ môi trường vận hành (operation)**

Trong môi trường vận hành, hệ thống cần duy trì an toàn dữ liệu, phản hồi ổn định và có khả năng hỗ trợ xử lý sự cố. Các yêu cầu dưới đây được dùng làm cơ sở cho kiểm thử phi chức năng và kiểm thử hồi quy ở các giai đoạn sau.

- **Bảo mật:** Tất cả endpoint được bảo vệ phải yêu cầu xác thực hợp lệ. Theo tài liệu phân quyền, hệ thống cần có lớp authentication, RBAC, ownership/scope và audit cho hành động nhạy cảm. Mật khẩu, token và thông tin xác thực không được trả về trong API response.
- **Quyền riêng tư dữ liệu sức khỏe:** Dữ liệu sức khỏe như medical history, câu hỏi sức khỏe, kết luận tư vấn, đơn thuốc và lịch sử tư vấn chỉ được hiển thị cho đúng chủ thể, bác sĩ phụ trách hoặc quản trị viên theo policy. Hệ thống cần hạn chế ghi log dữ liệu nhạy cảm và áp dụng nguyên tắc data minimization.
- **Phân quyền:** Guest User chỉ được đọc dữ liệu public; Patient chỉ thao tác trên dữ liệu của chính mình; Doctor chỉ thao tác trên hồ sơ, câu hỏi, lịch hẹn và phiên tư vấn thuộc phạm vi phụ trách; Administrator được quản lý toàn cục nhưng các hành động nhạy cảm cần được audit.
- **Kiểm tra dữ liệu nhập:** Các form và API như đăng nhập, đặt lịch, gửi câu hỏi, phản hồi câu hỏi, nhập kết luận và nhập đơn thuốc phải kiểm tra dữ liệu bắt buộc, định dạng, độ dài và trạng thái nghiệp vụ trước khi xử lý.
- **Xử lý lỗi:** Lỗi validation, lỗi xác thực, lỗi phân quyền, lỗi không tìm thấy dữ liệu và lỗi xung đột lịch phải có thông báo rõ ràng. Theo thiết kế, response lỗi cần nhất quán và không làm lộ thông tin nội bộ nhạy cảm.
- **Hiệu năng API trong môi trường MVP:** Theo requirement baseline, API thông thường trong môi trường MVP hướng đến mục tiêu P95 dưới 3 giây ở mức tải phù hợp. Đây là mục tiêu chất lượng cần được kiểm chứng bằng smoke benchmark hoặc kiểm thử hiệu năng nếu có điều kiện thực hiện.
- **Tính sẵn sàng và fallback chat/video:** Phiên tư vấn trực tuyến cần ưu tiên duy trì khả năng tư vấn. Theo thiết kế, khi video không khả dụng, hệ thống có thể fallback sang chat để người dùng vẫn tiếp tục phiên tư vấn trong phạm vi MVP.
- **Tính khả dụng của giao diện:** Giao diện cần hỗ trợ các luồng chính một cách dễ hiểu, có phản hồi rõ ràng sau thao tác, phù hợp cho người dùng khách, bệnh nhân, bác sĩ và quản trị viên. Theo SRS, giao diện hướng đến responsive cho desktop, tablet và mobile; chi tiết frontend cần được kiểm chứng thêm khi repository frontend có sẵn.

**c. Yêu cầu từ môi trường phát triển (development)**

Trong môi trường phát triển, yêu cầu chất lượng tập trung vào khả năng bảo trì, khả năng kiểm thử, khả năng triển khai và tính nhất quán giữa frontend, backend, API và cơ sở dữ liệu. Các yêu cầu này giúp nhóm phát triển kiểm soát rủi ro khi mở rộng hệ thống.

- **ReactJS frontend:** Frontend ReactJS được xác định theo thông tin frontend được cung cấp và được xem là công nghệ dự kiến/được cung cấp cho báo cáo. Phần này cần được xác minh lại khi repository `OnlineHealthConsultation-Web` có sẵn trong môi trường làm việc.
- **Node.js backend:** Backend hiện tại được xác nhận trong repository là NestJS trên Node.js và TypeScript. Backend cần duy trì cấu trúc module rõ ràng, có validation, exception filter, logging và Swagger/OpenAPI phục vụ kiểm thử API.
- **Relational database:** Theo source code hiện tại và tài liệu thiết kế, hệ thống sử dụng PostgreSQL thông qua Prisma. Cơ sở dữ liệu quan hệ phù hợp với các ràng buộc nghiệp vụ như user, profile, question, appointment, consultation, prescription, rating, notification và audit log.
- **RESTful API:** API cần có cấu trúc nhất quán, có version/prefix phù hợp, có response và error format rõ ràng theo thiết kế. Các API phải hỗ trợ traceability từ FR/use case đến testcase.
- **Modular design:** Theo Architecture Overview, hệ thống định hướng modular monolith với các module như Identity, UserProfile, Specialty, Discovery, Question, Appointment, Consultation, Prescription, Rating, Notification, Admin và Reporting. Cấu trúc module giúp giảm phụ thuộc chéo và tăng khả năng bảo trì.
- **Logging and configuration:** Môi trường phát triển và vận hành cần có cấu hình qua biến môi trường, request logging, request id, health check và nguyên tắc không ghi log thô dữ liệu nhạy cảm. Các nội dung backup/rollback, monitoring nâng cao được xem là theo thiết kế nếu chưa có bằng chứng triển khai trực tiếp.
- **Testability:** Các use case cần được mô tả theo hướng có thể kiểm thử bằng unit test, integration test và API/E2E test. Test strategy đã gợi ý các test suite như public discovery, auth, questions, appointments, consultations, prescriptions, notifications và admin operations.
- **Automated testing readiness:** Hệ thống cần sẵn sàng cho kiểm thử tự động. Backend hiện có Jest/ts-jest theo source code; E2E frontend theo định hướng báo cáo là Playwright dựa trên thông tin frontend được cung cấp. Báo cáo không ghi nhận kết quả automation nếu chưa có bằng chứng thực thi.

## 3. Thiết kế hệ thống

### 3.1. Kiến trúc hệ thống

Theo tài liệu Architecture Overview, hệ thống được định hướng theo kiến trúc modular monolith trên NestJS, chia thành các module nghiệp vụ như Identity, UserProfile, Specialty, Discovery, Question, Appointment, Consultation, Prescription, Rating, Notification, Admin và Reporting. Kiến trúc này phù hợp với phạm vi MVP vì vẫn giữ được sự đơn giản khi triển khai nhưng có ranh giới module rõ ràng để mở rộng và kiểm thử từng phần.

<!-- TODO: Insert Figure: Kiến trúc hệ thống 3 tầng -->

Hình 37: Kiến trúc hệ thống 3 tầng

**a. Tầng Presentation - Client**

Tầng Presentation là nơi người dùng tương tác trực tiếp với hệ thống. Theo thông tin frontend được cung cấp, client dự kiến sử dụng React 18, TypeScript, Vite, React Router, Redux Toolkit/Saga, Axios, PrimeReact và Tailwind CSS. Tầng này chịu trách nhiệm hiển thị giao diện, nhận dữ liệu từ người dùng, kiểm tra hợp lệ ở mức giao diện, điều hướng giữa các màn hình như trang chủ, danh sách bác sĩ, đặt lịch, gửi câu hỏi, phiên tư vấn và trang quản trị.

Do Codex hiện đang chạy trong repository backend, thông tin frontend được ghi nhận là theo thông tin frontend được cung cấp và cần được kiểm chứng thêm khi repository `OnlineHealthConsultation-Web` có sẵn. Về mặt thiết kế, tầng client giao tiếp với backend thông qua RESTful API và, với phiên tư vấn trực tuyến, có thể giao tiếp thời gian thực qua WebSocket/Socket.IO.

**b. Tầng Business Logic - Server**

Tầng Business Logic là backend service. Theo source code hiện tại, backend được xây dựng bằng NestJS trên Node.js và TypeScript. `src/main.ts` cấu hình global prefix `/api`, Swagger/OpenAPI tại `/api/docs`, ValidationPipe, exception filter, CORS và request logging. Các controller trong source code xác nhận những nhóm API chính như public discovery, auth, appointments, questions, consultations, ratings, notifications, reports và admin operations.

Tầng server xử lý các quy tắc nghiệp vụ như xác thực, phân quyền, ownership, tìm kiếm bác sĩ, đặt lịch, chống trùng lịch, phản hồi câu hỏi, phiên tư vấn, ghi kết luận, đơn thuốc cơ bản và thông báo. Theo tài liệu thiết kế, bên trong mỗi module có thể phân lớp theo presentation, application, domain và infrastructure để tăng khả năng bảo trì.

**c. Tầng Data Access - Database**

Tầng Data Access chịu trách nhiệm lưu trữ và truy xuất dữ liệu. Theo source code hiện tại và tài liệu thiết kế, hệ thống sử dụng PostgreSQL và Prisma ORM. Cơ sở dữ liệu quan hệ phù hợp với các bảng nghiệp vụ như users, patient profiles, doctor profiles, specialties, questions, appointments, consultation sessions, prescriptions, ratings, notification logs và audit logs.

Tầng này cần bảo đảm ràng buộc dữ liệu, tính nhất quán giao dịch và truy vấn đúng phạm vi quyền. Đối với dữ liệu nhạy cảm như thông tin cá nhân, lịch sử tư vấn, đơn thuốc và audit metadata, hệ thống cần tuân thủ nguyên tắc tối thiểu hóa dữ liệu và không ghi log thô thông tin nhạy cảm khi không cần thiết.

**d. Tầng tích hợp dịch vụ ngoài**

Theo SRS và tài liệu thiết kế, hệ thống có thể tích hợp các dịch vụ ngoài gồm Notification Service, Video Communication Service và File Storage Service. Notification Service phục vụ xác nhận lịch hẹn, nhắc lịch và thông báo khi có phản hồi mới. Video Communication Service phục vụ phiên tư vấn video ở mức mô phỏng hoặc tích hợp cơ bản trong phạm vi MVP; khi video không khả dụng, hệ thống theo thiết kế có thể fallback sang chat. File Storage Service phục vụ lưu trữ tệp đính kèm như tài liệu sức khỏe hoặc hình ảnh, tuy nhiên phần này được ghi nhận theo thiết kế nếu chưa có bằng chứng triển khai trực tiếp trong source code hiện tại.

Kiến trúc trên đem lại các lợi ích chính:

- **Tách biệt rõ ràng:** giao diện, xử lý nghiệp vụ, truy cập dữ liệu và tích hợp ngoài được phân tách theo trách nhiệm.
- **Khả năng mở rộng tốt:** các module nghiệp vụ có thể được phát triển và kiểm thử tương đối độc lập.
- **Tính bảo mật cao:** backend áp dụng xác thực JWT, RBAC, ownership guard và audit cho hành động nhạy cảm theo tài liệu phân quyền.
- **Dễ bảo trì và kiểm thử:** cấu trúc module, API rõ ràng và test strategy theo FR giúp nhóm dễ thiết kế unit test, integration test và API/E2E test.

### 3.2. Form/API dùng cho Usecase

Phần này trình bày các form và API chính phục vụ bốn use case đã phân tích. API Contract v1 được dùng làm nguồn chính về thiết kế endpoint. Khi endpoint đã được tìm thấy trong controller source code hiện tại, báo cáo ghi là "confirmed theo source code". Lưu ý: API Contract v1 định nghĩa base URL `/api/v1`, trong khi source code hiện tại cấu hình global prefix `/api`; vì vậy các endpoint confirmed theo source code được hiểu theo route backend hiện tại dưới prefix `/api`.

#### 3.2.1. Trang tra cứu và xem thông tin bác sĩ (FO-001)

**Usecase sử dụng:** UC01 - Guest User tra cứu bác sĩ và chuyển đổi sang đăng ký/đăng nhập.

<!-- TODO: Insert Figure 38: FO-001 Trang tra cứu và xem thông tin bác sĩ -->

Hình 38: FO-001 Trang tra cứu và xem thông tin bác sĩ

**Xử lý**

1. Người dùng truy cập trang chủ, danh sách chuyên khoa hoặc danh sách bác sĩ mà không cần đăng nhập.
2. Người dùng nhập từ khóa hoặc chọn chuyên khoa để lọc danh sách bác sĩ.
3. Giao diện gọi API public discovery để lấy danh sách bác sĩ.
4. Người dùng chọn một bác sĩ để xem hồ sơ công khai.
5. Nếu người dùng chọn đặt lịch hoặc gửi câu hỏi, giao diện chuyển sang trang đăng nhập/đăng ký.

#### 3.2.2. API tra cứu và xem thông tin bác sĩ (API-001)

| Inputs | Outputs | Endpoint | Phương thức |
|---|---|---|---|
| Không yêu cầu token | Thông tin trang chủ public | `/public/home` | GET |
| Không yêu cầu token | Danh sách chuyên khoa public | `/public/specialties` | GET |
| `keyword`, `specialtyId`, `page`, `limit` | Danh sách bác sĩ public phù hợp | `/public/doctors?keyword=&specialtyId=&page=&limit=` | GET |
| `doctorId` | Hồ sơ công khai của bác sĩ | `/public/doctors/:doctorId` | GET |

Các endpoint trên tồn tại trong API Contract v1 và confirmed theo source code tại `discovery.controller.ts` dưới prefix `/api`.

**Xử lý:**

1. Client gửi request đến API public.
2. Server nhận request ở Discovery module.
3. Server lọc bác sĩ theo điều kiện tìm kiếm và chỉ trả về dữ liệu public.
4. Server loại bỏ bác sĩ không đủ điều kiện hiển thị công khai theo rule active/approved.
5. Client hiển thị dữ liệu hoặc thông báo không tìm thấy kết quả.

**Điều kiện thành công:**

- API trả về dữ liệu public mà không yêu cầu token.
- Bác sĩ không đủ điều kiện công khai không xuất hiện trong response.
- Khi người dùng thực hiện thao tác protected, hệ thống chuyển sang auth flow.

#### 3.2.3. Trang đặt lịch hẹn tư vấn (FO-002)

**Usecase sử dụng:** UC02 - Patient đặt lịch hẹn tư vấn.

<!-- TODO: Insert Figure 39: FO-002 Trang đặt lịch hẹn tư vấn -->

Hình 39: FO-002 Trang đặt lịch hẹn tư vấn

**Xử lý**

1. Patient đã đăng nhập chọn bác sĩ và khung giờ tư vấn.
2. Patient nhập lý do tư vấn hoặc mô tả vấn đề sức khỏe.
3. Giao diện kiểm tra các trường bắt buộc trước khi gửi.
4. Giao diện gửi yêu cầu đặt lịch đến backend kèm access token.
5. Hệ thống hiển thị kết quả đặt lịch thành công hoặc lỗi validation/conflict.

#### 3.2.4. API đặt lịch hẹn tư vấn (API-002)

| Inputs | Outputs | Endpoint | Phương thức |
|---|---|---|---|
| `doctorId`, `scheduledAt`, `durationMinutes`, `reason`, token Patient | Appointment được tạo hoặc lỗi conflict/validation | `/appointments` | POST |
| Token Patient | Danh sách lịch hẹn của Patient | `/appointments/mine` | GET |
| `appointmentId`, token Patient | Lịch hẹn được hủy nếu hợp lệ | `/appointments/:id/cancel` | PATCH |

Các endpoint trên tồn tại trong API Contract v1 và confirmed theo source code tại `appointment.controller.ts` dưới prefix `/api`.

**Xử lý:**

1. Client gửi request đặt lịch với token của Patient.
2. Server kiểm tra xác thực, vai trò Patient và dữ liệu đầu vào.
3. Server kiểm tra bác sĩ, thời gian và xung đột lịch.
4. Nếu hợp lệ, server tạo appointment theo trạng thái nghiệp vụ.
5. Server phát sinh sự kiện/thông báo theo thiết kế nếu có.
6. Client hiển thị thông báo thành công hoặc lỗi tương ứng.

**Điều kiện thành công:**

- Patient đã đăng nhập và có quyền tạo lịch hẹn.
- Dữ liệu đầu vào hợp lệ.
- Không có xung đột lịch của bác sĩ hoặc Patient.
- Appointment được lưu và chỉ hiển thị đúng phạm vi ownership.

#### 3.2.5. Trang gửi và phản hồi câu hỏi sức khỏe (FO-003)

**Usecase sử dụng:** UC03 - Doctor phản hồi câu hỏi sức khỏe.

<!-- TODO: Insert Figure 40: FO-003 Trang gửi và phản hồi câu hỏi sức khỏe -->

Hình 40: FO-003 Trang gửi và phản hồi câu hỏi sức khỏe

**Xử lý**

1. Patient đăng nhập và nhập nội dung câu hỏi sức khỏe.
2. Giao diện gửi câu hỏi đến backend.
3. Doctor đăng nhập và mở danh sách câu hỏi được phân công.
4. Doctor chọn câu hỏi và nhập nội dung phản hồi.
5. Hệ thống cập nhật trạng thái câu hỏi và hiển thị phản hồi cho Patient trong phạm vi dữ liệu của chính mình.

#### 3.2.6. API gửi và phản hồi câu hỏi sức khỏe (API-003)

| Inputs | Outputs | Endpoint | Phương thức |
|---|---|---|---|
| Nội dung câu hỏi, token Patient | Câu hỏi được tạo | `/questions` | POST |
| Token Patient | Danh sách câu hỏi của chính Patient | `/questions/mine` | GET |
| Token Doctor | Danh sách câu hỏi được phân công | `/questions/assigned` | GET |
| `questionId`, nội dung phản hồi, token Doctor | Câu trả lời được lưu, câu hỏi cập nhật trạng thái | `/questions/:id/answers` | POST |
| `questionId`, dữ liệu moderation, token Admin | Trạng thái kiểm duyệt được cập nhật | `/admin/questions/:id/moderation` | PATCH |

Các endpoint trên tồn tại trong API Contract v1 và confirmed theo source code tại `question.controller.ts` dưới prefix `/api`.

**Xử lý:**

1. Patient gửi câu hỏi sau khi đăng nhập.
2. Server kiểm tra token, vai trò và dữ liệu câu hỏi.
3. Server lưu câu hỏi với trạng thái ban đầu phù hợp.
4. Doctor truy cập danh sách câu hỏi được phép xử lý.
5. Server kiểm tra role/scope trước khi cho Doctor xem hoặc phản hồi.
6. Doctor gửi phản hồi, server lưu answer và cập nhật trạng thái câu hỏi.
7. Nếu có cơ chế thông báo, server ghi nhận thông báo cho Patient.

**Điều kiện thành công:**

- Patient chỉ tạo/xem câu hỏi của chính mình.
- Doctor chỉ xem/trả lời câu hỏi được ủy quyền.
- Nội dung câu hỏi và câu trả lời hợp lệ.
- Trạng thái câu hỏi cập nhật đúng quy tắc nghiệp vụ.
- Dữ liệu sức khỏe được bảo vệ theo privacy policy.

#### 3.2.7. Trang phiên tư vấn trực tuyến (FO-004)

**Usecase sử dụng:** UC04 - Doctor thực hiện phiên tư vấn trực tuyến.

<!-- TODO: Insert Figure 41: FO-004 Trang phiên tư vấn trực tuyến -->

Hình 41: FO-004 Trang phiên tư vấn trực tuyến

**Xử lý**

1. Doctor hoặc Patient mở phiên tư vấn từ lịch hẹn hợp lệ.
2. Giao diện kiểm tra trạng thái đăng nhập và gửi yêu cầu start/join session.
3. Giao diện hiển thị khu vực chat/video theo phạm vi MVP.
4. Doctor nhập kết luận tư vấn và đơn thuốc điện tử cơ bản nếu cần.
5. Patient xem lại kết quả tư vấn và đơn thuốc thuộc về chính mình.

#### 3.2.8. API/Service phiên tư vấn trực tuyến (API-004)

| Inputs | Outputs | Endpoint | Phương thức |
|---|---|---|---|
| `appointmentId`, token Doctor/Patient theo quyền | Phiên tư vấn được bắt đầu | `/consultations/:appointmentId/start` | POST |
| `appointmentId`, token Doctor/Patient theo quyền | Người dùng tham gia phiên tư vấn | `/consultations/:appointmentId/join` | POST |
| `appointmentId`, token hợp lệ | Danh sách tin nhắn phiên tư vấn | `/consultations/:appointmentId/messages` | GET |
| `appointmentId`, `content`, token hợp lệ | Tin nhắn được gửi | `/consultations/:appointmentId/messages` | POST |
| `appointmentId`, token Doctor | Phiên tư vấn được kết thúc | `/consultations/:appointmentId/end` | PATCH |
| `appointmentId`, `summary`, token Doctor | Kết luận tư vấn được lưu | `/consultations/:appointmentId/summary` | PATCH |
| `appointmentId`, thông tin đơn thuốc, token Doctor | Đơn thuốc được tạo | `/consultations/:appointmentId/prescriptions` | POST |
| Token Patient | Lịch sử tư vấn của Patient | `/consultations/mine` | GET |
| Token Doctor | Lịch sử tư vấn của Doctor | `/consultations/doctor/me` | GET |
| `consultation:join`, `consultation:message` | Realtime join/message events | WebSocket namespace `/consultations` | Socket.IO |

Các REST endpoint trên tồn tại trong API Contract v1 và confirmed theo source code tại `consultation.controller.ts` dưới prefix `/api`. WebSocket namespace `/consultations` và events `consultation:join`, `consultation:message` confirmed theo source code tại `consultation.gateway.ts`.

**Xử lý:**

1. Client gửi yêu cầu start/join session dựa trên appointment hợp lệ.
2. Server kiểm tra token, role, ownership và trạng thái appointment/session.
3. Nếu hợp lệ, server tạo hoặc mở phiên tư vấn.
4. Client gửi/nhận tin nhắn qua REST hoặc Socket.IO tùy luồng sử dụng.
5. Khi tư vấn xong, Doctor cập nhật summary và prescription nếu có.
6. Server lưu dữ liệu tư vấn và bảo đảm Patient chỉ xem dữ liệu thuộc về mình.

**Điều kiện thành công:**

- Appointment tồn tại và thuộc đúng Doctor/Patient.
- Người dùng có token và vai trò phù hợp.
- Phiên tư vấn có thể start/join trong điều kiện hợp lệ.
- Tin nhắn, summary và prescription được validate trước khi lưu.
- Nếu video không khả dụng, hệ thống theo thiết kế có thể fallback sang chat.

### 3.3. Cơ sở dữ liệu

Theo tài liệu thiết kế cơ sở dữ liệu, hệ thống sử dụng PostgreSQL làm hệ quản trị cơ sở dữ liệu quan hệ chính và Prisma ORM để ánh xạ giữa source code backend với các bảng dữ liệu. Theo source code hiện tại, `prisma/schema.prisma` đã định nghĩa các model chính như `User`, `PatientProfile`, `DoctorProfile`, `Specialty`, `DoctorSpecialty`, `Question`, `Answer`, `Appointment`, `ConsultationSession`, `Prescription`, `PrescriptionItem`, `Rating`, `NotificationLog`, `AuditLog`, `OutboxEvent` và `FileAttachment`.

Một số tên gọi trong báo cáo được trình bày theo ý nghĩa nghiệp vụ để dễ hiểu hơn. Cụ thể, `HealthQuestion` trong báo cáo tương ứng với model `Question` và bảng `questions` theo source code hiện tại; `QuestionReply` tương ứng với model `Answer` và bảng `answers`; `Notification` tương ứng với model `NotificationLog`; `ConsultationResult` không phải là một bảng riêng trong source code hiện tại mà được thể hiện chủ yếu qua `ConsultationSession.summary`, `Prescription` và `PrescriptionItem`. Những khác biệt này được ghi rõ để phân biệt giữa cách gọi nghiệp vụ trong báo cáo và schema thực tế.

#### 3.3.1. Mô hình Diagram

<!-- TODO: Insert Figure: Mô hình Diagram cơ sở dữ liệu -->

Hình 42: Mô hình Diagram cơ sở dữ liệu

Theo tài liệu thiết kế, cơ sở dữ liệu được chia thành bốn nhóm chính:

- Nhóm định danh và bảo mật: `users`, `user_sessions`, `password_reset_tokens`, `audit_logs`.
- Nhóm hồ sơ và danh mục: `patient_profiles`, `doctor_profiles`, `specialties`, `doctor_specialties`.
- Nhóm nghiệp vụ tư vấn sức khỏe: `questions`, `answers`, `appointments`, `consultation_sessions`, `prescriptions`, `prescription_items`, `ratings`.
- Nhóm tích hợp và vận hành: `notification_logs`, `outbox_events`, `file_attachments`.

Theo source code hiện tại, schema Prisma và migrations đã có các bảng chính tương ứng với thiết kế trên. Ngoài ra, source code hiện tại có thêm `consultation_messages` để lưu tin nhắn trong phiên tư vấn trực tuyến. Bảng này hỗ trợ chat realtime nhưng không được đưa vào từ điển chi tiết bên dưới để giữ phạm vi báo cáo ngắn gọn theo yêu cầu.

#### 3.3.2. Từ điển cơ sở dữ liệu

Từ điển cơ sở dữ liệu dưới đây chỉ trình bày các bảng chính phục vụ các use case và yêu cầu chất lượng trong báo cáo. Các trường có tính nhạy cảm như mật khẩu, token, lịch sử y tế, kết luận tư vấn, nội dung đơn thuốc và metadata audit được mô tả ở mức cấu trúc, không chứa dữ liệu thật. Với các ràng buộc chưa thể hiện trực tiếp trong source code hoặc cần được enforce ở service layer, báo cáo ghi là "dự kiến" hoặc "theo thiết kế".

**Bảng User - theo source code hiện tại: model `User`, bảng `users`**

| ID | Attribute | Type | Constraint | Note |
|---|---|---|---|---|
| 1 | id | UUID | Primary key | Mã định danh người dùng. |
| 2 | email | String | Unique, not null | Dữ liệu PII; chỉ hiển thị theo quyền. |
| 3 | passwordHash | String | Not null | Mật khẩu đã băm; không trả về API response. |
| 4 | firstName | String | Not null | Thông tin hồ sơ cơ bản. |
| 5 | lastName | String | Not null | Thông tin hồ sơ cơ bản. |
| 6 | role | Enum | PATIENT/DOCTOR/ADMIN | Guest là actor public, không lưu như role trong bảng. |
| 7 | isActive | Boolean | Default true | Dùng cho trạng thái tài khoản. |
| 8 | deletedAt | DateTime | Nullable | Hỗ trợ soft-delete/deactivation. |

**Bảng PatientProfile - theo source code hiện tại: model `PatientProfile`, bảng `patient_profiles`**

| ID | Attribute | Type | Constraint | Note |
|---|---|---|---|---|
| 1 | id | UUID | Primary key | Mã hồ sơ bệnh nhân. |
| 2 | userId | UUID | Unique, foreign key | Quan hệ 1-1 với `users`. |
| 3 | dateOfBirth | DateTime | Nullable | Dữ liệu cá nhân. |
| 4 | gender | Enum | Nullable | MALE/FEMALE/OTHER. |
| 5 | phone | String | Nullable | PII; cần bảo vệ theo privacy policy. |
| 6 | address | String | Nullable | PII; chỉ hiển thị đúng quyền. |
| 7 | medicalHistory | String | Nullable | Dữ liệu sức khỏe nhạy cảm. |

**Bảng DoctorProfile - theo source code hiện tại: model `DoctorProfile`, bảng `doctor_profiles`**

| ID | Attribute | Type | Constraint | Note |
|---|---|---|---|---|
| 1 | id | UUID | Primary key | Mã hồ sơ bác sĩ. |
| 2 | userId | UUID | Unique, foreign key | Quan hệ 1-1 với `users`. |
| 3 | bio | String | Nullable | Mô tả chuyên môn công khai một phần. |
| 4 | yearsOfExperience | Int | Default 0 | Số năm kinh nghiệm. |
| 5 | approvalStatus | Enum | Default PENDING | PENDING/APPROVED/REJECTED. |
| 6 | isActive | Boolean | Default false | Chỉ active/approved mới nên hiển thị public. |
| 7 | schedule | Json | Nullable | Lịch làm việc theo source code hiện tại. |

**Bảng Specialty - theo source code hiện tại: model `Specialty`, bảng `specialties`**

| ID | Attribute | Type | Constraint | Note |
|---|---|---|---|---|
| 1 | id | UUID | Primary key | Mã chuyên khoa. |
| 2 | nameEn | String | Unique, not null | Tên tiếng Anh. |
| 3 | nameVi | String | Not null | Tên tiếng Việt. |
| 4 | description | String | Nullable | Mô tả chuyên khoa. |
| 5 | isActive | Boolean | Default true | Chuyên khoa active được dùng trong discovery. |

**Bảng DoctorSpecialty - theo source code hiện tại: model `DoctorSpecialty`, bảng `doctor_specialties`**

| ID | Attribute | Type | Constraint | Note |
|---|---|---|---|---|
| 1 | id | UUID | Primary key | Mã liên kết bác sĩ - chuyên khoa. |
| 2 | doctorId | UUID | Foreign key | Tham chiếu `doctor_profiles`. |
| 3 | specialtyId | UUID | Foreign key | Tham chiếu `specialties`. |
| 4 | doctorId + specialtyId | Composite | Unique | Ngăn gắn trùng chuyên khoa cho cùng bác sĩ. |

**Bảng Appointment - theo source code hiện tại: model `Appointment`, bảng `appointments`**

| ID | Attribute | Type | Constraint | Note |
|---|---|---|---|---|
| 1 | id | UUID | Primary key | Mã lịch hẹn. |
| 2 | patientId | UUID | Foreign key | Tham chiếu `patient_profiles`. |
| 3 | doctorId | UUID | Foreign key | Tham chiếu `doctor_profiles`. |
| 4 | scheduledAt | DateTime | Not null | Thời điểm tư vấn. |
| 5 | durationMinutes | Int | Default 60 | Thời lượng tư vấn; rule hợp lệ enforce ở service layer. |
| 6 | status | Enum | Default PENDING_CONFIRMATION | PENDING_CONFIRMATION/CONFIRMED/COMPLETED/CANCELLED/NO_SHOW. |
| 7 | reason | String | Not null | Có thể chứa dữ liệu sức khỏe; cần bảo vệ. |
| 8 | notes | String | Nullable | Ghi chú nội bộ/dự kiến theo quyền. |

**Bảng HealthQuestion - tên nghiệp vụ; theo source code hiện tại là model `Question`, bảng `questions`**

| ID | Attribute | Type | Constraint | Note |
|---|---|---|---|---|
| 1 | id | UUID | Primary key | Mã câu hỏi sức khỏe. |
| 2 | patientId | UUID | Foreign key | Chủ sở hữu câu hỏi. |
| 3 | doctorId | UUID | Nullable foreign key | Bác sĩ được gán nếu có. |
| 4 | title | String | Not null | Tiêu đề câu hỏi. |
| 5 | content | String | Not null | Nội dung sức khỏe nhạy cảm. |
| 6 | status | Enum | Default PENDING | PENDING/ANSWERED/CLOSED/MODERATED. |

**Bảng QuestionReply - tên nghiệp vụ; theo source code hiện tại là model `Answer`, bảng `answers`**

| ID | Attribute | Type | Constraint | Note |
|---|---|---|---|---|
| 1 | id | UUID | Primary key | Mã phản hồi. |
| 2 | questionId | UUID | Foreign key | Tham chiếu `questions`. |
| 3 | doctorId | UUID | Foreign key | Bác sĩ phản hồi. |
| 4 | content | String | Not null | Nội dung phản hồi chuyên môn; dữ liệu sức khỏe. |
| 5 | isApproved | Boolean | Default false | Trạng thái duyệt phản hồi theo source code hiện tại. |

**Bảng ConsultationSession - theo source code hiện tại: model `ConsultationSession`, bảng `consultation_sessions`**

| ID | Attribute | Type | Constraint | Note |
|---|---|---|---|---|
| 1 | id | UUID | Primary key | Mã phiên tư vấn. |
| 2 | appointmentId | UUID | Unique, foreign key | Một appointment có tối đa một session. |
| 3 | status | Enum | Default SCHEDULED | SCHEDULED/ONGOING/COMPLETED/CANCELLED. |
| 4 | startedAt | DateTime | Nullable | Thời điểm bắt đầu. |
| 5 | endedAt | DateTime | Nullable | Thời điểm kết thúc. |
| 6 | summary | String | Nullable | Kết luận tư vấn; dữ liệu sức khỏe nhạy cảm. |
| 7 | channel | String | Nullable | CHAT/VIDEO theo thiết kế; source code lưu dạng String. |

**Bảng ConsultationResult - tên nghiệp vụ; theo source code hiện tại không phải bảng riêng**

| ID | Attribute | Type | Constraint | Note |
|---|---|---|---|---|
| 1 | sessionId | UUID | Dự kiến/logic reference | Kết quả tư vấn gắn với `ConsultationSession`. |
| 2 | summary | String | Theo source: `ConsultationSession.summary` | Kết luận tư vấn. |
| 3 | prescriptionId | UUID | Theo source: quan hệ với `Prescription` | Đơn thuốc nếu có. |
| 4 | visibility | Policy | Theo thiết kế | Patient owner, assigned doctor, admin authorized role mới được xem. |

**Bảng Prescription - theo source code hiện tại: model `Prescription`, bảng `prescriptions`**

| ID | Attribute | Type | Constraint | Note |
|---|---|---|---|---|
| 1 | id | UUID | Primary key | Mã đơn thuốc. |
| 2 | sessionId | UUID | Unique, foreign key | Gắn với một phiên tư vấn. |
| 3 | notes | String | Nullable | Ghi chú đơn thuốc; dữ liệu sức khỏe. |
| 4 | createdAt | DateTime | Default now | Thời điểm tạo. |

**Bảng PrescriptionItem - theo source code hiện tại: model `PrescriptionItem`, bảng `prescription_items`**

| ID | Attribute | Type | Constraint | Note |
|---|---|---|---|---|
| 1 | id | UUID | Primary key | Mã dòng thuốc. |
| 2 | prescriptionId | UUID | Foreign key | Tham chiếu `prescriptions`. |
| 3 | medicationName | String | Not null | Tên thuốc. |
| 4 | dosage | String | Not null | Liều dùng. |
| 5 | frequency | String | Not null | Tần suất dùng. |
| 6 | duration | String | Not null | Thời lượng dùng. |
| 7 | notes | String | Nullable | Ghi chú thêm nếu có. |

**Bảng Rating - theo source code hiện tại: model `Rating`, bảng `ratings`**

| ID | Attribute | Type | Constraint | Note |
|---|---|---|---|---|
| 1 | id | UUID | Primary key | Mã đánh giá. |
| 2 | patientId | UUID | Foreign key | Bệnh nhân đánh giá. |
| 3 | doctorId | UUID | Foreign key | Bác sĩ được đánh giá. |
| 4 | appointmentId | UUID | Unique, foreign key | Mỗi appointment tối đa một rating. |
| 5 | score | Int | Theo thiết kế: 1..5 | Constraint điểm có thể enforce ở service/DB tùy triển khai. |
| 6 | comment | String | Nullable | Nội dung nhận xét; cần kiểm duyệt nếu có. |
| 7 | status | Enum | Default VISIBLE | VISIBLE/HIDDEN. |

**Bảng Notification - tên nghiệp vụ; theo source code hiện tại là model `NotificationLog`, bảng `notification_logs`**

| ID | Attribute | Type | Constraint | Note |
|---|---|---|---|---|
| 1 | id | UUID | Primary key | Mã log thông báo. |
| 2 | userId | UUID | Foreign key | Người nhận thông báo. |
| 3 | type | Enum | EMAIL/SMS | Kênh thông báo. |
| 4 | content | String | Not null | Nội dung thông báo; tránh chứa dữ liệu nhạy cảm không cần thiết. |
| 5 | externalRef | String | Unique, nullable | Dùng cho idempotency theo source code hiện tại. |
| 6 | status | Enum | Default PENDING | PENDING/SENT/FAILED. |
| 7 | provider | String | Nullable | Nhà cung cấp nếu có. |

**Bảng AuditLog - theo source code hiện tại: model `AuditLog`, bảng `audit_logs`**

| ID | Attribute | Type | Constraint | Note |
|---|---|---|---|---|
| 1 | id | UUID | Primary key | Mã audit log. |
| 2 | actorUserId | UUID | Nullable foreign key | Người thực hiện hành động, nếu xác định được. |
| 3 | action | String | Not null | Tên hành động được audit. |
| 4 | resource | String | Not null | Loại tài nguyên bị tác động. |
| 5 | resourceId | String | Nullable | Mã tài nguyên liên quan. |
| 6 | ipAddress | String | Nullable | PII kỹ thuật; theo privacy guide cần sanitize/mask nếu ghi nhận. |
| 7 | userAgent | String | Nullable | Thông tin môi trường client. |
| 8 | metadata | Json | Nullable | Metadata nhạy cảm cần được sanitize/redact trước khi lưu. |

Nhìn chung, mô hình cơ sở dữ liệu hiện tại là mixed giữa thiết kế và source code đã triển khai. Các bảng cốt lõi trong DatabaseDesign.md đã có đối ứng trong Prisma schema. Một số tên nghiệp vụ trong báo cáo được ánh xạ sang tên model thực tế để dễ đọc, trong khi một số năng lực như File Storage hoặc một bảng riêng cho ConsultationResult được ghi nhận theo thiết kế hoặc biểu diễn bằng các bảng hiện có thay vì là bảng riêng.

# CHƯƠNG III. TRIỂN KHAI HỆ THỐNG

## 1. Phần mềm ứng dụng

Phần mềm được xây dựng theo định hướng nền tảng web tư vấn sức khỏe trực tuyến, trong đó người dùng có thể tra cứu bác sĩ, đặt lịch hẹn, gửi câu hỏi sức khỏe, tham gia phiên tư vấn và theo dõi kết quả tư vấn. Theo source code hiện tại, repository backend sử dụng NestJS, TypeScript, PostgreSQL và Prisma; hệ thống cung cấp REST API, Swagger UI và một số năng lực real-time thông qua WebSocket cho phiên tư vấn. Theo thông tin frontend được cung cấp, giao diện người dùng được xây dựng bằng React 18, TypeScript, Vite, React Router v6, Redux Toolkit, Redux Saga, Axios, PrimeReact, Tailwind CSS, Formik, Yup, i18next và Recharts.

Trong phạm vi báo cáo đảm bảo chất lượng phần mềm, phần triển khai không chỉ mô tả cách cài đặt hệ thống mà còn làm rõ các màn hình nghiệp vụ cần được kiểm thử. Các ảnh giao diện trong mục này hiện được giữ dưới dạng placeholder, chưa thay thế bằng ảnh chụp thật để tránh tạo bằng chứng không có nguồn xác nhận.

### 1.1. Giao diện chính của phần mềm

Các giao diện chính được xác định từ SRS, requirement baseline và các luồng nghiệp vụ đã phân tích ở Chương II. Do Codex hiện đang chạy trong repository backend, thông tin về frontend được ghi nhận theo thông tin frontend được cung cấp và cần xác minh lại khi repository `OnlineHealthConsultation-Web` có sẵn.

**Trang chủ**

Trang chủ là điểm truy cập đầu tiên của Guest User và người dùng đã đăng nhập. Màn hình này trình bày thông tin tổng quan về hệ thống, các chuyên khoa nổi bật, danh sách bác sĩ tiêu biểu hoặc đường dẫn nhanh đến tra cứu bác sĩ, đăng nhập và đăng ký. Theo source code backend hiện tại, dữ liệu trang chủ có đối ứng với public API trong module discovery.

<!-- TODO: Insert Figure 43: Giao diện Trang chủ -->

Hình 43: Giao diện Trang chủ

**Trang danh sách chuyên khoa**

Trang danh sách chuyên khoa cho phép người dùng xem các chuyên khoa đang được hệ thống công bố. Từ màn hình này, người dùng có thể chọn một chuyên khoa để tiếp tục tra cứu bác sĩ phù hợp. Đây là giao diện phục vụ luồng Guest User tra cứu bác sĩ và cũng hỗ trợ Patient khi chuẩn bị đặt lịch tư vấn.

<!-- TODO: Insert Figure 44: Giao diện Trang danh sách chuyên khoa -->

Hình 44: Giao diện Trang danh sách chuyên khoa

**Trang danh sách bác sĩ**

Trang danh sách bác sĩ hiển thị các bác sĩ đã được duyệt và còn hoạt động theo phạm vi công khai. Người dùng có thể tìm kiếm, lọc theo chuyên khoa hoặc xem thông tin tóm tắt của bác sĩ. Khi người dùng khách chọn hành động cần xác thực như đặt lịch hoặc gửi câu hỏi, hệ thống cần chuyển sang màn hình đăng nhập/đăng ký.

<!-- TODO: Insert Figure 45: Giao diện Trang danh sách bác sĩ -->

Hình 45: Giao diện Trang danh sách bác sĩ

**Trang chi tiết bác sĩ**

Trang chi tiết bác sĩ cung cấp thông tin hồ sơ công khai như họ tên, chuyên khoa, học hàm/học vị hoặc mô tả chuyên môn nếu có. Màn hình này cần hạn chế hiển thị thông tin nội bộ và dữ liệu nhạy cảm. Các hành động đặt lịch tư vấn hoặc gửi câu hỏi được kiểm soát theo trạng thái đăng nhập và vai trò của người dùng.

<!-- TODO: Insert Figure 46: Giao diện Trang chi tiết bác sĩ -->

Hình 46: Giao diện Trang chi tiết bác sĩ

**Trang đăng nhập/đăng ký**

Trang đăng nhập/đăng ký phục vụ chức năng xác thực người dùng. Theo source code backend hiện tại, hệ thống sử dụng JWT, bcryptjs và các DTO có kiểm tra dữ liệu đầu vào. Màn hình cần hiển thị thông báo lỗi rõ ràng khi email, mật khẩu hoặc dữ liệu đăng ký không hợp lệ, đồng thời không tiết lộ chi tiết nhạy cảm về tài khoản.

<!-- TODO: Insert Figure 47: Giao diện Trang đăng nhập/đăng ký -->

Hình 47: Giao diện Trang đăng nhập/đăng ký

**Trang đặt lịch tư vấn**

Trang đặt lịch tư vấn cho phép Patient chọn bác sĩ, thời gian, kênh tư vấn và nhập lý do tư vấn nếu cần. Theo source code backend hiện tại, module appointment có API tạo lịch hẹn, xem lịch của bệnh nhân, bác sĩ xác nhận và cập nhật trạng thái lịch hẹn. Màn hình cần kiểm tra trùng lịch, trạng thái bác sĩ và quyền truy cập trước khi ghi nhận lịch hẹn.

<!-- TODO: Insert Figure 48: Giao diện Trang đặt lịch tư vấn -->

Hình 48: Giao diện Trang đặt lịch tư vấn

**Trang gửi câu hỏi sức khỏe**

Trang gửi câu hỏi sức khỏe cho phép Patient nhập nội dung câu hỏi và gửi đến hệ thống hoặc bác sĩ phù hợp theo luồng thiết kế. Nội dung câu hỏi là dữ liệu liên quan đến sức khỏe nên cần được bảo vệ theo nguyên tắc privacy. Màn hình phải có kiểm tra dữ liệu đầu vào, thông báo gửi thành công/thất bại và không cho Guest User gửi câu hỏi khi chưa đăng nhập.

<!-- TODO: Insert Figure 49: Giao diện Trang gửi câu hỏi sức khỏe -->

Hình 49: Giao diện Trang gửi câu hỏi sức khỏe

**Trang lịch hẹn của bệnh nhân**

Trang lịch hẹn của bệnh nhân hiển thị các lịch hẹn thuộc sở hữu của Patient đang đăng nhập. Người dùng có thể xem trạng thái lịch hẹn, thời gian tư vấn, thông tin bác sĩ và thao tác hủy lịch trong điều kiện cho phép. Yêu cầu quan trọng của màn hình này là bệnh nhân không được truy cập lịch hẹn của bệnh nhân khác.

<!-- TODO: Insert Figure 50: Giao diện Trang lịch hẹn của bệnh nhân -->

Hình 50: Giao diện Trang lịch hẹn của bệnh nhân

**Trang quản lý lịch của bác sĩ**

Trang quản lý lịch của bác sĩ hiển thị các cuộc hẹn được gán cho bác sĩ đang đăng nhập. Bác sĩ có thể xem lịch, xác nhận, hoàn tất hoặc xử lý trạng thái theo quy trình nghiệp vụ. Theo ma trận phân quyền, bác sĩ chỉ được truy cập các lịch hẹn thuộc phạm vi của mình.

<!-- TODO: Insert Figure 51: Giao diện Trang quản lý lịch của bác sĩ -->

Hình 51: Giao diện Trang quản lý lịch của bác sĩ

**Trang phản hồi câu hỏi của bác sĩ**

Trang phản hồi câu hỏi của bác sĩ hỗ trợ Doctor xem các câu hỏi thuộc phạm vi được phân công và nhập nội dung phản hồi. Hệ thống cần kiểm soát quyền truy cập, ghi nhận thời điểm phản hồi và bảo vệ thông tin sức khỏe của bệnh nhân. Đây là một trong bốn use case trọng tâm của báo cáo kiểm thử.

<!-- TODO: Insert Figure 52: Giao diện Trang phản hồi câu hỏi của bác sĩ -->

Hình 52: Giao diện Trang phản hồi câu hỏi của bác sĩ

**Trang phiên tư vấn trực tuyến**

Trang phiên tư vấn trực tuyến là nơi Patient và Doctor tham gia phiên tư vấn đã được xác nhận. Theo source code backend hiện tại, module consultation có API start/join/end session, ghi nhận tin nhắn, summary, prescription và có WebSocket namespace cho consultation. Theo tài liệu thiết kế, hệ thống cần hỗ trợ fallback chat/video trong phạm vi MVP.

<!-- TODO: Insert Figure 53: Giao diện Trang phiên tư vấn trực tuyến -->

Hình 53: Giao diện Trang phiên tư vấn trực tuyến

**Trang quản trị**

Trang quản trị dành cho Administrator để quản lý người dùng, bác sĩ, chuyên khoa, lịch hẹn, câu hỏi, nội dung tư vấn và báo cáo hoạt động. Giao diện này cần tuân thủ phân quyền quản trị, audit log cho hành động nhạy cảm và không hiển thị dữ liệu sức khỏe vượt quá mục đích quản trị.

<!-- TODO: Insert Figure 54: Giao diện Trang quản trị -->

Hình 54: Giao diện Trang quản trị

### 1.2. Cài đặt cho hệ thống PM

Hệ thống được triển khai theo mô hình tách frontend, backend và database. Trong repository hiện tại, backend và database có thể xác minh trực tiếp từ source code, `package.json`, `README.md`, `.env.example`, `docker-compose.yml` và Prisma schema. Phần frontend được trình bày theo thông tin frontend được cung cấp và cần kiểm chứng lại trong repository frontend khi có sẵn.

Khi cài đặt hệ thống, các giá trị môi trường cần được cấu hình qua file `.env` dựa trên `.env.example`. Báo cáo chỉ liệt kê tên biến cấu hình cần thiết, không trình bày secret thật. Các biến quan trọng gồm `NODE_ENV`, `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, thời hạn token, `CORS_ORIGIN`, `BCRYPT_ROUNDS` và một số biến phục vụ consultation/notification theo tài liệu vận hành.

#### 1.2.1. Backend

Backend theo source code hiện tại là dịch vụ NestJS chạy trên Node.js và TypeScript. Hệ thống dùng PostgreSQL, Prisma, JWT, Passport JWT, bcryptjs, Swagger, class-validator/class-transformer, Socket.IO/WebSocket, EventEmitter và node-cron. API được cấu hình global prefix là `/api`; tài liệu Swagger được cấu hình tại `/api/docs`. Theo `.env.example`, cổng mặc định của template là `4000`, trong khi README có mô tả server có thể chạy ở `3000` hoặc theo biến `PORT`; vì vậy báo cáo ghi nhận cổng thực tế phụ thuộc cấu hình môi trường.

Các bước cài đặt backend ở môi trường local:

1. Cài đặt Node.js 18+ và Docker/Docker Compose.
2. Cài đặt thư viện:

```bash
npm install
```

3. Tạo file cấu hình môi trường từ template và thay thế secret bằng giá trị mạnh trong môi trường thật:

```bash
cp .env.example .env
```

4. Khởi động PostgreSQL bằng Docker Compose:

```bash
docker compose up -d
```

README hiện tại cũng dùng dạng lệnh `docker-compose up -d`; tùy phiên bản Docker trên máy, có thể dùng `docker compose` hoặc `docker-compose`.

5. Sinh Prisma Client:

```bash
npm run prisma:generate
```

6. Áp dụng migration cho cơ sở dữ liệu:

```bash
npm run prisma:migrate:deploy
```

Trong môi trường phát triển, README có hướng dẫn dùng `npx prisma migrate dev`. Lệnh này phù hợp khi cần tạo hoặc cập nhật migration ở local; khi triển khai ổn định hơn, script `npm run prisma:migrate:deploy` phù hợp để áp dụng migration đã có.

7. Seed dữ liệu mẫu nếu cần cho môi trường phát triển hoặc kiểm thử có kiểm soát:

```bash
npm run prisma:seed
```

8. Khởi động backend ở chế độ phát triển:

```bash
npm run start:dev
```

9. Kiểm tra tài liệu API:

```text
http://localhost:<PORT>/api/docs
```

Các lệnh hỗ trợ khác theo `package.json` gồm:

| Mục đích | Lệnh | Ghi chú |
|---|---|---|
| Build backend | `npm run build` | Theo source code hiện tại. |
| Chạy production build | `npm run start:prod` | Cần build trước và cấu hình env phù hợp. |
| Kiểm tra TypeScript | `npm run type-check` | Theo source code hiện tại. |
| Chạy test backend | `npm run test` | Jest, chưa dùng để ghi nhận kết quả nếu chưa có log thực thi. |
| Mở Prisma Studio | `npm run prisma:studio` | Dùng cho kiểm tra dữ liệu local, không dùng trên production nếu không kiểm soát quyền. |
| Reset DB local | `npm run db:reset` | Chỉ dùng cho môi trường local/test, không dùng cho production. |

#### 1.2.2. Frontend

Frontend không có trong repository backend hiện tại. Theo thông tin frontend được cung cấp, ứng dụng frontend đặt trong repository/thư mục `OnlineHealthConsultation-Web`, sử dụng React 18, TypeScript và Vite. Ứng dụng có React Router v6 cho điều hướng, Redux Toolkit và Redux Saga cho quản lý trạng thái và xử lý side-effect, Axios cho gọi API, PrimeReact và Tailwind CSS cho giao diện, Formik và Yup cho form/validation, i18next hỗ trợ tiếng Việt và tiếng Anh, Recharts cho biểu đồ, đồng thời định hướng kiểm thử E2E bằng Playwright.

Cấu trúc frontend được cung cấp gồm các thư mục chính:

| Thư mục | Vai trò |
|---|---|
| `src/apis/core` | Lớp gọi API và cấu hình Axios. |
| `src/features/auth` | Chức năng đăng nhập, đăng ký và xác thực. |
| `src/features/patient` | Chức năng dành cho bệnh nhân như đặt lịch, gửi câu hỏi, xem lịch hẹn. |
| `src/features/doctor` | Chức năng dành cho bác sĩ như quản lý lịch, phản hồi câu hỏi, tư vấn trực tuyến. |
| `src/features/admin` | Chức năng quản trị hệ thống. |
| `src/redux` | Store, slice hoặc saga phục vụ quản lý trạng thái. |
| `src/i18n` | Cấu hình đa ngôn ngữ `vi`, `en`. |
| `src/layouts` | Bố cục giao diện chính. |
| `src/components` | Component dùng chung. |

Các lệnh cài đặt frontend dưới đây được ghi nhận là dự kiến theo thông tin frontend được cung cấp, cần xác nhận lại bằng `package.json` của frontend:

```bash
npm install
npm run dev
```

Khi chạy frontend bằng Vite, cổng thường dùng trong môi trường phát triển là `5173`. Backend `.env.example` hiện cho phép CORS từ `http://localhost:5173` và `http://localhost:3000`, do đó cấu hình frontend cần trỏ đúng base URL backend, ví dụ `http://localhost:<PORT>/api`, tùy biến môi trường thực tế.

Phần kiểm thử E2E của báo cáo định hướng dùng Playwright. Nếu repository frontend có thư mục `cypress/` từ cấu trúc ban đầu, thư mục đó chỉ được xem là dấu vết cấu trúc cũ; hướng kiểm thử E2E của báo cáo này là Playwright và chỉ ghi nhận kết quả khi có bằng chứng chạy test.

#### 1.2.3. Database

Cơ sở dữ liệu theo source code hiện tại sử dụng PostgreSQL và Prisma ORM. File `docker-compose.yml` cấu hình PostgreSQL 15 Alpine, volume `postgres_data`, network `health_consultation_network` và healthcheck bằng `pg_isready`. File `prisma/schema.prisma` xác định datasource `postgresql` qua biến môi trường `DATABASE_URL`.

Quy trình cài đặt database local:

1. Khởi động container PostgreSQL:

```bash
docker compose up -d
```

2. Kiểm tra container database:

```bash
docker compose ps
```

3. Sinh Prisma Client:

```bash
npm run prisma:generate
```

4. Áp dụng migration:

```bash
npm run prisma:migrate:deploy
```

5. Seed dữ liệu mẫu nếu phục vụ môi trường phát triển/kiểm thử:

```bash
npm run prisma:seed
```

Theo tài liệu vận hành, migration cần chạy trước khi rollout ứng dụng. Với môi trường production, không sử dụng lệnh reset database và không lưu secret thật trong báo cáo hoặc tài liệu công khai. Dữ liệu liên quan đến sức khỏe, thông tin cá nhân, audit metadata và log kỹ thuật cần được xử lý theo nguyên tắc tối thiểu hóa dữ liệu, tránh ghi dữ liệu nhạy cảm vào query string hoặc log không được kiểm soát.

## 2. Kiểm thử

Phần kiểm thử được xây dựng dựa trên chiến lược kiểm thử và traceability của dự án. Theo Test_Strategy_and_Traceability.md, các luồng public discovery liên quan đến FR-01 và FR-05 được định hướng kiểm thử bằng API/E2E theo use case SRS, với các test suite dự kiến như `public.discovery.e2e-spec.ts` và `doctor.discovery.e2e-spec.ts`. Vì frontend chưa được xác minh trực tiếp trong repository hiện tại, các kiểm thử giao diện được ghi nhận là dự kiến sử dụng Playwright khi UI có sẵn; các kiểm thử API có thể sử dụng Postman hoặc Jest/Supertest theo điều kiện triển khai.

### 2.1. Đặc tả các testcases cho Usecase UC01: Guest User tra cứu bác sĩ và chuyển đổi sang đăng ký/đăng nhập

Usecase UC01 kiểm tra khả năng Guest User truy cập các thông tin công khai của hệ thống, tra cứu bác sĩ, xem hồ sơ công khai và được chuyển hướng sang đăng nhập/đăng ký khi thực hiện hành động yêu cầu xác thực. Theo API contract, các API liên quan gồm `GET /public/specialties`, `GET /public/doctors?keyword=&specialtyId=&page=&limit=` và `GET /public/doctors/:doctorId`. Theo Auth_Authorization_Matrix.md, Guest chỉ được đọc thông tin công khai về bác sĩ/chuyên khoa, không được đặt lịch, gửi câu hỏi hoặc truy cập dữ liệu riêng tư.

#### 2.1.1. Kiểm thử hiển thị danh sách bác sĩ công khai

**Mô tả**

Kiểm thử hệ thống hiển thị danh sách bác sĩ công khai cho Guest User. Danh sách chỉ bao gồm các bác sĩ được phép hiển thị công khai, không yêu cầu token đăng nhập và không để lộ dữ liệu nhạy cảm ngoài hồ sơ công khai.

**Tiền điều kiện**

- Hệ thống có dữ liệu bác sĩ đã được duyệt và đang hoạt động.
- Guest User truy cập hệ thống khi chưa đăng nhập.
- API public discovery sẵn sàng theo API contract hoặc source code hiện tại.

**Bước thực hiện**

1. Mở trang danh sách bác sĩ hoặc gọi `GET /public/doctors`.
2. Không gửi `Authorization` header.
3. Quan sát danh sách bác sĩ trả về.
4. Kiểm tra dữ liệu hiển thị chỉ gồm thông tin công khai.

**Kỹ thuật, công cụ**

Black-box testing, Equivalence Partitioning. Công cụ dự kiến: Playwright nếu có UI; Postman hoặc Jest/Supertest nếu kiểm thử API.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Truy cập danh sách public không có token | `GET /public/doctors` | Trả về danh sách bác sĩ công khai, HTTP 200 hoặc màn hình hiển thị danh sách | Chưa thực thi |
| POS.test.02 | Có dữ liệu bác sĩ public | Doctor active/approved | Bác sĩ được hiển thị trong danh sách | Chưa thực thi |
| NEG.test.01 | Dữ liệu nhạy cảm trong response/UI | `passwordHash`, thông tin nội bộ, dữ liệu bệnh nhân | Không hiển thị/không trả về dữ liệu nhạy cảm | Chưa thực thi |

#### 2.1.2. Kiểm thử tìm kiếm bác sĩ theo từ khóa hợp lệ

**Mô tả**

Kiểm thử chức năng tìm kiếm bác sĩ bằng từ khóa hợp lệ như tên bác sĩ, chuyên môn hoặc từ khóa có trong hồ sơ công khai. Kết quả cần phù hợp với điều kiện tìm kiếm và vẫn tuân thủ phạm vi public access.

**Tiền điều kiện**

- Có ít nhất một bác sĩ active/approved có thông tin khớp từ khóa.
- Guest User chưa đăng nhập.
- API hoặc UI tìm kiếm bác sĩ hoạt động.

**Bước thực hiện**

1. Mở trang danh sách bác sĩ.
2. Nhập từ khóa hợp lệ.
3. Thực hiện tìm kiếm.
4. Kiểm tra danh sách kết quả trả về.

**Kỹ thuật, công cụ**

Black-box testing, Equivalence Partitioning. Công cụ dự kiến: Playwright cho UI; Postman hoặc Jest/Supertest cho API `GET /public/doctors?keyword=`.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Từ khóa khớp tên bác sĩ | `keyword=Nguyen` hoặc từ khóa có trong dữ liệu seed | Trả về danh sách bác sĩ khớp từ khóa | Chưa thực thi |
| POS.test.02 | Từ khóa có khoảng trắng đầu/cuối | `keyword=  Nguyen  ` | Hệ thống xử lý hợp lệ, không lỗi validation | Chưa thực thi |
| NEG.test.01 | Từ khóa chứa ký tự đặc biệt không phù hợp | `keyword=<script>` | Không thực thi script, không lỗi hệ thống, trả về kết quả rỗng hoặc thông báo hợp lệ | Chưa thực thi |

#### 2.1.3. Kiểm thử tìm kiếm bác sĩ theo từ khóa không tồn tại

**Mô tả**

Kiểm thử trường hợp Guest User nhập từ khóa không khớp với bác sĩ nào. Hệ thống cần phản hồi rõ ràng bằng danh sách rỗng hoặc thông báo không tìm thấy, không trả lỗi nghiệp vụ không phù hợp.

**Tiền điều kiện**

- Guest User chưa đăng nhập.
- Hệ thống có chức năng tìm kiếm bác sĩ.
- Từ khóa kiểm thử không tồn tại trong dữ liệu bác sĩ công khai.

**Bước thực hiện**

1. Mở trang danh sách bác sĩ hoặc gọi API tìm kiếm.
2. Nhập từ khóa không tồn tại.
3. Thực hiện tìm kiếm.
4. Kiểm tra thông báo hoặc dữ liệu phản hồi.

**Kỹ thuật, công cụ**

Black-box testing, Equivalence Partitioning. Công cụ dự kiến: Playwright nếu có UI; Postman hoặc Jest/Supertest nếu kiểm thử API.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| NEG.test.01 | Từ khóa không khớp dữ liệu | `keyword=zzzz-doctor-not-found` | Trả danh sách rỗng hoặc thông báo không tìm thấy, không lỗi 500 | Chưa thực thi |
| POS.test.01 | Từ khóa rỗng hoặc không nhập | `keyword=` | Hệ thống hiển thị danh sách mặc định hoặc tất cả bác sĩ public theo phân trang | Chưa thực thi |
| NEG.test.02 | Từ khóa rất dài | Chuỗi dài vượt ngưỡng dự kiến | Hệ thống validation/giới hạn input phù hợp, không lỗi hệ thống | Chưa thực thi |

#### 2.1.4. Kiểm thử lọc bác sĩ theo chuyên khoa

**Mô tả**

Kiểm thử Guest User lọc danh sách bác sĩ theo chuyên khoa. Kết quả cần chỉ bao gồm bác sĩ thuộc chuyên khoa được chọn và được phép hiển thị công khai.

**Tiền điều kiện**

- Có dữ liệu chuyên khoa công khai.
- Có bác sĩ active/approved được gán chuyên khoa.
- Guest User chưa đăng nhập.

**Bước thực hiện**

1. Mở trang danh sách chuyên khoa hoặc danh sách bác sĩ.
2. Chọn một chuyên khoa hợp lệ.
3. Thực hiện lọc danh sách bác sĩ.
4. Kiểm tra tất cả kết quả thuộc chuyên khoa đã chọn.

**Kỹ thuật, công cụ**

Black-box testing, Equivalence Partitioning. Công cụ dự kiến: Playwright cho UI; Postman hoặc Jest/Supertest cho API `GET /public/doctors?specialtyId=`.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Chuyên khoa hợp lệ có bác sĩ | `specialtyId` tồn tại và active | Trả về bác sĩ thuộc chuyên khoa đã chọn | Chưa thực thi |
| POS.test.02 | Chuyên khoa hợp lệ chưa có bác sĩ | `specialtyId` tồn tại nhưng không có bác sĩ public | Trả danh sách rỗng hoặc thông báo phù hợp | Chưa thực thi |
| NEG.test.01 | Chuyên khoa không tồn tại | `specialtyId` không hợp lệ | Trả danh sách rỗng hoặc lỗi validation/not found theo contract, không lỗi 500 | Chưa thực thi |

#### 2.1.5. Kiểm thử xem chi tiết hồ sơ công khai của bác sĩ

**Mô tả**

Kiểm thử Guest User xem chi tiết hồ sơ công khai của một bác sĩ. Màn hình/API cần trả thông tin công khai như tên, chuyên khoa và mô tả chuyên môn, đồng thời không hiển thị dữ liệu riêng tư hoặc thông tin quản trị.

**Tiền điều kiện**

- Có bác sĩ active/approved với hồ sơ công khai.
- Guest User chưa đăng nhập.
- Có `doctorId` hợp lệ từ danh sách bác sĩ public.

**Bước thực hiện**

1. Mở danh sách bác sĩ.
2. Chọn một bác sĩ hợp lệ.
3. Truy cập trang chi tiết hoặc gọi `GET /public/doctors/:doctorId`.
4. Kiểm tra thông tin hiển thị và dữ liệu không được phép hiển thị.

**Kỹ thuật, công cụ**

Black-box testing, Equivalence Partitioning. Công cụ dự kiến: Playwright nếu có UI; Postman hoặc Jest/Supertest nếu kiểm thử API.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Doctor ID hợp lệ và public | `doctorId` của bác sĩ active/approved | Hiển thị hồ sơ công khai của bác sĩ | Chưa thực thi |
| NEG.test.01 | Doctor ID không tồn tại | UUID không tồn tại | Trả thông báo không tìm thấy hoặc HTTP 404 theo contract | Chưa thực thi |
| NEG.test.02 | Response chứa dữ liệu không công khai | Thông tin nội bộ, dữ liệu bệnh nhân, hash mật khẩu | Không hiển thị/không trả về dữ liệu nhạy cảm | Chưa thực thi |

#### 2.1.6. Kiểm thử không hiển thị bác sĩ inactive/unapproved

**Mô tả**

Kiểm thử hệ thống không hiển thị bác sĩ inactive hoặc chưa được duyệt trong danh sách và trang chi tiết public. Đây là điều kiện quan trọng để bảo đảm thông tin công khai chỉ gồm bác sĩ hợp lệ theo quy trình quản lý.

**Tiền điều kiện**

- Có dữ liệu bác sĩ active/approved và inactive hoặc unapproved theo dữ liệu kiểm thử.
- Guest User chưa đăng nhập.
- Public discovery API hoặc UI hoạt động.

**Bước thực hiện**

1. Gọi danh sách bác sĩ public hoặc mở trang danh sách bác sĩ.
2. Tìm theo tên hoặc thông tin của bác sĩ inactive/unapproved.
3. Truy cập trực tiếp chi tiết bác sĩ inactive/unapproved nếu có ID kiểm thử.
4. Kiểm tra hệ thống không hiển thị hồ sơ không hợp lệ.

**Kỹ thuật, công cụ**

Black-box testing, Decision Table theo trạng thái `active/approved`. Công cụ dự kiến: Postman hoặc Jest/Supertest cho API; Playwright nếu UI có dữ liệu kiểm thử phù hợp.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Bác sĩ active và approved | Doctor active/approved | Được hiển thị public | Chưa thực thi |
| NEG.test.01 | Bác sĩ inactive | Doctor inactive | Không xuất hiện trong danh sách public | Chưa thực thi |
| NEG.test.02 | Bác sĩ chưa được duyệt hoặc bị từ chối | Doctor pending/rejected | Không xuất hiện trong danh sách public và không xem được chi tiết public | Chưa thực thi |

#### 2.1.7. Kiểm thử Guest User bị chuyển hướng đăng nhập khi chọn đặt lịch

**Mô tả**

Kiểm thử Guest User khi chọn hành động đặt lịch từ danh sách hoặc chi tiết bác sĩ. Theo ma trận phân quyền, đặt lịch là chức năng của Patient đã đăng nhập; Guest User không được tạo appointment và cần được chuyển hướng đến đăng nhập/đăng ký hoặc nhận lỗi unauthorized ở API.

**Tiền điều kiện**

- Guest User chưa đăng nhập.
- Có bác sĩ public hợp lệ.
- Nút hoặc hành động đặt lịch xuất hiện trên giao diện public theo thiết kế.

**Bước thực hiện**

1. Mở trang danh sách hoặc chi tiết bác sĩ.
2. Chọn hành động đặt lịch tư vấn.
3. Quan sát điều hướng giao diện hoặc gọi API tạo appointment không kèm token.
4. Kiểm tra hệ thống không tạo lịch hẹn.

**Kỹ thuật, công cụ**

Black-box testing, Decision Table cho điều kiện xác thực. Công cụ dự kiến: Playwright nếu có UI; Postman hoặc Jest/Supertest cho API `POST /appointments` không có token.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| NEG.test.01 | Guest chọn đặt lịch trên UI | Click nút đặt lịch khi chưa đăng nhập | Chuyển hướng đến đăng nhập/đăng ký, không tạo appointment | Chưa thực thi |
| NEG.test.02 | Guest gọi API tạo appointment | `POST /appointments` không có token | Trả `UNAUTHORIZED` hoặc HTTP 401 theo cơ chế auth, không tạo dữ liệu | Chưa thực thi |
| POS.test.01 | Patient đã đăng nhập chọn đặt lịch | Token Patient hợp lệ | Cho phép vào luồng đặt lịch nếu dữ liệu hợp lệ | Chưa thực thi |

#### 2.1.8. Kiểm thử Guest User bị chuyển hướng đăng nhập khi chọn gửi câu hỏi

**Mô tả**

Kiểm thử Guest User khi chọn hành động gửi câu hỏi sức khỏe. Theo ma trận phân quyền, Guest không có quyền tạo câu hỏi; chức năng này thuộc về Patient đã đăng nhập. Hệ thống cần chuyển hướng đến đăng nhập/đăng ký hoặc trả lỗi unauthorized khi gọi API không có token.

**Tiền điều kiện**

- Guest User chưa đăng nhập.
- Giao diện public có hành động gửi câu hỏi hoặc liên kết đến trang hỏi đáp.
- API question có kiểm soát xác thực theo thiết kế.

**Bước thực hiện**

1. Mở trang public hoặc trang chi tiết bác sĩ.
2. Chọn hành động gửi câu hỏi sức khỏe.
3. Quan sát điều hướng hoặc gọi API `POST /questions` không có token.
4. Kiểm tra hệ thống không tạo câu hỏi mới.

**Kỹ thuật, công cụ**

Black-box testing, Decision Table cho điều kiện xác thực/phân quyền. Công cụ dự kiến: Playwright nếu UI có sẵn; Postman hoặc Jest/Supertest cho API `POST /questions`.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| NEG.test.01 | Guest chọn gửi câu hỏi trên UI | Click nút gửi câu hỏi khi chưa đăng nhập | Chuyển hướng đến đăng nhập/đăng ký, không tạo câu hỏi | Chưa thực thi |
| NEG.test.02 | Guest gọi API tạo câu hỏi | `POST /questions` không có token | Trả `UNAUTHORIZED` hoặc HTTP 401, không tạo dữ liệu | Chưa thực thi |
| POS.test.01 | Patient đã đăng nhập gửi câu hỏi | Token Patient hợp lệ và nội dung hợp lệ | Cho phép vào luồng gửi câu hỏi theo điều kiện nghiệp vụ | Chưa thực thi |

### 2.2. Đặc tả các testcases cho Usecase UC02: Patient đặt lịch hẹn tư vấn

Usecase UC02 kiểm tra luồng Patient đặt lịch hẹn tư vấn với bác sĩ. Theo API contract, các API liên quan gồm `POST /appointments`, `GET /appointments/mine` và `GET /appointments/doctor/me`. Theo source code hiện tại, dữ liệu tạo lịch hẹn gồm `doctorId`, `scheduledAt`, `durationMinutes` tùy chọn, `reason` bắt buộc và `notes` tùy chọn; lịch hẹn mới được tạo với trạng thái `PENDING_CONFIRMATION`. Theo Auth_Authorization_Matrix.md, Guest không được đặt lịch, Patient chỉ được tạo/xem/hủy lịch của chính mình và Doctor chỉ được quản lý lịch thuộc phạm vi của mình.

#### 2.2.1. Kiểm thử Patient đặt lịch với khung giờ còn trống

**Mô tả**

Kiểm thử Patient đặt lịch tư vấn với bác sĩ đang hoạt động, đã được duyệt và còn trống trong khung giờ được chọn. Hệ thống cần tạo appointment hợp lệ, không trùng lịch bác sĩ hoặc bệnh nhân, đồng thời không làm lộ dữ liệu sức khỏe ngoài phạm vi cần thiết.

**Tiền điều kiện**

- Patient đã đăng nhập với token hợp lệ.
- Bác sĩ tồn tại, active, approved và user của bác sĩ còn hoạt động.
- Khung giờ đặt lịch chưa có appointment xung đột.

**Bước thực hiện**

1. Patient chọn bác sĩ trên giao diện hoặc chuẩn bị `doctorId` hợp lệ.
2. Nhập thời gian tư vấn trong tương lai, lý do tư vấn và thời lượng hợp lệ.
3. Gửi yêu cầu `POST /appointments` với token Patient.
4. Kiểm tra appointment được tạo và trả về dữ liệu đúng phạm vi.

**Kỹ thuật, công cụ**

Black-box testing, Equivalence Partitioning, Boundary Value Analysis với dữ liệu ngày giờ, API testing. Công cụ dự kiến: Postman hoặc Jest/Supertest; Playwright nếu UI đặt lịch có sẵn.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Patient đặt lịch với dữ liệu hợp lệ | `doctorId` hợp lệ, `scheduledAt=2026-05-20T09:00:00.000Z`, `durationMinutes=60`, `reason` khác rỗng | Tạo appointment thành công, trạng thái hợp lệ ban đầu | Chưa thực thi |
| POS.test.02 | Không truyền thời lượng tùy chọn | Không gửi `durationMinutes` | Hệ thống dùng thời lượng mặc định theo thiết kế/source code hiện tại | Chưa thực thi |
| NEG.test.01 | Bác sĩ không khả dụng | `doctorId` inactive/unapproved | Không tạo appointment, trả lỗi nghiệp vụ phù hợp | Chưa thực thi |

#### 2.2.2. Kiểm thử Guest User không được đặt lịch

**Mô tả**

Kiểm thử Guest User không thể tạo lịch hẹn tư vấn. Chức năng đặt lịch yêu cầu Patient đã đăng nhập; khi Guest thao tác trên UI cần chuyển hướng đăng nhập/đăng ký, còn khi gọi API trực tiếp không có token cần bị từ chối.

**Tiền điều kiện**

- Guest User chưa đăng nhập.
- Có bác sĩ public hợp lệ.
- Endpoint tạo appointment được bảo vệ bằng xác thực.

**Bước thực hiện**

1. Guest chọn nút đặt lịch từ trang danh sách hoặc chi tiết bác sĩ.
2. Quan sát điều hướng trên UI.
3. Gọi `POST /appointments` không kèm `Authorization` header.
4. Kiểm tra hệ thống không tạo appointment.

**Kỹ thuật, công cụ**

Black-box testing, Decision Table Testing, API testing. Công cụ dự kiến: Playwright cho UI; Postman hoặc Jest/Supertest cho API.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| NEG.test.01 | Guest đặt lịch trên UI | Click nút đặt lịch khi chưa đăng nhập | Chuyển hướng đăng nhập/đăng ký, không tạo appointment | Chưa thực thi |
| NEG.test.02 | Guest gọi API đặt lịch | `POST /appointments` không token | Trả `UNAUTHORIZED` hoặc HTTP 401, không tạo dữ liệu | Chưa thực thi |
| POS.test.01 | Patient gọi API đặt lịch | Token Patient hợp lệ | Cho phép vào luồng đặt lịch nếu dữ liệu hợp lệ | Chưa thực thi |

#### 2.2.3. Kiểm thử đặt lịch khi thiếu thông tin bắt buộc

**Mô tả**

Kiểm thử hệ thống từ chối yêu cầu đặt lịch khi thiếu các trường bắt buộc như `doctorId`, `scheduledAt` hoặc `reason`. Đây là kiểm thử dữ liệu đầu vào nhằm bảo đảm validation hoạt động trước khi ghi dữ liệu appointment.

**Tiền điều kiện**

- Patient đã đăng nhập với token hợp lệ.
- Endpoint `POST /appointments` hoạt động.
- Validation pipe của backend được bật theo source code hiện tại.

**Bước thực hiện**

1. Chuẩn bị request đặt lịch thiếu một trường bắt buộc.
2. Gửi `POST /appointments` với token Patient.
3. Quan sát mã lỗi và thông báo phản hồi.
4. Kiểm tra không có appointment mới được tạo.

**Kỹ thuật, công cụ**

Black-box testing, Equivalence Partitioning, Boundary Value Analysis cho chuỗi rỗng/ngày giờ không hợp lệ, API testing. Công cụ dự kiến: Postman hoặc Jest/Supertest.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| NEG.test.01 | Thiếu `doctorId` | Body không có `doctorId` | Trả `VALIDATION_ERROR` hoặc HTTP 400, không tạo appointment | Chưa thực thi |
| NEG.test.02 | Thiếu hoặc sai định dạng `scheduledAt` | Không có `scheduledAt` hoặc `scheduledAt=abc` | Trả lỗi validation/ngày giờ không hợp lệ, không tạo appointment | Chưa thực thi |
| NEG.test.03 | Thiếu lý do tư vấn | `reason=""` hoặc không gửi `reason` | Trả lỗi validation, không tạo appointment | Chưa thực thi |
| POS.test.01 | Dữ liệu bắt buộc đầy đủ | Có `doctorId`, `scheduledAt`, `reason` hợp lệ | Cho phép xử lý đặt lịch nếu không có xung đột | Chưa thực thi |

#### 2.2.4. Kiểm thử không cho đặt lịch vào khung giờ đã được đặt

**Mô tả**

Kiểm thử hệ thống ngăn việc đặt lịch trùng khung giờ với appointment đã tồn tại của cùng bác sĩ hoặc cùng bệnh nhân. Theo chiến lược kiểm thử, đây là nhóm kiểm thử reliability/data consistency quan trọng của FR-07.

**Tiền điều kiện**

- Patient đã đăng nhập.
- Có appointment hiện hữu ở trạng thái còn gây xung đột theo thiết kế/source code hiện tại.
- Bác sĩ và bệnh nhân trong dữ liệu kiểm thử hợp lệ.

**Bước thực hiện**

1. Tạo hoặc chuẩn bị một appointment đã chiếm khung giờ.
2. Patient gửi yêu cầu đặt lịch mới cùng khung giờ hoặc chồng lấn thời gian.
3. Quan sát phản hồi của hệ thống.
4. Kiểm tra không tạo appointment trùng.

**Kỹ thuật, công cụ**

Black-box testing, Boundary Value Analysis với khoảng thời gian bắt đầu/kết thúc, Decision Table Testing, API testing. Công cụ dự kiến: Postman hoặc Jest/Supertest; integration test dự kiến cho conflict booking.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| NEG.test.01 | Trùng giờ bắt đầu với lịch đã có | Existing `09:00-10:00`, new `09:00-10:00` | Từ chối đặt lịch, trả lỗi conflict/nghiệp vụ phù hợp | Chưa thực thi |
| NEG.test.02 | Chồng lấn một phần | Existing `09:00-10:00`, new `09:30-10:30` | Từ chối đặt lịch, không tạo appointment | Chưa thực thi |
| POS.test.01 | Sát biên không chồng lấn | Existing `09:00-10:00`, new `10:00-11:00` | Cho phép đặt lịch nếu dữ liệu khác hợp lệ | Chưa thực thi |

#### 2.2.5. Kiểm thử appointment được tạo với trạng thái hợp lệ

**Mô tả**

Kiểm thử appointment mới sau khi Patient đặt lịch thành công có trạng thái ban đầu hợp lệ. Theo source code hiện tại, trạng thái mặc định khi tạo là `PENDING_CONFIRMATION`; trạng thái này cho phép bác sĩ xác nhận ở bước nghiệp vụ tiếp theo.

**Tiền điều kiện**

- Patient đã đăng nhập.
- Bác sĩ hợp lệ và khung giờ còn trống.
- Request đặt lịch có dữ liệu hợp lệ.

**Bước thực hiện**

1. Gửi `POST /appointments` với dữ liệu hợp lệ.
2. Kiểm tra response hoặc dữ liệu trả về.
3. Gọi `GET /appointments/mine` để kiểm tra appointment mới.
4. Đối chiếu trạng thái appointment với giá trị hợp lệ.

**Kỹ thuật, công cụ**

Black-box testing, Equivalence Partitioning, Decision Table Testing theo trạng thái appointment, API testing. Công cụ dự kiến: Postman hoặc Jest/Supertest.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Tạo appointment hợp lệ | Body đặt lịch hợp lệ | Appointment được tạo với trạng thái `PENDING_CONFIRMATION` hoặc trạng thái chờ xác nhận theo thiết kế | Chưa thực thi |
| NEG.test.01 | Appointment mới có trạng thái kết thúc | Response trả `COMPLETED` hoặc `CANCELLED` ngay khi tạo | Không hợp lệ; cần ghi nhận lỗi nếu xảy ra | Chưa thực thi |
| POS.test.02 | Trạng thái nằm trong enum hợp lệ | `PENDING_CONFIRMATION`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NO_SHOW` | Chỉ chấp nhận trạng thái thuộc enum thiết kế/source code | Chưa thực thi |

#### 2.2.6. Kiểm thử Patient xem danh sách lịch hẹn của chính mình

**Mô tả**

Kiểm thử Patient đã đăng nhập xem danh sách lịch hẹn của chính mình thông qua UI hoặc API `GET /appointments/mine`. Hệ thống chỉ được trả dữ liệu appointment thuộc Patient đang đăng nhập, đồng thời không trả dữ liệu nhạy cảm không cần thiết của người dùng khác.

**Tiền điều kiện**

- Patient đã đăng nhập.
- Patient có ít nhất một appointment trong hệ thống.
- Có appointment của Patient khác để kiểm tra ownership.

**Bước thực hiện**

1. Patient mở trang lịch hẹn của mình hoặc gọi `GET /appointments/mine`.
2. Kiểm tra danh sách trả về.
3. Đối chiếu các appointment với Patient đang đăng nhập.
4. Kiểm tra không có dữ liệu appointment của Patient khác.

**Kỹ thuật, công cụ**

Black-box testing, Decision Table Testing cho ownership, API testing. Công cụ dự kiến: Playwright nếu UI có sẵn; Postman hoặc Jest/Supertest cho API.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Patient có lịch hẹn | Token Patient A | Trả danh sách appointment của Patient A | Chưa thực thi |
| POS.test.02 | Patient chưa có lịch hẹn | Token Patient không có appointment | Trả danh sách rỗng hoặc thông báo phù hợp | Chưa thực thi |
| NEG.test.01 | Response chứa appointment của Patient khác | Appointment của Patient B xuất hiện trong danh sách Patient A | Không được phép; nếu xuất hiện là lỗi ownership/privacy | Chưa thực thi |

#### 2.2.7. Kiểm thử Doctor thấy lịch hẹn trong danh sách làm việc

**Mô tả**

Kiểm thử Doctor xem danh sách lịch hẹn thuộc phạm vi của mình thông qua `GET /appointments/doctor/me`. Lịch hẹn do Patient đặt với bác sĩ tương ứng cần xuất hiện trong danh sách làm việc của Doctor, phục vụ bước xác nhận và thực hiện tư vấn.

**Tiền điều kiện**

- Doctor đã đăng nhập với token hợp lệ.
- Có appointment được đặt với doctor profile của Doctor đang đăng nhập.
- Có appointment của bác sĩ khác để kiểm tra phạm vi dữ liệu.

**Bước thực hiện**

1. Doctor đăng nhập và mở trang quản lý lịch hoặc gọi `GET /appointments/doctor/me`.
2. Kiểm tra danh sách lịch hẹn trả về.
3. Đối chiếu appointment thuộc Doctor đang đăng nhập.
4. Kiểm tra không hiển thị appointment của bác sĩ khác.

**Kỹ thuật, công cụ**

Black-box testing, Decision Table Testing cho role/scope, API testing. Công cụ dự kiến: Playwright nếu UI có sẵn; Postman hoặc Jest/Supertest cho API.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Doctor có lịch hẹn được gán | Token Doctor A | Trả danh sách appointment của Doctor A | Chưa thực thi |
| POS.test.02 | Doctor chưa có lịch hẹn | Token Doctor không có appointment | Trả danh sách rỗng hoặc thông báo phù hợp | Chưa thực thi |
| NEG.test.01 | Response chứa lịch của bác sĩ khác | Appointment của Doctor B xuất hiện với Doctor A | Không được phép; nếu xuất hiện là lỗi phân quyền/phạm vi | Chưa thực thi |

#### 2.2.8. Kiểm thử Patient không được xem lịch hẹn của Patient khác

**Mô tả**

Kiểm thử quyền riêng tư dữ liệu lịch hẹn. Patient chỉ được truy cập appointment của chính mình, không được xem lịch hẹn, lý do tư vấn hoặc ghi chú của Patient khác. Đây là yêu cầu trực tiếp từ Auth_Authorization_Matrix.md và Privacy_and_Data_Handling.md.

**Tiền điều kiện**

- Có hai tài khoản Patient khác nhau.
- Patient A và Patient B đều có dữ liệu appointment.
- Patient A đã đăng nhập với token hợp lệ.

**Bước thực hiện**

1. Patient A gọi `GET /appointments/mine`.
2. Kiểm tra danh sách không chứa appointment của Patient B.
3. Nếu có API chi tiết appointment theo ID trong phiên bản sau, thử truy cập appointment ID của Patient B bằng token Patient A.
4. Kiểm tra hệ thống từ chối truy cập hoặc không trả dữ liệu không thuộc sở hữu.

**Kỹ thuật, công cụ**

Black-box testing, Decision Table Testing, API testing, kiểm thử privacy/ownership. Công cụ dự kiến: Postman hoặc Jest/Supertest; Playwright nếu UI có sẵn.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Patient xem dữ liệu của chính mình | Token Patient A, appointment thuộc Patient A | Cho phép xem dữ liệu appointment của Patient A | Chưa thực thi |
| NEG.test.01 | Patient thấy appointment của người khác trong danh sách | Token Patient A, appointment thuộc Patient B | Không hiển thị appointment của Patient B | Chưa thực thi |
| NEG.test.02 | Patient truy cập trực tiếp appointment người khác nếu có endpoint chi tiết | Token Patient A, appointment ID của Patient B | Trả `FORBIDDEN`/`NOT_FOUND` theo policy, không lộ dữ liệu | Chưa thực thi |

### 2.3. Đặc tả các testcases cho Usecase UC03: Doctor phản hồi câu hỏi sức khỏe

Usecase UC03 kiểm tra luồng Patient gửi câu hỏi sức khỏe và Doctor phản hồi câu hỏi theo phạm vi xử lý. Theo API contract, các API liên quan gồm `POST /questions`, `GET /questions/mine`, `GET /questions/assigned` và `POST /questions/:id/answers`. Theo source code hiện tại, câu hỏi gồm `title`, `content`, `doctorId` tùy chọn và được tạo với trạng thái `PENDING`; phản hồi của bác sĩ gồm `content` và khi trả lời thành công, trạng thái câu hỏi chuyển sang `ANSWERED`. Theo Auth_Authorization_Matrix.md và Privacy_and_Data_Handling.md, Guest không được gửi câu hỏi, Patient chỉ được xem câu hỏi của chính mình, Doctor chỉ được xem/trả lời câu hỏi được gán hoặc câu hỏi mở trong phạm vi xử lý.

#### 2.3.1. Kiểm thử Patient gửi câu hỏi sức khỏe hợp lệ

**Mô tả**

Kiểm thử Patient đã đăng nhập gửi câu hỏi sức khỏe với tiêu đề và nội dung hợp lệ. Câu hỏi có thể gán cho một bác sĩ hợp lệ hoặc để mở theo thiết kế hiện tại. Hệ thống cần lưu câu hỏi mà không làm lộ dữ liệu sức khỏe cho người không có quyền.

**Tiền điều kiện**

- Patient đã đăng nhập với token hợp lệ.
- Nếu có `doctorId`, bác sĩ phải active và approved.
- Endpoint `POST /questions` sẵn sàng.

**Bước thực hiện**

1. Patient mở trang gửi câu hỏi sức khỏe hoặc chuẩn bị request API.
2. Nhập `title`, `content` hợp lệ và tùy chọn `doctorId`.
3. Gửi yêu cầu `POST /questions` với token Patient.
4. Kiểm tra câu hỏi được tạo và dữ liệu trả về đúng phạm vi.

**Kỹ thuật, công cụ**

Black-box testing, Equivalence Partitioning, API testing. Công cụ dự kiến: Postman hoặc Jest/Supertest; Playwright nếu UI gửi câu hỏi có sẵn.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Patient gửi câu hỏi hợp lệ không gán bác sĩ | `title` hợp lệ, `content` hợp lệ, không gửi `doctorId` | Tạo câu hỏi thành công với dữ liệu thuộc Patient hiện tại | Chưa thực thi |
| POS.test.02 | Patient gửi câu hỏi gán bác sĩ hợp lệ | `doctorId` active/approved | Tạo câu hỏi thành công và gán đúng bác sĩ | Chưa thực thi |
| NEG.test.01 | Gán bác sĩ không khả dụng | `doctorId` inactive/unapproved/không tồn tại | Không tạo câu hỏi, trả lỗi nghiệp vụ phù hợp | Chưa thực thi |

#### 2.3.2. Kiểm thử không cho Guest User gửi câu hỏi sức khỏe

**Mô tả**

Kiểm thử Guest User không được gửi câu hỏi sức khỏe. Theo ma trận phân quyền, tạo câu hỏi là quyền của Patient đã đăng nhập; Guest cần được chuyển hướng đăng nhập/đăng ký trên UI hoặc nhận lỗi unauthorized khi gọi API trực tiếp.

**Tiền điều kiện**

- Guest User chưa đăng nhập.
- Endpoint `POST /questions` yêu cầu xác thực.
- Giao diện hoặc API gửi câu hỏi có thể truy cập để kiểm thử.

**Bước thực hiện**

1. Guest chọn hành động gửi câu hỏi trên giao diện.
2. Quan sát điều hướng đăng nhập/đăng ký.
3. Gọi `POST /questions` không kèm token.
4. Kiểm tra hệ thống không tạo câu hỏi mới.

**Kỹ thuật, công cụ**

Black-box testing, Decision Table Testing, API testing. Công cụ dự kiến: Playwright nếu UI có sẵn; Postman hoặc Jest/Supertest cho API.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| NEG.test.01 | Guest gửi câu hỏi trên UI | Click gửi câu hỏi khi chưa đăng nhập | Chuyển hướng đăng nhập/đăng ký, không tạo câu hỏi | Chưa thực thi |
| NEG.test.02 | Guest gọi API gửi câu hỏi | `POST /questions` không token | Trả `UNAUTHORIZED` hoặc HTTP 401, không tạo dữ liệu | Chưa thực thi |
| POS.test.01 | Patient gửi câu hỏi | Token Patient hợp lệ | Cho phép xử lý nếu dữ liệu hợp lệ | Chưa thực thi |

#### 2.3.3. Kiểm thử không cho gửi câu hỏi có nội dung rỗng

**Mô tả**

Kiểm thử validation dữ liệu khi Patient gửi câu hỏi có nội dung rỗng hoặc thiếu tiêu đề. Theo source code hiện tại, `title` và `content` đều là chuỗi bắt buộc, không được rỗng; `title` có giới hạn độ dài tối đa.

**Tiền điều kiện**

- Patient đã đăng nhập với token hợp lệ.
- Validation pipe của backend được bật.
- Endpoint `POST /questions` hoạt động.

**Bước thực hiện**

1. Chuẩn bị request gửi câu hỏi thiếu `content` hoặc `title`.
2. Gửi request với token Patient.
3. Quan sát mã lỗi và thông báo validation.
4. Kiểm tra không có câu hỏi mới được lưu.

**Kỹ thuật, công cụ**

Black-box testing, Equivalence Partitioning, API testing. Công cụ dự kiến: Postman hoặc Jest/Supertest.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| NEG.test.01 | Nội dung câu hỏi rỗng | `content=""` | Trả `VALIDATION_ERROR` hoặc HTTP 400, không tạo câu hỏi | Chưa thực thi |
| NEG.test.02 | Thiếu tiêu đề | Không gửi `title` hoặc `title=""` | Trả lỗi validation, không tạo câu hỏi | Chưa thực thi |
| NEG.test.03 | Tiêu đề vượt giới hạn | `title` dài hơn 200 ký tự | Trả lỗi validation theo source code hiện tại | Chưa thực thi |
| POS.test.01 | Tiêu đề và nội dung hợp lệ | `title` <= 200 ký tự, `content` khác rỗng | Cho phép tạo câu hỏi nếu các điều kiện khác hợp lệ | Chưa thực thi |

#### 2.3.4. Kiểm thử câu hỏi được lưu với trạng thái PENDING

**Mô tả**

Kiểm thử trạng thái ban đầu của câu hỏi sau khi Patient gửi thành công. Theo source code hiện tại và mô hình dữ liệu Prisma, câu hỏi mới được tạo với trạng thái `PENDING`.

**Tiền điều kiện**

- Patient đã đăng nhập.
- Request gửi câu hỏi có dữ liệu hợp lệ.
- Câu hỏi chưa được bác sĩ phản hồi.

**Bước thực hiện**

1. Gửi `POST /questions` với dữ liệu hợp lệ.
2. Kiểm tra response của API hoặc gọi `GET /questions/mine`.
3. Xác định trạng thái của câu hỏi vừa tạo.
4. Đối chiếu trạng thái với giá trị mong đợi.

**Kỹ thuật, công cụ**

Black-box testing, Equivalence Partitioning, Decision Table Testing theo trạng thái câu hỏi, API testing. Công cụ dự kiến: Postman hoặc Jest/Supertest.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Câu hỏi mới tạo hợp lệ | `POST /questions` thành công | Trạng thái câu hỏi là `PENDING` | Chưa thực thi |
| NEG.test.01 | Câu hỏi mới ở trạng thái đã trả lời | Response trả `ANSWERED` ngay khi tạo | Không hợp lệ; cần ghi nhận lỗi nếu xảy ra | Chưa thực thi |
| POS.test.02 | Trạng thái thuộc enum hợp lệ | `PENDING`, `ANSWERED`, `CLOSED`, `MODERATED` | Chỉ chấp nhận trạng thái thuộc enum thiết kế/source code | Chưa thực thi |

#### 2.3.5. Kiểm thử Doctor xem danh sách câu hỏi cần phản hồi

**Mô tả**

Kiểm thử Doctor xem danh sách câu hỏi cần phản hồi bằng `GET /questions/assigned`. Theo source code hiện tại, Doctor xem được câu hỏi được gán cho mình và câu hỏi mở chưa gán có trạng thái `PENDING`. Danh sách này không được làm lộ câu hỏi nằm ngoài phạm vi xử lý.

**Tiền điều kiện**

- Doctor đã đăng nhập với token hợp lệ.
- Có câu hỏi được gán cho Doctor hoặc câu hỏi mở trạng thái `PENDING`.
- Có câu hỏi thuộc phạm vi Doctor khác để kiểm tra phân quyền.

**Bước thực hiện**

1. Doctor mở trang phản hồi câu hỏi hoặc gọi `GET /questions/assigned`.
2. Kiểm tra danh sách câu hỏi trả về.
3. Đối chiếu từng câu hỏi với phạm vi Doctor đang đăng nhập.
4. Kiểm tra không hiển thị dữ liệu ngoài phạm vi.

**Kỹ thuật, công cụ**

Black-box testing, Decision Table Testing cho role/scope, API testing. Công cụ dự kiến: Playwright nếu UI có sẵn; Postman hoặc Jest/Supertest cho API.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Câu hỏi gán đúng Doctor | Token Doctor A, question.doctorId = Doctor A | Câu hỏi xuất hiện trong danh sách | Chưa thực thi |
| POS.test.02 | Câu hỏi mở chưa gán và PENDING | question.doctorId = null, status = `PENDING` | Câu hỏi xuất hiện để Doctor có thể xử lý | Chưa thực thi |
| NEG.test.01 | Câu hỏi gán cho Doctor khác | Token Doctor A, question.doctorId = Doctor B | Không xuất hiện trong danh sách của Doctor A | Chưa thực thi |

#### 2.3.6. Kiểm thử Doctor phản hồi câu hỏi sức khỏe

**Mô tả**

Kiểm thử Doctor phản hồi một câu hỏi hợp lệ trong phạm vi xử lý. Hệ thống cần lưu câu trả lời, gắn với Doctor hiện tại, đồng thời ghi nhận trạng thái và các side-effect cần thiết theo thiết kế/source code hiện tại.

**Tiền điều kiện**

- Doctor đã đăng nhập với token hợp lệ.
- Câu hỏi tồn tại, đang ở trạng thái `PENDING`.
- Câu hỏi được gán cho Doctor hoặc là câu hỏi mở chưa gán.

**Bước thực hiện**

1. Doctor chọn câu hỏi cần phản hồi.
2. Nhập nội dung phản hồi hợp lệ.
3. Gửi `POST /questions/:id/answers`.
4. Kiểm tra phản hồi được lưu và trả về đúng dữ liệu.

**Kỹ thuật, công cụ**

Black-box testing, Equivalence Partitioning, Decision Table Testing, API testing. Công cụ dự kiến: Postman hoặc Jest/Supertest; Playwright nếu UI bác sĩ có sẵn.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Doctor trả lời câu hỏi PENDING thuộc phạm vi | `content` hợp lệ, question PENDING | Lưu câu trả lời thành công | Chưa thực thi |
| NEG.test.01 | Nội dung phản hồi rỗng | `content=""` | Trả lỗi validation, không lưu câu trả lời | Chưa thực thi |
| NEG.test.02 | Câu hỏi không tồn tại | `questionId` không tồn tại | Trả `NOT_FOUND` hoặc HTTP 404 | Chưa thực thi |

#### 2.3.7. Kiểm thử trạng thái câu hỏi chuyển từ PENDING sang ANSWERED

**Mô tả**

Kiểm thử trạng thái câu hỏi sau khi Doctor phản hồi thành công. Theo source code hiện tại, khi Doctor trả lời câu hỏi, hệ thống cập nhật `doctorId` nếu cần và chuyển trạng thái từ `PENDING` sang `ANSWERED`.

**Tiền điều kiện**

- Doctor đã đăng nhập.
- Có câu hỏi trạng thái `PENDING` trong phạm vi xử lý.
- Nội dung phản hồi hợp lệ.

**Bước thực hiện**

1. Doctor gửi phản hồi cho câu hỏi PENDING.
2. Kiểm tra response sau khi trả lời.
3. Patient hoặc Doctor tải lại dữ liệu câu hỏi.
4. Đối chiếu trạng thái câu hỏi sau phản hồi.

**Kỹ thuật, công cụ**

Black-box testing, Decision Table Testing theo trạng thái câu hỏi, API testing. Công cụ dự kiến: Postman hoặc Jest/Supertest.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Doctor trả lời câu hỏi PENDING | Question status trước khi trả lời = `PENDING` | Question status sau khi trả lời = `ANSWERED` | Chưa thực thi |
| NEG.test.01 | Doctor trả lời câu hỏi đã ANSWERED | Question status = `ANSWERED` | Từ chối xử lý, không tạo thêm phản hồi không hợp lệ | Chưa thực thi |
| NEG.test.02 | Doctor trả lời câu hỏi bị đóng/kiểm duyệt | Question status = `CLOSED` hoặc `MODERATED` | Từ chối xử lý theo quy tắc trạng thái | Chưa thực thi |

#### 2.3.8. Kiểm thử Patient xem phản hồi của bác sĩ

**Mô tả**

Kiểm thử Patient xem lại câu hỏi của chính mình và phản hồi của bác sĩ qua `GET /questions/mine`. Dữ liệu phản hồi thuộc nhóm dữ liệu sức khỏe nên chỉ Patient chủ sở hữu, Doctor phụ trách hoặc Admin theo policy mới được truy cập.

**Tiền điều kiện**

- Patient đã đăng nhập với token hợp lệ.
- Patient có câu hỏi đã được Doctor phản hồi.
- Có câu hỏi của Patient khác để kiểm tra ownership.

**Bước thực hiện**

1. Patient gọi `GET /questions/mine` hoặc mở trang câu hỏi của mình.
2. Chọn câu hỏi đã có phản hồi.
3. Kiểm tra nội dung phản hồi của bác sĩ được hiển thị.
4. Kiểm tra không hiển thị câu hỏi/phản hồi của Patient khác.

**Kỹ thuật, công cụ**

Black-box testing, Decision Table Testing cho ownership/privacy, API testing. Công cụ dự kiến: Playwright nếu UI có sẵn; Postman hoặc Jest/Supertest cho API.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Patient xem câu hỏi đã được trả lời của chính mình | Token Patient A, question của Patient A có answers | Hiển thị phản hồi của bác sĩ | Chưa thực thi |
| POS.test.02 | Patient xem câu hỏi chưa có phản hồi | Token Patient A, question status `PENDING` | Hiển thị câu hỏi và trạng thái chờ phản hồi | Chưa thực thi |
| NEG.test.01 | Response chứa câu hỏi của Patient khác | Token Patient A, question của Patient B | Không hiển thị dữ liệu của Patient B | Chưa thực thi |

#### 2.3.9. Kiểm thử Doctor không được phản hồi câu hỏi không thuộc phạm vi xử lý nếu business rule applies

**Mô tả**

Kiểm thử Doctor không được phản hồi câu hỏi đã được gán cho Doctor khác. Theo source code hiện tại, nếu câu hỏi có `doctorId` và `doctorId` khác với Doctor đang đăng nhập, hệ thống trả lỗi phân quyền. Quy tắc này giúp bảo đảm bác sĩ chỉ xử lý câu hỏi trong phạm vi được phép.

**Tiền điều kiện**

- Có Doctor A và Doctor B.
- Có câu hỏi trạng thái `PENDING` được gán cho Doctor B.
- Doctor A đã đăng nhập với token hợp lệ.

**Bước thực hiện**

1. Doctor A gọi `GET /questions/assigned` để kiểm tra câu hỏi không thuộc danh sách của mình.
2. Doctor A cố gọi `POST /questions/:id/answers` với question ID được gán cho Doctor B.
3. Quan sát phản hồi của hệ thống.
4. Kiểm tra không có câu trả lời mới được tạo bởi Doctor A.

**Kỹ thuật, công cụ**

Black-box testing, Decision Table Testing cho role/scope, API testing. Công cụ dự kiến: Postman hoặc Jest/Supertest; Playwright nếu UI có thể mô phỏng tài khoản Doctor khác nhau.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| NEG.test.01 | Doctor A trả lời câu hỏi gán cho Doctor B | Token Doctor A, question.doctorId = Doctor B | Trả `FORBIDDEN` hoặc HTTP 403, không lưu phản hồi | Chưa thực thi |
| POS.test.01 | Doctor B trả lời câu hỏi của chính mình | Token Doctor B, question.doctorId = Doctor B | Cho phép phản hồi nếu câu hỏi PENDING và nội dung hợp lệ | Chưa thực thi |
| POS.test.02 | Doctor A trả lời câu hỏi mở chưa gán | Token Doctor A, question.doctorId = null, status = `PENDING` | Cho phép phản hồi và gán câu hỏi cho Doctor A theo source code hiện tại | Chưa thực thi |

### 2.4. Đặc tả các testcases cho Usecase UC04: Doctor thực hiện phiên tư vấn trực tuyến

Usecase UC04 kiểm tra luồng tư vấn trực tuyến sau khi Patient đã đặt lịch và Doctor thực hiện phiên tư vấn. Theo API contract, các API liên quan gồm `POST /consultations/:appointmentId/start`, `POST /consultations/:appointmentId/join`, `GET /consultations/:appointmentId/messages`, `POST /consultations/:appointmentId/messages`, `PATCH /consultations/:appointmentId/summary`, `PATCH /consultations/:appointmentId/end`, `GET /consultations/mine` và `GET /consultations/doctor/me`. Theo source code hiện tại, hệ thống hỗ trợ kênh `CHAT` hoặc `VIDEO`, có fallback từ `VIDEO` sang `CHAT` nếu video provider không khả dụng, kiểm tra time-window bằng các biến `CONSULTATION_EARLY_JOIN_MINUTES` và `CONSULTATION_LATE_JOIN_MINUTES`, đồng thời khi Doctor kết thúc phiên thì appointment chuyển sang `COMPLETED`.

#### 2.4.1. Kiểm thử Patient tham gia phiên tư vấn hợp lệ

**Mô tả**

Kiểm thử Patient thuộc appointment hợp lệ tham gia phiên tư vấn đã được Doctor khởi tạo. Hệ thống cần cho phép Patient join đúng session trong thời gian cho phép và chỉ trả dữ liệu thuộc appointment của chính Patient đó.

**Tiền điều kiện**

- Patient đã đăng nhập với token hợp lệ.
- Appointment thuộc Patient đang đăng nhập, có Doctor phù hợp và đã có consultation session.
- Thời điểm join nằm trong khoảng thời gian cho phép.

**Bước thực hiện**

1. Doctor bắt đầu phiên tư vấn cho appointment hợp lệ.
2. Patient gọi `POST /consultations/:appointmentId/join` hoặc tham gia qua WebSocket `consultation:join`.
3. Quan sát response join session.
4. Kiểm tra `sessionId`, `status`, `channel` và quyền truy cập dữ liệu.

**Kỹ thuật, công cụ**

Black-box testing, Equivalence Partitioning, Decision Table Testing, API testing, Integration testing nếu kiểm thử WebSocket. Công cụ dự kiến: Postman hoặc Jest/Supertest cho REST; Playwright/Socket.IO client nếu kiểm thử UI/realtime.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Patient thuộc appointment join đúng thời gian | Token Patient A, appointment của Patient A, session đã start | Join thành công, trả session đúng appointment | Chưa thực thi |
| NEG.test.01 | Patient join khi session chưa start | Appointment hợp lệ nhưng chưa có session | Trả lỗi session chưa được bắt đầu | Chưa thực thi |
| NEG.test.02 | Guest join session | Không có token | Trả `UNAUTHORIZED` hoặc từ chối kết nối WebSocket | Chưa thực thi |

#### 2.4.2. Kiểm thử Doctor bắt đầu phiên tư vấn hợp lệ

**Mô tả**

Kiểm thử Doctor phụ trách appointment bắt đầu phiên tư vấn trong thời gian cho phép. Hệ thống cần tạo hoặc cập nhật consultation session với trạng thái `ONGOING`, ghi nhận `startedAt` và kênh tư vấn phù hợp.

**Tiền điều kiện**

- Doctor đã đăng nhập với token hợp lệ.
- Appointment thuộc Doctor đang đăng nhập.
- Appointment ở trạng thái có thể bắt đầu theo source code hiện tại, như `CONFIRMED` hoặc `PENDING_CONFIRMATION`.
- Thời điểm start nằm trong khoảng cho phép.

**Bước thực hiện**

1. Doctor chọn appointment cần tư vấn.
2. Gửi `POST /consultations/:appointmentId/start` với `channel` tùy chọn.
3. Quan sát session được tạo/cập nhật.
4. Kiểm tra trạng thái session và kênh tư vấn.

**Kỹ thuật, công cụ**

Black-box testing, Equivalence Partitioning, Decision Table Testing, API testing. Công cụ dự kiến: Postman hoặc Jest/Supertest; Playwright nếu UI bác sĩ có sẵn.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Doctor bắt đầu appointment hợp lệ | Token Doctor A, appointment của Doctor A, `channel=CHAT` | Tạo/cập nhật session `ONGOING`, `channel=CHAT` | Chưa thực thi |
| POS.test.02 | Appointment PENDING_CONFIRMATION theo source code hiện tại | Appointment status = `PENDING_CONFIRMATION` | Có thể start và appointment được xác nhận theo xử lý hiện tại | Chưa thực thi |
| NEG.test.01 | Doctor khác start appointment | Token Doctor B, appointment thuộc Doctor A | Trả `FORBIDDEN`, không start session | Chưa thực thi |

#### 2.4.3. Kiểm thử hệ thống từ chối truy cập phiên tư vấn khi appointment không hợp lệ

**Mô tả**

Kiểm thử hệ thống từ chối start/join session khi appointment không tồn tại hoặc ở trạng thái không phù hợp. Đây là điều kiện cần để tránh tạo phiên tư vấn không có lịch hẹn hợp lệ.

**Tiền điều kiện**

- Có tài khoản Doctor hoặc Patient hợp lệ.
- Appointment ID kiểm thử gồm giá trị không tồn tại hoặc appointment không ở trạng thái cho phép.
- Endpoint consultation hoạt động.

**Bước thực hiện**

1. Gửi request start hoặc join với appointment ID không tồn tại.
2. Gửi request start với appointment ở trạng thái không thể bắt đầu.
3. Quan sát response.
4. Kiểm tra không có session mới được tạo.

**Kỹ thuật, công cụ**

Black-box testing, Equivalence Partitioning, Decision Table Testing, API testing. Công cụ dự kiến: Postman hoặc Jest/Supertest.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| NEG.test.01 | Appointment không tồn tại | `appointmentId` UUID không tồn tại | Trả `NOT_FOUND` hoặc HTTP 404 | Chưa thực thi |
| NEG.test.02 | Appointment đã hủy | Appointment status = `CANCELLED` | Từ chối start/join, không tạo session | Chưa thực thi |
| NEG.test.03 | Appointment đã hoàn tất trước đó | Appointment status = `COMPLETED` | Từ chối start lại theo quy tắc trạng thái | Chưa thực thi |

#### 2.4.4. Kiểm thử hệ thống từ chối truy cập khi người dùng không thuộc appointment

**Mô tả**

Kiểm thử ownership/scope của phiên tư vấn. Patient hoặc Doctor không thuộc appointment không được join, gửi tin nhắn, xem tin nhắn, cập nhật kết quả hoặc kết thúc session của appointment đó.

**Tiền điều kiện**

- Có Patient A, Patient B, Doctor A và Doctor B.
- Appointment thuộc Patient A và Doctor A.
- Patient B hoặc Doctor B đã đăng nhập.

**Bước thực hiện**

1. Patient B gọi `POST /consultations/:appointmentId/join` với appointment của Patient A.
2. Doctor B gọi `POST /consultations/:appointmentId/join` hoặc start/end với appointment của Doctor A.
3. Thử xem/gửi message nếu session đã tồn tại.
4. Kiểm tra hệ thống từ chối truy cập và không lộ dữ liệu tư vấn.

**Kỹ thuật, công cụ**

Black-box testing, Decision Table Testing, API testing, kiểm thử privacy/ownership. Công cụ dự kiến: Postman hoặc Jest/Supertest; Integration testing nếu kiểm thử WebSocket.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| NEG.test.01 | Patient khác join appointment | Token Patient B, appointment của Patient A | Trả `FORBIDDEN`, không lộ session/message | Chưa thực thi |
| NEG.test.02 | Doctor khác thao tác session | Token Doctor B, appointment của Doctor A | Trả `FORBIDDEN`, không cập nhật session | Chưa thực thi |
| POS.test.01 | Người dùng thuộc appointment | Token Patient A hoặc Doctor A | Cho phép thao tác đúng vai trò nếu điều kiện khác hợp lệ | Chưa thực thi |

#### 2.4.5. Kiểm thử hệ thống từ chối truy cập khi chưa đến thời gian cho phép

**Mô tả**

Kiểm thử time-window của phiên tư vấn. Theo source code hiện tại, hệ thống chỉ cho phép start/join trong khoảng từ `scheduledAt - CONSULTATION_EARLY_JOIN_MINUTES` đến `scheduledAt + durationMinutes + CONSULTATION_LATE_JOIN_MINUTES`.

**Tiền điều kiện**

- Appointment hợp lệ thuộc Doctor/Patient kiểm thử.
- Appointment có `scheduledAt` trong tương lai hoặc đã quá hạn để tạo dữ liệu ngoài time-window.
- Các biến cấu hình time-window có giá trị xác định hoặc dùng default theo source code.

**Bước thực hiện**

1. Chuẩn bị appointment chưa đến thời gian cho phép.
2. Doctor gọi `POST /consultations/:appointmentId/start`.
3. Patient hoặc Doctor gọi `POST /consultations/:appointmentId/join`.
4. Quan sát response và kiểm tra không có session hợp lệ được truy cập ngoài khung thời gian.

**Kỹ thuật, công cụ**

Black-box testing, Equivalence Partitioning, Decision Table Testing, API testing, Integration testing nếu cần kiểm soát thời gian. Công cụ dự kiến: Jest/Supertest phù hợp cho kiểm thử có mock thời gian; Postman nếu dùng dữ liệu lịch phù hợp.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| NEG.test.01 | Chưa đến early join window | `now < scheduledAt - earlyJoinMinutes` | Từ chối start/join, trả lỗi ngoài thời gian cho phép | Chưa thực thi |
| POS.test.01 | Đúng biên bắt đầu cho phép | `now = scheduledAt - earlyJoinMinutes` | Cho phép start/join nếu các điều kiện khác hợp lệ | Chưa thực thi |
| NEG.test.02 | Sau late join window | `now > scheduledAt + duration + lateJoinMinutes` | Từ chối start/join | Chưa thực thi |

#### 2.4.6. Kiểm thử khởi tạo phiên chat/video mock

**Mô tả**

Kiểm thử Doctor khởi tạo phiên tư vấn với kênh `CHAT` hoặc `VIDEO` theo DTO `StartSessionDto`. Theo thiết kế MVP, video có thể là mock/provider tùy cấu hình; session cần ghi nhận kênh thực tế để UI biết cách hiển thị.

**Tiền điều kiện**

- Doctor đã đăng nhập.
- Appointment hợp lệ và nằm trong time-window.
- Cấu hình `VIDEO_PROVIDER_ENABLED` được xác định cho môi trường kiểm thử.

**Bước thực hiện**

1. Gửi `POST /consultations/:appointmentId/start` với `channel=CHAT`.
2. Gửi trường hợp khác với `channel=VIDEO` trong môi trường video khả dụng hoặc mock.
3. Quan sát `channel`, `requestedChannel` và `fallbackToChat` nếu có.
4. Kiểm tra session ở trạng thái `ONGOING`.

**Kỹ thuật, công cụ**

Black-box testing, Equivalence Partitioning, Decision Table Testing, API testing, Integration testing nếu có mock provider video. Công cụ dự kiến: Postman hoặc Jest/Supertest.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Khởi tạo phiên CHAT | `channel=CHAT` | Session `ONGOING`, channel thực tế là `CHAT` | Chưa thực thi |
| POS.test.02 | Khởi tạo phiên VIDEO khi provider khả dụng | `channel=VIDEO`, `VIDEO_PROVIDER_ENABLED=true` | Session `ONGOING`, channel thực tế là `VIDEO` | Chưa thực thi |
| NEG.test.01 | Channel không hợp lệ | `channel=AUDIO` | Trả lỗi validation, không cập nhật session | Chưa thực thi |

#### 2.4.7. Kiểm thử fallback sang chat khi video không khả dụng

**Mô tả**

Kiểm thử trường hợp Doctor yêu cầu kênh `VIDEO` nhưng video provider không khả dụng. Theo source code hiện tại, nếu `VIDEO_PROVIDER_ENABLED` không phải `true`, hệ thống dùng kênh `CHAT` và trả cờ `fallbackToChat`.

**Tiền điều kiện**

- Doctor đã đăng nhập.
- Appointment hợp lệ, nằm trong time-window.
- Cấu hình môi trường `VIDEO_PROVIDER_ENABLED=false` hoặc không bật.

**Bước thực hiện**

1. Doctor gửi `POST /consultations/:appointmentId/start` với `channel=VIDEO`.
2. Quan sát response session.
3. Kiểm tra kênh thực tế và cờ fallback.
4. Kiểm tra UI/API vẫn cho phép tiếp tục tư vấn bằng chat.

**Kỹ thuật, công cụ**

Black-box testing, Decision Table Testing, API testing, Integration testing nếu cần thay đổi cấu hình môi trường. Công cụ dự kiến: Jest/Supertest hoặc Postman trên môi trường cấu hình phù hợp.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | VIDEO không khả dụng | `channel=VIDEO`, `VIDEO_PROVIDER_ENABLED=false` | Session tạo thành công với `channel=CHAT`, `fallbackToChat=true` | Chưa thực thi |
| POS.test.02 | VIDEO khả dụng | `channel=VIDEO`, `VIDEO_PROVIDER_ENABLED=true` | Session tạo với `channel=VIDEO`, không fallback | Chưa thực thi |
| POS.test.03 | Không truyền channel | Body rỗng hoặc không có `channel` | Mặc định dùng `CHAT` theo source code hiện tại | Chưa thực thi |

#### 2.4.8. Kiểm thử Doctor ghi nhận kết quả tư vấn

**Mô tả**

Kiểm thử Doctor ghi nhận kết quả tư vấn bằng cách cập nhật summary cho consultation session. Theo source code hiện tại, `PATCH /consultations/:appointmentId/summary` yêu cầu Doctor phụ trách appointment và `summary` là chuỗi bắt buộc, không được rỗng.

**Tiền điều kiện**

- Doctor đã đăng nhập.
- Appointment thuộc Doctor và đã có consultation session.
- Nội dung summary được chuẩn bị theo yêu cầu nghiệp vụ.

**Bước thực hiện**

1. Doctor mở phiên tư vấn hoặc trang ghi nhận kết quả.
2. Nhập nội dung kết quả tư vấn.
3. Gửi `PATCH /consultations/:appointmentId/summary`.
4. Kiểm tra summary được lưu đúng session.

**Kỹ thuật, công cụ**

Black-box testing, Equivalence Partitioning, Decision Table Testing, API testing. Công cụ dự kiến: Postman hoặc Jest/Supertest; Playwright nếu UI bác sĩ có sẵn.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Doctor ghi summary hợp lệ | `summary="Tình trạng ổn định, tiếp tục theo dõi..."` | Lưu summary thành công cho đúng session | Chưa thực thi |
| NEG.test.01 | Summary rỗng | `summary=""` | Trả lỗi validation, không lưu kết quả rỗng | Chưa thực thi |
| NEG.test.02 | Doctor khác cập nhật summary | Token Doctor B, appointment của Doctor A | Trả `FORBIDDEN`, không cập nhật summary | Chưa thực thi |

#### 2.4.9. Kiểm thử Doctor kết thúc phiên tư vấn và appointment chuyển sang COMPLETED

**Mô tả**

Kiểm thử Doctor kết thúc phiên tư vấn. Theo source code hiện tại, khi gọi `PATCH /consultations/:appointmentId/end`, hệ thống cập nhật consultation session sang `COMPLETED`, ghi `endedAt` và cập nhật appointment sang `COMPLETED`.

**Tiền điều kiện**

- Doctor đã đăng nhập.
- Appointment thuộc Doctor và đã có consultation session.
- Session đang ở trạng thái tư vấn hợp lệ.

**Bước thực hiện**

1. Doctor gọi `PATCH /consultations/:appointmentId/end`.
2. Kiểm tra trạng thái consultation session.
3. Kiểm tra trạng thái appointment tương ứng.
4. Kiểm tra Doctor khác không thể kết thúc session này.

**Kỹ thuật, công cụ**

Black-box testing, Decision Table Testing theo trạng thái session/appointment, API testing, Integration testing nếu xác minh transaction. Công cụ dự kiến: Postman hoặc Jest/Supertest.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Doctor phụ trách kết thúc session | Token Doctor A, appointment của Doctor A có session | Session `COMPLETED`, appointment `COMPLETED`, có `endedAt` | Chưa thực thi |
| NEG.test.01 | Chưa có consultation session | Appointment hợp lệ nhưng chưa start | Trả lỗi session không tồn tại | Chưa thực thi |
| NEG.test.02 | Doctor khác kết thúc session | Token Doctor B, appointment của Doctor A | Trả `FORBIDDEN`, không cập nhật trạng thái | Chưa thực thi |

#### 2.4.10. Kiểm thử Patient xem lại kết quả tư vấn sau khi hoàn tất

**Mô tả**

Kiểm thử Patient xem lại lịch sử và kết quả tư vấn sau khi phiên hoàn tất. Theo API contract và source code hiện tại, Patient dùng `GET /consultations/mine` để xem consultation history, summary và prescription nếu có. Dữ liệu này là dữ liệu sức khỏe nên chỉ Patient chủ sở hữu được xem theo policy.

**Tiền điều kiện**

- Patient đã đăng nhập.
- Appointment thuộc Patient đã hoàn tất.
- Consultation session có summary và có thể có prescription theo dữ liệu kiểm thử.

**Bước thực hiện**

1. Patient gọi `GET /consultations/mine` hoặc mở trang lịch sử tư vấn.
2. Chọn phiên tư vấn đã hoàn tất.
3. Kiểm tra summary/kết quả tư vấn hiển thị.
4. Kiểm tra không hiển thị kết quả tư vấn của Patient khác.

**Kỹ thuật, công cụ**

Black-box testing, Decision Table Testing cho ownership/privacy, API testing. Công cụ dự kiến: Playwright nếu UI có sẵn; Postman hoặc Jest/Supertest cho API.

**Bảng phân hoạch miền giá trị**

| ID | Điều kiện | Test value | Expected | Kết quả |
|---|---|---|---|---|
| POS.test.01 | Patient xem kết quả của chính mình | Token Patient A, consultation thuộc Patient A | Hiển thị kết quả tư vấn/summary đúng dữ liệu | Chưa thực thi |
| POS.test.02 | Phiên hoàn tất có prescription | Consultation có prescription và items | Hiển thị prescription theo phạm vi được phép | Chưa thực thi |
| NEG.test.01 | Response chứa kết quả của Patient khác | Token Patient A, consultation của Patient B | Không hiển thị dữ liệu Patient B | Chưa thực thi |

### 2.5. Checklist rà soát

Checklist rà soát được xây dựng dựa trên SRS_Master_Checklist.md, Test_Strategy_and_Traceability.md, API_Contract_v1.md, Auth_Authorization_Matrix.md và Privacy_and_Data_Handling.md. Mục tiêu của phần này là hỗ trợ nhóm kiểm tra lại mức độ đầy đủ của yêu cầu, thiết kế, API và bảo mật trước khi hoàn thiện báo cáo cuối. Cột "Kết quả" sử dụng các giá trị placeholder `Pass`, `Fail`, `N/A`; khi chưa có biên bản rà soát chính thức hoặc bằng chứng thực thi, báo cáo để ở trạng thái `N/A` hoặc ghi chú cần kiểm tra thêm.

#### 2.5.1. Checklist rà soát yêu cầu

| ID | Nội dung rà soát | Mục tiêu | Kết quả | Ghi chú |
|---|---|---|---|---|
| REQ-01 | Actor của hệ thống được định nghĩa rõ ràng | Bảo đảm Guest User, Patient, Doctor, Administrator và người vận hành hệ thống có vai trò phân biệt | Pass | Đã mô tả trong Chương I và Chương II theo SRS/auth matrix. |
| REQ-02 | Use case có tiền điều kiện và hậu điều kiện | Bảo đảm UC01-UC04 có điều kiện bắt đầu/kết thúc rõ để thiết kế testcase | Pass | Đã bổ sung trong phần phân tích use case. |
| REQ-03 | Luồng chính và luồng phụ rõ ràng | Bảo đảm luồng Guest discovery, booking, Q&A, consultation có thể kiểm thử được | Pass | Cần rà soát lại lần cuối khi chốt báo cáo. |
| REQ-04 | Input/output nghiệp vụ được mô tả rõ | Bảo đảm các trường như `doctorId`, `scheduledAt`, `reason`, `title`, `content`, `summary` có kỳ vọng rõ | Pass | Đã đối chiếu với API contract và source code hiện tại trong các testcase. |
| REQ-05 | Trạng thái nghiệp vụ quan trọng được xác định | Làm rõ appointment status, question status và consultation session status | Pass | Bao gồm `PENDING_CONFIRMATION`, `PENDING`, `ANSWERED`, `ONGOING`, `COMPLETED`. |
| REQ-06 | Appointment duplicate slot được kiểm soát | Bảo đảm không cho bác sĩ/bệnh nhân đặt lịch trùng hoặc chồng lấn | Pass | SRS checklist và source code hiện tại có conflict prevention; cần test evidence ở giai đoạn thực thi. |
| REQ-07 | Question status transition rõ ràng | Bảo đảm câu hỏi chuyển từ `PENDING` sang `ANSWERED` khi Doctor phản hồi | Pass | Đã đưa vào UC03 và testcase 2.3.7. |
| REQ-08 | Error messages rõ ràng cho người dùng | Bảo đảm lỗi validation, unauthorized, forbidden, conflict, not found được phản hồi dễ hiểu | N/A | Cần rà soát UI/API response thực tế khi chạy kiểm thử. |

#### 2.5.2. Checklist rà soát thiết kế

| ID | Nội dung rà soát | Mục tiêu | Kết quả | Ghi chú |
|---|---|---|---|---|
| DES-01 | Thiết kế có phân tách actor và vai trò truy cập | Bảo đảm nghiệp vụ và giao diện không trộn quyền Patient/Doctor/Admin | Pass | Đã dựa trên Auth_Authorization_Matrix.md. |
| DES-02 | Thiết kế kiến trúc có phân lớp rõ | Bảo đảm client, server, database và tích hợp ngoài được trình bày nhất quán | Pass | Đã mô tả ở Chương II - 3.1. |
| DES-03 | Form/UI có input và output rõ | Bảo đảm các màn hình tra cứu, đặt lịch, gửi câu hỏi, tư vấn có dữ liệu vào/ra kiểm thử được | Pass | Ảnh giao diện còn là TODO placeholder, chưa có screenshot thật. |
| DES-04 | Luồng đặt lịch có xử lý duplicate slot | Bảo đảm thiết kế không cho lịch hẹn trùng bác sĩ hoặc bệnh nhân | Pass | Cần xác nhận bằng testcase execution sau. |
| DES-05 | Luồng Q&A có trạng thái và phạm vi xử lý | Bảo đảm Doctor chỉ phản hồi câu hỏi được gán hoặc câu hỏi mở theo rule | Pass | Source code hiện tại có rule từ chối câu hỏi gán cho bác sĩ khác. |
| DES-06 | Consultation session giới hạn đúng Patient/Doctor | Bảo đảm chỉ đúng Patient và Doctor của appointment được join/start/end/view result | Pass | Đã mô tả trong UC04 và testcase 2.4. |
| DES-07 | Fallback chat/video được thể hiện trong thiết kế | Bảo đảm hệ thống có hướng xử lý khi video mock/provider không khả dụng | Pass | Source code hiện tại hỗ trợ fallback `VIDEO` sang `CHAT`. |
| DES-08 | Thiết kế ghi nhận dữ liệu sức khỏe theo nguyên tắc tối thiểu | Hạn chế hiển thị/log dữ liệu nhạy cảm không cần thiết | N/A | Cần rà soát log thực tế và response trong giai đoạn kiểm thử. |

#### 2.5.3. Checklist rà soát API

| ID | Nội dung rà soát | Mục tiêu | Kết quả | Ghi chú |
|---|---|---|---|---|
| API-01 | API public discovery không yêu cầu authentication | Bảo đảm Guest User xem home, chuyên khoa, danh sách/chi tiết bác sĩ công khai | Pass | Theo API contract: `/public/home`, `/public/specialties`, `/public/doctors`. |
| API-02 | Protected API yêu cầu authentication | Bảo đảm booking, questions, appointments, consultations không cho Guest truy cập | Pass | Theo Auth_Authorization_Matrix.md và controllers hiện tại. |
| API-03 | Role-based access được định nghĩa cho API | Bảo đảm endpoint Patient/Doctor/Admin có role phù hợp | Pass | Auth matrix quy định RBAC; source code sử dụng `RolesGuard` ở các controller chính. |
| API-04 | API validate required fields | Bảo đảm `doctorId`, `scheduledAt`, `reason`, `title`, `content`, `summary` không rỗng/sai định dạng | Pass | DTO hiện tại có class-validator; cần test execution để xác nhận runtime. |
| API-05 | Patient không xem dữ liệu của Patient khác | Bảo đảm `/appointments/mine`, `/questions/mine`, `/consultations/mine` chỉ trả dữ liệu chủ sở hữu | Pass | Theo policy và source code hiện tại; cần privacy regression test sau. |
| API-06 | Doctor không truy cập appointment/question trái phạm vi | Bảo đảm Doctor chỉ quản lý lịch và câu hỏi thuộc phạm vi xử lý | Pass | Đã đưa vào testcase UC02, UC03, UC04. |
| API-07 | API trả lỗi nhất quán | Bảo đảm lỗi validation/unauthorized/forbidden/not found/conflict có format rõ | N/A | API_Contract_v1.md có convention; cần kiểm tra response thực tế. |
| API-08 | API consultation hỗ trợ REST và realtime channel | Bảo đảm REST messages và WebSocket `/consultations` có thể kiểm thử tích hợp | Pass | Theo API contract và source gateway hiện tại. |

#### 2.5.4. Checklist rà soát bảo mật

| ID | Nội dung rà soát | Mục tiêu | Kết quả | Ghi chú |
|---|---|---|---|---|
| SEC-01 | Password không được lưu dạng plain text | Bảo đảm mật khẩu được hash trước khi lưu | Pass | Source/doc hiện tại dùng bcryptjs; không ghi secret thật trong báo cáo. |
| SEC-02 | Token/secret không xuất hiện trong response hoặc báo cáo | Tránh lộ JWT secret, refresh token, reset token hoặc cấu hình nhạy cảm | Pass | Báo cáo chỉ liệt kê tên biến env, không ghi secret thật. |
| SEC-03 | Protected API yêu cầu JWT hợp lệ | Ngăn Guest gọi booking, question, consultation, rating, admin APIs | Pass | Theo auth matrix và controllers hiện tại. |
| SEC-04 | RBAC được áp dụng theo vai trò | Bảo đảm Patient, Doctor, Admin không dùng chức năng ngoài quyền | Pass | Dựa trên RolesGuard và role matrix. |
| SEC-05 | Patient không truy cập dữ liệu sức khỏe của Patient khác | Bảo vệ privacy của appointment, question, consultation result, prescription | Pass | Đã đưa vào testcase; cần execution evidence trước khi ghi kết quả test. |
| SEC-06 | Doctor không truy cập appointment/question không được phép | Bảo đảm Doctor chỉ xử lý dữ liệu thuộc phạm vi hoặc câu hỏi mở theo rule | Pass | Đã đưa vào UC02-UC04 và checklist API. |
| SEC-07 | Sensitive health data không bị log thô | Tránh log medical history, consultation summary, prescription content không cần thiết | N/A | Privacy guide có nguyên tắc và sanitizer; cần kiểm tra log thực tế ở final phase. |
| SEC-08 | Audit được áp dụng cho hành động nhạy cảm | Ghi nhận thay đổi appointment, trả lời câu hỏi, cập nhật summary/prescription, admin actions | Pass | SRS checklist và coverage evidence có audit coverage; cần bằng chứng execution nếu báo cáo kết quả. |

### 2.6. Hiện thực các testcases và cách ghi nhận lỗi

Theo Test_Strategy_and_Traceability.md, hoạt động kiểm thử của hệ thống được định hướng theo test pyramid gồm unit test, integration test và API/E2E test theo các use case trong SRS. Trong phạm vi báo cáo cuối, nhóm định hướng minh họa kiểm thử tự động bằng Playwright E2E trên frontend repository `OnlineHealthConsultation-Web`, dựa trên các testcase thủ công đã đặc tả ở mục 2.1 đến 2.4. Vì báo cáo hiện đang được viết từ backend repository, phần này chỉ trình bày kế hoạch hiện thực, cấu trúc, cách chạy và cách ghi nhận bằng chứng; chưa tạo Playwright config, chưa thêm test file và chưa chạy test trong repository backend.

Các hình minh họa kết quả kiểm thử tự động sẽ được bổ sung sau khi nhóm triển khai và chạy bộ kiểm thử Playwright trên frontend repository.

#### 2.6.1. Mục tiêu kiểm thử tự động

Mục tiêu của kiểm thử tự động là chuyển một số testcase quan trọng thành các kịch bản E2E có thể chạy lặp lại trên giao diện người dùng. Bộ kiểm thử dự kiến tập trung vào các thao tác đại diện cho người dùng thật: Guest User tìm kiếm bác sĩ, Patient đặt lịch tư vấn và gửi câu hỏi sức khỏe, Doctor phản hồi câu hỏi, Doctor bắt đầu và hoàn tất phiên tư vấn. Thông qua đó, nhóm có thể kiểm tra sự liên kết giữa frontend, API backend, xác thực/phân quyền, trạng thái nghiệp vụ và thông báo lỗi trên giao diện.

Kiểm thử tự động không thay thế toàn bộ kiểm thử thủ công, mà đóng vai trò minh họa và hồi quy cho các luồng quan trọng trong báo cáo. Những testcase có dữ liệu phức tạp, cần kiểm tra sâu về database hoặc race condition vẫn có thể được bổ sung bằng API/integration test ở giai đoạn sau nếu có điều kiện.

#### 2.6.2. Phạm vi kiểm thử tự động

Phạm vi tự động hóa dự kiến bao gồm bốn use case chính đã được phân tích trong báo cáo:

- UC01: Guest User tra cứu bác sĩ và chuyển đổi sang đăng nhập/đăng ký.
- UC02: Patient đặt lịch hẹn tư vấn.
- UC03: Patient gửi câu hỏi sức khỏe và Doctor phản hồi câu hỏi.
- UC04: Doctor thực hiện phiên tư vấn trực tuyến và hoàn tất appointment.

Các testcase được chọn ưu tiên là các testcase có khả năng thể hiện rõ hành vi giao diện, điều hướng, xác thực, phân quyền và thay đổi trạng thái nghiệp vụ. Các testcase cần dữ liệu backend ổn định như bác sĩ đã được duyệt, tài khoản Patient/Doctor, khung giờ còn trống và dữ liệu appointment/question sẽ được chuẩn bị trước khi chạy Playwright.

#### 2.6.3. Kỹ thuật kiểm thử

Các kỹ thuật kiểm thử dự kiến sử dụng gồm:

- Black-box testing: kiểm tra hành vi hệ thống qua giao diện và kết quả hiển thị, không phụ thuộc vào mã nguồn frontend.
- Equivalence Partitioning: chia dữ liệu kiểm thử thành nhóm hợp lệ và không hợp lệ, ví dụ keyword tìm kiếm, khung giờ đặt lịch, nội dung câu hỏi.
- Boundary Value Analysis: áp dụng cho thời gian đặt lịch, trạng thái slot, độ dài nội dung câu hỏi và thời điểm tham gia tư vấn nếu có điều kiện kiểm thử.
- Decision Table Testing: áp dụng cho tổ hợp trạng thái đăng nhập, vai trò người dùng, quyền truy cập và trạng thái nghiệp vụ.
- End-to-End testing: kiểm tra luồng hoàn chỉnh từ thao tác UI đến phản hồi của hệ thống.
- API testing: chỉ dùng như bằng chứng hỗ trợ nếu frontend cần chuẩn bị dữ liệu hoặc xác nhận trạng thái sau khi thao tác UI.

#### 2.6.4. Công cụ sử dụng

| Công cụ | Trạng thái | Mục đích sử dụng | Ghi chú |
|---|---|---|---|
| Playwright | Dự kiến triển khai ở frontend repository | E2E automation cho các luồng người dùng chính | Công cụ chính của phần minh họa kiểm thử tự động; không sử dụng Cypress cho báo cáo này. |
| Playwright HTML Report | Dự kiến | Lưu bằng chứng kết quả chạy test dưới dạng HTML report | Sẽ bổ sung hình minh họa sau khi chạy test thật. |
| Playwright Trace/Screenshot | Dự kiến | Ghi nhận ảnh màn hình và trace khi test pass/fail | Dùng làm bằng chứng cho các luồng đặt lịch và phản hồi câu hỏi. |
| API backend | Hỗ trợ | Cung cấp dữ liệu và xử lý nghiệp vụ cho frontend E2E | Dùng API thật theo backend hiện có; API testing riêng chỉ là bằng chứng bổ trợ nếu cần. |
| Postman hoặc API script | Dự kiến nếu cần | Chuẩn bị dữ liệu hoặc xác nhận trạng thái sau E2E | Không phải hướng chính của báo cáo. |

#### 2.6.5. Cấu trúc kiểm thử tự động dự kiến trên frontend

Khi triển khai trong frontend repository, nhóm dự kiến tổ chức Playwright theo cấu trúc dễ truy vết với các use case trong báo cáo:

```text
OnlineHealthConsultation-Web/
├── playwright.config.ts
├── tests/
│   ├── e2e/
│   │   ├── uc01-guest-discovery.spec.ts
│   │   ├── uc02-patient-appointment.spec.ts
│   │   ├── uc03-health-question.spec.ts
│   │   └── uc04-consultation-session.spec.ts
│   ├── fixtures/
│   │   └── auth.fixture.ts
│   └── utils/
│       ├── test-data.ts
│       └── api-helper.ts
└── playwright-report/
```

Các test file sẽ ưu tiên mô phỏng thao tác người dùng trên giao diện: nhập từ khóa, click nút đặt lịch, đăng nhập bằng tài khoản Patient/Doctor, nhập form đặt lịch, gửi câu hỏi, phản hồi câu hỏi và hoàn tất phiên tư vấn. Dữ liệu kiểm thử có thể được chuẩn bị bằng seed backend, tài khoản test cố định hoặc API helper, tùy trạng thái môi trường khi triển khai frontend.

<!-- TODO: Insert Figure: Playwright test code for selected testcases -->

Hình 55: Playwright test code for selected testcases

#### 2.6.6. Danh sách testcase dự kiến tự động hóa

| Test ID | Usecase | Nội dung kiểm thử tự động dự kiến | Công cụ | Trạng thái | Ghi chú |
|---|---|---|---|---|---|
| AUTO-UC01-01 | UC01 | Guest User searches doctor by keyword | Playwright E2E | Planned / Evidence Pending | Kiểm tra ô tìm kiếm, danh sách bác sĩ và kết quả hiển thị. |
| AUTO-UC01-02 | UC01 | Guest User is redirected to login when choosing appointment booking | Playwright E2E | Planned / Evidence Pending | Kiểm tra điều hướng đăng nhập/đăng ký khi Guest chọn đặt lịch. |
| AUTO-UC02-01 | UC02 | Patient books appointment with available slot | Playwright E2E | Planned / Evidence Pending | Cần tài khoản Patient, bác sĩ active/approved và slot còn trống. |
| AUTO-UC02-02 | UC02 | Duplicate appointment slot is rejected | Playwright E2E | Planned / Evidence Pending | Có thể cần chuẩn bị dữ liệu slot đã đặt trước khi chạy test. |
| AUTO-UC03-01 | UC03 | Patient submits health question | Playwright E2E | Planned / Evidence Pending | Kiểm tra form gửi câu hỏi và thông báo thành công. |
| AUTO-UC03-02 | UC03 | Doctor replies to health question | Playwright E2E | Planned / Evidence Pending | Cần tài khoản Doctor và câu hỏi đang ở trạng thái chờ phản hồi. |
| AUTO-UC04-01 | UC04 | Doctor starts consultation session | Playwright E2E | Planned / Evidence Pending | Cần appointment hợp lệ trong khung thời gian cho phép. |
| AUTO-UC04-02 | UC04 | Doctor completes consultation and appointment becomes COMPLETED | Playwright E2E | Planned / Evidence Pending | Kiểm tra thao tác kết thúc phiên và trạng thái hoàn tất trên UI/API. |

#### 2.6.7. Cách chạy kiểm thử tự động dự kiến

Khi frontend repository đã có Playwright config và test file, nhóm dự kiến chạy test bằng lệnh:

```bash
npx playwright test
```

Hoặc nếu frontend `package.json` có script riêng:

```bash
npm run test:e2e
```

Để xem báo cáo HTML sau khi chạy:

```bash
npx playwright show-report
```

Trước khi chạy, cần bảo đảm backend API, database và frontend dev server đã hoạt động đúng môi trường. Ví dụ quy trình dự kiến:

```text
1. Khởi động database và backend API.
2. Chuẩn bị dữ liệu test: Patient, Doctor, Specialty, Appointment/Question nếu cần.
3. Khởi động frontend hoặc cấu hình Playwright tự khởi động frontend.
4. Chạy Playwright E2E test.
5. Lưu terminal output, screenshot, trace và HTML report.
```

<!-- TODO: Insert Figure: Playwright test execution result in terminal -->

Hình 56: Playwright test execution result in terminal

<!-- TODO: Insert Figure: Playwright HTML report -->

Hình 57: Playwright HTML report

<!-- TODO: Insert Figure: Screenshot of automated test evidence for appointment booking -->

Hình 58: Screenshot of automated test evidence for appointment booking

<!-- TODO: Insert Figure: Screenshot of automated test evidence for health question reply -->

Hình 59: Screenshot of automated test evidence for health question reply

#### 2.6.8. Cách ghi nhận kết quả kiểm thử

Khi thực thi Playwright, mỗi lần chạy cần ghi nhận tối thiểu các thông tin sau: ngày chạy test, branch/commit nếu có, môi trường chạy, trình duyệt dùng để test, lệnh chạy, số testcase pass/fail/skipped, ảnh terminal output, HTML report, screenshot hoặc trace nếu có. Kết quả chỉ được đưa vào báo cáo khi có bằng chứng kèm theo, chẳng hạn ảnh Playwright terminal, Playwright HTML report hoặc screenshot của test evidence.

Đối với mỗi testcase, nhóm ghi nhận theo trạng thái:

- Pass: kết quả thực tế khớp expected result và có evidence.
- Fail: kết quả thực tế khác expected result, có bug report tương ứng.
- Blocked: chưa thể chạy do thiếu dữ liệu, thiếu môi trường hoặc dependency.
- Not Run: đã đặc tả nhưng chưa thực thi.

Trong báo cáo hiện tại, các testcase tự động hóa đang ở trạng thái `Planned / Evidence Pending`. Nhóm chưa triển khai và chưa chạy Playwright trong backend repository này, do đó không trình bày tỷ lệ pass/fail.

#### 2.6.9. Kết quả kiểm thử dự kiến

Kết quả kiểm thử trong bảng sẽ được cập nhật sau khi nhóm thực hiện chạy kiểm thử thủ công và kiểm thử tự động trên frontend. Tại thời điểm viết báo cáo trong backend repository, nhóm chưa chèn số liệu pass/fail thực tế để tránh ghi nhận kết quả không có minh chứng.

Các chỉ số trong phần này hiện được để ở trạng thái placeholder như `Chưa thực hiện`, `Chờ minh chứng` hoặc `Sẽ cập nhật sau khi chạy Playwright`. Khi có kết quả thực tế, nhóm sẽ cập nhật số lượng testcase đã chạy, số testcase pass/fail/skipped, ảnh chụp terminal, Playwright HTML report và minh chứng UI tương ứng.

#### 2.6.10. Bảng tổng hợp kết quả kiểm thử

| Test Suite | Total Test Cases | Passed | Failed | Skipped | Status | Ghi chú |
|---|---|---|---|---|---|---|
| UC01 - Guest User tra cứu bác sĩ | Chưa thực hiện | Chưa thực hiện | Chưa thực hiện | Chưa thực hiện | Chờ minh chứng | Sẽ cập nhật sau khi chạy kiểm thử thủ công và Playwright trên frontend. |
| UC02 - Patient đặt lịch hẹn tư vấn | Chưa thực hiện | Chưa thực hiện | Chưa thực hiện | Chưa thực hiện | Chờ minh chứng | Cần minh chứng UI flow đặt lịch và trường hợp trùng slot nếu có. |
| UC03 - Doctor phản hồi câu hỏi sức khỏe | Chưa thực hiện | Chưa thực hiện | Chưa thực hiện | Chưa thực hiện | Chờ minh chứng | Cần minh chứng Patient gửi câu hỏi và Doctor phản hồi. |
| UC04 - Doctor thực hiện phiên tư vấn trực tuyến | Chưa thực hiện | Chưa thực hiện | Chưa thực hiện | Chưa thực hiện | Chờ minh chứng | Cần minh chứng start/end consultation và trạng thái hoàn tất. |
| Playwright E2E Automation | Chưa thực hiện | Chưa thực hiện | Chưa thực hiện | Chưa thực hiện | Planned / Evidence Pending | Sẽ cập nhật sau khi chạy Playwright trong frontend repository. |

<!-- TODO: Insert Figure: Tổng hợp kết quả chạy Playwright -->

Hình 60: Tổng hợp kết quả chạy Playwright

<!-- TODO: Insert Figure: Playwright HTML report overview -->

Hình 61: Playwright HTML report overview

#### 2.6.11. Bảng ghi nhận lỗi

| Bug ID | Module | Mô tả lỗi | Steps to Reproduce | Actual Result | Expected Result | Severity | Status |
|---|---|---|---|---|---|---|---|
| BUG-TPL-001 | Discovery | Chưa ghi nhận lỗi thực tế | Sẽ cập nhật nếu phát hiện lỗi khi kiểm thử UC01 | Chưa thực hiện | Chưa thực hiện | N/A | Template |
| BUG-TPL-002 | Appointment | Chưa ghi nhận lỗi thực tế | Sẽ cập nhật nếu phát hiện lỗi khi kiểm thử UC02 | Chưa thực hiện | Chưa thực hiện | N/A | Template |
| BUG-TPL-003 | Question | Chưa ghi nhận lỗi thực tế | Sẽ cập nhật nếu phát hiện lỗi khi kiểm thử UC03 | Chưa thực hiện | Chưa thực hiện | N/A | Template |
| BUG-TPL-004 | Consultation | Chưa ghi nhận lỗi thực tế | Sẽ cập nhật nếu phát hiện lỗi khi kiểm thử UC04 | Chưa thực hiện | Chưa thực hiện | N/A | Template |
| BUG-TPL-005 | Auth/Authorization | Chưa ghi nhận lỗi thực tế | Sẽ cập nhật nếu phát hiện lỗi xác thực/phân quyền | Chưa thực hiện | Chưa thực hiện | N/A | Template |

<!-- TODO: Insert Figure: Bug evidence screenshot if defects are found -->

Hình 62: Bug evidence screenshot if defects are found

#### 2.6.12. Minh chứng kiểm thử cần bổ sung

| STT | Minh chứng cần bổ sung | Trạng thái | Ghi chú |
|---|---|---|---|
| 1 | Screenshot Playwright terminal result | Chờ minh chứng | Bổ sung sau khi chạy Playwright. |
| 2 | Screenshot Playwright HTML report | Chờ minh chứng | Bổ sung tổng quan số test pass/fail/skipped. |
| 3 | Screenshot selected passing test case | Chờ minh chứng | Chỉ bổ sung khi testcase đã chạy và pass thật. |
| 4 | Screenshot failed test case if any | Chờ minh chứng | Chỉ bổ sung nếu có testcase fail thật. |
| 5 | Screenshot bug evidence if any | Chờ minh chứng | Chỉ bổ sung nếu có defect được ghi nhận. |
| 6 | Screenshot UI flow for appointment booking | Chờ minh chứng | Minh chứng cho UC02. |
| 7 | Screenshot UI flow for health question/reply | Chờ minh chứng | Minh chứng cho UC03. |

#### 2.6.13. Cách ghi nhận lỗi

Khi phát hiện lỗi, nhóm ghi nhận theo một bug report thống nhất để dễ truy vết về use case, testcase và module. Một lỗi cần có mô tả ngắn gọn, actual result, expected result, mức độ nghiêm trọng và trạng thái xử lý. Severity được đề xuất gồm Critical, High, Medium, Low. Status được đề xuất gồm Open, In Progress, Fixed, Retest, Closed hoặc Won't Fix.

| Bug ID | Module | Mô tả lỗi | Actual Result | Expected Result | Severity | Status |
|---|---|---|---|---|---|---|
| BUG-001 | Discovery | Chưa ghi nhận lỗi thực tế | N/A | N/A | N/A | Not Reported |
| BUG-002 | Appointment | Chưa ghi nhận lỗi thực tế | N/A | N/A | N/A | Not Reported |
| BUG-003 | Question | Chưa ghi nhận lỗi thực tế | N/A | N/A | N/A | Not Reported |
| BUG-004 | Consultation | Chưa ghi nhận lỗi thực tế | N/A | N/A | N/A | Not Reported |
| BUG-005 | Auth/Authorization | Chưa ghi nhận lỗi thực tế | N/A | N/A | N/A | Not Reported |
| BUG-006 | Privacy/Logging | Chưa ghi nhận lỗi thực tế | N/A | N/A | N/A | Not Reported |

Các dòng trên là placeholder để chuẩn hóa cách ghi nhận lỗi, không phải danh sách lỗi đã phát hiện. Khi có lỗi thật, nhóm cần thay thế placeholder bằng thông tin thực tế và liên kết Bug ID với Test ID tương ứng.

# CHƯƠNG IV. KẾT LUẬN

## 1. Nhận xét về điểm mạnh, điểm yếu trong cách tiến hành đồ án

Đề tài "Xây dựng và kiểm thử nền tảng tư vấn sức khỏe trực tuyến" được thực hiện theo định hướng kết hợp giữa phân tích, thiết kế hệ thống và đảm bảo chất lượng phần mềm. Báo cáo tập trung vào bốn use case chính được lựa chọn từ SRS, gồm Guest User tra cứu bác sĩ và chuyển đổi sang đăng ký/đăng nhập, Patient đặt lịch hẹn tư vấn, Doctor phản hồi câu hỏi sức khỏe và Doctor thực hiện phiên tư vấn trực tuyến. Đây là các luồng nghiệp vụ đại diện cho quá trình người dùng tiếp cận hệ thống, tương tác với bác sĩ, đặt lịch và thực hiện tư vấn trong phạm vi MVP.

Trong quá trình thực hiện, nhóm đã sử dụng SRS và các tài liệu hỗ trợ như requirement baseline, API contract, architecture overview, database design, authorization matrix, privacy guide và test strategy để xây dựng nội dung báo cáo. Cách tiếp cận này giúp báo cáo không chỉ mô tả chức năng phần mềm mà còn thể hiện được mối liên hệ giữa yêu cầu, thiết kế, kiểm thử và bằng chứng chất lượng. Tuy nhiên, do báo cáo hiện đang được hoàn thiện từ backend repository, một số minh chứng liên quan đến giao diện frontend, hình ảnh sơ đồ và kết quả Playwright E2E vẫn cần được bổ sung trong giai đoạn hoàn thiện cuối.

### 1.1. Điểm mạnh

Trước hết, báo cáo bám theo tài liệu SRS và các tài liệu trong hệ thống tài liệu dự án. Các nội dung chính như actor, phạm vi MVP, luồng nghiệp vụ, yêu cầu chức năng, yêu cầu phi chức năng, phân quyền, bảo mật dữ liệu sức khỏe, API và cơ sở dữ liệu đều được trình bày dựa trên nguồn tài liệu có sẵn. Điều này giúp hạn chế việc mô tả cảm tính và tạo cơ sở cho hoạt động kiểm thử có thể truy vết.

Thứ hai, báo cáo đã xác định rõ các actor và business flow chính của nền tảng tư vấn sức khỏe trực tuyến. Các actor như Guest User, Patient, Doctor và Administrator được phân biệt theo quyền và phạm vi thao tác. Từ đó, nhóm lựa chọn bốn use case trọng tâm để phân tích sâu, phù hợp với mục tiêu kiểm thử trong báo cáo.

Thứ ba, đối với từng use case, báo cáo đã mô tả mục tiêu, actor, tiền điều kiện, luồng sự kiện chính, luồng phụ và hậu điều kiện. Cách đặc tả này giúp các luồng nghiệp vụ trở nên rõ ràng, có khả năng kiểm thử và thuận lợi cho việc thiết kế testcase. Các tình huống như Guest User bị chuyển hướng đăng nhập, Patient đặt lịch hẹn, Doctor trả lời câu hỏi và Doctor thực hiện phiên tư vấn đều được trình bày theo hướng có thể xác định expected result.

Thứ tư, báo cáo đã định nghĩa các yêu cầu chất lượng phần mềm theo ba nhóm môi trường: môi trường nghiệp vụ, môi trường vận hành và môi trường phát triển. Các nội dung như bảo mật, quyền riêng tư dữ liệu sức khỏe, phân quyền, kiểm tra dữ liệu nhập, xử lý lỗi, hiệu năng ở mức MVP, tính khả dụng, modular design, logging và khả năng kiểm thử được xem xét như những tiêu chí quan trọng chứ không chỉ là phần bổ sung.

Thứ năm, nhóm đã xây dựng checklist rà soát yêu cầu, thiết kế, API và bảo mật. Checklist này hỗ trợ việc kiểm tra lại tính đầy đủ của báo cáo, đặc biệt là các nội dung như actor, precondition/postcondition, input/output, RBAC, API validation, protected API, ownership của Patient/Doctor, bảo vệ mật khẩu và hạn chế log dữ liệu nhạy cảm.

Thứ sáu, báo cáo đã đặc tả testcase theo từng use case, bao gồm cả positive test và negative test. Các testcase được trình bày theo mô tả, tiền điều kiện, bước thực hiện, kỹ thuật/công cụ và bảng phân hoạch miền giá trị. Điều này giúp hoạt động kiểm thử có cấu trúc hơn, đồng thời tạo nền tảng để triển khai kiểm thử tự động sau này.

Cuối cùng, báo cáo đã xây dựng định hướng minh họa kiểm thử tự động bằng Playwright cho frontend. Phần này chưa ghi nhận kết quả thực thi, nhưng đã xác định rõ phạm vi tự động hóa, công cụ, cấu trúc test dự kiến, danh sách testcase ưu tiên, cách chạy, cách ghi nhận kết quả và cách ghi nhận lỗi. Đây là cơ sở để nhóm tiếp tục triển khai ở frontend repository trong giai đoạn sau.

### 1.2. Điểm yếu

Bên cạnh các điểm mạnh, báo cáo vẫn còn một số hạn chế cần được hoàn thiện. Trước hết, báo cáo chưa chèn đầy đủ hình ảnh giao diện UI, use case diagram, activity diagram, ERD và screenshot kết quả kiểm thử. Nhiều vị trí hiện vẫn đang được giữ dưới dạng TODO placeholder, vì nhóm chưa có đủ ảnh chụp giao diện và sơ đồ cuối cùng để đưa vào báo cáo.

Thứ hai, báo cáo chưa cập nhật kết quả pass/fail thực tế cho Playwright automation. Lý do là phần kiểm thử tự động sẽ được triển khai và chạy ở frontend repository, trong khi báo cáo hiện đang được viết từ backend repository. Vì vậy, các bảng kết quả kiểm thử tự động hiện chỉ ở trạng thái `Chưa thực hiện`, `Chờ minh chứng` hoặc `Planned / Evidence Pending`, nhằm tránh ghi nhận kết quả không có bằng chứng.

Thứ ba, phạm vi testcase hiện tập trung vào bốn use case trọng tâm. Một số chức năng mở rộng như profile management, prescription, rating, notification và admin dashboard đã được nhắc đến trong phạm vi hệ thống nhưng chưa được kiểm thử sâu trong phần testcase chính của báo cáo. Các chức năng này cần được bổ sung testcase nếu muốn đánh giá đầy đủ hơn toàn bộ hệ thống.

Thứ tư, performance testing và security testing hiện mới dừng ở mức tiêu chí, định hướng và checklist rà soát. Báo cáo chưa có bằng chứng kiểm thử hiệu năng bằng công cụ chuyên dụng, chưa có số liệu benchmark và chưa có kết quả kiểm thử bảo mật chuyên sâu theo OWASP API Security Top 10. Do đó, phần đánh giá chất lượng phi chức năng vẫn cần được bổ sung nếu thời gian và môi trường cho phép.

Thứ năm, video consultation trong phạm vi MVP có thể mới ở mức mock hoặc simulated nếu chưa tích hợp video provider thật. Vì vậy, các kiểm thử liên quan đến video cần được hiểu theo phạm vi MVP và cần được cập nhật lại nếu hệ thống tích hợp dịch vụ video thật trong giai đoạn sau.

## 2. Khả năng cải tiến cách tiến hành đồ án

Để hoàn thiện báo cáo và nâng cao chất lượng đồ án, nhóm cần tiếp tục bổ sung hình ảnh diagram và screenshot UI vào các vị trí TODO. Các hình như wireframe, use case diagram, activity diagram, kiến trúc hệ thống, ERD, giao diện chính và minh chứng kiểm thử sẽ giúp báo cáo trực quan hơn, đồng thời tăng tính thuyết phục khi trình bày kết quả.

Về kiểm thử tự động, nhóm cần triển khai Playwright E2E test trong frontend repository dựa trên các testcase đã đặc tả. Các luồng nên được ưu tiên gồm Guest User tìm kiếm bác sĩ, Guest User bị chuyển hướng đăng nhập khi đặt lịch, Patient đặt lịch hẹn, Patient gửi câu hỏi, Doctor phản hồi câu hỏi, Doctor bắt đầu phiên tư vấn và Doctor hoàn tất phiên tư vấn. Sau khi chạy Playwright, nhóm cần cập nhật bảng kết quả kiểm thử, số lượng testcase pass/fail/skipped, Playwright HTML report, ảnh terminal và các screenshot minh chứng vào báo cáo cuối kỳ.

Ngoài bốn use case trọng tâm, nhóm có thể mở rộng testcase cho profile management, prescriptions, ratings, notifications và admin dashboard. Đây là các chức năng quan trọng để đánh giá đầy đủ hơn vai trò Patient, Doctor và Administrator, đồng thời giúp kiểm tra các luồng quản trị và lịch sử tư vấn sau khi phiên tư vấn hoàn tất.

Về kiểm thử phi chức năng, nếu có thời gian, nhóm nên bổ sung kiểm thử hiệu năng bằng k6 hoặc JMeter cho các endpoint quan trọng như public doctor discovery, login, booking appointment, question answering và consultation history. Kết quả hiệu năng nên được trình bày bằng số liệu cụ thể như response time trung bình, p95, throughput và error rate trong điều kiện kiểm thử xác định.

Về bảo mật, nhóm nên bổ sung kiểm thử theo OWASP API Security Top 10, đặc biệt là các nhóm lỗi liên quan đến broken object level authorization, broken authentication, excessive data exposure, mass assignment, security misconfiguration và improper assets management. Các testcase bảo mật cần tập trung vào quyền sở hữu dữ liệu Patient/Doctor, dữ liệu sức khỏe, token, password, audit log và thông báo lỗi.

Về quy trình phát triển, nhóm có thể tích hợp CI/CD để chạy test tự động khi có thay đổi mã nguồn. Pipeline nên bao gồm kiểm tra định dạng, type-check, build, unit/integration test, Playwright E2E test và lưu report artifact. Nếu phù hợp, nhóm có thể bổ sung báo cáo test dạng HTML hoặc Allure để kết quả kiểm thử dễ theo dõi, dễ chèn vào báo cáo và dễ đối chiếu trong quá trình nghiệm thu.

Tóm lại, báo cáo hiện đã hình thành được nền tảng phân tích, thiết kế và đặc tả kiểm thử cho nền tảng tư vấn sức khỏe trực tuyến. Tuy nhiên, để đạt mức hoàn thiện cao hơn cho báo cáo cuối kỳ, nhóm cần tiếp tục bổ sung minh chứng trực quan, kết quả kiểm thử thực tế và các kiểm thử tự động/phi chức năng có bằng chứng rõ ràng.

# TÀI LIỆU THAM KHẢO

<!-- TODO: Chuẩn hóa danh mục tài liệu tham khảo ở phiên bản cuối. -->
