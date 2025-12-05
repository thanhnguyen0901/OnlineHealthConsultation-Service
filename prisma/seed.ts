import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create specialties
  console.log('Creating specialties...');
  const specialties = await Promise.all([
    prisma.specialty.upsert({
      where: { name: 'Cardiology' },
      update: {},
      create: {
        name: 'Cardiology',
        description: 'Diagnosis and treatment of heart conditions',
        isActive: true,
      },
    }),
    prisma.specialty.upsert({
      where: { name: 'Dermatology' },
      update: {},
      create: {
        name: 'Dermatology',
        description: 'Diagnosis and treatment of skin conditions',
        isActive: true,
      },
    }),
    prisma.specialty.upsert({
      where: { name: 'Pediatrics' },
      update: {},
      create: {
        name: 'Pediatrics',
        description: 'Medical care for infants, children, and adolescents',
        isActive: true,
      },
    }),
    prisma.specialty.upsert({
      where: { name: 'Orthopedics' },
      update: {},
      create: {
        name: 'Orthopedics',
        description: 'Treatment of musculoskeletal system disorders',
        isActive: true,
      },
    }),
    prisma.specialty.upsert({
      where: { name: 'General Medicine' },
      update: {},
      create: {
        name: 'General Medicine',
        description: 'Primary care and general health concerns',
        isActive: true,
      },
    }),
  ]);

  console.log(`Created ${specialties.length} specialties`);

  // Hash password
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create admin user
  console.log('Creating admin user...');
  await prisma.user.upsert({
    where: { email: 'admin@healthconsult.com' },
    update: {},
    create: {
      email: 'admin@healthconsult.com',
      passwordHash,
      fullName: 'System Administrator',
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('Admin user created');

  // Create doctors
  console.log('Creating doctors...');
  await prisma.user.upsert({
    where: { email: 'dr.smith@healthconsult.com' },
    update: {},
    create: {
      email: 'dr.smith@healthconsult.com',
      passwordHash,
      fullName: 'Dr. John Smith',
      role: 'DOCTOR',
      isActive: true,
      doctorProfile: {
        create: {
          specialtyId: specialties[0].id, // Cardiology
          bio: 'Experienced cardiologist with over 15 years of practice. Specializes in preventive cardiology and heart disease management.',
          yearsOfExperience: 15,
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: 'dr.johnson@healthconsult.com' },
    update: {},
    create: {
      email: 'dr.johnson@healthconsult.com',
      passwordHash,
      fullName: 'Dr. Sarah Johnson',
      role: 'DOCTOR',
      isActive: true,
      doctorProfile: {
        create: {
          specialtyId: specialties[1].id, // Dermatology
          bio: 'Board-certified dermatologist specializing in medical and cosmetic dermatology.',
          yearsOfExperience: 10,
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: 'dr.lee@healthconsult.com' },
    update: {},
    create: {
      email: 'dr.lee@healthconsult.com',
      passwordHash,
      fullName: 'Dr. Michael Lee',
      role: 'DOCTOR',
      isActive: true,
      doctorProfile: {
        create: {
          specialtyId: specialties[2].id, // Pediatrics
          bio: 'Pediatrician dedicated to providing comprehensive care for children of all ages.',
          yearsOfExperience: 8,
        },
      },
    },
  });

  console.log('Created 3 doctors');

  // Create patients
  console.log('Creating patients...');
  await prisma.user.upsert({
    where: { email: 'patient1@example.com' },
    update: {},
    create: {
      email: 'patient1@example.com',
      passwordHash,
      fullName: 'Alice Williams',
      role: 'PATIENT',
      isActive: true,
      patientProfile: {
        create: {
          dateOfBirth: new Date('1990-05-15'),
          gender: 'FEMALE',
          phone: '555-0101',
          address: '123 Main St, City, State 12345',
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: 'patient2@example.com' },
    update: {},
    create: {
      email: 'patient2@example.com',
      passwordHash,
      fullName: 'Bob Anderson',
      role: 'PATIENT',
      isActive: true,
      patientProfile: {
        create: {
          dateOfBirth: new Date('1985-08-20'),
          gender: 'MALE',
          phone: '555-0102',
          address: '456 Oak Ave, City, State 12345',
        },
      },
    },
  });

  console.log('Created 2 patients');

  console.log('');
  console.log('Database seed completed successfully!');
  console.log('');
  console.log('Test Credentials:');
  console.log('');
  console.log('Admin:');
  console.log('  Email: admin@healthconsult.com');
  console.log('  Password: password123');
  console.log('');
  console.log('Doctor (Cardiology):');
  console.log('  Email: dr.smith@healthconsult.com');
  console.log('  Password: password123');
  console.log('');
  console.log('Doctor (Dermatology):');
  console.log('  Email: dr.johnson@healthconsult.com');
  console.log('  Password: password123');
  console.log('');
  console.log('Doctor (Pediatrics):');
  console.log('  Email: dr.lee@healthconsult.com');
  console.log('  Password: password123');
  console.log('');
  console.log('Patient:');
  console.log('  Email: patient1@example.com');
  console.log('  Password: password123');
  console.log('');
  console.log('Patient:');
  console.log('  Email: patient2@example.com');
  console.log('  Password: password123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
