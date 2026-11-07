import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';

export class SubjectController {
  // Ajusta los tipos de los casos de uso a los que tú tengas creados
  constructor(private getSubjectsUseCase: any, private manageSubjectUseCase: any) {}

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { page = '1', limit = '10', search } = req.query;

      const result = await this.getSubjectsUseCase.execute({
        userId,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        search: search as string
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const subject = await this.getSubjectsUseCase.getById(id, userId);
      return res.status(200).json(subject);
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { name, academicPeriodId, description } = req.body;

      const newSubject = await this.manageSubjectUseCase.create({
        name,
        academicPeriodId,
        description
      }, userId);

      return res.status(201).json(newSubject);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const data = req.body;

      const updated = await this.manageSubjectUseCase.update(id, data, userId);
      return res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      await this.manageSubjectUseCase.delete(id, userId);
      return res.status(200).json({ message: 'Materia eliminada lógicamente' });
    } catch (error) {
      next(error);
    }
  }
}

export const subjectController = new SubjectController(null as any, null as any);