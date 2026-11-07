import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { prisma } from '../../infrastructure/database/prismaClient';

// Importar repositorio y casos de uso
import { PrismaSubjectRepository } from '../../infrastructure/repositories/PrismaSubjectRepository';
import { GetSubjectsUseCase } from '../../application/use-cases/GetSubjectsUseCase';
import { CreateSubjectUseCase } from '../../application/use-cases/CreateSubjectUseCase';
import { GetSubjectByIdUseCase } from '../../application/use-cases/GetSubjectByIdUseCase';
import { UpdateSubjectUseCase } from '../../application/use-cases/UpdateSubjectUseCase';
import { SoftDeleteSubjectUseCase } from '../../application/use-cases/SoftDeleteSubjectUseCase';

// Instanciar dependencias
const subjectRepository = new PrismaSubjectRepository(prisma);
const getSubjectsUseCase = new GetSubjectsUseCase(subjectRepository);
const createSubjectUseCase = new CreateSubjectUseCase(subjectRepository);
const getByIdSubjectUseCase = new GetSubjectByIdUseCase(subjectRepository);
const updateSubjectUseCase = new UpdateSubjectUseCase(subjectRepository);
const deleteSubjectUseCase = new SoftDeleteSubjectUseCase(subjectRepository);

export class SubjectController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { page = '1', limit = '10', search } = req.query;

      const result = await getSubjectsUseCase.execute(
        userId,
        parseInt(page as string),
        parseInt(limit as string),
        search as string
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const subject = await getByIdSubjectUseCase.execute(id, userId);
      return res.status(200).json(subject);
    } catch (error: any) {
      if (error.message.includes('NOT_FOUND')) {
        return res.status(404).json({ error: error.message.replace('NOT_FOUND: ', '') });
      }
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id; // ✅ Viene del JWT, no del body
      const { name, academicPeriodId, description } = req.body;

      if (!name || !academicPeriodId) {
        return res.status(400).json({ error: 'Nombre e ID del período académico son requeridos' });
      }

      const newSubject = await createSubjectUseCase.execute(
        { name, academicPeriodId, description },
        userId
      );

      return res.status(201).json(newSubject);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { name, academicPeriodId, description } = req.body;

      const updatedSubject = await updateSubjectUseCase.execute(
        id,
        { name, academicPeriodId, description },
        userId
      );

      return res.status(200).json(updatedSubject);
    } catch (error: any) {
      if (error.message.includes('NOT_FOUND')) {
        return res.status(404).json({ error: error.message.replace('NOT_FOUND: ', '') });
      }
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      await deleteSubjectUseCase.execute(id, userId);
      return res.status(200).json({ message: 'Materia eliminada lógicamente con éxito' });
    } catch (error: any) {
      if (error.message.includes('NOT_FOUND')) {
        return res.status(404).json({ error: error.message.replace('NOT_FOUND: ', '') });
      }
      next(error);
    }
  }
}

export const subjectController = new SubjectController();