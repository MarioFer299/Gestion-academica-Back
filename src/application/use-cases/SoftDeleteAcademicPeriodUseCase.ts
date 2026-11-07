import { IAcademicPeriodRepository } from '../../domain/repositories/IAcademicPeriodRepository';

export class SoftDeleteAcademicPeriodUseCase {
  constructor(private periodRepository: IAcademicPeriodRepository) {}

  async execute(id: string, userId: string) {
    const deleted = await this.periodRepository.delete(id, userId);
    if (!deleted) {
      throw new Error('NOT_FOUND: Período no encontrado o ya fue eliminado');
    }
    return deleted;
  }
}