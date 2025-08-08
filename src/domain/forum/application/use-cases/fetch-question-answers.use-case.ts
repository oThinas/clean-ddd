import { type Either, success } from '@core/either';
import type { Answer } from '@entities/answer.entity';
import type { AnswersRepository } from '@repositories/answers.repository';

interface FetchQuestionAnswersUseCaseRequest {
  questionId: string;
  page: number;
}

type FetchQuestionAnswersUseCaseResponse = Either<null, { answers: Answer[] }>;

export class FetchQuestionAnswersUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(questionId, { page });
    return success({ answers });
  }
}
