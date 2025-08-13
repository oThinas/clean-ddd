import type { PaginationParams } from '@core/repositories/pagination-params.repository';
import type { QuestionComment } from '@forum/entities/question-comment.entity';

export abstract class QuestionCommentsRepository {
  abstract findById(id: string): Promise<QuestionComment | null>;
  abstract findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<QuestionComment[]>;
  abstract create(questionComment: QuestionComment): Promise<void>;
  abstract delete(questionComment: QuestionComment): Promise<void>;
}
