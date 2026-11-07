# 🎓 FocusLab Backend - Gestión Académica

Backend de la aplicación FocusLab, una plataforma de gestión académica que permite administrar períodos, materias y recursos educativos de forma segura, escalable y siguiendo buenas prácticas de arquitectura de software.

---

## 🚀 Despliegue en Producción

- **URL Base de la API:** https://gestion-academica-back-cgg8.onrender.com
- **Health Check:** https://gestion-academica-back-cgg8.onrender.com/api/health

---

## 🛠️ Tecnologías

- **Runtime:** Node.js
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **ORM:** Prisma
- **Base de Datos:** PostgreSQL (Neon)
- **Almacenamiento:** Supabase Storage (Compatible con protocolo S3)
- **Seguridad:** JSON Web Tokens (JWT) y BCrypt

---

## 📦 Instalación y Ejecución Local

Sigue estos pasos para levantar el proyecto en tu entorno de desarrollo:

```bash
# 1. Clonar el repositorio
git clone https://github.com/MarioFer299/Gestion-academica-Back.git
cd Gestion-academica-Back

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# ⚠️ Edita el archivo .env con tus credenciales reales

# 4. Generar el cliente de Prisma
npx prisma generate

# 5. Sincronizar el esquema con la base de datos
npx prisma db push

# 6. Poblar la base de datos con datos de prueba (Admin y User)
npm run prisma:seed

# 7. Iniciar el servidor en modo desarrollo
npm run dev

## 🏗️ Arquitectura

El backend sigue estrictamente una **arquitectura de 4 capas** para garantizar la mantenibilidad, la separación de responsabilidades y el cumplimiento de los principios SOLID:

```text
src/
├── domain/          → Modelos de negocio e interfaces de repositorios (sin dependencias externas).
├── application/     → Casos de uso (reglas de negocio puras y validaciones).
├── infrastructure/  → Implementaciones concretas (Prisma ORM, Supabase S3, JWT, BCrypt).
└── interface/       → Controladores, routers y middlewares de Express (capa de presentación).