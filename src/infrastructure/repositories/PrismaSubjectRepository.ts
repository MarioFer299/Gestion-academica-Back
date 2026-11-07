// src/infrastructure/repositories/PrismaSubjectRepository.ts
import { PrismaClient, Prisma } from '@prisma/client';
import { ISubjectRepository } from '../../domain/repositories/ISubjectRepository';

export class PrismaSubjectRepository implements ISubjectRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(userId: string, page: number, limit: number, search?: string) {
    const where: Prisma.SubjectWhereInput = {
      deletedAt: null,
      period: { userId: userId },
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
      data: subjects,
      pagination: {
        total,
        currentPage: page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id: string, userId: string) {
    return this.prisma.subject.findFirst({
      where: { id, deletedAt: null, period: { userId } },
      include: { period: true }
    });
  }

  async create(data: any, userId: string) {
    return this.prisma.subject.create({ data });
  }

  async update(id: string, data: any, userId: string) {
    return this.prisma.subject.update({ where: { id }, data });
  }

  async delete(id: string, userId: string) {
    return this.prisma.subject.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}