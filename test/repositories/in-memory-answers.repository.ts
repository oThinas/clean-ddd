import type { PaginationParams } from '@core/repositories/pagination-params.repository';
import type { Answer } from '@entities/answer.entity';
import type { AnswerAttachmentsRepository } from '@repositories/answer-attachments.repository';
import type { AnswersRepository } from '@repositories/answers.repository';

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(private readonly answerAttachmentsRepository: AnswerAttachmentsRepository) {}

  async create(answer: Answer): Promise<void> {
    this.items.push(answer);
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id);
    return answer ?? null;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<Answer[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }

  async delete(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex((item) => item.id.toString() === answer.id.toString());
    this.items.splice(answerIndex, 1);
    await this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
  }

  async save(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex((item) => item.id.toString() === answer.id.toString());
    this.items[answerIndex] = answer;
  }
}
