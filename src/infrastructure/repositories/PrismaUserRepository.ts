import { PrismaClient, User as PrismaUser, Role } from '@prisma/client';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/models/User';

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? this.mapToDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? this.mapToDomain(user) : null;
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        role: data.role as Role,
      },
    });
    return this.mapToDomain(user);
  }

  private mapToDomain(prismaUser: PrismaUser): User {
    return {
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      fullName: prismaUser.fullName,
      role: prismaUser.role as any,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt
      // ✅ deletedAt eliminado - no existe en el modelo User del dominio
    };
  }
}