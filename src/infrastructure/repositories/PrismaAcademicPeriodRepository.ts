import { PrismaClient, Prisma } from '@prisma/client';
import { IAcademicPeriodRepository } from '../../domain/repositories/IAcademicPeriodRepository';
import { AcademicPeriod } from '../../domain/models/AcademicPeriod';

export class PrismaAcademicPeriodRepository implements IAcademicPeriodRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(userId: string, page: number, limit: number) {
    const where: Prisma.AcademicPeriodWhereInput = {
      userId,
      deletedAt: null
    };

    const [periods, total] = await Promise.all([
      this.prisma.academicPeriod.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.academicPeriod.count({ where })
    ]);

    return {
      data: periods as unknown as AcademicPeriod[],
      pagination: {
        total,
        currentPage: page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id: string, userId: string) {
    return this.prisma.academicPeriod.findFirst({
      where: { id, userId, deletedAt: null }
    }) as unknown as AcademicPeriod | null;
  }

  async create(data: any, userId: string) {
    return this.prisma.academicPeriod.create({
      data: { ...data, userId }
    }) as unknown as AcademicPeriod;
  }

  async update(id: string, data: any, userId: string) {
    return this.prisma.academicPeriod.update({
      where: { id, userId, deletedAt: null },
      data
    }) as unknown as AcademicPeriod;
  }

  async delete(id: string, userId: string) {
    return this.prisma.academicPeriod.update({
      where: { id, userId, deletedAt: null },
      data: { deletedAt: new Date() }
    }) as unknown as AcademicPeriod;
  }
}