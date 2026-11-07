import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 1. Importar routers
import authRouter from './routers/authRouter';
import subjectRouter from './routers/subjectRouter';
import resourceRouter from './routers/resourceRouter';
import periodRouter from './routers/periodRouter'; // <-- Listo para la Fase B

dotenv.config();

const app = express();

// 2. Middlewares globales
// Configuración segura de CORS (permite tu frontend local y el desplegado)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000' // Fallback para desarrollo local
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como Postman o móviles) y las de allowedOrigins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// 3. Ruta de prueba (Health Check) - Obligatorio para despliegue en Render/Railway
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'FocusLab Backend is running 🚀',
    timestamp: new Date().toISOString()
  });
});

// 4. Montar los routers de la API
app.use('/api/auth', authRouter);
app.use('/api/subjects', subjectRouter);
app.use('/api/resources', resourceRouter);
app.use('/api/periods', periodRouter); // <-- Activo para la Fase B

// 5. Manejador de errores global (Criterio 5 de la rúbrica)
// Debe ir AL FINAL, después de todas las rutas
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error capturado:', err.message);

  // Errores conocidos de validación o negocio (ej: los que lanzamos con 'throw new Error')
  if (err.message.includes('CONFLICT')) {
    return res.status(409).json({ error: err.message.replace('CONFLICT: ', '') });
  }
  
  if (err.message.includes('UNAUTHORIZED') || err.message.includes('No autenticado')) {
    return res.status(401).json({ error: err.message });
  }

  if (err.message.includes('Prohibido') || err.message.includes('No tienes permisos')) {
    return res.status(403).json({ error: err.message });
  }

  // Errores de Prisma (ej: registro duplicado, relación no encontrada)
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'El recurso ya existe o hay un conflicto de datos únicos' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'El recurso solicitado no fue encontrado' });
  }

  // Fallback para errores inesperados (500)
  // NUNCA exponer el stack trace en producción (Criterio 5)
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(err.status || 500).json({
    error: isProduction ? 'Error interno del servidor' : err.message,
    // Solo en desarrollo mostramos el stack para facilitar la depuración local
    stack: isProduction ? undefined : err.stack 
  });
});

// 6. Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export default app;