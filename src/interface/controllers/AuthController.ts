import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/use-cases/LoginUserUseCase';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { prisma } from '../../infrastructure/database/prismaClient';

// Inicializamos con Prisma real
const userRepository = new PrismaUserRepository(prisma);
const registerUseCase = new RegisterUserUseCase(userRepository);
const loginUseCase = new LoginUserUseCase(userRepository, process.env.JWT_SECRET || 'secret_temporal');

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, fullName } = req.body;
      
      if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      const user = await registerUseCase.execute({ email, password, fullName });
      return res.status(201).json(user);
    } catch (error: any) {
      if (error.message.includes('CONFLICT')) {
        return res.status(409).json({ error: error.message });
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
      if (error.message.includes('UNAUTHORIZED')) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      next(error);
    }
  }
}

export const authController = new AuthController();