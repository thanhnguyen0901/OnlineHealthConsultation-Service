import {
  AppointmentStatus,
  ApprovalStatus,
  ConsultationStatus,
  Gender,
  Prisma,
  PrismaClient,
  QuestionStatus,
  RatingStatus,
  Role,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { uuidv7 } from 'uuidv7';

const prisma = new PrismaClient();

const E2E = 'E2E';
const passwords = {
  admin: 'Admin@123',
  patient: 'Patient@123',
  doctor: 'Doctor@123',
};

type SeedUser = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
};

type PatientProfileSeedPatch = {
  dateOfBirth?: Date;
  gender?: Gender;
  phone?: string;
  address?: string;
  medicalHistory?: string;
};

type DoctorProfileSeedPatch = {
  approvalStatus: ApprovalStatus;
  isActive: boolean;
  bio?: string;
  yearsOfExperience?: number;
  schedule?: Prisma.InputJsonValue;
};

const addDays = (days: number, hour = 9, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date;
};

const addMinutes = (minutes: number) => new Date(Date.now() + minutes * 60 * 1000);

async function hashPassword(password: string) {
  const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS ?? '10', 10);
  return bcrypt.hash(password, bcryptRounds);
}

async function upsertUser(input: SeedUser) {
  const passwordHash = await hashPassword(input.password);

  return prisma.user.upsert({
    where: { email: input.email },
    create: {
      id: uuidv7(),
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      isActive: true,
      deletedAt: null,
    },
    update: {
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      isActive: true,
      deletedAt: null,
    },
  });
}

async function ensurePatientProfile(userId: string, patch: PatientProfileSeedPatch = {}) {
  const existing = await prisma.patientProfile.findUnique({ where: { userId } });
  const data = {
    dateOfBirth: new Date('1995-05-20T00:00:00.000Z'),
    gender: Gender.OTHER,
    phone: '0900000000',
    address: `${E2E} Test Address`,
    medicalHistory: `${E2E} seeded patient profile for Playwright tests`,
    ...patch,
  };

  if (existing) {
    return prisma.patientProfile.update({
      where: { userId },
      data,
    });
  }

  return prisma.patientProfile.create({
    data: {
      id: uuidv7(),
      userId,
      ...data,
    },
  });
}

async function ensureDoctorProfile(
  userId: string,
  patch: DoctorProfileSeedPatch,
) {
  const existing = await prisma.doctorProfile.findUnique({ where: { userId } });
  const data = {
    bio:
      patch.bio ??
      `${E2E} cardiology and general medicine doctor for Playwright public discovery and booking tests.`,
    yearsOfExperience: patch.yearsOfExperience ?? 8,
    approvalStatus: patch.approvalStatus,
    isActive: patch.isActive,
    schedule:
      patch.schedule ??
      ({
        timezone: 'Asia/Ho_Chi_Minh',
        weekly: [
          { dayOfWeek: 1, startTime: '08:00', endTime: '17:00' },
          { dayOfWeek: 2, startTime: '08:00', endTime: '17:00' },
          { dayOfWeek: 3, startTime: '08:00', endTime: '17:00' },
          { dayOfWeek: 4, startTime: '08:00', endTime: '17:00' },
          { dayOfWeek: 5, startTime: '08:00', endTime: '17:00' },
        ],
      } satisfies Prisma.InputJsonValue),
    scheduleUpdatedAt: new Date(),
  };

  if (existing) {
    return prisma.doctorProfile.update({
      where: { userId },
      data,
    });
  }

  return prisma.doctorProfile.create({
    data: {
      id: uuidv7(),
      userId,
      ...data,
    },
  });
}

async function upsertSpecialty(nameEn: string, nameVi: string, description: string) {
  return prisma.specialty.upsert({
    where: { nameEn },
    create: {
      id: uuidv7(),
      nameEn,
      nameVi,
      description,
      isActive: true,
    },
    update: {
      nameVi,
      description,
      isActive: true,
    },
  });
}

async function resetDoctorSpecialties(doctorId: string, specialtyIds: string[]) {
  await prisma.doctorSpecialty.deleteMany({ where: { doctorId } });
  await prisma.doctorSpecialty.createMany({
    data: specialtyIds.map((specialtyId) => ({
      id: uuidv7(),
      doctorId,
      specialtyId,
    })),
    skipDuplicates: true,
  });
}

async function upsertAppointmentByMarker(input: {
  marker: string;
  patientId: string;
  doctorId: string;
  scheduledAt: Date;
  durationMinutes?: number;
  status: AppointmentStatus;
  reason: string;
  notes: string;
}) {
  const existing = await prisma.appointment.findFirst({
    where: {
      patientId: input.patientId,
      doctorId: input.doctorId,
      notes: { contains: input.marker },
    },
  });

  const data = {
    patientId: input.patientId,
    doctorId: input.doctorId,
    scheduledAt: input.scheduledAt,
    durationMinutes: input.durationMinutes ?? 60,
    status: input.status,
    reason: input.reason,
    notes: `${E2E} ${input.marker} - ${input.notes}`,
  };

  if (existing) {
    return prisma.appointment.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.appointment.create({
    data: {
      id: uuidv7(),
      ...data,
    },
  });
}

async function ensureConsultationSession(input: {
  appointmentId: string;
  status: ConsultationStatus;
  summary?: string;
  channel?: string;
  startedAt?: Date;
  endedAt?: Date | null;
}) {
  return prisma.consultationSession.upsert({
    where: { appointmentId: input.appointmentId },
    create: {
      id: uuidv7(),
      appointmentId: input.appointmentId,
      status: input.status,
      startedAt: input.startedAt ?? new Date(),
      endedAt: input.endedAt,
      summary: input.summary,
      channel: input.channel ?? 'CHAT',
    },
    update: {
      status: input.status,
      startedAt: input.startedAt ?? new Date(),
      endedAt: input.endedAt,
      summary: input.summary,
      channel: input.channel ?? 'CHAT',
    },
  });
}

async function ensureMessages(sessionId: string, senderUserId: string) {
  const marker = `${E2E} consultation message`;
  await prisma.consultationMessage.deleteMany({
    where: {
      consultationSessionId: sessionId,
      content: { startsWith: marker },
    },
  });

  await prisma.consultationMessage.createMany({
    data: [
      {
        id: uuidv7(),
        consultationSessionId: sessionId,
        senderUserId,
        content: `${marker}: Hello, this is seeded chat history.`,
      },
      {
        id: uuidv7(),
        consultationSessionId: sessionId,
        senderUserId,
        content: `${marker}: Please follow the prescription instructions.`,
      },
    ],
  });
}

async function ensurePrescription(sessionId: string) {
  const prescription = await prisma.prescription.upsert({
    where: { sessionId },
    create: {
      id: uuidv7(),
      sessionId,
      notes: `${E2E} prescription notes`,
    },
    update: {
      notes: `${E2E} prescription notes`,
    },
  });

  await prisma.prescriptionItem.deleteMany({ where: { prescriptionId: prescription.id } });
  await prisma.prescriptionItem.createMany({
    data: [
      {
        id: uuidv7(),
        prescriptionId: prescription.id,
        medicationName: `${E2E} Medicine A`,
        dosage: '1 tablet',
        frequency: 'Twice daily',
        duration: '5 days',
        notes: 'After meals',
      },
    ],
  });

  return prescription;
}

async function ensureRating(input: {
  patientId: string;
  doctorId: string;
  appointmentId: string;
}) {
  return prisma.rating.upsert({
    where: { appointmentId: input.appointmentId },
    create: {
      id: uuidv7(),
      patientId: input.patientId,
      doctorId: input.doctorId,
      appointmentId: input.appointmentId,
      score: 5,
      comment: `${E2E} excellent consultation`,
      status: RatingStatus.VISIBLE,
    },
    update: {
      patientId: input.patientId,
      doctorId: input.doctorId,
      score: 5,
      comment: `${E2E} excellent consultation`,
      status: RatingStatus.VISIBLE,
    },
  });
}

async function upsertQuestionByTitle(input: {
  title: string;
  patientId: string;
  doctorId?: string | null;
  content: string;
  status: QuestionStatus;
}) {
  const existing = await prisma.question.findFirst({
    where: {
      patientId: input.patientId,
      title: input.title,
    },
  });

  if (existing) {
    return prisma.question.update({
      where: { id: existing.id },
      data: {
        doctorId: input.doctorId,
        content: input.content,
        status: input.status,
      },
    });
  }

  return prisma.question.create({
    data: {
      id: uuidv7(),
      patientId: input.patientId,
      doctorId: input.doctorId,
      title: input.title,
      content: input.content,
      status: input.status,
    },
  });
}

async function ensureAnswer(questionId: string, doctorId: string) {
  await prisma.answer.deleteMany({ where: { questionId } });
  return prisma.answer.create({
    data: {
      id: uuidv7(),
      questionId,
      doctorId,
      content: `${E2E} doctor answer: Please monitor symptoms and book a consultation if it persists.`,
      isApproved: true,
    },
  });
}

async function main() {
  const [
    adminUser,
    patientUser,
    otherPatientUser,
    doctorUser,
    pendingDoctorUser,
    otherDoctorUser,
  ] = await Promise.all([
    upsertUser({
      email: 'admin@healthcare.local',
      password: passwords.admin,
      firstName: 'System',
      lastName: 'Admin',
      role: Role.ADMIN,
    }),
    upsertUser({
      email: 'patient.e2e@healthcare.local',
      password: passwords.patient,
      firstName: 'E2E',
      lastName: 'Patient',
      role: Role.PATIENT,
    }),
    upsertUser({
      email: 'patient.other.e2e@healthcare.local',
      password: passwords.patient,
      firstName: 'E2E Other',
      lastName: 'Patient',
      role: Role.PATIENT,
    }),
    upsertUser({
      email: 'doctor.e2e@healthcare.local',
      password: passwords.doctor,
      firstName: 'E2E',
      lastName: 'Cardiology Doctor',
      role: Role.DOCTOR,
    }),
    upsertUser({
      email: 'doctor.pending.e2e@healthcare.local',
      password: passwords.doctor,
      firstName: 'E2E Pending',
      lastName: 'Doctor',
      role: Role.DOCTOR,
    }),
    upsertUser({
      email: 'doctor.other.e2e@healthcare.local',
      password: passwords.doctor,
      firstName: 'E2E Other',
      lastName: 'Doctor',
      role: Role.DOCTOR,
    }),
  ]);

  const [patient, otherPatient] = await Promise.all([
    ensurePatientProfile(patientUser.id, { phone: '0900000001' }),
    ensurePatientProfile(otherPatientUser.id, { phone: '0900000002' }),
  ]);

  const [
    generalMedicine,
    cardiology,
    pediatrics,
    dermatology,
    disposableSpecialty,
  ] = await Promise.all([
    upsertSpecialty(
      `${E2E} General Medicine`,
      'Y hoc tong quat E2E',
      `${E2E} general medicine specialty`,
    ),
    upsertSpecialty(`${E2E} Cardiology`, 'Tim mach E2E', `${E2E} cardiology specialty`),
    upsertSpecialty(`${E2E} Pediatrics`, 'Nhi khoa E2E', `${E2E} pediatrics specialty`),
    upsertSpecialty(`${E2E} Dermatology`, 'Da lieu E2E', `${E2E} dermatology specialty`),
    upsertSpecialty(
      `${E2E} Disposable Specialty`,
      'Chuyen khoa tam E2E',
      `${E2E} disposable specialty for admin mutation tests`,
    ),
  ]);

  const [doctor, pendingDoctor, otherDoctor] = await Promise.all([
    ensureDoctorProfile(doctorUser.id, {
      approvalStatus: ApprovalStatus.APPROVED,
      isActive: true,
      bio: `${E2E} cardiology doctor for public discovery, appointments, consultation and rating tests.`,
      yearsOfExperience: 9,
    }),
    ensureDoctorProfile(pendingDoctorUser.id, {
      approvalStatus: ApprovalStatus.PENDING,
      isActive: false,
      bio: `${E2E} pending pediatric doctor for admin approval tests.`,
      yearsOfExperience: 3,
    }),
    ensureDoctorProfile(otherDoctorUser.id, {
      approvalStatus: ApprovalStatus.APPROVED,
      isActive: true,
      bio: `${E2E} dermatology doctor for ownership negative tests.`,
      yearsOfExperience: 5,
    }),
  ]);

  await Promise.all([
    resetDoctorSpecialties(doctor.id, [generalMedicine.id, cardiology.id]),
    resetDoctorSpecialties(pendingDoctor.id, [pediatrics.id]),
    resetDoctorSpecialties(otherDoctor.id, [dermatology.id]),
  ]);

  await prisma.specialty.update({
    where: { id: disposableSpecialty.id },
    data: {
      nameVi: 'Chuyen khoa tam E2E',
      description: `${E2E} disposable specialty for admin mutation tests`,
      isActive: true,
    },
  });

  const pendingAppointment = await upsertAppointmentByMarker({
    marker: 'Pending Appointment',
    patientId: patient.id,
    doctorId: doctor.id,
    scheduledAt: addDays(2, 9),
    status: AppointmentStatus.PENDING_CONFIRMATION,
    reason: `${E2E} Pending Appointment`,
    notes: 'used for appointment detail and doctor confirm tests',
  });

  const confirmedAppointment = await upsertAppointmentByMarker({
    marker: 'Confirmed Appointment',
    patientId: patient.id,
    doctorId: doctor.id,
    scheduledAt: addDays(3, 10),
    status: AppointmentStatus.CONFIRMED,
    reason: `${E2E} Confirmed Appointment`,
    notes: 'used for doctor complete tests',
  });

  const cancellableAppointment = await upsertAppointmentByMarker({
    marker: 'Cancellable Appointment',
    patientId: patient.id,
    doctorId: doctor.id,
    scheduledAt: addDays(4, 11),
    status: AppointmentStatus.PENDING_CONFIRMATION,
    reason: `${E2E} Cancellable Appointment`,
    notes: 'disposable record for patient cancel tests',
  });

  const completedAppointment = await upsertAppointmentByMarker({
    marker: 'Completed Appointment',
    patientId: patient.id,
    doctorId: doctor.id,
    scheduledAt: addDays(-7, 9),
    status: AppointmentStatus.COMPLETED,
    reason: `${E2E} Completed Appointment`,
    notes: 'used for patient consultation result, prescription and rating history',
  });

  const consultationAppointment = await upsertAppointmentByMarker({
    marker: 'Consultation Workflow Appointment',
    patientId: patient.id,
    doctorId: doctor.id,
    scheduledAt: addMinutes(5),
    status: AppointmentStatus.COMPLETED,
    reason: `${E2E} Consultation Workflow Appointment`,
    notes: 'disposable completed appointment for consultation summary and prescription tests',
  });

  const otherPatientAppointment = await upsertAppointmentByMarker({
    marker: 'Other Patient Appointment',
    patientId: otherPatient.id,
    doctorId: otherDoctor.id,
    scheduledAt: addDays(5, 14),
    status: AppointmentStatus.CONFIRMED,
    reason: `${E2E} Other Patient Appointment`,
    notes: 'optional ownership negative record',
  });

  const completedSession = await ensureConsultationSession({
    appointmentId: completedAppointment.id,
    status: ConsultationStatus.COMPLETED,
    startedAt: addDays(-7, 9),
    endedAt: addDays(-7, 10),
    summary: `${E2E} consultation summary for completed appointment.`,
    channel: 'CHAT',
  });

  const workflowSession = await ensureConsultationSession({
    appointmentId: consultationAppointment.id,
    status: ConsultationStatus.COMPLETED,
    startedAt: new Date(),
    endedAt: null,
    summary: `${E2E} consultation workflow summary.`,
    channel: 'CHAT',
  });

  await Promise.all([
    ensureMessages(completedSession.id, doctorUser.id),
    ensureMessages(workflowSession.id, doctorUser.id),
    ensurePrescription(completedSession.id),
    ensurePrescription(workflowSession.id),
    ensureRating({
      patientId: patient.id,
      doctorId: doctor.id,
      appointmentId: completedAppointment.id,
    }),
  ]);

  const pendingQuestion = await upsertQuestionByTitle({
    title: `${E2E} Pending Question`,
    patientId: patient.id,
    doctorId: doctor.id,
    content: `${E2E} pending question for doctor answer workflow.`,
    status: QuestionStatus.PENDING,
  });
  await prisma.answer.deleteMany({ where: { questionId: pendingQuestion.id } });

  const answeredQuestion = await upsertQuestionByTitle({
    title: `${E2E} Answered Question`,
    patientId: patient.id,
    doctorId: doctor.id,
    content: `${E2E} answered question for patient history.`,
    status: QuestionStatus.ANSWERED,
  });
  await ensureAnswer(answeredQuestion.id, doctor.id);

  await upsertQuestionByTitle({
    title: `${E2E} Other Patient Question`,
    patientId: otherPatient.id,
    doctorId: otherDoctor.id,
    content: `${E2E} optional ownership negative question.`,
    status: QuestionStatus.PENDING,
  });

  const env = {
    E2E_RUN_SEEDED: 'true',
    E2E_PATIENT_EMAIL: patientUser.email,
    E2E_PATIENT_PASSWORD: passwords.patient,
    E2E_DOCTOR_EMAIL: doctorUser.email,
    E2E_DOCTOR_PASSWORD: passwords.doctor,
    E2E_ADMIN_EMAIL: adminUser.email,
    E2E_ADMIN_PASSWORD: passwords.admin,
    E2E_APPROVED_DOCTOR_EMAIL: doctorUser.email,
    E2E_PENDING_DOCTOR_EMAIL: pendingDoctorUser.email,
    E2E_APPROVED_DOCTOR_ID: doctor.id,
    E2E_PENDING_DOCTOR_ID: pendingDoctor.id,
    E2E_APPOINTMENT_ID: pendingAppointment.id,
    E2E_CONFIRMED_APPOINTMENT_ID: confirmedAppointment.id,
    E2E_COMPLETED_APPOINTMENT_ID: completedAppointment.id,
    E2E_CONSULTATION_APPOINTMENT_ID: consultationAppointment.id,
    E2E_DOCTOR_SEARCH_KEYWORD: 'cardiology',
    E2E_SPECIALTY_NAME: `${E2E} Cardiology`,
  };

  console.log('E2E seed completed.');
  console.log('Use these environment variables for Playwright:');
  Object.entries(env).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });
  console.log(`E2E_CANCELLABLE_APPOINTMENT_ID=${cancellableAppointment.id}`);
  console.log(`E2E_OTHER_PATIENT_APPOINTMENT_ID=${otherPatientAppointment.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
