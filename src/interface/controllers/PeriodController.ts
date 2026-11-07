import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';

export class PeriodController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    res.status(501).json({ message: 'Endpoint de Períodos en construcción (Fase B)' });
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    res.status(501).json({ message: 'Endpoint de Períodos en construcción (Fase B)' });
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    res.status(501).json({ message: 'Endpoint de Períodos en construcción (Fase B)' });
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    res.status(501).json({ message: 'Endpoint de Períodos en construcción (Fase B)' });
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    res.status(501).json({ message: 'Endpoint de Períodos en construcción (Fase B)' });
  }
}

// Exportamos la instancia para que el router la use
export const periodController = new PeriodController();