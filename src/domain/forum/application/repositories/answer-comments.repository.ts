import type { PaginationParams } from '@core/repositories/pagination-params.repository';
import type { AnswerComment } from '@entities/answer-comment.entity';

export abstract class AnswerCommentsRepository {
  abstract findById(id: string): Promise<AnswerComment | null>;
  abstract findManyByAnswerId(answerId: string, { page }: PaginationParams): Promise<AnswerComment[]>;
  abstract create(answerComment: AnswerComment): Promise<void>;
  abstract delete(answerComment: AnswerComment): Promise<void>;
}
