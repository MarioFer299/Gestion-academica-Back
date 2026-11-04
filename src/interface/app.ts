import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routers/authRouter'; // <-- 1. Importar el router

dotenv.config();

const app = express();

// Middlewares globales
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', 
    credentials: true
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Ruta de prueba (Health Check)
app.get('/api/health', (req, res) => {
    res.status(200).json({
        message: 'FocusLab Backend is running 🚀',
        timestamp: new Date().toISOString()
    });
});

// 2. Montar los routers de la API
app.use('/api/auth', authRouter); 

export default app;