# BÁO CÁO TỐT NGHIỆP

## Đề tài

**Thiết kế và xây dựng hệ thống hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến**

## Danh mục từ viết tắt

| Từ viết tắt | Diễn giải |
|---|---|
| API | Application Programming Interface - giao diện lập trình ứng dụng |
| CI | Continuous Integration - tích hợp liên tục |
| DTO | Data Transfer Object - đối tượng truyền dữ liệu |
| E2E | End-to-End - kiểm thử đầu cuối |
| ERD | Entity Relationship Diagram - sơ đồ quan hệ thực thể |
| JWT | JSON Web Token - cơ chế token xác thực |
| ORM | Object Relational Mapping - ánh xạ đối tượng - quan hệ |
| RBAC | Role-Based Access Control - kiểm soát truy cập theo vai trò |
| REST | Representational State Transfer - phong cách thiết kế API HTTP |
| SRS | Software Requirements Specification - đặc tả yêu cầu phần mềm |
| SPA | Single Page Application - ứng dụng web một trang |
| UI | User Interface - giao diện người dùng |

## Danh mục hình

| Số hình | Tên hình | Vị trí |
|---|---|---|
| Hình 3.1 | Biểu đồ Use Case của khách truy cập | Mục 3.6.1 |
| Hình 3.2 | Biểu đồ Use Case của bệnh nhân | Mục 3.6.2 |
| Hình 3.3 | Biểu đồ Use Case của bác sĩ | Mục 3.6.3 |
| Hình 3.4 | Biểu đồ Use Case của quản trị viên | Mục 3.6.4 |
| Hình 3.5 | Luồng hoạt động tổng quát của hệ thống | Mục 3.7 |
| Hình 4.1 | Kiến trúc tổng thể của hệ thống | Mục 4.1 |
| Hình 4.2 | Sơ đồ quan hệ thực thể của hệ thống | Mục 4.5 |
| Hình 4.3 | Sơ đồ lớp các thành phần backend chính | Mục 4.6 |
| Hình 4.4 | Biểu đồ tuần tự đăng nhập người dùng | Mục 4.7 |
| Hình 4.5 | Biểu đồ tuần tự đặt lịch tư vấn | Mục 4.8 |
| Hình 4.6 | Biểu đồ tuần tự chat realtime trong phiên tư vấn | Mục 4.9 |
| Hình 4.7 | Biểu đồ tuần tự tạo đơn thuốc sau tư vấn | Mục 4.9 |
| Hình 4.8 | Biểu đồ tuần tự xử lý thông báo bất đồng bộ qua outbox | Mục 4.10 |
| Hình 4.9 | Biểu đồ tuần tự kiểm duyệt câu hỏi và phản hồi | Mục 4.11 |
| Hình 5.1 | Giao diện tra cứu chuyên khoa và bác sĩ | Mục 5.2 |
| Hình 5.2 | Giao diện đặt lịch hẹn trực tuyến | Mục 5.6 |
| Hình 5.3 | Giao diện tư vấn trực tuyến và trao đổi tin nhắn | Mục 5.7 |
| Hình 5.4 | Giao diện quản trị hệ thống | Mục 5.11 |

## Danh mục bảng

| Số bảng | Tên bảng | Vị trí |
|---|---|---|
| Bảng 1.1 | Các tác nhân chính của hệ thống | Mục 1.4 |
| Bảng 1.2 | Các nhóm chức năng chính của hệ thống | Mục 1.6 |
| Bảng 2.1 | Công nghệ chính sử dụng trong hệ thống | Mục 2.17 |
| Bảng 3.1 | Tác nhân và vai trò trong hệ thống | Mục 3.2 |
| Bảng 3.2 | Tóm tắt yêu cầu chức năng theo nhóm | Mục 3.3 |
| Bảng 4.1 | Vai trò thiết kế của các module backend | Mục 4.2 |
| Bảng 4.2 | Nhóm dữ liệu chính của hệ thống | Mục 4.5 |
| Bảng 5.1 | Tóm tắt phân hệ triển khai | Mục 5.13 |
| Bảng 6.1 | Bộ test case tiêu biểu | Mục 6.5 |
| Bảng 6.2 | Kết quả kiểm thử tổng hợp | Mục 6.11 |
| Bảng 6.3 | Mức độ bao phủ yêu cầu SRS | Mục 6.12 |
| Bảng 7.1 | Mức độ đáp ứng mục tiêu đề tài | Mục 7.2 |

# CHƯƠNG 1. TỔNG QUAN ĐỀ TÀI

## 1.1. Bối cảnh và lý do chọn đề tài

Trong những năm gần đây, nhu cầu tiếp cận thông tin chăm sóc sức khỏe và đặt lịch tư vấn y tế trực tuyến ngày càng tăng. Người dùng có xu hướng tìm kiếm thông tin bác sĩ, chuyên khoa, thời gian tư vấn phù hợp và mong muốn nhận được phản hồi chuyên môn nhanh chóng hơn thông qua các nền tảng trực tuyến. Bên cạnh đó, việc quản lý lịch hẹn, theo dõi lịch sử tư vấn và nhắc lịch cũng là những nhu cầu thiết thực đối với cả người bệnh và nhân viên y tế.

Trong thực tế, quy trình tìm kiếm bác sĩ, đặt lịch tư vấn và trao đổi thông tin sức khỏe nếu thực hiện rời rạc có thể gây mất thời gian, khó theo dõi và thiếu tính tập trung. Bệnh nhân có thể gặp khó khăn trong việc biết bác sĩ nào phù hợp với chuyên khoa cần tư vấn, thời gian nào còn trống, hoặc lịch sử tư vấn trước đó được lưu ở đâu. Về phía bác sĩ và người quản trị, việc tiếp nhận câu hỏi, quản lý lịch hẹn, theo dõi trạng thái tư vấn và kiểm duyệt nội dung cũng cần một công cụ hỗ trợ có tổ chức.

Xuất phát từ bối cảnh trên, đề tài **“Thiết kế và xây dựng hệ thống hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến”** được lựa chọn nhằm xây dựng một hệ thống web hỗ trợ người dùng tra cứu bác sĩ, đặt lịch tư vấn, gửi câu hỏi sức khỏe, tham gia tư vấn trực tuyến và theo dõi kết quả tư vấn. Hệ thống được định hướng là công cụ hỗ trợ tư vấn và quản lý lịch hẹn, không thay thế cho chẩn đoán y khoa chuyên nghiệp, cấp cứu y tế hoặc việc khám trực tiếp khi cần thiết.

## 1.2. Bài toán cần giải quyết

Bài toán đặt ra là xây dựng một hệ thống trực tuyến có khả năng kết nối các nhóm người dùng chính gồm khách truy cập, bệnh nhân, bác sĩ và quản trị viên trong cùng một quy trình tư vấn sức khỏe. Hệ thống cần hỗ trợ người dùng chưa đăng nhập xem thông tin công khai, tìm kiếm bác sĩ và chuyên khoa; đồng thời cho phép bệnh nhân sau khi đăng nhập có thể quản lý hồ sơ sức khỏe, gửi câu hỏi, đặt lịch hẹn và tham gia phiên tư vấn.

Đối với bác sĩ, hệ thống cần cung cấp công cụ quản lý hồ sơ chuyên môn, lịch làm việc, danh sách câu hỏi và lịch hẹn, cũng như ghi nhận kết quả tư vấn và đơn thuốc điện tử cơ bản. Đối với quản trị viên, hệ thống cần hỗ trợ quản lý người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, nội dung tư vấn và thống kê hoạt động.

Ngoài các luồng nghiệp vụ chính, hệ thống còn cần đảm bảo phân quyền theo vai trò, bảo vệ dữ liệu cá nhân và dữ liệu sức khỏe, hỗ trợ giao diện phù hợp trên nhiều kích thước màn hình, đồng thời có cơ chế thông báo hoặc nhắc lịch cho các sự kiện quan trọng trong quá trình tư vấn.

## 1.3. Mục tiêu đề tài

Mục tiêu tổng quát của đề tài là phân tích, thiết kế và xây dựng một hệ thống web hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến, đáp ứng các nghiệp vụ cốt lõi trong phạm vi đã xác định.

Các mục tiêu cụ thể bao gồm:

- Xây dựng khu vực công khai để người dùng xem thông tin nền tảng, danh sách chuyên khoa, danh sách bác sĩ và hồ sơ công khai của bác sĩ.
- Hỗ trợ đăng ký, đăng nhập, đăng xuất và phân quyền theo bốn vai trò: Khách truy cập, Bệnh nhân, Bác sĩ và Quản trị viên.
- Cho phép bệnh nhân quản lý hồ sơ sức khỏe cá nhân, tìm kiếm bác sĩ, gửi câu hỏi sức khỏe, đặt lịch tư vấn và theo dõi lịch sử tư vấn.
- Cho phép bác sĩ quản lý hồ sơ chuyên môn, lịch làm việc, trả lời câu hỏi, xử lý lịch hẹn, tham gia tư vấn trực tuyến và ghi nhận kết quả tư vấn.
- Hỗ trợ phiên tư vấn trực tuyến qua chat và cơ chế video ở mức mô phỏng hoặc tích hợp cơ bản theo phạm vi đề tài.
- Hỗ trợ ghi nhận tóm tắt tư vấn, đơn thuốc điện tử cơ bản và đánh giá chất lượng tư vấn.
- Cung cấp chức năng quản trị người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, kiểm duyệt nội dung và thống kê hoạt động hệ thống.
- Đảm bảo các yêu cầu cơ bản về bảo mật, phân quyền, kiểm soát truy cập và tính dễ sử dụng của giao diện.

## 1.4. Đối tượng sử dụng

Hệ thống hướng đến bốn nhóm người dùng chính:

- **Khách truy cập:** Người dùng chưa đăng nhập vào hệ thống, có quyền xem trang chủ, danh sách chuyên khoa, danh sách bác sĩ và hồ sơ công khai của bác sĩ. Khi thực hiện các thao tác cần định danh như đặt lịch tư vấn hoặc gửi câu hỏi sức khỏe, hệ thống sẽ điều hướng người dùng đến luồng đăng nhập hoặc đăng ký tài khoản.
- **Bệnh nhân:** Người dùng đã đăng ký tài khoản cá nhân, có quyền quản lý hồ sơ sức khỏe, gửi câu hỏi y tế, đặt lịch tư vấn, tham gia phiên tư vấn, xem phản hồi chuyên môn, theo dõi lịch sử tư vấn, xem đơn thuốc điện tử và đánh giá chất lượng tư vấn.
- **Bác sĩ:** Người dùng thuộc nhóm chuyên môn y tế, có quyền quản lý hồ sơ bác sĩ, cấu hình lịch làm việc, tiếp nhận và giải đáp câu hỏi, quản lý danh sách lịch hẹn, tham gia phiên tư vấn trực tuyến và ghi nhận kết quả tư vấn.
- **Quản trị viên:** Người dùng chịu trách nhiệm vận hành hệ thống, có quyền quản lý tài khoản người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, thực hiện kiểm duyệt nội dung và theo dõi các báo cáo thống kê hoạt động.


Bảng 1.1. Các tác nhân chính của hệ thống

| Đối tượng | Mô tả |
|---|---|
| Khách truy cập | Xem trang chủ, chuyên khoa, danh sách bác sĩ và hồ sơ công khai của bác sĩ. |
| Bệnh nhân | Quản lý hồ sơ, gửi câu hỏi, đặt lịch, tham gia tư vấn, xem kết quả và đánh giá. |
| Bác sĩ | Quản lý hồ sơ chuyên môn, lịch làm việc, câu hỏi, lịch hẹn và kết quả tư vấn. |
| Quản trị viên | Quản lý tài khoản, chuyên khoa, lịch hẹn, nội dung kiểm duyệt và báo cáo. |

Ngoài ra, hệ thống có thể liên quan đến một số ranh giới tích hợp bên ngoài như dịch vụ thông báo, dịch vụ hỗ trợ video hoặc dịch vụ lưu trữ tệp. Trong phạm vi đề tài đã xác định, các nội dung này được xem xét theo mức độ cần thiết của hệ thống; những phần phụ thuộc nhà cung cấp bên ngoài hoặc chưa thuộc phạm vi triển khai chính được trình bày như giới hạn hoặc hướng mở rộng, không thay thế các nghiệp vụ tư vấn và quản lý lịch hẹn cốt lõi.

## 1.5. Phạm vi đề tài

Phạm vi đề tài tập trung vào việc xây dựng một ứng dụng web phục vụ các nghiệp vụ tư vấn sức khỏe trực tuyến và quản lý lịch hẹn. Các chức năng bắt buộc trong phạm vi bao gồm truy cập nội dung công khai, quản lý tài khoản và phân quyền, quản lý hồ sơ bệnh nhân và bác sĩ, quản lý chuyên khoa, tìm kiếm bác sĩ, gửi câu hỏi sức khỏe, đặt lịch tư vấn, quản lý lịch hẹn, tư vấn trực tuyến qua chat, ghi nhận kết quả tư vấn, đơn thuốc điện tử cơ bản, đánh giá tư vấn, quản trị hệ thống, kiểm duyệt nội dung, thống kê hoạt động và thông báo nhắc lịch.

Một số chức năng được xác định là hướng mở rộng hoặc phụ thuộc điều kiện tích hợp hạ tầng, chẳng hạn như cuộc gọi tư vấn truyền hình (video), gửi thông báo nhắc lịch qua tin nhắn SMS, trợ lý tương tác tự động, hỗ trợ đa ngôn ngữ, chế độ giao diện tối (Dark Mode), cũng như các biểu đồ và bộ lọc phân tích nâng cao. Các chức năng này không làm thay đổi mục tiêu cốt lõi của hệ thống là hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến.

Đề tài không bao gồm việc chẩn đoán y khoa tự động bằng trí tuệ nhân tạo trong môi trường thực tế, không kết nối với hệ thống bệnh viện hoặc hồ sơ bệnh án điện tử bên ngoài, không tích hợp thiết bị IoT hay thiết bị đeo theo dõi sức khỏe, không xử lý thanh toán bảo hiểm y tế hoặc quản lý giao nhận thuốc, không phát triển ứng dụng di động độc lập (native app), đồng thời không bao gồm các quy trình khám chữa bệnh từ xa nâng cao như xác nhận đồng ý điện tử (e-consent), chuyển tuyến chuyên khoa hay phân loại bệnh nhân tự động.

## 1.6. Các chức năng chính

Các chức năng chính của hệ thống được phân nhóm như sau:

- **Chức năng công khai:** Xem trang chủ, xem danh sách chuyên khoa, tìm kiếm bác sĩ, xem hồ sơ công khai của bác sĩ và chuyển sang đăng nhập hoặc đăng ký khi thực hiện hành động yêu cầu xác thực.
- **Chức năng xác thực và phân quyền:** Đăng ký, đăng nhập, đăng xuất, khôi phục mật khẩu và giới hạn quyền truy cập theo vai trò người dùng.
- **Chức năng dành cho bệnh nhân:** Cập nhật hồ sơ sức khỏe, tìm kiếm bác sĩ, gửi câu hỏi sức khỏe, đặt lịch tư vấn, xem lịch hẹn, tham gia tư vấn, xem phản hồi, xem lịch sử tư vấn, xem tóm tắt tư vấn và đơn thuốc, đánh giá chất lượng tư vấn.
- **Chức năng dành cho bác sĩ:** Quản lý hồ sơ chuyên môn, quản lý lịch làm việc, xem và trả lời câu hỏi, xem và xử lý lịch hẹn, tham gia phiên tư vấn, ghi nhận kết quả tư vấn và tạo đơn thuốc điện tử cơ bản.
- **Chức năng dành cho quản trị viên:** Quản lý tài khoản, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, kiểm duyệt nội dung tư vấn và phản hồi, theo dõi dashboard và thống kê hoạt động.
- **Chức năng hỗ trợ:** Gửi thông báo, nhắc lịch hẹn, lưu lịch sử thông báo và hỗ trợ giao diện responsive cho desktop, tablet và mobile.


Bảng 1.2. Các nhóm chức năng chính của hệ thống

| Nhóm chức năng | Nội dung chính |
|---|---|
| Công khai | Trang chủ, chuyên khoa, danh sách bác sĩ, chi tiết bác sĩ. |
| Xác thực và phân quyền | Đăng ký, đăng nhập, đăng xuất, khôi phục mật khẩu, RBAC. |
| Bệnh nhân | Hồ sơ sức khỏe, câu hỏi, đặt lịch, tư vấn, kết quả, đơn thuốc, đánh giá. |
| Bác sĩ | Hồ sơ chuyên môn, lịch làm việc, câu hỏi, lịch hẹn, tư vấn, đơn thuốc. |
| Quản trị | Người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, kiểm duyệt, báo cáo. |
| Hỗ trợ | Thông báo, nhắc lịch, audit log, giao diện responsive. |

## 1.7. Phương pháp thực hiện

Đề tài được thực hiện theo hướng phân tích yêu cầu, thiết kế hệ thống, xây dựng ứng dụng và kiểm thử đánh giá.

Trước hết, yêu cầu hệ thống được xác định dựa trên tài liệu đặc tả yêu cầu phần mềm, trong đó làm rõ mục tiêu, phạm vi, tác nhân, ca sử dụng, luồng nghiệp vụ và các yêu cầu chức năng, phi chức năng. Trên cơ sở đó, hệ thống được thiết kế theo hướng ứng dụng web có phân quyền, có các nhóm chức năng cho bệnh nhân, bác sĩ và quản trị viên, đồng thời có cơ chế hỗ trợ tư vấn trực tuyến và quản lý lịch hẹn.

Sau giai đoạn phân tích và thiết kế, hệ thống được xây dựng thành ứng dụng web với giao diện người dùng, xử lý nghiệp vụ phía máy chủ, lưu trữ dữ liệu và các chức năng hỗ trợ như thông báo, kiểm duyệt và thống kê. Việc kiểm thử được thực hiện nhằm xác minh các luồng chính như truy cập công khai, đăng nhập, đặt lịch, hỏi đáp sức khỏe, tư vấn, quản trị và các kiểm soát truy cập theo vai trò.

## 1.8. Kết cấu báo cáo

Báo cáo được trình bày thành bảy chương:

- **Chương 1. Tổng quan đề tài:** Trình bày bối cảnh, lý do chọn đề tài, bài toán cần giải quyết, mục tiêu, đối tượng sử dụng, phạm vi, chức năng chính, phương pháp thực hiện và kết cấu báo cáo.
- **Chương 2. Cơ sở lý thuyết và công nghệ:** Trình bày các khái niệm và công nghệ nền tảng được sử dụng trong quá trình xây dựng hệ thống.
- **Chương 3. Phân tích yêu cầu hệ thống:** Phân tích tác nhân, ca sử dụng, yêu cầu chức năng, yêu cầu phi chức năng và luồng nghiệp vụ tổng thể của hệ thống.
- **Chương 4. Thiết kế hệ thống:** Trình bày thiết kế kiến trúc, thiết kế dữ liệu, phân quyền, các phân hệ chính và các luồng xử lý đại diện.
- **Chương 5. Xây dựng và triển khai hệ thống:** Mô tả quá trình xây dựng các chức năng, tổ chức dự án, môi trường vận hành và kết quả triển khai.
- **Chương 6. Kiểm thử và đánh giá:** Trình bày phạm vi kiểm thử, môi trường kiểm thử, kết quả kiểm thử và đánh giá mức độ đáp ứng yêu cầu.
- **Chương 7. Kết luận và hướng phát triển:** Tổng kết kết quả đạt được, nêu các hạn chế còn tồn tại và đề xuất hướng phát triển trong tương lai.

# CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ

Chương này trình bày các khái niệm và công nghệ có liên quan trực tiếp đến hệ thống hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến. Nội dung tập trung vào vai trò của từng công nghệ trong hệ thống đã xây dựng, không trình bày các công nghệ nằm ngoài phạm vi triển khai thực tế.

## 2.1. Kiến trúc ứng dụng web Client–Server

Kiến trúc Client–Server là mô hình trong đó phía người dùng sử dụng một ứng dụng client để gửi yêu cầu, còn phía server chịu trách nhiệm xử lý nghiệp vụ, truy xuất dữ liệu và trả kết quả. Với ứng dụng web, client thường chạy trên trình duyệt, còn server cung cấp API và giao tiếp với cơ sở dữ liệu.

Trong hệ thống này, client là ứng dụng web React, phục vụ các nhóm người dùng như khách truy cập, bệnh nhân, bác sĩ và quản trị viên. Server là ứng dụng backend xử lý xác thực, phân quyền, đặt lịch, tư vấn, hỏi đáp sức khỏe, thông báo, kiểm duyệt và thống kê. Dữ liệu được lưu trữ tập trung trong cơ sở dữ liệu quan hệ PostgreSQL.

Mô hình Client–Server phân tách rõ ràng trách nhiệm giữa việc hiển thị giao diện trên trình duyệt và việc xử lý nghiệp vụ, lưu trữ dữ liệu y tế tập trung tại máy chủ, tạo điều kiện thuận lợi cho việc kiểm soát phân quyền và bảo vệ an toàn dữ liệu.

## 2.2. REST API

REST API là cách thiết kế giao diện giao tiếp giữa client và server dựa trên các tài nguyên và phương thức HTTP. Client gửi yêu cầu như xem dữ liệu, tạo mới, cập nhật hoặc hủy thông tin; server xử lý và trả về dữ liệu theo định dạng phù hợp.

Trong hệ thống, REST API được sử dụng cho phần lớn các chức năng như đăng ký, đăng nhập, xem danh sách bác sĩ, đặt lịch hẹn, quản lý hồ sơ, gửi câu hỏi, xem lịch sử tư vấn, quản trị người dùng, quản lý chuyên khoa và xem báo cáo thống kê. Các yêu cầu từ giao diện web được gửi tới backend qua HTTP, sau đó backend xử lý nghiệp vụ và trả kết quả cho client.

Kiến trúc REST API đáp ứng tốt yêu cầu của đề tài nhờ tính rõ ràng trong mô hình yêu cầu - phản hồi, dễ dàng chuẩn hóa giao thức dữ liệu dạng JSON, thuận lợi cho việc kiểm thử tự động, tích hợp với ứng dụng React và xây dựng tài liệu hóa API thông qua Swagger.

## 2.3. Modular Monolith

Modular Monolith là kiểu kiến trúc trong đó toàn bộ backend chạy trong một ứng dụng duy nhất, nhưng bên trong được chia thành các phần chức năng theo từng miền nghiệp vụ. Hệ thống không tách thành nhiều dịch vụ triển khai độc lập, nhưng vẫn giữ ranh giới logic giữa các nhóm chức năng.

Backend của hệ thống được tổ chức theo hướng modular monolith. Các nhóm nghiệp vụ như xác thực, bệnh nhân, bác sĩ, lịch hẹn, tư vấn, câu hỏi sức khỏe, thông báo, kiểm duyệt và báo cáo được tách thành các phần chức năng riêng trong cùng một ứng dụng server.

Kiến trúc Modular Monolith mang lại lợi thế kép: bảo toàn tính toàn vẹn của giao dịch dữ liệu trên cùng một phiên làm việc, đồng thời duy trì ranh giới độc lập tương đối giữa các miền nghiệp vụ, tạo điều kiện thuận lợi cho việc tái cấu trúc mã nguồn khi quy mô mở rộng.

## 2.4. React

React là thư viện JavaScript dùng để xây dựng giao diện người dùng theo hướng component. Giao diện được chia thành các thành phần nhỏ, có thể tái sử dụng và cập nhật linh hoạt theo trạng thái dữ liệu.

Trong hệ thống này, React được sử dụng để xây dựng ứng dụng web phía người dùng. Các màn hình công khai, đăng nhập, đăng ký, đặt lịch, gửi câu hỏi, tư vấn, hồ sơ bệnh nhân, hồ sơ bác sĩ, quản trị và báo cáo đều được thể hiện trên giao diện web. React kết hợp với Vite, React Router, Redux Toolkit, Redux Saga, Axios, Tailwind CSS và một số thư viện giao diện để tổ chức trải nghiệm người dùng.

Cơ chế quản lý trạng thái phản ứng và kiến trúc thành phần (component-based) của React hỗ trợ đắc lực việc xây dựng các giao diện có mật độ tương tác cao, luân chuyển trạng thái liên tục giữa các bộ lọc bác sĩ, bảng lịch trống và phòng chat trực tiếp.

## 2.5. TypeScript

TypeScript là ngôn ngữ mở rộng từ JavaScript, bổ sung hệ thống kiểu tĩnh để giúp phát hiện lỗi sớm trong quá trình phát triển. TypeScript đặc biệt hữu ích với các ứng dụng có nhiều lớp dữ liệu, nhiều API và nhiều đối tượng nghiệp vụ.

Trong hệ thống, TypeScript được sử dụng ở cả frontend và backend. Phía frontend sử dụng TypeScript cho các màn hình, kiểu dữ liệu, API client và trạng thái ứng dụng. Phía backend sử dụng TypeScript trong ứng dụng Node.js/NestJS, các đối tượng truyền dữ liệu, service nghiệp vụ và cấu hình.

Hệ thống kiểu tĩnh của TypeScript bảo đảm tính đồng nhất của các cấu trúc dữ liệu trao đổi (DTO) giữa máy khách và máy chủ, hạn chế tối đa các lỗi chuyển đổi kiểu dữ liệu tại thời gian chạy (runtime).

## 2.6. Node.js

Node.js là môi trường chạy JavaScript/TypeScript phía server. Node.js phù hợp với các ứng dụng web cần xử lý nhiều yêu cầu mạng, API và giao tiếp thời gian thực.

Trong hệ thống, Node.js là nền tảng runtime cho backend. Backend tiếp nhận yêu cầu HTTP, xử lý xác thực, phân quyền, nghiệp vụ lịch hẹn, tư vấn, thông báo, kiểm duyệt và báo cáo. Node.js cũng phù hợp với việc sử dụng Socket.IO cho giao tiếp thời gian thực trong phiên tư vấn.

Mô hình vào/ra bất đồng bộ dựa trên luồng sự kiện (event-driven I/O) của Node.js đặc biệt hiệu quả trong việc duy trì đồng thời nhiều kết nối Socket.IO thời gian thực và xử lý luồng sự kiện outbox chạy ngầm.

## 2.7. NestJS

NestJS là framework backend cho Node.js, hỗ trợ xây dựng ứng dụng server theo cấu trúc rõ ràng, có cơ chế tổ chức chức năng, dependency injection, validation, guard và tích hợp WebSocket. NestJS giúp tổ chức mã nguồn backend theo hướng có kỷ luật hơn so với việc chỉ dùng các thư viện HTTP ở mức thấp.

Trong hệ thống này, NestJS được dùng để xây dựng backend cung cấp REST API, xác thực, phân quyền, xử lý nghiệp vụ, kết nối cơ sở dữ liệu, tài liệu API và realtime gateway. Các nhóm chức năng chính của hệ thống được tổ chức thành các phần nghiệp vụ riêng, phù hợp với cách NestJS khuyến khích chia tách trách nhiệm.

NestJS được lựa chọn nhờ khả năng hiện thực hóa mô hình Modular Monolith một cách nhất quán. Cơ chế Dependency Injection, Middleware, Guard và Pipe của NestJS cho phép thiết lập các lớp bảo vệ kiểm soát truy cập (RBAC), kiểm tra tính hợp lệ của dữ liệu đầu vào (DTO Validation) và xử lý ngoại lệ tập trung một cách chặt chẽ.

## 2.8. PostgreSQL

PostgreSQL là hệ quản trị cơ sở dữ liệu quan hệ, hỗ trợ lưu trữ dữ liệu có cấu trúc, ràng buộc quan hệ, chỉ mục, giao dịch và tính nhất quán dữ liệu. Đây là lựa chọn phù hợp cho các hệ thống cần quản lý dữ liệu nghiệp vụ chặt chẽ.

Trong hệ thống, PostgreSQL lưu trữ dữ liệu người dùng, phiên đăng nhập, hồ sơ bệnh nhân, hồ sơ bác sĩ, chuyên khoa, câu hỏi, câu trả lời, lịch hẹn, phiên tư vấn, tin nhắn, đơn thuốc, đánh giá, thông báo, sự kiện outbox và nhật ký kiểm toán.

PostgreSQL đáp ứng trọn vẹn yêu cầu lưu trữ của hệ thống nhờ hỗ trợ chuẩn giao dịch ACID nghiêm ngặt, cơ chế khóa bản ghi tin cậy và khả năng xử lý truy vấn quan hệ phức tạp. Các ràng buộc toàn vẹn khóa ngoại giữa người dùng, lịch hẹn, phiên tư vấn và đơn thuốc được bảo đảm nhất quán ngay ở tầng dữ liệu.

## 2.9. Prisma ORM

Prisma ORM là công cụ ánh xạ giữa mã nguồn ứng dụng và cơ sở dữ liệu. Prisma cho phép định nghĩa schema dữ liệu, sinh client truy vấn có kiểu dữ liệu và quản lý migration cơ sở dữ liệu.

Trong hệ thống, Prisma được dùng làm lớp truy cập dữ liệu giữa backend và PostgreSQL. Các bảng dữ liệu chính, enum nghiệp vụ và quan hệ giữa các thực thể được định nghĩa trong Prisma schema. Backend dùng Prisma để đọc, tạo, cập nhật và truy vấn dữ liệu phục vụ các chức năng như đặt lịch, tư vấn, hỏi đáp, thông báo và báo cáo.

Prisma ORM bổ trợ trực tiếp cho NestJS bằng khả năng sinh mã truy vấn an toàn kiểu (Type-safe client) từ schema mô hình hóa dữ liệu, giúp phát hiện lỗi sai lệch cấu trúc dữ liệu ngay trong quá trình biên dịch TypeScript, đồng thời hỗ trợ quản lý lịch sử biến đổi lược đồ dữ liệu (migration) một cách khoa học.

## 2.10. JWT Authentication

JWT authentication là cơ chế xác thực trong đó server cấp cho người dùng một token sau khi đăng nhập thành công. Token này được gửi kèm trong các yêu cầu tiếp theo để backend xác định danh tính người dùng.

Trong hệ thống, JWT được sử dụng cho xác thực các tài khoản bệnh nhân, bác sĩ và quản trị viên. Sau khi đăng nhập, người dùng nhận access token để gọi các API cần xác thực. Cơ chế JWT kết hợp Refresh Token lưu trong cookie HttpOnly cho phép máy chủ kiểm tra danh tính độc lập tại từng yêu cầu API theo mô hình phi trạng thái (stateless), đơn giản hóa việc phân quyền mà không phải liên tục tra cứu cơ sở dữ liệu cho mỗi phiên làm việc.

## 2.11. RBAC

RBAC là mô hình phân quyền dựa trên vai trò. Thay vì cấp quyền riêng lẻ cho từng người dùng, hệ thống xác định các vai trò và giới hạn chức năng theo từng vai trò.

Hệ thống áp dụng mô hình RBAC để thiết lập ranh giới chức năng rõ ràng cho bốn nhóm tác nhân: Khách truy cập, Bệnh nhân, Bác sĩ và Quản trị viên. Việc phân quyền dựa trên vai trò kết hợp kiểm tra quyền sở hữu (ownership guard) tại từng hàm dịch vụ bảo đảm người dùng chỉ được tiếp cận đúng phạm vi dữ liệu y tế của chính mình.

## 2.12. WebSocket và Socket.IO

WebSocket là cơ chế giao tiếp hai chiều liên tục giữa client và server, phù hợp với các chức năng cần cập nhật theo thời gian thực. Socket.IO là thư viện xây dựng trên ý tưởng giao tiếp realtime, cung cấp thêm các tiện ích như quản lý kết nối, sự kiện, phòng và khả năng tương thích tốt hơn trong ứng dụng web.

Trong hệ thống, Socket.IO được sử dụng cho chức năng chat trong phiên tư vấn trực tuyến. Khi bệnh nhân và bác sĩ tham gia cùng một phiên tư vấn, tin nhắn có thể được gửi và nhận gần như tức thời, thay vì phải liên tục tải lại trang hoặc gọi API lặp lại.

Sự kết hợp giữa REST API cho các tác vụ quản lý dữ liệu tĩnh và Socket.IO cho luồng tin nhắn thời gian thực giúp hệ thống phân tách hiệu quả giữa các nghiệp vụ truy vấn định kỳ và các kênh liên lạc đòi hỏi độ trễ cực thấp.

## 2.13. bcrypt và bảo mật mật khẩu

bcrypt là thuật toán băm mật khẩu có cơ chế thêm salt và chi phí tính toán, giúp giảm rủi ro khi dữ liệu mật khẩu bị lộ. Thay vì lưu mật khẩu gốc, hệ thống chỉ lưu giá trị băm của mật khẩu.

Trong hệ thống, bcrypt được sử dụng để xử lý mật khẩu người dùng. Khi người dùng đăng ký hoặc đặt lại mật khẩu, mật khẩu được băm trước khi lưu. Khi đăng nhập, mật khẩu nhập vào được so sánh với giá trị băm đã lưu để xác thực.

Thuật toán bcrypt tăng cường độ an toàn cho tài khoản người dùng nhờ tích hợp chuỗi muối ngẫu nhiên (salt) và chi phí tính toán có thể điều chỉnh, loại bỏ rủi ro lộ mật khẩu nguyên bản ngay cả khi dữ liệu cơ sở dữ liệu bị rò rỉ.

## 2.14. Transaction và tính nhất quán dữ liệu

Transaction là cơ chế đảm bảo một nhóm thao tác dữ liệu được thực hiện như một đơn vị thống nhất. Nếu một thao tác trong nhóm thất bại, các thay đổi liên quan có thể được hủy để tránh dữ liệu ở trạng thái không nhất quán.

Trong hệ thống, transaction đặc biệt quan trọng với các nghiệp vụ như đặt lịch và đổi lịch. Khi bệnh nhân đặt lịch, hệ thống cần kiểm tra bác sĩ, bệnh nhân, thời gian, trạng thái lịch hẹn và xung đột lịch. Các thao tác này phải đảm bảo rằng không tạo ra hai lịch hẹn trùng nhau hoặc dữ liệu lịch hẹn thiếu thông tin liên quan.

Việc bọc các thao tác kiểm tra lịch khả dụng, tạo lịch hẹn và sinh sự kiện thông báo trong cùng một giao dịch (transaction) bảo đảm ngăn chặn triệt để hiện tượng xung đột đặt trùng lịch (double booking) trong môi trường có nhiều yêu cầu đồng thời.

## 2.15. Outbox Pattern

Outbox Pattern là mẫu thiết kế dùng để lưu sự kiện cần xử lý sau vào cơ sở dữ liệu trong cùng giao dịch với thao tác nghiệp vụ chính. Sau đó, một tiến trình xử lý riêng đọc các sự kiện này và thực hiện các tác vụ phụ như gửi thông báo.

Trong hệ thống, Outbox Pattern được dùng cho các sự kiện liên quan đến lịch hẹn và câu hỏi sức khỏe, ví dụ khi lịch hẹn được tạo, lịch hẹn được xác nhận hoặc câu hỏi được bác sĩ trả lời. Thay vì buộc thao tác nghiệp vụ phải phụ thuộc trực tiếp vào việc gửi thông báo ngay lập tức, hệ thống ghi nhận sự kiện để xử lý sau.

Mẫu thiết kế Outbox tách rời tiến trình lưu trữ nghiệp vụ chính khỏi việc phát tán thông báo qua các cổng dịch vụ bên ngoài, ngăn ngừa rủi ro việc chậm trễ hoặc lỗi đường truyền của dịch vụ gửi thư làm treo hoặc hủy bỏ giao dịch đặt lịch của người dùng.

## 2.16. Responsive Web Design

Responsive Web Design là phương pháp thiết kế giao diện có khả năng thích ứng với nhiều kích thước màn hình khác nhau, như desktop, tablet và mobile. Giao diện responsive giúp người dùng sử dụng hệ thống thuận tiện hơn trên các thiết bị phổ biến.

Trong hệ thống, giao diện web phục vụ nhiều nhóm người dùng và nhiều loại thao tác như xem bác sĩ, điền biểu mẫu, đặt lịch, chat tư vấn, xem lịch sử và quản trị dữ liệu. Frontend sử dụng các kỹ thuật và thư viện giao diện hỗ trợ bố cục linh hoạt, trong đó Tailwind CSS được dùng để xây dựng giao diện có khả năng thích ứng.

Thiết kế giao diện đáp ứng (Responsive Web Design) bằng Tailwind CSS giúp ứng dụng tự động tối ưu hóa không gian hiển thị trên màn hình máy tính bảng và điện thoại di động, bảo đảm quy trình thao tác đặt lịch và tham gia phòng chat tư vấn diễn ra liền mạch trên mọi kích thước màn hình.

## 2.17. Các công nghệ kiểm thử thực tế được sử dụng

Kiểm thử là hoạt động xác minh hệ thống có đáp ứng các yêu cầu chức năng và hành vi mong đợi hay không. Với hệ thống này, kiểm thử được thực hiện ở cả backend và frontend.

Phía backend sử dụng Jest để kiểm thử các phần xử lý nghiệp vụ và các cơ chế quan trọng như xác thực, cấu hình, xử lý lỗi, lịch hẹn, thông báo, kiểm duyệt, báo cáo và hồ sơ bác sĩ. Jest cho phép cô lập và kiểm thử từng đơn vị hàm nghiệp vụ (Unit Testing) thông qua kỹ thuật giả lập (mocking) tầng dữ liệu Prisma, xác minh tính chính xác của các thuật toán tính toán khung giờ khả dụng và kiểm tra xung đột.

Phía frontend sử dụng Playwright để kiểm thử end-to-end các luồng người dùng trên trình duyệt. Các kịch bản kiểm thử thực tế bao gồm truy cập công khai, đăng nhập theo vai trò, đặt lịch, gửi câu hỏi, luồng làm việc của bác sĩ, quản trị hệ thống và kiểm tra client Socket.IO. Playwright phù hợp vì hệ thống là ứng dụng web có nhiều tương tác UI, nhiều vai trò và nhiều luồng cần xác minh từ góc nhìn người dùng.

Ngoài ra, quá trình kiểm thử sử dụng cơ sở dữ liệu PostgreSQL với dữ liệu seed phục vụ E2E. Cách tiếp cận này giúp các kịch bản kiểm thử phản ánh gần hơn các luồng nghiệp vụ thực tế như bệnh nhân đặt lịch với bác sĩ, bác sĩ xử lý tư vấn và quản trị viên quản lý dữ liệu hệ thống.

Kết quả kiểm thử chi tiết được trình bày ở Chương 6. Trong chương này, các công nghệ kiểm thử chỉ được giới thiệu ở mức cơ sở công nghệ để làm rõ vì sao chúng phù hợp với hệ thống.

Bảng 2.1. Công nghệ chính sử dụng trong hệ thống

| Nhóm | Công nghệ |
|---|---|
| Frontend | React, TypeScript, Vite, Redux Toolkit, Redux Saga, Axios, Socket.IO client, PrimeReact, Tailwind CSS |
| Backend | Node.js, NestJS, TypeScript, Prisma, Socket.IO, node-cron, bcryptjs, JWT |
| Database | PostgreSQL |
| Kiểm thử | Jest, ts-jest, Playwright |
| Build/CI | TypeScript compiler, Nest build, Vite build, GitHub Actions workflow configuration |

# CHƯƠNG 3. PHÂN TÍCH YÊU CẦU HỆ THỐNG

Chương này trình bày các yêu cầu của hệ thống theo tài liệu đặc tả yêu cầu phần mềm cuối cùng. Nội dung tập trung vào việc hệ thống cần làm gì, các nhóm người dùng nào tham gia, các chức năng nào thuộc phạm vi, các quy tắc nghiệp vụ chính và các giới hạn yêu cầu. Những chi tiết về thiết kế kỹ thuật và cách hiện thực mã nguồn được trình bày ở các chương sau.

## 3.1. Mô tả bài toán

Hệ thống hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến được xây dựng nhằm hỗ trợ quy trình kết nối giữa người có nhu cầu tư vấn sức khỏe và bác sĩ trên nền tảng web. Bài toán chính của hệ thống là giúp người dùng tra cứu thông tin bác sĩ, tìm kiếm theo chuyên khoa, đặt lịch tư vấn, gửi câu hỏi sức khỏe, tham gia phiên tư vấn trực tuyến và theo dõi kết quả tư vấn trong một môi trường có kiểm soát truy cập.

Trong bối cảnh sử dụng thực tế, bệnh nhân cần một nơi tập trung để tìm bác sĩ phù hợp, quản lý hồ sơ sức khỏe, theo dõi lịch hẹn và xem lại lịch sử tư vấn. Bác sĩ cần công cụ để quản lý hồ sơ chuyên môn, lịch làm việc, câu hỏi của bệnh nhân, lịch hẹn và kết quả tư vấn. Quản trị viên cần giám sát dữ liệu vận hành, quản lý người dùng, chuyên khoa, lịch hẹn, nội dung tư vấn và thống kê hoạt động hệ thống.

Hệ thống không được định nghĩa như một công cụ chẩn đoán y khoa tự động và không thay thế cho cấp cứu hoặc khám trực tiếp khi cần thiết. Vai trò của hệ thống là hỗ trợ tư vấn sức khỏe trực tuyến, quản lý lịch hẹn, ghi nhận thông tin tư vấn và giúp quá trình trao đổi giữa bệnh nhân, bác sĩ, quản trị viên được tổ chức rõ ràng hơn.

## 3.2. Đối tượng sử dụng

Hệ thống có bốn nhóm người dùng chính:

Bảng 3.1. Tác nhân và vai trò trong hệ thống

| Đối tượng | Mô tả vai trò | Nhóm ca sử dụng liên quan |
|---|---|---|
| Khách truy cập | Người dùng chưa đăng nhập. Có thể truy cập khu vực công khai, xem trang chủ, xem danh sách chuyên khoa, tìm kiếm bác sĩ và xem hồ sơ công khai của bác sĩ. Khi muốn đặt lịch hẹn hoặc gửi câu hỏi, hệ thống yêu cầu đăng nhập hoặc đăng ký. | UC-G-01 đến UC-G-06 |
| Bệnh nhân | Người dùng đăng ký tài khoản bệnh nhân để quản lý hồ sơ sức khỏe, gửi câu hỏi, đặt lịch tư vấn, tham gia phiên tư vấn trực tuyến, xem kết quả, nhận đơn thuốc điện tử và đánh giá chất lượng tư vấn. | UC-P-01 đến UC-P-15 |
| Bác sĩ | Người dùng chuyên môn y tế quản lý hồ sơ chuyên môn, cấu hình lịch làm việc, tiếp nhận và phản hồi câu hỏi, quản lý lịch hẹn, thực hiện phiên tư vấn trực tuyến, ghi nhận kết quả tư vấn và cấp đơn thuốc điện tử cơ bản. | UC-D-01 đến UC-D-11 |
| Quản trị viên | Người dùng vận hành hệ thống, quản lý tài khoản, phê duyệt bác sĩ, quản lý hồ sơ bệnh nhân, chuyên khoa, lịch hẹn, kiểm duyệt nội dung và theo dõi số liệu thống kê hoạt động. | UC-A-01 đến UC-A-08 |

Ngoài các đối tượng sử dụng chính, SRS còn xác định một số hệ thống bên ngoài như Notification Service, Video Communication Service và File Storage Service. Các hệ thống này đóng vai trò ranh giới tích hợp ngoại vi, không làm thay đổi cấu trúc bốn vai trò người dùng cốt lõi.

## 3.3. Yêu cầu chức năng

Các yêu cầu chức năng được tóm tắt theo nhóm tác nhân và miền nghiệp vụ. Mục tiêu của phần này là giữ lại các use case ID chính thức trong SRS, đồng thời trình bày ở mức phù hợp với báo cáo tốt nghiệp, không sao chép toàn bộ nội dung SRS.

Bảng 3.2. Tóm tắt yêu cầu chức năng theo nhóm

### 3.3.1. Nhóm yêu cầu chức năng công khai (Khách truy cập)

| Mã ca sử dụng | Yêu cầu tóm tắt |
|---|---|
| UC-G-01 | Guest User có thể xem trang chủ và các thông tin công khai của hệ thống. |
| UC-G-02 | Guest User có thể xem danh sách chuyên khoa. |
| UC-G-03 | Guest User có thể tìm kiếm bác sĩ theo chuyên khoa hoặc từ khóa. |
| UC-G-04 | Guest User có thể xem chi tiết hồ sơ công khai của bác sĩ. |
| UC-G-05 | Guest User có thể xem danh sách bác sĩ nổi bật hoặc bác sĩ đang hoạt động theo phạm vi hiển thị công khai. |
| UC-G-06 | Guest User được chuyển đến trang đăng nhập hoặc đăng ký khi muốn thực hiện hành động yêu cầu xác thực như đặt lịch hoặc gửi câu hỏi. |

Nhóm yêu cầu này bảo đảm người dùng chưa đăng nhập vẫn có thể tìm hiểu thông tin nền tảng, chuyên khoa và bác sĩ trước khi quyết định đăng ký hoặc đăng nhập.

### 3.3.2. Nhóm yêu cầu xác thực và hồ sơ người dùng

| Mã ca sử dụng | Yêu cầu tóm tắt |
|---|---|
| UC-P-01 | Bệnh nhân có thể đăng ký tài khoản. |
| UC-P-02, UC-D-01, UC-A-01 | Người dùng thuộc các vai trò Patient, Doctor và Administrator có thể đăng nhập. |
| UC-P-03 | Người dùng đã xác thực có thể đăng xuất. |
| UC-P-04 | Bệnh nhân có thể quản lý hồ sơ sức khỏe cá nhân. |
| UC-D-02 | Bác sĩ có thể quản lý hồ sơ chuyên môn. |
| UC-A-02, UC-A-03 | Quản trị viên có thể quản lý tài khoản bác sĩ và bệnh nhân. |

Hệ thống phải áp dụng phân quyền theo vai trò Guest User, Patient, Doctor và Administrator. Người dùng chỉ được truy cập các chức năng và dữ liệu phù hợp với vai trò được gán. SRS cũng yêu cầu hỗ trợ khôi phục mật khẩu bằng email hoặc cơ chế bảo mật tương đương.

### 3.3.3. Nhóm yêu cầu chuyên khoa và khám phá bác sĩ

| Mã ca sử dụng | Yêu cầu tóm tắt |
|---|---|
| UC-G-02 | Guest User có thể xem danh sách chuyên khoa công khai. |
| UC-G-03, UC-P-05 | Guest User và Patient có thể tìm kiếm bác sĩ theo chuyên khoa hoặc từ khóa. |
| UC-G-04, UC-P-06 | Guest User và Patient có thể xem chi tiết bác sĩ. |
| UC-A-04 | Quản trị viên có thể quản lý chuyên khoa. |

Yêu cầu trong SRS nhấn mạnh rằng bác sĩ hiển thị cho người dùng công khai và bệnh nhân phải là bác sĩ đang hoạt động và đã được duyệt. Hồ sơ bác sĩ cần thể hiện các thông tin cần thiết như chuyên khoa, kinh nghiệm, mô tả tư vấn và lịch khả dụng khi phù hợp.

### 3.3.4. Nhóm yêu cầu hỏi đáp sức khỏe

| Mã ca sử dụng | Yêu cầu tóm tắt |
|---|---|
| UC-P-07 | Bệnh nhân có thể gửi câu hỏi sức khỏe. |
| UC-D-03 | Bác sĩ có thể xem các câu hỏi được phân công hoặc có thể xử lý. |
| UC-D-04 | Bác sĩ có thể phản hồi câu hỏi của bệnh nhân. |
| UC-P-11, UC-P-12 | Bệnh nhân có thể xem phản hồi và lịch sử câu hỏi/tư vấn. |
| UC-A-06 | Quản trị viên có thể kiểm duyệt nội dung tư vấn và phản hồi. |

Câu hỏi sức khỏe cần được lưu với trạng thái phù hợp, chẳng hạn `PENDING`, `ANSWERED` hoặc `CLOSED`. Khi bác sĩ phản hồi, hệ thống phải ghi nhận thời điểm phản hồi và bác sĩ phản hồi. Nội dung câu hỏi và phản hồi có thể được quản trị viên xem xét, kiểm duyệt khi cần.

### 3.3.5. Nhóm yêu cầu đặt lịch và quản lý lịch hẹn

| Mã ca sử dụng | Yêu cầu tóm tắt |
|---|---|
| UC-P-08 | Bệnh nhân có thể đặt lịch hẹn tư vấn với bác sĩ. |
| UC-P-09 | Bệnh nhân có thể xem danh sách lịch hẹn sắp tới. |
| UC-P-12 | Bệnh nhân có thể xem lịch sử tư vấn/lịch hẹn. |
| UC-D-05 | Bác sĩ có thể quản lý lịch tư vấn. |
| UC-D-06 | Bác sĩ có thể xem các lịch hẹn đã được đặt. |
| UC-A-05 | Quản trị viên có thể quản lý lịch hẹn. |

Theo SRS, bệnh nhân chỉ được đặt lịch vào khung giờ còn khả dụng; hệ thống phải ngăn đặt trùng lịch cho cùng bác sĩ và cùng thời gian. Lịch hẹn cần lưu các thông tin như bệnh nhân, bác sĩ, ngày giờ, mục đích, trạng thái và thời điểm tạo. Các trạng thái tối thiểu gồm `PENDING_CONFIRMATION`, `CONFIRMED`, Hoàn thành và `CANCELLED`.

### 3.3.6. Nhóm yêu cầu phiên tư vấn, kết quả và đơn thuốc

| Mã ca sử dụng | Yêu cầu tóm tắt |
|---|---|
| UC-P-10 | Bệnh nhân có thể tham gia phiên tư vấn. |
| UC-D-07 | Bác sĩ có thể bắt đầu phiên tư vấn. |
| UC-D-08 | Bác sĩ thực hiện tư vấn qua chat hoặc video theo phạm vi hỗ trợ. |
| UC-D-09 | Bác sĩ ghi nhận kết quả tư vấn. |
| UC-D-10 | Bác sĩ cấp đơn thuốc điện tử cơ bản. |
| UC-P-13 | Bệnh nhân xem đơn thuốc và tóm tắt tư vấn. |
| UC-D-11 | Bác sĩ xem lịch sử tư vấn của bệnh nhân khi phù hợp với nghiệp vụ. |

Hệ thống phải hỗ trợ khởi tạo phiên tư vấn cho lịch hẹn hợp lệ và giới hạn quyền truy cập phiên tư vấn cho các bên có thẩm quyền. Chat thời gian thực là yêu cầu bắt buộc trong phạm vi tư vấn trực tuyến. Video được SRS xác định ở mức mô phỏng, tích hợp cơ bản hoặc mở rộng tùy điều kiện. Hệ thống cũng phải lưu tóm tắt tư vấn và hỗ trợ đơn thuốc điện tử cơ bản sau buổi tư vấn đã hoàn tất.

### 3.3.7. Nhóm yêu cầu đánh giá, thông báo và báo cáo

| Mã ca sử dụng | Yêu cầu tóm tắt |
|---|---|
| UC-P-14 | Bệnh nhân có thể đánh giá chất lượng tư vấn sau khi buổi tư vấn hoàn tất. |
| UC-P-15 | Bệnh nhân nhận nhắc lịch và thông báo. |
| UC-E-01 | Hệ thống gửi email nhắc lịch hoặc thông báo theo phạm vi yêu cầu. |
| UC-E-02 | Hệ thống có thể hỗ trợ SMS nhắc lịch khi có dịch vụ phù hợp. |
| UC-A-07 | Quản trị viên xem dashboard thống kê hệ thống. |
| UC-A-08 | Quản trị viên theo dõi người dùng hoạt động và số lượng phiên tư vấn. |

Bệnh nhân chỉ được đánh giá sau khi buổi tư vấn đã hoàn tất và có thể gửi nhận xét kèm đánh giá. Hệ thống cần gửi thông báo cho các sự kiện như tạo/xác nhận lịch hẹn, nhắc lịch và bác sĩ phản hồi câu hỏi. Quản trị viên cần có khả năng theo dõi thống kê hoạt động tư vấn, người dùng và xu hướng theo thời gian.

## 3.4. Yêu cầu phi chức năng

Các yêu cầu phi chức năng dưới đây được tổng hợp từ SRS cuối cùng. Phần này chỉ nêu yêu cầu, không đánh giá mức độ hiện thực; việc đánh giá được trình bày ở Chương 6.

### 3.4.1. Bảo mật

Hệ thống phải bảo vệ giao tiếp client-server bằng HTTPS trên môi trường triển khai, lưu mật khẩu bằng thuật toán băm một chiều an toàn như bcrypt hoặc Argon2, thực thi xác thực với tài nguyên được bảo vệ và kiểm tra phân quyền với các chức năng giới hạn theo vai trò. Dữ liệu đầu vào cần được kiểm tra hợp lệ ở phía client khi phù hợp và bắt buộc ở phía server. Hệ thống phải hạn chế các rủi ro phổ biến như SQL Injection, Cross-Site Scripting và broken access control.

Đối với dữ liệu sức khỏe, hệ thống phải bảo đảm chỉ người dùng có thẩm quyền mới được truy cập. Hồ sơ tư vấn của bệnh nhân phải được giới hạn cho bệnh nhân đó, bác sĩ phụ trách và quản trị viên được ủy quyền theo chính sách. Các hành động quan trọng như đăng nhập, cập nhật lịch hẹn, phản hồi của bác sĩ và thay đổi quản trị cần được ghi audit log.

### 3.4.2. Quyền riêng tư và bảo mật thông tin

Hệ thống phải xử lý dữ liệu cá nhân và dữ liệu sức khỏe theo các nguyên tắc quyền riêng tư phù hợp với hệ thống định hướng y tế. Việc hiển thị thông tin sức khỏe cá nhân trên giao diện và trong log cần được giảm thiểu khi không cần thiết. Nội dung tư vấn và đơn thuốc phải được bảo mật, đồng thời hệ thống cần định nghĩa cách lưu giữ dữ liệu tư vấn và audit data theo chính sách của dự án.

### 3.4.3. Hiệu năng

Hệ thống nên trả về phản hồi API trong thời gian chấp nhận được dưới tải thông thường. Với các thao tác thông thường, không bao gồm upload file và media thời gian thực, mục tiêu thời gian phản hồi là dưới 3 giây cho 95% request trong môi trường triển khai mục tiêu. Dashboard thống kê cũng cần tải trong thời gian phù hợp với khối lượng dữ liệu dự kiến.

### 3.4.4. Khả năng mở rộng

Hệ thống được thiết kế theo nguyên tắc phân tách trách nhiệm (Separation of Concerns) giữa các phân hệ quản lý người dùng, quản lý lịch hẹn, tư vấn trực tuyến, thông báo và báo cáo. Tầng dịch vụ ứng dụng áp dụng mô hình phi trạng thái (stateless), cho phép thay thế hoặc nâng cấp các cổng tích hợp dịch vụ bên ngoài (như dịch vụ gửi thông báo hoặc dịch vụ truyền thông video) mà không gây ảnh hưởng đến logic nghiệp vụ cốt lõi.

### 3.4.5. Tính sẵn sàng và độ tin cậy

Về tính sẵn sàng và ổn định, hệ thống được thiết lập cơ chế xử lý ngoại lệ tập trung nhằm hạn chế tối đa thời gian gián đoạn dịch vụ ngoài kế hoạch. Khi phát sinh sự cố, máy chủ phản hồi thông điệp lỗi chuẩn hóa, bảo toàn tính nhất quán dữ liệu trong các giao dịch đặt lịch và cập nhật trạng thái. Trong trường hợp kênh truyền thông video gặp sự cố kết nối, hệ thống kích hoạt cơ chế dự phòng, duy trì phiên trao đổi tin nhắn trực tiếp liên tục cho bệnh nhân và bác sĩ.

### 3.4.6. Tính khả dụng

Giao diện người dùng phải responsive và sử dụng được trên desktop, tablet và mobile browser. Các tác vụ cốt lõi như đăng ký, gửi câu hỏi và đặt lịch cần đơn giản, rõ ràng, theo trình tự logic. Hệ thống phải cung cấp phản hồi rõ cho trạng thái thành công, thất bại, lỗi kiểm tra dữ liệu và loading; biểu mẫu phải có nhãn và thông báo validation dễ hiểu; điều hướng và bố cục phải nhất quán giữa các khu vực chính.

### 3.4.7. Khả năng bảo trì và tương thích

Codebase phải được tổ chức theo hướng module hóa, business rules cần được tách khỏi presentation logic khi khả thi, API phải được tài liệu hóa nhất quán, cấu hình môi trường cần dễ bảo trì và logging/monitoring hooks nên hỗ trợ debug/vận hành. Ứng dụng web phải hỗ trợ các trình duyệt hiện đại phổ biến; giao diện responsive phải thích ứng với các kích thước màn hình thông dụng; khi chức năng đa ngôn ngữ được áp dụng, hệ thống nên hỗ trợ tài nguyên văn bản bên ngoài để localization.

## 3.5. Các quy tắc nghiệp vụ chính

Phần này tóm tắt các quy tắc nghiệp vụ quan trọng được nêu trong SRS.

### 3.5.1. Quy tắc truy cập và vai trò

Hệ thống vận hành với bốn vai trò chính: Guest User, Patient, Doctor và Administrator. Guest User chỉ được truy cập khu vực công khai. Patient, Doctor và Administrator phải đăng nhập để sử dụng các chức năng tương ứng. Mỗi người dùng chỉ được truy cập chức năng và dữ liệu phù hợp với vai trò của mình.

Dữ liệu sức khỏe, hồ sơ tư vấn và đơn thuốc phải được giới hạn cho các bên có thẩm quyền. Đây là quy tắc nền tảng để bảo vệ dữ liệu cá nhân và dữ liệu sức khỏe trong hệ thống.

### 3.5.2. Quy tắc hiển thị và lựa chọn bác sĩ

Bác sĩ được hiển thị trong khu vực công khai hoặc trong quá trình bệnh nhân tìm kiếm phải đáp ứng trạng thái active và approved theo SRS. Bác sĩ có thể được gắn với một hoặc nhiều chuyên khoa. Người dùng có thể tìm kiếm hoặc lọc bác sĩ theo chuyên khoa, từ khóa và thông tin công khai phù hợp.

### 3.5.3. Quy tắc đặt lịch hẹn

Bệnh nhân chỉ được đặt lịch với bác sĩ trong các khung giờ còn khả dụng. Hệ thống phải ngăn đặt trùng lịch cho cùng bác sĩ và cùng khung giờ. Lịch hẹn phải có thông tin bệnh nhân, bác sĩ, thời gian, mục đích, trạng thái và thời điểm tạo. Các trạng thái tối thiểu gồm `PENDING_CONFIRMATION`, `CONFIRMED`, Hoàn thành và `CANCELLED`.

Lịch hẹn có thể được hủy theo quy tắc nghiệp vụ đã định nghĩa. Bác sĩ có thể xem lịch hẹn sắp tới và lịch hẹn trong quá khứ của mình; bệnh nhân cũng có thể xem lịch hẹn của chính mình. Quản trị viên có thể xem và quản lý tất cả lịch hẹn.

### 3.5.4. Quy tắc phiên tư vấn

Phiên tư vấn chỉ được khởi tạo cho lịch hẹn hợp lệ. Quyền truy cập phiên tư vấn phải giới hạn cho bệnh nhân tham gia, bác sĩ phụ trách và quản trị viên được ủy quyền nếu có. Hệ thống phải hỗ trợ chat thời gian thực cho phiên tư vấn. Video là khả năng được SRS cho phép ở mức mô phỏng, tích hợp cơ bản hoặc mở rộng tùy điều kiện.

Sau khi phiên tư vấn kết thúc, hệ thống phải lưu tóm tắt tư vấn. Bác sĩ có thể ghi nhận kết quả tư vấn và tạo đơn thuốc điện tử cơ bản cho buổi tư vấn đã hoàn tất. Bệnh nhân chỉ được xem kết quả tư vấn và đơn thuốc gắn với buổi tư vấn của chính mình.

### 3.5.5. Quy tắc đánh giá và thông báo

Bệnh nhân chỉ được đánh giá sau khi buổi tư vấn đã hoàn tất. Hệ thống phải ngăn việc gửi đánh giá cho lịch hẹn chưa hoàn tất. Đánh giá có thể đi kèm nhận xét bằng văn bản và có thể được quản trị viên kiểm duyệt khi cần.

Hệ thống phải gửi thông báo cho các sự kiện quan trọng như lịch hẹn được tạo hoặc xác nhận, nhắc lịch trước thời gian hẹn và câu hỏi đã được bác sĩ phản hồi. Email là kênh thông báo bắt buộc trong phạm vi SRS; SMS được xác định là tùy chọn/mở rộng khi có dịch vụ gửi tin nhắn phù hợp. Lịch sử thông báo và trạng thái gửi từ nhà cung cấp, nếu có, cần được ghi nhận.

## 3.6. Biểu đồ Use Case

Theo tài liệu lựa chọn biểu đồ, báo cáo chỉ sử dụng bốn biểu đồ Use Case theo từng tác nhân chính. Biểu đồ Use Case tổng thể không được đưa trực tiếp vào báo cáo vì quá dày và trùng lặp với các biểu đồ theo vai trò.

### 3.6.1. Biểu đồ Use Case của khách truy cập

[INSERT FIGURE: use-case-guest.png]

**Hình 3.1. Biểu đồ Use Case của khách truy cập**

Biểu đồ này thể hiện các chức năng công khai của Guest User, bao gồm xem trang chủ, xem danh sách chuyên khoa, tìm kiếm bác sĩ, xem hồ sơ bác sĩ và chuyển sang đăng nhập hoặc đăng ký khi muốn thực hiện hành động cần xác thực. Các ca sử dụng liên quan gồm UC-G-01, UC-G-02, UC-G-03, UC-G-04, UC-G-05 và UC-G-06.

### 3.6.2. Biểu đồ Use Case của bệnh nhân

[INSERT FIGURE: use-case-patient.png]

**Hình 3.2. Biểu đồ Use Case của bệnh nhân**

Biểu đồ này mô tả hành trình chính của Patient trong hệ thống: đăng ký, đăng nhập, quản lý hồ sơ sức khỏe, tìm kiếm bác sĩ, gửi câu hỏi, đặt lịch, tham gia tư vấn, xem phản hồi, xem lịch sử, xem tóm tắt/đơn thuốc, đánh giá và nhận thông báo. Các ca sử dụng liên quan gồm UC-P-01 đến UC-P-15. Biểu đồ cũng thể hiện quan hệ với Notification Service qua UC-E-01 và UC-E-02; trong đó SMS là khả năng mở rộng phụ thuộc dịch vụ phù hợp.

### 3.6.3. Biểu đồ Use Case của bác sĩ

[INSERT FIGURE: use-case-doctor.png]

**Hình 3.3. Biểu đồ Use Case của bác sĩ**

Biểu đồ này thể hiện các chức năng chuyên môn của Doctor, bao gồm đăng nhập, quản lý hồ sơ bác sĩ, xem và phản hồi câu hỏi, quản lý lịch tư vấn, xem lịch hẹn, bắt đầu và thực hiện tư vấn, ghi nhận kết quả, cấp đơn thuốc cơ bản và xem lịch sử tư vấn của bệnh nhân. Các ca sử dụng liên quan gồm UC-D-01 đến UC-D-11. Biểu đồ cũng thể hiện UC-E-03 về thiết lập phiên tư vấn video như một khả năng hỗ trợ theo phạm vi SRS.

### 3.6.4. Biểu đồ Use Case của quản trị viên

[INSERT FIGURE: use-case-admin.png]

**Hình 3.4. Biểu đồ Use Case của quản trị viên**

Biểu đồ này mô tả phạm vi vận hành của Administrator, bao gồm đăng nhập, quản lý tài khoản bác sĩ, quản lý tài khoản bệnh nhân, quản lý chuyên khoa, quản lý lịch hẹn, kiểm duyệt nội dung tư vấn và phản hồi, xem dashboard thống kê và theo dõi hoạt động hệ thống. Các ca sử dụng liên quan gồm UC-A-01 đến UC-A-08.

## 3.7. Luồng hoạt động tổng quát của hệ thống

[INSERT FIGURE: system-flow.png]

**Hình 3.5. Luồng hoạt động tổng quát của hệ thống**

Luồng hoạt động tổng quát bắt đầu từ khu vực công khai. Guest User có thể xem trang chủ, xem chuyên khoa và tìm kiếm bác sĩ đã được duyệt. Khi muốn đặt lịch hoặc gửi câu hỏi, người dùng chuyển sang đăng ký hoặc đăng nhập để sử dụng hệ thống với vai trò Patient.

Sau khi xác thực, Patient có thể cập nhật hồ sơ sức khỏe, tìm kiếm và chọn bác sĩ, kiểm tra lịch khả dụng và đặt lịch hẹn tư vấn. Lịch hẹn ban đầu có thể ở trạng thái chờ xác nhận, sau đó được bác sĩ xem xét và xác nhận theo quy trình nghiệp vụ. Bác sĩ cũng quản lý hồ sơ chuyên môn, lịch làm việc và các lịch hẹn liên quan.

Khi đến thời gian tư vấn, Patient và Doctor tham gia phiên tư vấn. Luồng chính của hệ thống là tư vấn qua chat thời gian thực; kênh video giữ vai trò hỗ trợ ở mức giao diện mô phỏng hoặc tích hợp cơ bản theo SRS. Sau phiên tư vấn, bác sĩ ghi nhận tóm tắt tư vấn và có thể tạo đơn thuốc điện tử cơ bản. Patient xem lại kết quả, đơn thuốc và có thể gửi đánh giá chất lượng tư vấn sau khi buổi tư vấn hoàn tất.

Bên cạnh luồng đặt lịch và tư vấn, hệ thống còn có luồng hỗ trợ hỏi đáp sức khỏe. Patient gửi câu hỏi, Doctor trả lời, Patient xem phản hồi, và Administrator có thể kiểm duyệt nội dung khi cần. Notification Service hỗ trợ gửi thông báo hoặc nhắc lịch cho các sự kiện quan trọng như tạo lịch hẹn, xác nhận lịch hẹn hoặc câu hỏi đã được trả lời. Administrator quản lý người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, kiểm duyệt nội dung và theo dõi dashboard/thống kê.

## 3.8. Phạm vi và giới hạn yêu cầu

### 3.8.1. Phạm vi trong đề tài

Theo SRS cuối cùng, phạm vi bắt buộc của hệ thống bao gồm:

- Truy cập nội dung công khai, xem chuyên khoa và tìm kiếm bác sĩ.
- Đăng ký, đăng nhập, đăng xuất và phân quyền theo vai trò.
- Quản lý hồ sơ sức khỏe bệnh nhân và hồ sơ chuyên môn bác sĩ.
- Quản lý chuyên khoa.
- Gửi câu hỏi sức khỏe và bác sĩ phản hồi câu hỏi.
- Đặt lịch tư vấn, quản lý lịch hẹn và ngăn trùng lịch.
- Tham gia phiên tư vấn trực tuyến qua chat.
- Hỗ trợ tư vấn video ở mức mô phỏng hoặc tích hợp cơ bản theo phạm vi hệ thống.
- Ghi nhận tóm tắt tư vấn và đơn thuốc điện tử cơ bản.
- Bệnh nhân xem lịch sử tư vấn, phản hồi, đơn thuốc và đánh giá chất lượng tư vấn.
- Quản trị viên quản lý bác sĩ, bệnh nhân, lịch hẹn, chuyên khoa, kiểm duyệt nội dung và xem thống kê.
- Gửi email hoặc thông báo nhắc lịch hẹn.
- Giao diện responsive cho desktop, tablet và mobile.

### 3.8.2. Chức năng tùy chọn hoặc mở rộng

Các chức năng sau được SRS xác định là tùy chọn hoặc mở rộng, không phải yêu cầu bắt buộc của phạm vi cốt lõi:

- Phiên tư vấn video nâng cao hoặc tích hợp dịch vụ video bên ngoài.
- Nhắc lịch bằng SMS khi có dịch vụ gửi tin nhắn phù hợp.
- Chatbot mô phỏng tư vấn sức khỏe cơ bản.
- Giao diện đa ngôn ngữ.
- Dark Mode.
- Biểu đồ và bộ lọc phân tích nâng cao.

Khi trình bày các chức năng này trong báo cáo, cần phân biệt rõ giữa yêu cầu mở rộng và chức năng cốt lõi. Đặc biệt, SMS và video nâng cao phụ thuộc vào điều kiện dịch vụ bên ngoài; trợ lý tương tác tự động không mang chức năng chẩn đoán y khoa chuyên nghiệp.

### 3.8.3. Ngoài phạm vi hệ thống

SRS xác định các nội dung sau nằm ngoài phạm vi của hệ thống hiện tại:

- Chẩn đoán y khoa bằng AI ở mức production.
- Tích hợp với bệnh viện, phòng khám hoặc hệ thống EHR bên ngoài.
- Kết nối thiết bị IoT hoặc thiết bị đeo.
- Thanh toán bảo hiểm y tế.
- Quản lý giao thuốc hoặc tích hợp nhà thuốc.
- Cuộc gọi video chất lượng cao có ghi hình, lưu trữ và phát lại.
- Ứng dụng di động native.
- Quy trình telemedicine nâng cao như e-consent, referral management và triage engine.

Những giới hạn này giúp bảo đảm phạm vi đề tài tập trung vào mục tiêu chính: hỗ trợ tư vấn sức khỏe trực tuyến, quản lý lịch hẹn, trao đổi giữa bệnh nhân và bác sĩ, ghi nhận kết quả tư vấn và hỗ trợ quản trị hệ thống.

# CHƯƠNG 4. THIẾT KẾ HỆ THỐNG

Chương này trình bày thiết kế của hệ thống đã được xây dựng cuối cùng. Nội dung tập trung vào kiến trúc tổng thể, các lớp chức năng chính, tổ chức dữ liệu, cơ chế xác thực - phân quyền và các luồng thiết kế đại diện. Những nội dung mang tính liệt kê chi tiết mã nguồn, trường dữ liệu hoặc từng API cụ thể không được trình bày trong chương này để tránh trùng lặp với phần xây dựng hệ thống.

## 4.1. Tổng quan kiến trúc hệ thống

Hệ thống được thiết kế dưới dạng ứng dụng web gồm ba lớp chính: Web Client, Application Layer và Data Layer. Người dùng truy cập hệ thống qua trình duyệt. Giao diện phía client là React SPA, chịu trách nhiệm hiển thị giao diện, điều hướng theo vai trò, gửi yêu cầu REST và kết nối realtime trong phiên tư vấn. Phía server là một ứng dụng NestJS theo kiến trúc Modular Monolith, cung cấp REST API, Socket.IO realtime entry, xử lý nghiệp vụ và giao tiếp với cơ sở dữ liệu PostgreSQL thông qua Prisma ORM.

[INSERT FIGURE: architecture-overview.png]

**Hình 4.1. Kiến trúc tổng thể của hệ thống**

Về giao tiếp, phần lớn chức năng nghiệp vụ như đăng nhập, quản lý hồ sơ, tìm bác sĩ, đặt lịch, hỏi đáp, quản trị và báo cáo sử dụng REST API. Riêng phiên tư vấn trực tuyến cần trao đổi hai chiều giữa bệnh nhân và bác sĩ nên sử dụng Socket.IO. Thiết kế này giúp hệ thống vừa giữ được luồng request-response rõ ràng cho dữ liệu nghiệp vụ, vừa hỗ trợ realtime chat cho phiên tư vấn.

Về mô hình triển khai, ứng dụng web giao diện người dùng được đóng gói dưới dạng ứng dụng đơn trang (SPA); máy chủ vận hành như một dịch vụ NestJS tập trung giao tiếp trực tiếp với cơ sở dữ liệu PostgreSQL. Các phân hệ gửi thư điện tử, tin nhắn viễn thông hoặc cuộc gọi video được thiết kế theo lớp trừu tượng hóa dịch vụ ngoại vi (Adapter/Provider boundary), cho phép tích hợp linh hoạt với các nhà cung cấp bên ngoài mà không tạo ra sự ràng buộc cứng vào các dịch vụ đám mây thương mại.

## 4.2. Lựa chọn kiến trúc Modular Monolith

Backend được thiết kế theo hướng Modular Monolith: toàn bộ nghiệp vụ chạy trong một ứng dụng NestJS duy nhất, nhưng được chia thành các module theo miền chức năng. Các module runtime chính gồm `IdentityModule`, `DiscoveryModule`, `PatientModule`, `DoctorModule`, `SpecialtyModule`, `AppointmentModule`, `QuestionModule`, `ConsultationModule`, `NotificationModule`, `ModerationModule`, `ReportingModule`, `OperationsModule` và `PrismaModule`.

Cách thiết kế này phản ánh đúng mối quan hệ nghiệp vụ hữu cơ giữa các phân hệ. Ví dụ, lịch hẹn liên quan đến bệnh nhân, bác sĩ, phiên tư vấn và thông báo; phiên tư vấn liên quan đến kết quả, đơn thuốc và đánh giá; quản trị liên quan đến người dùng, bác sĩ, chuyên khoa và nội dung cần kiểm duyệt. Việc giữ các phân hệ trong cùng một ứng dụng giúp đơn giản hóa triển khai, kiểm thử và giao dịch dữ liệu, đồng thời vẫn giữ được ranh giới chức năng rõ ràng.

Ranh giới module được xác định theo trách nhiệm nghiệp vụ:

Bảng 4.1. Vai trò thiết kế của các module backend

| Module | Vai trò thiết kế |
|---|---|
| Identity | Xác thực, phiên đăng nhập, khôi phục mật khẩu và quản lý người dùng. |
| Discovery | Cung cấp dữ liệu công khai như trang chủ, chuyên khoa và bác sĩ đã được duyệt. |
| Patient | Quản lý hồ sơ sức khỏe của bệnh nhân. |
| Doctor | Quản lý hồ sơ bác sĩ, lịch làm việc, chuyên khoa và thông tin chuyên môn. |
| Specialty | Quản lý chuyên khoa. |
| Appointment | Quản lý lịch khả dụng, đặt lịch, xác nhận, hủy, hoàn tất và đổi lịch hẹn. |
| Question | Quản lý câu hỏi sức khỏe và phản hồi của bác sĩ. |
| Consultation | Quản lý phiên tư vấn, chat realtime, tóm tắt, đơn thuốc và đánh giá. |
| Notification | Quản lý thông báo, outbox, lịch sử gửi và nhắc lịch. |
| Moderation | Kiểm duyệt câu hỏi, phản hồi và nội dung liên quan. |
| Reporting | Thống kê hoạt động và dashboard quản trị. |
| Operations | Health check và thông tin vận hành cơ bản. |
| Prisma | Cung cấp lớp truy cập dữ liệu dùng chung. |

Ưu điểm của kiến trúc Modular Monolith là cấu trúc mạch lạc, bảo đảm tính trọn vẹn của các giao dịch cơ sở dữ liệu và tối ưu chi phí triển khai và kiểm thử thực nghiệm. Sự đánh đổi về mặt kỹ thuật là khi lưu lượng tương tác tăng cao đột biến, các tác vụ đòi hỏi tài nguyên tính toán lớn như xử lý sự kiện ngầm (outbox) hay kết xuất báo cáo có thể gây áp lực lên cùng một tiến trình máy chủ, đòi hỏi các giải pháp phân tải chuyên biệt hơn trong tương lai. Tuy nhiên, đối với quy mô hiện tại, kiến trúc này đáp ứng đầy đủ yêu cầu về tính bảo trì và kiểm soát nghiệp vụ.

## 4.3. Thiết kế Web Client

Web Client được thiết kế là React Single Page Application. Ứng dụng chạy trên trình duyệt, sử dụng client-side routing để chuyển đổi giữa các vùng công khai, vùng bệnh nhân, vùng bác sĩ và vùng quản trị. Cấu trúc frontend được tổ chức theo feature để mỗi nhóm chức năng có màn hình, API client, state và kiểu dữ liệu riêng.

Các nhóm feature chính của Web Client gồm:

- `auth`: đăng nhập, đăng ký, quên mật khẩu, đặt lại mật khẩu và khởi tạo phiên người dùng.
- `public`: trang chủ, danh sách chuyên khoa, danh sách bác sĩ và chi tiết bác sĩ.
- `patient`: hồ sơ bệnh nhân, gửi câu hỏi, đặt lịch, lịch sử tư vấn, phiên tư vấn và đánh giá.
- `doctor`: hồ sơ bác sĩ, lịch làm việc, câu hỏi, lịch hẹn, bệnh nhân, đánh giá và phiên tư vấn.
- `admin`: quản lý người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn và kiểm duyệt.
- `reports`: dashboard và thống kê hoạt động.
- `consultation/realtime`: client dùng chung cho kết nối Socket.IO.

Về điều hướng, các route công khai cho phép người dùng chưa đăng nhập xem thông tin nền tảng, chuyên khoa và bác sĩ. Các route dành cho Patient, Doctor và Administrator được bảo vệ bằng cơ chế guard phía frontend để cải thiện trải nghiệm người dùng. Tuy nhiên, kiểm soát quyền truy cập ở backend vẫn là lớp bảo vệ chính.

Về quản lý trạng thái, Web Client sử dụng Redux Toolkit và Redux Saga. Redux lưu trạng thái xác thực, dữ liệu nghiệp vụ và trạng thái tải/lỗi của các màn hình. Redux Saga xử lý các luồng bất đồng bộ như gọi API đăng nhập, đặt lịch, gửi câu hỏi, lấy dữ liệu bác sĩ, quản trị và báo cáo. Cách tổ chức này giúp giao diện phản hồi tốt trước các thao tác nhiều bước và tránh để logic bất đồng bộ nằm rải rác trong từng màn hình.

Về giao tiếp, Web Client sử dụng REST API cho hầu hết các chức năng dữ liệu và Socket.IO cho chat trong phiên tư vấn. API client dùng access token để gọi các tài nguyên được bảo vệ và hỗ trợ luồng refresh token khi phiên cần được làm mới. Với realtime, client kết nối tới namespace tư vấn, gửi token khi bắt tay kết nối, tham gia phòng theo lịch hẹn và nhận/gửi tin nhắn trong phiên tư vấn.

## 4.4. Thiết kế Application Layer

Application Layer là ứng dụng NestJS duy nhất, đóng vai trò xử lý nghiệp vụ trung tâm của hệ thống. Lớp này cung cấp hai loại entry point:

- REST controllers: tiếp nhận các yêu cầu HTTP cho các chức năng xác thực, public discovery, hồ sơ, lịch hẹn, câu hỏi, tư vấn, thông báo, báo cáo và quản trị.
- `ConsultationGateway`: tiếp nhận kết nối Socket.IO cho phiên tư vấn realtime.

Thiết kế xử lý REST theo luồng tổng quát:

```text
HTTP request
→ Controller
→ Guard/role/ownership check nếu cần
→ Service nghiệp vụ
→ PrismaService
→ PostgreSQL
```

Trong thiết kế này, controller là điểm vào cho request và chỉ nên điều phối dữ liệu đầu vào/đầu ra. Service chứa logic nghiệp vụ như kiểm tra lịch khả dụng, xác nhận quyền truy cập, khởi tạo phiên tư vấn, tạo đơn thuốc, tạo thông báo hoặc tính toán số liệu báo cáo. `PrismaService` là lớp truy cập dữ liệu dùng chung, giúp các module thao tác với PostgreSQL thông qua Prisma ORM.

Với realtime, `ConsultationGateway` là entry point riêng cho Socket.IO. Gateway xác thực kết nối bằng token, nhận sự kiện tham gia phiên tư vấn và gửi tin nhắn, sau đó chuyển xử lý nghiệp vụ cho `ConsultationService`. Thiết kế này giúp tách trách nhiệm giao tiếp realtime khỏi logic kiểm tra quyền truy cập, trạng thái phiên và lưu tin nhắn.

Background processing được đặt trong cùng runtime NestJS thông qua `NotificationScheduler`. Scheduler xử lý hai nhóm tác vụ: xử lý outbox notification theo chu kỳ và gửi nhắc lịch cho các lịch hẹn sắp tới. Scheduler không tự xử lý nghiệp vụ gửi thông báo mà gọi `NotificationService`, nhờ đó logic notification vẫn tập trung trong một service nghiệp vụ.

## 4.5. Thiết kế dữ liệu

Dữ liệu của hệ thống được lưu trong PostgreSQL và truy cập thông qua Prisma ORM. Prisma schema là mô tả chính thức của cấu trúc dữ liệu ứng dụng. Các bảng sử dụng quan hệ rõ ràng giữa người dùng, hồ sơ, lịch hẹn, phiên tư vấn, câu hỏi, đơn thuốc, đánh giá, thông báo và audit log.

[INSERT FIGURE: database-erd.png]

**Hình 4.2. Sơ đồ quan hệ thực thể của hệ thống**

Các nhóm dữ liệu chính gồm:

Bảng 4.2. Nhóm dữ liệu chính của hệ thống

| Nhóm dữ liệu | Thực thể tiêu biểu | Vai trò thiết kế |
|---|---|---|
| Định danh, phiên và audit | `User`, `UserSession`, `PasswordResetToken`, `AuditLog` | Lưu người dùng, phiên refresh token, token đặt lại mật khẩu và nhật ký hành động quan trọng. |
| Hồ sơ và khám phá bác sĩ | `PatientProfile`, `DoctorProfile`, `Specialty`, `DoctorSpecialty` | Quản lý hồ sơ bệnh nhân, hồ sơ bác sĩ, chuyên khoa và quan hệ nhiều-nhiều giữa bác sĩ và chuyên khoa. |
| Hỏi đáp và kiểm duyệt | `Question`, `Answer`, `QuestionModeration` | Lưu câu hỏi sức khỏe, phản hồi của bác sĩ và thông tin kiểm duyệt. |
| Lịch hẹn và phiên tư vấn | `Appointment`, `ConsultationSession`, `ConsultationMessage` | Quản lý lịch hẹn, phiên tư vấn và tin nhắn chat được lưu lại. |
| Kết quả, đơn thuốc và đánh giá | `Prescription`, `PrescriptionItem`, `Rating` | Lưu đơn thuốc điện tử cơ bản, chi tiết thuốc và đánh giá sau tư vấn. |
| Thông báo và xử lý bất đồng bộ | `NotificationLog`, `OutboxEvent` | Lưu lịch sử thông báo và sự kiện cần xử lý sau. |
| Tệp đính kèm | `FileAttachment` | Có trong mô hình dữ liệu như khả năng mở rộng, nhưng không phải trọng tâm của luồng triển khai hiện tại. |

Các quan hệ quan trọng trong thiết kế dữ liệu gồm:

- Một `User` có thể gắn với một hồ sơ bệnh nhân hoặc một hồ sơ bác sĩ tùy vai trò.
- Một `DoctorProfile` có thể liên kết với nhiều `Specialty` thông qua `DoctorSpecialty`.
- Một `PatientProfile` và một `DoctorProfile` cùng tham gia vào nhiều `Appointment`.
- Một `Appointment` có tối đa một `ConsultationSession`; phiên tư vấn có thể có nhiều `ConsultationMessage`.
- Một `ConsultationSession` có thể có một `Prescription`, và một đơn thuốc có nhiều `PrescriptionItem`.
- Một `Appointment` có thể có một `Rating` sau khi hoàn tất.
- `OutboxEvent` lưu các sự kiện nghiệp vụ cần xử lý bất đồng bộ; `NotificationLog` lưu kết quả thông báo gửi tới người dùng.

Thiết kế dữ liệu ưu tiên tính nhất quán của nghiệp vụ đặt lịch và tư vấn. Các enum như `Role`, `AppointmentStatus`, `ConsultationStatus`, `QuestionStatus`, `NotificationStatus`, `RatingStatus`, `ApprovalStatus` và `OutboxStatus` giúp chuẩn hóa trạng thái trong toàn hệ thống.

## 4.6. Thiết kế lớp backend

Theo quyết định lựa chọn biểu đồ lớp, báo cáo sử dụng sơ đồ lớp backend ở dạng rút gọn. Mục tiêu của sơ đồ không phải mô tả toàn bộ mã nguồn hoặc toàn bộ mô hình dữ liệu, mà minh họa các quan hệ cộng tác đại diện trong backend NestJS.

[INSERT FIGURE: backend-class-diagram.png]

**Hình 4.3. Sơ đồ lớp các thành phần backend chính**

Sơ đồ lớp rút gọn nên tập trung vào các nhóm quan hệ sau:

- **Controller → Service:** Các controller như `AuthController`, `AppointmentController`, `QuestionController`, `ConsultationController`, `ModerationController` và `ReportingController` nhận request và chuyển xử lý nghiệp vụ cho service tương ứng.
- **Gateway → Service:** `ConsultationGateway` nhận sự kiện Socket.IO và gọi `ConsultationService` để kiểm tra quyền truy cập, trạng thái phiên và lưu tin nhắn.
- **Scheduler → Service:** `NotificationScheduler` gọi `NotificationService` để xử lý outbox và nhắc lịch.
- **Service → PrismaService:** Các service nghiệp vụ sử dụng `PrismaService` để truy xuất và cập nhật dữ liệu trong PostgreSQL.
- **NotificationService → NotificationProvider:** `NotificationService` phụ thuộc vào abstraction provider để tách logic thông báo khỏi chi tiết kênh gửi.

Sơ đồ này không lặp lại ERD. Các model dữ liệu như `User`, `Appointment`, `ConsultationSession`, `Prescription` hoặc `Rating` được trình bày bằng ERD ở mục 4.5. Trong sơ đồ lớp backend, chỉ nên dùng các tham chiếu nhẹ như `OutboxEvent` hoặc `NotificationLog` nếu cần làm rõ luồng thông báo.

## 4.7. Thiết kế xác thực và phân quyền

Hệ thống sử dụng JWT access token kết hợp refresh token trong cookie HTTP-only. Khi người dùng đăng nhập thành công, backend cấp access token để gọi API được bảo vệ và refresh token để duy trì phiên đăng nhập. Refresh token được quản lý như phiên đăng nhập phía server, có thể được xoay vòng hoặc thu hồi khi người dùng đăng xuất.

Thiết kế phân quyền gồm ba lớp chính:

- `JwtAuthGuard`: xác thực access token và gắn thông tin người dùng vào request.
- `RolesGuard`: kiểm tra người dùng có vai trò phù hợp với chức năng đang truy cập hay không.
- `OwnershipGuard`: kiểm tra quyền sở hữu dữ liệu ở những tình huống cần bảo vệ tài nguyên theo người dùng cụ thể.

Mô hình RBAC của hệ thống dựa trên các vai trò `PATIENT`, `DOCTOR` và `ADMIN` ở backend. Guest User chỉ truy cập vùng công khai và không có vai trò đăng nhập trong backend. Thiết kế này đáp ứng yêu cầu tách biệt quyền giữa bệnh nhân, bác sĩ và quản trị viên, đặc biệt với dữ liệu nhạy cảm như hồ sơ sức khỏe, lịch hẹn, kết quả tư vấn và đơn thuốc.

[INSERT FIGURE: sequence-login.png]

**Hình 4.4. Biểu đồ tuần tự đăng nhập người dùng**

Biểu đồ đăng nhập được chọn vì đại diện cho cơ chế xác thực chung của Patient, Doctor và Administrator. Luồng này thể hiện việc người dùng gửi thông tin đăng nhập, backend kiểm tra thông tin xác thực, tạo phiên đăng nhập, ghi nhận thông tin cần thiết và trả token cho client.

## 4.8. Thiết kế phân hệ đặt lịch

Phân hệ đặt lịch giữ vai trò điều phối trung tâm trong toàn bộ quy trình dịch vụ. Thiết kế đặt lịch gồm ba bước chính: xác định lịch khả dụng của bác sĩ, tạo lịch hẹn và quản lý vòng đời lịch hẹn.

Lịch khả dụng được xác định dựa trên lịch làm việc của bác sĩ, ngày cần tư vấn, thời lượng lịch hẹn và các lịch hẹn hiện có. Hệ thống chỉ cho phép đặt lịch với bác sĩ đang hoạt động, đã được duyệt và có tài khoản hợp lệ. Khi bệnh nhân chọn một khung giờ, backend kiểm tra lại thời gian đó có nằm trong lịch làm việc của bác sĩ hay không và có bị xung đột với lịch hẹn khác của bác sĩ hoặc bệnh nhân hay không.

Vòng đời lịch hẹn sử dụng các trạng thái như `PENDING_CONFIRMATION`, `CONFIRMED`, Hoàn thành, `CANCELLED` và `NO_SHOW`. Trong luồng chính, bệnh nhân tạo lịch hẹn ở trạng thái chờ xác nhận, bác sĩ xác nhận lịch, hai bên tham gia tư vấn và lịch được hoàn tất sau khi phiên tư vấn kết thúc.

Các thao tác quan trọng như tạo lịch hẹn và đổi lịch sử dụng transaction để đảm bảo dữ liệu nhất quán. Trong cùng transaction, hệ thống vừa tạo/cập nhật lịch hẹn, vừa ghi audit log và tạo `OutboxEvent` cho thông báo liên quan. Việc dùng transaction giúp giảm rủi ro đặt trùng lịch hoặc tạo thông báo không khớp với trạng thái lịch hẹn.

[INSERT FIGURE: sequence-book-appointment.png]

**Hình 4.5. Biểu đồ tuần tự đặt lịch tư vấn**

Biểu đồ này được chọn vì đại diện cho luồng nghiệp vụ lõi của hệ thống. Nó thể hiện các bước kiểm tra bệnh nhân, bác sĩ, khung giờ, xung đột lịch, transaction tạo lịch hẹn và phát sinh sự kiện thông báo sau khi đặt lịch.

## 4.9. Thiết kế tư vấn trực tuyến

Phân hệ tư vấn trực tuyến quản lý vòng đời từ lúc bác sĩ bắt đầu phiên tư vấn đến khi bệnh nhân xem lại kết quả. Phiên tư vấn chỉ được khởi tạo cho lịch hẹn hợp lệ và trong khoảng thời gian cho phép. Khi phiên bắt đầu, hệ thống tạo hoặc cập nhật `ConsultationSession` ở trạng thái `ONGOING`.

Giao tiếp realtime được thiết kế bằng Socket.IO. Client của bệnh nhân và bác sĩ kết nối vào namespace tư vấn, gửi token để xác thực, tham gia phòng tương ứng với lịch hẹn và gửi tin nhắn qua sự kiện realtime. `ConsultationGateway` là điểm vào realtime, còn `ConsultationService` chịu trách nhiệm kiểm tra quyền truy cập, kiểm tra trạng thái phiên, lưu tin nhắn và trả dữ liệu cần thiết cho gateway phát lại tới phòng tư vấn.

[INSERT FIGURE: sequence-consultation-chat.png]

**Hình 4.6. Biểu đồ tuần tự chat realtime trong phiên tư vấn**

Biểu đồ này thể hiện sự khác biệt giữa luồng realtime và REST thông thường: client kết nối Socket.IO, tham gia phòng tư vấn, gửi tin nhắn, backend lưu tin nhắn và broadcast cho các bên trong cùng phiên.

Sau khi phiên tư vấn kết thúc, bác sĩ có thể lưu tóm tắt tư vấn. Nếu lịch hẹn đã hoàn tất, bác sĩ có thể tạo đơn thuốc điện tử cơ bản gồm các thuốc và hướng dẫn sử dụng. Bệnh nhân có quyền xem kết quả và đơn thuốc của phiên tư vấn của chính mình. Hệ thống cũng hỗ trợ đánh giá sau khi buổi tư vấn đã hoàn tất; đánh giá có thể được quản trị viên kiểm duyệt khi cần.

[INSERT FIGURE: sequence-create-prescription.png]

**Hình 4.7. Biểu đồ tuần tự tạo đơn thuốc sau tư vấn**

Biểu đồ này được chọn vì đại diện cho phần kết quả sau tư vấn. Nó thể hiện điều kiện nghiệp vụ là đơn thuốc chỉ được tạo sau khi buổi tư vấn/lịch hẹn đã hoàn tất, đồng thời lưu đơn thuốc và các mục thuốc như một phần của dữ liệu kết quả tư vấn.

Chức năng tư vấn qua video trong hệ thống hiện tại được thiết kế như một kênh giao tiếp tùy chọn thông qua ranh giới mở rộng. Hệ thống tập trung hoàn thiện kênh trao đổi tin nhắn trực tiếp thời gian thực, đồng thời thiết lập ranh giới giao tiếp dự phòng cho kênh truyền thông hình ảnh.

## 4.10. Thiết kế notification và background processing

Thông báo được thiết kế theo hướng bất đồng bộ bằng Outbox Pattern. Khi một nghiệp vụ chính xảy ra, chẳng hạn tạo lịch hẹn, xác nhận lịch hẹn hoặc bác sĩ trả lời câu hỏi, hệ thống tạo `OutboxEvent` trong cùng transaction với thao tác nghiệp vụ. Sau đó, background scheduler đọc các sự kiện này và chuyển cho `NotificationService` xử lý.

Thiết kế notification gồm các thành phần chính:

- `OutboxEvent`: lưu sự kiện nghiệp vụ cần xử lý sau.
- `NotificationScheduler`: chạy định kỳ để xử lý outbox và gửi nhắc lịch.
- `NotificationService`: điều phối việc xử lý sự kiện, tạo notification log và gọi provider phù hợp.
- `NotificationLog`: lưu lịch sử thông báo, trạng thái gửi, provider và lỗi nếu có.
- Provider boundary: tách hệ thống lõi khỏi chi tiết kênh gửi email/SMS/development.

Thiết kế này giúp thao tác nghiệp vụ chính không phụ thuộc trực tiếp vào việc gửi thông báo thành công ngay lập tức. Nếu thông báo gặp lỗi, dữ liệu lịch hẹn hoặc câu hỏi vẫn được ghi nhận ổn định và sự kiện có thể được xử lý lại theo trạng thái outbox.

[INSERT FIGURE: sequence-notification-outbox.png]

**Hình 4.8. Biểu đồ tuần tự xử lý thông báo bất đồng bộ qua outbox**

Biểu đồ này thể hiện cách transaction nghiệp vụ tạo `OutboxEvent`, scheduler xử lý batch, `NotificationService` tạo `NotificationLog` và gọi provider boundary để gửi thông báo. Đây là luồng đại diện cho thiết kế notification của hệ thống.

## 4.11. Các Sequence Diagram tiêu biểu khác

Các sequence diagram đã được đặt trực tiếp tại các mục thiết kế tương ứng gồm đăng nhập, đặt lịch, chat realtime, tạo đơn thuốc và xử lý notification. Ngoài các luồng trên, báo cáo còn sử dụng một sequence diagram đại diện cho thiết kế quản trị và kiểm duyệt.

[INSERT FIGURE: sequence-admin-moderation.png]

**Hình 4.9. Biểu đồ tuần tự kiểm duyệt câu hỏi và phản hồi**

Biểu đồ kiểm duyệt được chọn vì thể hiện rõ vai trò của Administrator trong quản trị nội dung. Luồng này đại diện cho việc quản trị viên xem hàng đợi nội dung cần xử lý, thực hiện hành động kiểm duyệt và hệ thống cập nhật trạng thái nội dung, đồng thời ghi nhận thông tin phục vụ audit. Thiết kế kiểm duyệt giúp hệ thống kiểm soát chất lượng nội dung tư vấn và phản hồi trong phạm vi chức năng quản trị.

# CHƯƠNG 5. XÂY DỰNG VÀ TRIỂN KHAI HỆ THỐNG

Chương này trình bày cách hệ thống đã được xây dựng dựa trên thiết kế ở Chương 4. Nội dung tập trung vào các phân hệ chức năng trong phiên bản cài đặt cuối cùng, bao gồm trách nhiệm của giao diện người dùng, API backend, tương tác dữ liệu, quy tắc nghiệp vụ và các cơ chế kỹ thuật nổi bật.

Các sơ đồ kiến trúc tổng thể, ERD, sơ đồ lớp và các Sequence Diagram đã được trình bày ở Chương 4, vì vậy chương này không lặp lại các sơ đồ đó. Khi cần minh họa, chương này ưu tiên ảnh chụp giao diện hoặc đoạn mã đại diện.

## 5.1. Phân hệ xác thực và phân quyền (RBAC)

**Mục tiêu triển khai:** Phân hệ xác thực và phân quyền bảo đảm chỉ người dùng hợp lệ được truy cập hệ thống và mỗi vai trò chỉ được sử dụng các chức năng phù hợp. Hệ thống hỗ trợ ba vai trò chính: bệnh nhân, bác sĩ và quản trị viên.

**Xây dựng phía giao diện người dùng (Frontend):** Ứng dụng React cung cấp các màn hình đăng ký, đăng nhập, quên mật khẩu và đặt lại mật khẩu. Sau khi đăng nhập, frontend lưu access token trong trạng thái ứng dụng, tự gắn token vào các yêu cầu API và điều hướng người dùng đến dashboard tương ứng với vai trò. Các route được bảo vệ bằng `AuthGuard` và `RoleGuard`, nhờ đó bệnh nhân, bác sĩ và quản trị viên chỉ nhìn thấy các trang phù hợp.

**Xây dựng phía máy chủ (Backend):** Backend triển khai `AuthController`, `AuthService`, `UsersService`, `JwtAuthGuard`, `RolesGuard` và `OwnershipGuard`. `AuthService` kiểm tra email, mật khẩu đã băm bằng bcrypt, trạng thái tài khoản và phát hành access token/refresh token. `AuthController` đặt refresh token trong cookie HttpOnly, cung cấp API đăng nhập, làm mới token, đăng xuất, lấy thông tin tài khoản hiện tại và đặt lại mật khẩu.

**Tương tác dữ liệu và thực thể liên quan:** Dữ liệu chính gồm `User`, `UserSession`, `PasswordResetToken` và `AuditLog`. Refresh token không được lưu trực tiếp mà được băm rồi lưu trong `UserSession`; khi làm mới token, phiên cũ được thu hồi và một phiên mới được tạo.

**Quy tắc nghiệp vụ cốt lõi:** Tài khoản bị vô hiệu hóa hoặc đã bị xóa mềm không được đăng nhập. Refresh token phải đúng phiên, chưa bị thu hồi và chưa hết hạn. Một số API dùng kiểm tra quyền sở hữu để ngăn người dùng truy cập tài nguyên của người khác, đồng thời cho phép quản trị viên truy cập khi chính sách cho phép.

**Giải pháp kỹ thuật nổi bật:** Hệ thống dùng JWT cho access token, cookie HttpOnly cho refresh token, bcrypt cho mật khẩu và audit log cho các hành động nhạy cảm như đăng nhập, làm mới token, đăng xuất và đặt lại mật khẩu.

Đoạn mã sau minh họa cơ chế phát hành token và lưu phiên refresh:

```ts
const accessToken = await this.jwtService.signAsync(accessPayload);
const refreshToken = await this.jwtService.signAsync(refreshPayload, {
  secret: this.refreshSecret,
  expiresIn: this.refreshExpire as any,
});

await this.prisma.userSession.create({
  data: {
    id: sessionId,
    userId: user.id,
    refreshTokenHash: this.hashToken(refreshToken),
    expiresAt,
    userAgent,
    ipAddress,
  },
});
```

## 5.2. Phân hệ tra cứu chuyên khoa và bác sĩ công khai

**Mục tiêu triển khai:** Phân hệ khám phá công khai cho phép khách và người dùng đã đăng nhập xem danh sách chuyên khoa, tìm kiếm bác sĩ và xem thông tin bác sĩ trước khi đặt lịch.

**Xây dựng phía giao diện người dùng (Frontend):** Frontend có các trang danh sách chuyên khoa, danh sách bác sĩ và chi tiết bác sĩ. Module `public.api.ts` gọi các API công khai, chuẩn hóa dữ liệu bác sĩ, chuyên khoa, đánh giá trung bình và số lượt đánh giá để hiển thị nhất quán trên giao diện.

[INSERT FIGURE: ui-public-doctor-discovery.png]

Hình 5.1. Giao diện tra cứu chuyên khoa và bác sĩ

**Xây dựng phía máy chủ (Backend):** Backend triển khai `DiscoveryController` và `DiscoveryService`. Phân hệ này trả về thông tin trang chủ API, danh sách chuyên khoa đang hoạt động, danh sách bác sĩ công khai có phân trang, lọc theo chuyên khoa và tìm kiếm theo từ khóa.

**Tương tác dữ liệu và thực thể liên quan:** Dữ liệu được đọc từ `Specialty`, `DoctorProfile`, `DoctorSpecialty`, `User` và `Rating`. Khi lấy danh sách bác sĩ, hệ thống chỉ lấy bác sĩ đang hoạt động, đã được duyệt và tài khoản người dùng tương ứng chưa bị vô hiệu hóa.

**Quy tắc nghiệp vụ cốt lõi:** Chỉ bác sĩ có `approvalStatus = APPROVED`, `isActive = true` và tài khoản còn hoạt động mới được hiển thị công khai. Điểm đánh giá công khai chỉ tính các đánh giá có trạng thái hiển thị.

**Giải pháp kỹ thuật nổi bật:** Backend sử dụng Prisma để kết hợp điều kiện lọc, phân trang và truy vấn quan hệ. Kết quả được bổ sung thống kê đánh giá bằng truy vấn aggregate theo từng bác sĩ.

## 5.3. Phân hệ quản lý hồ sơ bệnh nhân

**Mục tiêu triển khai:** Phân hệ hồ sơ bệnh nhân cho phép bệnh nhân lưu trữ và cập nhật thông tin cá nhân cần thiết cho quá trình tư vấn, gồm ngày sinh, giới tính, số điện thoại, địa chỉ và tiền sử sức khỏe.

**Xây dựng phía giao diện người dùng (Frontend):** Trang hồ sơ bệnh nhân hiển thị thông tin tài khoản kết hợp với hồ sơ bệnh nhân. Người dùng có thể cập nhật thông tin bổ sung; dữ liệu nhập được chuẩn hóa trước khi gửi lên API, ví dụ giới tính được chuyển về dạng enum backend sử dụng.

**Xây dựng phía máy chủ (Backend):** `PatientController` và `PatientService` cung cấp API lấy và cập nhật hồ sơ cá nhân. Khi cập nhật, backend kiểm tra hồ sơ theo `userId`; nếu chưa có hồ sơ thì tạo bản ghi hồ sơ rỗng trước khi cập nhật dữ liệu.

**Tương tác dữ liệu và thực thể liên quan:** Phân hệ sử dụng `PatientProfile` liên kết một-một với `User`. Các thông tin định danh như email, họ tên và vai trò được đọc từ `User`, còn thông tin y tế cơ bản được lưu trong `PatientProfile`.

**Quy tắc nghiệp vụ cốt lõi:** Bệnh nhân chỉ được truy cập hồ sơ của chính mình thông qua access token. Dữ liệu hồ sơ không được dùng để đưa ra chẩn đoán tự động; hệ thống chỉ hỗ trợ lưu trữ thông tin tham khảo cho hoạt động tư vấn.

**Giải pháp kỹ thuật nổi bật:** API cập nhật dùng phương thức PATCH để chỉ ghi các trường được gửi lên, tránh ghi đè không cần thiết những trường người dùng không thay đổi.

## 5.4. Phân hệ quản lý hồ sơ bác sĩ và lịch làm việc

**Mục tiêu triển khai:** Phân hệ hồ sơ bác sĩ và lịch làm việc cho phép bác sĩ quản lý thông tin nghề nghiệp, chuyên khoa, mô tả tư vấn và khung giờ có thể nhận lịch hẹn.

**Xây dựng phía giao diện người dùng (Frontend):** Các trang hồ sơ bác sĩ, lịch làm việc, danh sách lịch hẹn, danh sách bệnh nhân và đánh giá bác sĩ được tổ chức trong khu vực dành cho vai trò `DOCTOR`. Module `doctor.api.ts` gọi API hồ sơ, lịch, lịch hẹn, câu hỏi, bệnh nhân, đánh giá và tư vấn.

**Xây dựng phía máy chủ (Backend):** `DoctorController` và `DoctorService` xử lý lấy/cập nhật hồ sơ bác sĩ, cập nhật lịch làm việc, cập nhật chuyên khoa và thống kê cơ bản của bác sĩ. Quản trị viên có các API riêng để duyệt, cập nhật hồ sơ và chuyên khoa của bác sĩ.

**Tương tác dữ liệu và thực thể liên quan:** Dữ liệu chính gồm `DoctorProfile`, `DoctorSpecialty`, `Specialty`, `User`, `Appointment`, `Question` và `Rating`. Lịch làm việc được lưu trong trường `schedule` của hồ sơ bác sĩ dưới dạng cấu trúc JSON.

**Quy tắc nghiệp vụ cốt lõi:** Chuyên khoa được gán cho bác sĩ phải tồn tại và đang hoạt động. Khi thay đổi chuyên khoa, hệ thống xóa các liên kết cũ và tạo lại các liên kết mới trong một transaction. Bác sĩ chưa được duyệt không được xuất hiện trong danh sách công khai và không được đặt lịch.

**Giải pháp kỹ thuật nổi bật:** Backend sử dụng transaction để thay thế danh sách chuyên khoa của bác sĩ, đồng thời ghi audit log khi quản trị viên thay đổi trạng thái duyệt hoặc cập nhật thông tin bác sĩ.

## 5.5. Phân hệ hỏi đáp y tế trực tuyến

**Mục tiêu triển khai:** Phân hệ câu hỏi sức khỏe cho phép bệnh nhân gửi câu hỏi, tùy chọn gán cho bác sĩ cụ thể, và cho phép bác sĩ trả lời trong phạm vi chức năng tư vấn sức khỏe trực tuyến.

**Xây dựng phía giao diện người dùng (Frontend):** Bệnh nhân có trang đặt câu hỏi và xem lịch sử câu hỏi. Bác sĩ có hộp thư câu hỏi được giao hoặc câu hỏi chưa gán. Frontend chuẩn hóa trạng thái câu hỏi để hiển thị đơn giản như đang chờ, đã trả lời hoặc đã kiểm duyệt.

**Xây dựng phía máy chủ (Backend):** `QuestionController` và `QuestionService` cung cấp API tạo câu hỏi, lấy câu hỏi của bệnh nhân, lấy câu hỏi của bác sĩ, trả lời câu hỏi và kiểm duyệt câu hỏi. Khi bác sĩ trả lời, hệ thống cập nhật trạng thái câu hỏi, tạo câu trả lời, ghi audit log và phát sinh outbox event.

**Tương tác dữ liệu và thực thể liên quan:** Dữ liệu gồm `Question`, `Answer`, `QuestionModeration`, `PatientProfile`, `DoctorProfile`, `AuditLog` và `OutboxEvent`.

**Quy tắc nghiệp vụ cốt lõi:** Nếu bệnh nhân chọn bác sĩ, bác sĩ đó phải đang hoạt động và đã được duyệt. Bác sĩ không được trả lời câu hỏi đã được gán cho bác sĩ khác. Câu hỏi chỉ được trả lời khi đang ở trạng thái chờ xử lý.

**Giải pháp kỹ thuật nổi bật:** Việc trả lời câu hỏi được thực hiện trong transaction để bảo đảm câu hỏi, câu trả lời, audit log và sự kiện thông báo được ghi nhất quán.

## 5.6. Phân hệ đặt lịch hẹn và quản lý tính khả dụng

**Mục tiêu triển khai:** Phân hệ lịch hẹn cho phép bệnh nhân xem khung giờ khả dụng của bác sĩ, đặt lịch tư vấn, hủy lịch; bác sĩ xác nhận, hoàn thành hoặc đổi lịch hẹn; quản trị viên theo dõi và cập nhật trạng thái khi cần.

**Xây dựng phía giao diện người dùng (Frontend):** Bệnh nhân sử dụng trang đặt lịch để chọn bác sĩ, ngày, khung giờ và lý do tư vấn. Bác sĩ quản lý danh sách lịch hẹn tại khu vực bác sĩ. Quản trị viên có màn hình quản lý lịch hẹn để lọc, xem và cập nhật trạng thái.

[INSERT FIGURE: ui-book-appointment.png]

Hình 5.2. Giao diện đặt lịch hẹn trực tuyến

**Xây dựng phía máy chủ (Backend):** `AppointmentController` và `AppointmentService` xử lý API xem khả dụng công khai, tạo lịch hẹn, danh sách lịch hẹn của bệnh nhân, danh sách lịch hẹn của bác sĩ, xác nhận, hủy, hoàn thành, đổi lịch và quản trị lịch hẹn.

**Tương tác dữ liệu và thực thể liên quan:** Phân hệ sử dụng `Appointment`, `PatientProfile`, `DoctorProfile`, `DoctorSpecialty`, `ConsultationSession`, `Rating`, `AuditLog`, `OutboxEvent` và một số `NotificationLog` trong các thao tác trạng thái.

**Quy tắc nghiệp vụ cốt lõi:** Lịch hẹn phải nằm trong tương lai, nằm trong lịch làm việc của bác sĩ, không trùng với lịch hẹn đang chờ xác nhận hoặc đã xác nhận của bác sĩ và bệnh nhân. Bác sĩ phải đang hoạt động, được duyệt và tài khoản chưa bị vô hiệu hóa.

**Giải pháp kỹ thuật nổi bật:** Tạo lịch hẹn sử dụng transaction với isolation level `Serializable` để giảm rủi ro đặt trùng khi nhiều yêu cầu xảy ra gần nhau. Trong cùng transaction, hệ thống tạo lịch hẹn, ghi audit log và tạo outbox event để xử lý thông báo.

Đoạn mã sau minh họa phần transaction khi đặt lịch:

```ts
return this.prisma.$transaction(async (tx) => {
  this.assertInsideWorkingSchedule(latestDoctor.schedule, start, duration);
  await this.assertNoAppointmentOverlap(tx, {
    doctorId: doctor.id,
    patientId: patient.id,
    start,
    durationMinutes: duration,
  });

  const appointment = await tx.appointment.create({
    data: {
      id: uuidv7(),
      patientId: patient.id,
      doctorId: doctor.id,
      scheduledAt: start,
      durationMinutes: duration,
      status: AppointmentStatus.PENDING_CONFIRMATION,
    },
  });

  await tx.outboxEvent.create({
    data: {
      id: uuidv7(),
      aggregateType: 'APPOINTMENT',
      aggregateId: appointment.id,
      eventType: 'APPOINTMENT_CREATED',
      payload: { appointmentId: appointment.id, patientId: patient.id, doctorId: doctor.id },
    },
  });

  return appointment;
}, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
```

## 5.7. Phân hệ tư vấn trực tuyến và trao đổi tin nhắn thời gian thực

**Mục tiêu triển khai:** Phân hệ tư vấn trực tuyến hỗ trợ bệnh nhân và bác sĩ trao đổi trong phiên tư vấn gắn với lịch hẹn. Hệ thống hỗ trợ kênh chat thời gian thực và có ranh giới để tích hợp video khi nhà cung cấp bên ngoài được bật.

**Xây dựng phía giao diện người dùng (Frontend):** Bệnh nhân và bác sĩ có các trang phiên tư vấn riêng. Frontend tải thông tin lịch hẹn, tham gia phiên tư vấn, lấy lịch sử tin nhắn, gửi tin nhắn và kết nối Socket.IO thông qua `ConsultationSocketClient`. Client tự xử lý trạng thái kết nối, tham gia phòng theo `appointmentId` và tránh hiển thị trùng tin nhắn đã nhận.

[INSERT FIGURE: ui-consultation-chat.png]

Hình 5.3. Giao diện tư vấn trực tuyến và trao đổi tin nhắn

**Xây dựng phía máy chủ (Backend):** `ConsultationController`, `ConsultationService` và `ConsultationGateway` triển khai API bắt đầu phiên, tham gia phiên, lấy/gửi tin nhắn, kết thúc phiên và lấy kết quả tư vấn. `ConsultationGateway` là điểm vào realtime của Socket.IO tại namespace `/consultations`.

**Tương tác dữ liệu và thực thể liên quan:** Dữ liệu gồm `Appointment`, `ConsultationSession`, `ConsultationMessage`, `PatientProfile`, `DoctorProfile` và `User`. Tin nhắn được lưu vào cơ sở dữ liệu để có thể tải lại lịch sử trao đổi.

**Quy tắc nghiệp vụ cốt lõi:** Chỉ bác sĩ sở hữu lịch hẹn mới được bắt đầu và kết thúc phiên. Bệnh nhân hoặc bác sĩ chỉ được tham gia phiên của chính mình. Việc tham gia phiên bị giới hạn bởi khung thời gian cho phép quanh thời điểm lịch hẹn. Phiên tư vấn chỉ nhận tin nhắn khi đang ở trạng thái `ONGOING`.

**Giải pháp kỹ thuật nổi bật:** Socket.IO sử dụng token JWT trong handshake để xác thực kết nối. Mỗi lịch hẹn có một room riêng theo mẫu `consultation:<appointmentId>`. Khi một người gửi tin nhắn, gateway gọi service để kiểm tra quyền, lưu tin nhắn, rồi phát tin nhắn tới toàn bộ room.

Đoạn mã sau minh họa handler gửi tin nhắn realtime:

```ts
@SubscribeMessage('consultation:message')
async sendMessage(
  @ConnectedSocket() client: Socket,
  @MessageBody() body: { appointmentId?: string; content?: string },
) {
  const user = this.getClientUser(client);
  const message = await this.consultationService.sendSessionMessage(
    user.sub,
    user.role,
    body.appointmentId!,
    { content: body.content!.trim() },
  );

  this.server.to(`consultation:${body.appointmentId}`).emit('consultation:message', message);
  return message;
}
```

## 5.8. Phân hệ kết quả tư vấn và cấp đơn thuốc điện tử

**Mục tiêu triển khai:** Sau phiên tư vấn, bác sĩ có thể ghi tóm tắt nội dung tư vấn và tạo đơn thuốc. Bệnh nhân có thể xem lại kết quả tư vấn, tóm tắt và đơn thuốc liên quan đến lịch hẹn của mình.

**Xây dựng phía giao diện người dùng (Frontend):** Bác sĩ sử dụng trang phiên tư vấn để lưu tóm tắt, kết thúc phiên và tạo đơn thuốc gồm nhiều mục thuốc. Bệnh nhân xem kết quả qua lịch sử tư vấn/lịch hẹn. Các API liên quan được gọi qua `doctor.api.ts` và `patient.api.ts`.

**Xây dựng phía máy chủ (Backend):** `ConsultationService` xử lý cập nhật tóm tắt phiên, kết thúc phiên, tạo đơn thuốc và lấy kết quả tư vấn. Khi kết thúc phiên, backend cập nhật cả `ConsultationSession` và `Appointment` trong cùng transaction.

**Tương tác dữ liệu và thực thể liên quan:** Dữ liệu chính gồm `ConsultationSession`, `Appointment`, `Prescription` và `PrescriptionItem`. Kết quả tư vấn trả về thông tin lịch hẹn, phiên tư vấn và đơn thuốc nếu đã có.

**Quy tắc nghiệp vụ cốt lõi:** Chỉ bác sĩ sở hữu phiên tư vấn mới được cập nhật tóm tắt và tạo đơn thuốc. Đơn thuốc chỉ được tạo sau khi lịch hẹn đã hoàn thành. Khi tạo lại đơn thuốc, hệ thống cập nhật bản ghi đơn thuốc và thay thế danh sách thuốc để dữ liệu không bị lặp.

**Giải pháp kỹ thuật nổi bật:** Tạo đơn thuốc dùng transaction với `upsert` cho `Prescription`, sau đó xóa và tạo lại `PrescriptionItem`. Cách này giúp mỗi phiên tư vấn chỉ có một đơn thuốc hiện hành.

## 5.9. Phân hệ đánh giá chất lượng tư vấn

**Mục tiêu triển khai:** Phân hệ đánh giá cho phép bệnh nhân phản hồi sau khi hoàn tất lịch tư vấn, đồng thời giúp bác sĩ và người dùng công khai xem chất lượng dịch vụ thông qua điểm đánh giá được hiển thị.

**Xây dựng phía giao diện người dùng (Frontend):** Bệnh nhân đánh giá từ lịch sử tư vấn sau khi lịch hẹn hoàn thành. Bác sĩ có trang xem các đánh giá hiển thị của mình. Trang khám phá bác sĩ công khai sử dụng điểm trung bình và số lượng đánh giá để hỗ trợ người dùng lựa chọn.

**Xây dựng phía máy chủ (Backend):** `ConsultationService` xử lý tạo đánh giá, lấy đánh giá của bệnh nhân, lấy đánh giá của bác sĩ và kiểm duyệt đánh giá. API đánh giá được bảo vệ theo vai trò bệnh nhân, bác sĩ hoặc quản trị viên tùy chức năng.

**Tương tác dữ liệu và thực thể liên quan:** Dữ liệu chính là `Rating`, liên kết với `PatientProfile`, `DoctorProfile` và `Appointment`. Thống kê công khai được lấy bằng aggregate trên các đánh giá có trạng thái hiển thị.

**Quy tắc nghiệp vụ cốt lõi:** Chỉ bệnh nhân sở hữu lịch hẹn mới được đánh giá. Lịch hẹn phải ở trạng thái hoàn thành. Mỗi lịch hẹn chỉ có một đánh giá. Đánh giá có thể được quản trị viên ẩn hoặc khôi phục thông qua phân hệ kiểm duyệt.

**Giải pháp kỹ thuật nổi bật:** Ràng buộc nghiệp vụ được kiểm tra trước khi tạo bản ghi `Rating`; backend cũng kiểm tra đánh giá trùng thông qua quan hệ duy nhất theo `appointmentId`.

## 5.10. Phân hệ quản lý và xử lý thông báo

**Mục tiêu triển khai:** Phân hệ thông báo ghi nhận và gửi các thông báo quan trọng như đặt lịch, xác nhận lịch, nhắc lịch, câu hỏi đã được trả lời và đặt lại mật khẩu.

**Xây dựng phía giao diện người dùng (Frontend):** Trong phiên bản hiện tại, frontend không có một phân hệ giao diện thông báo riêng biệt. Người dùng nhận phản hồi trực tiếp trong luồng thao tác, còn backend cung cấp API `/notifications` để người dùng lấy nhật ký thông báo của mình và API quản trị để xem nhật ký thông báo khi cần vận hành.

**Xây dựng phía máy chủ (Backend):** `NotificationController`, `AdminNotificationController`, `NotificationService` và `NotificationScheduler` triển khai xử lý thông báo. Service đọc sự kiện từ `OutboxEvent`, tạo `NotificationLog`, chọn provider phù hợp và cập nhật trạng thái gửi. Scheduler chạy nền để xử lý outbox và gửi nhắc lịch.

**Tương tác dữ liệu và thực thể liên quan:** Dữ liệu gồm `OutboxEvent`, `NotificationLog`, `Appointment`, `Question`, `PatientProfile`, `DoctorProfile` và `User`. Các sự kiện nghiệp vụ được ghi vào outbox trong transaction của nghiệp vụ chính, sau đó được xử lý bất đồng bộ.

**Quy tắc nghiệp vụ cốt lõi:** Một sự kiện chỉ nên tạo một thông báo cho cùng một người nhận và mục đích. Nhắc lịch được tạo cho cả bệnh nhân và bác sĩ đối với các lịch đã xác nhận trong khoảng thời gian cấu hình. Thông báo thất bại được đánh dấu `FAILED`, tăng số lần thử và có thời điểm thử lại.

**Giải pháp kỹ thuật nổi bật:** Hệ thống dùng Outbox Pattern để tách nghiệp vụ chính khỏi thao tác gửi thông báo. `NotificationLog` có `externalRef` để hỗ trợ tính idempotent; nếu thông báo đã gửi, service không gửi lại.

Đoạn mã sau minh họa xử lý idempotent của thông báo:

```ts
const log = await this.prisma.notificationLog.upsert({
  where: { externalRef: input.externalRef },
  create: {
    id: uuidv7(),
    userId: input.userId,
    type,
    content: input.content,
    externalRef: input.externalRef,
    status: NotificationStatus.PENDING,
    provider: provider.name,
  },
  update: {},
});

if (log.status === NotificationStatus.SENT) {
  return log;
}
```

## 5.11. Phân hệ quản trị hệ thống và kiểm duyệt nội dung

**Mục tiêu triển khai:** Phân hệ quản trị hỗ trợ quản lý người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, nội dung cần kiểm duyệt và trạng thái vận hành hệ thống.

**Xây dựng phía giao diện người dùng (Frontend):** Khu vực quản trị có dashboard, quản lý người dùng, bệnh nhân, bác sĩ, chuyên khoa, lịch hẹn, kiểm duyệt và báo cáo. `admin.api.ts` chuẩn hóa dữ liệu từ nhiều API backend để hiển thị dưới dạng bảng, bộ lọc và thao tác quản trị.

[INSERT FIGURE: ui-admin-dashboard.png]

Hình 5.4. Giao diện quản trị hệ thống

**Xây dựng phía máy chủ (Backend):** Backend cung cấp các controller quản trị như `AdminUserController`, các API admin trong phân hệ bác sĩ, chuyên khoa, lịch hẹn, thông báo và `ModerationController`. Tất cả API quản trị được bảo vệ bằng `JwtAuthGuard`, `RolesGuard` và vai trò `ADMIN`.

**Tương tác dữ liệu và thực thể liên quan:** Dữ liệu quản trị trải rộng trên `User`, `PatientProfile`, `DoctorProfile`, `Specialty`, `Appointment`, `Question`, `Answer`, `Rating`, `QuestionModeration`, `NotificationLog` và `AuditLog`.

**Quy tắc nghiệp vụ cốt lõi:** Quản trị viên có thể tạo/cập nhật/vô hiệu hóa tài khoản, duyệt bác sĩ, quản lý chuyên khoa, cập nhật trạng thái lịch hẹn và kiểm duyệt câu hỏi, câu trả lời, đánh giá. Các thay đổi quan trọng được ghi audit log để phục vụ truy vết.

**Giải pháp kỹ thuật nổi bật:** Phân hệ kiểm duyệt gom nhiều loại nội dung về một danh sách thống nhất gồm câu hỏi, câu trả lời và đánh giá. Khi quản trị viên thao tác, service cập nhật đúng bảng dữ liệu tương ứng và ghi nhận lịch sử kiểm duyệt hoặc audit log.

## 5.12. Phân hệ thống kê và báo cáo hoạt động

**Mục tiêu triển khai:** Phân hệ báo cáo cung cấp số liệu tổng quan cho quản trị viên về người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, câu hỏi, đánh giá và xu hướng tư vấn.

**Xây dựng phía giao diện người dùng (Frontend):** Trang báo cáo gọi `reports.api.ts` để lấy thống kê dashboard và dữ liệu xu hướng tư vấn. Dữ liệu được chuẩn hóa thành các chỉ số tổng hợp và điểm dữ liệu theo thời gian để hiển thị trên giao diện báo cáo.

**Xây dựng phía máy chủ (Backend):** `ReportingController` và `ReportingService` cung cấp API `/reports/dashboard` và `/reports/consultations/trend`. Các API này chỉ dành cho quản trị viên.

**Tương tác dữ liệu và thực thể liên quan:** Service tổng hợp dữ liệu từ `ConsultationSession`, `Appointment`, `User`, `DoctorProfile`, `Specialty`, `Question` và `Rating`. Bộ lọc thời gian được áp dụng cho lịch hẹn và phiên tư vấn.

**Quy tắc nghiệp vụ cốt lõi:** Tham số thời gian phải hợp lệ và mốc bắt đầu không được lớn hơn mốc kết thúc. Xu hướng tư vấn có thể được nhóm theo ngày, tháng hoặc tuần tùy tham số frontend gửi lên.

**Giải pháp kỹ thuật nổi bật:** Backend dùng các truy vấn `count`, `groupBy` và đọc danh sách phiên tư vấn để tạo bucket thời gian. Cách triển khai này phù hợp với phạm vi hiện tại vì dữ liệu báo cáo được tổng hợp trực tiếp từ cơ sở dữ liệu nghiệp vụ, không cần kho dữ liệu riêng.

**Tổng kết triển khai:** Phiên bản cài đặt cuối cùng triển khai đầy đủ các phân hệ chính của hệ thống tư vấn sức khỏe và quản lý lịch hẹn trực tuyến. Frontend được tổ chức theo nhóm chức năng và vai trò người dùng; backend được chia thành các module NestJS rõ ràng; dữ liệu được quản lý bằng PostgreSQL thông qua Prisma. Các cơ chế quan trọng như JWT, RBAC, transaction đặt lịch, realtime chat, outbox notification và audit log được sử dụng để đáp ứng yêu cầu nghiệp vụ, bảo mật và khả năng vận hành của hệ thống.

## 5.13 Tóm tắt phân hệ triển khai

Bảng 5.1. Tóm tắt phân hệ triển khai

| Phân hệ | Thành phần frontend chính | Thành phần backend chính | Dữ liệu chính |
|---|---|---|---|
| Xác thực và phân quyền | `src/features/auth/*` | `AuthController`, `AuthService`, guards | `User`, `UserSession`, `PasswordResetToken` |
| Khám phá công khai | `src/features/public/*` | `DiscoveryController`, `DiscoveryService` | `Specialty`, `DoctorProfile`, `Rating` |
| Hồ sơ người dùng | `src/features/patient/*`, `src/features/doctor/*` | `PatientService`, `DoctorService` | `PatientProfile`, `DoctorProfile` |
| Lịch hẹn | `src/features/patient/BookAppointmentPage.tsx` | `AppointmentController`, `AppointmentService` | `Appointment`, `DoctorSchedule` |
| Tư vấn và chat | `src/features/consultation/*` | `ConsultationGateway`, `ConsultationService` | `ConsultationSession`, `ConsultationMessage` |
| Đơn thuốc và kết quả | `src/features/consultation/ConsultationRoom.tsx` | `ConsultationService` | `Prescription`, `PrescriptionItem` |
| Quản trị và kiểm duyệt | `src/features/admin/*` | `AdminUserController`, `ModerationController` | `QuestionModeration`, `AuditLog` |
| Báo cáo | `src/features/reports/*` | `ReportingController`, `ReportingService` | `Appointment`, `ConsultationSession`, aggregate data |

# CHƯƠNG 6. KIỂM THỬ VÀ ĐÁNH GIÁ

Chương này trình bày hoạt động kiểm thử và đánh giá hệ thống dựa trên bằng chứng thực tế của dự án: mã nguồn test, kết quả chạy test tự động, kết quả build/type-check, ma trận E2E, audit truy vết SRS và các workflow CI có trong repository. Các kết quả chỉ được ghi nhận là đạt khi có bằng chứng cụ thể; các nội dung chưa có kiểm thử tự động hoặc chưa có kết quả chạy được nêu rõ là chưa xác minh đầy đủ.

## 6.1 Mục tiêu kiểm thử

Mục tiêu kiểm thử của hệ thống gồm:

- Xác minh các luồng nghiệp vụ chính: khám phá bác sĩ, xác thực, đặt lịch, hỏi đáp sức khỏe, tư vấn trực tuyến, kết quả tư vấn, đơn thuốc, đánh giá, quản trị và báo cáo.
- Kiểm tra các quy tắc bảo mật quan trọng: xác thực JWT, refresh token, phân quyền theo vai trò, kiểm tra quyền sở hữu dữ liệu và che giấu thông tin nhạy cảm.
- Kiểm tra tính đúng đắn của các quy tắc đặt lịch: lịch làm việc của bác sĩ, khung giờ khả dụng, chống trùng lịch của bác sĩ và bệnh nhân.
- Kiểm tra các thành phần nền như thông báo, outbox, nhắc lịch và xử lý lỗi provider.
- Đối chiếu mức độ đáp ứng yêu cầu SRS bằng ma trận truy vết và ma trận E2E.

## 6.2 Môi trường kiểm thử

Theo tài liệu `docs/testing/final-e2e-results.md`, môi trường E2E cuối cùng được ghi nhận ngày 2026-08-20 gồm:

- Backend: `OnlineHealthConsultation-Service`
- Frontend: `OnlineHealthConsultation-Web`
- Database: Docker PostgreSQL container `health_consultation_db`
- Backend URL: `http://localhost:4000/api`
- Frontend URL: `http://localhost:5173`
- Browser runner: Playwright Chromium
- Seed mode: `E2E_RUN_SEEDED=true`

Trong lần kiểm tra bổ sung ngày 2026-08-22, các lệnh kiểm thử và build được chạy trong môi trường local sau khi nạp Node qua `nvm`. Lệnh `npm` không có sẵn trực tiếp trong shell ban đầu, nhưng chạy được sau khi thực hiện `source ~/.nvm/nvm.sh`.

## 6.3 Phương pháp kiểm thử

Hệ thống sử dụng kết hợp các phương pháp sau:

- **Unit test và service-level test:** kiểm tra logic trong các service/controller backend bằng Jest, chủ yếu với mock Prisma hoặc mock dependency.
- **Integration-oriented test ở tầng service:** kiểm tra luồng nhiều thao tác liên quan trong một service, ví dụ transaction đặt lịch, refresh session rotation, notification outbox và moderation audit.
- **End-to-End test:** sử dụng Playwright để kiểm tra các luồng người dùng chính trên giao diện web và API backend đang chạy thật trong môi trường local có seed data.
- **Build và type-check:** sử dụng TypeScript compiler, Nest build và Vite build để xác minh mã nguồn có thể biên dịch.
- **Traceability audit:** đối chiếu yêu cầu SRS với hiện trạng implementation và automation trong `docs/audit/final-srs-traceability.md` và `docs/testing/e2e-test-matrix.md`.

## 6.4. Phương pháp tiếp cận kiểm thử đơn vị, kiểm thử tích hợp và kiểm thử đầu cuối

Backend có các test Jest trong các file:

- `src/modules/appointment/appointment.service.spec.ts`
- `src/modules/identity/auth.service.spec.ts`
- `src/modules/identity/auth.controller.spec.ts`
- `src/modules/notification/notification.service.spec.ts`
- `src/modules/moderation/moderation.service.spec.ts`
- `src/modules/reporting/reporting.service.spec.ts`
- `src/modules/doctor/doctor.service.spec.ts`
- `src/common/config/validate-env.spec.ts`
- `src/common/filters/http-exception.filter.spec.ts`

Frontend có các Playwright specs trong `OnlineHealthConsultation-Web/e2e/specs`, gồm public discovery, auth, patient appointment, patient question, doctor workflow, admin, consultation socket client và graduation flows.

CI workflow có trong repository:

- Backend CI: `.github/workflows/be-ci.yml`, chạy `npm ci`, `npm run prisma:generate`, `npm run test`, `npm run build`.
- Frontend CI: `.github/workflows/fe-ci.yml`, chạy format check, lint, type-check và build.

Quy trình tích hợp liên tục (CI) đã được định cấu hình bằng GitHub Actions cho cả hai phân hệ frontend và backend. Tuy nhiên, do môi trường kiểm thử thực tế phục vụ đồ án được thực thi và đánh giá cục bộ, phần này chỉ ghi nhận cấu hình kiểm tra tự động mà không đưa ra kết luận về việc thực thi trên máy chủ CI đám mây.

## 6.5 Bộ test case tiêu biểu

Bảng 6.1. Bộ test case tiêu biểu

| ID | Kịch bản kiểm thử | Kết quả kỳ vọng | Kết quả thực tế | Đánh giá |
| -- | -------- | -------- | ------ | ------ |
| TC-AUTH-01 | Đăng nhập và lưu refresh token bằng HttpOnly cookie | Phản hồi không chứa refresh token trong thân body; cookie refresh được thiết lập an toàn | `auth.controller.spec.ts` vượt qua trong bộ Jest | Đạt |
| TC-AUTH-02 | Refresh token hợp lệ | Cấp access token mới, xoay vòng phiên refresh token | `auth.service.spec.ts` vượt qua trong bộ Jest | Đạt |
| TC-APPT-01 | Lấy khung giờ khả dụng từ lịch làm việc bác sĩ | Chỉ trả về khung giờ hợp lệ trong tương lai | `appointment.service.spec.ts` vượt qua trong bộ Jest | Đạt |
| TC-APPT-02 | Đặt lịch trùng bác sĩ hoặc bệnh nhân | Máy chủ từ chối lịch hẹn bị trùng lặp thời gian | `appointment.service.spec.ts` vượt qua trong bộ Jest | Đạt |
| TC-NOTI-01 | Xử lý sự kiện outbox khi tạo lịch hẹn | Khởi tạo bản ghi thông báo cho bệnh nhân và bác sĩ | `notification.service.spec.ts` vượt qua trong bộ Jest | Đạt |
| TC-NOTI-02 | Cổng gửi thông báo gặp lỗi | Bản ghi outbox được đánh dấu thất bại và cho phép thử lại | `notification.service.spec.ts` vượt qua kịch bản ngoại lệ | Đạt |
| TC-MOD-01 | Quản trị viên ẩn câu hỏi vi phạm và ghi nhật ký kiểm toán | Trạng thái nội dung chuyển đổi và nhật ký audit log được lưu | `moderation.service.spec.ts` vượt qua trong bộ Jest | Đạt |
| TC-REPORT-01 | Thống kê số liệu bảng điều khiển theo khoảng thời gian | Trả về dữ liệu tổng hợp hợp lệ | `reporting.service.spec.ts` vượt qua trong bộ Jest | Đạt |
| TC-E2E-CORE | Bộ kiểm thử đầu cuối cho các luồng nghiệp vụ cốt lõi | Các luồng chính thực thi trên môi trường có dữ liệu mẫu | 42/43 kịch bản hoàn thành thành công | Đạt một phần |
| TC-GRAD | Toàn bộ chuỗi kịch bản tốt nghiệp tổng hợp | Hoàn thành toàn diện các kịch bản liên thông | Kịch bản GRAD-D đạt độc lập; GRAD-A/B/C còn tồn tại điểm nghẽn tương tác dữ liệu | Chưa đạt |

## 6.6. Kiểm thử các luồng thao tác người dùng chính

Kết quả E2E lõi trong `docs/testing/final-e2e-results.md` ghi nhận lệnh Playwright chạy các suite:

- `public.spec.ts`
- `auth.spec.ts`
- `patient-appointments.spec.ts`
- `patient-questions.spec.ts`
- `doctor-workflow.spec.ts`
- `admin.spec.ts`
- `consultation-socket-client.spec.ts`

Kết quả ghi nhận:

| Nhóm flow | Bằng chứng | Kết quả |
| -- | -- | -- |
| Public discovery | `public.spec.ts`, E2E-001 đến E2E-005 | Nằm trong 42 test core đã pass |
| Auth theo vai trò | `auth.spec.ts`, E2E-006 đến E2E-012 và các test page auth | Nằm trong 42 test core đã pass |
| Patient appointment | `patient-appointments.spec.ts`, E2E-013 đến E2E-017 | Nằm trong 42 test core đã pass |
| Patient question và doctor answer | `patient-questions.spec.ts`, E2E-018 đến E2E-023 | Nằm trong 42 test core đã pass |
| Doctor consultation/prescription workflow | `doctor-workflow.spec.ts`, E2E-024 đến E2E-029 | Nằm trong 42 test core đã pass |
| Admin dashboard/doctor/specialty/access guard | `admin.spec.ts`, E2E-030 đến E2E-035 | Nằm trong 42 test core đã pass |
| Socket client behavior | `consultation-socket-client.spec.ts` | Nằm trong 42 test core đã pass |

Graduation suite trong `graduation-flows.spec.ts` chưa được tính là pass. Theo `final-e2e-results.md`, các lỗi được phân loại là lỗi test-data, test interaction hoặc mismatch assertion, không phải bằng chứng lỗi nghiệp vụ backend. Vì vậy chương này không dùng graduation suite để khẳng định hệ thống đã pass toàn bộ luồng graduation.

## 6.7. Kiểm thử cơ chế xác thực và phân quyền

Authentication và RBAC được kiểm thử ở cả backend và frontend:

- `auth.service.spec.ts` kiểm tra refresh session rotation, reject token không hợp lệ, reject session đã thu hồi/hết hạn, logout revoke session, forgot password không leak trạng thái email, reset password tiêu thụ token và revoke session.
- `auth.controller.spec.ts` kiểm tra hợp đồng cookie refresh: set cookie HttpOnly khi login, đọc cookie khi refresh, clear cookie khi logout và secure cookie trong production.
- `auth.spec.ts` kiểm tra đăng nhập theo vai trò Patient/Doctor/Admin, guest bị chuyển về login khi mở route bảo vệ, patient/doctor không truy cập được route sai vai trò và logout.
- `admin.spec.ts` có test non-admin không truy cập được admin dashboard.

| ID | Kịch bản kiểm thử | Kết quả kỳ vọng | Kết quả thực tế | Đánh giá |
| -- | -------- | -------- | ------ | ------ |
| AUTH-RBAC-01 | Bệnh nhân đăng nhập | Điều hướng về bảng điều khiển bệnh nhân | Ghi nhận đạt trong `auth.spec.ts` | Đạt |
| AUTH-RBAC-02 | Bác sĩ đăng nhập | Điều hướng về bảng điều khiển bác sĩ | Ghi nhận đạt trong `auth.spec.ts` | Đạt |
| AUTH-RBAC-03 | Quản trị viên đăng nhập | Điều hướng về bảng điều khiển quản trị | Ghi nhận đạt trong `auth.spec.ts` | Đạt |
| AUTH-RBAC-04 | Khách mở tuyến đường yêu cầu vai trò bệnh nhân | Bị điều hướng về trang đăng nhập | Ghi nhận đạt trong `auth.spec.ts` | Đạt |
| AUTH-RBAC-05 | Bệnh nhân hoặc Bác sĩ mở tuyến đường sai quyền | Bị chặn truy cập hoặc chuyển sang trạng thái từ chối (403) | Ghi nhận đạt trong `auth.spec.ts` | Đạt |
| AUTH-RBAC-06 | Xoay vòng phiên refresh token | Phiên cũ bị thu hồi, phiên hợp lệ mới được cấp | Vượt qua kiểm thử trong Jest | Đạt |

Các kiểm thử chưa đầy đủ: frontend chưa có bằng chứng E2E cho refresh-token retry/dedup khi nhiều request đồng thời nhận `401`; ma trận E2E đánh dấu nội dung này là `Missing`.

## 6.8. Kiểm thử tính khả dụng và ngăn chặn xung đột lịch hẹn

Kiểm thử đặt lịch tập trung vào `appointment.service.spec.ts` và `patient-appointments.spec.ts`.

Các tình huống backend đã được Jest kiểm tra gồm:

- Trả slot khả dụng từ lịch làm việc bác sĩ.
- Loại bỏ slot overlap với lịch hẹn đang hoạt động của bác sĩ.
- Từ chối lookup nếu bác sĩ không public.
- Từ chối tạo lịch ngoài giờ làm việc.
- Từ chối tạo lịch khi bác sĩ có lịch overlap.
- Từ chối tạo lịch khi bệnh nhân có lịch overlap.
- Cho phép lịch sát ranh giới khi lịch cũ kết thúc đúng lúc lịch mới bắt đầu.
- Từ chối bác sĩ inactive hoặc chưa approved.
- Áp dụng quy tắc conflict khi reschedule.

| ID | Kịch bản kiểm thử | Kết quả kỳ vọng | Kết quả thực tế | Đánh giá |
| -- | -------- | -------- | ------ | ------ |
| APPT-AV-01 | Lịch làm việc bác sĩ có khung giờ hợp lệ | API trả về danh sách khung giờ khả dụng | Vượt qua kiểm thử trong Jest | Đạt |
| APPT-AV-02 | Khung giờ trùng lịch đã có của bác sĩ | Khung giờ bị loại khỏi danh sách khả dụng | Vượt qua kiểm thử trong Jest | Đạt |
| APPT-AV-03 | Tạo lịch hẹn ngoài giờ làm việc | Máy chủ từ chối yêu cầu | Vượt qua kiểm thử trong Jest | Đạt |
| APPT-AV-04 | Tạo lịch hẹn trùng thời gian với bác sĩ | Máy chủ từ chối yêu cầu | Vượt qua kiểm thử trong Jest | Đạt |
| APPT-AV-05 | Tạo lịch hẹn trùng thời gian với bệnh nhân | Máy chủ từ chối yêu cầu | Vượt qua kiểm thử trong Jest | Đạt |
| APPT-AV-06 | Bệnh nhân đặt lịch hợp lệ qua giao diện | Lịch hẹn được tạo và hiển thị trong danh mục | Ghi nhận đạt trong Playwright | Đạt |

Ma trận E2E vẫn đánh dấu UI negative case cho slot không khả dụng là `Partial`, vì phần backend đã được kiểm thử nhưng chưa có test giao diện đầy đủ cho thao tác chọn slot không hợp lệ.

## 6.9. Kiểm thử tư vấn trực tuyến thời gian thực

Tư vấn trực tuyến được kiểm thử qua hai nhóm bằng chứng:

- `doctor-workflow.spec.ts` kiểm tra bác sĩ có thể mở route phiên tư vấn, lưu summary, tạo prescription và bệnh nhân xem kết quả/đơn thuốc khi có dữ liệu.
- `consultation-socket-client.spec.ts` kiểm tra client Socket.IO xác thực bằng access token, join room theo appointment, gửi message, reconnect vào cùng room, cleanup listener và xử lý thiếu access token.

| ID | Kịch bản kiểm thử | Kết quả kỳ vọng | Kết quả thực tế | Đánh giá |
| -- | -------- | -------- | ------ | ------ |
| CONSULT-01 | Doctor mở phiên tư vấn từ appointment | Route/session được mở hợp lệ | Core E2E ghi nhận pass trong `doctor-workflow.spec.ts` | PASS |
| CONSULT-02 | Doctor lưu consultation summary | Summary được lưu và có thể xem lại | Core E2E ghi nhận pass trong `doctor-workflow.spec.ts` | PASS |
| CONSULT-03 | Doctor tạo prescription | Prescription được lưu | Core E2E ghi nhận pass trong `doctor-workflow.spec.ts` | PASS |
| CONSULT-04 | Patient xem result/prescription | Kết quả và đơn thuốc hiển thị cho bệnh nhân | Core E2E ghi nhận pass trong `doctor-workflow.spec.ts` | PASS |
| CONSULT-05 | Socket client join/send/reconnect | Client join đúng room, gửi message, reconnect không nhân listener | Core E2E ghi nhận pass trong `consultation-socket-client.spec.ts` | PASS |

Giới hạn hiện tại: chưa có bằng chứng E2E hai browser context đầy đủ cho bệnh nhân và bác sĩ trao đổi realtime trực tiếp trên hai giao diện đang mở cùng lúc. Ma trận E2E đánh dấu luồng này là `Partial`.

## 6.10. Kiểm thử xử lý thông báo và tác vụ nền

Notification được kiểm thử chủ yếu bằng backend Jest trong `notification.service.spec.ts`. Các tình huống đã có bằng chứng gồm:

- Lưu thông báo reset password bằng development provider khi chưa cấu hình email thật.
- Không lưu plain reset token trong production khi provider email không hoạt động.
- Xử lý outbox `APPOINTMENT_CREATED` thành thông báo cho bệnh nhân và bác sĩ.
- Đánh dấu outbox failed và retryable khi provider gửi thất bại.
- Gửi appointment reminder qua provider và ghi trạng thái notification.
- Xử lý outbox `QUESTION_ANSWERED` thành thông báo cho bệnh nhân.

| ID | Kịch bản kiểm thử | Kết quả kỳ vọng | Kết quả thực tế | Đánh giá |
| -- | -------- | -------- | ------ | ------ |
| NOTI-01 | Xử lý sự kiện tạo lịch hẹn | Tạo thông báo cho bệnh nhân và bác sĩ | Vượt qua kiểm thử trong Jest | Đạt |
| NOTI-02 | Sự cố gửi thông báo từ cổng ngoài | Đánh dấu thất bại, tăng số lần thử lại | Vượt qua kiểm thử trong Jest | Đạt |
| NOTI-03 | Nhắc nhở lịch hẹn sắp tới | Ghi nhận và gửi thông báo nhắc lịch | Vượt qua kiểm thử trong Jest | Đạt |
| NOTI-04 | Xử lý sự kiện câu hỏi được phản hồi | Tạo thông báo cho bệnh nhân gửi câu hỏi | Vượt qua kiểm thử trong Jest | Đạt |

Giới hạn hiện tại: hệ thống chưa kích hoạt việc gửi thư điện tử thương mại thực tế; ma trận truy vết đánh giá phân hệ thông báo đạt một phần (PARTIAL) do lớp trừu tượng hóa dịch vụ đã hoàn thành nhưng việc chuyển phát thực tế còn phụ thuộc vào thông số cấu hình triển khai.

## 6.11 Kết quả kiểm thử

Kết quả chạy bổ sung ngày 2026-08-22:

Bảng 6.2. Kết quả kiểm thử tổng hợp

| Nhóm kiểm tra | Lệnh thực thi | Kết quả thực tế | Đánh giá |
| -- | -- | -- | -- |
| Backend Jest | `source ~/.nvm/nvm.sh && npm test -- --runInBand` | 9 bộ kiểm thử thành công, 47 ca kiểm thử đạt, 0 lỗi | Đạt |
| Backend type-check | `source ~/.nvm/nvm.sh && npm run type-check` | Lệnh `tsc --noEmit` hoàn tất không có lỗi | Đạt |
| Backend build | `source ~/.nvm/nvm.sh && npm run build` | Lệnh `nest build` biên dịch thành công | Đạt |
| Frontend type-check | `source ~/.nvm/nvm.sh && npm run type-check` | Lệnh `tsc --noEmit` hoàn tất không có lỗi | Đạt |
| Frontend build | `source ~/.nvm/nvm.sh && npm run build` | Đóng gói sản phẩm hoàn tất | Đạt |

Ghi chú từ output:

- Backend Jest có cảnh báo `ts-jest` về hybrid module kind và `isolatedModules`; cảnh báo này không làm test fail.
- Trong `notification.service.spec.ts` có log lỗi `Email failed` từ tình huống test provider failure; đây là hành vi được kiểm thử, không phải lỗi ngoài ý muốn.
- Frontend build có cảnh báo Browserslist data cũ và một số chunk lớn hơn 500 kB sau minification; build vẫn thành công.

Kết quả E2E đã ghi nhận trong `docs/testing/final-e2e-results.md`:

| Nhóm E2E | Actual | Result |
| -- | -- | -- |
| Core smoke/auth/appointment/question/doctor/admin/socket suites | Total 43, Passed 42, Failed 0, Skipped 1 | PARTIAL |
| Graduation suite dry run không có seed env | Total 4, Skipped 4 | NOT VERIFIED |
| Graduation suite với seed env | 1 failed, 1 flaky, 2 did not run; isolated `GRAD-D` passed | NOT PASS |

## 6.12 Độ bao phủ yêu cầu SRS

Theo `docs/audit/final-srs-traceability.md`, phần lớn core flows bắt buộc đã có implementation end-to-end, gồm public doctor discovery, auth, patient profile, health questions, doctor schedule availability, appointment booking/conflict prevention, consultation session, realtime chat, result/prescription, rating, admin management, moderation, notification outbox và reporting.

Tổng hợp theo nhóm:

Bảng 6.3. Mức độ bao phủ yêu cầu SRS

| Nhóm yêu cầu chức năng | Mức độ đáp ứng theo ma trận truy vết | Bằng chứng kiểm thử liên quan |
| -- | -- | -- |
| Public access và doctor discovery | Chủ yếu đã hoàn thành | `public.spec.ts`; discovery implementation audit |
| Authentication/Authorization | Hoàn thành | `auth.service.spec.ts`, `auth.controller.spec.ts`, `auth.spec.ts`, security audit |
| Patient/Doctor profile | Hoàn thành (có điều chỉnh định dạng tên) với cách lưu full name | Backend doctor tests; patient profile implementation có trong audit nhưng patient profile E2E còn missing |
| Health question | Hoàn thành | `patient-questions.spec.ts`, notification/question audit |
| Appointment management | Hoàn thành | `appointment.service.spec.ts`, `patient-appointments.spec.ts`, doctor workflow specs |
| Consultation realtime | Hoàn thành về implementation; E2E automation `Partial` cho hai-browser realtime | `doctor-workflow.spec.ts`, `consultation-socket-client.spec.ts` |
| Result/prescription | Hoàn thành | `doctor-workflow.spec.ts` |
| Rating | Hoàn thành về implementation; rating positive/negative E2E còn missing trong matrix | Traceability, moderation tests |
| Notification/reminder | Core outbox/log/reminder Hoàn thành; email thật `PARTIAL` | `notification.service.spec.ts`; no production email evidence |
| Admin/moderation/reporting | Hoàn thành | `admin.spec.ts`, `moderation.service.spec.ts`, `reporting.service.spec.ts` |
| Non-functional performance/availability/browser matrix | Nhiều mục `PARTIAL` | Chưa có load test, HA test hoặc cross-browser result artifact |
| Optional/out-of-scope items | `NOT_APPLICABLE` hoặc `NOT_IMPLEMENTED` | File upload, chatbot, SMS/video advanced không thuộc scope bắt buộc hoặc chưa triển khai |

Các yêu cầu đã triển khai nhưng chưa có automated test đầy đủ theo `e2e-test-matrix.md` gồm: patient profile update E2E, inactive/unapproved doctor negative discovery, live consultation hai browser context, rating positive/negative E2E, admin moderation UI đầy đủ, reports page date-range/chart E2E, refresh-token retry/dedup frontend integration, cross-user consultation result access denial, mobile responsive smoke test.

## 6.13 Đánh giá hệ thống

Dựa trên các bằng chứng hiện có, hệ thống đạt mức sẵn sàng tốt cho các luồng nghiệp vụ cốt lõi:

- Backend unit/service tests hiện pass toàn bộ: 9 suites, 47 tests.
- Backend và frontend đều type-check/build thành công trong lần kiểm tra ngày 2026-08-22.
- Core E2E đã ghi nhận 42/43 test pass, không có test failed trong bộ core.
- Các quy tắc nghiệp vụ rủi ro cao như refresh-token rotation, cookie contract, appointment conflict, notification outbox retry, moderation audit và report date validation đã có test backend trực tiếp.
- Audit bảo mật ghi nhận các cơ chế quan trọng đã có: global validation, exception filter, security headers cơ bản, CORS theo môi trường, JWT secret validation, refresh cookie rules, RBAC, ownership checks, sensitive logging sanitation và appointment transaction safety.

Tuy nhiên, mức đánh giá này không đồng nghĩa với việc toàn bộ hệ thống đã được chứng minh bằng automation tuyệt đối. Một số yêu cầu đã có implementation nhưng test tự động còn một phần; một số yêu cầu phi chức năng chưa có artifact đo lường.

## 6.14 Hạn chế hiện tại

Các hạn chế hiện tại được ghi nhận từ bằng chứng thực tế:

- Graduation E2E suite chưa thể claim PASS. `GRAD-A`, `GRAD-B`, `GRAD-C` còn vấn đề test-data, test interaction hoặc assertion mismatch; chỉ `GRAD-D` pass khi chạy isolation.
- Core E2E có 1 test skipped; kịch bản này chưa được ghi nhận là đạt (PASS).
- Chưa có coverage percentage artifact, vì vậy báo cáo không công bố tỷ lệ coverage.
- Chưa có benchmark performance, load test hoặc concurrency test; các yêu cầu thời gian phản hồi, concurrent usage và dashboard performance chỉ ở mức `PARTIAL`.
- Chưa có bằng chứng kiểm thử cross-browser hoặc mobile responsive đầy đủ.
- Chưa có E2E hai trình duyệt cho realtime chat bệnh nhân-bác sĩ trong cùng phiên live.
- Chưa kết nối dịch vụ gửi email thương mại thực tế; việc gửi thông báo thực tế phụ thuộc cấu hình nhà cung cấp dịch vụ khi triển khai.
- Chưa có kết quả CI run trong repository; chỉ có workflow CI configuration.
- File upload/storage, chatbot và advanced SMS/video không thuộc phạm vi bắt buộc hoặc chưa triển khai đầy đủ theo traceability.

# CHƯƠNG 7. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

Chương này tổng kết kết quả đạt được của đề tài **“Thiết kế và xây dựng hệ thống hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến”**, đánh giá mức độ đáp ứng mục tiêu ban đầu, nêu các hạn chế còn tồn tại và đề xuất hướng phát triển phù hợp cho các giai đoạn tiếp theo. Nội dung được phân biệt rõ giữa hệ thống đã triển khai hiện tại và các khả năng phát triển trong tương lai.

## 7.1 Kết quả đạt được

Trong phạm vi đề tài, hệ thống đã được phân tích, thiết kế, xây dựng và kiểm thử theo hướng một ứng dụng web hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến. Hệ thống hiện tại đã triển khai các nhóm chức năng chính cho bốn nhóm người dùng: khách truy cập, bệnh nhân, bác sĩ và quản trị viên.

Đối với khách truy cập, hệ thống hỗ trợ xem thông tin công khai, danh sách chuyên khoa, danh sách bác sĩ, tìm kiếm/lọc bác sĩ và xem hồ sơ công khai của bác sĩ. Các bác sĩ hiển thị công khai được giới hạn theo trạng thái hoạt động và trạng thái phê duyệt.

Đối với bệnh nhân, hệ thống hỗ trợ đăng ký, đăng nhập, quản lý hồ sơ sức khỏe, gửi câu hỏi sức khỏe, đặt lịch tư vấn theo khung giờ khả dụng, xem lịch hẹn, tham gia tư vấn trực tuyến, xem kết quả tư vấn, xem đơn thuốc và đánh giá sau tư vấn.

Đối với bác sĩ, hệ thống hỗ trợ quản lý hồ sơ chuyên môn, lịch làm việc, chuyên khoa, xem và trả lời câu hỏi, xác nhận/hoàn tất lịch hẹn, tham gia phiên tư vấn, ghi tóm tắt tư vấn và tạo đơn thuốc điện tử cơ bản.

Đối với quản trị viên, hệ thống hỗ trợ quản lý người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, kiểm duyệt nội dung, theo dõi thông báo và xem báo cáo thống kê hoạt động.

Ngoài các chức năng nghiệp vụ, hệ thống cũng đã có các cơ chế hỗ trợ quan trọng như xác thực JWT, refresh session, RBAC, kiểm tra quyền sở hữu dữ liệu, validation đầu vào, audit log, transaction trong nghiệp vụ đặt lịch, Socket.IO cho chat realtime và Outbox Pattern cho thông báo.

## 7.2 Mức độ đáp ứng mục tiêu đề tài

So với mục tiêu đề tài đã nêu ở Chương 1, hệ thống hiện tại đáp ứng được phần lớn mục tiêu cốt lõi:

Bảng 7.1. Mức độ đáp ứng mục tiêu đề tài

| Mục tiêu | Mức độ đáp ứng hiện tại |
|---|---|
| Xây dựng ứng dụng web hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn | Đã triển khai với frontend React SPA, backend NestJS và PostgreSQL |
| Hỗ trợ truy cập công khai, tìm kiếm chuyên khoa/bác sĩ | Đã triển khai và có E2E core evidence |
| Hỗ trợ đăng ký, đăng nhập, đăng xuất, khôi phục mật khẩu và phân quyền | Đã triển khai, có backend Jest và Playwright evidence |
| Hỗ trợ bệnh nhân quản lý hồ sơ, hỏi đáp, đặt lịch, theo dõi tư vấn | Đã triển khai; một số E2E chi tiết còn cần mở rộng |
| Hỗ trợ bác sĩ quản lý hồ sơ, lịch làm việc, câu hỏi, lịch hẹn và tư vấn | Đã triển khai, có test cho các luồng chính |
| Hỗ trợ chat trong phiên tư vấn và lưu lịch sử trao đổi | Đã triển khai; socket client đã được kiểm thử, E2E hai trình duyệt đầy đủ còn thiếu |
| Hỗ trợ kết quả tư vấn, đơn thuốc cơ bản và đánh giá | Đã triển khai; prescription/result có E2E, rating cần bổ sung automation |
| Hỗ trợ quản trị, kiểm duyệt và báo cáo | Đã triển khai, có backend và một phần E2E evidence |
| Đảm bảo yêu cầu bảo mật và kiểm soát truy cập cơ bản | Đã triển khai các cơ chế chính; một số yêu cầu phi chức năng cần kiểm thử sâu hơn |

Như vậy, đề tài đã hoàn thành mục tiêu chính là xây dựng một hệ thống web hỗ trợ quy trình tư vấn sức khỏe và quản lý lịch hẹn từ khâu tra cứu, đặt lịch, tư vấn, ghi nhận kết quả đến quản trị. Hệ thống không được thiết kế để thay thế chẩn đoán y khoa chuyên nghiệp, cấp cứu y tế hoặc quy trình khám trực tiếp khi cần thiết.

## 7.3 Kết quả kỹ thuật

Hệ thống hiện tại được xây dựng theo mô hình Client–Server với frontend React SPA, backend NestJS Modular Monolith và cơ sở dữ liệu PostgreSQL thông qua Prisma ORM. Kiến trúc này phù hợp với phạm vi đồ án vì giúp tổ chức chức năng theo module rõ ràng, dễ kiểm thử và thuận lợi khi các nghiệp vụ có quan hệ chặt chẽ trên cùng cơ sở dữ liệu.

Các kết quả kỹ thuật chính gồm:

- Frontend được tổ chức theo nhóm chức năng như `auth`, `public`, `patient`, `doctor`, `admin`, `reports` và `consultation/realtime`.
- Backend được tổ chức thành các module nghiệp vụ như Identity, Discovery, Patient, Doctor, Appointment, Question, Consultation, Notification, Moderation và Reporting.
- Cơ sở dữ liệu có mô hình quan hệ cho người dùng, hồ sơ, chuyên khoa, lịch hẹn, phiên tư vấn, tin nhắn, đơn thuốc, đánh giá, thông báo và audit log.
- Xác thực sử dụng JWT access token và refresh token lưu qua HttpOnly cookie.
- Phân quyền được thực hiện bằng guard theo vai trò và kiểm tra quyền sở hữu ở tầng service.
- Đặt lịch sử dụng kiểm tra lịch làm việc, kiểm tra overlap và transaction để bảo vệ tính nhất quán.
- Tư vấn trực tuyến sử dụng Socket.IO namespace cho phiên chat realtime.
- Thông báo sử dụng Outbox Pattern, `NotificationLog` và provider boundary để tách nghiệp vụ chính khỏi quá trình gửi thông báo.
- Báo cáo quản trị sử dụng các truy vấn tổng hợp và xu hướng theo thời gian.

Về kiểm thử, kết quả ghi nhận ở Chương 6 cho thấy backend Jest pass 9 test suites với 47 tests, backend type-check/build pass, frontend type-check/build pass. Core E2E đã ghi nhận 42/43 test pass, 0 failed và 1 skipped. chuỗi kiểm thử tốt nghiệp (Graduation E2E) chưa đạt kết quả trọn vẹn do còn tồn tại các vấn đề về dữ liệu kiểm thử và tương tác phần tử giao diện.

## 7.4 Hạn chế hiện tại

Các nội dung dưới đây phản ánh giới hạn hiện tại của hệ thống trong phạm vi đề tài, chưa đạt đến mức độ hoàn thiện phục vụ môi trường vận hành thực tế thương mại:

- Chưa tích hợp cổng dịch vụ gửi thư điện tử thương mại chính thức. Hệ thống đã xây dựng lớp cổng giao tiếp trừu tượng và bộ điều phối nội bộ, việc chuyển phát thư thực tế phụ thuộc tham số cấu hình hạ tầng.
- Chức năng nhắc lịch qua tin nhắn viễn thông (SMS) chưa được kết nối với nhà mạng thực tế; cổng dịch vụ SMS hiện là thành phần mở rộng tùy chọn.
- Chức năng tư vấn qua video hiện dừng lại ở mức giao diện mô phỏng và cơ chế kết nối dự phòng; hệ thống tập trung xác minh và hoàn thiện trên kênh trao đổi tin nhắn trực tiếp thời gian thực.
- Phân hệ quản lý tệp đính kèm và lưu trữ đối tượng chưa được triển khai thành luồng giao diện người dùng hoàn chỉnh; hệ thống hiện chỉ lưu trữ lược đồ dữ liệu dự phòng cho việc mở rộng.
- Một số yêu cầu phi chức năng như kiểm thử tải đồng thời, tính sẵn sàng cao (High Availability), độ tương thích đa trình duyệt chi tiết chưa được đo lường bằng bộ công cụ chuyên dụng.
- Chưa triển khai kịch bản kiểm thử đầu cuối đồng thời trên hai phiên trình duyệt độc lập cho luồng trao đổi tin nhắn trực tiếp giữa bệnh nhân và bác sĩ.
- Một số luồng đã có implementation nhưng automation còn thiếu hoặc chưa đầy đủ, như patient profile update E2E, rating positive/negative E2E, admin moderation UI đầy đủ, reports date-range/chart E2E và cross-user consultation result access denial.
- Graduation E2E suite cần chỉnh lại dữ liệu test và tương tác test trước khi có thể dùng làm bằng chứng pass đầy đủ.
- Chưa có artifact kết quả chạy CI trong repository; hiện chỉ có workflow configuration.

Các hạn chế này không phủ nhận kết quả của các luồng cốt lõi đã triển khai, nhưng cần được ghi nhận để đánh giá đúng mức độ hoàn thiện và phạm vi kiểm chứng của hệ thống.

## 7.5 Bài học kinh nghiệm

Quá trình thực hiện đề tài đem lại một số bài học quan trọng:

- Việc xác định rõ phạm vi ngay từ đầu giúp hệ thống tập trung vào các nghiệp vụ cốt lõi như tìm bác sĩ, đặt lịch, tư vấn, kết quả và quản trị, tránh mở rộng quá sớm sang các tích hợp phức tạp.
- Tài liệu SRS và traceability matrix giúp kiểm soát sự nhất quán giữa yêu cầu, thiết kế, cài đặt và kiểm thử. Khi có khác biệt giữa yêu cầu và implementation, cần ghi nhận rõ thay vì điều chỉnh yêu cầu một cách ngầm định.
- Modular Monolith là lựa chọn phù hợp cho hệ thống có nhiều phân hệ liên quan chặt chẽ, đặc biệt khi cần transaction chung đồng thời đơn giản hóa quy trình đóng gói và vận hành thử nghiệm.
- Các nghiệp vụ liên quan đến lịch hẹn cần được kiểm tra nghiêm ngặt ở backend, vì chỉ kiểm tra ở giao diện là không đủ để ngăn đặt trùng hoặc thao tác ngoài lịch làm việc.
- Với các chức năng bảo mật, frontend guard chỉ cải thiện trải nghiệm người dùng; lớp bảo vệ quyết định vẫn phải nằm ở backend thông qua guard, role check và ownership check.
- Các cơ chế bất đồng bộ như notification outbox giúp nghiệp vụ chính ổn định hơn, nhưng cũng làm tăng nhu cầu theo dõi trạng thái, retry và kiểm thử failure path.
- Kiểm thử tự động cần được thiết kế cùng với dữ liệu seed phù hợp. Các lỗi trong graduation suite cho thấy test data và test interaction có thể làm kết quả kiểm thử không phản ánh đúng chất lượng implementation.

## 7.6 Hướng phát triển

Các hướng phát triển dưới đây là **đề xuất cho tương lai**, không phải năng lực đã hoàn thiện trong hệ thống hiện tại.

### 7.6.1 Tích hợp dịch vụ gửi thư điện tử và tin nhắn SMS thương mại

Hệ thống có thể được mở rộng bằng việc liên kết trực tiếp với các nhà cung cấp dịch vụ gửi thư điện tử và tin nhắn SMS thương mại để tự động phát thông báo đặt lịch, nhắc nhở và hỗ trợ khôi phục mật khẩu trong môi trường vận hành thực tế. Quá trình này đòi hỏi bổ sung cơ chế kiểm thử chuyển phát, chính sách gửi lại (retry) và bảo đảm tính bất biến (idempotency).

### 7.6.2 Tích hợp giải pháp tư vấn truyền hình trực tuyến (Video)

Phiên tư vấn hiện tại đã hoàn thiện kênh trao đổi tin nhắn trực tiếp. Trong các giai đoạn tiếp theo, hệ thống có thể kết nối với hạ tầng truyền thông WebRTC hoặc các giải pháp truyền hình chuyên biệt nhằm hỗ trợ cuộc gọi hình ảnh trực tuyến giữa bác sĩ và bệnh nhân, đi kèm các biện pháp kiểm soát phân quyền phiên và mã hóa đường truyền.

### 7.6.3 Bổ sung object storage cho tệp đính kèm

Hệ thống có thể bổ sung luồng tải lên và quản lý tệp đính kèm như ảnh xét nghiệm, tài liệu tham khảo hoặc tệp liên quan đến tư vấn. Hướng này cần object storage, kiểm soát loại tệp/kích thước, quét an toàn, phân quyền truy cập và chính sách lưu trữ dữ liệu sức khỏe.

### 7.6.4 Mở rộng báo cáo và phân tích

Phân hệ báo cáo có thể được phát triển thêm các bộ lọc và biểu đồ chi tiết hơn theo chuyên khoa, bác sĩ, trạng thái lịch hẹn, tỷ lệ hoàn tất tư vấn, phản hồi người dùng và xu hướng theo thời gian. Với dữ liệu lớn hơn, có thể cân nhắc cơ chế tổng hợp định kỳ hoặc kho dữ liệu báo cáo riêng.

### 7.6.5 Phát triển mobile client

Ngoài web responsive, hệ thống có thể phát triển ứng dụng mobile để cải thiện trải nghiệm đặt lịch, nhắc lịch, chat và nhận thông báo. Mobile client cần tái sử dụng API hiện có nhưng bổ sung kiểm thử đặc thù cho thiết bị di động, push notification và trạng thái offline/online.

### 7.6.6 Nâng cấp hạ tầng xử lý thời gian thực

Khi số lượng phiên tư vấn diễn ra đồng thời tăng cao, phân hệ giao tiếp thời gian thực có thể được bổ sung cơ chế Pub/Sub (thông qua Redis Adapter cho Socket.IO) nhằm hỗ trợ phân tải trên nhiều tiến trình máy chủ, bảo đảm duy trì tính liên tục và độ trễ thấp của luồng tin nhắn.

### 7.6.7 Tích hợp với hệ thống y tế bên ngoài

Trong tương lai, hệ thống có thể xem xét tích hợp với hệ thống bệnh viện, hồ sơ sức khỏe điện tử hoặc các chuẩn trao đổi dữ liệu y tế nếu có yêu cầu thực tế. Hướng này cần đánh giá pháp lý, chuẩn dữ liệu, bảo mật, quyền riêng tư và quy trình đồng ý của người bệnh.

### 7.6.8 Hỗ trợ AI có kiểm soát an toàn

Một hướng mở rộng tùy chọn là bổ sung năng lực AI hỗ trợ phân loại câu hỏi, gợi ý thông tin tham khảo hoặc hỗ trợ bác sĩ trong việc tổng hợp nội dung tư vấn. Nếu triển khai, AI phải có giới hạn an toàn rõ ràng, không tự đưa ra chẩn đoán thay bác sĩ, không thay thế tư vấn chuyên môn và cần cơ chế kiểm duyệt, giải thích, ghi log cũng như bảo vệ dữ liệu sức khỏe.

## 7.7 Kết luận chung

Đề tài đã xây dựng được một hệ thống web có khả năng hỗ trợ quy trình tư vấn sức khỏe và quản lý lịch hẹn trực tuyến với các chức năng cốt lõi cho khách truy cập, bệnh nhân, bác sĩ và quản trị viên. Hệ thống đã có kiến trúc rõ ràng, mô hình dữ liệu phù hợp, các cơ chế bảo mật cơ bản, luồng đặt lịch có kiểm soát xung đột, tư vấn realtime qua chat, kết quả tư vấn, đơn thuốc cơ bản, đánh giá, thông báo, kiểm duyệt và báo cáo.

Kết quả kiểm thử cho thấy các thành phần quan trọng của hệ thống đã được xác minh ở nhiều mức độ khác nhau thông qua unit/service test, type-check, build và E2E core flows. Dù vẫn còn các hạn chế về kiểm thử nâng cao, provider production, video production, attachment storage, hiệu năng và khả năng mở rộng, hệ thống hiện tại đã đáp ứng mục tiêu chính của đề tài và tạo nền tảng phù hợp để tiếp tục phát triển trong các giai đoạn sau.

# TÀI LIỆU THAM KHẢO

1. **NestJS Documentation**: *A progressive Node.js framework for building efficient, reliable and scalable server-side applications*. URL: https://docs.nestjs.com/.
2. **React Documentation**: *The library for web and native user interfaces*. URL: https://react.dev/.
3. **Prisma ORM**: *Next-generation ORM for Node.js & TypeScript*. URL: https://www.prisma.io/docs/.
4. **PostgreSQL Global Development Group**: *PostgreSQL 16 Documentation*. URL: https://www.postgresql.org/docs/.
5. **Socket.IO**: *Bidirectional and low-latency communication for every platform*. URL: https://socket.io/docs/v4/.
6. **RFC 7519**: Jones, M., Bradley, J., & Sakimura, N. (2015). *JSON Web Token (JWT)*. Internet Engineering Task Force (IETF).
7. **RFC 7231**: Fielding, R., & Reschke, J. (2014). *Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content*. IETF.
8. **OWASP Foundation**: *OWASP Top Ten Web Application Security Risks*. URL: https://owasp.org/www-project-top-ten/.
9. **Martin Fowler**: *Transactional Outbox Pattern*. URL: https://microservices.io/patterns/data/transactional-outbox.html.
10. **Playwright Documentation**: *Fast and reliable end-to-end testing for modern web apps*. URL: https://playwright.dev/docs/intro.
11. **Jest Documentation**: *Delightful JavaScript Testing*. URL: https://jestjs.io/docs/getting-started.
12. **Redux Toolkit**: *The official, opinionated, batteries-included toolset for efficient Redux development*. URL: https://redux-toolkit.js.org/.
