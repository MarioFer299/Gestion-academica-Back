import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/use-cases/LoginUserUseCase';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { JwtService } from '../../infrastructure/services/JwtService';
import { prisma } from '../../infrastructure/database/prismaClient';

// 1. VALIDACIÓN CRÍTICA: Sin JWT_SECRET, el servidor no debe arrancar.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL ERROR: La variable de entorno JWT_SECRET es obligatoria. Revisa tu archivo .env');
}

// 2. Inicialización de dependencias (Inyección limpia)
const userRepository = new PrismaUserRepository(prisma);
const jwtService = new JwtService(JWT_SECRET);

const registerUseCase = new RegisterUserUseCase(userRepository, jwtService);
// NOTA: Asegúrate de que tu LoginUserUseCase también reciba jwtService en su constructor
const loginUseCase = new LoginUserUseCase(userRepository, jwtService);

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, fullName } = req.body;
      
      if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Faltan campos requeridos: email, password, fullName' });
      }

      // Ahora devuelve { user, token }
      const result = await registerUseCase.execute({ email, password, fullName });
      
      return res.status(201).json(result);
    } catch (error: any) {
      if (error.message.includes('CONFLICT')) {
        return res.status(409).json({ error: 'El correo electrónico ya está registrado' });
      }
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }

      const result = await loginUseCase.execute(email, password);
      return res.status(200).json(result);
    } catch (error: any) {
      // Mensaje genérico por seguridad (no revela si falló email o password)
      if (error.message.includes('UNAUTHORIZED') || error.message.includes('Credenciales')) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      next(error);
    }
  }
}

export const authController = new AuthController();