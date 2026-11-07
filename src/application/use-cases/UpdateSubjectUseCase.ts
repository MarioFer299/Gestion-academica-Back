import { ISubjectRepository } from '../../domain/repositories/ISubjectRepository';

export class UpdateSubjectUseCase {
  constructor(private subjectRepository: ISubjectRepository) {}

  async execute(id: string, data: any, userId: string) {
    // El repositorio ya se encarga de verificar que la materia pertenezca al userId
    const updated = await this.subjectRepository.update(id, data, userId);
    if (!updated) {
      throw new Error('NOT_FOUND: Materia no encontrada o no tienes permiso para editarla');
    }
    return updated;
  }
}