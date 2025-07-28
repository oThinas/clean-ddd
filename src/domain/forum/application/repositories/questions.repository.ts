import type { Question } from '@/domain/forum/enterprise/entities/question.entity';

export abstract class QuestionsRepository {
  abstract create(question: Question): Promise<void>;
  abstract findBySlug(slug: string): Promise<Question | null>;
}
