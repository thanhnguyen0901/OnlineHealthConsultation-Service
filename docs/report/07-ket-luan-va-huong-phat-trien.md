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

Về kiểm thử, kết quả ghi nhận ở Chương 6 cho thấy backend Jest pass 9 test suites với 47 tests, backend type-check/build pass, frontend type-check/build pass. Core E2E đã ghi nhận 42/43 test pass, 0 failed và 1 skipped. Graduation E2E suite chưa được xem là pass đầy đủ do còn các vấn đề thuộc test-data, test-interaction hoặc assertion mismatch.

## 7.4 Hạn chế hiện tại

Các hạn chế dưới đây thuộc **hệ thống hiện tại** và chưa được xem là chức năng đã hoàn thiện production-grade:

- Chưa có provider email production thật được xác minh. Hệ thống có provider boundary và development/email provider, nhưng việc gửi email thật phụ thuộc cấu hình triển khai.
- SMS reminder chưa được triển khai như một năng lực production; SMS provider hiện là phần phụ thuộc cấu hình và không thuộc phạm vi bắt buộc đã xác minh.
- Video consultation hiện ở mức fallback/mock hoặc ranh giới tích hợp, chưa phải tích hợp video production đầy đủ.
- File attachment/object storage chưa được triển khai thành luồng API/UI hoàn chỉnh; chỉ có dấu vết mô hình dữ liệu mở rộng và quyết định scope.
- Một số yêu cầu phi chức năng như hiệu năng, tải đồng thời, high availability, browser compatibility và responsive audit chưa có benchmark hoặc artifact kiểm thử đầy đủ.
- Chưa có E2E hai trình duyệt đầy đủ cho luồng bệnh nhân và bác sĩ chat realtime trong cùng một phiên live.
- Một số luồng đã có implementation nhưng automation còn thiếu hoặc chưa đầy đủ, như patient profile update E2E, rating positive/negative E2E, admin moderation UI đầy đủ, reports date-range/chart E2E và cross-user consultation result access denial.
- Graduation E2E suite cần chỉnh lại dữ liệu test và tương tác test trước khi có thể dùng làm bằng chứng pass đầy đủ.
- Chưa có artifact kết quả chạy CI trong repository; hiện chỉ có workflow configuration.

Các hạn chế này không phủ nhận kết quả của các luồng cốt lõi đã triển khai, nhưng cần được ghi nhận để đánh giá đúng mức độ hoàn thiện và phạm vi kiểm chứng của hệ thống.

## 7.5 Bài học kinh nghiệm

Quá trình thực hiện đề tài đem lại một số bài học quan trọng:

- Việc xác định rõ phạm vi ngay từ đầu giúp hệ thống tập trung vào các nghiệp vụ cốt lõi như tìm bác sĩ, đặt lịch, tư vấn, kết quả và quản trị, tránh mở rộng quá sớm sang các tích hợp phức tạp.
- Tài liệu SRS và traceability matrix giúp kiểm soát sự nhất quán giữa yêu cầu, thiết kế, cài đặt và kiểm thử. Khi có khác biệt giữa yêu cầu và implementation, cần ghi nhận rõ thay vì điều chỉnh yêu cầu một cách ngầm định.
- Modular Monolith là lựa chọn phù hợp cho hệ thống có nhiều phân hệ liên quan chặt chẽ, đặc biệt khi cần transaction chung và triển khai đơn giản trong phạm vi đồ án.
- Các nghiệp vụ liên quan đến lịch hẹn cần được kiểm tra nghiêm ngặt ở backend, vì chỉ kiểm tra ở giao diện là không đủ để ngăn đặt trùng hoặc thao tác ngoài lịch làm việc.
- Với các chức năng bảo mật, frontend guard chỉ cải thiện trải nghiệm người dùng; lớp bảo vệ quyết định vẫn phải nằm ở backend thông qua guard, role check và ownership check.
- Các cơ chế bất đồng bộ như notification outbox giúp nghiệp vụ chính ổn định hơn, nhưng cũng làm tăng nhu cầu theo dõi trạng thái, retry và kiểm thử failure path.
- Kiểm thử tự động cần được thiết kế cùng với dữ liệu seed phù hợp. Các lỗi trong graduation suite cho thấy test data và test interaction có thể làm kết quả kiểm thử không phản ánh đúng chất lượng implementation.

## 7.6 Hướng phát triển

Các hướng phát triển dưới đây là **đề xuất cho tương lai**, không phải năng lực đã hoàn thiện trong hệ thống hiện tại.

### 7.6.1 Tích hợp Email/SMS provider production

Hệ thống có thể được mở rộng bằng cách cấu hình hoặc tích hợp provider email/SMS thật để gửi thông báo đặt lịch, xác nhận lịch, nhắc lịch và khôi phục mật khẩu trong môi trường production. Khi triển khai, cần bổ sung kiểm thử delivery, retry, idempotency và cấu hình bảo mật cho provider.

### 7.6.2 Tích hợp video consultation provider

Phiên tư vấn hiện hỗ trợ chat realtime và có ranh giới fallback cho video. Trong tương lai, hệ thống có thể tích hợp provider video consultation production hoặc WebRTC infrastructure phù hợp. Việc này cần đi kèm kiểm soát quyền truy cập phiên, giới hạn thời gian tham gia, xử lý mất kết nối và bảo vệ dữ liệu trao đổi.

### 7.6.3 Bổ sung object storage cho tệp đính kèm

Hệ thống có thể bổ sung luồng tải lên và quản lý tệp đính kèm như ảnh xét nghiệm, tài liệu tham khảo hoặc tệp liên quan đến tư vấn. Hướng này cần object storage, kiểm soát loại tệp/kích thước, quét an toàn, phân quyền truy cập và chính sách lưu trữ dữ liệu sức khỏe.

### 7.6.4 Mở rộng báo cáo và phân tích

Phân hệ báo cáo có thể được phát triển thêm các bộ lọc và biểu đồ chi tiết hơn theo chuyên khoa, bác sĩ, trạng thái lịch hẹn, tỷ lệ hoàn tất tư vấn, phản hồi người dùng và xu hướng theo thời gian. Với dữ liệu lớn hơn, có thể cân nhắc cơ chế tổng hợp định kỳ hoặc kho dữ liệu báo cáo riêng.

### 7.6.5 Phát triển mobile client

Ngoài web responsive, hệ thống có thể phát triển ứng dụng mobile để cải thiện trải nghiệm đặt lịch, nhắc lịch, chat và nhận thông báo. Mobile client cần tái sử dụng API hiện có nhưng bổ sung kiểm thử đặc thù cho thiết bị di động, push notification và trạng thái offline/online.

### 7.6.6 Mở rộng hạ tầng realtime

Khi số lượng phiên tư vấn đồng thời tăng, phần realtime có thể cần adapter và hạ tầng phù hợp để scale nhiều backend instance, ví dụ cơ chế pub/sub cho Socket.IO, sticky session hoặc gateway chuyên biệt. Đây là hướng mở rộng vận hành, không phải yêu cầu bắt buộc trong phạm vi hiện tại.

### 7.6.7 Tích hợp với hệ thống y tế bên ngoài

Trong tương lai, hệ thống có thể xem xét tích hợp với hệ thống bệnh viện, hồ sơ sức khỏe điện tử hoặc các chuẩn trao đổi dữ liệu y tế nếu có yêu cầu thực tế. Hướng này cần đánh giá pháp lý, chuẩn dữ liệu, bảo mật, quyền riêng tư và quy trình đồng ý của người bệnh.

### 7.6.8 Hỗ trợ AI có kiểm soát an toàn

Một hướng mở rộng tùy chọn là bổ sung năng lực AI hỗ trợ phân loại câu hỏi, gợi ý thông tin tham khảo hoặc hỗ trợ bác sĩ trong việc tổng hợp nội dung tư vấn. Nếu triển khai, AI phải có giới hạn an toàn rõ ràng, không tự đưa ra chẩn đoán thay bác sĩ, không thay thế tư vấn chuyên môn và cần cơ chế kiểm duyệt, giải thích, ghi log cũng như bảo vệ dữ liệu sức khỏe.

## 7.7 Kết luận chung

Đề tài đã xây dựng được một hệ thống web có khả năng hỗ trợ quy trình tư vấn sức khỏe và quản lý lịch hẹn trực tuyến với các chức năng cốt lõi cho khách truy cập, bệnh nhân, bác sĩ và quản trị viên. Hệ thống đã có kiến trúc rõ ràng, mô hình dữ liệu phù hợp, các cơ chế bảo mật cơ bản, luồng đặt lịch có kiểm soát xung đột, tư vấn realtime qua chat, kết quả tư vấn, đơn thuốc cơ bản, đánh giá, thông báo, kiểm duyệt và báo cáo.

Kết quả kiểm thử cho thấy các thành phần quan trọng của hệ thống đã được xác minh ở nhiều mức độ khác nhau thông qua unit/service test, type-check, build và E2E core flows. Dù vẫn còn các hạn chế về kiểm thử nâng cao, provider production, video production, attachment storage, hiệu năng và khả năng mở rộng, hệ thống hiện tại đã đáp ứng mục tiêu chính của đề tài và tạo nền tảng phù hợp để tiếp tục phát triển trong các giai đoạn sau.
