# 🎓 FocusLab Backend - Gestión Académica

Backend de la aplicación FocusLab, una plataforma de gestión académica que permite administrar períodos, materias y recursos educativos.

## 🚀 Despliegue

- **API en producción:** [TU_URL_DE_RENDER]/api
- **Health Check:** [TU_URL_DE_RENDER]/api/health

## 🛠️ Tecnologías

- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- Supabase Storage (S3)
- JWT para autenticación

## 📦 Instalación y ejecución local

```bash
# 1. Clonar el repositorio
git clone https://github.com/MarioFer299/Gestion-academica-Back.git
cd Gestion-academica-Back

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales reales

# 4. Generar cliente de Prisma
npx prisma generate

# 5. Ejecutar migraciones (si aplica)
npx prisma db push

# 6. Poblar la base de datos con datos de prueba
npm run prisma:seed

# 7. Iniciar en modo desarrollo
npm run dev