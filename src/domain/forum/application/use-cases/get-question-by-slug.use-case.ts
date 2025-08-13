import { type Either, failure, success } from '@core/either';
import { ResourceNotFoundError } from '@core/errors/resource-not-found.error';
import type { Question } from '@forum/entities/question.entity';
import type { QuestionsRepository } from '@forum/repositories/questions.repository';

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
