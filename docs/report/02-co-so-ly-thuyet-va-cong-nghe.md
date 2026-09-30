# CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ

Chương này trình bày các khái niệm và công nghệ có liên quan trực tiếp đến hệ thống hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến. Nội dung tập trung vào vai trò của từng công nghệ trong hệ thống đã xây dựng, không trình bày các công nghệ nằm ngoài phạm vi triển khai thực tế.

## 2.1. Kiến trúc ứng dụng web Client–Server

Kiến trúc Client–Server là mô hình trong đó phía người dùng sử dụng một ứng dụng client để gửi yêu cầu, còn phía server chịu trách nhiệm xử lý nghiệp vụ, truy xuất dữ liệu và trả kết quả. Với ứng dụng web, client thường chạy trên trình duyệt, còn server cung cấp API và giao tiếp với cơ sở dữ liệu.

Trong hệ thống này, client là ứng dụng web React, phục vụ các nhóm người dùng như khách truy cập, bệnh nhân, bác sĩ và quản trị viên. Server là ứng dụng backend xử lý xác thực, phân quyền, đặt lịch, tư vấn, hỏi đáp sức khỏe, thông báo, kiểm duyệt và thống kê. Dữ liệu được lưu trữ tập trung trong cơ sở dữ liệu quan hệ PostgreSQL.

Mô hình Client–Server phù hợp với hệ thống vì các luồng nghiệp vụ cần được truy cập qua trình duyệt, trong khi các dữ liệu nhạy cảm như tài khoản, hồ sơ sức khỏe, lịch hẹn và kết quả tư vấn cần được xử lý tập trung ở phía server. Cách tổ chức này giúp tách giao diện người dùng khỏi xử lý nghiệp vụ, đồng thời hỗ trợ kiểm soát truy cập và bảo vệ dữ liệu tốt hơn.

## 2.2. REST API

REST API là cách thiết kế giao diện giao tiếp giữa client và server dựa trên các tài nguyên và phương thức HTTP. Client gửi yêu cầu như xem dữ liệu, tạo mới, cập nhật hoặc hủy thông tin; server xử lý và trả về dữ liệu theo định dạng phù hợp.

Trong hệ thống, REST API được sử dụng cho phần lớn các chức năng như đăng ký, đăng nhập, xem danh sách bác sĩ, đặt lịch hẹn, quản lý hồ sơ, gửi câu hỏi, xem lịch sử tư vấn, quản trị người dùng, quản lý chuyên khoa và xem báo cáo thống kê. Các yêu cầu từ giao diện web được gửi tới backend qua HTTP, sau đó backend xử lý nghiệp vụ và trả kết quả cho client.

REST API phù hợp với hệ thống vì các chức năng quản lý dữ liệu như tài khoản, hồ sơ, lịch hẹn và báo cáo có dạng yêu cầu-phản hồi rõ ràng. Mô hình này dễ tích hợp với ứng dụng web, dễ kiểm thử, dễ tài liệu hóa và phù hợp với các thao tác nghiệp vụ thông thường của hệ thống.

## 2.3. Modular Monolith

Modular Monolith là kiểu kiến trúc trong đó toàn bộ backend chạy trong một ứng dụng duy nhất, nhưng bên trong được chia thành các phần chức năng theo từng miền nghiệp vụ. Hệ thống không tách thành nhiều dịch vụ triển khai độc lập, nhưng vẫn giữ ranh giới logic giữa các nhóm chức năng.

Backend của hệ thống được tổ chức theo hướng modular monolith. Các nhóm nghiệp vụ như xác thực, bệnh nhân, bác sĩ, lịch hẹn, tư vấn, câu hỏi sức khỏe, thông báo, kiểm duyệt và báo cáo được tách thành các phần chức năng riêng trong cùng một ứng dụng server.

Kiến trúc này phù hợp với đề tài vì hệ thống có nhiều nghiệp vụ liên quan chặt chẽ đến nhau, đặc biệt là đặt lịch, tư vấn, hồ sơ người dùng và thông báo. Việc giữ backend trong một ứng dụng giúp đơn giản hóa triển khai, quản lý giao dịch dữ liệu và phát triển trong phạm vi đồ án, trong khi việc chia module vẫn giúp mã nguồn có cấu trúc rõ ràng và dễ bảo trì.

## 2.4. React

React là thư viện JavaScript dùng để xây dựng giao diện người dùng theo hướng component. Giao diện được chia thành các thành phần nhỏ, có thể tái sử dụng và cập nhật linh hoạt theo trạng thái dữ liệu.

Trong hệ thống này, React được sử dụng để xây dựng ứng dụng web phía người dùng. Các màn hình công khai, đăng nhập, đăng ký, đặt lịch, gửi câu hỏi, tư vấn, hồ sơ bệnh nhân, hồ sơ bác sĩ, quản trị và báo cáo đều được thể hiện trên giao diện web. React kết hợp với Vite, React Router, Redux Toolkit, Redux Saga, Axios, Tailwind CSS và một số thư viện giao diện để tổ chức trải nghiệm người dùng.

React phù hợp với hệ thống vì ứng dụng có nhiều màn hình và nhiều trạng thái tương tác: đăng nhập theo vai trò, lọc bác sĩ, chọn lịch trống, hiển thị lịch hẹn, gửi tin nhắn tư vấn và quản trị dữ liệu. Cách phát triển theo component giúp giao diện dễ mở rộng, tái sử dụng và duy trì tính nhất quán giữa các khu vực người dùng.

## 2.5. TypeScript

TypeScript là ngôn ngữ mở rộng từ JavaScript, bổ sung hệ thống kiểu tĩnh để giúp phát hiện lỗi sớm trong quá trình phát triển. TypeScript đặc biệt hữu ích với các ứng dụng có nhiều lớp dữ liệu, nhiều API và nhiều đối tượng nghiệp vụ.

Trong hệ thống, TypeScript được sử dụng ở cả frontend và backend. Phía frontend sử dụng TypeScript cho các màn hình, kiểu dữ liệu, API client và trạng thái ứng dụng. Phía backend sử dụng TypeScript trong ứng dụng Node.js/NestJS, các đối tượng truyền dữ liệu, service nghiệp vụ và cấu hình.

TypeScript phù hợp với hệ thống vì các dữ liệu như người dùng, bác sĩ, bệnh nhân, lịch hẹn, phiên tư vấn, đơn thuốc và thông báo có cấu trúc rõ ràng. Kiểu dữ liệu giúp giảm lỗi khi truyền dữ liệu giữa các phần của hệ thống, đồng thời tăng khả năng đọc hiểu và bảo trì mã nguồn.

## 2.6. Node.js

Node.js là môi trường chạy JavaScript/TypeScript phía server. Node.js phù hợp với các ứng dụng web cần xử lý nhiều yêu cầu mạng, API và giao tiếp thời gian thực.

Trong hệ thống, Node.js là nền tảng runtime cho backend. Backend tiếp nhận yêu cầu HTTP, xử lý xác thực, phân quyền, nghiệp vụ lịch hẹn, tư vấn, thông báo, kiểm duyệt và báo cáo. Node.js cũng phù hợp với việc sử dụng Socket.IO cho giao tiếp thời gian thực trong phiên tư vấn.

Node.js phù hợp với đề tài vì hệ thống cần phục vụ ứng dụng web, xử lý nhiều luồng yêu cầu ngắn, giao tiếp qua API và hỗ trợ realtime chat. Việc sử dụng cùng hệ sinh thái TypeScript cho cả frontend và backend cũng giúp quá trình phát triển nhất quán hơn.

## 2.7. NestJS

NestJS là framework backend cho Node.js, hỗ trợ xây dựng ứng dụng server theo cấu trúc rõ ràng, có cơ chế tổ chức chức năng, dependency injection, validation, guard và tích hợp WebSocket. NestJS giúp tổ chức mã nguồn backend theo hướng có kỷ luật hơn so với việc chỉ dùng các thư viện HTTP ở mức thấp.

Trong hệ thống này, NestJS được dùng để xây dựng backend cung cấp REST API, xác thực, phân quyền, xử lý nghiệp vụ, kết nối cơ sở dữ liệu, tài liệu API và realtime gateway. Các nhóm chức năng chính của hệ thống được tổ chức thành các phần nghiệp vụ riêng, phù hợp với cách NestJS khuyến khích chia tách trách nhiệm.

NestJS phù hợp với hệ thống vì đề tài có nhiều phân hệ và nhiều yêu cầu bảo mật, phân quyền, kiểm thử. Framework này giúp backend có cấu trúc ổn định, dễ mở rộng theo từng nhóm chức năng và phù hợp với việc xây dựng một ứng dụng web có nghiệp vụ tương đối đầy đủ.

## 2.8. PostgreSQL

PostgreSQL là hệ quản trị cơ sở dữ liệu quan hệ, hỗ trợ lưu trữ dữ liệu có cấu trúc, ràng buộc quan hệ, chỉ mục, giao dịch và tính nhất quán dữ liệu. Đây là lựa chọn phù hợp cho các hệ thống cần quản lý dữ liệu nghiệp vụ chặt chẽ.

Trong hệ thống, PostgreSQL lưu trữ dữ liệu người dùng, phiên đăng nhập, hồ sơ bệnh nhân, hồ sơ bác sĩ, chuyên khoa, câu hỏi, câu trả lời, lịch hẹn, phiên tư vấn, tin nhắn, đơn thuốc, đánh giá, thông báo, sự kiện outbox và nhật ký kiểm toán.

PostgreSQL phù hợp với hệ thống vì các dữ liệu trong bài toán có quan hệ rõ ràng: bệnh nhân đặt lịch với bác sĩ, bác sĩ thuộc chuyên khoa, lịch hẹn liên kết với phiên tư vấn, phiên tư vấn liên kết với tóm tắt và đơn thuốc. Cơ sở dữ liệu quan hệ giúp mô hình hóa các quan hệ này một cách nhất quán và hỗ trợ truy vấn phục vụ quản lý, báo cáo.

## 2.9. Prisma ORM

Prisma ORM là công cụ ánh xạ giữa mã nguồn ứng dụng và cơ sở dữ liệu. Prisma cho phép định nghĩa schema dữ liệu, sinh client truy vấn có kiểu dữ liệu và quản lý migration cơ sở dữ liệu.

Trong hệ thống, Prisma được dùng làm lớp truy cập dữ liệu giữa backend và PostgreSQL. Các bảng dữ liệu chính, enum nghiệp vụ và quan hệ giữa các thực thể được định nghĩa trong Prisma schema. Backend dùng Prisma để đọc, tạo, cập nhật và truy vấn dữ liệu phục vụ các chức năng như đặt lịch, tư vấn, hỏi đáp, thông báo và báo cáo.

Prisma phù hợp với hệ thống vì ứng dụng sử dụng TypeScript và có nhiều mô hình dữ liệu quan hệ. Prisma giúp truy vấn dữ liệu an toàn hơn về kiểu, giảm lỗi khi thao tác với cơ sở dữ liệu và hỗ trợ quy trình migration rõ ràng trong quá trình phát triển.

## 2.10. JWT Authentication

JWT authentication là cơ chế xác thực trong đó server cấp cho người dùng một token sau khi đăng nhập thành công. Token này được gửi kèm trong các yêu cầu tiếp theo để backend xác định danh tính người dùng.

Trong hệ thống, JWT được sử dụng cho xác thực các tài khoản bệnh nhân, bác sĩ và quản trị viên. Sau khi đăng nhập, người dùng nhận access token để gọi các API cần xác thực. Hệ thống cũng sử dụng refresh token được bảo vệ bằng cookie HTTP-only để hỗ trợ duy trì phiên đăng nhập một cách an toàn hơn.

JWT phù hợp với hệ thống vì các chức năng như đặt lịch, xem hồ sơ, tham gia tư vấn, quản lý nội dung và xem báo cáo đều cần xác định người dùng đang thao tác. Cơ chế token giúp backend kiểm tra danh tính ở mỗi yêu cầu, hỗ trợ ứng dụng web tách biệt frontend và backend.

## 2.11. RBAC

RBAC là mô hình phân quyền dựa trên vai trò. Thay vì cấp quyền riêng lẻ cho từng người dùng, hệ thống xác định các vai trò và giới hạn chức năng theo từng vai trò.

Trong hệ thống, RBAC được áp dụng cho các nhóm Guest User, Patient, Doctor và Administrator. Khách truy cập chỉ xem được nội dung công khai. Bệnh nhân được sử dụng các chức năng liên quan đến hồ sơ, câu hỏi, lịch hẹn và tư vấn của mình. Bác sĩ được xử lý hồ sơ chuyên môn, lịch làm việc, câu hỏi và lịch hẹn được phân quyền. Quản trị viên được quản lý dữ liệu vận hành, kiểm duyệt nội dung và xem thống kê hệ thống.

RBAC phù hợp với hệ thống vì dữ liệu sức khỏe và dữ liệu tư vấn cần được giới hạn theo trách nhiệm của từng nhóm người dùng. Mô hình này giúp giảm rủi ro truy cập sai quyền, đồng thời làm rõ ranh giới chức năng giữa bệnh nhân, bác sĩ và quản trị viên.

## 2.12. WebSocket và Socket.IO

WebSocket là cơ chế giao tiếp hai chiều liên tục giữa client và server, phù hợp với các chức năng cần cập nhật theo thời gian thực. Socket.IO là thư viện xây dựng trên ý tưởng giao tiếp realtime, cung cấp thêm các tiện ích như quản lý kết nối, sự kiện, phòng và khả năng tương thích tốt hơn trong ứng dụng web.

Trong hệ thống, Socket.IO được sử dụng cho chức năng chat trong phiên tư vấn trực tuyến. Khi bệnh nhân và bác sĩ tham gia cùng một phiên tư vấn, tin nhắn có thể được gửi và nhận gần như tức thời, thay vì phải liên tục tải lại trang hoặc gọi API lặp lại.

Socket.IO phù hợp với hệ thống vì tư vấn trực tuyến cần tương tác hai chiều giữa bệnh nhân và bác sĩ. REST API phù hợp với thao tác quản lý dữ liệu, nhưng chat tư vấn cần trải nghiệm realtime hơn. Việc kết hợp REST API và Socket.IO giúp hệ thống vừa xử lý tốt nghiệp vụ thông thường, vừa hỗ trợ giao tiếp trực tiếp trong phiên tư vấn.

## 2.13. bcrypt và bảo mật mật khẩu

bcrypt là thuật toán băm mật khẩu có cơ chế thêm salt và chi phí tính toán, giúp giảm rủi ro khi dữ liệu mật khẩu bị lộ. Thay vì lưu mật khẩu gốc, hệ thống chỉ lưu giá trị băm của mật khẩu.

Trong hệ thống, bcrypt được sử dụng để xử lý mật khẩu người dùng. Khi người dùng đăng ký hoặc đặt lại mật khẩu, mật khẩu được băm trước khi lưu. Khi đăng nhập, mật khẩu nhập vào được so sánh với giá trị băm đã lưu để xác thực.

bcrypt phù hợp với hệ thống vì tài khoản người dùng gắn với thông tin cá nhân, hồ sơ sức khỏe và lịch sử tư vấn. Việc không lưu mật khẩu dạng rõ là yêu cầu bảo mật cơ bản, giúp giảm thiểu rủi ro nếu dữ liệu xác thực bị truy cập trái phép.

## 2.14. Transaction và tính nhất quán dữ liệu

Transaction là cơ chế đảm bảo một nhóm thao tác dữ liệu được thực hiện như một đơn vị thống nhất. Nếu một thao tác trong nhóm thất bại, các thay đổi liên quan có thể được hủy để tránh dữ liệu ở trạng thái không nhất quán.

Trong hệ thống, transaction đặc biệt quan trọng với các nghiệp vụ như đặt lịch và đổi lịch. Khi bệnh nhân đặt lịch, hệ thống cần kiểm tra bác sĩ, bệnh nhân, thời gian, trạng thái lịch hẹn và xung đột lịch. Các thao tác này phải đảm bảo rằng không tạo ra hai lịch hẹn trùng nhau hoặc dữ liệu lịch hẹn thiếu thông tin liên quan.

Transaction phù hợp với hệ thống vì lịch hẹn là dữ liệu nghiệp vụ trung tâm, có ảnh hưởng trực tiếp đến bệnh nhân và bác sĩ. Tính nhất quán dữ liệu giúp tránh các lỗi như đặt trùng lịch, cập nhật trạng thái không đồng bộ hoặc tạo sự kiện thông báo không khớp với lịch hẹn thực tế.

## 2.15. Outbox Pattern

Outbox Pattern là mẫu thiết kế dùng để lưu sự kiện cần xử lý sau vào cơ sở dữ liệu trong cùng giao dịch với thao tác nghiệp vụ chính. Sau đó, một tiến trình xử lý riêng đọc các sự kiện này và thực hiện các tác vụ phụ như gửi thông báo.

Trong hệ thống, Outbox Pattern được dùng cho các sự kiện liên quan đến lịch hẹn và câu hỏi sức khỏe, ví dụ khi lịch hẹn được tạo, lịch hẹn được xác nhận hoặc câu hỏi được bác sĩ trả lời. Thay vì buộc thao tác nghiệp vụ phải phụ thuộc trực tiếp vào việc gửi thông báo ngay lập tức, hệ thống ghi nhận sự kiện để xử lý sau.

Outbox Pattern phù hợp với hệ thống vì thông báo là chức năng hỗ trợ, trong khi dữ liệu nghiệp vụ chính như lịch hẹn và câu trả lời cần được ghi nhận ổn định. Mẫu này giúp tách xử lý nghiệp vụ khỏi xử lý thông báo, giảm rủi ro việc gửi thông báo thất bại làm ảnh hưởng đến thao tác chính của người dùng.

## 2.16. Responsive Web Design

Responsive Web Design là phương pháp thiết kế giao diện có khả năng thích ứng với nhiều kích thước màn hình khác nhau, như desktop, tablet và mobile. Giao diện responsive giúp người dùng sử dụng hệ thống thuận tiện hơn trên các thiết bị phổ biến.

Trong hệ thống, giao diện web phục vụ nhiều nhóm người dùng và nhiều loại thao tác như xem bác sĩ, điền biểu mẫu, đặt lịch, chat tư vấn, xem lịch sử và quản trị dữ liệu. Frontend sử dụng các kỹ thuật và thư viện giao diện hỗ trợ bố cục linh hoạt, trong đó Tailwind CSS được dùng để xây dựng giao diện có khả năng thích ứng.

Responsive Web Design phù hợp với hệ thống vì bệnh nhân và bác sĩ có thể cần truy cập từ nhiều thiết bị khác nhau. Một giao diện thích ứng tốt giúp các thao tác quan trọng như đăng nhập, tìm bác sĩ, đặt lịch, xem lịch hẹn và tham gia tư vấn dễ sử dụng hơn.

## 2.17. Các công nghệ kiểm thử thực tế được sử dụng

Kiểm thử là hoạt động xác minh hệ thống có đáp ứng các yêu cầu chức năng và hành vi mong đợi hay không. Với hệ thống này, kiểm thử được thực hiện ở cả backend và frontend.

Phía backend sử dụng Jest để kiểm thử các phần xử lý nghiệp vụ và các cơ chế quan trọng như xác thực, cấu hình, xử lý lỗi, lịch hẹn, thông báo, kiểm duyệt, báo cáo và hồ sơ bác sĩ. Jest phù hợp vì backend được viết bằng TypeScript trên Node.js, cần kiểm tra các quy tắc nghiệp vụ và phản hồi của hệ thống ở mức xử lý phía server.

Phía frontend sử dụng Playwright để kiểm thử end-to-end các luồng người dùng trên trình duyệt. Các kịch bản kiểm thử thực tế bao gồm truy cập công khai, đăng nhập theo vai trò, đặt lịch, gửi câu hỏi, luồng làm việc của bác sĩ, quản trị hệ thống và kiểm tra client Socket.IO. Playwright phù hợp vì hệ thống là ứng dụng web có nhiều tương tác UI, nhiều vai trò và nhiều luồng cần xác minh từ góc nhìn người dùng.

Ngoài ra, quá trình kiểm thử sử dụng cơ sở dữ liệu PostgreSQL với dữ liệu seed phục vụ E2E. Cách tiếp cận này giúp các kịch bản kiểm thử phản ánh gần hơn các luồng nghiệp vụ thực tế như bệnh nhân đặt lịch với bác sĩ, bác sĩ xử lý tư vấn và quản trị viên quản lý dữ liệu hệ thống.

Kết quả kiểm thử chi tiết được trình bày ở Chương 6. Trong chương này, các công nghệ kiểm thử chỉ được giới thiệu ở mức cơ sở công nghệ để làm rõ vì sao chúng phù hợp với hệ thống.
