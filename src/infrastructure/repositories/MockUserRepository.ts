import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, Role } from '../../domain/models/User';

// Base de datos en memoria temporal (se reinicia al detener el servidor)
const mockUsers: User[] = [];

export class MockUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return mockUsers.find(u => u.email === email) || null;
  }

  async findById(id: string): Promise<User | null> {
    return mockUsers.find(u => u.id === id) || null;
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser: User = {
      ...data,
      id: crypto.randomUUID(), // Genera un ID único
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsers.push(newUser);
    return newUser;
  }
}