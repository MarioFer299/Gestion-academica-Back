import 'dotenv/config'; // <-- ESTA LÍNEA ES LA CLAVE: Carga las variables del .env
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed seguro...');

  // Hashear contraseñas
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const userPassword = await bcrypt.hash('User123!', 10);

  // Crear o actualizar usuario ADMIN (upsert = insertar si no existe, actualizar si existe)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@focuslab.com' },
    update: {
      fullName: 'Administrador FocusLab',
      password: adminPassword,
      role: 'ADMIN'
    },
    create: {
      email: 'admin@focuslab.com',
      fullName: 'Administrador FocusLab',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  // Crear o actualizar usuario USER
  const user = await prisma.user.upsert({
    where: { email: 'user@focuslab.com' },
    update: {
      fullName: 'Usuario Estudiante',
      password: userPassword,
      role: 'USER'
    },
    create: {
      email: 'user@focuslab.com',
      fullName: 'Usuario Estudiante',
      password: userPassword,
      role: 'USER'
    }
  });

  console.log('✅ Seed completado exitosamente');
  console.log('📧 Credenciales de prueba:');
  console.log('   ADMIN:', admin.email, '/ Admin123!');
  console.log('   USER:', user.email, '/ User123!');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });