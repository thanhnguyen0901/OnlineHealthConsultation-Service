# De cuong bao cao tot nghiep

De tai chinh thuc: **Thiet ke va xay dung he thong ho tro tu van suc khoe va quan ly lich hen truc tuyen**

Tai lieu nay la **de cuong viet bao cao**, khong phai noi dung bao cao hoan chinh.

## Nguyen tac nguon su that

| Pham vi noi dung | Nguon su that chinh | Cach su dung |
|---|---|---|
| Phan tich yeu cau | `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md` | Mo ta yeu cau theo SRS; khong sua yeu cau de khop voi implementation. |
| Truy vet yeu cau | `docs/audit/final-srs-traceability.md` | Dung de biet yeu cau nao da hoan thanh, partial, khac cach trien khai, optional hoac ngoai pham vi. |
| Kien truc va implementation | Source code hien tai trong `OnlineHealthConsultation-Service/src`, `OnlineHealthConsultation-Web/src` | Source code la nguon cuoi cung cho thiet ke ky thuat va noi dung xay dung. |
| Kiem chung implementation | `graphify-out/GRAPH_REPORT.md`, `graphify-out/graph.json`, `graphify-out/manifest.json` | Dung de cross-check module, class, dependency hub va cac thanh phan thuc te. Khong dung de thay the source code. |
| Co so du lieu | `prisma/schema.prisma`, migrations va database export thuc te | ERD phai export truc tiep tu database/Prisma schema cuoi cung. |
| Kiem thu | `docs/testing/final-e2e-results.md`, `docs/testing/e2e-test-matrix.md`, test source | Chi ghi ket qua co that; khong claim graduation suite PASS khi tai lieu ket qua ghi chua PASS. |
| Diagram dua vao bao cao | `docs/report/diagram-selection/*`, `docs/architecture/system-flow-diagram.md` | Chi dung cac diagram da duoc chon; khong dua tat ca diagram hien co vao bao cao. |

## Nguyen tac tranh trung lap giua cac chuong

| Chuong | So huu noi dung |
|---|---|
| Chuong 1 | Ly do chon de tai, muc tieu, pham vi, doi tuong su dung, phuong phap thuc hien. |
| Chuong 2 | Nen tang ly thuyet va cong nghe duoc dung de xay dung he thong. |
| Chuong 3 | **WHAT**: he thong can lam gi theo SRS, actor, use case, luong nghiep vu, yeu cau chuc nang/phi chuc nang. |
| Chuong 4 | **HOW DESIGNED**: kien truc, module, co so du lieu, bao mat, runtime flow thiet ke. |
| Chuong 5 | **HOW IMPLEMENTED**: source code, cau truc frontend/backend, API/realtime, trien khai, mot so man hinh/chuc nang da xay dung. |
| Chuong 6 | **WHETHER IT WORKS**: chien luoc kiem thu, ket qua thuc te, danh gia muc do dap ung, han che kiem thu. |
| Chuong 7 | Ket luan, dong gop, han che, huong phat trien. |

## Danh muc hinh du kien

| Ma hinh | Ten hinh | Chuong | Nguon |
|---|---|---|---|
| Hinh 3.1 | Bieu do Use Case cua khach truy cap | 3 | `docs/report/diagram-selection/plantuml/use-case/use-case-guest.puml` |
| Hinh 3.2 | Bieu do Use Case cua benh nhan | 3 | `docs/report/diagram-selection/plantuml/use-case/use-case-patient.puml` |
| Hinh 3.3 | Bieu do Use Case cua bac si | 3 | `docs/report/diagram-selection/plantuml/use-case/use-case-doctor.puml` |
| Hinh 3.4 | Bieu do Use Case cua quan tri vien | 3 | `docs/report/diagram-selection/plantuml/use-case/use-case-admin.puml` |
| Hinh 3.5 | System Flow Diagram | 3 | `docs/architecture/system-flow-diagram.md` |
| Hinh 4.1 | Architecture Overview | 4 | Approved Architecture Overview diagram, `docs/architecture/system-architecture.md` |
| Hinh 4.2 | ERD cua co so du lieu | 4 | Export truc tiep tu database/Prisma schema cuoi cung |
| Hinh 4.3 | So do lop backend rut gon | 4 | Chi them neu export theo quyet dinh `KEEP_SIMPLIFIED` |
| Hinh 4.4 | Bieu do tuan tu dang nhap nguoi dung | 4 | `docs/report/diagram-selection/sequences/sequence-login.md` |
| Hinh 4.5 | Bieu do tuan tu dat lich tu van | 4 | `docs/report/diagram-selection/sequences/sequence-book-appointment.md` |
| Hinh 4.6 | Bieu do tuan tu chat realtime trong phien tu van | 4 | `docs/report/diagram-selection/sequences/sequence-consultation-chat.md` |
| Hinh 4.7 | Bieu do tuan tu tao don thuoc sau tu van | 4 | `docs/report/diagram-selection/sequences/sequence-create-prescription.md` |
| Hinh 4.8 | Bieu do tuan tu kiem duyet cau hoi va phan hoi | 4 | `docs/report/diagram-selection/sequences/sequence-admin-moderation.md` |
| Hinh 4.9 | Bieu do tuan tu xu ly thong bao bat dong bo qua outbox | 4 | `docs/report/diagram-selection/sequences/sequence-notification-outbox.md` |

## Danh muc bang du kien

| Ma bang | Ten bang | Chuong | Ghi chu |
|---|---|---|---|
| Bang 1.1 | Muc tieu va ket qua mong doi cua de tai | 1 | Tom tat ngan, tranh lap noi dung SRS. |
| Bang 2.1 | Cong nghe su dung trong he thong | 2 | React, NestJS, Prisma, PostgreSQL, Socket.IO, Redux Saga, Playwright. |
| Bang 3.1 | Danh sach tac nhan va vai tro | 3 | Theo SRS. |
| Bang 3.2 | Tom tat nhom yeu cau chuc nang | 3 | Theo SRS, co mapping UC/nhom chuc nang. |
| Bang 3.3 | Yeu cau phi chuc nang va rang buoc | 3 | Theo SRS, khong bien thanh ket qua implementation. |
| Bang 4.1 | Module backend va trach nhiem | 4 | Theo source + architecture doc. |
| Bang 4.2 | Nhom bang/entity co so du lieu | 4 | Theo Prisma schema. |
| Bang 5.1 | Cau truc source code chinh | 5 | FE/BE folder/module summary. |
| Bang 5.2 | API/realtime entry point tieu bieu | 5 | Chi liet ke nhom endpoint/event, khong dump toan bo Swagger. |
| Bang 6.1 | Ma tran kiem thu tong hop | 6 | Tom tat tu e2e test matrix. |
| Bang 6.2 | Ket qua kiem thu thuc te | 6 | Phai khop `final-e2e-results.md`. |
| Bang 6.3 | Muc do dap ung yeu cau cot loi | 6 | Dua tren traceability va ket qua test. |

---

# CHUONG 1. TONG QUAN DE TAI

## 1.1 Ly do chon de tai

- Muc dich: Dat van de ve nhu cau tu van suc khoe truc tuyen, tim kiem bac si va quan ly lich hen tren nen web.
- Noi dung can viet: Boi canh, kho khan cua quy trinh dat lich/tu van truyen thong, nhu cau he thong ho tro online, gioi han he thong chi mang tinh ho tro/tham khao y te.
- Nguon chinh: SRS muc `1.1 Muc dich`, `1.2 Pham vi san pham`, README backend/frontend.
- Nguon ho tro: Traceability summary, system flow doc.
- Hinh: Khong.
- Bang: Khong.
- Loai noi dung: Requirement.

## 1.2 Muc tieu de tai

- Muc dich: Neu ro muc tieu xay dung san pham va muc tieu ky thuat.
- Noi dung can viet: Xay dung web app cho Guest/Patient/Doctor/Admin; dat lich, hoi dap suc khoe, tu van realtime chat, ket qua/don thuoc, rating, moderation, notification, reporting.
- Nguon chinh: SRS muc pham vi chuc nang bat buoc.
- Nguon ho tro: README backend/frontend.
- Hinh: Khong.
- Bang: Bang 1.1.
- Loai noi dung: Requirement.

## 1.3 Pham vi va doi tuong su dung

- Muc dich: Xac dinh ro pham vi lam va khong lam.
- Noi dung can viet: Bon nhom nguoi dung Guest, Patient, Doctor, Administrator; external boundaries Notification Service, Video Communication Service, File Storage Service; phan biet bat buoc, tuy chon/mo rong, ngoai pham vi.
- Nguon chinh: SRS muc `1.3`, `1.4`, `2. Tac nhan`.
- Nguon ho tro: Traceability cac muc optional/out-of-scope.
- Hinh: Khong.
- Bang: Bang actor neu can rut gon sang Chuong 3 thi khong lap lai chi tiet.
- Loai noi dung: Requirement.

## 1.4 Phuong phap thuc hien

- Muc dich: Tom tat cach thuc phan tich, thiet ke, xay dung va kiem thu.
- Noi dung can viet: Phan tich yeu cau bang SRS/use case; thiet ke modular monolith, ERD, sequence; xay dung React/NestJS/PostgreSQL; kiem thu bang Jest/Playwright va traceability audit.
- Nguon chinh: Final docs, README, architecture docs, testing docs.
- Nguon ho tro: Graphify report de noi da cross-check cau truc source.
- Hinh: Khong.
- Bang: Khong.
- Loai noi dung: Current implementation + evaluation.

## 1.5 Bo cuc bao cao

- Muc dich: Gioi thieu cau truc 7 chuong.
- Noi dung can viet: 1-2 cau cho moi chuong, dung dung topic ownership o dau tai lieu nay.
- Nguon chinh: Cau truc bao cao duoc yeu cau.
- Nguon ho tro: Khong.
- Hinh: Khong.
- Bang: Khong.
- Loai noi dung: Requirement.

---

# CHUONG 2. CO SO LY THUYET VA CONG NGHE

## 2.1 Tong quan he thong tu van suc khoe truc tuyen

- Muc dich: Dat nen tang nghiep vu cho he thong online consultation/appointment.
- Noi dung can viet: Khai niem tu van truc tuyen, dat lich tu van, chat realtime, nhac lich, bao mat du lieu suc khoe, gioi han khong thay the cap cuu/kham truc tiep.
- Nguon chinh: SRS muc muc dich, constraints va disclaimer trong README.
- Nguon ho tro: Traceability constraint medical disclaimer.
- Hinh: Khong.
- Bang: Khong.
- Loai noi dung: Requirement.

## 2.2 Kien truc ung dung web client-server

- Muc dich: Giai thich co so client-server/web SPA phuc vu thiet ke.
- Noi dung can viet: Browser, React SPA, REST API, realtime Socket.IO, backend application, database.
- Nguon chinh: `docs/architecture/system-architecture.md`.
- Nguon ho tro: README backend/frontend.
- Hinh: Khong; Architecture Overview de danh cho Chuong 4.
- Bang: Khong.
- Loai noi dung: Current implementation.

## 2.3 Cong nghe frontend

- Muc dich: Trinh bay cac cong nghe UI da chon.
- Noi dung can viet: React 18, TypeScript, Vite, React Router, Redux Toolkit, Redux Saga, Axios, Socket.IO client, Tailwind CSS, PrimeReact, Formik/Yup, i18next.
- Nguon chinh: `OnlineHealthConsultation-Web/README.md`, `OnlineHealthConsultation-Web/package.json`.
- Nguon ho tro: Frontend source under `src`.
- Hinh: Khong.
- Bang: Bang 2.1.
- Loai noi dung: Current implementation.

## 2.4 Cong nghe backend va database

- Muc dich: Trinh bay nen tang server va persistence.
- Noi dung can viet: Node.js, NestJS, TypeScript, Prisma ORM, PostgreSQL, JWT, bcrypt, validation pipe, Swagger, node-cron.
- Nguon chinh: `OnlineHealthConsultation-Service/README.md`, `package.json`, `prisma/schema.prisma`, architecture doc.
- Nguon ho tro: Source code `src/main.ts`, `src/app.module.ts`.
- Hinh: Khong.
- Bang: Bang 2.1.
- Loai noi dung: Current implementation.

## 2.5 Cong cu phat trien va kiem thu

- Muc dich: Mo ta cong cu ho tro dam bao chat luong.
- Noi dung can viet: Jest cho backend unit/service tests, Playwright cho E2E, Docker Compose PostgreSQL, Prisma migrations/seed, Graphify de phan tich/cross-check codebase.
- Nguon chinh: README, `docs/testing/*`, Graphify outputs.
- Nguon ho tro: `jest.config.js`, `playwright.config.ts`, docker-compose.
- Hinh: Khong.
- Bang: Bang 2.1.
- Loai noi dung: Current implementation + evaluation.

---

# CHUONG 3. PHAN TICH YEU CAU HE THONG

## 3.1 Mo ta bai toan va pham vi he thong

- Muc dich: Mo ta he thong can giai quyet bai toan gi theo SRS.
- Noi dung can viet: He thong web ho tro public discovery, auth/RBAC, profile, question, appointment, consultation chat/mock video, prescription, rating, admin, notification, reporting.
- Nguon chinh: SRS muc `1.2`, `1.3`.
- Nguon ho tro: Traceability chi dung de ghi chu muc optional/ngoai pham vi.
- Hinh: Khong.
- Bang: Bang 3.2.
- Loai noi dung: Requirement.

## 3.2 Tac nhan he thong

- Muc dich: Xac dinh actor va external system boundary.
- Noi dung can viet: Guest User, Patient, Doctor, Administrator; Notification Service, Video Communication Service, File Storage Service. Neu ro external service la boundary yeu cau, khong dong nghia da co provider production.
- Nguon chinh: SRS muc `2. Tac nhan`.
- Nguon ho tro: Use case selection notes.
- Hinh: Khong.
- Bang: Bang 3.1.
- Loai noi dung: Requirement.

## 3.3 Yeu cau chuc nang

- Muc dich: Tong hop nhom chuc nang theo SRS.
- Noi dung can viet: Public access, auth/authorization, profile, specialty, doctor discovery, health question, appointment, consultation session, result/prescription, rating, notification, admin, reports/statistics.
- Nguon chinh: SRS cac muc chuc nang.
- Nguon ho tro: Final traceability de biet trang thai dap ung, nhung khong sua noi dung yeu cau.
- Hinh: Khong.
- Bang: Bang 3.2.
- Loai noi dung: Requirement.

## 3.4 Yeu cau phi chuc nang va rang buoc

- Muc dich: Ghi nhan cac yeu cau chat luong va constraints.
- Noi dung can viet: Security/auth, privacy/PHI, audit log, performance target, maintainability, responsive UI, browser support, platform constraints React/Node/PostgreSQL, optional provider constraints.
- Nguon chinh: SRS non-functional requirements va constraints.
- Nguon ho tro: Traceability de ghi chu muc nao partial/chua co bang chung.
- Hinh: Khong.
- Bang: Bang 3.3.
- Loai noi dung: Requirement.

## 3.5 Bieu do Use Case

- Muc dich: Minh hoa pham vi chuc nang theo actor.
- Noi dung can viet: Gioi thieu ngan gon bo 4 diagram duoc chon va ly do khong dua Overall System diagram vi qua day/lap.
- Nguon chinh: `docs/report/diagram-selection/use-case-selection.md`, SRS use case IDs.
- Nguon ho tro: `docs/diagrams/use-case-diagrams.md`, traceability.
- Hinh: Hinh 3.1, 3.2, 3.3, 3.4.
- Bang: Khong, hoac bang mapping actor -> use case neu can.
- Loai noi dung: Requirement.

## 3.6 Luong nghiep vu tong the

- Muc dich: Cho nguoi doc thay hanh trinh tu Guest den Patient/Doctor/Admin.
- Noi dung can viet: Public discovery -> auth -> patient profile -> select doctor -> availability -> booking -> doctor confirmation -> consultation -> summary/prescription -> result/rating; supporting question flow; notification support; admin governance.
- Nguon chinh: `docs/architecture/system-flow-diagram.md`, SRS business flows.
- Nguon ho tro: Traceability, architecture doc.
- Hinh: Hinh 3.5 System Flow Diagram.
- Bang: Khong.
- Loai noi dung: Requirement.

## 3.7 Gioi han pham vi va cac muc khong dua vao bao cao nhu chuc nang hien tai

- Muc dich: Tranh hieu nham ve SMS/video/file/chatbot/AI.
- Noi dung can viet: Production SMS optional/provider-dependent; external advanced video optional, hien chi nen giai thich chat/mock/fallback khi sang implementation; file upload/storage chua thuoc submitted scope; chatbot va AI diagnosis ngoai/optional.
- Nguon chinh: SRS optional/out-of-scope.
- Nguon ho tro: Traceability, system flow scope notes, file attachment scope decision neu can.
- Hinh: Khong.
- Bang: Khong.
- Loai noi dung: Requirement + future work boundary.

---

# CHUONG 4. THIET KE HE THONG

## 4.1 Dinh huong kien truc tong the

- Muc dich: Giai thich thiet ke high-level cua he thong.
- Noi dung can viet: React SPA, NestJS modular monolith, REST API, Socket.IO namespace `/consultations`, Prisma/PostgreSQL, in-process scheduler, provider boundaries, deployment Vercel/Railway/PostgreSQL.
- Nguon chinh: Source code hien tai, `docs/architecture/system-architecture.md`.
- Nguon ho tro: Graphify report hubs, README.
- Hinh: Hinh 4.1 Architecture Overview.
- Bang: Khong.
- Loai noi dung: Current implementation.

## 4.2 Thiet ke frontend

- Muc dich: Mo ta to chuc frontend o muc thiet ke, khong di vao tung component UI.
- Noi dung can viet: Feature-based folders, route guards, auth bootstrap, Redux store/root saga, feature API clients, shared `apiClient`, i18n, consultation realtime client/hook.
- Nguon chinh: `OnlineHealthConsultation-Web/src`, frontend README.
- Nguon ho tro: Architecture doc, Graphify nodes `routes.tsx`, `rootSaga.ts`, `store.ts`, `ConsultationSocketClient`.
- Hinh: Khong.
- Bang: Co the dua vao Bang 5.1 neu muon tranh lap; o Chuong 4 chi mo ta conceptual.
- Loai noi dung: Current implementation.

## 4.3 Thiet ke backend theo modular monolith

- Muc dich: Trinh bay module backend va trach nhiem.
- Noi dung can viet: Identity, Discovery, Patient, Doctor, Specialty, Appointment, Question, Consultation, Notification, Moderation, Reporting, Operations, Prisma. Neu ro controller -> service -> Prisma pattern.
- Nguon chinh: Source `src/app.module.ts`, modules under `src/modules`, architecture doc.
- Nguon ho tro: Graphify report hub `AppointmentService`, `NotificationService`, `AuthController`, `ConsultationGateway`, `PrismaService`.
- Hinh: Hinh 4.3 neu so do lop rut gon duoc export.
- Bang: Bang 4.1.
- Loai noi dung: Current implementation.

## 4.4 Thiet ke co so du lieu

- Muc dich: Giai thich data model va quan he chinh.
- Noi dung can viet: PostgreSQL, Prisma models/enums; nhom identity/session/audit, profile/discovery, question/moderation, appointment/consultation, prescription/rating, notification/outbox, file attachment dormant. Nhac ERD phai export truc tiep tu final database/schema.
- Nguon chinh: `prisma/schema.prisma`, migrations, actual database export.
- Nguon ho tro: `docs/architecture/database-erd.md`.
- Hinh: Hinh 4.2 ERD.
- Bang: Bang 4.2.
- Loai noi dung: Current implementation.

## 4.5 Thiet ke xac thuc, phan quyen va bao mat truy cap

- Muc dich: Mo ta auth/RBAC/ownership o muc thiet ke.
- Noi dung can viet: JWT access token, refresh token HttpOnly cookie, `UserSession`, bcrypt password, `JwtAuthGuard`, `RolesGuard`, `OwnershipGuard`, service-level ownership, global validation, exception filter, audit log.
- Nguon chinh: Source `identity`, `common/guards`, `common/filters`, architecture doc.
- Nguon ho tro: Traceability security requirements, security hardening report neu can.
- Hinh: Hinh 4.4 login sequence.
- Bang: Co the co bang guard/mechanism neu can.
- Loai noi dung: Current implementation.

## 4.6 Thiet ke phan he lich hen

- Muc dich: Mo ta design cho booking/availability/lifecycle.
- Noi dung can viet: Doctor schedule JSON, availability API, active/approved doctor rule, conflict prevention cho doctor va patient, appointment statuses, transaction Serializable cho create/reschedule, outbox/audit side effects.
- Nguon chinh: `src/modules/appointment`, Prisma `Appointment`, architecture doc.
- Nguon ho tro: Traceability appointment requirements, Graphify `AppointmentService`.
- Hinh: Hinh 4.5 book appointment sequence.
- Bang: Co the co bang status appointment.
- Loai noi dung: Current implementation.

## 4.7 Thiet ke phan he tu van realtime va ket qua tu van

- Muc dich: Mo ta design consultation runtime.
- Noi dung can viet: Consultation session lifecycle, Socket.IO auth/room, persisted `ConsultationMessage`, chat broadcast, summary, prescription, rating, video channel la boundary/fallback khong phai provider production.
- Nguon chinh: `src/modules/consultation`, frontend consultation realtime source, Prisma session/message/prescription/rating.
- Nguon ho tro: Sequence selection, architecture doc.
- Hinh: Hinh 4.6 realtime chat; Hinh 4.7 create prescription.
- Bang: Co the co bang consultation status/channel neu can.
- Loai noi dung: Current implementation.

## 4.8 Thiet ke hoi dap suc khoe, kiem duyet va quan tri

- Muc dich: Giai thich luong question-answer va moderation/admin.
- Noi dung can viet: Patient question, doctor answer, answer approval, moderation queue/actions, admin management users/doctors/patients/specialties/appointments, reporting dashboard.
- Nguon chinh: Source `question`, `moderation`, `identity/admin-user`, `specialty`, `reporting`, `admin` frontend.
- Nguon ho tro: Traceability, sequence selection.
- Hinh: Hinh 4.8 admin moderation sequence.
- Bang: Co the co bang moderation content/action neu can.
- Loai noi dung: Current implementation.

## 4.9 Thiet ke thong bao bat dong bo

- Muc dich: Mo ta outbox/scheduler/provider boundary.
- Noi dung can viet: Domain operation -> `OutboxEvent` -> `NotificationScheduler` -> `NotificationService` -> `NotificationLog` -> provider boundary; events `APPOINTMENT_CREATED`, `APPOINTMENT_CONFIRMED`, `QUESTION_ANSWERED`; reminder cron; email/SMS provider production chua cau hinh.
- Nguon chinh: Source `src/modules/notification`, architecture doc.
- Nguon ho tro: Traceability notification status.
- Hinh: Hinh 4.9 notification outbox sequence.
- Bang: Co the co bang event type -> recipient.
- Loai noi dung: Current implementation.

## 4.10 Quyet dinh thiet ke va trade-off

- Muc dich: Lam ro vi sao chon thiet ke hien tai va gioi han cua no.
- Noi dung can viet: Modular monolith, single PostgreSQL, Prisma, Socket.IO, database-backed outbox, in-process scheduler, operational reporting, provider abstraction. Neu ro trade-off scaling multi-instance, worker tach rieng, reporting load.
- Nguon chinh: `docs/architecture/system-architecture.md`.
- Nguon ho tro: Graphify report, source code.
- Hinh: Khong.
- Bang: Co the co bang decision/trade-off.
- Loai noi dung: Current implementation + future work boundary.

---

# CHUONG 5. XAY DUNG VA TRIEN KHAI HE THONG

## 5.1 Moi truong va cau truc du an

- Muc dich: Mo ta cach source code duoc to chuc va moi truong chay.
- Noi dung can viet: Hai project `OnlineHealthConsultation-Web` va `OnlineHealthConsultation-Service`; Node/TypeScript; local PostgreSQL Docker Compose; Prisma generate/migrate/seed; Vite dev frontend.
- Nguon chinh: README backend/frontend, package scripts.
- Nguon ho tro: `docker-compose.yml`, `railway.json`, `vercel.json`.
- Hinh: Khong.
- Bang: Bang 5.1.
- Loai noi dung: Current implementation.

## 5.2 Xay dung backend

- Muc dich: Trinh bay nhung phan backend da implement.
- Noi dung can viet: Global prefix `/api`, Swagger, validation, exception filter, request logging; cac module REST; service layer; Prisma data access; notification scheduler; Socket.IO gateway.
- Nguon chinh: Source backend, backend README.
- Nguon ho tro: Architecture doc, Graphify report.
- Hinh: Khong; khong lap lai Architecture Overview.
- Bang: Bang 5.2 voi nhom endpoint tieu bieu.
- Loai noi dung: Current implementation.

## 5.3 Xay dung frontend

- Muc dich: Trinh bay UI/workspace da implement.
- Noi dung can viet: Public pages, auth pages, patient workspace, doctor workspace, admin workspace, reports page, shared layouts/components, i18n vi/en, responsive styling.
- Nguon chinh: Source frontend, frontend README.
- Nguon ho tro: Traceability evidence FE pages.
- Hinh: Co the chen screenshot man hinh neu sau nay co yeu cau; hien tai outline khong bat buoc.
- Bang: Bang 5.1 hoac bang route -> page neu can.
- Loai noi dung: Current implementation.

## 5.4 Xay dung cac luong nghiep vu chinh

- Muc dich: Mo ta implementation theo workflow thay vi chi theo folder.
- Noi dung can viet: Public doctor discovery; register/login/logout/refresh; patient question -> doctor answer; booking/confirm/complete/cancel; consultation chat -> summary/prescription; rating; admin moderation/reporting; notification outbox.
- Nguon chinh: Source code FE/BE.
- Nguon ho tro: Traceability core journey verification, README.
- Hinh: Khong; sequence da o Chuong 4.
- Bang: Co the bang workflow -> modules -> UI pages.
- Loai noi dung: Current implementation.

## 5.5 Trien khai va cau hinh

- Muc dich: Mo ta cach he thong duoc chay/deploy theo cau hinh source.
- Noi dung can viet: Backend Railway config, frontend Vercel SPA rewrite, PostgreSQL qua `DATABASE_URL`, env validation, CORS, API base URL, healthcheck `/api/health`.
- Nguon chinh: `railway.json`, `vercel.json`, README, `validate-env.ts`.
- Nguon ho tro: Deployment production readiness doc neu can.
- Hinh: Khong; neu co deployment diagram thi khong lap Architecture Overview qua chi tiet.
- Bang: Bang env/config chinh neu can.
- Loai noi dung: Current implementation.

## 5.6 Du lieu mau va van hanh thu nghiem

- Muc dich: Mo ta seed/demo/e2e data de phuc vu test va demo.
- Noi dung can viet: Demo accounts admin/patient/doctor, specialties, appointments, consultation sessions, questions, ratings, notification logs; phan biet `prisma:seed` va `db:seed:e2e`.
- Nguon chinh: Backend README, `prisma/seed.ts`, `prisma/seed-e2e.ts`.
- Nguon ho tro: Final E2E results environment.
- Hinh: Khong.
- Bang: Co the co bang demo account.
- Loai noi dung: Current implementation.

---

# CHUONG 6. KIEM THU VA DANH GIA

## 6.1 Muc tieu va pham vi kiem thu

- Muc dich: Neu ro kiem thu nham xac minh luong cot loi va yeu cau nao.
- Noi dung can viet: Guest, Patient, Doctor, Admin, Auth/Security, Notification, responsive; phan biet unit/service tests va Playwright E2E.
- Nguon chinh: `docs/testing/e2e-test-matrix.md`.
- Nguon ho tro: Test source trong backend/frontend.
- Hinh: Khong.
- Bang: Bang 6.1.
- Loai noi dung: Evaluation.

## 6.2 Moi truong kiem thu

- Muc dich: Ghi lai moi truong dung de chay ket qua thuc te.
- Noi dung can viet: Ngay 2026-08-20, backend, frontend, Docker PostgreSQL `health_consultation_db`, backend URL `http://localhost:4000/api`, frontend URL `http://localhost:5173`, Playwright Chromium, `E2E_RUN_SEEDED=true`.
- Nguon chinh: `docs/testing/final-e2e-results.md`.
- Nguon ho tro: README setup.
- Hinh: Khong.
- Bang: Co the co bang environment.
- Loai noi dung: Evaluation.

## 6.3 Ket qua kiem thu thuc te

- Muc dich: Bao cao trung thuc ket qua da chay.
- Noi dung can viet: Core smoke/auth/appointment/question/doctor/admin/socket suites: 43 total, 42 passed, 0 failed, 1 skipped. Graduation suite: khong claim PASS; co loi test-data/test-interaction/assertion theo tai lieu. GRAD-D passed isolated.
- Nguon chinh: `docs/testing/final-e2e-results.md`.
- Nguon ho tro: Playwright specs neu can.
- Hinh: Khong.
- Bang: Bang 6.2.
- Loai noi dung: Evaluation.

## 6.4 Danh gia muc do dap ung yeu cau

- Muc dich: Lien ket ket qua implementation va test voi SRS.
- Noi dung can viet: Core flows da completed theo traceability; cac muc partial nhu production email, HTTPS deployment proof, performance/load/cross-browser evidence, responsive final visual evidence, production SMS/video provider. Khong bien partial thanh completed.
- Nguon chinh: `docs/audit/final-srs-traceability.md`.
- Nguon ho tro: `docs/testing/final-e2e-results.md`.
- Hinh: Khong.
- Bang: Bang 6.3.
- Loai noi dung: Evaluation.

## 6.5 Phan tich cac loi/gioi han kiem thu

- Muc dich: Giai thich cac diem chua the claim pass va nguyen nhan.
- Noi dung can viet: Sandbox Prisma issue da xu ly bang approval; GRAD-A fixed relative slot conflict do seed/test data; GRAD-B end button bi disabled do test interaction; GRAD-C test expect title trong khi UI hien content/answer; 1 core test skipped.
- Nguon chinh: `docs/testing/final-e2e-results.md`.
- Nguon ho tro: E2E test source.
- Hinh: Khong.
- Bang: Co the co bang issue -> classification -> action.
- Loai noi dung: Evaluation.

## 6.6 Danh gia chung

- Muc dich: Ket luan ve tinh san sang cua he thong o muc core-flow.
- Noi dung can viet: Local environment start/migrate/seed/health ok; core E2E largely green; graduation suite can sua test spec truoc khi claim full automated PASS; he thong dap ung core flow nhung external provider/performance/cross-browser can bo sung neu muon production-grade.
- Nguon chinh: Final E2E results, traceability.
- Nguon ho tro: README/deployment docs.
- Hinh: Khong.
- Bang: Khong.
- Loai noi dung: Evaluation.

---

# CHUONG 7. KET LUAN VA HUONG PHAT TRIEN

## 7.1 Ket qua dat duoc

- Muc dich: Tong ket nhung gi da xay dung.
- Noi dung can viet: Web app React/NestJS/PostgreSQL; public discovery, auth/RBAC, profile, questions, appointment, consultation chat, summary/prescription, rating, admin/moderation/reporting, notification outbox, test coverage core flows.
- Nguon chinh: Traceability completed core journeys, README, final source.
- Nguon ho tro: Testing results.
- Hinh: Khong.
- Bang: Khong.
- Loai noi dung: Current implementation + evaluation.

## 7.2 Han che

- Muc dich: Neu ro cac gioi han con lai, khong che giau.
- Noi dung can viet: Email provider production phu thuoc cau hinh, SMS optional, video provider real chua co, file upload/storage chua implemented, performance/load/cross-browser evidence chua day du, graduation E2E spec can sua truoc khi claim pass.
- Nguon chinh: Traceability partial/not implemented/not applicable, final E2E results, system architecture external boundaries.
- Nguon ho tro: File attachment scope decision.
- Hinh: Khong.
- Bang: Khong.
- Loai noi dung: Evaluation + future work.

## 7.3 Huong phat trien

- Muc dich: De xuat phat trien tiep dua tren gioi han thuc te.
- Noi dung can viet: Production email/SMS vendor, concrete video provider/WebRTC, file attachment/object storage, Redis/Socket.IO adapter cho multi-instance, dedicated notification worker, analytics/read model, load/cross-browser/responsive test, fix graduation E2E suite.
- Nguon chinh: `docs/architecture/system-architecture.md` future evolution, traceability, final E2E results.
- Nguon ho tro: Deployment docs.
- Hinh: Khong.
- Bang: Khong.
- Loai noi dung: Future work.

## 7.4 Ket luan chung

- Muc dich: Dong bao cao bang nhan dinh ngan gon ve muc do hoan thanh de tai.
- Noi dung can viet: He thong da dap ung phan lon core requirements cua de tai trong pham vi web platform; cac gioi han con lai nam chu yeu o production provider, evidence phi chuc nang va automation graduation suite.
- Nguon chinh: Traceability + testing result.
- Nguon ho tro: SRS scope.
- Hinh: Khong.
- Bang: Khong.
- Loai noi dung: Evaluation.

---

## Checklist khi viet bao cao hoan chinh

- Khong dua Overall Use Case diagram vao bao cao vi bi selection doc loai.
- Khong dua tat ca 48 sequence diagrams vao bao cao; chi dung 6 diagram da chon.
- Khong dua class diagram day du hien tai vao bao cao; neu dung thi tao/export ban backend rut gon theo `KEEP_SIMPLIFIED`.
- ERD phai export tu final database/Prisma schema, khong ve tay theo tri nho.
- Chuong 3 khong sua yeu cau theo implementation.
- Chuong 4 va 5 phai theo source code hien tai, co Graphify cross-check.
- Chuong 6 chi ghi ket qua test co that; khong invent PASS.
- Video, SMS, file storage, chatbot, AI diagnosis phai duoc dien giai dung pham vi optional/out-of-scope/future work.
