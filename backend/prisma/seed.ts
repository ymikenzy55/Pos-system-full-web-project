import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Check if super admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@store.com' },
  });

  if (existingAdmin) {
    console.log('⚠️  Super admin already exists. Skipping seed.');
    return;
  }

  // Create super admin with hashed password
  const saltRounds = 12;
  const adminPassword = await bcrypt.hash('admin123', saltRounds);

  const admin = await prisma.user.create({
    data: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@store.com',
      password: adminPassword,
    },
  });

  console.log('✅ Created super admin user');

  // Create shop
  const shop = await prisma.shop.create({
    data: {
      name: 'Best Supermarket',
      address: '123 Main Street',
      phone: '+1-555-0100',
    },
  });

  console.log('✅ Created shop');

  // Create admin staff member
  await prisma.staffMember.create({
    data: {
      userId: admin.id,
      shopId: shop.id,
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Created admin staff member');
  console.log('\n🎉 Database seed completed successfully!');
  console.log('\n⚠️  IMPORTANT: A super admin account has been created.');
  console.log('   Please check your deployment logs or contact your system administrator for credentials.');
  console.log('   Change the default password immediately after first login.\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
