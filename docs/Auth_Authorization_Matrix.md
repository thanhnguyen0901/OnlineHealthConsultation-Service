# Auth & Authorization Matrix

Updated: 2026-04-18

## 1. Role Definitions

- `Guest`: unauthenticated public access.
- `Patient`: authenticated end-user receiving consultation.
- `Doctor`: authenticated medical provider.
- `Admin`: platform operator.

## 2. Policy Layers

- Layer 1: Authentication (valid access token).
- Layer 2: RBAC (`RolesGuard`).
- Layer 3: Ownership/Scope (`OwnershipGuard`).
- Layer 4: Audit logging for sensitive actions.

## 3. Resource Permission Matrix

| Resource | Guest | Patient | Doctor | Admin |
|---|---|---|---|---|
| Public doctors/specialties | Read | Read | Read | Read |
| Patient profile | No | Own only | No | Read/Write |
| Doctor profile | Public read | Public read | Own write | Read/Write |
| Questions | No | Own create/read | Assigned read/answer | Moderate |
| Appointments | No | Own create/read/cancel | Own schedule manage | Global manage |
| Consultation session | No | Own join/read | Own start/end/write | Supervised read |
| Prescription | No | Own read | Own create/update | Read |
| Rating | No | Own create/read | Read own feedback | Moderate |
| Reports | No | No | Limited optional | Full read |

## 4. Ownership Rules

- Patient-owned data: profile, questions, appointments, consultation results, prescriptions, ratings.
- Doctor-owned data: professional profile, answers, consultations handled.
- Admin bypasses ownership but action must be audited.

## 5. Sensitive Action Audit Requirements

- Login success/failure.
- Password reset events.
- Appointment status changes.
- Consultation summary/prescription updates.
- Admin moderation and user status changes.

## 6. Enforcement Checklist

- [ ] Every protected endpoint has `JwtAuthGuard`.
- [ ] Role-restricted endpoint has `RolesGuard`.
- [ ] User-scoped endpoint has `OwnershipGuard`.
- [ ] Sensitive action emits audit event.
