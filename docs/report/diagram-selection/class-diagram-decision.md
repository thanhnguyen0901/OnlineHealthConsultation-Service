# Backend Class Diagram Decision

## Recommendation

`KEEP_SIMPLIFIED`

## Reason

Backend Class Diagram vẫn có giá trị cho báo cáo tốt nghiệp, nhưng chỉ khi được rút gọn mạnh và tập trung vào các class backend đại diện. Với NestJS modular monolith hiện tại, một class diagram đầy đủ theo toàn bộ controller/service/model sẽ nhanh chóng biến thành dependency graph khó đọc, trong khi phần module-level đã được giải thích tốt hơn bởi Architecture Overview và phần dữ liệu đã được giải thích tốt hơn bởi ERD.

Khuyến nghị: giữ một Backend Class Diagram rút gọn để minh họa cách các class chính trong NestJS phối hợp: controller gọi service, gateway gọi service realtime, scheduler gọi notification service, provider abstraction tách notification delivery, và service dùng `PrismaService` để truy cập persistence.

## Sources Reviewed

- Final backend source under `src/modules`, `src/common`, `src/prisma`.
- Graphify outputs: `graphify-out/GRAPH_REPORT.md`, `graphify-out/graph.json`, `graphify-out/manifest.json`.
- Existing class diagram: `docs/architecture/class-diagram.md`.
- Architecture documentation: `docs/architecture/system-architecture.md`.
- ERD documentation: `docs/architecture/database-erd.md`.

## Evaluation

| Question | Answer | Notes |
| --- | --- | --- |
| Does the existing class diagram clearly explain backend structure? | Partially | It correctly reflects many source classes, but the current application diagram has 47 classes and the domain diagram has 20 Prisma models. This is useful as internal documentation, but too broad for a report figure. |
| Is it readable in an A4 graduation report? | No, not as-is | The current diagram is too dense for A4. It includes many simple controller/service pairs and almost all important domain models. |
| Does it add value beyond the Architecture Overview? | Yes, if simplified | Architecture Overview explains modules and runtime boundaries. A simplified class diagram can add lower-level NestJS relationships: controller/service delegation, gateway/service realtime path, scheduler/provider abstraction, and shared `PrismaService`. |
| Does it duplicate the ERD? | Yes, currently | The existing Domain Model Class Diagram overlaps heavily with `database-erd.md`. For the report, domain model associations should be left to ERD except for a few references such as `OutboxEvent` and `NotificationLog`. |
| Does it accurately reflect current source? | Mostly yes | Graphify and source checks confirm important classes such as `AuthController`, `AppointmentService`, `ConsultationGateway`, `NotificationScheduler`, `NotificationService`, provider implementations, `ModerationService`, `ReportingService`, and `PrismaService`. |
| Would a Backend Component/Module Diagram be more meaningful? | Yes for high-level architecture, but not a complete replacement | A module/component diagram is better for explaining the modular monolith. However, a simplified class diagram still adds value by showing representative class collaboration patterns inside the backend. |

## Graphify Findings

Graphify report identifies backend hubs and navigation nodes that are relevant for a report-ready class diagram:

- `AppointmentService` is one of the top God Nodes with 38 edges.
- Backend community hubs include `NotificationService`, `AuthController`, `ReportingService`, `DoctorController`, `AppointmentService`, `PrismaService`, `ConsultationGateway`, `DiscoveryController`, `DoctorService`, and `UsersService`.
- `graph.json` confirms concrete source nodes for representative classes such as `AuthController`, `AuthService`, `UsersService`, `AppointmentController`, `AppointmentService`, `QuestionController`, `QuestionService`, `ConsultationController`, `ConsultationGateway`, `ConsultationService`, `NotificationScheduler`, `NotificationService`, `NotificationProvider`, provider implementations, `ModerationController`, `ModerationService`, `ReportingController`, `ReportingService`, guards, and `PrismaService`.

These findings support `KEEP_SIMPLIFIED`: keep the classes that represent real architectural patterns, not every class discovered in the graph.

## Suggested Report Title

Hình X. Sơ đồ lớp các thành phần backend chính

## Suggested Report Section

Chương 4 - Thiết kế hệ thống

## Maximum Scope

Target: 15-25 representative classes/components.

The report version should show one diagram only, focused on application collaboration. Do not include the full Prisma domain model class diagram in the report; use ERD for database relationships.

## Classes/Components To Include

Recommended maximum set:

1. `AuthController`
2. `AuthService`
3. `UsersService`
4. `JwtAuthGuard`
5. `RolesGuard`
6. `AppointmentController`
7. `AppointmentService`
8. `QuestionController`
9. `QuestionService`
10. `ConsultationController`
11. `ConsultationGateway`
12. `ConsultationService`
13. `NotificationScheduler`
14. `NotificationService`
15. `NotificationProvider`
16. `DevelopmentNotificationProvider`
17. `EmailNotificationProvider`
18. `SmsNotificationProvider`
19. `ModerationController`
20. `ModerationService`
21. `ReportingController`
22. `ReportingService`
23. `PrismaService`

Optional lightweight domain references, if needed as small stereotypes or notes rather than full model boxes:

- `OutboxEvent`: created by appointment/question flows and consumed by notification processing.
- `NotificationLog`: written by `NotificationService`.
- `Appointment` / `ConsultationSession`: only if the diagram needs to label the appointment-consultation boundary.

## Relationships To Show

Keep only relationships that communicate backend design:

- `AuthController -> AuthService`
- `AuthController -> UsersService`
- `AuthService -> UsersService`
- `AuthService -> NotificationService` for password reset notification
- `AppointmentController -> AppointmentService`
- `QuestionController -> QuestionService`
- `ConsultationController -> ConsultationService`
- `ConsultationGateway -> ConsultationService`
- `NotificationScheduler -> NotificationService`
- `NotificationService -> NotificationProvider`
- `DevelopmentNotificationProvider ..|> NotificationProvider`
- `EmailNotificationProvider ..|> NotificationProvider`
- `SmsNotificationProvider ..|> NotificationProvider`
- `ModerationController -> ModerationService`
- `ReportingController -> ReportingService`
- Major services `-> PrismaService`
- `AppointmentService ..> OutboxEvent`
- `QuestionService ..> OutboxEvent`
- `NotificationService ..> NotificationLog`

## Classes To Exclude

Exclude these from the report figure:

- DTOs, request/response types, query DTOs, validation classes.
- Decorators such as `@Roles`, `@CurrentUser`, `@Ownership`.
- Generated Prisma Client types.
- Full Prisma model set: `User`, `PatientProfile`, `DoctorProfile`, `Appointment`, `ConsultationSession`, `Prescription`, `Rating`, etc. These belong in ERD.
- Simple CRUD-only controller/service pairs if space is tight: `PatientController/PatientService`, `DoctorController/DoctorService`, `DiscoveryController/DiscoveryService`, `SpecialtyController/SpecialtyService`, `OperationsController/OperationsService`.
- Test classes/spec files.
- Frontend classes/components; frontend structure belongs in Architecture Overview or separate frontend documentation.

## Final Decision

Use `KEEP_SIMPLIFIED`.

Do not insert the current full `docs/architecture/class-diagram.md` directly into the graduation report. Instead, create or export a simplified backend class diagram using the limited scope above. The simplified diagram should complement:

- Architecture Overview: explains modules, runtime boundaries, frontend/backend/data layer.
- ERD: explains database entities and cardinality.
- Sequence Diagrams: explain runtime flows such as login, booking, realtime chat, prescription, moderation, and outbox notification.

The class diagram should answer one narrow question:

> Which backend classes represent the main NestJS collaboration patterns in the final implementation?
