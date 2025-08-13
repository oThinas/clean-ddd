import { type Either, success } from '@core/either';
import type { Question } from '@forum/entities/question.entity';
import type { QuestionsRepository } from '@forum/repositories/questions.repository';

interface FetchRecentQuestionsUseCaseRequest {
  page: number;
}

type FetchRecentQuestionsUseCaseResponse = Either<null, { questions: Question[] }>;

export class FetchRecentQuestionsUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({ page }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page });
    return success({ questions });
  }
}
