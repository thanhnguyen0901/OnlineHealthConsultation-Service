import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clean existing data (in correct order to respect foreign keys)
  console.log('🧹 Cleaning existing data...');
  await prisma.rating.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.doctorProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.specialty.deleteMany();
  console.log('✅ Cleaned existing data\n');

  // Create specialties
  console.log('🏥 Creating specialties...');
  const cardiology = await prisma.specialty.create({
    data: {
      name: 'Cardiology',
      description: 'Chẩn đoán và điều trị các bệnh về tim mạch',
      isActive: true,
    },
  });

  const dermatology = await prisma.specialty.create({
    data: {
      name: 'Dermatology',
      description: 'Chẩn đoán và điều trị các bệnh về da liễu',
      isActive: true,
    },
  });

  const pediatrics = await prisma.specialty.create({
    data: {
      name: 'Pediatrics',
      description: 'Chăm sóc sức khỏe cho trẻ em và thanh thiếu niên',
      isActive: true,
    },
  });

  const orthopedics = await prisma.specialty.create({
    data: {
      name: 'Orthopedics',
      description: 'Điều trị các rối loạn về xương khớp',
      isActive: true,
    },
  });

  const generalMedicine = await prisma.specialty.create({
    data: {
      name: 'General Medicine',
      description: 'Chăm sóc sức khỏe tổng quát và ban đầu',
      isActive: true,
    },
  });

  console.log(`✅ Created 5 specialties\n`);

  // Hash password (all test accounts use: password123)
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create admin user
  console.log('👨‍💼 Creating admin user...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@healthconsult.com',
      passwordHash,
      fullName: 'Quản trị viên hệ thống',
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('✅ Created admin user\n');

  // Create doctors
  console.log('👨‍⚕️ Creating doctors...');
  const drSmith = await prisma.user.create({
    data: {
      email: 'dr.smith@healthconsult.com',
      passwordHash,
      fullName: 'BS. Nguyễn Văn An',
      role: 'DOCTOR',
      isActive: true,
      doctorProfile: {
        create: {
          specialtyId: cardiology.id,
          bio: 'Bác sĩ tim mạch với hơn 15 năm kinh nghiệm. Chuyên về tim mạch dự phòng và quản lý bệnh tim.',
          yearsOfExperience: 15,
          ratingAverage: 4.8,
          ratingCount: 45,
        },
      },
    },
  });

  const drJohnson = await prisma.user.create({
    data: {
      email: 'dr.johnson@healthconsult.com',
      passwordHash,
      fullName: 'BS. Trần Thị Bình',
      role: 'DOCTOR',
      isActive: true,
      doctorProfile: {
        create: {
          specialtyId: dermatology.id,
          bio: 'Bác sĩ da liễu được chứng nhận, chuyên về da liễu y khoa và thẩm mỹ.',
          yearsOfExperience: 10,
          ratingAverage: 4.6,
          ratingCount: 32,
        },
      },
    },
  });

  const drLee = await prisma.user.create({
    data: {
      email: 'dr.lee@healthconsult.com',
      passwordHash,
      fullName: 'BS. Lê Minh Châu',
      role: 'DOCTOR',
      isActive: true,
      doctorProfile: {
        create: {
          specialtyId: pediatrics.id,
          bio: 'Bác sĩ nhi khoa tận tâm chăm sóc toàn diện cho trẻ em ở mọi lứa tuổi.',
          yearsOfExperience: 8,
          ratingAverage: 4.9,
          ratingCount: 28,
        },
      },
    },
  });

  const drNguyen = await prisma.user.create({
    data: {
      email: 'dr.nguyen@healthconsult.com',
      passwordHash,
      fullName: 'BS. Phạm Hoàng Dũng',
      role: 'DOCTOR',
      isActive: true,
      doctorProfile: {
        create: {
          specialtyId: orthopedics.id,
          bio: 'Chuyên gia chấn thương chỉnh hình với kinh nghiệm điều trị chấn thương thể thao.',
          yearsOfExperience: 12,
          ratingAverage: 4.7,
          ratingCount: 38,
        },
      },
    },
  });

  console.log('✅ Created 4 doctors\n');

  // Create patients
  console.log('👥 Creating patients...');
  const patient1 = await prisma.user.create({
    data: {
      email: 'patient1@example.com',
      passwordHash,
      fullName: 'Nguyễn Thị Hoa',
      role: 'PATIENT',
      isActive: true,
      patientProfile: {
        create: {
          dateOfBirth: new Date('1990-05-15'),
          gender: 'FEMALE',
          phone: '0901234567',
          address: '123 Nguyễn Huệ, Q.1, TP.HCM',
          medicalHistory: 'Tiền sử dị ứng với penicillin',
        },
      },
    },
  });

  const patient2 = await prisma.user.create({
    data: {
      email: 'patient2@example.com',
      passwordHash,
      fullName: 'Trần Văn Nam',
      role: 'PATIENT',
      isActive: true,
      patientProfile: {
        create: {
          dateOfBirth: new Date('1985-08-20'),
          gender: 'MALE',
          phone: '0912345678',
          address: '456 Lê Lợi, Q.3, TP.HCM',
          medicalHistory: 'Cao huyết áp, đang điều trị',
        },
      },
    },
  });

  const patient3 = await prisma.user.create({
    data: {
      email: 'patient3@example.com',
      passwordHash,
      fullName: 'Lê Thị Mai',
      role: 'PATIENT',
      isActive: true,
      patientProfile: {
        create: {
          dateOfBirth: new Date('1995-03-10'),
          gender: 'FEMALE',
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

  // Create sample questions
  console.log('❓ Creating sample questions...');
  
  const question1 = await prisma.question.create({
    data: {
      patientId: patients[0].id,
      doctorId: doctors[0].id, // Cardiology
      title: 'Hỏi về triệu chứng đau ngực',
      content: 'Gần đây tôi thường xuyên bị đau ngực khi vận động mạnh. Có nguy hiểm không bác sĩ?',
      status: 'ANSWERED',
    },
  });

  await prisma.answer.create({
    data: {
      questionId: question1.id,
      doctorId: doctors[0].id,
      content: 'Đau ngực khi vận động có thể là dấu hiệu của bệnh tim mạch. Bạn nên đến khám trực tiếp để được thăm khám và làm các xét nghiệm cần thiết như điện tâm đồ, siêu âm tim. Trong lúc chờ khám, hạn chế vận động mạnh và theo dõi triệu chứng.',
      isApproved: true,
    },
  });

  const question2 = await prisma.question.create({
    data: {
      patientId: patients[1].id,
      doctorId: doctors[1].id, // Dermatology
      title: 'Da bị mụn nhiều',
      content: 'Da mặt tôi bị mụn nhiều, đã dùng nhiều loại kem nhưng không hiệu quả. Bác sĩ tư vấn giúp em.',
      status: 'ANSWERED',
    },
  });

  await prisma.answer.create({
    data: {
      questionId: question2.id,
      doctorId: doctors[1].id,
      content: 'Mụn có nhiều nguyên nhân khác nhau. Bạn nên: 1) Vệ sinh da đúng cách 2 lần/ngày, 2) Tránh sờ tay lên mặt, 3) Ăn uống lành mạnh, hạn chế đồ ngọt và dầu mỡ. Nếu mụn nhiều và nặng, nên đến khám để được kê đơn thuốc điều trị phù hợp.',
      isApproved: true,
    },
  });

  const question3 = await prisma.question.create({
    data: {
      patientId: patients[2].id,
      doctorId: doctors[2].id, // Pediatrics
      title: 'Con bị sốt cao',
      content: 'Con tôi 3 tuổi sốt 39 độ, có cần đưa đi cấp cứu không bác sĩ?',
      status: 'PENDING',
    },
  });

  const question4 = await prisma.question.create({
    data: {
      patientId: patients[0].id,
      title: 'Tư vấn về chế độ ăn giảm cân',
      content: 'Tôi muốn giảm 5kg một cách lành mạnh, bác sĩ tư vấn giúp em.',
      status: 'PENDING',
    },
  });

  console.log('✅ Created 4 sample questions (2 answered, 2 pending)\n');

  // Create sample appointments
  console.log('📅 Creating sample appointments...');
  
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(14, 0, 0, 0);

  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const appointment1 = await prisma.appointment.create({
    data: {
      patientId: patients[0].id,
      doctorId: doctors[0].id,
      scheduledAt: lastWeek,
      status: 'COMPLETED',
      reason: 'Tái khám tim mạch định kỳ',
      notes: 'Bệnh nhân ổn định, tiếp tục theo dõi',
    },
  });

  const appointment2 = await prisma.appointment.create({
    data: {
      patientId: patients[1].id,
      doctorId: doctors[1].id,
      scheduledAt: tomorrow,
      status: 'CONFIRMED',
      reason: 'Khám và điều trị mụn',
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: patients[2].id,
      doctorId: doctors[2].id,
      scheduledAt: nextWeek,
      status: 'PENDING',
      reason: 'Khám sức khỏe định kỳ cho trẻ',
    },
  });

  console.log('✅ Created 3 sample appointments\n');

  // Create sample ratings
  console.log('⭐ Creating sample ratings...');
  
  await prisma.rating.create({
    data: {
      patientId: patients[0].id,
      doctorId: doctors[0].id,
      appointmentId: appointment1.id,
      score: 5,
      comment: 'Bác sĩ rất tận tâm và chuyên nghiệp. Giải thích rất kỹ và dễ hiểu.',
      status: 'VISIBLE',
    },
  });

  // Update doctor's rating average
  await prisma.doctorProfile.update({
    where: { id: doctors[0].id },
    data: {
      ratingAverage: 4.8,
      ratingCount: 46,
    },
  });

  console.log('✅ Created 1 sample rating\n');

  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('🎉 Database seed completed successfully!\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📋 Test Credentials (Tất cả mật khẩu: password123)\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('👨‍💼 ADMIN:');
  console.log('   Email: admin@healthconsult.com');
  console.log('   Role: Quản trị viên\n');
  
  console.log('👨‍⚕️ DOCTORS:');
  console.log('   1. dr.smith@healthconsult.com   - BS. Nguyễn Văn An (Tim mạch)');
  console.log('   2. dr.johnson@healthconsult.com - BS. Trần Thị Bình (Da liễu)');
  console.log('   3. dr.lee@healthconsult.com     - BS. Lê Minh Châu (Nhi khoa)');
  console.log('   4. dr.nguyen@healthconsult.com  - BS. Phạm Hoàng Dũng (Chỉnh hình)\n');
  
  console.log('👥 PATIENTS:');
  console.log('   1. patient1@example.com - Nguyễn Thị Hoa');
  console.log('   2. patient2@example.com - Trần Văn Nam');
  console.log('   3. patient3@example.com - Lê Thị Mai\n');
  
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📊 Sample Data Summary:\n');
  console.log(`   - Specialties: 5`);
  console.log(`   - Users: ${1 + 4 + 3} (1 admin + 4 doctors + 3 patients)`);
  console.log(`   - Questions: 4 (2 answered, 2 pending)`);
  console.log(`   - Appointments: 3 (1 completed, 1 confirmed, 1 pending)`);
  console.log(`   - Ratings: 1\n`);
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
