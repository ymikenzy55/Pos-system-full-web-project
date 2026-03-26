import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('Creating super admin...');
    
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName: 'Super',
          lastName: 'Admin',
          email: 'admin@store.com',
          password: hashedPassword,
        },
      });

      const shop = await tx.shop.create({
        data: {
          name: 'Best Supermarket',
          address: '123 Main Street',
          phone: '+1-555-0100',
        },
      });

      await tx.staffMember.create({
        data: {
          userId: user.id,
          shopId: shop.id,
          role: 'ADMIN',
          isActive: true,
        },
      });

      return { user, shop };
    });

    console.log('✅ Super admin created successfully!');
    console.log('\nLogin credentials:');
    console.log('Email: admin@store.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
