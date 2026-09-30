## 6. Moderate Health Question/Response

Questions and answers are loaded through the unified moderation list. Question moderation updates question status and creates `QuestionModeration`; answer moderation toggles `Answer.isApproved`.

```mermaid
sequenceDiagram
  autonumber
  actor Admin as Administrator
  participant UI as React UI - ModerationPage
  participant API as API Client - admin.api
  participant Controller as NestJS Controller - ModerationController
  participant Service as Service - ModerationService
  participant DB as Prisma/PostgreSQL

  Admin->>UI: Open moderation queue
  UI->>API: getModerationItems()
  API->>Controller: GET /api/admin/moderation/items
  Controller->>Controller: JwtAuthGuard + RolesGuard(ADMIN)
  Controller->>Service: listItems(query)
  par Questions
    Service->>DB: question.findMany(include patient, doctor, answers)
  and Answers
    Service->>DB: answer.findMany(include doctor and question.patient)
  end
  DB-->>Service: reviewable question/answer items
  Service-->>Controller: moderation items
  Controller-->>API: 200 OK
  API-->>UI: items
  UI-->>Admin: Render queue

  alt Moderate question
    Admin->>UI: Approve/restore/hide/close question
    UI->>API: PATCH /api/admin/moderation/items/QUESTION/{questionId}
    API->>Controller: moderateItem(type=QUESTION, action)
    Controller->>Service: moderateItem(adminId, QUESTION, questionId, dto)
    Service->>DB: user.findUnique(adminId)
    Service->>DB: question.findUnique(include answers)
    Service->>DB: transaction
    Service->>DB: question.update(status)
    Service->>DB: questionModeration.create(action, reason)
    Service->>DB: auditLog.create(QUESTION_MODERATED)
    Service-->>Controller: updated question
    Controller-->>API: 200 OK
  else Moderate answer
    Admin->>UI: Approve/restore/hide answer
    UI->>API: PATCH /api/admin/moderation/items/ANSWER/{answerId}
    API->>Controller: moderateItem(type=ANSWER, action)
    Controller->>Service: moderateItem(adminId, ANSWER, answerId, dto)
    Service->>DB: user.findUnique(adminId)
    Service->>DB: answer.findUnique(answerId)
    Service->>DB: answer.update(isApproved)
    Service->>DB: auditLog.create(ANSWER_MODERATED)
    Service-->>Controller: updated answer
    Controller-->>API: 200 OK
  end

  API-->>UI: moderation result
  UI->>API: getModerationItems()
  API-->>UI: refreshed queue
  UI-->>Admin: Show moderation toast
```
