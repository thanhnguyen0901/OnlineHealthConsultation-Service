# Prompt vẽ 15 hình báo cáo giữa kỳ

**Mermaid** → paste vào [mermaid.live](https://mermaid.live) → tải PNG  
**PlantUML** → paste vào [plantuml.com](https://www.plantuml.com/plantuml/form) → Generate PNG  
**draw.io** → Extras → Edit Diagram → paste Mermaid code

---

## Hình 1 — Quy trình nghiệp vụ tổng quan

```mermaid
flowchart TD
    Start([Người dùng]) --> A[Truy cập nền tảng]
    A --> B[Xem trang chủ & tìm kiếm bác sĩ]
    B --> C{Đã có\ntài khoản?}
    C -->|Chưa| D[Đăng ký tài khoản Patient]
    C -->|Rồi| E[Đăng nhập]
    D --> E
    E --> F{Chọn\nnghiệp vụ}
    F -->|Hỏi đáp| G[Patient gửi câu hỏi sức khỏe]
    F -->|Đặt lịch| H[Patient chọn bác sĩ & khung giờ]
    G --> I[Doctor nhận & phản hồi câu hỏi]
    I --> J[Patient xem phản hồi]
    H --> K[Hệ thống tạo lịch hẹn]
    K --> L[Notification: xác nhận lịch]
    L --> M[Doctor bắt đầu phiên tư vấn]
    M --> N[Patient & Doctor trao đổi chat/video]
    N --> O[Doctor ghi kết quả & đơn thuốc]
    O --> P[Patient xem kết quả & đánh giá]
    P --> Q[Administrator giám sát & thống kê]
    J --> Q
```

---

## Hình 2 — Use case tổng quan toàn hệ thống

```plantuml
@startuml
left to right direction
skinparam actorStyle awesome
skinparam packageStyle rectangle

actor "Guest User" as GU
actor "Patient" as PA
actor "Doctor" as DC
actor "Administrator" as AD
actor "Notification\nService" as NS <<external>>
actor "Video Service" as VS <<external>>
actor "File Storage" as FS <<external>>

rectangle "Online Health Consultation Platform" {
  usecase "Public Discovery" as PD
  usecase "Authentication &\nAuthorization" as AUTH
  usecase "Patient Profile" as PP
  usecase "Doctor Profile" as DP
  usecase "Specialty Management" as SM
  usecase "Health Question\n& Answer" as HQ
  usecase "Appointment\nManagement" as AP
  usecase "Consultation\nSession" as CS
  usecase "Result &\nPrescription" as RP
  usecase "Rating &\nFeedback" as RF
  usecase "Notification" as NT
  usecase "Administration &\nReporting" as AR
}

GU --> PD
GU --> AUTH
PA --> AUTH
PA --> PP
PA --> PD
PA --> HQ
PA --> AP
PA --> CS
PA --> RP
PA --> RF
PA --> NT
DC --> AUTH
DC --> DP
DC --> HQ
DC --> AP
DC --> CS
DC --> RP
AD --> AUTH
AD --> SM
AD --> AP
AD --> AR
NT --> NS
CS --> VS
CS --> FS
RP --> FS
@enduml
```

---

## Hình 3 — Use case diagram nhóm Guest User

```plantuml
@startuml
left to right direction
skinparam actorStyle awesome

actor "Guest User" as GU

rectangle "Public Access" {
  usecase "UC-G-01\nXem trang chủ &\nthông tin nền tảng" as G01
  usecase "UC-G-02\nXem danh sách\nchuyên khoa" as G02
  usecase "UC-G-03\nXem danh sách bác sĩ" as G03
  usecase "UC-G-04\nXem hồ sơ công\nkhai bác sĩ" as G04
  usecase "UC-G-05\nTìm kiếm bác sĩ theo\nchuyên khoa / từ khóa" as G05
  usecase "UC-G-06\nChuyển đến\nđăng nhập / đăng ký" as G06
}

GU --> G01
GU --> G02
GU --> G03
GU --> G04
GU --> G05
GU --> G06
G05 .> G03 : <<include>>
G06 ..> G04 : <<extend>>
G06 ..> G03 : <<extend>>
@enduml
```

---

## Hình 4 — Use case diagram nhóm Patient

```plantuml
@startuml
left to right direction
skinparam actorStyle awesome

actor "Patient" as PA

rectangle "Patient Use Cases" {
  package "Account Management" {
    usecase "UC-P-01 Đăng ký tài khoản" as P01
    usecase "UC-P-02 Đăng nhập" as P02
    usecase "UC-P-03 Đăng xuất" as P03
    usecase "UC-P-04 Quản lý hồ sơ sức khỏe" as P04
  }
  package "Discovery" {
    usecase "UC-P-05 Tìm kiếm chuyên khoa & bác sĩ" as P05
    usecase "UC-P-06 Xem hồ sơ công khai bác sĩ" as P06
  }
  package "Health Question" {
    usecase "UC-P-07 Gửi câu hỏi sức khỏe" as P07
    usecase "UC-P-11 Xem câu hỏi & phản hồi" as P11
  }
  package "Appointment" {
    usecase "UC-P-08 Đặt lịch tư vấn" as P08
    usecase "UC-P-09 Xem & quản lý lịch hẹn" as P09
  }
  package "Consultation" {
    usecase "UC-P-10 Tham gia phiên tư vấn" as P10
    usecase "UC-P-12 Xem kết quả tư vấn" as P12
    usecase "UC-P-13 Xem đơn thuốc" as P13
    usecase "UC-P-14 Đánh giá tư vấn" as P14
  }
  package "Notification" {
    usecase "UC-P-15 Nhận thông báo" as P15
  }
}

PA --> P01
PA --> P02
PA --> P03
PA --> P04
PA --> P05
PA --> P06
PA --> P07
PA --> P08
PA --> P09
PA --> P10
PA --> P11
PA --> P12
PA --> P13
PA --> P14
PA --> P15
@enduml
```

---

## Hình 5 — Use case diagram nhóm Doctor

```plantuml
@startuml
left to right direction
skinparam actorStyle awesome

actor "Doctor" as DC

rectangle "Doctor Use Cases" {
  package "Account & Profile" {
    usecase "UC-D-01 Đăng nhập / Đăng xuất" as D01
    usecase "UC-D-02 Quản lý hồ sơ chuyên môn" as D02
  }
  package "Health Question" {
    usecase "UC-D-03 Xem danh sách câu hỏi" as D03
    usecase "UC-D-04 Phản hồi câu hỏi sức khỏe" as D04
  }
  package "Appointment" {
    usecase "UC-D-05 Xem lịch tư vấn" as D05
    usecase "UC-D-06 Quản lý lịch tư vấn" as D06
  }
  package "Consultation Session" {
    usecase "UC-D-07 Bắt đầu phiên tư vấn" as D07
    usecase "UC-D-08 Tham gia & trao đổi\ntrong phiên tư vấn" as D08
    usecase "UC-D-09 Ghi kết quả tư vấn" as D09
    usecase "UC-D-10 Tạo đơn thuốc điện tử" as D10
  }
  package "History" {
    usecase "UC-D-11 Xem lịch sử tư vấn" as D11
  }
}

DC --> D01
DC --> D02
DC --> D03
DC --> D04
DC --> D05
DC --> D06
DC --> D07
DC --> D08
DC --> D09
DC --> D10
DC --> D11
D04 .> D03 : <<include>>
D08 .> D07 : <<include>>
D09 ..> D08 : <<extend>>
D10 ..> D09 : <<extend>>
@enduml
```

---

## Hình 6 — Use case diagram nhóm Administrator

```plantuml
@startuml
left to right direction
skinparam actorStyle awesome

actor "Administrator" as AD

rectangle "Administrator Use Cases" {
  package "Account" {
    usecase "UC-A-01 Đăng nhập / Đăng xuất" as A01
  }
  package "User Management" {
    usecase "UC-A-02 Quản lý tài khoản bác sĩ" as A02
    usecase "UC-A-03 Quản lý tài khoản bệnh nhân" as A03
  }
  package "Content Management" {
    usecase "UC-A-04 Quản lý danh mục chuyên khoa" as A04
    usecase "UC-A-05 Quản lý lịch hẹn" as A05
    usecase "UC-A-06 Kiểm duyệt nội dung" as A06
  }
  package "Reporting & Monitoring" {
    usecase "UC-A-07 Xem dashboard thống kê" as A07
    usecase "UC-A-08 Theo dõi người dùng\n& phiên tư vấn" as A08
  }
}

AD --> A01
AD --> A02
AD --> A03
AD --> A04
AD --> A05
AD --> A06
AD --> A07
AD --> A08
A08 .> A07 : <<include>>
@enduml
```

---

## Hình 7 — Activity: Guest User tra cứu bác sĩ

```mermaid
flowchart TD
    Start([Bắt đầu]) --> A[Guest truy cập nền tảng]
    A --> B[Hiển thị trang chủ public]
    B --> C{Cách tìm kiếm}
    C -->|Theo chuyên khoa| D[Xem danh sách chuyên khoa]
    C -->|Từ khóa| E[Nhập từ khóa tìm kiếm]
    C -->|Xem tất cả| F[Xem danh sách bác sĩ]
    D --> G[Chọn chuyên khoa]
    G --> F
    E --> F
    F --> H{Có bác sĩ\nphù hợp?}
    H -->|Không| I[Hiển thị trạng thái\nkhông có kết quả]
    I --> C
    H -->|Có| J[Hiển thị danh sách bác sĩ\nactive & approved]
    J --> K[Guest chọn xem hồ sơ bác sĩ]
    K --> L[Hiển thị hồ sơ công khai bác sĩ]
    L --> M{Muốn đặt lịch\nhoặc gửi câu hỏi?}
    M -->|Có| N[Chuyển đến trang\nđăng nhập / đăng ký]
    M -->|Không| End([Kết thúc])
    N --> End
```

---

## Hình 8 — Activity: Patient đăng ký / đăng nhập

```mermaid
flowchart TD
    Start([Bắt đầu]) --> A{Đã có\ntài khoản?}
    A -->|Chưa — Đăng ký| B[Mở form đăng ký]
    B --> C[Nhập email, mật khẩu,\nhọ tên, thông tin bắt buộc]
    C --> D{Validation\nhợp lệ?}
    D -->|Không| E[Hiển thị lỗi validation]
    E --> C
    D -->|Hợp lệ| F[Tạo tài khoản Patient]
    F --> G[Đăng nhập tự động]
    A -->|Có rồi — Đăng nhập| H[Mở form đăng nhập]
    H --> I[Nhập email & mật khẩu]
    I --> J{Thông tin\nhợp lệ?}
    J -->|Sai| K[Từ chối – hiện lỗi\nkhông tạo phiên]
    K --> I
    J -->|Đúng| L[Xác thực và tạo JWT token]
    G --> L
    L --> M[Xác định vai trò: Patient]
    M --> N[Chuyển đến Patient Portal]
    N --> End([Kết thúc])
```

---

## Hình 9 — Activity: Patient đặt lịch tư vấn

```mermaid
flowchart TD
    Start([Bắt đầu]) --> A[Patient đã đăng nhập]
    A --> B[Chọn bác sĩ từ danh sách / hồ sơ bác sĩ]
    B --> C[Chọn ngày & khung giờ tư vấn]
    C --> D[Nhập lý do tư vấn]
    D --> E{Validation\ndữ liệu hợp lệ?}
    E -->|Không| F[Hiển thị lỗi validation]
    F --> D
    E -->|Có| G{Kiểm tra slot\nbác sĩ còn trống?}
    G -->|Đã có lịch| H[Từ chối – slot đã bị đặt]
    H --> C
    G -->|Còn trống| I{Kiểm tra Patient\nkhông trùng lịch?}
    I -->|Trùng| J[Từ chối – Patient đã có lịch giờ này]
    J --> C
    I -->|Không trùng| K[Tạo Appointment\ntrạng thái PENDING_CONFIRMATION]
    K --> L[Notification Service:\ngửi xác nhận lịch hẹn]
    L --> M{Gửi notification\nthành công?}
    M -->|Thất bại| N[Ghi nhận lỗi notification\nnghiệp vụ vẫn giữ nguyên]
    M -->|Thành công| O[Patient & Doctor\nnhận xác nhận]
    N --> O
    O --> End([Kết thúc])
```

---

## Hình 10 — Activity: Patient gửi câu hỏi sức khỏe

```mermaid
flowchart TD
    Start([Bắt đầu]) --> A[Patient đã đăng nhập]
    A --> B[Mở form gửi câu hỏi sức khỏe]
    B --> C[Nhập tiêu đề & nội dung câu hỏi]
    C --> D{Chọn bác sĩ\ncụ thể?}
    D -->|Có| E[Chọn bác sĩ từ danh sách]
    D -->|Không| F[Để hệ thống phân công]
    E --> G{Validation\nnội dung hợp lệ?}
    F --> G
    G -->|Nội dung rỗng\nhoặc không hợp lệ| H[Hiển thị lỗi validation]
    H --> C
    G -->|Hợp lệ| I[Lưu câu hỏi\ntrạng thái PENDING]
    I --> J[Notification Service:\nthông báo cho Doctor]
    J --> K[Doctor nhận câu hỏi mới]
    K --> L[Patient xem câu hỏi\ntrong danh sách của mình]
    L --> End([Kết thúc])
```

---

## Hình 11 — Activity: Doctor phản hồi câu hỏi

```mermaid
flowchart TD
    Start([Bắt đầu]) --> A[Doctor đã đăng nhập]
    A --> B[Xem danh sách câu hỏi\nđược phân công / có thể xử lý]
    B --> C{Có câu hỏi\nchờ xử lý?}
    C -->|Không| D[Hiển thị danh sách rỗng]
    D --> End([Kết thúc])
    C -->|Có| E[Doctor chọn câu hỏi]
    E --> F{Câu hỏi thuộc\nphạm vi Doctor?}
    F -->|Không| G[Từ chối – không có quyền\nphản hồi câu hỏi này]
    G --> B
    F -->|Có| H{Câu hỏi đang\ncó thể phản hồi?}
    H -->|Đã đóng\nhoặc đã xử lý| I[Hiển thị trạng thái không thể phản hồi]
    I --> B
    H -->|Còn mở| J[Doctor nhập nội dung phản hồi]
    J --> K{Validation\nnội dung hợp lệ?}
    K -->|Rỗng hoặc\nkhông hợp lệ| L[Hiển thị lỗi validation]
    L --> J
    K -->|Hợp lệ| M[Lưu phản hồi\ncập nhật trạng thái câu hỏi ANSWERED]
    M --> N[Notification Service:\nthông báo Patient có phản hồi mới]
    N --> End
```

---

## Hình 12 — Activity: Doctor thực hiện phiên tư vấn

```mermaid
flowchart TD
    Start([Bắt đầu]) --> A[Doctor mở lịch hẹn đã CONFIRMED]
    A --> B{Appointment hợp lệ\nvà đúng trạng thái?}
    B -->|Không| C[Từ chối – không thể bắt đầu tư vấn]
    C --> End([Kết thúc])
    B -->|Có| D[Doctor bắt đầu ConsultationSession\ntrạng thái ONGOING]
    D --> E[Patient tham gia session\ntheo appointment của mình]
    E --> F{Patient có quyền\nvào session này?}
    F -->|Không| G[Từ chối – không thuộc appointment]
    G --> End
    F -->|Có| H{Kênh tư vấn}
    H -->|Chat| I[Trao đổi qua chat\nlưu ConsultationMessage]
    H -->|Video| J[Kết nối Video Service]
    J --> K{Video khả dụng?}
    K -->|Không| L[Fallback sang chat]
    L --> I
    K -->|Có| M[Trao đổi qua video]
    M --> N[Kết thúc video]
    N --> I
    I --> O[Doctor kết thúc phiên tư vấn]
    O --> P[Doctor nhập summary / kết luận tư vấn]
    P --> Q{Doctor muốn\ntạo đơn thuốc?}
    Q -->|Có| R[Nhập thông tin đơn thuốc\nvà các dòng thuốc]
    R --> S[Lưu Prescription & PrescriptionItems]
    Q -->|Không| T[Lưu ConsultationSession\ntrạng thái COMPLETED]
    S --> T
    T --> U[Cập nhật Appointment\ntrạng thái COMPLETED]
    U --> End
```

---

## Hình 13 — Activity: Administrator quản lý hệ thống

```mermaid
flowchart TD
    Start([Bắt đầu]) --> A[Administrator đăng nhập\nvào khu vực quản trị]
    A --> B{Chọn\nnghiệp vụ}

    B -->|Quản lý bác sĩ| C[Xem danh sách bác sĩ]
    C --> C1{Thao tác}
    C1 -->|Duyệt hồ sơ| C2[Cập nhật approvalStatus]
    C1 -->|Bật/tắt tài khoản| C3[Cập nhật isActive]
    C2 --> Z[Lưu & ghi AuditLog]
    C3 --> Z

    B -->|Quản lý chuyên khoa| D[Xem danh mục chuyên khoa]
    D --> D1{Thao tác}
    D1 -->|Tạo mới| D2[Nhập tên & mô tả chuyên khoa]
    D2 --> D3{Tên hợp lệ\n& không trùng?}
    D3 -->|Không| D4[Hiển thị lỗi validation]
    D4 --> D2
    D3 -->|Có| Z
    D1 -->|Bật/tắt| D5[Cập nhật isActive chuyên khoa]
    D5 --> Z

    B -->|Kiểm duyệt nội dung| E[Xem câu hỏi / phản hồi / rating cần duyệt]
    E --> E1[Duyệt hoặc ẩn nội dung]
    E1 --> Z

    B -->|Quản lý lịch hẹn| F[Xem danh sách lịch hẹn]
    F --> F1[Lọc theo trạng thái / bác sĩ / bệnh nhân]
    F1 --> Z

    B -->|Dashboard| G[Xem số liệu thống kê\nngười dùng, lịch hẹn, phiên tư vấn]
    G --> G1{Có dữ liệu\ntrong khoảng lọc?}
    G1 -->|Không| G2[Hiển thị trạng thái rỗng]
    G1 -->|Có| G3[Hiển thị biểu đồ & số liệu]
    G2 --> End([Kết thúc])
    G3 --> End
    Z --> End
```

---

## Hình 14 — Kiến trúc hệ thống

> Dựa trên project thực: NestJS modules, WebSocket Gateway, Prisma ORM, PostgreSQL, external services.

```mermaid
graph TB
    subgraph CLIENT["Presentation Layer — React 18 / TypeScript / Vite"]
        direction LR
        FE1[Auth Module]
        FE2[Patient Portal]
        FE3[Doctor Workspace]
        FE4[Admin Dashboard]
        FE5[Discovery]
        FE6[Consultation\nSocket.IO client]
    end

    subgraph API["Business Logic / API Layer — NestJS / TypeScript"]
        direction TB
        subgraph MODULES["Application Modules"]
            direction LR
            M1[identity\nauth · users · admin-user]
            M2[patient]
            M3[doctor]
            M4[specialty]
            M5[discovery]
            M6[question]
            M7[appointment]
            M8[consultation\n+ WebSocket Gateway]
            M9[notification]
            M10[reporting]
            M11[operations]
        end
        subgraph COMMON["Cross-cutting Concerns"]
            direction LR
            CC1[JWT Guard]
            CC2[RBAC · Roles Guard]
            CC3[Ownership Guard]
            CC4[HTTP Exception Filter]
            CC5[Privacy Util]
        end
    end

    subgraph DATA["Data Access Layer — PostgreSQL / Prisma ORM"]
        direction LR
        DB1[(users · user_sessions\npassword_reset_tokens · audit_logs)]
        DB2[(patient_profiles\ndoctor_profiles · specialties)]
        DB3[(questions · question_moderations\nanswers · appointments)]
        DB4[(consultation_sessions\nconsultation_messages\nprescriptions · prescription_items)]
        DB5[(ratings · notification_logs\noutbox_events · file_attachments)]
    end

    subgraph EXT["External Integration Layer"]
        direction LR
        EXT1[Notification Service\nEmail / SMS]
        EXT2[Video Communication\nService]
        EXT3[File Storage\nService]
    end

    CLIENT -->|REST API / HTTPS| API
    FE6 -->|WebSocket / Socket.IO| M8
    MODULES --> DATA
    M9 --> EXT1
    M8 --> EXT2
    M8 --> EXT3
```

---

## Hình 15 — ERD / Database diagram

> Dựa trên `prisma/schema.prisma` thực của project.

```mermaid
erDiagram
    users {
        uuid id PK
        string email UK
        string passwordHash
        string firstName
        string lastName
        enum role
        boolean isActive
        datetime deletedAt
        datetime createdAt
        datetime updatedAt
    }
    user_sessions {
        uuid id PK
        uuid userId FK
        string refreshTokenHash UK
        datetime expiresAt
        datetime revokedAt
        datetime rotatedAt
        datetime lastUsedAt
        string userAgent
        string ipAddress
        datetime createdAt
    }
    password_reset_tokens {
        uuid id PK
        uuid userId FK
        string tokenHash UK
        datetime expiresAt
        datetime usedAt
        datetime createdAt
    }
    audit_logs {
        uuid id PK
        uuid actorUserId FK
        string action
        string resource
        string resourceId
        string ipAddress
        string userAgent
        json metadata
        datetime createdAt
    }
    patient_profiles {
        uuid id PK
        uuid userId FK_UK
        date dateOfBirth
        enum gender
        string phone
        string address
        string medicalHistory
        datetime createdAt
        datetime updatedAt
    }
    doctor_profiles {
        uuid id PK
        uuid userId FK_UK
        string bio
        int yearsOfExperience
        enum approvalStatus
        boolean isActive
        json schedule
        datetime scheduleUpdatedAt
        datetime createdAt
        datetime updatedAt
    }
    specialties {
        uuid id PK
        string nameEn UK
        string nameVi
        string description
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    doctor_specialties {
        uuid id PK
        uuid doctorId FK
        uuid specialtyId FK
        datetime createdAt
    }
    questions {
        uuid id PK
        uuid patientId FK
        uuid doctorId FK
        string title
        string content
        enum status
        datetime createdAt
        datetime updatedAt
    }
    question_moderations {
        uuid id PK
        uuid questionId FK
        uuid adminUserId FK
        string action
        string reason
        datetime createdAt
    }
    answers {
        uuid id PK
        uuid questionId FK
        uuid doctorId FK
        string content
        boolean isApproved
        datetime createdAt
        datetime updatedAt
    }
    appointments {
        uuid id PK
        uuid patientId FK
        uuid doctorId FK
        datetime scheduledAt
        int durationMinutes
        enum status
        string reason
        string notes
        datetime createdAt
        datetime updatedAt
    }
    consultation_sessions {
        uuid id PK
        uuid appointmentId FK_UK
        enum status
        datetime startedAt
        datetime endedAt
        string summary
        string channel
        datetime createdAt
        datetime updatedAt
    }
    consultation_messages {
        uuid id PK
        uuid consultationSessionId FK
        uuid senderUserId FK
        string content
        string messageType
        datetime createdAt
        datetime updatedAt
    }
    prescriptions {
        uuid id PK
        uuid sessionId FK_UK
        string notes
        datetime createdAt
        datetime updatedAt
    }
    prescription_items {
        uuid id PK
        uuid prescriptionId FK
        string medicationName
        string dosage
        string frequency
        string duration
        string notes
        datetime createdAt
        datetime updatedAt
    }
    ratings {
        uuid id PK
        uuid patientId FK
        uuid doctorId FK
        uuid appointmentId FK_UK
        int score
        string comment
        enum status
        datetime createdAt
        datetime updatedAt
    }
    notification_logs {
        uuid id PK
        uuid userId FK
        enum type
        string content
        string externalRef UK
        enum status
        string provider
        string errorCode
        string errorMsg
        datetime createdAt
        datetime updatedAt
    }
    outbox_events {
        uuid id PK
        string aggregateType
        string aggregateId
        string eventType
        json payload
        enum status
        int retryCount
        datetime nextRetryAt
        datetime createdAt
        datetime updatedAt
    }
    file_attachments {
        uuid id PK
        string ownerType
        string ownerId
        uuid consultationSessionId FK
        string storageKey
        string mimeType
        int sizeBytes
        uuid uploadedByUserId FK
        datetime createdAt
    }

    users ||--o{ user_sessions : "has"
    users ||--o{ password_reset_tokens : "has"
    users ||--o| patient_profiles : "has"
    users ||--o| doctor_profiles : "has"
    users ||--o{ audit_logs : "creates"
    users ||--o{ notification_logs : "receives"
    users ||--o{ question_moderations : "moderates"
    doctor_profiles ||--o{ doctor_specialties : "has"
    specialties ||--o{ doctor_specialties : "linked"
    patient_profiles ||--o{ questions : "asks"
    doctor_profiles ||--o{ questions : "assigned"
    questions ||--o{ answers : "has"
    questions ||--o{ question_moderations : "moderated by"
    doctor_profiles ||--o{ answers : "gives"
    patient_profiles ||--o{ appointments : "books"
    doctor_profiles ||--o{ appointments : "receives"
    appointments ||--o| consultation_sessions : "has"
    consultation_sessions ||--o{ consultation_messages : "contains"
    consultation_sessions ||--o| prescriptions : "has"
    prescriptions ||--o{ prescription_items : "contains"
    patient_profiles ||--o{ ratings : "gives"
    doctor_profiles ||--o{ ratings : "receives"
    appointments ||--o| ratings : "rated by"
    consultation_sessions ||--o{ file_attachments : "has"
    users ||--o{ file_attachments : "uploads"
```
