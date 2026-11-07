export interface ISubjectRepository {
  findAll(userId: string, page: number, limit: number, search?: string): Promise<{ data: any[]; pagination: any }>;
  findById(id: string, userId: string): Promise<any | null>;
  create(data: any, userId: string): Promise<any>;
  update(id: string, data: any, userId: string): Promise<any>;
  delete(id: string, userId: string): Promise<any>;
}