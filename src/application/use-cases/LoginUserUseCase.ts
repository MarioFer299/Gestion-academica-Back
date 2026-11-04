import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserResponse } from '../../domain/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class LoginUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtSecret: string
  ) {}

  async execute(email: string, password: string): Promise<{ user: UserResponse; token: string }> {
    // 1. Buscar usuario
    const user = await this.userRepository.findByEmail(email);
    
    // 2. Validar credenciales (Mensaje genérico por seguridad, Criterio 3)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('UNAUTHORIZED: Credenciales inválidas'); // El middleware devolverá 401
    }

    // 3. Generar JWT con expiración (Criterio 3)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      this.jwtSecret,
      { expiresIn: '7d' }
    );

    // 4. Retornar usuario (sin password) y token
    const { password: _, ...userResponse } = user;
    return {
      user: userResponse as UserResponse,
      token,
    };
  }
}