import type { QuestionsRepository } from '@repositories/questions.repository';
import type { Question } from '@entities/question.entity';

interface GetQuestionBySlugUseCaseRequest {
  slug: string;
}

interface GetQuestionBySlugUseCaseResponse {
  question: Question;
}

export class GetQuestionBySlugUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({ slug }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug);
    if (!question) {
      throw new Error('Question not found');
    }

    return { question };
  }
}
