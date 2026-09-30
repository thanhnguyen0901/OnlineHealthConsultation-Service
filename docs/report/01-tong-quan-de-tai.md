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
- Hỗ trợ đăng ký, đăng nhập, đăng xuất và phân quyền theo các vai trò Guest User, Patient, Doctor và Administrator.
- Cho phép bệnh nhân quản lý hồ sơ sức khỏe cá nhân, tìm kiếm bác sĩ, gửi câu hỏi sức khỏe, đặt lịch tư vấn và theo dõi lịch sử tư vấn.
- Cho phép bác sĩ quản lý hồ sơ chuyên môn, lịch làm việc, trả lời câu hỏi, xử lý lịch hẹn, tham gia tư vấn trực tuyến và ghi nhận kết quả tư vấn.
- Hỗ trợ phiên tư vấn trực tuyến qua chat và cơ chế video ở mức mô phỏng hoặc tích hợp cơ bản theo phạm vi đề tài.
- Hỗ trợ ghi nhận tóm tắt tư vấn, đơn thuốc điện tử cơ bản và đánh giá chất lượng tư vấn.
- Cung cấp chức năng quản trị người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, kiểm duyệt nội dung và thống kê hoạt động hệ thống.
- Đảm bảo các yêu cầu cơ bản về bảo mật, phân quyền, kiểm soát truy cập và tính dễ sử dụng của giao diện.

## 1.4. Đối tượng sử dụng

Hệ thống hướng đến bốn nhóm người dùng chính:

- **Khách truy cập (Guest User):** Người dùng chưa đăng nhập, có thể xem trang chủ, danh sách chuyên khoa, danh sách bác sĩ và hồ sơ công khai của bác sĩ. Khi muốn đặt lịch hoặc gửi câu hỏi, người dùng được chuyển đến luồng đăng nhập hoặc đăng ký.
- **Bệnh nhân (Patient):** Người dùng đăng ký tài khoản để quản lý hồ sơ sức khỏe, gửi câu hỏi, đặt lịch tư vấn, tham gia phiên tư vấn, xem phản hồi, xem lịch sử tư vấn, xem đơn thuốc và đánh giá chất lượng tư vấn.
- **Bác sĩ (Doctor):** Người dùng chuyên môn y tế có thể quản lý hồ sơ bác sĩ, lịch làm việc, tiếp nhận và trả lời câu hỏi, quản lý lịch hẹn, thực hiện tư vấn trực tuyến và ghi nhận kết quả tư vấn.
- **Quản trị viên (Administrator):** Người vận hành hệ thống, có quyền quản lý tài khoản, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, nội dung cần kiểm duyệt và theo dõi các thống kê hoạt động.

Ngoài ra, hệ thống có thể liên quan đến một số ranh giới tích hợp bên ngoài như dịch vụ thông báo, dịch vụ hỗ trợ video hoặc dịch vụ lưu trữ tệp. Trong phạm vi đề tài đã xác định, các nội dung này được xem xét theo mức độ cần thiết của hệ thống; những phần phụ thuộc nhà cung cấp bên ngoài hoặc chưa thuộc phạm vi triển khai chính được trình bày như giới hạn hoặc hướng mở rộng, không được xem là năng lực cốt lõi thay thế cho các chức năng tư vấn và quản lý lịch hẹn.

## 1.5. Phạm vi đề tài

Phạm vi đề tài tập trung vào việc xây dựng một ứng dụng web phục vụ các nghiệp vụ tư vấn sức khỏe trực tuyến và quản lý lịch hẹn. Các chức năng bắt buộc trong phạm vi bao gồm truy cập nội dung công khai, quản lý tài khoản và phân quyền, quản lý hồ sơ bệnh nhân và bác sĩ, quản lý chuyên khoa, tìm kiếm bác sĩ, gửi câu hỏi sức khỏe, đặt lịch tư vấn, quản lý lịch hẹn, tư vấn trực tuyến qua chat, ghi nhận kết quả tư vấn, đơn thuốc điện tử cơ bản, đánh giá tư vấn, quản trị hệ thống, kiểm duyệt nội dung, thống kê hoạt động và thông báo nhắc lịch.

Một số chức năng được xác định là mở rộng hoặc phụ thuộc điều kiện tích hợp, chẳng hạn như tư vấn video nâng cao, nhắc lịch bằng SMS, chatbot mô phỏng, giao diện đa ngôn ngữ, Dark Mode, biểu đồ và bộ lọc phân tích nâng cao. Các chức năng này không làm thay đổi mục tiêu cốt lõi của hệ thống là hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến.

Đề tài không bao gồm chẩn đoán y khoa bằng trí tuệ nhân tạo ở mức sử dụng thực tế, tích hợp với hệ thống bệnh viện hoặc hồ sơ sức khỏe điện tử bên ngoài, kết nối thiết bị IoT hoặc thiết bị đeo, thanh toán bảo hiểm y tế, quản lý giao thuốc, ứng dụng di động native, hoặc các quy trình telemedicine nâng cao như e-consent, referral management và triage engine.

## 1.6. Các chức năng chính

Các chức năng chính của hệ thống được phân nhóm như sau:

- **Chức năng công khai:** Xem trang chủ, xem danh sách chuyên khoa, tìm kiếm bác sĩ, xem hồ sơ công khai của bác sĩ và chuyển sang đăng nhập hoặc đăng ký khi thực hiện hành động yêu cầu xác thực.
- **Chức năng xác thực và phân quyền:** Đăng ký, đăng nhập, đăng xuất, khôi phục mật khẩu và giới hạn quyền truy cập theo vai trò người dùng.
- **Chức năng dành cho bệnh nhân:** Cập nhật hồ sơ sức khỏe, tìm kiếm bác sĩ, gửi câu hỏi sức khỏe, đặt lịch tư vấn, xem lịch hẹn, tham gia tư vấn, xem phản hồi, xem lịch sử tư vấn, xem tóm tắt tư vấn và đơn thuốc, đánh giá chất lượng tư vấn.
- **Chức năng dành cho bác sĩ:** Quản lý hồ sơ chuyên môn, quản lý lịch làm việc, xem và trả lời câu hỏi, xem và xử lý lịch hẹn, tham gia phiên tư vấn, ghi nhận kết quả tư vấn và tạo đơn thuốc điện tử cơ bản.
- **Chức năng dành cho quản trị viên:** Quản lý tài khoản, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, kiểm duyệt nội dung tư vấn và phản hồi, theo dõi dashboard và thống kê hoạt động.
- **Chức năng hỗ trợ:** Gửi thông báo, nhắc lịch hẹn, lưu lịch sử thông báo và hỗ trợ giao diện responsive cho desktop, tablet và mobile.

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
