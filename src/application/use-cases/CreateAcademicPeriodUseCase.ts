import { IAcademicPeriodRepository } from '../../domain/repositories/IAcademicPeriodRepository';

export class CreateAcademicPeriodUseCase {
  constructor(private periodRepository: IAcademicPeriodRepository) {}

  async execute(data: { name: string; startDate: string | Date; endDate: string | Date }, userId: string) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (start >= end) {
      throw new Error('VALIDATION_ERROR: La fecha de inicio debe ser anterior a la fecha de fin');
    }

    return await this.periodRepository.create(
      { name: data.name, startDate: start, endDate: end } as any,
      userId
    );
  }
}