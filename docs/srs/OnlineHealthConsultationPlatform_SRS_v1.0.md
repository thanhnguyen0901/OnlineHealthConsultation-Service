# Software Requirements Specification (SRS)

## Nền tảng Tư vấn Sức khỏe Trực tuyến – MVP

---

## 1. Phạm vi

### 1.1 Mục đích

Tài liệu này mô tả các yêu cầu phần mềm cho phiên bản MVP của **Nền tảng Tư vấn Sức khỏe Trực tuyến (Online Health Consultation Platform)**, là một hệ thống web cho phép bệnh nhân đặt lịch tư vấn sức khỏe trực tuyến với bác sĩ, gửi câu hỏi sức khỏe, tham gia buổi tư vấn từ xa, nhận phản hồi chuyên môn và theo dõi lịch sử tư vấn trong một môi trường an toàn và bảo mật.

---

### 1.2 Phạm vi sản phẩm

Hệ thống cung cấp các chức năng cốt lõi sau:

* Truy cập khu vực công khai dành cho **Guest User** để xem thông tin nền tảng và tra cứu bác sĩ.
* Quản lý tài khoản và phân quyền người dùng.
* Quản lý hồ sơ bệnh nhân và hồ sơ bác sĩ.
* Tìm kiếm bác sĩ theo chuyên khoa.
* Gửi câu hỏi sức khỏe.
* Đặt lịch hẹn tư vấn.
* Tham gia tư vấn trực tuyến qua chat hoặc video mô phỏng.
* Nhận phản hồi tư vấn và đơn thuốc điện tử cơ bản.
* Đánh giá chất lượng tư vấn.
* Quản trị dữ liệu người dùng, chuyên khoa, lịch hẹn và nội dung tư vấn.
* Gửi thông báo và nhắc lịch hẹn.

---

### 1.3 Trong phạm vi MVP

Các chức năng nằm trong phạm vi MVP bao gồm:

* Xem trang chủ và các nội dung công khai mà không cần đăng nhập.
* Xem danh sách chuyên khoa và danh sách bác sĩ công khai.
* Tìm kiếm và xem thông tin bác sĩ khi ở vai trò **Guest User**.
* Đăng ký, đăng nhập, đăng xuất.
* Phân quyền theo vai trò: **Guest User, Patient, Doctor, Administrator**.
* Cập nhật hồ sơ sức khỏe cá nhân của bệnh nhân.
* Quản lý hồ sơ chuyên môn của bác sĩ.
* Quản lý chuyên khoa.
* Tìm kiếm và xem thông tin bác sĩ.
* Gửi câu hỏi sức khỏe tới hệ thống.
* Bác sĩ xem và phản hồi câu hỏi.
* Đặt lịch tư vấn với bác sĩ.
* Bác sĩ quản lý lịch tư vấn.
* Phiên tư vấn trực tuyến qua chat.
* Phiên tư vấn video ở mức mô phỏng hoặc tích hợp cơ bản.
* Bác sĩ nhập kết luận tư vấn và đơn thuốc điện tử cơ bản.
* Bệnh nhân tra cứu lịch sử tư vấn và phản hồi.
* Bệnh nhân đánh giá chất lượng tư vấn.
* Quản trị viên quản lý bác sĩ, bệnh nhân, lịch hẹn, chuyên khoa.
* Kiểm duyệt nội dung tư vấn và phản hồi.
* Thống kê số lượt tư vấn và người dùng hoạt động.
* Gửi email hoặc thông báo nhắc lịch hẹn.
* Giao diện responsive cho desktop, tablet và mobile.

---

### 1.4 Ngoài phạm vi MVP

Các nội dung sau không thuộc phạm vi MVP:

* Chẩn đoán y khoa bằng AI ở mức production.
* Tích hợp với bệnh viện, phòng khám hoặc hệ thống EHR bên ngoài.
* Kết nối với thiết bị IoT hoặc wearable.
* Thanh toán bảo hiểm y tế.
* Quản lý giao thuốc hoặc tích hợp với nhà thuốc.
* Cuộc gọi video chất lượng cao có ghi hình, lưu trữ và phát lại.
* Ứng dụng di động native.
* Telemedicine workflow nâng cao như e-consent, referral management, triage engine.
* Tích hợp SMS ở mức production nếu hạ tầng chưa sẵn sàng.
* Dark Mode và đa ngôn ngữ trong MVP, trừ khi nhóm quyết định đưa vào như một tính năng mở rộng.

> **Ghi chú:** Nếu nhóm muốn triển khai **Dark Mode**, **đa ngôn ngữ** hoặc **chatbot mô phỏng**, các mục này nên được xếp vào phần **tính năng chức năng mở rộng (optional functional features)** hoặc **future enhancements**, không nên xếp vào **non-functional requirements**.

---

## 2. Tác nhân

### 2.1 Tác nhân chính

#### Guest User

Người dùng khách là người chưa đăng ký hoặc chưa đăng nhập vào hệ thống. Guest User có thể:

* truy cập các trang công khai,
* xem thông tin giới thiệu về nền tảng,
* xem danh sách chuyên khoa,
* tìm kiếm và xem hồ sơ công khai của bác sĩ,
* được chuyển hướng tới trang đăng nhập hoặc đăng ký khi thực hiện các hành động yêu cầu xác thực như đặt lịch hoặc gửi câu hỏi.

#### Patient

Bệnh nhân là người sử dụng hệ thống để:

* đăng ký và đăng nhập tài khoản,
* quản lý hồ sơ sức khỏe,
* gửi câu hỏi sức khỏe,
* đặt lịch tư vấn với bác sĩ,
* tham gia buổi tư vấn trực tuyến,
* xem phản hồi, lịch sử tư vấn và đơn thuốc,
* đánh giá chất lượng tư vấn.

#### Doctor

Bác sĩ là người sử dụng hệ thống để:

* đăng nhập và quản lý hồ sơ chuyên môn,
* xem danh sách câu hỏi từ bệnh nhân,
* phản hồi câu hỏi sức khỏe,
* quản lý lịch làm việc và lịch hẹn,
* thực hiện tư vấn trực tuyến,
* nhập kết luận tư vấn và hướng dẫn điều trị cơ bản.

#### Administrator

Quản trị viên là người vận hành hệ thống để:

* quản lý tài khoản bác sĩ và bệnh nhân,
* quản lý chuyên khoa,
* giám sát và quản lý lịch hẹn,
* kiểm duyệt nội dung tư vấn và phản hồi,
* theo dõi thống kê hoạt động hệ thống.

---

### 2.2 Hệ thống bên ngoài

#### Notification Service

Dịch vụ gửi email và/hoặc SMS để:

* xác nhận đăng ký,
* thông báo lịch hẹn,
* nhắc lịch tư vấn,
* thông báo khi có phản hồi mới.

#### Video Communication Service

Dịch vụ hỗ trợ phiên tư vấn video, có thể là:

* WebRTC tích hợp trực tiếp,
* hoặc iframe/video mock cho MVP.

#### File Storage Service

Dịch vụ lưu trữ tệp đính kèm như:

* tài liệu sức khỏe,
* hình ảnh,
* đơn thuốc,
* tệp phản hồi liên quan đến tư vấn.

---

## 3. Ca sử dụng

### 3.1 Ca sử dụng của Guest User

* UC-G-01: Xem trang chủ hệ thống.
* UC-G-02: Xem danh sách chuyên khoa.
* UC-G-03: Tìm kiếm bác sĩ theo chuyên khoa hoặc từ khóa.
* UC-G-04: Xem chi tiết hồ sơ công khai của bác sĩ.
* UC-G-05: Xem danh sách bác sĩ nổi bật hoặc bác sĩ đang hoạt động.
* UC-G-06: Chuyển đến trang đăng ký hoặc đăng nhập khi muốn đặt lịch hoặc gửi câu hỏi.

### 3.2 Ca sử dụng của Patient

* UC-P-01: Đăng ký tài khoản.
* UC-P-02: Đăng nhập.
* UC-P-03: Đăng xuất.
* UC-P-04: Quản lý hồ sơ sức khỏe cá nhân.
* UC-P-05: Tìm kiếm bác sĩ theo chuyên khoa.
* UC-P-06: Xem chi tiết bác sĩ.
* UC-P-07: Gửi câu hỏi sức khỏe.
* UC-P-08: Đặt lịch hẹn tư vấn.
* UC-P-09: Xem danh sách lịch hẹn sắp tới.
* UC-P-10: Tham gia phiên tư vấn.
* UC-P-11: Xem phản hồi của bác sĩ.
* UC-P-12: Xem lịch sử tư vấn.
* UC-P-13: Xem đơn thuốc và tóm tắt tư vấn.
* UC-P-14: Đánh giá chất lượng tư vấn.
* UC-P-15: Nhận nhắc lịch và thông báo.

### 3.3 Ca sử dụng của Doctor

* UC-D-01: Đăng nhập.
* UC-D-02: Quản lý hồ sơ bác sĩ.
* UC-D-03: Xem các câu hỏi sức khỏe được phân công hoặc có thể xử lý.
* UC-D-04: Phản hồi câu hỏi của bệnh nhân.
* UC-D-05: Quản lý lịch tư vấn.
* UC-D-06: Xem các lịch hẹn đã được đặt.
* UC-D-07: Bắt đầu phiên tư vấn.
* UC-D-08: Thực hiện tư vấn qua chat hoặc video.
* UC-D-09: Ghi nhận kết quả tư vấn.
* UC-D-10: Cấp đơn thuốc điện tử cơ bản.
* UC-D-11: Xem lịch sử tư vấn của bệnh nhân.

### 3.4 Ca sử dụng của Administrator

* UC-A-01: Đăng nhập.
* UC-A-02: Quản lý tài khoản bác sĩ.
* UC-A-03: Quản lý tài khoản bệnh nhân.
* UC-A-04: Quản lý chuyên khoa.
* UC-A-05: Quản lý lịch hẹn.
* UC-A-06: Kiểm duyệt nội dung tư vấn và phản hồi.
* UC-A-07: Xem dashboard thống kê hệ thống.
* UC-A-08: Theo dõi người dùng đang hoạt động và số lượng phiên tư vấn.

### 3.5 Ca sử dụng của hệ thống bên ngoài

* UC-E-01: Gửi email nhắc lịch.
* UC-E-02: Gửi SMS nhắc lịch.
* UC-E-03: Thiết lập phiên tư vấn video.
* UC-E-04: Lưu trữ và truy xuất tệp tải lên.

---

## 4. Luồng nghiệp vụ chính

### 4.1 Luồng nghiệp vụ 1: Guest User tra cứu bác sĩ và chuyển đổi sang đăng ký

**Tác nhân tham gia:** Guest User, System

1. Guest User truy cập vào trang chủ của hệ thống.
2. System hiển thị thông tin giới thiệu nền tảng, danh sách chuyên khoa và danh sách bác sĩ công khai.
3. Guest User tìm kiếm bác sĩ theo chuyên khoa hoặc từ khóa.
4. System hiển thị danh sách bác sĩ phù hợp cùng thông tin cơ bản.
5. Guest User chọn một bác sĩ để xem hồ sơ chi tiết.
6. System hiển thị hồ sơ công khai của bác sĩ, bao gồm chuyên khoa, kinh nghiệm, mô tả tư vấn và thông tin lịch khả dụng nếu được công khai.
7. Guest User chọn chức năng “Đặt lịch tư vấn” hoặc “Gửi câu hỏi”.
8. System kiểm tra trạng thái xác thực và xác định người dùng chưa đăng nhập.
9. System chuyển hướng Guest User tới màn hình đăng nhập hoặc đăng ký.
10. Sau khi đăng ký hoặc đăng nhập thành công, người dùng được chuyển đổi sang vai trò Patient và có thể tiếp tục thực hiện luồng nghiệp vụ trước đó.

**Luồng thay thế:**

* Nếu Guest User chỉ có nhu cầu tra cứu, hệ thống không yêu cầu đăng nhập.
* Nếu hồ sơ bác sĩ không còn ở trạng thái active hoặc approved, hệ thống không hiển thị hồ sơ đó trên khu vực công khai.

---

### 4.2 Luồng nghiệp vụ 2: Patient đặt lịch hẹn tư vấn

**Tác nhân tham gia:** Patient, System, Doctor, Notification Service

1. Patient đăng nhập vào hệ thống.
2. Patient truy cập danh sách bác sĩ hoặc tìm kiếm theo chuyên khoa.
3. System hiển thị danh sách bác sĩ phù hợp cùng thông tin cơ bản và lịch trống.
4. Patient chọn một bác sĩ để xem chi tiết.
5. Patient chọn ngày và khung giờ tư vấn còn khả dụng.
6. Patient nhập mô tả vấn đề sức khỏe và, nếu được hỗ trợ, tải lên tệp liên quan.
7. System kiểm tra tính hợp lệ của dữ liệu và tính khả dụng của khung giờ.
8. Nếu khung giờ hợp lệ, system tạo bản ghi appointment với trạng thái ban đầu là `PENDING_CONFIRMATION` hoặc `CONFIRMED`, tùy quy tắc nghiệp vụ.
9. System gửi thông báo xác nhận lịch hẹn cho patient.
10. Doctor nhìn thấy lịch hẹn trong danh sách làm việc của mình.
11. Trước thời gian hẹn, system gửi thông báo nhắc lịch qua email và/hoặc SMS.

**Luồng thay thế:**

* Nếu khung giờ không còn khả dụng, system yêu cầu patient chọn khung giờ khác.
* Nếu doctor phải xác nhận thủ công, appointment giữ trạng thái `PENDING_CONFIRMATION` cho đến khi bác sĩ xác nhận.

---

### 4.3 Luồng nghiệp vụ 3: Doctor phản hồi câu hỏi sức khỏe

**Tác nhân tham gia:** Patient, Doctor, System, Notification Service

1. Patient đăng nhập và gửi một câu hỏi sức khỏe.
2. System lưu câu hỏi với trạng thái `PENDING`.
3. Doctor đăng nhập và truy cập danh sách câu hỏi cần xử lý.
4. Doctor mở chi tiết câu hỏi, xem nội dung và thông tin hồ sơ sức khỏe liên quan của patient.
5. Doctor nhập phản hồi tư vấn và hướng dẫn cơ bản.
6. System lưu phản hồi và cập nhật trạng thái câu hỏi thành `ANSWERED`.
7. System gửi thông báo cho patient rằng câu hỏi đã được phản hồi.
8. Patient đăng nhập và xem nội dung phản hồi.

**Luồng thay thế:**

* Nếu nội dung câu hỏi vi phạm chính sách hoặc không phù hợp, admin có thể đánh dấu để kiểm duyệt.
* Nếu doctor chưa đủ thông tin, doctor có thể yêu cầu patient bổ sung mô tả hoặc tài liệu.

---

### 4.4 Luồng nghiệp vụ 4: Doctor thực hiện phiên tư vấn trực tuyến

**Tác nhân tham gia:** Doctor, Patient, System, Video Service

1. Đến gần thời gian hẹn, patient và doctor đăng nhập vào hệ thống.
2. Patient truy cập lịch hẹn và chọn tham gia phiên tư vấn.
3. Doctor truy cập lịch hẹn và chọn bắt đầu phiên tư vấn.
4. System xác minh:

   * trạng thái lịch hẹn hợp lệ,
   * thời gian hẹn đã đến hoặc nằm trong khoảng cho phép,
   * cả hai bên có quyền truy cập đúng phiên tư vấn.
5. System khởi tạo phiên chat hoặc video.
6. Patient và doctor tiến hành trao đổi trong phiên tư vấn.
7. Doctor ghi nhận nội dung tư vấn, kết luận và hướng dẫn điều trị cơ bản.
8. Nếu nghiệp vụ hỗ trợ, doctor nhập đơn thuốc điện tử cơ bản.
9. Doctor kết thúc phiên tư vấn.
10. System cập nhật trạng thái lịch hẹn thành `COMPLETED`.
11. Patient có thể truy cập lại để xem kết quả tư vấn và đơn thuốc.

**Luồng thay thế:**

* Nếu video không khởi tạo thành công, system cho phép fallback sang chat.
* Nếu patient không tham gia, doctor có thể đánh dấu `NO_SHOW` nếu trạng thái này được hỗ trợ trong MVP.

---

## 5. Yêu cầu chức năng

### 5.1 Quản lý truy cập công khai cho Guest User

* Hệ thống phải cho phép Guest User truy cập các trang công khai mà không cần đăng nhập.
* Hệ thống phải cho phép Guest User xem trang chủ, danh sách chuyên khoa và danh sách bác sĩ công khai.
* Hệ thống phải cho phép Guest User tìm kiếm bác sĩ theo chuyên khoa hoặc từ khóa.
* Hệ thống phải cho phép Guest User xem hồ sơ công khai của bác sĩ.
* Hệ thống chỉ được hiển thị các bác sĩ có trạng thái active và approved trên khu vực công khai.
* Hệ thống phải chuyển hướng Guest User đến màn hình đăng nhập hoặc đăng ký khi Guest User thực hiện hành động yêu cầu xác thực như đặt lịch, gửi câu hỏi hoặc đánh giá.

### 5.2 Xác thực và phân quyền người dùng

* Hệ thống phải cho phép bệnh nhân đăng ký tài khoản bằng email và mật khẩu.
* Hệ thống phải cho phép người dùng đã đăng ký đăng nhập bằng thông tin xác thực hợp lệ.
* Hệ thống phải cho phép người dùng đã xác thực đăng xuất.
* Hệ thống phải áp dụng cơ chế phân quyền theo vai trò cho Guest User, Patient, Doctor và Administrator.
* Hệ thống phải giới hạn mỗi người dùng chỉ được truy cập chức năng và dữ liệu phù hợp với vai trò được gán.
* Hệ thống phải hỗ trợ khôi phục mật khẩu thông qua email xác thực hoặc cơ chế bảo mật tương đương.

### 5.3 Quản lý hồ sơ người dùng

* Hệ thống phải cho phép bệnh nhân tạo và cập nhật hồ sơ sức khỏe cá nhân.
* Hồ sơ bệnh nhân tối thiểu phải bao gồm họ tên, ngày sinh, giới tính, thông tin liên hệ và thông tin sức khỏe cơ bản.
* Hệ thống phải cho phép bác sĩ tạo và cập nhật hồ sơ chuyên môn.
* Hồ sơ bác sĩ tối thiểu phải bao gồm họ tên, chuyên khoa, tóm tắt bằng cấp, kinh nghiệm, mô tả tư vấn và thông tin lịch làm việc.
* Hệ thống phải cho phép quản trị viên tạo, cập nhật, kích hoạt, vô hiệu hóa hoặc xóa tài khoản người dùng theo đúng quy tắc phân quyền.

### 5.4 Quản lý chuyên khoa

* Hệ thống phải cho phép quản trị viên tạo mới, cập nhật và vô hiệu hóa chuyên khoa.
* Hệ thống phải cho phép một bác sĩ được gắn với một hoặc nhiều chuyên khoa theo mô hình dữ liệu.
* Hệ thống phải cho phép bệnh nhân và Guest User duyệt hoặc lọc bác sĩ theo chuyên khoa.

### 5.5 Khám phá bác sĩ

* Hệ thống phải cho phép bệnh nhân tìm kiếm bác sĩ.
* Hệ thống phải cho phép Guest User tìm kiếm bác sĩ.
* Hệ thống phải cho phép lọc bác sĩ theo chuyên khoa.
* Hệ thống phải hiển thị chi tiết hồ sơ bác sĩ bao gồm chuyên khoa, tóm tắt kinh nghiệm và lịch khả dụng.
* Hệ thống chỉ hiển thị các bác sĩ đang active và approved cho bệnh nhân và Guest User.

### 5.6 Quản lý câu hỏi sức khỏe

* Hệ thống phải cho phép bệnh nhân gửi câu hỏi sức khỏe.
* Hệ thống phải lưu trữ câu hỏi đã gửi với trạng thái như `PENDING`, `ANSWERED` hoặc `CLOSED`.
* Hệ thống phải cho phép bác sĩ xem các câu hỏi được phân công cho mình hoặc được mở cho mình xử lý theo quy tắc nghiệp vụ.
* Hệ thống phải cho phép bác sĩ phản hồi câu hỏi sức khỏe.
* Hệ thống phải ghi nhận thời điểm phản hồi và bác sĩ phản hồi.
* Hệ thống phải cho phép bệnh nhân xem các câu hỏi đã gửi trước đó và phản hồi tương ứng.
* Hệ thống phải cho phép quản trị viên xem xét và kiểm duyệt nội dung câu hỏi và phản hồi khi cần thiết.

### 5.7 Quản lý lịch hẹn

* Hệ thống phải cho phép bệnh nhân đặt lịch hẹn tư vấn với bác sĩ.
* Hệ thống phải đảm bảo bệnh nhân chỉ có thể đặt vào khung giờ còn trống.
* Hệ thống phải ngăn chặn việc đặt trùng lịch cho cùng một bác sĩ và cùng một khung giờ.
* Hệ thống phải lưu trữ thông tin lịch hẹn bao gồm bệnh nhân, bác sĩ, ngày, giờ, mục đích, trạng thái và thời điểm tạo.
* Hệ thống phải hỗ trợ tối thiểu các trạng thái lịch hẹn gồm `PENDING_CONFIRMATION`, `CONFIRMED`, `COMPLETED` và `CANCELLED`.
* Hệ thống phải cho phép bác sĩ xem các lịch hẹn sắp tới và lịch hẹn trong quá khứ của mình.
* Hệ thống phải cho phép bệnh nhân xem các lịch hẹn sắp tới và lịch hẹn trong quá khứ của mình.
* Hệ thống phải cho phép hủy lịch theo các quy tắc nghiệp vụ đã định nghĩa.
* Hệ thống phải cho phép quản trị viên xem và quản lý tất cả lịch hẹn.

### 5.8 Quản lý phiên tư vấn

* Hệ thống phải cho phép khởi tạo phiên tư vấn cho một lịch hẹn hợp lệ.
* Hệ thống phải hỗ trợ chat thời gian thực cho phiên tư vấn.
* Hệ thống có thể hỗ trợ tư vấn video thông qua tích hợp WebRTC hoặc cơ chế video mô phỏng trong MVP.
* Hệ thống phải giới hạn quyền truy cập phiên tư vấn cho bệnh nhân tham gia, bác sĩ phụ trách và quản trị viên được ủy quyền nếu có.
* Hệ thống phải lưu thông tin tóm tắt phiên tư vấn sau khi phiên kết thúc.
* Hệ thống phải hỗ trợ fallback từ video sang chat nếu dịch vụ video không khả dụng.

### 5.9 Quản lý kết quả tư vấn và đơn thuốc

* Hệ thống phải cho phép bác sĩ ghi nhận kết quả tư vấn và khuyến nghị.
* Hệ thống phải cho phép bác sĩ tạo đơn thuốc điện tử cơ bản gắn với một buổi tư vấn đã hoàn tất.
* Bản ghi đơn thuốc phải bao gồm tên thuốc, liều dùng, tần suất dùng, thời lượng dùng và ghi chú của bác sĩ.
* Hệ thống phải cho phép bệnh nhân chỉ xem kết quả tư vấn và đơn thuốc gắn với các buổi tư vấn của chính mình.
* Hệ thống phải duy trì lịch sử hồ sơ tư vấn để truy xuất về sau.

### 5.10 Quản lý đánh giá và phản hồi

* Hệ thống phải cho phép bệnh nhân gửi đánh giá sau khi buổi tư vấn đã hoàn tất.
* Hệ thống phải cho phép bệnh nhân gửi nhận xét bằng văn bản đi kèm đánh giá.
* Hệ thống phải ngăn việc gửi đánh giá cho các lịch hẹn chưa hoàn tất.
* Hệ thống phải cho phép quản trị viên xem xét và kiểm duyệt điểm đánh giá và bình luận nếu cần.

### 5.11 Quản lý thông báo và nhắc lịch

* Hệ thống phải gửi thông báo xác nhận khi lịch hẹn được tạo thành công hoặc được xác nhận.
* Hệ thống phải gửi thông báo nhắc lịch trước thời gian hẹn.
* Hệ thống phải thông báo cho bệnh nhân khi bác sĩ đã phản hồi câu hỏi đã gửi.
* Hệ thống phải hỗ trợ thông báo qua email.
* Hệ thống có thể hỗ trợ nhắc lịch bằng SMS nếu tích hợp được dịch vụ bên ngoài.
* Hệ thống phải ghi nhận lịch sử gửi thông báo và trạng thái gửi khi có thể.

### 5.12 Quản trị hệ thống

* Hệ thống phải cho phép quản trị viên quản lý tài khoản bác sĩ và bệnh nhân.
* Hệ thống phải cho phép quản trị viên quản lý chuyên khoa.
* Hệ thống phải cho phép quản trị viên quản lý và giám sát lịch hẹn.
* Hệ thống phải cho phép quản trị viên kiểm duyệt nội dung liên quan đến tư vấn.
* Hệ thống phải cung cấp dashboard hiển thị các chỉ số hoạt động của hệ thống.
* Dashboard tối thiểu phải bao gồm tổng số lượt tư vấn, số người dùng hoạt động và số lượng tư vấn theo thời gian.

### 5.13 Báo cáo và thống kê

* Hệ thống phải cung cấp các số liệu thống kê về hoạt động tư vấn theo thời gian.
* Hệ thống phải hiển thị xu hướng tư vấn dưới dạng biểu đồ hoặc đồ thị.
* Hệ thống phải cho phép quản trị viên lọc dữ liệu thống kê theo khoảng thời gian nếu được hỗ trợ.
* Hệ thống có thể cung cấp số liệu theo bác sĩ, chuyên khoa hoặc trạng thái lịch hẹn nếu được đưa vào phạm vi MVP.

### 5.14 Các tính năng chức năng mở rộng cho Extended MVP

Các mục sau là **functional features**, không phải **non-functional requirements**. Chỉ nên đưa vào nếu nhóm quyết định mở rộng phạm vi MVP:

* Chatbot mô phỏng tư vấn sức khỏe cơ bản.
* Giao diện đa ngôn ngữ.
* Dark Mode.
* Tích hợp nhắc lịch bằng SMS.
* Tư vấn video nâng cao.
* Biểu đồ và bộ lọc phân tích nâng cao.

---

## 6. Yêu cầu phi chức năng

### 6.1 Bảo mật

* Tất cả giao tiếp giữa client và server phải được bảo vệ bằng HTTPS trên các môi trường triển khai.
* Mật khẩu phải được lưu bằng thuật toán băm một chiều an toàn như bcrypt hoặc Argon2.
* Hệ thống phải thực thi xác thực đối với mọi tài nguyên được bảo vệ.
* Hệ thống phải thực thi kiểm tra phân quyền đối với mọi endpoint bị giới hạn theo vai trò.
* Hệ thống phải kiểm tra hợp lệ toàn bộ dữ liệu đầu vào ở phía client khi phù hợp và bắt buộc ở phía server.
* Hệ thống phải được bảo vệ trước các lỗ hổng web phổ biến, bao gồm SQL Injection, Cross-Site Scripting và broken access control.
* Dữ liệu sức khỏe nhạy cảm chỉ được lưu trữ và truy cập bởi người dùng có thẩm quyền.
* Quyền truy cập hồ sơ tư vấn của bệnh nhân phải được giới hạn cho chính bệnh nhân đó, bác sĩ phụ trách và quản trị viên được ủy quyền theo chính sách.
* Hệ thống phải ghi audit log cho các hành động quan trọng như đăng nhập, cập nhật lịch hẹn, phản hồi của bác sĩ và thay đổi quản trị.

### 6.2 Quyền riêng tư và tính bảo mật thông tin

* Hệ thống phải xử lý dữ liệu cá nhân và dữ liệu sức khỏe theo các nguyên tắc quyền riêng tư áp dụng cho hệ thống định hướng y tế.
* Hệ thống phải giảm thiểu việc hiển thị không cần thiết thông tin sức khỏe cá nhân trên giao diện và trong log.
* Hệ thống phải đảm bảo tính bảo mật của nội dung tư vấn và đơn thuốc.
* Hệ thống phải định nghĩa cách lưu giữ dữ liệu tư vấn và audit data theo chính sách của dự án.

### 6.3 Hiệu năng

* Hệ thống nên trả về phản hồi API chuẩn trong thời gian chấp nhận được dưới tải thông thường.
* Đối với các thao tác thông thường, không bao gồm upload file và media thời gian thực, mục tiêu thời gian phản hồi là dưới 3 giây cho 95% request trong môi trường MVP.
* Hệ thống nên hỗ trợ mức sử dụng đồng thời phù hợp với quy mô triển khai ban đầu.
* Dashboard thống kê nên tải trong thời gian chấp nhận được với khối lượng dữ liệu dự kiến của MVP.

### 6.4 Khả năng mở rộng

* Hệ thống phải được thiết kế để cho phép tách biệt mối quan tâm giữa các module quản lý người dùng, quản lý tư vấn, thông báo và báo cáo.
* Hệ thống nên hỗ trợ khả năng scale ngang trong tương lai đối với các application service theo hướng stateless.
* Kiến trúc hệ thống nên cho phép thay thế hoặc nâng cấp các dịch vụ bên ngoài như notification provider và video provider với tác động tối thiểu lên business logic lõi.

### 6.5 Tính sẵn sàng và độ tin cậy

* Hệ thống nên sẵn sàng phục vụ người dùng trong khoảng thời gian vận hành được xác định với thời gian downtime ngoài kế hoạch ở mức tối thiểu.
* Hệ thống phải xử lý lỗi ứng dụng một cách an toàn và trả về thông báo lỗi nhất quán.
* Hệ thống phải tránh gây mất nhất quán dữ liệu trong các thao tác đặt lịch và cập nhật lịch hẹn.
* Hệ thống phải cung cấp cơ chế fallback cho phiên tư vấn khi dịch vụ video gặp lỗi nhưng chat vẫn còn khả dụng.

### 6.6 Tính khả dụng

* Giao diện người dùng phải responsive và sử dụng được trên desktop, tablet và mobile browser.
* Các tác vụ cốt lõi như đăng ký, gửi câu hỏi và đặt lịch phải đơn giản, rõ ràng và theo trình tự logic.
* Hệ thống phải cung cấp phản hồi rõ ràng cho người dùng đối với trạng thái thành công, thất bại, lỗi kiểm tra dữ liệu và trạng thái loading.
* Biểu mẫu phải sử dụng nhãn rõ ràng và thông báo validation dễ hiểu.
* Giao diện phải duy trì cách điều hướng và bố cục nhất quán giữa các module chính.

### 6.7 Khả năng bảo trì

* Codebase phải được tổ chức theo hướng module hóa.
* Business rules phải được tách khỏi presentation logic khi khả thi.
* API phải được tài liệu hóa nhất quán.
* Hệ thống phải hỗ trợ cấu hình dễ bảo trì cho các môi trường như development, testing và production.
* Logging và monitoring hooks nên được thiết kế để hỗ trợ debug và vận hành hệ thống.

### 6.8 Tương thích

* Ứng dụng web phải hỗ trợ các trình duyệt hiện đại phổ biến trong môi trường mục tiêu.
* Giao diện responsive phải thích ứng với các kích thước màn hình phổ biến mà không làm mất các chức năng chính.
* Nếu sau này hỗ trợ đa ngôn ngữ, hệ thống nên hỗ trợ externalized text resources để dễ dàng localization.

---

## 7. Ràng buộc

### 7.1 Ràng buộc nghiệp vụ

* Nền tảng được xác định là một MVP, do đó ưu tiên các luồng tư vấn cốt lõi hơn các khả năng telemedicine nâng cao.
* Tư vấn y tế được cung cấp qua nền tảng mang tính chất tham khảo và không thay thế cho cấp cứu hoặc khám trực tiếp khi cần.
* Nền tảng vận hành với bốn vai trò chính trong MVP: **Guest User, Patient, Doctor và Administrator**.

### 7.2 Ràng buộc kỹ thuật

* Giải pháp phải được triển khai dưới dạng nền tảng web.
* Frontend phải được phát triển bằng ReactJS.
* Backend phải được phát triển bằng công nghệ dựa trên Node.js.
* Ứng dụng phải sử dụng cơ sở dữ liệu quan hệ.
* Nền tảng phải sử dụng xác thực và phân quyền theo vai trò.
* MVP có thể sử dụng khả năng video tư vấn mô phỏng hoặc đơn giản thay vì hạ tầng telehealth cấp doanh nghiệp.
* Các tích hợp bên ngoài như SMS hoặc video nâng cao có thể phụ thuộc vào mức độ sẵn sàng của nhà cung cấp dịch vụ và ràng buộc triển khai của dự án.

### 7.3 Ràng buộc dự án

* Phạm vi MVP phải được kiểm soát để đảm bảo bàn giao được các luồng nghiệp vụ cốt lõi từ đầu đến cuối.
* Các tính năng tùy chọn không được làm ảnh hưởng đến tính hoàn chỉnh và chất lượng của quy trình tư vấn chính.
* Các tính năng mở rộng chỉ nên được thêm vào sau khi các luồng bắt buộc đã ổn định và có thể kiểm thử đầy đủ.

---

## 8. Ghi chú về phân loại yêu cầu

Để tránh nhầm lẫn trong quá trình viết SRS, quy tắc phân loại nên được thống nhất như sau:

### Functional Requirements

Mô tả **hệ thống làm gì**. Ví dụ:

* gửi email hoặc SMS nhắc lịch,
* hỗ trợ video call,
* chatbot mô phỏng,
* hiển thị biểu đồ thống kê,
* hỗ trợ dark mode,
* hỗ trợ đa ngôn ngữ.

### Non-Functional Requirements

Mô tả **hệ thống hoạt động tốt như thế nào**. Ví dụ:

* mức độ bảo mật,
* thời gian phản hồi,
* khả năng mở rộng,
* tính sẵn sàng,
* tính dễ sử dụng,
* khả năng bảo trì,
* tính tương thích.