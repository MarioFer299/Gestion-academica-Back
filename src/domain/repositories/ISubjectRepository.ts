import { Subject } from '../models/Subject';

export interface ISubjectRepository {
  findAll(page: number, limit: number, search?: string): Promise<{ data: Subject[], total: number }>;
  create(data: Omit<Subject, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Subject>;
  softDelete(id: string): Promise<Subject | null>;
}