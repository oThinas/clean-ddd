import type { PaginationParams } from '@core/repositories/pagination-params.repository';
import type { Question } from '@forum/entities/question.entity';

export abstract class QuestionsRepository {
  abstract create(question: Question): Promise<void>;
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findById(id: string): Promise<Question | null>;
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>;
  abstract delete(question: Question): Promise<void>;
  abstract save(question: Question): Promise<void>;
}
