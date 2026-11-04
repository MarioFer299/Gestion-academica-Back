const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Creando Periodo Académico...');
  const period = await prisma.academicPeriod.create({
    data: {
      name: '2024-1',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30'),
      userId: '839a18a8-66df-4a75-b1f2-b8bb5f8bbba5' // ID de tu usuario Admin
    }
  });
  console.log('✅ Periodo creado con ID:', period.id);

  console.log('🔄 Creando Materia asociada al periodo...');
  const subject = await prisma.subject.create({
    data: {
      name: 'Matemáticas Avanzadas',
      academicPeriodId: period.id
    }
  });
  
  console.log('=========================================================');
  console.log('🎉 ¡ÉXITO! Materia creada.');
  console.log('📋 COPIA ESTE ID PARA PROBAR EL BORRADO:');
  console.log(subject.id);
  console.log('=========================================================');
}

main()
  .catch((e) => console.error('❌ Error:', e))
  .finally(async () => await prisma.$disconnect());