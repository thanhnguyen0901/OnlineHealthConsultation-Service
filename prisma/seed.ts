import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { uuidv7 } from 'uuidv7';

const prisma = new PrismaClient();

async function main() {
  const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS ?? '10', 10);
  const adminHash = await bcrypt.hash('Admin@123', bcryptRounds);

  const specialtyGeneralId = uuidv7();
  const specialtyCardioId = uuidv7();

  await prisma.specialty.upsert({
    where: { nameEn: 'General Medicine' },
    create: {
      id: specialtyGeneralId,
      nameEn: 'General Medicine',
      nameVi: 'Da khoa',
      description: 'General and primary healthcare',
      isActive: true,
    },
    update: {
      nameVi: 'Da khoa',
      description: 'General and primary healthcare',
      isActive: true,
    },
  });

  await prisma.specialty.upsert({
    where: { nameEn: 'Cardiology' },
    create: {
      id: specialtyCardioId,
      nameEn: 'Cardiology',
      nameVi: 'Tim mach',
      description: 'Cardiovascular consultation',
      isActive: true,
    },
    update: {
      nameVi: 'Tim mach',
      description: 'Cardiovascular consultation',
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@healthcare.local' },
    create: {
      id: uuidv7(),
      email: 'admin@healthcare.local',
      passwordHash: adminHash,
      firstName: 'System',
      lastName: 'Admin',
      role: Role.ADMIN,
      isActive: true,
    },
    update: {
      passwordHash: adminHash,
      firstName: 'System',
      lastName: 'Admin',
      role: Role.ADMIN,
      isActive: true,
      deletedAt: null,
    },
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
