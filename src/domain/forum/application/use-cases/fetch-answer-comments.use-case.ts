import { type Either, success } from '@core/either';
import type { AnswerComment } from '@entities/answer-comment.entity';
import type { AnswerCommentsRepository } from '@repositories/answer-comments.repository';

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string;
  page: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<null, { answerComments: AnswerComment[] }>;

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({ answerId, page }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, { page });
    return success({ answerComments });
  }
}
