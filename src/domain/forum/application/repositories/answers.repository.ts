import type { Answer } from '@/domain/forum/enterprise/entities/answer.entity';

export abstract class AnswersRepository {
  abstract create(answer: Answer): Promise<void>;
}
