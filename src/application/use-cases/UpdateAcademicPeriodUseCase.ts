import { IAcademicPeriodRepository } from '../../domain/repositories/IAcademicPeriodRepository';

export class UpdateAcademicPeriodUseCase {
  constructor(private periodRepository: IAcademicPeriodRepository) {}

  async execute(id: string, data: { name?: string; startDate?: string | Date; endDate?: string | Date }, userId: string) {
    // Convertir strings a Date si es necesario
    const updateData: any = { ...data };
    
    if (data.startDate) {
      updateData.startDate = new Date(data.startDate);
    }
    
    if (data.endDate) {
      updateData.endDate = new Date(data.endDate);
    }

    if (updateData.startDate && updateData.endDate) {
      if (updateData.startDate >= updateData.endDate) {
        throw new Error('VALIDATION_ERROR: La fecha de inicio debe ser anterior a la fecha de fin');
      }
    }

    const updated = await this.periodRepository.update(id, updateData, userId);
    if (!updated) {
      throw new Error('NOT_FOUND: Período no encontrado o no tienes permiso');
    }
    return updated;
  }
}