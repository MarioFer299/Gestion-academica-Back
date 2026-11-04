import { Request, Response, NextFunction } from 'express';
import { GetSubjectsUseCase } from '../../application/use-cases/GetSubjectsUseCase';
import { CreateSubjectUseCase } from '../../application/use-cases/CreateSubjectUseCase';
import { SoftDeleteSubjectUseCase } from '../../application/use-cases/SoftDeleteSubjectUseCase';
import { PrismaSubjectRepository } from '../../infrastructure/repositories/PrismaSubjectRepository';
import { prisma } from '../../infrastructure/database/prismaClient';

const subjectRepository = new PrismaSubjectRepository(prisma);
const getSubjectsUseCase = new GetSubjectsUseCase(subjectRepository);
const createSubjectUseCase = new CreateSubjectUseCase(subjectRepository);
const softDeleteSubjectUseCase = new SoftDeleteSubjectUseCase(subjectRepository);

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

  async createSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, academicPeriodId } = req.body;

      if (!name || !academicPeriodId) {
        return res.status(400).json({ error: 'Nombre y periodo académico son requeridos' });
      }

      const subject = await createSubjectUseCase.execute({ name, academicPeriodId });
      return res.status(201).json({ success: true, data: subject });
    } catch (error: any) {
      next(error);
    }
  }

  async deleteSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const subject = await softDeleteSubjectUseCase.execute(id);
      return res.status(200).json({ success: true, message: 'Materia eliminada lógicamente', data: subject });
    } catch (error: any) {
      if (error.message.includes('no encontrada')) {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }
}

export const subjectController = new SubjectController();