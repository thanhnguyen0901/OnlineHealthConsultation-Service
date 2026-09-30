# CHƯƠNG 3. PHÂN TÍCH YÊU CẦU HỆ THỐNG

Chương này trình bày các yêu cầu của hệ thống theo tài liệu đặc tả yêu cầu phần mềm cuối cùng. Nội dung tập trung vào việc hệ thống cần làm gì, các nhóm người dùng nào tham gia, các chức năng nào thuộc phạm vi, các quy tắc nghiệp vụ chính và các giới hạn yêu cầu. Những chi tiết về thiết kế kỹ thuật và cách hiện thực mã nguồn được trình bày ở các chương sau.

## 3.1. Mô tả bài toán

Hệ thống hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến được xây dựng nhằm hỗ trợ quy trình kết nối giữa người có nhu cầu tư vấn sức khỏe và bác sĩ trên nền tảng web. Bài toán chính của hệ thống là giúp người dùng tra cứu thông tin bác sĩ, tìm kiếm theo chuyên khoa, đặt lịch tư vấn, gửi câu hỏi sức khỏe, tham gia phiên tư vấn trực tuyến và theo dõi kết quả tư vấn trong một môi trường có kiểm soát truy cập.

Trong bối cảnh sử dụng thực tế, bệnh nhân cần một nơi tập trung để tìm bác sĩ phù hợp, quản lý hồ sơ sức khỏe, theo dõi lịch hẹn và xem lại lịch sử tư vấn. Bác sĩ cần công cụ để quản lý hồ sơ chuyên môn, lịch làm việc, câu hỏi của bệnh nhân, lịch hẹn và kết quả tư vấn. Quản trị viên cần giám sát dữ liệu vận hành, quản lý người dùng, chuyên khoa, lịch hẹn, nội dung tư vấn và thống kê hoạt động hệ thống.

Hệ thống không được định nghĩa như một công cụ chẩn đoán y khoa tự động và không thay thế cho cấp cứu hoặc khám trực tiếp khi cần thiết. Vai trò của hệ thống là hỗ trợ tư vấn sức khỏe trực tuyến, quản lý lịch hẹn, ghi nhận thông tin tư vấn và giúp quá trình trao đổi giữa bệnh nhân, bác sĩ, quản trị viên được tổ chức rõ ràng hơn.

## 3.2. Đối tượng sử dụng

Hệ thống có bốn nhóm người dùng chính:

| Đối tượng | Mô tả vai trò | Nhóm ca sử dụng liên quan |
|---|---|---|
| Guest User | Người dùng chưa đăng nhập. Có thể truy cập khu vực công khai, xem trang chủ, xem chuyên khoa, tìm kiếm bác sĩ và xem hồ sơ công khai của bác sĩ. Khi muốn đặt lịch hoặc gửi câu hỏi, người dùng được chuyển sang đăng nhập hoặc đăng ký. | UC-G-01 đến UC-G-06 |
| Patient | Bệnh nhân sử dụng hệ thống để đăng ký, đăng nhập, quản lý hồ sơ sức khỏe, gửi câu hỏi, đặt lịch tư vấn, tham gia phiên tư vấn, xem kết quả, xem đơn thuốc và đánh giá chất lượng tư vấn. | UC-P-01 đến UC-P-15 |
| Doctor | Bác sĩ sử dụng hệ thống để quản lý hồ sơ chuyên môn, lịch làm việc, xem và trả lời câu hỏi, quản lý lịch hẹn, thực hiện tư vấn trực tuyến, ghi nhận kết quả tư vấn và cấp đơn thuốc điện tử cơ bản. | UC-D-01 đến UC-D-11 |
| Administrator | Quản trị viên vận hành hệ thống, quản lý tài khoản, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, kiểm duyệt nội dung và theo dõi thống kê hoạt động. | UC-A-01 đến UC-A-08 |

Ngoài các đối tượng sử dụng chính, SRS còn xác định một số hệ thống bên ngoài như Notification Service, Video Communication Service và File Storage Service. Các hệ thống này được xem là ranh giới tích hợp hoặc khả năng hỗ trợ theo phạm vi yêu cầu, không làm thay đổi bốn vai trò người dùng chính của hệ thống.

## 3.3. Yêu cầu chức năng

Các yêu cầu chức năng được tóm tắt theo nhóm tác nhân và miền nghiệp vụ. Mục tiêu của phần này là giữ lại các use case ID chính thức trong SRS, đồng thời trình bày ở mức phù hợp với báo cáo tốt nghiệp, không sao chép toàn bộ nội dung SRS.

### 3.3.1. Nhóm yêu cầu dành cho Guest User

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

Theo SRS, bệnh nhân chỉ được đặt lịch vào khung giờ còn khả dụng; hệ thống phải ngăn đặt trùng lịch cho cùng bác sĩ và cùng thời gian. Lịch hẹn cần lưu các thông tin như bệnh nhân, bác sĩ, ngày giờ, mục đích, trạng thái và thời điểm tạo. Các trạng thái tối thiểu gồm `PENDING_CONFIRMATION`, `CONFIRMED`, `COMPLETED` và `CANCELLED`.

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

SRS yêu cầu hệ thống được thiết kế theo hướng tách biệt mối quan tâm giữa các nhóm chức năng như quản lý người dùng, quản lý tư vấn, thông báo và báo cáo. Hệ thống nên hỗ trợ khả năng mở rộng theo hướng stateless cho application service và cho phép thay thế hoặc nâng cấp các dịch vụ bên ngoài như notification provider hoặc video provider với tác động tối thiểu đến nghiệp vụ lõi.

### 3.4.5. Tính sẵn sàng và độ tin cậy

Hệ thống nên duy trì khả năng phục vụ trong khoảng thời gian vận hành được xác định, với downtime ngoài kế hoạch ở mức tối thiểu. Hệ thống phải xử lý lỗi an toàn, trả về thông báo lỗi nhất quán, tránh gây mất nhất quán dữ liệu trong thao tác đặt lịch/cập nhật lịch hẹn và có cơ chế fallback khi dịch vụ video gặp lỗi nhưng chat vẫn khả dụng.

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

Bệnh nhân chỉ được đặt lịch với bác sĩ trong các khung giờ còn khả dụng. Hệ thống phải ngăn đặt trùng lịch cho cùng bác sĩ và cùng khung giờ. Lịch hẹn phải có thông tin bệnh nhân, bác sĩ, thời gian, mục đích, trạng thái và thời điểm tạo. Các trạng thái tối thiểu gồm `PENDING_CONFIRMATION`, `CONFIRMED`, `COMPLETED` và `CANCELLED`.

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

Khi đến thời gian tư vấn, Patient và Doctor tham gia phiên tư vấn. Luồng chính của hệ thống là tư vấn qua chat thời gian thực; video được xem là khả năng hỗ trợ trong phạm vi mô phỏng hoặc tích hợp cơ bản theo SRS. Sau phiên tư vấn, bác sĩ ghi nhận tóm tắt tư vấn và có thể tạo đơn thuốc điện tử cơ bản. Patient xem lại kết quả, đơn thuốc và có thể gửi đánh giá chất lượng tư vấn sau khi buổi tư vấn hoàn tất.

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

Khi trình bày các chức năng này trong báo cáo, cần phân biệt rõ giữa yêu cầu mở rộng và chức năng cốt lõi. Đặc biệt, SMS và video nâng cao phụ thuộc vào điều kiện dịch vụ bên ngoài; chatbot không được xem là năng lực chẩn đoán y khoa.

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
