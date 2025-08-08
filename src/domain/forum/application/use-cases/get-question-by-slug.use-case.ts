import { type Either, failure, success } from '@core/either';
import type { Question } from '@entities/question.entity';
import type { QuestionsRepository } from '@repositories/questions.repository';
import { ResourceNotFoundError } from '@use-cases/errors/resource-not-found.error';

interface GetQuestionBySlugUseCaseRequest {
  slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<ResourceNotFoundError, { question: Question }>;

export class GetQuestionBySlugUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({ slug }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug);
    if (!question) {
      return failure(new ResourceNotFoundError());
    }

    return success({ question });
  }
}
