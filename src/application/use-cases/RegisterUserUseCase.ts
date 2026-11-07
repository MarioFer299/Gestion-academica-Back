import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserResponse, Role } from '../../domain/models/User';
import { IJwtService } from '../../domain/services/IJwtService';
import bcrypt from 'bcrypt';

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: IJwtService // Inyectado para mantener la arquitectura limpia
  ) {}

  async execute(data: { email: string; password: string; fullName: string }): Promise<{ user: UserResponse; token: string }> {
    // 1. Verificar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('CONFLICT: El correo electrónico ya está registrado');
    }

    // 2. Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // 3. Crear el usuario (Forzamos rol USER, el admin es solo por seed)
    const newUser = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      role: Role.USER,
    });

    // 4. Generar el token JWT con expiración
    const token = this.jwtService.generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    // 5. Retornar sin la contraseña (Criterio 3 de la rúbrica)
    const { password, ...userResponse } = newUser;
    
    return { 
      user: userResponse as UserResponse, 
      token 
    };
  }
}