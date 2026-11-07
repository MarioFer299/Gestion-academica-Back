import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { prisma } from '../../infrastructure/database/prismaClient';

// Importar repositorio y casos de uso
import { PrismaAcademicPeriodRepository } from '../../infrastructure/repositories/PrismaAcademicPeriodRepository';
import { CreateAcademicPeriodUseCase } from '../../application/use-cases/CreateAcademicPeriodUseCase';
import { GetAllAcademicPeriodsUseCase } from '../../application/use-cases/GetAllAcademicPeriodsUseCase';
import { GetAcademicPeriodByIdUseCase } from '../../application/use-cases/GetAcademicPeriodByIdUseCase';
import { UpdateAcademicPeriodUseCase } from '../../application/use-cases/UpdateAcademicPeriodUseCase';
import { SoftDeleteAcademicPeriodUseCase } from '../../application/use-cases/SoftDeleteAcademicPeriodUseCase';

// Instanciar dependencias (Inyección manual)
const periodRepository = new PrismaAcademicPeriodRepository(prisma);
const createPeriodUseCase = new CreateAcademicPeriodUseCase(periodRepository);
const getAllPeriodsUseCase = new GetAllAcademicPeriodsUseCase(periodRepository);
const getPeriodByIdUseCase = new GetAcademicPeriodByIdUseCase(periodRepository);
const updatePeriodUseCase = new UpdateAcademicPeriodUseCase(periodRepository);
const deletePeriodUseCase = new SoftDeleteAcademicPeriodUseCase(periodRepository);

export class PeriodController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { page = '1', limit = '10' } = req.query;

      const result = await getAllPeriodsUseCase.execute(
        userId,
        parseInt(page as string),
        parseInt(limit as string)
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

      const period = await getPeriodByIdUseCase.execute(id, userId);
      return res.status(200).json(period);
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id; // ✅ Viene del JWT, no del body
      const { name, startDate, endDate } = req.body;

      if (!name || !startDate || !endDate) {
        return res.status(400).json({ error: 'Nombre, fecha de inicio y fecha de fin son requeridos' });
      }

      const newPeriod = await createPeriodUseCase.execute({ name, startDate, endDate }, userId);
      return res.status(201).json(newPeriod);
    } catch (error: any) {
      if (error.message.includes('VALIDATION_ERROR')) {
        return res.status(400).json({ error: error.message.replace('VALIDATION_ERROR: ', '') });
      }
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { name, startDate, endDate } = req.body;

      const updatedPeriod = await updatePeriodUseCase.execute(id, { name, startDate, endDate }, userId);
      return res.status(200).json(updatedPeriod);
    } catch (error: any) {
      if (error.message.includes('VALIDATION_ERROR') || error.message.includes('NOT_FOUND')) {
        const status = error.message.includes('NOT_FOUND') ? 404 : 400;
        const msg = error.message.includes('NOT_FOUND') 
          ? error.message.replace('NOT_FOUND: ', '') 
          : error.message.replace('VALIDATION_ERROR: ', '');
        return res.status(status).json({ error: msg });
      }
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      await deletePeriodUseCase.execute(id, userId);
      return res.status(200).json({ message: 'Período eliminado lógicamente con éxito' });
    } catch (error: any) {
      if (error.message.includes('NOT_FOUND')) {
        return res.status(404).json({ error: error.message.replace('NOT_FOUND: ', '') });
      }
      next(error);
    }
  }
}

export const periodController = new PeriodController();