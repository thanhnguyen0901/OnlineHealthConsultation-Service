import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { uuidv7 } from 'uuidv7';

/** Generate a new UUID v7 primary key. */
const newId = () => uuidv7();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clean existing data (in correct order to respect foreign keys)
  console.log('🧹 Cleaning existing data...');
  await prisma.rating.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.doctorProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.specialty.deleteMany();
  console.log('✅ Cleaned existing data\n');

  // Create specialties
  console.log('🏥 Creating specialties...');
  const cardiology = await prisma.specialty.create({
    data: {
      id: newId(),
      name: 'Cardiology',
      nameEn: 'Cardiology',
      nameVi: 'Tim mạch',
      description: 'Chẩn đoán và điều trị các bệnh về tim mạch',
      isActive: true,
    },
  });

  const dermatology = await prisma.specialty.create({
    data: {
      id: newId(),
      name: 'Dermatology',
      nameEn: 'Dermatology',
      nameVi: 'Da liễu',
      description: 'Chẩn đoán và điều trị các bệnh về da liễu',
      isActive: true,
    },
  });

  const pediatrics = await prisma.specialty.create({
    data: {
      id: newId(),
      name: 'Pediatrics',
      nameEn: 'Pediatrics',
      nameVi: 'Nhi khoa',
      description: 'Chăm sóc sức khỏe cho trẻ em và thanh thiếu niên',
      isActive: true,
    },
  });

  const orthopedics = await prisma.specialty.create({
    data: {
      id: newId(),
      name: 'Orthopedics',
      nameEn: 'Orthopedics',
      nameVi: 'Chấn thương chỉnh hình',
      description: 'Điều trị các rối loạn về xương khớp',
      isActive: true,
    },
  });

  const generalMedicine = await prisma.specialty.create({
    data: {
      id: newId(),
      name: 'General Medicine',
      nameEn: 'General Medicine',
      nameVi: 'Đa khoa',
      description: 'Chăm sóc sức khỏe tổng quát và ban đầu',
      isActive: true,
    },
  });

  console.log(`✅ Created 5 specialties\n`);

  // Hash passwords for test accounts (match QUICK_START.md)
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const doctorPasswordHash = await bcrypt.hash('Doctor@123', 10);
  const patientPasswordHash = await bcrypt.hash('Patient@123', 10);

  // Create admin user
  console.log('👨‍💼 Creating admin user...');
  const admin = await prisma.user.create({
    data: {
      id: newId(),
      email: 'admin@healthcare.com',
      passwordHash: adminPasswordHash,
      firstName: 'Quản trị viên',
      lastName: 'hệ thống',
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('✅ Created admin user\n');

  // Create doctors
  console.log('👨‍⚕️ Creating doctors...');

  // Representative schedule for Doctor 1 — two slots per day for a full next work-week.
  // Shape must match ScheduleSlot (src/utils/schedule.ts).
  const now = new Date();
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + ((8 - now.getDay()) % 7 || 7)); // next Mon
  const seedSchedule = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(nextMonday);
    d.setDate(nextMonday.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    return [
      { date: dateStr, startTime: '08:00', endTime: '12:00', available: true },
      { date: dateStr, startTime: '14:00', endTime: '17:00', available: true },
    ];
  }).flat();

  const drSmith = await prisma.user.create({
    data: {
      id: newId(),
      email: 'nguyen.van.hung@healthcare.com',
      passwordHash: doctorPasswordHash,
      firstName: 'Nguyễn Văn',
      lastName: 'Hùng',
      role: 'DOCTOR',
      isActive: true,
      doctorProfile: {
        create: {
          id: newId(),
          specialtyId: cardiology.id,
          bio: 'Bác sĩ tim mạch với hơn 15 năm kinh nghiệm. Chuyên về tim mạch dự phòng và quản lý bệnh tim.',
          yearsOfExperience: 15,
          schedule: seedSchedule,
          scheduleUpdatedAt: new Date(),
        },
      },
    },
  });

  const drJohnson = await prisma.user.create({
    data: {
      id: newId(),
      email: 'tran.thi.lan@healthcare.com',
      passwordHash: doctorPasswordHash,
      firstName: 'Trần Thị',
      lastName: 'Lan',
      role: 'DOCTOR',
      isActive: true,
      doctorProfile: {
        create: {
          id: newId(),
          specialtyId: dermatology.id,
          bio: 'Bác sĩ da liễu được chứng nhận, chuyên về da liễu y khoa và thẩm mỹ.',
          yearsOfExperience: 10,
        },
      },
    },
  });

  const drLee = await prisma.user.create({
    data: {
      id: newId(),
      email: 'le.van.minh@healthcare.com',
      passwordHash: doctorPasswordHash,
      firstName: 'Lê Văn',
      lastName: 'Minh',
      role: 'DOCTOR',
      isActive: true,
      doctorProfile: {
        create: {
          id: newId(),
          specialtyId: pediatrics.id,
          bio: 'Bác sĩ nhi khoa tận tâm chăm sóc toàn diện cho trẻ em ở mọi lứa tuổi.',
          yearsOfExperience: 8,
        },
      },
    },
  });

  const drNguyen = await prisma.user.create({
    data: {
      id: newId(),
      email: 'pham.thi.nga@healthcare.com',
      passwordHash: doctorPasswordHash,
      firstName: 'Phạm Thị',
      lastName: 'Nga',
      role: 'DOCTOR',
      isActive: true,
      doctorProfile: {
        create: {
          id: newId(),
          specialtyId: orthopedics.id,
          bio: 'Chuyên gia chấn thương chỉnh hình với kinh nghiệm điều trị chấn thương thể thao.',
          yearsOfExperience: 12,
        },
      },
    },
  });

  console.log('✅ Created 4 doctors\n');

  // Create patients
  console.log('👥 Creating patients...');
  const patient1 = await prisma.user.create({
    data: {
      id: newId(),
      email: 'vo.van.nam@gmail.com',
      passwordHash: patientPasswordHash,
      firstName: 'Võ Văn',
      lastName: 'Nam',
      role: 'PATIENT',
      isActive: true,
      patientProfile: {
        create: {
          id: newId(),
          dateOfBirth: new Date('1990-05-15'),
          gender: 'MALE',
          phone: '0901234567',
          address: '123 Nguyễn Huệ, Q.1, TP.HCM',
          medicalHistory: 'Tiền sử dị ứng với penicillin',
        },
      },
    },
  });

  const patient2 = await prisma.user.create({
    data: {
      id: newId(),
      email: 'hoang.thi.thao@gmail.com',
      passwordHash: patientPasswordHash,
      firstName: 'Hoàng Thị',
      lastName: 'Thảo',
      role: 'PATIENT',
      isActive: true,
      patientProfile: {
        create: {
          id: newId(),
          dateOfBirth: new Date('1985-08-20'),
          gender: 'FEMALE',
          phone: '0912345678',
          address: '456 Lê Lợi, Q.3, TP.HCM',
          medicalHistory: 'Cao huyết áp, đang điều trị',
        },
      },
    },
  });

  const patient3 = await prisma.user.create({
    data: {
      id: newId(),
      email: 'nguyen.van.khanh@gmail.com',
      passwordHash: patientPasswordHash,
      firstName: 'Nguyễn Văn',
      lastName: 'Khánh',
      role: 'PATIENT',
      isActive: true,
      patientProfile: {
        create: {
          id: newId(),
          dateOfBirth: new Date('1995-03-10'),
          gender: 'MALE',
          phone: '0923456789',
          address: '789 Trần Hưng Đạo, Q.5, TP.HCM',
        },
      },
    },
  });

  console.log('✅ Created 3 patients\n');

  // Get doctor profiles for creating questions/appointments
  const doctors = await prisma.doctorProfile.findMany({
    include: { user: true },
  });

  const patients = await prisma.patientProfile.findMany({
    include: { user: true },
  });

  // Create sample questions với đầy đủ các trạng thái
  console.log('❓ Creating sample questions...');
  
  // Question 1: ANSWERED + có answer được approve
  const question1 = await prisma.question.create({
    data: {
      id: newId(),
      patientId: patients[0].id,
      doctorId: doctors[0].id, // Cardiology
      title: 'Hỏi về triệu chứng đau ngực',
      content: 'Gần đây tôi thường xuyên bị đau ngực khi vận động mạnh. Có nguy hiểm không bác sĩ?',
      status: 'ANSWERED',
    },
  });

  await prisma.answer.create({
    data: {
      id: newId(),
      questionId: question1.id,
      doctorId: doctors[0].id,
      content: 'Đau ngực khi vận động có thể là dấu hiệu của bệnh tim mạch. Bạn nên đến khám trực tiếp để được thăm khám và làm các xét nghiệm cần thiết như điện tâm đồ, siêu âm tim. Trong lúc chờ khám, hạn chế vận động mạnh và theo dõi triệu chứng.',
      isApproved: true,
    },
  });

  // Question 2: ANSWERED + có answer được approve
  const question2 = await prisma.question.create({
    data: {
      id: newId(),
      patientId: patients[1].id,
      doctorId: doctors[1].id, // Dermatology
      title: 'Da bị mụn nhiều',
      content: 'Da mặt tôi bị mụn nhiều, đã dùng nhiều loại kem nhưng không hiệu quả. Bác sĩ tư vấn giúp em.',
      status: 'ANSWERED',
    },
  });

  await prisma.answer.create({
    data: {
      id: newId(),
      questionId: question2.id,
      doctorId: doctors[1].id,
      content: 'Mụn có nhiều nguyên nhân khác nhau. Bạn nên: 1) Vệ sinh da đúng cách 2 lần/ngày, 2) Tránh sờ tay lên mặt, 3) Ăn uống lành mạnh, hạn chế đồ ngọt và dầu mỡ. Nếu mụn nhiều và nặng, nên đến khám để được kê đơn thuốc điều trị phù hợp.',
      isApproved: true,
    },
  });

  // Question 3: PENDING (chưa trả lời) + có doctorId
  const question3 = await prisma.question.create({
    data: {
      id: newId(),
      patientId: patients[2].id,
      doctorId: doctors[2].id, // Pediatrics
      title: 'Con bị sốt cao',
      content: 'Con tôi 3 tuổi sốt 39 độ, có cần đưa đi cấp cứu không bác sĩ?',
      status: 'PENDING',
    },
  });

  // Question 4: PENDING (chưa assign doctor) - câu hỏi công khai
  const question4 = await prisma.question.create({
    data: {
      id: newId(),
      patientId: patients[0].id,
      title: 'Tư vấn về chế độ ăn giảm cân',
      content: 'Tôi muốn giảm 5kg một cách lành mạnh, bác sĩ tư vấn giúp em.',
      status: 'PENDING',
    },
  });

  // Question 5: ANSWERED nhưng answer chưa approve (để test moderation)
  const question5 = await prisma.question.create({
    data: {
      id: newId(),
      patientId: patients[1].id,
      doctorId: doctors[3].id, // Orthopedics
      title: 'Đau khớp gối khi chạy bộ',
      content: 'Tôi bị đau khớp gối khi chạy bộ lâu. Có nên dùng băng bảo vệ không bác sĩ?',
      status: 'ANSWERED',
    },
  });

  await prisma.answer.create({
    data: {
      id: newId(),
      questionId: question5.id,
      doctorId: doctors[3].id,
      content: 'Đau khớp gối khi chạy có thể do nhiều nguyên nhân. Bạn nên nghỉ ngơi, chườm lạnh vùng đau, và đến khám để kiểm tra chấn thương. Băng bảo vệ có thể hỗ trợ nhưng cần tư vấn trực tiếp.',
      isApproved: false, // Chưa được admin approve
    },
  });

  // Question 6: MODERATED (đã được kiểm duyệt)
  const question6 = await prisma.question.create({
    data: {
      id: newId(),
      patientId: patients[2].id,
      doctorId: doctors[0].id,
      title: 'Tư vấn về cao huyết áp',
      content: 'Bố tôi 60 tuổi, huyết áp 150/95. Có cần dùng thuốc ngay không bác sĩ?',
      status: 'MODERATED',
    },
  });

  await prisma.answer.create({
    data: {
      id: newId(),
      questionId: question6.id,
      doctorId: doctors[0].id,
      content: 'Huyết áp 150/95 thuộc mức cao độ 1. Nên bắt đầu thay đổi lối sống (giảm muối, tập thể dục) và có thể cần thuốc. Đưa bố đến khám để được tư vấn cụ thể.',
      isApproved: true,
    },
  });

  console.log('✅ Created 6 sample questions (3 answered-approved, 1 answered-pending-approve, 2 pending)\n');

  // Create sample appointments với đầy đủ các trạng thái
  console.log('📅 Creating sample appointments...');
  
  // Appointment 1: COMPLETED (1 tuần trước) - đã có rating
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  lastWeek.setHours(10, 0, 0, 0);

  const appointment1 = await prisma.appointment.create({
    data: {
      id: newId(),
      patientId: patients[0].id,
      doctorId: doctors[0].id,
      scheduledAt: lastWeek,
      status: 'COMPLETED',
      reason: 'Tái khám tim mạch định kỳ',
      notes: 'Bệnh nhân ổn định, tiếp tục theo dõi. Hẹn tái khám sau 3 tháng.',
    },
  });

  // Appointment 2: COMPLETED (3 ngày trước) - chưa có rating
  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  threeDaysAgo.setHours(14, 0, 0, 0);

  const appointment2 = await prisma.appointment.create({
    data: {
      id: newId(),
      patientId: patients[1].id,
      doctorId: doctors[1].id,
      scheduledAt: threeDaysAgo,
      status: 'COMPLETED',
      reason: 'Điều trị mụn và tư vấn chăm sóc da',
      notes: 'Đã kê đơn thuốc bôi. Hẹn tái khám sau 2 tuần.',
    },
  });

  // Appointment 3: CONFIRMED (ngày mai)
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      id: newId(),
      patientId: patients[1].id,
      doctorId: doctors[2].id,
      scheduledAt: tomorrow,
      status: 'CONFIRMED',
      reason: 'Khám và tư vấn chăm sóc da mụn',
    },
  });

  // Appointment 4: PENDING (tuần sau)
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(14, 30, 0, 0);

  await prisma.appointment.create({
    data: {
      id: newId(),
      patientId: patients[2].id,
      doctorId: doctors[2].id,
      scheduledAt: nextWeek,
      status: 'PENDING',
      reason: 'Khám sức khỏe định kỳ cho trẻ',
    },
  });

  // Appointment 5: CANCELLED (hôm qua)
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(9, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      id: newId(),
      patientId: patients[0].id,
      doctorId: doctors[3].id,
      scheduledAt: yesterday,
      status: 'CANCELLED',
      reason: 'Khám đau khớp gối',
      notes: 'Bệnh nhân hủy do bận việc đột xuất.',
    },
  });

  // Appointment 6: CONFIRMED (3 ngày nữa)
  const threeDaysLater = new Date(now);
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);
  threeDaysLater.setHours(15, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      id: newId(),
      patientId: patients[2].id,
      doctorId: doctors[1].id,
      scheduledAt: threeDaysLater,
      status: 'CONFIRMED',
      reason: 'Khám và điều trị dị ứng da',
    },
  });

  console.log('✅ Created 6 sample appointments (2 completed, 2 confirmed, 1 pending, 1 cancelled)\n');

  // Create sample ratings
  console.log('⭐ Creating sample ratings...');
  
  // Rating 1: VISIBLE - cho appointment1
  await prisma.rating.create({
    data: {
      id: newId(),
      patientId: patients[0].id,
      doctorId: doctors[0].id,
      appointmentId: appointment1.id,
      score: 5,
      comment: 'Bác sĩ rất tận tâm và chuyên nghiệp. Giải thích rất kỹ và dễ hiểu. Rất hài lòng!',
      status: 'VISIBLE',
    },
  });

  // Rating 2: VISIBLE - cho appointment2 (mới đánh giá)
  await prisma.rating.create({
    data: {
      id: newId(),
      patientId: patients[1].id,
      doctorId: doctors[1].id,
      appointmentId: appointment2.id,
      score: 4,
      comment: 'Bác sĩ nhiệt tình, tư vấn kỹ. Thuốc hiệu quả. Chỉ có thời gian chờ hơi lâu.',
      status: 'VISIBLE',
    },
  });

  // Rating 3: HIDDEN - rating bị ẩn do vi phạm (để test moderation)
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  
  const oldAppointment = await prisma.appointment.create({
    data: {
      id: newId(),
      patientId: patients[2].id,
      doctorId: doctors[3].id,
      scheduledAt: twoWeeksAgo,
      status: 'COMPLETED',
      reason: 'Khám chấn thương cổ chân',
      notes: 'Đã xử lý và băng bó. Hẹn tái khám sau 1 tuần.',
    },
  });

  await prisma.rating.create({
    data: {
      id: newId(),
      patientId: patients[2].id,
      doctorId: doctors[3].id,
      appointmentId: oldAppointment.id,
      score: 2,
      comment: 'Thời gian chờ quá lâu, thái độ chưa tốt.',
      status: 'HIDDEN', // Đã bị ẩn
    },
  });

  console.log('✅ Created 3 sample ratings (2 visible, 1 hidden)\n');

  // Update doctors' rating averages dựa trên ratings thực tế
  console.log('📊 Recalculating doctor rating statistics from actual seed ratings...');

  // Recalculate each doctor profile using only VISIBLE ratings (mirrors production logic)
  async function recalcInSeed(doctorProfileId: string) {
    const result = await prisma.rating.aggregate({
      where: { doctorId: doctorProfileId, status: 'VISIBLE' },
      _avg: { score: true },
      _count: { score: true },
    });
    await prisma.doctorProfile.update({
      where: { id: doctorProfileId },
      data: {
        ratingAverage: result._avg.score ?? 0,
        ratingCount: result._count.score,
      },
    });
  }

  await Promise.all(doctors.map((d) => recalcInSeed(d.id)));

  console.log('✅ Updated doctor ratings\n');

  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('🎉 Database seed completed successfully!\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📋 Test Credentials\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('👨‍💼 ADMIN:');
  console.log('   Email:    admin@healthcare.com');
  console.log('   Password: Admin@123\n');
  
  console.log('👨‍⚕️ DOCTORS (Password: Doctor@123):');
  console.log('   1. nguyen.van.hung@healthcare.com - BS. Nguyễn Văn Hùng (Tim mạch)');
  console.log('   2. tran.thi.lan@healthcare.com    - BS. Trần Thị Lan (Da liễu)');
  console.log('   3. le.van.minh@healthcare.com     - BS. Lê Văn Minh (Nhi khoa)');
  console.log('   4. pham.thi.nga@healthcare.com    - BS. Phạm Thị Nga (Chấn thương chỉnh hình)\n');
  
  console.log('👥 PATIENTS (Password: Patient@123):');
  console.log('   1. vo.van.nam@gmail.com          - Võ Văn Nam');
  console.log('   2. hoang.thi.thao@gmail.com      - Hoàng Thị Thảo');
  console.log('   3. nguyen.van.khanh@gmail.com    - Nguyễn Văn Khánh\n');
  
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📊 Sample Data Summary:\n');
  console.log(`   - Specialties: 5`);
  console.log(`   - Users: 8 (1 admin + 4 doctors + 3 patients)`);
  console.log(`   - Questions: 6 (3 answered-approved, 1 answered-pending-approve, 2 pending)`);
  console.log(`   - Appointments: 7 (3 completed, 2 confirmed, 1 pending, 1 cancelled)`);
  console.log(`   - Ratings: 3 (2 visible, 1 hidden)\n`);
  console.log('═══════════════════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
