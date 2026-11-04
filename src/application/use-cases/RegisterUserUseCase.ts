import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, UserResponse, Role } from '../../domain/models/User';
import bcrypt from 'bcrypt';

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: { email: string; password: string; fullName: string }): Promise<UserResponse> {
    // 1. Verificar si el email ya existe (Regla de negocio)
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('CONFLICT: El correo electrónico ya está registrado'); // El middleware atrapará esto y devolverá 409
    }

    // 2. Hashear la contraseña (Regla de seguridad)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // 3. Crear el usuario
    const newUser = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      role: Role.USER, // Por defecto es USER. El ADMIN se crea por seed.
    });

    // 4. Retornar sin la contraseña (Criterio 3 de la rúbrica)
    const { password, ...userResponse } = newUser;
    return userResponse as UserResponse;
  }
}