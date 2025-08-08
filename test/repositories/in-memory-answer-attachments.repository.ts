import type { AnswerAttachment } from '@entities/answer-attachment.entity';
import type { AnswerAttachmentsRepository } from '@repositories/answer-attachments.repository';

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  public items: AnswerAttachment[] = [];

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    return this.items.filter((item) => item.answerId.toString() === answerId);
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    this.items = this.items.filter((item) => item.answerId.toString() !== answerId);
  }
}
