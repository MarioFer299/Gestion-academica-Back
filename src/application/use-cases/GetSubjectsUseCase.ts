import { ISubjectRepository } from '../../domain/repositories/ISubjectRepository';

export class GetSubjectsUseCase {
  constructor(private subjectRepository: ISubjectRepository) {}

  async execute(page: number = 1, limit: number = 10, search?: string) {
    // Validaciones básicas
    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 10;

    return await this.subjectRepository.findAll(page, limit, search);
  }
}