import { IAcademicPeriodRepository } from '../../domain/repositories/IAcademicPeriodRepository';

export class GetAcademicPeriodByIdUseCase {
  constructor(private periodRepository: IAcademicPeriodRepository) {}

  async execute(id: string, userId: string) {
    const period = await this.periodRepository.findById(id, userId);
    if (!period) {
      throw new Error('NOT_FOUND: Período académico no encontrado o no tienes permiso');
    }
    return period;
  }
}