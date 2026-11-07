import { ISubjectRepository } from '../../domain/repositories/ISubjectRepository';
import { Subject } from '../../domain/models/Subject';

export class CreateSubjectUseCase {
  constructor(private subjectRepository: ISubjectRepository) {}

  async execute(data: any, userId: string) {
    return await this.subjectRepository.create(data, userId);
  }
}