import {
  AppointmentStatus,
  ApprovalStatus,
  ConsultationStatus,
  Gender,
  NotificationStatus,
  NotificationType,
  Prisma,
  PrismaClient,
  QuestionStatus,
  RatingStatus,
  Role,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { uuidv7 } from 'uuidv7';

const prisma = new PrismaClient();

const passwords = {
  admin: 'Admin@123',
  patient: 'Patient@123',
  doctor: 'Doctor@123',
};

type SpecialtySeed = {
  key: string;
  nameEn: string;
  nameVi: string;
  description: string;
};

type UserSeed = {
  key: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
};

type PatientSeed = UserSeed & {
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  address: string;
  medicalHistory: string;
};

type DoctorSeed = UserSeed & {
  bio: string;
  yearsOfExperience: number;
  approvalStatus: ApprovalStatus;
  isActive: boolean;
  specialtyKeys: string[];
  schedule: Prisma.InputJsonValue;
};

const addDays = (days: number, hour = 9, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date;
};

const weeklySchedule = (
  workDays: number[],
  startTime = '08:00',
  endTime = '17:00',
): Prisma.InputJsonValue => ({
  timezone: 'Asia/Ho_Chi_Minh',
  weekly: workDays.map((dayOfWeek) => ({
    dayOfWeek,
    startTime,
    endTime,
  })),
});

const hashPassword = async (password: string) => {
  const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS ?? '10', 10);
  return bcrypt.hash(password, bcryptRounds);
};

async function cleanupDatabase() {
  await prisma.fileAttachment.deleteMany();
  await prisma.prescriptionItem.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.consultationMessage.deleteMany();
  await prisma.consultationSession.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.questionModeration.deleteMany();
  await prisma.question.deleteMany();
  await prisma.doctorSpecialty.deleteMany();
  await prisma.notificationLog.deleteMany();
  await prisma.outboxEvent.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.userSession.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.doctorProfile.deleteMany();
  await prisma.specialty.deleteMany();
  await prisma.user.deleteMany();
}

async function createUser(input: UserSeed) {
  return prisma.user.create({
    data: {
      id: uuidv7(),
      email: input.email,
      passwordHash: await hashPassword(input.password),
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      isActive: true,
      deletedAt: null,
    },
  });
}

async function createPatient(input: PatientSeed) {
  const user = await createUser(input);
  const profile = await prisma.patientProfile.create({
    data: {
      id: uuidv7(),
      userId: user.id,
      dateOfBirth: new Date(input.dateOfBirth),
      gender: input.gender,
      phone: input.phone,
      address: input.address,
      medicalHistory: input.medicalHistory,
    },
  });

  return { user, profile };
}

async function createDoctor(input: DoctorSeed) {
  const user = await createUser(input);
  const profile = await prisma.doctorProfile.create({
    data: {
      id: uuidv7(),
      userId: user.id,
      bio: input.bio,
      yearsOfExperience: input.yearsOfExperience,
      approvalStatus: input.approvalStatus,
      isActive: input.isActive,
      schedule: input.schedule,
      scheduleUpdatedAt: new Date(),
    },
  });

  return { user, profile, specialtyKeys: input.specialtyKeys };
}

async function createConsultation(input: {
  appointmentId: string;
  patientUserId: string;
  doctorUserId: string;
  status: ConsultationStatus;
  startedAt: Date;
  endedAt?: Date | null;
  summary: string;
  prescriptionNotes: string;
  prescriptionItems: Array<{
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
  }>;
}) {
  const session = await prisma.consultationSession.create({
    data: {
      id: uuidv7(),
      appointmentId: input.appointmentId,
      status: input.status,
      startedAt: input.startedAt,
      endedAt: input.endedAt,
      summary: input.summary,
      channel: 'CHAT',
    },
  });

  await prisma.consultationMessage.createMany({
    data: [
      {
        id: uuidv7(),
        consultationSessionId: session.id,
        senderUserId: input.patientUserId,
        content: 'Chào bác sĩ, gần đây tôi thấy triệu chứng xuất hiện thường xuyên hơn và muốn được tư vấn kỹ.',
      },
      {
        id: uuidv7(),
        consultationSessionId: session.id,
        senderUserId: input.doctorUserId,
        content: 'Tôi đã ghi nhận triệu chứng. Anh/chị vui lòng theo dõi thêm chỉ số hằng ngày và dùng thuốc đúng hướng dẫn.',
      },
    ],
  });

  const prescription = await prisma.prescription.create({
    data: {
      id: uuidv7(),
      sessionId: session.id,
      notes: input.prescriptionNotes,
    },
  });

  await prisma.prescriptionItem.createMany({
    data: input.prescriptionItems.map((item) => ({
      id: uuidv7(),
      prescriptionId: prescription.id,
      ...item,
    })),
  });

  return session;
}

const specialties: SpecialtySeed[] = [
  {
    key: 'general',
    nameEn: 'General Medicine',
    nameVi: 'Nội tổng quát',
    description:
      'Khám và tư vấn các vấn đề sức khỏe thường gặp như sốt, mệt mỏi, rối loạn tiêu hóa, đau đầu, theo dõi bệnh mạn tính.',
  },
  {
    key: 'cardiology',
    nameEn: 'Cardiology',
    nameVi: 'Tim mạch',
    description:
      'Tư vấn tăng huyết áp, rối loạn nhịp tim, đau ngực, kiểm soát mỡ máu và theo dõi sau can thiệp tim mạch.',
  },
  {
    key: 'pediatrics',
    nameEn: 'Pediatrics',
    nameVi: 'Nhi khoa',
    description:
      'Chăm sóc sức khỏe trẻ em, tư vấn sốt, ho, dinh dưỡng, lịch tiêm chủng và theo dõi phát triển theo độ tuổi.',
  },
  {
    key: 'dermatology',
    nameEn: 'Dermatology',
    nameVi: 'Da liễu',
    description:
      'Tư vấn mụn trứng cá, viêm da cơ địa, dị ứng, nấm da, chăm sóc da và theo dõi tổn thương da cần khám chuyên sâu.',
  },
  {
    key: 'endocrinology',
    nameEn: 'Endocrinology',
    nameVi: 'Nội tiết',
    description:
      'Theo dõi đái tháo đường, rối loạn tuyến giáp, rối loạn chuyển hóa, tư vấn chế độ ăn và dùng thuốc lâu dài.',
  },
  {
    key: 'obgyn',
    nameEn: 'Obstetrics and Gynecology',
    nameVi: 'Sản phụ khoa',
    description:
      'Tư vấn sức khỏe phụ nữ, thai kỳ, rối loạn kinh nguyệt, viêm nhiễm phụ khoa và kế hoạch chăm sóc trước sinh.',
  },
  {
    key: 'mental',
    nameEn: 'Mental Health',
    nameVi: 'Sức khỏe tinh thần',
    description:
      'Tư vấn căng thẳng, mất ngủ, lo âu, cân bằng công việc - cuộc sống và định hướng khi cần gặp chuyên gia tâm lý.',
  },
  {
    key: 'nutrition',
    nameEn: 'Nutrition',
    nameVi: 'Dinh dưỡng',
    description:
      'Tư vấn dinh dưỡng cho người bệnh mạn tính, giảm cân an toàn, tăng cân, thực đơn gia đình và bổ sung vi chất.',
  },
];

const adminSeed: UserSeed = {
  key: 'admin',
  email: 'admin@healthcare.local',
  password: passwords.admin,
  firstName: 'Quản trị',
  lastName: 'Hệ thống',
  role: Role.ADMIN,
};

const patients: PatientSeed[] = [
  {
    key: 'patient-lan',
    email: 'lan.nguyen@healthcare.local',
    password: passwords.patient,
    firstName: 'Lan',
    lastName: 'Nguyễn',
    role: Role.PATIENT,
    dateOfBirth: '1992-04-12T00:00:00.000Z',
    gender: Gender.FEMALE,
    phone: '0901234567',
    address: '25 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh',
    medicalHistory:
      'Dị ứng nhẹ với hải sản, từng viêm dạ dày năm 2021. Hiện đang theo dõi huyết áp tại nhà.',
  },
  {
    key: 'patient-minh',
    email: 'minh.tran@healthcare.local',
    password: passwords.patient,
    firstName: 'Minh',
    lastName: 'Trần',
    role: Role.PATIENT,
    dateOfBirth: '1985-09-18T00:00:00.000Z',
    gender: Gender.MALE,
    phone: '0912345678',
    address: '102 Lê Văn Sỹ, Quận Phú Nhuận, TP. Hồ Chí Minh',
    medicalHistory:
      'Đái tháo đường type 2 đang dùng Metformin, cần tư vấn kiểm soát đường huyết và chế độ ăn.',
  },
  {
    key: 'patient-ha',
    email: 'ha.le@healthcare.local',
    password: passwords.patient,
    firstName: 'Hà',
    lastName: 'Lê',
    role: Role.PATIENT,
    dateOfBirth: '1998-01-05T00:00:00.000Z',
    gender: Gender.FEMALE,
    phone: '0923456789',
    address: '18 Hoàng Diệu, Quận Hải Châu, Đà Nẵng',
    medicalHistory:
      'Không ghi nhận bệnh mạn tính. Thường bị viêm mũi dị ứng khi thay đổi thời tiết.',
  },
  {
    key: 'patient-quang',
    email: 'quang.pham@healthcare.local',
    password: passwords.patient,
    firstName: 'Quang',
    lastName: 'Phạm',
    role: Role.PATIENT,
    dateOfBirth: '1978-11-30T00:00:00.000Z',
    gender: Gender.MALE,
    phone: '0934567890',
    address: '77 Trần Hưng Đạo, Quận Hoàn Kiếm, Hà Nội',
    medicalHistory:
      'Tăng huyết áp 5 năm, đang dùng thuốc đều. Có tiền sử gia đình mắc bệnh tim mạch.',
  },
  {
    key: 'patient-thao',
    email: 'thao.vo@healthcare.local',
    password: passwords.patient,
    firstName: 'Thảo',
    lastName: 'Võ',
    role: Role.PATIENT,
    dateOfBirth: '1990-07-22T00:00:00.000Z',
    gender: Gender.FEMALE,
    phone: '0945678901',
    address: '45 Nguyễn Văn Cừ, Quận Ninh Kiều, Cần Thơ',
    medicalHistory:
      'Đang mang thai tuần 18, cần tư vấn theo dõi thai kỳ và bổ sung dinh dưỡng.',
  },
  {
    key: 'patient-duc',
    email: 'duc.do@healthcare.local',
    password: passwords.patient,
    firstName: 'Đức',
    lastName: 'Đỗ',
    role: Role.PATIENT,
    dateOfBirth: '2001-03-14T00:00:00.000Z',
    gender: Gender.MALE,
    phone: '0956789012',
    address: '9 Phan Chu Trinh, TP. Đà Lạt, Lâm Đồng',
    medicalHistory:
      'Sinh viên, hay thức khuya, gần đây mất ngủ và căng thẳng trước kỳ thi.',
  },
];

const doctors: DoctorSeed[] = [
  {
    key: 'doctor-an',
    email: 'bs.an.nguyen@healthcare.local',
    password: passwords.doctor,
    firstName: 'An',
    lastName: 'Nguyễn',
    role: Role.DOCTOR,
    bio:
      'Bác sĩ chuyên khoa Nội tổng quát với kinh nghiệm khám bệnh mạn tính, tư vấn dùng thuốc an toàn và theo dõi sức khỏe gia đình. Phong cách tư vấn rõ ràng, dễ hiểu, ưu tiên kế hoạch chăm sóc thực tế.',
    yearsOfExperience: 12,
    approvalStatus: ApprovalStatus.APPROVED,
    isActive: true,
    specialtyKeys: ['general', 'nutrition'],
    schedule: weeklySchedule([1, 2, 3, 4, 5], '08:00', '16:30'),
  },
  {
    key: 'doctor-binh',
    email: 'bs.binh.tran@healthcare.local',
    password: passwords.doctor,
    firstName: 'Bình',
    lastName: 'Trần',
    role: Role.DOCTOR,
    bio:
      'Bác sĩ Tim mạch, tập trung tư vấn tăng huyết áp, đau ngực, rối loạn nhịp và kiểm soát yếu tố nguy cơ tim mạch. Có kinh nghiệm theo dõi bệnh nhân sau đặt stent và bệnh nhân lớn tuổi.',
    yearsOfExperience: 15,
    approvalStatus: ApprovalStatus.APPROVED,
    isActive: true,
    specialtyKeys: ['cardiology', 'general'],
    schedule: weeklySchedule([1, 3, 5, 6], '09:00', '17:00'),
  },
  {
    key: 'doctor-chi',
    email: 'bs.chi.le@healthcare.local',
    password: passwords.doctor,
    firstName: 'Chi',
    lastName: 'Lê',
    role: Role.DOCTOR,
    bio:
      'Bác sĩ Nhi khoa tư vấn bệnh hô hấp, sốt, tiêu hóa và dinh dưỡng trẻ em. Luôn giải thích kỹ dấu hiệu cần đưa trẻ đi khám trực tiếp để phụ huynh yên tâm theo dõi tại nhà.',
    yearsOfExperience: 10,
    approvalStatus: ApprovalStatus.APPROVED,
    isActive: true,
    specialtyKeys: ['pediatrics', 'nutrition'],
    schedule: weeklySchedule([2, 3, 4, 5, 6], '08:30', '15:30'),
  },
  {
    key: 'doctor-dung',
    email: 'bs.dung.pham@healthcare.local',
    password: passwords.doctor,
    firstName: 'Dung',
    lastName: 'Phạm',
    role: Role.DOCTOR,
    bio:
      'Bác sĩ Da liễu tư vấn mụn, viêm da, dị ứng và chăm sóc da theo từng loại da. Có kinh nghiệm xây dựng phác đồ bôi ngoài da đơn giản, dễ tuân thủ.',
    yearsOfExperience: 8,
    approvalStatus: ApprovalStatus.APPROVED,
    isActive: true,
    specialtyKeys: ['dermatology'],
    schedule: weeklySchedule([1, 2, 4, 6], '10:00', '18:00'),
  },
  {
    key: 'doctor-huong',
    email: 'bs.huong.vo@healthcare.local',
    password: passwords.doctor,
    firstName: 'Hương',
    lastName: 'Võ',
    role: Role.DOCTOR,
    bio:
      'Bác sĩ Nội tiết chuyên tư vấn đái tháo đường, rối loạn tuyến giáp và kiểm soát chuyển hóa. Hỗ trợ người bệnh xây dựng mục tiêu đường huyết phù hợp lối sống.',
    yearsOfExperience: 14,
    approvalStatus: ApprovalStatus.APPROVED,
    isActive: true,
    specialtyKeys: ['endocrinology', 'nutrition'],
    schedule: weeklySchedule([1, 2, 3, 5], '08:00', '17:00'),
  },
  {
    key: 'doctor-mai',
    email: 'bs.mai.do@healthcare.local',
    password: passwords.doctor,
    firstName: 'Mai',
    lastName: 'Đỗ',
    role: Role.DOCTOR,
    bio:
      'Bác sĩ Sản phụ khoa tư vấn chăm sóc thai kỳ, dinh dưỡng trước sinh, rối loạn kinh nguyệt và sức khỏe phụ nữ. Ưu tiên hướng dẫn nhẹ nhàng, phù hợp từng giai đoạn.',
    yearsOfExperience: 11,
    approvalStatus: ApprovalStatus.APPROVED,
    isActive: true,
    specialtyKeys: ['obgyn', 'nutrition'],
    schedule: weeklySchedule([2, 4, 5, 6], '09:00', '16:00'),
  },
  {
    key: 'doctor-khanh',
    email: 'bs.khanh.hoang@healthcare.local',
    password: passwords.doctor,
    firstName: 'Khánh',
    lastName: 'Hoàng',
    role: Role.DOCTOR,
    bio:
      'Chuyên gia tư vấn sức khỏe tinh thần, hỗ trợ mất ngủ, căng thẳng, lo âu nhẹ và cân bằng cảm xúc. Các buổi tư vấn tập trung vào kỹ thuật tự theo dõi và thay đổi thói quen.',
    yearsOfExperience: 9,
    approvalStatus: ApprovalStatus.APPROVED,
    isActive: true,
    specialtyKeys: ['mental'],
    schedule: weeklySchedule([1, 3, 5], '13:00', '20:00'),
  },
  {
    key: 'doctor-tuan',
    email: 'bs.tuan.bui@healthcare.local',
    password: passwords.doctor,
    firstName: 'Tuấn',
    lastName: 'Bùi',
    role: Role.DOCTOR,
    bio:
      'Bác sĩ Dinh dưỡng lâm sàng tư vấn thực đơn cho người bệnh tiểu đường, tăng huyết áp, thừa cân và phụ nữ mang thai. Mục tiêu là thực đơn dễ áp dụng trong bữa ăn Việt Nam.',
    yearsOfExperience: 7,
    approvalStatus: ApprovalStatus.APPROVED,
    isActive: true,
    specialtyKeys: ['nutrition', 'general'],
    schedule: weeklySchedule([2, 3, 4, 6], '08:00', '14:00'),
  },
  {
    key: 'doctor-pending',
    email: 'bs.thinh.pending@healthcare.local',
    password: passwords.doctor,
    firstName: 'Thịnh',
    lastName: 'Lâm',
    role: Role.DOCTOR,
    bio:
      'Hồ sơ bác sĩ đang chờ quản trị viên duyệt. Dữ liệu dùng để minh họa màn hình quản lý và duyệt bác sĩ.',
    yearsOfExperience: 4,
    approvalStatus: ApprovalStatus.PENDING,
    isActive: false,
    specialtyKeys: ['general'],
    schedule: weeklySchedule([1, 2, 3], '08:00', '12:00'),
  },
];

async function main() {
  await cleanupDatabase();

  const specialtyByKey = new Map<string, { id: string }>();
  for (const specialty of specialties) {
    const created = await prisma.specialty.create({
      data: {
        id: uuidv7(),
        nameEn: specialty.nameEn,
        nameVi: specialty.nameVi,
        description: specialty.description,
        isActive: true,
      },
    });
    specialtyByKey.set(specialty.key, created);
  }

  const admin = await createUser(adminSeed);

  const patientByKey = new Map<string, Awaited<ReturnType<typeof createPatient>>>();
  for (const patient of patients) {
    patientByKey.set(patient.key, await createPatient(patient));
  }

  const doctorByKey = new Map<string, Awaited<ReturnType<typeof createDoctor>>>();
  for (const doctor of doctors) {
    const created = await createDoctor(doctor);
    doctorByKey.set(doctor.key, created);

    await prisma.doctorSpecialty.createMany({
      data: doctor.specialtyKeys.map((specialtyKey) => ({
        id: uuidv7(),
        doctorId: created.profile.id,
        specialtyId: specialtyByKey.get(specialtyKey)!.id,
      })),
    });
  }

  const appointmentSeeds = [
    {
      patientKey: 'patient-lan',
      doctorKey: 'doctor-binh',
      scheduledAt: addDays(1, 9, 30),
      status: AppointmentStatus.CONFIRMED,
      reason: 'Tư vấn huyết áp dao động và cảm giác hồi hộp khi làm việc căng thẳng.',
      notes: 'Bệnh nhân đã đo huyết áp tại nhà trong 7 ngày, có ghi chú chỉ số buổi sáng và tối.',
    },
    {
      patientKey: 'patient-minh',
      doctorKey: 'doctor-huong',
      scheduledAt: addDays(2, 10, 0),
      status: AppointmentStatus.PENDING_CONFIRMATION,
      reason: 'Đường huyết sau ăn thường cao, cần điều chỉnh chế độ ăn và vận động.',
      notes: 'Mang theo nhật ký đường huyết 2 tuần gần nhất.',
    },
    {
      patientKey: 'patient-ha',
      doctorKey: 'doctor-dung',
      scheduledAt: addDays(3, 14, 30),
      status: AppointmentStatus.CONFIRMED,
      reason: 'Da mặt nổi mụn viêm kéo dài, muốn tư vấn routine chăm sóc da phù hợp.',
      notes: 'Đã dùng một số sản phẩm bôi ngoài da nhưng chưa cải thiện ổn định.',
    },
    {
      patientKey: 'patient-quang',
      doctorKey: 'doctor-binh',
      scheduledAt: addDays(-12, 8, 30),
      status: AppointmentStatus.COMPLETED,
      reason: 'Đánh giá nguy cơ tim mạch và điều chỉnh thuốc huyết áp.',
      notes: 'Buổi tư vấn đã hoàn tất, có kết quả và đơn thuốc đi kèm.',
    },
    {
      patientKey: 'patient-thao',
      doctorKey: 'doctor-mai',
      scheduledAt: addDays(-5, 15, 0),
      status: AppointmentStatus.COMPLETED,
      reason: 'Tư vấn dinh dưỡng thai kỳ và bổ sung sắt, canxi trong tam cá nguyệt thứ hai.',
      notes: 'Bệnh nhân cần theo dõi cân nặng và lịch khám thai định kỳ.',
    },
    {
      patientKey: 'patient-duc',
      doctorKey: 'doctor-khanh',
      scheduledAt: addDays(4, 19, 0),
      status: AppointmentStatus.PENDING_CONFIRMATION,
      reason: 'Mất ngủ kéo dài trước kỳ thi, khó tập trung và dễ lo lắng.',
      notes: 'Ưu tiên tư vấn thói quen ngủ, quản lý thời gian học và dấu hiệu cần hỗ trợ thêm.',
    },
    {
      patientKey: 'patient-lan',
      doctorKey: 'doctor-an',
      scheduledAt: addDays(-2, 11, 0),
      status: AppointmentStatus.CANCELLED,
      reason: 'Đau dạ dày nhẹ sau ăn.',
      notes: 'Bệnh nhân đã đổi sang lịch khám trực tiếp nên hủy lịch online.',
    },
    {
      patientKey: 'patient-minh',
      doctorKey: 'doctor-tuan',
      scheduledAt: addDays(6, 8, 30),
      status: AppointmentStatus.CONFIRMED,
      reason: 'Xây dựng thực đơn 7 ngày cho người đái tháo đường type 2.',
      notes: 'Cần gợi ý bữa ăn phù hợp lịch làm việc văn phòng.',
    },
    {
      patientKey: 'patient-ha',
      doctorKey: 'doctor-chi',
      scheduledAt: addDays(5, 9, 0),
      status: AppointmentStatus.CONFIRMED,
      reason: 'Tư vấn chăm sóc bé trai 3 tuổi bị ho về đêm.',
      notes: 'Mẹ bé theo dõi nhiệt độ, nhịp thở và lượng nước uống trong ngày.',
    },
    {
      patientKey: 'patient-quang',
      doctorKey: 'doctor-an',
      scheduledAt: addDays(-1, 16, 0),
      status: AppointmentStatus.NO_SHOW,
      reason: 'Tái tư vấn kết quả xét nghiệm tổng quát.',
      notes: 'Bệnh nhân không tham gia phiên tư vấn theo lịch.',
    },
  ] satisfies Array<{
    patientKey: string;
    doctorKey: string;
    scheduledAt: Date;
    status: AppointmentStatus;
    reason: string;
    notes: string;
  }>;

  const appointments = [];
  for (const seed of appointmentSeeds) {
    const patient = patientByKey.get(seed.patientKey)!;
    const doctor = doctorByKey.get(seed.doctorKey)!;
    appointments.push(
      await prisma.appointment.create({
        data: {
          id: uuidv7(),
          patientId: patient.profile.id,
          doctorId: doctor.profile.id,
          scheduledAt: seed.scheduledAt,
          durationMinutes: 60,
          status: seed.status,
          reason: seed.reason,
          notes: seed.notes,
        },
      }),
    );
  }

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === AppointmentStatus.COMPLETED,
  );

  await createConsultation({
    appointmentId: completedAppointments[0].id,
    patientUserId: patientByKey.get('patient-quang')!.user.id,
    doctorUserId: doctorByKey.get('doctor-binh')!.user.id,
    status: ConsultationStatus.COMPLETED,
    startedAt: addDays(-12, 8, 30),
    endedAt: addDays(-12, 9, 20),
    summary:
      'Bệnh nhân tăng huyết áp đã kiểm soát tương đối, cần tiếp tục theo dõi huyết áp sáng/tối, giảm muối và tái đánh giá sau 4 tuần.',
    prescriptionNotes:
      'Uống thuốc đúng giờ, không tự ý ngưng thuốc khi huyết áp ổn. Nếu đau ngực, khó thở hoặc huyết áp trên 180/110 mmHg cần đi cấp cứu.',
    prescriptionItems: [
      {
        medicationName: 'Amlodipine 5mg',
        dosage: '1 viên',
        frequency: 'Mỗi sáng sau ăn',
        duration: '30 ngày',
        notes: 'Theo dõi phù chân hoặc chóng mặt.',
      },
      {
        medicationName: 'Omega-3',
        dosage: '1 viên',
        frequency: 'Mỗi tối sau ăn',
        duration: '30 ngày',
        notes: 'Kết hợp chế độ ăn ít chất béo bão hòa.',
      },
    ],
  });

  await createConsultation({
    appointmentId: completedAppointments[1].id,
    patientUserId: patientByKey.get('patient-thao')!.user.id,
    doctorUserId: doctorByKey.get('doctor-mai')!.user.id,
    status: ConsultationStatus.COMPLETED,
    startedAt: addDays(-5, 15, 0),
    endedAt: addDays(-5, 15, 45),
    summary:
      'Thai phụ tuần 18 ổn định, cần duy trì bữa ăn đa dạng, bổ sung sắt và canxi đúng thời điểm, theo dõi dấu hiệu đau bụng hoặc ra huyết bất thường.',
    prescriptionNotes:
      'Không dùng thêm thuốc hoặc thực phẩm chức năng ngoài danh sách nếu chưa hỏi bác sĩ sản khoa.',
    prescriptionItems: [
      {
        medicationName: 'Sắt hữu cơ',
        dosage: '1 viên',
        frequency: 'Mỗi ngày sau bữa trưa',
        duration: '30 ngày',
        notes: 'Không uống cùng sữa hoặc canxi.',
      },
      {
        medicationName: 'Canxi 500mg',
        dosage: '1 viên',
        frequency: 'Mỗi tối sau ăn',
        duration: '30 ngày',
        notes: 'Uống cách viên sắt ít nhất 2 giờ.',
      },
    ],
  });

  await prisma.rating.createMany({
    data: [
      {
        id: uuidv7(),
        patientId: patientByKey.get('patient-quang')!.profile.id,
        doctorId: doctorByKey.get('doctor-binh')!.profile.id,
        appointmentId: completedAppointments[0].id,
        score: 5,
        comment:
          'Bác sĩ tư vấn rất kỹ, giải thích rõ cách theo dõi huyết áp tại nhà và khi nào cần đi khám trực tiếp.',
        status: RatingStatus.VISIBLE,
      },
      {
        id: uuidv7(),
        patientId: patientByKey.get('patient-thao')!.profile.id,
        doctorId: doctorByKey.get('doctor-mai')!.profile.id,
        appointmentId: completedAppointments[1].id,
        score: 5,
        comment:
          'Tư vấn nhẹ nhàng, dễ hiểu. Các hướng dẫn về sắt, canxi và chế độ ăn rất thực tế.',
        status: RatingStatus.VISIBLE,
      },
    ],
  });

  const questionSeeds = [
    {
      patientKey: 'patient-lan',
      doctorKey: 'doctor-an',
      title: 'Đau thượng vị sau bữa tối có cần nội soi không?',
      content:
        'Tôi bị đau âm ỉ vùng thượng vị sau bữa tối khoảng 2 tuần, đôi lúc ợ chua. Tôi nên thay đổi ăn uống trước hay cần đặt lịch khám sớm?',
      status: QuestionStatus.ANSWERED,
      answer:
        'Chị nên ăn bữa nhỏ, tránh cà phê, rượu bia, đồ cay và không nằm ngay sau ăn. Nếu đau tăng, sụt cân, nôn ra máu hoặc đi ngoài phân đen cần khám trực tiếp sớm.',
    },
    {
      patientKey: 'patient-minh',
      doctorKey: 'doctor-huong',
      title: 'Đường huyết sau ăn 2 giờ khoảng 11 mmol/L có đáng lo?',
      content:
        'Tôi đang dùng Metformin nhưng sau ăn tối đường huyết thường khoảng 10.5 - 11 mmol/L. Tôi có nên tự tăng liều thuốc không?',
      status: QuestionStatus.ANSWERED,
      answer:
        'Anh không nên tự tăng liều. Hãy ghi lại thực đơn, thời điểm đo và vận động sau ăn trong 7 ngày. Nếu chỉ số tiếp tục cao, nên đặt lịch tư vấn để điều chỉnh an toàn.',
    },
    {
      patientKey: 'patient-ha',
      doctorKey: 'doctor-dung',
      title: 'Mụn viêm ở cằm tái phát trước kỳ kinh',
      content:
        'Mỗi tháng trước kỳ kinh tôi bị mụn viêm ở cằm và quai hàm. Tôi có nên dùng thuốc bôi chứa retinoid không?',
      status: QuestionStatus.PENDING,
    },
    {
      patientKey: 'patient-quang',
      doctorKey: 'doctor-binh',
      title: 'Huyết áp buổi sáng 150/95 dù đã uống thuốc',
      content:
        'Tôi đo huyết áp sáng nay 150/95, sau nghỉ 10 phút còn 145/92. Tôi chưa đau ngực hay khó thở. Tôi cần xử trí thế nào?',
      status: QuestionStatus.ANSWERED,
      answer:
        'Chú nên đo lại đúng tư thế, ghi chỉ số sáng/tối trong 3 ngày và không tự uống thêm thuốc. Nếu huyết áp trên 180/110, đau ngực, khó thở hoặc yếu liệt cần đi cấp cứu.',
    },
    {
      patientKey: 'patient-thao',
      doctorKey: 'doctor-mai',
      title: 'Thai 18 tuần hay bị chuột rút về đêm',
      content:
        'Tôi đang mang thai tuần 18, gần đây hay bị chuột rút bắp chân vào ban đêm. Có phải thiếu canxi không?',
      status: QuestionStatus.ANSWERED,
      answer:
        'Chuột rút khi mang thai khá thường gặp. Chị nên uống đủ nước, vận động nhẹ, kéo giãn bắp chân trước ngủ và bổ sung canxi theo liều bác sĩ đang hướng dẫn.',
    },
    {
      patientKey: 'patient-duc',
      doctorKey: 'doctor-khanh',
      title: 'Mất ngủ trước kỳ thi nên cải thiện thế nào?',
      content:
        'Em thường nằm rất lâu mới ngủ, sáng dậy mệt và khó tập trung. Em chưa muốn dùng thuốc ngủ.',
      status: QuestionStatus.PENDING,
    },
    {
      patientKey: 'patient-minh',
      doctorKey: 'doctor-tuan',
      title: 'Bữa sáng cho người tiểu đường nên ăn gì?',
      content:
        'Tôi thường ăn bánh mì hoặc bún vào buổi sáng, sau đó đường huyết tăng nhanh. Có lựa chọn nào phù hợp hơn không?',
      status: QuestionStatus.ANSWERED,
      answer:
        'Anh nên ưu tiên bữa sáng có chất xơ và đạm như yến mạch không đường, trứng, sữa chua không đường hoặc bánh mì nguyên cám kèm rau. Nên đo lại để biết món nào phù hợp.',
    },
    {
      patientKey: 'patient-ha',
      doctorKey: 'doctor-chi',
      title: 'Trẻ ho về đêm nhưng ban ngày vẫn chơi bình thường',
      content:
        'Bé 3 tuổi ho nhiều về đêm, không sốt, ban ngày vẫn ăn chơi. Tôi nên theo dõi tại nhà như thế nào?',
      status: QuestionStatus.PENDING,
    },
  ] satisfies Array<{
    patientKey: string;
    doctorKey: string;
    title: string;
    content: string;
    status: QuestionStatus;
    answer?: string;
  }>;

  for (const seed of questionSeeds) {
    const patient = patientByKey.get(seed.patientKey)!;
    const doctor = doctorByKey.get(seed.doctorKey)!;
    const question = await prisma.question.create({
      data: {
        id: uuidv7(),
        patientId: patient.profile.id,
        doctorId: doctor.profile.id,
        title: seed.title,
        content: seed.content,
        status: seed.status,
      },
    });

    if (seed.answer) {
      await prisma.answer.create({
        data: {
          id: uuidv7(),
          questionId: question.id,
          doctorId: doctor.profile.id,
          content: seed.answer,
          isApproved: true,
        },
      });
    }
  }

  await prisma.notificationLog.createMany({
    data: [
      {
        id: uuidv7(),
        userId: patientByKey.get('patient-lan')!.user.id,
        type: NotificationType.EMAIL,
        content: 'Lịch tư vấn với BS. Bình Trần đã được xác nhận vào ngày mai lúc 09:30.',
        status: NotificationStatus.SENT,
        provider: 'demo-mailer',
      },
      {
        id: uuidv7(),
        userId: patientByKey.get('patient-minh')!.user.id,
        type: NotificationType.SMS,
        content: 'Nhắc lịch: tư vấn nội tiết lúc 10:00 trong 2 ngày tới.',
        status: NotificationStatus.PENDING,
        provider: 'demo-sms',
      },
      {
        id: uuidv7(),
        userId: admin.id,
        type: NotificationType.EMAIL,
        content: 'Có một hồ sơ bác sĩ mới đang chờ duyệt.',
        status: NotificationStatus.SENT,
        provider: 'demo-mailer',
      },
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      {
        id: uuidv7(),
        actorUserId: admin.id,
        action: 'SEED_DEMO_DATA',
        resource: 'Database',
        resourceId: null,
        ipAddress: '127.0.0.1',
        userAgent: 'prisma-seed',
        metadata: {
          specialties: specialties.length,
          doctors: doctors.length,
          patients: patients.length,
        },
      },
    ],
  });

  console.log('Demo seed completed.');
  console.log('Accounts for UI capture:');
  console.log(`Admin: ${adminSeed.email} / ${passwords.admin}`);
  console.log(`Patient: ${patients[0].email} / ${passwords.patient}`);
  console.log(`Doctor: ${doctors[0].email} / ${passwords.doctor}`);
  console.log(`Created ${specialties.length} specialties, ${doctors.length} doctors, ${patients.length} patients.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
