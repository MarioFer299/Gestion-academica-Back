import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/use-cases/LoginUserUseCase';
import { MockUserRepository } from '../../infrastructure/repositories/MockUserRepository';

// Inicializamos las dependencias (Inyección de dependencias manual)
const userRepository = new MockUserRepository();
const registerUseCase = new RegisterUserUseCase(userRepository);
const loginUseCase = new LoginUserUseCase(userRepository, process.env.JWT_SECRET || 'secret_temporal');

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, fullName } = req.body;
      
      // Validación básica (luego la haremos con Zod)
      if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      const user = await registerUseCase.execute({ email, password, fullName });
      return res.status(201).json(user); // 201 Created
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
      return res.status(200).json(result); // 200 OK con user y token
    } catch (error: any) {
      if (error.message.includes('UNAUTHORIZED')) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      next(error);
    }
  }
}

export const authController = new AuthController();