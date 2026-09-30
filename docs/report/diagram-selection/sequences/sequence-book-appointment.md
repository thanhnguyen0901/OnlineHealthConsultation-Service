## 6. Book Appointment

Patient đặt lịch qua `POST /api/appointments`. Service kiểm tra patient, doctor, thời gian tương lai, lịch làm việc, conflict của doctor/patient rồi tạo appointment, outbox event và audit log trong transaction serializable.

```mermaid
sequenceDiagram
  autonumber
  actor Patient
  participant UI as React UI - BookAppointmentPage
  participant API as API Client - patient.api
  participant Controller as NestJS Controller - AppointmentController
  participant Service as Service - AppointmentService
  participant DB as Prisma/PostgreSQL

  Patient->>UI: Pick doctor, slot, reason and submit
  UI->>API: bookAppointment(data)
  API->>Controller: POST /api/appointments
  Controller->>Service: createAppointment(currentUser.sub, dto)
  Service->>DB: patientProfile.findUnique(userId)
  Service->>DB: doctorProfile.findUnique(doctorId, include user)
  Service->>Service: validate future time and duration
  Service->>DB: transaction(serializable)
  Service->>DB: doctorProfile.findUnique(latest)
  Service->>Service: assert bookable doctor and working schedule
  Service->>DB: appointment.findMany(conflict window)
  alt No conflict
    Service->>DB: appointment.create(PENDING_CONFIRMATION)
    Service->>DB: outboxEvent.create(APPOINTMENT_CREATED)
    Service->>DB: auditLog.create(APPOINTMENT_CREATED)
    DB-->>Service: appointment
    Service-->>Controller: appointment
    Controller-->>API: 201 Created
    API-->>UI: normalized appointment
    UI->>API: getHistory()
    API-->>UI: refreshed appointments/questions/ratings
    UI-->>Patient: Show appointment booked toast
  else Invalid doctor, time, schedule, or conflict
    Service-->>Controller: 400/404 error
    Controller-->>API: error response
    API-->>UI: error message
    UI-->>Patient: Show booking error
  end
```
