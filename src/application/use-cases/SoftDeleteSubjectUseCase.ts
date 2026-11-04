import { ISubjectRepository } from '../../domain/repositories/ISubjectRepository';

export class SoftDeleteSubjectUseCase {
  constructor(private subjectRepository: ISubjectRepository) {}

  async execute(id: string) {
    const subject = await this.subjectRepository.softDelete(id);
    if (!subject) {
      throw new Error('Materia no encontrada o ya eliminada');
    }
    return subject;
  }
}