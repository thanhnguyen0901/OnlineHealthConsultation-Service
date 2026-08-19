# Patient Consultation Flow Design

## 1. Mục tiêu

Tài liệu này thiết kế trải nghiệm **patient live consultation** còn thiếu, dựa trên SRS và implementation hiện tại của hai repository:

- Backend: `ConsultationService`, `ConsultationController`, `ConsultationGateway`, `Appointment`.
- Frontend: `ConsultationHistoryPage`, doctor `ConsultationSessionPage`, `doctor.api`, `patient.api`, `routes.tsx`, Redux patient state.

Thiết kế ưu tiên reuse capability hiện có, không thay đổi schema nếu chưa cần thiết, và không implement trong phạm vi tài liệu này.

## 2. SRS liên quan

Các yêu cầu SRS chính:

- Patient xem lịch hẹn và chọn tham gia phiên tư vấn.
- Doctor xem lịch hẹn và bắt đầu phiên tư vấn.
- System kiểm tra thời gian lịch hẹn, trạng thái lịch hẹn và quyền truy cập đúng phiên.
- System khởi tạo phiên chat hoặc video.
- Patient và doctor trao đổi trong phiên tư vấn.
- Doctor ghi nhận summary, hướng dẫn điều trị và prescription.
- Doctor kết thúc phiên tư vấn.
- Patient xem lại summary và prescription sau khi hoàn tất.
- Nếu video không khả dụng, system fallback sang chat.

## 3. Hiện trạng hệ thống

### Backend hiện có

`ConsultationController` đã có:

- `POST /consultations/:appointmentId/start`: doctor start session.
- `POST /consultations/:appointmentId/join`: patient, doctor, admin join session.
- `GET /consultations/:appointmentId/messages`: load persisted chat messages.
- `POST /consultations/:appointmentId/messages`: send persisted chat message.
- `PATCH /consultations/:appointmentId/end`: doctor end session.
- `PATCH /consultations/:appointmentId/summary`: doctor update summary.
- `POST /consultations/:appointmentId/prescriptions`: doctor create/update prescription.
- `GET /consultations/:appointmentId/result`: participant read result and prescription.

`ConsultationService` đã có:

- Appointment time window bằng `CONSULTATION_EARLY_JOIN_MINUTES`, default `15`.
- Late window bằng `CONSULTATION_LATE_JOIN_MINUTES`, default `30`.
- Doctor có thể start appointment ở status `CONFIRMED` hoặc `PENDING_CONFIRMATION`.
- Patient/doctor/admin access control theo appointment owner.
- Session channel `CHAT` hoặc `VIDEO`, nhưng `VIDEO` chỉ dùng khi `VIDEO_PROVIDER_ENABLED=true`; nếu không thì fallback về `CHAT`.
- Message persistence qua `ConsultationMessage`.
- Completion update cả `ConsultationSession.status=COMPLETED` và `Appointment.status=COMPLETED`.

`ConsultationGateway` hiện có:

- Namespace `/consultations`.
- Auth bằng JWT từ `Authorization: Bearer <token>` hoặc `handshake.auth.token`.
- Event `consultation:join`.
- Event `consultation:message`.
- Broadcast message vào room `consultation:<appointmentId>`.

### Frontend hiện có

Doctor `ConsultationSessionPage` hiện:

- Có route `/doctor/consultations/:appointmentId`.
- Gọi REST `startConsultation`, `getConsultationResult`, `getMessages`, `sendMessage`, `endConsultation`, `saveSummary`, `createPrescription`.
- Chưa dùng WebSocket; sau khi gửi message thì reload bằng REST.
- Có UI chat, summary, prescription và end session.

Patient `ConsultationHistoryPage` hiện:

- Hiển thị appointments từ `/appointments/mine`.
- Cho cancel appointment ở `pending` hoặc `confirmed`.
- Cho xem result/rating khi appointment `completed`.
- Chưa có action `Join Consultation`.
- Chưa có route patient live consultation.
- `patient.api` mới có `getConsultationResult`, chưa có `joinConsultation`, `getMessages`, `sendMessage`.

Frontend chưa có `socket.io-client` dependency.

## 4. Design tổng quan

Thêm trải nghiệm patient live consultation theo mô hình:

```text
ConsultationHistoryPage
  -> show Join Consultation when appointment is eligible
  -> navigate /patient/consultations/:appointmentId
  -> PatientConsultationSessionPage
      -> load consultation result/appointment context
      -> POST join
      -> GET messages
      -> connect WebSocket /consultations
      -> emit consultation:join
      -> realtime chat
      -> handle completed/ended state
      -> after completion, navigate/view result from history
```

Không duplicate business rules ở frontend. Frontend chỉ dùng rule nhẹ để quyết định hiển thị button thân thiện; backend vẫn là nguồn truth khi `join`, load messages và send message.

## 5. Patient entry point from appointment

Entry point chính là `ConsultationHistoryPage`, trong appointment table.

Với mỗi appointment:

- `completed`: hiển thị `Result`, `Rate` hoặc `Rated`, `Detail`.
- `pending` hoặc `confirmed`: hiển thị `Join Consultation` khi đủ điều kiện UI, kèm `Cancel`, `Detail`.
- `cancelled`: không hiển thị join.

Action `Join Consultation` navigate tới:

```text
/patient/consultations/:appointmentId
```

Route constant đề xuất:

```ts
PATIENT_CONSULTATION_SESSION: '/patient/consultations/:appointmentId'
```

Helper tạo URL nên dùng function nội bộ hoặc replace:

```ts
ROUTE_PATHS.PATIENT_CONSULTATION_SESSION.replace(':appointmentId', appointment.id)
```

## 6. Conditions for displaying Join Consultation

Frontend chỉ dùng điều kiện hiển thị sơ bộ:

- `appointment.status === 'confirmed'` là điều kiện chính.
- Có thể cân nhắc `appointment.status === 'pending'` vì backend `startSession` cho doctor auto-confirm khi start từ `PENDING_CONFIRMATION`; tuy nhiên patient không nên join lịch chưa được doctor xác nhận/start. UI nên chỉ show join cho `confirmed`.
- `appointment.date` hợp lệ.
- Current time nằm trong khoảng gần lịch hẹn để tránh button luôn hiện:
  - `scheduledAt - EARLY_JOIN_UI_MINUTES <= now`
  - `now <= scheduledAt + durationMinutes + LATE_JOIN_UI_MINUTES`
- Vì `Appointment` frontend hiện chưa có `durationMinutes`, UI có thể dùng default `60` phút cho hiển thị sơ bộ. Backend vẫn validate thật.

Đề xuất constant frontend:

```ts
const EARLY_JOIN_UI_MINUTES = 15;
const DEFAULT_DURATION_MINUTES = 60;
const LATE_JOIN_UI_MINUTES = 30;
```

Khi không trong window:

- Trước window: hiển thị disabled button hoặc hint `Available before appointment time`.
- Sau window: không hiển thị join; chỉ giữ detail/cancel nếu còn được phép.

Backend vẫn quyết định:

- Too early/late: `400 Consultation session is outside allowed time window`.
- Not started: `400 Consultation session has not been started`.
- Unauthorized: `403`.

## 7. Patient consultation route

Thêm page:

```text
OnlineHealthConsultation-Web/src/features/patient/pages/PatientConsultationSessionPage.tsx
```

Route:

```tsx
<Route
  path={ROUTE_PATHS.PATIENT_CONSULTATION_SESSION}
  element={
    <RoleGuard roles={['PATIENT']}>
      <PatientConsultationSessionPage />
    </RoleGuard>
  }
/>
```

UI layout:

- Header: doctor name, appointment time, status.
- Main panel: video/mock video area + chat area.
- Side panel or section: appointment reason/notes.
- Bottom/input: message input, send button.
- State alerts:
  - loading,
  - not started,
  - too early,
  - too late,
  - unauthorized,
  - ended/completed,
  - reconnecting.

Không cần thêm patient Redux slice nếu page là route-local state như doctor `ConsultationSessionPage`. Có thể thêm `patient.api` functions để reuse.

## 8. Join session lifecycle

Khi mount `PatientConsultationSessionPage`:

1. Validate `appointmentId` từ route param.
2. Gọi `patientApi.getConsultationResult(appointmentId)` để lấy context:
   - appointment status,
   - doctor/patient names,
   - consultation status/channel nếu session đã có,
   - summary/prescription nếu completed.
3. Nếu appointment/session đã completed:
   - không join live,
   - render completed state và CTA xem result.
4. Nếu chưa completed:
   - gọi `patientApi.joinConsultation(appointmentId)`.
5. Nếu join thành công:
   - store `sessionId`, `status`, `channel`.
   - load message history.
   - connect WebSocket.
6. Nếu join fail:
   - map error thành state rõ ràng:
     - not started,
     - too early/too late,
     - unauthorized,
     - generic error.

Important: Patient không được gọi `startConsultation`; chỉ doctor start.

## 9. WebSocket connection lifecycle

Frontend cần thêm `socket.io-client` hoặc một wrapper riêng:

```ts
import { io, Socket } from 'socket.io-client';
```

Connection:

- Namespace: `${API_ORIGIN}/consultations`.
- Auth token lấy từ Redux `selectAccessToken` hoặc auth storage hiện có.
- Gửi token qua:

```ts
io(url, { auth: { token } })
```

Lifecycle:

1. Sau khi REST `joinConsultation` thành công, tạo socket.
2. On `connect`: emit `consultation:join` với `{ appointmentId }`.
3. On `consultation:joined`: set connected state, clear reconnecting.
4. On `consultation:message`: append incoming message nếu chưa duplicate `id`.
5. On `connect_error` hoặc `disconnect`: show reconnecting/offline state.
6. On unmount: remove listeners và `socket.disconnect()`.

Không connect WebSocket trước khi REST join thành công, để error state REST rõ ràng hơn.

## 10. Initial message history loading

Sau khi REST join thành công:

```text
GET /consultations/:appointmentId/messages
```

Load order:

1. `joinConsultation`.
2. `getMessages`.
3. Connect socket and emit `consultation:join`.

Lý do: nếu socket join fail vì network, user vẫn thấy history và có REST fallback rõ hơn.

Dedup strategy:

- Store messages by `id`.
- Khi receive realtime event, nếu `id` đã tồn tại thì bỏ qua.
- Sort by `createdAt` ascending.

## 11. Realtime incoming/outgoing messages

Preferred send path:

- Use socket event `consultation:message` với `{ appointmentId, content }`.
- Backend gateway sẽ persist qua `ConsultationService.sendSessionMessage` và broadcast persisted message.

Fallback send path:

- Nếu socket chưa connected hoặc emit lỗi timeout:
  - gọi REST `POST /consultations/:appointmentId/messages`.
  - append response.

UI:

- Disable send khi:
  - empty trimmed content,
  - session not ongoing,
  - sending,
  - completed/ended,
  - unauthorized.
- Show sender identification:
  - current user message aligned right.
  - doctor message aligned left.
  - sender name from `message.sender.firstName/lastName`.

## 12. Reconnect behavior

Socket.IO tự reconnect theo default, nhưng page cần UX rõ:

- On `disconnect`: show `Reconnecting...` non-blocking banner.
- On `connect`: emit `consultation:join` lại.
- Sau reconnect thành công:
  - call `GET /consultations/:appointmentId/messages` để sync missed messages.
  - merge/dedup local messages.
- Nếu reconnect hết retry hoặc token expired:
  - show error,
  - offer `Retry`.
- Nếu REST sync trả `Consultation session is outside allowed time window` hoặc `not ongoing`, reload `getConsultationResult`.

Không cần tự implement message queue phức tạp trong phase đầu; khi offline, disable send và yêu cầu retry.

## 13. Session ended handling

Backend hiện chưa broadcast event khi doctor gọi `PATCH /end`. Vì vậy phase đầu cần fallback:

- Patient page poll nhẹ `getConsultationResult` mỗi 15-30 giây khi session ongoing.
- Khi result trả `consultation.status === 'COMPLETED'` hoặc `appointment.status === 'COMPLETED'`:
  - set session ended state,
  - disable message input,
  - disconnect socket,
  - show CTA `View consultation result`.

Đề xuất backend enhancement sau:

- Trong `ConsultationGateway` hoặc service event layer, emit:

```text
consultation:ended
```

vào room `consultation:<appointmentId>` khi doctor ends session.

Nếu chưa thêm backend event, polling là acceptable minimal frontend behavior.

## 14. Unauthorized / too early / too late states

Frontend page cần map known backend messages:

- `403` hoặc `Cannot join consultation of another patient`:
  - State: unauthorized.
  - Message: user không có quyền tham gia phiên này.
  - CTA: quay về history.
- `Consultation session has not been started`:
  - State: not started.
  - Message: bác sĩ chưa bắt đầu phiên tư vấn.
  - CTA: retry join.
- `Consultation session is outside allowed time window`:
  - State: outside window.
  - Nếu appointment time trong tương lai xa: too early.
  - Nếu appointment time đã qua window: too late.
  - CTA: quay về history hoặc xem detail.
- Generic network/API error:
  - State: error.
  - CTA: retry.

Backend vẫn là source of truth. Frontend time calculation chỉ để copy/hint thân thiện.

## 15. Doctor/patient participant identification

Backend message response include:

```ts
sender: {
  id: string;
  firstName: string;
  lastName: string;
  role: Role;
}
```

Frontend identification:

- Current patient user id lấy từ auth Redux state.
- Message is mine nếu `message.sender.id === currentUser.id`.
- Doctor participant lấy từ `getConsultationResult().appointment.doctor.user`.
- Patient participant lấy từ `getConsultationResult().appointment.patient.user`.

Display:

- Doctor: label `Doctor <name>`.
- Patient: label `You` cho own messages, hoặc patient name nếu cần.
- Admin messages hiện backend cho phép join/list/send với role admin; patient UI không cần special handling ngoài label role nếu xuất hiện.

## 16. Summary/prescription access after completion

Sau khi session completed:

- Patient không ở live mode nữa.
- UI hiển thị state completed và CTA:
  - `View Result` mở dialog hiện có hoặc navigate về history.
- Existing endpoint:

```text
GET /consultations/:appointmentId/result
```

Response hiện đã có:

- appointment,
- consultation summary/status/start/end/channel,
- prescription/items.

Patient chỉ được xem result của appointment của chính mình vì `assertAppointmentAccess` đã enforce.

Không cần endpoint mới cho summary/prescription trong phase đầu.

## 17. Video/mock video behavior

SRS yêu cầu video ở mức mô phỏng hoặc integration cơ bản, và fallback sang chat nếu video không khả dụng.

Backend hiện hỗ trợ:

- Doctor start với `{ channel: 'CHAT' | 'VIDEO' }`.
- Nếu request `VIDEO` nhưng `VIDEO_PROVIDER_ENABLED !== 'true'`, session trả `channel='CHAT'` và `fallbackToChat=true`.

Patient live page behavior:

- Nếu `joinConsultation` hoặc `getConsultationResult` trả `channel === 'VIDEO'`:
  - render mock video panel.
  - Panel có local/remote placeholder, doctor/patient labels, trạng thái `Video session`.
  - Chat vẫn hiển thị bên cạnh để đáp ứng fallback.
- Nếu `channel === 'CHAT'`:
  - render chat-first layout.
  - Nếu result/start metadata cho thấy fallback, show info `Video unavailable, using chat`.

Vì backend `joinSession` không trả `fallbackToChat`, patient page chỉ có thể dựa vào `channel`. Nếu cần thông báo fallback rõ cho patient, có hai lựa chọn sau:

- Minimal: hiển thị generic chat fallback text khi `channel === 'CHAT'`.
- Enhancement: backend lưu/return `requestedChannel` hoặc `fallbackToChat` trong session/result.

Không implement WebRTC trong phase này.

## 18. Proposed frontend API additions

Trong `patient.api.ts`:

```ts
export const joinConsultation = async (appointmentId: string) =>
  unwrap((await apiClient.post(`/consultations/${appointmentId}/join`)).data);

export const getMessages = async (appointmentId: string) =>
  unwrap<ConsultationMessage[]>(
    (await apiClient.get(`/consultations/${appointmentId}/messages`)).data
  ) ?? [];

export const sendMessage = async (appointmentId: string, content: string) =>
  unwrap((await apiClient.post(`/consultations/${appointmentId}/messages`, { content })).data);
```

Optional socket helper:

```text
src/features/consultation/realtime/consultationSocket.ts
```

hoặc giữ local trong `PatientConsultationSessionPage` nếu chưa có reuse với doctor page.

## 19. Affected files

Frontend:

- `src/constants/routePaths.ts`
- `src/app/routes.tsx`
- `src/features/patient/pages/ConsultationHistoryPage.tsx`
- `src/features/patient/pages/PatientConsultationSessionPage.tsx` (new)
- `src/features/patient/apis/patient.api.ts`
- `src/features/patient/types.ts`
- `src/features/auth/redux/auth.selectors.ts` hoặc auth storage helper để lấy token
- `src/i18n/en/patient.json`
- `src/i18n/vi/patient.json`
- `package.json` nếu thêm `socket.io-client`

Backend optional enhancement:

- `src/modules/consultation/consultation.gateway.ts` nếu emit `consultation:ended`.
- `src/modules/consultation/consultation.service.ts` nếu cần expose fallback metadata rõ hơn.

Tests:

- `OnlineHealthConsultation-Web/e2e/specs/patient-appointments.spec.ts` hoặc file mới `patient-consultation.spec.ts`.
- Nếu backend enhancement có event mới: backend gateway/service tests nếu project bổ sung test infra tương ứng.

## 20. Implementation plan

1. Add patient route constant and lazy page route.
2. Extend `patient.api` with `joinConsultation`, `getMessages`, `sendMessage`.
3. Add `PatientConsultationSessionPage` with route-local state:
   - load result,
   - join,
   - load messages,
   - connect socket,
   - send/receive messages,
   - reconnect sync.
4. Add `Join Consultation` action in `ConsultationHistoryPage`.
5. Add i18n keys for:
   - join,
   - not started,
   - too early,
   - too late,
   - reconnecting,
   - session ended,
   - video fallback.
6. Add `socket.io-client` dependency if realtime is implemented now.
7. Add e2e coverage:
   - button appears for eligible appointment,
   - patient route blocks unauthenticated via auth guard,
   - not-started state,
   - completed result CTA.
8. Optional backend enhancement:
   - emit `consultation:ended`,
   - return fallback metadata to patient.

## 21. Open limitations

- Existing doctor page does not use WebSocket, so doctor and patient realtime UX will be asymmetric until doctor page is upgraded or patient uses REST fallback only.
- Backend does not broadcast `consultation:ended`.
- Patient `Appointment` frontend type does not include `durationMinutes`, so UI eligibility window must assume default duration unless API normalization is expanded.
- Frontend does not currently include `socket.io-client`.
- Backend allows `PENDING_CONFIRMATION` in `startSession`, but patient should only see join after doctor starts/appointment is effectively confirmed.
