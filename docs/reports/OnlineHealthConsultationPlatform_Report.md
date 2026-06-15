**BỘ KHOA HỌC VÀ CÔNG NGHỆ**

**HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG**

TODO: Hình logo trường/khoa

BÁO CÁO

ĐỒ ÁN MÔN HỌC

**ĐỀ TÀI SỐ: 04**

**XÂY DỰNG VÀ KIỂM THỬ NỀN TẢNG**

**TƯ VẤN SỨC KHỎE TRỰC TUYẾN**

**MÔN HỌC: ĐẢM BẢO CHẤT LƯỢNG PHẦN MỀM**

**Giảng viên hướng dẫn: Thạc sĩ Nguyễn Anh Hào Thực hiện bởi nhóm sinh viên, bao gồm:**

| **1\.** Nguyễn Việt Thanh | K23DTCN436 | &lt;Trưởng nhóm&gt; |
| ------------------------- | ---------- | ------------------- |
| **2\.** Trần Long Đại     | K23DTCN271 | &lt;Thành viên&gt;  |
| **3\.** Vũ Hải Minh       | K23DTVT066 | &lt;Thành viên&gt;  |

**TP. Hồ Chí Minh - Tháng 5/2026**

**LỜI CẢM ƠN**

Nhóm thực hiện đề tài xin gửi lời cảm ơn chân thành đến nhà trường và khoa đã tạo điều kiện học tập, cung cấp nền tảng kiến thức và môi trường thực hành để nhóm có cơ hội tiếp cận môn học Đảm bảo chất lượng phần mềm theo hướng gắn với một sản phẩm cụ thể.

Nhóm xin trân trọng cảm ơn giảng viên hướng dẫn đã định hướng nội dung, góp ý phương pháp phân tích yêu cầu, thiết kế kiểm thử và cách trình bày báo cáo. Những góp ý trong quá trình học tập giúp nhóm hiểu rõ hơn vai trò của đảm bảo chất lượng phần mềm, đặc biệt là mối liên hệ giữa tài liệu yêu cầu, thiết kế hệ thống, đặc tả test case và kiểm thử tự động.

Bên cạnh đó, nhóm cũng ghi nhận sự cố gắng và tinh thần phối hợp của từng thành viên trong quá trình thực hiện đề tài. Các thành viên đã cùng nhau phân chia công việc, rà soát nội dung, bổ sung tài liệu và hoàn thiện báo cáo theo phạm vi đã thống nhất.

Mặc dù nhóm đã nỗ lực hoàn thành báo cáo, do giới hạn về thời gian và kinh nghiệm thực tế, nội dung vẫn khó tránh khỏi thiếu sót. Nhóm kính mong nhận được nhận xét và góp ý từ giảng viên để có thể điều chỉnh, hoàn thiện kiến thức và rút kinh nghiệm cho các đồ án tiếp theo.

Xin trân trọng cảm ơn.

Thành phố Hồ Chí Minh, ngày 23 tháng 5 năm 2026

# MỤC LỤC

[**LỜI CẢM ƠN 2**](#_Toc230335403)

[**MỤC LỤC 3**](#_Toc230335404)

[**DANH SÁCH HÌNH ẢNH 5**](#_Toc230335405)

[**DANH SÁCH BẢNG 5**](#_Toc230335406)

[**TÓM TẮT 6**](#_Toc230335407)

[**CHƯƠNG I. TỔNG QUAN 8**](#_Toc230335408)

[**1\. Giới thiệu đề tài 8**](#_Toc230335409)

[**1.1. Mục đích của đề tài 8**](#_Toc230335410)

[**1.2. Mục tiêu 9**](#_Toc230335411)

[**1.3. Phương pháp tiến hành 10**](#_Toc230335412)

[**1.3.1. Khảo sát và phân tích 10**](#_Toc230335413)

[**1.3.2. Nghiên cứu công nghệ 10**](#_Toc230335414)

[**1.3.3. Phân tích và thiết kế hệ thống 10**](#_Toc230335415)

[**1.3.4. Triển khai chức năng 10**](#_Toc230335416)

[**1.3.5. Thiết kế kiểm thử 10**](#_Toc230335417)

[**1.3.6. Hiện thực kiểm thử tự động 11**](#_Toc230335418)

[**1.3.7. Ghi nhận kết quả và đánh giá 11**](#_Toc230335419)

[**2\. Vai trò và nhiệm vụ của mỗi thành viên 11**](#_Toc230335420)

[**3\. Cơ sở lý thuyết 11**](#_Toc230335421)

[**3.3.1 Guest User 14**](#_Toc230335422)

[**3.3.2. Patient 15**](#_Toc230335423)

[**3.3.3. Doctor 15**](#_Toc230335424)

[**3.3.4. Administrator 15**](#_Toc230335425)

[**3.3.5. Notification Service 15**](#_Toc230335426)

[**3.3.6. Video Communication Service 15**](#_Toc230335427)

[**3.3.7. File Storage Service 15**](#_Toc230335428)

[**CHƯƠNG II. PHÂN TÍCH & THIẾT KẾ HỆ THỐNG 18**](#_Toc230335429)

[**1\. Yêu cầu từ Stakeholder 18**](#_Toc230335430)

[**1.1. Khảo sát nhu cầu người dùng 18**](#_Toc230335431)

[**1.2. User Story 19**](#_Toc230335432)

[**1.3. Thiết kế Wireframe & Prototype 20**](#_Toc230335433)

[**2\. Phân tích hệ thống 21**](#_Toc230335434)

[**2.1. Usecase tổng quan toàn hệ thống 21**](#_Toc230335435)

[**2.2. Usecase Guest tra cứu bác sĩ - UC01 22**](#_Toc230335436)

[**2.3. Usecase đăng ký / đăng nhập / phân quyền - UC02 25**](#_Toc230335437)

[**2.4. Usecase Patient đặt lịch tư vấn - UC03 27**](#_Toc230335438)

[**2.5. Usecase Patient gửi câu hỏi và Doctor phản hồi - UC04 30**](#_Toc230335439)

[**2.6. Usecase Doctor tư vấn, ghi kết quả và đơn thuốc - UC05 32**](#_Toc230335440)

[**3\. Định nghĩa các yêu cầu chất lượng phần mềm 38**](#_Toc230335441)

[**3.1. Mục tiêu 38**](#_Toc230335442)

[**3.2. Yêu cầu từ môi trường nghiệp vụ 38**](#_Toc230335443)

[**3.3. Yêu cầu từ môi trường vận hành 40**](#_Toc230335444)

[**3.4. Yêu cầu từ môi trường phát triển 41**](#_Toc230335445)

[**3.5. Mapping yêu cầu chất lượng và kỹ thuật kiểm thử 41**](#_Toc230335446)

[**4\. Thiết kế hệ thống 43**](#_Toc230335447)

[**4.1. Kiến trúc hệ thống 43**](#_Toc230335448)

[**4.2. Form/API dùng cho Usecase 44**](#_Toc230335449)

[**4.3. Cơ sở dữ liệu 44**](#_Toc230335450)

[**4.3.1. Nhóm bảng chính 45**](#_Toc230335451)

[**4.3.2. Từ điển cơ sở dữ liệu rút gọn 45**](#_Toc230335452)

[**4.3.3. Quan hệ dữ liệu chính 47**](#_Toc230335453)

[**TÀI LIỆU THAM KHẢO 48**](#_Toc230335454)

| Số bảng | Tên bảng                                        |
| ------- | ----------------------------------------------- |
| Bảng 1  | Phân công nhiệm vụ thành viên                   |
| Bảng 2  | User Story                                      |
| Bảng 3  | Yêu cầu chất lượng từ môi trường nghiệp vụ      |
| Bảng 4  | Mapping yêu cầu chất lượng và kỹ thuật kiểm thử |
| Bảng 5  | Form/API dùng cho Usecase                       |
| Bảng 6  | Từ điển cơ sở dữ liệu                           |

# DANH SÁCH HÌNH ẢNH

| Số hình | Tên hình                                                      |
| ------- | ------------------------------------------------------------- |
| Hình 1  | Tổng quan quy trình tư vấn sức khỏe trực tuyến                |
| Hình 2  | Use case tổng quan toàn hệ thống                              |
| Hình 3  | Use case Guest User                                           |
| Hình 4  | Use case Patient                                              |
| Hình 5  | Use case Doctor                                               |
| Hình 6  | Use case Administrator                                        |
| Hình 7  | Biểu đồ hoạt động Guest tra cứu bác sĩ                        |
| Hình 8  | Biểu đồ hoạt động đăng ký / đăng nhập / phân quyền            |
| Hình 9  | Biểu đồ hoạt động Patient đặt lịch tư vấn                     |
| Hình 10 | Biểu đồ hoạt động Patient gửi câu hỏi và Doctor phản hồi      |
| Hình 11 | Biểu đồ hoạt động Doctor tư vấn, ghi kết quả và đơn thuốc     |
| Hình 12 | Biểu đồ hoạt động Administrator quản lý hệ thống và dashboard |
| Hình 13 | Kiến trúc hệ thống                                            |
| Hình 14 | ERD / Database diagram                                        |

## DANH SÁCH BẢNG

## TÓM TẮT

Đề tài "Xây dựng và kiểm thử nền tảng tư vấn sức khỏe trực tuyến" được thực hiện trong khuôn khổ môn học Đảm bảo chất lượng phần mềm. Mục tiêu của đề tài là xây dựng một ứng dụng web hỗ trợ người dùng tiếp cận dịch vụ tư vấn sức khỏe từ xa, đồng thời áp dụng các hoạt động đảm bảo chất lượng phần mềm từ giai đoạn phân tích yêu cầu đến thiết kế test case và định hướng kiểm thử tự động.

Phạm vi cốt lõi của hệ thống được xác định theo tài liệu yêu cầu của Online Health Consultation Platform. Hệ thống phục vụ bốn actor chính gồm Guest User, Patient, Doctor và Administrator. Bên cạnh các actor trực tiếp, hệ thống còn tương tác với các hệ thống bên ngoài gồm Notification Service, Video Communication Service và File Storage Service để hỗ trợ thông báo, phiên tư vấn trực tuyến và lưu trữ tệp liên quan đến hồ sơ hoặc nội dung tư vấn.

Về chức năng, hệ thống bao gồm các nhóm nghiệp vụ chính: public access/discovery, authentication/authorization, patient profile, doctor profile, specialty management, doctor discovery, health question, appointment, consultation session, consultation result/prescription, rating, notification, admin management và reporting/dashboard. Các nhóm chức năng này phản ánh đầy đủ phạm vi sử dụng của nền tảng, từ việc người dùng khách tra cứu thông tin bác sĩ, bệnh nhân đăng ký tài khoản và đặt lịch tư vấn, bác sĩ phản hồi câu hỏi và thực hiện phiên tư vấn, đến việc quản trị viên quản lý người dùng, chuyên khoa, lịch hẹn, nội dung và số liệu vận hành.

Báo cáo không chỉ tập trung vào một vài luồng minh họa, mà tổ chức nội dung phân tích và kiểm thử theo đầy đủ các nhóm use case chính trong tài liệu yêu cầu. Một số luồng E2E quan trọng như tra cứu bác sĩ, đặt lịch tư vấn, gửi và phản hồi câu hỏi sức khỏe, tham gia phiên tư vấn trực tuyến có thể được chọn để minh họa automation test bằng Playwright. Tuy nhiên, phần phân tích yêu cầu, mapping use case và đặc tả test case vẫn cần bao phủ các nhóm actor và chức năng chính của hệ thống.

Định hướng đảm bảo chất lượng của đề tài gồm: phân tích yêu cầu, thiết kế use case, thiết kế UI/API/database, thiết kế test case, xây dựng kiểm thử tự động bằng Playwright cho các luồng phù hợp, kết hợp checklist rà soát bảo mật, phân quyền và quyền riêng tư dữ liệu sức khỏe. Báo cáo không ghi kết quả kiểm thử thực tế khi chưa có quá trình thực thi và minh chứng tương ứng; các kết quả, lỗi phát hiện và hình ảnh minh chứng sẽ được bổ sung sau khi nhóm hoàn tất hoạt động kiểm thử.

Về công nghệ, frontend sử dụng React 18, TypeScript, Vite, React Router v6, Redux Toolkit, Redux Saga, Axios, PrimeReact, Tailwind CSS, Formik, Yup, i18next và Recharts. Backend được trình bày theo hướng Node.js với NestJS, TypeScript, Prisma ORM và PostgreSQL; hệ thống sử dụng JWT, RBAC và kiểm soát quyền sở hữu dữ liệu cho xác thực và phân quyền. Công cụ kiểm thử chính là Playwright cho E2E automation test; tùy phạm vi triển khai, nhóm có thể bổ sung Postman/API testing và Jest/unit test cho các tầng phù hợp.

# CHƯƠNG I. TỔNG QUAN

## 1\. Giới thiệu đề tài

Trong những năm gần đây, chuyển đổi số trong lĩnh vực y tế trở thành một nhu cầu rõ rệt khi người dân ngày càng quan tâm đến việc tiếp cận thông tin sức khỏe nhanh chóng, thuận tiện và an toàn. Bên cạnh hình thức khám trực tiếp tại cơ sở y tế, các nền tảng tư vấn sức khỏe trực tuyến giúp rút ngắn khoảng cách giữa bệnh nhân và bác sĩ, hỗ trợ người dùng đặt câu hỏi, đặt lịch và nhận tư vấn ban đầu mà không phụ thuộc hoàn toàn vào vị trí địa lý.

Đề tài "Xây dựng và kiểm thử nền tảng tư vấn sức khỏe trực tuyến" được thực hiện nhằm xây dựng một hệ thống web hỗ trợ các nghiệp vụ cốt lõi của quá trình tư vấn sức khỏe từ xa. Hệ thống cho phép người dùng xem thông tin nền tảng, tra cứu chuyên khoa, tìm kiếm bác sĩ, xem hồ sơ công khai của bác sĩ, gửi câu hỏi sức khỏe, đặt lịch tư vấn, tham gia phiên tư vấn trực tuyến, nhận phản hồi, xem kết quả tư vấn hoặc đơn thuốc và đánh giá chất lượng tư vấn sau khi hoàn tất.

Đối với bác sĩ, hệ thống hỗ trợ quản lý hồ sơ chuyên môn, theo dõi lịch tư vấn, phản hồi câu hỏi sức khỏe, tham gia phiên tư vấn và ghi nhận kết quả tư vấn cho bệnh nhân. Đối với quản trị viên, hệ thống cung cấp các chức năng quản lý người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, nội dung cần kiểm duyệt và dashboard thống kê để phục vụ vận hành nền tảng.

Do hệ thống xử lý thông tin cá nhân và dữ liệu sức khỏe, đảm bảo chất lượng phần mềm là nội dung trọng tâm của đề tài. Các yếu tố cần được quan tâm gồm bảo mật, quyền riêng tư, phân quyền theo vai trò, quyền sở hữu dữ liệu, validation form/API, kiểm soát trạng thái lịch hẹn, thông báo lỗi rõ ràng và tính đúng đắn của các luồng nghiệp vụ. Việc kiểm thử không chỉ nhằm xác nhận giao diện hoạt động đúng, mà còn nhằm đánh giá hệ thống có bảo vệ dữ liệu và thực thi quy tắc nghiệp vụ đúng như tài liệu yêu cầu hay không.

#### Mục đích của đề tài

Mục đích của đề tài là xây dựng nền tảng web tư vấn sức khỏe trực tuyến theo phạm vi cốt lõi đã xác định trong tài liệu yêu cầu. Nền tảng cần đáp ứng các nhu cầu cơ bản của Guest User, Patient, Doctor và Administrator, đồng thời có khả năng tích hợp với các dịch vụ hỗ trợ như Notification Service, Video Communication Service và File Storage Service.

Thông qua đề tài, nhóm vận dụng kiến thức của môn Đảm bảo chất lượng phần mềm vào một sản phẩm có nhiều yêu cầu nghiệp vụ và yêu cầu chất lượng rõ ràng. Các nội dung như phân tích yêu cầu, thiết kế use case, thiết kế dữ liệu, thiết kế API, đặc tả test case, kiểm thử phân quyền và kiểm thử luồng nghiệp vụ được trình bày như một chuỗi liên kết từ yêu cầu đến đánh giá chất lượng.

Báo cáo hướng đến việc thể hiện mối quan hệ giữa yêu cầu, thiết kế, triển khai và kiểm thử. Mỗi chức năng chính cần có cơ sở yêu cầu, cách thiết kế phù hợp, điều kiện kiểm thử và tiêu chí đánh giá rõ ràng. Đây là cơ sở để nhóm đánh giá hệ thống thông qua các test case chức năng, test case phân quyền, test case dữ liệu và test case theo luồng nghiệp vụ.

#### Mục tiêu

Các mục tiêu chính của đề tài gồm:

- Phân tích tài liệu yêu cầu và xác định đầy đủ actor, external service và các nhóm use case chính của hệ thống.
- Xây dựng user story và use case theo từng actor: Guest User, Patient, Doctor và Administrator.
- Thiết kế wireframe/UI, API, database và architecture phù hợp với phạm vi cốt lõi.
- Triển khai hoặc mô tả các chức năng chính, gồm public discovery, authentication/authorization, hồ sơ bệnh nhân, hồ sơ bác sĩ, chuyên khoa, tìm kiếm bác sĩ, hỏi đáp sức khỏe, đặt lịch, phiên tư vấn, kết quả tư vấn/đơn thuốc, đánh giá, thông báo, quản trị và báo cáo.
- Thiết kế test case theo từng nhóm actor/use case, bao phủ cả luồng hợp lệ, luồng lỗi, dữ liệu không hợp lệ và kiểm soát quyền truy cập.
- Áp dụng các kỹ thuật kiểm thử như Black-box Testing, Equivalence Partitioning, Boundary Value Analysis, Decision Table, API testing và E2E testing.
- Định hướng kiểm thử tự động bằng Playwright cho một số luồng E2E quan trọng khi giao diện và dữ liệu kiểm thử đã sẵn sàng.
- Rà soát các yêu cầu bảo mật, phân quyền và privacy, đặc biệt đối với dữ liệu sức khỏe, token, mật khẩu, lịch hẹn, nội dung tư vấn và đơn thuốc.
- Tổng hợp kết quả kiểm thử, ghi nhận lỗi và đề xuất cải tiến sau khi có quá trình thực thi kiểm thử thực tế.

#### Phương pháp tiến hành

- - 1. _Khảo sát và phân tích_

Nhóm bắt đầu bằng việc đọc và phân tích tài liệu yêu cầu của Online Health Consultation Platform để xác định phạm vi cốt lõi, actor, external service, yêu cầu chức năng và yêu cầu phi chức năng. Kết quả phân tích được dùng để lập danh sách use case, nhóm chức năng chính và các quy tắc nghiệp vụ cần kiểm thử.

- - 1. _Nghiên cứu công nghệ_

Nhóm nghiên cứu các công nghệ phù hợp với hệ thống web tư vấn sức khỏe trực tuyến, bao gồm frontend, backend, database, xác thực, phân quyền, realtime communication, API documentation và công cụ kiểm thử. Việc lựa chọn công nghệ cần bảo đảm hệ thống có khả năng mở rộng ở mức triển khai cơ bản, dễ bảo trì và thuận lợi cho kiểm thử.

- - 1. _Phân tích và thiết kế hệ thống_

Từ yêu cầu đã thu thập, nhóm xây dựng user story, use case, mô tả actor, thiết kế wireframe/UI, API, database và kiến trúc hệ thống. Các thiết kế được trình bày theo hướng có thể kiểm thử, nghĩa là mỗi luồng nghiệp vụ cần có tiền điều kiện, dữ liệu đầu vào, expected result và các trường hợp ngoại lệ rõ ràng.

#### _1.3.4. Triển khai chức năng_

Các chức năng được triển khai hoặc mô tả theo nhóm nghiệp vụ chính trong tài liệu yêu cầu, bao gồm truy cập công khai, xác thực, hồ sơ người dùng, tìm kiếm bác sĩ, hỏi đáp sức khỏe, đặt lịch, tư vấn trực tuyến, kết quả tư vấn, đơn thuốc, đánh giá, thông báo, quản trị và dashboard. Trong quá trình triển khai, các quy tắc phân quyền, validation và kiểm soát trạng thái nghiệp vụ cần được đặt làm tiêu chí quan trọng.

#### _1.3.5. Thiết kế kiểm thử_

Nhóm xây dựng test case theo từng actor và use case, bao gồm test case chức năng, test case dữ liệu, test case phân quyền, test case trạng thái và test case liên quan đến external service. Các kỹ thuật như phân vùng tương đương, giá trị biên và bảng quyết định được áp dụng cho các trường hợp có nhiều điều kiện nghiệp vụ.

#### _1.3.6. Hiện thực kiểm thử tự động_

Một số luồng E2E quan trọng có thể được lựa chọn để minh họa automation test bằng Playwright, chẳng hạn tra cứu bác sĩ, đăng nhập, đặt lịch tư vấn, gửi câu hỏi sức khỏe và bác sĩ phản hồi câu hỏi. Kiểm thử tự động được định hướng như phần hỗ trợ cho quá trình đảm bảo chất lượng, không thay thế toàn bộ kiểm thử thủ công và kiểm thử API.

#### _1.3.7. Ghi nhận kết quả và đánh giá_

Sau khi thực thi kiểm thử, nhóm tổng hợp kết quả, ghi nhận lỗi, phân loại mức độ ảnh hưởng và đề xuất hướng khắc phục. Báo cáo chỉ ghi nhận kết quả kiểm thử khi có quá trình chạy test và minh chứng tương ứng; các phần chưa thực thi được trình bày như kế hoạch hoặc phạm vi cần bổ sung.

- **Vai trò và nhiệm vụ của mỗi thành viên**

| **STT** | **Họ tên**        | **MSSV**    | **Vai trò** | **Nhiệm vụ**                                                                                                                                                                                                  |
| ------- | ----------------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1**   | Nguyễn Việt Thanh | K223DTCN436 | Nhóm trưởng | Phân tích tài liệu yêu cầu, tổng hợp phạm vi cốt lõi, thiết kế cấu trúc báo cáo, định hướng kiến trúc, API/database, test strategy, phân công công việc, tích hợp nội dung từ các thành viên và rà soát cuối. |
| **2**   | Trần Long Đại     | K223DTCN439 | Thành viên  | Phân tích các luồng Patient gồm đăng ký/đăng nhập, quản lý hồ sơ, tìm kiếm bác sĩ, đặt lịch, gửi câu hỏi, xem phản hồi, theo dõi lịch sử tư vấn và đánh giá; hỗ trợ thiết kế test case cho nhóm Patient.      |
| **3**   | Vũ Hải Minh       | K223DTCN380 | Thành viên  | Phân tích các luồng Doctor/Admin gồm hồ sơ bác sĩ, phản hồi câu hỏi, quản lý lịch, tư vấn trực tuyến, đơn thuốc, quản trị hệ thống, dashboard và phân quyền; hỗ trợ test case Doctor/Admin/security.          |

## 3\. Cơ sở lý thuyết

**3.1. Quy trình nghiệp vụ của hệ thống tư vấn sức khỏe trực tuyến**

Hệ thống tư vấn sức khỏe trực tuyến được tổ chức xoay quanh quá trình người dùng tiếp cận thông tin, tạo tài khoản, lựa chọn bác sĩ, trao đổi vấn đề sức khỏe, đặt lịch tư vấn, tham gia phiên tư vấn và nhận kết quả sau tư vấn. Các quy trình nghiệp vụ chính bao gồm:

- Quy trình Guest User tra cứu thông tin và chuyển đổi sang đăng ký/đăng nhập: Guest User xem trang chủ, danh sách chuyên khoa, danh sách bác sĩ và hồ sơ công khai của bác sĩ. Khi chọn thao tác cần xác thực như đặt lịch hoặc gửi câu hỏi, hệ thống chuyển người dùng sang đăng ký/đăng nhập.
- Quy trình Patient đăng ký/đăng nhập và quản lý hồ sơ: Patient tạo tài khoản, đăng nhập và cập nhật hồ sơ cá nhân, thông tin liên hệ, ngày sinh, giới tính và thông tin sức khỏe cần thiết cho quá trình tư vấn.
- Quy trình Patient tìm kiếm bác sĩ và đặt lịch tư vấn: Patient tìm bác sĩ theo chuyên khoa hoặc từ khóa, xem hồ sơ bác sĩ, chọn khung giờ phù hợp, nhập lý do tư vấn và gửi yêu cầu đặt lịch. Hệ thống kiểm tra dữ liệu, quyền truy cập và tình trạng trùng lịch trước khi tạo lịch hẹn.
- Quy trình Patient gửi câu hỏi sức khỏe và xem phản hồi: Patient nhập nội dung câu hỏi, có thể chọn bác sĩ phù hợp nếu luồng nghiệp vụ cho phép, gửi câu hỏi và theo dõi trạng thái. Khi bác sĩ phản hồi, Patient được xem nội dung phản hồi trong phạm vi dữ liệu của chính mình.
- Quy trình Doctor phản hồi câu hỏi: Doctor xem danh sách câu hỏi được phân công hoặc thuộc phạm vi phụ trách, nhập nội dung phản hồi, gửi câu trả lời và cập nhật trạng thái xử lý của câu hỏi.
- Quy trình Doctor quản lý lịch và thực hiện tư vấn: Doctor xem lịch hẹn, xác nhận hoặc theo dõi trạng thái lịch, tham gia phiên tư vấn trực tuyến với Patient đúng lịch và đúng phạm vi phụ trách.
- Quy trình ghi nhận kết quả tư vấn và đơn thuốc: Sau phiên tư vấn, Doctor ghi nhận kết luận, hướng dẫn điều trị hoặc đơn thuốc điện tử cơ bản. Patient chỉ được xem kết quả tư vấn và đơn thuốc gắn với lịch hẹn của chính mình.
- Quy trình Patient đánh giá tư vấn: Sau khi lịch hẹn hoàn tất, Patient có thể gửi đánh giá và nhận xét về chất lượng tư vấn. Hệ thống không cho đánh giá khi phiên tư vấn chưa hoàn tất.
- Quy trình Admin quản lý hệ thống: Administrator quản lý người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, nội dung cần kiểm duyệt và dashboard thống kê.
- Quy trình Notification/Video/File Storage hỗ trợ hệ thống: Notification Service hỗ trợ gửi thông báo và nhắc lịch; Video Communication Service hỗ trợ phiên tư vấn trực tuyến hoặc video mock ở mức triển khai cơ bản; File Storage Service hỗ trợ lưu trữ tệp liên quan đến hồ sơ, tài liệu tư vấn hoặc minh chứng y tế nếu phạm vi triển khai có sử dụng.

TODO: Hình A diagram of a diagram

Description automatically generated

Hình 1 - Tổng quan quy trình tư vấn sức khỏe trực tuyến

**3.2. Các quy định/quy tắc quản lý/quy trình tại hệ thống**

Các quy tắc quản lý là cơ sở để thiết kế hệ thống và xây dựng test case. Đối với nền tảng tư vấn sức khỏe trực tuyến, những quy tắc quan trọng gồm:

- Guest User chỉ được xem dữ liệu public như trang chủ, danh sách chuyên khoa, danh sách bác sĩ và hồ sơ công khai của bác sĩ.
- Patient chỉ được xem và thao tác dữ liệu của chính mình, gồm hồ sơ cá nhân, câu hỏi, lịch hẹn, kết quả tư vấn, đơn thuốc và đánh giá.
- Doctor chỉ được xem dữ liệu được phân công hoặc thuộc phạm vi phụ trách, gồm câu hỏi, lịch hẹn, phiên tư vấn và kết quả tư vấn liên quan.
- Administrator quản lý hệ thống theo quyền được cấp; các thao tác nhạy cảm cần được kiểm soát và ghi nhận để phục vụ truy vết.
- Hệ thống không cho đặt lịch trùng hoặc chồng lấn khung giờ của bác sĩ và bệnh nhân.
- Chỉ Patient và Doctor liên quan đến appointment hợp lệ mới được tham gia phiên tư vấn tương ứng.
- Patient chỉ được đánh giá sau khi phiên tư vấn hoặc lịch hẹn đã hoàn tất.
- Dữ liệu sức khỏe, lịch sử tư vấn, đơn thuốc, thông tin cá nhân và nội dung câu hỏi cần được bảo mật.
- Mật khẩu, token, secret và thông tin xác thực không được hiển thị hoặc ghi log dưới dạng có thể lộ dữ liệu nhạy cảm.
- Form và API phải có validation đối với dữ liệu bắt buộc, định dạng email, độ dài nội dung, ngày giờ đặt lịch và các trường nghiệp vụ quan trọng.
- Thông báo lỗi cần rõ ràng cho người dùng nhưng không làm lộ thông tin nội bộ của hệ thống.
- Notification có thể thất bại mà không được làm sai nghiệp vụ chính nếu thiết kế cho phép lưu nghiệp vụ trước và xử lý thông báo sau.
- Video có thể fallback sang chat trong phạm vi cốt lõi nếu video không khả dụng, nhưng hệ thống vẫn phải bảo đảm đúng quyền truy cập phiên tư vấn.

**3.3. Đối tượng sử dụng**

#### _3.3.1 Guest User_

Guest User là người dùng chưa đăng nhập vào hệ thống. Nhóm này có thể xem thông tin nền tảng, danh sách chuyên khoa, danh sách bác sĩ và hồ sơ công khai của bác sĩ. Guest User không được đặt lịch tư vấn, gửi câu hỏi sức khỏe hoặc truy cập dữ liệu cá nhân của người dùng khác. Khi thực hiện thao tác cần xác thực, hệ thống cần chuyển người dùng đến màn hình đăng ký hoặc đăng nhập.

#### _3.3.2. Patient_

Patient là bệnh nhân hoặc người dùng đã đăng ký tài khoản để sử dụng dịch vụ tư vấn sức khỏe. Patient có thể quản lý hồ sơ cá nhân, tìm kiếm bác sĩ, gửi câu hỏi sức khỏe, đặt lịch, tham gia phiên tư vấn, xem phản hồi, xem kết quả tư vấn, xem đơn thuốc và đánh giá chất lượng tư vấn. Patient chỉ được truy cập dữ liệu thuộc quyền sở hữu của chính mình.

#### _3.3.3. Doctor_

Doctor là người cung cấp tư vấn chuyên môn trên nền tảng. Doctor có thể quản lý hồ sơ bác sĩ, theo dõi lịch hẹn, phản hồi câu hỏi sức khỏe, tham gia phiên tư vấn trực tuyến, ghi nhận kết quả tư vấn và lập đơn thuốc điện tử cơ bản. Doctor chỉ được truy cập dữ liệu nằm trong phạm vi phụ trách hoặc được hệ thống phân công.

#### _3.3.4. Administrator_

Administrator là người quản trị và vận hành hệ thống. Vai trò này có thể quản lý người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, nội dung tư vấn, đánh giá và dashboard thống kê. Vì Administrator có quyền rộng, hệ thống cần phân quyền rõ ràng và kiểm soát chặt các thao tác nhạy cảm.

#### _3.3.5. Notification Service_

Notification Service là hệ thống bên ngoài hoặc thành phần hỗ trợ gửi thông báo cho người dùng. Dịch vụ này có thể được dùng cho xác nhận lịch hẹn, nhắc lịch tư vấn, thông báo khi có phản hồi câu hỏi hoặc thông báo thay đổi trạng thái. Nếu gửi thông báo thất bại, hệ thống cần ghi nhận trạng thái phù hợp và không làm sai dữ liệu nghiệp vụ chính.

#### _3.3.6. Video Communication Service_

Video Communication Service hỗ trợ phiên tư vấn trực tuyến giữa Patient và Doctor. Trong phạm vi cốt lõi, dịch vụ này có thể được tích hợp cơ bản hoặc mô phỏng, tùy điều kiện triển khai. Khi video không khả dụng, hệ thống có thể fallback sang chat để bảo đảm phiên tư vấn vẫn có kênh trao đổi.

#### _3.3.7. File Storage Service_

File Storage Service hỗ trợ lưu trữ tệp liên quan đến hồ sơ, tài liệu y tế, hình ảnh hoặc tài liệu đính kèm phục vụ tư vấn. Các tệp này có thể chứa thông tin nhạy cảm nên cần được kiểm soát quyền truy cập. Người dùng chỉ được xem hoặc tải tệp trong phạm vi được cấp quyền.

**3.4. Công nghệ hỗ trợ xây dựng phần mềm**

_3.4.1. Frontend_

Frontend sử dụng React 18, TypeScript và Vite để xây dựng giao diện web. React Router v6 được dùng cho điều hướng giữa các khu vực public, auth, patient, doctor và admin. Redux Toolkit và Redux Saga hỗ trợ quản lý trạng thái và xử lý side effect; Axios dùng để giao tiếp API. PrimeReact và Tailwind CSS hỗ trợ xây dựng giao diện; Formik và Yup hỗ trợ form và validation; i18next hỗ trợ đa ngôn ngữ; Recharts hỗ trợ biểu đồ thống kê và dashboard.

_3.4.2. Backend_

Backend là Node.js API service. Báo cáo hiện trình bày backend theo hướng NestJS với TypeScript, tổ chức module theo nghiệp vụ như auth, user profile, specialty, discovery, question, appointment, consultation, prescription, rating, notification, admin và reporting. Prisma ORM được sử dụng để làm việc với cơ sở dữ liệu quan hệ.

_3.4.3. Database_

Cơ sở dữ liệu sử dụng PostgreSQL, phù hợp với các quan hệ nghiệp vụ như người dùng, hồ sơ bệnh nhân, hồ sơ bác sĩ, chuyên khoa, câu hỏi, phản hồi, lịch hẹn, phiên tư vấn, đơn thuốc, đánh giá, thông báo và audit log. Các ràng buộc dữ liệu cần hỗ trợ tính nhất quán của lịch hẹn, quyền sở hữu dữ liệu và trạng thái nghiệp vụ.

_3.4.4. Authentication/Authorization_

Hệ thống sử dụng JWT cho xác thực phiên đăng nhập. Phân quyền được tổ chức theo role-based access control kết hợp ownership để kiểm soát người dùng chỉ được thao tác dữ liệu thuộc phạm vi của mình. Đây là nội dung quan trọng trong kiểm thử bảo mật và kiểm thử phân quyền.

_3.4.5. Realtime/communication_

Phiên tư vấn trực tuyến có thể sử dụng WebSocket/Socket.IO cho trao đổi thời gian thực. Với phạm vi cốt lõi, video communication có thể được tích hợp cơ bản hoặc mô phỏng; khi video không khả dụng, hệ thống có thể chuyển sang chat nếu thiết kế cho phép.

_3.4.6. Testing_

Công cụ kiểm thử chính cho E2E automation là Playwright. Ngoài ra, nhóm có thể sử dụng Postman hoặc công cụ API testing tương đương để kiểm thử endpoint, request/response, validation và phân quyền. Jest có thể được sử dụng cho unit test hoặc integration test ở các thành phần phù hợp.

_3.4.7. Tools_

Các công cụ hỗ trợ phát triển và quản lý gồm Git cho quản lý phiên bản, Docker cho môi trường chạy dịch vụ phụ trợ, Swagger/OpenAPI cho tài liệu API và hỗ trợ kiểm thử API. Các công cụ này giúp quá trình phát triển, kiểm thử và bàn giao hệ thống có tính nhất quán hơn.

# CHƯƠNG II. PHÂN TÍCH & THIẾT KẾ HỆ THỐNG

## 1\. Yêu cầu từ Stakeholder

Trong phạm vi đề tài Online Health Consultation Platform, hệ thống phục vụ bốn nhóm người dùng chính gồm Guest User, Patient, Doctor và Administrator. Ngoài ra, hệ thống còn có các dịch vụ hỗ trợ bên ngoài như Notification Service, Video Communication Service và File Storage Service để phục vụ thông báo, tư vấn trực tuyến và lưu trữ tệp liên quan đến quá trình tư vấn.

Guest User cần truy cập được các thông tin công khai của nền tảng như trang chủ, danh sách chuyên khoa, danh sách bác sĩ và hồ sơ công khai của bác sĩ. Khi Guest User muốn đặt lịch hoặc gửi câu hỏi sức khỏe, hệ thống cần yêu cầu đăng nhập hoặc đăng ký tài khoản.

Patient cần các chức năng phục vụ quá trình nhận tư vấn sức khỏe trực tuyến, bao gồm đăng ký, đăng nhập, quản lý hồ sơ sức khỏe, tìm kiếm bác sĩ, đặt lịch tư vấn, gửi câu hỏi sức khỏe, tham gia phiên tư vấn, xem kết quả tư vấn, xem đơn thuốc, đánh giá chất lượng tư vấn và nhận thông báo.

Doctor cần quản lý hồ sơ chuyên môn, xem câu hỏi sức khỏe, phản hồi câu hỏi, quản lý lịch tư vấn, bắt đầu phiên tư vấn, trao đổi với Patient, ghi nhận kết quả tư vấn và tạo đơn thuốc điện tử cơ bản.

Administrator cần quản lý tài khoản bác sĩ, tài khoản bệnh nhân, chuyên khoa, lịch hẹn, nội dung cần kiểm duyệt và dashboard thống kê. Vì đây là vai trò có quyền cao, các chức năng quản trị cần được kiểm soát bằng xác thực, phân quyền và audit khi cần thiết.

## 1.1. Khảo sát nhu cầu người dùng

Việc khảo sát trong báo cáo được thực hiện theo hướng phân tích nhu cầu của các nhóm người dùng mục tiêu. Kết quả tổng hợp cho thấy người dùng cần một hệ thống có giao diện rõ ràng, dễ thao tác, hỗ trợ tìm kiếm bác sĩ nhanh, đặt lịch thuận tiện, bảo vệ dữ liệu cá nhân và cung cấp thông báo kịp thời.

Đối với Patient, nhu cầu quan trọng nhất là có thể tìm đúng bác sĩ theo chuyên khoa, đặt lịch theo khung giờ phù hợp, gửi câu hỏi sức khỏe và xem lại kết quả tư vấn. Đối với Doctor, hệ thống cần hỗ trợ quản lý lịch, phản hồi câu hỏi, thực hiện tư vấn và ghi nhận kết quả sau phiên tư vấn. Đối với Administrator, hệ thống cần có công cụ quản lý dữ liệu vận hành và theo dõi thống kê hoạt động.

Bên cạnh chức năng, các stakeholder cũng quan tâm đến các tiêu chí chất lượng như bảo mật, quyền riêng tư, phân quyền theo vai trò, kiểm soát dữ liệu sức khỏe, tính dễ sử dụng, khả năng phản hồi khi có lỗi và khả năng truy vết các thao tác nhạy cảm.

## 1.2. User Story

| ID    | User Story                                                                                                    | Actor                     | Ưu tiên    |
| ----- | ------------------------------------------------------------------------------------------------------------- | ------------------------- | ---------- |
| US-01 | Là Guest User, tôi muốn xem trang chủ để hiểu mục đích và chức năng chính của nền tảng.                       | Guest User                | Cao        |
| US-02 | Là Guest User, tôi muốn xem danh sách chuyên khoa để lựa chọn nhóm bác sĩ phù hợp.                            | Guest User                | Cao        |
| US-03 | Là Guest User, tôi muốn tìm kiếm bác sĩ theo chuyên khoa hoặc từ khóa để nhanh chóng tìm được bác sĩ phù hợp. | Guest User                | Cao        |
| US-04 | Là Guest User, tôi muốn xem hồ sơ công khai của bác sĩ để tham khảo chuyên môn trước khi đặt lịch.            | Guest User                | Cao        |
| US-05 | Là Patient, tôi muốn đăng ký và đăng nhập để sử dụng các chức năng tư vấn sức khỏe.                           | Patient                   | Cao        |
| US-06 | Là Patient, tôi muốn quản lý hồ sơ sức khỏe cá nhân để bác sĩ có thêm thông tin khi tư vấn.                   | Patient                   | Cao        |
| US-07 | Là Patient, tôi muốn đặt lịch tư vấn với bác sĩ theo khung giờ còn trống.                                     | Patient                   | Cao        |
| US-08 | Là Patient, tôi muốn gửi câu hỏi sức khỏe để nhận phản hồi chuyên môn từ bác sĩ.                              | Patient                   | Cao        |
| US-09 | Là Patient, tôi muốn tham gia phiên tư vấn trực tuyến và xem kết quả tư vấn sau khi hoàn tất.                 | Patient                   | Cao        |
| US-10 | Là Patient, tôi muốn xem đơn thuốc và đánh giá chất lượng tư vấn sau phiên tư vấn.                            | Patient                   | Trung bình |
| US-11 | Là Doctor, tôi muốn quản lý hồ sơ chuyên môn và lịch tư vấn của mình.                                         | Doctor                    | Cao        |
| US-12 | Là Doctor, tôi muốn xem và phản hồi câu hỏi sức khỏe của bệnh nhân.                                           | Doctor                    | Cao        |
| US-13 | Là Doctor, tôi muốn thực hiện phiên tư vấn, ghi kết quả và tạo đơn thuốc điện tử.                             | Doctor                    | Cao        |
| US-14 | Là Administrator, tôi muốn quản lý tài khoản, chuyên khoa, lịch hẹn và nội dung cần kiểm duyệt.               | Administrator             | Cao        |
| US-15 | Là Administrator, tôi muốn xem dashboard thống kê để theo dõi hoạt động của hệ thống.                         | Administrator             | Cao        |
| US-16 | Là hệ thống, tôi muốn gửi thông báo nhắc lịch và thông báo khi có phản hồi mới.                               | System / External Service | Cao        |
| US-17 | Là hệ thống, tôi muốn hỗ trợ video/chat và lưu trữ tệp liên quan đến quá trình tư vấn.                        | System / External Service | Trung bình |

## 1.3. Thiết kế Wireframe & Prototype

Trong phạm vi giữa kỳ, phần wireframe/prototype được xác định ở mức định hướng giao diện cho các nhóm chức năng chính. Các màn hình cần được thiết kế hoặc bổ sung minh chứng gồm:

- Trang chủ public.
- Danh sách chuyên khoa.
- Danh sách bác sĩ và tìm kiếm bác sĩ.
- Chi tiết hồ sơ bác sĩ.
- Đăng ký / đăng nhập.
- Hồ sơ bệnh nhân.
- Đặt lịch tư vấn.
- Gửi câu hỏi sức khỏe.
- Lịch hẹn của bệnh nhân.
- Lịch tư vấn của bác sĩ.
- Phiên tư vấn chat/video.
- Kết quả tư vấn và đơn thuốc.
- Dashboard quản trị.

## 2\. Phân tích hệ thống

Phần này trình bày các usecase chính của hệ thống theo cách tương tự báo cáo mẫu: mỗi usecase có mục tiêu, actor, tiền điều kiện, luồng sự kiện chính, luồng phụ, hậu điều kiện và biểu đồ hoạt động tương ứng. Báo cáo giữa kỳ không đi vào toàn bộ chi tiết kiểm thử, mà tập trung làm rõ cách phân tích và thiết kế cho các chức năng chính.

### Usecase tổng quan toàn hệ thống

TODO: Hình A diagram of a diagram

Description automatically generated

Hình 2 - Use case tổng quan toàn hệ thống

- **Mục tiêu:** Mô tả tổng quan các nhóm chức năng chính của hệ thống và mối quan hệ giữa các actor với nền tảng tư vấn sức khỏe trực tuyến.
- **Actor:** Guest User, Patient, Doctor, Administrator.
- **Actor phụ / hệ thống bên ngoài:** Notification Service, Video Communication Service, File Storage Service.
- **Mô tả:** Guest User có thể tra cứu thông tin công khai về chuyên khoa và bác sĩ. Patient có thể đăng ký, đăng nhập, quản lý hồ sơ sức khỏe, đặt lịch tư vấn, gửi câu hỏi, tham gia phiên tư vấn, xem kết quả, xem đơn thuốc, đánh giá và nhận thông báo. Doctor có thể quản lý hồ sơ, xem và phản hồi câu hỏi, quản lý lịch, tư vấn trực tuyến, ghi kết quả và cấp đơn thuốc. Administrator có thể quản lý người dùng, chuyên khoa, lịch hẹn, nội dung cần kiểm duyệt và dashboard thống kê.
- **Phạm vi:** Usecase tổng quan chỉ thể hiện các nhóm chức năng chính ở mức hệ thống. Các usecase chi tiết theo từng nhóm actor được trình bày ở các mục tiếp theo.

### Usecase Guest tra cứu bác sĩ - UC01

TODO: Hình A diagram of a user

Description automatically generated

Hình 3 - Use case Guest User

- **Mục tiêu:** Cho phép Guest User truy cập thông tin công khai của hệ thống, xem chuyên khoa, tìm kiếm bác sĩ, xem hồ sơ công khai của bác sĩ và được chuyển đến đăng nhập/đăng ký khi muốn sử dụng chức năng yêu cầu xác thực.
- **Actor:** Guest User.
- **Tiền điều kiện:**
- Hệ thống đã có dữ liệu chuyên khoa và bác sĩ được công khai.
- Guest User truy cập hệ thống khi chưa đăng nhập.
- Chỉ các bác sĩ đang hoạt động và được phép hiển thị công khai mới xuất hiện trong kết quả tra cứu.
- **Luồng sự kiện chính:**
  - Guest User truy cập trang chủ của hệ thống.
  - Hệ thống hiển thị thông tin giới thiệu nền tảng và các chức năng công khai.
  - Guest User xem danh sách chuyên khoa hoặc danh sách bác sĩ.
  - Guest User tìm kiếm bác sĩ theo chuyên khoa hoặc từ khóa.
  - Hệ thống hiển thị danh sách bác sĩ phù hợp.
  - Guest User chọn một bác sĩ để xem hồ sơ công khai.
  - Khi Guest User chọn đặt lịch hoặc gửi câu hỏi, hệ thống chuyển đến trang đăng nhập hoặc đăng ký.
- **Luồng phụ:**
  - Nếu không có bác sĩ phù hợp, hệ thống hiển thị thông báo không tìm thấy kết quả.
  - Nếu bác sĩ chưa được duyệt hoặc không còn hoạt động, hệ thống không hiển thị bác sĩ đó ở khu vực công khai.
  - Nếu Guest User chỉ xem thông tin công khai, hệ thống không yêu cầu đăng nhập.
- **Hậu điều kiện:**
  - Guest User xem được dữ liệu công khai hợp lệ.
  - Các thao tác yêu cầu xác thực được chuyển hướng đến trang đăng nhập hoặc đăng ký.
  - Dữ liệu riêng tư và dữ liệu sức khỏe không bị hiển thị cho Guest User.
- **Biểu đồ hoạt động:**

TODO: Hình 

Hình 7 - Biểu đồ hoạt động Guest tra cứu bác sĩ

### 2.3. Usecase đăng ký / đăng nhập / phân quyền - UC02

- **Mục tiêu:** Cho phép người dùng đăng ký tài khoản, đăng nhập, đăng xuất và được điều hướng đến khu vực chức năng phù hợp theo vai trò.
- **Actor:** Guest User, Patient, Doctor, Administrator.
- **Tiền điều kiện:**
  - Hệ thống có chức năng đăng ký và đăng nhập.
  - Doctor và Administrator có tài khoản hợp lệ theo quy trình quản trị.
  - Các chức năng được bảo vệ áp dụng xác thực và phân quyền theo vai trò.
- **Luồng sự kiện chính:**
  - Guest User chọn đăng ký tài khoản Patient.
  - Hệ thống hiển thị form đăng ký.
  - Guest User nhập thông tin đăng ký.
  - Hệ thống kiểm tra dữ liệu và tạo tài khoản Patient nếu hợp lệ.
  - Người dùng đăng nhập bằng email và mật khẩu.
  - Hệ thống xác thực thông tin đăng nhập.
  - Hệ thống xác định vai trò của người dùng.
  - Người dùng được chuyển đến khu vực phù hợp theo vai trò.
  - Người dùng chọn đăng xuất để kết thúc phiên làm việc.
- **Luồng phụ:**
  - Nếu thông tin đăng ký thiếu hoặc sai định dạng, hệ thống hiển thị lỗi validation.
  - Nếu email đã tồn tại, hệ thống yêu cầu sử dụng email khác.
  - Nếu thông tin đăng nhập sai, hệ thống từ chối đăng nhập.
  - Nếu người dùng truy cập chức năng ngoài quyền, hệ thống từ chối truy cập.
  - Nếu phiên đăng nhập hết hạn, hệ thống yêu cầu đăng nhập lại.
- **Hậu điều kiện:**
  - Tài khoản Patient được tạo khi đăng ký thành công.
  - Người dùng đăng nhập thành công được phân quyền đúng vai trò.
  - Người dùng chỉ truy cập được các chức năng phù hợp với quyền của mình.
  - Phiên làm việc được kết thúc khi đăng xuất.
- **Biểu đồ hoạt động:**  
   TODO: Hình A diagram of a patient

  Description automatically generated

Hình 8 - Biểu đồ hoạt động đăng ký / đăng nhập / phân quyền

### Usecase Patient đặt lịch tư vấn - UC03

TODO: Hình 

Hình 4 - Use case Patient

- **Mục tiêu:** Cho phép Patient tìm kiếm bác sĩ, xem hồ sơ bác sĩ, chọn thời gian tư vấn, đặt lịch hẹn và nhận thông báo xác nhận hoặc nhắc lịch.
- **Actor:** Patient.
- **Actor phụ:** Doctor, Notification Service.
- **Tiền điều kiện:**
  - Patient đã đăng nhập.
  - Hệ thống có danh sách bác sĩ đang hoạt động.
  - Bác sĩ được chọn có lịch tư vấn khả dụng.
  - Khung giờ được chọn chưa bị trùng lịch.
- **Luồng sự kiện chính:**
  - Patient đăng nhập vào hệ thống.
  - Patient tìm kiếm bác sĩ theo chuyên khoa hoặc từ khóa.
  - Patient xem chi tiết hồ sơ bác sĩ.
  - Patient chọn ngày và khung giờ tư vấn còn khả dụng.
  - Patient nhập lý do tư vấn và thông tin cần thiết.
  - Hệ thống kiểm tra dữ liệu đặt lịch.
  - Hệ thống kiểm tra tính khả dụng của khung giờ.
  - Hệ thống tạo lịch hẹn với trạng thái phù hợp.
  - Patient xem danh sách lịch hẹn sắp tới.
  - Hệ thống gửi thông báo xác nhận hoặc nhắc lịch nếu được cấu hình.
- **Luồng phụ:**
  - Nếu khung giờ đã được đặt, hệ thống yêu cầu Patient chọn khung giờ khác.
  - Nếu dữ liệu đặt lịch thiếu hoặc sai định dạng, hệ thống hiển thị lỗi validation.
  - Nếu bác sĩ không còn hoạt động, hệ thống không cho phép đặt lịch.
  - Nếu gửi thông báo thất bại, hệ thống ghi nhận trạng thái lỗi nhưng không làm sai dữ liệu lịch hẹn.
- **Hậu điều kiện:**
  - Lịch hẹn được tạo đúng Patient và Doctor.
  - Patient có thể theo dõi lịch hẹn của mình.
  - Không phát sinh lịch hẹn trùng khung giờ.
  - Thông báo lịch hẹn được gửi hoặc ghi nhận trạng thái xử lý.
- **Biểu đồ hoạt động:**

TODO: Hình A diagram of a flowchart

Description automatically generated

Hình 9 - Biểu đồ hoạt động Patient đặt lịch tư vấn

### 2.5. Usecase Patient gửi câu hỏi và Doctor phản hồi - UC04

- **Mục tiêu:** Cho phép Patient gửi câu hỏi sức khỏe, Doctor xem và phản hồi câu hỏi, hệ thống cập nhật trạng thái và thông báo cho Patient khi có phản hồi.
- **Actor:** Patient, Doctor.
- **Actor phụ:** Administrator, Notification Service.
- **Tiền điều kiện:**
  - Patient đã đăng nhập để gửi câu hỏi.
  - Doctor đã đăng nhập để xem và phản hồi câu hỏi.
  - Câu hỏi có trạng thái cho phép phản hồi.
  - Người dùng chỉ được truy cập dữ liệu thuộc phạm vi quyền của mình.
- **Luồng sự kiện chính:**
  - Patient mở chức năng gửi câu hỏi sức khỏe.
  - Patient nhập tiêu đề và nội dung câu hỏi.
  - Hệ thống kiểm tra dữ liệu câu hỏi.
  - Hệ thống lưu câu hỏi với trạng thái chờ xử lý.
  - Doctor xem danh sách câu hỏi được phân công hoặc có thể xử lý.
  - Doctor mở chi tiết câu hỏi.
  - Doctor nhập nội dung phản hồi.
  - Hệ thống lưu phản hồi của Doctor.
  - Hệ thống cập nhật trạng thái câu hỏi.
  - Hệ thống gửi thông báo cho Patient.
  - Patient xem phản hồi của bác sĩ.
- **Luồng phụ:**
  - Nếu Guest User gửi câu hỏi, hệ thống yêu cầu đăng nhập.
  - Nếu nội dung câu hỏi hoặc phản hồi rỗng, hệ thống hiển thị lỗi validation.
  - Nếu Doctor không có quyền xử lý câu hỏi, hệ thống từ chối truy cập.
  - Nếu câu hỏi đã đóng, hệ thống có thể không cho phép phản hồi thêm.
  - Nếu nội dung cần kiểm duyệt, Administrator có thể xử lý theo quyền.
- **Hậu điều kiện:**
  - Câu hỏi và phản hồi được lưu đúng trạng thái.
  - Patient xem được phản hồi thuộc về mình.
  - Doctor chỉ xử lý câu hỏi trong phạm vi được phép.
  - Nội dung sức khỏe được bảo vệ theo quyền truy cập.
- **Biểu đồ hoạt động:**

TODO: Hình 

Hình 10 - Biểu đồ hoạt động Patient gửi câu hỏi và Doctor phản hồi

### 2.6. Usecase Doctor tư vấn, ghi kết quả và đơn thuốc - UC05

TODO: Hình A diagram of a diagram

Description automatically generated

Hình 5 - Use case Doctor

- **Mục tiêu:** Cho phép Doctor bắt đầu phiên tư vấn, trao đổi với Patient qua chat hoặc video, ghi nhận kết quả tư vấn và tạo đơn thuốc điện tử cơ bản.
- **Actor:** Doctor, Patient.
- **Actor phụ:** Video Communication Service, File Storage Service.
- **Tiền điều kiện:**
  - Doctor và Patient đã đăng nhập.
  - Lịch hẹn hợp lệ và ở trạng thái cho phép tư vấn.
  - Doctor là người phụ trách lịch hẹn.
  - Patient là người thuộc lịch hẹn tương ứng.
- **Luồng sự kiện chính:**
  - Doctor mở lịch hẹn cần tư vấn.
  - Doctor bắt đầu phiên tư vấn.
  - Hệ thống kiểm tra trạng thái lịch hẹn và quyền của Doctor.
  - Patient tham gia phiên tư vấn theo lịch hẹn của mình.
  - Hệ thống kiểm tra quyền của Patient.
  - Doctor và Patient trao đổi qua chat hoặc video.
  - Doctor ghi nhận kết quả tư vấn.
  - Doctor tạo đơn thuốc điện tử nếu cần.
  - Hệ thống lưu kết quả tư vấn và đơn thuốc.
  - Patient xem tóm tắt tư vấn và đơn thuốc sau phiên tư vấn.
- **Luồng phụ:**
  - Nếu người tham gia không thuộc lịch hẹn, hệ thống từ chối truy cập phiên tư vấn.
  - Nếu lịch hẹn chưa đến thời gian cho phép, hệ thống không cho bắt đầu phiên tư vấn.
  - Nếu video không khả dụng, hệ thống có thể fallback sang chat.
  - Nếu thông tin kết quả tư vấn hoặc đơn thuốc thiếu dữ liệu bắt buộc, hệ thống hiển thị lỗi validation.
- **Hậu điều kiện:**
  - Phiên tư vấn được gắn với đúng lịch hẹn.
  - Kết quả tư vấn và đơn thuốc được lưu đúng phạm vi dữ liệu.
  - Patient có thể xem kết quả tư vấn và đơn thuốc của mình.
  - Doctor chỉ thao tác trên lịch hẹn thuộc phạm vi phụ trách.
- **Biểu đồ hoạt động:**

TODO: Hình 

Hình 11 - Biểu đồ hoạt động Doctor tư vấn, ghi kết quả và đơn thuốc

### 2.7. Usecase Administrator quản lý hệ thống và dashboard - UC06

TODO: Hình A diagram of a person with text

Description automatically generated

Hình 6 - Use case Administrator

- **Mục tiêu:** Cho phép Administrator quản lý tài khoản, chuyên khoa, lịch hẹn, kiểm duyệt nội dung và theo dõi hoạt động hệ thống thông qua dashboard/reporting.
- **Actor:** Administrator.
- **Tiền điều kiện:**
  - Administrator có tài khoản hợp lệ.
  - Administrator đã đăng nhập thành công.
  - Các chức năng quản trị được bảo vệ bằng phân quyền.
- **Luồng sự kiện chính:**
  - Administrator đăng nhập vào khu vực quản trị.
  - Administrator quản lý tài khoản bác sĩ.
  - Administrator quản lý tài khoản bệnh nhân.
  - Administrator quản lý danh mục chuyên khoa.
  - Administrator theo dõi và quản lý lịch hẹn.
  - Administrator kiểm duyệt nội dung tư vấn, phản hồi hoặc đánh giá khi cần.
  - Administrator xem dashboard thống kê hệ thống.
  - Administrator theo dõi người dùng đang hoạt động và số lượng phiên tư vấn.
- **Luồng phụ:**
  - Nếu người dùng không có quyền Administrator, hệ thống từ chối truy cập.
  - Nếu dữ liệu quản trị không hợp lệ, hệ thống hiển thị lỗi validation.
  - Nếu dashboard không có dữ liệu, hệ thống hiển thị trạng thái rỗng.
  - Các thao tác quản trị nhạy cảm cần được ghi nhận để phục vụ audit.
- **Hậu điều kiện:**
  - Dữ liệu quản trị được cập nhật đúng quyền.
  - Nội dung cần kiểm duyệt được xử lý theo quy trình.
  - Dashboard phản ánh dữ liệu thống kê phục vụ vận hành hệ thống.
  - Các thao tác quản trị có thể được truy vết khi cần.
- **Biểu đồ hoạt động:**

TODO: Hình A diagram of a company

Description automatically generated

Hình 12 - Biểu đồ hoạt động Administrator quản lý hệ thống và dashboard

## 3\. Định nghĩa các yêu cầu chất lượng phần mềm

### 3.1. Mục tiêu

Việc định nghĩa yêu cầu chất lượng phần mềm nhằm bảo đảm nền tảng tư vấn sức khỏe trực tuyến hoạt động đúng theo tài liệu yêu cầu, an toàn, bảo mật, dễ sử dụng và có thể kiểm thử. Các yêu cầu chất lượng được xác định từ góc nhìn nghiệp vụ, vận hành và phát triển để làm cơ sở thiết kế test case ở Chương III.

Do hệ thống xử lý dữ liệu sức khỏe, hồ sơ cá nhân, lịch hẹn, phiên tư vấn và đơn thuốc, báo cáo đặc biệt chú trọng các yêu cầu về bảo mật, quyền riêng tư, phân quyền theo vai trò, quyền sở hữu dữ liệu, kiểm soát trạng thái lịch hẹn và tính đúng đắn của phiên tư vấn trực tuyến. Những yêu cầu này cần được mô tả theo hướng có thể kiểm thử, có điều kiện đầu vào rõ ràng và có expected result cụ thể.

### 3.2. Yêu cầu từ môi trường nghiệp vụ

| Usecase                                       | Req-ID | Nội dung yêu cầu                                                                                                                          | Stakeholder                    |
| --------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| UC01 - Guest tra cứu bác sĩ                   | F01.1  | Hệ thống cho phép Guest User xem trang chủ, danh sách chuyên khoa, danh sách bác sĩ và hồ sơ công khai của bác sĩ mà không cần đăng nhập. | Guest User                     |
| UC01 - Guest tra cứu bác sĩ                   | F01.2  | Hệ thống chỉ hiển thị bác sĩ đang hoạt động và đủ điều kiện công khai.                                                                    | Guest User, Patient            |
| UC01 - Guest tra cứu bác sĩ                   | F01.3  | Khi Guest User chọn đặt lịch hoặc gửi câu hỏi, hệ thống phải chuyển đến đăng nhập/đăng ký.                                                | Guest User                     |
| UC02 - Đăng ký / đăng nhập / phân quyền       | F02.1  | Hệ thống cho phép Patient đăng ký tài khoản bằng thông tin hợp lệ.                                                                        | Patient                        |
| UC02 - Đăng ký / đăng nhập / phân quyền       | F02.2  | Hệ thống xác thực người dùng và điều hướng đúng khu vực theo vai trò.                                                                     | Patient, Doctor, Administrator |
| UC02 - Đăng ký / đăng nhập / phân quyền       | F02.3  | Hệ thống từ chối truy cập khi người dùng không có quyền thực hiện chức năng.                                                              | Tất cả actor                   |
| UC03 - Patient đặt lịch tư vấn                | F03.1  | Patient có thể chọn bác sĩ, khung giờ và tạo lịch hẹn khi dữ liệu hợp lệ.                                                                 | Patient                        |
| UC03 - Patient đặt lịch tư vấn                | F03.2  | Hệ thống không cho phép đặt lịch trùng hoặc chồng lấn khung giờ.                                                                          | Patient, Doctor                |
| UC03 - Patient đặt lịch tư vấn                | F03.3  | Hệ thống gửi hoặc ghi nhận thông báo xác nhận/nhắc lịch nếu notification được cấu hình.                                                   | Patient, Doctor                |
| UC04 - Patient gửi câu hỏi và Doctor phản hồi | F04.1  | Patient đã đăng nhập được gửi câu hỏi sức khỏe với dữ liệu hợp lệ.                                                                        | Patient                        |
| UC04 - Patient gửi câu hỏi và Doctor phản hồi | F04.2  | Doctor chỉ xem và phản hồi câu hỏi thuộc phạm vi xử lý.                                                                                   | Doctor                         |
| UC04 - Patient gửi câu hỏi và Doctor phản hồi | F04.3  | Patient chỉ xem được câu hỏi và phản hồi của chính mình.                                                                                  | Patient                        |
| UC05 - Doctor tư vấn và đơn thuốc             | F05.1  | Chỉ Patient và Doctor thuộc lịch hẹn hợp lệ mới được tham gia phiên tư vấn.                                                               | Patient, Doctor                |
| UC05 - Doctor tư vấn và đơn thuốc             | F05.2  | Doctor được ghi kết quả tư vấn và tạo đơn thuốc điện tử cơ bản sau phiên tư vấn.                                                          | Doctor                         |
| UC05 - Doctor tư vấn và đơn thuốc             | F05.3  | Patient chỉ xem được kết quả tư vấn và đơn thuốc của chính mình.                                                                          | Patient                        |
| UC06 - Administrator quản lý hệ thống         | F06.1  | Administrator quản lý tài khoản, chuyên khoa, lịch hẹn và nội dung cần kiểm duyệt theo quyền.                                             | Administrator                  |
| UC06 - Administrator quản lý hệ thống         | F06.2  | Dashboard hiển thị số liệu thống kê phục vụ theo dõi hoạt động hệ thống.                                                                  | Administrator                  |
| UC06 - Administrator quản lý hệ thống         | F06.3  | Các thao tác quản trị nhạy cảm cần có cơ sở ghi nhận audit khi hệ thống hỗ trợ.                                                           | Administrator, Operator        |

### 3.3. Yêu cầu từ môi trường vận hành

- **Bảo mật:** Các chức năng được bảo vệ phải yêu cầu xác thực hợp lệ. Hệ thống không được trả về mật khẩu, token bí mật hoặc thông tin xác thực nhạy cảm trong response.
- **Quyền riêng tư dữ liệu sức khỏe:** Hồ sơ sức khỏe, câu hỏi, phản hồi, lịch sử tư vấn, kết quả tư vấn và đơn thuốc chỉ được hiển thị cho đúng người có quyền.
- **Phân quyền và ownership:** Guest chỉ xem dữ liệu public; Patient chỉ thao tác dữ liệu của chính mình; Doctor chỉ thao tác dữ liệu được phân công/phụ trách; Administrator thao tác theo quyền quản trị.
- **Validation dữ liệu đầu vào:** Các form/API đăng ký, đăng nhập, hồ sơ, câu hỏi, đặt lịch, kết quả tư vấn, đơn thuốc và đánh giá phải kiểm tra dữ liệu bắt buộc, định dạng và trạng thái nghiệp vụ.
- **Xử lý lỗi nhất quán:** Lỗi validation, xác thực, phân quyền, không tìm thấy dữ liệu, trùng lịch và lỗi dịch vụ ngoài cần có thông báo rõ ràng, không làm lộ chi tiết nội bộ nhạy cảm.
- **Tính sẵn sàng của luồng chính:** Hệ thống cần duy trì các luồng đăng nhập, đặt lịch, gửi câu hỏi và tham gia tư vấn ở trạng thái ổn định trong điều kiện vận hành thông thường.
- **Fallback chat/video:** Nếu video không khả dụng trong phiên tư vấn, hệ thống có thể chuyển sang chat để bảo đảm người dùng vẫn có kênh trao đổi.
- **Logging/audit:** Hệ thống cần có log phục vụ vận hành và audit cho các thao tác nhạy cảm như quản trị, truy cập dữ liệu sức khỏe, cập nhật kết quả tư vấn hoặc đơn thuốc.
- **Backup dữ liệu:** Dữ liệu nghiệp vụ quan trọng như tài khoản, hồ sơ, lịch hẹn, kết quả tư vấn và đơn thuốc cần có phương án sao lưu theo môi trường triển khai.
- **Responsive usability:** Giao diện cần dễ sử dụng trên desktop và mobile, đặc biệt với các luồng public discovery, đặt lịch, gửi câu hỏi, tư vấn trực tuyến và dashboard quản trị.

### 3.4. Yêu cầu từ môi trường phát triển

- **Frontend React module hóa:** Frontend cần tổ chức theo module hoặc feature như auth, patient, doctor, admin, discovery, appointment, question và consultation để dễ bảo trì và kiểm thử.
- **Backend Node.js/NestJS:** Backend tổ chức theo modular monolith, chia module nghiệp vụ rõ ràng như identity, profile, specialty, question, appointment, consultation, prescription, rating, notification, admin và reporting.
- **REST API rõ ràng:** API cần có endpoint, phương thức, request body, response và mã lỗi rõ ràng, hỗ trợ traceability từ usecase đến test case.
- **Database quan hệ:** Database cần thể hiện được các quan hệ chính giữa user, profile, specialty, question, appointment, consultation, prescription, rating, notification, audit và file attachment.
- **Cấu hình môi trường:** Các thông tin như database URL, JWT secret, email/SMS configuration, video configuration và file storage configuration phải được quản lý bằng biến môi trường hoặc cơ chế cấu hình an toàn.
- **Testability:** Thiết kế cần cho phép kiểm thử unit, integration, API và E2E; các nghiệp vụ quan trọng phải có input/output và rule đủ rõ để tạo test case.
- **Automation readiness:** Giao diện và API cần có định danh ổn định, dữ liệu seed phù hợp và môi trường test tách biệt để hỗ trợ kiểm thử tự động ở giai đoạn sau.
- **CI/CD readiness:** Dự án cần sẵn sàng cho quy trình build, lint, type-check, test và triển khai thông qua pipeline khi áp dụng.
- **Maintainability:** Code cần tuân thủ quy ước đặt tên, tách trách nhiệm rõ ràng, hạn chế trùng lặp, có validation ở biên hệ thống và xử lý lỗi thống nhất.

### 3.5. Mapping yêu cầu chất lượng và kỹ thuật kiểm thử

| Yêu cầu chất lượng          | Kỹ thuật kiểm thử phù hợp | Ví dụ kiểm thử                                                               |
| --------------------------- | ------------------------- | ---------------------------------------------------------------------------- |
| Public access               | Black-box / UI test       | Guest xem danh sách bác sĩ public không cần đăng nhập.                       |
| Doctor public visibility    | Black-box / API test      | Bác sĩ inactive hoặc chưa được duyệt không xuất hiện trong danh sách public. |
| Authentication              | Equivalence Partitioning  | Đăng nhập với email/mật khẩu hợp lệ và không hợp lệ.                         |
| Authorization               | Decision Table            | Patient không xem được dữ liệu của Patient khác.                             |
| Role-based redirect         | E2E / manual test         | Patient, Doctor, Administrator đăng nhập và được chuyển đúng khu vực.        |
| Appointment conflict        | Decision Table            | Đặt lịch trùng slot bác sĩ bị từ chối.                                       |
| Appointment validation      | Equivalence Partitioning  | Thiếu doctor, scheduledAt hoặc reason thì hệ thống trả lỗi validation.       |
| Health question access      | Security / negative test  | Doctor không xem được câu hỏi ngoài phạm vi xử lý.                           |
| Consultation session access | Security / negative test  | Người không thuộc appointment không join được session.                       |
| Prescription privacy        | Security / negative test  | Patient chỉ xem được đơn thuốc của chính mình.                               |
| Rating rule                 | Decision Table            | Patient chỉ đánh giá sau khi tư vấn hoàn tất.                                |
| Notification failure        | Integration test          | Lỗi notification không làm sai trạng thái lịch hẹn hoặc câu hỏi.             |
| Error handling              | Black-box / API test      | Unauthorized, forbidden, validation error và conflict có response nhất quán. |
| UI responsive               | Manual / E2E test         | Kiểm tra luồng tìm bác sĩ, đặt lịch và dashboard trên desktop/mobile.        |

## 4\. Thiết kế hệ thống

### 4.1. Kiến trúc hệ thống

Hệ thống được thiết kế theo mô hình Client-Server Architecture. Phía client là ReactJS Web Application, hỗ trợ truy cập qua web browser và mobile browser. Phía server là NestJS Backend được tổ chức theo kiến trúc Modular Monolith, trong đó các chức năng nghiệp vụ được chia thành nhiều module theo từng miền chức năng nhưng vẫn được triển khai trong cùng một backend application.

Kiến trúc này giúp hệ thống giữ được cấu trúc rõ ràng, dễ phát triển, dễ kiểm thử và dễ vận hành. Backend bao gồm các module nghiệp vụ như Identity, User Profile, Specialty, Discovery, Question, Appointment, Consultation, Prescription, Rating, Notification, Admin và Reporting. Các thành phần dùng chung như Authentication, Authorization, RBAC, Ownership Check, Validation, Logging, Audit và Exception Handling được áp dụng xuyên suốt để bảo đảm tính nhất quán và an toàn.

ReactJS Web Application giao tiếp với NestJS Backend thông qua REST API/HTTPS. Đối với các chức năng cần trao đổi thời gian thực như phiên tư vấn hoặc chat, hệ thống có thể sử dụng WebSocket/Socket.IO. Dữ liệu chính được lưu trữ trong PostgreSQL và được backend truy cập thông qua Prisma ORM.

Ngoài các thành phần chính, hệ thống tích hợp với một số dịch vụ bên ngoài thông qua adapter, gồm Notification Service để gửi email/SMS, Video Communication Service để hỗ trợ tư vấn video hoặc video mock, và File Storage Service để lưu trữ tệp đính kèm.

TODO: Hình A diagram of a software system

Description automatically generated

Hình 13 - Kiến trúc hệ thống

### 4.2. Form/API dùng cho Usecase

| Mã         | Usecase sử dụng                               | Form / API chính                                                                          | Actor                                      | Xử lý chính                                                                                                        |
| ---------- | --------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| FO/API-001 | UC01 - Guest tra cứu bác sĩ                   | Trang chủ, danh sách chuyên khoa, danh sách bác sĩ, chi tiết bác sĩ; Public API           | Guest User, Patient                        | Hiển thị dữ liệu public, tìm kiếm bác sĩ, xem hồ sơ công khai và chuyển hướng đăng nhập khi thao tác cần xác thực. |
| FO/API-002 | UC02 - Đăng ký / đăng nhập / phân quyền       | Form đăng ký, form đăng nhập, Auth API                                                    | Guest User, Patient, Doctor, Administrator | Kiểm tra thông tin đăng ký/đăng nhập, xác thực người dùng, xác định role và điều hướng đến khu vực phù hợp.        |
| FO/API-003 | UC03 - Patient đặt lịch tư vấn                | Form đặt lịch, danh sách lịch hẹn, Appointment API                                        | Patient, Doctor                            | Patient chọn bác sĩ, thời gian, nhập lý do tư vấn; hệ thống kiểm tra slot và tạo lịch hẹn.                         |
| FO/API-004 | UC04 - Patient gửi câu hỏi và Doctor phản hồi | Form gửi câu hỏi, màn hình phản hồi câu hỏi, Question API                                 | Patient, Doctor                            | Patient gửi câu hỏi; Doctor xem và phản hồi; hệ thống cập nhật trạng thái và gửi thông báo.                        |
| FO/API-005 | UC05 - Doctor tư vấn và đơn thuốc             | Màn hình phiên tư vấn, form kết quả tư vấn, form đơn thuốc, Consultation/Prescription API | Doctor, Patient                            | Doctor bắt đầu phiên tư vấn, trao đổi với Patient, ghi kết quả và tạo đơn thuốc; Patient xem lại kết quả.          |
| FO/API-006 | UC06 - Administrator quản lý hệ thống         | Admin dashboard, user/specialty/appointment/content management API                        | Administrator                              | Admin quản lý tài khoản, chuyên khoa, lịch hẹn, kiểm duyệt nội dung và xem dashboard thống kê.                     |

### 4.3. Cơ sở dữ liệu

Cơ sở dữ liệu của hệ thống sử dụng **PostgreSQL**, được truy cập thông qua **Prisma ORM**. Thiết kế dữ liệu tập trung vào các nhóm nghiệp vụ chính gồm người dùng, hồ sơ bệnh nhân/bác sĩ, chuyên khoa, câu hỏi sức khỏe, phản hồi, lịch hẹn, phiên tư vấn, tin nhắn, đơn thuốc, đánh giá, thông báo, audit, outbox event và file attachment.

TODO: Hình A screenshot of a computer

Description automatically generated

Hình 14 - ERD / Database diagram

#### _4.3.1. Nhóm bảng chính_

- **Identity & Security:** users, user_sessions, password_reset_tokens, audit_logs.
- **Profile & Specialty:** patient_profiles, doctor_profiles, specialties, doctor_specialties.
- **Question & Answer:** questions, answers, question_moderations.
- **Appointment & Consultation:** appointments, consultation_sessions, consultation_messages.
- **Prescription:** prescriptions, prescription_items.
- **Rating / Notification / Outbox / File:** ratings, notification_logs, outbox_events, file_attachments.

#### _4.3.2. Từ điển cơ sở dữ liệu rút gọn_

| Bảng                  | Field chính                                                                                      | Mô tả                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| users                 | id, email, passwordHash, firstName, lastName, role, isActive, deletedAt, createdAt, updatedAt    | Lưu tài khoản người dùng và vai trò PATIENT, DOCTOR, ADMIN.         |
| user_sessions         | id, userId, refreshTokenHash, expiresAt, revokedAt, rotatedAt, lastUsedAt                        | Lưu phiên đăng nhập và refresh token phục vụ xác thực.              |
| password_reset_tokens | id, userId, tokenHash, expiresAt, usedAt, createdAt                                              | Lưu token khôi phục mật khẩu.                                       |
| audit_logs            | id, actorUserId, action, resource, resourceId, ipAddress, userAgent, metadata, createdAt         | Ghi nhận hành động nhạy cảm để phục vụ truy vết.                    |
| patient_profiles      | id, userId, dateOfBirth, gender, phone, address, medicalHistory                                  | Lưu hồ sơ bệnh nhân và thông tin sức khỏe cơ bản.                   |
| doctor_profiles       | id, userId, bio, yearsOfExperience, approvalStatus, isActive, schedule, scheduleUpdatedAt        | Lưu hồ sơ chuyên môn, trạng thái duyệt và lịch làm việc của bác sĩ. |
| specialties           | id, nameEn, nameVi, description, isActive                                                        | Lưu danh mục chuyên khoa.                                           |
| doctor_specialties    | id, doctorId, specialtyId, createdAt                                                             | Bảng liên kết nhiều-nhiều giữa bác sĩ và chuyên khoa.               |
| questions             | id, patientId, doctorId, title, content, status, createdAt, updatedAt                            | Lưu câu hỏi sức khỏe do Patient gửi.                                |
| answers               | id, questionId, doctorId, content, isApproved, createdAt, updatedAt                              | Lưu phản hồi của Doctor đối với câu hỏi.                            |
| question_moderations  | id, questionId, adminUserId, action, reason, createdAt                                           | Lưu thông tin kiểm duyệt nội dung câu hỏi.                          |
| appointments          | id, patientId, doctorId, scheduledAt, durationMinutes, status, reason, notes                     | Lưu lịch hẹn giữa Patient và Doctor.                                |
| consultation_sessions | id, appointmentId, status, startedAt, endedAt, summary, channel                                  | Lưu thông tin phiên tư vấn gắn với một appointment.                 |
| consultation_messages | id, consultationSessionId, senderUserId, content, messageType, createdAt                         | Lưu tin nhắn trong phiên tư vấn.                                    |
| prescriptions         | id, sessionId, notes, createdAt, updatedAt                                                       | Lưu đơn thuốc gắn với phiên tư vấn.                                 |
| prescription_items    | id, prescriptionId, medicationName, dosage, frequency, duration, notes                           | Lưu từng dòng thuốc trong đơn thuốc.                                |
| ratings               | id, patientId, doctorId, appointmentId, score, comment, status                                   | Lưu đánh giá của Patient sau buổi tư vấn.                           |
| notification_logs     | id, userId, type, content, externalRef, status, provider, errorCode, errorMsg                    | Lưu lịch sử gửi thông báo email/SMS và trạng thái gửi.              |
| outbox_events         | id, aggregateType, aggregateId, eventType, payload, status, retryCount, nextRetryAt              | Lưu sự kiện bất đồng bộ và trạng thái xử lý/retry.                  |
| file_attachments      | id, ownerType, ownerId, consultationSessionId, storageKey, mimeType, sizeBytes, uploadedByUserId | Lưu metadata tệp tải lên và liên kết nghiệp vụ.                     |

#### _4.3.3. Quan hệ dữ liệu chính_

- users liên kết 1-1 với patient_profiles hoặc doctor_profiles tùy vai trò.
- doctor_profiles liên kết nhiều-nhiều với specialties thông qua doctor_specialties.
- patient_profiles có nhiều questions, appointments và ratings.
- doctor_profiles có nhiều questions, answers, appointments và ratings.
- appointments liên kết 1-1 với consultation_sessions.
- consultation_sessions có nhiều consultation_messages và có thể có một prescriptions.
- prescriptions có nhiều prescription_items.
- appointments liên kết 1-1 với ratings.
- users có nhiều notification_logs, user_sessions, password_reset_tokens và audit_logs.
- file_attachments có thể gắn với consultation_sessions hoặc một owner nghiệp vụ thông qua ownerType và ownerId.

# TÀI LIỆU THAM KHẢO

- Tài liệu yêu cầu phần mềm (SRS): _Online Health Consultation Platform_, nhóm thực hiện, 2026.
- NestJS Documentation. <https://docs.nestjs.com>
- React Documentation. <https://react.dev>
- Prisma ORM Documentation. <https://www.prisma.io/docs>
- PostgreSQL Documentation. <https://www.postgresql.org/docs>
- OWASP Top 10 Web Application Security Risks. <https://owasp.org/www-project-top-ten/>
- ISO/IEC 25010:2011 - Systems and software Quality Requirements and Evaluation (SQuaRE).
- Roger S. Pressman, _Software Engineering: A Practitioner's Approach_, 8th edition, McGraw-Hill, 2014.