import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IJwtService } from '../../domain/services/IJwtService';
import bcrypt from 'bcrypt';

export class LoginUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: IJwtService // <-- Cambia esto
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('UNAUTHORIZED: Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('UNAUTHORIZED: Credenciales inválidas');
    }

    // Generar token con el nuevo servicio
    const token = this.jwtService.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}