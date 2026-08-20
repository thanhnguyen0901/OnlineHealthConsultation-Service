# Documentation Index

Thư mục này là bộ tài liệu hiện hành cho bản submitted system của Online Health Consultation.

## Requirement Source Of Truth

- `srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`: nguồn yêu cầu chính của hệ thống.

## Current Compliance And Readiness

- `audit/final-srs-traceability.md`: đối chiếu SRS với source code hiện tại, gồm status cho từng nhóm requirement và bằng chứng FE/BE.
- `audit/security-hardening-report.md`: trạng thái security hardening hiện tại của backend.
- `deployment/production-readiness.md`: trạng thái cấu hình deployment hiện tại, gồm JWT, refresh cookie, CORS, env validation, database, frontend API URL, WebSocket và notification provider.
- `testing/final-e2e-results.md`: kết quả kiểm chứng E2E local cho core graduation flows.
- `scope/file-attachment-scope-decision.md`: quyết định submitted scope cho file upload / attachment.

## Design Records

- `design/doctor-availability-design.md`: availability model cho doctor schedule, slot calculation, conflict prevention, booking và reschedule.
- `design/patient-consultation-flow.md`: patient live consultation flow, route, WebSocket lifecycle, chat, completion và result/prescription access.
- `design/moderation-workflow.md`: moderation workflow cho health questions, responses và ratings/comments.

## Test Planning

- `testing/e2e-test-matrix.md`: ma trận test theo actor và SRS use case.
- `testing/final-e2e-results.md`: kết quả chạy test thực tế dùng để kết luận readiness.

## Notes

- `docs/audit/final-srs-traceability.md` là tài liệu chính để xem codebase hiện tại đáp ứng SRS như thế nào.
- Các design records giải thích implementation hiện tại và các trade-off chính; không thay thế SRS.
