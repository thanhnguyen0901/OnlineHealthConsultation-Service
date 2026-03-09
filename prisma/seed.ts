import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load .env so BCRYPT_ROUNDS matches the application's runtime value.
dotenv.config();
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS ?? '10', 10);

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Deterministic seed IDs
// ---------------------------------------------------------------------------
// Fixed UUIDs ensure upsert is idempotent across reruns: a second `npm run
// prisma:seed` updates existing rows in-place instead of inserting duplicates.
// Format: 01950000-0000-7000-8<group>-<sequential index>
const S = {
  specialties: {
    cardiology:  '01950000-0000-7000-8000-000000000001',
    dermatology: '01950000-0000-7000-8000-000000000002',
    pediatrics:  '01950000-0000-7000-8000-000000000003',
    orthopedics: '01950000-0000-7000-8000-000000000004',
    generalMed:  '01950000-0000-7000-8000-000000000005',
  },
  users: {
    admin:    '01950000-0000-7000-8001-000000000001',
    doctor1:  '01950000-0000-7000-8001-000000000002',
    doctor2:  '01950000-0000-7000-8001-000000000003',
    doctor3:  '01950000-0000-7000-8001-000000000004',
    doctor4:  '01950000-0000-7000-8001-000000000005',
    patient1: '01950000-0000-7000-8001-000000000006',
    patient2: '01950000-0000-7000-8001-000000000007',
    patient3: '01950000-0000-7000-8001-000000000008',
  },
  doctorProfiles: {
    doctor1: '01950000-0000-7000-8002-000000000001',
    doctor2: '01950000-0000-7000-8002-000000000002',
    doctor3: '01950000-0000-7000-8002-000000000003',
    doctor4: '01950000-0000-7000-8002-000000000004',
  },
  patientProfiles: {
    patient1: '01950000-0000-7000-8003-000000000001',
    patient2: '01950000-0000-7000-8003-000000000002',
    patient3: '01950000-0000-7000-8003-000000000003',
  },
  questions: {
    q1: '01950000-0000-7000-8004-000000000001',
    q2: '01950000-0000-7000-8004-000000000002',
    q3: '01950000-0000-7000-8004-000000000003',
    q4: '01950000-0000-7000-8004-000000000004',
    q5: '01950000-0000-7000-8004-000000000005',
    q6: '01950000-0000-7000-8004-000000000006',
  },
  answers: {
    a1: '01950000-0000-7000-8005-000000000001',
    a2: '01950000-0000-7000-8005-000000000002',
    a3: '01950000-0000-7000-8005-000000000003',
    a4: '01950000-0000-7000-8005-000000000004',
  },
  appointments: {
    ap1: '01950000-0000-7000-8006-000000000001',
    ap2: '01950000-0000-7000-8006-000000000002',
    ap3: '01950000-0000-7000-8006-000000000003',
    ap4: '01950000-0000-7000-8006-000000000004',
    ap5: '01950000-0000-7000-8006-000000000005',
    ap6: '01950000-0000-7000-8006-000000000006',
    ap7: '01950000-0000-7000-8006-000000000007',
  },
  ratings: {
    r1: '01950000-0000-7000-8007-000000000001',
    r2: '01950000-0000-7000-8007-000000000002',
    r3: '01950000-0000-7000-8007-000000000003',
  },
};

async function main() {
  console.log('🌱 Starting database seed...\n');
  console.log(`   BCRYPT_ROUNDS = ${BCRYPT_ROUNDS}\n`);

  // -------------------------------------------------------------------------
  // 1. Specialties  (upsert on nameEn — the unique business key)
  // -------------------------------------------------------------------------
  console.log('🏥 Upserting specialties...');

  const specialtyData = [
    { id: S.specialties.cardiology,  nameEn: 'Cardiology',       nameVi: 'Tim mạch',               description: 'Diagnosis and treatment of cardiovascular diseases' },
    { id: S.specialties.dermatology, nameEn: 'Dermatology',      nameVi: 'Da liễu',                description: 'Diagnosis and treatment of skin conditions' },
    { id: S.specialties.pediatrics,  nameEn: 'Pediatrics',       nameVi: 'Nhi khoa',               description: 'Healthcare for children and adolescents' },
    { id: S.specialties.orthopedics, nameEn: 'Orthopedics',      nameVi: 'Chấn thương chỉnh hình', description: 'Treatment of musculoskeletal disorders' },
    { id: S.specialties.generalMed,  nameEn: 'General Medicine', nameVi: 'Đa khoa',                description: 'General and primary healthcare' },
  ];

  for (const sp of specialtyData) {
    await prisma.specialty.upsert({
      where:  { nameEn: sp.nameEn },
      create: { ...sp, isActive: true },
      update: { nameVi: sp.nameVi, description: sp.description, isActive: true },
    });
  }
  console.log(`✅ ${specialtyData.length} specialties\n`);

  // -------------------------------------------------------------------------
  // 2. Users  (upsert on email — the unique business key)
  //    Profiles are upserted separately on userId so relations are explicit.
  // -------------------------------------------------------------------------
  console.log('👤 Upserting users...');

  const adminHash   = await bcrypt.hash('Admin@123',   BCRYPT_ROUNDS);
  const doctorHash  = await bcrypt.hash('Doctor@123',  BCRYPT_ROUNDS);
  const patientHash = await bcrypt.hash('Patient@123', BCRYPT_ROUNDS);

  // Admin
  await prisma.user.upsert({
    where:  { email: 'admin@healthcare.com' },
    create: { id: S.users.admin, email: 'admin@healthcare.com', passwordHash: adminHash,   firstName: 'System',    lastName: 'Admin',  role: 'ADMIN',   isActive: true },
    update: { passwordHash: adminHash,   firstName: 'System',    lastName: 'Admin',  role: 'ADMIN',   isActive: true, deletedAt: null },
  });

  // Doctors
  const doctorUserData = [
    { id: S.users.doctor1, email: 'nguyen.van.hung@healthcare.com',  firstName: 'Nguyễn Văn', lastName: 'Hùng' },
    { id: S.users.doctor2, email: 'tran.thi.lan@healthcare.com',     firstName: 'Trần Thị',   lastName: 'Lan'  },
    { id: S.users.doctor3, email: 'le.van.minh@healthcare.com',      firstName: 'Lê Văn',     lastName: 'Minh' },
    { id: S.users.doctor4, email: 'pham.thi.nga@healthcare.com',     firstName: 'Phạm Thị',   lastName: 'Nga'  },
  ];
  for (const u of doctorUserData) {
    await prisma.user.upsert({
      where:  { email: u.email },
      create: { ...u, passwordHash: doctorHash,  role: 'DOCTOR', isActive: true },
      update: { passwordHash: doctorHash,  firstName: u.firstName, lastName: u.lastName, role: 'DOCTOR', isActive: true, deletedAt: null },
    });
  }

  // Patients
  const patientUserData = [
    { id: S.users.patient1, email: 'vo.van.nam@gmail.com',         firstName: 'Võ Văn',    lastName: 'Nam'  },
    { id: S.users.patient2, email: 'hoang.thi.thao@gmail.com',     firstName: 'Hoàng Thị', lastName: 'Thảo' },
    { id: S.users.patient3, email: 'nguyen.van.khanh@gmail.com',   firstName: 'Nguyễn Văn',lastName: 'Khánh' },
  ];
  for (const u of patientUserData) {
    await prisma.user.upsert({
      where:  { email: u.email },
      create: { ...u, passwordHash: patientHash, role: 'PATIENT', isActive: true },
      update: { passwordHash: patientHash, firstName: u.firstName, lastName: u.lastName, role: 'PATIENT', isActive: true, deletedAt: null },
    });
  }
  console.log('✅ 8 users (1 admin + 4 doctors + 3 patients)\n');

  // -------------------------------------------------------------------------
  // 3. Doctor profiles  (upsert on userId — unique FK)
  // -------------------------------------------------------------------------
  console.log('👨‍⚕️ Upserting doctor profiles...');

  // Build a representative schedule for doctor1: two blocks per day, next 5 working days.
  const now = new Date();
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + ((8 - now.getDay()) % 7 || 7));
  const seedSchedule = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(nextMonday);
    d.setDate(nextMonday.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    return [
      { date: dateStr, startTime: '08:00', endTime: '12:00', available: true },
      { date: dateStr, startTime: '14:00', endTime: '17:00', available: true },
    ];
  }).flat();

  const doctorProfileData = [
    {
      id: S.doctorProfiles.doctor1, userId: S.users.doctor1, specialtyId: S.specialties.cardiology,
      bio: 'Cardiologist with 15+ years of experience, specialising in preventive cardiology.',
      yearsOfExperience: 15, schedule: seedSchedule, scheduleUpdatedAt: new Date(),
    },
    {
      id: S.doctorProfiles.doctor2, userId: S.users.doctor2, specialtyId: S.specialties.dermatology,
      bio: 'Board-certified dermatologist specialising in medical and cosmetic dermatology.',
      yearsOfExperience: 10,
    },
    {
      id: S.doctorProfiles.doctor3, userId: S.users.doctor3, specialtyId: S.specialties.pediatrics,
      bio: 'Dedicated paediatrician providing comprehensive care for children of all ages.',
      yearsOfExperience: 8,
    },
    {
      id: S.doctorProfiles.doctor4, userId: S.users.doctor4, specialtyId: S.specialties.orthopedics,
      bio: 'Orthopaedic specialist with expertise in sports injury management.',
      yearsOfExperience: 12,
    },
  ];

  for (const dp of doctorProfileData) {
    await prisma.doctorProfile.upsert({
      where:  { userId: dp.userId },
      create: { ...dp, isActive: true },
      update: {
        specialtyId: dp.specialtyId,
        bio: dp.bio,
        yearsOfExperience: dp.yearsOfExperience,
        isActive: true,
        ...(dp.schedule ? { schedule: dp.schedule, scheduleUpdatedAt: dp.scheduleUpdatedAt } : {}),
      },
    });
  }
  console.log('✅ 4 doctor profiles\n');

  // -------------------------------------------------------------------------
  // 4. Patient profiles  (upsert on userId — unique FK)
  // -------------------------------------------------------------------------
  console.log('👥 Upserting patient profiles...');

  const patientProfileData = [
    {
      id: S.patientProfiles.patient1, userId: S.users.patient1,
      dateOfBirth: new Date('1990-05-15'), gender: 'MALE'   as const,
      phone: '0901234567', address: '123 Nguyen Hue, District 1, HCMC',
      medicalHistory: 'Allergy to penicillin',
    },
    {
      id: S.patientProfiles.patient2, userId: S.users.patient2,
      dateOfBirth: new Date('1985-08-20'), gender: 'FEMALE' as const,
      phone: '0912345678', address: '456 Le Loi, District 3, HCMC',
      medicalHistory: 'Hypertension, under treatment',
    },
    {
      id: S.patientProfiles.patient3, userId: S.users.patient3,
      dateOfBirth: new Date('1995-03-10'), gender: 'MALE'   as const,
      phone: '0923456789', address: '789 Tran Hung Dao, District 5, HCMC',
    },
  ];

  for (const pp of patientProfileData) {
    await prisma.patientProfile.upsert({
      where:  { userId: pp.userId },
      create: pp,
      update: {
        dateOfBirth: pp.dateOfBirth, gender: pp.gender,
        phone: pp.phone, address: pp.address,
        ...(pp.medicalHistory ? { medicalHistory: pp.medicalHistory } : {}),
      },
    });
  }
  console.log('✅ 3 patient profiles\n');

  // -------------------------------------------------------------------------
  // 5. Questions  (upsert on id — PK; no natural unique business key)
  //    originalDoctorId mirrors doctorId at creation time and is never updated.
  // -------------------------------------------------------------------------
  console.log('❓ Upserting questions...');

  const questionData = [
    {
      id: S.questions.q1, patientId: S.patientProfiles.patient1,
      doctorId: S.doctorProfiles.doctor1, originalDoctorId: S.doctorProfiles.doctor1,
      title: 'Chest pain during exercise', status: 'ANSWERED' as const,
      content: 'I often experience chest pain when exercising hard. Is that dangerous?',
    },
    {
      id: S.questions.q2, patientId: S.patientProfiles.patient2,
      doctorId: S.doctorProfiles.doctor2, originalDoctorId: S.doctorProfiles.doctor2,
      title: 'Persistent acne', status: 'ANSWERED' as const,
      content: 'I have tried many creams but my acne is not improving. What would you recommend?',
    },
    {
      id: S.questions.q3, patientId: S.patientProfiles.patient3,
      doctorId: S.doctorProfiles.doctor3, originalDoctorId: S.doctorProfiles.doctor3,
      title: 'Child with high fever', status: 'PENDING' as const,
      content: 'My 3-year-old has a 39°C fever. Should I take them to A&E?',
    },
    {
      id: S.questions.q4, patientId: S.patientProfiles.patient1,
      doctorId: null, originalDoctorId: null,
      title: 'Advice on healthy weight loss', status: 'PENDING' as const,
      content: 'I want to lose 5 kg in a healthy way. Any guidance?',
    },
    {
      id: S.questions.q5, patientId: S.patientProfiles.patient2,
      doctorId: S.doctorProfiles.doctor4, originalDoctorId: S.doctorProfiles.doctor4,
      title: 'Knee pain when running', status: 'ANSWERED' as const,
      content: 'My knee hurts after long runs. Should I use a brace?',
    },
    {
      id: S.questions.q6, patientId: S.patientProfiles.patient3,
      doctorId: S.doctorProfiles.doctor1, originalDoctorId: S.doctorProfiles.doctor1,
      title: 'High blood pressure management', status: 'MODERATED' as const,
      content: "My father (60) has BP 150/95. Does he need medication immediately?",
    },
  ];

  for (const q of questionData) {
    await prisma.question.upsert({
      where:  { id: q.id },
      create: q,
      // originalDoctorId is immutable — never updated after first insert.
      update: { title: q.title, content: q.content, status: q.status, doctorId: q.doctorId },
    });
  }
  console.log('✅ 6 questions\n');

  // -------------------------------------------------------------------------
  // 6. Answers  (upsert on id)
  // -------------------------------------------------------------------------
  console.log('💬 Upserting answers...');

  const answerData = [
    {
      id: S.answers.a1, questionId: S.questions.q1, doctorId: S.doctorProfiles.doctor1,
      isApproved: true,
      content: 'Chest pain during exercise may indicate a cardiac condition. Please visit a clinic for an ECG and echocardiogram. Avoid strenuous activity in the interim.',
    },
    {
      id: S.answers.a2, questionId: S.questions.q2, doctorId: S.doctorProfiles.doctor2,
      isApproved: true,
      content: 'Acne has many causes. Cleanse twice daily, avoid touching your face, and eat a balanced diet. If it persists, come in for a prescription treatment plan.',
    },
    {
      id: S.answers.a3, questionId: S.questions.q5, doctorId: S.doctorProfiles.doctor4,
      isApproved: false, // pending admin review
      content: 'Knee pain while running can have several causes. Rest, apply ice, and visit a clinic for assessment before resuming training. A brace may help but needs direct evaluation.',
    },
    {
      id: S.answers.a4, questionId: S.questions.q6, doctorId: S.doctorProfiles.doctor1,
      isApproved: true,
      content: 'BP 150/95 is Stage 1 hypertension. Lifestyle changes (reduced salt, exercise) are the first step, but medication may be needed. Please bring your father in for a consultation.',
    },
  ];

  for (const a of answerData) {
    await prisma.answer.upsert({
      where:  { id: a.id },
      create: a,
      update: { content: a.content, isApproved: a.isApproved },
    });
  }
  console.log('✅ 4 answers\n');

  // -------------------------------------------------------------------------
  // 7. Appointments  (upsert on id)
  // -------------------------------------------------------------------------
  console.log('📅 Upserting appointments...');

  const lastWeek     = new Date(now); lastWeek.setDate(now.getDate() - 7);  lastWeek.setHours(10, 0, 0, 0);
  const twoWeeksAgo  = new Date(now); twoWeeksAgo.setDate(now.getDate() - 14); twoWeeksAgo.setHours(9,  0, 0, 0);
  const threeDaysAgo = new Date(now); threeDaysAgo.setDate(now.getDate() - 3); threeDaysAgo.setHours(14, 0, 0, 0);
  const yesterday    = new Date(now); yesterday.setDate(now.getDate() - 1);  yesterday.setHours(9,  0, 0, 0);
  const tomorrow     = new Date(now); tomorrow.setDate(now.getDate() + 1);   tomorrow.setHours(10, 0, 0, 0);
  const threeDaysLater = new Date(now); threeDaysLater.setDate(now.getDate() + 3); threeDaysLater.setHours(15, 0, 0, 0);
  const nextWeek     = new Date(now); nextWeek.setDate(now.getDate() + 7);   nextWeek.setHours(14, 30, 0, 0);

  const appointmentData = [
    // ap1 — completed last week (will receive rating r1)
    { id: S.appointments.ap1, patientId: S.patientProfiles.patient1, doctorId: S.doctorProfiles.doctor1, scheduledAt: lastWeek,     status: 'COMPLETED' as const, reason: 'Routine cardiology follow-up',            notes: 'Patient stable, review in 3 months.' },
    // ap2 — completed 3 days ago (will receive rating r2)
    { id: S.appointments.ap2, patientId: S.patientProfiles.patient2, doctorId: S.doctorProfiles.doctor2, scheduledAt: threeDaysAgo, status: 'COMPLETED' as const, reason: 'Acne treatment and skin care consultation', notes: 'Prescription issued. Review in 2 weeks.' },
    // ap3 — completed 2 weeks ago (will receive rating r3 — HIDDEN)
    { id: S.appointments.ap3, patientId: S.patientProfiles.patient3, doctorId: S.doctorProfiles.doctor4, scheduledAt: twoWeeksAgo,  status: 'COMPLETED' as const, reason: 'Ankle injury assessment',                   notes: 'Dressed and bandaged. Review in 1 week.' },
    // ap4 — confirmed tomorrow
    { id: S.appointments.ap4, patientId: S.patientProfiles.patient2, doctorId: S.doctorProfiles.doctor3, scheduledAt: tomorrow,      status: 'CONFIRMED'  as const, reason: 'Child wellness check' },
    // ap5 — confirmed in 3 days
    { id: S.appointments.ap5, patientId: S.patientProfiles.patient3, doctorId: S.doctorProfiles.doctor2, scheduledAt: threeDaysLater, status: 'CONFIRMED' as const, reason: 'Skin allergy treatment' },
    // ap6 — pending next week
    { id: S.appointments.ap6, patientId: S.patientProfiles.patient3, doctorId: S.doctorProfiles.doctor3, scheduledAt: nextWeek,      status: 'PENDING'    as const, reason: 'Routine child health check' },
    // ap7 — cancelled yesterday
    { id: S.appointments.ap7, patientId: S.patientProfiles.patient1, doctorId: S.doctorProfiles.doctor4, scheduledAt: yesterday,     status: 'CANCELLED'  as const, reason: 'Knee pain evaluation',                     notes: 'Patient cancelled due to scheduling conflict.' },
  ];

  for (const ap of appointmentData) {
    await prisma.appointment.upsert({
      where:  { id: ap.id },
      create: { ...ap, durationMinutes: 60 },
      update: { status: ap.status, scheduledAt: ap.scheduledAt, notes: ap.notes ?? null },
    });
  }
  console.log('✅ 7 appointments (3 completed, 2 confirmed, 1 pending, 1 cancelled)\n');

  // -------------------------------------------------------------------------
  // 8. Ratings  (upsert on appointmentId — unique FK)
  //    Only COMPLETED appointments may be rated.
  //    score must be 1-5 (enforced by DB CHECK constraint chk_ratings_score).
  // -------------------------------------------------------------------------
  console.log('⭐ Upserting ratings...');

  const ratingData = [
    {
      id: S.ratings.r1, appointmentId: S.appointments.ap1,
      patientId: S.patientProfiles.patient1, doctorId: S.doctorProfiles.doctor1,
      score: 5, status: 'VISIBLE' as const,
      comment: 'Very professional and thorough. Explained everything clearly. Highly recommend.',
    },
    {
      id: S.ratings.r2, appointmentId: S.appointments.ap2,
      patientId: S.patientProfiles.patient2, doctorId: S.doctorProfiles.doctor2,
      score: 4, status: 'VISIBLE' as const,
      comment: 'Excellent advice and effective prescription. Waiting time was a bit long.',
    },
    {
      id: S.ratings.r3, appointmentId: S.appointments.ap3,
      patientId: S.patientProfiles.patient3, doctorId: S.doctorProfiles.doctor4,
      score: 2, status: 'HIDDEN' as const, // hidden by admin moderation
      comment: 'Wait time was excessive and attitude was poor.',
    },
  ];

  for (const r of ratingData) {
    await prisma.rating.upsert({
      where:  { appointmentId: r.appointmentId },
      create: r,
      update: { score: r.score, comment: r.comment, status: r.status },
    });
  }
  console.log('✅ 3 ratings (2 visible, 1 hidden)\n');

  // -------------------------------------------------------------------------
  // 9. Recalculate doctor rating aggregates from actual seed ratings
  //    Mirrors the production logic: only VISIBLE ratings are counted.
  // -------------------------------------------------------------------------
  console.log('📊 Recalculating doctor rating statistics...');

  const doctorProfileIds = Object.values(S.doctorProfiles);
  await Promise.all(
    doctorProfileIds.map(async (dpId) => {
      const agg = await prisma.rating.aggregate({
        where:  { doctorId: dpId, status: 'VISIBLE' },
        _avg:   { score: true },
        _count: { score: true },
      });
      await prisma.doctorProfile.update({
        where: { id: dpId },
        data:  { ratingAverage: agg._avg.score ?? 0, ratingCount: agg._count.score },
      });
    }),
  );
  console.log('✅ Doctor ratings recalculated\n');

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🎉 Database seed completed successfully!');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📋 Test Credentials\n');
  console.log('👨‍💼 ADMIN:');
  console.log('   Email:    admin@healthcare.com');
  console.log('   Password: Admin@123\n');
  console.log('👨‍⚕️ DOCTORS  (Password: Doctor@123):');
  console.log('   1. nguyen.van.hung@healthcare.com  — Nguyễn Văn Hùng (Cardiology)');
  console.log('   2. tran.thi.lan@healthcare.com     — Trần Thị Lan     (Dermatology)');
  console.log('   3. le.van.minh@healthcare.com      — Lê Văn Minh      (Pediatrics)');
  console.log('   4. pham.thi.nga@healthcare.com     — Phạm Thị Nga     (Orthopedics)\n');
  console.log('👥 PATIENTS  (Password: Patient@123):');
  console.log('   1. vo.van.nam@gmail.com         — Võ Văn Nam');
  console.log('   2. hoang.thi.thao@gmail.com     — Hoàng Thị Thảo');
  console.log('   3. nguyen.van.khanh@gmail.com   — Nguyễn Văn Khánh\n');
  console.log('📊 Sample Data:');
  console.log('   Specialties:  5');
  console.log('   Users:        8  (1 admin + 4 doctors + 3 patients)');
  console.log('   Questions:    6  (2 answered-approved, 1 answered-pending-review, 1 moderated, 2 pending)');
  console.log('   Answers:      4  (3 approved, 1 pending review)');
  console.log('   Appointments: 7  (3 completed, 2 confirmed, 1 pending, 1 cancelled)');
  console.log('   Ratings:      3  (2 visible, 1 hidden)\n');
  console.log('═══════════════════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

