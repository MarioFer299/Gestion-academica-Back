import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // Limpiar tablas existentes (orden importa por las relaciones)
  await prisma.resource.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.academicPeriod.deleteMany();
  await prisma.user.deleteMany();
  console.log('🗑️  Tablas limpiadas');

  // Crear contraseñas hasheadas
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const userPassword = await bcrypt.hash('User123!', 10);

  // Crear Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@focuslab.com',
      password: adminPassword,
      fullName: 'Administrador FocusLab',
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin creado: ${admin.email} / Contraseña: Admin123!`);

  // Crear User
  const user = await prisma.user.create({
    data: {
      email: 'user@focuslab.com',
      password: userPassword,
      fullName: 'Usuario Estudiante',
      role: Role.USER,
    },
  });
  console.log(`✅ User creado: ${user.email} / Contraseña: User123!`);

  console.log('🎉 Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });