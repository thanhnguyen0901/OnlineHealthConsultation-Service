# Notification Sequence Diagrams

Tài liệu này mô tả các luồng notification dựa trên implementation cuối cùng của backend NestJS.

Nguồn đã đối chiếu:

- `src/modules/appointment/appointment.service.ts`
- `src/modules/question/question.service.ts`
- `src/modules/identity/auth.service.ts`
- `src/modules/notification/notification.service.ts`
- `src/modules/notification/notification.scheduler.ts`
- `src/modules/notification/providers/*.ts`
- `prisma/schema.prisma`

Các diagram phân biệt rõ:

- **Synchronous business transaction**: service nghiệp vụ ghi domain data, `AuditLog` và/hoặc `OutboxEvent` trong DB transaction.
- **Asynchronous notification delivery**: `NotificationScheduler` chạy cron, gọi `NotificationService.processOutboxBatch()`, claim `OutboxEvent`, tạo `NotificationLog`, gọi provider, rồi cập nhật trạng thái delivery.

Lưu ý implementation hiện tại:

- Appointment created, appointment confirmed và health question answered dùng `OutboxEvent`.
- Appointment reminder không dùng `OutboxEvent`; scheduler quét appointment sắp tới và gửi notification idempotent trực tiếp.
- Password reset email không dùng `OutboxEvent`; `AuthService` tạo reset token rồi gọi `NotificationService.createPasswordResetNotification()` trực tiếp. Provider thực tế có thể là `DEV_NOTIFICATION` hoặc `EMAIL_PROVIDER` tùy env.

## 1. Appointment Created Notification

`AppointmentService.createAppointment()` tạo appointment, outbox event và audit log trong cùng transaction. Delivery diễn ra sau đó bởi scheduler.

```mermaid
sequenceDiagram
  autonumber
  participant Business as Business Service - AppointmentService
  participant Tx as Database Transaction
  participant Outbox as OutboxEvent
  participant Scheduler as Outbox Processor/Scheduler
  participant Notify as NotificationService
  participant Log as NotificationLog
  participant Email as Email Provider
  participant Recipient as Recipient - Patient/Doctor

  rect rgb(245, 247, 250)
    Note over Business,Outbox: Synchronous business transaction
    Business->>Tx: Begin serializable transaction
    Business->>Tx: appointment.create(PENDING_CONFIRMATION)
    Business->>Outbox: outboxEvent.create(APPOINTMENT_CREATED)
    Business->>Tx: auditLog.create(APPOINTMENT_CREATED)
    Tx-->>Business: Commit appointment + outbox event
  end

  rect rgb(250, 250, 245)
    Note over Scheduler,Recipient: Asynchronous notification delivery
    Scheduler->>Notify: processOutboxBatch(limit)
    Notify->>Outbox: findMany(PENDING or retryable FAILED)
    Notify->>Outbox: updateMany(status=PROCESSING)
    Notify->>Notify: dispatchOutboxEvent(APPOINTMENT_CREATED)
    Notify->>Tx: patientProfile.findUnique(patientId)
    Notify->>Log: notificationLog.upsert(PATIENT_CREATED, PENDING)
    Notify->>Email: send(patient notification)
    Email-->>Recipient: Delivery attempt
    Email-->>Notify: success/failure
    Notify->>Log: update(SENT or FAILED)
    Notify->>Tx: doctorProfile.findUnique(doctorId)
    Notify->>Log: notificationLog.upsert(DOCTOR_CREATED, PENDING)
    Notify->>Email: send(doctor notification)
    Email-->>Recipient: Delivery attempt
    Email-->>Notify: success/failure
    Notify->>Log: update(SENT or FAILED)
    Notify->>Outbox: update(status=SENT)
  end
```

## 2. Appointment Confirmed Notification

`AppointmentService.confirmAppointment()` cập nhật appointment sang `CONFIRMED`, tạo outbox event `APPOINTMENT_CONFIRMED` và audit log. Processor hiện gửi notification cho patient.

```mermaid
sequenceDiagram
  autonumber
  participant Business as Business Service - AppointmentService
  participant Tx as Database Transaction
  participant Outbox as OutboxEvent
  participant Scheduler as Outbox Processor/Scheduler
  participant Notify as NotificationService
  participant Log as NotificationLog
  participant Email as Email Provider
  participant Recipient as Recipient - Patient

  rect rgb(245, 247, 250)
    Note over Business,Outbox: Synchronous business transaction
    Business->>Tx: Begin transaction
    Business->>Tx: appointment.update(status=CONFIRMED)
    Business->>Outbox: outboxEvent.create(APPOINTMENT_CONFIRMED)
    Business->>Tx: auditLog.create(APPOINTMENT_CONFIRMED_BY_DOCTOR)
    Tx-->>Business: Commit status change + outbox event
  end

  rect rgb(250, 250, 245)
    Note over Scheduler,Recipient: Asynchronous notification delivery
    Scheduler->>Notify: processOutboxBatch(limit)
    Notify->>Outbox: find pending APPOINTMENT_CONFIRMED
    Notify->>Outbox: updateMany(status=PROCESSING)
    Notify->>Notify: dispatchOutboxEvent(APPOINTMENT_CONFIRMED)
    Notify->>Tx: patientProfile.findUnique(patientId)
    Tx-->>Notify: patient.userId
    Notify->>Log: notificationLog.upsert(PATIENT_CONFIRMED, PENDING)
    Notify->>Email: send("appointment confirmed")
    Email-->>Recipient: Delivery attempt
    Email-->>Notify: success/failure
    Notify->>Log: update(SENT or FAILED)
    alt Delivery completed without thrown error
      Notify->>Outbox: update(status=SENT)
    else Dispatch throws
      Notify->>Outbox: update(status=FAILED, retryCount+1, nextRetryAt)
    end
  end
```

## 3. Appointment Reminder

Reminder không đi qua `OutboxEvent`. `NotificationScheduler` chạy cron riêng, quét appointment `CONFIRMED` trong cửa sổ thời gian cấu hình và gọi `createNotificationIdempotent()` cho patient và doctor.

```mermaid
sequenceDiagram
  autonumber
  participant Scheduler as Outbox Processor/Scheduler
  participant Notify as NotificationService
  participant Tx as Database Transaction
  participant Outbox as OutboxEvent
  participant Log as NotificationLog
  participant Email as Email Provider
  participant Recipient as Recipient - Patient/Doctor

  rect rgb(245, 247, 250)
    Note over Scheduler,Outbox: Scheduled scan, no business OutboxEvent is created
    Scheduler->>Notify: sendAppointmentReminders(withinMinutes)
    Notify->>Tx: appointment.findMany(CONFIRMED, scheduledAt within window)
    Tx-->>Notify: appointments with patient and doctor
    Note over Notify,Outbox: OutboxEvent is intentionally not used for reminders
  end

  rect rgb(250, 250, 245)
    Note over Notify,Recipient: Idempotent notification delivery
    loop For each appointment
      Notify->>Log: notificationLog.upsert(APPOINTMENT_REMINDER:{id}:PATIENT, PENDING)
      Notify->>Email: send(patient reminder)
      Email-->>Recipient: Delivery attempt
      Email-->>Notify: success/failure
      Notify->>Log: update(SENT or FAILED)

      Notify->>Log: notificationLog.upsert(APPOINTMENT_REMINDER:{id}:DOCTOR, PENDING)
      Notify->>Email: send(doctor reminder)
      Email-->>Recipient: Delivery attempt
      Email-->>Notify: success/failure
      Notify->>Log: update(SENT or FAILED)
    end
    Notify-->>Scheduler: remindersSent, appointmentsScanned
  end
```

## 4. Health Question Answered Notification

`QuestionService.answerQuestion()` cập nhật question, tạo answer, audit log và outbox event `QUESTION_ANSWERED`. Processor sau đó tìm patient của question và gửi notification.

```mermaid
sequenceDiagram
  autonumber
  participant Business as Business Service - QuestionService
  participant Tx as Database Transaction
  participant Outbox as OutboxEvent
  participant Scheduler as Outbox Processor/Scheduler
  participant Notify as NotificationService
  participant Log as NotificationLog
  participant Email as Email Provider
  participant Recipient as Recipient - Patient

  rect rgb(245, 247, 250)
    Note over Business,Outbox: Synchronous business transaction
    Business->>Tx: Begin transaction
    Business->>Tx: question.update(status=ANSWERED, doctorId)
    Business->>Tx: answer.create(isApproved=true)
    Business->>Tx: auditLog.create(QUESTION_ANSWERED_BY_DOCTOR)
    Business->>Outbox: outboxEvent.create(QUESTION_ANSWERED)
    Tx-->>Business: Commit answer + outbox event
  end

  rect rgb(250, 250, 245)
    Note over Scheduler,Recipient: Asynchronous notification delivery
    Scheduler->>Notify: processOutboxBatch(limit)
    Notify->>Outbox: find pending QUESTION_ANSWERED
    Notify->>Outbox: updateMany(status=PROCESSING)
    Notify->>Notify: dispatchOutboxEvent(QUESTION_ANSWERED)
    Notify->>Tx: question.findUnique(questionId, include patient)
    Tx-->>Notify: question + patient.userId
    Notify->>Log: notificationLog.upsert(PATIENT_QUESTION_ANSWERED, PENDING)
    Notify->>Email: send("question answered")
    Email-->>Recipient: Delivery attempt
    Email-->>Notify: success/failure
    Notify->>Log: update(SENT or FAILED)
    alt Delivery completed without thrown error
      Notify->>Outbox: update(status=SENT)
    else Dispatch throws
      Notify->>Outbox: update(status=FAILED, retryCount+1, nextRetryAt)
    end
  end
```

## 5. Password Reset Email

Password reset notification không dùng outbox. `AuthService.forgotPassword()` tạo `PasswordResetToken` và audit log trước, sau đó gọi `NotificationService.createPasswordResetNotification()` trực tiếp. Method này vẫn ghi `NotificationLog` idempotent và gọi provider.

```mermaid
sequenceDiagram
  autonumber
  participant Business as Business Service - AuthService
  participant Tx as Database Transaction
  participant Outbox as OutboxEvent
  participant Scheduler as Outbox Processor/Scheduler
  participant Notify as NotificationService
  participant Log as NotificationLog
  participant Email as Email Provider
  participant Recipient as Recipient - User

  rect rgb(245, 247, 250)
    Note over Business,Outbox: Synchronous password reset request
    Business->>Tx: usersService.findByEmail(email)
    alt Active user exists
      Business->>Tx: passwordResetToken.create(tokenHash, expiresAt)
      Business->>Tx: auditLog.create(PASSWORD_RESET_REQUESTED)
      Note over Business,Outbox: OutboxEvent is intentionally not created
    else Missing or inactive user
      Business-->>Recipient: Generic response only
    end
  end

  rect rgb(250, 250, 245)
    Note over Business,Recipient: Direct notification call, not outbox scheduled
    opt Active user exists
      Business->>Notify: createPasswordResetNotification(userId, email, resetUrl, tokenId)
      Notify->>Log: notificationLog.upsert(PASSWORD_RESET:{tokenId}, PENDING)
      Notify->>Email: send(password reset content)
      Email-->>Recipient: Delivery attempt
      Email-->>Notify: success/failure
      Notify->>Log: update(SENT or FAILED)
      Notify-->>Business: NotificationLog
    end
    Note over Scheduler,Outbox: Scheduler does not process this password reset request
  end
```

## Notes

- `NotificationService.createNotificationIdempotent()` uses `NotificationLog.externalRef` for idempotency.
- Default notification type is `EMAIL`; SMS exists in provider selection but these implemented flows use email-type notifications.
- In development, the resolved provider is usually `DEV_NOTIFICATION`; in production-like configuration it may resolve to `EMAIL_PROVIDER`.
- `EmailNotificationProvider` is a dry-run provider unless `NOTIFICATION_EMAIL_PROVIDER_ENABLED=true`.
- Outbox retry behavior marks failed events as `FAILED`, increments `retryCount`, and sets `nextRetryAt` five minutes later.
