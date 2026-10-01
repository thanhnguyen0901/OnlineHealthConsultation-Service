# BÁO CÁO TỐT NGHIỆP

**Đề tài: Thiết kế và xây dựng hệ thống hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến**

## TÓM TẮT

Đề tài xây dựng ứng dụng web nhằm tập trung việc tìm bác sĩ, đặt lịch và theo dõi tư vấn sức khỏe. Hệ thống phục vụ khách truy cập, bệnh nhân, bác sĩ và quản trị viên, hỗ trợ tra cứu, hỏi đáp, quản lý lịch hẹn, tư vấn trực tuyến, lưu kết quả, đơn thuốc và quản trị hoạt động.

Ứng dụng sử dụng React SPA, NestJS theo kiến trúc Modular Monolith, PostgreSQL và Prisma. JWT/RBAC hỗ trợ xác thực và phân quyền; Socket.IO cung cấp chat thời gian thực. Kết quả đã ghi nhận gồm 47 ca kiểm thử backend đạt và 42/43 core E2E đạt, 0 thất bại, 1 skipped; Graduation E2E chưa đạt đầy đủ. Email thương mại, video nâng cao và luồng tệp đính kèm còn cần hoàn thiện. Hệ thống hỗ trợ tư vấn, không thay thế chẩn đoán y khoa, cấp cứu hoặc khám trực tiếp.

## MỤC LỤC

- [CHƯƠNG 1. TỔNG QUAN](#chương-1-tổng-quan)
  - [1.1 Giới thiệu](#11-giới-thiệu)
  - [1.2 Mục tiêu](#12-mục-tiêu)
  - [1.3 Phạm vi](#13-phạm-vi)
  - [1.4 Phương pháp thực hiện](#14-phương-pháp-thực-hiện)
- [CHƯƠNG 2. CÔNG NGHỆ SỬ DỤNG](#chương-2-công-nghệ-sử-dụng)
  - [2.1 Công nghệ frontend](#21-công-nghệ-frontend)
  - [2.2 Công nghệ backend](#22-công-nghệ-backend)
  - [2.3 Cơ sở dữ liệu và truy cập dữ liệu](#23-cơ-sở-dữ-liệu-và-truy-cập-dữ-liệu)
  - [2.4 Xác thực và phân quyền](#24-xác-thực-và-phân-quyền)
  - [2.5 Các kỹ thuật hỗ trợ](#25-các-kỹ-thuật-hỗ-trợ)
  - [2.6 Công cụ kiểm thử](#26-công-cụ-kiểm-thử)
  - [2.7 Tổng hợp công nghệ](#27-tổng-hợp-công-nghệ)
- [CHƯƠNG 3. PHÂN TÍCH YÊU CẦU HỆ THỐNG](#chương-3-phân-tích-yêu-cầu-hệ-thống)
  - [3.1 Mô tả bài toán](#31-mô-tả-bài-toán)
  - [3.2 Đối tượng sử dụng](#32-đối-tượng-sử-dụng)
  - [3.3 Yêu cầu chức năng](#33-yêu-cầu-chức-năng)
  - [3.4 Yêu cầu phi chức năng](#34-yêu-cầu-phi-chức-năng)
  - [3.5 Quy tắc nghiệp vụ](#35-quy-tắc-nghiệp-vụ)
  - [3.6 Biểu đồ Use Case](#36-biểu-đồ-use-case)
    - [3.6.1 Biểu đồ Use Case của khách truy cập](#361-biểu-đồ-use-case-của-khách-truy-cập)
    - [3.6.2 Biểu đồ Use Case của bệnh nhân](#362-biểu-đồ-use-case-của-bệnh-nhân)
    - [3.6.3 Biểu đồ Use Case của bác sĩ](#363-biểu-đồ-use-case-của-bác-sĩ)
    - [3.6.4 Biểu đồ Use Case của quản trị viên](#364-biểu-đồ-use-case-của-quản-trị-viên)
  - [3.7 Luồng hoạt động tổng quát](#37-luồng-hoạt-động-tổng-quát)
- [CHƯƠNG 4. THIẾT KẾ HỆ THỐNG](#chương-4-thiết-kế-hệ-thống)
  - [4.1 Kiến trúc tổng thể](#41-kiến-trúc-tổng-thể)
  - [4.2 Thiết kế backend](#42-thiết-kế-backend)
  - [4.3 Thiết kế frontend](#43-thiết-kế-frontend)
  - [4.4 Thiết kế cơ sở dữ liệu](#44-thiết-kế-cơ-sở-dữ-liệu)
  - [4.5 Thiết kế xác thực và phân quyền](#45-thiết-kế-xác-thực-và-phân-quyền)
  - [4.6 Các luồng xử lý tiêu biểu](#46-các-luồng-xử-lý-tiêu-biểu)
    - [4.6.1 Đăng nhập](#461-đăng-nhập)
    - [4.6.2 Đặt lịch tư vấn](#462-đặt-lịch-tư-vấn)
    - [4.6.3 Tư vấn trực tuyến](#463-tư-vấn-trực-tuyến)
    - [4.6.4 Kết quả tư vấn và đơn thuốc](#464-kết-quả-tư-vấn-và-đơn-thuốc)
    - [4.6.5 Thông báo và kiểm duyệt](#465-thông-báo-và-kiểm-duyệt)
- [CHƯƠNG 5. XÂY DỰNG HỆ THỐNG](#chương-5-xây-dựng-hệ-thống)
  - [5.1 Xác thực và phân quyền](#51-xác-thực-và-phân-quyền)
  - [5.2 Tra cứu chuyên khoa và bác sĩ](#52-tra-cứu-chuyên-khoa-và-bác-sĩ)
  - [5.3 Hồ sơ bệnh nhân](#53-hồ-sơ-bệnh-nhân)
  - [5.4 Hồ sơ bác sĩ và lịch làm việc](#54-hồ-sơ-bác-sĩ-và-lịch-làm-việc)
  - [5.5 Hỏi đáp sức khỏe](#55-hỏi-đáp-sức-khỏe)
  - [5.6 Đặt lịch tư vấn](#56-đặt-lịch-tư-vấn)
  - [5.7 Tư vấn trực tuyến](#57-tư-vấn-trực-tuyến)
  - [5.8 Kết quả tư vấn và đơn thuốc](#58-kết-quả-tư-vấn-và-đơn-thuốc)
  - [5.9 Đánh giá tư vấn](#59-đánh-giá-tư-vấn)
  - [5.10 Thông báo và nhắc lịch](#510-thông-báo-và-nhắc-lịch)
  - [5.11 Quản trị và kiểm duyệt nội dung](#511-quản-trị-và-kiểm-duyệt-nội-dung)
  - [5.12 Thống kê và báo cáo](#512-thống-kê-và-báo-cáo)
  - [5.13 Tổng hợp triển khai](#513-tổng-hợp-triển-khai)
- [CHƯƠNG 6. KIỂM THỬ VÀ ĐÁNH GIÁ](#chương-6-kiểm-thử-và-đánh-giá)
  - [6.1 Phạm vi và mục tiêu kiểm thử](#61-phạm-vi-và-mục-tiêu-kiểm-thử)
  - [6.2 Môi trường và phương pháp kiểm thử](#62-môi-trường-và-phương-pháp-kiểm-thử)
  - [6.3 Kiểm thử backend](#63-kiểm-thử-backend)
  - [6.4 Kiểm thử E2E](#64-kiểm-thử-e2e)
  - [6.5 Tổng hợp kết quả kiểm thử](#65-tổng-hợp-kết-quả-kiểm-thử)
  - [6.6 Mức độ bao phủ yêu cầu](#66-mức-độ-bao-phủ-yêu-cầu)
  - [6.7 Giới hạn kiểm thử](#67-giới-hạn-kiểm-thử)
- [CHƯƠNG 7. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN](#chương-7-kết-luận-và-hướng-phát-triển)
  - [7.1 Kết quả đạt được](#71-kết-quả-đạt-được)
  - [7.2 Hạn chế](#72-hạn-chế)
  - [7.3 Hướng phát triển](#73-hướng-phát-triển)
  - [7.4 Bài học kinh nghiệm](#74-bài-học-kinh-nghiệm)
  - [7.5 Kết luận](#75-kết-luận)

- [TÀI LIỆU THAM KHẢO](#tài-liệu-tham-khảo)

## DANH MỤC HÌNH

| Số | Tên | Vị trí |
|---|---|---|
| Hình 3.1 | Biểu đồ Use Case của khách truy cập | Mục 3.6.1 |
| Hình 3.2 | Biểu đồ Use Case của bệnh nhân | Mục 3.6.2 |
| Hình 3.3 | Biểu đồ Use Case của bác sĩ | Mục 3.6.3 |
| Hình 3.4 | Biểu đồ Use Case của quản trị viên | Mục 3.6.4 |
| Hình 3.5 | Luồng hoạt động tổng quát của hệ thống | Mục 3.7 |
| Hình 4.1 | Kiến trúc tổng thể của hệ thống | Mục 4.1 |
| Hình 4.2 | Sơ đồ lớp các thành phần backend chính | Mục 4.2 |
| Hình 4.3 | Sơ đồ quan hệ thực thể của hệ thống | Mục 4.4 |
| Hình 4.4 | Biểu đồ tuần tự đăng nhập người dùng | Mục 4.6.1 |
| Hình 4.5 | Biểu đồ tuần tự đặt lịch tư vấn | Mục 4.6.2 |
| Hình 4.6 | Biểu đồ tuần tự chat realtime trong phiên tư vấn | Mục 4.6.3 |
| Hình 4.7 | Biểu đồ tuần tự tạo đơn thuốc sau tư vấn | Mục 4.6.4 |
| Hình 4.8 | Biểu đồ tuần tự xử lý thông báo bất đồng bộ qua outbox | Mục 4.6.5 |
| Hình 4.9 | Biểu đồ tuần tự kiểm duyệt câu hỏi và phản hồi | Mục 4.6.5 |
| Hình 5.1 | Giao diện tra cứu chuyên khoa và bác sĩ | Mục 5.2 |
| Hình 5.2 | Giao diện đặt lịch hẹn trực tuyến | Mục 5.6 |
| Hình 5.3 | Giao diện tư vấn trực tuyến và trao đổi tin nhắn | Mục 5.7 |
| Hình 5.4 | Giao diện quản trị hệ thống | Mục 5.11 |

## DANH MỤC BẢNG

| Số | Tên | Vị trí |
|---|---|---|
| Bảng 2.1 | Công nghệ chính sử dụng trong hệ thống | Mục 2.7 |
| Bảng 3.1 | Tác nhân và vai trò trong hệ thống | Mục 3.2 |
| Bảng 3.2 | Tóm tắt yêu cầu chức năng theo nhóm | Mục 3.3 |
| Bảng 4.1 | Vai trò thiết kế của các module backend | Mục 4.2 |
| Bảng 4.2 | Nhóm dữ liệu chính của hệ thống | Mục 4.4 |
| Bảng 5.1 | Tổng hợp các chức năng đã triển khai | Mục 5.13 |
| Bảng 6.1 | Bộ ca kiểm thử tiêu biểu | Mục 6.2 |
| Bảng 6.2 | Các nhóm luồng E2E đã kiểm thử | Mục 6.4 |
| Bảng 6.3 | Kết quả kiểm thử tổng hợp | Mục 6.5 |
| Bảng 6.4 | Kết quả các bộ kiểm thử E2E | Mục 6.5 |
| Bảng 6.5 | Mức độ bao phủ yêu cầu SRS | Mục 6.6 |
| Bảng 7.1 | Mức độ đáp ứng mục tiêu đề tài | Mục 7.1 |

## DANH MỤC TỪ VIẾT TẮT

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

# CHƯƠNG 1. TỔNG QUAN

## 1.1 Giới thiệu

Trong những năm gần đây, nhu cầu tiếp cận thông tin chăm sóc sức khỏe và đặt lịch tư vấn y tế trực tuyến ngày càng tăng. Người dùng có xu hướng tìm kiếm thông tin bác sĩ, chuyên khoa, thời gian tư vấn phù hợp và mong muốn nhận được phản hồi chuyên môn nhanh chóng hơn thông qua các nền tảng trực tuyến. Bên cạnh đó, việc quản lý lịch hẹn, theo dõi lịch sử tư vấn và nhắc lịch cũng là những nhu cầu thiết thực đối với cả người bệnh và nhân viên y tế.

Trong thực tế, quy trình tìm kiếm bác sĩ, đặt lịch tư vấn và trao đổi thông tin sức khỏe nếu thực hiện rời rạc có thể gây mất thời gian, khó theo dõi và thiếu tính tập trung. Bệnh nhân có thể gặp khó khăn trong việc biết bác sĩ nào phù hợp với chuyên khoa cần tư vấn, thời gian nào còn trống, hoặc lịch sử tư vấn trước đó được lưu ở đâu. Về phía bác sĩ và người quản trị, việc tiếp nhận câu hỏi, quản lý lịch hẹn, theo dõi trạng thái tư vấn và kiểm duyệt nội dung cũng cần một công cụ hỗ trợ có tổ chức.

Xuất phát từ bối cảnh trên, đề tài **“Thiết kế và xây dựng hệ thống hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến”** được lựa chọn nhằm xây dựng một hệ thống web hỗ trợ người dùng tra cứu bác sĩ, đặt lịch tư vấn, gửi câu hỏi sức khỏe, tham gia tư vấn trực tuyến và theo dõi kết quả tư vấn. Hệ thống được định hướng là công cụ hỗ trợ tư vấn và quản lý lịch hẹn, không thay thế cho chẩn đoán y khoa chuyên nghiệp, cấp cứu y tế hoặc việc khám trực tiếp khi cần thiết.

## 1.2 Mục tiêu

Mục tiêu của đề tài là phân tích, thiết kế và xây dựng một ứng dụng web hỗ trợ quy trình tư vấn sức khỏe và quản lý lịch hẹn trực tuyến.

Các mục tiêu cụ thể gồm:

- Hỗ trợ tra cứu chuyên khoa, bác sĩ và thông tin công khai trước khi đặt lịch.
- Xây dựng các chức năng cho khách truy cập, bệnh nhân, bác sĩ và quản trị viên, với xác thực và phân quyền phù hợp.
- Kết nối hồ sơ sức khỏe, hỏi đáp, đặt lịch, tư vấn qua chat, kết quả tư vấn, đơn thuốc điện tử cơ bản và đánh giá trong cùng quy trình.
- Cung cấp công cụ quản trị, kiểm duyệt, thông báo, nhắc lịch và thống kê hoạt động.
- Áp dụng các biện pháp bảo vệ dữ liệu, kiểm soát truy cập và kiểm thử các luồng nghiệp vụ chính.

## 1.3 Phạm vi

Phạm vi đề tài tập trung vào việc xây dựng một ứng dụng web phục vụ các nghiệp vụ tư vấn sức khỏe trực tuyến và quản lý lịch hẹn. Các chức năng bắt buộc trong phạm vi bao gồm truy cập nội dung công khai, quản lý tài khoản và phân quyền, quản lý hồ sơ bệnh nhân và bác sĩ, quản lý chuyên khoa, tìm kiếm bác sĩ, gửi câu hỏi sức khỏe, đặt lịch tư vấn, quản lý lịch hẹn, tư vấn trực tuyến qua chat, ghi nhận kết quả tư vấn, đơn thuốc điện tử cơ bản, đánh giá tư vấn, quản trị hệ thống, kiểm duyệt nội dung, thống kê hoạt động và thông báo nhắc lịch.

Video ở mức mô phỏng hoặc tích hợp cơ bản được xem xét trong phạm vi tư vấn; video nâng cao chưa thuộc phạm vi cốt lõi. Một số chức năng được xác định là hướng mở rộng hoặc phụ thuộc điều kiện tích hợp hạ tầng, chẳng hạn như cuộc gọi tư vấn truyền hình (video), gửi thông báo nhắc lịch qua tin nhắn SMS, trợ lý tương tác tự động, hỗ trợ đa ngôn ngữ, chế độ giao diện tối (Dark Mode), cũng như các biểu đồ và bộ lọc phân tích nâng cao. Các chức năng này không làm thay đổi mục tiêu cốt lõi của hệ thống là hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến.

Đề tài không bao gồm việc chẩn đoán y khoa tự động bằng trí tuệ nhân tạo trong môi trường thực tế, không kết nối với hệ thống bệnh viện hoặc hồ sơ bệnh án điện tử bên ngoài, không tích hợp thiết bị IoT hay thiết bị đeo theo dõi sức khỏe, không xử lý thanh toán bảo hiểm y tế, quản lý giao nhận thuốc hoặc tích hợp nhà thuốc, không triển khai video chất lượng cao có ghi hình, lưu trữ và phát lại, không phát triển ứng dụng di động độc lập (native app), đồng thời không bao gồm các quy trình khám chữa bệnh từ xa nâng cao như xác nhận đồng ý điện tử (e-consent), chuyển tuyến chuyên khoa hay phân loại bệnh nhân tự động.

## 1.4 Phương pháp thực hiện

Đề tài được thực hiện theo hướng phân tích yêu cầu, thiết kế hệ thống, xây dựng ứng dụng và kiểm thử đánh giá.

Trước hết, yêu cầu hệ thống được xác định dựa trên tài liệu đặc tả yêu cầu phần mềm, trong đó làm rõ mục tiêu, phạm vi, tác nhân, ca sử dụng, luồng nghiệp vụ và các yêu cầu chức năng, phi chức năng. Trên cơ sở đó, hệ thống được thiết kế theo hướng ứng dụng web có phân quyền, có các nhóm chức năng cho bệnh nhân, bác sĩ và quản trị viên, đồng thời có cơ chế hỗ trợ tư vấn trực tuyến và quản lý lịch hẹn.

Sau giai đoạn phân tích và thiết kế, hệ thống được xây dựng thành ứng dụng web với giao diện người dùng, xử lý nghiệp vụ phía máy chủ, lưu trữ dữ liệu và các chức năng hỗ trợ như thông báo, kiểm duyệt và thống kê. Việc kiểm thử được thực hiện nhằm xác minh các luồng chính như truy cập công khai, đăng nhập, đặt lịch, hỏi đáp sức khỏe, tư vấn, quản trị và các kiểm soát truy cập theo vai trò.

# CHƯƠNG 2. CÔNG NGHỆ SỬ DỤNG

## 2.1 Công nghệ frontend

Frontend sử dụng React và TypeScript để xây dựng ứng dụng web một trang (SPA). Vite hỗ trợ chạy môi trường phát triển và đóng gói ứng dụng; React Router quản lý điều hướng giữa khu vực công khai và các màn hình theo vai trò.

Redux Toolkit quản lý trạng thái, Redux Saga xử lý các luồng bất đồng bộ và Axios thực hiện các yêu cầu API. Tailwind CSS được dùng để xây dựng giao diện responsive cho desktop, tablet và trình duyệt trên thiết bị di động.

## 2.2 Công nghệ backend

Backend sử dụng Node.js, NestJS và TypeScript. NestJS cung cấp cách tổ chức module, Dependency Injection, controller, service, DTO validation, guard và WebSocket gateway.

Ứng dụng cung cấp REST API cho các chức năng xác thực, hồ sơ, tra cứu, đặt lịch, hỏi đáp, quản trị và báo cáo. Client gửi yêu cầu HTTP với các phương thức GET, POST, PUT, PATCH hoặc DELETE; backend xử lý nghiệp vụ và trả dữ liệu JSON. Cách tổ chức backend theo Modular Monolith được trình bày ở mục 4.2.

## 2.3 Cơ sở dữ liệu và truy cập dữ liệu

PostgreSQL 16 lưu trữ dữ liệu quan hệ của hệ thống, hỗ trợ giao dịch ACID, khóa ngoại và chỉ mục. Dữ liệu bao gồm tài khoản, phiên đăng nhập, hồ sơ, chuyên khoa, câu hỏi, lịch hẹn, phiên tư vấn, tin nhắn, đơn thuốc, đánh giá, thông báo, outbox và audit log.

Prisma ORM là lớp truy cập dữ liệu giữa NestJS và PostgreSQL. Prisma schema định nghĩa cấu trúc dữ liệu; Prisma Client cung cấp truy vấn an toàn kiểu và migration hỗ trợ quản lý thay đổi cơ sở dữ liệu.

## 2.4 Xác thực và phân quyền

Hệ thống sử dụng JWT access token để xác thực yêu cầu API và refresh token trong cookie HttpOnly để duy trì phiên đăng nhập. bcrypt được dùng để băm mật khẩu trước khi lưu vào cơ sở dữ liệu.

RBAC kiểm soát quyền theo vai trò, kết hợp kiểm tra quyền sở hữu tại backend để giới hạn truy cập dữ liệu cá nhân. Khách truy cập sử dụng khu vực công khai; bệnh nhân, bác sĩ và quản trị viên sử dụng các chức năng sau khi đăng nhập.

## 2.5 Các kỹ thuật hỗ trợ

Socket.IO cung cấp kênh chat thời gian thực trong phiên tư vấn, với cơ chế phòng, phát sự kiện và kết nối lại.

Transaction được dùng trong đặt lịch, đổi lịch và tạo đơn thuốc để giữ dữ liệu nhất quán. Outbox Pattern lưu sự kiện trong cùng transaction với nghiệp vụ chính, sau đó xử lý thông báo bằng tác vụ nền. Cách xử lý này cho phép thử lại khi kênh gửi thông báo gặp lỗi.

## 2.6 Công cụ kiểm thử

Jest được dùng cho kiểm thử đơn vị và kiểm thử dịch vụ backend, chủ yếu với mock Prisma hoặc các dependency. Playwright kiểm thử các luồng người dùng trên trình duyệt với backend và PostgreSQL có dữ liệu mẫu.

TypeScript compiler, Nest CLI và Vite hỗ trợ kiểm tra kiểu tĩnh và build. Phạm vi và kết quả kiểm thử được trình bày ở Chương 6.

## 2.7 Tổng hợp công nghệ

Bảng 2.1. Công nghệ chính sử dụng trong hệ thống

| Thành phần | Công nghệ / Thư viện | Vai trò |
|---|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS | Xây dựng giao diện web responsive |
| State Management | Redux Toolkit, Redux Saga | Quản lý trạng thái và luồng bất đồng bộ |
| Backend | Node.js, NestJS, TypeScript | Xây dựng REST API và WebSocket gateway |
| Cơ sở dữ liệu | PostgreSQL 16 | Lưu trữ dữ liệu quan hệ |
| ORM | Prisma ORM | Truy cập dữ liệu và migration |
| Xác thực / Phân quyền | JWT, bcrypt, RBAC Guards | Xác thực và kiểm soát quyền truy cập |
| Thời gian thực | Socket.IO | Kênh chat thời gian thực trong phiên tư vấn |
| Kiểm thử Backend | Jest | Kiểm thử đơn vị và tích hợp dịch vụ |
| Kiểm thử Frontend | Playwright | Kiểm thử luồng người dùng End-to-End |

# CHƯƠNG 3. PHÂN TÍCH YÊU CẦU HỆ THỐNG

## 3.1 Mô tả bài toán

Hệ thống hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến được xây dựng nhằm hỗ trợ quy trình kết nối giữa người có nhu cầu tư vấn sức khỏe và bác sĩ trên nền tảng web. Bài toán chính của hệ thống là giúp người dùng tra cứu thông tin bác sĩ, tìm kiếm theo chuyên khoa, đặt lịch tư vấn, gửi câu hỏi sức khỏe, tham gia phiên tư vấn trực tuyến và theo dõi kết quả tư vấn trong một môi trường có kiểm soát truy cập.

Trong bối cảnh sử dụng thực tế, bệnh nhân cần một nơi tập trung để tìm bác sĩ phù hợp, quản lý hồ sơ sức khỏe, theo dõi lịch hẹn và xem lại lịch sử tư vấn. Bác sĩ cần công cụ để quản lý hồ sơ chuyên môn, lịch làm việc, câu hỏi của bệnh nhân, lịch hẹn và kết quả tư vấn. Quản trị viên cần giám sát dữ liệu vận hành, quản lý người dùng, chuyên khoa, lịch hẹn, nội dung tư vấn và thống kê hoạt động hệ thống.

Hệ thống không được định nghĩa như một công cụ chẩn đoán y khoa tự động và không thay thế cho cấp cứu hoặc khám trực tiếp khi cần thiết. Vai trò của hệ thống là hỗ trợ tư vấn sức khỏe trực tuyến, quản lý lịch hẹn, ghi nhận thông tin tư vấn và giúp quá trình trao đổi giữa bệnh nhân, bác sĩ, quản trị viên được tổ chức rõ ràng hơn.

## 3.2 Đối tượng sử dụng

Hệ thống có bốn nhóm người dùng chính:

Bảng 3.1. Tác nhân và vai trò trong hệ thống

| Đối tượng | Mô tả vai trò | Nhóm ca sử dụng liên quan |
|---|---|---|
| Khách truy cập | Người dùng chưa đăng nhập. Có thể truy cập khu vực công khai, xem trang chủ, xem danh sách chuyên khoa, tìm kiếm bác sĩ và xem hồ sơ công khai của bác sĩ. Khi muốn đặt lịch hẹn hoặc gửi câu hỏi, hệ thống yêu cầu đăng nhập hoặc đăng ký. | UC-G-01 đến UC-G-06 |
| Bệnh nhân | Người dùng đăng ký tài khoản bệnh nhân để quản lý hồ sơ sức khỏe, gửi câu hỏi, đặt lịch tư vấn, tham gia phiên tư vấn trực tuyến, xem kết quả, nhận đơn thuốc điện tử và đánh giá chất lượng tư vấn. | UC-P-01 đến UC-P-15 |
| Bác sĩ | Người dùng chuyên môn y tế quản lý hồ sơ chuyên môn, cấu hình lịch làm việc, tiếp nhận và phản hồi câu hỏi, quản lý lịch hẹn, thực hiện phiên tư vấn trực tuyến, ghi nhận kết quả tư vấn và cấp đơn thuốc điện tử cơ bản. | UC-D-01 đến UC-D-11 |
| Quản trị viên | Người dùng vận hành hệ thống, quản lý tài khoản, phê duyệt bác sĩ, quản lý hồ sơ bệnh nhân, chuyên khoa, lịch hẹn, kiểm duyệt nội dung và theo dõi số liệu thống kê hoạt động. | UC-A-01 đến UC-A-08 |

Ngoài các đối tượng sử dụng chính, SRS còn xác định một số hệ thống bên ngoài như Notification Service, Video Communication Service và File Storage Service. Các hệ thống này đóng vai trò ranh giới tích hợp ngoại vi, không làm thay đổi cấu trúc bốn vai trò người dùng cốt lõi.

## 3.3 Yêu cầu chức năng

Các yêu cầu chức năng được tổng hợp theo nhóm nghiệp vụ, sử dụng mã Use Case trong SRS. Bảng 3.2 được chia theo các nhóm dưới đây.

Bảng 3.2. Tóm tắt yêu cầu chức năng theo nhóm

**Nhóm yêu cầu chức năng công khai (Khách truy cập)**

| Mã ca sử dụng | Yêu cầu tóm tắt |
|---|---|
| UC-G-01 | Khách truy cập có thể xem trang chủ và các thông tin công khai của hệ thống. |
| UC-G-02 | Khách truy cập có thể xem danh sách chuyên khoa. |
| UC-G-03 | Khách truy cập có thể tìm kiếm bác sĩ theo chuyên khoa hoặc từ khóa. |
| UC-G-04 | Khách truy cập có thể xem chi tiết hồ sơ công khai của bác sĩ. |
| UC-G-05 | Khách truy cập có thể xem danh sách bác sĩ nổi bật hoặc bác sĩ đang hoạt động theo phạm vi hiển thị công khai. |
| UC-G-06 | Khách truy cập được chuyển đến trang đăng nhập hoặc đăng ký khi muốn thực hiện hành động yêu cầu xác thực như đặt lịch hoặc gửi câu hỏi. |

Nhóm yêu cầu này bảo đảm người dùng chưa đăng nhập vẫn có thể tìm hiểu thông tin nền tảng, chuyên khoa và bác sĩ trước khi quyết định đăng ký hoặc đăng nhập.

**Nhóm yêu cầu xác thực và hồ sơ người dùng**

| Mã ca sử dụng | Yêu cầu tóm tắt |
|---|---|
| UC-P-01 | Bệnh nhân có thể đăng ký tài khoản. |
| UC-P-02, UC-D-01, UC-A-01 | Người dùng thuộc các vai trò Bệnh nhân, Bác sĩ và Quản trị viên có thể đăng nhập. |
| UC-P-03 | Người dùng đã xác thực có thể đăng xuất. |
| UC-P-04 | Bệnh nhân có thể quản lý hồ sơ sức khỏe cá nhân. |
| UC-D-02 | Bác sĩ có thể quản lý hồ sơ chuyên môn. |
| UC-A-02, UC-A-03 | Quản trị viên có thể quản lý tài khoản bác sĩ và bệnh nhân. |

Hệ thống phải áp dụng phân quyền theo vai trò Khách truy cập, Bệnh nhân, Bác sĩ và Quản trị viên. Người dùng chỉ được truy cập các chức năng và dữ liệu phù hợp với vai trò được gán. SRS cũng yêu cầu hỗ trợ khôi phục mật khẩu bằng email hoặc cơ chế bảo mật tương đương.

**Nhóm yêu cầu chuyên khoa và khám phá bác sĩ**

| Mã ca sử dụng | Yêu cầu tóm tắt |
|---|---|
| UC-G-02 | Khách truy cập có thể xem danh sách chuyên khoa công khai. |
| UC-G-03, UC-P-05 | Khách truy cập và Bệnh nhân có thể tìm kiếm bác sĩ theo chuyên khoa hoặc từ khóa. |
| UC-G-04, UC-P-06 | Khách truy cập và Bệnh nhân có thể xem chi tiết bác sĩ. |
| UC-A-04 | Quản trị viên có thể quản lý chuyên khoa. |

Yêu cầu trong SRS nhấn mạnh rằng bác sĩ hiển thị cho người dùng công khai và bệnh nhân phải là bác sĩ đang hoạt động và đã được duyệt. Hồ sơ bác sĩ cần thể hiện các thông tin cần thiết như chuyên khoa, kinh nghiệm, mô tả tư vấn và lịch khả dụng khi phù hợp.

**Nhóm yêu cầu hỏi đáp sức khỏe**

| Mã ca sử dụng | Yêu cầu tóm tắt |
|---|---|
| UC-P-07 | Bệnh nhân có thể gửi câu hỏi sức khỏe. |
| UC-D-03 | Bác sĩ có thể xem các câu hỏi được phân công hoặc có thể xử lý. |
| UC-D-04 | Bác sĩ có thể phản hồi câu hỏi của bệnh nhân. |
| UC-P-11, UC-P-12 | Bệnh nhân có thể xem phản hồi và lịch sử câu hỏi/tư vấn. |
| UC-A-06 | Quản trị viên có thể kiểm duyệt nội dung tư vấn và phản hồi. |

Câu hỏi sức khỏe cần được lưu với trạng thái phù hợp, chẳng hạn `PENDING`, `ANSWERED` hoặc `CLOSED`. Khi bác sĩ phản hồi, hệ thống phải ghi nhận thời điểm phản hồi và bác sĩ phản hồi. Nội dung câu hỏi và phản hồi có thể được quản trị viên xem xét, kiểm duyệt khi cần.

**Nhóm yêu cầu đặt lịch và quản lý lịch hẹn**

| Mã ca sử dụng | Yêu cầu tóm tắt |
|---|---|
| UC-P-08 | Bệnh nhân có thể đặt lịch hẹn tư vấn với bác sĩ. |
| UC-P-09 | Bệnh nhân có thể xem danh sách lịch hẹn sắp tới. |
| UC-P-12 | Bệnh nhân có thể xem lịch sử tư vấn/lịch hẹn. |
| UC-D-05 | Bác sĩ có thể quản lý lịch tư vấn. |
| UC-D-06 | Bác sĩ có thể xem các lịch hẹn đã được đặt. |
| UC-A-05 | Quản trị viên có thể quản lý lịch hẹn. |

Theo SRS, bệnh nhân chỉ được đặt lịch vào khung giờ còn khả dụng; hệ thống phải ngăn đặt trùng lịch cho cùng bác sĩ và cùng thời gian. Lịch hẹn cần lưu các thông tin như bệnh nhân, bác sĩ, ngày giờ, mục đích, trạng thái và thời điểm tạo. Các trạng thái tối thiểu gồm `PENDING_CONFIRMATION`, `CONFIRMED`, Hoàn thành và `CANCELLED`.

**Nhóm yêu cầu phiên tư vấn, kết quả và đơn thuốc**

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

**Nhóm yêu cầu đánh giá, thông báo và báo cáo**

| Mã ca sử dụng | Yêu cầu tóm tắt |
|---|---|
| UC-P-14 | Bệnh nhân có thể đánh giá chất lượng tư vấn sau khi buổi tư vấn hoàn tất. |
| UC-P-15 | Bệnh nhân nhận nhắc lịch và thông báo. |
| UC-E-01 | Hệ thống gửi email nhắc lịch hoặc thông báo theo phạm vi yêu cầu. |
| UC-E-02 | Hệ thống có thể hỗ trợ SMS nhắc lịch khi có dịch vụ phù hợp. |
| UC-A-07 | Quản trị viên xem dashboard thống kê hệ thống. |
| UC-A-08 | Quản trị viên theo dõi người dùng hoạt động và số lượng phiên tư vấn. |

Bệnh nhân chỉ được đánh giá sau khi buổi tư vấn đã hoàn tất và có thể gửi nhận xét kèm đánh giá. Hệ thống cần gửi thông báo cho các sự kiện như tạo/xác nhận lịch hẹn, nhắc lịch và bác sĩ phản hồi câu hỏi. Quản trị viên cần có khả năng theo dõi thống kê hoạt động tư vấn, người dùng và xu hướng theo thời gian.

## 3.4 Yêu cầu phi chức năng

Các yêu cầu phi chức năng được tổng hợp từ SRS. Mức độ đáp ứng được đối chiếu ở Chương 6.

**Bảo mật**

Giao tiếp client-server phải sử dụng HTTPS trên môi trường triển khai. Mật khẩu phải được băm bằng thuật toán an toàn như bcrypt hoặc Argon2. Các tài nguyên được bảo vệ phải kiểm tra xác thực và quyền truy cập. Dữ liệu đầu vào cần được kiểm tra ở client khi phù hợp và bắt buộc ở server. Hệ thống phải hạn chế các rủi ro như SQL Injection, Cross-Site Scripting và broken access control.

Hồ sơ tư vấn chỉ được truy cập bởi bệnh nhân sở hữu hồ sơ, bác sĩ phụ trách và quản trị viên được ủy quyền theo chính sách. Các hành động quan trọng như đăng nhập, cập nhật lịch hẹn, phản hồi của bác sĩ và thay đổi quản trị cần được ghi audit log.

**Quyền riêng tư và bảo mật thông tin**

Dữ liệu cá nhân và sức khỏe cần được xử lý theo các nguyên tắc quyền riêng tư phù hợp với hệ thống y tế. Giao diện và log chỉ nên hiển thị thông tin sức khỏe khi cần thiết. Nội dung tư vấn và đơn thuốc phải được bảo mật; thời gian và cách lưu dữ liệu tư vấn, audit data cần được quy định theo chính sách dự án.

**Hiệu năng**

Với thao tác thông thường, mục tiêu phản hồi là dưới 3 giây cho 95% request trong môi trường triển khai mục tiêu, không bao gồm upload file và media thời gian thực. Dashboard cần tải trong thời gian phù hợp với khối lượng dữ liệu dự kiến.

**Khả năng mở rộng**

Các chức năng quản lý người dùng, lịch hẹn, tư vấn, thông báo và báo cáo cần được tách theo trách nhiệm. Tầng ứng dụng xử lý yêu cầu theo hướng stateless. Phần tích hợp thông báo và video cần tách khỏi xử lý nghiệp vụ để có thể thay thế hoặc nâng cấp nhà cung cấp.

**Tính sẵn sàng và độ tin cậy**

Hệ thống cần xử lý ngoại lệ tập trung và trả thông báo lỗi thống nhất để hạn chế gián đoạn dịch vụ. Các giao dịch đặt lịch và cập nhật trạng thái phải giữ dữ liệu nhất quán. Khi video không khả dụng, người dùng có thể tiếp tục tư vấn qua chức năng chat hiện có.

**Tính khả dụng**

Giao diện phải responsive và sử dụng được trên desktop, tablet và mobile browser. Đăng ký, gửi câu hỏi và đặt lịch cần có trình tự rõ ràng. Giao diện phải thể hiện trạng thái thành công, thất bại, lỗi dữ liệu và đang tải. Biểu mẫu cần có nhãn và thông báo validation dễ hiểu; điều hướng và bố cục phải nhất quán.

**Khả năng bảo trì và tương thích**

Mã nguồn cần được tổ chức theo module, tách quy tắc nghiệp vụ khỏi xử lý hiển thị khi phù hợp. API phải được tài liệu hóa nhất quán, cấu hình môi trường dễ bảo trì. Cần có log và điểm tích hợp giám sát để hỗ trợ tìm lỗi và vận hành.

Ứng dụng phải hỗ trợ các trình duyệt hiện đại phổ biến và các kích thước màn hình thông dụng. Nếu bổ sung đa ngôn ngữ, nội dung văn bản nên được quản lý trong tệp tài nguyên riêng để dễ dịch.

## 3.5 Quy tắc nghiệp vụ

Phần này tóm tắt các quy tắc nghiệp vụ quan trọng được nêu trong SRS.

**Quy tắc truy cập và vai trò**

Hệ thống vận hành với bốn vai trò chính: Khách truy cập, Bệnh nhân, Bác sĩ và Quản trị viên. Khách truy cập chỉ được truy cập khu vực công khai. Bệnh nhân, Bác sĩ và Quản trị viên phải đăng nhập để sử dụng các chức năng tương ứng. Mỗi người dùng chỉ được truy cập chức năng và dữ liệu phù hợp với vai trò của mình.

Dữ liệu sức khỏe, hồ sơ tư vấn và đơn thuốc phải được giới hạn cho các bên có thẩm quyền. Đây là quy tắc nền tảng để bảo vệ dữ liệu cá nhân và dữ liệu sức khỏe trong hệ thống.

**Quy tắc hiển thị và lựa chọn bác sĩ**

Bác sĩ được hiển thị trong khu vực công khai hoặc trong quá trình bệnh nhân tìm kiếm phải ở trạng thái đang hoạt động và đã được phê duyệt hồ sơ theo đặc tả yêu cầu (SRS). Bác sĩ có thể được gắn với một hoặc nhiều chuyên khoa. Người dùng có thể tìm kiếm hoặc lọc bác sĩ theo chuyên khoa, từ khóa và thông tin công khai phù hợp.

**Quy tắc đặt lịch hẹn**

Bệnh nhân chỉ được đặt lịch với bác sĩ trong các khung giờ còn khả dụng. Hệ thống phải ngăn đặt trùng lịch cho cùng bác sĩ và cùng khung giờ. Lịch hẹn phải có thông tin bệnh nhân, bác sĩ, thời gian, mục đích, trạng thái và thời điểm tạo. Các trạng thái tối thiểu gồm `PENDING_CONFIRMATION`, `CONFIRMED`, Hoàn thành và `CANCELLED`.

Lịch hẹn có thể được hủy theo quy tắc nghiệp vụ đã định nghĩa. Bác sĩ có thể xem lịch hẹn sắp tới và lịch hẹn trong quá khứ của mình; bệnh nhân cũng có thể xem lịch hẹn của chính mình. Quản trị viên có thể xem và quản lý tất cả lịch hẹn.

**Quy tắc phiên tư vấn**

Phiên tư vấn chỉ được khởi tạo cho lịch hẹn hợp lệ. Quyền truy cập phiên tư vấn phải giới hạn cho bệnh nhân tham gia, bác sĩ phụ trách và quản trị viên được ủy quyền nếu có. Hệ thống phải hỗ trợ chat thời gian thực cho phiên tư vấn. Video là khả năng được SRS cho phép ở mức mô phỏng, tích hợp cơ bản hoặc mở rộng tùy điều kiện.

Sau khi phiên tư vấn kết thúc, hệ thống phải lưu tóm tắt tư vấn. Bác sĩ có thể ghi nhận kết quả tư vấn và tạo đơn thuốc điện tử cơ bản cho buổi tư vấn đã hoàn tất. Bệnh nhân chỉ được xem kết quả tư vấn và đơn thuốc gắn với buổi tư vấn của chính mình.

**Quy tắc đánh giá và thông báo**

Bệnh nhân chỉ được đánh giá sau khi buổi tư vấn đã hoàn tất. Hệ thống phải ngăn việc gửi đánh giá cho lịch hẹn chưa hoàn tất. Đánh giá có thể đi kèm nhận xét bằng văn bản và có thể được quản trị viên kiểm duyệt khi cần.

Hệ thống phải gửi thông báo cho các sự kiện quan trọng như lịch hẹn được tạo hoặc xác nhận, nhắc lịch trước thời gian hẹn và câu hỏi đã được bác sĩ phản hồi. Email là kênh thông báo bắt buộc trong phạm vi SRS; SMS được xác định là tùy chọn/mở rộng khi có dịch vụ gửi tin nhắn phù hợp. Lịch sử thông báo và trạng thái gửi từ nhà cung cấp, nếu có, cần được ghi nhận.

## 3.6 Biểu đồ Use Case

Bốn biểu đồ Use Case dưới đây mô tả chức năng theo từng nhóm người dùng.

### 3.6.1 Biểu đồ Use Case của khách truy cập

[INSERT FIGURE: use-case-guest.png]

**Hình 3.1. Biểu đồ Use Case của khách truy cập**

Biểu đồ này thể hiện các chức năng công khai của Khách truy cập, bao gồm xem trang chủ, xem danh sách chuyên khoa, tìm kiếm bác sĩ, xem hồ sơ bác sĩ và chuyển sang đăng nhập hoặc đăng ký khi muốn thực hiện hành động cần xác thực. Các ca sử dụng liên quan gồm UC-G-01, UC-G-02, UC-G-03, UC-G-04, UC-G-05 và UC-G-06.

### 3.6.2 Biểu đồ Use Case của bệnh nhân

[INSERT FIGURE: use-case-patient.png]

**Hình 3.2. Biểu đồ Use Case của bệnh nhân**

Biểu đồ này mô tả hành trình chính của Bệnh nhân trong hệ thống: đăng ký, đăng nhập, quản lý hồ sơ sức khỏe, tìm kiếm bác sĩ, gửi câu hỏi, đặt lịch, tham gia tư vấn, xem phản hồi, xem lịch sử, xem tóm tắt/đơn thuốc, đánh giá và nhận thông báo. Các ca sử dụng liên quan gồm UC-P-01 đến UC-P-15. Biểu đồ cũng thể hiện quan hệ với Notification Service qua UC-E-01 và UC-E-02; trong đó SMS là khả năng mở rộng phụ thuộc dịch vụ phù hợp.

### 3.6.3 Biểu đồ Use Case của bác sĩ

[INSERT FIGURE: use-case-doctor.png]

**Hình 3.3. Biểu đồ Use Case của bác sĩ**

Biểu đồ này thể hiện các chức năng chuyên môn của Bác sĩ, bao gồm đăng nhập, quản lý hồ sơ bác sĩ, xem và phản hồi câu hỏi, quản lý lịch tư vấn, xem lịch hẹn, bắt đầu và thực hiện tư vấn, ghi nhận kết quả, cấp đơn thuốc cơ bản và xem lịch sử tư vấn của bệnh nhân. Các ca sử dụng liên quan gồm UC-D-01 đến UC-D-11. Biểu đồ cũng thể hiện UC-E-03 về thiết lập phiên tư vấn video như một khả năng hỗ trợ theo phạm vi SRS.

### 3.6.4 Biểu đồ Use Case của quản trị viên

[INSERT FIGURE: use-case-admin.png]

**Hình 3.4. Biểu đồ Use Case của quản trị viên**

Biểu đồ này mô tả phạm vi vận hành của Quản trị viên, bao gồm đăng nhập, quản lý tài khoản bác sĩ, quản lý tài khoản bệnh nhân, quản lý chuyên khoa, quản lý lịch hẹn, kiểm duyệt nội dung tư vấn và phản hồi, xem bảng điều khiển (dashboard) thống kê và theo dõi hoạt động hệ thống. Các ca sử dụng liên quan gồm UC-A-01 đến UC-A-08.

## 3.7 Luồng hoạt động tổng quát

[INSERT FIGURE: system-flow.png]

**Hình 3.5. Luồng hoạt động tổng quát của hệ thống**

Luồng hoạt động tổng quát bắt đầu từ khu vực công khai. Khách truy cập có thể xem trang chủ, xem chuyên khoa và tìm kiếm bác sĩ đã được duyệt. Khi muốn đặt lịch hoặc gửi câu hỏi, người dùng chuyển sang đăng ký hoặc đăng nhập để sử dụng hệ thống với vai trò Bệnh nhân.

Sau khi xác thực, Bệnh nhân có thể cập nhật hồ sơ sức khỏe, tìm kiếm và chọn bác sĩ, kiểm tra lịch khả dụng và đặt lịch hẹn tư vấn. Lịch hẹn ban đầu có thể ở trạng thái chờ xác nhận, sau đó được bác sĩ xem xét và xác nhận theo quy trình nghiệp vụ. Bác sĩ cũng quản lý hồ sơ chuyên môn, lịch làm việc và các lịch hẹn liên quan.

Khi đến thời gian tư vấn, Bệnh nhân và Bác sĩ tham gia phiên tư vấn. Luồng chính của hệ thống là tư vấn qua chat thời gian thực; kênh video giữ vai trò hỗ trợ ở mức giao diện mô phỏng hoặc tích hợp cơ bản theo SRS. Sau phiên tư vấn, bác sĩ ghi nhận tóm tắt tư vấn và có thể tạo đơn thuốc điện tử cơ bản. Bệnh nhân xem lại kết quả, đơn thuốc và có thể gửi đánh giá chất lượng tư vấn sau khi buổi tư vấn hoàn tất.

Bên cạnh luồng đặt lịch và tư vấn, hệ thống còn có luồng hỗ trợ hỏi đáp sức khỏe. Bệnh nhân gửi câu hỏi, Bác sĩ trả lời, Bệnh nhân xem phản hồi, và Quản trị viên có thể kiểm duyệt nội dung khi cần. Dịch vụ thông báo (Notification Service) hỗ trợ gửi thông báo hoặc nhắc lịch cho các sự kiện quan trọng như tạo lịch hẹn, xác nhận lịch hẹn hoặc câu hỏi đã được trả lời. Quản trị viên quản lý người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, kiểm duyệt nội dung và theo dõi bảng điều khiển (dashboard) thống kê.

# CHƯƠNG 4. THIẾT KẾ HỆ THỐNG

## 4.1 Kiến trúc tổng thể

Hệ thống được thiết kế dưới dạng ứng dụng web gồm ba lớp chính: Web Client, Application Layer và Data Layer. Người dùng truy cập hệ thống qua trình duyệt. Giao diện phía client là React SPA, chịu trách nhiệm hiển thị giao diện, điều hướng theo vai trò, gửi yêu cầu REST và kết nối realtime trong phiên tư vấn. Phía server là một ứng dụng NestJS theo kiến trúc Modular Monolith, cung cấp REST API, Socket.IO realtime entry, xử lý nghiệp vụ và giao tiếp với cơ sở dữ liệu PostgreSQL thông qua Prisma ORM.

[INSERT FIGURE: architecture-overview.png]

**Hình 4.1. Kiến trúc tổng thể của hệ thống**

Về giao tiếp, phần lớn chức năng nghiệp vụ như đăng nhập, quản lý hồ sơ, tìm bác sĩ, đặt lịch, hỏi đáp, quản trị và báo cáo sử dụng REST API. Riêng phiên tư vấn trực tuyến cần trao đổi hai chiều giữa bệnh nhân và bác sĩ nên sử dụng Socket.IO. Thiết kế này giúp hệ thống vừa giữ được luồng request-response rõ ràng cho dữ liệu nghiệp vụ, vừa hỗ trợ realtime chat cho phiên tư vấn.

Theo mô hình Client–Server, React SPA chạy trên trình duyệt và gọi dịch vụ NestJS tập trung. Các kênh email, SMS và video được đặt sau lớp Adapter/Provider để có thể thay thế nhà cung cấp khi tích hợp.

## 4.2 Thiết kế backend

Backend được thiết kế theo hướng Modular Monolith: toàn bộ nghiệp vụ chạy trong một ứng dụng NestJS duy nhất, nhưng được chia thành các module theo miền chức năng. Các module runtime chính gồm `IdentityModule`, `DiscoveryModule`, `PatientModule`, `DoctorModule`, `SpecialtyModule`, `AppointmentModule`, `QuestionModule`, `ConsultationModule`, `NotificationModule`, `ModerationModule`, `ReportingModule`, `OperationsModule` và `PrismaModule`.

Lịch hẹn, phiên tư vấn và thông báo có quan hệ chặt chẽ và cần dùng chung transaction. Modular Monolith giúp tổ chức các chức năng thành module trong một ứng dụng, thuận tiện cho triển khai và kiểm thử. Các tác vụ nền và báo cáo vẫn dùng tài nguyên trong cùng tiến trình, nên cần xem xét khi lưu lượng tăng.

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

REST controller tiếp nhận yêu cầu, các guard kiểm tra xác thực và quyền truy cập, service xử lý nghiệp vụ, còn `PrismaService` truy cập PostgreSQL. `ConsultationGateway` tiếp nhận sự kiện Socket.IO và chuyển cho `ConsultationService`; `NotificationScheduler` gọi `NotificationService` định kỳ để xử lý outbox và nhắc lịch.

[INSERT FIGURE: backend-class-diagram.png]

**Hình 4.2. Sơ đồ lớp các thành phần backend chính**

Sơ đồ lớp minh họa quan hệ Controller → Service, Gateway → Service, Scheduler → Service và Service → PrismaService. `NotificationService` sử dụng `NotificationProvider` để tách logic thông báo khỏi kênh gửi. Các quan hệ thực thể dữ liệu được trình bày riêng trong ERD ở mục 4.4.

## 4.3 Thiết kế frontend

Web Client là React SPA chạy trên trình duyệt. Client-side routing phân chia khu vực công khai và các màn hình cho bệnh nhân, bác sĩ, quản trị viên. Frontend được tổ chức theo feature; mỗi nhóm có màn hình, API client, state và kiểu dữ liệu riêng.

Các feature gồm `auth` cho tài khoản và phiên đăng nhập, `public` cho tra cứu, `patient` và `doctor` cho hồ sơ và nghiệp vụ tư vấn, `admin` cho quản lý và kiểm duyệt, `reports` cho thống kê. Client Socket.IO dùng chung được đặt trong `consultation/realtime`. Các màn hình hồ sơ, lịch hẹn và phòng tư vấn được tổ chức theo vai trò. Cách tổ chức này giữ các phần giao diện liên quan trong cùng nhóm chức năng.

Route công khai cho phép khách truy cập xem thông tin, chuyên khoa và bác sĩ. Route theo vai trò được bảo vệ bằng guard frontend để điều hướng người dùng đến khu vực phù hợp. Backend vẫn kiểm tra quyền truy cập đối với dữ liệu và thao tác nghiệp vụ.

Redux Toolkit quản lý trạng thái xác thực, dữ liệu nghiệp vụ và trạng thái tải/lỗi. Redux Saga xử lý các tác vụ bất đồng bộ như đăng nhập, đặt lịch, gửi câu hỏi và tải dữ liệu quản trị, báo cáo. Các màn hình sử dụng trạng thái này để hiển thị dữ liệu và phản hồi sau thao tác.

Frontend gọi REST API cho các chức năng dữ liệu và dùng Socket.IO cho chat. API client gửi access token với yêu cầu được bảo vệ và hỗ trợ refresh token khi cần. Client realtime kết nối tới namespace tư vấn, gửi token khi handshake, tham gia phòng theo lịch hẹn rồi gửi và nhận tin nhắn.

## 4.4 Thiết kế cơ sở dữ liệu

Dữ liệu của hệ thống được lưu trong PostgreSQL và truy cập thông qua Prisma ORM. Prisma schema là mô tả chính thức của cấu trúc dữ liệu ứng dụng. Các bảng sử dụng quan hệ rõ ràng giữa người dùng, hồ sơ, lịch hẹn, phiên tư vấn, câu hỏi, đơn thuốc, đánh giá, thông báo và audit log.

[INSERT FIGURE: database-erd.png]

**Hình 4.3. Sơ đồ quan hệ thực thể của hệ thống**

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

## 4.5 Thiết kế xác thực và phân quyền

Hệ thống sử dụng JWT access token kết hợp refresh token trong cookie HTTP-only. Khi người dùng đăng nhập thành công, backend cấp access token để gọi API được bảo vệ và refresh token để duy trì phiên đăng nhập. Refresh token được quản lý như phiên đăng nhập phía server, có thể được xoay vòng hoặc thu hồi khi người dùng đăng xuất.

Thiết kế phân quyền gồm ba lớp chính:

- `JwtAuthGuard`: xác thực access token và gắn thông tin người dùng vào request.
- `RolesGuard`: kiểm tra người dùng có vai trò phù hợp với chức năng đang truy cập hay không.
- `OwnershipGuard`: kiểm tra quyền sở hữu dữ liệu ở những tình huống cần bảo vệ tài nguyên theo người dùng cụ thể.

Mô hình RBAC của hệ thống dựa trên các vai trò `PATIENT`, `DOCTOR` và `ADMIN` ở backend. Khách truy cập chỉ truy cập vùng công khai và không có vai trò đăng nhập trong backend. Thiết kế này đáp ứng yêu cầu tách biệt quyền giữa bệnh nhân, bác sĩ và quản trị viên, đặc biệt với dữ liệu nhạy cảm như hồ sơ sức khỏe, lịch hẹn, kết quả tư vấn và đơn thuốc.

## 4.6 Các luồng xử lý tiêu biểu

Các biểu đồ tuần tự mô tả sự phối hợp giữa giao diện, backend và dữ liệu trong những luồng chính của hệ thống.

### 4.6.1 Đăng nhập

[INSERT FIGURE: sequence-login.png]

**Hình 4.4. Biểu đồ tuần tự đăng nhập người dùng**

Người dùng gửi thông tin đăng nhập; backend xác thực, tạo phiên, ghi nhận thông tin cần thiết và trả access token cùng refresh cookie. Luồng này dùng chung cho bệnh nhân, bác sĩ và quản trị viên.

### 4.6.2 Đặt lịch tư vấn

[INSERT FIGURE: sequence-book-appointment.png]

**Hình 4.5. Biểu đồ tuần tự đặt lịch tư vấn**

Backend kiểm tra bệnh nhân, bác sĩ và khung giờ, sau đó tạo lịch hẹn, audit log và sự kiện thông báo trong cùng transaction. Vòng đời lịch hẹn gồm `PENDING_CONFIRMATION`, `CONFIRMED`, `COMPLETED`, `CANCELLED` và `NO_SHOW`; cách kiểm tra xung đột được trình bày ở mục 5.6.

### 4.6.3 Tư vấn trực tuyến

[INSERT FIGURE: sequence-consultation-chat.png]

**Hình 4.6. Biểu đồ tuần tự chat realtime trong phiên tư vấn**

Client xác thực kết nối Socket.IO, tham gia phòng theo lịch hẹn và gửi tin nhắn. Gateway chuyển yêu cầu cho service kiểm tra quyền và trạng thái phiên, lưu tin nhắn rồi phát đến các thành viên trong phòng. Khi bắt đầu tư vấn, `ConsultationSession` có trạng thái `ONGOING`. Video hiện là kênh tùy chọn với giao diện mô phỏng và cơ chế dự phòng bằng chat.

### 4.6.4 Kết quả tư vấn và đơn thuốc

[INSERT FIGURE: sequence-create-prescription.png]

**Hình 4.7. Biểu đồ tuần tự tạo đơn thuốc sau tư vấn**

Sau khi phiên kết thúc, bác sĩ lưu tóm tắt tư vấn. Backend kiểm tra lịch hẹn đã hoàn tất trước khi tạo đơn thuốc và các mục thuốc trong cùng transaction. Bệnh nhân xem kết quả theo quyền sở hữu lịch hẹn.

### 4.6.5 Thông báo và kiểm duyệt

[INSERT FIGURE: sequence-notification-outbox.png]

**Hình 4.8. Biểu đồ tuần tự xử lý thông báo bất đồng bộ qua outbox**

Transaction nghiệp vụ tạo `OutboxEvent`; scheduler đọc sự kiện theo batch, gọi `NotificationService` để tạo `NotificationLog` và chuyển cho provider. Log lưu trạng thái gửi, provider và lỗi nếu có. Nếu kênh gửi lỗi, sự kiện có thể được xử lý lại mà không hủy dữ liệu lịch hẹn hoặc câu hỏi.

[INSERT FIGURE: sequence-admin-moderation.png]

**Hình 4.9. Biểu đồ tuần tự kiểm duyệt câu hỏi và phản hồi**

Quản trị viên xem hàng đợi nội dung, thực hiện kiểm duyệt; backend cập nhật trạng thái và ghi audit log để lưu dấu thao tác.

# CHƯƠNG 5. XÂY DỰNG HỆ THỐNG

## 5.1 Xác thực và phân quyền

Hệ thống quản lý việc đăng ký, đăng nhập, làm mới phiên và kiểm soát quyền truy cập cho ba nhóm người dùng: Bệnh nhân, Bác sĩ và Quản trị viên. Giao diện frontend triển khai các biểu mẫu đăng nhập, đăng ký, quên mật khẩu và component `RequireAuth` để bảo vệ các tuyến đường theo vai trò. Trạng thái người dùng và token được quản lý tập trung thông qua Redux Toolkit.

Backend xử lý xác thực bằng `AuthService`, cấp JWT access token có thời hạn ngắn qua header `Authorization` và lưu refresh token trong cookie HttpOnly để hạn chế truy cập từ JavaScript. Dữ liệu tài khoản, phiên đăng nhập và token đặt lại mật khẩu được lưu riêng. Tài khoản bị vô hiệu hóa (`isActive = false`) sẽ bị chặn đăng nhập và thu hồi phiên làm việc.

Backend kiểm tra JWT và vai trò bằng guard trước khi cho phép truy cập. Bác sĩ cần được quản trị viên phê duyệt hồ sơ trước khi có thể xuất hiện công khai và nhận lịch tư vấn. Các API nhạy cảm được kiểm tra quyền tại controller và service; mật khẩu được băm bằng bcrypt.

## 5.2 Tra cứu chuyên khoa và bác sĩ

Khách truy cập và người dùng đã đăng nhập có thể tìm kiếm bác sĩ, xem danh mục chuyên khoa và thông tin chi tiết trước khi đặt lịch. Frontend có các trang chuyên khoa, danh sách và chi tiết bác sĩ, lấy thông tin chuyên môn và điểm đánh giá qua API.

[INSERT FIGURE: ui-public-doctor-discovery.png]

**Hình 5.1. Giao diện tra cứu chuyên khoa và bác sĩ**

`DiscoveryService` truy vấn hồ sơ bác sĩ cùng chuyên khoa, trạng thái tài khoản và đánh giá. Dữ liệu trả về được phân trang, lọc theo chuyên khoa, tìm kiếm theo từ khóa và tính toán điểm đánh giá trung bình từ các bản ghi đánh giá hợp lệ.

Kết quả tra cứu công khai chỉ hiển thị bác sĩ có `approvalStatus = APPROVED`, `isActive = true` và tài khoản người dùng đang hoạt động.

## 5.3 Hồ sơ bệnh nhân

Bệnh nhân có thể lưu trữ và cập nhật thông tin cá nhân phục vụ quá trình tư vấn, gồm ngày sinh, giới tính, số điện thoại, địa chỉ và tiền sử sức khỏe cơ bản. Giao diện hiển thị thông tin tài khoản kết hợp hồ sơ sức khỏe và chuẩn hóa dữ liệu đầu vào trước khi gửi lên máy chủ.

`PatientService` xử lý cập nhật hồ sơ qua API PATCH. Mỗi hồ sơ bệnh nhân liên kết một-một với tài khoản. Nếu bệnh nhân chưa có bản ghi hồ sơ, hệ thống sẽ tự động khởi tạo trước khi cập nhật dữ liệu mới.

Bệnh nhân chỉ được phép xem và chỉnh sửa hồ sơ của chính mình thông qua access token. Dữ liệu hồ sơ là thông tin tham khảo cho bác sĩ trong quá trình tư vấn, không dùng để đưa ra chẩn đoán y khoa tự động.

## 5.4 Hồ sơ bác sĩ và lịch làm việc

Bác sĩ có thể quản lý thông tin nghề nghiệp, chuyên khoa, giới thiệu chuyên môn và cấu hình khung giờ làm việc nhận lịch hẹn. Giao diện bác sĩ có các màn hình quản lý hồ sơ, lịch làm việc, danh sách bệnh nhân và đánh giá, kết nối backend qua API.

`DoctorService` xử lý hồ sơ, liên kết chuyên khoa và lưu lịch làm việc trong trường `schedule` dưới dạng JSON có cấu trúc. Quản trị viên có các API riêng để duyệt hồ sơ và điều chỉnh chuyên khoa của bác sĩ.

Khi bác sĩ thay đổi danh sách chuyên khoa, backend thực thi trong một transaction để xóa liên kết cũ và tạo liên kết mới đồng bộ. Mọi thao tác quản trị viên duyệt hồ sơ hoặc thay đổi trạng thái bác sĩ đều được ghi vết qua `AuditLog`. Bác sĩ chưa được duyệt sẽ không thể nhận lịch hẹn hoặc xuất hiện trên trang tra cứu.

## 5.5 Hỏi đáp sức khỏe

Bệnh nhân có thể gửi câu hỏi y tế chung hoặc gửi đích danh cho một bác sĩ cụ thể. Giao diện bệnh nhân cung cấp form đặt câu hỏi và theo dõi lịch sử phản hồi; giao diện bác sĩ hiển thị danh sách câu hỏi được phân công hoặc câu hỏi chung đang chờ xử lý.

`QuestionService` xử lý câu hỏi, phản hồi và dữ liệu kiểm duyệt. Nếu bệnh nhân chọn đích danh bác sĩ, bác sĩ đó phải đang hoạt động và đã được phê duyệt. Bác sĩ không được trả lời câu hỏi đã gán cho bác sĩ khác.

Khi bác sĩ trả lời, hệ thống cập nhật trạng thái câu hỏi, lưu phản hồi, ghi audit log và tạo sự kiện outbox trong cùng transaction. Sự kiện này được dùng để gửi thông báo cho bệnh nhân.

## 5.6 Đặt lịch tư vấn

Bệnh nhân có thể tra cứu khung giờ trống của bác sĩ, đăng ký lịch hẹn và theo dõi trạng thái xác nhận. Bác sĩ và quản trị viên có giao diện quản lý lịch hẹn tương ứng để xác nhận, hủy, hoàn thành hoặc đổi lịch hẹn.

[INSERT FIGURE: ui-book-appointment.png]

**Hình 5.2. Giao diện đặt lịch hẹn trực tuyến**

`AppointmentService` xử lý tạo và cập nhật trạng thái lịch hẹn. Quy tắc nghiệp vụ yêu cầu thời điểm hẹn phải ở tương lai, nằm trong lịch làm việc của bác sĩ và không xung đột với các lịch hẹn đã xác nhận hoặc đang chờ xử lý của cả hai bên.

Để giải quyết bài toán đặt trùng lịch (double booking) khi có nhiều yêu cầu đồng thời, thao tác tạo lịch hẹn được thực thi trong một transaction với mức cô lập `Serializable`. Trong transaction này, hệ thống kiểm tra xung đột thời gian, tạo lịch hẹn mới, ghi `AuditLog` và phát sinh `OutboxEvent` phục vụ gửi thông báo. ID của lịch hẹn và sự kiện outbox được sinh bằng `uuidv7()`.

## 5.7 Tư vấn trực tuyến

Bệnh nhân và bác sĩ trao đổi thông tin y tế qua kênh tin nhắn thời gian thực trong phiên tư vấn gắn với lịch hẹn. Giao diện phòng tư vấn kết nối WebSocket qua `ConsultationSocketClient`, tự động tham gia phòng theo `appointmentId` và quản lý danh sách tin nhắn.

[INSERT FIGURE: ui-consultation-chat.png]

**Hình 5.3. Giao diện tư vấn trực tuyến và trao đổi tin nhắn**

Backend dùng `ConsultationService` cho nghiệp vụ qua REST API và `ConsultationGateway` cho Socket.IO tại namespace `/consultations`. Bác sĩ phụ trách là người có quyền bắt đầu hoặc kết thúc phiên; bệnh nhân và bác sĩ chỉ được tham gia phiên của chính mình trong khung thời gian hợp lệ của lịch hẹn.

Kết nối Socket.IO được xác thực bằng JWT ngay tại bước handshake. Khi người dùng gửi tin nhắn qua sự kiện `consultation:message`, gateway kiểm tra trạng thái phiên (`ONGOING`), lưu tin nhắn vào bảng `ConsultationMessage` rồi phát tin nhắn đến tất cả các thành viên trong room `consultation:<appointmentId>`.

## 5.8 Kết quả tư vấn và đơn thuốc

Sau khi kết thúc phiên tư vấn, bác sĩ ghi nhận kết luận tư vấn, lưu tóm tắt và kê đơn thuốc cho bệnh nhân. Bệnh nhân có thể xem lại chi tiết kết quả khám và đơn thuốc điện tử tương ứng với từng lịch hẹn.

`ConsultationService` quản lý phiên, kết quả tư vấn và đơn thuốc. Đơn thuốc chỉ được tạo khi lịch hẹn đã hoàn tất. Bác sĩ phụ trách phiên là người duy nhất có quyền kê đơn thuốc; mỗi đơn thuốc yêu cầu ít nhất một mục thuốc hợp lệ gồm tên thuốc, liều dùng, đường dùng và thời gian điều trị.

Thao tác tạo đơn thuốc cùng danh sách mục thuốc được thực thi trong một transaction để đảm bảo toàn vẹn dữ liệu. Bệnh nhân chỉ được cấp quyền xem đơn thuốc thuộc lịch hẹn của mình thông qua kiểm tra quyền sở hữu tại service.

## 5.9 Đánh giá tư vấn

Bệnh nhân có thể gửi phản hồi và chấm điểm chất lượng dịch vụ (từ 1 đến 5 sao) sau khi lịch hẹn hoàn thành. Điểm trung bình và số lượt đánh giá được tổng hợp để hiển thị công khai trên hồ sơ của từng bác sĩ.

`RatingService` kiểm tra điều kiện đánh giá: chỉ bệnh nhân tham gia lịch hẹn mới có quyền đánh giá, lịch hẹn phải ở trạng thái `COMPLETED` và mỗi lịch hẹn chỉ được tạo tối đa một bản ghi đánh giá duy nhất.

Quản trị viên có quyền ẩn hoặc mở lại các đánh giá vi phạm qua chức năng kiểm duyệt.

## 5.10 Thông báo và nhắc lịch

Hệ thống ghi nhận và gửi thông tin về các sự kiện quan trọng như đặt lịch hẹn mới, xác nhận lịch, nhắc lịch sắp diễn ra, thông báo câu trả lời mới và đặt lại mật khẩu. Phía backend cung cấp các API quản lý nhật ký thông báo cho người dùng và quản trị viên.

Backend áp dụng Outbox Pattern: khi có sự kiện nghiệp vụ phát sinh, bản ghi sự kiện được lưu vào bảng `OutboxEvent` trong cùng transaction với nghiệp vụ chính. `NotificationScheduler` chạy nền định kỳ để quét các sự kiện chưa xử lý, tạo bản ghi `NotificationLog` và kích hoạt provider gửi thông báo tương ứng.

Để đảm bảo tính idempotent và tránh gửi lặp thông báo khi tiến trình chạy nền xử lý lại, hệ thống sử dụng trường `externalRef` kết hợp thao tác `upsert` trên bảng `NotificationLog`. Nếu thông báo đã ở trạng thái `SENT`, hệ thống sẽ bỏ qua và không gửi lại.

## 5.11 Quản trị và kiểm duyệt nội dung

Quản trị viên có thể quản lý người dùng, phê duyệt hồ sơ bác sĩ, danh mục chuyên khoa, giám sát lịch hẹn và kiểm duyệt nội dung tương tác. Giao diện quản trị tập hợp các chức năng này và kết nối backend qua API.

[INSERT FIGURE: ui-admin-dashboard.png]

**Hình 5.4. Giao diện quản trị hệ thống**

Các API quản trị kiểm tra xác thực JWT và yêu cầu vai trò `ADMIN`. Mọi hành động nhạy cảm như khóa tài khoản, duyệt bác sĩ hoặc đổi trạng thái lịch hẹn đều được ghi vào bảng `AuditLog` phục vụ mục đích kiểm toán và truy vết.

Giao diện kiểm duyệt tập hợp câu hỏi, câu trả lời và đánh giá. Quản trị viên có thể ẩn, duyệt hoặc xóa nội dung vi phạm, đồng thời lưu lại lý do xử lý trong bảng `QuestionModeration` hoặc nhật ký kiểm duyệt.

## 5.12 Thống kê và báo cáo

Trang báo cáo cung cấp số liệu tổng quan phục vụ công tác giám sát vận hành của quản trị viên. Giao diện hiển thị số lượng người dùng, bác sĩ, lịch hẹn, phiên tư vấn và biểu đồ xu hướng theo thời gian, lấy dữ liệu qua API.

`ReportingService` sử dụng truy vấn đếm (`count`), gom nhóm (`groupBy`) và phân nhóm thời gian trên dữ liệu lịch hẹn, phiên tư vấn, người dùng, bác sĩ và câu hỏi. Các API này chỉ được cấp quyền cho vai trò `ADMIN`.

Dữ liệu báo cáo được tính toán trực tiếp từ cơ sở dữ liệu giao dịch PostgreSQL, hỗ trợ lọc theo khoảng ngày bắt đầu và kết thúc mà không cần triển khai thêm hệ thống kho dữ liệu riêng biệt.

## 5.13 Tổng hợp triển khai

Bảng 5.1. Tổng hợp các chức năng đã triển khai

| Chức năng | Thành phần frontend chính | Thành phần backend chính | Dữ liệu chính |
|---|---|---|---|
| Xác thực và phân quyền | `src/features/auth/*` | `AuthController`, `AuthService`, guards | `User`, `UserSession`, `PasswordResetToken` |
| Tra cứu chuyên khoa và bác sĩ | `src/features/public/*` | `DiscoveryController`, `DiscoveryService` | `Specialty`, `DoctorProfile`, `Rating` |
| Quản lý hồ sơ bệnh nhân | `src/features/patient/*` | `PatientController`, `PatientService` | `PatientProfile`, `User` |
| Quản lý hồ sơ bác sĩ và lịch làm việc | `src/features/doctor/*` | `DoctorController`, `DoctorService` | `DoctorProfile`, `DoctorSpecialty`, `Specialty` |
| Hỏi đáp sức khỏe | `src/features/questions/*` | `QuestionController`, `QuestionService` | `Question`, `Answer`, `QuestionModeration` |
| Đặt lịch tư vấn | `src/features/patient/BookAppointmentPage.tsx` | `AppointmentController`, `AppointmentService` | `Appointment`, `DoctorSchedule` |
| Tư vấn trực tuyến và trao đổi tin nhắn | `src/features/consultation/*` | `ConsultationGateway`, `ConsultationService` | `ConsultationSession`, `ConsultationMessage` |
| Kết quả tư vấn và đơn thuốc | `src/features/consultation/ConsultationRoom.tsx` | `ConsultationService` | `Prescription`, `PrescriptionItem` |
| Đánh giá chất lượng tư vấn | `src/features/reviews/*` | `RatingController`, `RatingService` | `Rating`, `Appointment` |
| Thông báo và nhắc lịch | Nhật ký thông báo người dùng | `NotificationService`, `NotificationScheduler` | `OutboxEvent`, `NotificationLog` |
| Quản trị và kiểm duyệt nội dung | `src/features/admin/*` | `AdminUserController`, `ModerationController` | `QuestionModeration`, `AuditLog` |
| Thống kê và báo cáo | `src/features/reports/*` | `ReportingController`, `ReportingService` | `Appointment`, `ConsultationSession`, aggregate data |

# CHƯƠNG 6. KIỂM THỬ VÀ ĐÁNH GIÁ

## 6.1 Phạm vi và mục tiêu kiểm thử

Mục tiêu kiểm thử của hệ thống gồm:

- Xác minh các luồng nghiệp vụ chính: khám phá bác sĩ, xác thực, đặt lịch, hỏi đáp sức khỏe, tư vấn trực tuyến, kết quả tư vấn, đơn thuốc, đánh giá, quản trị và báo cáo.
- Kiểm tra các quy tắc bảo mật quan trọng: xác thực JWT, refresh token, phân quyền theo vai trò, kiểm tra quyền sở hữu dữ liệu và che giấu thông tin nhạy cảm.
- Kiểm tra tính đúng đắn của các quy tắc đặt lịch: lịch làm việc của bác sĩ, khung giờ khả dụng, chống trùng lịch của bác sĩ và bệnh nhân.
- Kiểm tra các thành phần nền như thông báo, outbox, nhắc lịch và xử lý lỗi provider.
- Đối chiếu mức độ đáp ứng yêu cầu SRS bằng ma trận truy vết và ma trận E2E.

## 6.2 Môi trường và phương pháp kiểm thử

Theo `docs/testing/final-e2e-results.md`, môi trường E2E được ghi nhận ngày 2026-08-20 gồm:

- Backend: `OnlineHealthConsultation-Service`.
- Frontend: `OnlineHealthConsultation-Web`.
- Cơ sở dữ liệu: PostgreSQL chạy trong Docker, có dữ liệu mẫu cho kiểm thử.
- Trình duyệt kiểm thử: Playwright Chromium.

Kiểm thử backend, type-check và build được kiểm tra bổ sung ngày 2026-08-22 trong môi trường local.

Các phương pháp được sử dụng:

- **Jest:** kiểm tra logic đơn vị và các luồng nhiều thao tác ở tầng service như đặt lịch, xoay vòng refresh token, outbox và audit khi kiểm duyệt. Các ca chủ yếu dùng mock Prisma hoặc dependency, không thay thế kiểm thử tích hợp trực tiếp với PostgreSQL.
- **E2E:** Playwright kiểm tra thao tác trên giao diện với API backend đang chạy và cơ sở dữ liệu có seed data.
- **Type-check và build:** TypeScript compiler, Nest build và Vite build kiểm tra kiểu tĩnh và khả năng biên dịch.
- **Đối chiếu yêu cầu:** sử dụng `docs/audit/final-srs-traceability.md` và `docs/testing/e2e-test-matrix.md` để kiểm tra phần đã cài đặt và bằng chứng kiểm thử.

GitHub Actions đã được cấu hình cho frontend và backend, nhưng chưa có nhật ký thực thi CI được lưu làm bằng chứng.

Bảng 6.1. Bộ ca kiểm thử tiêu biểu

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
| TC-GRAD | Toàn bộ chuỗi kịch bản tốt nghiệp tổng hợp | Vượt qua toàn bộ 4 kịch bản liên thông | Kịch bản GRAD-D đạt khi chạy độc lập; GRAD-A/B/C chưa đạt do lỗi dữ liệu kiểm thử và độ trễ giao diện | Chưa đạt |

## 6.3 Kiểm thử backend

Kiểm thử backend tập trung vào xác thực, lịch hẹn, thông báo, kiểm duyệt, báo cáo, hồ sơ bác sĩ, cấu hình môi trường và bộ lọc ngoại lệ. Các ca xác thực kiểm tra xoay vòng refresh token, token không hợp lệ, phiên hết hạn hoặc đã thu hồi, đăng xuất, cookie HttpOnly và cờ bảo mật cookie. Luồng quên mật khẩu được kiểm tra để không làm lộ trạng thái email; đặt lại mật khẩu thu hồi các phiên cũ.

Đối với lịch hẹn, Jest kiểm tra lịch khả dụng, loại bỏ khung giờ đã có lịch, từ chối bác sĩ chưa được công khai hoặc ngừng hoạt động, thời gian ngoài lịch làm việc, xung đột của bác sĩ và bệnh nhân, lịch liền kề và quy tắc khi đổi lịch. Các ca này dùng mock tầng dữ liệu; chưa có kiểm thử tải đồng thời để xác minh chống trùng lịch dưới tải thực tế.

Kiểm thử thông báo bao gồm `APPOINTMENT_CREATED`, `QUESTION_ANSWERED`, nhắc lịch, trạng thái thất bại và retry khi provider lỗi. Luồng đặt lại mật khẩu được kiểm tra với development provider và không lưu token dạng plain text trong môi trường production khi email lỗi. Các kiểm thử khác xác minh audit log khi kiểm duyệt và số liệu báo cáo theo khoảng thời gian.

## 6.4 Kiểm thử E2E

Playwright kiểm tra các luồng công khai, xác thực theo vai trò, đặt lịch, hỏi đáp, thao tác của bác sĩ, quản trị và client Socket.IO. Các kịch bản xác thực xác minh điều hướng sau đăng nhập, chuyển khách truy cập về trang đăng nhập, chặn truy cập sai vai trò và đăng xuất.

Bảng 6.2. Các nhóm luồng E2E đã kiểm thử

| Nhóm luồng nghiệp vụ | Bằng chứng kiểm thử | Kết quả đánh giá |
| -- | -- | -- |
| Tra cứu công khai | `public.spec.ts`, E2E-001 đến E2E-005 | Đạt (thuộc bộ 42 bài kiểm thử cốt lõi) |
| Xác thực theo vai trò | `auth.spec.ts`, E2E-006 đến E2E-012 và các bài kiểm thử trang xác thực | Đạt (thuộc bộ 42 bài kiểm thử cốt lõi) |
| Đặt lịch hẹn của bệnh nhân | `patient-appointments.spec.ts`, E2E-013 đến E2E-017 | Đạt (thuộc bộ 42 bài kiểm thử cốt lõi) |
| Hỏi đáp giữa bệnh nhân và bác sĩ | `patient-questions.spec.ts`, E2E-018 đến E2E-023 | Đạt (thuộc bộ 42 bài kiểm thử cốt lõi) |
| Quy trình tư vấn và kê đơn của bác sĩ | `doctor-workflow.spec.ts`, E2E-024 đến E2E-029 | Đạt (thuộc bộ 42 bài kiểm thử cốt lõi) |
| Bảng điều khiển quản trị, bác sĩ, chuyên khoa và bảo vệ route | `admin.spec.ts`, E2E-030 đến E2E-035 | Đạt (thuộc bộ 42 bài kiểm thử cốt lõi) |
| Kết nối của client Socket | `consultation-socket-client.spec.ts` | Đạt (thuộc bộ 42 bài kiểm thử cốt lõi) |

`doctor-workflow.spec.ts` kiểm tra mở phiên tư vấn, lưu tóm tắt, tạo đơn thuốc và bệnh nhân xem kết quả khi có dữ liệu. `consultation-socket-client.spec.ts` kiểm tra access token, tham gia phòng, gửi tin, reconnect, cleanup listener và trường hợp thiếu token. Kết quả client Socket.IO chưa đủ để kết luận luồng chat đồng thời giữa hai trình duyệt đã được kiểm chứng.

Bộ Graduation E2E trong `graduation-flows.spec.ts` chưa đạt toàn diện. Theo biên bản, các trở ngại liên quan đến seed data, tương tác giao diện, timing và assertion mismatch; bộ này chưa được dùng làm bằng chứng tất cả luồng liên thông đều đạt.

## 6.5 Tổng hợp kết quả kiểm thử

Kết quả chạy bổ sung ngày 2026-08-22:

Bảng 6.3. Kết quả kiểm thử tổng hợp

| Nhóm kiểm tra | Lệnh thực thi | Kết quả thực tế | Đánh giá |
| -- | -- | -- | -- |
| Backend Jest | `npm test -- --runInBand` | 9 bộ kiểm thử thành công, 47 ca kiểm thử đạt, 0 lỗi | Đạt |
| Backend type-check | `npm run type-check` | Lệnh `tsc --noEmit` hoàn tất không có lỗi | Đạt |
| Backend build | `npm run build` | Lệnh `nest build` biên dịch thành công | Đạt |
| Frontend type-check | `npm run type-check` | Lệnh `tsc --noEmit` hoàn tất không có lỗi | Đạt |
| Frontend build | `npm run build` | Đóng gói sản phẩm hoàn tất | Đạt |

Các bước kiểm tra hoàn tất với cảnh báo `ts-jest` về hybrid module và `isolatedModules`, dữ liệu Browserslist cũ và chunk frontend lớn hơn 500 kB sau minification. Log `Email failed` thuộc ca giả lập provider lỗi, không phải ca kiểm thử thất bại.

Bảng 6.4. Kết quả các bộ kiểm thử E2E

Kết quả E2E đã ghi nhận trong `docs/testing/final-e2e-results.md`:

| Phân nhóm kiểm thử E2E | Kết quả thực tế | Đánh giá tổng hợp |
| -- | -- | -- |
| Bộ kiểm thử cốt lõi (smoke, auth, appointment, question, doctor, admin, socket) | Tổng số 43 bài: Đạt 42, Thất bại 0, Tạm bỏ qua 1 | Đạt một phần |
| Bộ kiểm thử tốt nghiệp (graduation suite) chạy thử không có biến môi trường seed | Tổng số 4 bài: Tạm bỏ qua 4 | Chưa kiểm chứng |
| Bộ kiểm thử tốt nghiệp (graduation suite) với biến môi trường seed | 1 bài thất bại, 1 bài không ổn định (flaky), 2 bài không chạy; kịch bản `GRAD-D` đạt khi chạy độc lập | Chưa đạt |

Backend đạt 9 test suite với 47 ca kiểm thử, 0 lỗi. Core E2E đạt 42/43 ca, 0 thất bại và 1 skipped (tạm bỏ qua), nên đánh giá chung là Đạt một phần. Kết quả type-check/build xác nhận mã nguồn biên dịch được, không thay thế kiểm thử hành vi.

Kiểm tra bảo mật ghi nhận validation toàn cục, bộ lọc ngoại lệ tập trung, tiêu đề bảo mật HTTP, CORS theo môi trường, kiểm tra khóa bí mật JWT, cookie bảo mật, RBAC, kiểm tra quyền sở hữu và khử dữ liệu nhạy cảm trong log. Các chỉ số hiệu năng và tính sẵn sàng chưa được đo độc lập.

## 6.6 Mức độ bao phủ yêu cầu

Ma trận truy vết trong `docs/audit/final-srs-traceability.md` đối chiếu yêu cầu với chức năng đã triển khai và bằng chứng kiểm thử. Mức độ hoàn thành cài đặt được phân biệt với mức độ kiểm thử tự động.

Bảng 6.5. Mức độ bao phủ yêu cầu SRS

| Nhóm yêu cầu chức năng | Mức độ đáp ứng theo ma trận truy vết | Bằng chứng kiểm thử liên quan |
| -- | -- | -- |
| Truy cập công khai và tra cứu bác sĩ | Chủ yếu đã hoàn thành | `public.spec.ts`; kiểm tra cài đặt tra cứu |
| Xác thực và phân quyền (Authentication / Authorization) | Hoàn thành | `auth.service.spec.ts`, `auth.controller.spec.ts`, `auth.spec.ts`, kiểm tra an toàn bảo mật |
| Hồ sơ bệnh nhân và bác sĩ | Hoàn thành (có điều chỉnh định dạng tên) với cách lưu họ tên đầy đủ | Kiểm thử backend cho bác sĩ; hồ sơ bệnh nhân đã được cài đặt nhưng chưa có kịch bản E2E riêng |
| Hỏi đáp sức khỏe | Hoàn thành | `patient-questions.spec.ts`, kiểm tra thông báo và câu hỏi |
| Quản lý lịch hẹn | Hoàn thành | `appointment.service.spec.ts`, `patient-appointments.spec.ts`, kiểm thử quy trình bác sĩ |
| Tư vấn thời gian thực | Hoàn thành việc cài đặt; kiểm thử tự động E2E đạt một phần đối với tương tác hai trình duyệt đồng thời | `doctor-workflow.spec.ts`, `consultation-socket-client.spec.ts` |
| Kết quả tư vấn và đơn thuốc | Hoàn thành | `doctor-workflow.spec.ts` |
| Đánh giá chất lượng tư vấn | Hoàn thành việc cài đặt; kịch bản kiểm thử E2E đánh giá tích cực/tiêu cực chưa có trong ma trận | Ma trận truy vết, kiểm thử kiểm duyệt |
| Thông báo và nhắc lịch | Cơ chế outbox/log/nhắc lịch hoàn thành; tích hợp dịch vụ email thực tế: Đạt một phần | `notification.service.spec.ts`; chưa có bằng chứng gửi email trên môi trường thực tế |
| Quản trị, kiểm duyệt và báo cáo thống kê | Hoàn thành | `admin.spec.ts`, `moderation.service.spec.ts`, `reporting.service.spec.ts` |
| Yêu cầu phi chức năng (hiệu năng, độ sẵn sàng, đa trình duyệt) | Nhiều mục ở mức Đạt một phần | Chưa có kiểm thử tải, kiểm thử tính sẵn sàng cao hoặc kiểm thử đa trình duyệt |
| Các hạng mục mở rộng hoặc ngoài phạm vi bắt buộc | Không áp dụng hoặc chưa triển khai | Tải lên tệp, chatbot, SMS/video nâng cao không thuộc phạm vi bắt buộc hoặc chưa triển khai |

## 6.7 Giới hạn kiểm thử

Các giới hạn kiểm thử được tổng hợp thành năm nhóm:

- **Bao phủ E2E:** một số luồng chưa được kiểm thử đầy đủ. `GRAD-A`, `GRAD-B`, `GRAD-C` còn trở ngại do dữ liệu seed, độ trễ giao diện hoặc assertion mismatch; `GRAD-D` đạt khi chạy độc lập. Core E2E có 1 skipped, chưa được ghi nhận là đạt. Chưa có báo cáo code coverage để công bố tỷ lệ bao phủ mã nguồn.
- **Hiệu năng và vận hành:** chưa có benchmark, load test, concurrency test hoặc kiểm thử High Availability. Mục tiêu dưới 3 giây cho 95% request chưa được xác minh bằng đo lường.
- **Trình duyệt và realtime:** kiểm thử cross-browser, mobile responsive và chat đồng thời giữa bệnh nhân–bác sĩ trên hai browser context chưa đầy đủ.
- **Dịch vụ bên ngoài và CI:** chưa có bằng chứng chuyển phát email qua dịch vụ thương mại hoặc nhật ký thực thi từ máy chủ CI.
- **Kịch bản giao diện và quyền truy cập:** cần bổ sung tự động hóa cho các luồng hồ sơ, đánh giá, kiểm duyệt, báo cáo và tình huống dữ liệu không hợp lệ. Các trường hợp khung giờ không khả dụng, bác sĩ chưa được duyệt hoặc ngừng hoạt động, nhiều yêu cầu refresh token đồng thời và truy cập chéo đơn thuốc vẫn cần thêm kiểm thử.

# CHƯƠNG 7. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

## 7.1 Kết quả đạt được

Đề tài đã xây dựng ứng dụng web cho khách truy cập, bệnh nhân, bác sĩ và quản trị viên. Hệ thống hỗ trợ quy trình từ tra cứu, đặt lịch, hỏi đáp, tư vấn đến lưu kết quả và quản trị hoạt động.

Các chức năng có kiểm tra xác thực, phân quyền và quyền sở hữu dữ liệu. Kết quả kiểm thử và những phần chưa được xác minh đầy đủ được trình bày ở Chương 6.

Bảng 7.1. Mức độ đáp ứng mục tiêu đề tài

| Mục tiêu | Mức độ đáp ứng hiện tại |
|---|---|
| Xây dựng ứng dụng web hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn | Đã triển khai với frontend React SPA, backend NestJS và PostgreSQL |
| Hỗ trợ truy cập công khai, tìm kiếm chuyên khoa/bác sĩ | Đã triển khai |
| Hỗ trợ đăng ký, đăng nhập, đăng xuất, khôi phục mật khẩu và phân quyền | Đã triển khai |
| Hỗ trợ bệnh nhân quản lý hồ sơ, hỏi đáp, đặt lịch, theo dõi tư vấn | Đã triển khai |
| Hỗ trợ bác sĩ quản lý hồ sơ, lịch làm việc, câu hỏi, lịch hẹn và tư vấn | Đã triển khai |
| Hỗ trợ chat trong phiên tư vấn và lưu lịch sử trao đổi | Đã triển khai chat thời gian thực và lưu lịch sử trao đổi |
| Hỗ trợ kết quả tư vấn, đơn thuốc cơ bản và đánh giá | Đã triển khai |
| Hỗ trợ quản trị, kiểm duyệt và báo cáo | Đã triển khai |
| Đảm bảo yêu cầu bảo mật và kiểm soát truy cập cơ bản | Đã triển khai các cơ chế xác thực, phân quyền và kiểm tra quyền sở hữu |

## 7.2 Hạn chế

Hệ thống hiện còn các giới hạn về tích hợp và vận hành:

- Chưa tích hợp dịch vụ email thương mại chính thức. Lớp provider và bộ điều phối nội bộ đã được xây dựng; chuyển phát thực tế phụ thuộc cấu hình hạ tầng.
- SMS chưa kết nối với nhà cung cấp thực tế và vẫn là khả năng mở rộng tùy chọn.
- Video dừng ở giao diện mô phỏng và cơ chế dự phòng; kênh tư vấn chính hiện là chat thời gian thực.
- Tệp đính kèm và object storage chưa có luồng giao diện hoàn chỉnh; `FileAttachment` mới có trong mô hình dữ liệu để mở rộng.
- Chưa có bằng chứng về năng lực chịu tải đồng thời, High Availability và khả năng tương thích trình duyệt đầy đủ để đánh giá mức sẵn sàng vận hành thực tế.

Các khoảng trống kiểm thử tự động, Graduation E2E và bằng chứng CI được liệt kê tại mục 6.7.

## 7.3 Hướng phát triển

Các hướng phát triển tiếp theo gồm:

**Tích hợp dịch vụ gửi thư điện tử và tin nhắn SMS thương mại**

Hệ thống có thể được mở rộng bằng việc liên kết trực tiếp với các nhà cung cấp dịch vụ gửi thư điện tử và tin nhắn SMS thương mại để tự động phát thông báo đặt lịch, nhắc nhở và hỗ trợ khôi phục mật khẩu trong môi trường vận hành thực tế. Quá trình này đòi hỏi bổ sung cơ chế kiểm thử chuyển phát, chính sách gửi lại (retry) và tránh xử lý lặp (idempotency).

**Tích hợp tư vấn qua video**

Hệ thống có thể tích hợp WebRTC hoặc dịch vụ video để hỗ trợ cuộc gọi giữa bác sĩ và bệnh nhân. Phần tích hợp cần kiểm soát quyền truy cập phiên và mã hóa đường truyền.

**Bổ sung object storage cho tệp đính kèm**

Hệ thống có thể bổ sung luồng tải lên và quản lý tệp đính kèm như ảnh xét nghiệm, tài liệu tham khảo hoặc tệp liên quan đến tư vấn. Hướng này cần object storage, kiểm soát loại tệp/kích thước, quét an toàn, phân quyền truy cập và chính sách lưu trữ dữ liệu sức khỏe.

**Mở rộng báo cáo và phân tích**

Phân hệ báo cáo có thể được phát triển thêm các bộ lọc và biểu đồ chi tiết hơn theo chuyên khoa, bác sĩ, trạng thái lịch hẹn, tỷ lệ hoàn tất tư vấn, phản hồi người dùng và xu hướng theo thời gian. Với dữ liệu lớn hơn, có thể cân nhắc cơ chế tổng hợp định kỳ hoặc kho dữ liệu báo cáo riêng.

**Phát triển mobile client**

Ngoài web responsive, hệ thống có thể phát triển ứng dụng mobile để cải thiện trải nghiệm đặt lịch, nhắc lịch, chat và nhận thông báo. Mobile client cần tái sử dụng API hiện có nhưng bổ sung kiểm thử đặc thù cho thiết bị di động, push notification và trạng thái offline/online.

**Nâng cấp hạ tầng xử lý thời gian thực**

Khi số lượng phiên tư vấn diễn ra đồng thời tăng cao, phân hệ giao tiếp thời gian thực có thể được bổ sung cơ chế Pub/Sub (thông qua Redis Adapter cho Socket.IO) nhằm hỗ trợ phân tải trên nhiều tiến trình máy chủ và duy trì luồng trao đổi tin nhắn khi số lượng kết nối đồng thời gia tăng.

**Tích hợp với hệ thống y tế bên ngoài**

Trong tương lai, hệ thống có thể xem xét tích hợp với hệ thống bệnh viện, hồ sơ sức khỏe điện tử hoặc các chuẩn trao đổi dữ liệu y tế nếu có yêu cầu thực tế. Hướng này cần đánh giá pháp lý, chuẩn dữ liệu, bảo mật, quyền riêng tư và quy trình đồng ý của người bệnh.

**Hỗ trợ AI có kiểm soát an toàn**

Một hướng mở rộng tùy chọn là bổ sung năng lực AI hỗ trợ phân loại câu hỏi, gợi ý thông tin tham khảo hoặc hỗ trợ bác sĩ trong việc tổng hợp nội dung tư vấn. Nếu triển khai, AI phải có giới hạn an toàn rõ ràng, không tự đưa ra chẩn đoán thay bác sĩ, không thay thế tư vấn chuyên môn và cần cơ chế kiểm duyệt, giải thích, ghi log cũng như bảo vệ dữ liệu sức khỏe.

## 7.4 Bài học kinh nghiệm

Các nghiệp vụ đặt lịch cần được kiểm tra ở backend, kể cả khi giao diện đã lọc khung giờ. Việc kiểm tra lịch làm việc, xung đột của cả bác sĩ và bệnh nhân, cùng transaction giúp kiểm soát dữ liệu khi nhiều thao tác liên quan được thực hiện.

Frontend guard hỗ trợ điều hướng, còn quyền truy cập phải được kiểm tra tại backend bằng role check và ownership check. SRS và ma trận truy vết giúp phát hiện khác biệt giữa yêu cầu, phần đã cài đặt và phần đã kiểm thử, thay vì coi ba mức này là tương đương.

Outbox giúp tách nghiệp vụ chính khỏi kênh gửi thông báo nhưng cần theo dõi trạng thái và retry khi provider lỗi. Các vấn đề trong Graduation E2E cũng cho thấy dữ liệu seed và đồng bộ giao diện cần được chuẩn bị cùng kịch bản kiểm thử để kết quả ổn định.

## 7.5 Kết luận

Đề tài đã xây dựng hệ thống hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến trong phạm vi đã xác định. Các chức năng trong phạm vi đề tài và cơ chế kiểm soát truy cập đã được triển khai; kết quả kiểm thử cung cấp bằng chứng cho các luồng chính, đồng thời chỉ ra những phần cần tiếp tục xác minh.

Việc hoàn thiện email, video, lưu trữ tệp và đánh giá tải thực tế là những bước tiếp theo để nâng cao khả năng vận hành. Hệ thống giữ vai trò hỗ trợ tư vấn và quản lý thông tin, không thay thế chẩn đoán chuyên môn, cấp cứu hoặc khám trực tiếp.

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
