import { PrismaClient, Subject as PrismaSubject } from '@prisma/client';
import { ISubjectRepository } from '../../domain/repositories/ISubjectRepository';
import { Subject } from '../../domain/models/Subject';

export class PrismaSubjectRepository implements ISubjectRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(page: number, limit: number, search?: string): Promise<{ data: Subject[], total: number }> {
    const skip = (page - 1) * limit;
    
    const where = search ? {
      name: { contains: search, mode: 'insensitive' },
      deletedAt: null 
    } : { deletedAt: null };

    const [data, total] = await Promise.all([
      this.prisma.subject.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.subject.count({ where })
    ]);

    return { 
      data: data.map(this.mapToDomain), 
      total 
    };
  }

  async create(data: Omit<Subject, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Subject> {
    const subject = await this.prisma.subject.create({
      data: { ...data, deletedAt: null }
    });
    return this.mapToDomain(subject);
  }

  async softDelete(id: string): Promise<Subject | null> {
    const subject = await this.prisma.subject.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    return this.mapToDomain(subject);
  }

  private mapToDomain(prismaSubject: PrismaSubject): Subject {
    return {
      id: prismaSubject.id,
      name: prismaSubject.name,
      description: prismaSubject.description || undefined,
      academicPeriodId: prismaSubject.academicPeriodId,
      deletedAt: prismaSubject.deletedAt,
      createdAt: prismaSubject.createdAt,
      updatedAt: prismaSubject.updatedAt,
    };
  }
}