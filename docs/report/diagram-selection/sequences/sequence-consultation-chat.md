## 10. Realtime Chat

Realtime consultation dùng REST để join/load fallback, và Socket.IO namespace `/consultations` để join room và broadcast message. Nếu socket chưa sẵn sàng, UI fallback sang REST `POST /messages`.

```mermaid
sequenceDiagram
  autonumber
  actor Patient
  participant PatientUI as Patient UI
  participant REST as REST API
  participant Service as Consultation Service
  participant Gateway as Socket.IO Gateway
  participant DoctorClient as Doctor Client
  participant DB as Database

  Patient->>PatientUI: Enter consultation page
  PatientUI->>REST: POST /api/consultations/{appointmentId}/join
  REST->>Service: joinSession(userId, PATIENT, appointmentId)
  Service->>DB: appointment/session + patient access checks
  DB-->>Service: joinable session
  Service-->>REST: join result
  REST-->>PatientUI: sessionId/status/channel

  PatientUI->>Gateway: Connect /consultations with accessToken
  Gateway->>Gateway: verify JWT from handshake auth/header
  PatientUI->>Gateway: consultation:join { appointmentId }
  Gateway->>Service: joinSession(userId, PATIENT, appointmentId)
  Service->>DB: appointment/session + access checks
  DB-->>Service: join confirmed
  Service-->>Gateway: room and session metadata
  Gateway-->>PatientUI: consultation:joined

  Patient->>PatientUI: Send chat message
  alt Socket connected and joined
    PatientUI->>Gateway: consultation:message { appointmentId, content }
    Gateway->>Service: sendSessionMessage(userId, PATIENT, appointmentId, content)
    Service->>DB: consultationMessage.create(senderUserId, content)
    DB-->>Service: persisted message
    Service-->>Gateway: message
    Gateway-->>PatientUI: consultation:message
    Gateway-->>DoctorClient: consultation:message
  else Socket unavailable
    PatientUI->>REST: POST /api/consultations/{appointmentId}/messages
    REST->>Service: sendSessionMessage(userId, PATIENT, appointmentId, content)
    Service->>DB: consultationMessage.create(senderUserId, content)
    DB-->>Service: persisted message
    Service-->>REST: message
    REST-->>PatientUI: saved message
  end
```
