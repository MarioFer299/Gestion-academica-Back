import { ISubjectRepository } from '../../domain/repositories/ISubjectRepository';

export class GetSubjectByIdUseCase {
  constructor(private subjectRepository: ISubjectRepository) {}

  async execute(id: string, userId: string) {
    const subject = await this.subjectRepository.findById(id, userId);
    if (!subject) {
      throw new Error('NOT_FOUND: Materia no encontrada o no tienes permiso para verla');
    }
    return subject;
  }
}