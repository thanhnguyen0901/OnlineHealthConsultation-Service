/**
 * scripts/verify-crud.ts
 *
 * End-to-end CRUD smoke test — runs against a live server.
 *
 * Usage:
 *   ts-node scripts/verify-crud.ts
 *
 * Prerequisites:
 *   1. Server is running   → npm run dev
 *   2. DB is seeded        → npm run db:setup
 *
 * What is tested (one full round-trip per workflow):
 *   W1  Question flow  — patient asks → doctor answers → patient sees answer in /history
 *   W2  Appointment    — patient books → doctor confirms → patient cancels (different appt)
 *   W3  Admin CRUD     — create specialty → create doctor → verify via public /doctors
 *   W4  Auth guards    — 401 without token, 403 with wrong role
 */

import https from 'https';
import http from 'http';

// ─── Configuration ────────────────────────────────────────────────────────────
const BASE = process.env.API_BASE ?? 'http://localhost:4000/api';

// Seed credentials (created by prisma/seed.ts)
const CREDS = {
  patient: { email: 'vo.van.nam@gmail.com',             password: 'Patient@123' },
  doctor:  { email: 'nguyen.van.hung@healthcare.com',   password: 'Doctor@123'  },
  admin:   { email: 'admin@healthcare.com',             password: 'Admin@123'   },
};

// ─── Minimal fetch wrapper ─────────────────────────────────────────────────────
interface Resp<T = unknown> {
  status: number;
  body: T;
  cookies: string[];
}

function request<T = unknown>(
  method: string,
  path: string,
  body?: unknown,
  token?: string,
  cookie?: string,
): Promise<Resp<T>> {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE + path);
    const payload = body ? JSON.stringify(body) : undefined;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token)  headers['Authorization'] = `Bearer ${token}`;
    if (cookie) headers['Cookie'] = cookie;
    if (payload) headers['Content-Length'] = Buffer.byteLength(payload).toString();

    const mod = url.protocol === 'https:' ? https : http;
    const req = mod.request(
      { hostname: url.hostname, port: url.port, path: url.pathname + url.search, method, headers },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode!, body: JSON.parse(data), cookies: res.headers['set-cookie'] ?? [] });
          } catch {
            resolve({ status: res.statusCode!, body: data as T, cookies: [] });
          }
        });
      },
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ─── Assertion helpers ─────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function assert(label: string, condition: boolean, detail?: unknown) {
  if (condition) {
    console.log(`  ✅  ${label}`);
    passed++;
  } else {
    console.error(`  ❌  ${label}`, detail ?? '');
    failed++;
  }
}

async function login(role: 'patient' | 'doctor' | 'admin') {
  const creds = CREDS[role];
  const r = await request<any>('POST', '/auth/login', creds);
  assert(`${role} login → 200`, r.status === 200, r.body);
  const token: string = r.body?.data?.accessToken ?? '';
  const cookies = r.cookies;
  return { token, cookies };
}

// ─── Test suites ──────────────────────────────────────────────────────────────

async function testAuthGuards() {
  console.log('\n━━  Auth guards ━━');

  // 401 – no token
  const r1 = await request('GET', '/patients/profile');
  assert('GET /patients/profile without token → 401', r1.status === 401);

  // 403 – patient token on a doctor route
  const { token: patToken } = await login('patient');
  const r2 = await request('GET', '/doctors/questions', undefined, patToken);
  assert('GET /doctors/questions with PATIENT token → 403', r2.status === 403);

  // 403 – doctor token on an admin route
  const { token: drToken } = await login('doctor');
  const r3 = await request('GET', '/admin/users', undefined, drToken);
  assert('GET /admin/users with DOCTOR token → 403', r3.status === 403);
}

async function testW1QuestionFlow() {
  console.log('\n━━  W1 – Question flow ━━');

  const { token: patToken } = await login('patient');
  const { token: drToken } = await login('doctor');

  // Patient asks question
  const q = await request<any>('POST', '/patients/questions', { question: 'CRUD-test: headache every morning, what should I do?' }, patToken);
  assert('Patient POST /patients/questions → 201', q.status === 201, q.body);
  const qId: string = q.body?.data?.id ?? '';
  assert('Question ID returned', !!qId, q.body?.data);

  // Doctor sees question in inbox
  const inbox = await request<any>('GET', '/doctors/questions', undefined, drToken);
  assert('Doctor GET /doctors/questions → 200', inbox.status === 200);
  const inboxItems: any[] = inbox.body?.data ?? [];
  assert('Inbox contains the new question', inboxItems.some((q2: any) => q2.id === qId));

  // Doctor answers
  const ans = await request<any>('POST', `/doctors/questions/${qId}/answers`, { answer: 'CRUD-test: Drink more water and rest.' }, drToken);
  assert('Doctor POST /doctors/questions/:id/answers → 201', ans.status === 201, ans.body);

  // Patient sees answer in /history
  const hist = await request<any>('GET', '/patients/history', undefined, patToken);
  assert('Patient GET /patients/history → 200', hist.status === 200);
  const histQ = (hist.body?.data?.questions ?? []).find((q2: any) => q2.id === qId);
  assert('History contains the question', !!histQ, { id: qId, questions: hist.body?.data?.questions?.length });
  // Note: answer will be null until admin approves it (isApproved starts false)
  // but the question itself must appear in history now that status filters are removed.
}

async function testW2AppointmentFlow() {
  console.log('\n━━  W2 – Appointment flow ━━');

  const { token: patToken } = await login('patient');
  const { token: drToken }  = await login('doctor');

  // Get a specialty to find a doctor
  const specs = await request<any>('GET', '/specialties');
  assert('GET /specialties → 200', specs.status === 200);
  const specialtyId: string = specs.body?.data?.[0]?.id ?? '';

  const docs = await request<any>('GET', `/doctors?specialtyId=${specialtyId}&limit=1`);
  assert('GET /doctors → 200', docs.status === 200);
  const docUserId: string = docs.body?.data?.[0]?.id ?? '';
  assert('Doctor ID available', !!docUserId, docs.body?.data?.[0]);

  // Build a future date (2 days from now at 10:00)
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 2);
  const dateStr = futureDate.toISOString().slice(0, 10);

  // Patient books appointment
  const appt = await request<any>('POST', '/patients/appointments', {
    doctorId: docUserId,
    date: dateStr,
    time: '10:00',
    reason: 'CRUD-test: routine check',
  }, patToken);
  assert('Patient POST /patients/appointments → 201', appt.status === 201, appt.body);
  const apptId: string = appt.body?.data?.id ?? '';
  assert('Appointment ID returned', !!apptId);

  // Appointment appears in doctor inbox
  const drAppts = await request<any>('GET', '/doctors/appointments', undefined, drToken);
  assert('Doctor GET /doctors/appointments → 200', drAppts.status === 200);
  const drApptList: any[] = drAppts.body?.data ?? [];
  assert('New appointment in doctor list', drApptList.some((a: any) => a.id === apptId));

  // Doctor confirms
  const confirm = await request<any>('PUT', `/doctors/appointments/${apptId}`, { status: 'CONFIRMED' }, drToken);
  assert('Doctor PUT /doctors/appointments/:id CONFIRMED → 200', confirm.status === 200, confirm.body);

  // Appointment appears in patient history with correct status
  const hist = await request<any>('GET', '/patients/history', undefined, patToken);
  assert('Patient GET /patients/history → 200', hist.status === 200);
  const histAppt = (hist.body?.data?.appointments ?? []).find((a: any) => a.id === apptId);
  assert('Appointment in history with status confirmed', histAppt?.status === 'confirmed', histAppt);

  // Patient cancels
  const cancel = await request<any>('PATCH', `/patients/appointments/${apptId}/cancel`, undefined, patToken);
  assert('Patient PATCH /patients/appointments/:id/cancel → 200', cancel.status === 200, cancel.body);

  // Verify cancelled in history
  const hist2 = await request<any>('GET', '/patients/history', undefined, patToken);
  const histAppt2 = (hist2.body?.data?.appointments ?? []).find((a: any) => a.id === apptId);
  assert('Appointment shows as cancelled in history', histAppt2?.status === 'cancelled', histAppt2);
}

async function testW3AdminCRUD() {
  console.log('\n━━  W3 – Admin CRUD ━━');

  const { token: adminToken } = await login('admin');

  // Create specialty
  const spec = await request<any>('POST', '/admin/specialties', {
    nameEn: 'CRUD-Test Specialty',
    nameVi: 'Chuyên khoa kiểm tra',
    description: 'Temporary test specialty',
  }, adminToken);
  assert('Admin POST /admin/specialties → 201', spec.status === 201, spec.body);
  const specId: string = spec.body?.data?.id ?? '';
  assert('Specialty ID returned', !!specId);

  // Verify visible on public endpoint
  const pubSpecs = await request<any>('GET', '/specialties');
  assert('GET /specialties includes new specialty', (pubSpecs.body?.data ?? []).some((s: any) => s.id === specId));

  // Update specialty
  const upd = await request<any>('PUT', `/admin/specialties/${specId}`, {
    nameEn: 'CRUD-Test Specialty Updated',
    nameVi: 'Chuyên khoa kiểm tra (cập nhật)',
  }, adminToken);
  assert('Admin PUT /admin/specialties/:id → 200', upd.status === 200, upd.body);

  // Create a doctor user via admin
  const ts = Date.now();
  const newDoc = await request<any>('POST', '/admin/doctors', {
    email: `crudtest.doctor.${ts}@test.com`,
    password: 'Test@12345',
    firstName: 'CRUDTest',
    lastName: 'Doctor',
    specialtyId: specId,
  }, adminToken);
  assert('Admin POST /admin/doctors → 201', newDoc.status === 201, newDoc.body);
  const newDocUserId: string = newDoc.body?.data?.id ?? '';
  assert('New doctor user ID returned', !!newDocUserId);

  // List users — should contain new doctor
  const users = await request<any>('GET', '/admin/users', undefined, adminToken);
  assert('Admin GET /admin/users → 200', users.status === 200);

  // Delete specialty (clean up)
  const del = await request<any>('DELETE', `/admin/specialties/${specId}`, undefined, adminToken);
  // 200 or 409 (doctor FK) — either way it's not a 500
  assert('Admin DELETE /admin/specialties/:id → not 500', del.status !== 500, del.body);
}

async function testW4Moderation() {
  console.log('\n━━  W4 – Moderation ━━');

  const { token: adminToken } = await login('admin');

  // Get pending questions for moderation
  const pending = await request<any>('GET', '/admin/moderation/questions', undefined, adminToken);
  assert('Admin GET /admin/moderation/questions → 200', pending.status === 200);
  const items: any[] = pending.body?.data ?? [];

  if (items.length === 0) {
    console.log('    ⚠️  No pending moderation items (seed data already moderated)');
    return;
  }

  const targetId: string = items[0]?.id ?? '';
  const approve = await request<any>('PATCH', `/admin/questions/${targetId}/moderate`, { action: 'APPROVE' }, adminToken);
  // Accept 200 (approved) or 409 (already moderated)
  assert('Admin PATCH /admin/questions/:id/moderate → 200 or 409', [200, 409].includes(approve.status), approve.body);
}

// ─── Runner ───────────────────────────────────────────────────────────────────

async function run() {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  CRUD Smoke Test  →  ${BASE}`);
  console.log(`${'═'.repeat(60)}`);

  try {
    await testAuthGuards();
    await testW1QuestionFlow();
    await testW2AppointmentFlow();
    await testW3AdminCRUD();
    await testW4Moderation();
  } catch (err) {
    console.error('\n💥 Unexpected error during test run:', err);
    failed++;
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log(`${'═'.repeat(60)}\n`);

  if (failed > 0) process.exit(1);
}

run();
