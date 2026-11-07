import { PrismaClient, Prisma } from '@prisma/client';
import { ISubjectRepository } from '../../domain/repositories/ISubjectRepository';
import { Subject } from '../../domain/models/Subject'; // Ajusta la ruta si tu modelo se llama diferente

export class PrismaSubjectRepository implements ISubjectRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(userId: string, page: number, limit: number, search?: string): Promise<{ data: Subject[]; pagination: any }> {
    const where: Prisma.SubjectWhereInput = {
      deletedAt: null,
      period: {
        userId: userId // Asegura que solo vea materias de sus períodos
      },
      ...(search ? { name: { contains: search, mode: Prisma.QueryMode.insensitive } } : {})
    };

    const [subjects, total] = await Promise.all([
      this.prisma.subject.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { period: true }
      }),
      this.prisma.subject.count({ where })
    ]);

    return {
      data: subjects as unknown as Subject[],
      pagination: {
        total,
        currentPage: page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id: string, userId: string): Promise<Subject | null> {
    return this.prisma.subject.findFirst({
      where: { 
        id, 
        deletedAt: null,
        period: { userId }
      },
      include: { period: true }
    }) as unknown as Promise<Subject | null>;
  }

  async create(data: any, userId: string): Promise<Subject> {

    return this.prisma.subject.create({ data }) as unknown as Subject;
  }

  async update(id: string, data: any, userId: string): Promise<Subject> {
    return this.prisma.subject.update({
      where: { id },
      data
    }) as unknown as Subject;
  }

  async delete(id: string, userId: string): Promise<Subject> {
    return this.prisma.subject.update({
      where: { id },
      data: { deletedAt: new Date() }
    }) as unknown as Subject;
  }
}