import { IAcademicPeriodRepository } from '../../domain/repositories/IAcademicPeriodRepository';

export class GetAllAcademicPeriodsUseCase {
  constructor(private periodRepository: IAcademicPeriodRepository) {}

  async execute(userId: string, page: number = 1, limit: number = 10) {
    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 10;

    return await this.periodRepository.findAll(userId, page, limit);
  }
}