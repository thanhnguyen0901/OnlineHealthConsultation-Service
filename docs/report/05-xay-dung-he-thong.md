# CHƯƠNG 5. XÂY DỰNG VÀ TRIỂN KHAI HỆ THỐNG

Chương này trình bày cách hệ thống đã được xây dựng dựa trên thiết kế ở Chương 4. Nội dung tập trung vào các phân hệ chức năng trong phiên bản cài đặt cuối cùng, bao gồm trách nhiệm của giao diện người dùng, API backend, tương tác dữ liệu, quy tắc nghiệp vụ và các cơ chế kỹ thuật nổi bật.

Các sơ đồ kiến trúc tổng thể, ERD, sơ đồ lớp và các Sequence Diagram đã được trình bày ở Chương 4, vì vậy chương này không lặp lại các sơ đồ đó. Khi cần minh họa, chương này ưu tiên ảnh chụp giao diện hoặc đoạn mã đại diện.

## 5.1 Authentication and RBAC

**Mục đích:** Phân hệ xác thực và phân quyền bảo đảm chỉ người dùng hợp lệ được truy cập hệ thống và mỗi vai trò chỉ được sử dụng các chức năng phù hợp. Hệ thống hỗ trợ ba vai trò chính: bệnh nhân, bác sĩ và quản trị viên.

**Trách nhiệm frontend:** Ứng dụng React cung cấp các màn hình đăng ký, đăng nhập, quên mật khẩu và đặt lại mật khẩu. Sau khi đăng nhập, frontend lưu access token trong trạng thái ứng dụng, tự gắn token vào các yêu cầu API và điều hướng người dùng đến dashboard tương ứng với vai trò. Các route được bảo vệ bằng `AuthGuard` và `RoleGuard`, nhờ đó bệnh nhân, bác sĩ và quản trị viên chỉ nhìn thấy các trang phù hợp.

**Trách nhiệm backend:** Backend triển khai `AuthController`, `AuthService`, `UsersService`, `JwtAuthGuard`, `RolesGuard` và `OwnershipGuard`. `AuthService` kiểm tra email, mật khẩu đã băm bằng bcrypt, trạng thái tài khoản và phát hành access token/refresh token. `AuthController` đặt refresh token trong cookie HttpOnly, cung cấp API đăng nhập, làm mới token, đăng xuất, lấy thông tin tài khoản hiện tại và đặt lại mật khẩu.

**Tương tác dữ liệu:** Dữ liệu chính gồm `User`, `UserSession`, `PasswordResetToken` và `AuditLog`. Refresh token không được lưu trực tiếp mà được băm rồi lưu trong `UserSession`; khi làm mới token, phiên cũ được thu hồi và một phiên mới được tạo.

**Logic nghiệp vụ quan trọng:** Tài khoản bị vô hiệu hóa hoặc đã bị xóa mềm không được đăng nhập. Refresh token phải đúng phiên, chưa bị thu hồi và chưa hết hạn. Một số API dùng kiểm tra quyền sở hữu để ngăn người dùng truy cập tài nguyên của người khác, đồng thời cho phép quản trị viên truy cập khi chính sách cho phép.

**Cơ chế kỹ thuật đáng chú ý:** Hệ thống dùng JWT cho access token, cookie HttpOnly cho refresh token, bcrypt cho mật khẩu và audit log cho các hành động nhạy cảm như đăng nhập, làm mới token, đăng xuất và đặt lại mật khẩu.

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

## 5.2 Public Doctor/Specialty Discovery

**Mục đích:** Phân hệ khám phá công khai cho phép khách và người dùng đã đăng nhập xem danh sách chuyên khoa, tìm kiếm bác sĩ và xem thông tin bác sĩ trước khi đặt lịch.

**Trách nhiệm frontend:** Frontend có các trang danh sách chuyên khoa, danh sách bác sĩ và chi tiết bác sĩ. Module `public.api.ts` gọi các API công khai, chuẩn hóa dữ liệu bác sĩ, chuyên khoa, đánh giá trung bình và số lượt đánh giá để hiển thị nhất quán trên giao diện.

[INSERT FIGURE: ui-public-doctor-discovery.png]

Hình 5.1. Giao diện tra cứu chuyên khoa và bác sĩ

**Trách nhiệm backend:** Backend triển khai `DiscoveryController` và `DiscoveryService`. Phân hệ này trả về thông tin trang chủ API, danh sách chuyên khoa đang hoạt động, danh sách bác sĩ công khai có phân trang, lọc theo chuyên khoa và tìm kiếm theo từ khóa.

**Tương tác dữ liệu:** Dữ liệu được đọc từ `Specialty`, `DoctorProfile`, `DoctorSpecialty`, `User` và `Rating`. Khi lấy danh sách bác sĩ, hệ thống chỉ lấy bác sĩ đang hoạt động, đã được duyệt và tài khoản người dùng tương ứng chưa bị vô hiệu hóa.

**Logic nghiệp vụ quan trọng:** Chỉ bác sĩ có `approvalStatus = APPROVED`, `isActive = true` và tài khoản còn hoạt động mới được hiển thị công khai. Điểm đánh giá công khai chỉ tính các đánh giá có trạng thái hiển thị.

**Cơ chế kỹ thuật đáng chú ý:** Backend sử dụng Prisma để kết hợp điều kiện lọc, phân trang và truy vấn quan hệ. Kết quả được bổ sung thống kê đánh giá bằng truy vấn aggregate theo từng bác sĩ.

## 5.3 Patient Profile

**Mục đích:** Phân hệ hồ sơ bệnh nhân cho phép bệnh nhân lưu trữ và cập nhật thông tin cá nhân cần thiết cho quá trình tư vấn, gồm ngày sinh, giới tính, số điện thoại, địa chỉ và tiền sử sức khỏe.

**Trách nhiệm frontend:** Trang hồ sơ bệnh nhân hiển thị thông tin tài khoản kết hợp với hồ sơ bệnh nhân. Người dùng có thể cập nhật thông tin bổ sung; dữ liệu nhập được chuẩn hóa trước khi gửi lên API, ví dụ giới tính được chuyển về dạng enum backend sử dụng.

**Trách nhiệm backend:** `PatientController` và `PatientService` cung cấp API lấy và cập nhật hồ sơ cá nhân. Khi cập nhật, backend kiểm tra hồ sơ theo `userId`; nếu chưa có hồ sơ thì tạo bản ghi hồ sơ rỗng trước khi cập nhật dữ liệu.

**Tương tác dữ liệu:** Phân hệ sử dụng `PatientProfile` liên kết một-một với `User`. Các thông tin định danh như email, họ tên và vai trò được đọc từ `User`, còn thông tin y tế cơ bản được lưu trong `PatientProfile`.

**Logic nghiệp vụ quan trọng:** Bệnh nhân chỉ được truy cập hồ sơ của chính mình thông qua access token. Dữ liệu hồ sơ không được dùng để đưa ra chẩn đoán tự động; hệ thống chỉ hỗ trợ lưu trữ thông tin tham khảo cho hoạt động tư vấn.

**Cơ chế kỹ thuật đáng chú ý:** API cập nhật dùng phương thức PATCH để chỉ ghi các trường được gửi lên, tránh ghi đè không cần thiết những trường người dùng không thay đổi.

## 5.4 Doctor Profile and Schedule

**Mục đích:** Phân hệ hồ sơ bác sĩ và lịch làm việc cho phép bác sĩ quản lý thông tin nghề nghiệp, chuyên khoa, mô tả tư vấn và khung giờ có thể nhận lịch hẹn.

**Trách nhiệm frontend:** Các trang hồ sơ bác sĩ, lịch làm việc, danh sách lịch hẹn, danh sách bệnh nhân và đánh giá bác sĩ được tổ chức trong khu vực dành cho vai trò `DOCTOR`. Module `doctor.api.ts` gọi API hồ sơ, lịch, lịch hẹn, câu hỏi, bệnh nhân, đánh giá và tư vấn.

**Trách nhiệm backend:** `DoctorController` và `DoctorService` xử lý lấy/cập nhật hồ sơ bác sĩ, cập nhật lịch làm việc, cập nhật chuyên khoa và thống kê cơ bản của bác sĩ. Quản trị viên có các API riêng để duyệt, cập nhật hồ sơ và chuyên khoa của bác sĩ.

**Tương tác dữ liệu:** Dữ liệu chính gồm `DoctorProfile`, `DoctorSpecialty`, `Specialty`, `User`, `Appointment`, `Question` và `Rating`. Lịch làm việc được lưu trong trường `schedule` của hồ sơ bác sĩ dưới dạng cấu trúc JSON.

**Logic nghiệp vụ quan trọng:** Chuyên khoa được gán cho bác sĩ phải tồn tại và đang hoạt động. Khi thay đổi chuyên khoa, hệ thống xóa các liên kết cũ và tạo lại các liên kết mới trong một transaction. Bác sĩ chưa được duyệt không được xuất hiện trong danh sách công khai và không được đặt lịch.

**Cơ chế kỹ thuật đáng chú ý:** Backend sử dụng transaction để thay thế danh sách chuyên khoa của bác sĩ, đồng thời ghi audit log khi quản trị viên thay đổi trạng thái duyệt hoặc cập nhật thông tin bác sĩ.

## 5.5 Health Questions

**Mục đích:** Phân hệ câu hỏi sức khỏe cho phép bệnh nhân gửi câu hỏi, tùy chọn gán cho bác sĩ cụ thể, và cho phép bác sĩ trả lời trong phạm vi chức năng tư vấn sức khỏe trực tuyến.

**Trách nhiệm frontend:** Bệnh nhân có trang đặt câu hỏi và xem lịch sử câu hỏi. Bác sĩ có hộp thư câu hỏi được giao hoặc câu hỏi chưa gán. Frontend chuẩn hóa trạng thái câu hỏi để hiển thị đơn giản như đang chờ, đã trả lời hoặc đã kiểm duyệt.

**Trách nhiệm backend:** `QuestionController` và `QuestionService` cung cấp API tạo câu hỏi, lấy câu hỏi của bệnh nhân, lấy câu hỏi của bác sĩ, trả lời câu hỏi và kiểm duyệt câu hỏi. Khi bác sĩ trả lời, hệ thống cập nhật trạng thái câu hỏi, tạo câu trả lời, ghi audit log và phát sinh outbox event.

**Tương tác dữ liệu:** Dữ liệu gồm `Question`, `Answer`, `QuestionModeration`, `PatientProfile`, `DoctorProfile`, `AuditLog` và `OutboxEvent`.

**Logic nghiệp vụ quan trọng:** Nếu bệnh nhân chọn bác sĩ, bác sĩ đó phải đang hoạt động và đã được duyệt. Bác sĩ không được trả lời câu hỏi đã được gán cho bác sĩ khác. Câu hỏi chỉ được trả lời khi đang ở trạng thái chờ xử lý.

**Cơ chế kỹ thuật đáng chú ý:** Việc trả lời câu hỏi được thực hiện trong transaction để bảo đảm câu hỏi, câu trả lời, audit log và sự kiện thông báo được ghi nhất quán.

## 5.6 Appointment and Availability

**Mục đích:** Phân hệ lịch hẹn cho phép bệnh nhân xem khung giờ khả dụng của bác sĩ, đặt lịch tư vấn, hủy lịch; bác sĩ xác nhận, hoàn thành hoặc đổi lịch hẹn; quản trị viên theo dõi và cập nhật trạng thái khi cần.

**Trách nhiệm frontend:** Bệnh nhân sử dụng trang đặt lịch để chọn bác sĩ, ngày, khung giờ và lý do tư vấn. Bác sĩ quản lý danh sách lịch hẹn tại khu vực bác sĩ. Quản trị viên có màn hình quản lý lịch hẹn để lọc, xem và cập nhật trạng thái.

[INSERT FIGURE: ui-book-appointment.png]

Hình 5.2. Giao diện đặt lịch hẹn trực tuyến

**Trách nhiệm backend:** `AppointmentController` và `AppointmentService` xử lý API xem khả dụng công khai, tạo lịch hẹn, danh sách lịch hẹn của bệnh nhân, danh sách lịch hẹn của bác sĩ, xác nhận, hủy, hoàn thành, đổi lịch và quản trị lịch hẹn.

**Tương tác dữ liệu:** Phân hệ sử dụng `Appointment`, `PatientProfile`, `DoctorProfile`, `DoctorSpecialty`, `ConsultationSession`, `Rating`, `AuditLog`, `OutboxEvent` và một số `NotificationLog` trong các thao tác trạng thái.

**Logic nghiệp vụ quan trọng:** Lịch hẹn phải nằm trong tương lai, nằm trong lịch làm việc của bác sĩ, không trùng với lịch hẹn đang chờ xác nhận hoặc đã xác nhận của bác sĩ và bệnh nhân. Bác sĩ phải đang hoạt động, được duyệt và tài khoản chưa bị vô hiệu hóa.

**Cơ chế kỹ thuật đáng chú ý:** Tạo lịch hẹn sử dụng transaction với isolation level `Serializable` để giảm rủi ro đặt trùng khi nhiều yêu cầu xảy ra gần nhau. Trong cùng transaction, hệ thống tạo lịch hẹn, ghi audit log và tạo outbox event để xử lý thông báo.

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

## 5.7 Consultation and Realtime Chat

**Mục đích:** Phân hệ tư vấn trực tuyến hỗ trợ bệnh nhân và bác sĩ trao đổi trong phiên tư vấn gắn với lịch hẹn. Hệ thống hỗ trợ kênh chat thời gian thực và có ranh giới để tích hợp video khi nhà cung cấp bên ngoài được bật.

**Trách nhiệm frontend:** Bệnh nhân và bác sĩ có các trang phiên tư vấn riêng. Frontend tải thông tin lịch hẹn, tham gia phiên tư vấn, lấy lịch sử tin nhắn, gửi tin nhắn và kết nối Socket.IO thông qua `ConsultationSocketClient`. Client tự xử lý trạng thái kết nối, tham gia phòng theo `appointmentId` và tránh hiển thị trùng tin nhắn đã nhận.

[INSERT FIGURE: ui-consultation-chat.png]

Hình 5.3. Giao diện tư vấn trực tuyến và trao đổi tin nhắn

**Trách nhiệm backend:** `ConsultationController`, `ConsultationService` và `ConsultationGateway` triển khai API bắt đầu phiên, tham gia phiên, lấy/gửi tin nhắn, kết thúc phiên và lấy kết quả tư vấn. `ConsultationGateway` là điểm vào realtime của Socket.IO tại namespace `/consultations`.

**Tương tác dữ liệu:** Dữ liệu gồm `Appointment`, `ConsultationSession`, `ConsultationMessage`, `PatientProfile`, `DoctorProfile` và `User`. Tin nhắn được lưu vào cơ sở dữ liệu để có thể tải lại lịch sử trao đổi.

**Logic nghiệp vụ quan trọng:** Chỉ bác sĩ sở hữu lịch hẹn mới được bắt đầu và kết thúc phiên. Bệnh nhân hoặc bác sĩ chỉ được tham gia phiên của chính mình. Việc tham gia phiên bị giới hạn bởi khung thời gian cho phép quanh thời điểm lịch hẹn. Phiên tư vấn chỉ nhận tin nhắn khi đang ở trạng thái `ONGOING`.

**Cơ chế kỹ thuật đáng chú ý:** Socket.IO sử dụng token JWT trong handshake để xác thực kết nối. Mỗi lịch hẹn có một room riêng theo mẫu `consultation:<appointmentId>`. Khi một người gửi tin nhắn, gateway gọi service để kiểm tra quyền, lưu tin nhắn, rồi phát tin nhắn tới toàn bộ room.

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

## 5.8 Consultation Result and Prescription

**Mục đích:** Sau phiên tư vấn, bác sĩ có thể ghi tóm tắt nội dung tư vấn và tạo đơn thuốc. Bệnh nhân có thể xem lại kết quả tư vấn, tóm tắt và đơn thuốc liên quan đến lịch hẹn của mình.

**Trách nhiệm frontend:** Bác sĩ sử dụng trang phiên tư vấn để lưu tóm tắt, kết thúc phiên và tạo đơn thuốc gồm nhiều mục thuốc. Bệnh nhân xem kết quả qua lịch sử tư vấn/lịch hẹn. Các API liên quan được gọi qua `doctor.api.ts` và `patient.api.ts`.

**Trách nhiệm backend:** `ConsultationService` xử lý cập nhật tóm tắt phiên, kết thúc phiên, tạo đơn thuốc và lấy kết quả tư vấn. Khi kết thúc phiên, backend cập nhật cả `ConsultationSession` và `Appointment` trong cùng transaction.

**Tương tác dữ liệu:** Dữ liệu chính gồm `ConsultationSession`, `Appointment`, `Prescription` và `PrescriptionItem`. Kết quả tư vấn trả về thông tin lịch hẹn, phiên tư vấn và đơn thuốc nếu đã có.

**Logic nghiệp vụ quan trọng:** Chỉ bác sĩ sở hữu phiên tư vấn mới được cập nhật tóm tắt và tạo đơn thuốc. Đơn thuốc chỉ được tạo sau khi lịch hẹn đã hoàn thành. Khi tạo lại đơn thuốc, hệ thống cập nhật bản ghi đơn thuốc và thay thế danh sách thuốc để dữ liệu không bị lặp.

**Cơ chế kỹ thuật đáng chú ý:** Tạo đơn thuốc dùng transaction với `upsert` cho `Prescription`, sau đó xóa và tạo lại `PrescriptionItem`. Cách này giúp mỗi phiên tư vấn chỉ có một đơn thuốc hiện hành.

## 5.9 Rating

**Mục đích:** Phân hệ đánh giá cho phép bệnh nhân phản hồi sau khi hoàn tất lịch tư vấn, đồng thời giúp bác sĩ và người dùng công khai xem chất lượng dịch vụ thông qua điểm đánh giá được hiển thị.

**Trách nhiệm frontend:** Bệnh nhân đánh giá từ lịch sử tư vấn sau khi lịch hẹn hoàn thành. Bác sĩ có trang xem các đánh giá hiển thị của mình. Trang khám phá bác sĩ công khai sử dụng điểm trung bình và số lượng đánh giá để hỗ trợ người dùng lựa chọn.

**Trách nhiệm backend:** `ConsultationService` xử lý tạo đánh giá, lấy đánh giá của bệnh nhân, lấy đánh giá của bác sĩ và kiểm duyệt đánh giá. API đánh giá được bảo vệ theo vai trò bệnh nhân, bác sĩ hoặc quản trị viên tùy chức năng.

**Tương tác dữ liệu:** Dữ liệu chính là `Rating`, liên kết với `PatientProfile`, `DoctorProfile` và `Appointment`. Thống kê công khai được lấy bằng aggregate trên các đánh giá có trạng thái hiển thị.

**Logic nghiệp vụ quan trọng:** Chỉ bệnh nhân sở hữu lịch hẹn mới được đánh giá. Lịch hẹn phải ở trạng thái hoàn thành. Mỗi lịch hẹn chỉ có một đánh giá. Đánh giá có thể được quản trị viên ẩn hoặc khôi phục thông qua phân hệ kiểm duyệt.

**Cơ chế kỹ thuật đáng chú ý:** Ràng buộc nghiệp vụ được kiểm tra trước khi tạo bản ghi `Rating`; backend cũng kiểm tra đánh giá trùng thông qua quan hệ duy nhất theo `appointmentId`.

## 5.10 Notification

**Mục đích:** Phân hệ thông báo ghi nhận và gửi các thông báo quan trọng như đặt lịch, xác nhận lịch, nhắc lịch, câu hỏi đã được trả lời và đặt lại mật khẩu.

**Trách nhiệm frontend:** Trong phiên bản hiện tại, frontend không có một phân hệ giao diện thông báo riêng biệt. Người dùng nhận phản hồi trực tiếp trong luồng thao tác, còn backend cung cấp API `/notifications` để người dùng lấy nhật ký thông báo của mình và API quản trị để xem nhật ký thông báo khi cần vận hành.

**Trách nhiệm backend:** `NotificationController`, `AdminNotificationController`, `NotificationService` và `NotificationScheduler` triển khai xử lý thông báo. Service đọc sự kiện từ `OutboxEvent`, tạo `NotificationLog`, chọn provider phù hợp và cập nhật trạng thái gửi. Scheduler chạy nền để xử lý outbox và gửi nhắc lịch.

**Tương tác dữ liệu:** Dữ liệu gồm `OutboxEvent`, `NotificationLog`, `Appointment`, `Question`, `PatientProfile`, `DoctorProfile` và `User`. Các sự kiện nghiệp vụ được ghi vào outbox trong transaction của nghiệp vụ chính, sau đó được xử lý bất đồng bộ.

**Logic nghiệp vụ quan trọng:** Một sự kiện chỉ nên tạo một thông báo cho cùng một người nhận và mục đích. Nhắc lịch được tạo cho cả bệnh nhân và bác sĩ đối với các lịch đã xác nhận trong khoảng thời gian cấu hình. Thông báo thất bại được đánh dấu `FAILED`, tăng số lần thử và có thời điểm thử lại.

**Cơ chế kỹ thuật đáng chú ý:** Hệ thống dùng Outbox Pattern để tách nghiệp vụ chính khỏi thao tác gửi thông báo. `NotificationLog` có `externalRef` để hỗ trợ tính idempotent; nếu thông báo đã gửi, service không gửi lại.

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

## 5.11 Administration and Moderation

**Mục đích:** Phân hệ quản trị hỗ trợ quản lý người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, nội dung cần kiểm duyệt và trạng thái vận hành hệ thống.

**Trách nhiệm frontend:** Khu vực quản trị có dashboard, quản lý người dùng, bệnh nhân, bác sĩ, chuyên khoa, lịch hẹn, kiểm duyệt và báo cáo. `admin.api.ts` chuẩn hóa dữ liệu từ nhiều API backend để hiển thị dưới dạng bảng, bộ lọc và thao tác quản trị.

[INSERT FIGURE: ui-admin-dashboard.png]

Hình 5.4. Giao diện quản trị hệ thống

**Trách nhiệm backend:** Backend cung cấp các controller quản trị như `AdminUserController`, các API admin trong phân hệ bác sĩ, chuyên khoa, lịch hẹn, thông báo và `ModerationController`. Tất cả API quản trị được bảo vệ bằng `JwtAuthGuard`, `RolesGuard` và vai trò `ADMIN`.

**Tương tác dữ liệu:** Dữ liệu quản trị trải rộng trên `User`, `PatientProfile`, `DoctorProfile`, `Specialty`, `Appointment`, `Question`, `Answer`, `Rating`, `QuestionModeration`, `NotificationLog` và `AuditLog`.

**Logic nghiệp vụ quan trọng:** Quản trị viên có thể tạo/cập nhật/vô hiệu hóa tài khoản, duyệt bác sĩ, quản lý chuyên khoa, cập nhật trạng thái lịch hẹn và kiểm duyệt câu hỏi, câu trả lời, đánh giá. Các thay đổi quan trọng được ghi audit log để phục vụ truy vết.

**Cơ chế kỹ thuật đáng chú ý:** Phân hệ kiểm duyệt gom nhiều loại nội dung về một danh sách thống nhất gồm câu hỏi, câu trả lời và đánh giá. Khi quản trị viên thao tác, service cập nhật đúng bảng dữ liệu tương ứng và ghi nhận lịch sử kiểm duyệt hoặc audit log.

## 5.12 Reporting

**Mục đích:** Phân hệ báo cáo cung cấp số liệu tổng quan cho quản trị viên về người dùng, bác sĩ, bệnh nhân, chuyên khoa, lịch hẹn, câu hỏi, đánh giá và xu hướng tư vấn.

**Trách nhiệm frontend:** Trang báo cáo gọi `reports.api.ts` để lấy thống kê dashboard và dữ liệu xu hướng tư vấn. Dữ liệu được chuẩn hóa thành các chỉ số tổng hợp và điểm dữ liệu theo thời gian để hiển thị trên giao diện báo cáo.

**Trách nhiệm backend:** `ReportingController` và `ReportingService` cung cấp API `/reports/dashboard` và `/reports/consultations/trend`. Các API này chỉ dành cho quản trị viên.

**Tương tác dữ liệu:** Service tổng hợp dữ liệu từ `ConsultationSession`, `Appointment`, `User`, `DoctorProfile`, `Specialty`, `Question` và `Rating`. Bộ lọc thời gian được áp dụng cho lịch hẹn và phiên tư vấn.

**Logic nghiệp vụ quan trọng:** Tham số thời gian phải hợp lệ và mốc bắt đầu không được lớn hơn mốc kết thúc. Xu hướng tư vấn có thể được nhóm theo ngày, tháng hoặc tuần tùy tham số frontend gửi lên.

**Cơ chế kỹ thuật đáng chú ý:** Backend dùng các truy vấn `count`, `groupBy` và đọc danh sách phiên tư vấn để tạo bucket thời gian. Cách triển khai này phù hợp với phạm vi hiện tại vì dữ liệu báo cáo được tổng hợp trực tiếp từ cơ sở dữ liệu nghiệp vụ, không cần kho dữ liệu riêng.

**Tổng kết triển khai:** Phiên bản cài đặt cuối cùng triển khai đầy đủ các phân hệ chính của hệ thống tư vấn sức khỏe và quản lý lịch hẹn trực tuyến. Frontend được tổ chức theo nhóm chức năng và vai trò người dùng; backend được chia thành các module NestJS rõ ràng; dữ liệu được quản lý bằng PostgreSQL thông qua Prisma. Các cơ chế quan trọng như JWT, RBAC, transaction đặt lịch, realtime chat, outbox notification và audit log được sử dụng để đáp ứng yêu cầu nghiệp vụ, bảo mật và khả năng vận hành của hệ thống.
