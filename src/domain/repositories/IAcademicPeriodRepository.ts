import { AcademicPeriod } from '../models/AcademicPeriod';

export interface IAcademicPeriodRepository {
  findAll(userId: string, page: number, limit: number): Promise<{ data: AcademicPeriod[]; pagination: any }>;
  findById(id: string, userId: string): Promise<AcademicPeriod | null>;
  create(data: Omit<AcademicPeriod, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>, userId: string): Promise<AcademicPeriod>;
  update(id: string, data: Partial<AcademicPeriod>, userId: string): Promise<AcademicPeriod>;
  delete(id: string, userId: string): Promise<AcademicPeriod>;
}