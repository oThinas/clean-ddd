import { UniqueEntityId } from '@/core/entities/unique-entity-id.entity';
import { Question } from '@/domain/forum/enterprise/entities/question.entity';
import type { QuestionsRepository } from '../repositories/questions.repository';

interface CreateQuestionUseCaseRequest {
  authorId: string;
  title: string;
  content: string;
}

interface CreateQuestionUseCaseResponse {
  question: Question;
}

export class CreateQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({ authorId, content, title }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({ title, content, authorId: new UniqueEntityId(authorId) });
    await this.questionsRepository.create(question);
    return { question };
  }
}
