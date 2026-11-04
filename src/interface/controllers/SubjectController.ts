import { Request, Response, NextFunction } from 'express';
import { GetSubjectsUseCase } from '../../application/use-cases/GetSubjectsUseCase';
import { PrismaSubjectRepository } from '../../infrastructure/repositories/PrismaSubjectRepository';
import { prisma } from '../../infrastructure/database/prismaClient';

const subjectRepository = new PrismaSubjectRepository(prisma);
const getSubjectsUseCase = new GetSubjectsUseCase(subjectRepository);

export class SubjectController {
  async getSubjects(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;

      const result = await getSubjectsUseCase.execute(page, limit, search);

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export const subjectController = new SubjectController();